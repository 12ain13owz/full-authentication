import { Component, inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { UserService } from '../../../services/user.service';

@Component({
  selector: 'app-dialog-delete',
  templateUrl: './dialog-delete.component.html',
  styleUrl: './dialog-delete.component.scss',
})
export class DialogDeleteComponent {
  readonly data = inject(MAT_DIALOG_DATA);
  private userService = inject(UserService);

  dialogRef = inject(MatDialogRef<DialogDeleteComponent>);
  isLoading$ = this.userService.isLoading$;

  onConfirm(): void {
    this.userService
      .delete(this.data.id)
      .subscribe(() => this.dialogRef.close(true));
  }
}
