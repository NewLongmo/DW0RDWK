import { defineStore } from 'pinia';

export type ThemeMode = 'light' | 'dark';
export type Density = 'default' | 'compact';

const THEME_KEY = 'dw0rdwk_theme';
const DENSITY_KEY = 'dw0rdwk_density';

function readTheme(): ThemeMode {
  return localStorage.getItem(THEME_KEY) === 'dark' ? 'dark' : 'light';
}

function readDensity(): Density {
  return localStorage.getItem(DENSITY_KEY) === 'compact' ? 'compact' : 'default';
}

function applyThemeAttr(theme: ThemeMode) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.theme = theme;
  }
}

function applyDensityAttr(density: Density) {
  if (typeof document !== 'undefined') {
    document.documentElement.dataset.density = density;
  }
}

export const useAppStore = defineStore('app', {
  state: () => ({
    collapsed: false,
    account: localStorage.getItem('dw0rdwk_account') || '',
    role: localStorage.getItem('dw0rdwk_role') || '',
    theme: readTheme(),
    density: readDensity(),
  }),
  actions: {
    toggleCollapsed() {
      this.collapsed = !this.collapsed;
    },
    setAccount(account: string) {
      this.account = account;
      if (account) {
        localStorage.setItem('dw0rdwk_account', account);
      } else {
        localStorage.removeItem('dw0rdwk_account');
      }
    },
    setRole(role: string) {
      this.role = role;
      if (role) {
        localStorage.setItem('dw0rdwk_role', role);
      } else {
        localStorage.removeItem('dw0rdwk_role');
      }
    },
    setTheme(theme: ThemeMode) {
      this.theme = theme;
      localStorage.setItem(THEME_KEY, theme);
      applyThemeAttr(theme);
    },
    toggleTheme() {
      this.setTheme(this.theme === 'dark' ? 'light' : 'dark');
    },
    setDensity(density: Density) {
      this.density = density;
      localStorage.setItem(DENSITY_KEY, density);
      applyDensityAttr(density);
    },
    toggleDensity() {
      this.setDensity(this.density === 'compact' ? 'default' : 'compact');
    },
  },
});
