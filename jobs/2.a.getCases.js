getCases(
  {
    remote: true,
    assigned_user_names: ['unhcr_cw'],
    //TODO: add where last_updated_at = last24hours
    last_updated_at: new Date().toISOString(),
  },
  state => {
    const cases = state.data.filter(
      data =>
        //data.assigned_user_names === ['unhcr_cw']
        data.services_section &&
        data.services_section[0].service_implementing_agency_individual === 'unhcr_cw' || 
        data.services_section[1].service_implementing_agency_individual === 'unhcr_cw'
        //data.services_section[0].service_implementing_agency === 'unhcr'
    );

    console.log(cases.length, 'referrals fetched.');
    console.log('Posting to Inbox...', JSON.stringify(cases, null, 2));

    state.cases = cases;

    const { openfnInboxUrl, xApiKey } = state.configuration;
    return each(cases, state => {
      const data = {
        _json: [state.data],
      };
      return http
        .post({
          url: openfnInboxUrl,
          data,
          headers: { 'x-api-key': xApiKey },
        })(state)
        .then(() => {
          console.log('Case posted to openfn inbox.');
          return state;
        })
        .catch(error => {
          let newError = error;
          newError.config = 'REDACTED';
          throw newError;
        });
    })(state);
  }
);
