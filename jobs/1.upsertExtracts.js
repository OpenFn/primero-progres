each(
  dataPath('interventions[*]'),
  alterState(state => {
    const { data } = state;

    const calculateAge = dob => {
      const diff = Date.now() - dob.getTime();
      const age_dt = new Date(diff);

      return Math.abs(age_dt.getUTCFullYear() - 1970);
    };

    //TODO: Evaluate subtype AND type for service mappings
    const serviceMap = {
      Accessibility: 'services_for_children_with_disabilities',
      'Advocacy / Direct intervention': 'other',
      'Alternative Care': 'alternative_care',
      BIA: 'alternative_care',
      BID: 'alternative_care',
      Documentation: 'alternative_care',
      Education: 'education_formal',
      Energy: 'non_food_items',
      'Family Tracing and Reunification': 'family_tracing_and_reunification',
      'Follow-up actions': 'basic_psychosocial_support',
      'Health Assistance': 'medical',
      'Housing/Shelter': 'shelter',
      'Law Enforcement (police / Security)': 'security_e_g_safe_shelter',
      'Legal Aid': 'legal_support',
      Livelihoods: 'livelihoods',
      Mediation: 'basic_psychosocial_support',
      Other: 'other',
      'Other Material Support': 'non_food_items',
      'Psychosocial Support (focused)': 'focuses_non_specialized_mhpss_care',
      Safety: 'security_e_g_safe_shelter',
      'Social Skills': 'non_formal_education',
      Wash: 'wash',
    };
    state.serviceMap = serviceMap;

    const protectionMap = {
      //       'a1c5b4fb-8f76-e611-80c9-00155d340529': 'sexual_exploitation', //CR
      //       'a3c5b4fb-8f76-e611-80c9-00155d340529': 'slavery_sale_abduction', //DS
      //       'DS-V': 'in_conflict_with_the_law', //CR-CS
      'Lower Body Mobility': 'physical_abuse_violence',
      'Upper Body Mobility': 'sexual_abuse_violence',
      Vision: 'rape',
      Hearing: 'emotional_or_psychological',
      Communication: 'neglect',
      'Emotions and behavior': 'abandonment',
      'Remembering and concentrating': 'child_labour',
      'Self-Care': 'hazardous_work',
      'Child at risk[1]': 'sexual_exploitation',
      'Child parent': 'slavery_sale_abduction',
      'Child spouse': 'in_conflict_with_the_law',
      'Child carer': 'associated_with_armed',
      'Teenage pregnancy': 'deprived_of_liberty',
      'Child engaged in worst forms of child labour':
        'serious_medical_condition',
      'Child engaged in other forms of child labour':
        'functional_difficulty_seeing',
      'Child at risk of not attending school': 'functional_difficulty_hearing',
      'Child with special education needs': 'functional_difficulty_walking',
      'Child associated with armed forces or groups':
        'functional_difficulty_remembering',
      'Child in conflict with the law': 'difficulty_with_self_care',
      'Separated child': 'difficulty_communicating',
      'Unaccompanied child': 'unaccompanied',
      'Child-headed household': 'separated',
      'Child in institutional care': 'orphan',
      'Child in foster care': 'psychosocial_distress',
      'Woman at risk': 'mental_disorder',
      'Single woman at risk': 'substance_abuse',
      Lactation: 'belongs_to_marginalised',
      'Single older person': 'lack_of_documentation_birth_registration',
      'Older person with children': 'child_marriage',
      'Older person unable to care for self': 'female_genital_mutilation_fgm',
      'Single HR – parent': 'pregnancy_child_parent',
      'Single HR – grandparent':
        'denial_of_resources_opportunities_or_services',
      'Single HR – caregiver': 'highly_vulnerable_care',
      'Visual impairment (including blindness)': 'child_survivor_of_explosive',
      'Hearing impairment (including deafness)': 'other',
      'Physical disability – moderate': 'ds_pm__physical_disability___moderate',
      'Physical disability – severe': 'ds_ps__physical_disability___severe',
      'Mental disability – moderate': 'ds_mm__mental_disability___moderate',
      'Mental disability – severe': 'ds_ms__mental_disability___severe',
      'Speech impairment/disability': 'ds_sd__speech_impairment_disability',
      'Mental illness': 'sm_mi__mental_illness',
      Malnutrition: 'sm_mn__malnutrition',
      'Difficult pregnancy': 'sm_dp__difficult_pregnancy',
      'Chronic illness': 'sm_ci__chronic_illness',
      'Critical medical condition': 'sm_cc__critical_medical_condition',
      'Other medical condition': 'sm_ot__other_medical_condition',
      Addiction: 'sm_ad__addiction',
      'Tracing required': 'fu_tr__tracing_required',
      'Family reunification required': 'fu_fr__family_reunification_required',
      'No legal documentation': 'lp_nd__no_legal_documentation',
      'Unmet basic needs': 'lp_bn__unmet_basic_needs_',
      'No acces to services': 'lp_na__no_acces_to_services',
      'Mixed marriage': 'lp_mm__mixed_marriage',
      'Multiple displacements': 'lp_md__multiple_displacements',
      'At risk of refoulement': 'lp_rr__at_risk_of_refoulement',
      'At risk of removal': 'lp_rd__at_risk_of_removal_',
      'Detained/held in country of asylum':
        'lp_da__detained_held_in_country_of_asylum',
      'Detained/held in country of origin':
        'lp_do__detained_held_in_country_of_origin',
      'Detained/held elsewhere': 'lp_dt__detained_held_elsewhere',
      'In hiding': 'lp_ih__in_hiding',
      'Absence of witness protection': 'lp_wp__absence_of_witness_protection',
      'Violence, abuse or neglect': 'lp_an__violence__abuse_or_neglect',
      'At risk due to profile': 'lp_rp__at_risk_due_to_profile',
      'Marginalized from society or community':
        'lp_ms__marginalized_from_society_or_community',
      'Lack of durable solutions prospects':
        'lp_ls__lack_of_durable_solutions_prospects',
      'Alleged perpetrator': 'lp_ap__alleged_perpetrator',
      'Criminal record': 'lp_cr__criminal_record',
      'Security threat to UNHCR/partner staff or others':
        'lp_st__security_threat_to_unhcr_partner_staff_or_others',
      'Formerly associated with armed forces or groups':
        'lp_af__formerly_associated_with_armed_forces_or_groups',
      'Psychological and/or physical impairment due to torture':
        'tr_pi__psychological_and_or_physical_impairment_due_to_torture',
      'Forced to egregious acts': 'tr_ho__forced_to_egregious_acts',
      'Witness of violence to other': 'tr_wv__witness_of_violence_to_other',
      'Victim/ survivor of SGBV in country of asylum':
        'sv_va__victim__survivor_of__sgbv_in_country_of_asylum',
      'Victim/ survivor of SGBV during flight':
        'sv_vf__victim__survivor_of__sgbv_during_flight_',
      'Victim/ survivor of SGBV in country of origin':
        'sv_vo__victim__survivor_of__sgbv_in_country_of_origin',
      'Female genital mutilation': 'sv_gm__female_genital_mutilation',
      'Harmful traditional practices': 'sv_hp__harmful_traditional_practices',
      'Threat of honour killing/violence':
        'sv_hk__threat_of_honour_killing_violence',
      'Forced/ early marriage': 'sv_fm__forced__early_marriage_',
      'Survival sex': 'sv_ss__survival_sex_',
      Disability: 'ds__disability_24ad9a9',
      'Legal Protection': 'lp__legal_protection_2e26a58',
      'Sexual and Gender Based Violence':
        'sv__sexual_and_gender_based_violence_0fca34d',
      Torture: 'tr__torture_b92f06b',
    };

    const spneed = data['specificneeds.progres_spnsubcategory2']
      ? data['specificneeds.progres_spnsubcategory2'].Name
      : data['specificneeds.progres_spncategory2']
      ? data['specificneeds.progres_spncategory2'].Name
      : undefined;

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
      //'English': 'language1', //old tests
      //'English': '_english',
      //'French': '_french',
      //'Somali': 'language6',
      Amharic: '_amharic',
      'Arabic, Algerian Saharan Spoken': '_arabic',
      'Arabic, Algerian Spoken': '_arabic',
      'Arabic, Babalia Creole': '_arabic',
      'Arabic, Baharna Spoken': '_arabic',
      'Arabic, Chadian Spoken': '_arabic',
      'Arabic, Cypriot Spoken': '_arabic',
      'Arabic, Dhofari Spoken': '_arabic',
      'Arabic, Eastern Egyptian Bedawi Spoken': '_arabic',
      'Arabic, Egyptian Spoken': '_arabic',
      'Arabic, Gulf Spoken': '_arabic',
      'Arabic, Hadrami Spoken': '_arabic',
      'Arabic, Hijazi Spoken': '_arabic',
      'Arabic, Judeo-iraqi': '_arabic',
      'Arabic, Judeo-moroccan': '_arabic',
      'Arabic, Judeo-tripolitanian': '_arabic',
      'Arabic, Judeo-tunisian': '_arabic',
      'Arabic, Judeo-yemeni': '_arabic',
      'Arabic, Libyan Spoken': '_arabic',
      'Arabic, Mesopotamian Spoken': '_arabic',
      'Arabic, Moroccan Spoken': '_arabic',
      'Arabic, Najdi Spoken': '_arabic',
      'Arabic, North Levantine Spoken': '_arabic',
      'Arabic, North Mesopotamian Spoken': '_arabic',
      'Arabic, Omani Spoken': '_arabic',
      'Arabic, Sa<idi Spoken': '_arabic',
      'Arabic, Sanaani Spoken': '_arabic',
      'Arabic, Shihhi Spoken': '_arabic',
      'Arabic, South Levantine Spoken': '_arabic',
      'Arabic, Standard': '_arabic',
      'Arabic, Sudanese Creole': '_arabic',
      'Arabic, Sudanese Spoken': '_arabic',
      "Arabic, Ta'izzi-adeni Spoken": '_arabic',
      'Arabic, Tajiki Spoken': '_arabic',
      'Arabic, Tunisian Spoken': '_arabic',
      'Arabic, Uzbeki Spoken': '_arabic',
      Boma: '_boma',
      Didinga: '_didinga',
      French: '_french',
      'French, Cajun': '_french',
      'Guadeloupean Creole French': '_french',
      'Guianese Creole French': '_french',
      'Haitian Creole French': '_french',
      'Karipúna Creole French': '_french',
      'Louisiana Creole French': '_french',
      'Réunion Creole French': '_french',
      'San Miguel Creole French': '_french',
      'Seselwa Creole French': '_french',
      'St. Lucian Creole French': '_french',
      Karamojong: '_karamojong',
      'Fuliiru, Kifulero': '_kifulero',
      'Kituba, Kikongo': '_kikongo',
      'Kongo, Kikongo, Congo': '_kikongo',
      Kinyabwisha: '_kinyabiyisha',
      'Rwanda, Kinyarwanda': '_kinyarwanda',
      'Rundi, Kirundi': '_kirundi',
      Lingala: '_lingala',
      Lokoya: '_lokoya',
      Lopit: '_lopit',
      Luo: '_luo',
      Makonde: '_makonde',
      Mashi: '_mashi',
      Mashi: '_mashi',
      Moro: '_moro',
      Murle: '_murle',
      'Oromo, Borana-arsi-guji': '_oromo',
      'Oromo, Eastern': '_oromo',
      'Oromo, West-central': '_oromo',
      'Adamorobe Sign Language': '_sign_language',
      'Algerian Sign Language': '_sign_language',
      'American Sign Language': '_sign_language',
      'Arabic Sign Language': '_sign_language',
      'Argentine Sign Language': '_sign_language',
      'Armenian Sign Language': '_sign_language',
      'Australian Aborigines Sign Language': '_sign_language',
      'Australian Sign Language': '_sign_language',
      'Austrian Sign Language': '_sign_language',
      'Bali Sign Language': '_sign_language',
      'Bamako Sign Language': '_sign_language',
      'Ban Khor Sign Language': '_sign_language',
      'Belgian Sign Language': '_sign_language',
      'Bolivian Sign Language': '_sign_language',
      'Brazilian Sign Language': '_sign_language',
      'British Sign Language': '_sign_language',
      'Bulgarian Sign Language': '_sign_language',
      'Catalonian Sign Language': '_sign_language',
      'Chadian Sign Language': '_sign_language',
      'Chiangmai Sign Language': '_sign_language',
      'Chilean Sign Language': '_sign_language',
      'Chinese Sign Language': '_sign_language',
      'Colombian Sign Language': '_sign_language',
      'Costa Rican Sign Language': '_sign_language',
      'Czech Sign Language': '_sign_language',
      'Danish Sign Language': '_sign_language',
      'Dominican Sign Language': '_sign_language',
      'Dutch Sign Language': '_sign_language',
      'Ecuadorian Sign Language': '_sign_language',
      'Estonian Sign Language': '_sign_language',
      'Ethiopian Sign Language': '_sign_language',
      'Finnish Sign Language': '_sign_language',
      'Finnish-Swedish Sign Language': '_sign_language',
      'French Sign Language': '_sign_language',
      'German Sign Language': '_sign_language',
      'Ghanaian Sign Language': '_sign_language',
      'Greek Sign Language': '_sign_language',
      'Guatemalan Sign Language': '_sign_language',
      'Guinean Sign Language': '_sign_language',
      'Haiphong Sign Language': '_sign_language',
      'Hanoi Sign Language': '_sign_language',
      'Hausa Sign Language': '_sign_language',
      "Hawai'i Pidgin Sign Language": '_sign_language',
      'Ho Chi Minh City Sign Language': '_sign_language',
      'Hungarian Sign Language': '_sign_language',
      'Icelandic Sign Language': '_sign_language',
      'Indian Sign Language': '_sign_language',
      'Indonesian Sign Language': '_sign_language',
      'International Sign Language': '_sign_language',
      'Irish Sign Language': '_sign_language',
      'Israeli Sign Language': '_sign_language',
      'Italian Sign Language': '_sign_language',
      'Jamaican Country Sign Language': '_sign_language',
      'Japanese Sign Language': '_sign_language',
      'Jordanian Sign Language': '_sign_language',
      'Kenyan Sign Language': '_sign_language',
      'Korean Sign Language': '_sign_language',
      'Kuala Lumpur Sign Language': '_sign_language',
      'Laos Sign Language': '_sign_language',
      'Latvian Sign Language': '_sign_language',
      'Libyan Sign Language': '_sign_language',
      'Lithuanian Sign Language': '_sign_language',
      'Lyons Sign Language': '_sign_language',
      'Madagascar Sign Language': '_sign_language',
      'Malaysian Sign Language': '_sign_language',
      'Maltese Sign Language': '_sign_language',
      'Maritime Sign Language': '_sign_language',
      "Martha's Vineyard Sign Language": '_sign_language',
      'Mexican Sign Language': '_sign_language',
      'Monastic Sign Language': '_sign_language',
      'Mongolian Sign Language': '_sign_language',
      'Moroccan Sign Language': '_sign_language',
      'Mozambican Sign Language': '_sign_language',
      'Namibian Sign Language': '_sign_language',
      'Nepalese Sign Language': '_sign_language',
      'New Zealand Sign Language': '_sign_language',
      'Nicaraguan Sign Language': '_sign_language',
      'Nigerian Sign Language': '_sign_language',
      'Norwegian Sign Language': '_sign_language',
      'Old Kentish Sign Language': '_sign_language',
      'Pakistan Sign Language': '_sign_language',
      'Penang Sign Language': '_sign_language',
      'Persian Sign Language': '_sign_language',
      'Peruvian Sign Language': '_sign_language',
      'Philippine Sign Language': '_sign_language',
      'Plains Indian Sign Language': '_sign_language',
      'Polish Sign Language': '_sign_language',
      'Portuguese Sign Language': '_sign_language',
      'Providencia Sign Language': '_sign_language',
      'Puerto Rican Sign Language': '_sign_language',
      'Quebec Sign Language': '_sign_language',
      'Rennellese Sign Language': '_sign_language',
      'Romanian Sign Language': '_sign_language',
      'Russian Sign Language': '_sign_language',
      'Salvadoran Sign Language': '_sign_language',
      'Saudi Arabian Sign Language': '_sign_language',
      'Sierra Leone Sign Language': '_sign_language',
      'Singapore Sign Language': '_sign_language',
      'Slovakian Sign Language': '_sign_language',
      'South African Sign Language': '_sign_language',
      'Spanish Sign Language': '_sign_language',
      'Sri Lankan Sign Language': '_sign_language',
      'Swedish Sign Language': '_sign_language',
      'Swiss-french Sign Language': '_sign_language',
      'Swiss-german Sign Language': '_sign_language',
      'Swiss-italian Sign Language': '_sign_language',
      'Taiwanese Sign Language': '_sign_language',
      'Tanzanian Sign Language': '_sign_language',
      'Thai Sign Language': '_sign_language',
      'Tunisian Sign Language': '_sign_language',
      'Turkish Sign Language': '_sign_language',
      'Ugandan Sign Language': '_sign_language',
      'Ukrainian Sign Language': '_sign_language',
      'Urubú-kaapor Sign Language': '_sign_language',
      'Uruguayan Sign Language': '_sign_language',
      'Venezuelan Sign Language': '_sign_language',
      'Yiddish Sign Language': '_sign_language',
      'Yucatec Maya Sign Language': '_sign_language',
      'Yugoslavian Sign Language': '_sign_language',
      'Zambian Sign Language': '_sign_language',
      'Zimbabwe Sign Language': '_sign_language',
      Tira: '_tira',
      Toposa: '_toposa',
      Toro: '_toro',
      'Cutchi-swahili': 'language1',
      Swahili: 'language1',
      'Swahili, Congo': 'language1',
      Acholi: 'language10',
      'Dinka, Northeastern': 'language2',
      'Dinka, Northwestern; Alor': 'language2',
      'Dinka, South Central': 'language2',
      'Dinka, Southeastern;': 'language2',
      'Dinka, Southwestern; Rek': 'language2',
      Nuer: 'language3',
      Bari: 'language4',
      Bari: 'language4',
      Zande: 'language5',
      'Bahamas Creole English': 'language6',
      'Belize Kriol English': 'language6',
      'Chinese Pidgin English': 'language6',
      English: 'language6',
      'Fernando Po Creole English': 'language6',
      'Guyanese Creole English': 'language6',
      "Hawai'i Creole English": 'language6',
      'Islander Creole English': 'language6',
      'Jamaican Creole English': 'language6',
      'Liberian English': 'language6',
      'Montserat Creole English': 'language6',
      'Nicaragua Creole English': 'language6',
      'Sea Island Creole English': 'language6',
      'Tobagonian Creole English': 'language6',
      'Trinidadian Creole English': 'language6',
      'Turks And Caicos Creole English': 'language6',
      'Vincentian Creole English': 'language6',
      'Virgin Islands Creole English': 'language6',
      Bembe: 'language7',
      Somali: 'language8',
    };

    let lang = [];
    lang.push(
      data['languages.progres_languagecodeid']
        ? languageMap[data['languages.progres_languagecodeid'].Name] ||
            'if_other_language__please_specify_335944b'
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

    const progres_description = data['interventiontype.progres_description'];
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
    // =======================================================

    if (!provided) {
      throw new Error(
        `Intervention referral is missing fields required for sending to Primero: ${missingFields.join(
          ','
        )}. Please include missing fields and re-send the request`
      );
    }

    const body = {
      progres_interventionnumber: data.progres_interventionnumber,
      // service_type: data.progres_interventiontype2,
      services_section: [
        {
          service_response_day_time: data.progres_interventionstartdate,
          service_request_external: true, //Confirm primero mapping
          service_referral_notes: data.progres_comments_nonrestrictedstore, //confirm mapping
          service_request_title: data['user.title'],
          service_request_agency: data['user.progres_partner']
            ? data['user.progres_partner']
            : 'UNICEF',
          service_request_phone: data['user.mobilephone'],
          service_request_email: data['user.internalemailaddress'],
          service_referral_notes: data.progres_interventionbyother, // Reason for referral ?
          service_type: serviceMap[progres_description], //Replaces: progres_interventiontype2
          service_implementing_agency:
            data.progres_businessunit === 'd69e8ec1-e80b-e611-80d3-001dd8b71f12'
              ? 'UNICEF'
              : 'UNICEF', //To confirm no more BUs to map
          service_response_type: 'service_provision',
          service_referral: 'external_referral',
        },
      ],
      //closure_reason: data.progres_comments_nonrestrictedstore,
      unhcr_individual_no: data['individuals.progres_id'],
      unhcr_id_no: data['individuals.progres_registrationgroupid'].Name,
      name_first: data['individuals.progres_givenname'],
      name_middle: data['individuals.progres_middlename'],
      name_last: data['individuals.progres_familyname'],
      name_nickname: data['individuals.progres_id_commonyusedname'],
      date_of_birth: data['individuals.progres_dateofbirth'].split('T')[0],
      age: data['individuals.progres_dateofbirth']
        ? calculateAge(new Date(data['individuals.progres_dateofbirth']))
        : undefined,
      sex: data['individuals.progres_sex'] ? sexMap[progres_sex] : undefined,
      address_current, //TODO; Contactenate locationlevel1, 2, ...6 (comma separated)
      telephone_current: data['individuals.progres_primaryphonenumber'],
      protection_concerns: protection[0] ? protection : null, //TODO; Confirm protecton mapping works
      language: lang[0] ? lang : null, //TODO; Confirm language mapping works
      status: 'open',
      module_id: 'primeromodule-cp', //hardcode default - to confirm
      remote: true, //hardcode default
      case_id: data.progres_primeroid ? data.progres_primeroid : undefined, // Advise on mapping
      assigned_user_names: ['unhcr_cw'],
      owned_by: 'unhcr_cw',
      created_by: 'open_function', //Confirm if we set this on update?
      //created_by_source: '', // advise on mapping
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
                registration_date: new Date().toISOString(), // set on creation
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
