import { PDFDocument, PDFFont, PDFPage, RGB, rgb, StandardFonts } from 'pdf-lib';

export async function generateMedicalPowerOfAttorneyPDF(data:any): Promise<void> {
    const pdfDoc = await PDFDocument.create();
    const timesNewRoman = await pdfDoc.embedFont(StandardFonts.Helvetica);
    const timesNewRomanBold = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
    const {firstName,lastName,address,phoneNumber}=data.beneficiary;
    const userName=firstName + lastName;
    const firstagent=data.HealthcareSuccessorHealthcareAgents[0];
    const secondagent=data.HealthcareSuccessorHealthcareAgents[1];
    const firstagentName= firstagent ? firstagent.firstName+firstagent.lastName : '';
    const firstagentAdress=firstagent ? firstagent.address : '';
    const firstagentPhone=firstagent ? firstagent.phoneNumber :'';
    const secondagentName=secondagent ? secondagent.firstName+secondagent.lastName : '';
    const secondagentAdress=firstagent ? secondagent.address : '';
    const secondagentPhone=firstagent ? secondagent.phoneNumber :'';
    const dynamicValues: Record<string, string> ={
      firstagentName,
      secondagentName,
      firstagentAdress,
      firstagentPhone,
      secondagentPhone,
      secondagentAdress,
      userName,
      address,
      phoneNumber,
      firstagent,
      secondagent
    }
  
  
    const pageSize = { width: 625.28, height: 1050.89 }; // A4 size
    const margin = 50;
    const lineHeight = 20; // Increased line height for better readability
    const fontSize = 10; // Font size
  
    // Function to create a new page
    async function createPage(headerText: string) {
        const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        const font = await pdfDoc.embedFont(StandardFonts.HelveticaBold); // Embed a font for the header

        // Add header to the top right
        const headerSize = 20 
        const textWidth = font.widthOfTextAtSize(headerText, headerSize);
        const x = pageSize.width - textWidth - 48; // 50px margin from the right
        const y = pageSize.height - 30; // 50px margin from the top

        page.drawText(headerText, {
            x,
            y,
            size: headerSize,
            font,
            color: rgb(0, 0, 0), // Black color
        });

        return page;
    }
  
    function addParagraph(
      page: PDFPage,
      text: string,
      y: number,
      font = timesNewRoman,
      size = fontSize,
      alignment = 'left'
  ) {
      const lines = text.split('\n'); // Split text into lines
      let currentY = y;
  
      for (const line of lines) {
          const words = line.split(' ');
          let x = margin;
  
          // Adjust X position based on alignment
          if (alignment === 'center') {
              const lineWidth = words.reduce((acc, word) => acc + font.widthOfTextAtSize(word + ' ', size), 0);
              x = (pageSize.width - lineWidth) / 2;
          } else if (alignment === 'right') {
              const lineWidth = words.reduce((acc, word) => acc + font.widthOfTextAtSize(word + ' ', size), 0);
              x = pageSize.width - margin - lineWidth;
          }
  
          for (const word of words) {
              let wordFont = font;
              let wordText = word;
              let wordSize = size;
              let isDynamic = false;
  
              // Check for dynamic placeholders
              if (word.startsWith('${') && word.endsWith('}')) {
                  const key = word.slice(2, -1); // Extract variable name
                  const dynamicValue = dynamicValues[key];
                  wordText = dynamicValue !== undefined && dynamicValue !== null && dynamicValue.trim() !== '' 
                      ? dynamicValue 
                      : '_____________________________________________'; // Default placeholder
                  wordFont = timesNewRomanBold;
                  isDynamic = true;
              }
  
              // Check for emphasized words (*boldText*)
              if (word.startsWith('*') && word.endsWith('*')) {
                wordText = word.slice(1, -1).replace(/''/g, ' '); // Remove * symbols and replace '' with space
                wordFont = timesNewRomanBold;
                wordSize = size * 1.2; // Increase font size by 20%
                const lineWidth = wordFont.widthOfTextAtSize(wordText + ' ', wordSize);
                x = (pageSize.width - lineWidth) / 2; // Align center
            }
  
              const wordWidth = wordFont.widthOfTextAtSize(wordText + ' ', wordSize);
              if (x + wordWidth > pageSize.width - margin) {
                  x = margin;
                  currentY -= lineHeight; // Move to the next line
              }
  
              page.drawText(wordText + ' ', {
                  x,
                  y: currentY,
                  size: wordSize,
                  font: wordFont,
                  color: rgb(0, 0, 0),
              });
  
              x += wordWidth;
          }
  
          currentY -= lineHeight; // Move down for the next line
      }
  
      return currentY; // Return the new Y position
  }
  
  
  
  
    // Function to add headings
    function addHeading(page: PDFPage, text: string, y: number, isBold = false) {
      const font = isBold ? timesNewRomanBold : timesNewRoman;
      const textWidth = font.widthOfTextAtSize(text, 14);
      const x = (pageSize.width - textWidth) / 2;
      page.drawText(text, { x, y, size: 14, font, color: rgb(0, 0, 0) });
      return y - lineHeight; // Return the new Y position
    }
  
    // Page 1 Content
    const page1Content = [
      "I ${userName} (insert your name) appoint:",
      "  Name: ${userName}",
      "  Address: ${address}" ,
      "  Phone: ${phoneNumber}",
      "as my agent to make any and all health care decisions for me, except to the extent I state otherwise in this document. This medical power of attorney takes effect if I become unable to make my own health care decisions and this fact is certified in writing by my physician.",
      "Limitations On The Decision-Making Authority Of My Agent Are As Follows: _________________________________________________________________\n ________________________________________________________________\n ________________________________________________________________\n ________________________________________________________________\n",
      "Designation Of An Alternate Agent:",
      "(You are not required to designate an alternate agent but you may do so. An alternate agent may make the same health care decisions as the designated agent if the designated agent is unable or unwilling to act as your agent. If the agent designated is your spouse, the designation is automatically revoked by law if your marriage is dissolved, annulled, or declared void unless this document provides otherwise.)\n",
      "If the person designated as my agent is unable or unwilling to make health care decisions for me, I designate the following person(s) to serve as my agent to make health care decisions for me as authorized by this document, who serve in the following order:\n",
      "First Alternate Agent",
      "  Name: ${firstagentName} ",
      "  Address: ${firstagentAdress} ",
      "  Phone: ${firstagentPhone} \n",
      "Second Alternate Agent",
      "  Name: ${secondagentName} ",
      "  Address: ${secondagentAdress} ",
      "  Phone: ${secondagentPhone} ",
      "The original of the document is kept at ___________________________________",
      "The following individuals or institutions have signed copies:",
      "  Name: ____________________________________________",
      "  Address: ____________________________________________\n",
      "  Name: ____________________________________________",
      "  Address: ____________________________________________"
    ].join('\n');
    const page2Content = [
      "*Duration*",
      "I understand that this power of attorney exists indefinitely from the date I execute this document unless I establish a shorter time or revoke the power of attorney. If I am unable to make health care decisions for myself when this power of attorney expires, the authority I have granted my agent continues to exist until the time I become able to make health care decisions for myself.",
      "(If Applicable) This power of attorney ends on the following date: _________________________________",
      "*Prior''Designations''Revoked*",
      "I revoke any prior medical power of attorney.",
      "*Disclosure''Statement*",
      "This Medical Power Of Attorney Is An Important Legal Document. Before Signing This Document, You Should Know These Important Facts:",
      "Except to the extent you state otherwise, this document gives the person you name as your agent the authority to make any and all health care decisions for you in accordance with your wishes, including your religious and moral beliefs, when you are unable to make the decisions for yourself. Because 'health care' means any treatment, service, or procedure to maintain, diagnose, or treat your physical or mental condition, your agent has the power to make a broad range of health care decisions for you. Your agent may consent, refuse to consent, or withdraw consent to medical treatment and may make decisions about withdrawing or withholding life-sustaining treatment. Your agent may not consent to voluntary inpatient mental health services, convulsive treatment, psychosurgery, or abortion. A physician must comply with your agent's instructions or allow you to be transferred to another physician.",
      "Your agent's authority is effective when your doctor certifies that you lack the competence to make health care decisions.",
      "Your agent is obligated to follow your instructions when making decisions on your behalf. Unless you state otherwise, your agent has the same authority to make decisions about your health care as you would have if you were able to make health care decisions for yourself.",
      "It is important that you discuss this document with your physician or other health care provider before you sign the document to ensure that you understand the nature and range of decisions that may be made on your behalf. If you do not have a physician, you should talk with someone else who is knowledgeable about these issues and can answer your questions. You do not need a lawyer's assistance to complete this document, but if there is anything in this document that you do not understand, you should ask a lawyer to explain it to you.",
      "The person you appoint as agent should be someone you know and trust. The person must be 18 years of age or older or a person under 18 years of age who has had the disabilities of minority removed. If you appoint your health or residential care provider (e.g., your physician or an employee of a home health agency, hospital, nursing facility, or residential care facility, other than a relative), that person has to choose between acting as your agent or as your health or residential care provider; the law does not allow a person to serve as both at the same time.",
      "You should inform the person you appoint that you want the person to be your health care agent. You should discuss this document with your agent and your physician and give each a signed copy. You should indicate on the document itself the people and institutions that you intend to have signed copies. Your agent is not liable for health care decisions made in good faith on your behalf.",
      "Once you have signed this document, you have the right to make health care decisions for yourself as long as you are able to make those decisions, and treatment cannot be given to you or stopped over your objection. You have the right to revoke the authority granted to your agent by informing your agent or your health or residential care provider orally or in writing or by your execution of a subsequent medical power of attorney. Unless you state otherwise in this document, your appointment of a spouse is revoked if your marriage is dissolved, annulled, or declared void.",
      "This document may not be changed or modified. If you want to make changes in this document, you must execute a new medical power of attorney.",
      "You may wish to designate an alternate agent in the event that your agent is unwilling, unable, or ineligible to act as your agent. If you designate an alternate agent, the alternate agent has the same authority as the agent to make health care decisions for you."
    ].join('\n'); 
    // Page 3 Content
    const page3Content = [
      "This Power Of Attorney Is Not Valid Unless:",
      "  (1) You Sign It And Have Your Signature Acknowledged Before A Notary Public; Or",
      "  (2) You Sign It In The Presence Of Two Competent Adult Witnesses.",
      "The Following Persons May Not Act As One Of The Witnesses:",
      "  (1) the person you have designated as your agent;",
      "  (2) a person related to you by blood or marriage;",
      "  (3) a person entitled to any part of your estate after your death under a will or codicil executed by you or by operation of law;",
      "  (4) your attending physician;",
      "  (5) an employee of your attending physician;",
      "  (6) an employee of a health care facility in which you are a patient if the employee is providing direct patient care to you or is an officer, director, partner, or business office employee of the health care facility or of any parent organization of the health care facility;",
      "  (7) a person who, at the time this medical power of attorney is executed, has a claim against any part of your estate after your death.",
      "By signing below, I acknowledge that I have read and understand the information contained in the above disclosure statement.",
      "*(You Must Date And Sign This Power Of Attorney. You May Sign It And Have Your Signature Acknowledged Before A Notary Public Or You May Sign It In The Presence Of Two Competent Adult Witnesses.)*",
      "Signature Acknowledged Before Notary",
      "I sign my name to this medical power of attorney on day ___________________________ of (month, year) at",
      "________________________________________________",
      "(City and State)",
      "________________________________________________",
      "(Signature)",
      "${userName}",
      "(Print Name)",
      "State of Texas",
      "County of ___________________________________________",
      "This instrument was acknowledged before me on ___________________________________ (date) by ________________________ (name of person acknowledging).",
      "________________________________________________",
      "Notary Public, State of Texas",
      "Notary's printed name:",
      "________________________________________________",
      "My commission expires:",
      "________________________________________________",
      "SEAL",
      "OR",
    
    ].join('\n'); 
    // Page 4 Content
    const page4Content = [
      "Signature In Presence Of Two Competent Adult Witnesses",
      "I sign my name to this medical power of attorney on ____________ day of (month, year) at",
      "________________________________________________",
      "(City and State)",
      "________________________________________________",
      "(Signature)",
      "________________________________________________",
      "(Print Name)\n",
      "Statement Of First Witness",
      "I am not the person appointed as agent by this document. I am not related to the principal by blood or marriage. I would not be entitled to any portion of the principal's estate on the principal's death. I am not the attending physician of the principal or an employee of the attending physician. I have no claim against any portion of the principal's estate on the principal's death.",
      "  Signature: _____________________________________________________________________________",
      "  Printed Name: _______________________________________________ Date: ______________________",
      "  Address: _______________________________________________________________________________\n",
      "Statement Of Second Witness",
      "  Signature: ______________________________________________________________________________",
      "  Printed Name: ________________________________________________ Date: ______________________",
      "  Address: _________________________________________________________________________________"
    ].join('\n'); // Join with newline characters
  
    // Create pages and add content
    const pagesContent = [page1Content, page2Content, page3Content, page4Content];
  
    for (let i = 0; i < pagesContent.length; i++) {
      const page = await createPage("Estate Planning");
      let y = pageSize.height - margin-15;
  
      // Add content to each page
      if (i === 0) {
        y = addHeading(page, "Medical Power of Attorney Designation of Health Care Agent (MPOA)", y, true); // Bold heading
        y -= 10; // Additional spacing after heading
        y = addParagraph(page, "Advance Directives Act (see §166.164, Health and Safety Code)", y, timesNewRoman, fontSize,'center');
        y -= 15; // Additional spacing after the second line
      }
  
      // Add the content for each page
      y = addParagraph(page, pagesContent[i], y); // Add the joined content for the page
    }
  
    // Save the document
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Medical_Power_of_Attorney.pdf';
    link.click();
  }