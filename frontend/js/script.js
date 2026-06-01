// Rota do Rolê - JavaScript Principal

// ===== TEMA CLARO/ESCURO =====
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.icon = this.themeToggle ? this.themeToggle.querySelector('i') : null;
        
        this.init();
    }

    init() {
        // Verifica preferência salva
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'dark') {
            this.setDarkTheme();
        }

        // Listener do botão
        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => this.toggleTheme());
        }
    }

    toggleTheme() {
        if (this.body.getAttribute('data-theme') === 'dark') {
            this.setLightTheme();
        } else {
            this.setDarkTheme();
        }
    }

    setDarkTheme() {
        this.body.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (this.icon) {
            this.icon.classList.remove('fa-moon');
            this.icon.classList.add('fa-sun');
        }
    }

    setLightTheme() {
        this.body.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (this.icon) {
            this.icon.classList.remove('fa-sun');
            this.icon.classList.add('fa-moon');
        }
    }
}

// ===== CARROSSEL =====
class Carousel {
    constructor(containerId) {
        this.container = document.getElementById(containerId);
        if(!this.container) return; // Proteção caso não exista na página
        this.items = this.container.querySelectorAll('.carousel-item');
        this.dots = this.container.querySelectorAll('.carousel-dot');
        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        const prevBtn = this.container.querySelector('.carousel-btn.prev');
        const nextBtn = this.container.querySelector('.carousel-btn.next');

        if (prevBtn) prevBtn.addEventListener('click', () => this.prev());
        if (nextBtn) nextBtn.addEventListener('click', () => this.next());

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        this.autoPlay();
        
        this.container.addEventListener('mouseenter', () => this.stopAutoPlay());
        this.container.addEventListener('mouseleave', () => this.autoPlay());
    }

    showSlide(index) {
        this.items.forEach(item => item.classList.remove('active'));
        this.dots.forEach(dot => dot.classList.remove('active'));

        this.items[index].classList.add('active');
        this.dots[index].classList.add('active');
    }

    // next() {
    //     this.currentIndex = (this.currentIndex + 1) % this.items.length;
    //     this.showSlide(this.currentIndex);
    // }

    // prev() {
    //     this.currentIndex = (this.currentIndex - 1 + this.items.length) % this.items.length;
    //     this.showSlide(this.currentIndex);
    // }

    goToSlide(index) {
        this.currentIndex = index;
        this.showSlide(this.currentIndex);
    }

    autoPlay() {
        this.autoPlayInterval = setInterval(() => this.next(), 5000);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
    }
}

// ===== FILTROS DE EVENTOS =====
class EventFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.eventCards = document.querySelectorAll('.event-card');

        if(this.filterBtns.length > 0) this.init();
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterEvents(e));
        });
    }

    filterEvents(e) {
        const category = e.target.dataset.category;

        this.filterBtns.forEach(btn => btn.classList.remove('active'));
        e.target.classList.add('active');

        this.eventCards.forEach(card => {
            if (category === 'all' || card.dataset.category === category) {
                card.style.display = 'block';
                setTimeout(() => card.style.opacity = '1', 10);
            } else {
                card.style.opacity = '0';
                setTimeout(() => card.style.display = 'none', 300);
            }
        });
    }
}

// ===== VALIDAÇÃO DE FORMULÁRIO =====
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);
        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    handleSubmit(e) {
        e.preventDefault();

        const inputs = this.form.querySelectorAll('input, textarea, select');
        let isValid = true;

        inputs.forEach(input => {
            if (!input.value.trim() && input.hasAttribute('required')) {
                this.showError(input, 'Este campo é obrigatório');
                isValid = false;
            } else {
                this.clearError(input);
            }
        });

        if (isValid) {
            alert('Evento cadastrado com sucesso! Obrigado por contribuir com a Rota do Rolê.');
            this.form.reset();
        }
    }

    showError(input, message) {
        input.style.borderColor = '#e74c3c';
        const errorMsg = document.createElement('span');
        errorMsg.className = 'error-message';
        errorMsg.style.color = '#e74c3c';
        errorMsg.style.fontSize = '0.85rem';
        errorMsg.style.marginTop = '0.3rem';
        errorMsg.textContent = message;

        const existing = input.parentElement.querySelector('.error-message');
        if (existing) existing.remove();

        input.parentElement.appendChild(errorMsg);
    }

    clearError(input) {
        input.style.borderColor = 'var(--border-color)';
        const errorMsg = input.parentElement.querySelector('.error-message');
        if (errorMsg) errorMsg.remove();
    }
}

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





// ===== LÓGICA DO PAINEL ADMINISTRATIVO =====
const adminManager = {
    modal: document.getElementById('adminModal'),
    form: document.getElementById('adminForm'),
    title: document.getElementById('modalTitle'),
    previewBox: document.getElementById('adminImagePreview'),
    
    openModal: function(isEdit = false) {
        if(!this.modal) return;
        this.title.textContent = isEdit ? 'Editar Cadastro' : 'Cadastrar Novo Local';
        
        // Se for novo cadastro, limpa o formulário e a foto
        if(!isEdit) {
            this.form.reset();
            this.previewBox.innerHTML = `
                <i class="fas fa-cloud-upload-alt fa-3x" style="color: var(--border-color); margin-bottom: 10px;"></i>
                <p>Clique ou arraste uma imagem aqui</p>
            `;
        }
        
        this.modal.classList.add('active');
    },

    closeModal: function() {
        if(this.modal) this.modal.classList.remove('active');
    },

    previewImage: function(input) {
        const file = input.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                this.previewBox.innerHTML = `<img src="${e.target.result}" alt="Preview">`;
            }
            reader.readAsDataURL(file);
        }
    },

    editItem: function(id) {
        // Aqui futuramente você fará um fetch() no Node.js para buscar os dados pelo ID
        console.log("Buscando dados do ID:", id);
        
        // Simulando o preenchimento dos campos para edição
        document.getElementById('adminTitulo').value = "Noite do Rock no Bar do Zé";
        document.getElementById('adminCategoria').value = "bares";
        document.getElementById('adminLocal').value = "Taquaritinga, SP";
        
        this.openModal(true);
    },

    deleteItem: function(id) {
        if(confirm("Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.")) {
            // Aqui futuramente você fará o DELETE via Node.js/Express
            console.log("Deletando item ID:", id);
            alert("Item excluído com sucesso!");
            // Lógica para remover a linha da tabela entra aqui
        }
    },

    saveItem: function(e) {
        e.preventDefault();
        
        // Coleta os dados para enviar pro backend
        const formData = new FormData();
        formData.append('titulo', document.getElementById('adminTitulo').value);
        formData.append('categoria', document.getElementById('adminCategoria').value);
        formData.append('local', document.getElementById('adminLocal').value);
        
        const fotoInput = document.getElementById('adminFoto');
        if(fotoInput.files[0]) {
            formData.append('foto', fotoInput.files[0]);
        }

        // Aqui você usará o fetch() POST ou PUT para mandar pro seu backend
        console.log("Salvando dados...");
        alert("Dados salvos com sucesso!");
        this.closeModal();
    }
};

// Fechar modal ao clicar fora dele (background escuro)
window.addEventListener('click', (e) => {
    const modal = document.getElementById('adminModal');
    if (e.target === modal) {
        adminManager.closeModal();
    }
});

//Tradutor