document.addEventListener('DOMContentLoaded', function() {
    const mainText = document.querySelector('.main-text');
    
    mainText.addEventListener('click', function() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#ffeaa7', '#dda0dd'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        mainText.style.color = randomColor;
    });
    
    console.log('Simple "si" website loaded successfully!');
});