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
      const pdf_Bytes = await pdfDoc.save();
      const blob = new Blob([pdf_Bytes], { type: 'application/pdf' });
      const fileName = 'Medical power of attorney designation of health care agent.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
      this.files.push(file);
      console.log('Medical Power of Attorney PDF loaded successfully.');
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
