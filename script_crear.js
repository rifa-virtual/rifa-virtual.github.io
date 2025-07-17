document.addEventListener('DOMContentLoaded', function() {
  // Configurar fecha mínima (mañana)
  const fechaInput = document.getElementById('fecha');
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);
  fechaInput.min = tomorrow.toISOString().split('T')[0];
  
  // Validación en tiempo real para cantidad
  const cantidadInput = document.getElementById('cantidad');
  cantidadInput.addEventListener('input', function() {
    if (this.value > 100) this.value = 100;
    if (this.value < 1) this.value = '';
  });
  
  // Manejo del formulario
  const form = document.getElementById("form-rifa");
  form.addEventListener("submit", function(e) {
    e.preventDefault();
    generarRifa();
  });
});

function generarRifa() {
  // Obtener valores
  const titulo = document.getElementById("titulo").value.trim();
  const premio = document.getElementById("premio").value.trim();
  const fechaInput = document.getElementById("fecha").value;
  let cantidad = parseInt(document.getElementById("cantidad").value) || 0;
  
  // Validaciones
  if (!titulo || titulo.length < 5) {
    mostrarError("El título debe tener al menos 5 caracteres");
    return;
  }
  
  if (!premio || premio.length < 5) {
    mostrarError("La descripción del premio debe tener al menos 5 caracteres");
    return;
  }
  
  if (!fechaInput) {
    mostrarError("Selecciona una fecha válida para el sorteo");
    return;
  }
  
  if (cantidad < 1 || cantidad > 100) {
    mostrarError("La cantidad de números debe ser entre 1 y 100");
    return;
  }
  
  // Formatear fecha
  const fecha = new Date(fechaInput);
  const opcionesFecha = { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  };
  const fechaFormateada = fecha.toLocaleDateString('es-ES', opcionesFecha);
  
  // Crear vista previa
  const container = document.createElement("div");
  container.className = "rifa-preview";
  
  // Encabezado
  const header = document.createElement("div");
  header.className = "rifa-header";
  
  const h2 = document.createElement("h2");
  h2.className = "rifa-title";
  h2.textContent = titulo;
  
  const details = document.createElement("div");
  details.className = "rifa-details";
  
  const prize = document.createElement("p");
  prize.innerHTML = `<strong><i class="fas fa-trophy"></i> Premio:</strong> ${premio}`;
  
  const date = document.createElement("p");
  date.innerHTML = `<strong><i class="fas fa-calendar-star"></i> Sorteo:</strong> ${fechaFormateada}`;
  
  const numbersInfo = document.createElement("p");
  numbersInfo.innerHTML = `<strong><i class="fas fa-ticket-alt"></i> Números:</strong> ${cantidad}`;
  
  details.appendChild(prize);
  details.appendChild(date);
  details.appendChild(numbersInfo);
  header.appendChild(h2);
  header.appendChild(details);
  container.appendChild(header);
  
  // Grid de números con mejor espaciado
  const grid = document.createElement("div");
  grid.className = "grid-container";
  
  for (let i = 1; i <= cantidad; i++) {
    const box = document.createElement("div");
    box.className = "number-box";
    
    const numberSpan = document.createElement("span");
    numberSpan.textContent = i;
    box.appendChild(numberSpan);
    
    grid.appendChild(box);
  }
  
  container.appendChild(grid);
  
  // Mostrar vista previa
  const preview = document.getElementById("preview-container");
  preview.innerHTML = "";
  preview.appendChild(container);
  
  // Generar imagen
  generarImagen(container, titulo);
}

function generarImagen(container, titulo) {
  const options = {
    scale: 2,
    logging: false,
    useCORS: true,
    allowTaint: false,
    backgroundColor: '#ffffff',
    scrollX: 0,
    scrollY: 0,
    windowWidth: container.scrollWidth,
    windowHeight: container.scrollHeight,
    onclone: function(clonedDoc) {
      const clonedContainer = clonedDoc.getElementById('preview-container');
      clonedContainer.style.padding = '0';
      clonedContainer.style.boxShadow = 'none';
      clonedContainer.style.width = container.scrollWidth + 'px';
    }
  };
  
  // Mostrar loader
  const loader = document.createElement('div');
  loader.className = 'spinner';
  loader.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generando imagen...';
  document.getElementById('preview-container').appendChild(loader);
  
  html2canvas(container, options).then(canvas => {
    loader.remove();
    
    // Crear botón de descarga
    const btn = document.createElement("a");
    btn.className = "btn btn-accent";
    btn.innerHTML = '<i class="fas fa-download"></i> Descargar Rifa';
    btn.download = `Rifa_${titulo.replace(/[^\w\s]/gi, '').replace(/\s+/g, '_')}.png`;
    btn.href = canvas.toDataURL("image/png", 1.0);
    
    const btnContainer = document.createElement("div");
    btnContainer.className = "download-container";
    btnContainer.appendChild(btn);
    
    document.getElementById('preview-container').appendChild(btnContainer);
  }).catch(err => {
    console.error('Error al generar imagen:', err);
    loader.innerHTML = '<span class="error"><i class="fas fa-exclamation-triangle"></i> Error al generar la imagen</span>';
  });
}

function mostrarError(mensaje) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.innerHTML = `<i class="fas fa-exclamation-circle"></i> ${mensaje}`;
  
  const preview = document.getElementById("preview-container");
  preview.innerHTML = '';
  preview.appendChild(errorDiv);
}