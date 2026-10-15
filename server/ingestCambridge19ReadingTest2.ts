import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ReadingPassage, QuestionGroup } from '../shared/types';
import { validateTestVersion } from './readingService';

export function getCambridge19ReadingTest2Data(): {
  title: string;
  testType: 'academic';
  category: 'mock';
  timeLimitMinutes: number;
  passages: ReadingPassage[];
  questionGroups: QuestionGroup[];
} {
  const passages: ReadingPassage[] = [
    {
      id: 'c19-r2-p1',
      passageNumber: 1,
      title: 'The Industrial Revolution in Britain',
      subtitle:
        'You should spend about 20 minutes on Questions 1–13, which are based on Reading Passage 1 below.',
      paragraphs: [
        {
          id: 'c19-r2-p1-1',
          label: '1',
          content: `The Industrial Revolution began in Britain in the mid-1700s and by the 1830s and 1840s had spread to many other parts of the world, including the United States. In Britain, it was a period when a largely rural, agrarian* society was transformed into an industrialised, urban one. Goods that had once been crafted by hand started to be produced in mass quantities by machines in factories, thanks to the invention of steam power and the introduction of new machines and manufacturing techniques in textiles, iron-making and other industries.

* agrarian: relating to the land, especially the use of land for farming`,
        },
        {
          id: 'c19-r2-p1-2',
          label: '2',
          content: `The foundations of the Industrial Revolution date back to the early 1700s, when the English inventor Thomas Newcomen designed the first modern steam engine. Called the 'atmospheric steam engine', Newcomen's invention was originally used to power machines that pumped water out of mines. In the 1760s, the Scottish engineer James Watt started to adapt one of Newcomen's models, and succeeded in making it far more efficient. Watt later worked with the English manufacturer Matthew Boulton to invent a new steam engine driven by both the forward and backward strokes of the piston, while the gear mechanism it was connected to produced rotary motion. It was a key innovation that would allow steam power to spread across British industries.`,
        },
        {
          id: 'c19-r2-p1-3',
          label: '3',
          content: `The demand for coal, which was a relatively cheap energy source, grew rapidly during the Industrial Revolution, as it was needed to run not only the factories used to produce manufactured goods, but also steam-powered transportation. In the early 1800s, the English engineer Richard Trevithick built a steam-powered locomotive, and by 1830 goods and passengers were being transported between the industrial centres of Manchester and Liverpool. In addition, steam-powered boats and ships were widely used to carry goods along Britain's canals as well as across the Atlantic.`,
        },
        {
          id: 'c19-r2-p1-4',
          label: '4',
          content: `Britain had produced textiles like wool, linen and cotton, for hundreds of years, but prior to the Industrial Revolution, the British textile business was a true 'cottage industry', with the work performed in small workshops or even homes by individual spinners, weavers and dyers. Starting in the mid-1700s, innovations like the spinning jenny and the power loom made weaving cloth and spinning yarn and thread much easier. With these machines, relatively little labour was required to produce cloth, and the new, mechanised textile factories that opened around the country were quickly able to meet customer demand for cloth both at home and abroad.`,
        },
        {
          id: 'c19-r2-p1-5',
          label: '5',
          content: `The British iron industry also underwent major change as it adopted new innovations. Chief among the new techniques was the smelting of iron ore with coke (a material made by heating coal) instead of the traditional charcoal. This method was cheaper and produced metals that were of a higher quality, enabling Britain's iron and steel production to expand in response to demand created by the Napoleonic Wars (1803-15) and the expansion of the railways from the 1830s.`,
        },
        {
          id: 'c19-r2-p1-6',
          label: '6',
          content: `The latter part of the Industrial Revolution also saw key advances in communication methods, as people increasingly saw the need to communicate efficiently over long distances. In 1837, British inventors William Cooke and Charles Wheatstone patented the first commercial telegraphy system. In the 1830s and 1840s, Samuel Morse and other inventors worked on their own versions in the United States. Cooke and Wheatstone's system was soon used for railway signalling in the UK. As the speed of the new locomotives increased, it was essential to have a fast and effective means of avoiding collisions.`,
        },
        {
          id: 'c19-r2-p1-7',
          label: '7',
          content: `The impact of the Industrial Revolution on people's lives was immense. Although many people in Britain had begun moving to the cities from rural areas before the Industrial Revolution, this accelerated dramatically with industrialisation, as the rise of large factories turned smaller towns into major cities in just a few decades. This rapid urbanisation brought significant challenges, as overcrowded cities suffered from pollution and inadequate sanitation.`,
        },
        {
          id: 'c19-r2-p1-8',
          label: '8',
          content: `Although industrialisation increased the country's economic output overall and improved the standard of living for the middle and upper classes, many poor people continued to struggle. Factory workers had to work long hours in dangerous conditions for extremely low wages. These conditions along with the rapid pace of change fuelled opposition to industrialisation. A group of British workers who became known as 'Luddites' were British weavers and textile workers who objected to the increased use of mechanised looms and knitting frames. Many had spent years learning their craft, and they feared that unskilled machine operators were robbing them of their livelihood. A few desperate weavers began breaking into factories and smashing textile machines. They called themselves Luddites after Ned Ludd, a young apprentice who was rumoured to have wrecked a textile machine in 1779.`,
        },
        {
          id: 'c19-r2-p1-9',
          label: '9',
          content: `The first major instances of machine breaking took place in 1811 in the city of Nottingham, and the practice soon spread across the country. Machine-breaking Luddites attacked and burned factories, and in some cases they even exchanged gunfire with company guards and soldiers. The workers wanted employers to stop installing new machinery, but the British government responded to the uprisings by making machine-breaking punishable by death. The unrest finally reached its peak in April 1812, when a few Luddites were shot during an attack on a mill near Huddersfield. In the days that followed, other Luddites were arrested, and dozens were hanged or transported to Australia. By 1813, the Luddite resistance had all but vanished.`,
        },
      ],
    },
    {
      id: 'c19-r2-p2',
      passageNumber: 2,
      title: 'Athletes and stress',
      subtitle:
        'You should spend about 20 minutes on Questions 14–26, which are based on Reading Passage 2 below.',
      paragraphs: [
        {
          id: 'c19-r2-p2-A',
          label: 'A',
          content: `It isn't easy being a professional athlete. Not only are the physical demands greater than most people could handle, athletes also face intense psychological pressure during competition. This is something that British tennis player Emma Raducanu wrote about on social media following her withdrawal from the 2021 Wimbledon tournament. Though the young player had been doing well in the tournament, she began having difficulty regulating her breathing and heart rate during a match, which she later attributed to 'the accumulation of the excitement and the buzz'.`,
        },
        {
          id: 'c19-r2-p2-B',
          label: 'B',
          content: `For athletes, some level of performance stress is almost unavoidable. But there are many different factors that dictate just how people's minds and bodies respond to stressful events. Typically, stress is the result of an exchange between two factors: demands and resources. An athlete may feel stressed about an event if they feel the demands on them are greater than they can handle. These demands include the high level of physical and mental effort required to succeed, and also the athlete's concerns about the difficulty of the event, their chance of succeeding, and any potential dangers such as injury. Resources, on the other hand, are a person's ability to cope with these demands. These include factors such as the competitor's degree of confidence, how much they believe they can control the situation's outcome, and whether they're looking forward to the event or not.`,
        },
        {
          id: 'c19-r2-p2-C',
          label: 'C',
          content: `Each new demand or change in circumstances affects whether a person responds positively or negatively to stress. Typically, the more resources a person feels they have in handling the situation, the more positive their stress response. This positive stress response is called a challenge state. But should the person feel there are too many demands placed on them, the more likely they are to experience a negative stress response - known as a threat state. Research shows that the challenge states lead to good performance, while threat states lead to poorer performance. So, in Emma Raducanu's case, a much larger audience, higher expectations and facing a more skilful opponent, may all have led her to feel there were greater demands being placed on her at Wimbledon - but she didn't have the resources to tackle them. This led to her experiencing a threat response.`,
        },
        {
          id: 'c19-r2-p2-D',
          label: 'D',
          content: `Our challenge and threat responses essentially influence how our body responds to stressful situations, as both affect the production of adrenaline and cortisol – also known as 'stress hormones'. During a challenge state, adrenaline increases the amount of blood pumped from the heart and expands the blood vessels, which allows more energy to be delivered to the muscles and brain. This increase of blood and decrease of pressure in the blood vessels has been consistently related to superior sport performance in everything from cricket batting, to golf putting and football penalty taking. But during a threat state, cortisol inhibits the positive effect of adrenaline, resulting in tighter blood vessels, higher blood pressure, slower psychological responses, and a faster heart rate. In short, a threat state makes people more anxious - they make worse decisions and perform more poorly. In tennis players, cortisol has been associated with more unsuccessful serves and greater anxiety.`,
        },
        {
          id: 'c19-r2-p2-E',
          label: 'E',
          content: `That said, anxiety is also a common experience for athletes when they're under pressure. Anxiety can increase heart rate and perspiration, cause heart palpitations, muscle tremors and shortness of breath, as well as headaches, nausea, stomach pain, weakness and a desire to escape in more extreme cases. Anxiety can also reduce concentration and self-control and cause overthinking. The intensity with which a person experiences anxiety depends on the demands and resources they have. Anxiety may also manifest itself in the form of excitement or nervousness depending on the stress response. Negative stress responses can be damaging to both physical and mental health - and repeated episodes of anxiety coupled with negative responses can increase risk of heart disease and depression.`,
        },
        {
          id: 'c19-r2-p2-F',
          label: 'F',
          content: `But there are many ways athletes can ensure they respond positively under pressure. Positive stress responses can be promoted through the language that they and others - such as coaches or parents - use. Psychologists can also help athletes change how they see their physiological responses - such as helping them see a higher heart rate as excitement, rather than nerves. Developing psychological skills, such as visualisation, can also help decrease physiological responses to threat. Visualisation may involve the athlete recreating a mental picture of a time when they performed well, or picturing themselves doing well in the future. This can help create a feeling of control over the stressful event. Recreating competitive pressure during training can also help athletes learn how to deal with stress. An example of this might be scoring athletes against their peers to create a sense of competition. This would increase the demands which players experience compared to a normal training session, while still allowing them to practise coping with stress.`,
        },
      ],
    },
    {
      id: 'c19-r2-p3',
      passageNumber: 3,
      title: 'An inquiry into the existence of the gifted child',
      subtitle:
        'You should spend about 20 minutes on Questions 27–40, which are based on Reading Passage 3 below.',
      paragraphs: [
        {
          id: 'c19-r2-p3-1',
          label: '1',
          content: `Let us start by looking at a modern 'genius', Maryam Mirzakhani, who died at the early age of 40. She was the only woman to win the Fields Medal - the mathematical equivalent of a Nobel prize. It would be easy to assume that someone as special as Mirzakhani must have been one of those 'gifted' children, those who have an extraordinary ability in a specific sphere of activity or knowledge. But look closer and a different story emerges.`,
        },
        {
          id: 'c19-r2-p3-2',
          label: '2',
          content: `Mirzakhani was born in Tehran, Iran. She went to a highly selective girls' school but maths wasn't her interest - reading was. She loved novels and would read anything she could lay her hands on. As for maths, she did rather poorly at it for the first couple of years in her middle school, but became interested when her elder brother told her about what he'd learned. He shared a famous maths problem from a magazine that fascinated her - and she was hooked.`,
        },
        {
          id: 'c19-r2-p3-3',
          label: '3',
          content: `In adult life it is clear that she was curious, excited by what she did and also resolute in the face of setbacks. One of her comments sums it up. 'Of course, the most rewarding part is the “Aha” moment, the excitement of discovery and enjoyment of understanding something new... But most of the time, doing mathematics for me is like being on a long hike with no trail and no end in sight.' That trail took her to the heights of original research into mathematics.`,
        },
        {
          id: 'c19-r2-p3-4',
          label: '4',
          content: `Is her background unusual? Apparently not. Most Nobel prize winners were unexceptional in childhood. Einstein was slow to talk as a baby. He failed the general part of the entry test to Zurich Polytechnic - though they let him in because of high physics and maths scores. He struggled at work initially, but he kept plugging away and eventually rewrote the laws of Newtonian mechanics with his theory of relativity.`,
        },
        {
          id: 'c19-r2-p3-5',
          label: '5',
          content: `There has been a considerable amount of research on high performance over the last century that suggests it goes way beyond tested intelligence. On top of that, research is clear that brains are flexible, new neural pathways can be created, and IQ isn't fixed. For example, just because you can read stories with hundreds of pages at the age of five doesn't mean you will still be ahead of your contemporaries in your teens.`,
        },
        {
          id: 'c19-r2-p3-6',
          label: '6',
          content: `While the jury is out on giftedness being innate and other factors potentially making the difference, what is certain is that the behaviours associated with high levels of performance are replicable and most can be taught - even traits such as curiosity. According to my colleague Prof Deborah Eyre, with whom I've collaborated on the book Great Minds and How to Grow Them, the latest neuroscience and psychological research suggests most individuals can reach levels of performance associated in school with the gifted and talented. However, they must be taught the right attitudes and approaches to their learning and develop the attributes of high performers - curiosity, persistence and hard work, for example - an approach Eyre calls 'high performance learning'. Critically, they need the right support in developing those approaches at home as well as at school.`,
        },
        {
          id: 'c19-r2-p3-7',
          label: '7',
          content: `Prof Anders Ericsson, an eminent education psychologist at Florida State University, US, is the co-author of Peak: Secrets from the New Science of Expertise. After research going back to 1980 into diverse achievements, from music to memory to sport, he doesn't think unique and innate talents are at the heart of performance. Deliberate practice, that stretches you every step of the way, and around 10,000 hours of it, is what produces the goods. It's not a magic number - the highest performers move on to doing a whole lot more, of course. Ericsson's memory research is particularly interesting because random students, trained in memory techniques for the study, went on to outperform others thought to have innately superior memories - those who you might call gifted.`,
        },
        {
          id: 'c19-r2-p3-8',
          label: '8',
          content: `But it is perhaps the work of Benjamin Bloom, another distinguished American educationist working in the 1980s, that gives the most pause for thought. Bloom's team looked at a group of extraordinarily high achieving people in disciplines as varied as ballet, swimming, piano, tennis, maths, sculpture and neurology. He found a pattern of parents encouraging and supporting their children, often in areas they enjoyed themselves. Bloom's outstanding people had worked very hard and consistently at something they had become hooked on when at a young age, and their parents all emerged as having strong work ethics themselves.`,
        },
        {
          id: 'c19-r2-p3-9',
          label: '9',
          content: `Eyre says we know how high performers learn. From that she has developed a high performing learning approach. She is working on this with a group of schools, both in Britain and abroad. Some spin-off research, which looked in detail at 24 of the 3,000 children being studied who were succeeding despite difficult circumstances, found something remarkable. Half were getting free school meals because of poverty, more than half were living with a single parent, and four in five were living in disadvantaged areas. Interviews uncovered strong evidence of an adult or adults in the child's life who valued and supported education, either in the immediate or extended family or in the child's wider community. Children talked about the need to work hard at school, to listen in class and keep trying.`,
        },
        {
          id: 'c19-r2-p3-10',
          label: '10',
          content: `Let us end with Einstein, the epitome of a genius. He clearly had curiosity, character and determination. He struggled against rejection in early life but was undeterred. Did he think he was a genius or even gifted? He once wrote: 'It's not that I'm so smart, it's just that I stay with problems longer. Most people say it is the intellect which makes a great scientist. They are wrong: it is character.'`,
        },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // Passage 1: Questions 1-7 (Note Completion)
    {
      id: 'c19-r2-g1',
      passageId: 'c19-r2-p1',
      questionType: 'note_completion',
      title: "Britain's Industrial Revolution",
      instructions:
        'Complete the notes below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 1–7 on your answer sheet.',
      startQuestionNumber: 1,
      endQuestionNumber: 7,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      contentWithGaps: `Britain's Industrial Revolution

Steam power
• Newcomen's steam engine was used in mines to remove water.
• In Watt and Boulton's steam engine, the movement of the [[1]] was linked to a gear system.
• A greater supply of [[2]] was required to power steam engines.

Textile industry
• Before the Industrial Revolution, spinners and weavers worked at home and in [[3]].
• Not as much [[4]] was needed to produce cloth once the spinning jenny and power loom were invented.

Iron industry
• Smelting of iron ore with coke resulted in material that was better [[5]].
• Demand for iron increased with the growth of the [[6]].

Communications
• Cooke and Wheatstone patented the first telegraphy system.
• The telegraphy system was used to prevent locomotives colliding.

Urbanisation
• Small towns turned into cities very quickly.
• The new cities were dirty, crowded and lacked sufficient [[7]].`,
      questions: [
        {
          id: 'c19-r2-q1',
          questionNumber: 1,
          prompt:
            "In Watt and Boulton's steam engine, the movement of the [1] was linked to a gear system.",
          answerKey: 'piston',
          acceptedAlternatives: ['piston'],
          explanation:
            "Paragraph 2 states: 'Watt later worked with the English manufacturer Matthew Boulton to invent a new steam engine driven by both the forward and backward strokes of the piston, while the gear mechanism it was connected to produced rotary motion.'",
          evidenceQuote:
            'driven by both the forward and backward strokes of the piston, while the gear mechanism it was connected to produced rotary motion',
          paragraphRef: '2',
        },
        {
          id: 'c19-r2-q2',
          questionNumber: 2,
          prompt: 'A greater supply of [2] was required to power steam engines.',
          answerKey: 'coal',
          acceptedAlternatives: ['coal'],
          explanation:
            "Paragraph 3 states: 'The demand for coal, which was a relatively cheap energy source, grew rapidly during the Industrial Revolution, as it was needed to run not only the factories used to produce manufactured goods, but also steam-powered transportation.'",
          evidenceQuote:
            'The demand for coal, which was a relatively cheap energy source, grew rapidly during the Industrial Revolution, as it was needed to run not only the factories used to produce manufactured goods, but also steam-powered transportation.',
          paragraphRef: '3',
        },
        {
          id: 'c19-r2-q3',
          questionNumber: 3,
          prompt:
            'Before the Industrial Revolution, spinners and weavers worked at home and in [3].',
          answerKey: 'workshops',
          acceptedAlternatives: ['workshops'],
          explanation:
            "Paragraph 4 states: '...prior to the Industrial Revolution, the British textile business was a true “cottage industry”, with the work performed in small workshops or even homes by individual spinners, weavers and dyers.'",
          evidenceQuote:
            'with the work performed in small workshops or even homes by individual spinners, weavers and dyers',
          paragraphRef: '4',
        },
        {
          id: 'c19-r2-q4',
          questionNumber: 4,
          prompt:
            'Not as much [4] was needed to produce cloth once the spinning jenny and power loom were invented.',
          answerKey: 'labour',
          acceptedAlternatives: ['labour', 'labor'],
          explanation:
            "Paragraph 4 states: 'With these machines, relatively little labour was required to produce cloth, and the new, mechanised textile factories that opened around the country were quickly able to meet customer demand for cloth both at home and abroad.'",
          evidenceQuote: 'relatively little labour was required to produce cloth',
          paragraphRef: '4',
        },
        {
          id: 'c19-r2-q5',
          questionNumber: 5,
          prompt:
            'Smelting of iron ore with coke resulted in material that was better [5].',
          answerKey: 'quality',
          acceptedAlternatives: ['quality'],
          explanation:
            "Paragraph 5 states: 'This method was cheaper and produced metals that were of a higher quality, enabling Britain's iron and steel production to expand...'",
          evidenceQuote: 'produced metals that were of a higher quality',
          paragraphRef: '5',
        },
        {
          id: 'c19-r2-q6',
          questionNumber: 6,
          prompt: 'Demand for iron increased with the growth of the [6].',
          answerKey: 'railways',
          acceptedAlternatives: ['railways', 'railway'],
          explanation:
            "Paragraph 5 states: '...enabling Britain's iron and steel production to expand in response to demand created by the Napoleonic Wars (1803-15) and the expansion of the railways from the 1830s.'",
          evidenceQuote:
            'in response to demand created by the Napoleonic Wars (1803-15) and the expansion of the railways from the 1830s',
          paragraphRef: '5',
        },
        {
          id: 'c19-r2-q7',
          questionNumber: 7,
          prompt:
            'The new cities were dirty, crowded and lacked sufficient [7].',
          answerKey: 'sanitation',
          acceptedAlternatives: ['sanitation'],
          explanation:
            "Paragraph 7 states: 'This rapid urbanisation brought significant challenges, as overcrowded cities suffered from pollution and inadequate sanitation.'",
          evidenceQuote: 'overcrowded cities suffered from pollution and inadequate sanitation',
          paragraphRef: '7',
        },
      ],
    },

    // Passage 1: Questions 8-13 (True / False / Not Given)
    {
      id: 'c19-r2-g2',
      passageId: 'c19-r2-p1',
      questionType: 'true_false_not_given',
      title: 'Questions 8–13',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 8–13 on your answer sheet, write\nTRUE if the statement agrees with the information\nFALSE if the statement contradicts the information\nNOT GIVEN if there is no information on this',
      startQuestionNumber: 8,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c19-r2-q8',
          questionNumber: 8,
          prompt:
            "Britain's canal network grew rapidly so that more goods could be transported around the country.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 3 mentions: 'In addition, steam-powered boats and ships were widely used to carry goods along Britain's canals as well as across the Atlantic.' It does not mention whether Britain's canal network grew rapidly.",
          evidenceQuote:
            "steam-powered boats and ships were widely used to carry goods along Britain's canals as well as across the Atlantic",
          paragraphRef: '3',
        },
        {
          id: 'c19-r2-q9',
          questionNumber: 9,
          prompt:
            'Costs in the iron industry rose when the technique of smelting iron ore with coke was introduced.',
          answerKey: 'FALSE',
          acceptedAlternatives: ['FALSE'],
          explanation:
            "Paragraph 5 states: 'Chief among the new techniques was the smelting of iron ore with coke (a material made by heating coal) instead of the traditional charcoal. This method was cheaper and produced metals that were of a higher quality...' This method was cheaper, not more expensive.",
          evidenceQuote: 'This method was cheaper and produced metals that were of a higher quality',
          paragraphRef: '5',
        },
        {
          id: 'c19-r2-q10',
          questionNumber: 10,
          prompt:
            "Samuel Morse's communication system was more reliable than that developed by William Cooke and Charles Wheatstone.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 6 states that Cooke and Wheatstone patented the first commercial telegraphy system and that Samuel Morse worked on his own version in the United States, but no comparison of reliability is made between the two systems.",
          evidenceQuote:
            'In the 1830s and 1840s, Samuel Morse and other inventors worked on their own versions in the United States.',
          paragraphRef: '6',
        },
        {
          id: 'c19-r2-q11',
          questionNumber: 11,
          prompt:
            'The economic benefits of industrialisation were limited to certain sectors of society.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 8 states: 'Although industrialisation increased the country's economic output overall and improved the standard of living for the middle and upper classes, many poor people continued to struggle.'",
          evidenceQuote:
            'improved the standard of living for the middle and upper classes, many poor people continued to struggle',
          paragraphRef: '8',
        },
        {
          id: 'c19-r2-q12',
          questionNumber: 12,
          prompt:
            'Some skilled weavers believed that the introduction of the new textile machines would lead to job losses.',
          answerKey: 'TRUE',
          acceptedAlternatives: ['TRUE'],
          explanation:
            "Paragraph 8 states: 'Many had spent years learning their craft, and they feared that unskilled machine operators were robbing them of their livelihood.'",
          evidenceQuote:
            'they feared that unskilled machine operators were robbing them of their livelihood',
          paragraphRef: '8',
        },
        {
          id: 'c19-r2-q13',
          questionNumber: 13,
          prompt:
            'There was some sympathy among local people for the Luddites who were arrested near Huddersfield.',
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 9 describes how a few Luddites were shot during an attack on a mill near Huddersfield and others were arrested and hanged or transported to Australia, but there is no mention of whether local people sympathised with them.",
          evidenceQuote:
            'In the days that followed, other Luddites were arrested, and dozens were hanged or transported to Australia.',
          paragraphRef: '9',
        },
      ],
    },

    // Passage 2: Questions 14-18 (Matching Information)
    {
      id: 'c19-r2-g3',
      passageId: 'c19-r2-p2',
      questionType: 'matching_information',
      title: 'Questions 14–18',
      instructions:
        'Reading Passage 2 has six paragraphs, A-F.\nWhich paragraph contains the following information?\nWrite the correct letter, A-F, in boxes 14–18 on your answer sheet.\nNB You may use any letter more than once.',
      startQuestionNumber: 14,
      endQuestionNumber: 18,
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
          id: 'c19-r2-q14',
          questionNumber: 14,
          prompt: 'reference to two chemical compounds which impact on performance',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph D refers to 'adrenaline and cortisol – also known as “stress hormones”' and explains how they affect performance.",
          evidenceQuote:
            "both affect the production of adrenaline and cortisol – also known as 'stress hormones'",
          paragraphRef: 'D',
        },
        {
          id: 'c19-r2-q15',
          questionNumber: 15,
          prompt: 'examples of strategies for minimising the effects of stress',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph F discusses multiple strategies for managing stress, including positive language, reframing physiological responses, developing psychological skills such as visualisation, and recreating competitive pressure during training.",
          evidenceQuote:
            'Developing psychological skills, such as visualisation, can also help decrease physiological responses to threat.',
          paragraphRef: 'F',
        },
        {
          id: 'c19-r2-q16',
          questionNumber: 16,
          prompt: 'how a sportsperson accounted for their own experience of stress',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph A states: 'This is something that British tennis player Emma Raducanu wrote about on social media following her withdrawal from the 2021 Wimbledon tournament... which she later attributed to “the accumulation of the excitement and the buzz”.'",
          evidenceQuote:
            "which she later attributed to 'the accumulation of the excitement and the buzz'",
          paragraphRef: 'A',
        },
        {
          id: 'c19-r2-q17',
          questionNumber: 17,
          prompt: 'study results indicating links between stress responses and performance',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph C states: 'Research shows that the challenge states lead to good performance, while threat states lead to poorer performance.'",
          evidenceQuote:
            'Research shows that the challenge states lead to good performance, while threat states lead to poorer performance.',
          paragraphRef: 'C',
        },
        {
          id: 'c19-r2-q18',
          questionNumber: 18,
          prompt:
            'mention of people who can influence how athletes perceive their stress responses',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation:
            "Paragraph F states: 'Positive stress responses can be promoted through the language that they and others - such as coaches or parents - use. Psychologists can also help athletes change how they see their physiological responses...'",
          evidenceQuote:
            'such as coaches or parents - use. Psychologists can also help athletes change how they see their physiological responses',
          paragraphRef: 'F',
        },
      ],
    },

    // Passage 2: Questions 19-22 (Sentence Completion)
    {
      id: 'c19-r2-g4',
      passageId: 'c19-r2-p2',
      questionType: 'sentence_completion',
      title: 'Questions 19–22',
      instructions:
        'Complete the sentences below.\nChoose ONE WORD ONLY from the passage for each answer.\nWrite your answers in boxes 19–22 on your answer sheet.',
      startQuestionNumber: 19,
      endQuestionNumber: 22,
      maxWords: 1,
      wordLimitRule: 'ONE WORD ONLY',
      questions: [
        {
          id: 'c19-r2-q19',
          questionNumber: 19,
          prompt:
            'Performance stress involves many demands on the athlete, for example, coping with the possible risk of [19].',
          answerKey: 'injury',
          acceptedAlternatives: ['injury'],
          explanation:
            "Paragraph B states: 'These demands include the high level of physical and mental effort required to succeed, and also the athlete's concerns about the difficulty of the event, their chance of succeeding, and any potential dangers such as injury.'",
          evidenceQuote: 'any potential dangers such as injury',
          paragraphRef: 'B',
        },
        {
          id: 'c19-r2-q20',
          questionNumber: 20,
          prompt: 'Cortisol can cause tennis players to produce fewer good [20].',
          answerKey: 'serves',
          acceptedAlternatives: ['serves'],
          explanation:
            "Paragraph D states: 'In tennis players, cortisol has been associated with more unsuccessful serves and greater anxiety.'",
          evidenceQuote:
            'In tennis players, cortisol has been associated with more unsuccessful serves and greater anxiety.',
          paragraphRef: 'D',
        },
        {
          id: 'c19-r2-q21',
          questionNumber: 21,
          prompt:
            'Psychologists can help athletes to view their physiological responses as the effect of a positive feeling such as [21].',
          answerKey: 'excitement',
          acceptedAlternatives: ['excitement'],
          explanation:
            "Paragraph F states: 'Psychologists can also help athletes change how they see their physiological responses - such as helping them see a higher heart rate as excitement, rather than nerves.'",
          evidenceQuote: 'helping them see a higher heart rate as excitement, rather than nerves',
          paragraphRef: 'F',
        },
        {
          id: 'c19-r2-q22',
          questionNumber: 22,
          prompt:
            '[22] is an example of a psychological technique which can reduce an athlete\'s stress responses.',
          answerKey: 'Visualisation',
          acceptedAlternatives: [
            'Visualisation',
            'visualisation',
            'Visualization',
            'visualization',
          ],
          explanation:
            "Paragraph F states: 'Developing psychological skills, such as visualisation, can also help decrease physiological responses to threat.'",
          evidenceQuote:
            'Developing psychological skills, such as visualisation, can also help decrease physiological responses to threat.',
          paragraphRef: 'F',
        },
      ],
    },

    // Passage 2: Questions 23 and 24 (Multiple Choice Multi-Select)
    {
      id: 'c19-r2-g5',
      passageId: 'c19-r2-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions:
        'Choose TWO letters, A-E.\nWrite the correct letters in boxes 23 and 24 on your answer sheet.\nWhich TWO facts about Emma Raducanu\'s withdrawal from the Wimbledon tournament are mentioned in the text?',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'the stage at which she dropped out of the tournament' },
        { key: 'B', text: 'symptoms of her performance stress at the tournament' },
        { key: 'C', text: 'measures which she had taken to manage her stress levels' },
        {
          key: 'D',
          text: 'aspects of the Wimbledon tournament which increased her stress levels',
        },
        {
          key: 'E',
          text: 'reactions to her social media posts about her experience at Wimbledon',
        },
      ],
      questions: [
        {
          id: 'c19-r2-q23',
          questionNumber: 23,
          prompt:
            'Which TWO facts about Emma Raducanu\'s withdrawal from the Wimbledon tournament are mentioned in the text?',
          options: [
            { key: 'A', text: 'the stage at which she dropped out of the tournament' },
            { key: 'B', text: 'symptoms of her performance stress at the tournament' },
            { key: 'C', text: 'measures which she had taken to manage her stress levels' },
            {
              key: 'D',
              text: 'aspects of the Wimbledon tournament which increased her stress levels',
            },
            {
              key: 'E',
              text: 'reactions to her social media posts about her experience at Wimbledon',
            },
          ],
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation:
            "Paragraph A mentions symptoms: 'she began having difficulty regulating her breathing and heart rate during a match' (Option B). Paragraph C mentions aspects that increased her stress: 'a much larger audience, higher expectations and facing a more skilful opponent, may all have led her to feel there were greater demands being placed on her at Wimbledon' (Option D).",
          evidenceQuote:
            'difficulty regulating her breathing and heart rate... a much larger audience, higher expectations and facing a more skilful opponent',
          paragraphRef: 'A, C',
        },
        {
          id: 'c19-r2-q24',
          questionNumber: 24,
          prompt:
            'Which TWO facts about Emma Raducanu\'s withdrawal from the Wimbledon tournament are mentioned in the text?',
          options: [
            { key: 'A', text: 'the stage at which she dropped out of the tournament' },
            { key: 'B', text: 'symptoms of her performance stress at the tournament' },
            { key: 'C', text: 'measures which she had taken to manage her stress levels' },
            {
              key: 'D',
              text: 'aspects of the Wimbledon tournament which increased her stress levels',
            },
            {
              key: 'E',
              text: 'reactions to her social media posts about her experience at Wimbledon',
            },
          ],
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation:
            "Paragraph A mentions symptoms: 'she began having difficulty regulating her breathing and heart rate during a match' (Option B). Paragraph C mentions aspects that increased her stress: 'a much larger audience, higher expectations and facing a more skilful opponent, may all have led her to feel there were greater demands being placed on her at Wimbledon' (Option D).",
          evidenceQuote:
            'difficulty regulating her breathing and heart rate... a much larger audience, higher expectations and facing a more skilful opponent',
          paragraphRef: 'A, C',
        },
      ],
    },

    // Passage 2: Questions 25 and 26 (Multiple Choice Multi-Select)
    {
      id: 'c19-r2-g6',
      passageId: 'c19-r2-p2',
      questionType: 'multiple_choice_multi',
      title: 'Questions 25 and 26',
      instructions:
        'Choose TWO letters, A-E.\nWrite the correct letters in boxes 25 and 26 on your answer sheet.\nWhich TWO facts about anxiety are mentioned in Paragraph E of the text?',
      startQuestionNumber: 25,
      endQuestionNumber: 26,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'the factors which determine how severe it may be' },
        { key: 'B', text: 'how long it takes for its effects to become apparent' },
        { key: 'C', text: 'which of its symptoms is most frequently encountered' },
        { key: 'D', text: 'the types of athletes who are most likely to suffer from it' },
        { key: 'E', text: 'the harm that can result if athletes experience it too often' },
      ],
      questions: [
        {
          id: 'c19-r2-q25',
          questionNumber: 25,
          prompt:
            'Which TWO facts about anxiety are mentioned in Paragraph E of the text?',
          options: [
            { key: 'A', text: 'the factors which determine how severe it may be' },
            { key: 'B', text: 'how long it takes for its effects to become apparent' },
            { key: 'C', text: 'which of its symptoms is most frequently encountered' },
            { key: 'D', text: 'the types of athletes who are most likely to suffer from it' },
            { key: 'E', text: 'the harm that can result if athletes experience it too often' },
          ],
          answerKey: ['A', 'E'],
          acceptedAlternatives: ['A', 'E'],
          explanation:
            "Paragraph E states: 'The intensity with which a person experiences anxiety depends on the demands and resources they have' (factors determining severity, Option A), and 'repeated episodes of anxiety coupled with negative responses can increase risk of heart disease and depression' (harm resulting from experiencing it too often, Option E).",
          evidenceQuote:
            'The intensity with which a person experiences anxiety depends on the demands and resources they have... repeated episodes of anxiety coupled with negative responses can increase risk of heart disease and depression',
          paragraphRef: 'E',
        },
        {
          id: 'c19-r2-q26',
          questionNumber: 26,
          prompt:
            'Which TWO facts about anxiety are mentioned in Paragraph E of the text?',
          options: [
            { key: 'A', text: 'the factors which determine how severe it may be' },
            { key: 'B', text: 'how long it takes for its effects to become apparent' },
            { key: 'C', text: 'which of its symptoms is most frequently encountered' },
            { key: 'D', text: 'the types of athletes who are most likely to suffer from it' },
            { key: 'E', text: 'the harm that can result if athletes experience it too often' },
          ],
          answerKey: ['A', 'E'],
          acceptedAlternatives: ['A', 'E'],
          explanation:
            "Paragraph E states: 'The intensity with which a person experiences anxiety depends on the demands and resources they have' (factors determining severity, Option A), and 'repeated episodes of anxiety coupled with negative responses can increase risk of heart disease and depression' (harm resulting from experiencing it too often, Option E).",
          evidenceQuote:
            'The intensity with which a person experiences anxiety depends on the demands and resources they have... repeated episodes of anxiety coupled with negative responses can increase risk of heart disease and depression',
          paragraphRef: 'E',
        },
      ],
    },

    // Passage 3: Questions 27-32 (Summary Completion with Options)
    {
      id: 'c19-r2-g7',
      passageId: 'c19-r2-p3',
      questionType: 'summary_completion_options',
      title: 'Maryam Mirzakhani',
      instructions:
        'Complete the summary using the list of phrases, A–K, below.\nWrite the correct letter, A–K, in boxes 27–32 on your answer sheet.',
      startQuestionNumber: 27,
      endQuestionNumber: 32,
      optionsList: [
        { key: 'A', text: 'appeal' },
        { key: 'B', text: 'determined' },
        { key: 'C', text: 'intrigued' },
        { key: 'D', text: 'single' },
        { key: 'E', text: 'achievement' },
        { key: 'F', text: 'devoted' },
        { key: 'G', text: 'involved' },
        { key: 'H', text: 'unique' },
        { key: 'I', text: 'innovative' },
        { key: 'J', text: 'satisfaction' },
        { key: 'K', text: 'intent' },
      ],
      contentWithGaps: `Maryam Mirzakhani
Maryam Mirzakhani is regarded as [[27]] in the field of mathematics because she was the only female holder of the prestigious Fields Medal - a record that she retained at the time of her death. However, maths held little [[28]] for her as a child and in fact her performance was below average until she was [[29]] by a difficult puzzle that one of her siblings showed her.

Later, as a professional mathematician, she had an inquiring mind and proved herself to be [[30]] when things did not go smoothly. She said she got the greatest [[31]] from making ground-breaking discoveries and in fact she was responsible for some extremely [[32]] mathematical studies.`,
      questions: [
        {
          id: 'c19-r2-q27',
          questionNumber: 27,
          prompt:
            'Maryam Mirzakhani is regarded as [27] in the field of mathematics because she was the only female holder of the prestigious Fields Medal - a record that she retained at the time of her death.',
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation:
            "Paragraph 1 states: 'She was the only woman to win the Fields Medal - the mathematical equivalent of a Nobel prize.' Being the only woman to achieve this makes her unique (Option H).",
          evidenceQuote: 'She was the only woman to win the Fields Medal',
          paragraphRef: '1',
        },
        {
          id: 'c19-r2-q28',
          questionNumber: 28,
          prompt: 'However, maths held little [28] for her as a child...',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation:
            "Paragraph 2 states: 'maths wasn't her interest - reading was.' This means maths held little appeal for her as a child (Option A).",
          evidenceQuote: "maths wasn't her interest - reading was",
          paragraphRef: '2',
        },
        {
          id: 'c19-r2-q29',
          questionNumber: 29,
          prompt:
            '...and in fact her performance was below average until she was [29] by a difficult puzzle that one of her siblings showed her.',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 2 states: 'He shared a famous maths problem from a magazine that fascinated her - and she was hooked.' Fascinated corresponds to intrigued (Option C).",
          evidenceQuote:
            'He shared a famous maths problem from a magazine that fascinated her - and she was hooked.',
          paragraphRef: '2',
        },
        {
          id: 'c19-r2-q30',
          questionNumber: 30,
          prompt:
            'Later, as a professional mathematician, she had an inquiring mind and proved herself to be [30] when things did not go smoothly.',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 3 states: 'she was curious, excited by what she did and also resolute in the face of setbacks.' Resolute in the face of setbacks corresponds to determined (Option B).",
          evidenceQuote: 'resolute in the face of setbacks',
          paragraphRef: '3',
        },
        {
          id: 'c19-r2-q31',
          questionNumber: 31,
          prompt:
            'She said she got the greatest [31] from making ground-breaking discoveries...',
          answerKey: 'J',
          acceptedAlternatives: ['J'],
          explanation:
            "Paragraph 3 quotes her: 'Of course, the most rewarding part is the “Aha” moment, the excitement of discovery and enjoyment of understanding something new...' The most rewarding part and enjoyment correspond to satisfaction (Option J).",
          evidenceQuote:
            'the most rewarding part is the “Aha” moment, the excitement of discovery and enjoyment of understanding something new',
          paragraphRef: '3',
        },
        {
          id: 'c19-r2-q32',
          questionNumber: 32,
          prompt:
            '...and in fact she was responsible for some extremely [32] mathematical studies.',
          answerKey: 'I',
          acceptedAlternatives: ['I'],
          explanation:
            "Paragraph 3 states: 'That trail took her to the heights of original research into mathematics.' Original research corresponds to innovative studies (Option I).",
          evidenceQuote: 'That trail took her to the heights of original research into mathematics.',
          paragraphRef: '3',
        },
      ],
    },

    // Passage 3: Questions 33-37 (Yes / No / Not Given)
    {
      id: 'c19-r2-g8',
      passageId: 'c19-r2-p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 33–37',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 33–37 on your answer sheet, write\nYES if the statement agrees with the claims of the writer\nNO if the statement contradicts the claims of the writer\nNOT GIVEN if it is impossible to say what the writer thinks about this',
      startQuestionNumber: 33,
      endQuestionNumber: 37,
      questions: [
        {
          id: 'c19-r2-q33',
          questionNumber: 33,
          prompt:
            'Many people who ended up winning prestigious intellectual prizes only reached an average standard when young.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 4 states: 'Most Nobel prize winners were unexceptional in childhood.' This agrees with the claim that they only reached an average standard when young.",
          evidenceQuote: 'Most Nobel prize winners were unexceptional in childhood.',
          paragraphRef: '4',
        },
        {
          id: 'c19-r2-q34',
          questionNumber: 34,
          prompt: "Einstein's failures as a young man were due to his lack of confidence.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 4 mentions that Einstein failed the general part of the entry test to Zurich Polytechnic and struggled at work initially, but does not state that this was caused by a lack of confidence.",
          evidenceQuote:
            'He failed the general part of the entry test to Zurich Polytechnic... He struggled at work initially',
          paragraphRef: '4',
        },
        {
          id: 'c19-r2-q35',
          questionNumber: 35,
          prompt:
            'It is difficult to reach agreement on whether some children are actually born gifted.',
          answerKey: 'YES',
          acceptedAlternatives: ['YES'],
          explanation:
            "Paragraph 6 begins: 'While the jury is out on giftedness being innate and other factors potentially making the difference...', meaning no definitive consensus or agreement has been reached.",
          evidenceQuote:
            'While the jury is out on giftedness being innate and other factors potentially making the difference',
          paragraphRef: '6',
        },
        {
          id: 'c19-r2-q36',
          questionNumber: 36,
          prompt: "Einstein was upset by the public's view of his life's work.",
          answerKey: 'NOT GIVEN',
          acceptedAlternatives: ['NOT GIVEN'],
          explanation:
            "Paragraph 10 discusses Einstein's view that character matters more than intellect in making a great scientist, but there is no mention of whether he was upset by the public's view.",
          evidenceQuote:
            'Most people say it is the intellect which makes a great scientist. They are wrong: it is character.',
          paragraphRef: '10',
        },
        {
          id: 'c19-r2-q37',
          questionNumber: 37,
          prompt:
            'Einstein put his success down to the speed at which he dealt with scientific questions.',
          answerKey: 'NO',
          acceptedAlternatives: ['NO'],
          explanation:
            "Paragraph 10 quotes Einstein: 'It's not that I'm so smart, it's just that I stay with problems longer.' Staying with problems longer contradicts putting his success down to speed.",
          evidenceQuote:
            "It's not that I'm so smart, it's just that I stay with problems longer.",
          paragraphRef: '10',
        },
      ],
    },

    // Passage 3: Questions 38-40 (Multiple Choice Single)
    {
      id: 'c19-r2-g9',
      passageId: 'c19-r2-p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 38–40',
      instructions:
        'Choose the correct letter, A, B, C or D.\nWrite the correct letter in boxes 38–40 on your answer sheet.',
      startQuestionNumber: 38,
      endQuestionNumber: 40,
      questions: [
        {
          id: 'c19-r2-q38',
          questionNumber: 38,
          prompt:
            "What does Eyre believe is needed for children to equal 'gifted' standards?",
          options: [
            { key: 'A', text: 'strict discipline from the teaching staff' },
            { key: 'B', text: 'assistance from their peers in the classroom' },
            {
              key: 'C',
              text: 'the development of a spirit of inquiry towards their studies',
            },
            {
              key: 'D',
              text: 'the determination to surpass everyone else\'s achievements',
            },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation:
            "Paragraph 6 states: 'However, they must be taught the right attitudes and approaches to their learning and develop the attributes of high performers - curiosity, persistence and hard work, for example...'. Curiosity corresponds directly to developing a spirit of inquiry.",
          evidenceQuote:
            'develop the attributes of high performers - curiosity, persistence and hard work, for example',
          paragraphRef: '6',
        },
        {
          id: 'c19-r2-q39',
          questionNumber: 39,
          prompt: "What is the result of Ericsson's research?",
          options: [
            {
              key: 'A',
              text: 'Very gifted students do not need to work on improving memory skills.',
            },
            {
              key: 'B',
              text: 'Being born with a special gift is not the key factor in becoming expert.',
            },
            {
              key: 'C',
              text: 'Including time for physical exercise is crucial in raising performance.',
            },
            {
              key: 'D',
              text: '10,000 hours of relevant and demanding work will create a genius.',
            },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation:
            "Paragraph 7 states: 'he doesn't think unique and innate talents are at the heart of performance. Deliberate practice, that stretches you every step of the way, and around 10,000 hours of it, is what produces the goods.' Thus being born with a special gift is not the key factor.",
          evidenceQuote:
            "he doesn't think unique and innate talents are at the heart of performance. Deliberate practice, that stretches you every step of the way, and around 10,000 hours of it, is what produces the goods.",
          paragraphRef: '7',
        },
        {
          id: 'c19-r2-q40',
          questionNumber: 40,
          prompt:
            'In the penultimate paragraph, it is stated the key to some deprived children\'s success is',
          options: [
            { key: 'A', text: 'a regular and nourishing diet at home.' },
            { key: 'B', text: 'the loving support of more than one parent.' },
            {
              key: 'C',
              text: 'a community which has well-funded facilities for learning.',
            },
            {
              key: 'D',
              text: 'the guidance of someone who recognises the benefits of learning.',
            },
          ],
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation:
            "Paragraph 9 states: 'Interviews uncovered strong evidence of an adult or adults in the child's life who valued and supported education, either in the immediate or extended family or in the child's wider community.' Valuing and supporting education means recognising the benefits of learning.",
          evidenceQuote:
            'strong evidence of an adult or adults in the child\'s life who valued and supported education',
          paragraphRef: '9',
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 19 Academic Reading Test 2',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    passages,
    questionGroups,
  };
}

export async function ingestCambridge19ReadingTest2(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
}> {
  const data = getCambridge19ReadingTest2Data();
  const errors = validateTestVersion(data.passages, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 19 Reading Test 2 data validation failed:\n- ${errors.join('\n- ')}`
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
      "SELECT id, current_version_number FROM reading_tests WHERE title = ? OR title LIKE '%Cambridge%19%Academic%Reading%Test 2%' LIMIT 1"
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
