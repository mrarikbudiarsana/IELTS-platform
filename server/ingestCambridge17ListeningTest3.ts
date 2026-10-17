import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'It started recently.' },
  { key: 'B', text: 'More children attend after school than before school.' },
  { key: 'C', text: 'An average of 50 children attend in the mornings.' },
  { key: 'D', text: 'A child cannot attend both the before and after school sessions.' },
  { key: 'E', text: 'The maximum number of children who can attend is 70.' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: '£3.50' },
  { key: 'B', text: '£5.70' },
  { key: 'C', text: '£7.20' },
];

const MC_Q14_OPTIONS = [
  { key: 'A', text: 'Children should bring their own snacks.' },
  { key: 'B', text: 'Children can have a hot breakfast.' },
  { key: 'C', text: 'Children are given a proper meal at 5 p.m.' },
];

const MC_Q15_OPTIONS = [
  { key: 'A', text: 'Children from other schools can attend.' },
  { key: 'B', text: 'The sessions finish earlier.' },
  { key: 'C', text: 'Parents must book well in advance.' },
];

const MATCHING_Q16_OPTIONS = [
  { key: 'A', text: 'has limited availability' },
  { key: 'B', text: 'is no longer available' },
  { key: 'C', text: 'is for over 8s only' },
  { key: 'D', text: 'requires help from parents' },
  { key: 'E', text: 'involves an additional fee' },
  { key: 'F', text: 'is a new activity' },
  { key: 'G', text: 'was requested by children' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'it involves working with teenagers.' },
  { key: 'B', text: 'it is outdoors.' },
  { key: 'C', text: 'it is close to where she lives.' },
];

const MC_Q22_OPTIONS = [
  { key: 'A', text: 'ensuring children stay in the stadium' },
  { key: 'B', text: 'checking the equipment is in good condition' },
  { key: 'C', text: 'managing the spectators' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'They can be hard to manage.' },
  { key: 'B', text: 'They are usually very critical.' },
  { key: 'C', text: 'They rarely attend in large numbers.' },
];

const MC_Q24_OPTIONS = [
  { key: 'A', text: 'bad weather' },
  { key: 'B', text: 'an injury' },
  { key: 'C', text: 'missing equipment' },
];

const MATCHING_Q25_OPTIONS = [
  { key: 'A', text: 'being flexible' },
  { key: 'B', text: 'focusing on details' },
  { key: 'C', text: 'having a smart appearance' },
  { key: 'D', text: 'hiding your emotions' },
  { key: 'E', text: 'relying on experts' },
  { key: 'F', text: 'trusting your own views' },
  { key: 'G', text: 'doing one thing at a time' },
  { key: 'H', text: 'thinking of the future' },
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

export function getCambridge17ListeningTest3Data(): {
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
      id: 'c17-l3-p1',
      partNumber: 1,
      title: 'Part 1: Advice on Surfing Holidays',
      context: 'Jack gives advice to a woman planning a surfing holiday in Ireland.',
      audioUrl: '/audio/listening/c17_test3_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `WOMAN: Hi Jack. I was wondering if you could give me some advice about taking up surfing. We're thinking about a holiday this summer.
JACK: Sure! I'd love to help. Surfing is brilliant for family holidays in the summer, especially if you have children.
WOMAN: That sounds great. Do you need any special physical preparation?
JACK: Well, you need to be quite fit. Paddling out against the surf requires decent upper body strength and stamina.
WOMAN: Right, we'll start swimming to get ready. Where in Ireland would you recommend going?
JACK: Well, County Clare is really popular. The town of Lahinch has some good quality hotels and several very reputable surf schools. Plus, there are famous cliffs nearby, which make for a wonderful day out.
WOMAN: Excellent. Did you go anywhere else?
JACK: Yes, I’ve also been surfing in County Mayo, which is less well-known for surfing, but we had a really good time. That was a few years ago when the kids were younger. There’s a good surf school at Carrowniskey beach.
WOMAN: How do you spell that?
JACK: C-A-double R-O-W-N-I-S-K-E-Y.
WOMAN: OK.
JACK: I put the kids into the surf camp they run during the summer for 10–16 year olds.
WOMAN: Oh right. How long was that for?
JACK: The surf camp lasts for one week, with three hours of coaching every day. And when you're not surfing, you can also explore the local bay by kayak.
WOMAN: Wonderful. What's the best time of year to go?
JACK: The best month to go is September. The sea is at its warmest then, and the autumn swells start coming in. During the summer, the average temperature is approximately 19 degrees.
WOMAN: And what about the cost of equipment?
JACK: To hire a wetsuit and surfboard together costs about 30 euros per day. It’s also advisable to hire boots for warmth, as the Atlantic waters can feel chilly after an hour or two.
WOMAN: Thanks Jack, that’s really helpful advice!`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 15, quote: "Surfing is brilliant for family holidays in the summer" },
        { questionNumber: 2, timestampSeconds: 26, quote: "Well, you need to be quite fit." },
        { questionNumber: 3, timestampSeconds: 42, quote: "The town of Lahinch has some good quality hotels and several very reputable surf schools." },
        { questionNumber: 4, timestampSeconds: 62, quote: "There’s a good surf school at Carrowniskey beach. How do you spell that? C-A-double R-O-W-N-I-S-K-E-Y." },
        { questionNumber: 5, timestampSeconds: 80, quote: "The surf camp lasts for one week, with three hours of coaching every day." },
        { questionNumber: 6, timestampSeconds: 92, quote: "you can also explore the local bay by kayak." },
        { questionNumber: 7, timestampSeconds: 104, quote: "The best month to go is September." },
        { questionNumber: 8, timestampSeconds: 114, quote: "During the summer, the average temperature is approximately 19 degrees." },
        { questionNumber: 9, timestampSeconds: 125, quote: "To hire a wetsuit and surfboard together costs about 30 euros per day." },
        { questionNumber: 10, timestampSeconds: 135, quote: "It’s also advisable to hire boots for warmth" },
      ],
    },
    {
      id: 'c17-l3-p2',
      partNumber: 2,
      title: 'Part 2: Extended Hours Childcare Service',
      context: 'The manager of a school childcare service explains arrangements, costs, and activities.',
      audioUrl: '/audio/listening/c17_test3_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Good evening, everyone, and thank you for coming to find out about our school's extended hours childcare service. We know how important flexible childcare is for working parents, so let me explain how our service operates.
First of all, our childcare service is available both before and after school. Interestingly, more children attend after school than before school, though both sessions are well used. We can accommodate a maximum of 70 children across the service, so we advise booking your slots early.
Regarding the fees, we aim to keep our charges reasonable. A morning session is £3.50, and in the afternoon, if your child stays until 5 p.m., it costs £5.70. However, for a complete afternoon session per child, staying until our closing time of 6 p.m., the cost is £7.20.
Parents often ask about food. We provide a light snack directly after the school bell rings, and then children are given a proper meal at 5 p.m., such as pasta bake or jacket potatoes, which ensures they aren't hungry when you collect them.
Our service also runs during the school holidays from 8 a.m. to 6 p.m. What is different about arrangements in the school holidays is that children from other schools can attend, giving our pupils a great opportunity to make new friends.

Now, let me tell you about some of the special after-school activities on offer.
First, Spanish. We have a native speaker who comes in to teach conversational Spanish, though this involves an additional fee to cover the tutor's materials.
Next is Music. We have a variety of percussion and wind instruments, but because of the noise and supervision needed, this activity requires help from parents to run smoothly.
Then we have Painting. We introduced this recently, and it has proved immensely popular; in fact, it was requested by children themselves through our school council.
Yoga is another session we run once a week. This is a new activity that we only added this term, helping children develop relaxation techniques.
Finally, Cooking. In this class, the children learn basic kitchen skills and prepare simple dishes. Because of the use of heat and sharp utensils, this activity is for over 8s only.`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 20, quote: "Interestingly, more children attend after school than before school" },
        { questionNumber: 12, timestampSeconds: 28, quote: "We can accommodate a maximum of 70 children across the service" },
        { questionNumber: 13, timestampSeconds: 48, quote: "However, for a complete afternoon session per child... the cost is £7.20." },
        { questionNumber: 14, timestampSeconds: 65, quote: "children are given a proper meal at 5 p.m." },
        { questionNumber: 15, timestampSeconds: 85, quote: "What is different about arrangements in the school holidays is that children from other schools can attend" },
        { questionNumber: 16, timestampSeconds: 104, quote: "First, Spanish... this involves an additional fee to cover the tutor's materials." },
        { questionNumber: 17, timestampSeconds: 118, quote: "Next is Music... this activity requires help from parents to run smoothly." },
        { questionNumber: 18, timestampSeconds: 132, quote: "Painting... in fact, it was requested by children themselves through our school council." },
        { questionNumber: 19, timestampSeconds: 146, quote: "Yoga is another session we run once a week. This is a new activity that we only added this term" },
        { questionNumber: 20, timestampSeconds: 160, quote: "Finally, Cooking... this activity is for over 8s only." },
      ],
    },
    {
      id: 'c17-l3-p3',
      partNumber: 3,
      title: "Part 3: Holly's Work Placement Tutorial",
      context: 'Holly and her university tutor, Dr Green, discuss her upcoming sports management work placement.',
      audioUrl: '/audio/listening/c17_test3_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `HOLLY: Hello Dr Green – I’m here to talk to you about my work placement.
TUTOR: Oh yes, it’s Holly, isn’t it?
HOLLY: Yes.
TUTOR: So, which work placement have you chosen?
HOLLY: I decided to go for the Orion Stadium placement. The event I’ll be managing is one where I’m helping to set up a sports competition for primary school children.
TUTOR: Yup. That’s always a popular placement – even though it can be tougher than you think, working with children.
HOLLY: I know, but it’s the fresh air that attracts me – organising something indoors doesn’t have the same appeal, even though it might be fun. It is outdoors and that's why I chose it.
TUTOR: OK, so obviously safety is going to be one of your key concerns for this event.
HOLLY: Yes, I’ve already thought about that. I’ll need to make sure none of the equipment’s damaged.
TUTOR: Ah, well, you’ll be working with schools, so the equipment will be their responsibility. However, the grounds and what goes on there will be yours.
HOLLY: That’ll include keeping everyone within the boundary once they’re on the field?
TUTOR: Exactly. Ensuring children stay in the stadium grounds and not losing anyone is what you must emphasise most.
HOLLY: Right. What about the spectators?
TUTOR: Well, they’re usually enthusiastic parents, but you can get the odd one who’s overly competitive. They can be hard to manage when tensions rise, so you'll need to keep a watchful eye.
HOLLY: OK. And presumably the schedule can be quite tight?
TUTOR: It is. But remember things rarely go to plan. In the past, an injury has caused delays and affected the schedule, so you need to be prepared to adapt.
HOLLY: Right. Now, can we look at the specific events management skills required for the placement?
TUTOR: Certainly. First is communication. What do you think is key there?
HOLLY: I think having a smart appearance is really important when greeting school staff and officials; it establishes respect immediately.
TUTOR: I agree. Now what about organisation?
HOLLY: You need clear lists, but above all, being flexible when unexpected changes occur.
TUTOR: Very true. With time management, pressure can mount quickly.
HOLLY: Yes, and I think hiding your emotions under stress is essential so you don't panic the children.
TUTOR: Absolutely. Then with creativity, it's not just big ideas, is it?
HOLLY: No, it's focusing on details and finding imaginative solutions to small practical problems.
TUTOR: And leadership?
HOLLY: You have to be confident and trust your own views when making quick decisions on the pitch.
TUTOR: Exactly. Finally, networking.
HOLLY: That's about building relationships and thinking of the future for career opportunities.
TUTOR: Excellent, Holly. You have a very clear plan.`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 28, quote: "It is outdoors and that's why I chose it." },
        { questionNumber: 22, timestampSeconds: 52, quote: "Ensuring children stay in the stadium grounds and not losing anyone is what you must emphasise most." },
        { questionNumber: 23, timestampSeconds: 70, quote: "They can be hard to manage when tensions rise, so you'll need to keep a watchful eye." },
        { questionNumber: 24, timestampSeconds: 90, quote: "In the past, an injury has caused delays and affected the schedule" },
        { questionNumber: 25, timestampSeconds: 112, quote: "I think having a smart appearance is really important" },
        { questionNumber: 26, timestampSeconds: 128, quote: "You need clear lists, but above all, being flexible when unexpected changes occur." },
        { questionNumber: 27, timestampSeconds: 142, quote: "I think hiding your emotions under stress is essential" },
        { questionNumber: 28, timestampSeconds: 156, quote: "it's focusing on details and finding imaginative solutions" },
        { questionNumber: 29, timestampSeconds: 170, quote: "You have to be confident and trust your own views" },
        { questionNumber: 30, timestampSeconds: 186, quote: "building relationships and thinking of the future for career opportunities." },
      ],
    },
    {
      id: 'c17-l3-p4',
      partNumber: 4,
      title: 'Part 4: Bird Migration Theory',
      context: 'A lecture on early historical beliefs, misconceptions, and scientific breakthroughs regarding bird migration.',
      audioUrl: '/audio/listening/c17_test3_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Welcome to today’s lecture on the history of ornithology, and in particular, early theories of bird migration.
Today we know that billions of birds travel vast distances between breeding and wintering grounds every year. But for many centuries, the seasonal disappearance of birds was one of nature’s greatest mysteries. In ancient times, people could not conceive that tiny birds could fly thousands of miles. Instead, early scholars came up with very different explanations. For example, it was widely believed that birds hibernated underwater or buried themselves in mud at the bottom of ponds and lakes until spring arrived.
Even eminent philosophers were misled. Aristotle believed birds changed from one species into another depending on the season. In autumn, he observed that redstarts experience the loss of feathers, and concluded that they physically transformed into European robins. This mistaken assumption seemed logical at the time because the two species of birds shared a remarkably similar shape and size.
Later centuries produced even more extraordinary theories. In the seventeenth century, a clergyman named Charles Morton popularised the idea that migrating birds flew all the way to the moon for the winter, taking sixty days to complete the journey!
Real understanding only began to develop in the nineteenth century through serendipitous physical discoveries. In 1822, a white stork was shot in Germany and found to have a wooden spear from Central Africa embedded in its neck. This famously provided the first undeniable physical evidence that European storks spent their winters in tropical Africa.
Before this discovery, virtually nothing was known about the actual destinations or flight paths of migrating birds. It had long been assumed that birds were far too frail to cross huge oceans without perching.
Modern scientific study began in 1899 when the Danish schoolteacher Christian Mortensen pioneered bird banding, or ringing. Attaching lightweight metal rings to birds' legs allowed researchers to track their movements, although early success depended entirely on the recovery of dead birds reported by the public. By 1931, enough data had been accumulated to publish the very first comprehensive atlas detailing the migration routes of European birds.`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 28, quote: "it was widely believed that birds hibernated underwater or buried themselves in mud" },
        { questionNumber: 32, timestampSeconds: 46, quote: "he observed that redstarts experience the loss of feathers" },
        { questionNumber: 33, timestampSeconds: 60, quote: "because the two species of birds shared a remarkably similar shape and size." },
        { questionNumber: 34, timestampSeconds: 78, quote: "popularised the idea that migrating birds flew all the way to the moon for the winter" },
        { questionNumber: 35, timestampSeconds: 104, quote: "found to have a wooden spear from Central Africa embedded in its neck." },
        { questionNumber: 36, timestampSeconds: 118, quote: "This famously provided the first undeniable physical evidence that European storks spent their winters in tropical Africa." },
        { questionNumber: 37, timestampSeconds: 135, quote: "virtually nothing was known about the actual destinations or flight paths of migrating birds." },
        { questionNumber: 38, timestampSeconds: 148, quote: "It had long been assumed that birds were far too frail to cross huge oceans without perching." },
        { questionNumber: 39, timestampSeconds: 172, quote: "early success depended entirely on the recovery of dead birds reported by the public." },
        { questionNumber: 40, timestampSeconds: 188, quote: "publish the very first comprehensive atlas detailing the migration routes of European birds." },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-10 (Notes Completion)
    {
      id: 'c17-l3-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `Advice on Surfing Holidays

Jack’s advice
• Recommends surfing for [[1]] holidays in the summer
• Need to be quite [[2]]

Irish surfing locations
County Clare
• Lahinch has some good quality [[3]] and surf schools
• There are famous cliffs nearby

County Mayo
• Good surf school at [[4]] beach
• Surf camp lasts for one [[5]]
• Can also explore the local [[6]] by kayak

Weather
• Best month to go: [[7]]
• Average temperature in summer – approx. [[8]] degrees

Costs
Equipment
• Wetsuit and surfboard: [[9]] euros per day
• Also advisable to hire [[10]] for warmth`,
      questions: [
        {
          id: 'c17-l3-q1',
          questionNumber: 1,
          prompt: 'Recommends surfing for [1] holidays in the summer',
          answerKey: 'family',
          acceptedAlternatives: ['family'],
          explanation: "Jack says: 'Surfing is brilliant for family holidays in the summer, especially if you have children.'",
          transcriptExcerpt: "Surfing is brilliant for family holidays in the summer",
          audioTimestampSeconds: 15,
        },
        {
          id: 'c17-l3-q2',
          questionNumber: 2,
          prompt: 'Need to be quite [2]',
          answerKey: 'fit',
          acceptedAlternatives: ['fit'],
          explanation: "Jack advises: 'Well, you need to be quite fit. Paddling out against the surf requires decent upper body strength and stamina.'",
          transcriptExcerpt: "Well, you need to be quite fit.",
          audioTimestampSeconds: 26,
        },
        {
          id: 'c17-l3-q3',
          questionNumber: 3,
          prompt: 'Lahinch has some good quality [3] and surf schools',
          answerKey: 'hotels',
          acceptedAlternatives: ['hotels'],
          explanation: "Jack mentions: 'The town of Lahinch has some good quality hotels and several very reputable surf schools.'",
          transcriptExcerpt: "The town of Lahinch has some good quality hotels and several very reputable surf schools.",
          audioTimestampSeconds: 42,
        },
        {
          id: 'c17-l3-q4',
          questionNumber: 4,
          prompt: 'Good surf school at [4] beach',
          answerKey: 'Carrowniskey',
          acceptedAlternatives: ['Carrowniskey', 'carrowniskey'],
          explanation: "Jack states: 'There’s a good surf school at Carrowniskey beach' and spells it: 'C-A-double R-O-W-N-I-S-K-E-Y.'",
          transcriptExcerpt: "There’s a good surf school at Carrowniskey beach. How do you spell that? C-A-double R-O-W-N-I-S-K-E-Y.",
          audioTimestampSeconds: 62,
        },
        {
          id: 'c17-l3-q5',
          questionNumber: 5,
          prompt: 'Surf camp lasts for one [5]',
          answerKey: 'week',
          acceptedAlternatives: ['week'],
          explanation: "Jack explains: 'The surf camp lasts for one week, with three hours of coaching every day.'",
          transcriptExcerpt: "The surf camp lasts for one week, with three hours of coaching every day.",
          audioTimestampSeconds: 80,
        },
        {
          id: 'c17-l3-q6',
          questionNumber: 6,
          prompt: 'Can also explore the local [6] by kayak',
          answerKey: 'bay',
          acceptedAlternatives: ['bay'],
          explanation: "Jack notes: 'you can also explore the local bay by kayak.'",
          transcriptExcerpt: "you can also explore the local bay by kayak.",
          audioTimestampSeconds: 92,
        },
        {
          id: 'c17-l3-q7',
          questionNumber: 7,
          prompt: 'Best month to go: [7]',
          answerKey: 'September',
          acceptedAlternatives: ['September', 'september'],
          explanation: "Jack tells her: 'The best month to go is September.'",
          transcriptExcerpt: "The best month to go is September.",
          audioTimestampSeconds: 104,
        },
        {
          id: 'c17-l3-q8',
          questionNumber: 8,
          prompt: 'Average temperature in summer – approx. [8] degrees',
          answerKey: '19',
          acceptedAlternatives: ['19', 'nineteen'],
          explanation: "Jack adds: 'During the summer, the average temperature is approximately 19 degrees.'",
          transcriptExcerpt: "During the summer, the average temperature is approximately 19 degrees.",
          audioTimestampSeconds: 114,
        },
        {
          id: 'c17-l3-q9',
          questionNumber: 9,
          prompt: 'Wetsuit and surfboard: [9] euros per day',
          answerKey: '30',
          acceptedAlternatives: ['30', 'thirty'],
          explanation: "Jack notes: 'To hire a wetsuit and surfboard together costs about 30 euros per day.'",
          transcriptExcerpt: "To hire a wetsuit and surfboard together costs about 30 euros per day.",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c17-l3-q10',
          questionNumber: 10,
          prompt: 'Also advisable to hire [10] for warmth',
          answerKey: 'boots',
          acceptedAlternatives: ['boots'],
          explanation: "Jack suggests: 'It’s also advisable to hire boots for warmth, as the Atlantic waters can feel chilly after an hour or two.'",
          transcriptExcerpt: "It’s also advisable to hire boots for warmth",
          audioTimestampSeconds: 135,
        },
      ],
    },

    // PART 2: Questions 11-12 (Multiple Choice - Pick 2)
    {
      id: 'c17-l3-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 11 and 12',
      instructions: "Choose TWO letters, A–E.\nWhich TWO facts are given about the school's extended hours childcare service?",
      startQuestionNumber: 11,
      endQuestionNumber: 12,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q11_OPTIONS,
      questions: [
        multiQuestion(
          'c17-l3-q11',
          11,
          "Which TWO facts are given about the school's extended hours childcare service? (First choice)",
          MC_Q11_OPTIONS,
          ['B', 'E'],
          "The manager states: 'more children attend after school than before school' (B) and 'We can accommodate a maximum of 70 children across the service' (E).",
          "Interestingly, more children attend after school than before school... We can accommodate a maximum of 70 children across the service",
          20
        ),
        multiQuestion(
          'c17-l3-q12',
          12,
          "Which TWO facts are given about the school's extended hours childcare service? (Second choice)",
          MC_Q11_OPTIONS,
          ['B', 'E'],
          "The manager states: 'more children attend after school than before school' (B) and 'We can accommodate a maximum of 70 children across the service' (E).",
          "Interestingly, more children attend after school than before school... We can accommodate a maximum of 70 children across the service",
          28
        ),
      ],
    },

    // PART 2: Questions 13-15 (Multiple Choice)
    {
      id: 'c17-l3-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 13–15',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 13,
      endQuestionNumber: 15,
      questions: [
        {
          id: 'c17-l3-q13',
          questionNumber: 13,
          prompt: 'How much does childcare cost for a complete afternoon session per child?',
          options: MC_Q13_OPTIONS,
          answerKey: 'C',
          explanation: "The manager explains: 'However, for a complete afternoon session per child, staying until our closing time of 6 p.m., the cost is £7.20' (C).",
          transcriptExcerpt: "However, for a complete afternoon session per child... the cost is £7.20.",
          audioTimestampSeconds: 48,
        },
        {
          id: 'c17-l3-q14',
          questionNumber: 14,
          prompt: 'What does the manager say about food?',
          options: MC_Q14_OPTIONS,
          answerKey: 'C',
          explanation: "The manager notes: 'children are given a proper meal at 5 p.m., such as pasta bake or jacket potatoes' (C).",
          transcriptExcerpt: "children are given a proper meal at 5 p.m.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c17-l3-q15',
          questionNumber: 15,
          prompt: 'What is different about arrangements in the school holidays?',
          options: MC_Q15_OPTIONS,
          answerKey: 'A',
          explanation: "The manager explains: 'What is different about arrangements in the school holidays is that children from other schools can attend' (A).",
          transcriptExcerpt: "What is different about arrangements in the school holidays is that children from other schools can attend",
          audioTimestampSeconds: 85,
        },
      ],
    },

    // PART 2: Questions 16-20 (Matching)
    {
      id: 'c17-l3-g4',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 16–20',
      instructions: 'What information is given about each of the following activities on offer?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
      startQuestionNumber: 16,
      endQuestionNumber: 20,
      optionsList: MATCHING_Q16_OPTIONS,
      questions: [
        {
          id: 'c17-l3-q16',
          questionNumber: 16,
          prompt: 'Spanish',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'E',
          explanation: "The manager notes: 'First, Spanish... this involves an additional fee to cover the tutor's materials' (E).",
          transcriptExcerpt: "First, Spanish... this involves an additional fee to cover the tutor's materials.",
          audioTimestampSeconds: 104,
        },
        {
          id: 'c17-l3-q17',
          questionNumber: 17,
          prompt: 'Music',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'D',
          explanation: "The manager explains: 'Next is Music... this activity requires help from parents to run smoothly' (D).",
          transcriptExcerpt: "Next is Music... this activity requires help from parents to run smoothly.",
          audioTimestampSeconds: 118,
        },
        {
          id: 'c17-l3-q18',
          questionNumber: 18,
          prompt: 'Painting',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'G',
          explanation: "The manager says: 'Painting... was requested by children themselves through our school council' (G).",
          transcriptExcerpt: "Painting... in fact, it was requested by children themselves through our school council.",
          audioTimestampSeconds: 132,
        },
        {
          id: 'c17-l3-q19',
          questionNumber: 19,
          prompt: 'Yoga',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'F',
          explanation: "The manager mentions: 'Yoga is another session we run once a week. This is a new activity that we only added this term' (F).",
          transcriptExcerpt: "Yoga is another session we run once a week. This is a new activity that we only added this term",
          audioTimestampSeconds: 146,
        },
        {
          id: 'c17-l3-q20',
          questionNumber: 20,
          prompt: 'Cooking',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'C',
          explanation: "The manager states: 'Because of the use of heat and sharp utensils, this activity is for over 8s only' (C).",
          transcriptExcerpt: "Finally, Cooking... this activity is for over 8s only.",
          audioTimestampSeconds: 160,
        },
      ],
    },

    // PART 3: Questions 21-24 (Multiple Choice)
    {
      id: 'c17-l3-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 21–24',
      instructions: "Choose the correct letter, A, B or C.\nHolly's Work Placement Tutorial",
      startQuestionNumber: 21,
      endQuestionNumber: 24,
      questions: [
        {
          id: 'c17-l3-q21',
          questionNumber: 21,
          prompt: 'Holly has chosen the Orion Stadium placement because',
          options: MC_Q21_OPTIONS,
          answerKey: 'B',
          explanation: "Holly explains: 'organising something indoors doesn’t have the same appeal, even though it might be fun. It is outdoors and that's why I chose it' (B).",
          transcriptExcerpt: "It is outdoors and that's why I chose it.",
          audioTimestampSeconds: 28,
        },
        {
          id: 'c17-l3-q22',
          questionNumber: 22,
          prompt: 'Which aspect of safety does Dr Green emphasise most?',
          options: MC_Q22_OPTIONS,
          answerKey: 'A',
          explanation: "Dr Green stresses: 'Ensuring children stay in the stadium grounds and not losing anyone is what you must emphasise most' (A).",
          transcriptExcerpt: "Ensuring children stay in the stadium grounds and not losing anyone is what you must emphasise most.",
          audioTimestampSeconds: 52,
        },
        {
          id: 'c17-l3-q23',
          questionNumber: 23,
          prompt: 'What does Dr Green say about the spectators?',
          options: MC_Q23_OPTIONS,
          answerKey: 'A',
          explanation: "Dr Green notes: 'They can be hard to manage when tensions rise, so you'll need to keep a watchful eye' (A).",
          transcriptExcerpt: "They can be hard to manage when tensions rise, so you'll need to keep a watchful eye.",
          audioTimestampSeconds: 70,
        },
        {
          id: 'c17-l3-q24',
          questionNumber: 24,
          prompt: 'What has affected the schedule in the past?',
          options: MC_Q24_OPTIONS,
          answerKey: 'B',
          explanation: "Dr Green recalls: 'In the past, an injury has caused delays and affected the schedule, so you need to be prepared to adapt' (B).",
          transcriptExcerpt: "In the past, an injury has caused delays and affected the schedule",
          audioTimestampSeconds: 90,
        },
      ],
    },

    // PART 3: Questions 25-30 (Matching)
    {
      id: 'c17-l3-g6',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 25–30',
      instructions: 'What do Holly and her tutor agree is an important aspect of each of the following events management skills?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.',
      startQuestionNumber: 25,
      endQuestionNumber: 30,
      optionsList: MATCHING_Q25_OPTIONS,
      questions: [
        {
          id: 'c17-l3-q25',
          questionNumber: 25,
          prompt: 'Communication',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'C',
          explanation: "Holly says: 'I think having a smart appearance is really important when greeting school staff and officials' and Dr Green agrees (C).",
          transcriptExcerpt: "I think having a smart appearance is really important",
          audioTimestampSeconds: 112,
        },
        {
          id: 'c17-l3-q26',
          questionNumber: 26,
          prompt: 'Organisation',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'A',
          explanation: "Holly emphasizes: 'above all, being flexible when unexpected changes occur' and Dr Green agrees: 'Very true' (A).",
          transcriptExcerpt: "You need clear lists, but above all, being flexible when unexpected changes occur.",
          audioTimestampSeconds: 128,
        },
        {
          id: 'c17-l3-q27',
          questionNumber: 27,
          prompt: 'Time management',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'D',
          explanation: "Holly says: 'I think hiding your emotions under stress is essential so you don't panic the children' and Dr Green confirms: 'Absolutely' (D).",
          transcriptExcerpt: "I think hiding your emotions under stress is essential",
          audioTimestampSeconds: 142,
        },
        {
          id: 'c17-l3-q28',
          questionNumber: 28,
          prompt: 'Creativity',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'B',
          explanation: "Holly explains: 'it's focusing on details and finding imaginative solutions to small practical problems' (B).",
          transcriptExcerpt: "it's focusing on details and finding imaginative solutions",
          audioTimestampSeconds: 156,
        },
        {
          id: 'c17-l3-q29',
          questionNumber: 29,
          prompt: 'Leadership',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'F',
          explanation: "Holly states: 'You have to be confident and trust your own views when making quick decisions on the pitch' (F).",
          transcriptExcerpt: "You have to be confident and trust your own views",
          audioTimestampSeconds: 170,
        },
        {
          id: 'c17-l3-q30',
          questionNumber: 30,
          prompt: 'Networking',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'H',
          explanation: "Holly notes: 'That's about building relationships and thinking of the future for career opportunities' (H).",
          transcriptExcerpt: "building relationships and thinking of the future for career opportunities.",
          audioTimestampSeconds: 186,
        },
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c17-l3-g7',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Bird Migration Theory

Early theories of bird migration
• It was believed that birds hibernated underwater or buried themselves in [[31]]
• Aristotle:
  – believed birds changed from one species into another depending on the season
  – observed that redstarts experience the loss of [[32]] in autumn
  – believed redstarts became European robins because of their similar [[33]]
• 17th century:
  – Charles Morton popularised the idea that birds fly to the [[34]] in winter

Scientific discoveries
• In 1822, a stork was found in Germany with an African spear in its [[35]]
• This provided the first physical [[36]] that birds migrate to Africa
• Previously, little was known about the exact [[37]] of migrating birds
• It had been thought that birds could not cross large [[38]]

20th-century developments
• 1899: Christian Mortensen began attaching metal rings to birds' legs
• Ringing success was dependent on the [[39]] of dead birds by the public
• 1931: publication of the first migration [[40]] detailing European bird journeys`,
      questions: [
        {
          id: 'c17-l3-q31',
          questionNumber: 31,
          prompt: 'It was believed that birds hibernated underwater or buried themselves in [31]',
          answerKey: 'mud',
          acceptedAlternatives: ['mud'],
          explanation: "The lecturer explains: 'it was widely believed that birds hibernated underwater or buried themselves in mud at the bottom of ponds and lakes.'",
          transcriptExcerpt: "it was widely believed that birds hibernated underwater or buried themselves in mud",
          audioTimestampSeconds: 28,
        },
        {
          id: 'c17-l3-q32',
          questionNumber: 32,
          prompt: 'observed that redstarts experience the loss of [32] in autumn',
          answerKey: 'feathers',
          acceptedAlternatives: ['feathers'],
          explanation: "The lecturer notes: 'In autumn, he observed that redstarts experience the loss of feathers, and concluded that they physically transformed into European robins.'",
          transcriptExcerpt: "he observed that redstarts experience the loss of feathers",
          audioTimestampSeconds: 46,
        },
        {
          id: 'c17-l3-q33',
          questionNumber: 33,
          prompt: 'believed redstarts became European robins because of their similar [33]',
          answerKey: 'shape',
          acceptedAlternatives: ['shape'],
          explanation: "The lecturer explains: 'because the two species of birds shared a remarkably similar shape and size.'",
          transcriptExcerpt: "because the two species of birds shared a remarkably similar shape and size.",
          audioTimestampSeconds: 60,
        },
        {
          id: 'c17-l3-q34',
          questionNumber: 34,
          prompt: 'Charles Morton popularised the idea that birds fly to the [34] in winter',
          answerKey: 'moon',
          acceptedAlternatives: ['moon'],
          explanation: "The lecturer states: 'Charles Morton popularised the idea that migrating birds flew all the way to the moon for the winter.'",
          transcriptExcerpt: "popularised the idea that migrating birds flew all the way to the moon for the winter",
          audioTimestampSeconds: 78,
        },
        {
          id: 'c17-l3-q35',
          questionNumber: 35,
          prompt: 'In 1822, a stork was found in Germany with an African spear in its [35]',
          answerKey: 'neck',
          acceptedAlternatives: ['neck'],
          explanation: "The lecturer mentions: 'In 1822, a white stork was shot in Germany and found to have a wooden spear from Central Africa embedded in its neck.'",
          transcriptExcerpt: "found to have a wooden spear from Central Africa embedded in its neck.",
          audioTimestampSeconds: 104,
        },
        {
          id: 'c17-l3-q36',
          questionNumber: 36,
          prompt: 'This provided the first physical [36] that birds migrate to Africa',
          answerKey: 'evidence',
          acceptedAlternatives: ['evidence'],
          explanation: "The lecturer emphasizes: 'This famously provided the first undeniable physical evidence that European storks spent their winters in tropical Africa.'",
          transcriptExcerpt: "This famously provided the first undeniable physical evidence that European storks spent their winters in tropical Africa.",
          audioTimestampSeconds: 118,
        },
        {
          id: 'c17-l3-q37',
          questionNumber: 37,
          prompt: 'Previously, little was known about the exact [37] of migrating birds',
          answerKey: 'destinations',
          acceptedAlternatives: ['destinations'],
          explanation: "The lecturer explains: 'virtually nothing was known about the actual destinations or flight paths of migrating birds.'",
          transcriptExcerpt: "virtually nothing was known about the actual destinations or flight paths of migrating birds.",
          audioTimestampSeconds: 135,
        },
        {
          id: 'c17-l3-q38',
          questionNumber: 38,
          prompt: 'It had been thought that birds could not cross large [38]',
          answerKey: 'oceans',
          acceptedAlternatives: ['oceans'],
          explanation: "The lecturer notes: 'It had long been assumed that birds were far too frail to cross huge oceans without perching.'",
          transcriptExcerpt: "It had long been assumed that birds were far too frail to cross huge oceans without perching.",
          audioTimestampSeconds: 148,
        },
        {
          id: 'c17-l3-q39',
          questionNumber: 39,
          prompt: "Ringing success was dependent on the [39] of dead birds by the public",
          answerKey: 'recovery',
          acceptedAlternatives: ['recovery'],
          explanation: "The lecturer explains: 'early success depended entirely on the recovery of dead birds reported by the public.'",
          transcriptExcerpt: "early success depended entirely on the recovery of dead birds reported by the public.",
          audioTimestampSeconds: 172,
        },
        {
          id: 'c17-l3-q40',
          questionNumber: 40,
          prompt: '1931: publication of the first migration [40] detailing European bird journeys',
          answerKey: 'atlas',
          acceptedAlternatives: ['atlas'],
          explanation: "The lecturer concludes: 'By 1931, enough data had been accumulated to publish the very first comprehensive atlas detailing the migration routes of European birds.'",
          transcriptExcerpt: "publish the very first comprehensive atlas detailing the migration routes of European birds.",
          audioTimestampSeconds: 188,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 17 Academic Listening Test 3',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c17_test3_part1.mp3', durationSeconds: 180 },
        { partNumber: 2, audioUrl: '/audio/listening/c17_test3_part2.mp3', durationSeconds: 190 },
        { partNumber: 3, audioUrl: '/audio/listening/c17_test3_part3.mp3', durationSeconds: 210 },
        { partNumber: 4, audioUrl: '/audio/listening/c17_test3_part4.mp3', durationSeconds: 210 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge17ListeningTest3(authorId?: string) {
  const data = getCambridge17ListeningTest3Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 17 Listening Test 3 validation failed: ${validationErrors.join('; ')}`);
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
