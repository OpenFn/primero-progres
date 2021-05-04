alterState((state) => {
  console.log('Primero referral to send to DTP...', JSON.stringify(state.data, null, 2));
  return state; 
});

each(
  dataPath('._json[*]'),
  alterState(state => {
    const { data, configuration } = state;
    const { urlDTP, key, cert } = configuration;

    const obj = {
      progres_businessunit: 'd69e8ec1-e80b-e611-80d3-001dd8b71f12', //Dadaab UAT hardcoded GUID for testing
      progres_referraldate: '2021-04-28T19:34:43.000Z', // inside an array
      progres_requestedservice: 'documentation', // inside an array
      progres_otherrequestedservices: '', // inside an array
      progres_reasonforreferral: 'Testing for interoperability', // absent from case
      progres_organizationfrom: data.owned_by_agency_id,
      progres_orgreferredby: data.owned_by, //data.user.full_name
      progres_orgposition: data.user ? data.user.position : 'Case Worker', //TODO: Get user info from endpoint? 
      progres_orgemail: data.user ? data.user.email : 'test@primero.org',
      progres_orgphonenumber: data.user ? data.user.phone : '0790970543',
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
      progres_priority: 'High and Emergency'
      // progres_priority:
      //   risk_level && risk_level!==undefined ? 
      //   (risk_level && risk_level === 'High' ? 'High and Emergency' : undefined) : 
      //   undefined,
    };
    console.log('Mapping referral to DTP:', JSON.stringify(obj, null, 2));

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