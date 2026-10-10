// архитектурный подход State-Driven UI
const defaultData = [
    { id: 1, title: "Frontend-стажёр", company: "Башинформсвязь", description: "Верстка страниц на React, исправление мелких ошибок в интерфейсе под руководством наставника.", direction: "веб-разработка", format: "удалённо", skills: "HTML, CSS, JavaScript", isNew: true, date: Date.now() },
    { id: 2, title: "Стажёр-аналитик данных", company: "Яндекс", description: "Сбор и очистка данных, подготовка простых отчётов и дашбордов для продуктовой команды.", direction: "аналитика", format: "гибрид", skills: "Python, SQL, Excel", isNew: false, date: Date.now() - 86400000 },
    { id: 3, title: "UX/UI-дизайнер", company: "Т-Банк", description: "Создание макетов в Figma, проработка пользовательских сценариев, участие в тестировании.", direction: "дизайн", format: "в офисе", skills: "Figma, прототипирование", isNew: false, date: Date.now() - 172800000 },
    { id: 4, title: "Backend-стажёр", company: "Уралсиб", description: "Разработка простых REST API, работа с базой данных, написание документации.", direction: "разработка", format: "удалённо", skills: "Node.js, PostgreSQL", isNew: false, date: Date.now() - 200000000 },
    { id: 5, title: "Системный администратор (стажёр)", company: "Уфанет", description: "Ручное администрирование серверов, составление тест-кейсов, оформление баг-репортов.", direction: "тестирование", format: "в офисе", skills: "Linux, Windows server, Cisco, Docker", isNew: true, date: Date.now() },
    { id: 6, title: "Отладчик оборудования", company: "ОДК УМПО", description: "Настройка оборудования под нужды организации, мониторинг состояний, работа с ЧПУ.", direction: "инфраструктура", format: "в офисе", skills: "ЧПУ, оборудование", isNew: false, date: Date.now() - 300000000 }
];

const state = {
    items: [],
    searchQuery: '',
    filterFormat: 'all',
    sortBy: 'title-asc'
};

// сохранение данных в localstorage
function loadState() {
    const saved = localStorage.getItem('studstaz_items');
    if (saved) {
        try {
            state.items = JSON.parse(saved);
        } catch (e) {
            console.error("Ошибка парсинга localStorage", e);
            state.items = [...defaultData];
        }
    } else {
        state.items = [...defaultData];
    }
}

function saveState() {
    localStorage.setItem('studstaz_items', JSON.stringify(state.items));
}

// функция фильтрации и сортировки (иммутабельная сортировка 3.3)
function getProcessedItems() {
    let result = [...state.items];

    // динамический поиск (неважно А или а)
    if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        result = result.filter(item => 
            item.title.toLowerCase().includes(query) ||
            item.company.toLowerCase().includes(query) ||
            item.description.toLowerCase().includes(query) ||
            item.skills.toLowerCase().includes(query)
        );
    }

    // фильтрация
    if (state.filterFormat !== 'all') {
        result = result.filter(item => item.format === state.filterFormat);
    }

    // сортировка
    result.sort((a, b) => {
        if (state.sortBy === 'title-asc') {
            return a.title.localeCompare(b.title);
        } else if (state.sortBy === 'title-desc') {
            return b.title.localeCompare(a.title);
        } else if (state.sortBy === 'newest') {
            return b.date - a.date;
        }
        return 0;
    });

    return result;
}

// отрисовка интерфейса (state-driven UI)
function render() {
    const container = document.getElementById('cards-container');
    container.innerHTML = ''; // очистка перед перерисовкой

    const itemsToRender = getProcessedItems();

    if (itemsToRender.length === 0) {
        const emptyMsg = document.createElement('p');
        emptyMsg.textContent = 'По вашему запросу ничего не найдено.';
        emptyMsg.style.padding = '20px';
        emptyMsg.style.textAlign = 'center';
        container.appendChild(emptyMsg);
        return;
    }

    itemsToRender.forEach(item => {
        // безопасное создание дом элементов (защита от xss, без innerhtml для данных пользователя)
        const card = document.createElement('div');
        card.className = 'card';
        card.dataset.id = item.id;

        const videoPlaceholder = document.createElement('div');
        videoPlaceholder.className = 'card-video';
        
        const body = document.createElement('div');
        body.className = 'card-body';

        const titleRow = document.createElement('h3');
        const titleText = document.createTextNode(item.title);
        titleRow.appendChild(titleText);
        if (item.isNew) {
            const newLabel = document.createElement('span');
            newLabel.className = 'new-label';
            newLabel.textContent = 'НОВОЕ';
            titleRow.appendChild(newLabel);
        }

        const company = document.createElement('div');
        company.className = 'company';
        company.textContent = `Компания: ${item.company}`;

        const description = document.createElement('p');
        description.className = 'card-text';
        description.textContent = item.description;

        const props = document.createElement('div');
        props.className = 'props';
        
        const createProp = (dtText, ddText) => {
            const div = document.createElement('div');
            const dt = document.createElement('dt');
            dt.textContent = dtText;
            const dd = document.createElement('dd');
            dd.textContent = ddText;
            div.appendChild(dt);
            div.appendChild(document.createTextNode(': '));
            div.appendChild(dd);
            return div;
        };

        props.appendChild(createProp('Направление', item.direction));
        props.appendChild(createProp('Формат', item.format));
        props.appendChild(createProp('Навыки', item.skills));

        // кнопка удаления (обработчик вешается через делегирование на контейнер)
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'btn btn-delete';
        deleteBtn.textContent = 'Удалить';
        deleteBtn.dataset.id = item.id;

        body.appendChild(titleRow);
        body.appendChild(company);
        body.appendChild(description);
        body.appendChild(props);
        body.appendChild(deleteBtn);

        card.appendChild(videoPlaceholder);
        card.appendChild(body);
        container.appendChild(card);
    });
}

// клиентская валидация формы
function validateForm(form) {
    let isValid = true;
    // очистка старых ошибок
    form.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
    form.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));

    const inputs = form.querySelectorAll('input, select, textarea');
    inputs.forEach(input => {
        if (!input.validity.valid) {
            isValid = false;
            input.classList.add('invalid');
            const errorSpan = input.parentNode.querySelector('.error-msg');
            
            // понятные текстовые сообщения об ошибках
            if (input.validity.valueMissing) {
                errorSpan.textContent = 'Это поле обязательно для заполнения.';
            } else if (input.validity.tooShort) {
                errorSpan.textContent = `Минимальная длина: ${input.minLength} символов.`;
            } else {
                errorSpan.textContent = input.validationMessage || 'Некорректное значение.';
            }
        }
    });

    return isValid;
}

// управление модальным окном
const modalOverlay = document.getElementById('modal-overlay');
const addItemForm = document.getElementById('add-item-form');

function openModal() {
    modalOverlay.classList.remove('hidden');
    addItemForm.reset();
    addItemForm.querySelectorAll('.invalid').forEach(el => el.classList.remove('invalid'));
    addItemForm.querySelectorAll('.error-msg').forEach(el => el.textContent = '');
}

function closeModal() {
    modalOverlay.classList.add('hidden');
}

// обработчики событий
document.addEventListener('DOMContentLoaded', () => {
    loadState();
    render();

    // поиск в реальном времени
    document.getElementById('search-input').addEventListener('input', (e) => {
        state.searchQuery = e.target.value.trim();
        render();
    });

    // фильтрация
    document.getElementById('filter-format').addEventListener('change', (e) => {
        state.filterFormat = e.target.value;
        render();
    });

    // сортировка
    document.getElementById('sort-by').addEventListener('change', (e) => {
        state.sortBy = e.target.value;
        render();
    });

    // открытие/закрытие модального окна
    document.getElementById('open-modal-btn').addEventListener('click', openModal);
    document.getElementById('close-modal-btn').addEventListener('click', closeModal);
    document.getElementById('cancel-modal-btn').addEventListener('click', closeModal);
    
    // закрытие по клику на подложку (backdrop)
    modalOverlay.addEventListener('click', (e) => {
        if (e.target === modalOverlay) closeModal();
    });

    // закрытие по клавише Escape
    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && !modalOverlay.classList.contains('hidden')) {
            closeModal();
        }
    });

    // обработка отправки формы
    addItemForm.addEventListener('submit', (e) => {
        e.preventDefault(); // перехват отправки
        
        if (validateForm(addItemForm)) {
            const formData = new FormData(addItemForm);
            const newItem = {
                id: Date.now(), // уникальный id
                title: formData.get('title').trim(),
                company: formData.get('company').trim(),
                direction: formData.get('direction'),
                format: formData.get('format'),
                skills: formData.get('skills').trim(),
                description: formData.get('description').trim(),
                isNew: true,
                date: Date.now()
            };

            state.items.unshift(newItem); // добавляем в начало
            saveState(); // сохранение в localstorage
            render();
            closeModal();
        }
    });

    // удаление элемента через делегирование событий
    document.getElementById('cards-container').addEventListener('click', (e) => {
        const deleteBtn = e.target.closest('.btn-delete');
        if (deleteBtn) {
            const idToDelete = Number(deleteBtn.dataset.id);
            if (confirm('Вы уверены, что хотите удалить эту вакансию?')) {
                state.items = state.items.filter(item => item.id !== idToDelete);
                saveState();
                render();
            }
        }
    });
});