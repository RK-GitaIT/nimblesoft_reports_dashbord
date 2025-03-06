import { Component, OnInit } from '@angular/core';
import { LegalDocumentsService } from '../../services/leagl_documents/leagl-documents.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-myfiles',
  imports: [CommonModule],
  templateUrl: './myfiles.component.html',
  styleUrl: './myfiles.component.css'
})
export class MyfilesComponent implements OnInit {
  documents: any[] = []; // Store documents
  pageNumber: number = 1;
  pageSize: number = 15;
  totalPages: number = 1;
  sortColumn: string = 'UploadDate';
  ascending: boolean = false;

  constructor(private legalDocumentsService: LegalDocumentsService) {}

  ngOnInit(): void {
    this.getDocuments();
  }

  getDocuments(): void {
    this.legalDocumentsService.getLegalDocuments(this.pageNumber, this.pageSize, this.sortColumn, this.ascending)
      .subscribe({
        next: (response) => {
          console.log(response);
          this.documents = response?.items || [];
          this.totalPages = response?.pageCount || 1;
        },
        error: (error) => {
          console.error('Error fetching documents:', error);
        }
      });
  }

  downloadDocument(documentId: number, documentName: string): void {
    this.legalDocumentsService.downloadDocument(documentId)
      .subscribe({
        next: (blob) => {
          this.downloadPdf(blob, documentName);
        },
        error: (error) => {
          console.error('Error downloading document:', error);
        }
      });
  }

  downloadPdf(pdfBytes: any, name: string) {
    (async () => {
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Medical power of attorney designation of health care agent.pdf';
      a.click();
      URL.revokeObjectURL(url);
      console.log('PDF downloaded successfully.');
    })().catch(error => console.error('Error during PDF download:', error));
  }

  nextPage(): void {
    if (this.pageNumber < this.totalPages) {
      this.pageNumber++;
      this.getDocuments();
    }
  }

  prevPage(): void {
    if (this.pageNumber > 1) {
      this.pageNumber--;
      this.getDocuments();
    }
  }

  toggleSorting(column: string): void {
    if (this.sortColumn === column) {
      this.ascending = !this.ascending;
    } else {
      this.sortColumn = column;
      this.ascending = true;
    }
    this.getDocuments();
  }
}

