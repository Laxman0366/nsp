import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatFormFieldModule, MatInputModule, MatButtonModule, FormsModule, TranslateModule],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent {
  private readonly http = inject(HttpClient);

  form = {
    name: '',
    email: '',
    message: '',
  };

  formError = '';
  submitInfo = '';

  submitContact(): void {
    this.formError = '';
    this.submitInfo = '';

    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.message.trim()) {
      this.formError = 'Please fill in all fields before submitting.';
      return;
    }

    if (!this.isValidEmail(this.form.email)) {
      this.formError = 'Please enter a valid email address.';
      return;
    }

    const subject = `Contact form message from ${this.form.name.trim()}`;
    const body = [
      `Name: ${this.form.name.trim()}`,
      `Email: ${this.form.email.trim()}`,
      '',
      'Message:',
      this.form.message.trim(),
    ].join('\n');

    this.http.post('/api/send-mail', {
      subject,
      body,
      name: this.form.name.trim(),
      email: this.form.email.trim(),
      message: this.form.message.trim(),
    }).subscribe({
      next: () => {
        this.submitInfo = 'Your message has been sent successfully.';
        this.form = {
          name: '',
          email: '',
          message: '',
        };
      },
      error: () => {
        this.formError = 'Unable to send your message right now. Please try again.';
      },
    });
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
}
