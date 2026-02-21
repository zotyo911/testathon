import { type Locator, type Page } from '@playwright/test';

export class LandingPage {
  readonly page: Page;
  readonly roomsSection: Locator;
  readonly roomCards: Locator;
  readonly roomNames: Locator;
  readonly bookButtons: Locator;

  constructor(page: Page) {
    this.page = page;
    this.roomsSection = page.locator('section#rooms');
    this.roomCards = this.roomsSection.locator('.room-card');
    this.roomNames = this.roomCards.locator('.card-title');
    this.bookButtons = this.roomCards.locator('.card-footer .btn-primary');
  }

  async open() {
    await this.page.goto('/', { waitUntil: 'networkidle' });
  }

  async waitForRoomsSection() {
    await this.roomCards.first().waitFor({ state: 'visible' });
  }
}
