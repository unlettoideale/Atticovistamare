/* ============================================
   ATTICO VISTA MARE - Premium JS
   ============================================ */
document.addEventListener('DOMContentLoaded', () => {

    // --- Loader ---
    window.addEventListener('load', () => {
        setTimeout(() => {
            document.getElementById('loader')?.classList.add('done');
        }, 800);
    });

    // --- Custom Cursor (desktop) ---
    const dot = document.getElementById('cursorDot');
    if (window.matchMedia('(hover: hover)').matches && dot) {
        let mx = 0, my = 0, dx = 0, dy = 0;
        document.addEventListener('mousemove', e => { mx = e.clientX; my = e.clientY; });
        (function animCursor() {
            dx += (mx - dx) * 0.15;
            dy += (my - dy) * 0.15;
            dot.style.transform = `translate(${dx - 4}px, ${dy - 4}px)`;
            requestAnimationFrame(animCursor);
        })();
    }

    // --- Navbar ---
    const navbar = document.getElementById('navbar');
    const onScroll = () => navbar.classList.toggle('scrolled', window.scrollY > 50);
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    // --- Mobile Menu ---
    const toggle = document.getElementById('navToggle');
    const menu = document.getElementById('navMenu');
    toggle?.addEventListener('click', () => {
        toggle.classList.toggle('active');
        menu.classList.toggle('active');
        document.body.style.overflow = menu.classList.contains('active') ? 'hidden' : '';
    });
    menu?.querySelectorAll('a').forEach(a => {
        a.addEventListener('click', () => {
            toggle.classList.remove('active');
            menu.classList.remove('active');
            document.body.style.overflow = '';
        });
    });

    // --- Hero Slider ---
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('#heroDots .dot');
    let current = 0;
    let sliderInterval;

    function goToSlide(i) {
        slides[current].classList.remove('active');
        dots[current]?.classList.remove('active');
        current = i;
        slides[current].classList.add('active');
        dots[current]?.classList.add('active');
    }

    function nextSlide() {
        goToSlide((current + 1) % slides.length);
    }

    function startSlider() {
        sliderInterval = setInterval(nextSlide, 5000);
    }

    dots.forEach(d => {
        d.addEventListener('click', () => {
            clearInterval(sliderInterval);
            goToSlide(+d.dataset.index);
            startSlider();
        });
    });

    if (slides.length > 1) startSlider();

    // --- Hero Entry Animations ---
    const heroAnims = document.querySelectorAll('.anim-fade, .anim-slide');
    setTimeout(() => {
        heroAnims.forEach(el => {
            const delay = parseFloat(el.dataset.delay || 0) * 1000;
            setTimeout(() => el.classList.add('visible'), delay);
        });
    }, 600);

    // --- Scroll Reveal ---
    const revealEls = document.querySelectorAll(
        '.reveal-up, .reveal-left, .reveal-right, .amenities-scroll, .pricing-cards, .reviews-track, .contact-row'
    );
    const revealObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                revealObs.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(el => revealObs.observe(el));

    // --- Gallery Lightbox ---
    const lb = document.getElementById('lightbox');
    const lbImg = document.getElementById('lbImg');
    const lbCaption = document.getElementById('lbCaption');
    const mosaicItems = document.querySelectorAll('.mosaic-item');
    const images = [];
    let lbIndex = 0;

    mosaicItems.forEach((item, i) => {
        const img = item.querySelector('img');
        images.push({ src: img.src, alt: img.alt, caption: item.dataset.caption || '' });
        item.addEventListener('click', () => { lbIndex = i; openLB(); });
    });

    function openLB() {
        lbImg.src = images[lbIndex].src;
        lbImg.alt = images[lbIndex].alt;
        lbCaption.textContent = images[lbIndex].caption;
        lb.classList.add('active');
        document.body.style.overflow = 'hidden';
    }
    function closeLB() {
        lb.classList.remove('active');
        document.body.style.overflow = '';
    }

    document.getElementById('lbClose')?.addEventListener('click', closeLB);
    document.getElementById('lbNext')?.addEventListener('click', () => {
        lbIndex = (lbIndex + 1) % images.length; openLB();
    });
    document.getElementById('lbPrev')?.addEventListener('click', () => {
        lbIndex = (lbIndex - 1 + images.length) % images.length; openLB();
    });
    lb?.addEventListener('click', e => { if (e.target === lb) closeLB(); });
    document.addEventListener('keydown', e => {
        if (!lb?.classList.contains('active')) return;
        if (e.key === 'Escape') closeLB();
        if (e.key === 'ArrowRight') { lbIndex = (lbIndex + 1) % images.length; openLB(); }
        if (e.key === 'ArrowLeft') { lbIndex = (lbIndex - 1 + images.length) % images.length; openLB(); }
    });

    // --- Touch swipe for lightbox ---
    let tStartX = 0;
    lb?.addEventListener('touchstart', e => { tStartX = e.touches[0].clientX; }, { passive: true });
    lb?.addEventListener('touchend', e => {
        const diff = e.changedTouches[0].clientX - tStartX;
        if (Math.abs(diff) > 50) {
            if (diff < 0) { lbIndex = (lbIndex + 1) % images.length; openLB(); }
            else { lbIndex = (lbIndex - 1 + images.length) % images.length; openLB(); }
        }
    }, { passive: true });

    // --- Smooth scroll ---
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                e.preventDefault();
                const top = target.getBoundingClientRect().top + window.scrollY - navbar.offsetHeight;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });

    // --- Parallax hero image ---
    const heroSlider = document.querySelector('.hero-slider');
    if (heroSlider && window.innerWidth > 768) {
        window.addEventListener('scroll', () => {
            const y = window.scrollY;
            if (y < window.innerHeight) {
                heroSlider.style.transform = `translateY(${y * 0.25}px)`;
            }
        }, { passive: true });
    }

    // --- Counter animation for stat pills ---
    const statPills = document.querySelectorAll('.stat-pill strong');
    const counterObs = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const text = el.textContent;
                const num = parseInt(text);
                if (!isNaN(num) && num > 0) {
                    let start = 0;
                    const end = num;
                    const suffix = text.replace(String(num), '');
                    const duration = 1500;
                    const startTime = performance.now();
                    function update(now) {
                        const progress = Math.min((now - startTime) / duration, 1);
                        const eased = 1 - Math.pow(1 - progress, 3);
                        el.textContent = Math.round(end * eased) + suffix;
                        if (progress < 1) requestAnimationFrame(update);
                    }
                    requestAnimationFrame(update);
                }
                counterObs.unobserve(el);
            }
        });
    }, { threshold: 0.5 });
    statPills.forEach(el => counterObs.observe(el));

});
