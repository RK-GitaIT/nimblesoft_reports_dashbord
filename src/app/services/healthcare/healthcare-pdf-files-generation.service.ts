import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';
import { LegalDocumentsService } from '../leagl_documents/leagl-documents.service';
import { ToastService } from '../../services/toast.service';
import { Router } from '@angular/router';
import { DocumentPrepareFor } from '../../component/smart-services/property-guardianship/property-guardianship.component';

@Injectable({
  providedIn: 'root'
})
export class HealthcarePdfFilesGenerationService {
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

  private async medicalPowerOfAttorney(): Promise<void> {
    try {
      const url = 'assets/pdf/MedicalPowerOfAttorney.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);

      var fields = [
        { 
          pdfField: 'NameTXT', 
          type: 'text', 
          value: `${this.client_data?.beneficiary?.firstName ?? ''} ${this.client_data?.beneficiary?.lastName ?? ''}`.trim()
        },
        { 
          pdfField: 'NomineeTxt', 
          type: 'text', 
          value: `${this.client_data?.beneficiary?.firstName ?? ''} ${this.client_data?.beneficiary?.lastName ?? ''}`.trim()
        },
        { 
          pdfField: 'NomineeAddress', 
          type: 'text', 
          value: this.client_data?.beneficiary?.address ?? ''
        },
        { 
          pdfField: 'NomineePhone', 
          type: 'text', 
          value: this.client_data?.beneficiary?.phoneNumber ?? ''
        },
        { 
          pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[0].TextField2[0]', 
          type: 'text', 
          value: this.client_data?.HealthcareSuccessorHealthcareAgents?.[0]
            ? `${this.client_data.HealthcareSuccessorHealthcareAgents[0].firstName ?? ''} ${this.client_data.HealthcareSuccessorHealthcareAgents[0].lastName ?? ''}`.trim()
            : ''
        },
        { 
          pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[0].TextField2[1]', 
          type: 'text', 
          value: this.client_data?.HealthcareSuccessorHealthcareAgents?.[0]?.address ?? ''
        },
        { 
          pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[0].TextField2[2]', 
          type: 'text', 
          value: this.client_data?.HealthcareSuccessorHealthcareAgents?.[0]?.phoneNumber ?? ''
        },
        { 
          pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[1].TextField2[3]', 
          type: 'text', 
          value: this.client_data?.HealthcareSuccessorHealthcareAgents?.[1]
            ? `${this.client_data.HealthcareSuccessorHealthcareAgents[1].firstName ?? ''} ${this.client_data.HealthcareSuccessorHealthcareAgents[1].lastName ?? ''}`.trim()
            : ''
        },
        { 
          pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[1].TextField2[4]', 
          type: 'text', 
          value: this.client_data?.HealthcareSuccessorHealthcareAgents?.[1]?.address ?? ''
        },
        { 
          pdfField: 'form_MPOA[0].page1[0].s1[0].p4[0].p1[0].#subform[1].TextField2[5]', 
          type: 'text', 
          value: this.client_data?.HealthcareSuccessorHealthcareAgents?.[1]?.phoneNumber ?? ''
        },
        { 
          pdfField: 'form_MPOA[0].page3[0].s6[0].p2[0].p4[0].TextField2[0]', 
          type: 'text', 
          value: `${this.client_data?.beneficiary?.firstName ?? ''} ${this.client_data?.beneficiary?.lastName ?? ''}`.trim()
        },
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

      var fields = [
        { 
          controlName: 'field2', 
          pdfField: 'Print your name', 
          label: 'Print Your Name', 
          tooltip: 'Enter your name', 
          type: 'text', 
          value: `${this.client_data?.beneficiary?.firstName ?? ''} ${this.client_data?.beneficiary?.lastName ?? ''}`.trim() 
        },
        { 
          controlName: 'field6', 
          pdfField: 'Name', 
          label: 'Patient Name', 
          tooltip: 'Enter patient name', 
          type: 'text', 
          value: `${this.client_data?.beneficiary?.firstName ?? ''} ${this.client_data?.beneficiary?.lastName ?? ''}`.trim() 
        },
        { 
          controlName: 'field21', 
          pdfField: 'Health_Information_Name', 
          label: 'Recipient Name', 
          tooltip: '', 
          type: 'text', 
          value: this.client_data?.HealthcareHipaaAuthorizationSuccessorRepresentatives?.[0]
            ? `${this.client_data.HealthcareHipaaAuthorizationSuccessorRepresentatives[0].firstName ?? ''} ${this.client_data.HealthcareHipaaAuthorizationSuccessorRepresentatives[0].lastName ?? ''}`.trim()
            : ''
        },
        { 
          controlName: 'field31', 
          pdfField: 'Information_share', 
          label: 'Information Share', 
          tooltip: '', 
          type: 'text', 
          value: this.client_data?.HealthcareHipaaAuthorizationSuccessorRepresentatives?.[0]
            ? `${this.client_data.HealthcareHipaaAuthorizationSuccessorRepresentatives[0].firstName ?? ''} ${this.client_data.HealthcareHipaaAuthorizationSuccessorRepresentatives[0].lastName ?? ''}`.trim()
            : ''
        },
        { 
          controlName: 'field34', 
          pdfField: 'Health_Information_Address', 
          label: 'Recipient Address', 
          tooltip: '', 
          type: 'text', 
          value: this.client_data?.HealthcareHipaaAuthorizationSuccessorRepresentatives?.[0]?.address ?? ''
        },
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

      var fields = [
        { 
          controlName: 'field1', 
          pdfField: 'Name', 
          label: 'Your Name & Address', 
          tooltip: 'insert your name and adress', 
          type: 'text', 
          value: `${this.client_data?.beneficiary?.firstName ?? ''} ${this.client_data?.beneficiary?.lastName ?? ''} ${this.client_data?.beneficiary?.address ?? ''}`.trim() 
        },  
        { 
          controlName: 'field2', 
          pdfField: 'Person_Appointed', 
          label: 'Your Agent Name & Address', 
          tooltip: 'insert the name and address of the person appointed', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSurrogateSelector?.[0]?.firstName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[0]?.lastName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[0]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field24', 
          pdfField: 'Agent_1', 
          label: 'SPECIAL INSTRUCTIONS 1', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSurrogateSelector?.[0]?.firstName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[0]?.lastName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[0]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field25', 
          pdfField: 'Agent_2', 
          label: 'SPECIAL INSTRUCTIONS 2', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSurrogateSelector?.[1]?.firstName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[1]?.lastName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[1]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field26', 
          pdfField: 'Agent_3', 
          label: 'SPECIAL INSTRUCTIONS 3', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSurrogateSelector?.[2]?.firstName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[2]?.lastName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[2]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field27', 
          pdfField: 'Agent_4', 
          label: 'SPECIAL INSTRUCTIONS 4', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSurrogateSelector?.[3]?.firstName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[3]?.lastName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[3]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field28', 
          pdfField: 'Agent_5', 
          label: 'SPECIAL INSTRUCTIONS 5', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSurrogateSelector?.[4]?.firstName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[4]?.lastName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[4]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field29', 
          pdfField: 'Agent_6', 
          label: 'SPECIAL INSTRUCTIONS 6', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSurrogateSelector?.[5]?.firstName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[5]?.lastName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[5]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field30', 
          pdfField: 'Agent_7', 
          label: 'SPECIAL INSTRUCTIONS 7', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSurrogateSelector?.[6]?.firstName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[6]?.lastName ?? ''} ${this.client_data?.HealthcareSurrogateSelector?.[6]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field31', 
          pdfField: 'successor_agent', 
          label: 'Successor(s) To That Agent Name', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.HealthcareSuccessorHealthcareAgents?.[0]?.firstName ?? ''} ${this.client_data?.HealthcareSuccessorHealthcareAgents?.[0]?.lastName ?? ''} ${this.client_data?.HealthcareSuccessorHealthcareAgents?.[0]?.address ?? ''}`.trim() 
        },
        { 
          controlName: 'field40', 
          pdfField: 'printed_name', 
          label: 'Printed Name', 
          tooltip: '', 
          type: 'text', 
          value: `${this.client_data?.beneficiary?.firstName ?? ''} ${this.client_data?.beneficiary?.lastName ?? ''}`.trim() 
        },
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
    await this.hipaa();
    await this.sdpoa();
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
