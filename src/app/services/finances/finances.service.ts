import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { DocumentPrepareFor } from '../../component/smart-services/property-guardianship/property-guardianship.component';
import { Router } from '@angular/router';
import { LegalDocumentsService } from '../leagl_documents/leagl-documents.service';
import { ToastService } from '../toast.service';
import { Beneficiary } from '../../models/interfaces/Beneficiary.model';

@Injectable({
  providedIn: 'root'
})
export class FinancesService {
  generatePdf(DocumentPrepareFor: DocumentPrepareFor) {
    throw new Error('Method not implemented.');
  }
  client_data: any = null;
  files: File[] = [];
  
  constructor(
    private fileupload: LegalDocumentsService,
    private toastService: ToastService ,
    private router: Router
  ) { }


  private async PowerOfAttorney(): Promise<void> {
    try {
      const url = 'assets/pdf/Finances - Power of Attorney.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      console.log("Data_Finance:",this.client_data?.SuccessorRepresentativesAgent)

      var fields = [
        {
          controlName: 'field1',
          pdfField: 'Person_Name',
          label: 'Your Name & Address',
          tooltip: 'insert your name and adress',
          type: 'text',
          value: `${this.client_data?.beneficiary?.firstName ?? ''} ${this.client_data?.beneficiary?.lastName ?? ''} ${this.client_data?.beneficiary?.address ?? ''}`.trim()
        },
        {
          controlName: 'field2',
          pdfField: 'Child_Name', 
          label: 'Your Agent Name & Address',
          tooltip: 'insert the name and address of the person appointed',
          type: 'text',
          value: this.client_data?.RepresentativesAgent?.length ? this.client_data?.RepresentativesAgent.map((agent: Beneficiary) => `${agent.firstName ?? ''} ${agent.lastName ?? ''}`).join(', ').trim(): ''
        }
        ,
        {
          controlName: 'field3',
          pdfField: 'Address1',
          label: 'Your Agent Name & Address',
          tooltip: 'insert the name and address of the person appointed',
          type: 'text',
          value: `${this.client_data?.RepresentativesAgent?.[0]?.address ?? ''} `.trim()
        }
        ,
        {
          controlName: 'field4',
          pdfField: 'Address2',
          label: 'Your Agent Name & Address',
          tooltip: 'insert the name and address of the person appointed',
          type: 'text',
          value: `${this.client_data?.RepresentativesAgent?.[0]?.city ?? ''} ${this.client_data?.RepresentativesAgent?.[0]?.state ?? ''} ${this.client_data?.SuccessorRepresentativesAgent?.[0]?.zipCode ?? ''}`.trim()
        }
      ];

      const form = pdfDoc.getForm();
      const availableFields = form.getFields().map(field => field.getName());

      fields.forEach(fieldDef => {
        const value = fieldDef.value;
        if (availableFields.includes(fieldDef.pdfField)) {
          try {
            switch (fieldDef.type) {
              case 'text':
                const textField = form.getTextField(fieldDef.pdfField).setText(value);
                console.log(`Filled "${fieldDef.pdfField}" with value "${value}"`);
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

      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'Finances - Power of Attorney.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
    } catch (error) {
      console.error('Error loading Finances - Power of Attorney PDF:', error);
    }
  }

  private async PowerOfAttorneyInstructions(): Promise<void> {
    try {
      const url = 'assets/pdf/Finances - Power of Attorney Execution Instructions.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'Finances - Power of Attorney Execution Instructions.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
    } catch (error) {
      console.error('Error loading Finances - Power of Attorney PDF:', error);
    }
  }

  async loadPdfs(client_data: any): Promise<void> {
    this.client_data = client_data;
    this.files = [];
    await this.PowerOfAttorney();
    await this.PowerOfAttorneyInstructions();
    await this.pdf_files_uploads();
  }

  private async pdf_files_uploads(): Promise<void> {

    this.fileupload.uploadDocuments(this.files, "Finances", "Finances", 1)
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
