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
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default template and reveal the editor and its settings.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablonum Yok', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'Filigran' button to open the watermark settings panel.
        # Filigran button
        elem = page.get_by_role('button', name='Filigran', exact=True)
        await elem.click(timeout=10000)
        
        # -> Enter a unique watermark string into the 'Metin Etiketi' field and adjust color, rotation, size, and opacity so the watermark becomes clearly visible in the preview.
        # ÖRN. ÖDENDİ text field
        elem = page.get_by_placeholder('ÖRN. ÖDENDİ', exact=True)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("TEST-WM-20260730-01")
        
        # -> Enter a unique watermark string into the 'Metin Etiketi' field and adjust color, rotation, size, and opacity so the watermark becomes clearly visible in the preview.
        # text field
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[3]/section/div[5]/div/input[2]')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("#10b981")
        
        # -> Enter a unique watermark string into the 'Metin Etiketi' field and adjust color, rotation, size, and opacity so the watermark becomes clearly visible in the preview.
        # range field
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[3]/section/div[6]/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("30")
        
        # -> Enter a unique watermark string into the 'Metin Etiketi' field and adjust color, rotation, size, and opacity so the watermark becomes clearly visible in the preview.
        # range field
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[3]/section/div[7]/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("80")
        
        # -> Enter a unique watermark string into the 'Metin Etiketi' field and adjust color, rotation, size, and opacity so the watermark becomes clearly visible in the preview.
        # range field
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[3]/section/div[8]/input')
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("50")
        
        # -> Scroll the invoice preview (right-hand 'Fatura Canlı Önizleme') to reveal different areas of the rendered page and check for the watermark text.
        await page.mouse.wheel(0, 300)
        
        # --> Assertions to verify final state
        
        # --> Verify the invoice preview shows the configured watermark
        # Assert: Expected the invoice preview iframe to contain the watermark text TEST-WM-20260730-01.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0)).to_contain_text("TEST-WM-20260730-01", timeout=15000), "Expected the invoice preview iframe to contain the watermark text TEST-WM-20260730-01."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    