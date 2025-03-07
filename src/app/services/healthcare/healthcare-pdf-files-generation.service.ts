import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { LegalDocumentsService } from '../leagl_documents/leagl-documents.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root'
})
export class HealthcarePdfFilesGenerationService {

  client_data: any = null;
  files: File[] = [];

  constructor(
    private fileupload: LegalDocumentsService,
    private toastService: ToastService ,
    private router: Router
  ) { }

  private async medicalPowerOfAttorney(): Promise<void> {
    try {
      const url = 'assets/pdf/MedicalPowerOfAttorney.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

       var fields = [
        { pdfField: 'NameTXT' , type: 'text', value: this.client_data?.beneficiary?.firstName + this.client_data?.beneficiary?.lastName},
        { pdfField: 'NomineeTxt' , type: 'text', value: this.client_data?.beneficiary?.firstName + this.client_data?.beneficiary?.lastName },
        {  pdfField: 'NomineeAddress' , type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'NomineePhone' , type: 'text', value: this.client_data?.beneficiary?.address},
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p2[0].TextField1[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p2[0].TextField1[1]' , type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p2[0].TextField1[2]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p2[0].TextField1[3]' , type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[0].TextField2[0]' , type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[0].TextField2[1]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[0].TextField2[2]' , type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[1].TextField2[3]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[1].TextField2[4]' , type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[1].TextField2[5]' , type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[2].TextField2[6]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[3].TextField2[7]' , type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[3].TextField2[8]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[4].TextField2[9]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[4].TextField2[10]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page2[0].s2[0].TextField2[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p2[0].p1[0].NumericField1[0]',  type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p2[0].p1[0].DateField2[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p2[0].p2[0].TextField2[0]',  type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p2[0].p3[0].SignatureField2[0]',  type: 'text',value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p2[0].p4[0].TextField2[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p3[0].TextField3[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p4[0].p1[0].NumericField1[0]',  type: 'text', value: this.client_data?.beneficiary?.address},
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p4[0].p1[0].TextField5[0]',  type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p4[0].p2[0].left[0].p1[0].SignatureField3[0]',  type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p4[0].p2[0].left[0].p2[0].TextField4[0]',  type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page3[0].s6[0].p4[0].p2[0].left[0].p3[0].TextField2[0]',  type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s7[0].p2[0].p1[0].NumericField1[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s7[0].p2[0].p1[0].DateField2[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s7[0].p2[0].p2[0].TextField2[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s7[0].p2[0].p3[0].SignatureField2[0]', type: 'text',value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s7[0].p2[0].p4[0].TextField2[0]',type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s8[0].p3[0].SignatureField4[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s8[0].p3[0].TextField2[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s8[0].p3[0].DateField3[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s8[0].p3[0].TextField2[1]',type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s9[0].p2[0].SignatureField4[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s9[0].p2[0].TextField2[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s9[0].p2[0].DateField3[0]', type: 'text', value: this.client_data?.beneficiary?.address },
        {  pdfField: 'form_MPOA[0].page4[0].s9[0].p2[0].TextField2[1]', type: 'text', value: this.client_data?.beneficiary?.address },
      ];
      
     const form = pdfDoc.getForm();
     const availableFields = form.getFields().map(field => field.getName());
 
     fields.forEach(fieldDef => {
       const value = fieldDef.value;
       if (availableFields.includes(fieldDef.pdfField)) {
         try {
           switch (fieldDef.type) {
             case 'text':
               form.getTextField(fieldDef.pdfField).setText(value);
               break;
             case 'radio':
               form.getRadioGroup(fieldDef.pdfField).select(value);
               break;
             case 'checkbox':
               const checkbox = form.getCheckBox(fieldDef.pdfField);
               value ? checkbox.check() : checkbox.uncheck();
               break;
             default:
               form.getTextField(fieldDef.pdfField).setText(value);
           }
           console.log(`Filled "${fieldDef.pdfField}" with value "${value}"`);
         } catch (e) {
           console.warn(`Error setting value for field "${fieldDef.pdfField}":`, e);
         }
       } else {
         console.warn(`PDF field "${fieldDef.pdfField}" not found. Available fields: ${availableFields.join(', ')}`);
       }
     });
 
     // Save the filled PDF
     const filledPdfBytes = await pdfDoc.save();
     const blob = new Blob([filledPdfBytes], { type: 'application/pdf' });
     const fileName = 'Medical power of attorney designation of health care agent.pdf';
     const file = new File([blob], fileName, { type: 'application/pdf' });
 
     // Add the file to the files array
     this.files.push(file);
     console.log('Medical Power of Attorney PDF loaded and filled successfully.');
    } catch (error) {
      console.error('Error loading Medical Power Of Attorney PDF:', error);
    }
  }
  

  private async hipaa(): Promise<void> {
    try {
      const url = 'assets/pdf/HiPa.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'HIPAA.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('HIPAA PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading HIPAA PDF:', error);
    }
  }

  private async sdpoa(): Promise<void> {
    try {
      const url = 'assets/pdf/SDPOA.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'SDPOA.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('SDPOA PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading SDPOA PDF:', error);
    }
  }

  async loadPdfs(client_data: any): Promise<void> {
    this.client_data = client_data;
    this.files = [];
    await this.medicalPowerOfAttorney();
    //await this.hipaa();
    //await this.sdpoa();
    await this.pdf_files_uploads();
  }

  private async pdf_files_uploads(): Promise<void> {

    this.fileupload.uploadDocuments(this.files, "Healthcare", "Healthcare", 1)
      .subscribe({
        next: (response) => {
          console.log("PDFs uploaded successfully:", response);
          this.toastService.showToast('Files created successfully!', '', 'success', 3000);
          this.router.navigate(['/my-files']);
        },
        error: (error) => {
          console.error("Error uploading PDFs:", error);
          this.toastService.showToast('Error creating PDFs', '', 'error', 3000);
        }
      });
  }
}
