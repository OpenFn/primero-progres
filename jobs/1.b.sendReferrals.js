alterState(state => {
  const { data } = state;
  getCases(
    {
      remote: true,
      //case_id: data.progres_primeroid || data['individuals.progres_id'], //wrong filter
      //TODO: get all cases where...
      //1) data.last_updated_at = Last 24 hours AND data.status !== 'open'
      //2) data.services_section[...] contains service where progres_interventionnumber!==undefined
    },
    state => {
      const { urlDTP, key, cert } = state.configuration;


      const decision = {
        case_id: data.case_id,
        owned_by: data.owned_by,
        progres_interventionnumber: data.progres_interventionnumber,
        status: data.status,
        closure_reason: '', // advise on mapping 
        request_type: 'Primero Referral Decision' //default hardcode
      };
      console.log('Decision to send to DTP: ', JSON.stringify(decision, null, 2));

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
        });
    }
  );
  return state;
});

//==== Example decision output to post to DTP ===///
// decision = {
//   case_id: 'b30cba6b-8d97-4524-b77f-a8f50cfcc974',
//   owned_by: 'unhcr_cw',
//   progres_interventionnumber: 'NAI-20-PRTITV-0000006',
//   status: 'rejected',
//   closure_reason: 'primero reason for rejection',
//   request_type: 'Primero Referral Decision'
// }; 