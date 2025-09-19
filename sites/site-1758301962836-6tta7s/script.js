console.log('WELCOME TO LING\'S CARS - THE CRAZIEST CAR LEASING SITE!');

// Random colors for elements
setInterval(() => {
    const colors = ['#FF00FF', '#00FFFF', '#FFD700', '#00FF00', '#FF0000'];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    document.querySelectorAll('.deal-card').forEach(card => {
        card.style.borderColor = randomColor;
    });
}, 1000);

// Crazy cursor trail
let mouseX = 0, mouseY = 0;
let sparkles = [];

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    createSparkle();
});

function createSparkle() {
    const sparkle = document.createElement('div');
    sparkle.style.position = 'fixed';
    sparkle.style.left = mouseX + 'px';
    sparkle.style.top = mouseY + 'px';
    sparkle.style.pointerEvents = 'none';
    sparkle.style.fontSize = '20px';
    sparkle.style.zIndex = '9999';
    sparkle.innerHTML = ['✨', '⭐', '💫', '🌟'][Math.floor(Math.random() * 4)];
    document.body.appendChild(sparkle);
    
    setTimeout(() => {
        sparkle.remove();
    }, 1000);
}

// Explosion effect
function explode() {
    const explosion = document.createElement('div');
    explosion.style.position = 'fixed';
    explosion.style.top = '50%';
    explosion.style.left = '50%';
    explosion.style.transform = 'translate(-50%, -50%)';
    explosion.style.fontSize = '10em';
    explosion.style.zIndex = '10000';
    explosion.innerHTML = '💥';
    explosion.style.animation = 'explode 1s';
    document.body.appendChild(explosion);
    
    // Create confetti
    for(let i = 0; i < 50; i++) {
        createConfetti();
    }
    
    setTimeout(() => {
        explosion.remove();
    }, 1000);
    
    // Show popup
    setTimeout(() => {
        document.getElementById('popup').style.display = 'block';
    }, 500);
}

function createConfetti() {
    const confetti = document.createElement('div');
    confetti.style.position = 'fixed';
    confetti.style.left = Math.random() * 100 + '%';
    confetti.style.top = '-50px';
    confetti.style.fontSize = '30px';
    confetti.style.zIndex = '9998';
    confetti.innerHTML = ['🎊', '🎉', '🎈', '🎆'][Math.floor(Math.random() * 4)];
    confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear`;
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, 5000);
}

// Add falling animation
const style = document.createElement('style');
style.textContent = `
    @keyframes fall {
        to {
            top: 100vh;
            transform: rotate(360deg);
        }
    }
    @keyframes explode {
        0% { transform: translate(-50%, -50%) scale(0) rotate(0deg); }
        50% { transform: translate(-50%, -50%) scale(2) rotate(180deg); }
        100% { transform: translate(-50%, -50%) scale(0) rotate(360deg); }
    }
`;
document.head.appendChild(style);

// Close popup
function closePopup() {
    document.getElementById('popup').style.display = 'none';
    alert('THANK YOU! LING WILL CALL YOU SOON! 📞');
}

// Random alerts
const messages = [
    '🚗 LING HAS THE BEST DEALS!',
    '💰 SAVE MONEY WITH LING!',
    '🎯 YOU WON\'T FIND BETTER PRICES!',
    '🏆 LING IS NUMBER ONE!',
    '🎪 WELCOME TO THE CAR CIRCUS!'
];

setInterval(() => {
    if(Math.random() > 0.95) {
        console.log(messages[Math.floor(Math.random() * messages.length)]);
    }
}, 5000);

// Dancing title
setInterval(() => {
    const title = document.querySelector('.mega-title');
    if(title) {
        title.style.transform = `rotate(${Math.random() * 20 - 10}deg) scale(${Math.random() * 0.2 + 0.9})`;
    }
}, 100);

// Add random emojis to page
setInterval(() => {
    if(Math.random() > 0.9) {
        const emoji = document.createElement('div');
        emoji.style.position = 'fixed';
        emoji.style.left = Math.random() * 100 + '%';
        emoji.style.top = Math.random() * 100 + '%';
        emoji.style.fontSize = Math.random() * 50 + 20 + 'px';
        emoji.style.zIndex = '1';
        emoji.innerHTML = ['🚗', '💰', '🎉', '⭐', '🏁'][Math.floor(Math.random() * 5)];
        emoji.style.animation = 'bounce 2s infinite';
        document.body.appendChild(emoji);
        
        setTimeout(() => {
            emoji.remove();
        }, 3000);
    }
}, 2000);

// Sound effect on hover (simulated with console)
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('mouseenter', () => {
        console.log('🔊 BEEP BEEP!');
    });
});

// Page load celebration
window.addEventListener('load', () => {
    console.log('🎊🎊🎊 LING\'S CARS LOADED! 🎊🎊🎊');
    for(let i = 0; i < 20; i++) {
        setTimeout(() => createConfetti(), i * 100);
    }
});

// Disco mode
let discoMode = false;
setInterval(() => {
    if(Math.random() > 0.98) {
        discoMode = !discoMode;
        if(discoMode) {
            document.body.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
        } else {
            document.body.style.filter = 'none';
        }
    }
}, 1000);

// Matrix rain effect (simplified)
function createMatrixRain() {
    const matrix = document.createElement('div');
    matrix.style.position = 'fixed';
    matrix.style.left = Math.random() * 100 + '%';
    matrix.style.top = '-100px';
    matrix.style.color = '#00FF00';
    matrix.style.fontSize = '20px';
    matrix.style.zIndex = '1';
    matrix.style.fontFamily = 'monospace';
    matrix.innerHTML = '010110';
    matrix.style.animation = 'fall 3s linear';
    document.body.appendChild(matrix);
    
    setTimeout(() => {
        matrix.remove();
    }, 3000);
}

setInterval(() => {
    if(Math.random() > 0.95) {
        createMatrixRain();
    }
}, 500);