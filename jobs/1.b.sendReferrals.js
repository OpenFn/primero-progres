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
        case_id: data.case_id,
        primero_user: '', // Advise on mapping
        progres_interventionnumber: data.progres_interventionnumber,
        status: data.status,
        reason: '', // advise on mapping
      };

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