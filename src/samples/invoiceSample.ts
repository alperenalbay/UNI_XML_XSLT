export const DEFAULT_XML = `<?xml version="1.0" encoding="UTF-8"?>
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
         xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
         xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
         xmlns:ext="urn:oasis:names:specification:ubl:schema:xsd:CommonExtensionComponents-2">
    <cbc:UUID>f47ac10b-58cc-4372-a567-0e02b2c3d479</cbc:UUID>
    <cbc:ID>DEV2026000000456</cbc:ID>
    <cbc:IssueDate>2026-07-07</cbc:IssueDate>
    <cbc:IssueTime>13:30:00</cbc:IssueTime>
    <cbc:InvoiceTypeCode>SATIS</cbc:InvoiceTypeCode>
    <cbc:DocumentCurrencyCode>TRY</cbc:DocumentCurrencyCode>
    
    <cac:AccountingSupplierParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="VKN">1234567890</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>DEVATEK BİLİŞİM TEKNOLOJİLERİ A.Ş.</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>Teknopark Bulvarı, No:1 B Blok D:4</cbc:StreetName>
                <cbc:CitySubdivisionName>Pendik</cbc:CitySubdivisionName>
                <cbc:CityName>İstanbul</cbc:CityName>
                <cac:Country>
                    <cbc:Name>Türkiye</cbc:Name>
                </cac:Country>
            </cac:PostalAddress>
            <cac:PartyTaxScheme>
                <cac:TaxScheme>
                    <cbc:Name>Marmara Kurumlar</cbc:Name>
                </cac:TaxScheme>
            </cac:PartyTaxScheme>
            <cac:Contact>
                <cbc:Telephone>0216 555 44 33</cbc:Telephone>
                <cbc:ElectronicMail>info@devatek.com.tr</cbc:ElectronicMail>
            </cac:Contact>
        </cac:Party>
    </cac:AccountingSupplierParty>

    <cac:AccountingCustomerParty>
        <cac:Party>
            <cac:PartyIdentification>
                <cbc:ID schemeID="TCKN">98765432101</cbc:ID>
            </cac:PartyIdentification>
            <cac:PartyName>
                <cbc:Name>ÖRNEK MÜŞTERİ TEKNOLOJİ A.Ş.</cbc:Name>
            </cac:PartyName>
            <cac:PostalAddress>
                <cbc:StreetName>Atatürk Caddesi, Göztepe Sokak No:45</cbc:StreetName>
                <cbc:CitySubdivisionName>Kadıköy</cbc:CitySubdivisionName>
                <cbc:CityName>İstanbul</cbc:CityName>
                <cac:Country>
                    <cbc:Name>Türkiye</cbc:Name>
                </cac:Country>
            </cac:PostalAddress>
            <cac:Contact>
                <cbc:Telephone>0216 111 22 33</cbc:Telephone>
                <cbc:ElectronicMail>alici@ornek.com.tr</cbc:ElectronicMail>
            </cac:Contact>
        </cac:Party>
    </cac:AccountingCustomerParty>

    <cac:TaxTotal>
        <cbc:TaxAmount currencyID="TRY">500.00</cbc:TaxAmount>
        <cac:TaxSubtotal>
            <cbc:TaxableAmount currencyID="TRY">2500.00</cbc:TaxableAmount>
            <cbc:TaxAmount currencyID="TRY">500.00</cbc:TaxAmount>
            <cbc:Percent>20</cbc:Percent>
            <cac:TaxCategory>
                <cac:TaxScheme>
                    <cbc:Name>KDV</cbc:Name>
                </cac:TaxScheme>
            </cac:TaxCategory>
        </cac:TaxSubtotal>
    </cac:TaxTotal>

    <cac:LegalMonetaryTotal>
        <cbc:LineExtensionAmount currencyID="TRY">2500.00</cbc:LineExtensionAmount>
        <cbc:TaxExclusiveAmount currencyID="TRY">2500.00</cbc:TaxExclusiveAmount>
        <cbc:TaxInclusiveAmount currencyID="TRY">3000.00</cbc:TaxInclusiveAmount>
        <cbc:AllowanceTotalAmount currencyID="TRY">0.00</cbc:AllowanceTotalAmount>
        <cbc:PayableAmount currencyID="TRY">3000.00</cbc:PayableAmount>
    </cac:LegalMonetaryTotal>

    <cac:InvoiceLine>
        <cbc:ID>1</cbc:ID>
        <cbc:InvoicedQuantity unitCode="NIU">2</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="TRY">1000.00</cbc:LineExtensionAmount>
        <cac:Item>
            <cbc:Name>Yazılım Geliştirme Danışmanlık Hizmeti</cbc:Name>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="TRY">500.00</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>
    
    <cac:InvoiceLine>
        <cbc:ID>2</cbc:ID>
        <cbc:InvoicedQuantity unitCode="NIU">1</cbc:InvoicedQuantity>
        <cbc:LineExtensionAmount currencyID="TRY">1500.00</cbc:LineExtensionAmount>
        <cac:Item>
            <cbc:Name>Bulut Sunucu Barındırma Hizmeti (Yıllık)</cbc:Name>
        </cac:Item>
        <cac:Price>
            <cbc:PriceAmount currencyID="TRY">1500.00</cbc:PriceAmount>
        </cac:Price>
    </cac:InvoiceLine>
</Invoice>`;

export const DEFAULT_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" 
                xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                exclude-result-prefixes="cac cbc">
    <xsl:output method="html" indent="yes" encoding="UTF-8" doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN"/>
    
    <xsl:template match="/*">
        <html>
            <head>
                <title>E-Fatura Önizleme</title>
                <style type="text/css">
                    body {
                        font-family: 'Open Sans', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        margin: 0;
                        padding: 20px;
                        background-color: #ffffff;
                        color: #333333;
                        font-size: 13px;
                        line-height: 1.5;
                    }
                    .invoice-box {
                        max-width: 800px;
                        margin: auto;
                        padding: 25px;
                        border: 1px solid #e0e0e0;
                        border-radius: 8px;
                        box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
                        position: relative;
                    }
                    .header-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 25px;
                    }
                    .logo-section {
                        font-size: 24px;
                        font-weight: bold;
                        color: #4f46e5;
                    }
                    .invoice-info-section {
                        text-align: right;
                        font-size: 14px;
                    }
                    .invoice-title {
                        font-size: 20px;
                        font-weight: 800;
                        color: #111827;
                        margin-bottom: 5px;
                    }
                    .parties-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 25px;
                    }
                    .party-card {
                        width: 50%;
                        vertical-align: top;
                        padding: 12px;
                        border: 1px solid #f3f4f6;
                        background-color: #fafafa;
                        border-radius: 6px;
                    }
                    .party-title {
                        font-weight: bold;
                        color: #4b5563;
                        border-bottom: 2px solid #e5e7eb;
                        padding-bottom: 6px;
                        margin-bottom: 8px;
                        text-transform: uppercase;
                        font-size: 11px;
                        letter-spacing: 0.5px;
                    }
                    .items-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-bottom: 25px;
                    }
                    .items-table th {
                        background-color: #f3f4f6;
                        color: #374151;
                        text-align: left;
                        padding: 10px;
                        font-weight: 600;
                        border-bottom: 2px solid #e5e7eb;
                    }
                    .items-table td {
                        padding: 10px;
                        border-bottom: 1px solid #f3f4f6;
                    }
                    .totals-table {
                        width: 100%;
                        border-collapse: collapse;
                        margin-top: 15px;
                    }
                    .totals-table td {
                        padding: 6px 12px;
                        text-align: right;
                    }
                    .totals-table .label {
                        color: #6b7280;
                        font-weight: 500;
                    }
                    .totals-table .value {
                        font-weight: bold;
                        width: 120px;
                    }
                    .grand-total {
                        font-size: 16px;
                        background-color: #e0e7ff;
                        color: #3730a3;
                    }
                    .grand-total td {
                        padding: 10px 12px;
                        border-top: 2px solid #4f46e5;
                    }
                    .badge {
                        display: inline-block;
                        padding: 2px 8px;
                        background-color: #e0f2fe;
                        color: #0369a1;
                        border-radius: 12px;
                        font-size: 11px;
                        font-weight: 600;
                    }
                    .watermark-stamp {
                        position: absolute;
                        top: 150px;
                        right: 80px;
                        border: 4px double #ef4444;
                        color: #ef4444;
                        font-size: 26px;
                        font-weight: bold;
                        padding: 6px 16px;
                        transform: rotate(-15deg);
                        border-radius: 6px;
                        opacity: 0.75;
                        text-transform: uppercase;
                        display: block;
                    }
                </style>
            </head>
            <body>
                <div class="invoice-box">
                    <div class="watermark-stamp">ÖDENDİ</div>
                    <!-- Üst Bilgiler -->
                    <table class="header-table">
                        <tr>
                            <td class="logo-section">
                                <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name"/>
                            </td>
                            <td class="invoice-info-section">
                                <div class="invoice-title">E-FATURA</div>
                                <div><b>Fatura No:</b> <xsl:value-of select="cbc:ID"/></div>
                                <div><b>Tarih:</b> <xsl:value-of select="cbc:IssueDate"/></div>
                                <div><b>Zaman:</b> <xsl:value-of select="cbc:IssueTime"/></div>
                                <div><b>Tür:</b> <span class="badge"><xsl:value-of select="cbc:InvoiceTypeCode"/></span></div>
                            </td>
                        </tr>
                    </table>

                    <!-- Taraf Bilgileri -->
                    <table class="parties-table">
                        <tr>
                            <td class="party-card supplier-col" style="padding-right: 10px;">
                                <div class="party-title">Satıcı Bilgileri</div>
                                <b><xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PartyName/cbc:Name"/></b><br/>
                                <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cbc:StreetName"/><br/>
                                <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cbc:CitySubdivisionName"/> / 
                                <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cbc:CityName"/><br/>
                                <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PostalAddress/cac:Country/cbc:Name"/><br/>
                                <b>Vergi Dairesi:</b> <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PartyTaxScheme/cac:TaxScheme/cbc:Name"/><br/>
                                <b>VKN:</b> <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification/cbc:ID"/><br/>
                                <b>E-posta:</b> <xsl:value-of select="cac:AccountingSupplierParty/cac:Party/cac:Contact/cbc:ElectronicMail"/>
                            </td>
                            <td class="party-card customer-col" style="padding-left: 10px;">
                                <div class="party-title">Alıcı Bilgileri</div>
                                <b><xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:PartyName/cbc:Name"/></b><br/>
                                <xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:PostalAddress/cbc:StreetName"/><br/>
                                <xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:PostalAddress/cbc:CitySubdivisionName"/> / 
                                <xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:PostalAddress/cbc:CityName"/><br/>
                                <xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:PostalAddress/cac:Country/cbc:Name"/><br/>
                                <b>TCKN/VKN:</b> <xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID"/><br/>
                                <b>E-posta:</b> <xsl:value-of select="cac:AccountingCustomerParty/cac:Party/cac:Contact/cbc:ElectronicMail"/>
                            </td>
                        </tr>
                    </table>

                    <!-- Kalem Bilgileri -->
                    <table class="items-table">
                        <thead>
                            <tr>
                                <th style="width: 5%;">No</th>
                                <th style="width: 55%;">Mal / Hizmet Açıklaması</th>
                                <th style="width: 10%; text-align: center;">Miktar</th>
                                <th style="width: 15%; text-align: right;">Birim Fiyat</th>
                                <th style="width: 15%; text-align: right;">Toplam Tutar</th>
                            </tr>
                        </thead>
                        <tbody>
                            <xsl:for-each select="cac:InvoiceLine">
                                <tr>
                                    <td><xsl:value-of select="cbc:ID"/></td>
                                    <td><xsl:value-of select="cac:Item/cbc:Name"/></td>
                                    <td style="text-align: center;"><xsl:value-of select="cbc:InvoicedQuantity"/></td>
                                    <td style="text-align: right;"><xsl:value-of select="format-number(cac:Price/cbc:PriceAmount, '#,##0.00')"/> TRY</td>
                                    <td style="text-align: right;"><xsl:value-of select="format-number(cbc:LineExtensionAmount, '#,##0.00')"/> TRY</td>
                                </tr>
                            </xsl:for-each>
                        </tbody>
                    </table>

                    <!-- Toplam Bilgileri -->
                    <table style="width: 100%; border-collapse: collapse;">
                        <tr>
                            <td style="width: 50%;"></td>
                            <td style="width: 50%; vertical-align: top;">
                                <table class="totals-table">
                                    <tr>
                                        <td class="label">Ara Toplam:</td>
                                        <td class="value"><xsl:value-of select="format-number(cac:LegalMonetaryTotal/cbc:LineExtensionAmount, '#,##0.00')"/> TRY</td>
                                    </tr>
                                    <xsl:for-each select="cac:TaxTotal/cac:TaxSubtotal">
                                        <tr>
                                            <td class="label">Hesaplanan KDV (%<xsl:value-of select="cbc:Percent"/>):</td>
                                            <td class="value"><xsl:value-of select="format-number(cbc:TaxAmount, '#,##0.00')"/> TRY</td>
                                        </tr>
                                    </xsl:for-each>
                                    <tr class="grand-total">
                                        <td class="label" style="font-weight: bold; color: #3730a3;">Ödenecek Tutar:</td>
                                        <td class="value"><xsl:value-of select="format-number(cac:LegalMonetaryTotal/cbc:PayableAmount, '#,##0.00')"/> TRY</td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>`;

export const SIMPLE_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                exclude-result-prefixes="cac cbc">
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
                <hr style="border: none; border-top: 1px dashed black; margin: 15px 0;" />
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
                                <td><xsl:value-of select="cac:Item/cbc:Name"/></td>
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
</xsl:stylesheet>`;

export const EMPTY_XSLT = `<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
                xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
                xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
                exclude-result-prefixes="cac cbc">
    <xsl:output method="html" indent="yes" encoding="UTF-8"/>
    <xsl:template match="/*">
        <html>
            <head>
                <title>Yeni Şablon Tasarımı</title>
                <style>
                    body { font-family: sans-serif; padding: 25px; background-color: #fafafa; }
                    .page { background: white; padding: 30px; border: 1px solid #ccc; max-width: 800px; margin: 0 auto; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
                </style>
            </head>
            <body>
                <div class="page">
                    <h2>Fatura No: <xsl:value-of select="cbc:ID"/></h2>
                    <p>Fatura Tarihi: <xsl:value-of select="cbc:IssueDate"/></p>
                    
                    <!-- Tasarım kodlarınızı buraya ekleyebilirsiniz -->
                    
                </div>
            </body>
        </html>
    </xsl:template>
</xsl:stylesheet>`;

