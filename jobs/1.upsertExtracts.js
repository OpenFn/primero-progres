each(
  dataPath('interventions[*]'),
  alterState(state => {
    const { data } = state;

    const calculateAge = dob => {
      const diff = Date.now() - dob.getTime();
      const age_dt = new Date(diff);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    };

    const serviceMap = {
      'Advocacy / Direct intervention': 'services_for_children_with_disabilities',
      // 'a8b00885-b3c3-e611-80ca-00155d340529': 'security', // mapping should be like  {[valueInSampleDAta]: 'valueToUpload'}
      // alternative_care: 'BIA', //TESTING: DO NOT USE
//       security: 'Protection',
//       education: 'Education',
//       non_formal_education: 'Education',
      // family_tracing_and_reunification: 'BIA', //TESTING: DO NOT USE
      // basic_psychosocial_support: 'Psycho-social Assistance',
      // focused_non_specialized_mhpss_care: 'Health Assistance',
      // specialized_mhpss_services: 'Health Assistance',
      // food: 'Food Assistance',
      // non_food_items: 'CRI Assistance',
      // cash_assistance: 'Cash Assistance',
      // Livelihoods: 'livelihoods',
      // medical: 'Health Assistance',
      // nutrition: 'Health Assistance',
      // legal_support: 'Legal Aid',
      // documentation: 'Documentation',
      // services_for_children_with_disabilities: 'BIA', //TESTING: DO NOT USE
      // sexual_and_reproductive_health: 'Health Assistance',
      // shelter: 'Accomodation',
      // wash: 'Other',
      // durable_solution: 'Other',
      // relocation: 'Protection',
      // other_please_specify: 'Other',
    };
    state.serviceMap = serviceMap;

    const protectionMap = {
//       'a1c5b4fb-8f76-e611-80c9-00155d340529': 'sexual_exploitation', //CR
//       'a3c5b4fb-8f76-e611-80c9-00155d340529': 'slavery_sale_abduction', //DS
//       'DS-V': 'in_conflict_with_the_law', //CR-CS
      'physical_abuse_violence': 'Lower Body Mobility',
      'sexual_abuse_violence': 'Upper Body Mobility',
      'rape': 'Vision',
      'emotional_or_psychological': 'Hearing',
      'neglect': 'Communication',
      'abandonment': 'Emotions and behavior',
      'child_labour': 'Remembering and concentrating',
      'hazardous_work': 'Self-Care',
      'sexual_exploitation': 'Child at risk[1]',
      'slavery_sale_abduction': 'Child parent',
      'in_conflict_with_the_law': 'Child spouse',
      'associated_with_armed': 'Child carer',
      'deprived_of_liberty': 'Teenage pregnancy',
      'serious_medical_condition': 'Child engaged in worst forms of child labour',
      'functional_difficulty_seeing': 'Child engaged in other forms of child labour',
      'functional_difficulty_hearing': 'Child at risk of not attending school',
      'functional_difficulty_walking': 'Child with special education needs',
      'functional_difficulty_remembering': 'Child associated with armed forces or groups',
      'difficulty_with_self_care': 'Child in conflict with the law',
      'difficulty_communicating': 'Separated child',
      'unaccompanied': 'Unaccompanied child',
      'separated': 'Child-headed household',
      'orphan': 'Child in institutional care',
      'psychosocial_distress': 'Child in foster care',
      'mental_disorder': 'Woman at risk',
      'substance_abuse': 'Single woman at risk',
      'belongs_to_marginalised': 'Lactation',
      'lack_of_documentation_birth_registration': 'Single older person',
      'child_marriage': 'Older person with children',
      'female_genital_mutilation_fgm': 'Older person unable to care for self',
      'pregnancy_child_parent': 'Single HR – parent',
      'denial_of_resources_opportunities_or_services': 'Single HR – grandparent',
      'highly_vulnerable_care': 'Single HR – caregiver',
      'child_survivor_of_explosive': 'Visual impairment (including blindness)',
      'other': 'Hearing impairment (including deafness)',
      'ds_pm__physical_disability___moderate': 'Physical disability – moderate',
      'ds_ps__physical_disability___severe': 'Physical disability – severe',
      'ds_mm__mental_disability___moderate': 'Mental disability – moderate',
      'ds_ms__mental_disability___severe': 'Mental disability – severe',
      'ds_sd__speech_impairment_disability': 'Speech impairment/disability',
      'sm_mi__mental_illness': 'Mental illness',
      'sm_mn__malnutrition': 'Malnutrition',
      'sm_dp__difficult_pregnancy': 'Difficult pregnancy',
      'sm_ci__chronic_illness': 'Chronic illness',
      'sm_cc__critical_medical_condition': 'Critical medical condition',
      'sm_ot__other_medical_condition': 'Other medical condition',
      'sm_ad__addiction': 'Addiction',
      'fu_tr__tracing_required': 'Tracing required',
      'fu_fr__family_reunification_required': 'Family reunification required',
      'lp_nd__no_legal_documentation': 'No legal documentation',
      'lp_bn__unmet_basic_needs_': 'Unmet basic needs',
      'lp_na__no_acces_to_services': 'No acces to services',
      'lp_mm__mixed_marriage': 'Mixed marriage',
      'lp_md__multiple_displacements': 'Multiple displacements',
      'lp_rr__at_risk_of_refoulement': 'At risk of refoulement',
      'lp_rd__at_risk_of_removal_': 'At risk of removal',
      'lp_da__detained_held_in_country_of_asylum': 'Detained/held in country of asylum',
      'lp_do__detained_held_in_country_of_origin': 'Detained/held in country of origin',
      'lp_dt__detained_held_elsewhere': 'Detained/held elsewhere',
      'lp_ih__in_hiding': 'In hiding',
      'lp_wp__absence_of_witness_protection': 'Absence of witness protection',
      'lp_an__violence__abuse_or_neglect': 'Violence, abuse or neglect',
      'lp_rp__at_risk_due_to_profile': 'At risk due to profile',
      'lp_ms__marginalized_from_society_or_community': 'Marginalized from society or community',
      'lp_ls__lack_of_durable_solutions_prospects': 'Lack of durable solutions prospects',
      'lp_ap__alleged_perpetrator': 'Alleged perpetrator',
      'lp_cr__criminal_record': 'Criminal record',
      'lp_st__security_threat_to_unhcr_partner_staff_or_others': 'Security threat to UNHCR/partner staff or others',
      'lp_af__formerly_associated_with_armed_forces_or_groups': 'Formerly associated with armed forces or groups',
      'tr_pi__psychological_and_or_physical_impairment_due_to_torture': 'Psychological and/or physical impairment due to torture',
      'tr_ho__forced_to_egregious_acts': 'Forced to egregious acts',
      'tr_wv__witness_of_violence_to_other': 'Witness of violence to other',
      'sv_va__victim__survivor_of__sgbv_in_country_of_asylum': 'Victim/ survivor of SGBV in country of asylum',
      'sv_vf__victim__survivor_of__sgbv_during_flight_': 'Victim/ survivor of SGBV during flight',
      'sv_vo__victim__survivor_of__sgbv_in_country_of_origin': 'Victim/ survivor of SGBV in country of origin',
      'sv_gm__female_genital_mutilation': 'Female genital mutilation',
      'sv_hp__harmful_traditional_practices': 'Harmful traditional practices',
      'sv_hk__threat_of_honour_killing_violence': 'Threat of honour killing/violence',
      'sv_fm__forced__early_marriage_': 'Forced/ early marriage',
      'sv_ss__survival_sex_': 'Survival sex',
      'ds__disability_24ad9a9': 'Disability',
      'lp__legal_protection_2e26a58': 'Legal Protection',
      'sv__sexual_and_gender_based_violence_0fca34d': 'Sexual and Gender Based Violence',
      'tr__torture_b92f06b': 'Torture',
    };
    
    const spneed = data['specificneeds.progres_spnsubcategory2'] ? data['specificneeds.progres_spnsubcategory2'].Name : 
      data['specificneeds.progres_spncategory2'] ? data['specificneeds.progres_spncategory2'].Name : undefined; 

    let protection = [];
    protection.push(
      protectionMap[spneed]
    );
    //data.interventions.forEach(pc => protection.push(protectionMap[pc.specificneeds.progres_spncategory2.Id]));

    const languageMap = {
      English: 'language1',
      English: '_english', //to confirm
      French: '_french',
      Somali: 'language6',
    };

    let lang = [];
    lang.push(
      languageMap[data['languages.progres_languagecodeid'].Name]
        ? languageMap[data['languages.progres_languagecodeid'].Name]
        : 'other'
    );
    //data.language.forEach(l => lang.push(languageMap[l]));

    const address_current = `${data['individuals.progres_coalocationlevel1'].Name}, ${data['individuals.progres_coalocationlevel2'].Name}, ${data['individuals.progres_coalocationlevel3'].Name}, ${data['individuals.progres_coalocationlevel4'].Name}, ${data['individuals.progres_coalocationlevel5'].Name}, ${data['individuals.progres_coalocationlevel6'].Name}`;

    const body = {
      progres_interventionnumber: data.progres_interventionnumber,
      // owned_by: '',
      // service_type: data.progres_interventiontype2,
      services_section: [
        {
          service_response_day_time: data.progres_interventionstartdate,
          service_request_external: true, //Confirm primero mapping
          service_referral_notes: data.progres_comments_nonrestrictedstore, //confirm mapping
          service_request_title: data['user.title'],
          service_request_agency: data['user.progres_partner'],
          service_request_phone: data['user.mobilephone'],
          service_request_email: data['user.internalemailaddress'],
          service_referral_notes: data.progres_interventionbyother, // Reason for referral ?
          service_type: serviceMap[data.interventiontype.progres_description], //Replaces: progres_interventiontype2
          service_implementing_agency: 'UNICEF', //To confirm
          service_response_type: '', //To confirm
        },
      ],
      //closure_reason: data.progres_comments_nonrestrictedstore,
      unhcr_individual_no: data['individuals.progres_id'],
      unhcr_id_no: data['individuals.progres_id_registrationgroupid.Name'],
      name_first: data['individuals.progres_givenname'],
      name_middle: data['individuals.progres_middlename'],
      name_last: data['individuals.progres_familyname'],
      name_nickname: data['individuals.progres_id_commonyusedname'],
      date_of_birth: data['individuals.progres_dateofbirth'].split('T')[0],
      age: calculateAge(new Date(data['individuals.progres_dateofbirth'])),
      sex: data['individuals.progres_sex'],
      address_current, //TODO; Contactenate locationlevel1, 2, ...6 (comma separated)
      telephone_current: data['individuals.progres_primaryphonenumber'],
      protection_concerns: protection[0] ? protection : null, //TODO; Confirm protecton mapping works
      language: lang[0] ? lang : null, //TODO; Confirm language mapping works
      status: 'open',
      module_id: 'primero-cp', //hardcode default - to confirm
      remote: true, //hardcode default
      case_id: data.progres_primeroid ? data.progres_primeroid : undefined, // Advise on mapping
      assigned_user_names: ['unhcr_cw'],
      //created_by: 'unhcr_cw' //Confirm if we set this on update?
      //created_by_source: '', // advise on mapping
    };
    // console.log('Mapping referral data to Primero');

    console.log('data to send to Primero:', body);

    // return state;
    return getCases(
      {
        remote: true,
        case_id: data.progres_primeroid || data['individuals.progres_id'],
      },
      state => {
        console.log(state.data);
        if (state.data.length === 0) {
          return createCase({
            data: state => ({
              ...body,
              registration_date: new Date().toISOString(), // set on creation
            }),
          })(state);
        } else if (state.data.length === 1) {
          return updateCase({
            data: state => body,
          })(state);
        }
      }
    )(state);
  })
);
