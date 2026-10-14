import { expect, test } from "@playwright/test";

const siteLinks = [
  {
    name: "Kiwami School",
    sourcePath: "/",
    linkName: /Kiwami School Instructor-led QA & automation programs/,
    href: "https://kiwamitech.com/school/",
  },
  {
    name: "Bug Bash",
    sourcePath: "/",
    linkName: /Bug Bash Inhouse testing events/,
    href: "https://kiwamitech.com/bugbash",
  },
  {
    name: "Careers",
    sourcePath: "/",
    linkName: /Job Portal Find QA & engineering roles/,
    href: "careers.html",
  },
  {
    name: "Kiwami Tech Community form",
    sourcePath: "/",
    linkName: "Kiwami Tech Community",
    href: "https://docs.google.com/forms/d/1GJ6Sj2eqzaXxUILFMX7lVz7b07_KDmR78JKA4vCD8Jg/",
  },
  {
    name: "Contact Us",
    sourcePath: "/",
    linkName: "Contact Us",
    href: "contact",
  },
  {
    name: "Browse Courses",
    sourcePath: "/",
    linkName: "Browse Courses",
    href: "https://kiwamitech.com/school/#courses",
  },
  {
    name: "SQA Summit 2026",
    sourcePath: "/",
    linkName: /Events Workshops, conferences and meetups/,
    href: "https://kiwamitech.com/sqasummit2026/",
  },
  {
    name: "SQA Summit 2025",
    sourcePath: "/",
    linkName: "SQA SUMMIT 2025",
    href: "https://kiwamitech.com/sqasummit2025/",
  },
  {
    name: "APQEC 2025 Conference",
    sourcePath: "/",
    linkName: "APQEC'25 CONFERENCE",
    href: "http://conference.testarsquarter.org/",
  },
  {
    name: "Kiwami Test Cloud",
    sourcePath: "/",
    linkName: /SaaS Products to help manage testing workflows/,
    href: "https://kiwamitestcloud.com/",
  },
  {
    name: "University Testing Club",
    sourcePath: "/",
    linkName: /University Testing Club Student chapters & campus outreach/,
    href: "https://kiwamitech.com/universitytestingclub/index.php",
  },
  {
    name: "Student Bootcamp",
    sourcePath: "/",
    linkName: /Student Bootcamps Special student pricing available/,
    href: "https://kiwamitech.com/school/course.html?id=bootcamp-2026",
  },
  {
    name: "Kiwami Kids",
    sourcePath: "/",
    linkName: /Kiwami Kids Robotics program for kids/,
    href: "https://kiwamitech.com/kiwamikids/",
  },
  {
    name: "Careers footer Home link",
    sourcePath: "/careers.html",
    linkName: "Home",
    occurrence: "last",
    href: "kiwamitech.html",
  },
];

for (const siteLink of siteLinks) {
  test(`opens ${siteLink.name} destination`, async ({ page }) => {
    await page.goto(siteLink.sourcePath, { waitUntil: "domcontentloaded" });

    const matchingLinks = page.getByRole("link", { name: siteLink.linkName });
    const link =
      siteLink.occurrence === "last"
        ? matchingLinks.last()
        : matchingLinks.first();
    await expect(link).toHaveAttribute("href", siteLink.href);

    const targetUrl = new URL(
      siteLink.href,
      "https://kiwamitech.com",
    ).toString();
    const response = await page.goto(targetUrl, { waitUntil: "commit" });

    expect(
      response?.status(),
      `Expected ${siteLink.name} destination ${targetUrl} to load successfully`,
    ).toBeLessThan(400);
    expect(page.url()).toMatch(/^https?:\/\//);
  });
}
