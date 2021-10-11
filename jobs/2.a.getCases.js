alterState(state => {
  console.log('Last sync end date:', state.lastRunDateTime);
  const manualCursor = '2021-10-11T15:00:00.587Z';

  return getCases(
    {
      remote: true,
      associated_user_names: ['unhcr_cw1'],
      last_updated_at: `${state.lastRunDateTime || manualCursor}..`,
    },
    state => {
      const cases = state.data
        .filter(
          data =>
            data.services_section &&
            data.services_section.length > 0 &&
            data.services_section.some(
              serv => //Only get 'UNHCR' services && those created since last sync
                serv.service_implementing_agency === 'UNHCR' //&& //ADDED: to replace below filtering
                // (serv.service_implementing_agency_individual === 'unhcr_cw' ||
                // serv.service_implementing_agency_individual === 'unhcr_cw1') &&
                
                //TO DISCUSS With JACK:
                //new Date(serv.service_response_day_time) >=
                //new Date(state.lastRunDateTime || manualCursor)
            )
        )
        .map(c => {
          let obj = {};
          obj = { ...c };
          if (c.services_section && c.services_section.length > 0) {
            obj['services_section'] = [];
            c.services_section.forEach(serv => {
              if (serv.service_implementing_agency === 'UNHCR' && new Date(serv.service_response_day_time) >=
                new Date(state.lastRunDateTime || manualCursor)) {
                obj['services_section'].push(serv);
              }
            });
          }
          return obj;
        });

      console.log(cases.length, 'referrals fetched.');
      console.log('Posting to Inbox to later send to DTP...', JSON.stringify(cases, null, 2));

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

  console.log('Next sync start date:', lastRunDateTime);
  return { ...state, data: {}, references: [], lastRunDateTime };
});
