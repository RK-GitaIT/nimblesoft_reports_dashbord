import { Injectable } from '@angular/core';
import { PDFDocument, rgb, StandardFonts } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class Healthcare_hipaa_pdf {

  async generatePdf(DocumentPrepareFor: any) {
    const pdfDoc = await PDFDocument.create();
    
    // Page 1
    const page1 = pdfDoc.addPage([600, 800]);
    this.generatePage1(page1, DocumentPrepareFor, pdfDoc);
    
    // Page 2
    const page2 = pdfDoc.addPage([600, 800]);
    this.generatePage2(page2, DocumentPrepareFor);

    // Page 3
    const page3 = pdfDoc.addPage([600,800]);
    this.generatePage3(page3, DocumentPrepareFor);

    // Save PDF
    const pdfBytes = await pdfDoc.save();
    this.downloadPDF(pdfBytes, "HIPAA_Release_Form.pdf");
  }

  // Page 1 Content
  public generatePage1(page: any, DocumentPrepareFor: any, pdfDoc: PDFDocument) {
    const { height } = page.getSize();
    const fontSize = 10;

    const boldFont = pdfDoc.embedFont(StandardFonts.HelveticaBold);

    if (!boldFont) {
        console.error("Failed to load bold font");
        return;
    }

    page.drawText('HIPAA Release Form', { x: 180, y: height - 50, size: 16, color: rgb(0, 0, 0) });
    page.drawText('Please complete all sections of this HIPAA release form. If any sections are left blank, this form', { x: 50, y: height - 80, size: fontSize });
    page.drawText('will be invalid and it will not be possible for your health information to be shared as requested.', { x: 50, y: height -100, size: fontSize})

    page.drawText('Section I', { x: 50, y: height - 160, size: 14, color: rgb(0, 0, 0) });


    page.drawText(`I, ${DocumentPrepareFor?.beneficiary?.firstName + ' ' + DocumentPrepareFor?.beneficiary?.lastName|| '_____________________________________________'}, give my permission for`, { x: 50, y: height - 190, size: fontSize, boldFont, color: rgb(0, 0, 0) });
    page.drawText(`${DocumentPrepareFor?.beneficiary?.nomini_name || '_____________________________________________'},to share the information listed in`, { x: 50, y: height - 210, size: fontSize, boldFont });    
    page.drawText('Section II of this document with the person(s) or organization(s) I have specified in Section IV.', { x: 50, y: height - 230, size: fontSize });

    page.drawText('Section II – Health Information', { x: 50, y: height - 270, size: 14, color: rgb(0, 0, 0) });
    page.drawText('I would like to give the above healthcare organization permission to:', { x: 50, y: height - 290, size: fontSize });
    this.drawCheckbox(page, 50, height - 310, 'Disclose my complete health record including diagnoses, lab tests, treatment, and billing records.', DocumentPrepareFor?.Beneficiaries);
    this.drawCheckbox(page, 50, height - 330, 'Disclose my complete health record except for the following:', DocumentPrepareFor?.Beneficiaries);
    this.drawCheckbox(page, 80, height - 350, 'Mental health records', DocumentPrepareFor?.Beneficiaries);
    this.drawCheckbox(page, 80, height - 370, 'Communicable diseases (HIV/AIDS)', DocumentPrepareFor?.Beneficiaries);
    this.drawCheckbox(page, 80, height - 390, 'Alcohol/drug abuse treatment', DocumentPrepareFor?.Beneficiaries);
    this.drawCheckbox(page, 80, height - 410, 'Genetic information', DocumentPrepareFor?.Beneficiaries);
    this.drawCheckbox(page, 80, height - 430, 'Other',DocumentPrepareFor?.Beneficiaries)
    page.drawText('____________________________________', { x: 80, y: height - 450, size: fontSize });
    page.drawText('____________________________________', { x: 80, y: height - 470, size: fontSize });
    page.drawText('____________________________________', { x: 80, y: height - 490, size: fontSize });
    page.drawText('____________________________________', { x: 80, y: height - 510, size: fontSize });

    page.drawText('Form of Disclosure:', { x: 50, y: height - 530, size: fontSize });
    this.drawCheckbox(page, 50, height - 550, 'Electronic copy or web-based portal', DocumentPrepareFor?.Beneficiaries);
    this.drawCheckbox(page, 50, height - 570, 'Hard copy', DocumentPrepareFor?.Beneficiaries);

    page.drawText('Section III – Reason for Disclosure', { x: 50, y: height - 600, size: 14, color: rgb(0, 0, 0) });
    page.drawText('Please detail the reasons why information is being shared. If you are initiating the request for', { x: 50, y: height - 620, size: fontSize });
    page.drawText('sharing information and do not wish to list the reasons for sharing, write ‘at my request’.', { x: 50, y: height - 640, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 660, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 680, size: fontSize });

    page.drawText('Page 1 of 3', { x: 270, y: 30, size: 10, color: rgb(0, 0, 0) });
  }

  // Page 2 Content
  private generatePage2(page: any, DocumentPrepareFor: any) {
    const { height } = page.getSize();
    const fontSize = 12;

    // Section Dividers
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 50, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 70, size: fontSize });
    page.drawText('___________________________________________________________________________', { x: 50, y: height - 90, size: fontSize });

    // Section IV
    page.drawText('Section IV – Who Can Receive My Health Information', { x: 50, y: height - 120, size: 14, color: rgb(0, 0, 0) });
    page.drawText('I give authorization for the health information detailed in section II of this document to be', { x: 50, y: height - 140, size: fontSize });
    page.drawText('shared with the following individual(s) or organization(s):', { x: 50, y: height - 160, size: fontSize });

    const clientName = DocumentPrepareFor?.Beneficiaries?.firstName + DocumentPrepareFor?.Beneficiaries?.lastName || "_____________________________________________";
    const permissionEntity = DocumentPrepareFor?.Beneficiaries?.name || "____________________________________________";
    const Address = DocumentPrepareFor?.Beneficiaries?.Address || "________________________________________________________________";
    const Organization = DocumentPrepareFor?.Beneficiaries?.Organization || "________________________________________________________________"

    // Recipient Fields
    page.drawText(`Name: ${clientName}`, { x: 50, y: height - 180, size: fontSize });
    page.drawText(`Organization: ${Organization}`, { x: 50, y: height - 200, size: fontSize });
    page.drawText(`Address: ${Address}`, { x: 50, y: height - 220, size: fontSize });

    page.drawText('I understand that the person(s)/organization(s) listed above may not be covered by', { x: 50, y: height - 240, size: fontSize });
    page.drawText('state/federal rules governing privacy and security of data and may be permitted to further', { x: 50, y: height - 260, size: fontSize });
    page.drawText('share the information that is provided to them.', { x: 50, y: height - 280, size: fontSize });

    // Section V – Duration of Authorization
    page.drawText('Section V – Duration of Authorization', { x: 50, y: height - 310, size: 14, color: rgb(0, 0, 0) });
    page.drawText('This authorization to share my health information is valid:', { x: 50, y: height - 330, size: fontSize });
    
    this.drawCheckbox(page, 50, height - 350, 'a) From', DocumentPrepareFor?.Beneficiaries?.durationFrom);
    page.drawText(` ${DocumentPrepareFor?.Beneficiaries?.startDate || '___/___/____'} to ${DocumentPrepareFor?.Beneficiaries?.endDate || '___/___/___'}`, { x: 100, y: height - 350, size: fontSize });
    
    this.drawCheckbox(page, 50, height - 370, 'b) All past, present, and future periods', DocumentPrepareFor.allPeriods);
    this.drawCheckbox(page, 50, height - 390, 'c) The date of the signature in Section VI until the following event:', DocumentPrepareFor.untilEvent);
    page.drawText(DocumentPrepareFor?.Beneficiaries?.eventDescription || '________________________', { x: 100, y: height - 410, size: fontSize });
    
    page.drawText('I understand that I am permitted to revoke this authorization to share my health data at any', { x: 50, y: height - 440, size: fontSize });
    page.drawText('time and can do so by submitting a request in writing to:', { x: 50, y: height - 460, size: fontSize });
    page.drawText('Name: ________________________________________________________________', { x: 50, y: height - 480, size: fontSize });
    page.drawText('Organization: ________________________________________________________________', { x: 50, y: height - 500, size: fontSize });
    page.drawText('Address: ________________________________________________________________', { x: 50, y: height - 520, size: fontSize });

    page.drawText('I understand that:', { x: 50, y: height - 550, size: fontSize });
    page.drawText('• In the event that my information has already been shared by the time my authorization is revoked,', { x: 60, y: height - 570, size: fontSize });
    page.drawText('  it may be too late to cancel permission to share my health data.', { x: 70, y: height - 590, size: fontSize });
    page.drawText('• I understand that I do not need to give any further permission for the information detailed in', { x: 60, y: height - 610, size: fontSize });
    page.drawText('  Section II to be shared with the person(s) or organization(s) listed in Section IV.', { x: 70, y: height - 630, size: fontSize });
    
    page.drawText('Page 2 of 3', { x: 270, y: 30, size: 10, color: rgb(0, 0, 0) });
  }


  // Page 3 Content
  public generatePage3(page: any, DocumentPrepareFor: any) {
    const { height } = page.getSize();
    const fontSize = 12;

    page.drawText('• I understand that the failure to sign/submit this authorization or the cancellation of', { x: 50, y: height - 50, size: fontSize });
    page.drawText('this authorization will not prevent me from receiving any treatment or benefits I am entitled to receive.', { x: 50, y: height - 70, size: fontSize });

    page.drawText('Section VI – Signature', { x: 50, y: height - 110, size: 14, color: rgb(0, 0, 0) });
    page.drawText('Signature: __________________________________ Date: __________________________', { x: 50, y: height - 140, size: fontSize });
    page.drawText(`Print your name: ${DocumentPrepareFor?.beneficiary?.firstName + ' ' + DocumentPrepareFor?.beneficiary?.lastName|| '_____________________________________________'}`, { x: 50, y: height - 180, size: fontSize });
    
    page.drawText('If this form is being completed by a person with legal authority to act on an individual’s behalf,', { x: 50, y: height - 210, size: fontSize });
    page.drawText('such as a parent or legal guardian of a minor or health care agent, please complete the following:', { x: 50, y: height - 230, size: fontSize });
    
    page.drawText('Name of person completing this form: ______________________________________', { x: 50, y: height - 270, size: fontSize });
    page.drawText('Signature of person completing this form: ______________________________________', { x: 50, y: height - 290, size: fontSize });
    page.drawText('Describe below how this person has legal authority to sign this form:', { x: 50, y: height - 320, size: fontSize });
    page.drawText('_______________________________________________________________', { x: 50, y: height - 340, size: fontSize });
    page.drawText('_______________________________________________________________', { x: 50, y: height - 360, size: fontSize });
    page.drawText('_______________________________________________________________', { x: 50, y: height - 380, size: fontSize });
    page.drawText('_______________________________________________________________', { x: 50, y: height - 400, size: fontSize });
    
    page.drawText('Page 3 of 3', { x: 270, y: 30, size: 10, color: rgb(0, 0, 0) });
  }

  public drawCheckbox(page: any, x: number, y: number, label: string, isChecked: boolean) {
    page.drawRectangle({
      x, y, width: 10, height: 10, borderColor: rgb(0, 0, 0),
      color: isChecked ? rgb(0, 0, 0) : undefined
    });
    page.drawText(label, { x: x + 20, y, size: 12 });
  }

  public downloadPDF(pdfBytes: Uint8Array, fileName: string) {
    const blob = new Blob([pdfBytes], { type: "application/pdf" });
    const link = document.createElement("a");
    link.href = window.URL.createObjectURL(blob);
    link.download = fileName;
    link.click();
  }
}
