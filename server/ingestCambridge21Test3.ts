import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup, ReadingTest } from '../shared/types';
import { validateTestVersion, getTestById, getVersionById } from './readingService';

export function getCambridge21Test3Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c21-t3-p1',
      passageNumber: 1,
      title: 'Saving the saiga',
      subtitle: 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c21-t3-p1-1',
          label: '1',
          content: `The saiga, a species of antelope native to Central Asia, once roamed the vast grasslands of this region in enormous herds, many millions strong. Regrettably, such spectacular sights are a thing of the past. Today, the saiga is largely confined to a single country: Kazakhstan. This country is estimated to be home to well over 90% of the global saiga population, with Russia, Mongolia and Uzbekistan accounting for the rest.`,
        },
        {
          id: 'c21-t3-p1-2',
          label: '2',
          content: `The saiga is perfectly adapted to the tough conditions of the remote wilderness of the steppes of Central Asia. One such adaptation is its bizarre bulbous nose, which enables the animal to survive the extreme seasonal temperature swings of the region. The swollen nostrils of the nose serve several purposes: they filter out dust and cool the blood during hot, dry summers, and they warm the cold air before it enters the saiga's lungs in winter. Other seasonal adaptations include a heavy winter coat that the saiga sheds when the weather warms up.`,
        },
        {
          id: 'c21-t3-p1-3',
          label: '3',
          content: `Despite these superb adaptations to harsh conditions, the saiga has no defence against the threats posed by humans. It was almost driven to extinction by hunters in the 19th century. Legal protection ensured its survival for a while, and numbers steadily recovered throughout most of the 20th century. But the respite was only temporary. In the ten years following the break-up of the former Soviet Union in 1991, over 95% of the global population was lost - one of the fastest examples of species loss ever recorded for a mammal.`,
        },
        {
          id: 'c21-t3-p1-4',
          label: '4',
          content: `The dramatic decline during this decade was due to illegal poaching on an industrial scale. Male saiga are a particular target, because their horns are highly prized by traditional medicine practitioners. Poaching reached epidemic levels after misguided conservationists tried to relieve the pressure on threatened African rhinos by actively encouraging the use of saiga horns in traditional medicine as an alternative to those of rhinos. Male saiga were almost wiped out, leading to a population crash from which the species has been struggling to recover ever since.`,
        },
        {
          id: 'c21-t3-p1-5',
          label: '5',
          content: `Another threat to the survival of the saiga is loss of habitat, as a result of agricultural expansion and human settlement. Physical barriers such as railways, pipelines and fences can block the seasonal migration routes of this transboundary species. In the worst cases, herds may starve to death after being trapped.`,
        },
        {
          id: 'c21-t3-p1-6',
          label: '6',
          content: `Then there is the risk of disease. In 2015, an outbreak of haemorrhagic septicaemia, caused by the normally harmless bacterium Pasteurella multocida, killed over 75% of the global adult saiga population in just three weeks. In 2017, 60% of the Mongolian saiga population - a subspecies found nowhere else in the world - was killed by a virus that spilled over from livestock. These so-called mass mortality events represent an unpredictable and serious threat to the species.`,
        },
        {
          id: 'c21-t3-p1-7',
          label: '7',
          content: `Climate change poses a further threat. Although well adapted to cold winters and hot summers, saiga struggle to cope with temperature extremes and unpredictable fluctuations in climate. Experts believe that unusually warm weather may have triggered the 2015 mass mortality event. The steppe region has also become increasingly arid in recent years, and many of the smaller streams that the species normally depended on have dried up and vanished.`,
        },
        {
          id: 'c21-t3-p1-8',
          label: '8',
          content: `Recent efforts to save the saiga have been spearheaded by the Altyn Dala Conservation Initiative, a project led by the Association for the Conservation of Biodiversity of Kazakhstan, working in partnership with the Kazakh government's Committee for Forestry and Wildlife, Frankfurt Zoological Society and Fauna and Flora, an international conservation charity. Its purpose is to protect and restore Kazakhstan's steppe, semi-desert and desert ecosystems and the many species they support, including the critically endangered saiga. In 2022 the United Nations recognised the initiative as a World Restoration Flagship project, an accolade reserved for the ten best examples of large-scale ecosystem restoration around the globe.`,
        },
        {
          id: 'c21-t3-p1-9',
          label: '9',
          content: `So, how many saiga are there now? By 2000, the global saiga population had hit an all-time low of just 21,000 individuals. There was some recovery in the first decade of the new millennium but this was then crushed by devastating mass mortality events that saw the loss of hundreds of thousands of the species. But thanks to the intervention of the Altyn Dala Conservation Initiative, the most recent episodes in the ongoing story of the saiga have been relatively uplifting. Three years ago, the Ustyurt Plateau population in Kazakhstan experienced its largest mass birth of saiga calves in many years. An aerial census two years ago recorded an estimated 842,000 saiga across Kazakhstan as a whole, and according to an aerial survey earlier this year, the saiga population in Kazakhstan now exceeds 1.9 million. The world's strangest-looking antelope remains critically endangered, but the direction of travel is positive.`,
        },
      ],
    },
    {
      id: 'c21-t3-p2',
      passageNumber: 2,
      title: 'The problems of getting around the city of Dar es Salaam',
      subtitle: 'You should spend about 20 minutes on Questions 14-26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c21-t3-p2-1',
          label: '1',
          content: `Dar es Salaam in Tanzania is one of the fastest growing cities in Africa. Its population has increased eightfold since 1980 and swells by half a million people every year. United Nations projections anticipate it will become a megacity within seven years as its population passes 10 million, reaching 13.4 million by 2035. Daniel Hoornweg for the Global Cities Institute forecasts the city could be home to an incredible 73.7 million people by 2100.`,
        },
        {
          id: 'c21-t3-p2-2',
          label: '2',
          content: `Today, four out of five of its people live in single-storey informal settlements on the spreading edges of the city, where the journey to and from the centre regularly takes over two hours. It can be longer if rain turns the dirt roads to mud.`,
        },
        {
          id: 'c21-t3-p2-3',
          label: '3',
          content: `Even in the middle of the day, traffic frequently slows to a stop without warning. It is not unusual for cars and minibuses to queue for 20 minutes at a key intersection. A single suburban rail line serves residents in a few areas to the south but is tiny in the context of the wider city. Outside the centre many rely on boda boda (motorbike taxis) to navigate the narrow side streets and potholed mud roads that make up much of the metropolis. Their safety record is scandalous.`,
        },
        {
          id: 'c21-t3-p2-4',
          label: '4',
          content: `Dar es Salaam's reliance on four arterial roads into the city is a legacy of the colonial government that planned the city at the start of the 20th century to cater for a population of 35,000. Most of the current growth is made up of young people arriving from the countryside to find work, and as the population has exploded, Dar es Salaam has grown around those four highways. Nearly all the expansion is happening on the periphery, and nearly all takes place informally without any agreed strategy.`,
        },
        {
          id: 'c21-t3-p2-5',
          label: '5',
          content: `But Dar es Salaam is pinning its hopes on a solution that could offer a different model for Africa's megacities, giving them an alternative to a future controlled by the private car. Unlike many cities on the continent, Dar es Salaam isn't trying to build a metro. It has chosen a less exciting but cheaper and more achievable method: the bus.`,
        },
        {
          id: 'c21-t3-p2-6',
          label: '6',
          content: `The DART bus rapid transit (BRT) system runs on bus lanes separated from other traffic, mostly in the middle of the road to reduce stoppages. Ticket purchase and control takes place at stations prior to boarding and the buses are step-free, which means the entire route is accessible to people using wheelchairs or who are travelling with baby buggies.`,
        },
        {
          id: 'c21-t3-p2-7',
          label: '7',
          content: `'The new buses are much, much better,' says Paulas George, a young IT worker. He takes the bus every day and it has cut his journey time by two-thirds. He says it is not perfect, though, complaining that drivers often refuse to turn on the air conditioning to save fuel.`,
        },
        {
          id: 'c21-t3-p2-8',
          label: '8',
          content: `That is not the only problem. A shortage of buses after a serious flood at the main depot during the rainy season means the system is carrying 200,000 people a day - half the expected capacity. Smartcards can't be used as the mechanical readers aren't working either, forcing passengers to buy individual paper tickets for every journey. Each is printed with a scannable QR code, but there are no scanners. Staff stand by the gates and tear tickets as people enter. As a result, queues are considerable at peak times.`,
        },
        {
          id: 'c21-t3-p2-9',
          label: '9',
          content: `Morogoro Road to the north-west of the city was phase I of the BRT project. Phases II and III will install bus lanes along Nyerere Road to the south-west and Kilwa Road to the south. Construction on both routes is due to start imminently. Phase IV, towards Bagamoyo in the north, is in the preliminary design stage. 'Much of the city will have access to a world-class transport system within the space of a few years,' says Chris Kost, the Africa director of ITDP (the Institute for Transportation and Development Policy). All phases are being planned to high standards and, once complete, a third of city residents will be within a short walk of the BRT network.`,
        },
        {
          id: 'c21-t3-p2-10',
          label: '10',
          content: `The ITDP regrets Africa's obsession with metros. 'With a metro, an international firm will often just parachute in its own system,' says Kost. 'Bus rapid transit allows existing stakeholders to get involved. That's what we did in Dar es Salaam and what we're planning in Nairobi, where the bus bodies will be built in the city and local operators will look after tickets, fare collection and IT ... Bus rapid transit has been transformational for Dar es Salaam. For millions of people in African cities, this is their best hope of ever being connected.'`,
        },
      ],
    },
    {
      id: 'c21-t3-p3',
      passageNumber: 3,
      title: 'Rethinking the Past',
      subtitle: 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c21-t3-p3-1',
          label: '1',
          content: `It is by now a truism that the story of human evolution is being rethought. Discoveries have come thick and fast over the last decade or so, and these have forced us to rethink many crucial points, such as how old our species is - about 300,000 years old as opposed to 200,000 - and what extinct hominins, such as our cousins the Neanderthals, were really like. But because there are so many species and eras involved, it's hard to discern the common threads linking them.`,
        },
        {
          id: 'c21-t3-p3-2',
          label: '2',
          content: `However, I do think it's possible to draw out some overall messages from the blizzard of archaeological finds in recent years. Two things stand out to me. One is the growing evidence that many supposedly 'advanced' behaviours, such as architecture and art, can be traced much further back in time than we thought, often to hominin species that existed before modern humans. And the other is that we have badly misunderstood gender roles in prehistoric societies, imposing patriarchal values onto cultures that had very different ideas about how women should behave.`,
        },
        {
          id: 'c21-t3-p3-3',
          label: '3',
          content: `Let's start with architecture. At Kalambo Falls in Zambia, researchers found buried logs that had been shaped with stone tools so that they interlocked. They seem to have once been part of a larger structure, perhaps a building. This would be unsurprising if they weren't 476,000 years old. That's almost 200,000 years before our species, Homo sapiens, evolved. Extinct hominins also managed to settle in extreme places. For instance, we now know that extinct hominins such as the Denisovans lived on the frozen heights of high-altitude regions 200,000 years ago - upending the old notion that such environments were only settled by modern humans around 3,600 years ago.`,
        },
        {
          id: 'c21-t3-p3-4',
          label: '4',
          content: `Art also seems to have been invented by older hominins. We have had evidence for a long time now that Neanderthals painted on cave walls. Even earlier species, such as Homo erectus, may also have made art, for example by engraving patterns on shells. By far the most contentious claim in this area is that Homo naledi made art. H. naledi lived around 250,000 years ago, making it a contemporary of our species. However, it had quite a small brain, typical of older hominins - and was therefore, according to palaeoanthropological dogma, incapable of complex behaviours. Nevertheless, in the Rising Star cave system in South Africa where the H. naledi remains were found, researchers have found what seem to be etchings - resembling rudimentary artwork - on the cave walls, though these have yet to be firmly dated.`,
        },
        {
          id: 'c21-t3-p3-5',
          label: '5',
          content: `To say these claims about H. naledi are controversial is to understate the situation. Many experts say the evidence presented so far is completely inadequate to support them. The dispute has only been heightened by the way the results were released, in a non-traditional journal that publishes peer reviews publicly alongside the paper. My views on the H. naledi controversy are complicated. I do think more evidence is needed: in particular with regard to the dating of the etchings. At the same time, I think the species' small brains are a distraction. Palaeoanthropologists got fixated on brain size because it was what they could see: if what you have is skeletons, then all you know about brains are their shapes and sizes. But other properties, such as the brain's internal wiring, are surely equally important and may explain how a species like H. naledi might have been capable of complex behaviours, despite their small brains.`,
        },
        {
          id: 'c21-t3-p3-6',
          label: '6',
          content: `In a sense, we shouldn't be surprised that so many of these behaviours had their origins in older, extinct hominins. Evolution usually works by incremental steps and so does technology. The first birds weren't great at flying, and the first mobile phones weren't great at, well, anything really. The idea that there was a sudden explosion of intelligence and creativity at some point in our evolution isn't inherently ridiculous: sometimes a system hits a tipping point and undergoes runaway change. But there was never that much evidence that human evolution worked this way. Instead, it seems the Neanderthals and many others all walked so we could run.`,
        },
        {
          id: 'c21-t3-p3-7',
          label: '7',
          content: `One way or another, the H. naledi story is going to be an example of letting our preconceptions get in the way of the evidence. The same is true for our ideas about gender in prehistory. Archaeology was invented by individuals with now unfashionably patriarchal views about gender, and those notions fed into their research. Today's researchers are trying to unpick this stuff, and there have been some significant steps in recent years.`,
        },
        {
          id: 'c21-t3-p3-8',
          label: '8',
          content: `Perhaps the most dramatic was the demolition of 'Man the Hunter'. This was the idea, promoted for decades, that in most prehistoric societies the men went out to hunt and the women looked after the home. However, a meta-analysis published in June 2023 compiled data on several dozen foraging societies and found women hunted in 80 per cent of them. In line with this, it emerged that an ancient spear-throwing tool called an atlatl enables women to launch projectiles at the same speed as men. We have also seen growing evidence of women occupying positions of authority in ancient societies. The Viking queen Thyra may have helped unify Denmark in the 900s. Going further back, an Iberian leader from around 4000 years ago turned out to be female, not male as many had assumed, when proteins in her teeth were analysed.`,
        },
        {
          id: 'c21-t3-p3-9',
          label: '9',
          content: `It seems that the more we find out about past societies, the more our preconceptions about the ways society 'has to be' turn out to be wrong. Inequality, authoritarianism and patriarchy aren't inevitable. They're choices, and prehistory shows us that we can choose differently.`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // -------------------------------------------------------------
    // PASSAGE 1: Questions 1–7 (Note Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-t3-g1',
      passageId: 'c21-t3-p1',
      questionType: 'note_completion',
      title: 'Questions 1–7',
      instructions: 'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–7 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 7,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `The saiga

Adaptations
• has a large bulbous nose with swollen nostrils that
  - keep [[1]] out
  - lower the temperature of its [[2]] in summer
  - warm the air entering its lungs in winter
• grows a thick [[3]] in winter, which it loses in spring

Reasons for population decline
• poaching, especially for the [[4]] of male saiga
• expansion of farms and settlements, causing
  - reduction in the size of the saiga's [[5]]
  - loss of access to the [[6]] which they use for migration
• various forms of disease, leading to mass mortality events
• climate change, causing the disappearance of [[7]] which the saiga relied on`,
      questions: [
        {
          id: 'c21-t3-q1',
          questionNumber: 1,
          prompt: 'keep [[1]] out',
          answerKey: 'dust',
          acceptedAlternatives: ['dust'],
          explanation: 'Paragraph 2 explains: "The swollen nostrils of the nose serve several purposes: they filter out dust and cool the blood during hot, dry summers..." "Filter out" means to keep out.',
          evidenceQuote: 'they filter out dust and cool the blood during hot, dry summers',
          paragraphRef: '2',
          whyCorrect: 'Paragraph 2 explicitly states that nostrils filter out dust, meaning they keep dust out.',
          whyIncorrect: 'Only the noun "dust" fits what is filtered out by the nostrils.',
          commonTrap: 'Write ONE WORD ONLY: "dust".',
          keyParaphrases: [
            { questionTerm: 'keep out', passageTerm: 'filter out' },
          ],
        },
        {
          id: 'c21-t3-q2',
          questionNumber: 2,
          prompt: 'lower the temperature of its [[2]] in summer',
          answerKey: 'blood',
          acceptedAlternatives: ['blood'],
          explanation: 'Paragraph 2 notes that the nostrils "cool the blood during hot, dry summers". "Cool" means to lower the temperature of.',
          evidenceQuote: 'cool the blood during hot, dry summers',
          paragraphRef: '2',
          whyCorrect: '"Cool the blood" directly corresponds to "lower the temperature of its blood".',
          whyIncorrect: 'The nostrils cool the blood, not other organs or body parts.',
          commonTrap: 'Strictly one word: "blood".',
          keyParaphrases: [
            { questionTerm: 'lower the temperature of', passageTerm: 'cool' },
          ],
        },
        {
          id: 'c21-t3-q3',
          questionNumber: 3,
          prompt: 'grows a thick [[3]] in winter, which it loses in spring',
          answerKey: 'coat',
          acceptedAlternatives: ['coat'],
          explanation: 'Paragraph 2 mentions: "Other seasonal adaptations include a heavy winter coat that the saiga sheds when the weather warms up." "Heavy" paraphrases "thick", and "sheds when the weather warms up" paraphrases "loses in spring".',
          evidenceQuote: 'a heavy winter coat that the saiga sheds when the weather warms up',
          paragraphRef: '2',
          whyCorrect: '"Heavy winter coat" matches "thick coat in winter", and shedding it matches losing it in spring.',
          whyIncorrect: 'Do not write "winter coat" because the word limit is ONE WORD ONLY.',
          commonTrap: 'Avoid repeating "winter" from the prompt.',
          keyParaphrases: [
            { questionTerm: 'thick', passageTerm: 'heavy' },
            { questionTerm: 'loses in spring', passageTerm: 'sheds when the weather warms up' },
          ],
        },
        {
          id: 'c21-t3-q4',
          questionNumber: 4,
          prompt: 'poaching, especially for the [[4]] of male saiga',
          answerKey: 'horns',
          acceptedAlternatives: ['horns', 'horn'],
          explanation: 'Paragraph 4 states: "Male saiga are a particular target, because their horns are highly prized by traditional medicine practitioners."',
          evidenceQuote: 'Male saiga are a particular target, because their horns are highly prized by traditional medicine practitioners',
          paragraphRef: '4',
          whyCorrect: 'Male saiga are specifically poached for their horns.',
          whyIncorrect: 'No other body part is targeted according to the passage.',
          commonTrap: 'The exact word in the text is "horns".',
          keyParaphrases: [
            { questionTerm: 'especially for', passageTerm: 'particular target, because' },
          ],
        },
        {
          id: 'c21-t3-q5',
          questionNumber: 5,
          prompt: "reduction in the size of the saiga's [[5]]",
          answerKey: 'habitat',
          acceptedAlternatives: ['habitat'],
          explanation: 'Paragraph 5 states: "Another threat to the survival of the saiga is loss of habitat, as a result of agricultural expansion and human settlement."',
          evidenceQuote: 'loss of habitat, as a result of agricultural expansion and human settlement',
          paragraphRef: '5',
          whyCorrect: '"Loss of habitat" corresponds directly to a reduction in habitat size.',
          whyIncorrect: 'Words like "expansion" or "settlement" describe causes, not what is reduced.',
          commonTrap: 'Write ONE WORD: "habitat".',
          keyParaphrases: [
            { questionTerm: 'reduction in the size of', passageTerm: 'loss of' },
          ],
        },
        {
          id: 'c21-t3-q6',
          questionNumber: 6,
          prompt: 'loss of access to the [[6]] which they use for migration',
          answerKey: 'routes',
          acceptedAlternatives: ['routes', 'route'],
          explanation: 'Paragraph 5 explains: "Physical barriers such as railways, pipelines and fences can block the seasonal migration routes of this transboundary species."',
          evidenceQuote: 'block the seasonal migration routes of this transboundary species',
          paragraphRef: '5',
          whyCorrect: '"Block the seasonal migration routes" corresponds to loss of access to migration routes.',
          whyIncorrect: 'Only "routes" completes the sentence accurately.',
          commonTrap: 'Do not write "migration routes" because of the one-word limit and "migration" is already in the prompt.',
          keyParaphrases: [
            { questionTerm: 'loss of access to', passageTerm: 'block' },
          ],
        },
        {
          id: 'c21-t3-q7',
          questionNumber: 7,
          prompt: 'climate change, causing the disappearance of [[7]] which the saiga relied on',
          answerKey: 'streams',
          acceptedAlternatives: ['streams', 'stream'],
          explanation: 'Paragraph 7 states: "The steppe region has also become increasingly arid in recent years, and many of the smaller streams that the species normally depended on have dried up and vanished."',
          evidenceQuote: 'smaller streams that the species normally depended on have dried up and vanished',
          paragraphRef: '7',
          whyCorrect: '"Dried up and vanished" means disappearance, and "normally depended on" means relied on. The noun is "streams".',
          whyIncorrect: 'Only "streams" describes what dried up and vanished.',
          commonTrap: 'Write ONE WORD ONLY: "streams".',
          keyParaphrases: [
            { questionTerm: 'disappearance of', passageTerm: 'dried up and vanished' },
            { questionTerm: 'relied on', passageTerm: 'depended on' },
          ],
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 1: Questions 8–13 (True / False / Not Given)
    // -------------------------------------------------------------
    {
      id: 'c21-t3-g2',
      passageId: 'c21-t3-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 8–13',
      instructions: 'Do the following statements agree with the information given in Reading Passage 1?\n\nIn boxes 8–13 on your answer sheet, write\nTRUE\tif the statement agrees with the information\nFALSE\tif the statement contradicts the information\nNOT GIVEN\tif there is no information on this',
      startQuestionNumber: 8,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c21-t3-q8',
          questionNumber: 8,
          prompt: 'Today, numbers of saiga are distributed evenly across four nations in Central Asia: Kazakhstan, Russia, Mongolia and Uzbekistan.',
          answerKey: 'FALSE',
          explanation: 'Paragraph 1 states: "Today, the saiga is largely confined to a single country: Kazakhstan. This country is estimated to be home to well over 90% of the global saiga population, with Russia, Mongolia and Uzbekistan accounting for the rest." Because Kazakhstan accounts for over 90%, numbers are NOT distributed evenly.',
          evidenceQuote: 'Today, the saiga is largely confined to a single country: Kazakhstan. This country is estimated to be home to well over 90% of the global saiga population',
          paragraphRef: '1',
          whyCorrect: 'Over 90% are in Kazakhstan alone, which directly contradicts "distributed evenly".',
          whyIncorrect: 'Since the passage directly contradicts the claim, the answer is FALSE, not NOT GIVEN.',
          commonTrap: 'Notice the extreme word "evenly".',
        },
        {
          id: 'c21-t3-q9',
          questionNumber: 9,
          prompt: 'For most of the 20th century, the population of saiga were falling.',
          answerKey: 'FALSE',
          explanation: 'Paragraph 3 states: "Legal protection ensured its survival for a while, and numbers steadily recovered throughout most of the 20th century." This directly contradicts the statement that they were falling.',
          evidenceQuote: 'numbers steadily recovered throughout most of the 20th century',
          paragraphRef: '3',
          whyCorrect: 'The population recovered steadily throughout most of the 20th century, so they were rising, not falling.',
          whyIncorrect: 'The statement contradicts the passage, making FALSE the only correct answer.',
          commonTrap: 'The crash occurred in the 19th century and after 1991, but during most of the 20th century numbers recovered.',
        },
        {
          id: 'c21-t3-q10',
          questionNumber: 10,
          prompt: 'Efforts to protect rhinos in Africa had a significant effect on saiga populations.',
          answerKey: 'TRUE',
          explanation: 'Paragraph 4 states: "Poaching reached epidemic levels after misguided conservationists tried to relieve the pressure on threatened African rhinos by actively encouraging the use of saiga horns in traditional medicine as an alternative to those of rhinos. Male saiga were almost wiped out, leading to a population crash..."',
          evidenceQuote: 'Poaching reached epidemic levels after misguided conservationists tried to relieve the pressure on threatened African rhinos by actively encouraging the use of saiga horns',
          paragraphRef: '4',
          whyCorrect: 'Encouraging saiga horn to protect African rhinos caused epidemic poaching and a devastating crash in saiga numbers, which is a major significant effect.',
          whyIncorrect: 'The text clearly confirms the dramatic cause-and-effect link.',
          commonTrap: 'Even though the consequence was negative and unintended, it was a "significant effect".',
        },
        {
          id: 'c21-t3-q11',
          questionNumber: 11,
          prompt: 'Unpredictable fluctuations in climate are threatening the wildlife of Central Asia more than in other parts of the world.',
          answerKey: 'NOT GIVEN',
          explanation: 'Paragraph 7 mentions that saiga in Central Asia struggle to cope with temperature extremes and unpredictable climate fluctuations, but there is no comparison made to wildlife in other parts of the world.',
          evidenceQuote: 'saiga struggle to cope with temperature extremes and unpredictable fluctuations in climate',
          paragraphRef: '7',
          whyCorrect: 'The passage discusses climate threats to saiga in Central Asia, but provides no comparison to wildlife elsewhere in the world.',
          whyIncorrect: 'Without comparative evidence in the text, this cannot be verified as true or false.',
          commonTrap: 'Do not assume a comparative claim exists when only one region is discussed.',
        },
        {
          id: 'c21-t3-q12',
          questionNumber: 12,
          prompt: 'The Altyn Dala Conservation Initiative was formed for the benefit of a number of different animals.',
          answerKey: 'TRUE',
          explanation: 'Paragraph 8 states that the initiative\'s purpose is "to protect and restore Kazakhstan\'s steppe, semi-desert and desert ecosystems and the many species they support, including the critically endangered saiga."',
          evidenceQuote: 'Its purpose is to protect and restore Kazakhstan\'s steppe, semi-desert and desert ecosystems and the many species they support, including the critically endangered saiga',
          paragraphRef: '8',
          whyCorrect: '"The many species they support, including the critically endangered saiga" confirms it was created for multiple animal species.',
          whyIncorrect: 'The passage explicitly says "many species", agreeing with "a number of different animals".',
          commonTrap: 'Although saiga is prominently featured, the initiative protects the whole ecosystem and many species.',
        },
        {
          id: 'c21-t3-q13',
          questionNumber: 13,
          prompt: "The Altyn Dala Conservation Initiative's recognition as a World Restoration Flagship project attracted additional international funding for the scheme.",
          answerKey: 'NOT GIVEN',
          explanation: 'Paragraph 8 states: "In 2022 the United Nations recognised the initiative as a World Restoration Flagship project, an accolade reserved for the ten best examples of large-scale ecosystem restoration around the globe." The text does not mention whether this accolade attracted additional international funding.',
          evidenceQuote: 'In 2022 the United Nations recognised the initiative as a World Restoration Flagship project, an accolade reserved for the ten best examples of large-scale ecosystem restoration around the globe',
          paragraphRef: '8',
          whyCorrect: 'The UN recognition is stated, but there is zero information regarding whether it brought additional funding.',
          whyIncorrect: 'Cannot be determined as TRUE or FALSE because the passage is silent on funding.',
          commonTrap: 'Do not extrapolate real-world United Nations grant funding into reading test facts.',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 2: Questions 14–18 (True / False / Not Given)
    // -------------------------------------------------------------
    {
      id: 'c21-t3-g3',
      passageId: 'c21-t3-p2',
      questionType: 'true_false_not_given',
      title: 'Questions 14–18',
      instructions: 'Do the following statements agree with the information given in Reading Passage 2?\n\nIn boxes 14–18 on your answer sheet, write\nTRUE\tif the statement agrees with the information\nFALSE\tif the statement contradicts the information\nNOT GIVEN\tif there is no information on this',
      startQuestionNumber: 14,
      endQuestionNumber: 18,
      questions: [
        {
          id: 'c21-t3-q14',
          questionNumber: 14,
          prompt: 'The population of Dar es Salaam is rising more rapidly than was previously predicted.',
          answerKey: 'NOT GIVEN',
          explanation: 'Paragraph 1 mentions that Dar es Salaam is one of the fastest growing cities and cites UN and Global Cities Institute future projections, but never states what earlier or previous predictions were, or whether growth is exceeding them.',
          evidenceQuote: 'United Nations projections anticipate it will become a megacity within seven years as its population passes 10 million, reaching 13.4 million by 2035',
          paragraphRef: '1',
          whyCorrect: 'The text provides future projections, but makes no mention of past predictions to compare against current growth.',
          whyIncorrect: 'Because the passage contains no information comparing present growth to previous predictions, the answer is NOT GIVEN.',
          commonTrap: 'Projections into the future are not comparisons with past predictions.',
        },
        {
          id: 'c21-t3-q15',
          questionNumber: 15,
          prompt: 'Most of the residents of Dar es Salaam live in high-rise blocks on the edge of the city.',
          answerKey: 'FALSE',
          explanation: 'Paragraph 2 states: "four out of five of its people live in single-storey informal settlements on the spreading edges of the city". "Single-storey" contradicts "high-rise blocks".',
          evidenceQuote: 'four out of five of its people live in single-storey informal settlements on the spreading edges of the city',
          paragraphRef: '2',
          whyCorrect: '"Four out of five" (80%, most) live in "single-storey" settlements, directly contradicting "high-rise blocks".',
          whyIncorrect: 'The text gives explicit contradictory housing details, so the answer is FALSE.',
          commonTrap: 'Check architectural details carefully: "single-storey" vs "high-rise".',
        },
        {
          id: 'c21-t3-q16',
          questionNumber: 16,
          prompt: 'Residents have been consulted about their views on the suburban rail line in Dar es Salaam.',
          answerKey: 'NOT GIVEN',
          explanation: 'Paragraph 3 states: "A single suburban rail line serves residents in a few areas to the south but is tiny in the context of the wider city." It mentions nothing about whether residents were consulted about their views.',
          evidenceQuote: 'A single suburban rail line serves residents in a few areas to the south but is tiny in the context of the wider city',
          paragraphRef: '3',
          whyCorrect: 'The rail line is mentioned, but consultation of residents is never discussed in the passage.',
          whyIncorrect: 'Lack of any mention of consultation makes this statement NOT GIVEN.',
          commonTrap: 'Do not assume consultations took place just because a public transit service exists.',
        },
        {
          id: 'c21-t3-q17',
          questionNumber: 17,
          prompt: 'The majority of the present residential development in Dar es Salaam is unplanned.',
          answerKey: 'TRUE',
          explanation: 'Paragraph 4 states: "Nearly all the expansion is happening on the periphery, and nearly all takes place informally without any agreed strategy." "Without any agreed strategy" and "informally" mean unplanned, and "Nearly all" means the majority.',
          evidenceQuote: 'Nearly all the expansion is happening on the periphery, and nearly all takes place informally without any agreed strategy',
          paragraphRef: '4',
          whyCorrect: '"Nearly all takes place informally without any agreed strategy" directly agrees with "The majority of the present residential development... is unplanned".',
          whyIncorrect: 'The text clearly confirms the absence of formal planning.',
          commonTrap: '"Informally without any agreed strategy" is a direct paraphrase for "unplanned".',
          keyParaphrases: [
            { questionTerm: 'unplanned', passageTerm: 'informally without any agreed strategy' },
            { questionTerm: 'majority', passageTerm: 'nearly all' },
          ],
        },
        {
          id: 'c21-t3-q18',
          questionNumber: 18,
          prompt: "Dar es Salaam's authorities have decided to follow the public transport plan adopted by a large number of African cities.",
          answerKey: 'FALSE',
          explanation: 'Paragraph 5 states: "Unlike many cities on the continent, Dar es Salaam isn\'t trying to build a metro. It has chosen a less exciting but cheaper and more achievable method: the bus." Paragraph 10 also regrets "Africa\'s obsession with metros". Dar es Salaam did the opposite.',
          evidenceQuote: "Unlike many cities on the continent, Dar es Salaam isn't trying to build a metro. It has chosen a less exciting but cheaper and more achievable method: the bus",
          paragraphRef: '5',
          whyCorrect: 'Dar es Salaam chose bus rapid transit UNLIKE many other African cities that attempted to build metros.',
          whyIncorrect: 'The statement directly contradicts the passage.',
          commonTrap: 'Pay attention to "Unlike many cities on the continent".',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 2: Questions 19–26 (Note Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-t3-g4',
      passageId: 'c21-t3-p2',
      questionType: 'note_completion',
      title: 'Questions 19–26',
      instructions: 'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 19–26 on your answer sheet.',
      startQuestionNumber: 19,
      endQuestionNumber: 26,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Dar es Salaam's DART Bus Rapid Transit system

Features
• the buses use designated [[19]] to cut down on delays
• passengers pay fares before [[20]]
• passengers in [[21]] can use every part of the system

Problems
• the temperature control is sometimes not activated in order to reduce [[22]] use
• insufficient number of vehicles are available due to the effects of a severe [[23]]
• passengers are unable to use [[24]] because some equipment is out of action
• tickets have to be checked manually at station [[25]]
• [[26]] frequently build up during rush hours`,
      questions: [
        {
          id: 'c21-t3-q19',
          questionNumber: 19,
          prompt: 'the buses use designated [[19]] to cut down on delays',
          answerKey: 'lanes',
          acceptedAlternatives: ['lanes', 'lane'],
          explanation: 'Paragraph 6 states: "The DART bus rapid transit (BRT) system runs on bus lanes separated from other traffic, mostly in the middle of the road to reduce stoppages." "Separated from other traffic" paraphrases "designated", and "reduce stoppages" paraphrases "cut down on delays".',
          evidenceQuote: 'The DART bus rapid transit (BRT) system runs on bus lanes separated from other traffic, mostly in the middle of the road to reduce stoppages',
          paragraphRef: '6',
          whyCorrect: 'The buses run on separated "lanes", which matches designated lanes.',
          whyIncorrect: 'Write strictly ONE WORD: "lanes".',
          commonTrap: 'Do not write "bus lanes" as the limit is ONE WORD ONLY.',
          keyParaphrases: [
            { questionTerm: 'designated', passageTerm: 'separated from other traffic' },
            { questionTerm: 'cut down on delays', passageTerm: 'reduce stoppages' },
          ],
        },
        {
          id: 'c21-t3-q20',
          questionNumber: 20,
          prompt: 'passengers pay fares before [[20]]',
          answerKey: 'boarding',
          acceptedAlternatives: ['boarding'],
          explanation: 'Paragraph 6 states: "Ticket purchase and control takes place at stations prior to boarding..." "Prior to" directly means "before".',
          evidenceQuote: 'Ticket purchase and control takes place at stations prior to boarding',
          paragraphRef: '6',
          whyCorrect: '"Prior to boarding" directly matches "before boarding".',
          whyIncorrect: 'The action prior to which tickets are purchased is boarding.',
          commonTrap: 'The exact word from the passage is "boarding".',
          keyParaphrases: [
            { questionTerm: 'before', passageTerm: 'prior to' },
          ],
        },
        {
          id: 'c21-t3-q21',
          questionNumber: 21,
          prompt: 'passengers in [[21]] can use every part of the system',
          answerKey: 'wheelchairs',
          acceptedAlternatives: ['wheelchairs', 'wheelchair'],
          explanation: 'Paragraph 6 states: "...the buses are step-free, which means the entire route is accessible to people using wheelchairs or who are travelling with baby buggies." "Accessible to" matches "can use", and "entire route" matches "every part of the system".',
          evidenceQuote: 'the entire route is accessible to people using wheelchairs',
          paragraphRef: '6',
          whyCorrect: '"People using wheelchairs" matches "passengers in wheelchairs".',
          whyIncorrect: 'Only "wheelchairs" fits grammatically and semantically into "passengers in [word]".',
          commonTrap: 'Write ONE WORD: "wheelchairs".',
          keyParaphrases: [
            { questionTerm: 'every part of the system', passageTerm: 'the entire route' },
            { questionTerm: 'can use', passageTerm: 'is accessible to' },
          ],
        },
        {
          id: 'c21-t3-q22',
          questionNumber: 22,
          prompt: 'the temperature control is sometimes not activated in order to reduce [[22]] use',
          answerKey: 'fuel',
          acceptedAlternatives: ['fuel'],
          explanation: 'Paragraph 7 explains: "...complaining that drivers often refuse to turn on the air conditioning to save fuel." "Air conditioning" is "temperature control", and "to save fuel" is "in order to reduce fuel use".',
          evidenceQuote: 'drivers often refuse to turn on the air conditioning to save fuel',
          paragraphRef: '7',
          whyCorrect: '"Save fuel" directly matches "reduce fuel use".',
          whyIncorrect: 'Fuel is the resource conserved by turning off the air conditioning.',
          commonTrap: 'ONE WORD ONLY: "fuel".',
          keyParaphrases: [
            { questionTerm: 'temperature control', passageTerm: 'air conditioning' },
            { questionTerm: 'reduce fuel use', passageTerm: 'save fuel' },
          ],
        },
        {
          id: 'c21-t3-q23',
          questionNumber: 23,
          prompt: 'insufficient number of vehicles are available due to the effects of a severe [[23]]',
          answerKey: 'flood',
          acceptedAlternatives: ['flood'],
          explanation: 'Paragraph 8 states: "A shortage of buses after a serious flood at the main depot during the rainy season means the system is carrying 200,000 people a day..." "Shortage of buses" matches "insufficient number of vehicles", and "serious flood" matches "severe flood".',
          evidenceQuote: 'A shortage of buses after a serious flood at the main depot during the rainy season',
          paragraphRef: '8',
          whyCorrect: '"Serious flood" directly corresponds to "severe flood".',
          whyIncorrect: 'Words like "season" or "depot" do not name the disruptive weather event.',
          commonTrap: 'Write ONE WORD: "flood".',
          keyParaphrases: [
            { questionTerm: 'severe', passageTerm: 'serious' },
            { questionTerm: 'insufficient number of vehicles', passageTerm: 'shortage of buses' },
          ],
        },
        {
          id: 'c21-t3-q24',
          questionNumber: 24,
          prompt: 'passengers are unable to use [[24]] because some equipment is out of action',
          answerKey: 'smartcards',
          acceptedAlternatives: ['smartcards', 'smartcard'],
          explanation: 'Paragraph 8 explains: "Smartcards can\'t be used as the mechanical readers aren\'t working either..." "Can\'t be used" matches "unable to use", and "aren\'t working" matches "out of action".',
          evidenceQuote: "Smartcards can't be used as the mechanical readers aren't working either",
          paragraphRef: '8',
          whyCorrect: '"Smartcards" is the noun identifying what cannot be used.',
          whyIncorrect: 'Paper tickets are used as a fallback, so only smartcards are out of action.',
          commonTrap: 'Write the single word "smartcards".',
          keyParaphrases: [
            { questionTerm: 'unable to use', passageTerm: "can't be used" },
            { questionTerm: 'out of action', passageTerm: "aren't working" },
          ],
        },
        {
          id: 'c21-t3-q25',
          questionNumber: 25,
          prompt: 'tickets have to be checked manually at station [[25]]',
          answerKey: 'gates',
          acceptedAlternatives: ['gates', 'gate'],
          explanation: 'Paragraph 8 states: "Staff stand by the gates and tear tickets as people enter." This describes manual checking of tickets at station gates.',
          evidenceQuote: 'Staff stand by the gates and tear tickets as people enter',
          paragraphRef: '8',
          whyCorrect: 'Staff tear tickets at the "gates", matching manual checking at station gates.',
          whyIncorrect: 'Only "gates" identifies the station location where staff stand.',
          commonTrap: 'The word in the text is "gates".',
          keyParaphrases: [
            { questionTerm: 'checked manually', passageTerm: 'Staff stand by... and tear tickets' },
          ],
        },
        {
          id: 'c21-t3-q26',
          questionNumber: 26,
          prompt: '[[26]] frequently build up during rush hours',
          answerKey: 'queues',
          acceptedAlternatives: ['queues', 'queue'],
          explanation: 'Paragraph 8 states: "As a result, queues are considerable at peak times." "Considerable at peak times" matches "frequently build up during rush hours".',
          evidenceQuote: 'As a result, queues are considerable at peak times',
          paragraphRef: '8',
          whyCorrect: '"Queues" is the exact noun that becomes considerable at peak times.',
          whyIncorrect: 'Only "queues" functions as the subject that builds up.',
          commonTrap: 'ONE WORD ONLY: "queues".',
          keyParaphrases: [
            { questionTerm: 'during rush hours', passageTerm: 'at peak times' },
          ],
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 3: Questions 27–30 (Multiple Choice Single)
    // -------------------------------------------------------------
    {
      id: 'c21-t3-g5',
      passageId: 'c21-t3-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–30',
      instructions: 'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–30 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c21-t3-q27',
          questionNumber: 27,
          prompt: 'What is the writer doing in the second paragraph?',
          options: [
            { key: 'A', text: 'pinpointing some key changes in our understanding of prehistory' },
            { key: 'B', text: 'outlining some aspects of prehistory which are still poorly understood' },
            { key: 'C', text: 'summarising some attitudes towards recent archaeological revelations' },
            { key: 'D', text: 'giving an overview of some current disagreements among archaeologists' },
          ],
          answerKey: 'A',
          explanation: 'In Paragraph 2, the writer identifies two main takeaways: "One is the growing evidence that many supposedly \'advanced\' behaviours... can be traced much further back in time than we thought... And the other is that we have badly misunderstood gender roles in prehistoric societies..." Thus, the writer is pinpointing key changes in our understanding.',
          evidenceQuote: "However, I do think it's possible to draw out some overall messages from the blizzard of archaeological finds in recent years. Two things stand out to me.",
          paragraphRef: '2',
          whyCorrect: 'The paragraph highlights two major ways our understanding of prehistory has shifted in light of recent archaeological finds.',
          whyIncorrect: 'The author is not presenting unexplained mysteries (B), surveying general attitudes (C), or detailing disagreements (D).',
          distractorAnalysis: {
            B: 'The author focuses on what recent finds have revealed, not what remains unexplained.',
            C: 'The author provides an analytical summary of findings, not general public or academic attitudes.',
            D: 'Disagreements between archaeologists are introduced in paragraph 4 and 5 regarding Homo naledi, not paragraph 2.',
          },
        },
        {
          id: 'c21-t3-q28',
          questionNumber: 28,
          prompt: 'In the sixth paragraph, the writer mentions mobile phones to make the point that',
          options: [
            { key: 'A', text: 'most developments happen in a gradual way.' },
            { key: 'B', text: 'innovation can come from a variety of sources.' },
            { key: 'C', text: 'not all technological advancements are positive.' },
            { key: 'D', text: 'the path of evolution can often be unpredictable.' },
          ],
          answerKey: 'A',
          explanation: 'Paragraph 6 states: "Evolution usually works by incremental steps and so does technology. The first birds weren\'t great at flying, and the first mobile phones weren\'t great at, well, anything really." The mobile phone example illustrates that technology and evolution advance by "incremental steps" (gradually).',
          evidenceQuote: "Evolution usually works by incremental steps and so does technology. The first birds weren't great at flying, and the first mobile phones weren't great at, well, anything really.",
          paragraphRef: '6',
          whyCorrect: '"Incremental steps" directly means happening in a gradual, step-by-step way.',
          whyIncorrect: 'The point is not about diverse origins (B), negative impacts (C), or unpredictability (D).',
          distractorAnalysis: {
            B: 'No mention of multiple distinct origins of technology.',
            C: 'Early mobile phones were basic and rudimentary, but not harmful or negative.',
            D: 'The writer emphasizes steady incremental progression rather than erratic or unpredictable paths.',
          },
        },
        {
          id: 'c21-t3-q29',
          questionNumber: 29,
          prompt: "In the seventh paragraph, the phrase 'unpick this stuff' refers to the task of",
          options: [
            { key: 'A', text: 'assessing the impact of certain recent research findings.' },
            { key: 'B', text: 'questioning the authenticity of evidence used in earlier research.' },
            { key: 'C', text: 'conducting research into how prehistoric societies were organised.' },
            { key: 'D', text: 'reevaluating research influenced by outdated beliefs about society.' },
          ],
          answerKey: 'D',
          explanation: 'Paragraph 7 notes: "Archaeology was invented by individuals with now unfashionably patriarchal views about gender, and those notions fed into their research. Today\'s researchers are trying to unpick this stuff..." "This stuff" refers to research biased by those outdated patriarchal assumptions.',
          evidenceQuote: "Archaeology was invented by individuals with now unfashionably patriarchal views about gender, and those notions fed into their research. Today's researchers are trying to unpick this stuff",
          paragraphRef: '7',
          whyCorrect: '"Unpick this stuff" means examining and disentangling past research that was influenced by outdated patriarchal beliefs.',
          whyIncorrect: 'It specifically addresses correcting gender biases in earlier research, not general evidence authenticity or broad social organization.',
          distractorAnalysis: {
            A: 'The phrase refers to past biased concepts, not evaluating recent findings.',
            B: 'The physical authenticity of artifacts is not questioned; the interpretation influenced by bias is.',
            C: 'While related, the phrase specifically targets dismantling past biased theories rather than conducting neutral research.',
          },
        },
        {
          id: 'c21-t3-q30',
          questionNumber: 30,
          prompt: 'What does the writer suggest in the final paragraph?',
          options: [
            { key: 'A', text: 'Studying past societies could help us create a fairer society today.' },
            { key: 'B', text: 'We should not judge past societies by the standards of modern society.' },
            { key: 'C', text: 'We still have much to learn about how societies have evolved over history.' },
            { key: 'D', text: 'There is more than one way to interpret evidence about societies in prehistoric times.' },
          ],
          answerKey: 'A',
          explanation: 'Paragraph 9 concludes: "Inequality, authoritarianism and patriarchy aren\'t inevitable. They\'re choices, and prehistory shows us that we can choose differently." This implies that insights from prehistory show that alternative, fairer societal models are possible.',
          evidenceQuote: "Inequality, authoritarianism and patriarchy aren't inevitable. They're choices, and prehistory shows us that we can choose differently.",
          paragraphRef: '9',
          whyCorrect: 'Understanding that patriarchy and inequality were not inevitable in prehistory demonstrates that we can make different choices and build a fairer society today.',
          whyIncorrect: 'Options B, C, and D are not the central concluding message of the paragraph.',
          distractorAnalysis: {
            B: 'The author criticizes projecting modern patriarchal values onto the past, but the final paragraph is a call for modern societal choice.',
            C: 'While true, the final paragraph focuses on human choice regarding social equality rather than continuing academic study.',
            D: 'Multiple interpretations were explored earlier; paragraph 9 focuses on social implications.',
          },
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 3: Questions 31–34 (Matching Sentence Endings)
    // -------------------------------------------------------------
    {
      id: 'c21-t3-g6',
      passageId: 'c21-t3-p3',
      questionType: 'matching_sentence_endings',
      title: 'Questions 31–34',
      instructions: 'Complete each sentence with the correct ending, A–F, below.\nWrite the correct letter, A–F, in boxes 31–34 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 34,
      optionsList: [
        { key: 'A', text: 'Homo sapiens emerged at an earlier point in time than experts previously believed.' },
        { key: 'B', text: 'previous assumptions about who had power in the prehistoric world were inaccurate.' },
        { key: 'C', text: 'gender roles in extinct hominin species were different from those in Homo sapiens societies.' },
        { key: 'D', text: 'experts may have been mistaken about who looked for food in early human communities.' },
        { key: 'E', text: 'Homo sapiens was probably not the only species capable of sophisticated workmanship.' },
        { key: 'F', text: 'other species managed to survive in harsh environments before the arrival of Homo sapiens.' },
      ],
      questions: [
        {
          id: 'c21-t3-q31',
          questionNumber: 31,
          prompt: 'The findings at Kalambo Falls revealed that',
          answerKey: 'E',
          explanation: 'Paragraph 3 states: "At Kalambo Falls in Zambia, researchers found buried logs that had been shaped with stone tools so that they interlocked... This would be unsurprising if they weren\'t 476,000 years old. That\'s almost 200,000 years before our species, Homo sapiens, evolved." This shows older hominins were also capable of sophisticated workmanship (building with interlocking logs).',
          evidenceQuote: 'At Kalambo Falls in Zambia, researchers found buried logs that had been shaped with stone tools so that they interlocked... almost 200,000 years before our species, Homo sapiens, evolved',
          paragraphRef: '3',
          whyCorrect: 'Shaping interlocking logs with stone tools demonstrates that Homo sapiens was not the only species capable of sophisticated carpentry/workmanship.',
          whyIncorrect: 'Kalambo Falls concerns woodworking and structures, not high altitudes or food gathering.',
        },
        {
          id: 'c21-t3-q32',
          questionNumber: 32,
          prompt: 'Evidence from high-altitude regions suggests that',
          answerKey: 'F',
          explanation: 'Paragraph 3 states: "For instance, we now know that extinct hominins such as the Denisovans lived on the frozen heights of high-altitude regions 200,000 years ago - upending the old notion that such environments were only settled by modern humans around 3,600 years ago." This demonstrates that other species survived in harsh environments before Homo sapiens.',
          evidenceQuote: 'extinct hominins such as the Denisovans lived on the frozen heights of high-altitude regions 200,000 years ago - upending the old notion that such environments were only settled by modern humans around 3,600 years ago',
          paragraphRef: '3',
          whyCorrect: 'Denisovans survived in frozen, high-altitude regions 200,000 years ago, matching ending F.',
          whyIncorrect: 'High altitudes are harsh environments settled by Denisovans before modern humans.',
        },
        {
          id: 'c21-t3-q33',
          questionNumber: 33,
          prompt: 'An academic publication from June 2023 shows that',
          answerKey: 'D',
          explanation: 'Paragraph 8 explains: "...a meta-analysis published in June 2023 compiled data on several dozen foraging societies and found women hunted in 80 per cent of them." This demolished "Man the Hunter", showing experts were mistaken about who looked for food.',
          evidenceQuote: "Perhaps the most dramatic was the demolition of 'Man the Hunter'... However, a meta-analysis published in June 2023 compiled data on several dozen foraging societies and found women hunted in 80 per cent of them.",
          paragraphRef: '8',
          whyCorrect: 'Finding that women hunted in 80% of foraging societies proved experts were mistaken in assuming only men looked for food.',
          whyIncorrect: 'Relates directly to hunting and foraging for food.',
        },
        {
          id: 'c21-t3-q34',
          questionNumber: 34,
          prompt: 'Analysis of a 4000-year-old Iberian leader indicates that',
          answerKey: 'B',
          explanation: 'Paragraph 8 states: "...an Iberian leader from around 4000 years ago turned out to be female, not male as many had assumed, when proteins in her teeth were analysed." This demonstrates that previous assumptions about who held power were inaccurate.',
          evidenceQuote: 'an Iberian leader from around 4000 years ago turned out to be female, not male as many had assumed, when proteins in her teeth were analysed',
          paragraphRef: '8',
          whyCorrect: 'The discovery of a female leader shows that assumptions about exclusively male leadership and power in the prehistoric world were mistaken.',
          whyIncorrect: 'Directly relates to leadership and power.',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 3: Questions 35–40 (Yes / No / Not Given)
    // -------------------------------------------------------------
    {
      id: 'c21-t3-g7',
      passageId: 'c21-t3-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 35–40',
      instructions: 'Do the following statements agree with the views of the writer in Reading Passage 3?\n\nIn boxes 35–40 on your answer sheet, write\nYES\tif the statement agrees with the views of the writer\nNO\tif the statement contradicts the views of the writer\nNOT GIVEN\tif it is impossible to say what the writer thinks about this',
      startQuestionNumber: 35,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c21-t3-q35',
          questionNumber: 35,
          prompt: "It seems likely that the Neanderthals' cave paintings were the first examples of artwork ever created.",
          answerKey: 'NO',
          explanation: 'Paragraph 4 states: "We have had evidence for a long time now that Neanderthals painted on cave walls. Even earlier species, such as Homo erectus, may also have made art, for example by engraving patterns on shells." Because earlier species may have made art before Neanderthals, the author contradicts the claim that Neanderthal paintings were the first.',
          evidenceQuote: 'Even earlier species, such as Homo erectus, may also have made art, for example by engraving patterns on shells.',
          paragraphRef: '4',
          whyCorrect: 'The writer explicitly notes that earlier species like Homo erectus may have produced artwork before Neanderthals, contradicting the statement.',
          whyIncorrect: 'Because the statement contradicts the writer\'s views, the answer is NO.',
          commonTrap: 'Notice "Even earlier species... may also have made art".',
        },
        {
          id: 'c21-t3-q36',
          questionNumber: 36,
          prompt: 'It is very rare to find prehistoric artwork carved onto shells.',
          answerKey: 'NOT GIVEN',
          explanation: 'Paragraph 4 mentions Homo erectus "engraving patterns on shells" as an example of early art, but never comments on whether shell engravings are rare or common.',
          evidenceQuote: 'Even earlier species, such as Homo erectus, may also have made art, for example by engraving patterns on shells.',
          paragraphRef: '4',
          whyCorrect: 'Shell engravings are mentioned as an example, but there is no statement about their frequency or rarity.',
          whyIncorrect: 'Without any statement about rarity, the writer\'s view cannot be determined.',
          commonTrap: 'Do not extrapolate rarity from your own background archaeological knowledge.',
        },
        {
          id: 'c21-t3-q37',
          questionNumber: 37,
          prompt: 'The methods which the researchers used to examine the Rising Star cave system were rather unconventional.',
          answerKey: 'NOT GIVEN',
          explanation: 'Paragraph 5 mentions that the results were released in a non-traditional journal that publishes peer reviews publicly alongside the paper. However, the writer does not describe the physical examination methods used inside the cave as unconventional.',
          evidenceQuote: 'The dispute has only been heightened by the way the results were released, in a non-traditional journal that publishes peer reviews publicly alongside the paper.',
          paragraphRef: '5',
          whyCorrect: 'The publishing medium was non-traditional, but nothing is said about unconventional methods used to explore or examine the cave itself.',
          whyIncorrect: 'Publication process is distinct from archaeological cave examination methods.',
          commonTrap: 'Do not confuse the journal publication format with the field examination methods.',
        },
        {
          id: 'c21-t3-q38',
          questionNumber: 38,
          prompt: 'It is unclear how old the etchings in the Rising Star cave system are.',
          answerKey: 'YES',
          explanation: 'Paragraph 4 notes that the etchings "have yet to be firmly dated", and Paragraph 5 adds: "I do think more evidence is needed: in particular with regard to the dating of the etchings." This confirms the writer agrees that their age is unclear.',
          evidenceQuote: 'though these have yet to be firmly dated... I do think more evidence is needed: in particular with regard to the dating of the etchings.',
          paragraphRef: '4 & 5',
          whyCorrect: '"Have yet to be firmly dated" and requiring more evidence regarding dating agrees that their age is currently unclear.',
          whyIncorrect: 'The text clearly supports this view.',
          commonTrap: '"Yet to be firmly dated" is synonymous with "unclear how old they are".',
          keyParaphrases: [
            { questionTerm: 'unclear how old... are', passageTerm: 'have yet to be firmly dated' },
          ],
        },
        {
          id: 'c21-t3-q39',
          questionNumber: 39,
          prompt: 'The means used to publicise the findings from the Rising Star cave system added to the controversy that surrounds them.',
          answerKey: 'YES',
          explanation: 'Paragraph 5 states: "The dispute has only been heightened by the way the results were released, in a non-traditional journal that publishes peer reviews publicly alongside the paper." "Heightened the dispute" directly matches "added to the controversy", and "the way the results were released" matches "the means used to publicise the findings".',
          evidenceQuote: 'The dispute has only been heightened by the way the results were released, in a non-traditional journal that publishes peer reviews publicly alongside the paper.',
          paragraphRef: '5',
          whyCorrect: '"Dispute has only been heightened by the way the results were released" directly agrees with the statement.',
          whyIncorrect: 'The writer explicitly asserts this connection.',
          commonTrap: 'Direct paraphrase: dispute = controversy; heightened = added to; way results were released = means used to publicise.',
          keyParaphrases: [
            { questionTerm: 'means used to publicise', passageTerm: 'way the results were released' },
            { questionTerm: 'added to the controversy', passageTerm: 'dispute has only been heightened' },
          ],
        },
        {
          id: 'c21-t3-q40',
          questionNumber: 40,
          prompt: 'The size of H. naledi brains is a key factor in the question of whether these hominins were able to produce art.',
          answerKey: 'NO',
          explanation: 'Paragraph 5 states: "At the same time, I think the species\' small brains are a distraction... But other properties, such as the brain\'s internal wiring, are surely equally important and may explain how a species like H. naledi might have been capable of complex behaviours, despite their small brains." The writer explicitly considers brain size to be a distraction rather than a key factor.',
          evidenceQuote: "At the same time, I think the species' small brains are a distraction... other properties, such as the brain's internal wiring, are surely equally important",
          paragraphRef: '5',
          whyCorrect: 'The writer views brain size as a "distraction", contradicting the claim that it is a key factor.',
          whyIncorrect: 'The writer rejects the palaeoanthropological dogma focusing on brain size.',
          commonTrap: 'Palaeoanthropologists focused on brain size, but the writer states it is a distraction.',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 21 Academic Reading Test 3',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge21Test3(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: string;
  totalQuestions: number;
}> {
  const data = getCambridge21Test3Data();

  // Validate version schema
  const validationErrors = validateTestVersion(data.passages, data.questionGroups);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 21 Reading Test 3 validation failed: ${validationErrors.join(', ')}`);
  }

  // Find admin user if authorId is not provided
  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = (await db
      .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
      .get()) as { id: string } | undefined;
    resolvedAuthorId = adminUser ? adminUser.id : 'f8b2e30a-ae78-435a-b9d3-a22f34452016';
  }

  const existingTest = (await db
    .prepare(
      "SELECT id, current_version_number FROM reading_tests WHERE title LIKE '%Cambridge%21%Reading%Test 3%' OR title = ? LIMIT 1"
    )
    .get(data.title)) as { id: string; current_version_number: number } | undefined;

  const now = new Date().toISOString();
  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db
      .prepare('SELECT id FROM reading_test_versions WHERE test_id = ? AND version_number = ?')
      .get(testId, existingTest.current_version_number)) as { id: string } | undefined;

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
        ) VALUES (?, ?, ?, 'published', ?, ?, 40, '[]', ?, ?)
      `).run(
        versionId,
        testId,
        existingTest.current_version_number,
        JSON.stringify(data.passages),
        JSON.stringify(data.questionGroups),
        now,
        now
      ));
    }

    (await db.prepare(`
      UPDATE reading_tests
      SET status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(now, testId));
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
