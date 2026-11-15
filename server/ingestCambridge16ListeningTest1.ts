import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: '1923.' },
  { key: 'B', text: '1924.' },
  { key: 'C', text: '1926.' },
];

const MC_Q12_OPTIONS = [
  { key: 'A', text: 'the healthcare industry.' },
  { key: 'B', text: 'the automotive industry.' },
  { key: 'C', text: 'the machine tools industry.' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'The company has recently moved.' },
  { key: 'B', text: 'The company has no plans to move.' },
  { key: 'C', text: 'The company is going to move shortly.' },
];

const MC_Q14_OPTIONS = [
  { key: 'A', text: 'time to do research.' },
  { key: 'B', text: 'meetings with a teacher.' },
  { key: 'C', text: 'talks by staff.' },
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
  { key: 'J', text: 'Location J' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'the Bird Park visit' },
  { key: 'B', text: 'the workshop sessions' },
  { key: 'C', text: 'the Natural History Museum visit' },
  { key: 'D', text: 'the projects done in previous years' },
  { key: 'E', text: 'the handouts with research sources' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'by giving a rationale for their action plans' },
  { key: 'B', text: 'by being less specific about the outcome' },
  { key: 'C', text: 'by adding a video diary presentation' },
  { key: 'D', text: 'by providing a timeline and a mind map' },
  { key: 'E', text: 'by making their notes more evaluative' },
];

const MATCHING_Q25_OPTIONS = [
  { key: 'A', text: 'a childhood memory' },
  { key: 'B', text: 'hope for the future' },
  { key: 'C', text: 'fast movement' },
  { key: 'D', text: 'a potential threat' },
  { key: 'E', text: 'the power of colour' },
  { key: 'F', text: 'the continuity of life' },
  { key: 'G', text: 'protection of nature' },
  { key: 'H', text: 'a confused attitude to nature' },
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

export function getCambridge16ListeningTest1Data(): {
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
      id: 'c16-l1-p1',
      partNumber: 1,
      title: "Part 1: Children's Engineering Workshops",
      context: "A father talks to Sarah about holiday engineering workshops for his two daughters, Lydia and Carly.",
      audioUrl: '/audio/listening/c16_test1_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `SARAH: Hello. Children's Engineering Workshops.
FATHER: Oh hello. I wanted some information about the workshops in the school holidays.
SARAH: Sure.
FATHER: I have two daughters who are interested. The younger one's Lydia, she's four – do you take children as young as that?
SARAH: Yes, our Tiny Engineers workshop is for four to five-year-olds.
FATHER: What sorts of activities do they do?
SARAH: All sorts. For example, they work together to design a special cover that goes round an egg, so that when it's inside they can drop it from a height and it doesn't break. Well, sometimes it does break but that's part of the fun!
FATHER: Right. And Lydia loves building things. Is there any opportunity for her to do that?
SARAH: Well, they have a competition to see who can make the highest tower. You'd be amazed how high they can go.
FATHER: Right.
SARAH: But they're learning all the time as well as having fun. For example, one thing they do is to design and build a car that's attached to a balloon, and the force of the air in that actually powers the car and makes it move along. They go really fast too.
SARAH: OK, well, all this sounds perfect.

FATHER: Now Carly, that's my older daughter, has just had her seventh birthday, so presumably she'd be in a different group?
SARAH: Yes, she'd be in the Junior Engineers. That's for children from six to eight.
FATHER: And do they do the same sorts of activities?
SARAH: Some are the same, but a bit more advanced. So they work out how to build model vehicles, things like cars and trucks, but also how to construct animals using the same sorts of material and technique, and then they learn how they can program them and make them move.
FATHER: So they learn a bit of coding?
SARAH: They do. They pick it up really quickly. We're there to help if they need it, but they learn from one another too.
FATHER: Right. And do they have competitions too?
SARAH: Yes, with the Junior Engineers, it's to use recycled materials like card and wood to build a bridge, and the longest one gets a prize.
FATHER: That sounds fun. I wouldn't mind doing that myself!
SARAH: Then they have something a bit different, which is to think up an idea for a five-minute movie and then film it, using special animation software. You'd be amazed what they come up with.
FATHER: And of course, that's something they can put on their phone and take home to show all their friends.
SARAH: Exactly. And then they also build a robot in the shape of a human, and they decorate it and program it so that it can move its arms and legs.
FATHER: Perfect. So, is it the same price as the Tiny Engineers?
SARAH: It's just a bit more: £50 for the five weeks.
FATHER: And are the classes on a Monday, too?
SARAH: They used to be, but we found it didn't give our staff enough time to clear up after the first workshop, so we moved them to Wednesdays. The classes are held in the morning from ten to eleven.
FATHER: OK. That's better for me actually. And what about the location? Where exactly are the workshops held?
SARAH: They're in building 10A – there's a big sign on the door, you can't miss it, and that's in Fradstone Industrial Estate.
FATHER: Sorry?
SARAH: Fradstone – that's F-R-A-D-S-T-O-N-E.
FATHER: And that's in Grasford, isn't it?
SARAH: Yes, up past the station.
FATHER: And will I have any parking problems there?
SARAH: No, there's always plenty available. So would you like to enrol Lydia and Carly now?
FATHER: OK.
SARAH: So can I have your full name ...`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 18, quote: "they work together to design a special cover that goes round an egg, so that when it's inside they can drop it from a height and it doesn't break." },
        { questionNumber: 2, timestampSeconds: 32, quote: "they have a competition to see who can make the highest tower." },
        { questionNumber: 3, timestampSeconds: 42, quote: "one thing they do is to design and build a car that's attached to a balloon, and the force of the air in that actually powers the car" },
        { questionNumber: 4, timestampSeconds: 65, quote: "they work out how to build model vehicles, things like cars and trucks, but also how to construct animals" },
        { questionNumber: 5, timestampSeconds: 86, quote: "with the Junior Engineers, it's to use recycled materials like card and wood to build a bridge, and the longest one gets a prize." },
        { questionNumber: 6, timestampSeconds: 98, quote: "think up an idea for a five-minute movie and then film it, using special animation software." },
        { questionNumber: 7, timestampSeconds: 112, quote: "they also build a robot in the shape of a human, and they decorate it and program it" },
        { questionNumber: 8, timestampSeconds: 128, quote: "so we moved them to Wednesdays. The classes are held in the morning from ten to eleven." },
        { questionNumber: 9, timestampSeconds: 142, quote: "They're in building 10A – there's a big sign on the door, you can't miss it, and that's in Fradstone Industrial Estate." },
        { questionNumber: 10, timestampSeconds: 158, quote: "And will I have any parking problems there? No, there's always plenty available." },
      ],
    },
    {
      id: 'c16-l1-p2',
      partNumber: 2,
      title: "Part 2: Welcome to Stevenson's",
      context: "Julia Simmons, the managing director of Stevenson's, welcomes a work experience group and explains the company's history, programme, and site plan.",
      audioUrl: '/audio/listening/c16_test1_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Good morning, everyone, and welcome to Stevenson's, one of the country's major manufacturers of metal goods. Thank you for choosing us for your two weeks of work experience. My name is Julia Simmons, and since the beginning of this year I've been the managing director.

Stevenson's is quite an old company. Like me, the founder, Ronald Stevenson, went into the steel industry when he left school – that was in 1923. He set up this company when he finished his apprenticeship, in 1926, although he actually started making plans two years earlier, in 1924. He was a very determined young man!

Stevenson's long-term plan was to manufacture components for the machine tools industry – although in fact that never came about – and for the automotive industry, that is, cars and lorries. However, there was a delay of five years before that happened, because shortly before the company went into production, Stevenson was given the opportunity to make goods for hospitals and other players in the healthcare industry, so that's what we did for the first five years.

Over the years, we've expanded the premises considerably – we were lucky that the site is big enough, so moving to a new location has never been necessary. However, the layout is far from ideal for modern machinery and production methods, so we intend to carry out major refurbishment of this site over the next five years.

I'd better give you some idea of what you'll be doing during your two weeks with us, so you know what to expect. Most mornings you'll have a presentation from one of the managers, to learn about their department, starting this morning with research and development. And you'll all spend some time in each department, observing what's going on and talking to people – as long as you don't stop them from doing their work altogether! In the past, a teacher from your school has come in at the end of each week to find out how the group were getting on, but your school isn't able to arrange that this year.

OK, now I'll briefly help you to orientate yourselves around the site. As you can see, we're in the reception area, which we try to make attractive and welcoming to visitors. There's a corridor running left from here, and if you go along that, the door facing you at the end is the entrance to the coffee room. This looks out onto the main road on one side, and some trees on the other, and that'll be where you meet each morning.

The factory is the very big room on the far side of the site. Next to it is the warehouse, which can be accessed by lorries going up the road to the turning area at the end. You can get to the warehouse by crossing to the far side of the courtyard, and then the door is on your right.

Somewhere you'll be keen to find is the staff canteen. This is right next to reception. I can confidently say that the food's very good, but the view isn't. The windows on one side look onto a corridor and courtyard, which aren't very attractive at all, and on the other onto the access road, which isn't much better.

You'll be using the meeting room quite often, and you'll find it by walking along the corridor to the left of the courtyard, and continuing along it to the end. The meeting room is the last one on the right, and I'm afraid there's no natural daylight in the room.

Then you'll need to know where some of the offices are. The human resources department is at the front of this building, so you head to the left along the corridor from reception, and it's the second room you come to. It looks out onto the main road.

And finally, the boardroom, where you'll be meeting sometimes. That has quite a pleasant view, as it looks out on to the trees. Go along the corridor past the courtyard, right to the end. The boardroom is on the left, next to the factory.

OK, now are there any questions before we ...`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 20, quote: "He set up this company when he finished his apprenticeship, in 1926, although he actually started making plans two years earlier, in 1924." },
        { questionNumber: 12, timestampSeconds: 42, quote: "Stevenson was given the opportunity to make goods for hospitals and other players in the healthcare industry, so that's what we did for the first five years." },
        { questionNumber: 13, timestampSeconds: 60, quote: "moving to a new location has never been necessary... so we intend to carry out major refurbishment of this site over the next five years." },
        { questionNumber: 14, timestampSeconds: 78, quote: "Most mornings you'll have a presentation from one of the managers, to learn about their department" },
        { questionNumber: 15, timestampSeconds: 108, quote: "There's a corridor running left from here, and if you go along that, the door facing you at the end is the entrance to the coffee room. This looks out onto the main road on one side, and some trees on the other" },
        { questionNumber: 16, timestampSeconds: 128, quote: "Next to it is the warehouse, which can be accessed by lorries going up the road to the turning area at the end. You can get to the warehouse by crossing to the far side of the courtyard, and then the door is on your right." },
        { questionNumber: 17, timestampSeconds: 146, quote: "Somewhere you'll be keen to find is the staff canteen. This is right next to reception... The windows on one side look onto a corridor and courtyard... and on the other onto the access road" },
        { questionNumber: 18, timestampSeconds: 165, quote: "you'll find it by walking along the corridor to the left of the courtyard, and continuing along it to the end. The meeting room is the last one on the right, and I'm afraid there's no natural daylight in the room." },
        { questionNumber: 19, timestampSeconds: 182, quote: "The human resources department is at the front of this building, so you head to the left along the corridor from reception, and it's the second room you come to. It looks out onto the main road." },
        { questionNumber: 20, timestampSeconds: 198, quote: "Go along the corridor past the courtyard, right to the end. The boardroom is on the left, next to the factory." },
      ],
    },
    {
      id: 'c16-l1-p3',
      partNumber: 3,
      title: 'Part 3: Art project on birds',
      context: 'Two art students, Jess and Tom, discuss their bird-themed art projects, proposals, and the personal meanings of selected bird paintings.',
      audioUrl: '/audio/listening/c16_test1_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `JESS: How are you getting on with your art project, Tom?
TOM: OK. Like, they gave us the theme of birds to base our project on, and I'm not really all that interested in wildlife. But I'm starting to get into it. I've pretty well finished the introductory stage.
JESS: So have I. When they gave us all those handouts with details of books and websites to look at, I was really put off, but the more I read, the more interested I got.
TOM: Me too. I found I could research so many different aspects of birds in art – colour, movement, texture. So I was looking forward to the Bird Park visit.
JESS: What a letdown! It poured with rain and we hardly saw a single bird. Much less use than the trip to the Natural History Museum.
TOM: Yeah, I liked all the stuff about evolution there. The workshop sessions with Dr Fletcher were good too, especially the brainstorming sessions.
JESS: I missed those because I was ill. I wish we could've seen the projects last year's students did.
TOM: Mm. I suppose they want us to do our own thing, not copy.
JESS: Have you drafted your proposal yet?
TOM: Yes, but I haven't handed it in. I need to amend some parts. I've realised the notes from my research are almost all just descriptions, I haven't actually evaluated anything. So I'll have to fix that.
JESS: Oh, I didn't know we had to do that. I'll have to look at that too. Did you do a timeline for the project?
TOM: Yes, and a mind map.
JESS: Yeah, so did I. I quite enjoyed that. But it was hard having to explain the basis for my decisions in my action plan.
TOM: What?
JESS: You know, give a rationale.
TOM: I didn't realise we had to do that. OK, I can add it now. And I've done the video diary presentation, and worked out what I want my outcome to be in the project.
JESS: Someone told me it's best not to be too precise about your actual outcome at this stage, so you have more scope to explore your ideas later on. So I'm going to go back to my proposal to make it a bit more vague.
TOM: Really? OK, I'll change that too then.

TOM: One part of the project I'm unsure about is where we choose some paintings of birds and say what they mean to us. Like, I chose a painting of a falcon by Landseer. I like it because the bird's standing there with its head turned to one side, but he seems to be staring straight at you. But I can't just say it's a bit scary, can I?
JESS: You could talk about the possible danger suggested by the bird's look.
TOM: Oh, OK.
JESS: There's a picture of a fish hawk by Audubon I like. It's swooping over the water with a fish in its talons, and with great black wings which take up most of the picture.
TOM: So you could discuss it in relation to predators and food chains?
JESS: Well actually I think I'll concentrate on the impression of rapid motion it gives.
TOM: Right.
JESS: Do you know that picture of a kingfisher by van Gogh – it's perching on a reed growing near a stream.
TOM: Yes it's got these beautiful blue and red and black shades.
JESS: Mm hm. I've actually chosen it because I saw a real kingfisher once when I was little, I was out walking with my grandfather, and I've never forgotten it.
TOM: So we can use a personal link?
JESS: Sure.
TOM: OK. There's a portrait called William Wells, I can't remember the artist but it's a middle-aged man who's just shot a bird. And his expression, and the way he's holding the bird in his hand suggests he's not sure about what he's done. To me it's about how ambiguous people are in the way they exploit the natural world.
JESS: Interesting. There's Gauguin's picture Vairumati. He did it in Tahiti. It's a woman with a white bird behind her that is eating a lizard, and what I'm interested in is what idea this bird refers to. Apparently, it's a reference to the never-ending cycle of existence.
TOM: Wow. I chose a portrait of a little boy, Giovanni de Medici. He's holding a tiny bird in one fist. I like the way he's holding it carefully so he doesn't hurt it.
JESS: Ah right.`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 20, quote: "When they gave us all those handouts with details of books and websites to look at, I was really put off, but the more I read, the more interested I got. TOM: Me too." },
        { questionNumber: 22, timestampSeconds: 36, quote: "Much less use than the trip to the Natural History Museum. TOM: Yeah, I liked all the stuff about evolution there." },
        { questionNumber: 23, timestampSeconds: 60, quote: "I've realised the notes from my research are almost all just descriptions, I haven't actually evaluated anything. So I'll have to fix that. JESS: Oh, I didn't know we had to do that. I'll have to look at that too." },
        { questionNumber: 24, timestampSeconds: 88, quote: "it's best not to be too precise about your actual outcome at this stage... So I'm going to go back to my proposal to make it a bit more vague. TOM: Really? OK, I'll change that too then." },
        { questionNumber: 25, timestampSeconds: 112, quote: "You could talk about the possible danger suggested by the bird's look. TOM: Oh, OK." },
        { questionNumber: 26, timestampSeconds: 128, quote: "Well actually I think I'll concentrate on the impression of rapid motion it gives." },
        { questionNumber: 27, timestampSeconds: 146, quote: "I've actually chosen it because I saw a real kingfisher once when I was little, I was out walking with my grandfather, and I've never forgotten it." },
        { questionNumber: 28, timestampSeconds: 168, quote: "To me it's about how ambiguous people are in the way they exploit the natural world." },
        { questionNumber: 29, timestampSeconds: 185, quote: "Apparently, it's a reference to the never-ending cycle of existence." },
        { questionNumber: 30, timestampSeconds: 200, quote: "He's holding a tiny bird in one fist. I like the way he's holding it carefully so he doesn't hurt it." },
      ],
    },
    {
      id: 'c16-l1-p4',
      partNumber: 4,
      title: 'Part 4: Stoicism',
      context: 'A philosophy lecturer explains the origins, principles, influence, and modern relevance of Stoicism.',
      audioUrl: '/audio/listening/c16_test1_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Ancient philosophy is not just about talking or lecturing, or even reading long, dense books. In fact, it is something people have used throughout history – to solve their problems and to achieve their greatest triumphs.

Specifically, I am referring to Stoicism, which, in my opinion, is the most practical of all philosophies and therefore the most appealing. Stoicism was founded in Ancient Greece by Zeno of Citium in the early 3rd century BC, but was practised by the likes of Epictetus, Cato, Seneca and Marcus Aurelius. Amazingly, we still have access to these ideas, despite the fact that the most famous Stoics never wrote anything down for publication. Cato definitely didn't. Marcus Aurelius never intended his Meditations to be anything but personal. Seneca's letters were, well, letters and Epictetus' thoughts come to us by way of a note-taking student.

Stoic principles were based on the idea that its followers could have an unshakable happiness in this life and the key to achieving this was virtue. The road to virtue, in turn, lay in understanding that destructive emotions, like anger and jealousy, are under our conscious control – they don't have to control us, because we can learn to control them. In the words of Epictetus: "external events I cannot control, but the choices I make with regard to them, I do control".

The modern day philosopher and writer Nassim Nicholas Taleb defines a Stoic as someone who has a different perspective on experiences which most of us would see as wholly negative; a Stoic "transforms fear into caution, pain into transformation, mistakes into initiation and desire into undertaking". Using this definition as a model, we can see that throughout the centuries Stoicism has been practised in more recent history by kings, presidents, artists, writers and entrepreneurs.

The founding fathers of the United States were inspired by the philosophy. George Washington was introduced to Stoicism by his neighbours at age seventeen, and later, put on a play based on the life of Cato to inspire his men. Thomas Jefferson kept a copy of Seneca beside his bed.

Writers and artists have also been inspired by the stoics. Eugène Delacroix, the renowned French Romantic artist (known best for his painting Liberty Leading the People) was an ardent Stoic, referring to it as his "consoling religion".

The economist Adam Smith's theories on capitalism were significantly influenced by the Stoicism that he studied as a schoolboy, under a teacher who had translated Marcus Aurelius' works.

Today's political leaders are no different, with many finding their inspiration from the ancient texts. Former US president Bill Clinton rereads Marcus Aurelius every single year, and many have compared former President Obama's calm leadership style to that of Cato. Wen Jiabao, the former prime minister of China, claims that Meditations is one of two books he travels with and that he has read it more than one hundred times over the course of his life.

Stoicism had a profound influence on Albert Ellis, who invented Cognitive Behaviour Therapy, which is used to help people manage their problems by changing the way that they think and behave. It's most commonly used to treat depression. The idea is that we can take control of our lives by challenging the irrational beliefs that create our faulty thinking, symptoms and behaviours by using logic instead.

Stoicism has also become popular in the world of business. Stoic principles can build the resilience and state of mind required to overcome setbacks because Stoics teach turning obstacles into opportunity. A lesson every business entrepreneur needs to learn.

I would argue that studying Stoicism is as relevant today as it was 2,000 years ago, thanks to its brilliant insights into how to lead a good life. At the very root of the thinking, there is a very simple way of living – control what you can and accept what you can't. This is not as easy as it sounds and will require considerable practice – it can take a lifetime to master. The Stoics also believed the most important foundation for a good and happy life is not money, fame, power or pleasure, but having a disciplined and principled character – something which seems to resonate with many people today.`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 18, quote: "Specifically, I am referring to Stoicism, which, in my opinion, is the most practical of all philosophies and therefore the most appealing." },
        { questionNumber: 32, timestampSeconds: 35, quote: "Amazingly, we still have access to these ideas, despite the fact that the most famous Stoics never wrote anything down for publication." },
        { questionNumber: 33, timestampSeconds: 65, quote: "In the words of Epictetus: 'external events I cannot control, but the choices I make with regard to them, I do control'." },
        { questionNumber: 34, timestampSeconds: 82, quote: "defines a Stoic as someone who has a different perspective on experiences which most of us would see as wholly negative" },
        { questionNumber: 35, timestampSeconds: 108, quote: "George Washington was introduced to Stoicism by his neighbours at age seventeen, and later, put on a play based on the life of Cato to inspire his men." },
        { questionNumber: 36, timestampSeconds: 132, quote: "The economist Adam Smith's theories on capitalism were significantly influenced by the Stoicism that he studied as a schoolboy" },
        { questionNumber: 37, timestampSeconds: 168, quote: "Stoicism had a profound influence on Albert Ellis, who invented Cognitive Behaviour Therapy... It's most commonly used to treat depression." },
        { questionNumber: 38, timestampSeconds: 180, quote: "challenging the irrational beliefs that create our faulty thinking, symptoms and behaviours by using logic instead." },
        { questionNumber: 39, timestampSeconds: 196, quote: "Stoics teach turning obstacles into opportunity. A lesson every business entrepreneur needs to learn." },
        { questionNumber: 40, timestampSeconds: 215, quote: "This is not as easy as it sounds and will require considerable practice – it can take a lifetime to master." },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-10 (Notes Completion)
    {
      id: 'c16-l1-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `Children's Engineering Workshops

Tiny Engineers (ages 4–5)
Activities
• Create a cover for an [[1]] so they can drop it from a height without breaking it.
• Take part in a competition to build the tallest [[2]].
• Make a [[3]] powered by a balloon.

Junior Engineers (ages 6–8)
Activities:
• Build model cars, trucks and [[4]] and learn how to program them so they can move.
• Take part in a competition to build the longest [[5]] using card and wood.
• Create a short [[6]] with special software.
• Build, [[7]] and program a humanoid robot.

Cost for a five-week block: £50
Held on [[8]] from 10 am to 11 am

Location
Building 10A, [[9]] Industrial Estate, Grasford
Plenty of [[10]] is available.`,
      questions: [
        {
          id: 'c16-l1-q1',
          questionNumber: 1,
          prompt: 'Create a cover for an [1] so they can drop it from a height without breaking it.',
          answerKey: 'egg',
          acceptedAlternatives: ['egg'],
          explanation: "Sarah explains: 'they work together to design a special cover that goes round an egg, so that when it's inside they can drop it from a height and it doesn't break.'",
          transcriptExcerpt: "they work together to design a special cover that goes round an egg, so that when it's inside they can drop it from a height and it doesn't break.",
          audioTimestampSeconds: 18,
        },
        {
          id: 'c16-l1-q2',
          questionNumber: 2,
          prompt: 'Take part in a competition to build the tallest [2].',
          answerKey: 'tower',
          acceptedAlternatives: ['tower'],
          explanation: "Sarah says: 'they have a competition to see who can make the highest tower.'",
          transcriptExcerpt: "they have a competition to see who can make the highest tower.",
          audioTimestampSeconds: 32,
        },
        {
          id: 'c16-l1-q3',
          questionNumber: 3,
          prompt: 'Make a [3] powered by a balloon.',
          answerKey: 'car',
          acceptedAlternatives: ['car'],
          explanation: "Sarah mentions: 'one thing they do is to design and build a car that's attached to a balloon, and the force of the air in that actually powers the car and makes it move along.'",
          transcriptExcerpt: "one thing they do is to design and build a car that's attached to a balloon, and the force of the air in that actually powers the car",
          audioTimestampSeconds: 42,
        },
        {
          id: 'c16-l1-q4',
          questionNumber: 4,
          prompt: 'Build model cars, trucks and [4] and learn how to program them so they can move.',
          answerKey: 'animals',
          acceptedAlternatives: ['animals'],
          explanation: "Sarah says: 'they work out how to build model vehicles, things like cars and trucks, but also how to construct animals using the same sorts of material and technique, and then they learn how they can program them and make them move.'",
          transcriptExcerpt: "they work out how to build model vehicles, things like cars and trucks, but also how to construct animals",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c16-l1-q5',
          questionNumber: 5,
          prompt: 'Take part in a competition to build the longest [5] using card and wood.',
          answerKey: 'bridge',
          acceptedAlternatives: ['bridge'],
          explanation: "Sarah says: 'with the Junior Engineers, it's to use recycled materials like card and wood to build a bridge, and the longest one gets a prize.'",
          transcriptExcerpt: "with the Junior Engineers, it's to use recycled materials like card and wood to build a bridge, and the longest one gets a prize.",
          audioTimestampSeconds: 86,
        },
        {
          id: 'c16-l1-q6',
          questionNumber: 6,
          prompt: 'Create a short [6] with special software.',
          answerKey: 'movie',
          acceptedAlternatives: ['movie', 'film'],
          explanation: "Sarah explains: 'think up an idea for a five-minute movie and then film it, using special animation software.'",
          transcriptExcerpt: "think up an idea for a five-minute movie and then film it, using special animation software.",
          audioTimestampSeconds: 98,
        },
        {
          id: 'c16-l1-q7',
          questionNumber: 7,
          prompt: 'Build, [7] and program a humanoid robot.',
          answerKey: 'decorate',
          acceptedAlternatives: ['decorate'],
          explanation: "Sarah notes: 'they also build a robot in the shape of a human, and they decorate it and program it so that it can move its arms and legs.'",
          transcriptExcerpt: "they also build a robot in the shape of a human, and they decorate it and program it",
          audioTimestampSeconds: 112,
        },
        {
          id: 'c16-l1-q8',
          questionNumber: 8,
          prompt: 'Held on [8] from 10 am to 11 am',
          answerKey: 'Wednesdays',
          acceptedAlternatives: ['Wednesdays', 'wednesdays', 'Wednesday', 'wednesday'],
          explanation: "Sarah states: 'so we moved them to Wednesdays. The classes are held in the morning from ten to eleven.'",
          transcriptExcerpt: "so we moved them to Wednesdays. The classes are held in the morning from ten to eleven.",
          audioTimestampSeconds: 128,
        },
        {
          id: 'c16-l1-q9',
          questionNumber: 9,
          prompt: 'Building 10A, [9] Industrial Estate, Grasford',
          answerKey: 'Fradstone',
          acceptedAlternatives: ['Fradstone', 'fradstone'],
          explanation: "Sarah says: 'They're in building 10A... and that's in Fradstone Industrial Estate. Fradstone – that's F-R-A-D-S-T-O-N-E.'",
          transcriptExcerpt: "They're in building 10A – there's a big sign on the door, you can't miss it, and that's in Fradstone Industrial Estate.",
          audioTimestampSeconds: 142,
        },
        {
          id: 'c16-l1-q10',
          questionNumber: 10,
          prompt: 'Plenty of [10] is available.',
          answerKey: 'parking',
          acceptedAlternatives: ['parking'],
          explanation: "When the father asks 'And will I have any parking problems there?', Sarah replies: 'No, there's always plenty available.'",
          transcriptExcerpt: "And will I have any parking problems there? No, there's always plenty available.",
          audioTimestampSeconds: 158,
        },
      ],
    },

    // PART 2: Questions 11-14 (Multiple Choice)
    {
      id: 'c16-l1-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 11–14',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 11,
      endQuestionNumber: 14,
      questions: [
        {
          id: 'c16-l1-q11',
          questionNumber: 11,
          prompt: "Stevenson's was founded in",
          options: MC_Q11_OPTIONS,
          answerKey: 'C',
          explanation: "Julia explains: 'Ronald Stevenson, went into the steel industry when he left school – that was in 1923. He set up this company when he finished his apprenticeship, in 1926, although he actually started making plans two years earlier, in 1924.' Thus, it was founded in 1926 (C).",
          transcriptExcerpt: "He set up this company when he finished his apprenticeship, in 1926, although he actually started making plans two years earlier, in 1924.",
          audioTimestampSeconds: 20,
        },
        {
          id: 'c16-l1-q12',
          questionNumber: 12,
          prompt: "Originally, Stevenson's manufactured goods for",
          options: MC_Q12_OPTIONS,
          answerKey: 'A',
          explanation: "Julia states that although his long-term plan was machine tools and automotive components, 'shortly before the company went into production, Stevenson was given the opportunity to make goods for hospitals and other players in the healthcare industry, so that's what we did for the first five years' (A).",
          transcriptExcerpt: "Stevenson was given the opportunity to make goods for hospitals and other players in the healthcare industry, so that's what we did for the first five years.",
          audioTimestampSeconds: 42,
        },
        {
          id: 'c16-l1-q13',
          questionNumber: 13,
          prompt: 'What does the speaker say about the company premises?',
          options: MC_Q13_OPTIONS,
          answerKey: 'B',
          explanation: "Julia notes: 'we were lucky that the site is big enough, so moving to a new location has never been necessary... so we intend to carry out major refurbishment of this site over the next five years.' Therefore, the company has no plans to move (B).",
          transcriptExcerpt: "moving to a new location has never been necessary... so we intend to carry out major refurbishment of this site over the next five years.",
          audioTimestampSeconds: 60,
        },
        {
          id: 'c16-l1-q14',
          questionNumber: 14,
          prompt: 'The programme for the work experience group includes',
          options: MC_Q14_OPTIONS,
          answerKey: 'C',
          explanation: "Julia tells the group: 'Most mornings you'll have a presentation from one of the managers, to learn about their department' (talks by staff, C). Students only observe departments rather than doing research, and a teacher is not coming in this year.",
          transcriptExcerpt: "Most mornings you'll have a presentation from one of the managers, to learn about their department",
          audioTimestampSeconds: 78,
        },
      ],
    },

    // PART 2: Questions 15-20 (Map Labelling)
    {
      id: 'c16-l1-g3',
      partNumber: 2,
      questionType: 'plan_map_diagram_labelling',
      title: 'Questions 15–20',
      instructions: 'Label the map below.\nWrite the correct letter, A–J, next to Questions 15–20.',
      startQuestionNumber: 15,
      endQuestionNumber: 20,
      mapData: {
        imageUrl: 'https://res.cloudinary.com/pkwpxicd/image/upload/v1794726490/Cambridge_Academic_16_Listening_Map_Test_1.png',
      },
      optionsList: MAP_OPTIONS,
      questions: [
        {
          id: 'c16-l1-q15',
          questionNumber: 15,
          prompt: 'coffee room',
          options: MAP_OPTIONS,
          answerKey: 'H',
          explanation: "From reception, 'There's a corridor running left from here, and if you go along that, the door facing you at the end is the entrance to the coffee room. This looks out onto the main road on one side, and some trees on the other.' This is room H.",
          transcriptExcerpt: "There's a corridor running left from here, and if you go along that, the door facing you at the end is the entrance to the coffee room. This looks out onto the main road on one side, and some trees on the other",
          audioTimestampSeconds: 108,
        },
        {
          id: 'c16-l1-q16',
          questionNumber: 16,
          prompt: 'warehouse',
          options: MAP_OPTIONS,
          answerKey: 'C',
          explanation: "Julia explains: 'The factory is the very big room on the far side of the site. Next to it is the warehouse, which can be accessed by lorries going up the road to the turning area at the end. You can get to the warehouse by crossing to the far side of the courtyard, and then the door is on your right.' This is room C.",
          transcriptExcerpt: "Next to it is the warehouse, which can be accessed by lorries going up the road to the turning area at the end. You can get to the warehouse by crossing to the far side of the courtyard, and then the door is on your right.",
          audioTimestampSeconds: 128,
        },
        {
          id: 'c16-l1-q17',
          questionNumber: 17,
          prompt: 'staff canteen',
          options: MAP_OPTIONS,
          answerKey: 'G',
          explanation: "Julia notes: 'Somewhere you'll be keen to find is the staff canteen. This is right next to reception... The windows on one side look onto a corridor and courtyard... and on the other onto the access road.' This is room G.",
          transcriptExcerpt: "Somewhere you'll be keen to find is the staff canteen. This is right next to reception... The windows on one side look onto a corridor and courtyard... and on the other onto the access road",
          audioTimestampSeconds: 146,
        },
        {
          id: 'c16-l1-q18',
          questionNumber: 18,
          prompt: 'meeting room',
          options: MAP_OPTIONS,
          answerKey: 'B',
          explanation: "Julia says: 'you'll find it by walking along the corridor to the left of the courtyard, and continuing along it to the end. The meeting room is the last one on the right, and I'm afraid there's no natural daylight in the room.' This is room B.",
          transcriptExcerpt: "you'll find it by walking along the corridor to the left of the courtyard, and continuing along it to the end. The meeting room is the last one on the right, and I'm afraid there's no natural daylight in the room.",
          audioTimestampSeconds: 165,
        },
        {
          id: 'c16-l1-q19',
          questionNumber: 19,
          prompt: 'human resources',
          options: MAP_OPTIONS,
          answerKey: 'I',
          explanation: "Julia states: 'The human resources department is at the front of this building, so you head to the left along the corridor from reception, and it's the second room you come to. It looks out onto the main road.' Going left from reception, J is the first room and I is the second room.",
          transcriptExcerpt: "The human resources department is at the front of this building, so you head to the left along the corridor from reception, and it's the second room you come to. It looks out onto the main road.",
          audioTimestampSeconds: 182,
        },
        {
          id: 'c16-l1-q20',
          questionNumber: 20,
          prompt: 'boardroom',
          options: MAP_OPTIONS,
          answerKey: 'A',
          explanation: "Julia finishes: 'And finally, the boardroom... looks out on to the trees. Go along the corridor past the courtyard, right to the end. The boardroom is on the left, next to the factory.' This is room A.",
          transcriptExcerpt: "Go along the corridor past the courtyard, right to the end. The boardroom is on the left, next to the factory.",
          audioTimestampSeconds: 198,
        },
      ],
    },

    // PART 3: Questions 21-22 (Multiple Choice - Pick 2)
    {
      id: 'c16-l1-g4',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO parts of the introductory stage to their art projects do Jess and Tom agree were useful?',
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q21_OPTIONS,
      questions: [
        multiQuestion(
          'c16-l1-q21',
          21,
          'Which TWO parts of the introductory stage to their art projects do Jess and Tom agree were useful? (First choice)',
          MC_Q21_OPTIONS,
          ['C', 'E'],
          "Jess and Tom both agree the handouts with details of books and websites got them interested in researching ('the more I read, the more interested I got. TOM: Me too', E), and both found the Natural History Museum visit useful ('Much less use than the trip to the Natural History Museum. TOM: Yeah, I liked all the stuff about evolution there', C).",
          "When they gave us all those handouts with details of books and websites to look at, I was really put off, but the more I read, the more interested I got. TOM: Me too... Much less use than the trip to the Natural History Museum. TOM: Yeah, I liked all the stuff about evolution there.",
          20
        ),
        multiQuestion(
          'c16-l1-q22',
          22,
          'Which TWO parts of the introductory stage to their art projects do Jess and Tom agree were useful? (Second choice)',
          MC_Q21_OPTIONS,
          ['C', 'E'],
          "Jess and Tom both agree the handouts with details of books and websites got them interested in researching ('the more I read, the more interested I got. TOM: Me too', E), and both found the Natural History Museum visit useful ('Much less use than the trip to the Natural History Museum. TOM: Yeah, I liked all the stuff about evolution there', C).",
          "When they gave us all those handouts with details of books and websites to look at, I was really put off, but the more I read, the more interested I got. TOM: Me too... Much less use than the trip to the Natural History Museum. TOM: Yeah, I liked all the stuff about evolution there.",
          36
        ),
      ],
    },

    // PART 3: Questions 23-24 (Multiple Choice - Pick 2)
    {
      id: 'c16-l1-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions: 'Choose TWO letters, A–E.\nIn which TWO ways do both Jess and Tom decide to change their proposals?',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q23_OPTIONS,
      questions: [
        multiQuestion(
          'c16-l1-q23',
          23,
          'In which TWO ways do both Jess and Tom decide to change their proposals? (First choice)',
          MC_Q23_OPTIONS,
          ['B', 'E'],
          "Tom says his research notes are all descriptions and he hasn't evaluated anything so he'll fix that, and Jess says 'I'll have to look at that too' (making their notes more evaluative, E). Then Jess says she is going back to her proposal to make her outcome 'a bit more vague' (less specific about the outcome, B), and Tom replies 'OK, I'll change that too then.'",
          "I've realised the notes from my research are almost all just descriptions, I haven't actually evaluated anything. So I'll have to fix that. JESS: Oh, I didn't know we had to do that. I'll have to look at that too... So I'm going to go back to my proposal to make it a bit more vague. TOM: Really? OK, I'll change that too then.",
          60
        ),
        multiQuestion(
          'c16-l1-q24',
          24,
          'In which TWO ways do both Jess and Tom decide to change their proposals? (Second choice)',
          MC_Q23_OPTIONS,
          ['B', 'E'],
          "Tom says his research notes are all descriptions and he hasn't evaluated anything so he'll fix that, and Jess says 'I'll have to look at that too' (making their notes more evaluative, E). Then Jess says she is going back to her proposal to make her outcome 'a bit more vague' (less specific about the outcome, B), and Tom replies 'OK, I'll change that too then.'",
          "I've realised the notes from my research are almost all just descriptions, I haven't actually evaluated anything. So I'll have to fix that. JESS: Oh, I didn't know we had to do that. I'll have to look at that too... So I'm going to go back to my proposal to make it a bit more vague. TOM: Really? OK, I'll change that too then.",
          88
        ),
      ],
    },

    // PART 3: Questions 25-30 (Matching)
    {
      id: 'c16-l1-g6',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 25–30',
      instructions: 'Which personal meaning do the students decide to give to each of the following pictures?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.',
      startQuestionNumber: 25,
      endQuestionNumber: 30,
      optionsList: MATCHING_Q25_OPTIONS,
      questions: [
        {
          id: 'c16-l1-q25',
          questionNumber: 25,
          prompt: 'Falcon (Landseer)',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'D',
          explanation: "Jess suggests: 'You could talk about the possible danger suggested by the bird's look', and Tom agrees: 'Oh, OK' (a potential threat, D).",
          transcriptExcerpt: "You could talk about the possible danger suggested by the bird's look. TOM: Oh, OK.",
          audioTimestampSeconds: 112,
        },
        {
          id: 'c16-l1-q26',
          questionNumber: 26,
          prompt: 'Fish hawk (Audubon)',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'C',
          explanation: "Jess states: 'Well actually I think I'll concentrate on the impression of rapid motion it gives' (fast movement, C).",
          transcriptExcerpt: "Well actually I think I'll concentrate on the impression of rapid motion it gives.",
          audioTimestampSeconds: 128,
        },
        {
          id: 'c16-l1-q27',
          questionNumber: 27,
          prompt: 'Kingfisher (van Gogh)',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'A',
          explanation: "Jess explains: 'I've actually chosen it because I saw a real kingfisher once when I was little, I was out walking with my grandfather, and I've never forgotten it' (a childhood memory, A).",
          transcriptExcerpt: "I've actually chosen it because I saw a real kingfisher once when I was little, I was out walking with my grandfather, and I've never forgotten it.",
          audioTimestampSeconds: 146,
        },
        {
          id: 'c16-l1-q28',
          questionNumber: 28,
          prompt: 'Portrait of William Wells',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'H',
          explanation: "Tom says the man's expression 'suggests he's not sure about what he's done. To me it's about how ambiguous people are in the way they exploit the natural world' (a confused attitude to nature, H).",
          transcriptExcerpt: "To me it's about how ambiguous people are in the way they exploit the natural world.",
          audioTimestampSeconds: 168,
        },
        {
          id: 'c16-l1-q29',
          questionNumber: 29,
          prompt: 'Vairumati (Gauguin)',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'F',
          explanation: "Jess notes: 'Apparently, it's a reference to the never-ending cycle of existence' (the continuity of life, F).",
          transcriptExcerpt: "Apparently, it's a reference to the never-ending cycle of existence.",
          audioTimestampSeconds: 185,
        },
        {
          id: 'c16-l1-q30',
          questionNumber: 30,
          prompt: 'Portrait of Giovanni de Medici',
          options: MATCHING_Q25_OPTIONS,
          answerKey: 'G',
          explanation: "Tom describes: 'He's holding a tiny bird in one fist. I like the way he's holding it carefully so he doesn't hurt it' (protection of nature, G).",
          transcriptExcerpt: "He's holding a tiny bird in one fist. I like the way he's holding it carefully so he doesn't hurt it.",
          audioTimestampSeconds: 200,
        },
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c16-l1-g7',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Stoicism

Stoicism is still relevant today because of its [[31]] appeal.

Ancient Stoics
• Stoicism was founded over 2,000 years ago in Greece.
• The Stoics' ideas are surprisingly well known, despite not being intended for [[32]].

Stoic principles
• Happiness could be achieved by leading a virtuous life.
• Controlling emotions was essential.
• Epictetus said that external events cannot be controlled but the [[33]] people make in response can be controlled.
• A Stoic is someone who has a different view on experiences which others would consider as [[34]].

The influence of Stoicism
• George Washington organised a [[35]] about Cato to motivate his men.
• The French artist Delacroix was a Stoic.
• Adam Smith's ideas on [[36]] were influenced by Stoicism.
• Some of today's political leaders are inspired by the Stoics.
• Cognitive Behaviour Therapy (CBT)
  – the treatment for [[37]] is based on ideas from Stoicism
  – people learn to base their thinking on [[38]].
• In business, people benefit from Stoicism by identifying obstacles as [[39]].

Relevance of Stoicism
• It requires a lot of [[40]] but Stoicism can help people to lead a good life.
• It teaches people that having a strong character is more important than anything else.`,
      questions: [
        {
          id: 'c16-l1-q31',
          questionNumber: 31,
          prompt: 'Stoicism is still relevant today because of its [31] appeal.',
          answerKey: 'practical',
          acceptedAlternatives: ['practical'],
          explanation: "The lecturer states: 'Specifically, I am referring to Stoicism, which, in my opinion, is the most practical of all philosophies and therefore the most appealing.'",
          transcriptExcerpt: "Specifically, I am referring to Stoicism, which, in my opinion, is the most practical of all philosophies and therefore the most appealing.",
          audioTimestampSeconds: 18,
        },
        {
          id: 'c16-l1-q32',
          questionNumber: 32,
          prompt: "The Stoics' ideas are surprisingly well known, despite not being intended for [32].",
          answerKey: 'publication',
          acceptedAlternatives: ['publication'],
          explanation: "The lecturer notes: 'Amazingly, we still have access to these ideas, despite the fact that the most famous Stoics never wrote anything down for publication.'",
          transcriptExcerpt: "Amazingly, we still have access to these ideas, despite the fact that the most famous Stoics never wrote anything down for publication.",
          audioTimestampSeconds: 35,
        },
        {
          id: 'c16-l1-q33',
          questionNumber: 33,
          prompt: 'Epictetus said that external events cannot be controlled but the [33] people make in response can be controlled.',
          answerKey: 'choices',
          acceptedAlternatives: ['choices'],
          explanation: "The lecturer quotes Epictetus: 'external events I cannot control, but the choices I make with regard to them, I do control'.",
          transcriptExcerpt: "In the words of Epictetus: 'external events I cannot control, but the choices I make with regard to them, I do control'.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c16-l1-q34',
          questionNumber: 34,
          prompt: 'A Stoic is someone who has a different view on experiences which others would consider as [34].',
          answerKey: 'negative',
          acceptedAlternatives: ['negative'],
          explanation: "The lecturer says Nassim Nicholas Taleb 'defines a Stoic as someone who has a different perspective on experiences which most of us would see as wholly negative'.",
          transcriptExcerpt: "defines a Stoic as someone who has a different perspective on experiences which most of us would see as wholly negative",
          audioTimestampSeconds: 82,
        },
        {
          id: 'c16-l1-q35',
          questionNumber: 35,
          prompt: 'George Washington organised a [35] about Cato to motivate his men.',
          answerKey: 'play',
          acceptedAlternatives: ['play'],
          explanation: "The lecturer mentions: 'George Washington was introduced to Stoicism by his neighbours at age seventeen, and later, put on a play based on the life of Cato to inspire his men.'",
          transcriptExcerpt: "George Washington was introduced to Stoicism by his neighbours at age seventeen, and later, put on a play based on the life of Cato to inspire his men.",
          audioTimestampSeconds: 108,
        },
        {
          id: 'c16-l1-q36',
          questionNumber: 36,
          prompt: "Adam Smith's ideas on [36] were influenced by Stoicism.",
          answerKey: 'capitalism',
          acceptedAlternatives: ['capitalism'],
          explanation: "The lecturer states: 'The economist Adam Smith's theories on capitalism were significantly influenced by the Stoicism that he studied as a schoolboy'.",
          transcriptExcerpt: "The economist Adam Smith's theories on capitalism were significantly influenced by the Stoicism that he studied as a schoolboy",
          audioTimestampSeconds: 132,
        },
        {
          id: 'c16-l1-q37',
          questionNumber: 37,
          prompt: 'the treatment for [37] is based on ideas from Stoicism',
          answerKey: 'depression',
          acceptedAlternatives: ['depression'],
          explanation: "Regarding Cognitive Behaviour Therapy (CBT), the lecturer explains: 'It's most commonly used to treat depression.'",
          transcriptExcerpt: "Stoicism had a profound influence on Albert Ellis, who invented Cognitive Behaviour Therapy... It's most commonly used to treat depression.",
          audioTimestampSeconds: 168,
        },
        {
          id: 'c16-l1-q38',
          questionNumber: 38,
          prompt: 'people learn to base their thinking on [38].',
          answerKey: 'logic',
          acceptedAlternatives: ['logic'],
          explanation: "The lecturer says: 'The idea is that we can take control of our lives by challenging the irrational beliefs that create our faulty thinking, symptoms and behaviours by using logic instead.'",
          transcriptExcerpt: "challenging the irrational beliefs that create our faulty thinking, symptoms and behaviours by using logic instead.",
          audioTimestampSeconds: 180,
        },
        {
          id: 'c16-l1-q39',
          questionNumber: 39,
          prompt: 'In business, people benefit from Stoicism by identifying obstacles as [39].',
          answerKey: 'opportunity',
          acceptedAlternatives: ['opportunity', 'opportunities'],
          explanation: "The lecturer highlights: 'Stoic principles can build the resilience and state of mind required to overcome setbacks because Stoics teach turning obstacles into opportunity.'",
          transcriptExcerpt: "Stoics teach turning obstacles into opportunity. A lesson every business entrepreneur needs to learn.",
          audioTimestampSeconds: 196,
        },
        {
          id: 'c16-l1-q40',
          questionNumber: 40,
          prompt: 'It requires a lot of [40] but Stoicism can help people to lead a good life.',
          answerKey: 'practice',
          acceptedAlternatives: ['practice', 'practise'],
          explanation: "The lecturer concludes: 'This is not as easy as it sounds and will require considerable practice – it can take a lifetime to master.'",
          transcriptExcerpt: "This is not as easy as it sounds and will require considerable practice – it can take a lifetime to master.",
          audioTimestampSeconds: 215,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 16 Academic Listening Test 1',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c16_test1_part1.mp3', durationSeconds: 180 },
        { partNumber: 2, audioUrl: '/audio/listening/c16_test1_part2.mp3', durationSeconds: 220 },
        { partNumber: 3, audioUrl: '/audio/listening/c16_test1_part3.mp3', durationSeconds: 230 },
        { partNumber: 4, audioUrl: '/audio/listening/c16_test1_part4.mp3', durationSeconds: 240 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge16ListeningTest1(authorId?: string) {
  const data = getCambridge16ListeningTest1Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 16 Listening Test 1 validation failed: ${validationErrors.join('; ')}`);
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
