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
        
        # -> Upload the test XML using the visible 'XML Yükle' file input to let the app detect embedded XSLT.
        # file upload
        elem = page.get_by_label('XML Yükle', exact=True)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/embedded_with_xslt.xml")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/embedded_with_xslt.xml")
        
        # -> Click the 'XSLT Tasarımı' button to reveal or trigger loading of the embedded XSLT design into the template editor.
        # XSLT Tasarımı ✓ Geçerli button
        elem = page.get_by_role('button', name='XSLT Tasarımı ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'XML Verisi' button to trigger detection/loading of the embedded XSLT design.
        # XML Verisi ✓ Geçerli button
        elem = page.get_by_role('button', name='XML Verisi ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'xml-stylesheet' processing instruction shown in the code viewer to load the embedded XSLT into the template editor and update the preview.
        # <?
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[2]/div/section/div/div/div/div[3]/div/div[4]/div[2]/span/span')
        await elem.click(timeout=10000)
        
        # -> Click the processing-instruction href text 'href="#inline"' in the code viewer to load the embedded XSLT into the template editor.
        # ?>
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[2]/div/section/div/div/div/div[3]/div/div[4]/div[2]/span/span[11]')
        await elem.click(timeout=10000)
        
        # -> Click the visible href="#inline" processing-instruction text in the code viewer to load the embedded XSLT into the template editor.
        # href
        elem = page.get_by_text('href', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'xsl:stylesheet' opening tag in the code viewer to attempt loading the embedded XSLT design.
        # Click the 'xsl:stylesheet' opening tag in the code viewer to attempt loading the embedded XSLT design.
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[2]/div/section/div/div/div/div[3]/div/div[4]/div[8]/span/span')
        await elem.click(timeout=10000)
        
        # -> Click the 'xsl:stylesheet' opening tag in the code viewer to try loading the embedded XSLT into the template editor.
        # Click the 'xsl:stylesheet' opening tag in the code viewer to try loading the embedded XSLT into the template editor.
        elem = page.locator('xpath=/html/body/div/div/main/section/div[2]/div/div[2]/div/section/div/div/div/div[3]/div/div[4]/div[8]/span/span')
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the embedded design is loaded into the editor
        # Assert: Expected the preview area to contain the rendered heading 'Invoice from' showing the embedded XSLT was applied.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/div/div/div[1]").nth(0)).to_contain_text("Invoice from", timeout=15000), "Expected the preview area to contain the rendered heading 'Invoice from' showing the embedded XSLT was applied."
        # Assert: Expected the preview area to contain the rendered buyer line 'Buyer:' showing the embedded XSLT was applied.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/div/div/div[1]").nth(0)).to_contain_text("Buyer:", timeout=15000), "Expected the preview area to contain the rendered buyer line 'Buyer:' showing the embedded XSLT was applied."
        # Assert: Expected the preview area to contain the rendered total line 'Total:' showing the embedded XSLT was applied.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/div/div/div[1]").nth(0)).to_contain_text("Total:", timeout=15000), "Expected the preview area to contain the rendered total line 'Total:' showing the embedded XSLT was applied."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    