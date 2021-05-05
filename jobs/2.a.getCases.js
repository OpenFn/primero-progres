getCases(
  {
    remote: true,
    assigned_user_names: ['unhcr_cw']
    //where last_updated_at = since last run
  },
  state => {
    const cases = state.data
    .filter(
      data =>
        //data.assigned_user_names === ['unhcr_cw']
        data.services_section &&
        data.services_section[0].service_implementing_agency === 'unhcr'
         
    ); 
    
    console.log(cases.length, 'referrals fetched.');
    console.log('Posting to Inbox...', JSON.stringify(state.data, null, 2));

    state.cases = cases;

    const { openfnInboxUrl, xApiKey } = state.configuration;
    return http
      .post({
        url: openfnInboxUrl,
        data: cases,
        headers: { 'x-api-key': xApiKey },
      })(state)
      .then(() => {
        console.log('Cases posted to openfn inbox.');
        return state;
      });
  }
);
