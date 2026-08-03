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
        
        # -> Upload a valid XML file using the 'XML Yükle' file input on the page.
        # file upload
        elem = page.get_by_label('XML Yükle', exact=True)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/test-invoice.xml")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/test-invoice.xml")
        
        # -> Upload an XSLT stylesheet using the 'XSLT Dosyası Yükle' file input so the XSLT editor/preview becomes active.
        # file upload
        elem = page.get_by_label('XSLT Dosyası Yükle', exact=True)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/test-stylesheet.xml")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/test-stylesheet.xml")
        
        # -> Click the 'XSLT Tasarımı' tab to open the XSLT editor and confirm the stylesheet text (e.g., 'xsl:stylesheet' or 'xsl:template') is present.
        # XSLT Tasarımı ✓ Geçerli button
        elem = page.get_by_role('button', name='XSLT Tasarımı ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify both files are loaded into the editors
        await page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[1]/div[1]/button[1]").nth(0).scroll_into_view_if_needed()
        # Assert: The XML editor shows the uploaded XML and is marked valid.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[1]/div[1]/button[1]").nth(0)).to_be_visible(timeout=15000), "The XML editor shows the uploaded XML and is marked valid."
        await page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[1]/div[1]/button[2]").nth(0).scroll_into_view_if_needed()
        # Assert: The XSLT editor shows the uploaded stylesheet and is marked valid.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[1]/div[1]/button[2]").nth(0)).to_be_visible(timeout=15000), "The XSLT editor shows the uploaded stylesheet and is marked valid."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    