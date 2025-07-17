document.addEventListener('DOMContentLoaded', function() {
  // Configurar input numérico
  const inputNum = document.getElementById('max-num');
  inputNum.addEventListener('input', function() {
    if (this.value > 100) this.value = 100;
    if (this.value < 1) this.value = '';
  });
});

function sortearNumero() {
  const maxInput = document.getElementById("max-num");
  const max = parseInt(maxInput.value);
  const res = document.getElementById("resultado-sorteo");
  
  // Validación
  if (isNaN(max) || max < 1 || max > 100) {
    res.innerHTML = '<span class="error"><i class="fas fa-exclamation-circle"></i> Ingresa un número entre 1 y 100</span>';
    maxInput.focus();
    return;
  }
  
  // Deshabilitar botón durante el sorteo
  const btn = document.querySelector('.btn-accent');
  btn.disabled = true;
  
  iniciarAnimacionSorteo(max, res, btn);
}

function iniciarAnimacionSorteo(max, res, btn) {
  res.innerHTML = '';
  res.style.minHeight = '120px';
  
  const animContainer = document.createElement('div');
  animContainer.className = 'spinner';
  animContainer.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Preparando sorteo...';
  res.appendChild(animContainer);
  
  setTimeout(() => {
    animContainer.remove();
    animacionNumerosAleatorios(max, res, btn);
  }, 800);
}

function animacionNumerosAleatorios(max, res, btn) {
  const duration = 3000;
  const interval = 100;
  const steps = duration / interval;
  let currentStep = 0;
  
  const numDisplay = document.createElement('div');
  numDisplay.className = 'number-animation';
  res.appendChild(numDisplay);
  
  const timer = setInterval(() => {
    currentStep++;
    const progress = currentStep / steps;
    const randomNum = Math.floor(Math.random() * max) + 1;
    
    numDisplay.textContent = randomNum;
    
    if (progress > 0.7) {
      const intensity = (progress - 0.7) / 0.3;
      numDisplay.style.transform = `scale(${1 + intensity * 0.3})`;
    }
    
    if (currentStep >= steps) {
      clearInterval(timer);
      mostrarNumeroGanador(max, res, btn);
    }
  }, interval);
}

function mostrarNumeroGanador(max, res, btn) {
  const ganador = Math.floor(Math.random() * max) + 1;
  
  res.innerHTML = '';
  
  const winnerContainer = document.createElement('div');
  winnerContainer.className = 'winner-container';
  
  // Crear confeti
  for (let i = 0; i < 10; i++) {
    const confetti = document.createElement('div');
    confetti.className = 'confetti';
    
    const colors = ['var(--primary)', 'var(--accent)', 'var(--success)', 'var(--warning)'];
    const leftPos = Math.random() * 100;
    const animDuration = 3 + Math.random() * 3;
    const animDelay = Math.random() * 2;
    const size = 8 + Math.random() * 10;
    
    confetti.style.left = `${leftPos}%`;
    confetti.style.width = `${size}px`;
    confetti.style.height = `${size}px`;
    confetti.style.background = colors[Math.floor(Math.random() * colors.length)];
    confetti.style.borderRadius = Math.random() > 0.7 ? '0' : '50%';
    confetti.style.animationDuration = `${animDuration}s`;
    confetti.style.animationDelay = `${animDelay}s`;
    
    winnerContainer.appendChild(confetti);
  }
  
  const winnerNumber = document.createElement('div');
  winnerNumber.className = 'winner-number';
  winnerNumber.textContent = ganador;
  
  const winnerText = document.createElement('div');
  winnerText.className = 'winner-text';
  winnerText.textContent = '¡Número Ganador!';
  
  winnerContainer.appendChild(winnerNumber);
  winnerContainer.appendChild(winnerText);
  res.appendChild(winnerContainer);
  
  // Rehabilitar botón
  setTimeout(() => {
    btn.disabled = false;
  }, 2000);
}