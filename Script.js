// Alterna menú hamburguesa
const toggle = document.getElementById('menuToggle');
const menu = document.getElementById('menu');
toggle.addEventListener('click', () => menu.classList.toggle('active'));

// Clase para carrusel
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

  getSlidesToShow() {
    if (window.innerWidth <= 600) return 1;
    if (window.innerWidth <= 900) return 2;
    return 4;
  }

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

  updateUI() {
    if (!this.slides.length) return;
    const slideWidth = this.slides[0].getBoundingClientRect().width + 20;
    const maxTranslate = (this.slides.length - this.slidesToShow) * slideWidth;
    const translateX = Math.min(this.currentIndex * slideWidth, maxTranslate);
    this.track.style.transform = `translateX(-${translateX}px)`;
  }

  moveToSlide(index) {
    const maxIndex = this.slides.length - this.slidesToShow;
    if (index < 0) this.currentIndex = maxIndex;
    else if (index > maxIndex) this.currentIndex = 0;
    else this.currentIndex = index;
    this.updateUI();
  }

  addEventListeners() {
    this.nextButton.addEventListener('click', () => this.moveToSlide(this.currentIndex + 1));
    this.prevButton.addEventListener('click', () => this.moveToSlide(this.currentIndex - 1));
  }
}

// Inicializa y maneja categorías
const carouselElement = document.querySelector('.carousel');
const carousel = new Carousel(carouselElement);

// Cargar JSON y mostrar por defecto "sueter"
let catalogData = [];
fetch('catalog.json')
  .then(res => res.json())
  .then(data => {
    catalogData = data;
    showCategory('sueter');
  })
  .catch(err => console.error('Error cargando catalog.json:', err));

// Función para mostrar categoría
function showCategory(category) {
  const filtered = catalogData.filter(item => item.category === category);
  carousel.loadSlides(filtered);
}

// Asignar botones del menú para filtrar
document.querySelectorAll('.menu a').forEach(btn => {
  btn.addEventListener('click', e => {
    e.preventDefault();
    const category = btn.dataset.category;
    showCategory(category);
  });
});
