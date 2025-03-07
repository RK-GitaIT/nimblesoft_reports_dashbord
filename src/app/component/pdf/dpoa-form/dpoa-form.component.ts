import { Component, OnInit } from '@angular/core';
import { PDFFormInterface } from '../../../models/pdf/pdf-form.interface';
import { FormBuilder, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { PDFDocument } from 'pdf-lib';
import { CommonModule } from '@angular/common';
import { LegalDocumentsService } from '../../../services/leagl_documents/leagl-documents.service';

interface PDFField {
  controlName: string;
  pdfField: string;
  label: string;
  tooltip: string;
  type: 'text' | 'radio' | 'checkbox' | 'date';
  options?: { label: string, value: any }[];
}

@Component({
  selector: 'app-dpoa-form',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './dpoa-form.component.html',
  styleUrl: './dpoa-form.component.css'
})
export class DpoaFormComponent  implements PDFFormInterface, OnInit {
  form: FormGroup;
  pdfDoc: PDFDocument | null = null;

  fields: PDFField[] = [
    { controlName: 'field1', pdfField: 'Name', label: 'Your Name & Address' , tooltip: 'insert your name and adress', type: 'text' },  
    { controlName: 'field2', pdfField: 'Person_Appointed', label: 'Your Agent Name & Address', tooltip: 'insert the name and address of the person appointed', type: 'text' },
    { controlName: 'field3', pdfField: 'Real_transactions', label: 'Real property transactions', tooltip: 'Real property transactions', type: 'checkbox' },
    { controlName: 'field4', pdfField: 'Tangible_transactions', label: 'Tangible personal property transactions', tooltip: 'Tangible personal property transactions', type: 'checkbox' },
    { controlName: 'field5', pdfField: 'Stock_transactions', label: 'Stock and bond transactions', tooltip: '', type: 'checkbox' },
    { controlName: 'field6', pdfField: 'Commodity_transactions', label: 'Commodity and option transactions', tooltip: '', type: 'checkbox' },
    { controlName: 'field7', pdfField: 'Banking_transactions', label: 'Banking and other financial institution transactions', tooltip: '', type: 'checkbox' },
    { controlName: 'field8', pdfField: 'Bussiness_transactions', label: 'Business operating transactions;', tooltip: '', type: 'checkbox' },
    { controlName: 'field9', pdfField: 'Insurance_transactions', label: ' Insurance and annuity transactions', tooltip: '', type: 'checkbox' },
    { controlName: 'field10', pdfField: 'Estate_transactions', label: 'Estate, trust, and other beneficiary transactions', tooltip: '',type: 'checkbox' },
    { controlName: 'field11', pdfField: 'Claims_and_litigation', label: ' Claims and litigation', tooltip: '', type: 'checkbox' },
    { controlName: 'field12', pdfField: 'Personal_maintenance', label: ' Personal and family maintenance', tooltip: '', type: 'checkbox' },
    { controlName: 'field13', pdfField: 'Social_service', label: ' Benefits from social security, Medicare, Medicaid, or other governmental programs or civil or military service', tooltip: '', type: 'checkbox' },
    { controlName: 'field14', pdfField: 'Retirement_transactions', label: 'Retirement plan transactions', tooltip: '', type: 'checkbox' },
    { controlName: 'field15', pdfField: 'Tax_matters', label: 'Tax matters', tooltip: '', type: 'checkbox' },
    { controlName: 'field16', pdfField: 'Digital_communication', label: ' Digital assets and the content of an electronic communication', tooltip: '', type: 'checkbox' },
    { controlName: 'field17', pdfField: 'All_list', label: ' ALL OF THE POWERS LISTED IN (A) THROUGH (N).  YOU DO NOT HAVE TO INITIAL THE LINE IN FRONT OF ANY OTHER POWER IF YOU INITIAL LINE', tooltip: '', type: 'checkbox' },
    { controlName: 'field18', pdfField: 'Agent_reasonable', label: 'Each of my co-agents may act independently for me.', tooltip: '', type: 'checkbox' },
    { controlName: 'field19', pdfField: 'Agent_compensation', label: 'My agent is entitled to reimbursement of reasonable expenses incurred on my behalf but shall receive no compensation for serving as my agent. ', tooltip: '', type: 'checkbox' },
    { controlName: 'field20', pdfField: 'co-agents_act_independently', label: 'Each of my co-agents may act independently for me.', tooltip: '', type: 'checkbox' },
    { controlName: 'field21', pdfField: 'co-agents_act_jointly', label: 'My co-agents may act for me only if the co-agents act jointly. ', tooltip: '', type: 'checkbox' },
    { controlName: 'field22', pdfField: 'majority_co-agents_act_jointly', label: 'My co-agents may act for me only if a majority of the co-agents act jointly.', tooltip: '', type: 'checkbox' },  
    { controlName: 'field23', pdfField: 'agent_grant_make_gifts', label: 'I grant my agent the power to apply my property to make gifts outright to or for the benefit of a person', tooltip: '', type: 'checkbox' },
    { controlName: 'field24', pdfField: 'Agent_1', label: 'SPECIAL INSTRUCTIONS 1', tooltip: '', type: 'text' },
    { controlName: 'field25', pdfField: 'Agent_2', label: 'SPECIAL INSTRUCTIONS 2', tooltip: '', type: 'text' },
    { controlName: 'field26', pdfField: 'Agent_3', label: 'SPECIAL INSTRUCTIONS 3 ', tooltip: '', type: 'text' },
    { controlName: 'field27', pdfField: 'Agent_4', label: 'SPECIAL INSTRUCTIONS 4', tooltip: '', type: 'text' },
    { controlName: 'field28', pdfField: 'Agent_5', label: 'SPECIAL INSTRUCTIONS 5', tooltip: '', type: 'text' },
    { controlName: 'field29', pdfField: 'Agent_6', label: 'SPECIAL INSTRUCTIONS 6', tooltip: '', type: 'text' },
    { controlName: 'field30', pdfField: 'Agent_7', label: 'SPECIAL INSTRUCTIONS 7', tooltip: '', type: 'text' },
    { controlName: 'field31', pdfField: 'successor_agent', label: 'Successor(s) To That Agent Name', tooltip: '', type: 'text' },
    { controlName: 'field32', pdfField: 'signed_day', label: 'Successor(s) To That Agent Name', tooltip: '', type: 'text' },
    { controlName: 'field33', pdfField: 'signed_month', label: 'Electronic Copy', tooltip: '', type: 'text' },
    { controlName: 'field34', pdfField: 'signed_year', label: 'Electronic Copy', tooltip: '', type: 'text' },
    { controlName: 'field35', pdfField: 'signed_agent_name', label: 'Electronic Copy', tooltip: '', type: 'text' },
    { controlName: 'field36', pdfField: 'state_name', label: 'State', tooltip: '', type: 'text' },
    { controlName: 'field37', pdfField: 'country_name', label: 'Country', tooltip: '', type: 'text' },
    { controlName: 'field38', pdfField: 'acknowledged_date', label: 'Acknowledgement Date', tooltip: '', type: 'text' },
    { controlName: 'field39', pdfField: 'name_of_principal', label: 'Principal Name', tooltip: '', type: 'text' },    
    { controlName: 'field40', pdfField: 'printed_name', label: 'Printed Name', tooltip: '', type: 'text' },
    { controlName: 'field41', pdfField: 'My_commission_expires', label: 'Commission Expires', tooltip: '', type: 'text' },
     
  ];


  constructor(private fb: FormBuilder, private fileupload: LegalDocumentsService) {
    const formControls = this.fields.reduce((controls, field) => {
      // For checkboxes, you may want a boolean default.
      controls[field.controlName] = field.type === 'checkbox' ? [false] : [''];
      return controls;
    }, {} as { [key: string]: any });
    this.form = this.fb.group(formControls);
  }

  async ngOnInit(): Promise<void> {
    await this.loadPdf();
    this.logAvailablePdfFields();
  }

  async loadPdf(): Promise<void> {
    try {
      const url = 'assets/pdf/SDPOA.pdf';
      const pdfBytes = await fetch(url).then(res => res.arrayBuffer());
      this.pdfDoc = await PDFDocument.load(pdfBytes);
      console.log('PDF loaded successfully.');
    } catch (error) {
      console.error('Error loading PDF:', error);
    }
  }

  logAvailablePdfFields(): void {
    if (!this.pdfDoc) return;
    const availableFields = this.pdfDoc.getForm().getFields().map(field => field.getName());
    console.log('Available PDF Form Fields:', availableFields);
  }

  async updatePdfFields(): Promise<void> {
    if (!this.pdfDoc) return;
    const form = this.pdfDoc.getForm();
    const availableFields = form.getFields().map(field => field.getName());
    this.fields.forEach(fieldDef => {
      const value = this.form.get(fieldDef.controlName)?.value;
      if (availableFields.includes(fieldDef.pdfField)) {
        try {
          switch (fieldDef.type) {
            case 'text':
              form.getTextField(fieldDef.pdfField).setText(value || '');
              break;
            case 'radio':
              form.getRadioGroup(fieldDef.pdfField).select(value);
              break;
            case 'checkbox':
              const checkbox = form.getCheckBox(fieldDef.pdfField);
              value ? checkbox.check() : checkbox.uncheck();
              break;
            default:
              form.getTextField(fieldDef.pdfField).setText(value || '');
          }
        //  console.log(`Filled "${fieldDef.pdfField}" with value "${value}"`);
        } catch (e) {
          console.warn(`Error setting value for field "${fieldDef.pdfField}":`, e);
        }
      } else {
        console.warn(`PDF field "${fieldDef.pdfField}" not found. Available fields: ${availableFields.join(', ')}`);
      }
    });
  }

  async submitForm(): Promise<void> {
    if (!this.pdfDoc) return;
    await this.updatePdfFields();
    const pdfBytes = await this.pdfDoc.save();
    console.log('Form submitted. PDF bytes generated.');
    // Process pdfBytes as needed.
  }

  resetForm(): void {
    this.form.reset();
  }

  downloadPdf(): void {
    if (!this.pdfDoc) return;
    const pdfDoc = this.pdfDoc;
  
    (async () => {
      await this.updatePdfFields();
      const pdfBytes = await pdfDoc.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const fileName = 'Statutory durable power of attorney.pdf';
      const file = new File([blob], fileName, { type: 'application/pdf' });
  
      console.log("Uploading PDF to server...");
  
      // Updated call to uploadDocuments (which accepts an array of files)
      this.fileupload.uploadDocuments([file], fileName, "HIPPA", 1).subscribe({
        next: (response) => {
          console.log("✅ File uploaded successfully!", response);
  
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = file.name;
          a.click();
          URL.revokeObjectURL(url);
          console.log('📥 PDF downloaded successfully.');
        },
        error: (error) => {
          console.error("❌ File upload failed:", error);
        }
      });
    })().catch(error => console.error('❌ Error during PDF processing:', error));
  }
  

  updateAllSelectionALLoFThePowerListedIn() {
    const isChecked = this.form.get('field17')?.value;
  
    if (isChecked !== undefined) {
      const updates: { [key: string]: boolean } = {};
  
      for (let i = 3; i <= 16; i++) {
        updates[`field${i}`] = isChecked;
      }
  
      this.form.patchValue(updates, { emitEvent: false });
    }
  }
  

}
