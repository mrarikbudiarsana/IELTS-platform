import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

const SUMMARY_Q17_OPTIONS = [
  { key: 'A', text: 'solution' },
  { key: 'B', text: 'partnership' },
  { key: 'C', text: 'destruction' },
  { key: 'D', text: 'exaggeration' },
  { key: 'E', text: 'cleanliness' },
  { key: 'F', text: 'regulations' },
  { key: 'G', text: 'illness' },
  { key: 'H', text: 'nutrition' },
];

const SUMMARY_Q31_OPTIONS = [
  { key: 'A', text: 'opinions' },
  { key: 'B', text: 'confidence' },
  { key: 'C', text: 'view' },
  { key: 'D', text: 'modesty' },
  { key: 'E', text: 'problems' },
  { key: 'F', text: 'objectivity' },
  { key: 'G', text: 'fairness' },
  { key: 'H', text: 'experiences' },
  { key: 'I', text: 'range' },
  { key: 'J', text: 'reasons' },
];

export function getCambridge16ReadingTest2Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'c16_r2_passages.json'), 'utf8')
  );

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-8 (True / False / Not Given)
    {
      id: 'c16-r2-g1',
      passageId: 'c16-r2-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–8',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–8 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 1,
      endQuestionNumber: 8,
      questions: [
        {
          id: 'c16-r2-q1',
          questionNumber: 1,
          prompt: 'Most geoglyphs in England are located in a particular area of the country.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 1 states that the vast majority of the 56 hill figures in England are located on the chalk downlands of the southern counties.',
          evidenceQuote: "with the vast majority on the chalk downlands of the country's southern counties.",
          paragraphRef: '1',
        },
        {
          id: 'c16-r2-q2',
          questionNumber: 2,
          prompt: 'There are more geoglyphs in the shape of a horse than any other creature.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 1 lists giants, horses, crosses, and regimental badges among the figures, but does not state whether horse-shaped geoglyphs outnumber other creatures.',
          evidenceQuote: 'The figures include giants, horses, crosses and regimental badges.',
          paragraphRef: '1',
        },
        {
          id: 'c16-r2-q3',
          questionNumber: 3,
          prompt: 'A recent dating of the Uffington White Horse indicates that people were mistaken about its age.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 2 explains that the White Horse was recently re-dated and shown to be even older than its previously assigned pre-Roman Iron Age date.',
          evidenceQuote:
            'The White Horse has recently been re-dated and shown to be even older than its previously assigned ancient pre-Roman Iron Age* date.',
          paragraphRef: '2',
        },
        {
          id: 'c16-r2-q4',
          questionNumber: 4,
          prompt: 'Historians have come to an agreement about the origins of the Long Man of Wilmington.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 2 states that the date of the Long Man of Wilmington is controversial: some historians think it is prehistoric, while others think a monk created it between the 11th and 15th centuries.',
          evidenceQuote: 'More controversial is the date of the enigmatic Long Man of Wilmington in Sussex.',
          paragraphRef: '2',
        },
        {
          id: 'c16-r2-q5',
          questionNumber: 5,
          prompt: 'Geoglyphs were created by people placing white chalk on the hillside.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 3 explains that the figures were made by removing the overlying grass to reveal the natural white chalk underneath, not by placing chalk onto the hillside.',
          evidenceQuote:
            'The method of cutting these huge figures was simply to remove the overlying grass to reveal the gleaming white chalk below.',
          paragraphRef: '3',
        },
        {
          id: 'c16-r2-q6',
          questionNumber: 6,
          prompt: 'Many geoglyphs in England are no longer visible.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 3 notes that the vast majority of hill figures have disappeared because people stopped clearing away the grass.',
          evidenceQuote: 'One reason that the vast majority of hill figures have disappeared is that when the traditions associated with the figures faded',
          paragraphRef: '3',
        },
        {
          id: 'c16-r2-q7',
          questionNumber: 7,
          prompt: 'The shape of some geoglyphs has been altered over time.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 3 states that over hundreds of years the outlines sometimes changed because people did not always cut in the exact same place.',
          evidenceQuote: 'creating a different shape to the original geoglyph.',
          paragraphRef: '3',
        },
        {
          id: 'c16-r2-q8',
          questionNumber: 8,
          prompt: 'The fame of the Uffington White Horse is due to its size.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'The passage mentions that the Uffington White Horse is the most famous figure, but never attributes its fame to its size.',
          evidenceQuote: 'The most famous of these figures is perhaps also the most mysterious — the Uffington White Horse in Oxfordshire.',
          paragraphRef: '2',
        },
      ],
    },

    // PASSAGE 1: Questions 9-13 (Note Completion)
    {
      id: 'c16-r2-g2',
      passageId: 'c16-r2-p1',
      questionType: 'note_completion',
      title: 'Questions 9–13',
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 9–13 on your answer sheet.',
      startQuestionNumber: 9,
      endQuestionNumber: 13,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `The Uffington White Horse

The location of the Uffington White Horse:
• a distance of 2.5 km from Uffington village
• near an ancient road known as the [[9]]
• close to an ancient cemetery that has a number of burial mounds

Dating the Uffington White Horse:
• first reference to White Horse Hill appears in [[10]] from the 1070s
• horses shown on coins from the period 100 BCE – 1 BCE are similar in appearance
• according to analysis of the surrounding [[11]], the Horse is Late Bronze Age / Early Iron Age

Possible reasons for creation of the Uffington White Horse:
• an emblem to indicate land ownership
• formed part of an ancient ritual
• was a representation of goddess Epona – associated with protection of horses and [[12]]
• was a representation of a Welsh goddess called [[13]]`,
      questions: [
        {
          id: 'c16-r2-q9',
          questionNumber: 9,
          prompt: 'near an ancient road known as the [9]',
          answerKey: 'Ridgeway',
          acceptedAlternatives: ['Ridgeway', 'ridgeway'],
          explanation:
            'Paragraph 4 states that the horse is situated below the Ridgeway, a long-distance Neolithic track.',
          evidenceQuote: 'below the Ridgeway, a long-distance Neolithic** track.',
          paragraphRef: '4',
        },
        {
          id: 'c16-r2-q10',
          questionNumber: 10,
          prompt: 'first reference to White Horse Hill appears in [10] from the 1070s',
          answerKey: 'documents',
          acceptedAlternatives: ['documents'],
          explanation:
            "Paragraph 6 states that 'White Horse Hill' is mentioned in documents from the nearby Abbey of Abingdon from the 1070s CE.",
          evidenceQuote: "'White Horse Hill' is mentioned in documents from the nearby Abbey of Abingdon",
          paragraphRef: '6',
        },
        {
          id: 'c16-r2-q11',
          questionNumber: 11,
          prompt: 'according to analysis of the surrounding [11], the Horse is Late Bronze Age / Early Iron Age',
          answerKey: 'soil',
          acceptedAlternatives: ['soil'],
          explanation:
            'Paragraph 7 explains that Optically Stimulated Luminescence (OSL) testing was carried out on soil from two of the lower layers of the horse.',
          evidenceQuote: 'testing was carried out by the Oxford Archaeological Unit on soil from two of the lower layers',
          paragraphRef: '7',
        },
        {
          id: 'c16-r2-q12',
          questionNumber: 12,
          prompt: 'was a representation of goddess Epona – associated with protection of horses and [12]',
          answerKey: 'fertility',
          acceptedAlternatives: ['fertility'],
          explanation:
            'Paragraph 8 states that the Celtic horse goddess Epona was worshipped as a protector of horses and for her associations with fertility.',
          evidenceQuote: 'worshipped as a protector of horses, and for her associations with fertility.',
          paragraphRef: '8',
        },
        {
          id: 'c16-r2-q13',
          questionNumber: 13,
          prompt: 'was a representation of a Welsh goddess called [13]',
          answerKey: 'Rhiannon',
          acceptedAlternatives: ['Rhiannon', 'rhiannon'],
          explanation:
            'Paragraph 8 notes that the carving may represent a goddess in native mythology, such as Rhiannon in Welsh mythology.',
          evidenceQuote: 'such as Rhiannon, described in later Welsh mythology as a beautiful woman dressed in gold',
          paragraphRef: '8',
        },
      ],
    },

    // PASSAGE 2: Questions 14-16 (Multiple Choice Single)
    {
      id: 'c16-r2-g3',
      passageId: 'c16-r2-p2',
      questionType: 'multiple_choice_single',
      title: 'Questions 14–16',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 14–16 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 16,
      questions: [
        {
          id: 'c16-r2-q14',
          questionNumber: 14,
          prompt: 'What point does the writer make about microbes in the first paragraph?',
          options: [
            { key: 'A', text: 'They adapt quickly to their environment.' },
            { key: 'B', text: 'The risk they pose has been exaggerated.' },
            { key: 'C', text: 'They are more plentiful in animal life than plant life.' },
            { key: 'D', text: 'They will continue to exist for longer than the human race.' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            'Paragraph 1 states that microbes have populated this planet since long before animal life developed and they will outlive us (D).',
          evidenceQuote: 'Microbes, most of them bacteria, have populated this planet since long before animal life developed and they will outlive us.',
          paragraphRef: '1',
        },
        {
          id: 'c16-r2-q15',
          questionNumber: 15,
          prompt: 'In the second paragraph, the writer is impressed by the fact that',
          options: [
            { key: 'A', text: 'each species tends to have vastly different microbes.' },
            { key: 'B', text: 'some parts of the body contain relatively few microbes.' },
            { key: 'C', text: 'the average individual has more microbial cells than human ones.' },
            { key: 'D', text: 'scientists have limited understanding of how microbial cells behave.' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'Paragraph 2 says: "What is amazing is that while the number of human cells in the average person is about 30 trillion, the number of microbial ones is higher — about 39 trillion" (C).',
          evidenceQuote: 'while the number of human cells in the average person is about 30 trillion, the number of microbial ones is higher — about 39 trillion.',
          paragraphRef: '2',
        },
        {
          id: 'c16-r2-q16',
          questionNumber: 16,
          prompt: 'What is the writer doing in the fifth paragraph?',
          options: [
            { key: 'A', text: 'explaining how a discovery was made' },
            { key: 'B', text: "comparing scientists' theories about microbes" },
            { key: 'C', text: 'describing confusion among scientists' },
            { key: 'D', text: 'giving details of how microbes cause disease' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            'Paragraph 5 describes how Dutch lens-maker Antony van Leeuwenhoek designed microscopes in the 1670s and discovered microbes ("animalcules") in a drop of lake water (A).',
          evidenceQuote: 'Using microscopes of his own design that could magnify up to 270 times, he examined a drop of water from a nearby lake',
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 2: Questions 17-20 (Summary Completion with Options)
    {
      id: 'c16-r2-g4',
      passageId: 'c16-r2-p2',
      questionType: 'summary_completion_options',
      title: 'Questions 17–20',
      instructions:
        'Complete the summary using the list of words, A–H, below.\nWrite the correct letter, A–H, in boxes 17–20 on your answer sheet.',
      startQuestionNumber: 17,
      endQuestionNumber: 20,
      optionsList: SUMMARY_Q17_OPTIONS,
      contentWithGaps: `We should be more tolerant of microbes

Yong's book argues that we should be more tolerant of microbes. Many have a beneficial effect, and only a relatively small number lead to [[17]]. And although it is misleading to think of microbes as 'friendly', we should also stop thinking of them as the enemy. In fact, we should accept that our relationship with microbes is one based on [[18]].

New research shows that microbes have numerous benefits for humans. Amongst other things, they aid digestion, remove poisons, produce vitamins and may even help reduce obesity. However, there is a growing problem. Our poor [[19]], our overuse of antibiotics, and our excessive focus on [[20]] are upsetting the bacterial balance and may be contributing to the huge increase in allergies and immune system problems.`,
      questions: [
        {
          id: 'c16-r2-q17',
          questionNumber: 17,
          prompt: 'Many have a beneficial effect, and only a relatively small number lead to [17].',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            'Paragraph 6 points out that fewer than one hundred species of bacteria bring disease ("disease" = illness, G).',
          evidenceQuote: 'pointing out that while fewer than one hundred species of bacteria bring disease',
          paragraphRef: '6',
        },
        {
          id: 'c16-r2-q18',
          questionNumber: 18,
          prompt: 'In fact, we should accept that our relationship with microbes is one based on [18].',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'Paragraph 6 states that we should realise we have a symbiotic relationship with bacteria ("symbiotic relationship" = partnership, B).',
          evidenceQuote: 'Instead we should realise we have a symbiotic relationship',
          paragraphRef: '6',
        },
        {
          id: 'c16-r2-q19',
          questionNumber: 19,
          prompt: 'However, there is a growing problem. Our poor [19], our overuse of antibiotics...',
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            'Paragraph 7 refers to our unhealthy, low-fibre diets ("unhealthy, low-fibre diets" = poor nutrition, H).',
          evidenceQuote: 'Our obsession with hygiene, our overuse of antibiotics and our unhealthy, low-fibre diets',
          paragraphRef: '7',
        },
        {
          id: 'c16-r2-q20',
          questionNumber: 20,
          prompt: '...and our excessive focus on [20] are upsetting the bacterial balance',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            'Paragraph 7 mentions "Our obsession with hygiene" ("hygiene" = cleanliness, E).',
          evidenceQuote: 'Our obsession with hygiene, our overuse of antibiotics and our unhealthy, low-fibre diets',
          paragraphRef: '7',
        },
      ],
    },

    // PASSAGE 2: Questions 21-26 (Yes / No / Not Given)
    {
      id: 'c16-r2-g5',
      passageId: 'c16-r2-p2',
      questionType: 'yes_no_not_given',
      title: 'Questions 21–26',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 2?\nIn boxes 21–26 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 21,
      endQuestionNumber: 26,
      questions: [
        {
          id: 'c16-r2-q21',
          questionNumber: 21,
          prompt: 'It is possible that using antibacterial products in the home fails to have the desired effect.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            'Paragraph 8 states that studies indicate excessive use of household detergents and antibacterial products actually destroys the microbes that normally keep more dangerous germs at bay.',
          evidenceQuote:
            'the excessive use of household detergents and antibacterial products actually destroys the microbes that normally keep the more dangerous germs at bay.',
          paragraphRef: '8',
        },
        {
          id: 'c16-r2-q22',
          questionNumber: 22,
          prompt: 'It is a good idea to ensure that children come into contact with as few bacteria as possible.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            'Paragraph 8 explains that keeping a dog gives children early exposure to a diverse range of bacteria, which may help protect them against allergies later.',
          evidenceQuote:
            'keeping a dog as a pet gives children early exposure to a diverse range of bacteria, which may help protect them against allergies later.',
          paragraphRef: '8',
        },
        {
          id: 'c16-r2-q23',
          questionNumber: 23,
          prompt: "Yong's book contains more case studies than are necessary.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 9 mentions some of the case studies in Yong\'s book, but never claims there are too many or more than necessary.',
          evidenceQuote: 'Among the less appealing case studies is one about a fungus',
          paragraphRef: '9',
        },
        {
          id: 'c16-r2-q24',
          questionNumber: 24,
          prompt: 'The case study about bacteria that prevent squid from being attacked may have limited appeal.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            'Paragraph 9 includes the squid that carry luminescent bacteria to protect them against predators among the "less appealing case studies".',
          evidenceQuote: 'Another is about squid that carry luminescent bacteria that protect them against predators.',
          paragraphRef: '9',
        },
        {
          id: 'c16-r2-q25',
          questionNumber: 25,
          prompt: 'Efforts to control dengue fever have been surprisingly successful.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 9 states that mosquitoes are being loaded with a bacterium in an attempt to stop dengue fever, but does not say whether these efforts have been successful.',
          evidenceQuote: 'in an attempt to stop mosquitoes spreading dengue fever — a disease that infects 400 million people a year — mosquitoes are being loaded with a bacterium',
          paragraphRef: '9',
        },
        {
          id: 'c16-r2-q26',
          questionNumber: 26,
          prompt: 'Microbes that reduce the risk of infection have already been put inside the walls of some hospital wards.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            'Paragraph 9 presents microbe-coated hospital walls as a future possibility ("In the future, our ability to manipulate microbes means we could construct buildings... Just imagine a neonatal hospital ward..."), not something already done.',
          evidenceQuote: 'In the future, our ability to manipulate microbes means we could construct buildings with useful microbes built into their walls',
          paragraphRef: '9',
        },
      ],
    },

    // PASSAGE 3: Questions 27-30 (Multiple Choice Single)
    {
      id: 'c16-r2-g6',
      passageId: 'c16-r2-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–30',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–30 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c16-r2-q27',
          questionNumber: 27,
          prompt: 'What point does the writer make in the first paragraph?',
          options: [
            { key: 'A', text: 'Wisdom appears to be unique to the human race.' },
            { key: 'B', text: 'A basic assumption about wisdom may be wrong.' },
            { key: 'C', text: 'Concepts of wisdom may depend on the society we belong to.' },
            { key: 'D', text: 'There is still much to be discovered about the nature of wisdom.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'Paragraph 1 states that empirical research suggests wisdom is not an exceptional trait possessed by a small handful of philosophers after all; most of us have the ability to make wise decisions in the right context (B).',
          evidenceQuote:
            "empirical research examining wisdom suggests that it isn't an exceptional trait possessed by a small handful of bearded philosophers after all",
          paragraphRef: '1',
        },
        {
          id: 'c16-r2-q28',
          questionNumber: 28,
          prompt: 'What does Igor Grossmann suggest about the ability to make wise decisions?',
          options: [
            { key: 'A', text: 'It can vary greatly from one person to another.' },
            { key: 'B', text: 'Earlier research into it was based on unreliable data.' },
            { key: 'C', text: 'The importance of certain influences on it was underestimated.' },
            { key: 'D', text: 'Various branches of psychology define it according to their own criteria.' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'In Paragraph 2, Grossmann states that experiential, situational, and cultural factors are even more powerful in shaping wisdom than previously imagined (C).',
          evidenceQuote:
            "'It appears that experiential, situational, and cultural factors are even more powerful in shaping wisdom than previously imagined,' says Associate Professor Igor Grossmann",
          paragraphRef: '2',
        },
        {
          id: 'c16-r2-q29',
          questionNumber: 29,
          prompt: 'According to the third paragraph, Grossmann claims that the level of wisdom an individual shows',
          options: [
            { key: 'A', text: 'can be greater than they think it is.' },
            { key: 'B', text: 'will be different in different circumstances.' },
            { key: 'C', text: 'may be determined by particular aspects of their personality.' },
            { key: 'D', text: 'should develop over time as a result of their life experiences.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'Paragraph 3 states that wisdom unfolds as a function of situations people happen to be in, and some situations are more likely to promote wisdom than others (B).',
          evidenceQuote: 'wisdom is not solely an "inner quality" but rather unfolds as a function of situations people happen to be in.',
          paragraphRef: '3',
        },
        {
          id: 'c16-r2-q30',
          questionNumber: 30,
          prompt: 'What is described in the fifth paragraph?',
          options: [
            { key: 'A', text: 'a difficulty encountered when attempting to reason wisely' },
            { key: 'B', text: 'an example of the type of person who is likely to reason wisely' },
            { key: 'C', text: 'a controversial view about the benefits of reasoning wisely' },
            { key: 'D', text: 'a recommended strategy that can help people to reason wisely' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            'Paragraph 5 explains that one of the most reliable ways to support wisdom in day-to-day decisions is to look at scenarios from a third-party perspective, as though giving advice to a friend (D).',
          evidenceQuote:
            'one of the most reliable ways to support wisdom in our own day-to-day decisions is to look at scenarios from a third-party perspective',
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 3: Questions 31-35 (Summary Completion with Options)
    {
      id: 'c16-r2-g7',
      passageId: 'c16-r2-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 31–35',
      instructions:
        'Complete the summary using the list of words, A–J, below.\nWrite the correct letter, A–J, in boxes 31–35 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 35,
      optionsList: SUMMARY_Q31_OPTIONS,
      contentWithGaps: `The characteristics of wise reasoning

Igor Grossmann and colleagues have established four characteristics which enable us to make wise decisions. It is important to have a certain degree of [[31]] regarding the extent of our knowledge, and to take into account [[32]] which may not be the same as our own. We should also be able to take a broad [[33]] of any situation. Another key characteristic is being aware of the likelihood of alterations in the way that people relate to each other.

Grossmann also believes that it is better to regard scenarios with [[34]]. By avoiding the first-person perspective, we focus more on [[35]] and on other moral ideals, which in turn leads to wiser decision-making.`,
      questions: [
        {
          id: 'c16-r2-q31',
          questionNumber: 31,
          prompt: 'It is important to have a certain degree of [31] regarding the extent of our knowledge',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            'Paragraph 4 identifies the first characteristic as "intellectual humility or recognition of the limits of our own knowledge" ("humility" = modesty, D).',
          evidenceQuote: 'One is intellectual humility or recognition of the limits of our own knowledge',
          paragraphRef: '4',
        },
        {
          id: 'c16-r2-q32',
          questionNumber: 32,
          prompt: 'and to take into account [32] which may not be the same as our own.',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            'Paragraph 4 mentions "compromise or integration of different attitudes and beliefs" (and appreciating wider perspectives = opinions, A).',
          evidenceQuote: 'along with compromise or integration of different attitudes and beliefs.',
          paragraphRef: '4',
        },
        {
          id: 'c16-r2-q33',
          questionNumber: 33,
          prompt: 'We should also be able to take a broad [33] of any situation.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'Paragraph 4 lists "appreciation of perspectives wider than the issue at hand" (taking a broad view, C).',
          evidenceQuote: 'another is appreciation of perspectives wider than the issue at hand.',
          paragraphRef: '4',
        },
        {
          id: 'c16-r2-q34',
          questionNumber: 34,
          prompt: 'Grossmann also believes that it is better to regard scenarios with [34].',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            'Paragraph 5 states that it is best to look at scenarios from a third-party, "observer" viewpoint (objectivity, F).',
          evidenceQuote: 'look at scenarios from a third-party perspective, as though giving advice to a friend.',
          paragraphRef: '5',
        },
        {
          id: 'c16-r2-q35',
          questionNumber: 35,
          prompt: 'By avoiding the first-person perspective, we focus more on [35] and on other moral ideals',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            'Paragraph 5 states that from a third-person viewpoint we focus more on interpersonal and moral ideals such as justice and impartiality ("justice and impartiality" = fairness, G).',
          evidenceQuote: 'focus more on interpersonal and moral ideals such as justice and impartiality.',
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 3: Questions 36-40 (True / False / Not Given)
    {
      id: 'c16-r2-g8',
      passageId: 'c16-r2-p3',
      questionType: 'true_false_not_given',
      title: 'Questions 36–40',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 3?\nIn boxes 36–40 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 36,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c16-r2-q36',
          questionNumber: 36,
          prompt: 'Students participating in the job prospects experiment could choose one of two perspectives to take.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 7 states that the students were instructed/assigned to imagine their career from one of the two perspectives ("assigned to the \'distant observer\' role"), rather than choosing it themselves.',
          evidenceQuote: "Participants in the group assigned to the 'distant observer' role displayed more wisdom-related reasoning",
          paragraphRef: '7',
        },
        {
          id: 'c16-r2-q37',
          questionNumber: 37,
          prompt: 'Participants in the couples experiment were aware that they were taking part in a study about wise reasoning.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 8 describes what the couples were instructed to do, but does not mention whether they knew the study was specifically evaluating wise reasoning.',
          evidenceQuote: 'couples in long-term romantic relationships were instructed to visualize an unresolved relationship conflict',
          paragraphRef: '8',
        },
        {
          id: 'c16-r2-q38',
          questionNumber: 38,
          prompt: "In the couples experiments, the length of the couples' relationships had an impact on the results.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 8 notes that the participants were in long-term romantic relationships, but gives no information on whether relationship length affected the results.',
          evidenceQuote: 'In another study, couples in long-term romantic relationships were instructed to visualize',
          paragraphRef: '8',
        },
        {
          id: 'c16-r2-q39',
          questionNumber: 39,
          prompt: 'In both experiments, the participants who looked at the situation from a more detached viewpoint tended to make wiser decisions.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraphs 7 and 8 show that both the "distant observer" group in the first experiment and the "other\'s eyes" condition in the second experiment displayed significantly more wisdom-related reasoning.',
          evidenceQuote: "Couples in the 'other's eyes' condition were significantly more likely to rely on wise reasoning",
          paragraphRef: '8',
        },
        {
          id: 'c16-r2-q40',
          questionNumber: 40,
          prompt: "Grossmann believes that a person's wisdom is determined by their intelligence to only a very limited extent.",
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 10 states that research shows only a small positive relationship between wise thinking and crystallized intelligence, and Grossmann explains that contextual effects are much stronger.',
          evidenceQuote:
            'research shows only a small positive relationship between wise thinking and crystallized intelligence',
          paragraphRef: '10',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 16 Academic Reading Test 2',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge16ReadingTest2(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
}> {
  const data = getCambridge16ReadingTest2Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 16 Reading Test 2 data validation failed:\n- ${errors.join('\n- ')}`
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
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%16%Academic%Reading%Test 2%' LIMIT 1"
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
