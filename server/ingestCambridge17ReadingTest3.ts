import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge17ReadingTest3Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c17-r3-p1',
      passageNumber: 1,
      title: 'The thylacine',
      subtitle:
        'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c17-r3-p1-1',
          label: '1',
          content: `The extinct thylacine, also known as the Tasmanian tiger, was a marsupial* that bore a superficial resemblance to a dog. Its most distinguishing feature was the 13–19 dark brown stripes over its back, beginning at the rear of the body and extending onto the tail. The thylacine's average nose-to-tail length for adult males was 162.6 cm, compared to 153.7 cm for females.`,
        },
        {
          id: 'c17-r3-p1-2',
          label: '2',
          content: `The thylacine appeared to occupy most types of terrain except dense rainforest, with open eucalyptus forest thought to be its prime habitat. In terms of feeding, it was exclusively carnivorous, and its stomach was muscular with an ability to distend so that it could eat large amounts of food at one time, probably an adaptation to compensate for long periods when hunting was unsuccessful and food scarce. The thylacine was not a fast runner and probably caught its prey by exhausting it during a long pursuit. During long-distance chases, thylacines were likely to have relied more on scent than any other sense. They emerged to hunt during the evening, night and early morning and tended to retreat to the hills and forest for shelter during the day. Despite the common name 'tiger', the thylacine had a shy, nervous temperament. Although mainly nocturnal, it was sighted moving during the day and some individuals were even recorded basking in the sun.`,
        },
        {
          id: 'c17-r3-p1-3',
          label: '3',
          content: `The thylacine had an extended breeding season from winter to spring, with indications that some breeding took place throughout the year. The thylacine, like all marsupials, was tiny and hairless when born. Newborns crawled into the pouch on the belly of their mother, and attached themselves to one of the four teats, remaining there for up to three months. When old enough to leave the pouch, the young stayed in a lair such as a deep rocky cave, well-hidden nest or hollow log, whilst the mother hunted.`,
        },
        {
          id: 'c17-r3-p1-4',
          label: '4',
          content: `Approximately 4,000 years ago, the thylacine was widespread throughout New Guinea and most of mainland Australia, as well as the island of Tasmania. The most recent, well-dated occurrence of a thylacine on the mainland is a carbon-dated fossil from Murray Cave in Western Australia, which is around 3,100 years old. Its extinction coincided closely with the arrival of wild dogs called dingoes in Australia and a similar predator in New Guinea. Dingoes never reached Tasmania, and most scientists see this as the main reason for the thylacine's survival there.\n\n* marsupial: a mammal, such as a kangaroo, whose young are born incompletely developed and are typically carried and suckled in a pouch on the mother's belly`,
        },
        {
          id: 'c17-r3-p1-5',
          label: '5',
          content: `The dramatic decline of the thylacine in Tasmania, which began in the 1830s and continued for a century, is generally attributed to the relentless efforts of sheep farmers and bounty hunters** with shotguns. While this determined campaign undoubtedly played a large part, it is likely that various other factors also contributed to the decline and eventual extinction of the species. These include competition with wild dogs introduced by European settlers, loss of habitat along with the disappearance of prey species, and a distemper-like disease which may also have affected the thylacine.`,
        },
        {
          id: 'c17-r3-p1-6',
          label: '6',
          content: `There was only one successful attempt to breed a thylacine in captivity, at Melbourne Zoo in 1899. This was despite the large numbers that went through some zoos, particularly London Zoo and Tasmania's Hobart Zoo. The famous naturalist John Gould foresaw the thylacine's demise when he published his Mammals of Australia between 1848 and 1863, writing, 'The numbers of this singular animal will speedily diminish, extermination will have its full sway, and it will then, like the wolf of England and Scotland, be recorded as an animal of the past.'`,
        },
        {
          id: 'c17-r3-p1-7',
          label: '7',
          content: `However, there seems to have been little public pressure to preserve the thylacine, nor was much concern expressed by scientists at the decline of this species in the decades that followed. A notable exception was T.T. Flynn, Professor of Biology at the University of Tasmania. In 1914, he was sufficiently concerned about the scarcity of the thylacine to suggest that some should be captured and placed on a small island. But it was not until 1929, with the species on the very edge of extinction, that Tasmania's Animals and Birds Protection Board passed a motion protecting thylacines only for the month of December, which was thought to be their prime breeding season.`,
        },
        {
          id: 'c17-r3-p1-8',
          label: '8',
          content: `The last known wild thylacine to be killed was shot by a farmer in the north-east of Tasmania in 1930, leaving just captive specimens. Official protection of the species by the Tasmanian government was introduced in July 1936, 59 days before the last known individual died in Hobart Zoo on 7th September, 1936.`,
        },
        {
          id: 'c17-r3-p1-9',
          label: '9',
          content: `There have been numerous expeditions and searches for the thylacine over the years, none of which has produced definitive evidence that thylacines still exist. The species was declared extinct by the Tasmanian government in 1986.\n\n** bounty hunters: people who are paid a reward for killing a wild animal`,
        },
      ],
    },
    {
      id: 'c17-r3-p2',
      passageNumber: 2,
      title: 'Palm oil',
      subtitle:
        'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c17-r3-p2-A',
          label: 'A',
          content: `Palm oil is an edible oil derived from the fruit of the African oil palm tree, and is currently the most consumed vegetable oil in the world. It's almost certainly in the soap we wash with in the morning, the sandwich we have for lunch, and the biscuits we snack on during the day. Why is palm oil so attractive for manufacturers? Primarily because its unique properties – such as remaining solid at room temperature – make it an ideal ingredient for long-term preservation, allowing many packaged foods on supermarket shelves to have 'best before' dates of months, even years, into the future.`,
        },
        {
          id: 'c17-r3-p2-B',
          label: 'B',
          content: `Many farmers have seized the opportunity to maximise the planting of oil palm trees. Between 1990 and 2012, the global land area devoted to growing oil palm trees grew from 6 to 17 million hectares, now accounting for around ten percent of total cropland in the entire world. From a mere two million tonnes of palm oil being produced annually globally 50 years ago, there are now around 60 million tonnes produced every single year, a figure looking likely to double or even triple by the middle of the century.`,
        },
        {
          id: 'c17-r3-p2-C',
          label: 'C',
          content: `However, there are multiple reasons why conservationists cite the rapid spread of oil palm plantations as a major concern. There are countless news stories of deforestation, habitat destruction and dwindling species populations, all as a direct result of land clearing to establish oil palm tree monoculture on an industrial scale, particularly in Malaysia and Indonesia. Endangered species – most famously the Sumatran orangutan, but also rhinos, elephants, tigers, and numerous other fauna – have suffered from the unstoppable spread of oil palm plantations.`,
        },
        {
          id: 'c17-r3-p2-D',
          label: 'D',
          content: `'Palm oil is surely one of the greatest threats to global biodiversity,' declares Dr Farnon Ellwood of the University of the West of England, Bristol. 'Palm oil is replacing rainforest, and rainforest is where all the species are. That's a problem.' This has led to some radical questions among environmentalists, such as whether consumers should try to boycott palm oil entirely.\n\nMeanwhile Bhavani Shankar, Professor at London's School of Oriental and African Studies, argues, 'It's easy to say that palm oil is the enemy and we should be against it. It makes for a more dramatic story, and it's very intuitive. But given the complexity of the argument, I think a much more nuanced story is closer to the truth.'`,
        },
        {
          id: 'c17-r3-p2-E',
          label: 'E',
          content: `One response to the boycott movement has been the argument for the vital role palm oil plays in lifting many millions of people in the developing world out of poverty. Is it desirable to have palm oil boycotted, replaced, eliminated from the global supply chain, given how many low-income people in developing countries depend on it for their livelihoods? How best to strike a utilitarian balance between these competing factors has become a serious bone of contention.`,
        },
        {
          id: 'c17-r3-p2-F',
          label: 'F',
          content: `Even the deforestation argument isn't as straightforward as it seems. Oil palm plantations produce at least four and potentially up to ten times more oil per hectare than soybean, rapeseed, sunflower or other competing oils. That immensely high yield – which is predominantly what makes it so profitable – is potentially also an ecological benefit. If ten times more palm oil can be produced from a patch of land than any competing oil, then ten times more land would need to be cleared in order to produce the same volume of oil from that competitor.\n\nAs for the question of carbon emissions, the issue really depends on what oil palm trees are replacing. Crops vary in the degree to which they sequester carbon – in other words, the amount of carbon they capture from the atmosphere and store within the plant. The more carbon a plant sequesters, the more it reduces the effect of climate change. As Shankar explains: '[Palm oil production] actually sequesters more carbon in some ways than other alternatives. […] Of course, if you're cutting down virgin forest it's terrible – that's what's happening in Indonesia and Malaysia, it's been allowed to get out of hand. But if it's replacing rice, for example, it might actually sequester more carbon.'`,
        },
        {
          id: 'c17-r3-p2-G',
          label: 'G',
          content: `The industry is now regulated by a group called the Roundtable on Sustainable Palm Oil (RSPO), consisting of palm growers, retailers, product manufacturers, and other interested parties. Over the past decade or so, an agreement has gradually been reached regarding standards that producers of palm oil have to meet in order for their product to be regarded as officially 'sustainable'. The RSPO insists upon no virgin forest clearing, transparency and regular assessment of carbon stocks, among other criteria. Only once these requirements are fully satisfied is the oil allowed to be sold as certified sustainable palm oil (CSPO). Recent figures show that the RSPO now certifies around 12 million tonnes of palm oil annually, equivalent to roughly 21 percent of the world's total palm oil production.`,
        },
        {
          id: 'c17-r3-p2-H',
          label: 'H',
          content: `There is even hope that oil palm plantations might not need to be such sterile monocultures, or 'green deserts', as Ellwood describes them. New research at Ellwood's lab hints at one plant which might make all the difference. The bird's nest fern (Asplenium nidus) grows on trees in an epiphytic fashion (meaning it's dependent on the tree only for support, not for nutrients), and is native to many tropical regions, where as a keystone species it performs a vital ecological role. Ellwood believes that reintroducing the bird's nest fern into oil palm plantations could potentially allow these areas to recover their biodiversity, providing a home for all manner of species, from fungi and bacteria, to invertebrates such as insects, amphibians, reptiles and even mammals.`,
        },
      ],
    },
    {
      id: 'c17-r3-p3',
      passageNumber: 3,
      title: "Building the Skyline: The Birth and Growth of Manhattan's Skyscrapers",
      subtitle:
        'Katharine L. Shester reviews a book by Jason Barr about the development of New York City',
      paragraphs: [
        {
          id: 'c17-r3-p3-1',
          label: '1',
          content: `In Building the Skyline, Jason Barr takes the reader through a detailed history of New York City. The book combines geology, history, economics, and a lot of data to explain why business clusters developed where they did and how the early decisions of workers and firms shaped the skyline we see today. Building the Skyline is organized into two distinct parts. The first is primarily historical and addresses New York's settlement and growth from 1609 to 1900; the second deals primarily with the 20th century and is a compilation of chapters commenting on different aspects of New York's urban development. The tone and organization of the book changes somewhat between the first and second parts, as the latter chapters incorporate aspects of Barr's related research papers.`,
        },
        {
          id: 'c17-r3-p3-2',
          label: '2',
          content: `Barr begins chapter one by taking the reader on a 'helicopter time-machine' ride – giving a fascinating account of how the New York landscape in 1609 might have looked from the sky. He then moves on to a subterranean walking tour of the city, indicating the location of rock and water below the subsoil, before taking the reader back to the surface. His love of the city comes through as he describes various fun facts about the location of the New York residence of early 19th-century vice-president Aaron Burr as well as a number of legends about the city.`,
        },
        {
          id: 'c17-r3-p3-3',
          label: '3',
          content: `Chapters two and three take the reader up to the Civil War (1861–1865), with chapter two focusing on the early development of land and the implementation of a grid system in 1811. Chapter three focuses on land use before the Civil War. Both chapters are informative and well researched and set the stage for the economic analysis that comes later in the book. I would have liked Barr to expand upon his claim that existing tenements* prevented skyscrapers in certain neighborhoods because 'likely no skyscraper developer was interested in performing the necessary "slum clearance"'. Later in the book, Barr makes the claim that the depth of bedrock** was not a limiting factor for developers, as foundation costs were a small fraction of the cost of development. At first glance, it is not obvious why slum clearance would be limiting, while more expensive foundations would not.\n\n* a tenement: a multi-occupancy building of any sort, but particularly a run-down apartment building or slum building\n** bedrock: the solid, hard rock in the ground that lies under a loose layer of soil`,
        },
        {
          id: 'c17-r3-p3-4',
          label: '4',
          content: `Chapter four focuses on immigration and the location of neighborhoods and tenements in the late 19th century. Barr identifies four primary immigrant enclaves and analyzes their locations in terms of the amenities available in the area. Most of these enclaves were located on the least valuable land, between the industries located on the waterfront and the wealthy neighborhoods bordering Central Park.`,
        },
        {
          id: 'c17-r3-p3-5',
          label: '5',
          content: `Part two of the book begins with a discussion of the economics of skyscraper height. In chapter five, Barr distinguishes between engineering height, economic height, and developer height — where engineering height is the tallest building that can be safely made at a given time, economic height is the height that is most efficient from society's point of view, and developer height is the actual height chosen by the developer, who is attempting to maximize return on investment. Chapter five also has an interesting discussion of the technological advances that led to the construction of skyscrapers. For example, the introduction of iron and steel skeletal frames made thick, load-bearing walls unnecessary, expanding the usable square footage of buildings and increasing the use of windows and availability of natural light. Chapter six then presents data on building height throughout the 20th century and uses regression analysis to 'predict' building construction. While less technical than the research paper on which the chapter is based, it is probably more technical than would be preferred by a general audience.`,
        },
        {
          id: 'c17-r3-p3-6',
          label: '6',
          content: `Chapter seven tackles the 'bedrock myth', the assumption that the absence of bedrock close to the surface between Downtown and Midtown New York is the reason for skyscrapers not being built between the two urban centers. Rather, Barr argues that while deeper bedrock does increase foundation costs, these costs were neither prohibitively high nor were they large compared to the overall cost of building a skyscraper. What I enjoyed the most about this chapter was Barr's discussion of how foundations are actually built. He describes the use of caissons, which enable workers to dig down for considerable distances, often below the water table, until they reach bedrock. Barr's thorough technological history discusses not only how caissons work, but also the dangers involved. While this chapter references empirical research papers, it is a relatively easy read.`,
        },
        {
          id: 'c17-r3-p3-7',
          label: '7',
          content: `Chapters eight and nine focus on the birth of Midtown and the building boom of the 1920s. Chapter eight contains lengthy discussions of urban economic theory that may serve as a distraction to readers primarily interested in New York. However, they would be well-suited for undergraduates learning about the economics of cities. In the next chapter, Barr considers two of the primary explanations for the building boom of the 1920s — the first being exuberance, and the second being financing. He uses data to assess the viability of these two explanations and finds that supply and demand factors explain much of the development of the 1920s; though it enabled the boom, cheap credit was not, he argues, the primary cause.`,
        },
        {
          id: 'c17-r3-p3-8',
          label: '8',
          content: `In the final chapter (chapter 10), Barr discusses another of his empirical papers that estimates Manhattan land values from the mid-19th century to the present day. The data work that went into these estimations is particularly impressive. Toward the end of the chapter, Barr assesses 'whether skyscrapers are a cause or an effect of high land values'. He finds that changes in land values predict future building height, but the reverse is not true. The book ends with an epilogue, in which Barr discusses the impact of climate change on the city and makes policy suggestions for New York going forward.`,
        },
      ],
    },
  ];

  const MATCHING_INFO_OPTIONS_P2 = [
    { label: 'A', text: 'Section A' },
    { label: 'B', text: 'Section B' },
    { label: 'C', text: 'Section C' },
    { label: 'D', text: 'Section D' },
    { label: 'E', text: 'Section E' },
    { label: 'F', text: 'Section F' },
    { label: 'G', text: 'Section G' },
    { label: 'H', text: 'Section H' },
  ];

  const RSPO_MULTI_OPTIONS = [
    { label: 'A', text: 'Its membership has grown steadily over the course of the last decade.' },
    { label: 'B', text: 'It demands that certified producers be open and honest about their practices.' },
    { label: 'C', text: 'It took several years to establish its set of criteria for sustainable palm oil certification.' },
    { label: 'D', text: 'Its regulations regarding sustainability are stricter than those governing other industries.' },
    { label: 'E', text: 'It was formed at the request of environmentalists concerned about the loss of virgin forests.' },
  ];

  const MC_Q27_OPTIONS = [
    { label: 'A', text: 'It gives a highly original explanation for urban development.' },
    { label: 'B', text: 'Elements of Barr’s research papers are incorporated throughout the book.' },
    { label: 'C', text: 'Other books that are available on the subject have taken a different approach.' },
    { label: 'D', text: 'It covers a range of factors that affected the development of New York.' },
  ];

  const MC_Q28_OPTIONS = [
    { label: 'A', text: 'She describes the reasons for Barr’s interest.' },
    { label: 'B', text: 'She indicates a potential problem with Barr’s analysis.' },
    { label: 'C', text: 'She compares Barr’s conclusion with that of other writers.' },
    { label: 'D', text: 'She provides details about the sources Barr used for his research.' },
  ];

  const MC_Q29_OPTIONS = [
    { label: 'A', text: 'It contains conflicting data.' },
    { label: 'B', text: 'It focuses too much on possible trends.' },
    { label: 'C', text: 'It is too specialised for most readers.' },
    { label: 'D', text: 'It draws on research that is out of date.' },
  ];

  const MC_Q30_OPTIONS = [
    { label: 'A', text: 'The information should have been organised differently.' },
    { label: 'B', text: 'More facts are needed about the way construction was financed.' },
    { label: 'C', text: 'The explanation that is given for the building boom is unlikely.' },
    { label: 'D', text: 'Some parts will have limited appeal to certain people.' },
  ];

  const MC_Q31_OPTIONS = [
    { label: 'A', text: 'the broad time period that is covered' },
    { label: 'B', text: 'the interesting questions that Barr asks' },
    { label: 'C', text: 'the nature of the research into the topic' },
    { label: 'D', text: 'the recommendations Barr makes for the future' },
  ];

  const SUMMARY_OPTIONS_BOX_P3 = [
    { label: 'A', text: 'development plans' },
    { label: 'B', text: 'deep excavations' },
    { label: 'C', text: 'great distance' },
    { label: 'D', text: 'excessive expense' },
    { label: 'E', text: 'impossible tasks' },
    { label: 'F', text: 'associated risks' },
    { label: 'G', text: 'water level' },
    { label: 'H', text: 'specific areas' },
    { label: 'I', text: 'total expenditure' },
    { label: 'J', text: 'construction guidelines' },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-5 (Note Completion)
    {
      id: 'c17-r3-g1',
      passageId: 'c17-r3-p1',
      questionType: 'note_completion',
      title: 'Questions 1–5',
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–5 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 5,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `The thylacine

Appearance and behaviour
• looked rather like a dog
• had a series of stripes along its body and tail
• ate an entirely [[1]] diet
• probably depended mainly on [[2]] when hunting
• young spent first months of life inside its mother's [[3]]

Decline and extinction
• last evidence in mainland Australia is a 3,100-year-old [[4]]
• probably went extinct in mainland Australia due to animals known as dingoes
• reduction in [[5]] and available sources of food were partly responsible for decline in Tasmania`,
      questions: [
        {
          id: 'c17-r3-q1',
          questionNumber: 1,
          prompt: 'ate an entirely [1] diet',
          answerKey: 'carnivorous',
          acceptedAlternatives: ['carnivorous'],
          explanation:
            "Paragraph 2 states: 'In terms of feeding, it was exclusively carnivorous...' Exclusively carnivorous corresponds to an entirely carnivorous diet.",
          evidenceQuote: 'In terms of feeding, it was exclusively carnivorous',
          paragraphRef: '2',
        },
        {
          id: 'c17-r3-q2',
          questionNumber: 2,
          prompt: 'probably depended mainly on [2] when hunting',
          answerKey: 'scent',
          acceptedAlternatives: ['scent'],
          explanation:
            "Paragraph 2 states: 'During long-distance chases, thylacines were likely to have relied more on scent than any other sense.' Relying more on scent than any other sense means depending mainly on scent.",
          evidenceQuote: 'thylacines were likely to have relied more on scent than any other sense.',
          paragraphRef: '2',
        },
        {
          id: 'c17-r3-q3',
          questionNumber: 3,
          prompt: "young spent first months of life inside its mother's [3]",
          answerKey: 'pouch',
          acceptedAlternatives: ['pouch'],
          explanation:
            "Paragraph 3 states: 'Newborns crawled into the pouch on the belly of their mother, and attached themselves to one of the four teats, remaining there for up to three months.'",
          evidenceQuote:
            'Newborns crawled into the pouch on the belly of their mother, and attached themselves to one of the four teats, remaining there for up to three months.',
          paragraphRef: '3',
        },
        {
          id: 'c17-r3-q4',
          questionNumber: 4,
          prompt: 'last evidence in mainland Australia is a 3,100-year-old [4]',
          answerKey: 'fossil',
          acceptedAlternatives: ['fossil'],
          explanation:
            "Paragraph 4 states: 'The most recent, well-dated occurrence of a thylacine on the mainland is a carbon-dated fossil from Murray Cave in Western Australia, which is around 3,100 years old.'",
          evidenceQuote:
            'The most recent, well-dated occurrence of a thylacine on the mainland is a carbon-dated fossil from Murray Cave in Western Australia, which is around 3,100 years old.',
          paragraphRef: '4',
        },
        {
          id: 'c17-r3-q5',
          questionNumber: 5,
          prompt:
            'reduction in [5] and available sources of food were partly responsible for decline in Tasmania',
          answerKey: 'habitat',
          acceptedAlternatives: ['habitat'],
          explanation:
            "Paragraph 5 states: 'These include competition with wild dogs introduced by European settlers, loss of habitat along with the disappearance of prey species...' Loss of habitat corresponds to reduction in habitat.",
          evidenceQuote: 'loss of habitat along with the disappearance of prey species',
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 1: Questions 6-13 (True / False / Not Given)
    {
      id: 'c17-r3-g2',
      passageId: 'c17-r3-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 6–13',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\n\nIn boxes 6–13 on your answer sheet, write\n\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 6,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c17-r3-q6',
          questionNumber: 6,
          prompt:
            'Significant numbers of thylacines were killed by humans from the 1830s onwards.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 5 states: 'The dramatic decline of the thylacine in Tasmania, which began in the 1830s and continued for a century, is generally attributed to the relentless efforts of sheep farmers and bounty hunters with shotguns.'",
          evidenceQuote:
            'The dramatic decline of the thylacine in Tasmania, which began in the 1830s and continued for a century, is generally attributed to the relentless efforts of sheep farmers and bounty hunters with shotguns.',
          paragraphRef: '5',
        },
        {
          id: 'c17-r3-q7',
          questionNumber: 7,
          prompt: 'Several thylacines were born in zoos during the late 1800s.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 6 states: 'There was only one successful attempt to breed a thylacine in captivity, at Melbourne Zoo in 1899.' This contradicts the statement that several were born in zoos.",
          evidenceQuote:
            'There was only one successful attempt to breed a thylacine in captivity, at Melbourne Zoo in 1899.',
          paragraphRef: '6',
        },
        {
          id: 'c17-r3-q8',
          questionNumber: 8,
          prompt: "John Gould’s prediction about the thylacine surprised some biologists.",
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 6 mentions John Gould's prediction about the thylacine's demise, but nowhere does the text state whether or not his prediction surprised biologists.",
          evidenceQuote:
            'The famous naturalist John Gould foresaw the thylacine’s demise when he published his Mammals of Australia between 1848 and 1863...',
          paragraphRef: '6',
        },
        {
          id: 'c17-r3-q9',
          questionNumber: 9,
          prompt:
            'In the early 1900s, many scientists became worried about the possible extinction of the thylacine.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 7 states: 'nor was much concern expressed by scientists at the decline of this species in the decades that followed. A notable exception was T.T. Flynn...' Since concern was not widely expressed, this contradicts 'many scientists became worried'.",
          evidenceQuote:
            'nor was much concern expressed by scientists at the decline of this species in the decades that followed. A notable exception was T.T. Flynn',
          paragraphRef: '7',
        },
        {
          id: 'c17-r3-q10',
          questionNumber: 10,
          prompt:
            'T. T. Flynn’s proposal to rehome captive thylacines on an island proved to be impractical.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 7 states that in 1914 Flynn suggested some thylacines should be captured and placed on a small island, but does not provide information on whether this proposal was considered impractical or what happened to it.",
          evidenceQuote:
            'In 1914, he was sufficiently concerned about the scarcity of the thylacine to suggest that some should be captured and placed on a small island.',
          paragraphRef: '7',
        },
        {
          id: 'c17-r3-q11',
          questionNumber: 11,
          prompt:
            'There were still reasonable numbers of thylacines in existence when a piece of legislation protecting the species during their breeding season was passed.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 7 states: 'But it was not until 1929, with the species on the very edge of extinction, that Tasmania’s Animals and Birds Protection Board passed a motion protecting thylacines...' Being on the very edge of extinction contradicts there being reasonable numbers.",
          evidenceQuote:
            'But it was not until 1929, with the species on the very edge of extinction, that Tasmania’s Animals and Birds Protection Board passed a motion protecting thylacines',
          paragraphRef: '7',
        },
        {
          id: 'c17-r3-q12',
          questionNumber: 12,
          prompt: 'From 1930 to 1936, the only known living thylacines were all in captivity.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 8 states: 'The last known wild thylacine to be killed was shot by a farmer in the north-east of Tasmania in 1930, leaving just captive specimens. Official protection... was introduced in July 1936, 59 days before the last known individual died in Hobart Zoo on 7th September, 1936.'",
          evidenceQuote:
            'The last known wild thylacine to be killed was shot by a farmer in the north-east of Tasmania in 1930, leaving just captive specimens.',
          paragraphRef: '8',
        },
        {
          id: 'c17-r3-q13',
          questionNumber: 13,
          prompt: 'Attempts to find living thylacines are now rarely made.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 9 states: 'There have been numerous expeditions and searches for the thylacine over the years, none of which has produced definitive evidence that thylacines still exist.' The passage does not say whether searches are rarely made now.",
          evidenceQuote:
            'There have been numerous expeditions and searches for the thylacine over the years, none of which has produced definitive evidence that thylacines still exist.',
          paragraphRef: '9',
        },
      ],
    },

    // PASSAGE 2: Questions 14-20 (Matching Information)
    {
      id: 'c17-r3-g3',
      passageId: 'c17-r3-p2',
      questionType: 'matching_information',
      title: 'Questions 14–20',
      instructions:
        'Reading Passage 2 has eight sections, A–H.\n\nWhich section contains the following information?\n\nWrite the correct letter, A–H, in boxes 14–20 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 20,
      optionsList: MATCHING_INFO_OPTIONS_P2,
      allowMultipleUse: true,
      questions: [
        {
          id: 'c17-r3-q14',
          questionNumber: 14,
          prompt:
            'examples of a range of potential environmental advantages of oil palm tree cultivation',
          options: MATCHING_INFO_OPTIONS_P2,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Section F outlines several ecological advantages: requiring up to ten times less land than competitor crops per ton of oil, and the potential to sequester more carbon when replacing certain crops like rice.",
          evidenceQuote:
            'That immensely high yield – which is predominantly what makes it so profitable – is potentially also an ecological benefit... if it’s replacing rice, for example, it might actually sequester more carbon.',
          paragraphRef: 'F',
        },
        {
          id: 'c17-r3-q15',
          questionNumber: 15,
          prompt:
            'description of an organisation which controls the environmental impact of palm oil production',
          options: MATCHING_INFO_OPTIONS_P2,
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            "Section G describes the Roundtable on Sustainable Palm Oil (RSPO), detailing how it regulates the industry with strict environmental criteria such as prohibiting virgin forest clearing.",
          evidenceQuote:
            'The industry is now regulated by a group called the Roundtable on Sustainable Palm Oil (RSPO), consisting of palm growers, retailers, product manufacturers, and other interested parties.',
          paragraphRef: 'G',
        },
        {
          id: 'c17-r3-q16',
          questionNumber: 16,
          prompt: 'examples of the widespread global use of palm oil',
          options: MATCHING_INFO_OPTIONS_P2,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section A mentions: 'It’s almost certainly in the soap we wash with in the morning, the sandwich we have for lunch, and the biscuits we snack on during the day.'",
          evidenceQuote:
            'It’s almost certainly in the soap we wash with in the morning, the sandwich we have for lunch, and the biscuits we snack on during the day.',
          paragraphRef: 'A',
        },
        {
          id: 'c17-r3-q17',
          questionNumber: 17,
          prompt:
            'reference to a particular species which could benefit the ecosystem of oil palm plantations',
          options: MATCHING_INFO_OPTIONS_P2,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Section H refers to the bird’s nest fern (Asplenium nidus), which Ellwood believes could allow plantations to recover biodiversity.",
          evidenceQuote:
            'Ellwood believes that reintroducing the bird’s nest fern into oil palm plantations could potentially allow these areas to recover their biodiversity',
          paragraphRef: 'H',
        },
        {
          id: 'c17-r3-q18',
          questionNumber: 18,
          prompt: 'figures illustrating the rapid expansion of the palm oil industry',
          options: MATCHING_INFO_OPTIONS_P2,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Section B gives figures showing land area grew from 6 to 17 million hectares (1990–2012) and production skyrocketed from 2 million tonnes 50 years ago to around 60 million tonnes today.",
          evidenceQuote:
            'Between 1990 and 2012, the global land area devoted to growing oil palm trees grew from 6 to 17 million hectares... From a mere two million tonnes... there are now around 60 million tonnes produced every single year',
          paragraphRef: 'B',
        },
        {
          id: 'c17-r3-q19',
          questionNumber: 19,
          prompt: 'an economic justification for not opposing the palm oil industry',
          options: MATCHING_INFO_OPTIONS_P2,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Section E notes the economic argument against boycots: the vital role palm oil plays in lifting millions of low-income people in the developing world out of poverty.",
          evidenceQuote:
            'One response to the boycott movement has been the argument for the vital role palm oil plays in lifting many millions of people in the developing world out of poverty.',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r3-q20',
          questionNumber: 20,
          prompt:
            'examples of creatures badly affected by the establishment of oil palm plantations',
          options: MATCHING_INFO_OPTIONS_P2,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Section C gives specific examples of fauna suffering habitat destruction: 'most famously the Sumatran orangutan, but also rhinos, elephants, tigers, and numerous other fauna'.",
          evidenceQuote:
            'Endangered species – most famously the Sumatran orangutan, but also rhinos, elephants, tigers, and numerous other fauna – have suffered from the unstoppable spread of oil palm plantations.',
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 2: Questions 21-22 (Multiple Choice Multi-Select)
    {
      id: 'c17-r3-g4',
      passageId: 'c17-r3-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions:
        'Choose TWO letters, A–E.\n\nWrite the correct letters in boxes 21 and 22 on your answer sheet.\n\nWhich TWO statements are made about the Roundtable on Sustainable Palm Oil (RSPO)?',
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: RSPO_MULTI_OPTIONS,
      questions: [
        {
          id: 'c17-r3-q21',
          questionNumber: 21,
          prompt:
            'Which TWO statements are made about the Roundtable on Sustainable Palm Oil (RSPO)? (First choice)',
          options: RSPO_MULTI_OPTIONS,
          answerKey: ['B', 'C'],
          acceptedAlternatives: ['B', 'C'],
          explanation:
            "Section G states: 'The RSPO insists upon no virgin forest clearing, transparency and regular assessment of carbon stocks...' (B - demands open and honest practices) and 'Over the past decade or so, an agreement has gradually been reached regarding standards that producers of palm oil have to meet...' (C - took several years to establish criteria).",
          evidenceQuote:
            'Over the past decade or so, an agreement has gradually been reached regarding standards... The RSPO insists upon no virgin forest clearing, transparency and regular assessment of carbon stocks',
          paragraphRef: 'G',
        },
        {
          id: 'c17-r3-q22',
          questionNumber: 22,
          prompt:
            'Which TWO statements are made about the Roundtable on Sustainable Palm Oil (RSPO)? (Second choice)',
          options: RSPO_MULTI_OPTIONS,
          answerKey: ['B', 'C'],
          acceptedAlternatives: ['B', 'C'],
          explanation:
            "Section G states: 'The RSPO insists upon no virgin forest clearing, transparency and regular assessment of carbon stocks...' (B - demands open and honest practices) and 'Over the past decade or so, an agreement has gradually been reached regarding standards that producers of palm oil have to meet...' (C - took several years to establish criteria).",
          evidenceQuote:
            'Over the past decade or so, an agreement has gradually been reached regarding standards... The RSPO insists upon no virgin forest clearing, transparency and regular assessment of carbon stocks',
          paragraphRef: 'G',
        },
      ],
    },

    // PASSAGE 2: Questions 23-26 (Sentence Completion)
    {
      id: 'c17-r3-g5',
      passageId: 'c17-r3-p2',
      questionType: 'sentence_completion',
      title: 'Questions 23–26',
      instructions:
        'Complete the sentences below.\n\nChoose NO MORE THAN TWO WORDS from the passage for each answer.\n\nWrite your answers in boxes 23–26 on your answer sheet.',
      startQuestionNumber: 23,
      endQuestionNumber: 26,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      maxNumbers: 0,
      questions: [
        {
          id: 'c17-r3-q23',
          questionNumber: 23,
          prompt:
            'One advantage of palm oil for manufacturers is that it stays [23] even when not refrigerated.',
          answerKey: 'solid',
          acceptedAlternatives: ['solid'],
          explanation:
            "Section A states: 'Primarily because its unique properties – such as remaining solid at room temperature – make it an ideal ingredient for long-term preservation...'",
          evidenceQuote: 'remaining solid at room temperature',
          paragraphRef: 'A',
        },
        {
          id: 'c17-r3-q24',
          questionNumber: 24,
          prompt:
            'The [24] is the best known of the animals suffering habitat loss as a result of the spread of oil palm plantations.',
          answerKey: 'orangutan',
          acceptedAlternatives: [
            'orangutan',
            'orang-utan',
            'Sumatran orangutan',
            'Sumatran orang-utan',
          ],
          explanation:
            "Section C states: 'Endangered species – most famously the Sumatran orangutan, but also rhinos, elephants, tigers... have suffered...'",
          evidenceQuote: 'most famously the Sumatran orangutan',
          paragraphRef: 'C',
        },
        {
          id: 'c17-r3-q25',
          questionNumber: 25,
          prompt:
            'As one of its criteria for the certification of sustainable palm oil, the RSPO insists that growers check [25] on a routine basis.',
          answerKey: 'carbon stocks',
          acceptedAlternatives: ['carbon stocks'],
          explanation:
            "Section G states: 'The RSPO insists upon no virgin forest clearing, transparency and regular assessment of carbon stocks...'",
          evidenceQuote: 'regular assessment of carbon stocks',
          paragraphRef: 'G',
        },
        {
          id: 'c17-r3-q26',
          questionNumber: 26,
          prompt:
            'Ellwood and his researchers are looking into whether the bird’s nest fern could restore [26] in areas where oil palm trees are grown.',
          answerKey: 'biodiversity',
          acceptedAlternatives: ['biodiversity'],
          explanation:
            "Section H states: 'Ellwood believes that reintroducing the bird’s nest fern into oil palm plantations could potentially allow these areas to recover their biodiversity...'",
          evidenceQuote: 'allow these areas to recover their biodiversity',
          paragraphRef: 'H',
        },
      ],
    },

    // PASSAGE 3: Questions 27-31 (Multiple Choice Single)
    {
      id: 'c17-r3-g6',
      passageId: 'c17-r3-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–31',
      instructions:
        'Choose the correct letter, A, B, C or D.\n\nWrite the correct letter in boxes 27–31 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 31,
      questions: [
        {
          id: 'c17-r3-q27',
          questionNumber: 27,
          prompt: 'What point does Shester make about Barr’s book in the first paragraph?',
          options: MC_Q27_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 1 states: 'The book combines geology, history, economics, and a lot of data to explain why business clusters developed where they did and how the early decisions of workers and firms shaped the skyline we see today.' This covers a range of factors that affected the development of New York.",
          evidenceQuote:
            'The book combines geology, history, economics, and a lot of data to explain why business clusters developed where they did',
          paragraphRef: '1',
        },
        {
          id: 'c17-r3-q28',
          questionNumber: 28,
          prompt: 'How does Shester respond to the information in the book about tenements?',
          options: MC_Q28_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 3 states: 'I would have liked Barr to expand upon his claim that existing tenements prevented skyscrapers in certain neighborhoods... At first glance, it is not obvious why slum clearance would be limiting, while more expensive foundations would not.' Shester points out an inconsistency/potential problem in Barr’s argument.",
          evidenceQuote:
            'At first glance, it is not obvious why slum clearance would be limiting, while more expensive foundations would not.',
          paragraphRef: '3',
        },
        {
          id: 'c17-r3-q29',
          questionNumber: 29,
          prompt: 'What does Shester say about chapter six of the book?',
          options: MC_Q29_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 5 states: 'While less technical than the research paper on which the chapter is based, it is probably more technical than would be preferred by a general audience.' This means it is too specialised for most readers.",
          evidenceQuote:
            'it is probably more technical than would be preferred by a general audience.',
          paragraphRef: '5',
        },
        {
          id: 'c17-r3-q30',
          questionNumber: 30,
          prompt:
            'What does Shester suggest about the chapters focusing on the 1920s building boom?',
          options: MC_Q30_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 7 states: 'Chapter eight contains lengthy discussions of urban economic theory that may serve as a distraction to readers primarily interested in New York. However, they would be well-suited for undergraduates learning about the economics of cities.' Therefore, some parts will have limited appeal to certain readers.",
          evidenceQuote:
            'lengthy discussions of urban economic theory that may serve as a distraction to readers primarily interested in New York.',
          paragraphRef: '7',
        },
        {
          id: 'c17-r3-q31',
          questionNumber: 31,
          prompt: 'What impresses Shester the most about the chapter on land values?',
          options: MC_Q31_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 8 states: 'The data work that went into these estimations is particularly impressive.' This refers directly to the nature of the research work.",
          evidenceQuote:
            'The data work that went into these estimations is particularly impressive.',
          paragraphRef: '8',
        },
      ],
    },

    // PASSAGE 3: Questions 32-35 (Yes / No / Not Given)
    {
      id: 'c17-r3-g7',
      passageId: 'c17-r3-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 32–35',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 3?\n\nIn boxes 32–35 on your answer sheet, write\n\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 32,
      endQuestionNumber: 35,
      questions: [
        {
          id: 'c17-r3-q32',
          questionNumber: 32,
          prompt:
            'The description in the first chapter of how New York probably looked from the air in the early 1600s lacks interest.',
          options: [
            { label: 'YES', text: 'YES' },
            { label: 'NO', text: 'NO' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 2 states: 'Barr begins chapter one by taking the reader on a ‘helicopter time-machine’ ride – giving a fascinating account of how the New York landscape in 1609 might have looked from the sky.' Calling it fascinating contradicts 'lacks interest'.",
          evidenceQuote:
            'giving a fascinating account of how the New York landscape in 1609 might have looked from the sky.',
          paragraphRef: '2',
        },
        {
          id: 'c17-r3-q33',
          questionNumber: 33,
          prompt: 'Chapters two and three prepare the reader well for material yet to come.',
          options: [
            { label: 'YES', text: 'YES' },
            { label: 'NO', text: 'NO' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 3 states: 'Both chapters are informative and well researched and set the stage for the economic analysis that comes later in the book.' 'Set the stage for' agrees with preparing the reader well.",
          evidenceQuote:
            'Both chapters are informative and well researched and set the stage for the economic analysis that comes later in the book.',
          paragraphRef: '3',
        },
        {
          id: 'c17-r3-q34',
          questionNumber: 34,
          prompt:
            'The biggest problem for many nineteenth-century New York immigrant neighbourhoods was a lack of amenities.',
          options: [
            { label: 'YES', text: 'YES' },
            { label: 'NO', text: 'NO' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 4 mentions that Barr analyzes the locations of enclaves in terms of amenities, but does not state that lack of amenities was their 'biggest problem'.",
          evidenceQuote:
            'Barr identifies four primary immigrant enclaves and analyzes their locations in terms of the amenities available in the area.',
          paragraphRef: '4',
        },
        {
          id: 'c17-r3-q35',
          questionNumber: 35,
          prompt:
            'In the nineteenth century, New York’s immigrant neighbourhoods tended to concentrate around the harbour.',
          options: [
            { label: 'YES', text: 'YES' },
            { label: 'NO', text: 'NO' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 4 states: 'Most of these enclaves were located on the least valuable land, between the industries located on the waterfront and the wealthy neighborhoods bordering Central Park.' They were between the waterfront industries and Central Park, not concentrated around the harbour.",
          evidenceQuote:
            'Most of these enclaves were located on the least valuable land, between the industries located on the waterfront and the wealthy neighborhoods bordering Central Park.',
          paragraphRef: '4',
        },
      ],
    },

    // PASSAGE 3: Questions 36-40 (Summary Completion with Options)
    {
      id: 'c17-r3-g8',
      passageId: 'c17-r3-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 36–40',
      instructions:
        'Complete the summary using the list of phrases, A–J, below.\n\nWrite the correct letter, A–J, in boxes 36–40 on your answer sheet.',
      startQuestionNumber: 36,
      endQuestionNumber: 40,
      optionsList: SUMMARY_OPTIONS_BOX_P3,
      contentWithGaps: `The bedrock myth

In chapter seven, Barr indicates how the lack of bedrock close to the surface does not explain why skyscrapers are absent from [[36]]. He points out that although the cost of foundations increases when bedrock is deep below the surface, this cannot be regarded as [[37]], especially when compared to [[38]].

A particularly enjoyable part of the chapter was Barr’s account of how foundations are built. He describes not only how [[39]] are made possible by the use of caissons, but he also discusses their [[40]]. The chapter is well researched but relatively easy to understand.`,
      questions: [
        {
          id: 'c17-r3-q36',
          questionNumber: 36,
          prompt:
            'In chapter seven, Barr indicates how the lack of bedrock close to the surface does not explain why skyscrapers are absent from [36]',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Paragraph 6 explains the bedrock myth: 'the assumption that the absence of bedrock close to the surface between Downtown and Midtown New York is the reason for skyscrapers not being built between the two urban centers.' Between the two urban centers refers to specific areas (H - specific areas).",
          evidenceQuote:
            'the assumption that the absence of bedrock close to the surface between Downtown and Midtown New York is the reason for skyscrapers not being built between the two urban centers.',
          paragraphRef: '6',
        },
        {
          id: 'c17-r3-q37',
          questionNumber: 37,
          prompt:
            'He points out that although the cost of foundations increases when bedrock is deep below the surface, this cannot be regarded as [37]',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 6 states: 'while deeper bedrock does increase foundation costs, these costs were neither prohibitively high nor were they large compared to the overall cost of building a skyscraper.' Not prohibitively high means not an excessive expense (D - excessive expense).",
          evidenceQuote:
            'while deeper bedrock does increase foundation costs, these costs were neither prohibitively high',
          paragraphRef: '6',
        },
        {
          id: 'c17-r3-q38',
          questionNumber: 38,
          prompt: 'especially when compared to [38]',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'I',
          acceptedAlternatives: ['I'],
          explanation:
            "Paragraph 6 states: 'nor were they large compared to the overall cost of building a skyscraper.' The overall cost of building corresponds to total expenditure (I - total expenditure).",
          evidenceQuote:
            'nor were they large compared to the overall cost of building a skyscraper.',
          paragraphRef: '6',
        },
        {
          id: 'c17-r3-q39',
          questionNumber: 39,
          prompt:
            'He describes not only how [39] are made possible by the use of caissons',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 6 states: 'He describes the use of caissons, which enable workers to dig down for considerable distances, often below the water table, until they reach bedrock.' Digging down for considerable distances refers to deep excavations (B - deep excavations).",
          evidenceQuote:
            'He describes the use of caissons, which enable workers to dig down for considerable distances, often below the water table, until they reach bedrock.',
          paragraphRef: '6',
        },
        {
          id: 'c17-r3-q40',
          questionNumber: 40,
          prompt: 'but he also discusses their [40]',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph 6 states: 'Barr’s thorough technological history discusses not only how caissons work, but also the dangers involved.' The dangers involved are associated risks (F - associated risks).",
          evidenceQuote:
            'Barr’s thorough technological history discusses not only how caissons work, but also the dangers involved.',
          paragraphRef: '6',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 17 Academic Reading Test 3',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge17ReadingTest3(authorId?: string) {
  const data = getCambridge17ReadingTest3Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 17 Reading Test 3 data validation failed:\n- ${errors.join('\n- ')}`
    );
  }

  // Resolve author
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
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%17%Academic%Reading%Test 3%' LIMIT 1"
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
