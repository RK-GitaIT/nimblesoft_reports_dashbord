import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';

export async function generateAnimalCarePDF(data: any): Promise<void> {
  const pdfDoc: PDFDocument = await PDFDocument.create();
  const timesNewRomanFont: PDFFont = await pdfDoc.embedFont(
    StandardFonts.TimesRoman
  );
  const boldFont: PDFFont = await pdfDoc.embedFont(
    StandardFonts.TimesRomanBold
  );

  const {Successor,beneficiary,caregiver}=data;
  const {firstName,lastName,address}=beneficiary;
  const user1=firstName+lastName;
  const user1Address=address;
  const caregiven=caregiver[0]?.firstName + caregiver[0]?.lastName
  const successor =Successor[0]?.firstName + Successor[0]?.lastName
  const dynamicValues: Record<string, string> = {
    name:  user1,
    Spouse_name: 'Hio',
    address:user1Address,
    caregiven,
    agrement: "TRUST AGREEMENT",
    successor
  };


  function addHeader(
    page: PDFPage,
    text: string,
    x: number,
    y: number,
    font: PDFFont,
    size: number
  ): void {
    page.drawText(text, {
      x,
      y,
      font,
      size,
      color: rgb(0, 0, 0),
    });
  }

  function addTitle(
    page: PDFPage,
    text: string,
    width: number,
    height: number
  ): void {
    page.drawText(text.toUpperCase(), {
      x: width / 2 - boldFont.widthOfTextAtSize(text, 14) / 2,
      y: height - 80,
      size: 14,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }

  function addSideHeading(
    page: PDFPage,
    text: string,
    width: number,
    y: number
  ): void {
    page.drawText(text.toUpperCase(), {
      x: width / 2 - boldFont.widthOfTextAtSize(text, 12) / 2,
      y,
      size: 13,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }

  function addSubSideHeading(
    page: PDFPage,
    text: string,
    width: number,
    y: number
  ): void {
    page.drawText(text.toUpperCase(), {
      x: width / 2 - boldFont.widthOfTextAtSize(text, 12) / 2,
      y,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
  }

  function addContent(
    page: PDFPage,
    text: string,
    width: number,
    startY: number,
    font: PDFFont,
    boldWords: string[] = []
  ): number {
    let y = startY;
    const margin = 50;
    const maxWidth = width - margin * 2;
    const fontSize = 12;
    const lines = text.split('\n');

    // Example dynamic values
   

    lines.forEach((line) => {
      const rawTokens = line.split(
        /(\$\{.*?\}|(?<=\*\*)!\s*(?=\w+)|(?<=\w+)\s*!(?=\*\*))/g
      );
      const tokens: { text: string; bold: boolean }[] = [];

      rawTokens.forEach((token) => {
        const dynamicMatch = token.match(/^\$\{(.*?)\}$/);
        if (dynamicMatch && dynamicValues.hasOwnProperty(dynamicMatch[1])) {
          tokens.push({
            text: dynamicValues[dynamicMatch[1]] || '__________',
            bold: true,
          });
        } else if (token.startsWith('**') && token.endsWith('**')) {
          const boldText = token
            .substring(2, token.length - 2)
            .replace(/!/g, ' ');
          tokens.push({ text: boldText, bold: true });
        } else {
          const words = token.split(' ');
          words.forEach((word, index) => {
            const wordWithSpace = word + (index < words.length - 1 ? ' ' : '');
            if (wordWithSpace) {
              tokens.push({
                text: wordWithSpace,
                bold: boldWords.includes(word.trim()),
              });
            }
          });
        }
      });

      let currentLineTokens: { text: string; bold: boolean }[] = [];
      let currentLineText = '';

      tokens.forEach((token) => {
        const testLine = currentLineText + token.text;
        if (font.widthOfTextAtSize(testLine, fontSize) > maxWidth) {
          // If the line exceeds max width, draw the current line and reset
          let x = margin;
          currentLineTokens.forEach((tk) => {
            const chosenFont = tk.bold ? boldFont : font;
            page.drawText(tk.text, {
              x,
              y,
              size: fontSize,
              font: chosenFont,
              color: rgb(0, 0, 0),
            });
            x += chosenFont.widthOfTextAtSize(tk.text, fontSize);
          });
          y -= 20; // Adjust line height if needed
          currentLineTokens = [token];
          currentLineText = token.text;
        } else {
          currentLineTokens.push(token);
          currentLineText += token.text;
        }
      });

      if (currentLineTokens.length > 0) {
        let x = margin;
        currentLineTokens.forEach((tk) => {
          const chosenFont = tk.bold ? boldFont : font;
          page.drawText(tk.text, {
            x,
            y,
            size: fontSize,
            font: chosenFont,
            color: rgb(0, 0, 0),
          });
          x += chosenFont.widthOfTextAtSize(tk.text, fontSize);
        });
        y -= 20; // Adjust line height if needed
      }
      y -= 10; // Add extra space after each line
    });

    return y;
  }

  function addFooter(page: PDFPage, width: number, pageNumber: number): void {
    page.drawText(`Page ${pageNumber}`, {
      x: width - 50,
      y: 30,
      size: 10,
      font: timesNewRomanFont,
    });
  }
  function addLeftSignatureLine(page: PDFPage, y: number): number {
    const x = 50; // Left side alignment

    // Draw the line
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });

    // Move down and add text
    y -= 15;
    page.drawText('Witness Signature', { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText('Print Name of Witness', { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText('Address', { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText('Telephone Number', { x, y, size: 12, font: boldFont });

    return y - 20;
  }

  function addRightSignatureLine(page: PDFPage, y: number): number {
    const x = 300; // Right side alignment

    // Draw the line
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });

    // Move down and add text
    y -= 15;
    page.drawText('Witness Signature', { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText('Print Name of Witness', { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText('Address', { x, y, size: 12, font: boldFont });

    y -= 30;
    page.drawLine({ start: { x, y }, end: { x: x + 200, y }, thickness: 1 });
    y -= 15;
    page.drawText('Telephone Number', { x, y, size: 12, font: boldFont });

    return y - 20;
  }

  //page 8 functions
  function addStateCountySection(page: PDFPage, y: number): number {
    const x = 50; // Left alignment

    // State Section
    page.drawText(`STATE OF ${address}`, { x, y, size: 12, font: boldFont });
    page.drawText('                  )', {
      x: x + 150,
      y,
      size: 12,
      font: boldFont,
    });

    y -= 20;
    //for empty space
    page.drawText('', { x, y, size: 12, font: boldFont });
    page.drawText('                             ) SS', {
      x: x + 110,
      y,
      size: 12,
      font: boldFont,
    });
    y -= 15;
    // County Section
    page.drawText('COUNTY OF', { x, y, size: 12, font: boldFont });
    page.drawText('                             ) ', {
      x: x + 110,
      y,
      size: 12,
      font: boldFont,
    });

    return y - 30;
  }

  function addNotarySection(page: PDFPage, y: number): number {
    const x = 50;

    y -= 40;
    page.drawText('(SEAL)', { x, y, size: 12, font: boldFont });

    y -= 15;
    page.drawLine({
      start: { x: x + 180, y: y + 5 },
      end: { x: x + 450, y: y + 5 },
      thickness: 1,
    });
    page.drawText('NOTARY PUBLIC', {
      x: x + 300,
      y: y - 10,
      size: 12,
      font: boldFont,
    });

    y -= 15;
    page.drawText('My commission expires:', {
      x: x + 150,
      y: y - 20,
      size: 12,
    });
    page.drawLine({
      start: { x: x + 300, y: y - 16 },
      end: { x: x + 450, y: y - 16 },
      thickness: 1,
    });

    return y - 30;
  }
  function addNewPage(pdfDoc: PDFDocument): PDFPage {
    return pdfDoc.addPage([600, 930]); // Increased page size
  }

  // Page 1
  let page: PDFPage = addNewPage(pdfDoc);
  const { width, height } = page.getSize();
  let y: number = height - 80;

  addHeader(page, 'Estate Planning', 390, y + 55, boldFont, 20);
  addTitle(page, 'KRISHNA GAUTAM TALLURI ANIMAL CARE TRUST', width, height);

  const content: string =
    'I, ${name} of , County, Missouri, as Settlor, hereby enter into this ${agrement} with ${name} as Trustee, on this the______ day of _______________, 2025.';
  const contentbold = [
    'I',
    'KRISHNA',
    'GAUTAM',
    'TALLURI',
    'TRUST',
    'AGREEMENT',
  ];
  y = addContent(page, content, width, y - 40, timesNewRomanFont, contentbold);

  addSideHeading(page, 'WITNESSETH:', width, y - 10);

  addSideHeading(page, 'ARTICLE 1.', width, y - 30);
  y -= 20;
  addSubSideHeading(page, 'Recitals/Definitions ', width, y - 25);
  y -= 30;

  const articleContent1: string =
    '1.1 This Trust will be known as the ${name} a revocable trust which will become irrevocable upon my death. This Trust is a Grantor Trust during my lifetime under Code §§ 671-678 and I am the Grantor for income tax purposes.\n' +
    '1.2 The property subject to this Trust and any other Trust created hereby shall be held, administered, and distributed in accordance with the terms of this Trust Agreement.\n' +
    '1.3 All references in this Trust Agreement to “I,” “me,” “my,” or to “the Settlor” are to ${name}.\n' +
    '1.4 All references to “my spouse” are to ${Spouse_name}.\n' +
    '1.5 All references in the Trust Agreement to “my pets” are to any pet I own at the time of my death. My pets or domestic animals now living are: \n' +
    '1.6 A disposition in this Trust Agreement to the issue of a person in per stirpital parts, or to the issue of a person, per stirpes, shall be deemed to require a division into a sufficient number of equal shares to make one (1) such share for each child of such person living at the time such disposition becomes effective and one (1) share for each then deceased child of such person having one (1) or more issue then living, regardless of whether any child of such person is then living, with the same principle applied in any required further division of a share at a more remote generation.\n' +
    '1.7 All references to the “Code” are to the Internal Revenue Code of 1986, as amended.\n' +
    '1.8 An individual will be considered “disabled” or under a “disability” when a legal guardian is appointed for the individual or the Trustee has written confirmation of two (2) licensed and practicing physicians and/or psychiatrists stating that such individual is unable to make informed decisions with respect to his or her financial resources to such an extent that the individual lacks the capacity to effectively manage his or her real or personal property by those actions necessary to obtain, administer, manage, or dispose of such property.\n' +
    '1.9 The term “distributable net income” will be defined in the same manner as under Section 643(a) of the Code. Any payment of distributable net income provided for herein will be';

  y = addContent(page, articleContent1, width, y - 25, timesNewRomanFont);
  addFooter(page, width, 1);

  // Page 2
  page = addNewPage(pdfDoc);
  const { width: width2, height: height2 } = page.getSize();
  let y2 = height2 - 80;

  addHeader(page, 'Estate Planning', 390, y2 + 55, boldFont, 20);

  const content2: string =
    'made first from net accounting income, next from net realized short-term capital gains, and then from net realized long-term capital gains.\n' +
    '1.10 All references in this Trust Agreement to a “Charitable Organization” are to any qualifying charitable organization as defined by Sections 501(c)(3), 170(b)(1)(A), 170(c), 2055(a), and 2522(a) of the Code, including both publicly and privately established charitable organizations.\n' +
    '1.11 All references in this Trust Agreement to a “Termination Date” are to the date (a) that is twenty-one (21) years after the date of my death, (b) upon which none of my pets covered by this Animal Care Trust are living, or (c) when no property remains to care for my pets.\n' +
    '1.12 I hereby transfer and deliver to the Trustee the sum of One Dollar ($1.00). The Trustee is authorized to accept and administer additional gifts or transfers of property from me, or from other persons or entities, whether by lifetime gift, will, codicil, or beneficiary designation. All such assets are to be held, with any future additions, IN TRUST, and the Trustee is directed to invest and reinvest the same and to dispose of the income and principal in accordance with the terms of this Trust Agreement.';
  y2 = addContent(page, content2, width2, y2, timesNewRomanFont);
  addSideHeading(page, 'ARTICLE 2.', width2, y2);
  addSubSideHeading(page, 'Disposition During My Lifetime', width2, y2 - 15);

  const content6: string =
    '2.1 I may, by written notice to the Trustee, revoke or amend this Trust Agreement or withdraw assets at any time. No amendment changing the compensation, powers, or duties of the Trustee will be effective unless approved in writing by the Trustee; however, I may remove the Trustee at any time without giving notice to the Trustee. The power to amend or revoke this Trust Agreement is personal to me and may not be exercised by my agent or legal representative. The Trustee will return to me all assets then owned by the Trust if I revoke this Trust Agreement.\n' +
    '2.2 The Trustee will distribute from the distributable net income and/or principal of the Trust such amounts as I may request, or if I am disabled, then the Trustee will determine when to distribute the distributable net income and/or principal of the Trust for my benefit. The Trustee may also distribute the principal of this Trust to me for purposes of allowing me to hold title to any Trust assets in my individual name.\n' +
    '2.3 The remaining distributable net income, if any, will be accumulated and added to the principal of the Trust on an annual basis.';
  y2 = addContent(page, content6, width2, y2 - 30, timesNewRomanFont);

  addSideHeading(page, 'ARTICLE 3.', width2, y2);
  addSubSideHeading(page, 'Assets of the Trust at My Death', width2, y2 - 15);
  addFooter(page, width2, 2);

  const content31: string =
    '3.1 Beginning on the date of my death, the Trustee will hold and administer the trust estate, including the proceeds of all life insurance and all property then or thereafter receivable by the Trustee, or which may become payable to the Trustee under the terms of my Last Will and Testament, or otherwise, as provided in this ARTICLE 3.';
  y2 = addContent(page, content31, width2, y2 - 30, timesNewRomanFont);

  // Page 3
  page = addNewPage(pdfDoc);
  const { width: width3, height: height3 } = page.getSize();
  let y3 = height3 - 80;

  addHeader(page, 'Estate Planning', 390, y3 + 55, boldFont, 20);

  const contentarticle3: string =
    '3.2 Upon my death, I wish to provide for the care and financial support for the feeding, watering, grooming, housing, and veterinary care of my pets.\n' +
    '3.3 Until the Termination Date, the Trustee shall, from time to time, distribute as much of the net income or principal, or both, of this Animal Care Trust as the Trustee determines advisable to provide for the health, maintenance, and support of my pets under this Animal Care Trust. My pets are to be kept in comfort, well fed, suitably housed, and are to receive whatever veterinary care is necessary to their health (hereinafter referred to as “Proper Care”).\n' +
    '3.4 The distribution may be paid to my Caregiver or by direct payment to the provider for the expenses of my pets. The Trustee may require my Caregiver to provide written documentation of any expenses before the disbursement of trust funds.\n' +
    '3.5 No portion of the principal and income may be converted to the use of my Caregiver or the Trustee, other than for expenses of administration, or to any use other than for the Trust’s purposes or for the benefit of my pets under this Animal Care Trust.\n' +
    '3.6 This Trust shall terminate on the Termination Date. Upon termination, the Trustee shall distribute the unexpended trust property in accordance with ARTICLE 4.\n' +
    '3.7 My Caregiver shall have the authority and duty to enforce the intended use of the principal and income of this Animal Care Trust, including the obtaining of equitable relief from the appropriate court in the jurisdiction where my pets are located. However, if my Caregiver is also acting as the Trustee, any remainder beneficiary under this Animal Care Trust, or any person having an interest in the welfare of my pets covered by this Animal Care Trust, may enforce the income and principal provisions of this Animal Care Trust.\n' +
    '3.8 The Animal Care Trust created under this ARTICLE 3 and the Trustee shall be subject to the laws of the State of Missouri applying to trusts and trustees, now in effect or as amended. Any property held in this Animal Care Trust or the trust itself shall not be subject to any statutory or common law rule against perpetuities.';
  y3 = addContent(page, contentarticle3, width3, y3, timesNewRomanFont);

  addSideHeading(page, 'ARTICLE 4.', width3, y3);
  addSubSideHeading(page, 'Disposition Upon Death of My Pets', width3, y3 - 15);
  addSideHeading(page, 'ARTICLE 5.', width3, y3 - 45);
  addSubSideHeading(
    page,
    'In Event of Death of All Beneficiaries',
    width3,
    y3 - 60
  );

  const contentarticle4: string =
    'In the event that all beneficiaries identified above (1) do not survive me or no longer exist as of my date of death or (2) are not living or not in existence at the time a distribution of assets or the final distribution of assets subject to this Trust Agreement should be made, and distribution thereof is not otherwise provided for under other provisions of this Trust Agreement, the Trustee shall distribute any and all remaining assets of the Trust, including accrued income, to my heirs-at-law, determined as of the date of death of the last individual having rights under the Trust, in such proportions as determined by the State of Missouri’s laws of descent and distribution.';
  y3 = addContent(page, contentarticle4, width3, y3 - 85, timesNewRomanFont);
  addFooter(page, width3, 3);

  // Page 4
  page = addNewPage(pdfDoc);
  const { width: width4, height: height4 } = page.getSize();
  let y4 = height4 - 80;

  addHeader(page, 'Estate Planning', 390, y4 + 55, boldFont, 20);
  addSideHeading(page, 'ARTICLE 6.', width4, y4);
  addSubSideHeading(
    page,
    'Beneficiaries Receiving Government Assistance',
    width4,
    y4 - 15
  );

  const contentarticle6: string =
    'Notwithstanding anything to the contrary contained herein, if the Trustee reasonably believes that a beneficiary under this Trust Agreement is receiving (or may receive) government benefits under federal or state means-tested government benefit programs, then the Trustee may, in the Trustee’s sole discretion, withhold any distribution due under this Trust Agreement to or for such beneficiary until such time as my Executor determines the proper vehicle for distribution. If a special needs trust has been established for the benefit of any beneficiary hereunder, then upon confirmation by the Trustee that it solely benefits a beneficiary hereunder, the Trustee shall have the absolute discretion to distribute such beneficiary’s share under my Will to such special needs trust. If there is not an existing special needs trust, then the Trustee may create or retain such beneficiary’s share as a discretionary, non-support, spendthrift trust share for the benefit of such beneficiary. Alternatively, the Trustee may establish a third-party supplemental care trust for such beneficiary with such terms as the Trustee deems appropriate. I intend that any beneficiary under this Trust Agreement who is receiving (or may receive) government benefits under federal or state means-tested government benefit programs shall remain eligible for such government benefits, and I direct the Trustee to construe the meaning of this paragraph in accordance with my intention.';
  y4 = addContent(page, contentarticle6, width4, y4 - 30, timesNewRomanFont);

  addSideHeading(page, 'ARTICLE 7.', width4, y4);
  addSubSideHeading(
    page,
    'Appointment of Caregiver of My Pets',
    width4,
    y4 - 15
  );

  const contentarticle7: string =
    '7.1 I appoint my daughter ${caregiven} as Caregiver of my pets (“my Caregiver”). My Caregiver shall make all decisions regarding the housing, diet, exercise, breeding, training, and veterinary care of my pets as applicable.\n' +
    '7.2 If no Caregiver is willing or able to provide my pets with Proper Care, then the Trustee shall have the discretion to give my pets to another person, persons, animal care organization, or perpetual care organization that agrees to provide my pets with Proper Care.\n' +
    '7.3 If my pets are distributed to an animal care organization in accordance with this Section, it is my intent that the Trustee cooperates with the animal care organization in finding a permanent adoptive home for my pets.\n' +
    "7.4 My Caregiver is given full and complete control and authority regarding veterinary care and treatment of my pets, including euthanizing an animal after first determining from a licensed veterinarian practitioner that the animal’s injury or disease will impair its quality of life, including, but not limited to, sustained, severe, life-threatening and terminal injuries, terminal illness, aged condition or temperament. I hold my Caregiver harmless from any action or claim against my Caregiver based on my Caregiver's decision regarding veterinary care and treatment made as provided in this paragraph.\n" +
    '7.5 My Caregiver shall be responsible for obtaining from a licensed veterinarian an annual statement of health and well-being of my pets to present to the Trustee as a means of monitoring the health and condition of my pets.\n' +
    '7.6 I do not want my pets used for medical research or educational purposes.';
  y4 = addContent(page, contentarticle7, width4, y4 - 45, timesNewRomanFont);
  addFooter(page, width4, 4);

  // Page 5
  page = addNewPage(pdfDoc);
  const { width: width5, height: height5 } = page.getSize();
  let y5 = height5 - 80;

  addHeader(page, 'Estate Planning', 390, y5 + 55, boldFont, 20);
  addSideHeading(page, 'ARTICLE 8.', width5, y5);
  addSubSideHeading(page, 'Trustee and Successor Trustee', width5, y5 - 15);

  const contentarticle8: string =
    '8.1 I will serve as the initial Trustee of this Trust Agreement. If for any reason I am unable or unwilling to serve or continue to serve, I appoint my daughter ${successor} as substitute or successor Co-Trustees.\n' +
    '8.2 Any corporate successor to the trust business of any corporate Trustee designated herein or at any time acting hereunder will succeed to the capacity of its predecessor without conveyance or transfer.\n' +
    '8.3 Any corporate Trustee will be entitled to compensation as provided in its regularly published schedule of fees, which schedule may be amended by the corporate Trustee from time to time.\n' +
    '8.4 Any substitute or successor Trustee will succeed as Trustee as though originally identified as the Trustee under this Trust Agreement. All authority, powers, and discretions conferred on the original Trustee under this Trust Agreement will pass to any successor Trustee. No successor Trustee will be responsible for the acts or omissions of any prior Trustee, nor will any successor Trustee be under a duty to audit or investigate the accounts or administration of any prior Trustee. Unless requested in writing by a person having a present or future beneficial interest in any Trust, no successor Trustee will have any duty to take any action to obtain redress for any breach of trust committed by any prior Trustee.\n' +
    '8.5 The use of the term “Trustee” in this Trust Agreement will be a reference to the Trustee first above named and any substitute or successor Trustee as provided for herein.\n' +
    '8.6 No bond will be required of any natural person acting as Trustee hereunder.';

  y5 = addContent(page, contentarticle8, width5, y5 - 30, timesNewRomanFont);

  addSideHeading(page, 'ARTICLE 9.', width5, y5);
  addSubSideHeading(page, 'Trustee’s Powers', width5, y5 - 15);

  const contentarticle9: string =
    '9.1 I intend that the Trustee will have the power to perform all acts, institute all proceedings, and exercise all rights, powers, and privileges that an absolute owner of any asset held in trust hereunder would have. The enumeration of certain powers herein will not limit the general or implied powers of the Trustee. In addition to the powers and authority granted by the laws of the jurisdiction where this Trust is administered, as they may be amended from time to time, the Trustee will have the discretionary powers set forth in this Trust Agreement with respect to any trust, which the Trustee may exercise without application to any court.\n' +
    '9.2 To compromise, adjust, and settle disputes and claims; to execute receipts and acquittances; and to institute and defend suits or legal proceedings.\n' +
    '9.3 To invest and reinvest in such stocks, bonds, certificates of deposit, and other securities and properties as the Trustee may deem advisable, including, without limitation, real property, common stocks and unsecured obligations, undivided interests, interests in investment trusts, mutual funds, legal and discretionary common trust funds, common funds maintained by the Trustee, leases, and property which is outside of my domicile; to deposit trust funds in a bank or trust company, including a bank\n';
  y5 = addContent(page, contentarticle9, width5, y5 - 45, timesNewRomanFont);
  addFooter(page, width5, 5);

  // Page 6
  page = addNewPage(pdfDoc);
  const { width: width6, height: height6 } = page.getSize();
  let y6 = height6 - 80;

  addHeader(page, 'Estate Planning', 390, y6 + 55, boldFont, 20);

  const contentarticle10: string =
    'or trust company, including a bank or trust company operated by the Trustee and including any common trust fund of any such depository bank or trust company; and to maintain margin accounts within any type of brokerage account, all without diversification as to the kind or amount and without being restricted in any way by any statute or court decision which now or hereafter exists regulating or limiting investments by fiduciaries.\n' +
    '9.4 To transfer, sell, exchange, convey, improve, subdivide, partition, lease, mortgage, pledge, give options upon, or otherwise dispose of any security or property, real, personal, or mixed, which is held in trust hereunder, at public or private sale or otherwise for cash or other consideration or on credit and upon such terms and conditions, with or without security, and for such price as the Trustee may deem advisable, without any obligation upon any purchaser, transferee, vendee, or assignee to look to the application of the proceeds, and to execute good and sufficient deeds and other appropriate instruments of conveyance, assignment, or transfer.\n' +
    '9.5 To lease any real estate for such term or terms, upon such conditions and rentals, and in such manner as the Trustee may deem advisable (with or without the privilege of purchase), and any lease so made will be valid and binding for the full term thereof even though the same will extend beyond the duration of any trust; to insure against fire or other risk; to make repairs, replacements, and improvements, structural or otherwise, to any such real estate; and to subdivide real estate, to dedicate the same to public use, and to grant easements as the Trustee may deem proper.\n' +
    '9.6 To borrow money from any source, including from the Trustee in an individual capacity, for any purpose connected with the protection or enhancement of the Trust or to carry out any of the provisions of the Trust, and as security, to mortgage or pledge any asset of the Trust upon such conditions as the Trustee deems proper. A lender may only look to trust assets for repayment of any loan, and no Trustee or beneficiary will be liable personally if trust assets are insufficient to repay any loan so made.\n' +
    '9.7 To insure the assets of the Trust against damage or loss, and the Trustee against liability with respect to third persons.\n' +
    '9.8 To determine whether, and in what manner, interest, dividends, rents, and other income will be apportioned in respect of time.\n' +
    '9.9 To make distribution hereunder of property, wholly or partly, in cash or in kind, and for that purpose to divide, partition, and allot property and to determine the value thereof, all in accordance with the provisions of this Trust Agreement; and the judgment of the Trustee as to the value of such properties and the division thereof will be binding on all persons.\n' +
    '9.10 To cause any securities or other property, real or personal, belonging to any trust, to be held or registered in the Trustee’s name or in the name of the Trustee’s nominee, or in such other form as the Trustee may deem best, without disclosing any trust relationship; PROVIDED, HOWEVER, the Trustee will be liable for any act of the nominee in connection with the securities or other property so held.';
  y6 = addContent(page, contentarticle10, width6, y6, timesNewRomanFont);
  addFooter(page, width6, 6);

  // Page 7
  page = addNewPage(pdfDoc);
  const { width: width7, height: height7 } = page.getSize();
  let y7 = height7 - 80;

  addHeader(page, 'Estate Planning', 390, y7 + 55, boldFont, 20);

  const contentarticle11: string =
    '9.11 To sell and exercise any “rights” issued on any security held in trust hereunder; to pay calls, assessments, and any other sums chargeable or accruing against or on account of securities.\n' +
    '9.12 To vote, in person or by general or limited proxy, any stock or security held in trust hereunder including the power to retain in trust and vote a security issued by a bank or financial institution; to consent, directly or through a committee or other agent, to the reorganization, consolidation, merger, dissolution, or liquidation of a corporation or other business enterprise.\n' +
    '9.13 To perform, compromise, or refuse performance of contracts that continue as obligations of my estate, as the Trustee determines under the circumstances. In performing such enforceable contracts of the Trust, the Trustee, among other possible choices of action, may effect a fair and reasonable compromise with a debtor or obligor, or extend, renew, or in any manner modify the terms of an obligation owing to the Trust. A Trustee who holds a mortgage, pledge, or other lien upon property of another person, may, in lieu of foreclosure, accept the conveyance or transfer of encumbered assets from the owner thereof in satisfaction of the indebtedness secured by lien.\n' +
    '9.14 To pay taxes, assessments, compensation of the Trustee, and other expenses incurred in the collection, care, administration, and protection of the Trust.\n' +
    '9.15 To abandon, in any way, property which the Trustee determines not to be worth protecting.\n' +
    '9.16 To make appropriate provisions for depositing securities with any legal depository.\n' +
    '9.17 To employ accountants, attorneys, securities brokers, and such agents as the Trustee may deem advisable, even though any such agent may be a subsidiary or partner of the Trustee, to pay reasonable compensation for their services, and to charge the same to (or apportion the same between) income and principal as the Trustee may deem proper.\n' +
    '9.18 To refrain from or to take any action and to refrain from or to make any election, in the Trustee’s reasonable discretion, which the Trustee is permitted by law to make or not make; to minimize the tax liabilities of any trust, my estate, and the beneficiaries, if in the Trustee’s reasonable discretion, it is deemed desirable to do so.\n' +
    '9.19 To merge the assets of any trust with those of any other trust having the same beneficiaries and having similar provisions so as to allow the Trustee to hold the assets of all of such trusts as a single trust, providing that the integrity of any such trust is not violated.\n' +
    '9.20 To determine the identity of all persons having a vested or non-vested beneficial interest in the Trust, with or without legal proceedings.';
  y7 = addContent(page, contentarticle11, width7, y7, timesNewRomanFont);
  addFooter(page, width7, 7);

  // Page 8
  page = addNewPage(pdfDoc);
  const { width: width8, height: height8 } = page.getSize();
  let y8 = height8 - 80;

  addHeader(page, 'Estate Planning', 390, y8 + 55, boldFont, 20);

  const contentarticle12: string =
    '9.21 To hold property otherwise directed to be added to or consolidated with the trust estate of any trust held hereunder as a separate trust having terms identical to the terms of the existing trust; to sever any trust on a fractional basis into two (2) or more separate trusts for any reason; to segregate by allocation to a separate account or trust a specific amount out of, a portion of, or specific assets included in, the trust estate of any trust held hereunder to reflect a partial disclaimer or for any tax or other reason in a manner consistent with any applicable rules or regulations. Income earned on a segregated amount, portion or specific assets after the segregation is effective will be held, administered, and distributed pursuant to the terms of such separate trust. In administering the trust estate of any separate account or trust and in making applicable tax elections, the Trustee will consider the differences in federal tax attributes and all other factors the Trustee believes pertinent. A separate trust created by severance or segregation will be treated as a separate trust for all purposes from and after the date designated by the Trustee as the effective date of the severance or segregation and will be held on terms and conditions that are equivalent to the terms of the trust from which it was severed or segregated so that the aggregate interests of each beneficiary in the several trusts are equivalent to the beneficiary’s interests in the trust before severance or segregation.\n' +
    '9.22 To, in the Trustee’s reasonable discretion and without court order, retain any farm property, even though that property may constitute all or a large portion of the trust estate, and to acquire other farm property; to engage in farm operations and the production, harvesting, and marketing of farm products, including livestock breeding and feeding, poultry farming, and dairy farming, whether by operating directly with hired labor, by retaining farm managers or management agencies (including any such agency which is in any way affiliated with any corporate Trustee acting hereunder), or by renting on shares or for cash; to enter into farm programs; to purchase or rent farm machinery and equipment; to purchase livestock, poultry, fertilizer, seed, and feed; to improve the farm property, and to repair, improve, and construct farm buildings, fences, irrigation systems, and drainage facilities; to develop, lease, or otherwise dispose of any mineral, oil, or gas property or rights; to borrow money for any of the purposes described in this paragraph; and in general to do all things customary or desirable in farm operations. \n' +
    '9.23 To use and expend the Trust income and principal to i) conduct environmentalassessments, audits, and site monitoring to determine compliance with any environmental law orregulation thereunder, ii) take all appropriate remedial action to contain, clean up or remove any environmental hazard including a spill, release, discharge, or contamination, either of the Trustee’s own accord or in response to an actual or threatened violation of any environmental law or regulation thereunder, iii) institute legal proceedings concerning environmental hazards or contest or settle legal proceedings brought by any local, state, or federal agency concerned with environmental compliance, or by a private litigant, iv) comply with any local, state, or federal agency order or court order directing an assessment, abatement, or cleanup of any environmental hazards, and v) employ agents, consultants, and legal counsel to assist or perform the above undertakings or actions. Any expenses incurred by the Trustee under this paragraph may be charged against income or principal as the Trustee will determine. \n' +
    '9.24 To receive any property, real or personal, to be added to the Trust from my estate (and if the Trustee consents in writing, from any other person) by lifetime or testamentaryn transfer or otherwise; PROVIDED, HOWEVER, that the Trustee, in the Trustee’s sole \n';

  y8 = addContent(page, contentarticle12, width8, y8, timesNewRomanFont);
  addFooter(page, width8, 8);

  // Page 9
  page = addNewPage(pdfDoc);
  const { width: width9, height: height9 } = page.getSize();
  let y9 = height9 - 80;

  addHeader(page, 'Estate Planning', 390, y9 + 55, boldFont, 20);

  const contentarticle13: string =
    'discretion, may require, as a prerequisite to accepting property, that the donating party provide evidence satisfactory to the Trustee that i) the property is not contaminated by any hazardous or toxic materials or substances; and ii) the property is not being used and has never been used for any activities directly or indirectly involving the generation, use, treatment, storage, disposal, release, or discharge of any hazardous or toxic materials or substances.\n' +
    '9.25 In allocating assets among separate trusts, the Trustee is specifically authorized to select any one or more particular assets to fund one trust with different assets funding other trusts. It is my intention that certain assets may be better suited for one particular beneficiary’s trust versus other assets and the Trustee is encouraged in the Trustee’s sole and absolute discretion to make such allocations at the time of the division into separate trusts for separate beneficiaries.\n' +
    '9.26 No Trustee will be liable for any loss or depreciation in value sustained by the Trust as a result of the Trustee accepting or retaining any property upon which there is later discovered to be hazardous materials or substances requiring remedial action pursuant to any federal, state, or local environmental law unless the Trustee contributed to the loss or depreciation in value through willful default, willful misconduct, or gross negligence. The failure of the Trustee to obtain the evidence referred to in the preceding paragraph will not be considered the willful default, willful misconduct, or gross negligence of the Trustee.\n' +
    '9.27 Notwithstanding anything to the contrary contained herein, the Trustee may withhold a distribution of real estate to a beneficiary until receiving from the beneficiary an indemnification agreement in which the beneficiary agrees to indemnify the Trustee against any claims filed against the Trustee as an “owner” or “operator” under the Comprehensive Environmental Response, Compensation and Liability Act of 1980, as from time to time amended, or any regulation thereunder.\n' +
    '9.28 To acquire by purchase, exchange, or otherwise, property, real or personal, from the executor or administrator of my estate, although such property may not be of the character prescribed by law or by the terms of this Trust Agreement for the investment of trust funds and although the acquisition of such property may result in a large percentage of any trust hereunder being invested in one (1) class of property, all without liability for loss or depreciation, except for the Trustee’s own negligence; and to retain the property so acquired so long as the Trustee will deem advisable.\n' +
    '9.29 To invest in any assets without being limited by any statute or judicial decision imposing requirements as to assets in which investments may be made or the retention or diversification of investments. Any aspect of any diversification requirement that would apply is hereby negated. Notwithstanding any law, custom, or practice to the contrary, the Trustee will be under no obligation to change the form of any investment held hereunder.\n' +
    '9.30 Unless otherwise provided herein, in making discretionary distributions of principal hereunder, the Trustee may, but will not be required to, take into consideration all other income, property, annuities, and sources of support available to the prospective recipients of the distribution known to the Trustee. ';

  y9 = addContent(page, contentarticle13, width9, y9, timesNewRomanFont);
  addFooter(page, width9, 9);

  // Page 10
  page = addNewPage(pdfDoc);
  const { width: width10, height: height10 } = page.getSize();
  let y10 = height10 - 80;

  addHeader(page, 'Estate Planning', 390, y10 + 55, boldFont, 20);
  addSideHeading(page, 'ARTICLE 10.', width10, y10);
  y10 -= 20;
  addSubSideHeading(page, 'Miscellaneous Provisions', width10, y10);
  y10 -= 30;

  const contentarticle14: string =
    '10.1 **Simultaneous!Death**. If my spouse and I die under such circumstances that there is not sufficient evidence to determine the order of death, then it will be presumed that my spouse has predeceased me, and this Trust Agreement will be administered and distributed in all respects in accordance with said presumption.\n' +
    '10.2 **Incidental!Benefits**. After my death, the Trustee may make distributions to or on behalf of a beneficiary even though such distributions result in an incidental benefit to a guardian or the person having custody of the beneficiary.\n' +
    '10.3 **Minority!or!Disability of a Beneficiary**. During the minority or disability of a beneficiary hereunder, the Trustee may make any distributions authorized under this Trust Agreement in any one (1) or more of the following ways: directly to the beneficiary in such amounts as may be deemed advisable as an allowance; to the guardian of the person or property of the beneficiary; or to a relative of the beneficiary upon the agreement of such relative to expend such income or principal solely for the benefit of the beneficiary. The receipt by any such person will constitute a complete acquittance to the Trustee for any funds or property so distributed, and the Trustee will have no responsibility for the proper application thereof.\n' +
    '10.4 **In!Terrorem**. If valid under the laws of the state having jurisdiction over the administration of any trust created hereunder, any beneficiary under this Trust Agreement who contests the probate of my Last Will and Testament or of any of its provisions, or any of the provisions of this Trust Agreement, or any beneficiary designation, or elects to take a statutory share of my estate, will be deemed to have predeceased me without surviving issue for purposes of this Trust Agreement. Accordingly, upon such contest neither the relevant beneficiary, his or her issue, nor his or her heirs-at-law shall benefit under this Trust Agreement.\n' +
    '10.5 **Perpetuities**. This Trust and the Trustee shall be subject to the laws of the State of Missouri applying to trusts and trustees, now in effect or as amended. The property held by this Trust shall not be subject to any statutory or common law rule against perpetuities.\n ' +
    '10.6 **Spendthrift**. Upon my death, no beneficiary hereunder will have any right or power to anticipate, pledge, assign, sell, transfer, or alienate (by operation of law, legal process, or otherwise), or encumber his or her interest (in income or principal) in any Trust, in any way; nor will any such interest in any manner be liable for or subject to the debts, liabilities or obligations of such beneficiary or claims of any sort against such beneficiary. Notwithstanding the foregoing to the contrary, nothing contained in this Article will be construed to restrict in any way the exercise of any power of appointment granted hereunder.\n' +
    '10.7 **Accounting**. Upon my request or the request of my Caregiver when otherwise required by the law of the Trust’s governing jurisdiction, or at the discretion of the Trustee, the Trustee will make an accounting regarding the transactions of the Trust by delivering a written report to me, if living, and to my Caregiver.\n';

  y10 = addContent(page, contentarticle14, width10, y10, timesNewRomanFont);
  addFooter(page, width10, 10);
  // Page 11
  page = addNewPage(pdfDoc);
  const { width: width11, height: height11 } = page.getSize();
  let y11 = height11 - 80;

  addHeader(page, 'Estate Planning', 390, y11 + 55, boldFont, 20);
  y11 -= 30;

  const contentarticle15: string =
    '10.8 Distributions. Unless the Trustee receives from some person interested in this Trust written notice of any deaths, births, marriages, or other events on which the right to receive income or principal of the trust property may depend, the Trustee will incur no liability for any distributions made or omitted in good faith.\n' +
    '10.9 Trustee Liability and Discretion . The Trustee will be responsible only for due diligence in the administration and disbursement of the assets of any Trust created hereunder and will not be responsible for any loss or subject to any liability except by reason of the Trustee’s own negligence or willful default proved by affirmative evidence; and every election, determination, or other exercise by the Trustee of any discretion granted to the Trustee, expressly or by implication under this Trust Agreement or by law made in good faith, will fully protect the Trustee and will be conclusive and binding upon all persons interested in any Trust created under this Trust Agreement.\n' +
    '10.10 Minimum Distribution Rules . If any asset is subject to the “minimum distribution rules” of Section 401(a)(9) of the Code, the Trustee will supply to each plan administrator or individual retirement account trustee, as the case may be, a copy of this Trust Agreement, as may be amended from time to time prior to my death, or otherwise comply with the requirements of Section 401(a)(9) of the Code and the Regulations thereunder, as soon as practicable following my death.\n' +
    '10.11 Incorporation . Should any Trust Agreement referred to herein be determined to be unenforceable or otherwise not in effect for whatever reason, then I incorporate herein by reference the terms thereof and direct that such terms apply to the disposition of the trust property or portion hereof as provided in the heretofore Article or Articles as if fully set out herein at length.\n' +
    '10.12 Headings . The article headings herein are inserted only as a matter of convenience and for reference, and will in no way be construed to define, limit, or describe the scope or intent of any provisions contained in this Trust Agreement, nor in any way affect this Trust Agreement.\n' +
    '10.13 Gender; Plural . For purposes of this Trust Agreement, words in any gender will include all genders, and words in the singular will include the plural and vice versa, in each case unless the context otherwise requires.\n' +
    '10.14 Effective Date and Governing Law . This Trust Agreement will be effective on the date it is executed by me. This Trust Agreement will be construed and administered, and the validity of each Trust hereunder will be determined, in accordance with the laws of the State of Missouri, without giving effect to its conflicts of law principles. The Trustee may amend this paragraph and take any other action in order to change the jurisdiction whose law will govern the construction, administration and validity of any Trust hereunder, and to amend any other provision of this ';

  y11 = addContent(page, contentarticle15, width11, y11, timesNewRomanFont);
  addFooter(page, width11, 11);

  // Page 12
  page = addNewPage(pdfDoc);
  const { width: width12, height: height12 } = page.getSize();
  let y12 = height12 - 80;

  addHeader(page, 'Estate Planning', 390, y12 + 55, boldFont, 20);

  const contentarticle16: string =
    'Trust Agreement solely for such purposes. The jurisdiction whose law governs the construction, administration and validity of any Trust may, but need not, be the same as the situs of the administration of such Trust. Notwithstanding anything to the contrary in this paragraph, if the Trustee is my spouse or my issue, then such Trustee will not have the powers as provided in this third sentence of this paragraph, and such powers will be exercised, if at all, by the successor Trustee as named under this Trust Agreement who is not my spouse or my issue, or if there is no such successor Trustee who is not my spouse or my issue, then by an independent\n' +
    'Trustee as selected by a court of competent jurisdiction. An independent Trustee will be a Trustee who is not my spouse, my issue, or other related or subordinate party to a beneficiary hereunder (other than me) as defined by Code Section 672(c).\n' +
    '10.15 Enforcement. My Caregiver shall have the authority and duty to enforce the intended use of the principal and income of the Animal Care Trust, including the obtaining of equitable relief from the appropriate court in the jurisdiction where my pets are located. However, if my Caregiver is also acting as the Trustee, any remainder beneficiary under this Animal Care Trust, or any person having an interest in the welfare of my pets covered by the Animal Care Trust, may enforce the income and principal provisions of the Animal Care Trust.\n' +
    '10.16 Counterparts. This Trust Agreement may be executed in counterparts and such counterparts taken together will constitute a single instrument.\n' +
    '[Signature Page Follows]';

  y11 = addContent(page, contentarticle16, width12, y12, timesNewRomanFont);

  addFooter(page, width12, 12);

  // Page 13
  page = addNewPage(pdfDoc);
  const { width: width13, height: height13 } = page.getSize();
  let y13 = height13 - 80;

  addHeader(page, 'Estate Planning', 390, y13 + 55, boldFont, 20);

  const contentarticle17: string =
    'IN WITNESS WHEREOF, the Trustee and I, in acceptance of this trust, have executed this Trust Agreement the day and year first above written.\n\n\n' +
    '_______________________________________\n' +
    '${name}, Settlor\n\n' +
    '_______________________________________\n' +
    '${name}, Trustee\n\n' +
    ' We, ____________________________ and ____________________________, the witnesses, sign our names to this instrument on this the ______ day of _______________, 2025.';

  y13 = addContent(page, contentarticle17, width13, y13, timesNewRomanFont);
  y13 = addLeftSignatureLine(page, y13 - 50);
  addRightSignatureLine(page, y13 + 175);
  y13 = addStateCountySection(page, y13 - 15);

  const contentpage8: string =
    ' Subscribed, sworn to and acknowledged before me by ${name} as the Settlor and the Trustee, and subscribed and sworn to before me by____________________________ and ____________________________, as witnesses, this the ______ day of _______________, 2025';
  y13 = addContent(
    page,
    contentpage8,
    width13 + 10,
    y13 - 20,
    timesNewRomanFont
  );

  y13 = addNotarySection(page, y13 - 10);

  addFooter(page, width13, 12);

  const pdfBytes: Uint8Array = await pdfDoc.save();
  const blob: Blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link: HTMLAnchorElement = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'AnimalCare.pdf';
  link.click();
}
