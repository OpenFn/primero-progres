alterState(state => {
  console.log('Primero referral to send to DTP...');
  const { host, token } = state.configuration;
  //console.log('Primero referral to send to DTP...', JSON.stringify(state.data, null, 2));
  return http
    .get({
      url: `${host}/api/v2/users`,
      headers: {
        Authorization: `Basic ${token}`,
      },
    })(state)
    .then(({ data }) => {
      const users = data.data;
      return { ...state, users };
    });
});

each(
  dataPath('._json[*]'),
  alterState(state => {
    console.log('Creating referral for each unhcr service...');
    const { data, configuration, users } = state;
    const { urlDTP, key, cert } = configuration;
    const { services_section } = data;

    const user = users.find(user => user.user_name === data.owned_by);
    console.log('user', user);

    //TODO: Not sure this map is implemented correctly, but here are the mappings...
    const serviceMap = {
      alternative_care: 'Protection',
      security_e_g_safe_shelter: 'Protection',
      education_formal: 'Health Assistance',
      non_formal_education: 'Psycho-social Assistance',
      family_tracing_and_reunification: 'Livelihoods',
      basic_psychosocial_support: 'Skills Training',
      focuses_non_specialized_mhpss_care: 'BID / BIA conducted',
      specialized_mhpss_services: 'Protection',
      food: 'Protection',
      non_food_items: 'Education',
      cash_assistance: 'CRI Assistance',
      livelihoods: 'Other',
      medical: 'Other',
      nutrition: 'Registration',
      legal_support: 'Food Assistance',
      documentation: 'Cash Assistance',
      services_for_children_with_disabilities: 'Advocacy',
      sexual_and_reproductive_health: 'Protection',
      shelter: 'Legal / Protection Counselling',
      wash: 'Law Enforcement (police / security)',
      durable_solution_in_coordination_with_unhcr: 'Legal Aid',
      relocation: 'Other',
      other_please_specify: 'Food Assistance',
      communication_service: 'Other',
      camp_coordination_and_management_service: 'Other',
      energy_service: 'Other',
      other: 'Shelter Assistance',
      // alternative_care: 'BIA', //TESTING: DO NOT USE
      // security: 'Protection',
      // education: 'Education',
      // non_formal_education: 'Education',
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

    //TODO: Not sure this map is implemented correctly, but here are the mappings...
    const protectionMap = {
      physical_abuse_violence: 'DS-LBM',
      sexual_abuse_violence: 'DS-UBM',
      rape: 'DS-V',
      emotional_or_psychological: 'DS-H',
      neglect: 'DS-C',
      abandonment: 'DS- EB',
      child_labour: 'DS-RC',
      hazardous_work: 'DS-SC',
      sexual_exploitation: 'CR',
      slavery_sale_abduction: 'CR-CP',
      in_conflict_with_the_law: 'CR-CS',
      associated_with_armed: 'CR-CC',
      deprived_of_liberty: 'CR-TP',
      serious_medical_condition: 'CR-LW',
      functional_difficulty_seeing: 'CR-LO',
      functional_difficulty_hearing: 'CR-NE',
      functional_difficulty_walking: 'CR-SE',
      functional_difficulty_remembering: 'CR-AF',
      difficulty_with_self_care: 'CR-CL',
      difficulty_communicating: 'SC-SC',
      unaccompanied: 'SC-UC',
      separated: 'SC-CH',
      orphan: 'SC-IC',
      psychosocial_distress: 'SC-FC',
      mental_disorder: 'WR-WR',
      substance_abuse: 'WR-SF',
      belongs_to_marginalised: 'WR-LC',
      lack_of_documentation_birth_registration: 'ER-NF',
      child_marriage: 'ER-MC',
      female_genital_mutilation_fgm: 'ER-FR',
      pregnancy_child_parent: 'SP-PT',
      denial_of_resources_opportunities_or_services: 'SP-GP',
      highly_vulnerable_care: 'SP-CG',
      child_survivor_of_explosive: 'DS-BD',
      other: 'DS-DF',
      ds_pm__physical_disability___moderate: 'DS-PM',
      ds_ps__physical_disability___severe: 'DS-PS',
      ds_mm__mental_disability___moderate: 'DS-MM',
      ds_ms__mental_disability___severe: 'DS-MS',
      ds_sd__speech_impairment_disability: 'DS-SD',
      sm_mi__mental_illness: 'SM-MI',
      sm_mn__malnutrition: 'SM-MN',
      sm_dp__difficult_pregnancy: 'SM-DP',
      sm_ci__chronic_illness: 'SM-CI',
      sm_cc__critical_medical_condition: 'SM-CC',
      sm_ot__other_medical_condition: 'SM-OT',
      sm_ad__addiction: 'SM-AD',
      fu_tr__tracing_required: 'FU-TR',
      fu_fr__family_reunification_required: 'FU-FR',
      lp_nd__no_legal_documentation: 'LP-ND',
      lp_bn__unmet_basic_needs_: 'LP-BN',
      lp_na__no_acces_to_services: 'LP-NA',
      lp_mm__mixed_marriage: 'LP-MM',
      lp_md__multiple_displacements: 'LP-MD',
      lp_rr__at_risk_of_refoulement: 'LP-RR',
      lp_rd__at_risk_of_removal_: 'LP-RD',
      lp_da__detained_held_in_country_of_asylum: 'LP-DA',
      lp_do__detained_held_in_country_of_origin: 'LP-DO',
      lp_dt__detained_held_elsewhere: 'LP-DT',
      lp_ih__in_hiding: 'LP-IH',
      lp_wp__absence_of_witness_protection: 'LP-WP',
      lp_an__violence__abuse_or_neglect: 'LP-AN',
      lp_rp__at_risk_due_to_profile: 'LP-RP',
      lp_ms__marginalized_from_society_or_community: 'LP-MS',
      lp_ls__lack_of_durable_solutions_prospects: 'LP-LS',
      lp_ap__alleged_perpetrator: 'LP-AP',
      lp_cr__criminal_record: 'LP-CR',
      lp_st__security_threat_to_unhcr_partner_staff_or_others: 'LP-ST',
      lp_af__formerly_associated_with_armed_forces_or_groups: 'LP-AF',
      tr_pi__psychological_and_or_physical_impairment_due_to_torture: 'TR-PI',
      tr_ho__forced_to_egregious_acts: 'TR-HO',
      tr_wv__witness_of_violence_to_other: 'TR-WV',
      sv_va__victim__survivor_of__sgbv_in_country_of_asylum: 'SV-VA',
      sv_vf__victim__survivor_of__sgbv_during_flight_: 'SV-VF',
      sv_vo__victim__survivor_of__sgbv_in_country_of_origin: 'SV-VO',
      sv_gm__female_genital_mutilation: 'SV-GM',
      sv_hp__harmful_traditional_practices: 'SV-HP',
      sv_hk__threat_of_honour_killing_violence: 'SV-HK',
      sv_fm__forced__early_marriage_: 'SV-FM',
      sv_ss__survival_sex_: 'SV-SS',
      ds__disability_24ad9a9: 'DS',
      lp__legal_protection_2e26a58: 'LP',
      sv__sexual_and_gender_based_violence_0fca34d: 'SV',
      tr__torture_b92f06b: 'TR',
      // unaccompanied: 'SC-UC',
      // sm_ad__addiction: 'SM-AD',
      // vision: 'DS-V',
    };

    //TODO: Not sure this map is implemented correctly, but here are the mappings...
    const languageMap = {
      _amharic: 'Amharic',
      _arabic: 'Arabic',
      _boma: 'Boma',
      _didinga: 'Didinga',
      _french: 'French',
      _karamojong: 'Karamojong',
      _kifulero: 'Fuliiru, Kifulero',
      _kikongo: 'Kikongo',
      _kinyabiyisha: 'Kinyabwisha',
      _kinyarwanda: 'Rwanda, Kinyarwanda',
      _kirundi: 'Rundi, Kirundi',
      _lingala: 'Lingala',
      _lokoya: 'Lokoya',
      _lopit: 'Lopit',
      _luo: 'Luo',
      _makonde: 'Makonde',
      _mashi: 'Mashi',
      _moro: 'Moro',
      _murle: 'Murle',
      _oromo: 'Oromo',
      _sign_language: 'Sign Language',
      _tira: 'Tira',
      _toposa: 'Toposa',
      _toro: 'Toro',
      language1: 'Swahili',
      language10: 'Acholi',
      language2: 'Dinka',
      language3: 'Nuer',
      language4: 'Bari',
      language5: 'Zande',
      language6: 'English',
      language7: 'Bembe',
      language8: 'Somali',
      if_other_language__please_specify_335944b: 'Other',
      // _english: 'English',
      // _french: 'French',
      // language6: 'Somali',
      // language1: 'English',
      // language8: 'English'
    };

    let lang = [];
    data.language.forEach(l => lang.push(languageMap[l]));

    let protection = [];
    data.protection_concerns.forEach(pc => protection.push(protectionMap[pc]));

    //====================================================================================================//
    //==== UPDATE: We now map the Primero Ids for DTP to map to the Progres fields ======================//
    const referrals = [];
    services_section.forEach(service => {
      const obj = {
        request_type: 'ReceiveIncomingReferral',
        service_implementing_agency: data.created_organization, //TODO: Update after country selection?
        service_response_day_time: service.service_response_day_time,
        // service_type: 'Documentation', //Hardcoded sample
        service_type: serviceMap[service.service_type], //Hardcoded sample
        //=======TODO: Update maping per specs for Service Mapping ================//
        //service_type: state.serviceMap[service.service_type], //GET THIS TO WORK; see L30
        service_type_other: service.service_type_other
          ? service.service_type_other
          : null,
        service_referral_notes: service.service_referral_notes,
        owned_by_agency_id: data.owned_by_agency_id,
        primero_user: data.owned_by,
        position: user
          ? user.position
            ? user.position
            : 'Case Worker'
          : data.owned_by_position, //Hardcoded defaults for testing
        email: user
          ? user.email
            ? user.email
            : 'test@primero.org'
          : data.owned_by_email,
        phone: user
          ? user.phone
            ? user.phone
            : '0790970543'
          : data.owned_by_phone,
        full_name: user
          ? user.full_name
            ? user.full_name
            : 'Primero CP'
          : data.owned_by_full_name,
        unhcr_individual_no: data.unhcr_individual_no,
        unhcr_id_no: data.unhcr_id_no,
        name_first: data.name_first,
        name_last: data.name_last,
        name_middle: data.name_middle ? data.name_middle : null,
        name_nickname: data.name_nickname ? data.name_nickname : null,
        date_of_birth: new Date(data.date_of_birth)
          .toISOString()
          .substring(0, 10),
        sex: data.sex,
        address_current: data.address_current,
        telephone_current: data.telephone_current,
        // protection_concerns: 'CR-AF', //Hardcoded sample
        protection_concerns: protection[0] ? protection : null,
        //=======TODO: Update maping per specs for progres_spneedcategory ================//
        //protection_concerns: state.protectionMap[data.protection_concerns], //GET THIS TO WORK; see L58
        protection_concerns_other: data.protection_concerns_other
          ? data.protection_concerns_other
          : null, //TODO: Should we default null if no value
        // language: 'English',
        //=======TODO: Clean languages in array like '[english, somali]' => return as 'English, Somali' ================//
        language: lang[0] ? lang.join(', ') : null, //SEE L66 for languageMap
        id: data.case_id,
        risk_level: 'Normal', //TBD: default to Normal if no other value provided?
        //=======TODO: Update maping per specs for progres_priority after country selected ============//
        // risk_level:
        //   risk_level && risk_level!==undefined ?
        //     (risk_level && risk_level === 'High' ? 'High and Emergency' : undefined) :
        //     'High and Emergency',
      };
      //console.log('Mapping referral data to DTP');
      console.log(
        'Mapping referral data to DTP:',
        JSON.stringify(obj, null, 2)
      );
      referrals.push(obj);
    });
    //console.log('referrals...', JSON.stringify(referrals, null, 2));

    //====TODO: Confirm each referral is sent via a separate request to DTP ========================//
    // console.log(
    //   'Referral to upload to DTP...',
    //   JSON.stringify(referrals, null, 2)
    // );
    const referrals1 = referrals[0]; //TODO: UPDATE TO ONLY SEND 1

    return http
      .post({
        url: urlDTP,
        data: referrals1, //referrals,
        headers: {
          'Ocp-Apim-Subscription-Key':
            configuration['Ocp-Apim-Subscription-Key'],
        },
        agentOptions: {
          key,
          cert,
        },
      })(state)
      .then(() => {
        //console.log(JSON.stringify(state.data, null, 2));
        console.log('Response uploaded to DTP/Progres.');
        return state;
      })
      .catch(error => {
        let newError = error;
        newError.config = 'REDACTED';
        throw newError;
      });
  })
);

//==== LEGACY MAPPINGS ===============================================================================//
//==== UPDATE: We no longer provide Progres Ids, but rather the Primero Ids for DTP to map ===========//
//   const obj = {
//     // progres_businessunit: 'd69e8ec1-e80b-e611-80d3-001dd8b71f12', //Dadaab UAT hardcoded GUID for testing
//     progres_businessunit: service.service_implementing_agency, //Dadaab UAT hardcoded GUID for testing
//     // progres_referraldate: '2021-04-28T19:34:43.000Z', // inside an array
//     progres_referraldate: service.service_response_day_time, // inside an array
//     // progres_requestedservice: 'documentation', // inside an array
//     progres_requestedservice: service.service_type, // inside an array
//     // progres_otherrequestedservices: '', // inside an array
//     progres_otherrequestedservices: service.service_type_other, // inside an array
//     // progres_reasonforreferral: 'Testing for interoperability',
//     progres_reasonforreferral: service.service_referral_notes,
//     progres_organizationfrom: data.owned_by_agency_id,
//     progres_orgreferredby: data.owned_by, //data.user.full_name
//     progres_orgposition: user ? user.position : 'Case Worker', //TODO: Get user info from endpoint?
//     progres_orgemail: user ? user.email : 'test@primero.org',
//     progres_orgphonenumber: user ? user.phone : '0790970543',
//     progres_unhcrid: data.unhcr_individual_no,
//     progres_pocotheridnumber: data.unhcr_id_no,
//     progres_pocfirstname: data.name_first,
//     progres_pocmiddlename: data.name_middle,
//     progres_poclastname: data.name_last,
//     progres_comments: data.name_nickname,
//     progres_pocdateofbirth: new Date(data.date_of_birth),
//     progres_pocsex: data.sex,
//     progres_pocaddress: data.address_current,
//     progres_pocphonenumber: data.telephone_current,
//     progres_spneedcategory: 'DS-SC', // Advise on mapping
//     progres_otherprotectionconcerns: data.protection_concerns_other,
//     progres_primerotransferstatus: '', // inside an array
//     progres_comments: 'English', // field present multiple times
//     progres_orgreferralid: data.id,
//     progres_priority: 'High and Emergency',
//     // progres_priority:
//     //   risk_level && risk_level!==undefined ?
//     //   (risk_level && risk_level === 'High' ? 'High and Emergency' : undefined) :
//     //   undefined,
//   };
//   console.log('Mapping referral to DTP:', JSON.stringify(obj, null, 2));
// });
//====================================================================================================//
