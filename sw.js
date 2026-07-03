

window.addEventListener('scroll', () => {
    localStorage.setItem('scrollPos', window.scrollY);
}, { passive: true });
