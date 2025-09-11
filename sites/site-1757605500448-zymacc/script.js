let counter = 0;
const emojis = ['🔄', '✨', '🎯', '🚀', '⭐', '💫', '🎪', '🎨', '🎭', '🎪', '🌟', '⚡'];
const phrases = [
    'Again!',
    'One more time!',
    'Keep going!',
    'Don\'t stop!',
    'Yes, again!',
    'More!',
    'Repeat!',
    'Continue!',
    'Go on!',
    'Once more!'
];

const doItBtn = document.getElementById('doItBtn');
const counterDisplay = document.getElementById('counter');
const effectsContainer = document.getElementById('effects');
const resetBtn = document.getElementById('resetBtn');

doItBtn.addEventListener('click', function() {
    counter++;
    counterDisplay.textContent = counter;
    
    // Add pulse animation
    this.classList.add('pulse');
    setTimeout(() => this.classList.remove('pulse'), 300);
    
    // Change button text randomly
    if (counter > 1) {
        const randomPhrase = phrases[Math.floor(Math.random() * phrases.length)];
        this.textContent = randomPhrase;
    }
    
    // Add emoji effect
    if (counter % 5 === 0) {
        addEmojiEffect();
    }
    
    // Special effects at milestones
    if (counter === 10) {
        showMessage('🎉 10 times! Keep it up!');
    } else if (counter === 25) {
        showMessage('🔥 25 times! You\'re on fire!');
    } else if (counter === 50) {
        showMessage('💯 50 times! Incredible!');
    } else if (counter === 100) {
        showMessage('🏆 100 TIMES! LEGENDARY!');
    }
    
    // Change background gradient at certain intervals
    if (counter % 10 === 0) {
        changeBackgroundGradient();
    }
});

resetBtn.addEventListener('click', function() {
    counter = 0;
    counterDisplay.textContent = counter;
    effectsContainer.innerHTML = '';
    doItBtn.textContent = 'DO IT';
    document.body.style.background = 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)';
});

function addEmojiEffect() {
    const emoji = document.createElement('span');
    emoji.className = 'effect-item';
    emoji.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    effectsContainer.appendChild(emoji);
    
    // Remove old emojis if too many
    if (effectsContainer.children.length > 10) {
        effectsContainer.removeChild(effectsContainer.firstChild);
    }
}

function showMessage(msg) {
    const message = document.createElement('div');
    message.style.cssText = 'position: fixed; top: 20%; left: 50%; transform: translateX(-50%); background: white; padding: 1rem 2rem; border-radius: 10px; font-size: 1.5rem; box-shadow: 0 10px 30px rgba(0,0,0,0.3); z-index: 1000; animation: bounce 0.5s ease;';
    message.textContent = msg;
    document.body.appendChild(message);
    
    setTimeout(() => {
        message.remove();
    }, 2000);
}

function changeBackgroundGradient() {
    const gradients = [
        'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
        'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
        'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
        'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
        'linear-gradient(135deg, #30cfd0 0%, #330867 100%)'
    ];
    
    const randomGradient = gradients[Math.floor(Math.random() * gradients.length)];
    document.body.style.background = randomGradient;
}