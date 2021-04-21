alterState(state => {
  const { data } = state;
  const calculateAge = dob => {
    const diff = Date.now() - dob.getTime();
    const age_dt = new Date(diff);

    return Math.abs(age_dt.getUTCFullYear() - 1970);
  };
  const body = {
    service_response_day_time: data.progres_interventionstartdate,
    // owned_by: '',
    progres_interventionnumber: data.progres_interventionnumber,
    // service_type: data.progres_interventiontype2,
    service_request_external: '', // No data from progres
    service_referral_notes: data.progres_comments_nonrestrictedstore,
    service_request_title: data['systemuser.title'],
    service_request_agency: data['systemuser.progres_partner'],
    service_request_phone: data['systemuser.mobilephone'],
    service_request_email: data['systemuser.internalemailaddress'],
    unhcr_individual_no: data['progres_individual.progres_id'],
    unhcr_id_no: data['progres_individual.progres_id_registrationgroupid'],
    name_first: data['progres_individual.progres_givenname'],
    name_middle: data['progres_individual.progres_middlename'],
    name_last: data['progres_individual.progres_familyname'],
    name_nickname: data['progres_individual.progres_id_commonyusedname'],
    date_of_birth: data['progres_individual.progres_dateofbirth'],
    age: calculateAge(new Date(data['progres_individual.progres_dateofbirth'])),
    sex: data['progres_individual.progres_sex'],
    address_current: '', // advise on mapping
    telephone_current: data['progres_individual.progres_primaryphonenumber'],
    protection_concerns: '', // advise on mapping
    language: '', // Field on sheet is multi-value
    service_referral_notes: data.progres_interventionbyother, // Reason for referral ?
    status: '', // advise on mapping
    closure_reason: data.progres_comments_nonrestrictedstore,
    module_id: '', // set on update
    id: data.progres_primeroid, // Advise on mapping
    service_referral_notes: '', // IS PRESENT TWICE IN THE MAPPING SHEET
    created_by: '', // advise on mapping
    created_by_source: '', // advise on mapping
    service_response_type: '', // advise on mapping
  };

  return getCases(
    {
      remote: true,
      case_id: data.progres_primeroid || data['progres_individual.progres_id'],
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
});
