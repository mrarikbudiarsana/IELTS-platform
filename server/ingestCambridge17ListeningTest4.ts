import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'a lack of training' },
  { key: 'B', text: 'long hours' },
  { key: 'C', text: 'low pay' },
];

const MC_Q12_OPTIONS = [
  { key: 'A', text: 'an increased workload' },
  { key: 'B', text: 'low morale' },
  { key: 'C', text: 'an inability to meet targets' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'failing to treat staff equally' },
  { key: 'B', text: 'reorganising shifts without warning' },
  { key: 'C', text: 'neglecting to have enough staff during busy periods' },
];

const MC_Q14_OPTIONS = [
  { key: 'A', text: 'a fall in customer complaints' },
  { key: 'B', text: 'an increase in loyalty club membership' },
  { key: 'C', text: 'a rise in spending per customer' },
];

const MATCHING_Q15_OPTIONS = [
  { key: 'A', text: 'improving relationships and teamwork' },
  { key: 'B', text: 'offering incentives and financial benefits' },
  { key: 'C', text: 'providing career opportunities' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'He should have felt more positive about them' },
  { key: 'B', text: 'The training was too challenging for him' },
  { key: 'C', text: 'He could have worked harder at them' },
  { key: 'D', text: 'His parents were disappointed in him' },
  { key: 'E', text: 'His fellow students admired him' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'disbelief' },
  { key: 'B', text: 'relief' },
  { key: 'C', text: 'stress' },
  { key: 'D', text: 'gratitude' },
  { key: 'E', text: 'homesickness' },
];

const MATCHING_Q25_OPTIONS = [
  { key: 'A', text: 'It could cause excessive sweating.' },
  { key: 'B', text: 'The material was being mass produced for another purpose.' },
  { key: 'C', text: 'People often needed to make their own.' },
  { key: 'D', text: 'It often had to be replaced.' },
  { key: 'E', text: 'The material was expensive.' },
  { key: 'F', text: 'It was unpopular among spectators.' },
  { key: 'G', text: 'It caused injuries.' },
  { key: 'H', text: 'No one using it liked it at first.' },
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

export function getCambridge17ListeningTest4Data(): {
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
      id: 'c17-l4-p1',
      partNumber: 1,
      title: 'Part 1: Easy Life Cleaning Services',
      context: 'A customer calls Easy Life Cleaning Services to inquire about domestic cleaning packages and policies.',
      audioUrl: '/audio/listening/c17_test4_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `JACINTA: Hello, Easy Life Cleaning Services, Jacinta speaking.
CLIENT: Oh hello. I'm looking for a cleaning service for my apartment – do you do domestic cleaning?
JACINTA: Sure.
CLIENT: Well, it's just a one-bedroom flat. Do you have a basic cleaning package?
JACINTA: Yes. For a one-bedroom flat we're probably looking at about two hours for a clean. So we'd do a thorough clean of all surfaces in each room, and polish them where necessary. Does your apartment have carpets?
CLIENT: No, I don't have any carpets, but the floors would need cleaning.
JACINTA: Of course – we'd do that in every room. And we'd do a thorough clean of the kitchen and bathroom.
CLIENT: OK.
JACINTA: Then we have some additional services which you can request if you want – so for example, we can clean your oven for you every week.
CLIENT: Actually, I hardly ever use that, but can you do the fridge?
JACINTA: Sure. Would you like that done every week?
CLIENT: Yes, definitely. And would ironing clothes be an additional service you can do?
JACINTA: Yes, of course.
CLIENT: It wouldn't be much, just my shirts for work that week.
JACINTA: That's fine. And we could also clean your microwave if you want.
CLIENT: No, I wipe that out pretty regularly so there's no need for that.
JACINTA: We also offer additional services that you might want a bit less often, say every month. So for example, if the inside of your windows need cleaning, we could do that.
CLIENT: Yes, that'd be good. I'm on the fifteenth floor, so the outside gets done regularly by specialists, but the inside does get a bit grubby.
JACINTA: And we could arrange for your curtains to get cleaned if necessary.
CLIENT: No, they're fine. But what about washing down the balcony?
JACINTA: Yes, we can do that.
CLIENT: Great.
JACINTA: Is there anything else?
CLIENT: Well, I've just moved out of a house and into this flat, and I've got a lot of boxes I need to get rid of. Do you take cardboard away?
JACINTA: No, I'm afraid we don't. But we do have a list of other local companies you could contact, you know, for removal or whatever. Or if you need a plumber or an electrician, we can recommend those too.
CLIENT: Oh, great. Thank you.
JACINTA: Now, what about specialized cleaning? We do things like dry cleaning for rugs, or cleaning up after builders, and a service for people who are allergic to dust.
CLIENT: Right. Fortunately, I don't have that problem, but my sister does, so I'll bear it in mind. Now, what about security? I mean, what kind of checks do you do on your cleaners?
JACINTA: Well, we only employ people who have regular references, but before we take them on, they have a background check carried out by the police.
CLIENT: Right. That's good to know.
JACINTA: And we don't just send them out straight away. They complete a two-week training period, shadowing an experienced cleaner.
CLIENT: OK.
JACINTA: And we monitor them closely – we require customers to send a review after each visit, so we can deal with any problems quickly if they arise.
CLIENT: Right. Well, I'd like to go ahead with that.`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 22, quote: "No, I don't have any carpets, but the floors would need cleaning." },
        { questionNumber: 2, timestampSeconds: 38, quote: "Actually, I hardly ever use that, but can you do the fridge?" },
        { questionNumber: 3, timestampSeconds: 50, quote: "It wouldn't be much, just my shirts for work that week." },
        { questionNumber: 4, timestampSeconds: 65, quote: "if the inside of your windows need cleaning, we could do that." },
        { questionNumber: 5, timestampSeconds: 78, quote: "But what about washing down the balcony? Yes, we can do that." },
        { questionNumber: 6, timestampSeconds: 96, quote: "Or if you need a plumber or an electrician, we can recommend those too." },
        { questionNumber: 7, timestampSeconds: 110, quote: "and a service for people who are allergic to dust." },
        { questionNumber: 8, timestampSeconds: 125, quote: "before we take them on, they have a background check carried out by the police." },
        { questionNumber: 9, timestampSeconds: 138, quote: "They complete a two-week training period, shadowing an experienced cleaner." },
        { questionNumber: 10, timestampSeconds: 150, quote: "we require customers to send a review after each visit" },
      ],
    },
    {
      id: 'c17-l4-p2',
      partNumber: 2,
      title: 'Part 2: Hotel Staff Retention',
      context: 'A hospitality consultant delivers a presentation on reducing staff turnover and improving employee retention in hotels.',
      audioUrl: '/audio/listening/c17_test4_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Good morning, everyone. In today's hospitality seminar, I want to talk about staff turnover and retention in hotels.
Staff retention is one of the most critical challenges facing the hotel industry today. Surprisingly, many hotel managers are unaware that their staff often leave because of a lack of training, rather than concerns over long working hours or low pay. When employees feel unprepared or unsupported in their roles, frustration sets in and they seek opportunities elsewhere.
Now, what is the direct impact of this high staff turnover on hotel managers? While you might think it affects staff morale or sales targets, the primary consequence managers experience is an increased workload. Managers end up spending disproportionate amounts of their time advertising vacancies, reviewing applications, interviewing candidates, and training new recruits all over again.
To maintain a stable workforce, managers must be mindful of their leadership approach. What mistake should managers always avoid? The answer is failing to treat staff equally. Perceived favouritism in scheduling, recognition, or task assignment quickly erodes trust and destroys team spirit.
Let's look at a case study: Dunwich Hotel. They implemented comprehensive mentoring and wellness initiatives. While they anticipated fewer customer complaints, they noticed an unexpected benefit: a noticeable rise in spending per customer, because experienced staff knew how to build rapport and recommend dining and spa amenities.
Next, let's examine different strategies used by hotels to reduce staff turnover.
At The Sun Club, management focused on improving relationships and teamwork among their staff, organizing regular team-building activities and collaborative shift meetings.
At The Portland, their strategy focused on providing career opportunities. They introduced structured pathways and career development schemes for internal promotions.
Bluewater Hotels tackled the problem differently by offering incentives and financial benefits, including performance bonuses and travel discounts.
Pentlow Hotels likewise found success by providing clear career opportunities, investing in accredited hospitality certifications and managerial training for frontline staff.
Green Planet decided that offering incentives and financial benefits was the most effective approach, introducing seasonal profit-sharing vouchers and grocery subsidies.
Finally, The Amesbury concentrated heavily on improving relationships and teamwork, redesigning staff break areas and instituting peer recognition awards.`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 16, quote: "many hotel managers are unaware that their staff often leave because of a lack of training" },
        { questionNumber: 12, timestampSeconds: 34, quote: "the primary consequence managers experience is an increased workload." },
        { questionNumber: 13, timestampSeconds: 52, quote: "What mistake should managers always avoid? The answer is failing to treat staff equally." },
        { questionNumber: 14, timestampSeconds: 70, quote: "they noticed an unexpected benefit: a noticeable rise in spending per customer" },
        { questionNumber: 15, timestampSeconds: 90, quote: "At The Sun Club, management focused on improving relationships and teamwork" },
        { questionNumber: 16, timestampSeconds: 102, quote: "At The Portland, their strategy focused on providing career opportunities." },
        { questionNumber: 17, timestampSeconds: 114, quote: "Bluewater Hotels tackled the problem differently by offering incentives and financial benefits" },
        { questionNumber: 18, timestampSeconds: 126, quote: "Pentlow Hotels likewise found success by providing clear career opportunities" },
        { questionNumber: 19, timestampSeconds: 138, quote: "Green Planet decided that offering incentives and financial benefits was the most effective approach" },
        { questionNumber: 20, timestampSeconds: 150, quote: "Finally, The Amesbury concentrated heavily on improving relationships and teamwork" },
      ],
    },
    {
      id: 'c17-l4-p3',
      partNumber: 3,
      title: 'Part 3: Sports Science Presentation',
      context: 'Thomas and Jeanne discuss Thomas’s school sporting experiences and the historical evolution of sporting equipment.',
      audioUrl: '/audio/listening/c17_test4_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `JEANNE: Hi Thomas, how are you getting on with our sports science research presentation?
THOMAS: Hi Jeanne. I'm making progress, but looking back at my own school days has given me a lot of perspective.
JEANNE: Really? How so?
THOMAS: Well, regarding my sporting activities at school, I was always quite fast and made the track team, and my fellow students admired me for winning races. But looking back honestly, I realize I could have worked harder at them instead of coasting on natural ability.
JEANNE: Yes, raw talent only gets you so far without discipline. And then you had the opportunity to train in Kenya, didn't you?
THOMAS: Yes, spending six months at the high-altitude training camp in Kenya was eye-opening. When I was there, I felt an overwhelming sense of gratitude for having such an extraordinary opportunity to train alongside world champions. But at the same time, when I saw how easily they outran me on every hill, I felt complete disbelief at how superior their endurance truly was.
JEANNE: That must have been a humbling experience! Now, what about our section on the historical development of sporting equipment?
THOMAS: Right! Let's go through the six items we selected.
First, the table tennis bat. In the early 20th century, the rubber pimpled surface became revolutionary because the material was being mass produced for another purpose, originally for typewriter covers.
JEANNE: Then the cricket helmet. When players first started wearing protective helmets in the late 1970s, it was actually unpopular among spectators, who complained it ruined the traditional aesthetic of the game.
THOMAS: Next, the cycle helmet. Early polystyrene cycling helmets were extremely bulky and poorly ventilated, meaning it could cause excessive sweating during long rides.
JEANNE: As for the golf club, early wooden club shafts made of hickory wood were prone to splintering and snapping, so it often had to be replaced after only a few matches.
THOMAS: Then the hockey stick. Before standardized manufacturing took over, professional hockey sticks were scarce, so people often needed to make their own using steam-bent wood.
JEANNE: And finally, the old leather football. In wet weather, the leather would absorb water and become dangerously heavy, which caused serious injuries and concussions when headed.
THOMAS: That covers all our historical examples clearly!`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 20, quote: "my fellow students admired me for winning races. But looking back honestly, I realize I could have worked harder at them" },
        { questionNumber: 22, timestampSeconds: 24, quote: "my fellow students admired me for winning races. But looking back honestly, I realize I could have worked harder at them" },
        { questionNumber: 23, timestampSeconds: 42, quote: "I felt an overwhelming sense of gratitude... I felt complete disbelief at how superior their endurance truly was." },
        { questionNumber: 24, timestampSeconds: 48, quote: "I felt an overwhelming sense of gratitude... I felt complete disbelief at how superior their endurance truly was." },
        { questionNumber: 25, timestampSeconds: 68, quote: "the table tennis bat... the material was being mass produced for another purpose" },
        { questionNumber: 26, timestampSeconds: 82, quote: "the cricket helmet... it was actually unpopular among spectators" },
        { questionNumber: 27, timestampSeconds: 96, quote: "the cycle helmet... meaning it could cause excessive sweating during long rides." },
        { questionNumber: 28, timestampSeconds: 110, quote: "the golf club... so it often had to be replaced after only a few matches." },
        { questionNumber: 29, timestampSeconds: 124, quote: "the hockey stick... people often needed to make their own using steam-bent wood." },
        { questionNumber: 30, timestampSeconds: 138, quote: "the old leather football... which caused serious injuries and concussions when headed." },
      ],
    },
    {
      id: 'c17-l4-p4',
      partNumber: 4,
      title: 'Part 4: Maple Syrup Production',
      context: 'A lecture on the history, ecology, harvesting, and modern production processes of maple syrup.',
      audioUrl: '/audio/listening/c17_test4_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Hello everyone. Today we're going to look at another natural food product, and that's maple syrup.
What is this exactly? Well, maple syrup looks rather like clear honey, but it's not made by bees; it's produced from the plant fluid – or sap – inside the maple tree, and that makes maple syrup a very natural product.
Maple syrup is a thick, golden, sweet-tasting liquid that can be bought in bottles or jars and poured onto food such as waffles and pancakes, or used in the baking of cakes and pastries. It contains no artificial preservatives or added ingredients, and it provides a healthy alternative to refined sugar.
The maple tree has many different species, but the sugar maple is the most renowned. The tree thrives best where there are sunny days combined with cool nights. The famous maple leaf has been on the Canadian national flag since 1964. Maple trees need moist soil, but the soil does not need fertilizer. The optimal growing conditions and climate are found throughout eastern Canada and northeastern North America.
Let's talk about the history. Early maple sugar producers among indigenous peoples made diagonal cuts or holes in the tree trunks to tap the sap. To concentrate the syrup, they placed hot rocks into the wooden troughs to heat the sap and boil off the excess water. They also crafted containers from birch tree bark to collect the sap.
Now, turning to modern maple syrup production.
First, regarding the trees: maple trees must be carefully protected, and tree trunks generally do not reach the necessary diameter of at least 25 centimetres until they have been growing for approximately 40 years. Within the tree, fluctuating temperatures during late winter drive the movement of sap.
In modern production, a tap is drilled into the trunk and a tube carries the sap directly into a collection bucket or modern pipeline system.
Next, the sap is transferred to large stainless-steel pans called evaporators, which are heated by means of a wood or oil fire.
During this vigorous boiling, a tremendous amount of steam is produced as water evaporates from the liquid.
Before packaging, a mineral residue known as sugar sand must be filtered out, because if left behind, it makes the syrup appear cloudy and compromises the smooth taste.
Once filtered and graded, the pure syrup is ready for use. It requires a staggering 40 litres of raw sap to produce just a single litre of finished maple syrup!`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 22, quote: "Maple syrup is a thick, golden, sweet-tasting liquid" },
        { questionNumber: 32, timestampSeconds: 32, quote: "and it provides a healthy alternative to refined sugar." },
        { questionNumber: 33, timestampSeconds: 52, quote: "The optimal growing conditions and climate are found throughout eastern Canada" },
        { questionNumber: 34, timestampSeconds: 68, quote: "they placed hot rocks into the wooden troughs to heat the sap" },
        { questionNumber: 35, timestampSeconds: 88, quote: "tree trunks generally do not reach the necessary diameter of at least 25 centimetres" },
        { questionNumber: 36, timestampSeconds: 104, quote: "a tap is drilled into the trunk and a tube carries the sap directly into a collection bucket" },
        { questionNumber: 37, timestampSeconds: 118, quote: "evaporators, which are heated by means of a wood or oil fire." },
        { questionNumber: 38, timestampSeconds: 130, quote: "a tremendous amount of steam is produced as water evaporates from the liquid." },
        { questionNumber: 39, timestampSeconds: 144, quote: "because if left behind, it makes the syrup appear cloudy" },
        { questionNumber: 40, timestampSeconds: 158, quote: "It requires a staggering 40 litres of raw sap to produce just a single litre of finished maple syrup!" },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-10 (Notes Completion)
    {
      id: 'c17-l4-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Easy Life Cleaning Services
Basic cleaning package offered:
• Cleaning all surfaces
• Cleaning the [[1]] throughout the apartment
• Cleaning shower, sinks, toilet, etc.

Additional services agreed:
Every week:
• Cleaning the [[2]]
• Ironing clothes – [[3]] only

Every month:
• Cleaning all the [[4]] from the inside
• Washing down the [[5]]

Extra service:
• They can organise a plumber or an [[6]] if necessary

Special cleaning:
• A special cleaning service is available for customers who are allergic to [[7]]

Information on cleaners:
• Background check carried out by the [[8]]
• All cleaners are given [[9]] for two weeks
• Customers send a [[10]] after each visit`,
      questions: [
        {
          id: 'c17-l4-q1',
          questionNumber: 1,
          prompt: 'Cleaning the [1] throughout the apartment',
          answerKey: 'floors',
          acceptedAlternatives: ['floors', 'floor'],
          explanation: "The client asks: 'No, I don't have any carpets, but the floors would need cleaning.' Jacinta replies: 'Of course – we'd do that in every room.'",
          transcriptExcerpt: "No, I don't have any carpets, but the floors would need cleaning.",
          audioTimestampSeconds: 22,
        },
        {
          id: 'c17-l4-q2',
          questionNumber: 2,
          prompt: 'Every week: Cleaning the [2]',
          answerKey: 'fridge',
          acceptedAlternatives: ['fridge', 'the fridge', 'refrigerator'],
          explanation: "The client asks: 'Actually, I hardly ever use that, but can you do the fridge?' Jacinta confirms: 'Sure. Would you like that done every week? Yes, definitely.'",
          transcriptExcerpt: "Actually, I hardly ever use that, but can you do the fridge?",
          audioTimestampSeconds: 38,
        },
        {
          id: 'c17-l4-q3',
          questionNumber: 3,
          prompt: 'Ironing clothes – [3] only',
          answerKey: 'shirts',
          acceptedAlternatives: ['shirts', 'shirt'],
          explanation: "The client clarifies: 'It wouldn't be much, just my shirts for work that week.'",
          transcriptExcerpt: "It wouldn't be much, just my shirts for work that week.",
          audioTimestampSeconds: 50,
        },
        {
          id: 'c17-l4-q4',
          questionNumber: 4,
          prompt: 'Every month: Cleaning all the [4] from the inside',
          answerKey: 'windows',
          acceptedAlternatives: ['windows', 'the windows'],
          explanation: "Jacinta suggests: 'So for example, if the inside of your windows need cleaning, we could do that.' The client confirms: 'Yes, that'd be good.'",
          transcriptExcerpt: "if the inside of your windows need cleaning, we could do that.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c17-l4-q5',
          questionNumber: 5,
          prompt: 'Washing down the [5]',
          answerKey: 'balcony',
          acceptedAlternatives: ['balcony', 'the balcony'],
          explanation: "The client asks: 'But what about washing down the balcony?' Jacinta confirms: 'Yes, we can do that.'",
          transcriptExcerpt: "But what about washing down the balcony? Yes, we can do that.",
          audioTimestampSeconds: 78,
        },
        {
          id: 'c17-l4-q6',
          questionNumber: 6,
          prompt: 'They can organise a plumber or an [6] if necessary',
          answerKey: 'electrician',
          acceptedAlternatives: ['electrician', 'an electrician'],
          explanation: "Jacinta states: 'Or if you need a plumber or an electrician, we can recommend those too.'",
          transcriptExcerpt: "Or if you need a plumber or an electrician, we can recommend those too.",
          audioTimestampSeconds: 96,
        },
        {
          id: 'c17-l4-q7',
          questionNumber: 7,
          prompt: 'A special cleaning service is available for customers who are allergic to [7]',
          answerKey: 'dust',
          acceptedAlternatives: ['dust'],
          explanation: "Jacinta mentions: 'and a service for people who are allergic to dust.'",
          transcriptExcerpt: "and a service for people who are allergic to dust.",
          audioTimestampSeconds: 110,
        },
        {
          id: 'c17-l4-q8',
          questionNumber: 8,
          prompt: 'Background check carried out by the [8]',
          answerKey: 'police',
          acceptedAlternatives: ['police', 'the police'],
          explanation: "Jacinta explains: 'before we take them on, they have a background check carried out by the police.'",
          transcriptExcerpt: "before we take them on, they have a background check carried out by the police.",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c17-l4-q9',
          questionNumber: 9,
          prompt: 'All cleaners are given [9] for two weeks',
          answerKey: 'training',
          acceptedAlternatives: ['training', 'training period'],
          explanation: "Jacinta says: 'They complete a two-week training period, shadowing an experienced cleaner.'",
          transcriptExcerpt: "They complete a two-week training period, shadowing an experienced cleaner.",
          audioTimestampSeconds: 138,
        },
        {
          id: 'c17-l4-q10',
          questionNumber: 10,
          prompt: 'Customers send a [10] after each visit',
          answerKey: 'review',
          acceptedAlternatives: ['review', 'a review', 'reviews'],
          explanation: "Jacinta states: 'we require customers to send a review after each visit, so we can deal with any problems quickly.'",
          transcriptExcerpt: "we require customers to send a review after each visit",
          audioTimestampSeconds: 150,
        },
      ],
    },

    // PART 2: Questions 11-14 (Multiple Choice)
    {
      id: 'c17-l4-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 11–14',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 11,
      endQuestionNumber: 14,
      questions: [
        {
          id: 'c17-l4-q11',
          questionNumber: 11,
          prompt: 'Many hotel managers are unaware that their staff often leave because of',
          options: MC_Q11_OPTIONS,
          answerKey: 'A',
          explanation: "The speaker explains: 'Surprisingly, many hotel managers are unaware that their staff often leave because of a lack of training, rather than concerns over long working hours or low pay.' (A)",
          transcriptExcerpt: "many hotel managers are unaware that their staff often leave because of a lack of training",
          audioTimestampSeconds: 16,
        },
        {
          id: 'c17-l4-q12',
          questionNumber: 12,
          prompt: 'What is the impact of high staff turnover on managers?',
          options: MC_Q12_OPTIONS,
          answerKey: 'A',
          explanation: "The speaker notes: 'the primary consequence managers experience is an increased workload. Managers end up spending disproportionate amounts of their time advertising vacancies, reviewing applications...' (A)",
          transcriptExcerpt: "the primary consequence managers experience is an increased workload.",
          audioTimestampSeconds: 34,
        },
        {
          id: 'c17-l4-q13',
          questionNumber: 13,
          prompt: 'What mistake should managers always avoid?',
          options: MC_Q13_OPTIONS,
          answerKey: 'A',
          explanation: "The speaker advises: 'What mistake should managers always avoid? The answer is failing to treat staff equally. Perceived favouritism in scheduling, recognition, or task assignment quickly erodes trust...' (A)",
          transcriptExcerpt: "What mistake should managers always avoid? The answer is failing to treat staff equally.",
          audioTimestampSeconds: 52,
        },
        {
          id: 'c17-l4-q14',
          questionNumber: 14,
          prompt: 'What unexpected benefit did Dunwich Hotel notice after improving staff retention rates?',
          options: MC_Q14_OPTIONS,
          answerKey: 'C',
          explanation: "The speaker states: 'While they anticipated fewer customer complaints, they noticed an unexpected benefit: a noticeable rise in spending per customer...' (C)",
          transcriptExcerpt: "they noticed an unexpected benefit: a noticeable rise in spending per customer",
          audioTimestampSeconds: 70,
        },
      ],
    },

    // PART 2: Questions 15-20 (Matching)
    {
      id: 'c17-l4-g3',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 15–20',
      instructions: 'Which way of reducing staff turnover was used in each of the following hotels?\nChoose SIX answers from the box and write the correct letter, A, B or C, next to Questions 15–20.',
      startQuestionNumber: 15,
      endQuestionNumber: 20,
      optionsList: MATCHING_Q15_OPTIONS,
      questions: [
        {
          id: 'c17-l4-q15',
          questionNumber: 15,
          prompt: 'The Sun Club',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'A',
          explanation: "The speaker says: 'At The Sun Club, management focused on improving relationships and teamwork among their staff...' (A)",
          transcriptExcerpt: "At The Sun Club, management focused on improving relationships and teamwork",
          audioTimestampSeconds: 90,
        },
        {
          id: 'c17-l4-q16',
          questionNumber: 16,
          prompt: 'The Portland',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'C',
          explanation: "The speaker notes: 'At The Portland, their strategy focused on providing career opportunities. They introduced structured pathways...' (C)",
          transcriptExcerpt: "At The Portland, their strategy focused on providing career opportunities.",
          audioTimestampSeconds: 102,
        },
        {
          id: 'c17-l4-q17',
          questionNumber: 17,
          prompt: 'Bluewater Hotels',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'B',
          explanation: "The speaker remarks: 'Bluewater Hotels tackled the problem differently by offering incentives and financial benefits, including performance bonuses...' (B)",
          transcriptExcerpt: "Bluewater Hotels tackled the problem differently by offering incentives and financial benefits",
          audioTimestampSeconds: 114,
        },
        {
          id: 'c17-l4-q18',
          questionNumber: 18,
          prompt: 'Pentlow Hotels',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'C',
          explanation: "The speaker observes: 'Pentlow Hotels likewise found success by providing clear career opportunities, investing in accredited hospitality certifications...' (C)",
          transcriptExcerpt: "Pentlow Hotels likewise found success by providing clear career opportunities",
          audioTimestampSeconds: 126,
        },
        {
          id: 'c17-l4-q19',
          questionNumber: 19,
          prompt: 'Green Planet',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'B',
          explanation: "The speaker mentions: 'Green Planet decided that offering incentives and financial benefits was the most effective approach...' (B)",
          transcriptExcerpt: "Green Planet decided that offering incentives and financial benefits was the most effective approach",
          audioTimestampSeconds: 138,
        },
        {
          id: 'c17-l4-q20',
          questionNumber: 20,
          prompt: 'The Amesbury',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'A',
          explanation: "The speaker concludes: 'Finally, The Amesbury concentrated heavily on improving relationships and teamwork, redesigning staff break areas...' (A)",
          transcriptExcerpt: "Finally, The Amesbury concentrated heavily on improving relationships and teamwork",
          audioTimestampSeconds: 150,
        },
      ],
    },

    // PART 3: Questions 21-22 (Multiple Choice - Pick 2)
    {
      id: 'c17-l4-g4',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions: "Choose TWO letters, A–E.\nWhich TWO points do Thomas and Jeanne make about Thomas's sporting activities at school?",
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q21_OPTIONS,
      questions: [
        multiQuestion(
          'c17-l4-q21',
          21,
          "Which TWO points do Thomas and Jeanne make about Thomas's sporting activities at school? (First choice)",
          MC_Q21_OPTIONS,
          ['C', 'E'],
          "Thomas mentions: 'my fellow students admired me for winning races' (E), and 'looking back honestly, I realize I could have worked harder at them' (C).",
          "my fellow students admired me for winning races. But looking back honestly, I realize I could have worked harder at them",
          20
        ),
        multiQuestion(
          'c17-l4-q22',
          22,
          "Which TWO points do Thomas and Jeanne make about Thomas's sporting activities at school? (Second choice)",
          MC_Q21_OPTIONS,
          ['C', 'E'],
          "Thomas mentions: 'my fellow students admired me for winning races' (E), and 'looking back honestly, I realize I could have worked harder at them' (C).",
          "my fellow students admired me for winning races. But looking back honestly, I realize I could have worked harder at them",
          24
        ),
      ],
    },

    // PART 3: Questions 23-24 (Multiple Choice - Pick 2)
    {
      id: 'c17-l4-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO feelings did Thomas experience when he was in Kenya?',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q23_OPTIONS,
      questions: [
        multiQuestion(
          'c17-l4-q23',
          23,
          'Which TWO feelings did Thomas experience when he was in Kenya? (First choice)',
          MC_Q23_OPTIONS,
          ['A', 'D'],
          "Thomas describes feeling 'an overwhelming sense of gratitude for having such an extraordinary opportunity' (D) and 'complete disbelief at how superior their endurance truly was' (A).",
          "I felt an overwhelming sense of gratitude... I felt complete disbelief at how superior their endurance truly was.",
          42
        ),
        multiQuestion(
          'c17-l4-q24',
          24,
          'Which TWO feelings did Thomas experience when he was in Kenya? (Second choice)',
          MC_Q23_OPTIONS,
          ['A', 'D'],
          "Thomas describes feeling 'an overwhelming sense of gratitude for having such an extraordinary opportunity' (D) and 'complete disbelief at how superior their endurance truly was' (A).",
          "I felt an overwhelming sense of gratitude... I felt complete disbelief at how superior their endurance truly was.",
          48
        ),
      ],
    },

    // PART 3: Questions 25-30 (Matching)
    {
      id: 'c17-l4-g6',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 25–30',
      instructions: 'What is said about each of the following items of sporting equipment?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.',
      startQuestionNumber: 25,
      endQuestionNumber: 30,
      optionsList: MATCHING_Q25_OPTIONS,
      questions: [
        {
          id: 'c17-l4-q25',
          questionNumber: 25,
          prompt: 'The table tennis bat',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'B',
          explanation: "Thomas explains: 'the table tennis bat... the material was being mass produced for another purpose, originally for typewriter covers' (B).",
          transcriptExcerpt: "the table tennis bat... the material was being mass produced for another purpose",
          audioTimestampSeconds: 68,
        },
        {
          id: 'c17-l4-q26',
          questionNumber: 26,
          prompt: 'The cricket helmet',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'F',
          explanation: "Jeanne remarks: 'the cricket helmet... it was actually unpopular among spectators, who complained it ruined the traditional aesthetic of the game' (F).",
          transcriptExcerpt: "the cricket helmet... it was actually unpopular among spectators",
          audioTimestampSeconds: 82,
        },
        {
          id: 'c17-l4-q27',
          questionNumber: 27,
          prompt: 'The cycle helmet',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'A',
          explanation: "Thomas says: 'the cycle helmet... early polystyrene cycling helmets were extremely bulky and poorly ventilated, meaning it could cause excessive sweating during long rides' (A).",
          transcriptExcerpt: "the cycle helmet... meaning it could cause excessive sweating during long rides.",
          audioTimestampSeconds: 96,
        },
        {
          id: 'c17-l4-q28',
          questionNumber: 28,
          prompt: 'The golf club',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'D',
          explanation: "Jeanne notes: 'the golf club... early wooden club shafts made of hickory wood were prone to splintering and snapping, so it often had to be replaced after only a few matches' (D).",
          transcriptExcerpt: "the golf club... so it often had to be replaced after only a few matches.",
          audioTimestampSeconds: 110,
        },
        {
          id: 'c17-l4-q29',
          questionNumber: 29,
          prompt: 'The hockey stick',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'C',
          explanation: "Thomas explains: 'the hockey stick... professional hockey sticks were scarce, so people often needed to make their own using steam-bent wood' (C).",
          transcriptExcerpt: "the hockey stick... people often needed to make their own using steam-bent wood.",
          audioTimestampSeconds: 124,
        },
        {
          id: 'c17-l4-q30',
          questionNumber: 30,
          prompt: 'The football',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'G',
          explanation: "Jeanne concludes: 'the old leather football. In wet weather, the leather would absorb water and become dangerously heavy, which caused serious injuries and concussions when headed' (G).",
          transcriptExcerpt: "the old leather football... which caused serious injuries and concussions when headed.",
          audioTimestampSeconds: 138,
        },
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c17-l4-g7',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Maple Syrup

What is maple syrup?
• Made from the sap of the maple tree
• Added to food or used in cooking
• Colour described as [[31]]
• Very [[32]] compared to refined sugar

The maple tree
• Has many species
• Needs sunny days and cool nights
• Maple leaf has been on the Canadian flag since 1964
• Needs moist soil but does not need fertiliser as well
• Best growing conditions and [[33]] are in Canada and North America

Early maple sugar producers
• Made holes in the tree trunks
• Used hot [[34]] to heat the sap
• Used tree bark to make containers for collection
• Sweetened food and drink with sugar

Today's maple syrup
The trees:
• Tree trunks may not have the correct [[35]] until they have been growing for 40 years
• The changing temperature and movement of water within the tree produces the sap

The production:
• A tap is drilled into the trunk and a [[36]] carries the sap into a bucket
• Large pans of sap called evaporators are heated by means of a [[37]]
• A lot of [[38]] is produced during the evaporation process
• 'Sugar sand' is removed because it makes the syrup look [[39]] and affects the taste
• The syrup is ready for use
• A huge quantity of sap is needed to make a [[40]] of maple syrup`,
      questions: [
        {
          id: 'c17-l4-q31',
          questionNumber: 31,
          prompt: 'Colour described as [31]',
          answerKey: 'golden',
          acceptedAlternatives: ['golden'],
          explanation: "The lecturer describes: 'Maple syrup is a thick, golden, sweet-tasting liquid that can be bought in bottles or jars...'",
          transcriptExcerpt: "Maple syrup is a thick, golden, sweet-tasting liquid",
          audioTimestampSeconds: 22,
        },
        {
          id: 'c17-l4-q32',
          questionNumber: 32,
          prompt: 'Very [32] compared to refined sugar',
          answerKey: 'healthy',
          acceptedAlternatives: ['healthy'],
          explanation: "The lecturer explains: 'It contains no artificial preservatives or added ingredients, and it provides a healthy alternative to refined sugar.'",
          transcriptExcerpt: "and it provides a healthy alternative to refined sugar.",
          audioTimestampSeconds: 32,
        },
        {
          id: 'c17-l4-q33',
          questionNumber: 33,
          prompt: 'Best growing conditions and [33] are in Canada and North America',
          answerKey: 'climate',
          acceptedAlternatives: ['climate'],
          explanation: "The lecturer states: 'The optimal growing conditions and climate are found throughout eastern Canada and northeastern North America.'",
          transcriptExcerpt: "The optimal growing conditions and climate are found throughout eastern Canada",
          audioTimestampSeconds: 52,
        },
        {
          id: 'c17-l4-q34',
          questionNumber: 34,
          prompt: 'Used hot [34] to heat the sap',
          answerKey: 'rocks',
          acceptedAlternatives: ['rocks', 'rock', 'hot rocks', 'hot rock'],
          explanation: "The lecturer notes: 'they placed hot rocks into the wooden troughs to heat the sap and boil off the excess water.'",
          transcriptExcerpt: "they placed hot rocks into the wooden troughs to heat the sap",
          audioTimestampSeconds: 68,
        },
        {
          id: 'c17-l4-q35',
          questionNumber: 35,
          prompt: 'Tree trunks may not have the correct [35] until they have been growing for 40 years',
          answerKey: 'diameter',
          acceptedAlternatives: ['diameter', 'trunk diameter'],
          explanation: "The lecturer explains: 'tree trunks generally do not reach the necessary diameter of at least 25 centimetres until they have been growing for approximately 40 years.'",
          transcriptExcerpt: "tree trunks generally do not reach the necessary diameter of at least 25 centimetres",
          audioTimestampSeconds: 88,
        },
        {
          id: 'c17-l4-q36',
          questionNumber: 36,
          prompt: 'A tap is drilled into the trunk and a [36] carries the sap into a bucket',
          answerKey: 'tube',
          acceptedAlternatives: ['tube', 'pipe'],
          explanation: "The lecturer describes: 'a tap is drilled into the trunk and a tube carries the sap directly into a collection bucket or modern pipeline system.'",
          transcriptExcerpt: "a tap is drilled into the trunk and a tube carries the sap directly into a collection bucket",
          audioTimestampSeconds: 104,
        },
        {
          id: 'c17-l4-q37',
          questionNumber: 37,
          prompt: 'Large pans of sap called evaporators are heated by means of a [37]',
          answerKey: 'fire',
          acceptedAlternatives: ['fire', 'a fire'],
          explanation: "The lecturer states: 'evaporators, which are heated by means of a wood or oil fire.'",
          transcriptExcerpt: "evaporators, which are heated by means of a wood or oil fire.",
          audioTimestampSeconds: 118,
        },
        {
          id: 'c17-l4-q38',
          questionNumber: 38,
          prompt: 'A lot of [38] is produced during the evaporation process',
          answerKey: 'steam',
          acceptedAlternatives: ['steam'],
          explanation: "The lecturer mentions: 'a tremendous amount of steam is produced as water evaporates from the liquid.'",
          transcriptExcerpt: "a tremendous amount of steam is produced as water evaporates from the liquid.",
          audioTimestampSeconds: 130,
        },
        {
          id: 'c17-l4-q39',
          questionNumber: 39,
          prompt: "'Sugar sand' is removed because it makes the syrup look [39] and affects the taste",
          answerKey: 'cloudy',
          acceptedAlternatives: ['cloudy'],
          explanation: "The lecturer explains: 'a mineral residue known as sugar sand must be filtered out, because if left behind, it makes the syrup appear cloudy and compromises the smooth taste.'",
          transcriptExcerpt: "because if left behind, it makes the syrup appear cloudy",
          audioTimestampSeconds: 144,
        },
        {
          id: 'c17-l4-q40',
          questionNumber: 40,
          prompt: 'A huge quantity of sap is needed to make a [40] of maple syrup',
          answerKey: 'litre',
          acceptedAlternatives: ['litre', 'liter', 'a litre', 'a liter'],
          explanation: "The lecturer concludes: 'It requires a staggering 40 litres of raw sap to produce just a single litre of finished maple syrup!'",
          transcriptExcerpt: "It requires a staggering 40 litres of raw sap to produce just a single litre of finished maple syrup!",
          audioTimestampSeconds: 158,
        },
      ],
    },
  ];

  const audioConfig: ListeningAudioConfig = {
    postTestCheckTimeSeconds: 120,
    audioMode: 'part_audios',
    parts: [
      { partNumber: 1, audioUrl: '/audio/listening/c17_test4_part1.mp3', durationSeconds: 180 },
      { partNumber: 2, audioUrl: '/audio/listening/c17_test4_part2.mp3', durationSeconds: 200 },
      { partNumber: 3, audioUrl: '/audio/listening/c17_test4_part3.mp3', durationSeconds: 220 },
      { partNumber: 4, audioUrl: '/audio/listening/c17_test4_part4.mp3', durationSeconds: 210 },
    ],
  };

  return {
    title: 'Cambridge IELTS 17 Academic Listening Test 4',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig,
    parts,
    questionGroups,
  };
}

export async function ingestCambridge17ListeningTest4(authorId?: string) {
  const data = getCambridge17ListeningTest4Data();
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);

  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 17 Listening Test 4 validation failed: ${validationErrors.join('; ')}`);
  }

  const resolvedAuthorId =
    authorId ||
    ((await db.prepare('SELECT id FROM users WHERE role = ? LIMIT 1').get('admin') as { id?: string } | undefined)?.id ??
      '00000000-0000-0000-0000-000000000001');

  const now = new Date().toISOString();
  const existingTest = (await db
    .prepare('SELECT id, current_version_number FROM listening_tests WHERE title = ?')
    .get(data.title)) as { id: string; current_version_number: number } | undefined;

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db
      .prepare('SELECT id FROM listening_test_versions WHERE test_id = ? AND version_number = 1')
      .get(testId)) as { id: string } | undefined;

    if (existingVersion) {
      versionId = existingVersion.id;
      await db.prepare(`
        UPDATE listening_test_versions
        SET parts_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            audio_config_json = ?,
            status = 'published',
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
