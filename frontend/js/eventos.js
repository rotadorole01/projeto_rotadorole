
    const API_URL = "http://localhost:3600/eventos";

    const carousel = document.getElementById("carousel");
    const dotsContainer = document.getElementById("carouselDots");

    let currentSlide = 0;
    let totalSlides = 0;

    async function carregarEventos() {
    try {

        const response = await fetch(API_URL);

        const result = await response.json();

        console.log(result);

        // Caso sua API retorne:
        // {message: "Success", data: [...] }

        const eventos = result.data;

        renderizarCarousel(eventos);

    } catch (error) {
        console.error("Erro ao carregar eventos:", error);
    }
  }

function renderizarCarousel(eventos) {

    carousel.innerHTML = "";
    dotsContainer.innerHTML = "";

    eventos.forEach((evento, index) => {

        const item = document.createElement("div");

        item.classList.add("carousel-item");

        if (index === 0) {
            item.classList.add("active");
          }

         item.style.backgroundImage = `url('http://localhost:3600/uploads/${evento.foto}')`;
         //item.style.backgroundImage = `url(http://localhost:3600/uploads/1.png)`;

        item.innerHTML = `
            <div class="carousel-item-overlay">
                <h3>${evento.titulo} - ${evento.id}</h3>
                <p>${evento.descricao}</p>
                <a href="eventos.html?id=${evento.id}" class="btn">
                Ver Evento
                </a>
            </div>
        `;

        carousel.appendChild(item);

        // dots
        const dot = document.createElement("span");

        dot.classList.add("carousel-dot");

        if (index === 0) {
            dot.classList.add("active");
          }

        dot.addEventListener("click", () => {
            mostrarSlide(index);
        });

        dotsContainer.appendChild(dot);
    });

    totalSlides = eventos.length;
  }

  function mostrarSlide(index) {

    const slides = document.querySelectorAll(".carousel-item");
    const dots = document.querySelectorAll(".carousel-dot");

    slides.forEach(slide => {
        slide.classList.remove("active");
    });

    dots.forEach(dot => {
        dot.classList.remove("active");
    });

    slides[index].classList.add("active");
    dots[index].classList.add("active");

    currentSlide = index;
  }

  document.getElementById("nextBtn").addEventListener("click", () => {

        currentSlide++;

    if (currentSlide >= totalSlides) {
        currentSlide = 0;
    }

    mostrarSlide(currentSlide);
  });

  document.getElementById("prevBtn").addEventListener("click", () => {

        currentSlide--;

    if (currentSlide < 0) {
        currentSlide = totalSlides - 1;
    }

    mostrarSlide(currentSlide);
  });

carregarEventos();
