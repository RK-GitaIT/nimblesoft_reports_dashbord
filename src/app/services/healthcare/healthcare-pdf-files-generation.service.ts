import { Injectable } from '@angular/core';
import { PDFDocument } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class HealthcarePdfFilesGenerationService {

  client_data: any = null;
  //files: File
  constructor() {
   // this.loadPdf
   }

    private async medicalPowerOfAttorney(): Promise<void> {
      try {
        
        const url = 'assets/pdf/MedicalPowerOfAttorney.pdf';
        const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
        var pdfDoc = await PDFDocument.load(pdfBytes);

        const form = pdfDoc.getForm();
        const availableFields = form.getFields().map(field => field.getName());

       // console.log(availableFields);
        // var fields.forEach(fieldDef => {
        //   if("field35" == fieldDef.controlName){
        //     console.log("log");
        //   }
        //   //const value = fieldDef.controlName;
        //   const value = this.form.get(fieldDef.controlName)?.value;
        //   if (availableFields.includes(fieldDef.pdfField)) {
        //     try {
        //       switch (fieldDef.type) {
        //         case 'text':
        //           form.getTextField(fieldDef.pdfField).setText(value || '');
        //           break;
        //         case 'radio':
        //           form.getRadioGroup(fieldDef.pdfField).select(value);
        //           break;
        //         case 'checkbox':
        //           const checkbox = form.getCheckBox(fieldDef.pdfField);
        //           value ? checkbox.check() : checkbox.uncheck();
        //           break;
        //         default:
        //           form.getTextField(fieldDef.pdfField).setText(value || '');
        //       }
        //       console.log(`Filled "${fieldDef.pdfField}" with value "${value}"`);
        //     } catch (e) {
        //       console.warn(`Error setting value for field "${fieldDef.pdfField}":`, e);
        //     }
        //   } else {
        //     console.warn(`PDF field "${fieldDef.pdfField}" not found. Available fields: ${availableFields.join(', ')}`);
        //   }
        // });

        console.log('PDF loaded successfully.');
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }

    private async hipaa(): Promise<void> {
      try {
        
        const url = 'assets/pdf/HiPa.pdf';
        const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
        var pdfDoc = await PDFDocument.load(pdfBytes);

        console.log('PDF loaded successfully.');
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }

    private async sdpoa(): Promise<void> {
      try {
        
        const url = 'assets/pdf/SDPOA.pdf';
        const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
        var pdfDoc = await PDFDocument.load(pdfBytes);

        console.log('PDF loaded successfully.');
      } catch (error) {
        console.error('Error loading PDF:', error);
      }
    }

    async loadPdfs(client_data: any)
    {
      this.client_data =  client_data;
      await this.medicalPowerOfAttorney();
      await this.hipaa();
      await this.sdpoa();
    }

}
