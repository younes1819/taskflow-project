import { THEME_KEY } from './constants.js';

/**
 * Aplica clase `dark` y estado visual del botón según `localStorage`.
 *
 * @param {HTMLButtonElement} themeButton
 */
export function applyStoredTheme(themeButton) {
    const dark = localStorage.getItem(THEME_KEY) === 'dark';
    document.body.classList.toggle('dark', dark);
    updateThemeToggleUi(themeButton, dark);
}

/**
 * @param {HTMLButtonElement} themeButton
 * @param {boolean} isDark
 */
export function updateThemeToggleUi(themeButton, isDark) {
    themeButton.textContent = isDark ? '☀️' : '🌙';
    themeButton.setAttribute(
        'aria-label',
        isDark ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'
    );
}

/**
 * Alterna tema, persiste y actualiza el botón.
 *
 * @param {HTMLButtonElement} themeButton
 */
export function toggleAndPersistTheme(themeButton) {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    localStorage.setItem(THEME_KEY, dark ? 'dark' : 'light');
    updateThemeToggleUi(themeButton, dark);
}
