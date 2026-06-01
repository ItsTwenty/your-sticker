/**
 * Your Sticker - Shared Application Javascript
 * Contains Cart, Navbar, Preloader, Banner, Scroll Animations, and common helpers.
 */

document.addEventListener('DOMContentLoaded', () => {

    // ── MOBILE MENU TOGGLE ──
    const mobileBtn = document.getElementById('mobileMenuBtn');
    const nav = document.getElementById('mainNav');
    if (mobileBtn && nav) {
        mobileBtn.addEventListener('click', () => {
            const open = nav.classList.toggle('active');
            mobileBtn.innerHTML = open ? '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
            document.body.style.overflow = open ? 'hidden' : '';
        });

        nav.addEventListener('click', (e) => {
            if (e.target === nav || e.target === nav.querySelector('ul')) {
                closeMenu();
            }
        });

        nav.querySelectorAll('a').forEach(a => {
            a.addEventListener('click', closeMenu);
        });

        function closeMenu() {
            nav.classList.remove('active');
            mobileBtn.innerHTML = '<i class="fas fa-bars"></i>';
            document.body.style.overflow = '';
        }
    }

    // ── SCROLL REVEAL ANIMATIONS ──
    const reveals = document.querySelectorAll('.reveal');
    const ro = new IntersectionObserver(entries => {
        entries.forEach(e => {
            if (e.isIntersecting) {
                e.target.classList.add('visible');
                ro.unobserve(e.target);
            }
        });
    }, { threshold: 0.1 });
    
    reveals.forEach(el => ro.observe(el));

    // Section title underline on reveal
    document.querySelectorAll('.section-title').forEach(title => {
        title.classList.add('reveal');
        ro.observe(title);
    });

    // Make reveal observer available globally if other scripts need to register new elements dynamically
    window.scrollRevealObserver = ro;

    // ── BUTTON RIPPLE EFFECT ──
    document.querySelectorAll('.btn').forEach(btn => {
        btn.addEventListener('click', e => {
            const r = document.createElement('span');
            const rect = btn.getBoundingClientRect();
            r.className = 'btn-ripple';
            r.style.left = (e.clientX - rect.left - 5) + 'px';
            r.style.top = (e.clientY - rect.top - 5) + 'px';
            btn.appendChild(r);
            setTimeout(() => r.remove(), 600);
        });
    });

    // ── 3D TILT ON CARDS ──
    document.querySelectorAll('.category-card, .product-card, .step, .pers-card, .sy-card').forEach(card => {
        card.addEventListener('mousemove', e => {
            const rect = card.getBoundingClientRect();
            const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2);
            const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2);
            card.style.transform = `perspective(900px) rotateX(${dy * -7}deg) rotateY(${dx * 7}deg) scale(1.02)`;
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ── STICKER HOVER SHADOW COLOR ──
    const stickerColors = ['#FFE500', '#FF2D78', '#FF6B00', '#00D4AA'];
    document.querySelectorAll('.sticker').forEach((s, i) => {
        s.addEventListener('mouseenter', () => {
            s.style.boxShadow = `6px 6px 0 ${stickerColors[i % stickerColors.length]}`;
            s.style.borderColor = stickerColors[i % stickerColors.length];
        });
        s.addEventListener('mouseleave', () => {
            s.style.boxShadow = '';
            s.style.borderColor = '';
        });
    });

    // ── PRELOADER ──
    const preloader = document.getElementById('preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => preloader.style.display = 'none', 600);
            }, 1200);
        });
        // Fallback: hide after 4s max
        setTimeout(() => {
            preloader.classList.add('loaded');
            if (preloader.style.display !== 'none') {
                setTimeout(() => preloader.style.display = 'none', 600);
            }
        }, 4000);
    }

    // ── SCROLL PROGRESS BAR ──
    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
            progressBar.style.width = scrollPercent + '%';
        });
    }

    // ── BACK TO TOP ──
    const backToTop = document.getElementById('backToTop');
    if (backToTop) {
        window.addEventListener('scroll', () => {
            backToTop.classList.toggle('visible', window.scrollY > 600);
        });
        backToTop.addEventListener('click', () => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ── PROMO BANNER ──
    const promoBanner = document.getElementById('promoBanner');
    const promoClose = document.getElementById('promoClose');
    if (promoBanner && promoClose) {
        if (sessionStorage.getItem('promoDismissed')) {
            promoBanner.style.display = 'none';
        }
        promoClose.addEventListener('click', () => {
            promoBanner.classList.add('hidden');
            sessionStorage.setItem('promoDismissed', 'true');
            setTimeout(() => promoBanner.style.display = 'none', 400);
        });
    }

    // ── NEWSLETTER FORM ──
    const nlForm = document.getElementById('newsletterForm');
    if (nlForm) {
        nlForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const email = nlForm.email.value.trim();
            if (!email || !email.includes('@')) {
                showToast('Veuillez entrer un email valide.', 'error');
                return;
            }
            try {
                const fd = new FormData(nlForm);
                const resp = await fetch('https://api.web3forms.com/submit', { method: 'POST', body: fd });
                const data = await resp.json();
                if (resp.ok && data.success) {
                    showToast('Merci ! Vous êtes inscrit à notre newsletter.', 'success');
                    nlForm.reset();
                } else {
                    showToast('Erreur lors de l\'inscription. Réessayez.', 'error');
                }
            } catch {
                showToast('Erreur de connexion. Réessayez.', 'error');
            }
        });
    }

    // ── TOAST NOTIFICATIONS ──
    window.showToast = function(msg, type) {
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
        }, 3500);
    };


    // ═══════════════════════════
    //      SHOPPING CART
    // ═══════════════════════════
    let cart = JSON.parse(localStorage.getItem('your_sticker_cart')) || [];

    const cartOverlay = document.getElementById('cartOverlay');
    const cartSidebar = document.getElementById('cartSidebar');
    const cartBody = document.getElementById('cartBody');
    const cartClose = document.getElementById('cartClose');
    const cartIcon = document.querySelector('.cart-btn');
    const cartCount = document.querySelector('.cart-count');
    const cartTotalAmount = document.getElementById('cartTotalAmount');
    const checkoutBtn = document.getElementById('checkoutBtn');

    function updateCartBadge() {
        if (cartCount) {
            cartCount.textContent = cart.reduce((acc, item) => acc + (item.qty || 1), 0);
        }
    }

    function toggleCart() {
        if (cartSidebar && cartOverlay) {
            cartSidebar.classList.toggle('open');
            cartOverlay.classList.toggle('active');
            if (cartSidebar.classList.contains('open')) renderCart();
        }
    }

    if (cartIcon) cartIcon.addEventListener('click', (e) => { e.preventDefault(); toggleCart(); });
    if (cartClose) cartClose.addEventListener('click', toggleCart);
    if (cartOverlay) cartOverlay.addEventListener('click', toggleCart);

    window.addToCart = function (id) {
        // Fallback to local array or window.currentProducts or general PRODUCTS_DATA
        const productsList = typeof PRODUCTS_DATA !== 'undefined' ? PRODUCTS_DATA : [];
        const prod = productsList.find(p => p.id === id);
        if (!prod) return;

        const existing = cart.find(item => item.id === id);
        if (existing) {
            existing.qty++;
        } else {
            cart.push({ ...prod, qty: 1, price: prod.price || 59 });
        }

        localStorage.setItem('your_sticker_cart', JSON.stringify(cart));
        updateCartBadge();
        showToast(`${prod.title} ajouté !`, 'success');
        if (cartSidebar && !cartSidebar.classList.contains('open')) toggleCart();
    };

    window.removeFromCart = function (id) {
        cart = cart.filter(item => item.id !== id);
        localStorage.setItem('your_sticker_cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    };

    window.updateQty = function (id, delta) {
        const item = cart.find(i => i.id === id);
        if (!item) return;
        item.qty += delta;
        if (item.qty <= 0) {
            cart = cart.filter(i => i.id !== id);
        }
        localStorage.setItem('your_sticker_cart', JSON.stringify(cart));
        updateCartBadge();
        renderCart();
    };

    function renderCart() {
        if (!cartBody) return;
        if (cart.length === 0) {
            cartBody.innerHTML = '<div class="empty-cart">Votre panier est vide.</div>';
            if (cartTotalAmount) cartTotalAmount.textContent = '0 DH';
            return;
        }

        let html = '';
        let total = 0;
        cart.forEach(item => {
            const subtotal = item.price * item.qty;
            total += subtotal;
            html += `
                <div class="cart-item">
                    <div class="cart-item-img"><img src="${item.img}" alt="${item.title}"></div>
                    <div class="cart-item-info">
                        <div class="cart-item-title">${item.title}</div>
                        <div class="cart-item-price">${item.price} DH</div>
                        <div class="cart-item-qty-controls">
                            <button class="qty-btn" onclick="updateQty(${item.id}, -1)"><i class="fas fa-minus"></i></button>
                            <span class="qty-val">${item.qty}</span>
                            <button class="qty-btn" onclick="updateQty(${item.id}, 1)"><i class="fas fa-plus"></i></button>
                        </div>
                    </div>
                    <div class="cart-item-right">
                        <div class="cart-item-subtotal">${subtotal} DH</div>
                        <button class="cart-item-remove" onclick="removeFromCart(${item.id})"><i class="fas fa-trash-alt"></i></button>
                    </div>
                </div>
            `;
        });
        cartBody.innerHTML = html;
        if (cartTotalAmount) cartTotalAmount.textContent = `${total} DH`;
    }

    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', () => {
            if (cart.length === 0) return;
            let message = "Bonjour Your Sticker! Je souhaite commander :\n\n";
            let total = 0;
            cart.forEach(item => {
                message += `- ${item.title} (x${item.qty}) : ${item.price * item.qty} DH\n`;
                total += item.price * item.qty;
            });
            message += `\nTotal estimé : ${total} DH\n\nMerci de me recontacter !`;
            const encoded = encodeURIComponent(message);
            window.open(`https://wa.me/212600000000?text=${encoded}`, '_blank');
        });
    }

    // ── FAQ ACCORDION ──
    document.querySelectorAll('.faq-question').forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('active');
            document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('active'));
            if (!isOpen) item.classList.add('active');
        });
    });

    // ── STATS COUNTER ANIMATION ──
    const statNums = document.querySelectorAll('.stat-num[data-target]');
    const statsObserver = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) return;
            const el = entry.target;
            const target = parseInt(el.dataset.target);
            let current = 0;
            const duration = 2000;
            const step = target / (duration / 16);
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    current = target;
                    clearInterval(counter);
                }
                el.textContent = Math.floor(current).toLocaleString('fr-FR');
            }, 16);
            statsObserver.unobserve(el);
        });
    }, { threshold: 0.5 });
    statNums.forEach(el => statsObserver.observe(el));

    // Initialize badge count on load
    updateCartBadge();

});
