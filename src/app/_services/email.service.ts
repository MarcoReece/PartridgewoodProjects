import { Injectable } from '@angular/core';
declare let Email: any;

@Injectable({
  providedIn: 'root',
})
export class EmailService {
  constructor() {}

  public async sendEmail(subject: string, body: string): Promise<boolean> {
    const response = Email.send({
      SecureToken: '12cd6490-ad1c-4d6e-bd46-ae2af55a94f0',
      To: 'marcodumbleton1@gmail.com',
      From: 'marcodumbleton1@gmail.com',
      Subject: subject,
      Body: body,
    }).then((message: any) => window.alert(message));

    if (response === 'OK') {
      return true;
    } else {
      return false;
    }
  }
}