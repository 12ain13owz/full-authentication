import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

type Theme = 'light' | 'dark';

@Component({
  selector: 'app-theme-toggle',
  templateUrl: './theme-toggle.component.html',
  styleUrl: './theme-toggle.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ThemeToggleComponent {
  private themeService = inject(ThemeService);
  theme = this.themeService.currentTheme() === 'dark';

  toggleTheme() {
    this.themeService.toggleTheme();
  }
}
