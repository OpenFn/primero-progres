fn(state => {
  console.log('Last sync end date:', state.lastRunDateTime);
  const manualCursor = '2021-10-14T15:10:00.587Z';
  const cursor = state.lastRunDateTime || manualCursor;
  return { ...state, referralIds: [], cursor };
});

// Get cases with UNHCR referrals
fn(state => {
  return getCases(
    {
      remote: true,
      'associated_user_names[0]': 'unhcr_cw',
      'associated_user_names[1]': 'unhcr_cw1',
      last_updated_at: `${state.cursor}..`,
    },
    state => ({
      ...state,
      cases: state.data.filter(
        c =>
          c.services_section &&
          c.services_section.length > 0 &&
          c.services_section.some(
            s => s.service_implementing_agency === 'UNHCR'
          )
      ),
    })
  )(state);
});

// Get referral details for each UNCHR case which have been created since the last run
each(
  '$.cases[*]',
  getReferrals({ externalId: 'record_id', id: dataValue('id') }, state => {
    // STEP 3: filter referrals where 'created_at_date' >= lastRUnDateTime || manualCursor
    state.data
      .filter(r => new Date(r.created_at) >= new Date(state.cursor))
      .map(r => {
        state.referralIds.push(r.service_record_id);
      });
    return state;
  })
);

fn(state => ({
  ...state,
  cases: state.cases.map(c => ({
    ...c,
    services_section: c.services_section
      .filter(s => state.referralIds.includes(s.unique_id))
      .filter(s => s.service_implementing_agency === 'UNHCR'),
  })),
}));

// Post referral data to OpenFn inbox
fn(state => {
  const { openfnInboxUrl, xApiKey } = state.configuration;

  return each(state.cases, state => {
    return http
      .post({
        url: openfnInboxUrl,
        data: { _json: [state.data] },
        headers: { 'x-api-key': xApiKey },
      })(state)
      .then(() => {
        console.log('Case posted to openfn inbox.');
        return state;
      })
      .catch(error => {
        throw { ...error, config: 'REDACTED' };
      });
  })(state);
});

// After job completes successfully, update cursor
fn(state => {
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
