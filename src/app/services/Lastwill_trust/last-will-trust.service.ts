import { Injectable } from '@angular/core';
import { LegalDocumentsService } from '../leagl_documents/leagl-documents.service';
import { ToastService } from '../toast.service';
import { Router } from '@angular/router';
import { PDFDocument } from 'pdf-lib';

@Injectable({
  providedIn: 'root'
})
export class LastWillTrustService {

  client_data: any = null;
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
        { pdfField: "as Settlors and Trustees", value: this.client_data?.trust?.settlorsAndTrustees || "John Doe, Jane Doe" },
        { pdfField: "Trust_name", value: this.client_data?.trust?.trustName || "Doe Family Trust" },
        { pdfField: "Tax_Identification", value: this.client_data?.trust?.taxIdentification || "111-22-3333" },
        { pdfField: "Settlors_Trust", value: this.client_data?.trust?.settlorsTrust || "John Doe Settlor Trust" },
        { pdfField: "Initail_Trustees", value: this.client_data?.trust?.initialTrustees || "Jane Doe" },
        { pdfField: "Acting_Trustee", value: this.client_data?.trust?.actingTrustee || "Robert Smith" },
        { pdfField: "Address_Trustee_1", value: this.client_data?.trust?.addressTrustee1 || "123 Main St" },
        { pdfField: "Address_Trustee_2", value: this.client_data?.trust?.addressTrustee2 || "456 Secondary St" },
        { pdfField: "Trust_Title", value: this.client_data?.trust?.trustTitle || "Family Trust" },
        { pdfField: "Title_Executed_date", value: this.client_data?.trust?.titleExecutedDate || "2023-01-01" },
        { pdfField: "Title_Executed_Month", value: this.client_data?.trust?.titleExecutedMonth || "January" },
        { pdfField: "Current_Trustees", value: this.client_data?.trust?.currentTrustees || "John Doe, Jane Doe" },
        { pdfField: "Asset_Trust_Name", value: this.client_data?.trust?.assetTrustName || "Doe Asset Trust" },
        { pdfField: "Asset_Trust_Title", value: this.client_data?.trust?.assetTrustTitle || "Asset Manager" },
        { pdfField: "Trust_Property", value: this.client_data?.trust?.trustProperty || "789 Trust Ave" },
        { pdfField: "Print_Signature_1", value: this.client_data?.trust?.printSignature1 || "John Doe" },
        { pdfField: "Print_Signature_2", value: this.client_data?.trust?.printSignature2 || "Jane Doe" },
        { pdfField: "Signature_1", value: this.client_data?.trust?.signature1 || "John Doe Signature" },
        { pdfField: "Signature_2", value: this.client_data?.trust?.signature2 || "Jane Doe Signature" },
        { pdfField: "COUNTY OF", value: this.client_data?.trust?.countyOf || "Some County" },
        { pdfField: "Acknowledged_Trust_Name", value: this.client_data?.trust?.acknowledgedTrustName || "Acknowledged Trust" },
        { pdfField: "Acknowledged_date", value: this.client_data?.trust?.acknowledgedDate || "2023-02-01" },
        { pdfField: "Acknowledged_day", value: this.client_data?.trust?.acknowledgedDay || "01" },
        { pdfField: "NOTARY_PUBLIC", value: this.client_data?.trust?.notaryPublic || "Notary Public" },
        { pdfField: "Commission_Expires", value: this.client_data?.trust?.commissionExpires || "2024-12-31" },
        { pdfField: "Agreement_day", value: this.client_data?.trust?.agreementDay || "15" },
        { pdfField: "Agreement_date", value: this.client_data?.trust?.agreementDate || "2023-03-01" },
        { pdfField: "Asset_day", value: this.client_data?.trust?.assetDay || "16" },
        { pdfField: "Asset_date", value: this.client_data?.trust?.assetDate || "2023-04-01" },
        { pdfField: "Witness_date", value: this.client_data?.trust?.witnessDate || "2023-05-01" },
        { pdfField: "Witness_day", value: this.client_data?.trust?.witnessDay || "05" },
        { pdfField: "State_Name", value: this.client_data?.trust?.stateName || "Example State" }
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
      const fileName = 'Trust.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('Trust PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading Trust PDF:', error);
    }
  }
  
  async load_PDFs(client_data: any): Promise<void> {
    this.client_data = client_data;
    this.files = [];
    await this.trust_document();
    await this.pdf_files_uploads();
  }

  private async pdf_files_uploads(): Promise<void> {

    this.fileupload.uploadDocuments(this.files, this.client_data?.beneficiary?.firstName + this.client_data?.beneficiary?.lastName + " Last Will & Testament ", "Last Will", 1)
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
