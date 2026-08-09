import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { TranslateModule } from '@ngx-translate/core';

interface BankAccountDetails {
  bankCode: 'IOB' | 'SBI';
  bankName: string;
  accountName: string;
  accountNumber: string;
  ifsc: string;
  branch: string;
}

@Component({
  selector: 'app-donate-now',
  standalone: true,
  imports: [CommonModule, FormsModule, MatCardModule, MatButtonModule, MatFormFieldModule, MatInputModule, TranslateModule],
  templateUrl: './donate-now.component.html',
  styleUrls: ['./donate-now.component.scss']
})
export class DonateNowComponent {
  readonly accounts: BankAccountDetails[] = [
    {
      bankCode: 'IOB',
      bankName: 'Indian Overseas Bank (IOB)',
      accountName: 'Nilachal Seva Pratisthan',
      accountNumber: '119401000000012',
      ifsc: 'IOBA0001194',
      branch: 'Kanas',
    },
    {
      bankCode: 'SBI',
      bankName: 'State Bank of India (SBI)',
      accountName: 'Nilachal Seva Pratisthan',
      accountNumber: '34815810338',
      ifsc: 'SBIN0013570',
      branch: 'Kanas',
    },
  ];

  form = {
    name: '',
    email: '',
    phone: '',
    message: '',
  };

  formError = '';
  submitInfo = '';

  submitDonationContact(): void {
    this.formError = '';
    this.submitInfo = '';

    if (!this.form.name.trim() || !this.form.email.trim() || !this.form.phone.trim() || !this.form.message.trim()) {
      this.formError = 'Please fill in all fields before submitting.';
      return;
    }

    if (!this.isValidEmail(this.form.email)) {
      this.formError = 'Please enter a valid email address.';
      return;
    }

    const subject = `Donation enquiry from ${this.form.name.trim()}`;
    const body = [
      `Name: ${this.form.name.trim()}`,
      `Email: ${this.form.email.trim()}`,
      `Phone: ${this.form.phone.trim()}`,
      '',
      'Message:',
      this.form.message.trim(),
    ].join('\n');

    const mailtoUrl = `mailto:paikaraylaxman423@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    window.location.href = mailtoUrl;
    this.submitInfo = 'Your email app is opening with a prefilled message.';
  }

  private isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
  }
}
