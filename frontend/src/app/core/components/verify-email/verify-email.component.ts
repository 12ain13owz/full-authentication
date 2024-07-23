import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { map, Observable } from 'rxjs';
import { SharedModule } from '../../../shared/shared.module';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [SharedModule, RouterModule],
  templateUrl: './verify-email.component.html',
  styleUrl: './verify-email.component.scss',
})
export class VerifyEmailComponent {
  private route = inject(ActivatedRoute);
  message$: Observable<string>;

  ngOnInit(): void {
    this.message$ = this.route.data.pipe(map((data) => data['message']));
  }
}
