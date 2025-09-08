// ============================
// SCRIPT.JS
// ============================

// Alterna men� hamburguesa en m�viles
const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');

toggle.addEventListener('click', () => {
  menu.classList.toggle('active');
});

// ============================
// Clase modular para carrusel
// ============================
class Carousel {
  constructor(carouselElement) {
    this.carousel = carouselElement;
    this.track = this.carousel.querySelector('.carousel-track');
    this.prevButton = this.carousel.querySelector('.carousel-button.left');
    this.nextButton = this.carousel.querySelector('.carousel-button.right');
    this.slides = [];
    this.currentIndex = 0;
    this.slidesToShow = this.getSlidesToShow();

    this.addEventListeners();
    window.addEventListener('resize', () => {
      this.slidesToShow = this.getSlidesToShow();
      this.updateUI();
    });
  }

  // Determina cu�ntas slides mostrar seg�n ancho de pantalla
  getSlidesToShow() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 4;
  }

  // Carga los slides a partir de un arreglo de datos
  loadSlides(slidesData) {
    this.track.innerHTML = '';
    slidesData.forEach(data => {
      const div = document.createElement('div');
      div.className = 'carousel-slide';

      const img = document.createElement('img');
      img.src = data.src;
      img.alt = data.alt;

      div.appendChild(img);
      this.track.appendChild(div);
    });

    this.slides = Array.from(this.track.children);
    this.currentIndex = 0;
    this.updateUI();
  }

  // Actualiza la posici�n de la pista seg�n el �ndice actual
  updateUI() {
    if (!this.slides.length) return;
    const slideWidth = this.slides[0].getBoundingClientRect().width + 20; // incluye gap
    const maxTranslate = (this.slides.length - this.slidesToShow) * slideWidth;
    const translateX = Math.min(this.currentIndex * slideWidth, maxTranslate);
    this.track.style.transform = `translateX(-${translateX}px)`;
  }

  // Mueve el carrusel a un �ndice espec�fico
  moveToSlide(index) {
    const maxIndex = this.slides.length - this.slidesToShow;
    if (index < 0) this.currentIndex = maxIndex;
    else if (index > maxIndex) this.currentIndex = 0;
    else this.currentIndex = index;

    this.updateUI();
  }

  // Asigna eventos a botones de navegaci�n
  addEventListeners() {
    this.nextButton.addEventListener('click', () => this.moveToSlide(this.currentIndex + 1));
    this.prevButton.addEventListener('click', () => this.moveToSlide(this.currentIndex - 1));
  }
}

// ============================
// Inicializaci�n y manejo de categor�as
// ============================
const carouselElement = document.querySelector('.carousel');
const carousel = new Carousel(carouselElement);

// Variable global para almacenar datos del JSON
let catalogData = [];

// Funci�n para mostrar una categor�a

function showCategory(category) {
  const filtered = catalogData.filter(item => item.category === category);
  carousel.loadSlides(filtered);

  // Actualizar din�micamente el t�tulo del cat�logo
  const catalogTitle = document.getElementById('catalog-title');
  if (catalogTitle) {
    catalogTitle.textContent = `Cat�logo: ${category.charAt(0).toUpperCase() + category.slice(1)}`;
  }
}

// Cargar JSON y mostrar por defecto "sueter"
fetch('catalog.json')
  .then(res => res.json())
  .then(data => {
    catalogData = data;
    showCategory('sueter'); // categor�a inicial
  })
  .catch(err => console.error('Error cargando catalog.json:', err));

// Asignar botones del men� para filtrar
document.querySelectorAll('.menu a').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const category = btn.dataset.category;
    if (category) showCategory(category);
  });
});
