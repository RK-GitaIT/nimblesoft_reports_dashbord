import { PDFDocument, rgb, StandardFonts } from "pdf-lib";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})
export class Revocable_living_trust_execution_instructions {
    constructor() {}

    async generateWillPDF(ClientData: any) {
        const pdfDoc = await PDFDocument.create();
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const regularFont = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const italicFont = await pdfDoc.embedFont(StandardFonts.HelveticaOblique);
        const boldItalicFont = await pdfDoc.embedFont(StandardFonts.HelveticaBoldOblique);

        const fontSizeTitle = 18;
        const fontSizeSubTitle = 14;
        const fontSizeText = 10;
        const fontSizeSmallText = 10;
        const lineSpacing = 10; // Increased line spacing
        const paragraphSpacing = fontSizeText + 10; // Adjusted spacing for better readability
        const margin = 40;

        // Function to draw text with spacing adjustments
        const drawTextWithSpacing = (page: any, text: string, x: number, y: number, font: any, size: number, spacing: number) => {
            const textHeight = size + 4;
            page.drawText(text, { x, y, size, font, color: rgb(0, 0, 0), maxWidth: 512, lineHeight: 20 });
            return y - (spacing + textHeight);
        };

        const page1 = pdfDoc.addPage([612, 792]);
        const { width, height } = page1.getSize();
        let y = height - margin;

        y = drawTextWithSpacing(page1, 'GIATIT™', width - 120, y, boldFont, 24, paragraphSpacing);
        y = drawTextWithSpacing(page1, "Understanding Your Joint Revocable Living Trust", margin, y, boldFont, fontSizeTitle, paragraphSpacing);
        y = drawTextWithSpacing(page1, "Your Joint Revocable Living Trust is the document that provides for the disposition of any assets it owns or receives at or pursuant to your deaths to your intended beneficiaries.", margin, y, regularFont, fontSizeText, paragraphSpacing);
        y = drawTextWithSpacing(page1, "Review Your Joint Revocable Living Trust:", margin, y, boldFont, fontSizeText, lineSpacing);
        y = drawTextWithSpacing(page1, "It is very important to review your Joint Revocable Living Trust to ensure it accurately reflects your wishes before signing the document. If you need to modify the document, simply access the SmartGuide to create a new or modified Joint Revocable LivingTrust. ", margin, y, regularFont, fontSizeText, paragraphSpacing);
        y-=20
        y = drawTextWithSpacing(page1, "You have prepared both Last Wills and Testaments AND a Joint Revocable Living Trust. You MUST sign the Joint Revocable Living Trust before you sign your Wills.", margin, y, regularFont, fontSizeText, paragraphSpacing);
        y = drawTextWithSpacing(page1, "Making your Joint Revocable Living Trust Official", margin, y, boldFont, fontSizeSubTitle, paragraphSpacing);
        y = drawTextWithSpacing(page1, "Necessary parties:", margin, y, boldFont, fontSizeText, lineSpacing);
        y = drawTextWithSpacing(page1, "- Both of you", margin, y, regularFont, fontSizeText, lineSpacing);
        y = drawTextWithSpacing(page1, "- A notary public", margin, y, regularFont, fontSizeText, paragraphSpacing);
        y -=-1
        y = drawTextWithSpacing(page1, "Instructions:", margin, y, boldFont, fontSizeText, paragraphSpacing);
        
        const instructions = [
            "Gather the above parties within sight and hearing of one another.",
            "If all of the following statements are true, tell the notary that you have read and are familiar with all of the Trust’s provisions, that you are over 18 years of age, of sound mind, and under no constraint or undue influence.",
            "Fill in the day and month on the first page of the Revocable Living Trust (the date should be the date you are executing your document). Example:"
        ];

        y -=-5
        instructions.forEach((text, index) => {
            y = drawTextWithSpacing(page1, `${index + 1}. ${text}`, margin, y, regularFont, fontSizeText, paragraphSpacing);
        });

        // Usage in your PDF
        const trusteeName = ClientData.Trustee_name_1 || "_____________________";
        const date = ClientData.Date || "______";
        
        const drawMixedText = (page: any, parts: { text: string; font: any }[], x: number, y: number, size: number) => {
            let offsetX = x;
            let currentY = y;
            parts.forEach(({ text, font }) => {
                const textWidth = font.widthOfTextAtSize(text, size);
                if (offsetX + textWidth > maxWidth) {
                    offsetX = x;  // Reset X position
                    currentY -= size + 5 ;  // Move to the next line
                }
                page.drawText(text, { x: offsetX, y:currentY, size, font, color: rgb(0, 0, 0) });
                offsetX += textWidth + 2; // Adjust spacing slightly
            });
            return currentY - (size + 4); // Adjust line spacing
        };
        
        // Define the text with mixed formatting
        const textSegments = [
            { text: trusteeName, font: boldFont }, // Bold dynamic trustee name
            { text: " and ", font: italicFont },
            { text: trusteeName, font: boldFont }, // Bold dynamic trustee name
            { text: ", both of Frisco, Denton County, Texas, as Settlors, hereby enter into this TRUST AGREEMENT with ", font: italicFont },
            { text: trusteeName, font: boldFont }, // Bold dynamic trustee name
            { text: " and ", font: italicFont },
            { text: trusteeName, font: boldFont }, // Bold dynamic trustee name
            { text: ", as Co-Trustees (collectively referred to herein as ‘Trustee’), on this the ", font: italicFont },
            { text: date, font: boldFont }, // Bold dynamic date
            { text: " day of _______________, 2025.", font: italicFont }
        ];

        const maxWidth = 548;

        // Draw text with mixed formatting
        y = drawMixedText(page1, textSegments, margin, y, fontSizeText);

        y -=-1
        const additionalSteps = [
            "Sign the Joint Revocable Living Trust where indicated, and have the notary read and complete the notary block, sign and seal.",
            "Funding of the Trust: If you want to use the Trust to allow certain assets to avoid being subject to the probate process, then you will want to transfer such assets to the Trust during your lifetime.",
            "Once your Trust has been executed, scan and upload the document to your vault."
        ];

        additionalSteps.forEach((text, index) => {
            y = drawTextWithSpacing(page1, `${index + 4}. ${text}`, margin, y, regularFont, fontSizeText, paragraphSpacing + 5); // Added extra spacing
        });

        y = drawTextWithSpacing(page1, "NOTE: A Certificate of Trust is provided for your Joint Revocable Living Trust. The Certificate provides evidence of the existence of the Trust and its funding. Banks or other financial institutions may require a copy of it for opening or transferring accounts. County Clerks may require it upon transfer of real property to the Trust.", margin, y, italicFont, fontSizeSmallText, paragraphSpacing);

        const page2 = pdfDoc.addPage([612, 792]);
        let y2 = height - margin;

        y2 = drawTextWithSpacing(page2, 'GIATIT™', width - 120, y2, boldFont, 24, paragraphSpacing);
        y2 = drawTextWithSpacing(page2, "Sign the Certificate of Trust immediately after you sign and initially fund your Joint Revocable Living Trust, but keep in mind that you generally will have to sign a new Certificate of Trust whenever real property is transferred to or from your Joint Revocable Living Trust.", margin, y2, regularFont, fontSizeText, paragraphSpacing);

        const pdfBytes = await pdfDoc.save();
        this.downloadPDF(pdfBytes, "Revocable_Living_Trust.pdf");
    }

    private downloadPDF(pdfBytes: Uint8Array, fileName: string) {
        const blob = new Blob([pdfBytes], { type: "application/pdf" });
        const link = document.createElement("a");
        link.href = window.URL.createObjectURL(blob);
        link.download = fileName;
        link.click();
    }
}