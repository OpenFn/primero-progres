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

**2) Identify in-country agency focal points for interoperability **

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

4) Costing 
_To update_


### Timeline Considerations
| Task  | Lead | Timeline |
| ------------- | ------------- | -------------- |
| Signed Data Protection and Information Sharing Protocol shared with Primero and proGres v4 teams | In-country appointed inter-agency focal point| 1 day |
|Data flow and mapping specifications are finalized| Primero Lead (UNICEF HQ) and proGres v4 (UNHCR HQ) in coordination with the in-country appointed inter-agency focal point | 3 weeks|
| Content Cell  | Content Cell  | 
| Content Cell  | Content Cell  |

