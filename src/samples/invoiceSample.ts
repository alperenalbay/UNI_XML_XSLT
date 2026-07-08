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
<xsl:stylesheet version="2.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
				xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2"
				xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2"
				xmlns:ccts="urn:un:unece:uncefact:documentation:2"
				xmlns:clm54217="urn:un:unece:uncefact:codelist:specification:54217:2001"
				xmlns:clm5639="urn:un:unece:uncefact:codelist:specification:5639:1988"
				xmlns:clm66411="urn:un:unece:uncefact:codelist:specification:66411:2001"
				xmlns:clmIANAMIMEMediaType="urn:un:unece:uncefact:codelist:specification:IANAMIMEMediaType:2003"
				xmlns:fn="http://www.w3.org/2005/xpath-functions" xmlns:link="http://www.xbrl.org/2003/linkbase"
				xmlns:n1="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2"
				xmlns:qdt="urn:oasis:names:specification:ubl:schema:xsd:QualifiedDatatypes-2"
				xmlns:udt="urn:un:unece:uncefact:data:specification:UnqualifiedDataTypesSchemaModule:2"
				xmlns:xbrldi="http://xbrl.org/2006/xbrldi" xmlns:xbrli="http://www.xbrl.org/2003/instance"
				xmlns:xdt="http://www.w3.org/2005/xpath-datatypes" xmlns:xlink="http://www.w3.org/1999/xlink"
				xmlns:xs="http://www.w3.org/2001/XMLSchema" xmlns:xsd="http://www.w3.org/2001/XMLSchema"
				xmlns:lcl="http://www.efatura.gov.tr/local"
				xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
				exclude-result-prefixes="cac cbc ccts clm54217 clm5639 clm66411 clmIANAMIMEMediaType fn link n1 qdt udt xbrldi xbrli xdt xlink xs xsd xsi lcl">
	<xsl:character-map name="a">
		<xsl:output-character character="&#128;" string=""/>
		<xsl:output-character character="&#129;" string=""/>
		<xsl:output-character character="&#130;" string=""/>
		<xsl:output-character character="&#131;" string=""/>
		<xsl:output-character character="&#132;" string=""/>
		<xsl:output-character character="&#133;" string=""/>
		<xsl:output-character character="&#134;" string=""/>
		<xsl:output-character character="&#135;" string=""/>
		<xsl:output-character character="&#136;" string=""/>
		<xsl:output-character character="&#137;" string=""/>
		<xsl:output-character character="&#138;" string=""/>
		<xsl:output-character character="&#139;" string=""/>
		<xsl:output-character character="&#140;" string=""/>
		<xsl:output-character character="&#141;" string=""/>
		<xsl:output-character character="&#142;" string=""/>
		<xsl:output-character character="&#143;" string=""/>
		<xsl:output-character character="&#144;" string=""/>
		<xsl:output-character character="&#145;" string=""/>
		<xsl:output-character character="&#146;" string=""/>
		<xsl:output-character character="&#147;" string=""/>
		<xsl:output-character character="&#148;" string=""/>
		<xsl:output-character character="&#149;" string=""/>
		<xsl:output-character character="&#150;" string=""/>
		<xsl:output-character character="&#151;" string=""/>
		<xsl:output-character character="&#152;" string=""/>
		<xsl:output-character character="&#153;" string=""/>
		<xsl:output-character character="&#154;" string=""/>
		<xsl:output-character character="&#155;" string=""/>
		<xsl:output-character character="&#156;" string=""/>
		<xsl:output-character character="&#157;" string=""/>
		<xsl:output-character character="&#158;" string=""/>
		<xsl:output-character character="&#159;" string=""/>
	</xsl:character-map>
	<xsl:decimal-format name="european" decimal-separator="," grouping-separator="." NaN=""/>
	<xsl:output version="4.0" method="html" indent="no" encoding="UTF-8"
				doctype-public="-//W3C//DTD HTML 4.01 Transitional//EN"
				doctype-system="http://www.w3.org/TR/html4/loose.dtd" use-character-maps="a"/>
	<xsl:param name="SV_OutputFormat" select="'HTML'"/>
	<xsl:variable name="XML" select="/"/>
	<xsl:variable name="vareczanehizmetbedeli">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_EHB:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vartutar">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_BRT:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="variskonto">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_ISK:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varkatilimpayi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_HKP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varisitmekatilimpayi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_IKP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varilacfarki">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_ILF:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varsiparissorumlusu">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,4) = 'SS:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,3),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varkdv8">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_K08:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varkdv18">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_K18:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vareczanekdv18">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_EHK:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varpsf">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_PSF:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varreceteadedi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_RCA:'">
					<xsl:value-of select="substring-after(substring(.,8),':')" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vareldenilackatilimpayi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_EIP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varmaasdanilackatilimpayi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_MIP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vareldenmuayenekatilimpayi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_EMP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varmaasmuayenekatilimpayi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_MMP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="vareldenrecetekatilimpayi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_ERP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varmaastanrecetekatilimpayi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_MRP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,8),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varfaturatipi">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,12) = 'FATURATIPI:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,10),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varoptik">
		<xsl:for-each select="//n1:Invoice/cbc:Note">
			<xsl:choose>
				<xsl:when test="substring(.,0,9) = 'SGK_TYP:'">
					<xsl:value-of select="normalize-space(substring-after(substring(.,7),':'))" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varExportInsurance" select="count(//cac:Shipment[cbc:InsuranceValueAmount])"/>
	<xsl:variable name="varExportCarriage" select="count(//cac:Shipment[cbc:DeclaredForCarriageValueAmount])"/>
	<xsl:variable name="varEtiketFiyati">
		<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
			<xsl:for-each select="cbc:Note">
				<xsl:choose>
					<xsl:when test="substring(.,0,5) = 'ETF:' or substring(.,0,5) = 'ESF:'">
						<xsl:value-of select="1" />
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varEczaciKar">
		<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
			<xsl:for-each select="cbc:Note">
				<xsl:choose>
					<xsl:when test="substring(.,0,5) = 'ECK:' or substring(.,0,5) = 'EKO:'">
						<xsl:value-of select="1" />
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varKurumIskonto">
		<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
			<xsl:for-each select="cbc:Note">
				<xsl:choose>
					<xsl:when test="substring(.,0,5) = 'KRI:'">
						<xsl:value-of select="1" />
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varDepocuFiyati">
		<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
			<xsl:for-each select="cbc:Note">
				<xsl:choose>
					<xsl:when test="substring(.,0,5) = 'DSF:'">
						<xsl:value-of select="1" />
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varVade">
		<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
			<xsl:for-each select="cbc:Note">
				<xsl:choose>
					<xsl:when test="substring(.,0,5) = 'VAD:'">
						<xsl:value-of select="1" />
					</xsl:when>
				</xsl:choose>
			</xsl:for-each>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varBranchName">
		<xsl:for-each select="//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode[text()='SUBE_UNVAN']">
			<xsl:choose>
				<xsl:when	test="../cbc:DocumentTypeCode='SUBE_UNVAN'">
					<xsl:value-of select="1" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>

	<xsl:variable name="varSenaryoName">
		<xsl:for-each select="//n1:Invoice/cbc:ProfileID">
			<xsl:choose>
				<xsl:when test="substring(.,0,5) = 'KAMU'">
					<xsl:value-of select="1" />
				</xsl:when>
			</xsl:choose>
		</xsl:for-each>
	</xsl:variable>
	<xsl:variable name="varVknComp">
		<xsl:if test="(//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='VKN'])=(//n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='VKN'])">
			<xsl:value-of select="1" />
		</xsl:if>
	</xsl:variable>

	<xsl:variable name="varItemCode" select="count(//cac:SellersItemIdentification[cbc:ID !=''])"/>
	<xsl:variable name="varAllowanceRate" select="count(//n1:Invoice/cac:InvoiceLine/cac:AllowanceCharge[cbc:MultiplierFactorNumeric !=''])"/>
	<xsl:variable name="varAllowanceAmount" select="count(//n1:Invoice/cac:InvoiceLine/cac:AllowanceCharge[cbc:Amount !=''])"/>
	<xsl:variable name="varAllowanceReason" select="count(//n1:Invoice/cac:InvoiceLine/cac:AllowanceCharge[cbc:AllowanceChargeReason !=''])"/>
	<xsl:variable name="varLineExplanation" select="count(//n1:Invoice/cac:InvoiceLine[cbc:Note !=''])"/>

	<xsl:template match="/">
		<html>
			<head>
				<script type="text/javascript">
					<![CDATA[var QRCode;!function(){function a(a){this.mode=c.MODE_8BIT_BYTE,this.data=a,this.parsedData=[];for(var b=[],d=0,e=this.data.length;e>d;d++){var f=this.data.charCodeAt(d);f>65536?(b[0]=240|(1835008&f)>>>18,b[1]=128|(258048&f)>>>12,b[2]=128|(4032&f)>>>6,b[3]=128|63&f):f>2048?(b[0]=224|(61440&f)>>>12,b[1]=128|(4032&f)>>>6,b[2]=128|63&f):f>128?(b[0]=192|(1984&f)>>>6,b[1]=128|63&f):b[0]=f,this.parsedData=this.parsedData.concat(b)}this.parsedData.length!=this.data.length&&(this.parsedData.unshift(191),this.parsedData.unshift(187),this.parsedData.unshift(239))}function b(a,b){this.typeNumber=a,this.errorCorrectLevel=b,this.modules=null,this.moduleCount=0,this.dataCache=null,this.dataList=[]}function i(a,b){if(void 0==a.length)throw new Error(a.length+"/"+b);for(var c=0;c<a.length&&0==a[c];)c++;this.num=new Array(a.length-c+b);for(var d=0;d<a.length-c;d++)this.num[d]=a[d+c]}function j(a,b){this.totalCount=a,this.dataCount=b}function k(){this.buffer=[],this.length=0}function m(){return"undefined"!=typeof CanvasRenderingContext2D}function n(){var a=!1,b=navigator.userAgent;return/android/i.test(b)&&(a=!0,aMat=b.toString().match(/android ([0-9]\\.[0-9])/i),aMat&&aMat[1]&&(a=parseFloat(aMat[1]))),a}function r(a,b){for(var c=1,e=s(a),f=0,g=l.length;g>=f;f++){var h=0;switch(b){case d.L:h=l[f][0];break;case d.M:h=l[f][1];break;case d.Q:h=l[f][2];break;case d.H:h=l[f][3]}if(h>=e)break;c++}if(c>l.length)throw new Error("Too long data");return c}function s(a){var b=encodeURI(a).toString().replace(/\\%[0-9a-fA-F]{2}/g,"a");return b.length+(b.length!=a?3:0)}a.prototype={getLength:function(){return this.parsedData.length},write:function(a){for(var b=0,c=this.parsedData.length;c>b;b++)a.put(this.parsedData[b],8)}},b.prototype={addData:function(b){var c=new a(b);this.dataList.push(c),this.dataCache=null},isDark:function(a,b){if(0>a||this.moduleCount<=a||0>b||this.moduleCount<=b)throw new Error(a+","+b);return this.modules[a][b]},getModuleCount:function(){return this.moduleCount},make:function(){this.makeImpl(!1,this.getBestMaskPattern())},makeImpl:function(a,c){this.moduleCount=4*this.typeNumber+17,this.modules=new Array(this.moduleCount);for(var d=0;d<this.moduleCount;d++){this.modules[d]=new Array(this.moduleCount);for(var e=0;e<this.moduleCount;e++)this.modules[d][e]=null}this.setupPositionProbePattern(0,0),this.setupPositionProbePattern(this.moduleCount-7,0),this.setupPositionProbePattern(0,this.moduleCount-7),this.setupPositionAdjustPattern(),this.setupTimingPattern(),this.setupTypeInfo(a,c),this.typeNumber>=7&&this.setupTypeNumber(a),null==this.dataCache&&(this.dataCache=b.createData(this.typeNumber,this.errorCorrectLevel,this.dataList)),this.mapData(this.dataCache,c)},setupPositionProbePattern:function(a,b){for(var c=-1;7>=c;c++)if(!(-1>=a+c||this.moduleCount<=a+c))for(var d=-1;7>=d;d++)-1>=b+d||this.moduleCount<=b+d||(this.modules[a+c][b+d]=c>=0&&6>=c&&(0==d||6==d)||d>=0&&6>=d&&(0==c||6==c)||c>=2&&4>=c&&d>=2&&4>=d?!0:!1)},getBestMaskPattern:function(){for(var a=0,b=0,c=0;8>c;c++){this.makeImpl(!0,c);var d=f.getLostPoint(this);(0==c||a>d)&&(a=d,b=c)}return b},createMovieClip:function(a,b,c){var d=a.createEmptyMovieClip(b,c),e=1;this.make();for(var f=0;f<this.modules.length;f++)for(var g=f*e,h=0;h<this.modules[f].length;h++){var i=h*e,j=this.modules[f][h];j&&(d.beginFill(0,100),d.moveTo(i,g),d.lineTo(i+e,g),d.lineTo(i+e,g+e),d.lineTo(i,g+e),d.endFill())}return d},setupTimingPattern:function(){for(var a=8;a<this.moduleCount-8;a++)null==this.modules[a][6]&&(this.modules[a][6]=0==a%2);for(var b=8;b<this.moduleCount-8;b++)null==this.modules[6][b]&&(this.modules[6][b]=0==b%2)},setupPositionAdjustPattern:function(){for(var a=f.getPatternPosition(this.typeNumber),b=0;b<a.length;b++)for(var c=0;c<a.length;c++){var d=a[b],e=a[c];if(null==this.modules[d][e])for(var g=-2;2>=g;g++)for(var h=-2;2>=h;h++)this.modules[d+g][e+h]=-2==g||2==g||-2==h||2==h||0==g&&0==h?!0:!1}},setupTypeNumber:function(a){for(var b=f.getBCHTypeNumber(this.typeNumber),c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[Math.floor(c/3)][c%3+this.moduleCount-8-3]=d}for(var c=0;18>c;c++){var d=!a&&1==(1&b>>c);this.modules[c%3+this.moduleCount-8-3][Math.floor(c/3)]=d}},setupTypeInfo:function(a,b){for(var c=this.errorCorrectLevel<<3|b,d=f.getBCHTypeInfo(c),e=0;15>e;e++){var g=!a&&1==(1&d>>e);6>e?this.modules[e][8]=g:8>e?this.modules[e+1][8]=g:this.modules[this.moduleCount-15+e][8]=g}for(var e=0;15>e;e++){var g=!a&&1==(1&d>>e);8>e?this.modules[8][this.moduleCount-e-1]=g:9>e?this.modules[8][15-e-1+1]=g:this.modules[8][15-e-1]=g}this.modules[this.moduleCount-8][8]=!a},mapData:function(a,b){for(var c=-1,d=this.moduleCount-1,e=7,g=0,h=this.moduleCount-1;h>0;h-=2)for(6==h&&h--;;){for(var i=0;2>i;i++)if(null==this.modules[d][h-i]){var j=!1;g<a.length&&(j=1==(1&a[g]>>>e));var k=f.getMask(b,d,h-i);k&&(j=!j),this.modules[d][h-i]=j,e--,-1==e&&(g++,e=7)}if(d+=c,0>d||this.moduleCount<=d){d-=c,c=-c;break}}}},b.PAD0=236,b.PAD1=17,b.createData=function(a,c,d){for(var e=j.getRSBlocks(a,c),g=new k,h=0;h<d.length;h++){var i=d[h];g.put(i.mode,4),g.put(i.getLength(),f.getLengthInBits(i.mode,a)),i.write(g)}for(var l=0,h=0;h<e.length;h++)l+=e[h].dataCount;if(g.getLengthInBits()>8*l)throw new Error("code length overflow. ("+g.getLengthInBits()+">"+8*l+")");for(g.getLengthInBits()+4<=8*l&&g.put(0,4);0!=g.getLengthInBits()%8;)g.putBit(!1);for(;;){if(g.getLengthInBits()>=8*l)break;if(g.put(b.PAD0,8),g.getLengthInBits()>=8*l)break;g.put(b.PAD1,8)}return b.createBytes(g,e)},b.createBytes=function(a,b){for(var c=0,d=0,e=0,g=new Array(b.length),h=new Array(b.length),j=0;j<b.length;j++){var k=b[j].dataCount,l=b[j].totalCount-k;d=Math.max(d,k),e=Math.max(e,l),g[j]=new Array(k);for(var m=0;m<g[j].length;m++)g[j][m]=255&a.buffer[m+c];c+=k;var n=f.getErrorCorrectPolynomial(l),o=new i(g[j],n.getLength()-1),p=o.mod(n);h[j]=new Array(n.getLength()-1);for(var m=0;m<h[j].length;m++){var q=m+p.getLength()-h[j].length;h[j][m]=q>=0?p.get(q):0}}for(var r=0,m=0;m<b.length;m++)r+=b[m].totalCount;for(var s=new Array(r),t=0,m=0;d>m;m++)for(var j=0;j<b.length;j++)m<g[j].length&&(s[t++]=g[j][m]);for(var m=0;e>m;m++)for(var j=0;j<b.length;j++)m<h[j].length&&(s[t++]=h[j][m]);return s};for(var c={MODE_NUMBER:1,MODE_ALPHA_NUM:2,MODE_8BIT_BYTE:4,MODE_KANJI:8},d={L:1,M:0,Q:3,H:2},e={PATTERN000:0,PATTERN001:1,PATTERN010:2,PATTERN011:3,PATTERN100:4,PATTERN101:5,PATTERN110:6,PATTERN111:7},f={PATTERN_POSITION_TABLE:[[],[6,18],[6,22],[6,26],[6,30],[6,34],[6,22,38],[6,24,42],[6,26,46],[6,28,50],[6,30,54],[6,32,58],[6,34,62],[6,26,46,66],[6,26,48,70],[6,26,50,74],[6,30,54,78],[6,30,56,82],[6,30,58,86],[6,34,62,90],[6,28,50,72,94],[6,26,50,74,98],[6,30,54,78,102],[6,28,54,80,106],[6,32,58,84,110],[6,30,58,86,114],[6,34,62,90,118],[6,26,50,74,98,122],[6,30,54,78,102,126],[6,26,52,78,104,130],[6,30,56,82,108,134],[6,34,60,86,112,138],[6,30,58,86,114,142],[6,34,62,90,118,146],[6,30,54,78,102,126,150],[6,24,50,76,102,128,154],[6,28,54,80,106,132,158],[6,32,58,84,110,136,162],[6,26,54,82,110,138,166],[6,30,58,86,114,142,170]],G15:1335,G18:7973,G15_MASK:21522,getBCHTypeInfo:function(a){for(var b=a<<10;f.getBCHDigit(b)-f.getBCHDigit(f.G15)>=0;)b^=f.G15<<f.getBCHDigit(b)-f.getBCHDigit(f.G15);return(a<<10|b)^f.G15_MASK},getBCHTypeNumber:function(a){for(var b=a<<12;f.getBCHDigit(b)-f.getBCHDigit(f.G18)>=0;)b^=f.G18<<f.getBCHDigit(b)-f.getBCHDigit(f.G18);return a<<12|b},getBCHDigit:function(a){for(var b=0;0!=a;)b++,a>>>=1;return b},getPatternPosition:function(a){return f.PATTERN_POSITION_TABLE[a-1]},getMask:function(a,b,c){switch(a){case e.PATTERN000:return 0==(b+c)%2;case e.PATTERN001:return 0==b%2;case e.PATTERN010:return 0==c%3;case e.PATTERN011:return 0==(b+c)%3;case e.PATTERN100:return 0==(Math.floor(b/2)+Math.floor(c/3))%2;case e.PATTERN101:return 0==b*c%2+b*c%3;case e.PATTERN110:return 0==(b*c%2+b*c%3)%2;case e.PATTERN111:return 0==(b*c%3+(b+c)%2)%2;default:throw new Error("bad maskPattern:"+a)}},getErrorCorrectPolynomial:function(a){for(var b=new i([1],0),c=0;a>c;c++)b=b.multiply(new i([1,g.gexp(c)],0));return b},getLengthInBits:function(a,b){if(b>=1&&10>b)switch(a){case c.MODE_NUMBER:return 10;case c.MODE_ALPHA_NUM:return 9;case c.MODE_8BIT_BYTE:return 8;case c.MODE_KANJI:return 8;default:throw new Error("mode:"+a)}else if(27>b)switch(a){case c.MODE_NUMBER:return 12;case c.MODE_ALPHA_NUM:return 11;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 10;default:throw new Error("mode:"+a)}else{if(!(41>b))throw new Error("type:"+b);switch(a){case c.MODE_NUMBER:return 14;case c.MODE_ALPHA_NUM:return 13;case c.MODE_8BIT_BYTE:return 16;case c.MODE_KANJI:return 12;default:throw new Error("mode:"+a)}}},getLostPoint:function(a){for(var b=a.getModuleCount(),c=0,d=0;b>d;d++)for(var e=0;b>e;e++){for(var f=0,g=a.isDark(d,e),h=-1;1>=h;h++)if(!(0>d+h||d+h>=b))for(var i=-1;1>=i;i++)0>e+i||e+i>=b||(0!=h||0!=i)&&g==a.isDark(d+h,e+i)&&f++;f>5&&(c+=3+f-5)}for(var d=0;b-1>d;d++)for(var e=0;b-1>e;e++){var j=0;a.isDark(d,e)&&j++,a.isDark(d+1,e)&&j++,a.isDark(d,e+1)&&j++,a.isDark(d+1,e+1)&&j++,(0==j||4==j)&&(c+=3)}for(var d=0;b>d;d++)for(var e=0;b-6>e;e++)a.isDark(d,e)&&!a.isDark(d,e+1)&&a.isDark(d,e+2)&&a.isDark(d,e+3)&&a.isDark(d,e+4)&&!a.isDark(d,e+5)&&a.isDark(d,e+6)&&(c+=40);for(var e=0;b>e;e++)for(var d=0;b-6>d;d++)a.isDark(d,e)&&!a.isDark(d+1,e)&&a.isDark(d+2,e)&&a.isDark(d+3,e)&&a.isDark(d+4,e)&&!a.isDark(d+5,e)&&a.isDark(d+6,e)&&(c+=40);for(var k=0,e=0;b>e;e++)for(var d=0;b>d;d++)a.isDark(d,e)&&k++;var l=Math.abs(100*k/b/b-50)/5;return c+=10*l}},g={glog:function(a){if(1>a)throw new Error("glog("+a+")");return g.LOG_TABLE[a]},gexp:function(a){for(;0>a;)a+=255;for(;a>=256;)a-=255;return g.EXP_TABLE[a]},EXP_TABLE:new Array(256),LOG_TABLE:new Array(256)},h=0;8>h;h++)g.EXP_TABLE[h]=1<<h;for(var h=8;256>h;h++)g.EXP_TABLE[h]=g.EXP_TABLE[h-4]^g.EXP_TABLE[h-5]^g.EXP_TABLE[h-6]^g.EXP_TABLE[h-8];for(var h=0;255>h;h++)g.LOG_TABLE[g.EXP_TABLE[h]]=h;i.prototype={get:function(a){return this.num[a]},getLength:function(){return this.num.length},multiply:function(a){for(var b=new Array(this.getLength()+a.getLength()-1),c=0;c<this.getLength();c++)for(var d=0;d<a.getLength();d++)b[c+d]^=g.gexp(g.glog(this.get(c))+g.glog(a.get(d)));return new i(b,0)},mod:function(a){if(this.getLength()-a.getLength()<0)return this;for(var b=g.glog(this.get(0))-g.glog(a.get(0)),c=new Array(this.getLength()),d=0;d<this.getLength();d++)c[d]=this.get(d);for(var d=0;d<a.getLength();d++)c[d]^=g.gexp(g.glog(a.get(d))+b);return new i(c,0).mod(a)}},j.RS_BLOCK_TABLE=[[1,26,19],[1,26,16],[1,26,13],[1,26,9],[1,44,34],[1,44,28],[1,44,22],[1,44,16],[1,70,55],[1,70,44],[2,35,17],[2,35,13],[1,100,80],[2,50,32],[2,50,24],[4,25,9],[1,134,108],[2,67,43],[2,33,15,2,34,16],[2,33,11,2,34,12],[2,86,68],[4,43,27],[4,43,19],[4,43,15],[2,98,78],[4,49,31],[2,32,14,4,33,15],[4,39,13,1,40,14],[2,121,97],[2,60,38,2,61,39],[4,40,18,2,41,19],[4,40,14,2,41,15],[2,146,116],[3,58,36,2,59,37],[4,36,16,4,37,17],[4,36,12,4,37,13],[2,86,68,2,87,69],[4,69,43,1,70,44],[6,43,19,2,44,20],[6,43,15,2,44,16],[4,101,81],[1,80,50,4,81,51],[4,50,22,4,51,23],[3,36,12,8,37,13],[2,116,92,2,117,93],[6,58,36,2,59,37],[4,46,20,6,47,21],[7,42,14,4,43,15],[4,133,107],[8,59,37,1,60,38],[8,44,20,4,45,21],[12,33,11,4,34,12],[3,145,115,1,146,116],[4,64,40,5,65,41],[11,36,16,5,37,17],[11,36,12,5,37,13],[5,109,87,1,110,88],[5,65,41,5,66,42],[5,54,24,7,55,25],[11,36,12],[5,122,98,1,123,99],[7,73,45,3,74,46],[15,43,19,2,44,20],[3,45,15,13,46,16],[1,135,107,5,136,108],[10,74,46,1,75,47],[1,50,22,15,51,23],[2,42,14,17,43,15],[5,150,120,1,151,121],[9,69,43,4,70,44],[17,50,22,1,51,23],[2,42,14,19,43,15],[3,141,113,4,142,114],[3,70,44,11,71,45],[17,47,21,4,48,22],[9,39,13,16,40,14],[3,135,107,5,136,108],[3,67,41,13,68,42],[15,54,24,5,55,25],[15,43,15,10,44,16],[4,144,116,4,145,117],[17,68,42],[17,50,22,6,51,23],[19,46,16,6,47,17],[2,139,111,7,140,112],[17,74,46],[7,54,24,16,55,25],[34,37,13],[4,151,121,5,152,122],[4,75,47,14,76,48],[11,54,24,14,55,25],[16,45,15,14,46,16],[6,147,117,4,148,118],[6,73,45,14,74,46],[11,54,24,16,55,25],[30,46,16,2,47,17],[8,132,106,4,133,107],[8,75,47,13,76,48],[7,54,24,22,55,25],[22,45,15,13,46,16],[10,142,114,2,143,115],[19,74,46,4,75,47],[28,50,22,6,51,23],[33,46,16,4,47,17],[8,152,122,4,153,123],[22,73,45,3,74,46],[8,53,23,26,54,24],[12,45,15,28,46,16],[3,147,117,10,148,118],[3,73,45,23,74,46],[4,54,24,31,55,25],[11,45,15,31,46,16],[7,146,116,7,147,117],[21,73,45,7,74,46],[1,53,23,37,54,24],[19,45,15,26,46,16],[5,145,115,10,146,116],[19,75,47,10,76,48],[15,54,24,25,55,25],[23,45,15,25,46,16],[13,145,115,3,146,116],[2,74,46,29,75,47],[42,54,24,1,55,25],[23,45,15,28,46,16],[17,145,115],[10,74,46,23,75,47],[10,54,24,35,55,25],[19,45,15,35,46,16],[17,145,115,1,146,116],[14,74,46,21,75,47],[29,54,24,19,55,25],[11,45,15,46,46,16],[13,145,115,6,146,116],[14,74,46,23,75,47],[44,54,24,7,55,25],[59,46,16,1,47,17],[12,151,121,7,152,122],[12,75,47,26,76,48],[39,54,24,14,55,25],[22,45,15,41,46,16],[6,151,121,14,152,122],[6,75,47,34,76,48],[46,54,24,10,55,25],[2,45,15,64,46,16],[17,152,122,4,153,123],[29,74,46,14,75,47],[49,54,24,10,55,25],[24,45,15,46,46,16],[4,152,122,18,153,123],[13,74,46,32,75,47],[48,54,24,14,55,25],[42,45,15,32,46,16],[20,147,117,4,148,118],[40,75,47,7,76,48],[43,54,24,22,55,25],[10,45,15,67,46,16],[19,148,118,6,149,119],[18,75,47,31,76,48],[34,54,24,34,55,25],[20,45,15,61,46,16]],j.getRSBlocks=function(a,b){var c=j.getRsBlockTable(a,b);if(void 0==c)throw new Error("bad rs block @ typeNumber:"+a+"/errorCorrectLevel:"+b);for(var d=c.length/3,e=[],f=0;d>f;f++)for(var g=c[3*f+0],h=c[3*f+1],i=c[3*f+2],k=0;g>k;k++)e.push(new j(h,i));return e},j.getRsBlockTable=function(a,b){switch(b){case d.L:return j.RS_BLOCK_TABLE[4*(a-1)+0];case d.M:return j.RS_BLOCK_TABLE[4*(a-1)+1];case d.Q:return j.RS_BLOCK_TABLE[4*(a-1)+2];case d.H:return j.RS_BLOCK_TABLE[4*(a-1)+3];default:return void 0}},k.prototype={get:function(a){var b=Math.floor(a/8);return 1==(1&this.buffer[b]>>>7-a%8)},put:function(a,b){for(var c=0;b>c;c++)this.putBit(1==(1&a>>>b-c-1))},getLengthInBits:function(){return this.length},putBit:function(a){var b=Math.floor(this.length/8);this.buffer.length<=b&&this.buffer.push(0),a&&(this.buffer[b]|=128>>>this.length%8),this.length++}};var l=[[17,14,11,7],[32,26,20,14],[53,42,32,24],[78,62,46,34],[106,84,60,44],[134,106,74,58],[154,122,86,64],[192,152,108,84],[230,180,130,98],[271,213,151,119],[321,251,177,137],[367,287,203,155],[425,331,241,177],[458,362,258,194],[520,412,292,220],[586,450,322,250],[644,504,364,280],[718,560,394,310],[792,624,442,338],[858,666,482,382],[929,711,509,403],[1003,779,565,439],[1091,857,611,461],[1171,911,661,511],[1273,997,715,535],[1367,1059,751,593],[1465,1125,805,625],[1528,1190,868,658],[1628,1264,908,698],[1732,1370,982,742],[1840,1452,1030,790],[1952,1538,1112,842],[2068,1628,1168,898],[2188,1722,1228,958],[2303,1809,1283,983],[2431,1911,1351,1051],[2563,1989,1423,1093],[2699,2099,1499,1139],[2809,2213,1579,1219],[2953,2331,1663,1273]],o=function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){function g(a,b){var c=document.createElementNS("http://www.w3.org/2000/svg",a);for(var d in b)b.hasOwnProperty(d)&&c.setAttribute(d,b[d]);return c}var b=this._htOption,c=this._el,d=a.getModuleCount();Math.floor(b.width/d),Math.floor(b.height/d),this.clear();var h=g("svg",{viewBox:"0 0 "+String(d)+" "+String(d),width:"100%",height:"100%",fill:b.colorLight});h.setAttributeNS("http://www.w3.org/2000/xmlns/","xmlns:xlink","http://www.w3.org/1999/xlink"),c.appendChild(h),h.appendChild(g("rect",{fill:b.colorDark,width:"1",height:"1",id:"template"}));for(var i=0;d>i;i++)for(var j=0;d>j;j++)if(a.isDark(i,j)){var k=g("use",{x:String(i),y:String(j)});k.setAttributeNS("http://www.w3.org/1999/xlink","href","#template"),h.appendChild(k)}},a.prototype.clear=function(){for(;this._el.hasChildNodes();)this._el.removeChild(this._el.lastChild)},a}(),p="svg"===document.documentElement.tagName.toLowerCase(),q=p?o:m()?function(){function a(){this._elImage.src=this._elCanvas.toDataURL("image/png"),this._elImage.style.display="block",this._elCanvas.style.display="none"}function d(a,b){var c=this;if(c._fFail=b,c._fSuccess=a,null===c._bSupportDataURI){var d=document.createElement("img"),e=function(){c._bSupportDataURI=!1,c._fFail&&_fFail.call(c)},f=function(){c._bSupportDataURI=!0,c._fSuccess&&c._fSuccess.call(c)};return d.onabort=e,d.onerror=e,d.onload=f,d.src="data:image/gif;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAAHElEQVQI12P4//8/w38GIAXDIBKE0DHxgljNBAAO9TXL0Y4OHwAAAABJRU5ErkJggg==",void 0}c._bSupportDataURI===!0&&c._fSuccess?c._fSuccess.call(c):c._bSupportDataURI===!1&&c._fFail&&c._fFail.call(c)}if(this._android&&this._android<=2.1){var b=1/window.devicePixelRatio,c=CanvasRenderingContext2D.prototype.drawImage;CanvasRenderingContext2D.prototype.drawImage=function(a,d,e,f,g,h,i,j){if("nodeName"in a&&/img/i.test(a.nodeName))for(var l=arguments.length-1;l>=1;l--)arguments[l]=arguments[l]*b;else"undefined"==typeof j&&(arguments[1]*=b,arguments[2]*=b,arguments[3]*=b,arguments[4]*=b);c.apply(this,arguments)}}var e=function(a,b){this._bIsPainted=!1,this._android=n(),this._htOption=b,this._elCanvas=document.createElement("canvas"),this._elCanvas.width=b.width,this._elCanvas.height=b.height,a.appendChild(this._elCanvas),this._el=a,this._oContext=this._elCanvas.getContext("2d"),this._bIsPainted=!1,this._elImage=document.createElement("img"),this._elImage.style.display="none",this._el.appendChild(this._elImage),this._bSupportDataURI=null};return e.prototype.draw=function(a){var b=this._elImage,c=this._oContext,d=this._htOption,e=a.getModuleCount(),f=d.width/e,g=d.height/e,h=Math.round(f),i=Math.round(g);b.style.display="none",this.clear();for(var j=0;e>j;j++)for(var k=0;e>k;k++){var l=a.isDark(j,k),m=k*f,n=j*g;c.strokeStyle=l?d.colorDark:d.colorLight,c.lineWidth=1,c.fillStyle=l?d.colorDark:d.colorLight,c.fillRect(m,n,f,g),c.strokeRect(Math.floor(m)+.5,Math.floor(n)+.5,h,i),c.strokeRect(Math.ceil(m)-.5,Math.ceil(n)-.5,h,i)}this._bIsPainted=!0},e.prototype.makeImage=function(){this._bIsPainted&&d.call(this,a)},e.prototype.isPainted=function(){return this._bIsPainted},e.prototype.clear=function(){this._oContext.clearRect(0,0,this._elCanvas.width,this._elCanvas.height),this._bIsPainted=!1},e.prototype.round=function(a){return a?Math.floor(1e3*a)/1e3:a},e}():function(){var a=function(a,b){this._el=a,this._htOption=b};return a.prototype.draw=function(a){for(var b=this._htOption,c=this._el,d=a.getModuleCount(),e=Math.floor(b.width/d),f=Math.floor(b.height/d),g=['<table style="border:0;border-collapse:collapse;">'],h=0;d>h;h++){g.push("<tr>");for(var i=0;d>i;i++)g.push('<td style="border:0;border-collapse:collapse;padding:0;margin:0;width:'+e+"px;height:"+f+"px;background-color:"+(a.isDark(h,i)?b.colorDark:b.colorLight)+';"></td>');g.push("</tr>")}g.push("</table>"),c.innerHTML=g.join("");var j=c.childNodes[0],k=(b.width-j.offsetWidth)/2,l=(b.height-j.offsetHeight)/2;k>0&&l>0&&(j.style.margin=l+"px "+k+"px")},a.prototype.clear=function(){this._el.innerHTML=""},a}();QRCode=function(a,b){if(this._htOption={width:256,height:256,typeNumber:4,colorDark:"#000000",colorLight:"#ffffff",correctLevel:d.H},"string"==typeof b&&(b={text:b}),b)for(var c in b)this._htOption[c]=b[c];"string"==typeof a&&(a=document.getElementById(a)),this._android=n(),this._el=a,this._oQRCode=null,this._oDrawing=new q(this._el,this._htOption),this._htOption.text&&this.makeCode(this._htOption.text)},QRCode.prototype.makeCode=function(a){this._oQRCode=new b(r(a,this._htOption.correctLevel),this._htOption.correctLevel),this._oQRCode.addData(a),this._oQRCode.make(),this._el.title=a,this._oDrawing.draw(this._oQRCode),this.makeImage()},QRCode.prototype.makeImage=function(){"function"==typeof this._oDrawing.makeImage&&(!this._android||this._android>=3)&&this._oDrawing.makeImage()},QRCode.prototype.clear=function(){this._oDrawing.clear()},QRCode.CorrectLevel=d}();]]>
				</script>
				<style type="text/css">
					body {
					background-color: #FFFFFF;
					font-family: 'Tahoma', "Times New Roman", Times, serif;
					font-size: 11px;
					color: #000000;
					}
					h1, h2 {
					padding-bottom: 3px;
					padding-top: 3px;
					margin-bottom: 5px;
					text-transform: uppercase;
					font-family: Arial, Helvetica, sans-serif;
					}
					h1 {
					font-size: 1.4em;
					text-transform:none;
					}
					h2 {
					font-size: 1em;
					color: brown;
					}
					h3 {
					font-size: 1em;
					color: #000000;
					text-align: justify;
					margin: 0;
					padding: 0;
					}
					h4 {
					font-size: 1.1em;
					font-style: bold;
					font-family: Arial, Helvetica, sans-serif;
					color: #000000;
					margin: 0;
					padding: 0;
					}
					hr {
					height:2px;
					color: #000000;
					background-color: #000000;
					border-bottom: 1px solid #000000;
					}
					p, ul, ol {
					margin-top: 1.5em;
					}
					ul, ol {
					margin-left: 3em;
					}
					blockquote {
					margin-left: 3em;
					margin-right: 3em;
					font-style: italic;
					}
					a {
					text-decoration: none;
					color: #70A300;
					}
					a:hover {
					border: none;
					color: #70A300;
					}
					#customerPartyTable {
					border-width: 0px;
					border-spacing:;
					border-style: inset;
					border-color: gray;
					border-collapse: collapse;
					background-color:
					}
					#customerIDTable {
					border-width: 2px;
					border-spacing:;
					border-style: inset;
					border-color: gray;
					border-collapse: collapse;
					background-color:
					}
					#customerIDTableTd {
					border-width: 2px;
					border-spacing:;
					border-style: inset;
					border-color: gray;
					border-collapse: collapse;
					background-color:
					}
					#lineTable {
					border-width:2px;
					border-spacing:;
					border-style: inset;
					border-color: black;
					border-collapse: collapse;
					background-color:;
					}
					td.lineTableTd {
					border-width: 1px;
					padding: 1px;
					border-style: inset;
					border-color: black;
					background-color: white;
					}
					#lineTableDummyTd {
					border-width: 1px;
					border-color:white;
					padding: 1px;
					border-style: inset;
					border-color: black;
					background-color: white;
					}
					td.lineTableBudgetTd {
					border-width: 2px;
					border-spacing:0px;
					padding: 1px;
					border-style: inset;
					border-color: black;
					background-color: white;
					-moz-border-radius:;
					}
					#notesTable {
					border-width: 2px;
					border-spacing:;
					border-style: inset;
					border-color: black;
					<!-- border-collapse: collapse; -->
					background-color:
					}
					#notesTableTd {
					border-width: 0px;
					border-spacing:;
					border-style: inset;
					border-color: black;
					border-collapse: collapse;
					background-color:
					}
					table {
					border-spacing:0px;
					}
					#budgetContainerTable {
					border-width: 0px;
					border-spacing: 0px;
					border-style: inset;
					border-color: black;
					border-collapse: collapse;
					background-color:;
					}
					td {
					border-color:gray;
					}
					#invoice-info-td {
					border-style: solid;
					border-width: 1px;
					width: 50%;
					}
					#invoice-line-td {
					border-style: solid;
					border-width: 1px;
					}
				</style>
				<title>e-Belge</title>
			</head>

			<body style="width:800px;">
				<xsl:for-each select="$XML">



					<!-- GONDERICI - EARSIV LOGO - FIRMA LOGO TABLOSU -->
					<table style="width: 100%;">
						<tbody>
							<tr>
								<td style="width: 40%;">
									<hr/>


									<!-- GONDERICI TABLOSU -->
									<table style="width: 100%;">
										<tbody>
											<tr align="left">
												<td align="left">
													<xsl:if test="count(//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode[text()='SUBE_UNVAN']) &gt;= 1">
														<xsl:for-each select="//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode[text()='SUBE_UNVAN']">
															<xsl:value-of select="../cbc:DocumentType"/>
															<br />
														</xsl:for-each>
													</xsl:if>
													<xsl:for-each select="n1:Invoice/cac:AccountingSupplierParty/cac:Party">
														<xsl:if test="$varBranchName= '' or count(//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='VKN']) &gt;= 1">
															<xsl:if test="cac:PartyName">
																<xsl:value-of select="cac:PartyName/cbc:Name"/>
																<br/>
															</xsl:if>
														</xsl:if>
														<xsl:for-each select="cac:Person">
															<xsl:for-each select="cbc:Title">
																<xsl:apply-templates/>
																<xsl:text>&#160;</xsl:text>
															</xsl:for-each>
															<xsl:for-each select="cbc:FirstName">
																<xsl:apply-templates/>
																<xsl:text>&#160;</xsl:text>
															</xsl:for-each>
															<xsl:for-each select="cbc:MiddleName">
																<xsl:apply-templates/>
																<xsl:text>&#160;</xsl:text>
															</xsl:for-each>
															<xsl:for-each select="cbc:FamilyName">
																<xsl:apply-templates/>
																<xsl:text>&#160;</xsl:text>
															</xsl:for-each>
															<xsl:for-each select="cbc:NameSuffix">
																<xsl:apply-templates/>
															</xsl:for-each>
														</xsl:for-each>
													</xsl:for-each>
												</td>
											</tr>
											<tr align="left">
												<xsl:for-each select="n1:Invoice/cac:AccountingSupplierParty/cac:Party">
													<td align="left">
														<xsl:for-each select="cac:PostalAddress">
															<xsl:for-each select="cbc:StreetName">
																<xsl:apply-templates/>
																<xsl:text>&#160;</xsl:text>
															</xsl:for-each>
															<xsl:for-each select="cbc:BuildingName">
																<xsl:apply-templates/>
															</xsl:for-each>
															<xsl:if test="cbc:BuildingNumber">
																<xsl:text> No:</xsl:text>
																<xsl:for-each select="cbc:BuildingNumber">
																	<xsl:apply-templates/>
																</xsl:for-each>
																<xsl:text>&#160;</xsl:text>
															</xsl:if>
															<br/>
															<xsl:if test="cbc:Room">
																<xsl:text> Kapı No:</xsl:text>
																<xsl:for-each select="cbc:Room">
																	<xsl:apply-templates/>
																</xsl:for-each>
																<xsl:text>&#160;</xsl:text>
															</xsl:if>
															<br/>
															<xsl:for-each select="cbc:PostalZone">
																<xsl:apply-templates/>
																<xsl:text>&#160;</xsl:text>
															</xsl:for-each>
															<xsl:for-each select="cbc:CitySubdivisionName">
																<xsl:apply-templates/>
															</xsl:for-each>
															<xsl:text>/ </xsl:text>
															<xsl:for-each select="cbc:CityName">
																<xsl:apply-templates/>
																<xsl:text>&#160;</xsl:text>
															</xsl:for-each>
														</xsl:for-each>
													</td>
												</xsl:for-each>
											</tr>
											<xsl:if test="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:Contact/cbc:Telephone or //n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:Contact/cbc:Telefax">
												<tr align="left">
													<xsl:for-each select="n1:Invoice/cac:AccountingSupplierParty/cac:Party">
														<td align="left">
															<xsl:for-each select="cac:Contact">
																<xsl:if test="cbc:Telephone">
																	<xsl:text>Tel: </xsl:text>
																	<xsl:for-each select="cbc:Telephone">
																		<xsl:apply-templates/>
																	</xsl:for-each>
																</xsl:if>
																<xsl:if test="cbc:Telefax">
																	<xsl:text> Fax: </xsl:text>
																	<xsl:for-each select="cbc:Telefax">
																		<xsl:apply-templates/>
																	</xsl:for-each>
																</xsl:if>
																<xsl:text>&#160;</xsl:text>
															</xsl:for-each>
														</td>
													</xsl:for-each>
												</tr>
											</xsl:if>
											<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cbc:WebsiteURI">
												<tr align="left">
													<td>
														<xsl:text>Web Sitesi: </xsl:text>
														<xsl:value-of select="."/>
													</td>
												</tr>
											</xsl:for-each>
											<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:Contact/cbc:ElectronicMail">
												<tr align="left">
													<td>
														<xsl:text>E-Posta: </xsl:text>
														<xsl:value-of select="."/>
													</td>
												</tr>
											</xsl:for-each>
											<tr align="left">
												<xsl:for-each select="n1:Invoice/cac:AccountingSupplierParty/cac:Party">
													<td align="left">
														<xsl:text>Vergi Dairesi: </xsl:text>
														<xsl:for-each select="cac:PartyTaxScheme">
															<xsl:for-each select="cac:TaxScheme">
																<xsl:for-each select="cbc:Name">
																	<xsl:apply-templates/>
																</xsl:for-each>
															</xsl:for-each>
															<xsl:text>&#160; </xsl:text>
														</xsl:for-each>
													</td>
												</xsl:for-each>
											</tr>
											<xsl:for-each select="//n1:Invoice/cac:AccountingSupplierParty/cac:Party/cac:PartyIdentification">
												<tr align="left">
													<xsl:choose>
														<xsl:when test="cbc:ID/@schemeID = 'MERSISNO'">
															<td>
																<xsl:text>Mersis No: </xsl:text>
																<xsl:value-of select="cbc:ID"/>
															</td>
														</xsl:when>
														<xsl:when test="cbc:ID/@schemeID = 'TICARETSICILNO'">
															<td>
																<xsl:text>Ticaret Sicil No: </xsl:text>
																<xsl:value-of select="cbc:ID"/>
															</td>
														</xsl:when>
														<xsl:otherwise>
															<td>
																<xsl:value-of select="cbc:ID/@schemeID"/>
																<xsl:text>: </xsl:text>
																<xsl:value-of select="cbc:ID"/>
															</td>
														</xsl:otherwise>
													</xsl:choose>
												</tr>
											</xsl:for-each>

											<xsl:for-each select="//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentType[text()='MESUL_MUDUR_AD_SOYAD']">
												<tr align="left">
													<td align="left">
														<xsl:if test="../cbc:DocumentType='MESUL_MUDUR_AD_SOYAD'">
															<xsl:text>Mesul Müdür: </xsl:text>
														</xsl:if>
														<xsl:if test="../cbc:DocumentType='MESUL_MUDUR_AD_SOYAD'">
															<xsl:value-of select="../cbc:DocumentTypeCode"/>
														</xsl:if>
													</td>
												</tr>
											</xsl:for-each>

											<xsl:if test="count(//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentType[text()='MESUL_MUDUR_BELGE_NO']) &gt;= 1 and count(//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentType[text()='MESUL_MUDUR_RUHSATNAME_TARIH']) &gt;= 1">
												<tr align="left">
													<td align="left">
														<xsl:for-each select="//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentType[text()='MESUL_MUDUR_RUHSATNAME_TARIH']">
															<xsl:if test="../cbc:DocumentType='MESUL_MUDUR_RUHSATNAME_TARIH'">
																<xsl:text>Ruhsat Tarihi: </xsl:text>
															</xsl:if>
															<xsl:if test="../cbc:DocumentType='MESUL_MUDUR_RUHSATNAME_TARIH'">
																<xsl:value-of select="substring(../cbc:DocumentTypeCode,9,2)"/>-<xsl:value-of select="substring(../cbc:DocumentTypeCode,6,2)"/>-<xsl:value-of select="substring(../cbc:DocumentTypeCode,1,4)"/>
															</xsl:if>
														</xsl:for-each>
														<xsl:for-each select="//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentType[text()='MESUL_MUDUR_BELGE_NO']">
															<xsl:if test="../cbc:DocumentType='MESUL_MUDUR_BELGE_NO'">
																<xsl:text> - Belge No: </xsl:text>
															</xsl:if>
															<xsl:if test="../cbc:DocumentType='MESUL_MUDUR_BELGE_NO'">
																<xsl:value-of select="../cbc:DocumentTypeCode"/>
															</xsl:if>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
										</tbody>
									</table>
									<hr/>
								</td>


								<!-- E-ARSIV FATURA LOGO -->
								<td style="width: 20%; text-align: center;">
									<img style="width:91px;" align="middle" alt="E-Fatura Logo"
										 src="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/4QBoRXhpZgAASUkqAAgAAAADABIBAwABAAAAAQAAADEBAgAQAAAAMgAAAGmHBAABAAAAQgAAAAAAAABTaG90d2VsbCAwLjIyLjAAAgACoAkAAQAAAKYBAAADoAkAAQAAAKYBAAAAAAAA/+EJ9Gh0dHA6Ly9ucy5hZG9iZS5jb20veGFwLzEuMC8APD94cGFja2V0IGJlZ2luPSLvu78iIGlkPSJXNU0wTXBDZWhpSHpyZVN6TlRjemtjOWQiPz4gPHg6eG1wbWV0YSB4bWxuczp4PSJhZG9iZTpuczptZXRhLyIgeDp4bXB0az0iWE1QIENvcmUgNC40LjAtRXhpdjIiPiA8cmRmOlJERiB4bWxuczpyZGY9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkvMDIvMjItcmRmLXN5bnRheC1ucyMiPiA8cmRmOkRlc2NyaXB0aW9uIHJkZjphYm91dD0iIiB4bWxuczpleGlmPSJodHRwOi8vbnMuYWRvYmUuY29tL2V4aWYvMS4wLyIgeG1sbnM6dGlmZj0iaHR0cDovL25zLmFkb2JlLmNvbS90aWZmLzEuMC8iIGV4aWY6UGl4ZWxYRGltZW5zaW9uPSI0MjIiIGV4aWY6UGl4ZWxZRGltZW5zaW9uPSI0MjIiIHRpZmY6SW1hZ2VXaWR0aD0iNDIyIiB0aWZmOkltYWdlSGVpZ2h0PSI0MjIiIHRpZmY6T3JpZW50YXRpb249IjEiLz4gPC9yZGY6UkRGPiA8L3g6eG1wbWV0YT4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8P3hwYWNrZXQgZW5kPSJ3Ij8+/9sAQwADAgIDAgIDAwMDBAMDBAUIBQUE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"/>
									<h1 style="text-align: center;">
										<span style="font-weight:bold; ">
											<xsl:choose>
												<xsl:when test="//n1:Invoice/cbc:ProfileID='EARSIVFATURA' or //n1:Invoice/cbc:ProfileID='EBELGE'">
													<xsl:text>e-Arşiv Fatura</xsl:text>
												</xsl:when>
												<xsl:when test="//n1:Invoice/cbc:ProfileID='EGIDERPUSULASI'">
													<xsl:text>e-Gider Pusulası</xsl:text>
												</xsl:when>
												<xsl:otherwise>
													<xsl:text>e-FATURA</xsl:text>
												</xsl:otherwise>
											</xsl:choose>
										</span>
									</h1>
								</td>

								<!-- FIRMA LOGOSU -->
								<td style="width: 40%; text-align: center;">
									<img src="data:image/jpeg;base64, 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" alt="company_logo" width="255" height="255"/>
								</td>
							</tr>
						</tbody>
					</table>


					<!-- ALICI - IMZA - FATURA BILGILERI TABLOSU -->
					<table>
						<tbody>
							<tr>
								<td style="width: 40%;">
									<table id="customerPartyTable" align="left" border="0">
										<tbody>
											<tr>
												<td>
													<hr/>
													<table align="center" border="0">
														<tbody>
															<tr>
																<xsl:for-each select="n1:Invoice/cac:AccountingCustomerParty/cac:Party">
																	<td style="width:469px; " align="left">
																		<span style="font-weight:bold; ">
																			<xsl:text>SAYIN</xsl:text>
																		</span>
																	</td>
																</xsl:for-each>
															</tr>
															<tr>
																<xsl:choose>
																	<xsl:when test="n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='PARTYTYPE' and text()='TAXFREE']">
																		<xsl:for-each select="n1:Invoice/cac:BuyerCustomerParty/cac:Party">
																			<xsl:call-template name="Party_Title">
																				<xsl:with-param name="PartyType">TAXFREE</xsl:with-param>
																			</xsl:call-template>
																		</xsl:for-each>
																	</xsl:when>
																	<xsl:when test="n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='PARTYTYPE' and starts-with(text(), 'EXPORT')]">
																		<xsl:for-each select="n1:Invoice/cac:BuyerCustomerParty/cac:Party">
																			<xsl:call-template name="Party_Title">
																				<xsl:with-param name="PartyType">EXPORT</xsl:with-param>
																			</xsl:call-template>
																		</xsl:for-each>
																	</xsl:when>
																	<xsl:otherwise>
																		<xsl:for-each select="n1:Invoice/cac:AccountingCustomerParty/cac:Party">
																			<xsl:call-template name="Party_Title">
																				<xsl:with-param name="PartyType">OTHER</xsl:with-param>
																			</xsl:call-template>
																		</xsl:for-each>
																	</xsl:otherwise>
																</xsl:choose>
															</tr>
															<xsl:choose>
																<xsl:when test="n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='PARTYTYPE' and text()='TAXFREE']">
																	<xsl:for-each select="n1:Invoice/cac:BuyerCustomerParty/cac:Party">
																		<tr>
																			<xsl:call-template name="Party_Adress">
																				<xsl:with-param name="PartyType">TAXFREE</xsl:with-param>
																			</xsl:call-template>
																		</tr>
																		<xsl:call-template name="Party_Other">
																			<xsl:with-param name="PartyType">TAXFREE</xsl:with-param>
																		</xsl:call-template>
																	</xsl:for-each>
																</xsl:when>
																<xsl:when test="n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='PARTYTYPE' and starts-with(text(), 'EXPORT')]">
																	<xsl:for-each select="n1:Invoice/cac:BuyerCustomerParty/cac:Party">
																		<tr>
																			<xsl:call-template name="Party_Adress">
																				<xsl:with-param name="PartyType">EXPORT</xsl:with-param>
																			</xsl:call-template>
																		</tr>
																		<xsl:call-template name="Party_Other">
																			<xsl:with-param name="PartyType">EXPORT</xsl:with-param>
																		</xsl:call-template>
																	</xsl:for-each>
																</xsl:when>
																<xsl:otherwise>
																	<xsl:for-each select="n1:Invoice/cac:AccountingCustomerParty/cac:Party">
																		<tr>
																			<xsl:call-template name="Party_Adress">
																				<xsl:with-param name="PartyType">OTHER</xsl:with-param>
																			</xsl:call-template>
																		</tr>
																		<xsl:call-template name="Party_Other">
																			<xsl:with-param name="PartyType">OTHER</xsl:with-param>
																		</xsl:call-template>
																	</xsl:for-each>
																</xsl:otherwise>
															</xsl:choose>

															<xsl:if test="$varSenaryoName='1' and not($varVknComp='1')">
																<tr align="left">
																	<td style="width:469px; " align="left">
																		<span style="font-weight:bold; ">
																			<br> </br>
																			<xsl:text> Ödeme Yapacak Kurum </xsl:text>
																		</span>
																	</td>
																</tr>
																<tr align="left">
																	<td>
																		<xsl:text> VKN: </xsl:text>
																		<xsl:value-of select="n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='VKN']"/>
																	</td>
																</tr>
																<tr align="left">
																	<td>
																		<xsl:text> Ünvan: </xsl:text>
																		<xsl:value-of select="n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PartyName/cbc:Name"/>
																	</td>
																</tr>
																<tr align="left">
																	<td>
																		<xsl:text> Adres: </xsl:text>
																		<xsl:value-of select="n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PostalAddress/cbc:CityName"/>
																		<xsl:text>/ </xsl:text>
																		<xsl:value-of select="n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PostalAddress/cac:Country/cbc:Name"/>
																	</td>
																</tr>
															</xsl:if>
														</tbody>
													</table>
													<hr/>
												</td>
											</tr>
										</tbody>
									</table>
								</td>

								<td style="width: 30%; text-align: center;">
									<img src="data:image/jpeg;base64, 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" alt="company_logo" width="150" height="100"/>
								</td>

								<td style="width: 30%;">
									<table style="width:100%; border-collapse: collapse;">
										<tbody>
											<tr>
												<td id="invoice-info-td" style="width: 50%;">
													<span style="font-weight:bold; ">
														<xsl:text>Özelleştirme No:</xsl:text>
													</span>
												</td>
												<td id="invoice-info-td" style="width: 50%;">
													<xsl:for-each select="n1:Invoice/cbc:CustomizationID">
														<xsl:apply-templates/>
													</xsl:for-each>
												</td>
											</tr>
											<tr style="height:13px; ">
												<td id="invoice-info-td" style="width: 50%;">
													<span style="font-weight:bold; ">
														<xsl:text>Senaryo:</xsl:text>
													</span>
												</td>
												<td id="invoice-info-td" style="width: 50%;">
													<xsl:for-each select="n1:Invoice/cbc:ProfileID">
														<xsl:apply-templates/>
													</xsl:for-each>
												</td>
											</tr>
											<xsl:if test="not(//n1:Invoice/cbc:ProfileID='EGIDERPUSULASI')">
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Fatura Tipi:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="n1:Invoice/cbc:InvoiceTypeCode">
															<xsl:apply-templates/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>

											<xsl:if test="//n1:Invoice/cbc:AccountingCost">
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>İlave Fatura Tipi:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="n1:Invoice/cbc:AccountingCost">
															<xsl:apply-templates/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<tr style="height:13px; ">
												<td id="invoice-info-td" style="width: 50%;">
													<xsl:choose>
														<xsl:when test="//n1:Invoice/cbc:ProfileID='EGIDERPUSULASI'">
															<span style="font-weight:bold; ">
																<xsl:text>Pusula No:</xsl:text>
															</span>
														</xsl:when>
														<xsl:otherwise>
															<span style="font-weight:bold; ">
																<xsl:text>Fatura No:</xsl:text>
															</span>
														</xsl:otherwise>
													</xsl:choose>
												</td>
												<td id="invoice-info-td" style="width: 50%;">
													<xsl:for-each select="n1:Invoice/cbc:ID">
														<xsl:apply-templates/>
													</xsl:for-each>
												</td>
											</tr>
											<tr style="height:13px; ">
												<td id="invoice-info-td" style="width: 50%;">
													<xsl:choose>
														<xsl:when test="//n1:Invoice/cbc:ProfileID='EGIDERPUSULASI'">
															<span style="font-weight:bold; ">
																<xsl:text>Pusula Tarihi:</xsl:text>
															</span>
														</xsl:when>
														<xsl:otherwise>
															<span style="font-weight:bold; ">
																<xsl:text>Fatura Tarihi:</xsl:text>
															</span>
														</xsl:otherwise>
													</xsl:choose>
												</td>
												<td id="invoice-info-td" style="width: 50%;">
													<xsl:for-each select="n1:Invoice/cbc:IssueDate">
														<xsl:apply-templates select="."/>
														<xsl:text>&#160;</xsl:text>
														<xsl:value-of select="substring(../cbc:IssueTime,1,5)"/>
													</xsl:for-each>
												</td>
											</tr>
											<xsl:for-each select="//n1:Invoice/cac:AdditionalDocumentReference/cbc:DocumentTypeCode[text()='MUKELLEF_KODU' or text()='MUKELLEF_ADI' or text()='DOSYA_NO']">
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold;">
															<xsl:if	test="../cbc:DocumentTypeCode='MUKELLEF_KODU'">
																<xsl:text>Mükellef Kodu:</xsl:text>
															</xsl:if>
															<xsl:if	test="../cbc:DocumentTypeCode='MUKELLEF_ADI'">
																<xsl:text>Mükellef Adı:</xsl:text>
															</xsl:if>
															<xsl:if	test="../cbc:DocumentTypeCode='DOSYA_NO'">
																<xsl:text>Dosya No:</xsl:text>
															</xsl:if>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:value-of select="../cbc:DocumentType"/>
													</td>
												</tr>
											</xsl:for-each>
											<xsl:if test="(//n1:Invoice/cbc:AccountingCost) and (//n1:Invoice/cac:InvoicePeriod)">
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold;">
															<xsl:text>Dönem Başlangıcı:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="//n1:Invoice/cac:InvoicePeriod">
															<xsl:apply-templates select="cbc:StartDate"/>
														</xsl:for-each>
													</td>
												</tr>
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold;">
															<xsl:text>Dönem Bitişi:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="//n1:Invoice/cac:InvoicePeriod">
															<xsl:apply-templates select="cbc:EndDate"/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<xsl:for-each select="n1:Invoice/cac:DespatchDocumentReference">
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>İrsaliye No:</xsl:text>
														</span>
														<xsl:text>&#160;</xsl:text>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:value-of select="cbc:ID"/>
													</td>
												</tr>
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>İrsaliye Tarihi:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="cbc:IssueDate">
															<xsl:apply-templates select="."/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:for-each>
											<xsl:if test="//n1:Invoice/cbc:paymentDueDate">
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Son Ödeme Tarihi:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="n1:Invoice/cbc:paymentDueDate">
															<xsl:apply-templates/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="//n1:Invoice/cac:OrderReference">
												<tr style="height:13px">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Sipariş No:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="n1:Invoice/cac:OrderReference/cbc:ID">
															<xsl:apply-templates/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<xsl:if	test="//n1:Invoice/cac:OrderReference/cbc:IssueDate">
												<tr style="height:13px">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Sipariş Tarihi:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="n1:Invoice/cac:OrderReference/cbc:IssueDate">
															<xsl:apply-templates select="."/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<xsl:if	test="n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='VKN' and text()='7350019759']">
												<tr style="height:13px">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Sipariş Sorumlusu:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:value-of select="$varsiparissorumlusu"/>
													</td>
												</tr>
											</xsl:if>
											<xsl:for-each select="n1:Invoice/cac:ReceiptDocumentReference">
												<tr style="height:13px; ">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Mal Kabul No:</xsl:text>
														</span>
														<xsl:text>&#160;</xsl:text>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:value-of select="cbc:ID"/>
													</td>
												</tr>
											</xsl:for-each>
											<xsl:for-each select="n1:Invoice/cac:TaxRepresentativeParty/cac:PartyIdentification/cbc:ID[@schemeID='ARACIKURUMVKN']">
												<tr>
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Aracı Kurum VKN:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:value-of select="."/>
													</td>
												</tr>
												<tr>
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Aracı Kurum Unvan:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:value-of select="../../cac:PartyName/cbc:Name"/>
													</td>
												</tr>
											</xsl:for-each>
<!--											<xsl:if	test="//n1:Invoice/cac:PaymentMeans/cbc:PaymentMeansCode">-->
<!--												<tr style="height:13px">-->
<!--													<td id="invoice-info-td" style="width: 50%;">-->
<!--														<span style="font-weight:bold; ">-->
<!--															<xsl:text>Ödeme Şekli:</xsl:text>-->
<!--														</span>-->
<!--													</td>-->
<!--													<td id="invoice-info-td" style="width: 50%;">-->
<!--														<xsl:for-each select="n1:Invoice/cac:PaymentMeans/cbc:PaymentMeansCode">-->
<!--															<xsl:call-template name="PaymentMeansCode">-->
<!--																<xsl:with-param name="PaymentMeansCodeType">-->
<!--																	<xsl:value-of select="."/>-->
<!--																</xsl:with-param>-->
<!--															</xsl:call-template>-->
<!--														</xsl:for-each>-->
<!--													</td>-->
<!--												</tr>-->
<!--											</xsl:if>-->
											<xsl:if	test="//n1:Invoice/cac:PaymentMeans/cbc:PaymentDueDate">
												<tr style="height:13px">
													<td id="invoice-info-td" style="width: 50%;">
														<span style="font-weight:bold; ">
															<xsl:text>Ödeme Tarihi:</xsl:text>
														</span>
													</td>
													<td id="invoice-info-td" style="width: 50%;">
														<xsl:for-each select="n1:Invoice/cac:PaymentMeans/cbc:PaymentDueDate">
															<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
										</tbody>
									</table>
								</td>
							</tr>
						</tbody>
					</table>



					<!-- ETTN SATIRI -->
					<table style="width: 40%; margin-bottom: 5px;">
						<tr>
							<td style="width: 100%;">
								<span style="font-weight:bold; ">
									<xsl:text>ETTN:</xsl:text>
								</span>
								&#160;
								<xsl:for-each select="n1:Invoice/cbc:UUID">
									<xsl:apply-templates/>
								</xsl:for-each>
							</td>
						</tr>
					</table>

					<!-- URUNLER SATIRI (TABLOSU) -->
					<table style="width: 100%; border-collapse: collapse; border-style: solid; border-width: 2px;">
						<tbody>
							<tr>
								<td id="invoice-line-td" style="width:3%">
									<span style="font-weight:bold;">
										<xsl:text>Sıra No</xsl:text>
									</span>
								</td>
								<xsl:choose>
									<xsl:when test="$varItemCode &gt; 0">
										<td id="invoice-line-td" style="width:7%">
											<span style="font-weight:bold;">
												<xsl:text>Ürün Kodu</xsl:text>
											</span>
										</td>
									</xsl:when>
									<xsl:otherwise>
									</xsl:otherwise>
								</xsl:choose>
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='VKN' and text()='7350019759']">
										<td id="invoice-line-td" style="width:7%">
											<span style="font-weight:bold;">
												<xsl:text>Sipariş Satır No</xsl:text>
											</span>
										</td>
									</xsl:when>
								</xsl:choose>

								<xsl:if test="$varfaturatipi='SGK'">
									<td id="invoice-line-td" style="width:80%">
										<span style="font-weight:bold;">
											<xsl:text>Açıklama</xsl:text>
										</span>
									</td>
								</xsl:if>
								<xsl:if test="not($varfaturatipi='SGK')">
									<td id="invoice-line-td" style="width:20%">
										<span style="font-weight:bold;">
											<xsl:text>Mal Hizmet</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:7.4%">
										<span style="font-weight:bold;">
											<xsl:text>Miktar</xsl:text>
										</span>
									</td>
									<xsl:if test="$varEtiketFiyati='1'">
										<td id="invoice-line-td" class="table-background table-header" style="width:10%; border-color: #c9c9c9">
											<span style="font-weight:bold;">
												<xsl:text>Etiket Fiyatı</xsl:text>
											</span>
										</td>
									</xsl:if>
									<xsl:if test="$varDepocuFiyati='1'">
										<td id="invoice-line-td" class="table-background table-header" style="width:9%; border-color: #c9c9c9">
											<span style="font-weight:bold;">
												<xsl:text>Depocu Fiyatı</xsl:text>
											</span>
										</td>
									</xsl:if>

									<td id="invoice-line-td" class="table-background table-header" style="width:9%; border-color: #c9c9c9">
										<span style="font-weight:bold;">
											<xsl:text>Birim Fiyat</xsl:text>
										</span>
									</td>
									<xsl:if test="$varEczaciKar='1'">
										<td id="invoice-line-td" class="table-background table-header" style="width:10%; border-color: #c9c9c9">
											<span style="font-weight:bold;">
												<xsl:text>Eczacı Kâr Oranı.</xsl:text>
											</span>
										</td>
									</xsl:if>

									<xsl:if test="$varKurumIskonto='1'">
										<td id="invoice-line-td" class="table-background table-header" style="width:10%; border-color: #c9c9c9">
											<span style="font-weight:bold;">
												<xsl:text>Kurum İskontosu</xsl:text>
											</span>
										</td>
									</xsl:if>

									<xsl:if test="$varVade='1'">
										<td id="invoice-line-td" class="table-background table-header" style="width:10%; border-color: #c9c9c9">
											<span style="font-weight:bold;">
												<xsl:text>Vade Tarihi</xsl:text>
											</span>
										</td>
									</xsl:if>
									<xsl:if test="$varAllowanceRate &gt; 0">
										<td id="invoice-line-td" style="width:7%">
											<span style="font-weight:bold;">
												<xsl:text>İskonto/ Arttırım Oranı</xsl:text>
											</span>
										</td>
									</xsl:if>
									<xsl:if test="$varAllowanceAmount &gt; 0">
										<td id="invoice-line-td" style="width:9%">
											<span style="font-weight:bold;">
												<xsl:text>İskonto/ Arttırım Tutarı</xsl:text>
											</span>
										</td>
									</xsl:if>
									<xsl:if test="$varAllowanceReason &gt; 0">
										<td id="invoice-line-td" style="width:9%">
											<span style="font-weight:bold;">
												<xsl:text>İskonto/ Arttırım Nedeni</xsl:text>
											</span>
										</td>
									</xsl:if>
									<td id="invoice-line-td" style="width:7%">
										<span style="font-weight:bold;">
											<xsl:text>KDV Oranı</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:10%">
										<span style="font-weight:bold;">
											<xsl:text>KDV Tutarı</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:17%; ">
										<span style="font-weight:bold;">
											<xsl:text>Diğer Vergiler</xsl:text>
										</span>
									</td>
									<xsl:if test="$varLineExplanation &gt; 0">
										<td id="invoice-line-td" style="width:10.6%">
											<span style="font-weight:bold;">
												<xsl:text>Satır Açıklaması</xsl:text>
											</span>
										</td>
									</xsl:if>
								</xsl:if>
								<td id="invoice-line-td" style="width:10.6%">
									<span style="font-weight:bold;">
										<xsl:text>Mal Hizmet Tutarı</xsl:text>
									</span>
								</td>

								<xsl:if test="//n1:Invoice/cbc:ProfileID='EARSIVFATURA' and //n1:Invoice/cbc:InvoiceTypeCode='ISTISNA'">
									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>GTIP</xsl:text>
										</span>
									</td>
								</xsl:if>

								<xsl:if test="//n1:Invoice/cbc:ProfileID='HKS' or /n1:Invoice/cbc:InvoiceTypeCode='HKSSATIS' or /n1:Invoice/cbc:InvoiceTypeCode='HKSKOMISYONCU'">
									<td id="invoice-line-td" style="width:5%">
										<span style="font-weight:bold;">
											<xsl:text>Künye Numarası</xsl:text>
										</span>
									</td>
								</xsl:if>

								<xsl:if test="//n1:Invoice/cbc:ProfileID='HKS' and /n1:Invoice/cbc:InvoiceTypeCode='SATIS'">
									<td id="invoice-line-td" style="width:5%">
										<span style="font-weight:bold;">
											<xsl:text>Mal Sahibi VKN/TCKN</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:5%">
										<span style="font-weight:bold;">
											<xsl:text>Mal Sahibi Ad/Soyad</xsl:text>
										</span>
									</td>
								</xsl:if>

								<xsl:if test="//n1:Invoice/cbc:InvoiceTypeCode='HKSSATIS'">
									<td id="invoice-line-td" style="width:5%">
										<span style="font-weight:bold;">
											<xsl:text>Mal Sahibi VKN/TCKN</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:5%">
										<span style="font-weight:bold;">
											<xsl:text>Mal Sahibi Ad/Soyad</xsl:text>
										</span>
									</td>
								</xsl:if>

								<xsl:if test="//n1:Invoice/cbc:ProfileID='IHRACAT' or //n1:Invoice/cbc:ProfileID='OZELFATURA'">
									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>Teslim Şartı</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>Eşya Kap Cinsi</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>Kap No</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>Kap Adet</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>Teslim/Bedel Ödeme Yeri</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>Gönderilme Şekli</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>GTİP</xsl:text>
										</span>
									</td>

									<td id="invoice-line-td" style="width:10.6%">
										<span style="font-weight:bold;">
											<xsl:text>Byn. Edilen Kıymet Değeri</xsl:text>
										</span>
									</td>
								</xsl:if>
							</tr>

							<xsl:if test="count(//n1:Invoice/cac:InvoiceLine) &gt;= 1">
								<xsl:for-each select="//n1:Invoice/cac:InvoiceLine">
									<xsl:apply-templates select="."/>
								</xsl:for-each>
							</xsl:if>

							<xsl:if test="count(//n1:Invoice/cac:InvoiceLine) &lt; 1">
								<xsl:choose>
									<xsl:when test="//n1:Invoice/cac:InvoiceLine[1]">
										<xsl:apply-templates
												select="//n1:Invoice/cac:InvoiceLine[1]"/>
									</xsl:when>
									<xsl:otherwise>
										<xsl:apply-templates select="//n1:Invoice"/>
									</xsl:otherwise>
								</xsl:choose>
							</xsl:if>
						</tbody>
					</table>
				</xsl:for-each>


				<table id="budgetContainerTable" table-layout="fixed" width="800px">
					<tbody>
						<tr>
							<xsl:if test="//n1:Invoice/cbc:InvoiceTypeCode='HKSKOMISYONCU' or //n1:Invoice/cbc:InvoiceTypeCode='KOMISYONCU'">
								<td align="left" valign="top" width="300px">
									<table>
										<tbody>
											<xsl:for-each select="n1:Invoice/cac:AllowanceCharge">
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSKOMISYON'">
													<tr align="left" border="0">
														<td align="left" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Masraflar:</xsl:text>
															</span>
														</td>

													</tr>
													<tr align="left">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Komisyon - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSKOMISYONKDV'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Komisyon KDV - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSNAVLUN'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Navlun - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSNAVLUNKDV'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Navlun KDV - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSHAMMALIYE'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Hammaliye - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSHAMMALIYEKDV'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Hammaliye KDV - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSNAKLIYE'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Nakliye - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSNAKLIYEKDV'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Nakliye KDV - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSGVTEVKIFAT'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>G.V. Tevkifat - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSBAGKURTEVKIFAT'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Bağkur Tevkifat - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSRUSUM'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Rüsum - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSRUSUMKDV'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Rüsum KDV - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSTICBORSASI'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Ticaret Borsası - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSTICBORSASIKDV'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Ticaret Borsası KDV - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSMILLISAVUNMAFON'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Milli Savunma Fon - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSMSFONKDV'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Milli Savunma Fon KDV - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSDIGERMASRAFLAR'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Diğer Masraflar - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>
												<xsl:if test="cbc:AllowanceChargeReason = 'HKSDIGERKDV'">
													<tr align="right">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Diğer KDV - %</xsl:text>
															</span>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:Amount">
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
														<td class="lineTableBudgetTd" style="width:81px; " align="right">
															<xsl:for-each
																	select="cbc:MultiplierFactorNumeric">
																<xsl:text> %</xsl:text>
																<xsl:call-template name="Curr_Type"/>
															</xsl:for-each>
														</td>
													</tr>
												</xsl:if>

											</xsl:for-each>

										</tbody>
									</table>
								</td>
							</xsl:if>
							<td align="right" valign="top">
								<table>
									<tbody>
										<xsl:if test="not($varfaturatipi='SGK' and $varoptik='medula')">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>Mal Hizmet Toplam Tutarı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount">
														<xsl:call-template name="Curr_Type"/>
													</xsl:for-each>
												</td>
											</tr>
										</xsl:if>
										<xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
											<xsl:if test="cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode = '4171'">
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" align="right" width="200px">
														<span style="font-weight:bold; ">
															<xsl:text>Teslim Bedeli</xsl:text>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:81px; " align="right">
														<xsl:for-each select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount">
															<xsl:call-template name="Curr_Type"/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
										</xsl:for-each>
										<xsl:if test="not($varfaturatipi='SGK')">
											<tr align="right">
												<td/>
												<xsl:choose>
													<xsl:when
															test="//n1:Invoice/cac:AllowanceCharge/cbc:ChargeIndicator='true'">
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:text>Toplam Arttırım - </xsl:text>
																<xsl:for-each
																		select="n1:Invoice/cac:AllowanceCharge/cbc:AllowanceChargeReason">
																	<xsl:apply-templates/>
																</xsl:for-each>
															</span>
														</td>
													</xsl:when>
													<xsl:otherwise>
														<td class="lineTableBudgetTd" align="right" width="200px">
															<span style="font-weight:bold; ">
																<xsl:if test="not($varoptik='medikal')">
																	<xsl:text>Toplam İskonto</xsl:text>
																</xsl:if>
																<xsl:if test="$varoptik='medikal'">
																	<xsl:text>Katılım Payı</xsl:text>
																</xsl:if>
															</span>
														</td>
													</xsl:otherwise>
												</xsl:choose>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<xsl:if test="$varoptik='medikal' and not($varisitmekatilimpayi='')" >
														<xsl:value-of select="format-number(number($varisitmekatilimpayi), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</xsl:if>
													<xsl:if test="not($varoptik='medikal' and not($varisitmekatilimpayi=''))" >
														<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount">
															<xsl:call-template name="Curr_Type"/>
														</xsl:for-each>
													</xsl:if>
												</td>
											</tr>
										</xsl:if>

										<xsl:if test="$varfaturatipi='SGK' and $varoptik='cezaeviEczanem'">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>Toplam İskonto</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<span>
														<xsl:value-of select="format-number(number($variskonto), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>İlaç Farkı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<span>
														<xsl:value-of select="format-number(number($varilacfarki), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
										</xsl:if>
										<xsl:if test="$varfaturatipi='SGK' and $varoptik='optik'">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>Toplam Katılım Payı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<span>
														<xsl:value-of select="format-number(number($varkatilimpayi), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
										</xsl:if>
										<xsl:if test="$varfaturatipi='SGK' and $varoptik='medula'">
											<xsl:if test="not($varpsf='undefined')">
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" align="right" width="200px">
														<span style="font-weight:bold; ">
															<xsl:value-of select="$varreceteadedi" /> Adet Reçete PSF Toplamı
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:81px; " align="right">
														<span>
															<xsl:value-of select="format-number(number($varpsf), '###.##0,00', 'european')" />
															<xsl:text> TL</xsl:text>
														</span>
													</td>
												</tr>
											</xsl:if>
											<xsl:if test="not($varpsf='undefined')">
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" align="right" width="200px">
														<span style="font-weight:bold; ">
															<xsl:text>Kamu Kurum İskontosu</xsl:text>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:81px; " align="right">
														<span>
															<xsl:value-of select="format-number((number($varpsf)- number($vartutar)), '###.##0,00', 'european')" />
															<xsl:text> TL</xsl:text>
														</span>
													</td>
												</tr>
											</xsl:if>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:value-of select="$varreceteadedi" /> Adet Reçete Kamu Fiyatı Toplamı
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<span>
														<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount">
															<xsl:call-template name="Curr_Type"/>
														</xsl:for-each>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>Eczane İskontosu</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<span>
														<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:AllowanceTotalAmount">
															<xsl:call-template name="Curr_Type"/>
														</xsl:for-each>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>Hasta Katılım Payı(%10 - %20)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<span>
														<xsl:value-of select="format-number(number($varkatilimpayi), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="210px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Vergiler Dahil Reçete Toplam Tutarı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<span>
														<xsl:value-of select="format-number((number($vartutar) -(number($variskonto) + number($varkatilimpayi))), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="210px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Vergiler Hariç Reçete Toplam Tutarı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<span>
														<xsl:value-of select="format-number((number($vartutar) -(number($variskonto) + number($varkatilimpayi) + number($varkdv8) + number($varkdv18))), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>KDV (%8)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<span>
														<xsl:value-of select="format-number(number($varkdv8), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>KDV (%18)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<span>
														<xsl:value-of select="format-number(number($varkdv18), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="220px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Vergiler Dahil Reçete Toplam Tutarı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<span>
														<xsl:value-of select="format-number((number($vartutar) -(number($variskonto) + number($varkatilimpayi))), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="210px">
													<span style="font-weight:bold; ">
														<xsl:text>Eczane Hizmet Bedeli KDV Hariç Tutarı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<xsl:value-of select="format-number((number($vareczanehizmetbedeli) - number($vareczanekdv18)), '###.##0,00', 'european')" />
													<xsl:text> TL</xsl:text>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>KDV (%18)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<xsl:value-of select="format-number(number($vareczanekdv18), '###.##0,00', 'european')" />
													<xsl:text> TL</xsl:text>
												</td>
											</tr>

											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="210px">
													<span style="font-weight:bold; ">
														<xsl:text>Eczane Hizmet Bedeli KDV Dahil Tutarı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<xsl:value-of select="format-number(number($vareczanehizmetbedeli), '###.##0,00', 'european')" />
													<xsl:text> TL</xsl:text>
												</td>
											</tr>
										</xsl:if>

										<!-- KDV_TAXABLEAMOUNT_REF -->

										<xsl:if test="$varfaturatipi='SGK' and $varoptik='medikalIcmal'">
											<xsl:if test="string-length($varkatilimpayi)>0 and not($varkatilimpayi=0)">
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" width="211px" align="right">
														<span style="font-weight:bold; ">
															<xsl:text>Katılım Payı</xsl:text>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:82px; " align="right">
														<xsl:value-of select="format-number(number($varkatilimpayi), '###.##0,00', 'european')"/>
														<xsl:text> TL</xsl:text>
													</td>
												</tr>
											</xsl:if>
										</xsl:if>

										<xsl:if test="not($varfaturatipi='SGK' and $varoptik='medula')">
											<xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" width="211px" align="right">
														<span style="font-weight:bold; ">
															<xsl:text>Hesaplanan </xsl:text>
															<xsl:value-of select="cac:TaxCategory/cac:TaxScheme/cbc:Name"/>
															<xsl:if test="../../cbc:InvoiceTypeCode!='OZELMATRAH'">
																<xsl:text>(%</xsl:text>
																<xsl:value-of select="cbc:Percent"/>
																<xsl:text>)</xsl:text>
															</xsl:if>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:82px; " align="right">
														<xsl:for-each select="cac:TaxCategory/cac:TaxScheme">
															<xsl:text> </xsl:text>
															<xsl:value-of
																	select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
															<xsl:if test="../../cbc:TaxAmount/@currencyID">
																<xsl:text> </xsl:text>
																<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
																	<xsl:text>TL</xsl:text>
																</xsl:if>
																<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
																	<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
																</xsl:if>
															</xsl:if>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:for-each>
										</xsl:if>
										<xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
											<xsl:if test="cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode = '4171'">
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" align="right" width="200px">
														<span style="font-weight:bold; ">
															<xsl:text>KDV Matrahı</xsl:text>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:81px; " align="right">
														<xsl:value-of
																select="format-number(sum(//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=0015]/cbc:TaxableAmount), '###.##0,00', 'european')"/>
														<xsl:if
																test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID">
															<xsl:text> </xsl:text>
															<xsl:if
																	test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRL' or //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID = 'TRY'">
																<xsl:text>TL</xsl:text>
															</xsl:if>
															<xsl:if
																	test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID != 'TRY'">
																<xsl:value-of
																		select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount/@currencyID"
																/>
															</xsl:if>
														</xsl:if>
													</td>
												</tr>
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" align="right" width="200px">
														<span style="font-weight:bold; ">
															<xsl:text>Tevkifat Dahil Toplam Tutar</xsl:text>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:81px; " align="right">
														<xsl:for-each select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount">
															<xsl:call-template name="Curr_Type"/>
														</xsl:for-each>
													</td>
												</tr>
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" align="right" width="200px">
														<span style="font-weight:bold; ">
															<xsl:text>Tevkifat Hariç Toplam Tutar</xsl:text>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:81px; " align="right">
														<xsl:for-each select="//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount">
															<xsl:call-template name="Curr_Type"/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
										</xsl:for-each>
										<xsl:for-each select="n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="211px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Hesaplanan KDV Tevkifat</xsl:text>
														<xsl:text>(%</xsl:text>
														<xsl:value-of select="cbc:Percent"/>
														<xsl:text>)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:for-each select="cac:TaxCategory/cac:TaxScheme">
														<xsl:text> </xsl:text>
														<xsl:value-of
																select="format-number(../../cbc:TaxAmount, '###.##0,00', 'european')"/>
														<xsl:if test="../../cbc:TaxAmount/@currencyID">
															<xsl:text> </xsl:text>
															<xsl:if test="../../cbc:TaxAmount/@currencyID = 'TRL' or ../../cbc:TaxAmount/@currencyID = 'TRY'">
																<xsl:text>TL</xsl:text>
															</xsl:if>
															<xsl:if test="../../cbc:TaxAmount/@currencyID != 'TRL' and ../../cbc:TaxAmount/@currencyID != 'TRY'">
																<xsl:value-of select="../../cbc:TaxAmount/@currencyID"/>
															</xsl:if>
														</xsl:if>
													</xsl:for-each>
												</td>
											</tr>
										</xsl:for-each>
										<xsl:if test="sum(n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:TaxableAmount)>0">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="211px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Tevkifata Tabi İşlem Tutarı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:value-of
															select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:LineExtensionAmount), '###.##0,00', 'european')"/>
													<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRL'">
														<xsl:text>TL</xsl:text>
													</xsl:if>
													<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRL'">
														<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
													</xsl:if>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="211px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Tevkifata Tabi İşlem Üzerinden Hes. KDV</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:value-of
															select="format-number(sum(n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:TaxableAmount), '###.##0,00', 'european')"/>
													<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRL'">
														<xsl:text>TL</xsl:text>
													</xsl:if>
													<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRL'">
														<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
													</xsl:if>
												</td>
											</tr>
										</xsl:if>
										<xsl:if test="n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="211px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Tevkifata Tabi İşlem Tutarı</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:if test="n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
														<xsl:value-of
																select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]/cbc:LineExtensionAmount), '###.##0,00', 'european')"
														/>
													</xsl:if>
													<xsl:if test="//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=&apos;9015&apos;">
														<xsl:value-of
																select="format-number(sum(n1:Invoice/cac:InvoiceLine[cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:LineExtensionAmount), '###.##0,00', 'european')"
														/>
													</xsl:if>
													<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRL' or n1:Invoice/cbc:DocumentCurrencyCode = 'TRY'">
														<xsl:text>TL</xsl:text>
													</xsl:if>
													<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRL' and n1:Invoice/cbc:DocumentCurrencyCode != 'TRY'">
														<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
													</xsl:if>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="211px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Tevkifata Tabi İşlem Üzerinden Hes. KDV</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:if test="n1:Invoice/cac:InvoiceLine[cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme]">
														<xsl:value-of
																select="format-number(sum(n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme]/cbc:TaxableAmount), '###.##0,00', 'european')"
														/>
													</xsl:if>
													<xsl:if test="//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=&apos;9015&apos;">
														<xsl:value-of
																select="format-number(sum(n1:Invoice/cac:TaxTotal/cac:TaxSubtotal[cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode=9015]/cbc:TaxableAmount), '###.##0,00', 'european')"
														/>
													</xsl:if>
													<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode = 'TRL' or n1:Invoice/cbc:DocumentCurrencyCode = 'TRY'">
														<xsl:text>TL</xsl:text>
													</xsl:if>
													<xsl:if test="n1:Invoice/cbc:DocumentCurrencyCode != 'TRL' and n1:Invoice/cbc:DocumentCurrencyCode != 'TRY'">
														<xsl:value-of select="n1:Invoice/cbc:DocumentCurrencyCode"/>
													</xsl:if>
												</td>
											</tr>
										</xsl:if>

										<xsl:if test="not($varfaturatipi='SGK' and $varoptik='medula') and  $varExportCarriage &gt; 0">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="200px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Navlun</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:value-of
															select="format-number(sum(//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:DeclaredForCarriageValueAmount), '###.##0,00', 'european')"/>
													<xsl:if
															test="//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:DeclaredForCarriageValueAmount/@currencyID">
														<xsl:text> </xsl:text>
														<xsl:if
																test="//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:DeclaredForCarriageValueAmount/@currencyID = 'TRL' or //n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:DeclaredForCarriageValueAmount/@currencyID = 'TRY'">
															<xsl:text>TL</xsl:text>
														</xsl:if>
														<xsl:if
																test="//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:DeclaredForCarriageValueAmount/@currencyID != 'TRL' and //n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:DeclaredForCarriageValueAmount/@currencyID != 'TRY'">
															<xsl:value-of
																	select="//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:DeclaredForCarriageValueAmount/@currencyID"
															/>
														</xsl:if>
													</xsl:if>
												</td>
											</tr>
										</xsl:if>
										<xsl:if test="not($varfaturatipi='SGK' and $varoptik='medula') and  $varExportInsurance &gt; 0">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="200px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Sigorta</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:value-of
															select="format-number(sum(//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:InsuranceValueAmount), '###.##0,00', 'european')"/>
													<xsl:if
															test="//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:InsuranceValueAmount/@currencyID">
														<xsl:text> </xsl:text>
														<xsl:if
																test="//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:InsuranceValueAmount/@currencyID = 'TRL' or //n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:InsuranceValueAmount/@currencyID = 'TRY'">
															<xsl:text>TL</xsl:text>
														</xsl:if>
														<xsl:if
																test="//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:InsuranceValueAmount/@currencyID != 'TRL' and //n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:InsuranceValueAmount/@currencyID != 'TRY'">
															<xsl:value-of
																	select="//n1:Invoice/cac:InvoiceLine/cac:Delivery/cac:Shipment/cbc:InsuranceValueAmount/@currencyID"
															/>
														</xsl:if>
													</xsl:if>
												</td>
											</tr>
										</xsl:if>
										<xsl:if test="not($varfaturatipi='SGK' and $varoptik='medula')">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="200px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Vergiler Dahil Toplam Tutar</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:for-each
															select="n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount">
														<xsl:call-template name="Curr_Type"/>
													</xsl:for-each>
												</td>
											</tr>
										</xsl:if>

										<xsl:if test="(//n1:Invoice/cbc:ProfileID='HKS' and //n1:Invoice/cbc:InvoiceTypeCode='KOMISYONCU') or (//n1:Invoice/cbc:ProfileID='EARSIVFATURA' and //n1:Invoice/cbc:InvoiceTypeCode='HKSKOMISYONCU')">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="200px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Toplam Masraflar</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:ChargeTotalAmount">
														<xsl:call-template name="Curr_Type"/>
													</xsl:for-each>
												</td>
											</tr>
										</xsl:if>
										<xsl:if test="not($varfaturatipi='SGK') ">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="200px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Ödenecek Tutar</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount">
														<xsl:call-template name="Curr_Type"/>
													</xsl:for-each>
												</td>
											</tr>
										</xsl:if>
										<xsl:for-each select="n1:Invoice/cac:Delivery/cac:Shipment/cbc:DeclaredCustomsValueAmount">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="200px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Toplam Byn. Edl. Kıymet Değeri</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:call-template name="Curr_Type"/>
												</td>
											</tr>
										</xsl:for-each>
										<xsl:for-each select="n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
											<xsl:if test="//n1:Invoice/cbc:DocumentCurrencyCode != 'TRY' and //n1:Invoice/cbc:DocumentCurrencyCode != 'TRL'">
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" align="right" width="200px">
														<span style="font-weight:bold; ">
															<xsl:text>Hesaplanan </xsl:text>
															<xsl:value-of select="cac:TaxCategory/cac:TaxScheme/cbc:Name"/>
															<xsl:text>(%</xsl:text>
															<xsl:value-of select="cbc:Percent"/>
															<xsl:text>) (TL)</xsl:text>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:81px; " align="right">
														<span>
															<xsl:value-of
																	select="format-number(cbc:TaxAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
															<xsl:text> TL</xsl:text>
														</span>
													</td>
												</tr>
											</xsl:if>
										</xsl:for-each>
										<xsl:if test="($varfaturatipi='SGK' and not($varoptik='medula'))">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>Toplam Ödenecek Tutar</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount">
														<xsl:call-template name="Curr_Type"/>
													</xsl:for-each>
												</td>
											</tr>
										</xsl:if>
										<xsl:if test="($varfaturatipi='SGK' and $varoptik='medula')">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>KDV Hariç Ödenecek Tutar</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<span>
														<xsl:value-of select="format-number(number(n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount) - (number($varkdv8) + number($varkdv18) + number($vareczanekdv18)), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>KDV(%8 + %18)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<span>
														<xsl:value-of select="format-number((number($varkdv8) + number($varkdv18) + number($vareczanekdv18)), '###.##0,00', 'european')" />
														<xsl:text> TL</xsl:text>
													</span>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>Toplam Ödenecek Tutar</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<span style="font-weight:bold; ">
														<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount">
															<xsl:call-template name="Curr_Type"/>
														</xsl:for-each>
													</span>
												</td>
											</tr>
										</xsl:if>
										<xsl:if test="//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRL' and //n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount/@currencyID != 'TRY'">
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" align="right" width="200px">
													<span style="font-weight:bold; ">
														<xsl:text>Mal Hizmet Toplam Tutarı(TL)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:81px; " align="right">
													<xsl:value-of
															select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:LineExtensionAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
													<xsl:text> TL</xsl:text>
												</td>
											</tr>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="200px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Vergiler Dahil Toplam Tutar(TL)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:value-of
															select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
													<xsl:text> TL</xsl:text>
												</td>
											</tr>
											<xsl:if test="not($varfaturatipi='SGK')">
												<tr align="right">
													<td/>
													<td class="lineTableBudgetTd" width="200px" align="right">
														<span style="font-weight:bold; ">
															<xsl:text>Vergiler Dahil Toplam Tutar</xsl:text>
														</span>
													</td>
													<td class="lineTableBudgetTd" style="width:82px; " align="right">
														<xsl:for-each select="n1:Invoice/cac:LegalMonetaryTotal/cbc:TaxInclusiveAmount">
															<xsl:call-template name="Curr_Type"/>
														</xsl:for-each>
													</td>
												</tr>
											</xsl:if>
											<tr align="right">
												<td/>
												<td class="lineTableBudgetTd" width="200px" align="right">
													<span style="font-weight:bold; ">
														<xsl:text>Ödenecek Tutar(TL)</xsl:text>
													</span>
												</td>
												<td class="lineTableBudgetTd" style="width:82px; " align="right">
													<xsl:value-of
															select="format-number(//n1:Invoice/cac:LegalMonetaryTotal/cbc:PayableAmount * //n1:Invoice/cac:PricingExchangeRate/cbc:CalculationRate, '###.##0,00', 'european')"/>
													<xsl:text> TL</xsl:text>
												</td>
											</tr>
										</xsl:if>
									</tbody>
								</table>
							</td>
						</tr>
					</tbody>
				</table>
				<br/>
				<xsl:if test="//n1:Invoice/cac:BillingReference/cac:InvoiceDocumentReference/cbc:DocumentTypeCode[text()='İADE' or text()='IADE']">
					<table id="lineTable" width="800">
						<thead>
							<tr>
								<td align="left">
									<span style="font-weight:bold; " align="center">&#160;&#160;&#160;&#160;&#160;İadeye Konu Olan Faturalar</span>
								</td>
							</tr>
						</thead>
						<tbody>
							<tr align="left" class="lineTableTr">
								<td class="lineTableTd">
									<span style="font-weight:bold; " align="center">&#160;&#160;&#160;&#160;&#160;Fatura No</span>
								</td>
								<td class="lineTableTd">
									<span style="font-weight:bold; " align="center">&#160;&#160;&#160;&#160;&#160;Tarih</span>
								</td>
							</tr>
							<xsl:for-each select="//n1:Invoice/cac:BillingReference/cac:InvoiceDocumentReference/cbc:DocumentTypeCode[text()='İADE' or text()='IADE']">
								<tr align="left" class="lineTableTr">
									<td class="lineTableTd">&#160;&#160;&#160;&#160;&#160;
										<xsl:value-of select="../cbc:ID"/>
									</td>
									<td class="lineTableTd">&#160;&#160;&#160;&#160;&#160;
										<xsl:for-each select="../cbc:IssueDate">
											<xsl:apply-templates select="."/>
										</xsl:for-each>
									</td>
								</tr>
							</xsl:for-each>
						</tbody>
					</table>
				</xsl:if>
				<br/>
				<xsl:if	test="//n1:Invoice/cac:BillingReference/cac:AdditionalDocumentReference/cbc:DocumentTypeCode='OKCBF'">
					<table border="1" id="lineTable" width="800">
						<thead>
							<tr>
								<th colspan="6">ÖKC Bilgileri</th>
							</tr>
						</thead>
						<tbody>
							<tr id="okcbfHeadTr" style="font-weight:bold;">
								<td style="width:20%">
									<xsl:text>Fiş Numarası</xsl:text>
								</td>
								<td style="width:10%" align="center">
									<xsl:text>Fiş Tarihi</xsl:text>
								</td>
								<td style="width:10%" align="center">
									<xsl:text>Fiş Saati</xsl:text>
								</td>
								<td style="width:40%" align="center">
									<xsl:text>Fiş Tipi</xsl:text>
								</td>
								<td style="width:10%" align="center">
									<xsl:text>Z Rapor No</xsl:text>
								</td>
								<td style="width:10%" align="center">
									<xsl:text>ÖKC Seri No</xsl:text>
								</td>
							</tr>
						</tbody>
						<xsl:for-each select="//n1:Invoice/cac:BillingReference/cac:AdditionalDocumentReference/cbc:DocumentTypeCode[text()='OKCBF']">
							<tr>
								<td style="width:20%">
									<xsl:value-of select="../cbc:ID"/>
								</td>
								<td style="width:10%" align="center">
									<xsl:value-of select="../cbc:IssueDate"/>
								</td>
								<td style="width:10%" align="center">
									<xsl:value-of select="substring(../cac:ValidityPeriod/cbc:StartTime,1,5)"/>
								</td>
								<td style="width:40%" align="center">
									<xsl:choose>
										<xsl:when test="../cbc:DocumentDescription='AVANS'">
											<xsl:text>Ön Tahsilat(Avans) Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='YEMEK_FIS'">
											<xsl:text>Yemek Fişi/Kartı ile Yapılan Tahsilat Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='E-FATURA'">
											<xsl:text>E-Fatura Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='E-FATURA_IRSALIYE'">
											<xsl:text>İrsaliye Yerine Geçen E-Fatura Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='E-ARSIV'">
											<xsl:text>E-Arşiv Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='E-ARSIV_IRSALIYE'">
											<xsl:text>İrsaliye Yerine Geçen E-Arşiv Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='FATURA'">
											<xsl:text>Faturalı Satış Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='OTOPARK'">
											<xsl:text>Otopark Giriş Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='FATURA_TAHSILAT'">
											<xsl:text>Fatura Tahsilat Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:when test="../cbc:DocumentDescription='FATURA_TAHSILAT_KOMISYONLU'">
											<xsl:text>Komisyonlu Fatura Tahsilat Bilgi Fişi</xsl:text>
										</xsl:when>
										<xsl:otherwise>
											<xsl:text> </xsl:text>
										</xsl:otherwise>
									</xsl:choose>
								</td>
								<td style="width:10%" align="center">
									<xsl:value-of select="../cac:Attachment/cac:ExternalReference/cbc:URI"/>
								</td>
								<td style="width:10%" align="center">
									<xsl:value-of select="../cac:IssuerParty/cbc:EndpointID"/>
								</td>
							</tr>
						</xsl:for-each>
					</table>
					<br/>
				</xsl:if>


				<table id="notesTable" style="width: 800px;">
					<tbody>
						<xsl:if test="($varfaturatipi='SGK' and $varoptik='medula')">
							<tr>
								<td style="width: 100%;">
									<table style="margin-top: 10px; margin-left: 10px;">
										<tbody>
											<tr>
												<td style="width: 25%; vertical-align: top;">
													<table style="width: 100%;">
														<tbody>
															<tr>
																<td style="width: 50%; text-decoration: underline; font-weight: bold;">
																	<xsl:text>Elden Tahsil Edilen</xsl:text>
																</td>
															</tr>
															<xsl:if test="not($varmaasdanilackatilimpayi='null')">
																<tr style="line-height: 14px;">
																	<td style="width: 50%;">
																		<xsl:text>İlaç Kat. Payı(Elden):</xsl:text>
																	</td>

																	<td style="width: 50%;">
																		<xsl:value-of select="format-number(number($vareldenilackatilimpayi), '###.##0,00', 'european')" />
																		<xsl:text> TL</xsl:text>
																	</td>
																</tr>
															</xsl:if>

															<tr style="line-height: 14px;">
																<td style="width: 50%;">
																	<xsl:text>Muayene Kat. Payı(Elden):</xsl:text>
																</td>

																<td style="width: 50%;">
																	<xsl:value-of select="format-number(number($vareldenmuayenekatilimpayi), '###.##0,00', 'european')" />
																	<xsl:text> TL</xsl:text>
																</td>
															</tr>

															<tr style="line-height: 14px;">
																<td style="width: 50%;">
																	<xsl:text>Reçete Kat. Payı(Elden):</xsl:text>
																</td>

																<td style="width: 50%;">
																	<xsl:value-of select="format-number(number($vareldenrecetekatilimpayi), '###.##0,00', 'european')" />
																	<xsl:text> TL</xsl:text>
																</td>
															</tr>

															<xsl:if test="$varmaasdanilackatilimpayi='null'">
																<tr style="line-height: 14px;">
																	<td style="width: 60%;">
																		<xsl:text>İlaç Kat. Payı(Elden + Maaş):</xsl:text>
																	</td>

																	<td style="width: 40%;">
																		<xsl:value-of select="format-number(number($vareldenilackatilimpayi), '###.##0,00', 'european')" />
																		<xsl:text> TL</xsl:text>
																	</td>
																</tr>
															</xsl:if>


														</tbody>
													</table>
												</td>

												<td style="width: 25%; vertical-align: top;">
													<table style="width: 100%">
														<tbody>
															<tr>
																<td style="width: 50%; text-decoration: underline; font-weight: bold;">
																	<xsl:text>Maaştan Kesilen</xsl:text>
																</td>
															</tr>
															<xsl:if test="not($varmaasdanilackatilimpayi='null')">
																<tr style="line-height: 14px;">
																	<td style="width: 50%;">
																		<xsl:text>İlaç Kat. Payı(Maaş)</xsl:text>
																	</td>

																	<td style="width: 50%;">
																		<xsl:value-of select="format-number(number($varmaasdanilackatilimpayi), '###.##0,00', 'european')" />
																		<xsl:text> TL</xsl:text>
																	</td>
																</tr>
															</xsl:if>
															<tr style="line-height: 14px;">
																<td style="width: 50%;">
																	<xsl:text>Muayene Kat. Payı(Maaş)</xsl:text>
																</td>

																<td style="width: 50%;">
																	<xsl:value-of select="format-number(number($varmaasmuayenekatilimpayi), '###.##0,00', 'european')" />
																	<xsl:text> TL</xsl:text>
																</td>
															</tr>

															<tr style="line-height: 14px;">
																<td style="width: 50%;">
																	<xsl:text>Reçete Kat. Payı(Maaş):</xsl:text>
																</td>

																<td style="width: 50%;">
																	<xsl:value-of select="format-number(number($varmaastanrecetekatilimpayi), '###.##0,00', 'european')" />
																	<xsl:text> TL</xsl:text>
																</td>
															</tr>
														</tbody>
													</table>
												</td>
											</tr>
										</tbody>
									</table>
								</td>
							</tr>
						</xsl:if>
						<tr align="left">
							<td id="notesTableTd" style="width: 80%" height="100">
								<xsl:for-each select="//n1:Invoice/cac:TaxTotal/cac:TaxSubtotal">
									<xsl:if test="(cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode='0015' or ../../cbc:InvoiceTypeCode='OZELMATRAH') and cac:TaxCategory/cbc:TaxExemptionReason">
										<b>&#160;&#160;&#160;&#160;&#160; Vergi İstisna Muafiyet Sebebi: </b>
										<span><xsl:value-of select="cac:TaxCategory/cbc:TaxExemptionReasonCode"/>
										<xsl:text>-</xsl:text>
										<xsl:value-of select="cac:TaxCategory/cbc:TaxExemptionReason"/></span>
										<br/>
									</xsl:if>
									<xsl:if test="starts-with(cac:TaxCategory/cac:TaxScheme/cbc:TaxTypeCode,'007') and cac:TaxCategory/cbc:TaxExemptionReason">
										<b>&#160;&#160;&#160;&#160;&#160; ÖTV İstisna Muafiyet Sebebi: </b>
										<span><xsl:value-of select="cac:TaxCategory/cbc:TaxExemptionReasonCode"/>
										<xsl:text>-</xsl:text>
										<xsl:value-of select="cac:TaxCategory/cbc:TaxExemptionReason"/></span>
										<br/>
									</xsl:if>
								</xsl:for-each>
								<xsl:for-each select="//n1:Invoice/cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
									<b>&#160;&#160;&#160;&#160;&#160; Tevkifat Sebebi: </b>
									<span><xsl:value-of select="cbc:TaxTypeCode"/>
									<xsl:text>-</xsl:text>
									<xsl:value-of select="cbc:Name"/></span>
									<br/>
								</xsl:for-each>

								<b>&#160;&#160;&#160;&#160;&#160; Not: </b>
								<span>Son ödeme tarihi fatura tarihinden sonra en geç 3 (üç) gündür.</span>
								<br/>
								<b>&#160;&#160;&#160;&#160;&#160; Not: </b>
								<span>Vadesinde ödenmeyen faturalar için aylık %3 gecikme zammı uygulanır.</span>
								<br/>

								<xsl:for-each select="//n1:Invoice/cbc:Note">
									<xsl:if	test="not(starts-with(.,'SGK_')) and not(starts-with(.,'FATURATIPI:SGK')) and not(starts-with(.,'SS:'))">
										<b>&#160;&#160;&#160;&#160;&#160; Not: </b>
										<span><xsl:value-of select="."/></span>
										<br/>
									</xsl:if>
								</xsl:for-each>
								<xsl:for-each select="//n1:Invoice/cac:AdditionalDocumentReference">
									<xsl:if test="cbc:ID='INTERNET_SATIS'">
										<b>&#160;&#160;&#160;&#160;&#160; Not: </b>
										<span>Bu satış internet üzerinden yapılmıştır.</span>
										<br/>

										<b>&#160;&#160;&#160;&#160;&#160; Ödeme Şekli: </b>
										<span><xsl:value-of select="cbc:DocumentType"/></span>
										<br/>

										<b>&#160;&#160;&#160;&#160;&#160; Satışın Yapıldığı Web Adresi: </b>
										<span><xsl:value-of select="cac:IssuerParty/cbc:WebsiteURI"/></span>
										<br/>
										<b>&#160;&#160;&#160;&#160;&#160; Ödeme Tarihi: </b>
										<span><xsl:value-of select="cbc:IssueDate"/></span>
										<br/>
									</xsl:if>
								</xsl:for-each>
								<xsl:if test="//n1:Invoice/cac:Delivery">
									<xsl:if test="//n1:Invoice/cac:Delivery/cac:CarrierParty/cac:PartyIdentification/cbc:ID[@schemeID='VKN']">
										<b>&#160;&#160;&#160;&#160;&#160; Taşıyıcı Unvan: </b>
										<span><xsl:value-of select="//n1:Invoice/cac:Delivery/cac:CarrierParty/cac:PartyName/cbc:Name"/></span>
										<br/>
									</xsl:if>
									<xsl:if test="//n1:Invoice/cac:Delivery/cac:CarrierParty/cac:PartyIdentification/cbc:ID[@schemeID='TCKN']">
										<b>&#160;&#160;&#160;&#160;&#160; Taşıyıcı Ad-Soyad: </b>
										<span><xsl:value-of select="//n1:Invoice/cac:Delivery/cac:CarrierParty/cac:Person/cbc:FirstName"/>
										<xsl:text> </xsl:text>
										<xsl:value-of select="//n1:Invoice/cac:Delivery/cac:CarrierParty/cac:Person/cbc:FamilyName"/></span>
										<br/>
									</xsl:if>
									<b>&#160;&#160;&#160;&#160;&#160; Taşıyıcı TCKN/VKN: </b>
									<span><xsl:value-of select="//n1:Invoice/cac:Delivery/cac:CarrierParty/cac:PartyIdentification/cbc:ID"/></span>
									<br/>
									<b>&#160;&#160;&#160;&#160;&#160; Gönderim Tarihi: </b>
									<span><xsl:value-of select="//n1:Invoice/cac:Delivery/cbc:ActualDeliveryDate"/></span>
									<br/>
								</xsl:if>
								<xsl:if test="//n1:Invoice/cac:PaymentMeans/cbc:InstructionNote">
									<b>&#160;&#160;&#160;&#160;&#160; Ödeme Notu: </b>
									<span><xsl:value-of
											select="//n1:Invoice/cac:PaymentMeans/cbc:InstructionNote"/></span>
									<br/>
								</xsl:if>
								<xsl:if
										test="//n1:Invoice/cac:PaymentMeans/cac:PayeeFinancialAccount/cbc:PaymentNote">
									<b>&#160;&#160;&#160;&#160;&#160; Hesap Açıklaması: </b>
									<span><xsl:value-of
											select="//n1:Invoice/cac:PaymentMeans/cac:PayeeFinancialAccount/cbc:PaymentNote"/></span>
									<br/>
								</xsl:if>
								<xsl:if test="//n1:Invoice/cac:PaymentTerms/cbc:Note">
									<b>&#160;&#160;&#160;&#160;&#160; Ödeme Koşulu: </b>
									<span><xsl:value-of select="//n1:Invoice/cac:PaymentTerms/cbc:Note"/></span>
									<br/>
								</xsl:if>
								<xsl:if test="//n1:Invoice/cac:BuyerCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='PARTYTYPE']='TAXFREE' and //n1:Invoice/cac:TaxRepresentativeParty/cac:PartyTaxScheme/cbc:ExemptionReasonCode">
									<br/>
									<b>&#160;&#160;&#160;&#160;&#160; VAT OFF - NO CASH REFUND </b>
								</xsl:if>
							</td>
							<td style="width: 20%">
								<div id="qrcode" style="float:right; margin-bottom: 5px; margin-top: 5px;  margin-right: 5px;"/>
							</td>
						</tr>
					</tbody>
				</table>
				<!-- ORDER-REFUND -->
				<table border="1" cellpadding="1" cellspacing="1" style="width: 800px;"> 
					<tbody><tr>
					<td style="width: 239px;">
						<span style="color: rgb(68, 68, 68); font-family: verdana, geneva, sans-serif; font-size: 10px; line-height: 20.82px; text-align: center;">&#xa0; &#xa0;&#xa0;İŞBANKASI</span>
					</td>
					<td style="width: 450px;">
						<span style="color: rgb(68, 68, 68); font-family: verdana, geneva, sans-serif; font-size: 10px; line-height: 20.82px; text-align: center; background-color: rgb(255, 255, 255);">&#xa0; &#xa0;&#xa0;IBAN:&#xa0;TR06 0000 0006 1106 1207 1308 99</span>
					</td>
				</tr>
<tr>
					<td style="width: 239px;">
						<span style="color: rgb(68, 68, 68); font-family: verdana, geneva, sans-serif; font-size: 10px; line-height: 20.82px; text-align: center;">&#xa0; &#xa0;&#xa0;ZİRAAT</span>
					</td>
					<td style="width: 450px;">
						<span style="color: rgb(68, 68, 68); font-family: verdana, geneva, sans-serif; font-size: 10px; line-height: 20.82px; text-align: center; background-color: rgb(255, 255, 255);">&#xa0; &#xa0;&#xa0;IBAN:&#xa0;TR06 4446 0106 2309 9208 5309 89</span>
					</td>
				</tr></tbody> 
				</table>

				<div id="qrvalue" style="visibility: hidden;">
					<xsl:value-of select="n1:Invoice/cbc:UUID"/>
				</div>

				<script type="text/javascript">
					var qrcode = new QRCode(document.getElementById("qrcode"), {
					height: 120,
					width: 120
					});

					function makeCode (msg) {
					qrcode.makeCode(msg);
					}

					makeCode(document.getElementById("qrvalue").innerHTML);
				</script>
			</body>
		</html>
	</xsl:template>
	<xsl:template match="//n1:Invoice/cac:InvoiceLine">
		<tr class="lineTableTr">
			<td class="lineTableTd">
				<xsl:text>&#160;</xsl:text>
				<xsl:value-of select="./cbc:ID"/>
			</td>
			<xsl:choose>
				<xsl:when test="$varItemCode &gt; 0">
					<td class="lineTableTd">
						<xsl:text>&#160;</xsl:text>
						<xsl:value-of select="./cac:Item/cac:SellersItemIdentification/cbc:ID"/>
					</td>
				</xsl:when>
				<xsl:otherwise>
				</xsl:otherwise>
			</xsl:choose>
			<xsl:choose>
				<xsl:when test="//n1:Invoice/cac:AccountingCustomerParty/cac:Party/cac:PartyIdentification/cbc:ID[@schemeID='VKN' and text()='7350019759']">
					<td class="lineTableTd">
						<xsl:text>&#160;</xsl:text>
						<xsl:for-each select="./cbc:Note">
							<xsl:if test="contains(.,'#SS_Satir_NO=')">
								<xsl:value-of select="normalize-space(substring-after(substring(.,12),'='))"/>
							</xsl:if>
						</xsl:for-each>
					</td>
				</xsl:when>
			</xsl:choose>
			<td class="lineTableTd">
				<xsl:text>&#160;</xsl:text>
				<xsl:value-of select="./cac:Item/cbc:Name"/>
			</td>

			<xsl:if test="not($varfaturatipi='SGK')">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of
							select="format-number(./cbc:InvoicedQuantity, '###.##0,####', 'european')"/>
					<xsl:if test="./cbc:InvoicedQuantity/@unitCode">
						<xsl:for-each select="./cbc:InvoicedQuantity">
							<xsl:text> </xsl:text>
							<xsl:choose>
								<xsl:when test="@unitCode  = 'TNE'">
									<xsl:text>ton</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'BX'">
									<xsl:text>Kutu</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'LTR'">
									<xsl:text>lt</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'C62'">
									<xsl:text>Adet</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'NIU'">
									<xsl:text>Adet</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'TN'">
									<xsl:text> Teneke</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'KGM'">
									<xsl:text>kg</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'KJO'">
									<xsl:text>kJ</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'GRM'">
									<xsl:text>g</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MGM'">
									<xsl:text>mg</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'NT'">
									<xsl:text>Net Ton</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'GT'">
									<xsl:text>Gross Ton</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MTR'">
									<xsl:text>m</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MMT'">
									<xsl:text>mm</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'KTM'">
									<xsl:text>km</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MLT'">
									<xsl:text>ml</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MMQ'">
									<xsl:text>mm3</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CLT'">
									<xsl:text>cl</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CMK'">
									<xsl:text>cm2</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CMQ'">
									<xsl:text>cm3</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CMT'">
									<xsl:text>cm</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MTK'">
									<xsl:text>m2</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MTQ'">
									<xsl:text>m3</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'DAY'">
									<xsl:text> Gün</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'MON'">
									<xsl:text> Ay</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'PA'">
									<xsl:text> Paket</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'KWH'">
									<xsl:text> KWH</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'ANN'">
									<xsl:text> Yıl</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'HUR'">
									<xsl:text> Saat</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'D61'">
									<xsl:text> Dakika</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'D62'">
									<xsl:text> Saniye</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'CCT'">
									<xsl:text> Ton baş.taşıma kap.</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'D30'">
									<xsl:text> Brüt kalori</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'D40'">
									<xsl:text> 1000 lt</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'LPA'">
									<xsl:text> saf alkol lt</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'B32'">
									<xsl:text> kg.m2</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'NCL'">
									<xsl:text> hücre adet</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'PR'">
									<xsl:text> Çift</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'R9'">
									<xsl:text> 1000 m3</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'SET'">
									<xsl:text> Set</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'T3'">
									<xsl:text> 1000 adet</xsl:text>
								</xsl:when>
								<xsl:when test="@unitCode  = 'PK'">
									<xsl:text> Koli</xsl:text>
								</xsl:when>
							</xsl:choose>
						</xsl:for-each>
					</xsl:if>
				</td>
				<xsl:if test="$varEtiketFiyati='1'">
					<td class="lineTableTd" align="right">
						<xsl:for-each select="//n1:Invoice/cac:InvoiceLine/cbc:Note">
							<xsl:if test="contains(.,'ETF:') or contains(.,'ESF:')">
								<xsl:value-of select="substring-after(substring(.,4),':')" />
								<xsl:text> </xsl:text>
								<xsl:if test="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID = &quot;TRL&quot; or //n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID = &quot;TRY&quot;">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID != &quot;TRL&quot; and //n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID != &quot;TRY&quot;">
									<xsl:value-of select="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID"/>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</td>
				</xsl:if>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of
							select="format-number(./cac:Price/cbc:PriceAmount, '###.##0,########', 'european')"/>
					<xsl:if test="./cac:Price/cbc:PriceAmount/@currencyID">
						<xsl:text> </xsl:text>
						<xsl:if test="./cac:Price/cbc:PriceAmount/@currencyID = &quot;TRL&quot; or ./cac:Price/cbc:PriceAmount/@currencyID = &quot;TRY&quot;">
							<xsl:text>TL</xsl:text>
						</xsl:if>
						<xsl:if test="./cac:Price/cbc:PriceAmount/@currencyID != &quot;TRL&quot; and ./cac:Price/cbc:PriceAmount/@currencyID != &quot;TRY&quot;">
							<xsl:value-of select="./cac:Price/cbc:PriceAmount/@currencyID"/>
						</xsl:if>
					</xsl:if>
				</td>
				<xsl:if test="$varDepocuFiyati='1'">
					<td class="lineTableTd" align="right">
						<xsl:text>&#160;</xsl:text>
						<xsl:for-each select="//n1:Invoice/cac:InvoiceLine/cbc:Note">
							<xsl:if test="contains(.,'DSF:')">
								<br/>
								<xsl:value-of select="substring-after(substring(.,4),':')" />
								<xsl:text> </xsl:text>
								<xsl:if test="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID = &quot;TRL&quot; or //n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID = &quot;TRY&quot;">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID != &quot;TRL&quot; and .//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID != &quot;TRY&quot;">
									<xsl:value-of select="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID"/>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
						<br/>
					</td>
				</xsl:if>
				<xsl:if test="$varEczaciKar='1'">
					<td class="lineTableTd" align="right">
						<xsl:text>&#160;</xsl:text>
						<xsl:for-each select="//n1:Invoice/cac:InvoiceLine/cbc:Note">
							<xsl:if test="contains(.,'ECK:') or contains(.,'EKO:')">
								<xsl:text>%</xsl:text>
								<xsl:value-of select="substring-after(substring(.,4),':')" />
								<xsl:text> </xsl:text>
							</xsl:if>
						</xsl:for-each>
					</td>
				</xsl:if>
				<xsl:if test="$varKurumIskonto='1'">
					<td class="lineTableTd" align="right">
						<xsl:for-each select="//n1:Invoice/cac:InvoiceLine/cbc:Note">
							<xsl:if test="contains(.,'KRI:')">
								<xsl:value-of select="substring-after(substring(.,4),':')" />
								<xsl:text> </xsl:text>
								<xsl:if test="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID = &quot;TRL&quot; or //n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID = &quot;TRY&quot;">
									<xsl:text>TL</xsl:text>
								</xsl:if>
								<xsl:if test="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID != &quot;TRL&quot; and //n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID != &quot;TRY&quot;">
									<xsl:value-of select="//n1:Invoice/cac:InvoiceLine/cac:Price/cbc:PriceAmount/@currencyID"/>
								</xsl:if>
							</xsl:if>
						</xsl:for-each>
					</td>
				</xsl:if>
				<xsl:if test="$varVade='1'">
					<td class="lineTableTd" align="right">
						<xsl:text>&#160;</xsl:text>
						<xsl:for-each select="//n1:Invoice/cac:InvoiceLine/cbc:Note">
							<xsl:if test="contains(.,'VAD:')">
								<xsl:value-of select="substring-after(substring(.,4),':')" />
								<xsl:text> </xsl:text>
							</xsl:if>
						</xsl:for-each>
						<br/>
					</td>
				</xsl:if>
			<xsl:if test="$varAllowanceRate &gt; 0">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="./cac:AllowanceCharge/cbc:MultiplierFactorNumeric">
						<xsl:choose>
							<xsl:when test="../cbc:ChargeIndicator='true'">
								<xsl:text>(+) %</xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text>(-) %</xsl:text>
							</xsl:otherwise>
						</xsl:choose>
						<xsl:value-of select="format-number(. * 100, '###.##0,00', 'european')"/>
						<br/>
					</xsl:for-each>
				</td>
			</xsl:if>
			<xsl:if test="$varAllowanceAmount &gt; 0">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:AllowanceCharge/cbc:Amount">
						<xsl:call-template name="Curr_Type"/>
						<br/>
					</xsl:for-each>
				</td>
			</xsl:if>
			<xsl:if test="$varAllowanceReason &gt; 0">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:AllowanceCharge/cbc:AllowanceChargeReason">

						<xsl:choose>
							<xsl:when test="../cbc:ChargeIndicator='true'">
								<xsl:text>Arttırım - </xsl:text>
							</xsl:when>
							<xsl:otherwise>
								<xsl:text>İskonto - </xsl:text>
							</xsl:otherwise>
						</xsl:choose>
						<xsl:apply-templates/>
						<br/>
					</xsl:for-each>
				</td>
			</xsl:if>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
							select="./cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
						<xsl:if test="cbc:TaxTypeCode='0015' ">
							<xsl:text> </xsl:text>
							<xsl:if test="../../cbc:Percent">
								<xsl:text> %</xsl:text>
								<xsl:value-of select="format-number(../../cbc:Percent, '###.##0,00', 'european')"
								/>
							</xsl:if>
						</xsl:if>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
							select="./cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
						<xsl:if test="cbc:TaxTypeCode='0015' ">
							<xsl:text> </xsl:text>
							<xsl:for-each select="../../cbc:TaxAmount">
								<xsl:call-template name="Curr_Type"/>
							</xsl:for-each>
						</xsl:if>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" style="font-size: xx-small" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
							select="./cac:TaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
						<xsl:if test="cbc:TaxTypeCode!='0015' ">
							<xsl:text> </xsl:text>
							<xsl:value-of select="cbc:Name"/>
							<xsl:if test="../../cbc:Percent">
								<xsl:text> (%</xsl:text>
								<xsl:value-of
										select="format-number(../../cbc:Percent, '###.##0,00', 'european')"/>
								<xsl:text>)=</xsl:text>
							</xsl:if>
							<xsl:for-each select="../../cbc:TaxAmount">
								<xsl:call-template name="Curr_Type"/>
							</xsl:for-each>
						</xsl:if>
					</xsl:for-each>
					<xsl:for-each select="./cac:WithholdingTaxTotal/cac:TaxSubtotal/cac:TaxCategory/cac:TaxScheme">
						<xsl:text>KDV TEVKİFAT </xsl:text>
						<xsl:if test="../../cbc:Percent">
							<xsl:text> (%</xsl:text>
							<xsl:value-of
									select="format-number(../../cbc:Percent, '###.##0,00', 'european')"/>
							<xsl:text>)=</xsl:text>
						</xsl:if>
						<xsl:for-each select="../../cbc:TaxAmount">
							<xsl:call-template name="Curr_Type"/>
							<xsl:text>&#10;</xsl:text>
						</xsl:for-each>
					</xsl:for-each>
					<xsl:for-each select="./cbc:Note">
						<xsl:if test="contains(.,'AVANS MAHSUBU')">
							<br/>
							<xsl:value-of select="." />
						</xsl:if>
						<xsl:if test="contains(.,'NAKİT TEMİNAT KESİNTİSİ')">
							<br/>
							<xsl:value-of select="." />
						</xsl:if>
					</xsl:for-each>
				</td>
				<xsl:if test="$varLineExplanation &gt; 0">
					<td class="lineTableTd" align="right">
						<xsl:text>&#160;</xsl:text>
						<xsl:for-each select="cbc:Note">
							<xsl:if test="not(contains(.,'#SS_Satir_NO=')) and not(contains(.,'AVANS MAHSUBU')) and not(contains(.,'NAKİT TEMİNAT KESİNTİSİ'))
						and not(contains(.,'ECK:')) and not(contains(.,'ETF:')) and not(contains(.,'KRI:')) and not(contains(.,'VAD:')) and not(contains(.,'DSF:'))">
								<xsl:text>&#160;</xsl:text>
								<xsl:apply-templates/>
							</xsl:if>

						</xsl:for-each>
					</td>
				</xsl:if>
			</xsl:if>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
				<xsl:for-each select="cbc:LineExtensionAmount">
					<xsl:call-template name="Curr_Type"/>
				</xsl:for-each>
			</td>
			<xsl:if test="//n1:Invoice/cbc:ProfileID='EARSIVFATURA' and //n1:Invoice/cbc:InvoiceTypeCode='ISTISNA'">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of select="cac:Delivery/cac:Shipment/cac:GoodsItem/cbc:RequiredCustomsID"/>
				</td>
			</xsl:if>
			<xsl:if test="//n1:Invoice/cbc:ProfileID='HKS' or /n1:Invoice/cbc:InvoiceTypeCode='HKSSATIS' or /n1:Invoice/cbc:InvoiceTypeCode='HKSKOMISYONCU'">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
							select="cac:Item/cac:AdditionalItemIdentification/cbc:ID[@schemeID='KUNYENO']">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
			</xsl:if>
			<xsl:if test="//n1:Invoice/cbc:ProfileID='HKS' and /n1:Invoice/cbc:InvoiceTypeCode='SATIS'">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
							select="cac:Item/cac:AdditionalItemIdentification/cbc:ID[@schemeID='MALSAHIBIVKNTCKN']">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
							select="cac:Item/cac:AdditionalItemIdentification/cbc:ID[@schemeID='MALSAHIBIADSOYADUNVAN']">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
			</xsl:if>
			<xsl:if test="//n1:Invoice/cbc:InvoiceTypeCode='HKSSATIS'">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
							select="cac:Item/cac:AdditionalItemIdentification/cbc:ID[@schemeID='MALSAHIBIVKNTCKN']">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each
							select="cac:Item/cac:AdditionalItemIdentification/cbc:ID[@schemeID='MALSAHIBIADSOYADUNVAN']">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
			</xsl:if>
			<xsl:if test="//n1:Invoice/cbc:ProfileID='IHRACAT' or //n1:Invoice/cbc:ProfileID='OZELFATURA'">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:Delivery/cac:DeliveryTerms/cbc:ID[@schemeID='INCOTERMS']">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:Delivery/cac:Shipment/cac:TransportHandlingUnit/cac:ActualPackage/cbc:PackagingTypeCode">
						<xsl:text>&#160;</xsl:text>
						<xsl:call-template name="Packaging">
							<xsl:with-param name="PackagingType">
								<xsl:value-of select="."/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:Delivery/cac:Shipment/cac:TransportHandlingUnit/cac:ActualPackage/cbc:ID">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:value-of
							select="format-number(cac:Delivery/cac:Shipment/cac:TransportHandlingUnit/cac:ActualPackage/cbc:Quantity, '###.##0,00', 'european')"/>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:Delivery/cac:DeliveryAddress">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:Delivery/cac:Shipment/cac:ShipmentStage/cbc:TransportModeCode">
						<xsl:text>&#160;</xsl:text>
						<xsl:call-template name="TransportMode">
							<xsl:with-param name="TransportModeType">
								<xsl:value-of select="."/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:Delivery/cac:Shipment/cac:GoodsItem/cbc:RequiredCustomsID">
						<xsl:text>&#160;</xsl:text>
						<xsl:apply-templates/>
					</xsl:for-each>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
					<xsl:for-each select="cac:Delivery/cac:Shipment/cbc:DeclaredCustomsValueAmount">
						<xsl:call-template name="Curr_Type"/>
					</xsl:for-each>
				</td>
			</xsl:if>
		</tr>
	</xsl:template>
	<xsl:template match="//cbc:IssueDate">
		<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
	</xsl:template>
	<xsl:template match="//cbc:StartDate">
		<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
	</xsl:template>
	<xsl:template match="//cbc:EndDate">
		<xsl:value-of select="substring(.,9,2)"/>-<xsl:value-of select="substring(.,6,2)"/>-<xsl:value-of select="substring(.,1,4)"/>
	</xsl:template>
	<xsl:template match="//n1:Invoice">
		<tr class="lineTableTr">
			<td class="lineTableTd">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<td class="lineTableTd" align="right">
				<xsl:text>&#160;</xsl:text>
			</td>
			<xsl:if test="//n1:Invoice/cbc:ProfileID='HKS'">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
			</xsl:if>
			<xsl:if test="//n1:Invoice/cbc:ProfileID='HKS' and /n1:Invoice/cbc:InvoiceTypeCode='SATIS'">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
			</xsl:if>
			<xsl:if test="//n1:Invoice/cbc:ProfileID='IHRACAT' or //n1:Invoice/cbc:ProfileID='OZELFATURA'">
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
				<td class="lineTableTd" align="right">
					<xsl:text>&#160;</xsl:text>
				</td>
			</xsl:if>
		</tr>
	</xsl:template>
	<xsl:template name="Party_Title" >
		<xsl:param name="PartyType" />
		<td style="width:469px; " align="left">
			<xsl:if test="cac:PartyName">
				<xsl:value-of select="cac:PartyName/cbc:Name"/>
				<br/>
			</xsl:if>
			<xsl:if test="cac:PartyLegalEntity">
				<xsl:text>Vergi No:</xsl:text>
				<xsl:value-of select="cac:PartyLegalEntity/cbc:CompanyID"/>
				<br/>
			</xsl:if>
			<xsl:for-each select="cac:Person">
				<xsl:for-each select="cbc:Title">
					<xsl:apply-templates/>
					<xsl:text>&#160;</xsl:text>
				</xsl:for-each>
				<xsl:for-each select="cbc:FirstName">
					<xsl:apply-templates/>
					<xsl:text>&#160;</xsl:text>
				</xsl:for-each>
				<xsl:for-each select="cbc:MiddleName">
					<xsl:apply-templates/>
					<xsl:text>&#160; </xsl:text>
				</xsl:for-each>
				<xsl:for-each select="cbc:FamilyName">
					<xsl:apply-templates/>
					<xsl:text>&#160;</xsl:text>
				</xsl:for-each>
				<xsl:for-each select="cbc:NameSuffix">
					<xsl:apply-templates/>
				</xsl:for-each>
				<xsl:if test="$PartyType='TAXFREE'">
					<br/>
					<xsl:text>Pasaport No: </xsl:text>
					<xsl:value-of select="cac:IdentityDocumentReference/cbc:ID"/>
					<br/>
					<xsl:text>Ülkesi: </xsl:text>
					<xsl:for-each select="cbc:NationalityID">
						<xsl:call-template name="Country">
							<xsl:with-param name="CountryType">
								<xsl:value-of select="."/>
							</xsl:with-param>
						</xsl:call-template>
					</xsl:for-each>
				</xsl:if>
			</xsl:for-each>
		</td>
	</xsl:template>
	<xsl:template name="Party_Adress" >
		<xsl:param name="PartyType" />
		<td style="width:469px; " align="left">
			<xsl:for-each select="cac:PostalAddress">
				<xsl:for-each select="cbc:StreetName">
					<xsl:apply-templates/>
					<xsl:text>&#160;</xsl:text>
				</xsl:for-each>
				<xsl:for-each select="cbc:BuildingName">
					<xsl:apply-templates/>
				</xsl:for-each>
				<xsl:for-each select="cbc:BuildingNumber">
					<xsl:text> No:</xsl:text>
					<xsl:apply-templates/>
					<xsl:text>&#160;</xsl:text>
				</xsl:for-each>
				<br/>
				<xsl:for-each select="cbc:Room">
					<xsl:text>Kapı No:</xsl:text>
					<xsl:apply-templates/>
					<xsl:text>&#160;</xsl:text>
				</xsl:for-each>
				<br/>
				<xsl:for-each select="cbc:PostalZone">
					<xsl:apply-templates/>
					<xsl:text>&#160;</xsl:text>
				</xsl:for-each>
				<xsl:for-each select="cbc:CitySubdivisionName">
					<xsl:apply-templates/>
					<xsl:text>/ </xsl:text>
				</xsl:for-each>
				<xsl:for-each select="cbc:CityName">
					<xsl:apply-templates/>
					<xsl:text>&#160;</xsl:text>
				</xsl:for-each>
				<xsl:for-each select="cac:Country/cbc:Name">
					<br/>
					<xsl:apply-templates/>
					<br/>
				</xsl:for-each>
			</xsl:for-each>
		</td>
	</xsl:template>
	<xsl:template name="TransportMode">
		<xsl:param name="TransportModeType" />
		<xsl:choose>
			<xsl:when test="$TransportModeType=1">Denizyolu</xsl:when>
			<xsl:when test="$TransportModeType=2">Demiryolu</xsl:when>
			<xsl:when test="$TransportModeType=3">Karayolu</xsl:when>
			<xsl:when test="$TransportModeType=4">Havayolu</xsl:when>
			<xsl:when test="$TransportModeType=5">Posta</xsl:when>
			<xsl:when test="$TransportModeType=6">Çok araçlı</xsl:when>
			<xsl:when test="$TransportModeType=7">Sabit taşıma tesisleri</xsl:when>
			<xsl:when test="$TransportModeType=8">İç su taşımacılığı</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$TransportModeType"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="PaymentMeansCode">
		<xsl:param name="PaymentMeansCodeType" />
		<xsl:choose>
			<xsl:when test="$PaymentMeansCodeType='1'">ODEME ARACISI</xsl:when>
			<xsl:when test="$PaymentMeansCodeType='10'">KAPIDA ODEME</xsl:when>
			<xsl:when test="$PaymentMeansCodeType='30'">EFT/HAVALE</xsl:when>
			<xsl:when test="$PaymentMeansCodeType='48'">KREDIKARTI/BANKAKARTI</xsl:when>
			<xsl:when test="$PaymentMeansCodeType='ZZZ'">Özel Tanımlı</xsl:when>
			<xsl:when test="$PaymentMeansCodeType='97'">DIGER</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$PaymentMeansCodeType"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="Packaging">
		<xsl:param name="PackagingType" />
		<xsl:choose>
			<xsl:when test="$PackagingType='1A'">Çelik bidon</xsl:when>
			<xsl:when test="$PackagingType='1B'">Alüminyum bidon</xsl:when>
			<xsl:when test="$PackagingType='1D'">Kontraplak bidon</xsl:when>
			<xsl:when test="$PackagingType='1F'">Esnek ambalaj kutu</xsl:when>
			<xsl:when test="$PackagingType='1G'">Elyaflı silindir</xsl:when>
			<xsl:when test="$PackagingType='1W'">Ahşap silindir</xsl:when>
			<xsl:when test="$PackagingType='2C'">Ahşap varil</xsl:when>
			<xsl:when test="$PackagingType='3A'">Beş galonluk çelik bidon</xsl:when>
			<xsl:when test="$PackagingType='3H'">Beş galonluk plastik bidon</xsl:when>
			<xsl:when test="$PackagingType='43'">Torba, süper boy</xsl:when>
			<xsl:when test="$PackagingType='44'">Çoklu torba</xsl:when>
			<xsl:when test="$PackagingType='4A'">Çelik kutu</xsl:when>
			<xsl:when test="$PackagingType='4B'">Alüminyum kutu</xsl:when>
			<xsl:when test="$PackagingType='4C'">Doğal ahşap kutu</xsl:when>
			<xsl:when test="$PackagingType='4D'">Kontraplak kutu</xsl:when>
			<xsl:when test="$PackagingType='4F'">Yeniden üretilmiş ahşap kutu</xsl:when>
			<xsl:when test="$PackagingType='4G'">Elyaf tahta kutu</xsl:when>
			<xsl:when test="$PackagingType='4H'">Plastik kutu</xsl:when>
			<xsl:when test="$PackagingType='5H'">Plastik dokuma torba</xsl:when>
			<xsl:when test="$PackagingType='5L'">Kumaş torba</xsl:when>
			<xsl:when test="$PackagingType='5M'">Kağıt torba</xsl:when>
			<xsl:when test="$PackagingType='6H'">Kompozit ambalaj, plastik kap</xsl:when>
			<xsl:when test="$PackagingType='6P'">Kompozit ambalaj, cam kutu</xsl:when>
			<xsl:when test="$PackagingType='7A'">Araba kabı</xsl:when>
			<xsl:when test="$PackagingType='7B'">Ahşap kasa</xsl:when>
			<xsl:when test="$PackagingType='8A'">Ahşap palet</xsl:when>
			<xsl:when test="$PackagingType='8B'">Ahşap kasa</xsl:when>
			<xsl:when test="$PackagingType='8C'">Ahşap paketi</xsl:when>
			<xsl:when test="$PackagingType='AA'">Ortaboy sert plastik dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='AB'">Elyaf kap</xsl:when>
			<xsl:when test="$PackagingType='AC'">Kağıt kap</xsl:when>
			<xsl:when test="$PackagingType='AD'">Ahşap kap</xsl:when>
			<xsl:when test="$PackagingType='AE'">Aerosol</xsl:when>
			<xsl:when test="$PackagingType='AF'">Palet, modüler, yaka 80cms * 60cms</xsl:when>
			<xsl:when test="$PackagingType='AG'">Sarılmış palet</xsl:when>
			<xsl:when test="$PackagingType='AH'">Palet, 100 cms * 110 cms</xsl:when>
			<xsl:when test="$PackagingType='AI'">Çift çeneli kepçe</xsl:when>
			<xsl:when test="$PackagingType='AJ'">Koni</xsl:when>
			<xsl:when test="$PackagingType='AL'">Top</xsl:when>
			<xsl:when test="$PackagingType='AM'">Korumasız ampul</xsl:when>
			<xsl:when test="$PackagingType='AP'">Korumalı ampül</xsl:when>
			<xsl:when test="$PackagingType='AT'">Püskürteç</xsl:when>
			<xsl:when test="$PackagingType='AV'">Kapsül</xsl:when>
			<xsl:when test="$PackagingType='B4'">Kemer</xsl:when>
			<xsl:when test="$PackagingType='BA'">Varil</xsl:when>
			<xsl:when test="$PackagingType='BB'">Bobin</xsl:when>
			<xsl:when test="$PackagingType='BC'">Şişe kasası/rafı</xsl:when>
			<xsl:when test="$PackagingType='BD'">Tahta</xsl:when>
			<xsl:when test="$PackagingType='BE'">Bohça</xsl:when>
			<xsl:when test="$PackagingType='BF'">Balon, korunmasız</xsl:when>
			<xsl:when test="$PackagingType='BG'">Torba</xsl:when>
			<xsl:when test="$PackagingType='BH'">Demet</xsl:when>
			<xsl:when test="$PackagingType='BI'">Çöp kutusu</xsl:when>
			<xsl:when test="$PackagingType='BJ'">Kova</xsl:when>
			<xsl:when test="$PackagingType='BK'">Sepet</xsl:when>
			<xsl:when test="$PackagingType='BL'">Sıkıştırılmış balya</xsl:when>
			<xsl:when test="$PackagingType='BM'">Kase</xsl:when>
			<xsl:when test="$PackagingType='BN'">Sıkıştırılmamış balya</xsl:when>
			<xsl:when test="$PackagingType='BO'">Şişe, korunmasız, silindirik</xsl:when>
			<xsl:when test="$PackagingType='BP'">Balon, korunmasız</xsl:when>
			<xsl:when test="$PackagingType='BQ'">Şişe, korunmuş, silindirik</xsl:when>
			<xsl:when test="$PackagingType='BR'">Çubuk</xsl:when>
			<xsl:when test="$PackagingType='BS'">Şişe, korunmasız, soğanbiçim</xsl:when>
			<xsl:when test="$PackagingType='BT'">Sürgü</xsl:when>
			<xsl:when test="$PackagingType='BU'">İzmarit</xsl:when>
			<xsl:when test="$PackagingType='BV'">Şişe, korunmuş, soğanbiçim</xsl:when>
			<xsl:when test="$PackagingType='BW'">Sıvılar için kutu</xsl:when>
			<xsl:when test="$PackagingType='BX'">Kutu</xsl:when>
			<xsl:when test="$PackagingType='BY'">Tahta, paket halinde/demet</xsl:when>
			<xsl:when test="$PackagingType='BZ'">Çıbuklar, paket halinde/demet</xsl:when>
			<xsl:when test="$PackagingType='CA'">Dikdörtgen teneke</xsl:when>
			<xsl:when test="$PackagingType='CB'">Bira kasası</xsl:when>
			<xsl:when test="$PackagingType='CC'">Yayık</xsl:when>
			<xsl:when test="$PackagingType='CD'">Teneke ibrik</xsl:when>
			<xsl:when test="$PackagingType='CE'">Balık sepeti</xsl:when>
			<xsl:when test="$PackagingType='CF'">Sandık</xsl:when>
			<xsl:when test="$PackagingType='CG'">Kafes</xsl:when>
			<xsl:when test="$PackagingType='CH'">Sandık</xsl:when>
			<xsl:when test="$PackagingType='CI'">Teneke kutu</xsl:when>
			<xsl:when test="$PackagingType='CJ'">Tabut</xsl:when>
			<xsl:when test="$PackagingType='CK'">Fıçı</xsl:when>
			<xsl:when test="$PackagingType='CL'">Bobin</xsl:when>
			<xsl:when test="$PackagingType='CM'">Kart</xsl:when>
			<xsl:when test="$PackagingType='CN'">Konteyner</xsl:when>
			<xsl:when test="$PackagingType='CO'">Damacana, korumasız</xsl:when>
			<xsl:when test="$PackagingType='CP'">Damacana, korumalı</xsl:when>
			<xsl:when test="$PackagingType='CQ'">Kartuş</xsl:when>
			<xsl:when test="$PackagingType='CR'">Kasa</xsl:when>
			<xsl:when test="$PackagingType='CS'">Kutu</xsl:when>
			<xsl:when test="$PackagingType='CT'">Karton kutu</xsl:when>
			<xsl:when test="$PackagingType='CU'">Fincan</xsl:when>
			<xsl:when test="$PackagingType='CV'">Kapak</xsl:when>
			<xsl:when test="$PackagingType='CW'">Rulo kafes</xsl:when>
			<xsl:when test="$PackagingType='CX'">Silindirik teneke</xsl:when>
			<xsl:when test="$PackagingType='CY'">Silindir</xsl:when>
			<xsl:when test="$PackagingType='CZ'">Tuval</xsl:when>
			<xsl:when test="$PackagingType='DA'">Kasa, çok tabakalı, plastik</xsl:when>
			<xsl:when test="$PackagingType='DB'">Kasa, çok tabakalı, ahşap</xsl:when>
			<xsl:when test="$PackagingType='DC'">Kasa, çok tabakalı, karton</xsl:when>
			<xsl:when test="$PackagingType='DI'">Demir varil</xsl:when>
			<xsl:when test="$PackagingType='DJ'">Damacana</xsl:when>
			<xsl:when test="$PackagingType='DK'">Karton kasa</xsl:when>
			<xsl:when test="$PackagingType='DL'">Plastik dökme kasa</xsl:when>
			<xsl:when test="$PackagingType='DM'">Ahşap dökme kasa</xsl:when>
			<xsl:when test="$PackagingType='DN'">Sebil/dağıtıcı</xsl:when>
			<xsl:when test="$PackagingType='DP'">Damacana, korumalı</xsl:when>
			<xsl:when test="$PackagingType='DR'">Bidon</xsl:when>
			<xsl:when test="$PackagingType='DS'">Üst kapaksız plastik tepsi, tek tabaka</xsl:when>
			<xsl:when test="$PackagingType='DT'">Üst kapaksız ahşap tepsi, tek tabaka</xsl:when>
			<xsl:when test="$PackagingType='DU'">Üst kapaksız polistiren tepsi, tek
				tabaka</xsl:when>
			<xsl:when test="$PackagingType='DV'">Üst kapaksız karton tepsi, tek tabaka</xsl:when>
			<xsl:when test="$PackagingType='DW'">Üst kapaksız plastik tepsi, çift tabaka</xsl:when>
			<xsl:when test="$PackagingType='DX'"/>
			<xsl:when test="$PackagingType='DY'">Üst kapaksız karton tepsi, çift tabaka</xsl:when>
			<xsl:when test="$PackagingType='EC'">Plastik torba</xsl:when>
			<xsl:when test="$PackagingType='ED'">Kasa, palet tabanı ile</xsl:when>
			<xsl:when test="$PackagingType='EE'">Ahşap kasa, palet tabanı ile</xsl:when>
			<xsl:when test="$PackagingType='EF'">Karton kasa, palet tabanı ile</xsl:when>
			<xsl:when test="$PackagingType='EG'">Plastik kasa, palet tabanı ile</xsl:when>
			<xsl:when test="$PackagingType='EH'">Metal kasa, palet tabanı ile</xsl:when>
			<xsl:when test="$PackagingType='EI'">İzotermik kasa</xsl:when>
			<xsl:when test="$PackagingType='EN'">Zarf</xsl:when>
			<xsl:when test="$PackagingType='FB'">Plastik esnek torba</xsl:when>
			<xsl:when test="$PackagingType='FC'">Meyve kasası</xsl:when>
			<xsl:when test="$PackagingType='FD'">Çerçeveli kasa</xsl:when>
			<xsl:when test="$PackagingType='FE'">Plastik esnek depo</xsl:when>
			<xsl:when test="$PackagingType='FI'">Küçük fıçı</xsl:when>
			<xsl:when test="$PackagingType='FL'">Matara</xsl:when>
			<xsl:when test="$PackagingType='FO'">Küçük sandık</xsl:when>
			<xsl:when test="$PackagingType='FR'">Çerçeve</xsl:when>
			<xsl:when test="$PackagingType='FT'">Streçlenmiş yemek kabı</xsl:when>
			<xsl:when test="$PackagingType='FW'">Yanları üstü açık yük arabası</xsl:when>
			<xsl:when test="$PackagingType='FX'">Esnek torba</xsl:when>
			<xsl:when test="$PackagingType='GB'">Gaz şişesi</xsl:when>
			<xsl:when test="$PackagingType='GI'">Kiriş</xsl:when>
			<xsl:when test="$PackagingType='GL'">Konteyner, galon</xsl:when>
			<xsl:when test="$PackagingType='GR'">Cam kap</xsl:when>
			<xsl:when test="$PackagingType='GY'">Çul</xsl:when>
			<xsl:when test="$PackagingType='GZ'">Kiriş, demet/grup</xsl:when>
			<xsl:when test="$PackagingType='HA'">Saplı plastik sepet</xsl:when>
			<xsl:when test="$PackagingType='HB'">Saplı ahşap sepet</xsl:when>
			<xsl:when test="$PackagingType='HC'">Saplı karton sepet</xsl:when>
			<xsl:when test="$PackagingType='HG'">Büyük fıçı</xsl:when>
			<xsl:when test="$PackagingType='HN'">Askı</xsl:when>
			<xsl:when test="$PackagingType='HR'">Kapaklı sepet</xsl:when>
			<xsl:when test="$PackagingType='IA'">Ahşap sergi paketi</xsl:when>
			<xsl:when test="$PackagingType='IB'">Karton sergi paketi</xsl:when>
			<xsl:when test="$PackagingType='IC'">Plastik sergi paketi</xsl:when>
			<xsl:when test="$PackagingType='ID'">Metal sergi paketi</xsl:when>
			<xsl:when test="$PackagingType='IE'">Gösteri paketi</xsl:when>
			<xsl:when test="$PackagingType='IF'">Şeffaf oluklu paket</xsl:when>
			<xsl:when test="$PackagingType='IG'">Kağıt sarılı ambalaj</xsl:when>
			<xsl:when test="$PackagingType='IH'">Plastik bidon</xsl:when>
			<xsl:when test="$PackagingType='IK'">Şişe delikli karton paket</xsl:when>
			<xsl:when test="$PackagingType='IL'">Tepsi, katı, kapaklı istiflenebilir</xsl:when>
			<xsl:when test="$PackagingType='IN'">Külçe</xsl:when>
			<xsl:when test="$PackagingType='IZ'">Paket/grop halde külçe</xsl:when>
			<xsl:when test="$PackagingType='JB'">Jumbo boy torba</xsl:when>
			<xsl:when test="$PackagingType='JC'">Beş galonluk dikdörtgen bidon</xsl:when>
			<xsl:when test="$PackagingType='JG'">Sürahi</xsl:when>
			<xsl:when test="$PackagingType='JR'">Kavanoz</xsl:when>
			<xsl:when test="$PackagingType='JY'">Beş galonluk silindir bidon</xsl:when>
			<xsl:when test="$PackagingType='KI'">Takım</xsl:when>
			<xsl:when test="$PackagingType='LE'">Bagaj</xsl:when>
			<xsl:when test="$PackagingType='LG'">Kütük</xsl:when>
			<xsl:when test="$PackagingType='LT'">Pay</xsl:when>
			<xsl:when test="$PackagingType='LU'">Kulp</xsl:when>
			<xsl:when test="$PackagingType='LV'">Liftvan</xsl:when>
			<xsl:when test="$PackagingType='LZ'">Paket/grup kütükler</xsl:when>
			<xsl:when test="$PackagingType='MA'">Metal kasa</xsl:when>
			<xsl:when test="$PackagingType='MB'">Çoklu çanta</xsl:when>
			<xsl:when test="$PackagingType='MC'">Süt kasasu</xsl:when>
			<xsl:when test="$PackagingType='ME'">Metal konteyner</xsl:when>
			<xsl:when test="$PackagingType='MR'">Metal kap</xsl:when>
			<xsl:when test="$PackagingType='MS'">Çok duvarlı çuval</xsl:when>
			<xsl:when test="$PackagingType='MT'">Mat</xsl:when>
			<xsl:when test="$PackagingType='MW'">Plastik sarılmış kap</xsl:when>
			<xsl:when test="$PackagingType='MX'">Kibrit kutusu</xsl:when>
			<xsl:when test="$PackagingType='NE'">Ambalajsız</xsl:when>
			<xsl:when test="$PackagingType='NF'">Ambalajsız, tek ünite</xsl:when>
			<xsl:when test="$PackagingType='NG'">Ambalajsız, çok ünite</xsl:when>
			<xsl:when test="$PackagingType='NS'">Yuva</xsl:when>
			<xsl:when test="$PackagingType='NT'">Ağ</xsl:when>
			<xsl:when test="$PackagingType='NU'">Plastik ağ tüp</xsl:when>
			<xsl:when test="$PackagingType='NV'">Kumaş ağ tüp</xsl:when>
			<xsl:when test="$PackagingType='OA'">Palet, CHEP 40x60 cm</xsl:when>
			<xsl:when test="$PackagingType='OB'">Palet, CHEP 80x120 cm</xsl:when>
			<xsl:when test="$PackagingType='OC'">Palet, CHEP 100x120 cm</xsl:when>
			<xsl:when test="$PackagingType='OD'">Avustralya standart paleti</xsl:when>
			<xsl:when test="$PackagingType='OE'">Palet, 110x100 cm</xsl:when>
			<xsl:when test="$PackagingType='OF'">Nakliye platformu, belirtilmemiş ağırlık ve
				bıyut</xsl:when>
			<xsl:when test="$PackagingType='OK'">Blok</xsl:when>
			<xsl:when test="$PackagingType='OT'">Sekiz kenar kutu</xsl:when>
			<xsl:when test="$PackagingType='OU'">Dış konteyner</xsl:when>
			<xsl:when test="$PackagingType='P2'">Tava</xsl:when>
			<xsl:when test="$PackagingType='PA'">Küçük paket</xsl:when>
			<xsl:when test="$PackagingType='PB'">Kombine açık uçlu kutu ve palet</xsl:when>
			<xsl:when test="$PackagingType='PC'">Parsel</xsl:when>
			<xsl:when test="$PackagingType='PD'">Palet, modüler 80 x 100 cm</xsl:when>
			<xsl:when test="$PackagingType='PE'">Palet, modüler 80 x 120 cm</xsl:when>
			<xsl:when test="$PackagingType='PF'">Kalem</xsl:when>
			<xsl:when test="$PackagingType='PG'">Plaka</xsl:when>
			<xsl:when test="$PackagingType='PH'">Sürahi</xsl:when>
			<xsl:when test="$PackagingType='PI'">Boru</xsl:when>
			<xsl:when test="$PackagingType='PJ'">Meyve sepeti</xsl:when>
			<xsl:when test="$PackagingType='PK'">Paket</xsl:when>
			<xsl:when test="$PackagingType='PL'">Gerdel</xsl:when>
			<xsl:when test="$PackagingType='PN'">Kalas</xsl:when>
			<xsl:when test="$PackagingType='PO'">Destek</xsl:when>
			<xsl:when test="$PackagingType='PP'">Parça</xsl:when>
			<xsl:when test="$PackagingType='PR'">Plastik kap</xsl:when>
			<xsl:when test="$PackagingType='PT'">Demlik</xsl:when>
			<xsl:when test="$PackagingType='PU'">Tepsi</xsl:when>
			<xsl:when test="$PackagingType='PV'">Paket/grup boru</xsl:when>
			<xsl:when test="$PackagingType='PX'">Palet</xsl:when>
			<xsl:when test="$PackagingType='PY'">Paket/grup tabak</xsl:when>
			<xsl:when test="$PackagingType='PZ'">Paket/grup kalas</xsl:when>
			<xsl:when test="$PackagingType='QA'">Üstü açılmaz çelik bidon</xsl:when>
			<xsl:when test="$PackagingType='QB'">Üstü açılır çelik bidon</xsl:when>
			<xsl:when test="$PackagingType='QC'">Üstü açılmaz alüminyum bidon</xsl:when>
			<xsl:when test="$PackagingType='QD'">Üstü açılır alüminyum bidon</xsl:when>
			<xsl:when test="$PackagingType='QF'">Üstü açılmaz plastik bidon</xsl:when>
			<xsl:when test="$PackagingType='QG'">Üstü açılır plastik bidon</xsl:when>
			<xsl:when test="$PackagingType='QH'">Ahşap tıkaçlı varil</xsl:when>
			<xsl:when test="$PackagingType='QJ'">Üstü açılır ahşap varil</xsl:when>
			<xsl:when test="$PackagingType='QK'">Üstü açılmaz beş galonluk çelik bidon</xsl:when>
			<xsl:when test="$PackagingType='QL'">Üstü açılır beş galonluk çelik bidon</xsl:when>
			<xsl:when test="$PackagingType='QM'">Üstü açılmaz beş galonluk plastik bidon</xsl:when>
			<xsl:when test="$PackagingType='QN'">Üstü açılır beş galonluk plastik bidon</xsl:when>
			<xsl:when test="$PackagingType='QP'">Doğal ahşap kutu</xsl:when>
			<xsl:when test="$PackagingType='QQ'">Emniyet duvarlı doğal ahşap kutu</xsl:when>
			<xsl:when test="$PackagingType='QR'">Genişletilmiş plastik kutu</xsl:when>
			<xsl:when test="$PackagingType='QS'">Yekpare plastik kutu</xsl:when>
			<xsl:when test="$PackagingType='RD'">Çubuk</xsl:when>
			<xsl:when test="$PackagingType='RG'">Halka</xsl:when>
			<xsl:when test="$PackagingType='RJ'">Raf, elbise askısı</xsl:when>
			<xsl:when test="$PackagingType='RK'">Raf</xsl:when>
			<xsl:when test="$PackagingType='RL'">Makara</xsl:when>
			<xsl:when test="$PackagingType='RO'">Rulo</xsl:when>
			<xsl:when test="$PackagingType='RZ'">Paket/grup çubuk</xsl:when>
			<xsl:when test="$PackagingType='SA'">Çuval</xsl:when>
			<xsl:when test="$PackagingType='SB'">Levha</xsl:when>
			<xsl:when test="$PackagingType='SC'">Sığ kasa</xsl:when>
			<xsl:when test="$PackagingType='SD'">İğ</xsl:when>
			<xsl:when test="$PackagingType='SE'">Deniz sandığı</xsl:when>
			<xsl:when test="$PackagingType='SH'">Kesecik</xsl:when>
			<xsl:when test="$PackagingType='SI'">Kızak</xsl:when>
			<xsl:when test="$PackagingType='SK'">İskelet kasa</xsl:when>
			<xsl:when test="$PackagingType='SL'">Taşıma paleti</xsl:when>
			<xsl:when test="$PackagingType='SM'">Sac</xsl:when>
			<xsl:when test="$PackagingType='SO'">Tel/kablo/iplik makarası</xsl:when>
			<xsl:when test="$PackagingType='SP'">Plastik levha</xsl:when>
			<xsl:when test="$PackagingType='SS'">Çelik kasa</xsl:when>
			<xsl:when test="$PackagingType='ST'">Yaprak</xsl:when>
			<xsl:when test="$PackagingType='SU'">Bavul</xsl:when>
			<xsl:when test="$PackagingType='SV'">Çelik zarf</xsl:when>
			<xsl:when test="$PackagingType='SW'">Vakumlu ambalaj</xsl:when>
			<xsl:when test="$PackagingType='SX'">Set</xsl:when>
			<xsl:when test="$PackagingType='SY'">Kılıf</xsl:when>
			<xsl:when test="$PackagingType='SZ'">Paket/grup yaprak</xsl:when>
			<xsl:when test="$PackagingType='T1'">Tablet</xsl:when>
			<xsl:when test="$PackagingType='TB'">Küvet</xsl:when>
			<xsl:when test="$PackagingType='TC'">Çay sandığı</xsl:when>
			<xsl:when test="$PackagingType='TD'">Sıkılabilir tüp</xsl:when>
			<xsl:when test="$PackagingType='TE'">Lastik</xsl:when>
			<xsl:when test="$PackagingType='TG'">Genel tank konteynerı</xsl:when>
			<xsl:when test="$PackagingType='TI'"/>
			<xsl:when test="$PackagingType='TK'">Dikdörtgen tank</xsl:when>
			<xsl:when test="$PackagingType='TN'">Teneke</xsl:when>
			<xsl:when test="$PackagingType='TO'">Şarap fıçısı</xsl:when>
			<xsl:when test="$PackagingType='TR'">Gövde</xsl:when>
			<xsl:when test="$PackagingType='TS'">Bağ</xsl:when>
			<xsl:when test="$PackagingType='TU'">Tüp</xsl:when>
			<xsl:when test="$PackagingType='TV'">Enjektörlü tüp</xsl:when>
			<xsl:when test="$PackagingType='TY'">Silindirik tank</xsl:when>
			<xsl:when test="$PackagingType='TZ'">Paket/grup tüpler</xsl:when>
			<xsl:when test="$PackagingType='UN'">Birim</xsl:when>
			<xsl:when test="$PackagingType='VG'">Dökme gaz</xsl:when>
			<xsl:when test="$PackagingType='VI'">Küçük şişe</xsl:when>
			<xsl:when test="$PackagingType='VL'">Dökme sıvı</xsl:when>
			<xsl:when test="$PackagingType='VO'">Dökme katı</xsl:when>
			<xsl:when test="$PackagingType='VP'">Vakumlu</xsl:when>
			<xsl:when test="$PackagingType='VQ'">Dökme sıvılaştırılmış gaz</xsl:when>
			<xsl:when test="$PackagingType='VN'">Araç</xsl:when>
			<xsl:when test="$PackagingType='VR'">Dökme katı granül</xsl:when>
			<xsl:when test="$PackagingType='VS'">Dökme metal hurda</xsl:when>
			<xsl:when test="$PackagingType='VY'">Dökme ince parçacıklar</xsl:when>
			<xsl:when test="$PackagingType='WA'">Ortaboy dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WB'">Hasırlı şişe</xsl:when>
			<xsl:when test="$PackagingType='WC'">Ortaboy çelik dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WD'">Ortaboy alüminyum dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WF'">Ortaboy metal dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WK'">Sıvılar için ortaboy çelik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WL'">Sıvılar için ortaboy alümünyum dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WM'">Sıvılar için ortaboy metal dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WN'">Ortaboy iç astarsız örme plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WR'">Ortaboy iç astarlı örme plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WS'">Ortaboy plastik film dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WT'">Ortaboy iç astarsız kumaş plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WU'">Ortaboy iç astarlı doğal ahşap dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WX'">Ortaboy iç astarlı kumaş dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WY'">Ortaboy iç astarlı kontraplak dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='WZ'">Ortaboy iç astarlı sunta dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='XA'">İç astarsız örme plastik torba</xsl:when>
			<xsl:when test="$PackagingType='XB'">Sızdırmaz örme plastik torba</xsl:when>
			<xsl:when test="$PackagingType='XC'">Su geçirmez örme plastik torba</xsl:when>
			<xsl:when test="$PackagingType='XD'">Plastik film torba</xsl:when>
			<xsl:when test="$PackagingType='XF'">İç astarsız kumaş torba</xsl:when>
			<xsl:when test="$PackagingType='XG'">Sızdırmaz kumaş torba</xsl:when>
			<xsl:when test="$PackagingType='XH'">Su geçirmez kumaş torba</xsl:when>
			<xsl:when test="$PackagingType='XJ'">Çok duvarlı kağıt torba</xsl:when>
			<xsl:when test="$PackagingType='XK'">Su geçirmez çok duvarlı kağıt torba</xsl:when>
			<xsl:when test="$PackagingType='YA'">Kompozit ambalaj, çelik bidon içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YB'">Kompozit ambalaj, çelik kasa içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YC'">Kompozit ambalaj, alüminyum bidon içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YD'">Kompozit ambalaj, alüminyum kasa içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YF'">Kompozit ambalaj, ahşap kutu içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YG'">Kompozit ambalaj, kontraplak bidon içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YH'">Kompozit ambalaj, kontraplak kasa içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YJ'">Kompozit ambalaj, elyaf bidon içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YK'">Kompozit ambalaj, elyaf levha kasa içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YL'">Kompozit ambalaj, plastik bidon içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YM'">Kompozit ambalaj, yekpare plastik kasa içindeki
				plastik kap</xsl:when>
			<xsl:when test="$PackagingType='YN'">Kompozit ambalaj, çelik bidon içindeki cam
				kap</xsl:when>
			<xsl:when test="$PackagingType='YP'">Kompozit ambalaj, elyaf levha kasa içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YQ'">Kompozit ambalaj, alüminyum bidon içindeki cam
				kap</xsl:when>
			<xsl:when test="$PackagingType='YR'">Kompozit ambalaj, alüminyum kasa içindeki plastik
				kap</xsl:when>
			<xsl:when test="$PackagingType='YS'">Kompozit ambalaj, ahşap kasa içindeki cam
				kap</xsl:when>
			<xsl:when test="$PackagingType='YT'">Kompozit ambalaj, kontraplak bidon içindeki cam
				kap</xsl:when>
			<xsl:when test="$PackagingType='YV'">Kompozit ambalaj, hasır sepet içindeki cam
				kap</xsl:when>
			<xsl:when test="$PackagingType='YW'">Kompozit ambalaj, elyaf bidon içindeki cam
				kap</xsl:when>
			<xsl:when test="$PackagingType='YX'">Kompozit ambalaj, elyaf levha kasa içindeki cam
				kap</xsl:when>
			<xsl:when test="$PackagingType='YY'">Kompozit ambalaj, genişleyebilir plastik paket
				içindeki cam kap</xsl:when>
			<xsl:when test="$PackagingType='YZ'">Kompozit ambalaj, yekpare plastik paket içindeki
				cam kap</xsl:when>
			<xsl:when test="$PackagingType='ZA'">Ortaboy çok duvarlı kağıt dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZB'">Büyük boy torba</xsl:when>
			<xsl:when test="$PackagingType='ZC'">Ortaboy çok duvarlı su geçirmez kağıt dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZL'">Ortaboy kompozit yekpare sert plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZM'">Ortaboy kompozit yekpare esnek plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZN'">Ortaboy kompozit sıkıştırılmış sert plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZP'">Ortaboy kompozit sıkıştırılmış esnek plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZQ'">Sıvılar için ortaboy kompozit sert plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZR'">Sıvılar için ortaboy kompozit esnek plastik dolum
				konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZS'">Ortaboy kompozit dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZT'">Ortaboy elyaf levha dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZU'">Ortaboy esnek dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZW'">Ortaboy doğal ahşap dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZX'">Ortaboy kontraplak dolum konteynerı</xsl:when>
			<xsl:when test="$PackagingType='ZY'">Ortaboy sunta dolum konteynerı</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$PackagingType"/>
			</xsl:otherwise>
		</xsl:choose>
	</xsl:template>
	<xsl:template name="Country">
		<xsl:param name="CountryType" />
		<xsl:choose>
			<xsl:when test="$CountryType='AF'">Afganistan</xsl:when>
			<xsl:when test="$CountryType='DE'">Almanya</xsl:when>
			<xsl:when test="$CountryType='AD'">Andorra</xsl:when>
			<xsl:when test="$CountryType='AO'">Angola</xsl:when>
			<xsl:when test="$CountryType='AG'">Antigua ve Barbuda</xsl:when>
			<xsl:when test="$CountryType='AR'">Arjantin</xsl:when>
			<xsl:when test="$CountryType='AL'">Arnavutluk</xsl:when>
			<xsl:when test="$CountryType='AW'">Aruba</xsl:when>
			<xsl:when test="$CountryType='AU'">Avustralya</xsl:when>
			<xsl:when test="$CountryType='AT'">Avusturya</xsl:when>
			<xsl:when test="$CountryType='AZ'">Azerbaycan</xsl:when>
			<xsl:when test="$CountryType='BS'">Bahamalar</xsl:when>
			<xsl:when test="$CountryType='BH'">Bahreyn</xsl:when>
			<xsl:when test="$CountryType='BD'">Bangladeş</xsl:when>
			<xsl:when test="$CountryType='BB'">Barbados</xsl:when>
			<xsl:when test="$CountryType='EH'">Batı Sahra (MA)</xsl:when>
			<xsl:when test="$CountryType='BE'">Belçika</xsl:when>
			<xsl:when test="$CountryType='BZ'">Belize</xsl:when>
			<xsl:when test="$CountryType='BJ'">Benin</xsl:when>
			<xsl:when test="$CountryType='BM'">Bermuda</xsl:when>
			<xsl:when test="$CountryType='BY'">Beyaz Rusya</xsl:when>
			<xsl:when test="$CountryType='BT'">Bhutan</xsl:when>
			<xsl:when test="$CountryType='AE'">Birleşik Arap Emirlikleri</xsl:when>
			<xsl:when test="$CountryType='US'">Birleşik Devletler</xsl:when>
			<xsl:when test="$CountryType='GB'">Birleşik Krallık</xsl:when>
			<xsl:when test="$CountryType='BO'">Bolivya</xsl:when>
			<xsl:when test="$CountryType='BA'">Bosna-Hersek</xsl:when>
			<xsl:when test="$CountryType='BW'">Botsvana</xsl:when>
			<xsl:when test="$CountryType='BR'">Brezilya</xsl:when>
			<xsl:when test="$CountryType='BN'">Bruney</xsl:when>
			<xsl:when test="$CountryType='BG'">Bulgaristan</xsl:when>
			<xsl:when test="$CountryType='BF'">Burkina Faso</xsl:when>
			<xsl:when test="$CountryType='BI'">Burundi</xsl:when>
			<xsl:when test="$CountryType='TD'">Çad</xsl:when>
			<xsl:when test="$CountryType='KY'">Cayman Adaları</xsl:when>
			<xsl:when test="$CountryType='GI'">Cebelitarık (GB)</xsl:when>
			<xsl:when test="$CountryType='CZ'">Çek Cumhuriyeti</xsl:when>
			<xsl:when test="$CountryType='DZ'">Cezayir</xsl:when>
			<xsl:when test="$CountryType='DJ'">Cibuti</xsl:when>
			<xsl:when test="$CountryType='CN'">Çin</xsl:when>
			<xsl:when test="$CountryType='DK'">Danimarka</xsl:when>
			<xsl:when test="$CountryType='CD'">Demokratik Kongo Cumhuriyeti</xsl:when>
			<xsl:when test="$CountryType='TL'">Doğu Timor</xsl:when>
			<xsl:when test="$CountryType='DO'">Dominik Cumhuriyeti</xsl:when>
			<xsl:when test="$CountryType='DM'">Dominika</xsl:when>
			<xsl:when test="$CountryType='EC'">Ekvador</xsl:when>
			<xsl:when test="$CountryType='GQ'">Ekvator Ginesi</xsl:when>
			<xsl:when test="$CountryType='SV'">El Salvador</xsl:when>
			<xsl:when test="$CountryType='ID'">Endonezya</xsl:when>
			<xsl:when test="$CountryType='ER'">Eritre</xsl:when>
			<xsl:when test="$CountryType='AM'">Ermenistan</xsl:when>
			<xsl:when test="$CountryType='MF'">Ermiş Martin (FR)</xsl:when>
			<xsl:when test="$CountryType='EE'">Estonya</xsl:when>
			<xsl:when test="$CountryType='ET'">Etiyopya</xsl:when>
			<xsl:when test="$CountryType='FK'">Falkland Adaları</xsl:when>
			<xsl:when test="$CountryType='FO'">Faroe Adaları (DK)</xsl:when>
			<xsl:when test="$CountryType='MA'">Fas</xsl:when>
			<xsl:when test="$CountryType='FJ'">Fiji</xsl:when>
			<xsl:when test="$CountryType='CI'">Fildişi Sahili</xsl:when>
			<xsl:when test="$CountryType='PH'">Filipinler</xsl:when>
			<xsl:when test="$CountryType='FI'">Finlandiya</xsl:when>
			<xsl:when test="$CountryType='FR'">Fransa</xsl:when>
			<xsl:when test="$CountryType='GF'">Fransız Guyanası (FR)</xsl:when>
			<xsl:when test="$CountryType='PF'">Fransız Polinezyası (FR)</xsl:when>
			<xsl:when test="$CountryType='GA'">Gabon</xsl:when>
			<xsl:when test="$CountryType='GM'">Gambiya</xsl:when>
			<xsl:when test="$CountryType='GH'">Gana</xsl:when>
			<xsl:when test="$CountryType='GN'">Gine</xsl:when>
			<xsl:when test="$CountryType='GW'">Gine Bissau</xsl:when>
			<xsl:when test="$CountryType='GD'">Grenada</xsl:when>
			<xsl:when test="$CountryType='GL'">Grönland (DK)</xsl:when>
			<xsl:when test="$CountryType='GP'">Guadeloupe (FR)</xsl:when>
			<xsl:when test="$CountryType='GT'">Guatemala</xsl:when>
			<xsl:when test="$CountryType='GG'">Guernsey (GB)</xsl:when>
			<xsl:when test="$CountryType='ZA'">Güney Afrika</xsl:when>
			<xsl:when test="$CountryType='KR'">Güney Kore</xsl:when>
			<xsl:when test="$CountryType='GE'">Gürcistan</xsl:when>
			<xsl:when test="$CountryType='GY'">Guyana</xsl:when>
			<xsl:when test="$CountryType='HT'">Haiti</xsl:when>
			<xsl:when test="$CountryType='IN'">Hindistan</xsl:when>
			<xsl:when test="$CountryType='HR'">Hırvatistan</xsl:when>
			<xsl:when test="$CountryType='NL'">Hollanda</xsl:when>
			<xsl:when test="$CountryType='HN'">Honduras</xsl:when>
			<xsl:when test="$CountryType='HK'">Hong Kong (CN)</xsl:when>
			<xsl:when test="$CountryType='VG'">İngiliz Virjin Adaları</xsl:when>
			<xsl:when test="$CountryType='IQ'">Irak</xsl:when>
			<xsl:when test="$CountryType='IR'">İran</xsl:when>
			<xsl:when test="$CountryType='IE'">İrlanda</xsl:when>
			<xsl:when test="$CountryType='ES'">İspanya</xsl:when>
			<xsl:when test="$CountryType='IL'">İsrail</xsl:when>
			<xsl:when test="$CountryType='SE'">İsveç</xsl:when>
			<xsl:when test="$CountryType='CH'">İsviçre</xsl:when>
			<xsl:when test="$CountryType='IT'">İtalya</xsl:when>
			<xsl:when test="$CountryType='IS'">İzlanda</xsl:when>
			<xsl:when test="$CountryType='JM'">Jamaika</xsl:when>
			<xsl:when test="$CountryType='JP'">Japonya</xsl:when>
			<xsl:when test="$CountryType='JE'">Jersey (GB)</xsl:when>
			<xsl:when test="$CountryType='KH'">Kamboçya</xsl:when>
			<xsl:when test="$CountryType='CM'">Kamerun</xsl:when>
			<xsl:when test="$CountryType='CA'">Kanada</xsl:when>
			<xsl:when test="$CountryType='ME'">Karadağ</xsl:when>
			<xsl:when test="$CountryType='QA'">Katar</xsl:when>
			<xsl:when test="$CountryType='KZ'">Kazakistan</xsl:when>
			<xsl:when test="$CountryType='KE'">Kenya</xsl:when>
			<xsl:when test="$CountryType='CY'">Kıbrıs</xsl:when>
			<xsl:when test="$CountryType='KG'">Kırgızistan</xsl:when>
			<xsl:when test="$CountryType='KI'">Kiribati</xsl:when>
			<xsl:when test="$CountryType='CO'">Kolombiya</xsl:when>
			<xsl:when test="$CountryType='KM'">Komorlar</xsl:when>
			<xsl:when test="$CountryType='CG'">Kongo Cumhuriyeti</xsl:when>
			<xsl:when test="$CountryType='KV'">Kosova (RS)</xsl:when>
			<xsl:when test="$CountryType='CR'">Kosta Rika</xsl:when>
			<xsl:when test="$CountryType='CU'">Küba</xsl:when>
			<xsl:when test="$CountryType='KW'">Kuveyt</xsl:when>
			<xsl:when test="$CountryType='KP'">Kuzey Kore</xsl:when>
			<xsl:when test="$CountryType='LA'">Laos</xsl:when>
			<xsl:when test="$CountryType='LS'">Lesoto</xsl:when>
			<xsl:when test="$CountryType='LV'">Letonya</xsl:when>
			<xsl:when test="$CountryType='LR'">Liberya</xsl:when>
			<xsl:when test="$CountryType='LY'">Libya</xsl:when>
			<xsl:when test="$CountryType='LI'">Lihtenştayn</xsl:when>
			<xsl:when test="$CountryType='LT'">Litvanya</xsl:when>
			<xsl:when test="$CountryType='LB'">Lübnan</xsl:when>
			<xsl:when test="$CountryType='LU'">Lüksemburg</xsl:when>
			<xsl:when test="$CountryType='HU'">Macaristan</xsl:when>
			<xsl:when test="$CountryType='MG'">Madagaskar</xsl:when>
			<xsl:when test="$CountryType='MO'">Makao (CN)</xsl:when>
			<xsl:when test="$CountryType='MK'">Makedonya</xsl:when>
			<xsl:when test="$CountryType='MW'">Malavi</xsl:when>
			<xsl:when test="$CountryType='MV'">Maldivler</xsl:when>
			<xsl:when test="$CountryType='MY'">Malezya</xsl:when>
			<xsl:when test="$CountryType='ML'">Mali</xsl:when>
			<xsl:when test="$CountryType='MT'">Malta</xsl:when>
			<xsl:when test="$CountryType='IM'">Man Adası (GB)</xsl:when>
			<xsl:when test="$CountryType='MH'">Marshall Adaları</xsl:when>
			<xsl:when test="$CountryType='MQ'">Martinique (FR)</xsl:when>
			<xsl:when test="$CountryType='MU'">Mauritius</xsl:when>
			<xsl:when test="$CountryType='YT'">Mayotte (FR)</xsl:when>
			<xsl:when test="$CountryType='MX'">Meksika</xsl:when>
			<xsl:when test="$CountryType='FM'">Mikronezya</xsl:when>
			<xsl:when test="$CountryType='EG'">Mısır</xsl:when>
			<xsl:when test="$CountryType='MN'">Moğolistan</xsl:when>
			<xsl:when test="$CountryType='MD'">Moldova</xsl:when>
			<xsl:when test="$CountryType='MC'">Monako</xsl:when>
			<xsl:when test="$CountryType='MR'">Moritanya</xsl:when>
			<xsl:when test="$CountryType='MZ'">Mozambik</xsl:when>
			<xsl:when test="$CountryType='MM'">Myanmar</xsl:when>
			<xsl:when test="$CountryType='NA'">Namibya</xsl:when>
			<xsl:when test="$CountryType='NR'">Nauru</xsl:when>
			<xsl:when test="$CountryType='NP'">Nepal</xsl:when>
			<xsl:when test="$CountryType='NE'">Nijer</xsl:when>
			<xsl:when test="$CountryType='NG'">Nijerya</xsl:when>
			<xsl:when test="$CountryType='NI'">Nikaragua</xsl:when>
			<xsl:when test="$CountryType='NO'">Norveç</xsl:when>
			<xsl:when test="$CountryType='CF'">Orta Afrika Cumhuriyeti</xsl:when>
			<xsl:when test="$CountryType='UZ'">Özbekistan</xsl:when>
			<xsl:when test="$CountryType='PK'">Pakistan</xsl:when>
			<xsl:when test="$CountryType='PW'">Palau</xsl:when>
			<xsl:when test="$CountryType='PA'">Panama</xsl:when>
			<xsl:when test="$CountryType='PG'">Papua Yeni Gine</xsl:when>
			<xsl:when test="$CountryType='PY'">Paraguay</xsl:when>
			<xsl:when test="$CountryType='PE'">Peru</xsl:when>
			<xsl:when test="$CountryType='PL'">Polonya</xsl:when>
			<xsl:when test="$CountryType='PT'">Portekiz</xsl:when>
			<xsl:when test="$CountryType='PR'">Porto Riko (US)</xsl:when>
			<xsl:when test="$CountryType='RE'">Réunion (FR)</xsl:when>
			<xsl:when test="$CountryType='RO'">Romanya</xsl:when>
			<xsl:when test="$CountryType='RW'">Ruanda</xsl:when>
			<xsl:when test="$CountryType='RU'">Rusya</xsl:when>
			<xsl:when test="$CountryType='BL'">Saint Barthélemy (FR)</xsl:when>
			<xsl:when test="$CountryType='KN'">Saint Kitts ve Nevis</xsl:when>
			<xsl:when test="$CountryType='LC'">Saint Lucia</xsl:when>
			<xsl:when test="$CountryType='PM'">Saint Pierre ve Miquelon (FR)</xsl:when>
			<xsl:when test="$CountryType='VC'">Saint Vincent ve Grenadinler</xsl:when>
			<xsl:when test="$CountryType='WS'">Samoa</xsl:when>
			<xsl:when test="$CountryType='SM'">San Marino</xsl:when>
			<xsl:when test="$CountryType='ST'">São Tomé ve Príncipe</xsl:when>
			<xsl:when test="$CountryType='SN'">Senegal</xsl:when>
			<xsl:when test="$CountryType='SC'">Seyşeller</xsl:when>
			<xsl:when test="$CountryType='SL'">Sierra Leone</xsl:when>
			<xsl:when test="$CountryType='CL'">Şili</xsl:when>
			<xsl:when test="$CountryType='SG'">Singapur</xsl:when>
			<xsl:when test="$CountryType='RS'">Sırbistan</xsl:when>
			<xsl:when test="$CountryType='SK'">Slovakya Cumhuriyeti</xsl:when>
			<xsl:when test="$CountryType='SI'">Slovenya</xsl:when>
			<xsl:when test="$CountryType='SB'">Solomon Adaları</xsl:when>
			<xsl:when test="$CountryType='SO'">Somali</xsl:when>
			<xsl:when test="$CountryType='SS'">South Sudan</xsl:when>
			<xsl:when test="$CountryType='SJ'">Spitsbergen (NO)</xsl:when>
			<xsl:when test="$CountryType='LK'">Sri Lanka</xsl:when>
			<xsl:when test="$CountryType='SD'">Sudan</xsl:when>
			<xsl:when test="$CountryType='SR'">Surinam</xsl:when>
			<xsl:when test="$CountryType='SY'">Suriye</xsl:when>
			<xsl:when test="$CountryType='SA'">Suudi Arabistan</xsl:when>
			<xsl:when test="$CountryType='SZ'">Svaziland</xsl:when>
			<xsl:when test="$CountryType='TJ'">Tacikistan</xsl:when>
			<xsl:when test="$CountryType='TZ'">Tanzanya</xsl:when>
			<xsl:when test="$CountryType='TH'">Tayland</xsl:when>
			<xsl:when test="$CountryType='TW'">Tayvan</xsl:when>
			<xsl:when test="$CountryType='TG'">Togo</xsl:when>
			<xsl:when test="$CountryType='TO'">Tonga</xsl:when>
			<xsl:when test="$CountryType='TT'">Trinidad ve Tobago</xsl:when>
			<xsl:when test="$CountryType='TN'">Tunus</xsl:when>
			<xsl:when test="$CountryType='TR'">Türkiye</xsl:when>
			<xsl:when test="$CountryType='TM'">Türkmenistan</xsl:when>
			<xsl:when test="$CountryType='TC'">Turks ve Caicos</xsl:when>
			<xsl:when test="$CountryType='TV'">Tuvalu</xsl:when>
			<xsl:when test="$CountryType='UG'">Uganda</xsl:when>
			<xsl:when test="$CountryType='UA'">Ukrayna</xsl:when>
			<xsl:when test="$CountryType='OM'">Umman</xsl:when>
			<xsl:when test="$CountryType='JO'">Ürdün</xsl:when>
			<xsl:when test="$CountryType='UY'">Uruguay</xsl:when>
			<xsl:when test="$CountryType='VU'">Vanuatu</xsl:when>
			<xsl:when test="$CountryType='VA'">Vatikan</xsl:when>
			<xsl:when test="$CountryType='VE'">Venezuela</xsl:when>
			<xsl:when test="$CountryType='VN'">Vietnam</xsl:when>
			<xsl:when test="$CountryType='WF'">Wallis ve Futuna (FR)</xsl:when>
			<xsl:when test="$CountryType='YE'">Yemen</xsl:when>
			<xsl:when test="$CountryType='NC'">Yeni Kaledonya (FR)</xsl:when>
			<xsl:when test="$CountryType='NZ'">Yeni Zelanda</xsl:when>
			<xsl:when test="$CountryType='CV'">Yeşil Burun Adaları</xsl:when>
			<xsl:when test="$CountryType='GR'">Yunanistan</xsl:when>
			<xsl:when test="$CountryType='ZM'">Zambiya</xsl:when>
			<xsl:when test="$CountryType='ZW'">Zimbabve</xsl:when>
			<xsl:otherwise>
				<xsl:value-of select="$CountryType"/>
			</xsl:otherwise>
		</xsl:choose>

	</xsl:template>
	<xsl:template name='Party_Other'>
		<xsl:param name="PartyType" />
		<xsl:for-each select="cbc:WebsiteURI">
			<tr align="left">
				<td>
					<xsl:text>Web Sitesi: </xsl:text>
					<xsl:value-of select="."/>
				</td>
			</tr>
		</xsl:for-each>
		<xsl:for-each select="cac:Contact/cbc:ElectronicMail">
			<tr align="left">
				<td>
					<xsl:text>E-Posta: </xsl:text>
					<xsl:value-of select="."/>
				</td>
			</tr>
		</xsl:for-each>
		<xsl:for-each select="cac:Contact">
			<xsl:if test="cbc:Telephone or cbc:Telefax">
				<tr align="left">
					<td style="width:469px; " align="left">
						<xsl:for-each select="cbc:Telephone">
							<xsl:text>Tel: </xsl:text>
							<xsl:apply-templates/>
						</xsl:for-each>
						<xsl:for-each select="cbc:Telefax">
							<xsl:text> Fax: </xsl:text>
							<xsl:apply-templates/>
						</xsl:for-each>
						<xsl:text>&#160;</xsl:text>
					</td>
				</tr>
			</xsl:if>
		</xsl:for-each>
		<xsl:if test="$PartyType!='TAXFREE' and not(starts-with($PartyType, 'EXPORT'))">
			<xsl:for-each select="cac:PartyTaxScheme/cac:TaxScheme/cbc:Name">
				<tr align="left">
					<td>
						<xsl:text>Vergi Dairesi: </xsl:text>
						<xsl:apply-templates/>
					</td>
				</tr>
			</xsl:for-each>
			<xsl:for-each select="cac:PartyIdentification">
				<tr align="left">
					<td>
						<xsl:value-of select="cbc:ID/@schemeID"/>
						<xsl:text>: </xsl:text>
						<xsl:value-of select="cbc:ID"/>
					</td>
				</tr>
			</xsl:for-each>
			<xsl:for-each select="cac:AgentParty/cac:PartyIdentification">
				<tr align="left">
					<td>
						<xsl:value-of select="cbc:ID/@schemeID"/>
						<xsl:text>: </xsl:text>
						<xsl:value-of select="cbc:ID"/>
					</td>
				</tr>
			</xsl:for-each>
		</xsl:if>
	</xsl:template>
	<xsl:template name="Curr_Type">
		<xsl:value-of select="format-number(., '###.##0,00', 'european')"/>
		<xsl:if	test="@currencyID">
			<xsl:text> </xsl:text>
			<xsl:choose>
				<xsl:when test="@currencyID = 'TRL' or @currencyID = 'TRY'">
					<xsl:text>TL</xsl:text>
				</xsl:when>
				<xsl:otherwise>
					<xsl:value-of select="@currencyID"/>
				</xsl:otherwise>
			</xsl:choose>
		</xsl:if>
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

