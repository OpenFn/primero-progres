getCases(
  {
    remote: true,
  },
  state => {
    const cases = state.data.filter(
      data =>
        data.services_section &&
        data.services_section[0].service_implementing_agency === 'unhcr'
        //where last_updated_at = since last run
    );
    
    console.log(cases.length, 'referrals fetched.');
    console.log('Posting to Inbox...');

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
