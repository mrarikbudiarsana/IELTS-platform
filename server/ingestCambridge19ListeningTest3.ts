import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MATCHING_Q11_OPTIONS = [
  { key: 'A', text: 'involves painting and drawing' },
  { key: 'B', text: 'will be led by a prize-winning author' },
  { key: 'C', text: 'is aimed at children with a disability' },
  { key: 'D', text: 'involves a drama activity' },
  { key: 'E', text: 'focuses on new relationships' },
  { key: 'F', text: 'is aimed at a specific age group' },
  { key: 'G', text: 'explores an unhappy feeling' },
  { key: 'H', text: 'raises awareness of a particular culture' },
];

const MC_Q17_OPTIONS = [
  { key: 'A', text: 'It will appeal to both boys and girls.' },
  { key: 'B', text: 'The author is well known.' },
  { key: 'C', text: 'It has colourful illustrations.' },
  { key: 'D', text: 'It is funny.' },
  { key: 'E', text: 'It deals with an important topic.' },
];

const MC_Q19_OPTIONS = [
  { key: 'A', text: 'Encourage children to write down new vocabulary.' },
  { key: 'B', text: 'Allow children to listen to audio books.' },
  { key: 'C', text: 'Get recommendations from librarians.' },
  { key: 'D', text: 'Give children a choice about what they read.' },
  { key: 'E', text: 'Only read aloud to children until they can read independently.' },
];

const FLOWCHART_Q26_OPTIONS = [
  { key: 'A', text: 'size' },
  { key: 'B', text: 'escape' },
  { key: 'C', text: 'age' },
  { key: 'D', text: 'water' },
  { key: 'E', text: 'cereal' },
  { key: 'F', text: 'calculations' },
  { key: 'G', text: 'changes' },
  { key: 'H', text: 'colour' },
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

export function getCambridge19ListeningTest3Data(): {
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
      id: 'c19-l3-p1',
      partNumber: 1,
      title: 'Part 1: Local food shops',
      context: 'Shannon talks to Leon about buying food from local shops in Kite Place for cooking for her cousins.',
      audioUrl: '/audio/listening/c19_test3_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `LEON: Hi Shannon - how are you settling into your new flat?
SHANNON: Really well, thanks.
LEON: You look like you're going shopping.
SHANNON: Yes, I am. My cousins are coming to stay for a couple of days, and I have to cook for them.
LEON: Well, there are plenty of places to buy food in Kite Place - it's the area by the harbour.
SHANNON: Oh, OK, I'll find that on the map. Thanks.
LEON: What sort of food do you need to get?
SHANNON: Well, neither of them eats meat but they both like fish.
LEON: Well, there's a really good fish market there.
SHANNON: Oh great - where is it exactly?
LEON: It's at the far end of Kite Place, so you have to go over the bridge and then it's on the right.
SHANNON: OK - is it open all day?
LEON: It doesn't close until four, but I'd recommend going earlier than that - it does run out of some things.
SHANNON: Oh, I don't want that to happen.
LEON: As long as you get there by 3.30, you should be fine. It's only 11 now, so plenty of time.
SHANNON: Right.
LEON: Do you need to buy vegetables too?
SHANNON: I do, and I want to avoid all the plastic packaging in the supermarket!
LEON: Well, there's a really nice organic shop there. Now what's it called ... it's the name of a flower. I know, it's 'Rose'.
SHANNON: That's a nice name.
LEON: Yeah - it sells vegetables and quite a lot of other stuff.
SHANNON: And where's that?
LEON: Well, as you reach the market, you'll see a big grey building on your left - I think it used to be a warehouse. Anyway, now it's a restaurant upstairs, but the ground floor has two shops either side of the entrance and it's the one on the left.
SHANNON: That's easy enough.
LEON: You can't miss it - there's also a big sign on the pavement so you can look for that.
SHANNON: Fine! I guess if I need anything else, I'll have to go to the supermarket.
LEON: Yeah - you should be able to get everything you need, but there's a minibus that goes to the supermarket if you need it. It's purple and the number is 289.
SHANNON: Thanks, that's great.

LEON: So what do you need to get at the fish market? The salmon is always very good and the shellfish.
SHANNON: I'm going to make a curry, I think, and I need about 12 prawns for that.
LEON: They'll have plenty of those.
SHANNON: OK.
LEON: Have you ever tried samphire?
SHANNON: No - what's that?
LEON: It's a type of seaweed. I just ask for a handful and you fry it in butter. It's delicious!
SHANNON: Oh, I might try that - how do you spell it?
LEON: It's S-A-M-P-H-I-R-E.
SHANNON: Great - it's always good to try something different.
LEON: Yeah.
SHANNON: I'll see what beans they have in the organic shop and I think I'll get something for dessert there.
LEON: How about a mango?
SHANNON: I'm not sure - they're not always ripe. I'd prefer a melon - it's bigger too.
LEON: Good idea. The owner also sells a lot of spices there that you can put in a curry, and things like coconut.
SHANNON: Oh, that's very helpful. I'll have a look.
LEON: No problem.
SHANNON: I know bread doesn't really go with curry but I always like to have some in case.
LEON: As I said - all the bread is home-made and there's lots of variety. I like the brown bread myself.
SHANNON: Mm, sounds good.
LEON: They sell other things there too.
SHANNON: Like cakes? I love chocolate cake.
LEON: Well - not that, but they have a whole range of tarts and the best are the strawberry ones.
SHANNON: Perfect - hopefully I won't even have to go to the supermarket!`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 15, quote: "Well, there are plenty of places to buy food in Kite Place - it's the area by the harbour." },
        { questionNumber: 2, timestampSeconds: 25, quote: "It's at the far end of Kite Place, so you have to go over the bridge and then it's on the right." },
        { questionNumber: 3, timestampSeconds: 35, quote: "As long as you get there by 3.30, you should be fine." },
        { questionNumber: 4, timestampSeconds: 45, quote: "Now what's it called ... it's the name of a flower. I know, it's 'Rose'." },
        { questionNumber: 5, timestampSeconds: 55, quote: "there's also a big sign on the pavement so you can look for that." },
        { questionNumber: 6, timestampSeconds: 65, quote: "It's purple and the number is 289." },
        { questionNumber: 7, timestampSeconds: 80, quote: "Have you ever tried samphire? ... It's S-A-M-P-H-I-R-E." },
        { questionNumber: 8, timestampSeconds: 95, quote: "I'd prefer a melon - it's bigger too." },
        { questionNumber: 9, timestampSeconds: 105, quote: "and things like coconut." },
        { questionNumber: 10, timestampSeconds: 125, quote: "they have a whole range of tarts and the best are the strawberry ones." },
      ],
    },
    {
      id: 'c19-l3-p2',
      partNumber: 2,
      title: 'Part 2: Children’s book festival',
      context: 'Jenny Morgan, organiser of the children’s book festival, introduces the festival workshops and provides reading advice for parents.',
      audioUrl: '/audio/listening/c19_test3_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `PRESENTER: The children's book festival is coming up again soon and here to tell us all about it is the festival's organiser, Jenny Morgan. So tell us what we can expect this year, Jenny.
JENNY: Well, as usual we've got five days of action-packed exciting events for children, with writers coming from all over the country getting involved.
Just to give you an idea of what's on offer in the workshops, first of all, there's a very special event called Superheroes. This is a chance for deaf children to share their reading experiences with author Madeleine Gordon, who is herself hearing impaired.
'Just do it' is a practical workshop led by the well-known illustrator Mark Keane. He'll take participants on a magical journey to faraway lands with an opportunity for aspiring actors to do some role play.
'Count on me' is an inspiring and entertaining look at the issues of friendship for 13-14-year-olds. It looks at some of the friendships described in popular books and asks participants to compare these with their own experiences.
'Speak up' is part of a series of workshops on the subject of mental health. This is a creative writing workshop encouraging children to describe situations where young people experience loneliness. A recent survey revealed that children can be lonely even when they're at home with their families.
'Jump for joy', as many of you will know, is the heart-warming, best-selling story by Nina Karan about a young girl's trip to visit her relatives in India. It recently received the gold medal at the Waterford Awards. Nina will get children to celebrate the word 'joy' by writing a poem.
'Sticks and stones' is the beautifully illustrated picture book for young readers about a community who organise an African-Caribbean festival to help local children learn about their Jamaican roots. This will be a musical event where children will have the chance to play steel drums. This is bound to be very popular, so please book as soon as possible.
PRESENTER: Thanks Jenny. That all sounds really interesting. I'm just wondering if you have a favourite book you could recommend for our readers?
JENNY: It's hard to choose, but Alive and Kicking is definitely worth mentioning. You won't have heard of the writer as it's her first book - which is really impressive. It's basically the teenage diary of a boy from Somalia who comes to live in the UK. It deals with the serious issue of immigration and all the challenges the boy has to face at school and with the language barrier, etc. Usually, books like this are quite sad, but this one actually made me cry with laughter. On each page, there are simple but hilarious black and white stick drawings of the boy with his friends and teachers. At the end of each diary entry, there are new English words the boy learns each day, which may help develop some children's vocabulary.
PRESENTER: I think my kids would enjoy that. What about any advice for parents on how to encourage their children to read more?
JENNY: Well, this is something I get asked about a lot. There are so many distractions for kids these days that it can be hard to find time for reading. One thing I'd say is to make time to sit down with your child and share books with them. A lot of parents give up reading aloud to their children as soon as they learn to read independently, but this is a mistake. It's good to read more advanced books to them as it helps to develop their vocabulary. If you don't have time for this, then let them listen to audio books. Often, they'll want to read books they've listened to for themselves. I think it's a good idea to make a mental note of the type of books your child is reading - often they just read the same genre all the time, which can get a bit boring. You can introduce new authors and genres to them. Librarians should be able to help you with this.
PRESENTER: Well Jenny, I think that's really useful.`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 20, quote: "This is a chance for deaf children to share their reading experiences with author Madeleine Gordon, who is herself hearing impaired." },
        { questionNumber: 12, timestampSeconds: 35, quote: "an opportunity for aspiring actors to do some role play." },
        { questionNumber: 13, timestampSeconds: 45, quote: "for 13-14-year-olds." },
        { questionNumber: 14, timestampSeconds: 55, quote: "encouraging children to describe situations where young people experience loneliness." },
        { questionNumber: 15, timestampSeconds: 70, quote: "It recently received the gold medal at the Waterford Awards. Nina will get children to celebrate the word 'joy'..." },
        { questionNumber: 16, timestampSeconds: 85, quote: "to help local children learn about their Jamaican roots. This will be a musical event where children will have the chance to play steel drums." },
        { questionNumber: 17, timestampSeconds: 110, quote: "It deals with the serious issue of immigration... but this one actually made me cry with laughter." },
        { questionNumber: 18, timestampSeconds: 115, quote: "It deals with the serious issue of immigration... but this one actually made me cry with laughter." },
        { questionNumber: 19, timestampSeconds: 135, quote: "If you don't have time for this, then let them listen to audio books." },
        { questionNumber: 20, timestampSeconds: 145, quote: "You can introduce new authors and genres to them. Librarians should be able to help you with this." },
      ],
    },
    {
      id: 'c19-l3-p3',
      partNumber: 3,
      title: 'Part 3: Science experiment for Year 12 students',
      context: 'Clare and Jake discuss designing a classroom science experiment investigating mice nutrition and food intake.',
      audioUrl: '/audio/listening/c19_test3_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `CLARE: Hi Jake. How are you getting on with the practical teaching?
JAKE: It's harder than I expected, but I've got some great classes. How about you?
CLARE: Not brilliant. I'm really struggling with my Year 12 science class.
JAKE: Are they hard to control?
CLARE: Well, I don't have discipline problems as such. It's just that they don't seem to think that science has anything to do with their lives. It's depressing. They listen to what I say, and I gave them a test last week and the results weren't too bad, but there's no real engagement.
JAKE: Right.
CLARE: And as part of my teaching practice, I have to design an experiment for them to do. I was wondering about something on the children's diets... you know, asking them to record what they eat and maybe linking it to their state of health.
JAKE: Mmm. Let's think. So your methodology would involve the children recording what they eat. OK, but you'd also need to have access to the children's medical records and I don't think people would be happy about that; confidentiality would be an issue. If you could get the right data, the conclusions might be significant, but I suspect it's not going to be easy.
CLARE: Right.
JAKE: Have you thought about doing an experiment using animals?
CLARE: Wouldn't that be upsetting for the children?
JAKE: Well, the animals don't have to be harmed in any way. It could just be an experiment where they're given a certain diet and the effects are observed.
CLARE: Would I have to get permission to use animals?
JAKE: Yes, you'd have to submit an outline of the experiment and fill in a form, but it's quite straightforward.
CLARE: But if we found out that, say, a particular diet affects the health of animals, the same thing wouldn't necessarily be true for people, would it?
JAKE: No that's true, but the findings for any experiment are going to be limited. It's inevitable.
CLARE: I suppose so. So what animals could I use to investigate the effects of diet? Mice?
JAKE: Yes. You'd need experimental mice - ones that have been specially bred for experiments.
CLARE: OK, so what will your experiment be investigating exactly?
JAKE: Well, something to do with nutrition. So maybe we could look at food supplements... things like extra iron and extra protein, and their impact on health.
JAKE: Mmm. That might be rather broad. Maybe just look at the effects of one supplement, like sugar, on the health of the mice?
CLARE: In fact, maybe the focus could be on whether mice can control their own diet. So, what happens when they have access to more sugar, that they don't really need?
CLARE: Exactly. Do they eat it or do they decide to leave it?
JAKE: Great. Then later on, you could do a follow-up experiment adding another variable. Like, you could give some of the mice the chance to be more active, running on a wheel or something, and the others just sit around and don't do much.
CLARE: Or I could repeat the experiment but change the type of food I provided... or use mice with a different genetic structure. But I think your idea would be more interesting, I might think about that some more.

CLARE: So can I talk through a possible procedure for the experiment where mice are given a sugar supplement?
JAKE: Sure. I did a similar experiment in college actually.
CLARE: Great. So how many mice would I need?
JAKE: I'd say about 12. And all young ones, not a mixture of old and young.
CLARE: OK. And I'd need two groups of equal sizes, so six in each group. And how would I tell them apart? I suppose I could put some sort of tag on one group... or just mark them in some way?
JAKE: You could use food colouring, that wouldn't hurt them.
CLARE: Perfect. Then each group would go into a separate cage, and one group, let's call them group A, would be the control group. So they'd just have ordinary mouse food.
JAKE: Yes, it comes in dry pellets.
CLARE: And the other group would have the same as the first group, but they'd also have the extra sugar.
JAKE: Would you just give them straight sugar?
CLARE: It might be better to give them something like cereal with it.
JAKE: Mmm. Then you'd need to weigh the mice, I should think once a week. And you'd need an electronic balance.
CLARE: But we can't hold them on the balance, or it'd affect the reading.
JAKE: Exactly. So you need something called a weighing chamber to stop the mice from running away. It sounds complicated, but actually you can just use a plastic box with holes in the top.
CLARE: OK. So once we've measured the weight gain of each mouse we can work out the average for each group, as well as the standard deviation. And then see where we go from there. That sounds cool, I think the students will enjoy it.
JAKE: Yes, exactly.`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 15, quote: "It's just that they don't seem to think that science has anything to do with their lives. It's depressing. They listen to what I say... but there's no real engagement." },
        { questionNumber: 22, timestampSeconds: 35, quote: "access to the children's medical records and I don't think people would be happy about that; confidentiality would be an issue... I suspect it's not going to be easy." },
        { questionNumber: 23, timestampSeconds: 55, quote: "the same thing wouldn't necessarily be true for people, would it? JAKE: No that's true, but the findings for any experiment are going to be limited." },
        { questionNumber: 24, timestampSeconds: 80, quote: "maybe the focus could be on whether mice can control their own diet. So, what happens when they have access to more sugar, that they don't really need?" },
        { questionNumber: 25, timestampSeconds: 95, quote: "give some of the mice the chance to be more active, running on a wheel... I think your idea would be more interesting, I might think about that some more." },
        { questionNumber: 26, timestampSeconds: 115, quote: "And all young ones, not a mixture of old and young." },
        { questionNumber: 27, timestampSeconds: 125, quote: "You could use food colouring, that wouldn't hurt them." },
        { questionNumber: 28, timestampSeconds: 140, quote: "It might be better to give them something like cereal with it." },
        { questionNumber: 29, timestampSeconds: 155, quote: "So you need something called a weighing chamber to stop the mice from running away." },
        { questionNumber: 30, timestampSeconds: 165, quote: "we can work out the average for each group, as well as the standard deviation." },
      ],
    },
    {
      id: 'c19-l3-p4',
      partNumber: 4,
      title: 'Part 4: Microplastics',
      context: 'A lecture on the sources and consequences of microplastics, with a focus on an Anglia Ruskin University study on earthworms and soil.',
      audioUrl: '/audio/listening/c19_test3_part4.mp3',
      containsIntroPauses: false,
      introPauseSeconds: 45,
      checkPauseSeconds: 30,
      transcript: `In today's lecture, I'm going to be talking about microplastics.
Microplastics are tiny pieces of plastic smaller than five millimetres in size. Recently there's been a greater awareness that there are large quantities of plastic waste - big and small - in the environment. The amount of plastic waste in the oceans has received widespread attention, but far less is known about the effects of microplastics in freshwater and particularly in soil.
Microplastics can enter the environment via a number of different sources. Threads and microfibres detach from synthetic clothing every time they're put in a washing machine, and these find their way into the water system. Other sources include big pieces of plastic waste that are already in the environment, and these break down into microscopic particles over a period of time. On a larger scale, factory waste is another route, as are tyres which wear down as cars, lorries and so on travel along road surfaces.
We already understand some of the impacts of microplastics from studies involving fish and other animals. There is evidence that microplastics harm small creatures in a variety of ways, such as by damaging their mouths, or by impairing their ability to feed, for example when microplastics get lodged in their digestive system.
Surprisingly perhaps, it is likely that humans consume microplastics, as these have been detected in a wide range of food and drink products, including bottled water, as well as in water that comes direct from the tap. What's more, salt and many kinds of seafood have also been found to contain microplastics.
However, it's important to underline that there is not yet conclusive proof that microplastics cause significant harm to people. In many countries, including here in the UK, there is legislation which prevents manufacturers from adding plastic microbeads to shower gels, facial cleansers and toothpaste.
It is very difficult to accurately estimate the total amount of microplastic particles in the soil as they can be hard to detect, but we do know they are carried in the air and deposited in the soil by rain. What's more, many of the fertilisers used by both farmers and gardeners contain microplastics.
A team from the Anglia Ruskin University in Cambridge has carried out a study of the effects of microplastics on the digestive tracts of earthworms. These worms, which live in topsoil, are an essential component of our agricultural system. By feeding on soil, they mix nutrients into it, thereby making it more fertile.
The researchers set out to discover whether the introduction of microplastics into the soil - and the subsequent ingestion of these by earthworms - would impact soil quality and ultimately inhibit plant growth. The short answer was, yes, it did. After placing three different types of microplastic particles into the soil, they planted perennial rye grass. The particles of microplastic, which included biodegradable PLA and conventional high-density polyethylene, or HDPE, were then ingested by the earthworms in the soil. The result was that the worms lost weight rapidly. What's more, a lower percentage than normal of the rye grass seeds germinated, and the researchers concluded that this was a direct result of the earthworms being unable to fulfil their normal role in making soil more fertile. The team also discovered that there was an increase in the amount of acid found in the soil, and this was attributed mainly to the microplastic particles from conventional HDPE plastic.
The conclusions of the study make for very interesting reading - I've included the reference in the notes to give you at the end of this session. To summarise, the authors proposed the idea that we need to regard soil as we would regard any other process in nature. This means we should accept the implications of soil being dependent on decaying and dead matter constantly being passed through the bodies of earthworms. That is, when soil becomes impoverished by the presence of microplastics, not only ecosystems but also the whole of society are negatively impacted.`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 25, quote: "Threads and microfibres detach from synthetic clothing every time they're put in a washing machine" },
        { questionNumber: 32, timestampSeconds: 50, quote: "such as by damaging their mouths, or by impairing their ability to feed" },
        { questionNumber: 33, timestampSeconds: 65, quote: "What's more, salt and many kinds of seafood have also been found to contain microplastics." },
        { questionNumber: 34, timestampSeconds: 75, quote: "prevents manufacturers from adding plastic microbeads to shower gels, facial cleansers and toothpaste." },
        { questionNumber: 35, timestampSeconds: 90, quote: "many of the fertilisers used by both farmers and gardeners contain microplastics." },
        { questionNumber: 36, timestampSeconds: 105, quote: "By feeding on soil, they mix nutrients into it, thereby making it more fertile." },
        { questionNumber: 37, timestampSeconds: 120, quote: "would impact soil quality and ultimately inhibit plant growth." },
        { questionNumber: 38, timestampSeconds: 135, quote: "The result was that the worms lost weight rapidly." },
        { questionNumber: 39, timestampSeconds: 145, quote: "there was an increase in the amount of acid found in the soil" },
        { questionNumber: 40, timestampSeconds: 165, quote: "when soil becomes impoverished by the presence of microplastics, not only ecosystems but also the whole of society are negatively impacted." },
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
      id: 'c19-l3-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–6',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `Local food shops

Where to go
Kite Place - near the [[1]]

Fish market
• cross the [[2]] and turn right
• best to go before [[3]] pm, earlier than closing time

Organic shop
• called [[4]]
• below a restaurant in the large, grey building
• look for the large [[5]] outside

Supermarket
• take a [[6]] minibus, number 289`,
      questions: [
        {
          id: 'c19-l3-q1',
          questionNumber: 1,
          prompt: 'Kite Place - near the [1]',
          answerKey: 'harbour',
          acceptedAlternatives: ['harbour', 'harbor'],
          explanation: "Leon mentions: 'Well, there are plenty of places to buy food in Kite Place - it's the area by the harbour.'",
          transcriptExcerpt: "Well, there are plenty of places to buy food in Kite Place - it's the area by the harbour.",
          audioTimestampSeconds: 15,
        },
        {
          id: 'c19-l3-q2',
          questionNumber: 2,
          prompt: 'cross the [2] and turn right',
          answerKey: 'bridge',
          acceptedAlternatives: ['bridge'],
          explanation: "Leon gives directions to the fish market: 'It's at the far end of Kite Place, so you have to go over the bridge and then it's on the right.'",
          transcriptExcerpt: "It's at the far end of Kite Place, so you have to go over the bridge and then it's on the right.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c19-l3-q3',
          questionNumber: 3,
          prompt: 'best to go before [3] pm, earlier than closing time',
          answerKey: '3.30',
          acceptedAlternatives: ['3.30', '3:30', 'three thirty', 'half past 3', 'half 3', '1/2 past 3', 'half past three'],
          explanation: "Leon advises arriving before closing: 'As long as you get there by 3.30, you should be fine.'",
          transcriptExcerpt: "As long as you get there by 3.30, you should be fine. It's only 11 now, so plenty of time.",
          audioTimestampSeconds: 35,
        },
        {
          id: 'c19-l3-q4',
          questionNumber: 4,
          prompt: 'called [4]',
          answerKey: 'Rose',
          acceptedAlternatives: ['Rose', 'rose'],
          explanation: "Leon remembers the shop's name: 'Now what's it called ... it's the name of a flower. I know, it's “Rose”.'",
          transcriptExcerpt: "Well, there's a really nice organic shop there. Now what's it called ... it's the name of a flower. I know, it's 'Rose'.",
          audioTimestampSeconds: 45,
        },
        {
          id: 'c19-l3-q5',
          questionNumber: 5,
          prompt: 'look for the large [5] outside',
          answerKey: 'sign',
          acceptedAlternatives: ['sign'],
          explanation: "Leon notes: 'You can't miss it - there's also a big sign on the pavement so you can look for that.'",
          transcriptExcerpt: "You can't miss it - there's also a big sign on the pavement so you can look for that.",
          audioTimestampSeconds: 55,
        },
        {
          id: 'c19-l3-q6',
          questionNumber: 6,
          prompt: 'take a [6] minibus, number 289',
          answerKey: 'purple',
          acceptedAlternatives: ['purple'],
          explanation: "Leon says: 'there's a minibus that goes to the supermarket if you need it. It's purple and the number is 289.'",
          transcriptExcerpt: "there's a minibus that goes to the supermarket if you need it. It's purple and the number is 289.",
          audioTimestampSeconds: 65,
        },
      ],
    },

    // PART 1: Questions 7-10 (Table Completion)
    {
      id: 'c19-l3-g2',
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
        headers: ['', 'To buy', 'Other ideas'],
        rows: [
          {
            cells: [
              { content: 'Fish market' },
              { content: 'a dozen prawns' },
              { content: 'a handful of [[7]] (type of seaweed)', isGap: true, questionNumber: 7 },
            ],
          },
          {
            cells: [
              { content: 'Organic shop' },
              { content: 'beans and a [[8]] for dessert', isGap: true, questionNumber: 8 },
              { content: 'spices and [[9]]', isGap: true, questionNumber: 9 },
            ],
          },
          {
            cells: [
              { content: 'Bakery' },
              { content: 'a brown loaf' },
              { content: 'a [[10]] tart', isGap: true, questionNumber: 10 },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c19-l3-q7',
          questionNumber: 7,
          prompt: 'Fish market — Other ideas: a handful of [7] (type of seaweed)',
          answerKey: 'samphire',
          acceptedAlternatives: ['samphire'],
          explanation: "Leon asks: 'Have you ever tried samphire? It's a type of seaweed... It's S-A-M-P-H-I-R-E.'",
          transcriptExcerpt: "Have you ever tried samphire? ... It's a type of seaweed. I just ask for a handful and you fry it in butter. It's delicious! ... It's S-A-M-P-H-I-R-E.",
          audioTimestampSeconds: 80,
        },
        {
          id: 'c19-l3-q8',
          questionNumber: 8,
          prompt: 'Organic shop — To buy: beans and a [8] for dessert',
          answerKey: 'melon',
          acceptedAlternatives: ['melon'],
          explanation: "Shannon decides: 'I'd prefer a melon - it's bigger too.'",
          transcriptExcerpt: "I'm not sure - they're not always ripe. I'd prefer a melon - it's bigger too.",
          audioTimestampSeconds: 95,
        },
        {
          id: 'c19-l3-q9',
          questionNumber: 9,
          prompt: 'Organic shop — Other ideas: spices and [9]',
          answerKey: 'coconut',
          acceptedAlternatives: ['coconut'],
          explanation: "Leon suggests: 'The owner also sells a lot of spices there that you can put in a curry, and things like coconut.'",
          transcriptExcerpt: "The owner also sells a lot of spices there that you can put in a curry, and things like coconut.",
          audioTimestampSeconds: 105,
        },
        {
          id: 'c19-l3-q10',
          questionNumber: 10,
          prompt: 'Bakery — Other ideas: a [10] tart',
          answerKey: 'strawberry',
          acceptedAlternatives: ['strawberry'],
          explanation: "Leon mentions: 'they have a whole range of tarts and the best are the strawberry ones.'",
          transcriptExcerpt: "they have a whole range of tarts and the best are the strawberry ones.",
          audioTimestampSeconds: 125,
        },
      ],
    },

    // PART 2: Questions 11-16 (Matching)
    {
      id: 'c19-l3-g3',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 11–16',
      instructions:
        'What information is given about each of the following festival workshops?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 11–16.',
      startQuestionNumber: 11,
      endQuestionNumber: 16,
      optionsList: MATCHING_Q11_OPTIONS,
      questions: [
        {
          id: 'c19-l3-q11',
          questionNumber: 11,
          prompt: 'Superheroes',
          options: MATCHING_Q11_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Jenny describes Superheroes: 'This is a chance for deaf children to share their reading experiences with author Madeleine Gordon, who is herself hearing impaired.' (aimed at children with a disability, Option C).",
          transcriptExcerpt: "This is a chance for deaf children to share their reading experiences with author Madeleine Gordon, who is herself hearing impaired.",
          audioTimestampSeconds: 20,
        },
        {
          id: 'c19-l3-q12',
          questionNumber: 12,
          prompt: 'Just do it',
          options: MATCHING_Q11_OPTIONS,
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation: "Jenny states: ''Just do it' is a practical workshop... with an opportunity for aspiring actors to do some role play.' (involves a drama activity, Option D).",
          transcriptExcerpt: "with an opportunity for aspiring actors to do some role play.",
          audioTimestampSeconds: 35,
        },
        {
          id: 'c19-l3-q13',
          questionNumber: 13,
          prompt: 'Count on me',
          options: MATCHING_Q11_OPTIONS,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation: "Jenny describes: ''Count on me' is an inspiring and entertaining look at the issues of friendship for 13-14-year-olds.' (aimed at a specific age group, Option F).",
          transcriptExcerpt: "'Count on me' is an inspiring and entertaining look at the issues of friendship for 13-14-year-olds.",
          audioTimestampSeconds: 45,
        },
        {
          id: 'c19-l3-q14',
          questionNumber: 14,
          prompt: 'Speak up',
          options: MATCHING_Q11_OPTIONS,
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: "Jenny states: ''Speak up' is part of a series of workshops on the subject of mental health... encouraging children to describe situations where young people experience loneliness.' (explores an unhappy feeling, Option G).",
          transcriptExcerpt: "This is a creative writing workshop encouraging children to describe situations where young people experience loneliness.",
          audioTimestampSeconds: 55,
        },
        {
          id: 'c19-l3-q15',
          questionNumber: 15,
          prompt: 'Jump for joy',
          options: MATCHING_Q11_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "Jenny states: 'It recently received the gold medal at the Waterford Awards. Nina will get children to celebrate the word “joy” by writing a poem.' (led by a prize-winning author, Option B).",
          transcriptExcerpt: "It recently received the gold medal at the Waterford Awards. Nina will get children to celebrate the word 'joy' by writing a poem.",
          audioTimestampSeconds: 70,
        },
        {
          id: 'c19-l3-q16',
          questionNumber: 16,
          prompt: 'Sticks and stones',
          options: MATCHING_Q11_OPTIONS,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation: "Jenny states: 'about a community who organise an African-Caribbean festival to help local children learn about their Jamaican roots.' (raises awareness of a particular culture, Option H).",
          transcriptExcerpt: "to help local children learn about their Jamaican roots. This will be a musical event where children will have the chance to play steel drums.",
          audioTimestampSeconds: 85,
        },
      ],
    },

    // PART 2: Questions 17 and 18 (Multiple Choice Multi-Select)
    {
      id: 'c19-l3-g4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 17 and 18',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO reasons does the speaker give for recommending Alive and Kicking?',
      startQuestionNumber: 17,
      endQuestionNumber: 18,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q17_OPTIONS,
      questions: [
        multiQuestion(
          'c19-l3-q17',
          17,
          'Which TWO reasons does the speaker give for recommending Alive and Kicking?',
          MC_Q17_OPTIONS,
          ['D', 'E'],
          "Jenny states that the book 'deals with the serious issue of immigration' (deals with an important topic, Option E) and 'actually made me cry with laughter... simple but hilarious black and white stick drawings' (it is funny, Option D).",
          "It deals with the serious issue of immigration and all the challenges the boy has to face... but this one actually made me cry with laughter.",
          110
        ),
        multiQuestion(
          'c19-l3-q18',
          18,
          'Which TWO reasons does the speaker give for recommending Alive and Kicking?',
          MC_Q17_OPTIONS,
          ['D', 'E'],
          "Jenny states that the book 'deals with the serious issue of immigration' (deals with an important topic, Option E) and 'actually made me cry with laughter... simple but hilarious black and white stick drawings' (it is funny, Option D).",
          "It deals with the serious issue of immigration and all the challenges the boy has to face... but this one actually made me cry with laughter.",
          115
        ),
      ],
    },

    // PART 2: Questions 19 and 20 (Multiple Choice Multi-Select)
    {
      id: 'c19-l3-g5',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 19 and 20',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO pieces of advice does the speaker give to parents about reading?',
      startQuestionNumber: 19,
      endQuestionNumber: 20,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q19_OPTIONS,
      questions: [
        multiQuestion(
          'c19-l3-q19',
          19,
          'Which TWO pieces of advice does the speaker give to parents about reading?',
          MC_Q19_OPTIONS,
          ['B', 'C'],
          "Jenny advises: 'let them listen to audio books' (Option B) and 'You can introduce new authors and genres to them. Librarians should be able to help you with this' (Option C).",
          "If you don't have time for this, then let them listen to audio books... You can introduce new authors and genres to them. Librarians should be able to help you with this.",
          135
        ),
        multiQuestion(
          'c19-l3-q20',
          20,
          'Which TWO pieces of advice does the speaker give to parents about reading?',
          MC_Q19_OPTIONS,
          ['B', 'C'],
          "Jenny advises: 'let them listen to audio books' (Option B) and 'You can introduce new authors and genres to them. Librarians should be able to help you with this' (Option C).",
          "If you don't have time for this, then let them listen to audio books... You can introduce new authors and genres to them. Librarians should be able to help you with this.",
          145
        ),
      ],
    },

    // PART 3: Questions 21-25 (Multiple Choice Single)
    {
      id: 'c19-l3-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 21–25',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 21,
      endQuestionNumber: 25,
      questions: [
        {
          id: 'c19-l3-q21',
          questionNumber: 21,
          prompt: 'How does Clare feel about the students in her Year 12 science class?',
          options: mcOptions(
            'worried that they are not making progress',
            'challenged by their poor behaviour in class',
            'frustrated at their lack of interest in the subject'
          ),
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Clare explains: 'Well, I don't have discipline problems as such. It's just that they don't seem to think that science has anything to do with their lives. It's depressing. They listen to what I say... but there's no real engagement.' This shows frustration at their lack of interest (Option C).",
          transcriptExcerpt: "It's just that they don't seem to think that science has anything to do with their lives. It's depressing. They listen to what I say, and I gave them a test last week and the results weren't too bad, but there's no real engagement.",
          audioTimestampSeconds: 15,
        },
        {
          id: 'c19-l3-q22',
          questionNumber: 22,
          prompt: "How does Jake react to Clare's suggestion about an experiment based on children's diet?",
          options: mcOptions(
            'He is concerned that the results might not be meaningful.',
            'He feels some of the data might be difficult to obtain.',
            'He suspects that the conclusions might be upsetting.'
          ),
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "Jake responds: 'you'd also need to have access to the children's medical records and I don't think people would be happy about that; confidentiality would be an issue... I suspect it's not going to be easy.' (some data difficult to obtain, Option B).",
          transcriptExcerpt: "you'd also need to have access to the children's medical records and I don't think people would be happy about that; confidentiality would be an issue... I suspect it's not going to be easy.",
          audioTimestampSeconds: 35,
        },
        {
          id: 'c19-l3-q23',
          questionNumber: 23,
          prompt: 'What problem do they agree may be involved in an experiment involving animals?',
          options: mcOptions(
            'Any results may not apply to humans.',
            'It may be complicated to get permission.',
            'Students may not be happy about animal experiments.'
          ),
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "Clare asks: 'But if we found out that, say, a particular diet affects the health of animals, the same thing wouldn't necessarily be true for people, would it?' and Jake replies: 'No that's true, but the findings for any experiment are going to be limited.' They agree results may not apply to humans (Option A).",
          transcriptExcerpt: "But if we found out that, say, a particular diet affects the health of animals, the same thing wouldn't necessarily be true for people, would it? JAKE: No that's true, but the findings for any experiment are going to be limited.",
          audioTimestampSeconds: 55,
        },
        {
          id: 'c19-l3-q24',
          questionNumber: 24,
          prompt: 'What question do they decide the experiment should address?',
          options: mcOptions(
            'Are mice capable of controlling their food intake?',
            'Does an increase in sugar lead to health problems?',
            'How much do supplements of different kinds affect health?'
          ),
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "Clare suggests: 'In fact, maybe the focus could be on whether mice can control their own diet. So, what happens when they have access to more sugar, that they don't really need? ... Do they eat it or do they decide to leave it?' (Option A).",
          transcriptExcerpt: "maybe the focus could be on whether mice can control their own diet. So, what happens when they have access to more sugar, that they don't really need? CLARE: Exactly. Do they eat it or do they decide to leave it?",
          audioTimestampSeconds: 80,
        },
        {
          id: 'c19-l3-q25',
          questionNumber: 25,
          prompt: 'Clare might also consider doing another experiment involving',
          options: mcOptions(
            'other types of food supplement.',
            'different genetic strains of mice.',
            'varying amounts of exercise.'
          ),
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Jake suggests: 'you could give some of the mice the chance to be more active, running on a wheel or something, and the others just sit around and don't do much.' Clare agrees: 'I think your idea would be more interesting, I might think about that some more.' (varying amounts of exercise, Option C).",
          transcriptExcerpt: "Like, you could give some of the mice the chance to be more active, running on a wheel or something... But I think your idea would be more interesting, I might think about that some more.",
          audioTimestampSeconds: 95,
        },
      ],
    },

    // PART 3: Questions 26-30 (Flow-chart Completion)
    {
      id: 'c19-l3-g7',
      partNumber: 3,
      questionType: 'flow_chart_completion',
      title: 'Questions 26–30',
      instructions:
        'Complete the flowchart below.\nChoose FIVE answers from the box and write the correct letter, A–H, next to Questions 26–30.',
      startQuestionNumber: 26,
      endQuestionNumber: 30,
      optionsList: FLOWCHART_Q26_OPTIONS,
      flowChartSteps: [
        {
          stepNumber: 1,
          title: 'Selection',
          descriptionWithGaps: 'Choose mice which are all the same [[26]]',
          questionNumbers: [26],
        },
        {
          stepNumber: 2,
          title: 'Grouping',
          descriptionWithGaps: 'Divide the mice into two groups, each with a different [[27]]',
          questionNumbers: [27],
        },
        {
          stepNumber: 3,
          title: 'Diet & Cages',
          descriptionWithGaps:
            'Put each group in a separate cage.\nFeed group A commercial mouse food.\nFeed group B the same, but also sugar contained in [[28]]',
          questionNumbers: [28],
        },
        {
          stepNumber: 4,
          title: 'Measurement',
          descriptionWithGaps:
            'Take measurements using an electronic scale.\nPlace them in a weighing chamber to prevent [[29]]',
          questionNumbers: [29],
        },
        {
          stepNumber: 5,
          title: 'Analysis',
          descriptionWithGaps: 'Do all necessary [[30]]',
          questionNumbers: [30],
        },
      ],
      questions: [
        {
          id: 'c19-l3-q26',
          questionNumber: 26,
          prompt: 'Choose mice which are all the same [26]',
          options: FLOWCHART_Q26_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Jake advises: 'And all young ones, not a mixture of old and young.' ('young ones' = same age, Option C).",
          transcriptExcerpt: "I'd say about 12. And all young ones, not a mixture of old and young.",
          audioTimestampSeconds: 115,
        },
        {
          id: 'c19-l3-q27',
          questionNumber: 27,
          prompt: 'Divide the mice into two groups, each with a different [27]',
          options: FLOWCHART_Q26_OPTIONS,
          answerKey: 'H',
          acceptedAlternatives: ['H'],
          explanation: "Jake suggests: 'You could use food colouring, that wouldn't hurt them.' (different colour, Option H).",
          transcriptExcerpt: "You could use food colouring, that wouldn't hurt them.",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c19-l3-q28',
          questionNumber: 28,
          prompt: 'Feed group B the same, but also sugar contained in [28]',
          options: FLOWCHART_Q26_OPTIONS,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation: "Clare says: 'It might be better to give them something like cereal with it.' (cereal, Option E).",
          transcriptExcerpt: "It might be better to give them something like cereal with it.",
          audioTimestampSeconds: 140,
        },
        {
          id: 'c19-l3-q29',
          questionNumber: 29,
          prompt: 'Place them in a weighing chamber to prevent [29]',
          options: FLOWCHART_Q26_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "Jake explains: 'So you need something called a weighing chamber to stop the mice from running away.' (prevent escape, Option B).",
          transcriptExcerpt: "So you need something called a weighing chamber to stop the mice from running away.",
          audioTimestampSeconds: 155,
        },
        {
          id: 'c19-l3-q30',
          questionNumber: 30,
          prompt: 'Do all necessary [30]',
          options: FLOWCHART_Q26_OPTIONS,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation: "Clare says: 'we can work out the average for each group, as well as the standard deviation.' (calculations, Option F).",
          transcriptExcerpt: "we can work out the average for each group, as well as the standard deviation. And then see where we go from there.",
          audioTimestampSeconds: 165,
        },
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c19-l3-g8',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Microplastics

Where microplastics come from
• fibres from some [[31]] during washing
• the breakdown of large pieces of plastic
• waste from industry
• the action of vehicle tyres on roads

Effects of microplastics
• They cause injuries to the [[32]] of wildlife and affect their digestive systems.
• They enter the food chain, e.g., in bottled and tap water, [[33]] and seafood.
• They may not affect human health, but they are already banned in skin cleaning products and [[34]] in some countries.
• Microplastics enter the soil through the air, rain and [[35]].

Microplastics in the soil - a study by Anglia Ruskin University
• Earthworms are important because they add [[36]] to the soil.
• The study aimed to find whether microplastics in earthworms affect the [[37]] of plants.
• The study found that microplastics caused:
  - [[38]] loss in earthworms
  - fewer seeds to germinate
  - a rise in the level of [[39]] in the soil.
• The study concluded:
  - soil should be seen as an important natural process.
  - changes to soil damage both ecosystems and [[40]].`,
      questions: [
        {
          id: 'c19-l3-q31',
          questionNumber: 31,
          prompt: 'fibres from some [31] during washing',
          answerKey: 'clothing',
          acceptedAlternatives: ['clothing'],
          explanation: "The speaker explains: 'Threads and microfibres detach from synthetic clothing every time they're put in a washing machine...'",
          transcriptExcerpt: "Threads and microfibres detach from synthetic clothing every time they're put in a washing machine, and these find their way into the water system.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c19-l3-q32',
          questionNumber: 32,
          prompt: 'They cause injuries to the [32] of wildlife and affect their digestive systems.',
          answerKey: 'mouths',
          acceptedAlternatives: ['mouths', 'mouth'],
          explanation: "The lecturer mentions: 'There is evidence that microplastics harm small creatures in a variety of ways, such as by damaging their mouths, or by impairing their ability to feed...'",
          transcriptExcerpt: "There is evidence that microplastics harm small creatures in a variety of ways, such as by damaging their mouths, or by impairing their ability to feed",
          audioTimestampSeconds: 50,
        },
        {
          id: 'c19-l3-q33',
          questionNumber: 33,
          prompt: 'They enter the food chain, e.g., in bottled and tap water, [33] and seafood.',
          answerKey: 'salt',
          acceptedAlternatives: ['salt'],
          explanation: "The speaker notes: 'What's more, salt and many kinds of seafood have also been found to contain microplastics.'",
          transcriptExcerpt: "What's more, salt and many kinds of seafood have also been found to contain microplastics.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c19-l3-q34',
          questionNumber: 34,
          prompt: 'They may not affect human health, but they are already banned in skin cleaning products and [34] in some countries.',
          answerKey: 'toothpaste',
          acceptedAlternatives: ['toothpaste'],
          explanation: "The lecturer states: 'legislation which prevents manufacturers from adding plastic microbeads to shower gels, facial cleansers and toothpaste.'",
          transcriptExcerpt: "legislation which prevents manufacturers from adding plastic microbeads to shower gels, facial cleansers and toothpaste.",
          audioTimestampSeconds: 75,
        },
        {
          id: 'c19-l3-q35',
          questionNumber: 35,
          prompt: 'Microplastics enter the soil through the air, rain and [35].',
          answerKey: 'fertilisers',
          acceptedAlternatives: ['fertilisers', 'fertilizers', 'fertiliser', 'fertilizer'],
          explanation: "The lecturer observes: 'What's more, many of the fertilisers used by both farmers and gardeners contain microplastics.'",
          transcriptExcerpt: "What's more, many of the fertilisers used by both farmers and gardeners contain microplastics.",
          audioTimestampSeconds: 90,
        },
        {
          id: 'c19-l3-q36',
          questionNumber: 36,
          prompt: 'Earthworms are important because they add [36] to the soil.',
          answerKey: 'nutrients',
          acceptedAlternatives: ['nutrients', 'nutrient'],
          explanation: "The speaker states: 'By feeding on soil, they mix nutrients into it, thereby making it more fertile.'",
          transcriptExcerpt: "By feeding on soil, they mix nutrients into it, thereby making it more fertile.",
          audioTimestampSeconds: 105,
        },
        {
          id: 'c19-l3-q37',
          questionNumber: 37,
          prompt: 'The study aimed to find whether microplastics in earthworms affect the [37] of plants.',
          answerKey: 'growth',
          acceptedAlternatives: ['growth'],
          explanation: "The lecturer explains: 'The researchers set out to discover whether the introduction of microplastics into the soil... would impact soil quality and ultimately inhibit plant growth.'",
          transcriptExcerpt: "The researchers set out to discover whether the introduction of microplastics into the soil - and the subsequent ingestion of these by earthworms - would impact soil quality and ultimately inhibit plant growth.",
          audioTimestampSeconds: 120,
        },
        {
          id: 'c19-l3-q38',
          questionNumber: 38,
          prompt: 'The study found that microplastics caused: [38] loss in earthworms',
          answerKey: 'weight',
          acceptedAlternatives: ['weight'],
          explanation: "The speaker reports: 'The result was that the worms lost weight rapidly.'",
          transcriptExcerpt: "The result was that the worms lost weight rapidly. What's more, a lower percentage than normal of the rye grass seeds germinated",
          audioTimestampSeconds: 135,
        },
        {
          id: 'c19-l3-q39',
          questionNumber: 39,
          prompt: 'The study found that microplastics caused: a rise in the level of [39] in the soil.',
          answerKey: 'acid',
          acceptedAlternatives: ['acid'],
          explanation: "The speaker states: 'The team also discovered that there was an increase in the amount of acid found in the soil...'",
          transcriptExcerpt: "The team also discovered that there was an increase in the amount of acid found in the soil, and this was attributed mainly to the microplastic particles from conventional HDPE plastic.",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c19-l3-q40',
          questionNumber: 40,
          prompt: 'The study concluded: changes to soil damage both ecosystems and [40].',
          answerKey: 'society',
          acceptedAlternatives: ['society'],
          explanation: "The lecturer concludes: 'when soil becomes impoverished by the presence of microplastics, not only ecosystems but also the whole of society are negatively impacted.'",
          transcriptExcerpt: "when soil becomes impoverished by the presence of microplastics, not only ecosystems but also the whole of society are negatively impacted.",
          audioTimestampSeconds: 165,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 19 Academic Listening Test 3',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      overallAudioUrl: '/audio/listening/c19_test3_complete.mp3',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c19_test3_part1.mp3', durationSeconds: 360 },
        { partNumber: 2, audioUrl: '/audio/listening/c19_test3_part2.mp3', durationSeconds: 340 },
        { partNumber: 3, audioUrl: '/audio/listening/c19_test3_part3.mp3', durationSeconds: 380 },
        { partNumber: 4, audioUrl: '/audio/listening/c19_test3_part4.mp3', durationSeconds: 390 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge19ListeningTest3(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
}> {
  const data = getCambridge19ListeningTest3Data();
  const errors = validateListeningTestVersion(data.parts, data.questionGroups);

  if (errors.length > 0) {
    throw new Error(
      `Cambridge 19 Listening Test 3 data validation failed:\n- ${errors.join('\n- ')}`
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
      "SELECT id, current_version_number FROM listening_tests WHERE title = ? OR title LIKE '%Cambridge%19%Academic%Listening%Test 3%' LIMIT 1"
    )
    .get(data.title)) as { id: string; current_version_number: number } | undefined;

  const now = new Date().toISOString();
  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db
      .prepare(
        'SELECT id FROM listening_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1'
      )
      .get(testId)) as { id: string } | undefined;

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
