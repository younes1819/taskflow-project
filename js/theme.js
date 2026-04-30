/**
 * Aplica el tema inicial en memoria (claro por defecto).
 *
 * @param {HTMLButtonElement} themeButton
 */
export function applyStoredTheme(themeButton) {
    const dark = document.body.classList.contains('dark');
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
 * Alterna tema y actualiza el botón.
 *
 * @param {HTMLButtonElement} themeButton
 */
export function toggleAndPersistTheme(themeButton) {
    document.body.classList.toggle('dark');
    const dark = document.body.classList.contains('dark');
    updateThemeToggleUi(themeButton, dark);
}
