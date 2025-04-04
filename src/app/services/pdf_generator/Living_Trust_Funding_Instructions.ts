import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';

export async function generateLivingTrustPDF(clientData: any) {
  const pdfDoc = await PDFDocument.create();
  const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
  const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

  const pageSize = { width: 595.28, height: 861.89 }; 
  const margin = 50;
  const lineHeight = 18;
  const textWidth = pageSize.width - 2 * margin;
  const bulletIndent = 15;

  const { 
    Trust_Name_1, 
    Trust_Name_2, 
    Bank_account_name_1, 
    Bank_account_Trust_Title, 
    Brokerage_account_name_1, 
    Brokerage_account_name_2, 
    Insurance_name_1, 
    Insurance_name_2, 
    Plan_name_1, 
    Plan_name_2, 
    Plan_Title, 
    Insurance_Title, 
    Trust_Title, 
    Bank_account_trust_title, 
    Brokerage_account_trust_title 
  }= clientData;




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

  function addHeading(text: string, fontSize = 14) {
    if (y - 25 < margin) {
      ({ page, y } = createNewPage());
    }
    page.drawText(text, { x: margin, y, size: fontSize, font: boldFont, color: rgb(0, 0, 0) });
    y -= 25;
  }

  function addParagraph(text: string, fontSize = 12) {
    const words = text.split(/\s+/);
    let currentLine = ' ';
    let lineWords: { text: string; isDynamic: boolean }[] = [];
  
    // Define dynamic variables
    const dynamicValues: Record<string, string> = {
      Trust_Name_1: Trust_Name_1 ,
      Trust_Name_2: Trust_Name_2 ,
      Trust_Title: Trust_Title ,
      Bank_account_name_1: Bank_account_name_1 ,
      Bank_account_Trust_Title: Bank_account_Trust_Title ,
      Brokerage_account_name_1: Brokerage_account_name_1 ,
      Brokerage_account_name_2: Brokerage_account_name_2 ,
      Insurance_name_1: Insurance_name_1 ,
      Insurance_name_2: Insurance_name_2 ,
      Plan_name_1: Plan_name_1 ,
      Plan_name_2: Plan_name_2 ,
      Plan_Title: Plan_Title ,
      Insurance_Title: Insurance_Title ,
      Bank_account_trust_title: Bank_account_trust_title ,
      Brokerage_account_trust_title: Brokerage_account_trust_title 
    };
    words.forEach(word => {
      let isDynamic = false;
      if (word.startsWith('${') && word.endsWith('}')) {
        const varName = word.slice(2, -1); // Extract variable name
        word = dynamicValues[varName] || '____________' ;
        isDynamic = true;
      }
  
      const lineWidth = font.widthOfTextAtSize(currentLine + word, fontSize);
      if (lineWidth < textWidth - bulletIndent) {
        lineWords.push({ text: word, isDynamic });
        currentLine += word + ' ';
      } else {
        if (y - lineHeight < margin) {
          ({ page, y } = createNewPage());
        }
  
        drawStyledWords(lineWords, fontSize);
        y -= lineHeight;
        currentLine = '  ' + word + ' ';
        lineWords = [{ text: word, isDynamic }];
      }
    });
  
    if (lineWords.length > 0) {
      if (y - lineHeight < margin) {
        ({ page, y } = createNewPage());
      }
      drawStyledWords(lineWords, fontSize);
      y -= lineHeight;
    }
   
  }
  
  
  
  

  function addBulletPoint(text: string, fontSize = 12) {
    const words = text.split(/\s+/);
    let currentLine = '• ';
    let lineWords: { text: string; isDynamic: boolean }[] = [];
  
    // Define dynamic variables
    const dynamicValues: Record<string, string> = {
      Trust_Name_1: Trust_Name_1 ,
      Trust_Name_2: Trust_Name_2 ,
      Trust_Title: Trust_Title ,
      Bank_account_name_1: Bank_account_name_1 ,
      Bank_account_Trust_Title: Bank_account_Trust_Title ,
      Brokerage_account_name_1: Brokerage_account_name_1 ,
      Brokerage_account_name_2: Brokerage_account_name_2 ,
      Insurance_name_1: Insurance_name_1 ,
      Insurance_name_2: Insurance_name_2 ,
      Plan_name_1: Plan_name_1 ,
      Plan_name_2: Plan_name_2 ,
      Plan_Title: Plan_Title ,
      Insurance_Title: Insurance_Title ,
      Bank_account_trust_title: Bank_account_trust_title ,
      Brokerage_account_trust_title: Brokerage_account_trust_title 
    };
    
  
    words.forEach(word => {
      let isDynamic = false;
      if (word.startsWith('${') && word.endsWith('}')) {
        const varName = word.slice(2, -1); 
        word = dynamicValues[varName] || '____________' ;
        isDynamic = true;
      }
  
      const lineWidth = font.widthOfTextAtSize(currentLine + word, fontSize);
      if (lineWidth < textWidth - bulletIndent) {
        lineWords.push({ text: word, isDynamic });
        currentLine += word + ' ';
      } else {
        if (y - lineHeight < margin) {
          ({ page, y } = createNewPage());
        }
  
        drawStyledWords(lineWords, fontSize);
        y -= lineHeight;
        currentLine = '  ' + word + ' ';
        lineWords = [{ text: word, isDynamic }];
      }
    });
  
    if (lineWords.length > 0) {
      if (y - lineHeight < margin) {
        ({ page, y } = createNewPage());
      }
      drawStyledWords(lineWords, fontSize);
      y -= lineHeight;
    }
  }
  
  // Function to draw words with specific styles
  function drawStyledWords(words: { text: string; isDynamic: boolean }[], fontSize: number) {
    let xPos = margin;
  
    words.forEach(({ text, isDynamic }) => {
      page.drawText(text + ' ', {
        x: xPos,
        y,
        size:  fontSize-1,
        font: isDynamic ? boldFont : font,
        color: rgb(0, 0, 0) 
      });
  
      xPos += font.widthOfTextAtSize(text + ' ', fontSize);
    });
  }
  


  // === Page 1 Content ===
  addHeading("Funding Your Joint Revocable Living Trust");
  addParagraph(
    `Your Joint Revocable Living Trust is drafted so that you may transfer assets to it during your lifetime 
and/or upon your death. However, with few exceptions, you must transfer ownership of an asset to 
the Trust during your lifetime if you want such asset to avoid probate. The necessary steps vary 
depending upon the asset being transferred, as outlined below. Please check with each respective 
institution mentioned below to determine if such institution requires further information or special 
types of signatures (for example, notarized signatures).  


Note that if you file a joint federal income tax return, then either of your Social Security Numbers 
can be used as the Tax Identification Number (TIN) for your Trust. If you do not file jointly, then use 
the one spouse's Social Security Number (SSN) for transfers of their separate property and one-half 
of community property to the Trust. Use the other spouse's SSN for transfers of their separate 
property and one-half of community property to the Trust. `
  );

  addHeading("Personal Property");
  addBulletPoint('Check with the Department of Motor Vehicles (or relevant government department) in your state about transferring vehicles to your Trust. Automobiles, boats and similar assets may need to be retitled into the name of the Trust, i.e.,   ${Trust_Name_1}   and    ${Trust_Name_2}    as Trustees (or their successors) of the ${Trust_Title} dated the _____________ day of ________, 2025, as may hereafter be amended. (The date is the date on which you execute the Trust in accordance with the instructions provided.) If the asset is insured or subject to a lien, check with your insurance company or the lienholder prior to such transfer concerning the transfer and any impediments or implications, continued insurability, costs, etc.');
  addBulletPoint("Other personal property, such as antiques, tools, collectibles, and jewelry, must be transferred to the Trust via a bill of sale or other transfer document. Contact your insurance company prior to such transfer concerning this transfer and continued insurability, costs, etc.");

  addHeading("Real Property");
  addParagraph(` Real estate may be transferred to the Trust via the execution and recording of a deed; recording fees/taxes may apply. You may contact your local county clerk for information about transferring 
real estate into the Trust. You may also wish to contact a real estate attorney in the state where the 
property is located to advise you regarding proper transfer and compliance with the homestead 
laws and other possible state law matters. We also offer a deed service `);
  addParagraph(`at https://deeds.hargrovefirm.com. You should also review your mortgage paperwork and contact 
your lender regarding any issues it may have regarding the transfer, including due-on-sale clauses. 
The Garn-St. Germain Depository Institutions Act of 1982 preempts lenders from enforcing due-on
sale restrictions in the case of certain exempt transfers, which include transfers into most revocable 
trusts. Contact your insurance company prior to such transfer concerning this transfer and 
continued insurability, costs, etc. Please note that some cemetery plots are real estate interests 
with ownership evidenced by deeds that you may wish to transfer to the Trust. 
`);

  // === Force Page 2 to start on a new page ===
  ({ page, y } = createNewPage());

  // === Page 2 Content ===
  addParagraph(
    `Once real estate has been transferred to the Trust, you will want to execute the Certificate of Trust 
in the presence of a notary public. Note that the Certificate of Trust requires a description in Section 
1, paragraph (c), as well as providing legal descriptions of the real estate on Exhibit A. `
  );

  addHeading("Bank and Brokerage Accounts");
  addBulletPoint('Bank accounts may be transferred to the Trust by contacting your bank and arranging to execute the proper paperwork to change the account’s ownership from your individual name to the name of your Revocable Living Trust ${Bank_account_name_1} and ${Bank_account_Trust_Title} as Trustees (or their successors) of the ${Bank_account_trust_title} dated the ______ day of _______________, 2025, as may hereafter be amended”). If your bank accounts are with a federal credit union, seek the advice of a credit union advisor, who will know whether there are membership restrictions against holding these accounts in trust.');
  addBulletPoint(`Access to a bank safe deposit box is typically gained through a lease arrangement between the
 customer and the bank. Depending on the institution, a safe deposit box rental agreement may
 be transferred to a trustee or the trustee can enter into a new agreement for the same box. If
 the safe deposit box remains solely subject to your control as an individual, it may take a court
 order to open it in the event of the owner’s death or incapacity. Your bank advisor should be
 able to address this issue with you.`);
  addBulletPoint(' Brokerage accounts may be transferred to the Trust by contacting your brokerage company and arranging with your advisor to execute the proper paperwork to change the account’s ownership from your individual name to the name of your Revocable Living Trust ${Brokerage_account_name_1} and ${Brokerage_account_name_2} as Trustees (or their successors) of the ${Brokerage_account_trust_title} dated the ______ day of _______________, 2025, as may hereafter be amended');

  addHeading("Stocks, Bonds, and Closely Held Business Interests");
  addBulletPoint(`Publicly traded stocks held in certificate form may be transferred to the Trust by contacting the
 corporation’s transfer agent, who will require you to surrender the stock certificate and sign
 certain transfer documents.`);
  addBulletPoint(`Contact Treasury Direct at http://www.treasurydirect.gov/ about retitling federal bonds and
 contact the appropriate state, city, or municipal government agency or department regarding
 the transfer of state, city, or municipal bonds.`);
  addBulletPoint(`Ownership Interests in closely held businesses may be transferred to the Trust by properly
 drafted assignments, irrevocable stock powers and/or completing transfer information on the
 certificates representing the ownership interest. A review of any applicable transfer restrictions
 should be done prior to the execution of any such documents. If the entity to be transferred is
 taxed as an S corporation, consult with your tax advisor and/or an attorney prior to transfer.
 Also, if you have any questions or concerns, you should contact an attorney.`);
  addBulletPoint(`Promissory notes or mortgages owed to you may also be transferred by an assignment, unless
 the note or mortgage prohibits such transfer. Review the document completely to determine if
 there are transfer restrictions. Consult an attorney if you are uncertain.
`);

  // === Force Page 3 to start on a new page ===
  ({ page, y } = createNewPage());

  // === Page 3 Content ===
  addHeading("Life Insurance");
  addParagraph(
    'If you wish for any life insurance or annuities to be payable upon your death to the Trust, consult with your advisors as to the consequences of such choice. If, after discussion with your advisors, a change of beneficiary is deemed appropriate, request and complete a “Change of Beneficiary Designation” or equivalent form naming  ${Insurance_name_1} and  ${Insurance_name_2} as Trustees (or their successors) of the ${Insurance_Title} dated the ______ day of _______________, 2025, as may hereafter be amended”, as the beneficiary. Return the form to the appropriate party. '
  );

  addHeading("Retirement Plans");
  addParagraph(
    'If you wish for any retirement plan proceeds or other similar assets to be payable upon your death to the Trust, we cannot stress enough that you should consult with your advisors as to the consequences of your choice. For instance, making your Trust the beneficiary of your retirement plans could cause unwanted income tax consequences. If you and your advisors agree that a change of beneficiary is appropriate, you will want to request and complete a “Change of Beneficiary Designation” or equivalent form naming  ${Plan_name_1} and ${Plan_name_2} as Trustees (or their successors) of the ${Plan_Title} dated the ______ day of _______________, 2025, as may hereafter be amended”, as the beneficiary. Return the form to the appropriate party. '
  );

 
  addParagraph(
    `Many of these transfers can be done by you without legal assistance. However, you are 
encouraged to seek professional advice when changing title to your assets to make sure that tax 
issues, title issues, insurance issues, and state law issues are addressed. These instructions are to 
be used for general reference only and are not meant to take the place of directed legal advice. Any 
additional assets you acquire yet wish to avoid probate can also be titled in the name of the Trust, 
provided that the Trust, as drafted, ultimately distributes the assets at your death as you desire. You 
should keep a schedule of assets contributed to the Trust, adjusted from time to time for sales, 
purchases, or other changes, so that not only the current Trustee, but any future or successor 
Trustee, will know what assets are owned by the Trust at any given time. Since the Trust may hold 
community property as well as separate property, you will want to mark each item on your schedule 
of assets as either community property or separate property.`);

  // Generate and download the PDF
  const pdfBytes = await pdfDoc.save();
  const blob = new Blob([pdfBytes], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = 'Living_Trust_Funding_Instructions.pdf';
  link.click();
}
