each(
  dataPath('interventions[*]'),
  alterState(state => {
    const { data } = state;

    const calculateAge = dob => {
      const diff = Date.now() - dob.getTime();
      const age_dt = new Date(diff);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    };

    const body = {
      progres_interventionnumber: data.progres_interventionnumber,
      // owned_by: '',
      // service_type: data.progres_interventiontype2,
      services_section: [
        {
          service_response_day_time: data.progres_interventionstartdate,
          service_request_external: '', // No data from progres
          service_referral_notes: data.progres_comments_nonrestrictedstore,
          service_request_title: data['systemuser.title'],
          service_request_agency: data['systemuser.progres_partner'],
          service_request_phone: data['systemuser.mobilephone'],
          service_request_email: data['systemuser.internalemailaddress'],
          service_referral_notes: data.progres_interventionbyother, // Reason for referral ?
          service_response_type: '', // advise on mapping
        },
      ],
      closure_reason: data.progres_comments_nonrestrictedstore,
      unhcr_individual_no: data['individuals.progres_id'],
      unhcr_id_no: data['individuals.progres_id_registrationgroupid.Name'],
      name_first: data['individuals.progres_givenname'],
      name_middle: data['individuals.progres_middlename'],
      name_last: data['individuals.progres_familyname'],
      name_nickname: data['individuals.progres_id_commonyusedname'],
      date_of_birth: data['individuals.progres_dateofbirth'].split('T')[0],
      age: calculateAge(new Date(data['individuals.progres_dateofbirth'])),
      sex: data['individuals.progres_sex'],
      address_current: '', // advise on mapping
      telephone_current: data['individuals.progres_primaryphonenumber'],
      protection_concerns: '', // advise on mapping
      language: [], // Field on sheet is multi-value
      status: 'open', // advise on mapping
      module_id: 'primero-cp', //hardcode default
      remote: true, //hardcode default
      id: data.progres_primeroid || data['individuals.progres_id'], // Advise on mapping
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
