# UNICEF Primero - UNHCR Progres Interoperability 

OpenFn jobs for interoperability inter-agency solution in Sudan.  

*Note that commits to `master` will be audo-deployed to OpenFn.org. Always work on a branch!*

## Implementation Checklist
### (1) Functional Requirements
- [x] Design POCs identified? 
- [x] Business value articulated? Link: [Draft SRD document](https://unhcr365.sharepoint.com/:w:/r/teams/Project-I-UNICEF/_layouts/15/Doc.aspx?sourcedoc=%7B6C92757A-CA36-4ADE-92A7-F9A9304AFA0C%7D&file=SRD_DTP_PRIMERO_draft.docx&action=default&mobileredirect=true)
- [x] User Stories documented? Link: ________
- [x] User flow diagrams finalized? Link: [Draft Visio Diagrams](https://unhcr365.sharepoint.com/teams/Project-I-UNICEF/Shared%20Documents/Forms/AllItems.aspx?FolderCTID=0x012000FE55EBBDFA20F3418A44FE405F074C05&viewid=183bd8b2%2D9833%2D4e49%2D865a%2D3103fd2ef066&id=%2Fteams%2FProject%2DI%2DUNICEF%2FShared%20Documents%2FGeneral%2FBusiness%20Analysis%2FProcess)
- [x] Mappings specs - first draft. Link: [Mapping specs v1](https://docs.google.com/spreadsheets/d/1ieoiGsdGuOA1E3jbw0lWkW-H-V9RzrtxYUdrRsHpOF4/edit#gid=1296754513)

### (2) System APIs
_Primero_
- [x] Primero API confirmed? [Primero API v2 docs](https://github.com/primeroIMS/primero/blob/development_v2/README.md) & [language-primero](https://github.com/OpenFn/language-primero)
- [x] Access to system dev/test environments? `Primero Demo Dadaab` site
- [x] API authentication tested? 

_Progres_
- [ ] Progres API developed? DTP docs: _____
- [x] Access to system dev/test environments? 
- [x] API authentication tested? 
- [ ] APIs tested? 
DTP API Endpoints: 
https://antirrio.azure-api.net/primero-uat/ReceiveIncomingReferral
https://antirrio.azure-api.net/primero-uat/ReceiveDecisionOutgoingReferral

### (3) Data Flows
- [x] **System Data Flow diagrams finalized?** [See Diagrams](https://docs.google.com/presentation/d/1S_BuMzJ2MzcvJCoHUPWxkfwYkFP-V-ValIWH4EP3Cj8/edit)
- [x] **Technical specifications finalized?** [See links](https://docs.google.com/document/d/1my6LFr6Fq98wG3dDcURcl9THBrWG7hHLurchJC59Zos/edit?usp=sharing)
- [ ] Finalize Mapping specs v2 (with transformation rules, technical specs) finalized? [Draft link](https://docs.google.com/spreadsheets/d/1ieoiGsdGuOA1E3jbw0lWkW-H-V9RzrtxYUdrRsHpOF4/edit#gid=1824703789)
- [ ] Assumptions documented? (re: human workflows, data entry, consent, other criteria)
- [ ] Testing plan drafted 

### (4) Flow Triggers
- [x] OpenFn job triggers confirmed?
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
1. `Service` mappings for the country to be piloted
2. How to "accept"/ "reject" referral decisions in Primero? (This will affect filtering criteria for how we get decision updates to send back to DTP.)
3. Manual process for scenarios where child revokes consent --> how is the other system notified? 
4. Documentation on how to localize mappings for every country implementation for: `services`, `protection concerns`, `languages`, Primero focal point `username`, Progres `business units` 
5. Complete testing in UAT environment
6. Configure new project & testing setup in production environment --> Confirm with UNHCR no mappings affected by switch to production environment
