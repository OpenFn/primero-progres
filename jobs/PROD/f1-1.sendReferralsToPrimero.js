each(
  dataPath('interventions[*]'),
  fn(state => {
    const { data } = state;

    const calculateAge = dob => {
      const diff = Date.now() - dob.getTime();
      const age_dt = new Date(diff);

      return Math.abs(age_dt.getUTCFullYear() - 1970); //.toString();
    };

    const formatDate = (date, format) => {
      if (!date) return null;
      date = date.split(/\s|T/g)[0]; // split date by 'T' or by space

      const parts = date.match(/(\d+)/g); // match all digits
      if (!parts) return null;

      let year, day;
      if (parts[0].length === 4) {
        year = parts[0];
        day = parts[2];
      } else {
        year = parts[2];
        day = parts[0];
      }

      const yearFinal = String(year).length > 2 ? year : `20${year}`;
      const month = String(parts[1]).length === 2 ? parts[1] : `0${parts[1]}`;
      const dayFinal = String(day).length === 2 ? day : `0${day}`;

      if (format.substring(0, 4) === 'YYYY') {
        const separator = format.substring(4, 5);
        return `${yearFinal}${separator}${month}${separator}${dayFinal}`;
      }
      if (format.substring(0, 2) === 'DD') {
        const separator = format.substring(2, 3);
        return `${dayFinal}${separator}${month}${separator}${yearFinal}`;
      }
    };

    const progres_description = data['interventiontype.progres_description'];

    const serviceMap = {
      'Alternative Care': 'alternative_care',
      BID: 'focuses_non_specialized_mhpss_care',
      BIA: 'focuses_non_specialized_mhpss_care',
      'Family Tracing and Reunification': 'food',
    };
    state.serviceMap = serviceMap;

    const serviceMapArray = [];
    for (service in serviceMap) serviceMapArray.push(service);
    if (!serviceMapArray.includes(progres_description)) {
      throw new Error(
        `Service value shared is not an accepted UNICEF service type. Please see the mapping specifications.`
      );
    }

    const sexMap = {
      125080000: 'female',
      125080001: 'male',
      125080002: 'other_b25f252',
      125080003: 'unknown_4b34795',
    };

    const languageMap = {
      Anyuak: 'language1',
      Acholi: 'language10',
      Amharic: 'language5',
      Bari: 'language4',
      Bembe: 'language7',
      'Dinka, Northeastern': 'language3',
      'Dinka, Northwestern; Alor': 'language3',
      'Dinka, South Central': 'language3',
      'Dinka, Southeastern;': 'language3',
      'Dinka, Southeastern': 'language3',
      'Dinka, Southwestern; Rek': 'language3',
      Nuer: 'language2',
      Somali: 'language8',
      'Cutchi-swahili': 'language1',
      Swahili: 'language1',
      'Swahili, Congo': 'language1',
      Zande: 'language5',
    };

    let lang = [];
    lang.push(
      data['languages.progres_languagecodeid']
        ? languageMap[data['languages.progres_languagecodeid'].Name] ||
            'language6'
        : undefined
    );

    const address1 = data['individuals.progres_coalocationlevel1']
      ? data['individuals.progres_coalocationlevel1'].Name
      : '';
    const address2 = data['individuals.progres_coalocationlevel2']
      ? data['individuals.progres_coalocationlevel2'].Name
      : '';
    const address3 = data['individuals.progres_coalocationlevel3']
      ? data['individuals.progres_coalocationlevel3'].Name
      : '';
    const address4 = data['individuals.progres_coalocationlevel4']
      ? data['individuals.progres_coalocationlevel4'].Name
      : '';
    const address5 = data['individuals.progres_coalocationlevel5']
      ? data['individuals.progres_coalocationlevel5'].Name
      : '';
    const address6 = data['individuals.progres_coalocationlevel6']
      ? data['individuals.progres_coalocationlevel6']
      : '';

    const address_current =
      address1 +
      ' ' +
      address2 +
      ' ' +
      address3 +
      ' ' +
      address4 +
      ' ' +
      address5 +
      ' ' +
      address6;

    const progres_sex = data['individuals.progres_sex'];
    const provided =
      (progres_description &&
        data['individuals.progres_id'] &&
        data['individuals.progres_registrationgroupid'] &&
        data['individuals.progres_givenname'] &&
        data['individuals.progres_familyname']) !== undefined;

    const missingFields = [];
    // CHECK MISSING FIELDS ==================================
    if (!progres_description)
      missingFields.push('interventiontype.progres_description');
    if (!data['individuals.progres_id'])
      missingFields.push('individuals.progres_id');
    if (!data['individuals.progres_registrationgroupid'])
      missingFields.push('individuals.progres_registrationgroupid');
    if (!data['individuals.progres_givenname'])
      missingFields.push('individuals.progres_givenname');
    if (!data['individuals.progres_familyname'])
      missingFields.push('individuals.progres_familyname');
    if (!data['individuals.progres_dateofbirth'])
      missingFields.push('individuals.progres_dateofbirth');
    if (!data['individuals.progres_sex'])
      missingFields.push('individuals.progres_sex');

    if (!provided) {
      throw new Error(
        `Intervention referral is missing fields required for sending to Primero: ${missingFields.join(
          ','
        )}. Please include missing fields and re-send the request`
      );
    }
    // =======================================================

    const service_type = data['interventiontype.progres_description'];

    const today = formatDate(new Date().toISOString(), 'YYYY-MM-DD');

    const body = {
      services_section: [
        {
          service_response_day_time: data.progres_interventionstartdate,
          service_request_external: true, //Confirm primero mapping
          service_request_title: data['user.title'],
          service_request_agency: data['user.progres_partner']
            ? data['user.progres_partner'].Name
            : 'UNHCR',
          service_request_phone: data['user.mobilephone'],
          service_request_email: data['user.internalemailaddress'],
          service_referral_notes: [
            data.progres_interventiondescription,
            data.progres_reasonforreferral,
          ]
            .filter(Boolean)
            .join(',')
            .replace(/<\/p>/g, ' ')
            .replace(/<p>/g, ' '),
          service_type:
            serviceMap[service_type] || 'focuses_non_specialized_mhpss_care',
          service_implementing_agency: 'UNICEF', //default request for Gambella instead of progres_businessunit
          service_response_type: 'service_provision',
          service_referral: 'external_referral',
          unhcr_referral_status: 'pending',
          progres_interventionnumber: data.progres_interventionnumber,
        },
      ],
      unhcr_individual_no: data['individuals.progres_id'],
      unhcr_id_no: data['individuals.progres_registrationgroupid'].Name,
      name_first: data['individuals.progres_givenname'],
      name_middle: data['individuals.progres_middlename'],
      name_last: data['individuals.progres_familyname'],
      name_nickname: data['individuals.progres_commonyusedname'],
      date_of_birth: data['individuals.progres_dateofbirth'].split('T')[0],
      age: data['individuals.progres_dateofbirth']
        ? calculateAge(new Date(data['individuals.progres_dateofbirth']))
        : undefined,
      sex: data['individuals.progres_sex'] ? sexMap[progres_sex] : undefined,
      telephone_current: data['individuals.progres_primaryphonenumber'],
      address_current,
      //protection_concerns: protection[0] ? protection : null,
      language: lang[0] ? lang : null,
      status: 'open',
      case_id: data.progres_primeroid ? data.progres_primeroid : undefined,
      owned_by: 'progresv4_primero_intake@cpims-gambella.primero.org', //Gambella intake user
      module_id: 'primeromodule-cp',
    };

    console.log('Mapping referral data to Primero: ', body.unhcr_individual_no);
    console.log('Preparing to send this data to Primero:', body);

    return getCases(
      {
        remote: true,
        unhcr_individual_no: data['individuals.progres_id'],
      },
      next => {
        if (next.data.length === 0) {
          return createCase({ data: body }, resp => {
            console.log(`New case created for case id:${resp.data.case_id}`);
            return resp;
          })(next);
        }

        if (next.data.length === 1) {
          console.log(`Matching Primero case found; updating...`);
          return updateCase(next.data[0].id, { data: body }, resp => {
            console.log(
              `Updated ${resp.data.id} @ ${resp.data.last_updated_at}`
            );
            return resp;
          })(next);
        }

        body.case_id = next.data[0].case_id;
        console.log(
          `Multiple cases found! Upserting first matching case with case id ${body.case_id}`
        );
        return updateCase(next.data[0].id, { data: body }, resp => {
          console.log(`Updated ${resp.data.id} @ ${resp.data.last_updated_at}`);
          return resp;
        })(next);
      }
    )(state);
  })
);
