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
        
        # -> Upload the XSLT content file using the 'XSLT Yükle' file input so the editor can load and display the marker SAMPLE_XSLT_TEST.
        # file upload
        elem = page.get_by_label('XSLT Yükle', exact=True)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/sample_for_xslt.xml")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/sample_for_xslt.xml")
        
        # -> Use the 'Gözat' (Browse) control under 'Dosya Yükle' to upload the XSLT file (sample_for_xslt.xml).
        # file upload
        elem = page.get_by_label('Gözat', exact=True)
        await elem.wait_for(state="attached", timeout=10000)
        if await elem.evaluate("e => e.tagName === 'INPUT' && (e.type || '').toLowerCase() === 'file'"):
            await elem.set_input_files("./fixtures/sample_for_xslt.xml")
        else:
            await elem.wait_for(state="visible", timeout=10000)
            async with page.expect_file_chooser() as fc_info:
                await elem.click()
            chooser = await fc_info.value
            await chooser.set_files("./fixtures/sample_for_xslt.xml")
        
        # --> Assertions to verify final state
        
        # --> Verify the XSLT content is displayed in the editor
        # Assert: The editor displays the XML processing instruction open token "<?" from the uploaded XSLT.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[1]/section/div/div[1]/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[1]").nth(0)).to_have_text("<?", timeout=15000), "The editor displays the XML processing instruction open token \"<?\" from the uploaded XSLT."
        # Assert: The editor displays the "xml" token from the uploaded XSLT.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[1]/section/div/div[1]/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[2]").nth(0)).to_have_text("xml", timeout=15000), "The editor displays the \"xml\" token from the uploaded XSLT."
        # Assert: The editor shows the XSLT template keyword "match" from the uploaded file.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[1]/section/div/div[1]/div[1]/div[3]/div[1]/div[4]/div[6]/span/span[5]").nth(0)).to_have_text("match", timeout=15000), "The editor shows the XSLT template keyword \"match\" from the uploaded file."
        # Assert: The editor contains the element name "root" from the uploaded XSLT.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[2]/div[1]/section/div/div[1]/div[1]/div[3]/div[1]/div[4]/div[7]/span/span[3]").nth(0)).to_have_text("root", timeout=15000), "The editor contains the element name \"root\" from the uploaded XSLT."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    