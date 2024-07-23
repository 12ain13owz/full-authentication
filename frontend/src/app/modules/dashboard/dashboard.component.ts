import { Component, inject, viewChild } from '@angular/core';
import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { NavigationEnd, Router } from '@angular/router';
import {
  filter,
  map,
  Observable,
  shareReplay,
  Subscription,
  withLatestFrom,
} from 'rxjs';
import { AuthService } from '../../core/services/auth.service';
import { MatSidenav } from '@angular/material/sidenav';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  private subscription: Subscription;
  private breakpointObserver = inject(BreakpointObserver);
  private router = inject(Router);
  private authService = inject(AuthService);
  private profile = this.authService.getProfile();

  sidenav = viewChild<MatSidenav>('sidenav');
  isHandset$: Observable<boolean> = this.breakpointObserver
    .observe(Breakpoints.Handset)
    .pipe(
      map((result) => result.matches),
      shareReplay()
    );

  ngOnInit() {
    if (!this.profile.verified)
      this.router.navigate(['dashboard/verify-status']);

    this.subscription = this.router.events
      .pipe(
        withLatestFrom(this.isHandset$),
        filter(
          ([event, isHandset]) => isHandset && event instanceof NavigationEnd
        )
      )
      .subscribe(() => this.sidenav().close());
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
