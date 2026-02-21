import { test, expect } from '@playwright/test';
import { LandingPage } from '../pages/LandingPage';

let landingPage: LandingPage;

test.beforeEach(async ({ page }) => {
  landingPage = new LandingPage(page);
});

test.describe('TC-001 -Landing Page - Rooms Section', () => {

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
