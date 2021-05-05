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
    console.log('here');
    const { data, configuration, users } = state;
    const { urlDTP, key, cert } = configuration;
    const { services_section } = data;

    const user = users.find(user => user.user_name === data.owned_by);
    // console.log('user', user);

    services_section.forEach(service => {
      const obj = {
        // progres_businessunit: 'd69e8ec1-e80b-e611-80d3-001dd8b71f12', //Dadaab UAT hardcoded GUID for testing
        progres_businessunit: service.service_implementing_agency, //Dadaab UAT hardcoded GUID for testing
        // progres_referraldate: '2021-04-28T19:34:43.000Z', // inside an array
        progres_referraldate: service.service_response_day_time, // inside an array
        // progres_requestedservice: 'documentation', // inside an array
        progres_requestedservice: service.service_type, // inside an array
        // progres_otherrequestedservices: '', // inside an array
        progres_otherrequestedservices: service.service_type_other, // inside an array
        // progres_reasonforreferral: 'Testing for interoperability',
        progres_reasonforreferral: service.service_referral_notes,
        progres_organizationfrom: data.owned_by_agency_id,
        progres_orgreferredby: data.owned_by, //data.user.full_name
        progres_orgposition: user ? user.position : 'Case Worker', //TODO: Get user info from endpoint?
        progres_orgemail: user ? user.email : 'test@primero.org',
        progres_orgphonenumber: user ? user.phone : '0790970543',
        progres_unhcrid: data.unhcr_individual_no,
        progres_pocotheridnumber: data.unhcr_id_no,
        progres_pocfirstname: data.name_first,
        progres_pocmiddlename: data.name_middle,
        progres_poclastname: data.name_last,
        progres_comments: data.name_nickname,
        progres_pocdateofbirth: new Date(data.date_of_birth),
        progres_pocsex: data.sex,
        progres_pocaddress: data.address_current,
        progres_pocphonenumber: data.telephone_current,
        progres_spneedcategory: 'DS-SC', // Advise on mapping
        progres_otherprotectionconcerns: data.protection_concerns_other,
        progres_primerotransferstatus: '', // inside an array
        progres_comments: 'English', // field present multiple times
        progres_orgreferralid: data.id,
        progres_priority: 'High and Emergency',
        // progres_priority:
        //   risk_level && risk_level!==undefined ?
        //   (risk_level && risk_level === 'High' ? 'High and Emergency' : undefined) :
        //   undefined,
      };
      console.log('Mapping referral to DTP:', JSON.stringify(obj, null, 2));
    });

    // return state;
    return http
      .post({
        url: urlDTP,
        data: obj,
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
