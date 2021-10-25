// PLAN...
// 1. get UNHCR cases updated recently => state.cases
// 2. get referrals for all state.cases => state.referrals
// 3. remove items from state.cases.services_section
//    if unique_id not found in state.referrals
// 4. post cases (with updated services_sections) to inbox.

// Set up a manual cursor and referrals array.
fn(state => {
  console.log('Last sync end date:', state.lastRunDateTime);
  const manualCursor = '2021-10-14T15:10:00.587Z';
  const cursor = state.lastRunDateTime || manualCursor;
  return { ...state, referralIds: [], cursor };
});

// Get cases with UNHCR referrals
getCases(
  {
    remote: true,
    //associated_user_names: ['unhcr_cw'],
    'associated_user_names[0]': 'unhcr_cw',
    'associated_user_names[1]': 'unhcr_cw1',
    last_updated_at: state => `${state.cursor}..`,
  },
  state => ({
    ...state,
    cases: state.data.filter(
      c =>
        c.services_section &&
        c.services_section.length > 0 &&
        c.services_section.some(s => s.service_implementing_agency === 'UNHCR')
      // ADDED: to replace below filtering
      // Only get 'UNHCR' services && those created since last sync
      // (service.service_implementing_agency_individual === 'unhcr_cw' ||
      // service.service_implementing_agency_individual === 'unhcr_cw1') &&
    ),
  })
);

// Get referral details for each UNCHR case which have been created since the last run
each(
  '$.cases[*]',
  getReferrals({ externalId: 'record_id', id: dataValue('id') }, state => {
    // STEP 3: filter referrals where 'created_at_date' >= lastRUnDateTime || manualCursor
    state.data
      .filter(r => new Date(r.created_at) >= state.cursor)
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
    service_section: c.services_section
      .filter(s => state.referralIds.includes(s.unique_id))
      .filter(s => s.service_implementing_agency === 'UNHCR'),
  })),
}));

// Post data to OpenFn inbox
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
