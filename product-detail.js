/**
 * Product Detail Page — Your Sticker
 * Handles product loading, gallery, cart, and order submission.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── Get product ID from URL ──
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));

    // ── Load products ──
    const saved = localStorage.getItem('your_sticker_products');
    const products = saved ? (() => { try { return JSON.parse(saved); } catch(e) { return PRODUCTS_DATA; } })() : PRODUCTS_DATA;

    const product = products.find(p => p.id === productId);
    const loadingEl = document.getElementById('pdpLoading');
    const errorEl = document.getElementById('pdpError');
    const contentEl = document.getElementById('pdpContent');

    if (!product) {
        loadingEl.style.display = 'none';
        errorEl.style.display = 'flex';
        return;
    }

    // ── Populate everything ──
    loadingEl.style.display = 'none';
    contentEl.style.display = 'block';

    const isNew = product.id > 5;
    const priceFormatted = product.price ? `${product.price.toFixed(2)} DH` : '59.00 DH';
    const oldPrice = product.price ? (product.price * 1.15).toFixed(2) : null;

    // Breadcrumb
    document.getElementById('pdpBreadcrumbTitle').textContent = product.title;

    // Badge
    const badge = document.getElementById('pdpBadge');
    if (isNew) {
        badge.textContent = 'Nouveau';
        badge.className = 'pdp-badge';
    } else {
        badge.textContent = 'Populaire';
        badge.className = 'pdp-badge sale';
    }

    // Main Image
    const mainImg = document.getElementById('pdpMainImage');
    mainImg.src = product.img;
    mainImg.alt = product.title;

    // Thumbnails (generate variants from same image + some variety)
    const thumbContainer = document.getElementById('pdpThumbnails');
    const variantImages = product.images || [product.img];
    const labels = ['Avant', 'Arrière', 'Détail', 'Pack'];
    const thumbVariants = variantImages.map((src, i) => ({ src, label: labels[i] || `Vue ${i + 1}` }));
    thumbVariants.forEach((v, i) => {
        const thumb = document.createElement('div');
        thumb.className = `pdp-thumb-item ${i === 0 ? 'active' : ''}`;
        thumb.innerHTML = `<img src="${v.src}" alt="${v.label}">`;
        thumb.addEventListener('click', () => {
            document.querySelectorAll('.pdp-thumb-item').forEach(t => t.classList.remove('active'));
            thumb.classList.add('active');
            mainImg.style.opacity = '0';
            mainImg.style.transform = 'scale(0.95)';
            setTimeout(() => {
                mainImg.src = v.src;
                mainImg.style.opacity = '1';
                mainImg.style.transform = 'scale(1)';
            }, 200);
        });
        thumbContainer.appendChild(thumb);
    });

    // Category
    document.getElementById('pdpCategory').textContent = product.category || 'Stickers';

    // Title
    document.getElementById('pdpTitle').textContent = product.title;



    // Price
    document.getElementById('pdpPrice').textContent = priceFormatted;
    const oldPriceEl = document.getElementById('pdpPriceOld');
    if (oldPrice) {
        oldPriceEl.textContent = `${oldPrice} DH`;
        oldPriceEl.style.display = 'inline';
    }
    document.getElementById('pdpDiscountBadge').style.display = oldPrice ? 'inline' : 'none';

    // Description
    document.getElementById('pdpDesc').textContent = product.desc;

    // Availability
    const availText = document.getElementById('pdpAvailabilityText');
    const availDot = document.querySelector('.pdp-availability .dot');
    if (product.stock === undefined || product.stock > 10) {
        availText.textContent = 'En stock — prêt à expédier';
        availDot.className = 'dot in-stock';
    } else if (product.stock > 0) {
        availText.textContent = `Plus que ${product.stock} en stock — commandez vite !`;
        availDot.className = 'dot low-stock';
    } else {
        availText.textContent = 'En rupture — prochain stock sous 48h';
        availDot.className = 'dot low-stock';
    }

    // Sticky mobile
    document.getElementById('pdpStickyTitle').textContent = product.title;
    document.getElementById('pdpStickyPrice').textContent = priceFormatted;



    // ── Related Products ──
    const track = document.getElementById('pdpRelatedTrack');
    const related = products.filter(p => p.id !== product.id).slice(0, 8);
    related.forEach(p => {
        const card = document.createElement('a');
        card.className = 'pdp-related-card';
        card.href = `product-detail.html?id=${p.id}`;
        card.innerHTML = `
            <div class="pdp-related-img">
                <img src="${p.img}" alt="${p.title}" loading="lazy">
            </div>
            <div class="pdp-related-info">
                <div class="pdp-related-title">${p.title}</div>
                <div class="pdp-related-price">${p.price ? p.price.toFixed(2) + ' DH' : '59.00 DH'}</div>
            </div>
        `;
        track.appendChild(card);
    });

    // Related scroll arrows
    document.getElementById('pdpRelatedPrev').addEventListener('click', () => {
        track.scrollBy({ left: -240, behavior: 'smooth' });
    });
    document.getElementById('pdpRelatedNext').addEventListener('click', () => {
        track.scrollBy({ left: 240, behavior: 'smooth' });
    });

    // ── FAQ Accordion ──
    document.querySelectorAll('.pdp-faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.pdp-faq-item').forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });

    // ── Init badge count ──
    updateBadgeCount();
});


// ── Quantity Control ──
function adjustQty(delta) {
    const input = document.getElementById('pdpQty');
    let val = parseInt(input.value) || 1;
    val = Math.max(1, Math.min(99, val + delta));
    input.value = val;
}

// ── Scroll to order form ──
function scrollToOrder() {
    const form = document.getElementById('pdpOrderForm');
    if (form) {
        form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        const firstInput = form.querySelector('input');
        if (firstInput) setTimeout(() => firstInput.focus(), 600);
    }
}

// ── Add to Cart ──
function addToCartFromPDP() {
    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const saved = localStorage.getItem('your_sticker_products');
    const products = saved ? (() => { try { return JSON.parse(saved); } catch(e) { return PRODUCTS_DATA; } })() : PRODUCTS_DATA;
    const prod = products.find(p => p.id === productId);
    if (!prod) return;

    let cart = JSON.parse(localStorage.getItem('your_sticker_cart')) || [];
    const existing = cart.find(item => item.id === prod.id);
    if (existing) {
        existing.qty += parseInt(document.getElementById('pdpQty').value) || 1;
    } else {
        cart.push({ ...prod, qty: parseInt(document.getElementById('pdpQty').value) || 1, price: prod.price || 59 });
    }

    localStorage.setItem('your_sticker_cart', JSON.stringify(cart));
    updateBadgeCount();
    showToastPDP(`${prod.title} ajouté au panier !`, 'success');
}

function updateBadgeCount() {
    const badge = document.querySelector('.cart-count');
    if (!badge) return;
    const cart = JSON.parse(localStorage.getItem('your_sticker_cart')) || [];
    badge.textContent = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
}

function showToastPDP(msg, type) {
    const existing = document.querySelector('.toast-notification');
    if (existing) existing.remove();

    const toast = document.createElement('div');
    toast.className = `toast-notification toast-${type}`;
    toast.textContent = msg;
    document.body.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add('visible'));
    setTimeout(() => {
        toast.classList.remove('visible');
        setTimeout(() => toast.remove(), 400);
    }, 3000);
}

// ── Order Submit via WhatsApp ──
function handleOrderSubmit(e) {
    e.preventDefault();

    const params = new URLSearchParams(window.location.search);
    const productId = parseInt(params.get('id'));
    const saved = localStorage.getItem('your_sticker_products');
    const products = saved ? (() => { try { return JSON.parse(saved); } catch(e) { return PRODUCTS_DATA; } })() : PRODUCTS_DATA;
    const prod = products.find(p => p.id === productId);

    const name = document.getElementById('pdpName').value.trim();
    const phone = document.getElementById('pdpPhone').value.trim();
    const city = document.getElementById('pdpCity').value;
    const address = document.getElementById('pdpAddress').value.trim();
    const qty = document.getElementById('pdpQty').value;
    const note = document.getElementById('pdpNote').value.trim();

    let message = `🛒 *Nouvelle commande Your Sticker*\n\n`;
    message += `*Produit:* ${prod ? prod.title : 'Stickers'}\n`;
    message += `*Quantité:* ${qty}\n`;
    message += `*Prix unitaire:* ${prod ? (prod.price ? prod.price.toFixed(2) + ' DH' : '59.00 DH') : '59.00 DH'}\n`;
    if (prod && prod.price) {
        message += `*Total estimé:* ${(prod.price * parseInt(qty)).toFixed(2)} DH\n`;
    }
    message += `\n━━━ *Coordonnées* ━━━\n`;
    message += `*Nom:* ${name}\n`;
    message += `*Téléphone:* ${phone}\n`;
    message += `*Ville:* ${city}\n`;
    message += `*Adresse:* ${address}\n`;
    if (note) message += `*Note:* ${note}\n`;
    message += `\n*Paiement:* À la livraison 📦`;

    const encoded = encodeURIComponent(message);
    window.open(`https://wa.me/212600000000?text=${encoded}`, '_blank');

    const btn = document.getElementById('pdpOrderBtn');
    btn.innerHTML = '<i class="fas fa-check"></i> Message envoyé !';
    btn.style.background = '#30D158';
    setTimeout(() => {
        btn.innerHTML = '<i class="fab fa-whatsapp"></i> Commander maintenant';
        btn.style.background = '';
    }, 3000);

    return false;
}

// ── Cart badge on load (uses app.js for cart sidebar) ──
// updateBadgeCount is called inside the first DOMContentLoaded above
