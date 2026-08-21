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
        
        # -> Scroll down to reveal the editor and preview area, then search for the 'Önizleme' (Preview) layout toggle control.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default template and reveal the editor/preview UI.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablonum Yok', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Editörleri Alt Alta Göster' button to toggle the workspace layout between split and stacked view.
        # Editörleri Alt Alta Göster button
        elem = page.get_by_role('button', name='Editörleri Alt Alta Göster', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the code editors are visible alongside the preview
        await page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[1]/div[2]/section/div/div/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[1]").nth(0).scroll_into_view_if_needed()
        # Assert: The XML editor code area is visible.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[1]/div[2]/section/div/div/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[1]").nth(0)).to_be_visible(timeout=15000), "The XML editor code area is visible."
        await page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[3]/section/div/div/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[1]").nth(0).scroll_into_view_if_needed()
        # Assert: The XSLT editor code area is visible.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[3]/section/div/div/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[1]").nth(0)).to_be_visible(timeout=15000), "The XSLT editor code area is visible."
        await page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0).scroll_into_view_if_needed()
        # Assert: The live preview iframe is visible.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0)).to_be_visible(timeout=15000), "The live preview iframe is visible."
        
        # --> Verify transformed invoice content is visible in the preview
        await page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0).scroll_into_view_if_needed()
        # Assert: The live preview iframe is visible.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0)).to_be_visible(timeout=15000), "The live preview iframe is visible."
        # Assert: The preview displays the invoice number DEV2026000000456.
        await expect(page.locator("xpath=/html/body/table[2]/tbody/tr/td[3]/table/tbody/tr[4]/td[2]").nth(0)).to_have_text("DEV2026000000456", timeout=15000), "The preview displays the invoice number DEV2026000000456."
        # Assert: The preview shows the total amount 3.000,00 TL.
        await expect(page.locator("xpath=/html/body/table[5]/tbody/tr/td/table/tbody/tr[4]/td[3]").nth(0)).to_have_text("3.000,00 TL", timeout=15000), "The preview shows the total amount 3.000,00 TL."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    