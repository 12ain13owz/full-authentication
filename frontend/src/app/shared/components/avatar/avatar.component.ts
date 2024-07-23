import { Component, inject, output } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Observable, Subscription } from 'rxjs';
import { ImageCropperComponent } from './image-cropper/image-cropper.component';
import { mimeType } from './mime-type.validator';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { Avatar } from '../../models/profile.model';

@Component({
  selector: 'app-avatar',
  templateUrl: './avatar.component.html',
  styleUrl: './avatar.component.scss',
})
export class AvatarComponent {
  private readonly API_URL = environment.API_URL + 'api/v1/avatar';

  private http = inject(HttpClient);
  private fb = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private subscription: Subscription;

  form = this.ininForm();
  avatar = output<string>();
  validationField = {
    mimeType: 'Invalid file type. Please upload a valid image (PNG or JPG).',
  };

  ngOnInit(): void {
    this.subscription = this.imageFile.statusChanges.subscribe(
      (status) => status === 'VALID' && this.onProcessFile(this.imageFile.value)
    );
  }

  ngOnDestroy(): void {
    this.subscription?.unsubscribe();
  }

  openAvatarEditor(image: string): Observable<string> {
    const dialogRef = this.dialog.open(ImageCropperComponent, {
      minWidth: '60vw',
      minHeight: '60vh',
      data: image,
    });

    return dialogRef.afterClosed();
  }

  onFileChange(e: Event): void {
    const event = <HTMLInputElement>e.target;
    const file = event.files[0];
    if (!file) return;

    this.imageFile.setValue(file);
    this.imageFile.markAsTouched();
  }

  onProcessFile(file: File): void {
    const { name, type } = file;
    const objectUrl = URL.createObjectURL(file);

    this.resetInput();
    this.openAvatarEditor(objectUrl).subscribe((base64Image) => {
      if (base64Image) {
        const fileChange = this.dataUrlToFile(base64Image, name, type);
        this.imageUrl.setValue(base64Image);
        this.uploadAvatar(fileChange);
      }
    });
  }

  dataUrlToFile(base64Image: string, name: string, type: string): File {
    const byteCharacters = atob(base64Image.split(',')[1]);
    const byteNumbers = new Array(byteCharacters.length);

    for (let i = 0; i < byteCharacters.length; i++) {
      byteNumbers[i] = byteCharacters.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    const blob = new Blob([byteArray], { type });
    const file = new File([blob], name, { type });

    return file;
  }

  private uploadAvatar(file: File) {
    const formData = new FormData();
    formData.append('avatar', file);

    this.http.post<Avatar>(this.API_URL, formData).subscribe({
      next: (res) => this.avatar.emit(res.avatar),
      error: (err) => this.imageUrl.setValue(null),
    });
  }

  private resetInput(): void {
    const input = document.getElementById(
      'avatar-input-file'
    ) as HTMLInputElement;
    if (input) input.value = '';
  }

  get imageFile(): FormControl<File> {
    return this.form.controls['imageFile'];
  }

  get imageUrl(): FormControl<string> {
    return this.form.controls['imageUrl'];
  }

  private ininForm() {
    return this.fb.group({
      imageFile: this.fb.control<File>(null, {
        validators: [Validators.required],
        asyncValidators: [mimeType],
      }),
      imageUrl: [''],
    });
  }
}
