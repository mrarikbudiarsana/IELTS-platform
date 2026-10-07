import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from './db';
import {
  ListeningPart,
  QuestionGroup,
  ListeningAudioConfig,
} from '../shared/types';
import { createListeningTest, publishListeningTestVersion } from './listeningService';

export function seedListeningDatabase() {
  initDatabase();

  const existingListening = db.prepare('SELECT COUNT(*) as count FROM listening_tests').get() as any;
  if (existingListening.count > 0) {
    console.log('Listening tests already seeded, skipping.');
    return;
  }

  const adminRow = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any;
  const adminId = adminRow ? adminRow.id : uuidv4();

  console.log('Seeding official IELTS Listening demonstration tests...');

  // -------------------------------------------------------------
  // TEST 1: Complete Four-Part IELTS Listening Demonstration Mock (40 Questions)
  // -------------------------------------------------------------
  const mockParts: ListeningPart[] = [
    {
      id: 'l_part1',
      partNumber: 1,
      title: 'Part 1: Crestview Car & Caravan Hire Reservation',
      context: 'A customer phones a car hire agency to arrange a holiday booking.',
      audioUrl: '/audio/listening_part1_car_rental.wav',
      containsIntroPauses: false,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript:
        'Good morning, Crestview Car and Caravan Hire. How may I help you? Hello, I would like to arrange vehicle hire for a small family holiday starting on 14th October. Certainly, could I take your full surname, please? Yes, it is Campbell, that is C-A-M-P-B-E-L-L. And your contact telephone number? It is 0418 923 774. Thank you. Now, what type of vehicle are you looking for? We need a small model, perhaps an automatic transmission. Understood. For the driver\'s license number, please? It is DL-58832. Perfect. For our vehicle options, the Compact Cruiser costs 65 dollars per day with a minimum deposit of 150 dollars. It includes unlimited mileage and complimentary baby seat hire. For extra luggage, we can attach an external roof box for 15 dollars extra. All vehicles must be returned with a full fuel tank.',
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 15, quote: 'Yes, it is Campbell, that is C-A-M-P-B-E-L-L.' },
        { questionNumber: 2, timestampSeconds: 9, quote: 'holiday starting on 14th October' },
        { questionNumber: 3, timestampSeconds: 22, quote: 'It is 0418 923 774.' },
        { questionNumber: 4, timestampSeconds: 28, quote: 'perhaps an automatic transmission' },
        { questionNumber: 5, timestampSeconds: 34, quote: 'It is DL-58832.' },
        { questionNumber: 6, timestampSeconds: 42, quote: 'minimum deposit of 150 dollars' },
        { questionNumber: 7, timestampSeconds: 38, quote: 'Compact Cruiser costs 65 dollars per day' },
        { questionNumber: 8, timestampSeconds: 46, quote: 'complimentary baby seat hire' },
        { questionNumber: 9, timestampSeconds: 51, quote: 'attach an external roof box' },
        { questionNumber: 10, timestampSeconds: 56, quote: 'returned with a full fuel tank' },
      ],
    },
    {
      id: 'l_part2',
      partNumber: 2,
      title: 'Part 2: Riverside Wildlife Sanctuary Tour',
      context: 'A sanctuary officer welcomes visitors and guides them through the park map.',
      audioUrl: '/audio/listening_part2_park_tour.wav',
      containsIntroPauses: false,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript:
        'Welcome to the Riverside Heritage and Wildlife Sanctuary. Before you begin your walk, let me orient you to our main facilities using the map. You are currently standing at the Main Entrance at the bottom of the map. Directly to your right, across from the ticket kiosk, location A is the Wildlife Information Centre. If you follow the main paved path northward toward the lake, on the western bank at location C is the Bird Hide. Continuing past the footbridge along the eastern boundary, location E is the Woodland Picnic Meadow, featuring covered benches and recycling bins. Just north of the picnic area, tucked behind the old watermill at location G, you will discover the Children\'s Nature Playground. Regarding opening hours, our sanctuary closes at 18:30 on weekdays and 19:00 on weekends. Guided birdwatching walks depart from the café terrace every Saturday morning at 10:00 AM. Visitors are kindly reminded that dogs must be kept on a lead at all times, and cycling is permitted only on designated tarmac paths.',
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 16, quote: 'location A is the Wildlife Information Centre' },
        { questionNumber: 12, timestampSeconds: 23, quote: 'on the western bank at location C is the Bird Hide' },
        { questionNumber: 13, timestampSeconds: 29, quote: 'location E is the Woodland Picnic Meadow' },
        { questionNumber: 14, timestampSeconds: 37, quote: 'location G, you will discover the Children\'s Nature Playground' },
        { questionNumber: 15, timestampSeconds: 27, quote: 'Continuing past the footbridge along the eastern boundary' },
        { questionNumber: 16, timestampSeconds: 42, quote: 'sanctuary closes at 18:30 on weekdays' },
        { questionNumber: 17, timestampSeconds: 47, quote: 'walks depart from the café terrace' },
        { questionNumber: 18, timestampSeconds: 50, quote: 'every Saturday morning at 10:00 AM' },
        { questionNumber: 19, timestampSeconds: 53, quote: 'dogs must be kept on a lead at all times' },
        { questionNumber: 20, timestampSeconds: 56, quote: 'cycling is permitted only on designated tarmac paths' },
      ],
    },
    {
      id: 'l_part3',
      partNumber: 3,
      title: 'Part 3: Tidal Energy Field Research Proposal',
      context: 'Two undergraduate students consult their supervisor about methodology.',
      audioUrl: '/audio/listening_part3_student_project.wav',
      containsIntroPauses: false,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript:
        'Hello Michael and Sarah, thanks for coming in to discuss your field research proposal on coastal tidal energy. Have you finalized your data collection methodology? Yes, Dr. Higgins. Initially, we planned to conduct postal surveys, but Sarah suggested that face-to-face structured interviews would yield a significantly higher completion rate and allow us to clarify technical jargon. Michael felt that analyzing local newspaper archives would show historical flood frequency, while I was more keen on satellite imagery. Regarding our tidal flow measurements, we have established a five-step procedure. Step one is to calibrate the acoustic water-flow meter in the laboratory tank. Step two involves deploying submersible sensors at selected estuary coordinates. In step three, we will log tidal velocities at twelve-hour intervals across high and low tides. Step four requires filtering anomalous wave spikes from the raw digital log. Finally, in step five, we will calculate net turbine power output using our hydrodynamic simulation software.',
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 14, quote: 'Sarah suggested that face-to-face structured interviews would yield a higher completion rate' },
        { questionNumber: 22, timestampSeconds: 21, quote: 'Michael felt that analyzing local newspaper archives would show flood frequency' },
        { questionNumber: 23, timestampSeconds: 26, quote: 'while I was more keen on satellite imagery' },
        { questionNumber: 24, timestampSeconds: 32, quote: 'Step one is to calibrate the acoustic water-flow meter' },
        { questionNumber: 25, timestampSeconds: 52, quote: 'in step five, we will calculate net turbine power output' },
        { questionNumber: 26, timestampSeconds: 34, quote: 'calibrate the acoustic water-flow meter' },
        { questionNumber: 27, timestampSeconds: 38, quote: 'deploying submersible sensors' },
        { questionNumber: 28, timestampSeconds: 43, quote: 'log tidal velocities at twelve-hour intervals' },
        { questionNumber: 29, timestampSeconds: 47, quote: 'filtering anomalous wave spikes' },
        { questionNumber: 30, timestampSeconds: 53, quote: 'calculate net turbine power output' },
      ],
    },
    {
      id: 'l_part4',
      partNumber: 4,
      title: 'Part 4: Geothermal Ground-Source Heat Pump Systems',
      context: 'An engineering university lecture on municipal ground-source heating.',
      audioUrl: '/audio/listening_part4_geothermal_lecture.wav',
      containsIntroPauses: false,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript:
        'In today\'s lecture on low-carbon municipal heating, we will examine closed-loop horizontal ground-source heat pump installations. Unlike traditional fossil gas boilers which generate heat through combustion, geothermal heat pumps transfer latent thermal energy from subterranean strata into domestic hydronic circuits. A critical engineering parameter is the loop depth. Pipes buried less than 1.5 meters underground are vulnerable to seasonal frost penetration, which drastically diminishes thermal exchange efficiency. The circulating heat transfer fluid consists of water mixed with non-toxic propylene glycol, preventing freezing while safeguarding local groundwater aquifers. To optimize heat transfer, contractors embed the coiled polyethylene tubing in bentonite clay backfill rather than loose gravel. Over a twenty-year operational lifespan, municipal retrofit programs in Scandinavia achieved an average reduction in residential carbon emissions of 64 percent. The primary financial obstacle remains the upfront installation cost, though lifecycle operating expenses are approximately 40 percent lower than electric resistance heating.',
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 15, quote: 'latent thermal energy from subterranean strata' },
        { questionNumber: 32, timestampSeconds: 22, quote: 'Pipes buried less than 1.5 meters underground' },
        { questionNumber: 33, timestampSeconds: 31, quote: 'water mixed with non-toxic propylene glycol' },
        { questionNumber: 34, timestampSeconds: 41, quote: 'embed the coiled polyethylene tubing in bentonite clay' },
        { questionNumber: 35, timestampSeconds: 48, quote: 'average reduction in residential carbon emissions of 64 percent' },
        { questionNumber: 36, timestampSeconds: 10, quote: 'boilers which generate heat through combustion' },
        { questionNumber: 37, timestampSeconds: 53, quote: 'primary financial obstacle remains the upfront installation cost' },
        { questionNumber: 38, timestampSeconds: 58, quote: 'operating expenses are approximately 40 percent lower' },
        { questionNumber: 39, timestampSeconds: 34, quote: 'safeguarding local groundwater aquifers' },
        { questionNumber: 40, timestampSeconds: 40, quote: 'coiled polyethylene tubing' },
      ],
    },
  ];

  const mockGroups: QuestionGroup[] = [
    // PART 1: Group 1 (Q1-Q6): Form Completion
    {
      id: 'lg_1',
      partNumber: 1,
      questionType: 'form_completion',
      title: 'Questions 1–6',
      instructions:
        'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      formData: {
        formTitle: 'Crestview Car & Caravan Hire — Customer Reservation Form',
        fields: [
          { label: 'Customer Surname:', isGap: true, questionNumber: 1 },
          { label: 'Holiday Start Date:', isGap: true, questionNumber: 2 },
          { label: 'Contact Telephone:', isGap: true, questionNumber: 3 },
          { label: 'Transmission preference:', isGap: true, questionNumber: 4 },
          { label: 'Driver License Number:', isGap: true, questionNumber: 5 },
          { label: 'Security deposit: $', isGap: true, questionNumber: 6 },
        ],
      },
      questions: [
        {
          id: 'lq_1',
          questionNumber: 1,
          prompt: 'Customer Surname:',
          answerKey: 'Campbell',
          acceptedAlternatives: ['Campbell'],
          explanation: 'Customer spells surname: C-A-M-P-B-E-L-L.',
          transcriptExcerpt: 'Yes, it is Campbell, that is C-A-M-P-B-E-L-L.',
          audioTimestampSeconds: 15,
        },
        {
          id: 'lq_2',
          questionNumber: 2,
          prompt: 'Holiday Start Date:',
          answerKey: '14th October',
          acceptedAlternatives: ['14 October', 'October 14', '14th Oct'],
          explanation: 'Customer mentions vehicle hire starting on 14th October.',
          transcriptExcerpt: 'starting on 14th October',
          audioTimestampSeconds: 9,
        },
        {
          id: 'lq_3',
          questionNumber: 3,
          prompt: 'Contact Telephone:',
          answerKey: '0418 923 774',
          acceptedAlternatives: ['0418923774', '0418 923 774'],
          explanation: 'Phone number given: 0418 923 774.',
          transcriptExcerpt: 'It is 0418 923 774.',
          audioTimestampSeconds: 22,
        },
        {
          id: 'lq_4',
          questionNumber: 4,
          prompt: 'Transmission preference:',
          answerKey: 'automatic',
          acceptedAlternatives: ['automatic'],
          explanation: 'Customer asks for automatic transmission.',
          transcriptExcerpt: 'perhaps an automatic transmission',
          audioTimestampSeconds: 28,
        },
        {
          id: 'lq_5',
          questionNumber: 5,
          prompt: 'Driver License Number:',
          answerKey: 'DL-58832',
          acceptedAlternatives: ['DL58832', 'DL-58832'],
          explanation: 'Driver license code: DL-58832.',
          transcriptExcerpt: 'It is DL-58832.',
          audioTimestampSeconds: 34,
        },
        {
          id: 'lq_6',
          questionNumber: 6,
          prompt: 'Security deposit: $',
          answerKey: '150',
          acceptedAlternatives: ['150', '$150', 'one hundred and fifty'],
          explanation: 'Deposit requirement is $150.',
          transcriptExcerpt: 'minimum deposit of 150 dollars',
          audioTimestampSeconds: 42,
        },
      ],
    },
    // PART 1: Group 2 (Q7-Q10): Table Completion
    {
      id: 'lg_2',
      partNumber: 1,
      questionType: 'table_completion',
      title: 'Questions 7–10',
      instructions:
        'Complete the table below.\nWrite NO MORE THAN TWO WORDS AND/OR A NUMBER for each answer.',
      startQuestionNumber: 7,
      endQuestionNumber: 10,
      wordLimitRule: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      maxWords: 2,
      maxNumbers: 1,
      tableData: {
        headers: ['Vehicle Package', 'Daily Rate', 'Included Perks', 'Special Condition'],
        rows: [
          {
            cells: [
              { content: 'Compact Cruiser' },
              { content: '$[[7]] / day', isGap: true, questionNumber: 7 },
              { content: 'Unlimited mileage' },
              { content: 'Return with [[10]] tank', isGap: true, questionNumber: 10 },
            ],
          },
          {
            cells: [
              { content: 'Family Explorer' },
              { content: '$85 / day' },
              { content: 'Complimentary [[8]] hire', isGap: true, questionNumber: 8 },
              { content: 'Optional [[9]] ($15)', isGap: true, questionNumber: 9 },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'lq_7',
          questionNumber: 7,
          prompt: 'Daily rate for Compact Cruiser: $',
          answerKey: '65',
          acceptedAlternatives: ['65', '$65', 'sixty-five'],
          explanation: 'Compact Cruiser daily fee is $65.',
          transcriptExcerpt: 'Compact Cruiser costs 65 dollars per day',
          audioTimestampSeconds: 38,
        },
        {
          id: 'lq_8',
          questionNumber: 8,
          prompt: 'Complimentary equipment hire:',
          answerKey: 'baby seat',
          acceptedAlternatives: ['baby seat', 'infant seat'],
          explanation: 'Package includes complimentary baby seat hire.',
          transcriptExcerpt: 'complimentary baby seat hire',
          audioTimestampSeconds: 46,
        },
        {
          id: 'lq_9',
          questionNumber: 9,
          prompt: 'Optional extra luggage accessory ($15):',
          answerKey: 'roof box',
          acceptedAlternatives: ['roof box', 'external roof box'],
          explanation: 'Roof box accessory costs $15 extra.',
          transcriptExcerpt: 'attach an external roof box',
          audioTimestampSeconds: 51,
        },
        {
          id: 'lq_10',
          questionNumber: 10,
          prompt: 'Tank return condition:',
          answerKey: 'full',
          acceptedAlternatives: ['full', 'full fuel'],
          explanation: 'Vehicles must be returned with a full fuel tank.',
          transcriptExcerpt: 'returned with a full fuel tank',
          audioTimestampSeconds: 56,
        },
      ],
    },
    // PART 2: Group 3 (Q11-Q15): Plan, Map, and Diagram Labelling
    {
      id: 'lg_3',
      partNumber: 2,
      questionType: 'plan_map_diagram_labelling',
      title: 'Questions 11–15',
      instructions:
        'Label the map below.\nWrite the correct letter, A–G, next to Questions 11–15.',
      startQuestionNumber: 11,
      endQuestionNumber: 15,
      mapData: {
        imageUrl: '/diagrams/riverside_park_map.svg',
        caption: 'Riverside Heritage and Wildlife Sanctuary Map',
        locations: [
          { key: 'A', label: 'Near Main Entrance (East)', xPercent: 62, yPercent: 88 },
          { key: 'B', label: 'Café Terrace (Southeast Lake)', xPercent: 74, yPercent: 71 },
          { key: 'C', label: 'Western Lake Shore', xPercent: 30, yPercent: 45 },
          { key: 'D', label: 'Footbridge over River', xPercent: 15, yPercent: 62 },
          { key: 'E', label: 'Woodland Picnic Meadow (East)', xPercent: 82, yPercent: 43 },
          { key: 'F', label: 'Historic Watermill', xPercent: 69, yPercent: 20 },
          { key: 'G', label: 'Behind Watermill (North)', xPercent: 81, yPercent: 17 },
        ],
      },
      optionsList: [
        { key: 'A', text: 'Location A' },
        { key: 'B', text: 'Location B' },
        { key: 'C', text: 'Location C' },
        { key: 'D', text: 'Location D' },
        { key: 'E', text: 'Location E' },
        { key: 'F', text: 'Location F' },
        { key: 'G', text: 'Location G' },
      ],
      questions: [
        {
          id: 'lq_11',
          questionNumber: 11,
          prompt: 'Wildlife Information Centre',
          answerKey: 'A',
          explanation: 'Directly right of entrance, across ticket kiosk: location A.',
          transcriptExcerpt: 'location A is the Wildlife Information Centre',
          audioTimestampSeconds: 16,
        },
        {
          id: 'lq_12',
          questionNumber: 12,
          prompt: 'Bird Hide',
          answerKey: 'C',
          explanation: 'On western bank of lake: location C.',
          transcriptExcerpt: 'on the western bank at location C is the Bird Hide',
          audioTimestampSeconds: 23,
        },
        {
          id: 'lq_13',
          questionNumber: 13,
          prompt: 'Woodland Picnic Meadow',
          answerKey: 'E',
          explanation: 'Eastern boundary with covered benches: location E.',
          transcriptExcerpt: 'location E is the Woodland Picnic Meadow',
          audioTimestampSeconds: 29,
        },
        {
          id: 'lq_14',
          questionNumber: 14,
          prompt: 'Children’s Nature Playground',
          answerKey: 'G',
          explanation: 'North of picnic area behind old watermill: location G.',
          transcriptExcerpt: 'tucked behind the old watermill at location G',
          audioTimestampSeconds: 37,
        },
        {
          id: 'lq_15',
          questionNumber: 15,
          prompt: 'River Footbridge',
          answerKey: 'D',
          explanation: 'Western trail bridge across River Dale: location D.',
          transcriptExcerpt: 'Continuing past the footbridge along the eastern boundary',
          audioTimestampSeconds: 27,
        },
      ],
    },
    // PART 2: Group 4 (Q16-Q18): Multiple Choice Single
    {
      id: 'lg_4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 16–18',
      instructions: 'Choose the correct letter, A, B, or C.',
      startQuestionNumber: 16,
      endQuestionNumber: 18,
      questions: [
        {
          id: 'lq_16',
          questionNumber: 16,
          prompt: 'What time does the sanctuary close on weekdays?',
          options: [
            { key: 'A', text: '18:00' },
            { key: 'B', text: '18:30' },
            { key: 'C', text: '19:00' },
          ],
          answerKey: 'B',
          explanation: 'Officer states closes at 18:30 on weekdays and 19:00 on weekends.',
          transcriptExcerpt: 'closes at 18:30 on weekdays',
          audioTimestampSeconds: 42,
        },
        {
          id: 'lq_17',
          questionNumber: 17,
          prompt: 'Where do guided birdwatching walks meet?',
          options: [
            { key: 'A', text: 'On the café terrace' },
            { key: 'B', text: 'At the bird hide' },
            { key: 'C', text: 'By the main entrance gate' },
          ],
          answerKey: 'A',
          explanation: 'Walks depart from the café terrace.',
          transcriptExcerpt: 'depart from the café terrace',
          audioTimestampSeconds: 47,
        },
        {
          id: 'lq_18',
          questionNumber: 18,
          prompt: 'When do guided walks take place?',
          options: [
            { key: 'A', text: 'Daily at 14:00' },
            { key: 'B', text: 'Every Sunday afternoon' },
            { key: 'C', text: 'Every Saturday morning' },
          ],
          answerKey: 'C',
          explanation: 'Depart every Saturday morning at 10:00 AM.',
          transcriptExcerpt: 'every Saturday morning at 10:00 AM',
          audioTimestampSeconds: 50,
        },
      ],
    },
    // PART 2: Group 5 (Q19-Q20): Multiple Choice Multi-Select
    {
      id: 'lg_5',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 19–20',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO rules must visitors follow inside the sanctuary?',
      startQuestionNumber: 19,
      endQuestionNumber: 20,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'lq_19_20_a',
          questionNumber: 19,
          prompt: 'Select the first visitor rule:',
          options: [
            { key: 'A', text: 'No photography allowed near the water.' },
            { key: 'B', text: 'Dogs must be kept on a lead at all times.' },
            { key: 'C', text: 'Picnicking is banned on grass lawns.' },
            { key: 'D', text: 'Cycling is restricted to designated tarmac paths.' },
            { key: 'E', text: 'Children under 16 must wear life vests.' },
          ],
          answerKey: ['B', 'D'],
          explanation: 'Officer states dogs must be on lead (B) and cycling on tarmac paths only (D).',
          transcriptExcerpt: 'dogs must be kept on a lead at all times, and cycling is permitted only on designated tarmac paths',
          audioTimestampSeconds: 54,
        },
        {
          id: 'lq_19_20_b',
          questionNumber: 20,
          prompt: 'Select the second visitor rule:',
          options: [
            { key: 'A', text: 'No photography allowed near the water.' },
            { key: 'B', text: 'Dogs must be kept on a lead at all times.' },
            { key: 'C', text: 'Picnicking is banned on grass lawns.' },
            { key: 'D', text: 'Cycling is restricted to designated tarmac paths.' },
            { key: 'E', text: 'Children under 16 must wear life vests.' },
          ],
          answerKey: ['B', 'D'],
          explanation: 'Officer states dogs must be on lead (B) and cycling on tarmac paths only (D).',
          transcriptExcerpt: 'dogs must be kept on a lead at all times, and cycling is permitted only on designated tarmac paths',
          audioTimestampSeconds: 54,
        },
      ],
    },
    // PART 3: Group 6 (Q21-Q25): Matching
    {
      id: 'lg_6',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 21–25',
      instructions:
        'What opinion do the students express about each research technique?\nChoose FIVE answers from the box and write the correct letter, A–C, next to Questions 21–25.',
      startQuestionNumber: 21,
      endQuestionNumber: 25,
      optionsList: [
        { key: 'A', text: 'Michael proposed it initially' },
        { key: 'B', text: 'Sarah suggested it as a superior alternative' },
        { key: 'C', text: 'Both students agreed it is necessary' },
      ],
      questions: [
        {
          id: 'lq_21',
          questionNumber: 21,
          prompt: 'Face-to-face structured interviews',
          answerKey: 'B',
          explanation: 'Sarah suggested face-to-face interviews to get higher completion.',
          transcriptExcerpt: 'Sarah suggested that face-to-face structured interviews would yield a significantly higher completion rate',
          audioTimestampSeconds: 14,
        },
        {
          id: 'lq_22',
          questionNumber: 22,
          prompt: 'Local newspaper archives analysis',
          answerKey: 'A',
          explanation: 'Michael felt analyzing newspaper archives would show flood history.',
          transcriptExcerpt: 'Michael felt that analyzing local newspaper archives would show historical flood frequency',
          audioTimestampSeconds: 21,
        },
        {
          id: 'lq_23',
          questionNumber: 23,
          prompt: 'Satellite imagery analysis',
          answerKey: 'B',
          explanation: 'Sarah was more keen on satellite imagery.',
          transcriptExcerpt: 'while I was more keen on satellite imagery',
          audioTimestampSeconds: 26,
        },
        {
          id: 'lq_24',
          questionNumber: 24,
          prompt: 'Laboratory water-tank calibration',
          answerKey: 'C',
          explanation: 'Both established calibrating meter as Step 1.',
          transcriptExcerpt: 'we have established a five-step procedure. Step one is to calibrate the acoustic water-flow meter',
          audioTimestampSeconds: 32,
        },
        {
          id: 'lq_25',
          questionNumber: 25,
          prompt: 'Hydrodynamic simulation modeling',
          answerKey: 'C',
          explanation: 'Both agree in Step 5 to calculate net turbine output with simulation.',
          transcriptExcerpt: 'in step five, we will calculate net turbine power output using our hydrodynamic simulation software',
          audioTimestampSeconds: 52,
        },
      ],
    },
    // PART 3: Group 7 (Q26-Q30): Flow-Chart Completion
    {
      id: 'lg_7',
      partNumber: 3,
      questionType: 'flow_chart_completion',
      title: 'Questions 26–30',
      instructions:
        'Complete the flow-chart below.\nWrite NO MORE THAN TWO WORDS for each answer.',
      startQuestionNumber: 26,
      endQuestionNumber: 30,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      flowChartSteps: [
        {
          stepNumber: 1,
          title: 'Step 1: Laboratory Preparation',
          descriptionWithGaps: 'Calibrate the acoustic [[26]] in the test tank.',
          questionNumbers: [26],
        },
        {
          stepNumber: 2,
          title: 'Step 2: Deployment',
          descriptionWithGaps: 'Install [[27]] sensors at estuary coordinates.',
          questionNumbers: [27],
        },
        {
          stepNumber: 3,
          title: 'Step 3: Data Logging',
          descriptionWithGaps: 'Record velocities at [[28]] intervals across tidal cycles.',
          questionNumbers: [28],
        },
        {
          stepNumber: 4,
          title: 'Step 4: Quality Filtering',
          descriptionWithGaps: 'Remove anomalous wave [[29]] from the raw stream.',
          questionNumbers: [29],
        },
        {
          stepNumber: 5,
          title: 'Step 5: Output Modeling',
          descriptionWithGaps: 'Calculate estimated turbine [[30]] using simulation tools.',
          questionNumbers: [30],
        },
      ],
      questions: [
        {
          id: 'lq_26',
          questionNumber: 26,
          prompt: 'Step 1 instrument: acoustic',
          answerKey: 'water-flow meter',
          acceptedAlternatives: ['water-flow meter', 'water flow meter', 'flow meter'],
          explanation: 'Step 1: calibrate acoustic water-flow meter.',
          transcriptExcerpt: 'calibrate the acoustic water-flow meter',
          audioTimestampSeconds: 34,
        },
        {
          id: 'lq_27',
          questionNumber: 27,
          prompt: 'Step 2 sensor type:',
          answerKey: 'submersible',
          acceptedAlternatives: ['submersible'],
          explanation: 'Step 2: deploying submersible sensors.',
          transcriptExcerpt: 'deploying submersible sensors',
          audioTimestampSeconds: 38,
        },
        {
          id: 'lq_28',
          questionNumber: 28,
          prompt: 'Step 3 interval duration:',
          answerKey: 'twelve-hour',
          acceptedAlternatives: ['12-hour', '12 hour', 'twelve hour'],
          explanation: 'Step 3: velocities at twelve-hour intervals.',
          transcriptExcerpt: 'log tidal velocities at twelve-hour intervals',
          audioTimestampSeconds: 43,
        },
        {
          id: 'lq_29',
          questionNumber: 29,
          prompt: 'Step 4 noise anomaly:',
          answerKey: 'spikes',
          acceptedAlternatives: ['spikes', 'wave spikes'],
          explanation: 'Step 4: filtering anomalous wave spikes.',
          transcriptExcerpt: 'filtering anomalous wave spikes',
          audioTimestampSeconds: 47,
        },
        {
          id: 'lq_30',
          questionNumber: 30,
          prompt: 'Step 5 calculation:',
          answerKey: 'power output',
          acceptedAlternatives: ['power output', 'output'],
          explanation: 'Step 5: calculate net turbine power output.',
          transcriptExcerpt: 'calculate net turbine power output',
          audioTimestampSeconds: 53,
        },
      ],
    },
    // PART 4: Group 8 (Q31-Q35): Note Completion
    {
      id: 'lg_8',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–35',
      instructions:
        'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 35,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps:
        'Ground-Source Heat Pump Installations:\n• Extracts latent thermal energy from [[31]] strata.\n• Pipes buried shallower than [[32]] metres are prone to frost damage.\n• Anti-freeze additive mixed with water: non-toxic [[33]].\n• High-efficiency thermal contact created using [[34]] clay.\n• Scandinavian municipal retrofits reduced carbon emissions by [[35]] percent.',
      questions: [
        {
          id: 'lq_31',
          questionNumber: 31,
          prompt: 'Strata type from which energy is extracted:',
          answerKey: 'subterranean',
          acceptedAlternatives: ['subterranean'],
          explanation: 'Energy transferred from subterranean strata.',
          transcriptExcerpt: 'latent thermal energy from subterranean strata',
          audioTimestampSeconds: 15,
        },
        {
          id: 'lq_32',
          questionNumber: 32,
          prompt: 'Minimum pipe depth in metres:',
          answerKey: '1.5',
          acceptedAlternatives: ['1.5', 'one point five'],
          explanation: 'Pipes buried less than 1.5 meters underground are vulnerable.',
          transcriptExcerpt: 'Pipes buried less than 1.5 meters underground',
          audioTimestampSeconds: 22,
        },
        {
          id: 'lq_33',
          questionNumber: 33,
          prompt: 'Circulating non-toxic fluid additive: propylene ________',
          answerKey: 'glycol',
          acceptedAlternatives: ['glycol'],
          explanation: 'Water mixed with non-toxic propylene glycol.',
          transcriptExcerpt: 'water mixed with non-toxic propylene glycol',
          audioTimestampSeconds: 31,
        },
        {
          id: 'lq_34',
          questionNumber: 34,
          prompt: 'Backfill clay type:',
          answerKey: 'bentonite',
          acceptedAlternatives: ['bentonite'],
          explanation: 'Coiled tubing embedded in bentonite clay backfill.',
          transcriptExcerpt: 'embed the coiled polyethylene tubing in bentonite clay',
          audioTimestampSeconds: 41,
        },
        {
          id: 'lq_35',
          questionNumber: 35,
          prompt: 'Scandinavia retrofit emissions drop percentage:',
          answerKey: '64',
          acceptedAlternatives: ['64', '64%', 'sixty-four'],
          explanation: 'Average reduction in carbon emissions of 64 percent.',
          transcriptExcerpt: 'average reduction in residential carbon emissions of 64 percent',
          audioTimestampSeconds: 48,
        },
      ],
    },
    // PART 4: Group 9 (Q36-Q38): Summary Completion
    {
      id: 'lg_9',
      partNumber: 4,
      questionType: 'summary_completion',
      title: 'Questions 36–38',
      instructions:
        'Complete the summary below.\nWrite NO MORE THAN TWO WORDS for each answer.',
      startQuestionNumber: 36,
      endQuestionNumber: 38,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      contentWithGaps:
        'Unlike fossil heating systems which rely directly on [[36]], closed-loop geothermal heat pumps transfer latent underground warmth. Although the primary barrier is the high [[37]], lifetime operational costs are roughly [[38]] percent lower than resistive electric systems.',
      questions: [
        {
          id: 'lq_36',
          questionNumber: 36,
          prompt: 'Fossil heating mechanism bypassed:',
          answerKey: 'combustion',
          acceptedAlternatives: ['combustion'],
          explanation: 'Fossil gas boilers generate heat through combustion.',
          transcriptExcerpt: 'boilers which generate heat through combustion',
          audioTimestampSeconds: 10,
        },
        {
          id: 'lq_37',
          questionNumber: 37,
          prompt: 'Primary initial barrier:',
          answerKey: 'installation cost',
          acceptedAlternatives: ['installation cost', 'upfront cost'],
          explanation: 'Primary obstacle remains upfront installation cost.',
          transcriptExcerpt: 'primary financial obstacle remains the upfront installation cost',
          audioTimestampSeconds: 53,
        },
        {
          id: 'lq_38',
          questionNumber: 38,
          prompt: 'Operating expense savings percentage:',
          answerKey: '40',
          acceptedAlternatives: ['40', 'forty'],
          explanation: 'Operating expenses are approximately 40 percent lower.',
          transcriptExcerpt: 'operating expenses are approximately 40 percent lower',
          audioTimestampSeconds: 58,
        },
      ],
    },
    // PART 4: Group 10 (Q39-Q40): Short-Answer Questions
    {
      id: 'lg_10',
      partNumber: 4,
      questionType: 'short_answer',
      title: 'Questions 39–40',
      instructions:
        'Answer the questions below.\nWrite NO MORE THAN TWO WORDS for each answer.',
      startQuestionNumber: 39,
      endQuestionNumber: 40,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      questions: [
        {
          id: 'lq_39',
          questionNumber: 39,
          prompt: 'What drinking water source is safeguarded by using non-toxic propylene glycol?',
          answerKey: 'groundwater aquifers',
          acceptedAlternatives: ['groundwater aquifers', 'groundwater', 'aquifers'],
          explanation: 'Lecture notes fluid safeguards local groundwater aquifers.',
          transcriptExcerpt: 'safeguarding local groundwater aquifers',
          audioTimestampSeconds: 34,
        },
        {
          id: 'lq_40',
          questionNumber: 40,
          prompt: 'What synthetic plastic material is used for the coiled subterranean tubing?',
          answerKey: 'polyethylene',
          acceptedAlternatives: ['polyethylene', 'polyethylene tubing'],
          explanation: 'Tubing is fabricated from coiled polyethylene.',
          transcriptExcerpt: 'coiled polyethylene tubing',
          audioTimestampSeconds: 40,
        },
      ],
    },
  ];

  const { test: mockTest, version: mockVersion } = createListeningTest({
    title: 'Official IELTS Listening Full Mock Examination 1',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 35,
    createdById: adminId,
    parts: mockParts,
    questionGroups: mockGroups,
    audioConfig: {
      audioMode: 'part_audios',
      postTestCheckTimeSeconds: 120,
    },
  });

  publishListeningTestVersion(mockTest.id, mockVersion.id);
  console.log('Published Complete 4-Part IELTS Listening Mock Examination 1 (40 Questions, all formats covered).');

  // -------------------------------------------------------------
  // TEST 2: Targeted Listening Practice Set (Part 1, 10 Questions)
  // -------------------------------------------------------------
  const practiceParts: ListeningPart[] = [
    {
      id: 'lp_part1',
      partNumber: 1,
      title: 'Part 1: Car Rental Inquiry & Booking',
      context: 'Customer booking consultation with Crestview Car Hire.',
      audioUrl: '/audio/listening_practice_part1.wav',
      containsIntroPauses: false,
      introPauseSeconds: 15,
      checkPauseSeconds: 30,
      transcript: mockParts[0].transcript,
      transcriptTimestamps: mockParts[0].transcriptTimestamps,
    },
  ];

  const practiceGroups: QuestionGroup[] = [
    mockGroups[0], // Q1-Q6 Form
    mockGroups[1], // Q7-Q10 Table
  ];

  const { test: practiceTest, version: practiceVersion } = createListeningTest({
    title: 'Listening Practice: Car Rental Form & Table Completion',
    category: 'practice',
    audioMode: 'part_audios',
    timeLimitMinutes: 15,
    createdById: adminId,
    parts: practiceParts,
    questionGroups: practiceGroups,
  });

  publishListeningTestVersion(practiceTest.id, practiceVersion.id);
  console.log('Published Targeted Listening Practice Set (10 Questions, Form & Table).');
}
