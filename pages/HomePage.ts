import { expect, type Locator, type Page } from "@playwright/test";

export const HOME_SECTION_HEADINGS = [
  /Comprehensive QA solutions\s*for every need/i,
  /Founded to transform\s*QA across Africa/i,
  /Why\s*Us\?/i,
  /Expert testing for every\s*layer of your stack/i,
  /Expert-led training to\s*elevate your skills/i,
  /From our students,\s*in their own words/i,
  /Frequently asked\s*questions/i,
  /Connect with\s*Kiwami Tech/i,
];

export class HomePage {
  readonly page: Page;
  readonly heroHeading: Locator;
  readonly menuButton: Locator;

  constructor(page: Page) {
    this.page = page;
    this.heroHeading = page.getByRole("heading", {
      level: 1,
      name: /Empowering Software Quality Assurance Talent Across Africa/i,
    });
    this.menuButton = page.getByRole("button", { name: "Menu" });
  }

  sectionHeading(name: RegExp): Locator {
    return this.page.getByRole("heading", { level: 2, name });
  }

  faqButton(question: string): Locator {
    return this.page.getByRole("button", { name: new RegExp(question) });
  }

  faqAnswer(question: string): Locator {
    return this.faqButton(question).locator("xpath=..").locator(".fa");
  }

  navigationLink(name: string): Locator {
    return this.page
      .getByRole("navigation")
      .getByRole("link", { name, exact: true });
  }

  exploreServicesLink(): Locator {
    return this.page.getByRole("link", { name: /Explore Services/ });
  }

  browseCoursesLink(): Locator {
    return this.page.getByRole("link", {
      name: "Browse Courses ↗",
      exact: true,
    });
  }

  async open() {
    const response = await this.page.goto("/");
    expect(response?.ok()).toBe(true);
    await expect(this.heroHeading).toBeVisible();
  }
}
