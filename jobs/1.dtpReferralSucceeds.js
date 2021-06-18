alterState(state => {
  const { configuration } = state;
  const { urlDTP, key, cert } = configuration;

  const data = {
    status: 'Pending Acknowledgement',
    primero_user: state.data.interventions[0].owned_by,
    case_id: state.data.interventions[0].case_id,
    progres_interventionnumber:
      state.data.interventions[0].progres_interventionnumber,
  };

  console.log(
    'Sending success message to DTP...',
    JSON.stringify(data, null, 2)
  );
  return http
    .post({
      url: urlDTP,
      data: data,
      headers: {
        'Ocp-Apim-Subscription-Key': configuration['Ocp-Apim-Subscription-Key'],
      },
      agentOptions: {
        key,
        cert,
      },
    })(state)
    .then(() => {
      console.log('Message sent to DTP/Progres.');
      return state;
    })
    .catch(error => {
      let newError = error;
      newError.config = 'REDACTED';
      throw newError;
    });
});
