import { Injectable } from '@angular/core';
import { PDFDocument, PDFFont, rgb, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class PowerOfAttorneyPdf {

  async generatePdf(DocumentPrepareFor: any) {
    const pdfDoc = await PDFDocument.create();
    const font = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const fontSize = 12;

    
    // Page 1
    const page1 = pdfDoc.addPage([600, 800]);
    this.generatePage1(page1, DocumentPrepareFor, font, boldFont);

    // page 2
    const page2 = pdfDoc.addPage([600, 800]);
    this.generatePage2(page2, DocumentPrepareFor, font, boldFont);

    // page 3
    const page3 = pdfDoc.addPage([600, 800]);
    this.generatePage3(page3, DocumentPrepareFor, font, boldFont);

    // page 4
    const page4 = pdfDoc.addPage([600, 800]);
    this.generatePage4(page4, DocumentPrepareFor, font, boldFont);

    // page 5
    const page5 = pdfDoc.addPage([600, 800]);
    this.generatePage5(page5, DocumentPrepareFor, font, boldFont);

     // page 6
     const page6 = pdfDoc.addPage([600, 800]);
     this.generatePage6(page6, DocumentPrepareFor, font, boldFont);
    
    // Save PDF
    const pdfBytes = await pdfDoc.save();
    this.downloadPDF(pdfBytes, "Statutory_Power_of_Attorney.pdf");
  }

  private  generatePage1(page: any, DocumentPrepareFor: any, font: any, boldFont: any) {
    const { height } = page.getSize();
    const fontSize = 12;

    // Title
    page.drawText('STATUTORY DURABLE POWER OF ATTORNEY', { x: 150, y: height - 50, size: 14, font: boldFont });
    
    // Notice Section
   const noticeText = `NOTICE: THE POWERS GRANTED BY THIS DOCUMENT ARE BROAD AND SWEEPING. THEY ARE EXPLAINED IN THE DURABLE POWER OF ATTORNEY ACT, SUBTITLE P, TITLE 2, ESTATES CODE. IF YOU HAVE ANY QUESTIONS ABOUT THESE POWERS, OBTAIN COMPETENT LEGAL ADVICE. THIS DOCUMENT DOES NOT AUTHORIZE ANYONE TO MAKE MEDICAL AND OTHER HEALTH-CARE DECISIONS FOR YOU. YOU MAY REVOKE THIS POWER OF ATTORNEY IF YOU LATER WISH TO DO SO. IF YOU WANT YOUR AGENT TO HAVE THE AUTHORITY TO SIGN HOME EQUITY LOAN DOCUMENTS ON YOUR BEHALF, THIS POWER OF ATTORNEY MUST BE SIGNED BY YOU AT THE OFFICE OF THE LENDER, AN ATTORNEY AT LAW, OR A TITLE COMPANY.`;
   const maxWidth = 500;
   const wrappedNotice = wrapText(noticeText, maxWidth, font);

   let y = 720;
  for (const line of wrappedNotice) {
    const textWidth = font.widthOfTextAtSize(line, 12);
    const x = 50 + (maxWidth - textWidth) / 2; // Center Alignment
    page.drawText(line, { x, y, size: 12, font });
    y -= 15;
  }

    // Agent Selection
    page.drawText('You should select someone you trust to serve as your agent. Unless you specify otherwise,', { x: 50, y: height - 220, size: fontSize, font });
    page.drawText('generally the agent’s authority will continue until: ', { x: 50, y: height - 240, size: fontSize, font });

    page.drawText('(1) you die or revoke the power of attorney;', { x: 80, y: height - 270, size: fontSize, font });
    page.drawText('(2) your agent resigns, is removed by court order, or is unable to act for you; or', { x: 80, y: height - 280, size: fontSize, font });
    page.drawText('(3) a guardian is appointed for your estate.', { x: 80, y: height - 290, size: fontSize, font });

    
   // Dynamic Fields
   const name = DocumentPrepareFor?.beneficiary?.firstName + ' ' + DocumentPrepareFor?.beneficiary?.lastName|| '_________________________';
   const address = DocumentPrepareFor?.Beneficiaries?.address || '';
   const address1 = DocumentPrepareFor?.Beneficiaries?.address || '________________________________';

    // Appoint Agent
    page.drawText(`I, ${name} ${address}, (insert your name and address), appoint`, { x: 50, y: height - 320, size: fontSize, font });
    page.drawText(`${address1}, (insert the name and address of the person appointed) as my agent `, { x: 50, y: height - 340, size: fontSize, font});
    page.drawText(`to act for me in any lawful way with respect to all of the following powers that I`, { x: 50, y: height - 360, size: fontSize, font });
    page.drawText(`have initialed below. (YOU MAY APPOINT CO-AGENTS. UNLESS YOU PROVIDE)`, { x: 50, y: height - 380, size: fontSize, font });
    page.drawText(`OTHERWISE, CO-AGENTS MAY ACT INDEPENDENTLY.)`, { x: 50, y: height - 390, size: fontSize, font });



    // Power Selection
    page.drawText('TO GRANT ALL OF THE FOLLOWING POWERS, INITIAL THE LINE IN FRONT OF.', { x: 50, y: height - 420, size: fontSize, font });
    page.drawText('(O) AND IGNORE THE LINES IN FRONT OF THE OTHER POWERS LISTED IN (A) THROUGH (N).', { x: 50, y: height - 430, size: fontSize, font });

    page.drawText('TO GRANT A POWER, YOU MUST INITIAL THE LINE IN FRONT OF THE POWER', { x: 50, y: height - 460, size: fontSize, font });
    page.drawText('YOU ARE GRANTING.', { x: 50, y: height - 470, size: fontSize, font });


    page.drawText('TO WITHHOLD A POWER, DO NOT INITIAL THE LINE IN FRONT OF THE', { x: 50, y: height - 500, size: fontSize, font });
    page.drawText('POWER. YOU MAY, BUT DO NOT NEED TO, CROSS OUT EACH POWER WITHHELD.', { x: 50, y: height - 510, size: fontSize, font });


    // Checkbox Options
    this.drawCheckbox(page, 50, height - 550, '(A) Real property transactions', DocumentPrepareFor);
    this.drawCheckbox(page, 50, height - 570, '(B) Tangible personal property transactions', DocumentPrepareFor);
    this.drawCheckbox(page, 50, height - 590, '(C) Stock and bond transactions', false);
    this.drawCheckbox(page, 50, height - 610, '(D) Commodity and option transactions', false);
    this.drawCheckbox(page, 50, height - 630, '(E) Banking and financial transactions', false);
    this.drawCheckbox(page, 50, height - 650, '(F) Business operating transactions', false);
    this.drawCheckbox(page, 50, height - 670, '(G) Insurance and annuity transactions', false);
    this.drawCheckbox(page, 50, height - 690, '(H) Estate, trust, and other beneficiary transactions;', false);
    this.drawCheckbox(page, 50, height - 710, '(I) Claims and litigation;', false);
    this.drawCheckbox(page, 50, height - 730, '(J) Personal and family maintenance', false);
    this.drawCheckbox(page, 50, height - 750, '(K)  Benefits from social security, Medicare, Medicaid, or other governmental', false);

    // Footer
    page.drawText('Page 1 of 6', { x: 270, y: 30, size: 10, font });
  }

  private generatePage2(page: any, DocumentPrepareFor: any, font: any, boldFont: any) {
    const { height } = page.getSize();
    const fontSize = 12;

    page.drawText('programs or civil or military service; ', { x: 80, y: height - 50, size: fontSize, font });
    this.drawCheckbox(page, 50, height- 70, '(L) Retirement plan transactions;', false);
    this.drawCheckbox(page, 50, height- 90, '(M) Tax matters;', false);
    this.drawCheckbox(page, 50, height- 110, '(N) Digital assets and the content of an electronic communication;', false);
    this.drawCheckbox(page, 50, height- 130, '(O) ALL OF THE POWERS LISTED IN (A) THROUGH (N). YOU DO NOT', false);
    page.drawText('HAVE TO INITIAL THE LINE IN FRONT OF ANY OTHER POWER IF YOU INITIAL LINE (O)', { x: 80, y: height - 150, size: fontSize, font });


    // Title
    page.drawText('SPECIAL INSTRUCTIONS:', { x: 150, y: height - 190, size: 14, font: boldFont });

    page.drawText('Special instructions applicable to agent compensation (initial in front of one of the ',{ x: 60, y: height - 220, size: 14, font });
    page.drawText('following sentences to have it apply; if no selection is made, each agent will be entitled to',{ x: 50, y: height - 233, size: 14, font });
    page.drawText('compensation that is reasonable under the circumstances): ',{ x: 50, y: height - 243, size: 14, font });

    
    this.drawCheckbox(page, 50, height- 270, 'My agent is entitled to reimbursement of reasonable expenses incurred on my behalf and ', false);
    page.drawText('to compensation that is reasonable under the circumstances. ', { x: 50, y: height - 283, size: 14, font });
    this.drawCheckbox(page, 50, height- 310, 'My agent is entitled to reimbursement of reasonable expenses incurred on my behalf but', false);
    page.drawText('shall receive no compensation for serving as my agent. ', { x: 50, y: height - 323, size: 14, font });



    page.drawText('Special instructions applicable to co-agents (if you have appointed co-agents to act, initial in ', { x: 60, y: height - 360, size: fontSize, font });
    page.drawText('front of one of the following sentences to have it apply; if no selection is made, each agent will be entitled to act independently): ', { x: 50, y: height - 373, size: fontSize, font });
    page.drawText('entitled to act independently): ', { x: 50, y: height - 383, size: fontSize, font });

    this.drawCheckbox(page, 50, height- 410, 'Each of my co-agents may act independently for me', false);
    this.drawCheckbox(page, 50, height - 430, 'My co-agents may act for me only if the co-agents act jointly.', false);
    this.drawCheckbox(page, 50, height - 450, 'My co-agents may act for me only if a majority of the co-agents act jointly. ', false);

    page.drawText('Special instructions applicable to gifts (initial in front of the following sentence to have it apply): ', { x: 50, y: height - 480, size: fontSize, font });

    this.drawCheckbox(page, 50, height - 500, 'I grant my agent the power to apply my property to make gifts outright to or for the benefit ', false);
    page.drawText('of a person, including by the exercise of a presently exercisable general power of', { x: 50, y: height - 515, size: fontSize, font });
    page.drawText('appointment held by me, except that the amount of a gift to an individual may not exceed the ', { x: 50, y: height - 525, size: fontSize, font });
    page.drawText('amount of annual exclusions allowed from the federal gift tax for the calendar year of the gift.', { x: 50, y: height - 535, size: fontSize, font });


    page.drawText('ON THE FOLLOWING LINES YOU MAY GIVE SPECIAL INSTRUCTIONS ', { x: 70, y: height - 560, size: fontSize, font });
    page.drawText('LIMITING OR EXTENDING THE POWERS GRANTED TO YOUR AGENT. ', { x: 50, y: height - 575, size: fontSize, font });


    page.drawText('___________________________________________________________________________', { x: 50, y: height - 600, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 620, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 650, size: fontSize });


     // Footer
     page.drawText('Page 2 of 6', { x: 270, y: 30, size: 10, font });

  }

  private generatePage3(page: any, DocumentPrepareFor: any, font: any, boldFont: any) {
    const { height } = page.getSize();
    const fontSize = 12;

    // Section Dividers
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 50, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 70, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 90, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 110, size: fontSize });

   
     page.drawText('UNLESS YOU DIRECT OTHERWISE BELOW, THIS POWER OF ATTORNEY IS ',{x: 50, y: height -130, size: fontSize ,font});
     page.drawText('EFFECTIVE IMMEDIATELY AND WILL CONTINUE UNTIL IT TERMINATES',{x: 50, y: height -140, size: fontSize ,font});

     page.drawText('CHOOSE ONE OF THE FOLLOWING ALTERNATIVES BY CROSSING OUT THE ALTERNATIVE NOT CHOSEN:',{x: 50, y: height -170, size: fontSize ,font});
     page.drawText('ALTERNATIVE NOT CHOSEN:',{x: 50, y: height -185, size: fontSize ,font});


     page.drawText('(A) This power of attorney is not affected by my subsequent disability or incapacity',{x: 80, y: height -210, size: fontSize ,font});
     page.drawText('(B) This power of attorney becomes effective upon my disability or incapacity',{x: 80, y: height -230, size: fontSize ,font});

     page.drawText('YOU SHOULD CHOOSE ALTERNATIVE (A) IF THIS POWER OF ATTORNEY IS TO ',{x: 50, y: height -250, size: fontSize ,font});
     page.drawText('BECOME EFFECTIVE ON THE DATE IT IS EXECUTED.',{x: 50, y: height -265, size: fontSize ,font});


     page.drawText('IF NEITHER (A) NOR (B) IS CROSSED OUT, IT WILL BE ASSUMED THAT YOU CHOSE ALTERNATIVE (A).',{x: 50, y: height -290, size: fontSize ,font});
     page.drawText('CHOSE ALTERNATIVE (A).',{x: 50, y: height -305, size: fontSize ,font});

     page.drawText('If Alternative (B) is chosen and a definition of my disability or incapacity is not contained ',{x: 50, y: height - 340, size: fontSize ,font});
     page.drawText('in this power of attorney, I shall be considered disabled or incapacitated for purposes of this',{x: 50, y: height -35, size: fontSize ,font});
     page.drawText('power of attorney if a physician certifies in writing at a date later than the date this power of',{x: 50, y: height -365, size: fontSize ,font});
     page.drawText('attorney is executed that, based on the physicians medical examination of me, I am mentally ',{x: 50, y: height -375, size: fontSize ,font});
     page.drawText('incapable of managing my financial affairs. I authorize the physician who examines me for',{x: 50, y: height -385, size: fontSize ,font});
     page.drawText('this purpose to disclose my physical or mental condition to another person for purposes of this power',{x: 50, y: height -395, size: fontSize ,font});
     page.drawText('of attorney. A third party who accepts this power of attorney is fully protected from any action',{x: 50, y: height -405, size: fontSize ,font});
     page.drawText('taken under this power of attorney that is based on the determination made by a physician of my ',{x: 50, y: height -415, size: fontSize ,font});
     page.drawText('disability or incapacity. ',{x: 50, y: height -425, size: fontSize ,font});
     
     
     page.drawText('I agree that any third party who receives a copy of this document may act under it',{x: 70, y: height -440, size: fontSize ,font});
     page.drawText('Termination of this durable power of attorney is not effective as to a third party until the third ',{x: 50, y: height -455, size: fontSize ,font});
     page.drawText('party has actual knowledge of the termination. I agree to indemnify the third party for any',{x: 50, y: height -465, size: fontSize ,font});
     page.drawText('claims that arise against the third party because of reliance on this power of attorney. The ',{x: 50, y: height -475, size: fontSize ,font});
     page.drawText('meaning and effect of this durable power of attorney is determined by Texas law.',{x: 50, y: height -485, size: fontSize ,font});

     page.drawText('If any agent named by me dies, becomes incapacitated, resigns, or refuses to act, or is ',{x: 70, y: height -510, size: fontSize ,font});
     page.drawText('removed by court order, or if my marriage to an agent named by me is dissolved by a court ',{x: 50, y: height -525, size: fontSize ,font});
     page.drawText('decree of divorce or annulment or is declared void by a court (unless I provided in this',{x: 50, y: height -535, size: fontSize ,font});
     page.drawText("document that the dissolution or declaration does not terminate the agent's authority to act ",{x: 50, y: height -545, size: fontSize ,font});
     page.drawText('under this power of attorney), I name the following (each to act alone and successively, in the ',{x: 50, y: height -555, size: fontSize ,font});
     page.drawText('order named) as successor(s) to that agent:',{x: 50, y: height -565, size: fontSize ,font});

     page.drawText('___________________________________________',{x: 50, y: height -590, size: fontSize ,font});
     page.drawText('Signed this ______ day of __________,______.',{x: 80, y: height -630, size: fontSize ,font});

     page.drawText('________________________________________',{x:400, Y: height -660, size: fontSize, font});

      // Footer
    page.drawText('Page 3 of 6', { x: 270, y: 30, size: 10, font });

  }

  private generatePage4(page: any, DocumentPrepareFor: any, font: any, boldFont: any) {
    const { height } = page.getSize();
    const fontSize = 12;

    const name = DocumentPrepareFor?.beneficiary?.firstName + ' ' + DocumentPrepareFor?.beneficiary?.lastName|| '_________________________';

    page.drawText('(your signature)', { x: 400, y: height - 50, size: fontSize });

    page.drawText('State of __________________________', { x: 50, y: height - 80, size: fontSize });
    page.drawText('County of __________________________', { x: 50, y: height - 100, size: fontSize });

    page.drawText('This document was acknowledged before me on _________________ (date) by', { x: 50, y: height - 130, size: fontSize });


    page.drawText('__________________________', { x: 50, y: height - 160, size: fontSize });
    page.drawText('(name of principal)', { x: 50, y: height - 175, size: fontSize });

    page.drawText('(Seal, if any, of notary)', { x: 50, y: height - 190, size: fontSize });


    // Notarial Section
    page.drawText('__________________________', { x: 390, y: height - 310, size: fontSize });
    page.drawText('(signature of notarial officer)', { x: 400, y: height - 325, size: fontSize });

    page.drawText(`${name}`, { x: 395, y: height - 350, size: fontSize });
    page.drawText('(printed name)', { x: 400, y: height - 375, size: fontSize });

    page.drawText('My commission expires: _______________', { x: 385, y: height - 400, size: fontSize });


     // Footer
     page.drawText('Page 4 of 6', { x: 270, y: 30, size: 10, font });

  }

  private generatePage5(page: any, DocumentPrepareFor: any, font: any, boldFont: any) {
    const { height } = page.getSize();
    const fontSize = 12;

    // Title
    page.drawText('STATUTORY DURABLE POWER OF ATTORNEY', { x: 150, y: height - 50, size: 14, font });

    page.drawText('Agent’s Duties',{ x: 50, y: height - 70, size: fontSize, font: boldFont });


    page.drawText('When you accept the authority granted under this power of attorney, you establish a', { x: 70, y: height - 100, size: fontSize });
    page.drawText('“fiduciary” relationship with the principal. This is a special legal relationship that imposes on you', { x: 60, y: height - 115, size: fontSize });
    page.drawText('legal duties that continue until you resign or the power of attorney is terminated, suspended or', { x: 60, y: height - 125, size: fontSize });
    page.drawText('revoked by the principal or by operation of law. A fiduciary duty generally includes the duty to:', { x: 60, y: height - 135, size: fontSize });


    page.drawText('(1) act in good faith;',{ x: 80, y: height - 170, size: fontSize, font });
    page.drawText('(2) do nothing beyond the authority granted in this power of attorney;',{ x: 80, y: height - 190, size: fontSize, font });
    page.drawText('(3) act loyally for the principal’s benefit;',{ x: 80, y: height - 210, size: fontSize, font });
    page.drawText('(4) avoid conflicts that would impair your ability to act in the principal’s best interest; and',{ x: 80, y: height - 230, size: fontSize, font });
    page.drawText('(5) disclose your identity as an agent when you act for the principal by writing or printing the ',{ x: 80, y: height - 250, size: fontSize, font });
    page.drawText('(6) name of the principal and signing your own name as “agent” in the following manner:',{ x: 80, y: height - 270, size: fontSize, font });
    
    page.drawText('(Principal’s Name) by (Your Signature) as Agent',{ x: 100, y: height - 300, size: fontSize, font });

    page.drawText('In addition, the Durable Power of Attorney Act (Subtitle P, Title 2, Estates Code) requires you to:',{ x: 50, y: height - 330, size: fontSize, font });
    page.drawText('(1) maintain records for each action taken or decision made on behalf of the principal;',{ x: 50, y: height - 350, size: fontSize, font });
    page.drawText('(2) maintain all records until delivered to the principal, released by the principal, or discharged by a court; and',{ x: 50, y: height - 370, size: fontSize, font });
    page.drawText('(3) if requested by the principal, provide an accounting to the principal that, unless directed by ',{ x: 50, y: height - 390, size: fontSize, font });
    page.drawText('the principal or otherwise provided in the Special Instructions, must include: ',{ x: 50, y: height - 405, size: fontSize, font });
    page.drawText('(A)the property belonging to the principal that has come to your knowledge or into your possession;',{ x: 80, y: height - 430, size: fontSize, font });
    page.drawText('(B)each action taken or decision made by you as agent;',{ x: 80, y: height - 450, size: fontSize, font });
    page.drawText('(C)a complete account of receipts, disbursements, and other actions of you as agent',{ x: 80, y: height - 470, size: fontSize, font });
    page.drawText('   that includes the source and nature of each receipt, disbursement or action, with ',{ x: 80, y: height - 485, size: fontSize, font });
    page.drawText('   receipts of principal and income shown separately; ',{ x: 80, y: height - 495, size: fontSize, font });
    page.drawText('(D)a listing of all property over which you have exercised control that includes an ',{ x: 80, y: height - 510, size: fontSize, font });
    page.drawText('   adequate description of each asset and the asset’s current value, if known to you;',{ x: 80, y: height - 525, size: fontSize, font });
    page.drawText('(E)the cash balance on hand and the name and location of the depository at which the cash balance is kept;',{ x: 80, y: height - 540, size: fontSize, font });
    page.drawText('(F)each known liability;',{ x: 80, y: height - 560, size: fontSize, font });
    page.drawText('(G)any other information and facts known to you as necessary for a full and definite',{ x: 80, y: height - 580, size: fontSize, font });
    page.drawText('understanding of the exact condition of the property belonging to the principal; and',{ x: 80, y: height - 600, size: fontSize, font });
    page.drawText('(H)all documentation regarding the principal’s property',{ x: 80, y: height - 620, size: fontSize, font });

    page.drawText('Termination of Agent’s Authority',{ x: 50, y: height - 650, size: fontSize, font: boldFont });
    page.drawText('You must stop acting on behalf of the principal if you learn or any event that terminates or',{ x: 60, y: height - 670, size: fontSize, font });
    page.drawText('suspends this power of attorney or your authority under this power of attorney. An event that ',{ x: 50, y: height - 685, size: fontSize, font });
    page.drawText('terminates this power of attorney or your authority to act under this power of attorney includes: ',{ x: 50, y: height - 695, size: fontSize, font });
    page.drawText('suspends this power of attorney or your authority under this power of attorney. An event that ',{ x: 50, y: height - 705, size: fontSize, font });

    page.drawText('(1) the principal’s death;',{ x: 50, y: height - 730, size: fontSize, font });
    page.drawText('(2) the principal’s revocation of this power of attorney or your authority;',{ x: 50, y: height - 750, size: fontSize, font });
    page.drawText('(3) the occurrence of a termination event stated in this power of attorney;',{ x: 50, y: height - 770, size: fontSize, font });


     // Footer
     page.drawText('Page 5 of 6', { x: 270, y: 30, size: 10, font });

  }

  private generatePage6(page: any, DocumentPrepareFor: any, font: any, boldFont: any) {
    const { height } = page.getSize();
    const fontSize = 12;

    page.drawText('(4) if you are married to the principal, the dissolution of your marriage by court decree of',{ x: 50, y: height - 70, size: fontSize, font });
    page.drawText('divorce or annulment or declaration that your marriage is void, unless otherwise provided in',{ x: 50, y: height - 90, size: fontSize, font });
    page.drawText('this power of attorney;',{ x: 50, y: height - 110, size: fontSize, font });
    page.drawText('(5) the appointment and qualification of a permanent guardian of the principal’s estate unless a',{ x: 50, y: height - 130, size: fontSize, font });
    page.drawText('court order provides otherwise; or',{ x: 50, y: height - 150, size: fontSize, font });
    page.drawText('(6) if ordered by a court, your removal as agent (attorney in fact) under this power of attorney',{ x: 50, y: height - 170, size: fontSize, font });
    page.drawText('An event that suspends this power of attorney is the appointment and qualification of a',{ x: 50, y: height - 190, size: fontSize, font });
    page.drawText('temporary guardian unless a court order provides otherwise.',{ x: 50, y: height - 210, size: fontSize, font });

    page.drawText('Liability of the Agent ',{ x: 70, y: height - 230, size: fontSize, font: boldFont });
    page.drawText('The authority granted to you under this power of attorney is specified in the Durable Power ',{ x: 70, y: height - 250, size: fontSize, font });
    page.drawText('of Attorney Act (Subtitle P, Title 2, Estates Code). If you violate the Durable Power of Attorney ',{ x: 50, y: height - 270, size: fontSize, font });
    page.drawText('Act or act beyond the authority granted, you may be liable for any damages caused by the violation',{ x: 50, y: height - 290, size: fontSize, font });
    page.drawText('or subject to prosecution for misapplication of property by a fiduciary under Chapter 32 of the',{ x: 50, y: height - 300, size: fontSize, font });
    page.drawText('Texas Penal Code.',{ x: 50, y: height - 320, size: fontSize, font });
    page.drawText('THE AGENT, BY ACCEPTING OR ACTING UNDER THE APPOINTMENT, ',{ x: 70, y: height - 350, size: fontSize, font });
    page.drawText('ASSUMES THE FIDUCIARY AND OTHER LEGAL RESPONSIBILITIES OF AN AGENT. ',{ x: 70, y: height - 370, size: fontSize, font });


     // Footer
     page.drawText('Page 6 of 6', { x: 270, y: 30, size: 10, font });

  }

  private generatePlaceholderPage(page: any, pageNum: number, font: any) {
    const { height } = page.getSize();
    page.drawText(`Page ${pageNum} Content Placeholder`, { x: 50, y: height - 100, size: 14, font });
    page.drawText(`This page will contain specific content as needed.`, { x: 50, y: height - 130, size: 12, font });
    page.drawText(`Page ${pageNum} of 6`, { x: 270, y: 30, size: 10, font });
  }

  public drawCheckbox(page: any, x: number, y: number, label: string, isChecked: boolean) {
    page.drawRectangle({
      x, y, width: 10, height: 10, borderColor: rgb(0, 0, 0),
      color: isChecked ? rgb(0, 0, 0) : undefined
    });
    page.drawText(label, { x: x + 20, y, size: 12 });
  }

  private async downloadPDF(pdfBytes: Uint8Array, filename: string) {
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    link.click();
  }
}

function wrapText(text: string, maxWidth: number, font: PDFFont) {
  const words = text.split(' ');
  let lines: string[] = [];
  let currentLine = '';
  const fontSize = 12;

  for (const word of words) {
    const testLine = currentLine ? currentLine + ' ' + word : word;
    const textWidth = font.widthOfTextAtSize(testLine, fontSize);
    if (textWidth < maxWidth) {
      currentLine = testLine;
    } else {
      lines.push(currentLine.trim()); // Remove extra spaces
      currentLine = word;
    }
  }
  lines.push(currentLine.trim());
  return lines;
}



