document.addEventListener('DOMContentLoaded', function() {
  console.log('Generated Page initialized - ¡Hola!');
  
  // Get elements
  const greeting = document.getElementById('greeting');
  const greetBtn = document.getElementById('greetBtn');
  
  // Array of greetings
  const greetings = ['Hola', '¡Hola!', 'Hello', 'Hi', 'Hey', 'Greetings'];
  let currentIndex = 0;
  
  // Button click handler
  greetBtn.addEventListener('click', function() {
    // Cycle through greetings
    currentIndex = (currentIndex + 1) % greetings.length;
    greeting.textContent = greetings[currentIndex];
    
    // Add a simple animation effect
    greeting.style.transform = 'scale(1.1)';
    setTimeout(() => {
      greeting.style.transform = 'scale(1)';
    }, 200);
    
    console.log('Greeting changed to:', greetings[currentIndex]);
  });
  
  // Add transition style to greeting element
  greeting.style.transition = 'transform 0.2s ease-in-out';
});