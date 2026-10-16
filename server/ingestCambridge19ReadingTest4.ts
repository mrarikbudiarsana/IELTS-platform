import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge19ReadingTest4Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c19-r4-p1',
      passageNumber: 1,
      title: 'The impact of climate change on butterflies in Britain',
      subtitle:
        'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c19-r4-p1-1',
          label: '1',
          content: `According to conservationists, populations of around two thirds of butterfly species have declined in Britain over the past 40 years. If this trend continues, it might have unpredictable knock-on effects for other species in the ecosystem. Butterfly eggs develop into caterpillars and these insects, which are the second stage in a new butterfly's lifecycle, consume vast quantities of plant material, and in turn act as prey for birds as well as bats and other small mammals. Only by arming themselves with an understanding of why butterfly numbers are down can conservationists hope to halt or reverse the decline.`,
        },
        {
          id: 'c19-r4-p1-2',
          label: '2',
          content: `Butterflies prefer outdoor conditions to be 'just right', which means neither too hot nor too cold. Under the conditions of climate change, the temperature at any given time in summer is generally getting warmer, leaving butterflies with the challenge of how to deal with this. One of the main ways in which species are ensuring conditions suit them is by changing the time of year at which they are active and reproduce. Scientists refer to the timing of such lifecycle events as 'phenology', so when an animal or plant starts to do something earlier in the year than it usually does, it is said to be 'advancing its phenology'.`,
        },
        {
          id: 'c19-r4-p1-3',
          label: '3',
          content: `These advances have been observed already in a wide range of butterflies - indeed, most species are advancing their phenology to some extent. In Britain, as the average spring temperature has increased by roughly 0.5 °C over the past 20 years, species have advanced by between three days and a week on average, to keep in line with cooler temperatures. Is this a sign that butterflies are well equipped to cope with climate change, and readily adjust to new temperatures? Or are these populations under stress, being dragged along unwillingly by unnaturally fast changes? The answer is still unknown, but a new study is seeking to answer these questions.`,
        },
        {
          id: 'c19-r4-p1-4',
          label: '4',
          content: `First, the researchers pulled together data from millions of records that had been submitted by butterfly enthusiasts - people who spend their free time observing the activities of different species. This provided information on 130 species of butterflies in Great Britain every year for a 20-year period. They then estimated the abundance and distribution of each species across this time, along with how far north in the country they had moved. The data also, crucially, allowed researchers to estimate subtle changes in what time of the year each species was changing into an adult butterfly.`,
        },
        {
          id: 'c19-r4-p1-5',
          label: '5',
          content: `Analysing the trends in each variable, the researchers discovered that species with more flexible lifecycles were more likely to be able to benefit from an earlier emergence driven by climate change. Some species are able to go from caterpillar to butterfly twice or more per year, so that the individual butterflies you see flying in the spring are the grandchildren or great-grandchildren of the individuals seen a year previously.`,
        },
        {
          id: 'c19-r4-p1-6',
          label: '6',
          content: `Among these species, researchers observed that those which have been advancing their phenology the most over the 20-year study period also had the most positive trends in abundance, distribution and northwards extent. For these species, such as Britain's tiniest butterfly, the dainty Small Blue, whose colonies are up to a hundred strong, some develop into butterflies early in spring, allowing their summer generations to complete another reproductive cycle by autumn so that more population growth occurs.`,
        },
        {
          id: 'c19-r4-p1-7',
          label: '7',
          content: `Other species, however, are less flexible and restricted to a single reproductive cycle per year. For these species, there was no evidence of any benefit to emerging earlier. Indeed, worryingly, it was found that the species in this group that specialise in very specific habitat types, often related to the caterpillar's preferred diet, actually tended to be most at harm from advancing phenology. The beautiful High Brown Fritillary, often described as Britain's most endangered butterfly, is in this group. It is found only in coppiced woodland and limestone pavement habitats. It is also a single-generation butterfly that has advanced its phenology. This suggests that climate change, while undoubtedly not the sole cause, might have played a part in the downfall of this species.`,
        },
        {
          id: 'c19-r4-p1-8',
          label: '8',
          content: `All is not lost, however. Many of Britain's single-generation species show the capacity, in continental Europe, to add a second generation in years that are sufficiently warm. Therefore, as the climate continues to warm, species like the Silver-studded Blue might be able to switch to multiple generations in the UK as well, and so begin to extract benefits from the additional warmth, potentially leading to population increases.`,
        },
        {
          id: 'c19-r4-p1-9',
          label: '9',
          content: `More immediately, conservationists can arm themselves with all this knowledge to spot the warning signs of species that may be at risk. The White Admiral of southern England, a much sought-after butterfly, experienced a significant increase in numbers from the 1920s but has shown a considerable decline in the past 20 years. This may be because the caterpillar exists solely on a diet of a plant called honeysuckle. But it is also likely to be due to climate change.`,
        },
      ],
    },
    {
      id: 'c19-r4-p2',
      passageNumber: 2,
      title: 'Deep-sea mining',
      subtitle:
        'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c19-r4-p2-A',
          label: 'A',
          content: `When Professor Mat Upton found that a microbe from a deep-sea sponge was killing pathogenic bugs in his laboratory, he realised it could be a breakthrough in the fight against antibiotic-resistant superbugs, which are responsible for thousands of deaths a year in the UK alone. Further tests confirmed that an antibiotic from the sponge bacteria, found living more than 700 metres under the sea at the Rockall trough in the north-east Atlantic, was previously unknown to science, boosting its potential as a life-saving medicine. But Upton, and other scientists who view the deep ocean and its wealth of unique and undocumented species as a prospecting ground for new medicines, fear such potential will be lost in the rush to exploit the deep sea's equally rich metal and mineral resources.`,
        },
        {
          id: 'c19-r4-p2-B',
          label: 'B',
          content: `'We're looking at the bioactive potential of marine resources, to see if there are any more medicines or drugs down there before we destroy it for ever,' says Upton, a medical microbiologist at the University of Plymouth. He is among many scientists urging a halt to deep-sea mining, asking for time to weigh up the pros and cons. 'In sustainability terms, this could be a better way of exploiting the economic potential of the deep sea,' he argues. Oceanographers using remotely operated vehicles have spotted many new species. Among them have been sea cucumbers with tails allowing them to sail along the ocean floor, and a rare 'Dumbo' octopus, found 3,000 metres under the Pacific Ocean, off the coast of California. Any one of these could offer lifesaving potential. Upton estimates it could take up to a decade for a newly discovered antibiotic to become a medicine – but the race towards commercial mining in the ocean abyss has already begun.`,
        },
        {
          id: 'c19-r4-p2-C',
          label: 'C',
          content: `The deep sea contains more nickel, cobalt and rare earth metals than all land reserves combined, according to the US Geological Survey. Mining corporations argue that deep-sea exploration could help diversify the supply of metals and point to the fact that demand for resources such as copper, aluminium, cobalt for electric car batteries and other metals to power technology and smartphones, is soaring. They say that deep-sea mining could yield far superior ore to land mining with little, if any, waste. Different methods of extraction exist, but most involve employing some form of converted machinery previously used in terrestrial mining to excavate materials from the sea floor, at depths of up to 6,000 metres, then drawing a seawater slurry, containing rock and other solid particles, from the sea floor to ships on the surface. The slurry is then 'de-watered' and transferred to another vessel for shipping. Extracted seawater is pumped back down and discharged close to the sea floor.`,
        },
        {
          id: 'c19-r4-p2-D',
          label: 'D',
          content: `But environmental and legal groups have urged caution, arguing there are potentially massive and unknown ramifications for the environment and for nearby communities, and that the global regulatory framework is not yet drafted. 'Despite arising in the last half century, the "new global gold rush" of deep-sea mining shares many features with past resource scrambles - including a general disregard for environmental and social impacts, and the marginalisation of indigenous peoples and their rights,' a paper, written by Julie Hunter and Julian Aguon, from Blue Ocean Law, and Pradeep Singh, from the Center for Marine Environmental Sciences, Bremen, argues. The authors say that knowledge of the deep seabed remains extremely limited. 'The surface of the Moon, Mars and even Venus have all been mapped and studied in much greater detail, leading marine scientists to commonly remark that, with respect to the deep sea, "We don't yet know what we need to know".'`,
        },
        {
          id: 'c19-r4-p2-E',
          label: 'E',
          content: `Scientific research – including a recent paper in Marine Policy journal – has suggested the deep seabed, and hydrothermal vents, which are created when seawater meets volcanic magma, have crucial impacts upon biodiversity and the global climate. The mineral-rich vents and their surrounds are also home to many well-known animals including crustaceans, tubeworms, clams, slugs, anemones and fish. 'It is becoming increasingly clear that deep-sea mining poses a grave threat to these vital seabed functions,' the paper says. 'Extraction methods would produce large sediment plumes and involve the discharge of waste back into the ocean, significantly disturbing seafloor environments,' the paper continues. 'On deep sea vents, scientists are clear,' says Dr Jon Copley of the National Oceanography Centre, Southampton: 'we don't want mining on them.'`,
        },
        {
          id: 'c19-r4-p2-F',
          label: 'F',
          content: `The oceans occupy around 70% of the planet and are relatively unexplored, says Mike Johnston, chief executive of Nautilus, a Canadian underwater exploration company: 'It makes sense to explore this untapped potential in an environmentally sustainable way, instead of continually looking at the fast depleting land resources of the planet to meet society's rising needs.' Those leading the global rush to place giant mining machines thousands of metres below the sea surface say the environmental impacts will be far lower than on land. But critics say exotic and little-known ecosystems in the deep oceans could be destroyed and must be protected. 'Mining will be the greatest assault on deep-sea ecosystems ever inflicted by humans,' according to hydrothermal vent expert Verena Tunnicliffe, at the University of Victoria in Canada. She argues that active vents must be off-limits for mining to protect the new knowledge and biotechnology spin-offs they can deliver, and that strict controls must be in place elsewhere.`,
        },
      ],
    },
    {
      id: 'c19-r4-p3',
      passageNumber: 3,
      title: 'The Unselfish Gene',
      subtitle:
        'A psychologist gives his view on how humans became self-centred\n\nYou should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c19-r4-p3-1',
          label: '1',
          content: `There has long been a general assumption that human beings are essentially selfish. We're apparently ruthless, with strong impulses to compete against each other for resources and to accumulate power and possessions. If we are kind to one another, it's usually because we have ulterior motives. If we are good, it's only because we have managed to control and transcend our innate selfishness and brutality.`,
        },
        {
          id: 'c19-r4-p3-2',
          label: '2',
          content: `This bleak view of human nature is closely associated with the science writer Richard Dawkins, whose 1976 book The Selfish Gene became popular because it fitted so well with – and helped to justify – the competitive and individualistic ethos that was so prevalent in late 20th-century societies. Like many others, Dawkins justifies his views with reference to the field of evolutionary psychology. Evolutionary psychology theorises that present-day human traits developed in prehistoric times, during what is termed the 'environment of evolutionary adaptedness'.`,
        },
        {
          id: 'c19-r4-p3-3',
          label: '3',
          content: `Prehistory is usually seen as a period of intense competition, when life was such a brutal battle that only those with traits such as selfishness, aggression and ruthlessness survived. And because survival depended on access to resources – such as rivers, forests and animals – there was bound to be conflict between rival groups, which led to the development of traits such as racism and warfare. This seems logical. But, in fact, the assumption on which this all rests – that prehistoric life was a desperate struggle for survival – is false.`,
        },
        {
          id: 'c19-r4-p3-4',
          label: '4',
          content: `It's important to remember that in the prehistoric era, the world was very sparsely populated. According to some estimates, around 15,000 years ago, the population of Europe was only 29,000, and the population of the whole world was less than half a million. Humans at that time were hunter-gatherers: people who lived by hunting wild animals and collecting wild plants. With such small population densities, it seems unlikely that prehistoric hunter-gatherer groups had to compete against each other for resources or had any need to develop ruthlessness and competitiveness, or to go to war.`,
        },
        {
          id: 'c19-r4-p3-5',
          label: '5',
          content: `There is significant evidence to back this notion from contemporary hunter-gatherer groups, who live in the same way as prehistoric humans did. As the anthropologist Bruce Knauft has remarked, hunter-gatherers are characterised by 'extreme political and sexual egalitarianism'. Knauft has observed that individuals in such groups don't accumulate property or possessions and have an ethical obligation to share everything. They also have methods of preserving egalitarianism by ensuring that disparities of status don't arise.`,
        },
        {
          id: 'c19-r4-p3-6',
          label: '6',
          content: `The !Kung people of southern Africa, for example, swap arrows before going hunting and when an animal is killed, the acclaim does not go to the person who fired the arrow, but to the person the arrow belongs to. And if a person becomes too domineering, the other members of the group ostracise them, exiling the offender from society. Typically in such groups, men do not dictate what women do. Women in hunter-gatherer groups worldwide often benefit from a high level of autonomy, being able to select their own marriage partners, decide what work they do and work whenever they choose to. And if a marriage breaks down, they have custody rights over their children.`,
        },
        {
          id: 'c19-r4-p3-7',
          label: '7',
          content: `Many anthropologists believe that societies such as the !Kung were normal until a few thousand years ago, when population growth led to the development of agriculture and a settled lifestyle. In view of the above, there seems little reason to assume that traits such as racism, warfare and male domination should have been selected by evolution as they would have been of little benefit in the prehistoric era. Individuals who behaved selfishly and ruthlessly would be less likely to survive, since they would have been ostracised from their groups.`,
        },
        {
          id: 'c19-r4-p3-8',
          label: '8',
          content: `It makes more sense, then, to see traits such as cooperation, egalitarianism, altruism and peacefulness as innate characteristics of human beings. These were the traits that were prevalent in human life for tens of thousands of years. So presumably these traits are still strong in us now.`,
        },
        {
          id: 'c19-r4-p3-9',
          label: '9',
          content: `But if prehistoric life wasn't really as brutal as has often been assumed, why do modern humans behave so selfishly and ruthlessly? Perhaps these negative traits should be seen as a later development, the result of environmental and psychological factors. Research has shown repeatedly that when the natural habitats of primates such as apes and gorillas are disrupted, they tend to become more violent and hierarchical. So, it could well be that the same thing has happened to us. I believe that the end of the hunter-gatherer lifestyle and the advent of farming was connected to a psychological change that occurred in some groups of people. There was a new sense of individuality and separateness, which led to a new selfishness, and ultimately to hierarchical societies, patriarchy and warfare. At any rate, these negative traits appear to have developed so recently that it doesn't seem feasible to explain them in adaptive or evolutionary terms.`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // Passage 1: Questions 1-6 (True / False / Not Given)
    {
      id: 'c19-r4-g1',
      passageId: 'c19-r4-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–6',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–6 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      questions: [
        {
          id: 'c19-r4-q1',
          questionNumber: 1,
          prompt:
            'Forty years ago, there were fewer butterflies in Britain than at present.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 1 states: 'According to conservationists, populations of around two thirds of butterfly species have declined in Britain over the past 40 years.' This means there were more butterflies forty years ago, not fewer.",
          evidenceQuote:
            'populations of around two thirds of butterfly species have declined in Britain over the past 40 years',
          paragraphRef: '1',
        },
        {
          id: 'c19-r4-q2',
          questionNumber: 2,
          prompt: 'Caterpillars are eaten by a number of different predators.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 1 states: '...these insects, which are the second stage in a new butterfly's lifecycle, consume vast quantities of plant material, and in turn act as prey for birds as well as bats and other small mammals.'",
          evidenceQuote: 'act as prey for birds as well as bats and other small mammals',
          paragraphRef: '1',
        },
        {
          id: 'c19-r4-q3',
          questionNumber: 3,
          prompt:
            "'Phenology' is a term used to describe a creature's ability to alter the location of a lifecycle event.",
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 2 states: 'Scientists refer to the timing of such lifecycle events as \"phenology\"...'. It describes timing (the time of year), not location.",
          evidenceQuote: 'Scientists refer to the timing of such lifecycle events as \'phenology\'',
          paragraphRef: '2',
        },
        {
          id: 'c19-r4-q4',
          questionNumber: 4,
          prompt:
            'Some species of butterfly have a reduced lifespan due to spring temperature increases.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 3 mentions that spring temperatures have increased and species have advanced their timing, but there is no mention of butterflies having a reduced lifespan.",
          evidenceQuote:
            'In Britain, as the average spring temperature has increased by roughly 0.5 °C over the past 20 years, species have advanced by between three days and a week on average',
          paragraphRef: '3',
        },
        {
          id: 'c19-r4-q5',
          questionNumber: 5,
          prompt:
            'There is a clear reason for the adaptations that butterflies are making to climate change.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 3 asks whether this is a sign butterflies are well equipped or under stress, and states: 'The answer is still unknown, but a new study is seeking to answer these questions.' Thus, there is not yet a clear reason.",
          evidenceQuote: 'The answer is still unknown, but a new study is seeking to answer these questions.',
          paragraphRef: '3',
        },
        {
          id: 'c19-r4-q6',
          questionNumber: 6,
          prompt:
            'The data used in the study was taken from the work of amateur butterfly watchers.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 4 states: 'First, the researchers pulled together data from millions of records that had been submitted by butterfly enthusiasts - people who spend their free time observing the activities of different species.'",
          evidenceQuote:
            'data from millions of records that had been submitted by butterfly enthusiasts - people who spend their free time observing the activities of different species',
          paragraphRef: '4',
        },
      ],
    },

    // Passage 1: Questions 7-13 (Note Completion)
    {
      id: 'c19-r4-g2',
      passageId: 'c19-r4-p1',
      questionType: 'note_completion',
      title: 'Butterflies in the UK',
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 7–13 on your answer sheet.',
      startQuestionNumber: 7,
      endQuestionNumber: 13,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      contentWithGaps: `Butterflies in the UK

The Small Blue
• lives in large [[7]]
• first appears at the start of [[8]]
• completes more than one reproductive cycle per year

The High Brown Fritillary
• has one reproductive cycle
• is considered to be more [[9]] than other species
• its caterpillars occupy a limited range of [[10]]

The Silver-studded Blue
• is already able to reproduce twice a year in warm areas of [[11]]

The White Admiral
• is found in [[12]] areas of England
• both climate change and the [[13]] of the caterpillar are possible reasons for decline`,
      questions: [
        {
          id: 'c19-r4-q7',
          questionNumber: 7,
          prompt: 'The Small Blue lives in large [7]',
          answerKey: 'colonies',
          acceptedAlternatives: ['colonies', 'colony'],
          explanation:
            "Paragraph 6 states: '...Britain's tiniest butterfly, the dainty Small Blue, whose colonies are up to a hundred strong...'",
          evidenceQuote: 'whose colonies are up to a hundred strong',
          paragraphRef: '6',
        },
        {
          id: 'c19-r4-q8',
          questionNumber: 8,
          prompt: 'first appears at the start of [8]',
          answerKey: 'spring',
          acceptedAlternatives: ['spring'],
          explanation:
            "Paragraph 6 states: '...some develop into butterflies early in spring, allowing their summer generations to complete another reproductive cycle by autumn...'",
          evidenceQuote: 'some develop into butterflies early in spring',
          paragraphRef: '6',
        },
        {
          id: 'c19-r4-q9',
          questionNumber: 9,
          prompt: 'is considered to be more [9] than other species',
          answerKey: 'endangered',
          acceptedAlternatives: ['endangered'],
          explanation:
            "Paragraph 7 states: 'The beautiful High Brown Fritillary, often described as Britain's most endangered butterfly, is in this group.'",
          evidenceQuote: 'often described as Britain\'s most endangered butterfly',
          paragraphRef: '7',
        },
        {
          id: 'c19-r4-q10',
          questionNumber: 10,
          prompt: 'its caterpillars occupy a limited range of [10]',
          answerKey: 'habitats',
          acceptedAlternatives: ['habitats', 'habitat'],
          explanation:
            "Paragraph 7 states: '...species in this group that specialise in very specific habitat types... It is found only in coppiced woodland and limestone pavement habitats.'",
          evidenceQuote: 'specialise in very specific habitat types... It is found only in coppiced woodland and limestone pavement habitats',
          paragraphRef: '7',
        },
        {
          id: 'c19-r4-q11',
          questionNumber: 11,
          prompt: 'is already able to reproduce twice a year in warm areas of [11]',
          answerKey: 'Europe',
          acceptedAlternatives: ['Europe'],
          explanation:
            "Paragraph 8 states: 'Many of Britain's single-generation species show the capacity, in continental Europe, to add a second generation in years that are sufficiently warm.'",
          evidenceQuote: 'show the capacity, in continental Europe, to add a second generation in years that are sufficiently warm',
          paragraphRef: '8',
        },
        {
          id: 'c19-r4-q12',
          questionNumber: 12,
          prompt: 'is found in [12] areas of England',
          answerKey: 'southern',
          acceptedAlternatives: ['southern'],
          explanation:
            "Paragraph 9 states: 'The White Admiral of southern England, a much sought-after butterfly...'",
          evidenceQuote: 'The White Admiral of southern England',
          paragraphRef: '9',
        },
        {
          id: 'c19-r4-q13',
          questionNumber: 13,
          prompt: 'both climate change and the [13] of the caterpillar are possible reasons for decline',
          answerKey: 'diet',
          acceptedAlternatives: ['diet'],
          explanation:
            "Paragraph 9 states: 'This may be because the caterpillar exists solely on a diet of a plant called honeysuckle. But it is also likely to be due to climate change.'",
          evidenceQuote: 'the caterpillar exists solely on a diet of a plant called honeysuckle',
          paragraphRef: '9',
        },
      ],
    },

    // Passage 2: Questions 14-17 (Matching Information)
    {
      id: 'c19-r4-g3',
      passageId: 'c19-r4-p2',
      questionType: 'matching_information',
      title: 'Questions 14–17',
      instructions:
        'Reading Passage 2 has six paragraphs, A–F.\nWhich paragraph contains the following information?\nWrite the correct letter, A–F, in boxes 14–17 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 17,
      optionsList: [
        { key: 'A', text: 'Paragraph A' },
        { key: 'B', text: 'Paragraph B' },
        { key: 'C', text: 'Paragraph C' },
        { key: 'D', text: 'Paragraph D' },
        { key: 'E', text: 'Paragraph E' },
        { key: 'F', text: 'Paragraph F' },
      ],
      questions: [
        {
          id: 'c19-r4-q14',
          questionNumber: 14,
          prompt:
            'reference to the rapidly increasing need for one raw material in the transport industry',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph C states: '...demand for resources such as copper, aluminium, cobalt for electric car batteries and other metals to power technology and smartphones, is soaring.'",
          evidenceQuote:
            'demand for resources such as copper, aluminium, cobalt for electric car batteries and other metals to power technology and smartphones, is soaring',
          paragraphRef: 'C',
        },
        {
          id: 'c19-r4-q15',
          questionNumber: 15,
          prompt: 'a rough estimate of the area of the Earth covered by the oceans',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph F states: 'The oceans occupy around 70% of the planet and are relatively unexplored...'",
          evidenceQuote: 'The oceans occupy around 70% of the planet',
          paragraphRef: 'F',
        },
        {
          id: 'c19-r4-q16',
          questionNumber: 16,
          prompt:
            'how a particular underwater habitat, where minerals and organisms co-exist, is formed',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph E states: '...hydrothermal vents, which are created when seawater meets volcanic magma, have crucial impacts upon biodiversity and the global climate. The mineral-rich vents and their surrounds are also home to many well-known animals...'",
          evidenceQuote:
            'hydrothermal vents, which are created when seawater meets volcanic magma, have crucial impacts upon biodiversity and the global climate. The mineral-rich vents and their surrounds are also home to many well-known animals',
          paragraphRef: 'E',
        },
        {
          id: 'c19-r4-q17',
          questionNumber: 17,
          prompt:
            'reference to the fact that the countries of the world have yet to agree on rules for the exploration of the seabed',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph D states: '...and that the global regulatory framework is not yet drafted.'",
          evidenceQuote: 'and that the global regulatory framework is not yet drafted',
          paragraphRef: 'D',
        },
      ],
    },

    // Passage 2: Questions 18-23 (Matching Features / People)
    {
      id: 'c19-r4-g4',
      passageId: 'c19-r4-p2',
      questionType: 'matching_features',
      title: 'Questions 18–23',
      instructions:
        'Look at the following statements (Questions 18–23) and the list of people below.\nMatch each statement with the correct person or people, A–E.\nWrite the correct letter, A–E, in boxes 18–23 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 18,
      endQuestionNumber: 23,
      optionReuseAllowed: true,
      optionsList: [
        { key: 'A', text: 'Professor Mat Upton' },
        { key: 'B', text: 'Julie Hunter, Julian Aguon and Pradeep Singh' },
        { key: 'C', text: 'Dr Jon Copley' },
        { key: 'D', text: 'Mike Johnston' },
        { key: 'E', text: 'Verena Tunnicliffe' },
      ],
      questions: [
        {
          id: 'c19-r4-q18',
          questionNumber: 18,
          prompt:
            'A move away from the exploration of heavily mined reserves on land is a good idea.',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph F states: 'Mike Johnston... \"It makes sense to explore this untapped potential in an environmentally sustainable way, instead of continually looking at the fast depleting land resources of the planet to meet society's rising needs.\"'",
          evidenceQuote:
            'instead of continually looking at the fast depleting land resources of the planet to meet society\'s rising needs',
          paragraphRef: 'F',
        },
        {
          id: 'c19-r4-q19',
          questionNumber: 19,
          prompt:
            'The negative effects of undersea exploration on local areas and their inhabitants are being ignored.',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph D states that Julie Hunter, Julian Aguon and Pradeep Singh argue that deep-sea mining shares features with past scrambles, 'including a general disregard for environmental and social impacts, and the marginalisation of indigenous peoples and their rights'.",
          evidenceQuote:
            'including a general disregard for environmental and social impacts, and the marginalisation of indigenous peoples and their rights',
          paragraphRef: 'D',
        },
        {
          id: 'c19-r4-q20',
          questionNumber: 20,
          prompt:
            'There are more worthwhile things to extract from the sea than minerals.',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph B states: '\"We're looking at the bioactive potential of marine resources, to see if there are any more medicines or drugs down there before we destroy it for ever,\" says Upton... \"In sustainability terms, this could be a better way of exploiting the economic potential of the deep sea,\" he argues.'",
          evidenceQuote:
            'In sustainability terms, this could be a better way of exploiting the economic potential of the deep sea',
          paragraphRef: 'B',
        },
        {
          id: 'c19-r4-q21',
          questionNumber: 21,
          prompt:
            'No other form of human exploration will have such a destructive impact on marine life as deep-sea mining.',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph F states: '\"Mining will be the greatest assault on deep-sea ecosystems ever inflicted by humans,\" according to hydrothermal vent expert Verena Tunnicliffe...'",
          evidenceQuote:
            'Mining will be the greatest assault on deep-sea ecosystems ever inflicted by humans',
          paragraphRef: 'F',
        },
        {
          id: 'c19-r4-q22',
          questionNumber: 22,
          prompt:
            'More is known about outer space than about what lies beneath the oceans.',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph D states that Hunter, Aguon, and Singh write: 'The surface of the Moon, Mars and even Venus have all been mapped and studied in much greater detail...'",
          evidenceQuote:
            'The surface of the Moon, Mars and even Venus have all been mapped and studied in much greater detail',
          paragraphRef: 'D',
        },
        {
          id: 'c19-r4-q23',
          questionNumber: 23,
          prompt:
            'There is one marine life habitat where experts agree mining should not take place.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph E states: '\"On deep sea vents, scientists are clear,\" says Dr Jon Copley of the National Oceanography Centre, Southampton: \"we don't want mining on them.\"'",
          evidenceQuote:
            'On deep sea vents, scientists are clear... we don\'t want mining on them',
          paragraphRef: 'E',
        },
      ],
    },

    // Passage 2: Questions 24-26 (Summary Completion Words)
    {
      id: 'c19-r4-g5',
      passageId: 'c19-r4-p2',
      questionType: 'summary_completion_words',
      title: 'Mining the sea floor',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 24–26 on your answer sheet.',
      startQuestionNumber: 24,
      endQuestionNumber: 26,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      contentWithGaps: `Mining the sea floor

Mining corporations believe that the mineral resources lying under the sea may be superior to those found in the earth. They also say that these can be removed without producing much [[24]]. The extraction is often done by adapting the [[25]] that has already been used to work on land. The method of excavation involves removing the seawater from the slurry that is brought up to ships and returning it to the seabed. However, concerned groups strongly believe that [[26]] is necessary due to the possible number of unidentified consequences.`,
      questions: [
        {
          id: 'c19-r4-q24',
          questionNumber: 24,
          prompt:
            'They also say that these can be removed without producing much [24]',
          answerKey: 'waste',
          acceptedAlternatives: ['waste'],
          explanation:
            "Paragraph C states: 'They say that deep-sea mining could yield far superior ore to land mining with little, if any, waste.'",
          evidenceQuote: 'yield far superior ore to land mining with little, if any, waste',
          paragraphRef: 'C',
        },
        {
          id: 'c19-r4-q25',
          questionNumber: 25,
          prompt:
            'The extraction is often done by adapting the [25] that has already been used to work on land.',
          answerKey: 'machinery',
          acceptedAlternatives: ['machinery'],
          explanation:
            "Paragraph C states: '...most involve employing some form of converted machinery previously used in terrestrial mining to excavate materials from the sea floor...'",
          evidenceQuote:
            'converted machinery previously used in terrestrial mining',
          paragraphRef: 'C',
        },
        {
          id: 'c19-r4-q26',
          questionNumber: 26,
          prompt:
            'However, concerned groups strongly believe that [26] is necessary due to the possible number of unidentified consequences.',
          answerKey: 'caution',
          acceptedAlternatives: ['caution'],
          explanation:
            "Paragraph D states: 'But environmental and legal groups have urged caution, arguing there are potentially massive and unknown ramifications for the environment...'",
          evidenceQuote:
            'environmental and legal groups have urged caution, arguing there are potentially massive and unknown ramifications',
          paragraphRef: 'D',
        },
      ],
    },

    // Passage 3: Questions 27-30 (Multiple Choice Single)
    {
      id: 'c19-r4-g6',
      passageId: 'c19-r4-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–30',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–30 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c19-r4-q27',
          questionNumber: 27,
          prompt: 'What is the writer doing in the first paragraph?',
          options: [
            { key: 'A', text: 'setting out two opposing views about human nature' },
            { key: 'B', text: 'justifying his opinion about our tendency to be greedy' },
            { key: 'C', text: "describing a commonly held belief about people's behaviour" },
            { key: 'D', text: 'explaining why he thinks that humans act in a selfish manner' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 1 opens with: 'There has long been a general assumption that human beings are essentially selfish. We're apparently ruthless, with strong impulses to compete against each other for resources...'. This describes a commonly held belief / general assumption about people's behaviour.",
          evidenceQuote:
            'There has long been a general assumption that human beings are essentially selfish.',
          paragraphRef: '1',
        },
        {
          id: 'c19-r4-q28',
          questionNumber: 28,
          prompt: "What point is made about Richard Dawkins' book The Selfish Gene?",
          options: [
            { key: 'A', text: 'Its appeal lay in the radical nature of its ideas.' },
            { key: 'B', text: 'Its success was due to the scientific support it offered.' },
            { key: 'C', text: 'It presented a view that was in line with the attitudes of its time.' },
            { key: 'D', text: 'It took an innovative approach to the analysis of human psychology.' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 2 states: '...whose 1976 book The Selfish Gene became popular because it fitted so well with – and helped to justify – the competitive and individualistic ethos that was so prevalent in late 20th-century societies.' Fitting with prevalent ethos means presenting a view in line with the attitudes of its time.",
          evidenceQuote:
            'became popular because it fitted so well with – and helped to justify – the competitive and individualistic ethos that was so prevalent in late 20th-century societies',
          paragraphRef: '2',
        },
        {
          id: 'c19-r4-q29',
          questionNumber: 29,
          prompt:
            'What does the writer suggest about the prehistoric era in the fourth paragraph?',
          options: [
            { key: 'A', text: 'Societies were more complex than many people believe.' },
            { key: 'B', text: 'Supplies of natural resources were probably relatively plentiful.' },
            { key: 'C', text: 'Most estimates about population sizes are likely to be inaccurate.' },
            { key: 'D', text: 'Humans moved across continents more than was previously thought.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 4 highlights that the world was very sparsely populated (less than half a million people worldwide), meaning: 'With such small population densities, it seems unlikely that prehistoric hunter-gatherer groups had to compete against each other for resources...'. Plentiful resources relative to the small population removed the need for competition.",
          evidenceQuote:
            'With such small population densities, it seems unlikely that prehistoric hunter-gatherer groups had to compete against each other for resources',
          paragraphRef: '4',
        },
        {
          id: 'c19-r4-q30',
          questionNumber: 30,
          prompt: "The writer refers to Bruce Knauft's work as support for the idea that",
          options: [
            { key: 'A', text: 'selfishness is a relatively recent development in human societies.' },
            { key: 'B', text: 'only people in isolated communities can live in an unselfish manner.' },
            { key: 'C', text: 'very few lifestyles have survived unchanged since prehistoric times.' },
            { key: 'D', text: 'hunter-gatherer cultures worldwide are declining in number.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 5 uses Knauft's evidence of egalitarianism in contemporary hunter-gatherers, living as prehistoric humans did, to argue against innate brutality and selfishness, leading to the conclusion that selfishness is a recent post-prehistoric development.",
          evidenceQuote:
            'There is significant evidence to back this notion from contemporary hunter-gatherer groups, who live in the same way as prehistoric humans did.',
          paragraphRef: '5',
        },
      ],
    },

    // Passage 3: Questions 31-35 (Summary Completion Words)
    {
      id: 'c19-r4-g7',
      passageId: 'c19-r4-p3',
      questionType: 'summary_completion_words',
      title: 'Contemporary hunter-gatherer societies',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 31–35 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 35,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      contentWithGaps: `Contemporary hunter-gatherer societies

Bruce Knauft's research shows that contemporary hunter-gatherer societies tend to exhibit a high level of [[31]] in all areas of life. In these cultures, distributing resources fairly among all members is a moral obligation. These societies also employ strategies to prevent differences in [[32]] occurring: for example, the !Kung follow a custom whereby the credit for one person's success at [[33]] is given to another member of the group. Individuals who behave in a [[34]] manner are punished by being excluded from the group, and women have a considerable amount of [[35]] in choices regarding work and marriage.`,
      questions: [
        {
          id: 'c19-r4-q31',
          questionNumber: 31,
          prompt:
            'Bruce Knauft\'s research shows that contemporary hunter-gatherer societies tend to exhibit a high level of [31] in all areas of life.',
          answerKey: 'egalitarianism',
          acceptedAlternatives: ['egalitarianism'],
          explanation:
            "Paragraph 5 states: '...hunter-gatherers are characterised by \"extreme political and sexual egalitarianism\".'",
          evidenceQuote:
            'hunter-gatherers are characterised by \'extreme political and sexual egalitarianism\'',
          paragraphRef: '5',
        },
        {
          id: 'c19-r4-q32',
          questionNumber: 32,
          prompt:
            'These societies also employ strategies to prevent differences in [32] occurring:',
          answerKey: 'status',
          acceptedAlternatives: ['status'],
          explanation:
            "Paragraph 5 states: 'They also have methods of preserving egalitarianism by ensuring that disparities of status don't arise.'",
          evidenceQuote: 'ensuring that disparities of status don\'t arise',
          paragraphRef: '5',
        },
        {
          id: 'c19-r4-q33',
          questionNumber: 33,
          prompt:
            'the !Kung follow a custom whereby the credit for one person\'s success at [33] is given to another member of the group.',
          answerKey: 'hunting',
          acceptedAlternatives: ['hunting'],
          explanation:
            "Paragraph 6 states: 'The !Kung people of southern Africa, for example, swap arrows before going hunting and when an animal is killed, the acclaim does not go to the person who fired the arrow, but to the person the arrow belongs to.'",
          evidenceQuote:
            'swap arrows before going hunting and when an animal is killed, the acclaim does not go to the person who fired the arrow',
          paragraphRef: '6',
        },
        {
          id: 'c19-r4-q34',
          questionNumber: 34,
          prompt:
            'Individuals who behave in a [34] manner are punished by being excluded from the group',
          answerKey: 'domineering',
          acceptedAlternatives: ['domineering'],
          explanation:
            "Paragraph 6 states: 'And if a person becomes too domineering, the other members of the group ostracise them, exiling the offender from society.'",
          evidenceQuote:
            'if a person becomes too domineering, the other members of the group ostracise them',
          paragraphRef: '6',
        },
        {
          id: 'c19-r4-q35',
          questionNumber: 35,
          prompt:
            'women have a considerable amount of [35] in choices regarding work and marriage.',
          answerKey: 'autonomy',
          acceptedAlternatives: ['autonomy'],
          explanation:
            "Paragraph 6 states: 'Women in hunter-gatherer groups worldwide often benefit from a high level of autonomy, being able to select their own marriage partners, decide what work they do and work whenever they choose to.'",
          evidenceQuote:
            'Women in hunter-gatherer groups worldwide often benefit from a high level of autonomy',
          paragraphRef: '6',
        },
      ],
    },

    // Passage 3: Questions 36-40 (Yes / No / Not Given)
    {
      id: 'c19-r4-g8',
      passageId: 'c19-r4-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 36–40',
      instructions:
        'Do the following statements agree with the views of the writer in Reading Passage 3?\nIn boxes 36–40 on your answer sheet, write\nYES if the statement agrees with the views of the writer\nNO if the statement contradicts the views of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 36,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c19-r4-q36',
          questionNumber: 36,
          prompt:
            'Some anthropologists are mistaken about the point when the number of societies such as the !Kung began to decline.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 7 states: 'Many anthropologists believe that societies such as the !Kung were normal until a few thousand years ago...', but there is no mention that any anthropologists are mistaken about when they began to decline.",
          evidenceQuote:
            'Many anthropologists believe that societies such as the !Kung were normal until a few thousand years ago',
          paragraphRef: '7',
        },
        {
          id: 'c19-r4-q37',
          questionNumber: 37,
          prompt:
            'Humans who developed warlike traits in prehistory would have had an advantage over those who did not.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 7 contradicts this: '...there seems little reason to assume that traits such as racism, warfare and male domination should have been selected by evolution as they would have been of little benefit in the prehistoric era. Individuals who behaved selfishly and ruthlessly would be less likely to survive...'",
          evidenceQuote:
            'they would have been of little benefit in the prehistoric era. Individuals who behaved selfishly and ruthlessly would be less likely to survive',
          paragraphRef: '7',
        },
        {
          id: 'c19-r4-q38',
          questionNumber: 38,
          prompt: 'Being peaceful and cooperative is a natural way for people to behave.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 8 agrees: 'It makes more sense, then, to see traits such as cooperation, egalitarianism, altruism and peacefulness as innate characteristics of human beings.'",
          evidenceQuote:
            'traits such as cooperation, egalitarianism, altruism and peacefulness as innate characteristics of human beings',
          paragraphRef: '8',
        },
        {
          id: 'c19-r4-q39',
          questionNumber: 39,
          prompt:
            'Negative traits are more apparent in some modern cultures than in others.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 9 explores why modern humans behave selfishly and ruthlessly in general, but does not state or compare whether these traits are more apparent in certain modern cultures compared to others.",
          evidenceQuote:
            'why do modern humans behave so selfishly and ruthlessly? Perhaps these negative traits should be seen as a later development',
          paragraphRef: '9',
        },
        {
          id: 'c19-r4-q40',
          questionNumber: 40,
          prompt:
            'Animal research has failed to reveal a link between changes in the environment and the emergence of aggressive tendencies.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 9 contradicts this: 'Research has shown repeatedly that when the natural habitats of primates such as apes and gorillas are disrupted, they tend to become more violent and hierarchical.' Therefore, animal research has indeed revealed such a link.",
          evidenceQuote:
            'Research has shown repeatedly that when the natural habitats of primates such as apes and gorillas are disrupted, they tend to become more violent and hierarchical.',
          paragraphRef: '9',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 19 Academic Reading Test 4',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge19ReadingTest4(authorId?: string) {
  const data = getCambridge19ReadingTest4Data();

  const validationErrors = validateTestVersion(data.passages, data.questionGroups);

  if (validationErrors.length > 0) {
    throw new Error(
      `Cambridge 19 Reading Test 4 validation failed:\n${validationErrors.join('\n')}`
    );
  }

  const existingTest = await db.prepare(`
    SELECT id FROM reading_tests
    WHERE title = ?
    LIMIT 1
  `).get(data.title) as { id: string } | undefined;

  const now = new Date().toISOString();
  let resolvedAuthorId = authorId;

  if (!resolvedAuthorId) {
    const defaultUser = await db.prepare(`
      SELECT id FROM users ORDER BY created_at ASC LIMIT 1
    `).get() as { id: string } | undefined;

    if (defaultUser) {
      resolvedAuthorId = defaultUser.id;
    } else {
      resolvedAuthorId = uuidv4();
      (await db.prepare(`
        INSERT INTO users (id, email, role, created_at, updated_at)
        VALUES (?, 'system-ingest@ielts.local', 'admin', ?, ?)
      `).run(resolvedAuthorId, now, now));
    }
  }

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = await db.prepare(`
      SELECT id FROM reading_test_versions
      WHERE test_id = ? AND version_number = 1
      LIMIT 1
    `).get(testId) as { id: string } | undefined;

    if (existingVersion) {
      versionId = existingVersion.id;
      (await db.prepare(`
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
      ));
    } else {
      versionId = uuidv4();
      (await db.prepare(`
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
      ));
    }

    (await db.prepare(`
      UPDATE reading_tests
      SET title = ?,
          status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(data.title, now, testId));
  } else {
    testId = uuidv4();
    versionId = uuidv4();

    (await db.prepare(`
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
    ));

    (await db.prepare(`
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
    ));
  }

  return {
    testId,
    versionId,
    status: 'published',
    totalQuestions: 40,
  };
}
