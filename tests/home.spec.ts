import { expect, test } from "@playwright/test";
import { HomePage, HOME_SECTION_HEADINGS } from "../pages/HomePage";

test.describe("Kiwami Tech homepage", () => {
  test("renders the hero and every major homepage section", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    for (const heading of HOME_SECTION_HEADINGS) {
      await expect(homePage.sectionHeading(heading)).toBeVisible();
    }

    for (const metric of ["50+", "92%", "15+"]) {
      await expect(
        page.getByText(metric, { exact: true }).first(),
      ).toBeVisible();
    }
  });

  test("expands and collapses a FAQ answer", async ({ page }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    const question = "What is software testing?";
    const answer = homePage.faqAnswer(question);
    await expect(answer).toBeHidden();

    await homePage.faqButton(question).click();
    await expect(answer).toBeVisible();
    await expect(answer).toContainText("evaluating a software application");

    await homePage.faqButton(question).click();
    await expect(answer).toBeHidden();
  });

  test("opens the mobile navigation menu and exposes the main pages", async ({
    page,
    isMobile,
  }) => {
    test.skip(!isMobile, "The desktop header does not use a collapsible menu.");
    const homePage = new HomePage(page);
    await homePage.open();

    await homePage.menuButton.click();
    await expect(homePage.navigationLink("About Us")).toBeVisible();
    await expect(homePage.navigationLink("Services")).toBeVisible();
    await expect(homePage.navigationLink("Hire Talent")).toBeVisible();

    await homePage.menuButton.click();
    await expect(homePage.navigationLink("About Us")).toBeHidden();
  });

  test("points the hero calls to action at services and courses", async ({
    page,
  }) => {
    const homePage = new HomePage(page);
    await homePage.open();

    await expect(homePage.exploreServicesLink()).toHaveAttribute(
      "href",
      "#services",
    );
    await expect(homePage.browseCoursesLink()).toHaveAttribute(
      "href",
      "https://kiwamitech.com/school/#courses",
    );
  });
});
