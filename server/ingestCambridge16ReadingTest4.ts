import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

const SUMMARY_Q18_22_OPTIONS = [
  { key: 'A', text: 'fast' },
  { key: 'B', text: 'isolated' },
  { key: 'C', text: 'emotional' },
  { key: 'D', text: 'worrying' },
  { key: 'E', text: 'many' },
  { key: 'F', text: 'hard' },
  { key: 'G', text: 'combined' },
  { key: 'H', text: 'thorough' },
];

const HEADINGS_Q27_32_OPTIONS = [
  { key: 'i', text: 'An increasing divergence of attitudes towards AI' },
  { key: 'ii', text: 'Reasons why we have more faith in human judgement than in AI' },
  { key: 'iii', text: 'The superiority of AI projections over those made by humans' },
  { key: 'iv', text: 'The process by which AI can help us make good decisions' },
  { key: 'v', text: 'The advantages of involving users in AI processes' },
  { key: 'vi', text: 'Widespread distrust of an AI innovation' },
  { key: 'vii', text: 'Encouraging openness about how AI functions' },
  { key: 'viii', text: 'A surprisingly successful AI application' },
];

export function getCambridge16ReadingTest4Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'c16_r4_passages.json'), 'utf8').replace(/^\uFEFF/, '')
  );

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-6 (Diagram Completion)
    {
      id: 'c16-r4-g1',
      passageId: 'c16-r4-p1',
      questionType: 'diagram_completion',
      title: 'Questions 1–6',
      instructions:
        'Label the diagrams below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–6 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      diagramData: {
        imageUrl:
          'https://res.cloudinary.com/pkwpxicd/image/upload/v1794726490/Cambridge_Academic_16_Reading_Picture_Test_4.png',
        labels: [],
      },
      contentWithGaps: [
        'The Persian Qanat Method',
        '• [1] to direct the tunnelling',
        '• water runs into a [2] used by local people',
        '• vertical shafts to remove earth and for [3]',
        '',
        'Cross-section of a Roman Qanat Shaft',
        '• [4] made of wood or stone',
        '• [5] attached to the plumb line',
        '• handholds and footholds used for [6]',
      ].join('\n'),
      questions: [
        {
          id: 'c16-r4-q1',
          questionNumber: 1,
          prompt: '[1] to direct the tunnelling',
          answerKey: 'posts',
          acceptedAlternatives: ['posts'],
          explanation:
            'Paragraph 1 explains that the qanat method consisted of placing posts over a hill in a straight line to ensure that the tunnel kept to its route.',
          evidenceQuote:
            'consisted of placing posts over a hill in a straight line, to ensure that the tunnel kept to its route',
          paragraphRef: '1',
        },
        {
          id: 'c16-r4-q2',
          questionNumber: 2,
          prompt: 'water runs into a [2] used by local people',
          answerKey: 'canal',
          acceptedAlternatives: ['canal'],
          explanation:
            'Paragraph 1 states that once completed, the tunnel allowed water to flow from the top of a hillside down towards a canal, which supplied water for human use.',
          evidenceQuote:
            'allowed water to flow from the top of a hillside down towards a canal, which supplied water for human use.',
          paragraphRef: '1',
        },
        {
          id: 'c16-r4-q3',
          questionNumber: 3,
          prompt: 'vertical shafts to remove earth and for [3]',
          answerKey: 'ventilation',
          acceptedAlternatives: ['ventilation'],
          explanation:
            'Paragraph 1 notes that the excavated soil was taken up to the surface using the shafts, which also provided ventilation during the work.',
          evidenceQuote:
            'The excavated soil was taken up to the surface using the shafts, which also provided ventilation during the work.',
          paragraphRef: '1',
        },
        {
          id: 'c16-r4-q4',
          questionNumber: 4,
          prompt: '[4] made of wood or stone',
          answerKey: 'lid',
          acceptedAlternatives: ['lid'],
          explanation:
            'Paragraph 2 states that Roman qanat shafts were covered with a wooden or stone lid.',
          evidenceQuote: 'were covered with a wooden or stone lid.',
          paragraphRef: '2',
        },
        {
          id: 'c16-r4-q5',
          questionNumber: 5,
          prompt: '[5] attached to the plumb line',
          answerKey: 'weight',
          acceptedAlternatives: ['weight'],
          explanation:
            'Paragraph 2 explains that Romans hung a plumb line from a rod placed across the top of each shaft and made sure that the weight at the end of it hung in the center of the shaft.',
          evidenceQuote:
            'hung a plumb line from a rod placed across the top of each shaft and made sure that the weight at the end of it hung in the center of the shaft.',
          paragraphRef: '2',
        },
        {
          id: 'c16-r4-q6',
          questionNumber: 6,
          prompt: 'handholds and footholds used for [6]',
          answerKey: 'climbing',
          acceptedAlternatives: ['climbing'],
          explanation:
            'Paragraph 2 states that the shafts were equipped with handholds and footholds to help those climbing in and out of them.',
          evidenceQuote:
            'The shafts were equipped with handholds and footholds to help those climbing in and out of them',
          paragraphRef: '2',
        },
      ],
    },

    // PASSAGE 1: Questions 7-10 (True / False / Not Given)
    {
      id: 'c16-r4-g2',
      passageId: 'c16-r4-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 7–10',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 7–10 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 7,
      endQuestionNumber: 10,
      questions: [
        {
          id: 'c16-r4-q7',
          questionNumber: 7,
          prompt:
            'The counter-excavation method completely replaced the qanat method in the 6th century BCE.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 3 states that the counter-excavation method was only used when the qanat method was not a practical alternative, so it did not completely replace the qanat method.',
          evidenceQuote:
            'It was used to cut through high mountains when the qanat method was not a practical alternative.',
          paragraphRef: '3',
        },
        {
          id: 'c16-r4-q8',
          questionNumber: 8,
          prompt:
            'Only experienced builders were employed to construct a tunnel using the counter-excavation method.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 3 states that the counter-excavation method required greater planning and advanced knowledge of surveying, mathematics and geometry, but there is no information about whether only experienced builders were employed.',
          evidenceQuote:
            'This method required greater planning and advanced knowledge of surveying, mathematics and geometry',
          paragraphRef: '3',
        },
        {
          id: 'c16-r4-q9',
          questionNumber: 9,
          prompt:
            'The information about a problem that occurred during the construction of the Saldae aqueduct system was found in an ancient book.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 3 states that the information was written as an inscription on the side of the 428-meter tunnel itself, not in an ancient book.',
          evidenceQuote:
            'An inscription written on the side of a 428-meter tunnel, built by the Romans as part of the Saldae aqueduct system in modern-day Algeria, describes how the two teams of builders missed each other',
          paragraphRef: '3',
        },
        {
          id: 'c16-r4-q10',
          questionNumber: 10,
          prompt:
            'The mistake made by the builders of the Saldae aqueduct system was that the two parts of the tunnel failed to meet.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 3 states that the inscription describes how the two teams of builders missed each other in the mountain and how a lateral link corrected the initial error.',
          evidenceQuote:
            'describes how the two teams of builders missed each other in the mountain and how the later construction of a lateral link between both corridors corrected the initial error.',
          paragraphRef: '3',
        },
      ],
    },

    // PASSAGE 1: Questions 11-13 (Short Answer)
    {
      id: 'c16-r4-g3',
      passageId: 'c16-r4-p1',
      questionType: 'short_answer',
      title: 'Questions 11–13',
      instructions:
        'Answer the questions below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 11–13 on your answer sheet.',
      startQuestionNumber: 11,
      endQuestionNumber: 13,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      questions: [
        {
          id: 'c16-r4-q11',
          questionNumber: 11,
          prompt: 'What type of mineral were the Dolaucothi mines in Wales built to extract?',
          answerKey: 'gold',
          acceptedAlternatives: ['gold'],
          explanation:
            'Paragraph 4 states that traces of tunnels used to mine gold can still be found at the Dolaucothi mines in Wales.',
          evidenceQuote:
            'Traces of such tunnels used to mine gold can still be found at the Dolaucothi mines in Wales.',
          paragraphRef: '4',
        },
        {
          id: 'c16-r4-q12',
          questionNumber: 12,
          prompt: 'In addition to the patron, whose name might be carved onto a tunnel?',
          answerKey: 'the architect',
          acceptedAlternatives: [
            'the architect',
            'architect',
            "the architect's",
            "architect's",
            "the architect's name",
            "architect's name",
          ],
          explanation:
            'Paragraph 5 states that most tunnels had inscriptions showing the names of patrons who ordered construction and sometimes the name of the architect.',
          evidenceQuote:
            'Most tunnels had inscriptions showing the names of patrons who ordered construction and sometimes the name of the architect.',
          paragraphRef: '5',
        },
        {
          id: 'c16-r4-q13',
          questionNumber: 13,
          prompt: 'What part of Seleuceia Pieria was the Çevlik tunnel built to protect?',
          answerKey: 'the harbour',
          acceptedAlternatives: ['the harbour', 'harbour', 'the harbor', 'harbor'],
          explanation:
            'Paragraph 5 states that the Çevlik tunnel in Turkey was built to divert the floodwater threatening the harbor of the ancient city of Seleuceia Pieria.',
          evidenceQuote:
            'built to divert the floodwater threatening the harbor of the ancient city of Seleuceia Pieria',
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 2: Questions 14-17 (Multiple Choice Single)
    {
      id: 'c16-r4-g4',
      passageId: 'c16-r4-p2',
      questionType: 'multiple_choice_single',
      title: 'Questions 14–17',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 14–17 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 17,
      questions: [
        {
          id: 'c16-r4-q14',
          questionNumber: 14,
          prompt: "What is the writer's main point in the first paragraph?",
          options: [
            { key: 'A', text: 'Our use of technology is having a hidden effect on us.' },
            { key: 'B', text: 'Technology can be used to help youngsters to read.' },
            { key: 'C', text: 'Travellers should be encouraged to use technology on planes.' },
            { key: 'D', text: 'Playing games is a more popular use of technology than reading.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            'Paragraph 1 states that unbeknown to most of us, an invisible, game-changing transformation links everyone using digital devices: the neuronal circuit underlying reading is subtly, rapidly changing.',
          evidenceQuote:
            'Unbeknown to most of us, an invisible, game-changing transformation links everyone in this picture: the neuronal circuit that underlies the brain’s ability to read is subtly, rapidly changing',
          paragraphRef: '1',
        },
        {
          id: 'c16-r4-q15',
          questionNumber: 15,
          prompt: 'What main point does Sherry Turkle make about innovation?',
          options: [
            { key: 'A', text: 'Technological innovation has led to a reduction in print reading.' },
            { key: 'B', text: 'We should pay attention to what might be lost when innovation occurs.' },
            { key: 'C', text: 'We should encourage more young people to become involved in innovation.' },
            { key: 'D', text: 'There is a difference between developing products and developing ideas.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'Paragraph 3 cites MIT scholar Sherry Turkle writing that we do not err as a society when we innovate, but when we ignore what we disrupt or diminish while innovating.',
          evidenceQuote:
            'As MIT scholar Sherry Turkle has written, we do not err as a society when we innovate but when we ignore what we disrupt or diminish while innovating.',
          paragraphRef: '3',
        },
        {
          id: 'c16-r4-q16',
          questionNumber: 16,
          prompt: 'What point is the writer making in the fourth paragraph?',
          options: [
            { key: 'A', text: 'Humans have an inborn ability to read and write.' },
            { key: 'B', text: 'Reading can be done using many different mediums.' },
            { key: 'C', text: 'Writing systems make unexpected demands on the brain.' },
            { key: 'D', text: 'Some brain circuits adjust to whatever is required of them.' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            'Paragraph 4 explains that the reading circuit is not given through a genetic blueprint; it adapts to the environment’s requirements and the characteristics of whatever medium is used.',
          evidenceQuote:
            'Further, it will adapt to that environment’s requirements – from different writing systems to the characteristics of whatever medium is used.',
          paragraphRef: '4',
        },
        {
          id: 'c16-r4-q17',
          questionNumber: 17,
          prompt: 'According to Mark Edmundson, the attitude of college students',
          options: [
            { key: 'A', text: 'has changed the way he teaches.' },
            { key: 'B', text: 'has influenced what they select to read.' },
            { key: 'C', text: 'does not worry him as much as it does others.' },
            { key: 'D', text: 'does not match the views of the general public.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'Paragraph 5 states that Mark Edmundson describes how many college students actively avoid classic literature of the 19th and 20th centuries in favour of something simpler because they lack patience for longer, denser texts.',
          evidenceQuote:
            'English literature scholar and teacher Mark Edmundson describes how many college students actively avoid the classic literature of the 19th and 20th centuries in favour of something simpler',
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 2: Questions 18-22 (Summary Completion with Options A-H)
    {
      id: 'c16-r4-g5',
      passageId: 'c16-r4-p2',
      questionType: 'summary_completion_options',
      title: 'Questions 18–22',
      instructions:
        'Complete the summary using the list of words, A–H, below.\nWrite the correct letter, A–H, in boxes 18–22 on your answer sheet.',
      startQuestionNumber: 18,
      endQuestionNumber: 22,
      optionsList: SUMMARY_Q18_22_OPTIONS,
      contentWithGaps: [
        'Studies on digital screen use',
        "There have been many studies on digital screen use, showing some [18] trends. Psychologist Anne Mangen gave high-school students a short story to read, half using digital and half using print mediums. Her team then used a question-and-answer technique to find out how [19] each group's understanding of the plot was. The findings showed a clear pattern in the responses, with those who read screens finding the order of information [20] to recall.",
        '',
        'Studies by Ziming Liu show that students are tending to read [21] words and phrases in a text to save time. This approach, she says, gives the reader a superficial understanding of the [22] content of material, leaving no time for thought.',
      ].join('\n'),
      questions: [
        {
          id: 'c16-r4-q18',
          questionNumber: 18,
          prompt: 'There have been many studies on digital screen use, showing some [18] trends.',
          answerKey: 'D',
          acceptedAlternatives: ['D', 'worrying'],
          explanation:
            'Paragraph 6 states that multiple studies show digital screen use may be causing a variety of troubling ("worrying") downstream effects on reading comprehension.',
          evidenceQuote:
            'Multiple studies show that digital screen use may be causing a variety of troubling downstream effects on reading comprehension',
          paragraphRef: '6',
        },
        {
          id: 'c16-r4-q19',
          questionNumber: 19,
          prompt:
            "Her team then used a question-and-answer technique to find out how [19] each group's understanding of the plot was.",
          answerKey: 'H',
          acceptedAlternatives: ['H', 'thorough'],
          explanation:
            'Paragraph 6 explains that Mangen’s group asked subjects questions about a short story to assess how well ("thorough") they comprehended the plot across mediums.',
          evidenceQuote:
            'studied how high school students comprehend the same material in different mediums. Mangen’s group asked subjects questions about a short story',
          paragraphRef: '6',
        },
        {
          id: 'c16-r4-q20',
          questionNumber: 20,
          prompt:
            'with those who read screens finding the order of information [20] to recall.',
          answerKey: 'F',
          acceptedAlternatives: ['F', 'hard'],
          explanation:
            'Paragraph 6 states that print readers were superior to screen-reading peers in their ability to sequence detail and reconstruct the plot in chronological order, meaning screen readers found the order of information "hard" to recall.',
          evidenceQuote:
            'students who read on print were superior in their comprehension to screen-reading peers, particularly in their ability to sequence detail and reconstruct the plot in chronological order.',
          paragraphRef: '6',
        },
        {
          id: 'c16-r4-q21',
          questionNumber: 21,
          prompt:
            'Studies by Ziming Liu show that students are tending to read [21] words and phrases in a text to save time.',
          answerKey: 'B',
          acceptedAlternatives: ['B', 'isolated'],
          explanation:
            'Paragraph 7 notes that readers sample the first line and then word-spot through the rest of the text — reading "isolated" words and phrases.',
          evidenceQuote:
            'Many readers now use a pattern when reading in which they sample the first line and then word-spot through the rest of the text.',
          paragraphRef: '7',
        },
        {
          id: 'c16-r4-q22',
          questionNumber: 22,
          prompt:
            'This approach, she says, gives the reader a superficial understanding of the [22] content of material, leaving no time for thought.',
          answerKey: 'C',
          acceptedAlternatives: ['C', 'emotional'],
          explanation:
            'Paragraph 7 states that skimming reduces time allocated to deep reading processes, so we don’t have time to grasp complexity, to understand another’s feelings ("emotional" content), to perceive beauty, and to create thoughts of the reader’s own.',
          evidenceQuote:
            'we don’t have time to grasp complexity, to understand another’s feelings, to perceive beauty, and to create thoughts of the reader’s own.',
          paragraphRef: '7',
        },
      ],
    },

    // PASSAGE 2: Questions 23-26 (Yes / No / Not Given)
    {
      id: 'c16-r4-g6',
      passageId: 'c16-r4-p2',
      questionType: 'yes_no_not_given',
      title: 'Questions 23–26',
      instructions:
        'Do the following statements agree with the views of the writer in Reading Passage 2?\nIn boxes 23–26 on your answer sheet, write\nYES if the statement agrees with the views of the writer\nNO if the statement contradicts the views of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 23,
      endQuestionNumber: 26,
      questions: [
        {
          id: 'c16-r4-q23',
          questionNumber: 23,
          prompt: 'The medium we use to read can affect our choice of reading content.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            'Paragraph 8 states that it is about how we all have begun to read on various mediums and how that changes not only what we read, but also the purposes for which we read.',
          evidenceQuote:
            'It is about how we all have begun to read on various mediums and how that changes not only what we read, but also the purposes for which we read.',
          paragraphRef: '8',
        },
        {
          id: 'c16-r4-q24',
          questionNumber: 24,
          prompt:
            'Some age groups are more likely to lose their complex reading skills than others.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            'Paragraph 8 explicitly states: "Nor is it only about the young. The subtle atrophy of critical analysis and empathy affects us all equally."',
          evidenceQuote:
            'Nor is it only about the young. The subtle atrophy of critical analysis and empathy affects us all equally.',
          paragraphRef: '8',
        },
        {
          id: 'c16-r4-q25',
          questionNumber: 25,
          prompt: "False information has become more widespread in today's digital era.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 8 mentions that the atrophy of critical analysis leaves us susceptible to false information and irrational ideas, but does not state whether false information itself has become more widespread.',
          evidenceQuote:
            'leaving us susceptible to false information and irrational ideas.',
          paragraphRef: '8',
        },
        {
          id: 'c16-r4-q26',
          questionNumber: 26,
          prompt:
            'We still have opportunities to rectify the problems that technology is presenting.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            'Paragraph 9 states that the story of the changing reading brain is hardly finished and that we possess both the science and the technology to identify and redress the changes in how we read before they become entrenched.',
          evidenceQuote:
            'We possess both the science and the technology to identify and redress the changes in how we read before they become entrenched.',
          paragraphRef: '9',
        },
      ],
    },

    // PASSAGE 3: Questions 27-32 (Matching Headings)
    {
      id: 'c16-r4-g7',
      passageId: 'c16-r4-p3',
      questionType: 'matching_headings',
      title: 'Questions 27–32',
      instructions:
        'Reading Passage 3 has six sections, A–F.\nChoose the correct heading for each section from the list of headings below.\nWrite the correct number, i–viii, in boxes 27–32 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 32,
      optionsList: HEADINGS_Q27_32_OPTIONS,
      questions: [
        {
          id: 'c16-r4-q27',
          questionNumber: 27,
          prompt: 'Section A',
          answerKey: 'iii',
          acceptedAlternatives: ['iii'],
          explanation:
            'Section A describes how AI can predict the future and states that "AI is almost always better at forecasting than we are", matching iii ("The superiority of AI projections over those made by humans").',
          evidenceQuote:
            'Many decisions in our lives require a good forecast, and AI is almost always better at forecasting than we are.',
          paragraphRef: 'A',
        },
        {
          id: 'c16-r4-q28',
          questionNumber: 28,
          prompt: 'Section B',
          answerKey: 'vi',
          acceptedAlternatives: ['vi'],
          explanation:
            'Section B details the PR disaster of IBM’s Watson for Oncology and how doctors felt suspicion and disbelief, ignoring its recommendations, matching vi ("Widespread distrust of an AI innovation").',
          evidenceQuote:
            'Consequently, this has caused even more suspicion and disbelief, leading many doctors to ignore the seemingly outlandish AI recommendations',
          paragraphRef: 'B',
        },
        {
          id: 'c16-r4-q29',
          questionNumber: 29,
          prompt: 'Section C',
          answerKey: 'ii',
          acceptedAlternatives: ['ii'],
          explanation:
            'Section C explains why people trust other humans (understanding how others think and experiencing their reliability) while feeling anxious and reluctant to trust AI due to its complexity and media attention on AI failures, matching ii ("Reasons why we have more faith in human judgement than in AI").',
          evidenceQuote:
            'Trust in other people is often based on our understanding of how others think and having experience of their reliability.',
          paragraphRef: 'C',
        },
        {
          id: 'c16-r4-q30',
          questionNumber: 30,
          prompt: 'Section D',
          answerKey: 'i',
          acceptedAlternatives: ['i'],
          explanation:
            'Section D describes how watching sci-fi films about AI polarised participants’ attitudes—optimists became more extreme and sceptics more guarded—potentially leading to a split society, matching i ("An increasing divergence of attitudes towards AI").',
          evidenceQuote:
            'simply watching a cinematic vision of our technological future polarised the participants’ attitudes. Optimists became more extreme in their enthusiasm for AI and sceptics became even more guarded.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r4-q31',
          questionNumber: 31,
          prompt: 'Section E',
          answerKey: 'vii',
          acceptedAlternatives: ['vii'],
          explanation:
            'Section E suggests revealing more about the algorithms AI uses and the purposes they serve, similar to transparency reports, matching vii ("Encouraging openness about how AI functions").',
          evidenceQuote:
            'Another solution may be to reveal more about the algorithms which AI uses and the purposes they serve.',
          paragraphRef: 'E',
        },
        {
          id: 'c16-r4-q32',
          questionNumber: 32,
          prompt: 'Section F',
          answerKey: 'v',
          acceptedAlternatives: ['v'],
          explanation:
            'Section F explains that allowing people some control over AI decision-making and a degree of responsibility for implementation improves trust and satisfaction, matching v ("The advantages of involving users in AI processes").',
          evidenceQuote:
            'Research suggests that allowing people some control over AI decision-making could also improve trust and enable AI to learn from human experience.',
          paragraphRef: 'F',
        },
      ],
    },

    // PASSAGE 3: Questions 33-35 (Multiple Choice Single)
    {
      id: 'c16-r4-g8',
      passageId: 'c16-r4-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 33–35',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 33–35 on your answer sheet.',
      startQuestionNumber: 33,
      endQuestionNumber: 35,
      questions: [
        {
          id: 'c16-r4-q33',
          questionNumber: 33,
          prompt: 'What is the writer doing in Section A?',
          options: [
            { key: 'A', text: 'providing a solution to a concern' },
            { key: 'B', text: 'justifying an opinion about an issue' },
            { key: 'C', text: 'highlighting the existence of a problem' },
            { key: 'D', text: 'explaining the reasons for a phenomenon' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'Section A highlights the problem that despite AI’s superior forecasting ability, people still deeply lack confidence in AI predictions and are reluctant to trust it.',
          evidenceQuote:
            'Yet for all these technological advances, we still seem to deeply lack confidence in AI predictions.',
          paragraphRef: 'A',
        },
        {
          id: 'c16-r4-q34',
          questionNumber: 34,
          prompt: 'According to Section C, why might some people be reluctant to accept AI?',
          options: [
            { key: 'A', text: 'They are afraid it will replace humans in decision-making jobs.' },
            { key: 'B', text: 'Its complexity makes them feel that they are at a disadvantage.' },
            { key: 'C', text: 'They would rather wait for the technology to be tested over a period of time.' },
            { key: 'D', text: 'Misunderstandings about how it works make it seem more challenging than it is.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'Section C states that AI’s decision-making process is usually too difficult for most people to comprehend, and interacting with something we don’t understand can cause anxiety and give us a sense that we’re losing control.',
          evidenceQuote:
            'AI’s decision-making process is usually too difficult for most people to comprehend. And interacting with something we don’t understand can cause anxiety and give us a sense that we’re losing control.',
          paragraphRef: 'C',
        },
        {
          id: 'c16-r4-q35',
          questionNumber: 35,
          prompt: 'What does the writer say about the media in Section C of the text?',
          options: [
            { key: 'A', text: 'It leads the public to be mistrustful of AI.' },
            { key: 'B', text: 'It devotes an excessive amount of attention to AI.' },
            { key: 'C', text: 'Its reports of incidents involving AI are often inaccurate.' },
            { key: 'D', text: 'It gives the impression that AI failures are due to designer error.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            'Section C states that embarrassing AI failures receive a disproportionate amount of media attention, emphasising the message that we cannot rely on technology.',
          evidenceQuote:
            'Embarrassing AI failures receive a disproportionate amount of media attention, emphasising the message that we cannot rely on technology.',
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 3: Questions 36-40 (Yes / No / Not Given)
    {
      id: 'c16-r4-g9',
      passageId: 'c16-r4-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 36–40',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 36–40 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 36,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c16-r4-q36',
          questionNumber: 36,
          prompt:
            'Subjective depictions of AI in sci-fi films make people change their opinions about automation.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            'Section D states that watching sci-fi films about AI did not make people change their opinions; instead, it polarised their existing attitudes (optimists became more enthusiastic and sceptics became more guarded).',
          evidenceQuote:
            'simply watching a cinematic vision of our technological future polarised the participants’ attitudes. Optimists became more extreme in their enthusiasm for AI and sceptics became even more guarded.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r4-q37',
          questionNumber: 37,
          prompt:
            'Portrayals of AI in media and entertainment are likely to become more positive.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Section D mentions that AI is represented more and more in media and entertainment, but does not say whether these portrayals are likely to become more positive.',
          evidenceQuote:
            'As AI is represented more and more in media and entertainment, it could lead to a society split between those who benefit from AI and those who reject it.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r4-q38',
          questionNumber: 38,
          prompt:
            "Rejection of the possibilities of AI may have a negative effect on many people's lives.",
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            'Section D states that refusing to accept the advantages offered by AI could place a large group of people at a serious disadvantage.',
          evidenceQuote:
            'More pertinently, refusing to accept the advantages offered by AI could place a large group of people at a serious disadvantage.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r4-q39',
          questionNumber: 39,
          prompt:
            "Familiarity with AI has very little impact on people's attitudes to the technology.",
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            'Section E states the opposite: simply having previous experience with AI can significantly improve people’s opinions about the technology.',
          evidenceQuote:
            'Simply having previous experience with AI can significantly improve people’s opinions about the technology',
          paragraphRef: 'E',
        },
        {
          id: 'c16-r4-q40',
          questionNumber: 40,
          prompt:
            'AI applications which users are able to modify are more likely to gain consumer approval.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            'Section F states that when people were allowed the freedom to slightly modify an algorithm, they felt more satisfied with its decisions, more likely to believe it was superior, and more likely to use it in the future.',
          evidenceQuote:
            'one study showed that when people were allowed the freedom to slightly modify an algorithm, they felt more satisfied with its decisions, more likely to believe it was superior and more likely to use it in the future.',
          paragraphRef: 'F',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 16 Academic Reading Test 4',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge16ReadingTest4(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: string;
  totalQuestions: number;
}> {
  const data = getCambridge16ReadingTest4Data();

  const validationErrors = validateTestVersion(data.passages, data.questionGroups);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed for Cambridge 16 Reading Test 4: ${validationErrors.join('; ')}`);
  }

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = (await db
      .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
      .get()) as { id: string } | undefined;
    resolvedAuthorId = adminUser?.id;
  }
  if (!resolvedAuthorId) {
    const anyUser = (await db
      .prepare('SELECT id FROM users LIMIT 1')
      .get()) as { id: string } | undefined;
    resolvedAuthorId = anyUser?.id;
  }
  if (!resolvedAuthorId) {
    resolvedAuthorId = 'f8b2e30a-ae78-435a-b9d3-a22f34452016';
  }

  const existingTest = (await db
    .prepare(
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%16%Academic%Reading%Test 4%' LIMIT 1"
    )
    .get(data.title)) as { id: string; current_version_number: number } | undefined;

  const now = new Date().toISOString();
  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db
      .prepare(
        'SELECT id FROM reading_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1'
      )
      .get(testId)) as { id: string } | undefined;

    if (existingVersion) {
      versionId = existingVersion.id;
      await db.prepare(`
        UPDATE reading_test_versions
        SET passages_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            status = 'published',
            validation_errors_json = '[]',
            published_at = ?
        WHERE id = ?
      `).run(
        JSON.stringify(data.passages),
        JSON.stringify(data.questionGroups),
        now,
        versionId
      );
    } else {
      versionId = uuidv4();
      await db.prepare(`
        INSERT INTO reading_test_versions (
          id, test_id, version_number, status, passages_json,
          question_groups_json, total_questions, validation_errors_json, published_at, created_at
        ) VALUES (?, ?, 1, 'published', ?, ?, 40, '[]', ?, ?)
      `).run(
        versionId,
        testId,
        JSON.stringify(data.passages),
        JSON.stringify(data.questionGroups),
        now,
        now
      );
    }

    await db.prepare(`
      UPDATE reading_tests
      SET status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(now, testId);
  } else {
    testId = uuidv4();
    versionId = uuidv4();

    await db.prepare(`
      INSERT INTO reading_tests (
        id, title, test_type, category, time_limit_minutes,
        current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 1, 'published', ?, 1, ?, ?)
    `).run(
      testId,
      data.title,
      data.testType,
      data.category,
      data.timeLimitMinutes,
      resolvedAuthorId,
      now,
      now
    );

    await db.prepare(`
      INSERT INTO reading_test_versions (
        id, test_id, version_number, status, passages_json,
        question_groups_json, total_questions, validation_errors_json, published_at, created_at
      ) VALUES (?, ?, 1, 'published', ?, ?, 40, '[]', ?, ?)
    `).run(
      versionId,
      testId,
      JSON.stringify(data.passages),
      JSON.stringify(data.questionGroups),
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
