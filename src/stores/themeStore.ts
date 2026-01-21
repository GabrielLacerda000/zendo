import { defineStore } from 'pinia';
import { ref, watch } from 'vue';

export type Theme = 'light' | 'dark';

const THEME_STORAGE_KEY = 'zendo-theme';

export const useThemeStore = defineStore('theme', () => {
  // Initialize theme from localStorage or system preference
  const getInitialTheme = (): Theme => {
    const stored = localStorage.getItem(THEME_STORAGE_KEY);
    if (stored === 'light' || stored === 'dark') {
      return stored;
    }

    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }

    return 'light';
  };

  const theme = ref<Theme>(getInitialTheme());

  // Apply theme class to document
  const applyTheme = (newTheme: Theme) => {
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  // Apply initial theme
  applyTheme(theme.value);

  // Watch for theme changes and persist
  watch(theme, (newTheme) => {
    applyTheme(newTheme);
    localStorage.setItem(THEME_STORAGE_KEY, newTheme);
  });

  const toggleTheme = () => {
    theme.value = theme.value === 'light' ? 'dark' : 'light';
  };

  const setTheme = (newTheme: Theme) => {
    theme.value = newTheme;
  };

  return {
    theme,
    toggleTheme,
    setTheme
  };
});
