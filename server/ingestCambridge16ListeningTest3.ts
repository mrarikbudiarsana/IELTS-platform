import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'the active lifestyle' },
  { key: 'B', text: 'the above-average salaries' },
  { key: 'C', text: 'the flexible working opportunities' },
  { key: 'D', text: 'the opportunities for overseas travel' },
  { key: 'E', text: 'the chance to be in a natural environment' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'the increasing risk of accidents' },
  { key: 'B', text: 'being in a very quiet location' },
  { key: 'C', text: 'difficult weather conditions at times' },
  { key: 'D', text: 'the cost of housing' },
  { key: 'E', text: 'the level of physical fitness required' },
];

const MATCHING_Q15_OPTIONS = [
  { key: 'A', text: 'not a permanent job' },
  { key: 'B', text: 'involves leading a team' },
  { key: 'C', text: 'experience not essential' },
  { key: 'D', text: 'intensive work but also fun' },
  { key: 'E', text: 'chance to earn more through overtime' },
  { key: 'F', text: 'chance for rapid promotion' },
  { key: 'G', text: 'accommodation available' },
  { key: 'H', text: 'local travel involved' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'The results were what he had predicted.' },
  { key: 'B', text: 'The experiment was simple to set up.' },
  { key: 'C', text: 'A large sample of people was tested.' },
  { key: 'D', text: 'The subjects were unaware of what they were drinking.' },
  { key: 'E', text: 'The test was repeated several times for each person.' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'She used the wrong sort of nuts.' },
  { key: 'B', text: 'She used an unsuitable chemical.' },
  { key: 'C', text: 'She did not grind the nuts finely enough.' },
  { key: 'D', text: 'The information on the nut package was incorrect.' },
  { key: 'E', text: 'The weighing scales may have been unsuitable.' },
];

const MC_Q25_OPTIONS = [
  { key: 'A', text: 'offered fewer options.' },
  { key: 'B', text: 'had more low-calorie foods.' },
  { key: 'C', text: 'were organised in a particular way.' },
];

const MC_Q26_OPTIONS = [
  { key: 'A', text: 'make calorie counts hard to understand.' },
  { key: 'B', text: 'fail to provide accurate calorie counts.' },
  { key: 'C', text: 'use ineffective methods to reduce calories.' },
];

const MC_Q27_OPTIONS = [
  { key: 'A', text: 'The amount recommended is much too low.' },
  { key: 'B', text: 'Most people overestimate how much they do.' },
  { key: 'C', text: 'Women now exercise more than they used to.' },
];

const MC_Q28_OPTIONS = [
  { key: 'A', text: "practical changes that can influence people's behaviour." },
  { key: 'B', text: 'methods of helping people who have mobility problems.' },
  { key: 'C', text: 'ways of preventing accidents by controlling crowd movement.' },
];

const MC_Q29_OPTIONS = [
  { key: 'A', text: 'They should probably leave it out.' },
  { key: 'B', text: 'They need to do more research on it.' },
  { key: 'C', text: 'They should discuss this with their tutor.' },
];

const MC_Q30_OPTIONS = [
  { key: 'A', text: 'prepare some slides for it' },
  { key: 'B', text: 'find out how long they have for it' },
  { key: 'C', text: 'decide on its content and organisation' },
];

export function getCambridge16ListeningTest3Data(): {
  title: string;
  category: 'mock';
  audioMode: 'part_audios';
  timeLimitMinutes: number;
  audioConfig: ListeningAudioConfig;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
} {
  const transcriptsPath = path.join(__dirname, 'c16_l3_transcripts.json');
  const transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf8')) as {
    part1: string;
    part2: string;
    part3: string;
    part4: string;
  };

  const parts: ListeningPart[] = [
    {
      id: 'c16-l3-p1',
      partNumber: 1,
      title: 'Part 1: Junior Cycle Camp',
      contextDescription:
        'A mother calls Jake at the Junior Cycle Camp to ask about enrolling her seven-year-old son Charlie in summer cycling classes.',
      audioUrl: '/audio/listening/c16_test3_part1.mp3',
      durationSeconds: 180,
      transcript: transcripts.part1,
      questionRange: [1, 10],
    },
    {
      id: 'c16-l3-p2',
      partNumber: 2,
      title: 'Part 2: Recruitment in the agriculture and horticulture sectors',
      contextDescription:
        'A recruitment consultant named Megan Baker talks about working in the agriculture and horticulture sectors and describes six current job vacancies.',
      audioUrl: '/audio/listening/c16_test3_part2.mp3',
      durationSeconds: 210,
      transcript: transcripts.part2,
      questionRange: [11, 20],
    },
    {
      id: 'c16-l3-p3',
      partNumber: 3,
      title: 'Part 3: Presentation on diet and obesity',
      contextDescription:
        'Two students, Adam and Rosie, plan their joint presentation on diet and obesity, discussing experiments they conducted and possible solutions.',
      audioUrl: '/audio/listening/c16_test3_part3.mp3',
      durationSeconds: 220,
      transcript: transcripts.part3,
      questionRange: [21, 30],
    },
    {
      id: 'c16-l3-p4',
      partNumber: 4,
      title: 'Part 4: Hand knitting',
      contextDescription:
        'A lecturer gives a presentation on the history, resurgence, personal benefits, and archaeological evidence of hand knitting.',
      audioUrl: '/audio/listening/c16_test3_part4.mp3',
      durationSeconds: 230,
      transcript: transcripts.part4,
      questionRange: [31, 40],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // =========================================================================
    // PART 1: Questions 1-10 (Note Completion)
    // =========================================================================
    {
      id: 'c16-l3-g1',
      partNumber: 1,
      questionType: 'note_completion',
      questionRange: [1, 10],
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: [
        'JUNIOR CYCLE CAMP',
        '',
        'The course focuses on skills and safety.',
        '• Charlie would be placed in Level 5.',
        '• First of all, children at this level are taken to practise in a [[1]].',
        '',
        'Instructors',
        '• Instructors wear [[2]] shirts.',
        '• A [[3]] is required and training is given.',
        '',
        'Classes',
        '• The size of the classes is limited.',
        '• There are quiet times during the morning for a [[4]] or a game.',
        '• Classes are held even if there is [[5]].',
        '',
        'What to bring',
        '• a change of clothing',
        '• a [[6]]',
        '• shoes (not sandals)',
        '• Charlie\'s [[7]]',
        '',
        'Day 1',
        '• Charlie should arrive at 9.20 am on the first day.',
        '• Before the class, his [[8]] will be checked.',
        '• He should then go to the [[9]] to meet his class instructor.',
        '',
        'Cost',
        '• The course costs $[[10]] per week.',
      ].join('\n'),
      questions: [
        {
          id: 'c16-l3-q1',
          questionNumber: 1,
          prompt: 'First of all, children at this level are taken to practise in a [1].',
          answerKey: 'park',
          acceptedAlternatives: ['park'],
          explanation: 'Before riding on the road, Level 5 children are first taken to ride in the park away from traffic.',
          transcriptExcerpt: 'First they\'re taken to ride in the park, away from the traffic.',
          audioTimestampSeconds: 25,
        },
        {
          id: 'c16-l3-q2',
          questionNumber: 2,
          prompt: 'Instructors wear [2] shirts.',
          answerKey: 'blue',
          acceptedAlternatives: ['blue'],
          explanation: 'While supervisors wear red shirts, the instructors themselves wear blue shirts.',
          transcriptExcerpt: 'Then the instructors themselves are in blue shirts.',
          audioTimestampSeconds: 42,
        },
        {
          id: 'c16-l3-q3',
          questionNumber: 3,
          prompt: 'A [3] is required and training is given.',
          answerKey: 'reference',
          acceptedAlternatives: ['reference'],
          explanation: 'All instructors must submit a reference from someone who has seen them work with children.',
          transcriptExcerpt: 'In order to be accepted, all our instructors have to submit a reference.',
          audioTimestampSeconds: 56,
        },
        {
          id: 'c16-l3-q4',
          questionNumber: 4,
          prompt: 'There are quiet times during the morning for a [4] or a game.',
          answerKey: 'story',
          acceptedAlternatives: ['story'],
          explanation: 'During quiet times, the instructor might tell the children a cycling-related story or play a game.',
          transcriptExcerpt: 'Where their instructor might tell them a story that\'s got something to do with cycling, or get them to play a game.',
          audioTimestampSeconds: 78,
        },
        {
          id: 'c16-l3-q5',
          questionNumber: 5,
          prompt: 'Classes are held even if there is [5].',
          answerKey: 'rain',
          acceptedAlternatives: ['rain'],
          explanation: 'If there is rain, the classes still run and the children put on waterproofs and keep cycling.',
          transcriptExcerpt: 'Now, what happens if there\'s rain? Do the classes still run? Oh yes.',
          audioTimestampSeconds: 92,
        },
        {
          id: 'c16-l3-q6',
          questionNumber: 6,
          prompt: 'a [6]',
          answerKey: 'snack',
          acceptedAlternatives: ['snack'],
          explanation: 'Children should bring spare clothes and a snack for break time (drinks are provided).',
          transcriptExcerpt: 'And a snack for break time.',
          audioTimestampSeconds: 108,
        },
        {
          id: 'c16-l3-q7',
          questionNumber: 7,
          prompt: "Charlie's [7]",
          answerKey: 'medication',
          acceptedAlternatives: ['medication', 'medicine'],
          explanation: 'Charlie has to take medication every few hours, so his mother will make sure he brings it.',
          transcriptExcerpt: 'Charlie has to take medication every few hours, so I\'ll make sure he has that.',
          audioTimestampSeconds: 122,
        },
        {
          id: 'c16-l3-q8',
          questionNumber: 8,
          prompt: 'Before the class, his [8] will be checked.',
          answerKey: 'helmet',
          acceptedAlternatives: ['helmet'],
          explanation: 'On Day 1, staff do a careful check to ensure every child\'s helmet fits properly.',
          transcriptExcerpt: 'We have a very careful check to make sure that every child\'s helmet fits properly.',
          audioTimestampSeconds: 145,
        },
        {
          id: 'c16-l3-q9',
          questionNumber: 9,
          prompt: 'He should then go to the [9] to meet his class instructor.',
          answerKey: 'tent',
          acceptedAlternatives: ['tent'],
          explanation: 'After the helmet check, the instructors and classes meet up in the tent.',
          transcriptExcerpt: 'All the instructors will be waiting to meet their classes, and they\'ll meet up in the tent.',
          audioTimestampSeconds: 158,
        },
        {
          id: 'c16-l3-q10',
          questionNumber: 10,
          prompt: 'The course costs $[10] per week.',
          answerKey: '199',
          acceptedAlternatives: ['199', '$199'],
          explanation: 'The camp costs $199 per week this year (compared to $190 last year).',
          transcriptExcerpt: 'One hundred ninety-nine dollars.',
          audioTimestampSeconds: 170,
        },
      ],
    },

    // =========================================================================
    // PART 2: Questions 11-12 (Multiple Choice Multi)
    // =========================================================================
    {
      id: 'c16-l3-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      questionRange: [11, 12],
      title: 'Questions 11 and 12',
      instructions:
        'Choose TWO letters, A–E.\nAccording to Megan, what are the TWO main advantages of working in the agriculture and horticulture sectors?',
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'c16-l3-q11',
          questionNumber: 11,
          prompt: 'According to Megan, what are the TWO main advantages of working in the agriculture and horticulture sectors? (First choice)',
          options: MC_Q11_OPTIONS,
          answerKey: ['A', 'C'],
          explanation: 'Megan highlights flexible hours for people juggling responsibilities like childcare (C) and the health benefits of an active job not sitting at a screen all day (A).',
          transcriptExcerpt: 'They often offer opportunities for those who don\'t want to be stuck with a 40-hour week... and there are certainly health benefits, especially in jobs where you\'re not sitting all day looking at a screen.',
          audioTimestampSeconds: 30,
        },
        {
          id: 'c16-l3-q12',
          questionNumber: 12,
          prompt: 'According to Megan, what are the TWO main advantages of working in the agriculture and horticulture sectors? (Second choice)',
          options: MC_Q11_OPTIONS,
          answerKey: ['A', 'C'],
          explanation: 'The two guaranteed advantages are the active lifestyle (A) and flexible working opportunities (C); rural setting, high salaries, and overseas travel are not guaranteed.',
          transcriptExcerpt: 'Opportunities for those who don\'t want to be stuck with a 40-hour week... and health benefits.',
          audioTimestampSeconds: 45,
        },
      ],
    },

    // =========================================================================
    // PART 2: Questions 13-14 (Multiple Choice Multi)
    // =========================================================================
    {
      id: 'c16-l3-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      questionRange: [13, 14],
      title: 'Questions 13 and 14',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO of the following are likely to be disadvantages for people working outdoors?',
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'c16-l3-q13',
          questionNumber: 13,
          prompt: 'Which TWO of the following are likely to be disadvantages for people working outdoors? (First choice)',
          options: MC_Q13_OPTIONS,
          answerKey: ['B', 'C'],
          explanation: 'Megan warns that outdoor work can be extremely unpleasant when it is cold and windy (C) and that the jobs are often in remote, quiet areas away from lively cities (B).',
          transcriptExcerpt: 'It can be extremely unpleasant when it\'s cold and windy... and they\'re often in pretty remote areas.',
          audioTimestampSeconds: 75,
        },
        {
          id: 'c16-l3-q14',
          questionNumber: 14,
          prompt: 'Which TWO of the following are likely to be disadvantages for people working outdoors? (Second choice)',
          options: MC_Q13_OPTIONS,
          answerKey: ['B', 'C'],
          explanation: 'Physical fitness, accident risk, and housing turn out not to be major problems, leaving remote/quiet locations (B) and difficult weather conditions (C) as the two main disadvantages.',
          transcriptExcerpt: 'If you like a lively city environment surrounded by lots of people, these jobs are probably not for you — they\'re often in pretty remote areas.',
          audioTimestampSeconds: 95,
        },
      ],
    },

    // =========================================================================
    // PART 2: Questions 15-20 (Matching)
    // =========================================================================
    {
      id: 'c16-l3-g4',
      partNumber: 2,
      questionType: 'matching',
      questionRange: [15, 20],
      title: 'Questions 15–20',
      instructions:
        'What information does Megan give about each of the following job opportunities?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 15–20.',
      optionsList: MATCHING_Q15_OPTIONS,
      optionReuseAllowed: false,
      questions: [
        {
          id: 'c16-l3-q15',
          questionNumber: 15,
          prompt: 'Fresh food commercial manager',
          answerKey: 'D',
          explanation: 'The company operates in a very fast-paced environment where staff work hard and play hard (intensive work but also fun, D).',
          transcriptExcerpt: 'They operate in a very fast-paced environment — the staff there work hard, but they play hard as well.',
          audioTimestampSeconds: 120,
        },
        {
          id: 'c16-l3-q16',
          questionNumber: 16,
          prompt: 'Agronomist',
          answerKey: 'F',
          explanation: 'There are good opportunities for the right person to quickly make their way up the career ladder (chance for rapid promotion, F).',
          transcriptExcerpt: 'There are good opportunities for the right person to quickly make their way up the career ladder.',
          audioTimestampSeconds: 140,
        },
        {
          id: 'c16-l3-q17',
          questionNumber: 17,
          prompt: 'Fresh produce buyer',
          answerKey: 'A',
          explanation: 'The position is for a 12-month maternity cover contract (not a permanent job, A).',
          transcriptExcerpt: 'A leading supermarket is looking for a fresh produce buyer who is available for a 12-month maternity cover contract.',
          audioTimestampSeconds: 155,
        },
        {
          id: 'c16-l3-q18',
          questionNumber: 18,
          prompt: 'Garden centre sales manager',
          answerKey: 'H',
          explanation: 'The role involves visiting centres in the region to ensure high customer service (local travel involved, H).',
          transcriptExcerpt: 'You will be visiting centres in the region to ensure their high levels of customer service are maintained.',
          audioTimestampSeconds: 170,
        },
        {
          id: 'c16-l3-q19',
          questionNumber: 19,
          prompt: 'Tree technician',
          answerKey: 'C',
          explanation: 'Although a year\'s experience is preferred, the company may consider someone who has just completed a training course (experience not essential, C).',
          transcriptExcerpt: 'A year\'s experience would be preferred but the company might be prepared to consider someone who has just completed an appropriate training course.',
          audioTimestampSeconds: 185,
        },
        {
          id: 'c16-l3-q20',
          questionNumber: 20,
          prompt: 'Farm worker',
          answerKey: 'G',
          explanation: 'Perks of the job include the possibility of renting a small cottage on the estate (accommodation available, G).',
          transcriptExcerpt: 'Perks of the job include the possibility of renting a small cottage on the estate.',
          audioTimestampSeconds: 200,
        },
      ],
    },

    // =========================================================================
    // PART 3: Questions 21-22 (Multiple Choice Multi)
    // =========================================================================
    {
      id: 'c16-l3-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      questionRange: [21, 22],
      title: 'Questions 21 and 22',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO points does Adam make about his experiment on artificial sweeteners?',
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'c16-l3-q21',
          questionNumber: 21,
          prompt: 'Which TWO points does Adam make about his experiment on artificial sweeteners? (First choice)',
          options: MC_Q21_OPTIONS,
          answerKey: ['C', 'D'],
          explanation: 'Adam made sure that people did not know which drink he was giving them (D) and had so many people doing the test that it was hard to keep track (C).',
          transcriptExcerpt: 'How I could make sure that people didn\'t know which drink I was giving them. It was hard to keep track of it all, especially as I had so many people doing it.',
          audioTimestampSeconds: 25,
        },
        {
          id: 'c16-l3-q22',
          questionNumber: 22,
          prompt: 'Which TWO points does Adam make about his experiment on artificial sweeteners? (Second choice)',
          options: MC_Q21_OPTIONS,
          answerKey: ['C', 'D'],
          explanation: 'A large sample was tested (C) and subjects were blind to which drink they had (D).',
          transcriptExcerpt: 'Make sure that people didn\'t know which drink I was giving them... I had so many people doing it.',
          audioTimestampSeconds: 32,
        },
      ],
    },

    // =========================================================================
    // PART 3: Questions 23-24 (Multiple Choice Multi)
    // =========================================================================
    {
      id: 'c16-l3-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      questionRange: [23, 24],
      title: 'Questions 23 and 24',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO problems did Rosie have when measuring the fat content of nuts?',
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'c16-l3-q23',
          questionNumber: 23,
          prompt: 'Which TWO problems did Rosie have when measuring the fat content of nuts? (First choice)',
          options: MC_Q23_OPTIONS,
          answerKey: ['C', 'E'],
          explanation: 'Rosie says she should have ground up the nuts more than she did (C) and that the scales for weighing the fat may not have been accurate enough (E).',
          transcriptExcerpt: 'I think I should probably have ground up the nuts more than I did. It\'s possible that the scales for weighing the fat weren\'t accurate enough, too.',
          audioTimestampSeconds: 60,
        },
        {
          id: 'c16-l3-q24',
          questionNumber: 24,
          prompt: 'Which TWO problems did Rosie have when measuring the fat content of nuts? (Second choice)',
          options: MC_Q23_OPTIONS,
          answerKey: ['C', 'E'],
          explanation: 'The two issues Rosie identified were insufficient grinding of the nuts (C) and inaccurate weighing scales (E).',
          transcriptExcerpt: 'Ground up the nuts more than I did... the scales for weighing the fat weren\'t accurate enough.',
          audioTimestampSeconds: 68,
        },
      ],
    },

    // =========================================================================
    // PART 3: Questions 25-30 (Multiple Choice Single)
    // =========================================================================
    {
      id: 'c16-l3-g7',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      questionRange: [25, 30],
      title: 'Questions 25–30',
      instructions: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          id: 'c16-l3-q25',
          questionNumber: 25,
          prompt: 'Adam suggests that restaurants could reduce obesity if their menus',
          options: MC_Q25_OPTIONS,
          answerKey: 'C',
          explanation: 'Adam says items at the beginning and end of a menu are chosen more often than items in the middle, so placing low-calorie items there would lead diners to pick healthier options (C).',
          transcriptExcerpt: 'If you put the low-calorie items at the beginning and end of the menu, people will probably go for the food with fewer calories.',
          audioTimestampSeconds: 95,
        },
        {
          id: 'c16-l3-q26',
          questionNumber: 26,
          prompt: 'The students agree that food manufacturers deliberately',
          options: MC_Q26_OPTIONS,
          answerKey: 'A',
          explanation: 'Rosie and Adam agree that manufacturers put confusing calorie counts (such as calories per quarter pizza) on food labels on purpose (A).',
          transcriptExcerpt: 'When manufacturers put calorie counts of a food on the label, they\'re sometimes really confusing and I suspect they do it on purpose.',
          audioTimestampSeconds: 118,
        },
        {
          id: 'c16-l3-q27',
          questionNumber: 27,
          prompt: 'What does Rosie say about levels of exercise in England?',
          options: MC_Q27_OPTIONS,
          answerKey: 'B',
          explanation: 'Rosie notes that while 40% of men and 30% of women claim to meet exercise guidelines, motion sensors show only 6% of men and 4% of women actually do (B).',
          transcriptExcerpt: 'About 40% of men and 30% of women say they do this, but when you objectively measure the amount of walking they do with motion sensors, you find that only 6% of men and 4% of women do.',
          audioTimestampSeconds: 145,
        },
        {
          id: 'c16-l3-q28',
          questionNumber: 28,
          prompt: 'Adam refers to the location and width of stairs in a train station to illustrate',
          options: MC_Q28_OPTIONS,
          answerKey: 'A',
          explanation: 'Adam explains that placing stairs before escalators and widening them are minor environmental modifications that unconsciously influence people to take the stairs (A).',
          transcriptExcerpt: 'It\'s an unconscious process and influenced by minor modifications in their environment.',
          audioTimestampSeconds: 170,
        },
        {
          id: 'c16-l3-q29',
          questionNumber: 29,
          prompt: 'What do the students agree about including reference to exercise in their presentation?',
          options: MC_Q29_OPTIONS,
          answerKey: 'A',
          explanation: 'They agree that including exercise would make their focus too wide since their tutor told them to focus on nutrition, so they decide to leave exercise out (A).',
          transcriptExcerpt: 'I\'m not sure if we should be talking about exercise in our presentation... OK, well that will be simpler.',
          audioTimestampSeconds: 192,
        },
        {
          id: 'c16-l3-q30',
          questionNumber: 30,
          prompt: 'What are the students going to do next for their presentation?',
          options: MC_Q30_OPTIONS,
          answerKey: 'C',
          explanation: 'Before deciding what slides they need, Rosie suggests thinking about what they are going to include and what will go where (C).',
          transcriptExcerpt: 'Let\'s think about what we\'re going to include and what will go where. Then we can decide what slides we need.',
          audioTimestampSeconds: 210,
        },
      ],
    },

    // =========================================================================
    // PART 4: Questions 31-40 (Note Completion)
    // =========================================================================
    {
      id: 'c16-l3-g8',
      partNumber: 4,
      questionType: 'note_completion',
      questionRange: [31, 40],
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: [
        'Hand knitting',
        '',
        'Interest in knitting',
        '• Knitting has a long history around the world.',
        '• We imagine someone like a [[31]] knitting.',
        '• A [[32]] ago, knitting was expected to disappear.',
        '• The number of knitting classes is now increasing.',
        '• People are buying more [[33]] for knitting nowadays.',
        '',
        'Benefits of knitting',
        '• gives support in times of [[34]] difficulty',
        '• requires only [[35]] skills and little money to start',
        '• reduces stress in a busy life',
        '',
        'Early knitting',
        '• The origins are not known.',
        '• Findings show early knitted items to be [[36]] in shape.',
        '• The first needles were made of natural materials such as wood and [[37]].',
        '• Early yarns felt [[38]] to touch.',
        '• Wool became the most popular yarn for spinning.',
        '• Geographical areas had their own [[39]] of knitting.',
        '• Everyday tasks like looking after [[40]] were done while knitting.',
      ].join('\n'),
      questions: [
        {
          id: 'c16-l3-q31',
          questionNumber: 31,
          prompt: 'We imagine someone like a [31] knitting.',
          answerKey: 'grandmother',
          acceptedAlternatives: ['grandmother'],
          explanation: 'The lecturer says that when we hear the word knitting, we might picture an elderly person, such as a grandmother, sitting by the fire.',
          transcriptExcerpt: 'We might well picture an elderly person — a grandmother perhaps — sitting by the fire knitting.',
          audioTimestampSeconds: 22,
        },
        {
          id: 'c16-l3-q32',
          questionNumber: 32,
          prompt: 'A [32] ago, knitting was expected to disappear.',
          answerKey: 'decade',
          acceptedAlternatives: ['decade'],
          explanation: 'During the previous decade, knitting was one of the craft skills predicted to vanish from everyday life.',
          transcriptExcerpt: 'During the previous decade, it was one of the skills that was predicted to vanish from everyday life.',
          audioTimestampSeconds: 38,
        },
        {
          id: 'c16-l3-q33',
          questionNumber: 33,
          prompt: 'People are buying more [33] for knitting nowadays.',
          answerKey: 'equipment',
          acceptedAlternatives: ['equipment'],
          explanation: 'Along with rising interest in knitting classes, there is an increase in sales figures for knitting equipment.',
          transcriptExcerpt: 'We\'re also seeing an increase in the sales figures for knitting equipment.',
          audioTimestampSeconds: 58,
        },
        {
          id: 'c16-l3-q34',
          questionNumber: 34,
          prompt: 'gives support in times of [34] difficulty',
          answerKey: 'economic',
          acceptedAlternatives: ['economic'],
          explanation: 'Knitting can be helpful if you are experiencing economic hardship, saving money on warm winter clothes.',
          transcriptExcerpt: 'It\'s still true today that knitting can be helpful if you\'re experiencing economic hardship.',
          audioTimestampSeconds: 82,
        },
        {
          id: 'c16-l3-q35',
          questionNumber: 35,
          prompt: 'requires only [35] skills and little money to start',
          answerKey: 'basic',
          acceptedAlternatives: ['basic'],
          explanation: 'The skills needed to get started with knitting are quite basic and the financial outlay is minimal.',
          transcriptExcerpt: 'Even though the skills you need to get going are really quite basic and the financial outlay is minimal.',
          audioTimestampSeconds: 98,
        },
        {
          id: 'c16-l3-q36',
          questionNumber: 36,
          prompt: 'Findings show early knitted items to be [36] in shape.',
          answerKey: 'round',
          acceptedAlternatives: ['round'],
          explanation: 'The earliest knitted garments found suggest that most items produced were round rather than flat.',
          transcriptExcerpt: 'The earliest pieces of clothing that have been found suggest that most of the items produced were round rather than flat.',
          audioTimestampSeconds: 135,
        },
        {
          id: 'c16-l3-q37',
          questionNumber: 37,
          prompt: 'The first needles were made of natural materials such as wood and [37].',
          answerKey: 'bone',
          acceptedAlternatives: ['bone'],
          explanation: 'The very first needles were hand-carved out of wood and other natural materials like bone.',
          transcriptExcerpt: 'The very first needles people used were hand carved out of wood and other natural materials, like bone.',
          audioTimestampSeconds: 158,
        },
        {
          id: 'c16-l3-q38',
          questionNumber: 38,
          prompt: 'Early yarns felt [38] to touch.',
          answerKey: 'rough',
          acceptedAlternatives: ['rough'],
          explanation: 'Ancient yarns made from linen, hemp, cotton, and wool were often very rough on the skin.',
          transcriptExcerpt: 'Ancient people knitted using yarns made from linen, hemp, cotton and wool, and these were often very rough on the skin.',
          audioTimestampSeconds: 175,
        },
        {
          id: 'c16-l3-q39',
          questionNumber: 39,
          prompt: 'Geographical areas had their own [39] of knitting.',
          answerKey: 'style',
          acceptedAlternatives: ['style', 'styles'],
          explanation: 'Because knitting was practised in so many parts of the world, regional differences in style developed.',
          transcriptExcerpt: 'Regional differences in style developed.',
          audioTimestampSeconds: 195,
        },
        {
          id: 'c16-l3-q40',
          questionNumber: 40,
          prompt: 'Everyday tasks like looking after [40] were done while knitting.',
          answerKey: 'sheep',
          acceptedAlternatives: ['sheep'],
          explanation: 'People knitted while doing other tasks, such as watching over sheep, walking to market, or riding in boats.',
          transcriptExcerpt: 'Men, women and children took every opportunity to knit, for example, while watching over sheep.',
          audioTimestampSeconds: 215,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 16 Academic Listening Test 3',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c16_test3_part1.mp3', durationSeconds: 180 },
        { partNumber: 2, audioUrl: '/audio/listening/c16_test3_part2.mp3', durationSeconds: 210 },
        { partNumber: 3, audioUrl: '/audio/listening/c16_test3_part3.mp3', durationSeconds: 220 },
        { partNumber: 4, audioUrl: '/audio/listening/c16_test3_part4.mp3', durationSeconds: 230 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge16ListeningTest3(authorId?: string) {
  const data = getCambridge16ListeningTest3Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 16 Listening Test 3 validation failed: ${validationErrors.join('; ')}`);
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
