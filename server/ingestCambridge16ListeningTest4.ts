import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'cuts to public transport.' },
  { key: 'B', text: 'poor maintenance of roads.' },
  { key: 'C', text: 'changes in the type of traffic.' },
];

const MC_Q12_OPTIONS = [
  { key: 'A', text: 'It will be widened.' },
  { key: 'B', text: 'It will be extended.' },
  { key: 'C', text: 'It will be resurfaced.' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'the Post Office has moved.' },
  { key: 'B', text: 'the proposed location is unsafe.' },
  { key: 'C', text: 'funding is not available at present.' },
];

const MC_Q14_OPTIONS = [
  { key: 'A', text: 'telling cyclists not to leave their bikes outside the station ticket office.' },
  { key: 'B', text: 'asking motorists to switch off engines when waiting at the level crossing.' },
  { key: 'C', text: 'warning pedestrians to leave enough time when crossing the railway line.' },
];

const MAP_Q15_OPTIONS = [
  { key: 'A', text: 'Location A' },
  { key: 'B', text: 'Location B' },
  { key: 'C', text: 'Location C' },
  { key: 'D', text: 'Location D' },
  { key: 'E', text: 'Location E' },
  { key: 'F', text: 'Location F' },
  { key: 'G', text: 'Location G' },
  { key: 'H', text: 'Location H' },
  { key: 'I', text: 'Location I' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'reducing noise pollution' },
  { key: 'B', text: 'reducing traffic congestion' },
  { key: 'C', text: 'improving air quality' },
  { key: 'D', text: 'encouraging health and fitness' },
  { key: 'E', text: 'making cycling affordable' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'Bikes should have a GPS system.' },
  { key: 'B', text: 'The app should be easy to use.' },
  { key: 'C', text: 'Public awareness should be raised.' },
  { key: 'D', text: 'Only one scheme should be available.' },
  { key: 'E', text: 'There should be a large network of cycle lanes.' },
];

const MATCHING_Q25_OPTIONS = [
  { key: 'A', text: 'They agree it has been disappointing.' },
  { key: 'B', text: 'They think it should be cheaper.' },
  { key: 'C', text: 'They are surprised it has been so successful.' },
  { key: 'D', text: 'They agree that more investment is required.' },
  { key: 'E', text: 'They think the system has been well designed.' },
  { key: 'F', text: 'They disagree about the reasons for its success.' },
  { key: 'G', text: 'They think it has expanded too quickly.' },
];

export function getCambridge16ListeningTest4Data(): {
  title: string;
  category: 'mock';
  audioMode: 'part_audios';
  timeLimitMinutes: number;
  audioConfig: ListeningAudioConfig;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
} {
  const transcriptsPath = path.join(__dirname, 'c16_l4_transcripts.json');
  const transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf8')) as {
    part1: string;
    part2: string;
    part3: string;
    part4: string;
  };

  const parts: ListeningPart[] = [
    {
      id: 'c16-l4-p1',
      partNumber: 1,
      title: 'Part 1: Holiday rental',
      contextDescription:
        'A man named Tom calls Shirley Fitzgerald to enquire about renting a holiday cottage in May.',
      audioUrl: '/audio/listening/c16_test4_part1.mp3',
      durationSeconds: 185,
      transcript: transcripts.part1,
      questionRange: [1, 10],
    },
    {
      id: 'c16-l4-p2',
      partNumber: 2,
      title: 'Part 2: Local council report on traffic and highways',
      contextDescription:
        'Councillor Thornton presents the results of a local traffic survey and explains proposed improvements to the recreation ground.',
      audioUrl: '/audio/listening/c16_test4_part2.mp3',
      durationSeconds: 210,
      transcript: transcripts.part2,
      questionRange: [11, 20],
    },
    {
      id: 'c16-l4-p3',
      partNumber: 3,
      title: 'Part 3: City bike-sharing schemes',
      contextDescription:
        'Two students, Jake and Amy, discuss their research on city bike-sharing schemes around the world and evaluate examples from six cities.',
      audioUrl: '/audio/listening/c16_test4_part3.mp3',
      durationSeconds: 230,
      transcript: transcripts.part3,
      questionRange: [21, 30],
    },
    {
      id: 'c16-l4-p4',
      partNumber: 4,
      title: 'Part 4: The Extinction of the Dodo Bird',
      contextDescription:
        'A university lecturer discusses the history, physical characteristics, recent skeletal studies, and causes of extinction of the dodo bird on Mauritius.',
      audioUrl: '/audio/listening/c16_test4_part4.mp3',
      durationSeconds: 240,
      transcript: transcripts.part4,
      questionRange: [31, 40],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // =========================================================================
    // PART 1: Questions 1-10 (Note Completion)
    // =========================================================================
    {
      id: 'c16-l4-g1',
      partNumber: 1,
      questionType: 'note_completion',
      questionRange: [1, 10],
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: [
        'Holiday rental',
        '',
        'Owners\' names: Jack Fitzgerald and Shirley Fitzgerald',
        '',
        'Granary Cottage',
        '• available for week beginning [[1]] May',
        '• cost for the week: £[[2]]',
        '',
        '[[3]] Cottage',
        '• cost for the week: £480',
        '• building was originally a [[4]]',
        '• walk through doors from living room into a [[5]]',
        '• several [[6]] spaces at the front',
        '• bathroom has a shower',
        '• central heating and stove that burns [[7]]',
        '• views of old [[8]] from living room',
        '• view of hilltop [[9]] from the bedroom',
        '',
        'Payment',
        '• deposit: £144',
        '• deadline for final payment: end of [[10]]',
      ].join('\n'),
      questions: [
        {
          id: 'c16-l4-q1',
          questionNumber: 1,
          prompt: 'available for week beginning [1] May',
          answerKey: '28th',
          acceptedAlternatives: ['28th', '28', 'twenty-eighth'],
          explanation: 'Granary Cottage is already booked for the week beginning the 14th, and is only free the week beginning the 28th of May.',
          transcriptExcerpt: 'It\'s free the week beginning the 28th, though, for seven nights.',
          audioTimestampSeconds: 22,
        },
        {
          id: 'c16-l4-q2',
          questionNumber: 2,
          prompt: 'cost for the week: £[2]',
          answerKey: '550',
          acceptedAlternatives: ['550', '£550'],
          explanation: 'Because the end of May is the beginning of high season, Granary Cottage costs £550 for the week.',
          transcriptExcerpt: 'That\'s the beginning of high season, so it\'d be £550 for the week.',
          audioTimestampSeconds: 35,
        },
        {
          id: 'c16-l4-q3',
          questionNumber: 3,
          prompt: '[3] Cottage',
          answerKey: 'Chervil',
          acceptedAlternatives: ['Chervil', 'chervil'],
          explanation: 'Shirley offers another newly converted cottage called Chervil Cottage (spelled C-H-E-R-V-I-L).',
          transcriptExcerpt: 'We\'ve just finished converting another building into a cottage, which we\'re calling Chervil Cottage.',
          audioTimestampSeconds: 48,
        },
        {
          id: 'c16-l4-q4',
          questionNumber: 4,
          prompt: 'building was originally a [4]',
          answerKey: 'garage',
          acceptedAlternatives: ['garage'],
          explanation: 'Shirley explains that Chervil Cottage was originally built as a garage.',
          transcriptExcerpt: 'The building was built as a garage.',
          audioTimestampSeconds: 66,
        },
        {
          id: 'c16-l4-q5',
          questionNumber: 5,
          prompt: 'walk through doors from living room into a [5]',
          answerKey: 'garden',
          acceptedAlternatives: ['garden'],
          explanation: 'Guests can walk from the living room through French doors into a garden.',
          transcriptExcerpt: 'Does it have a garden? Yes, you get to it from the living room through French doors.',
          audioTimestampSeconds: 80,
        },
        {
          id: 'c16-l4-q6',
          questionNumber: 6,
          prompt: 'several [6] spaces at the front',
          answerKey: 'parking',
          acceptedAlternatives: ['parking'],
          explanation: 'The front door opens onto the old farmyard where there is plenty of room at the front for parking.',
          transcriptExcerpt: 'Parking isn\'t a problem — there\'s plenty of room at the front for that.',
          audioTimestampSeconds: 95,
        },
        {
          id: 'c16-l4-q7',
          questionNumber: 7,
          prompt: 'central heating and stove that burns [7]',
          answerKey: 'wood',
          acceptedAlternatives: ['wood'],
          explanation: 'In addition to central heating, there is a stove and the owners provide all the wood needed for it.',
          transcriptExcerpt: 'If you want to light a fire, there\'s a stove. We can provide all the wood you need for it.',
          audioTimestampSeconds: 125,
        },
        {
          id: 'c16-l4-q8',
          questionNumber: 8,
          prompt: 'views of old [8] from living room',
          answerKey: 'bridge',
          acceptedAlternatives: ['bridge'],
          explanation: 'From the living room, guests can see a famous old stone bridge.',
          transcriptExcerpt: 'There\'s a famous stone bridge — it\'s one of the oldest in the region, and you can see it from the living room.',
          audioTimestampSeconds: 145,
        },
        {
          id: 'c16-l4-q9',
          questionNumber: 9,
          prompt: 'view of hilltop [9] from the bedroom',
          answerKey: 'monument',
          acceptedAlternatives: ['monument'],
          explanation: 'The bedroom window looks in the opposite direction and has a view of the hills and the monument at the top.',
          transcriptExcerpt: 'The bedroom window looks in the opposite direction, and has a lovely view of the hills and the monument at the top.',
          audioTimestampSeconds: 158,
        },
        {
          id: 'c16-l4-q10',
          questionNumber: 10,
          prompt: 'deadline for final payment: end of [10]',
          answerKey: 'March',
          acceptedAlternatives: ['March', 'march'],
          explanation: 'Since Tom is coming in May, the balance is due on the last day of March.',
          transcriptExcerpt: 'You\'re coming in May, so the last day of March, please.',
          audioTimestampSeconds: 175,
        },
      ],
    },

    // =========================================================================
    // PART 2: Questions 11-14 (Multiple Choice Single)
    // =========================================================================
    {
      id: 'c16-l4-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      questionRange: [11, 14],
      title: 'Questions 11–14',
      instructions: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          id: 'c16-l4-q11',
          questionNumber: 11,
          prompt: "A survey found people's main concern about traffic in the area was",
          options: MC_Q11_OPTIONS,
          answerKey: 'C',
          explanation: 'A significant number of people complained about the increasing number of heavy vehicles using local roads to avoid traffic elsewhere (changes in the type of traffic, C).',
          transcriptExcerpt: 'A significant number of people complained about the increasing number of heavy vehicles using our local roads.',
          audioTimestampSeconds: 20,
        },
        {
          id: 'c16-l4-q12',
          questionNumber: 12,
          prompt: 'Which change will shortly be made to the cycle path next to the river?',
          options: MC_Q12_OPTIONS,
          answerKey: 'A',
          explanation: 'The surface was already improved last year and extending it will not happen soon, but they are going to add a bit on the side to make it wider (A).',
          transcriptExcerpt: 'Overtaking can be a problem so we\'re going to add a bit on the side to make it wider.',
          audioTimestampSeconds: 45,
        },
        {
          id: 'c16-l4-q13',
          questionNumber: 13,
          prompt: 'Plans for a pedestrian crossing have been postponed because',
          options: MC_Q13_OPTIONS,
          answerKey: 'B',
          explanation: 'The Highways Department advised that it would be dangerous to place a crossing at the planned location because of a bend in the road (B).',
          transcriptExcerpt: 'The Highways Department have told us that it would be dangerous to have a pedestrian crossing where we\'d originally planned it as there\'s a bend in the road there.',
          audioTimestampSeconds: 72,
        },
        {
          id: 'c16-l4-q14',
          questionNumber: 14,
          prompt: 'On Station Road, notices have been erected',
          options: MC_Q14_OPTIONS,
          answerKey: 'B',
          explanation: 'Signs have been put up requesting drivers waiting at the closed level crossing not to leave their engines running (B).',
          transcriptExcerpt: 'We\'ve now got signs up requesting them not to leave their engines running at that time.',
          audioTimestampSeconds: 95,
        },
      ],
    },

    // =========================================================================
    // PART 2: Questions 15-20 (Plan / Map / Diagram Labelling)
    // =========================================================================
    {
      id: 'c16-l4-g3',
      partNumber: 2,
      questionType: 'plan_map_diagram_labelling',
      questionRange: [15, 20],
      title: 'Questions 15–20',
      instructions: 'Label the map below.\nWrite the correct letter, A–I, next to Questions 15–20.',
      mapData: {
        imageUrl: 'https://res.cloudinary.com/pkwpxicd/image/upload/v1794726490/Cambridge_Academic_16_Listening_Map_Test_4.png',
      },
      optionsList: MAP_Q15_OPTIONS,
      optionReuseAllowed: false,
      questions: [
        {
          id: 'c16-l4-q15',
          questionNumber: 15,
          prompt: 'New car park',
          answerKey: 'C',
          explanation: 'Instead of parking between the Community Hall and the line of trees to the east, the new car park is on the opposite (west) side of the Community Hall, right next to it (C).',
          transcriptExcerpt: 'We\'re suggesting a new car park on the opposite side of the Community Hall, right next to it.',
          audioTimestampSeconds: 125,
        },
        {
          id: 'c16-l4-q16',
          questionNumber: 16,
          prompt: 'New cricket pitch',
          answerKey: 'F',
          explanation: 'The cricket pitch is moving into the newly purchased area to the east of the recreation ground, beyond the line of trees (F).',
          transcriptExcerpt: 'As we\'ve now purchased additional space to the east of the recreation ground, beyond the trees, we plan to move it... into this new area beyond the line of trees.',
          audioTimestampSeconds: 142,
        },
        {
          id: 'c16-l4-q17',
          questionNumber: 17,
          prompt: "Children's playground",
          answerKey: 'A',
          explanation: 'The children\'s playground will be accessible by a footpath from the Community Hall and will be alongside the river (A).',
          transcriptExcerpt: 'A children\'s playground which will be accessible by a footpath from the Community Hall and will be alongside the river.',
          audioTimestampSeconds: 160,
        },
        {
          id: 'c16-l4-q18',
          questionNumber: 18,
          prompt: 'Skateboard ramp',
          answerKey: 'I',
          explanation: 'The skateboard ramp will be located in the southeast corner near the road (I).',
          transcriptExcerpt: 'In the end we decided to have it in the southeast corner near the road.',
          audioTimestampSeconds: 175,
        },
        {
          id: 'c16-l4-q19',
          questionNumber: 19,
          prompt: 'Pavilion',
          answerKey: 'E',
          explanation: 'The pavilion will stay to the left of the line of trees and near to the river (E).',
          transcriptExcerpt: 'It will stay where it is now — to the left of the line of trees and near to the river.',
          audioTimestampSeconds: 190,
        },
        {
          id: 'c16-l4-q20',
          questionNumber: 20,
          prompt: 'Notice board',
          answerKey: 'H',
          explanation: 'The new notice board will be directly on people\'s right as they go from the road into the recreation ground (H).',
          transcriptExcerpt: 'That will be directly on people\'s right as they go from the road into the recreation ground.',
          audioTimestampSeconds: 202,
        },
      ],
    },

    // =========================================================================
    // PART 3: Questions 21-22 (Multiple Choice Multi)
    // =========================================================================
    {
      id: 'c16-l4-g4',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      questionRange: [21, 22],
      title: 'Questions 21–22',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO benefits of city bike-sharing schemes do the students agree are the most important?',
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'c16-l4-q21',
          questionNumber: 21,
          prompt: 'Which TWO benefits of city bike-sharing schemes do the students agree are the most important? (First choice)',
          options: MC_Q21_OPTIONS,
          answerKey: ['B', 'C'],
          explanation: 'Jake and Amy agree that reducing emissions to improve air quality (C) and cutting the number of cars on the road to reduce traffic congestion (B) are the main points.',
          transcriptExcerpt: 'Doesn\'t the impact of reduced emissions on air pollution have a more significant effect on people\'s health? Certainly... And also helped to cut the number of cars on the road significantly.',
          audioTimestampSeconds: 35,
        },
        {
          id: 'c16-l4-q22',
          questionNumber: 22,
          prompt: 'Which TWO benefits of city bike-sharing schemes do the students agree are the most important? (Second choice)',
          options: MC_Q21_OPTIONS,
          answerKey: ['B', 'C'],
          explanation: 'Improving air quality (C) and reducing traffic congestion (B) are the two benefits both students agree are most important.',
          transcriptExcerpt: 'Helped to cut the number of cars on the road significantly. Which is the main point.',
          audioTimestampSeconds: 45,
        },
      ],
    },

    // =========================================================================
    // PART 3: Questions 23-24 (Multiple Choice Multi)
    // =========================================================================
    {
      id: 'c16-l4-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      questionRange: [23, 24],
      title: 'Questions 23–24',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO things do the students think are necessary for successful bike-sharing schemes?',
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'c16-l4-q23',
          questionNumber: 23,
          prompt: 'Which TWO things do the students think are necessary for successful bike-sharing schemes? (First choice)',
          options: MC_Q23_OPTIONS,
          answerKey: ['B', 'C'],
          explanation: 'Amy and Jake agree that a fully functional, easy-to-use app for payments and booking (B) and a big publicity campaign to raise public awareness (C) are essential.',
          transcriptExcerpt: 'Some technical things are really important — like a fully functional app — so people can make payments and book bikes easily... What does matter though — is having a big publicity campaign.',
          audioTimestampSeconds: 75,
        },
        {
          id: 'c16-l4-q24',
          questionNumber: 24,
          prompt: 'Which TWO things do the students think are necessary for successful bike-sharing schemes? (Second choice)',
          options: MC_Q23_OPTIONS,
          answerKey: ['B', 'C'],
          explanation: 'An easy-to-use app (B) and raising public awareness (C) are the two necessary factors; GPS, single-company monopoly, and new bike lanes are not strictly required.',
          transcriptExcerpt: 'What does matter though — is having a big publicity campaign. Definitely. If people don\'t know how to use the scheme or don\'t understand its benefits, they won\'t use it.',
          audioTimestampSeconds: 95,
        },
      ],
    },

    // =========================================================================
    // PART 3: Questions 25-30 (Matching)
    // =========================================================================
    {
      id: 'c16-l4-g6',
      partNumber: 3,
      questionType: 'matching',
      questionRange: [25, 30],
      title: 'Questions 25–30',
      instructions:
        "What is the speakers' opinion of the bike-sharing schemes in each of the following cities?\nChoose SIX answers from the box and write the correct letter, A–G, next to Questions 25–30.",
      optionsList: MATCHING_Q25_OPTIONS,
      optionReuseAllowed: false,
      questions: [
        {
          id: 'c16-l4-q25',
          questionNumber: 25,
          prompt: 'Amsterdam',
          answerKey: 'C',
          explanation: 'Because Amsterdam already had a strong cycling culture where people owned bikes, they find it strange/surprising that there was such high demand for bike-sharing (C).',
          transcriptExcerpt: 'In a way it\'s strange that there was such a demand for bike-sharing because you\'d have thought most people would have used their own bikes.',
          audioTimestampSeconds: 120,
        },
        {
          id: 'c16-l4-q26',
          questionNumber: 26,
          prompt: 'Dublin',
          answerKey: 'F',
          explanation: 'Amy attributes Dublin\'s success to slow buses/limited public transport, whereas Jake argues it is due to the low price (they disagree about the reasons for its success, F).',
          transcriptExcerpt: 'It must be because the public transport system\'s quite limited. Not really — there\'s no underground, but there are trams and a good bus network. I\'d say price has a lot to do with it.',
          audioTimestampSeconds: 140,
        },
        {
          id: 'c16-l4-q27',
          questionNumber: 27,
          prompt: 'London',
          answerKey: 'D',
          explanation: 'They agree that the London system is not expanding quickly enough because not enough money has been spent on increasing cycle lanes (more investment is required, D).',
          transcriptExcerpt: 'It isn\'t expanding quickly enough. Basically, not enough\'s been spent on increasing the number of cycle lanes.',
          audioTimestampSeconds: 162,
        },
        {
          id: 'c16-l4-q28',
          questionNumber: 28,
          prompt: 'Buenos Aires',
          answerKey: 'E',
          explanation: 'Buenos Aires built a huge network of cycle lanes to support the scheme\'s introduction, which Jake calls an example of good planning (well designed, E).',
          transcriptExcerpt: 'They built a huge network of cycle lanes to support the introduction of the scheme there... An example of good planning.',
          audioTimestampSeconds: 180,
        },
        {
          id: 'c16-l4-q29',
          questionNumber: 29,
          prompt: 'New York',
          answerKey: 'B',
          explanation: 'New York\'s scheme launched at more than ten times the price of most other schemes — more than a taxi (they think it should be cheaper, B).',
          transcriptExcerpt: 'When they launched it, it was more than ten times the price of most other schemes. More than it costs to take a taxi.',
          audioTimestampSeconds: 198,
        },
        {
          id: 'c16-l4-q30',
          questionNumber: 30,
          prompt: 'Sydney',
          answerKey: 'A',
          explanation: 'Both speakers expected Sydney\'s scheme to grow quickly and agree it is a shame it hasn\'t been a success (disappointing, A).',
          transcriptExcerpt: 'I would have expected it to have grown pretty quickly here. Yes. I can\'t quite work out why it hasn\'t been an instant success like some of the others.',
          audioTimestampSeconds: 215,
        },
      ],
    },

    // =========================================================================
    // PART 4: Questions 31-40 (Note Completion)
    // =========================================================================
    {
      id: 'c16-l4-g7',
      partNumber: 4,
      questionType: 'note_completion',
      questionRange: [31, 40],
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: [
        'THE EXTINCTION OF THE DODO BIRD',
        '',
        'The dodo was a large flightless bird which used to inhabit the island of Mauritius.',
        '',
        'History',
        '• 1507 – Portuguese ships transporting [[31]] stopped at the island to collect food and water.',
        '• 1638 – The Dutch established a [[32]] on the island.',
        '• They killed the dodo birds for their meat.',
        '• The last one was killed in 1681.',
        '',
        'Description',
        '• The only record we have is written descriptions and pictures (possibly unreliable).',
        '• A Dutch painting suggests the dodo was very [[33]].',
        '• The only remaining soft tissue is a dried [[34]].',
        '• Recent studies of a dodo skeleton suggest the birds were capable of rapid [[35]].',
        '• It\'s thought they were able to use their small wings to maintain [[36]].',
        '• Their [[37]] was of average size.',
        '• Their sense of [[38]] enabled them to find food.',
        '',
        'Reasons for extinction',
        '• Hunting was probably not the main cause.',
        '• Sailors brought dogs and monkeys.',
        '• [[39]] also escaped onto the island and ate the birds\' eggs.',
        '• The arrival of farming meant the [[40]] was destroyed.',
      ].join('\n'),
      questions: [
        {
          id: 'c16-l4-q31',
          questionNumber: 31,
          prompt: '1507 – Portuguese ships transporting [31] stopped at the island to collect food and water.',
          answerKey: 'spices',
          acceptedAlternatives: ['spices', 'spice'],
          explanation: 'In 1507, Portuguese sailors carrying spices back to Europe stopped at Mauritius.',
          transcriptExcerpt: 'The sailors were carrying spices back to Europe.',
          audioTimestampSeconds: 25,
        },
        {
          id: 'c16-l4-q32',
          questionNumber: 32,
          prompt: '1638 – The Dutch established a [32] on the island.',
          answerKey: 'colony',
          acceptedAlternatives: ['colony', 'settlement'],
          explanation: 'In 1638, the Dutch arrived and set up a colony on Mauritius.',
          transcriptExcerpt: 'However, in 1638 the Dutch arrived and set up a colony there.',
          audioTimestampSeconds: 40,
        },
        {
          id: 'c16-l4-q33',
          questionNumber: 33,
          prompt: 'A Dutch painting suggests the dodo was very [33].',
          answerKey: 'fat',
          acceptedAlternatives: ['fat'],
          explanation: 'In the best-known Dutch painting, the dodo appears to be extremely fat.',
          transcriptExcerpt: 'The best-known picture is a Dutch painting in which the bird appears to be extremely fat.',
          audioTimestampSeconds: 62,
        },
        {
          id: 'c16-l4-q34',
          questionNumber: 34,
          prompt: 'The only remaining soft tissue is a dried [34].',
          answerKey: 'head',
          acceptedAlternatives: ['head'],
          explanation: 'Of the four dried parts known in the early 17th century, only one example of soft tissue survives: a dried dodo head.',
          transcriptExcerpt: 'Only one example of soft tissue from the dodo survives, a dodo head.',
          audioTimestampSeconds: 85,
        },
        {
          id: 'c16-l4-q35',
          questionNumber: 35,
          prompt: 'Recent studies of a dodo skeleton suggest the birds were capable of rapid [35].',
          answerKey: 'movement',
          acceptedAlternatives: ['movement'],
          explanation: 'Scientists believe the bird\'s strong knee joints made it capable of movement that was quite fast.',
          transcriptExcerpt: 'Scientists now believe the bird\'s strong knee joints would have made it capable of movement which was not slow, but actually quite fast.',
          audioTimestampSeconds: 110,
        },
        {
          id: 'c16-l4-q36',
          questionNumber: 36,
          prompt: "It's thought they were able to use their small wings to maintain [36].",
          answerKey: 'balance',
          acceptedAlternatives: ['balance', 'balancing'],
          explanation: 'Scientists suggest the dodo\'s small wings were employed for balance when moving over uneven ground.',
          transcriptExcerpt: 'The scientists suggest that these were probably employed for balance while going over uneven ground.',
          audioTimestampSeconds: 130,
        },
        {
          id: 'c16-l4-q37',
          questionNumber: 37,
          prompt: 'Their [37] was of average size.',
          answerKey: 'brain',
          acceptedAlternatives: ['brain'],
          explanation: 'Analysis of the dodo\'s skull suggested the bird\'s brain was not small, but average in size.',
          transcriptExcerpt: 'Which suggested the bird\'s brain was not small, but average in size.',
          audioTimestampSeconds: 148,
        },
        {
          id: 'c16-l4-q38',
          questionNumber: 38,
          prompt: 'Their sense of [38] enabled them to find food.',
          answerKey: 'smell',
          acceptedAlternatives: ['smell'],
          explanation: 'The skull structure suggested that the sense of smell was particularly well-developed, helping the dodo locate ripe fruit.',
          transcriptExcerpt: 'One sense which was particularly well-developed was that of smell.',
          audioTimestampSeconds: 165,
        },
        {
          id: 'c16-l4-q39',
          questionNumber: 39,
          prompt: "[39] also escaped onto the island and ate the birds' eggs.",
          answerKey: 'rats',
          acceptedAlternatives: ['rats', 'Rats'],
          explanation: 'Ships brought rats, which came to land, overran the island, and consumed the dodos\' eggs.',
          transcriptExcerpt: 'The ships also brought another type of creature — rats, which came to land from the ships and rapidly overran the island.',
          audioTimestampSeconds: 195,
        },
        {
          id: 'c16-l4-q40',
          questionNumber: 40,
          prompt: 'The arrival of farming meant the [40] was destroyed.',
          answerKey: 'forest',
          acceptedAlternatives: ['forest'],
          explanation: 'The introduction of agriculture meant that the forest that had once covered the island and provided a home for the dodo was cut down.',
          transcriptExcerpt: 'This meant that the forest that had once covered all the island, and that had provided a perfect home for the dodo, was cut down.',
          audioTimestampSeconds: 220,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 16 Academic Listening Test 4',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c16_test4_part1.mp3', durationSeconds: 185 },
        { partNumber: 2, audioUrl: '/audio/listening/c16_test4_part2.mp3', durationSeconds: 210 },
        { partNumber: 3, audioUrl: '/audio/listening/c16_test4_part3.mp3', durationSeconds: 230 },
        { partNumber: 4, audioUrl: '/audio/listening/c16_test4_part4.mp3', durationSeconds: 240 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge16ListeningTest4(authorId?: string) {
  const data = getCambridge16ListeningTest4Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 16 Listening Test 4 validation failed: ${validationErrors.join('; ')}`);
  }

  const existingTest = (await db.prepare(`
    SELECT id, current_version_number
    FROM listening_tests
    WHERE title = ?
    LIMIT 1
  `).get(data.title)) as { id: string; current_version_number: number } | undefined;

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db.prepare(`
      SELECT id FROM listening_test_versions
      WHERE test_id = ? AND version_number = ?
      LIMIT 1
    `).get(testId, existingTest.current_version_number || 1)) as { id: string } | undefined;

    if (existingVersion) {
      versionId = existingVersion.id;
      await db.prepare(`
        UPDATE listening_test_versions
        SET parts_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            status = 'published',
            audio_config_json = ?,
            published_at = ?
        WHERE id = ?
      `).run(
        JSON.stringify(data.parts),
        JSON.stringify(data.questionGroups),
        JSON.stringify(data.audioConfig),
        now,
        versionId
      );
    } else {
      versionId = uuidv4();
      await db.prepare(`
        INSERT INTO listening_test_versions (
          id, test_id, version_number, status, parts_json,
          question_groups_json, total_questions, audio_config_json, published_at, created_at
        ) VALUES (?, ?, 1, 'published', ?, ?, 40, ?, ?, ?)
      `).run(
        versionId,
        testId,
        JSON.stringify(data.parts),
        JSON.stringify(data.questionGroups),
        JSON.stringify(data.audioConfig),
        now,
        now
      );
    }

    await db.prepare(`
      UPDATE listening_tests
      SET title = ?,
          status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(data.title, now, testId);
  } else {
    testId = uuidv4();
    versionId = uuidv4();

    await db.prepare(`
      INSERT INTO listening_tests (
        id, title, category, audio_mode, time_limit_minutes,
        current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 1, 'published', ?, 1, ?, ?)
    `).run(
      testId,
      data.title,
      data.category,
      data.audioMode,
      data.timeLimitMinutes,
      resolvedAuthorId,
      now,
      now
    );

    await db.prepare(`
      INSERT INTO listening_test_versions (
        id, test_id, version_number, status, parts_json,
        question_groups_json, total_questions, audio_config_json, published_at, created_at
      ) VALUES (?, ?, 1, 'published', ?, ?, 40, ?, ?, ?)
    `).run(
      versionId,
      testId,
      JSON.stringify(data.parts),
      JSON.stringify(data.questionGroups),
      JSON.stringify(data.audioConfig),
      now,
      now
    );
  }

  return {
    testId,
    versionId,
    status: 'published',
    totalQuestions: 40,
  };
}
