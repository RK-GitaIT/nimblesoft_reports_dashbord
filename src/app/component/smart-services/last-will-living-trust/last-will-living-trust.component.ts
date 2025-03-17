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
import { IPersonalResidence } from '../../../models/interfaces/utilities/IPersonalResidence';
import { PersonalResidenceComponent } from './personal-residence/personal-residence.component';
import { ResiduaryEstateComponent } from "./residuary-estate/residuary-estate.component";
import { UltimateDispositionComponent } from './ultimate-disposition/ultimate-disposition.component';
import { IUltimateDisposition } from '../../../models/interfaces/utilities/IUltimateDisposition';

export interface DocumentPrepareFor {
  beneficiary: Beneficiary;
  selected_personalReps?: Beneficiary[];
  SuccessorExecutors: Beneficiary[];
  PropertyGuardianshipRepresentatives: Beneficiary[];
  PersonalResidence?: IPersonalResidence,
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
    ResiduaryEstateComponent,
    UltimateDispositionComponent
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
    "ultimate-disposition"
  ] as const;

  user: Beneficiary | null = null;
  DocumentPrepareFor: DocumentPrepareFor | null = null;
  currentStep: 'initial' | 'trust_option' | 'personal-representatives' | 'successor-representatives' | 'trustee-representatives' | 'pet-care' | 'personal-residence'| 'residence-estate'| 'ultimate-disposition' |'initial' = 'initial';
  beneficiaries: Beneficiary[] = [];
  total_members: Beneficiary[] = [];
  actual_data_members: Beneficiary[] = [];
  Prepare_for_client: Beneficiary[] = [];
  prepareForData!: IPrepareFor;
  defaultSelected: Beneficiary | undefined = undefined;
  trustOptionData!: ITrustOptions;
  representativeData!: IRepresentatives;
  personalReps!: IPersonalRepresentatives;
  petFormData!: IPetForm;
  personalResidenceFormData!: IPersonalResidence;
  residuaryEstate_Data!: IPersonalRepresentatives;
  ultimate_disposition!: IUltimateDisposition;

  constructor(private profileService: myProfileService) {}

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
      this.currentStep = 'trust_option'
    }
    console.log('Edit clicked from child component');
  }
  
  handleAssemble(): void {
    console.log('Assemble clicked from child component');
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
  }

  //#region  Trust option Decision
  
  trust_data_update(): void {
    this.trustOptionData = {
      user: this.DocumentPrepareFor?.beneficiary,
      title: 'Last Will + Living Trust',
      title2: 'Decision',
      sub_title: 'Joint Revocable Trust Option',
      sub_title_description: 
        `NetLaw offers married clients two choices when creating a Revocable Living Trust, a joint trust or separate individual trusts. Please keep in mind that the NetLaw Trusts, whether joint or individual, are created for the purpose of probate avoidance only. The NetLaw Trusts do not include estate or income tax planning or asset protection planning. If you have questions or concerns with regard to tax or asset protection planning, please contact customer service or an attorney of your choice.

If you choose to create a joint Revocable Trust, you will be able to create two Wills, one for each spouse, and one joint Revocable Trust. The first spouse to complete documents will create the joint Trust (along with his or her Will), then the other spouse will create his or her Will separately. Collectively, these documents allow you to name the Personal Representative of your estate, the Guardian of your minor children, and direct how you want your assets or property distributed.

Do you want to create a Joint Revocable Trust with ` + ((this.DocumentPrepareFor != null) ? this.DocumentPrepareFor.last_will.Spouse_name : "") + " ?",
      input_label: 'Trust Name',
      back: 'initial',
      next: 'personal-representatives'
    };
  }

  handleTrustDataEmit(data: ITrustOptions): void {
    console.log('Trust data emitted:', data);
    this.trustOptionData = data;
    this.personal_representative_data_update();
  }

  //#endregion

  //#region personal Representatives component

  personal_representative_data_update(): void {
    this.personalReps = {
      members: this.actual_data_members,
      sleeted_members: (this.DocumentPrepareFor != null ? this.DocumentPrepareFor.selected_personalReps : []),
      back: 'trust_option',
      next: 'successor-representatives'
    };
  }

  Personal_handleMembersDataEmit(data: IPersonalRepresentatives): void {
    console.log('Members data emitted:', data);
    // Update your parent component state as needed.
    this.personalReps = data;
    this.successor_representative_data_update();
  }

  //#endregion
  
  //#region successor Representatives component

  successor_representative_data_update(): void {
      this.personalReps = {
        members: this.actual_data_members,
        sleeted_members: (this.DocumentPrepareFor != null ? this.DocumentPrepareFor.selected_personalReps : []),
        back: 'personal-representatives',
        next: 'trustee-representatives'
      };
    }
  
  successor_handleMembersDataEmit(data: IPersonalRepresentatives): void {
      console.log('Members data emitted:', data);
      // Update your parent component state as needed.
      this.personalReps = data;
    this.trustee_representative_data_update();
  }
  
    //#endregion
    
  //#region trustee Representatives component

  trustee_representative_data_update(): void {
    this.personalReps = {
      members: this.actual_data_members,
      sleeted_members: (this.DocumentPrepareFor != null ? this.DocumentPrepareFor.selected_personalReps : []),
      back: 'successor-representatives',
      next: 'pet-care'
    };
  }

  trustee_handleMembersDataEmit(data: IPersonalRepresentatives): void {
    console.log('Members data emitted:', data);
    // Update your parent component state as needed.
    this.personalReps = data;
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
      back: 'trustee-representatives',
      next: 'personal-residence'
    };
  }
  onPetData(data: IPetForm): void {
    console.log('Received pet data:', data);
    if(this.DocumentPrepareFor!= null){
      this.DocumentPrepareFor.petFormData = data;
    }
    this.personalResidence_update();
  }
  //#endregion


  //#region Personal Residence

  personalResidence_update(): void {
    this.personalResidenceFormData = {
     Beneficiary: this.Prepare_for_client,
     next: "residence-estate",
     back: "pet-care",
    };
  }
  onPersonalResidenceData(data: IPersonalResidence): void {
    console.log('Received pet data:', data);
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
     back: "personal-residence",
    };
  }
  onResidenceEstateData(data: any): void {
    console.log('Received pet data:', data);
    this.ultimate_disposition_data_update();
  }
  //#endregion

  //#region Ultimate Disposition

  ultimate_disposition_data_update(): void {
    this.ultimate_disposition = {
     beneficiary_Details: [],
     ultimate_beneficiary: '',
     next: "initial",
     back: "residence-estate",
    };
  }
  onUltimateDispositionData(data: IUltimateDisposition): void {
    console.log('Received pet data:', data);
    if(this.ultimate_disposition!= null){
      this.ultimate_disposition = data;
    }
  }
  //#endregion
}
