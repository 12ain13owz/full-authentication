import { Component, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { Device } from '../../../../shared/models/auth.model';
import { finalize } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import { DeviceDeleteComponent } from './device-delete/device-delete.component';

@Component({
  selector: 'app-device',
  templateUrl: './device.component.html',
  styleUrl: './device.component.scss',
})
export class DeviceComponent {
  readonly dialog = inject(MatDialog);

  authService = inject(AuthService);
  devices: Device[];
  isLoading = false;

  ngOnInit() {
    this.isLoading = true;
    this.authService
      .getAllDevices()
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe((devices) => (this.devices = devices));
  }

  openDialog(id: string) {
    this.dialog
      .open(DeviceDeleteComponent)
      .afterClosed()
      .subscribe((res) => {
        if (!res) return;
        this.removeDevice(id);
      });
  }

  removeDevice(id: string) {
    this.isLoading = true;
    this.authService
      .deleteDevice(id)
      .pipe(finalize(() => (this.isLoading = false)))
      .subscribe(() => {
        const index = this.devices.findIndex((device) => device.id === id);
        if (index !== -1) this.devices.splice(index, 1);
      });
  }
}
