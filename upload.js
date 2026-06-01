/**
 * Your Sticker — Upload Zone & Price Calculator
 * Cloudinary upload, drag-and-drop, mockup preview, pricing
 */
document.addEventListener('DOMContentLoaded', () => {

    // ── Cloudinary Config ──
    const CLOUDINARY_CLOUD_NAME = 'dznktn0es';
    const CLOUDINARY_UPLOAD_PRESET = 'your_sticker_preset';

    async function uploadToCloudinary(file) {
        const url = `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`;
        const fd = new FormData();
        fd.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
        fd.append('file', file);

        try {
            const response = await fetch(url, { method: 'POST', body: fd });
            const data = await response.json();
            if (data.secure_url) return data.secure_url;
            throw new Error(data.error?.message || 'Upload failed');
        } catch (err) {
            console.error("Cloudinary Error:", err);
            return null;
        }
    }

    // ── Sticky header ──
    const header = document.getElementById('header');
    if (header) {
        window.addEventListener('scroll', () => {
            header.classList.toggle('scrolled', window.scrollY > 30);
        });
    }

    // ── Scroll reveal observer (use app.js's global if exists) ──
    let ro = window.scrollRevealObserver;
    if (!ro) {
        ro = new IntersectionObserver(entries => {
            entries.forEach(e => {
                if (e.isIntersecting) { e.target.classList.add('visible'); ro.unobserve(e.target); }
            });
        }, { threshold: 0.1 });
        window.scrollRevealObserver = ro;
    }

    // ── Contact form ──
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async e => {
            e.preventDefault();
            const form = e.target;
            const btn = document.getElementById('submitBtn');

            btn.textContent = 'Envoi en cours...';

            try {
                const formData = new FormData(form);
                const fileInput = document.getElementById('fileInput');
                const imageUrls = [];

                if (fileInput && fileInput.files.length > 0) {
                    btn.textContent = 'Upload des images...';
                    for (let i = 0; i < fileInput.files.length; i++) {
                        const url = await uploadToCloudinary(fileInput.files[i]);
                        if (url) imageUrls.push(url);
                    }
                }

                if (imageUrls.length > 0) {
                    formData.append('liens_images', imageUrls.join('\n'));
                }

                btn.textContent = 'Envoi du message...';

                const response = await fetch(form.action, {
                    method: form.method,
                    body: formData
                });

                const result = await response.json();

                if (response.status === 200) {
                    btn.textContent = '✓ Message envoyé !';
                    btn.style.background = '#00D4AA';
                    btn.style.color = '#080808';
                    btn.style.borderColor = '#00D4AA';
                    setTimeout(() => {
                        btn.textContent = 'Envoyer →';
                        btn.style.cssText = '';
                        form.reset();
                        const fInput = document.getElementById('fileInput');
                        const pZone = document.getElementById('previewZone');
                        if (fInput) fInput.value = '';
                        if (pZone) pZone.innerHTML = '';
                    }, 3000);
                } else {
                    btn.textContent = result.message || 'Erreur. Réessayez.';
                    btn.style.background = '#ff4d4d';
                    console.error("Web3Forms Error:", result);
                    setTimeout(() => {
                        btn.textContent = 'Envoyer →';
                        btn.style.cssText = '';
                    }, 4000);
                }
            } catch (error) {
                btn.textContent = 'Erreur de connexion';
                console.error("Fetch error:", error);
                setTimeout(() => btn.textContent = 'Envoyer →', 3000);
            }
        });
    }

    // ── Typewriter hero desc ──
    const heroDesc = document.getElementById('heroDesc');
    if (heroDesc) {
        const text = heroDesc.textContent.trim();
        heroDesc.textContent = '';
        let i = 0;
        function type() {
            if (i < text.length) { heroDesc.textContent += text[i++]; setTimeout(type, 16); }
        }
        setTimeout(type, 800);
    }

    // ── Price Calculator Logic ──
    const priceData = {
        '5x5': 1.38,
        '10x10': 1.98,
        '15x15': 2.98,
        'custom': 3.5
    };

    function updatePrice() {
        const size = document.querySelector('input[name="size"]:checked')?.value || '10x10';
        const materialMult = parseFloat(document.querySelector('input[name="material"]:checked')?.dataset.mult || 1);
        const qty = parseInt(document.getElementById('orderQty').value) || 50;

        let basePrice = priceData[size] || 1.98;
        let total = basePrice * qty * materialMult;

        if (qty >= 250) total *= 0.8;
        else if (qty >= 100) total *= 0.9;

        document.getElementById('totalPriceDisplay').textContent = total.toFixed(2) + ' dh';
    }

    document.querySelectorAll('input[name="size"], input[name="material"]').forEach(input => {
        input.addEventListener('change', updatePrice);
    });

    const qtyInput = document.getElementById('orderQty');
    const qtyPlus = document.getElementById('qtyPlus');
    const qtyMinus = document.getElementById('qtyMinus');

    if (qtyPlus) qtyPlus.addEventListener('click', () => { qtyInput.value = parseInt(qtyInput.value) + 10; updatePrice(); });
    if (qtyMinus) qtyMinus.addEventListener('click', () => {
        if (parseInt(qtyInput.value) > 10) {
            qtyInput.value = parseInt(qtyInput.value) - 10;
            updatePrice();
        }
    });
    if (qtyInput) qtyInput.addEventListener('input', updatePrice);

    updatePrice();

    // ── Mockup Shape Logic ──
    let currentShape = 'original';
    const previewControls = document.getElementById('previewControls');
    const shapeBtns = document.querySelectorAll('.shape-btn');

    shapeBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            shapeBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentShape = btn.dataset.shape;

            document.querySelectorAll('.preview-item').forEach(item => {
                item.classList.remove('original', 'round', 'square');
                item.classList.add(currentShape);
            });
        });
    });

    // ── Upload Zone ──
    const uploadZone = document.getElementById('uploadZone');
    const fileInput = document.getElementById('fileInput');
    const previewZone = document.getElementById('previewZone');

    if (uploadZone && fileInput) {
        uploadZone.addEventListener('click', () => fileInput.click());

        uploadZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploadZone.classList.add('dragover');
        });

        uploadZone.addEventListener('dragleave', () => {
            uploadZone.classList.remove('dragover');
        });

        uploadZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploadZone.classList.remove('dragover');
            const files = e.dataTransfer.files;
            handleFiles(files);
        });

        fileInput.addEventListener('change', function () {
            handleFiles(this.files);
        });
    }

    function handleFiles(files) {
        if (files.length > 0) previewControls.style.display = 'flex';

        Array.from(files).forEach(file => {
            if (!file.type.startsWith('image/')) return;

            const reader = new FileReader();
            reader.onload = (e) => {
                const div = document.createElement('div');
                div.className = `preview-item reveal visible ${currentShape}`;
                div.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                    <button class="preview-remove" title="Supprimer"><i class="fas fa-times"></i></button>
                `;

                div.querySelector('.preview-remove').addEventListener('click', function (ev) {
                    ev.stopPropagation();
                    div.remove();
                    if (previewZone.children.length === 0) previewControls.style.display = 'none';
                });

                previewZone.appendChild(div);
            };
            reader.readAsDataURL(file);
        });
    }

    // ── Products Rendering ──
    const productsGrid = document.getElementById('productsGrid');

    const savedProducts = localStorage.getItem('your_sticker_products');
    let currentProducts;
    if (savedProducts) {
        try {
            currentProducts = JSON.parse(savedProducts);
        } catch (e) {
            currentProducts = PRODUCTS_DATA;
        }
    } else {
        currentProducts = PRODUCTS_DATA;
    }

    if (productsGrid && typeof currentProducts !== 'undefined') {
        window.currentProducts = currentProducts;
        productsGrid.innerHTML = '';
        currentProducts.forEach((prod, i) => {
            const delay = (i % 4) + 1;
            const priceFormatted = prod.price ? `${prod.price.toFixed(2)} DH` : '59.00 DH';
            const card = `
                <div class="sy-card reveal reveal-delay-${delay}" onclick="location.href='product-detail.html?id=${prod.id}'" style="cursor:pointer;">
                    <div class="sy-img-box">
                        <img src="${prod.img}" alt="${prod.title}">
                    </div>
                    <div class="sy-info">
                        <div class="sy-rating">${'★'.repeat(prod.stars || 5)} <span>(${prod.rating || 0})</span></div>
                        <h3 class="sy-title">${prod.title}</h3>
                        <div class="sy-price">${priceFormatted}</div>
                        <p class="sy-desc">${prod.desc}</p>
                        <button onclick="event.stopPropagation();addToCart(${prod.id})" class="sy-btn">Ajouter au Panier</button>
                    </div>
                </div>
            `;
            productsGrid.insertAdjacentHTML('beforeend', card);
        });

        document.querySelectorAll('#productsGrid .reveal').forEach(el => ro.observe(el));
    }
});
