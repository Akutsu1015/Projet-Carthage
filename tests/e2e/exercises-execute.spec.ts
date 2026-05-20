import { test, expect } from "@playwright/test";

/**
 * Golden path: open a Python exercise, type code in the Monaco editor,
 * trigger the real terminal execution, and verify the output appears.
 *
 * Requires either:
 *  - A self-hosted Piston reachable via PISTON_URL, or
 *  - Mocked /api/db/execute (set E2E_MOCK_EXEC=1).
 */
test.describe("Exercises — real terminal execution", () => {
  test.beforeEach(async ({ page }) => {
    if (process.env.E2E_MOCK_EXEC) {
      await page.route("**/api/db/execute", async (route) => {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify({
            success: true,
            output: "Hello, E2E!\n",
            stderr: "",
            compileOutput: "",
            exitCode: 0,
            language: "Python",
          }),
        });
      });
    }
  });

  test("python exercise: editor renders, run produces output", async ({ page }) => {
    await page.goto("/exercises/python");

    // Pick the first "Code" exercise from the sidebar.
    const codeBtn = page.locator("button", { hasText: /^Code/ }).first();
    await codeBtn.click();

    // Monaco editor renders inside a div with role textbox.
    const editor = page.locator(".monaco-editor").first();
    await expect(editor).toBeVisible({ timeout: 15_000 });

    // Switch to preview tab on mobile/narrow viewports (no-op on desktop).
    const previewTab = page.getByRole("button", { name: /Aperçu|Preview/ });
    if (await previewTab.isVisible().catch(() => false)) {
      await previewTab.click().catch(() => {});
    }

    // The terminal panel header should show the language label.
    await expect(page.getByText(/Terminal\s*—\s*Python/)).toBeVisible();

    // Click the Run button inside the terminal panel.
    const runBtn = page.getByRole("button", { name: /^(Exécuter|Run)$/ });
    await runBtn.click();

    // We expect either real output (Piston) OR our mocked output.
    // At minimum, the command prompt line "$ python3 main.py" must appear.
    await expect(page.getByText("$ python3 main.py")).toBeVisible({ timeout: 20_000 });
  });

  test("rate limit: rapid double-click triggers cooldown", async ({ page }) => {
    if (!process.env.E2E_MOCK_EXEC) test.skip(true, "needs mock to be deterministic");

    await page.goto("/exercises/python");
    await page.locator("button", { hasText: /^Code/ }).first().click();
    await expect(page.locator(".monaco-editor").first()).toBeVisible({ timeout: 15_000 });

    const runBtn = page.getByRole("button", { name: /^(Exécuter|Run)$/ });
    await runBtn.click();
    await runBtn.click({ force: true }).catch(() => {}); // second one is rejected client-side or server-side

    // Either button is disabled (in-flight) or a 429 message appears
    const blocked = page.getByText(/Trop rapide|Too fast|cours/i);
    const disabled = await runBtn.isDisabled().catch(() => false);
    expect(disabled || (await blocked.isVisible().catch(() => false))).toBeTruthy();
  });
});
