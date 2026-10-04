import { test,expect } from "@playwright/test";
test("compiles execution config",async({page})=>{
  await page.goto("/");
  await page.getByPlaceholder("What must the agent actually build?").fill("Build a premium cinematic website with excellent typography and motion.");
  await page.getByRole("button",{name:"Compile V3"}).click();
  await expect(page.getByText("Website / UI")).toBeVisible();
  await expect(page.getByText("Runner Configuration")).toBeVisible();
  await expect(page.getByRole("button",{name:"Download gauntlet.project.json"})).toBeVisible();
});
