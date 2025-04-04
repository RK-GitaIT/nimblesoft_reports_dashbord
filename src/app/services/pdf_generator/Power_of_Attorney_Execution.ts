import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';

export async function powerofattorneyInstructionsPDF() {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Define layout constants based on the PDF
    const pageSize = { width: 595.28, height: 861.89 }; // Standard A4
    const margin = 50; // Approximate margin
    const headingFontSize = 14;
    const paragraphFontSize = 12;
    const subHeadingFontSize = 12;
    const listIndent = margin + 10; // Indent for list items
    const headingTopSpacing = 25; // Space above headings
    const paragraphSpacing = 18; // Space between paragraphs
    const textWidth = pageSize.width - 2 * margin; // Calculate textWidth here
    //additinal 
    const lineHeight = 18;
    const bulletIndent = 15;
    function createNewPage() {
        const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        const headerText = "Estate Planning";
        const headerSize = 20;
        const headerWidth = boldFont.widthOfTextAtSize(headerText, headerSize);

        // Draw header on top-right
        page.drawText(headerText, {
            x: pageSize.width - headerWidth - margin,
            y: pageSize.height - 50,
            size: headerSize,
            font: boldFont,
            color: rgb(0, 0, 0),
        });

        return { page, y: pageSize.height - 90 };
    }

    let { page, y } = createNewPage();

    function addHeading(text: string, fontSize: number) {
        y -= headingTopSpacing;
        if (y < margin) {
            ({ page, y } = createNewPage());
            y -= headingTopSpacing;
        }
        page.drawText(text, { x: margin, y: y, size: fontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= fontSize + 5; // Add a little space after the heading
    }

    function addParagraph(text: string) {
        const words = text.split(/\s+/);
        let currentLine = '';

        words.forEach(word => {
            const lineWidth = font.widthOfTextAtSize(currentLine + word, paragraphFontSize);
            if (lineWidth < textWidth) {
                currentLine += word + ' ';
            } else {
                if (y < margin) {
                    ({ page, y } = createNewPage());
                }
                page.drawText(currentLine.trim(), { x: margin, y, size: paragraphFontSize, font, color: rgb(0, 0, 0) });
                y -= paragraphSpacing;
                currentLine = word + ' ';
            }
        });

        if (currentLine.trim() !== '') {
            if (y < margin) {
                ({ page, y } = createNewPage());
            }
            page.drawText(currentLine.trim(), { x: margin, y, size: paragraphFontSize, font, color: rgb(0, 0, 0) });
            y -= paragraphSpacing;
        }
    }

    function addSubHeading(text: string) {
        y -= headingTopSpacing;
        if (y < margin) {
            ({ page, y } = createNewPage());
            y -= headingTopSpacing;
        }
        page.drawText(text, { x: margin, y: y, size: subHeadingFontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= paragraphSpacing;
    }

    function addNumberedItem(text: string, number: number) {
        if (y < margin) {
            ({ page, y } = createNewPage());
        }
        page.drawText(`${number}. ${text}`, { x: listIndent, y: y, size: paragraphFontSize, font, color: rgb(0, 0, 0) });
        y -= paragraphSpacing;
    }
    function addVerticalSpace(space: number) {
        y -= space;
        if (y < margin) {
            ({ page, y } = createNewPage());
        }
    }

    function addNecessaryParties(parties: string[], mainFontSize: number, subFontSize: number, verticalSpacing: number) {
        let currentY = y; // Use a local variable to track y position

        parties.forEach((party, index) => {
            const fontSize = index === 0 ? mainFontSize : subFontSize;
            const fontToUse = index === 0 ? boldFont : font; // Use bold for "Necessary parties:"

            if (currentY - fontSize < margin) {
                ({ page, y } = createNewPage());
                currentY = y - 100;
            }

            let xPosition = margin;
            if (index > 0) {
                xPosition += 100; // Indent "A notary public"
            }

            page.drawText(party, {
                x: xPosition,
                y: currentY,
                size: fontSize,
                font: fontToUse,
                color: rgb(0, 0, 0),
            });

            currentY -= fontSize + verticalSpacing;
        });

        y = currentY; // Update the global y position
    }
    // ---  PDF Content Generation ---

    addHeading("Understanding Your Power of Attorney", 14);
    addVerticalSpace(10);
    addParagraph(` Your Power of Attorney identifies one or more individuals that you have chosen to act in your place with regard to all financial, business, tax, real estate, and similar matters in the event that you are incapable of doing so. Or, if you are traveling and an unexpected financial matter requires immediate attention, then having this document set up will allow the identified individual(s) to act on your behalf.`) // [cite: 4]
    addVerticalSpace(10);
    addParagraph(` Note that the power of attorney becomes effective on the date you sign it.  That means that the person you name in the document (known as your Attorney-in-Fact or Agent) will be able to act under the Power of Attorney immediately should the need arise.   `)
    addHeading("Review Your Power of Attorney:", 12);
    addParagraph(
        ` It is very important to review your Power of Attorney to ensure it accurately identifies the individual(s) you trust to handle your financial matters if you are unable to.  If you need to modify the document, simply access the SmartGuide to create a new or modified Power of Attorney.`
    );


    addHeading("Making your Power of Attorney Official", 14);
    addVerticalSpace(5);
    addNecessaryParties(
        ["Necessary parties: ", "You", "A notary public"],
        12,  // mainFontSize for "Necessary parties:"
        12,  // subFontSize for "You" and "A notary public"
        5   // verticalSpacing
    );

    addVerticalSpace(5);
    addSubHeading("Instructions:");

    addNumberedItem("Gather the above parties within sight and hearing of one another.", 1);
    addNumberedItem("Sign and date the Power of Attorney where indicated.", 2);
    addNumberedItem("Have the notary sign and seal.", 3);
    addNumberedItem(
        "Once your Power of Attorney has been executed, scan and upload the document to your vault.",
        4
    );

    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Power_of_Attorney_Execution.pdf';
    link.click();
}