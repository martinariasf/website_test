document.addEventListener('DOMContentLoaded', function() {
    const learnMoreBtn = document.querySelector('.learn-more-btn');
    const carImage = document.querySelector('.car-image');
    
    learnMoreBtn.addEventListener('click', function() {
        alert('Thank you for your interest! More information coming soon.');
    });
    
    carImage.addEventListener('load', function() {
        console.log('Car image loaded successfully');
        this.style.opacity = '0';
        this.style.animation = 'fadeIn 1s ease-in forwards';
    });
    
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
        }
    `;
    document.head.appendChild(style);
});