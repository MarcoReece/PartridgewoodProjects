import { Injectable } from '@angular/core';
import emailjs, { EmailJSResponseStatus } from '@emailjs/browser';

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  private readonly SERVICE_ID = 'service_0c5w9cj';
  private readonly TEMPLATE_ID = 'template_yeeife1';
  private readonly PUBLIC_KEY = 'mjvU9i_2LyyusUOXo';

  constructor() {
    // Initialize EmailJS with your public key
    emailjs.init(this.PUBLIC_KEY);
  }

  public async sendEmail(
    name: string,
    email: string,
    phone: string,
    message: string
  ): Promise<{ success: boolean; error?: string }> {
    try {
      const templateParams = {
        from_name: name,
        from_email: email,
        phone: phone,
        message: message,
        to_email: 'partridgewoodprojects@gmail.com', // Recipient email
      };

      const response = await emailjs.send(
        this.SERVICE_ID,
        this.TEMPLATE_ID,
        templateParams,
        this.PUBLIC_KEY
      );

      if (response.status === 200) {
        return { success: true };
      } else {
        return { success: false, error: 'Failed to send email' };
      }
    } catch (error: any) {
      console.error('EmailJS error:', error);
      return {
        success: false,
        error:
          error.text ||
          error.message ||
          'An error occurred while sending the email',
      };
    }
  }
}
