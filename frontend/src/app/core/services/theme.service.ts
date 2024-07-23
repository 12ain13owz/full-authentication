import {
  computed,
  effect,
  Injectable,
  Renderer2,
  RendererFactory2,
  signal,
} from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class ThemeService {
  private renderer: Renderer2;
  private isDarkTheme = signal<boolean>(false);

  currentTheme = computed(() => (this.isDarkTheme() ? 'dark' : 'light'));

  constructor(rendererFactory: RendererFactory2) {
    this.renderer = rendererFactory.createRenderer(null, null);
    this.loadTheme();

    effect(() => {
      this.saveTheme();
      this.renderer.removeClass(document.body, 'light-theme');
      this.renderer.removeClass(document.body, 'dark-theme');
      this.renderer.addClass(document.body, `${this.currentTheme()}-theme`);
    });
  }

  toggleTheme() {
    this.isDarkTheme.set(!this.isDarkTheme());
  }

  private loadTheme() {
    const isDarkTheme = localStorage.getItem('isDarkTheme');

    if (isDarkTheme !== null) {
      this.isDarkTheme.set(JSON.parse(isDarkTheme));
    } else {
      this.useSystemPreference();
    }
  }

  private useSystemPreference() {
    const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    this.isDarkTheme.set(isDark);
  }

  private saveTheme() {
    localStorage.setItem('isDarkTheme', JSON.stringify(this.isDarkTheme()));
  }
}
