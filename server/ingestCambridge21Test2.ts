import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup, ReadingTest } from '../shared/types';
import { validateTestVersion, getTestById, getVersionById } from './readingService';

export function getCambridge21Test2Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c21-t2-p1',
      passageNumber: 1,
      title: 'Do animals dream?',
      subtitle: 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c21-t2-p1-1',
          label: '1',
          content: `Studies using electrodes attached to the heads of sleepers have shown that when we sleep, we do so in two ways that alternate throughout the night. The first is rapid eye movement (REM) or active sleep. During this stage our eyes move, even though our eyelids are closed. Our muscles also twitch slightly, though they are largely paralysed so we don't hurt ourselves. In contrast, we also engage in non-REM sleep, during which we barely move at all. Most dream states, and certainly those with the most vivid dreams, happen during REM sleep.`,
        },
        {
          id: 'c21-t2-p1-2',
          label: '2',
          content: `There's some evidence that other mammals may also dream. For example, researchers compared the brain patterns of rats running through a maze when awake with their brain patterns during REM sleep. They found the patterns were very similar and concluded that the sleeping rats were dreaming about going through the maze.`,
        },
        {
          id: 'c21-t2-p1-3',
          label: '3',
          content: `But finding evidence of dreaming in non-mammals has proved more difficult. Their brains are very different from those of humans, and it can often be difficult to record their activity while they are sleeping. Recently, however, researchers succeeded in recording brain activity in sleeping pigeons. As in mammals, the recordings revealed both REM and non-REM sleep. Intriguingly, REM sleep activity was high in brain regions involved in processing visual information, especially images related to physical activities such as flying, which suggests that this may possibly be what the pigeons were dreaming about.`,
        },
        {
          id: 'c21-t2-p1-4',
          label: '4',
          content: `That said, dreaming and REM sleep are unlikely to be universal in the animal kingdom. For example, sponges don't have brains, so they lack the machinery for dreaming. There are also some animals with unusual sleep patterns. These include whales and dolphins, which do not shut down their entire brain when they sleep, but only half of it, keeping the rest awake. They also show no sign of REM sleep, suggesting that they may only experience non-REM dreams, which are less vivid. This is surprising because we tend to think of whales and dolphins as having complex inner lives. It's thought that they don't experience REM sleep because during REM sleep animals are more vulnerable to extremes of temperature.`,
        },
        {
          id: 'c21-t2-p1-5',
          label: '5',
          content: `Nevertheless, in many cases REM sleep does seem to have benefits. Growing evidence from birds and mammals suggests that REM sleep and dreaming are important for forming memories and learning. It is believed that when events are replayed in dreams, this helps to integrate memories into longer-term storage. As soon as animals evolved moderately complex lifestyles, they would have needed to dream in order to manage these lifestyles.`,
        },
        {
          id: 'c21-t2-p1-6',
          label: '6',
          content: `However, we still don't understand how this outward behaviour relates to internal experience. It seems impossible to know what it is like to be a rat or a pigeon, let alone imagine their dreamscapes. We are quick to interpret the twitching limbs and quiet barks of sleeping dogs, but the truth is that we don't know if there is an internal experience of chasing rabbits that comes along with that.`,
        },
        {
          id: 'c21-t2-p1-7',
          label: '7',
          content: `Another non-human dreamer offers insight here. In 2019, while making a documentary, David Scheel of Alaska Pacific University in the USA housed an octopus named Heidi in a tank in his living room. At one point, in the middle of the night, Heidi seemed to dream: her limbs and head moved, and her skin rapidly changed colour, as though she was pursuing a crab.`,
        },
        {
          id: 'c21-t2-p1-8',
          label: '8',
          content: `Similarly, a report recently emerged of a sleeping octopus apparently having a nightmare. Costello, as the octopus was called, thrashed around, extended his mantle as if trying to make himself look bigger, and squirted ink as though he were being attacked by a predator. The nightmare study is intriguing, says Scheel, but is only based on one animal. He argues that as well as outward behaviour, brain imaging is needed to show that the octopuses are replaying sequences of activities from their waking lives in dreams.`,
        },
        {
          id: 'c21-t2-p1-9',
          label: '9',
          content: `The trouble is that we will never be able to experience any animal's dreams. That goes for other humans' dreams too. But we can try to imagine what these dreamscapes are like by meeting animals on their own terms. For example, vision is the dominant sense for many humans, and so our dreams are heavily visual too. Dogs primarily navigate the world using smell while spiders rely much more on vibrations.`,
        },
        {
          id: 'c21-t2-p1-10',
          label: '10',
          content: `It is likely that dreaming has served multiple purposes since the first complex animals evolved. And if this is the case, it is possible that better understanding of these purposes might shed light on the true purpose of our own dreams.`,
        },
      ],
    },
    {
      id: 'c21-t2-p2',
      passageNumber: 2,
      title: 'Mapungubwe',
      subtitle: 'Located in southern Africa just below the Limpopo River, the kingdom of Mapungubwe flourished between the 11th and 13th century CE',
      paragraphs: [
        {
          id: 'c21-t2-p2-A',
          label: 'A',
          content: `Mapungubwe, which was one of the first states in southern Africa, was formed by Bantu-speaking peoples who were farmers. The area controlled by the rulers of Mapungubwe had at its heart a large sandstone plateau, which was easily defended due to its inaccessibility. As with other kingdoms in the region of southern Africa, cattle herding and other types of farming brought plenty of food and a surplus that could be traded for needed goods. Archaeology has revealed extensive layers of bones and manure, which indicate that from the 9th century CE there were large cattle herds, the traditional source of political power in southern African communities. The archaeological record for the 10th century shows a marked increase in the number of domesticated cattle in the area as well as cotton cultivation and weaving, as indicated by abundant finds of spindle whorls.`,
        },
        {
          id: 'c21-t2-p2-B',
          label: 'B',
          content: `The total population of Mapungubwe at its peak in the mid-13th century was around 5,000 people. The chief or king of Mapungubwe was likely the wealthiest individual in the society, and would have owned more cattle and precious materials than anyone else. The king and his advisers dwelt in a stone enclosure composed of stone walls and housing built on the highest level of the community's territory, a natural sandstone hill which is some 30 metres high and 100 metres in length. Occupation on the hill dates from the 11th century and the entire complex was surrounded by a wooden palisade*, as indicated by postholes made in the rock. The rest of the community lived in mud and thatch housing spread out below the hill, although there is one stone structure here. This settlement, known as Babandyanalo, covers around 5 hectares (12.3 acres) and predates the hilltop structures.\n\n* palisade: typically a row of closely placed, high vertical wooden or iron posts used as a means of defence`,
        },
        {
          id: 'c21-t2-p2-C',
          label: 'C',
          content: `The kings of Mapungubwe were buried at the top of the hill site in a demarcated area away from the dwellings, while other members of the community were buried at the surrounding valley level. A wooden staircase connected the two levels, the sockets for the steps being clearly visible in the sandstone cliff face. There were some grander residences dotted around the outskirts of Babandyanalo, and these probably belonged to male relatives of the king. There are many other smaller but still impressive sites across the Mapungubwe plateau, which are located anywhere from 15 to 100 kilometres from the major hill site. Containing stone residences and walls, they likely belonged to local chiefs who acted as servants to the king.`,
        },
        {
          id: 'c21-t2-p2-D',
          label: 'D',
          content: `The Mapungubwe plateau has a very high number of carnivore animal remains and ivory splinters, suggesting that the skins of these large animals and ivory elephant tusks were accumulated, probably for trade with coastal areas reached by the Limpopo River. The presence of glass beads, almost certainly from India, indicate there was trade of some sort with other states on the coast who, in turn, traded with merchants travelling from India by sea. Mapungubwe also benefitted from locally-sourced copper and the gold trade as it passed from the kingdom of Great Zimbabwe (12-15th century), situated to the north of Mapungubwe, to the coastal city of Kosala. It is likely that trade links led to a strengthening of political authority in order to control and even monopolise these lucrative interregional connections.`,
        },
        {
          id: 'c21-t2-p2-E',
          label: 'E',
          content: `Archaeological discoveries reveal that pottery was produced on a scale large enough to suggest the presence of professional potters, and is another indicator of the prosperity of Mapungubwe society. Archaeological finds include spherical vessels with short necks, beakers, and bowls, many of which have decorative stamps. There are also ceramic discs, and whistles. In addition, cattle, sheep, and goat figurines, and small figures of highly stylised humans with elongated bodies and short limbs have been found. The figures may have been used in ceremonies as offerings to ancestors, but their precise function is not known. Other discoveries include small jewellery items made from locally sourced copper.`,
        },
        {
          id: 'c21-t2-p2-F',
          label: 'F',
          content: `Beautifully decorated artefacts made of gold have also been found at Mapungubwe. A type of decoration, found nowhere else except Great Zimbabwe, involved the crafting of gold into small rectangular sheets and carving geometrical patterns into it. These sheets were then used to cover wooden objects (which have not survived) using small tacks, also made of gold. One such object that has been discovered may have been a sceptre, while additional evidence of local gold-working is a rhinoceros figurine made from small hammered sheets, and thousands of small gold beads. These objects were all found at the royal burial site and date to c. 1150. They are the first known indicators that gold had an intrinsic value of its own (as opposed to that of a currency) in southern Africa.`,
        },
        {
          id: 'c21-t2-p2-G',
          label: 'G',
          content: `The kingdom of Mapungubwe was already in decline by the late 13th century, probably because overpopulation placed too much stress on local resources, a situation that may have been brought to a crisis point by a series of droughts. Trade routes may also have shifted northwards. Certainly, the areas that now prospered were to the north, such as Great Zimbabwe.`,
        },
      ],
    },
    {
      id: 'c21-t2-p3',
      passageNumber: 3,
      title: 'Artificial Intelligence',
      subtitle: 'You should spend about 20 minutes on Questions 27-40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c21-t2-p3-1',
          label: '1',
          content: `In many countries in the West, hysteria about the future of artificial intelligence (AI) is everywhere. There seems to be no shortage of sensationalist news about how AI could cure diseases, accelerate human innovation and improve human creativity. Just looking at the media headlines, you might think that we are already living in a future where AI has infiltrated every aspect of society.`,
        },
        {
          id: 'c21-t2-p3-2',
          label: '2',
          content: `While it is undeniable that AI has opened up a wealth of promising opportunities, it has also led to the emergence of a mindset that can be best described as 'AI solutionism'. This is the philosophy that, given enough data, machine learning algorithms can solve all of humanity's problems. But, in fact, instead of supporting AI progress, this mindset actually jeopardises the value of machine intelligence by disregarding important AI safety principles and setting unrealistic expectations about what AI can really do for humanity.`,
        },
        {
          id: 'c21-t2-p3-3',
          label: '3',
          content: `In only a few years, AI solutionism has made its way from the technology evangelists' mouths in Silicon Valley in California to the minds of government officials and policymakers around the world. The pendulum has swung from the dystopian notion that AI will destroy humanity to the utopian belief that our algorithmic saviour is here.`,
        },
        {
          id: 'c21-t2-p3-4',
          label: '4',
          content: `We are now seeing governments pledge support to national AI initiatives and compete in a technological race to dominate the burgeoning machine-learning sector. While many politicians proclaim the transformative effects of the coming 'AI revolution', they fail to realise the complexity around deploying advanced machine learning systems in the real world.`,
        },
        {
          id: 'c21-t2-p3-5',
          label: '5',
          content: `One of the most promising varieties of AI technologies are neural networks. This form of machine learning is loosely modelled on the neuronal structure of the human brain, but on a much smaller scale. But what many politicians do not understand is that simply adding a neural network to a problem will not automatically mean that you'll find a solution. Similarly, adding a neural network to a system of government does not mean it will be instantaneously more inclusive or fair.`,
        },
        {
          id: 'c21-t2-p3-6',
          label: '6',
          content: `AI systems need a lot of data to function, but the public sector typically does not have the appropriate data infrastructure to support advanced machine learning. Most of the data remains stored in offline archives. The few digitised sources of data that exist tend to be buried in bureaucracy. More often than not, data is spread across different government departments that each require special permissions to be accessed. Above all, the public sector typically lacks the human talent with the right technological capabilities to fully reap the benefits of machine intelligence.`,
        },
        {
          id: 'c21-t2-p3-7',
          label: '7',
          content: `For these reasons, the sensationalism over AI has attracted many critics. Stuart Russell, a professor of computer science at the University of California, Berkeley, has long advocated a more sensible and realistic approach that focuses on simple everyday applications of AI instead of the hypothetical takeover by super-intelligent robots. Similarly, Rodney Brooks, professor of robotics at Massachusetts Institute of Technology, writes that 'almost all innovations in robotics and AI take far, far, longer to be really widely deployed than people in the field and outside the field imagine'.`,
        },
        {
          id: 'c21-t2-p3-8',
          label: '8',
          content: `One of the many difficulties in deploying machine learning systems is that AI is extremely susceptible to adversarial attacks. This means that a malicious AI can target another AI to make it behave in a certain way, such as forcing it to make wrong predictions. Many researchers have warned against the rolling out of AI without appropriate security standards and defence mechanisms. Still, AI security remains an often overlooked topic when machine learning systems are installed.`,
        },
        {
          id: 'c21-t2-p3-9',
          label: '9',
          content: `If we are to reap the benefits and minimise the potential harms of AI, we must start thinking about how machine learning can be meaningfully applied to specific areas of government, business and society. This means we need to have a discussion about AI ethics and the distrust that many people have towards machine learning.`,
        },
        {
          id: 'c21-t2-p3-10',
          label: '10',
          content: `Most importantly, we need to be aware of the limitations of AI and where people still need to take the lead. Instead of painting an unrealistic picture of the power of AI, it is important to take a step back and separate the actual technological capabilities of AI from fantasy.`,
        },
        {
          id: 'c21-t2-p3-11',
          label: '11',
          content: `The medical profession has also recognised the drawbacks to AI. The IBM Watson for Oncology programme was a piece of AI that was meant to help doctors treat cancer. Even though it was developed to deliver the best recommendations, human experts found it hard to trust the machine. As a result, the AI programme was abandoned in most hospitals where it was trialled.`,
        },
        {
          id: 'c21-t2-p3-12',
          label: '12',
          content: `Similar difficulties arose in the legal domain when algorithms were used in courts in the US to sentence criminals. An algorithm calculated risk assessment scores and advised judges on the sentencing. The system was found to amplify structural racial discrimination and was later abandoned.`,
        },
        {
          id: 'c21-t2-p3-13',
          label: '13',
          content: `There are some crucial lessons here for everyone aiming to boost investments in national AI programmes. These examples demonstrate that there is no AI solution for everything. Using AI simply for the sake of AI may not always be productive or useful, and not every issue is best addressed by applying machine intelligence to it. All solutions come with a cost and not everything that can be automated should be.`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // -------------------------------------------------------------
    // PASSAGE 1: Questions 1–5 (Table Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g1',
      passageId: 'c21-t2-p1',
      questionType: 'table_completion',
      title: 'Questions 1–5',
      instructions: 'Complete the table below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–5 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 5,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      tableData: {
        headers: ['Subject', 'Research findings', 'Comment'],
        rows: [
          {
            cells: [
              { content: 'Humans' },
              {
                content: '• humans experience REM sleep and non-REM sleep\n• in REM sleep, the eyes and muscles move',
              },
              { content: '' },
            ],
          },
          {
            cells: [
              { content: '[[1]]', isGap: true, questionNumber: 1 },
              { content: '• similar brain patterns were observed when active and sleeping' },
              { content: 'indicative of dreaming' },
            ],
          },
          {
            cells: [
              { content: 'Pigeons' },
              {
                content: '• when sleeping, pigeons displayed activity in parts of the brain that deal with [[2]] input',
                isGap: true,
                questionNumber: 2,
              },
              { content: 'may have been dreaming of flying' },
            ],
          },
          {
            cells: [
              { content: 'Whales and dolphins' },
              {
                content: "• still have [[3]] their brain awake when they sleep\n• don't experience REM sleep, as this could affect their sensitivity to [[4]]",
                isGap: true,
              },
              {
                content: 'their dreams are probably not very [[5]]',
                isGap: true,
                questionNumber: 5,
              },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c21-t2-q1',
          questionNumber: 1,
          prompt: 'similar brain patterns were observed when active and sleeping — ________',
          answerKey: 'rats',
          acceptedAlternatives: ['rats', 'rat'],
          explanation: 'Paragraph 2: "researchers compared the brain patterns of rats running through a maze when awake with their brain patterns during REM sleep. They found the patterns were very similar and concluded that the sleeping rats were dreaming about going through the maze."',
          evidenceQuote: 'researchers compared the brain patterns of rats running through a maze when awake with their brain patterns during REM sleep. They found the patterns were very similar and concluded that the sleeping rats were dreaming',
          paragraphRef: '2',
          whyCorrect: 'Paragraph 2 confirms that researchers observed similar brain patterns in rats when running through a maze and during REM sleep.',
          whyIncorrect: 'Other species such as pigeons, whales, or dolphins relate to different findings; the maze pattern study was specifically conducted on rats.',
          commonTrap: 'Look for the subject whose active and sleeping brain patterns were compared in the maze experiment.',
        },
        {
          id: 'c21-t2-q2',
          questionNumber: 2,
          prompt: 'when sleeping, pigeons displayed activity in parts of the brain that deal with ________ input',
          answerKey: 'visual',
          acceptedAlternatives: ['visual'],
          explanation: 'Paragraph 3: "REM sleep activity was high in brain regions involved in processing visual information, especially images related to physical activities such as flying..."',
          evidenceQuote: 'REM sleep activity was high in brain regions involved in processing visual information',
          paragraphRef: '3',
          whyCorrect: 'The text states activity was concentrated in brain regions responsible for processing visual information ("visual input").',
          whyIncorrect: '"Flying" is the physical activity depicted in the images, not the sensory input processed by the brain region.',
          commonTrap: '"Visual information" in the text directly corresponds to "visual input" in the table.',
        },
        {
          id: 'c21-t2-q3',
          questionNumber: 3,
          prompt: 'Whales and dolphins — still have ________ their brain awake when they sleep',
          answerKey: 'half',
          acceptedAlternatives: ['half'],
          explanation: 'Paragraph 4: "These include whales and dolphins, which do not shut down their entire brain when they sleep, but only half of it, keeping the rest awake."',
          evidenceQuote: 'do not shut down their entire brain when they sleep, but only half of it, keeping the rest awake',
          paragraphRef: '4',
          whyCorrect: 'The passage explicitly says they shut down "only half of it, keeping the rest awake".',
          whyIncorrect: 'General words like "part" or "some" violate the exact wording requirement (ONE WORD ONLY from passage: "half").',
          commonTrap: 'Look for the exact quantitative word used to specify what fraction of the brain remains awake.',
        },
        {
          id: 'c21-t2-q4',
          questionNumber: 4,
          prompt: "Whales and dolphins — don't experience REM sleep, as this could affect their sensitivity to ________",
          answerKey: 'temperature',
          acceptedAlternatives: ['temperature'],
          explanation: 'Paragraph 4: "It\'s thought that they don\'t experience REM sleep because during REM sleep animals are more vulnerable to extremes of temperature."',
          evidenceQuote: 'during REM sleep animals are more vulnerable to extremes of temperature',
          paragraphRef: '4',
          whyCorrect: 'The text explains they avoid REM sleep because animals are more vulnerable to extremes of temperature.',
          whyIncorrect: '"Extremes" does not identify the environmental factor; "temperature" is the precise factor.',
          commonTrap: '"More vulnerable to" in the text directly paraphrases "affect their sensitivity to".',
        },
        {
          id: 'c21-t2-q5',
          questionNumber: 5,
          prompt: 'Whales and dolphins — their dreams are probably not very ________',
          answerKey: 'vivid',
          acceptedAlternatives: ['vivid'],
          explanation: 'Paragraph 4: "They also show no sign of REM sleep, suggesting that they may only experience non-REM dreams, which are less vivid."',
          evidenceQuote: 'suggesting that they may only experience non-REM dreams, which are less vivid',
          paragraphRef: '4',
          whyCorrect: 'The text notes non-REM dreams are "less vivid", meaning their dreams are not very vivid.',
          whyIncorrect: '"Complex" describes inner lives earlier in the paragraph, not the quality of their dreams.',
          commonTrap: '"Less vivid" is paraphrased by the prompt as "probably not very vivid".',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 1: Questions 6–13 (TRUE / FALSE / NOT GIVEN)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g2',
      passageId: 'c21-t2-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 6–13',
      instructions: 'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 6–13 on your answer sheet, write:\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 6,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c21-t2-q6',
          questionNumber: 6,
          prompt: 'Dreaming about past experiences helps us to create lasting memories of them.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation: 'Paragraph 5 confirms: "Growing evidence from birds and mammals suggests that REM sleep and dreaming are important for forming memories and learning. It is believed that when events are replayed in dreams, this helps to integrate memories into longer-term storage."',
          evidenceQuote: 'when events are replayed in dreams, this helps to integrate memories into longer-term storage',
          paragraphRef: '5',
          whyCorrect: '"Events are replayed in dreams" corresponds to dreaming about past experiences, and "integrate memories into longer-term storage" matches creating lasting memories.',
          whyIncorrect: 'The text directly supports this statement, ruling out FALSE and NOT GIVEN.',
          commonTrap: 'Connecting "replaying events" with "past experiences" and "longer-term storage" with "lasting memories".',
        },
        {
          id: 'c21-t2-q7',
          questionNumber: 7,
          prompt: 'It is now possible to tell what type of dream a dog is having.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation: 'Paragraph 6 contradicts this: "We are quick to interpret the twitching limbs and quiet barks of sleeping dogs, but the truth is that we don\'t know if there is an internal experience of chasing rabbits that comes along with that."',
          evidenceQuote: "the truth is that we don't know if there is an internal experience of chasing rabbits that comes along with that",
          paragraphRef: '6',
          whyCorrect: 'The author explicitly points out "the truth is that we don\'t know", directly contradicting that it is now possible to tell.',
          whyIncorrect: 'This is not NOT GIVEN because the author explicitly refutes our ability to know.',
          commonTrap: 'Mistaking outward behaviors like twitching and barking for evidence that scientists can tell what dogs are dreaming.',
        },
        {
          id: 'c21-t2-q8',
          questionNumber: 8,
          prompt: "David Scheel's documentary was influential on other research into the sleeping patterns of octopuses.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation: 'Paragraphs 7 and 8 mention that Scheel filmed Heidi for a documentary and later comment on another octopus study (Costello), but never state whether Scheel\'s documentary influenced other research.',
          evidenceQuote: 'In 2019, while making a documentary, David Scheel of Alaska Pacific University in the USA housed an octopus named Heidi...',
          paragraphRef: '7',
          whyCorrect: 'The passage mentions the documentary, but provides no information regarding its influence on subsequent scientific research.',
          whyIncorrect: 'Even though another study is mentioned in paragraph 8, no causal or influential link is stated.',
          commonTrap: 'Assuming that because two octopus studies are mentioned in succession, the first must have inspired the second.',
        },
        {
          id: 'c21-t2-q9',
          questionNumber: 9,
          prompt: 'While it was asleep, the octopus called Costello reacted as if it was hunting.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation: 'Paragraph 8 states Costello "thrashed around, extended his mantle as if trying to make himself look bigger, and squirted ink as though he were being attacked by a predator" — reacting as prey being attacked, not hunting.',
          evidenceQuote: 'squirted ink as though he were being attacked by a predator',
          paragraphRef: '8',
          whyCorrect: 'Costello displayed defensive behaviors against an attacking predator, which directly contradicts the claim that he reacted as if hunting.',
          whyIncorrect: 'Heidi in paragraph 7 acted as though pursuing a crab (hunting), whereas Costello was reacting to a nightmare of being attacked.',
          commonTrap: 'Conflating the two octopuses: Heidi was behaving as though hunting, while Costello was reacting to being attacked.',
        },
        {
          id: 'c21-t2-q10',
          questionNumber: 10,
          prompt: "Scheel believes more research into octopuses' dreams should be carried out.",
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation: 'Paragraph 8 states: "The nightmare study is intriguing, says Scheel, but is only based on one animal. He argues that as well as outward behaviour, brain imaging is needed to show that the octopuses are replaying sequences of activities from their waking lives in dreams."',
          evidenceQuote: 'He argues that as well as outward behaviour, brain imaging is needed',
          paragraphRef: '8',
          whyCorrect: 'Scheel arguing that brain imaging "is needed" beyond single-animal behavioral observation confirms he believes further research should be conducted.',
          whyIncorrect: 'Stating that brain imaging is needed clearly indicates an endorsement of further investigation.',
          commonTrap: 'Recognizing that calling for additional methodology ("brain imaging is needed") means advocating for more research.',
        },
        {
          id: 'c21-t2-q11',
          questionNumber: 11,
          prompt: 'We may soon be able to share the dreams of other human beings.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation: 'Paragraph 9 directly contradicts this: "The trouble is that we will never be able to experience any animal\'s dreams. That goes for other humans\' dreams too."',
          evidenceQuote: "The trouble is that we will never be able to experience any animal's dreams. That goes for other humans' dreams too.",
          paragraphRef: '9',
          whyCorrect: 'The author states "we will never be able to experience... other humans\' dreams", which directly contradicts the statement.',
          whyIncorrect: '"Never" directly refutes any claim that we may soon be able to share dreams.',
          commonTrap: 'Contrast the definitive impossibility word "never" with "may soon".',
        },
        {
          id: 'c21-t2-q12',
          questionNumber: 12,
          prompt: 'Hearing may be an important part of the dreams of some animals.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation: 'Paragraph 9 discusses vision in humans, smell in dogs, and vibrations in spiders, but makes no mention of hearing in the dreams of any animal.',
          evidenceQuote: 'Dogs primarily navigate the world using smell while spiders rely much more on vibrations.',
          paragraphRef: '9',
          whyCorrect: 'The passage does not mention auditory experiences or hearing in animal dreams.',
          whyIncorrect: 'Do not extrapolate from dogs barking in paragraph 6; that describes outward vocalization, not auditory dreamscapes.',
          commonTrap: 'Assuming hearing is mentioned because several other sensory modalities are listed.',
        },
        {
          id: 'c21-t2-q13',
          questionNumber: 13,
          prompt: 'Interest in the reasons why humans dream has increased greatly in recent times.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation: 'Paragraph 10 says understanding animal dreams "might shed light on the true purpose of our own dreams", but offers no information about historical or recent trends in interest.',
          evidenceQuote: 'better understanding of these purposes might shed light on the true purpose of our own dreams',
          paragraphRef: '10',
          whyCorrect: 'The text highlights a potential scientific insight, but makes no assertion about whether general interest has grown recently.',
          whyIncorrect: 'A future benefit of research does not confirm a trend in public or academic interest.',
          commonTrap: 'Conflating scientific promise with a reported increase in popularity or interest.',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 2: Questions 14–19 (Matching Information)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g3',
      passageId: 'c21-t2-p2',
      questionType: 'matching_information',
      title: 'Questions 14–19',
      instructions: 'Reading Passage 2 has seven paragraphs, A–G.\nWhich paragraph contains the following information?\nWrite the correct letter, A–G, in boxes 14–19 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 19,
      optionsList: [
        { key: 'A', text: 'Paragraph A' },
        { key: 'B', text: 'Paragraph B' },
        { key: 'C', text: 'Paragraph C' },
        { key: 'D', text: 'Paragraph D' },
        { key: 'E', text: 'Paragraph E' },
        { key: 'F', text: 'Paragraph F' },
        { key: 'G', text: 'Paragraph G' },
      ],
      questions: [
        {
          id: 'c21-t2-q14',
          questionNumber: 14,
          prompt: 'a mention of the uncertainty regarding the purpose of certain objects',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation: 'Paragraph E states: "The figures may have been used in ceremonies as offerings to ancestors, but their precise function is not known."',
          evidenceQuote: 'their precise function is not known',
          paragraphRef: 'E',
          whyCorrect: '"Their precise function is not known" directly matches "uncertainty regarding the purpose".',
          whyIncorrect: 'Paragraph F describes specific known/inferred uses for gold objects (sceptre, covering objects), whereas E explicitly notes unknown function.',
          commonTrap: '"Function" is synonymous with "purpose", and "not known" expresses "uncertainty".',
        },
        {
          id: 'c21-t2-q15',
          questionNumber: 15,
          prompt: 'the likelihood that a climatic factor increased the problems Mapungubwe faced',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: 'Paragraph G states: "a situation that may have been brought to a crisis point by a series of droughts."',
          evidenceQuote: 'a situation that may have been brought to a crisis point by a series of droughts',
          paragraphRef: 'G',
          whyCorrect: 'Droughts represent a climatic factor that brought existing overpopulation and resource stress to a crisis point.',
          whyIncorrect: 'No other paragraph mentions climate, weather, or droughts.',
          commonTrap: 'Connecting "droughts" to "climatic factor".',
        },
        {
          id: 'c21-t2-q16',
          questionNumber: 16,
          prompt: "a mention of the location where members of the king's family are thought to have lived",
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: 'Paragraph C states: "There were some grander residences dotted around the outskirts of Babandyanalo, and these probably belonged to male relatives of the king."',
          evidenceQuote: 'these probably belonged to male relatives of the king',
          paragraphRef: 'C',
          whyCorrect: '"Male relatives of the king" are members of his family, and their location is described as grander residences around Babandyanalo.',
          whyIncorrect: 'Paragraph B describes where the king himself and advisers lived (hilltop stone enclosure), not his relatives.',
          commonTrap: "Distinguishing the king's own residence (Paragraph B) from the residence of his family members/relatives (Paragraph C).",
        },
        {
          id: 'c21-t2-q17',
          questionNumber: 17,
          prompt: 'a reference to people who brought goods by ship',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation: 'Paragraph D states: "merchants travelling from India by sea."',
          evidenceQuote: 'merchants travelling from India by sea',
          paragraphRef: 'D',
          whyCorrect: '"Merchants travelling from India by sea" refers directly to people bringing trade goods by ship.',
          whyIncorrect: 'Paragraph A mentions cattle and crop trade, but does not mention ships or sea traders.',
          commonTrap: '"Travelling by sea" implies maritime transport and ships.',
        },
        {
          id: 'c21-t2-q18',
          questionNumber: 18,
          prompt: 'an estimate of the size to which the Mapungubwe community grew',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: 'Paragraph B states: "The total population of Mapungubwe at its peak in the mid-13th century was around 5,000 people."',
          evidenceQuote: 'The total population of Mapungubwe at its peak in the mid-13th century was around 5,000 people.',
          paragraphRef: 'B',
          whyCorrect: '"Around 5,000 people" is an explicit estimate of the community\'s population size at its peak.',
          whyIncorrect: 'Paragraph A discusses large cattle herds, not human community size.',
          commonTrap: 'Look for population numbers representing community size.',
        },
        {
          id: 'c21-t2-q19',
          questionNumber: 19,
          prompt: 'a mention of agricultural produce being exchanged for other items',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: 'Paragraph A states: "cattle herding and other types of farming brought plenty of food and a surplus that could be traded for needed goods."',
          evidenceQuote: 'cattle herding and other types of farming brought plenty of food and a surplus that could be traded for needed goods',
          paragraphRef: 'A',
          whyCorrect: '"A surplus [from farming] that could be traded for needed goods" directly describes agricultural produce exchanged for other items.',
          whyIncorrect: 'Paragraph D describes trade in gold, copper, ivory, and glass beads, not agricultural food produce.',
          commonTrap: '"Farming brought plenty of food and a surplus that could be traded" maps to agricultural produce exchange.',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 2: Questions 20 and 21 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g4',
      passageId: 'c21-t2-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 20 and 21',
      instructions: 'Choose TWO letters, A–E.\nWrite the correct letters in boxes 20 and 21 on your answer sheet.\nThe archaeological record reveals information about gold and the kingdom of Mapungubwe. Which TWO pieces of information are mentioned by the writer?',
      startQuestionNumber: 20,
      endQuestionNumber: 21,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'Not everyone in Mapungubwe used gold as a form of payment.' },
        { key: 'B', text: 'Items of gold were placed close to where Mapungubwe kings were buried.' },
        { key: 'C', text: 'The most valuable item discovered in Mapungubwe was a sceptre made of gold.' },
        { key: 'D', text: 'The way gold was decorated in Mapungubwe was also practised in another kingdom.' },
        { key: 'E', text: 'Working with gold was a respected occupation in the Mapungubwe community.' },
      ],
      questions: [
        {
          id: 'c21-t2-q20',
          questionNumber: 20,
          prompt: 'Which TWO pieces of information about gold and the kingdom of Mapungubwe are mentioned by the writer? (Choose TWO: B, D)',
          options: [
            { key: 'A', text: 'Not everyone in Mapungubwe used gold as a form of payment.' },
            { key: 'B', text: 'Items of gold were placed close to where Mapungubwe kings were buried.' },
            { key: 'C', text: 'The most valuable item discovered in Mapungubwe was a sceptre made of gold.' },
            { key: 'D', text: 'The way gold was decorated in Mapungubwe was also practised in another kingdom.' },
            { key: 'E', text: 'Working with gold was a respected occupation in the Mapungubwe community.' },
          ],
          answerKey: ['B', 'D'],
          explanation: 'B is supported by Paragraph F ("These objects were all found at the royal burial site"). D is supported by Paragraph F ("A type of decoration, found nowhere else except Great Zimbabwe, involved the crafting of gold into small rectangular sheets...").',
          evidenceQuote: 'These objects were all found at the royal burial site... A type of decoration, found nowhere else except Great Zimbabwe',
          paragraphRef: 'F',
          whyCorrect: 'Paragraph F confirms gold objects were found at the royal burial site (B) and the decorative technique was also found in Great Zimbabwe (D).',
          whyIncorrect: 'A is incorrect because the passage says gold was valued for its own sake rather than as a currency. C is unsupported (the sceptre is not described as the most valuable). E is not mentioned.',
          commonTrap: 'Option A confuses "intrinsic value (as opposed to that of a currency)" with partial currency usage.',
        },
        {
          id: 'c21-t2-q21',
          questionNumber: 21,
          prompt: 'Which TWO pieces of information about gold and the kingdom of Mapungubwe are mentioned by the writer? (Choose TWO: B, D)',
          options: [
            { key: 'A', text: 'Not everyone in Mapungubwe used gold as a form of payment.' },
            { key: 'B', text: 'Items of gold were placed close to where Mapungubwe kings were buried.' },
            { key: 'C', text: 'The most valuable item discovered in Mapungubwe was a sceptre made of gold.' },
            { key: 'D', text: 'The way gold was decorated in Mapungubwe was also practised in another kingdom.' },
            { key: 'E', text: 'Working with gold was a respected occupation in the Mapungubwe community.' },
          ],
          answerKey: ['B', 'D'],
          explanation: 'B is supported by Paragraph F ("These objects were all found at the royal burial site"). D is supported by Paragraph F ("A type of decoration, found nowhere else except Great Zimbabwe, involved the crafting of gold into small rectangular sheets...").',
          evidenceQuote: 'These objects were all found at the royal burial site... A type of decoration, found nowhere else except Great Zimbabwe',
          paragraphRef: 'F',
          whyCorrect: 'Paragraph F confirms gold items were located at the royal burial site (B) and that the unique sheet decoration was also shared with Great Zimbabwe (D).',
          whyIncorrect: 'A, C, and E are either contrary to the passage or not mentioned.',
          commonTrap: 'Assuming gold was used as money; the passage explicitly notes it had intrinsic value "as opposed to that of a currency".',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 2: Questions 22–26 (Summary Completion - Words)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g5',
      passageId: 'c21-t2-p2',
      questionType: 'summary_completion_words',
      title: 'Questions 22–26',
      instructions: 'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 22–26 on your answer sheet.',
      startQuestionNumber: 22,
      endQuestionNumber: 26,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Archaeological discoveries

The Mapungubwe community's [[22]] is indicated by the amount of professionally made pottery discovered at the site. Many of these objects, such as beakers and bowls, are highly decorated and have been marked with stamps. Other finds include round ceramic objects, [[23]] and figures of various animals, as well as models of people with stretched [[24]]. It is possible that these had a role in ceremonies to honour [[25]]. In addition, pieces of [[26]] made from a local metal have been found at the site.`,
      questions: [
        {
          id: 'c21-t2-q22',
          questionNumber: 22,
          prompt: "The Mapungubwe community's ________ is indicated by the amount of professionally made pottery discovered at the site.",
          answerKey: 'prosperity',
          acceptedAlternatives: ['prosperity'],
          explanation: 'Paragraph E: "pottery was produced on a scale large enough to suggest the presence of professional potters, and is another indicator of the prosperity of Mapungubwe society."',
          evidenceQuote: 'another indicator of the prosperity of Mapungubwe society',
          paragraphRef: 'E',
          whyCorrect: 'The passage explicitly says professional pottery is "another indicator of the prosperity of Mapungubwe society".',
          whyIncorrect: 'Words like "wealth" or "power" do not appear in this sentence; ONE WORD ONLY requires "prosperity".',
          commonTrap: 'Look for the exact noun possessed by the society that is indicated by pottery.',
        },
        {
          id: 'c21-t2-q23',
          questionNumber: 23,
          prompt: 'Other finds include round ceramic objects, ________ and figures of various animals...',
          answerKey: 'whistles',
          acceptedAlternatives: ['whistles', 'whistle'],
          explanation: 'Paragraph E: "There are also ceramic discs, and whistles. In addition, cattle, sheep, and goat figurines..."',
          evidenceQuote: 'There are also ceramic discs, and whistles.',
          paragraphRef: 'E',
          whyCorrect: '"Round ceramic objects" paraphrases "ceramic discs", followed immediately by "whistles".',
          whyIncorrect: '"Discs" is already paraphrased as "round ceramic objects".',
          commonTrap: 'Recognizing that "ceramic discs" is already represented by "round ceramic objects".',
        },
        {
          id: 'c21-t2-q24',
          questionNumber: 24,
          prompt: '...as well as models of people with stretched ________',
          answerKey: 'bodies',
          acceptedAlternatives: ['bodies', 'body'],
          explanation: 'Paragraph E: "small figures of highly stylised humans with elongated bodies and short limbs have been found."',
          evidenceQuote: 'small figures of highly stylised humans with elongated bodies',
          paragraphRef: 'E',
          whyCorrect: '"Models of people" paraphrases "figures of highly stylised humans", and "stretched" paraphrases "elongated", making "bodies" the target noun.',
          whyIncorrect: '"Limbs" were short, not stretched/elongated.',
          commonTrap: '"Elongated" is synonymous with "stretched".',
        },
        {
          id: 'c21-t2-q25',
          questionNumber: 25,
          prompt: 'It is possible that these had a role in ceremonies to honour ________',
          answerKey: 'ancestors',
          acceptedAlternatives: ['ancestors', 'ancestor'],
          explanation: 'Paragraph E: "The figures may have been used in ceremonies as offerings to ancestors, but their precise function is not known."',
          evidenceQuote: 'used in ceremonies as offerings to ancestors',
          paragraphRef: 'E',
          whyCorrect: '"Offerings to ancestors" in ceremonies matches "ceremonies to honour ancestors".',
          whyIncorrect: '"Kings" or "chiefs" are not mentioned as the recipients of these ceremonial offerings.',
          commonTrap: 'Identify the entity receiving the offerings in the ceremonies.',
        },
        {
          id: 'c21-t2-q26',
          questionNumber: 26,
          prompt: 'In addition, pieces of ________ made from a local metal have been found at the site.',
          answerKey: 'jewellery',
          acceptedAlternatives: ['jewellery', 'jewelry'],
          explanation: 'Paragraph E: "Other discoveries include small jewellery items made from locally sourced copper."',
          evidenceQuote: 'small jewellery items made from locally sourced copper',
          paragraphRef: 'E',
          whyCorrect: '"Small jewellery items" matches "pieces of jewellery", made from locally sourced copper ("a local metal").',
          whyIncorrect: '"Copper" is the metal itself, not the pieces made from it.',
          commonTrap: 'Entering "copper" instead of the finished artefact type ("jewellery").',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 3: Questions 27–29 (Multiple Choice Single)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g6',
      passageId: 'c21-t2-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–29',
      instructions: 'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–29 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 29,
      questions: [
        {
          id: 'c21-t2-q27',
          questionNumber: 27,
          prompt: 'What is the writer doing in the first paragraph?',
          options: [
            { key: 'A', text: 'predicting the future impact of AI' },
            { key: 'B', text: 'describing a public perception of AI' },
            { key: 'C', text: 'outlining some possible benefits of AI' },
            { key: 'D', text: 'highlighting the breadth of the influence of AI' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: 'Paragraph 1 focuses on media "hysteria" and "sensationalist news", concluding "Just looking at the media headlines, you might think that we are already living in a future where AI has infiltrated every aspect of society."',
          evidenceQuote: 'Just looking at the media headlines, you might think that we are already living in a future where AI has infiltrated every aspect of society.',
          paragraphRef: '1',
          whyCorrect: 'The paragraph describes media headlines and what people might think ("public perception") rather than validated facts or author predictions.',
          whyIncorrect: 'The author is not making predictions (A), confirming benefits (C), or endorsing the extent of AI influence (D); rather, the tone emphasizes hype.',
          commonTrap: 'Do not take sensationalist headlines as the author\'s own claims about the future.',
        },
        {
          id: 'c21-t2-q28',
          questionNumber: 28,
          prompt: 'When discussing AI solutionism in the second paragraph, the writer',
          options: [
            { key: 'A', text: 'points out a risk involved.' },
            { key: 'B', text: 'specifies its probable origins.' },
            { key: 'C', text: 'mentions its chief supporters.' },
            { key: 'D', text: 'weighs up some pros and cons.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: 'Paragraph 2 highlights that "instead of supporting AI progress, this mindset actually jeopardises the value of machine intelligence by disregarding important AI safety principles and setting unrealistic expectations..."',
          evidenceQuote: 'this mindset actually jeopardises the value of machine intelligence by disregarding important AI safety principles',
          paragraphRef: '2',
          whyCorrect: 'Saying that solutionism "jeopardises the value of machine intelligence" and disregards safety principles explicitly points out a danger/risk.',
          whyIncorrect: 'Origins and supporters (Silicon Valley) appear in paragraph 3, not 2. Solutionism itself is not given pros and cons.',
          commonTrap: 'Notice the question specifies paragraph 2; Silicon Valley origins appear in paragraph 3.',
        },
        {
          id: 'c21-t2-q29',
          questionNumber: 29,
          prompt: 'In the fourth paragraph, the writer suggests that many politicians may',
          options: [
            { key: 'A', text: 'have failed to appreciate the true potential of AI initiatives.' },
            { key: 'B', text: 'have misunderstood the function of the machine-learning sector.' },
            { key: 'C', text: 'be unaware of the challenges of implementing national AI initiatives.' },
            { key: 'D', text: 'be too keen to enter the race to dominate the machine-learning sector.' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: 'Paragraph 4 states: "While many politicians proclaim the transformative effects of the coming \'AI revolution\', they fail to realise the complexity around deploying advanced machine learning systems in the real world."',
          evidenceQuote: 'they fail to realise the complexity around deploying advanced machine learning systems in the real world',
          paragraphRef: '4',
          whyCorrect: '"Fail to realise the complexity around deploying" directly corresponds to being "unaware of the challenges of implementing".',
          whyIncorrect: 'Politicians are overly enthusiastic about AI potential (contradicting A). While they compete in a race, the critical flaw highlighted is their failure to grasp implementation complexities.',
          commonTrap: 'Look for what the writer explicitly says politicians "fail to realise".',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 3: Questions 30–35 (Summary Completion - Options)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g7',
      passageId: 'c21-t2-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 30–35',
      instructions: 'Complete the summary using the list of words, A–I, below.\nWrite the correct letter, A–I, in boxes 30–35 on your answer sheet.',
      startQuestionNumber: 30,
      endQuestionNumber: 35,
      optionsList: [
        { key: 'A', text: 'reliability' },
        { key: 'B', text: 'funding' },
        { key: 'C', text: 'skills' },
        { key: 'D', text: 'prejudices' },
        { key: 'E', text: 'computers' },
        { key: 'F', text: 'equality' },
        { key: 'G', text: 'framework' },
        { key: 'H', text: 'confidentiality' },
        { key: 'I', text: 'approval' },
      ],
      contentWithGaps: `AI in government, medicine and the law

Neural networks are a promising area of AI technology for governments. However, many politicians overestimate their capabilities, believing that the mere addition of a neural network will produce solutions and promote [[30]].

Most public sector organisations have not set up the necessary [[31]] to manage the huge amount of data required to enable AI to function. Complex bureaucracy is another issue, as each person involved needs [[32]] to access the relevant data, which is often spread across different departments. But the main problem is that few public sector employees have the [[33]] to take full advantage of machine intelligence.

The medical profession experimented with an AI programme, but their experts had little faith in its [[34]], and the programme was abandoned. US courts also abandoned the use of algorithms when it was found that these reflected and magnified the existing [[35]] within the legal profession.`,
      questions: [
        {
          id: 'c21-t2-q30',
          questionNumber: 30,
          prompt: '...believing that the mere addition of a neural network will produce solutions and promote ________',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation: 'Paragraph 5 states: "adding a neural network to a system of government does not mean it will be instantaneously more inclusive or fair." Inclusivity and fairness correspond to "equality" (F).',
          evidenceQuote: 'does not mean it will be instantaneously more inclusive or fair',
          paragraphRef: '5',
          whyCorrect: '"More inclusive or fair" is conceptually matched with "equality" (F).',
          whyIncorrect: 'Options like "funding" or "computers" do not match the ethical qualities of fairness and inclusivity.',
          commonTrap: 'Connecting "fair" and "inclusive" to the noun "equality".',
        },
        {
          id: 'c21-t2-q31',
          questionNumber: 31,
          prompt: 'Most public sector organisations have not set up the necessary ________ to manage the huge amount of data required...',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: 'Paragraph 6 states: "the public sector typically does not have the appropriate data infrastructure to support advanced machine learning." Data infrastructure matches "framework" (G).',
          evidenceQuote: 'the public sector typically does not have the appropriate data infrastructure',
          paragraphRef: '6',
          whyCorrect: '"Data infrastructure" directly corresponds to "framework" (G).',
          whyIncorrect: '"Computers" (E) is hardware, whereas infrastructure to manage and structure data across departments is a "framework".',
          commonTrap: 'Recognizing "data infrastructure" as equivalent to "framework".',
        },
        {
          id: 'c21-t2-q32',
          questionNumber: 32,
          prompt: '...as each person involved needs ________ to access the relevant data, which is often spread across different departments.',
          answerKey: 'I',
          acceptedAlternatives: ['I'],
          explanation: 'Paragraph 6 states: "data is spread across different government departments that each require special permissions to be accessed." Special permissions correspond to "approval" (I).',
          evidenceQuote: 'government departments that each require special permissions to be accessed',
          paragraphRef: '6',
          whyCorrect: '"Special permissions" is paraphrased by "approval" (I).',
          whyIncorrect: '"Confidentiality" is a status/obligation, not the required authorization needed to access records.',
          commonTrap: '"Special permissions" corresponds to "approval".',
        },
        {
          id: 'c21-t2-q33',
          questionNumber: 33,
          prompt: 'But the main problem is that few public sector employees have the ________ to take full advantage of machine intelligence.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: 'Paragraph 6 states: "the public sector typically lacks the human talent with the right technological capabilities to fully reap the benefits..." Capabilities and talent correspond to "skills" (C).',
          evidenceQuote: 'the public sector typically lacks the human talent with the right technological capabilities',
          paragraphRef: '6',
          whyCorrect: '"Human talent with the right technological capabilities" directly matches "skills" (C).',
          whyIncorrect: 'No other option reflects personal competence or capability.',
          commonTrap: 'Paraphrase of "technological capabilities" as "skills".',
        },
        {
          id: 'c21-t2-q34',
          questionNumber: 34,
          prompt: 'The medical profession experimented with an AI programme, but their experts had little faith in its ________, and the programme was abandoned.',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: 'Paragraph 11 states: "Even though it was developed to deliver the best recommendations, human experts found it hard to trust the machine." Having little faith / hard to trust corresponds to doubts about its "reliability" (A).',
          evidenceQuote: 'human experts found it hard to trust the machine',
          paragraphRef: '11',
          whyCorrect: 'Finding it "hard to trust" recommendations equates to doubting the system\'s "reliability" (A).',
          whyIncorrect: 'Trusting recommendations relates directly to reliability, not confidentiality or funding.',
          commonTrap: 'Synonym matching between "trust" and "reliability".',
        },
        {
          id: 'c21-t2-q35',
          questionNumber: 35,
          prompt: '...when it was found that these reflected and magnified the existing ________ within the legal profession.',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation: 'Paragraph 12 states: "The system was found to amplify structural racial discrimination and was later abandoned." Racial discrimination corresponds to "prejudices" (D).',
          evidenceQuote: 'The system was found to amplify structural racial discrimination',
          paragraphRef: '12',
          whyCorrect: '"Structural racial discrimination" corresponds directly to "prejudices" (D).',
          whyIncorrect: '"Prejudices" is the only option in the word bank signifying discrimination and bias.',
          commonTrap: 'Mapping "discrimination" to "prejudices".',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 3: Questions 36–39 (YES / NO / NOT GIVEN)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g8',
      passageId: 'c21-t2-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 36–39',
      instructions: 'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 36–39 on your answer sheet, write:\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 36,
      endQuestionNumber: 39,
      questions: [
        {
          id: 'c21-t2-q36',
          questionNumber: 36,
          prompt: "Stuart Russell's proposals regarding the use of AI are impractical.",
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation: 'Paragraph 7 contradicts this: "Stuart Russell... has long advocated a more sensible and realistic approach that focuses on simple everyday applications of AI instead of the hypothetical takeover by super-intelligent robots."',
          evidenceQuote: 'advocated a more sensible and realistic approach',
          paragraphRef: '7',
          whyCorrect: 'The author endorses Russell\'s approach as "sensible and realistic", which directly contradicts "impractical".',
          whyIncorrect: 'The statement directly contradicts the author\'s view, making NO the correct answer.',
          commonTrap: '"Sensible and realistic" is the direct antonym of "impractical".',
        },
        {
          id: 'c21-t2-q37',
          questionNumber: 37,
          prompt: "Rodney Brooks' view has attracted unfair criticism from supporters of AI.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation: 'Paragraph 7 cites Rodney Brooks\' perspective on deployment timelines, but makes no mention of whether his view attracted criticism or whether any criticism was unfair.',
          evidenceQuote: 'almost all innovations in robotics and AI take far, far, longer to be really widely deployed than people in the field and outside the field imagine',
          paragraphRef: '7',
          whyCorrect: 'The passage quotes Brooks\' statement but gives no information on reactions or criticism toward him.',
          whyIncorrect: 'Although paragraph 7 mentions that AI sensationalism attracted critics, it never mentions Brooks being criticized.',
          commonTrap: 'Do not confuse the critics of AI sensationalism with critics attacking Rodney Brooks.',
        },
        {
          id: 'c21-t2-q38',
          questionNumber: 38,
          prompt: 'Nowadays, the need to protect AI systems is always taken into account when they are set up.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation: 'Paragraph 8 contradicts this: "Still, AI security remains an often overlooked topic when machine learning systems are installed."',
          evidenceQuote: 'Still, AI security remains an often overlooked topic when machine learning systems are installed.',
          paragraphRef: '8',
          whyCorrect: 'The author explicitly states security is "often overlooked" during installation, directly contradicting "always taken into account".',
          whyIncorrect: '"Often overlooked" directly negates "always taken into account".',
          commonTrap: 'Contrasting "always taken into account" with "often overlooked".',
        },
        {
          id: 'c21-t2-q39',
          questionNumber: 39,
          prompt: "In order to benefit from AI and minimise the harms, we have to explore people's concerns about its use.",
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation: 'Paragraph 9 confirms: "If we are to reap the benefits and minimise the potential harms of AI, we must start thinking about how machine learning can be meaningfully applied... This means we need to have a discussion about AI ethics and the distrust that many people have towards machine learning."',
          evidenceQuote: 'we need to have a discussion about AI ethics and the distrust that many people have towards machine learning',
          paragraphRef: '9',
          whyCorrect: 'The author asserts that achieving benefits while minimising harms requires discussing the distrust people feel (exploring their concerns).',
          whyIncorrect: 'The statement directly mirrors the author\'s explicit claim.',
          commonTrap: '"Distrust that many people have" corresponds to "people\'s concerns".',
        },
      ],
    },

    // -------------------------------------------------------------
    // PASSAGE 3: Question 40 (Multiple Choice Single)
    // -------------------------------------------------------------
    {
      id: 'c21-t2-g9',
      passageId: 'c21-t2-p3',
      questionType: 'multiple_choice_single',
      title: 'Question 40',
      instructions: 'Choose the correct letter, A, B, C or D.\nWrite the correct letter in box 40 on your answer sheet.',
      startQuestionNumber: 40,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c21-t2-q40',
          questionNumber: 40,
          prompt: 'What would be a suitable subtitle for Reading Passage 3?',
          options: [
            { key: 'A', text: 'How to make the most of what AI has to offer' },
            { key: 'B', text: 'Why AI may not be the answer to our problems' },
            { key: 'C', text: 'Why governments should not invest in AI systems' },
            { key: 'D', text: 'How AI could improve the efficiency of the public sector' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: 'The entire passage critiques "AI solutionism" — the flawed belief that machine learning can solve all human problems. Paragraph 13 concludes: "These examples demonstrate that there is no AI solution for everything. Using AI simply for the sake of AI may not always be productive or useful..."',
          evidenceQuote: 'These examples demonstrate that there is no AI solution for everything. Using AI simply for the sake of AI may not always be productive or useful, and not every issue is best addressed by applying machine intelligence to it.',
          paragraphRef: '13',
          whyCorrect: '"Why AI may not be the answer to our problems" encapsulates the main theme confronting AI solutionism.',
          whyIncorrect: 'A and D are overly optimistic guidelines not reflecting the cautionary critique. C is an extreme misreading, as the author advocates realistic, ethical use rather than a total ban on investment.',
          commonTrap: 'Avoid C ("should not invest"), which is far too radical and not supported by the balanced conclusion.',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 21 Academic Reading Test 2',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export function ingestCambridge21Test2(adminUserId?: string): {
  testId: string;
  versionId: string;
  status: string;
  totalQuestions: number;
} {
  const data = getCambridge21Test2Data();

  // Validate data integrity
  const validationErrors = validateTestVersion(data.passages, data.questionGroups);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 21 Reading Test 2 validation failed: ${validationErrors.join(', ')}`);
  }

  // Resolve author ID: supplied adminUserId, or existing admin from DB
  let resolvedAuthorId = adminUserId;
  if (!resolvedAuthorId) {
    const adminUser = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any;
    resolvedAuthorId = adminUser ? adminUser.id : 'system-seed-admin';
  }

  // Check if test already exists in SQLite
  const existingTest = db
    .prepare("SELECT id FROM reading_tests WHERE title LIKE '%Cambridge%21%Reading%Test 2%' OR title = ?")
    .get(data.title) as any;

  let testId: string;
  let versionId: string;
  const now = new Date().toISOString();

  if (existingTest) {
    testId = existingTest.id;
    console.log(`Cambridge 21 Reading Test 2 already exists (${testId}), updating to published...`);

    const existingVersion = db
      .prepare('SELECT id FROM reading_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
      .get(testId) as any;

    if (existingVersion) {
      versionId = existingVersion.id;
      db.prepare(`
        UPDATE reading_test_versions
        SET passages_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            status = 'published',
            validation_errors_json = '[]'
        WHERE id = ?
      `).run(
        JSON.stringify(data.passages),
        JSON.stringify(data.questionGroups),
        versionId
      );
    } else {
      versionId = uuidv4();
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

    db.prepare(`
      UPDATE reading_tests
      SET status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(now, testId);
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
