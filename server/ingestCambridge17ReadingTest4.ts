import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge17ReadingTest4Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c17-r4-p1',
      passageNumber: 1,
      title: 'Bats to the rescue',
      subtitle:
        'How Madagascar’s bats are helping to save the rainforest\n\nYou should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c17-r4-p1-1',
          label: '1',
          content: `There are few places in the world where relations between agriculture and conservation are more strained. Madagascar’s forests are being converted to agricultural land at a rate of one percent every year. Much of this destruction is fuelled by the cultivation of the country’s main staple crop: rice. And a key reason for this destruction is that insect pests are destroying vast quantities of what is grown by local subsistence farmers, leading them to clear forest to create new paddy fields. The result is devastating habitat and biodiversity loss on the island, but not all species are suffering. In fact, some of the island’s insectivorous bats are currently thriving and this has important implications for farmers and conservationists alike.`,
        },
        {
          id: 'c17-r4-p1-2',
          label: '2',
          content: `Enter University of Cambridge zoologist Ricardo Rocha. He’s passionate about conservation, and bats. More specifically, he’s interested in how bats are responding to human activity and deforestation in particular. Rocha’s new study shows that several species of bats are giving Madagascar’s rice farmers a vital pest control service by feasting on plagues of insects. And this, he believes, can ease the financial pressure on farmers to turn forest into fields.`,
        },
        {
          id: 'c17-r4-p1-3',
          label: '3',
          content: `Bats comprise roughly one-fifth of all mammal species in Madagascar and thirty-six recorded bat species are native to the island, making it one of the most important regions for conservation of this animal group anywhere in the world.\n\nCo-leading an international team of scientists, Rocha found that several species of indigenous bats are taking advantage of habitat modification to hunt insects swarming above the country’s rice fields. They include the Malagasy mouse-eared bat, Major’s long-fingered bat, the Malagasy white-bellied free-tailed bat and Peters’ wrinkle-lipped bat.`,
        },
        {
          id: 'c17-r4-p1-4',
          label: '4',
          content: `‘These winner species are providing a valuable free service to Madagascar as biological pest suppressors,’ says Rocha. ‘We found that six species of bat are preying on rice pests, including the paddy swarming caterpillar and grass webworm. The damage which these insects cause puts the island’s farmers under huge financial pressure and that encourages deforestation.’\n\nThe study, now published in the journal Agriculture, Ecosystems and Environment, set out to investigate the feeding activity of insectivorous bats in the farmland bordering the Ranomafana National Park in the southeast of the country.`,
        },
        {
          id: 'c17-r4-p1-5',
          label: '5',
          content: `Rocha and his team used state-of-the-art ultrasonic recorders to record over a thousand bat ‘feeding buzzes’ (echolocation sequences used by bats to target their prey) at 54 sites, in order to identify the favourite feeding spots of the bats. They next used DNA barcoding techniques to analyse droppings collected from bats at the different sites.`,
        },
        {
          id: 'c17-r4-p1-6',
          label: '6',
          content: `The recordings revealed that bat activity over rice fields was much higher than it was in continuous forest – seven times higher over rice fields which were on flat ground, and sixteen times higher over fields on the sides of hills – leaving no doubt that the animals are preferentially foraging in these man-made ecosystems. The researchers suggest that the bats favour these fields because lack of water and nutrient run-off make these crops more susceptible to insect pest infestations. DNA analysis showed that all six species of bat had fed on economically important insect pests. While the findings indicated that rice farming benefits most from the bats, the scientists also found indications that the bats were consuming pests of other crops, including the black twig borer (which infests coffee plants), the sugarcane cicada, the macadamia nut-borer, and the sober tabby (a pest of citrus fruits).`,
        },
        {
          id: 'c17-r4-p1-7',
          label: '7',
          content: `‘The effectiveness of bats as pest controllers has already been proven in the USA and Catalonia,’ said co-author James Kemp, from the University of Lisbon. ‘But our study is the first to show this happening in Madagascar, where the stakes for both farmers and conservationists are so high.’\n\nLocal people may have a further reason to be grateful to their bats. While the animal is often associated with spreading disease, Rocha and his team found evidence that Malagasy bats feed not just on crop pests but also on mosquitoes – carriers of malaria, Rift Valley fever virus and elephantiasis – as well as blackflies, which spread river blindness.`,
        },
        {
          id: 'c17-r4-p1-8',
          label: '8',
          content: `Rocha points out that the relationship is complicated. When food is scarce, bats become a crucial source of protein for local people. Even the children will hunt them. And as well as roosting in trees, the bats sometimes roost in buildings, but are not welcomed there because they make them unclean. At the same time, however, they are associated with sacred caves and the ancestors, so they can be viewed as beings between worlds, which makes them very significant in the culture of the people. And one potential problem is that while these bats are benefiting from farming, at the same time deforestation is reducing the places where they can roost, which could have long-term effects on their numbers. Rocha says, ‘With the right help, we hope that farmers can promote this mutually beneficial relationship by installing bat houses.’\n\nRocha and his colleagues believe that maximising bat populations can help to boost crop yields and promote sustainable livelihoods. The team is now calling for further research to quantify this contribution. ‘I’m very optimistic,’ says Rocha. ‘If we give nature a hand, we can speed up the process of regeneration.’`,
        },
      ],
    },
    {
      id: 'c17-r4-p2',
      passageNumber: 2,
      title: 'Does education fuel economic growth?',
      subtitle:
        'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c17-r4-p2-A',
          label: 'A',
          content: `Over the last decade, a huge database about the lives of southwest German villagers between 1600 and 1900 has been compiled by a team led by Professor Sheilagh Ogilvie at Cambridge University’s Faculty of Economics. It includes court records, guild ledgers, parish registers, village censuses, tax lists and – the most recent addition – 9,000 handwritten inventories listing over a million personal possessions belonging to ordinary women and men across three centuries. Ogilvie, who discovered the inventories in the archives of two German communities 30 years ago, believes they may hold the answer to a conundrum that has long puzzled economists: the lack of evidence for a causal link between education and a country’s economic growth.`,
        },
        {
          id: 'c17-r4-p2-B',
          label: 'B',
          content: `As Ogilvie explains, ‘Education helps us to work more productively, invent better technology, and earn more … surely it must be critical for economic growth? But, if you look back through history, there’s no evidence that having a high literacy rate made a country industrialise earlier.’ Between 1600 and 1900, England had only mediocre literacy rates by European standards, yet its economy grew fast and it was the first country to industrialise. During this period, Germany and Scandinavia had excellent literacy rates, but their economies grew slowly and they industrialised late. ‘Modern cross-country analyses have also struggled to find evidence that education causes economic growth, even though there is plenty of evidence that growth increases education,’ she adds.`,
        },
        {
          id: 'c17-r4-p2-C',
          label: 'C',
          content: `In the handwritten inventories that Ogilvie is analysing are the belongings of women and men at marriage, remarriage and death. From badger skins to Bibles, sewing machines to scarlet bodices – the villagers’ entire worldly goods are included. Inventories of agricultural equipment and craft tools reveal economic activities; ownership of books and education-related objects like pens and slates suggests how people learned. In addition, the tax lists included in the database record the value of farms, workshops, assets and debts; signatures and people’s estimates of their age indicate literacy and numeracy levels; and court records reveal obstacles (such as the activities of the guilds*) that stifled industry.\n\nPrevious studies usually had just one way of linking education with economic growth – the presence of schools and printing presses, perhaps, or school enrolment, or the ability to sign names. According to Ogilvie, the database provides multiple indicators for the same individuals, making it possible to analyse links between literacy, numeracy, wealth, and industriousness, for individual women and men over the long term.\n\n* guild: an association of artisans or merchants which oversees the practice of their craft or trade in a particular area`,
        },
        {
          id: 'c17-r4-p2-D',
          label: 'D',
          content: `Ogilvie and her team have been building the vast database of material possessions on top of their full demographic reconstruction of the people who lived in these two German communities. ‘We can follow the same people – and their descendants – across 300 years of educational and economic change,’ she says. Individual lives have unfolded before their eyes. Stories like that of the 24-year-olds Ana Regina and Magdalena Riethmüllerin, who were chastised in 1707 for reading books in church instead of listening to the sermon. ‘This tells us they were continuing to develop their reading skills at least a decade after leaving school,’ explains Ogilvie. The database also reveals the case of Juliana Schweickherdt, a 50-year-old spinster living in the small Black Forest community of Wildberg, who was reprimanded in 1752 by the local weavers’ guild for ‘weaving cloth and combing wool, counter to the guild ordinance’. When Juliana continued taking jobs reserved for male guild members, she was summoned before the guild court and told to pay a fine equivalent to one third of a servant’s annual wage. It was a small act of defiance by today’s standards, but it reflects a time when laws in Germany and elsewhere regulated people’s access to labour markets. The dominance of guilds not only prevented people from using their skills, but also held back even the simplest industrial innovation.`,
        },
        {
          id: 'c17-r4-p2-E',
          label: 'E',
          content: `The data-gathering phase of the project has been completed and now, according to Ogilvie, it is time ‘to ask the big questions’. One way to look at whether education causes economic growth is to ‘hold wealth constant’. This involves following the lives of different people with the same level of wealth over a period of time. If wealth is constant, it is possible to discover whether education was, for example, linked to the cultivation of new crops, or to the adoption of industrial innovations like sewing machines. The team will also ask what aspect of education helped people engage more with productive and innovative activities. Was it, for instance, literacy, numeracy, book ownership, years of schooling? Was there a threshold level – a tipping point – that needed to be reached to affect economic performance?`,
        },
        {
          id: 'c17-r4-p2-F',
          label: 'F',
          content: `Ogilvie hopes to start finding answers to these questions over the next few years. One thing is already clear, she says: the relationship between education and economic growth is far from straightforward. ‘German-speaking central Europe is an excellent laboratory for testing theories of economic growth,’ she explains. Between 1600 and 1900, literacy rates and book ownership were high and yet the region remained poor. It was also the case that local guilds and merchant associations were extremely powerful and legislated against anything that undermined their monopolies. In villages throughout the region, guilds blocked labour migration and resisted changes that might reduce their influence.\n\n‘Early findings suggest that the potential benefits of education for the economy can be held back by other barriers, and this has implications for today,’ says Ogilvie. ‘Huge amounts are spent improving education in developing countries, but this spending can fail to deliver economic growth if restrictions block people – especially women and the poor – from using their education in economically productive ways. If economic institutions are poorly set up, for instance, education can’t lead to growth.’`,
        },
      ],
    },
    {
      id: 'c17-r4-p3',
      passageNumber: 3,
      title: 'Timur Gareyev – blindfold chess champion',
      subtitle:
        'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c17-r4-p3-A',
          label: 'A',
          content: `Next month, a chess player named Timur Gareyev will take on nearly 50 opponents at once. But that is not the hard part. While his challengers will play the games as normal, Gareyev himself will be blindfolded. Even by world record standards, it sets a high bar for human performance. The 28-year-old already stands out in the rarefied world of blindfold chess. He has a fondness for bright clothes and unusual hairstyles, and he gets his kicks from the adventure sport of BASE jumping. He has already proved himself a strong chess player, too. In a 10-hour chess marathon in 2013, Gareyev played 33 games in his head simultaneously. He won 29 and lost none. The skill has become his brand: he calls himself the Blindfold King.`,
        },
        {
          id: 'c17-r4-p3-B',
          label: 'B',
          content: `But Gareyev’s prowess has drawn interest from beyond the chess-playing community. In the hope of understanding how he and others like him can perform such mental feats, researchers at the University of California in Los Angeles (UCLA) called him in for tests. They now have their first results. ‘The ability to play a game of chess with your eyes closed is not a far reach for most accomplished players,’ said Jesse Rissman, who runs a memory lab at UCLA. ‘But the thing that’s so remarkable about Timur and a few other individuals is the number of games they can keep active at once. To me it is simply astonishing.’`,
        },
        {
          id: 'c17-r4-p3-C',
          label: 'C',
          content: `Gareyev learned to play chess in his native Uzbekistan when he was six years old. Tutored by his grandfather, he entered his first tournament aged eight and soon became obsessed with competitions. At 16, he was crowned Asia’s youngest ever chess grandmaster. He moved to the US soon after, and as a student helped his university win its first national chess championship. In 2013, Gareyev was ranked the third best chess player in the US.`,
        },
        {
          id: 'c17-r4-p3-D',
          label: 'D',
          content: `To the uninitiated, blindfold chess seems to call for superhuman skill. But displays of the feat go back centuries. The first recorded game in Europe was played in 13th-century Florence. In 1947, the Argentinian grandmaster Miguel Najdorf played 45 simultaneous games in his mind, winning 39 in the 24-hour session.`,
        },
        {
          id: 'c17-r4-p3-E',
          label: 'E',
          content: `Accomplished players can develop the skill of playing blind even without realising it. The nature of the game is to run through possible moves in the mind to see how they play out. From this, regular players develop a memory for the patterns the pieces make, the defences and attacks. ‘You recreate it in your mind,’ said Gareyev. ‘A lot of players are capable of doing what I’m doing.’ The real mental challenge comes from playing multiple games at once in the head. Not only must the positions of each piece on every board be memorised, they must be recalled faithfully when needed, updated with each player’s moves, and then reliably stored again, so the brain can move on to the next board. First moves can be tough to remember because they are fairly uninteresting. But the ends of games are taxing too, as exhaustion sets in. When Gareyev is tired, his recall can get patchy. He sometimes makes moves based on only a fragmented memory of the pieces’ positions.`,
        },
        {
          id: 'c17-r4-p3-F',
          label: 'F',
          content: `The scientists first had Gareyev perform some standard memory tests. These assessed his ability to hold numbers, pictures and words in mind. One classic test measures how many numbers a person can repeat, both forwards and backwards, soon after hearing them. Most people manage about seven. ‘He was not exceptional on any of these standard tests,’ said Rissman. ‘We didn’t find anything other than playing chess that he seems to be supremely gifted at.’ But next came the brain scans. With Gareyev lying down in the machine, Rissman looked at how well connected the various regions of the chess player’s brain were. Though the results are tentative and as yet unpublished, the scans found much greater than average communication between parts of Gareyev’s brain that make up what is called the frontoparietal control network. Of 63 people scanned alongside the chess player, only one or two scored more highly on the measure. ‘You use this network in almost any complex task. It helps you to allocate attention, keep rules in mind, and work out whether you should be responding or not,’ said Rissman.`,
        },
        {
          id: 'c17-r4-p3-G',
          label: 'G',
          content: `It was not the only hint of something special in Gareyev’s brain. The scans also suggest that Gareyev’s visual network is more highly connected to other brain parts than usual. Initial results suggest that the areas of his brain that process visual images – such as chess boards – may have stronger links to other brain regions, and so be more powerful than normal. While the analyses are not finalised yet, they may hold the first clues to Gareyev’s extraordinary ability.`,
        },
        {
          id: 'c17-r4-p3-H',
          label: 'H',
          content: `For the world record attempt, Gareyev hopes to play 47 blindfold games at once in about 16 hours. He will need to win 80% to claim the title. ‘I don’t worry too much about the winning percentage, that’s never been an issue for me,’ he said. ‘The most important part of blindfold chess for me is that I have found the one thing that I can fully dedicate myself to. I miss having an obsession.’`,
        },
      ],
    },
  ];

  const MATCHING_INFO_P2_OPTIONS = [
    { label: 'A', text: 'Section A' },
    { label: 'B', text: 'Section B' },
    { label: 'C', text: 'Section C' },
    { label: 'D', text: 'Section D' },
    { label: 'E', text: 'Section E' },
    { label: 'F', text: 'Section F' },
  ];

  const LITERACY_P2_OPTIONS = [
    { label: 'A', text: 'Very little research has been done into the link between high literacy rates and improved earnings.' },
    { label: 'B', text: 'Literacy rates in Germany between 1600 and 1900 were very good.' },
    { label: 'C', text: 'There is strong evidence that high literacy rates in the modern world result in economic growth.' },
    { label: 'D', text: 'England is a good example of how high literacy rates helped a country industrialise.' },
    { label: 'E', text: 'Economic growth can help to improve literacy rates.' },
  ];

  const GUILDS_P2_OPTIONS = [
    { label: 'A', text: 'They helped young people to learn a skill.' },
    { label: 'B', text: 'They were opposed to people moving to an area for work.' },
    { label: 'C', text: 'They kept better records than guilds in other parts of the world.' },
    { label: 'D', text: 'They opposed practices that threatened their control over a trade.' },
    { label: 'E', text: 'They predominantly consisted of wealthy merchants.' },
  ];

  const MATCHING_PARAGRAPHS_P3_OPTIONS = [
    { label: 'A', text: 'Paragraph A' },
    { label: 'B', text: 'Paragraph B' },
    { label: 'C', text: 'Paragraph C' },
    { label: 'D', text: 'Paragraph D' },
    { label: 'E', text: 'Paragraph E' },
    { label: 'F', text: 'Paragraph F' },
    { label: 'G', text: 'Paragraph G' },
    { label: 'H', text: 'Paragraph H' },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-6 (True / False / Not Given)
    {
      id: 'c17-r4-g1',
      passageId: 'c17-r4-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–6',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\n\nIn boxes 1–6 on your answer sheet, write\n\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      questions: [
        {
          id: 'c17-r4-q1',
          questionNumber: 1,
          prompt: 'Many Madagascan forests are being destroyed by attacks from insects.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 1 states: 'Madagascar’s forests are being converted to agricultural land at a rate of one percent every year. Much of this destruction is fuelled by the cultivation of the country’s main staple crop: rice. And a key reason for this destruction is that insect pests are destroying vast quantities of what is grown by local subsistence farmers, leading them to clear forest to create new paddy fields.' Thus, farmers clear forests due to crop loss; the insects are attacking crops, not destroying forests directly.",
          evidenceQuote:
            'insect pests are destroying vast quantities of what is grown by local subsistence farmers, leading them to clear forest to create new paddy fields.',
          paragraphRef: '1',
        },
        {
          id: 'c17-r4-q2',
          questionNumber: 2,
          prompt: 'Loss of habitat has badly affected insectivorous bats in Madagascar.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 1 states: 'The result is devastating habitat and biodiversity loss on the island, but not all species are suffering. In fact, some of the island’s insectivorous bats are currently thriving...'",
          evidenceQuote:
            'The result is devastating habitat and biodiversity loss on the island, but not all species are suffering. In fact, some of the island’s insectivorous bats are currently thriving',
          paragraphRef: '1',
        },
        {
          id: 'c17-r4-q3',
          questionNumber: 3,
          prompt: 'Ricardo Rocha has carried out studies of bats in different parts of the world.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 2 mentions Rocha's passion for conservation and bats, and Paragraph 7 notes that the effectiveness of bats has been proven in the USA and Catalonia, but does not state that Rocha himself conducted studies in other countries.",
          evidenceQuote:
            'Enter University of Cambridge zoologist Ricardo Rocha. He’s passionate about conservation, and bats.',
          paragraphRef: '2',
        },
        {
          id: 'c17-r4-q4',
          questionNumber: 4,
          prompt:
            'Habitat modification has resulted in indigenous bats in Madagascar becoming useful to farmers.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraphs 3 and 4 state: 'several species of indigenous bats are taking advantage of habitat modification to hunt insects swarming above the country’s rice fields... ‘These winner species are providing a valuable free service to Madagascar as biological pest suppressors,’ says Rocha.'",
          evidenceQuote:
            'several species of indigenous bats are taking advantage of habitat modification to hunt insects swarming above the country’s rice fields.',
          paragraphRef: '3',
        },
        {
          id: 'c17-r4-q5',
          questionNumber: 5,
          prompt:
            'The Malagasy mouse-eared bat is more common than other indigenous bat species in Madagascar.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 3 lists the Malagasy mouse-eared bat among indigenous species that hunt above rice fields, but gives no information comparing its abundance to other species.",
          evidenceQuote:
            'They include the Malagasy mouse-eared bat, Major’s long-fingered bat, the Malagasy white-bellied free-tailed bat and Peters’ wrinkle-lipped bat.',
          paragraphRef: '3',
        },
        {
          id: 'c17-r4-q6',
          questionNumber: 6,
          prompt: 'Bats may feed on paddy swarming caterpillars and grass webworms.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 4 states: '‘We found that six species of bat are preying on rice pests, including the paddy swarming caterpillar and grass webworm.’'",
          evidenceQuote:
            'We found that six species of bat are preying on rice pests, including the paddy swarming caterpillar and grass webworm.',
          paragraphRef: '4',
        },
      ],
    },

    // PASSAGE 1: Questions 7-13 (Table Completion)
    {
      id: 'c17-r4-g2',
      passageId: 'c17-r4-p1',
      questionType: 'table_completion',
      title: 'Questions 7–13',
      instructions:
        'Complete the table below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes 7–13 on your answer sheet.',
      startQuestionNumber: 7,
      endQuestionNumber: 13,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      tableData: {
        headers: ['Stage', "The study carried out by Rocha's team"],
        rows: [
          {
            cells: [
              { content: 'Aim' },
              {
                content:
                  '• to investigate the feeding habits of bats in farmland near the Ranomafana National Park',
              },
            ],
          },
          {
            cells: [
              { content: 'Method' },
              {
                content:
                  '• ultrasonic recording to identify favourite feeding spots\n• DNA analysis of bat [[7]]',
                isGap: true,
                questionNumber: 7,
              },
            ],
          },
          {
            cells: [
              { content: 'Findings' },
              {
                content:
                  '• the bats\n  - were most active in rice fields located on hills\n  - ate pests of rice, [[8]], sugarcane, nuts and fruit\n  - prevent the spread of disease by eating [[9]] and blackflies\n• local attitudes to bats are mixed:\n  - they provide food rich in [[10]]\n  - the buildings where they roost become [[11]]\n  - they play an important role in local [[12]]',
                isGap: true,
              },
            ],
          },
          {
            cells: [
              { content: 'Recommendation' },
              {
                content:
                  '• farmers should provide special [[13]] to support the bat population',
                isGap: true,
                questionNumber: 13,
              },
            ],
          },
        ],
      },
      contentWithGaps: `The study carried out by Rocha’s team

Aim:
• to investigate the feeding habits of bats in farmland near the Ranomafana National Park

Method:
• ultrasonic recording to identify favourite feeding spots
• DNA analysis of bat [[7]]

Findings:
• the bats
  - were most active in rice fields located on hills
  - ate pests of rice, [[8]], sugarcane, nuts and fruit
  - prevent the spread of disease by eating [[9]] and blackflies
• local attitudes to bats are mixed:
  - they provide food rich in [[10]]
  - the buildings where they roost become [[11]]
  - they play an important role in local [[12]]

Recommendation:
• farmers should provide special [[13]] to support the bat population`,
      questions: [
        {
          id: 'c17-r4-q7',
          questionNumber: 7,
          prompt: 'DNA analysis of bat [7]',
          answerKey: 'droppings',
          acceptedAlternatives: ['droppings'],
          explanation:
            "Paragraph 5 states: 'They next used DNA barcoding techniques to analyse droppings collected from bats at the different sites.'",
          evidenceQuote: 'analyse droppings collected from bats at the different sites.',
          paragraphRef: '5',
        },
        {
          id: 'c17-r4-q8',
          questionNumber: 8,
          prompt: 'ate pests of rice, [8], sugarcane, nuts and fruit',
          answerKey: 'coffee',
          acceptedAlternatives: ['coffee'],
          explanation:
            "Paragraph 6 states: 'the scientists also found indications that the bats were consuming pests of other crops, including the black twig borer (which infests coffee plants), the sugarcane cicada, the macadamia nut-borer, and the sober tabby (a pest of citrus fruits).'",
          evidenceQuote: 'which infests coffee plants',
          paragraphRef: '6',
        },
        {
          id: 'c17-r4-q9',
          questionNumber: 9,
          prompt: 'prevent the spread of disease by eating [9] and blackflies',
          answerKey: 'mosquitoes',
          acceptedAlternatives: ['mosquitoes', 'mosquitos'],
          explanation:
            "Paragraph 7 states: 'Rocha and his team found evidence that Malagasy bats feed not just on crop pests but also on mosquitoes – carriers of malaria, Rift Valley fever virus and elephantiasis – as well as blackflies, which spread river blindness.'",
          evidenceQuote:
            'feed not just on crop pests but also on mosquitoes – carriers of malaria, Rift Valley fever virus and elephantiasis – as well as blackflies',
          paragraphRef: '7',
        },
        {
          id: 'c17-r4-q10',
          questionNumber: 10,
          prompt: 'they provide food rich in [10]',
          answerKey: 'protein',
          acceptedAlternatives: ['protein'],
          explanation:
            "Paragraph 8 states: 'When food is scarce, bats become a crucial source of protein for local people.'",
          evidenceQuote: 'bats become a crucial source of protein for local people.',
          paragraphRef: '8',
        },
        {
          id: 'c17-r4-q11',
          questionNumber: 11,
          prompt: 'the buildings where they roost become [11]',
          answerKey: 'unclean',
          acceptedAlternatives: ['unclean'],
          explanation:
            "Paragraph 8 states: 'And as well as roosting in trees, the bats sometimes roost in buildings, but are not welcomed there because they make them unclean.'",
          evidenceQuote: 'they make them unclean.',
          paragraphRef: '8',
        },
        {
          id: 'c17-r4-q12',
          questionNumber: 12,
          prompt: 'they play an important role in local [12]',
          answerKey: 'culture',
          acceptedAlternatives: ['culture'],
          explanation:
            "Paragraph 8 states: 'At the same time, however, they are associated with sacred caves and the ancestors, so they can be viewed as beings between worlds, which makes them very significant in the culture of the people.'",
          evidenceQuote: 'makes them very significant in the culture of the people.',
          paragraphRef: '8',
        },
        {
          id: 'c17-r4-q13',
          questionNumber: 13,
          prompt: 'farmers should provide special [13] to support the bat population',
          answerKey: 'houses',
          acceptedAlternatives: ['houses'],
          explanation:
            "Paragraph 8 states: 'Rocha says, ‘With the right help, we hope that farmers can promote this mutually beneficial relationship by installing bat houses.’'",
          evidenceQuote: 'by installing bat houses.',
          paragraphRef: '8',
        },
      ],
    },

    // PASSAGE 2: Questions 14-18 (Matching Information)
    {
      id: 'c17-r4-g3',
      passageId: 'c17-r4-p2',
      questionType: 'matching_information',
      title: 'Questions 14–18',
      instructions:
        'Reading Passage 2 has six sections, A–F.\n\nWhich section contains the following information?\n\nWrite the correct letter, A–F, in boxes 14–18 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 18,
      optionsList: MATCHING_INFO_P2_OPTIONS,
      allowMultipleUse: true,
      questions: [
        {
          id: 'c17-r4-q14',
          questionNumber: 14,
          prompt:
            'an explanation of the need for research to focus on individuals with a fairly consistent income',
          options: MATCHING_INFO_P2_OPTIONS,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Section E explains: 'One way to look at whether education causes economic growth is to ‘hold wealth constant’. This involves following the lives of different people with the same level of wealth over a period of time.'",
          evidenceQuote:
            'One way to look at whether education causes economic growth is to ‘hold wealth constant’. This involves following the lives of different people with the same level of wealth over a period of time.',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r4-q15',
          questionNumber: 15,
          prompt: 'examples of the sources the database has been compiled from',
          options: MATCHING_INFO_P2_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section A lists the sources: 'court records, guild ledgers, parish registers, village censuses, tax lists and – the most recent addition – 9,000 handwritten inventories...'",
          evidenceQuote:
            'It includes court records, guild ledgers, parish registers, village censuses, tax lists and – the most recent addition – 9,000 handwritten inventories',
          paragraphRef: 'A',
        },
        {
          id: 'c17-r4-q16',
          questionNumber: 16,
          prompt: 'an account of one individual’s refusal to obey an order',
          options: MATCHING_INFO_P2_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Section D describes Juliana Schweickherdt: 'When Juliana continued taking jobs reserved for male guild members, she was summoned before the guild court and told to pay a fine equivalent to one third of a servant’s annual wage. It was a small act of defiance...'",
          evidenceQuote:
            'When Juliana continued taking jobs reserved for male guild members, she was summoned before the guild court and told to pay a fine',
          paragraphRef: 'D',
        },
        {
          id: 'c17-r4-q17',
          questionNumber: 17,
          prompt:
            'a reference to a region being particularly suited to research into the link between education and economic growth',
          options: MATCHING_INFO_P2_OPTIONS,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Section F states: '‘German-speaking central Europe is an excellent laboratory for testing theories of economic growth,’ she explains.'",
          evidenceQuote:
            'German-speaking central Europe is an excellent laboratory for testing theories of economic growth',
          paragraphRef: 'F',
        },
        {
          id: 'c17-r4-q18',
          questionNumber: 18,
          prompt: 'examples of the items included in a list of personal possessions',
          options: MATCHING_INFO_P2_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Section C provides examples: 'From badger skins to Bibles, sewing machines to scarlet bodices – the villagers’ entire worldly goods are included.'",
          evidenceQuote:
            'From badger skins to Bibles, sewing machines to scarlet bodices – the villagers’ entire worldly goods are included.',
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 2: Questions 19-22 (Summary Completion)
    {
      id: 'c17-r4-g4',
      passageId: 'c17-r4-p2',
      questionType: 'summary_completion_words',
      title: 'Questions 19–22',
      instructions:
        'Complete the summary below.\n\nChoose ONE WORD from the passage for each answer.\n\nWrite your answers in boxes 19–22 on your answer sheet.',
      startQuestionNumber: 19,
      endQuestionNumber: 22,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Demographic reconstruction of two German communities

The database that Ogilvie and her team has compiled sheds light on the lives of a range of individuals, as well as those of their [[19]], over a 300-year period. For example, Ana Regina and Magdalena Riethmüllerin were reprimanded for reading while they should have been paying attention to a [[20]]. There was also Juliana Schweickherdt, who came to the notice of the weavers’ guild in the year 1752 for breaking guild rules. As a punishment, she was later given a [[21]]. Cases like this illustrate how the guilds could prevent [[22]] and stop skilled people from working.`,
      questions: [
        {
          id: 'c17-r4-q19',
          questionNumber: 19,
          prompt:
            'The database that Ogilvie and her team has compiled sheds light on the lives of a range of individuals, as well as those of their [19], over a 300-year period.',
          answerKey: 'descendants',
          acceptedAlternatives: ['descendants'],
          explanation:
            "Section D states: '‘We can follow the same people – and their descendants – across 300 years of educational and economic change,’ she says.'",
          evidenceQuote:
            'We can follow the same people – and their descendants – across 300 years of educational and economic change',
          paragraphRef: 'D',
        },
        {
          id: 'c17-r4-q20',
          questionNumber: 20,
          prompt:
            'For example, Ana Regina and Magdalena Riethmüllerin were reprimanded for reading while they should have been paying attention to a [20].',
          answerKey: 'sermon',
          acceptedAlternatives: ['sermon'],
          explanation:
            "Section D states: 'Stories like that of the 24-year-olds Ana Regina and Magdalena Riethmüllerin, who were chastised in 1707 for reading books in church instead of listening to the sermon.'",
          evidenceQuote: 'reading books in church instead of listening to the sermon.',
          paragraphRef: 'D',
        },
        {
          id: 'c17-r4-q21',
          questionNumber: 21,
          prompt: 'As a punishment, she was later given a [21].',
          answerKey: 'fine',
          acceptedAlternatives: ['fine'],
          explanation:
            "Section D states: 'she was summoned before the guild court and told to pay a fine equivalent to one third of a servant’s annual wage.'",
          evidenceQuote: 'told to pay a fine equivalent to one third of a servant’s annual wage.',
          paragraphRef: 'D',
        },
        {
          id: 'c17-r4-q22',
          questionNumber: 22,
          prompt:
            'Cases like this illustrate how the guilds could prevent [22] and stop skilled people from working.',
          answerKey: 'innovation',
          acceptedAlternatives: ['innovation'],
          explanation:
            "Section D concludes: 'The dominance of guilds not only prevented people from using their skills, but also held back even the simplest industrial innovation.'",
          evidenceQuote: 'held back even the simplest industrial innovation.',
          paragraphRef: 'D',
        },
      ],
    },

    // PASSAGE 2: Questions 23-24 (Multiple Choice Multi-Select)
    {
      id: 'c17-r4-g5',
      passageId: 'c17-r4-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions:
        'Choose TWO letters, A–E.\n\nWrite the correct letters in boxes 23 and 24 on your answer sheet.\n\nWhich TWO of the following statements does the writer make about literacy rates in Section B?',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: LITERACY_P2_OPTIONS,
      questions: [
        {
          id: 'c17-r4-q23',
          questionNumber: 23,
          prompt:
            'Which TWO of the following statements does the writer make about literacy rates in Section B? (First choice)',
          options: LITERACY_P2_OPTIONS,
          answerKey: ['B', 'E'],
          acceptedAlternatives: ['B', 'E'],
          explanation:
            "Section B states: 'During this period, Germany and Scandinavia had excellent literacy rates...' (B - very good literacy rates in Germany) and 'even though there is plenty of evidence that growth increases education' (E - economic growth can help to improve literacy rates).",
          evidenceQuote:
            'During this period, Germany and Scandinavia had excellent literacy rates... even though there is plenty of evidence that growth increases education',
          paragraphRef: 'B',
        },
        {
          id: 'c17-r4-q24',
          questionNumber: 24,
          prompt:
            'Which TWO of the following statements does the writer make about literacy rates in Section B? (Second choice)',
          options: LITERACY_P2_OPTIONS,
          answerKey: ['B', 'E'],
          acceptedAlternatives: ['B', 'E'],
          explanation:
            "Section B states: 'During this period, Germany and Scandinavia had excellent literacy rates...' (B - very good literacy rates in Germany) and 'even though there is plenty of evidence that growth increases education' (E - economic growth can help to improve literacy rates).",
          evidenceQuote:
            'During this period, Germany and Scandinavia had excellent literacy rates... even though there is plenty of evidence that growth increases education',
          paragraphRef: 'B',
        },
      ],
    },

    // PASSAGE 2: Questions 25-26 (Multiple Choice Multi-Select)
    {
      id: 'c17-r4-g6',
      passageId: 'c17-r4-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 25 and 26',
      instructions:
        'Choose TWO letters, A–E.\n\nWrite the correct letters in boxes 25 and 26 on your answer sheet.\n\nWhich TWO of the following statements does the writer make in Section F about guilds in German-speaking Central Europe between 1600 and 1900?',
      startQuestionNumber: 25,
      endQuestionNumber: 26,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: GUILDS_P2_OPTIONS,
      questions: [
        {
          id: 'c17-r4-q25',
          questionNumber: 25,
          prompt:
            'Which TWO of the following statements does the writer make in Section F about guilds in German-speaking Central Europe between 1600 and 1900? (First choice)',
          options: GUILDS_P2_OPTIONS,
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation:
            "Section F states: 'In villages throughout the region, guilds blocked labour migration...' (B - opposed people moving to an area for work) and 'legislated against anything that undermined their monopolies... and resisted changes that might reduce their influence' (D - opposed practices that threatened their control over a trade).",
          evidenceQuote:
            'In villages throughout the region, guilds blocked labour migration and resisted changes that might reduce their influence.',
          paragraphRef: 'F',
        },
        {
          id: 'c17-r4-q26',
          questionNumber: 26,
          prompt:
            'Which TWO of the following statements does the writer make in Section F about guilds in German-speaking Central Europe between 1600 and 1900? (Second choice)',
          options: GUILDS_P2_OPTIONS,
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation:
            "Section F states: 'In villages throughout the region, guilds blocked labour migration...' (B - opposed people moving to an area for work) and 'legislated against anything that undermined their monopolies... and resisted changes that might reduce their influence' (D - opposed practices that threatened their control over a trade).",
          evidenceQuote:
            'In villages throughout the region, guilds blocked labour migration and resisted changes that might reduce their influence.',
          paragraphRef: 'F',
        },
      ],
    },

    // PASSAGE 3: Questions 27-32 (Matching Information)
    {
      id: 'c17-r4-g7',
      passageId: 'c17-r4-p3',
      questionType: 'matching_information',
      title: 'Questions 27–32',
      instructions:
        'Reading Passage 3 has eight paragraphs, A–H.\n\nWhich paragraph contains the following information?\n\nWrite the correct letter, A–H, in boxes 27–32 on your answer sheet.\n\nNB You may use any letter more than once.',
      startQuestionNumber: 27,
      endQuestionNumber: 32,
      optionsList: MATCHING_PARAGRAPHS_P3_OPTIONS,
      allowMultipleUse: true,
      questions: [
        {
          id: 'c17-r4-q27',
          questionNumber: 27,
          prompt: 'a reference to earlier examples of blindfold chess',
          options: MATCHING_PARAGRAPHS_P3_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph D states: 'The first recorded game in Europe was played in 13th-century Florence. In 1947, the Argentinian grandmaster Miguel Najdorf played 45 simultaneous games in his mind...'",
          evidenceQuote:
            'The first recorded game in Europe was played in 13th-century Florence. In 1947, the Argentinian grandmaster Miguel Najdorf played 45 simultaneous games in his mind',
          paragraphRef: 'D',
        },
        {
          id: 'c17-r4-q28',
          questionNumber: 28,
          prompt: 'an outline of what blindfold chess involves',
          options: MATCHING_PARAGRAPHS_P3_OPTIONS,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph E outlines: 'Not only must the positions of each piece on every board be memorised, they must be recalled faithfully when needed, updated with each player’s moves, and then reliably stored again, so the brain can move on to the next board.'",
          evidenceQuote:
            'Not only must the positions of each piece on every board be memorised, they must be recalled faithfully when needed, updated with each player’s moves, and then reliably stored again',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r4-q29',
          questionNumber: 29,
          prompt: 'a claim that Gareyev’s skill is limited to chess',
          options: MATCHING_PARAGRAPHS_P3_OPTIONS,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph F states: '‘He was not exceptional on any of these standard tests,’ said Rissman. ‘We didn’t find anything other than playing chess that he seems to be supremely gifted at.’'",
          evidenceQuote:
            'We didn’t find anything other than playing chess that he seems to be supremely gifted at.',
          paragraphRef: 'F',
        },
        {
          id: 'c17-r4-q30',
          questionNumber: 30,
          prompt: 'why Gareyev’s skill is of interest to scientists',
          options: MATCHING_PARAGRAPHS_P3_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph B explains: 'In the hope of understanding how he and others like him can perform such mental feats, researchers at the University of California in Los Angeles (UCLA) called him in for tests.'",
          evidenceQuote:
            'In the hope of understanding how he and others like him can perform such mental feats, researchers at the University of California in Los Angeles (UCLA) called him in for tests.',
          paragraphRef: 'B',
        },
        {
          id: 'c17-r4-q31',
          questionNumber: 31,
          prompt: 'an outline of Gareyev’s priorities',
          options: MATCHING_PARAGRAPHS_P3_OPTIONS,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Paragraph H states: '‘I don’t worry too much about the winning percentage, that’s never been an issue for me,’ he said. ‘The most important part of blindfold chess for me is that I have found the one thing that I can fully dedicate myself to.’'",
          evidenceQuote:
            'The most important part of blindfold chess for me is that I have found the one thing that I can fully dedicate myself to.',
          paragraphRef: 'H',
        },
        {
          id: 'c17-r4-q32',
          questionNumber: 32,
          prompt: 'a reason why the last part of a game may be difficult',
          options: MATCHING_PARAGRAPHS_P3_OPTIONS,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph E explains: 'But the ends of games are taxing too, as exhaustion sets in. When Gareyev is tired, his recall can get patchy.'",
          evidenceQuote: 'But the ends of games are taxing too, as exhaustion sets in.',
          paragraphRef: 'E',
        },
      ],
    },

    // PASSAGE 3: Questions 33-36 (True / False / Not Given)
    {
      id: 'c17-r4-g8',
      passageId: 'c17-r4-p3',
      questionType: 'true_false_not_given',
      title: 'Questions 33–36',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 3?\n\nIn boxes 33–36 on your answer sheet, write\n\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information about this',
      startQuestionNumber: 33,
      endQuestionNumber: 36,
      questions: [
        {
          id: 'c17-r4-q33',
          questionNumber: 33,
          prompt: 'In the forthcoming games, all the participants will be blindfolded.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph A states: 'While his challengers will play the games as normal, Gareyev himself will be blindfolded.' This directly contradicts 'all the participants will be blindfolded'.",
          evidenceQuote:
            'While his challengers will play the games as normal, Gareyev himself will be blindfolded.',
          paragraphRef: 'A',
        },
        {
          id: 'c17-r4-q34',
          questionNumber: 34,
          prompt: 'Gareyev has won competitions in BASE jumping.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph A mentions that Gareyev 'gets his kicks from the adventure sport of BASE jumping', but says nothing about whether he has competed or won competitions in it.",
          evidenceQuote: 'he gets his kicks from the adventure sport of BASE jumping.',
          paragraphRef: 'A',
        },
        {
          id: 'c17-r4-q35',
          questionNumber: 35,
          prompt:
            'UCLA is the first university to carry out research into blindfold chess players.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph B mentions researchers at UCLA testing Gareyev, but does not claim that UCLA was the first university to study blindfold chess players.",
          evidenceQuote:
            'researchers at the University of California in Los Angeles (UCLA) called him in for tests.',
          paragraphRef: 'B',
        },
        {
          id: 'c17-r4-q36',
          questionNumber: 36,
          prompt: 'Good chess players are likely to be able to play blindfold chess.',
          options: [
            { label: 'TRUE', text: 'TRUE' },
            { label: 'FALSE', text: 'FALSE' },
            { label: 'NOT GIVEN', text: 'NOT GIVEN' },
          ],
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph B and E state: '‘The ability to play a game of chess with your eyes closed is not a far reach for most accomplished players,’ said Jesse Rissman...' and '‘A lot of players are capable of doing what I’m doing.’'",
          evidenceQuote:
            'The ability to play a game of chess with your eyes closed is not a far reach for most accomplished players',
          paragraphRef: 'B',
        },
      ],
    },

    // PASSAGE 3: Questions 37-40 (Summary Completion)
    {
      id: 'c17-r4-g9',
      passageId: 'c17-r4-p3',
      questionType: 'summary_completion_words',
      title: 'Questions 37–40',
      instructions:
        'Complete the summary below.\n\nChoose ONE WORD ONLY from the passage for each answer.\n\nWrite your answers in boxes 37–40 on your answer sheet.',
      startQuestionNumber: 37,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `How the research was carried out

The researchers started by testing Gareyev’s [[37]]; for example, he was required to recall a string of [[38]] in order and also in reverse order. Although his performance was normal, scans showed an unusual amount of [[39]] within the areas of Gareyev’s brain that are concerned with directing attention. In addition, the scans raised the possibility of unusual strength in the parts of his brain that deal with [[40]] input.`,
      questions: [
        {
          id: 'c17-r4-q37',
          questionNumber: 37,
          prompt: 'The researchers started by testing Gareyev’s [37]',
          answerKey: 'memory',
          acceptedAlternatives: ['memory'],
          explanation:
            "Paragraph F states: 'The scientists first had Gareyev perform some standard memory tests.'",
          evidenceQuote:
            'The scientists first had Gareyev perform some standard memory tests.',
          paragraphRef: 'F',
        },
        {
          id: 'c17-r4-q38',
          questionNumber: 38,
          prompt:
            'for example, he was required to recall a string of [38] in order and also in reverse order.',
          answerKey: 'numbers',
          acceptedAlternatives: ['numbers'],
          explanation:
            "Paragraph F states: 'One classic test measures how many numbers a person can repeat, both forwards and backwards, soon after hearing them.'",
          evidenceQuote:
            'measures how many numbers a person can repeat, both forwards and backwards',
          paragraphRef: 'F',
        },
        {
          id: 'c17-r4-q39',
          questionNumber: 39,
          prompt:
            'scans showed an unusual amount of [39] within the areas of Gareyev’s brain that are concerned with directing attention.',
          answerKey: 'communication',
          acceptedAlternatives: ['communication'],
          explanation:
            "Paragraph F states: 'the scans found much greater than average communication between parts of Gareyev’s brain that make up what is called the frontoparietal control network... It helps you to allocate attention...'",
          evidenceQuote:
            'the scans found much greater than average communication between parts of Gareyev’s brain that make up what is called the frontoparietal control network.',
          paragraphRef: 'F',
        },
        {
          id: 'c17-r4-q40',
          questionNumber: 40,
          prompt:
            'In addition, the scans raised the possibility of unusual strength in the parts of his brain that deal with [40] input.',
          answerKey: 'visual',
          acceptedAlternatives: ['visual'],
          explanation:
            "Paragraph G states: 'The scans also suggest that Gareyev’s visual network is more highly connected to other brain parts than usual. Initial results suggest that the areas of his brain that process visual images... may have stronger links to other brain regions, and so be more powerful than normal.'",
          evidenceQuote: 'areas of his brain that process visual images',
          paragraphRef: 'G',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 17 Academic Reading Test 4',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge17ReadingTest4(authorId?: string) {
  const data = getCambridge17ReadingTest4Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 17 Reading Test 4 data validation failed:\n- ${errors.join('\n- ')}`
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
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%17%Academic%Reading%Test 4%' LIMIT 1"
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
