// ===================================
// Anime Quotes Collection
// ===================================
const animeQuotes = [
    // One Piece Quotes
    {
        text: "If you don't take risks, you can't create a future.",
        author: "Monkey D. Luffy",
        anime: "One Piece"
    },
    {
        text: "When the world shoves you around, you just gotta stand up and shove back.",
        author: "Roronoa Zoro",
        anime: "One Piece"
    },
    {
        text: "When you arise in the morning think of what a privilege it is to be alive, to think, to enjoy, to love",
        author: "Marcus Aurelius",
        anime: "Meditations"
    },
    {
        text: "Power isn't determined by your size, but the size of your heart and dreams.",
        author: "Monkey D. Luffy",
        anime: "One Piece"
    },
    {
        text: "Only I can call my dream stupid!",
        author: "Roronoa Zoro",
        anime: "One Piece"
    },
    {
        text: "A scar on the back is a shame for a swordsman.",
        author: "Roronoa Zoro",
        anime: "One Piece"
    },
    {
        text: "It never ceases to amaze me: we all love themselves more than other people, but care more about their opinions than our own.",
        author: "Marcus Aurelius",
        anime: "Meditations"
    },
    {
        text: "There's only one way to live life, and that's without regrets.",
        author: "Portgas D. Ace",
        anime: "One Piece"
    },
    {
        text: "Being alone is more painful than getting hurt.",
        author: "Monkey D. Luffy",
        anime: "One Piece"
    },
    // Vinland Saga Quotes
    {
        text: "I don't have any enemies. There is no one I cannot forgive.",
        author: "Thorfinn",
        anime: "Vinland Saga"
    },
    {
        text: "Everyone is a slave to something.",
        author: "Askeladd",
        anime: "Vinland Saga"
    },
    {
        text: "A true warrior doesn't dwell on the past. He moves forward and keeps growing.",
        author: "Thorfinn",
        anime: "Vinland Saga"
    },
    {
        text: "Peace isn't something given—it's something earned through change.",
        author: "Thorfinn",
        anime: "Vinland Saga"
    },
    {
        text: "Redemption isn't a destination—it's a daily choice.",
        author: "Thorfinn",
        anime: "Vinland Saga"
    },
    {
        text: "Even in the darkest soil, a seed can grow.",
        author: "Thorfinn",
        anime: "Vinland Saga"
    },
    {
        text: "Don't hang on to petty things your entire life. You've got to move on.",
        author: "Askeladd",
        anime: "Vinland Saga"
    }
];

// ===================================
// Typing Effect for Hero Section
// ===================================
const typingTexts = [
    "Backend Software Engineer",
    "Distributed Systems Architect",
    "WebRTC Specialist",
    "Weekend Procrastinator",
    "Microservices Expert",
    "Building Scalable Solutions",
];

let textIndex = 0;
let charIndex = 0;
let isDeleting = false;
const typingSpeed = 80;
const deletingSpeed = 50;
const pauseTime = 2000;

function typeText() {
    const typingElement = document.querySelector('.typing-text');
    if (!typingElement) return;

    const currentText = typingTexts[textIndex];

    if (isDeleting) {
        typingElement.textContent = currentText.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typingElement.textContent = currentText.substring(0, charIndex + 1);
        charIndex++;
    }

    let timeout = isDeleting ? deletingSpeed : typingSpeed;

    if (!isDeleting && charIndex === currentText.length) {
        timeout = pauseTime;
        isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        textIndex = (textIndex + 1) % typingTexts.length;
        timeout = 500;
    }

    setTimeout(typeText, timeout);
}

// ===================================
// Navigation Functionality
// ===================================
function initNavigation() {
    const navbar = document.getElementById('navbar');
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Scroll effect for navbar
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    navToggle.addEventListener('click', () => {
        navToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
    });

    // Close menu on link click
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navToggle.classList.remove('active');
            navMenu.classList.remove('active');
        });
    });

    // Active link on scroll
    const sections = document.querySelectorAll('section[id]');

    window.addEventListener('scroll', () => {
        const scrollY = window.pageYOffset;

        sections.forEach(section => {
            const sectionHeight = section.offsetHeight;
            const sectionTop = section.offsetTop - 100;
            const sectionId = section.getAttribute('id');

            if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });
}

// ===================================
// Floating Quote System
// ===================================
function initFloatingQuote() {
    const floatingQuote = document.getElementById('floating-quote');
    const quoteText = floatingQuote.querySelector('.quote-text');
    const quoteAuthor = floatingQuote.querySelector('.quote-author');

    let currentQuoteIndex = 0;
    let lastScrollY = window.scrollY;
    let quoteVisible = false;
    let quoteTimeout = null;

    function showQuote() {
        const quote = animeQuotes[currentQuoteIndex];
        quoteText.textContent = `"${quote.text}"`;
        quoteAuthor.textContent = `— ${quote.author}, ${quote.anime}`;

        floatingQuote.classList.add('visible');
        quoteVisible = true;

        // Hide after 8 seconds
        clearTimeout(quoteTimeout);
        quoteTimeout = setTimeout(() => {
            floatingQuote.classList.remove('visible');
            quoteVisible = false;
            currentQuoteIndex = (currentQuoteIndex + 1) % animeQuotes.length;
        }, 8000);
    }

    // Show quote on significant scroll
    window.addEventListener('scroll', () => {
        const scrollDiff = Math.abs(window.scrollY - lastScrollY);

        if (scrollDiff > 300 && !quoteVisible && window.scrollY > 500) {
            showQuote();
            lastScrollY = window.scrollY;
        }
    });

    // Initial quote after 5 seconds
    setTimeout(() => {
        if (window.scrollY > 200) {
            showQuote();
        }
    }, 5000);
}

// ===================================
// Scroll Reveal Animation
// ===================================
function initScrollReveal() {
    const revealElements = document.querySelectorAll(
        '.timeline-item, .skill-category, .hobby-card, .stat, .contact-card, .section-header'
    );

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal', 'visible');
            }
        });
    }, observerOptions);

    revealElements.forEach(element => {
        element.classList.add('reveal');
        observer.observe(element);
    });
}

// ===================================
// Smooth Scroll for Anchor Links
// ===================================
function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ===================================
// Parallax Effect for Visual Card
// ===================================
function initParallax() {
    const visualCard = document.querySelector('.visual-card');

    if (visualCard && window.innerWidth > 768) {
        document.addEventListener('mousemove', (e) => {
            const x = (e.clientX / window.innerWidth - 0.5) * 20;
            const y = (e.clientY / window.innerHeight - 0.5) * 20;

            visualCard.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        });
    }
}

// ===================================
// Counter Animation for Stats
// ===================================
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');

    const observerOptions = {
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const value = counter.textContent;
                const numValue = parseFloat(value);
                const suffix = value.replace(/[0-9.]/g, '');

                if (!isNaN(numValue) && !counter.classList.contains('animated')) {
                    counter.classList.add('animated');
                    animateValue(counter, 0, numValue, 1500, suffix);
                }

                observer.unobserve(counter);
            }
        });
    }, observerOptions);

    counters.forEach(counter => observer.observe(counter));
}

function animateValue(element, start, end, duration, suffix) {
    const startTime = performance.now();
    const isDecimal = end % 1 !== 0;

    function update(currentTime) {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = start + (end - start) * easeOutQuart;

        if (isDecimal) {
            element.textContent = currentValue.toFixed(2) + suffix;
        } else {
            element.textContent = Math.floor(currentValue) + suffix;
        }

        if (progress < 1) {
            requestAnimationFrame(update);
        } else {
            element.textContent = end + suffix;
        }
    }

    requestAnimationFrame(update);
}

// ===================================
// Skill Pills Hover Effect
// ===================================
function initSkillHoverEffect() {
    const pills = document.querySelectorAll('.pill');

    pills.forEach(pill => {
        pill.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-3px) scale(1.05)';
        });

        pill.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// ===================================
// Timeline Animation
// ===================================
function initTimelineAnimation() {
    const timelineItems = document.querySelectorAll('.timeline-item');

    timelineItems.forEach((item, index) => {
        item.style.transitionDelay = `${index * 0.15}s`;
    });
}

// ===================================
// Easter Egg: Konami Code
// ===================================
function initKonamiCode() {
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'KeyB', 'KeyA'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.code === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activateEasterEgg();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });
}

function activateEasterEgg() {
    // Show a special One Piece themed animation
    const overlay = document.createElement('div');
    overlay.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.9);
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        z-index: 9999;
        animation: fadeIn 0.5s ease;
    `;

    overlay.innerHTML = `
        <div style="text-align: center; color: white; padding: 2rem;">
            <h2 style="font-size: 3rem; margin-bottom: 1rem; background: linear-gradient(135deg, #f59e0b, #ef4444); -webkit-background-clip: text; -webkit-text-fill-color: transparent;">
                🏴‍☠️ Nakama Mode Activated! 🏴‍☠️
            </h2>
            <p style="font-size: 1.5rem; color: #94a3b8; margin-bottom: 2rem;">
                "I'm going to be King of the Pirates!"
            </p>
            <p style="color: #64748b; font-size: 0.9rem;">Click anywhere to close</p>
        </div>
    `;

    overlay.addEventListener('click', () => {
        overlay.style.animation = 'fadeOut 0.3s ease forwards';
        setTimeout(() => overlay.remove(), 300);
    });

    document.body.appendChild(overlay);

    // Add keyframe animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; }
            to { opacity: 1; }
        }
        @keyframes fadeOut {
            from { opacity: 1; }
            to { opacity: 0; }
        }
    `;
    document.head.appendChild(style);
}

// ===================================
// Section Loader - Loads HTML partials
// ===================================
const sections = [
    { id: 'section-hero', file: 'sections/hero.html' },
    { id: 'section-about', file: 'sections/about.html' },
    { id: 'section-experience', file: 'sections/experience.html' },
    { id: 'section-skills', file: 'sections/skills.html' },
    { id: 'section-education', file: 'sections/education.html' },
    { id: 'section-resume', file: 'sections/resume.html' },
    { id: 'section-contact', file: 'sections/contact.html' },
    { id: 'section-footer', file: 'sections/footer.html' }
];

async function loadSections() {
    const loadPromises = sections.map(async (section) => {
        try {
            const response = await fetch(section.file);
            if (response.ok) {
                const html = await response.text();
                const container = document.getElementById(section.id);
                if (container) {
                    container.innerHTML = html;
                }
            }
        } catch (error) {
            console.warn(`Could not load ${section.file}:`, error);
        }
    });

    await Promise.all(loadPromises);
}

// ===================================
// Initialize Everything
// ===================================
document.addEventListener('DOMContentLoaded', async () => {
    // Load all sections first
    await loadSections();

    // Then initialize all functionality
    typeText();
    initNavigation();
    initFloatingQuote();
    initScrollReveal();
    initSmoothScroll();
    initParallax();
    animateCounters();
    initSkillHoverEffect();
    initTimelineAnimation();
    initKonamiCode();
});

// Handle page visibility changes
document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
        document.title = '‼️Come back | Antony Bush';
    } else {
        document.title = 'Antony Bush | Backend Software Engineer';
    }
});
