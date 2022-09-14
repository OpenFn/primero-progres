fn(state => {
  const { host, token } = state.configuration;
  //== Logging Primero referral before we map to DTP Interoperability form
  const caseid = state.cases
    ? state.cases.map(c => c.case_id) || state.cases.id
    : undefined;
  console.log(
    '# Primero referrals to send to Progresv4/DTP :: ',
    caseid.length
  );
  console.log('Primero case id(s) :: ', caseid);
  console.log('Finding referring user contact info in Primero...');

  //== Fetching Primero user data to complete referral mappings below
  return http
    .get({
      url: `${host}/api/v2/users?per=100000&page=1`, //show ALL users
      headers: {
        Authorization: `Basic ${token}`,
      },
    })(state)
    .then(({ data }) => {
      const users = data.data;
      const cpimsAdmin = users.find(
        u => u.email === state.configuration.cpimsAdmin
      );
      console.log('Referring user contact info fetched...');
      return { ...state, users, cpimsAdmin };
    });
});

each(
  '$.cases[*]',
  fn(state => {
    console.log('Searching for unhcr service to send as referrals...');
    const { data, configuration, users, cpimsAdmin } = state;
    const { urlDTP, key, cert } = configuration;
    const { services_section } = data;

    const user = users.find(user => user.user_name === data.owned_by);

    // provide cpimsAdmin info if caseworker profile is not completed
    const cpimsAdminEmail = cpimsAdmin
      ? cpimsAdmin.email
      : 'notavailable@primero.org';
    const cpimsAdminName = cpimsAdmin ? cpimsAdmin.full_name : 'CPIMS+';
    const cpimsAdminPhone = cpimsAdmin ? cpimsAdmin.phone : '0000000000';
    const cpimsAdminPosition = 'CPIMS+ Administrator';

    const serviceMap = {
      alternative_care: 'Alternative Care',
      focuses_non_specialized_mhpss_care: 'Child Protection Service',
      food: 'Family Reunification Service',
      security_e_g_safe_shelter: 'Safehouse Service',
      education_formal: 'Psychosocial Service',
      non_formal_education: 'Police/Other Service',
      family_tracing_and_reunification: 'Legal Assistance Service',
      basic_psychosocial_support: 'Livelihoods Service',
      specialized_mhpss_services: 'Family Mediation Service',
      non_food_items: 'Education Service',
      cash_assistance: 'NFI/Clothes/Shoes Service',
      livelihoods: 'Water/Sanitation Service',
      medical: 'Registration Service',
      nutrition: 'Food Service',
      legal_support: 'Adolescent and Youth Empowerment',
      documentation: 'Early Childhood Service',
      services_for_children_with_disabilities: 'Other Service',
      sexual_and_reproductive_health: 'Sexual and reproductive health',
      shelter: 'Shelter',
      wash: 'WASH',
      durable_solution_in_coordination_with_unhcr:
        'Durable solution (in coordination with UNHCR)',
      relocation: 'Relocation',
      other_please_specify: 'Other',
    };
    state.serviceMap = serviceMap;

    const languageMap = {
      language1: 'Anyuak',
      language2: 'Nuer',
      language3: 'Dinka',
      language4: 'Bari',
      language5: 'Amharic',
      language6: 'Other',
      language7: 'Bembe',
      language8: 'Somali',
      language10: 'Acholi',
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

    const referrals = [];

    //== For every 1 Primero service, send 1 DTP referral =======//
    return each(services_section, state => {
      const service = state.data;

      //===============================================================================//
      //=== Mappings for Primero referral --> Progres v4 ==============================//
      const referralMapping = {
        //== Fields pulled from Primero user - defined in case.owned_by =======//
        //== Default to sending the CPIMS Admin details if caseworker info not available ==//
        primero_user: data.owned_by,
        position: user && user.position ? user.position : cpimsAdminPosition,
        email: user && user.email ? user.email : cpimsAdminEmail,
        phone: user && user.phone ? user.phone : cpimsAdminPhone,
        full_name: user && user.full_name ? user.full_name : cpimsAdminName,
        //=================================================================//
        request_type: 'ReceiveIncomingReferral',
        service_implementing_agency: 'UNICEF',
        //service_implementing_agency: 'ProGres - Testing', //TODO: USE MAPPING BELOW FOR GO-LIVE
        // service_implementing_agency:
        //   service.service_implementing_agency === 'UNHCR'
        //     ? 'UNICEF'
        //     : service.service_implementing_agency,
        service_response_day_time: service.service_response_day_time,
        service_type: serviceMap[service.service_type],
        service_type_other: service.service_type_other
          ? service.service_type_other
          : null,
        service_referral_notes: service.service_referral_notes
          ? service.service_referral_notes
          : 'Primero referral',
        owned_by_agency_id: 'UNICEF', //E.g., UNICEF, Save the Children International
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
        language: lang[0] ? lang.join(', ') : null, //e.g., 'language1,language2'
        id: `${data.case_id}#${service.unique_id.substr(-12)}`,
      };
      //===== End of referral mapping ================================================//

      const shortid = data.case_id_display;
      const recordid = referralMapping.id;
      console.log(
        'Mapping Primero data to DTP for referral with id: ',
        recordid
      );
      console.log('case_id_display:', shortid);

      //=== Here we send the referrals to DTP ======///
      return http
        .post({
          url: urlDTP,
          data: referralMapping,
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
          const safeError = error;
          safeError.config = '***';
          safeError.request = '***';
          safeError.response = {
            ...safeError.response,
            config: '***',
            request: '***',
          };
          throw safeError;
        });
      return state;
    })(state);
  })
);
