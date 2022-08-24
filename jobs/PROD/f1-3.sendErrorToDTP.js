alterState(state => {
  const { configuration } = state;
  const error = state.error || '';
  const { urlDTP, key, cert } = state.configuration;

  let closure_reason = '';
  let isError = false;
  for (elt of error) {
    if (String(elt).includes('TypeError')) {
      isError = true;
      closure_reason =
        'Intervention referral has provided invalid data. Please review the data values shared and re-send the request.';
    }
    if (String(elt).includes('Intervention referral')) {
      isError = true;
      closure_reason =
        'Intervention referral is missing fields required for sending to Primero. Please include missing fields and re-send the request.';
    }
    if (String(elt).includes('Service value shared')) {
      isError = true;
      closure_reason = `Intervention type value shared is not one of the 4 accepted interagency referral service types. Please see the mapping specifications.`;
    }
  }

  const data = {
    case_id: state.data.interventions[0].case_id,
    primero_user: state.data.interventions[0].owned_by,
    progres_interventionnumber:
      state.data.interventions[0].progres_interventionnumber,
    status: 'Delivery Fail',
    closure_reason,
    request_type: 'Feedback',
  };

  if (isError) {
    console.log(
      `Sending error message to DTP for case ${data.case_id} with progres_interventionnumber ${data.progres_interventionnumber}`
    );
    console.log(`Request status ${data.status}`);
    return http
      .post({
        url: urlDTP,
        data: data,
        headers: {
          'Ocp-Apim-Subscription-Key':
            configuration['Ocp-Apim-Subscription-Key'],
        },
        agentOptions: {
          key,
          cert,
        },
      })(state)
      .then(() => {
        console.log('Error sent to DTP/Progres.');
        return state;
      })
      .catch(error => {
        let newError = error;
        newError.config = 'REDACTED';
        throw newError;
      });
  } else {
    console.log('No error message sent to DTP.');
    return state;
  }
});
