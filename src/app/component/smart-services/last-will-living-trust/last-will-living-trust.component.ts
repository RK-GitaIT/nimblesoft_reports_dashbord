import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { PrepareforComponent } from '../utilities/preparefor/preparefor.component';
import { Beneficiary } from '../../../models/interfaces/Beneficiary.model';
import { myProfileService } from '../../../services/json/my-profile.service';
import { ITrustOptions } from '../../../models/interfaces/utilities/ITrustOptions';
import { IPrepareFor } from '../../../models/interfaces/utilities/ipreparefor';
import { TrustOptionComponent } from './trust-option/trust-option.component';

export interface DocumentPrepareFor {
  beneficiary: Beneficiary;
  Executors: Beneficiary[];
  SuccessorExecutors: Beneficiary[];
  PropertyGuardianshipRepresentatives: Beneficiary[];
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
  imports: [CommonModule, FormsModule, PrepareforComponent, TrustOptionComponent], 
  templateUrl: './last-will-living-trust.component.html',
  styleUrls: ['./last-will-living-trust.component.css']
})
export class LastWillLivingTrustComponent implements OnInit {
  private readonly validSteps = ["initial", "trust_option", "successor", "hipaa_authorization", "hipaa_successor", "hipaa_psychotherapy", "finish"] as const;

  user: Beneficiary | null = null;
  DocumentPrepareFor: DocumentPrepareFor | null = null;
  currentStep: 'initial' | 'trust_option' | 'successor' | 'hipaa_authorization' | 'hipaa_successor' | 'hipaa_psychotherapy' | 'finish' = 'initial';
  beneficiaries: Beneficiary[] = [];
  total_members: Beneficiary[] = [];
  actual_data_members: Beneficiary[] = [];
  Prepare_for_client: Beneficiary[] = [];
  prepareForData!: IPrepareFor;
  defaultSelected: Beneficiary | undefined = undefined;
  trustOptionData!: ITrustOptions;

  constructor(private profileService: myProfileService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

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

  setStep(value: string): void {
    if (this.validSteps.includes(value as any)) {
      this.currentStep = value as typeof this.validSteps[number];
    } else {
      console.warn("Invalid step value received:", value);
    }
  }

  handleEdit(): void {
    if(this.DocumentPrepareFor?.beneficiary.relationshipCategory === 'self'){
      this.currentStep = 'trust_option'
    }
    console.log('Edit clicked from child component');
  }
  
  handleAssemble(): void {
    console.log('Assemble clicked from child component');
  }

  selectUser(data: Beneficiary): void {
    if (!this.DocumentPrepareFor) {
      this.DocumentPrepareFor = {
        beneficiary: data,
        Executors: [],
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

  handleBackClicked(value: string): void {
    this.setStep(value);
  }
  
  handleNextClicked(value: string): void {
    this.setStep(value);
  }
  
  trust_data_update(): void {
    this.trustOptionData = {
      title: 'Decision',
      sub_title: 'Joint Revocable Trust Option',
      sub_title_description: 
        `NetLaw offers married clients two choices when creating a Revocable Living Trust, a joint trust or separate individual trusts. Please keep in mind that the NetLaw Trusts, whether joint or individual, are created for the purpose of probate avoidance only. The NetLaw Trusts do not include estate or income tax planning or asset protection planning. If you have questions or concerns with regard to tax or asset protection planning, please contact customer service or an attorney of your choice.

If you choose to create a joint Revocable Trust, you will be able to create two Wills, one for each spouse, and one joint Revocable Trust. The first spouse to complete documents will create the joint Trust (along with his or her Will), then the other spouse will create his or her Will separately. Collectively, these documents allow you to name the Personal Representative of your estate, the Guardian of your minor children, and direct how you want your assets or property distributed.

Do you want to create a Joint Revocable Trust with ` + ((this.DocumentPrepareFor != null) ? this.DocumentPrepareFor.last_will.Spouse_name : "") + " ?",
      back: 'initial',
      next: 'next-step'
    };
  }

  handleTrustDataEmit(data: ITrustOptions): void {
    console.log('Trust data emitted:', data);
    this.trustOptionData = data;
  }
  
}
