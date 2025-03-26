import { Injectable } from '@angular/core';
import { LegalDocumentsService } from '../leagl_documents/leagl-documents.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';
import { PDFDocument } from 'pdf-lib';
import { ClientData } from '../../models/interfaces/ClientData';

@Injectable({
  providedIn: 'root'
})
export class LastWillLivingTrustService {
  client_data: ClientData | null = null;
  files: File[] = [];

  constructor(
    private fileupload: LegalDocumentsService,
    private toastService: ToastService ,
    private router: Router
  ) { }

  private async trust_document(): Promise<void> {
    try {
      const url = 'assets/pdf/Trust.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      const fields = [
        { pdfField: "as Settlors and Trustees", value: this.client_data?.trust?.settlorsAndTrustees },
        { pdfField: "Trust_name", value: this.client_data?.trust?.trustName  },
        { pdfField: "Tax_Identification", value: this.client_data?.trust?.taxIdentification },
        { pdfField: "Settlors_Trust", value: this.client_data?.trust?.settlorsTrust },
        { pdfField: "Initail_Trustees", value: this.client_data?.trust?.initialTrustees },
        { pdfField: "Acting_Trustee", value: this.client_data?.trust?.actingTrustee },
        { pdfField: "Address_Trustee_1", value: this.client_data?.trust?.addressTrustee1 },
        { pdfField: "Address_Trustee_2", value: this.client_data?.trust?.addressTrustee2  },
        { pdfField: "Trust_Title", value: this.client_data?.trust?.trustTitle  },
        { pdfField: "Title_Executed_date", value: this.client_data?.trust?.titleExecutedDate },
        { pdfField: "Title_Executed_Month", value: this.client_data?.trust?.titleExecutedMonth },
        { pdfField: "Current_Trustees", value: this.client_data?.trust?.currentTrustees },
        { pdfField: "Asset_Trust_Name", value: this.client_data?.trust?.assetTrustName },
        { pdfField: "Asset_Trust_Title", value: this.client_data?.trust?.assetTrustTitle },
        { pdfField: "Trust_Property", value: this.client_data?.trust?.trustProperty },
        { pdfField: "Print_Signature_1", value: this.client_data?.trust?.printSignature1 },
        { pdfField: "Print_Signature_2", value: this.client_data?.trust?.printSignature2 },
        { pdfField: "Signature_1", value: this.client_data?.trust?.signature1 },
        { pdfField: "Signature_2", value: this.client_data?.trust?.signature2 },
        { pdfField: "COUNTY OF", value: this.client_data?.trust?.countyOf },
        { pdfField: "Acknowledged_Trust_Name", value: this.client_data?.trust?.acknowledgedTrustName },
        { pdfField: "Acknowledged_date", value: this.client_data?.trust?.acknowledgedDate },
        { pdfField: "Acknowledged_day", value: this.client_data?.trust?.acknowledgedDay },
        { pdfField: "NOTARY_PUBLIC", value: this.client_data?.trust?.notaryPublic },
        { pdfField: "Commission_Expires", value: this.client_data?.trust?.commissionExpires  },
        { pdfField: "Agreement_day", value: this.client_data?.trust?.agreementDay  },
        { pdfField: "Agreement_date", value: this.client_data?.trust?.agreementDate },
        { pdfField: "Asset_day", value: this.client_data?.trust?.assetDay  },
        { pdfField: "Asset_date", value: this.client_data?.trust?.assetDate  },
        { pdfField: "Witness_date", value: this.client_data?.trust?.witnessDate },
        { pdfField: "Witness_day", value: this.client_data?.trust?.witnessDay  },
        { pdfField: "State_Name", value: this.client_data?.trust?.stateName }
      ];
  
      const form = pdfDoc.getForm();
      const availableFields = form.getFields().map(field => field.getName());
      //console.log("Available fields:", availableFields);
      fields.forEach(fieldDef => {
        const { pdfField, value } = fieldDef;
        if (availableFields.includes(pdfField)) {
          try {
              form.getTextField(pdfField).setText(value);
              console.log(`Filled "${pdfField}" with value "${value}"`);
          } catch (e) {
            console.warn(`Error setting value for field "${pdfField}":`, e);
          }
        } else {
          console.warn(`PDF field "${pdfField}" not found. Available fields: ${availableFields.join(', ')}`);
        }
      });
  
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'Certificate of Trust.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('Trust PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading Trust PDF:', error);
    }
  }

  private async revocable_living_trust(): Promise<void> {
    try {
      const url = 'assets/pdf/Revocable_Living_Trust_Agreement.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
      console.log(this.client_data);
  
      const fields = [
        { pdfField: "Trust_Title", value: this.client_data?.revocable_living_trust?.Trust_Title },
        { pdfField: "Trustee_1", value: this.client_data?.revocable_living_trust?.Trustee_1 },
        { pdfField: "Trustee_2", value: this.client_data?.revocable_living_trust?.Trustee_2 },
        { pdfField: "Co-Trustee_1", value: this.client_data?.revocable_living_trust?.Co_Trustee_1 },
        { pdfField: "Co-Trustee_2", value: this.client_data?.revocable_living_trust?.Co_Trustee_2 },
        { pdfField: "Child_1", value: this.client_data?.revocable_living_trust?.Child_1 },
        { pdfField: "Child_2", value: this.client_data?.revocable_living_trust?.Child_2 },
        { pdfField: "Beneficiaries_1", value: this.client_data?.revocable_living_trust?.Beneficiaries_1 },
        { pdfField: "Trustee_name_1", value: this.client_data?.revocable_living_trust?.Trustee_name_1 },
        { pdfField: "Trustee_name_2", value: this.client_data?.revocable_living_trust?.Trustee_name_2 },
        { pdfField: "Trustee_name_3", value: this.client_data?.revocable_living_trust?.Trustee_name_3 },
        { pdfField: "Trustee_name_4", value: this.client_data?.revocable_living_trust?.Trustee_name_4 },
        { pdfField: "Trustee_name_5", value: this.client_data?.revocable_living_trust?.Trustee_name_5 },
        { pdfField: "Trustee_name_6", value: this.client_data?.revocable_living_trust?.Trustee_name_6 },
        { pdfField: "Settlor_print_name_1", value: this.client_data?.revocable_living_trust?.Settlor_print_name_1 },
        { pdfField: "Settlor_print_name_2", value: this.client_data?.revocable_living_trust?.Settlor_print_name_2 },
        { pdfField: "Trustee_print_name_1", value: this.client_data?.revocable_living_trust?.Trustee_print_name_1 },
        { pdfField: "Trustee_print_name_2", value: this.client_data?.revocable_living_trust?.Trustee_print_name_2 },
        { pdfField: "Settlors_name", value: this.client_data?.revocable_living_trust?.Trustee_name_6 },
        { pdfField: "Co-Trustees_name", value: this.client_data?.revocable_living_trust?.Co_Trustees_name },
      ];
  
      const form = pdfDoc.getForm();
      const availableFields = form.getFields().map(field => field.getName());
      //console.log("Available fields:", availableFields);
      fields.forEach(fieldDef => {
        const { pdfField, value } = fieldDef;
        if (availableFields.includes(pdfField)) {
          try {
            form.getTextField(pdfField).setText(value);
            console.log(`Filled "${pdfField}" with value "${value}"`);
          } catch (e) {
            console.warn(`Error setting value for field "${pdfField}":`, e);
          }
        } else {
          console.warn(`PDF field "${pdfField}" not found. Available fields: ${availableFields.join(', ')}`);
        }
      });
  
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'Revocable Living Trust Agreement.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('Trust PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading Trust PDF:', error);
    }
  }

  private async revocable_living_trust_execution_instructions(): Promise<void> {
    try {
      const url = 'assets/pdf/Revocable_Living_Trust_Execution_Instructions.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      const fields = [
        { pdfField: "Trustee_name_1", value: this.client_data?.revocable_living_trust_execution_instructions?.Trustee_name_1 },
        { pdfField: "Trustee_name_2", value: this.client_data?.revocable_living_trust_execution_instructions?.Trustee_name_2 },
        { pdfField: "Co-Trustee_name_1", value: this.client_data?.revocable_living_trust_execution_instructions?.Co_Trustee_name_1 },
        { pdfField: "Co-Trustee_name_2", value: this.client_data?.revocable_living_trust_execution_instructions?.Co_Trustee_name_2 },

      ];
  
      const form = pdfDoc.getForm();
      const availableFields = form.getFields().map(field => field.getName());
      //console.log("Available fields:", availableFields);
      fields.forEach(fieldDef => {
        const { pdfField, value } = fieldDef;
        if (availableFields.includes(pdfField)) {
          try {
            form.getTextField(pdfField).setText(value);
            console.log(`Filled "${pdfField}" with value "${value}"`);
          } catch (e) {
            console.warn(`Error setting value for field "${pdfField}":`, e);
          }
        } else {
          console.warn(`PDF field "${pdfField}" not found. Available fields: ${availableFields.join(', ')}`);
        }
      });
  
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'Revocable Living Trust Execution Instructions.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('Trust PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading Trust PDF:', error);
    }
  }

  private async revocable_living_trust_funding_instructions(): Promise<void> {
    try {
      const url = 'assets/pdf/Revocable_Living_Trust_Funding_Instructions.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      const fields = [
        { pdfField: "Trust_Name_1", value: this.client_data?.revocable_living_trust_funding_instructions?.Trust_Name_1 },
        { pdfField: "Trust_Name_2", value: this.client_data?.revocable_living_trust_funding_instructions?.Trust_Name_2 },
        { pdfField: "Bank_account_name_1", value: this.client_data?.revocable_living_trust_funding_instructions?.Bank_account_name_1 },
        { pdfField: "Bank_account_Trust_Title", value: this.client_data?.revocable_living_trust_funding_instructions?.Bank_account_Trust_Title },
        { pdfField: "Brokerage_account_name_1", value: this.client_data?.revocable_living_trust_funding_instructions?.Brokerage_account_name_1 },
        { pdfField: "Brokerage_account_name_2", value: this.client_data?.revocable_living_trust_funding_instructions?.Brokerage_account_name_2 },
        { pdfField: "Brokerage_account_trust_title", value: this.client_data?.revocable_living_trust_funding_instructions?.Brokerage_account_trust_title },
        { pdfField: "Insurance_name_1", value: this.client_data?.revocable_living_trust_funding_instructions?.Insurance_name_1 },
        { pdfField: "Insurance_name_2", value: this.client_data?.revocable_living_trust_funding_instructions?.Insurance_name_2 },
        { pdfField: "Insurance_Title", value: this.client_data?.revocable_living_trust_funding_instructions?.Insurance_Title },
        { pdfField: "Plan_name_1", value: this.client_data?.revocable_living_trust_funding_instructions?.Plan_name_1 },
        { pdfField: "Plan_name_2", value: this.client_data?.revocable_living_trust_funding_instructions?.Plan_name_2 },
        { pdfField: "Plan_Title", value: this.client_data?.revocable_living_trust_funding_instructions?.Plan_Title },
        { pdfField: "Trust_Title", value: this.client_data?.revocable_living_trust_funding_instructions?.Trust_Title },
      ];
  
      const form = pdfDoc.getForm();
      const availableFields = form.getFields().map(field => field.getName());
      //console.log("Available fields:", availableFields);
      fields.forEach(fieldDef => {
        const { pdfField, value } = fieldDef;
        if (availableFields.includes(pdfField)) {
          try {
            form.getTextField(pdfField).setText(value);
            console.log(`Filled "${pdfField}" with value "${value}"`);
          } catch (e) {
            console.warn(`Error setting value for field "${pdfField}":`, e);
          }
        } else {
          console.warn(`PDF field "${pdfField}" not found. Available fields: ${availableFields.join(', ')}`);
        }
      });
  
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'Revocable Living Trust Funding Instructions.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('Trust PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading Trust PDF:', error);
    }
  }

  private async last_Will_Testament_Execution_Instructions(): Promise<void> {
    try {
      const url = 'assets/pdf/Last_Will_Testament_Execution_Instructions.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName =   'Last Will & Testament Execution Instructions.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('Trust PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading Trust PDF:', error);
    }
  }
  
  private async Last_will_testament(): Promise<void> {
    try {
      const url = 'assets/pdf/Last_will_testament.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      const pdfDoc = await PDFDocument.load(pdfBytes);
  
      const fields = [
        { pdfField: "Testment_title", value: this.client_data?.last_will?.name },
        { pdfField: "Person_name", value: this.client_data?.last_will?.name  },
        { pdfField: "Reference_name", value: this.client_data?.last_will?.Spouse_name  },
        { pdfField: "Spouse_name", value: this.client_data?.last_will?.Spouse_name  },
        { pdfField: "child_name_1", value: this.client_data?.last_will?.child_name_1 },
        { pdfField: "child_name_2", value: this.client_data?.last_will?.child_name_2 },
        { pdfField: "Footer_Account_person_name", value:  this.client_data?.last_will?.name },
        { pdfField: "nomini_name", value: this.client_data?.last_will?.Spouse_name },
        { pdfField: "Print_name_1", value:  this.client_data?.last_will?.name },
        { pdfField: "Authority_print_name",  value:  this.client_data?.last_will?.name },
        { pdfField: "Notery_Person_name", value:  this.client_data?.last_will?.name },
      ];
  
      const form = pdfDoc.getForm();
      const availableFields = form.getFields().map(field => field.getName());
      console.log("Available fields:", availableFields);
      fields.forEach(fieldDef => {
        const { pdfField, value } = fieldDef;
        if (availableFields.includes(pdfField)) {
          try {
            form.getTextField(pdfField).setText(value);
            console.log(`Filled "${pdfField}" with value "${value}"`);
          } catch (e) {
            console.warn(`Error setting value for field "${pdfField}":`, e);
          }
        } else {
          console.warn(`PDF field "${pdfField}" not found. Available fields: ${availableFields.join(', ')}`);
        }
      });
  
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName =   'Last_will & Testament.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('Trust PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading Trust PDF:', error);
    }
  }

  async load_PDFs(client_data: ClientData | null): Promise<void> {
    if(client_data === null)
    {
      return;
    }
    this.client_data = client_data;
    this.files = [];
    await this.last_Will_Testament_Execution_Instructions();
    await this.Last_will_testament();
    await this.revocable_living_trust();
    await this.trust_document();
    await this.revocable_living_trust_execution_instructions();
    await this.revocable_living_trust_funding_instructions();
    await this.pdf_files_uploads();
  }

  private async pdf_files_uploads(): Promise<void> {
    const beneficiaryName =
      (this.client_data?.beneficiary?.firstName ?? '') +
      (this.client_data?.beneficiary?.lastName ?? '') +
      " ";
  
    this.fileupload.uploadDocuments(this.files, beneficiaryName, "Last Will", 1)
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
