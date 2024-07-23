import { Component, inject } from '@angular/core';
import { filter, map, Observable, Subscription, take } from 'rxjs';
import { UserService } from '../../services/user.service';
import { DisplayDelete } from '../../../../shared/models/user.model';
import { MatDialog } from '@angular/material/dialog';
import { DialogDeleteComponent } from './dialog-delete/dialog-delete.component';

@Component({
  selector: 'app-delete',
  templateUrl: './delete.component.html',
  styleUrl: './delete.component.scss',
})
export class DeleteComponent {
  readonly dialog = inject(MatDialog);

  private subscription: Subscription;
  private userService = inject(UserService);

  columns: string[] = ['no', 'avatar', 'email', 'action'];
  users$: Observable<DisplayDelete[]>;
  isLoading$ = this.userService.isLoading$;

  ngOnInit(): void {
    this.userService.getUsers();
    this.users$ = this.userService.getUsersForDelete();
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  onDelete(id: number) {
    this.users$
      .pipe(
        take(1),
        map((users) => users.find((user) => user.id === id)),
        filter((user) => !!user)
      )
      .subscribe((user) =>
        this.dialog.open(DialogDeleteComponent, {
          width: '500px',
          data: user,
        })
      );
  }
}
