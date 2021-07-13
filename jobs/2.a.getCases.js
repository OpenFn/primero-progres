alterState(state => {
  console.log('Current cursor value:', state.lastRunDateTime);
  const manualCursor = '2021-07-12T00:00:00.587Z';

  return getCases(
    {
      remote: true,
      associated_user_names: ['unhcr_cw'],
      //assigned_user_names: ['unhcr_cw'],
      last_updated_at: `${state.lastRunDateTime || manualCursor}..`,
    },
    state => {
      const cases = state.data
        .filter(
          data =>
            data.services_section &&
            data.services_section.length > 0 &&
            data.services_section.some(
              serv =>
                serv.service_implementing_agency_individual === 'unhcr_cw' &&
                new Date(serv.service_response_day_time) >=
                  new Date(state.lastRunDateTime || manualCursor)
            )
          // data.services_section[0].service_implementing_agency === 'unhcr' //old criteria
        )
        .map(c => {
          let obj = {};
          obj = { ...c };
          if (c.services_section && c.services_section.length > 0) {
            obj['services_section'] = [];
            c.services_section.forEach(serv => {
              if (serv.service_implementing_agency_individual === 'unhcr_cw' || serv.service_implementing_agency_individual === 'unhcr_cw1') {
                obj['services_section'].push(serv);
              }
            });
          }
          return obj;
        });

      console.log(cases.length, 'referrals fetched.');
      console.log('Posting to Inbox...', JSON.stringify(cases, null, 2));

      state.cases = cases;

      const { openfnInboxUrl, xApiKey } = state.configuration;
      return each(cases, state => {
        const data = {
          _json: [state.data],
        };
        if (
          state.data.services_section &&
          state.data.services_section.length > 0
        ) {
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
        } else {
          console.log('No referral services found to send to DTP.');
          return state;
        }
      })(state);
    }
  )(state);
});

alterState(state => {
  let lastRunDateTime = state.cases
    .map(c => c.last_updated_at)
    .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

  lastRunDateTime =
    new Date(lastRunDateTime) > new Date()
      ? lastRunDateTime
      : new Date().toISOString();

  console.log('New cursor value:', lastRunDateTime);
  return { ...state, data: {}, references: [], lastRunDateTime };
});
