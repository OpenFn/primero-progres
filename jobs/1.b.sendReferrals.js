getCases(
  {
    remote: true,
    last_updated_at: '2021-06-02T00:00:00.587Z..'
    //case_id: data.progres_primeroid || data['individuals.progres_id'], //wrong filter
    //TODO: get all cases where...
    /* query: state => {
      var d = new Date(),
        month = '' + (d.getMonth() + 1),
        day = '' + d.getDate(),
        year = d.getFullYear();

      if (month.length < 2) month = '0' + month;
      if (day.length < 2) day = '0' + day;
      return `last_updated_at=${year}-${month}-${day}`;
    }, */
    //last_updated_at: new Date().toISOString(),
    //1) data.last_updated_at = Last 24 hours AND data.status !== 'open'
    //2) data.services_section[...] contains service where progres_interventionnumber!==undefined
  },
  state => {
    const { data, configuration } = state;
    const { urlDTP, key, cert } = configuration;

    const today = new Date();
    const yesterday = new Date(new Date().getTime());
    yesterday.setDate(yesterday.getDate() - 1);

    const nonOpenedCases = data
      .filter(
        ref =>
          ref.status !== 'open' &&
          new Date(ref.last_updated_at) > yesterday &&
          new Date(ref.last_updated_at) < today
      )
      .filter(ref =>
        ref.services_section.some(service => service.progres_interventionnumber)
      );

    if (nonOpenedCases.length === 0)
      console.log('All cases have "open" status. No decisions to send to DTP');

    return each(nonOpenedCases, state => {
      // console.log(state.data);
      const { data } = state;
      const { services_section } = data;

      return each(services_section, state => {
        if (state.data.progres_interventionnumber) {
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
          // return state;
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
);

//==== Example decision output to post to DTP ===///
// decision = {
//         case_id: 'b30cba6b-8d97-4524-b77f-a8f50cfcc974',
//         owned_by: 'unhcr_cw',
//         progres_interventionnumber: 'NAI-20-PRTITV-0000006',
//         status: 'rejected',
//         closure_reason: 'primero reason for rejection',
//         request_type: 'ReceiveDecisionOutgoingReferral'
//       };
