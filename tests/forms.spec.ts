import { expect, test } from "@playwright/test";
import { ContactForm } from "../pages/ContactForm";

const subjectOptions = [
  "Select subject…",
  "Testing as a Service",
  "Bug Bash Request",
  "Request Consultancy Services",
  "Hire a Talent",
  "Request Demo For Our SAAS",
  "Training / Kiwami School",
  "Community / Events",
  "Other",
];

test.describe("Homepage contact form", () => {
  test("shows its fields and subject options", async ({ page }) => {
    const form = new ContactForm(page);
    await form.open();

    await expect(form.nameInput).toBeVisible();
    await expect(form.emailInput).toBeVisible();
    await expect(form.subjectSelect).toBeVisible();
    await expect(form.messageInput).toBeVisible();
    await expect(form.submitButton).toBeVisible();
    await expect(form.subjectSelect.locator("option")).toHaveText(
      subjectOptions,
    );
    await expect(form.honeypotInput).toHaveAttribute("tabindex", "-1");
    await expect(form.honeypotInput).toHaveValue("");
  });

  test("shows required-field validation without sending a request", async ({
    page,
  }) => {
    const form = new ContactForm(page);
    await form.open();

    let requestCount = 0;
    await page.route("**/contact.php", async (route) => {
      requestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
    });

    await form.submit();

    await expect(form.statusMessage).toHaveText(
      "Please complete all required fields.",
    );
    expect(requestCount).toBe(0);
  });

  test("rejects an invalid email before sending a request", async ({
    page,
  }) => {
    const form = new ContactForm(page);
    await form.open();
    await form.fill(
      "QA Form Check",
      "not-an-email",
      "Other",
      "Validation-only form check.",
    );

    let requestCount = 0;
    await page.route("**/contact.php", async (route) => {
      requestCount += 1;
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: "{}",
      });
    });

    await form.submit();

    await expect(form.statusMessage).toHaveText(
      "Please enter a valid email address.",
    );
    expect(requestCount).toBe(0);
  });

  test("shows success and clears fields when an inquiry is accepted", async ({
    page,
  }) => {
    const form = new ContactForm(page);
    await form.open();
    await page.route("**/contact.php", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "success",
          message: "Test inquiry accepted.",
        }),
      });
    });

    await form.fill(
      "QA Form Check",
      "qa-form@example.com",
      "Other",
      "Mocked success-path check.",
    );
    await form.submit();

    await expect(form.statusMessage).toHaveText("Test inquiry accepted.");
    await expect(form.nameInput).toHaveValue("");
    await expect(form.emailInput).toHaveValue("");
    await expect(form.subjectSelect).toHaveValue("");
    await expect(form.messageInput).toHaveValue("");
    await expect(form.submitButton).toBeEnabled();
  });

  test("shows an application error and keeps the entered values", async ({
    page,
  }) => {
    const form = new ContactForm(page);
    await form.open();
    await page.route("**/contact.php", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          status: "error",
          message: "Test inquiry rejected.",
        }),
      });
    });

    await form.fill(
      "QA Form Check",
      "qa-form@example.com",
      "Other",
      "Mocked error-path check.",
    );
    await form.submit();

    await expect(form.statusMessage).toHaveText("Test inquiry rejected.");
    await expect(form.nameInput).toHaveValue("QA Form Check");
    await expect(form.emailInput).toHaveValue("qa-form@example.com");
    await expect(form.messageInput).toHaveValue("Mocked error-path check.");
    await expect(form.submitButton).toBeEnabled();
  });
});
