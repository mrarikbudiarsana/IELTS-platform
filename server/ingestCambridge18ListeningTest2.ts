import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'It has suitable geographical features.' },
  { key: 'B', text: 'There is easy access to local facilities.' },
  { key: 'C', text: 'It has good connections with the airport.' },
  { key: 'D', text: 'The land is of little agricultural value.' },
  { key: 'E', text: 'It will be convenient for workers.' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'the facilities for cyclists' },
  { key: 'B', text: 'the impact on the environment' },
  { key: 'C', text: 'the encouragement of good relations between residents' },
  { key: 'D', text: 'the low cost of all the accommodation' },
  { key: 'E', text: 'the rural location' },
];

const MAP_OPTIONS = [
  { key: 'A', text: 'Location A' },
  { key: 'B', text: 'Location B' },
  { key: 'C', text: 'Location C' },
  { key: 'D', text: 'Location D' },
  { key: 'E', text: 'Location E' },
  { key: 'F', text: 'Location F' },
  { key: 'G', text: 'Location G' },
  { key: 'H', text: 'Location H' },
  { key: 'I', text: 'Location I' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'It was the most severe eruption in modern times.' },
  { key: 'B', text: 'It led to the formal study of volcanoes.' },
  { key: 'C', text: 'It had a profound effect on society.' },
];

const MC_Q22_OPTIONS = [
  { key: 'A', text: 'the number of places producing them' },
  { key: 'B', text: 'the contradictions in them' },
  { key: 'C', text: 'the lack of scientific data to support them' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'People thought it was similar to ordinary fog.' },
  { key: 'B', text: 'It was associated with health issues.' },
  { key: 'C', text: 'It completely blocked out the sun for weeks.' },
];

const MC_Q24_OPTIONS = [
  { key: 'A', text: 'came to the wrong conclusion about the cause of the haze.' },
  { key: 'B', text: 'was the first to identify the reason for the haze.' },
  { key: 'C', text: 'supported the opinions of other observers about the haze.' },
];

const MC_Q25_OPTIONS = [
  { key: 'A', text: 'how widespread the effects were' },
  { key: 'B', text: 'how long-lasting the effects were' },
  { key: 'C', text: 'the number of deaths it caused' },
  { key: 'D', text: 'the speed at which the volcanic ash cloud spread' },
  { key: 'E', text: 'how people ignored the warning signs' },
];

const MATCHING_Q27_OPTIONS = [
  { key: 'A', text: 'This country suffered the most severe loss of life.' },
  { key: 'B', text: 'The impact on agriculture was predictable.' },
  { key: 'C', text: 'There was a significant increase in deaths of young people.' },
  { key: 'D', text: 'Animals suffered from a sickness.' },
  { key: 'E', text: 'This country saw the highest rise in food prices in the world.' },
  { key: 'F', text: 'It caused a particularly harsh winter.' },
];

function multiQuestion(
  id: string,
  questionNumber: number,
  prompt: string,
  options: { key: string; text: string }[],
  answerKey: string[],
  explanation: string,
  transcriptExcerpt: string,
  audioTimestampSeconds: number
): QuestionItem {
  return { id, questionNumber, prompt, options, answerKey, explanation, transcriptExcerpt, audioTimestampSeconds };
}

export function getCambridge18ListeningTest2Data(): {
  title: string;
  category: 'mock';
  audioMode: 'part_audios';
  timeLimitMinutes: number;
  audioConfig: ListeningAudioConfig;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
} {
  const parts: ListeningPart[] = [
    {
      id: 'c18-l2-p1',
      partNumber: 1,
      title: "Part 1: Working at Milo's Restaurants",
      context: "A woman gives information to a man about working at Milo's Restaurants and two specific job vacancies.",
      audioUrl: '/audio/listening/c18_test2_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `WOMAN: So, I understand you're interested in restaurant work?
MAN: Yes. I've got a bit of experience and I can provide references.
WOMAN: That's good. I can check all that later. Now, Milo's Restaurants have some vacancies at the moment. They're a really good company to work for. Lots of benefits.
MAN: Oh right.
WOMAN: Yes. They've got a very good reputation for looking after staff. For example, all employees get training - even temporary staff.
MAN: Oh really? That's quite unusual, isn't it?
WOMAN: Certainly is.
MAN: And do staff get free uniforms too?
WOMAN: Um... you just need to wear a white T-shirt and black trousers, it says here. So I guess not ... But another benefit of working for a big company like this is that you can get a discount at any of their restaurants.
MAN: Even at weekends?
WOMAN: No, but you'll be working then anyway.
MAN: Oh yes. I suppose so. Most of their restaurants are in the city centre, aren't they? So, easy to get to by bus?
WOMAN: Yes. That's right. But if you have to do a late shift and finish work after midnight, the company will pay for you to get a taxi home.
MAN: I probably won't need one. I think I'd use my bike.
WOMAN: OK. Now, they do have some quite specific requirements for the kind of person they're looking for. Milo's is a young, dynamic company and they're really keen on creating a strong team. It's really important that you can fit in and get on well with everyone.
MAN: Yeah. I've got no problem with that. It sounds good, actually. The last place I worked for was quite demanding too. We had to make sure we gave a really high level of service.
WOMAN: That's good to hear because that will be equally important at Milo's. I know they want people who have an eye for detail.
MAN: That's fine. I'm very used to working in that kind of environment.
WOMAN: Perfect. So the only other thing that's required is good communication skills, so you'll need to have a certificate in English.
MAN: Sure.
WOMAN: OK. Let's have a look at the current job vacancies at Milo's. The first one is in Wivenhoe Street.
MAN: Sorry, where?
WOMAN: Wivenhoe. W-I-V-E-N-H-O-E. It's quite central, just off Cork Street.
MAN: Oh right.
WOMAN: They're looking for a breakfast supervisor.
MAN: That would be OK.
WOMAN: So you're probably familiar with the kind of responsibilities involved. Obviously checking that all the portions are correct, etc., and then things like checking all the procedures for cleaning the equipment are being followed.
MAN: OK. And what about the salary? In my last job I was getting £9.50 per hour. I was hoping to get a bit more than that.
WOMAN: Well, to begin with, you'd be getting £9.75 but that goes up to £11.25 after three months.
MAN: That's not too bad. And I suppose it's a very early start?
WOMAN: Mmm. That's the only unattractive thing about this job. But then you have the afternoons and evenings free. So the restaurant starts serving breakfast from 7 a.m. And you'd have to be there at 5.30 to set everything up. But you'd be finished at 12.30.
MAN: Mmm. Well, as you say, there are advantages to that.
WOMAN: Now, you might also be interested in the job at the City Road branch. That's for a junior chef, so again a position of responsibility.
MAN: I might prefer that, actually.
WOMAN: Right, well obviously this role would involve supporting the sous chef and other senior staff. And you'd be responsible for making sure there's enough stock each week - and sorting out all the deliveries.
MAN: I've never done that before, but I imagine it's fairly straightforward, once you get the hang of it.
WOMAN: Yes, and you'd be working alongside more experienced staff to begin with, so I'm sure it wouldn't be a problem. The salary's slightly higher here. It's an annual salary of £23,000.
MAN: Right.
WOMAN: I know that if they like you, it's likely you'll be promoted quite quickly. So that's worth thinking about.
MAN: Yes. It does sound interesting. What are the hours like?
WOMAN: The usual, I think. There's a lot of evening and weekend work, but they're closed on Mondays. But you do get one Sunday off every four weeks. So would you like me to send off your application?`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 25, quote: "For example, all employees get training - even temporary staff." },
        { questionNumber: 2, timestampSeconds: 42, quote: "you can get a discount at any of their restaurants." },
        { questionNumber: 3, timestampSeconds: 58, quote: "the company will pay for you to get a taxi home." },
        { questionNumber: 4, timestampSeconds: 75, quote: "We had to make sure we gave a really high level of service." },
        { questionNumber: 5, timestampSeconds: 90, quote: "you'll need to have a certificate in English." },
        { questionNumber: 6, timestampSeconds: 105, quote: "Wivenhoe. W-I-V-E-N-H-O-E. It's quite central, just off Cork Street." },
        { questionNumber: 7, timestampSeconds: 125, quote: "checking all the procedures for cleaning the equipment are being followed." },
        { questionNumber: 8, timestampSeconds: 145, quote: "Well, to begin with, you'd be getting £9.75" },
        { questionNumber: 9, timestampSeconds: 170, quote: "making sure there's enough stock each week - and sorting out all the deliveries." },
        { questionNumber: 10, timestampSeconds: 195, quote: "closed on Mondays. But you do get one Sunday off every four weeks." },
      ],
    },
    {
      id: 'c18-l2-p2',
      partNumber: 2,
      title: 'Part 2: New housing development in Nunston',
      context: 'Mark Reynolds gives a presentation to the public about the new housing development planned in Nunston.',
      audioUrl: '/audio/listening/c18_test2_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Hello everyone. It's good to see that so many members of the public have shown up for our presentation on the new housing development planned on the outskirts of Nunston. I'm Mark Reynolds and I'm Communications Manager at the development.

I'll start by giving you a brief overview of our plans for the development. So one thing I'm sure you'll want to know is why we've selected this particular site for a housing development. At present it's being used for farming, like much of the land around Nunston. But because of the new industrial centre in Nunston, there's a lot of demand for housing for employees in the region, as many employees are having to commute long distances at present. Of course, there's also the fact that we have an international airport just 20 minutes' drive away, but although that's certainly convenient, it wasn't one of our major criteria for choosing the site. We were more interested in the fact that there's an excellent hospital just 15 kilometres away, and a large secondary school even closer than that. One drawback to the site is that it's on quite a steep slope, but we've taken account of that in our planning so it shouldn't be a major problem.

We've had a lot of positive feedback about the plans. People like the wide variety of accommodation types and prices, and the fact that it's only a short drive to get out into the countryside from the development. We were particularly pleased that so many people liked the designs for the layout of the development, with the majority of people saying it generally made a good impression and blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife on the site. Some people have mentioned that they'd like to see more facilities for cyclists, and we'll look at that, but the overall feedback has been that the design and facilities of the development make it seem a place where people of all ages can live together happily.

OK. So I'll put a map of the proposed development up on the screen. You'll see it's bounded on the south side by the main road, which then goes on to Nunston. Another boundary is formed by London Road, on the western side of the development. Inside the development there'll be about 400 houses and 3 apartment blocks.

There'll also be a school for children up to 11 years old. If you look at the South Entrance at the bottom of the map, there's a road from there that goes right up through the development. The school will be on that road, at the corner of the second turning to the left.

A large sports centre is planned with facilities for indoor and outdoor activities. This will be on the western side of the development, just below the road that branches off from London Road.

There'll be a clinic where residents can go if they have any health problems. Can you see the lake towards the top of the map? The clinic will be just below this, to the right of a street of houses.

There'll also be a community centre for people of all ages. On the northeast side of the development, there'll be a row of specially designed houses specifically for residents over 65, and the community centre will be adjoining this.

We haven't forgotten about shopping. There'll be a supermarket between the two entrances to the development. We're planning to leave the three large trees near London Road, and it'll be just to the south of these.

It's planned to have a playground for younger children. If you look at the road that goes up from the South Entrance, you'll see it curves round to the left at the top, and the playground will be in that curve, with nice views of the lake.

OK, so now does anyone have any questions?`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 35, quote: "there's a lot of demand for housing for employees in the region ... hospital just 15 kilometres away, and a large secondary school even closer" },
        { questionNumber: 12, timestampSeconds: 45, quote: "there's a lot of demand for housing for employees in the region ... hospital just 15 kilometres away, and a large secondary school even closer" },
        { questionNumber: 13, timestampSeconds: 65, quote: "blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife on the site ... place where people of all ages can live together happily." },
        { questionNumber: 14, timestampSeconds: 75, quote: "blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife on the site ... place where people of all ages can live together happily." },
        { questionNumber: 15, timestampSeconds: 95, quote: "The school will be on that road, at the corner of the second turning to the left." },
        { questionNumber: 16, timestampSeconds: 110, quote: "western side of the development, just below the road that branches off from London Road." },
        { questionNumber: 17, timestampSeconds: 125, quote: "Can you see the lake towards the top of the map? The clinic will be just below this, to the right of a street of houses." },
        { questionNumber: 18, timestampSeconds: 138, quote: "specially designed houses specifically for residents over 65, and the community centre will be adjoining this." },
        { questionNumber: 19, timestampSeconds: 152, quote: "three large trees near London Road, and it'll be just to the south of these." },
        { questionNumber: 20, timestampSeconds: 165, quote: "it curves round to the left at the top, and the playground will be in that curve, with nice views of the lake." },
      ],
    },
    {
      id: 'c18-l2-p3',
      partNumber: 3,
      title: 'Part 3: The Laki eruption of 1783',
      context: 'Two students, Adam and Michelle, discuss their presentation on the 1783 volcanic eruption of Laki in Iceland.',
      audioUrl: '/audio/listening/c18_test2_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `ADAM: So, Michelle, shall we make a start on our presentation? We haven't got that much time left.
MICHELLE: No, Adam. But at least we've done all the background reading. I found it really interesting - I'd never even heard of the Laki eruption before this.
ADAM: Me neither. I suppose 1783 is a long time ago.
MICHELLE: But it was a huge eruption and it had such devastating consequences.
ADAM: I know. It was great there were so many primary sources to look at. It really gives you a sense of how catastrophic the volcano was. People were really trying to make sense of the science for the first time.
MICHELLE: That's right. But what I found more significant was how it impacted directly and indirectly on political events, as well as having massive social and economic consequences.
ADAM: I know. That should be the main focus of our presentation.
MICHELLE: The observations made by people at the time were interesting, weren't they? I mean, they all gave a pretty consistent account of what happened, even if they didn't always use the same terminology.
ADAM: Yeah. I was surprised there were so many weather stations established by that time – so, you know, you can see how the weather changed, often by the hour.
MICHELLE: Right. Writers at the time talked about the Laki haze to describe the volcanic fog that spread across Europe. They all realised that this wasn't the sort of fog they were used to - and of course this was in pre-industrial times - so they hadn't experienced sulphur-smelling fog before.
ADAM: No, that's true.
MICHELLE: Reports from the period blamed the haze for an increase in headaches, respiratory issues and asthma attacks. And they all describe how it covered the sun and made it look a strange red colour.
ADAM: Must have been very weird.
MICHELLE: It's interesting that Benjamin Franklin wrote about the haze. Did you read that? He was the American ambassador in Paris at the time.
ADAM: Yeah. At first no one realised that the haze was caused by the volcanic eruption in Iceland.
MICHELLE: It was Benjamin Franklin who realised that before anyone else.
ADAM: He's often credited with that, apparently. But a French naturalist beat him to it - I can't remember his name. I'd have to look it up. Then other naturalists had the same idea - all independently of each other.
MICHELLE: Oh right. We should talk about the immediate impact of the eruption, which was obviously enormous - especially in Iceland, where so many people died.
ADAM: Mmm. You'd expect that - and the fact that the volcanic ash drifted so swiftly - but not that the effects would go on for so long. Or that two years after the eruption, strange weather events were being reported as far away as North America and North Africa.
MICHELLE: No. I found all that hard to believe too. It must have been terrible – and there was nothing anyone could do about it, even if they knew the ash cloud was coming in their direction.
MICHELLE: We should run through some of the terrible consequences of the eruption experienced in different countries. There's quite a varied range.
ADAM: Starting with Iceland, where the impact on farming was devastating.
MICHELLE: Mmm. One of the most dramatic things there was the effect on livestock as they grazed in the fields. They were poisoned because they ate vegetation that had been contaminated with fluorine as a result of the volcanic fallout.
ADAM: That was horrible. In Egypt, the bizarre weather patterns led to a severe drought and as a result the Nile didn't flood, which meant the crops all failed.
MICHELLE: It's so far from where the eruption happened and yet the famine there led to more people dying than any other country. It was worse than the plague.
ADAM: OK. Then in the UK the mortality rate went up a lot - presumably from respiratory illnesses. According to one report it was about double the usual number and included an unusually high percentage of people under the age of 25.
MICHELLE: Mmm. I think people will be surprised to hear that the weather in the USA was badly affected too. George Washington even makes a note in his diary that they were snowbound until March in Virginia. That was before he became president.
ADAM: Yes, and there was ice floating down the Mississippi, which was unprecedented.
MICHELLE: Astonishing, really. Anyway, what do you think...`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 30, quote: "what I found more significant was how it impacted directly and indirectly on political events, as well as having massive social and economic consequences. ADAM: I know. That should be the main focus" },
        { questionNumber: 22, timestampSeconds: 50, quote: "I was surprised there were so many weather stations established by that time" },
        { questionNumber: 23, timestampSeconds: 75, quote: "Reports from the period blamed the haze for an increase in headaches, respiratory issues and asthma attacks." },
        { questionNumber: 24, timestampSeconds: 100, quote: "He's often credited with that, apparently. But a French naturalist beat him to it - I can't remember his name." },
        { questionNumber: 25, timestampSeconds: 125, quote: "not that the effects would go on for so long. Or that two years after the eruption, strange weather events were being reported as far away as North America and North Africa." },
        { questionNumber: 26, timestampSeconds: 135, quote: "not that the effects would go on for so long. Or that two years after the eruption, strange weather events were being reported as far away as North America and North Africa." },
        { questionNumber: 27, timestampSeconds: 155, quote: "effect on livestock as they grazed in the fields. They were poisoned because they ate vegetation that had been contaminated with fluorine" },
        { questionNumber: 28, timestampSeconds: 170, quote: "the famine there led to more people dying than any other country. It was worse than the plague." },
        { questionNumber: 29, timestampSeconds: 185, quote: "mortality rate went up a lot - presumably from respiratory illnesses... included an unusually high percentage of people under the age of 25." },
        { questionNumber: 30, timestampSeconds: 205, quote: "weather in the USA was badly affected too. George Washington even makes a note in his diary that they were snowbound until March in Virginia... ice floating down the Mississippi" },
      ],
    },
    {
      id: 'c18-l2-p4',
      partNumber: 4,
      title: 'Part 4: History of pockets in European clothing',
      context: "A student gives a presentation on the development of pockets in men's and women's clothing from the 18th century onwards.",
      audioUrl: '/audio/listening/c18_test2_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Good morning. Now, we've been asked to choose an aspect of European clothing or fashion and to talk about its development over time.

I decided to focus on a rather small area of clothing and that's pockets. I chose pockets for two reasons, really. We all have them - in jeans, jackets, coats, for example - and even though we often carry bags or briefcases as well, nothing is quite as convenient as being able to pop your phone or credit card into your pocket. Yet, I suspect that, other than that, people don't really think about pockets too much and they're rather overlooked as a fashion item.

It's certainly very interesting to go back in time and see how pockets developed for men and women. In the 18th century, fashions were quite different from the way they are now, and pockets were too. If we think about male fashion first... that was the time when suits became popular. Trousers were knee-length only and referred to as 'breeches', the waistcoats were short and the jackets were long, but all three garments were lined with material and pockets were sewn into this cloth by whichever tailor the customer used. The wearer could then carry small objects such as pencils or coins on their person and reach them through a gap in the lining. Coat pockets became increasingly decorative on the outside for men who wanted to look stylish, but they were often larger but plainer if the wearer was someone with a profession who needed to carry medical instruments – a doctor or physician, for example.

The development of women's pockets was a little different. For one thing, they weren't nearly as visible or as easy to reach as men's. In the 18th and 19th centuries, women carried numerous possessions on their person and some of these could be worth a lot of money. Women were more vulnerable to theft and wealthy women, in particular, worried constantly about pickpockets. So – what they did was to have a pair of pockets made that were tied together with string. The pockets were made of fabric, which might be recycled cloth if the wearer had little money or something more expensive, such as linen, sometimes featuring very delicate embroidery. Women tied the pockets around their waist so that they hung beneath their clothes. Remember, skirts were long then and there was plenty of room to hide a whole range of small possessions between the layers of petticoats that were commonly worn. They would have an opening in the folds of their skirts through which they could reach whatever they needed, like their perfume. Working women, of course, also needed to carry around items that they might use for whatever job or trade they were involved in, but their pairs of pockets still remained on the inside of their clothing, they just got bigger or longer - sometimes reaching down to their knees!

So the tie-on pockets went well into the 19th century and only changed when fashion altered towards the end of that period. That's when dresses became tighter and less bulky, and the pairs of pockets became very noticeable – they stood out too much and detracted from the woman's image. Women who had been used to carrying around a range of personal possessions - and still wanted to - needed somewhere to carry these items about their person. That was when small bags, or pouches as they were known, came into fashion and, of course, they inevitably led on to the handbag of more modern times, particularly when fashion removed pockets altogether.`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 25, quote: "nothing is quite as convenient as being able to pop your phone or credit card into your pocket." },
        { questionNumber: 32, timestampSeconds: 45, quote: "that was the time when suits became popular." },
        { questionNumber: 33, timestampSeconds: 58, quote: "pockets were sewn into this cloth by whichever tailor the customer used." },
        { questionNumber: 34, timestampSeconds: 72, quote: "larger but plainer if the wearer was someone with a profession who needed to carry medical instruments" },
        { questionNumber: 35, timestampSeconds: 88, quote: "they weren't nearly as visible or as easy to reach as men's." },
        { questionNumber: 36, timestampSeconds: 105, quote: "have a pair of pockets made that were tied together with string." },
        { questionNumber: 37, timestampSeconds: 118, quote: "Women tied the pockets around their waist so that they hung beneath their clothes." },
        { questionNumber: 38, timestampSeconds: 132, quote: "through which they could reach whatever they needed, like their perfume." },
        { questionNumber: 39, timestampSeconds: 152, quote: "the pairs of pockets became very noticeable – they stood out too much and detracted from the woman's image." },
        { questionNumber: 40, timestampSeconds: 168, quote: "inevitably led on to the handbag of more modern times" },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-5 (Notes Completion)
    {
      id: 'c18-l2-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–5',
      instructions: "Complete the notes below.\nWrite ONE WORD ONLY for each answer.",
      startQuestionNumber: 1,
      endQuestionNumber: 5,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Working at Milo's Restaurants
Benefits
• [[1]] provided for all staff
• [[2]] during weekdays at all Milo's Restaurants
• [[3]] provided after midnight

Person specification
• must be prepared to work well in a team
• must care about maintaining a high standard of [[4]]
• must have a qualification in [[5]]`,
      questions: [
        {
          id: 'c18-l2-q1',
          questionNumber: 1,
          prompt: '[1] provided for all staff',
          answerKey: 'training',
          acceptedAlternatives: ['training'],
          explanation: "The woman states: 'For example, all employees get training - even temporary staff.'",
          transcriptExcerpt: 'all employees get training - even temporary staff.',
          audioTimestampSeconds: 25,
        },
        {
          id: 'c18-l2-q2',
          questionNumber: 2,
          prompt: '[2] during weekdays at all Milo\'s Restaurants',
          answerKey: 'discount',
          acceptedAlternatives: ['discount', 'discounts'],
          explanation: "The woman explains: 'you can get a discount at any of their restaurants.' When asked 'Even at weekends?', she says: 'No, but you\\'ll be working then anyway.'",
          transcriptExcerpt: 'you can get a discount at any of their restaurants.',
          audioTimestampSeconds: 42,
        },
        {
          id: 'c18-l2-q3',
          questionNumber: 3,
          prompt: '[3] provided after midnight',
          answerKey: 'taxi',
          acceptedAlternatives: ['taxi'],
          explanation: "The woman notes: 'if you have to do a late shift and finish work after midnight, the company will pay for you to get a taxi home.'",
          transcriptExcerpt: 'the company will pay for you to get a taxi home.',
          audioTimestampSeconds: 58,
        },
        {
          id: 'c18-l2-q4',
          questionNumber: 4,
          prompt: 'must care about maintaining a high standard of [4]',
          answerKey: 'service',
          acceptedAlternatives: ['service'],
          explanation: "The man mentions: 'We had to make sure we gave a really high level of service.' The woman agrees: 'that will be equally important at Milo\\'s.'",
          transcriptExcerpt: 'We had to make sure we gave a really high level of service.',
          audioTimestampSeconds: 75,
        },
        {
          id: 'c18-l2-q5',
          questionNumber: 5,
          prompt: 'must have a qualification in [5]',
          answerKey: 'English',
          acceptedAlternatives: ['English', 'english'],
          explanation: "The woman says: 'the only other thing that\\'s required is good communication skills, so you\\'ll need to have a certificate in English.'",
          transcriptExcerpt: "you'll need to have a certificate in English.",
          audioTimestampSeconds: 90,
        },
      ],
    },

    // PART 1: Questions 6-10 (Table Completion)
    {
      id: 'c18-l2-g2',
      partNumber: 1,
      questionType: 'table_completion',
      title: 'Questions 6–10',
      instructions: 'Complete the table below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 6,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      tableData: {
        headers: ['Location', 'Job title', 'Responsibilities include', 'Pay and conditions'],
        rows: [
          {
            cells: [
              { content: '[[6]] Street', isGap: true, questionNumber: 6 },
              { content: 'Breakfast supervisor' },
              {
                content: '• Checking portions, etc. are correct\n• Making sure [[7]] is clean',
                isGap: true,
                questionNumber: 7,
              },
              {
                content: '• Starting salary £[[8]] per hour\n• Start work at 5.30 a.m.',
                isGap: true,
                questionNumber: 8,
              },
            ],
          },
          {
            cells: [
              { content: 'City Road' },
              { content: 'Junior chef' },
              {
                content: '• Supporting senior chefs\n• Maintaining stock and organising [[9]]',
                isGap: true,
                questionNumber: 9,
              },
              {
                content: '• Annual salary £23,000\n• No work on a [[10]] once a month',
                isGap: true,
                questionNumber: 10,
              },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c18-l2-q6',
          questionNumber: 6,
          prompt: 'Location: [6] Street',
          answerKey: 'Wivenhoe',
          acceptedAlternatives: ['Wivenhoe', 'wivenhoe'],
          explanation: "The woman spells the street name: 'Wivenhoe. W-I-V-E-N-H-O-E. It\\'s quite central, just off Cork Street.'",
          transcriptExcerpt: "Wivenhoe. W-I-V-E-N-H-O-E. It's quite central, just off Cork Street.",
          audioTimestampSeconds: 105,
        },
        {
          id: 'c18-l2-q7',
          questionNumber: 7,
          prompt: 'Responsibilities: Making sure [7] is clean',
          answerKey: 'equipment',
          acceptedAlternatives: ['equipment'],
          explanation: "The woman lists: 'checking all the procedures for cleaning the equipment are being followed.'",
          transcriptExcerpt: 'checking all the procedures for cleaning the equipment are being followed.',
          audioTimestampSeconds: 125,
        },
        {
          id: 'c18-l2-q8',
          questionNumber: 8,
          prompt: 'Starting salary: £[8] per hour',
          answerKey: '9.75',
          acceptedAlternatives: ['9.75', '9.75 pounds', '£9.75'],
          explanation: "The woman states: 'Well, to begin with, you\\'d be getting £9.75 but that goes up to £11.25 after three months.'",
          transcriptExcerpt: "Well, to begin with, you'd be getting £9.75",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c18-l2-q9',
          questionNumber: 9,
          prompt: 'Responsibilities: Maintaining stock and organising [9]',
          answerKey: 'deliveries',
          acceptedAlternatives: ['deliveries', 'delivery'],
          explanation: "The woman specifies: 'responsible for making sure there\\'s enough stock each week - and sorting out all the deliveries.'",
          transcriptExcerpt: "making sure there's enough stock each week - and sorting out all the deliveries.",
          audioTimestampSeconds: 170,
        },
        {
          id: 'c18-l2-q10',
          questionNumber: 10,
          prompt: 'Pay and conditions: No work on a [10] once a month',
          answerKey: 'Sunday',
          acceptedAlternatives: ['Sunday', 'sunday'],
          explanation: "The woman explains: 'closed on Mondays. But you do get one Sunday off every four weeks.'",
          transcriptExcerpt: 'closed on Mondays. But you do get one Sunday off every four weeks.',
          audioTimestampSeconds: 195,
        },
      ],
    },

    // PART 2: Questions 11-12 (Multiple Choice - Pick 2)
    {
      id: 'c18-l2-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 11 and 12',
      instructions: 'Choose TWO letters, A–E.\nWhat are the TWO main reasons why this site has been chosen for the housing development?',
      startQuestionNumber: 11,
      endQuestionNumber: 12,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q11_OPTIONS,
      questions: [
        multiQuestion(
          'c18-l2-q11',
          11,
          'What are the TWO main reasons why this site has been chosen for the housing development? (First choice)',
          MC_Q11_OPTIONS,
          ['B', 'E'],
          "Mark explains: 'because of the new industrial centre in Nunston, there\\'s a lot of demand for housing for employees in the region, as many employees are having to commute long distances at present' (convenient for workers, E), and adds: 'We were more interested in the fact that there\\'s an excellent hospital just 15 kilometres away, and a large secondary school even closer than that' (easy access to local facilities, B).",
          "demand for housing for employees in the region ... hospital just 15 kilometres away, and a large secondary school even closer",
          35
        ),
        multiQuestion(
          'c18-l2-q12',
          12,
          'What are the TWO main reasons why this site has been chosen for the housing development? (Second choice)',
          MC_Q11_OPTIONS,
          ['B', 'E'],
          "Mark explains: 'because of the new industrial centre in Nunston, there\\'s a lot of demand for housing for employees in the region, as many employees are having to commute long distances at present' (convenient for workers, E), and adds: 'We were more interested in the fact that there\\'s an excellent hospital just 15 kilometres away, and a large secondary school even closer than that' (easy access to local facilities, B).",
          "demand for housing for employees in the region ... hospital just 15 kilometres away, and a large secondary school even closer",
          45
        ),
      ],
    },

    // PART 2: Questions 13-14 (Multiple Choice - Pick 2)
    {
      id: 'c18-l2-g4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 13 and 14',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO aspects of the planned housing development have people given positive feedback about?',
      startQuestionNumber: 13,
      endQuestionNumber: 14,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q13_OPTIONS,
      questions: [
        multiQuestion(
          'c18-l2-q13',
          13,
          'Which TWO aspects of the planned housing development have people given positive feedback about? (First choice)',
          MC_Q13_OPTIONS,
          ['B', 'C'],
          "Mark reports people liked that the layout 'blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife on the site' (impact on the environment, B), and 'the overall feedback has been that the design and facilities of the development make it seem a place where people of all ages can live together happily' (encouragement of good relations between residents, C).",
          "blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife ... make it seem a place where people of all ages can live together happily.",
          65
        ),
        multiQuestion(
          'c18-l2-q14',
          14,
          'Which TWO aspects of the planned housing development have people given positive feedback about? (Second choice)',
          MC_Q13_OPTIONS,
          ['B', 'C'],
          "Mark reports people liked that the layout 'blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife on the site' (impact on the environment, B), and 'the overall feedback has been that the design and facilities of the development make it seem a place where people of all ages can live together happily' (encouragement of good relations between residents, C).",
          "blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife ... make it seem a place where people of all ages can live together happily.",
          75
        ),
      ],
    },

    // PART 2: Questions 15-20 (Map Labelling)
    {
      id: 'c18-l2-g5',
      partNumber: 2,
      questionType: 'plan_map_diagram_labelling',
      title: 'Questions 15–20',
      instructions: 'Label the map below.\nWrite the correct letter, A–I, next to Questions 15–20.',
      startQuestionNumber: 15,
      endQuestionNumber: 20,
      mapData: {
        imageUrl: '/images/listening/c18_l2_map.png',
        caption: 'Proposed Housing Development',
      },
      optionsList: MAP_OPTIONS,
      questions: [
        {
          id: 'c18-l2-q15',
          questionNumber: 15,
          prompt: 'School',
          options: MAP_OPTIONS,
          answerKey: 'G',
          explanation: "Mark directs: 'If you look at the South Entrance at the bottom of the map, there\\'s a road from there that goes right up through the development. The school will be on that road, at the corner of the second turning to the left.' This corresponds to location G.",
          transcriptExcerpt: "The school will be on that road, at the corner of the second turning to the left.",
          audioTimestampSeconds: 95,
        },
        {
          id: 'c18-l2-q16',
          questionNumber: 16,
          prompt: 'Sports centre',
          options: MAP_OPTIONS,
          answerKey: 'C',
          explanation: "Mark notes: 'A large sports centre is planned with facilities for indoor and outdoor activities. This will be on the western side of the development, just below the road that branches off from London Road.' This is location C.",
          transcriptExcerpt: 'western side of the development, just below the road that branches off from London Road.',
          audioTimestampSeconds: 110,
        },
        {
          id: 'c18-l2-q17',
          questionNumber: 17,
          prompt: 'Clinic',
          options: MAP_OPTIONS,
          answerKey: 'D',
          explanation: "Mark points out: 'Can you see the lake towards the top of the map? The clinic will be just below this, to the right of a street of houses.' This points to location D.",
          transcriptExcerpt: 'Can you see the lake towards the top of the map? The clinic will be just below this, to the right of a street of houses.',
          audioTimestampSeconds: 125,
        },
        {
          id: 'c18-l2-q18',
          questionNumber: 18,
          prompt: 'Community centre',
          options: MAP_OPTIONS,
          answerKey: 'B',
          explanation: "Mark describes: 'On the northeast side of the development, there\\'ll be a row of specially designed houses specifically for residents over 65, and the community centre will be adjoining this.' Adjoining housing for the elderly on the northeast is B.",
          transcriptExcerpt: 'specially designed houses specifically for residents over 65, and the community centre will be adjoining this.',
          audioTimestampSeconds: 138,
        },
        {
          id: 'c18-l2-q19',
          questionNumber: 19,
          prompt: 'Supermarket',
          options: MAP_OPTIONS,
          answerKey: 'H',
          explanation: "Mark explains: 'There\\'ll be a supermarket between the two entrances to the development. We\\'re planning to leave the three large trees near London Road, and it\\'ll be just to the south of these.' South of the three trees on the west side is H.",
          transcriptExcerpt: "three large trees near London Road, and it'll be just to the south of these.",
          audioTimestampSeconds: 152,
        },
        {
          id: 'c18-l2-q20',
          questionNumber: 20,
          prompt: 'Playground',
          options: MAP_OPTIONS,
          answerKey: 'A',
          explanation: "Mark concludes: 'If you look at the road that goes up from the South Entrance, you\\'ll see it curves round to the left at the top, and the playground will be in that curve, with nice views of the lake.' This is location A.",
          transcriptExcerpt: "it curves round to the left at the top, and the playground will be in that curve, with nice views of the lake.",
          audioTimestampSeconds: 165,
        },
      ],
    },

    // PART 3: Questions 21-24 (Multiple Choice)
    {
      id: 'c18-l2-g6',
      partNumber: 3,
      questionType: 'multiple_choice',
      title: 'Questions 21–24',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 21,
      endQuestionNumber: 24,
      questions: [
        {
          id: 'c18-l2-q21',
          questionNumber: 21,
          prompt: 'Why do the students think the Laki eruption of 1783 is so important?',
          options: MC_Q21_OPTIONS,
          answerKey: 'C',
          explanation: "Michelle highlights: 'what I found more significant was how it impacted directly and indirectly on political events, as well as having massive social and economic consequences.' Adam agrees: 'I know. That should be the main focus of our presentation' (C).",
          transcriptExcerpt: 'what I found more significant was how it impacted directly and indirectly on political events, as well as having massive social and economic consequences.',
          audioTimestampSeconds: 30,
        },
        {
          id: 'c18-l2-q22',
          questionNumber: 22,
          prompt: 'What surprised Adam about observations made at the time?',
          options: MC_Q22_OPTIONS,
          answerKey: 'A',
          explanation: "Adam says: 'Yeah. I was surprised there were so many weather stations established by that time – so, you know, you can see how the weather changed, often by the hour.' This refers to the number of places producing observations (A).",
          transcriptExcerpt: 'I was surprised there were so many weather stations established by that time',
          audioTimestampSeconds: 50,
        },
        {
          id: 'c18-l2-q23',
          questionNumber: 23,
          prompt: 'According to Michelle, what did the contemporary sources say about the Laki haze?',
          options: MC_Q23_OPTIONS,
          answerKey: 'B',
          explanation: "Michelle states: 'Reports from the period blamed the haze for an increase in headaches, respiratory issues and asthma attacks' (health issues, B).",
          transcriptExcerpt: 'Reports from the period blamed the haze for an increase in headaches, respiratory issues and asthma attacks.',
          audioTimestampSeconds: 75,
        },
        {
          id: 'c18-l2-q24',
          questionNumber: 24,
          prompt: 'Adam corrects Michelle when she claims that Benjamin Franklin',
          options: MC_Q24_OPTIONS,
          answerKey: 'B',
          explanation: "When Michelle says 'It was Benjamin Franklin who realised that before anyone else', Adam clarifies: 'He\\'s often credited with that, apparently. But a French naturalist beat him to it' (B).",
          transcriptExcerpt: "He's often credited with that, apparently. But a French naturalist beat him to it - I can't remember his name.",
          audioTimestampSeconds: 100,
        },
      ],
    },

    // PART 3: Questions 25-26 (Multiple Choice - Pick 2)
    {
      id: 'c18-l2-g7',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 25 and 26',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO issues following the Laki eruption surprised the students?',
      startQuestionNumber: 25,
      endQuestionNumber: 26,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q25_OPTIONS,
      questions: [
        multiQuestion(
          'c18-l2-q25',
          25,
          'Which TWO issues following the Laki eruption surprised the students? (First choice)',
          MC_Q25_OPTIONS,
          ['A', 'B'],
          "Adam remarks: 'not that the effects would go on for so long [how long-lasting, B]. Or that two years after the eruption, strange weather events were being reported as far away as North America and North Africa [how widespread, A].' Michelle agrees: 'No. I found all that hard to believe too.'",
          "not that the effects would go on for so long. Or that two years after the eruption, strange weather events were being reported as far away as North America and North Africa.",
          125
        ),
        multiQuestion(
          'c18-l2-q26',
          26,
          'Which TWO issues following the Laki eruption surprised the students? (Second choice)',
          MC_Q25_OPTIONS,
          ['A', 'B'],
          "Adam remarks: 'not that the effects would go on for so long [how long-lasting, B]. Or that two years after the eruption, strange weather events were being reported as far away as North America and North Africa [how widespread, A].' Michelle agrees: 'No. I found all that hard to believe too.'",
          "not that the effects would go on for so long. Or that two years after the eruption, strange weather events were being reported as far away as North America and North Africa.",
          135
        ),
      ],
    },

    // PART 3: Questions 27-30 (Matching)
    {
      id: 'c18-l2-g8',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 27–30',
      instructions: 'What comment do the students make about the impact of the Laki eruption on the following countries?\nChoose FOUR answers from the box and write the correct letter, A–F, next to Questions 27–30.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      optionsList: MATCHING_Q27_OPTIONS,
      questions: [
        {
          id: 'c18-l2-q27',
          questionNumber: 27,
          prompt: 'Iceland',
          options: MATCHING_Q27_OPTIONS,
          answerKey: 'D',
          explanation: "Michelle points out: 'One of the most dramatic things there was the effect on livestock as they grazed in the fields. They were poisoned because they ate vegetation that had been contaminated with fluorine' (Animals suffered from a sickness, D).",
          transcriptExcerpt: 'effect on livestock as they grazed in the fields. They were poisoned because they ate vegetation that had been contaminated with fluorine',
          audioTimestampSeconds: 155,
        },
        {
          id: 'c18-l2-q28',
          questionNumber: 28,
          prompt: 'Egypt',
          options: MATCHING_Q27_OPTIONS,
          answerKey: 'A',
          explanation: "Michelle observes: 'yet the famine there led to more people dying than any other country. It was worse than the plague' (This country suffered the most severe loss of life, A).",
          transcriptExcerpt: 'the famine there led to more people dying than any other country. It was worse than the plague.',
          audioTimestampSeconds: 170,
        },
        {
          id: 'c18-l2-q29',
          questionNumber: 29,
          prompt: 'UK',
          options: MATCHING_Q27_OPTIONS,
          answerKey: 'C',
          explanation: "Adam notes: 'in the UK the mortality rate went up a lot... According to one report it was about double the usual number and included an unusually high percentage of people under the age of 25' (significant increase in deaths of young people, C).",
          transcriptExcerpt: 'mortality rate went up a lot - presumably from respiratory illnesses... included an unusually high percentage of people under the age of 25.',
          audioTimestampSeconds: 185,
        },
        {
          id: 'c18-l2-q30',
          questionNumber: 30,
          prompt: 'USA',
          options: MATCHING_Q27_OPTIONS,
          answerKey: 'F',
          explanation: "Michelle and Adam mention: 'George Washington even makes a note in his diary that they were snowbound until March in Virginia... Yes, and there was ice floating down the Mississippi, which was unprecedented' (It caused a particularly harsh winter, F).",
          transcriptExcerpt: 'snowbound until March in Virginia... ice floating down the Mississippi',
          audioTimestampSeconds: 205,
        },
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c18-l2-g9',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Pockets
Reason for choice of subject
• They are [[31]] but can be overlooked by consumers and designers.

Pockets in men's clothes
• Men started to wear [[32]] in the 18th century.
• A [[33]] sewed pockets into the lining of the garments.
• The wearer could use the pockets for small items.
• Bigger pockets might be made for men who belonged to a certain type of [[34]]

Pockets in women's clothes
• Women's pockets were less [[35]] than men's.
• Women were very concerned about pickpockets.
• Pockets were produced in pairs using [[36]] to link them together.
• Pockets hung from the women's [[37]] under skirts and petticoats.
• Items such as [[38]] could be reached through a gap in the material.
• Pockets, of various sizes, stayed inside clothing for many decades.
• When dresses changed shape, hidden pockets had a negative effect on the [[39]] of women.
• Bags called 'pouches' became popular, before women carried a [[40]]`,
      questions: [
        {
          id: 'c18-l2-q31',
          questionNumber: 31,
          prompt: 'They are [31] but can be overlooked by consumers and designers.',
          answerKey: 'convenient',
          acceptedAlternatives: ['convenient'],
          explanation: "The speaker explains: 'nothing is quite as convenient as being able to pop your phone or credit card into your pocket.'",
          transcriptExcerpt: 'nothing is quite as convenient as being able to pop your phone or credit card into your pocket.',
          audioTimestampSeconds: 25,
        },
        {
          id: 'c18-l2-q32',
          questionNumber: 32,
          prompt: "Men started to wear [32] in the 18th century.",
          answerKey: 'suits',
          acceptedAlternatives: ['suits', 'suit'],
          explanation: "The speaker states: 'that was the time when suits became popular.'",
          transcriptExcerpt: 'that was the time when suits became popular.',
          audioTimestampSeconds: 45,
        },
        {
          id: 'c18-l2-q33',
          questionNumber: 33,
          prompt: 'A [33] sewed pockets into the lining of the garments.',
          answerKey: 'tailor',
          acceptedAlternatives: ['tailor'],
          explanation: "The speaker mentions: 'pockets were sewn into this cloth by whichever tailor the customer used.'",
          transcriptExcerpt: 'pockets were sewn into this cloth by whichever tailor the customer used.',
          audioTimestampSeconds: 58,
        },
        {
          id: 'c18-l2-q34',
          questionNumber: 34,
          prompt: 'Bigger pockets might be made for men who belonged to a certain type of [34]',
          answerKey: 'profession',
          acceptedAlternatives: ['profession'],
          explanation: "The speaker notes: 'they were often larger but plainer if the wearer was someone with a profession who needed to carry medical instruments – a doctor or physician, for example.'",
          transcriptExcerpt: 'larger but plainer if the wearer was someone with a profession who needed to carry medical instruments',
          audioTimestampSeconds: 72,
        },
        {
          id: 'c18-l2-q35',
          questionNumber: 35,
          prompt: "Women's pockets were less [35] than men's.",
          answerKey: 'visible',
          acceptedAlternatives: ['visible'],
          explanation: "The speaker explains: 'For one thing, they weren\\'t nearly as visible or as easy to reach as men\\'s.'",
          transcriptExcerpt: "they weren't nearly as visible or as easy to reach as men's.",
          audioTimestampSeconds: 88,
        },
        {
          id: 'c18-l2-q36',
          questionNumber: 36,
          prompt: 'Pockets were produced in pairs using [36] to link them together.',
          answerKey: 'string',
          acceptedAlternatives: ['string', 'strings'],
          explanation: "The speaker describes: 'So – what they did was to have a pair of pockets made that were tied together with string.'",
          transcriptExcerpt: 'have a pair of pockets made that were tied together with string.',
          audioTimestampSeconds: 105,
        },
        {
          id: 'c18-l2-q37',
          questionNumber: 37,
          prompt: "Pockets hung from the women's [37] under skirts and petticoats.",
          answerKey: 'waist',
          acceptedAlternatives: ['waist', 'waists'],
          explanation: "The speaker says: 'Women tied the pockets around their waist so that they hung beneath their clothes.'",
          transcriptExcerpt: 'Women tied the pockets around their waist so that they hung beneath their clothes.',
          audioTimestampSeconds: 118,
        },
        {
          id: 'c18-l2-q38',
          questionNumber: 38,
          prompt: 'Items such as [38] could be reached through a gap in the material.',
          answerKey: 'perfume',
          acceptedAlternatives: ['perfume'],
          explanation: "The speaker illustrates: 'They would have an opening in the folds of their skirts through which they could reach whatever they needed, like their perfume.'",
          transcriptExcerpt: 'through which they could reach whatever they needed, like their perfume.',
          audioTimestampSeconds: 132,
        },
        {
          id: 'c18-l2-q39',
          questionNumber: 39,
          prompt: 'When dresses changed shape, hidden pockets had a negative effect on the [39] of women.',
          answerKey: 'image',
          acceptedAlternatives: ['image'],
          explanation: "The speaker observes: 'the pairs of pockets became very noticeable – they stood out too much and detracted from the woman\\'s image.'",
          transcriptExcerpt: "the pairs of pockets became very noticeable – they stood out too much and detracted from the woman's image.",
          audioTimestampSeconds: 152,
        },
        {
          id: 'c18-l2-q40',
          questionNumber: 40,
          prompt: "Bags called 'pouches' became popular, before women carried a [40]",
          answerKey: 'handbag',
          acceptedAlternatives: ['handbag'],
          explanation: "The speaker concludes: 'That was when small bags, or pouches as they were known, came into fashion and, of course, they inevitably led on to the handbag of more modern times...'",
          transcriptExcerpt: 'inevitably led on to the handbag of more modern times',
          audioTimestampSeconds: 168,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 18 Academic Listening Test 2',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 30,
    audioConfig: {
      mode: 'part_audios',
      overallAudioUrl: '',
      partAudios: {
        1: '/audio/listening/c18_test2_part1.mp3',
        2: '/audio/listening/c18_test2_part2.mp3',
        3: '/audio/listening/c18_test2_part3.mp3',
        4: '/audio/listening/c18_test2_part4.mp3',
      },
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge18ListeningTest2(authorId?: string) {
  const data = getCambridge18ListeningTest2Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 18 Listening Test 2 validation failed: ${validationErrors.join('; ')}`);
  }

  const existingTest = (await db.prepare(`
    SELECT id, current_version_number
    FROM listening_tests
    WHERE title = ?
    LIMIT 1
  `).get(data.title)) as { id: string; current_version_number: number } | undefined;

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db.prepare(`
      SELECT id FROM listening_test_versions
      WHERE test_id = ? AND version_number = ?
      LIMIT 1
    `).get(testId, existingTest.current_version_number || 1)) as { id: string } | undefined;

    if (existingVersion) {
      versionId = existingVersion.id;
      await db.prepare(`
        UPDATE listening_test_versions
        SET parts_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            status = 'published',
            audio_config_json = ?,
            published_at = ?
        WHERE id = ?
      `).run(
        JSON.stringify(data.parts),
        JSON.stringify(data.questionGroups),
        JSON.stringify(data.audioConfig),
        now,
        versionId
      );
    } else {
      versionId = uuidv4();
      await db.prepare(`
        INSERT INTO listening_test_versions (
          id, test_id, version_number, status, parts_json,
          question_groups_json, total_questions, audio_config_json, published_at, created_at
        ) VALUES (?, ?, 1, 'published', ?, ?, 40, ?, ?, ?)
      `).run(
        versionId,
        testId,
        JSON.stringify(data.parts),
        JSON.stringify(data.questionGroups),
        JSON.stringify(data.audioConfig),
        now,
        now
      );
    }

    await db.prepare(`
      UPDATE listening_tests
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
      INSERT INTO listening_tests (
        id, title, category, audio_mode, time_limit_minutes,
        current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
      ) VALUES (?, ?, ?, ?, ?, 1, 'published', ?, 1, ?, ?)
    `).run(
      testId,
      data.title,
      data.category,
      data.audioMode,
      data.timeLimitMinutes,
      resolvedAuthorId,
      now,
      now
    );

    await db.prepare(`
      INSERT INTO listening_test_versions (
        id, test_id, version_number, status, parts_json,
        question_groups_json, total_questions, audio_config_json, published_at, created_at
      ) VALUES (?, ?, 1, 'published', ?, ?, 40, ?, ?, ?)
    `).run(
      versionId,
      testId,
      JSON.stringify(data.parts),
      JSON.stringify(data.questionGroups),
      JSON.stringify(data.audioConfig),
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
