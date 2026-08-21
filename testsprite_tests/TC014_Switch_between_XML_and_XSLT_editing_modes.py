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
        
        # -> Click the 'Şablonum Yok (Varsayılanı Yükle)' button to load the default template and reveal the XML/XSLT editors.
        # Şablonum Yok (Varsayılanı Yükle) button
        elem = page.get_by_text('Şablonum Yok', exact=True).locator("xpath=ancestor-or-self::*[.//button][1]").get_by_role('button', name='Şablonum Yok (Varsayılanı Yükle)', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'XML Verisi' tab to activate the XML editor.
        # XML Verisi ✓ Geçerli button
        elem = page.get_by_role('button', name='XML Verisi ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # -> Type a short edit into the XML editor to confirm it is editable, then switch to the 'XSLT Tasarımı' tab.
        # <?
        elem = page.get_by_text('<?', exact=True)
        await elem.click(timeout=10000)
        
        # -> Type a short edit into the XML editor to confirm it is editable, then switch to the 'XSLT Tasarımı' tab.
        # XSLT Tasarımı ✓ Geçerli button
        elem = page.get_by_role('button', name='XSLT Tasarımı ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'XML Verisi' tab to activate the XML editor.
        # XML Verisi Hatalı button
        elem = page.get_by_role('button', name='XML Verisi Hatalı', exact=True)
        await elem.click(timeout=10000)
        
        # -> Type valid invoice XML into the XML editor
        # ?xml
        elem = page.get_by_text('?xml', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'XSLT Tasarımı' tab to activate the XSLT editor.
        # XSLT Tasarımı ✓ Geçerli button
        elem = page.get_by_role('button', name='XSLT Tasarımı ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'XSLT Tasarımı' tab to activate the XSLT editor and insert a valid invoice XSLT into the editor.
        # XSLT Tasarımı ✓ Geçerli button
        elem = page.get_by_role('button', name='XSLT Tasarımı ✓ Geçerli', exact=True)
        await elem.click(timeout=10000)
        
        # -> Click the 'XSLT Tasarımı' tab to activate the XSLT editor and insert a valid invoice XSLT into the editor.
        # <?
        elem = page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[3]/div[2]/section/div/div/div[1]/div[3]/div[1]/div[4]/div[1]/span/span[1]").nth(0)
        await elem.wait_for(state="visible", timeout=10000)
        await elem.fill("<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<xsl:stylesheet version=\"1.0\" xmlns:xsl=\"http://www.w3.org/1999/XSL/Transform\"\n                xmlns:cbc=\"urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2\">\n  <xsl:output method=\"html\" encoding=\"UTF-8\"/>\n  <xsl:template match=\"/\">\n    <html>\n      <body>\n        <h1>Invoice: <xsl:value-of select=\"/*/cbc:ID\"/></h1>\n        <p>Issue Date: <xsl:value-of select=\"/*/cbc:IssueDate\"/></p>\n      </body>\n    </html>\n  </xsl:template>\n</xsl:stylesheet>\n")
        
        # --> Assertions to verify final state
        
        # --> Verify both editors contain editable source content
        # Assert: The XSLT editor contains source text (contains 'xsl:stylesheet').
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[4]/div[2]/section/div/div/div[1]/div[5]/div/div[2]/div/span[1]").nth(0)).to_contain_text("xsl:stylesheet", timeout=15000), "The XSLT editor contains source text (contains 'xsl:stylesheet')."
        # Assert: The XML editor contains source text (contains a closing tag '</').
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[1]/div[2]/div/div[4]/div[2]/section/div/div/div[1]/div[3]/div[1]/div[4]/div[14]/span/span[1]").nth(0)).to_contain_text("</", timeout=15000), "The XML editor contains source text (contains a closing tag '</')."
        
        # --> Verify the preview area remains available
        # Assert: The preview iframe has the title 'Fatura Canlı Önizleme'.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0)).to_have_attribute("title", "Fatura Canl\u0131 \u00d6nizleme", timeout=15000), "The preview iframe has the title 'Fatura Canl\u0131 \u00d6nizleme'."
        await page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0).scroll_into_view_if_needed()
        # Assert: The preview iframe is visible on the page.
        await expect(page.locator("xpath=/html/body/div[1]/div/main/section[2]/div[2]/div[2]/div/iframe").nth(0)).to_be_visible(timeout=15000), "The preview iframe is visible on the page."
        await asyncio.sleep(5)

    finally:
        if context:
            await context.close()
        if browser:
            await browser.close()
        if pw:
            await pw.stop()

asyncio.run(run_test())
    