import { expect, test } from "@playwright/test";

const pages = [
  {
    name: "home",
    path: "/",
    title: /Kiwami Tech/i,
    heading: /Empowering Software Quality Assurance Talent Across Africa/i,
  },
  {
    name: "about",
    path: "/about.html",
    title: /About Us.*Kiwami Tech/i,
    heading: "About Kiwami Tech",
  },
  {
    name: "services",
    path: "/services.html",
    title: /Services.*Kiwami Tech/i,
    heading: "Our Services",
  },
  {
    name: "careers",
    path: "/careers.html",
    title: /Careers.*Kiwami Tech/i,
    heading: /Careers & Talent/i,
  },
  {
    name: "Bug Bash",
    path: "/bugbash/",
    title: /Bug Bash/i,
    heading: "Kiwami Tech Bug Bash",
  },
];

for (const pageCase of pages) {
  test(`loads ${pageCase.name} page`, async ({ page }) => {
    const response = await page.goto(pageCase.path);

    expect(
      response?.ok(),
      `Expected ${pageCase.path} to return a successful response`,
    ).toBe(true);
    await expect(page).toHaveTitle(pageCase.title);
    await expect(
      page.getByRole("heading", { level: 1, name: pageCase.heading }),
    ).toBeVisible();
  });
}
