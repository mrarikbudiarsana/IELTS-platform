import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge19ReadingTest3Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c19-r3-p1',
      passageNumber: 1,
      title: 'Archaeologists discover evidence of prehistoric island settlers',
      subtitle:
        'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c19-r3-p1-1',
          label: '1',
          content: `In early April 2019, Dr Ceri Shipton and his colleagues from Australian National University became the first archaeologists to explore Obi, one of many tropical islands in Indonesia's Maluku Utara province. The research team's discoveries suggest that the prehistoric people who lived on Obi were adept on both land and sea, hunting in the dense rainforest, foraging on the seashore, and possibly even voyaging between islands.`,
        },
        {
          id: 'c19-r3-p1-2',
          label: '2',
          content: `The excavations were part of a project to learn more about how people first dispersed from mainland Asia, through the Indonesian archipelago and into the prehistoric continent that once connected Australia and New Guinea. The team's earlier research suggested that the northernmost islands in the group, known as the Wallacean islands, including Obi, would have offered the easiest migration route. It also seemed likely that these islands were crucial 'stepping stones' on humans' island-hopping voyages through this region millennia ago. But to support this idea, they needed archaeological evidence for humans living in this remote area in the ancient past. So, they travelled to Obi to look for sites that might reveal evidence of early occupation.`,
        },
        {
          id: 'c19-r3-p1-3',
          label: '3',
          content: `Just inland from the village of Kelo on Obi's northern coast, Shipton and his colleagues found two caves containing prehistoric rock shelters that were suitable for excavation. With the permission and help of the local people of Kelo, they dug a small test excavation in each shelter. There they found numerous artefacts, including fragments of axes, some dating to about 14,000 years ago. The earliest axes at Kelo were made using clam shells. Axes made from clam shells from roughly the same time had also previously been found elsewhere in this region, including on the nearby island of Gebe to the northeast. As on Gebe, it is highly likely that Obi's axes were used in the construction of canoes, thus allowing these early peoples to maintain connections between communities on neighbouring islands.`,
        },
        {
          id: 'c19-r3-p1-4',
          label: '4',
          content: `The oldest cultural layers from the Kelo site provided the team with the earliest record for human occupation on Obi, dating back around 18,000 years. At this time the climate was drier and colder than today, and the island's dense rainforests would likely have been much less impenetrable than they are now. Sea levels were about 120 metres lower, meaning Obi was a much larger island, encompassing what is today the separate island of Bisa, as well as several other small islands nearby.`,
        },
        {
          id: 'c19-r3-p1-5',
          label: '5',
          content: `Roughly 11,700 years ago, as the most recent ice age ended, the climate became significantly warmer and wetter, no doubt making Obi's jungle much thicker. According to the researchers, it is no coincidence that around this time the first axes crafted from stone rather than sea shells appear, likely in response to their heavy-duty use for clearing and modification of the increasingly dense rainforest. While stone takes about twice as long to grind into an axe compared to shell, the harder material keeps its sharp edge for longer.`,
        },
        {
          id: 'c19-r3-p1-6',
          label: '6',
          content: `Judging by the bones which the researchers unearthed in the Kelo caves, people living there mainly hunted the Rothschild's cuscus, a possum-like creature that still lives on Obi today. As the forest grew more dense, people probably used axes to clear patches of forest and make hunting easier.`,
        },
        {
          id: 'c19-r3-p1-7',
          label: '7',
          content: `Shipton's team's excavation of the shelters at the Kelo site unearthed a volcanic glass substance called obsidian, which must have been brought over from another island, as there is no known source on Obi. It also revealed particular types of beads, similar to those previously found on islands in southern Wallacea. These finds again support the idea that Obi islanders routinely travelled to other islands.`,
        },
        {
          id: 'c19-r3-p1-8',
          label: '8',
          content: `The excavations suggest people successfully lived in the two Kelo shelters for about 10,000 years. But then, about 8,000 years ago, both were abandoned. Did the residents leave Obi completely, or move elsewhere on the island? Perhaps the jungle had grown so thick that axes were no longer a match for the dense undergrowth. Perhaps people simply moved to the coast and turned to fishing rather than hunting as a means of survival.`,
        },
        {
          id: 'c19-r3-p1-9',
          label: '9',
          content: `Whatever the reason for the departure, there is no evidence for use of the Kelo shelters after this time, until about 1,000 years ago, when they were re-occupied by people who owned pottery as well as items made out of gold and silver. It seems likely, in view of Obi's location, that this final phase of occupation also saw the Kelo shelters used by people involved in the historic trade in spices between the Maluku islands and the rest of the world.`,
        },
      ],
    },
    {
      id: 'c19-r3-p2',
      passageNumber: 2,
      title: 'The global importance of wetlands',
      subtitle:
        'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c19-r3-p2-A',
          label: 'A',
          content: `Wetlands are areas where water covers the soil, or is present either at or near the surface of the soil, for all or part of the year. These are complex ecosystems, rich in unique plant and animal life. But according to the World Wide Fund for Nature (WWFN), half of the world's wetlands have disappeared since 1990 - converted or destroyed for commercial development, drainage schemes and the extraction of minerals and peat*. Many of those that remain have been damaged by agricultural pesticides and fertilisers, industrial pollutants, and construction works.

* peat: a brown deposit formed by the partial decomposition of vegetation in wet acidic conditions, often cut out and dried for use as fuel`,
        },
        {
          id: 'c19-r3-p2-B',
          label: 'B',
          content: `Throughout history, humans have gathered around wetlands, and their fertile ecosystems have played an important part in human development. Consequently, they are of considerable religious, historical and archaeological value to many communities around the world. 'Wetlands directly support the livelihoods and well-being of millions of people,' says Dr Matthew McCartney, principal researcher and hydrologist at the International Water Management Institute (IWMI). 'In many developing countries, large numbers of people are dependent on wetland agriculture for their livelihoods.'`,
        },
        {
          id: 'c19-r3-p2-C',
          label: 'C',
          content: `They also serve a crucial environmental purpose. 'Wetlands are one of the key tools in mitigating climate change across the planet,' says Pieter van Eijk, head of Climate Adaptation at Wetlands International (WI), pointing to their use as buffers that protect coastal areas from sea-level rise and extreme weather events such as hurricanes and flooding. Wetland coastal forests provide food and water, as well as shelter from storms, and WI and other agencies are working to restore those forests which have been lost. 'It can be as simple as planting a few trees per hectare to create shade and substantially change a microclimate,' he says. 'Implementing climate change projects isn't so much about money.'`,
        },
        {
          id: 'c19-r3-p2-D',
          label: 'D',
          content: `The world's wetlands are, unfortunately, rich sources for in-demand commodities, such as palm oil and pulpwood. Peatlands - wetlands with a waterlogged organic soil layer - are particularly targeted. When peatlands are drained for cultivation, they become net carbon emitters instead of active carbon stores, and, according to Marcel Silvius, head of Climate-smart Land-use at WI, this practice causes six per cent of all global carbon emissions. The clearance of peatlands for planting also increases the risk of forest fires, which release huge amounts of CO2. 'We're seeing huge peatland forests with extremely high biodiversity value being lost for a few decades of oil palm revenues,' says Silvius.`,
        },
        {
          id: 'c19-r3-p2-E',
          label: 'E',
          content: `The damage starts when logging companies arrive to clear the trees. They dig ditches to enter the peat swamps by boat and then float the logs out the same way. These are then used to drain water out of the peatlands to allow for the planting of corn, oil palms or pulpwood trees. Once the water has drained away, bacteria and fungi then break down the carbon in the peat and turn it into CO2 and methane. Meanwhile, the remainder of the solid matter in the peat starts to move downwards, in a process known as subsidence*. Peat comprises 90 per cent water, so this is one of the most alarming consequences of peatland clearances. 'In the tropics, peat subsides at about four centimetres a year, so within half a century, very large landscapes on Sumatra and Borneo will become flooded as the peat drops below water level,' says Silvius. 'It's a huge catastrophe that's in preparation. Some provinces will lose 40 per cent of their landmass.'

* subsidence: the sinking of the Earth's surface, most often caused by the removal of resources from the ground`,
        },
        {
          id: 'c19-r3-p2-F',
          label: 'F',
          content: `And while these industries affect wetlands in ways that can easily be documented, Dr Dave Tickner of the WWFN believes that more subtle impacts can be even more devastating. 'Sediment run-off and fertilisers can be pretty invisible,' says Tickner. 'Over-extraction of water is equally invisible. You do get shock stories about rivers running red, or even catching fire, but there's seldom one big impact that really hurts a wetland.' Tickner does not blame anyone for deliberate damage, however. 'I've worked on wetland issues for 20 years and have never met anybody who wanted to damage a wetland,' he says. 'It isn't something that people generally set out to do. Quite often, the effects simply come from people trying to make a living.'`,
        },
        {
          id: 'c19-r3-p2-G',
          label: 'G',
          content: `Silvius also acknowledges the importance of income generation. 'It's not that we just want to restore the biodiversity of wetlands - which we do - but we recognise there's a need to provide an income for local people.' This approach is supported by IWMI. 'The idea is that people in a developing country will only protect wetlands if they value and profit from them,' says McCartney. 'For sustainability, it's essential that local people are involved in wetland planning and decision making and have clear rights to use wetlands.'`,
        },
        {
          id: 'c19-r3-p2-H',
          label: 'H',
          content: `The fortunes of wetlands would be improved, Silvius suggests, if more governments recognised their long-term value. 'Different governments have different attitudes,' he says, and goes on to explain that some countries place a high priority on restoring wetlands, while others still deny the issue. McCartney is cautiously optimistic, however. 'Awareness of the importance of wetlands is growing,' he says. 'It's true that wetland degradation still continues at a rapid pace, but my impression is that things are slowly changing.'`,
        },
      ],
    },
    {
      id: 'c19-r3-p3',
      passageNumber: 3,
      title: 'Is the era of artificial speech translation upon us?',
      subtitle:
        'Once the stuff of science fiction, technology that enables people to talk using different languages is now here. But how effective is it?',
      paragraphs: [
        {
          id: 'c19-r3-p3-1',
          label: '1',
          content: `Noise, Alex Waibel tells me, is one of the major challenges that artificial speech translation has to meet. A device may be able to recognise speech in a laboratory, or a meeting room, but will struggle to cope with the kind of background noise I can hear in my office surrounding Professor Waibel as he speaks to me from Kyoto station in Japan. I'm struggling to follow him in English, on a scratchy line that reminds me we are nearly 10,000 kilometres apart - and that distance is still an obstacle to communication even if you're speaking the same language, as we are. We haven't reached the future yet. If we had, Waibel would have been able to speak more comfortably in his native German and I would have been able to hear his words in English.`,
        },
        {
          id: 'c19-r3-p3-2',
          label: '2',
          content: `At Karlsruhe Institute of Technology, where he is a professor of computer science, Waibel and his colleagues already give lectures in German that their students can follow in English via an electronic translator. The system generates text that students can read on their laptops or phones, so the process is somewhat similar to subtitling. It helps that lecturers speak clearly, don't have to compete with background chatter, and say much the same thing each year.`,
        },
        {
          id: 'c19-r3-p3-3',
          label: '3',
          content: `The idea of artificial speech translation has been around for a long time. Douglas Adams' science fiction novel, The Hitchhiker's Guide to the Galaxy, published in 1979, featured a life form called the 'Babel fish' which, when placed in the ear, enabled a listener to understand any language in the universe. It came to represent one of those devices that technology enthusiasts dream of long before they become practically realisable, like TVs flat enough to hang on walls: objects that we once could only dream of having but that are now commonplace. Now devices that look like prototype Babel fish have started to appear, riding a wave of advances in artificial translation and voice recognition.`,
        },
        {
          id: 'c19-r3-p3-4',
          label: '4',
          content: `At this stage, however, they seem to be regarded as eye-catching novelties rather than steps towards what Waibel calls 'making a language-transparent society'. They tend to be domestic devices or applications suitable for hotel check-ins, for example, providing a practical alternative to speaking traveller's English. The efficiency of the translator is less important than the social function. However, 'Professionals are less inclined to be patient in a conversation,' founder and CEO at Waverly Labs, Andrew Ochoa, observes. To redress this, Waverly is now preparing a new model for professional applications, which entails performance improvements in speech recognition, translation accuracy and the time it takes to deliver the translated speech.`,
        },
        {
          id: 'c19-r3-p3-5',
          label: '5',
          content: `For a conversation, both speakers need to have devices called Pilots (translator earpieces) in their ears. 'We find that there's a barrier with sharing one of the earphones with a stranger,' says Ochoa. That can't have been totally unexpected. The problem would be solved if earpiece translators became sufficiently prevalent that strangers would be likely to already have their own in their ears. Whether that happens, and how quickly, will probably depend not so much on the earpieces themselves, but on the prevalence of voice-controlled devices and artificial translation in general.`,
        },
        {
          id: 'c19-r3-p3-6',
          label: '6',
          content: `Waibel highlights the significance of certain Asian nations, noting that voice translation has really taken off in countries such as Japan with a range of systems. There is still a long way to go, though. A translation system needs to be simultaneous, like the translator's voice speaking over the foreign politician being interviewed on the TV, rather than in sections that oblige speakers to pause after every few remarks and wait for the translation to be delivered. It needs to work offline, for situations where internet access isn't possible, and to address apprehensions about the amount of private speech data accumulating in the cloud, having been sent to servers for processing.`,
        },
        {
          id: 'c19-r3-p3-7',
          label: '7',
          content: `Systems not only need to cope with physical challenges such as noise, they will also need to be socially aware by addressing people in the right way. Some cultural traditions demand solemn respect for academic status, for example, and it is only polite to respect this. Etiquette-sensitive artificial translators could relieve people of the need to know these differing cultural norms. At the same time, they might help to preserve local customs, slowing the spread of habits associated with international English, such as its readiness to get on first-name terms.`,
        },
        {
          id: 'c19-r3-p3-8',
          label: '8',
          content: `Professors and other professionals will not outsource language awareness to software, though. If the technology matures into seamless, ubiquitous artificial speech translation, it will actually add value to language skills. Whether it will help people conduct their family lives or relationships is open to question - though one noteworthy possibility is that it could overcome the language barriers that often arise between generations after migration, leaving children and their grandparents without a shared language.`,
        },
        {
          id: 'c19-r3-p3-9',
          label: '9',
          content: `Whatever uses it is put to, though, it will never be as good as the real thing. Even if voice-morphing technology simulates the speaker's voice, their lip movements won't match, and they will look like they are in a dubbed movie. The contrast will underline the value of shared languages, and the value of learning them. Sharing a language can promote a sense of belonging and community, as with the international scientists who use English as a lingua franca, where their predecessors used Latin. Though the practical need for a common language will diminish, the social value of sharing one will persist. And software will never be a substitute for the subtle but vital understanding that comes with knowledge of a language.`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // Passage 1: Questions 1-7 (True / False / Not Given)
    {
      id: 'c19-r3-g1',
      passageId: 'c19-r3-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–7',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–7 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 1,
      endQuestionNumber: 7,
      questions: [
        {
          id: 'c19-r3-q1',
          questionNumber: 1,
          prompt:
            'Archaeological research had taken place on the island of Obi before the arrival of Ceri Shipton and his colleagues.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 1 states: 'In early April 2019, Dr Ceri Shipton and his colleagues from Australian National University became the first archaeologists to explore Obi...'",
          evidenceQuote: 'became the first archaeologists to explore Obi',
          paragraphRef: '1',
        },
        {
          id: 'c19-r3-q2',
          questionNumber: 2,
          prompt:
            'At the Kelo sites, the researchers found the first clam shell axes ever to be discovered in the region.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 3 states: 'Axes made from clam shells from roughly the same time had also previously been found elsewhere in this region, including on the nearby island of Gebe to the northeast.'",
          evidenceQuote:
            'Axes made from clam shells from roughly the same time had also previously been found elsewhere in this region',
          paragraphRef: '3',
        },
        {
          id: 'c19-r3-q3',
          questionNumber: 3,
          prompt: 'The size of Obi today is less than it was 18,000 years ago.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 4 states: 'Sea levels were about 120 metres lower, meaning Obi was a much larger island, encompassing what is today the separate island of Bisa, as well as several other small islands nearby.'",
          evidenceQuote:
            'meaning Obi was a much larger island, encompassing what is today the separate island of Bisa',
          paragraphRef: '4',
        },
        {
          id: 'c19-r3-q4',
          questionNumber: 4,
          prompt:
            'A change in the climate around 11,700 years ago had a greater impact on Obi than on the surrounding islands.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 5 mentions that roughly 11,700 years ago the climate became significantly warmer and wetter, making Obi's jungle thicker, but makes no comparison with surrounding islands.",
          evidenceQuote:
            "Roughly 11,700 years ago, as the most recent ice age ended, the climate became significantly warmer and wetter, no doubt making Obi's jungle much thicker.",
          paragraphRef: '5',
        },
        {
          id: 'c19-r3-q5',
          questionNumber: 5,
          prompt:
            'The researchers believe there is a connection between warmer, wetter weather and a change in the material used to make axes.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 5 states: 'According to the researchers, it is no coincidence that around this time the first axes crafted from stone rather than sea shells appear, likely in response to their heavy-duty use for clearing and modification of the increasingly dense rainforest.'",
          evidenceQuote:
            'it is no coincidence that around this time the first axes crafted from stone rather than sea shells appear',
          paragraphRef: '5',
        },
        {
          id: 'c19-r3-q6',
          questionNumber: 6,
          prompt:
            "Shipton's team were surprised to find evidence of the Obi islanders' hunting practices.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 6 describes how bones unearthed showed the islanders mainly hunted the Rothschild's cuscus, but does not mention whether the team was surprised.",
          evidenceQuote:
            "Judging by the bones which the researchers unearthed in the Kelo caves, people living there mainly hunted the Rothschild's cuscus",
          paragraphRef: '6',
        },
        {
          id: 'c19-r3-q7',
          questionNumber: 7,
          prompt:
            'It is thought that the Kelo shelters were occupied continuously until about 1,000 years ago.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraphs 8 and 9 explain that about 8,000 years ago both shelters were abandoned, and there was no evidence for their use after this time until about 1,000 years ago when they were re-occupied.",
          evidenceQuote:
            'there is no evidence for use of the Kelo shelters after this time, until about 1,000 years ago, when they were re-occupied',
          paragraphRef: '8, 9',
        },
      ],
    },

    // Passage 1: Questions 8-13 (Note Completion)
    {
      id: 'c19-r3-g2',
      passageId: 'c19-r3-p1',
      questionType: 'note_completion',
      title: 'Archaeological findings on Obi',
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 8–13 on your answer sheet.',
      startQuestionNumber: 8,
      endQuestionNumber: 13,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      contentWithGaps: `Archaeological findings on Obi

Excavations of rock shelters inside [[8]] near the village of Kelo revealed:
• axes from around 14,000 years ago, probably used to make canoes
• axes made out of [[9]] dating from around 11,700 years ago
• [[10]] of an animal: evidence of what ancient islanders ate
• evidence of travel between islands:
  - obsidian: a material that is not found naturally on Obi
  - [[11]] which resembled ones found on other islands.

It is thought that from 8,000 years ago, Obi islanders:
• may have switched from hunting to fishing
• had [[12]] as well as items made out of metal
• probably took part in the production and sale of [[13]]`,
      questions: [
        {
          id: 'c19-r3-q8',
          questionNumber: 8,
          prompt:
            'Excavations of rock shelters inside [8] near the village of Kelo revealed:',
          answerKey: 'caves',
          acceptedAlternatives: ['caves', 'cave'],
          explanation:
            "Paragraph 3 states: '...found two caves containing prehistoric rock shelters that were suitable for excavation.'",
          evidenceQuote: 'found two caves containing prehistoric rock shelters',
          paragraphRef: '3',
        },
        {
          id: 'c19-r3-q9',
          questionNumber: 9,
          prompt: 'axes made out of [9] dating from around 11,700 years ago',
          answerKey: 'stone',
          acceptedAlternatives: ['stone'],
          explanation:
            "Paragraph 5 states: 'Roughly 11,700 years ago... the first axes crafted from stone rather than sea shells appear...'",
          evidenceQuote:
            'the first axes crafted from stone rather than sea shells appear',
          paragraphRef: '5',
        },
        {
          id: 'c19-r3-q10',
          questionNumber: 10,
          prompt: '[10] of an animal: evidence of what ancient islanders ate',
          answerKey: 'bones',
          acceptedAlternatives: ['bones', 'bone'],
          explanation:
            "Paragraph 6 states: 'Judging by the bones which the researchers unearthed in the Kelo caves, people living there mainly hunted the Rothschild's cuscus...'",
          evidenceQuote:
            "Judging by the bones which the researchers unearthed in the Kelo caves, people living there mainly hunted the Rothschild's cuscus",
          paragraphRef: '6',
        },
        {
          id: 'c19-r3-q11',
          questionNumber: 11,
          prompt: '[11] which resembled ones found on other islands.',
          answerKey: 'beads',
          acceptedAlternatives: ['beads', 'bead'],
          explanation:
            "Paragraph 7 states: 'It also revealed particular types of beads, similar to those previously found on islands in southern Wallacea.'",
          evidenceQuote:
            'particular types of beads, similar to those previously found on islands in southern Wallacea',
          paragraphRef: '7',
        },
        {
          id: 'c19-r3-q12',
          questionNumber: 12,
          prompt: 'had [12] as well as items made out of metal',
          answerKey: 'pottery',
          acceptedAlternatives: ['pottery'],
          explanation:
            "Paragraph 9 states: '...until about 1,000 years ago, when they were re-occupied by people who owned pottery as well as items made out of gold and silver.'",
          evidenceQuote:
            're-occupied by people who owned pottery as well as items made out of gold and silver',
          paragraphRef: '9',
        },
        {
          id: 'c19-r3-q13',
          questionNumber: 13,
          prompt: 'probably took part in the production and sale of [13]',
          answerKey: 'spices',
          acceptedAlternatives: ['spices', 'spice'],
          explanation:
            "Paragraph 9 states: '...this final phase of occupation also saw the Kelo shelters used by people involved in the historic trade in spices between the Maluku islands and the rest of the world.'",
          evidenceQuote:
            'involved in the historic trade in spices between the Maluku islands and the rest of the world',
          paragraphRef: '9',
        },
      ],
    },

    // Passage 2: Questions 14-17 (Matching Information)
    {
      id: 'c19-r3-g3',
      passageId: 'c19-r3-p2',
      questionType: 'matching_information',
      title: 'Questions 14–17',
      instructions:
        'Reading Passage 2 has eight paragraphs, A–H.\nWhich paragraph contains the following information?\nWrite the correct letter, A–H, in boxes 14–17 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 17,
      optionsList: [
        { key: 'A', text: 'Paragraph A' },
        { key: 'B', text: 'Paragraph B' },
        { key: 'C', text: 'Paragraph C' },
        { key: 'D', text: 'Paragraph D' },
        { key: 'E', text: 'Paragraph E' },
        { key: 'F', text: 'Paragraph F' },
        { key: 'G', text: 'Paragraph G' },
        { key: 'H', text: 'Paragraph H' },
      ],
      questions: [
        {
          id: 'c19-r3-q14',
          questionNumber: 14,
          prompt:
            'reference to the need to ensure that inhabitants of wetland regions continue to benefit from them',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            "Paragraph G states: '“It's not that we just want to restore the biodiversity of wetlands - which we do - but we recognise there's a need to provide an income for local people.” ... “The idea is that people in a developing country will only protect wetlands if they value and profit from them,” says McCartney.'",
          evidenceQuote:
            "we recognise there's a need to provide an income for local people... people in a developing country will only protect wetlands if they value and profit from them",
          paragraphRef: 'G',
        },
        {
          id: 'c19-r3-q15',
          questionNumber: 15,
          prompt: 'the proportion of wetlands which have already been lost',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph A states: 'But according to the World Wide Fund for Nature (WWFN), half of the world's wetlands have disappeared since 1990...'",
          evidenceQuote: 'half of the world\'s wetlands have disappeared since 1990',
          paragraphRef: 'A',
        },
        {
          id: 'c19-r3-q16',
          questionNumber: 16,
          prompt:
            'reference to the idea that people are beginning to appreciate the value of wetlands',
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Paragraph H states: '“Awareness of the importance of wetlands is growing,” he says. “It's true that wetland degradation still continues at a rapid pace, but my impression is that things are slowly changing.”'",
          evidenceQuote: 'Awareness of the importance of wetlands is growing',
          paragraphRef: 'H',
        },
        {
          id: 'c19-r3-q17',
          questionNumber: 17,
          prompt: 'mention of the cultural significance of wetlands',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph B states: 'Consequently, they are of considerable religious, historical and archaeological value to many communities around the world.'",
          evidenceQuote:
            'they are of considerable religious, historical and archaeological value to many communities around the world',
          paragraphRef: 'B',
        },
      ],
    },

    // Passage 2: Questions 18-22 (Sentence Completion)
    {
      id: 'c19-r3-g4',
      passageId: 'c19-r3-p2',
      questionType: 'sentence_completion',
      title: 'Questions 18–22',
      instructions:
        'Complete the sentences below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 18–22 on your answer sheet.',
      startQuestionNumber: 18,
      endQuestionNumber: 22,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      questions: [
        {
          id: 'c19-r3-q18',
          questionNumber: 18,
          prompt:
            'Peatlands which have been drained begin to release [18] instead of storing it.',
          answerKey: 'carbon',
          acceptedAlternatives: ['carbon'],
          explanation:
            "Paragraph D states: 'When peatlands are drained for cultivation, they become net carbon emitters instead of active carbon stores...'",
          evidenceQuote:
            'they become net carbon emitters instead of active carbon stores',
          paragraphRef: 'D',
        },
        {
          id: 'c19-r3-q19',
          questionNumber: 19,
          prompt: 'Once peatland areas have been cleared, [19] are more likely to occur.',
          answerKey: 'fires',
          acceptedAlternatives: ['fires', 'fire'],
          explanation:
            "Paragraph D states: 'The clearance of peatlands for planting also increases the risk of forest fires, which release huge amounts of CO2.'",
          evidenceQuote:
            'The clearance of peatlands for planting also increases the risk of forest fires',
          paragraphRef: 'D',
        },
        {
          id: 'c19-r3-q20',
          questionNumber: 20,
          prompt:
            'Clearing peatland forests to make way for oil palm plantations destroys the [20] of the local environment.',
          answerKey: 'biodiversity',
          acceptedAlternatives: ['biodiversity'],
          explanation:
            "Paragraph D states: 'We're seeing huge peatland forests with extremely high biodiversity value being lost for a few decades of oil palm revenues...'",
          evidenceQuote:
            'huge peatland forests with extremely high biodiversity value being lost for a few decades of oil palm revenues',
          paragraphRef: 'D',
        },
        {
          id: 'c19-r3-q21',
          questionNumber: 21,
          prompt:
            'Water is drained out of peatlands through the [21] which are created by logging companies.',
          answerKey: 'ditches',
          acceptedAlternatives: ['ditches', 'ditch'],
          explanation:
            "Paragraph E states: 'They dig ditches to enter the peat swamps by boat and then float the logs out the same way. These are then used to drain water out of the peatlands...'",
          evidenceQuote:
            'They dig ditches to enter the peat swamps by boat... These are then used to drain water out of the peatlands',
          paragraphRef: 'E',
        },
        {
          id: 'c19-r3-q22',
          questionNumber: 22,
          prompt:
            'Draining peatlands leads to [22] : a serious problem which can eventually result in coastal flooding and land loss.',
          answerKey: 'subsidence',
          acceptedAlternatives: ['subsidence'],
          explanation:
            "Paragraph E states: 'Meanwhile, the remainder of the solid matter in the peat starts to move downwards, in a process known as subsidence*... peat subsides at about four centimetres a year, so within half a century, very large landscapes on Sumatra and Borneo will become flooded...'",
          evidenceQuote:
            'in a process known as subsidence*... very large landscapes on Sumatra and Borneo will become flooded as the peat drops below water level',
          paragraphRef: 'E',
        },
      ],
    },

    // Passage 2: Questions 23-26 (Matching Features)
    {
      id: 'c19-r3-g5',
      passageId: 'c19-r3-p2',
      questionType: 'matching_features',
      title: 'Questions 23–26',
      instructions:
        'Look at the following statements (Questions 23–26) and the list of experts below.\nMatch each statement with the correct expert, A–D.\nWrite the correct letter, A–D, in boxes 23–26 on your answer sheet.',
      startQuestionNumber: 23,
      endQuestionNumber: 26,
      optionReuseAllowed: true,
      optionsList: [
        { key: 'A', text: 'Matthew McCartney' },
        { key: 'B', text: 'Pieter van Eijk' },
        { key: 'C', text: 'Marcel Silvius' },
        { key: 'D', text: 'Dave Tickner' },
      ],
      questions: [
        {
          id: 'c19-r3-q23',
          questionNumber: 23,
          prompt:
            'Communities living in wetland regions must be included in discussions about the future of these areas.',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph G states: '“For sustainability, it's essential that local people are involved in wetland planning and decision making and have clear rights to use wetlands,” says McCartney.'",
          evidenceQuote:
            'it\'s essential that local people are involved in wetland planning and decision making and have clear rights to use wetlands',
          paragraphRef: 'G',
        },
        {
          id: 'c19-r3-q24',
          questionNumber: 24,
          prompt: 'Official policies towards wetlands vary from one nation to the next.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph H states: '“Different governments have different attitudes,” he [Silvius] says, and goes on to explain that some countries place a high priority on restoring wetlands, while others still deny the issue.'",
          evidenceQuote:
            'Different governments have different attitudes,\' he says, and goes on to explain that some countries place a high priority on restoring wetlands, while others still deny the issue.',
          paragraphRef: 'H',
        },
        {
          id: 'c19-r3-q25',
          questionNumber: 25,
          prompt:
            'People cause harm to wetlands without having any intention to do so.',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph F states: '“I've worked on wetland issues for 20 years and have never met anybody who wanted to damage a wetland,” he [Tickner] says. “It isn't something that people generally set out to do. Quite often, the effects simply come from people trying to make a living.”'",
          evidenceQuote:
            'never met anybody who wanted to damage a wetland... It isn\'t something that people generally set out to do.',
          paragraphRef: 'F',
        },
        {
          id: 'c19-r3-q26',
          questionNumber: 26,
          prompt: 'Initiatives to reverse environmental damage need not be complex.',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph C states: '“It can be as simple as planting a few trees per hectare to create shade and substantially change a microclimate,” he [Pieter van Eijk] says. “Implementing climate change projects isn't so much about money.”'",
          evidenceQuote:
            'It can be as simple as planting a few trees per hectare to create shade and substantially change a microclimate',
          paragraphRef: 'C',
        },
      ],
    },

    // Passage 3: Questions 27-30 (Multiple Choice Single)
    {
      id: 'c19-r3-g6',
      passageId: 'c19-r3-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–30',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–30 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c19-r3-q27',
          questionNumber: 27,
          prompt:
            'What does the reader learn about the conversation in the first paragraph?',
          options: [
            { key: 'A', text: 'The speakers are communicating in different languages.' },
            { key: 'B', text: 'Neither of the speakers is familiar with their environment.' },
            { key: 'C', text: 'The topic of the conversation is difficult for both speakers.' },
            { key: 'D', text: 'Aspects of the conversation are challenging for both speakers.' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 1 states: 'I'm struggling to follow him in English, on a scratchy line that reminds me we are nearly 10,000 kilometres apart - and that distance is still an obstacle to communication even if you're speaking the same language, as we are.' This shows that aspects of the conversation (noise, line quality, distance) are challenging for both speakers.",
          evidenceQuote:
            'I\'m struggling to follow him in English, on a scratchy line that reminds me we are nearly 10,000 kilometres apart - and that distance is still an obstacle to communication',
          paragraphRef: '1',
        },
        {
          id: 'c19-r3-q28',
          questionNumber: 28,
          prompt:
            'What assists the electronic translator during lectures at Karlsruhe Institute of Technology?',
          options: [
            { key: 'A', text: 'the repeated content of lectures' },
            { key: 'B', text: "the students' reading skills" },
            { key: 'C', text: 'the languages used' },
            { key: 'D', text: "the lecturers' technical ability" },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 2 states: 'It helps that lecturers speak clearly, don't have to compete with background chatter, and say much the same thing each year.' 'Say much the same thing each year' refers to the repeated content of lectures.",
          evidenceQuote:
            'It helps that lecturers speak clearly, don\'t have to compete with background chatter, and say much the same thing each year.',
          paragraphRef: '2',
        },
        {
          id: 'c19-r3-q29',
          questionNumber: 29,
          prompt:
            "When referring to The Hitchhiker's Guide to the Galaxy, the writer suggests that",
          options: [
            { key: 'A', text: 'the Babel fish was considered undesirable at the time.' },
            { key: 'B', text: 'this book was not seriously intending to predict the future.' },
            { key: 'C', text: 'artificial speech translation was not a surprising development.' },
            { key: 'D', text: 'some speech translation techniques are better than others.' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 3 explains that artificial speech translation has been anticipated since science fiction depicted devices like the 'Babel fish' in 1979, representing things enthusiasts dreamt of long before they became realisable (like flat-screen TVs), so its emergence was not a surprising development.",
          evidenceQuote:
            'It came to represent one of those devices that technology enthusiasts dream of long before they become practically realisable, like TVs flat enough to hang on walls: objects that we once could only dream of having but that are now commonplace.',
          paragraphRef: '3',
        },
        {
          id: 'c19-r3-q30',
          questionNumber: 30,
          prompt: 'What does the writer say about sharing earpieces?',
          options: [
            { key: 'A', text: 'It is something people will get used to doing.' },
            { key: 'B', text: 'The reluctance to do this is understandable.' },
            { key: 'C', text: 'The equipment will be unnecessary in the future.' },
            { key: 'D', text: 'It is something few people need to worry about.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 5 states: '“We find that there's a barrier with sharing one of the earphones with a stranger,” says Ochoa. That can't have been totally unexpected.' 'That can't have been totally unexpected' indicates that people's reluctance to share earpieces is understandable.",
          evidenceQuote:
            '“We find that there\'s a barrier with sharing one of the earphones with a stranger,” says Ochoa. That can\'t have been totally unexpected.',
          paragraphRef: '5',
        },
      ],
    },

    // Passage 3: Questions 31-34 (Matching Sentence Endings)
    {
      id: 'c19-r3-g7',
      passageId: 'c19-r3-p3',
      questionType: 'matching_sentence_endings',
      title: 'Questions 31–34',
      instructions:
        'Complete each sentence with the correct ending, A–F, below.\nWrite the correct letter, A–F, in boxes 31–34 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 34,
      optionsList: [
        { key: 'A', text: 'but there are concerns about this.' },
        { key: 'B', text: 'as systems do not need to conform to standard practices.' },
        { key: 'C', text: 'but they are far from perfect.' },
        { key: 'D', text: 'despite the noise issues.' },
        { key: 'E', text: 'because translation is immediate.' },
        { key: 'F', text: 'and have an awareness of good manners.' },
      ],
      questions: [
        {
          id: 'c19-r3-q31',
          questionNumber: 31,
          prompt: 'Speech translation methods are developing fast in Japan',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 6 states: '...noting that voice translation has really taken off in countries such as Japan with a range of systems. There is still a long way to go, though.' 'There is still a long way to go' corresponds to 'but they are far from perfect' (C).",
          evidenceQuote:
            'voice translation has really taken off in countries such as Japan with a range of systems. There is still a long way to go, though.',
          paragraphRef: '6',
        },
        {
          id: 'c19-r3-q32',
          questionNumber: 32,
          prompt:
            'TV interviews that use translation voiceover methods are successful',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph 6 states: 'A translation system needs to be simultaneous, like the translator's voice speaking over the foreign politician being interviewed on the TV, rather than in sections that oblige speakers to pause after every few remarks and wait for the translation to be delivered.' This matches 'because translation is immediate' (E).",
          evidenceQuote:
            'needs to be simultaneous, like the translator\'s voice speaking over the foreign politician being interviewed on the TV, rather than in sections that oblige speakers to pause',
          paragraphRef: '6',
        },
        {
          id: 'c19-r3-q33',
          questionNumber: 33,
          prompt:
            'Future translation systems should address people appropriately',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph 7 states: 'Systems not only need to cope with physical challenges such as noise, they will also need to be socially aware by addressing people in the right way... Etiquette-sensitive artificial translators could relieve people of the need to know these differing cultural norms.' This matches 'and have an awareness of good manners' (F).",
          evidenceQuote:
            'socially aware by addressing people in the right way... Etiquette-sensitive artificial translators',
          paragraphRef: '7',
        },
        {
          id: 'c19-r3-q34',
          questionNumber: 34,
          prompt: 'Users may be able to maintain their local customs',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 7 states: 'At the same time, they might help to preserve local customs, slowing the spread of habits associated with international English, such as its readiness to get on first-name terms.' This matches 'as systems do not need to conform to standard practices' (B).",
          evidenceQuote:
            'might help to preserve local customs, slowing the spread of habits associated with international English, such as its readiness to get on first-name terms.',
          paragraphRef: '7',
        },
      ],
    },

    // Passage 3: Questions 35-40 (Yes / No / Not Given)
    {
      id: 'c19-r3-g8',
      passageId: 'c19-r3-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 35–40',
      instructions:
        'Do the following statements agree with the views of the writer in Reading Passage 3?\nIn boxes 35–40 on your answer sheet, write\nYES if the statement agrees with the views of the writer\nNO if the statement contradicts the views of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 35,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c19-r3-q35',
          questionNumber: 35,
          prompt:
            'Language translation systems will be seen as very useful throughout the academic and professional worlds.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 8 states: 'Professors and other professionals will not outsource language awareness to software, though. If the technology matures into seamless, ubiquitous artificial speech translation, it will actually add value to language skills.'",
          evidenceQuote:
            'Professors and other professionals will not outsource language awareness to software, though.',
          paragraphRef: '8',
        },
        {
          id: 'c19-r3-q36',
          questionNumber: 36,
          prompt:
            'The overall value of automated translation to family life is yet to be shown.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 8 states: 'Whether it will help people conduct their family lives or relationships is open to question...'",
          evidenceQuote:
            'Whether it will help people conduct their family lives or relationships is open to question',
          paragraphRef: '8',
        },
        {
          id: 'c19-r3-q37',
          questionNumber: 37,
          prompt:
            'Automated translation could make life more difficult for immigrant families.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 8 states: '...though one noteworthy possibility is that it could overcome the language barriers that often arise between generations after migration, leaving children and their grandparents without a shared language.' Rather than making life more difficult, it can overcome barriers.",
          evidenceQuote:
            'one noteworthy possibility is that it could overcome the language barriers that often arise between generations after migration',
          paragraphRef: '8',
        },
        {
          id: 'c19-r3-q38',
          questionNumber: 38,
          prompt:
            'Visual aspects of language translation are being considered by scientists.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 9 notes that even if voice-morphing simulates the speaker's voice, lip movements won't match, making them look like they are in a dubbed movie; but it does not state whether scientists are actively considering this visual aspect.",
          evidenceQuote:
            'Even if voice-morphing technology simulates the speaker\'s voice, their lip movements won\'t match, and they will look like they are in a dubbed movie.',
          paragraphRef: '9',
        },
        {
          id: 'c19-r3-q39',
          questionNumber: 39,
          prompt:
            'International scientists have found English easier to translate into other languages than Latin.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 9 mentions that international scientists use English as a lingua franca where predecessors used Latin, but makes no mention of ease of translation.",
          evidenceQuote:
            'international scientists who use English as a lingua franca, where their predecessors used Latin.',
          paragraphRef: '9',
        },
        {
          id: 'c19-r3-q40',
          questionNumber: 40,
          prompt:
            "As far as language is concerned, there is a difference between people's social and practical needs.",
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 9 states: 'Though the practical need for a common language will diminish, the social value of sharing one will persist.' This directly agrees that there is a distinction between practical and social needs.",
          evidenceQuote:
            'Though the practical need for a common language will diminish, the social value of sharing one will persist.',
          paragraphRef: '9',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 19 Academic Reading Test 3',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge19ReadingTest3(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: string;
  totalQuestions: number;
}> {
  const data = getCambridge19ReadingTest3Data();

  // Validate data structure and question counts
  const validationErrors = validateTestVersion(data.passages, data.questionGroups);
  if (validationErrors.length > 0) {
    throw new Error(
      `Validation failed for Cambridge 19 Reading Test 3: ${JSON.stringify(validationErrors)}`
    );
  }

  const resolvedAuthorId =
    authorId ||
    ((await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get()) as any)?.id ||
    'f8b2e30a-ae78-435a-b9d3-a22f34452016';

  const existingTest = (await db
    .prepare(
      `SELECT id FROM reading_tests WHERE title LIKE '%Cambridge%19%Academic%Reading%Test 3%' OR title = ? LIMIT 1`
    )
    .get(data.title)) as any;

  const now = new Date().toISOString();
  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db
      .prepare(
        `SELECT id FROM reading_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1`
      )
      .get(testId)) as any;

    if (existingVersion) {
      versionId = existingVersion.id;
      (await db.prepare(`
        UPDATE reading_test_versions
        SET passages_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            status = 'published',
            updated_at = ?
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
