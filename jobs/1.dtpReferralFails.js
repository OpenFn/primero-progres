alterState(state => {
  const { configuration } = state;
  //   console.log(state.error);
  const error = state.error || '';
  const { urlDTP, key, cert } = state.configuration;

  let closure_reason = '';
  for (elt of error) {
    if (String(elt).includes('TypeError')) {
      console.log('type error in here');
      closure_reason =
        'Intervention referral is has provided invalid data. Please review the data values shared and re-send the request.';
    }
  }

  const data = {
    status: 'Delivery Fail',
    primero_user: state.data.interventions[0].owned_by,
    case_id: state.data.interventions[0].case_id,
    progres_interventionnumber:
      state.data.interventions[0].progres_interventionnumber,
    closure_reason,
  };

  console.log('Sending error message to DTP...', JSON.stringify(data, null, 2));
  return state;
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
      //console.log(JSON.stringify(state.data, null, 2));
      console.log('Error sent to DTP/Progres.');
      return state;
    })
    .catch(error => {
      let newError = error;
      newError.config = 'REDACTED';
      throw newError;
    });
});
