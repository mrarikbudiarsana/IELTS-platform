import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge17ReadingTest2Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c17-r2-p1',
      passageNumber: 1,
      title: 'The Dead Sea Scrolls',
      subtitle:
        'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c17-r2-p1-1',
          label: '1',
          content: `In late 1946 or early 1947, three Bedouin teenagers were tending their goats and sheep near the ancient settlement of Qumran, located on the northwest shore of the Dead Sea in what is now known as the West Bank. One of these young shepherds tossed a rock into an opening on the side of a cliff and was surprised to hear a shattering sound. He and his companions later entered the cave and stumbled across a collection of large clay jars, seven of which contained scrolls with writing on them. The teenagers took the seven scrolls to a nearby town where they were sold for a small sum to a local antiquities dealer. Word of the find spread, and Bedouins and archaeologists eventually unearthed tens of thousands of additional scroll fragments from 10 nearby caves; together they make up between 800 and 900 manuscripts. It soon became clear that this was one of the greatest archaeological discoveries ever made.`,
        },
        {
          id: 'c17-r2-p1-2',
          label: '2',
          content: `The origin of the Dead Sea Scrolls, which were written around 2,000 years ago between 150 BCE and 70 CE, is still the subject of scholarly debate even today. According to the prevailing theory, they are the work of a population that inhabited the area until Roman troops destroyed the settlement around 70 CE. The area was known as Judea at that time, and the people are thought to have belonged to a group called the Essenes, a devout Jewish sect.`,
        },
        {
          id: 'c17-r2-p1-3',
          label: '3',
          content: `The majority of the texts on the Dead Sea Scrolls are in Hebrew, with some fragments written in an ancient version of its alphabet thought to have fallen out of use in the fifth century BCE. But there are other languages as well. Some scrolls are in Aramaic, the language spoken by many inhabitants of the region from the sixth century BCE to the siege of Jerusalem in 70 CE. In addition, several texts feature translations of the Hebrew Bible into Greek.`,
        },
        {
          id: 'c17-r2-p1-4',
          label: '4',
          content: `The Dead Sea Scrolls include fragments from every book of the Old Testament of the Bible except for the Book of Esther. The only entire book of the Hebrew Bible preserved among the manuscripts from Qumran is Isaiah; this copy, dated to the first century BCE, is considered the earliest biblical manuscript still in existence. Along with biblical texts, the scrolls include documents about sectarian regulations and religious writings that do not appear in the Old Testament.`,
        },
        {
          id: 'c17-r2-p1-5',
          label: '5',
          content: `The writing on the Dead Sea Scrolls is mostly in black or occasionally red ink, and the scrolls themselves are nearly all made of either parchment (animal skin) or an early form of paper called 'papyrus'. The only exception is the scroll numbered 3Q15, which was created out of a combination of copper and tin. Known as the Copper Scroll, this curious document features letters chiselled onto metal – perhaps, as some have theorized, to better withstand the passage of time. One of the most intriguing manuscripts from Qumran, this is a sort of ancient treasure map that lists dozens of gold and silver caches. Using an unconventional vocabulary and odd spelling, it describes 64 underground hiding places that supposedly contain riches buried for safekeeping. None of these hoards have been recovered, possibly because the Romans pillaged Judea during the first century CE. According to various hypotheses, the treasure belonged to local people, or was rescued from the Second Temple before its destruction or never existed to begin with.`,
        },
        {
          id: 'c17-r2-p1-6',
          label: '6',
          content: `Some of the Dead Sea Scrolls have been on interesting journeys. In 1948, a Syrian Orthodox archbishop known as Mar Samuel acquired four of the original seven scrolls from a Jerusalem shoemaker and part-time antiquity dealer, paying less than $100 for them. He then travelled to the United States and unsuccessfully offered them to a number of universities, including Yale. Finally, in 1954, he placed an advertisement in the business newspaper The Wall Street Journal – under the category 'Miscellaneous Items for Sale' – that read: 'Biblical Manuscripts dating back to at least 200 B.C. are for sale. This would be an ideal gift to an educational or religious institution by an individual or group.' Fortunately, Israeli archaeologist and statesman Yigael Yadin negotiated their purchase and brought the scrolls back to Jerusalem, where they remain to this day. In 2017, researchers from the University of Haifa restored and deciphered one of the last untranslated scrolls. The university's Eshbal Ratson and Jonathan Ben-Dov spent one year reassembling the 60 fragments that make up the scroll. Deciphered from a band of coded text on parchment, the find provides insight into the community of people who wrote it and the 364-day calendar they would have used. The scroll names celebrations that indicate shifts in seasons and details two yearly religious events known from another Dead Sea Scroll. Only one more known scroll remains untranslated.`,
        },
      ],
    },
    {
      id: 'c17-r2-p2',
      passageNumber: 2,
      title: 'A second attempt at domesticating the tomato',
      subtitle:
        'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c17-r2-p2-A',
          label: 'A',
          content: `It took at least 3,000 years for humans to learn how to domesticate the wild tomato and cultivate it for food. Now two separate teams in Brazil and China have done it all over again in less than three years. And they have done it better in some ways, as the re-domesticated tomatoes are more nutritious than the ones we eat at present. This approach relies on the revolutionary CRISPR genome editing technique, in which changes are deliberately made to the DNA of a living cell, allowing genetic material to be added, removed or altered. The technique could not only improve existing crops, but could also be used to turn thousands of wild plants into useful and appealing foods. In fact, a third team in the US has already begun to do this with a relative of the tomato called the groundcherry. This fast-track domestication could help make the world's food supply healthier and far more resistant to diseases, such as the rust fungus devastating wheat crops. 'This could transform what we eat,' says Jorg Kudla at the University of Munster in Germany, a member of the Brazilian team. 'There are 50,000 edible plants in the world, but 90 percent of our energy comes from just 15 crops.' 'We can now mimic the known domestication course of major crops like rice, maize, sorghum or others,' says Caixia Gao of the Chinese Academy of Sciences in Beijing. 'Then we might try to domesticate plants that have never been domesticated.'`,
        },
        {
          id: 'c17-r2-p2-B',
          label: 'B',
          content: `Wild tomatoes, which are native to the Andes region in South America, produce pea-sized fruits. Over many generations, peoples such as the Aztecs and Incas transformed the plant by selecting and breeding plants with mutations in their genetic structure, which resulted in desirable traits such as larger fruit. But every time a single plant with a mutation is taken from a larger population for breeding, much genetic diversity is lost. And sometimes the desirable mutations come with less desirable traits. For instance, the tomato strains grown for supermarkets have lost much of their flavour. By comparing the genomes of modern plants to those of their wild relatives, biologists have been working out what genetic changes occurred as plants were domesticated. The teams in Brazil and China have now used this knowledge to reintroduce these changes from scratch while maintaining or even enhancing the desirable traits of wild strains.`,
        },
        {
          id: 'c17-r2-p2-C',
          label: 'C',
          content: `Kudla's team made six changes altogether. For instance, they tripled the size of fruit by editing a gene called FRUIT WEIGHT, and increased the number of tomatoes per truss by editing another called MULTIFLORA. While the historical domestication of tomatoes reduced levels of the red pigment lycopene – thought to have potential health benefits – the team in Brazil managed to boost it instead. The wild tomato has twice as much lycopene as cultivated ones; the newly domesticated one has five times as much. 'They are quite tasty,' says Kudla. 'A little bit strong. And very aromatic.' The team in China re-domesticated several strains of wild tomatoes with desirable traits lost in domesticated tomatoes. In this way they managed to create a strain resistant to a common disease called bacterial spot race, which can devastate yields. They also created another strain that is more salt tolerant – and has higher levels of vitamin C.`,
        },
        {
          id: 'c17-r2-p2-D',
          label: 'D',
          content: `Meanwhile, Joyce Van Eck at the Boyce Thompson Institute in New York state decided to use the same approach to domesticate the groundcherry or goldenberry (Physalis pruinosa) for the first time. This fruit looks similar to the closely related Cape gooseberry (Physalis peruviana). Groundcherries are already sold to a limited extent in the US but they are hard to produce because the plant has a sprawling growth habit and the small fruits fall off the branches when ripe. Van Eck's team has edited the plants to increase fruit size, make their growth more compact and to stop fruits dropping. 'There's potential for this to be a commercial crop,' says Van Eck. But she adds that taking the work further would be expensive because of the need to pay for a licence for the CRISPR technology and get regulatory approval.`,
        },
        {
          id: 'c17-r2-p2-E',
          label: 'E',
          content: `This approach could boost the use of many obscure plants, says Jonathan Jones of the Sainsbury Lab in the UK. But it will be hard for new foods to grow so popular with farmers and consumers that they become new staple crops, he thinks. The three teams already have their eye on other plants that could be 'catapulted into the mainstream', including foxtail, oat-grass and cowpea. By choosing wild plants that are drought or heat tolerant, says Gao, we could create crops that will thrive even as the planet warms. But Kudla didn't want to reveal which species were in his team's sights, because CRISPR has made the process so easy. 'Any one with the right skills could go to their lab and do this.'`,
        },
      ],
    },
    {
      id: 'c17-r2-p3',
      passageNumber: 3,
      title: 'Insight or evolution?',
      subtitle:
        'Two scientists consider the origins of discoveries and other innovative behavior\n\nYou should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c17-r2-p3-1',
          label: '1',
          content: `Scientific discovery is popularly believed to result from the sheer genius of such intellectual stars as naturalist Charles Darwin and theoretical physicist Albert Einstein. Our view of such unique contributions to science often disregards the person's prior experience and the efforts of their lesser-known predecessors. Conventional wisdom also places great weight on insight in promoting breakthrough scientific achievements, as if ideas spontaneously pop into someone's head – fully formed and functional.`,
        },
        {
          id: 'c17-r2-p3-2',
          label: '2',
          content: `There may be some limited truth to this view. However, we believe that it largely misrepresents the real nature of scientific discovery, as well as that of creativity and innovation in many other realms of human endeavor.`,
        },
        {
          id: 'c17-r2-p3-3',
          label: '3',
          content: `Setting aside such greats as Darwin and Einstein – whose monumental contributions are duly celebrated – we suggest that innovation is more a process of trial and error, where two steps forward may sometimes come with one step back, as well as one or more steps to the right or left. This evolutionary view of human innovation undermines the notion of creative genius and recognizes the cumulative nature of scientific progress.`,
        },
        {
          id: 'c17-r2-p3-4',
          label: '4',
          content: `Consider one unheralded scientist: John Nicholson, a mathematical physicist working in the 1910s who postulated the existence of 'proto-elements' in outer space. By combining different numbers of weights of these proto-elements' atoms, Nicholson could recover the weights of all the elements in the then-known periodic table. These successes are all the more noteworthy given the fact that Nicholson was wrong about the presence of proto-elements: they do not actually exist. Yet, amid his often fanciful theories and wild speculations, Nicholson also proposed a novel theory about the structure of atoms. Niels Bohr, the Nobel prize-winning father of modern atomic theory, jumped off from this interesting idea to conceive his now-famous model of the atom.`,
        },
        {
          id: 'c17-r2-p3-5',
          label: '5',
          content: `What are we to make of this story? One might simply conclude that science is a collective and cumulative enterprise. That may be true, but there may be a deeper insight to be gleaned. We propose that science is constantly evolving, much as species of animals do. In biological systems, organisms may display new characteristics that result from random genetic mutations. In the same way, random, arbitrary or accidental mutations of ideas may help pave the way for advances in science. If mutations prove beneficial, then the animal or the scientific theory will continue to thrive and perhaps reproduce.`,
        },
        {
          id: 'c17-r2-p3-6',
          label: '6',
          content: `Support for this evolutionary view of behavioral innovation comes from many domains. Consider one example of an influential innovation in US horseracing. The so-called 'acey-deucy' stirrup placement, in which the rider's foot in his left stirrup is placed as much as 25 centimeters lower than the right, is believed to confer important speed advantages when turning on oval tracks. It was developed by a relatively unknown jockey named Jackie Westrope. Had Westrope conducted methodical investigations or examined extensive film records in a shrewd plan to outrun his rivals? Had he foreseen the speed advantage that would be conferred by riding acey-deucy? No. He suffered a leg injury, which left him unable to fully bend his left knee. His modification just happened to coincide with enhanced left-hand turning performance. This led to the rapid and widespread adoption of riding acey-deucy by many riders, a racing style which continues in today's thoroughbred racing.`,
        },
        {
          id: 'c17-r2-p3-7',
          label: '7',
          content: `Plenty of other stories show that fresh advances can arise from error, misadventure, and also pure serendipity – a happy accident. For example, in the early 1970s, two employees of the company 3M each had a problem: Spencer Silver had a product – a glue which was only slightly sticky – and no use for it, while his colleague Art Fry was trying to figure out how to affix temporary bookmarks in his hymn book without damaging its pages. The solution to both these problems was the invention of the brilliantly simple yet phenomenally successful Post-It note. Such examples give lie to the claim that ingenious, designing minds are responsible for human creativity and invention. Far more banal and mechanical forces may be at work; forces that are fundamentally connected to the laws of science.`,
        },
        {
          id: 'c17-r2-p3-8',
          label: '8',
          content: `The notions of insight, creativity and genius are often invoked, but they remain vague and of doubtful scientific utility, especially when one considers the diverse and enduring contributions of individuals such as Plato, Leonardo da Vinci, Shakespeare, Beethoven, Galileo, Newton, Kepler, Curie, Pasteur and Edison. These notions merely label rather than explain the evolution of human innovations. We need another approach, and there is a promising candidate.`,
        },
        {
          id: 'c17-r2-p3-9',
          label: '9',
          content: `The Law of Effect was advanced by psychologist Edward Thorndike in 1898, some 40 years after Charles Darwin published his groundbreaking work on biological evolution, On the Origin of Species. This simple law holds that organisms tend to repeat successful behaviors and to refrain from performing unsuccessful ones. Just like Darwin's Law of Natural Selection, the Law of Effect involves an entirely mechanical process of variation and selection, without any end objective in sight.`,
        },
        {
          id: 'c17-r2-p3-10',
          label: '10',
          content: `Of course, the origin of human innovation demands much further study. In particular, the provenance of the raw material on which the Law of Effect operates is not as clearly known as that of the genetic mutations on which the Law of Natural Selection operates. The generation of novel ideas and behaviors may not be entirely random, but constrained by prior successes and failures – of the current individual (such as Bohr) or of predecessors (such as Nicholson). The time seems right for abandoning the naive notions of intelligent design and genius, and for scientifically exploring the true origins of creative behavior.`,
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
  ];

  const RESEARCHER_OPTIONS = [
    { key: 'A', text: 'Jorg Kudla' },
    { key: 'B', text: 'Caixia Gao' },
    { key: 'C', text: 'Joyce Van Eck' },
    { key: 'D', text: 'Jonathan Jones' },
  ];

  const SUMMARY_OPTIONS_BOX_P3 = [
    { key: 'A', text: 'invention' },
    { key: 'B', text: 'goals' },
    { key: 'C', text: 'compromise' },
    { key: 'D', text: 'mistakes' },
    { key: 'E', text: 'luck' },
    { key: 'F', text: 'inspiration' },
    { key: 'G', text: 'experiments' },
  ];

  const MC_Q27_OPTIONS = [
    { key: 'A', text: 'defend particular ideas.' },
    { key: 'B', text: 'compare certain beliefs.' },
    { key: 'C', text: 'disprove a widely held view.' },
    { key: 'D', text: 'outline a common assumption.' },
  ];

  const MC_Q28_OPTIONS = [
    { key: 'A', text: 'criticising an opinion' },
    { key: 'B', text: 'justifying a standpoint' },
    { key: 'C', text: 'explaining an approach' },
    { key: 'D', text: 'supporting an argument' },
  ];

  const MC_Q29_OPTIONS = [
    { key: 'A', text: 'They represent an exception to a general rule.' },
    { key: 'B', text: 'Their way of working has been misunderstood.' },
    { key: 'C', text: 'They are an ideal which others should aspire to.' },
    { key: 'D', text: 'Their achievements deserve greater recognition.' },
  ];

  const MC_Q30_OPTIONS = [
    { key: 'A', text: 'established his reputation as an influential scientist.' },
    { key: 'B', text: 'was only fully understood at a later point in history.' },
    { key: 'C', text: "laid the foundations for someone else's breakthrough." },
    { key: 'D', text: 'initially met with scepticism from the scientific community.' },
  ];

  const MC_Q31_OPTIONS = [
    { key: 'A', text: 'the simple reason why it was invented' },
    { key: 'B', text: 'the enthusiasm with which it was adopted' },
    { key: 'C', text: 'the research that went into its development' },
    { key: 'D', text: 'the cleverness of the person who first used it' },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-5 (Note Completion)
    {
      id: 'c17-r2-g1',
      passageId: 'c17-r2-p1',
      questionType: 'note_completion',
      title: 'Questions 1–5',
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–5 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 5,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `The Dead Sea Scrolls

Discovery
Qumran, 1946/7
• three Bedouin shepherds in their teens were near an opening on side of cliff
• heard a noise of breaking when one teenager threw a [[1]]
• teenagers went into the [[2]] and found a number of containers made of [[3]]

The scrolls
• date from between 150 BCE and 70 CE
• thought to have been written by group of people known as the [[4]]
• written mainly in the [[5]] language
• most are on religious topics, written using ink on parchment or papyrus`,
      questions: [
        {
          id: 'c17-r2-q1',
          questionNumber: 1,
          prompt: 'heard a noise of breaking when one teenager threw a [1]',
          answerKey: 'rock',
          acceptedAlternatives: ['rock', 'stone'],
          explanation:
            "Paragraph 1 states: 'One of these young shepherds tossed a rock into an opening on the side of a cliff and was surprised to hear a shattering sound.'",
          evidenceQuote: 'One of these young shepherds tossed a rock into an opening on the side of a cliff',
          paragraphRef: '1',
        },
        {
          id: 'c17-r2-q2',
          questionNumber: 2,
          prompt: 'teenagers went into the [2] and found a number of containers',
          answerKey: 'cave',
          acceptedAlternatives: ['cave'],
          explanation:
            "Paragraph 1 states: 'He and his companions later entered the cave and stumbled across a collection of large clay jars...'",
          evidenceQuote: 'He and his companions later entered the cave and stumbled across a collection of large clay jars',
          paragraphRef: '1',
        },
        {
          id: 'c17-r2-q3',
          questionNumber: 3,
          prompt: 'and found a number of containers made of [3]',
          answerKey: 'clay',
          acceptedAlternatives: ['clay'],
          explanation:
            "Paragraph 1 states: 'stumbled across a collection of large clay jars, seven of which contained scrolls with writing on them.' Containers made of clay.",
          evidenceQuote: 'a collection of large clay jars',
          paragraphRef: '1',
        },
        {
          id: 'c17-r2-q4',
          questionNumber: 4,
          prompt: 'thought to have been written by group of people known as the [4]',
          answerKey: 'Essenes',
          acceptedAlternatives: ['Essenes', 'the Essenes'],
          explanation:
            "Paragraph 2 states: 'and the people are thought to have belonged to a group called the Essenes, a devout Jewish sect.'",
          evidenceQuote: 'the people are thought to have belonged to a group called the Essenes',
          paragraphRef: '2',
        },
        {
          id: 'c17-r2-q5',
          questionNumber: 5,
          prompt: 'written mainly in the [5] language',
          answerKey: 'Hebrew',
          acceptedAlternatives: ['Hebrew'],
          explanation:
            "Paragraph 3 states: 'The majority of the texts on the Dead Sea Scrolls are in Hebrew, with some fragments written in an ancient version of its alphabet...'",
          evidenceQuote: 'The majority of the texts on the Dead Sea Scrolls are in Hebrew',
          paragraphRef: '3',
        },
      ],
    },

    // PASSAGE 1: Questions 6-13 (TRUE / FALSE / NOT GIVEN)
    {
      id: 'c17-r2-g2',
      passageId: 'c17-r2-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 6–13',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 6–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 6,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c17-r2-q6',
          questionNumber: 6,
          prompt:
            'The Bedouin teenagers who found the scrolls were disappointed by how little money they received for them.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 1 notes that the scrolls were sold for a 'small sum to a local antiquities dealer', but does not mention whether the teenagers were disappointed.",
          evidenceQuote: 'where they were sold for a small sum to a local antiquities dealer.',
          paragraphRef: '1',
        },
        {
          id: 'c17-r2-q7',
          questionNumber: 7,
          prompt: 'There is agreement among academics about the origin of the Dead Sea Scrolls.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 2 states: 'The origin of the Dead Sea Scrolls, which were written around 2,000 years ago between 150 BCE and 70 CE, is still the subject of scholarly debate even today.' Therefore, there is no agreement.",
          evidenceQuote: 'is still the subject of scholarly debate even today.',
          paragraphRef: '2',
        },
        {
          id: 'c17-r2-q8',
          questionNumber: 8,
          prompt: 'Most of the books of the Bible written on the scrolls are incomplete.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 4 states: 'The Dead Sea Scrolls include fragments from every book of the Old Testament... The only entire book of the Hebrew Bible preserved among the manuscripts from Qumran is Isaiah'. Since only one book is entire and all others are fragments, most are incomplete.",
          evidenceQuote: 'The only entire book of the Hebrew Bible preserved among the manuscripts from Qumran is Isaiah',
          paragraphRef: '4',
        },
        {
          id: 'c17-r2-q9',
          questionNumber: 9,
          prompt: 'The information on the Copper Scroll is written in an unusual way.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 5 states that the Copper Scroll document 'features letters chiselled onto metal' and is written 'Using an unconventional vocabulary and odd spelling'.",
          evidenceQuote: 'features letters chiselled onto metal... Using an unconventional vocabulary and odd spelling',
          paragraphRef: '5',
        },
        {
          id: 'c17-r2-q10',
          questionNumber: 10,
          prompt: 'Mar Samuel was given some of the scrolls as a gift.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 6 contradicts this: 'In 1948, a Syrian Orthodox archbishop known as Mar Samuel acquired four of the original seven scrolls from a Jerusalem shoemaker and part-time antiquity dealer, paying less than $100 for them.' He purchased them, not as a gift.",
          evidenceQuote: 'paying less than $100 for them.',
          paragraphRef: '6',
        },
        {
          id: 'c17-r2-q11',
          questionNumber: 11,
          prompt:
            'In the early 1950s, a number of educational establishments in the US were keen to buy scrolls from Mar Samuel.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 6 contradicts this: 'He then travelled to the United States and unsuccessfully offered them to a number of universities, including Yale.' They were not keen to buy them.",
          evidenceQuote: 'unsuccessfully offered them to a number of universities, including Yale.',
          paragraphRef: '6',
        },
        {
          id: 'c17-r2-q12',
          questionNumber: 12,
          prompt:
            'The scroll that was pieced together in 2017 contains information about annual occasions in the Qumran area 2,000 years ago.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 6 states: 'The scroll names celebrations that indicate shifts in seasons and details two yearly religious events known from another Dead Sea Scroll.'",
          evidenceQuote: 'The scroll names celebrations that indicate shifts in seasons and details two yearly religious events',
          paragraphRef: '6',
        },
        {
          id: 'c17-r2-q13',
          questionNumber: 13,
          prompt:
            'Academics at the University of Haifa are currently researching how to decipher the final scroll.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 6 mentions that 'Only one more known scroll remains untranslated', but does not state whether academics at the University of Haifa are currently researching how to decipher it.",
          evidenceQuote: 'Only one more known scroll remains untranslated.',
          paragraphRef: '6',
        },
      ],
    },

    // PASSAGE 2: Questions 14-18 (Matching Information)
    {
      id: 'c17-r2-g3',
      passageId: 'c17-r2-p2',
      questionType: 'matching_information',
      title: 'Questions 14–18',
      instructions:
        'Reading Passage 2 has five sections, A–E.\nWhich section contains the following information?\nWrite the correct letter, A–E, in boxes 14–18 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 14,
      endQuestionNumber: 18,
      optionsList: SECTION_OPTIONS,
      allowMultipleUse: true,
      questions: [
        {
          id: 'c17-r2-q14',
          questionNumber: 14,
          prompt: 'a reference to a type of tomato that can resist a dangerous infection',
          options: SECTION_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Section C mentions that the team in China 'managed to create a strain resistant to a common disease called bacterial spot race, which can devastate yields.'",
          evidenceQuote: 'managed to create a strain resistant to a common disease called bacterial spot race, which can devastate yields.',
          paragraphRef: 'C',
        },
        {
          id: 'c17-r2-q15',
          questionNumber: 15,
          prompt:
            'an explanation of how problems can arise from focusing only on a certain type of tomato plant.',
          options: SECTION_OPTIONS,
          answerKey: 'B',
          explanation:
            "Section B explains: 'every time a single plant with a mutation is taken from a larger population for breeding, much genetic diversity is lost. And sometimes the desirable mutations come with less desirable traits. For instance, the tomato strains grown for supermarkets have lost much of their flavour.'",
          evidenceQuote: 'every time a single plant with a mutation is taken from a larger population for breeding, much genetic diversity is lost. And sometimes the desirable mutations come with less desirable traits.',
          paragraphRef: 'B',
        },
        {
          id: 'c17-r2-q16',
          questionNumber: 16,
          prompt:
            'a number of examples of plants that are not cultivated at present but could be useful as food sources',
          options: SECTION_OPTIONS,
          answerKey: 'E',
          explanation:
            "Section E states: 'The three teams already have their eye on other plants that could be \"catapulted into the mainstream\", including foxtail, oat-grass and cowpea.'",
          evidenceQuote: 'eye on other plants that could be \'catapulted into the mainstream\', including foxtail, oat-grass and cowpea.',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r2-q17',
          questionNumber: 17,
          prompt: 'a comparison between the early domestication of the tomato and more recent research',
          options: SECTION_OPTIONS,
          answerKey: 'A',
          explanation:
            "Section A compares the timeframes: 'It took at least 3,000 years for humans to learn how to domesticate the wild tomato and cultivate it for food. Now two separate teams in Brazil and China have done it all over again in less than three years.'",
          evidenceQuote: 'It took at least 3,000 years for humans to learn how to domesticate the wild tomato... Now two separate teams in Brazil and China have done it all over again in less than three years.',
          paragraphRef: 'A',
        },
        {
          id: 'c17-r2-q18',
          questionNumber: 18,
          prompt: 'a personal reaction to the flavour of a tomato that has been genetically edited',
          options: SECTION_OPTIONS,
          answerKey: 'C',
          explanation:
            "Section C quotes Kudla's personal reaction: '\"They are quite tasty,\" says Kudla. \"A little bit strong. And very aromatic.\"'",
          evidenceQuote: '\'They are quite tasty,\' says Kudla. \'A little bit strong. And very aromatic.\'',
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 2: Questions 19-23 (Matching Features - Researchers)
    {
      id: 'c17-r2-g4',
      passageId: 'c17-r2-p2',
      questionType: 'matching_features',
      title: 'Questions 19–23',
      instructions:
        'Look at the following statements (Questions 19–23) and the list of researchers below.\nMatch each statement with the correct researcher, A–D.\nWrite the correct letter, A–D, in boxes 19–23 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 19,
      endQuestionNumber: 23,
      optionsList: RESEARCHER_OPTIONS,
      allowMultipleUse: true,
      questions: [
        {
          id: 'c17-r2-q19',
          questionNumber: 19,
          prompt:
            'Domestication of certain plants could allow them to adapt to future environmental challenges.',
          options: RESEARCHER_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Section E quotes Caixia Gao (B): 'By choosing wild plants that are drought or heat tolerant, says Gao, we could create crops that will thrive even as the planet warms.'",
          evidenceQuote: 'By choosing wild plants that are drought or heat tolerant, says Gao, we could create crops that will thrive even as the planet warms.',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r2-q20',
          questionNumber: 20,
          prompt:
            'The idea of growing and eating unusual plants may not be accepted on a large scale.',
          options: RESEARCHER_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Section E quotes Jonathan Jones (D): 'But it will be hard for new foods to grow so popular with farmers and consumers that they become new staple crops, he thinks.'",
          evidenceQuote: 'it will be hard for new foods to grow so popular with farmers and consumers that they become new staple crops, he thinks.',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r2-q21',
          questionNumber: 21,
          prompt:
            'It is not advisable for the future direction of certain research to be made public.',
          options: RESEARCHER_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section E states: 'But Kudla (A) didn't want to reveal which species were in his team's sights, because CRISPR has made the process so easy. \"Any one with the right skills could go to their lab and do this.\"'",
          evidenceQuote: 'Kudla didn\'t want to reveal which species were in his team\'s sights, because CRISPR has made the process so easy.',
          paragraphRef: 'E',
        },
        {
          id: 'c17-r2-q22',
          questionNumber: 22,
          prompt: 'Present efforts to domesticate one wild fruit are limited by the costs involved.',
          options: RESEARCHER_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Section D quotes Joyce Van Eck (C): 'But she adds that taking the work further would be expensive because of the need to pay for a licence for the CRISPR technology and get regulatory approval.'",
          evidenceQuote: 'she adds that taking the work further would be expensive because of the need to pay for a licence for the CRISPR technology and get regulatory approval.',
          paragraphRef: 'D',
        },
        {
          id: 'c17-r2-q23',
          questionNumber: 23,
          prompt: 'Humans only make use of a small proportion of the plant food available on Earth.',
          options: RESEARCHER_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section A quotes Jorg Kudla (A): '\"There are 50,000 edible plants in the world, but 90 percent of our energy comes from just 15 crops.\"'",
          evidenceQuote: 'There are 50,000 edible plants in the world, but 90 percent of our energy comes from just 15 crops.',
          paragraphRef: 'A',
        },
      ],
    },

    // PASSAGE 2: Questions 24-26 (Sentence Completion)
    {
      id: 'c17-r2-g5',
      passageId: 'c17-r2-p2',
      questionType: 'sentence_completion',
      title: 'Questions 24–26',
      instructions:
        'Complete the sentences below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 24–26 on your answer sheet.',
      startQuestionNumber: 24,
      endQuestionNumber: 26,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `24 An undesirable trait such as loss of [[24]] may be caused by a mutation in a tomato gene.
25 By modifying one gene in a tomato plant, researchers made the tomato three times its original [[25]].
26 A type of tomato which was not badly affected by [[26]], and was rich in vitamin C, was produced by a team of researchers in China.`,
      questions: [
        {
          id: 'c17-r2-q24',
          questionNumber: 24,
          prompt: 'An undesirable trait such as loss of [24] may be caused by a mutation in a tomato gene.',
          answerKey: 'flavour',
          acceptedAlternatives: ['flavour', 'flavor'],
          explanation:
            "Section B states: 'And sometimes the desirable mutations come with less desirable traits. For instance, the tomato strains grown for supermarkets have lost much of their flavour.'",
          evidenceQuote: 'the tomato strains grown for supermarkets have lost much of their flavour.',
          paragraphRef: 'B',
        },
        {
          id: 'c17-r2-q25',
          questionNumber: 25,
          prompt:
            'By modifying one gene in a tomato plant, researchers made the tomato three times its original [25].',
          answerKey: 'size',
          acceptedAlternatives: ['size'],
          explanation:
            "Section C states: 'For instance, they tripled the size of fruit by editing a gene called FRUIT WEIGHT...'",
          evidenceQuote: 'they tripled the size of fruit by editing a gene called FRUIT WEIGHT',
          paragraphRef: 'C',
        },
        {
          id: 'c17-r2-q26',
          questionNumber: 26,
          prompt:
            'A type of tomato which was not badly affected by [26], and was rich in vitamin C, was produced by a team of researchers in China.',
          answerKey: 'salt',
          acceptedAlternatives: ['salt'],
          explanation:
            "Section C states: 'They also created another strain that is more salt tolerant – and has higher levels of vitamin C.'",
          evidenceQuote: 'They also created another strain that is more salt tolerant – and has higher levels of vitamin C.',
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 3: Questions 27-31 (Multiple Choice Single)
    {
      id: 'c17-r2-g6',
      passageId: 'c17-r2-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–31',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–31 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 31,
      questions: [
        {
          id: 'c17-r2-q27',
          questionNumber: 27,
          prompt: 'The purpose of the first paragraph is to',
          options: MC_Q27_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 1 explains what is 'popularly believed' and what 'Conventional wisdom' holds about scientific discovery stemming from sheer genius and insight (D - outline a common assumption).",
          evidenceQuote: 'Scientific discovery is popularly believed to result from the sheer genius... Conventional wisdom also places great weight on insight',
          paragraphRef: '1',
        },
        {
          id: 'c17-r2-q28',
          questionNumber: 28,
          prompt: 'What are the writers doing in the second paragraph?',
          options: MC_Q28_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 2 states: 'There may be some limited truth to this view. However, we believe that it largely misrepresents the real nature of scientific discovery...' The writers are criticising the popular opinion outlined in paragraph 1 (A).",
          evidenceQuote: 'However, we believe that it largely misrepresents the real nature of scientific discovery',
          paragraphRef: '2',
        },
        {
          id: 'c17-r2-q29',
          questionNumber: 29,
          prompt: 'In the third paragraph, what do the writers suggest about Darwin and Einstein?',
          options: MC_Q29_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 3 begins: 'Setting aside such greats as Darwin and Einstein – whose monumental contributions are duly celebrated – we suggest that innovation is more a process of trial and error...' By setting them aside, the authors indicate they represent an exception to the general rule (A).",
          evidenceQuote: 'Setting aside such greats as Darwin and Einstein – whose monumental contributions are duly celebrated – we suggest that innovation is more a process of trial and error',
          paragraphRef: '3',
        },
        {
          id: 'c17-r2-q30',
          questionNumber: 30,
          prompt: 'John Nicholson is an example of a person whose idea',
          options: MC_Q30_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 4 explains that although Nicholson was wrong about proto-elements, 'Niels Bohr, the Nobel prize-winning father of modern atomic theory, jumped off from this interesting idea to conceive his now-famous model of the atom.' (C - laid the foundations for someone else's breakthrough).",
          evidenceQuote: 'Niels Bohr, the Nobel prize-winning father of modern atomic theory, jumped off from this interesting idea to conceive his now-famous model of the atom.',
          paragraphRef: '4',
        },
        {
          id: 'c17-r2-q31',
          questionNumber: 31,
          prompt: "What is the key point of interest about the 'acey-deucy' stirrup placement?",
          options: MC_Q31_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 6 explains that Jackie Westrope did not invent it through clever planning or foresight: 'He suffered a leg injury, which left him unable to fully bend his left knee. His modification just happened to coincide with enhanced left-hand turning performance.' (A - the simple reason why it was invented).",
          evidenceQuote: 'He suffered a leg injury, which left him unable to fully bend his left knee. His modification just happened to coincide with enhanced left-hand turning performance.',
          paragraphRef: '6',
        },
      ],
    },

    // PASSAGE 3: Questions 32-36 (YES / NO / NOT GIVEN)
    {
      id: 'c17-r2-g7',
      passageId: 'c17-r2-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 32–36',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 32–36 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 32,
      endQuestionNumber: 36,
      questions: [
        {
          id: 'c17-r2-q32',
          questionNumber: 32,
          prompt:
            'Acknowledging people such as Plato or da Vinci as geniuses will help us understand the process by which great minds create new ideas.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 8 contradicts this: 'These notions merely label rather than explain the evolution of human innovations. We need another approach, and there is a promising candidate.' Labeling them geniuses does not explain or help understand the process.",
          evidenceQuote: 'These notions merely label rather than explain the evolution of human innovations. We need another approach',
          paragraphRef: '8',
        },
        {
          id: 'c17-r2-q33',
          questionNumber: 33,
          prompt:
            'The Law of Effect was discovered at a time when psychologists were seeking a scientific reason why creativity occurs.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 9 introduces Thorndike advancing the Law of Effect in 1898, but does not state what psychologists were seeking at the time.",
          evidenceQuote: 'The Law of Effect was advanced by psychologist Edward Thorndike in 1898, some 40 years after Charles Darwin published his groundbreaking work',
          paragraphRef: '9',
        },
        {
          id: 'c17-r2-q34',
          questionNumber: 34,
          prompt:
            'The Law of Effect states that no planning is involved in the behaviour of organisms.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 9 states: 'Just like Darwin's Law of Natural Selection, the Law of Effect involves an entirely mechanical process of variation and selection, without any end objective in sight.' An entirely mechanical process without any end objective means no planning is involved.",
          evidenceQuote: 'the Law of Effect involves an entirely mechanical process of variation and selection, without any end objective in sight.',
          paragraphRef: '9',
        },
        {
          id: 'c17-r2-q35',
          questionNumber: 35,
          prompt:
            'The Law of Effect sets out clear explanations about the sources of new ideas and behaviours.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 10 contradicts this: 'In particular, the provenance of the raw material on which the Law of Effect operates is not as clearly known as that of the genetic mutations on which the Law of Natural Selection operates.' It is not clearly known.",
          evidenceQuote: 'the provenance of the raw material on which the Law of Effect operates is not as clearly known',
          paragraphRef: '10',
        },
        {
          id: 'c17-r2-q36',
          questionNumber: 36,
          prompt:
            'Many scientists are now turning away from the notion of intelligent design and genius.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 10 concludes: 'The time seems right for abandoning the naive notions of intelligent design and genius...' The authors argue that the time is right, but do not state whether many scientists are currently doing so.",
          evidenceQuote: 'The time seems right for abandoning the naive notions of intelligent design and genius',
          paragraphRef: '10',
        },
      ],
    },

    // PASSAGE 3: Questions 37-40 (Summary Completion with Options)
    {
      id: 'c17-r2-g8',
      passageId: 'c17-r2-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 37–40',
      instructions:
        'Complete the summary using the list of words, A–G, below.\nWrite the correct letter, A–G, in boxes 37–40 on your answer sheet.',
      startQuestionNumber: 37,
      endQuestionNumber: 40,
      optionsList: SUMMARY_OPTIONS_BOX_P3,
      contentWithGaps: `The origins of creative behaviour

The traditional view of scientific discovery is that breakthroughs happen when a single great mind has sudden [[37]]. Although this can occur, it is not often the case. Advances are more likely to be the result of a longer process. In some cases, this process involves [[38]], such as Nicholson's theory about proto-elements. In others, simple necessity may provoke innovation, as with Westrope's decision to modify the position of his riding stirrups. There is also often an element of [[39]], for example, the coincidence of ideas that led to the invention of the Post-It note. With both the Law of Natural Selection and the Law of Effect, there may be no clear [[40]] involved, but merely a process of variation and selection.`,
      questions: [
        {
          id: 'c17-r2-q37',
          questionNumber: 37,
          prompt:
            'The traditional view of scientific discovery is that breakthroughs happen when a single great mind has sudden [37]',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph 1 notes: 'Conventional wisdom also places great weight on insight in promoting breakthrough scientific achievements, as if ideas spontaneously pop into someone's head – fully formed and functional.' (F - inspiration).",
          evidenceQuote: 'Conventional wisdom also places great weight on insight in promoting breakthrough scientific achievements, as if ideas spontaneously pop into someone\'s head',
          paragraphRef: '1',
        },
        {
          id: 'c17-r2-q38',
          questionNumber: 38,
          prompt:
            "In some cases, this process involves [38], such as Nicholson's theory about proto-elements",
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 4 states that 'Nicholson was wrong about the presence of proto-elements: they do not actually exist', yet his flawed theory led Bohr to his atomic model (D - mistakes).",
          evidenceQuote: 'Nicholson was wrong about the presence of proto-elements: they do not actually exist. Yet, amid his often fanciful theories and wild speculations, Nicholson also proposed a novel theory',
          paragraphRef: '4',
        },
        {
          id: 'c17-r2-q39',
          questionNumber: 39,
          prompt: 'There is also often an element of [39], for example, the coincidence of ideas',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph 7 states: 'Plenty of other stories show that fresh advances can arise from error, misadventure, and also pure serendipity – a happy accident' (E - luck).",
          evidenceQuote: 'arise from error, misadventure, and also pure serendipity – a happy accident.',
          paragraphRef: '7',
        },
        {
          id: 'c17-r2-q40',
          questionNumber: 40,
          prompt:
            'With both the Law of Natural Selection and the Law of Effect, there may be no clear [40] involved, but merely a process of variation and selection.',
          options: SUMMARY_OPTIONS_BOX_P3,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 9 states: 'the Law of Effect involves an entirely mechanical process of variation and selection, without any end objective in sight.' No end objective means no clear goals (B - goals).",
          evidenceQuote: 'without any end objective in sight.',
          paragraphRef: '9',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 17 Academic Reading Test 2',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge17ReadingTest2(authorId?: string) {
  const data = getCambridge17ReadingTest2Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 17 Reading Test 2 data validation failed:\n- ${errors.join('\n- ')}`
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
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%17%Academic%Reading%Test 2%' LIMIT 1"
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
