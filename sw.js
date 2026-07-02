document.addEventListener('DOMContentLoaded', () => {
    // 1. Восстановление темы
    if (localStorage.getItem('theme') === 'dark') {
        document.body.classList.add('dark-theme');
    }

    // 2. Восстановление галочек
    document.querySelectorAll('.location-node').forEach(node => {
        const id = node.id.replace('node-', '');
        if (localStorage.getItem('visited-' + id) === 'true') {
            node.classList.add('visited');
        }
    });

    // 3. Восстановление состояния дней
    ['day-1', 'day-2', 'day-3'].forEach(dayId => {
        if (localStorage.getItem('day-completed-' + dayId) === 'true') {
            document.getElementById('btn-' + dayId)?.classList.add('day-completed');
        }
    });

    // 4. Восстановление скролла
    setTimeout(() => {
        const savedPos = localStorage.getItem('scrollPos');
        if (savedPos) window.scrollTo(0, parseInt(savedPos));
    }, 300);

    updateProgress();
});

// --- ФУНКЦИИ ---

function updateProgress() {
    const active = document.querySelector('.route-container.active');
    if (!active) return;
    
    const all = active.querySelectorAll('.location-node');
    const visited = active.querySelectorAll('.location-node.visited');
    
    // Обновляем текст и бар
    document.getElementById('progress-text').innerText = `${visited.length} из ${all.length} локаций пройдено`;
    const bar = document.getElementById('progress-bar-fill');
    if (bar) bar.style.width = (all.length > 0 ? (visited.length / all.length) * 100 : 0) + '%';

    // ЛОГИКА ЗЕЛЕНОЙ КНОПКИ (добавлено)
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

// --- СОХРАНЕНИЕ СКРОЛЛА ---
window.addEventListener('scroll', () => {
    localStorage.setItem('scrollPos', window.scrollY);
}, { passive: true });

// ФУНКЦИЯ ТЕМЫ (добавлено)
function toggleTheme() {
    document.body.classList.toggle('dark-theme');
    const isDark = document.body.classList.contains('dark-theme');
    localStorage.setItem('theme', isDark ? 'dark' : 'light');
}



