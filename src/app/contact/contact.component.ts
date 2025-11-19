import { EmailService } from './../_services/email.service';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;

  constructor(private fb: FormBuilder, private emailService: EmailService) {}

  emailSending = false;
  emailSuccessful = false;
  error: string | null = null;

  // Added these so you can get the individual form controls and check their values and if they are valid
  get nameFc() {
    return this.contactForm.get('name');
  }

  get contactNumberFc() {
    return this.contactForm.get('contactNumber');
  }

  get emailFc() {
    return this.contactForm.get('email');
  }

  get messageFc() {
    return this.contactForm.get('message');
  }

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: [null, Validators.required],
      contactNumber: [null, Validators.required],
      email: [null, [Validators.required, Validators.email]],
      message: [null],
    });
  }

  // Calling email service
  public async sendEmail(event: Event) {
    event.preventDefault();
    
    if (this.contactForm.invalid) {
      // Mark all fields as touched to show validation errors
      Object.keys(this.contactForm.controls).forEach(key => {
        this.contactForm.get(key)?.markAsTouched();
      });
      return;
    }

    this.emailSending = true;
    this.emailSuccessful = false;
    this.error = null;

    try {
      const result = await this.emailService.sendEmail(
        this.nameFc?.value || '',
        this.emailFc?.value || '',
        this.contactNumberFc?.value || '',
        this.messageFc?.value || ''
      );

      if (result.success) {
        this.emailSuccessful = true;
        this.contactForm.reset();
        // Hide success message after 5 seconds
        setTimeout(() => {
          this.emailSuccessful = false;
        }, 5000);
      } else {
        this.error = result.error || 'Failed to send email. Please try again.';
      }
    } catch (error: any) {
      this.error = 'An unexpected error occurred. Please try again later.';
      console.error('Error sending email:', error);
    } finally {
      this.emailSending = false;
    }
  }
}
