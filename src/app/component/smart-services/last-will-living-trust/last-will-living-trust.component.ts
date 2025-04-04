import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrepareforComponent } from '../utilities/preparefor/preparefor.component';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model';
import { myProfileService } from '../../../services/json/my-profile.service';
import { ITrustOptions } from '../../../models/interfaces/utilities/ITrustOptions';
import { IPrepareFor } from '../../../models/interfaces/utilities/ipreparefor';
import { TrustOptionComponent } from './trust-option/trust-option.component';
import { IRepresentatives } from '../../../models/interfaces/utilities/IRepresentatives';
import { IPersonalRepresentatives } from '../../../models/interfaces/utilities/IPersonalRepresentatives';
import { PersonalRepresentativesComponent } from './representatives/personal-representatives/personal-representatives.component';
import { SuccessorRepresentativesComponent } from './representatives/successor-representatives/successor-representatives.component';
import { TrusteesOfJointRevocableComponent } from './representatives/trustees-of-joint-revocable/trustees-of-joint-revocable.component';
import { IPetForm } from '../../../models/interfaces/utilities/IPetForm';
import { PetCareComponent } from '../utilities/pet-care/pet-care.component';
import { IPersonalResidence, IPersonalWithOtherResidence } from '../../../models/interfaces/utilities/IPersonalResidence';
import { PersonalResidenceComponent } from './personal-residence/personal-residence.component';
import { ResiduaryEstateComponent } from "./residuary-estate/residuary-estate.component";
import { UltimateDispositionComponent } from './ultimate-disposition/ultimate-disposition.component';
import { IUltimateDisposition } from '../../../models/interfaces/utilities/IUltimateDisposition';
import { PropertyComponent } from './property/property.component';
import { IProperty } from '../../../models/interfaces/utilities/IProperty';
import { Router } from '@angular/router';
import { OtherRealEstateComponent } from './other-real-estate/other-real-estate.component';
import { ClientData } from '../../../models/interfaces/ClientData';
import { RevocableLivingTrust } from '../../../models/interfaces/RevocableLivingTrust';
import { LastWillLivingTrustService } from '../../../services/last_will_living_trust/last-will-living-trust.service';
import { generateLivingTrustPDF } from '../../../services/pdf_generator/Living_Trust_Funding_Instructions';
import { generateCertificateOfTrustPDF } from '../../../services/pdf_generator/Certificate_of_trust';
import { generateLastWillAndTestament } from '../../../services/pdf_generator/Last_will_testament';



export interface DocumentPrepareFor {
  beneficiary: Beneficiary;
  selected_personalReps?: Beneficiary[];
  SuccessorExecutors: Beneficiary[];
  PropertyGuardianshipRepresentatives: Beneficiary[];
  PersonalResidence?: IPersonalWithOtherResidence,
  petFormData?: IPetForm,
  last_will: {
    successorType: string;
    bequests: boolean;
    dispositionOfResiduaryEstate: string;
    ultimateDispositionOfProperty: string;
    excludeChildrenShares: boolean;
    excludedChildren?: Beneficiary[];
    ultimateDispositionType?: any;
    child_name_1?: string;
    child_name_2?: string;
    Spouse_name?: string;
    name?: string;
  };
  data?:{
    PrepareForClient?:Beneficiary;
    trustData?:ITrustOptions;
    personalData?:IPersonalRepresentatives;
    successorData?:IPersonalRepresentatives;
    trustRepresentData?:IPersonalRepresentatives;
    petData?:IPetForm;
    personalResidence?:IPersonalWithOtherResidence;
    otherRealEstate?:IPersonalResidence;
    residenceEstate?:any;
    ultimateDisposition?:IUltimateDisposition;

  }
}

@Component({
  selector: 'app-last-will-living-trust',
  standalone: true,
  imports: [CommonModule,
    FormsModule,
    PrepareforComponent,
    TrustOptionComponent,
    PersonalRepresentativesComponent,
    SuccessorRepresentativesComponent,
    TrusteesOfJointRevocableComponent,
    PetCareComponent,
    PersonalResidenceComponent,
    OtherRealEstateComponent,
    ResiduaryEstateComponent,
    UltimateDispositionComponent,
    PropertyComponent
  ], 
  templateUrl: './last-will-living-trust.component.html',
  styleUrls: ['./last-will-living-trust.component.css']
})
export class LastWillLivingTrustComponent implements OnInit {
  private readonly validSteps = [ "initial",
    'residence-estate', 
    "trust_option", 
    "personal-representatives", 
    "successor-representatives", 
    "trustee-representatives", 
    "pet-care", 
    "personal-residence",
    "other-residence",
    "ultimate-disposition",
    "property",
    "finish"
  ] as const;

  user: Beneficiary | null = null;
  DocumentPrepareFor: DocumentPrepareFor | null = null;
  currentStep: 'initial' |'property' | 'trust_option' | 'personal-representatives' | 'successor-representatives' | 'trustee-representatives' | 'pet-care' | 'personal-residence' | 'other-residence'| 'residence-estate'| 'ultimate-disposition' | 'finish' | 'initial' = 'initial';
  beneficiaries: Beneficiary[] = [];
  total_members: Beneficiary[] = [];
  actual_data_members: Beneficiary[] = [];
  Prepare_for_client: Beneficiary[] = [];
  prepareForData!: IPrepareFor;
  defaultSelected: Beneficiary | undefined = undefined;
  trustOptionData!: ITrustOptions;
  representativeData!: IRepresentatives;
  personalReps!: IPersonalRepresentatives;
  successorReps!: IPersonalRepresentatives;
  trusteesReps!: IPersonalRepresentatives;
  petFormData!: IPetForm;
  personalResidenceFormData!: IPersonalResidence;
  other_real_estateFormData!: IPersonalWithOtherResidence;
  residuaryEstate_Data!: IPersonalRepresentatives;
  ultimate_disposition!: IUltimateDisposition;
  isSpouse!: boolean;
  property!: IProperty;
  ClientData!: ClientData;
  loading: boolean = false;
  constructor(private profileService: myProfileService, private router: Router, private lastwill_generate: LastWillLivingTrustService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  //#region Initial component

  loadUsers(): void {
    this.profileService.getProfile().subscribe({
      next: (res) => {
        let indexCounter = 0;
        if (res) {
          this.user = {
            index: indexCounter++,
            firstName: res.firstName ?? '',
            lastName: res.lastName ?? '',
            dateOfBirth: res.dateOfBirth ?? '',
            gender: (res.gender as 'Male' | 'Female' | 'Other') ?? 'Other',
            relationship: 'self',
            phoneNumber: res.phoneNumber ?? '',
            email: res.email ?? '',
            address: res.address ?? '',
            city: res.city ?? '',
            state: res.state ?? '',
            zipCode: res.zipCode ?? '',
            creationDate: res.creationDate ?? '',
            relationshipCategory: 'self',
          };
        }

        this.beneficiaries = Array.isArray(res?.beneficiaries)
          ? res.beneficiaries.map((ben: Beneficiary, i: number) => ({ ...ben, index: indexCounter++ }))
          : [];

        this.total_members = [...this.beneficiaries];
        if (this.user) {
          this.total_members.unshift(this.user);
        }

        // Filter for beneficiaries with 'self' or 'spouse' relationshipCategory
        this.Prepare_for_client = this.total_members.filter((a) =>
          a.relationshipCategory &&
          (a.relationshipCategory.includes('self') || a.relationshipCategory.includes('spouse'))
        );

        this.actual_data_members = this.total_members.filter(
          (member) => !this.DocumentPrepareFor || member.index !== this.DocumentPrepareFor.beneficiary.index
        );

        console.log(this.Prepare_for_client, 'Prepare_for_client Data');
        console.log(this.DocumentPrepareFor, 'Default Selected User');
        console.log(this.total_members, 'Total Members List');

        if (this.Prepare_for_client && this.Prepare_for_client.length > 0) {
          this.defaultSelected = this.Prepare_for_client[0];
          this.selectUser(this.defaultSelected);
        }

        this.prepareForData = {
          title: 'Last Will + Living Trust',
          description: `When you die, your Will must be filed with a court. This starts a lengthy process. Until the process is done your designated heirs have no access to the assets you left them.

The property included in your Living Trust during your life will generally pass to the assigned person immediately. Also, this part is kept confidential and not part of the public record.

Finally, you can protect your children’s inheritance by keeping it in trust until the age or ages that you select.`,
          beneficiary: this.Prepare_for_client,
          bottomTitle: 'Last Will & Testament —',
          bottomDescription: 'accompanies the Living Trust document with pour-over directives.',
          filesTitle: 'Revocable Living Trust — ',
          filesNames: [
            'Last Will & Testament',
            'Last Will & Testament Execution Instructions',
            'Revocable Living Trust',
            'Certificate of Trust',
            'Revocable Living Trust Execution Instructions',
            'Revocable Living Trust Funding Instructions'
          ]
        };

        this.trust_data_update();
      },
      error: (error) => {
        console.error('Error fetching data:', error);
      }
    });
  }

  selectUser(data: Beneficiary): void {
    if (!this.DocumentPrepareFor) {
      this.DocumentPrepareFor = {
        beneficiary: data,
        selected_personalReps: [],
        SuccessorExecutors: [],
        PropertyGuardianshipRepresentatives: [],
        last_will: {
          successorType: '',
          bequests: false,
          dispositionOfResiduaryEstate: '',
          ultimateDispositionOfProperty: '',
          excludeChildrenShares: false
        }
      };
    } else {
      this.DocumentPrepareFor.beneficiary = data;
    }

    const spouseData = this.total_members.filter(
      member => member.index !== this.DocumentPrepareFor!.beneficiary.index &&
                (member.relationshipCategory.includes('spouse') ||  member.relationshipCategory.includes('self'))
    );
    this.DocumentPrepareFor.last_will.Spouse_name = spouseData.length > 0 
      ? `${spouseData[0].firstName} ${spouseData[0].lastName}` 
      : '';
    console.log(this.DocumentPrepareFor);
    this.trust_data_update();
    console.log('Selected Beneficiary:', data);
  }


  //#endregion

  handleEdit(): void {
    if(this.DocumentPrepareFor?.beneficiary.relationshipCategory === 'self'){
      this.currentStep = 'trust_option';
      this.isSpouse = false;
    }else{
      this.currentStep = 'personal-representatives';
      this.isSpouse = true;
      this.personal_representative_data_update();
    }
    console.log('Edit clicked from child component');
  }
  
  handleAssemble(): void {
    this.generateDocuments();
  }

  setStep(value: string): void {
    if (this.validSteps.includes(value as any)) {
      this.currentStep = value as typeof this.validSteps[number];
    } else {
      console.warn("Invalid step value received:", value);
    }
  }

  handleBackClicked(value: string): void {
    console.log(value);
    this.setStep(value);
  }
  
  handleNextClicked(value: string): void {
    this.setStep(value);
    if(value == 'pet-care' && this.isSpouse){
      this.pet_care_update();
    }

    if(value == 'finish'){
      this.generateDocuments();
    }
  }

  //#region  Trust option Decision
  
  trust_data_update(): void {
    this.trustOptionData = {
      user: this.DocumentPrepareFor?.beneficiary,
      title: 'Last Will + Living Trust',
      title2: 'Decision',
      sub_title: 'Joint Revocable Trust Option',
      sub_title_description: 
        `Estate Planning offers married clients two choices when creating a Revocable Living Trust, a joint trust or separate individual trusts. Please keep in mind that the Estate Planning Trusts, whether joint or individual, are created for the purpose of probate avoidance only. The Estate Planning Trusts do not include estate or income tax planning or asset protection planning. If you have questions or concerns with regard to tax or asset protection planning, please contact customer service or an attorney of your choice.

If you choose to create a joint Revocable Trust, you will be able to create two Wills, one for each spouse, and one joint Revocable Trust. The first spouse to complete documents will create the joint Trust (along with his or her Will), then the other spouse will create his or her Will separately. Collectively, these documents allow you to name the Personal Representative of your estate, the Guardian of your minor children, and direct how you want your assets or property distributed.

`,
      revocable_radio_description:`Do you want to create a Joint Revocable Trust with ` + ((this.DocumentPrepareFor != null) ? this.DocumentPrepareFor.last_will.Spouse_name : "") + `?`,
      revocable_radio_value:true,
      input_label: 'Trust Name',
      back: 'initial',
      next: 'personal-representatives'
    };
  }

  handleTrustDataEmit(data: ITrustOptions): void {
    console.log('Trust data emitted:', data);
    this.trustOptionData = data;
    // Ensure 'data' exists before assigning 'trustData'
    if (!this.DocumentPrepareFor) {
      console.error('DocumentPrepareFor is null, cannot update trustData');
      return;
    }
    // Ensure 'data' exists before assigning 'trustData'
    this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
    this.DocumentPrepareFor.data.trustData = data;
    this.personal_representative_data_update();
  }

  //#endregion

  //#region personal Representatives component

  personal_representative_data_update(): void {
    this.personalReps = {
      members: this.actual_data_members,
      sleeted_members: (this.DocumentPrepareFor != null ? this.DocumentPrepareFor.selected_personalReps : []),
      back: this.isSpouse ? 'initial' : 'trust_option',
      next: 'successor-representatives'
    };
  }

  Personal_handleMembersDataEmit(data: IPersonalRepresentatives): void {
    console.log('Members data emitted:', data);
    if (!this.DocumentPrepareFor) {
      console.error('DocumentPrepareFor is null, cannot update trustData');
      return;
    }
    // Ensure 'data' exists before assigning 'trustData'
    this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
    this.DocumentPrepareFor.data.personalData = data;
    this.personalReps = data;
    this.successor_representative_data_update();
  }

  //#endregion
   /** Filter out the main beneficiary from the successor options */
  
  
  //#region successor Representatives component

  successor_representative_data_update(): void {
    const personalRepsArray = Array.isArray(this.personalReps.sleeted_members) ? this.personalReps.sleeted_members : [];
  
    this.successorReps = {
      members: this.actual_data_members.filter(
        item => !personalRepsArray.some(rep => rep.firstName === item.firstName)
      ),
      sleeted_members: this.DocumentPrepareFor ? this.DocumentPrepareFor.selected_personalReps : [],
      back: 'personal-representatives',
      next: this.isSpouse ? 'pet-care' : 'trustee-representatives'
    };
  }
  
  
  
  successor_handleMembersDataEmit(data: IPersonalRepresentatives): void {
      console.log('Members data emitted:', data);
      if (!this.DocumentPrepareFor) {
        console.error('DocumentPrepareFor is null, cannot update trustData');
        return;
      }
      // Ensure 'data' exists before assigning 'trustData'
      this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
      this.DocumentPrepareFor.data.successorData = data;
      // Update your parent component state as needed.
      this.successorReps = data;
    this.trustee_representative_data_update();
  }
  
    //#endregion
    
  //#region trustee Representatives component

  trustee_representative_data_update(): void {
    this.trusteesReps = {
      members: this.actual_data_members,
      sleeted_members: (this.DocumentPrepareFor != null ? this.DocumentPrepareFor.selected_personalReps : []),
      back: 'successor-representatives',
      next: 'pet-care'
    };
  }

  trustee_handleMembersDataEmit(data: IPersonalRepresentatives): void {
    console.log('Members data emitted:', data);
    if (!this.DocumentPrepareFor) {
      console.error('DocumentPrepareFor is null, cannot update trustData');
      return;
    }
    // Ensure 'data' exists before assigning 'trustData'
    this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
    this.DocumentPrepareFor.data.trustRepresentData = data;
    this.trusteesReps = data;
    this.pet_care_update();
  }

  //#endregion
  
  //#region pet-form

  pet_care_update(): void {
    this.petFormData = {
      hasPets: false,
      createTrust: false,
      leaveMoney: false,
      assetType: '',
      incomeAsset: 0,
      assetDescription: '',
      back:  this.isSpouse ? 'successor-representatives' : 'trustee-representatives',
      next: this.isSpouse ? 'property' : 'personal-residence'
    };
  }
  onPetData(data: IPetForm): void {
    console.log('Received pet data:', data);
    if (!this.DocumentPrepareFor) {
      console.error('DocumentPrepareFor is null, cannot update trustData');
      return;
    }
    // Ensure 'data' exists before assigning 'trustData'
    this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
    this.DocumentPrepareFor.data.petData = data;
    if(this.DocumentPrepareFor!= null){
      this.DocumentPrepareFor.petFormData = data;
    }
    if(this.isSpouse){
      this.property_data_update();
    }else{
      this.personalResidence_update();
    }
  }
  //#endregion

  //#region Personal Residence

  personalResidence_update(): void {
    this.personalResidenceFormData = {
      Beneficiary: this.Prepare_for_client,
      next: "other-residence",
      back: "pet-care",
      PersonalResidenceDevise: false, 
    };
  }
  
  onPersonalResidenceData(data: IPersonalWithOtherResidence): void {
    console.log('Received pet data:', data);
    if (!this.DocumentPrepareFor) {
      console.error('DocumentPrepareFor is null, cannot update trustData');
      return;
    }
    // Ensure 'data' exists before assigning 'trustData'
    this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
    this.DocumentPrepareFor.data.personalResidence = data;
    if(this.DocumentPrepareFor!= null){
      this.DocumentPrepareFor.PersonalResidence = data;
    }
    this.other_real_estate_update();
  }
  //#endregion

    //#region Personal Residence

    other_real_estate_update(): void {
      this.other_real_estateFormData = {
       PersonalResidenceDevise: false,
       Beneficiary: this.Prepare_for_client,
       next: "residence-estate",
       back: "personal-residence",
      };
    }
    on_other_real_estateFormDataData(data: IPersonalResidence): void {
      console.log('Received pet data:', data);
      if (!this.DocumentPrepareFor) {
        console.error('DocumentPrepareFor is null, cannot update trustData');
        return;
      }
      // Ensure 'data' exists before assigning 'trustData'
      this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
      this.DocumentPrepareFor.data.otherRealEstate = data;
      if(this.DocumentPrepareFor!= null){
        this.DocumentPrepareFor.PersonalResidence = data;
      }
      this.residence_estate_data_update();
    }
    //#endregion

  //#region residence-estate

  residence_estate_data_update(): void {
    this.residuaryEstate_Data = {
     members: this.total_members,
     next: "ultimate-disposition",
     back: "other-residence",
    };
  }
  onResidenceEstateData(data: any): void {
    console.log('Received pet data:', data);
    if (!this.DocumentPrepareFor) {
      console.error('DocumentPrepareFor is null, cannot update trustData');
      return;
    }
    // Ensure 'data' exists before assigning 'trustData'
    this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
    this.DocumentPrepareFor.data.residenceEstate = data;
    this.ultimate_disposition_data_update();
  }
  //#endregion

  //#region Ultimate Disposition

  ultimate_disposition_data_update(): void {
    this.ultimate_disposition = {
     beneficiary_Details: [],
     persons:this.beneficiaries,
     ultimate_beneficiary: '',
     next: "finish",
     back: "residence-estate",
    };
  }
  onUltimateDispositionData(data: IUltimateDisposition): void {
    console.log('Received pet data:', data);
    if (!this.DocumentPrepareFor) {
      console.error('DocumentPrepareFor is null, cannot update trustData');
      return;
    }
    // Ensure 'data' exists before assigning 'trustData'
    this.DocumentPrepareFor.data = this.DocumentPrepareFor.data || {};  
    this.DocumentPrepareFor.data.ultimateDisposition = data;
    if(this.ultimate_disposition!= null){
      this.ultimate_disposition = data;
    }

    console.log('My Data ',this.DocumentPrepareFor.data);
  }
  //#endregion

   //#region property

   property_data_update(): void {
    this.property = {
      next: "finish",
      back: "pet-care",
      title: "Last Will + Living Trust",
      name: `${this.DocumentPrepareFor?.beneficiary?.firstName ?? ''} ${this.DocumentPrepareFor?.beneficiary?.lastName ?? ''}`.trim(),
    };
  }  
  //#endregion

  goToMyFiles(): void {
    this.router.navigate(['/my-files']);
  }  

  async clientDataUpdate() {
    if (!this.ClientData) {
      this.ClientData = {};
    }
    
    if (!this.DocumentPrepareFor?.beneficiary) {
      throw new Error("Beneficiary data is missing in DocumentPrepareFor.");
    }
    
    const beneficiary = this.DocumentPrepareFor.beneficiary;
    const person_1 = `${beneficiary.firstName ?? ''} ${beneficiary.lastName ?? ''}`.trim();
    const person_2 = `${this.DocumentPrepareFor.last_will?.Spouse_name ?? ''}`.trim();
    const children = this.total_members.filter(member => member.relationshipCategory === 'child');
  
    // Set beneficiary and last_will
    this.ClientData.beneficiary = beneficiary;
    this.ClientData.last_will = this.DocumentPrepareFor.last_will;
  
    //#region revocable_living_trust
    if (!this.ClientData.revocable_living_trust) {
      this.ClientData.revocable_living_trust = {};
    }
    
    this.ClientData.revocable_living_trust.Trustee_1 = person_1;
    this.ClientData.revocable_living_trust.Co_Trustee_1 = person_1;
    this.ClientData.revocable_living_trust.Settlor_print_name_1 = person_1;
    this.ClientData.revocable_living_trust.Trustee_print_name_1 = person_1;
    if (this.DocumentPrepareFor.last_will?.Spouse_name) {
      this.ClientData.revocable_living_trust.Trustee_2 = person_2;
      this.ClientData.revocable_living_trust.Co_Trustee_2 = person_2;
      this.ClientData.revocable_living_trust.Settlor_print_name_2 = person_2;
      this.ClientData.revocable_living_trust.Trustee_print_name_2 = person_2;
    }
    
    const trusteeNameKeys: (keyof RevocableLivingTrust)[] = [
      "Trustee_name_1",
      "Trustee_name_2",
      "Trustee_name_3",
      "Trustee_name_4",
      "Trustee_name_5",
      "Trustee_name_6"
    ];
    
    for (let i = 0; i < Math.min(children.length, trusteeNameKeys.length); i++) {
      const child = children[i];
      this.ClientData.revocable_living_trust[trusteeNameKeys[i]] = `${child.firstName} ${child.lastName}`.trim();
    }
    //#endregion 
  
    //#region revocable_living_trust_execution_instructions
    if (!this.ClientData.revocable_living_trust_execution_instructions) {
      this.ClientData.revocable_living_trust_execution_instructions = {};
    }
    
    this.ClientData.revocable_living_trust_execution_instructions.Trustee_name_1 = person_1;
    this.ClientData.revocable_living_trust_execution_instructions.Trustee_name_2 = person_2;
    this.ClientData.revocable_living_trust_execution_instructions.Co_Trustee_name_1 = person_1;
    this.ClientData.revocable_living_trust_execution_instructions.Co_Trustee_name_2 = person_2;
    //#endregion
  
    //#region revocable_living_trust_funding_instructions
    if (!this.ClientData.revocable_living_trust_funding_instructions) {
      this.ClientData.revocable_living_trust_funding_instructions = {};
    }
    
    this.ClientData.revocable_living_trust_funding_instructions.Trust_Name_1 = person_1;
    this.ClientData.revocable_living_trust_funding_instructions.Trust_Name_2 = person_2;
    this.ClientData.revocable_living_trust_funding_instructions.Bank_account_name_1 = person_1;
    this.ClientData.revocable_living_trust_funding_instructions.Bank_account_Trust_Title = person_2;
    this.ClientData.revocable_living_trust_funding_instructions.Brokerage_account_name_1 = person_1;
    this.ClientData.revocable_living_trust_funding_instructions.Brokerage_account_name_2 = person_2;
    
    this.ClientData.revocable_living_trust_funding_instructions.Insurance_name_1 = person_1;
    this.ClientData.revocable_living_trust_funding_instructions.Insurance_name_2 = person_2;
    this.ClientData.revocable_living_trust_funding_instructions.Plan_name_1 = person_2;
    this.ClientData.revocable_living_trust_funding_instructions.Plan_name_2 = person_2;
    
    this.ClientData.revocable_living_trust_funding_instructions.Plan_Title = this.trustOptionData.input_value;
    this.ClientData.revocable_living_trust_funding_instructions.Insurance_Title = this.trustOptionData.input_value;
    this.ClientData.revocable_living_trust_funding_instructions.Trust_Title = this.trustOptionData.input_value;
    this.ClientData.revocable_living_trust_funding_instructions.Bank_account_trust_title = this.trustOptionData.input_value;
    this.ClientData.revocable_living_trust_funding_instructions.Brokerage_account_trust_title = this.trustOptionData.input_value;
    //#endregion
  
    //#region Last_will_testament
    if (!this.ClientData.last_will) {
      this.ClientData.last_will = {};
    }
    this.ClientData.last_will.name = person_1;
    this.ClientData.last_will.Spouse_name = person_2;
    if (children.length > 0) {
      this.ClientData.last_will.child_name_1 = `${children[0].firstName} ${children[0].lastName}`.trim();
    }
    if (children.length > 1) {
      this.ClientData.last_will.child_name_2 = `${children[1].firstName} ${children[1].lastName}`.trim();
    }

    if (!this.ClientData.trust) {
      this.ClientData.trust = {};
    }
    this.ClientData.trust.trustName=this.trustOptionData.title;
    
    //#endregion

    //#regin Trust
    if(!this.ClientData.trust) {
      this.ClientData.trust = {};
    }
    this.ClientData.trust.trustName = this.DocumentPrepareFor.data?.trustData?.input_value;
    
    this.ClientData.trust.settlorsTrust = `${person_1 ?? ''} and ${person_2 ?? ''}`.trim();

    this.ClientData.trust.addressTrustee1 = `${this.DocumentPrepareFor?.beneficiary?.address}, ${this.DocumentPrepareFor?.beneficiary?.city}`;

    this.ClientData.trust.addressTrustee2 = this.DocumentPrepareFor?.beneficiary?.city;

    this.ClientData.trust.actingTrustee = `${person_1 ?? ''} and ${person_2 ?? ''}`.trim();
    this.ClientData.trust.initialTrustees = `${person_1 ?? ''} and ${person_2 ?? ''}`.trim();

    this.ClientData.trust.settlorsAndTrustees = `${person_1 ?? ''} and ${person_2 ?? ''}`.trim();
    this.ClientData.trust.acknowledgedTrustName = `${person_1 ?? ''} and ${person_2 ?? ''}`.trim();
    this.ClientData.trust.currentTrustees = `${person_1 ?? ''} and ${person_2 ?? ''}`.trim();

    this.ClientData.trust.trustTitle = this.DocumentPrepareFor.data?.trustData?.input_value;

    this.ClientData.trust.assetTrustName = `${person_1 ?? ''} and ${person_2 ?? ''}`.trim();

    this.ClientData.trust.printSignature1 = person_1;
    this.ClientData.trust.printSignature2 = person_2;

    //#endregion
  }
  


 async generateDocuments(){
    this.loading = true; 
    await this.clientDataUpdate();
    console.log('Hello',this.ClientData.revocable_living_trust_funding_instructions);
   await generateLivingTrustPDF(this.ClientData.revocable_living_trust_funding_instructions);
   await generateCertificateOfTrustPDF(this.ClientData.trust);
   await generateLastWillAndTestament(this.ClientData.last_will);
 
  
    if(this.ClientData!= null){
      await this.lastwill_generate.load_PDFs(this.ClientData);
     
    }
    this.loading = false; 
  }
  
  
}


