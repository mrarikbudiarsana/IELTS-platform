import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge18ReadingTest2Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c18-r2-p1',
      passageNumber: 1,
      title: 'Stonehenge',
      subtitle:
        'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c18-r2-p1-1',
          label: '1',
          content: `For centuries, historians and archaeologists have puzzled over the many mysteries of Stonehenge, a prehistoric monument that took an estimated 1,500 years to erect. Located on Salisbury Plain in southern England, it is comprised of roughly 100 massive upright stones placed in a circular layout.`,
        },
        {
          id: 'c18-r2-p1-2',
          label: '2',
          content: `Archaeologists believe England's most iconic prehistoric ruin was built in several stages, with the earliest constructed 5,000 or more years ago. First, Neolithic* Britons used primitive tools, which may have been fashioned out of deer antlers, to dig a massive circular ditch and bank, or henge. Deep pits dating back to that era and located within the circle may have once held a ring of timber posts, according to some scholars.`,
        },
        {
          id: 'c18-r2-p1-3',
          label: '3',
          content: `Several hundred years later, it is thought, Stonehenge's builders hoisted an estimated 80 bluestones, 43 of which remain today, into standing positions and placed them in either a horseshoe or circular formation. These stones have been traced all the way to the Preseli Hills in Wales, some 300 kilometres from Stonehenge. How, then, did prehistoric builders without sophisticated tools or engineering haul these boulders, which weigh up to four tons, over such a great distance?`,
        },
        {
          id: 'c18-r2-p1-4',
          label: '4',
          content: `According to one long-standing theory among archaeologists, Stonehenge's builders fashioned sledges and rollers out of tree trunks to lug the bluestones from the Preseli Hills. They then transferred the boulders onto rafts and floated them first along the Welsh coast and then up the River Avon toward Salisbury Plain; alternatively, they may have towed each stone with a fleet of vessels. More recent archaeological hypotheses have them transporting the bluestones with supersized wicker baskets on a combination of ball bearings and long grooved planks, hauled by oxen.`,
        },
        {
          id: 'c18-r2-p1-5',
          label: '5',
          content: `As early as the 1970s, geologists have been adding their voices to the debate over how Stonehenge came into being. Challenging the classic image of industrious builders pushing, carting, rolling or hauling giant stones from faraway Wales, some scientists have suggested that it was glaciers, not humans, that carried the bluestones to Salisbury Plain. Most archaeologists have remained sceptical about this theory, however, wondering how the forces of nature could possibly have delivered the exact number of stones needed to complete the circle.\n\n* Neolithic - The era, also known as the New Stone Age, which began around 12,000 years ago and ended around 3500 BCE`,
        },
        {
          id: 'c18-r2-p1-6',
          label: '6',
          content: `The third phase of construction took place around 2000 BCE. At this point, sandstone slabs - known as 'sarsens' - were arranged into an outer crescent or ring; some were assembled into the iconic three-pieced structures called trilithons that stand tall in the centre of Stonehenge. Some 50 of these stones are now visible on the site, which may once have contained many more. Radiocarbon dating has revealed that work continued at Stonehenge until roughly 1600 BCE, with the bluestones in particular being repositioned multiple times.`,
        },
        {
          id: 'c18-r2-p1-7',
          label: '7',
          content: `But who were the builders of Stonehenge? In the 17th century, archaeologist John Aubrey made the claim that Stonehenge was the work of druids, who had important religious, judicial and political roles in Celtic** society. This theory was widely popularized by the antiquarian William Stukeley, who had unearthed primitive graves at the site. Even today, people who identify as modern druids continue to gather at Stonehenge for the summer solstice. However, in the mid-20th century, radiocarbon dating demonstrated that Stonehenge stood more than 1,000 years before the Celts inhabited the region.`,
        },
        {
          id: 'c18-r2-p1-8',
          label: '8',
          content: `Many modern historians and archaeologists now agree that several distinct tribes of people contributed to Stonehenge, each undertaking a different phase of its construction. Bones, tools and other artefacts found on the site seem to support this hypothesis. The first stage was achieved by Neolithic agrarians who were likely to have been indigenous to the British Isles. Later, it is believed, groups with advanced tools and a more communal way of life left their mark on the site. Some believe that they were immigrants from the European continent, while others maintain that they were probably native Britons, descended from the original builders.`,
        },
        {
          id: 'c18-r2-p1-9',
          label: '9',
          content: `If the facts surrounding the architects and construction of Stonehenge remain shadowy at best, the purpose of the striking monument is even more of a mystery. While there is consensus among the majority of modern scholars that Stonehenge once served the function of burial ground, they have yet to determine what other purposes it had.`,
        },
        {
          id: 'c18-r2-p1-10',
          label: '10',
          content: `In the 1960s, the astronomer Gerald Hawkins suggested that the cluster of megalithic stones operated as a form of calendar, with different points corresponding to astrological phenomena such as solstices, equinoxes and eclipses occurring at different times of the year. While his theory has received a considerable amount of attention over the decades, critics maintain that Stonehenge's builders probably lacked the knowledge necessary to predict such events or that England's dense cloud cover would have obscured their view of the skies.`,
        },
        {
          id: 'c18-r2-p1-11',
          label: '11',
          content: `More recently, signs of illness and injury in the human remains unearthed at Stonehenge led a group of British archaeologists to speculate that it was considered a place of healing, perhaps because bluestones were thought to have curative powers.\n\n** Celtic - The Celts were people who lived in Britain and northwest Europe during the Iron Age from 600 BCE to 43 CE`,
        },
      ],
    },
    {
      id: 'c18-r2-p2',
      passageNumber: 2,
      title: 'Living with artificial intelligence',
      subtitle:
        'Powerful artificial intelligence (AI) needs to be reliably aligned with human values, but does this mean AI will eventually have to police those values?\n\nYou should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c18-r2-p2-1',
          label: '1',
          content: `This has been the decade of AI, with one astonishing feat after another. A chess-playing AI that can defeat not only all human chess players, but also all previous human-programmed chess machines, after learning the game in just four hours? That's yesterday's news, what's next? True, these prodigious accomplishments are all in so-called narrow AI, where machines perform highly specialised tasks. But many experts believe this restriction is very temporary. By mid-century, we may have artificial general intelligence (AGI) - machines that can achieve human-level performance on the full range of tasks that we ourselves can tackle.`,
        },
        {
          id: 'c18-r2-p2-2',
          label: '2',
          content: `If so, there's little reason to think it will stop there. Machines will be free of many of the physical constraints on human intelligence. Our brains run at slow biochemical processing speeds on the power of a light bulb, and their size is restricted by the dimensions of the human birth canal. It is remarkable what they accomplish, given these handicaps. But they may be as far from the physical limits of thought as our eyes are from the incredibly powerful Webb Space Telescope.`,
        },
        {
          id: 'c18-r2-p2-3',
          label: '3',
          content: `Once machines are better than us at designing even smarter machines, progress towards these limits could accelerate. What would this mean for us? Could we ensure a safe and worthwhile coexistence with such machines? On the plus side, AI is already useful and profitable for many things, and super AI might be expected to be super useful, and super profitable. But the more powerful AI becomes, the more important it will be to specify its goals with great care. Folklore is full of tales of people who ask for the wrong thing, with disastrous consequences - King Midas, for example, might have wished that everything he touched turned to gold, but didn't really intend this to apply to his breakfast.`,
        },
        {
          id: 'c18-r2-p2-4',
          label: '4',
          content: `So we need to create powerful AI machines that are 'human-friendly' - that have goals reliably aligned with our own values. One thing that makes this task difficult is that we are far from reliably human-friendly ourselves. We do many terrible things to each other and to many other creatures with whom we share the planet. If superintelligent machines don't do a lot better than us, we'll be in deep trouble. We'll have powerful new intelligence amplifying the dark sides of our own fallible natures.`,
        },
        {
          id: 'c18-r2-p2-5',
          label: '5',
          content: `For safety's sake, then, we want the machines to be ethically as well as cognitively superhuman. We want them to aim for the moral high ground, not for the troughs in which many of us spend some of our time. Luckily they'll be smart enough for the job. If there are routes to the moral high ground, they'll be better than us at finding them, and steering us in the right direction.`,
        },
        {
          id: 'c18-r2-p2-6',
          label: '6',
          content: `However, there are two big problems with this utopian vision. One is how we get the machines started on the journey, the other is what it would mean to reach this destination. The 'getting started' problem is that we need to tell the machines what they're looking for with sufficient clarity that we can be confident they will find it - whatever 'it' actually turns out to be. This won't be easy, given that we are tribal creatures and conflicted about the ideals ourselves. We often ignore the suffering of strangers, and even contribute to it, at least indirectly. How then, do we point machines in the direction of something better?`,
        },
        {
          id: 'c18-r2-p2-7',
          label: '7',
          content: `As for the 'destination' problem, we might, by putting ourselves in the hands of these moral guides and gatekeepers, be sacrificing our own autonomy - an important part of what makes us human. Machines who are better than us at sticking to the moral high ground may be expected to discourage some of the lapses we presently take for granted. We might lose our freedom to discriminate in favour of our own communities, for example.`,
        },
        {
          id: 'c18-r2-p2-8',
          label: '8',
          content: `Loss of freedom to behave badly isn't always a bad thing, of course: denying ourselves the freedom to put children to work in factories, or to smoke in restaurants are signs of progress. But are we ready for ethical silicon police limiting our options? They might be so good at doing it that we won't notice them; but few of us are likely to welcome such a future.`,
        },
        {
          id: 'c18-r2-p2-9',
          label: '9',
          content: `These issues might seem far-fetched, but they are to some extent already here. AI already has some input into how resources are used in our National Health Service (NHS) here in the UK, for example. If it was given a greater role, it might do so much more efficiently than humans can manage, and act in the interests of taxpayers and those who use the health system. However, we'd be depriving some humans (e.g. senior doctors) of the control they presently enjoy. Since we'd want to ensure that people are treated equally and that policies are fair, the goals of AI would need to be specified correctly.`,
        },
        {
          id: 'c18-r2-p2-10',
          label: '10',
          content: `We have a new powerful technology to deal with - itself, literally, a new way of thinking. For our own safety, we need to point these new thinkers in the right direction, and get them to act well for us. It is not yet clear whether this is possible, but if it is, it will require a cooperative spirit, and a willingness to set aside self-interest.`,
        },
        {
          id: 'c18-r2-p2-11',
          label: '11',
          content: `Both general intelligence and moral reasoning are often thought to be uniquely human capacities. But safety seems to require that we think of them as a package: if we are to give general intelligence to machines, we'll need to give them moral authority, too. And where exactly would that leave human beings? All the more reason to think about the destination now, and to be careful about what we wish for.`,
        },
      ],
    },
    {
      id: 'c18-r2-p3',
      passageNumber: 3,
      title: 'An ideal city',
      subtitle:
        "Leonardo da Vinci's ideal city was centuries ahead of its time\n\nYou should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.",
      paragraphs: [
        {
          id: 'c18-r2-p3-1',
          label: '1',
          content: `The word 'genius' is universally associated with the name of Leonardo da Vinci. A true Renaissance man, he embodied scientific spirit, artistic talent and humanist sensibilities. Five hundred years have passed since Leonardo died in his home at Château du Clos Lucé, outside Tours, France. Yet far from fading into insignificance, his thinking has carried down the centuries and still surprises today.`,
        },
        {
          id: 'c18-r2-p3-2',
          label: '2',
          content: `The Renaissance marked the transition from the 15th century to modernity and took place after the spread of the plague in the 14th century, which caused a global crisis resulting in some 200 million deaths across Europe and Asia. Today, the world is on the cusp of a climate crisis, which is predicted to cause widespread displacement, extinctions and death, if left unaddressed. Then, as now, radical solutions were called for to revolutionise the way people lived and safeguard humanity against catastrophe.`,
        },
        {
          id: 'c18-r2-p3-3',
          label: '3',
          content: `Around 1486 – after a pestilence that killed half the population in Milan, Italy - Leonardo turned his thoughts to urban planning problems. Following a typical Renaissance trend, he began to work on an 'ideal city' project, which – due to its excessive costs - would remain unfulfilled. Yet given that unsustainable urban models are a key cause of global climate change today, it's only natural to wonder how Leonardo might have changed the shape of modern cities.`,
        },
        {
          id: 'c18-r2-p3-4',
          label: '4',
          content: `Although the Renaissance is renowned as an era of incredible progress in art and architecture, it is rarely noted that the 15th century also marked the birth of urbanism as a true academic discipline. The rigour and method behind the conscious conception of a city had been largely missing in Western thought until the moment when prominent Renaissance men pushed forward large-scale urban projects in Italy, such as the reconfiguration of the town of Pienza and the expansion of the city of Ferrara. These works surely inspired Leonardo's decision to rethink the design of medieval cities, with their winding and overcrowded streets and with houses piled against one another.`,
        },
        {
          id: 'c18-r2-p3-5',
          label: '5',
          content: `It is not easy to identify a coordinated vision of Leonardo's ideal city because of his disordered way of working with notes and sketches. But from the largest collection of Leonardo's papers ever assembled, a series of innovative thoughts can be reconstructed regarding the foundation of a new city along the Ticino River, which runs from Switzerland into Italy and is 248 kilometres long. He designed the city for the easy transport of goods and clean urban spaces, and he wanted a comfortable and spacious city, with well-ordered streets and architecture. He recommended 'high, strong walls', with 'towers and battlements of all necessary and pleasant beauty'.`,
        },
        {
          id: 'c18-r2-p3-6',
          label: '6',
          content: `His plans for a modern and 'rational' city were consistent with Renaissance ideals. But, in keeping with his personality, Leonardo included several innovations in his urban design. Leonardo wanted the city to be built on several levels, linked with vertical outdoor staircases. This design can be seen in some of today's high-rise buildings but was unconventional at the time. Indeed, this idea of taking full advantage of the interior spaces wasn't implemented until the 1920s and 1930s, with the birth of the Modernist movement.`,
        },
        {
          id: 'c18-r2-p3-7',
          label: '7',
          content: `While in the upper layers of the city, people could walk undisturbed between elegant palaces and streets, the lower layer was the place for services, trade, transport and industry. But the true originality of Leonardo's vision was its fusion of architecture and engineering. Leonardo designed extensive hydraulic plants to create artificial canals throughout the city. The canals, regulated by locks and basins, were supposed to make it easier for boats to navigate inland. Leonardo also thought that the width of the streets ought to match the average height of the adjacent houses: a rule still followed in many contemporary cities across Italy, to allow access to sun and reduce the risk of damage from earthquakes.`,
        },
        {
          id: 'c18-r2-p3-8',
          label: '8',
          content: `Although some of these features existed in Roman cities, before Leonardo's drawings there had never been a multi-level, compact modern city which was thoroughly technically conceived. Indeed, it wasn't until the 19th century that some of his ideas were applied. For example, the subdivision of the city by function - with services and infrastructures located in the lower levels and wide and well-ventilated boulevards and walkways above for residents – is an idea that can be found in Georges-Eugène Haussmann's renovation of Paris under Emperor Napoleon III between 1853 and 1870.`,
        },
        {
          id: 'c18-r2-p3-9',
          label: '9',
          content: `Today, Leonardo's ideas are not simply valid, they actually suggest a way forward for urban planning. Many scholars think that the compact city, built upwards instead of outwards, integrated with nature (especially water systems), with efficient transport infrastructure, could help modern cities become more efficient and sustainable. This is yet another reason why Leonardo was aligned so closely with modern urban planning and centuries ahead of his time.`,
        },
      ],
    },
  ];

  const SUMMARY_OPTIONS_Q24_26 = [
    { key: 'A', text: 'medical practitioners' },
    { key: 'B', text: 'specialised tasks' },
    { key: 'C', text: 'available resources' },
    { key: 'D', text: 'reduced illness' },
    { key: 'E', text: 'professional authority' },
    { key: 'F', text: 'technology experts' },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-8 (Notes Completion)
    {
      id: 'c18-r2-g1',
      passageId: 'c18-r2-p1',
      questionType: 'note_completion',
      title: 'Questions 1–8',
      instructions:
        'Complete the notes below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\nWrite your answers in boxes 1–8 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 8,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      maxNumbers: 0,
      contentWithGaps: `Stonehenge

Construction
Stage 1:
• the ditch and henge were dug, possibly using tools made from [[1]]
• [[2]] may have been arranged in deep pits inside the circle

Stage 2:
• bluestones from the Preseli Hills were placed in standing position
• theories about the transportation of the bluestones:
  - archaeological:
    o builders used [[3]] to make sledges and rollers
    o [[4]] pulled them on giant baskets
  - geological:
    o they were brought from Wales by [[5]]

Stage 3:
• sandstone slabs were arranged into an outer crescent or ring

Builders
• a theory arose in the 17th century that its builders were Celtic [[6]]

Purpose
• many experts agree it has been used as a [[7]] site
• in the 1960s, it was suggested that it worked as a kind of [[8]]`,
      questions: [
        {
          id: 'c18-r2-q1',
          questionNumber: 1,
          prompt: 'the ditch and henge were dug, possibly using tools made from [1]',
          answerKey: 'antlers',
          acceptedAlternatives: ['antlers', 'deer antlers'],
          explanation:
            "Paragraph 2 states that Neolithic Britons used primitive tools, 'which may have been fashioned out of deer antlers, to dig a massive circular ditch and bank, or henge.'",
          evidenceQuote:
            'primitive tools, which may have been fashioned out of deer antlers, to dig a massive circular ditch and bank, or henge',
          paragraphRef: '2',
        },
        {
          id: 'c18-r2-q2',
          questionNumber: 2,
          prompt: '[2] may have been arranged in deep pits inside the circle',
          answerKey: 'timber posts',
          acceptedAlternatives: ['timber posts', 'posts'],
          explanation:
            "Paragraph 2 states: 'Deep pits dating back to that era and located within the circle may have once held a ring of timber posts, according to some scholars.'",
          evidenceQuote:
            'Deep pits dating back to that era and located within the circle may have once held a ring of timber posts, according to some scholars.',
          paragraphRef: '2',
        },
        {
          id: 'c18-r2-q3',
          questionNumber: 3,
          prompt: 'builders used [3] to make sledges and rollers',
          answerKey: 'tree trunks',
          acceptedAlternatives: ['tree trunks'],
          explanation:
            "Paragraph 4 explains: 'Stonehenge\\'s builders fashioned sledges and rollers out of tree trunks to lug the bluestones from the Preseli Hills.'",
          evidenceQuote:
            "Stonehenge's builders fashioned sledges and rollers out of tree trunks to lug the bluestones from the Preseli Hills.",
          paragraphRef: '4',
        },
        {
          id: 'c18-r2-q4',
          questionNumber: 4,
          prompt: '[4] pulled them on giant baskets',
          answerKey: 'oxen',
          acceptedAlternatives: ['oxen'],
          explanation:
            "Paragraph 4 explains that more recent hypotheses have them transporting bluestones on giant wicker baskets 'hauled by oxen'.",
          evidenceQuote:
            'transporting the bluestones with supersized wicker baskets on a combination of ball bearings and long grooved planks, hauled by oxen.',
          paragraphRef: '4',
        },
        {
          id: 'c18-r2-q5',
          questionNumber: 5,
          prompt: 'they were brought from Wales by [5]',
          answerKey: 'glaciers',
          acceptedAlternatives: ['glaciers'],
          explanation:
            "Paragraph 5 mentions geological hypotheses: 'some scientists have suggested that it was glaciers, not humans, that carried the bluestones to Salisbury Plain.'",
          evidenceQuote:
            'some scientists have suggested that it was glaciers, not humans, that carried the bluestones to Salisbury Plain.',
          paragraphRef: '5',
        },
        {
          id: 'c18-r2-q6',
          questionNumber: 6,
          prompt: 'a theory arose in the 17th century that its builders were Celtic [6]',
          answerKey: 'druids',
          acceptedAlternatives: ['druids', 'Druids'],
          explanation:
            "Paragraph 7 notes: 'In the 17th century, archaeologist John Aubrey made the claim that Stonehenge was the work of druids, who had important religious, judicial and political roles in Celtic society.'",
          evidenceQuote:
            'In the 17th century, archaeologist John Aubrey made the claim that Stonehenge was the work of druids, who had important religious, judicial and political roles in Celtic society.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r2-q7',
          questionNumber: 7,
          prompt: 'many experts agree it has been used as a [7] site',
          answerKey: 'burial',
          acceptedAlternatives: ['burial', 'burial ground'],
          explanation:
            "Paragraph 9 mentions that there is consensus among scholars that Stonehenge once served the function of 'burial ground' (or burial site).",
          evidenceQuote:
            'While there is consensus among the majority of modern scholars that Stonehenge once served the function of burial ground, they have yet to determine what other purposes it had.',
          paragraphRef: '9',
        },
        {
          id: 'c18-r2-q8',
          questionNumber: 8,
          prompt: 'in the 1960s, it was suggested that it worked as a kind of [8]',
          answerKey: 'calendar',
          acceptedAlternatives: ['calendar'],
          explanation:
            "Paragraph 10 states: 'In the 1960s, the astronomer Gerald Hawkins suggested that the cluster of megalithic stones operated as a form of calendar'.",
          evidenceQuote:
            'the astronomer Gerald Hawkins suggested that the cluster of megalithic stones operated as a form of calendar',
          paragraphRef: '10',
        },
      ],
    },

    // PASSAGE 1: Questions 9-13 (TRUE / FALSE / NOT GIVEN)
    {
      id: 'c18-r2-g2',
      passageId: 'c18-r2-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 9–13',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 9–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 9,
      endQuestionNumber: 13,
      optionsList: [
        { key: 'TRUE', text: 'TRUE' },
        { key: 'FALSE', text: 'FALSE' },
        { key: 'NOT GIVEN', text: 'NOT GIVEN' },
      ],
      questions: [
        {
          id: 'c18-r2-q9',
          questionNumber: 9,
          prompt:
            'During the third phase of construction, sandstone slabs were placed in both the outer areas and the middle of the Stonehenge site.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE', 'True'],
          explanation:
            "Paragraph 6 confirms that during the third phase, sandstone slabs ('sarsens') were placed in an 'outer crescent or ring' and also assembled into trilithons in the 'centre of Stonehenge'.",
          evidenceQuote:
            "sandstone slabs - known as 'sarsens' - were arranged into an outer crescent or ring; some were assembled into the iconic three-pieced structures called trilithons that stand tall in the centre of Stonehenge.",
          paragraphRef: '6',
        },
        {
          id: 'c18-r2-q10',
          questionNumber: 10,
          prompt:
            'There is scientific proof that the bluestones stood in the same spot until approximately 1600 BCE.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE', 'False'],
          explanation:
            "Paragraph 6 contradicts this, stating that radiocarbon dating showed work continued until roughly 1600 BCE 'with the bluestones in particular being repositioned multiple times'.",
          evidenceQuote:
            'Radiocarbon dating has revealed that work continued at Stonehenge until roughly 1600 BCE, with the bluestones in particular being repositioned multiple times.',
          paragraphRef: '6',
        },
        {
          id: 'c18-r2-q11',
          questionNumber: 11,
          prompt: "John Aubrey's claim about Stonehenge was supported by 20th-century findings.",
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE', 'False'],
          explanation:
            "Paragraph 7 contradicts this, explaining that mid-20th century radiocarbon dating disproved Aubrey's theory by showing Stonehenge was built over 1,000 years before the Celts inhabited the region.",
          evidenceQuote:
            'However, in the mid-20th century, radiocarbon dating demonstrated that Stonehenge stood more than 1,000 years before the Celts inhabited the region.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r2-q12',
          questionNumber: 12,
          prompt:
            'Objects discovered at Stonehenge seem to indicate that it was constructed by a number of different groups of people.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE', 'True'],
          explanation:
            "Paragraph 8 states: 'Many modern historians and archaeologists now agree that several distinct tribes of people contributed to Stonehenge... Bones, tools and other artefacts found on the site seem to support this hypothesis.'",
          evidenceQuote:
            'Many modern historians and archaeologists now agree that several distinct tribes of people contributed to Stonehenge, each undertaking a different phase of its construction. Bones, tools and other artefacts found on the site seem to support this hypothesis.',
          paragraphRef: '8',
        },
        {
          id: 'c18-r2-q13',
          questionNumber: 13,
          prompt:
            "Criticism of Gerald Hawkins' theory about Stonehenge has come mainly from other astronomers.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            "Paragraph 10 mentions that critics argued against his theory, but does not provide information about whether these critics were mainly other astronomers.",
          evidenceQuote:
            "While his theory has received a considerable amount of attention over the decades, critics maintain that Stonehenge's builders probably lacked the knowledge necessary to predict such events or that England's dense cloud cover would have obscured their view of the skies.",
          paragraphRef: '10',
        },
      ],
    },

    // PASSAGE 2: Questions 14-19 (Multiple Choice Single)
    {
      id: 'c18-r2-g3',
      passageId: 'c18-r2-p2',
      questionType: 'multiple_choice_single',
      title: 'Questions 14–19',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 14–19 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 19,
      questions: [
        {
          id: 'c18-r2-q14',
          questionNumber: 14,
          prompt: 'What point does the writer make about AI in the first paragraph?',
          options: [
            { key: 'A', text: 'It is difficult to predict how quickly AI will progress.' },
            { key: 'B', text: 'Much can be learned about the use of AI in chess machines.' },
            {
              key: 'C',
              text: 'The future is unlikely to see limitations on the capabilities of AI.',
            },
            {
              key: 'D',
              text: 'Experts disagree on which specialised tasks AI will be able to perform.',
            },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 1 notes that restrictions to narrow specialized tasks are 'very temporary' and that AGI capable of human-level performance on the full range of tasks will likely emerge, meaning limitations on AI capabilities will not remain.",
          evidenceQuote:
            'True, these prodigious accomplishments are all in so-called narrow AI, where machines perform highly specialised tasks. But many experts believe this restriction is very temporary. By mid-century, we may have artificial general intelligence (AGI) - machines that can achieve human-level performance on the full range of tasks that we ourselves can tackle.',
          paragraphRef: '1',
        },
        {
          id: 'c18-r2-q15',
          questionNumber: 15,
          prompt: 'What is the writer doing in the second paragraph?',
          options: [
            { key: 'A', text: 'explaining why machines will be able to outperform humans' },
            { key: 'B', text: 'describing the characteristics that humans and machines share' },
            {
              key: 'C',
              text: 'giving information about the development of machine intelligence',
            },
            { key: 'D', text: 'indicating which aspects of humans are the most advanced' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            'In Paragraph 2, the writer points out the biological handicaps of human brains (slow biochemical speeds, birth canal size restriction) and contrasts them with machines that will be free of these constraints.',
          evidenceQuote:
            'Machines will be free of many of the physical constraints on human intelligence. Our brains run at slow biochemical processing speeds on the power of a light bulb, and their size is restricted by the dimensions of the human birth canal.',
          paragraphRef: '2',
        },
        {
          id: 'c18-r2-q16',
          questionNumber: 16,
          prompt: 'Why does the writer mention the story of King Midas?',
          options: [
            { key: 'A', text: 'to compare different visions of progress' },
            { key: 'B', text: 'to illustrate that poorly defined objectives can go wrong' },
            { key: 'C', text: 'to emphasise the need for cooperation' },
            { key: 'D', text: 'to point out the financial advantages of a course of action' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 3 uses the tale of King Midas to show that 'the more powerful AI becomes, the more important it will be to specify its goals with great care' because asking for the wrong thing leads to disastrous consequences.",
          evidenceQuote:
            "Folklore is full of tales of people who ask for the wrong thing, with disastrous consequences - King Midas, for example, might have wished that everything he touched turned to gold, but didn't really intend this to apply to his breakfast.",
          paragraphRef: '3',
        },
        {
          id: 'c18-r2-q17',
          questionNumber: 17,
          prompt: 'What challenge does the writer refer to in the fourth paragraph?',
          options: [
            { key: 'A', text: 'encouraging humans to behave in a more principled way' },
            { key: 'B', text: 'deciding which values we want AI to share with us' },
            { key: 'C', text: 'creating a better world for all creatures on the planet' },
            { key: 'D', text: 'ensuring AI is more human-friendly than we are ourselves' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 4 explains the difficulty: humans are far from reliably human-friendly ourselves, so we face the challenge of creating machines that do 'a lot better than us' rather than amplifying our dark sides.",
          evidenceQuote:
            "So we need to create powerful AI machines that are 'human-friendly' - that have goals reliably aligned with our own values. One thing that makes this task difficult is that we are far from reliably human-friendly ourselves... If superintelligent machines don't do a lot better than us, we'll be in deep trouble.",
          paragraphRef: '4',
        },
        {
          id: 'c18-r2-q18',
          questionNumber: 18,
          prompt: 'What does the writer suggest about the future of AI in the fifth paragraph?',
          options: [
            { key: 'A', text: 'The safety of machines will become a key issue.' },
            { key: 'B', text: 'It is hard to know what impact machines will have on the world.' },
            { key: 'C', text: 'Machines will be superior to humans in certain respects.' },
            { key: 'D', text: 'Many humans will oppose machines having a wider role.' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 5 suggests that machines will be 'ethically as well as cognitively superhuman' and 'better than us at finding [routes to the moral high ground]'.",
          evidenceQuote:
            "For safety's sake, then, we want the machines to be ethically as well as cognitively superhuman... they'll be better than us at finding them, and steering us in the right direction.",
          paragraphRef: '5',
        },
        {
          id: 'c18-r2-q19',
          questionNumber: 19,
          prompt:
            "Which of the following best summarises the writer's argument in the sixth paragraph?",
          options: [
            {
              key: 'A',
              text: 'More intelligent machines will result in greater abuses of power.',
            },
            {
              key: 'B',
              text: 'Machine learning will share very few features with human learning.',
            },
            {
              key: 'C',
              text: 'There are a limited number of people with the knowledge to program machines.',
            },
            {
              key: 'D',
              text: 'Human shortcomings will make creating the machines we need more difficult.',
            },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 6 argues that because humans are tribal creatures who are conflicted about ideals and ignore or contribute to strangers' suffering, our own shortcomings make programming AI with ethical clarity very difficult.",
          evidenceQuote:
            "The 'getting started' problem is that we need to tell the machines what they're looking for with sufficient clarity... This won't be easy, given that we are tribal creatures and conflicted about the ideals ourselves.",
          paragraphRef: '6',
        },
      ],
    },

    // PASSAGE 2: Questions 20-23 (YES / NO / NOT GIVEN)
    {
      id: 'c18-r2-g4',
      passageId: 'c18-r2-p2',
      questionType: 'yes_no_not_given',
      title: 'Questions 20–23',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 2?\nIn boxes 20–23 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 20,
      endQuestionNumber: 23,
      optionsList: [
        { key: 'YES', text: 'YES' },
        { key: 'NO', text: 'NO' },
        { key: 'NOT GIVEN', text: 'NOT GIVEN' },
      ],
      questions: [
        {
          id: 'c18-r2-q20',
          questionNumber: 20,
          prompt:
            'Machines with the ability to make moral decisions may prevent us from promoting the interests of our communities.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES', 'Yes'],
          explanation:
            "Paragraph 7 confirms that ethical machines would discourage lapses we take for granted: 'We might lose our freedom to discriminate in favour of our own communities, for example.'",
          evidenceQuote:
            'Machines who are better than us at sticking to the moral high ground may be expected to discourage some of the lapses we presently take for granted. We might lose our freedom to discriminate in favour of our own communities, for example.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r2-q21',
          questionNumber: 21,
          prompt:
            'Silicon police would need to exist in large numbers in order to be effective.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            "Paragraph 8 mentions 'ethical silicon police limiting our options', but does not mention anything about whether they would need to exist in large numbers.",
          evidenceQuote:
            "But are we ready for ethical silicon police limiting our options? They might be so good at doing it that we won't notice them; but few of us are likely to welcome such a future.",
          paragraphRef: '8',
        },
        {
          id: 'c18-r2-q22',
          questionNumber: 22,
          prompt:
            'Many people are comfortable with the prospect of their independence being restricted by machines.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO', 'No'],
          explanation:
            "Paragraph 8 contradicts this, stating that 'few of us are likely to welcome such a future', which means many people are NOT comfortable with it.",
          evidenceQuote: 'few of us are likely to welcome such a future.',
          paragraphRef: '8',
        },
        {
          id: 'c18-r2-q23',
          questionNumber: 23,
          prompt:
            'If we want to ensure that machines act in our best interests, we all need to work together.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES', 'Yes'],
          explanation:
            "Paragraph 10 states that getting machines to act well for us 'will require a cooperative spirit, and a willingness to set aside self-interest', meaning we need to work together.",
          evidenceQuote:
            'For our own safety, we need to point these new thinkers in the right direction, and get them to act well for us. It is not yet clear whether this is possible, but if it is, it will require a cooperative spirit, and a willingness to set aside self-interest.',
          paragraphRef: '10',
        },
      ],
    },

    // PASSAGE 2: Questions 24-26 (Summary Completion with options)
    {
      id: 'c18-r2-g5',
      passageId: 'c18-r2-p2',
      questionType: 'summary_completion_options',
      title: 'Questions 24–26',
      instructions:
        'Complete the summary using the list of phrases, A–F, below.\nWrite the correct letter, A–F, in boxes 24–26 on your answer sheet.',
      startQuestionNumber: 24,
      endQuestionNumber: 26,
      optionsList: SUMMARY_OPTIONS_Q24_26,
      contentWithGaps: `Using AI in the UK health system

AI currently has a limited role in the way [[24]] are allocated in the health service. The positive aspect of AI having a bigger role is that it would be more efficient and lead to patient benefits. However, such a change would result, for example, in certain [[25]] not having their current level of [[26]]. It is therefore important that AI goals are appropriate so that discriminatory practices could be avoided.`,
      questions: [
        {
          id: 'c18-r2-q24',
          questionNumber: 24,
          prompt:
            'AI currently has a limited role in the way [24] are allocated in the health service.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 9 states: 'AI already has some input into how resources are used in our National Health Service (NHS)...' which corresponds to 'available resources' (Option C).",
          evidenceQuote:
            'AI already has some input into how resources are used in our National Health Service (NHS)',
          paragraphRef: '9',
        },
        {
          id: 'c18-r2-q25',
          questionNumber: 25,
          prompt:
            'However, such a change would result, for example, in certain [25] not having their current level of [26]. (Question 25)',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 9 refers to 'some humans (e.g. senior doctors)', which corresponds to 'medical practitioners' (Option A).",
          evidenceQuote:
            "However, we'd be depriving some humans (e.g. senior doctors) of the control they presently enjoy.",
          paragraphRef: '9',
        },
        {
          id: 'c18-r2-q26',
          questionNumber: 26,
          prompt:
            'However, such a change would result, for example, in certain [25] not having their current level of [26]. (Question 26)',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph 9 mentions depriving senior doctors of 'the control they presently enjoy', which corresponds to 'professional authority' (Option E).",
          evidenceQuote:
            'depriving some humans (e.g. senior doctors) of the control they presently enjoy.',
          paragraphRef: '9',
        },
      ],
    },

    // PASSAGE 3: Questions 27-33 (TRUE / FALSE / NOT GIVEN)
    {
      id: 'c18-r2-g6',
      passageId: 'c18-r2-p3',
      questionType: 'true_false_not_given',
      title: 'Questions 27–33',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 3?\nIn boxes 27–33 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 27,
      endQuestionNumber: 33,
      optionsList: [
        { key: 'TRUE', text: 'TRUE' },
        { key: 'FALSE', text: 'FALSE' },
        { key: 'NOT GIVEN', text: 'NOT GIVEN' },
      ],
      questions: [
        {
          id: 'c18-r2-q27',
          questionNumber: 27,
          prompt: 'People first referred to Leonardo da Vinci as a genius 500 years ago.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            "Paragraph 1 states that the word 'genius' is universally associated with Leonardo and that he died 500 years ago, but it does not specify when people first referred to him as a genius.",
          evidenceQuote:
            "The word 'genius' is universally associated with the name of Leonardo da Vinci. A true Renaissance man, he embodied scientific spirit, artistic talent and humanist sensibilities. Five hundred years have passed since Leonardo died in his home at Château du Clos Lucé, outside Tours, France.",
          paragraphRef: '1',
        },
        {
          id: 'c18-r2-q28',
          questionNumber: 28,
          prompt: 'The current climate crisis is predicted to cause more deaths than the plague.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            'Paragraph 2 states that the plague caused some 200 million deaths and that climate change will cause widespread death, but it does not compare the number of deaths between the two.',
          evidenceQuote:
            'Today, the world is on the cusp of a climate crisis, which is predicted to cause widespread displacement, extinctions and death, if left unaddressed.',
          paragraphRef: '2',
        },
        {
          id: 'c18-r2-q29',
          questionNumber: 29,
          prompt: 'Some of the challenges we face today can be compared to those of earlier times.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE', 'True'],
          explanation:
            "Paragraph 2 confirms: 'Then, as now, radical solutions were called for to revolutionise the way people lived and safeguard humanity against catastrophe.'",
          evidenceQuote:
            'Then, as now, radical solutions were called for to revolutionise the way people lived and safeguard humanity against catastrophe.',
          paragraphRef: '2',
        },
        {
          id: 'c18-r2-q30',
          questionNumber: 30,
          prompt: "Leonardo da Vinci's 'ideal city' was constructed in the 15th century.",
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE', 'False'],
          explanation:
            "Paragraph 3 states that the 'ideal city' project 'due to its excessive costs - would remain unfulfilled', meaning it was never constructed.",
          evidenceQuote:
            "he began to work on an 'ideal city' project, which – due to its excessive costs - would remain unfulfilled.",
          paragraphRef: '3',
        },
        {
          id: 'c18-r2-q31',
          questionNumber: 31,
          prompt: 'Poor town planning is a major contributor to climate change.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE', 'True'],
          explanation:
            "Paragraph 3 states: 'given that unsustainable urban models are a key cause of global climate change today'.",
          evidenceQuote:
            'given that unsustainable urban models are a key cause of global climate change today',
          paragraphRef: '3',
        },
        {
          id: 'c18-r2-q32',
          questionNumber: 32,
          prompt:
            'In Renaissance times, local people fought against the changes to Pienza and Ferrara.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            'Paragraph 4 mentions urban projects in Pienza and Ferrara, but gives no information about whether local people fought against the changes.',
          evidenceQuote:
            'prominent Renaissance men pushed forward large-scale urban projects in Italy, such as the reconfiguration of the town of Pienza and the expansion of the city of Ferrara.',
          paragraphRef: '4',
        },
        {
          id: 'c18-r2-q33',
          questionNumber: 33,
          prompt: 'Leonardo da Vinci kept a neat, organised record of his designs.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE', 'False'],
          explanation:
            "Paragraph 5 directly contradicts this, stating he had a 'disordered way of working with notes and sketches'.",
          evidenceQuote:
            "It is not easy to identify a coordinated vision of Leonardo's ideal city because of his disordered way of working with notes and sketches.",
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 3: Questions 34-40 (Summary Completion Words)
    {
      id: 'c18-r2-g7',
      passageId: 'c18-r2-p3',
      questionType: 'summary_completion_words',
      title: 'Questions 34–40',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 34–40 on your answer sheet.',
      startQuestionNumber: 34,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Leonardo da Vinci's ideal city

A collection of Leonardo da Vinci's paperwork reveals his design of a new city beside the Ticino River. This was to provide better [[34]] for trade and a less polluted environment. Although Leonardo da Vinci's city shared many of the ideals of his time, some of his innovations were considered unconventional in their design. They included features that can be seen in some tower blocks today, such as [[35]] on the exterior of a building.

Leonardo da Vinci wasn't only an architect. His expertise in [[36]] was evident in his plans for artificial canals within his ideal city. He also believed that the height of houses should relate to the width of streets in case earthquakes occurred. The design of many cities in Italy today follows this [[37]].

While some cities from [[38]] times have aspects that can also be found in Leonardo's designs, his ideas weren't put into practice until long after his death. [[39]] is one example of a city that was redesigned in the 19th century in the way that Leonardo had envisaged. His ideas are also relevant to today's world, where building [[40]] no longer seems to be the best approach.`,
      questions: [
        {
          id: 'c18-r2-q34',
          questionNumber: 34,
          prompt: 'This was to provide better [34] for trade and a less polluted environment.',
          answerKey: 'transport',
          acceptedAlternatives: ['transport'],
          explanation:
            "Paragraph 5 states: 'He designed the city for the easy transport of goods and clean urban spaces'.",
          evidenceQuote:
            'He designed the city for the easy transport of goods and clean urban spaces',
          paragraphRef: '5',
        },
        {
          id: 'c18-r2-q35',
          questionNumber: 35,
          prompt:
            'They included features that can be seen in some tower blocks today, such as [35] on the exterior of a building.',
          answerKey: 'staircases',
          acceptedAlternatives: ['staircases', 'staircase'],
          explanation:
            "Paragraph 6 explains: 'Leonardo wanted the city to be built on several levels, linked with vertical outdoor staircases. This design can be seen in some of today\\'s high-rise buildings'.",
          evidenceQuote:
            "Leonardo wanted the city to be built on several levels, linked with vertical outdoor staircases. This design can be seen in some of today's high-rise buildings",
          paragraphRef: '6',
        },
        {
          id: 'c18-r2-q36',
          questionNumber: 36,
          prompt:
            "Leonardo da Vinci wasn't only an architect. His expertise in [36] was evident in his plans for artificial canals within his ideal city.",
          answerKey: 'engineering',
          acceptedAlternatives: ['engineering'],
          explanation:
            "Paragraph 7 states: 'But the true originality of Leonardo\\'s vision was its fusion of architecture and engineering.'",
          evidenceQuote:
            "But the true originality of Leonardo's vision was its fusion of architecture and engineering. Leonardo designed extensive hydraulic plants to create artificial canals throughout the city.",
          paragraphRef: '7',
        },
        {
          id: 'c18-r2-q37',
          questionNumber: 37,
          prompt: 'The design of many cities in Italy today follows this [37].',
          answerKey: 'rule',
          acceptedAlternatives: ['rule'],
          explanation:
            "Paragraph 7 notes that the street width matching the average height of houses was 'a rule still followed in many contemporary cities across Italy'.",
          evidenceQuote:
            'Leonardo also thought that the width of the streets ought to match the average height of the adjacent houses: a rule still followed in many contemporary cities across Italy',
          paragraphRef: '7',
        },
        {
          id: 'c18-r2-q38',
          questionNumber: 38,
          prompt:
            'While some cities from [38] times have aspects that can also be found in Leonardo\'s designs, his ideas weren\'t put into practice until long after his death.',
          answerKey: 'Roman',
          acceptedAlternatives: ['Roman', 'roman'],
          explanation:
            "Paragraph 8 states: 'Although some of these features existed in Roman cities, before Leonardo\\'s drawings there had never been a multi-level, compact modern city'.",
          evidenceQuote:
            "Although some of these features existed in Roman cities, before Leonardo's drawings there had never been a multi-level, compact modern city",
          paragraphRef: '8',
        },
        {
          id: 'c18-r2-q39',
          questionNumber: 39,
          prompt:
            '[39] is one example of a city that was redesigned in the 19th century in the way that Leonardo had envisaged.',
          answerKey: 'Paris',
          acceptedAlternatives: ['Paris', 'paris'],
          explanation:
            "Paragraph 8 mentions 'Georges-Eugène Haussmann\\'s renovation of Paris under Emperor Napoleon III between 1853 and 1870' as an example of 19th century implementation.",
          evidenceQuote:
            "Haussmann's renovation of Paris under Emperor Napoleon III between 1853 and 1870.",
          paragraphRef: '8',
        },
        {
          id: 'c18-r2-q40',
          questionNumber: 40,
          prompt:
            'His ideas are also relevant to today\'s world, where building [40] no longer seems to be the best approach.',
          answerKey: 'outwards',
          acceptedAlternatives: ['outwards', 'outward'],
          explanation:
            "Paragraph 9 mentions that scholars advocate for 'the compact city, built upwards instead of outwards', meaning building outwards is no longer the best approach.",
          evidenceQuote:
            'Many scholars think that the compact city, built upwards instead of outwards... could help modern cities become more efficient and sustainable.',
          paragraphRef: '9',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 18 Academic Reading Test 2',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge18ReadingTest2(authorId?: string) {
  const data = getCambridge18ReadingTest2Data();

  const validationErrors = validateTestVersion(data.passages, data.questionGroups);

  if (validationErrors.length > 0) {
    throw new Error(
      `Cambridge 18 Reading Test 2 validation failed:\n${validationErrors.join('\n')}`
    );
  }

  const existingTest = (await db.prepare(`
    SELECT id FROM reading_tests
    WHERE title = ?
    LIMIT 1
  `).get(data.title)) as { id: string } | undefined;

  const now = new Date().toISOString();
  let resolvedAuthorId = authorId;

  if (!resolvedAuthorId) {
    const defaultUser = (await db.prepare(`
      SELECT id FROM users ORDER BY created_at ASC LIMIT 1
    `).get()) as { id: string } | undefined;

    if (defaultUser) {
      resolvedAuthorId = defaultUser.id;
    } else {
      resolvedAuthorId = uuidv4();
      await db.prepare(`
        INSERT INTO users (id, email, role, created_at, updated_at)
        VALUES (?, 'system-ingest@ielts.local', 'admin', ?, ?)
      `).run(resolvedAuthorId, now, now);
    }
  }

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db.prepare(`
      SELECT id FROM reading_test_versions
      WHERE test_id = ? AND version_number = 1
      LIMIT 1
    `).get(testId)) as { id: string } | undefined;

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
