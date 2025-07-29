// Minimal EmailService for debugging
export class EmailService {
  private static instance: EmailService;

  static getInstance(): EmailService {
    if (!EmailService.instance) {
      EmailService.instance = new EmailService();
    }
    return EmailService.instance;
  }

  async sendWelcomeEmailReact(email: string, customerName: string): Promise<boolean> {
    console.log('Welcome email would be sent to:', email, 'for:', customerName);
    return true;
  }

  async sendBookingConfirmationReact(email: string, data: any): Promise<boolean> {
    console.log('Booking confirmation email would be sent to:', email);
    return true;
  }

  async sendBookingCancellationReact(email: string, data: any): Promise<boolean> {
    console.log('Booking cancellation email would be sent to:', email);
    return true;
  }

  async sendPaymentFailedReact(email: string, data: any): Promise<boolean> {
    console.log('Payment failed email would be sent to:', email);
    return true;
  }

  async sendBookingReminderReact(email: string, data: any): Promise<boolean> {
    console.log('Booking reminder email would be sent to:', email);
    return true;
  }

  async sendPasswordResetReact(email: string, data: any): Promise<boolean> {
    console.log('Password reset email would be sent to:', email);
    return true;
  }

  async sendTourUpdateReact(email: string, data: any): Promise<boolean> {
    console.log('Tour update email would be sent to:', email);
    return true;
  }

  async sendPromotionalReact(email: string, data: any): Promise<boolean> {
    console.log('Promotional email would be sent to:', email);
    return true;
  }
}

export const emailService = EmailService.getInstance();
