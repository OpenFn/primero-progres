each(
  '$._json[*]',
  alterState(state => {
    const { data, configuration } = state;
    const { urlDTP, key, cert } = configuration;

    const obj = {
      progres_businessunit: '', // inside an array
      progres_referraldate: '', // inside an array
      progres_requestedservice: '', // inside an array
      progres_otherrequestedservices: '', // inside an array
      progres_reasonforreferral: '', // absent from case
      progres_organizationfrom: data.owned_by_agency_id,
      progres_orgreferredby: data.user.full_name,
      progres_orgposition: data.user.position,
      progres_orgemail: data.user.email,
      progres_orgphonenumber: data.user.phone,
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
      progres_spneedcategory: '', // Advise on mapping
      progres_otherprotectionconcerns: data.protection_concerns_other,
      progres_comments: '', // field present multiple times
      progres_primerotransferstatus: '', // inside an array
      progres_comments: '', // field present multiple times
      progres_orgreferralid: data.id,
      progres_priority:
        risk_level === 'High' ? 'High and Emergency' : risk_level,
    };

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
        console.log('Response uploaded to DTP/Progres.');
        return state;
      });
  })
);