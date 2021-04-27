getCases(
  {
    remote: true,
  },
  state => {
    const cases = state.data.filter(
      data =>
        data.services_section &&
        data.services_section[0].service_implementing_agency === 'unhcr'
    );

    console.log(cases.length, 'fetched.');
    console.log('Posting to Inbox...');

    state.cases = cases;

    const { openfnInboxUrl } = state.configuration;
    return http.post({
      url: openfnInboxUrl,
      data: cases,
    })(state);
  }
);
