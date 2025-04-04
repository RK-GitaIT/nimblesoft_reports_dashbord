import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';

export async function generateCertificateOfTrustPDF(clientData: any) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesNewRomanFont: PDFFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const pageSize = { width: 595.28, height: 900.89 };
    const margin = 50;
    const lineHeight = 18;
    const {
        trustName,
        settlorsTrust,
        addressTrustee1,
        addressTrustee2,
        actingTrustee,
        initialTrustees,
        settlorsAndTrustees,
        acknowledgedTrustName,
        currentTrustees,
        trustTitle,
        assetTrustName,
        printSignature1,
        printSignature2
    } = clientData;

    function addHeader(
        page: PDFPage,
        text: string,
        x: number,
        y: number,
        font: PDFFont,
        size: number,
        color: number[] = [0, 0, 0] // Default color is black
    ): void {
        page.drawText(text, {
            x,
            y,
            font,
            size,
            color: rgb(color[0], color[0], color[0]),
        });
    }
    let x = 50;
    function createNewPage() {
        const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        const headerText = "Estate Planning";
        const headerSize = 20;
        const headerWidth = timesNewRomanFont.widthOfTextAtSize(headerText, headerSize);

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

    let { page, y } = createNewPage(); // Use destructuring to get page and y

    function addHeading(
        text: string,
        fontSize = 13,
        align: 'left' | 'center' = 'left',
        marginTop = 0
    ) {
        const headerWidth = boldFont.widthOfTextAtSize(text, fontSize);
        let x: number;

        // Set the x coordinate based on alignment
        if (align === 'center') {
            x = (pageSize.width - headerWidth) / 2; // Center alignment
        } else {
            const leftMargin = 40; // Set a left margin (adjust as needed)
            x = leftMargin; // Left alignment
        }

        // Adjust the y position with the marginTop
        y -= marginTop; // Move down by the marginTop before drawing the text

        // Draw the text
        page.drawText(text, {
            x,
            y,
            size: fontSize,
            font: boldFont,
            color: rgb(0, 0, 0),
        });

        // Move down for the next content
        y -= fontSize + 20;
    }
    const dynamicValues: Record<string, string> = {
        trustName,
        settlorsTrust,
        addressTrustee1,
        addressTrustee2,
        actingTrustee,
        initialTrustees,
        settlorsAndTrustees,
        acknowledgedTrustName,
        currentTrustees,
        trustTitle,
        assetTrustName,
        printSignature1,
        printSignature2
    };
    type Alignment = 'left' | 'center' | 'right';
    function addParagraph(text: string, fontSize = 12, spacing = 10, alignment: Alignment = 'left') {
        text = text.replace(/\t/g, ' '); // Replace tab characters with a space
        const words = text.split(' ');
        let currentLine: { text: string; isDynamic: boolean }[] = [];
        const textWidth = pageSize.width - 2 * margin; // Total width available for text

        words.forEach((word) => {
            let isDynamic = false;

            // Check if word is dynamic
            if (word.startsWith('${') && word.endsWith('}')) {
                const varName = word.slice(2, -1); // Extract variable name
                word = dynamicValues[varName] || '____________';
                isDynamic = true;
            }

            const lineWidth = getLineWidth([...currentLine, { text: word, isDynamic }], fontSize);

            if (lineWidth > textWidth) {
                // Calculate X position based on alignment
                let x = getXAlignment(currentLine, fontSize, alignment);

                // Draw the current line
                drawStyledText(currentLine, x, y, fontSize);
                y -= lineHeight;
                currentLine = [{ text: word, isDynamic }];
            } else {
                currentLine.push({ text: word, isDynamic });
            }
        });

        if (currentLine.length > 0) {
            let x = getXAlignment(currentLine, fontSize, alignment);
            drawStyledText(currentLine, x, y, fontSize);
            y -= lineHeight;
        }

        // Add extra spacing for paragraphs
        y -= spacing;
    }


    // Function to calculate the X position based on alignment
    function getXAlignment(line: { text: string; isDynamic: boolean }[], fontSize: number, alignment: Alignment): number {
        const textWidth = getLineWidth(line, fontSize);
        if (alignment === 'right') {
            return pageSize.width - margin - textWidth;
        } else if (alignment === 'center') {
            return (pageSize.width - textWidth) / 2;
        } else {
            return margin; // Default to left alignment
        }
    }

    // Function to calculate the width of a line of text
    function getLineWidth(line: { text: string; isDynamic: boolean }[], fontSize: number): number {
        return line.reduce((width, { text, isDynamic }) => {
            return width + (isDynamic ? boldFont : font).widthOfTextAtSize(text + ' ', fontSize);
        }, 0);
    }

    // Function to draw text with dynamic words in bold
    function drawStyledText(line: { text: string; isDynamic: boolean }[], x: number, y: number, fontSize: number) {
        let xPos = x;
        line.forEach(({ text, isDynamic }) => {
            page.drawText(text + ' ', {
                x: xPos,
                y,
                size: fontSize,
                font: isDynamic ? boldFont : font, // Apply bold only to dynamic words
                color: rgb(0, 0, 0),
            });

            xPos += (isDynamic ? boldFont : font).widthOfTextAtSize(text + ' ', fontSize);
        });
    }


    //page 8 functions
    function addStateCountySection(page: PDFPage, y: number): number {
        const x = 50; // Left alignment

        // State Section
        page.drawText(`STATE OF ${addressTrustee1} `, { x, y, size: 12, font: boldFont });
        page.drawText("                  )", { x: x + 150, y, size: 12, font: boldFont });

        y -= 20;
        //for empty space
        page.drawText("", { x, y, size: 12, font: boldFont });
        page.drawText("                             ) SS", { x: x + 110, y, size: 12, font: boldFont });
        y -= 15;
        // County Section
        page.drawText("COUNTY OF", { x, y, size: 12, font: boldFont });
        page.drawText("                             ) ", { x: x + 110, y, size: 12, font: boldFont });

        return y - 30;
    }


    function addNotarySection(page: PDFPage, y: number): number {
        const x = 50;

        y -= 40;
        page.drawText("(SEAL)", { x, y, size: 12, font: boldFont });

        y -= 15;
        page.drawLine({ start: { x: x + 180, y: y + 5 }, end: { x: x + 450, y: y + 5 }, thickness: 1 });
        page.drawText("NOTARY PUBLIC", { x: x + 300, y: y - 10, size: 12, font: boldFont });

        y -= 15;
        page.drawText("My commission expires:", { x: x + 150, y: y - 20, size: 12, });
        page.drawLine({ start: { x: x + 300, y: y - 16 }, end: { x: x + 450, y: y - 16 }, thickness: 1 });

        return y - 30;
    }



    function addNewPage(pdfDoc: PDFDocument): PDFPage {
        return pdfDoc.addPage([595.28, 841.89]);
    }



    function addContent(page: PDFPage, text: string, width: number, startY: number, font: PDFFont): number {
        let y = startY;
        const margin = 50;
        const maxWidth = width - margin * 2;
        const fontSize = 12;
        const lines = text.split("\n");
    
      
    
        lines.forEach(line => {
          // Split into tokens, preserving dynamic tokens intact
          const rawTokens = line.split(/(\$\{.*?\})/g);
          const tokens: { text: string; bold: boolean }[] = [];
    
          rawTokens.forEach(token => {
            const match = token.match(/^\$\{(.*?)\}$/);
            if (match && dynamicValues.hasOwnProperty(match[1])) {
              // Treat the entire dynamic value as one token (with bold flag true)
              tokens.push({ text: dynamicValues[match[1]] || "__________", bold: true });
            } else {
              // For static text, split by spaces to allow wrapping per word.
              // This ensures that static words can be wrapped if necessary.
              const words = token.split(" ");
              words.forEach((word, index) => {
                // Append a space after every word except the last one.
                const wordWithSpace = word + (index < words.length - 1 ? " " : "");
                if (wordWithSpace) {
                  tokens.push({ text: wordWithSpace, bold: false });
                }
              });
            }
          });
    
          // Now process tokens for line wrapping
          let currentLineTokens: { text: string; bold: boolean }[] = [];
          let currentLineText = "";
    
          tokens.forEach(token => {
            const testLine = currentLineText + token.text;
            if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth) {
              // Draw the current line if adding the token exceeds maxWidth.
              let x = margin;
              currentLineTokens.forEach(tk => {
                const chosenFont = tk.bold ? boldFont : font;
                page.drawText(tk.text, { x, y, size: fontSize, font: chosenFont, color: rgb(0, 0, 0) });
                x += chosenFont.widthOfTextAtSize(tk.text, fontSize);
              });
              y -= 20;
              // Start a new line with the current token
              currentLineTokens = [token];
              currentLineText = token.text;
            } else {
              // Append token to current line.
              currentLineTokens.push(token);
              currentLineText += token.text;
            }
          });
    
          // Draw any remaining tokens on the current line
          if (currentLineTokens.length > 0) {
            let x = margin;
            currentLineTokens.forEach(tk => {
              const chosenFont = tk.bold ? boldFont : font;
              page.drawText(tk.text, { x, y, size: fontSize, font: chosenFont, color: rgb(0, 0, 0) });
              x += chosenFont.widthOfTextAtSize(tk.text, fontSize);
            });
            y -= 20;
          }
        });
    
        return y;
      }



    // === Page 1 Content ===
    addHeading("Certificate of Trust", 20, 'center');

    addParagraph("Name of Trust:                  ${trustName}", 12, 15);
    addParagraph("Date of Trust Agreement:   ______ day of _______________, 2025", 12, 15);
    addParagraph("Trust Tax Identification Number: ________________________________________________", 12, 15);
    addParagraph("Settlors of Trust:              ${settlorsTrust}", 12, 15);
    addParagraph("Initial Trustees:                ${initialTrustees}", 12, 15);
    addParagraph("Successor Trustees:        ________________________________________________", 12, 15);
    addParagraph("Acting Trustee:                ${actingTrustee}", 12, 15);
    addParagraph("Address of Acting Trustee:  ${addressTrustee1}", 12, 15);

    addParagraph("The ${trustName} was executed on the _________ day of________________, 2025, as it may hereafter be mended, by ${settlorsTrust} as Settlors and Trustees ${currentTrustees} as current Trustees, certify that the following information concerning the Trust is true and accurate.", 12, 20);

    addHeading("Section 1: Existence");

    addParagraph("As of the date hereof, the Trustees represent that:", 12, 15);

    addParagraph("(a)  The Trust is in full force and effect and is revocable as to community property if both Settlors consent. Each Settlor retains the right to withdraw his or her separate property.", 12, 15);
    addParagraph("(b)  The Trust has not been revoked, modified, or amended in any way that would cause the representations contained herein to be incorrect.", 12, 15);
    addParagraph("(c)  They took title to the Trust property by ____________________________________ (describe manner of taking title, such as deed, bill of sale, title transfer, etc.).", 12, 15);
    addParagraph("(d)  They are the Settlors of the Trust, and the power vested in the Trustees may be exercised by any Trustee independent from the other as to separate property of that Settlor/Trustee, and the power vested in the Trustees must be exercised by them jointly as to community property.", 12, 15);
    addParagraph("(e)  They have full authority to act on behalf of the Trust.", 12, 15);
    addParagraph("(f)  No other party’s approval is required with respect to this certification or the provisions set forth below.", 12, 15);
    addParagraph("(g)   The provisions set forth below are also contained within or authorized by the Trust.", 12, 15);



    // === Force Page 2 to start on a new page ===
    ({ page, y } = createNewPage());

    // === Page 2 Content ===
    addParagraph("(h) The provisions set forth below are sufficient on their face and may be relied upon by anyone dealing with the Trust, without need for further inquiry.");

    addHeading("Section 2: Manner in Which Title to Trust Assets Should Be Taken");
    addParagraph("Title to trust assets should be taken in the following form: ${assetTrustName} as trustees of the _________________________, dated _______ day of _______________, 2025.");

    addHeading("Section 3: Construction");
    addParagraph("The Trust is subject to and is construed under the laws of the State of ${addressTrustee2}");

    addHeading("Section 4: Third Party Reliance");
    addParagraph("No person or legal entity dealing with the Trustees is required to investigate or determine the regularity, validity, or propriety of any transaction involving any Trust asset; the application of the proceeds of any such transaction; or any provision of the Trust Agreement. The Trustees’ delivery of a copy of this certification is sufficient (without requiring examination of the remainder of the Trust Agreement document) to release and discharge any such person or legal entity from any irregularity, invalidity, or impropriety in any provision of the Trust Agreement or on the part of the Trustees arising out of any such transaction or application of proceeds.");
    addHeading("Section 5: Trustees’ Title");
    addParagraph("The Trustees are vested with absolute title to all Trust assets, both as to principal and income, subject only to the execution of the Trust. If the Trust owns any interest in real property at the time this Certificate of Trust is recorded, the legal description of such real property is attached to this Certificate of Trust as Exhibit A.");

    addHeading("Section 6: Trustees’ Powers");
    addParagraph("In order to meet the obligations of the Trust Agreement, the Trustees have the following powers and also have all statutory powers allowed to trustees under applicable federal and state statutes, unless expressly excluded or amended below. The Trustees shall exercise these powers solely with respect to transactions involving the custody and investment of the Trust assets and proceeds therefrom. Those powers do not extend to assets and transactions which lie outside the scope of this Trust Agreement. The following powers are contained within the Trust Agreement:");

    addParagraph("(a) The Settlors intend that the Trustee will have the power to perform all acts, institute all proceedings, and exercise all rights, powers, and privileges that an absolute owner of any asset held in trust hereunder would have. The enumeration of certain powers herein will not limit the general or implied powers of the Trustee. In addition to the powers and authority granted by the laws of the jurisdiction where this Trust is administered, as they may be amended from time to time, the Trustee will have the discretionary powers set forth in this Trust Agreement with respect to any trust, which the Trustee may exercise without application to any court.");
    // === Force Page 3 to start on a new page ===
    ({ page, y } = createNewPage());

    // === Page 3 Content ===
    addParagraph("(b) To compromise, adjust, and settle disputes and claims; to execute receipts and acquittances; and to institute and defend suits or legal proceedings.");
    addParagraph("(c) To invest and reinvest in such stocks, bonds, certificates of deposit, and other securities and properties as the Trustee may deem advisable, including, without limitation, real property, common stocks and unsecured obligations, undivided interests, interests in investment trusts, mutual funds, legal and discretionary common trust funds, common funds maintained by the Trustee, leases, and property which is outside of the Settlors’ domicile; to deposit trust funds in a bank or trust company, including a bank or trust company operated by the Trustee and including any common trust fund of any such depository bank or trust company; and to maintain margin accounts within any type of brokerage account, all without diversification as to the kind or amount and without being restricted in any way by any statute or court decision which now or hereafter exists regulating or limiting investments by fiduciaries.");
    addParagraph("(d) To transfer, sell, exchange, convey, improve, subdivide, partition, lease, mortgage, pledge, give options upon, or otherwise dispose of any security or property, real, personal, or mixed, which is held in trust hereunder, at public or private sale or otherwise for cash or other consideration or on credit and upon such terms and conditions, with or without security, and for such price as the Trustee may deem advisable, without any obligation upon any purchaser, transferee, vendee, or assignee to look to the application of the proceeds, and to execute good and sufficient deeds and other appropriate instruments of conveyance, assignment, or transfer.");
    addParagraph("(e) To lease any real estate for such term or terms, upon such conditions and rentals, and in such manner as the Trustee may deem advisable (with or without the privilege of purchase), and any lease so made will be valid and binding for the full term thereof even though the same will extend beyond the duration of any trust; to insure against fire or other risk; to make repairs, replacements, and improvements, structural or otherwise, to any such real estate; and to subdivide real estate, to dedicate the same to public use, and to grant easements as the Trustee may deem proper.");
    addParagraph("(f) To borrow money from any source, including from the Trustee in an individual capacity, for any purpose connected with the protection or enhancement of the Trust or to carry out any of the provisions of the Trust, and as security, to mortgage or pledge any asset of the Trust upon such conditions as the Trustee deems proper. A lender may only look to trust assets for repayment of any loan, and no Trustee or beneficiary will be liable personally if trust assets are insufficient to repay any loan so made.");
    addParagraph("(g)	To insure the assets of the Trust against damage or loss, and the Trustee against liability with respect to third persons. ");
    addParagraph("(h) To determine whether, and in what manner, interest, dividends, rents, and other income will be apportioned in respect of time. ");
    addParagraph("(i)	To make distribution hereunder of property, wholly or partly, in cash or in kind, and for that purpose to divide, partition, and allot property and to determine the value thereof, all ");
    // === Force Page 4 to start on a new page ===
    ({ page, y } = createNewPage());

    // === Page 4 Content ===

    addParagraph("in accordance with the provisions of this Trust Agreement; and the judgment of theTrustee as to the value of such properties and the division thereof will be binding on all persons. ")
    addParagraph("(j)	To cause any securities or other property, real or personal, belonging to any trust, to be held or registered in the Trustee’s name or in the name of the Trustee’s nominee, or in such other form as the Trustee may deem best, without disclosing any trust relationship; PROVIDED, HOWEVER, the Trustee will be liable for any act of the nominee in connection with the securities or other property so held. ");
    addParagraph("(k)	To sell and exercise any “rights” issued on any security held in trust hereunder; to pay calls, assessments, and any other sums chargeable or accruing against or on account of securities.");
    addParagraph("(l)	To vote, in person or by general or limited proxy, any stock or security held in trust hereunder including the power to retain in trust and vote a security issued by a bank or financial institution; to consent, directly or through a committee or other agent, to the reorganization, consolidation, merger, dissolution, or liquidation of a corporation or other business enterprise. ");
    addParagraph("(m)	To perform, compromise, or refuse performance of contracts that continue as obligations of the Settlors’ estates, as the Trustee determines under the circumstances. In performing such enforceable contracts of the Trust, the Trustee, among other possible choices of action, may effect a fair and reasonable compromise with a debtor or obligor, or extend, renew, or in any manner modify the terms of an obligation owing to the Trust. A Trustee who holds a mortgage, pledge, or other lien upon property of another person, may, in lieu of foreclosure, accept the conveyance or transfer of encumbered assets from the owner thereof in satisfaction of the indebtedness secured by lien.");
    addParagraph("(n)	To pay taxes, assessments, compensation of the Trustee, and other expenses incurred in the collection, care, administration, and protection of the Trust.");
    addParagraph("(o)	To abandon, in any way, property which the Trustee determines not to be worth protecting. ");
    addParagraph("(p)	To make appropriate provisions for depositing securities with any legal depository.");
    addParagraph("(q)	To employ accountants, attorneys, securities brokers, and such agents as the Trustee may deem advisable, even though any such agent may be a subsidiary or partner of the Trustee, to pay reasonable compensation for their services, and to charge the same to (or apportion the same between) income and principal as the Trustee may deem proper.");
    addParagraph("(r)) To refrain from or to take any action and to refrain from or to make any election, in the Trustee’s reasonable discretion, which the Trustee is permitted by law to make or not make; to minimize the tax liabilities of any trust, the Settlors’ estates, and the beneficiaries, if in the Trustee’s reasonable discretion, it is deemed desirable to do so; and to allocate or charge, or fail to allocate or charge, in the Trustee’s reasonable discretion, the benefits or costs thereof among various beneficiaries.");


    // === Force Page 5 to start on a new page ===
    ({ page, y } = createNewPage());
    // === Page 5 Content ===

    addParagraph("(s) To merge the assets of any trust with those of any other trust having the same beneficiaries and having similar provisions so as to allow the Trustee to hold the assets of all of such trusts as a single trust, providing that the integrity of any such trust is not violated.");
    addParagraph("(t) To determine the identity of all persons having a vested or non-vested beneficial interest in the Trust, with or without legal proceedings.");
    addParagraph("(u) To hold property otherwise directed to be added to or consolidated with the trust estate of any trust held hereunder as a separate trust having terms identical to the terms of the existing trust; to sever any trust on a fractional basis into two (2) or more separate trusts for any reason; to segregate by allocation to a separate account or trust a specific amount out of, or a portion of, or specific assets included in, the trust estate of any trust held hereunder to reflect a partial disclaimer or for any tax or other reason in a manner consistent with any applicable rules or regulations. Income earned on a segregated amount, portion or specific assets after the segregation is effective will be held, administered, and distributed pursuant to the terms of such separate trust. In administering the trust estate of any separate account or trust and in making applicable tax elections, the Trustee will consider the differences in federal tax attributes and all other factors the Trustee believes pertinent. A separate trust created by severance or segregation will be treated as a separate trust for all purposes from and after the date designated by the Trustee as the effective date of the severance or segregation and will be held on terms and conditions that are equivalent to the terms of the trust from which it was severed or segregated so that the aggregate interests of each beneficiary in the several trusts are equivalent to the beneficiary’s interests in the trust before severance or segregation.");
    addParagraph("(v) To, in the Trustee’s reasonable discretion and without court order, retain any farm property, even though that property may constitute all or a large portion of the trust estate, and to acquire other farm property; to engage in farm operations and the production, harvesting, and marketing of farm products, including livestock breeding and feeding, poultry farming, and dairy farming, whether by operating directly with hired labor, by retaining farm managers or management agencies (including any such agency which is in any way affiliated with any corporate Trustee acting hereunder), or by renting on shares or for cash; to enter into farm programs; to purchase or rent farm machinery and equipment; to purchase livestock, poultry, fertilizer, seed, and feed; to improve the farm property, and to repair, improve, and construct farm buildings, fences, irrigation systems, and drainage facilities; to develop, lease, or otherwise dispose of any mineral, oil, or gas property or rights; to borrow money for any of the purposes described in this paragraph; and in general to do all things customary or desirable in farm operations.");
    addParagraph("(w) To use and expend the Trust income and principal to i) conduct environmental assessments, audits, and site monitoring to determine compliance with any environmental law or regulation thereunder, ii) take all appropriate remedial action to contain, clean up or remove any environmental hazard including a spill, release, discharge, or contamination, either of the Trustee’s own accord or in response to an actual or threatened violation of any environmental law or regulation thereunder, iii) institute legal proceedings concerning environmental hazards or contest or settle legal proceedings brought by any local, state, or federal agency concerned with environmental compliance, or by a private litigant, ");
    // === Force Page 6 to start on a new page ===
    ({ page, y } = createNewPage());
    addParagraph("iv) comply with any local, state, or federal agency order or court order directing an assessment, abatement, or cleanup of any environmental hazards, and v) employ agents, consultants, and legal counsel to assist or perform the above undertakings or actions. Any expenses incurred by the Trustee under this paragraph may be charged against income or principal as the Trustee will determine.")
    addParagraph(" proceedings concerning environmental hazards or contest or settle legal proceedings brought by any local, state, or federal agency concerned with environmental compliance, or by a private litigant, comply with any local, state, or federal agency order or court order directing an assessment, abatement, or cleanup of any environmental hazards, and employ agents, consultants, and legal counsel to assist or perform the above undertakings or actions. Any expenses incurred by the Trustee under this paragraph may be charged against income or principal as the Trustee will determine.");
    addParagraph("(X) To receive any property, real or personal, to be added to the Trust from the Settlors’ estates (and if the Trustee consents in writing, from any other person) by lifetime or testamentary transfer or otherwise; PROVIDED, HOWEVER, that the Trustee, in the Trustee’s sole discretion, may require, as a prerequisite to accepting property, that the donating party provide evidence satisfactory to the Trustee that i) the property is not contaminated by any hazardous or toxic materials or substances; and ii) the property is not being used and has never been used for any activities directly or indirectly involving the generation, use, treatment, storage, disposal, release, or discharge of any hazardous or toxic materials or substances.");
    // === Page 7 Content ===
    addParagraph("(y) In allocating assets among separate trusts, the Trustee is specifically authorized to select any one or more particular assets to fund one trust with different assets funding other trusts. It is the Settlors’ intention that certain assets may be better suited for one particular beneficiary’s trust versus other assets and the Trustee is encouraged in the Trustee’s sole and absolute discretion to make such allocations at the time of the division into separate trusts for separate beneficiaries.");

    addParagraph("(z) No Trustee will be liable for any loss or depreciation in value sustained by the Trust as a result of the Trustee accepting or retaining any property upon which there is later discovered to be hazardous materials or substances requiring remedial action pursuant to any federal, state, or local environmental law unless the Trustee contributed to the loss or depreciation in value through willful default, willful misconduct, or gross negligence. The failure of the Trustee to obtain the evidence referred to in the preceding paragraph will not be considered the willful default, willful misconduct, or gross negligence of the Trustee.");

    addParagraph("(aa) Notwithstanding anything to the contrary contained herein, the Trustee may withhold a distribution of real estate to a beneficiary until receiving from the beneficiary an indemnification agreement in which the beneficiary agrees to indemnify the Trustee against any claims filed against the Trustee as an “owner” or “operator” under the Comprehensive Environmental Response, Compensation and Liability Act of 1980, as from time to time amended, or any regulation thereunder.");

    addParagraph("(bb) To acquire by purchase, exchange, or otherwise, property, real or personal, from the executor or administrator of the Settlors’ estates, although such property may not be of the character prescribed by law or by the terms of this  ");
    // === Force Page 7 to start on a new page ===
    ({ page, y } = createNewPage());

    // === Page 7 Content ===
    addParagraph("Trust Agreement for the investment of trust funds and although the acquisition of such property may result in a large percentage of any trust hereunder being invested in one (1) class of property, all")
    addParagraph("without liability for loss or depreciation, except for the Trustee’s own negligence; and to retain the property so acquired so long as the Trustee will deem advisable.")

    addParagraph("(cc) To invest in any assets without being limited by any statute or judicial decision imposing requirements as to assets in which investments may be made or the retention or diversification of investments. Any aspect of any diversification requirement that would apply is hereby negated. Notwithstanding any law, custom, or practice to the contrary, the Trustee will be under no obligation to change the form of any investment held hereunder.");

    addParagraph("(dd) Unless otherwise provided herein, in making discretionary distributions of principal hereunder, the Trustee may, but will not be required to, take into consideration all other income, property, annuities, and sources of support available to the prospective recipients of the distribution known to the Trustee.");

    addHeading("Section 7: Successor Trustee");

    addParagraph("Any Successor Trustee, upon his or her acceptance of administration of said Trust without order of Court, succeeds to all obligations and powers, including discretionary powers, granted to the Trustee. Each successor to any Successor Trustee has identical powers and obligations of said Successor Trustee.");

    addHeading("Section 8: Reliance");
    addParagraph("A party may rely on this certification until receiving a new certification advising of any changes to the Trust. This certification supersedes any prior certifications, documents or information provided regarding the Trust.");

    addParagraph("IN WITNESS WHEREOF, the Trustees execute this Certificate of Trust this the ___________ day of __________, 2025.");
    addParagraph("________________________________________", 12, 10, 'right');
    addParagraph("${printSignature1} Trustee", 12, 10, 'right');
    addParagraph("________________________________________", 12, 10, 'right');
    addParagraph("${printSignature2} Trustee", 12, 10, 'right');
    // === Force Page 8 to start on a new page ===


    // === Page 8 Content ===

    page = addNewPage(pdfDoc);
    const { width: width8, height: height8 } = page.getSize();
    let y8 = height8 - 80;
    addHeader(page,"Estate Planning",x+390,y8+45,boldFont,20);

    y8 = addStateCountySection(page, y8);

    const contentpage8: string = 'Acknowledged before me by ${currentTrustees} in their capacity as Trustees this the ___ day of _____________________, 2025.';
    y8 = addContent(page, contentpage8, width8 + 10, y8 - 20, boldFont)

    y8 = addNotarySection(page, y8 - 10);




    // Generate and download the PDF
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Certificate_of_Trust.pdf';
    link.click();
}