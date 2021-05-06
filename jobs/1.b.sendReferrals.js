alterState(state => {
  const { data } = state;
  getCases(
    {
      remote: true,
      case_id: data.progres_primeroid || data['individuals.progres_id'],
    },
    state => {
      const { urlDTP, key, cert } = state.configuration;
    
      const decision = {
        case_id: 'b30cba6b-8d97-4524-b77f-a8f50cfcc974',
        owned_by: 'unhcr_cw',
        progres_interventionnumber: 'NAI-20-PRTITV-0000006',
        status: 'rejected',
        closure_reason: 'primero reason for rejection',
        request_type: 'Primero Referral Decision'
      }; 
      // const decision = {
      //   case_id: data.case_id,
      //   owned_by: '', // Advise on mapping
      //   progres_interventionnumber: data.progres_interventionnumber,
      //   status: data.status,
      //   closure_reason: '', // advise on mapping
      //   request_type: 'Primero Referral Decision'
      // };
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