import { Component, ViewChild } from '@angular/core';
import { PDFFormInterface } from '../../../models/pdf/pdf-form.interface';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MpaFormComponent } from '../mpa-form/mpa-form.component';
import { HipaaFormComponent } from '../hippa-form/hippa-form.component';
import { DpoaFormComponent } from '../dpoa-form/dpoa-form.component';
import { ToastService } from '../../../services/toast.service';

@Component({
  selector: 'app-pdf-forms',
  standalone: true,
  imports: [CommonModule, FormsModule, MpaFormComponent, HipaaFormComponent, DpoaFormComponent],
  templateUrl: './pdf-forms.component.html',
  styleUrls: ['./pdf-forms.component.css'],
})
export class PdfFormsComponent {
  // Dynamically reference the loaded child component via the common interface.
  @ViewChild('childComponent') childComponent?: PDFFormInterface;

  selectedFormType: string = '';
  formData: any = null;
  isFormSubmitted: boolean = false;

  constructor(private toastService: ToastService) {}


  handleDownloadPdf(): void {
    if (this.childComponent) {
      this.childComponent.downloadPdf();
    } else {
      this.toastService.showToast('Error !', 'Please select the form', 'error');  
      console.error('No form loaded for download.');
    }
  }

  submitChildForm(): void {
    if (this.childComponent) {
      this.childComponent.submitForm();
    } else {
      console.error('No form loaded to submit.');
    }
  }

  handleCancel(): void {
    if (this.childComponent) {
      this.childComponent.resetForm();
      this.isFormSubmitted = false;
      console.log('Form cancelled/reset.');
    } else {
      console.error('No form loaded to cancel.');
    }
  }

  handleFormSubmit(data: any): void {
    this.formData = data;
    this.isFormSubmitted = true;
    console.log('Form submitted:', this.formData.mapping);

    // Prepare an ID. If not available in submitted data, use a default (e.g. 1).
    const id = data.id || 1;
    
  }

  handleResetTriggered(): void {
    console.log('Child component has reset the form.');
  }
}
