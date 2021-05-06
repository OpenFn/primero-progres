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
    // console.log('user', user);

    //====================================================================================================//
    //==== UPDATE: We now map the Primero Ids for DTP to map to the Progres fields ======================// 
    const referrals = [];
    services_section.forEach(service => {
      const obj = {
        service_implementing_agency: 'UNICEF', //TODO: Update dynamically? service.service_implementing_agency,
        // service_response_day_time: '2021-04-28T19:34:43.000Z', // inside an array
        service_response_day_time: service.service_response_day_time, // inside an array
        service_type: 'Documentation',
        //service_type: service.service_type, // inside an array
        // service_type_other: '', // inside an array
        service_type_other: service.service_type_other, // inside an array
        // progres_reasonforreferral: 'Testing for interoperability',
        service_referral_notes: service.service_referral_notes,
        owned_by_agency_id: data.owned_by_agency_id,
        primero_user: data.owned_by,
        position: user.position ? user.position : 'Case Worker',
        email: user.email ? user.email : 'test@primero.org',
        phone: user.phone ? user.phone : '0790970543',
        full_name: user ? user.full_name : 'Primero CP',
        unhcr_individual_no: data.unhcr_individual_no,
        unhcr_id_no: data.unhcr_id_no,
        name_first: data.name_first,
        name_middle: null,
        //name_middle: data.name_middle,
        name_last: data.name_last,
        name_nickname: data.name_nickname,
        date_of_birth: new Date(data.date_of_birth).toISOString().substring(0, 10),
        sex: data.sex,
        address_current: data.address_current,
        telephone_current: data.telephone_current,
        protection_concerns: 'CR-AF', //Hardcoded sample
        //=======TODO: Update maping per specs for progres_spneedcategory ================//
        //protection_concerns: '', 
        protection_concerns_other: null, //TODO: Should we default null if no value
        //protection_concerns_other: data.protection_concerns_other,
        //status: data.status, //QUESTION: To map at this stage? 
        language: 'English',
        //language: data.language ? data.language.join(",") : data.language, //QUESTION: Test data? 
        id: data.case_id,
        //=======TODO: Update maping per specs for progres_priority ================//
        risk_level: 'Normal' //TODO: default to Normal if no other value provided
        // risk_level:
        //   risk_level && risk_level!==undefined ?
        //     (risk_level && risk_level === 'High' ? 'High and Emergency' : undefined) :
        //     'High and Emergency',
      };
      //console.log('Mapping referral data to DTP');
      //console.log('Mapping referral data to DTP:', JSON.stringify(obj, null, 2));
      referrals.push(obj);
    });
    //console.log('referrals...', JSON.stringify(referrals, null, 2));

    const referral1 = referrals[0]; //TODO: Send each referral via a separate request to DTP
    console.log('Referral to upload to DTP...', JSON.stringify(referral1, null, 2));
    return http
      .post({
        url: urlDTP,
        data: referral1, //TODO: Send 1 http request for each referral, not just 1 referral - see L80 
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
        console.log(JSON.stringify(state.data, null, 2));
        console.log('Response uploaded to DTP/Progres.');
        return state;
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


