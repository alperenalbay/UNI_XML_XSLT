import asyncio
import re
from playwright import async_api
from playwright.async_api import expect

async def run_test():
    pw = None
    browser = None
    context = None

    try:
        # Start a Playwright session in asynchronous mode
        pw = await async_api.async_playwright().start()

        # Launch a Chromium browser in headless mode with custom arguments
        browser = await pw.chromium.launch(
            headless=True,
            args=[
                "--window-size=1280,720",
                "--disable-dev-shm-usage",
                "--ipc=host",
                "--single-process"
            ],
        )

        # Create a new browser context (like an incognito window)
        context = await browser.new_context()
        # Wider default timeout to match the agent's DOM-stability budget;
        # auto-waiting Playwright APIs (expect, locator.wait_for) inherit this.
        context.set_default_timeout(15000)

        # Open a new page in the browser context
        page = await context.new_page()

        # Interact with the page elements to simulate user flow
        # -> navigate
        await page.goto("http://localhost:4173")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default invoice template and reveal preview/print controls.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablonum Yok', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Yazdır / PDF' button in the preview toolbar to open the print/PDF view.
        # Yazdır / PDF button
        elem = page.get_by_role('button', name='Yazdır / PDF', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify a print-friendly invoice view is displayed
        await page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0).scroll_into_view_if_needed()
        # Assert: The print preview iframe is visible.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0)).to_be_visible(timeout=15000), "The print preview iframe is visible."
        # Assert: The invoice number DEV2026000000456 is shown in the print view.
        await expect(page.locator("xpath=/html/body/table[2]/tbody/tr/td[3]/table/tbody/tr[4]/td[2]").nth(0)).to_have_text("DEV2026000000456", timeout=15000), "The invoice number DEV2026000000456 is shown in the print view."
        await page.locator("xpath=/html/body/table[4]/tbody/tr[1]").nth(0).scroll_into_view_if_needed()
        # Assert: The invoice line items table header is visible, indicating a formatted invoice layout.
        await expect(page.locator("xpath=/html/body/table[4]/tbody/tr[1]").nth(0)).to_be_visible(timeout=15000), "The invoice line items table header is visible, indicating a formatted invoice layout."
        current_url = await page.evaluate("() => window.location.href")
        # Assert: page loaded with a URL (final outcome verified by the AI judge during the run)
        assert current_url, 'Page should have loaded with a URL'
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    