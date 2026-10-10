import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup, ReadingTest } from '../shared/types';
import { validateTestVersion, getTestById, getVersionById } from './readingService';

export function getCambridge21Test4Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c21-t4-p1',
      passageNumber: 1,
      title: 'The problems and benefits created by the spread of the water hyacinth in Kenya',
      subtitle: 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c21-t4-p1-1',
          label: '1',
          content: `Water hyacinth (Eichhornia crassipes), an aquatic plant native to South America, first appeared in countries in Africa in the early 1900s. Scientists there called it the 'world's worst aquatic weed', after it spread from the southernmost tip of Africa in the early 1900s and started obstructing major dams and rivers.`,
        },
        {
          id: 'c21-t4-p1-2',
          label: '2',
          content: `In east Africa the plant arrived with Belgian colonists in Rwanda, who liked the look of its glossy leaves and delicate purple flowers floating in their ponds. But by the 1980s, it had 'escaped' out of the country via the Kagera river and made its way downstream to Lake Victoria. There, with no natural predators and perfect temperature conditions, the plant began spreading in the open water, blocking fishing routes and providing a new habitat for disease-carrying mosquitoes.`,
        },
        {
          id: 'c21-t4-p1-3',
          label: '3',
          content: `For the women who smoke fish from the lake to sell it has meant declining income, as the boats that once brought the fish to shore by the hundreds struggle to navigate through the mass of plants. But water hyacinth isn't their only headache. In order to smoke the fish that they buy, they must gather huge quantities of firewood, sometimes walking as far as 10km each way to collect enough to complete their work. And each day as they cook, they breathe in the thick, grey smoke.`,
        },
        {
          id: 'c21-t4-p1-4',
          label: '4',
          content: `About three out of four families in Kenya depend on wood or charcoal to cook their daily meals, and the rate is even higher in rural areas, Kenya's latest demographic and health survey shows. Using solid fuels like these for cooking increases indoor pollution. The World Health Organization estimates that about 14,300 Kenyans die annually as a result of indoor air pollution - most of which is caused by cooking and heating sources.`,
        },
        {
          id: 'c21-t4-p1-5',
          label: '5',
          content: `Some years ago, on the shores of Lake Victoria, huge piles of water hyacinth that villagers had taken out of the water in an attempt to clear it were a common sight. But buried in those decaying waxy leaves was a renewable energy gold mine. It turns out the floating plant isn't just good at spreading - its foliage also contains a high ratio of carbon to nitrogen. It's a magic combination that has captivated researchers' imaginations since as early as the 1980s when, across the world, they began to explore its potential as a biofuel. Just about 4kg of the dried plant would be enough to cater for a large family's daily energy needs, early research predicted.`,
        },
        {
          id: 'c21-t4-p1-6',
          label: '6',
          content: `In 2014, Nigerian academics announced they had got better yields of biofuel gas when they mixed the plant with chicken manure. A few years later, Kenyan scientists confirmed what their Nigerian peers and others had already found: manure worked to improve the process of converting the weed into gas.`,
        },
        {
          id: 'c21-t4-p1-7',
          label: '7',
          content: `In 2018, the technology came to a village on the shore of Lake Victoria, called Dunga. The project promised a two-for-one solution to the dual menaces of the water hyacinth and dependence on firewood. The community received a pair of donated biogas digesters - machines that would transform a mix of water hyacinth and cow dung into biogas for cooking.`,
        },
        {
          id: 'c21-t4-p1-8',
          label: '8',
          content: `The digesters work a bit like a stomach. The mixture goes in one end - think of it as a mouth - and over the next 20 to 30 days, it goes through a fermentation process and breaks down, giving off gas that comes out the other end. From there, the clean-burning gas is passed through pipes to the point of use, just like traditional domestic gas. In Dunga, the machines produce enough gas to serve about 60% of the village's population. It is used in domestic stoves and for other household tasks such as purifying water and incubating chicks.`,
        },
        {
          id: 'c21-t4-p1-9',
          label: '9',
          content: `The project is testing whether biogas can provide an effective alternative to firewood and charcoal in rural Kenyan communities. Results indicate that the programme seems to be working. The women who smoke the lake fish are already getting sick less often. Besides, they don't have to devote a lot of time every day to gathering firewood, which is a great relief. As a result, they're able to make more money for their families from other enterprises.`,
        },
        {
          id: 'c21-t4-p1-10',
          label: '10',
          content: `Kanyiva Muindi is an epidemiologist and air pollution research fellow at the African Population and Health Research Centre in Nairobi. She says families who switch to the smokeless cooking method could expect fewer respiratory diseases. Women, young girls and children are particularly vulnerable because they are the ones who cook in the kitchen or outside over fires.`,
        },
        {
          id: 'c21-t4-p1-11',
          label: '11',
          content: `How much better the biogas stoves will be for the community's health still needs more research, says Dominic Kahumbu Wanjihia, Biogas International's chief executive. But unless the price of the machines drops, it's pretty clear that most communities will never be able to afford any, since they sell for about $750.`,
        },
        {
          id: 'c21-t4-p1-12',
          label: '12',
          content: `Kanyiva says affordability is a challenge worth addressing, given the huge health and environmental dangers posed by 'dirty' fuels such as wood, charcoal and kerosene. If biogas could become affordable on a large scale, she says it 'would be life-changing for millions on the African continent and beyond'.`,
        },
      ],
    },
    {
      id: 'c21-t4-p2',
      passageNumber: 2,
      title: `How could multilingualism benefit India's poorest schoolchildren?`,
      subtitle: 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c21-t4-p2-1',
          label: '1',
          content: `The crowded and bustling streets of Delhi teem with life. Stop to listen and, above the din of rickshaws and buses, you'll hear a multitude of languages, as more than 20 million people go about their daily lives. Many were born and raised here, and many millions more have recently made India's capital their home, having moved from surrounding neighbourhoods, cities and states or across the country, often in the hope of gaining better jobs and a better life. Some arrive speaking fluent Hindi, the dominant language in Delhi (and the official language of government), but many arrive speaking any number of India's 22 officially recognised languages, let alone the hundreds of regional languages in a country of more than 1.3 billion people.`,
        },
        {
          id: 'c21-t4-p2-2',
          label: '2',
          content: `A team of researchers led by Professor Ianthi Tsimpli of Cambridge University is currently working on a project collecting data on 1,000 primary-age children in Delhi and the cities of Hyderabad and Bihar. The overriding aim of the four-year project, called 'Multilingualism and Multiliteracy', is to find out why in a country where multilingualism is so common (more than 255 million people in India speak at least two languages, and nearly 90 million speak three or more languages), the many benefits of speaking more than one language, observed in schools in Europe for instance, do not apply to many of India's schoolchildren.`,
        },
        {
          id: 'c21-t4-p2-3',
          label: '3',
          content: `'Each year across India, 600,000 children are tested, and year after year over 50% of children in Standard 5 [ten-year-olds] cannot read a Standard 2 [seven-year-olds] task fluently, and just under 50% of them cannot solve a Standard 2 subtraction task,' says Tsimpli. She explains that low educational achievement can lead to many of these students dropping out of school - a problem disproportionately affecting female students.`,
        },
        {
          id: 'c21-t4-p2-4',
          label: '4',
          content: `Tsimpli and her colleagues are investigating whether these low learning outcomes could be caused by an Indian school system where the language that children are taught in often differs from the language used at home. The research project, which focuses on 8 to 11-year-old schoolchildren in rural and urban areas, collects data on whether the schoolchildren live in slum* or non-slum areas. Many of the children have moved from remote, rural areas to urban areas. They are so poor they have to live in slums and, as a result of migration, they may speak languages that are different from the regional language.`,
        },
        {
          id: 'c21-t4-p2-5',
          label: '5',
          content: `Having already tested 1,000 children, the researchers will now embark on retesting them. They intend to look not only at test results, but also at variables such as the standard of schooling, the environment and the teaching practices themselves. It's possible that one of the causes of low performance is the lack of pupil-centred teaching methods; in many Indian primary schools the teacher dominates and there is little room for independent learning.`,
        },
        {
          id: 'c21-t4-p2-6',
          label: '6',
          content: `Although the findings are at a preliminary stage, Tsimpli and her team have found that the medium of instruction used in schools, especially English, may hold back those children who have little familiarity with, or exposure to, the language before starting school and outside of school life. According to Tsimpli, most of the evidence from this and other projects shows that English instruction for children from low socio-economic areas might not be the best way for them to learn, at least in the first three years of primary education.`,
        },
        {
          id: 'c21-t4-p2-7',
          label: '7',
          content: `'What we would recommend for everyone, not just low socio-economic status children, would be to start learning in the language they feel comfortable learning in ... English can still be used, but perhaps not as the medium of instruction in primary schools. It could, for example, be one of the subjects that are being taught alongside other subjects. We are not suggesting that English be withdrawn - that ship has sailed - but we perhaps have to think more about learner needs. There is perhaps too much uniformity in teaching and less tailoring to the children's language abilities and needs,' says Tsimpli.`,
        },
        {
          id: 'c21-t4-p2-8',
          label: '8',
          content: `While the preliminary results show there is no difference in general intelligence among boys and girls from slum areas versus those from urban poor backgrounds, an unanticipated finding has been that children from slum backgrounds do not seem to lag behind children from other urban poor backgrounds - and in some cases outperform them (e.g. in numeracy and literacy tasks). According to the researchers, this unexpected finding may be down to the life experiences of children growing up in slums. They are likely to mature faster and come into closer contact with the numeracy skills essential for day-to-day survival.`,
        },
        {
          id: 'c21-t4-p2-9',
          label: '9',
          content: `The project has already caught the attention of government ministers, who are keen to use the findings of the study to inform and adjust school policy in Delhi and the wider state. 'They are as keen as us to understand how the challenging context of deprivation can be attenuated when focusing on the languages children learn and use while at school. Our findings don't mean you're doomed if you're poor. It may be that these low learning outcomes are because of the way education is provided in India, with a huge focus on Hindi and English as the mediums of instruction, to the potential detriment of children unfamiliar with those languages,' explains Tsimpli.`,
        },
        {
          id: 'c21-t4-p2-10',
          label: '10',
          content: `'Language is central to the way knowledge is transferred - so the medium of instruction is obviously hugely influential. We hope to ... show that problem solving, numeracy and literacy can and do improve in children who are educated in a language of instruction they know. The trick may be to bridge school skills with life skills and make use of the richness of a child's life experience to help them learn in the most effective ways possible,' says Tsimpli.\n\n* slum: a very densely populated area in which the infrastructure is incomplete and services inadequate or non-existent`,
        },
      ],
    },
    {
      id: 'c21-t4-p3',
      passageNumber: 3,
      title: 'The Globemakers: The Curious Story of an Ancient Craft',
      subtitle: "A review of Peter Bellerby's book The Globemakers\nYou should spend 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.",
      paragraphs: [
        {
          id: 'c21-t4-p3-1',
          label: '1',
          content: `In 2008, Peter Bellerby, who lived in London, wanted to give his father a model globe for his eightieth birthday. What seemed simple enough to start with triggered an almost obsessive, decade-long journey, marked by a series of obstacles that would have deterred anyone less determined. It ended with his establishing the world's only bespoke globemaking company.`,
        },
        {
          id: 'c21-t4-p3-2',
          label: '2',
          content: `The first surprise in The Globemakers, Bellerby's account of this impulsive enterprise, is that obtaining such a globe was not simply a matter of a quick online order and a repressed sigh at the shipping costs. After all, contrary to stubbornly held popular views of our ancestors' geographical ignorance, we have known that the world is spherical since at least the 6th century BCE. The ancient Greek philosopher Plato in his work Phaedo likened it to a leather ball, while the accolade of producing the first recorded globe goes to the ancient Greek philosopher Crates of Mallus, who is said to have made one in around 150 BCE. Surely, Bellerby reasoned, a good-quality globe wouldn't be difficult to find.`,
        },
        {
          id: 'c21-t4-p3-3',
          label: '3',
          content: `Nearly two millennia later, however, it seemed that the art of globemaking had been largely forgotten. Bellerby came across shoddy commercial versions designed for school classrooms and genuine antiques in auction houses that would have bust his budget. Even his trips to Morocco and India, where surely the knowledge of artisan cartographers* had been preserved, drew a blank.`,
        },
        {
          id: 'c21-t4-p3-4',
          label: '4',
          content: `Not one to be easily thwarted, Bellerby decided to make his own good-quality globe. In the process, almost everything that could possibly go wrong did so. Even the shape of the Earth posed a problem, as it is not quite a perfect sphere, but oblate (slightly flattened at the poles). Having decided to compromise and opt for two half-spherical pieces that could be fitted together, he was unable to discover anyone capable of casting moulds with sufficient accuracy to ensure that he would not be left with two half-spheres that were not quite the same circumference. Even after he eventually resolved this issue, extracting these from the moulds resulted in piles of cracked plaster of Paris** and clouds of choking dust in the workshop he had set up at the rear of his house.`,
        },
        {
          id: 'c21-t4-p3-5',
          label: '5',
          content: `This series of abortive experiments taught Bellerby a lot about the challenges of making globes, which he communicates here to the reader. Finding just the right way to prise the globes from the mould - a high-end air compressor finally did the trick - and locating the right paper and inks with which to make the gores (the sections of flat sheet mapping that are pasted onto the spherical globe) without the ink seeping out to create a mushy, unreadable mess took months and an alarming chunk out of his bank balance. Bellerby's frustration at the painstaking process of attaching the gores to the globe surface - after having found a glue with precisely the right adhesive qualities - is palpable. Right at the end of the process, he learnt that the paper had stretched slightly and so the final one overlapped the first by a centimetre (which may not seem a great deal, but when that represents 2 per cent of the Earth's diameter, it's equivalent to obliterating the Himalayas or wiping out Chile).`,
        },
        {
          id: 'c21-t4-p3-6',
          label: '6',
          content: `Bellerby's account of the technical challenges of globe production is interspersed with a series of interludes on great globemakers of the past and cartographic history in general. Purists might wish for more map-making details, but Bellerby clearly found a kindred spirit in Martin Behaim. He was the Nuremberg entrepreneur who in 1492 created the Erdapfel, the world's oldest surviving globe, beautifully finished by a workshop of painters and other craftsmen, only to find that the explorer Christopher Columbus had stumbled upon the Americas the very same year, rendering his masterpiece instantly out of date. Something of Bellerby's unflinching ambition is reflected in the even more heroic efforts of the Italian cartographer Vincenzo Coronelli, who, in the seventeenth century, created two globes for Louis XIV of France. It took him twenty years to complete the monstrous pair, whose vast bulk - each with a diameter of around four metres - can still be admired in the National Library of France in Paris.`,
        },
        {
          id: 'c21-t4-p3-7',
          label: '7',
          content: `Although a celebration of the revival of an ancient craft, Bellerby's book is also a lament for the fading away of centuries-old traditions. When he embarked on his globemaking odyssey, he struggled to find artisans with the skills to make the right moulds for the globes or foundries that could shape the meridians (the metal frames which girdle globes) in just the right way. Although he finally located the right craftsmen, some simply dropping in, serendipitously, to his workshop (by now in more suitable premises than his back room), many of these have now retired or passed away.`,
        },
        {
          id: 'c21-t4-p3-8',
          label: '8',
          content: `Bellerby's father finally did receive his eightieth birthday present, albeit two years late. Bellerby went on to found a company which now turns out over six hundred globes a year for customers who can have their own tiny village marked or more unusual requests fulfilled. His book, beautifully illustrated with photographs of the various stages of his venture and a few illustrations of historic globes and maps, is hardly a blueprint for commercial success. But it is more than enough to stir up admiration for the craftsmanship of the great mapmakers of the past and the obsessive determination of a modern successor who revived their almost moribund art.\n\n* cartographer: someone involved in the science or practice of drawing maps\n** plaster of Paris: a quick-setting plaster consisting of a fine white powder that hardens when moistened and allowed to dry`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-7 (True / False / Not Given)
    {
      id: 'c21-t4-g1',
      passageId: 'c21-t4-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–7',
      instructions: `Do the following statements agree with the information given in Reading Passage 1?\n\nIn boxes 1–7 on your answer sheet, choose:\nTRUE\tif the statement agrees with the information\nFALSE\tif the statement contradicts the information\nNOT GIVEN\tif there is no information on this`,
      startQuestionNumber: 1,
      endQuestionNumber: 7,
      questions: [
        {
          id: 'c21-t4-q1',
          questionNumber: 1,
          prompt: 'Water hyacinth was introduced as a decorative plant in east Africa.',
          answerKey: 'TRUE',
          explanation: `In east Africa the plant arrived with Belgian colonists in Rwanda, who liked the look of its glossy leaves and delicate purple flowers floating in their ponds.`,
          evidenceQuote: `In east Africa the plant arrived with Belgian colonists in Rwanda, who liked the look of its glossy leaves and delicate purple flowers floating in their ponds.`,
          paragraphRef: '2',
        },
        {
          id: 'c21-t4-q2',
          questionNumber: 2,
          prompt: 'Fishermen took some water hyacinth plants to Lake Victoria.',
          answerKey: 'FALSE',
          explanation: `It had ‘escaped’ out of the country via the Kagera river and made its way downstream to Lake Victoria, rather than being intentionally transported by fishermen.`,
          evidenceQuote: `it had 'escaped' out of the country via the Kagera river and made its way downstream to Lake Victoria.`,
          paragraphRef: '2',
        },
        {
          id: 'c21-t4-q3',
          questionNumber: 3,
          prompt: 'It is now difficult to force boats through the thick water hyacinth on Lake Victoria.',
          answerKey: 'TRUE',
          explanation: `The passage states that boats that once brought fish to shore by the hundreds struggle to navigate through the mass of plants.`,
          evidenceQuote: `as the boats that once brought the fish to shore by the hundreds struggle to navigate through the mass of plants.`,
          paragraphRef: '3',
        },
        {
          id: 'c21-t4-q4',
          questionNumber: 4,
          prompt: 'Chemicals produced by the water hyacinth plants are affecting the numbers of fish in Lake Victoria.',
          answerKey: 'NOT GIVEN',
          explanation: `The passage mentions that the weed spreads, blocks fishing routes, and creates a habitat for mosquitoes, but gives no information about chemicals produced by the plants affecting fish numbers.`,
          evidenceQuote: `There, with no natural predators and perfect temperature conditions, the plant began spreading in the open water, blocking fishing routes and providing a new habitat for disease-carrying mosquitoes.`,
          paragraphRef: '2',
        },
        {
          id: 'c21-t4-q5',
          questionNumber: 5,
          prompt: `Cooking with charcoal has been proved to be even worse for people's health than cooking with wood.`,
          answerKey: 'NOT GIVEN',
          explanation: `The passage notes that three out of four families depend on wood or charcoal and that solid fuels increase indoor pollution, but does not compare charcoal to wood to claim one is worse than the other.`,
          evidenceQuote: `About three out of four families in Kenya depend on wood or charcoal to cook their daily meals, and the rate is even higher in rural areas... Using solid fuels like these for cooking increases indoor pollution.`,
          paragraphRef: '4',
        },
        {
          id: 'c21-t4-q6',
          questionNumber: 6,
          prompt: 'People found it impossible to remove much water hyacinth from Lake Victoria.',
          answerKey: 'FALSE',
          explanation: `The text contradicts this by stating that huge piles of water hyacinth taken out of the water by villagers were a common sight on the shores.`,
          evidenceQuote: `huge piles of water hyacinth that villagers had taken out of the water in an attempt to clear it were a common sight.`,
          paragraphRef: '5',
        },
        {
          id: 'c21-t4-q7',
          questionNumber: 7,
          prompt: 'Scientists started investigating the possibility of using water hyacinth to generate biogas in the last century.',
          answerKey: 'TRUE',
          explanation: `The passage confirms researchers began exploring its potential as a biofuel as early as the 1980s (which was in the 20th century).`,
          evidenceQuote: `captivated researchers' imaginations since as early as the 1980s when, across the world, they began to explore its potential as a biofuel.`,
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 1: Questions 8-10 (Flow-chart Completion)
    {
      id: 'c21-t4-g2',
      passageId: 'c21-t4-p1',
      questionType: 'flow_chart_completion',
      title: 'Questions 8–10',
      instructions: `Complete the flow-chart below.\n\nChoose NO MORE THAN TWO WORDS from the passage for each answer.`,
      startQuestionNumber: 8,
      endQuestionNumber: 10,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      flowChartSteps: [
        {
          stepNumber: 1,
          title: 'Generating biogas for domestic use in Dunga',
          descriptionWithGaps: 'First, place water hyacinth together with some [8] into a digester',
          questionNumbers: [8],
        },
        {
          stepNumber: 2,
          title: 'Fermentation Stage',
          descriptionWithGaps: 'Leave the mixture until the [9] is completed',
          questionNumbers: [9],
        },
        {
          stepNumber: 3,
          title: 'Gas Distribution',
          descriptionWithGaps: 'Capture the gas emitted by the digester and use [10] to transport it to individual homes',
          questionNumbers: [10],
        },
        {
          stepNumber: 4,
          title: 'Domestic Application',
          descriptionWithGaps: 'Then use the gas for cooking as well as making water fit for human consumption',
          questionNumbers: [],
        },
      ],
      questions: [
        {
          id: 'c21-t4-q8',
          questionNumber: 8,
          prompt: 'First, place water hyacinth together with some [8] into a digester',
          answerKey: 'cow dung',
          acceptedAlternatives: ['dung'],
          explanation: `The community received a pair of donated biogas digesters – machines that would transform a mix of water hyacinth and cow dung into biogas for cooking.`,
          evidenceQuote: `transform a mix of water hyacinth and cow dung into biogas for cooking.`,
          paragraphRef: '7',
        },
        {
          id: 'c21-t4-q9',
          questionNumber: 9,
          prompt: 'Leave the mixture until the [9] is completed',
          answerKey: 'fermentation',
          acceptedAlternatives: ['fermentation process'],
          explanation: `The mixture goes in one end – think of it as a mouth – and over the next 20 to 30 days, it goes through a fermentation process and breaks down, giving off gas that comes out the other end.`,
          evidenceQuote: `over the next 20 to 30 days, it goes through a fermentation process and breaks down, giving off gas that comes out the other end.`,
          paragraphRef: '8',
        },
        {
          id: 'c21-t4-q10',
          questionNumber: 10,
          prompt: 'Capture the gas emitted by the digester and use [10] to transport it to individual homes',
          answerKey: 'pipes',
          explanation: `From there, the clean-burning gas is passed through pipes to the point of use, just like traditional domestic gas.`,
          evidenceQuote: `From there, the clean-burning gas is passed through pipes to the point of use, just like traditional domestic gas.`,
          paragraphRef: '8',
        },
      ],
    },

    // PASSAGE 1: Questions 11-13 (Note Completion)
    {
      id: 'c21-t4-g3',
      passageId: 'c21-t4-p1',
      questionType: 'note_completion',
      title: 'Questions 11–13',
      instructions: `Complete the notes below.\n\nChoose ONE WORD ONLY from the passage for each answer.`,
      startQuestionNumber: 11,
      endQuestionNumber: 13,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Cooking with biogas in Dunga\n\nBenefits for the women in the village of cooking with biogas:\n• no need for them to spend so much [11] collecting fuel\n• they can focus on different tasks that bring in [12]\n• they are less likely to experience certain diseases connected to burning wood\n\nDrawbacks of changing to biogas:\n• the [13] of the digesters is beyond the reach of most villages`,
      questions: [
        {
          id: 'c21-t4-q11',
          questionNumber: 11,
          prompt: 'no need for them to spend so much [11] collecting fuel',
          answerKey: 'time',
          explanation: `Besides, they don’t have to devote a lot of time every day to gathering firewood, which is a great relief.`,
          evidenceQuote: `they don't have to devote a lot of time every day to gathering firewood`,
          paragraphRef: '9',
        },
        {
          id: 'c21-t4-q12',
          questionNumber: 12,
          prompt: 'they can focus on different tasks that bring in [12]',
          answerKey: 'money',
          acceptedAlternatives: ['income'],
          explanation: `As a result, they’re able to make more money for their families from other enterprises.`,
          evidenceQuote: `they're able to make more money for their families from other enterprises.`,
          paragraphRef: '9',
        },
        {
          id: 'c21-t4-q13',
          questionNumber: 13,
          prompt: 'the [13] of the digesters is beyond the reach of most villages',
          answerKey: 'price',
          acceptedAlternatives: ['cost'],
          explanation: `But unless the price of the machines drops, it’s pretty clear that most communities will never be able to afford any, since they sell for about $750.`,
          evidenceQuote: `unless the price of the machines drops, it's pretty clear that most communities will never be able to afford any`,
          paragraphRef: '11',
        },
      ],
    },

    // PASSAGE 2: Questions 14-19 (Summary Completion with Options A-J)
    {
      id: 'c21-t4-g4',
      passageId: 'c21-t4-p2',
      questionType: 'summary_completion_options',
      title: 'Questions 14–19',
      instructions: `Complete the summary using the list of words, A–J, below.\n\nChoose the correct letter, A–J, in boxes 14–19 on your answer sheet.`,
      startQuestionNumber: 14,
      endQuestionNumber: 19,
      optionsList: [
        { key: 'A', text: 'basic outlook' },
        { key: 'B', text: 'employment opportunities' },
        { key: 'C', text: 'wealthy visitors' },
        { key: 'D', text: 'distant country' },
        { key: 'E', text: 'primary objective' },
        { key: 'F', text: 'similar advantages' },
        { key: 'G', text: 'thriving economy' },
        { key: 'H', text: 'nearby district' },
        { key: 'I', text: 'dense population' },
        { key: 'J', text: 'new immigrants' },
      ],
      contentWithGaps: `Multilingualism in Delhi\n\nThe city of Delhi has a [14] and as you walk through its streets you hear people speaking a variety of languages. Some of them have spent their entire life in Delhi, while others are [15]. Whether they have come from a [16] or have travelled from the other side of India, they have all come in search of things such as improved [17].\n\nA team of researchers led by Professor Ianthi Tsimpli of Cambridge University is collecting data on primary-age schoolchildren in Delhi and other Indian cities. The [18] of the research is to discover why multilingual Indian schoolchildren do not experience [19] to those that multilingual schoolchildren in Europe experience.`,
      questions: [
        {
          id: 'c21-t4-q14',
          questionNumber: 14,
          prompt: 'The city of Delhi has a [14] and as you walk through its streets you hear people speaking a variety of languages.',
          answerKey: 'I',
          explanation: `The crowded and bustling streets of Delhi teem with life... more than 20 million people go about their daily lives (dense population).`,
          evidenceQuote: `The crowded and bustling streets of Delhi teem with life... more than 20 million people go about their daily lives.`,
          paragraphRef: '1',
        },
        {
          id: 'c21-t4-q15',
          questionNumber: 15,
          prompt: 'Some of them have spent their entire life in Delhi, while others are [15].',
          answerKey: 'J',
          explanation: `Many were born and raised here, and many millions more have recently made India’s capital their home, having moved from surrounding neighbourhoods, cities and states (new immigrants).`,
          evidenceQuote: `many millions more have recently made India's capital their home, having moved from surrounding neighbourhoods, cities and states or across the country`,
          paragraphRef: '1',
        },
        {
          id: 'c21-t4-q16',
          questionNumber: 16,
          prompt: 'Whether they have come from a [16] or have travelled from the other side of India',
          answerKey: 'H',
          explanation: `having moved from surrounding neighbourhoods, cities and states or across the country (nearby district).`,
          evidenceQuote: `having moved from surrounding neighbourhoods, cities and states or across the country`,
          paragraphRef: '1',
        },
        {
          id: 'c21-t4-q17',
          questionNumber: 17,
          prompt: 'they have all come in search of things such as improved [17].',
          answerKey: 'B',
          explanation: `often in the hope of gaining better jobs and a better life (employment opportunities).`,
          evidenceQuote: `often in the hope of gaining better jobs and a better life.`,
          paragraphRef: '1',
        },
        {
          id: 'c21-t4-q18',
          questionNumber: 18,
          prompt: 'The [18] of the research is to discover why multilingual Indian schoolchildren...',
          answerKey: 'E',
          explanation: `The overriding aim of the four-year project, called ‘Multilingualism and Multiliteracy’, is to find out why (primary objective).`,
          evidenceQuote: `The overriding aim of the four-year project, called 'Multilingualism and Multiliteracy', is to find out why`,
          paragraphRef: '2',
        },
        {
          id: 'c21-t4-q19',
          questionNumber: 19,
          prompt: 'do not experience [19] to those that multilingual schoolchildren in Europe experience.',
          answerKey: 'F',
          explanation: `the many benefits of speaking more than one language, observed in schools in Europe for instance, do not apply to many of India’s schoolchildren (similar advantages).`,
          evidenceQuote: `the many benefits of speaking more than one language, observed in schools in Europe for instance, do not apply to many of India's schoolchildren.`,
          paragraphRef: '2',
        },
      ],
    },

    // PASSAGE 2: Questions 20-23 (Yes / No / Not Given)
    {
      id: 'c21-t4-g5',
      passageId: 'c21-t4-p2',
      questionType: 'yes_no_not_given',
      title: 'Questions 20–23',
      instructions: `Do the following statements agree with the claims of the writer in Reading Passage 2?\n\nIn boxes 20–23 on your answer sheet, choose:\nYES\tif the statement agrees with the claims of the writer\nNO\tif the statement contradicts the claims of the writer\nNOT GIVEN\tif it is impossible to say what the writer thinks about this`,
      startQuestionNumber: 20,
      endQuestionNumber: 23,
      questions: [
        {
          id: 'c21-t4-q20',
          questionNumber: 20,
          prompt: 'Ten-year-old Indian schoolchildren tend to perform better in literacy tests than in numeracy tests.',
          answerKey: 'NO',
          explanation: `Over 50% cannot read fluently (literacy task failure) while just under 50% cannot solve subtraction (numeracy failure), meaning performance in literacy is not better.`,
          evidenceQuote: `over 50% of children in Standard 5 [ten-year-olds] cannot read a Standard 2 [seven-year-olds] task fluently, and just under 50% of them cannot solve a Standard 2 subtraction task`,
          paragraphRef: '3',
        },
        {
          id: 'c21-t4-q21',
          questionNumber: 21,
          prompt: 'Tsimpli had problems convincing some female students to take part in the study.',
          answerKey: 'NOT GIVEN',
          explanation: `The text states dropping out disproportionately affects female students, but does not claim Tsimpli faced problems convincing female students to participate in the study.`,
          evidenceQuote: `She explains that low educational achievement can lead to many of these students dropping out of school - a problem disproportionately affecting female students.`,
          paragraphRef: '3',
        },
        {
          id: 'c21-t4-q22',
          questionNumber: 22,
          prompt: 'Tsimpli and her team wanted to know if there is a connection between poor academic performance and being taught in an unfamiliar language.',
          answerKey: 'YES',
          explanation: `Tsimpli and her colleagues are investigating whether these low learning outcomes could be caused by an Indian school system where the language that children are taught in often differs from the language used at home.`,
          evidenceQuote: `Tsimpli and her colleagues are investigating whether these low learning outcomes could be caused by an Indian school system where the language that children are taught in often differs from the language used at home.`,
          paragraphRef: '4',
        },
        {
          id: 'c21-t4-q23',
          questionNumber: 23,
          prompt: 'The researchers have decided against investigating the impact teaching methodology may have on learning outcomes.',
          answerKey: 'NO',
          explanation: `The text explicitly contradicts this: 'They intend to look not only at test results, but also at variables such as the standard of schooling, the environment and the teaching practices themselves.'`,
          evidenceQuote: `They intend to look not only at test results, but also at variables such as the standard of schooling, the environment and the teaching practices themselves.`,
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 2: Questions 24-26 (Multiple Choice Single)
    {
      id: 'c21-t4-g6',
      passageId: 'c21-t4-p2',
      questionType: 'multiple_choice_single',
      title: 'Questions 24–26',
      instructions: `Choose the correct letter, A, B, C or D.\n\nIn boxes 24–26 on your answer sheet, choose the correct letter.`,
      startQuestionNumber: 24,
      endQuestionNumber: 26,
      questions: [
        {
          id: 'c21-t4-q24',
          questionNumber: 24,
          prompt: 'What point does the writer make about primary schools in India in the sixth paragraph?',
          options: [
            { key: 'A', text: 'Exposure to English outside of school is of limited benefit.' },
            { key: 'B', text: 'Children learn English more easily when they are well motivated.' },
            { key: 'C', text: 'Poor children may be disadvantaged further by being instructed in English.' },
            { key: 'D', text: 'There is little consistency across schools with regard to instruction in English.' },
          ],
          answerKey: 'C',
          explanation: `According to Tsimpli, English instruction for children from low socio-economic areas might not be the best way for them to learn, holding back those with little familiarity.`,
          evidenceQuote: `most of the evidence from this and other projects shows that English instruction for children from low socio-economic areas might not be the best way for them to learn`,
          paragraphRef: '6',
        },
        {
          id: 'c21-t4-q25',
          questionNumber: 25,
          prompt: `What is Tsimpli suggesting when she uses the phrase 'that ship has sailed'?`,
          options: [
            { key: 'A', text: 'The findings of the report may be of little help to some Indian schoolchildren.' },
            { key: 'B', text: 'Instruction in English could be better adapted to the needs of schoolchildren.' },
            { key: 'C', text: 'Schools have had limited success in teaching English as a separate subject.' },
            { key: 'D', text: 'It is too late to remove English completely as a language of instruction in schools.' },
          ],
          answerKey: 'D',
          explanation: `Tsimpli clarifies: 'We are not suggesting that English be withdrawn - that ship has sailed - but we perhaps have to think more about learner needs.' This signifies it is too late to reverse or remove English completely.`,
          evidenceQuote: `We are not suggesting that English be withdrawn - that ship has sailed - but we perhaps have to think more about learner needs.`,
          paragraphRef: '7',
        },
        {
          id: 'c21-t4-q26',
          questionNumber: 26,
          prompt: 'In the eighth paragraph, what do we learn has surprised researchers?',
          options: [
            { key: 'A', text: 'Boys and girls from low socio-economic groups have similar general intelligence levels.' },
            { key: 'B', text: 'The age at which children move into a slum does not affect their academic performance.' },
            { key: 'C', text: 'Slum children and children from other urban poor backgrounds have similar life experiences.' },
            { key: 'D', text: 'The literacy and numeracy skills of slum children are not lower than those of children from other urban poor backgrounds.' },
          ],
          answerKey: 'D',
          explanation: `An unanticipated finding was that children from slum backgrounds do not lag behind children from other urban poor backgrounds and in some cases outperform them in numeracy and literacy.`,
          evidenceQuote: `an unanticipated finding has been that children from slum backgrounds do not seem to lag behind children from other urban poor backgrounds - and in some cases outperform them (e.g. in numeracy and literacy tasks).`,
          paragraphRef: '8',
        },
      ],
    },

    // PASSAGE 3: Questions 27-32 (Summary Completion with Options A-J)
    {
      id: 'c21-t4-g7',
      passageId: 'c21-t4-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 27–32',
      instructions: `Complete the summary using the list of words, A–J, below.\n\nChoose the correct letter, A–J, in boxes 27–32 on your answer sheet.`,
      startQuestionNumber: 27,
      endQuestionNumber: 32,
      optionsList: [
        { key: 'A', text: 'educational use' },
        { key: 'B', text: 'rare materials' },
        { key: 'C', text: 'inferior makes' },
        { key: 'D', text: 'product exchange markets' },
        { key: 'E', text: 'necessary skills' },
        { key: 'F', text: 'international' },
        { key: 'G', text: 'challenging task' },
        { key: 'H', text: 'memorable object' },
        { key: 'I', text: 'internet purchase' },
        { key: 'J', text: 'numerous problems' },
      ],
      contentWithGaps: `A birthday gift\n\nPeter Bellerby's plan to give his father a globe for his birthday was an unexpectedly [27] for which he had to overcome [28]. He soon learnt that a straightforward [29] would not be possible. Some [30] that had been intended for [31] were available, as were some expensive antique globes, but these were beyond his budget. He even travelled to places where people might still have the [32], but Bellerby could not find what he wanted.`,
      questions: [
        {
          id: 'c21-t4-q27',
          questionNumber: 27,
          prompt: `Peter Bellerby's plan to give his father a globe for his birthday was an unexpectedly [27]...`,
          answerKey: 'G',
          explanation: `What seemed simple enough to start with triggered an almost obsessive, decade-long journey marked by obstacles (challenging task).`,
          evidenceQuote: `What seemed simple enough to start with triggered an almost obsessive, decade-long journey, marked by a series of obstacles`,
          paragraphRef: '1',
        },
        {
          id: 'c21-t4-q28',
          questionNumber: 28,
          prompt: 'for which he had to overcome [28].',
          answerKey: 'J',
          explanation: `In the process, almost everything that could possibly go wrong did so (numerous problems).`,
          evidenceQuote: `In the process, almost everything that could possibly go wrong did so.`,
          paragraphRef: '4',
        },
        {
          id: 'c21-t4-q29',
          questionNumber: 29,
          prompt: 'He soon learnt that a straightforward [29] would not be possible.',
          answerKey: 'I',
          explanation: `obtaining such a globe was not simply a matter of a quick online order (internet purchase).`,
          evidenceQuote: `obtaining such a globe was not simply a matter of a quick online order`,
          paragraphRef: '2',
        },
        {
          id: 'c21-t4-q30',
          questionNumber: 30,
          prompt: 'Some [30] that had been intended for [31] were available,',
          answerKey: 'C',
          explanation: `Bellerby came across shoddy commercial versions (inferior makes).`,
          evidenceQuote: `Bellerby came across shoddy commercial versions designed for school classrooms`,
          paragraphRef: '3',
        },
        {
          id: 'c21-t4-q31',
          questionNumber: 31,
          prompt: 'that had been intended for [31] were available,',
          answerKey: 'A',
          explanation: `designed for school classrooms (educational use).`,
          evidenceQuote: `designed for school classrooms`,
          paragraphRef: '3',
        },
        {
          id: 'c21-t4-q32',
          questionNumber: 32,
          prompt: 'He even travelled to places where people might still have the [32], but Bellerby could not find what he wanted.',
          answerKey: 'E',
          explanation: `Even his trips to Morocco and India, where surely the knowledge of artisan cartographers had been preserved, drew a blank (necessary skills).`,
          evidenceQuote: `where surely the knowledge of artisan cartographers* had been preserved, drew a blank.`,
          paragraphRef: '3',
        },
      ],
    },

    // PASSAGE 3: Questions 33-36 (Yes / No / Not Given)
    {
      id: 'c21-t4-g8',
      passageId: 'c21-t4-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 33–36',
      instructions: `Do the following statements agree with the claims of the writer in Reading Passage 3?\n\nIn boxes 33–36 on your answer sheet, choose:\nYES\tif the statement agrees with the claims of the writer\nNO\tif the statement contradicts the claims of the writer\nNOT GIVEN\tif it is impossible to say what the writer thinks about this`,
      startQuestionNumber: 33,
      endQuestionNumber: 36,
      questions: [
        {
          id: 'c21-t4-q33',
          questionNumber: 33,
          prompt: 'The assumption today that people in the past knew very little about geography is correct.',
          answerKey: 'NO',
          explanation: `The author contradicts this: 'After all, contrary to stubbornly held popular views of our ancestors' geographical ignorance, we have known that the world is spherical since at least the 6th century BCE.'`,
          evidenceQuote: `contrary to stubbornly held popular views of our ancestors' geographical ignorance, we have known that the world is spherical since at least the 6th century BCE.`,
          paragraphRef: '2',
        },
        {
          id: 'c21-t4-q34',
          questionNumber: 34,
          prompt: 'Plato was criticised for saying the world was shaped like a leather ball.',
          answerKey: 'NOT GIVEN',
          explanation: `The passage states Plato likened it to a leather ball in Phaedo, but gives no indication that he was criticised for doing so.`,
          evidenceQuote: `The ancient Greek philosopher Plato in his work Phaedo likened it to a leather ball`,
          paragraphRef: '2',
        },
        {
          id: 'c21-t4-q35',
          questionNumber: 35,
          prompt: 'The globe made by Crates of Mallus was an accurate representation of the known world.',
          answerKey: 'NOT GIVEN',
          explanation: `The passage notes Crates of Mallus has the accolade of producing the first recorded globe in around 150 BCE, but never remarks on whether it was accurate.`,
          evidenceQuote: `the accolade of producing the first recorded globe goes to the ancient Greek philosopher Crates of Mallus, who is said to have made one in around 150 BCE.`,
          paragraphRef: '2',
        },
        {
          id: 'c21-t4-q36',
          questionNumber: 36,
          prompt: 'Bellerby assumed he would have few problems locating a well-made globe.',
          answerKey: 'YES',
          explanation: `The text explicitly says: 'Surely, Bellerby reasoned, a good-quality globe wouldn't be difficult to find.'`,
          evidenceQuote: `Surely, Bellerby reasoned, a good-quality globe wouldn't be difficult to find.`,
          paragraphRef: '2',
        },
      ],
    },

    // PASSAGE 3: Questions 37-40 (Multiple Choice Single)
    {
      id: 'c21-t4-g9',
      passageId: 'c21-t4-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 37–40',
      instructions: `Choose the correct letter, A, B, C or D.\n\nIn boxes 37–40 on your answer sheet, choose the correct letter.`,
      startQuestionNumber: 37,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c21-t4-q37',
          questionNumber: 37,
          prompt: 'When Bellerby had to attach the gores to the globe surface,',
          options: [
            { key: 'A', text: 'he decided it was best to work quickly.' },
            { key: 'B', text: 'he became aware of an unexpected issue.' },
            { key: 'C', text: 'he was worried about the quality of his materials.' },
            { key: 'D', text: 'he nearly gave up the whole project.' },
          ],
          answerKey: 'B',
          explanation: `Right at the end of attaching the gores, he learnt that the paper had stretched slightly and so the final one overlapped the first by a centimetre (an unexpected issue).`,
          evidenceQuote: `Right at the end of the process, he learnt that the paper had stretched slightly and so the final one overlapped the first by a centimetre`,
          paragraphRef: '5',
        },
        {
          id: 'c21-t4-q38',
          questionNumber: 38,
          prompt: 'The reviewer mentions other globe makers of the past because',
          options: [
            { key: 'A', text: 'Bellerby was particularly inspired by them.' },
            { key: 'B', text: 'their achievements are not widely known.' },
            { key: 'C', text: 'Bellerby had something in common with each of them.' },
            { key: 'D', text: 'their difficulties could have been avoided.' },
          ],
          answerKey: 'C',
          explanation: `Bellerby found a kindred spirit in Martin Behaim, and something of his ambition is reflected in the heroic efforts of Vincenzo Coronelli (shared traits/parallels).`,
          evidenceQuote: `Bellerby clearly found a kindred spirit in Martin Behaim... Something of Bellerby's unflinching ambition is reflected in the even more heroic efforts of the Italian cartographer Vincenzo Coronelli`,
          paragraphRef: '6',
        },
        {
          id: 'c21-t4-q39',
          questionNumber: 39,
          prompt: 'What point is made about Bellerby in the seventh paragraph?',
          options: [
            { key: 'A', text: 'He had long working relationships with numerous craftsmen.' },
            { key: 'B', text: 'He understands the lack of interest in traditional crafts.' },
            { key: 'C', text: 'He appreciates the importance of careful planning.' },
            { key: 'D', text: 'He regrets the loss of many globe-making skills.' },
          ],
          answerKey: 'D',
          explanation: `The book is 'also a lament for the fading away of centuries-old traditions... many of these have now retired or passed away' (regrets the loss of skills).`,
          evidenceQuote: `Bellerby's book is also a lament for the fading away of centuries-old traditions. When he embarked on his globemaking odyssey, he struggled to find artisans with the skills`,
          paragraphRef: '7',
        },
        {
          id: 'c21-t4-q40',
          questionNumber: 40,
          prompt: `What does the reviewer say about Bellerby's book in the final paragraph?`,
          options: [
            { key: 'A', text: 'It does not tell you how to create a profitable business.' },
            { key: 'B', text: 'It overlooks some important mapmakers.' },
            { key: 'C', text: 'It fails to discuss the future of globe-making.' },
            { key: 'D', text: 'It does not give enough details about individual customers.' },
          ],
          answerKey: 'A',
          explanation: `The reviewer states the book 'is hardly a blueprint for commercial success' (it does not tell you how to create a profitable business).`,
          evidenceQuote: `is hardly a blueprint for commercial success.`,
          paragraphRef: '8',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 21 Academic Reading Test 4',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export function ingestCambridge21Test4(authorId?: string): {
  testId: string;
  versionId: string;
  status: string;
  totalQuestions: number;
} {
  const data = getCambridge21Test4Data();

  // Validate the data first
  const validationErrors = validateTestVersion(data.passages, data.questionGroups);
  if (validationErrors.length > 0) {
    throw new Error(`Validation failed for Cambridge 21 Test 4:\n${validationErrors.join('\n')}`);
  }

  // Get author id (fallback to admin user)
  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = db.prepare(`SELECT id FROM users WHERE role = 'admin' LIMIT 1`).get() as any;
    if (adminUser) {
      resolvedAuthorId = adminUser.id;
    } else {
      const anyUser = db.prepare(`SELECT id FROM users LIMIT 1`).get() as any;
      resolvedAuthorId = anyUser ? anyUser.id : 'system-admin';
    }
  }

  // Check if Cambridge IELTS 21 Academic Reading Test 4 already exists
  const existing = db
    .prepare(`SELECT id FROM reading_tests WHERE title = ?`)
    .get(data.title) as any;

  const now = new Date().toISOString();
  let testId: string;
  let versionId: string;

  if (existing) {
    testId = existing.id;
    versionId = uuidv4();

    // Get current version number
    const maxVer = db
      .prepare(`SELECT MAX(version_number) as max_v FROM reading_test_versions WHERE test_id = ?`)
      .get(testId) as any;
    const nextVer = (maxVer?.max_v || 0) + 1;

    db.prepare(`
      INSERT INTO reading_test_versions (
        id, test_id, version_number, status, passages_json,
        question_groups_json, total_questions, validation_errors_json, published_at, created_at
      ) VALUES (?, ?, ?, 'published', ?, ?, ?, '[]', ?, ?)
    `).run(
      versionId,
      testId,
      nextVer,
      JSON.stringify(data.passages),
      JSON.stringify(data.questionGroups),
      40,
      now,
      now
    );

    db.prepare(`
      UPDATE reading_tests
      SET current_version_number = ?,
          status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(nextVer, now, testId);
  } else {
    testId = uuidv4();
    versionId = uuidv4();

    db.prepare(`
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

    db.prepare(`
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
