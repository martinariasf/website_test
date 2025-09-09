document.addEventListener('DOMContentLoaded', function() {
    const mainText = document.getElementById('main-text');
    
    mainText.addEventListener('click', function() {
        const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#96ceb4', '#feca57', '#ff9ff3'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        mainText.style.color = randomColor;
    });
    
    // Add a subtle animation
    setInterval(function() {
        mainText.style.textShadow = `0 4px 8px rgba(${Math.random() * 255}, ${Math.random() * 255}, ${Math.random() * 255}, 0.3)`;
    }, 2000);
});