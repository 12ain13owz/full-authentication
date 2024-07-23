import { Component, inject } from '@angular/core';
import { UserService } from '../../services/user.service';
import { DisplayUser } from '../../../../shared/models/user.model';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrl: './user.component.scss',
})
export class UserComponent {
  private subscription: Subscription;
  private userService = inject(UserService);

  columns: string[] = [
    'no',
    'avatar',
    'email',
    'name',
    'verified',
    'active',
    'roles',
  ];
  users: DisplayUser[] = [];
  isLoading$ = this.userService.isLoading$;

  ngOnInit(): void {
    this.userService.getUsers();
    this.subscription = this.userService
      .getUsersForDisplay()
      .subscribe((users) => (this.users = users));
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }
}
