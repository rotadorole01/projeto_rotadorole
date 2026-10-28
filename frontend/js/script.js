
'use strict';

// Rota do Rolê - JavaScript Principal

// ===== TEMA CLARO/ESCURO =====
class ThemeManager {
    constructor() {
        this.themeToggle = document.getElementById('themeToggle');
        this.body = document.body;
        this.icon = this.themeToggle
            ? this.themeToggle.querySelector('i')
            : null;

        this.init();
    }

    init() {
        const savedTheme = localStorage.getItem('theme');

        if (savedTheme === 'dark') {
            this.setDarkTheme();
        }

        if (this.themeToggle) {
            this.themeToggle.addEventListener('click', () => {
                this.toggleTheme();
            });
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

        if (!this.container) return;

        this.items = this.container.querySelectorAll('.carousel-item');
        this.dots = this.container.querySelectorAll('.carousel-dot');

        this.currentIndex = 0;
        this.autoPlayInterval = null;

        this.init();
    }

    init() {
        const prevBtn = this.container.querySelector('.carousel-btn.prev');
        const nextBtn = this.container.querySelector('.carousel-btn.next');

        if (prevBtn) {
            prevBtn.addEventListener('click', () => this.prev());
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => this.next());
        }

        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });

        if (this.items.length > 0) {
            this.autoPlay();
        }

        this.container.addEventListener('mouseenter', () => {
            this.stopAutoPlay();
        });

        this.container.addEventListener('mouseleave', () => {
            this.autoPlay();
        });
    }

    showSlide(index) {
        if (!this.items.length || !this.items[index]) return;

        this.items.forEach(item => {
            item.classList.remove('active');
        });

        this.dots.forEach(dot => {
            dot.classList.remove('active');
        });

        this.items[index].classList.add('active');

        if (this.dots[index]) {
            this.dots[index].classList.add('active');
        }
    }

    next() {
        if (!this.items.length) return;

        this.currentIndex =
            (this.currentIndex + 1) % this.items.length;

        this.showSlide(this.currentIndex);
    }

    prev() {
        if (!this.items.length) return;

        this.currentIndex =
            (this.currentIndex - 1 + this.items.length)
            % this.items.length;

        this.showSlide(this.currentIndex);
    }

    goToSlide(index) {
        this.currentIndex = index;
        this.showSlide(this.currentIndex);
    }

    autoPlay() {
        if (!this.items.length || this.autoPlayInterval) return;

        this.autoPlayInterval = setInterval(() => {
            this.next();
        }, 5000);
    }

    stopAutoPlay() {
        clearInterval(this.autoPlayInterval);
        this.autoPlayInterval = null;
    }
}


// ===== FILTROS DE EVENTOS =====
class EventFilter {
    constructor() {
        this.filterBtns = document.querySelectorAll('.filter-btn');
        this.eventCards = document.querySelectorAll('.event-card');

        if (this.filterBtns.length > 0) {
            this.init();
        }
    }

    init() {
        this.filterBtns.forEach(btn => {
            btn.addEventListener('click', e => {
                this.filterEvents(e);
            });
        });
    }

    filterEvents(e) {
        const btn = e.currentTarget;
        const category = btn.dataset.category;

        this.filterBtns.forEach(item => {
            item.classList.remove('active');
        });

        btn.classList.add('active');

        this.eventCards.forEach(card => {
            if (
                category === 'all' ||
                card.dataset.category === category
            ) {
                card.style.display = 'block';

                setTimeout(() => {
                    card.style.opacity = '1';
                }, 10);
            } else {
                card.style.opacity = '0';

                setTimeout(() => {
                    card.style.display = 'none';
                }, 300);
            }
        });
    }
}


// ===== VALIDAÇÃO DE FORMULÁRIOS =====
class FormValidator {
    constructor(formId) {
        this.form = document.getElementById(formId);

        if (this.form) {
            this.init();
        }
    }

    init() {
        this.form.addEventListener('submit', e => {
            this.handleSubmit(e);
        });
    }

    handleSubmit(e) {
        e.preventDefault();

        const inputs = this.form.querySelectorAll(
            'input, textarea, select'
        );

        let isValid = true;

        inputs.forEach(input => {
            if (
                !input.value.trim() &&
                input.hasAttribute('required')
            ) {
                this.showError(input, 'Este campo é obrigatório');
                isValid = false;
            } else {
                this.clearError(input);
            }
        });

        if (isValid) {
            alert(
                'Evento cadastrado com sucesso! Obrigado por contribuir com a Rota do Rolê.'
            );

            this.form.reset();
        }
    }

    showError(input, message) {
        input.style.borderColor = '#e74c3c';

        const existing = input.parentElement
            .querySelector('.error-message');

        if (existing) {
            existing.remove();
        }

        const errorMsg = document.createElement('span');

        errorMsg.className = 'error-message';
        errorMsg.style.color = '#e74c3c';
        errorMsg.style.fontSize = '0.85rem';
        errorMsg.style.marginTop = '0.3rem';
        errorMsg.textContent = message;

        input.parentElement.appendChild(errorMsg);
    }

    clearError(input) {
        input.style.borderColor = 'var(--border-color)';

        const errorMsg = input.parentElement
            .querySelector('.error-message');

        if (errorMsg) {
            errorMsg.remove();
        }
    }
}


// ===== FORMULÁRIO DE CADASTRO =====
// Corrige o erro da linha 207.
// Só adiciona o evento se o formulário existir.

function inicializarCadastro() {
    const form = document.getElementById('cadastroForm');

    if (!form) {
        return;
    }

    form.addEventListener('submit', function(event) {
        event.preventDefault();

        const nomeInput = document.getElementById('nome');
        const emailInput = document.getElementById('email');

        if (!nomeInput || !emailInput) {
            console.error(
                'Campos nome ou email não encontrados.'
            );
            return;
        }

        const nome = nomeInput.value.trim();
        const email = emailInput.value.trim();

        if (!nome || !email) {
            alert('Preencha nome e e-mail.');
            return;
        }

        alert(
            `Cadastro realizado com sucesso!\n\nNome: ${nome}\nE-mail: ${email}`
        );

        form.reset();
    });
}


// ===== INICIALIZAÇÃO DO DOM =====
document.addEventListener('DOMContentLoaded', function() {

    // Tema claro e escuro
    new ThemeManager();

    // Formulário de cadastro
    inicializarCadastro();


    // ===== DATA E HORÁRIO =====
    const dateInput = document.getElementById('data');
    const timeInput = document.getElementById('horario');

    if (dateInput) {

        const getLocalDate = () => {
            const now = new Date();

            const year = now.getFullYear();
            const month = String(now.getMonth() + 1)
                .padStart(2, '0');
            const day = String(now.getDate())
                .padStart(2, '0');

            return `${year}-${month}-${day}`;
        };

        dateInput.setAttribute('min', getLocalDate());

        const validateTime = () => {
            if (!timeInput) return;

            const selectedDate = dateInput.value;
            const now = new Date();
            const currentDate = getLocalDate();

            if (selectedDate === currentDate) {
                const currentHour = now.getHours()
                    .toString().padStart(2, '0');

                const currentMinutes = now.getMinutes()
                    .toString().padStart(2, '0');

                const currentTime =
                    `${currentHour}:${currentMinutes}`;

                timeInput.setAttribute('min', currentTime);
            } else {
                timeInput.removeAttribute('min');
            }
        };

        dateInput.addEventListener('change', validateTime);

        validateTime();
    }


    // ===== PREVIEW DE IMAGEM =====
    const imageInput = document.getElementById('imagem');
    const imagePreview = document.getElementById('imagePreview');

    if (imageInput && imagePreview) {

        imageInput.addEventListener('change', function() {
            const file = this.files[0];

            if (file) {
                const reader = new FileReader();

                reader.onload = function(e) {
                    const previewImg =
                        imagePreview.querySelector('img');

                    if (previewImg) {
                        previewImg.setAttribute(
                            'src',
                            e.target.result
                        );
                    }

                    imagePreview.style.display = 'block';
                };

                reader.readAsDataURL(file);

            } else {
                imagePreview.style.display = 'none';
            }
        });
    }


    // ===== INICIALIZAR CARROSSÉIS =====
    if (document.getElementById('mainCarousel')) {
        new Carousel('mainCarousel');
    }

    if (document.getElementById('partnersCarousel')) {
        new Carousel('partnersCarousel');
    }


    // ===== INICIALIZAR FILTROS =====
    new EventFilter();


    // ===== INICIALIZAR FORMULÁRIO DE EVENTOS =====
    new FormValidator('eventForm');


    // ===== ROLAGEM SUAVE =====
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {

        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');

            if (!href || href === '#') return;

            const target = document.querySelector(href);

            if (target) {
                e.preventDefault();

                target.scrollIntoView({
                    behavior: 'smooth'
                });
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

        if (!this.modal || !this.form) return;

        if (this.title) {
            this.title.textContent = isEdit
                ? 'Editar Cadastro'
                : 'Cadastrar Novo Local';
        }

        if (!isEdit) {
            this.form.reset();

            if (this.previewBox) {
                this.previewBox.innerHTML = `
                    <i class="fas fa-cloud-upload-alt fa-3x"
                       style="color: var(--border-color); margin-bottom: 10px;">
                    </i>
                    <p>Clique ou arraste uma imagem aqui</p>
                `;
            }
        }

        this.modal.classList.add('active');
    },

    closeModal: function() {
        if (this.modal) {
            this.modal.classList.remove('active');
        }
    },

    previewImage: function(input) {

        if (!this.previewBox || !input) return;

        const file = input.files[0];

        if (file) {
            const reader = new FileReader();

            reader.onload = (e) => {
                this.previewBox.innerHTML = `
                    <img src="${e.target.result}" alt="Preview">
                `;
            };

            reader.readAsDataURL(file);
        }
    },

    editItem: function(id) {

        console.log('Buscando dados do ID:', id);

        const titulo = document.getElementById('adminTitulo');
        const categoria = document.getElementById('adminCategoria');
        const local = document.getElementById('adminLocal');

        if (titulo) {
            titulo.value = 'Noite do Rock no Bar do Zé';
        }

        if (categoria) {
            categoria.value = 'bares';
        }

        if (local) {
            local.value = 'Taquaritinga, SP';
        }

        this.openModal(true);
    },

    deleteItem: function(id) {

        if (confirm(
            'Tem certeza que deseja excluir este item? Esta ação não pode ser desfeita.'
        )) {
            console.log('Deletando item ID:', id);

            // Integração DELETE com backend ainda pendente.
            alert('Exclusão ainda não integrada ao banco.');
        }
    },

    saveItem: function(e) {

        e.preventDefault();

        const titulo = document.getElementById('adminTitulo');
        const categoria = document.getElementById('adminCategoria');
        const local = document.getElementById('adminLocal');
        const fotoInput = document.getElementById('adminFoto');

        if (!titulo || !categoria || !local) {
            console.error('Campos administrativos não encontrados.');
            return;
        }

        const formData = new FormData();

        formData.append('titulo', titulo.value);
        formData.append('categoria', categoria.value);
        formData.append('local', local.value);

        if (fotoInput && fotoInput.files[0]) {
            formData.append('foto', fotoInput.files[0]);
        }

        // Integração POST/PUT com backend ainda pendente.
        console.log('Dados preparados:', [...formData.entries()]);

        alert('Dados preparados. Salvamento no banco ainda não integrado.');
        this.closeModal();
    }
};


// ===== FECHAR MODAL AO CLICAR FORA =====
window.addEventListener('click', e => {

    const modal = document.getElementById('adminModal');

    if (modal && e.target === modal) {
        adminManager.closeModal();
    }
});


// ===== TRADUTOR =====
// Adicione aqui a lógica do tradutor, se necessário.
