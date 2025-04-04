import { PDFDocument, rgb, StandardFonts} from "pdf-lib";
import { Injectable } from "@angular/core";

@Injectable({
    providedIn: 'root',
})

export class  last_Will_Testament_Execution_Instructions {

    constructor(){}
    
      async generatePDF() {
        const pdfDoc = await PDFDocument.create();
        const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
        const titleFontSize = 25;
        const headingFontSize = 14;
        const fontSize = 10;
        const textFontSize = 11;
        const companyNameX = 450;
        const companyNameY = 750;
    
        // Add Page 1
        const page1 = pdfDoc.addPage([600, 800]);
        let y = companyNameY;
    
        // Title (Company Name)
        page1.drawText('GITAIT™', { x: companyNameX, y, size: titleFontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= 50;
    
        // Main Heading
        page1.drawText('Understanding Your Last Will & Testament', { x: 50, y, size: headingFontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= 25;
    
        // Intro Paragraph
        const introText = 'Your Last Will and Testament is the document that allows you to direct how you want your property/assets distributed at your death and who will be in charge of ensuring your wishes are carried out – your Executor. Your Last Will and Testament also states your preference for the appointment of a guardian for your minor children, if applicable.';
        y = this.addWrappedText(page1, introText, 50, y, font, textFontSize, 500);
        y -= 30;
    
        // Section Heading
        page1.drawText('A typical Will includes the following provisions:', { x: 50, y, size: textFontSize, font, color: rgb(0, 0, 0) });
        y -= 30;
    
        // Two Column Bullet List
        const leftColumn = [
          '•  Payment of debts',
          '•  Specific bequests (optional)',
          '•  Distribution of remaining tangible personal property',
          '•  Distribution of residuary estate',
          '•  Distribution if everyone you named as ',
         '    a beneficiary is deceased (“Ultimate ',
         '    Disposition”)'
        ];
    
        const rightColumn = [
          '•  Naming of Executor',
          '•  Naming of Guardian for minor children, if applicable',
          '•  If you are married, how to handle',
          '   simultaneous death of both you',
          '   and your spouse',
          '•  Payment of taxes',
          '•  Miscellaneous provisions'
        ];
    
       // Fix: Adjust right column alignment based on left column's height
       let leftColumnEndY = this.addBulletPoints(page1, leftColumn, 50, y, font, textFontSize);
       let rightColumnEndY = this.addBulletPoints(page1, rightColumn, 320, y, font, textFontSize);
       y = Math.min(leftColumnEndY, rightColumnEndY) - 20;
    
        // Review Section Heading
        page1.drawText('Review Your Last Will and Testament:', { x: 50, y, size: fontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= 20;
    
        const reviewText = 'It is very important to review your Last Will and Testament to ensure it accurately reflects your wishes before making the document official. If you need to modify the document, simply access the SmartGuide to create a new or modified Last Will and Testament.';
        y = this.addWrappedText(page1, reviewText, 50, y, font, textFontSize, 500);
        y -= 30;
    
        // Second Screenshot Content (Same Page)
        page1.drawText('Making your Last Will and Testament Official', { x: 50, y, size: headingFontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= 28;
    
        // Necessary Parties
        page1.drawText('Necessary parties:', { x: 50, y, size: textFontSize, font: boldFont, color: rgb(0, 0, 0) });
        page1.drawText('You', { x: 150, y, size: textFontSize, font, color: rgb(0, 0, 0) });
        y -= 15;
        page1.drawText('Two independent witnesses', { x: 150, y, size: textFontSize, font, color: rgb(0, 0, 0) });
        y -= 15;
        page1.drawText('A notary public', { x: 150, y, size: textFontSize, font, color: rgb(0, 0, 0) });
        y -= 25;

       // Tip Box Above and Right Side of "Making your Last Will and Testament Official"
       const tipBoxWidth = 200;
       const tipBoxHeight = 80;
       const tipBoxX = 390;
       const tipBoxY = y + 85;
   
       // Draw Tip Box Background (Light Gray)
       page1.drawRectangle({
           x: tipBoxX,
           y: tipBoxY - tipBoxHeight,
           width: tipBoxWidth,
           height: tipBoxHeight,
           color: rgb(0.9, 0.9, 0.9),
           opacity: 0.8
       });
   
       // Draw Tip Box Border (Black)
       page1.drawRectangle({
           x: tipBoxX,
           y: tipBoxY - tipBoxHeight,
           width: tipBoxWidth,
           height: tipBoxHeight,
           borderColor: rgb(0, 0, 0),
           borderWidth: 1
       });
   
       // Tip Box Text Content
       const tipText = "TIP: In most states, an independent or disintereste witness is an adult who is not a beneficiary orexecutor/personal representative of your Will";
       this.addWrappedText(page1, tipText, tipBoxX + 10, tipBoxY - 15, font, textFontSize, tipBoxWidth - 20);
    
        // Instructions Heading
        page1.drawText('Instructions:', { x: 50, y, size: textFontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= 20;
    
        const instructions = [
          '1. Gather the above parties within sight and hearing of one another.',
          '2. Address the witnesses and the notary, asking them to witness your',
          '   execution of your Last Will and Testament.',
          '3. Tell the witnesses that you have read the Will and are familiar with all of its',
          '   provisions, that you are over 18 years of age, of sound mind, and under no',
          '   constraint or undue influence.',
          '4. Fill in the Day and Month in Article 3 (Disposition of Residuary of Estate).'
        ];
    
        this.addBulletPoints(page1, instructions, 50, y, font, textFontSize);

        
        // Add Page 2 (Placeholder for Additional Content)
        const page2 = pdfDoc.addPage([600, 800]);
        y = companyNameY;

          // Title (Company Name)
          page2.drawText('GITAIT™', { x: companyNameX, y, size: titleFontSize, font: boldFont, color: rgb(0, 0, 0) });
          y -= 50;

          const instructionText = '5. Fill in the Day and Month in ';
          const boldText = 'Article 7';
          const remainingText = ' (Payment of Taxes).';
          
          // Draw normal text
          page2.drawText(instructionText, { x: 50, y, size: textFontSize, font, color: rgb(0, 0, 0) });
          
          // Calculate width of normal text
          const instructionWidth = font.widthOfTextAtSize(instructionText, textFontSize);
          
          // Draw "Article 7" in bold
          page2.drawText(boldText, { x: 50 + instructionWidth, y, size: textFontSize, font: boldFont, color: rgb(0, 0, 0) });
          
          // Calculate width of "Article 7"
          const boldTextWidth = boldFont.widthOfTextAtSize(boldText, textFontSize);
          
          // Draw remaining text after "Article 7"
          page2.drawText(remainingText, { x: 50 + instructionWidth + boldTextWidth, y, size: textFontSize, font, color: rgb(0, 0, 0) });
          
          // Move down for the next instruction
          y -= 15;
          
          // Remaining instructions (normal rendering)
          const remainingInstructions = [
              '6. Sign the Will where indicated, ask the witnesses to read the statement above their',
              '   signature lines, and if they agree with the statement, to sign and print their names',
              '   where indicated, and have the notary sign and seal.',
              '7. Once your Last Will and Testament has been executed, scan and upload the',
              '   document to your vault.'
          ];
          
          this.addBulletPoints(page2, remainingInstructions, 50, y, font, textFontSize);
    
        // Save and return the PDF bytes
        const pdfBytes = await pdfDoc.save();
        this.downloadPDF(pdfBytes, "last_Will_testament-Execution_Instructions.pdf");
      }
    
      private addWrappedText(page: any, text: string, x: number, y: number, font: any, fontSize: number, maxWidth: number): number {
        const words = text.split(' ');
        let line = '';
        for (const word of words) {
          const testLine = line + word + ' ';
          const textWidth = font.widthOfTextAtSize(testLine, fontSize);
          if (textWidth > maxWidth) {
            page.drawText(line, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= 15;
            line = word + ' ';
          } else {
            line = testLine;
          }
        }
        page.drawText(line, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
        return y;
      }
    
      private addBulletPoints(page: any, items: string[], x: number, y: number, font: any, fontSize: number): number {
        for (const item of items) {
            page.drawText(item, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= 15;
        }
        return y; // Return the updated Y-position
    }
    
      private downloadPDF(pdfBytes: Uint8Array, filename: string): void {
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = filename;
        link.click();
      }
}