document.addEventListener('DOMContentLoaded', function() {
  console.log('Evomotiv Birthday Countdown initialized');
  
  // Foundation date: March 1, 2008
  const foundationDate = new Date('2008-03-01T00:00:00');
  
  // DOM elements
  const yearsElement = document.getElementById('years');
  const daysElement = document.getElementById('days');
  const hoursElement = document.getElementById('hours');
  const minutesElement = document.getElementById('minutes');
  const totalTimeElement = document.getElementById('total-time');
  const progressBar = document.getElementById('progress-bar');
  const celebrationMessage = document.getElementById('celebration-message');
  const celebrateBtn = document.getElementById('celebrate-btn');
  
  // Celebration messages array
  const celebrationMessages = [
    '🎉 Another year of excellence! 🎉',
    '🚀 Innovation never stops! 🚀',
    '🎂 Growing stronger every year! 🎂',
    '🌟 Here\'s to many more years! 🌟',
    '🎊 Celebrating our journey! 🎊',
    '💫 Dreams turned into reality! 💫'
  ];
  
  // Confetti effect function
  function createConfetti() {
    const colors = ['#ee7203', '#034991', '#9b9699', '#ffffff'];
    const confettiCount = 50;
    
    for (let i = 0; i < confettiCount; i++) {
      const confetti = document.createElement('div');
      confetti.style.position = 'fixed';
      confetti.style.left = Math.random() * 100 + 'vw';
      confetti.style.top = '-10px';
      confetti.style.width = Math.random() * 8 + 4 + 'px';
      confetti.style.height = confetti.style.width;
      confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
      confetti.style.borderRadius = '50%';
      confetti.style.zIndex = '9999';
      confetti.style.pointerEvents = 'none';
      confetti.style.animation = `fall ${Math.random() * 3 + 2}s linear forwards`;
      
      document.body.appendChild(confetti);
      
      // Remove confetti after animation
      setTimeout(() => {
        if (confetti.parentNode) {
          confetti.parentNode.removeChild(confetti);
        }
      }, 5000);
    }
  }
  
  // Add CSS animation for falling confetti
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fall {
      from {
        transform: translateY(-100vh) rotate(0deg);
        opacity: 1;
      }
      to {
        transform: translateY(100vh) rotate(360deg);
        opacity: 0;
      }
    }
  `;
  document.head.appendChild(style);
  
  // Update countdown function
  function updateCountdown() {
    const now = new Date();
    const timeDifference = now - foundationDate;
    
    // Calculate time components
    const totalMinutes = Math.floor(timeDifference / (1000 * 60));
    const totalHours = Math.floor(timeDifference / (1000 * 60 * 60));
    const totalDays = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    const totalYears = Math.floor(totalDays / 365.25);
    
    // Calculate remaining time for display
    const remainingDays = Math.floor((timeDifference % (1000 * 60 * 60 * 24 * 365.25)) / (1000 * 60 * 60 * 24));
    const remainingHours = Math.floor((timeDifference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const remainingMinutes = Math.floor((timeDifference % (1000 * 60 * 60)) / (1000 * 60));
    
    // Update display elements
    yearsElement.textContent = totalYears.toLocaleString();
    daysElement.textContent = remainingDays.toLocaleString();
    hoursElement.textContent = remainingHours.toString().padStart(2, '0');
    minutesElement.textContent = remainingMinutes.toString().padStart(2, '0');
    
    // Update detailed time information
    totalTimeElement.innerHTML = `
      <strong>Total:</strong> ${totalDays.toLocaleString()} days, 
      ${totalHours.toLocaleString()} hours, 
      ${totalMinutes.toLocaleString()} minutes of excellence!
    `;
    
    // Calculate progress toward next year milestone
    const nextBirthday = new Date(now.getFullYear() + (now.getMonth() >= 2 ? 1 : 0), 2, 1); // March 1st
    const daysSinceLastBirthday = Math.floor((now - new Date(nextBirthday.getFullYear() - 1, 2, 1)) / (1000 * 60 * 60 * 24));
    const progressPercent = Math.min((daysSinceLastBirthday / 365) * 100, 100);
    
    progressBar.style.width = progressPercent + '%';
    
    // Add pulse animation to years counter every 10 seconds
    if (totalMinutes % 10 === 0 && remainingMinutes === 0) {
      yearsElement.style.animation = 'pulse 1s ease-in-out';
      setTimeout(() => {
        yearsElement.style.animation = '';
      }, 1000);
    }
  }
  
  // Celebrate button functionality
  celebrateBtn.addEventListener('click', function() {
    // Create confetti effect
    createConfetti();
    
    // Change celebration message
    const randomMessage = celebrationMessages[Math.floor(Math.random() * celebrationMessages.length)];
    celebrationMessage.textContent = randomMessage;
    
    // Add bounce animation to the message
    celebrationMessage.style.animation = 'bounce 1s ease-in-out';
    setTimeout(() => {
      celebrationMessage.style.animation = '';
    }, 1000);
    
    // Temporarily change button text
    const originalText = celebrateBtn.textContent;
    celebrateBtn.textContent = '🎊 Celebrating! 🎊';
    celebrateBtn.disabled = true;
    
    setTimeout(() => {
      celebrateBtn.textContent = originalText;
      celebrateBtn.disabled = false;
    }, 3000);
    
    console.log('Birthday celebration activated! 🎉');
  });
  
  // Add hover effects to countdown cards
  const countdownCards = document.querySelectorAll('.grid .card');
  countdownCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.style.transform = 'translateY(-5px)';
      this.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add special birthday date detection
  function checkForBirthday() {
    const today = new Date();
    const isBirthday = today.getMonth() === 2 && today.getDate() === 1; // March 1st
    
    if (isBirthday) {
      document.body.classList.add('birthday-special');
      celebrationMessage.textContent = '🎂 Happy Birthday Evomotiv! Today is our special day! 🎂';
      
      // Auto-celebrate on birthday
      setTimeout(() => {
        createConfetti();
      }, 2000);
      
      console.log('🎂 Today is Evomotiv\'s birthday! Special effects activated!');
    }
  }
  
  // Initialize countdown and set interval
  updateCountdown();
  setInterval(updateCountdown, 60000); // Update every minute
  
  // Check for birthday
  checkForBirthday();
  
  // Add some initial animation
  setTimeout(() => {
    const heroTitle = document.querySelector('.hero-title');
    if (heroTitle) {
      heroTitle.classList.add('fade-in-up');
    }
  }, 500);
  
  console.log(`Evomotiv has been operational for ${Math.floor((new Date() - foundationDate) / (1000 * 60 * 60 * 24))} days! 🎉`);
});