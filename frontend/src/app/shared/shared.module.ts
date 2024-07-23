import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MaterialModule } from '../core/material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrModule } from 'ngx-toastr';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { ThemeToggleComponent } from './components/theme-toggle/theme-toggle.component';
import { AvatarComponent } from './components/avatar/avatar.component';
import { ImageCropperComponent } from './components/avatar/image-cropper/image-cropper.component';
import { ErrorFieldComponent } from './components/error-field/error-field.component';
import { ErrorMessagePipe } from './pipes/error-message.pipe';
import { ProgressBarComponent } from './components/progress-bar/progress-bar.component';
import { TableComponent } from './components/table/table.component';
import { SkeletonLoaderComponent } from './components/skeleton-loader/skeleton-loader.component';
import { RolePipe } from './pipes/role.pipe';

@NgModule({
  declarations: [
    ThemeToggleComponent,
    AvatarComponent,
    ImageCropperComponent,
    ErrorFieldComponent,
    ErrorMessagePipe,
    ProgressBarComponent,
    TableComponent,
    SkeletonLoaderComponent,
    RolePipe,
  ],
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ToastrModule.forRoot(),
    NgxSkeletonLoaderModule,
  ],
  exports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule,
    ThemeToggleComponent,
    AvatarComponent,
    ErrorFieldComponent,
    ProgressBarComponent,
    TableComponent,
    SkeletonLoaderComponent,
    RolePipe,
  ],
})
export class SharedModule {}
