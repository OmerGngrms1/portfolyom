document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       THEME TOGGLE
       ========================================================================== */
    const themeToggleBtn = document.getElementById('theme-toggle');
    const themeIcon = themeToggleBtn.querySelector('i');
    
    // Check local storage or system preferences
    const savedTheme = localStorage.getItem('theme') || 'dark';
    if (savedTheme === 'light') {
        document.body.classList.remove('dark-theme');
        document.body.classList.add('light-theme');
        themeIcon.className = 'fa-solid fa-sun';
    } else {
        document.body.classList.remove('light-theme');
        document.body.classList.add('dark-theme');
        themeIcon.className = 'fa-solid fa-moon';
    }

    themeToggleBtn.addEventListener('click', () => {
        if (document.body.classList.contains('dark-theme')) {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            themeIcon.className = 'fa-solid fa-sun';
            localStorage.setItem('theme', 'light');
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            themeIcon.className = 'fa-solid fa-moon';
            localStorage.setItem('theme', 'dark');
        }
    });

    /* ==========================================================================
       LANGUAGE TOGGLE (TR / EN)
       ========================================================================== */
    const langToggleBtn = document.getElementById('lang-toggle');
    let currentLang = localStorage.getItem('lang') || 'tr';

    function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('lang', lang);
        
        // Update document lang attribute
        document.documentElement.lang = lang;
        
        // Update button text
        langToggleBtn.querySelector('span').textContent = lang === 'tr' ? 'EN' : 'TR';
        
        // Find all elements with translation data
        const translatableElements = document.querySelectorAll('[data-tr]');
        
        translatableElements.forEach(el => {
            if (lang === 'tr') {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = el.getAttribute('placeholder') ? el.getAttribute('placeholder') : '';
                } else {
                    el.textContent = el.getAttribute('data-tr');
                }
            } else {
                if (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA') {
                    el.placeholder = el.getAttribute('placeholder') ? el.getAttribute('placeholder') : '';
                } else {
                    el.textContent = el.getAttribute('data-en');
                }
            }
        });

        // Translate placeholders explicitly
        const placeholders = {
            tr: {
                name: 'Örn: Ahmet Yılmaz',
                email: 'name@domain.com',
                subject: 'İş teklifi, işbirliği vb.',
                message: 'Mesajınızı detaylıca yazabilirsiniz...'
            },
            en: {
                name: 'e.g. John Doe',
                email: 'name@domain.com',
                subject: 'Job offer, collaboration etc.',
                message: 'Write your message in detail...'
            }
        };

        const nameInput = document.getElementById('form-name');
        const emailInput = document.getElementById('form-email');
        const subjectInput = document.getElementById('form-subject');
        const messageInput = document.getElementById('form-message');

        if (nameInput) nameInput.placeholder = placeholders[lang].name;
        if (emailInput) emailInput.placeholder = placeholders[lang].email;
        if (subjectInput) subjectInput.placeholder = placeholders[lang].subject;
        if (messageInput) messageInput.placeholder = placeholders[lang].message;
    }

    // Initialize Language
    setLanguage(currentLang);

    langToggleBtn.addEventListener('click', () => {
        const nextLang = currentLang === 'tr' ? 'en' : 'tr';
        setLanguage(nextLang);
    });


    /* ==========================================================================
       MOBILE NAVIGATION OVERLAY
       ========================================================================== */
    const mobileToggle = document.querySelector('.mobile-menu-toggle');
    const mobileMenu = document.querySelector('.mobile-nav');
    const mobileLinks = document.querySelectorAll('.mobile-link');

    function toggleMobileMenu() {
        mobileToggle.classList.toggle('open');
        mobileMenu.classList.toggle('open');
    }

    mobileToggle.addEventListener('click', toggleMobileMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMobileMenu();
            }
        });
    });


    /* ==========================================================================
       SCROLL INDICATOR & NAVBAR BACKGROUND SWITCH
       ========================================================================== */
    const scrollProgress = document.getElementById('scroll-progress');
    const headerEl = document.querySelector('header');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section');

    window.addEventListener('scroll', () => {
        // Scroll Progress Bar
        const totalHeight = document.documentElement.scrollHeight - window.innerHeight;
        const progress = (window.scrollY / totalHeight) * 100;
        scrollProgress.style.width = `${progress}%`;

        // Navbar shadow/blur class when scrolled
        if (window.scrollY > 50) {
            headerEl.style.boxShadow = '0 10px 30px rgba(0, 0, 0, 0.1)';
        } else {
            headerEl.style.boxShadow = 'none';
        }

        // Active Nav Link highlight on scroll
        let currentSectionId = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSectionId = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSectionId}`) {
                link.classList.add('active');
            }
        });
    });


    /* ==========================================================================
       INTERSECTION OBSERVER (SCROLL REVEAL & SKILLS PROGRESS)
       ========================================================================== */
    // Add reveal class to sections or components we want to fade in
    const revealElements = [
        document.querySelector('.about-grid'),
        document.querySelector('.skills-grid'),
        document.querySelector('.timeline'),
        document.querySelector('.certificates-grid'),
        document.querySelector('.projects-grid'),
        document.querySelector('.contact-grid')
    ];

    revealElements.forEach(el => {
        if (el) el.classList.add('reveal');
    });

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-active', 'active');
                observer.unobserve(entry.target); // Stop observing after anim triggers
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    const allReveals = document.querySelectorAll('.reveal');
    allReveals.forEach(el => revealObserver.observe(el));


    // Skills circle progress animation on scroll visibility
    const skillsSection = document.getElementById('skills');
    const circleProgresses = document.querySelectorAll('circle.progress');
    
    // We initially set the dashoffset to full length (no progress)
    circleProgresses.forEach(circle => {
        circle.style.strokeDashoffset = '314.15';
    });

    const skillsObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                circleProgresses.forEach(circle => {
                    const offsetVal = circle.getAttribute('style').match(/stroke-dashoffset:\s*calc\([^)]+\)/);
                    if (offsetVal) {
                        // Re-trigger the style so CSS transition kicks in
                        circle.style.strokeDashoffset = ''; 
                    }
                });
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.2
    });

    if (skillsSection) {
        skillsObserver.observe(skillsSection);
    }


    /* ==========================================================================
       3D TILT EFFECT ON THE PROFILE CARD
       ========================================================================== */
    const profileCardWrapper = document.querySelector('.profile-card-wrapper');
    const profileCard = document.querySelector('.profile-card');

    if (profileCardWrapper && profileCard) {
        profileCardWrapper.addEventListener('mousemove', (e) => {
            const rect = profileCardWrapper.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width/2;
            const y = e.clientY - rect.top - rect.height/2;
            
            // Map offsets to tilt angles (max 12 deg)
            const tiltX = (y / (rect.height/2)) * -12;
            const tiltY = (x / (rect.width/2)) * 12;
            
            profileCard.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg) scale(1.02)`;
        });

        profileCardWrapper.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
        });
    }


    /* ==========================================================================
       CONTACT FORM SUBMISSION SIMULATION
       ========================================================================== */
    const contactForm = document.getElementById('portfolio-contact-form');
    const statusMsg = document.getElementById('form-status-msg');

    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const btnTextEl = submitBtn.querySelector('.btn-text');
            const btnIcon = submitBtn.querySelector('i');
            
            const originalText = btnTextEl.textContent;
            
            // Set loading state
            btnTextEl.textContent = currentLang === 'tr' ? 'Gönderiliyor...' : 'Sending...';
            btnIcon.className = 'fa-solid fa-spinner fa-spin';
            submitBtn.disabled = true;

            // Simulate server request (1.5 seconds delay)
            setTimeout(() => {
                // Success message handling
                statusMsg.className = 'status-msg success';
                statusMsg.textContent = currentLang === 'tr' 
                    ? 'Mesajınız başarıyla gönderildi! Ömer sizinle en kısa sürede iletişime geçecektir.' 
                    : 'Your message has been sent successfully! Ömer will contact you as soon as possible.';
                
                // Clear form
                contactForm.reset();
                
                // Reset button state
                btnTextEl.textContent = originalText;
                btnIcon.className = 'fa-solid fa-paper-plane';
                submitBtn.disabled = false;

                // Hide status message after 5 seconds
                setTimeout(() => {
                    statusMsg.className = 'status-msg hide';
                }, 5000);

            }, 1500);
        });
    }
});
