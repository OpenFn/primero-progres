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
      'services_for_children_with_disabilities': 'Advocacy / Direct intervention'
      // 'a8b00885-b3c3-e611-80ca-00155d340529': 'security', // mapping should be like  {[valueInSampleDAta]: 'valueToUpload'}
      // alternative_care: 'BIA', //TESTING: DO NOT USE
      security: 'Protection',
      education: 'Education',
      non_formal_education: 'Education',
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
      'a1c5b4fb-8f76-e611-80c9-00155d340529': 'sexual_exploitation', //CR
      'a3c5b4fb-8f76-e611-80c9-00155d340529': 'slavery_sale_abduction', //DS
      'DS-V': 'in_conflict_with_the_law', //CR-CS
    };

    let protection = [];
    protection.push(
      protectionMap[data['specificneeds.progres_spncategory2'].Id]
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
