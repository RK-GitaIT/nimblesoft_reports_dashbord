import { PDFDocument, rgb, StandardFonts, PDFPage, PDFFont } from 'pdf-lib';

export async function generateLastWillAndTestament(data: any): Promise<void> {
  const pdfDoc: PDFDocument = await PDFDocument.create();
  const timesNewRomanFont: PDFFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont: PDFFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const {
    name,
    Spouse_name,
    child_name_1,
    child_name_2
  } = data;

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

  function addTitle(page: PDFPage, text: string, width: number, height: number): void {
    page.drawText(text.toUpperCase(), {
      x: width / 2 - (boldFont.widthOfTextAtSize(text, 14) / 2),
      y: height - 50,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }

  function addSideHeading(page: PDFPage, text: string, width: number, y: number): void {
    page.drawText(text.toUpperCase(), {
      x: width / 2 - (boldFont.widthOfTextAtSize(text, 12) / 2),
      y,
      size: 13,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }

  function addSubSideHeading(page: PDFPage, text: string, width: number, y: number): void {
    page.drawText(text.toUpperCase(), {
      x: width / 2 - (boldFont.widthOfTextAtSize(text, 12) / 2),
      y,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }
  function addContent(page: PDFPage, text: string, width: number, startY: number, font: PDFFont): number {
    let y = startY;
    const margin = 50;
    const maxWidth = width - margin * 2;
    const fontSize = 12;
    const lines = text.split("\n");

    // Example dynamic values
    const dynamicValues: Record<string, string> = {
      name,
      Spouse_name,
      child_name_1,
      child_name_2
    };

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





  function addLeftSignatureLine(page: PDFPage, y: number): number {
    const x = 50; // Left side alignment

    // Draw the line
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });

    // Move down and add text
    y -= 15;
    page.drawText("Witness Signature", { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText("Print Name of Witness", { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText("Address", { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText("Telephone Number", { x, y, size: 12, font: boldFont });

    return y - 20;
  }

  function addRightSignatureLine(page: PDFPage, y: number): number {
    const x = 300; // Right side alignment

    // Draw the line
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });

    // Move down and add text
    y -= 15;
    page.drawText("Witness Signature", { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText("Print Name of Witness", { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText("Address", { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText("Telephone Number", { x, y, size: 12, font: boldFont });

    return y - 20;
  }

  //page 8 functions
  function addStateCountySection(page: PDFPage, y: number): number {
    const x = 50; // Left alignment

    // State Section
    page.drawText("STATE OF TEXAS", { x, y, size: 12, font: boldFont });
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

  function addtestator(page: PDFPage, y: number, text: string): number {
    const pageWidth = page.getWidth(); // Get the width of the page
    const textToDraw = text ? `${text} , Testator` : `______________________ , Testator`; // Determine the text to draw
    const textWidth = boldFont.widthOfTextAtSize(textToDraw, 12); // Calculate the width of the text
    const xPosition = pageWidth - textWidth - 50; // Adjust the x position for right alignment (increase offset)

    // Draw the text at the calculated position
    page.drawText(textToDraw, { x: xPosition, y: y - 20, size: 12, font: boldFont });

    return y - 30; // Return the new y position
  }


  function addBlank(page: PDFPage, y: number, x: number): number {
    page.drawText(`${name ? `${name}` : `________________`}`, {
      x,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    return y - 20;
  }
  let x = 50;


  function addFooter(page: PDFPage, width: number, pageNumber: number): void {
    page.drawText(`Page ${pageNumber}`, { x: 50, y: 30, size: 10, font: timesNewRomanFont });

  }

  function addNewPage(pdfDoc: PDFDocument): PDFPage {
    return pdfDoc.addPage([595.28, 841.89]);
  }

  //page 1
  let page: PDFPage = addNewPage(pdfDoc);
  const { width, height } = page.getSize();
  let y: number = height - 80;

  //page 1
  addHeader(page,"Estate Planning",x+390,y+55,boldFont,20);

  addTitle(page, "LAST WILL AND TESTAMENT", width, height);
  addTitle(page, "OF", width, height - 20);
  y = addBlank(page, y - 20, x + 10);

  const content: string = 'I, ${name} a resident of and domiciled in Frisco, Denton County, Texas, do make, publish, and declare this to be my Last Will and Testament, hereby revoking all Wills and Codicils heretofore made by me.\n\nI am married to ${Spouse_name} Any reference in my Will to “my spouse” is to ${Spouse_name} \n\nThe terms “my children” and “my child” as used herein shall refer only to my daughters ${child_name_1} and ${child_name_2} and any child or children hereafter born to or legally adopted by me.';
  y = addContent(page, content, width, y, timesNewRomanFont);

  addSideHeading(page, "ARTICLE 1.", width, y);
  y -= 20;
  addSubSideHeading(page, "PAYMENT OF DEBTS", width, y);
  y -= 30;

  const newcontent: string = 'I direct my Executor to pay from my residuary estate all of my debts that are allowed as claims against my estate, expenses of my last illness, my funeral and burial expenses, including the cost of a suitable monument at my grave, as soon as practicable after my death, without apportionment and with no right of reimbursement from any recipient of any such property (including reimbursement under Section 2207B of the Internal Revenue Code), except that any debt or expense secured by a mortgage on real property owned by me at the time of my death shall not be paid by my estate. Any real property distributed hereunder shall pass subject to any mortgage thereon. The payment of all other debts, obligations, and costs of administration of my estate is to be made in the sole and absolute discretion of my Executor. This paragraph shall not be construed to require the payment of any debt before it is due, and my Executor is specifically given the right to renew and extend, in any form my Executor deems best, any debt existing at the time of my death, including any mortgage on my home. Any generation skipping transfer tax under Chapter 13 of the Internal Revenue Code shall be charged to the property constituting the generation skipping transfer on which such tax is imposed, as provided in Section 2603(b) of the Code.  I authorize my Executor to elect to defer the payment of taxes under Section 6166 of the Internal Revenue Code or applicable state law and, if such election is made, to charge interest on the deferred tax to income or principal and to create a lien on property belonging to my estate for the deferred tax under Section 6324A of the Code or applicable state law.';
  y = addContent(page, newcontent, width, y, timesNewRomanFont);

  addSideHeading(page, "ARTICLE 2.", width, y);
  y -= 20;
  addSubSideHeading(page, "Devise of Principal Residence", width - 10, y);
  y -= 30;

  const articlecontent2: string = '2.1 Upon my death, I give my interest in any real property, including improvements and buildings, used by my spouse as my spouse principal residence to my spouse, currently 2243 Kittyhawk Dr, Frisco, Texas 75033. This gift includes insurance policies on the property and any claims under those policies.  The property will be distributed subject to all liens and encumbrances against the property that exist at my death. ';
  y = addContent(page, articlecontent2, width, y, timesNewRomanFont);

  addFooter(page, width, 1);

  //page 2
  // Create a new page
  page = addNewPage(pdfDoc);
  const { width: width2, height: height2 } = page.getSize();
  let y2 = height2 - 80;

  addHeader(page,"Estate Planning",x+390,y2+55,boldFont,20);

  const content2: string = '2.2   I give all my interest in the principal residence in which I am living at the time of my death to my spouse if my spouse survives me by thirty (30) days. This bequest shall include the real property and any improvements to it as well as all rights under any insurance policies relating to the property. This bequest is made subject to any indebtedness secured by such property. This bequest shall apply to any property that is my principal residence at the time of my death. If my spouse does not survive me by thirty (30) days, my principal residence shall pass as part of my residuary estate.';
  y2 = addContent(page, content2, width2 + 20, y2 + 20, timesNewRomanFont);

  addSideHeading(page, "ARTICLE 3.", width2, y2);
  y2 -= 20;
  addSubSideHeading(page, "Disposition of Tangible Personal Property ", width2, y2);
  y2 -= 30;

  const content3: string = '3.1   I give and bequeath all my tangible personal property and household effects of every kind, including but not limited to furniture, appliances, furnishings, pictures, silverware, china, glass, books, jewelry, wearing apparel, boats, automobiles, and other vehicles (hereinafter in this Article referred to collectively as “Personal Property”), but specifically excluding cash on hand, cash in bank accounts, insurance proceeds, closely held business interests, stocks and bonds, and all other intangible personal property, according to the terms of a handwritten Memorandum for Distribution of Personal Property, which may be dated subsequent to this Last Will and Testament and which I may leave in existence at the time of my death. Any such writing prepared by me must be dated and signed. I request that such terms apply to the disposition of the Personal Property described therein. I understand, however, that my Executor may not be legally bound to make the distributions set forth in such memorandum, I nevertheless request that the directions contained in same be honored. Any Personal Property given and bequeathed to a beneficiary who is not living at the time of my death and for whom no effective alternate provision has been made shall pass as otherwise provided herein as if such memorandum did not exist. If no such memorandum is found or identified by my Executor within thirty (30) days after my Executor’s qualification, or if any such memorandum is deemed unenforceable or is not respected, then it shall be conclusively presumed that there is no such memorandum.\n 3.2   In default of such memorandum, or to the extent my Executor does not completely or effectively dispose of all my Personal Property pursuant to such memorandum, I give and bequeath such remaining Personal Property to my children who shall survive me, to be divided between them by my Executor according to my children’s personal preferences. If my children cannot reach a total and unequivocal agreement between themselves as to the distribution of such Personal Property or if none of my children survive me, then I direct my Executor to sell my Personal Property and to distribute the proceeds as part of my residuary estate.\n 3.3   Notwithstanding anything herein, if any child of mine entitled to a share of my Personal Property shall be a minor at the time of my death, I authorize my Executor, in my Executor’s discretion, to choose items of Personal Property for my minor child and to retain such share for my minor child during his or her minority, or to deliver all or any part of such share in kind to the guardian, parent, or to the person with whom my minor child may reside, or, if my Executor shall deem it advisable, to sell such Personal Property and to distribute the proceeds as part of my residuary estate.';
  y2 = addContent(page, content3, width2 + 20, y2 + 7, timesNewRomanFont);

  // Add footer to the new page
  addFooter(page, width2, 2);


  //page 3
  // Create a new page
  page = addNewPage(pdfDoc);
  const { width: width3, height: height3 } = page.getSize();
  let y3 = height3 - 80;

  addHeader(page,"Estate Planning",x+390,y3+55,boldFont,20);


  addSideHeading(page, "ARTICLE 4.", width3, y3);
  y3 -= 20;
  addSubSideHeading(page, "Disposition of Residuary Estate", width3, y3);
  y3 -= 30;

  const artcontent4: string = '4.1 All the rest, residue, and remainder of the property which I may own at the time of my death, real, personal and mixed, tangible and intangible, of whatsoever nature and wheresoever situated, including all property which I may acquire or become entitled to after the execution of this Last Will and Testament, including all lapsed legacies, devises, or other gifts made by this Last Will and Testament which fail for any reason, I bequeath and devise to my issue, in equal and separate shares so as to provide one (1) share for each child of mine living at the time of my death and one (1) share for each deceased child of mine who shall have issue living at the time of my death. Each living child’s share shall be distributed and paid over to such living child. Each deceased child’s share shall be distributed to such deceased child’s then living issue, per stirpes.'
  y3 = addContent(page, artcontent4, width3 + 10, y3 + 8, timesNewRomanFont)


  addSideHeading(page, "ARTICLE 5.", width3, y3);
  y3 -= 20;
  addSubSideHeading(page, "In Event of Death of All Beneficiaries", width3, y3 + 3);
  y3 -= 30;

  const artcontent5: string = 'In the event that all beneficiaries identified in the Articles above (1) do not survive me or no longer exist as of my date of death or (2) are not living or not in existence at the time a distribution of assets or the final distribution of assets subject to this Last Will and Testament should be made, and the distribution of assets subject to this Last Will and Testament is not otherwise provided for hereunder, the Executor shall divide any and all remaining assets, including accrued income, into two (2) equal shares, and shall distribute said shares as follows: (1)  One (1) share shall be distributed to my heirs-at-law, determined as of the date of death of the last individual having rights under this Last Will and Testament, in such proportions as determined by the State of Texas laws of descent and distribution; and (2)  One (1) share shall be distributed to the heirs-at-law of my spouse, determined as of the date of death of the last individual having rights under this Last Will and Testament, in such proportions as determined by the State of Texas laws of descent and distribution.'
  y3 = addContent(page, artcontent5, width3 + 10, y3 + 8, timesNewRomanFont)

  addSideHeading(page, "ARTICLE 6.", width3, y3 + 2);
  y3 -= 20;
  addSubSideHeading(page, "Beneficiaries Receiving Government Assistance", width3, y3 + 2);
  y3 -= 30;

  const artcontent6: string = 'Notwithstanding anything to the contrary contained herein, if my Executor reasonably believes that a beneficiary under my Last Will and Testament is receiving (or may receive) government benefits under federal or state means-tested government benefit programs, then my Executor may, in my Executor’s sole discretion, withhold any distribution due under this Last Will and Testament to or for such beneficiary until such time as my Executor determines the proper vehicle for distribution. If a special needs trust has been established for the benefit of any beneficiary hereunder, then upon confirmation by the Trustee that it solely benefits a beneficiary hereunder, my Executor shall have the absolute discretion to distribute such beneficiary’s share under my Last Will and Testament to such special needs trust. If there is not an existing special'
  y3 = addContent(page, artcontent6, width3 + 10, y3 + 8, timesNewRomanFont)

  // Add footer to the new page
  addFooter(page, width3, 3);


  //page 4
  // Create a new page
  page = addNewPage(pdfDoc);
  const { width: width4, height: height4 } = page.getSize();
  let y4 = height4 - 80;

  addHeader(page,"Estate Planning",x+390,y4+55,boldFont,20);
  const artcontent6remaining: string = 'needs trust, then my Executor may create or retain such beneficiarys share as a discretionary, nonsupport, spendthrift trust share for the benefit of such beneficiary. Alternatively, my Executor may establish a third-party supplemental care trust for such beneficiary with such terms as my Executor deems appropriate. I intend that any beneficiary under my Last Will and Testament who is receiving (or may receive) government benefits under federal or state means-tested government benefit programs shall remain eligible for such government benefits, and I direct my Executor to construe the meaning of this paragraph in accordance with my intention.'
  y4 = addContent(page, artcontent6remaining, width4 + 10, y4 + 8, timesNewRomanFont)


  addSideHeading(page, "ARTICLE 7.", width4, y4);
  y4 -= 20;
  addSubSideHeading(page, "Appointment of Independent Executor", width4, y4);
  y4 -= 30;

  const artcontent7: string = '7.1  I nominate, constitute, and appoint my spouse ${Spouse_name} as Independent Executor of my Last Will and Testament.\n 7.2   I direct that no bond, or if required, no surety, be required for any natural person serving in such capacity hereunder. Any substitute or successor Executor shall succeed as Executor as though originally identified as the Executor under this Last Will and Testament. All authority, powers, and discretions conferred on the original Executor under this Last Will and Testament shall pass to any successor Executor. No successor Executor shall be responsible for the acts or omissions of any prior Executor, nor shall any successor Executor be under a duty to audit or investigate the accounts or administration of any prior Executor. Unless requested in writing by a beneficiary of this Last Will and Testament, no successor Executor shall have any duty to take any action to obtain redress for any breach of fiduciary duties committed by any prior Executor.'
  y4 = addContent(page, artcontent7, width4 + 10, y4 + 8, timesNewRomanFont)


  addSideHeading(page, "ARTICLE 8.", width4, y4);
  y4 -= 20;
  addSubSideHeading(page, "Executor Powers", width4, y4);
  y4 -= 30;


  const artcontent8: string = 'No action shall be had in any court of probate jurisdiction in relation to the settlement of my estate other than the probating and recording of this Will and if required, the return of inventory, appraisement, and list of claims of my estate. In addition to all those powers granted by the Texas Estates Code and Texas Property Code, my Executor is specifically authorized and empowered with respect to any property, real or personal, at any time held under any provision of my Last Will and Testament: to allot, allocate between principal and income, assign, borrow, buy, care for, collect, compromise claims, contract with respect to, continue any business of mine, sell, convey, convert, deal with, dispose of, enter into, exchange, hold, improve, incorporate any business of mine, invest, lease, manage, mortgage, grant and exercise options with respect to, take possession of, pledge, receive, release, repair, sue for, make distributions or divisions in cash or in kind or partly in each without regard to the income tax basis of such asset and, in general, to exercise all of the powers in the management of my estate which any individual could exercise in the management of similar property owned in its own right, upon such terms and conditions as my Executor may deem best, to execute and deliver any and all instruments, and to do all acts which my Executor may deem proper or necessary to carry out the purposes of this Last Will and Testament, without being limited in any way by the specific grants of power made, '
  y4 = addContent(page, artcontent8, width4 + 10, y4 + 8, timesNewRomanFont)


  // Add footer to the new page
  addFooter(page, width3, 4);



  //page 5


  page = addNewPage(pdfDoc);
  const { width: width5, height: height5 } = page.getSize();
  let y5 = height5 - 80;

  addHeader(page,"Estate Planning",x+390,y5+55,boldFont,20);

  const artcontent8remain: string = 'and without the necessity of a court order. My Executor shall have the authority to determine what property shall receive basis increases pursuant to Section 1022(b) and (c) of the Internal Revenue Code and the amount of such increases and to make such determinations without regard to any duty of impartiality as between different beneficiaries. I suggest, but do not direct, that the step-up in basis be allocated to assets with readily ascertainable fair market value and that the benefit of the step-up in basis be equitably adjusted among the beneficiaries of my estate.'
  y5 = addContent(page, artcontent8remain, width5 + 10, y5 + 8, timesNewRomanFont)


  addSideHeading(page, "ARTICLE 9.", width5, y5);
  y5 -= 20;
  addSubSideHeading(page, "Executor Powers", width5, y5);
  y5 -= 30;

  const artcontent9: string = 'If my spouse and I should die under such circumstances that there is not sufficient evidence to determine the order of death, then it shall be presumed that my spouse predeceased me, and this Last Will and Testament shall be administered and distributed in all respects in accordance with said presumption.'
  y5 = addContent(page, artcontent9, width5 + 10, y5 + 8, timesNewRomanFont)

  addSideHeading(page, "ARTICLE 10.", width5, y5);
  y5 -= 20;
  addSubSideHeading(page, "Payment of Taxes", width5, y5);
  y5 -= 30;


  const artcontent10: string = 'All taxes payable by reason of my death (“death taxes”), including any interest and penalties thereon, on account of the inclusion in my estate of property, whether passing under this Last Will and Testament or otherwise, from which payment is not otherwise directed or which is not otherwise exonerated, will be apportioned against and paid by the recipients of such property to which such tax is attributable in the proportion that the value of the property received by a recipient bears to the total value of the property received by all such recipients (using for this purpose the values as finally determined in the federal estate tax proceeding relating to my estate). Taxes imposed by Chapter 13, or sections 2032A(c) or 2057(f)(2), of the Code will be apportioned against and paid by the recipient of the property to which such tax is attributable. If my personal representative elects to defer estate and inheritance taxes on certain property under section 6166 of the Code, such taxes will be apportioned against and paid by the recipient of such property. The recipient of property the gift of which caused gift tax to be paid will be treated as having received not only the gift property but also the amount of any gift tax included in my estate by section 2035(b) of the Code for purposes of apportionment. The benefit of a deduction, credit, reduction, or exemption under any provision of the Code (for instance, due to the marital or charitable deductions, the previously taxed property credit, the reduction in value under sections 2032A or 2057, a state or foreign death tax credit, a credit for gift taxes paid, the applicable credit amount (unified credit), or otherwise) will inure to the recipient of the property to which such benefit is attributable. The Executor may pay any taxes from the estate prior to recovering the attributable tax from the recipient of the property, or may subtract the attributable tax from such recipient’s share, as the Executor deems advisable. The term “death taxes” does not include any generationskipping transfer tax.'
  y5 = addContent(page, artcontent10, width5 + 10, y5 + 8, timesNewRomanFont)


  addSideHeading(page, "ARTICLE 11.", width5, y5);
  y5 -= 20;
  addSubSideHeading(page, "Miscellaneous", width5, y5);
  y5 -= 30;

  const artcontent11half: string = '11.1 All references to the term “issue” as used herein shall refer only to my children and their issue, including any issue born or legally adopted subsequent to the execution of this Last Will and Testament.'
  y5 = addContent(page, artcontent11half, width5 + 10, y5 + 8, timesNewRomanFont)

  // Add footer to the new page
  addFooter(page, width5, 5);


  //page 6

  page = addNewPage(pdfDoc);
  const { width: width6, height: height6 } = page.getSize();
  let y6 = height6 - 80;

  addHeader(page,"Estate Planning",x+390,y6+55,boldFont,20);

  const artcontent11: string = '11.2 Whenever a distribution is to be made to a person’s issue per stirpes, the\n' +
    'distribution will be divided into as many equal shares as there are then-living children of that\n' +
    'person and deceased children of that person who left then-living descendants. Each then-living\n' +
    'child will receive one (1) share and the share of each deceased child will be divided among the\n' +
    'deceased child’s then-living descendants in the same manner.\n' +
    '11.3 The article headings herein are inserted only as a matter of convenience and for\n' +
    'reference, and shall in no way be construed to define, limit, or describe the scope or intent of any\n' +
    'provisions contained in this Last Will and Testament, nor in any way affect this Last Will and\n' +
    'T testament.\n' +
    '11.4 Any references herein to the “Code” are to the Internal Revenue Code of 1986, as\n' +
    'amended, any subsequent similar federal provisions, and will include similar provisions of any\n' +
    'state law.\n' +
    '11.5 For purposes of this Last Will and Testament, words in any gender shall include all\n' +
    'genders, and words in the singular shall include the plural and vice versa, in each case unless the\n' +
    'context otherwise requires.\n' +
    '11.6 My Executor shall not be personally liable for withholding an insufficient amount\n' +
    'as a setoff against the liability of a recipient or for failing to recover attributable taxes or interest\n' +
    'following reasonable efforts, and shall not be required to litigate to enforce apportionment unless\n' +
    'indemnified against the costs thereof.\n' +
    '11.7 My Executor’s selection of assets to be sold to pay death taxes, if any, and the tax\n' +
    'effects thereof, shall not be subject to question by any beneficiary. My Executor is hereby\n' +
    'indemnified against any liability it may incur to any recipient of property not passing under this\n' +
    'will for the effect of any action taken in the computation or payment of death taxes that directly or\n' +
    'indirectly affects any recipient’s liability under this provision. Elections or allocations authorized\n' +
    'under the Code may be made by my Executor in its discretion without regard to or liability for the\n' +
    'effect thereof on any beneficiary. No adjustment shall be made between income and principal, in\n' +
    'the relative interests of the recipients, or in the amount or selection of assets allocated to any\n' +
    'beneficiary under this will, to compensate for the effect of any such action or for the effect on the\n' +
    'amount of any tax attributable to any recipient of property includible in my estate for death tax purposes.\n';
  y6 = addContent(page, artcontent11, width6 + 10, y6 + 8, timesNewRomanFont)

  y6 = addtestator(page, y6, `${Spouse_name}`)

  // Add footer to the new page
  addFooter(page, width6, 6);


  //page 7
  page = addNewPage(pdfDoc);
  const { width: width7, height: height7 } = page.getSize();
  let y7 = height7 - 80;

  addHeader(page,"Estate Planning",x+390,y7+55,boldFont,20);

  addTitle(page, "SELF-PROVING AFFIDAVIT", width7, height7);

  const AFFIDAVITcontent: string = 'I, ___________________________, as testator, after being duly sworn, declare to the undersigned witnesses and to the undersigned authority that this instrument is my will, that I have willingly made and executed it in the presence of the undersigned witnesses, all of whom were present at the same time, as my free act and deed, and that I have requested each of the undersigned witnesses to sign this will in my presence and in the presence of each other.  I now sign this will in the presence of the attesting witnesses and the undersigned authority on this the _______day of _________________, 2025.'
  y7 = addContent(page, AFFIDAVITcontent, width7 + 10, y7 + 8, timesNewRomanFont)


  y7 = addtestator(page, y7, `${Spouse_name}`)


  const contentpage7: string = 'The undersigned, __________________________ and ___________________________, each being at least fourteen (14) years of age, after being duly sworn, declare to the testator and to the undersigned authority that the testator declared to us that this instrument is the testators will and that the testator requested us to act as witnesses to the testators will and signature.  The testator then signed this will in our presence, all of us being present at the same time.  The testator is eighteen (18) years of age or over (or being under such age, is or has been lawfully married, or is a member of the armed forces of the United States or of an auxiliary of the armed forces of the United States or of the United States Maritime Service), and we believe the testator to be of sound mind.  We now sign our names as attesting witnesses in the presence of the testator, each other, and the undersigned authority on this the ______ day of _______________, 2025.'
  y7 = addContent(page, contentpage7, width7 + 10, y7 - 5, timesNewRomanFont)


  // Usage

  y7 = addLeftSignatureLine(page, y7 - 50);
  addRightSignatureLine(page, y7 + 175);


  // Add footer to the new page
  addFooter(page, width7, 7);


  //page 8

  page = addNewPage(pdfDoc);
  const { width: width8, height: height8 } = page.getSize();
  let y8 = height8 - 80;

  addHeader(page,"Estate Planning",x+390,y8+55,boldFont,20);

  y8 = addStateCountySection(page, y8);

  const contentpage8: string = 'Subscribed and sworn to before me by the said ${name} testator, and by the said ____________________________ and ____________________________, witnesses, this the ______ day of _______________, 2025.'
  y8 = addContent(page, contentpage8, width8 + 10, y8 - 20, timesNewRomanFont)


  y8 = addNotarySection(page, y8 - 10);


  // Add footer to the new page
  addFooter(page, width8, 8);


  const pdfBytes: Uint8Array = await pdfDoc.save();
  const blob: Blob = new Blob([pdfBytes], { type: "application/pdf" });
  const link: HTMLAnchorElement = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "LastWillAndTestament.pdf";
  link.click();
}
