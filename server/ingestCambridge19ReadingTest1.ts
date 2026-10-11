import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge19ReadingTest1Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c19-r1-p1',
      passageNumber: 1,
      title: 'How tennis rackets have changed',
      subtitle: 'You should spend about 20 minutes on Questions 1-13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c19-r1-p1-1',
          label: '1',
          content: `In 2016, the British professional tennis player Andy Murray was ranked as the world's number one. It was an incredible achievement by any standard - made even more remarkable by the fact that he did this during a period considered to be one of the strongest in the sport's history, competing against the likes of Rafael Nadal, Roger Federer and Novak Djokovic, to name just a few. Yet five years previously, he had been regarded as a talented outsider who entered but never won the major tournaments. Of the changes that account for this transformation, one was visible and widely publicised: in 2011, Murray invited former number one player Ivan Lendl onto his coaching team - a valuable addition that had a visible impact on the player's playing style. Another change was so subtle as to pass more or less unnoticed. Like many players, Murray has long preferred a racket that consists of two types of string: one for the mains (verticals) and another for the crosses (horizontals). While he continued to use natural string in the crosses, in 2012 he switched to a synthetic string for the mains. A small change, perhaps, but its importance should not be underestimated.`,
        },
        {
          id: 'c19-r1-p1-2',
          label: '2',
          content: `The modification that Murray made is just one of a number of options available to players looking to tweak their rackets in order to improve their games. 'Touring professionals have their rackets customised to their specific needs,' says Colin Triplow, a UK-based professional racket stringer. 'It's a highly important part of performance maximisation.' Consequently, the specific rackets used by the world's elite are not actually readily available to the public; rather, each racket is individually made to suit the player who uses it. Take the US professional tennis players Mike and Bob Bryan, for example: 'We're very particular with our racket specifications,' they say. 'All our rackets are sent from our manufacturer to Tampa, Florida, where our frames go through a ... thorough customisation process.' They explain how they have adjusted not only racket length, but even experimented with different kinds of paint. The rackets they use now weigh more than the average model and also have a denser string pattern (i.e. more crosses and mains). The primary reason for these modifications is simple: as the line between winning and losing becomes thinner and thinner, even these slight changes become more and more important. As a result, players and their teams are becoming increasingly creative with the modifications to their rackets as they look to maximise their competitive advantage.`,
        },
        {
          id: 'c19-r1-p1-3',
          label: '3',
          content: `Racket modifications mainly date back to the 1970s, when the amateur German tennis player Werner Fischer started playing with the so-called spaghetti-strung racket. It created a string bed that generated so much topspin that it was quickly banned by the International Tennis Federation. However, within a decade or two, racket modification became a regularity. Today it is, in many ways, an aspect of the game that is equal in significance to nutrition or training. Modifications can be divided into two categories: those to the string bed and those to the racket frame. The former is far more common than the latter: the choice of the strings and the tension with which they are installed is something that nearly all professional players experiment with. They will continually change it depending on various factors including the court surface, climatic conditions, and game styles. Some will even change it depending on how they feel at the time.`,
        },
        {
          id: 'c19-r1-p1-4',
          label: '4',
          content: `At one time, all tennis rackets were strung with natural gut made from the outer layer of sheep or cow intestines. This all changed in the early 1990s with the development of synthetic strings that were cheaper and more durable. They are made from three materials: nylon (relatively durable and affordable), Kevlar (too stiff to be used alone) or co-polyester (polyester combined with additives that enhance its performance). Even so, many professional players continue to use a 'hybrid set-up', where a combination of both synthetic and natural strings are used. Of the synthetics, co-polyester is by far the most widely used. It's a perfect fit for the style of tennis now played, where players tend to battle it out from the back of the court rather than coming to the net. Studies indicate that the average spin from a co-polyester string is 25% greater than that from natural string or other synthetics. In a sense, the development of co-polyester strings has revolutionised the game.`,
        },
        {
          id: 'c19-r1-p1-5',
          label: '5',
          content: `However, many players go beyond these basic adjustments to the strings and make changes to the racket frame itself. For example, much of the serving power of US professional player Pete Sampras was attributed to the addition of four to five lead weights onto his rackets, and today many professionals have the weight adjusted during the manufacturing process. Other changes to the frame involve the handle. Players have individual preferences for the shape of the handle and some will have the handle of one racket moulded onto the frame of a different racket. Other players make different changes. The professional Portuguese player Gonçalo Oliveira replaced the original grips of his rackets with something thinner because they had previously felt uncomfortable to hold. Racket customisation and modification have pushed the standards of the game to greater levels that few could have anticipated in the days of natural strings and heavy, wooden frames, and it's exciting to see what further developments there will be in the future.`,
        },
      ],
    },
    {
      id: 'c19-r1-p2',
      passageNumber: 2,
      title: 'The pirates of the ancient Mediterranean',
      subtitle: 'In the first and second millennia BCE, pirates sailed around the Mediterranean, attacking ships and avoiding pursuers',
      paragraphs: [
        {
          id: 'c19-r1-p2-A',
          label: 'A',
          content: `When one mentions pirates, an image springs to most people's minds of a crew of misfits, daredevils and adventurers in command of a tall sailing ship in the Caribbean Sea. Yet from the first to the third millennium BCE, thousands of years before these swashbucklers began spreading fear across the Caribbean, pirates prowled the Mediterranean, raiding merchant ships and threatening vital trade routes. However, despite all efforts and the might of various ancient states, piracy could not be stopped. The situation remained unchanged for thousands of years. Only when the pirates directly threatened the interests of ancient Rome did the Roman Republic organise a massive fleet to eliminate piracy. Under the command of the Roman general Pompey, Rome eradicated piracy, transforming the Mediterranean into 'Mare Nostrum' (Our Sea).`,
        },
        {
          id: 'c19-r1-p2-B',
          label: 'B',
          content: `Although piracy in the Mediterranean is first recorded in ancient Egypt during the reign of Pharaoh Amenhotep III (c 1390-1353 BCE), it is reasonable to assume it predated this powerful civilisation. This is partly due to the great importance the Mediterranean held at this time, and partly due to its geography. While the Mediterranean region is predominantly fertile, some parts are rugged and hilly, even mountainous. In the ancient times, the inhabitants of these areas relied heavily on marine resources, including fish and salt. Most had their own boats, possessed good seafaring skills, and unsurpassed knowledge of the local coastline and sailing routes. Thus, it is not surprising that during hardships, these men turned to piracy. Geography itself further benefited the pirates, with the numerous coves along the coast providing places for them to hide their boats and strike undetected. Before the invention of ocean-going caravels in the 15th century, ships could not easily cross long distances over open water. Thus, in the ancient world most were restricted to a few well-known navigable routes that followed the coastline. Caught in a trap, a slow merchant ship laden with goods had no other option but to surrender. In addition, knowledge of the local area helped the pirates to avoid retaliation once a state fleet arrived.`,
        },
        {
          id: 'c19-r1-p2-C',
          label: 'C',
          content: `One should also add that it was not unknown in the first and second millennia BCE for governments to resort to pirates' services, especially during wartime, employing their skills and numbers against their opponents. A pirate fleet would serve in the first wave of attack, preparing the way for the navy. Some of the regions were known for providing safe harbours to pirates, who, in return, boosted the local economy.`,
        },
        {
          id: 'c19-r1-p2-D',
          label: 'D',
          content: `The first known record of a named group of Mediterranean pirates, made during the rule of ancient Egyptian Pharaoh Akhenaten (c 1353-1336 BCE), was in the Amarna Letters. These were extracts of diplomatic correspondence between the pharaoh and his allies, and covered many pressing issues, including piracy. It seems the pharaoh was troubled by two distinct pirate groups, the Lukka and the Sherden. Despite the Egyptian fleet's best efforts, the pirates continued to cause substantial disruption to regional commerce. In the letters, the king of Alashiya (modern Cyprus) rejected Akhenaten's claims of a connection with the Lukka (based in modern-day Turkey). The king assured Akhenaten he was prepared to punish any of his subjects involved in piracy.`,
        },
        {
          id: 'c19-r1-p2-E',
          label: 'E',
          content: `The ancient Greek world's experience of piracy was different from that of Egyptian rulers. While Egypt's power was land-based, the ancient Greeks relied on the Mediterranean in almost all aspects of life, from trade to warfare. Interestingly, in his works the Iliad and the Odyssey, the ancient Greek writer Homer not only condones, but praises the lifestyle and actions of pirates. The opinion remained unchanged in the following centuries. The ancient Greek historian Thucydides, for instance, glorified pirates' daring attacks on ships or even cities. For Greeks, piracy was a part of everyday life. Even high-ranking members of the state were not beyond engaging in such activities. According to the Greek orator Demosthenes, in 355 BCE, Athenian ambassadors made a detour from their official travel to capture a ship sailing from Egypt, taking the wealth found onboard for themselves! The Greeks' liberal approach towards piracy does not mean they always tolerated it, but attempts to curtail piracy were hampered by the large number of pirates operating in the Mediterranean.`,
        },
        {
          id: 'c19-r1-p2-F',
          label: 'F',
          content: `The rising power of ancient Rome required the Roman Republic to deal with piracy in the Mediterranean. While piracy was a serious issue for the Republic, Rome profited greatly from its existence. Pirate raids provided a steady source of slaves, essential for Rome's agriculture and mining industries. But this arrangement could work only while the pirates left Roman interests alone. Pirate attacks on grain ships, which were essential to Roman citizens, led to angry voices in the Senate, demanding punishment of the culprits. Rome, however, did nothing, further encouraging piracy. By the 1st century BCE, emboldened pirates kidnapped prominent Roman dignitaries, asking for a large ransom to be paid. Their most famous hostage was none other than Julius Caesar, captured in 75 BCE.`,
        },
        {
          id: 'c19-r1-p2-G',
          label: 'G',
          content: `By now, Rome was well aware that pirates had outlived their usefulness. The time had come for concerted action. In 67 BCE, a new law granted Pompey vast funds to combat the Mediterranean menace. Taking personal command, Pompey divided the entire Mediterranean into 13 districts, assigning a fleet and commander to each. After cleansing one district of pirates, the fleet would join another in the next district. The process continued until the entire Mediterranean was free of pirates. Although thousands of pirates died at the hands of Pompey's troops, as a long-term solution to the problem, many more were offered land in fertile areas located far from the sea. Instead of a maritime menace, Rome got productive farmers that further boosted its economy.`,
        },
      ],
    },
    {
      id: 'c19-r1-p3',
      passageNumber: 3,
      title: 'The persistence and peril of misinformation',
      subtitle: 'Brian Southwell looks at how human brains verify information and discusses some of the challenges of battling widespread falsehoods',
      paragraphs: [
        {
          id: 'c19-r1-p3-1',
          label: '1',
          content: `Misinformation - both deliberately promoted and accidentally shared - is perhaps an inevitable part of the world in which we live, but it is not a new problem. People likely have lied to one another for roughly as long as verbal communication has existed. Deceiving others can offer an apparent opportunity to gain strategic advantage, to motivate others to action, or even to protect interpersonal bonds. Moreover, people inadvertently have been sharing inaccurate information with one another for thousands of years.`,
        },
        {
          id: 'c19-r1-p3-2',
          label: '2',
          content: `However, we currently live in an era in which technology enables information to reach large audiences distributed across the globe, and thus the potential for immediate and widespread effects from misinformation now looms larger than in the past. Yet the means to correct misinformation might, over time, be found in those same patterns of mass communication and of the facilitated spread of information.`,
        },
        {
          id: 'c19-r1-p3-3',
          label: '3',
          content: `The main worry regarding misinformation is its potential to unduly influence attitudes and behavior, leading people to think and act differently than they would if they were correctly informed, as suggested by the research teams of Stephan Lewandowsky of the University of Bristol and Elizabeth Marsh of Duke University, among others. In other words, we worry that misinformation might lead people to hold misperceptions (or false beliefs) and that these misperceptions, especially when they occur among large groups of people, may have detrimental, downstream consequences for health, social harmony, and the political climate.`,
        },
        {
          id: 'c19-r1-p3-4',
          label: '4',
          content: `At least three observations related to misinformation in the contemporary mass-media environment warrant the attention of researchers, policy makers, and really everyone who watches television, listens to the radio, or reads information online. First of all, people who encounter misinformation tend to believe it, at least initially. Secondly, electronic and print media often do not block many types of misinformation before it appears in content available to large audiences. Thirdly, countering misinformation once it has enjoyed wide exposure can be a resource-intensive effort.`,
        },
        {
          id: 'c19-r1-p3-5',
          label: '5',
          content: `Knowing what happens when people initially encounter misinformation holds tremendous importance for estimating the potential for subsequent problems. Although it is fairly routine for individuals to come across information that is false, the question of exactly how - and when - we mentally label information as true or false has garnered philosophical debate. The dilemma is neatly summarized by a contrast between how the 17th-century philosophers Rene Descartes and Baruch Spinoza described human information engagement, with conflicting predictions that only recently have been empirically tested in robust ways. Descartes argued that a person only accepts or rejects information after considering its truth or falsehood; Spinoza argued that people accept all encountered information (or misinformation) by default and then subsequently verify or reject it through a separate cognitive process. In recent decades, empirical evidence from the research teams of Erik Asp of the University of Chicago and Daniel Gilbert at Harvard University, among others, has supported Spinoza's account: people appear to encode all new information as if it were true, even if only momentarily, and later tag the information as being either true or false, a pattern that seems consistent with the observation that mental resources for skepticism physically reside in a different part of the brain than the resources used in perceiving and encoding.`,
        },
        {
          id: 'c19-r1-p3-6',
          label: '6',
          content: `What about our second observation that misinformation often can appear in electronic or print media without being preemptively blocked? In support of this, one might consider the nature of regulatory structures in the United States: regulatory agencies here tend to focus on post hoc detection of broadcast information. Organizations such as the Food and Drug Administration (FDA) offer considerable monitoring and notification functions, but these roles typically do not involve preemptive censoring. The FDA oversees direct-to-consumer prescription drug advertising, for example, and has developed mechanisms such as the 'Bad Ad' program, through which people can report advertising in apparent violation of FDA guidelines on drug risks. Such programs, although laudable and useful, do not keep false advertising off the airwaves. In addition, even misinformation that is successfully corrected can continue to affect attitudes.`,
        },
        {
          id: 'c19-r1-p3-7',
          label: '7',
          content: `This leads us to our third observation: a campaign to correct misinformation, even if rhetorically compelling, requires resources and planning to accomplish necessary reach and frequency. For corrective campaigns to be persuasive, audiences need to be able to comprehend them, which requires either effort to frame messages in ways that are accessible or effort to educate and sensitize audiences to the possibility of misinformation. That some audiences might be unaware of the potential for misinformation also suggests the utility of media literacy efforts as early as elementary school. Even with journalists and scholars pointing to the phenomenon of 'fake news', people do not distinguish between demonstrably false stories and those based in fact when scanning and processing written information.`,
        },
        {
          id: 'c19-r1-p3-8',
          label: '8',
          content: `We live at a time when widespread misinformation is common. Yet at this time many people also are passionately developing potential solutions and remedies. The journey forward undoubtedly will be a long and arduous one. Future remedies will require not only continued theoretical consideration but also the development and maintenance of consistent monitoring tools and a recognition among fellow members of society that claims which find prominence in the media that are insufficiently based in scientific consensus and social reality should be countered. Misinformation arises as a result of human fallibility and human information needs. To overcome the worst effects of the phenomenon, we will need coordinated efforts over time, rather than any singular one-time panacea we could hope to offer.`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // Passage 1: Questions 1-7 (True / False / Not Given)
    {
      id: 'c19-r1-g1',
      passageId: 'c19-r1-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1-7',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1-7 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 1,
      endQuestionNumber: 7,
      questions: [
        {
          id: 'c19-r1-q1',
          questionNumber: 1,
          prompt:
            "People had expected Andy Murray to become the world's top tennis player for at least five years before 2016.",
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 1 states: 'Yet five years previously, he had been regarded as a talented outsider who entered but never won the major tournaments.' This contradicts the statement that people had expected him to become world number one for at least five years before 2016.",
          evidenceQuote: 'Yet five years previously, he had been regarded as a talented outsider who entered but never won the major tournaments.',
          paragraphRef: '1',
        },
        {
          id: 'c19-r1-q2',
          questionNumber: 2,
          prompt: 'The change that Andy Murray made to his rackets attracted a lot of attention.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 1 states: 'Another change was so subtle as to pass more or less unnoticed... in 2012 he switched to a synthetic string for the mains.' It did not attract a lot of attention; it passed unnoticed.",
          evidenceQuote: 'Another change was so subtle as to pass more or less unnoticed.',
          paragraphRef: '1',
        },
        {
          id: 'c19-r1-q3',
          questionNumber: 3,
          prompt: "Most of the world's top players take a professional racket stringer on tour with them.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 2 quotes Colin Triplow ('Touring professionals have their rackets customised to their specific needs') and notes players have rackets customized, but does not state whether most top players take a stringer on tour with them.",
          evidenceQuote: 'Touring professionals have their rackets customised to their specific needs',
          paragraphRef: '2',
        },
        {
          id: 'c19-r1-q4',
          questionNumber: 4,
          prompt: 'Mike and Bob Bryan use rackets that are light in comparison to the majority of rackets.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 2 states: 'The rackets they use now weigh more than the average model', contradicting the claim that their rackets are light.",
          evidenceQuote: 'The rackets they use now weigh more than the average model',
          paragraphRef: '2',
        },
        {
          id: 'c19-r1-q5',
          questionNumber: 5,
          prompt: 'Werner Fischer played with a spaghetti-strung racket that he designed himself.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 3 mentions: 'when the amateur German tennis player Werner Fischer started playing with the so-called spaghetti-strung racket.' The text does not say whether he designed it himself.",
          evidenceQuote: 'when the amateur German tennis player Werner Fischer started playing with the so-called spaghetti-strung racket',
          paragraphRef: '3',
        },
        {
          id: 'c19-r1-q6',
          questionNumber: 6,
          prompt: 'The weather can affect how professional players adjust the strings on their rackets.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 3 states: 'They will continually change it depending on various factors including the court surface, climatic conditions, and game styles.' Climatic conditions means weather.",
          evidenceQuote: 'depending on various factors including the court surface, climatic conditions, and game styles',
          paragraphRef: '3',
        },
        {
          id: 'c19-r1-q7',
          questionNumber: 7,
          prompt:
            'It was believed that the change Pete Sampras made to his rackets contributed to his strong serve.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 5 states: 'much of the serving power of US professional player Pete Sampras was attributed to the addition of four to five lead weights onto his rackets.'",
          evidenceQuote: 'much of the serving power of US professional player Pete Sampras was attributed to the addition of four to five lead weights onto his rackets',
          paragraphRef: '5',
        },
      ],
    },

    // Passage 1: Questions 8-13 (Note completion)
    {
      id: 'c19-r1-g2',
      passageId: 'c19-r1-p1',
      questionType: 'note_completion',
      title: 'The tennis racket and how it has changed',
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 8-13 on your answer sheet.',
      startQuestionNumber: 8,
      endQuestionNumber: 13,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      questions: [
        {
          id: 'c19-r1-q8',
          questionNumber: 8,
          prompt: 'Mike and Bob Bryan made changes to the types of [8] used on their racket frames.',
          answerKey: 'paint',
          acceptedAlternatives: ['paint'],
          explanation:
            "Paragraph 2 states: 'They explain how they have adjusted not only racket length, but even experimented with different kinds of paint.'",
          evidenceQuote: 'experimented with different kinds of paint',
          paragraphRef: '2',
        },
        {
          id: 'c19-r1-q9',
          questionNumber: 9,
          prompt:
            'Players were not allowed to use the spaghetti-strung racket because of the amount of [9] it created.',
          answerKey: 'topspin',
          acceptedAlternatives: ['topspin'],
          explanation:
            "Paragraph 3 states: 'It created a string bed that generated so much topspin that it was quickly banned by the International Tennis Federation.'",
          evidenceQuote: 'generated so much topspin that it was quickly banned',
          paragraphRef: '3',
        },
        {
          id: 'c19-r1-q10',
          questionNumber: 10,
          prompt:
            "Changes to rackets can be regarded as being as important as players' diets or the [10] they do.",
          answerKey: 'training',
          acceptedAlternatives: ['training'],
          explanation:
            "Paragraph 3 states: 'Today it is, in many ways, an aspect of the game that is equal in significance to nutrition or training.' (nutrition = diets).",
          evidenceQuote: 'equal in significance to nutrition or training',
          paragraphRef: '3',
        },
        {
          id: 'c19-r1-q11',
          questionNumber: 11,
          prompt: 'All rackets used to have natural strings made from the [11] of animals.',
          answerKey: 'intestines',
          acceptedAlternatives: ['gut'],
          explanation:
            "Paragraph 4 states: 'At one time, all tennis rackets were strung with natural gut made from the outer layer of sheep or cow intestines.' Both intestines and gut are accepted in the official key.",
          evidenceQuote: 'made from the outer layer of sheep or cow intestines',
          paragraphRef: '4',
        },
        {
          id: 'c19-r1-q12',
          questionNumber: 12,
          prompt: 'Pete Sampras had metal [12] put into the frames of his rackets.',
          answerKey: 'weights',
          acceptedAlternatives: ['weights'],
          explanation:
            "Paragraph 5 states: 'much of the serving power of US professional player Pete Sampras was attributed to the addition of four to five lead weights onto his rackets' (lead is a metal).",
          evidenceQuote: 'addition of four to five lead weights onto his rackets',
          paragraphRef: '5',
        },
        {
          id: 'c19-r1-q13',
          questionNumber: 13,
          prompt: 'Gonçalo Oliveira changed the [13] on his racket handles.',
          answerKey: 'grips',
          acceptedAlternatives: ['grips'],
          explanation:
            "Paragraph 5 states: 'The professional Portuguese player Gonçalo Oliveira replaced the original grips of his rackets with something thinner...'",
          evidenceQuote: 'replaced the original grips of his rackets with something thinner',
          paragraphRef: '5',
        },
      ],
    },

    // Passage 2: Questions 14-19 (Matching Information)
    {
      id: 'c19-r1-g3',
      passageId: 'c19-r1-p2',
      questionType: 'matching_information',
      title: 'Questions 14-19',
      instructions:
        'Reading Passage 2 has seven paragraphs, A-G.\nWhich paragraph contains the following information?\nWrite the correct letter, A-G, in boxes 14-19 on your answer sheet.\nNB You may use any letter more than once.',
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
          id: 'c19-r1-q14',
          questionNumber: 14,
          prompt: 'a reference to a denial of involvement in piracy',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph D states: 'In the letters, the king of Alashiya (modern Cyprus) rejected Akhenaten's claims of a connection with the Lukka... The king assured Akhenaten he was prepared to punish any of his subjects involved in piracy.'",
          evidenceQuote: "the king of Alashiya (modern Cyprus) rejected Akhenaten's claims of a connection with the Lukka",
          paragraphRef: 'D',
        },
        {
          id: 'c19-r1-q15',
          questionNumber: 15,
          prompt: 'details of how a campaign to eradicate piracy was carried out',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            "Paragraph G explains: 'Pompey divided the entire Mediterranean into 13 districts, assigning a fleet and commander to each. After cleansing one district of pirates, the fleet would join another...'",
          evidenceQuote: 'Pompey divided the entire Mediterranean into 13 districts, assigning a fleet and commander to each',
          paragraphRef: 'G',
        },
        {
          id: 'c19-r1-q16',
          questionNumber: 16,
          prompt:
            'a mention of the circumstances in which states in the ancient world would make use of pirates',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph C states: 'it was not unknown in the first and second millennia BCE for governments to resort to pirates' services, especially during wartime, employing their skills and numbers against their opponents.'",
          evidenceQuote: "governments to resort to pirates' services, especially during wartime",
          paragraphRef: 'C',
        },
        {
          id: 'c19-r1-q17',
          questionNumber: 17,
          prompt: 'a reference to how people today commonly view pirates',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph A states: 'When one mentions pirates, an image springs to most people's minds of a crew of misfits, daredevils and adventurers in command of a tall sailing ship in the Caribbean Sea.'",
          evidenceQuote: "an image springs to most people's minds of a crew of misfits, daredevils and adventurers",
          paragraphRef: 'A',
        },
        {
          id: 'c19-r1-q18',
          questionNumber: 18,
          prompt: 'an explanation of how some people were encouraged not to return to piracy',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            "Paragraph G states: 'as a long-term solution to the problem, many more were offered land in fertile areas located far from the sea. Instead of a maritime menace, Rome got productive farmers...'",
          evidenceQuote: 'many more were offered land in fertile areas located far from the sea',
          paragraphRef: 'G',
        },
        {
          id: 'c19-r1-q19',
          questionNumber: 19,
          prompt: 'a mention of the need for many sailing vessels to stay relatively close to land',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph B states: 'Before the invention of ocean-going caravels in the 15th century, ships could not easily cross long distances over open water. Thus, in the ancient world most were restricted to a few well-known navigable routes that followed the coastline.'",
          evidenceQuote: 'most were restricted to a few well-known navigable routes that followed the coastline',
          paragraphRef: 'B',
        },
      ],
    },

    // Passage 2: Questions 20 and 21 (Multiple Choice Multi-Select)
    {
      id: 'c19-r1-g4',
      passageId: 'c19-r1-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 20 and 21',
      instructions:
        'Choose TWO letters, A-E.\nWrite the correct letters in boxes 20 and 21 on your answer sheet.\nWhich TWO of the following statements does the writer make about inhabitants of the Mediterranean region in the ancient world?',
      startQuestionNumber: 20,
      endQuestionNumber: 21,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'They often used stolen vessels to carry out pirate attacks.' },
        { key: 'B', text: 'They managed to escape capture by the authorities because they knew the area so well.' },
        { key: 'C', text: 'They paid for information about the routes merchant ships would take.' },
        { key: 'D', text: 'They depended more on the sea for their livelihood than on farming.' },
        { key: 'E', text: 'They stored many of the goods taken in pirate attacks in coves along the coastline.' },
      ],
      questions: [
        {
          id: 'c19-r1-q20',
          questionNumber: 20,
          prompt:
            'Which TWO of the following statements does the writer make about inhabitants of the Mediterranean region in the ancient world?',
          options: [
            { key: 'A', text: 'They often used stolen vessels to carry out pirate attacks.' },
            { key: 'B', text: 'They managed to escape capture by the authorities because they knew the area so well.' },
            { key: 'C', text: 'They paid for information about the routes merchant ships would take.' },
            { key: 'D', text: 'They depended more on the sea for their livelihood than on farming.' },
            { key: 'E', text: 'They stored many of the goods taken in pirate attacks in coves along the coastline.' },
          ],
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation:
            "In Paragraph B: 'some parts are rugged and hilly, even mountainous. In the ancient times, the inhabitants of these areas relied heavily on marine resources, including fish and salt... unsurpassed knowledge of the local coastline... knowledge of the local area helped the pirates to avoid retaliation once a state fleet arrived.'",
          evidenceQuote: 'relied heavily on marine resources... knowledge of the local area helped the pirates to avoid retaliation once a state fleet arrived',
          paragraphRef: 'B',
        },
        {
          id: 'c19-r1-q21',
          questionNumber: 21,
          prompt:
            'Which TWO of the following statements does the writer make about inhabitants of the Mediterranean region in the ancient world?',
          options: [
            { key: 'A', text: 'They often used stolen vessels to carry out pirate attacks.' },
            { key: 'B', text: 'They managed to escape capture by the authorities because they knew the area so well.' },
            { key: 'C', text: 'They paid for information about the routes merchant ships would take.' },
            { key: 'D', text: 'They depended more on the sea for their livelihood than on farming.' },
            { key: 'E', text: 'They stored many of the goods taken in pirate attacks in coves along the coastline.' },
          ],
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation:
            "In Paragraph B: 'the inhabitants of these areas relied heavily on marine resources, including fish and salt... knowledge of the local area helped the pirates to avoid retaliation once a state fleet arrived.' (Options B and D).",
          evidenceQuote: 'relied heavily on marine resources... knowledge of the local area helped the pirates to avoid retaliation',
          paragraphRef: 'B',
        },
      ],
    },

    // Passage 2: Questions 22 and 23 (Multiple Choice Multi-Select)
    {
      id: 'c19-r1-g5',
      passageId: 'c19-r1-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 22 and 23',
      instructions:
        'Choose TWO letters, A-E.\nWrite the correct letters in boxes 22 and 23 on your answer sheet.\nWhich TWO of the following statements does the writer make about piracy and ancient Greece?',
      startQuestionNumber: 22,
      endQuestionNumber: 23,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'The state estimated that very few people were involved in piracy.' },
        { key: 'B', text: 'Attitudes towards piracy changed shortly after the Iliad and the Odyssey were written.' },
        { key: 'C', text: 'Important officials were known to occasionally take part in piracy.' },
        { key: 'D', text: 'Every citizen regarded pirate attacks on cities as unacceptable.' },
        { key: 'E', text: 'A favourable view of piracy is evident in certain ancient Greek texts.' },
      ],
      questions: [
        {
          id: 'c19-r1-q22',
          questionNumber: 22,
          prompt:
            'Which TWO of the following statements does the writer make about piracy and ancient Greece?',
          options: [
            { key: 'A', text: 'The state estimated that very few people were involved in piracy.' },
            { key: 'B', text: 'Attitudes towards piracy changed shortly after the Iliad and the Odyssey were written.' },
            { key: 'C', text: 'Important officials were known to occasionally take part in piracy.' },
            { key: 'D', text: 'Every citizen regarded pirate attacks on cities as unacceptable.' },
            { key: 'E', text: 'A favourable view of piracy is evident in certain ancient Greek texts.' },
          ],
          answerKey: ['C', 'E'],
          acceptedAlternatives: ['C', 'E'],
          explanation:
            "In Paragraph E: 'Homer not only condones, but praises the lifestyle and actions of pirates... Thucydides, for instance, glorified pirates' daring attacks... Even high-ranking members of the state were not beyond engaging in such activities. According to the Greek orator Demosthenes, in 355 BCE, Athenian ambassadors made a detour from their official travel to capture a ship...'",
          evidenceQuote: 'praises the lifestyle and actions of pirates... Even high-ranking members of the state were not beyond engaging in such activities',
          paragraphRef: 'E',
        },
        {
          id: 'c19-r1-q23',
          questionNumber: 23,
          prompt:
            'Which TWO of the following statements does the writer make about piracy and ancient Greece?',
          options: [
            { key: 'A', text: 'The state estimated that very few people were involved in piracy.' },
            { key: 'B', text: 'Attitudes towards piracy changed shortly after the Iliad and the Odyssey were written.' },
            { key: 'C', text: 'Important officials were known to occasionally take part in piracy.' },
            { key: 'D', text: 'Every citizen regarded pirate attacks on cities as unacceptable.' },
            { key: 'E', text: 'A favourable view of piracy is evident in certain ancient Greek texts.' },
          ],
          answerKey: ['C', 'E'],
          acceptedAlternatives: ['C', 'E'],
          explanation:
            "In Paragraph E: 'Homer not only condones, but praises the lifestyle and actions of pirates' (E) and 'Even high-ranking members of the state were not beyond engaging in such activities' (C).",
          evidenceQuote: 'Homer not only condones, but praises the lifestyle and actions of pirates... high-ranking members of the state were not beyond engaging',
          paragraphRef: 'E',
        },
      ],
    },

    // Passage 2: Questions 24-26 (Summary Completion Words)
    {
      id: 'c19-r1-g6',
      passageId: 'c19-r1-p2',
      questionType: 'summary_completion_words',
      title: 'Ancient Rome and piracy',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 24-26 on your answer sheet.',
      startQuestionNumber: 24,
      endQuestionNumber: 26,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      questions: [
        {
          id: 'c19-r1-q24',
          questionNumber: 24,
          prompt:
            'attacks on vessels transporting [24] to Rome resulted in calls for [25] for the pirates responsible.',
          answerKey: 'grain',
          acceptedAlternatives: ['grain'],
          explanation:
            "Paragraph F states: 'Pirate attacks on grain ships, which were essential to Roman citizens, led to angry voices in the Senate, demanding punishment of the culprits.'",
          evidenceQuote: 'Pirate attacks on grain ships, which were essential to Roman citizens',
          paragraphRef: 'F',
        },
        {
          id: 'c19-r1-q25',
          questionNumber: 25,
          prompt: 'resulted in calls for [25] for the pirates responsible.',
          answerKey: 'punishment',
          acceptedAlternatives: ['punishment'],
          explanation:
            "Paragraph F states: 'demanding punishment of the culprits.'",
          evidenceQuote: 'demanding punishment of the culprits',
          paragraphRef: 'F',
        },
        {
          id: 'c19-r1-q26',
          questionNumber: 26,
          prompt: 'with some pirates demanding a [26] for the return of the Roman officials they captured.',
          answerKey: 'ransom',
          acceptedAlternatives: ['ransom'],
          explanation:
            "Paragraph F states: 'By the 1st century BCE, emboldened pirates kidnapped prominent Roman dignitaries, asking for a large ransom to be paid.'",
          evidenceQuote: 'kidnapped prominent Roman dignitaries, asking for a large ransom to be paid',
          paragraphRef: 'F',
        },
      ],
    },

    // Passage 3: Questions 27-30 (Multiple Choice Single)
    {
      id: 'c19-r1-g7',
      passageId: 'c19-r1-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27-30',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27-30 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c19-r1-q27',
          questionNumber: 27,
          prompt: 'What point does the writer make about misinformation in the first paragraph?',
          options: [
            { key: 'A', text: 'Misinformation is a relatively recent phenomenon.' },
            { key: 'B', text: 'Some people find it easy to identify misinformation.' },
            { key: 'C', text: 'Misinformation changes as it is passed from one person to another.' },
            { key: 'D', text: 'There may be a number of reasons for the spread of misinformation.' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 1 mentions reasons for deception and spreading inaccurate info: 'to gain strategic advantage, to motivate others to action, or even to protect interpersonal bonds.' and 'people inadvertently have been sharing inaccurate information'. Hence, there may be a number of reasons for the spread of misinformation.",
          evidenceQuote: 'Deceiving others can offer an apparent opportunity to gain strategic advantage, to motivate others to action, or even to protect interpersonal bonds',
          paragraphRef: '1',
        },
        {
          id: 'c19-r1-q28',
          questionNumber: 28,
          prompt: 'What does the writer say about the role of technology?',
          options: [
            { key: 'A', text: 'It may at some point provide us with a solution to misinformation.' },
            { key: 'B', text: 'It could fundamentally alter the way in which people regard information.' },
            { key: 'C', text: 'It has changed the way in which organisations use misinformation.' },
            { key: 'D', text: 'It has made it easier for people to check whether information is accurate.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 2 states: 'Yet the means to correct misinformation might, over time, be found in those same patterns of mass communication and of the facilitated spread of information.'",
          evidenceQuote: 'Yet the means to correct misinformation might, over time, be found in those same patterns of mass communication',
          paragraphRef: '2',
        },
        {
          id: 'c19-r1-q29',
          questionNumber: 29,
          prompt: 'What is the writer doing in the fourth paragraph?',
          options: [
            { key: 'A', text: 'comparing the different opinions people have of misinformation' },
            { key: 'B', text: 'explaining how the effects of misinformation have changed over time' },
            { key: 'C', text: 'outlining which issues connected with misinformation are significant today' },
            { key: 'D', text: 'describing the attitude of policy makers towards misinformation in the media' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 4 starts: 'At least three observations related to misinformation in the contemporary mass-media environment warrant the attention of researchers, policy makers, and really everyone...' and proceeds to outline the three key issues.",
          evidenceQuote: 'At least three observations related to misinformation in the contemporary mass-media environment warrant the attention',
          paragraphRef: '4',
        },
        {
          id: 'c19-r1-q30',
          questionNumber: 30,
          prompt: 'What point does the writer make about regulation in the USA?',
          options: [
            { key: 'A', text: 'The guidelines issued by the FDA need to be simplified.' },
            { key: 'B', text: "Regulation does not affect people's opinions of new prescription drugs." },
            { key: 'C', text: 'The USA has more regulatory bodies than most other countries.' },
            { key: 'D', text: 'Regulation fails to prevent misinformation from appearing in the media.' },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 6 states: 'regulatory agencies here tend to focus on post hoc detection of broadcast information... these roles typically do not involve preemptive censoring... Such programs, although laudable and useful, do not keep false advertising off the airwaves.'",
          evidenceQuote: 'regulatory agencies here tend to focus on post hoc detection... do not keep false advertising off the airwaves',
          paragraphRef: '6',
        },
      ],
    },

    // Passage 3: Questions 31-36 (Summary Completion with Options)
    {
      id: 'c19-r1-g8',
      passageId: 'c19-r1-p3',
      questionType: 'summary_completion_options',
      title: 'What happens when people encounter misinformation?',
      instructions:
        'Complete the summary using the list of phrases, A-J, below.\nWrite the correct letter, A-J, in boxes 31-36 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 36,
      optionsList: [
        { key: 'A', text: 'constant conflict' },
        { key: 'B', text: 'additional evidence' },
        { key: 'C', text: 'different locations' },
        { key: 'D', text: 'experimental subjects' },
        { key: 'E', text: 'short period' },
        { key: 'F', text: 'extreme distrust' },
        { key: 'G', text: 'frequent exposure' },
        { key: 'H', text: 'mental operation' },
        { key: 'I', text: 'dubious reason' },
        { key: 'J', text: 'different ideas' },
      ],
      contentWithGaps: `What happens when people encounter misinformation?
Although people have [[31]] to misinformation, there is debate about precisely how and when we label something as true or untrue. The philosophers Descartes and Spinoza had [[32]] about how people engage with information. While Descartes believed that people accept or reject information after considering whether it is true or not, Spinoza argued that people accepted all information they encountered (and by default misinformation) and did not verify or reject it until afterwards. Moreover, Spinoza believed that a distinct [[33]] is involved in these stages. Recent research has provided [[34]] for Spinoza's theory and it would appear that people accept all encountered information as if it were true, even if this is for an extremely [[35]], and do not label the information as true or false until later. This is consistent with the fact that the resources for scepticism and the resources for perceiving and encoding are in [[36]] in the brain.`,
      questions: [
        {
          id: 'c19-r1-q31',
          questionNumber: 31,
          prompt:
            'Although people have [31] to misinformation, there is debate about precisely how and when we label something as true or untrue.',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            "Paragraph 5 states: 'Although it is fairly routine for individuals to come across information that is false...' ('routine to come across' = frequent exposure, Option G).",
          evidenceQuote: 'Although it is fairly routine for individuals to come across information that is false',
          paragraphRef: '5',
        },
        {
          id: 'c19-r1-q32',
          questionNumber: 32,
          prompt:
            'The philosophers Descartes and Spinoza had [32] about how people engage with information.',
          answerKey: 'J',
          acceptedAlternatives: ['J'],
          explanation:
            "Paragraph 5 states: 'The dilemma is neatly summarized by a contrast between how the 17th-century philosophers Rene Descartes and Baruch Spinoza described human information engagement, with conflicting predictions...' ('conflicting predictions' = different ideas, Option J).",
          evidenceQuote: 'conflicting predictions that only recently have been empirically tested',
          paragraphRef: '5',
        },
        {
          id: 'c19-r1-q33',
          questionNumber: 33,
          prompt:
            'Moreover, Spinoza believed that a distinct [33] is involved in these stages.',
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Paragraph 5 states: 'Spinoza argued that people accept all encountered information (or misinformation) by default and then subsequently verify or reject it through a separate cognitive process.' ('separate cognitive process' = distinct mental operation, Option H).",
          evidenceQuote: 'subsequently verify or reject it through a separate cognitive process',
          paragraphRef: '5',
        },
        {
          id: 'c19-r1-q34',
          questionNumber: 34,
          prompt:
            "Recent research has provided [34] for Spinoza's theory...",
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 5 states: 'In recent decades, empirical evidence from the research teams of Erik Asp... and Daniel Gilbert... has supported Spinoza's account...' ('empirical evidence has supported' = additional evidence, Option B).",
          evidenceQuote: "empirical evidence from the research teams of Erik Asp... has supported Spinoza's account",
          paragraphRef: '5',
        },
        {
          id: 'c19-r1-q35',
          questionNumber: 35,
          prompt:
            '...and it would appear that people accept all encountered information as if it were true, even if this is for an extremely [35], and do not label the information as true or false until later.',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph 5 states: 'people appear to encode all new information as if it were true, even if only momentarily...' ('momentarily' = extremely short period, Option E).",
          evidenceQuote: 'people appear to encode all new information as if it were true, even if only momentarily',
          paragraphRef: '5',
        },
        {
          id: 'c19-r1-q36',
          questionNumber: 36,
          prompt:
            'This is consistent with the fact that the resources for scepticism and the resources for perceiving and encoding are in [36] in the brain.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 5 states: 'consistent with the observation that mental resources for skepticism physically reside in a different part of the brain than the resources used in perceiving and encoding.' ('reside in a different part of the brain' = different locations, Option C).",
          evidenceQuote: 'mental resources for skepticism physically reside in a different part of the brain',
          paragraphRef: '5',
        },
      ],
    },

    // Passage 3: Questions 37-40 (Yes / No / Not Given)
    {
      id: 'c19-r1-g9',
      passageId: 'c19-r1-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 37-40',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 37-40 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 37,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c19-r1-q37',
          questionNumber: 37,
          prompt:
            'Campaigns designed to correct misinformation will fail to achieve their purpose if people are unable to understand them.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 7 states: 'For corrective campaigns to be persuasive, audiences need to be able to comprehend them, which requires either effort to frame messages in ways that are accessible or effort to educate and sensitize audiences...'",
          evidenceQuote: 'For corrective campaigns to be persuasive, audiences need to be able to comprehend them',
          paragraphRef: '7',
        },
        {
          id: 'c19-r1-q38',
          questionNumber: 38,
          prompt: 'Attempts to teach elementary school students about misinformation have been opposed.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 7 suggests: 'utility of media literacy efforts as early as elementary school.' However, there is no mention of whether attempts to teach elementary students have been opposed.",
          evidenceQuote: 'suggests the utility of media literacy efforts as early as elementary school',
          paragraphRef: '7',
        },
        {
          id: 'c19-r1-q39',
          questionNumber: 39,
          prompt:
            'It may be possible to overcome the problem of misinformation in a relatively short period.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 8 states: 'The journey forward undoubtedly will be a long and arduous one... To overcome the worst effects of the phenomenon, we will need coordinated efforts over time, rather than any singular one-time panacea we could hope to offer.' This contradicts the statement.",
          evidenceQuote: 'The journey forward undoubtedly will be a long and arduous one... rather than any singular one-time panacea',
          paragraphRef: '8',
        },
        {
          id: 'c19-r1-q40',
          questionNumber: 40,
          prompt:
            "The need to keep up with new information is hugely exaggerated in today's world.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 8 mentions that misinformation arises partly as a result of 'human information needs', but does not say that the need to keep up with new information is hugely exaggerated.",
          evidenceQuote: 'human fallibility and human information needs',
          paragraphRef: '8',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 19 Academic Reading Test 1',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export function ingestCambridge19ReadingTest1(authorId?: string): {
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
} {
  const data = getCambridge19ReadingTest1Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 19 Reading Test 1 data validation failed:\n- ${errors.join('\n- ')}`
    );
  }

  // Resolve author
  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = db
      .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
      .get() as { id: string } | undefined;
    resolvedAuthorId = adminUser?.id;
  }
  if (!resolvedAuthorId) {
    const anyUser = db
      .prepare('SELECT id FROM users LIMIT 1')
      .get() as { id: string } | undefined;
    resolvedAuthorId = anyUser?.id;
  }
  if (!resolvedAuthorId) {
    resolvedAuthorId = 'f8b2e30a-ae78-435a-b9d3-a22f34452016';
  }

  const existingTest = db
    .prepare(
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%19%Academic%Reading%Test 1%' LIMIT 1"
    )
    .get(data.title) as { id: string; current_version_number: number } | undefined;

  const now = new Date().toISOString();
  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = db
      .prepare(
        'SELECT id FROM reading_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1'
      )
      .get(testId) as { id: string } | undefined;

    if (existingVersion) {
      versionId = existingVersion.id;
      db.prepare(`
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
