import { Component, effect, inject, input } from '@angular/core';
import { ThemeService } from '../../../core/services/theme.service';

type form = 'card' | 'list';

@Component({
  selector: 'app-skeleton-loader',
  templateUrl: './skeleton-loader.component.html',
  styleUrl: './skeleton-loader.component.scss',
})
export class SkeletonLoaderComponent {
  private themeService = inject(ThemeService);

  theme: string;
  height = input<string>('50px');
  form = input<form>('card');
  backgroundColor = '#EFF1F5';
  repeatRowList = Array(20).fill(0);

  constructor() {
    effect(() => {
      this.theme = this.themeService.currentTheme();
      if (this.theme === 'light') this.backgroundColor = '#EFF1F5';
      else this.backgroundColor = '#323232';
    });
  }

  onRepeat(no: number) {
    return Array(no).fill(0);
  }
}
