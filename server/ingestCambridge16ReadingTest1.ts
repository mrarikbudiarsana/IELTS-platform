import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

const HEADINGS_PASSAGE2 = [
  { key: 'i', text: 'The areas and artefacts within the pyramid itself' },
  { key: 'ii', text: 'A difficult task for those involved' },
  { key: 'iii', text: 'A king who saved his people' },
  { key: 'iv', text: 'A single certainty among other less definite facts' },
  { key: 'v', text: 'An overview of the external buildings and areas' },
  { key: 'vi', text: 'A pyramid design that others copied' },
  { key: 'vii', text: 'An idea for changing the design of burial structures' },
  { key: 'viii', text: 'An incredible experience despite the few remains' },
  { key: 'ix', text: 'The answers to some unexpected questions' },
];

const MC_Q25_OPTIONS = [
  { key: 'A', text: 'Initially he had to be persuaded to build in stone rather than clay.' },
  { key: 'B', text: 'There is disagreement concerning the length of his reign.' },
  { key: 'C', text: "He failed to appreciate Imhotep's part in the design of the Step Pyramid." },
  { key: 'D', text: 'A few of his possessions were still in his tomb when archaeologists found it.' },
  { key: 'E', text: 'He criticised the design and construction of other pyramids in Egypt.' },
];

const SUMMARY_Q31_OPTIONS = [
  { key: 'A', text: 'pressure' },
  { key: 'B', text: 'satisfaction' },
  { key: 'C', text: 'intuition' },
  { key: 'D', text: 'promotion' },
  { key: 'E', text: 'reliance' },
  { key: 'F', text: 'confidence' },
  { key: 'G', text: 'information' },
];

const PEOPLE_Q35_OPTIONS = [
  { key: 'A', text: 'Stella Pachidi' },
  { key: 'B', text: 'Hamish Low' },
  { key: 'C', text: 'Ewan McGaughey' },
];

export function getCambridge16ReadingTest1Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'c16_r1_passages.json'), 'utf8')
  );

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-7 (True / False / Not Given)
    {
      id: 'c16-r1-g1',
      passageId: 'c16-r1-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–7',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–7 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 1,
      endQuestionNumber: 7,
      questions: [
        {
          id: 'c16-r1-q1',
          questionNumber: 1,
          prompt: 'Polar bears suffer from various health problems due to the build-up of fat under their skin.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 1 states that while humans with comparable fat levels would suffer from diabetes and heart disease, the polar bear experiences no such consequences.',
          evidenceQuote: 'Yet the polar bear experiences no such consequences.',
          paragraphRef: '1',
        },
        {
          id: 'c16-r1-q2',
          questionNumber: 2,
          prompt: 'The study done by Liu and his colleagues compared different groups of polar bears.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 2 explains that Liu and his colleagues compared polar bears with brown bears, rather than comparing different groups of polar bears.',
          evidenceQuote: 'compared the genetic structure of polar bears with that of their closest relatives',
          paragraphRef: '2',
        },
        {
          id: 'c16-r1-q3',
          questionNumber: 3,
          prompt: 'Liu and colleagues were the first researchers to compare polar bears and brown bears genetically.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 2 describes their genetic comparison of polar bears and brown bears, but does not mention whether they were the first researchers to do so.',
          evidenceQuote: 'A 2014 study by Shi Ping Liu and colleagues',
          paragraphRef: '2',
        },
        {
          id: 'c16-r1-q4',
          questionNumber: 4,
          prompt: "Polar bears are able to control their levels of 'bad' cholesterol by genetic means.",
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 2 notes that polar bears have the APoB gene, which reduces levels of low-density lipoproteins (LDLs), a form of bad cholesterol.',
          evidenceQuote: 'polar bears had a gene known as APoB, which reduces levels of low-density lipoproteins',
          paragraphRef: '2',
        },
        {
          id: 'c16-r1-q5',
          questionNumber: 5,
          prompt: 'Female polar bears are able to survive for about six months without food.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 3 states that pregnant females remain in maternity dens throughout winter, resulting in about six months of fasting while keeping themselves and their cubs alive.',
          evidenceQuote: 'This process results in about six months of fasting',
          paragraphRef: '3',
        },
        {
          id: 'c16-r1-q6',
          questionNumber: 6,
          prompt: 'It was found that the bones of female polar bears were very weak when they came out of their dens in spring.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraphs 3 and 4 state that their bones remain strong and dense and that when they emerged six months later, there was no evidence of significant loss of bone density.',
          evidenceQuote: 'there was no evidence of significant loss of bone density.',
          paragraphRef: '4',
        },
        {
          id: 'c16-r1-q7',
          questionNumber: 7,
          prompt: "The polar bear's mechanism for increasing bone density could also be used by people one day.",
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 4 concludes that if the mechanism of bone remodelling in polar bears can be understood, bedridden humans and astronauts could potentially benefit.',
          evidenceQuote: 'many bedridden humans, and even astronauts, could potentially benefit.',
          paragraphRef: '4',
        },
      ],
    },

    // PASSAGE 1: Questions 8-13 (Note Completion)
    {
      id: 'c16-r1-g2',
      passageId: 'c16-r1-p1',
      questionType: 'note_completion',
      title: 'Questions 8–13',
      instructions:
        'Complete the table below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 8–13 on your answer sheet.',
      startQuestionNumber: 8,
      endQuestionNumber: 13,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Reasons why polar bears should be protected

People think of bears as unintelligent and [[8]].
However, this may not be correct. For example:
• In Tennoji Zoo, a bear has been seen using a branch as a [[9]]. This allowed him to knock down some [[10]].
• A wild polar bear worked out a method of reaching a platform where a [[11]] was located.
• Polar bears have displayed behaviour such as conscious manipulation of objects and activity similar to a [[12]].

Bears may also display emotions. For example:
• They may make movements suggesting [[13]] if disappointed when hunting.
• They may form relationships with other species.`,
      questions: [
        {
          id: 'c16-r1-q8',
          questionNumber: 8,
          prompt: 'People think of bears as unintelligent and [8].',
          answerKey: 'violent',
          acceptedAlternatives: ['violent'],
          explanation: 'Paragraph 5 states that bears seem to be perceived as stupid and in many cases violent.',
          evidenceQuote: 'Bears, on the other hand, seem to be perceived as stupid and in many cases violent.',
          paragraphRef: '5',
        },
        {
          id: 'c16-r1-q9',
          questionNumber: 9,
          prompt: 'In Tennoji Zoo, a bear has been seen using a branch as a [9].',
          answerKey: 'tool',
          acceptedAlternatives: ['tool'],
          explanation: 'Paragraph 5 mentions that GoGo in Tennoji Zoo was observed making use of a tool (a tree branch) to manipulate his environment.',
          evidenceQuote: 'observed making use of a tool to manipulate his environment.',
          paragraphRef: '5',
        },
        {
          id: 'c16-r1-q10',
          questionNumber: 10,
          prompt: 'This allowed him to knock down some [10].',
          answerKey: 'meat',
          acceptedAlternatives: ['meat'],
          explanation: 'Paragraph 5 states that the bear used a tree branch to dislodge a piece of meat hung out of his reach.',
          evidenceQuote: 'to dislodge a piece of meat hung out of his reach.',
          paragraphRef: '5',
        },
        {
          id: 'c16-r1-q11',
          questionNumber: 11,
          prompt: 'A wild polar bear worked out a method of reaching a platform where a [11] was located.',
          answerKey: 'photographer',
          acceptedAlternatives: ['photographer'],
          explanation: 'Paragraph 5 describes a male bear running and jumping onto barrels in an attempt to get to a photographer standing on a platform.',
          evidenceQuote: 'in an attempt to get to a photographer standing on a platform four metres high.',
          paragraphRef: '5',
        },
        {
          id: 'c16-r1-q12',
          questionNumber: 12,
          prompt: 'Polar bears have displayed behaviour such as conscious manipulation of objects and activity similar to a [12].',
          answerKey: 'game',
          acceptedAlternatives: ['game'],
          explanation: 'Paragraph 6 notes that Ames observed bears putting objects in piles and knocking them over in what appeared to be a game.',
          evidenceQuote: 'putting objects in piles and then knocking them over in what appeared to be a game.',
          paragraphRef: '6',
        },
        {
          id: 'c16-r1-q13',
          questionNumber: 13,
          prompt: 'They may make movements suggesting [13] if disappointed when hunting.',
          answerKey: 'frustration',
          acceptedAlternatives: ['frustration'],
          explanation: 'Paragraph 7 states that many bears have been seen to hit out at ice and snow — seemingly out of frustration — when they have just missed out on a kill.',
          evidenceQuote: 'hit out at ice and snow — seemingly out of frustration — when they have just missed out on a kill.',
          paragraphRef: '7',
        },
      ],
    },

    // PASSAGE 2: Questions 14-20 (Matching Headings)
    {
      id: 'c16-r1-g3',
      passageId: 'c16-r1-p2',
      questionType: 'matching_headings',
      title: 'Questions 14–20',
      instructions:
        'Reading Passage 2 has seven paragraphs, A–G.\nChoose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i–ix, in boxes 14–20 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 20,
      optionsList: HEADINGS_PASSAGE2,
      questions: [
        {
          id: 'c16-r1-q14',
          questionNumber: 14,
          prompt: 'Paragraph A',
          options: HEADINGS_PASSAGE2,
          answerKey: 'iv',
          acceptedAlternatives: ['iv', 'IV'],
          explanation:
            'Paragraph A notes that while the evolution of the pyramid form has been argued about for centuries, there is no question that in Egypt it began with the Step Pyramid of Djoser.',
          evidenceQuote: 'However, there is no question that, as far as Egypt is concerned, it began with one monument',
          paragraphRef: 'A',
        },
        {
          id: 'c16-r1-q15',
          questionNumber: 15,
          prompt: 'Paragraph B',
          options: HEADINGS_PASSAGE2,
          answerKey: 'vii',
          acceptedAlternatives: ['vii', 'VII'],
          explanation:
            'Paragraph B explains how prior tombs were rectangular clay brick monuments, and Imhotep conceived of building a taller tomb by stacking stone slabs on top of one another.',
          evidenceQuote: 'Imhotep, conceived of building a taller, more impressive tomb for his king by stacking stone slabs',
          paragraphRef: 'B',
        },
        {
          id: 'c16-r1-q16',
          questionNumber: 16,
          prompt: 'Paragraph C',
          options: HEADINGS_PASSAGE2,
          answerKey: 'ii',
          acceptedAlternatives: ['ii', 'II'],
          explanation:
            'Paragraph C describes the experimentation involved and notes that the weight of the enormous mass was a challenge for the builders.',
          evidenceQuote: 'The weight of the enormous mass was a challenge for the builders',
          paragraphRef: 'C',
        },
        {
          id: 'c16-r1-q17',
          questionNumber: 17,
          prompt: 'Paragraph D',
          options: HEADINGS_PASSAGE2,
          answerKey: 'v',
          acceptedAlternatives: ['v', 'V'],
          explanation:
            'Paragraph D describes the surrounding complex, including the temple, courtyards, shrines, living quarters for priests, wall, false doors, and surrounding trench.',
          evidenceQuote: 'included a temple, courtyards, shrines, and living quarters for the priests.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r1-q18',
          questionNumber: 18,
          prompt: 'Paragraph E',
          options: HEADINGS_PASSAGE2,
          answerKey: 'i',
          acceptedAlternatives: ['i', 'I'],
          explanation:
            'Paragraph E details the burial chamber, underground tunnels, and over 40,000 stone vessels discovered inside the pyramid.',
          evidenceQuote: 'One of the most mysterious discoveries found inside the pyramid was a large number of stone vessels.',
          paragraphRef: 'E',
        },
        {
          id: 'c16-r1-q19',
          questionNumber: 19,
          prompt: 'Paragraph F',
          options: HEADINGS_PASSAGE2,
          answerKey: 'viii',
          acceptedAlternatives: ['viii', 'VIII'],
          explanation:
            'Paragraph F explains that although robbers stole most grave goods leaving only a small number of valuables, there was enough left to astonish and amaze the archaeologists.',
          evidenceQuote: 'There was enough left throughout the pyramid and its complex, however, to astonish and amaze the archaeologists',
          paragraphRef: 'F',
        },
        {
          id: 'c16-r1-q20',
          questionNumber: 20,
          prompt: 'Paragraph G',
          options: HEADINGS_PASSAGE2,
          answerKey: 'vi',
          acceptedAlternatives: ['vi', 'VI'],
          explanation:
            'Paragraph G concludes that the Step Pyramid was a revolutionary advance in architecture and became the archetype which all the other great pyramid builders of Egypt would follow.',
          evidenceQuote: 'became the archetype which all the other great pyramid builders of Egypt would follow.',
          paragraphRef: 'G',
        },
      ],
    },

    // PASSAGE 2: Questions 21-24 (Note Completion)
    {
      id: 'c16-r1-g4',
      passageId: 'c16-r1-p2',
      questionType: 'note_completion',
      title: 'Questions 21–24',
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 21–24 on your answer sheet.',
      startQuestionNumber: 21,
      endQuestionNumber: 24,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `The Step Pyramid of Djoser

The complex that includes the Step Pyramid and its surroundings is considered to be as big as an Egyptian [[21]] of the past. The area outside the pyramid included accommodation that was occupied by [[22]], along with many other buildings and features.

A wall ran around the outside of the complex and a number of false entrances were built into this. In addition, a long [[23]] encircled the wall. As a result, any visitors who had not been invited were cleverly prevented from entering the pyramid grounds unless they knew the [[24]] of the real entrance.`,
      questions: [
        {
          id: 'c16-r1-q21',
          questionNumber: 21,
          prompt: 'The complex that includes the Step Pyramid and its surroundings is considered to be as big as an Egyptian [21] of the past.',
          answerKey: 'city',
          acceptedAlternatives: ['city'],
          explanation: 'Paragraph D states that the complex in which it was built was the size of a city in ancient Egypt.',
          evidenceQuote: 'The complex in which it was built was the size of a city in ancient Egypt',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r1-q22',
          questionNumber: 22,
          prompt: 'The area outside the pyramid included accommodation that was occupied by [22], along with many other buildings and features.',
          answerKey: 'priests',
          acceptedAlternatives: ['priests'],
          explanation: 'Paragraph D states that the complex included a temple, courtyards, shrines, and living quarters for the priests.',
          evidenceQuote: 'included a temple, courtyards, shrines, and living quarters for the priests.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r1-q23',
          questionNumber: 23,
          prompt: 'In addition, a long [23] encircled the wall.',
          answerKey: 'trench',
          acceptedAlternatives: ['trench'],
          explanation: 'Paragraph D notes that the entire wall was ringed by a trench 750 meters long and 40 meters wide.',
          evidenceQuote: 'the entire wall was then ringed by a trench 750 meters long and 40 meters wide.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r1-q24',
          questionNumber: 24,
          prompt: 'any visitors who had not been invited were cleverly prevented from entering the pyramid grounds unless they knew the [24] of the real entrance.',
          answerKey: 'location',
          acceptedAlternatives: ['location'],
          explanation: 'Paragraph D states that anyone wishing to enter would have needed to know in advance how to find the location of the true opening in the wall.',
          evidenceQuote: 'needed to know in advance how to find the location of the true opening in the wall.',
          paragraphRef: 'D',
        },
      ],
    },

    // PASSAGE 2: Questions 25-26 (Multiple Choice Multi-Select)
    {
      id: 'c16-r1-g5',
      passageId: 'c16-r1-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 25–26',
      instructions:
        'Choose TWO letters, A–E.\nWrite the correct letters in boxes 25 and 26 on your answer sheet.\nWhich TWO of the following points does the writer make about King Djoser?',
      startQuestionNumber: 25,
      endQuestionNumber: 26,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q25_OPTIONS,
      questions: [
        {
          id: 'c16-r1-q25',
          questionNumber: 25,
          prompt: 'Which TWO of the following points does the writer make about King Djoser?',
          options: MC_Q25_OPTIONS,
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation:
            'Paragraph B states that Djoser is thought to have reigned for 19 years, but some historians attribute a much longer time for his rule (B). Paragraph F notes that archaeologists found a small number of his valuables overlooked by the thieves (D).',
          evidenceQuote: 'Djoser is thought to have reigned for 19 years, but some historians and scholars attribute a much longer time',
          paragraphRef: 'B',
        },
        {
          id: 'c16-r1-q26',
          questionNumber: 26,
          prompt: 'Which TWO of the following points does the writer make about King Djoser?',
          options: MC_Q25_OPTIONS,
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation:
            'Paragraph B mentions disagreement over the length of his reign (B), and Paragraph F notes that a small number of his valuables were found in his tomb by archaeologists (D).',
          evidenceQuote: 'all archaeologists found were a small number of his valuables overlooked by the thieves.',
          paragraphRef: 'F',
        },
      ],
    },

    // PASSAGE 3: Questions 27-30 (Multiple Choice Single)
    {
      id: 'c16-r1-g6',
      passageId: 'c16-r1-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–30',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–30 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c16-r1-q27',
          questionNumber: 27,
          prompt: 'The first paragraph tells us about',
          options: [
            { key: 'A', text: 'the kinds of jobs that will be most affected by the growth of AI.' },
            { key: 'B', text: 'the extent to which AI will alter the nature of the work that people do.' },
            { key: 'C', text: "the proportion of the world's labour force who will have jobs in AI in the future." },
            { key: 'D', text: 'the difference between ways that embodied and disembodied AI will impact on workers.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'Paragraph 1 states that 3–14% of the global workforce will need to switch to a different occupation within 10–15 years, and all workers will need to adapt as their occupations evolve alongside capable machines (B).',
          evidenceQuote: 'all workers will need to adapt as their occupations evolve alongside increasingly capable machines.',
          paragraphRef: '1',
        },
        {
          id: 'c16-r1-q28',
          questionNumber: 28,
          prompt: "According to the second paragraph, what is Stella Pachidi's view of the 'knowledge economy'?",
          options: [
            { key: 'A', text: 'It is having an influence on the number of jobs available.' },
            { key: 'B', text: "It is changing people's attitudes towards their occupations." },
            { key: 'C', text: 'It is the main reason why the production sector is declining.' },
            { key: 'D', text: 'It is a key factor driving current developments in the workplace.' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 2 states that Dr Stella Pachidi believes some of the most fundamental changes are happening as a result of the 'algorithmication' of jobs that are dependent on data rather than on production — the so-called knowledge economy (D).",
          evidenceQuote: "some of the most fundamental changes are happening as a result of the 'algorithmication' of jobs",
          paragraphRef: '2',
        },
        {
          id: 'c16-r1-q29',
          questionNumber: 29,
          prompt: 'What did Pachidi observe at the telecommunications company?',
          options: [
            { key: 'A', text: 'staff disagreeing with the recommendations of AI' },
            { key: 'B', text: 'staff feeling resentful about the intrusion of AI in their work' },
            { key: 'C', text: 'staff making sure that AI produces the results that they want' },
            { key: 'D', text: 'staff allowing AI to carry out tasks they ought to do themselves' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'Paragraph 7 reports that Pachidi and colleagues observed people developing strategies to make the algorithm work to their own advantage by feeding the algorithm with false data to reach their targets (C).',
          evidenceQuote: 'We are seeing cases where workers feed the algorithm with false data to reach their targets',
          paragraphRef: '7',
        },
        {
          id: 'c16-r1-q30',
          questionNumber: 30,
          prompt: 'In his recently published research, Ewan McGaughey',
          options: [
            { key: 'A', text: 'challenges the idea that redundancy is a negative thing.' },
            { key: 'B', text: 'shows the profound effect of mass unemployment on society.' },
            { key: 'C', text: 'highlights some differences between past and future job losses.' },
            { key: 'D', text: 'illustrates how changes in the job market can be successfully handled.' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            'Paragraph 12 states that his recently published research looks at the causes of unemployment and notes that while change can mean redundancies, social policies can tackle this through retraining and redeployment (D).',
          evidenceQuote: 'History is clear that change can mean redundancies. But social policies can tackle this through retraining and redeployment.',
          paragraphRef: '12',
        },
      ],
    },

    // PASSAGE 3: Questions 31-34 (Summary Completion with Options)
    {
      id: 'c16-r1-g7',
      passageId: 'c16-r1-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 31–34',
      instructions:
        'Complete the summary using the list of words, A–G, below.\nWrite the correct letter, A–G, in boxes 31–34 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 34,
      optionsList: SUMMARY_Q31_OPTIONS,
      contentWithGaps: `The 'algorithmication' of jobs

Stella Pachidi of Cambridge Judge Business School has been focusing on the 'algorithmication' of jobs which rely not on production but on [[31]].

While monitoring a telecommunications company, Pachidi observed a growing [[32]] on the recommendations made by AI, as workers begin to learn through the 'algorithm's eyes'. Meanwhile, staff are deterred from experimenting and using their own [[33]], and are therefore prevented from achieving innovation.

To avoid the kind of situations which Pachidi observed, researchers are trying to make AI's decision-making process easier to comprehend, and to increase users' [[34]] with regard to the technology.`,
      questions: [
        {
          id: 'c16-r1-q31',
          questionNumber: 31,
          prompt: "Stella Pachidi of Cambridge Judge Business School has been focusing on the 'algorithmication' of jobs which rely not on production but on [31].",
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: "Paragraph 2 refers to jobs that are dependent on data rather than on production ('data' = information, G).",
          evidenceQuote: "the 'algorithmication' of jobs that are dependent on data rather than on production",
          paragraphRef: '2',
        },
        {
          id: 'c16-r1-q32',
          questionNumber: 32,
          prompt: "While monitoring a telecommunications company, Pachidi observed a growing [32] on the recommendations made by AI, as workers begin to learn through the 'algorithm's eyes'.",
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation: "Paragraph 6 explains that workers learn through the 'algorithm's eyes' and become dependent on its instructions ('dependent on' = reliance, E).",
          evidenceQuote: "workers learn through the 'algorithm's eyes' and become dependent on its instructions.",
          paragraphRef: '6',
        },
        {
          id: 'c16-r1-q33',
          questionNumber: 33,
          prompt: 'Meanwhile, staff are deterred from experimenting and using their own [33], and are therefore prevented from achieving innovation.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Paragraph 6 states that alternative explorations — where experimentation and human instinct lead to progress and new ideas — are effectively discouraged ('human instinct' = intuition, C).",
          evidenceQuote: 'Alternative explorations — where experimentation and human instinct lead to progress and new ideas — are effectively discouraged.',
          paragraphRef: '6',
        },
        {
          id: 'c16-r1-q34',
          questionNumber: 34,
          prompt: "To avoid the kind of situations which Pachidi observed, researchers are trying to make AI's decision-making process easier to comprehend, and to increase users' [34] with regard to the technology.",
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation: "Paragraph 8 states that researchers' objective is to make AI technologies more trustworthy and transparent ('trustworthy' = confidence, F).",
          evidenceQuote: 'Their objective is to make AI technologies more trustworthy and transparent',
          paragraphRef: '8',
        },
      ],
    },

    // PASSAGE 3: Questions 35-40 (Matching Features / People)
    {
      id: 'c16-r1-g8',
      passageId: 'c16-r1-p3',
      questionType: 'matching_features',
      title: 'Questions 35–40',
      instructions:
        'Look at the following statements (Questions 35–40) and the list of people below.\nMatch each statement with the correct person, A, B or C.\nWrite the correct letter, A, B or C, in boxes 35–40 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 35,
      endQuestionNumber: 40,
      optionReuseAllowed: true,
      optionsList: PEOPLE_Q35_OPTIONS,
      questions: [
        {
          id: 'c16-r1-q35',
          questionNumber: 35,
          prompt: 'Greater levels of automation will not result in lower employment.',
          options: PEOPLE_Q35_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'In Paragraph 10, Hamish Low states that if half of 100 jobs are carried out by robots in 30 years, that does not mean we are left with 50 jobs for humans; the number of jobs will increase (B).',
          evidenceQuote: 'The number of jobs will increase: we would expect there to be 150 jobs.',
          paragraphRef: '10',
        },
        {
          id: 'c16-r1-q36',
          questionNumber: 36,
          prompt: 'There are several reasons why AI is appealing to businesses.',
          options: PEOPLE_Q35_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            'In Paragraph 3, Stella Pachidi states that organisations are attracted to using algorithms because they want to make choices based on perfect information, reduce costs, and enhance productivity (A).',
          evidenceQuote: 'Organisations are attracted to using algorithms because they want to make choices based on what they consider is "perfect information", as well as to reduce costs and enhance productivity.',
          paragraphRef: '3',
        },
        {
          id: 'c16-r1-q37',
          questionNumber: 37,
          prompt: "AI's potential to transform people's lives has parallels with major cultural shifts which occurred in previous eras.",
          options: PEOPLE_Q35_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'In Paragraph 14, Ewan McGaughey compares the third revolution of new technologies to the industrial revolution and the corporate revolution (C).',
          evidenceQuote: 'Just as the industrial revolution brought people past subsistence agriculture, and the corporate revolution enabled mass production, a third revolution has been pronounced.',
          paragraphRef: '14',
        },
        {
          id: 'c16-r1-q38',
          questionNumber: 38,
          prompt: 'It is important to be aware of the range of problems that AI causes.',
          options: PEOPLE_Q35_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            'In Paragraph 8, Stella Pachidi says we need to make sure we fully understand the dilemmas that this new world raises regarding expertise, occupational boundaries and control (A).',
          evidenceQuote: 'We need to make sure we fully understand the dilemmas that this new world raises regarding expertise, occupational boundaries and control.',
          paragraphRef: '8',
        },
        {
          id: 'c16-r1-q39',
          questionNumber: 39,
          prompt: 'People are going to follow a less conventional career path than in the past.',
          options: PEOPLE_Q35_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'In Paragraph 9, Hamish Low says the traditional trajectory of full-time education followed by full-time work and retirement is a thing of the past, envisaging a multistage employment life (B).',
          evidenceQuote: 'The traditional trajectory of full-time education followed by full-time work followed by a pensioned retirement is a thing of the past',
          paragraphRef: '9',
        },
        {
          id: 'c16-r1-q40',
          questionNumber: 40,
          prompt: 'Authorities should take measures to ensure that there will be adequately paid work for everyone.',
          options: PEOPLE_Q35_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'In Paragraph 13, Ewan McGaughey calls on leaders of organisations, governments and banks to pre-empt changes with bold new policies that guarantee full employment and fair incomes (C).',
          evidenceQuote: 'bold new policies that guarantee full employment, fair incomes and a thriving economic democracy.',
          paragraphRef: '13',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 16 Academic Reading Test 1',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge16ReadingTest1(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
}> {
  const data = getCambridge16ReadingTest1Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 16 Reading Test 1 data validation failed:\n- ${errors.join('\n- ')}`
    );
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
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%16%Academic%Reading%Test 1%' LIMIT 1"
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
