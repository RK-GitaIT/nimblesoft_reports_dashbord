import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';

export async function animalTrustPdf() {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Define layout constants based on the PDF
    const pageSize = { width: 595.28, height: 861.89 }; // Standard A4
    const margin = 50;
    const headingFontSize = 14;
    const paragraphFontSize = 12;
    const subHeadingFontSize = 12;
    const listIndent = margin + 10;
    const headingTopSpacing = 25;
    const paragraphSpacing = 18;
    const textWidth = pageSize.width - 2 * margin; // Available width for text

    const boxWidth = 500;
    const boxHeight = 80;
    const boxX = 50;
    const boxY = 700;

    function createNewPage() {
        const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        const headerText = "Estate Planning";
        const headerSize = 16;
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
        if (y < margin) ({ page, y } = createNewPage());
        page.drawText(text, { x: margin, y, size: fontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= fontSize + 5;
    }

    // Add a more flexible box function
    function addBoxedText(
        page: PDFPage,
        text: string,
        x: number,
        y: number,
        boxWidth: number,
        boxHeight: number,
        font: PDFFont,
        boldFont: PDFFont,
        fontSize: number,
        paragraphSpacing: number,
        boldWords: string[] = [],
        borderColor: any = rgb(0, 0, 0),
        borderWidth: number = 1,
        boxColor: any | null = null,
        shadowOffset: number = 0,
        shadowColor: any | null = null
    ) {
        // Draw box shadow (if requested)
        if (shadowOffset > 0 && shadowColor) {
            page.drawRectangle({
                x: x + shadowOffset,
                y: y - boxHeight - shadowOffset,
                width: boxWidth,
                height: boxHeight,
                color: shadowColor,
            });
        }

        // Draw the box
        page.drawRectangle({
            x: x,
            y: y - boxHeight,
            width: boxWidth,
            height: boxHeight,
            borderColor: borderColor,
            borderWidth: borderWidth,
            color: boxColor,
        });

        // Handle text and bold words
        const words = text.split(' ');
        let currentLine = '';
        let currentY = y - fontSize - 5; // Start drawing text inside the box
        let currentX = x + 5; // Add some padding

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);

            if (testWidth <= boxWidth - 10) { // Keep text within box
                currentLine = testLine;
            } else {
                // Draw the line
                let wordsInLine = currentLine.split(' ');
                let lineX = currentX;
                wordsInLine.forEach(wordInLine => {
                    if (boldWords.includes(wordInLine.replace(/[,.:]/g, ''))) { // Remove punctuation for matching
                        page.drawText(wordInLine + ' ', { x: lineX, y: currentY, size: fontSize, font: boldFont, color: rgb(0, 0, 0) });
                        lineX += boldFont.widthOfTextAtSize(wordInLine + ' ', fontSize);
                    } else {
                        page.drawText(wordInLine + ' ', { x: lineX, y: currentY, size: fontSize, font: font, color: rgb(0, 0, 0) });
                        lineX += font.widthOfTextAtSize(wordInLine + ' ', fontSize);
                    }
                });

                currentY -= paragraphSpacing;
                currentLine = word + ' ';
                currentX = x + 5;
            }
        });

        // Draw the last line
        let wordsInLine = currentLine.split(' ');
        let lineX = currentX;
        wordsInLine.forEach(wordInLine => {
            if (boldWords.includes(wordInLine.replace(/[,.:]/g, ''))) {
                page.drawText(wordInLine + ' ', { x: lineX, y: currentY, size: fontSize, font: boldFont, color: rgb(0, 0, 0) });
                lineX += boldFont.widthOfTextAtSize(wordInLine + ' ', fontSize);
            } else {
                page.drawText(wordInLine + ' ', { x: lineX, y: currentY, size: fontSize, font: font, color: rgb(0, 0, 0) });
                lineX += font.widthOfTextAtSize(wordInLine + ' ', fontSize);
            }
        });

        return y - boxHeight - paragraphSpacing; // Update y position
    }


    function addParagraph(text: string) {
        const words = text.split(/\s+/);
        let currentLine = '';
        words.forEach(word => {
            const lineWidth = font.widthOfTextAtSize(currentLine + word, paragraphFontSize);
            if (lineWidth < textWidth) {
                currentLine += word + ' ';
            } else {
                if (y < margin) ({ page, y } = createNewPage());
                page.drawText(currentLine.trim(), { x: margin, y, size: paragraphFontSize, font, color: rgb(0, 0, 0) });
                y -= paragraphSpacing;
                currentLine = word + ' ';
            }
        });
        if (currentLine.trim() !== '') {
            if (y < margin) ({ page, y } = createNewPage());
            page.drawText(currentLine.trim(), { x: margin, y, size: paragraphFontSize, font, color: rgb(0, 0, 0) });
            y -= paragraphSpacing;
        }
    }

    function addBoldText(text: string, x: number, y: number, fontSize: number) {
        page.drawText(text, {
            x: x,
            y: y,
            size: fontSize,
            font: boldFont,
            color: rgb(0, 0, 0),
        });
        return boldFont.heightAtSize(fontSize); // Return the height of the text
    }


    function addNumberedItem(text: string, number: number, boldSubstring: string | null = null) {
        if (y < margin) ({ page, y } = createNewPage());

        const itemNumber = `${number}. `;
        const baseFont = font;
        const baseFontSize = paragraphFontSize;
        const numberWidth = baseFont.widthOfTextAtSize(itemNumber, baseFontSize);
        let currentX = listIndent;

        // Draw the number
        page.drawText(itemNumber, { x: listIndent, y: y, size: baseFontSize, font: baseFont, color: rgb(0, 0, 0) });
        currentX += numberWidth;

        if (boldSubstring) {
            let remainingText = text;
            let boldDrawn = false;

            while (remainingText) {
                const boldIndex = remainingText.indexOf(boldSubstring);
                if (boldIndex === -1) {
                    // Draw the rest of the text in the base font
                    drawWrappedText(remainingText, currentX, y, textWidth - (currentX - margin), baseFont, baseFontSize);
                    break;
                } else {
                    const regularPart = remainingText.substring(0, boldIndex);
                    if (regularPart) {
                        drawWrappedText(regularPart, currentX, y, textWidth - (currentX - margin), baseFont, baseFontSize);
                        currentX += baseFont.widthOfTextAtSize(regularPart, baseFontSize);
                    }

                    const boldPart = remainingText.substring(boldIndex, boldIndex + boldSubstring.length);
                    page.drawText(boldPart, { x: currentX, y: y, size: baseFontSize, font: boldFont, color: rgb(0, 0, 0) });
                    currentX += boldFont.widthOfTextAtSize(boldPart, baseFontSize);
                    remainingText = remainingText.substring(boldIndex + boldSubstring.length);
                    boldDrawn = true;
                }
            }
            if (!boldDrawn && text) {
                drawWrappedText(text, currentX, y, textWidth - (currentX - margin), baseFont, baseFontSize);
            }

        } else {
            drawWrappedText(text, currentX, y, textWidth - (currentX - margin), baseFont, baseFontSize);
        }

        y -= paragraphSpacing * Math.max(1, Math.ceil(baseFont.widthOfTextAtSize(text, baseFontSize) / (textWidth - (currentX - margin))));
    }

    function drawWrappedText(text: string, x: number, y: number, availableWidth: number, font: PDFFont, fontSize: number) {
        const words = text.split(' ');
        let currentLine = '';
        let lineY = y;

        words.forEach(word => {
            const testLine = currentLine + word + ' ';
            const testWidth = font.widthOfTextAtSize(testLine, fontSize);
            if (testWidth <= availableWidth) {
                currentLine = testLine;
            } else {
                page.drawText(currentLine, { x: x, y: lineY, size: fontSize, font: font, color: rgb(0, 0, 0) });
                lineY -= paragraphSpacing;
                currentLine = word + ' ';
            }
        });
        if (currentLine) {
            page.drawText(currentLine, { x: x, y: lineY, size: fontSize, font: font, color: rgb(0, 0, 0) });
        }
        y = lineY;
    }


    // function addNumberedItem(text: string, number: number, bold: boolean = false) {
    //     if (y < margin) ({ page, y } = createNewPage());

    //     const itemNumber = `${number}. `;
    //     const fontToUse = bold ? boldFont : font;
    //     const numberWidth = fontToUse.widthOfTextAtSize(itemNumber, paragraphFontSize);
    //     const itemX = listIndent + numberWidth; // Indent the text, NOT the number
    //     const availableWidth = textWidth - (itemX - margin); // Available width for text

    //     let currentLine = '';
    //     const words = text.split(/\s+/);

    //     // Draw the number *first*
    //     page.drawText(itemNumber, { x: listIndent, y: y, size: paragraphFontSize, font: fontToUse, color: rgb(0, 0, 0) });

    //     words.forEach(word => {
    //         const lineWidth = fontToUse.widthOfTextAtSize(currentLine + word, paragraphFontSize);
    //         if (lineWidth < availableWidth) {
    //             currentLine += word + ' ';
    //         } else {
    //             if (y < margin) ({ page, y } = createNewPage());
    //             page.drawText(currentLine.trim(), { x: itemX, y, size: paragraphFontSize, font: fontToUse, color: rgb(0, 0, 0) });
    //             y -= paragraphSpacing;
    //             currentLine = word + ' ';
    //         }
    //     });
    //     if (currentLine.trim() !== '') {
    //         if (y < margin) ({ page, y } = createNewPage());
    //         page.drawText(currentLine.trim(), { x: itemX, y, size: paragraphFontSize, font: fontToUse, color: rgb(0, 0, 0) });
    //         y -= paragraphSpacing;
    //     }
    //     y -= paragraphSpacing; // Add spacing after the item
    // }

    function addVerticalSpace(space: number) {
        y -= space;
        if (y < margin) ({ page, y } = createNewPage());
    }

    function addSubHeading(text: string) {
        y -= headingTopSpacing;
        if (y < margin) ({ page, y } = createNewPage());
        page.drawText(text, { x: margin, y, size: subHeadingFontSize, font: boldFont, color: rgb(0, 0, 0) });
        y -= paragraphSpacing;
    }

    function addNecessaryParties(parties: string[], mainFontSize: number, subFontSize: number, verticalSpacing: number) {
        let currentY = y;
        parties.forEach((party, index) => {
            const fontSize = index === 0 ? mainFontSize : subFontSize;
            const fontToUse = index === 0 ? boldFont : font;
            let xPosition = margin;
            if (index > 0) xPosition += 100;
            if (currentY - fontSize < margin) ({ page, y } = createNewPage());
            page.drawText(party, { x: xPosition, y: currentY, size: fontSize, font: fontToUse, color: rgb(0, 0, 0) });
            currentY -= fontSize + verticalSpacing;
        });
        y = currentY;
    }

    addHeading("Understanding Your Animal Care Trust", 14);
    addVerticalSpace(5);
    addParagraph("Your Animal Care Trust (or Pet Trust) is the document that provides for the care of any pets you may own at the last of your and Hema Latha Manda’s deaths.");
    addVerticalSpace(5);
    addHeading("Review Your Animal Care Trust:", 12);
    addParagraph("It is very important to review your Animal Care Trust to ensure it accurately reflects your wishes before making the document official.");
    addVerticalSpace(5);
    addHeading("Making your Animal Care Trust Official", 14);
    addVerticalSpace(5);
    addNecessaryParties(
        ["Necessary parties: ", "You", "Two independent witnesses", "A notary public "],
        12, 12, 5
    );

    y = addBoxedText(
        page,
        "Tip: In most states, an independent or disinterested witness is an adult who is not a beneficiary or executor/personal representative of your Will.",
        boxX + 290,
        boxY - 120,
        boxWidth - 300,
        boxHeight + 10,
        font,
        boldFont,
        12,
        18,
        ["Tip"],
        rgb(0, 0, 0),
        1,
        rgb(0.95, 0.95, 0.95),
        4,
        rgb(0.8, 0.8, 0.8)
    );

    addVerticalSpace(5);
    addSubHeading("Instructions:");
    addVerticalSpace(10); // Added space before instructions
    addNumberedItem("Gather the above parties within sight and hearing of one another.", 1);
    addNumberedItem("Address the witnesses and the notary, asking the witnesses to witness your execution of your Animal Care Trust.", 2);
    addNumberedItem("Tell the witnesses that you have read and are familiar with all of its provisions, that you are over 18 years of age, of sound mind, and under no constraint or undue influence.", 3);
    addNumberedItem("Sign the Animal Care Trust where indicated, have the witnesses sign and print their names where indicated, and have the notary sign and seal.", 4);
    addNumberedItem("Funding the Trust: Staple a dollar bill to the last page of the Trust. This step “funds” the Trust and is required in some states for the Trust to be valid.", 5, "Funding the Trust:");
    addNumberedItem("Once your Animal Care Trust has been executed, scan and upload the document to your vault.", 6);

    addVerticalSpace(6);
    // Add the S Corp Warning

    y = addBoxedText(
        page,
        "Remember: S corporation stock should NOT be transferred to the Trust because it may cause termination of the corporation's status as an S corporation. Please contact an attorney if you have any questions about this prohibition.",
        boxX,
        boxY - 500,
        boxWidth + 10,
        boxHeight,
        font,
        boldFont,
        12,
        18,
        ["Remember", "Please", "contact", "an", "attorney", "if", "you", "have", "any", "questions", "about", "this", "prohibition"],
        rgb(0, 0, 0),
        1,
        rgb(0.95, 0.95, 0.95),
        4,
        rgb(0.8, 0.8, 0.8)
    );


    // Save the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'animal_of_trust_care.pdf';
    link.click();
}