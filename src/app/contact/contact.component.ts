import { Component, OnInit } from '@angular/core';
import { EmailService } from '../_services/email.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css'],
})
export class ContactComponent implements OnInit {
  contactForm!: FormGroup;
  emailSending = false;
  emailSuccessful = false;
  error = '';

  constructor(
    private emailService: EmailService,
    private formBuilder: FormBuilder,
    private title: Title,
    private meta: Meta
  ) {}

  get nameFc() {
    return this.contactForm.get('name');
  }

  get emailFc() {
    return this.contactForm.get('email');
  }

  get contactNumberFc() {
    return this.contactForm.get('contactNumber');
  }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      contactNumber: ['', [Validators.required]],
      message: [''],
    });

    this.title.setTitle('Contact Us | Partridgewood Projects - Building & Renovation Johannesburg');
    this.meta.updateTag({ name: 'description', content: 'Contact Partridgewood Projects in Johannesburg for a free quote. Call 061 428 4712, email partridgewoodprojects@gmail.com, or message us on WhatsApp.' });
    this.meta.updateTag({ property: 'og:title', content: 'Contact Us | Partridgewood Projects - Building & Renovation Johannesburg' });
    this.meta.updateTag({ property: 'og:description', content: 'Contact Partridgewood Projects in Johannesburg for a free quote on building, painting, damp proofing, tiling, and more.' });
    this.meta.updateTag({ name: 'twitter:title', content: 'Contact Us | Partridgewood Projects - Building & Renovation Johannesburg' });
    this.meta.updateTag({ name: 'twitter:description', content: 'Contact Partridgewood Projects in Johannesburg for a free quote on building, painting, damp proofing, tiling, and more.' });
  }

  async sendEmail(event: Event) {
    event.preventDefault();

    if (this.contactForm.invalid) {
      this.contactForm.markAllAsTouched();
      return;
    }

    this.emailSending = true;
    this.error = '';
    this.emailSuccessful = false;

    const { name, email, contactNumber, message } = this.contactForm.value;

    try {
      const result = await this.emailService.sendEmail(name, email, contactNumber, message);
      if (result.success) {
        this.emailSuccessful = true;
        this.contactForm.reset();
      } else {
        this.error = result.error || 'Failed to send email. Please try again later.';
      }
    } catch (err: any) {
      this.error = err?.message || 'Failed to send email. Please try again later.';
    } finally {
      this.emailSending = false;
    }
  }
}
