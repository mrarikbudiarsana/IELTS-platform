import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge18ReadingTest1Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c18-r1-p1',
      passageNumber: 1,
      title: 'Urban farming',
      subtitle:
        'In Paris, urban farmers are trying a soil-free approach to agriculture that uses less space and fewer resources. Could it help cities face the threats to our food supplies?\n\nYou should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c18-r1-p1-1',
          label: '1',
          content: `On top of a striking new exhibition hall in southern Paris, the world's largest urban rooftop farm has started to bear fruit. Strawberries that are small, intensely flavoured and resplendently red sprout abundantly from large plastic tubes. Peer inside and you see the tubes are completely hollow, the roots of dozens of strawberry plants dangling down inside them. From identical vertical tubes nearby burst row upon row of lettuces; near those are aromatic herbs, such as basil, sage and peppermint. Opposite, in narrow, horizontal trays packed not with soil but with coconut fibre, grow cherry tomatoes, shiny aubergines and brightly coloured chards.`,
        },
        {
          id: 'c18-r1-p1-2',
          label: '2',
          content: `Pascal Hardy, an engineer and sustainable development consultant, began experimenting with vertical farming and aeroponic growing towers - as the soil-free plastic tubes are known - on his Paris apartment block roof five years ago. The urban rooftop space above the exhibition hall is somewhat bigger: 14,000 square metres and almost exactly the size of a couple of football pitches. Already, the team of young urban farmers who tend it have picked, in one day, 3,000 lettuces and 150 punnets of strawberries. When the remaining two thirds of the vast open area are in production, 20 staff will harvest up to 1,000 kg of perhaps 35 different varieties of fruit and vegetables, every day. 'We're not ever, obviously, going to feed the whole city this way,' cautions Hardy. 'In the urban environment you're working with very significant practical constraints, clearly, on what you can do and where. But if enough unused space can be developed like this, there's no reason why you shouldn't eventually target maybe between 5% and 10% of consumption.'`,
        },
        {
          id: 'c18-r1-p1-3',
          label: '3',
          content: `Perhaps most significantly, however, this is a real-life showcase for the work of Hardy's flourishing urban agriculture consultancy, Agripolis, which is currently fielding enquiries from around the world to design, build and equip a new breed of soil-free inner-city farm. 'The method's advantages are many,' he says. 'First, I don't much like the fact that most of the fruit and vegetables we eat have been treated with something like 17 different pesticides, or that the intensive farming techniques that produced them are such huge generators of greenhouse gases. I don't much like the fact, either, that they've travelled an average of 2,000 refrigerated kilometres to my plate, that their quality is so poor, because the varieties are selected for their capacity to withstand such substantial journeys, or that 80% of the price I pay goes to wholesalers and transport companies, not the producers.'`,
        },
        {
          id: 'c18-r1-p1-4',
          label: '4',
          content: `Produce grown using this soil-free method, on the other hand - which relies solely on a small quantity of water, enriched with organic nutrients, pumped around a closed circuit of pipes, towers and trays - is 'produced up here, and sold locally, just down there. It barely travels at all,' Hardy says. 'You can select crop varieties for their flavour, not their resistance to the transport and storage chain, and you can pick them when they're really at their best, and not before.' No soil is exhausted, and the water that gently showers the plants' roots every 12 minutes is recycled, so the method uses 90% less water than a classic intensive farm for the same yield.`,
        },
        {
          id: 'c18-r1-p1-5',
          label: '5',
          content: `Urban farming is not, of course, a new phenomenon. Inner-city agriculture is booming from Shanghai to Detroit and Tokyo to Bangkok. Strawberries are being grown in disused shipping containers, mushrooms in underground carparks. Aeroponic farming, he says, is 'virtuous'. The equipment weighs little, can be installed on almost any flat surface and is cheap to buy: roughly €100 to €150 per square metre. It is cheap to run, too, consuming a tiny fraction of the electricity used by some techniques.`,
        },
        {
          id: 'c18-r1-p1-6',
          label: '6',
          content: `Produce grown this way typically sells at prices that, while generally higher than those of classic intensive agriculture, are lower than soil-based organic growers. There are limits to what farmers can grow this way, of course, and much of the produce is suited to the summer months. 'Root vegetables we cannot do, at least not yet,' he says. 'Radishes are OK, but carrots, potatoes, that kind of thing - the roots are simply too long. Fruit trees are obviously not an option. And beans tend to take up a lot of space for not much return.' Nevertheless, urban farming of the kind being practised in Paris is one part of a bigger and fast-changing picture that is bringing food production closer to our lives.`,
        },
      ],
    },
    {
      id: 'c18-r1-p2',
      passageNumber: 2,
      title: 'Forest management in Pennsylvania, USA',
      subtitle:
        'How managing low-quality wood (also known as low-use wood) for bioenergy can encourage sustainable forest management\n\nYou should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c18-r1-p2-A',
          label: 'A',
          content: `A tree's 'value' depends on several factors including its species, size, form, condition, quality, function, and accessibility, and depends on the management goals for a given forest. The same tree can be valued very differently by each person who looks at it. A large, straight black cherry tree has high value as timber to be cut into logs or made into furniture, but for a landowner more interested in wildlife habitat, the real value of that stem (or trunk) may be the food it provides to animals. Likewise, if the tree suffers from black knot disease, its value for timber decreases, but to a woodworker interested in making bowls, it brings an opportunity for a unique and beautiful piece of art.`,
        },
        {
          id: 'c18-r1-p2-B',
          label: 'B',
          content: `In the past, Pennsylvania landowners were solely interested in the value of their trees as high-quality timber. The norm was to remove the stems of highest quality and leave behind poorly formed trees that were not as well suited to the site where they grew. This practice, called 'high-grading', has left a legacy of 'low-use wood' in the forests. Some people even call these 'junk trees', and they are abundant in Pennsylvania. These trees have lower economic value for traditional timber markets, compete for growth with higher-value trees, shade out desirable regeneration and decrease the health of a stand leaving it more vulnerable to poor weather and disease. Management that specifically targets low-use wood can help landowners manage these forest health issues, and wood energy markets help promote this.`,
        },
        {
          id: 'c18-r1-p2-C',
          label: 'C',
          content: `Wood energy markets can accept less expensive wood material of lower quality than would be suitable for traditional timber markets. Most wood used for energy in Pennsylvania is used to produce heat or electricity through combustion. Many schools and hospitals use wood boiler systems to heat and power their facilities, many homes are primarily heated with wood, and some coal plants incorporate wood into their coal streams to produce electricity. Wood can also be gasified for electrical generation and can even be made into liquid fuels like ethanol and gasoline for lorries and cars. All these products are made primarily from low-use wood. Several tree- and plant-cutting approaches, which could greatly improve the long-term quality of a forest, focus strongly or solely on the use of wood for those markets.`,
        },
        {
          id: 'c18-r1-p2-D',
          label: 'D',
          content: `One such approach is called a Timber Stand Improvement (TSI) Cut. In a TSI Cut, really poor-quality tree and plant material is cut down to allow more space, light, and other resources to the highest-valued stems that remain. Removing invasive plants might be another primary goal of a TSI Cut. The stems that are left behind might then grow in size and develop more foliage and larger crowns or tops that produce more coverage for wildlife; they have a better chance to regenerate in a less crowded environment. TSI Cuts can be tailored to one farmer's specific management goals for his or her land.`,
        },
        {
          id: 'c18-r1-p2-E',
          label: 'E',
          content: `Another approach that might yield a high amount of low-use wood is a Salvage Cut. With the many pests and pathogens visiting forests including hemlock wooly adelgid, Asian longhorned beetle, emerald ash borer, and gypsy moth, to name just a few, it is important to remember that those working in the forests can help ease these issues through cutting procedures. These types of cut reduce the number of sick trees and seek to manage the future spread of a pest problem. They leave vigorous trees that have stayed healthy enough to survive the outbreak.`,
        },
        {
          id: 'c18-r1-p2-F',
          label: 'F',
          content: `A Shelterwood Cut, which only takes place in a mature forest that has already been thinned several times, involves removing all the mature trees when other seedlings have become established. This then allows the forester to decide which tree species are regenerated. It leaves a young forest where all trees are at a similar point in their growth. It can also be used to develop a two-tier forest so that there are two harvests and the money that comes in is spread out over a decade or more.`,
        },
        {
          id: 'c18-r1-p2-G',
          label: 'G',
          content: `Thinnings and dense and dead wood removal for fire prevention also center on the production of low-use wood. However, it is important to remember that some retention of what many would classify as low-use wood is very important. The tops of trees that have been cut down should be left on the site so that their nutrients cycle back into the soil. In addition, trees with many cavities are extremely important habitats for insect predators like woodpeckers, bats and small mammals. They help control problem insects and increase the health and resilience of the forest. It is also important to remember that not all small trees are low-use. For example, many species like hawthorn provide food for wildlife. Finally, rare species of trees in a forest should also stay behind as they add to its structural diversity.`,
        },
      ],
    },
    {
      id: 'c18-r1-p3',
      passageNumber: 3,
      title: "Conquering Earth's space junk problem",
      subtitle:
        'Satellites, rocket shards and collision debris are creating major traffic risks in orbit around the planet. Researchers are working to reduce these threats\n\nYou should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c18-r1-p3-A',
          label: 'A',
          content: `Last year, commercial companies, military and civil departments and amateurs sent more than 400 satellites into orbit, over four times the yearly average in the previous decade. Numbers could rise even more sharply if leading space companies follow through on plans to deploy hundreds to thousands of large constellations of satellites to space in the next few years. All that traffic can lead to disaster. Ten years ago, a US commercial Iridium satellite smashed into an inactive Russian communications satellite called Cosmos-2251, creating thousands of new pieces of space shrapnel that now threaten other satellites in low Earth orbit - the zone stretching up to 2,000 kilometres in altitude. Altogether, there are roughly 20,000 human-made objects in orbit, from working satellites to small rocket pieces. And satellite operators can't steer away from every potential crash, because each move consumes time and fuel that could otherwise be used for the spacecraft's main job.`,
        },
        {
          id: 'c18-r1-p3-B',
          label: 'B',
          content: `Concern about space junk goes back to the beginning of the satellite era, but the number of objects in orbit is rising so rapidly that researchers are investigating new ways of attacking the problem. Several teams are trying to improve methods for assessing what is in orbit, so that satellite operators can work more efficiently in ever-more-crowded space. Some researchers are now starting to compile a massive data set that includes the best possible information on where everything is in orbit. Others are developing taxonomies of space debris - working on measuring properties such as the shape and size of an object, so that satellite operators know how much to worry about what's coming their way. The alternative, many say, is unthinkable. Just a few uncontrolled space crashes could generate enough debris to set off a runaway cascade of fragments, rendering near-Earth space unusable. 'If we go on like this, we will reach a point of no return,' says Carolin Frueh, an astrodynamical researcher at Purdue University in West Lafayette, Indiana.`,
        },
        {
          id: 'c18-r1-p3-C',
          label: 'C',
          content: `Even as our ability to monitor space objects increases, so too does the total number of items in orbit. That means companies, governments and other players in space are collaborating in new ways to avoid a shared threat. International groups such as the Inter-Agency Space Debris Coordination Committee have developed guidelines on space sustainability. Those include inactivating satellites at the end of their useful life by venting pressurised materials or leftover fuel that might lead to explosions. The intergovernmental groups also advise lowering satellites deep enough into the atmosphere that they will burn up or disintegrate within 25 years. But so far, only about half of all missions have abided by this 25-year goal, says Holger Krag, head of the European Space Agency's space-debris office in Darmstadt, Germany. Operators of the planned large constellations of satellites say they will be responsible stewards in their enterprises in space, but Krag worries that problems could increase, despite their best intentions. 'What happens to those that fail or go bankrupt?' he asks. 'They are probably not going to spend money to remove their satellites from space.'`,
        },
        {
          id: 'c18-r1-p3-D',
          label: 'D',
          content: `In theory, given the vastness of space, satellite operators should have plenty of room for all these missions to fly safely without ever nearing another object. So some scientists are tackling the problem of space junk by trying to find out where all the debris is to a high degree of precision. That would alleviate the need for many of the unnecessary manoeuvres that are carried out to avoid potential collisions. 'If you knew precisely where everything was, you would almost never have a problem,' says Marlon Sorge, a space-debris specialist at the Aerospace Corporation in El Segundo, California.`,
        },
        {
          id: 'c18-r1-p3-E',
          label: 'E',
          content: `The field is called space traffic management, because it's similar to managing traffic on the roads or in the air. Think about a busy day at an airport, says Moriba Jah, an astrodynamicist at the University of Texas at Austin: planes line up in the sky, landing and taking off close to one another in a carefully choreographed routine. Air-traffic controllers know the location of the planes down to one metre in accuracy. The same can't be said for space debris. Not all objects in orbit are known, and even those included in databases are not tracked consistently.`,
        },
        {
          id: 'c18-r1-p3-F',
          label: 'F',
          content: `An additional problem is that there is no authoritative catalogue that accurately lists the orbits of all known space debris. Jah illustrates this with a web-based database that he has developed. It draws on several sources, such as catalogues maintained by the US and Russian governments, to visualise where objects are in space. When he types in an identifier for a particular space object, the database draws a purple line to designate its orbit. Only this doesn't quite work for a number of objects, such as a Russian rocket body designated in the database as object number 32280. When Jah enters that number, the database draws two purple lines: the US and Russian sources contain two completely different orbits for the same object. Jah says that it is almost impossible to tell which is correct, unless a third source of information made it possible to cross-correlate. Jah describes himself as a space environmentalist: 'I want to make space a place that is safe to operate, that is free and useful for generations to come.' Until that happens, he argues, the space community will continue devolving into a tragedy in which all spaceflight operators are polluting a common resource.`,
        },
      ],
    },
  ];

  const CUT_OPTIONS = [
    { key: 'A', text: 'a TSI Cut' },
    { key: 'B', text: 'a Salvage Cut' },
    { key: 'C', text: 'a Shelterwood Cut' },
  ];

  const PEOPLE_OPTIONS = [
    { key: 'A', text: 'Carolin Frueh' },
    { key: 'B', text: 'Holger Krag' },
    { key: 'C', text: 'Marlon Sorge' },
    { key: 'D', text: 'Moriba Jah' },
  ];

  const PARAGRAPH_OPTIONS = [
    { key: 'A', text: 'Paragraph A' },
    { key: 'B', text: 'Paragraph B' },
    { key: 'C', text: 'Paragraph C' },
    { key: 'D', text: 'Paragraph D' },
    { key: 'E', text: 'Paragraph E' },
    { key: 'F', text: 'Paragraph F' },
    { key: 'G', text: 'Paragraph G' },
  ];

  const SECTION_OPTIONS = [
    { key: 'A', text: 'Section A' },
    { key: 'B', text: 'Section B' },
    { key: 'C', text: 'Section C' },
    { key: 'D', text: 'Section D' },
    { key: 'E', text: 'Section E' },
    { key: 'F', text: 'Section F' },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-3 (Sentence Completion)
    {
      id: 'c18-r1-g1',
      passageId: 'c18-r1-p1',
      questionType: 'sentence_completion',
      title: 'Questions 1–3',
      instructions:
        'Complete the sentences below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from the passage for each answer.\nWrite your answers in boxes 1–3 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 3,
      wordLimitRule: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      maxWords: 2,
      maxNumbers: 1,
      contentWithGaps: `Urban farming in Paris
1 Vertical tubes are used to grow strawberries, [[1]] and herbs.
2 There will eventually be a daily harvest of as much as [[2]] in weight of fruit and vegetables.
3 It may be possible that the farm's produce will account for as much as 10% of the city's [[3]] overall.`,
      questions: [
        {
          id: 'c18-r1-q1',
          questionNumber: 1,
          prompt: 'Vertical tubes are used to grow strawberries, [1] and herbs.',
          answerKey: 'lettuces',
          acceptedAlternatives: ['lettuces', 'lettuce'],
          explanation:
            "Paragraph 1 states: 'From identical vertical tubes nearby burst row upon row of lettuces; near those are aromatic herbs, such as basil, sage and peppermint.'",
          evidenceQuote:
            'From identical vertical tubes nearby burst row upon row of lettuces; near those are aromatic herbs',
          paragraphRef: '1',
        },
        {
          id: 'c18-r1-q2',
          questionNumber: 2,
          prompt:
            'There will eventually be a daily harvest of as much as [2] in weight of fruit and vegetables.',
          answerKey: '1,000 kg',
          acceptedAlternatives: ['1,000 kg', '1000 kg', '1,000kg', '1000kg'],
          explanation:
            "Paragraph 2 states: 'When the remaining two thirds of the vast open area are in production, 20 staff will harvest up to 1,000 kg of perhaps 35 different varieties of fruit and vegetables, every day.'",
          evidenceQuote:
            '20 staff will harvest up to 1,000 kg of perhaps 35 different varieties of fruit and vegetables, every day',
          paragraphRef: '2',
        },
        {
          id: 'c18-r1-q3',
          questionNumber: 3,
          prompt:
            "It may be possible that the farm's produce will account for as much as 10% of the city's [3] overall.",
          answerKey: 'consumption',
          acceptedAlternatives: ['consumption', 'food consumption'],
          explanation:
            "Paragraph 2 notes: 'there's no reason why you shouldn't eventually target maybe between 5% and 10% of consumption.'",
          evidenceQuote:
            "there's no reason why you shouldn't eventually target maybe between 5% and 10% of consumption.",
          paragraphRef: '2',
        },
      ],
    },

    // PASSAGE 1: Questions 4-7 (Table Completion)
    {
      id: 'c18-r1-g2',
      passageId: 'c18-r1-p1',
      questionType: 'table_completion',
      title: 'Questions 4–7',
      instructions:
        'Complete the table below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 4–7 on your answer sheet.',
      startQuestionNumber: 4,
      endQuestionNumber: 7,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      tableData: {
        headers: ['', 'Intensive farming', 'Aeroponic urban farming'],
        rows: [
          {
            cells: [
              { content: 'Growth' },
              {
                content: '• wide range of [[4]] used\n• techniques pollute air',
                isGap: true,
                questionNumber: 4,
              },
              {
                content: '• no soil used\n• nutrients added to water, which is recycled',
              },
            ],
          },
          {
            cells: [
              { content: 'Selection' },
              {
                content:
                  '• quality not good\n• varieties of fruit and vegetables chosen that can survive long [[5]]',
                isGap: true,
                questionNumber: 5,
              },
              {
                content: '• produce chosen because of its [[7]]',
                isGap: true,
                questionNumber: 7,
              },
            ],
          },
          {
            cells: [
              { content: 'Sale' },
              {
                content: '• [[6]] receive very little of overall income',
                isGap: true,
                questionNumber: 6,
              },
              {
                content: '• produced up here, and sold locally',
              },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c18-r1-q4',
          questionNumber: 4,
          prompt: 'Intensive farming: wide range of [4] used',
          answerKey: 'pesticides',
          acceptedAlternatives: ['pesticides', 'pesticide'],
          explanation:
            "Paragraph 3 states: 'most of the fruit and vegetables we eat have been treated with something like 17 different pesticides'.",
          evidenceQuote:
            'most of the fruit and vegetables we eat have been treated with something like 17 different pesticides',
          paragraphRef: '3',
        },
        {
          id: 'c18-r1-q5',
          questionNumber: 5,
          prompt:
            'Intensive farming: varieties of fruit and vegetables chosen that can survive long [5]',
          answerKey: 'journeys',
          acceptedAlternatives: ['journeys', 'journey'],
          explanation:
            "Paragraph 3 states: 'their quality is so poor, because the varieties are selected for their capacity to withstand such substantial journeys'.",
          evidenceQuote:
            'varieties are selected for their capacity to withstand such substantial journeys',
          paragraphRef: '3',
        },
        {
          id: 'c18-r1-q6',
          questionNumber: 6,
          prompt: 'Intensive farming: [6] receive very little of overall income',
          answerKey: 'producers',
          acceptedAlternatives: ['producers', 'producer'],
          explanation:
            "Paragraph 3 states: '80% of the price I pay goes to wholesalers and transport companies, not the producers.'",
          evidenceQuote:
            '80% of the price I pay goes to wholesalers and transport companies, not the producers.',
          paragraphRef: '3',
        },
        {
          id: 'c18-r1-q7',
          questionNumber: 7,
          prompt: 'Aeroponic urban farming: produce chosen because of its [7]',
          answerKey: 'flavour',
          acceptedAlternatives: ['flavour', 'flavor'],
          explanation:
            "Paragraph 4 states: 'You can select crop varieties for their flavour, not their resistance to the transport and storage chain'.",
          evidenceQuote: 'You can select crop varieties for their flavour',
          paragraphRef: '4',
        },
      ],
    },

    // PASSAGE 1: Questions 8-13 (TRUE / FALSE / NOT GIVEN)
    {
      id: 'c18-r1-g3',
      passageId: 'c18-r1-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 8–13',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 8–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 8,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c18-r1-q8',
          questionNumber: 8,
          prompt: 'Urban farming can take place above or below ground.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 5 states: 'Strawberries are being grown in disused shipping containers, mushrooms in underground carparks.' Along with rooftop farms, this confirms urban farming takes place above and below ground.",
          evidenceQuote:
            'Strawberries are being grown in disused shipping containers, mushrooms in underground carparks.',
          paragraphRef: '5',
        },
        {
          id: 'c18-r1-q9',
          questionNumber: 9,
          prompt: 'Some of the equipment used in aeroponic farming can be made by hand.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 5 notes that the equipment weighs little, can be installed on almost any flat surface and is cheap to buy, but there is no mention of whether any of it can be made by hand.",
          evidenceQuote:
            'The equipment weighs little, can be installed on almost any flat surface and is cheap to buy: roughly €100 to €150 per square metre.',
          paragraphRef: '5',
        },
        {
          id: 'c18-r1-q10',
          questionNumber: 10,
          prompt: 'Urban farming relies more on electricity than some other types of farming.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 5 contradicts this: 'It is cheap to run, too, consuming a tiny fraction of the electricity used by some techniques.'",
          evidenceQuote:
            'It is cheap to run, too, consuming a tiny fraction of the electricity used by some techniques.',
          paragraphRef: '5',
        },
        {
          id: 'c18-r1-q11',
          questionNumber: 11,
          prompt:
            'Fruit and vegetables grown on an aeroponic urban farm are cheaper than traditionally grown organic produce.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 6 confirms that produce grown this way sells at prices that 'while generally higher than those of classic intensive agriculture, are lower than soil-based organic growers.' 'Lower than' means cheaper.",
          evidenceQuote:
            'while generally higher than those of classic intensive agriculture, are lower than soil-based organic growers.',
          paragraphRef: '6',
        },
        {
          id: 'c18-r1-q12',
          questionNumber: 12,
          prompt:
            'Most produce can be grown on an aeroponic urban farm at any time of the year.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 6 contradicts this: 'There are limits to what farmers can grow this way, of course, and much of the produce is suited to the summer months.'",
          evidenceQuote:
            'There are limits to what farmers can grow this way, of course, and much of the produce is suited to the summer months.',
          paragraphRef: '6',
        },
        {
          id: 'c18-r1-q13',
          questionNumber: 13,
          prompt: 'Beans take longer to grow on an urban farm than other vegetables.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 6 remarks that 'beans tend to take up a lot of space for not much return', but does not mention the length of time they take to grow compared to other vegetables.",
          evidenceQuote: 'And beans tend to take up a lot of space for not much return.',
          paragraphRef: '6',
        },
      ],
    },

    // PASSAGE 2: Questions 14-18 (Matching Information)
    {
      id: 'c18-r1-g4',
      passageId: 'c18-r1-p2',
      questionType: 'matching_information',
      title: 'Questions 14–18',
      instructions:
        'Reading Passage 2 has seven paragraphs, A–G.\nWhich paragraph contains the following information?\nWrite the correct letter, A–G, in boxes 14–18 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 14,
      endQuestionNumber: 18,
      optionsList: PARAGRAPH_OPTIONS,
      allowMultipleUse: true,
      questions: [
        {
          id: 'c18-r1-q14',
          questionNumber: 14,
          prompt:
            'bad outcomes for a forest when people focus only on its financial reward',
          options: PARAGRAPH_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph B explains that when landowners were solely interested in high-quality timber, the practice called 'high-grading' left junk trees that 'compete for growth with higher-value trees, shade out desirable regeneration and decrease the health of a stand leaving it more vulnerable to poor weather and disease.'",
          evidenceQuote:
            'compete for growth with higher-value trees, shade out desirable regeneration and decrease the health of a stand leaving it more vulnerable to poor weather and disease.',
          paragraphRef: 'B',
        },
        {
          id: 'c18-r1-q15',
          questionNumber: 15,
          prompt: 'reference to the aspects of any tree that contribute to its worth',
          options: PARAGRAPH_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph A explicitly begins: 'A tree\\'s \"value\" depends on several factors including its species, size, form, condition, quality, function, and accessibility, and depends on the management goals for a given forest.'",
          evidenceQuote:
            "A tree's 'value' depends on several factors including its species, size, form, condition, quality, function, and accessibility",
          paragraphRef: 'A',
        },
        {
          id: 'c18-r1-q16',
          questionNumber: 16,
          prompt: 'mention of the potential use of wood to help run vehicles',
          options: PARAGRAPH_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph C states: 'Wood can also be gasified for electrical generation and can even be made into liquid fuels like ethanol and gasoline for lorries and cars.'",
          evidenceQuote:
            'made into liquid fuels like ethanol and gasoline for lorries and cars.',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r1-q17',
          questionNumber: 17,
          prompt: 'examples of insects that attack trees',
          options: PARAGRAPH_OPTIONS,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph E mentions: 'With the many pests and pathogens visiting forests including hemlock wooly adelgid, Asian longhorned beetle, emerald ash borer, and gypsy moth...'",
          evidenceQuote:
            'pests and pathogens visiting forests including hemlock wooly adelgid, Asian longhorned beetle, emerald ash borer, and gypsy moth',
          paragraphRef: 'E',
        },
        {
          id: 'c18-r1-q18',
          questionNumber: 18,
          prompt: 'an alternative name for trees that produce low-use wood',
          options: PARAGRAPH_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph B states: 'This practice, called \"high-grading\", has left a legacy of \"low-use wood\" in the forests. Some people even call these \"junk trees\"...'",
          evidenceQuote:
            'Some people even call these \'junk trees\', and they are abundant in Pennsylvania.',
          paragraphRef: 'B',
        },
      ],
    },

    // PASSAGE 2: Questions 19-21 (Matching Features - Timber Cuts)
    {
      id: 'c18-r1-g5',
      passageId: 'c18-r1-p2',
      questionType: 'matching_features',
      title: 'Questions 19–21',
      instructions:
        'Look at the following purposes (Questions 19–21) and the list of timber cuts below.\nMatch each purpose with the correct timber cut, A, B or C.\nWrite the correct letter, A, B or C, in boxes 19–21 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 19,
      endQuestionNumber: 21,
      optionsList: CUT_OPTIONS,
      allowMultipleUse: true,
      questions: [
        {
          id: 'c18-r1-q19',
          questionNumber: 19,
          prompt: 'to remove trees that are diseased',
          options: CUT_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph E describes a Salvage Cut: 'These types of cut reduce the number of sick trees and seek to manage the future spread of a pest problem.'",
          evidenceQuote:
            'These types of cut reduce the number of sick trees and seek to manage the future spread of a pest problem.',
          paragraphRef: 'E',
        },
        {
          id: 'c18-r1-q20',
          questionNumber: 20,
          prompt: 'to generate income across a number of years',
          options: CUT_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph F describes a Shelterwood Cut: 'It can also be used to develop a two-tier forest so that there are two harvests and the money that comes in is spread out over a decade or more.'",
          evidenceQuote:
            'there are two harvests and the money that comes in is spread out over a decade or more.',
          paragraphRef: 'F',
        },
        {
          id: 'c18-r1-q21',
          questionNumber: 21,
          prompt: 'to create a forest whose trees are close in age',
          options: CUT_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph F states regarding a Shelterwood Cut: 'It leaves a young forest where all trees are at a similar point in their growth.'",
          evidenceQuote:
            'It leaves a young forest where all trees are at a similar point in their growth.',
          paragraphRef: 'F',
        },
      ],
    },

    // PASSAGE 2: Questions 22-26 (Sentence Completion)
    {
      id: 'c18-r1-g6',
      passageId: 'c18-r1-p2',
      questionType: 'sentence_completion',
      title: 'Questions 22–26',
      instructions:
        'Complete the sentences below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 22–26 on your answer sheet.',
      startQuestionNumber: 22,
      endQuestionNumber: 26,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `22 Some dead wood is removed to avoid the possibility of [[22]]
23 The [[23]] from the tops of cut trees can help improve soil quality.
24 Some damaged trees should be left, as their [[24]] provide habitats for a range of creatures.
25 Some trees that are small, such as [[25]], are a source of food for animals and insects.
26 Any trees that are [[26]] should be left to grow, as they add to the variety of species in the forest.`,
      questions: [
        {
          id: 'c18-r1-q22',
          questionNumber: 22,
          prompt: 'Some dead wood is removed to avoid the possibility of [22]',
          answerKey: 'fire',
          acceptedAlternatives: ['fire'],
          explanation:
            "Paragraph G states: 'Thinnings and dense and dead wood removal for fire prevention also center on the production of low-use wood.'",
          evidenceQuote: 'dead wood removal for fire prevention',
          paragraphRef: 'G',
        },
        {
          id: 'c18-r1-q23',
          questionNumber: 23,
          prompt: 'The [23] from the tops of cut trees can help improve soil quality.',
          answerKey: 'nutrients',
          acceptedAlternatives: ['nutrients', 'nutrient'],
          explanation:
            "Paragraph G notes: 'The tops of trees that have been cut down should be left on the site so that their nutrients cycle back into the soil.'",
          evidenceQuote:
            'The tops of trees that have been cut down should be left on the site so that their nutrients cycle back into the soil.',
          paragraphRef: 'G',
        },
        {
          id: 'c18-r1-q24',
          questionNumber: 24,
          prompt:
            'Some damaged trees should be left, as their [24] provide habitats for a range of creatures.',
          answerKey: 'cavities',
          acceptedAlternatives: ['cavities', 'cavity'],
          explanation:
            "Paragraph G explains: 'In addition, trees with many cavities are extremely important habitats for insect predators like woodpeckers, bats and small mammals.'",
          evidenceQuote:
            'trees with many cavities are extremely important habitats for insect predators like woodpeckers, bats and small mammals.',
          paragraphRef: 'G',
        },
        {
          id: 'c18-r1-q25',
          questionNumber: 25,
          prompt:
            'Some trees that are small, such as [25], are a source of food for animals and insects.',
          answerKey: 'hawthorn',
          acceptedAlternatives: ['hawthorn'],
          explanation:
            "Paragraph G highlights: 'For example, many species like hawthorn provide food for wildlife.'",
          evidenceQuote: 'many species like hawthorn provide food for wildlife.',
          paragraphRef: 'G',
        },
        {
          id: 'c18-r1-q26',
          questionNumber: 26,
          prompt:
            'Any trees that are [26] should be left to grow, as they add to the variety of species in the forest.',
          answerKey: 'rare',
          acceptedAlternatives: ['rare'],
          explanation:
            "Paragraph G concludes: 'Finally, rare species of trees in a forest should also stay behind as they add to its structural diversity.'",
          evidenceQuote:
            'Finally, rare species of trees in a forest should also stay behind as they add to its structural diversity.',
          paragraphRef: 'G',
        },
      ],
    },

    // PASSAGE 3: Questions 27-31 (Matching Information)
    {
      id: 'c18-r1-g7',
      passageId: 'c18-r1-p3',
      questionType: 'matching_information',
      title: 'Questions 27–31',
      instructions:
        'Reading Passage 3 has six sections, A–F.\nWhich section contains the following information?\nWrite the correct letter, A–F, in boxes 27–31 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 31,
      optionsList: SECTION_OPTIONS,
      questions: [
        {
          id: 'c18-r1-q27',
          questionNumber: 27,
          prompt:
            'a reference to the cooperation that takes place to try and minimise risk',
          options: SECTION_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Section C explains: 'companies, governments and other players in space are collaborating in new ways to avoid a shared threat. International groups such as the Inter-Agency Space Debris Coordination Committee have developed guidelines on space sustainability.'",
          evidenceQuote:
            'companies, governments and other players in space are collaborating in new ways to avoid a shared threat.',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r1-q28',
          questionNumber: 28,
          prompt: "an explanation of a person's aims",
          options: SECTION_OPTIONS,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Section F details Moriba Jah's aims: 'Jah describes himself as a space environmentalist: \"I want to make space a place that is safe to operate, that is free and useful for generations to come.\" '",
          evidenceQuote:
            'Jah describes himself as a space environmentalist: "I want to make space a place that is safe to operate, that is free and useful for generations to come."',
          paragraphRef: 'F',
        },
        {
          id: 'c18-r1-q29',
          questionNumber: 29,
          prompt: 'a description of a major collision that occurred in space',
          options: SECTION_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section A describes the 2009 crash: 'Ten years ago, a US commercial Iridium satellite smashed into an inactive Russian communications satellite called Cosmos-2251, creating thousands of new pieces of space shrapnel...'",
          evidenceQuote:
            'Ten years ago, a US commercial Iridium satellite smashed into an inactive Russian communications satellite called Cosmos-2251, creating thousands of new pieces of space shrapnel',
          paragraphRef: 'A',
        },
        {
          id: 'c18-r1-q30',
          questionNumber: 30,
          prompt:
            'a comparison between tracking objects in space and the efficiency of a transportation system',
          options: SECTION_OPTIONS,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Section E compares space traffic to aviation: 'Think about a busy day at an airport... planes line up in the sky, landing and taking off close to one another in a carefully choreographed routine. Air-traffic controllers know the location of the planes down to one metre in accuracy. The same can\\'t be said for space debris.'",
          evidenceQuote:
            'Think about a busy day at an airport, says Moriba Jah... planes line up in the sky... Air-traffic controllers know the location of the planes down to one metre in accuracy. The same can\'t be said for space debris.',
          paragraphRef: 'E',
        },
        {
          id: 'c18-r1-q31',
          questionNumber: 31,
          prompt: 'a reference to efforts to classify space junk',
          options: SECTION_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Section B mentions: 'Others are developing taxonomies of space debris - working on measuring properties such as the shape and size of an object, so that satellite operators know how much to worry about what\\'s coming their way.'",
          evidenceQuote:
            'Others are developing taxonomies of space debris - working on measuring properties such as the shape and size of an object',
          paragraphRef: 'B',
        },
      ],
    },

    // PASSAGE 3: Questions 32-35 (Summary Completion)
    {
      id: 'c18-r1-g8',
      passageId: 'c18-r1-p3',
      questionType: 'summary_completion',
      title: 'Questions 32–35',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 32–35 on your answer sheet.',
      startQuestionNumber: 32,
      endQuestionNumber: 35,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `The Inter-Agency Space Debris Coordination Committee
The committee gives advice on how the [[32]] of space can be achieved. The committee advises that when satellites are no longer active, any unused [[33]] or pressurised material that could cause [[34]] should be removed.
Although operators of large satellite constellations accept that they have obligations as stewards of space, Holger Krag points out that the operators that become [[35]] are unlikely to prioritise removing their satellites from space.`,
      questions: [
        {
          id: 'c18-r1-q32',
          questionNumber: 32,
          prompt:
            'The committee gives advice on how the [32] of space can be achieved.',
          answerKey: 'sustainability',
          acceptedAlternatives: ['sustainability'],
          explanation:
            "Section C states: 'International groups such as the Inter-Agency Space Debris Coordination Committee have developed guidelines on space sustainability.'",
          evidenceQuote:
            'have developed guidelines on space sustainability.',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r1-q33',
          questionNumber: 33,
          prompt:
            'The committee advises that when satellites are no longer active, any unused [33] or pressurised material that could cause [34] should be removed.',
          answerKey: 'fuel',
          acceptedAlternatives: ['fuel'],
          explanation:
            "Section C explains: 'Those include inactivating satellites at the end of their useful life by venting pressurised materials or leftover fuel that might lead to explosions.'",
          evidenceQuote:
            'venting pressurised materials or leftover fuel that might lead to explosions.',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r1-q34',
          questionNumber: 34,
          prompt:
            'venting pressurised materials or leftover fuel that might lead to [34]',
          answerKey: 'explosions',
          acceptedAlternatives: ['explosions', 'explosion'],
          explanation:
            "Section C explains: 'venting pressurised materials or leftover fuel that might lead to explosions.'",
          evidenceQuote: 'leftover fuel that might lead to explosions.',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r1-q35',
          questionNumber: 35,
          prompt:
            'Holger Krag points out that the operators that become [35] are unlikely to prioritise removing their satellites from space.',
          answerKey: 'bankrupt',
          acceptedAlternatives: ['bankrupt'],
          explanation:
            "Section C states: '\"What happens to those that fail or go bankrupt?\" he asks. \"They are probably not going to spend money to remove their satellites from space.\"'",
          evidenceQuote:
            'What happens to those that fail or go bankrupt? he asks. They are probably not going to spend money to remove their satellites from space.',
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 3: Questions 36-40 (Matching Features - People)
    {
      id: 'c18-r1-g9',
      passageId: 'c18-r1-p3',
      questionType: 'matching_features',
      title: 'Questions 36–40',
      instructions:
        'Look at the following statements (Questions 36–40) and the list of people below.\nMatch each statement with the correct person, A, B, C or D.\nWrite the correct letter, A, B, C or D, in boxes 36–40 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 36,
      endQuestionNumber: 40,
      optionsList: PEOPLE_OPTIONS,
      allowMultipleUse: true,
      questions: [
        {
          id: 'c18-r1-q36',
          questionNumber: 36,
          prompt:
            'Knowing the exact location of space junk would help prevent any possible danger.',
          options: PEOPLE_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Section D quotes Marlon Sorge: ' \"If you knew precisely where everything was, you would almost never have a problem,\" says Marlon Sorge, a space-debris specialist at the Aerospace Corporation in El Segundo, California.'",
          evidenceQuote:
            'If you knew precisely where everything was, you would almost never have a problem, says Marlon Sorge',
          paragraphRef: 'D',
        },
        {
          id: 'c18-r1-q37',
          questionNumber: 37,
          prompt:
            'Space should be available to everyone and should be preserved for the future.',
          options: PEOPLE_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Section F quotes Moriba Jah: ' \"I want to make space a place that is safe to operate, that is free and useful for generations to come.\" '",
          evidenceQuote:
            'I want to make space a place that is safe to operate, that is free and useful for generations to come.',
          paragraphRef: 'F',
        },
        {
          id: 'c18-r1-q38',
          questionNumber: 38,
          prompt: 'A recommendation regarding satellites is widely ignored.',
          options: PEOPLE_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Section C quotes Holger Krag: 'The intergovernmental groups also advise lowering satellites deep enough into the atmosphere that they will burn up or disintegrate within 25 years. But so far, only about half of all missions have abided by this 25-year goal, says Holger Krag...'",
          evidenceQuote:
            'only about half of all missions have abided by this 25-year goal, says Holger Krag',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r1-q39',
          questionNumber: 39,
          prompt:
            'There is conflicting information about where some satellites are in space.',
          options: PEOPLE_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Section F describes Moriba Jah's findings: 'the US and Russian sources contain two completely different orbits for the same object. Jah says that it is almost impossible to tell which is correct, unless a third source of information made it possible to cross-correlate.'",
          evidenceQuote:
            'the US and Russian sources contain two completely different orbits for the same object. Jah says that it is almost impossible to tell which is correct',
          paragraphRef: 'F',
        },
        {
          id: 'c18-r1-q40',
          questionNumber: 40,
          prompt:
            'There is a risk we will not be able to undo the damage that occurs in space.',
          options: PEOPLE_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section B quotes Carolin Frueh: ' \"If we go on like this, we will reach a point of no return,\" says Carolin Frueh, an astrodynamical researcher at Purdue University in West Lafayette, Indiana.' A point of no return means not being able to undo the damage.",
          evidenceQuote:
            'If we go on like this, we will reach a point of no return, says Carolin Frueh',
          paragraphRef: 'B',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 18 Academic Reading Test 1',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge18ReadingTest1(authorId?: string) {
  const data = getCambridge18ReadingTest1Data();

  const validationErrors = validateTestVersion(data.passages, data.questionGroups);

  if (validationErrors.length > 0) {
    throw new Error(
      `Cambridge 18 Reading Test 1 validation failed:\n${validationErrors.join('\n')}`
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
