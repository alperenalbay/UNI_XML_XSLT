<?xml version="1.0" encoding="UTF-8"?><xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2" version="1.0" exclude-result-prefixes="cac cbc">
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    <xsl:template match="/*">
        <html>
            <head>
                <title>Sade Fatura Tablosu</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; background: white; color: black; line-height: 1.4; }
                    .header { font-size: 18px; font-weight: bold; border-bottom: 2px solid black; padding-bottom: 8px; margin-bottom: 15px; }
                    table { width: 100%; border-collapse: collapse; margin-top: 15px; margin-bottom: 15px; }
                    th, td { border: 1px solid #000; padding: 6px 10px; text-align: left; }
                    th { background-color: #f2f2f2; }
                    .totals { text-align: right; margin-top: 10px; }
                </style>
            </head>
            <body>
                <div class="header">
                    UNI XML&amp;XSLT - BASİT FATURA ÖNİZLEME
                </div>
                <div><b>Fatura ID:</b> <xsl:value-of select="cbc:ID"/></div>
                <div><b>Tarih:</b> <xsl:value-of select="cbc:IssueDate"/></div>
                <hr style="border: none; border-top: 1px dashed black; margin: 15px 0;"/>
                <div><b>Satıcı VKN:</b> <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification/cbc:ID"/></div>
                <div><b>Satıcı Unvan:</b> <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name"/></div>
                <br/>
                <div><b>Alıcı TCKN/VKN:</b> <xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID"/></div>
                <div><b>Alıcı Unvan:</b> <xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:PartyName/cbc:Name"/></div>
                
                <table>
                    <thead>
                        <tr>
                            <th style="width: 10%">No</th>
                            <th style="width: 50%">Mal / Hizmet</th>
                            <th style="width: 20%; text-align: center;">Miktar</th>
                            <th style="width: 20%; text-align: right;">Tutar</th>
                        </tr>
                    </thead>
                    <tbody>
                        <xsl:for-each select="cac:InvoiceLine">
                            <tr>
                                <td><xsl:value-of select="cbc:ID"/></td>
                                <td>Bulut Sunucuasdsad Barındırma Hizmeti (Yıllık)</td>
                                <td style="text-align: center;"><xsl:value-of select="cbc:InvoicedQuantity"/></td>
                                <td style="text-align: right;"><xsl:value-of select="cbc:LineExtensionAmount"/> TRY</td>
                            </tr>
                        </xsl:for-each>
                    </tbody>
                </table>
                <div class="totals">
                    <div><b>Ara Toplam:</b> <xsl:value-of select="cac:LegalMonetaryTotal/cbc:LineExtensionAmount"/> TRY</div>
                    <div><b>KDV Toplamı:</b> <xsl:value-of select="cac:TaxTotal/cbc:TaxAmount"/> TRY</div>
                    <div style="font-size: 15px; margin-top: 5px;"><b>Ödenecek Tutar:</b> <xsl:value-of select="cac:LegalMonetaryTotal/cbc:PayableAmount"/> TRY</div>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>