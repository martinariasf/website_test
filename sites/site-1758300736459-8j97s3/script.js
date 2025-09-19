// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            const offsetTop = target.offsetTop - 60;
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// Animated counter for stats
const animateCounter = (element, target) => {
    let current = 0;
    const increment = target / 100;
    const timer = setInterval(() => {
        current += increment;
        if (current >= target) {
            element.textContent = target;
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(current);
        }
    }, 20);
};

// Intersection Observer for stats animation
const statsSection = document.querySelector('.stats');
const statNumbers = document.querySelectorAll('.stat-number');
let hasAnimated = false;

if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !hasAnimated) {
                hasAnimated = true;
                statNumbers.forEach(stat => {
                    const target = parseInt(stat.getAttribute('data-target'));
                    animateCounter(stat, target);
                });
            }
        });
    }, { threshold: 0.5 });
    
    statsObserver.observe(statsSection);
}

// Form submission handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = {};
        formData.forEach((value, key) => {
            data[key] = value;
        });
        
        // Show success message (in real app, this would send to server)
        alert('Vielen Dank für Ihre Nachricht! Wir werden uns in Kürze bei Ihnen melden.');
        contactForm.reset();
    });
}

// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger && navMenu) {
    hamburger.addEventListener('click', () => {
        navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
        navMenu.style.position = 'absolute';
        navMenu.style.top = '100%';
        navMenu.style.left = '0';
        navMenu.style.width = '100%';
        navMenu.style.flexDirection = 'column';
        navMenu.style.background = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
        navMenu.style.padding = '1rem';
    });
}

// Add animation classes on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const animateOnScroll = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.animation = 'fadeInUp 0.6s forwards';
        }
    });
}, observerOptions);

// Apply animation to cards
document.querySelectorAll('.content-card, .case-card, .benefit-item').forEach(card => {
    card.style.opacity = '0';
    animateOnScroll.observe(card);
});

// Dynamic year in footer
const year = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText && footerText.textContent.includes('2024')) {
    footerText.textContent = footerText.textContent.replace('2024', year);
}

// Navbar background opacity on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'linear-gradient(135deg, rgba(37, 99, 235, 0.95) 0%, rgba(59, 130, 246, 0.95) 100%)';
    } else {
        navbar.style.background = 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)';
    }
});

console.log('GF Innovative Solutions - n8n Website loaded successfully');