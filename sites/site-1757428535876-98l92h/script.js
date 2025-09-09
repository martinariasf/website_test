document.addEventListener('DOMContentLoaded', function() {
    const text = document.querySelector('.main-text');
    
    text.addEventListener('click', function() {
        text.style.color = '#' + Math.floor(Math.random()*16777215).toString(16);
    });
    
    console.log('Oh yeah website loaded!');
});