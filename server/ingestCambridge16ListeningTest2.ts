import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'a tourist information centre.' },
  { key: 'B', text: 'a private home.' },
  { key: 'C', text: 'a local council building.' },
];

const MC_Q12_OPTIONS = [
  { key: 'A', text: 'All buildings on the main site will be improved.' },
  { key: 'B', text: 'The lower school site will be used for new homes.' },
  { key: 'C', text: 'Additional school buildings will be constructed on the lower school site.' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'long queuing times.' },
  { key: 'B', text: 'changes to the school timetable.' },
  { key: 'C', text: 'dissatisfaction with the menus.' },
];

const MC_Q14_OPTIONS = [
  { key: 'A', text: 'help their children to decide in advance which serving point to use.' },
  { key: 'B', text: 'make sure their children have enough money for food.' },
  { key: 'C', text: 'advise their children on healthy food to eat.' },
];

const MC_Q15_OPTIONS = [
  { key: 'A', text: 'Food will still be served there.' },
  { key: 'B', text: 'Only staff will have access to it.' },
  { key: 'C', text: 'Pupils can take their food into it.' },
];

const MATCHING_Q16_OPTIONS = [
  { key: 'A', text: 'pupils help to plan menus' },
  { key: 'B', text: 'only vegetarian food' },
  { key: 'C', text: 'different food every week' },
  { key: 'D', text: 'daily change in menu' },
];

const MC_Q19_OPTIONS = [
  { key: 'A', text: 'swimming' },
  { key: 'B', text: 'piano' },
  { key: 'C', text: 'acting' },
  { key: 'D', text: 'cycling' },
  { key: 'E', text: 'theatre sound and lighting' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'our memories cannot cope with too much information.' },
  { key: 'B', text: 'we might otherwise be confused about what is real.' },
  { key: 'C', text: 'we do not think they are important.' },
];

const MC_Q22_OPTIONS = [
  { key: 'A', text: 'It may just be due to chance.' },
  { key: 'B', text: 'It only happens with certain types of event.' },
  { key: 'C', text: 'It happens more often than some people think.' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'had controversial results.' },
  { key: 'B', text: 'used faulty research methodology.' },
  { key: 'C', text: 'failed to reach any clear conclusions.' },
];

const MC_Q24_OPTIONS = [
  { key: 'A', text: 'statistical analysis.' },
  { key: 'B', text: 'making an action plan.' },
  { key: 'C', text: 'self-assessment.' },
];

export function getCambridge16ListeningTest2Data(): {
  title: string;
  category: 'mock';
  audioMode: 'part_audios';
  timeLimitMinutes: number;
  audioConfig: ListeningAudioConfig;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
} {
  const transcriptsPath = path.join(__dirname, 'c16_l2_transcripts.json');
  const transcripts = JSON.parse(fs.readFileSync(transcriptsPath, 'utf8')) as {
    part1: string;
    part2: string;
    part3: string;
    part4: string;
  };

  const parts: ListeningPart[] = [
    {
      id: 'c16-l2-p1',
      partNumber: 1,
      title: 'Part 1: Copying photos to digital format',
      contextDescription:
        'A customer rings a company called Picturerep to enquire about having old family photographs converted into digital format.',
      audioUrl: 'https://res.cloudinary.com/pkwpxicd/video/upload/v1795256747/Test_2_Part_1.mp3',
      durationSeconds: 185,
      transcript: transcripts.part1,
      questionRange: [1, 10],
    },
    {
      id: 'c16-l2-p2',
      partNumber: 2,
      title: 'Part 2: Changes in Dartfield House school',
      contextDescription:
        'A headteacher talks to parents about upcoming changes to the school buildings, catering in the new Food Hall, and after-school lessons.',
      audioUrl: 'https://res.cloudinary.com/pkwpxicd/video/upload/v1795256752/Test_2_Part_2.mp3',
      durationSeconds: 215,
      transcript: transcripts.part2,
      questionRange: [11, 20],
    },
    {
      id: 'c16-l2-p3',
      partNumber: 3,
      title: 'Part 3: Assignment on sleep and dreams',
      contextDescription:
        'Two psychology students, Luke and Susie, discuss their upcoming research assignment on sleep and dreams.',
      audioUrl: 'https://res.cloudinary.com/pkwpxicd/video/upload/v1795256751/Test_2_Part_3.mp3',
      durationSeconds: 225,
      transcript: transcripts.part3,
      questionRange: [21, 30],
    },
    {
      id: 'c16-l2-p4',
      partNumber: 4,
      title: 'Part 4: Health benefits of dance',
      contextDescription:
        'A university lecturer gives a talk on recent research into the physical, cognitive, and mental health benefits of dancing, particularly for older people and Zumba participants.',
      audioUrl: 'https://res.cloudinary.com/pkwpxicd/video/upload/v1795256758/Test_2_Part_4.mp3',
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
      id: 'c16-l2-g1',
      partNumber: 1,
      questionType: 'note_completion',
      questionRange: [1, 10],
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 2,
      maxNumbers: 1,
      contentWithGaps: [
        'Copying photos to digital format',
        '',
        'Name of company: Picturerep',
        '',
        'Requirements',
        '• Maximum size of photos is 30 cm, minimum size 4 cm.',
        '• Photos must not be in a [[1]] or an album.',
        '',
        'Cost',
        '• The cost for 360 photos is £[[2]] (including one disk).',
        '• Before the completed order is sent, [[3]] is required.',
        '',
        'Services included in the price',
        '• Photos can be placed in a folder, e.g. with the name [[4]].',
        '• The [[5]] and contrast can be improved if necessary.',
        '• Photos which are very fragile will be scanned by [[6]].',
        '',
        'Special restore service (costs extra)',
        '• It may be possible to remove an object from a photo, or change the [[7]].',
        '• A photo which is not correctly in [[8]] cannot be fixed.',
        '',
        'Other information',
        '• Orders are completed within [[9]].',
        '• Send the photos in a box (not [[10]]).',
      ].join('\n'),
      questions: [
        {
          id: 'c16-l2-q1',
          questionNumber: 1,
          prompt: 'Photos must not be in a [1] or an album.',
          answerKey: 'frame',
          acceptedAlternatives: ['frame'],
          explanation: 'The employee states that photos must be separate and not stuck in an album or put in a frame.',
          transcriptExcerpt: 'And the photos must not be in a frame or an album.',
          audioTimestampSeconds: 20,
        },
        {
          id: 'c16-l2-q2',
          questionNumber: 2,
          prompt: 'The cost for 360 photos is £[2] (including one disk).',
          answerKey: '195',
          acceptedAlternatives: ['195', '£195'],
          explanation: 'While up to 300 photos costs £195 and up to 400 normally costs £250, 360 photos falls under a special offer for £195.',
          transcriptExcerpt: 'So for 360 photos it will be £195.',
          audioTimestampSeconds: 42,
        },
        {
          id: 'c16-l2-q3',
          questionNumber: 3,
          prompt: 'Before the completed order is sent, [3] is required.',
          answerKey: 'payment',
          acceptedAlternatives: ['payment'],
          explanation: 'The employee explains that payment is collected once the scanning is complete, prior to sending the order out.',
          transcriptExcerpt: 'We wait until we have completed the job, and then we require payment before sending the photos back.',
          audioTimestampSeconds: 62,
        },
        {
          id: 'c16-l2-q4',
          questionNumber: 4,
          prompt: 'Photos can be placed in a folder, e.g. with the name [4].',
          answerKey: 'Grandparents',
          acceptedAlternatives: ['Grandparents', 'grandparents'],
          explanation: 'As an example of grouping photos into named folders on the disk, the woman suggests using the name Grandparents.',
          transcriptExcerpt: 'So I could save the ones of my grandparents in a folder called Grandparents?',
          audioTimestampSeconds: 85,
        },
        {
          id: 'c16-l2-q5',
          questionNumber: 5,
          prompt: 'The [5] and contrast can be improved if necessary.',
          answerKey: 'colour',
          acceptedAlternatives: ['colour', 'color', 'colours', 'colors'],
          explanation: 'Included in the standard service, the technicians can make improvements to the colour and contrast of each scan.',
          transcriptExcerpt: 'We also look at the colour and contrast and make improvements if necessary.',
          audioTimestampSeconds: 105,
        },
        {
          id: 'c16-l2-q6',
          questionNumber: 6,
          prompt: 'Photos which are very fragile will be scanned by [6].',
          answerKey: 'hand',
          acceptedAlternatives: ['hand'],
          explanation: 'Fragile photos are not put through the automatic machine; instead, they are scanned by hand.',
          transcriptExcerpt: 'If any look particularly fragile, we do them by hand.',
          audioTimestampSeconds: 120,
        },
        {
          id: 'c16-l2-q7',
          questionNumber: 7,
          prompt: 'It may be possible to remove an object from a photo, or change the [7].',
          answerKey: 'background',
          acceptedAlternatives: ['background'],
          explanation: 'For an extra charge, the restore service can remove an unwanted object or completely alter the background.',
          transcriptExcerpt: 'We can remove an object from a photo, or maybe change the background.',
          audioTimestampSeconds: 140,
        },
        {
          id: 'c16-l2-q8',
          questionNumber: 8,
          prompt: 'A photo which is not correctly in [8] cannot be fixed.',
          answerKey: 'focus',
          acceptedAlternatives: ['focus'],
          explanation: 'If a photograph is out of focus, nothing can be done to fix it.',
          transcriptExcerpt: 'If a photo isn\'t mostly in focus, then I\'m afraid there\'s nothing we can do.',
          audioTimestampSeconds: 155,
        },
        {
          id: 'c16-l2-q9',
          questionNumber: 9,
          prompt: 'Orders are completed within [9].',
          answerKey: '10 days',
          acceptedAlternatives: ['10 days', 'ten days'],
          explanation: 'The company aims to complete and return all orders within 10 days.',
          transcriptExcerpt: 'We get the work done within 10 days.',
          audioTimestampSeconds: 168,
        },
        {
          id: 'c16-l2-q10',
          questionNumber: 10,
          prompt: 'Send the photos in a box (not [10]).',
          answerKey: 'plastic',
          acceptedAlternatives: ['plastic'],
          explanation: 'Customers should pack their photos in a sturdy cardboard box rather than a plastic one.',
          transcriptExcerpt: 'In a cardboard box, and please don\'t use a plastic one.',
          audioTimestampSeconds: 178,
        },
      ],
    },

    // =========================================================================
    // PART 2: Questions 11-15 (Multiple Choice Single)
    // =========================================================================
    {
      id: 'c16-l2-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      questionRange: [11, 15],
      title: 'Questions 11–15',
      instructions: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          id: 'c16-l2-q11',
          questionNumber: 11,
          prompt: 'Dartfield House school used to be',
          options: MC_Q11_OPTIONS,
          answerKey: 'C',
          explanation: 'Before becoming a school, the building served as the offices of the local council (it was built as a family home, then used by the council before the school took over).',
          transcriptExcerpt: 'It was built in 1908 as a family home, then in 1922 it was taken over by the local council.',
          audioTimestampSeconds: 20,
        },
        {
          id: 'c16-l2-q12',
          questionNumber: 12,
          prompt: 'What is planned with regard to the lower school?',
          options: MC_Q12_OPTIONS,
          answerKey: 'B',
          explanation: 'The lower school is moving to new buildings on the main site, while the old lower school site has been sold to a housing developer for new homes.',
          transcriptExcerpt: 'The lower school site will be used by a developer to build new houses.',
          audioTimestampSeconds: 48,
        },
        {
          id: 'c16-l2-q13',
          questionNumber: 13,
          prompt: 'The catering has been changed because of',
          options: MC_Q13_OPTIONS,
          answerKey: 'A',
          explanation: 'Because pupil numbers rose, students had to wait a very long time in queues for lunch, prompting the catering overhaul.',
          transcriptExcerpt: 'The main issue has been that pupils have had to wait a long time to be served.',
          audioTimestampSeconds: 78,
        },
        {
          id: 'c16-l2-q14',
          questionNumber: 14,
          prompt: 'Parents are asked to',
          options: MC_Q14_OPTIONS,
          answerKey: 'A',
          explanation: 'Parents are asked to review the menus with their children in advance so they know which serving point to head to at lunchtime.',
          transcriptExcerpt: 'We ask parents to discuss the options with their children in advance so they know which serving point to go to.',
          audioTimestampSeconds: 105,
        },
        {
          id: 'c16-l2-q15',
          questionNumber: 15,
          prompt: 'What does the speaker say about the existing canteen?',
          options: MC_Q15_OPTIONS,
          answerKey: 'C',
          explanation: 'Although food will no longer be served in the old canteen, tables will remain there so pupils can bring their food in to eat.',
          transcriptExcerpt: 'Pupils will still be able to use the old canteen as a place to eat their food.',
          audioTimestampSeconds: 130,
        },
      ],
    },

    // =========================================================================
    // PART 2: Questions 16-18 (Matching)
    // =========================================================================
    {
      id: 'c16-l2-g3',
      partNumber: 2,
      questionType: 'matching',
      questionRange: [16, 18],
      title: 'Questions 16–18',
      instructions:
        'What comment does the speaker make about each of the following serving points in the Food Hall?\nChoose THREE answers from the box and write the correct letter, A–D, next to Questions 16–18.',
      optionsList: MATCHING_Q16_OPTIONS,
      optionReuseAllowed: false,
      questions: [
        {
          id: 'c16-l2-q16',
          questionNumber: 16,
          prompt: 'World Adventures',
          answerKey: 'D',
          explanation: 'World Adventures serves food from a different country every day, meaning the menu changes daily.',
          transcriptExcerpt: 'World Adventures will serve a different country\'s cuisine each day.',
          audioTimestampSeconds: 150,
        },
        {
          id: 'c16-l2-q17',
          questionNumber: 17,
          prompt: 'Street Life',
          answerKey: 'A',
          explanation: 'For Street Life, pupils are invited to work with the chefs to help plan the menus.',
          transcriptExcerpt: 'With Street Life, we\'ll be asking pupils to get involved in deciding what\'s on the menu.',
          audioTimestampSeconds: 165,
        },
        {
          id: 'c16-l2-q18',
          questionNumber: 18,
          prompt: 'Speedy Italian',
          answerKey: 'B',
          explanation: 'Speedy Italian serves pasta and pizza that contain no meat or fish (vegetarian food only).',
          transcriptExcerpt: 'None of the dishes at Speedy Italian will contain meat or fish.',
          audioTimestampSeconds: 180,
        },
      ],
    },

    // =========================================================================
    // PART 2: Questions 19-20 (Multiple Choice Multi)
    // =========================================================================
    {
      id: 'c16-l2-g4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      questionRange: [19, 20],
      title: 'Questions 19 and 20',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO optional after-school lessons are new?',
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'c16-l2-q19',
          questionNumber: 19,
          prompt: 'Which TWO optional after-school lessons are new? (First choice)',
          options: MC_Q19_OPTIONS,
          answerKey: ['B', 'C'],
          explanation: 'Piano lessons (B) and acting classes (C) are being introduced as new after-school activities.',
          transcriptExcerpt: 'We are introducing individual piano lessons and also drama classes where pupils can learn acting.',
          audioTimestampSeconds: 198,
        },
        {
          id: 'c16-l2-q20',
          questionNumber: 20,
          prompt: 'Which TWO optional after-school lessons are new? (Second choice)',
          options: MC_Q19_OPTIONS,
          answerKey: ['B', 'C'],
          explanation: 'Piano (B) and acting (C) are the two newly added after-school options; swimming, cycling, and theatre sound and lighting were already running or planned differently.',
          transcriptExcerpt: 'Piano lessons and acting classes are both brand-new additions this term.',
          audioTimestampSeconds: 205,
        },
      ],
    },

    // =========================================================================
    // PART 3: Questions 21-24 (Multiple Choice Single)
    // =========================================================================
    {
      id: 'c16-l2-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      questionRange: [21, 24],
      title: 'Questions 21–24',
      instructions: 'Choose the correct letter, A, B or C.',
      questions: [
        {
          id: 'c16-l2-q21',
          questionNumber: 21,
          prompt: 'Luke read that one reason why we often forget dreams is that',
          options: MC_Q21_OPTIONS,
          answerKey: 'B',
          explanation: 'Luke read that if we remembered all our dreams, we might mix them up with real memories and become confused about what actually happened.',
          transcriptExcerpt: 'If we remembered everything, we might get mixed up about what actually happened and what we dreamed.',
          audioTimestampSeconds: 22,
        },
        {
          id: 'c16-l2-q22',
          questionNumber: 22,
          prompt: 'What do Luke and Susie agree about dreams predicting the future?',
          options: MC_Q22_OPTIONS,
          answerKey: 'A',
          explanation: 'Both students agree that when a dream seems to come true, it is merely a coincidence because we have so many dreams.',
          transcriptExcerpt: 'I think it\'s just a coincidence really.',
          audioTimestampSeconds: 48,
        },
        {
          id: 'c16-l2-q23',
          questionNumber: 23,
          prompt: 'Susie says that a study on pre-school children having a short nap in the day',
          options: MC_Q23_OPTIONS,
          answerKey: 'C',
          explanation: 'Susie notes that the study on daytime naps in pre-schoolers did not produce any obvious or definite findings.',
          transcriptExcerpt: 'They didn\'t really come up with any definite results.',
          audioTimestampSeconds: 75,
        },
        {
          id: 'c16-l2-q24',
          questionNumber: 24,
          prompt: 'In their last assignment, both students had problems with',
          options: MC_Q24_OPTIONS,
          answerKey: 'C',
          explanation: 'Both Luke and Susie lost marks on the self-assessment section of their previous psychology assignment.',
          transcriptExcerpt: 'We both had trouble with the self-assessment part last time.',
          audioTimestampSeconds: 102,
        },
      ],
    },

    // =========================================================================
    // PART 3: Questions 25-30 (Flow Chart Completion)
    // =========================================================================
    {
      id: 'c16-l2-g6',
      partNumber: 3,
      questionType: 'flow_chart_completion',
      questionRange: [25, 30],
      title: 'Questions 25–30',
      instructions: 'Complete the flow chart below.\nWrite ONE WORD ONLY for each answer.',
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      flowChartSteps: [
        {
          stepNumber: 1,
          title: 'Decide on research question:',
          descriptionWithGaps: 'Is there a relationship between hours of sleep and number of dreams?',
          questionNumbers: [],
        },
        {
          stepNumber: 2,
          title: 'Decide on sample:',
          descriptionWithGaps: 'Twelve students from the [[25]] department',
          questionNumbers: [25],
        },
        {
          stepNumber: 3,
          title: 'Decide on methodology:',
          descriptionWithGaps: 'Self-reporting',
          questionNumbers: [],
        },
        {
          stepNumber: 4,
          title: 'Decide on procedure:',
          descriptionWithGaps: 'Answers on [[26]]',
          questionNumbers: [26],
        },
        {
          stepNumber: 5,
          descriptionWithGaps:
            'Check ethical guidelines for working with [[27]]\nEnsure that risk is assessed and [[28]] is kept to a minimum',
          questionNumbers: [27, 28],
        },
        {
          stepNumber: 6,
          title: 'Analyse the results',
          descriptionWithGaps: 'Calculate the correlation and make a [[29]]',
          questionNumbers: [29],
        },
        {
          stepNumber: 7,
          descriptionWithGaps: '[[30]] the research',
          questionNumbers: [30],
        },
      ],
      questions: [
        {
          id: 'c16-l2-q25',
          questionNumber: 25,
          prompt: 'Twelve students from the [25] department',
          answerKey: 'history',
          acceptedAlternatives: ['history'],
          explanation: 'They decide to recruit 12 students from the history department rather than psychology or literature.',
          transcriptExcerpt: 'Let\'s use students from the history department.',
          audioTimestampSeconds: 130,
        },
        {
          id: 'c16-l2-q26',
          questionNumber: 26,
          prompt: 'Answers on [26]',
          answerKey: 'paper',
          acceptedAlternatives: ['paper'],
          explanation: 'Instead of an online form, participants will record their sleep and dream answers on paper.',
          transcriptExcerpt: 'It\'ll be better if they write their answers on paper as soon as they wake up.',
          audioTimestampSeconds: 152,
        },
        {
          id: 'c16-l2-q27',
          questionNumber: 27,
          prompt: 'Check ethical guidelines for working with [27]',
          answerKey: 'humans',
          acceptedAlternatives: ['humans', 'people'],
          explanation: 'Because the study involves people rather than animals, they must consult the ethical guidelines for research on humans.',
          transcriptExcerpt: 'We need to check the ethical guidelines for research involving humans.',
          audioTimestampSeconds: 170,
        },
        {
          id: 'c16-l2-q28',
          questionNumber: 28,
          prompt: 'Ensure that risk is assessed and [28] is kept to a minimum',
          answerKey: 'stress',
          acceptedAlternatives: ['stress'],
          explanation: 'The ethical assessment requires ensuring that any psychological stress to participants is kept to a minimum.',
          transcriptExcerpt: 'We have to make sure that any stress is kept to a minimum.',
          audioTimestampSeconds: 185,
        },
        {
          id: 'c16-l2-q29',
          questionNumber: 29,
          prompt: 'Calculate the correlation and make a [29]',
          answerKey: 'graph',
          acceptedAlternatives: ['graph'],
          explanation: 'Once they calculate the correlation between hours of sleep and dream frequency, they will plot the data on a graph.',
          transcriptExcerpt: 'Then we\'ll calculate the correlation and present it in a graph.',
          audioTimestampSeconds: 202,
        },
        {
          id: 'c16-l2-q30',
          questionNumber: 30,
          prompt: '[30] the research',
          answerKey: 'evaluate',
          acceptedAlternatives: ['evaluate'],
          explanation: 'The final step of the project is to evaluate their research.',
          transcriptExcerpt: 'And the very last thing is to evaluate our research.',
          audioTimestampSeconds: 215,
        },
      ],
    },

    // =========================================================================
    // PART 4: Questions 31-40 (Note Completion)
    // =========================================================================
    {
      id: 'c16-l2-g7',
      partNumber: 4,
      questionType: 'note_completion',
      questionRange: [31, 40],
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: [
        'Health benefits of dance',
        '',
        'Recent findings:',
        '• All forms of dance produce various hormones associated with feelings of happiness.',
        '• Dancing with others has a more positive impact than dancing alone.',
        '• An experiment on university students suggested that dance increases [[31]].',
        '• For those with mental illness, dance could be used as a form of [[32]].',
        '',
        'Benefits of dance for older people:',
        '• accessible for people with low levels of [[33]]',
        '• reduces the risk of heart disease',
        '• better [[34]] reduces the risk of accidents',
        '• improves [[35]] function by making it work faster',
        '• improves participants\' general well-being',
        '• gives people more [[36]] to take exercise',
        '• can lessen the feeling of [[37]], very common in older people',
        '',
        'Benefits of Zumba:',
        '• A study at The University of Wisconsin showed that doing Zumba for 40 minutes uses up as many [[38]] as other quite intense forms of exercise.',
        '• The American Journal of Health Behavior study showed that:',
        '  – women suffering from [[39]] benefited from doing Zumba.',
        '  – Zumba became a [[40]] for the participants.',
      ].join('\n'),
      questions: [
        {
          id: 'c16-l2-q31',
          questionNumber: 31,
          prompt: 'An experiment on university students suggested that dance increases [31].',
          answerKey: 'creativity',
          acceptedAlternatives: ['creativity'],
          explanation: 'Lovatt\'s experiment on university students showed that improvised dancing boosted problem-solving and creativity.',
          transcriptExcerpt: 'He found that dance improved their creativity.',
          audioTimestampSeconds: 35,
        },
        {
          id: 'c16-l2-q32',
          questionNumber: 32,
          prompt: 'For those with mental illness, dance could be used as a form of [32].',
          answerKey: 'therapy',
          acceptedAlternatives: ['therapy'],
          explanation: 'Researchers suggested that dance could be prescribed as a form of therapy for people suffering from mental illness.',
          transcriptExcerpt: 'Dance could even be used as a form of therapy for people with mental illness.',
          audioTimestampSeconds: 52,
        },
        {
          id: 'c16-l2-q33',
          questionNumber: 33,
          prompt: 'accessible for people with low levels of [33]',
          answerKey: 'fitness',
          acceptedAlternatives: ['fitness'],
          explanation: 'Dance is suitable even for older adults who have very low levels of physical fitness.',
          transcriptExcerpt: 'It\'s a great activity for those with low levels of fitness.',
          audioTimestampSeconds: 78,
        },
        {
          id: 'c16-l2-q34',
          questionNumber: 34,
          prompt: 'better [34] reduces the risk of accidents',
          answerKey: 'balance',
          acceptedAlternatives: ['balance'],
          explanation: 'Dancing develops better balance, which helps prevent falls and accidents in older people.',
          transcriptExcerpt: 'It improves their balance, which reduces the risk of falls and accidents.',
          audioTimestampSeconds: 98,
        },
        {
          id: 'c16-l2-q35',
          questionNumber: 35,
          prompt: 'improves [35] function by making it work faster',
          answerKey: 'brain',
          acceptedAlternatives: ['brain'],
          explanation: 'Dancing enhances brain function by increasing cognitive processing speed.',
          transcriptExcerpt: 'It also improves brain function by making it work faster.',
          audioTimestampSeconds: 118,
        },
        {
          id: 'c16-l2-q36',
          questionNumber: 36,
          prompt: 'gives people more [36] to take exercise',
          answerKey: 'motivation',
          acceptedAlternatives: ['motivation'],
          explanation: 'Because dance is enjoyable, it gives older adults greater motivation to keep exercising regularly.',
          transcriptExcerpt: 'It gives participants much more motivation to take exercise.',
          audioTimestampSeconds: 140,
        },
        {
          id: 'c16-l2-q37',
          questionNumber: 37,
          prompt: 'can lessen the feeling of [37], very common in older people',
          answerKey: 'isolation',
          acceptedAlternatives: ['isolation'],
          explanation: 'Group dancing helps reduce the sense of social isolation often experienced by older adults.',
          transcriptExcerpt: 'It can help reduce the feeling of isolation that is so common among older people.',
          audioTimestampSeconds: 160,
        },
        {
          id: 'c16-l2-q38',
          questionNumber: 38,
          prompt: 'doing Zumba for 40 minutes uses up as many [38] as other quite intense forms of exercise.',
          answerKey: 'calories',
          acceptedAlternatives: ['calories'],
          explanation: 'The University of Wisconsin study found that a 40-minute Zumba class burns as many calories as kickboxing or step aerobics.',
          transcriptExcerpt: '40 minutes of Zumba uses up as many calories as other intense forms of exercise.',
          audioTimestampSeconds: 185,
        },
        {
          id: 'c16-l2-q39',
          questionNumber: 39,
          prompt: 'women suffering from [39] benefited from doing Zumba.',
          answerKey: 'obesity',
          acceptedAlternatives: ['obesity'],
          explanation: 'The study published in The American Journal of Health Behavior focused on women with obesity.',
          transcriptExcerpt: 'A study of women suffering from obesity showed significant benefits from Zumba.',
          audioTimestampSeconds: 205,
        },
        {
          id: 'c16-l2-q40',
          questionNumber: 40,
          prompt: 'Zumba became a [40] for the participants.',
          answerKey: 'habit',
          acceptedAlternatives: ['habit'],
          explanation: 'Participants enjoyed the classes so much that doing Zumba became a regular habit after the study ended.',
          transcriptExcerpt: 'Attending Zumba classes became a habit for the participants.',
          audioTimestampSeconds: 222,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 16 Academic Listening Test 2',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      parts: [
        { partNumber: 1, audioUrl: 'https://res.cloudinary.com/pkwpxicd/video/upload/v1795256747/Test_2_Part_1.mp3', durationSeconds: 398 },
        { partNumber: 2, audioUrl: 'https://res.cloudinary.com/pkwpxicd/video/upload/v1795256752/Test_2_Part_2.mp3', durationSeconds: 464 },
        { partNumber: 3, audioUrl: 'https://res.cloudinary.com/pkwpxicd/video/upload/v1795256751/Test_2_Part_3.mp3', durationSeconds: 417 },
        { partNumber: 4, audioUrl: 'https://res.cloudinary.com/pkwpxicd/video/upload/v1795256758/Test_2_Part_4.mp3', durationSeconds: 526 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge16ListeningTest2(authorId?: string) {
  const data = getCambridge16ListeningTest2Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 16 Listening Test 2 validation failed: ${validationErrors.join('; ')}`);
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
