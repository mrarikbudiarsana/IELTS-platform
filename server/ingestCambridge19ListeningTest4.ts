import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MATCHING_Q15_OPTIONS = [
  { key: 'A', text: 'a lack of confidence' },
  { key: 'B', text: 'a dislike of running' },
  { key: 'C', text: 'a lack of time' },
];

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'There is a risk of serious injury.' },
  { key: 'B', text: 'They are unsuitable for certain age groups.' },
  { key: 'C', text: 'They are unsuitable for people with health issues.' },
  { key: 'D', text: 'It is difficult to stay motivated.' },
  { key: 'E', text: 'There is a lack of individual support.' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'doing two runs a week' },
  { key: 'B', text: 'running in the evening' },
  { key: 'C', text: 'going on runs with a friend' },
  { key: 'D', text: 'listening to music during runs' },
  { key: 'E', text: 'running very slowly' },
];

const MATCHING_Q26_OPTIONS = [
  { key: 'A', text: 'near the entrance' },
  { key: 'B', text: 'in the attic' },
  { key: 'C', text: 'at the back of the shop' },
  { key: 'D', text: 'on a high shelf' },
  { key: 'E', text: 'near the stairs' },
  { key: 'F', text: 'in a specially designed space' },
  { key: 'G', text: 'within the café' },
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

export function getCambridge19ListeningTest4Data(): {
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
      id: 'c19-l4-p1',
      partNumber: 1,
      title: 'Part 1: First day at work',
      context: 'Charlotte is shown around the supermarket on her first day of work by Kaeden, her supervisor.',
      audioUrl: '/audio/listening/c19_test4_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `KAEDEN: Hello Charlotte. I'm Kaeden, one of the supervisors. Welcome to the team.
CHARLOTTE: Hi Aiden.
KAEDEN: It's Kaeden.
CHARLOTTE: I'm so sorry.
KAEDEN: Don't worry. People often get my name wrong; they never know how to spell it. It's K-A-E-D-E-N, in case you ever need to write it.
CHARLOTTE: I'll try and remember.
KAEDEN: So, there are a few practical things you need to sort out this morning. Then I'll show you what you're going to do today.
CHARLOTTE: The email I received said to go to the front desk, to show my letter of appointment and pick up my badge.
KAEDEN: You'll need that for the staffroom and other areas of the supermarket where shoppers aren't allowed. So, after you've finished at the front desk, I'll take you to the staffroom. Put your coat and rucksack in one of the lockers there. Take whichever one is free.
CHARLOTTE: Will I have a key?
KAEDEN: Yes. Try not to lose it. At the end of the day, leave it in the door for the next person to use.
CHARLOTTE: Will do.
KAEDEN: You also need to go to the HR department to see Tiffany. She's really helpful.
CHARLOTTE: I was told to bring my passport with me. HR need to take a note of the number in it.
KAEDEN: That's right. Or you can show your ID card.
CHARLOTTE: I don't have one of those.
KAEDEN: OK. Tiffany will give you a uniform. They have lots in different sizes, so you just tell her what you need. I won't come with you to HR - I've got to go and sort something else out. Problem with a bread slicer.
CHARLOTTE: Is the HR office near the staffroom?
KAEDEN: The staffroom's on the first floor, and HR are a couple of floors above that, on the third floor. There's a staircase outside the staffroom.
CHARLOTTE: OK.
KAEDEN: When you've finished with HR, come and find me in the bakery section of the shop.
CHARLOTTE: I'm looking forward to getting started.
KAEDEN: I'll just give you my phone number, in case you can't find me. Have you got your phone there?
CHARLOTTE: Yes ... OK, ready.
KAEDEN: It's 0412 665 903.
CHARLOTTE: OK, done.
KAEDEN: So, Charlotte, your tasks today are in the bakery section, on the sushi counter, and on the meat and fish counters. The first job is to check sell-by dates on the bread and cakes. If any of the dates are today's, put a new price label on the packaging.
CHARLOTTE: What if any of the labels are yesterday's dates, or older? Do I throw those items away?
KAEDEN: Yes, but that shouldn't happen - we check the stock every day. When something needs a new price label, put a yellow one on the package, next to the original price.
CHARLOTTE: OK.
KAEDEN: After that, you'll go to the sushi takeaway counter. Will I be preparing boxes of food?
CHARLOTTE: For today, you'll just be helping the staff.
KAEDEN: You'll see lots of flat cardboard boxes at one end of the counter. Beneath those is where we keep the plastic boxes - we run out of those really quickly, so you should bring more from the storeroom.
CHARLOTTE: Is that my only task on the sushi counter?
KAEDEN: No. You also need to clean the area where they prepare the dishes. There are cloths and bottles of spray by the sink. Oh, and please make sure you clean that too.
CHARLOTTE: Sure. That's important, isn't it?
KAEDEN: Absolutely. But you mustn't wash up knives. You have to do some training before you're allowed to touch sharp objects. What should I do if there are any? Ask someone to put them in the dishwasher.
CHARLOTTE: OK, thanks. I don't want to get anything wrong.
KAEDEN: Don't worry. You'll be fine. And I'll be around to help. Right. Finally, the meat and fish counters. You need to clean the area where staff serve customers, including wiping the weighing scales.
CHARLOTTE: OK. Anything else?
KAEDEN: The fish is laid on ice, but when that starts to melt, you'll need to get more from the cold-room.
CHARLOTTE: I know the staff on the food counters wear a hat. Will that be the same for me?
KAEDEN: You won't be serving customers directly, so no. But make sure you put on thermal gloves when you take anything out of the cold-room. The temperature's low enough in there to get frostbite from touching things.
CHARLOTTE: Understood.`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 15, quote: "It's K-A-E-D-E-N, in case you ever need to write it." },
        { questionNumber: 2, timestampSeconds: 30, quote: "Put your coat and rucksack in one of the lockers there. Take whichever one is free." },
        { questionNumber: 3, timestampSeconds: 42, quote: "I was told to bring my passport with me. HR need to take a note of the number in it." },
        { questionNumber: 4, timestampSeconds: 52, quote: "Tiffany will give you a uniform. They have lots in different sizes" },
        { questionNumber: 5, timestampSeconds: 65, quote: "and HR are a couple of floors above that, on the third floor." },
        { questionNumber: 6, timestampSeconds: 78, quote: "It's 0412 665 903." },
        { questionNumber: 7, timestampSeconds: 105, quote: "When something needs a new price label, put a yellow one on the package, next to the original price." },
        { questionNumber: 8, timestampSeconds: 125, quote: "Beneath those is where we keep the plastic boxes - we run out of those really quickly" },
        { questionNumber: 9, timestampSeconds: 155, quote: "The fish is laid on ice, but when that starts to melt, you'll need to get more from the cold-room." },
        { questionNumber: 10, timestampSeconds: 170, quote: "But make sure you put on thermal gloves when you take anything out of the cold-room." },
      ],
    },
    {
      id: 'c19-l4-p2',
      partNumber: 2,
      title: 'Part 2: Running coach podcast',
      context: 'Liz Fuller, a running coach from Compton Park Runners Club, gives tips for new runners and shares member experiences.',
      audioUrl: '/audio/listening/c19_test4_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `My name's Liz Fuller and I'm a running coach with Compton Park Runners Club. Welcome to my podcast. If you're thinking about taking up running - I'm here to help.
There are many training programmes available online which aim to help people build up to running 5 kilometres. Some of them are great and thousands of people of all ages are taking part in 5-kilometre races across the country as a result. People like them because they're easy to follow and don't push them too hard. However, they don't work for everyone - especially if you suffer from something like a heart condition or asthma, because they're aimed at people with average fitness and running ability. Another thing is that everyone is different - and if you have any specific questions related to your needs, there's no one to provide any answers.
I have a couple of simple tips I always give to new runners. I expect you've been told to run very slowly until your fitness increases - well, I find that can prevent progress. You should run at a speed that feels comfortable, but time yourself and try to run a bit faster each time. Listening to music can be very helpful - it takes your mind off things and helps your body get into a rhythm. I'd say that is better than running with a friend - especially as most people are competitive and that's not what you want when you're just starting. I don't think the time of day is especially important - some people are better in the evening, while others are morning people - but you need to be consistent, so aim to train regularly - twice a week is enough to start.
New members often say to me that they've been put off running either because they lack confidence, or they don't have time, or they think they dislike running. Ceri, for example, joined the club two years ago at the age of 40. She'd always enjoyed running at school but wasn't sure if she'd be able to do it. She was worried about being left behind and being the slowest runner. But she says she was made to feel so welcome she soon forgot all about that.
James had always hated the idea of running but a friend encouraged him to come along for a taster session and he hasn't looked back. He never misses a training session despite having a really demanding job.
Leo was worried about having to commit himself to training sessions every week and wasn't sure he'd be able to fit training into his busy schedule. But after experiencing a lot of stress at work he came along to us and gave it a go. Now he says he feels much more relaxed and he looks forward to his weekly run.
Mark is quite typical of our new members. He's never considered himself to be a sporty person and it was only when he retired that he decided to take up the challenge of trying to run 5 kilometres. It took him months to find the courage to contact us but felt reassured immediately as there were other people his age who were only just taking up running for the first time.
My own journey hasn't been easy. I did my first marathon when I was 37, after having had two kids. My husband had been running marathons for years, but I never dreamed I'd be doing one with him. I managed to complete it in four hours, but I felt like giving up halfway through - it was only the support of the spectators that kept me going.
I do think signing up for a race of whatever length is motivating - whether it's 5K or 25K - because it's good to have something to work towards and it gives you a sense of achievement. I did my first 10K after only six months, which was certainly very challenging and not something I'd necessarily recommend. But after you've been training for a few weeks, it's worth putting your name down for a 5K - some people find they only need a few practice runs before taking part in a race, but I'd give yourself a couple of months at least.`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 25, quote: "However, they don't work for everyone - especially if you suffer from something like a heart condition or asthma" },
        { questionNumber: 12, timestampSeconds: 35, quote: "and if you have any specific questions related to your needs, there's no one to provide any answers." },
        { questionNumber: 13, timestampSeconds: 50, quote: "Listening to music can be very helpful - it takes your mind off things and helps your body get into a rhythm." },
        { questionNumber: 14, timestampSeconds: 65, quote: "so aim to train regularly - twice a week is enough to start." },
        { questionNumber: 15, timestampSeconds: 85, quote: "She was worried about being left behind and being the slowest runner." },
        { questionNumber: 16, timestampSeconds: 100, quote: "James had always hated the idea of running but a friend encouraged him to come along" },
        { questionNumber: 17, timestampSeconds: 115, quote: "wasn't sure he'd be able to fit training into his busy schedule." },
        { questionNumber: 18, timestampSeconds: 130, quote: "It took him months to find the courage to contact us" },
        { questionNumber: 19, timestampSeconds: 155, quote: "I managed to complete it in four hours, but I felt like giving up halfway through" },
        { questionNumber: 20, timestampSeconds: 175, quote: "But after you've been training for a few weeks, it's worth putting your name down for a 5K" },
      ],
    },
    {
      id: 'c19-l4-p3',
      partNumber: 3,
      title: 'Part 3: Book conservation and grandfather’s bookshop',
      context: 'Jane talks to Kieran about packing and caring for books, and describes her grandfather’s bookshop.',
      audioUrl: '/audio/listening/c19_test4_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `KIERAN: So Jane - you'll be off to Denmark soon to do your work placement.
JANE: Yes, I'm really looking forward to it and I've just started packing up all my books to put in storage.
KIERAN: Well, I hope they don't get spoilt.
JANE: It's OK - my grandfather works in a bookshop and he told me how to pack them.
KIERAN: Oh, that's helpful.
JANE: He says you have to support the spine otherwise the paper can come away from the cover.
KIERAN: Yeah - that's obvious.
JANE: He also told me to pack them flat in the box not on their side - again because they can bend and if you leave them like that for, say, a year, it's quite hard to get them back to their normal shape.
KIERAN: Well, it's pretty clear that ruins them, but a lot of people just can't be bothered to protect their books. He always says it's such a shame that publishers don't use better-quality paper.
JANE: It's the acid in the paper that causes the problem, isn't it?
KIERAN: Yeah - that's why old books go yellow. You know some of the books my grandfather's given me are like that already.
JANE: Oh I should dump them really if they're going to deteriorate further, but I'd feel bad. They'll always remind me of him. He's quite a collector, you know.
KIERAN: Well, if they're important to you...
JANE: Yeah - I'd regret just throwing them away. You know, maybe it's because I was taught to treasure books ... but I hate seeing students force open the pages of paperbacks. They press so hard they end up breaking the spine.
KIERAN: I know, but unfortunately, paperbacks aren't designed to last a long time and people know that. Hardbacks aren't quite as weak.
JANE: Yeah, they're different, I suppose. But I still don't think people value hardbacks like they used to.
KIERAN: Well, they aren't decorative, are they, like other objects. Plus, nowadays, people don't keep them out on shelves as much as they used to.
JANE: That's such a pity. When I visit someone - if they have, say, a colourful book on a table, it's the first thing I'm drawn to.
KIERAN: I agree - and book covers can be a work of art in themselves. Some are really eye-catching.
JANE: I've always been taught to handle books carefully. If you watch someone take a book off a shelf, well, they usually do it wrong. Ah, my grandfather says, you should put your hand right over the top of the book or if you can't do that, pull the other books on the shelf aside so that you can hold the whole cover.
KIERAN: When did you learn all this?
JANE: He watched me pull a heavy book off the shelf when I was small, and it fell on the floor and broke apart.
KIERAN: Oh dear!
JANE: I can still remember it! You know what I really like?
KIERAN: What?
JANE: The smell of new books.
KIERAN: Me too. My parents used to laugh at me when I was a kid because I loved putting books up to my nose. Almost as much as reading them!
JANE: I guess we're lucky, we can buy them. My grandfather stocks second-hand books as well as new ones and they don't smell quite as good.
KIERAN: I'd love to have a bookshop like your grandfather. What's it like?
JANE: Well, it's quite big - it's got two floors and an attic, and he stocks all kinds of books really.
KIERAN: I guess he treasures things like first editions and other rare books.
JANE: Yeah - you might think he'd keep those in the attic or somewhere.
KIERAN: So they'd be hidden?
JANE: Yeah. But he likes people to know that he has them. So, he puts them out in the shop but makes sure you need a ladder to get them.
KIERAN: Right. That would prevent any thefts!
JANE: Uh-huh.
KIERAN: Does he stock books for children?
JANE: He does. He particularly likes to encourage kids to read; he always says that he used to sit under the stairs as a child with a pile of books and read them all.
KIERAN: Is that where he keeps them, then?
JANE: Not exactly - he's got a dedicated area on the ground floor with cushions so that parents can enter with their toddlers, go there and spend some time reading.
KIERAN: Oh cool. And then there's a place for pushchairs by the front door. And a café if anyone needs refreshments.
JANE: That's good to know. As I said, it's a big shop and there's a storage area out the back as well.
KIERAN: Oh, what does he keep there? Books he wants to throw away?
JANE: He hardly ever throws anything away - he just leaves unwanted books by the front door for customers to take.
KIERAN: Well, that's very nice.
JANE: Yeah - and books people or institutions have requested, they all go at the far end. Oh. He thinks it's best to keep these out of the main shopping area as they're boxed and new.
KIERAN: Did you get your coursebooks from him?
JANE: Naturally. He stocks books for a lot of the colleges. He used to keep these books on the first floor, but now there's a new university in my hometown, he's moved them downstairs to attract the students. They're actually part of the coffee shop, on low shelves all around it.
KIERAN: Pretty central then. You'll have to take me there some time!`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 20, quote: "He says you have to support the spine ... Yeah - that's obvious ... Well, it's pretty clear that ruins them" },
        { questionNumber: 22, timestampSeconds: 40, quote: "They'll always remind me of him ... Yeah - I'd regret just throwing them away." },
        { questionNumber: 23, timestampSeconds: 65, quote: "if they have, say, a colourful book on a table, it's the first thing I'm drawn to. I agree" },
        { questionNumber: 24, timestampSeconds: 85, quote: "He watched me pull a heavy book off the shelf when I was small, and it fell on the floor and broke apart." },
        { questionNumber: 25, timestampSeconds: 105, quote: "I guess we're lucky, we can buy them. My grandfather stocks second-hand books as well as new ones" },
        { questionNumber: 26, timestampSeconds: 130, quote: "So, he puts them out in the shop but makes sure you need a ladder to get them." },
        { questionNumber: 27, timestampSeconds: 145, quote: "he's got a dedicated area on the ground floor with cushions so that parents can enter with their toddlers, go there and spend some time reading." },
        { questionNumber: 28, timestampSeconds: 165, quote: "he just leaves unwanted books by the front door for customers to take." },
        { questionNumber: 29, timestampSeconds: 180, quote: "and books people or institutions have requested, they all go at the far end." },
        { questionNumber: 30, timestampSeconds: 195, quote: "They're actually part of the coffee shop, on low shelves all around it." },
      ],
    },
    {
      id: 'c19-l4-p4',
      partNumber: 4,
      title: 'Part 4: Tree planting and reforestation',
      context: 'A lecture on large-scale reforestation projects, local biodiversity, and case studies from Thailand and Madagascar.',
      audioUrl: '/audio/listening/c19_test4_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Tree planting now dominates political and popular agendas and is often presented as an easy answer to the climate crisis, as well as a way for business corporations to offset their carbon emissions. But unfortunately, tree planting isn't as straightforward as some people think. When the wrong trees are planted in the wrong place, it can do considerably more damage than good, failing to help either people or the environment.
Reforestation projects are currently being undertaken on a huge scale in many countries and it's crucial that the right trees are selected. A mix of species should always be planted, typical of the local natural forest ecosystem and including rare and endangered species in order to create a rich ecosystem. It's important to avoid non-native species that could become invasive. Invasive species are a significant contributor to the current global biodiversity crisis and are often in competition with native species and may threaten their long-term survival.
Restoring biodiversity that will maximise carbon capture is key when reforesting an area, but ideally any reforestation project should have several goals. These could include selecting trees that can contribute to wildlife conservation, improve the availability of food for the local community and maintain the stability of soil systems. Meeting as many of these goals as possible, whilst doing no harm to local communities, native ecosystems and vulnerable species, is the sign of a highly successful tree-planting scheme.
To ensure the survival and resilience of a planted forest, it's vital to use tree seeds with appropriate levels of genetic diversity: the amount of genetic variation found within a species essential for their survival. Using seeds with low genetic diversity generally lowers the resilience of restored forests, which can make them vulnerable to disease and unable to adapt to climate change.
Choosing the right location for reforestation projects is as important as choosing the right trees. Ultimately, the best area for planting trees would be in formerly forested areas that are in poor condition. It's better to avoid non-forested landscapes such as natural grasslands, savannas or wetlands as these ecosystems already contribute greatly to capturing carbon. It would also be advantageous to choose an area where trees could provide other benefits, such as recreational spaces. Reforesting areas which are currently exploited for agriculture should be avoided as this often leads to other areas being deforested.
Large-scale reforestation projects require careful planning. Making the right decisions about where to plant trees depends on having the right information. Having detailed and up-to-date maps identifying high-priority areas for intervention is essential. Drone technology is a useful tool in helping to prioritise and monitor areas of degraded forest for restoration. In Brazil, it's being used to identify and quantify how parts of the Amazon are being devastated by human activities such as rearing cattle and illegal logging.
A good example of where the right trees were picked to achieve a restored forest is in Lampang Province in Northern Thailand. A previously forested site which had been degraded through mining was reforested by a cement company together with Chiang Mai University. After spreading 60 cm of topsoil, they planted 14 different native tree species which included several species of fig. Figs are a keystone species because of the critical role they play in maintaining wildlife populations. They are central to tropical reforestation projects as they accelerate the speed of the recovery process by attracting animals and birds which act as natural seed dispersers. This helps to promote diversity through the healthy regrowth of a wide range of plant species. Unlike the majority of fruit trees, figs bear fruit all year round, providing a reliable food source for many species. At this site, for example, after only three rainy seasons, monkeys started visiting to eat the fig fruits, naturally dispersing seeds through defecation.
Reforestation projects should always aim to make sure that local communities are consulted and involved in the decision-making process. The restoration of mangrove forests in Madagascar is an example of a project which has succeeded in creating real benefits for the community. Destruction of the mangrove forests had a terrible impact on plant and animal life, and also badly affected the fishing industry, which was a major source of employment for local people living in coastal areas.
The reforestation project involved hiring local people to plant and care for the new mangrove trees. Millions of mangrove trees have now been planted which has resulted in the return of a healthy aquatic ecosystem. The mangroves also act as a defence against the increased threat of flooding caused by climate change. What's more, the local economy is more stable and thousands more Madagascans are now able to send their children to school.`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 25, quote: "and are often in competition with native species and may threaten their long-term survival." },
        { questionNumber: 32, timestampSeconds: 45, quote: "improve the availability of food for the local community and maintain the stability of soil systems." },
        { questionNumber: 33, timestampSeconds: 65, quote: "which can make them vulnerable to disease and unable to adapt to climate change." },
        { questionNumber: 34, timestampSeconds: 85, quote: "Reforesting areas which are currently exploited for agriculture should be avoided" },
        { questionNumber: 35, timestampSeconds: 105, quote: "Having detailed and up-to-date maps identifying high-priority areas for intervention is essential." },
        { questionNumber: 36, timestampSeconds: 120, quote: "human activities such as rearing cattle and illegal logging." },
        { questionNumber: 37, timestampSeconds: 145, quote: "they accelerate the speed of the recovery process by attracting animals and birds" },
        { questionNumber: 38, timestampSeconds: 165, quote: "after only three rainy seasons, monkeys started visiting to eat the fig fruits" },
        { questionNumber: 39, timestampSeconds: 185, quote: "and also badly affected the fishing industry, which was a major source of employment" },
        { questionNumber: 40, timestampSeconds: 205, quote: "The mangroves also act as a defence against the increased threat of flooding caused by climate change." },
      ],
    },
  ];

  const mcOptions = (a: string, b: string, c: string) => [
    { key: 'A', text: a },
    { key: 'B', text: b },
    { key: 'C', text: c },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-6 (Notes Completion)
    {
      id: 'c19-l4-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–6',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `First day at work
Name of supervisor: [[1]]
Where to leave coat and bag: in staffroom - use [[2]]
See Tiffany in HR:
• to give [[3]] number
• to collect [[4]]
Location of HR office: on [[5]] floor
Supervisor's mobile number: [[6]]`,
      questions: [
        {
          id: 'c19-l4-q1',
          questionNumber: 1,
          prompt: 'Name of supervisor: [1]',
          answerKey: 'Kaeden',
          acceptedAlternatives: ['Kaeden', 'kaeden'],
          explanation: "Kaeden spells his name out: 'Don't worry. People often get my name wrong; they never know how to spell it. It's K-A-E-D-E-N, in case you ever need to write it.'",
          transcriptExcerpt: "It's K-A-E-D-E-N, in case you ever need to write it.",
          audioTimestampSeconds: 15,
        },
        {
          id: 'c19-l4-q2',
          questionNumber: 2,
          prompt: 'Where to leave coat and bag: in staffroom - use [2]',
          answerKey: 'lockers',
          acceptedAlternatives: ['lockers', 'locker'],
          explanation: "Kaeden instructs: 'Put your coat and rucksack in one of the lockers there. Take whichever one is free.'",
          transcriptExcerpt: "Put your coat and rucksack in one of the lockers there. Take whichever one is free.",
          audioTimestampSeconds: 30,
        },
        {
          id: 'c19-l4-q3',
          questionNumber: 3,
          prompt: 'to give [3] number',
          answerKey: 'passport',
          acceptedAlternatives: ['passport'],
          explanation: "Charlotte states: 'I was told to bring my passport with me. HR need to take a note of the number in it.'",
          transcriptExcerpt: "I was told to bring my passport with me. HR need to take a note of the number in it.",
          audioTimestampSeconds: 42,
        },
        {
          id: 'c19-l4-q4',
          questionNumber: 4,
          prompt: 'to collect [4]',
          answerKey: 'uniform',
          acceptedAlternatives: ['uniform'],
          explanation: "Kaeden tells Charlotte: 'Tiffany will give you a uniform. They have lots in different sizes, so you just tell her what you need.'",
          transcriptExcerpt: "Tiffany will give you a uniform. They have lots in different sizes, so you just tell her what you need.",
          audioTimestampSeconds: 52,
        },
        {
          id: 'c19-l4-q5',
          questionNumber: 5,
          prompt: 'Location of HR office: on [5] floor',
          answerKey: 'third',
          acceptedAlternatives: ['third', '3rd', '3'],
          explanation: "Kaeden explains: 'The staffroom's on the first floor, and HR are a couple of floors above that, on the third floor.'",
          transcriptExcerpt: "The staffroom's on the first floor, and HR are a couple of floors above that, on the third floor.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c19-l4-q6',
          questionNumber: 6,
          prompt: "Supervisor's mobile number: [6]",
          answerKey: '0412665903',
          acceptedAlternatives: ['0412665903', '0412 665 903', '0412 665903'],
          explanation: "Kaeden says: 'It's 0412 665 903.'",
          transcriptExcerpt: "It's 0412 665 903.",
          audioTimestampSeconds: 78,
        },
      ],
    },

    // PART 1: Questions 7-10 (Table Completion)
    {
      id: 'c19-l4-g2',
      partNumber: 1,
      questionType: 'table_completion',
      title: 'Questions 7–10',
      instructions: 'Complete the table below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 7,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      tableData: {
        headers: ['Section', 'Task 1', 'Task 2', 'Notes'],
        rows: [
          {
            cells: [
              { content: 'Bakery section' },
              { content: 'Check sell-by dates' },
              { content: 'Change price labels' },
              { content: 'Use [[7]] labels', isGap: true, questionNumber: 7 },
            ],
          },
          {
            cells: [
              { content: 'Sushi takeaway counter' },
              { content: 'Re-stock with [[8]] boxes if needed', isGap: true, questionNumber: 8 },
              { content: 'Wipe preparation area and clean the sink' },
              { content: 'Do not clean any knives' },
            ],
          },
          {
            cells: [
              { content: 'Meat and fish counters' },
              { content: 'Clean the serving area, including the weighing scales' },
              { content: 'Collect [[9]] for the fish from the cold-room', isGap: true, questionNumber: 9 },
              { content: 'Must wear special [[10]]', isGap: true, questionNumber: 10 },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c19-l4-q7',
          questionNumber: 7,
          prompt: 'Bakery section: Use [7] labels',
          answerKey: 'yellow',
          acceptedAlternatives: ['yellow'],
          explanation: "Kaeden specifies: 'When something needs a new price label, put a yellow one on the package, next to the original price.'",
          transcriptExcerpt: "When something needs a new price label, put a yellow one on the package, next to the original price.",
          audioTimestampSeconds: 105,
        },
        {
          id: 'c19-l4-q8',
          questionNumber: 8,
          prompt: 'Sushi takeaway counter: Re-stock with [8] boxes if needed',
          answerKey: 'plastic',
          acceptedAlternatives: ['plastic'],
          explanation: "Kaeden points out: 'Beneath those is where we keep the plastic boxes - we run out of those really quickly, so you should bring more from the storeroom.'",
          transcriptExcerpt: "Beneath those is where we keep the plastic boxes - we run out of those really quickly, so you should bring more from the storeroom.",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c19-l4-q9',
          questionNumber: 9,
          prompt: 'Meat and fish counters: Collect [9] for the fish from the cold-room',
          answerKey: 'ice',
          acceptedAlternatives: ['ice'],
          explanation: "Kaeden explains: 'The fish is laid on ice, but when that starts to melt, you'll need to get more from the cold-room.'",
          transcriptExcerpt: "The fish is laid on ice, but when that starts to melt, you'll need to get more from the cold-room.",
          audioTimestampSeconds: 155,
        },
        {
          id: 'c19-l4-q10',
          questionNumber: 10,
          prompt: 'Meat and fish counters: Must wear special [10]',
          answerKey: 'gloves',
          acceptedAlternatives: ['gloves'],
          explanation: "Kaeden warns: 'But make sure you put on thermal gloves when you take anything out of the cold-room. The temperature's low enough in there to get frostbite from touching things.'",
          transcriptExcerpt: "But make sure you put on thermal gloves when you take anything out of the cold-room.",
          audioTimestampSeconds: 170,
        },
      ],
    },

    // PART 2: Questions 11-12 (Multiple Choice - Pick 2)
    {
      id: 'c19-l4-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 11 and 12',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO problems with some training programmes for new runners does Liz mention?',
      startQuestionNumber: 11,
      endQuestionNumber: 12,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q11_OPTIONS,
      questions: [
        multiQuestion(
          'c19-l4-q11',
          11,
          'Which TWO problems with some training programmes for new runners does Liz mention?',
          MC_Q11_OPTIONS,
          ['C', 'E'],
          "Liz notes that online training programmes don't work for people who suffer from conditions like asthma or heart conditions (C - health issues), and there is no one to answer specific personal questions (E - lack of individual support).",
          "However, they don't work for everyone - especially if you suffer from something like a heart condition or asthma... and if you have any specific questions related to your needs, there's no one to provide any answers.",
          25
        ),
        multiQuestion(
          'c19-l4-q12',
          12,
          'Which TWO problems with some training programmes for new runners does Liz mention?',
          MC_Q11_OPTIONS,
          ['C', 'E'],
          "Liz notes that online training programmes don't work for people who suffer from conditions like asthma or heart conditions (C - health issues), and there is no one to answer specific personal questions (E - lack of individual support).",
          "However, they don't work for everyone - especially if you suffer from something like a heart condition or asthma... and if you have any specific questions related to your needs, there's no one to provide any answers.",
          35
        ),
      ],
    },

    // PART 2: Questions 13-14 (Multiple Choice - Pick 2)
    {
      id: 'c19-l4-g4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 13 and 14',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO tips does Liz recommend for new runners?',
      startQuestionNumber: 13,
      endQuestionNumber: 14,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q13_OPTIONS,
      questions: [
        multiQuestion(
          'c19-l4-q13',
          13,
          'Which TWO tips does Liz recommend for new runners?',
          MC_Q13_OPTIONS,
          ['A', 'D'],
          "Liz recommends listening to music because it helps your body get into a rhythm (D), and training consistently with twice a week being enough to start (A).",
          "Listening to music can be very helpful - it takes your mind off things and helps your body get into a rhythm... so aim to train regularly - twice a week is enough to start.",
          50
        ),
        multiQuestion(
          'c19-l4-q14',
          14,
          'Which TWO tips does Liz recommend for new runners?',
          MC_Q13_OPTIONS,
          ['A', 'D'],
          "Liz recommends listening to music because it helps your body get into a rhythm (D), and training consistently with twice a week being enough to start (A).",
          "Listening to music can be very helpful - it takes your mind off things and helps your body get into a rhythm... so aim to train regularly - twice a week is enough to start.",
          65
        ),
      ],
    },

    // PART 2: Questions 15-18 (Matching)
    {
      id: 'c19-l4-g5',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 15–18',
      instructions: 'What reason prevented each of the following members of the Compton Park Runners Club from joining until recently?\nChoose the correct letter, A, B, or C next to Questions 15–18.',
      startQuestionNumber: 15,
      endQuestionNumber: 18,
      optionReuseAllowed: true,
      optionsList: MATCHING_Q15_OPTIONS,
      questions: [
        {
          id: 'c19-l4-q15',
          questionNumber: 15,
          prompt: 'Ceri',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'A',
          explanation: "Ceri was worried about being left behind and being the slowest runner, showing a lack of confidence (A).",
          transcriptExcerpt: "She was worried about being left behind and being the slowest runner. But she says she was made to feel so welcome she soon forgot all about that.",
          audioTimestampSeconds: 85,
        },
        {
          id: 'c19-l4-q16',
          questionNumber: 16,
          prompt: 'James',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'B',
          explanation: "James had always hated the idea of running, which represents a dislike of running (B).",
          transcriptExcerpt: "James had always hated the idea of running but a friend encouraged him to come along for a taster session and he hasn't looked back.",
          audioTimestampSeconds: 100,
        },
        {
          id: 'c19-l4-q17',
          questionNumber: 17,
          prompt: 'Leo',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'C',
          explanation: "Leo was worried about fitting training sessions into his busy schedule with work, indicating a lack of time (C).",
          transcriptExcerpt: "Leo was worried about having to commit himself to training sessions every week and wasn't sure he'd be able to fit training into his busy schedule.",
          audioTimestampSeconds: 115,
        },
        {
          id: 'c19-l4-q18',
          questionNumber: 18,
          prompt: 'Mark',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'A',
          explanation: "Mark took months to find the courage to contact the club because he never considered himself sporty, reflecting a lack of confidence (A).",
          transcriptExcerpt: "He's never considered himself to be a sporty person... It took him months to find the courage to contact us but felt reassured immediately",
          audioTimestampSeconds: 130,
        },
      ],
    },

    // PART 2: Questions 19-20 (Multiple Choice)
    {
      id: 'c19-l4-g6',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 19 and 20',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 19,
      endQuestionNumber: 20,
      questions: [
        {
          id: 'c19-l4-q19',
          questionNumber: 19,
          prompt: 'What does Liz say about running her first marathon?',
          options: mcOptions(
            'It had always been her ambition.',
            'Her husband persuaded her to do it.',
            'She nearly gave up before the end.'
          ),
          answerKey: 'C',
          explanation: "Liz mentions: 'I managed to complete it in four hours, but I felt like giving up halfway through — it was only the support of the spectators that kept me going.'",
          transcriptExcerpt: "I managed to complete it in four hours, but I felt like giving up halfway through — it was only the support of the spectators that kept me going.",
          audioTimestampSeconds: 155,
        },
        {
          id: 'c19-l4-q20',
          questionNumber: 20,
          prompt: 'Liz says new runners should sign up for a race',
          options: mcOptions(
            'every six months.',
            'within a few weeks of taking up running.',
            'after completing several practice runs.'
          ),
          answerKey: 'B',
          explanation: "Liz suggests: 'But after you've been training for a few weeks, it's worth putting your name down for a 5K'.",
          transcriptExcerpt: "But after you've been training for a few weeks, it's worth putting your name down for a 5K",
          audioTimestampSeconds: 175,
        },
      ],
    },

    // PART 3: Questions 21-25 (Multiple Choice)
    {
      id: 'c19-l4-g7',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 21–25',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 21,
      endQuestionNumber: 25,
      questions: [
        {
          id: 'c19-l4-q21',
          questionNumber: 21,
          prompt: "Kieran thinks the packing advice given by Jane's grandfather is",
          options: mcOptions('common sense.', 'hard to follow.', 'over-protective.'),
          answerKey: 'A',
          explanation: "Kieran reacts to the advice by saying: 'Yeah — that's obvious' and 'Well, it's pretty clear that ruins them', showing he considers it common sense (A).",
          transcriptExcerpt: "He says you have to support the spine ... Yeah — that's obvious ... Well, it's pretty clear that ruins them",
          audioTimestampSeconds: 20,
        },
        {
          id: 'c19-l4-q22',
          questionNumber: 22,
          prompt: 'How does Jane feel about the books her grandfather has given her?',
          options: mcOptions('They are not worth keeping.', 'They should go to a collector.', 'They have sentimental value for her.'),
          answerKey: 'C',
          explanation: "Jane says: 'Oh I should dump them really if they're going to deteriorate further, but I'd feel bad. They'll always remind me of him.' This indicates sentimental value (C).",
          transcriptExcerpt: "They'll always remind me of him. He's quite a collector, you know ... Yeah — I'd regret just throwing them away.",
          audioTimestampSeconds: 40,
        },
        {
          id: 'c19-l4-q23',
          questionNumber: 23,
          prompt: 'Jane and Kieran agree that hardback books should be',
          options: mcOptions('put out on display.', 'given as gifts to visitors.', 'more attractively designed.'),
          answerKey: 'A',
          explanation: "Kieran laments that people don't keep books out on shelves anymore, and Jane agrees, noting she loves seeing colourful books displayed on tables (A).",
          transcriptExcerpt: "Plus, nowadays, people don't keep them out on shelves as much as they used to. That's such a pity. When I visit someone — if they have, say, a colourful book on a table, it's the first thing I'm drawn to. I agree",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c19-l4-q24',
          questionNumber: 24,
          prompt: 'While talking about taking a book from a shelf, Jane',
          options: mcOptions(
            'describes the mistakes other people make doing it.',
            'reflects on a significant childhood experience.',
            'explains why some books are easier to remove than others.'
          ),
          answerKey: 'B',
          explanation: "Jane recalls: 'He watched me pull a heavy book off the shelf when I was small, and it fell on the floor and broke apart. Oh dear! I can still remember it!' (B).",
          transcriptExcerpt: "He watched me pull a heavy book off the shelf when I was small, and it fell on the floor and broke apart. Oh dear! I can still remember it!",
          audioTimestampSeconds: 85,
        },
        {
          id: 'c19-l4-q25',
          questionNumber: 25,
          prompt: 'What do Jane and Kieran suggest about new books?',
          options: mcOptions(
            'Their parents liked buying them as presents.',
            'They would like to buy more of them.',
            'Not everyone can afford them.'
          ),
          answerKey: 'C',
          explanation: "Jane remarks: 'I guess we're lucky, we can buy them', implying that not everyone has the financial ability to afford new books (C).",
          transcriptExcerpt: "I guess we're lucky, we can buy them. My grandfather stocks second-hand books as well as new ones and they don't smell quite as good.",
          audioTimestampSeconds: 105,
        },
      ],
    },

    // PART 3: Questions 26-30 (Matching)
    {
      id: 'c19-l4-g8',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 26–30',
      instructions: "Where does Jane's grandfather keep each of the following types of books in his shop?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 26–30.",
      startQuestionNumber: 26,
      endQuestionNumber: 30,
      optionsList: MATCHING_Q26_OPTIONS,
      questions: [
        {
          id: 'c19-l4-q26',
          questionNumber: 26,
          prompt: 'rare books',
          options: MATCHING_Q26_OPTIONS,
          answerKey: 'D',
          explanation: "Jane says: 'he puts them out in the shop but makes sure you need a ladder to get them', which corresponds to on a high shelf (D).",
          transcriptExcerpt: "So, he puts them out in the shop but makes sure you need a ladder to get them.",
          audioTimestampSeconds: 130,
        },
        {
          id: 'c19-l4-q27',
          questionNumber: 27,
          prompt: "children's books",
          options: MATCHING_Q26_OPTIONS,
          answerKey: 'F',
          explanation: "Jane explains: 'he's got a dedicated area on the ground floor with cushions so that parents can enter with their toddlers, go there and spend some time reading', which is a specially designed space (F).",
          transcriptExcerpt: "he's got a dedicated area on the ground floor with cushions so that parents can enter with their toddlers, go there and spend some time reading.",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c19-l4-q28',
          questionNumber: 28,
          prompt: 'unwanted books',
          options: MATCHING_Q26_OPTIONS,
          answerKey: 'A',
          explanation: "Jane mentions: 'he just leaves unwanted books by the front door for customers to take', which is near the entrance (A).",
          transcriptExcerpt: "he hardly ever throws anything away - he just leaves unwanted books by the front door for customers to take.",
          audioTimestampSeconds: 165,
        },
        {
          id: 'c19-l4-q29',
          questionNumber: 29,
          prompt: 'requested books',
          options: MATCHING_Q26_OPTIONS,
          answerKey: 'C',
          explanation: "Jane says: 'and books people or institutions have requested, they all go at the far end... best to keep these out of the main shopping area', meaning at the back of the shop (C).",
          transcriptExcerpt: "and books people or institutions have requested, they all go at the far end. Oh. He thinks it's best to keep these out of the main shopping area as they're boxed and new.",
          audioTimestampSeconds: 180,
        },
        {
          id: 'c19-l4-q30',
          questionNumber: 30,
          prompt: 'coursebooks',
          options: MATCHING_Q26_OPTIONS,
          answerKey: 'G',
          explanation: "Jane states: 'They're actually part of the coffee shop, on low shelves all around it', which corresponds to within the café (G).",
          transcriptExcerpt: "They're actually part of the coffee shop, on low shelves all around it.",
          audioTimestampSeconds: 195,
        },
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c19-l4-g9',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Tree planting
Reforestation projects should:
• include a range of tree species
• not include invasive species because of possible [[31]] with native species
• aim to capture carbon, protect the environment and provide sustainable sources of [[32]] for local people
• use tree seeds with a high genetic diversity to increase resistance to [[33]] and climate change
• plant trees on previously forested land which is in a bad condition, not select land which is being used for [[34]]

Large-scale reforestation projects
• Base planning decisions on information from accurate [[35]]
• Drones are useful for identifying areas in Brazil which are endangered by keeping [[36]] and illegal logging.

Lampang Province, Northern Thailand
• A forest was restored in an area damaged by mining.
• A variety of native fig trees were planted, which are important for:
  - supporting many wildlife species
  - increasing the [[37]] of recovery by attracting animals and birds, e.g., [[38]] were soon attracted to the area.

Involving local communities
• Destruction of mangrove forests in Madagascar made it difficult for people to make a living from [[39]]
• The mangrove reforestation project:
  - provided employment for local people
  - restored a healthy ecosystem
  - protects against the higher risk of [[40]]`,
      questions: [
        {
          id: 'c19-l4-q31',
          questionNumber: 31,
          prompt: 'not include invasive species because of possible [31] with native species',
          answerKey: 'competition',
          acceptedAlternatives: ['competition'],
          explanation: "The speaker explains that invasive species 'are often in competition with native species and may threaten their long-term survival.'",
          transcriptExcerpt: "Invasive species are a significant contributor to the current global biodiversity crisis and are often in competition with native species and may threaten their long-term survival.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c19-l4-q32',
          questionNumber: 32,
          prompt: 'provide sustainable sources of [32] for local people',
          answerKey: 'food',
          acceptedAlternatives: ['food'],
          explanation: "The speaker lists project goals: 'improve the availability of food for the local community and maintain the stability of soil systems.'",
          transcriptExcerpt: "improve the availability of food for the local community and maintain the stability of soil systems.",
          audioTimestampSeconds: 45,
        },
        {
          id: 'c19-l4-q33',
          questionNumber: 33,
          prompt: 'increase resistance to [33] and climate change',
          answerKey: 'disease',
          acceptedAlternatives: ['disease'],
          explanation: "The lecturer warns that seeds with low genetic diversity 'can make them vulnerable to disease and unable to adapt to climate change.'",
          transcriptExcerpt: "Using seeds with low genetic diversity generally lowers the resilience of restored forests, which can make them vulnerable to disease and unable to adapt to climate change.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c19-l4-q34',
          questionNumber: 34,
          prompt: 'not select land which is being used for [34]',
          answerKey: 'agriculture',
          acceptedAlternatives: ['agriculture'],
          explanation: "The lecturer stresses: 'Reforesting areas which are currently exploited for agriculture should be avoided as this often leads to other areas being deforested.'",
          transcriptExcerpt: "Reforesting areas which are currently exploited for agriculture should be avoided as this often leads to other areas being deforested.",
          audioTimestampSeconds: 85,
        },
        {
          id: 'c19-l4-q35',
          questionNumber: 35,
          prompt: 'Base planning decisions on information from accurate [35]',
          answerKey: 'maps',
          acceptedAlternatives: ['maps', 'map'],
          explanation: "The lecturer points out: 'Having detailed and up-to-date maps identifying high-priority areas for intervention is essential.'",
          transcriptExcerpt: "Having detailed and up-to-date maps identifying high-priority areas for intervention is essential.",
          audioTimestampSeconds: 105,
        },
        {
          id: 'c19-l4-q36',
          questionNumber: 36,
          prompt: 'endangered by keeping [36] and illegal logging.',
          answerKey: 'cattle',
          acceptedAlternatives: ['cattle'],
          explanation: "In Brazil, drones identify how Amazon areas are damaged by 'human activities such as rearing cattle and illegal logging.'",
          transcriptExcerpt: "In Brazil, it's being used to identify and quantify how parts of the Amazon are being devastated by human activities such as rearing cattle and illegal logging.",
          audioTimestampSeconds: 120,
        },
        {
          id: 'c19-l4-q37',
          questionNumber: 37,
          prompt: 'increasing the [37] of recovery by attracting animals and birds',
          answerKey: 'speed',
          acceptedAlternatives: ['speed'],
          explanation: "Figs are central because 'they accelerate the speed of the recovery process by attracting animals and birds which act as natural seed dispersers.'",
          transcriptExcerpt: "They are central to tropical reforestation projects as they accelerate the speed of the recovery process by attracting animals and birds which act as natural seed dispersers.",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c19-l4-q38',
          questionNumber: 38,
          prompt: 'e.g., [38] were soon attracted to the area.',
          answerKey: 'monkeys',
          acceptedAlternatives: ['monkeys', 'monkey'],
          explanation: "The lecturer mentions: 'At this site, for example, after only three rainy seasons, monkeys started visiting to eat the fig fruits'.",
          transcriptExcerpt: "At this site, for example, after only three rainy seasons, monkeys started visiting to eat the fig fruits, naturally dispersing seeds through defecation.",
          audioTimestampSeconds: 165,
        },
        {
          id: 'c19-l4-q39',
          questionNumber: 39,
          prompt: 'made it difficult for people to make a living from [39]',
          answerKey: 'fishing',
          acceptedAlternatives: ['fishing'],
          explanation: "Mangrove loss 'badly affected the fishing industry, which was a major source of employment for local people living in coastal areas.'",
          transcriptExcerpt: "Destruction of the mangrove forests had a terrible impact on plant and animal life, and also badly affected the fishing industry, which was a major source of employment for local people living in coastal areas.",
          audioTimestampSeconds: 185,
        },
        {
          id: 'c19-l4-q40',
          questionNumber: 40,
          prompt: 'protects against the higher risk of [40]',
          answerKey: 'flooding',
          acceptedAlternatives: ['flooding', 'floods'],
          explanation: "The speaker concludes: 'The mangroves also act as a defence against the increased threat of flooding caused by climate change.'",
          transcriptExcerpt: "The mangroves also act as a defence against the increased threat of flooding caused by climate change.",
          audioTimestampSeconds: 205,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 19 Academic Listening Test 4',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 30,
    audioConfig: {
      mode: 'part_audios',
      overallAudioUrl: null,
      defaultVolume: 0.9,
      allowPause: true,
      allowSeekBackward: true,
      allowSeekForward: false,
      enforceSinglePlay: false,
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c19_test4_part1.mp3' },
        { partNumber: 2, audioUrl: '/audio/listening/c19_test4_part2.mp3' },
        { partNumber: 3, audioUrl: '/audio/listening/c19_test4_part3.mp3' },
        { partNumber: 4, audioUrl: '/audio/listening/c19_test4_part4.mp3' },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge19ListeningTest4(authorId?: string) {
  const data = getCambridge19ListeningTest4Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 19 Listening Test 4 validation failed: ${validationErrors.join('; ')}`);
  }

  const existingTest = await db.prepare(`
    SELECT id, current_version_number
    FROM listening_tests
    WHERE title = ?
    LIMIT 1
  `).get(data.title) as { id: string; current_version_number: number } | undefined;

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = await db.prepare(`
      SELECT id FROM listening_test_versions
      WHERE test_id = ? AND version_number = ?
      LIMIT 1
    `).get(testId, existingTest.current_version_number || 1) as { id: string } | undefined;

    if (existingVersion) {
      versionId = existingVersion.id;
      (await db.prepare(`
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
      ));
    } else {
      versionId = uuidv4();
      (await db.prepare(`
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
      ));
    }

    (await db.prepare(`
      UPDATE listening_tests
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
    ));

    (await db.prepare(`
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
    ));
  }

  return {
    testId,
    versionId,
    status: 'published',
    totalQuestions: 40,
  };
}
