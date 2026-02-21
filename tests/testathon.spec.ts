import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';
import { ReservationPage, type GuestDetails } from '../pages/ReservationPage';

function futureDate(daysFromNow: number): string {
  const date = new Date();
  date.setDate(date.getDate() + daysFromNow);
  return date.toISOString().split('T')[0];
}

test.describe('TC-001 - Landing Page - Rooms Section', () => {
  let landingPage: LandingPage;

  test.beforeEach(async ({ page }) => {
    landingPage = new LandingPage(page);
    await landingPage.open();
    await landingPage.waitForRoomsSection();
  });

  test('should display rooms with bookable cards', async () => {
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
  let reservationPage: ReservationPage;

  const guest: GuestDetails = {
    firstName: 'Teszt',
    lastName: 'Elek',
    email: 'teszt.elek@example.com',
    phone: '+36301234567',
  };

  test.beforeEach(async ({ page }) => {
    reservationPage = new ReservationPage(page);
  });

  test('should complete booking and show confirmation', async () => {
    const now = new Date();
    const seed = now.getHours() * 60 + now.getMinutes() + now.getSeconds();
    const offset = 30 + (seed % 300);
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
