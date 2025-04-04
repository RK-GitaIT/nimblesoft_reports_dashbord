import { PDFDocument, PDFFont, PDFPage, rgb, StandardFonts } from 'pdf-lib';

export async function generatePowerOfAttorneyPDF(data: any) {
    const pdfDoc = await PDFDocument.create();
    const timesNewRoman = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const timesNewRomanBold = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);
    const timesNewRomanFont: PDFFont = await pdfDoc.embedFont(StandardFonts.TimesRoman);
    const boldFont: PDFFont = await pdfDoc.embedFont(StandardFonts.TimesRomanBold);

    // Define page size and layout
    const {
        firstName,
        lastName,
        address
    } = data;
    const value = `${firstName} ${lastName}, ${address}`;
    const dynamicValues: Record<string, string> = {
        address,
        value
    }
    const pageSize = { width: 595.28, height: 841.89 }; // A4 size
    const margin = 50;
    const lineHeight = 16; // Adjusted line height for readability
    const fontSize = 12;
    console.log(data);
     // Create a new page
     async function createPage(headerText: string) {
        const page = pdfDoc.addPage([pageSize.width, pageSize.height]);
        const font = await pdfDoc.embedFont(StandardFonts.TimesRoman); // Embed a font for the header

        // Add header to the top right
        const headerSize = 16;
        const textWidth = font.widthOfTextAtSize(headerText, headerSize);
        const x = pageSize.width - textWidth - 50; // 50px margin from the right
        const y = pageSize.height - 30; // 50px margin from the top

        page.drawText(headerText, {
            x,
            y,
            size: headerSize,
            font,
            color: rgb(0, 0, 0), // Black color
        });

        return page;
    }
    function addHeader(
        page: PDFPage,
        text: string,
        x: number,
        y: number,
        font: PDFFont,
        size: number,
        color: number[] = [0, 0, 0] // Default color is black
    ): void {
        page.drawText(text, {
            x,
            y,
            font,
            size,
            color: rgb(color[0], color[0], color[0]),
        });
    }
    // Function to add text paragraphs with justified alignment
    function addParagraph(page: PDFPage, text: string, y: number, font = timesNewRoman, size = fontSize) {
        const words = text.split(' ');
        let x = margin;
        let currentY = y;

        for (const word of words) {
            const isCapitalized = (word: any) => {
                const exceptions = ["I", "BUT", "IRA"];
                const isNumber = !isNaN(word);
                return !exceptions.includes(word) && !isNumber && word === word.toUpperCase();
            };

            let wordFont = font;
            let wordText = word;

            // Check for dynamic placeholders
            const placeholderMatch = word.match(/^\${(.*?)}$/);
            if (placeholderMatch) {
                const key = placeholderMatch[1];
                if (dynamicValues.hasOwnProperty(key)) {
                    wordText = dynamicValues[key] || "______________";
                    wordFont = timesNewRomanBold;
                } else {
                    wordText = "_____________";
                }
            } else if (isCapitalized(word)) {
                wordFont = timesNewRomanBold;
            }

            const wordWidth = wordFont.widthOfTextAtSize(wordText + ' ', size);
            if (x + wordWidth > pageSize.width - margin) {
                x = margin;
                currentY -= lineHeight;
            }

            page.drawText(wordText + ' ', { x, y: currentY, size, font: wordFont, color: rgb(0, 0, 0) });
            x += wordWidth;
        }

        return currentY - lineHeight;
    }
    let x = 50;

    function addHeading(page: PDFPage, text: string, y: number) {
        const textWidth = timesNewRomanBold.widthOfTextAtSize(text, 13);
        const x = (pageSize.width - textWidth) / 2;
        page.drawText(text, { x, y, size: 13, font: timesNewRomanBold, color: rgb(0, 0, 0) });
        return y - lineHeight;
    }


    let y = pageSize.height - margin;
    let page = await createPage("Estate Planning");
  

    // Title
    y = addHeading(page, "GENERAL DURABLE POWER OF ATTORNEY", y);
    y -= 8;

    // Introductory paragraph
    y = addParagraph(
        page,
        'I, ${value} a resident of and domiciled in, County, Missouri, hereby make, constitute, and appoint my daughter, _________________________, as my true and lawful Attorney-in-Fact, with full power and authority for me in my name, place, and stead, to act in, manage, and conduct all my affairs, as I could do if acting personally. I hereby revoke any prior appointment of an Attorney-in-Fact.',
        y
    );
    y -= 16;

    // Notice section
    y = addParagraph(
        page,
        "THIS POWER OF ATTORNEY SHALL NOT BE TERMINATED OR DEEMED REVOKED BY THE SUBSEQUENT DISABILITY OR INCAPACITY OF THE PRINCIPAL, OR BY THE LAPSE OF TIME.",
        y,
        timesNewRomanBold,
        13
    );
    y -= 16;

    // Authorization section
    y = addParagraph(
        page,
        "I hereby authorize my Attorney-in-Fact to act in my best interests in the following matters:",
        y,
        timesNewRoman,
        14
    );
    y -= 16;

    const authorizations = [
        "1. TO EXPEND FUNDS for my support, maintenance, care, comfort, and welfare.",
        "2. TO BUY, ACQUIRE, OBTAIN, TAKE OR HOLD POSSESSION of any property or property rights of mine or for me whatsoever, whether real, personal, or mixed; and to retain such property as long as said Attorney-in-Fact shall deem it wise; and without limiting the generality of the foregoing, to take possession of, and to order the removal and shipment of, any property from any post, warehouse, depot, dock, or other place of storage or safekeeping, governmental or private; and to execute and deliver any release, voucher, receipt, shipping ticket, certificate, or other instrument necessary or convenient for such purposes.",
        "3. TO SELL, CONVEY (either with or without covenants of warranty), LEASE, MANAGE, CARE FOR, PRESERVE, PROTECT, INSURE, IMPROVE, CONTROL, STORE, TRANSPORT, MAINTAIN, REPAIR, REMODEL, REBUILD, and in every way deal in and with any property or property rights of mine, real or personal, now or hereafter owned by me, including but not limited to (a) all property held in any type of joint tenancy, including a tenancy in common, joint tenancy with right of survivorship, or a tenancy by the entirety, (b) all property over which I hold a general, limited, or special power of appointment, (c) choses in action, (d) any homestead real property of mine from time to time, PROVIDED, HOWEVER, that if I am married, my Attorney-in-Fact may not mortgage or convey homestead property without joinder of my spouse or my spouse’s legal guardian, and such joinder may be accomplished by the exercise of authority in a durable power of attorney executed by my spouse, and (e) any and all shares of stock, bonds, IRA accounts, pension and/or profit sharing plans, securities, certificates of deposit and deposit receipts, registered or otherwise); to release my dower or like interests with respect to any property, and to execute and deliver deeds, leases and other instruments for such purposes; and to set up and carry reserves for repairs, improvements, upkeep, and obsolescence of real and personal property; to eject, remove, or relieve tenants or other persons from, and to recover possession of such property, real, personal, or mixed; and to deal with the United States government, or agencies thereof, in the",
    ];

    for (const authorization of authorizations) {
        y = addParagraph(page, authorization, y);
        y -= 12;
    }

    // Add pages 2 to 7
    const additionalPagesContent = [
        [
            " negotiating and executing of any contract; and to apply for and receive registration cards, certificates of title and license plates for automobiles.",
            "4. TO BORROW MONEY, MORTGAGE PROPERTY, or complete, extend, modify, or renew any obligations, giving either secured (including but not restricted to real estate mortgages, stock certificates and/or insurance policies as collateral) or unsecured, negotiable or nonnegotiable obligations of the undersigned, at a rate of interest and upon terms satisfactory to my Attorney-in-Fact; to likewise LEND MONEY, either with or without collateral; to extend or secure credit; and to GUARANTEE AND INSURE THE PERFORMANCE AND PAYMENT OF OBLIGATIONS OF ANOTHER PERSON, firm, or corporation in the furtherance of any business of mine.",
            "5. TO OPEN, MAINTAIN, OR CLOSE BANK ACCOUNTS, savings or checking, or to do any business with any banking or lending institution, including any savings and loan association or any insurance company, in regard to any savings or checking account of mine, to make deposits and withdrawals, obtain bank statements and passbooks, to collect or receive funds, to sign, endorse, or execute checks, drafts, money orders, warrants, certificates, or vouchers payable to me by any person, firm, or corporation, including political corporations, and including the United States of America, including but not restricted to allowances and reimbursements for transportation of dependents or for shipment of household effects as authorized by law or regulations.",
            "6. TO CONTRACT WITH ANY INSTITUTION FOR THE MAINTENANCE OF A SAFETY DEPOSIT BOX IN MY NAME; to have access to all safety deposit boxes in my name or with respect to which I am an authorized signatory, whether or not the contract for such safety deposit box was executed by me (either alone or jointly with others) or by my Attorney-in-Fact in my name; to add to and remove from the contents of any such safety deposit box and to terminate any and all contracts for such boxes.",
            "7. TO PAY ALL TAXES, city, county, state, or federal, including, but not restricted to, real estate taxes, special assessments, personal property taxes, monies and credit taxes, and income taxes, and to receive appropriate receipts thereof; to prepare, execute, file, and obtain from the government income and other tax returns, state and federal, and other governmental reports, applications, requests, and documents, including any power of attorney form required by the Internal Revenue Service and/or any state and/or local taxing authority; to take any appropriate action to minimize, reduce, or establish nonliability for taxes whether now or hereafter unlawfully or illegally assessed against me; to receive or sue or take appropriate action for refunds of same; to appear for me and to represent me before the Internal Revenue Service and/or United States Department of the Treasury and/or any state tax commission, or any unit, division, agent, or employee thereof, in connection with any matter involving federal or state taxes in which I may be a party; to do everything whatsoever requisite and necessary to be done in the premises and to receive refund checks; to engage, compensate, and discharge attorneys, accountants, and other tax and financial advisors and consultants to represent me and/or to assist me in connection with any and all tax matters involving or in any way related to me or to any property in which I have or may have an interest or for which I have or may have responsibility; and to execute waivers of the statute of limitations and to execute closing agreements as fully as I might do if done in my own capacity (and I hereby request and direct."

        ],
        [
            "that all correspondence, documents, and other communications regarding any tax matters with respect to which my Attorney-in-Fact is hereby authorized to act be addressed to the said Attorney-in-Fact at the address said Attorney-in-Fact directs).",
            "8. TO ACT AS PROXY, with full power of substitution, at any corporate meeting, and to initiate corporate meetings for my benefit as stockholder, in respect of any stocks, stock rights, shares, bonds, debentures, or other investments, right, or interest I may now or hereafter hold, as fully as I might do if personally present and acting in my own behalf, including, but not restricted to, the right to join in or oppose any plans for changes in organization.",
            "9. TO BUY, SELL, ASSIGN, OR TRANSFER STOCKS, BONDS, AND SECURITIES; TO INVEST AND REINVEST, or exchange any existing assets, including but not restricted to common and preferred stocks, annuities, and life insurance, in any income-producing contracts or property or securities, real or personal, including the purchase of United States government bonds eligible for redemption at par plus accrued interest in payment of federal estate tax; to demand and receive interest, dividends and other amounts due me; and, not limited by the generality of the foregoing, to take out life insurance upon my life or upon the life of anyone else in whom I have an insurable beneficial interest, naming as beneficiary either me or the insured or the estate of any insured; and to pay the premiums, assessments, and proper charges for such investments or to continue any existing plan of insurance or investment.",
            "10. TO REASONABLY DELAY, DEFEND, BEGIN, PROSECUTE, SETTLE, ARBITRATE, OR DISPOSE OF ANY LAWSUIT, or administrative hearings, claims, actions, attachments, injunctions, arrests, or other proceedings, or otherwise engage in or participate in litigation in connection with any of my assets.",
            "11. TO CARRY ON A BUSINESS, or businesses of mine, or to begin new enterprises, in the discretion of the Attorney-in-Fact, and for that purpose to retain and employ or increase therein the capital which as of this date shall be employed therein; and to use fresh capital for any new enterprises; and to incorporate, or to operate as a general partnership, or limited partnership, or sole proprietorship under a trade name.",
            "12. TO EMPLOY professional and business assistants of all kinds, including, but not restricted to, attorneys, accountants, real estate agents, appraisers, salesmen, and agents; and to exercise rights that I have retained under agency agreements to which I am and may be a party (hereby releasing any agent from liability for allowing my Attorney-in-Fact so to act in my stead).",
            "13. TO ACT IN THE SETTLEMENT OF ANY ESTATE, in which I have or may have some interest or property due me and to protect, prosecute, and defend such interests; to petition, apply for, or otherwise obtain original or ancillary letters of administration, or letters testamentary; to receive and give acquittance for all sums of money, debts, and accounts whatsoever, which are or shall become due, owing and payable to me; to appear, waive a bond or other security, and to deduct reasonable expenses from any share due me."
        ],
        [
            "14. TO MAKE TRANSFERS of any of my assets, whether real or personal, to any revocable trust which I have established or might establish in the future and in which I am named as the “Grantor” or “Settlor”, and to exercise, with the consent of the Trustee of any such Living Trust, rights that I may have to withdraw property from such Living Trust (hereby releasing the Trustee from any liability for giving such consent in the exercise of its best judgment). This power should not be considered a general power of appointment to the Attorney-in-Fact. Should the provisions of the Code be modified or amended to cause the special power of appointment created hereunder to be treated by retroactive application thereof as a taxable general power of appointment under current law, then the special power of appointment created hereunder shall thereupon be treated as void except to the extent previously exercised by my Attorney-in-Fact.",
            "15. TO HAVE THE FULL AND ABSOLUTE POWER to give to my spouse or any of my children, grandchildren, sisters, brothers, nieces, or nephews, gifts outright or in trust of real property and tangible or intangible personal property, including any contractual benefits whether life insurance, annuities or property interests of any nature, whether such interests be present or future interests, vested or contingent, that my Attorney-in-Fact in his or her sole discretion believes would be my wishes and is advisable, provided that the gift or series of gifts takes into account the estate planning wishes I have expressed from time to time (including through my Last Will and Testament, Trust, beneficiary designations, conversations). Gifts made by my Attorney-in-Fact may be made to my Attorney-in-Fact. The restrictions in this section 15 do not apply to any transfers made under 42 U.S.C. 1396p or any transfers made in conjunction with a written asset protection plan created by an attorney.",
            "The authority herein granted shall include divesting me of assets in favor of other persons or entities, including my Attorney-in-Fact, for the purpose of converting countable assets into excludable assets for Medicaid, VA, or other governmental programs, or transferring assets with the objective of eventually becoming eligible for Medicaid, VA benefits, or other governmental programs.",
            "16. TO MAKE OR CONTINUE TO MAKE payments of the kind and nature made by me to or for my descendants including educational expenses and medical care for the benefit of my descendants. Such payments shall be made directly to the educational organization or healthcare provider and shall otherwise qualify for the gift tax exclusion under Section 2503(e) of the Code and the regulations thereunder.",
            "17. TO SATISFY any charitable pledges I may have made.",
            "18. TO APPLY FOR or qualify me to receive any retirement, pension, or government benefits and to receive, endorse, and collect the proceeds of any retirement, pension, or government benefits (including social security, Medicare, and/or Medicaid, and/or railroad benefits, if applicable) which I may be receiving either as checks payable to or to the order of the undersigned or as direct deposits to an account in the name of the undersigned, including the transfer of such funds to or from any account in the name of the undersigned and/or the authority to change the existing direct deposit instructions to an alternate account in the name of the undersigned; to have full rights and authority to access such accounts and funds; and to act on my behalf pursuant to the terms of this Power of Attorney."
        ],
        [
            "19. TO DISCLAIM any power, property, or interest in property (present or future) to be given, bequeathed, devised, passing by intestacy, or distributed in any way to me or any trust for my benefit, in whole or in part, with full power of substitution of judgment in this regard.",
            "                                                                                  * * * * * * *",
            "I hereby give and grant my Attorney-in-Fact full power and authority to do and perform each and every act, deed, matter, and thing whatsoever in and about my property and affairs as fully and effectually to all intents and purposes as I might or could do if personally present, with full power of revocation and substitution; I do expressly declare that the construed powers herein granted to my Attorney-in-Fact shall not be construed as limited to those matters hereinbefore specifically set forth, but rather shall be construed to broadly include and embrace full and unlimited power and authority to do and perform, on my behalf in my place and stead and with equal validity, and any and all other lawful acts or things which I could do if personally present; and I do hereby ratify all that my Attorney-in-Fact shall lawfully do or cause to be done by virtue thereof; PROVIDED, HOWEVER, that nothing herein shall give or grant the power to execute a Last Will and Testament or to change a Last Will and Testament or other testamentary instrument.",
            "I further direct that this Power of Attorney shall take effect as provided herein and shall be irrevocable except as herein otherwise expressly stated, and if real estate of mine is involved and this instrument has been recorded in a public office, this instrument, as to such real estate, shall not be revocable unless and until such time as there is filed of record a duly acknowledged revocation of this instrument in the same public office in which the instrument containing this power is recorded.",
            "I authorize any attorney or law firm who has represented me to release to my Attorney-in-Fact any and all information such attorney or firm may have regarding my financial affairs or other matters which such attorney or firm may be handling or have handled for me. I specifically waive the attorney/client privilege in regard to this release of information to my Attorney-in-Fact.",
            "This Power of Attorney shall become effective on the date of execution hereof and shall continue effective until it is revoked by me in writing.",
            "This instrument may be recorded in a public office but need not necessarily be so recorded. This power, as between my Attorney-in-Fact and me, may be revoked at any time by prior written notice to my Attorney-in-Fact stating the date on which such revocation shall be effective; BUT, with regard to any revocation by operation of law, including death, anyone else in good faith relying upon the exercise of these powers by my Attorney-in-Fact may rely upon this instrument for its continuing validity.",
            "I hereby declare that any act or thing lawfully done hereunder by my Attorney-in-Fact shall be binding on me, my heirs, legal representatives and assigns, whether the same shall have been done before or after my death or other revocation of this instrument, unless and until reliable notices thereof shall have been received by my Attorney-in-Fact."
        ],
        [
            "Good faith upon any representation, direction, decision, or act of my Attorney-in-Fact is not liable to me or to my estate, beneficiaries, or joint owners for those acts.",
            "My Attorney-in-Fact shall be eligible to serve in all other fiduciary capacities, for me or for my benefit, including but not limited to trustee, guardian and/or conservator. If after the execution of this General Durable Power of Attorney protective proceedings for my person or estate shall be commenced in any court, I hereby nominate my Attorney-in-Fact to serve as conservator, guardian of my estate or guardian of my person, whichever shall be applicable, for consideration by such court. I also hereby authorize my Attorney-in-Fact to nominate a successor conservator or guardian for consideration by the court. I direct that bond be waived for such person nominated as conservator, guardian, successor conservator, or successor guardian.",
            "My Attorney-in-Fact shall not be liable for any loss sustained through error of judgment made in good faith, but said Attorney-in-Fact shall be liable for willful misconduct or breach of good faith.",
            "If any provision of this durable power of attorney or its application to any person or circumstance is held invalid, the invalidity shall not affect other provisions or applications of this durable power of attorney that can be given effect without the invalid provision or application and to this end the provisions of this durable power of attorney are severable.",
            "Copies or facsimiles of this General Durable Power of Attorney shall be as valid as the original General Durable Power of Attorney, if otherwise permissible by law.",
            "All references in this Power of Attorney to the “Code” shall be to the Internal Revenue Code of 1986, as amended.",
            "IN WITNESS WHEREOF, I, ${value} sign this Power of Attorney on this the __________ day of ____________, 2025, at _____________, __________ County, Missouri.",
            "                                                                                                    _____________________________",
            "                                                                                                    ${value}",
            "We, ____________ and ______________, the witnesses, sign our names to this instrument on this ______ of _______________, 2025, and being first duly sworn, do hereby declare to the undersigned authority that the principal signs and executes this instrument as the principal’s Durable Power of Attorney and that each of us, in the presence and hearing of the principal and in the presence of the other subscribing witness, hereby signs this Durable Power of Attorney as witness to the principal’s signing.",
            "Witness: _____________________Address: ________________",
            "Witness: _____________________Address: ________________"
        ],
        [
            "STATE OF ${address}                         )",
            "                                                    )SS",
            "COUNTRY OF ________                        )",
            "On this ______ of _______________, 2025, before me personally appeared ${value} and ______________ and_____________________, the Witnesses, to me known to be the persons described in and who executed the foregoing instrument, and acknowledged that they executed the same as their free act and deed.",
            "                                                                       _____________________________________________",
            "SEAL                                                                       NOTARY PUBLIC",
            "                                                                       My commission expires:________________________",
            "Self-prepared by:",
            "${value}",
            "Address:",
            "____________________________",
            "____________________________"
        ]
    ];

    for (let i = 0; i < additionalPagesContent.length; i++) {
        const additionalPage = await createPage("Estate Planning");
        let additionalY = pageSize.height - margin;

        for (const line of additionalPagesContent[i]) {
            additionalY = addParagraph(additionalPage, line, additionalY);
            additionalY -= 12;
        }
    }

    // Save the document
    const pdfBytes = await pdfDoc.save();
    const blob = new Blob([pdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'Power_of_Attorney.pdf';
    link.click();
}