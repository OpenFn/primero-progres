# UNICEF <> UNHCR Interagency Interoperability: Gambella Pilot

## Programmatic Requirements for Primero and proGres v4 Interoperability

You can find an overview, expectations, prerequisites and timelines for implementing interoperability on [www.cpims.org/interoperability](https://www.cpims.org/interoperability). 

## Technical Requirements for Ethiopia (Gambella) Pilot


This project will deliver a two-way data integration solution to automate case referral exchange between Primero and proGres v4 systems and user groups. This implementation will be a working prototype between a Primero Gambella, Ethiopia demo system and a UNHCR-provider developer environment for DTP/proGres v4. This solution will be available to other countries to adapt, localize, and implement, including making changes to how data elements should be mapped between systems. All OpenFn configurations (not any data) can be made open-source for other partners to reuse and extend.

[See these data flow diagrams](https://docs.google.com/presentation/d/1S_BuMzJ2MzcvJCoHUPWxkfwYkFP-V-ValIWH4EP3Cj8/edit?usp=sharing) for the functional requirements for data exchange, and see the table below for the key requirements. See [UNHCR’s Solution Requirements Document](https://unhcr365.sharepoint.com/:w:/r/teams/Project-I-UNICEF/_layouts/15/doc2.aspx?sourcedoc=%7B6C92757A-CA36-4ADE-92A7-F9A9304AFA0C%7D&file=SRD_DTP_PRIMERO_draft.docx&action=default&mobileredirect=true&cid=dc0665cc-dd98-44a4-a82b-e10c0b6a7954) for additional detail and background information. 


| Requirement   | Solution Overview |
| ------------- | ------------- |
| Primero will be a source of intervention cases and decisions and a destination for intervention cases and decisions coming from proGres v4.  | OpenFn will automate data extraction via the Primero v2 API to get and process outbound referrals that should be sent to proGres v4. Using OpenFn “jobs” (or integration “scripts”), this automation can be configured to run on a scheduled basis, extract data from Primero in JSON format, and then transform to align with DTP system requirements and the agreed mapping specifications.   |
| proGres v4 will be a source of intervention cases and decisions and a destination for intervention cases and decisions coming from Primero.   | OpenFn will provide the infrastructure for receiving and processing data received from the DTP/ proGres v4 systems. OpenFn provides a secure API endpoint with configurable API keys to which DTP can forward intervention data for onward processing to Primero. On receipt of this data, OpenFn jobs will be configured to be automatically triggered to initiate steps to validate the data, forward to Primero, and send back delivery and decision updates to DTP.  |
| Due to the highly sensitive nature of the data, it must be secured properly. There is a high need for authorization and authentication to control access to the data.   | OpenFn out-of-box platform features will be leveraged to ensure the highest level of security and design are implemented in this implementation. See _Project Security Compliance_ section for additional details on configuration. Additionally, when OpenFn authenticates with DTP, UNICEF will generate a client-side certificate, so that its SHA1 thumbprint can be included in every request made to the DTP APIs. |

## Technical Specifications and Training for Ethiopia (Gambella) Pilot

This two-way data integration was achieved via data integration solutions configured on the OpenFn platform to connect the Primero Gambella demo system and a developer proGres v4 environment. [See the technical specifications](https://docs.google.com/document/d/1my6LFr6Fq98wG3dDcURcl9THBrWG7hHLurchJC59Zos/edit?usp=sharing) for detailed documentation of the solution implemented and how it works. 

### Data Flows

**Flow 1: proGres v4 → Primero Referral Sharing**
![image](https://user-images.githubusercontent.com/46493398/152817273-75cc33ca-8fe8-4db6-8470-a3d09032dd53.png)
This first flow automates the sending of referrals from proGres v4 users to Primero. See this Flow 1 diagram for step-by-step documentation of the integration flow. You can [watch this short video](https://youtu.be/GcYd8c4qkns) on how to create a referral in proGres v4 and send the referral to Primero. 

Once the referral is received in Primero, you can [watch this short video](https://youtu.be/XOqqUHaLDhE) on how to accept or reject the referral. Note: the progresv4_primero_intake user will review all referrals from proGres v4 and reassign the referral to the appropriate case worker to complete the referral. For more details, [review slides 3-8](https://docs.google.com/presentation/d/1H9ncQvGcWrT6nVn--wAYKxjNIzKoMt7IkbFiEc1_F6s/edit#slide=id.geff43a9d2b_0_59).


![image](https://user-images.githubusercontent.com/80456839/149411049-1466360b-c823-415b-a224-e44a51211b43.png)



**Flow 2: Primero → proGres v4 Referral Sharing**
![image](https://user-images.githubusercontent.com/46493398/152817416-eaf039e1-7134-4b83-9e9c-ef6a0ac9b441.png)
This second flow automates the sending of referrals from Primero users to proGres v4. See this Flow 2 diagram for step-by-step documentation of the integration flow. You can [watch this short video](https://youtu.be/4HIC0FFU3b4) on how to create a referral in Primero and send the referral to proGres v4. 

Once the referral is received in proGres v4, you can [watch this short video](https://youtu.be/aXFuVZ-eNSI) on how to accept or reject the referral. For more details, [review slides 9-15](https://docs.google.com/presentation/d/1H9ncQvGcWrT6nVn--wAYKxjNIzKoMt7IkbFiEc1_F6s/edit#slide=id.geff43d2b_0_82).

If consent is revoked, please see Annex 1: Consent and Assent in Primero’s CPIMS+ and proGres v4 Child Protection Modules.

![image](https://user-images.githubusercontent.com/80456839/149411137-91a35ada-9c4d-4dc3-8bd3-3d8b8af7e412.png)

Find both data flow diagrams [here](https://docs.google.com/presentation/d/1S_BuMzJ2MzcvJCoHUPWxkfwYkFP-V-ValIWH4EP3Cj8/edit#slide=id.p).

**Assumptions**
1. UNICEF Primero updates on services will not be shared with UNHCR/Progres in this first phase, only the original referral request.
2. If UNICEF Primero user revokes consent for a case, then a manual SOP will be determined for communicating that with UNHCR. The interoperability solution will not communicate this change in case.
3. The exchange of only 4 service types (a.k.a. "intervention types") will be supported between agencies. See mapping [here](https://docs.google.com/spreadsheets/d/1ieoiGsdGuOA1E3jbw0lWkW-H-V9RzrtxYUdrRsHpOF4/edit#gid=284761480). Primero and Progres users must be trained to NOT send other service types in interagency referral requests.

### What information can be shared in Primero and proGres v4 Interoperability 

This interoperability solution leverages the standardized Global Inter-Agency Case Management Task Force Interagency Forms in Primero but may be localized for each implementation to meet unique data sharing agreements and/or Primero system configurations. 

The following details are shared between Primero and proGres v4: 
1. Consent of the child
2. Basic identification (Name(s), date of birth, sex, current address, telephone, languages spoken, UNHCR individual ID, UNHCR registration group number)
3. Services (type of service, reason for referral, implementing agency, service requestor details, and referral status)
4. Users (configured for receiving proGres referrals)

This solution was developed for the Gambella, Ethiopia instance of Primero v2 and the CPIMS+ module. It can be re-implemented and localized with a relatively low level of effort for other Primero systems using this version and module.  To reuse the Interagency Interoperability solution first piloted in Gambella, implementers can clone the OpenFn jobs (or “integration scripts”) and the OpenFn project space configuration (which contains features for automating & monitoring the jobs), as well as make adjustments to localize these components as needed for the next implementation. The key steps for a re-implementation have been outlined on this repository: https://github.com/OpenFn/unicef-unhcr-io

Data element mapping specifications detail which fields or data points will be exchanged between the integrated systems, Primero and proGres v4. 

Given each implementation’s unique data sharing agreement and localizations in Primero, the data element mapping specifications for the interoperability solution may change. [See this mapping](https://docs.google.com/spreadsheets/d/1j5bVbg1-c3Pwyx3DiALxaOD4ulGTEdEGJCrgu2DVT38/edit#gid=1470043016) for the Gambella-specific data element mappings agreed to by UNICEF and UNHCR. For every Primero field listed, this document notes: 
1. the related Interagency Form (see column R), and 
2. whether this mapping may be localized (see column T).
If changes are to be made to this mapping specification, they should (1) first be identified and documented by business owners in this [mapping document](https://docs.google.com/spreadsheets/d/1j5bVbg1-c3Pwyx3DiALxaOD4ulGTEdEGJCrgu2DVT38/edit#gid=1470043016) (referenced above), and then (2) provided to technical implementers to make the corresponding OpenFn mapping changes in the solution. 

Note: For any change requests to the mappings, duplicate the tab to create a new version and add highlighting to show changes and help version control the mappings.

### Solution Assumptions
This initial implementation assumes the following: 
1. UNICEF Primero updates on services will not be shared with UNHCR/Progres in this first phase, only the original referral request.
2. If UNICEF Primero user revokes consent for a case, then a manual SOP will be determined for communicating that with UNHCR. The interoperability solution will not communicate this change in case.
3. The exchange of only 4 service types (a.k.a. "intervention types") will be supported between agencies. [See mapping here](https://docs.google.com/spreadsheets/d/1j5bVbg1-c3Pwyx3DiALxaOD4ulGTEdEGJCrgu2DVT38/edit#gid=284761480). Primero and Progres users must be trained to NOT send other service types in interagency referral requests.

## Configuration Considerations

When implementing this interoperability solution for a new Primero instance, implementers and Primero system administrators should consider the following: 

1. **Required Fields:** Are there any fields on the Primero case or related forms that are (1) instance-specific localizations and (2) required when a case is registered? 
- For example, if your Primero administrator has configured a custom field that is unique to your implementation (e.g., “languages spoken by the child”) and is required in order to register a case, then this field must be included in the mapping specifications. (The source value must either come from a corresponding field in proGres v4, or a default value must be provided, otherwise this required field will be entered with a blank value.)
2. **Focal Point User:** Has the “focal point user” for receiving referrals from UNHCR been identified? Is this 1 user, or multiple users (i.e., 1 user per partner agency)? 
- To begin, Primero partners will select 1 user who will receive the referrals from proGres v4, and reassign the cases to the appropriate case worker/manager/focal points. This user will be the “progresv4_primero_intake”. For Ethiopia, this user will be the lead system administrators from each agency. 
- As the programme expands, the Primero team will support in configuring the interoperability solution to allow for 1 user per agency (for example, “plan_international_intake”, or “save_the_children_intake”, or “irc_intake”) who will receive referrals assigned to their agency.
3. **Implementing Agency:** All services have been configured to be exchanged with UNHCR. A case worker has been set up in Primero and users will select “UNHCR” as the Implementing Agency, and will select “unhcr_cw” to send the referral to proGres v4.
4. **Updating Service Mappings in OpenFn Jobs:** The service mappings from the [mapping specifications](https://docs.google.com/spreadsheets/d/1j5bVbg1-c3Pwyx3DiALxaOD4ulGTEdEGJCrgu2DVT38/edit#gid=284761480) have been added to the OpenFn jobs. Follow the steps below to update the service mappings in the jobs:
- Primero > Progres flow updates should be made [here](https://github.com/OpenFn/primero-progres/blob/ddd166027c237f9e3a3db3860f82b573610089cb/jobs/2.b.uploadReferrals.js#L34). Note that the services in this job should be added as follows: `Primero value (DB Value that OpenFn converts): 'Primero value (that OpenFn sends to Progres)',`. For example: `alternative_care: 'Alternative Care',`
- Progres > Primero updates should be made [here](https://github.com/OpenFn/primero-progres/blob/ddd166027c237f9e3a3db3860f82b573610089cb/jobs/1.upsertExtracts.js#L45). Note that this service map currently only has four items and new services should be added as follows: `'Progres business Value in v4
interventiontype': 'Primero value (DB Value that OpenFn sends to Primero)',` for example: `'Alternative Care': 'alternative_care',`. 
- **Reminder**: Make any mapping changes to the mapping specifications document before updating the staging job mappings. 


## Security and Compliance

The OpenFn platform complies with the [UNICEF CLASS I System Security Requirements](https://www.ungm.org/UNUser/Documents/DownloadPublicDocument?docId=784274). Beyond meeting these baseline requirements, we would like to draw the attention to the fact that OpenFn is not a standalone system, but rather a system which is carefully configured by UNICEF, OpenFn, or UNICEF’s partners to comply with project-level security requirements and to connect with other systems in the UNICEF ecosystem (such as Primero). 

OFG implementation consultants must support these partners to ensure the OpenFn implementation is in compliance with relevant security requirements and adhering to best practices. See the below checklist for project-specific implementation & security considerations.

See Github for the solution documentation: https://github.com/OpenFn/primero-progres

| Checklist Item   | Comments | Timeline   | Status |
| ------------- | ------------- |------------- | ------------- |
| 1. Do not persist Primero data as Messages in OpenFn | OpenFn projects should be configured to not persist Primero information in the OpenFn project inbox. Primero case data should never sit at rest in OpenFn. OpenFn is the data processor, UNICEF is the data controller. | Before go-live and connection to production systems | Completed before go-live. | 
| 2. Modify data storage settings to not delete notifications received from Progresv4/DTP after data has been synced with Primero | UNHCR systems send notifications via POST requests to OpenFn with referral data & related decisions. OpenFn production projects will be configured to delete these notification payloads after the data has been successfully synced with Primero, so that no data is stored on OpenFn servers. | Before go-live and connection to production systems |Completed before go-live. |
| 3. Configure Github repository & connect with OpenFn project| Github provides version control and management of different development pipelines and change request| Before integration setup begin | Completed before go-live.| 
| 4. Seek partner sign-off on information logged in OpenFn Activity History| Do not log any personally identifiable information - only system IDs and date timestamps that may be required for transaction auditing. | Before go-live and connection to production systems | Completed before go-live. | 
| 5. Reset OpenFn Inbox security token for production system & share with UNHCR. | UNHCR will send a “POST” HTTP request to the OpenFn inbox when new intervention referrals are ready to be shared with Primero. This additional security feature requires an additional authorization token in order to write data to the OpenFn inbox. This should be reset and shared with UNHCR administrators before go-live. | Before go-live and connection to production systems | Completed before go-live | 
| 6. Confirm with UNICEF & UNHCR partners what are the appropriate access settings & administrators for the Github repository | Github repositories should never contain data, only code for OpenFn “job” scripts used to process data. Consider making the repository “private” and only granting read/write access to the relevant project administrators.   | Before go-live and connection to production systems | Completed before go-live. |
| 7. Confirm list of administrator users who need access to OpenFn project| Only project admins who need access to OpenFn for ongoing integration monitoring should require access to the production project on OpenFn.org. | Before go-live and connection to production systems | Completed before go-live. |
| 8. Confirm with UNICEF & UNHCR partners that OpenFn credential is granted API-only access  | Ensure no overly broad/ unnecessary permissions are granted to the OpenFn credential used to access the Primero or proGres v4.  | Before go-live and connection to production systems | Completed before go-live. |
| 9. Train administrators on OpenFn platform administration, user management, and integration activity monitoring. | Training is critical to total solution handover and ensuring security best practices are maintained during the project lifetime.| Before go-live and connection to production systems|  Completed on January 20, 2022. Training materials added to Github documentation.  |

## Links
**Gambella-specific solution documentation**
- [Github site with detailed documentation](https://openfn.github.io/primero-progres/)
- [Ethiopia, Gambella Primero - ProGres IA Referral Exchange Mapping Specification (2021 Final Version)](https://docs.google.com/spreadsheets/d/1j5bVbg1-c3Pwyx3DiALxaOD4ulGTEdEGJCrgu2DVT38/edit#gid=1470043016)
- [Archived Legacy Decision-Making IA Mapping Specification for Ethiopia, Gambella (2019-2021)](https://docs.google.com/spreadsheets/d/1ieoiGsdGuOA1E3jbw0lWkW-H-V9RzrtxYUdrRsHpOF4/edit#gid=790782914)
- [Primero IO Training for Administrators](https://docs.google.com/presentation/d/1u8A2Ke4n7i4_IXF65wA5yKeBIcfUijVvnUwnvPjEtM4/edit#slide=id.ga81cdd0b96_0_755)
- [Primero-Progres IO Flows & Testing Steps](https://docs.google.com/presentation/u/2/d/1H9ncQvGcWrT6nVn--wAYKxjNIzKoMt7IkbFiEc1_F6s/edit#slide=id.geff43a9d2b_0_128)
- [Updating this GitHub website](https://github.com/OpenFn/primero-progres/edit/gh-pages/index.md)

**Template interagency solution documentation** (that can be re-used/replicated)
- [Github site with detailed documentation](https://github.com/OpenFn/unicef-unhcr-io)
- [IA Data Element Mapping Specification template](https://docs.google.com/spreadsheets/d/1y3bFz7AL8H4D-H-G4WVx-vdrxwzroyGKTvFCMBvjwCI/edit#gid=1470043016)
- [Programmatic prerequisites, expectations and timelines](https://www.cpims.org/interoperability)

## Support Contacts

![image](https://user-images.githubusercontent.com/46493398/150004235-03c21171-9557-4722-a77f-1bf2d5b3e0cd.png)

**Gambella CPIMS+ System Administrators**
- Isaiah Osotsi, UNICEF, iosotsi@unicef.org
- Bol Yoal, Save the Children, bol.yoal@savethechildren.org
- Niway Derbew, Plan International, Niway.Derbew@plan-international.org

**UNHCR Help Desk**
- Send an email to the UNHCR Help Desk at hqussd@unhcr.org
- Jessica Stuart-Clarke, UNHCR Interoperability Focal Point at stuartcl@unhcr.org

**UNICEF**: 
- Jan Panchalingam, Primero Interoperability Focal Point at jpanchalingam@unicef.org 
- Marta Passerini, CPIMS+ Inter Agency Focal Point at mpasserini@unicef.org


