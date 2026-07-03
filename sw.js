// 1. Инициализация при загрузке
document.addEventListener('DOMContentLoaded', () => {
    // Восстановление темы
    const savedTheme = localStorage.getItem('theme');
    applyTheme(savedTheme === 'dark');

    // Восстановление галочек
    document.querySelectorAll('.location-node').forEach(node => {
        const id = node.id.replace('node-', '');
        if (localStorage.getItem('visited-' + id) === 'true') {
            node.classList.add('visited');
        }
    });

    // Восстановление состояния дней
    ['day-1', 'day-2', 'day-3'].forEach(dayId => {
        if (localStorage.getItem('day-completed-' + dayId) === 'true') {
            document.getElementById('btn-' + dayId)?.classList.add('day-completed');
        }
    });

    // Восстановление скролла
    setTimeout(() => {
        const savedPos = localStorage.getItem('scrollPos');
        if (savedPos) window.scrollTo(0, parseInt(savedPos));
    }, 300);

    updateProgress();
});

// 2. ФУНКЦИЯ ТЕМЫ (та самая, которой не хватало)
function applyTheme(isDark) {
    const body = document.body;
    const btn = document.getElementById('theme-toggle');
    if (isDark) {
        body.classList.add('dark-theme');
        if (btn) btn.innerText = 'Light';
    } else {
        body.classList.remove('dark-theme');
        if (btn) btn.innerText = 'Dark';
    }
}

window.addEventListener('scroll', () => {
    localStorage.setItem('scrollPos', window.scrollY);
}, { passive: true });
