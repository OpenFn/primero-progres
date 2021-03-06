each(state.data.interventions, state => {
  const { data } = state;
  const decision = {
    module_id: 'primero-cp', //Keep; TO CONFIRM WITH UNHCR
    case_id: data.progres_orgreferralid, //New mapping for case_id
    progres_interventionnumber: data.progres_interoperabilityreferralnumber, //New mapping; to confirm if this is same as inter no
    unhcr_individual_no: data.progres_individualid, //New mapping
    unhcr_id_no: data.progres_interoperabilityreferralid, //New mapping
    status: data.progres_reviewdecision==='125080000'? 'open' : //accepted 
      data.progres_reviewdecision==='125080001' ? 'closed' : undefined, //rejected //TODO: Throw error if decision not recognized?
    //closure_reason: data.progres_comments_nonrestrictedstore, //comment out for now;TO CONFIRM WITH UNHCR
    //service_referral_notes: data.progres_comments_nonrestrictedstore, //comment out for now; TO CONFIRM WITH UNHCR
    //service_type: data.progres_interventiontype2, //comment out for now; TO CONFIRM
  };
  console.log('Decision to send back to Primero:', decision);

  return getCases(
    {
      remote: true,
      case_id: data.progres_orgreferralid,
    },
    state => {
      if (state.data.length === 0) {
        throw new Error(
          `No case found in Primero for case id ${data.progres_orgreferralid}`
          //TODO: Catch error and send notification to DTP
        );
      } else if (state.data.length === 1) {
        const id = state.data[0].id;
        console.log(`Updating decision with id: ${id}.`);
        return updateCase(id, {
          data: state => decision,
        })(state);
      }
      return state;
    }
  )(state);
});
