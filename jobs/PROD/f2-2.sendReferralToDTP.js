fn(state => {
  const { host, token } = state.configuration;
  //== Logging Primero referral before we map to DTP Interoperability form
  console.log(
    'Primero referral to send to DTP...',
    JSON.stringify(state.data, null, 2)
  );

  //== Fetching Primero user data to complete referral mappings below
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
  fn(state => {
    console.log('Creating referral for each unhcr service...');
    const { data, configuration, users } = state;
    const { urlDTP, key, cert } = configuration;
    const { services_section } = data;

    const user = users.find(user => user.user_name === data.owned_by);

    //TODO: Confirm mappings
    const serviceMap = {
      alternative_care: 'Alternative Care',
      focuses_non_specialized_mhpss_care: 'Child Protection Service',
      food: 'Family Reunification Service',
    };
    state.serviceMap = serviceMap;

    //TODO: Confirm mappings
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
      statelessness: 'DS-PM',
      arrested_detained: 'DS-PS',
      disabled: 'DS-MM',
      serious_health_issue: 'DS-MS',
      caafag: 'DS-SD',
      street_child: 'SM-MI',
      child_mother: 'SM-MN',
      living_with_vulnerable_person: 'SM-DP',
      worst_forms_of_child_labor: 'SM-CI',
      child_headed_household: 'SM-CC',
      mentally_distressed: 'SM-OT',
      emotional_abuse: 'SM-AD',
      child_neglect: 'FU-TR',
      physical_abuse: 'FU-FR',
      sgbv__rape_sodomy: 'LP-ND',
      sgbv__physical_assault: 'LP-BN',
      sgbv__sexual_assault: 'LP-NA',
      sgbv__child_marriage: 'LP-MM',
      sgbv__sex_for_goods_services: 'LP-MD',
      sgbv__teenage_pregnancy: 'LP-RR',
      sgbv__psychological_emotional_abuse: 'LP-RD',
      sgbv__fgm: 'LP-DA',
      sgbv__commercial_sexual_exploitation: 'LP-DO',
      lp_dt__detained_held_elsewhere_f8f8d21: 'LP-DT',
      lp_ih__in_hiding_a554ced: 'LP-IH',
      lp_wp__absence_of_witness_protection_89f64dc: 'LP-WP',
      lp_an__violence__abuse_or_neglect_b424522: 'LP-AN',
      lp_rp__at_risk_due_to_profile_fb7c70c: 'LP-RP',
      lp_ms__marginalized_from_society_or_community_e07cb83: 'LP-MS',
      lp_ls__lack_of_durable_solutions_prospects_f9e8a11: 'LP-LS',
      lp_ap__alleged_perpetrator_db9e2f5: 'LP-AP',
      lp_cr__criminal_record_5a18ced: 'LP-CR',
      lp_st__security_threat_to_unhcr_partner_staff_or_others_28d5c9c: 'LP-ST',
      lp_af__formerly_associated_with_armed_forces_or_groups_ac746df: 'LP-AF',
      tr_pi__psychological_and_or_physical_impairment_due_to_torture_be29dff:
        'TR-PI',
      tr_ho__forced_to_egregious_acts_ff05b1c: 'TR-HO',
      tr_wv__witness_of_violence_to_other_74e79f8: 'TR-WV',
      sv_va__victim__survivor_of__sgbv_in_country_of_asylum_5422ac9: 'SV-VA',
      sv_vf__victim__survivor_of__sgbv_during_flight__64638f7: 'SV-VF',
      sv_vo__victim__survivor_of__sgbv_in_country_of_origin_a3f9c27: 'SV-VO',
      sv_gm__female_genital_mutilation_132d9d6: 'SV-GM',
      sv_hp__harmful_traditional_practices_c68c552: 'SV-HP',
      sv_hk__threat_of_honour_killing_violence_e3b4fbb: 'SV-HK',
      sv_fm__forced__early_marriage__b1a8ba0: 'SV-FM',
      sv_ss__survival_sex__0a5cc10: 'SV-SS',
    };

    //TODO: Confirm mappings
    const languageMap = {
      language1: 'Anyuak',
      language2: 'Nuer',
      language3: 'Dinka',
      language4: 'Shuluk',
      murle_fce1c91: 'Murle',
      if_other_language__please_specify_335944b: 'Other',
      _amharic: 'Amharic',
      _arabic: 'Arabic',
      _boma: 'Boma',
      _didinga: 'Didinga',
      _english: 'English',
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
    };

    let lang = [];
    data.language
      ? data.language.forEach(l => lang.push(languageMap[l]))
      : lang.push(languageMap['language6']);

    let protection = [];
    data.protection_concerns
      ? data.protection_concerns.forEach(pc =>
          protection.push(protectionMap[pc])
        )
      : protection.push(protectionMap['physical_abuse_violence']);

    const referrals = [];

    //== For every 1 Primero service, send 1 DTP referral =======//
    return each(services_section, state => {
      const service = state.data;

      //===============================================================================//
      //=== Mappings for Primero referral --> Progres v4 ==============================//
      const referralMapping = {
        //== Fields pulled from Primero user - defined in case.owned_by =======//
        primero_user: data.owned_by,
        position: user && user.position ? user.position : 'Case Worker', //Hardcoded defaults for testing if user profile not filled
        email: user && user.email ? user.email : 'test@primero.org',
        phone: user && user.phone ? user.phone : '0790970543',
        full_name: user && user.full_name ? user.full_name : 'Primero CP',
        //=================================================================//
        request_type: 'ReceiveIncomingReferral',
        service_implementing_agency:
          service.service_implementing_agency === 'UNHCR'
            ? 'UNICEF'
            : service.service_implementing_agency, //TODO: Discuss Primero config w/ Robert
        service_response_day_time: service.service_response_day_time,
        service_type: serviceMap[service.service_type], //Alternative Care
        service_type_other: service.service_type_other
          ? service.service_type_other
          : null,
        service_referral_notes: service.service_referral_notes
          ? service.service_referral_notes
          : 'Primero referral',
        owned_by_agency_id: 'UNICEF', //data.owned_by_agency_id, //E.g., : UNICEF, Save the Children International
        unhcr_individual_no: data.unhcr_individual_no,
        unhcr_id_no: data.unhcr_id_no,
        name_first: data.name_first,
        name_last: data.name_last,
        name_middle: data.name_middle ? data.name_middle : null,
        name_nickname: data.name_nickname ? data.name_nickname : null,
        date_of_birth: data.date_of_birth
          ? new Date(data.date_of_birth).toISOString().split('T')[0]
          : undefined,
        sex:
          data.sex === 'unknown_4b34795'
            ? 'unknown'
            : data.sex === 'other_b25f252'
            ? 'other'
            : data.sex,
        address_current: data.address_current,
        telephone_current: data.telephone_current
          ? data.telephone_current.toString()
          : null,
        protection_concerns: protection[0] ? protection : null, //e.g., 'CR-AF'
        protection_concerns_other: data.protection_concerns_other
          ? data.protection_concerns_other
          : null,
        language: lang[0] ? lang.join(', ') : null, //language1,language2
        id: `${data.case_id}#${service.unique_id.substr(-12)}`,
      };
      //===== End of referral mapping ================================================//

      const shortid = data.case_id_display;
      console.log(
        'Mapping referral data to DTP:',
        JSON.stringify(referralMapping, null, 2)
      );
      console.log('case_id_display:', shortid);

      //=== Here we send the referrals to DTP ======///
      return http
        .post({
          url: urlDTP,
          data: referralMapping, //mapped referral obj,
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
          console.log('Response uploaded to DTP/Progres.');
          return state;
        })
        .catch(error => {
          let newError = error;
          newError.config = 'REDACTED';
          throw newError;
        });
      return state;
    })(state);
  })
);
