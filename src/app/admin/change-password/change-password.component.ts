import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AbstractControl, FormControl, FormGroup, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MaterialModule } from '../../material.module';
import { apiEndpoints } from '../../api-endpoints';

const passwordsMatchValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const newPassword = control.get('newPassword')?.value;
  const confirmPassword = control.get('confirmPassword')?.value;
  return newPassword && confirmPassword && newPassword !== confirmPassword ? { passwordsMismatch: true } : null;
};

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [MaterialModule, ReactiveFormsModule],
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss'],
})
export class ChangePasswordComponent {
  isSubmitting = false;
  readonly form = new FormGroup(
    {
      newPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
      confirmPassword: new FormControl('', { nonNullable: true, validators: [Validators.required] }),
    },
    { validators: passwordsMatchValidator },
  );

  constructor(private readonly http: HttpClient, private readonly snackBar: MatSnackBar) {}

  submit(): void {
    if (this.form.invalid || this.isSubmitting) {
      this.form.markAllAsTouched();
      return;
    }

    this.isSubmitting = true;
    const { newPassword, confirmPassword } = this.form.getRawValue();

    this.http.post(apiEndpoints.changePassword, { new_password: newPassword, confirm_password: confirmPassword }).subscribe({
      next: () => {
        this.isSubmitting = false;
        this.form.reset();
        this.snackBar.open('Password changed successfully.', 'Close', { duration: 4000 });
      },
      error: () => {
        this.isSubmitting = false;
        this.snackBar.open('Unable to change password. Please try again.', 'Close', { duration: 4000 });
      },
    });
  }
}
