console.log('Welcome to Go2Rental!');

document.addEventListener('DOMContentLoaded', function() {
    const title = document.querySelector('.main-title');
    
    title.addEventListener('click', function() {
        this.style.transform = 'scale(1.1)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 200);
    });
    
    title.style.cursor = 'pointer';
    title.style.transition = 'transform 0.2s ease';
});