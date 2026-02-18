import { MJMLTemplateRenderer } from '@/modules/notifications/mjml-renderer';

interface EnquiryEmailData {
  to: string;
  pgName: string;
  visitorName: string;
  visitorEmail: string;
  visitorPhone: string;
  message: string;
  occupation?: string;
  roomType?: string;
  moveInDate?: string;
}

interface ConfirmationEmailData {
  to: string;
  visitorName: string;
  pgName: string;
  contactInfo?: {
    phone?: string;
    email?: string;
  };
}

export class EmailService {
  // Send enquiry notification to PG owner (using MJML templates)
  static async sendEnquiryNotification(data: EnquiryEmailData) {
    try {

      // Generate professional HTML email using MJML template
      const mjmlTemplate = MJMLTemplateRenderer.renderEnquiryNotification({
        pgName: data.pgName,
        visitorName: data.visitorName,
        visitorEmail: data.visitorEmail,
        visitorPhone: data.visitorPhone,
        message: data.message,
        occupation: data.occupation,
        roomType: data.roomType,
        moveInDate: data.moveInDate ? new Date(data.moveInDate).toLocaleDateString() : undefined,
      });

      // TODO: Convert MJML to HTML and send via email service
      // For now, we'll just log the MJML template and return success
      
      return { 
        success: true, 
        messageId: `mock_${Date.now()}`,
        note: 'Email service not configured - MJML template generated and logged to console',
        mjmlTemplate: mjmlTemplate // Include template for debugging
      };
    } catch (error) {
      console.error('Failed to send enquiry notification:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Send confirmation email to visitor (using MJML templates)
  static async sendEnquiryConfirmation(data: ConfirmationEmailData) {
    try {
      console.log('📧 Confirmation email would be sent to:', data.to);
      console.log('📋 Confirmation details:', {
        visitorName: data.visitorName,
        pgName: data.pgName,
        contactInfo: data.contactInfo
      });

      // Generate professional HTML email using MJML template
      const mjmlTemplate = MJMLTemplateRenderer.renderEnquiryConfirmation({
        visitorName: data.visitorName,
        pgName: data.pgName,
        contactInfo: data.contactInfo,
      });

      console.log('📧 Generated MJML template:', mjmlTemplate);
      
      return { 
        success: true, 
        messageId: `mock_${Date.now()}`,
        note: 'Email service not configured - MJML template generated and logged to console',
        mjmlTemplate: mjmlTemplate // Include template for debugging
      };
    } catch (error) {
      console.error('Failed to send enquiry confirmation:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }

  // Send welcome email to new PG owners (using MJML templates)
  static async sendWelcomeEmail(to: string, pgName: string, ownerName: string) {
    try {
      console.log('📧 Welcome email would be sent to:', to);
      console.log('📋 Welcome details:', { pgName, ownerName });

      // Generate professional HTML email using MJML template
      const mjmlTemplate = MJMLTemplateRenderer.renderWelcomePGOwner({
        ownerName: ownerName,
        pgName: pgName,
      });

      console.log('📧 Generated MJML template:', mjmlTemplate);
      
      return { 
        success: true, 
        messageId: `mock_${Date.now()}`,
        note: 'Email service not configured - MJML template generated and logged to console',
        mjmlTemplate: mjmlTemplate // Include template for debugging
      };
    } catch (error) {
      console.error('Failed to send welcome email:', error);
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' };
    }
  }
}
