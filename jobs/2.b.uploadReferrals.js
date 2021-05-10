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
      alternative_care: 'BIA', //TESTING: DO NOT USE
      security: 'Protection',
      education: 'Education',
      non_formal_education: 'Education',
      family_tracing_and_reunification: 'BIA', //TESTING: DO NOT USE
      basic_psychosocial_support: 'Psycho-social Assistance',
      focused_non_specialized_mhpss_care: 'Health Assistance',
      specialized_mhpss_services: 'Health Assistance',
      food: 'Food Assistance',
      non_food_items: 'CRI Assistance',
      cash_assistance: 'Cash Assistance',
      Livelihoods: 'livelihoods',
      medical: 'Health Assistance',
      nutrition: 'Health Assistance',
      legal_support: 'Legal Aid',
      documentation: 'Documentation',
      services_for_children_with_disabilities: 'BIA', //TESTING: DO NOT USE
      sexual_and_reproductive_health: 'Health Assistance',
      shelter: 'Accomodation',
      wash: 'Other',
      durable_solution: 'Other',
      relocation: 'Protection',
      other_please_specify: 'Other',
    };
    state.serviceMap = serviceMap;

    //TODO: Not sure this map is implemented correctly, but here are the mappings...
    const protectionMap = {
      unaccompanied: 'SC-UC',
      sm_ad__addiction: 'SM-AD',
      vision: 'DS-V',
    };

    //TODO: Not sure this map is implemented correctly, but here are the mappings...
    const languageMap = {
      _english: 'English',
      _french: 'French',
      language6: 'Somali',
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
        protection_concerns: protection[0] ? protection.join(', ') : null,
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
