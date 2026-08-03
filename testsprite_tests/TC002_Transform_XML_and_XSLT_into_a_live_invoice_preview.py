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
        
        # -> Scroll the page to reveal the XML and XSLT editor sections so the editor fields labeled 'XML' and 'XSLT' become visible.
        await page.mouse.wheel(0, 300)
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default template and reveal the XML and XSLT editors.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablonum Yok', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'XML Verisi' button to inspect the XML editor and then ensure the 'Önizleme' (Preview) view is active so the invoice preview can be verified.
        # XML Verisi ✓ Geçerli button
        elem = page.get_by_role('button', name='XML Verisi ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'XML Verisi' button to inspect the XML editor and then ensure the 'Önizleme' (Preview) view is active so the invoice preview can be verified.
        # Önizleme button
        elem = page.get_by_role('button', name='Önizleme', exact=True)
        await elem.click(timeout=10000)
        
        # -> Navigate to the UNI XML&XSLT homepage (http://localhost:4173) so the XML and XSLT editors and the A4 preview can be inspected.
        await page.goto("http://localhost:4173")
        try:
            await page.wait_for_load_state("domcontentloaded", timeout=5000)
        except Exception:
            pass
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default template and reveal the XML and XSLT editor panels.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablonum Yok', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Upload a modified invoice XML file using the 'Gözat' (Browse) file input to trigger the live preview update.
        # file upload
        elem = page.get_by_label('Gözat', exact=True)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/invoice_test.xml")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/invoice_test.xml")
        
        # --> Assertions to verify final state
        
        # --> Verify the invoice preview is displayed
        await page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0).scroll_into_view_if_needed()
        # Assert: Invoice preview iframe is visible.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0)).to_be_visible(timeout=15000), "Invoice preview iframe is visible."
        
        # --> Verify transformed invoice content is visible in the preview
        # Assert: The preview displays the invoice number DEV2026000000999.
        await expect(page.locator("xpath=/html/body/table[2]/tbody/tr/td[3]/table/tbody/tr[4]").nth(0)).to_contain_text("DEV2026000000999", timeout=15000), "The preview displays the invoice number DEV2026000000999."
        # Assert: The invoice line-items table header 'Sıra No' is visible in the preview.
        await expect(page.locator("xpath=/html/body/table[4]/tbody/tr[1]/td[1]").nth(0)).to_have_text("S\u0131ra No", timeout=15000), "The invoice line-items table header 'S\u0131ra No' is visible in the preview."
        # Assert: A line item unit price '500' is visible in the transformed preview.
        await expect(page.locator("xpath=/html/body/table[4]/tbody/tr[2]/td[4]").nth(0)).to_have_text("500", timeout=15000), "A line item unit price '500' is visible in the transformed preview."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    