
// login 
const form = document.getElementById('cadastroForm');

form.addEventListener('submit', function(event){
  event.preventDefault();

  const nome = document.getElementById('nome').value;
  const email = document.getElementById('email').value;

  alert(
    `Cadastro realizado com sucesso!\n\nNome: ${nome}\nE-mail: ${email}`
  );

  form.reset();
});

// ===== INICIALIZAR QUANDO O DOM ESTIVER PRONTO =====
document.addEventListener('DOMContentLoaded', function() {
    // Inicializa Gerenciador de Temas
    new ThemeManager();

    const dateInput = document.getElementById('data');
    if (dateInput) {
        const today = new Date().toISOString().split('T')[0];
        dateInput.setAttribute('min', today);
        
        const timeInput = document.getElementById('horario');
        
        const validateTime = () => {
            const selectedDate = dateInput.value;
            const now = new Date();
            const currentDate = now.toISOString().split('T')[0];
            
            if (selectedDate === currentDate) {
                const currentHour = now.getHours().toString().padStart(2, '0');
                const currentMinutes = now.getMinutes().toString().padStart(2, '0');
                const currentTime = `${currentHour}:${currentMinutes}`;
                timeInput.setAttribute('min', currentTime);
            } else {
                timeInput.removeAttribute('min');
            }
        };

        dateInput.addEventListener('change', validateTime);
        validateTime();
    }

    const imageInput = document.getElementById('imagem');
    const imagePreview = document.getElementById('imagePreview');
    if (imageInput && imagePreview) {
        imageInput.addEventListener('change', function() {
            const file = this.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    imagePreview.querySelector('img').setAttribute('src', e.target.result);
                    imagePreview.style.display = 'block';
                }
                reader.readAsDataURL(file);
            } else {
                imagePreview.style.display = 'none';
            }
        });
    }

    if (document.getElementById('mainCarousel')) new Carousel('mainCarousel');
    if (document.getElementById('partnersCarousel')) new Carousel('partnersCarousel');
    new EventFilter();
    new FormValidator('eventForm');

    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});
