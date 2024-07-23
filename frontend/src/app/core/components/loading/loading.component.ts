import { Component, inject } from '@angular/core';
import { LoadingService } from '../../services/loading.service';
import { FadeInOut } from '../../../shared/animations/animation';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-loading',
  standalone: true,
  imports: [AsyncPipe],
  templateUrl: './loading.component.html',
  styleUrl: './loading.component.scss',
  animations: [FadeInOut(200, 200, true)],
})
export class LoadingComponent {
  private loadingService = inject(LoadingService);
  isLoading$ = this.loadingService.isLoading$;
}
