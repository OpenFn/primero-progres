alterState(state => {
  console.log('Current cursor value:', state.lastRunDateTime);
  const manualCursor = '2021-06-02T20:00:00.587Z';

  return getCases(
    {
      remote: true,
      last_updated_at: `${state.lastRunDateTime || manualCursor}..`,
      //last_updated_at: manualCursor //TO ADD DYNAMIC BELOW
      //
      //NOTE
      //1) data.last_updated_at = Last fetch AND data.status !== 'open' (implemented below)
      //2) data.services_section[...] contains service where progres_interventionnumber!==undefined
    },
    state => {
      const { data, configuration } = state;
      const { urlDTP, key, cert } = configuration;
      console.log(JSON.stringify(data, null, 2));
      const today = new Date();
      const yesterday = new Date(new Date().getTime());
      yesterday.setDate(yesterday.getDate() - 1);

      const nonOpenedCases = data
        .filter( //only check for decisions if case is not still 'open'...
          ref => ref.status !== 'open' &&
            ref.unhcr_individual_no !== null
        )
        .filter(ref => //...and if the service was a referral from unhcr
          ref.services_section.some(
            service => service.service_referral === 'external_referral'
          )
        );

      state.nonOpenedCases = nonOpenedCases;

      if (nonOpenedCases.length === 0) {
        console.log(
          'All cases have "open" status or don\'t hold progres_interventionnumber. No decisions to send to DTP'
        );
        return state;
      }
      return each(nonOpenedCases, state => {
        const { data } = state;
        const { services_section } = data;

        return each(services_section, state => {
          if (state.data.service_referral === 'external_referral') {
            const decision = {
              case_id: data.case_id,
              owned_by: data.owned_by,
              progres_interventionnumber: state.data.progres_interventionnumber,
              status: data.status,
              closure_reason: data.closure_reason,
              request_type: 'ReceiveDecisionOutgoingReferral', //default hardcode
            };

            console.log(
              'Decision to send to DTP: ',
              JSON.stringify(decision, null, 2)
            );
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

alterState(state => {
  let lastRunDateTime = state.nonOpenedCases
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
