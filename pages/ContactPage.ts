import { type Locator, type Page } from '@playwright/test';

export interface ContactDetails {
  name: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
}

export class ContactPage {
  readonly page: Page;
  readonly contactSection: Locator;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly subjectInput: Locator;
  readonly messageInput: Locator;
  readonly submitButton: Locator;
  readonly confirmationHeading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.contactSection = page.locator('section#contact');
    this.nameInput = page.locator('[data-testid="ContactName"]');
    this.emailInput = page.locator('[data-testid="ContactEmail"]');
    this.phoneInput = page.locator('[data-testid="ContactPhone"]');
    this.subjectInput = page.locator('[data-testid="ContactSubject"]');
    this.messageInput = page.locator('[data-testid="ContactDescription"]');
    this.submitButton = this.contactSection.locator('button.btn-primary');
    this.confirmationHeading = this.contactSection.locator('h3');
  }

  async scrollToContact() {
    try {
      await this.contactSection.waitFor({ state: 'attached', timeout: 5000 });
    } catch {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.contactSection.waitFor({ state: 'attached', timeout: 15000 });
    }
    await this.contactSection.scrollIntoViewIfNeeded();
  }

  async fillForm(contact: ContactDetails) {
    await this.nameInput.fill(contact.name);
    await this.emailInput.fill(contact.email);
    await this.phoneInput.fill(contact.phone);
    await this.subjectInput.fill(contact.subject);
    await this.messageInput.fill(contact.message);
  }

  async submit() {
    await this.submitButton.click();
  }

  async waitForConfirmation() {
    await this.page.locator('h3', { hasText: 'Thanks for getting in touch' }).waitFor({ state: 'visible', timeout: 10000 });
  }
}
