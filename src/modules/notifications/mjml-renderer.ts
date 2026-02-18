import { readFileSync } from 'fs';
import { join } from 'path';

interface TemplateVariables {
  [key: string]: string | number | boolean | null | undefined | Record<string, any>;
}

export class MJMLTemplateRenderer {
  private static templateCache = new Map<string, string>();

  // Load MJML template from file
  private static loadTemplate(templateName: string): string {
    if (this.templateCache.has(templateName)) {
      return this.templateCache.get(templateName)!;
    }

    try {
      const templatePath = join(process.cwd(), 'src/modules/notifications/email-templates', `${templateName}.mjml`);
      const template = readFileSync(templatePath, 'utf-8');
      this.templateCache.set(templateName, template);
      return template;
    } catch (error) {
      console.error(`Failed to load template ${templateName}:`, error);
      throw new Error(`Template ${templateName} not found`);
    }
  }

  // Replace variables in template
  private static replaceVariables(template: string, variables: TemplateVariables): string {
    let result = template;

    // Replace {{variable}} patterns
    Object.entries(variables).forEach(([key, value]) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      result = result.replace(regex, String(value || ''));
    });

    // Handle conditional blocks {{#variable}}...{{/variable}}
    result = result.replace(/{{#(\w+)}}([\s\S]*?){{\/\1}}/g, (match, varName, content) => {
      const value = variables[varName];
      return value ? content : '';
    });

    // Handle nested objects like {{contactInfo.phone}}
    result = result.replace(/{{(\w+)\.(\w+)}}/g, (match, objName, prop) => {
      const obj = variables[objName];
      if (obj && typeof obj === 'object') {
        const nestedObj = obj as any;
        return String(nestedObj[prop] || '');
      }
      return '';
    });

    return result;
  }

  // Render enquiry notification template
  static renderEnquiryNotification(variables: {
    pgName: string;
    visitorName: string;
    visitorEmail: string;
    visitorPhone: string;
    message?: string;
    occupation?: string;
    roomType?: string;
    moveInDate?: string;
    timestamp?: string;
  }): string {
    const template = this.loadTemplate('enquiry-notification');
    return this.replaceVariables(template, {
      ...variables,
      timestamp: variables.timestamp || new Date().toLocaleString(),
    });
  }

  // Render enquiry confirmation template
  static renderEnquiryConfirmation(variables: {
    visitorName: string;
    pgName: string;
    contactInfo?: {
      phone?: string;
      email?: string;
    };
    timestamp?: string;
  }): string {
    const template = this.loadTemplate('enquiry-confirmation');
    return this.replaceVariables(template, {
      ...variables,
      timestamp: variables.timestamp || new Date().toLocaleString(),
    });
  }

  // Render welcome email template
  static renderWelcomePGOwner(variables: {
    ownerName: string;
    pgName: string;
    timestamp?: string;
  }): string {
    const template = this.loadTemplate('welcome-pg-owner');
    return this.replaceVariables(template, {
      ...variables,
      timestamp: variables.timestamp || new Date().toLocaleString(),
    });
  }

  // Render verification code template (existing)
  static renderVerificationCode(variables: {
    otp: string;
  }): string {
    const template = this.loadTemplate('verification-code');
    return this.replaceVariables(template, variables);
  }
}
