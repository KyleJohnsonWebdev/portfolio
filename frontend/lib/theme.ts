/** localStorage key for the visitor's theme choice ("light" or "dark"; absent means system). */
export const THEME_STORAGE_KEY = 'theme'

/**
 * Runs in <head> before first paint so a saved choice never flashes the wrong theme.
 * With no saved choice, tokens.css follows prefers-color-scheme on its own.
 */
export const themeScript = `(function(){try{var t=localStorage.getItem(${JSON.stringify(THEME_STORAGE_KEY)});if(t==='light'||t==='dark')document.documentElement.setAttribute('data-theme',t)}catch(e){}})()`
