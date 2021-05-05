alterState(state => {
    const { data } = state;
    const decision = {
        progres_interventionnumber: data.progres_interventionnumber,
        service_type: data.progres_interventiontype2,
        unhcr_individual_no: data['individuals.progres_id'],
        unhcr_id_no: data['individuals.progres_id_registrationgroupid'],
        service_referral_notes: data.progres_interventionbyother, // Reason for referral?
        status: data.progres_primerotransferstatus, //Confirm status conversion mapping
        closure_reason: data.progres_comments_nonrestrictedstore,
        service_referral_notes: data.progres_comments_nonrestrictedstore, //repeat mapping?
        module_id: 'primero-cp', //Confirm module
        id: data.progres_primeroid || data['individuals.progres_comments'], // Advise on mapping
    };

    console.log('Decision to send back to Primero:', decision);

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
                        ...decision,
                        service_response_day_time: new Date().toISOString(), // set on creation
                    }),
                })(state);
            } else if (state.data.length === 1) {
                return updateCase({
                    data: state => decision,
                })(state);
            }
        }
    )(state);
});