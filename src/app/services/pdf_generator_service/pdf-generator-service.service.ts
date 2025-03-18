import { Injectable } from '@angular/core';
import { PDFDocument, rgb, StandardFonts, PDFPage } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PdfGeneratorServiceService {
  // Page dimensions for Letter size (612 x 792 points)
  private pageWidth = 612;
  private pageHeight = 792;
  private marginLeft = 50;
  private marginBottom = 50;
  private lineSpacing = 15;
  private fontSize = 12;

  // Starting y-coordinate (top margin)
  private startY = this.pageHeight - 50;

  private currentPage?: PDFPage;
  private currentY: number = 1;

  constructor() {}

  // Checks if the current y-coordinate is below the bottom margin.
  // If yes, adds a new page and resets the y position.
  private checkNewPage(pdfDoc: PDFDocument): void {
    if (this.currentY < this.marginBottom) {
      this.currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
      this.currentY = this.pageHeight - 50;
    }
  }

  async generatePDF(data: any) {
    // Create a new PDF document
    const pdfDoc = await PDFDocument.create();
    this.currentPage = pdfDoc.addPage([this.pageWidth, this.pageHeight]);
    this.currentY = this.startY;

    // Embed the Times Roman font
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);

    // --- Draw Content Lines Using page.drawText ---
    // Line 1
    this.currentPage.drawText('____________________________________________', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // Line 2
    this.currentPage.drawText('_________________________ and _________________________, both of Frisco,', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // Line 3
    this.currentPage.drawText('Denton County, Texas, as Settlors, hereby enter into this TRUST AGREEMENT with', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // Line 4
    this.currentPage.drawText('_________________________ and _________________________, as Co-Trustees (collectively', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // Line 5
    this.currentPage.drawText('referred to herein as “Trustee”), on this the [day|req|signer1] day of [month|req|signer1 ], 2025.', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing + 5;
    this.checkNewPage(pdfDoc);

    // Line 6
    this.currentPage.drawText('WITNESSETH:', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // Line 7
    this.currentPage.drawText('ARTICLE 1.', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // Line 8
    this.currentPage.drawText('Recitals/Definitions', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // Continue adding additional lines as needed...
    // For demonstration, adding a few more lines:

    // Line 9
    this.currentPage.drawText('1.1 This Trust will be known as the “______________________________________,”', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // Line 10
    this.currentPage.drawText('a revocable trust which will become irrevocable upon the death of the Surviving Settlor.', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing + 5;
    this.checkNewPage(pdfDoc);

    // ... (Continue drawing all remaining lines similarly)

    // Example final lines (adjust as needed):
    this.currentPage.drawText('2.8 A Settlor may use and occupy any property that qualifies for exemption as such', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    this.currentPage.drawText('Settlor\'s residence homestead as such Settlor\'s principal residence at no cost to either Settlor until', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    this.currentPage.drawText('the date of such Settlor\'s death or the date of revocation or termination of the Trust, whichever is', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    this.currentPage.drawText('earlier.', {
      x: this.marginLeft,
      y: this.currentY,
      size: this.fontSize,
      font,
      color: rgb(0, 0, 0)
    });
    this.currentY -= this.lineSpacing;
    this.checkNewPage(pdfDoc);

    // --- End Content ---

    // Now, add page numbers at the bottom left on each page.
    const pages = pdfDoc.getPages();
    const totalPages = pages.length;
    pages.forEach((page, idx) => {
      page.drawText(`Page ${idx + 1} of ${totalPages}`, {
        x: this.marginLeft, // left bottom side
        y: 30,             // adjust y-position as needed
        size: 10,
        font,
        color: rgb(0, 0, 0)
      });
    });

    // Save and download the PDF
    const pdfBytes = await pdfDoc.save();
    this.downloadPDF(pdfBytes);
  }

  downloadPDF(pdfBytes: Uint8Array) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Trust_Agreement.pdf';
    a.click();
    URL.revokeObjectURL(url);
  }
}
