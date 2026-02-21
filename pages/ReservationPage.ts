import { type Locator, type Page } from '@playwright/test';

export interface GuestDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
}

export class ReservationPage {
  readonly page: Page;
  readonly bookingCard: Locator;
  readonly reserveButton: Locator;
  readonly cancelButton: Locator;
  readonly firstNameInput: Locator;
  readonly lastNameInput: Locator;
  readonly emailInput: Locator;
  readonly phoneInput: Locator;
  readonly confirmationTitle: Locator;
  readonly confirmationDates: Locator;
  readonly validationErrors: Locator;

  constructor(page: Page) {
    this.page = page;
    this.bookingCard = page.locator('.booking-card');
    this.reserveButton = this.bookingCard.locator('button.btn-primary');
    this.cancelButton = this.bookingCard.locator('button.btn-secondary');
    this.firstNameInput = page.locator('input.room-firstname');
    this.lastNameInput = page.locator('input.room-lastname');
    this.emailInput = page.locator('input.room-email');
    this.phoneInput = page.locator('input.room-phone');
    this.confirmationTitle = this.bookingCard.locator('.card-title');
    this.confirmationDates = this.bookingCard.locator('p strong');
    this.validationErrors = page.locator('.alert-danger, .text-danger, .invalid-feedback');
  }

  async open(roomId: number, checkin: string, checkout: string) {
    const url = `/reservation/${roomId}?checkin=${checkin}&checkout=${checkout}`;
    await this.page.goto(url, { waitUntil: 'domcontentloaded' });
    try {
      await this.bookingCard.waitFor({ state: 'visible', timeout: 5000 });
    } catch {
      await this.page.reload({ waitUntil: 'domcontentloaded' });
      await this.bookingCard.waitFor({ state: 'visible', timeout: 15000 });
    }
  }

  async openBookingForm() {
    await this.reserveButton.click();
    await this.firstNameInput.waitFor({ state: 'visible' });
  }

  async fillGuestDetails(guest: GuestDetails) {
    await this.firstNameInput.fill(guest.firstName);
    await this.lastNameInput.fill(guest.lastName);
    await this.emailInput.fill(guest.email);
    await this.phoneInput.fill(guest.phone);
  }

  async submitReservation() {
    await this.reserveButton.click();
  }

  async waitForConfirmation() {
    await this.page.locator('.card-title', { hasText: 'Booking Confirmed' }).waitFor({ state: 'visible', timeout: 10000 });
  }
}
