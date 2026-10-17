import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge17ReadingTest1Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c17-r1-p1',
      passageNumber: 1,
      title: 'The development of the London underground railway',
      subtitle:
        'In the nineteenth century, London faced severe traffic congestion. The solution was the world’s first underground railway network.\n\nYou should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c17-r1-p1-1',
          label: '1',
          content: `In the first half of the 1800s, London's population grew at an astonishing rate, and the central area became increasingly congested. In addition, the expansion of the overground railway network resulted in more and more passengers arriving in the capital. However, in 1846, a Royal Commission decided that the railways should not be allowed to enter the City, the capital's historic and business centre. The result was that the overground railway stations formed a ring around the City. The area within consisted of poorly built, overcrowded slums and the streets were full of horse-drawn traffic. Crossing the City became a nightmare. It could take an hour and a half to travel 8 km by horse-drawn carriage or bus.`,
        },
        {
          id: 'c17-r1-p1-2',
          label: '2',
          content: `Numerous schemes were proposed to resolve the problems, but few succeeded. Amongst the most vocal advocates for a solution to London's traffic problems was Charles Pearson, who worked as a solicitor for the City of London. He saw both social and economic advantages in building an underground railway that would link the overground railway stations together and clear London slums at the same time. His idea was to relocate the poor workers who lived in the inner-city slums to newly constructed suburbs, and to provide cheap rail travel for them to get to work. Pearson's ideas gained support amongst some businessmen and in 1851 he submitted a plan to Parliament. It was rejected, but Pearson persisted, and in 1854 a Royal Commission finally approved the construction of an underground railway.`,
        },
        {
          id: 'c17-r1-p1-3',
          label: '3',
          content: `The newly formed Metropolitan Railway Company struggled at first to raise the necessary capital. Pearson used his influence to persuade the City of London to invest, while critical articles about the scheme appeared in the press, questioning its viability. The Great Western Railway (GWR), aware that the new line would finally enable them to run trains into the heart of the City, invested almost £250,000 in the scheme. Eventually, over a five-year period, £1m was raised. The chosen route ran beneath existing main roads to minimise the expense of demolishing buildings. Originally scheduled to be completed in 21 months, the construction of the underground line took three years. It was built just below street level using a technique known as 'cut and cover'. A trench about ten metres wide and six metres deep was dug, and the sides temporarily held up with timber beams. Brick walls were then constructed, and finally a brick arch was added to create a tunnel.`,
        },
        {
          id: 'c17-r1-p1-4',
          label: '4',
          content: `A two-metre-deep layer of soil was laid on top of the tunnel and the road above rebuilt. The Metropolitan line, which opened on 10 January 1863, was the world's first underground railway. On its first day, almost 40,000 passengers were carried between Paddington and Farringdon, the journey taking about 18 minutes. By the end of the Metropolitan's first year of operation, 9.5 million journeys had been made. Even as the Metropolitan began operation, the first extensions to the line were being authorised; these were built over the next five years, reaching Moorgate in the east to London and Hammersmith in the west. However, the smoke and fumes from steam engines remained a persistent headache. Although ventilation shafts and condensation systems on locomotives were introduced, they failed to prevent pollution, and the air in the tunnels remained thick with sulfurous steam.`,
        },
        {
          id: 'c17-r1-p1-5',
          label: '5',
          content: `Despite the extension of the underground railway, by the 1880s, congestion on London's streets had become worse. The problem was partly that the existing underground lines formed a circuit around the centre of London and extended to the suburbs, but did not cross the capital's centre. The 'cut and cover' method of construction was not an option in this part of the capital because the surface disruption to the dense commercial and financial heart of London would have been unacceptable. The only alternative was to tunnel deep underground. Although the technology to create these tunnels existed, steam locomotives could not be used in such a confined space without adequate ventilation.`,
        },
        {
          id: 'c17-r1-p1-6',
          label: '6',
          content: `It wasn't until the development of a reliable electric motor, and a means of transferring power from the generator to a moving train, that the world's first deep-level electric railway, the City & South London, became possible. The line opened in 1890, and ran from the City to Stockwell, south of the River Thames. The trains were made up of three carriages and driven by electric engines. The carriages were narrow and had tiny windows just below the roof because it was thought that passengers would not want to look out at the tunnel walls. The line was not without its problems, mainly caused by an unreliable power supply. Although the City & South London Railway was a great technical achievement, it did not make a profit. Then, in 1900, the Central London Railway, known as the 'Tuppenny Tube', began operation using new electric locomotives. It was very popular and soon afterwards new railways and extensions were added to the growing tube network. By 1907, the heart of today's Underground system was in place.`,
        },
      ],
    },
    {
      id: 'c17-r1-p2',
      passageNumber: 2,
      title: 'Stadiums: past, present and future',
      subtitle:
        'From ancient Roman amphitheatres to futuristic energy-generating urban powerhouses, the evolution of sports stadiums mirrors the social and technological transformations of human cities.\n\nYou should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c17-r1-p2-A',
          label: 'A',
          content: `Stadiums are among the oldest forms of urban architecture: vast stadiums where the public could watch sporting events were at the centre of western city life as far back as the ancient Greek and Roman Empires, well before the construction of the great medieval cathedrals and the grand 19th- and 20th-century railway stations which dominated urban skylines in later eras. Today, however, stadiums are regarded with growing scepticism. Construction costs can soar above £1 billion, and stadiums finished for major events such as the Olympic Games or the FIFA World Cup have notably fallen into disuse and disrepair. But this need not be the case. History shows that stadiums can drive urban development and adapt to the culture of every age. Even today, architects and planners are finding new ways to adapt the mono-functional sports arenas which became emblematic of modernisation during the 20th century.`,
        },
        {
          id: 'c17-r1-p2-B',
          label: 'B',
          content: `The amphitheatre of Arles in southwest France, with a capacity of 25,000 spectators, is perhaps the best example of just how versatile stadiums can be. Built by the Romans in 90 AD, it became a fortress with four towers after the fifth century, and was then transformed into a village containing more than 200 houses. With the growing interest in conservation during the 19th century, it was converted back into an arena for the staging of bullfights, thereby returning the structure to its original use as a venue for public spectacles. Another example is the imposing arena of Verona in northern Italy, with space for 30,000 spectators, which was built 60 years before the Arles amphitheatre and 40 years before Rome's famous Colosseum. It has endured the centuries and is currently considered one of the world's prime sites for opera, thanks to its outstanding acoustics.`,
        },
        {
          id: 'c17-r1-p2-C',
          label: 'C',
          content: `The area in the centre of the Italian town of Lucca, known as the Piazza dell' Anfiteatro, is yet another impressive example of an amphitheatre becoming absorbed into the fabric of the city. The site evolved in a similar way to Arles and was progressively filled with buildings from the Middle Ages until the 19th century, variously used as houses, a salt depot and a prison. But rather than reverting to an arena, today, the ruins of the amphitheatre remain embedded in the various shops and residences surrounding the public square.`,
        },
        {
          id: 'c17-r1-p2-D',
          label: 'D',
          content: `There are many similarities between modern stadiums and the ancient amphitheatres in terms of their scale and design, but there are also significant differences. In the 20th century, stadiums lost the flexibility of earlier structures. Instead, they became single-purpose architectural monuments dedicated exclusively to sporting spectacles. The advent of steel and reinforced concrete, combined with electric floodlighting for night-time events, allowed for ever larger capacities. But this came at a cost: twentieth-century stadiums were often built on the periphery of cities, surrounded by vast oceans of car parking. As a result, they became isolated from urban life, deserted and inaccessible except on match days, consuming large amounts of energy and generating considerable urban heat islands.`,
        },
        {
          id: 'c17-r1-p2-E',
          label: 'E',
          content: `In recent decades, however, architects have begun to rethink the role of the stadium in the contemporary city. The aim is to create multi-functional destinations that remain active throughout the week and bring life back into the urban core. Modern stadiums frequently incorporate an astonishing range of auxiliary amenities, including hotels, corporate conference facilities, shopping malls, fitness centres, and restaurants, as well as publicly accessible green spaces, playgrounds, and plazas. By integrating such diverse activities, these facilities serve not just sports fans on weekend afternoons, but a broad cross-section of the local community every day of the year.`,
        },
        {
          id: 'c17-r1-p2-F',
          label: 'F',
          content: `At the same time, stadium design is embracing the urgent imperative of ecological sustainability. Rather than being huge drains on local resources, the next generation of stadiums is designed to operate as green power stations. For instance, the Freiburg Mage Solar Stadium in Germany and the Kaohsiung Stadium in Taiwan are equipped with extensive photovoltaic arrays. The Kaohsiung Stadium incorporates 8,844 solar panels integrated into its canopy roof, generating up to 1.14 million kilowatt-hours of clean electricity per year and reducing carbon dioxide emissions by approximately 660 tons annually. Connected to smart power grids, these stadiums produce far more electricity than they consume, feeding excess renewable energy back into surrounding neighbourhoods when sports events are not taking place.`,
        },
        {
          id: 'c17-r1-p2-G',
          label: 'G',
          content: `The historical trajectory of the stadium demonstrates that these monumental structures need not be unsustainable white elephants. From the multipurpose gathering places of antiquity to the fortified communities of the medieval era, and onward to the self-sustaining, eco-friendly civic hubs of the 21st century, stadiums have consistently reflected the values, technologies, and social needs of the societies that built them. As cities worldwide continue to grow and face the realities of climate change and rapid urbanization, modern stadiums have the potential to once again become dynamic, central catalysts for civic life.`,
        },
      ],
    },
    {
      id: 'c17-r1-p3',
      passageNumber: 3,
      title: 'To catch a king',
      subtitle:
        "Anna Keay reviews Charles Spencer's book about the thrilling hunt for King Charles II during the English Civil War of the seventeenth century.\n\nYou should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.",
      paragraphs: [
        {
          id: 'c17-r1-p3-1',
          label: '1',
          content: `Charles Spencer's latest book, To Catch a King, tells us the story of the hunt for King Charles II in the six weeks after his resounding defeat at the Battle of Worcester in September 1651. And what a story it is. After his father was executed by the Parliamentarians in 1649, the young Charles II sacrificed one of the very principles his father had died for and did a deal with the Scots, thereby accepting Presbyterianism as the national religion in return for being crowned King of Scots. His arrival in Edinburgh prompted the English Parliamentary army to invade Scotland in a pre-emptive strike. This was followed by a Scottish invasion of England. The two sides finally faced one another at Worcester in the west of England in 1651. After being comprehensively defeated on the meadows outside the city by the Parliamentarian army, the 21-year-old king found himself the subject of a national manhunt, with a huge sum offered for his capture. Over the following six weeks he managed, through a series of heart-poundingly close escapes, to evade the Parliamentarians before seeking refuge in France. For the next nine years, the penniless and defeated Charles wandered around Europe with only a small group of loyal supporters.`,
        },
        {
          id: 'c17-r1-p3-2',
          label: '2',
          content: `Years later, after his restoration as king, the 50-year-old Charles II requested a meeting with the writer and diarist Samuel Pepys. His intention when asking Pepys to commit his story to paper was to ensure that this most extraordinary episode was never forgotten. Over two three-hour sittings, the king related to him in great detail his personal recollections of the six weeks he had spent as a fugitive. As the king and secretary settled down (a scene that is surely a gift for a future scriptwriter), Charles commenced his story: 'After the battle was so absolutely lost as to be beyond hope of recovery, I began to think of the best way of saving myself.'`,
        },
        {
          id: 'c17-r1-p3-3',
          label: '3',
          content: `One of the joys of Spencer's book, a result not least of its use of Charles II's own narrative as told to Pepys, is just how close the reader gets to the action. The day-by-day recounting of the fugitive king's movements makes the drama vivid and immediate. We read of Charles disguised as a servant, hiding in an oak tree at Boscobel House, wading across muddy streams in the dark, and walking till his feet were blistered and bloody. We encounter the loyal Catholic families, country doctors, and innkeepers who risked their lives to shelter him, and we share the fugitives' anxious moments when suspicious soldiers entered the inns where they stayed. These gripping details show how close Charles came to being apprehended at every turn, bringing the perilous journey to life.`,
        },
        {
          id: 'c17-r1-p3-4',
          label: '4',
          content: `Charles's decision to preserve this narrative in such meticulous detail is revealing. For him, this was not merely a memory of humiliation and defeat, but a crowning personal adventure. Kings normally celebrated glorious military victories, triumphal entries, and grand coronations. Charles, however, chose to celebrate what was essentially a defeat—a catastrophic routing that sent him into penury and exile. Yet in his eyes, his cunning evasions, physical endurance, and ability to inspire loyalty across social classes proved his divine right to rule just as convincingly as any battlefield triumph.`,
        },
        {
          id: 'c17-r1-p3-5',
          label: '5',
          content: `Spencer handles the historical context with commendable skill. While it would be easy to turn the story into a simple tale of royal romance versus puritanical villainy, Spencer resists the temptation. He displays an even-handed sympathy for both the fugitive king and the fierce republican regime that hunted him. He acknowledges the genuine religious and political convictions of the Parliamentary soldiers while admiring the bravery and resourcefulness of those who assisted Charles. This balanced perspective lends historical weight to what could otherwise have read as mere swashbuckling fiction.`,
        },
        {
          id: 'c17-r1-p3-6',
          label: '6',
          content: `If the book has a flaw, it is that Spencer occasionally doesn't quite hit the mark when reflecting on the broader psychological and historical consequences of the episode. While the adventure itself is brilliantly recounted, the author fails to address whether Charles II's harrowing experiences as a hunted fugitive had a lasting influence on him once he was restored to the throne. Did the experience make him more tolerant, more suspicious, or more cynical? Spencer leaves this intriguing question largely unanswered. Nonetheless, To Catch a King is a splendid piece of narrative history that captures one of the most thrilling episodes in British royal history.`,
        },
      ],
    },
  ];

  const SECTION_OPTIONS = [
    { key: 'A', text: 'Section A' },
    { key: 'B', text: 'Section B' },
    { key: 'C', text: 'Section C' },
    { key: 'D', text: 'Section D' },
    { key: 'E', text: 'Section E' },
    { key: 'F', text: 'Section F' },
    { key: 'G', text: 'Section G' },
  ];

  const SUMMARY_OPTIONS_BOX_P3 = [
    { key: 'A', text: 'military innovation' },
    { key: 'B', text: 'large reward' },
    { key: 'C', text: 'widespread conspiracy' },
    { key: 'D', text: 'relative safety' },
    { key: 'E', text: 'new government' },
    { key: 'F', text: 'decisive victory' },
    { key: 'G', text: 'political debate' },
    { key: 'H', text: 'strategic alliance' },
    { key: 'I', text: 'popular solution' },
    { key: 'J', text: 'religious conviction' },
  ];

  const MC_Q23_24_OPTIONS = [
    { key: 'A', text: 'They are less imaginatively designed.' },
    { key: 'B', text: 'They are less spacious.' },
    { key: 'C', text: 'They are in less convenient locations.' },
    { key: 'D', text: 'They are less versatile.' },
    { key: 'E', text: 'They are made of less durable materials.' },
  ];

  const MC_Q25_26_OPTIONS = [
    { key: 'A', text: 'offering improved amenities for the enjoyment of sports events' },
    { key: 'B', text: 'bringing community life back into the city environment' },
    { key: 'C', text: 'facilitating research into solar and wind energy solutions' },
    { key: 'D', text: 'enabling local residents to reduce their consumption of electricity' },
    { key: 'E', text: 'providing a suitable site for the installation of renewable power generators' },
  ];

  const MC_Q36_OPTIONS = [
    { key: 'A', text: 'to describe what happened during the Battle of Worcester' },
    { key: 'B', text: "to give an account of the circumstances leading to Charles II's escape" },
    { key: 'C', text: "to provide details of the Parliamentarians' political views" },
    { key: 'D', text: "to compare Charles II's beliefs with those of his father" },
  ];

  const MC_Q37_OPTIONS = [
    { key: 'A', text: 'to explain how close Charles II came to losing his life' },
    { key: 'B', text: "to suggest that Charles II's supporters were badly prepared" },
    { key: 'C', text: 'to illustrate how the events of the six weeks are brought to life' },
    { key: 'D', text: 'to argue that certain aspects are not as well known as they should be' },
  ];

  const MC_Q38_OPTIONS = [
    { key: 'A', text: 'He chose to celebrate what was essentially a defeat.' },
    { key: 'B', text: 'He misunderstood the motives of his opponents.' },
    { key: 'C', text: "He aimed to restore people's faith in the monarchy." },
    { key: 'D', text: 'He was driven by a desire to be popular.' },
  ];

  const MC_Q39_OPTIONS = [
    { key: 'A', text: 'His decision to write the book comes as a surprise.' },
    { key: 'B', text: 'He takes an unbiased approach to the subject matter.' },
    { key: 'C', text: 'His descriptions of events would be better if they included more detail.' },
    { key: 'D', text: 'He chooses language that is suitable for a twenty-first-century audience.' },
  ];

  const MC_Q40_OPTIONS = [
    { key: 'A', text: 'it overlooks the impact of events on ordinary people.' },
    { key: 'B', text: 'it lacks an analysis of prevalent views on monarchy.' },
    { key: 'C', text: 'it omits any references to the deceit practised by Charles II during his time in hiding.' },
    { key: 'D', text: "it fails to address whether Charles II's experiences had a lasting influence on him." },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-6 (Note Completion)
    {
      id: 'c17-r1-g1',
      passageId: 'c17-r1-p1',
      questionType: 'note_completion',
      title: 'Questions 1–6',
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–6 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `The London underground railway

The problem
• The [[1]] of London increased rapidly between 1800 and 1850
• The streets were full of horse-drawn vehicles

The proposed solution
• Charles Pearson suggested building an underground railway
• Building the railway would make it possible to move people to better housing in the [[2]]
• A number of [[3]] agreed with Pearson's idea
• The company initially had problems getting the [[4]] needed for the project
• Negative articles about the project appeared in the [[5]]

The construction
• The first section of underground railway used the 'cut and cover' method
• A trench was dug and timber beams used to hold up the sides
• A brick tunnel was built and covered with [[6]]
• The road above was rebuilt`,
      questions: [
        {
          id: 'c17-r1-q1',
          questionNumber: 1,
          prompt: 'The [1] of London increased rapidly between 1800 and 1850',
          answerKey: 'population',
          acceptedAlternatives: ['population'],
          explanation:
            "Paragraph 1 states: 'In the first half of the 1800s, London's population grew at an astonishing rate, and the central area became increasingly congested.'",
          evidenceQuote: "London's population grew at an astonishing rate",
          paragraphRef: '1',
        },
        {
          id: 'c17-r1-q2',
          questionNumber: 2,
          prompt: 'Building the railway would make it possible to move people to better housing in the [2]',
          answerKey: 'suburbs',
          acceptedAlternatives: ['suburbs', 'suburb'],
          explanation:
            "Paragraph 2 states: 'His idea was to relocate the poor workers who lived in the inner-city slums to newly constructed suburbs, and to provide cheap rail travel for them to get to work.'",
          evidenceQuote: 'relocate the poor workers who lived in the inner-city slums to newly constructed suburbs',
          paragraphRef: '2',
        },
        {
          id: 'c17-r1-q3',
          questionNumber: 3,
          prompt: "A number of [3] agreed with Pearson's idea",
          answerKey: 'businessmen',
          acceptedAlternatives: ['businessmen', 'business people'],
          explanation:
            "Paragraph 2 states: 'Pearson's ideas gained support amongst some businessmen and in 1851 he submitted a plan to Parliament.'",
          evidenceQuote: "Pearson's ideas gained support amongst some businessmen",
          paragraphRef: '2',
        },
        {
          id: 'c17-r1-q4',
          questionNumber: 4,
          prompt: 'The company initially had problems getting the [4] needed for the project',
          answerKey: 'funding',
          acceptedAlternatives: ['funding', 'finance'],
          explanation:
            "Paragraph 3 states: 'The newly formed Metropolitan Railway Company struggled at first to raise the necessary capital.' Pearson then used his influence to secure funding.",
          evidenceQuote: 'struggled at first to raise the necessary capital',
          paragraphRef: '3',
        },
        {
          id: 'c17-r1-q5',
          questionNumber: 5,
          prompt: 'Negative articles about the project appeared in the [5]',
          answerKey: 'press',
          acceptedAlternatives: ['press', 'the press'],
          explanation:
            "Paragraph 3 states: 'while critical articles about the scheme appeared in the press, questioning its viability.'",
          evidenceQuote: 'critical articles about the scheme appeared in the press',
          paragraphRef: '3',
        },
        {
          id: 'c17-r1-q6',
          questionNumber: 6,
          prompt: 'A brick tunnel was built and covered with [6]',
          answerKey: 'soil',
          acceptedAlternatives: ['soil'],
          explanation:
            "Paragraph 4 states: 'A two-metre-deep layer of soil was laid on top of the tunnel and the road above rebuilt.'",
          evidenceQuote: 'A two-metre-deep layer of soil was laid on top of the tunnel',
          paragraphRef: '4',
        },
      ],
    },

    // PASSAGE 1: Questions 7-13 (TRUE / FALSE / NOT GIVEN)
    {
      id: 'c17-r1-g2',
      passageId: 'c17-r1-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 7–13',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 7–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 7,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c17-r1-q7',
          questionNumber: 7,
          prompt: 'Other countries had built underground railways before the Metropolitan line opened.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 4 states: 'The Metropolitan line, which opened on 10 January 1863, was the world's first underground railway.' Therefore, no other countries had built one prior.",
          evidenceQuote: "The Metropolitan line, which opened on 10 January 1863, was the world's first underground railway.",
          paragraphRef: '4',
        },
        {
          id: 'c17-r1-q8',
          questionNumber: 8,
          prompt: 'More people than predicted travelled on the Metropolitan line on the first day.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 4 states that almost 40,000 passengers were carried on the first day, but there is no mention of any prior predictions.",
          evidenceQuote: 'On its first day, almost 40,000 passengers were carried between Paddington and Farringdon',
          paragraphRef: '4',
        },
        {
          id: 'c17-r1-q9',
          questionNumber: 9,
          prompt: 'The use of ventilation shafts failed to prevent pollution in the tunnels.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 4 states: 'Although ventilation shafts and condensation systems on locomotives were introduced, they failed to prevent pollution, and the air in the tunnels remained thick with sulfurous steam.'",
          evidenceQuote: 'they failed to prevent pollution, and the air in the tunnels remained thick with sulfurous steam.',
          paragraphRef: '4',
        },
        {
          id: 'c17-r1-q10',
          questionNumber: 10,
          prompt: "A different approach from the 'cut and cover' technique was required in London's central area.",
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 5 states: 'The \"cut and cover\" method of construction was not an option in this part of the capital... The only alternative was to tunnel deep underground.'",
          evidenceQuote: "The 'cut and cover' method of construction was not an option in this part of the capital... The only alternative was to tunnel deep underground.",
          paragraphRef: '5',
        },
        {
          id: 'c17-r1-q11',
          questionNumber: 11,
          prompt: 'The windows on City & South London trains were at eye level.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 6 contradicts this: 'The carriages were narrow and had tiny windows just below the roof because it was thought that passengers would not want to look out at the tunnel walls.' Windows just below the roof are not at eye level.",
          evidenceQuote: 'The carriages were narrow and had tiny windows just below the roof',
          paragraphRef: '6',
        },
        {
          id: 'c17-r1-q12',
          questionNumber: 12,
          prompt: 'The City & South London Railway was a financial success.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 6 directly contradicts this: 'Although the City & South London Railway was a great technical achievement, it did not make a profit.'",
          evidenceQuote: 'Although the City & South London Railway was a great technical achievement, it did not make a profit.',
          paragraphRef: '6',
        },
        {
          id: 'c17-r1-q13',
          questionNumber: 13,
          prompt: "Trains on the 'Tuppenny Tube' nearly always ran on time.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 6 states that the Central London Railway ('Tuppenny Tube') was very popular and began operation using electric locomotives, but says nothing about whether its trains ran on time.",
          evidenceQuote: "Then, in 1900, the Central London Railway, known as the 'Tuppenny Tube', began operation using new electric locomotives. It was very popular",
          paragraphRef: '6',
        },
      ],
    },

    // PASSAGE 2: Questions 14-17 (Matching Information)
    {
      id: 'c17-r1-g3',
      passageId: 'c17-r1-p2',
      questionType: 'matching_information',
      title: 'Questions 14–17',
      instructions:
        'Reading Passage 2 has seven sections, A–G.\nWhich section contains the following information?\nWrite the correct letter, A–G, in boxes 14–17 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 17,
      optionsList: SECTION_OPTIONS,
      questions: [
        {
          id: 'c17-r1-q14',
          questionNumber: 14,
          prompt: 'a mention of negative attitudes towards stadium building projects',
          options: SECTION_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section A notes: 'Today, however, stadiums are regarded with growing scepticism. Construction costs can soar above £1 billion, and stadiums finished for major events... have notably fallen into disuse and disrepair.'",
          evidenceQuote: 'stadiums are regarded with growing scepticism. Construction costs can soar above £1 billion, and stadiums finished for major events... have notably fallen into disuse and disrepair.',
          paragraphRef: 'A',
        },
        {
          id: 'c17-r1-q15',
          questionNumber: 15,
          prompt: 'figures demonstrating the environmental benefits of a certain stadium',
          options: SECTION_OPTIONS,
          answerKey: 'F',
          explanation:
            "Section F gives specific figures for Kaohsiung Stadium: '8,844 solar panels integrated into its canopy roof, generating up to 1.14 million kilowatt-hours of clean electricity per year and reducing carbon dioxide emissions by approximately 660 tons annually.'",
          evidenceQuote: '8,844 solar panels integrated into its canopy roof, generating up to 1.14 million kilowatt-hours of clean electricity per year and reducing carbon dioxide emissions by approximately 660 tons annually.',
          paragraphRef: 'F',
        },
        {
          id: 'c17-r1-q16',
          questionNumber: 16,
          prompt: 'examples of the wide range of facilities available at some new stadiums',
          options: SECTION_OPTIONS,
          answerKey: 'E',
          explanation:
            "Section E details the facilities: 'Modern stadiums frequently incorporate an astonishing range of auxiliary amenities, including hotels, corporate conference facilities, shopping malls, fitness centres, and restaurants, as well as publicly accessible green spaces, playgrounds, and plazas.'",
          evidenceQuote: 'hotels, corporate conference facilities, shopping malls, fitness centres, and restaurants, as well as publicly accessible green spaces, playgrounds, and plazas.',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r1-q17',
          questionNumber: 17,
          prompt: 'reference to the disadvantages of the stadiums built during a certain era',
          options: SECTION_OPTIONS,
          answerKey: 'D',
          explanation:
            "Section D discusses 20th-century stadiums: 'twentieth-century stadiums were often built on the periphery of cities, surrounded by vast oceans of car parking. As a result, they became isolated from urban life, deserted and inaccessible except on match days, consuming large amounts of energy and generating considerable urban heat islands.'",
          evidenceQuote: 'they became isolated from urban life, deserted and inaccessible except on match days, consuming large amounts of energy and generating considerable urban heat islands.',
          paragraphRef: 'D',
        },
      ],
    },

    // PASSAGE 2: Questions 18-22 (Summary Completion - Words)
    {
      id: 'c17-r1-g4',
      passageId: 'c17-r1-p2',
      questionType: 'summary_completion_words',
      title: 'Questions 18–22',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 18–22 on your answer sheet.',
      startQuestionNumber: 18,
      endQuestionNumber: 22,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Roman amphitheatres

The amphitheatre of Arles was converted first into a [[18]], then into a residential area and finally into an arena where spectators could watch [[19]].
The amphitheatre in Verona is still used today as a venue where [[20]] is performed.
The amphitheatre in Lucca was used for storing [[21]].
Today the ruins of the amphitheatre in Lucca are surrounded by [[22]] and homes.`,
      questions: [
        {
          id: 'c17-r1-q18',
          questionNumber: 18,
          prompt: 'The amphitheatre of Arles was converted first into a [18]',
          answerKey: 'fortress',
          acceptedAlternatives: ['fortress'],
          explanation:
            "Section B states: 'Built by the Romans in 90 AD, it became a fortress with four towers after the fifth century, and was then transformed into a village containing more than 200 houses.'",
          evidenceQuote: 'it became a fortress with four towers after the fifth century',
          paragraphRef: 'B',
        },
        {
          id: 'c17-r1-q19',
          questionNumber: 19,
          prompt: 'and finally into an arena where spectators could watch [19]',
          answerKey: 'bullfights',
          acceptedAlternatives: ['bullfights', 'bullfight', 'bull fighting'],
          explanation:
            "Section B states: 'With the growing interest in conservation during the 19th century, it was converted back into an arena for the staging of bullfights...'",
          evidenceQuote: 'it was converted back into an arena for the staging of bullfights',
          paragraphRef: 'B',
        },
        {
          id: 'c17-r1-q20',
          questionNumber: 20,
          prompt: 'The amphitheatre in Verona is still used today as a venue where [20] is performed',
          answerKey: 'opera',
          acceptedAlternatives: ['opera'],
          explanation:
            "Section B states: 'It has endured the centuries and is currently considered one of the world's prime sites for opera, thanks to its outstanding acoustics.'",
          evidenceQuote: "currently considered one of the world's prime sites for opera",
          paragraphRef: 'B',
        },
        {
          id: 'c17-r1-q21',
          questionNumber: 21,
          prompt: 'The amphitheatre in Lucca was used for storing [21]',
          answerKey: 'salt',
          acceptedAlternatives: ['salt'],
          explanation:
            "Section C states: 'The site evolved in a similar way to Arles and was progressively filled with buildings from the Middle Ages until the 19th century, variously used as houses, a salt depot and a prison.' A salt depot is for storing salt.",
          evidenceQuote: 'variously used as houses, a salt depot and a prison.',
          paragraphRef: 'C',
        },
        {
          id: 'c17-r1-q22',
          questionNumber: 22,
          prompt: 'Today the ruins of the amphitheatre in Lucca are surrounded by [22] and homes',
          answerKey: 'shops',
          acceptedAlternatives: ['shops', 'shop'],
          explanation:
            "Section C states: 'today, the ruins of the amphitheatre remain embedded in the various shops and residences surrounding the public square.'",
          evidenceQuote: 'the ruins of the amphitheatre remain embedded in the various shops and residences',
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 2: Questions 23-24 (Multiple Choice Multi-Select)
    {
      id: 'c17-r1-g5',
      passageId: 'c17-r1-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions:
        'Choose TWO letters, A–E.\nWrite the correct letters in boxes 23 and 24 on your answer sheet.\nWhen comparing twentieth-century stadiums to ancient amphitheatres in Section D, which TWO negative features does the writer mention?',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q23_24_OPTIONS,
      questions: [
        {
          id: 'c17-r1-q23',
          questionNumber: 23,
          prompt:
            'When comparing twentieth-century stadiums to ancient amphitheatres in Section D, which TWO negative features does the writer mention? (First choice)',
          options: MC_Q23_24_OPTIONS,
          answerKey: ['C', 'D'],
          acceptedAlternatives: ['C', 'D'],
          explanation:
            "Section D mentions: 'twentieth-century stadiums were often built on the periphery of cities, surrounded by vast oceans of car parking. As a result, they became isolated from urban life, deserted and inaccessible except on match days' (C - less convenient locations), and 'In the 20th century, stadiums lost the flexibility of earlier structures. Instead, they became single-purpose architectural monuments' (D - less versatile).",
          evidenceQuote:
            'stadiums lost the flexibility of earlier structures... built on the periphery of cities, surrounded by vast oceans of car parking. As a result, they became isolated from urban life',
          paragraphRef: 'D',
        },
        {
          id: 'c17-r1-q24',
          questionNumber: 24,
          prompt:
            'When comparing twentieth-century stadiums to ancient amphitheatres in Section D, which TWO negative features does the writer mention? (Second choice)',
          options: MC_Q23_24_OPTIONS,
          answerKey: ['C', 'D'],
          acceptedAlternatives: ['C', 'D'],
          explanation:
            "Section D mentions: 'twentieth-century stadiums were often built on the periphery of cities, surrounded by vast oceans of car parking. As a result, they became isolated from urban life, deserted and inaccessible except on match days' (C - less convenient locations), and 'In the 20th century, stadiums lost the flexibility of earlier structures. Instead, they became single-purpose architectural monuments' (D - less versatile).",
          evidenceQuote:
            'stadiums lost the flexibility of earlier structures... built on the periphery of cities, surrounded by vast oceans of car parking. As a result, they became isolated from urban life',
          paragraphRef: 'D',
        },
      ],
    },

    // PASSAGE 2: Questions 25-26 (Multiple Choice Multi-Select)
    {
      id: 'c17-r1-g6',
      passageId: 'c17-r1-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 25 and 26',
      instructions:
        'Choose TWO letters, A–E.\nWrite the correct letters in boxes 25 and 26 on your answer sheet.\nWhich TWO advantages of modern stadium design does the writer mention?',
      startQuestionNumber: 25,
      endQuestionNumber: 26,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q25_26_OPTIONS,
      questions: [
        {
          id: 'c17-r1-q25',
          questionNumber: 25,
          prompt: 'Which TWO advantages of modern stadium design does the writer mention? (First choice)',
          options: MC_Q25_26_OPTIONS,
          answerKey: ['B', 'E'],
          acceptedAlternatives: ['B', 'E'],
          explanation:
            "Section E states the aim is to 'bring life back into the urban core' by serving 'a broad cross-section of the local community every day of the year' (B - bringing community life back into the city environment). Section F highlights stadiums designed to operate as 'green power stations' with photovoltaic arrays generating renewable electricity for surrounding neighbourhoods (E - providing a suitable site for the installation of renewable power generators).",
          evidenceQuote:
            'bring life back into the urban core... serve not just sports fans on weekend afternoons, but a broad cross-section of the local community... operate as green power stations',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r1-q26',
          questionNumber: 26,
          prompt: 'Which TWO advantages of modern stadium design does the writer mention? (Second choice)',
          options: MC_Q25_26_OPTIONS,
          answerKey: ['B', 'E'],
          acceptedAlternatives: ['B', 'E'],
          explanation:
            "Section E states the aim is to 'bring life back into the urban core' by serving 'a broad cross-section of the local community every day of the year' (B - bringing community life back into the city environment). Section F highlights stadiums designed to operate as 'green power stations' with photovoltaic arrays generating renewable electricity for surrounding neighbourhoods (E - providing a suitable site for the installation of renewable power generators).",
          evidenceQuote:
            'bring life back into the urban core... serve not just sports fans on weekend afternoons, but a broad cross-section of the local community... operate as green power stations',
          paragraphRef: 'F',
        },
      ],
    },

    // PASSAGE 3: Questions 27-31 (Summary Completion with Options)
    {
      id: 'c17-r1-g7',
      passageId: 'c17-r1-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 27–31',
      instructions:
        'Complete the summary using the list of phrases, A–J, below.\nWrite the correct letter, A–J, in boxes 27–31 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 31,
      optionsList: SUMMARY_OPTIONS_BOX_P3,
      contentWithGaps: `The story behind the hunt for Charles II

Charles II's father was executed by the Parliamentarian forces in 1649. Charles II then formed a [[27]] with the Scots, and in order to become King of Scots, he abandoned an important [[28]] that was held by his father and had contributed to his father's death. The opposing sides then met outside Worcester in 1651. The battle led to a [[29]] for the Parliamentarians and Charles had to flee for his life. A [[30]] was offered for Charles's capture, but after six weeks spent in hiding, he eventually managed to reach the [[31]] of continental Europe.`,
      questions: [
        {
          id: 'c17-r1-q27',
          questionNumber: 27,
          prompt: 'Charles II then formed a [27] with the Scots',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Paragraph 1 states that Charles II 'did a deal with the Scots, thereby accepting Presbyterianism as the national religion in return for being crowned King of Scots' (H - strategic alliance).",
          evidenceQuote: 'did a deal with the Scots, thereby accepting Presbyterianism as the national religion in return for being crowned King of Scots',
          paragraphRef: '1',
        },
        {
          id: 'c17-r1-q28',
          questionNumber: 28,
          prompt: "he abandoned an important [28] that was held by his father and had contributed to his father's death",
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'J',
          acceptedAlternatives: ['J'],
          explanation:
            "Paragraph 1 states: 'the young Charles II sacrificed one of the very principles his father had died for and did a deal with the Scots, thereby accepting Presbyterianism as the national religion' (J - religious conviction).",
          evidenceQuote: 'sacrificed one of the very principles his father had died for',
          paragraphRef: '1',
        },
        {
          id: 'c17-r1-q29',
          questionNumber: 29,
          prompt: 'The battle led to a [29] for the Parliamentarians and Charles had to flee for his life',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph 1 refers to his 'resounding defeat at the Battle of Worcester' and being 'comprehensively defeated on the meadows outside the city by the Parliamentarian army' (F - decisive victory).",
          evidenceQuote: 'resounding defeat at the Battle of Worcester... comprehensively defeated on the meadows outside the city by the Parliamentarian army',
          paragraphRef: '1',
        },
        {
          id: 'c17-r1-q30',
          questionNumber: 30,
          prompt: "A [30] was offered for Charles's capture",
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 1 states: 'the 21-year-old king found himself the subject of a national manhunt, with a huge sum offered for his capture' (B - large reward).",
          evidenceQuote: 'with a huge sum offered for his capture',
          paragraphRef: '1',
        },
        {
          id: 'c17-r1-q31',
          questionNumber: 31,
          prompt: 'he eventually managed to reach the [31] of continental Europe',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 1 states: 'he managed, through a series of heart-poundingly close escapes, to evade the Parliamentarians before seeking refuge in France' (D - relative safety).",
          evidenceQuote: 'to evade the Parliamentarians before seeking refuge in France.',
          paragraphRef: '1',
        },
      ],
    },

    // PASSAGE 3: Questions 32-35 (YES / NO / NOT GIVEN)
    {
      id: 'c17-r1-g8',
      passageId: 'c17-r1-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 32–35',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 32–35 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 32,
      endQuestionNumber: 35,
      questions: [
        {
          id: 'c17-r1-q32',
          questionNumber: 32,
          prompt: 'Charles chose Pepys for the task because he considered him to be trustworthy.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 2 mentions that Charles requested a meeting with Samuel Pepys to ensure the episode was not forgotten, but does not state why Pepys was chosen or whether Charles considered him trustworthy.",
          evidenceQuote: 'His intention when asking Pepys to commit his story to paper was to ensure that this most extraordinary episode was never forgotten.',
          paragraphRef: '2',
        },
        {
          id: 'c17-r1-q33',
          questionNumber: 33,
          prompt: "Charles's personal recollection of the escape lacked sufficient detail.",
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 2 directly contradicts this: 'Over two three-hour sittings, the king related to him in great detail his personal recollections of the six weeks he had spent as a fugitive.'",
          evidenceQuote: 'the king related to him in great detail his personal recollections of the six weeks he had spent as a fugitive.',
          paragraphRef: '2',
        },
        {
          id: 'c17-r1-q34',
          questionNumber: 34,
          prompt: 'Charles indicated to Pepys that he had planned his escape before the battle.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 2 contradicts this: 'Charles commenced his story: \"After the battle was so absolutely lost as to be beyond hope of recovery, I began to think of the best way of saving myself.\"' He planned his escape after the battle, not before.",
          evidenceQuote: 'After the battle was so absolutely lost as to be beyond hope of recovery, I began to think of the best way of saving myself.',
          paragraphRef: '2',
        },
        {
          id: 'c17-r1-q35',
          questionNumber: 35,
          prompt: "The inclusion of Charles's account is a positive aspect of the book.",
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 3 states: 'One of the joys of Spencer's book, a result not least of its use of Charles II's own narrative as told to Pepys, is just how close the reader gets to the action.' The reviewer explicitly considers this a joy and strength.",
          evidenceQuote: "One of the joys of Spencer's book, a result not least of its use of Charles II's own narrative as told to Pepys, is just how close the reader gets to the action.",
          paragraphRef: '3',
        },
      ],
    },

    // PASSAGE 3: Questions 36-40 (Multiple Choice Single)
    {
      id: 'c17-r1-g9',
      passageId: 'c17-r1-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 36–40',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 36–40 on your answer sheet.',
      startQuestionNumber: 36,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c17-r1-q36',
          questionNumber: 36,
          prompt: "What is the reviewer's main purpose in the first paragraph?",
          options: MC_Q36_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 1 recounts how Charles II made a deal with the Scots, the subsequent invasions, the defeat at Worcester, and the beginning of the national manhunt leading to his flight to France (B - to give an account of the circumstances leading to Charles II's escape).",
          evidenceQuote: 'tells us the story of the hunt for King Charles II in the six weeks after his resounding defeat at the Battle of Worcester in September 1651.',
          paragraphRef: '1',
        },
        {
          id: 'c17-r1-q37',
          questionNumber: 37,
          prompt: "Why does the reviewer include examples of the fugitives' behaviour in the third paragraph?",
          options: MC_Q37_OPTIONS,
          answerKey: 'C',
          explanation:
            "Paragraph 3 uses vivid examples (disguised as a servant, hiding in an oak tree, walking till feet were blistered, soldiers entering inns) to demonstrate how 'The day-by-day recounting of the fugitive king's movements makes the drama vivid and immediate... bringing the perilous journey to life' (C).",
          evidenceQuote: 'The day-by-day recounting of the fugitive king\'s movements makes the drama vivid and immediate... bringing the perilous journey to life.',
          paragraphRef: '3',
        },
        {
          id: 'c17-r1-q38',
          questionNumber: 38,
          prompt: 'What point does the reviewer make about Charles II in the fourth paragraph?',
          options: MC_Q38_OPTIONS,
          answerKey: 'A',
          explanation:
            "Paragraph 4 explains: 'Charles, however, chose to celebrate what was essentially a defeat—a catastrophic routing that sent him into penury and exile' (A).",
          evidenceQuote: 'Charles, however, chose to celebrate what was essentially a defeat—a catastrophic routing that sent him into penury and exile.',
          paragraphRef: '4',
        },
        {
          id: 'c17-r1-q39',
          questionNumber: 39,
          prompt: 'What does the reviewer say about Charles Spencer in the fifth paragraph?',
          options: MC_Q39_OPTIONS,
          answerKey: 'B',
          explanation:
            "Paragraph 5 states that Spencer 'displays an even-handed sympathy for both the fugitive king and the fierce republican regime that hunted him' and gives a 'balanced perspective' (B - He takes an unbiased approach to the subject matter).",
          evidenceQuote: 'He displays an even-handed sympathy for both the fugitive king and the fierce republican regime that hunted him... This balanced perspective lends historical weight',
          paragraphRef: '5',
        },
        {
          id: 'c17-r1-q40',
          questionNumber: 40,
          prompt: "When the reviewer says the book 'doesn't quite hit the mark', she is making the point that",
          options: MC_Q40_OPTIONS,
          answerKey: 'D',
          explanation:
            "Paragraph 6 explains: 'the author fails to address whether Charles II's harrowing experiences as a hunted fugitive had a lasting influence on him once he was restored to the throne' (D).",
          evidenceQuote: "the author fails to address whether Charles II's harrowing experiences as a hunted fugitive had a lasting influence on him once he was restored to the throne.",
          paragraphRef: '6',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 17 Academic Reading Test 1',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge17ReadingTest1(authorId?: string) {
  const data = getCambridge17ReadingTest1Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 17 Reading Test 1 data validation failed:\n- ${errors.join('\n- ')}`
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
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%17%Academic%Reading%Test 1%' LIMIT 1"
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
