each(
  dataPath('interventions[*]'),
  alterState(state => {
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

    const protectionMap = {
      'DS-LBM': 'physical_abuse_violence',
      'DS-UBM': 'sexual_abuse_violence',
      //==TODO: Reformat mappings ==========================
      'DS-V': 'rape',
      'DS-H': 'emotional_or_psychological',
      'DS-C': 'neglect',
      'DS- EB': 'abandonment',
      'DS-RC': 'child_labour',
      'DS-SC': 'hazardous_work',
      CR: 'sexual_exploitation',
      'CR-CP': 'slavery_sale_abduction',
      'CR-CS': 'in_conflict_with_the_law',
      'CR-CC': 'associated_with_armed',
      'CR-TP': 'deprived_of_liberty',
      'CR-LW': 'serious_medical_condition',
      'CR-LO': 'functional_difficulty_seeing',
      'CR-NE': 'functional_difficulty_hearing',
      'CR-SE': 'functional_difficulty_walking',
      'CR-AF': 'functional_difficulty_remembering',
      'CR-CL': 'difficulty_with_self_care',
      'SC-SC': 'difficulty_communicating',
      'SC-UC': 'unaccompanied',
      'SC-CH': 'separated',
      'SC-IC': 'orphan',
      'SC-FC': 'psychosocial_distress',
      'WR-WR': 'mental_disorder',
      'WR-SF': 'substance_abuse',
      'WR-LC': 'belongs_to_marginalised',
      'ER-NF': 'lack_of_documentation_birth_registration',
      'ER-MC': 'child_marriage',
      'ER-FR': 'female_genital_mutilation_fgm',
      'SP-PT': 'pregnancy_child_parent',
      'SP-GP': 'denial_of_resources_opportunities_or_services',
      'SP-CG': 'highly_vulnerable_care',
      'DS-BD': 'child_survivor_of_explosive',
      'DS-DF': 'other',
      'DS-PM': 'statelessness',
      'DS-PS': 'arrested_detained',
      'DS-MM': 'disabled',
      'DS-MS': 'serious_health_issue',
      'DS-SD': 'caafag',
      'SM-MI': 'street_child',
      'SM-MN': 'child_mother',
      'SM-DP': 'living_with_vulnerable_person',
      'SM-CI': 'worst_forms_of_child_labor',
      'SM-CC': 'child_headed_household',
      'SM-OT': 'mentally_distressed',
      'SM-AD': 'emotional_abuse',
      'FU-TR': 'child_neglect',
      'FU-FR': 'physical_abuse',
      'LP-ND': 'sgbv__rape_sodomy',
      'LP-BN': 'sgbv__physical_assault',
      'LP-NA': 'sgbv__sexual_assault',
      'LP-MM': 'sgbv__child_marriage',
      'LP-MD': 'sgbv__sex_for_goods_services',
      'LP-RR': 'sgbv__teenage_pregnancy',
      'LP-RD': 'sgbv__psychological_emotional_abuse',
      'LP-DA': 'sgbv__fgm',
      'LP-DO': 'sgbv__commercial_sexual_exploitation',
      'LP-DT': 'lp_dt__detained_held_elsewhere_f8f8d21',
      'LP-IH': 'lp_ih__in_hiding_a554ced',
      'LP-WP': 'lp_wp__absence_of_witness_protection_89f64dc',
      'LP-AN': 'lp_an__violence__abuse_or_neglect_b424522',
      'LP-RP': 'lp_rp__at_risk_due_to_profile_fb7c70c',
      'LP-MS': 'lp_ms__marginalized_from_society_or_community_e07cb83',
      'LP-LS': 'lp_ls__lack_of_durable_solutions_prospects_f9e8a11',
      'LP-AP': 'lp_ap__alleged_perpetrator_db9e2f5',
      'LP-CR': 'lp_cr__criminal_record_5a18ced',
      'LP-ST':
        'lp_st__security_threat_to_unhcr_partner_staff_or_others_28d5c9c',
      'LP-AF': 'lp_af__formerly_associated_with_armed_forces_or_groups_ac746df',
      'TR-PI':
        'tr_pi__psychological_and_or_physical_impairment_due_to_torture_be29dff',
      'TR-HO': 'tr_ho__forced_to_egregious_acts_ff05b1c',
      'TR-WV': 'tr_wv__witness_of_violence_to_other_74e79f8',
      'SV-VA': 'sv_va__victim__survivor_of__sgbv_in_country_of_asylum_5422ac9',
      'SV-VF': 'sv_vf__victim__survivor_of__sgbv_during_flight__64638f7',
      'SV-VO': 'sv_vo__victim__survivor_of__sgbv_in_country_of_origin_a3f9c27',
      'SV-GM': 'sv_gm__female_genital_mutilation_132d9d6',
      'SV-HP': 'sv_hp__harmful_traditional_practices_c68c552',
      'SV-HK': 'sv_hk__threat_of_honour_killing_violence_e3b4fbb',
      'SV-FM': 'sv_fm__forced__early_marriage__b1a8ba0',
      'SV-SS': 'sv_ss__survival_sex__0a5cc10',
    };

    const spneed = data['spnsubcategory2code']
      ? data['spnsubcategory2code']
      : undefined;

    //OLD MAPPINGS FROM DADAAB
    // const spneed = data['specificneeds.progres_spnsubcategory2']
    //   ? data['specificneeds.progres_spnsubcategory2'].Name
    //   : data['specificneeds.progres_spncategory2']
    //   ? data['specificneeds.progres_spncategory2'].Name
    //   : undefined;

    let protection = [];
    protection.push(protectionMap[spneed]);
    //data.interventions.forEach(pc => protection.push(protectionMap[pc.specificneeds.progres_spncategory2.Id]));

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
      "Dinka, Northeastern": 'language3',
      "Dinka, Northwestern; Alor": 'language3',
      "Dinka, South Central": 'language3',
      "Dinka, Southeastern;": 'language3',
      "Dinka, Southeastern": 'language3',
      "Dinka, Southwestern; Rek": 'language3',
      "Nuer": 'language2',
      Somali: 'language8',
      "Cutchi-swahili": 'language1',
      Swahili: 'language1',
      "Swahili, Congo": 'language1',
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
    //QUESTION: Should these be required also?
    //     if (!data['user.user.progres_partner'])
    //       missingFields.push('user.user.progres_partner');
    //     if (!data['individuals.progres_coalocationlevel1'])
    //       missingFields.push('individuals.progres_coalocationlevel1');
    // =======================================================

    if (!provided) {
      throw new Error(
        `Intervention referral is missing fields required for sending to Primero: ${missingFields.join(
          ','
        )}. Please include missing fields and re-send the request`
      );
    }

    const service_type = data['interventiontype.progres_description'];

    const today = formatDate(new Date().toISOString(), 'YYYY-MM-DD');

    const body = {
      // progres_interventionnumber: data.progres_interventionnumber, //NOT FOUND IN PRIMERO?
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
            //   data.progres_interventionbyother,
            //   data.progres_comments_nonrestrictedstore,
          ]
            .filter(Boolean)
            .join(',')
            .replace(/<\/p>/g, ' ')
            .replace(/<p>/g, ' '), // Reason for referral ?
          service_type:
            serviceMap[service_type] || 'focuses_non_specialized_mhpss_care', //REPLACES: data.progres_interventiontype2,
          service_implementing_agency:
            data.progres_businessunit === 'd69e8ec1-e80b-e611-80d3-001dd8b71f12'
              ? 'UNICEF'
              : 'UNICEF', //To confirm no more BUs to map
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
      address_current, //TODO; Contactenate locationlevel1, 2, ...6 (comma separated)
      protection_concerns: protection[0] ? protection : null, //TODO; Confirm protecton mapping works
      language: lang[0] ? lang : null, //TODO; Confirm language mapping works
      status: 'open',
      case_id: data.progres_primeroid ? data.progres_primeroid : undefined, // Advise on mapping
      owned_by: 'progresv4_primero_intake', //'unhcr_cw',
      module_id: 'primeromodule-cp', //hardcode default - to confirm
      //source_identification_referral: 'Humanitarian agencies', //Removed from config
      //registration_date: `${today}T00:00:00Z`,
      //associated_user_names: '[unhcr_cw]', //NEEDED?
      //remote: 'true', //NEEDED?
      //created_by: 'openfn_testing', //NEEDED? Set automatically?
      //created_by_source: '', //NEEDED?
    };
    // console.log('Mapping referral data to Primero');

    console.log('data to send to Primero:', body);

    // return state;
    return getCases(
      {
        remote: true,
        unhcr_individual_no: data['individuals.progres_id'],
        //case_id: data.progres_primeroid || data['individuals.progres_id'],
      },
      state => {
        // console.log(state.data);
        if (state.data.length === 0) {
          return createCase(
            {
              data: state => ({
                ...body,
              }),
            },
            state => {
              console.log(`New case created for case id:${state.data.case_id}`);
              return state;
            }
          )(state);
        } else if (state.data.length === 1) {
          return updateCase(state.data[0].id, {
            data: state => body,
          })(state);
        } else {
          body.case_id = state.data[0].case_id;
          console.log(
            `Upserting first matching case with case id ${body.case_id}`
          );
          return updateCase(state.data[0].id, {
            data: state => body,
          })(state);
        }
      }
    )(state);
  })
);
