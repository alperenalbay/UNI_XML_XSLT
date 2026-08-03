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
        
        # -> Use the 'XML Yükle' control to upload a valid XML file (prepare a sample XML file in the workspace, then upload it).
        # file upload
        elem = page.get_by_label('XML Yükle', exact=True)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/sample.xml")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/sample.xml")
        
        # -> Open the 'XML Verisi' view (XML Verisi button) and verify the editor displays the uploaded XML content such as 'Hello from sample XML'.
        # XML Verisi ✓ Geçerli button
        elem = page.get_by_role('button', name='XML Verisi ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # --> Assertions to verify final state
        
        # --> Verify the XML content is displayed in the editor
        # Assert: The editor displays the XML declaration start '<?'.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[1]/section/div/div[1]/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[1]").nth(0)).to_have_text("<?", timeout=15000), "The editor displays the XML declaration start '<?'."
        # Assert: The editor displays the XML declaration end '?>'.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[1]/section/div/div[1]/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[11]").nth(0)).to_have_text("?>", timeout=15000), "The editor displays the XML declaration end '?>'."
        # Assert: The editor displays the XML element value '42' from the uploaded file.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[1]/section/div/div[1]/div[1]/div[3]/div[1]/div[4]/div[4]/span/span[5]").nth(0)).to_have_text("42", timeout=15000), "The editor displays the XML element value '42' from the uploaded file."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    