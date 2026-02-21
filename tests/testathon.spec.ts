import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { ReservationPage, type GuestDetails } from '../pages/ReservationPage';
import { ContactPage, type ContactDetails } from '../pages/ContactPage';

function futureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

let landingPage: LandingPage;
let reservationPage: ReservationPage;
let contactPage: ContactPage;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
  reservationPage = new ReservationPage(page);
  contactPage = new ContactPage(page);
});

test.afterEach(async ({ page }) => {
  await page.close();
  await new Promise(resolve => setTimeout(resolve, 1000));
});

test.describe('TC-001 - Landing Page - Rooms Section', () => {

  test('should display rooms with bookable cards', async () => {
    await landingPage.open();
    await landingPage.waitForRoomsSection();

    const cardCount = await landingPage.roomCards.count();
    expect(cardCount).toBeGreaterThanOrEqual(1);

    const firstRoomName = await landingPage.roomNames.first().textContent();
    expect(firstRoomName?.trim()).not.toBe('');

    const bookButtonCount = await landingPage.bookButtons.count();
    expect(bookButtonCount).toBeGreaterThanOrEqual(1);

    await expect(landingPage.bookButtons.first()).toBeVisible();
  });
});

test.describe('TC-002 - Booking with valid data', () => {
  const guest: GuestDetails = {
    firstName: 'Teszt',
    lastName: 'Elek',
    email: 'teszt.elek@example.com',
    phone: '+36301234567',
  };

  test('should complete booking and show confirmation', async () => {
    const offset = 30 + Math.floor(Math.random() * 300);
    const checkin = futureDate(offset);
    const checkout = futureDate(offset + 2);

    await reservationPage.open(1, checkin, checkout);
    await reservationPage.openBookingForm();
    await reservationPage.fillGuestDetails(guest);
    await reservationPage.submitReservation();
    await reservationPage.waitForConfirmation();

    await expect(reservationPage.confirmationTitle).toHaveText('Booking Confirmed');
    await expect(reservationPage.confirmationDates).toBeVisible();
  });
});

test.describe('TC-003 - Contact form submission', () => {
  const contact: ContactDetails = {
    name: 'Elek Teszt',
    email: 'elek.teszt@mail.com',
    phone: '+3656789621',
    subject: 'Érdeklődnék',
    message: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus mattis arcu libero, eu placerat nunc convallis ut. Mauris semper leo eget sem accumsan sed.',
  };

  test('should submit message and show confirmation', async () => {
    await landingPage.open();
    await contactPage.scrollToContact();
    await contactPage.fillForm(contact);
    await contactPage.submit();
    await contactPage.waitForConfirmation();

    await expect(contactPage.confirmationHeading).toContainText('Thanks for getting in touch');
  });
});
