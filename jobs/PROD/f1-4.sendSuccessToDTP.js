alterState(state => {
  const { configuration } = state;
  const { urlDTP, key, cert } = configuration;

  const pluckFromReference = (index, value) =>
    index ? index[value] : 'Not defined';

  const primero_user =
    state.data.owned_by ||
    pluckFromReference(state.references[1][0], 'owned_by');

  const data = {
    status: 'Pending Acknowledgement',
    primero_user,
    case_id:
      state.data.case_id ||
      pluckFromReference(state.references[1][0], 'case_id') ||
      pluckFromReference(state.references[1][0], 'id'),
    progres_interventionnumber: state.references[0].progres_interventionnumber,
  };

  console.log(
    `Sending success message to DTP for case_id ${data.case_id} and progres_interventionnumber ${data.progres_interventionnumber}`
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
