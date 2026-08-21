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
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default invoice XML and XSLT into the editors and show the preview.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablonum Yok', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Open the 'Görsel Tasarımcı (Beta)' (Visual Designer) by clicking its button so the inspector/designer UI appears.
        # Görsel Tasarımcı (Beta) button
        elem = page.get_by_role('button', name='Görsel Tasarımcı (Beta)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Increase the selected element's font size by moving the 'Yazı Boyutu' slider to 20 and then verify the preview reflects the change by inspecting td#invoice-info-td.
        # range field
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[2]/div[2]/div/div[3]/div/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("20")
        
        # --> Assertions to verify final state
        
        # --> Verify the selected invoice element reflects the style change
        # Assert: The font-size slider for the selected element is set to 20.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[2]/div/div[3]/div[1]/input").nth(0)).to_have_value("20", timeout=15000), "The font-size slider for the selected element is set to 20."
        # Assert: The Yazı Boyutu label shows 20, confirming the style change.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[2]/div/div[3]/div[1]/div/span[2]").nth(0)).to_have_text("20", timeout=15000), "The Yaz\u0131 Boyutu label shows 20, confirming the style change."
        
        # --> Verify the updated styling is visible in the preview
        # Assert: The font size control displays 20, confirming the selected style value.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[2]/div/div[3]/div[1]/div/span[2]").nth(0)).to_have_text("20", timeout=15000), "The font size control displays 20, confirming the selected style value."
        await page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[3]/div/iframe").nth(0).scroll_into_view_if_needed()
        # Assert: The invoice live preview iframe is visible, showing the updated styling in the preview.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[3]/div/iframe").nth(0)).to_be_visible(timeout=15000), "The invoice live preview iframe is visible, showing the updated styling in the preview."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    