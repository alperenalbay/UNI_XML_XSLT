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
        
        # -> Scroll down to reveal the XML and XSLT editor panels so the editors and manual transform controls become visible.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll the page down to reveal the XML and XSLT editor panels so the editors and manual transform controls become visible.
        await page.mouse.wheel(0, 300)
        
        # -> Scroll further down the page so the XML and XSLT editor panels (including the 'XML Yükle' and 'XSLT Yükle' controls) become visible.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default template and reveal or populate the XML/XSLT editors.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablonum Yok', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Turn off the 'Oto Yenile' checkbox and then click the 'Önizleme' (Preview) button to perform a manual/manual transform.
        # checkbox
        elem = page.get_by_label('Oto Yenile', exact=True)
        await elem.click(timeout=10000)
        
        # -> Turn off the 'Oto Yenile' checkbox and then click the 'Önizleme' (Preview) button to perform a manual/manual transform.
        # Önizleme button
        elem = page.get_by_role('button', name='Önizleme', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the invoice preview is updated
        # Assert: Invoice preview displays the invoice number DEV2026000000456.
        await expect(page.locator("xpath=/html/body/table[2]/tbody/tr/td[3]/table/tbody/tr[4]/td[2]").nth(0)).to_have_text("DEV2026000000456", timeout=15000), "Invoice preview displays the invoice number DEV2026000000456."
        # Assert: Invoice preview shows the 'Fatura No:' label next to the invoice number.
        await expect(page.locator("xpath=/html/body/table[2]/tbody/tr/td[3]/table/tbody/tr[4]/td[1]").nth(0)).to_have_text("Fatura No:", timeout=15000), "Invoice preview shows the 'Fatura No:' label next to the invoice number."
        
        # --> Verify transformed invoice content is visible in the preview
        await page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0).scroll_into_view_if_needed()
        # Assert: Invoice preview iframe is visible.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0)).to_be_visible(timeout=15000), "Invoice preview iframe is visible."
        # Assert: Transformed invoice number DEV2026000000456 is visible in the preview.
        await expect(page.locator("xpath=/html/body/table[2]/tbody/tr/td[3]/table/tbody/tr[4]/td[2]").nth(0)).to_have_text("DEV2026000000456", timeout=15000), "Transformed invoice number DEV2026000000456 is visible in the preview."
        # Assert: A transformed line item description is visible in the preview.
        await expect(page.locator("xpath=/html/body/table[4]/tbody/tr[2]/td[2]").nth(0)).to_have_text("Yaz\u0131l\u0131m Geli\u015ftirme Dan\u0131\u015fmanl\u0131k Hizmeti", timeout=15000), "A transformed line item description is visible in the preview."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    