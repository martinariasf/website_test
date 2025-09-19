// Mobile menu toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

if (hamburger) {
    hamburger.addEventListener('click', () => {
        navMenu.classList.toggle('active');
    });
}

// Smooth scroll
function scrollToSection(sectionId) {
    const element = document.getElementById(sectionId);
    if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
    }
}

// Calculator modal
function openCalculator() {
    const modal = document.getElementById('calculator-modal');
    if (modal) {
        modal.style.display = 'block';
    }
}

// Close modal
const closeModal = document.querySelector('.close-modal');
if (closeModal) {
    closeModal.addEventListener('click', () => {
        document.getElementById('calculator-modal').style.display = 'none';
    });
}

// Close modal on outside click
window.addEventListener('click', (event) => {
    const modal = document.getElementById('calculator-modal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});

// Calculate payment
function calculatePayment() {
    const price = parseFloat(document.getElementById('car-price').value) || 30000;
    const downPayment = parseFloat(document.getElementById('down-payment').value) || 3000;
    const term = parseInt(document.getElementById('lease-term').value) || 36;
    
    const financeAmount = price - downPayment;
    const monthlyPayment = (financeAmount / term * 1.15).toFixed(2);
    
    const resultDiv = document.getElementById('result');
    resultDiv.style.display = 'block';
    resultDiv.innerHTML = `
        <h3>Your Estimated Monthly Payment</h3>
        <div style="font-size: 2.5rem; font-weight: 800; margin: 1rem 0;">£${monthlyPayment}</div>
        <p>For ${term} months with £${downPayment.toLocaleString()} down</p>
    `;
}

// Animate on scroll
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe all sections
document.addEventListener('DOMContentLoaded', () => {
    const sections = document.querySelectorAll('.deals-section, .process-section, .testimonials, .cta-section');
    sections.forEach(section => {
        section.style.opacity = '0';
        section.style.transform = 'translateY(30px)';
        section.style.transition = 'all 0.8s ease';
        observer.observe(section);
    });
    
    // Add animation to cards on hover
    const cards = document.querySelectorAll('.deal-card, .testimonial-card');
    cards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
    
    // Counter animation for stats
    let animated = false;
    function animateCounter(element, target, duration) {
        let start = 0;
        const increment = target / (duration / 16);
        
        const timer = setInterval(() => {
            start += increment;
            if (start > target) {
                element.textContent = target;
                clearInterval(timer);
            } else {
                element.textContent = Math.floor(start);
            }
        }, 16);
    }
    
    // Add parallax effect to hero
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });
    
    // Form validation
    const emailInput = document.querySelector('.email-input');
    const ctaButton = document.querySelector('.cta-form .btn-primary');
    
    if (ctaButton && emailInput) {
        ctaButton.addEventListener('click', (e) => {
            e.preventDefault();
            const email = emailInput.value;
            
            if (!email) {
                emailInput.style.border = '2px solid #ff4444';
                return;
            }
            
            if (!email.includes('@')) {
                emailInput.style.border = '2px solid #ff4444';
                return;
            }
            
            // Success animation
            ctaButton.textContent = 'Thank you! We\'ll be in touch soon.';
            ctaButton.style.background = '#4caf50';
            emailInput.value = '';
            emailInput.style.border = '2px solid #4caf50';
            
            setTimeout(() => {
                ctaButton.textContent = 'Get Free Quote';
                ctaButton.style.background = '';
                emailInput.style.border = '';
            }, 3000);
        });
        
        emailInput.addEventListener('input', () => {
            emailInput.style.border = '';
        });
    }
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.style.opacity = '0';
    setTimeout(() => {
        document.body.style.transition = 'opacity 0.5s';
        document.body.style.opacity = '1';
    }, 100);
});

console.log('LuxDrive - Premium Car Leasing Website Loaded Successfully');