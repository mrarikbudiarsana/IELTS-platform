import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: '9' },
  { key: 'B', text: '15' },
  { key: 'C', text: '18' },
];

const MC_Q12_OPTIONS = [
  { key: 'A', text: 'dark red' },
  { key: 'B', text: 'jet black' },
  { key: 'C', text: 'light green' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'Lunchbox 1' },
  { key: 'B', text: 'Lunchbox 2' },
  { key: 'C', text: 'Lunchbox 3' },
];

const MC_Q14_OPTIONS = [
  { key: 'A', text: 'take it home' },
  { key: 'B', text: 'hand it to a member of staff' },
  { key: 'C', text: 'put it in the bins provided on the boat' },
];

const MC_Q15_OPTIONS = [
  { key: 'A', text: 'why it was built' },
  { key: 'B', text: 'who built it' },
  { key: 'C', text: 'how long it took to build' },
  { key: 'D', text: 'who staffed it' },
  { key: 'E', text: 'what it was built with' },
];

const MC_Q17_OPTIONS = [
  { key: 'A', text: 'sea eagles' },
  { key: 'B', text: 'fur seals' },
  { key: 'C', text: 'dolphins' },
  { key: 'D', text: 'whales' },
  { key: 'E', text: 'penguins' },
];

const MC_Q19_OPTIONS = [
  { key: 'A', text: 'Only large tourist boats can visit them.' },
  { key: 'B', text: 'The entrances to them are often blocked.' },
  { key: 'C', text: 'It is too dangerous for individuals to go near them.' },
  { key: 'D', text: 'Someone will explain what is inside them.' },
  { key: 'E', text: 'They cannot be reached on foot.' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'making initial contact with suitable farms' },
  { key: 'B', text: 'organising transport to and from the farm' },
  { key: 'C', text: 'finding a placement for the required length of time' },
];

const MC_Q22_OPTIONS = [
  { key: 'A', text: 'a lamb that had a broken leg.' },
  { key: 'B', text: 'a sheep that was having difficulty giving birth.' },
  { key: 'C', text: 'a newly born lamb that was having trouble feeding.' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'were of various different varieties.' },
  { key: 'B', text: 'were mainly reared for their meat.' },
  { key: 'C', text: 'had better quality wool than sheep on the hills.' },
];

const MC_Q24_OPTIONS = [
  { key: 'A', text: 'These should only be given if specially needed.' },
  { key: 'B', text: 'It is worth paying extra for the most effective ones.' },
  { key: 'C', text: 'The amount given at one time should be limited.' },
];

const MC_Q25_OPTIONS = [
  { key: 'A', text: 'She identified some cows incorrectly.' },
  { key: 'B', text: 'She accidentally threw some milk away.' },
  { key: 'C', text: 'She made a mistake when storing milk.' },
];

const MC_Q26_OPTIONS = [
  { key: 'A', text: 'Vets are failing to cope with some aspects of animal health.' },
  { key: 'B', text: 'There needs to be a fundamental change in the training of vets.' },
  { key: 'C', text: 'Some jobs could be done by the farmer rather than by a vet.' },
];

const MATCHING_Q27_OPTIONS = [
  { key: 'A', text: 'Tim found this easier than expected.' },
  { key: 'B', text: 'Tim thought this was not very clearly organised.' },
  { key: 'C', text: 'Diana may do some further study on this.' },
  { key: 'D', text: 'They both found the reading required for this was difficult.' },
  { key: 'E', text: 'Tim was shocked at something he learned on this module.' },
  { key: 'F', text: 'They were both surprised how little is known about some aspects of this.' },
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

export function getCambridge17ListeningTest1Data(): {
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
      id: 'c17-l1-p1',
      partNumber: 1,
      title: 'Part 1: Buckworth Conservation Group',
      context: 'Jan talks to Peter, the secretary of the Buckworth Conservation Group, about volunteering.',
      audioUrl: '/audio/listening/c17_test1_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `PETER: Hello?
JAN: Oh hello. My name's Jan. Are you the right person to talk to about the Buckworth Conservation Group?
PETER: Yes, I'm Peter. I'm the secretary.
JAN: Good. I've just moved to this area and I'm interested in getting involved. I was in a similar group where I used to live. Could you tell me something about your activities, please?
PETER: Of course. Well, we have a mixture of regular activities and forthcoming events. One of the regular ones is trying to keep the beach free of litter. A few of us spend a couple of hours a month on it and it's awful how much there is to clear.
JAN: I wish people would be more responsible and take it home with them.
PETER: I totally agree.
JAN: I'd be happy to help with that. Is it OK to take dogs?
PETER: I'm afraid not, as they're banned from the beach itself. You can take them along the cliffs, though, and children are welcome.
JAN: Right.
PETER: We also manage a nature reserve and there's a lot to do there all year round. For example, because it's a popular place to visit, we spend a lot of time looking after the paths and making sure they're in good condition for walking.
JAN: I could certainly help with that.
PETER: Good. And we have a programme of creating new habitats there. We've just finished making and installing nesting boxes for birds to use and next we're going to work on encouraging insects. They're important for the biodiversity.
JAN: Right.
PETER: Then we're looking into ways of identifying different types of butterflies. We get quite a few species there. And we also need to build a new wall. Part of the old one collapsed during the winter storms.
JAN: Right. Are there any events coming up?
PETER: Yes. Next Saturday, we're organizing a walk. We'll meet at the Dunsmore Beach car park, then walk across the sands and reach the island. There's an old chapel there.
JAN: Oh, I've heard of that.
PETER: It should be nice. Bring a picnic with you, and make sure you wear appropriate boots, because the ground can be muddy.
JAN: OK. I've got some. And what about the woodwork session? I heard something about that.
PETER: Ah yes. That's on the 17th, from 10 a.m. to 3 p.m. It's designed for beginners, so you don't need any previous experience. You'll be learning how to make things like wooden spoons out of local wood.
JAN: Sounds fun. How much is it?
PETER: It's 35 pounds for the session, which includes all the materials and tools. You can camp overnight if you want, for an extra five pounds, but most people just go home.
JAN: Right. Well, I'd definitely like to sign up for that session.`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 20, quote: "One of the regular ones is trying to keep the beach free of litter." },
        { questionNumber: 2, timestampSeconds: 32, quote: "Is it OK to take dogs? I'm afraid not, as they're banned from the beach itself." },
        { questionNumber: 3, timestampSeconds: 48, quote: "next we're going to work on encouraging insects." },
        { questionNumber: 4, timestampSeconds: 58, quote: "Then we're looking into ways of identifying different types of butterflies." },
        { questionNumber: 5, timestampSeconds: 66, quote: "And we also need to build a new wall. Part of the old one collapsed during the winter storms." },
        { questionNumber: 6, timestampSeconds: 78, quote: "walk across the sands and reach the island." },
        { questionNumber: 7, timestampSeconds: 90, quote: "make sure you wear appropriate boots, because the ground can be muddy." },
        { questionNumber: 8, timestampSeconds: 104, quote: "It's designed for beginners, so you don't need any previous experience." },
        { questionNumber: 9, timestampSeconds: 114, quote: "You'll be learning how to make things like wooden spoons out of local wood." },
        { questionNumber: 10, timestampSeconds: 125, quote: "It's 35 pounds for the session, which includes all the materials and tools." },
      ],
    },
    {
      id: 'c17-l1-p2',
      partNumber: 2,
      title: 'Part 2: Boat trip round Tasmania',
      context: 'Lou Miller gives information to tourists embarking on a boat trip round the coast of Tasmania.',
      audioUrl: '/audio/listening/c17_test1_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `So, hello everyone. My name's Lou Miller and I'm going to be your tour guide today as we take this fantastic boat trip around the Tasmanian coast. Before we set off, I just want to tell you a few things about our journey.
Our boats aren't huge as you can see. We already have three staff members on board and on top of that, we can transport a further fifteen people – that's you – around the coastline. But please note if there are more than nine people on either side of the boat, we'll move some of you over, otherwise all eighteen of us will end up in the sea!
We've recently upgraded all our boats. They used to be jet black, but our new ones now have these comfortable dark red seats and a light-green exterior in order to stand out from others and help promote our company. This gives our boats a rather unique appearance, don't you think?
We offer you a free lunchbox during the trip and we have three types. Lunchbox 1 contains ham and tomato sandwiches. Lunchbox 2 contains a cheddar cheese roll and Lunchbox 3 is salad-based and also contains eggs and tuna. All three lunchboxes also have a packet of crisps and chocolate bar inside. Please let staff know which lunchbox you prefer.
I'm sure I don't have to ask you not to throw anything into the sea. We don't have any bins to put litter in, but Jess, myself or Ray, our other guide, will collect it from you after lunch and put it all in a large plastic sack.
The engine on the boat makes quite a lot of noise so before we head off, let me tell you a few things about what you're going to see.
This area is famous for its ancient lighthouse, which you'll see from the boat as we turn past the first little island. It was built in 1838 to protect sailors as a number of shipwrecks had led to significant loss of life. The construction itself was complicated as some of the original drawings kept by the local council show. It sits right on top of the cliffs in a very isolated spot. In the nineteenth century there were many jobs there, such as polishing the brass lamps, chopping firewood and cleaning windows, that kept lighthouse keepers busy. These workers were mainly prison convicts until the middle of that century when ordinary families willing to live in such circumstances took over.
Some of you have asked me what creatures we can expect to see. I know everyone loves the penguins, but they're very shy and, unfortunately, tend to hide from passing boats, but you might see birds in the distance, such as sea eagles, flying around the cliff edges where they nest. When we get to the rocky area inhabited by fur seals, we'll stop and watch them swimming around the coast. They're inquisitive creatures so don't be surprised if one pops up right in front of you. Their predators, orca whales, hunt along the coastline too, but spotting one of these is rare. Dolphins, on the other hand, can sometimes approach on their own or in groups as they ride the waves beside us.
Lastly, I want to mention the caves. Tasmania is famous for its caves and the ones we'll pass by are so amazing that people are lost for words when they see them. They can only be approached by sea, but if you feel that you want to see more than we're able to show you, then you can take a kayak into the area on another day and one of our staff will give you more information on that. What we'll do is to go through a narrow channel, past some incredible rock formations and our guide will explain what is inside the caves as we approach them.`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 22, quote: "if there are more than nine people on either side of the boat, we'll move some of you over" },
        { questionNumber: 12, timestampSeconds: 40, quote: "our new ones now have these comfortable dark red seats and a light-green exterior" },
        { questionNumber: 13, timestampSeconds: 58, quote: "Lunchbox 2 contains a cheddar cheese roll" },
        { questionNumber: 14, timestampSeconds: 80, quote: "Jess, myself or Ray, our other guide, will collect it from you after lunch and put it all in a large plastic sack." },
        { questionNumber: 15, timestampSeconds: 105, quote: "It was built in 1838 to protect sailors as a number of shipwrecks had led to significant loss of life." },
        { questionNumber: 16, timestampSeconds: 125, quote: "These workers were mainly prison convicts until the middle of that century when ordinary families willing to live in such circumstances took over." },
        { questionNumber: 17, timestampSeconds: 150, quote: "When we get to the rocky area inhabited by fur seals, we'll stop and watch them swimming around the coast." },
        { questionNumber: 18, timestampSeconds: 168, quote: "Dolphins, on the other hand, can sometimes approach on their own or in groups as they ride the waves beside us." },
        { questionNumber: 19, timestampSeconds: 185, quote: "our guide will explain what is inside the caves as we approach them." },
        { questionNumber: 20, timestampSeconds: 198, quote: "They can only be approached by sea" },
      ],
    },
    {
      id: 'c17-l1-p3',
      partNumber: 3,
      title: 'Part 3: Work experience for veterinary science students',
      context: 'Two veterinary students, Tim and Diana, discuss their farm work placements and coursework modules.',
      audioUrl: '/audio/listening/c17_test1_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `DIANA: So, Tim, we have to do a short summary of our work experience on a farm.
TIM: Right. My farm was great, but arranging the work experience was hard. One problem was it was miles away and I don't drive. And also, I'd really wanted a placement for a month, but I could only get one for two weeks.
DIANA: I was lucky, the farmer let me stay on the farm so I didn't have to travel. But finding the right sort of farm to apply to wasn't easy.
TIM: No, they don't seem to have websites, do they? I found mine through a friend of my mother's. But it wasn't easy.
DIANA: No, making initial contact with suitable farms was tricky for both of us.
TIM: My farm was mostly livestock, especially sheep. I really enjoyed helping out with them. I was up most of one night helping a sheep deliver a lamb.
DIANA: On your own?
TIM: No, the farmer was there and he told me what to do. It wasn't a straightforward birth, the sheep was having difficulty giving birth, but I managed. It was a great feeling to see the lamb stagger to its feet and start feeding almost straight away, and to know that it was okay. Then another time a lamb had broken its leg and they got the vet in to set it and he talked me through what he was doing. That was really useful.
DIANA: Yes, my farm had sheep too. The farm was in a valley and they had a lowland breed called Suffolks, although the farmer said they'd had other breeds in the past.
TIM: So were they bred for their meat mostly?
DIANA: Yes, they're quite big and solid, mainly reared for their meat.
TIM: My farm was up in the hills and they had a different breed of sheep. They were Cheviots.
DIANA: Oh, I heard their wool's really sought after.
TIM: Yes, it's very hard-wearing and they use it for carpets.
DIANA: Right.
TIM: I was interested in the amount of supplements they add to animals' feed – you know, to increase their growth rate. Have you read that article about the use of additives in chicken feed?
DIANA: Yes. The farmer said those supplements shouldn't just be given routinely – these should only be given if specially needed, for instance if birds are showing signs of illness.
TIM: Exactly.
DIANA: What about your work with dairy cows? Did you do much with them?
TIM: Yeah. I helped with milking and other jobs. One thing I realized is that a lot of the cows have names – I thought it was just a number, but they respond to their names.
DIANA: Ah.
TIM: What about you? Did you work with dairy cows?
DIANA: Yes, I did. Some cows had been treated with antibiotics, so their milk wasn't suitable for human consumption, and it had to be put in a separate container. But I got mixed up, and I poured some milk from the wrong cow in with the milk for humans, so the whole lot had to be thrown away. I made a terrible mistake when storing milk. The farmer wasn't too happy with me!
TIM: Oh dear. Well, did you talk to your farmer about what they expect from vets?
DIANA: Yeah. He said vets are always happy to check animals, but they often arrive too late, and anyway, farmers often know more about certain health issues than the vet does.
TIM: Right. My farmer said much the same – that vets are good on general care, but some jobs could easily be done by the farmer rather than by a vet.
DIANA: Exactly.

TIM: Anyway, we've got to look at these course modules and give some opinions.
DIANA: Right. What about Medical terminology?
TIM: Well, I thought that would be hard, but I found it quite straightforward. I definitely found this easier than expected.
DIANA: Me too. It was just memorising lots of words.
TIM: Then there's Diet and nutrition.
DIANA: That had some stuff I wasn't expecting.
TIM: I know. I was really shocked at something I learned on this module about animal digestion.
DIANA: Yeah. Then Animal disease.
TIM: That was pretty dense, wasn't it?
DIANA: So much detail to absorb. We were both really surprised how little is known about some aspects of this.
TIM: I agree completely. And finally, Wildlife medication.
DIANA: That was useful. It gave us a good idea of what to expect in the field. I may do some further study on this later on.
TIM: Yes, though I thought some of the case studies were a bit outdated.
DIANA: Really? I thought they were fine.`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 30, quote: "finding the right sort of farm to apply to wasn't easy... making initial contact with suitable farms was tricky for both of us." },
        { questionNumber: 22, timestampSeconds: 52, quote: "It wasn't a straightforward birth, the sheep was having difficulty giving birth, but I managed." },
        { questionNumber: 23, timestampSeconds: 78, quote: "Yes, they're quite big and solid, mainly reared for their meat." },
        { questionNumber: 24, timestampSeconds: 110, quote: "these should only be given if specially needed, for instance if birds are showing signs of illness." },
        { questionNumber: 25, timestampSeconds: 145, quote: "I poured some milk from the wrong cow in with the milk for humans, so the whole lot had to be thrown away. I made a terrible mistake when storing milk." },
        { questionNumber: 26, timestampSeconds: 175, quote: "vets are good on general care, but some jobs could easily be done by the farmer rather than by a vet." },
        { questionNumber: 27, timestampSeconds: 198, quote: "Well, I thought that would be hard, but I found it quite straightforward. I definitely found this easier than expected." },
        { questionNumber: 28, timestampSeconds: 212, quote: "I was really shocked at something I learned on this module about animal digestion." },
        { questionNumber: 29, timestampSeconds: 228, quote: "We were both really surprised how little is known about some aspects of this. I agree completely." },
        { questionNumber: 30, timestampSeconds: 245, quote: "It gave us a good idea of what to expect in the field. I may do some further study on this later on." },
      ],
    },
    {
      id: 'c17-l1-p4',
      partNumber: 4,
      title: 'Part 4: Labyrinths',
      context: 'A lecture on the history, characteristics, and modern benefits of labyrinths.',
      audioUrl: '/audio/listening/c17_test1_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Labyrinths have existed for well over 4,000 years. Labyrinths and labyrinthine symbols have been found in regions as diverse as modern-day Turkey, Ireland, Greece, and India. There are various designs of labyrinth, but what they all have in common is a winding spiral path which leads to a central area. There is one starting point at the entrance, and the goal is to reach the central area. Finding your way through a labyrinth involves many twists and turns, but it's not possible to get lost, as there is only one single path.

In modern times, the word labyrinth has taken on a different meaning and is often used as a synonym for a maze. A maze is quite different as it is a kind of puzzle with an intricate network of paths. Mazes became fashionable in the 15th and 16th centuries in Europe, and can still be found in the gardens of great houses and palaces. The paths are usually surrounded by thick, high hedges so that it's not possible to see over them. Entering a maze usually involves getting lost a few times before using logic to work out the pattern and find your way to the centre and then out again. There are lots of dead ends and paths which lead you back to where you started. The word 'maze' is believed to come from a Scandinavian word for a state of confusion. This is where the word 'amazing' comes from.

Labyrinths, on the other hand, have a very different function. Although people now often refer to things they find complicated as labyrinths, this is not how they were seen in the past. The winding spiral of the labyrinth has been used for centuries as a metaphor for life's journey. It served as a spiritual reminder that there is purpose and meaning to our lives and helped to give people a sense of direction. Labyrinths are thought to encourage a feeling of calm and have been used as a meditation and prayer tool in many cultures over many centuries.

The earliest examples of the labyrinth spiral pattern have been found carved into stone, from Sardinia to Scandinavia, from Arizona to India to Africa. In Europe, these spiral carvings date from the late Bronze Age. The Native American Pima tribe wove baskets with a circular labyrinth design that depicted their own cosmology. In Ancient Greece, the labyrinth spiral was used on coins around four thousand years ago. Labyrinths made of mosaics were commonly found in bathhouses, villas and tombs throughout the Roman Empire.

In Northern Europe, there were actual physical labyrinths designed for walking on. These were cut into the turf or grass, usually in a circular pattern. Eleven examples of turf labyrinths survive today, including the largest one at Saffron Walden, England, which used to have a large tree in the middle of it.

More recently labyrinths have experienced something of a revival. Some believe that walking a labyrinth promotes healing and mindfulness, and there are those who believe in its emotional and physical benefits, which include slower breathing and a restored sense of balance and perspective. Walking labyrinths are now being built in wellness centres, spas, and even in prisons. In some hospitals, patients who can't walk can have a paper 'finger labyrinth' brought to their bed. The science behind the theory is a little sketchy, but there are dozens of small-scale studies which support claims about the benefits of labyrinths. For example, one study found that walking a labyrinth provided short-term calming, relaxation, and relief from anxiety for Alzheimer's patients.`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 40, quote: "A maze is quite different as it is a kind of puzzle with an intricate network of paths." },
        { questionNumber: 32, timestampSeconds: 62, quote: "Entering a maze usually involves getting lost a few times before using logic to work out the pattern" },
        { questionNumber: 33, timestampSeconds: 78, quote: "The word 'maze' is believed to come from a Scandinavian word for a state of confusion." },
        { questionNumber: 34, timestampSeconds: 108, quote: "Labyrinths are thought to encourage a feeling of calm and have been used as a meditation and prayer tool" },
        { questionNumber: 35, timestampSeconds: 125, quote: "The earliest examples of the labyrinth spiral pattern have been found carved into stone" },
        { questionNumber: 36, timestampSeconds: 145, quote: "In Ancient Greece, the labyrinth spiral was used on coins around four thousand years ago." },
        { questionNumber: 37, timestampSeconds: 170, quote: "including the largest one at Saffron Walden, England, which used to have a large tree in the middle of it." },
        { questionNumber: 38, timestampSeconds: 195, quote: "emotional and physical benefits, which include slower breathing and a restored sense of balance" },
        { questionNumber: 39, timestampSeconds: 215, quote: "patients who can't walk can have a paper 'finger labyrinth' brought to their bed." },
        { questionNumber: 40, timestampSeconds: 235, quote: "walking a labyrinth provided short-term calming, relaxation, and relief from anxiety for Alzheimer's patients." },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-10 (Notes Completion)
    {
      id: 'c17-l1-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `Buckworth Conservation Group

Regular activities

Beach
• making sure the beach does not have [[1]] on it
• no [[2]]

Nature reserve
• maintaining paths
• nesting boxes for birds installed
• next task is taking action to attract [[3]] to the place
• identifying types of [[4]]
• building a new [[5]]

Forthcoming events

Saturday
• meet at Dunsmore Beach car park
• walk across the sands and reach the [[6]]
• take a picnic
• wear appropriate [[7]]

Woodwork session
• suitable for [[8]] to participate in
• making [[9]] out of wood
• 17th, from 10 a.m. to 3 p.m.
• cost of session (no camping): £[[10]]`,
      questions: [
        {
          id: 'c17-l1-q1',
          questionNumber: 1,
          prompt: 'making sure the beach does not have [1] on it',
          answerKey: 'litter',
          acceptedAlternatives: ['litter', 'rubbish'],
          explanation: "Peter explains: 'One of the regular ones is trying to keep the beach free of litter.'",
          transcriptExcerpt: "One of the regular ones is trying to keep the beach free of litter.",
          audioTimestampSeconds: 20,
        },
        {
          id: 'c17-l1-q2',
          questionNumber: 2,
          prompt: 'no [2]',
          answerKey: 'dogs',
          acceptedAlternatives: ['dogs'],
          explanation: "When Jan asks 'Is it OK to take dogs?', Peter replies: 'I'm afraid not, as they're banned from the beach itself.'",
          transcriptExcerpt: "Is it OK to take dogs? I'm afraid not, as they're banned from the beach itself.",
          audioTimestampSeconds: 32,
        },
        {
          id: 'c17-l1-q3',
          questionNumber: 3,
          prompt: 'next task is taking action to attract [3] to the place',
          answerKey: 'insects',
          acceptedAlternatives: ['insects'],
          explanation: "Peter notes: 'next we're going to work on encouraging insects.'",
          transcriptExcerpt: "next we're going to work on encouraging insects.",
          audioTimestampSeconds: 48,
        },
        {
          id: 'c17-l1-q4',
          questionNumber: 4,
          prompt: 'identifying types of [4]',
          answerKey: 'butterflies',
          acceptedAlternatives: ['butterflies'],
          explanation: "Peter says: 'Then we're looking into ways of identifying different types of butterflies.'",
          transcriptExcerpt: "Then we're looking into ways of identifying different types of butterflies.",
          audioTimestampSeconds: 58,
        },
        {
          id: 'c17-l1-q5',
          questionNumber: 5,
          prompt: 'building a new [5]',
          answerKey: 'wall',
          acceptedAlternatives: ['wall'],
          explanation: "Peter adds: 'And we also need to build a new wall. Part of the old one collapsed during the winter storms.'",
          transcriptExcerpt: "And we also need to build a new wall. Part of the old one collapsed during the winter storms.",
          audioTimestampSeconds: 66,
        },
        {
          id: 'c17-l1-q6',
          questionNumber: 6,
          prompt: 'walk across the sands and reach the [6]',
          answerKey: 'island',
          acceptedAlternatives: ['island'],
          explanation: "Peter tells Jan: 'walk across the sands and reach the island. There's an old chapel there.'",
          transcriptExcerpt: "walk across the sands and reach the island.",
          audioTimestampSeconds: 78,
        },
        {
          id: 'c17-l1-q7',
          questionNumber: 7,
          prompt: 'wear appropriate [7]',
          answerKey: 'boots',
          acceptedAlternatives: ['boots'],
          explanation: "Peter instructs: 'make sure you wear appropriate boots, because the ground can be muddy.'",
          transcriptExcerpt: "make sure you wear appropriate boots, because the ground can be muddy.",
          audioTimestampSeconds: 90,
        },
        {
          id: 'c17-l1-q8',
          questionNumber: 8,
          prompt: 'suitable for [8] to participate in',
          answerKey: 'beginners',
          acceptedAlternatives: ['beginners'],
          explanation: "Regarding the woodwork session, Peter says: 'It's designed for beginners, so you don't need any previous experience.'",
          transcriptExcerpt: "It's designed for beginners, so you don't need any previous experience.",
          audioTimestampSeconds: 104,
        },
        {
          id: 'c17-l1-q9',
          questionNumber: 9,
          prompt: 'making [9] out of wood',
          answerKey: 'spoons',
          acceptedAlternatives: ['spoons', 'wooden spoons'],
          explanation: "Peter clarifies: 'You'll be learning how to make things like wooden spoons out of local wood.'",
          transcriptExcerpt: "You'll be learning how to make things like wooden spoons out of local wood.",
          audioTimestampSeconds: 114,
        },
        {
          id: 'c17-l1-q10',
          questionNumber: 10,
          prompt: 'cost of session (no camping): £[10]',
          answerKey: '35',
          acceptedAlternatives: ['35', 'thirty five', 'thirty-five'],
          explanation: "Peter confirms: 'It's 35 pounds for the session, which includes all the materials and tools.'",
          transcriptExcerpt: "It's 35 pounds for the session, which includes all the materials and tools.",
          audioTimestampSeconds: 125,
        },
      ],
    },

    // PART 2: Questions 11-14 (Multiple Choice)
    {
      id: 'c17-l1-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 11–14',
      instructions: 'Choose the correct letter, A, B or C.\nBoat trip round Tasmania',
      startQuestionNumber: 11,
      endQuestionNumber: 14,
      questions: [
        {
          id: 'c17-l1-q11',
          questionNumber: 11,
          prompt: 'What is the maximum number of people who can stand on each side of the boat?',
          options: MC_Q11_OPTIONS,
          answerKey: 'A',
          explanation: "Lou explains: 'if there are more than nine people on either side of the boat, we'll move some of you over, otherwise all eighteen of us will end up in the sea!' Therefore, the maximum number on each side is 9 (A).",
          transcriptExcerpt: "if there are more than nine people on either side of the boat, we'll move some of you over",
          audioTimestampSeconds: 22,
        },
        {
          id: 'c17-l1-q12',
          questionNumber: 12,
          prompt: 'What colour are the tour boats?',
          options: MC_Q12_OPTIONS,
          answerKey: 'C',
          explanation: "Lou states: 'They used to be jet black, but our new ones now have these comfortable dark red seats and a light-green exterior', so the boats are light green (C).",
          transcriptExcerpt: "our new ones now have these comfortable dark red seats and a light-green exterior",
          audioTimestampSeconds: 40,
        },
        {
          id: 'c17-l1-q13',
          questionNumber: 13,
          prompt: "Which lunchbox is suitable for someone who doesn't eat meat or fish?",
          options: MC_Q13_OPTIONS,
          answerKey: 'B',
          explanation: "Lou says Lunchbox 1 has ham (meat) and Lunchbox 3 has tuna (fish), whereas 'Lunchbox 2 contains a cheddar cheese roll', which is suitable for someone who doesn't eat meat or fish (B).",
          transcriptExcerpt: "Lunchbox 2 contains a cheddar cheese roll",
          audioTimestampSeconds: 58,
        },
        {
          id: 'c17-l1-q14',
          questionNumber: 14,
          prompt: 'What should people do with their litter?',
          options: MC_Q14_OPTIONS,
          answerKey: 'B',
          explanation: "Lou notes: 'We don't have any bins to put litter in, but Jess, myself or Ray, our other guide, will collect it from you after lunch and put it all in a large plastic sack.' This means passengers hand it to a member of staff (B).",
          transcriptExcerpt: "Jess, myself or Ray, our other guide, will collect it from you after lunch and put it all in a large plastic sack.",
          audioTimestampSeconds: 80,
        },
      ],
    },

    // PART 2: Questions 15-16 (Multiple Choice - Pick 2)
    {
      id: 'c17-l1-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 15 and 16',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO features of the lighthouse does Lou mention?',
      startQuestionNumber: 15,
      endQuestionNumber: 16,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q15_OPTIONS,
      questions: [
        multiQuestion(
          'c17-l1-q15',
          15,
          'Which TWO features of the lighthouse does Lou mention? (First choice)',
          MC_Q15_OPTIONS,
          ['A', 'D'],
          "Lou mentions why it was built ('to protect sailors as a number of shipwrecks had led to significant loss of life', A) and who staffed it ('These workers were mainly prison convicts until the middle of that century when ordinary families... took over', D).",
          "It was built in 1838 to protect sailors as a number of shipwrecks had led to significant loss of life... These workers were mainly prison convicts until the middle of that century when ordinary families willing to live in such circumstances took over.",
          105
        ),
        multiQuestion(
          'c17-l1-q16',
          16,
          'Which TWO features of the lighthouse does Lou mention? (Second choice)',
          MC_Q15_OPTIONS,
          ['A', 'D'],
          "Lou mentions why it was built ('to protect sailors as a number of shipwrecks had led to significant loss of life', A) and who staffed it ('These workers were mainly prison convicts until the middle of that century when ordinary families... took over', D).",
          "It was built in 1838 to protect sailors as a number of shipwrecks had led to significant loss of life... These workers were mainly prison convicts until the middle of that century when ordinary families willing to live in such circumstances took over.",
          125
        ),
      ],
    },

    // PART 2: Questions 17-18 (Multiple Choice - Pick 2)
    {
      id: 'c17-l1-g4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 17 and 18',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO types of creature might come close to the boat?',
      startQuestionNumber: 17,
      endQuestionNumber: 18,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q17_OPTIONS,
      questions: [
        multiQuestion(
          'c17-l1-q17',
          17,
          'Which TWO types of creature might come close to the boat? (First choice)',
          MC_Q17_OPTIONS,
          ['B', 'C'],
          "Lou mentions that fur seals ('don't be surprised if one pops up right in front of you', B) and dolphins ('can sometimes approach on their own or in groups as they ride the waves beside us', C) might come close to the boat.",
          "When we get to the rocky area inhabited by fur seals... don't be surprised if one pops up right in front of you... Dolphins, on the other hand, can sometimes approach on their own or in groups as they ride the waves beside us.",
          150
        ),
        multiQuestion(
          'c17-l1-q18',
          18,
          'Which TWO types of creature might come close to the boat? (Second choice)',
          MC_Q17_OPTIONS,
          ['B', 'C'],
          "Lou mentions that fur seals ('don't be surprised if one pops up right in front of you', B) and dolphins ('can sometimes approach on their own or in groups as they ride the waves beside us', C) might come close to the boat.",
          "When we get to the rocky area inhabited by fur seals... don't be surprised if one pops up right in front of you... Dolphins, on the other hand, can sometimes approach on their own or in groups as they ride the waves beside us.",
          168
        ),
      ],
    },

    // PART 2: Questions 19-20 (Multiple Choice - Pick 2)
    {
      id: 'c17-l1-g5',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 19 and 20',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO points does Lou make about the caves?',
      startQuestionNumber: 19,
      endQuestionNumber: 20,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q19_OPTIONS,
      questions: [
        multiQuestion(
          'c17-l1-q19',
          19,
          'Which TWO points does Lou make about the caves? (First choice)',
          MC_Q19_OPTIONS,
          ['D', 'E'],
          "Lou states that 'They can only be approached by sea' (cannot be reached on foot, E) and 'our guide will explain what is inside the caves as we approach them' (someone will explain what is inside them, D).",
          "They can only be approached by sea... our guide will explain what is inside the caves as we approach them.",
          185
        ),
        multiQuestion(
          'c17-l1-q20',
          20,
          'Which TWO points does Lou make about the caves? (Second choice)',
          MC_Q19_OPTIONS,
          ['D', 'E'],
          "Lou states that 'They can only be approached by sea' (cannot be reached on foot, E) and 'our guide will explain what is inside the caves as we approach them' (someone will explain what is inside them, D).",
          "They can only be approached by sea... our guide will explain what is inside the caves as we approach them.",
          198
        ),
      ],
    },

    // PART 3: Questions 21-26 (Multiple Choice)
    {
      id: 'c17-l1-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 21–26',
      instructions: 'Choose the correct letter, A, B or C.\nWork experience for veterinary science students',
      startQuestionNumber: 21,
      endQuestionNumber: 26,
      questions: [
        {
          id: 'c17-l1-q21',
          questionNumber: 21,
          prompt: 'What problem did both Diana and Tim have when arranging their work experience?',
          options: MC_Q21_OPTIONS,
          answerKey: 'A',
          explanation: "Diana says: 'finding the right sort of farm to apply to wasn't easy', Tim agrees: 'I found mine through a friend of my mother's. But it wasn't easy', and Diana confirms: 'making initial contact with suitable farms was tricky for both of us' (A).",
          transcriptExcerpt: "finding the right sort of farm to apply to wasn't easy... making initial contact with suitable farms was tricky for both of us.",
          audioTimestampSeconds: 30,
        },
        {
          id: 'c17-l1-q22',
          questionNumber: 22,
          prompt: 'Tim was pleased to be able to help',
          options: MC_Q22_OPTIONS,
          answerKey: 'B',
          explanation: "Tim recalls: 'I was up most of one night helping a sheep deliver a lamb... It wasn't a straightforward birth, the sheep was having difficulty giving birth, but I managed' (B).",
          transcriptExcerpt: "It wasn't a straightforward birth, the sheep was having difficulty giving birth, but I managed.",
          audioTimestampSeconds: 52,
        },
        {
          id: 'c17-l1-q23',
          questionNumber: 23,
          prompt: 'Diana says the sheep on her farm',
          options: MC_Q23_OPTIONS,
          answerKey: 'B',
          explanation: "When Tim asks 'So were they bred for their meat mostly?', Diana replies: 'Yes, they're quite big and solid, mainly reared for their meat' (B).",
          transcriptExcerpt: "Yes, they're quite big and solid, mainly reared for their meat.",
          audioTimestampSeconds: 78,
        },
        {
          id: 'c17-l1-q24',
          questionNumber: 24,
          prompt: 'What did the students learn about adding supplements to chicken feed?',
          options: MC_Q24_OPTIONS,
          answerKey: 'A',
          explanation: "Diana says: 'The farmer said those supplements shouldn't just be given routinely – these should only be given if specially needed, for instance if birds are showing signs of illness', and Tim agrees: 'Exactly' (A).",
          transcriptExcerpt: "these should only be given if specially needed, for instance if birds are showing signs of illness.",
          audioTimestampSeconds: 110,
        },
        {
          id: 'c17-l1-q25',
          questionNumber: 25,
          prompt: 'What happened when Diana was working with dairy cows?',
          options: MC_Q25_OPTIONS,
          answerKey: 'C',
          explanation: "Diana admits: 'Some cows had been treated with antibiotics... But I got mixed up, and I poured some milk from the wrong cow in with the milk for humans, so the whole lot had to be thrown away. I made a terrible mistake when storing milk' (C).",
          transcriptExcerpt: "I poured some milk from the wrong cow in with the milk for humans, so the whole lot had to be thrown away. I made a terrible mistake when storing milk.",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c17-l1-q26',
          questionNumber: 26,
          prompt: 'What did both farmers mention about vets and farming?',
          options: MC_Q26_OPTIONS,
          answerKey: 'C',
          explanation: "Tim mentions: 'My farmer said much the same – that vets are good on general care, but some jobs could easily be done by the farmer rather than by a vet', and Diana agrees: 'Exactly' (C).",
          transcriptExcerpt: "vets are good on general care, but some jobs could easily be done by the farmer rather than by a vet.",
          audioTimestampSeconds: 175,
        },
      ],
    },

    // PART 3: Questions 27-30 (Matching)
    {
      id: 'c17-l1-g7',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 27–30',
      instructions: 'What opinion do the students give about each of the following modules on their course?\nChoose FOUR answers from the box and write the correct letter, A–F, next to Questions 27–30.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      optionsList: MATCHING_Q27_OPTIONS,
      questions: [
        {
          id: 'c17-l1-q27',
          questionNumber: 27,
          prompt: 'Medical terminology',
          options: MATCHING_Q27_OPTIONS,
          answerKey: 'A',
          explanation: "Tim says: 'Well, I thought that would be hard, but I found it quite straightforward. I definitely found this easier than expected' (A).",
          transcriptExcerpt: "Well, I thought that would be hard, but I found it quite straightforward. I definitely found this easier than expected.",
          audioTimestampSeconds: 198,
        },
        {
          id: 'c17-l1-q28',
          questionNumber: 28,
          prompt: 'Diet and nutrition',
          options: MATCHING_Q27_OPTIONS,
          answerKey: 'E',
          explanation: "Tim states: 'I was really shocked at something I learned on this module about animal digestion' (E).",
          transcriptExcerpt: "I was really shocked at something I learned on this module about animal digestion.",
          audioTimestampSeconds: 212,
        },
        {
          id: 'c17-l1-q29',
          questionNumber: 29,
          prompt: 'Animal disease',
          options: MATCHING_Q27_OPTIONS,
          answerKey: 'F',
          explanation: "Diana says: 'We were both really surprised how little is known about some aspects of this', and Tim confirms: 'I agree completely' (F).",
          transcriptExcerpt: "We were both really surprised how little is known about some aspects of this. I agree completely.",
          audioTimestampSeconds: 228,
        },
        {
          id: 'c17-l1-q30',
          questionNumber: 30,
          prompt: 'Wildlife medication',
          options: MATCHING_Q27_OPTIONS,
          answerKey: 'C',
          explanation: "Diana says: 'It gave us a good idea of what to expect in the field. I may do some further study on this later on' (C).",
          transcriptExcerpt: "It gave us a good idea of what to expect in the field. I may do some further study on this later on.",
          audioTimestampSeconds: 245,
        },
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c17-l1-g8',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Labyrinths

Definition
• a winding spiral path leading to a central area

Labyrinths compared with mazes
• Mazes are a type of [[31]]
  – [[32]] is needed to navigate through a maze
  – the word 'maze' is derived from a word meaning a feeling of [[33]]
• Labyrinths represent a journey through life
  – they have frequently been used in [[34]] and prayer

Early history of labyrinths
• Spiral designs have been found on [[35]] in many parts of the world
• The Pima tribe wove baskets with a circular labyrinth design
• Ancient Greeks used labyrinths on [[36]]
• Walking labyrinths:
  – the largest surviving turf labyrinth once had a big [[37]] at its centre

Recent research into the benefits of labyrinths
• Walking labyrinths has had positive results on health
  – physical benefits include a reduction in [[38]] rate
  – patients who cannot walk can use 'finger labyrinths' made from [[39]]
  – research has shown that Alzheimer's sufferers experience less [[40]]`,
      questions: [
        {
          id: 'c17-l1-q31',
          questionNumber: 31,
          prompt: 'Mazes are a type of [31]',
          answerKey: 'puzzle',
          acceptedAlternatives: ['puzzle'],
          explanation: "The speaker explains: 'A maze is quite different as it is a kind of puzzle with an intricate network of paths.'",
          transcriptExcerpt: "A maze is quite different as it is a kind of puzzle with an intricate network of paths.",
          audioTimestampSeconds: 40,
        },
        {
          id: 'c17-l1-q32',
          questionNumber: 32,
          prompt: '[32] is needed to navigate through a maze',
          answerKey: 'logic',
          acceptedAlternatives: ['logic'],
          explanation: "The lecturer notes: 'Entering a maze usually involves getting lost a few times before using logic to work out the pattern'",
          transcriptExcerpt: "Entering a maze usually involves getting lost a few times before using logic to work out the pattern",
          audioTimestampSeconds: 62,
        },
        {
          id: 'c17-l1-q33',
          questionNumber: 33,
          prompt: "the word 'maze' is derived from a word meaning a feeling of [33]",
          answerKey: 'confusion',
          acceptedAlternatives: ['confusion'],
          explanation: "The lecturer states: 'The word 'maze' is believed to come from a Scandinavian word for a state of confusion.'",
          transcriptExcerpt: "The word 'maze' is believed to come from a Scandinavian word for a state of confusion.",
          audioTimestampSeconds: 78,
        },
        {
          id: 'c17-l1-q34',
          questionNumber: 34,
          prompt: 'they have frequently been used in [34] and prayer',
          answerKey: 'meditation',
          acceptedAlternatives: ['meditation'],
          explanation: "The lecturer says: 'Labyrinths are thought to encourage a feeling of calm and have been used as a meditation and prayer tool in many cultures over many centuries.'",
          transcriptExcerpt: "Labyrinths are thought to encourage a feeling of calm and have been used as a meditation and prayer tool",
          audioTimestampSeconds: 108,
        },
        {
          id: 'c17-l1-q35',
          questionNumber: 35,
          prompt: 'Spiral designs have been found on [35] in many parts of the world',
          answerKey: 'stone',
          acceptedAlternatives: ['stone'],
          explanation: "The lecturer explains: 'The earliest examples of the labyrinth spiral pattern have been found carved into stone, from Sardinia to Scandinavia, from Arizona to India to Africa.'",
          transcriptExcerpt: "The earliest examples of the labyrinth spiral pattern have been found carved into stone",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c17-l1-q36',
          questionNumber: 36,
          prompt: 'Ancient Greeks used labyrinths on [36]',
          answerKey: 'coins',
          acceptedAlternatives: ['coins'],
          explanation: "The lecturer notes: 'In Ancient Greece, the labyrinth spiral was used on coins around four thousand years ago.'",
          transcriptExcerpt: "In Ancient Greece, the labyrinth spiral was used on coins around four thousand years ago.",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c17-l1-q37',
          questionNumber: 37,
          prompt: 'the largest surviving turf labyrinth once had a big [37] at its centre',
          answerKey: 'tree',
          acceptedAlternatives: ['tree'],
          explanation: "The lecturer mentions: 'including the largest one at Saffron Walden, England, which used to have a large tree in the middle of it.'",
          transcriptExcerpt: "including the largest one at Saffron Walden, England, which used to have a large tree in the middle of it.",
          audioTimestampSeconds: 170,
        },
        {
          id: 'c17-l1-q38',
          questionNumber: 38,
          prompt: 'physical benefits include a reduction in [38] rate',
          answerKey: 'breathing',
          acceptedAlternatives: ['breathing'],
          explanation: "The lecturer highlights: 'emotional and physical benefits, which include slower breathing and a restored sense of balance and perspective.'",
          transcriptExcerpt: "emotional and physical benefits, which include slower breathing and a restored sense of balance",
          audioTimestampSeconds: 195,
        },
        {
          id: 'c17-l1-q39',
          questionNumber: 39,
          prompt: "patients who cannot walk can use 'finger labyrinths' made from [39]",
          answerKey: 'paper',
          acceptedAlternatives: ['paper'],
          explanation: "The lecturer notes: 'In some hospitals, patients who can't walk can have a paper 'finger labyrinth' brought to their bed.'",
          transcriptExcerpt: "patients who can't walk can have a paper 'finger labyrinth' brought to their bed.",
          audioTimestampSeconds: 215,
        },
        {
          id: 'c17-l1-q40',
          questionNumber: 40,
          prompt: "research has shown that Alzheimer's sufferers experience less [40]",
          answerKey: 'anxiety',
          acceptedAlternatives: ['anxiety'],
          explanation: "The lecturer concludes: 'one study found that walking a labyrinth provided short-term calming, relaxation, and relief from anxiety for Alzheimer's patients.'",
          transcriptExcerpt: "walking a labyrinth provided short-term calming, relaxation, and relief from anxiety for Alzheimer's patients.",
          audioTimestampSeconds: 235,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 17 Academic Listening Test 1',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c17_test1_part1.mp3', durationSeconds: 180 },
        { partNumber: 2, audioUrl: '/audio/listening/c17_test1_part2.mp3', durationSeconds: 220 },
        { partNumber: 3, audioUrl: '/audio/listening/c17_test1_part3.mp3', durationSeconds: 280 },
        { partNumber: 4, audioUrl: '/audio/listening/c17_test1_part4.mp3', durationSeconds: 215 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge17ListeningTest1(authorId?: string) {
  const data = getCambridge17ListeningTest1Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 17 Listening Test 1 validation failed: ${validationErrors.join('; ')}`);
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
