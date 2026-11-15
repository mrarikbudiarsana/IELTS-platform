import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

const SECTION_OPTIONS_A_H = [
  { key: 'A', text: 'Section A' },
  { key: 'B', text: 'Section B' },
  { key: 'C', text: 'Section C' },
  { key: 'D', text: 'Section D' },
  { key: 'E', text: 'Section E' },
  { key: 'F', text: 'Section F' },
  { key: 'G', text: 'Section G' },
  { key: 'H', text: 'Section H' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'Artefacts found in the higher mountain passes were limited to skiing equipment.' },
  { key: 'B', text: 'Hunters went into the mountains even during periods of extreme cold.' },
  { key: 'C', text: 'The number of artefacts from certain time periods was relatively low.' },
  { key: 'D', text: 'Radiocarbon dating of artefacts produced some unreliable results.' },
  { key: 'E', text: 'More artefacts were found in Oppland than at any other mountain site.' },
];

const MC_Q25_OPTIONS = [
  { key: 'A', text: 'Hunters at this time benefited from an increased demand for goods.' },
  { key: 'B', text: 'The beginning of the period saw the greatest growth in the wealth of Vikings.' },
  { key: 'C', text: 'Vikings did not rely on ships alone to transport goods.' },
  { key: 'D', text: 'Norwegian towns at this time attracted traders from around the world.' },
  { key: 'E', text: 'Vikings were primarily interested in their trading links with the Middle East.' },
];

export function getCambridge16ReadingTest3Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, 'c16_r3_passages.json'), 'utf8')
  );

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-5 (True / False / Not Given)
    {
      id: 'c16-r3-g1',
      passageId: 'c16-r3-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–5',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–5 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 1,
      endQuestionNumber: 5,
      questions: [
        {
          id: 'c16-r3-q1',
          questionNumber: 1,
          prompt: "The Romans' shipbuilding skills were passed on to the Greeks and the Egyptians.",
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 1 states the opposite: the Romans learned to build ships from the people that they conquered, namely the Greeks and the Egyptians.',
          evidenceQuote: 'learned to build ships from the people that they conquered, namely the Greeks and the Egyptians.',
          paragraphRef: '1',
        },
        {
          id: 'c16-r3-q2',
          questionNumber: 2,
          prompt: 'Skilled craftsmen were needed for the mortise and tenon method of fixing planks.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Paragraph 2 describes the mortise and tenon method whereby one plank locked into another without stitching, but does not mention whether skilled craftsmen were required.',
          evidenceQuote: 'fixed using a method called mortise and tenon, whereby one plank locked into another without the need for stitching.',
          paragraphRef: '2',
        },
        {
          id: 'c16-r3-q3',
          questionNumber: 3,
          prompt: 'The later practice used by Mediterranean shipbuilders involved building the hull before the frame.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Paragraph 2 explains that the earlier method built the outer hull first, whereas the later method shifted to building the frame first and then proceeding with the hull.',
          evidenceQuote: 'shifted to another shipbuilding method, still in use today, which consisted of building the frame first and then proceeding with the hull',
          paragraphRef: '2',
        },
        {
          id: 'c16-r3-q4',
          questionNumber: 4,
          prompt: 'The Romans called the Mediterranean Sea Mare Nostrum because they dominated its use.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 3 states that Rome\'s navy became the largest and most powerful in the Mediterranean, and the Romans had control over what they therefore called Mare Nostrum ("our sea").',
          evidenceQuote: "the Romans had control over what they therefore called Mare Nostrum meaning 'our sea'.",
          paragraphRef: '3',
        },
        {
          id: 'c16-r3-q5',
          questionNumber: 5,
          prompt: 'Most rowers on ships were people from the Roman army.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Paragraph 4 notes that contrary to popular perception, rowers were not slaves but mostly Roman citizens enrolled in the military.',
          evidenceQuote: 'rowers were not slaves but mostly Roman citizens enrolled in the military.',
          paragraphRef: '4',
        },
      ],
    },

    // PASSAGE 1: Questions 6-13 (Summary Completion - Words)
    {
      id: 'c16-r3-g2',
      passageId: 'c16-r3-p1',
      questionType: 'summary_completion_words',
      title: 'Questions 6–13',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 6–13 on your answer sheet.',
      startQuestionNumber: 6,
      endQuestionNumber: 13,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Warships and merchant ships

Warships were designed so that they were [[6]] and moved quickly. They often remained afloat after battles and were able to sail close to land as they lacked any additional weight. A battering ram made of [[7]] was included in the design for attacking and damaging the timber and oars of enemy ships. Warships, such as the 'trireme', had rowers on three different [[8]].

Unlike warships, merchant ships had a broad [[9]] that lay far below the surface of the sea. Merchant ships were steered through the water with the help of large rudders and a tiller bar. They had both square and [[10]] sails. On merchant ships and warships, [[11]] was used to ensure rowers moved their oars in and out of the water at the same time.

Quantities of agricultural goods such as [[12]] were transported by merchant ships to two main ports in Italy. The ships were pulled to the shore by [[13]]. When the weather was clear and they could see islands or land, sailors used landmarks that they knew to help them navigate their route.`,
      questions: [
        {
          id: 'c16-r3-q6',
          questionNumber: 6,
          prompt: 'Warships were designed so that they were [6] and moved quickly.',
          answerKey: 'lightweight',
          acceptedAlternatives: ['lightweight'],
          explanation: 'Paragraph 3 states that warships were built to be lightweight and very speedy.',
          evidenceQuote: 'Warships were built to be lightweight and very speedy.',
          paragraphRef: '3',
        },
        {
          id: 'c16-r3-q7',
          questionNumber: 7,
          prompt: 'A battering ram made of [7] was included in the design for attacking and damaging the timber and oars of enemy ships.',
          answerKey: 'bronze',
          acceptedAlternatives: ['bronze'],
          explanation: 'Paragraph 3 states that warships had a bronze battering ram used to pierce timber hulls or break the oars of enemy vessels.',
          evidenceQuote: 'They had a bronze battering ram, which was used to pierce the timber hulls or break the oars of enemy vessels.',
          paragraphRef: '3',
        },
        {
          id: 'c16-r3-q8',
          questionNumber: 8,
          prompt: "Warships, such as the 'trireme', had rowers on three different [8].",
          answerKey: 'levels',
          acceptedAlternatives: ['levels'],
          explanation: 'Paragraph 4 states that the trireme had rowers in the top, middle and lower levels.',
          evidenceQuote: 'It had rowers in the top, middle and lower levels',
          paragraphRef: '4',
        },
        {
          id: 'c16-r3-q9',
          questionNumber: 9,
          prompt: 'Unlike warships, merchant ships had a broad [9] that lay far below the surface of the sea.',
          answerKey: 'hull',
          acceptedAlternatives: ['hull'],
          explanation: 'Paragraph 5 states that merchant ships had a wider hull, and their V-shaped hull was deep underwater.',
          evidenceQuote: 'They had a wider hull, double planking and a solid interior for added stability. Unlike warships, their V-shaped hull was deep underwater',
          paragraphRef: '5',
        },
        {
          id: 'c16-r3-q10',
          questionNumber: 10,
          prompt: 'They had both square and [10] sails.',
          answerKey: 'triangular',
          acceptedAlternatives: ['triangular'],
          explanation: 'Paragraph 5 notes that merchant ships had from one to three masts with large square sails and a small triangular sail at the bow.',
          evidenceQuote: 'They had from one to three masts with large square sails and a small triangular sail at the bow.',
          paragraphRef: '5',
        },
        {
          id: 'c16-r3-q11',
          questionNumber: 11,
          prompt: 'On merchant ships and warships, [11] was used to ensure rowers moved their oars in and out of the water at the same time.',
          answerKey: 'music',
          acceptedAlternatives: ['music'],
          explanation: 'Paragraph 5 explains that to coordinate the hundreds of rowers in both types of ship, music would be played on an instrument and oars would keep time with it.',
          evidenceQuote: 'In order to assist them, music would be played on an instrument, and oars would then keep time with this.',
          paragraphRef: '5',
        },
        {
          id: 'c16-r3-q12',
          questionNumber: 12,
          prompt: 'Quantities of agricultural goods such as [12] were transported by merchant ships to two main ports in Italy.',
          answerKey: 'grain',
          acceptedAlternatives: ['grain'],
          explanation: 'Paragraph 6 states that the cargo on merchant ships included agricultural products such as grain from Egypt\'s Nile valley.',
          evidenceQuote: "and agricultural products (e.g. grain from Egypt's Nile valley).",
          paragraphRef: '6',
        },
        {
          id: 'c16-r3-q13',
          questionNumber: 13,
          prompt: 'The ships were pulled to the shore by [13].',
          answerKey: 'towboats',
          acceptedAlternatives: ['towboats'],
          explanation: 'Paragraph 6 states that large merchant ships approaching the destination port were intercepted by a number of towboats that dragged them to the quay.',
          evidenceQuote: 'be intercepted by a number of towboats that would drag them to the quay.',
          paragraphRef: '6',
        },
      ],
    },

    // PASSAGE 2: Questions 14-19 (Matching Information)
    {
      id: 'c16-r3-g3',
      passageId: 'c16-r3-p2',
      questionType: 'matching_information',
      title: 'Questions 14–19',
      instructions:
        'Reading Passage 2 has eight sections, A–H.\nWhich section contains the following information?\nWrite the correct letter, A–H, in boxes 14–19 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 19,
      optionsList: SECTION_OPTIONS_A_H,
      questions: [
        {
          id: 'c16-r3-q14',
          questionNumber: 14,
          prompt: 'an explanation for weapons being left behind in the mountains',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            'Section D explains that hunters would have easily misplaced arrows and often discarded broken bows rather than take them all the way home.',
          evidenceQuote: 'Hunters would have easily misplaced arrows and they often discarded broken bows rather than take them all the way home.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r3-q15',
          questionNumber: 15,
          prompt: 'a reference to the physical difficulties involved in an archaeological expedition',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'Section C quotes Barrett saying that fieldwork is hard work, involving hiking with all their equipment and often camping on permafrost.',
          evidenceQuote: 'Fieldwork is hard work — hiking with all our equipment, often camping on permafrost',
          paragraphRef: 'C',
        },
        {
          id: 'c16-r3-q16',
          questionNumber: 16,
          prompt: 'an explanation of why less food may have been available',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            'Section F explains that a colder turn in the Scandinavian climate would likely have meant widespread crop failures and failing agricultural harvests.',
          evidenceQuote: 'A colder turn in the Scandinavian climate would likely have meant widespread crop failures',
          paragraphRef: 'F',
        },
        {
          id: 'c16-r3-q17',
          questionNumber: 17,
          prompt: 'a reference to the possibility of future archaeological discoveries',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            'Section H states that archaeologists could be extracting some of those artefacts from retreating ice in years to come.',
          evidenceQuote: 'That means archaeologists could be extracting some of those artefacts from retreating ice in years to come.',
          paragraphRef: 'H',
        },
        {
          id: 'c16-r3-q18',
          questionNumber: 18,
          prompt: 'examples of items that would have been traded',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            'Section G mentions a booming demand in growing Norwegian towns and export markets for hides to fight off the cold, as well as antlers to make useful things like combs.',
          evidenceQuote: 'a booming demand for hides to fight off the cold, as well as antlers to make useful things like combs.',
          paragraphRef: 'G',
        },
        {
          id: 'c16-r3-q19',
          questionNumber: 19,
          prompt: 'a reference to the pressure archaeologists are under to work quickly',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'Section B states that glacial archaeologists need to "race the clock" to find newly revealed artefacts before fragile items dry and are windblown.',
          evidenceQuote: 'glacial archaeologists need to race the clock to find newly revealed artefacts, preserve them, and study them.',
          paragraphRef: 'B',
        },
      ],
    },

    // PASSAGE 2: Questions 20-22 (Summary Completion - Words)
    {
      id: 'c16-r3-g4',
      passageId: 'c16-r3-p2',
      questionType: 'summary_completion_words',
      title: 'Questions 20–22',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 20–22 on your answer sheet.',
      startQuestionNumber: 20,
      endQuestionNumber: 22,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Interesting finds at an archaeological site

Organic materials such as animal skins and textiles are not discovered very often at archaeological sites. They have little protection against [[20]], which means that they decay relatively quickly. But this is not always the case. If temperatures are low enough, fragile artefacts can be preserved for thousands of years.

A team of archaeologists have been working in the mountains in Oppland in Norway to recover artefacts revealed by shrinking ice cover. In the past, there were trade routes through these mountains and [[21]] gathered there in the summer months to avoid being attacked by [[22]] on lower ground. The people who used these mountains left things behind and it is those objects that are of interest to archaeologists.`,
      questions: [
        {
          id: 'c16-r3-q20',
          questionNumber: 20,
          prompt: 'They have little protection against [20], which means that they decay relatively quickly.',
          answerKey: 'microorganisms',
          acceptedAlternatives: ['microorganisms', 'micro-organisms'],
          explanation: 'Section B states that unless organic materials are protected from the microorganisms that cause decay, they tend not to last long.',
          evidenceQuote: "unless they're protected from the microorganisms that cause decay, they tend not to last long.",
          paragraphRef: 'B',
        },
        {
          id: 'c16-r3-q21',
          questionNumber: 21,
          prompt: 'In the past, there were trade routes through these mountains and [21] gathered there in the summer months',
          answerKey: 'reindeer',
          acceptedAlternatives: ['reindeer'],
          explanation: 'Section C states that reindeer once congregated on these icy patches in the later summer months.',
          evidenceQuote: 'Reindeer once congregated on these icy patches in the later summer months to escape biting insects',
          paragraphRef: 'C',
        },
        {
          id: 'c16-r3-q22',
          questionNumber: 22,
          prompt: 'to avoid being attacked by [22] on lower ground.',
          answerKey: 'insects',
          acceptedAlternatives: ['insects'],
          explanation: 'Section C explains that reindeer congregated on the icy patches in the later summer months to escape biting insects.',
          evidenceQuote: 'Reindeer once congregated on these icy patches in the later summer months to escape biting insects',
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 2: Questions 23-24 (Multiple Choice Multi-Select)
    {
      id: 'c16-r3-g5',
      passageId: 'c16-r3-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions:
        "Choose TWO letters, A–E.\nWrite the correct letters in boxes 23 and 24 on your answer sheet.\nWhich TWO of the following statements does the writer make about the discoveries of Barrett's team?",
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q23_OPTIONS,
      questions: [
        {
          id: 'c16-r3-q23',
          questionNumber: 23,
          prompt: "Which TWO of the following statements does the writer make about the discoveries of Barrett's team? (First choice)",
          options: MC_Q23_OPTIONS,
          answerKey: ['B', 'C'],
          acceptedAlternatives: ['B', 'C'],
          explanation:
            'Section F states that hunters kept regularly venturing into the mountains even when the climate turned cold (B), and Section E notes that there were few or no signs of activity during certain periods (C).',
          evidenceQuote: 'hunters kept regularly venturing into the mountains even when the climate turned cold',
          paragraphRef: 'F',
        },
        {
          id: 'c16-r3-q24',
          questionNumber: 24,
          prompt: "Which TWO of the following statements does the writer make about the discoveries of Barrett's team? (Second choice)",
          options: MC_Q23_OPTIONS,
          answerKey: ['B', 'C'],
          acceptedAlternatives: ['B', 'C'],
          explanation:
            'Section E states that while some periods produced lots of artefacts, there were few or no signs of activity during other periods (C), and Section F confirms hunters went into the mountains during extreme cold (B).',
          evidenceQuote: 'But there were few or no signs of activity during other periods.',
          paragraphRef: 'E',
        },
      ],
    },

    // PASSAGE 2: Questions 25-26 (Multiple Choice Multi-Select)
    {
      id: 'c16-r3-g6',
      passageId: 'c16-r3-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 25 and 26',
      instructions:
        'Choose TWO letters, A–E.\nWrite the correct letters in boxes 25 and 26 on your answer sheet.\nWhich TWO of the following statements does the writer make about the Viking Age?',
      startQuestionNumber: 25,
      endQuestionNumber: 26,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q25_OPTIONS,
      questions: [
        {
          id: 'c16-r3-q25',
          questionNumber: 25,
          prompt: 'Which TWO of the following statements does the writer make about the Viking Age? (First choice)',
          options: MC_Q25_OPTIONS,
          answerKey: ['A', 'C'],
          acceptedAlternatives: ['A', 'C'],
          explanation:
            'Section G states that growing Norwegian towns and export markets created a booming demand for hides and antlers, so business must have been good for hunters (A), and that plenty of goods travelled on overland routes rather than ships alone (C).',
          evidenceQuote: 'these recent discoveries show that plenty of goods travelled on overland routes, like the mountain passes of Oppland.',
          paragraphRef: 'G',
        },
        {
          id: 'c16-r3-q26',
          questionNumber: 26,
          prompt: 'Which TWO of the following statements does the writer make about the Viking Age? (Second choice)',
          options: MC_Q25_OPTIONS,
          answerKey: ['A', 'C'],
          acceptedAlternatives: ['A', 'C'],
          explanation:
            'Section G highlights overland trade routes in addition to ships (C) and booming demand for hunters\' goods (A).',
          evidenceQuote: 'would have created a booming demand for hides to fight off the cold, as well as antlers to make useful things like combs. Business must have been good for hunters.',
          paragraphRef: 'G',
        },
      ],
    },

    // PASSAGE 3: Questions 27-32 (True / False / Not Given)
    {
      id: 'c16-r3-g7',
      passageId: 'c16-r3-p3',
      questionType: 'true_false_not_given',
      title: 'Questions 27–32',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 3?\nIn boxes 27–32 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 27,
      endQuestionNumber: 32,
      questions: [
        {
          id: 'c16-r3-q27',
          questionNumber: 27,
          prompt: "The Cambridge scientists' discovery of the 'thermometer molecule' caused surprise among other scientists.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Section A describes the discovery by the Cambridge-led team, but does not mention whether other scientists were surprised by it.',
          evidenceQuote: "An international team of scientists led by the University of Cambridge has discovered that the 'thermometer' molecule in plants enables them to develop",
          paragraphRef: 'A',
        },
        {
          id: 'c16-r3-q28',
          questionNumber: 28,
          prompt: 'The target for agricultural production by 2050 could be missed.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Section D states that agricultural yields will need to double by 2050, but climate change is a major threat to achieving this.',
          evidenceQuote: 'It is estimated that agricultural yields will need to double by 2050, but climate change is a major threat to achieving this.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r3-q29',
          questionNumber: 29,
          prompt: 'Wheat and rice suffer from a rise in temperatures.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            'Section D states that key crops such as wheat and rice are sensitive to high temperatures, and thermal stress reduces crop yields by around 10% for every one degree increase in temperature.',
          evidenceQuote: 'Key crops such as wheat and rice are sensitive to high temperatures.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r3-q30',
          questionNumber: 30,
          prompt: 'It may be possible to develop crops that require less water.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            'Section D mentions breeding crops resilient to thermal stress and climate change, but makes no mention of developing crops that require less water.',
          evidenceQuote: 'accelerate the breeding of crops resilient to thermal stress and climate change.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r3-q31',
          questionNumber: 31,
          prompt: 'Plants grow faster in sunlight than in shade.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Section E states the opposite: during the day, sunlight activates phytochrome molecules, slowing down growth, whereas in shade they are quickly inactivated, enabling the plant to grow faster to find sunlight.',
          evidenceQuote: 'During the day, sunlight activates the molecules, slowing down growth. If a plant finds itself in shade, phytochromes are quickly inactivated — enabling it to grow faster',
          paragraphRef: 'E',
        },
        {
          id: 'c16-r3-q32',
          questionNumber: 32,
          prompt: 'Phytochromes change their state at the same speed day and night.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            'Section E explains that light-driven changes during the day occur very fast (in less than a second), whereas at night the molecules gradually change from active to inactive state.',
          evidenceQuote: 'At night, however, it\'s a different story. Instead of a rapid deactivation following sundown, the molecules gradually change from their active to inactive state.',
          paragraphRef: 'E',
        },
      ],
    },

    // PASSAGE 3: Questions 33-37 (Matching Information)
    {
      id: 'c16-r3-g8',
      passageId: 'c16-r3-p3',
      questionType: 'matching_information',
      title: 'Questions 33–37',
      instructions:
        'Reading Passage 3 has eight sections, A–H.\nWhich section contains the following information?\nWrite the correct letter, A–H, in boxes 33–37 on your answer sheet.',
      startQuestionNumber: 33,
      endQuestionNumber: 37,
      optionsList: SECTION_OPTIONS_A_H,
      questions: [
        {
          id: 'c16-r3-q33',
          questionNumber: 33,
          prompt: 'mention of specialists who can make use of the research findings',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            'Section H mentions outstanding collaborators nearby who work on more applied aspects of plant biology and can help transfer this new knowledge into the field.',
          evidenceQuote: 'we have outstanding collaborators nearby who work on more applied aspects of plant biology, and can help us transfer this new knowledge into the field.',
          paragraphRef: 'H',
        },
        {
          id: 'c16-r3-q34',
          questionNumber: 34,
          prompt: 'a reference to a potential benefit of the research findings',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            'Section D states that the discovery could help breed tougher crops resilient to thermal stress and climate change.',
          evidenceQuote: 'researchers say the discovery that this light-sensing molecule also functions as the internal thermometer in plant cells could help us breed tougher crops.',
          paragraphRef: 'D',
        },
        {
          id: 'c16-r3-q35',
          questionNumber: 35,
          prompt: 'scientific support for a traditional saying',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            'Section G states that the discovery of the dual role of phytochromes provides the science behind a well-known rhyme ("oak before ash we\'ll have a splash...").',
          evidenceQuote: 'the discovery of the dual role of phytochromes provides the science behind a well-known rhyme long used to predict the coming season',
          paragraphRef: 'G',
        },
        {
          id: 'c16-r3-q36',
          questionNumber: 36,
          prompt: 'a reference to people traditionally making plans based on plant behaviour',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            'Section C notes that farmers and gardeners have known for hundreds of years how responsive plants are to temperature and have long used early budding to predict weather and harvest times.',
          evidenceQuote: 'something humans have long used to predict weather and harvest times for the coming year.',
          paragraphRef: 'C',
        },
        {
          id: 'c16-r3-q37',
          questionNumber: 37,
          prompt: 'a reference to where the research has been reported',
          options: SECTION_OPTIONS_A_H,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            'Section A mentions that the new findings were published in the journal Science.',
          evidenceQuote: 'The new findings, published in the journal Science, show that phytochromes control genetic switches',
          paragraphRef: 'A',
        },
      ],
    },

    // PASSAGE 3: Questions 38-40 (Sentence Completion)
    {
      id: 'c16-r3-g9',
      passageId: 'c16-r3-p3',
      questionType: 'sentence_completion',
      title: 'Questions 38–40',
      instructions:
        'Complete the sentences below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 38–40 on your answer sheet.',
      startQuestionNumber: 38,
      endQuestionNumber: 40,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      maxNumbers: 0,
      questions: [
        {
          id: 'c16-r3-q38',
          questionNumber: 38,
          prompt: 'Daffodils are likely to flower early in response to [[38]] weather.',
          answerKey: 'warm',
          acceptedAlternatives: ['warm', 'warm winter'],
          explanation:
            'Section G states that daffodils have considerable temperature sensitivity and can flower months in advance during a warm winter.',
          evidenceQuote: 'Other species, such as daffodils, have considerable temperature sensitivity, and can flower months in advance during a warm winter.',
          paragraphRef: 'G',
        },
        {
          id: 'c16-r3-q39',
          questionNumber: 39,
          prompt: 'If ash trees come into leaf before oak trees, the weather in [[39]] will probably be wet.',
          answerKey: 'summer',
          acceptedAlternatives: ['summer'],
          explanation:
            'Section G explains that a cold spring results in ash leafing before oak, and a colder summer is likely to be a rain-soaked one.',
          evidenceQuote: 'As the British know only too well, a colder summer is likely to be a rain-soaked one.',
          paragraphRef: 'G',
        },
        {
          id: 'c16-r3-q40',
          questionNumber: 40,
          prompt: 'The research was carried out using a particular species of [[40]].',
          answerKey: 'mustard plant',
          acceptedAlternatives: ['mustard plant', 'mustard plants', 'mustard'],
          explanation:
            'Section H states that the work was done in a model system, using a mustard plant called Arabidopsis.',
          evidenceQuote: 'The work was done in a model system, using a mustard plant called Arabidopsis',
          paragraphRef: 'H',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 16 Academic Reading Test 3',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge16ReadingTest3(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
}> {
  const data = getCambridge16ReadingTest3Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 16 Reading Test 3 data validation failed:\n- ${errors.join('\n- ')}`
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
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%16%Academic%Reading%Test 3%' LIMIT 1"
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
