import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, ListeningTest } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

export function getCambridge21ListeningTest1Data(): {
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
      id: 'c21-l1-p1',
      partNumber: 1,
      title: 'Part 1: Oyster Bay Sailing Club Courses',
      context: 'An enquiry about sailing courses at the Oyster Bay Sailing Club.',
      audioUrl: '/audio/listening/c21_test1_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `WOMAN: Hello, Oyster Bay Sailing Club. How can I help you?
MAN: Oh hi. I'd like to find out about sailing courses for beginners.
WOMAN: No problem. Is it for yourself?
MAN: Yes. I had a look online but I'm not sure which course would be best.
WOMAN: OK. Well you might be interested in our Taster Days?
MAN: Possibly.
WOMAN: So these are for people who've never sailed before – it's basically an introduction to sailing to find out whether you enjoy it and want to carry on with it.
MAN: And how much is that?
WOMAN: It's £120 for the day – but it's reduced to £110 each if there are two of you.
MAN: No, it would just be me.
WOMAN: Oh that's fine. You'd be in a small group, usually about eight people but no more than ten – and everyone's always very friendly.
MAN: Uh huh. And are there any other suitable courses?
WOMAN: The other option is the Level 1 course. These are two-day weekend courses and we run those all year round.
MAN: OK. And what do you learn on that course?
WOMAN: This is a mix of theory and practical skills. So you learn about things like the weather, which is obviously really important and also the tides, as well as learning basic sailing skills. You go out into the harbour in special training dinghies for beginners, two people in each dinghy and an instructor. He or she will make sure you understand everything you need to know about safety.
MAN: It sounds like hard work!
WOMAN: Yes, but you'll have a lot of fun too.
MAN: And the cost of that one is...?
WOMAN: £200. But it's a bit cheaper if you decide to join the club. There's a discount for members.
MAN: Well, I'm not sure about that yet.
WOMAN: You've got plenty of time to decide.
MAN: And does the cost include everything?
WOMAN: Yes, everything's included and you also get a really good dictionary explaining all the sailing terminology. A lot of people struggle with this at first. It's got lots of pictures, so I'm sure you'd find it really helpful. And on completion of the course you get a certificate. Then you're ready to move on to the Level 2 course.
MAN: Sounds good.
WOMAN: I think that's all the info you need for now. Just a couple of general things. For example, it's really important that you know how to swim.
MAN: Yes, I'm pretty confident in the water.
WOMAN: Great. The other thing I should tell you is that we provide wetsuits and life jackets but you need to bring swimming trunks and some old trainers.
MAN: And a towel?
WOMAN: Yes definitely. And you might want to bring your own toiletries, things like shampoo.
MAN: OK. What about food and drink? Do I need to bring that or is there a café at the club?
WOMAN: Yes, you can get sandwiches, cakes and snacks there. The food's pretty reasonable.
MAN: OK good. Well I think I'm interested in the Level 1 course. But I know absolutely nothing about sailing so is there anything I can do to prepare myself a bit?
WOMAN: I recommend you watch some videos we use for training. They're available online. I can send you the link. They'll give you an idea of what to expect.
MAN: Perfect, thanks. That would be very helpful. Oh and just one other thing – I'll be cycling to the club and will need somewhere to put valuables. I'm just wondering if there are lockers for people to use?
WOMAN: Yes, there are plenty in the changing rooms.
MAN: Great. OK well could you book me onto...`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 25, quote: 'usually about eight people but no more than ten' },
        { questionNumber: 2, timestampSeconds: 38, quote: 'learn about things like the weather, which is obviously really important and also the tides' },
        { questionNumber: 3, timestampSeconds: 46, quote: 'make sure you understand everything you need to know about safety' },
        { questionNumber: 4, timestampSeconds: 55, quote: "There's a discount for members" },
        { questionNumber: 5, timestampSeconds: 68, quote: 'you also get a really good dictionary explaining all the sailing terminology' },
        { questionNumber: 6, timestampSeconds: 78, quote: 'on completion of the course you get a certificate' },
        { questionNumber: 7, timestampSeconds: 96, quote: 'And a towel? Yes definitely.' },
        { questionNumber: 8, timestampSeconds: 104, quote: 'is there a café at the club?' },
        { questionNumber: 9, timestampSeconds: 118, quote: 'I recommend you watch some videos we use for training' },
        { questionNumber: 10, timestampSeconds: 130, quote: "wondering if there are lockers for people to use? Yes, there are plenty" },
      ],
    },
    {
      id: 'c21-l1-p2',
      partNumber: 2,
      title: 'Part 2: Working as a Makeup Trainee',
      context: 'A talk by an experienced professional about working as a makeup trainee in film and television.',
      audioUrl: '/audio/listening/c21_test1_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `MAN: Hello and welcome to the film making podcast. In this week's episode, Claire Lemarre talks to us about how to become a makeup artist. Claire's been working as a makeup artist in the film industry for over 20 years and has lots of useful advice about how to get started.
WOMAN: Thanks Ian. Well, before you can become a makeup artist on films you have to spend about 2 years working as a makeup trainee.
A good place to get your first job would be on a low budget short film. Of course, this means that you'll be working for free. But it's often worth it for the experience. Make sure your transport costs are covered – and remember, there's very unlikely to be any catering provided, so bring plenty of food.
If you're lucky, you might start out on a big budget film where you'll get the most useful experience. On productions like this, makeup and hair styling are separate departments – so you won't need to bring your curling tongs! But you're likely to get the opportunity to work with a range of age groups, as well as different ethnicities. Doing makeup for special effects is highly specialised, so don't expect to be offered any practical experience in that.
One problem with working in the makeup department is that it's a high-pressure environment. There are very few times when you'll be bored or have nothing to do. It can be stressful but you'll see that the top makeup artists are very professional – even when they're having to work with directors who are impatient, or unhappy with the makeup artist's work. Follow your supervisor's lead and try to remain calm at all times.
I've worked with many very famous actors over the years. At first, I found it overwhelming and could hardly speak, I was so in awe. That's preferable, by the way, to becoming too excited and asking for selfies. Now meeting the talent is just a normal part of the job and to be honest most actors don't look that special without all the makeup!
Every makeup trainee will need a makeup kit, which they'll be expected to have with them at all times. Just the essentials will do for the kinds of tasks you'll be given – it won't be anything complicated. It's worth looking at what the other makeup artists have in their kits – but whatever you do, don't borrow anything without asking first.
It's very important to build your portfolio. You should take photos of all the work you do and ideally show the different stages of makeup application if you can. But remember you'll need to get approval from the makeup designer in charge of the department. As you'll be sending your portfolio digitally, you won't need to get photos printed.
So what does a makeup trainee actually do? You need to think about whether you're the right kind of person to do the job and whether you'd enjoy it. So, to give you some idea, here are some of the things you might be required to do.
You may be asked to help prep an actor ready for makeup. Some actors will arrive having already cleansed and moisturized their skin. But sometimes you'll need to step in and get this done without wasting any time, otherwise the makeup artist will get behind schedule.
Trainees play a useful role in continuity. It will be your responsibility to take photos, log them digitally and print out a hard copy to put in each actor's file. This information needs to be kept in good order as a reshoot can mean replicating makeup months later.
General duties mean doing anything from getting the teas and coffees to putting on a wash. Having a positive attitude and being willing to do whatever is asked of you will help you get your next film job.
You won't be asked to apply makeup to any of the principal cast, only the extras. If there are dozens of extras involved you'll need to keep up a swift pace and not spend too long on each person. It takes quite a lot of confidence to be able to do this well.
OK now about terms and conditions....`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 28, quote: 'Make sure your transport costs are covered' },
        { questionNumber: 12, timestampSeconds: 42, quote: 'opportunity to work with a range of age groups, as well as different ethnicities' },
        { questionNumber: 13, timestampSeconds: 61, quote: "work with directors who are impatient, or unhappy with the makeup artist's work" },
        { questionNumber: 14, timestampSeconds: 78, quote: 'At first, I found it overwhelming and could hardly speak, I was so in awe' },
        { questionNumber: 15, timestampSeconds: 94, quote: "Every makeup trainee will need a makeup kit, which they'll be expected to have with them at all times" },
        { questionNumber: 16, timestampSeconds: 110, quote: "remember you'll need to get approval from the makeup designer in charge of the department" },
        { questionNumber: 17, timestampSeconds: 132, quote: 'step in and get this done without wasting any time' },
        { questionNumber: 18, timestampSeconds: 146, quote: 'This information needs to be kept in good order' },
        { questionNumber: 19, timestampSeconds: 158, quote: 'Having a positive attitude and being willing to do whatever is asked of you' },
        { questionNumber: 20, timestampSeconds: 170, quote: "you'll need to keep up a swift pace and not spend too long on each person" },
      ],
    },
    {
      id: 'c21-l1-p3',
      partNumber: 3,
      title: 'Part 3: Ocean Biodiversity Lecture and Research Project',
      context: 'Two students discussing a university lecture and evaluating resources on ocean biodiversity.',
      audioUrl: '/audio/listening/c21_test1_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `PHIL: That lecture from the visiting speaker yesterday was good, wasn't it?
LUCY: Yeah. I learned a lot from her about ocean biodiversity. I've already done some reading on it, and I did an assignment on some of the problems associated with it last year, but I especially liked the way her lecture focused on more long-term issues.
PHIL: Yes, things that aren't currently receiving widespread attention but are likely to be important in the future. That impressed me too. It wasn't exactly a feel-good conclusion because it's hard to see any real solution for a lot of the problems.
LUCY: No, though she did point to where policy changes could be made to protect our marine and coastal environments.
PHIL: Mm. But that's just at a national level. The examples she gave were at a more global level, and they really made it clear to me just how wide-ranging the threats to ocean biodiversity are.
LUCY: Yes, me too.
PHIL: The research project she described was impressive, wasn't it? I'd have thought it was quite unusual to have so many experts working together.
LUCY: Yeah, and from such different backgrounds. Must have been a really exciting team to work with. I'd heard of a couple of them before – they were involved in research way back in 2009 warning about the dangers of ocean pollution.
PHIL: But now people are much more aware of that, aren't they?
LUCY: I suppose so.
PHIL: Another thing about the research is that the team members came from all round the world. Though I suppose that's not unusual nowadays, now everyone can work remotely.
LUCY: Right. I liked the way she didn't bombard us with figures – I mean, they were available, but she focused more on the general points they indicated.
PHIL: Mm. And the description of improvements in systems used for tracking marine animals and things like robots were really interesting.
LUCY: Yes, and her description of how robotics can be used to investigate threats to biodiversity.
PHIL: Absolutely.

PHIL: While you're here, can we talk about the list of resources we have to evaluate for the seminar tomorrow. I've had a look at them all, but it's been a bit of a rush.
LUCY: Yeah. What did you think of that article on invasive lionfish? The one claiming they were expanding their habitat throughout the Mediterranean Sea.
PHIL: Well, the writer went on about how dangerous they were in environmental terms, which is probably true, but he didn't really provide much information to explain why.
LUCY: I know what you mean.
PHIL: I watched the documentary on microplastics, at least I started to, but then I found it was made ten years ago so I gave up.
LUCY: I watched to the end but you're right, it was showing its age. People had hardly heard of microplastics then, whereas now everyone knows about them and how dangerous they are.
PHIL: Yeah. Did you listen to the podcast on ocean pollution?
LUCY: Mm. I didn't get anything out of it though. Most of it was stating the obvious.
PHIL: Yes, it mentioned pesticides and plastic and things, and it clearly made the point that they were a bad thing, but everybody knows that anyway. Did you read that book on coastal ecosystems?
LUCY: The one by John Harper? Yes, I found it hard going at first, it went into a lot of detail about things like the effects of offshore windfarms and fish farms, but actually I ended up with a much better understanding of the issues.
PHIL: Yes, I agree and I thought it was a well-written summary of those. And the diagrams helped a lot too.
LUCY: The article on metal toxicity was way above my head, I didn't know anything about how metals from industrial emissions react in the ocean... and I still don't understand it.
PHIL: I gave up reading after the first chapter – I just couldn't follow it.
LUCY: That podcast on floating marine cities was interesting, though it presented a rather one-sided picture, I thought.
PHIL: Yes, it focused on how this would benefit people and ignored the effects on the environment.
LUCY: But anyway, shall we ...`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 15, quote: 'focused on more long-term issues... things that aren\'t currently receiving widespread attention' },
        { questionNumber: 22, timestampSeconds: 28, quote: 'The examples she gave were at a more global level, and they really made it clear to me just how wide-ranging the threats' },
        { questionNumber: 23, timestampSeconds: 58, quote: 'improvements in systems used for tracking marine animals and things like robots were really interesting... description of how robotics can be used' },
        { questionNumber: 24, timestampSeconds: 42, quote: 'so many experts working together... and from such different backgrounds' },
        { questionNumber: 25, timestampSeconds: 78, quote: "he didn't really provide much information to explain why" },
        { questionNumber: 26, timestampSeconds: 92, quote: 'it was made ten years ago... it was showing its age' },
        { questionNumber: 27, timestampSeconds: 106, quote: 'Most of it was stating the obvious... everybody knows that anyway' },
        { questionNumber: 28, timestampSeconds: 120, quote: 'ended up with a much better understanding of the issues... a well-written summary of those' },
        { questionNumber: 29, timestampSeconds: 134, quote: "way above my head, I didn't know anything about how metals from industrial emissions react... couldn't follow it" },
        { questionNumber: 30, timestampSeconds: 148, quote: 'presented a rather one-sided picture... focused on how this would benefit people and ignored the effects on the environment' },
      ],
    },
    {
      id: 'c21-l1-p4',
      partNumber: 4,
      title: 'Part 4: Sources of Rubber',
      context: 'A lecture on natural and synthetic rubber, its supply limitations, threats, and alternative sources.',
      audioUrl: '/audio/listening/c21_test1_part4.mp3',
      containsIntroPauses: false,
      introPauseSeconds: 45,
      checkPauseSeconds: 30,
      transcript: `Much of the world now lives in an industrial civilisation. But this has only become possible because we have the necessary natural resources. There are three types of natural resource without which industry could not exist. One of these is metal – without that we'd have no machines and no transportation. Another is fossil fuels, which we need to power those machines. But there's a third resource that's essential to connect the different parts of a machine together with belts and pipes and shock absorbers, and that is rubber. It's now used in over 40,000 products, from waterproof footwear to surgical gloves.

At present, we have two types of rubber in common use. One is natural rubber, which nearly all comes from the Pará rubber tree. This was originally native to Brazil, but is now cultivated on plantations in South-East Asia. Recently, however, concern's been growing that supplies may soon be insufficient for the world's needs. So what exactly is limiting the supply of natural rubber?

Well, for one thing, rubber trees don't just spring up overnight. It can take eight to ten years for a tree to start producing rubber, so cultivating them's a slow process. And this leads to another problem. With most crops, farmers don't have to think very far ahead, so they can easily change what crop they produce, or how much of a crop they produce, if they find the demand for that crop is rising or falling. But if you have to plant eight or ten years ahead, that's much harder. And also the rubber tree's very choosy about where it grows. It needs the right temperature, the right amount of rainfall, and the right altitude – not too high and not too low. The result is that it can't be grown in the northern or southern parts of the globe, only around the equator. Another problem is that the rubber is basically extracted in the same way as it's been done for hundreds of years, and that's by hand, by making small cuts in the trunk of the tree, and putting a little cup there to catch the latex, as the rubber is called. It's very labour-intensive. And it's not just the initial production that's limiting supplies. With other resources such as water and glass, when we've finished using them we can recycle them, but although this is also possible with rubber, it's very difficult, so that also reduces the amount we have available.

And in the last few years, there have been new threats to the supply of natural rubber. One problem is linked to the fact that nearly all the rubber trees in South-East Asia are descended from just a small number of seeds brought from Brazil in the nineteenth century. This means that there's very little genetic diversity among the trees, which in turn makes them very vulnerable to disease. The most dangerous threat is a fungus, which destroyed large numbers of rubber trees in Brazil, and which could cause devastation to plantations worldwide. Another problem is that farmers in South-East Asia are increasingly turning to the cultivation of palm oil, which is easier and more profitable for them. And finally, in recent years South-East Asia, like other parts of the world, has been repeatedly hit by extreme types of weather, and this looks likely to continue in the future.

However, as well as using natural rubber, it's also possible to make rubber synthetically. This works very well for some purposes, for example, making engine parts, or silicone pots and pans used for cooking. But compared with natural rubber, it's not anything like as strong, and this means it can't replace natural rubber in other products. For example, while a mixture of natural rubber and synthetic rubber works well in car tyres, only natural rubber can stand up to the extreme speeds of aircraft tyres during take-off and landing.

So for some time, scientists have been looking for alternative sources of natural rubber. One that's been known about for some time seems initially to be a rather unlikely source. It's a wild plant with yellow flowers that we normally regard as a weed when we see it in our gardens. But when it's pulled up and its roots cut open, they're found to contain rubber.

Now, compared to the rubber tree, dandelions produce relatively small amounts of rubber, but unlike rubber trees, they're very adaptable. They'll grow in all sorts of places, and they don't need rich soil. So at present there are several projects underway investigating the possibility of using dandelions as a source of rubber.
Another possibility is a desert shrub grown in Mexico and Texas ...`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 14, quote: "One of these is metal – without that we'd have no machines and no transportation" },
        { questionNumber: 32, timestampSeconds: 42, quote: "eight to ten years for a tree to start producing rubber, so cultivating them's a slow process" },
        { questionNumber: 33, timestampSeconds: 56, quote: 'if they find the demand for that crop is rising or falling' },
        { questionNumber: 34, timestampSeconds: 70, quote: 'only around the equator' },
        { questionNumber: 35, timestampSeconds: 98, quote: "although this is also possible with rubber, it's very difficult [to recycle]" },
        { questionNumber: 36, timestampSeconds: 120, quote: 'The most dangerous threat is a fungus, which destroyed large numbers of rubber trees in Brazil' },
        { questionNumber: 37, timestampSeconds: 140, quote: 'repeatedly hit by extreme types of weather' },
        { questionNumber: 38, timestampSeconds: 160, quote: "compared with natural rubber, it's not anything like as strong" },
        { questionNumber: 39, timestampSeconds: 185, quote: "when it's pulled up and its roots cut open, they're found to contain rubber" },
        { questionNumber: 40, timestampSeconds: 202, quote: "they're very adaptable. They'll grow in all sorts of places, and they don't need rich soil" },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // -------------------------------------------------------------
    // PART 1: Questions 1-6 (Table Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l1-g1',
      partNumber: 1,
      questionType: 'table_completion',
      title: 'Questions 1–6',
      instructions: 'Complete the table below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      tableData: {
        headers: ['Name of course', 'What you learn', 'Cost', 'Other information'],
        rows: [
          {
            cells: [
              { content: 'Taster day' },
              { content: 'introduction to sailing' },
              { content: '£120 if booking one place' },
              { content: 'small groups (max [[1]] people)', isGap: true, questionNumber: 1 },
            ],
          },
          {
            cells: [
              { content: 'Level 1' },
              {
                content: 'basic theory e.g. understanding the [[2]] and tides\n\nbasic sailing skills including [[3]] information',
                isGap: true,
              },
              {
                content: '£200\n\n[[4]] available for club members\n\nall inclusive (plus a useful [[5]])',
                isGap: true,
              },
              { content: 'a [[6]] at the end of the course for all participants', isGap: true, questionNumber: 6 },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c21-l1-q1',
          questionNumber: 1,
          prompt: 'Taster day — small groups (max ________ people)',
          answerKey: '10',
          acceptedAlternatives: ['10', 'ten'],
          explanation: "The woman explains: 'You'd be in a small group, usually about eight people but no more than ten'.",
          transcriptExcerpt: "You'd be in a small group, usually about eight people but no more than ten – and everyone's always very friendly.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c21-l1-q2',
          questionNumber: 2,
          prompt: 'Level 1 — basic theory e.g. understanding the ________ and tides',
          answerKey: 'weather',
          acceptedAlternatives: ['weather'],
          explanation: "The woman states: 'So you learn about things like the weather, which is obviously really important and also the tides'.",
          transcriptExcerpt: 'So you learn about things like the weather, which is obviously really important and also the tides',
          audioTimestampSeconds: 38,
        },
        {
          id: 'c21-l1-q3',
          questionNumber: 3,
          prompt: 'Level 1 — basic sailing skills including ________ information',
          answerKey: 'safety',
          acceptedAlternatives: ['safety'],
          explanation: "The instructor 'will make sure you understand everything you need to know about safety'.",
          transcriptExcerpt: 'He or she will make sure you understand everything you need to know about safety.',
          audioTimestampSeconds: 46,
        },
        {
          id: 'c21-l1-q4',
          questionNumber: 4,
          prompt: 'Level 1 — Cost: ________ available for club members',
          answerKey: 'discount',
          acceptedAlternatives: ['discount', 'discounts'],
          explanation: "The woman notes: 'it's a bit cheaper if you decide to join the club. There's a discount for members'.",
          transcriptExcerpt: "There's a discount for members.",
          audioTimestampSeconds: 55,
        },
        {
          id: 'c21-l1-q5',
          questionNumber: 5,
          prompt: 'Level 1 — Cost: all inclusive (plus a useful ________)',
          answerKey: 'dictionary',
          acceptedAlternatives: ['dictionary'],
          explanation: "The woman says: 'everything's included and you also get a really good dictionary explaining all the sailing terminology'.",
          transcriptExcerpt: 'everything’s included and you also get a really good dictionary explaining all the sailing terminology.',
          audioTimestampSeconds: 68,
        },
        {
          id: 'c21-l1-q6',
          questionNumber: 6,
          prompt: 'Level 1 — Other info: a ________ at the end of the course for all participants',
          answerKey: 'certificate',
          acceptedAlternatives: ['certificate'],
          explanation: "The woman confirms: 'And on completion of the course you get a certificate'.",
          transcriptExcerpt: 'And on completion of the course you get a certificate.',
          audioTimestampSeconds: 78,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 1: Questions 7-10 (Note Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l1-g2',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 7–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 7,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `General information
• Participants must be able to swim.
• Bring suitable clothing, a [[7]] and toiletries (e.g. shampoo).
• There is a [[8]] at the club.
• Online training [[9]] are recommended.
• [[10]] are available for course participants.`,
      questions: [
        {
          id: 'c21-l1-q7',
          questionNumber: 7,
          prompt: 'Bring suitable clothing, a ________ and toiletries (e.g. shampoo).',
          answerKey: 'towel',
          acceptedAlternatives: ['towel'],
          explanation: "The man asks 'And a towel?' and the woman replies 'Yes definitely'.",
          transcriptExcerpt: 'MAN: And a towel? WOMAN: Yes definitely.',
          audioTimestampSeconds: 96,
        },
        {
          id: 'c21-l1-q8',
          questionNumber: 8,
          prompt: 'There is a ________ at the club.',
          answerKey: 'café',
          acceptedAlternatives: ['café', 'cafe'],
          explanation: "The man asks: 'is there a café at the club?' and the woman replies: 'Yes, you can get sandwiches, cakes and snacks there'.",
          transcriptExcerpt: 'Do I need to bring that or is there a café at the club? WOMAN: Yes, you can get sandwiches, cakes and snacks there.',
          audioTimestampSeconds: 104,
        },
        {
          id: 'c21-l1-q9',
          questionNumber: 9,
          prompt: 'Online training ________ are recommended.',
          answerKey: 'videos',
          acceptedAlternatives: ['videos', 'video'],
          explanation: "The woman advises: 'I recommend you watch some videos we use for training. They're available online'.",
          transcriptExcerpt: "I recommend you watch some videos we use for training. They're available online.",
          audioTimestampSeconds: 118,
        },
        {
          id: 'c21-l1-q10',
          questionNumber: 10,
          prompt: '________ are available for course participants.',
          answerKey: 'Lockers',
          acceptedAlternatives: ['Lockers', 'lockers', 'locker'],
          explanation: "The man asks: 'wondering if there are lockers for people to use?' and woman replies: 'Yes, there are plenty in the changing rooms'.",
          transcriptExcerpt: 'wondering if there are lockers for people to use? WOMAN: Yes, there are plenty in the changing rooms.',
          audioTimestampSeconds: 130,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 11-16 (Multiple Choice Single)
    // -------------------------------------------------------------
    {
      id: 'c21-l1-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 11–16',
      instructions: 'Choose the correct letter, A, B or C.\nWorking as a makeup trainee',
      startQuestionNumber: 11,
      endQuestionNumber: 16,
      questions: [
        {
          id: 'c21-l1-q11',
          questionNumber: 11,
          prompt: 'What should trainees always expect to get when working on low budget short films?',
          options: [
            { key: 'A', text: 'travel expenses' },
            { key: 'B', text: 'a minimum wage' },
            { key: 'C', text: 'meals' },
          ],
          answerKey: 'A',
          explanation: "Claire states: 'Make sure your transport costs are covered – and remember, there's very unlikely to be any catering provided'.",
          transcriptExcerpt: 'Make sure your transport costs are covered – and remember, there’s very unlikely to be any catering provided, so bring plenty of food.',
          audioTimestampSeconds: 28,
        },
        {
          id: 'c21-l1-q12',
          questionNumber: 12,
          prompt: 'According to the speaker, on big budget films trainees may get experience of',
          options: [
            { key: 'A', text: 'makeup for special effects.' },
            { key: 'B', text: 'working with different ethnicities.' },
            { key: 'C', text: 'creating a variety of hair styles.' },
          ],
          answerKey: 'B',
          explanation: "Claire says: 'you're likely to get the opportunity to work with a range of age groups, as well as different ethnicities'.",
          transcriptExcerpt: "you're likely to get the opportunity to work with a range of age groups, as well as different ethnicities.",
          audioTimestampSeconds: 42,
        },
        {
          id: 'c21-l1-q13',
          questionNumber: 13,
          prompt: 'The speaker says a problem for makeup artists is',
          options: [
            { key: 'A', text: 'dealing with difficult directors.' },
            { key: 'B', text: 'being shouted at by their supervisor.' },
            { key: 'C', text: 'waiting around for hours doing nothing.' },
          ],
          answerKey: 'A',
          explanation: "Claire notes that top artists remain professional 'even when they're having to work with directors who are impatient, or unhappy with the makeup artist's work'.",
          transcriptExcerpt: "even when they're having to work with directors who are impatient, or unhappy with the makeup artist's work.",
          audioTimestampSeconds: 61,
        },
        {
          id: 'c21-l1-q14',
          questionNumber: 14,
          prompt: 'How did the speaker feel when she met famous actors for the first time?',
          options: [
            { key: 'A', text: 'very shy' },
            { key: 'B', text: 'very proud' },
            { key: 'C', text: 'very disappointed' },
          ],
          answerKey: 'A',
          explanation: "Claire recalls: 'At first, I found it overwhelming and could hardly speak, I was so in awe' (very shy).",
          transcriptExcerpt: 'At first, I found it overwhelming and could hardly speak, I was so in awe.',
          audioTimestampSeconds: 78,
        },
        {
          id: 'c21-l1-q15',
          questionNumber: 15,
          prompt: 'What advice does the speaker give about makeup kits?',
          options: [
            { key: 'A', text: 'Always carry a basic kit with you.' },
            { key: 'B', text: 'Only buy the best products for a makeup kit.' },
            { key: 'C', text: 'Ask other makeup artists to check your kit.' },
          ],
          answerKey: 'A',
          explanation: "Claire advises: 'Every makeup trainee will need a makeup kit, which they'll be expected to have with them at all times. Just the essentials will do'.",
          transcriptExcerpt: "Every makeup trainee will need a makeup kit, which they'll be expected to have with them at all times. Just the essentials will do",
          audioTimestampSeconds: 94,
        },
        {
          id: 'c21-l1-q16',
          questionNumber: 16,
          prompt: 'What advice does the speaker give about creating a portfolio?',
          options: [
            { key: 'A', text: 'Keep print and digital photos.' },
            { key: 'B', text: 'Only include a small selection of photos.' },
            { key: 'C', text: 'Get permission to use photos.' },
          ],
          answerKey: 'C',
          explanation: "Claire cautions: 'remember you'll need to get approval from the makeup designer in charge of the department' (get permission).",
          transcriptExcerpt: "remember you'll need to get approval from the makeup designer in charge of the department.",
          audioTimestampSeconds: 110,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 17-20 (Matching)
    // -------------------------------------------------------------
    {
      id: 'c21-l1-g4',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 17–20',
      instructions: 'What ability is required for each of the following duties?\nWrite the correct letter, A, B, or C, next to Questions 17–20.',
      startQuestionNumber: 17,
      endQuestionNumber: 20,
      optionsList: [
        { key: 'A', text: 'being well-organised' },
        { key: 'B', text: 'being flexible' },
        { key: 'C', text: 'working quickly' },
      ],
      questions: [
        {
          id: 'c21-l1-q17',
          questionNumber: 17,
          prompt: 'Prepping an actor',
          answerKey: 'C',
          explanation: "Claire says: 'sometimes you'll need to step in and get this done without wasting any time, otherwise the makeup artist will get behind schedule' (working quickly).",
          transcriptExcerpt: 'step in and get this done without wasting any time, otherwise the makeup artist will get behind schedule.',
          audioTimestampSeconds: 132,
        },
        {
          id: 'c21-l1-q18',
          questionNumber: 18,
          prompt: 'Continuity',
          answerKey: 'A',
          explanation: "Claire explains: 'This information needs to be kept in good order as a reshoot can mean replicating makeup months later' (being well-organised).",
          transcriptExcerpt: 'This information needs to be kept in good order as a reshoot can mean replicating makeup months later.',
          audioTimestampSeconds: 146,
        },
        {
          id: 'c21-l1-q19',
          questionNumber: 19,
          prompt: 'General',
          answerKey: 'B',
          explanation: "Claire notes: 'General duties mean doing anything from getting the teas and coffees to putting on a wash. Having a positive attitude and being willing to do whatever is asked of you' (being flexible).",
          transcriptExcerpt: 'Having a positive attitude and being willing to do whatever is asked of you will help you get your next film job.',
          audioTimestampSeconds: 158,
        },
        {
          id: 'c21-l1-q20',
          questionNumber: 20,
          prompt: 'Applying makeup',
          answerKey: 'C',
          explanation: "Claire says: 'If there are dozens of extras involved you'll need to keep up a swift pace and not spend too long on each person' (working quickly).",
          transcriptExcerpt: "you'll need to keep up a swift pace and not spend too long on each person.",
          audioTimestampSeconds: 170,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 21-22 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l1-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'the references to local problems' },
        { key: 'B', text: 'the broad focus of the examples' },
        { key: 'C', text: 'the practical suggestions for solutions' },
        { key: 'D', text: 'the type of issues discussed' },
        { key: 'E', text: 'the implications for government policy' },
      ],
      questions: [
        {
          id: 'c21-l1-q21',
          questionNumber: 21,
          prompt: 'Which TWO features of the lecture on ocean biodiversity had the greatest impact on the students?',
          options: [
            { key: 'A', text: 'the references to local problems' },
            { key: 'B', text: 'the broad focus of the examples' },
            { key: 'C', text: 'the practical suggestions for solutions' },
            { key: 'D', text: 'the type of issues discussed' },
            { key: 'E', text: 'the implications for government policy' },
          ],
          answerKey: ['B', 'D'],
          explanation: "Lucy liked the focus on 'more long-term issues' (type of issues discussed, D). Phil was impressed that 'The examples she gave were at a more global level' (broad focus of examples, B).",
          transcriptExcerpt: "LUCY: I especially liked the way her lecture focused on more long-term issues... PHIL: The examples she gave were at a more global level, and they really made it clear to me just how wide-ranging the threats to ocean biodiversity are.",
          audioTimestampSeconds: 15,
        },
        {
          id: 'c21-l1-q22',
          questionNumber: 22,
          prompt: 'Which TWO features of the lecture on ocean biodiversity had the greatest impact on the students?',
          options: [
            { key: 'A', text: 'the references to local problems' },
            { key: 'B', text: 'the broad focus of the examples' },
            { key: 'C', text: 'the practical suggestions for solutions' },
            { key: 'D', text: 'the type of issues discussed' },
            { key: 'E', text: 'the implications for government policy' },
          ],
          answerKey: ['B', 'D'],
          explanation: "Lucy liked the focus on 'more long-term issues' (type of issues discussed, D). Phil was impressed that 'The examples she gave were at a more global level' (broad focus of examples, B).",
          transcriptExcerpt: "LUCY: I especially liked the way her lecture focused on more long-term issues... PHIL: The examples she gave were at a more global level, and they really made it clear to me just how wide-ranging the threats to ocean biodiversity are.",
          audioTimestampSeconds: 28,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 23-24 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l1-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: "the team's previous successes" },
        { key: 'B', text: 'its wide geographical scale' },
        { key: 'C', text: 'the use of new technology' },
        { key: 'D', text: 'the extensive statistical evidence' },
        { key: 'E', text: 'the large range of specialists involved' },
      ],
      questions: [
        {
          id: 'c21-l1-q23',
          questionNumber: 23,
          prompt: 'Which TWO details about the research project particularly impressed the students?',
          options: [
            { key: 'A', text: "the team's previous successes" },
            { key: 'B', text: 'its wide geographical scale' },
            { key: 'C', text: 'the use of new technology' },
            { key: 'D', text: 'the extensive statistical evidence' },
            { key: 'E', text: 'the large range of specialists involved' },
          ],
          answerKey: ['C', 'E'],
          explanation: "Phil was impressed by 'systems used for tracking marine animals and things like robots' and Lucy agreed with 'how robotics can be used' (new technology, C). Phil and Lucy both noted having 'so many experts working together... from such different backgrounds' (large range of specialists, E).",
          transcriptExcerpt: "PHIL: And the description of improvements in systems used for tracking marine animals and things like robots were really interesting. LUCY: Yes, and her description of how robotics can be used... PHIL: quite unusual to have so many experts working together. LUCY: Yeah, and from such different backgrounds.",
          audioTimestampSeconds: 58,
        },
        {
          id: 'c21-l1-q24',
          questionNumber: 24,
          prompt: 'Which TWO details about the research project particularly impressed the students?',
          options: [
            { key: 'A', text: "the team's previous successes" },
            { key: 'B', text: 'its wide geographical scale' },
            { key: 'C', text: 'the use of new technology' },
            { key: 'D', text: 'the extensive statistical evidence' },
            { key: 'E', text: 'the large range of specialists involved' },
          ],
          answerKey: ['C', 'E'],
          explanation: "Phil was impressed by 'systems used for tracking marine animals and things like robots' and Lucy agreed with 'how robotics can be used' (new technology, C). Phil and Lucy both noted having 'so many experts working together... from such different backgrounds' (large range of specialists, E).",
          transcriptExcerpt: "PHIL: And the description of improvements in systems used for tracking marine animals and things like robots were really interesting. LUCY: Yes, and her description of how robotics can be used... PHIL: quite unusual to have so many experts working together. LUCY: Yeah, and from such different backgrounds.",
          audioTimestampSeconds: 42,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 25-30 (Matching)
    // -------------------------------------------------------------
    {
      id: 'c21-l1-g7',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 25–30',
      instructions: "What is the students' opinion of each of the following resources related to ocean biodiversity?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.",
      startQuestionNumber: 25,
      endQuestionNumber: 30,
      optionsList: [
        { key: 'A', text: 'This is aimed at a very specialist audience.' },
        { key: 'B', text: 'This is now rather outdated.' },
        { key: 'C', text: 'This was an effective description of a new danger.' },
        { key: 'D', text: 'This suggests possible ways to improve the situation.' },
        { key: 'E', text: 'This does not give a balanced account.' },
        { key: 'F', text: 'This is too predictable to be useful.' },
        { key: 'G', text: 'This gives insufficient evidence for its claims.' },
        { key: 'H', text: 'This gives a clear explanation of the problems.' },
      ],
      questions: [
        {
          id: 'c21-l1-q25',
          questionNumber: 25,
          prompt: 'Article on invasive lionfish',
          answerKey: 'G',
          explanation: "Phil says: 'the writer went on about how dangerous they were in environmental terms... but he didn't really provide much information to explain why' (insufficient evidence, G).",
          transcriptExcerpt: "he didn't really provide much information to explain why. LUCY: I know what you mean.",
          audioTimestampSeconds: 78,
        },
        {
          id: 'c21-l1-q26',
          questionNumber: 26,
          prompt: 'Documentary on microplastics',
          answerKey: 'B',
          explanation: "Phil says 'it was made ten years ago' and Lucy agrees 'it was showing its age' (outdated, B).",
          transcriptExcerpt: 'PHIL: made ten years ago so I gave up. LUCY: you’re right, it was showing its age.',
          audioTimestampSeconds: 92,
        },
        {
          id: 'c21-l1-q27',
          questionNumber: 27,
          prompt: 'Podcast on ocean pollution',
          answerKey: 'F',
          explanation: "Lucy says 'Most of it was stating the obvious' and Phil adds 'everybody knows that anyway' (too predictable, F).",
          transcriptExcerpt: 'LUCY: Most of it was stating the obvious. PHIL: everybody knows that anyway.',
          audioTimestampSeconds: 106,
        },
        {
          id: 'c21-l1-q28',
          questionNumber: 28,
          prompt: 'Book on coastal ecosystems',
          answerKey: 'H',
          explanation: "Lucy ended up with 'a much better understanding of the issues' and Phil thought it was 'a well-written summary of those' (clear explanation, H).",
          transcriptExcerpt: 'LUCY: ended up with a much better understanding of the issues. PHIL: Yes, I agree and I thought it was a well-written summary of those.',
          audioTimestampSeconds: 120,
        },
        {
          id: 'c21-l1-q29',
          questionNumber: 29,
          prompt: 'Article on metal toxicity',
          answerKey: 'A',
          explanation: "Lucy says it was 'way above my head, I didn't know anything about how metals from industrial emissions react... and I still don't understand it' and Phil 'couldn't follow it' (specialist audience, A).",
          transcriptExcerpt: 'LUCY: The article on metal toxicity was way above my head... PHIL: I just couldn’t follow it.',
          audioTimestampSeconds: 134,
        },
        {
          id: 'c21-l1-q30',
          questionNumber: 30,
          prompt: 'Podcast on floating marine cities',
          answerKey: 'E',
          explanation: "Lucy says 'it presented a rather one-sided picture' and Phil agrees it 'focused on how this would benefit people and ignored the effects on the environment' (does not give a balanced account, E).",
          transcriptExcerpt: 'LUCY: presented a rather one-sided picture, I thought. PHIL: focused on how this would benefit people and ignored the effects on the environment.',
          audioTimestampSeconds: 148,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 4: Questions 31-40 (Note Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l1-g8',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Sources of rubber

Three resources which are essential for industrial civilisation
• [[31]]
• fossil fuels
• rubber

Natural rubber
This mainly comes from the Pará rubber tree, now cultivated in South-East Asia.
The supply is limited because
• the growth of the tree is [[32]].
• production cannot easily be adjusted because of increasing or decreasing [[33]].
• the tree only grows near the [[34]].
• extracting the latex (rubber) is labour-intensive
• it is very difficult to [[35]] rubber after production.

New threats include
• lack of genetic diversity, leading to danger of disease caused by a [[36]].
• a shift to the cultivation of palm oil
• extreme [[37]] events.

Synthetic rubber
• may be used for engine parts and cooking utensils
• is less [[38]] than natural rubber
• is unsuitable for many purposes e.g. the tyres of aircraft.

An alternative source of natural rubber
• A wild flower (a type of dandelion) has rubber in its [[39]].
• It can be grown in many locations and does not require good [[40]].`,
      questions: [
        {
          id: 'c21-l1-q31',
          questionNumber: 31,
          prompt: 'Three resources which are essential for industrial civilisation: ________',
          answerKey: 'metal',
          acceptedAlternatives: ['metal', 'metals', 'metal(s)'],
          explanation: "The lecturer states: 'There are three types of natural resource without which industry could not exist. One of these is metal – without that we'd have no machines'.",
          transcriptExcerpt: "There are three types of natural resource without which industry could not exist. One of these is metal – without that we'd have no machines and no transportation.",
          audioTimestampSeconds: 14,
        },
        {
          id: 'c21-l1-q32',
          questionNumber: 32,
          prompt: 'The supply is limited because the growth of the tree is ________.',
          answerKey: 'slow',
          acceptedAlternatives: ['slow'],
          explanation: "The lecturer explains: 'It can take eight to ten years for a tree to start producing rubber, so cultivating them's a slow process'.",
          transcriptExcerpt: "It can take eight to ten years for a tree to start producing rubber, so cultivating them's a slow process.",
          audioTimestampSeconds: 42,
        },
        {
          id: 'c21-l1-q33',
          questionNumber: 33,
          prompt: 'Production cannot easily be adjusted because of increasing or decreasing ________.',
          answerKey: 'demand',
          acceptedAlternatives: ['demand'],
          explanation: "Farmers cannot readily alter output 'if they find the demand for that crop is rising or falling'.",
          transcriptExcerpt: 'if they find the demand for that crop is rising or falling.',
          audioTimestampSeconds: 56,
        },
        {
          id: 'c21-l1-q34',
          questionNumber: 34,
          prompt: 'The tree only grows near the ________.',
          answerKey: 'equator',
          acceptedAlternatives: ['equator'],
          explanation: "The lecturer says: 'The result is that it can't be grown in the northern or southern parts of the globe, only around the equator'.",
          transcriptExcerpt: "The result is that it can't be grown in the northern or southern parts of the globe, only around the equator.",
          audioTimestampSeconds: 70,
        },
        {
          id: 'c21-l1-q35',
          questionNumber: 35,
          prompt: 'It is very difficult to ________ rubber after production.',
          answerKey: 'recycle',
          acceptedAlternatives: ['recycle'],
          explanation: "The lecturer notes: 'With other resources such as water and glass, when we've finished using them we can recycle them, but although this is also possible with rubber, it's very difficult'.",
          transcriptExcerpt: "when we've finished using them we can recycle them, but although this is also possible with rubber, it's very difficult",
          audioTimestampSeconds: 98,
        },
        {
          id: 'c21-l1-q36',
          questionNumber: 36,
          prompt: 'Lack of genetic diversity, leading to danger of disease caused by a ________.',
          answerKey: 'fungus',
          acceptedAlternatives: ['fungus'],
          explanation: "The lecturer warns: 'The most dangerous threat is a fungus, which destroyed large numbers of rubber trees in Brazil'.",
          transcriptExcerpt: 'The most dangerous threat is a fungus, which destroyed large numbers of rubber trees in Brazil, and which could cause devastation to plantations worldwide.',
          audioTimestampSeconds: 120,
        },
        {
          id: 'c21-l1-q37',
          questionNumber: 37,
          prompt: 'Extreme ________ events.',
          answerKey: 'weather',
          acceptedAlternatives: ['weather'],
          explanation: "The lecturer concludes: 'South-East Asia, like other parts of the world, has been repeatedly hit by extreme types of weather'.",
          transcriptExcerpt: 'repeatedly hit by extreme types of weather, and this looks likely to continue in the future.',
          audioTimestampSeconds: 140,
        },
        {
          id: 'c21-l1-q38',
          questionNumber: 38,
          prompt: 'Synthetic rubber is less ________ than natural rubber.',
          answerKey: 'strong',
          acceptedAlternatives: ['strong'],
          explanation: "The lecturer compares: 'But compared with natural rubber, it's not anything like as strong, and this means it can't replace natural rubber'.",
          transcriptExcerpt: "But compared with natural rubber, it's not anything like as strong, and this means it can't replace natural rubber in other products.",
          audioTimestampSeconds: 160,
        },
        {
          id: 'c21-l1-q39',
          questionNumber: 39,
          prompt: 'A wild flower (a type of dandelion) has rubber in its ________.',
          answerKey: 'roots',
          acceptedAlternatives: ['roots', 'root'],
          explanation: "The lecturer explains: 'It's a wild plant with yellow flowers... But when it's pulled up and its roots cut open, they're found to contain rubber'.",
          transcriptExcerpt: "when it's pulled up and its roots cut open, they're found to contain rubber.",
          audioTimestampSeconds: 185,
        },
        {
          id: 'c21-l1-q40',
          questionNumber: 40,
          prompt: 'It can be grown in many locations and does not require good ________.',
          answerKey: 'soil',
          acceptedAlternatives: ['soil'],
          explanation: "The lecturer notes: 'unlike rubber trees, they're very adaptable. They'll grow in all sorts of places, and they don't need rich soil'.",
          transcriptExcerpt: "They'll grow in all sorts of places, and they don't need rich soil.",
          audioTimestampSeconds: 202,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 21 Academic Listening Test 1',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      audioMode: 'part_audios',
      masterAudioUrl: '/audio/listening/c21_test1_master.mp3',
      totalAudioDurationSeconds: 1800,
      postTestCheckTimeSeconds: 120,
    },
    parts,
    questionGroups,
  };
}

export function ingestCambridge21ListeningTest1(authorId?: string): {
  testId: string;
  versionId: string;
  status: string;
  totalQuestions: number;
} {
  const data = getCambridge21ListeningTest1Data();
  const errors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (errors.length > 0) {
    throw new Error(`Cambridge 21 Listening Test 1 validation failed: ${errors.join('; ')}`);
  }

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const admin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any;
    resolvedAuthorId = admin ? admin.id : 'admin';
  }

  const existing = db
    .prepare("SELECT id FROM listening_tests WHERE title LIKE '%Cambridge%21%Listening%Test 1%'")
    .get() as any;

  const now = new Date().toISOString();
  let testId: string;
  let versionId: string;

  if (existing) {
    testId = existing.id;
    const latestVerRow = db
      .prepare(`SELECT id, version_number FROM listening_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1`)
      .get(testId) as any;

    if (latestVerRow) {
      versionId = latestVerRow.id;
      db.prepare(`
        UPDATE listening_test_versions
        SET parts_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            audio_config_json = ?,
            status = 'published'
        WHERE id = ?
      `).run(
        JSON.stringify(data.parts),
        JSON.stringify(data.questionGroups),
        JSON.stringify(data.audioConfig),
        versionId
      );
    } else {
      versionId = uuidv4();
      db.prepare(`
        INSERT INTO listening_test_versions (
          id, test_id, version_number, status, parts_json,
          question_groups_json, total_questions, audio_config_json, validation_errors_json, published_at, created_at
        ) VALUES (?, ?, 1, 'published', ?, ?, 40, ?, '[]', ?, ?)
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

    db.prepare(`
      UPDATE listening_tests
      SET status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(now, testId);
  } else {
    testId = uuidv4();
    versionId = uuidv4();

    db.prepare(`
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

    db.prepare(`
      INSERT INTO listening_test_versions (
        id, test_id, version_number, status, parts_json,
        question_groups_json, total_questions, audio_config_json, validation_errors_json, published_at, created_at
      ) VALUES (?, ?, 1, 'published', ?, ?, 40, ?, '[]', ?, ?)
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
