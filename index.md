## UNICEF <> UNHCR Interagency Interoperability: Gambella Pilot

### Overview of Primero and proGres v4 Interoperability  


[Primero](https://www.primero.org/) is a modern, browser-based open source application that is flexible and highly configurable. It has granular, role-based access, so that only those who need to see information have access to it. Primero supports multiple modules to facilitate information management for different types of child protection programmes. These modules include the CPIMS+ and the GBVIMS+. Primero interoperability implementations leverage the [OpenFn](http://openfn.org) integration platform to integrate with partner systems. OpenFn-Primero interoperability implementations aim to:   
1. Provide secure, scalable, and reliable infrastructure for configuring automated workflows and data exchange solutions between Primero and partner systems;
2. Improve the Primero user experience of field staff; 
3. Reduce the re-victimization of vulnerable children by facilitating secure record sharing between different service providers and limiting the number of times children are forced to retell their stories of abuse and re-enroll for service provision; 
4. Make that record sharing process more secure, reliable, and scalable, saving time and money for the child protective services sector while reducing the chance of clerical errors or data breaches negatively impacting vulnerable children.  

**OpenFn** provides a secure infrastructure for building data integration and automated workflow solutions, as well as REST API endpoints for external systems to post data to share with Primero. OpenFn also provides a Primero adaptor (or “connector” or API wrapper) that further expedites Primero integration setup. OpenFn is available as an integration-platform-as-a-service (“iPaas”), and also offers local and open-source implementation pathways for countries seeking different deployment options. OpenFn is supported and implemented by consultants from **Open Function Group (OFG)**, a team specializes in integrated system design & implementation for international development programs 
Primero’s inter-agency partners work closely with **UNHCR** across several regions, and would like to automatically and securely exchange intervention data for case referrals. This process will require data from the in-country Primero implementation and UNHCR’s information system **proGres v4**, which also has a mobile component **RApp**. As part of its data integration strategy, UNHCR is developing a custom interface (**DTP**) for OpenFn to send JSON data to (for Primero-to-proGres v4 referrals) and to receive JSON from for new interventions to be shared (for proGres v4-to-Primero referrals). This approach equally distributes the integration effort between Primero and proGres v4 and guarantees that the details of each internal system are properly abstracted. Therefore, UNHCR does not need to know the details of Primero and Primero doesn’t need to know the details of proGres V4. If these systems ever change, the interfacing should change as little as possible, and can be adjusted easily using OpenFn. 

### Rationale and Purpose of Interoperability
The Case Management Task Force and CPIMS Steering Committee has worked towards a minimum dataset and set of case management forms for use in humanitarian settings. This minimum data set has informed the standard instance in CPIMS+. These fields can be shared between CPIMS+ and external systems such as proGres v4 (in line with the agreed ISP). This is not automatic and requires defining information sharing protocols and reinforcing good practice, need to know principles, do no harm principles and accountability. Partners agreed, as a first step, to begin with referrals functionality. This functionality will allow for referrals to be transferred between CPIMS+ and proGres v4. We began to build out the requirements and drafting technical specifications for referrals.The data fields listed in the specifications CAN be shared but are not required to be shared as part of the referral. Information that is shared will be determined by the need to know of the receiving agency and requires consent of the child. Additional requirements for interoperability are requested to be raised during the Primero Coordination Committee and CPIMS+ Steering Committee monthly meetings and will be adapted accordingly to partner needs.
Note: The GBVIMS Steering Committee is looking at interoperability between modules, specifically CPIMS+, but has not committed to the interoperability with systems outside of Primero.

Overall interagency objectives, needs and rationale for interoperability:

#### What is the problem we are trying to solve?

Safeguarding the collection and storage of beneficiary information and data security, confidentiality and protection of this information is critical in data sharing. The collection of information and personal data triggers delicate issues regarding what information can be shared, under what circumstances and with whom. As information systems are increasingly linked to services and referral mechanisms, clear protocols for sharing information must be developed. Where systems can become electronically interoperable, measures can be taken to ensure data security is upheld. For example these measures could include automatic triggers which ensure data is only shared with a child’s consent, and/or a set of defined data points where all participating agencies are aware of the information being shared on a need-to-know basis, and/or the use of an audit functionality to know who is permitting the sharing of data.

#### Why do we want to share information between modules or with external systems?
Data sharing will improve the experience of field staff using the different systems who are trying to coordinate work to support children/vulnerable populations and ultimately improve services, responses, and case management to survivors and children.[1] It will also prevent re-victimization where children do not need to repeat a traumatic incident to multiple service providers.

### How To Rollout Interoperability between Primero and proGres v4

### Expectations & Prerequisites 

**1)Considerations for Interoperability** 

- Country willingness
- Information Sharing Protocol (ISP) to be in place or in development
- Coordination structures in place required to support and maintain interoperability
- ICT considerations
- Stable security situation and operational context
- Strong interagency collaboration and case management capacity
- Change of operational context in-country
- Upgrade to Primero V2 underway
- ProGres V4/RApp is deployed, CP Module is in use 

**2) Identify in-country agency focal points for interoperability**

If your programme is interested in interoperability between Primero and proGres v4, a clearly defined working group is critical for coordination. The in-country (inter-agency) Child Protection team (CP AoR or Case Management Task Force) and the agencies participating in the system implementation must agree to interoperability between Primero and proGres v4. A dedicated system administrator must be appointed to oversee the implementation of interoperability, testing, training and on-going support. Typically this would be the CPIMS+ System Administrator or a focal point with a strong understanding of information management systems and child protection who is actively involved with inter-agency child protection case workers and managers. This in-country appointed focal point will be requested to meet with the Primero and proGres v4 team for 1 hour weekly calls for 9 weeks for the duration of interoperability implementation and participate in a 4 hour system administrator training for interoperability. The focal point will support end-to-end testing of data sharing between the 2 systems, and training end-users once the system is ready to go-live. Once interoperability is live, the focal point will also be the user who would support with assigning referrals to the appropriate agency and troubleshoot any issues that end-users may face. 

**3) Approved and Signed Information Sharing Protocol between participating agencies** 

All data sharing requests should be clearly outlined in the [Data Protection Information Sharing Protocol (DPISP)](https://alliancecpha.org/en/child-protection-online-library/data-protection-and-information-sharing-protocol-dpisp-guidance-and) which is a tool that is part of Information Management standards for case management. All child protection agencies are required to agree and sign a DPISP defining what information about children can be shared, when and with whom. Please also review Annex 1: Consent and Assent in Primero’s CPIMS+ and proGres v4 Child Protection Module

Under the guidance of the Case Management Task Force and CPIMS Steering Committee, the inter-agency CPIMS+ is pre-configured with the [Global Case Management Task Force Case management Inter Agency Forms](https://drive.google.com/drive/folders/17QDeeDRMpf6JHClCE7es7uuevGRt9F8h). The IA referral form is the minimum dataset for service provision and has been configured for data sharing between Primero and proGres v4. Though this configuration is standardized, configuration support is required by the in-country agencies. 

**4) Configuration Support**

The in-country agencies will provide the Primero and proGres v4 teams with the following information to implement the interoperability solutions:
Services that would be shared between Primero and proGres v4
Protection Concerns (as defined in the IA paper forms and CPIMS+)
Participating agencies 
Languages spoken (as defined in the IA paper forms and CPIMS+)

**5) Costing**  
_To update_


### Timeline Considerations
_To update_


### Annex 1: Consent and Assent in Interoperability between Primero’s CPIMS+ and proGres v4 Child Protection Module[1]
The principle of consent and assent are key in the ability of proGres4 and Primero to comply with data subjects’ rights[2]. This means that consent and assent is not only a principle that is required before any personal and/or protection data is collected or shared, but also something which a data subject has the right to withdraw. Note: this principle should be clearly outlined in the country level Data Protection and Information Sharing Protocol, therefore all related actions should align to this or any other country level protocols.

It is therefore important to note that **when it relates to interoperability for purposes of service provision and referral data sharing:**
1. Consent be obtained before making any referrals within or outside the organization, which will therefore also apply to all referrals between proGresV4 CP module and CPIMS+;
2. The Case Worker should clarify with the child and caregiver for _how long_ this consent is valid and _how to withdraw or revoke_ their consent at any time. In some cases, consent/assent may only be given for a one-off referral on the understanding that information about the case will not be shared after that particular referral has been made.
3. If consent is revoked it is important to note the CPIMS+ allows a case worker to revoke access to a referral to any users that a referral was shared with; however, there is no equivalent in proGresV4.  

Therefore: 
1. If consent is withdrawn from a child/caregiver who is being case managed by a case worker using CPIMS+, the case worker will revoke all pending referrals in CPIMS+ and will also send written communication via a password protected email via a secure office email to the designated UNHCR focal point for proGresv4 who reviews all referrals from CPIMS+.  The case worker will also call the UNHCR colleague within 24 hours if no confirmation of reception is received. 

The communication must include: 1) case number; 2) date in which consent was withdrawn; and 3) if the withdrawal is applicable to only some but not all services for which the referral was made - this must be specified (e.g. consent may be withdrawn for resettlement only). 

The UNHCR focal point for proGresv4 will then be required to terminate the specific referral in proGresv4.

2. If a child/caregiver is being case managed by UNHCR and consent is revoked, UNHCR must inform the designated CPIMS+ case worker who is reviewing that referral and send written communication via a password protected email via a secure office email. The UNHCR protection officer will also call the CPIMS+ case worker within 24 hours if no confirmation of reception is received. The CPIMS+ case worker will also “revoke” the referral from UNHCR into the CPIMS+. 

The communication must include: 1) case number; 2) date in which consent was withdrawn; and 3)if the withdrawal is applicable to only some but not all services which the referral was made for then this needs to be specified (e.g. consent may be withdrawn for FTR  only). 

The CPIMS+ case worker will then be required to make a note on the case on the reason for closure and close the case in CPIMS+.

Note: Only, in _exceptional circumstances_, information disclosed by children can be shared against their wishes if it is considered – after careful evaluation - in their best interests to do so, usually if the child or another person is at risk of being harmed or harming themselves, or if sharing the data is determined to be in the child’s best interests. Exceptions to confidentiality should be outlined at the beginning of intake/assessment, when reviewing and obtaining consent/assent as well - and then reiterated later.

In such situations, the reasons for sharing Personal Data in such a manner must be clearly explained to the affected child.  There is no hard or fast rule for disclosing information shared by a child. Information shared against or without explicit consent/assent should be in line with confidentiality and consent and assent principles and processes outlined in the country's Case Management Standard Operating Procedures and the Data Protection and  Information sharing Protocolo. Because sharing information in light of exceptions to confidentiality can be subjective, each case should be considered individually, and decisions to share information should be taken in line with country procedures and involve senior child protection colleagues.



### Annex 2: Key Considerations raised by the Primero Coordination Committee 
**What is the purpose of interoperability with other system(s)? How will the data shared be used by other system(s) – cf. which products, services, etc? What is the problem you’re trying to solve in making systems inter-operable?** Safeguarding the collection and storage of beneficiary information and data security, confidentiality and protection of this information is critical in data sharing. The collection of information and personal data triggers delicate issues regarding what information can be shared, under what circumstances and with whom. As information systems are increasingly linked to services and referral mechanisms, clear protocols for sharing information must be developed. Where systems can become electronically interoperable, measures can be taken to ensure data security is upheld. For example these measures could include automatic triggers which ensure data is only shared with a child’s consent, and/or a set of defined data points where all participating agencies are aware of the information being shared on a need-to-know basis, and/or the use of an audit functionality to know who is permitting the sharing of data.

 **What is the benefit to end users?** Data sharing will improve the experience of field staff using the different systems who are trying to coordinate work to support children/vulnerable populations and ultimately improve services, responses, and case management to survivors and children.

**What is the benefit to women and girls or children?** It will prevent re-victimization where children, women and girls do not need to repeat a traumatic incident to multiple service providers.

**What are the risks for the end user?** There could be a risk in controlling who can access the data and lack of clarity on it.

**What are the risks for women and girls or children?** There could be a lack of clarity of the people who have access to their personal data.

**Define who should be involved in the discussion: What are the decision-making bodies at each organization? Are representatives of these bodies included in the conversation? Is/are user organization(s) involved in the conversation?** Primero Coordination Committee focal points have been the decision-making bodies for each organization and have been included in all conversations to date. Opportunities to ask questions and raise any concerns have been scheduled and all feedback has been tracked here.

**Who (which individual(s)/role(s)) have access to Primero records shared with the other system? Can access be limited to certain individual(s) or role(s)?** Yes, this is to be defined by the partners in the technical specifications.

**Beyond actor(s) implementing the other system, do other actor(s) have access to the records shared from Primero?** Data-points defined by the minimum data set can only be shared from Primero to an external system and vice versa.

**Do Primero user organization(s) have the right to opt-out on the data sharing with external system?** Yes, partners and agencies can opt-in and opt-out of interoperability.

**How is consent collected from beneficiaries for data sharing with other system? Are staff trained to ask for consent specifically for data sharing with external actors? What tools exist (ie. tailored consent form)? What happens if they do not give their consent?** Consent is collected from beneficiaries for all information shared inline with best practice.  All staff are trained on getting consent, and if any changes in what information would be shared, then any consent scripts would be modified to address this.  Consent forms would only need to be modified if there was to be a change in information shared.  If referrals were to be done by IO instead of paper forms but the content was exactly the same, then there would be no need for a change in consent script or form. Information would not be shared if the survivor does not give their consent. With the obviously limitations of best interest, that are outlined in CM SOPs. 

Note: Extraordinary circumstances occur when data subjects cannot provide consent due to medical or other urgent situations, but processing their data is in their immediate and vital interests. Examples include, when a person is unconscious and cannot provide consent, when a person poses an immediate threat to themselves or others, or when a situation of active conflict breaks out and persons cannot be reached to provide consent; or when access to a person is arbitrarily denied by a relevant authority. In such cases, it would be acceptable to share or otherwise process personal protection-related data without consent, as long as such processing was required for an immediate and necessary intervention in their vital interests. For example, providing information about a person’s plans to commit suicide to a specialized care provider may be necessary to save a person’s life. Even in exceptional circumstances, however, risk assessments should be done to ensure that the risks of processing do not outweigh the benefits. In the above example, the information relating to a planned suicide should also only be shared where the service provider in question has been assessed as safe and able to provide care. It would not, for example, be appropriate to share such information if this would expose the data subject to a risk of refoulement.

**Is interoperability with other system(s) enshrined in the Information Sharing Protocol (ISP)? Has the ISP been developed in a collaborative and inclusive manner with User organization(s)?** Because IO functionality exists does not mean it would necessarily be used in all contexts.  The Information sharing protocols and CM SOPs in a context would outline how and what information is to be shared and if interoperability facilitates this, for example in a digitized referral then the modality could change but the ‘what’ would not. The purposes of information sharing should be considered as part of SOP development in relation to any protection activities that involve the processing of personal, protection-related data. At all steps of an activity that involves processing of personal, protection-related data, there should be one or several specific purposes. These are defined and agreed between partners at an operational level, and endorsed at a management level. 

**How does interoperability with other system(s) affect the inter-agency process of data sharing (ie. compilation, reporting and analysis)?** It should not change what information is shared, it should just modify the modality of sharing.  For example, interoperability would enable referrals to be sent directly, and not require paper based or email based referral forms.  In terms of data compilaton, for GBVIMS,  the process would not change.  The Interagency Coordinator would still compile monthly statistics reports from DGOs, who could generate the report no matter what system they use, GBVIMS, GBVIMS+, V4. 

**What is/are the scenario(s) in which data needs to be shared with other system(s) – user stories?** Referrals are the current use case of interoperability between Primero and external systems, as agreed to by the partners.

**What constitutes a referral between Primero/CPIMS+ and Progres4? For what specific service?**
We would define a referral as follows: To make a referral is to “...proactively facilitate access to [...] services. Facilitating referral [...] may also involve ensuring that the person can physically reach and obtain access to the necessary services. At a minimum, it requires providing contact information on services of proven reliability”[1]. There must be a legitimate purpose for a referral, consent/assent must normally be obtained from the referral subject (see below), and the personal data provided should be limited to what is needed for the service to be provided. The modalities of referrals will differ from context to context, and should be defined as per operation-specific SOPs.  Legitimate purpose concerns the how “personal data should be collected “for specified, explicit and legitimate purposes and not further processed in a manner that is incompatible with those purposes.” [1]  Thus any referral between the systems would be services in line with this definition.  The specific services would be defined by those outlined in the contextual CM SOPs.
The two types of referrals that could be anticipated are
Open, active cases with services needed immediately. This would be outlined in CM SOPs.
Open, active cases for protection services and assistance referrals wich is provided based upon informaiton know to UNHCR, whether immediately or in the future.   To do these type of referrals the suggested protocol would be: UNHCR and partners should agree on the list of potential protection and assistance services that can be accessed or are likely to tbe accessed in the future (e.g. those in relation to voluntary repatriation) in a particular operation. UNHCR should provide clear and transparent information about how data will be processed, stored, shared and used, and how data subjects may or may not be informed about this or contacted. UNHCR and partners should also take steps to identify and mitigate any identified risks in the process. UNHCR should not ask for information to be shared with the consent of the data subjects, and NGO partners should ask for consent from PoC in good faith. For this purpose it is only ok to share limited information about a protection incident of vulnerability for this purpose, such as a specific needs code or case number in an agreed upon referral form/modality, with the data subject’s consent.
 
**For which purpose a case should be referred to proGres v4 CP module? (if it’s for a durable solution, could you clarify what entails durable solutions and provide a list of examples?)** See above response

**Which document defines what constitutes a referral? Is it global or country level?** What constitutes a referral is defined above, as with all CM SOPs the modalities of Referrals will be determined on an operation by operation basis.

**What data points can be shared with other system(s) is a safe and confidential manner? What could be some of the risk(s) involved with data sharing? How can it be mitigated?** Data will be transferred with a specific protocol to follow in the system. Primero has an audit functionality to track the referrals and ensure there isn’t misuse of the system.

**Is development work needed to enable interoperability between systems? If so, how can it be done?** Yes, this will be done by the Primero development vendors.
How do we address challenges that we may encounter when discussing interoperability in specific contexts? (I.e. specific context-related risks and considerations for data sharing among UNICEF/UNHCR, INGOs/Implementing Partners and Governments). A specific forum that would allow for these issues to be addressed without taking the focus away from forums focused on other systems such as PCC or GBVIMS was proposed.  We would prefer to develop the modality and approach collaboratively and not prescribe a process. 

**Which  users from UNHCR can receive referrals? Why (for what specific service)? Who makes the decision on whom from UNHCR receives referral from Primero?**  The procedure for referring to UNHCR in proGres could look different in different contexts.  If the CP or GBV focal point was to be the first point of referral then it would go directly to the individual.  If an individual is being referred to a unit, the there is a unit referral focal point designated that is responsible for dividing tasks amongst the team.  This would be for example in a case of documentation or RSD.  The sharing of a referral does not allow for access to a case file, only the referral form which outlines what service is needed.  Any additional information that can be shared (as necessary and with the consent of the survivor) would only be shared once the individual responsible for providing the services has been assigned. These individuals are outlined in v4 SOPs and can be shared and updated with all partners participating with interoperable services and would be updated as part of referral pathways.

**Which rollouts will be prioritized for UNHCR for Primero-ProGres v4 interoperability?** This can be determined collaboratively, we do not have a specific priority, although a refugee context would be the most logical. 

### Annex 3: Terminology
Interoperability: The ability of computer systems or software to exchange and make use of information (Oxford University Press, 2019). This exchange may be manual or automated. In the case of Primero currently this is a manual process where an encrypted export is generated (see Interoperability in Primero). Manual data sharing, for example, could be an Incident Recorder (IR) or Excel export from GBVIMS+ to share aggregate-level data to MRM actors.
Primero does not automatically exchange information with alternative systems or software or between modules. Primero does have APIs (application program interface) available which are access points to a module and its forms and allow for applications to communicate to one another (see Information Sharing Protocol). APIs create a window for data to be exchanged between modules without the need for a developer to share a modules entire code. This video simply describes the functionality of APIs.
For the purpose of interoperability in Primero, there are two different types:
1.      Interoperability between Primero modules: CPIMS+, GBVIMS+ and/or MRMIMS+
2.      Interoperability of Primero modules with other external systems (ie. ProGres 4)
Memorandum of Understanding (MoU): On March 14, 1996, UNICEF and UNHCR developed a MoU to promote coordinated action in areas of common interest. The agreement delineates the roles of the two organizations and provides a framework for cooperation in activities with refugees, returnees, internally displaced persons and local populations in countries of asylum and origin.
Letter of Understanding (LoU): Guidance and template developed in 2013 by UNICEF and UNHCR and supported by executive management in both parties. The template was developed to support joint assessment and planning at country and regional levels between UNICEF and UNHCR and works in conjunction with the MoU.
LoU Annex B: Guidance for Technical Areas: Signed off in January of 2015, this annex to the LoU provides high level guidance on policy frameworks/tools that inform refugee-specific contexts, activities/initiatives for coordination and cooperation with governments and partners in refugee contexts. Annex B to the LoU and is currently being revised.
Primero Data Protection and Data Privacy Framework: This Framework should not be misconstrued as a “Global Terms of Use”, but rather a package of contextualizable tools that will better serve our various data protection requirements. This framework will bring together our existing documents and processes as well as some new resources to create a comprehensive privacy/protection ecosystem. This is currently under development.
Terms of Use (ToU): Rights and responsibilities which users must agree to use the system or software; it effectively forms a contract between the agency/agencies implementing Primero (ie. UNICEF, UNFPA) and the user organization(s). The ToU makes reference to the implementation plan, information sharing protocol and governance structure. This includes definitions of key words, access to the information, user rights and responsibilities, managing users, limitation of liability, correct behavior and actions that may be taken against the user if terms are broken, user notifications if terms are modified. This is one of the tools that will be within the Primero Data Protection and Data Privacy Framework. Currently there are no “global” tools such as the Terms of Use. For each implementation of Primero, all tools are currently negotiated at a country-level and with the respective global steering committees.
Information Sharing Protocol (ISP):  For CPIMS+ implementation, provides guidance on accessing, storing, sharing, archiving and destroying records in Primero which is agreed to and signed off by all parties involved at the field level. This protocol also defines the use of an API (or application program interface) for data sharing. This is one of the tools that will be within the Primero Data Protection and Data Privacy Framework. For GBVIMS+, the ISP sets out the guiding principles and describes procedures for sharing anonymous monthly statistics data on reported cases of Gender-Based Violence (GBV) collected through Primero/GBVIMS+ or the legacy system, GBVIMS, between user organization(s) and the coordinating agency/agencies as well as external sharing with other actors not signatory to the Protocol.
Implementation Plan: This is a “blueprint” of the implementation developed at the programme level that details the roles and access levels of different users, as well as the role of the System Administrator. It is a requirement for all Primero deployments and acts as an accountability plan and rollout plan. This is one of the tools that will be within the Primero Data Protection and Data Privacy Framework.
UNHCR Data Protection Policy: Define.

### Annex 4: Key Workshops and Meetings To Date

**Primero Interoperability Discussions at the PCC Level, Beginning March 2019-Present:**
- Clarity on the needs of interoperability raised in March PCC meeting and becomes a standing agenda item in our meetings (March 2019)
- This draft « Interoperability Background and Rational » document was used to collect all partners’ feedback in hopes of developing a guidance with common goals and an understanding of interoperability for Primero (May 2019)
- All partners invited to ProGres v4 demo and feedback/questions are collected here (July 2019)
- IRC, TdH, UNICEF, and Save the Children provided feedback on user stories and have agreed to referrals and the data points listed here (August 2019)
- All partners discussed sharing of use cases (referrals only) and agreed on specifications shared by Jan (here). UNHCR answered questions pertaining to data protection frameworks and concerns here (September 2019)
- All partners a technical specifications are provided to the Primero v2 development team (December 2019)
- Primero development team will liaise with ProGres v4 team via Celine and Janis on any coordination needed for development (Q1 2020)
- Primero v2 testing process/user feedback without interoperability begun in November 2019
- Primero and ProGres v4 development meetings to enable interoperability (August 2020 - September 2021)
- Primero v2 UAT on referrals for interoperability (September 2021)
- Additional requirements for interoperability are requested to be raised during the PCC monthly meetings and will be adapted accordingly to partner needs 

**Primero-proGres Working Group (PPWG), July 2016:**
- [Link to full document](https://unicef.sharepoint.com/:w:/r/teams/PD-Primero/DL1/Primero%20Coordination%20Committee/Interoperability%20Background%20and%20Rationale/TOR%20Primero-ProGres%20Working%20Group%2005122017.docx?d=w5fb55271f3264b808fae9825b8404498&csf=1&e=ebMiZG)
- Participants:
- Summary: This document was drafted as a terms of reference for a Primero-proGres Working Group. The ToR was drafted in July 2016 and revised in December 2017.

**Primero & proGres v4 Workshop Outcome Document, 13 – 14 February 2014:**
- [Link to full document](https://unicef.sharepoint.com/:b:/r/teams/PD-Primero/DL1/Primero%20Coordination%20Committee/Interoperability%20Background%20and%20Rationale/Primero%20proGres%20v4%20Workshop%20Outcome%20Document.pdf?csf=1&e=BghAhr)
- Participants: UNHCR, UNICEF, Save the Children, IRC, Quoin (see [full attendance and agenda](https://unicef.sharepoint.com/:x:/r/teams/PD-Primero/DL1/Primero%20Coordination%20Committee/Interoperability%20Background%20and%20Rationale/All%20IMS%20Protection%20Incident%20Monitoring%20Inventory%20(Consolidated).xls?d=wc92baf1e9a224a1aba4a36f1a5b8f09c&csf=1&e=YCH8J5))
- Summary: 
  - In the context of protection case management, there are many opportunities to collaborate better to improve the quality of service at the global and country level through data sharing between proGres (v4) and Primero. Any interoperability between the two systems is an improvement over the current situation. By increasing the opportunity for data sharing between systems, where a specific purpose is identified to do so (“Need to Know” principle), there is an opportunity to decrease the time burden of data entry, improve the experience of field staff using the different systems who are trying to coordinate work to support children/vulnerable populations and ultimately improve the case management work. There are some contexts where these systems will not interact because there is no business case for interaction.
  - Due to legal and practical implications, proGres 4 would likely never receive a bio data feed from Primero or Rapid FTR for refugees or asylum seekers. However, it may be possible to receive a bio data feed for IDP populations, depending on the registration inclusion criteria for the IDP population.
  - Decision made to identify use cases for both GBVIMS and CPIMS; data feeds between the CPIMS aspect of Primero and proGres 4 is probably the biggest “win” and requires the most analytical work. For GBVIMS, the record volume is smaller, the data is so sensitive that it’s less likely to be shared and proGres 4 was designed with GBVIMS in mind so there should be a high degree of compatibility. For MRM, proGres v4 will be “MRM compliant”, meaning that reports will be able to be run for cases that fit MRM criteria; however, due to the business process and MRM verification standards, it is likely that these reports would be used for discussion in a MRM Country Task Force rather than having a data feed from proGres into the MRM portion of Primero.
  - There is a general reluctance from practitioners to automate some business logic and take it out of the control of human management (e.g. veto informed consent, identifying trusted data sources etc.)
  - Data sharing must always be governed by principle of “need to know/purpose”; depending on the intended purpose of the data exchange, different sets of information may or may not be shared

**CPIMS/GBVIMS Technical Team Call, 5 June 2013:**
- [Link to full document](https://unicef.sharepoint.com/:w:/r/teams/PD-Primero/DL1/Primero%20Coordination%20Committee/Interoperability%20Background%20and%20Rationale/CPIMS-GBVIMS%20Technical%20Call%20Notes%2005%20Jun%202013.docx?d=wad41700015ef4ebdae9f1ae22b86ea89&csf=1&e=D9H32P)
- Participants: Leloba Pahl, UNHCR GBVIMS Consultant (chair), Shelley Gornall, UNHCR Ops Data Management Specialist, Erin Patrick, UNICEF GBV in Emergencies Adviser, Robert MacTavish, UNICEF Business Analyst
- Summary:
  - Call was to discuss implications of UNICEF/UNHCR work together
  - UNHCR was working to incorporate GBVIMS functionality into proGres v4

**CP and GBV IMS Meeting, 10 May 2013:**
- [Link to full document](https://unicef.sharepoint.com/:w:/r/teams/PD-Primero/DL1/Primero%20Coordination%20Committee/Interoperability%20Background%20and%20Rationale/CP%20and%20GBV%20IMS%20Meeting,%2010%20May%202013.docx?d=w1f29471413754e5c8c269c97241235df&csf=1&e=uUcOUb)
- Participants: IRC, UNICEF, WPE, Save the Children (see full attendance in link to document)
- Summary:
  - In person meeting in New York discussing CPIMS and GBVIMS
  - Group discussed that there is a lack of standardization around the two systems, and the excel exports; data protection
  - Determined there is a need to document roles/responsibilities in the respective systems, commonalities between CP and GBV responses, defining survivor codes/survivor codes, determining if CPIMS can become the case management system for GBV

**Recommendations on the Outcome of the Protection Incident Monitoring and Case Management Workshop, 24 – 25 May 2011:**
- [Link to full document](https://unicef.sharepoint.com/:w:/r/teams/PD-Primero/DL1/Primero%20Coordination%20Committee/Interoperability%20Background%20and%20Rationale/Interoperability%20Background%20and%20Rationale.docx?d=we36ef00ac9994ce4ad191b14bfaa2ca0&csf=1&e=SOCnH5)
- Participants: 38 participants from UNICEF, UNFPA, IRC, UNHCR, OHCHR, NRC, UN Women, ProCap, OCHA, ICRC and UN Action.
- Summary:
  - This paper outlines discussions held at the Interagency Protection Incident Monitoring and Case Management Workshop organized by UNHCR and hosted by the Global   - Protection Cluster in Geneva. Eight systems were presented including UNICEF’s Monitoring and Reporting Mechanism database (MRM), the Interagency Child     Protection Database (IA CP IMS), UNHCR’s proGres, ICRC Prot5, the interagency Gender Based Violence Information Management System (GBVIMS), OHCHR’s Human Rights Case Database (HRDB) and UNHCR’s Promis. Please see All IMS Protection Incident Monitoring Inventory (Consolidated).
Five potential ways of working together by harmonizing systems from a statistical standpoint included:
    - To focus on the physical act when classifying incidents instead of incorporating victim/perpetrator characteristics within the incident type
    - To harmonize different incident taxonomies between systems into a mega taxonomy at the global/country level
    - To count using an explicitly defined unit of measure
    - To prevent double counting
    - To systematize the bias in incident classification and incident counting
  - The paper outlined challenges and good practices and coordination opportunities between partners and their systems to enhance protection monitoring and case management the following elements/system features to enable harmonization: informed consent, verification standards, ISPs, referral pathway tracking, over-designed systems, customizing systems, prevalence, units of measurement, incident typologies, double counting, data security
  - The idea of a common incident system in certain situations was discussed during this session to explore the need for and feasibility of such cooperation. The group agreed that given the current fragmentation of approaches and systems, no one system could provide the answer in the short to medium term. Rather it was recommended to look for common elements within current systems and to examine how practical linkages and synergies could be developed within Protection Clusters. The discussion also highlighted the need to streamline the protection information management effort, particularly in the early phases of an emergency. Concrete actions included directing our attention to better cross-analysis of data between systems, to develop data sharing methods and protocols, and to define collaboration processes – including cross-referenced SOPs.
 
**Information Management System Consultations, 29 - 30 July 2010:**
- [Link to full document](https://unicef.sharepoint.com/:b:/r/teams/PD-Primero/DL1/Primero%20Coordination%20Committee/Interoperability%20Background%20and%20Rationale/Information%20Management%20System%20Consultations,%2029%20-%2030%20July%202010.pdf?csf=1&e=B1HILD)
- Participants: 19 participants from UNICEF, IRC, Save the Children, UNFPA, UNHCR, UNIFEM, WHO (see page 8 in the link to document above for list of participants)
- Summary:
  - Session was held to discuss how CPIMS and GBVIMS / GBVIMS and MRM could share information, and common points of interest
  - CPIMS and GBVIMS discussions were held on:
     - how referrals could be made between systems and the need for a minimum data set to improve coordination between CP and GBV actors to improve referral services
    - Need to avoid duplication/double counting
    - DPISP
    - Information flowing in one direction from CPIMS to GBVIMS
  - GBVIMS and MRM discussion were held on:
    - Issues of verification
    - Profiles of perpetrators
    - Informed consent
    - How GBV does not need automated sharing of information from MRM however MRM staff should ensure GBV survivors are referred to available services as part of ethical monitoring

