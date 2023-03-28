fn(state => {
  console.log('Current cursor value:', state.lastRunDateTime);
  const manualCursor = '2022-11-20T13:00:07.445Z';

  return getCases(
    {
      remote: true,
      last_updated_at: `${state.lastRunDateTime || manualCursor}..`,
    },
    state => {
      const { data, configuration } = state;
      const { urlDTP, key, cert } = configuration;
      console.log('Primero cases fetched for ids: ', data.case_id);
      const today = new Date();
      const yesterday = new Date(new Date().getTime());
      yesterday.setDate(yesterday.getDate() - 1);

      const referralsToSend = data.filter(
        (
          ref //check if the service was an external referral & the decision changed
        ) =>
          ref.services_section &&
          ref.services_section.some(
            service =>
              service.service_request_agency === 'UNHCR' &&
              service.service_referral === 'external_referral' &&
              (service.unhcr_referral_status === 'accepted' ||
                service.unhcr_referral_status === 'rejected')
          )
      );

      state.referralsToSend = referralsToSend;
      if (referralsToSend.length === 0) {
        console.log(
          'No change in UNHCR Referral Status detected. No decisions to send to DTP.'
        );
        return state;
      }
      console.log('Number of matching referrals: ', referralsToSend.length);
      console.log(
        'Primero referrals to send to DTP: ',
        JSON.stringify(referralsToSend, null, 2)
      );
      return each(referralsToSend, state => {
        const { data } = state;
        const { services_section } = data;

        const allowedStatus = ['accepted', 'rejected'];
        return each(services_section, state => {
          if (
            state.data.service_referral === 'external_referral' &&
            allowedStatus.includes(state.data.unhcr_referral_status)
          ) {
            const decision = {
              case_id: data.case_id,
              primero_user: data.owned_by,
              progres_interventionnumber: state.data.progres_interventionnumber,
              status:
                state.data.unhcr_referral_status === 'accepted'
                  ? 'acknowledged'
                  : state.data.unhcr_referral_status === 'rejected'
                  ? 'rejected'
                  : 'Pending Acknowledgement',
              closure_reason:
                state.data.unhcr_referral_rejection_reason ||
                'No reason specified.',
              request_type: 'ReceiveDecisionOutgoingReferral', //default hardcode
            };
            console.log(
              `Decision to send to DTP for case ${decision.case_id} and progres_interventionnumber ${decision.progres_interventionnumber}`
            );
            console.log(`Decision status: ${decision.status}`);
            console.log('Decision body:', JSON.stringify(decision, null, 2));
            return http
              .post({
                url: urlDTP,
                data: decision,
                headers: {
                  'Ocp-Apim-Subscription-Key':
                    state.configuration['Ocp-Apim-Subscription-Key'],
                },
                agentOptions: {
                  key,
                  cert,
                },
              })(state)
              .then(() => {
                console.log('Decision has been sent.');
                return state;
              })
              .catch(error => {
                let newError = error;
                newError.config = 'REDACTED';
                throw newError;
              });
          }
          return state;
        })(state);
      })(state);
    }
  )(state);
});

fn(state => {
  let lastRunDateTime = state.referralsToSend
    .map(c => c.last_updated_at)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  lastRunDateTime =
    new Date(lastRunDateTime) > new Date()
      ? lastRunDateTime
      : new Date().toISOString();

  console.log('New cursor value:', lastRunDateTime);
  return { ...state, data: {}, references: [], lastRunDateTime };
});


//==== Example decision output to post to DTP ===///
// decision = {
//         case_id: 'b30cba6b-8d97-4524-b77f-a8f50cfcc974',
//         owned_by: 'unhcr_cw',
//         progres_interventionnumber: 'NAI-20-PRTITV-0000006',
//         status: 'rejected',
//         closure_reason: 'primero reason for rejection',
//         request_type: 'ReceiveDecisionOutgoingReferral'
//       };
