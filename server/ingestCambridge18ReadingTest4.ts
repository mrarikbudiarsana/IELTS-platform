import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup, OptionChoice } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge18ReadingTest4Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const SECTION_OPTIONS_PASSAGE1: OptionChoice[] = [
    { key: 'A', text: 'Paragraph A' },
    { key: 'B', text: 'Paragraph B' },
    { key: 'C', text: 'Paragraph C' },
    { key: 'D', text: 'Paragraph D' },
    { key: 'E', text: 'Paragraph E' },
  ];

  const MC_Q10_11_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'a longer growing season for edible produce' },
    { key: 'B', text: 'more economical use of water' },
    { key: 'C', text: 'greater water-storage capacity' },
    { key: 'D', text: 'ability to cultivate more plant types' },
    { key: 'E', text: 'a large surface area for growing plants' },
  ];

  const MC_Q12_13_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'to provide habitats for a wide range of species' },
    { key: 'B', text: 'to grow plants successfully even in the wettest climates' },
    { key: 'C', text: 'to regulate the temperature of the immediate environment' },
    { key: 'D', text: 'to generate power from a sustainable source' },
    { key: 'E', text: 'to collect water to supply other buildings' },
  ];

  const MC_Q14_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'where the notion of innate intelligence first began' },
    { key: 'B', text: 'when ideas about the nature of intelligence began to shift' },
    { key: 'C', text: 'how scientists have responded to changing views of intelligence' },
    { key: 'D', text: 'why thinkers turned away from the idea of intelligence being fixed' },
  ];

  const MC_Q15_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'identify their personal ambitions.' },
    { key: 'B', text: 'help each other to realise their goals.' },
    { key: 'C', text: 'have confidence in their potential to succeed.' },
    { key: 'D', text: 'concentrate on where their particular strengths lie.' },
  ];

  const MC_Q16_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'tend to be less competitive.' },
    { key: 'B', text: 'generally have a low sense of self-esteem.' },
    { key: 'C', text: 'will only work hard if they are given constant encouragement.' },
    { key: 'D', text: 'are afraid to push themselves beyond what they see as their limitations.' },
  ];

  const PEOPLE_OPTIONS_PASSAGE2: OptionChoice[] = [
    { key: 'A', text: 'Alfred Binet' },
    { key: 'B', text: 'Carol Dweck' },
    { key: 'C', text: 'Andrew Gelman' },
    { key: 'D', text: 'Timothy Bates' },
    { key: 'E', text: 'David Yeager and Gregory Walton' },
  ];

  const SUMMARY_OPTIONS_PASSAGE3: OptionChoice[] = [
    { key: 'A', text: 'modest fame' },
    { key: 'B', text: 'vast range' },
    { key: 'C', text: 'record-breaking achievement' },
    { key: 'D', text: 'research methods' },
    { key: 'E', text: 'select group' },
    { key: 'F', text: 'professional interests' },
    { key: 'G', text: 'scientific debate' },
    { key: 'H', text: 'hazardous exploration' },
    { key: 'I', text: "biographer's perspective" },
    { key: 'J', text: 'narrow investigation' },
  ];

  const MC_Q37_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'describing what motivated him to write the book' },
    { key: 'B', text: 'explaining why it is desirable to read the whole book' },
    { key: 'C', text: 'suggesting why Wegener pursued so many different careers' },
    { key: 'D', text: "indicating what aspects of Wegener's life interested him most" },
  ];

  const MC_Q38_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'He was not a particularly ambitious person.' },
    { key: 'B', text: 'He kept a record of all his scientific observations.' },
    { key: 'C', text: 'He did not adopt many of the scientific practices of the time.' },
    { key: 'D', text: 'He enjoyed discussing new discoveries with other scientists.' },
  ];

  const MC_Q39_OPTIONS: OptionChoice[] = [
    { key: 'A', text: "Their published works had a greater impact than Wegener's did." },
    { key: 'B', text: "They had fewer doubts about their scientific ideas than Wegener did." },
    { key: 'C', text: "Their scientific ideas were more controversial than Wegener's." },
    { key: 'D', text: 'They are easier subjects to write about than Wegener.' },
  ];

  const MC_Q40_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'It is not enough in life to have good intentions.' },
    { key: 'B', text: 'People need to plan carefully if they want to succeed.' },
    { key: 'C', text: 'People have little control over many aspects of their lives.' },
    { key: 'D', text: 'It is important that people ensure they have the freedom to act.' },
  ];

  const passages: ReadingPassage[] = [
    {
      id: 'c18-r4-p1',
      passageNumber: 1,
      title: 'Green roofs',
      subtitle:
        'Rooftops covered with grass, vegetable gardens and lush foliage are now a common sight in many cities around the world.\n\nYou should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c18-r4-p1-A',
          label: 'A',
          content: `Rooftops covered with grass, vegetable gardens and lush foliage are now a common sight in many cities around the world. More and more private companies and city authorities are investing in green roofs, drawn to their wide-ranging benefits. Among the benefits are saving on energy costs, mitigating the risk of floods, making habitats for urban wildlife, tackling air pollution and even growing food. These increasingly radical urban designs can help cities adapt to the monumental problems they face, such as access to resources and a lack of green space due to development. But the involvement of city authorities, businesses and other institutions is crucial to ensuring their success - as is research investigating different options to suit the variety of rooftop spaces found in cities.`,
        },
        {
          id: 'c18-r4-p1-B',
          label: 'B',
          content: `The UK is relatively new to developing green roofs, and local governments and institutions are playing a major role in spreading the practice. London is home to much of the UK's green roof market, mainly due to forward-thinking policies such as the London Plan, which has paved the way to more than doubling the area of green roofs in the capital. Ongoing research is showcasing how green roofs in cities can integrate with 'living walls': environmentally friendly walls which are partially or completely covered with greenery, including a growing medium, such as soil or water. Research also indicates that green roofs can be integrated with drainage systems on the ground, such as street trees, so that the water is managed better and the built environment is made more sustainable.

There is also evidence to demonstrate the social value of green roofs. Doctors are increasingly prescribing time spent gardening outdoors for patients dealing with anxiety and depression. And research has found that access to even the most basic green spaces can provide a better quality of life for dementia sufferers and help people avoid obesity.`,
        },
        {
          id: 'c18-r4-p1-C',
          label: 'C',
          content: `In North America, green roofs have become mainstream, with a wide array of expansive, accessible and food-producing roofs installed in buildings. Again, city leaders and authorities have helped push the movement forward - only recently, San Francisco, USA, created a policy requiring new buildings to have green roofs. Toronto, Canada, has policies dating from the 1990s, encouraging the development of urban farms on rooftops. These countries also benefit from having newer buildings than in many parts of the world, which makes it easier to install green roofs. Being able to keep enough water at roof height and distribute it right across the rooftop is crucial to maintaining the plants on any green roof - especially on 'edible roofs' where fruit and vegetables are farmed. And it's much easier to do this in newer buildings, which can typically hold greater weight, than to retro-fit old ones. Having a stronger roof also makes it easier to grow a greater variety of plants, since the soil can be deeper.`,
        },
        {
          id: 'c18-r4-p1-D',
          label: 'D',
          content: `For green roofs to become the norm for new developments, there needs to be support from public authorities and private investors. Those responsible for maintaining buildings may have to acquire new skills, such as landscaping, and in some cases, volunteers may be needed to help out. Other considerations include installing drainage paths, meeting health and safety requirements and perhaps allowing access for the public, as well as planning restrictions and disruption from regular activities in and around the buildings during installation.

To convince investors and developers that installing green roofs is worthwhile, economic arguments are still the most important. The term 'natural capital' has been developed to explain the economic value of nature; for example, measuring the money saved by installing natural solutions to protect against flood damage, adapt to climate change or help people lead healthier and happier lives.`,
        },
        {
          id: 'c18-r4-p1-E',
          label: 'E',
          content: `As the expertise about green roofs grows, official standards have been developed to ensure that they are designed, constructed and maintained properly, and function well. Improvements in the science and technology underpinning green roof development have also led to new variations in the concept. For example, 'blue roofs' enable buildings to hold water over longer periods of time, rather than draining it away quickly - crucial in times of heavier rainfall. There are also combinations of green roofs with solar panels, and 'brown roofs' which are wilder in nature and maximise biodiversity. If the trend continues, it could create new jobs and a more vibrant and sustainable local food economy - alongside many other benefits.

There are still barriers to overcome, but the evidence so far indicates that green roofs have the potential to transform cities and help them function sustainably long into the future. The success stories need to be studied and replicated elsewhere, to make green, blue, brown and food-producing roofs the norm in cities around the world.`,
        },
      ],
    },
    {
      id: 'c18-r4-p2',
      passageNumber: 2,
      title: 'The growth mindset',
      subtitle:
        'Over the past century, a powerful idea has taken root in the educational landscape.\n\nYou should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c18-r4-p2-1',
          label: '1',
          content: `Over the past century, a powerful idea has taken root in the educational landscape. The concept of intelligence as something innate has been supplanted by the idea that intelligence is not fixed, and that, with the right training, we can be the authors of our own cognitive capabilities. Psychologist Alfred Binet, the developer of the first intelligence tests, was one of many 19th-century scientists who held that earlier view and sought to quantify cognitive ability. Then, in the early 20th century, progressive thinkers revolted against the notion that inherent ability is destiny. Instead, educators such as John Dewey argued that every child's intelligence could be developed, given the right environment.`,
        },
        {
          id: 'c18-r4-p2-2',
          label: '2',
          content: `'Growth mindset theory' is a relatively new - and extremely popular - version of this idea. In many schools today you will see hallways covered in motivational posters and hear speeches on the mindset of great sporting heroes who simply believed their way to the top. A major focus of the growth mindset in schools is coaxing students away from seeing failure as an indication of their ability, and towards seeing it as a chance to improve that ability. As educationalist Jeff Howard noted several decades ago: 'Smart is not something that you just are, smart is something that you can get.'`,
        },
        {
          id: 'c18-r4-p2-3',
          label: '3',
          content: `The idea of the growth mindset is based on the work of psychologist Carol Dweck in California in the 1990s. In one key experiment, Dweck divided a group of 10- to 12-year-olds into two groups. All were told that they had achieved a high score on a test but the first group were praised for their intelligence in achieving this, while the others were praised for their effort. The second group - those who had been instilled with a 'growth mindset' - were subsequently far more likely to put effort into future tasks. Meanwhile, the former took on only those tasks that would not risk their sense of worth. This group had inferred that success or failure is due to innate ability, and this 'fixed mindset' had led them to fear of failure and lack of effort. Praising ability actually made the students perform worse, while praising effort emphasised that change was possible.`,
        },
        {
          id: 'c18-r4-p2-4',
          label: '4',
          content: `One of the greatest impediments to successfully implementing a growth mindset, however, is the education system itself: in many parts of the world, the school climate is obsessed with performance in the form of constant testing, analysing and ranking of students - a key characteristic of the fixed mindset. Nor is it unusual for schools to create a certain cognitive dissonance, when they applaud the benefits of a growth mindset but then hand out fixed target grades in lessons based on performance.`,
        },
        {
          id: 'c18-r4-p2-5',
          label: '5',
          content: `Aside from the implementation problem, the original growth mindset research has also received harsh criticism. The statistician Andrew Gelman claims that 'their research designs have enough degrees of freedom that they could take their data to support just about any theory at all'. Professor of Psychology Timothy Bates, who has been trying to replicate Dweck's work, is finding that the results are repeatedly null. He notes that: 'People with a growth mindset don't cope any better with failure ... Kids with the growth mindset aren't getting better grades, either before or after our intervention study.'`,
        },
        {
          id: 'c18-r4-p2-6',
          label: '6',
          content: `Much of this criticism is not lost on Dweck, and she deserves great credit for responding to it and adapting her work accordingly. In fact, she argues that her work has been misunderstood and misapplied in a range of ways. She has also expressed concerns that her theories are being misappropriated in schools by being conflated with the self-esteem movement: 'For me the growth mindset is a tool for learning and improvement. It's not just a vehicle for making children feel good.'`,
        },
        {
          id: 'c18-r4-p2-7',
          label: '7',
          content: `But there is another factor at work here. The failure to translate the growth mindset into the classroom might reflect a misunderstanding of the nature of teaching and learning itself. Growth mindset supporters David Yeager and Gregory Walton claim that interventions should be delivered in a subtle way to maximise their effectiveness. They say that if adolescents perceive a teacher's intervention as conveying that they are in need of help, this could undo its intended effects. A lot of what drives students is their innate beliefs and how they perceive themselves. There is a strong correlation between self-perception and achievement, but there is evidence to suggest that the actual effect of achievement on self-perception is stronger than the other way round. To stand up in a classroom and successfully deliver a good speech is a genuine achievement, and that is likely to be more powerfully motivating than vague notions of 'motivation' itself.`,
        },
        {
          id: 'c18-r4-p2-8',
          label: '8',
          content: `Recent evidence would suggest that growth mindset interventions are not the elixir of student learning that its proponents claim it to be. The growth mindset appears to be a viable construct in the lab, which, when administered in the classroom via targeted interventions, doesn't seem to work. It is hard to dispute that having faith in the capacity to change is a good attribute for students. Paradoxically, however, that aspiration is not well served by direct interventions that try to instil it. Motivational posters and talks are often a waste of time, and might well give students a deluded notion of what success actually means. Teaching concrete skills such as how to write an effective introduction to an essay then praising students' effort in getting there is probably a far better way of improving confidence than telling them how unique they are, or indeed how capable they are of changing their own brains. Perhaps growth mindset works best as a philosophy and not an intervention.`,
        },
      ],
    },
    {
      id: 'c18-r4-p3',
      passageNumber: 3,
      title: 'Alfred Wegener: science, exploration and the theory of continental drift',
      subtitle:
        'by Mott T Greene\n\nIntroduction\n\nYou should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c18-r4-p3-1',
          label: '1',
          content: `This is a book about the life and scientific work of Alfred Wegener, whose reputation today rests with his theory of continental displacements, better known as 'continental drift'. Wegener proposed this theory in 1912 and developed it extensively for nearly 20 years. His book on the subject, The Origin of Continents and Oceans, went through four editions and was the focus of an international controversy in his lifetime and for some years after his death.`,
        },
        {
          id: 'c18-r4-p3-2',
          label: '2',
          content: `Wegener's basic idea was that many mysteries about the Earth's history could be solved if one supposed that the continents moved laterally, rather than supposing that they remained fixed in place. Wegener showed in great detail how such continental movements were plausible and how they worked, using evidence from a large number of sciences including geology, geophysics, paleontology, and climatology.`,
        },
        {
          id: 'c18-r4-p3-3',
          label: '3',
          content: `Wegener's idea - that the continents move – is at the heart of the theory that guides Earth sciences today: namely plate tectonics. Plate tectonics is in many respects quite different from Wegener's proposal, in the same way that modern evolutionary theory is very different from the ideas Charles Darwin proposed in the 1850s about biological evolution. Yet plate tectonics is a descendant of Alfred Wegener's theory of continental drift, in quite the same way that modern evolutionary theory is a descendant of Darwin's theory of natural selection.`,
        },
        {
          id: 'c18-r4-p3-4',
          label: '4',
          content: `When I started writing about Wegener's life and work, one of the most intriguing things about him for me was that, although he came up with a theory on continental drift, he was not a geologist. He trained as an astronomer and pursued a career in atmospheric physics. When he proposed the theory of continental displacements in 1912, he was a lecturer in physics and astronomy at the University of Marburg, in southern Germany. However, he was not an 'unknown'. In 1906 he had set a world record (with his brother Kurt) for time aloft in a hot-air balloon: 52 hours. Between 1906 and 1908 he had taken part in a highly publicized and extremely dangerous expedition to the coast of northeast Greenland. He had also made a name for himself amongst a small circle of meteorologists and atmospheric physicists in Germany as the author of a textbook, Thermodynamics of the Atmosphere (1911), and of a number of interesting scientific papers.`,
        },
        {
          id: 'c18-r4-p3-5',
          label: '5',
          content: `As important as Wegener's work on continental drift has turned out to be, it was largely a sideline to his interest in atmospheric physics, geophysics, and paleoclimatology and thus I have been at great pains to put Wegener's work on continental drift in the larger context of his other scientific work, and in the even larger context of atmospheric sciences in his lifetime. This is a 'continental drift book' only to the extent that Wegener was interested in that topic and later became famous for it. My treatment of his other scientific work is no less detailed, though I certainly have devoted more attention to the reception of his ideas on continental displacement, as they were much more controversial than his other work. Readers interested in the specific detail of Wegener's career will see that he often stopped pursuing a given line of investigation (sometimes for years on end), only to pick it up later. I have tried to provide guideposts to his rapidly shifting interests by characterizing different phases of his life as careers in different sciences, which is reflected in the titles of the chapters. Thus, the index should be a sufficient guide for those interested in a particular aspect of Wegener's life but perhaps not all of it. My own feeling, however, is that the parts do not make as much sense on their own as do all of his activities taken together. In this respect I urge readers to try to experience Wegener's life as he lived it, with all the interruptions, changes of mind, and renewed efforts this entailed.`,
        },
        {
          id: 'c18-r4-p3-6',
          label: '6',
          content: `Wegener left behind a few published works but, as was standard practice, these reported the results of his work - not the journey he took to reach that point. Only a few hundred of the many thousands of letters he wrote and received in his lifetime have survived and he didn't keep notebooks or diaries that recorded his life and activities. He was not active (with a few exceptions) in scientific societies, and did not seek to find influence or advance his ideas through professional contacts and politics, spending most of his time at home in his study reading and writing, or in the field collecting observations.`,
        },
        {
          id: 'c18-r4-p3-7',
          label: '7',
          content: `Some famous scientists, such as Newton, Darwin, and Einstein, left mountains of written material behind, hundreds of notebooks and letters numbering in the tens of thousands. Others, like Michael Faraday, left extensive journals of their thoughts and speculations, parallel to their scientific notebooks. The more such material a scientist leaves behind, the better chance a biographer has of forming an accurate picture of how a scientist's ideas took shape and evolved.`,
        },
        {
          id: 'c18-r4-p3-8',
          label: '8',
          content: `I am firmly of the opinion that most of us, Wegener included, are not in any real sense the authors of our own lives. We plan, think, and act, often with apparent freedom, but most of the time our lives 'happen to us', and we only retrospectively turn this happenstance into a coherent narrative of fulfilled intentions. This book, therefore, is a story both of the life and scientific work that Alfred Wegener planned and intended and of the life and scientific work that actually 'happened to him'. These are, as I think you will soon see, not always the same thing.`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PASSAGE 1: Questions 1–5 (Matching Information)
    {
      id: 'c18-r4-g1',
      passageId: 'c18-r4-p1',
      questionType: 'matching_information',
      title: 'Questions 1–5',
      instructions:
        'Reading Passage 1 has five paragraphs, A–E.\nWhich paragraph contains the following information?\nWrite the correct letter, A–E, in boxes 1–5 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 1,
      endQuestionNumber: 5,
      questions: [
        {
          id: 'c18-r4-q1',
          questionNumber: 1,
          prompt: 'mention of several challenges to be overcome before a green roof can be installed',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph D lists multiple challenges: acquiring new skills such as landscaping, volunteers needed, installing drainage paths, meeting health and safety requirements, public access, planning restrictions, and disruption from activities.",
          evidenceQuote:
            'Those responsible for maintaining buildings may have to acquire new skills, such as landscaping... Other considerations include installing drainage paths, meeting health and safety requirements',
          paragraphRef: 'D',
        },
        {
          id: 'c18-r4-q2',
          questionNumber: 2,
          prompt: 'reference to a city where green roofs have been promoted for many years',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph C mentions: 'Toronto, Canada, has policies dating from the 1990s, encouraging the development of urban farms on rooftops.'",
          evidenceQuote:
            'Toronto, Canada, has policies dating from the 1990s, encouraging the development of urban farms on rooftops.',
          paragraphRef: 'C',
        },
        {
          id: 'c18-r4-q3',
          questionNumber: 3,
          prompt: 'a belief that existing green roofs should be used as a model for new ones',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph E concludes: 'The success stories need to be studied and replicated elsewhere, to make green, blue, brown and food-producing roofs the norm in cities around the world.'",
          evidenceQuote:
            'The success stories need to be studied and replicated elsewhere, to make green, blue, brown and food-producing roofs the norm in cities around the world.',
          paragraphRef: 'E',
        },
        {
          id: 'c18-r4-q4',
          questionNumber: 4,
          prompt: 'examples of how green roofs can work in combination with other green urban initiatives',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph B explains how green roofs can integrate with 'living walls' and with drainage systems on the ground, such as street trees.",
          evidenceQuote:
            "Ongoing research is showcasing how green roofs in cities can integrate with 'living walls'... Research also indicates that green roofs can be integrated with drainage systems on the ground, such as street trees",
          paragraphRef: 'B',
        },
        {
          id: 'c18-r4-q5',
          questionNumber: 5,
          prompt: 'the need to make a persuasive argument for the financial benefits of green roofs',
          options: SECTION_OPTIONS_PASSAGE1,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph D states: 'To convince investors and developers that installing green roofs is worthwhile, economic arguments are still the most important. The term \"natural capital\" has been developed to explain the economic value of nature...'",
          evidenceQuote:
            'To convince investors and developers that installing green roofs is worthwhile, economic arguments are still the most important.',
          paragraphRef: 'D',
        },
      ],
    },

    // PASSAGE 1: Questions 6–9 (Summary Completion Words)
    {
      id: 'c18-r4-g2',
      passageId: 'c18-r4-p1',
      questionType: 'summary_completion_words',
      title: 'Questions 6–9',
      instructions:
        'Complete the summary below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 6–9 on your answer sheet.',
      startQuestionNumber: 6,
      endQuestionNumber: 9,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Advantages of green roofs

City rooftops covered with greenery have many advantages. These include lessening the likelihood that floods will occur, reducing how much money is spent on [[6]] and creating environments that are suitable for wildlife. In many cases, they can also be used for producing [[7]].

There are also social benefits of green roofs. For example, the medical profession recommends [[8]] as an activity to help people cope with mental health issues. Studies have also shown that the availability of green spaces can prevent physical problems such as [[9]].`,
      questions: [
        {
          id: 'c18-r4-q6',
          questionNumber: 6,
          prompt: 'reducing how much money is spent on [6]',
          answerKey: 'energy',
          acceptedAlternatives: ['energy'],
          explanation:
            "Paragraph A lists among the benefits: 'saving on energy costs, mitigating the risk of floods, making habitats for urban wildlife...'",
          evidenceQuote: 'saving on energy costs, mitigating the risk of floods',
          paragraphRef: 'A',
        },
        {
          id: 'c18-r4-q7',
          questionNumber: 7,
          prompt: 'In many cases, they can also be used for producing [7]',
          answerKey: 'food',
          acceptedAlternatives: ['food'],
          explanation:
            "Paragraph A mentions: 'tackling air pollution and even growing food.'",
          evidenceQuote: 'tackling air pollution and even growing food.',
          paragraphRef: 'A',
        },
        {
          id: 'c18-r4-q8',
          questionNumber: 8,
          prompt: 'the medical profession recommends [8] as an activity to help people cope with mental health issues.',
          answerKey: 'gardening',
          acceptedAlternatives: ['gardening'],
          explanation:
            "Paragraph B states: 'Doctors are increasingly prescribing time spent gardening outdoors for patients dealing with anxiety and depression.'",
          evidenceQuote: 'Doctors are increasingly prescribing time spent gardening outdoors for patients dealing with anxiety and depression.',
          paragraphRef: 'B',
        },
        {
          id: 'c18-r4-q9',
          questionNumber: 9,
          prompt: 'Studies have also shown that the availability of green spaces can prevent physical problems such as [9]',
          answerKey: 'obesity',
          acceptedAlternatives: ['obesity'],
          explanation:
            "Paragraph B notes: 'access to even the most basic green spaces can provide a better quality of life for dementia sufferers and help people avoid obesity.'",
          evidenceQuote: 'help people avoid obesity.',
          paragraphRef: 'B',
        },
      ],
    },

    // PASSAGE 1: Questions 10 and 11 (Multiple Choice Multi-Select)
    {
      id: 'c18-r4-g3',
      passageId: 'c18-r4-p1',
      questionType: 'multiple_choice_multi',
      title: 'Questions 10 and 11',
      instructions:
        'Choose TWO letters, A–E.\nWrite the correct letters in boxes 10 and 11 on your answer sheet.\nWhich TWO advantages of using newer buildings for green roofs are mentioned in Paragraph C of the passage?',
      startQuestionNumber: 10,
      endQuestionNumber: 11,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q10_11_OPTIONS,
      questions: [
        {
          id: 'c18-r4-q10',
          questionNumber: 10,
          prompt: 'Which TWO advantages of using newer buildings for green roofs are mentioned in Paragraph C of the passage? (First advantage)',
          options: MC_Q10_11_OPTIONS,
          answerKey: ['C', 'D'],
          acceptedAlternatives: ['C', 'D'],
          explanation:
            "Paragraph C explains: 'Being able to keep enough water at roof height and distribute it right across the rooftop is crucial... And it's much easier to do this in newer buildings, which can typically hold greater weight, than to retro-fit old ones' (C: greater water-storage capacity). It also states: 'Having a stronger roof also makes it easier to grow a greater variety of plants, since the soil can be deeper' (D: ability to cultivate more plant types).",
          evidenceQuote:
            "keep enough water at roof height... hold greater weight... easier to grow a greater variety of plants",
          paragraphRef: 'C',
        },
        {
          id: 'c18-r4-q11',
          questionNumber: 11,
          prompt: 'Which TWO advantages of using newer buildings for green roofs are mentioned in Paragraph C of the passage? (Second advantage)',
          options: MC_Q10_11_OPTIONS,
          answerKey: ['C', 'D'],
          acceptedAlternatives: ['C', 'D'],
          explanation:
            "Paragraph C explains: 'Being able to keep enough water at roof height and distribute it right across the rooftop is crucial... And it's much easier to do this in newer buildings, which can typically hold greater weight, than to retro-fit old ones' (C: greater water-storage capacity). It also states: 'Having a stronger roof also makes it easier to grow a greater variety of plants, since the soil can be deeper' (D: ability to cultivate more plant types).",
          evidenceQuote:
            "keep enough water at roof height... hold greater weight... easier to grow a greater variety of plants",
          paragraphRef: 'C',
        },
      ],
    },

    // PASSAGE 1: Questions 12 and 13 (Multiple Choice Multi-Select)
    {
      id: 'c18-r4-g4',
      passageId: 'c18-r4-p1',
      questionType: 'multiple_choice_multi',
      title: 'Questions 12 and 13',
      instructions:
        'Choose TWO letters, A–E.\nWrite the correct letters in boxes 12 and 13 on your answer sheet.\nWhich TWO aims of new variations on the concept of green roofs are mentioned in Paragraph E of the passage?',
      startQuestionNumber: 12,
      endQuestionNumber: 13,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q12_13_OPTIONS,
      questions: [
        {
          id: 'c18-r4-q12',
          questionNumber: 12,
          prompt: 'Which TWO aims of new variations on the concept of green roofs are mentioned in Paragraph E of the passage? (First aim)',
          options: MC_Q12_13_OPTIONS,
          answerKey: ['A', 'D'],
          acceptedAlternatives: ['A', 'D'],
          explanation:
            "Paragraph E mentions: 'There are also combinations of green roofs with solar panels' (D: to generate power from a sustainable source), and ''brown roofs' which are wilder in nature and maximise biodiversity' (A: to provide habitats for a wide range of species).",
          evidenceQuote:
            "combinations of green roofs with solar panels, and 'brown roofs' which are wilder in nature and maximise biodiversity.",
          paragraphRef: 'E',
        },
        {
          id: 'c18-r4-q13',
          questionNumber: 13,
          prompt: 'Which TWO aims of new variations on the concept of green roofs are mentioned in Paragraph E of the passage? (Second aim)',
          options: MC_Q12_13_OPTIONS,
          answerKey: ['A', 'D'],
          acceptedAlternatives: ['A', 'D'],
          explanation:
            "Paragraph E mentions: 'There are also combinations of green roofs with solar panels' (D: to generate power from a sustainable source), and ''brown roofs' which are wilder in nature and maximise biodiversity' (A: to provide habitats for a wide range of species).",
          evidenceQuote:
            "combinations of green roofs with solar panels, and 'brown roofs' which are wilder in nature and maximise biodiversity.",
          paragraphRef: 'E',
        },
      ],
    },

    // PASSAGE 2: Questions 14–16 (Multiple Choice Single)
    {
      id: 'c18-r4-g5',
      passageId: 'c18-r4-p2',
      questionType: 'multiple_choice_single',
      title: 'Questions 14–16',
      instructions: 'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 14–16 on your answer sheet.',
      startQuestionNumber: 14,
      endQuestionNumber: 16,
      questions: [
        {
          id: 'c18-r4-q14',
          questionNumber: 14,
          prompt: 'What can we learn from the first paragraph?',
          options: MC_Q14_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 1 explains that in the 19th century intelligence was seen as innate, but 'Then, in the early 20th century, progressive thinkers revolted against the notion that inherent ability is destiny. Instead, educators such as John Dewey argued that every child's intelligence could be developed...' Thus it shows when ideas about the nature of intelligence began to shift (B).",
          evidenceQuote:
            'Then, in the early 20th century, progressive thinkers revolted against the notion that inherent ability is destiny.',
          paragraphRef: '1',
        },
        {
          id: 'c18-r4-q15',
          questionNumber: 15,
          prompt: 'The second paragraph describes how schools encourage students to',
          options: MC_Q15_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 2 describes how schools coax students 'away from seeing failure as an indication of their ability, and towards seeing it as a chance to improve that ability', citing that 'smart is something that you can get.' This encourages confidence in their potential to succeed (C).",
          evidenceQuote:
            'coaxing students away from seeing failure as an indication of their ability, and towards seeing it as a chance to improve that ability.',
          paragraphRef: '2',
        },
        {
          id: 'c18-r4-q16',
          questionNumber: 16,
          prompt: 'In the third paragraph, the writer suggests that students with a fixed mindset',
          options: MC_Q16_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 3 states that students who inferred success or failure was due to innate ability 'took on only those tasks that would not risk their sense of worth' and that this 'fixed mindset had led them to fear of failure and lack of effort.' Thus they are afraid to push themselves beyond what they see as their limitations (D).",
          evidenceQuote:
            'took on only those tasks that would not risk their sense of worth. This group had inferred that success or failure is due to innate ability, and this \'fixed mindset\' had led them to fear of failure',
          paragraphRef: '3',
        },
      ],
    },

    // PASSAGE 2: Questions 17–22 (Matching Features)
    {
      id: 'c18-r4-g6',
      passageId: 'c18-r4-p2',
      questionType: 'matching_features',
      title: 'Questions 17–22',
      instructions:
        'Look at the following statements (Questions 17–22) and the list of people below.\nMatch each statement with the correct person or people, A–E.\nWrite the correct letter, A–E, in boxes 17–22 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 17,
      endQuestionNumber: 22,
      optionsList: PEOPLE_OPTIONS_PASSAGE2,
      questions: [
        {
          id: 'c18-r4-q17',
          questionNumber: 17,
          prompt: 'The methodology behind the growth mindset studies was not strict enough.',
          options: PEOPLE_OPTIONS_PASSAGE2,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 5 states: 'The statistician Andrew Gelman claims that \"their research designs have enough degrees of freedom that they could take their data to support just about any theory at all\".' This criticises the methodology as not strict enough (C).",
          evidenceQuote:
            'The statistician Andrew Gelman claims that "their research designs have enough degrees of freedom that they could take their data to support just about any theory at all"',
          paragraphRef: '5',
        },
        {
          id: 'c18-r4-q18',
          questionNumber: 18,
          prompt: 'The idea of the growth mindset has been incorrectly interpreted.',
          options: PEOPLE_OPTIONS_PASSAGE2,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 6 states: 'In fact, she [Carol Dweck] argues that her work has been misunderstood and misapplied in a range of ways.'",
          evidenceQuote:
            'she argues that her work has been misunderstood and misapplied in a range of ways.',
          paragraphRef: '6',
        },
        {
          id: 'c18-r4-q19',
          questionNumber: 19,
          prompt: 'Intellectual ability is an unchangeable feature of each individual.',
          options: PEOPLE_OPTIONS_PASSAGE2,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 1 mentions that Alfred Binet held the view of intelligence as 'something innate' and sought to quantify fixed cognitive ability before thinkers revolted against the notion that inherent ability is destiny.",
          evidenceQuote:
            'Psychologist Alfred Binet, the developer of the first intelligence tests, was one of many 19th-century scientists who held that earlier view and sought to quantify cognitive ability.',
          paragraphRef: '1',
        },
        {
          id: 'c18-r4-q20',
          questionNumber: 20,
          prompt: 'The growth mindset should be promoted without students being aware of it.',
          options: PEOPLE_OPTIONS_PASSAGE2,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph 7 states: 'Growth mindset supporters David Yeager and Gregory Walton claim that interventions should be delivered in a subtle way to maximise their effectiveness. They say that if adolescents perceive a teacher's intervention as conveying that they are in need of help, this could undo its intended effects.'",
          evidenceQuote:
            'Growth mindset supporters David Yeager and Gregory Walton claim that interventions should be delivered in a subtle way to maximise their effectiveness.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r4-q21',
          questionNumber: 21,
          prompt: 'The growth mindset is not simply about boosting students\' morale.',
          options: PEOPLE_OPTIONS_PASSAGE2,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 6 quotes Carol Dweck: ''For me the growth mindset is a tool for learning and improvement. It's not just a vehicle for making children feel good.''",
          evidenceQuote:
            "It's not just a vehicle for making children feel good.",
          paragraphRef: '6',
        },
        {
          id: 'c18-r4-q22',
          questionNumber: 22,
          prompt: 'Research shows that the growth mindset has no effect on academic achievement.',
          options: PEOPLE_OPTIONS_PASSAGE2,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 5 quotes Professor Timothy Bates: ''Kids with the growth mindset aren't getting better grades, either before or after our intervention study.''",
          evidenceQuote:
            "Kids with the growth mindset aren't getting better grades, either before or after our intervention study.",
          paragraphRef: '5',
        },
      ],
    },

    // PASSAGE 2: Questions 23–26 (YES / NO / NOT GIVEN)
    {
      id: 'c18-r4-g7',
      passageId: 'c18-r4-p2',
      questionType: 'yes_no_not_given',
      title: 'Questions 23–26',
      instructions:
        'Do the following statements agree with the views of the writer in Reading Passage 2?\nIn boxes 23–26 on your answer sheet, write\nYES if the statement agrees with the views of the writer\nNO if the statement contradicts the views of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 23,
      endQuestionNumber: 26,
      questions: [
        {
          id: 'c18-r4-q23',
          questionNumber: 23,
          prompt: 'Dweck has handled criticisms of her work in an admirable way.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES', 'Yes'],
          explanation:
            "Paragraph 6 explicitly states: 'Much of this criticism is not lost on Dweck, and she deserves great credit for responding to it and adapting her work accordingly.' This agrees with the statement (YES).",
          evidenceQuote:
            'she deserves great credit for responding to it and adapting her work accordingly.',
          paragraphRef: '6',
        },
        {
          id: 'c18-r4-q24',
          questionNumber: 24,
          prompt: "Students' self-perception is a more effective driver of self-confidence than actual achievement is.",
          answerKey: 'NO',
          acceptedAlternatives: ['NO', 'No'],
          explanation:
            "Paragraph 7 contradicts this: 'there is evidence to suggest that the actual effect of achievement on self-perception is stronger than the other way round. To stand up in a classroom and successfully deliver a good speech is a genuine achievement, and that is likely to be more powerfully motivating than vague notions of \"motivation\" itself.' Therefore the claim contradicts the writer (NO).",
          evidenceQuote:
            'the actual effect of achievement on self-perception is stronger than the other way round.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r4-q25',
          questionNumber: 25,
          prompt: 'Recent evidence about growth mindset interventions has attracted unfair coverage in the media.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            "The passage discusses research criticisms and classroom implementation, but does not comment on whether media coverage of recent evidence has been unfair (NOT GIVEN).",
          evidenceQuote: '',
          paragraphRef: '8',
        },
        {
          id: 'c18-r4-q26',
          questionNumber: 26,
          prompt: 'Deliberate attempts to encourage students to strive for high achievement may have a negative effect.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES', 'Yes'],
          explanation:
            "Paragraph 8 states: 'It is hard to dispute that having faith in the capacity to change is a good attribute for students. Paradoxically, however, that aspiration is not well served by direct interventions that try to instil it. Motivational posters and talks are often a waste of time, and might well give students a deluded notion of what success actually means.' This confirms that deliberate attempts can have a negative effect (YES).",
          evidenceQuote:
            'that aspiration is not well served by direct interventions that try to instil it. Motivational posters and talks are often a waste of time, and might well give students a deluded notion of what success actually means.',
          paragraphRef: '8',
        },
      ],
    },

    // PASSAGE 3: Questions 27–30 (YES / NO / NOT GIVEN)
    {
      id: 'c18-r4-g8',
      passageId: 'c18-r4-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 27–30',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 27–30 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c18-r4-q27',
          questionNumber: 27,
          prompt: "Wegener's ideas about continental drift were widely disputed while he was alive.",
          answerKey: 'YES',
          acceptedAlternatives: ['YES', 'Yes'],
          explanation:
            "Paragraph 1 states: 'His book on the subject... was the focus of an international controversy in his lifetime and for some years after his death.' This matches the statement (YES).",
          evidenceQuote:
            'was the focus of an international controversy in his lifetime and for some years after his death.',
          paragraphRef: '1',
        },
        {
          id: 'c18-r4-q28',
          questionNumber: 28,
          prompt: 'The idea that the continents remained fixed in place was defended in a number of respected scientific publications.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN', 'Not Given'],
          explanation:
            "The passage mentions that people supposed the continents remained fixed in place, but does not state whether this was defended in respected scientific publications (NOT GIVEN).",
          evidenceQuote: '',
          paragraphRef: '2',
        },
        {
          id: 'c18-r4-q29',
          questionNumber: 29,
          prompt: 'Wegener relied on a limited range of scientific fields to support his theory of continental drift.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO', 'No'],
          explanation:
            "Paragraph 2 states: 'Wegener showed in great detail how such continental movements were plausible and how they worked, using evidence from a large number of sciences including geology, geophysics, paleontology, and climatology.' This directly contradicts 'a limited range' (NO).",
          evidenceQuote:
            'using evidence from a large number of sciences including geology, geophysics, paleontology, and climatology.',
          paragraphRef: '2',
        },
        {
          id: 'c18-r4-q30',
          questionNumber: 30,
          prompt: "The similarities between Wegener's theory of continental drift and modern-day plate tectonics are enormous.",
          answerKey: 'NO',
          acceptedAlternatives: ['NO', 'No'],
          explanation:
            "Paragraph 3 states: 'Plate tectonics is in many respects quite different from Wegener's proposal, in the same way that modern evolutionary theory is very different from the ideas Charles Darwin proposed in the 1850s...' Saying they are quite different contradicts 'the similarities are enormous' (NO).",
          evidenceQuote:
            "Plate tectonics is in many respects quite different from Wegener's proposal",
          paragraphRef: '3',
        },
      ],
    },

    // PASSAGE 3: Questions 31–36 (Summary Completion Options)
    {
      id: 'c18-r4-g9',
      passageId: 'c18-r4-p3',
      questionType: 'summary_completion_options',
      title: 'Questions 31–36',
      instructions:
        'Complete the summary using the list of phrases, A–J, below.\nWrite the correct letter, A–J, in boxes 31–36 on your answer sheet.',
      startQuestionNumber: 31,
      endQuestionNumber: 36,
      optionsList: SUMMARY_OPTIONS_PASSAGE3,
      contentWithGaps: `Wegener's life and work

One of the remarkable things about Wegener from a [[31]] is that although he proposed a theory of continental drift, he was not a geologist. His [[32]] were limited to atmospheric physics. However, at the time he proposed his theory of continental drift in 1912, he was already a person of [[33]]. Six years previously, there had been his [[34]] of 52 hours in a hot-air balloon, followed by his well-publicised but [[35]] of Greenland's coast. With the publication of his textbook on thermodynamics, he had also come to the attention of a [[36]] of German scientists.`,
      questions: [
        {
          id: 'c18-r4-q31',
          questionNumber: 31,
          prompt: 'One of the remarkable things about Wegener from a [31]',
          options: SUMMARY_OPTIONS_PASSAGE3,
          answerKey: 'I',
          acceptedAlternatives: ['I'],
          explanation:
            "Greene, his biographer, writes: 'When I started writing about Wegener's life and work, one of the most intriguing things about him for me was that, although he came up with a theory on continental drift, he was not a geologist.' This reflects I: 'biographer's perspective'.",
          evidenceQuote:
            "When I started writing about Wegener's life and work, one of the most intriguing things about him for me was that, although he came up with a theory on continental drift, he was not a geologist.",
          paragraphRef: '4',
        },
        {
          id: 'c18-r4-q32',
          questionNumber: 32,
          prompt: 'His [32] were limited to atmospheric physics.',
          options: SUMMARY_OPTIONS_PASSAGE3,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph 4 mentions he 'trained as an astronomer and pursued a career in atmospheric physics.' This matches F: 'professional interests'.",
          evidenceQuote: 'pursued a career in atmospheric physics.',
          paragraphRef: '4',
        },
        {
          id: 'c18-r4-q33',
          questionNumber: 33,
          prompt: 'However, at the time he proposed his theory of continental drift in 1912, he was already a person of [33].',
          options: SUMMARY_OPTIONS_PASSAGE3,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 4 states: 'However, he was not an \"unknown\".' Being not an unknown corresponds to A: 'modest fame'.",
          evidenceQuote: 'However, he was not an \'unknown\'.',
          paragraphRef: '4',
        },
        {
          id: 'c18-r4-q34',
          questionNumber: 34,
          prompt: 'Six years previously, there had been his [34] of 52 hours in a hot-air balloon',
          options: SUMMARY_OPTIONS_PASSAGE3,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 4 notes: 'In 1906 he had set a world record (with his brother Kurt) for time aloft in a hot-air balloon: 52 hours.' Setting a world record is C: 'record-breaking achievement'.",
          evidenceQuote:
            'In 1906 he had set a world record (with his brother Kurt) for time aloft in a hot-air balloon: 52 hours.',
          paragraphRef: '4',
        },
        {
          id: 'c18-r4-q35',
          questionNumber: 35,
          prompt: "followed by his well-publicised but [35] of Greenland's coast.",
          options: SUMMARY_OPTIONS_PASSAGE3,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Paragraph 4 continues: 'Between 1906 and 1908 he had taken part in a highly publicized and extremely dangerous expedition to the coast of northeast Greenland.' An extremely dangerous expedition is H: 'hazardous exploration'.",
          evidenceQuote:
            'highly publicized and extremely dangerous expedition to the coast of northeast Greenland.',
          paragraphRef: '4',
        },
        {
          id: 'c18-r4-q36',
          questionNumber: 36,
          prompt: 'he had also come to the attention of a [36] of German scientists.',
          options: SUMMARY_OPTIONS_PASSAGE3,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation:
            "Paragraph 4 states: 'He had also made a name for himself amongst a small circle of meteorologists and atmospheric physicists in Germany...' A small circle is E: 'select group'.",
          evidenceQuote:
            'made a name for himself amongst a small circle of meteorologists and atmospheric physicists in Germany',
          paragraphRef: '4',
        },
      ],
    },

    // PASSAGE 3: Questions 37–40 (Multiple Choice Single)
    {
      id: 'c18-r4-g10',
      passageId: 'c18-r4-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 37–40',
      instructions: 'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 37–40 on your answer sheet.',
      startQuestionNumber: 37,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c18-r4-q37',
          questionNumber: 37,
          prompt: 'What is Mott T Greene doing in the fifth paragraph?',
          options: MC_Q37_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "In Paragraph 5, Greene writes: 'My own feeling, however, is that the parts do not make as much sense on their own as do all of his activities taken together. In this respect I urge readers to try to experience Wegener's life as he lived it, with all the interruptions, changes of mind, and renewed efforts this entailed.' He is explaining why it is desirable to read the whole book (B).",
          evidenceQuote:
            "My own feeling, however, is that the parts do not make as much sense on their own as do all of his activities taken together. In this respect I urge readers to try to experience Wegener's life as he lived it",
          paragraphRef: '5',
        },
        {
          id: 'c18-r4-q38',
          questionNumber: 38,
          prompt: 'What is said about Wegener in the sixth paragraph?',
          options: MC_Q38_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 6 explains: 'He was not active (with a few exceptions) in scientific societies, and did not seek to find influence or advance his ideas through professional contacts and politics, spending most of his time at home in his study reading and writing...' This indicates he was not a particularly ambitious person (A).",
          evidenceQuote:
            'did not seek to find influence or advance his ideas through professional contacts and politics, spending most of his time at home in his study',
          paragraphRef: '6',
        },
        {
          id: 'c18-r4-q39',
          questionNumber: 39,
          prompt: 'What does Greene say about some other famous scientists?',
          options: MC_Q39_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 7 discusses scientists like Newton, Darwin, Einstein, and Faraday who left mountains of notebooks, letters, and journals, concluding: 'The more such material a scientist leaves behind, the better chance a biographer has of forming an accurate picture of how a scientist's ideas took shape and evolved.' Unlike Wegener (who left very little), they are easier subjects to write about (D).",
          evidenceQuote:
            'The more such material a scientist leaves behind, the better chance a biographer has of forming an accurate picture of how a scientist\'s ideas took shape and evolved.',
          paragraphRef: '7',
        },
        {
          id: 'c18-r4-q40',
          questionNumber: 40,
          prompt: "What is Greene's main point in the final paragraph?",
          options: MC_Q40_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "In Paragraph 8, Greene emphasizes: 'I am firmly of the opinion that most of us, Wegener included, are not in any real sense the authors of our own lives. We plan, think, and act, often with apparent freedom, but most of the time our lives \"happen to us\"...' This shows that people have little control over many aspects of their lives (C).",
          evidenceQuote:
            'most of us, Wegener included, are not in any real sense the authors of our own lives... most of the time our lives \'happen to us\'',
          paragraphRef: '8',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 18 Academic Reading Test 4',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge18ReadingTest4(authorId?: string) {
  const data = getCambridge18ReadingTest4Data();

  const validationErrors = validateTestVersion(data.passages, data.questionGroups);
  if (validationErrors.length > 0) {
    throw new Error(
      `Cambridge 18 Reading Test 4 validation failed:\n${validationErrors.join('\n')}`
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
