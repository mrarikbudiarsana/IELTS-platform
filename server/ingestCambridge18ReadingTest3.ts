import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge18ReadingTest3Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c18-r3-p1',
      passageNumber: 1,
      title: 'Materials to take us beyond concrete',
      subtitle:
        'Concrete is everywhere, but it\'s bad for the planet, generating large amounts of carbon dioxide – alternatives are being developed\n\nYou should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c18-r3-p1-A',
          label: 'A',
          content: `Concrete is the second most used substance in the global economy, after water - and one of the world's biggest single sources of greenhouse gas emissions. The chemical process by which cement, the key ingredient of concrete, is created results in large quantities of carbon dioxide. The UN estimates that there will be 9.8 billion people living on the planet by mid-century. They will need somewhere to live. If concrete is the only answer to the construction of new cities, then carbon emissions will soar, aggravating global warming. And so scientists have started innovating with other materials, in a scramble for alternatives to a universal commodity that has underpinned our modern life for many years.`,
        },
        {
          id: 'c18-r3-p1-B',
          label: 'B',
          content: `The problem with replacing concrete is that it is so very good at what it does. Chris Cheeseman, an engineering professor at Imperial College London, says the key thing to consider is the extent to which concrete is used around the world, and is likely to continue to be used. 'Concrete is not a high-carbon product. Cement is high carbon, but concrete is not. But it is the scale on which it is used that makes it high carbon. The sheer scale of manufacture is so huge, that is the issue.'`,
        },
        {
          id: 'c18-r3-p1-C',
          label: 'C',
          content: `Not only are the ingredients of concrete relatively cheap and found in abundance in most places around the globe, the stuff itself has marvellous properties: Portland cement, the vital component of concrete, is mouldable and pourable, but quickly sets hard. Cheeseman also notes another advantage: concrete and steel have similar thermal expansion properties, so steel can be used to reinforce concrete, making it far stronger and more flexible as a building material than it could be on its own. According to Cheeseman, all these factors together make concrete hard to beat. 'Concrete is amazing stuff. Making anything with similar properties is going to be very difficult.'`,
        },
        {
          id: 'c18-r3-p1-D',
          label: 'D',
          content: `A possible alternative to concrete is wood. Making buildings from wood may seem like a rather medieval idea, but climate change is driving architects to turn to treated timber as a possible resource. Recent years have seen the emergence of tall buildings constructed almost entirely from timber. Vancouver, Vienna and Brumunddal in Norway are all home to constructed tall, wooden buildings.`,
        },
        {
          id: 'c18-r3-p1-E',
          label: 'E',
          content: `Using wood to construct buildings, however, is not straightforward. Wood expands as it absorbs moisture from the air and is susceptible to pests, not to mention fire. But treating wood and combining it with other materials can improve its properties. Cross-laminated timber is engineered wood. An adhesive is used to stick layers of solid-sawn timber together, crosswise, to form building blocks. This material is light but has the strength of concrete and steel. Construction experts say that wooden buildings can be constructed at a greater speed than ones of concrete and steel and the process, it seems, is quieter.`,
        },
        {
          id: 'c18-r3-p1-F',
          label: 'F',
          content: `Stora Enso is Europe's biggest supplier of cross-laminated timber, and its vice-president Markus Mannström reports that the company is seeing increasing demand globally for building in wood, with climate change concerns the key driver. Finland, with its large forests, where Stora Enso is based, has been leading the way, but the company is seeing a rise in demand for its timber products across the world, including in Asia. Of course, using timber in a building also locks away the carbon that it absorbed as it grew. But even treated wood has its limitations and only when a wider range of construction projects has been proven in practice will it be possible to see wood as a real alternative to concrete in constructing tall buildings.`,
        },
        {
          id: 'c18-r3-p1-G',
          label: 'G',
          content: `Fly ash and slag from iron ore are possible alternatives to cement in a concrete mix. Fly ash, a byproduct of coal-burning power plants, can be incorporated into concrete mixes to make up as much as 15 to 30% of the cement, without harming the strength or durability of the resulting mix. Iron-ore slag, a byproduct of the iron-ore smelting process, can be used in a similar way. Their incorporation into concrete mixes has the potential to reduce greenhouse gas emissions.

But Anna Surgenor, of the UK's Green Building Council, notes that although these waste products can save carbon in the concrete mix, their use is not always straightforward. 'It's possible to replace the cement content in concrete with waste products to lower the overall carbon impact. But there are several calculations that need to be considered across the entire life cycle of the building - these include factoring in where these materials are being shipped from. If they are transported over long distances, using fossil fuels, the use of alternative materials might not make sense from an overall carbon reduction perspective.'`,
        },
        {
          id: 'c18-r3-p1-H',
          label: 'H',
          content: `While these technologies are all promising ideas, they are either unproven or based on materials that are not abundant. In their overview of innovation in the concrete industry, Felix Preston and Johanna Lehne of the UK's Royal Institute of International Affairs reached the conclusion that, 'Some novel cements have been discussed for more than a decade within the research community, without breaking through. At present, these alternatives are rarely as cost-effective as conventional cement, and they face raw-material shortages and resistance from customers.'`,
        },
      ],
    },
    {
      id: 'c18-r3-p2',
      passageNumber: 2,
      title: 'The steam car',
      subtitle:
        'The successes and failures of the Doble brothers and their steam cars\n\nYou should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c18-r3-p2-A',
          label: 'A',
          content: `When primitive automobiles first began to appear in the 1800s, their engines were based on steam power. Steam had already enjoyed a long and successful career in the railways, so it was only natural that the technology evolved into a miniaturized version which was separate from the trains. But these early cars inherited steam's weaknesses along with its strengths. The boilers had to be lit by hand, and they required about twenty minutes to build up pressure before they could be driven. Furthermore, their water reservoirs only lasted for about thirty miles before needing replenishment. Despite such shortcomings, these newly designed self-propelled carriages offered quick transportation, and by the early 1900s it was not uncommon to see such machines shuttling wealthy citizens around town.`,
        },
        {
          id: 'c18-r3-p2-B',
          label: 'B',
          content: `But the glory days of steam cars were few. A new technology called the Internal Combustion Engine soon appeared, which offered the ability to drive down the road just moments after starting up. At first, these noisy gasoline cars were unpopular because they were more complicated to operate and they had difficult hand-crank starters, which were known to break arms when the engines backfired. But in 1912 General Motors introduced the electric starter, and over the following few years steam power was gradually phased out.`,
        },
        {
          id: 'c18-r3-p2-C',
          label: 'C',
          content: `Even as the market was declining, four brothers made one last effort to rekindle the technology. Between 1906 and 1909, while still attending high school, Abner Doble and his three brothers built their first steam car in their parents' basement. It comprised parts taken from a wrecked early steam car but reconfigured to drive an engine of their own design. Though it did not run well, the Doble brothers went on to build a second and third prototype in the following years. Though the Doble boys' third prototype, nicknamed the Model B, still lacked the convenience of an internal combustion engine, it drew the attention of automobile trade magazines due to its numerous improvements over previous steam cars. The Model B proved to be superior to gasoline automobiles in many ways. Its high-pressure steam drove the engine pistons in virtual silence, in contrast to clattering gas engines which emitted the aroma of burned hydrocarbons. Perhaps most impressively, the Model B was amazingly swift. It could accelerate from zero to sixty miles per hour in just fifteen seconds, a feat described as 'remarkable acceleration' by Automobile magazine in 1914.`,
        },
        {
          id: 'c18-r3-p2-D',
          label: 'D',
          content: `The following year Abner Doble drove the Model B from Massachusetts to Detroit in order to seek investment in his automobile design, which he used to open the General Engineering Company. He and his brothers immediately began working on the Model C, which was intended to expand upon the innovations of the Model B. The brothers added features such as a key-based ignition in the cabin, eliminating the need for the operator to manually ignite the boiler. With these enhancements, the Dobles' new car company promised a steam vehicle which would provide all of the convenience of a gasoline car, but with much greater speed, much simpler driving controls, and a virtually silent powerplant. By the following April, the General Engineering Company had received 5,390 deposits for Doble Detroits, which were scheduled for delivery in early 1918.`,
        },
        {
          id: 'c18-r3-p2-E',
          label: 'E',
          content: `Later that year Abner Doble delivered unhappy news to those eagerly awaiting the delivery of their modern new cars. Those buyers who received the handful of completed cars complained that the vehicles were sluggish and erratic, sometimes going in reverse when they should go forward. The new engine design, though innovative, was still plagued with serious glitches.`,
        },
        {
          id: 'c18-r3-p2-F',
          label: 'F',
          content: `The brothers made one final attempt to produce a viable steam automobile. In early 1924, the Doble brothers shipped a Model E to New York City to be road-tested by the Automobile Club of America. After sitting overnight in freezing temperatures, the car was pushed out into the road and left to sit for over an hour in the frosty morning air. At the turn of the key, the boiler lit and reached its operating pressure inside of forty seconds. As they drove the test vehicle further, they found that its evenly distributed weight lent it surprisingly good handling, even though it was so heavy. As the new Doble steamer was further developed and tested, its maximum speed was pushed to over a hundred miles per hour, and it achieved about fifteen miles per gallon of kerosene with negligible emissions.`,
        },
        {
          id: 'c18-r3-p2-G',
          label: 'G',
          content: `Sadly, the Dobles' brilliant steam car never was a financial success. Priced at around $18,000 in 1924, it was popular only among the very wealthy. Plus, it is said that no two Model Es were quite the same, because Abner Doble tinkered endlessly with the design. By the time the company folded in 1931, fewer than fifty of the amazing Model E steam cars had been produced. For his whole career, until his death in 1961, Abner Doble remained adamant that steam-powered automobiles were at least equal to gasoline cars, if not superior. Given the evidence, he may have been right. Many of the Model E Dobles which have survived are still in good working condition, some having been driven over half a million miles with only normal maintenance. Astonishingly, an unmodified Doble Model E runs clean enough to pass the emissions laws in California today, and they are pretty strict.

It is true that the technology poses some difficult problems, but you cannot help but wonder how efficient a steam car might be with the benefit of modern materials and computers. Under the current pressure to improve automotive performance and reduce emissions, it is not unthinkable that the steam car may rise again.`,
        },
      ],
    },
    {
      id: 'c18-r3-p3',
      passageNumber: 3,
      title: 'The case for mixed-ability classes',
      subtitle:
        'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c18-r3-p3-1',
          label: '1',
          content: `Picture this scene. It's an English literature lesson in a UK school, and the teacher has just read an extract from Shakespeare's Romeo and Juliet with a class of 15-year-olds. He's given some of the students copies of No Fear Shakespeare, a kid-friendly translation of the original. For three students, even these literacy demands are beyond them. Another girl simply can't focus and he gives her pens and paper to draw with. The teacher can ask the No Fear group to identify the key characters and maybe provide a tentative plot summary. He can ask most of the class about character development, and five of them might be able to support their statements with textual evidence. Now two curious students are wondering whether Shakespeare advocates living a life of moderation or one of passionate engagement.`,
        },
        {
          id: 'c18-r3-p3-2',
          label: '2',
          content: `As a teacher myself, I'd think my lesson would be going rather well if the discussion went as described above. But wouldn't this kind of class work better if there weren't such a huge gap between the top and the bottom? If we put all the kids who needed literacy support into one class, and all the students who want to discuss the virtue of moderation into another?`,
        },
        {
          id: 'c18-r3-p3-3',
          label: '3',
          content: `The practice of 'streaming', or 'tracking', involves separating students into classes depending on their diagnosed levels of attainment. At a macro level, it requires the establishment of academically selective schools for the brightest students, and comprehensive schools for the rest. Within schools, it means selecting students into a 'stream' of general ability, or 'sets' of subject-specific ability. The practice is intuitively appealing to almost every stakeholder.`,
        },
        {
          id: 'c18-r3-p3-4',
          label: '4',
          content: `I have heard the mixed-ability model attacked by way of analogy: a group hike. The fittest in the group take the lead and set a brisk pace, only to have to stop and wait every 20 minutes. This is frustrating, and their enthusiasm wanes. Meanwhile, the slowest ones are not only embarrassed but physically struggling to keep up. What's worse, they never get a long enough break. They honestly just want to quit. Hiking, they feel, is not for them.`,
        },
        {
          id: 'c18-r3-p3-5',
          label: '5',
          content: `Mixed-ability classes bore students, frustrate parents and burn out teachers. The brightest ones will never summit Mount Qomolangma, and the stragglers won't enjoy the lovely stroll in the park they are perhaps more suited to. Individuals suffer at the demands of the collective, mediocrity prevails. So: is learning like hiking?`,
        },
        {
          id: 'c18-r3-p3-6',
          label: '6',
          content: `The current pedagogical paradigm is arguably that of constructivism, which emerged out of the work of psychologist Lev Vygotsky. In the 1930s, Vygotsky emphasised the importance of targeting a student's specific 'zone of proximal development' (ZPD). This is the gap between what they can achieve only with support - teachers, textbooks, worked examples, parents and so on - and what they can achieve independently. The purpose of teaching is to provide and then gradually remove this 'scaffolding' until they are autonomous. If we accept this model, it follows that streaming students with similar ZPDs would be an efficient and effective solution. And that forcing everyone on the same hike - regardless of aptitude - would be madness.`,
        },
        {
          id: 'c18-r3-p3-7',
          label: '7',
          content: `Despite all this, there is limited empirical evidence to suggest that streaming results in better outcomes for students. Professor John Hattie, director of the Melbourne Education Research Institute, notes that 'tracking has minimal effects on learning outcomes'. What is more, streaming appears to significantly - and negatively - affect those students assigned to the lowest sets. These students tend to have much higher representation of low socioeconomic class. Less significant is the small benefit for those lucky clever students in the higher sets. The overall result is that the smart stay smart and the dumb get dumber, further entrenching the social divide.`,
        },
        {
          id: 'c18-r3-p3-8',
          label: '8',
          content: `In the latest update of Hattie's influential meta-analysis of factors influencing student achievement, one of the most significant factors is the teachers' estimate of achievement. Streaming students by diagnosed achievement automatically limits what the teacher feels the student is capable of. Meanwhile, in a mixed environment, teachers' estimates need to be more diverse and flexible.`,
        },
        {
          id: 'c18-r3-p3-9',
          label: '9',
          content: `While streaming might seem to help teachers effectively target a student's ZPD, it can underestimate the importance of peer-to-peer learning. A crucial aspect of constructivist theory is the role of the MKO - 'more-knowledgeable other' - in knowledge construction. While teachers are traditionally the MKOs in classrooms, the value of knowledgeable student peers must not go unrecognised either.`,
        },
        {
          id: 'c18-r3-p3-10',
          label: '10',
          content: `I find it amazing to watch students get over an idea to their peers in ways that I would never think of. They operate with different language tools and different social tools from teachers and, having just learnt it themselves, they possess similar cognitive structures to their struggling classmates. There is also something exciting about passing on skills and knowledge that you yourself have just mastered - a certain pride and zeal, a certain freshness to the interaction between 'teacher' and 'learner' that is often lost by the expert for whom the steps are obvious and the joy of discovery forgotten.`,
        },
        {
          id: 'c18-r3-p3-11',
          label: '11',
          content: `Having a variety of different abilities in a collaborative learning environment provides valuable resources for helping students meet their learning needs, not to mention improving their communication and social skills. And today, more than ever, we need the many to flourish - not suffer at the expense of a few bright stars. Once a year, I go on a hike with my class, a mixed bunch of students. It is challenging. The fittest students realise they need to encourage the reluctant. There are lookouts who report back, and extra items to carry for others. We make it - together.`,
        },
      ],
    },
  ];

  const SECTION_OPTIONS_PASSAGE1 = [
    { key: 'A', text: 'Section A' },
    { key: 'B', text: 'Section B' },
    { key: 'C', text: 'Section C' },
    { key: 'D', text: 'Section D' },
    { key: 'E', text: 'Section E' },
    { key: 'F', text: 'Section F' },
    { key: 'G', text: 'Section G' },
    { key: 'H', text: 'Section H' },
  ];

  const PEOPLE_OPTIONS_PASSAGE1 = [
    { key: 'A', text: 'Chris Cheeseman' },
    { key: 'B', text: 'Markus Mannström' },
    { key: 'C', text: 'Anna Surgenor' },
    { key: 'D', text: 'Felix Preston and Johanna Lehne' },
  ];

  const HEADINGS_PASSAGE2 = [
    { key: 'i', text: 'A period in cold conditions before the technology is assessed' },
    { key: 'ii', text: 'Marketing issues lead to failure' },
    { key: 'iii', text: 'Good and bad aspects of steam technology are passed on' },
    { key: 'iv', text: 'A possible solution to the issues of today' },
    { key: 'v', text: 'Further improvements lead to commercial orders' },
    { key: 'vi', text: 'Positive publicity at last for this quiet, clean, fast vehicle' },
    { key: 'vii', text: 'A disappointing outcome for customers' },
    { key: 'viii', text: 'A better option than the steam car arises' },
  ];

  const SUMMARY_OPTIONS_PASSAGE3 = [
    { key: 'A', text: 'wrong classes' },
    { key: 'B', text: 'lower expectations' },
    { key: 'C', text: 'average learners' },
    { key: 'D', text: 'bottom sets' },
    { key: 'E', text: 'brightest pupils' },
    { key: 'F', text: 'disadvantaged backgrounds' },
    { key: 'G', text: 'weaker students' },
    { key: 'H', text: 'higher achievements' },
    { key: 'I', text: 'positive impressions' },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1-4 (Matching Information)
    {
      id: 'c18-r3-g1',
      passageId: 'c18-r3-p1',
      questionType: 'matching_information',
      title: 'Questions 1–4',
      instructions:
        'Reading Passage 1 has eight sections, A–H.\nWhich section contains the following information?\nWrite the correct letter, A–H, in boxes 1–4 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 4,
      optionsList: SECTION_OPTIONS_PASSAGE1,
      questions: [
        {
          id: 'c18-r3-q1',
          questionNumber: 1,
          prompt:
            'an explanation of the industrial processes that create potential raw materials for concrete',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation:
            "Section G explains: 'Fly ash, a byproduct of coal-burning power plants... Iron-ore slag, a byproduct of the iron-ore smelting process, can be used in a similar way.'",
          evidenceQuote:
            'Fly ash, a byproduct of coal-burning power plants, can be incorporated into concrete mixes to make up as much as 15 to 30% of the cement... Iron-ore slag, a byproduct of the iron-ore smelting process, can be used in a similar way.',
          paragraphRef: 'G',
        },
        {
          id: 'c18-r3-q2',
          questionNumber: 2,
          prompt:
            'a reference to the various locations where high-rise wooden buildings can be found',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Section D mentions: 'Recent years have seen the emergence of tall buildings constructed almost entirely from timber. Vancouver, Vienna and Brumunddal in Norway are all home to constructed tall, wooden buildings.'",
          evidenceQuote:
            'Vancouver, Vienna and Brumunddal in Norway are all home to constructed tall, wooden buildings.',
          paragraphRef: 'D',
        },
        {
          id: 'c18-r3-q3',
          questionNumber: 3,
          prompt: 'an indication of how widely available the raw materials of concrete are',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Section C notes: 'Not only are the ingredients of concrete relatively cheap and found in abundance in most places around the globe...'",
          evidenceQuote:
            'Not only are the ingredients of concrete relatively cheap and found in abundance in most places around the globe',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r3-q4',
          questionNumber: 4,
          prompt:
            'the belief that more high-rise wooden buildings are needed before wood can be regarded as a viable construction material',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Section F concludes: 'only when a wider range of construction projects has been proven in practice will it be possible to see wood as a real alternative to concrete in constructing tall buildings.'",
          evidenceQuote:
            'only when a wider range of construction projects has been proven in practice will it be possible to see wood as a real alternative to concrete in constructing tall buildings.',
          paragraphRef: 'F',
        },
      ],
    },

    // PASSAGE 1: Questions 5-8 (Summary Completion Words)
    {
      id: 'c18-r3-g2',
      passageId: 'c18-r3-p1',
      questionType: 'summary_completion_words',
      title: 'Questions 5–8',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 5–8 on your answer sheet.',
      startQuestionNumber: 5,
      endQuestionNumber: 8,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Making buildings with wood

Wood is a traditional building material, but current environmental concerns are encouraging [[5]] to use wood in modern construction projects.

Using wood, however, has its challenges. For example, as [[6]] in the atmosphere enters wood, it increases in size. In addition, wood is prone to pests and the risk of fire is greater. However, wood can be turned into a better construction material if it is treated and combined with other materials. In one process, [[7]] of solid wood are glued together to create building blocks. These blocks are lighter than concrete and steel but equal them in strength. Experts say that wooden buildings are an improvement on those made of concrete and steel in terms of the [[8]] with which they can be constructed and how much noise is generated by the process.`,
      questions: [
        {
          id: 'c18-r3-q5',
          questionNumber: 5,
          prompt:
            'Wood is a traditional building material, but current environmental concerns are encouraging [5] to use wood in modern construction projects.',
          answerKey: 'architects',
          acceptedAlternatives: ['architects'],
          explanation:
            "Section D states: 'climate change is driving architects to turn to treated timber as a possible resource.'",
          evidenceQuote:
            'climate change is driving architects to turn to treated timber as a possible resource.',
          paragraphRef: 'D',
        },
        {
          id: 'c18-r3-q6',
          questionNumber: 6,
          prompt:
            'For example, as [6] in the atmosphere enters wood, it increases in size.',
          answerKey: 'moisture',
          acceptedAlternatives: ['moisture'],
          explanation:
            "Section E states: 'Wood expands as it absorbs moisture from the air...'",
          evidenceQuote: 'Wood expands as it absorbs moisture from the air',
          paragraphRef: 'E',
        },
        {
          id: 'c18-r3-q7',
          questionNumber: 7,
          prompt:
            'In one process, [7] of solid wood are glued together to create building blocks.',
          answerKey: 'layers',
          acceptedAlternatives: ['layers'],
          explanation:
            "Section E explains: 'An adhesive is used to stick layers of solid-sawn timber together, crosswise, to form building blocks.'",
          evidenceQuote:
            'An adhesive is used to stick layers of solid-sawn timber together, crosswise, to form building blocks.',
          paragraphRef: 'E',
        },
        {
          id: 'c18-r3-q8',
          questionNumber: 8,
          prompt:
            'Experts say that wooden buildings are an improvement on those made of concrete and steel in terms of the [8] with which they can be constructed...',
          answerKey: 'speed',
          acceptedAlternatives: ['speed'],
          explanation:
            "Section E states: 'Construction experts say that wooden buildings can be constructed at a greater speed than ones of concrete and steel...'",
          evidenceQuote:
            'Construction experts say that wooden buildings can be constructed at a greater speed than ones of concrete and steel',
          paragraphRef: 'E',
        },
      ],
    },

    // PASSAGE 1: Questions 9-13 (Matching Features)
    {
      id: 'c18-r3-g3',
      passageId: 'c18-r3-p1',
      questionType: 'matching_features',
      title: 'Questions 9–13',
      instructions:
        'Look at the following statements (Questions 9–13) and the list of people below.\nMatch each statement with the correct person, A, B, C or D.\nWrite the correct letter, A, B, C or D, in boxes 9–13 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 9,
      endQuestionNumber: 13,
      optionsList: PEOPLE_OPTIONS_PASSAGE1,
      optionReuseAllowed: true,
      questions: [
        {
          id: 'c18-r3-q9',
          questionNumber: 9,
          prompt:
            'The environmental advantage of cement alternatives may not be as great as initially assumed.',
          options: PEOPLE_OPTIONS_PASSAGE1,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Section G notes Anna Surgenor's warning: 'If they are transported over long distances, using fossil fuels, the use of alternative materials might not make sense from an overall carbon reduction perspective.'",
          evidenceQuote:
            'If they are transported over long distances, using fossil fuels, the use of alternative materials might not make sense from an overall carbon reduction perspective.',
          paragraphRef: 'G',
        },
        {
          id: 'c18-r3-q10',
          questionNumber: 10,
          prompt:
            'It would be hard to create a construction alternative to concrete that offers so many comparable benefits.',
          options: PEOPLE_OPTIONS_PASSAGE1,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section C quotes Chris Cheeseman: 'Concrete is amazing stuff. Making anything with similar properties is going to be very difficult.'",
          evidenceQuote:
            'Concrete is amazing stuff. Making anything with similar properties is going to be very difficult.',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r3-q11',
          questionNumber: 11,
          prompt:
            'Worries about the environment have led to increased interest in wood as a construction material.',
          options: PEOPLE_OPTIONS_PASSAGE1,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Section F reports Markus Mannström stating: 'the company is seeing increasing demand globally for building in wood, with climate change concerns the key driver.'",
          evidenceQuote:
            'the company is seeing increasing demand globally for building in wood, with climate change concerns the key driver.',
          paragraphRef: 'F',
        },
        {
          id: 'c18-r3-q12',
          questionNumber: 12,
          prompt:
            'Expense has been a factor in the negative response to the development of new cements.',
          options: PEOPLE_OPTIONS_PASSAGE1,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Section H quotes Felix Preston and Johanna Lehne: 'At present, these alternatives are rarely as cost-effective as conventional cement, and they face raw-material shortages and resistance from customers.'",
          evidenceQuote:
            'At present, these alternatives are rarely as cost-effective as conventional cement, and they face raw-material shortages and resistance from customers.',
          paragraphRef: 'H',
        },
        {
          id: 'c18-r3-q13',
          questionNumber: 13,
          prompt:
            'The environmental damage caused by concrete is due to it being produced in large quantities.',
          options: PEOPLE_OPTIONS_PASSAGE1,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Section B quotes Chris Cheeseman: 'Concrete is not a high-carbon product... But it is the scale on which it is used that makes it high carbon. The sheer scale of manufacture is so huge, that is the issue.'",
          evidenceQuote:
            'But it is the scale on which it is used that makes it high carbon. The sheer scale of manufacture is so huge, that is the issue.',
          paragraphRef: 'B',
        },
      ],
    },

    // PASSAGE 2: Questions 14-20 (Matching Headings)
    {
      id: 'c18-r3-g4',
      passageId: 'c18-r3-p2',
      questionType: 'matching_headings',
      title: 'Questions 14–20',
      instructions:
        'Reading Passage 2 has seven paragraphs, A–G.\nChoose the correct heading for each paragraph from the list of headings below.\nWrite the correct number, i–viii, in boxes 14–20 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 20,
      optionsList: HEADINGS_PASSAGE2,
      questions: [
        {
          id: 'c18-r3-q14',
          questionNumber: 14,
          prompt: 'Paragraph A',
          options: HEADINGS_PASSAGE2,
          answerKey: 'iii',
          acceptedAlternatives: ['iii', 'III'],
          explanation:
            "Paragraph A explains: 'these early cars inherited steam's weaknesses along with its strengths.'",
          evidenceQuote:
            "these early cars inherited steam's weaknesses along with its strengths.",
          paragraphRef: 'A',
        },
        {
          id: 'c18-r3-q15',
          questionNumber: 15,
          prompt: 'Paragraph B',
          options: HEADINGS_PASSAGE2,
          answerKey: 'viii',
          acceptedAlternatives: ['viii', 'VIII'],
          explanation:
            "Paragraph B describes the emergence of the Internal Combustion Engine and electric starter which phased out steam: 'A better option than the steam car arises'.",
          evidenceQuote:
            'A new technology called the Internal Combustion Engine soon appeared... in 1912 General Motors introduced the electric starter, and over the following few years steam power was gradually phased out.',
          paragraphRef: 'B',
        },
        {
          id: 'c18-r3-q16',
          questionNumber: 16,
          prompt: 'Paragraph C',
          options: HEADINGS_PASSAGE2,
          answerKey: 'vi',
          acceptedAlternatives: ['vi', 'VI'],
          explanation:
            "Paragraph C describes how the Model B drew media praise for being silent, swift, and clean: 'Positive publicity at last for this quiet, clean, fast vehicle'.",
          evidenceQuote:
            "it drew the attention of automobile trade magazines due to its numerous improvements over previous steam cars... drove the engine pistons in virtual silence... 'remarkable acceleration' by Automobile magazine in 1914.",
          paragraphRef: 'C',
        },
        {
          id: 'c18-r3-q17',
          questionNumber: 17,
          prompt: 'Paragraph D',
          options: HEADINGS_PASSAGE2,
          answerKey: 'v',
          acceptedAlternatives: ['v', 'V'],
          explanation:
            "Paragraph D explains that Model C innovations led to commercial orders: 'By the following April, the General Engineering Company had received 5,390 deposits for Doble Detroits...'",
          evidenceQuote:
            'the General Engineering Company had received 5,390 deposits for Doble Detroits, which were scheduled for delivery in early 1918.',
          paragraphRef: 'D',
        },
        {
          id: 'c18-r3-q18',
          questionNumber: 18,
          prompt: 'Paragraph E',
          options: HEADINGS_PASSAGE2,
          answerKey: 'vii',
          acceptedAlternatives: ['vii', 'VII'],
          explanation:
            "Paragraph E reports customer disappointment: 'Abner Doble delivered unhappy news... Those buyers who received the handful of completed cars complained that the vehicles were sluggish and erratic...'",
          evidenceQuote:
            'Abner Doble delivered unhappy news to those eagerly awaiting the delivery of their modern new cars. Those buyers who received the handful of completed cars complained that the vehicles were sluggish and erratic',
          paragraphRef: 'E',
        },
        {
          id: 'c18-r3-q19',
          questionNumber: 19,
          prompt: 'Paragraph F',
          options: HEADINGS_PASSAGE2,
          answerKey: 'i',
          acceptedAlternatives: ['i', 'I'],
          explanation:
            "Paragraph F describes testing the Model E after freezing conditions: 'After sitting overnight in freezing temperatures, the car was pushed out into the road and left to sit for over an hour in the frosty morning air.'",
          evidenceQuote:
            'After sitting overnight in freezing temperatures, the car was pushed out into the road and left to sit for over an hour in the frosty morning air.',
          paragraphRef: 'F',
        },
        {
          id: 'c18-r3-q20',
          questionNumber: 20,
          prompt: 'Paragraph G',
          options: HEADINGS_PASSAGE2,
          answerKey: 'iv',
          acceptedAlternatives: ['iv', 'IV'],
          explanation:
            "Paragraph G discusses how steam cars could meet modern environmental and emission pressures: 'A possible solution to the issues of today'.",
          evidenceQuote:
            'Under the current pressure to improve automotive performance and reduce emissions, it is not unthinkable that the steam car may rise again.',
          paragraphRef: 'G',
        },
      ],
    },

    // PASSAGE 2: Questions 21-23 (Multiple Choice Single)
    {
      id: 'c18-r3-g5',
      passageId: 'c18-r3-p2',
      questionType: 'multiple_choice_single',
      title: 'Questions 21–23',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 21–23 on your answer sheet.',
      startQuestionNumber: 21,
      endQuestionNumber: 23,
      questions: [
        {
          id: 'c18-r3-q21',
          questionNumber: 21,
          prompt: 'What point does the writer make about the steam car in Paragraph B?',
          options: [
            { key: 'A', text: 'Its success was short-lived.' },
            { key: 'B', text: 'Not enough cars were made.' },
            { key: 'C', text: 'Car companies found them hard to sell.' },
            { key: 'D', text: 'People found them hard to drive.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph B begins: 'But the glory days of steam cars were few.' and goes on to describe how internal combustion quickly replaced them.",
          evidenceQuote:
            'But the glory days of steam cars were few. A new technology called the Internal Combustion Engine soon appeared... steam power was gradually phased out.',
          paragraphRef: 'B',
        },
        {
          id: 'c18-r3-q22',
          questionNumber: 22,
          prompt: 'When building their first steam car, the Doble brothers',
          options: [
            { key: 'A', text: 'constructed all the parts themselves.' },
            { key: 'B', text: 'made written notes at each stage of the construction.' },
            { key: 'C', text: 'needed several attempts to achieve a competitive model.' },
            {
              key: 'D',
              text: 'sought the advice of experienced people in the car industry.',
            },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph C explains: 'Though it did not run well, the Doble brothers went on to build a second and third prototype in the following years... nickname the Model B... drew the attention of automobile trade magazines due to its numerous improvements...'",
          evidenceQuote:
            'Though it did not run well, the Doble brothers went on to build a second and third prototype in the following years. Though the Doble boys\' third prototype, nicknamed the Model B... drew the attention of automobile trade magazines',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r3-q23',
          questionNumber: 23,
          prompt: 'In order to produce the Model C, the Doble brothers',
          options: [
            { key: 'A', text: 'moved production to a different city.' },
            { key: 'B', text: 'raised financial capital.' },
            { key: 'C', text: 'employed an additional worker.' },
            { key: 'D', text: 'abandoned their earlier designs.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph D explains: 'Abner Doble drove the Model B from Massachusetts to Detroit in order to seek investment in his automobile design, which he used to open the General Engineering Company.'",
          evidenceQuote:
            'Abner Doble drove the Model B from Massachusetts to Detroit in order to seek investment in his automobile design, which he used to open the General Engineering Company.',
          paragraphRef: 'D',
        },
      ],
    },

    // PASSAGE 2: Questions 24-26 (Summary Completion Words)
    {
      id: 'c18-r3-g6',
      passageId: 'c18-r3-p2',
      questionType: 'summary_completion_words',
      title: 'Questions 24–26',
      instructions:
        'Complete the summary below.\nChoose ONE WORD AND/OR A NUMBER from the passage for each answer.\nWrite your answers in boxes 24–26 on your answer sheet.',
      startQuestionNumber: 24,
      endQuestionNumber: 26,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `The Model E

The Model E was road-tested in 1924 by the Automobile Club of America. They found it easy to drive, despite its weight, and it impressed the spectators. A later version of the Model E raised its [[24]] while keeping its emissions extremely low.

The steam car was too expensive for many people and its design was constantly being altered. Under [[25]] cars were produced before the company went out of business. However, even today, there are Model Es on the road in the US. They are straightforward to maintain, and they satisfy California's [[26]] emissions laws. Perhaps today's technology and materials would help us revive the steam car.`,
      questions: [
        {
          id: 'c18-r3-q24',
          questionNumber: 24,
          prompt:
            'A later version of the Model E raised its [24] while keeping its emissions extremely low.',
          answerKey: 'speed',
          acceptedAlternatives: ['speed'],
          explanation:
            "Paragraph F states: 'As the new Doble steamer was further developed and tested, its maximum speed was pushed to over a hundred miles per hour, and it achieved about fifteen miles per gallon of kerosene with negligible emissions.'",
          evidenceQuote:
            'its maximum speed was pushed to over a hundred miles per hour, and it achieved about fifteen miles per gallon of kerosene with negligible emissions.',
          paragraphRef: 'F',
        },
        {
          id: 'c18-r3-q25',
          questionNumber: 25,
          prompt:
            'Under [25] cars were produced before the company went out of business.',
          answerKey: 'fifty',
          acceptedAlternatives: ['fifty', '50'],
          explanation:
            "Paragraph G states: 'By the time the company folded in 1931, fewer than fifty of the amazing Model E steam cars had been produced.'",
          evidenceQuote:
            'By the time the company folded in 1931, fewer than fifty of the amazing Model E steam cars had been produced.',
          paragraphRef: 'G',
        },
        {
          id: 'c18-r3-q26',
          questionNumber: 26,
          prompt:
            "However, even today, there are Model Es on the road in the US. They are straightforward to maintain, and they satisfy California's [26] emissions laws.",
          answerKey: 'strict',
          acceptedAlternatives: ['strict'],
          explanation:
            "Paragraph G states: 'Astonishingly, an unmodified Doble Model E runs clean enough to pass the emissions laws in California today, and they are pretty strict.'",
          evidenceQuote:
            'runs clean enough to pass the emissions laws in California today, and they are pretty strict.',
          paragraphRef: 'G',
        },
      ],
    },

    // PASSAGE 3: Questions 27-30 (Multiple Choice Single)
    {
      id: 'c18-r3-g7',
      passageId: 'c18-r3-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–30',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 27–30 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c18-r3-q27',
          questionNumber: 27,
          prompt:
            'The writer describes the Romeo and Juliet lesson in order to demonstrate',
          options: [
            { key: 'A', text: 'how few students are interested in literature.' },
            { key: 'B', text: 'how a teacher handles a range of learning needs.' },
            { key: 'C', text: 'how unsuitable Shakespeare is for most teenagers.' },
            {
              key: 'D',
              text: "how weaker students can disrupt their classmates' learning.",
            },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            'In Paragraph 1, the author depicts a mixed-ability English classroom where the teacher differentiates instruction to cater to varying levels of literacy and analytical maturity.',
          evidenceQuote:
            "For three students, even these literacy demands are beyond them... The teacher can ask the No Fear group to identify the key characters... He can ask most of the class about character development... Now two curious students are wondering whether Shakespeare advocates living a life of moderation",
          paragraphRef: '1',
        },
        {
          id: 'c18-r3-q28',
          questionNumber: 28,
          prompt: 'What does the writer say about streaming in the third paragraph?',
          options: [
            { key: 'A', text: 'It has a very broad appeal.' },
            { key: 'B', text: 'It favours cleverer students.' },
            { key: 'C', text: 'It is relatively simple to implement.' },
            { key: 'D', text: 'It works better in some schools than others.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 3 concludes: 'The practice is intuitively appealing to almost every stakeholder.'",
          evidenceQuote: 'The practice is intuitively appealing to almost every stakeholder.',
          paragraphRef: '3',
        },
        {
          id: 'c18-r3-q29',
          questionNumber: 29,
          prompt:
            'What idea is suggested by the reference to Mount Qomolangma in the fifth paragraph?',
          options: [
            { key: 'A', text: 'students following unsuitable paths' },
            { key: 'B', text: 'students attempting interesting tasks' },
            { key: 'C', text: 'students not achieving their full potential' },
            { key: 'D', text: 'students not being aware of their limitations' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 5 states: 'The brightest ones will never summit Mount Qomolangma, and the stragglers won't enjoy the lovely stroll in the park... Individuals suffer at the demands of the collective, mediocrity prevails.'",
          evidenceQuote:
            'The brightest ones will never summit Mount Qomolangma, and the stragglers won\'t enjoy the lovely stroll in the park they are perhaps more suited to. Individuals suffer at the demands of the collective, mediocrity prevails.',
          paragraphRef: '5',
        },
        {
          id: 'c18-r3-q30',
          questionNumber: 30,
          prompt: "What does the word 'scaffolding' in the sixth paragraph refer to?",
          options: [
            {
              key: 'A',
              text: 'the factors which prevent a student from learning effectively',
            },
            {
              key: 'B',
              text: "the environment where most of a student's learning takes place",
            },
            {
              key: 'C',
              text: 'the assistance given to a student in their initial stages of learning',
            },
            {
              key: 'D',
              text: "the setting of appropriate learning targets for a student's aptitude",
            },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 6 defines ZPD and scaffolding: 'This is the gap between what they can achieve only with support - teachers, textbooks, worked examples, parents and so on... The purpose of teaching is to provide and then gradually remove this 'scaffolding' until they are autonomous.'",
          evidenceQuote:
            "This is the gap between what they can achieve only with support - teachers, textbooks, worked examples, parents and so on - and what they can achieve independently. The purpose of teaching is to provide and then gradually remove this 'scaffolding' until they are autonomous.",
          paragraphRef: '6',
        },
      ],
    },

    // PASSAGE 3: Questions 31-35 (Summary Completion Options)
    {
      id: 'c18-r3-g8',
      passageId: 'c18-r3-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 31–35',
      instructions:
        'Complete the summary using the list of phrases, A–I, below.\nWrite the correct letter, A–I, in boxes 31–35 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 35,
      optionsList: SUMMARY_OPTIONS_PASSAGE3,
      contentWithGaps: `Is streaming effective?

According to Professor John Hattie of the Melbourne Education Research Institute, there is very little indication that streaming leads to [[31]]. He points out that, in schools which use streaming, the most significant impact is on those students placed in the [[32]], especially where a large proportion of them have [[33]]. Meanwhile, for the [[34]], there appears to be only minimal advantage. A further issue is that teachers tend to have [[35]] of students in streamed groups.`,
      questions: [
        {
          id: 'c18-r3-q31',
          questionNumber: 31,
          prompt:
            'According to Professor John Hattie of the Melbourne Education Research Institute, there is very little indication that streaming leads to [31].',
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Paragraph 7 quotes Hattie: 'tracking has minimal effects on learning outcomes' ('learning outcomes' = higher achievements, Option H).",
          evidenceQuote: 'tracking has minimal effects on learning outcomes',
          paragraphRef: '7',
        },
        {
          id: 'c18-r3-q32',
          questionNumber: 32,
          prompt:
            'He points out that, in schools which use streaming, the most significant impact is on those students placed in the [32]...',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 7 states: 'streaming appears to significantly - and negatively - affect those students assigned to the lowest sets.' ('lowest sets' = bottom sets, Option D).",
          evidenceQuote:
            'streaming appears to significantly - and negatively - affect those students assigned to the lowest sets.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r3-q33',
          questionNumber: 33,
          prompt:
            '...especially where a large proportion of them have [33].',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph 7 notes: 'These students tend to have much higher representation of low socioeconomic class.' ('low socioeconomic class' = disadvantaged backgrounds, Option F).",
          evidenceQuote:
            'These students tend to have much higher representation of low socioeconomic class.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r3-q34',
          questionNumber: 34,
          prompt:
            'Meanwhile, for the [34], there appears to be only minimal advantage.',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph 7 notes: 'Less significant is the small benefit for those lucky clever students in the higher sets.' ('clever students' = brightest pupils, Option E).",
          evidenceQuote:
            'Less significant is the small benefit for those lucky clever students in the higher sets.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r3-q35',
          questionNumber: 35,
          prompt:
            'A further issue is that teachers tend to have [35] of students in streamed groups.',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 8 states: 'Streaming students by diagnosed achievement automatically limits what the teacher feels the student is capable of.' ('limits what the teacher feels...' = lower expectations, Option B).",
          evidenceQuote:
            'Streaming students by diagnosed achievement automatically limits what the teacher feels the student is capable of.',
          paragraphRef: '8',
        },
      ],
    },

    // PASSAGE 3: Questions 36-40 (YES / NO / NOT GIVEN)
    {
      id: 'c18-r3-g9',
      passageId: 'c18-r3-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 36–40',
      instructions:
        'Do the following statements agree with the views of the writer in Reading Passage 3?\nIn boxes 36–40 on your answer sheet, write\nYES if the statement agrees with the views of the writer\nNO if the statement contradicts the views of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 36,
      endQuestionNumber: 40,
      optionsList: [
        { key: 'YES', text: 'YES' },
        { key: 'NO', text: 'NO' },
        { key: 'NOT GIVEN', text: 'NOT GIVEN' },
      ],
      questions: [
        {
          id: 'c18-r3-q36',
          questionNumber: 36,
          prompt:
            'The Vygotsky model of education supports the concept of a mixed-ability class.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO', 'No'],
          explanation:
            "Paragraph 6 contradicts this: 'If we accept this model, it follows that streaming students with similar ZPDs would be an efficient and effective solution. And that forcing everyone on the same hike - regardless of aptitude - would be madness.'",
          evidenceQuote:
            'If we accept this model, it follows that streaming students with similar ZPDs would be an efficient and effective solution. And that forcing everyone on the same hike - regardless of aptitude - would be madness.',
          paragraphRef: '6',
        },
        {
          id: 'c18-r3-q37',
          questionNumber: 37,
          prompt:
            'Some teachers are uncertain about allowing students to take on MKO roles in the classroom.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            "Paragraph 9 notes that 'the value of knowledgeable student peers must not go unrecognised either', but does not mention that some teachers are uncertain about allowing students to take on this role.",
          evidenceQuote:
            'While teachers are traditionally the MKOs in classrooms, the value of knowledgeable student peers must not go unrecognised either.',
          paragraphRef: '9',
        },
        {
          id: 'c18-r3-q38',
          questionNumber: 38,
          prompt:
            'It can be rewarding to teach knowledge which you have only recently acquired.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES', 'Yes'],
          explanation:
            "Paragraph 10 confirms: 'There is also something exciting about passing on skills and knowledge that you yourself have just mastered - a certain pride and zeal, a certain freshness to the interaction...'",
          evidenceQuote:
            'There is also something exciting about passing on skills and knowledge that you yourself have just mastered - a certain pride and zeal, a certain freshness to the interaction between \'teacher\' and \'learner\'',
          paragraphRef: '10',
        },
        {
          id: 'c18-r3-q39',
          questionNumber: 39,
          prompt:
            'The priority should be to ensure that the highest-achieving students attain their goals.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO', 'No'],
          explanation:
            "Paragraph 11 contradicts this: 'And today, more than ever, we need the many to flourish - not suffer at the expense of a few bright stars.'",
          evidenceQuote:
            'And today, more than ever, we need the many to flourish - not suffer at the expense of a few bright stars.',
          paragraphRef: '11',
        },
        {
          id: 'c18-r3-q40',
          questionNumber: 40,
          prompt:
            'Taking part in collaborative outdoor activities with teachers and classmates can improve student outcomes in the classroom.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            'Paragraph 11 describes the author taking their mixed class on an annual hike to foster teamwork and solidarity, but does not state that it improves classroom student outcomes.',
          evidenceQuote:
            'Once a year, I go on a hike with my class, a mixed bunch of students. It is challenging. The fittest students realise they need to encourage the reluctant. There are lookouts who report back, and extra items to carry for others. We make it - together.',
          paragraphRef: '11',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 18 Academic Reading Test 3',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge18ReadingTest3(authorId?: string) {
  const data = getCambridge18ReadingTest3Data();

  const validationErrors = validateTestVersion(data.passages, data.questionGroups);

  if (validationErrors.length > 0) {
    throw new Error(
      `Cambridge 18 Reading Test 3 validation failed:\n${validationErrors.join('\n')}`
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
