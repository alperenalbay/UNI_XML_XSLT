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
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default sample files.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablon Kütüphanesi', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify XML validation status is displayed
        await page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[1]/div[1]/button[1]").nth(0).scroll_into_view_if_needed()
        # Assert: XML validation status is visible in the status panel.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[1]/div[1]/button[1]").nth(0)).to_be_visible(timeout=15000), "XML validation status is visible in the status panel."
        
        # --> Verify XSLT validation status is displayed
        # Assert: The XSLT validation status 'XSLT Tasarımı ✓ Geçerli' is displayed.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[1]/div[1]/button[2]").nth(0)).to_have_text("XSLT Tasar\u0131m\u0131\n\u2713 Ge\u00e7erli", timeout=15000), "The XSLT validation status 'XSLT Tasar\u0131m\u0131 \u2713 Ge\u00e7erli' is displayed."
        
        # --> Verify saved template information is displayed
        await page.locator("xpath=/html/body/div[1]/div/header/div[2]/div[1]/select").nth(0).scroll_into_view_if_needed()
        # Assert: Saved template dropdown is visible.
        await expect(page.locator("xpath=/html/body/div[1]/div/header/div[2]/div[1]/select").nth(0)).to_be_visible(timeout=15000), "Saved template dropdown is visible."
        # Assert: Saved template dropdown contains the option 'Varsayılan Şablon (UBL-TR)'.
        await expect(page.locator("xpath=/html/body/div[1]/div/header/div[2]/div[1]/select").nth(0)).to_contain_text("Varsay\u0131lan \u015eablon (UBL-TR)", timeout=15000), "Saved template dropdown contains the option 'Varsay\u0131lan \u015eablon (UBL-TR)'."
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
    