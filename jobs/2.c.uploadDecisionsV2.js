each(state.data.interventions, state => {
  const { data } = state;
  console.log('Decision received for progres intervention id: ', data.progres_orgreferralid);
  const case_id = data.progres_orgreferralid.split('#')[0];
  const service_id = data.progres_orgreferralid.split('#')[1];

  const findReferral = (referrals, service_id) => {
    const referral = referrals.find(
      referral => referral.service_record_id.substr(-12) === service_id
    );
    return referral;
  };

  const decision = {
    status:
      data.progres_reviewdecision === '125080000'
        ? 'accepted'
        : data.progres_reviewdecision === '125080001'
        ? 'rejected'
        : data.progres_reviewdecision,
    type: 'Referral', //hardcoded
    // record_id: { record_id }, //different case uuid; not the same as case_id
    record_type: 'case', //hardcoded
  };

  console.log('Decision to send back to Primero:', decision);

  return getReferrals({ externalId: 'case_id', id: case_id }, state => {
    const referrals = state.data;
    const referral = findReferral(referrals, service_id);

    if (!referral) {
      console.log(`No referral found for case_id ${case_id}. Skipping update.`);
      return state;
    }

    decision['id'] = referral.id;
    decision['record_id'] = referral.record_id;
    console.log(
      `Referral to update: ${JSON.stringify(
        referral,
        null,
        2
      )} with decision ${JSON.stringify(decision, null, 2)} `
    );
    return updateReferrals(
      {
        externalId: 'case_id',
        id: case_id,
        referral_id: referral.id,
        data: decision,
      },
      state => {
        console.log(
          `Upload succcessful ${JSON.stringify(state.data, null, 2)}`
        );
        return state;
      }
    )(state);
  })(state);
});