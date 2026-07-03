// --- ДОБАВЬ ЭТО В САМЫЙ КОНЕЦ main.js ---

function updateDateDisplay() {
        const dateElement = document.getElementById('new-date-id'); 
    if (!dateElement) return;

    const now = new Date();
    // Форматируем дату (ДД.ММ.ГГГГ)
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    
    dateElement.innerText = `${String(now.getDate()).padStart(2, '0')}.${String(now.getMonth() + 1).padStart(2, '0')}.${now.getFullYear()}`;
}

document.addEventListener('DOMContentLoaded', () => {
    initApp();
});

// Используем pageshow, чтобы телефон перепроверял тему при переходе назад/вперед
window.addEventListener('pageshow', (event) => {
    initApp();
});

function initApp() {
    console.log("Инициализация приложения...");

    // 1. Работа с темой (вынесли в отдельную функцию для надежности)
    const themeToggle = document.getElementById('theme-toggle');
    const body = document.body;

    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        body.classList.add('dark-theme');
        if (themeToggle) themeToggle.textContent = 'Light';
    } else {
        body.classList.remove('dark-theme');
        if (themeToggle) themeToggle.textContent = 'Dark';
    }

    if (themeToggle) {
        // Убираем старый обработчик, чтобы не было дублей при pageshow
        themeToggle.replaceWith(themeToggle.cloneNode(true));
        const newToggle = document.getElementById('theme-toggle');
        
        newToggle.addEventListener('click', () => {
            const isDark = body.classList.toggle('dark-theme');
            localStorage.setItem('theme', isDark ? 'dark' : 'light');
            newToggle.textContent = isDark ? 'Light' : 'Dark';
        });
    }

    // 2. Вывод даты
    const dateElement = document.getElementById('date-element');
    if (dateElement) {
        dateElement.innerText = new Date().toLocaleDateString('ru-RU');
    }

    // 3. Восстановление данных (галочки, дни, скролл)
    document.querySelectorAll('.location-node').forEach(node => {
        const id = node.id.replace('node-', '');
        if (localStorage.getItem('visited-' + id) === 'true') {
            node.classList.add('visited');
        }
    });

    ['day-1', 'day-2', 'day-3'].forEach(dayId => {
        if (localStorage.getItem('day-completed-' + dayId) === 'true') {
            const btn = document.getElementById('btn-' + dayId);
            if (btn) btn.classList.add('day-completed');
        }
    });

    setTimeout(() => {
        const savedPos = localStorage.getItem('scrollPos');
        if (savedPos) window.scrollTo(0, parseInt(savedPos));
    }, 300);

    if (typeof updateProgress === 'function') {
        updateProgress();
    }
}




const themeToggle = document.getElementById('theme-toggle'); // Убедись, что ID кнопки такой
if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.body.classList.toggle('dark-theme');
        applyTheme(isDark);
    });
}

// 2. ФУНКЦИЯ ТЕМЫ (та самая, которой не хватало)
// Функция применения темы
function applyTheme(isDark) {
    if (isDark) {
        document.body.classList.add('dark-theme');
        localStorage.setItem('theme', 'dark'); // Сохраняем выбор
    } else {
        document.body.classList.remove('dark-theme');
        localStorage.setItem('theme', 'light'); // Сохраняем выбор
    }
}

function toggleTheme() {
    const isDark = document.body.classList.contains('dark-theme');
    applyTheme(!isDark);
    localStorage.setItem('theme', !isDark ? 'dark' : 'light');
}

// 3. ФУНКЦИИ МАРШРУТА (они были у тебя, проверь, чтобы они были ПОСЛЕ функций темы)
function updateProgress() {
    const active = document.querySelector('.route-container.active');
    if (!active) return;
    const all = active.querySelectorAll('.location-node');
    const visited = active.querySelectorAll('.location-node.visited');
    document.getElementById('progress-text').innerText = `${visited.length} из ${all.length} локаций пройдено`;
    const bar = document.getElementById('progress-bar-fill');
    if (bar) bar.style.width = (all.length > 0 ? (visited.length / all.length) * 100 : 0) + '%';
    
    const dayId = active.id;
    const btn = document.getElementById('btn-' + dayId);
    if (all.length > 0 && all.length === visited.length) {
        btn?.classList.add('day-completed');
        localStorage.setItem('day-completed-' + dayId, 'true');
    } else {
        btn?.classList.remove('day-completed');
        localStorage.setItem('day-completed-' + dayId, 'false');
    }
}

function toggleVisited(event, id) {
    if (event) event.stopPropagation();
    const node = document.getElementById('node-' + id);
    if (!node) return;
    node.classList.toggle('visited');
    localStorage.setItem('visited-' + id, node.classList.contains('visited'));
    updateProgress();
    if (navigator.vibrate) navigator.vibrate(100);
}

function switchDay(dayNum) {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.route-container').forEach(c => c.classList.remove('active'));
    document.getElementById(`btn-day-${dayNum}`)?.classList.add('active');
    document.getElementById(`day-${dayNum}`)?.classList.add('active');
    window.scrollTo(0, 0); 
    updateProgress();
}


// Этот код слушает, если localStorage меняется в другой вкладке
window.addEventListener('storage', (event) => {
    if (event.key === 'theme') {
        applyTheme(event.newValue === 'dark');
    }
});
