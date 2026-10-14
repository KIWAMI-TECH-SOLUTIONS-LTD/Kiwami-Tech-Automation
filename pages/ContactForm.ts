import { type Locator, type Page } from "@playwright/test";

export class ContactForm {
  readonly page: Page;
  readonly nameInput: Locator;
  readonly emailInput: Locator;
  readonly subjectSelect: Locator;
  readonly messageInput: Locator;
  readonly honeypotInput: Locator;
  readonly submitButton: Locator;
  readonly statusMessage: Locator;

  constructor(page: Page) {
    this.page = page;
    this.nameInput = page.getByPlaceholder("Jane Mwangi");
    this.emailInput = page.getByPlaceholder("jane@company.com");
    this.subjectSelect = page.locator("#cf-subject");
    this.messageInput = page.getByPlaceholder(
      "Tell us about your project or inquiry…",
    );
    this.honeypotInput = page.locator("#cf-honeypot");
    this.submitButton = page.getByRole("button", { name: /Send Message/ });
    this.statusMessage = page.locator("#cf-status");
  }

  async open() {
    await this.page.goto("/#contact");
  }

  async fill(name: string, email: string, subject: string, message: string) {
    await this.nameInput.fill(name);
    await this.emailInput.fill(email);
    await this.subjectSelect.selectOption({ label: subject });
    await this.messageInput.fill(message);
  }

  async submit() {
    await this.submitButton.click();
  }
}
