# UNICEF Primero - UNHCR Progres Interoperability 

OpenFn jobs for interoperability inter-agency solution in Sudan.  

*Note that commits to `master` will be audo-deployed to OpenFn.org. Always work on a branch!*

## Implementation Checklist
### (1) Functional Requirements
- [x] Design POCs identified? 
- [x] Business value articulated? Link: [Draft SRD document](https://unhcr365.sharepoint.com/:w:/r/teams/Project-I-UNICEF/_layouts/15/Doc.aspx?sourcedoc=%7B6C92757A-CA36-4ADE-92A7-F9A9304AFA0C%7D&file=SRD_DTP_PRIMERO_draft.docx&action=default&mobileredirect=true)
- [x] User Stories documented? 
- [x] User flow diagrams finalized? Link: [Draft Visio Diagrams](https://unhcr365.sharepoint.com/teams/Project-I-UNICEF/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x012000FE55EBBDFA20F3418A44FE405F074C05&viewid=183bd8b2%2D9833%2D4e49%2D865a%2D3103fd2ef066&id=%2Fteams%2FProject%2DI%2DUNICEF%2FShared%20Documents%2FGeneral%2FBusiness%20Analysis%2FProcess)
- [x] Mappings specs - first draft signed off by business owners. [See Gambella mapping specs](https://docs.google.com/spreadsheets/d/1j5bVbg1-c3Pwyx3DiALxaOD4ulGTEdEGJCrgu2DVT38/edit#gid=1470043016).

### (2) System APIs
_Primero_
- [x] Primero API confirmed? [Primero API v2 docs](https://github.com/primeroIMS/primero/tree/development_v2/app/controllers/api) & [language-primero](https://github.com/OpenFn/language-primero)
- [x] Access to system dev/test environments? `Primero Demo Gambella` site
- [x] API authentication tested? 

_Progres_
- [x] Progres API developed? DTP docs: _____
- [x] Access to system dev/test environments? 
- [x] API authentication tested? 
- [x] APIs tested? 
DTP API Endpoints: 
https://antirrio.azure-api.net/primero-uat/ReceiveIncomingReferral
https://antirrio.azure-api.net/primero-uat/ReceiveDecisionOutgoingReferral

### (3) Data Flows
- [x] **System Data Flow diagrams finalized?** [See Diagrams](https://docs.google.com/presentation/d/1S_BuMzJ2MzcvJCoHUPWxkfwYkFP-V-ValIWH4EP3Cj8/edit)
- [x] **Technical specifications finalized?** [See links](https://docs.google.com/document/d/1my6LFr6Fq98wG3dDcURcl9THBrWG7hHLurchJC59Zos/edit?usp=sharing)
- [x] Finalize Mapping specs v2 (with transformation rules, technical specs) finalized? [See Gambella mapping specs](https://docs.google.com/spreadsheets/d/1j5bVbg1-c3Pwyx3DiALxaOD4ulGTEdEGJCrgu2DVT38/edit#gid=1470043016).
- [ ] Assumptions documented? (re: human workflows, data entry, consent, other criteria)
- [x] Testing plan drafted 

### (4) Flow Triggers
- [x] OpenFn job triggers confirmed?
- [ ] 
Proges--> Primero: `message filter` trigger (event-based): DTP to send notifications to OpenFn Inbox. 

Primero --> Progres: `timer (cron)` trigger: Every X hours, OpenFn to send GET HTTP request to Primero to check for new data. 

### (5) Sharing & Security
- [ ] Dating sharing agreement finalized? Link: ______
- [ ] Security configuration & logging specs sign-off (what information can we log in OpenFn?)

### (6) Administration
#### Provisioning, Hosting, & Maintenance
- [x] Deployment: SaaS
- [x] Configuration: OpenFn
- [ ] Maintenance: Software maintenance, security updates, etc. - confirm roles & responsibilities across systems 

#### Support
- [ ] OpenFn administrator users & access levels confirmed? 
- [ ] Support POCs identified for Primero? 
- [ ] Support POCs identified for Progres? 


## Outstanding Items/ Questions
1. How are UNHCR cases eventually closed if related referrals are rejected. Do we keep these cases open over time? 
2. Manual process for scenarios where child revokes consent --> how is the other system notified? 
3. Documentation on how to localize mappings for every country implementation for: `services`, `protection concerns`, `languages`, Primero focal point `username`, Progres `business units` 
4. Documentation on Focal Point users setup in Primero (e.g., `progresv4_primero_intake` user)


## Assumptions
1. UNICEF Primero updates on services will not be shared with UNHCR/Progres in this first phase, only the original referral request. 
2. If UNICEF Primero user revokes consent for a case, then a manual SOP will be determined for communicating that with UNHCR. The interoperability solution will not communicate this change in case. 
3. The exchange of only 4 service types (a.k.a. "intervention types") will be supported between agencies. [See mapping here.](https://docs.google.com/spreadsheets/d/1ieoiGsdGuOA1E3jbw0lWkW-H-V9RzrtxYUdrRsHpOF4/edit#gid=284761480) Primero and Progres users must be trained to NOT send other service types in interagency referral requests. 
4. ... 
