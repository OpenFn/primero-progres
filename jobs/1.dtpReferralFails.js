alterState(state => {
    console.log(JSON.stringify(state.data, null, 2)); 
    const error = state.error || '';
    const { urlDTP, key, cert } = state.configuration;

    let status = 'failed';
    for (elt of error)
        if (String(elt).includes('undefined')) {
            status = 'not_found';
        }

    const data = {
        interventionNumber: state.data.interventions[0].progres_interventionnumber,
        reason: 'Intervention referral is missing fields required for sending to Primero. Please include missing fields and re-send the request.'
    };

    console.log('Sending error message to DTP...', JSON.stringify(data, null, 2));
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
            //console.log(JSON.stringify(state.data, null, 2));
            console.log('Response uploaded to DTP/Progres.');
            return state;
        })
        .catch(error => {
            let newError = error;
            newError.config = 'REDACTED';
            throw newError;
        });
});
