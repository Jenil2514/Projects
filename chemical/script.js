/**
 * Shreeji Chemical - Modern Corporate JavaScript
 * Pure Vanilla JavaScript (No jQuery or external dependencies)
 * Location: Vadodara, Gujarat, India
 */

document.addEventListener('DOMContentLoaded', () => {

    // =========================================================================
    // 1. STICKY NAVIGATION BAR & ACTIVE LINK HIGHLIGHTING
    // =========================================================================
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleNavbarScroll() {
        if (window.scrollY > 30) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active link highlight based on scroll position
        let currentSectionId = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;

            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleNavbarScroll);

    // =========================================================================
    // 2. MOBILE NAVIGATION DRAWER & OVERLAY
    // =========================================================================
    const mobileToggle = document.getElementById('mobile-toggle');
    const navMenu = document.getElementById('nav-menu');
    const mobileNavOverlay = document.getElementById('mobile-nav-overlay');

    function toggleMobileMenu() {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        mobileNavOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    function closeMobileMenu() {
        if (mobileToggle) mobileToggle.classList.remove('active');
        if (navMenu) navMenu.classList.remove('active');
        if (mobileNavOverlay) mobileNavOverlay.classList.remove('active');
        document.body.style.overflow = '';
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMobileMenu);
    }

    if (mobileNavOverlay) {
        mobileNavOverlay.addEventListener('click', closeMobileMenu);
    }

    navLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    // =========================================================================
    // 3. INTERSECTION OBSERVER FOR FADE-UP ANIMATIONS
    // =========================================================================
    const fadeUpElements = document.querySelectorAll('.fade-up');

    const fadeObserverOptions = {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    };

    const fadeObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, fadeObserverOptions);

    fadeUpElements.forEach(element => {
        fadeObserver.observe(element);
    });

    // =========================================================================
    // 4. ANIMATED COUNTERS FOR STATISTICS SECTION
    // =========================================================================
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersTriggered = false;

    function animateCounter(counterElement) {
        const target = parseInt(counterElement.getAttribute('data-target'), 10);
        const duration = 2000; // 2 seconds
        const stepTime = 20;
        const totalSteps = duration / stepTime;
        const increment = target / totalSteps;
        let current = 0;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                counterElement.textContent = target;
                clearInterval(timer);
            } else {
                counterElement.textContent = Math.ceil(current);
            }
        }, stepTime);
    }

    const statsSection = document.getElementById('stats');

    if (statsSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !countersTriggered) {
                    countersTriggered = true;
                    statNumbers.forEach(num => animateCounter(num));
                }
            });
        }, { threshold: 0.3 });

        statsObserver.observe(statsSection);
    }

    // =========================================================================
    // 5. BACK TO TOP BUTTON
    // =========================================================================
    const backToTopBtn = document.getElementById('back-to-top');

    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 400) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // =========================================================================
    // 6. BUTTON RIPPLE EFFECT
    // =========================================================================
    const rippleButtons = document.querySelectorAll('.btn-ripple');

    rippleButtons.forEach(button => {
        button.addEventListener('click', function (e) {
            const circle = document.createElement('span');
            const diameter = Math.max(this.clientWidth, this.clientHeight);
            const radius = diameter / 2;

            const rect = this.getBoundingClientRect();
            circle.style.width = circle.style.height = `${diameter}px`;
            circle.style.left = `${e.clientX - rect.left - radius}px`;
            circle.style.top = `${e.clientY - rect.top - radius}px`;
            circle.classList.add('ripple');

            const ripple = this.getElementsByClassName('ripple')[0];
            if (ripple) {
                ripple.remove();
            }

            this.appendChild(circle);
        });
    });

});
