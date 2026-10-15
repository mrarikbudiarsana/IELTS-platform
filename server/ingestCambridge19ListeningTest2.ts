import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q17_OPTIONS = [
  { key: 'A', text: 'The residential course developed his leadership skills.' },
  { key: 'B', text: 'The training in use of ropes and knots was quite brief.' },
  { key: 'C', text: 'The training exercises have built up his mental strength.' },
  { key: 'D', text: 'The casualty care activities were particularly challenging for him.' },
  { key: 'E', text: 'The wave tank activities provided practice in survival techniques.' },
];

const MC_Q19_OPTIONS = [
  { key: 'A', text: 'working as part of a team' },
  { key: 'B', text: 'experiences when working in winter' },
  { key: 'C', text: 'being thanked by those he has helped' },
  { key: 'D', text: 'the fact that it keeps him fit' },
  { key: 'E', text: 'the chance to develop new equipment' },
];

const MATCHING_Q25_OPTIONS = [
  { key: 'A', text: 'one shoe was missing' },
  { key: 'B', text: 'the colour of one shoe had faded' },
  { key: 'C', text: 'one shoe had a hole in it' },
  { key: 'D', text: 'the shoes were brand new' },
  { key: 'E', text: 'the shoes were too dirty' },
  { key: 'F', text: 'the stitching on the shoes was broken' },
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

export function getCambridge19ListeningTest2Data(): {
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
      id: 'c19-l2-p1',
      partNumber: 1,
      title: 'Part 1: Guitar Group',
      context: 'A conversation between a woman and Coleman about joining a local guitar group taught by Gary Mathieson.',
      audioUrl: '/audio/listening/c19_test2_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `WOMAN: Hi Coleman, how are you?
COLEMAN: Good, thanks.
WOMAN: I wanted to have a chat with you because our friend Josh told me that you've joined a guitar group and it sounds interesting. I'd really like to learn myself.
COLEMAN: Why don't you come along? I'm sure there's room for another person.
WOMAN: Really? So - who runs the classes?
COLEMAN: He's called a 'coordinator' - his name's Gary Mathieson.
WOMAN: Let me note that down. Gary. . . . How do you spell his surname?
COLEMAN: It's M-A-T-H-I-E-S-O-N.
WOMAN: Right, thanks.
COLEMAN: He's retired, actually, but he's a really nice guy and he used to play in a lot of bands.
WOMAN: Thanks. So how long have you been going?
COLEMAN: About a month now.
WOMAN: And could you play anything before you started?
COLEMAN: I knew a few chords, but that's all.
WOMAN: I'm sure everyone will be better than me.
COLEMAN: That's what I thought, too. When I first spoke to Gary on the phone, he said it was a class for beginners, but I was still worried that everyone would be better than me, but we were all equally hopeless!
WOMAN: Oh, that's reassuring. So where do you meet?
COLEMAN: Well, when I joined the group, they were meeting in Gary's home, but as the group got bigger, he decided to book a room at the college in town. I prefer going there.
WOMAN: I know that place. I used to go to tap dancing classes there when I was at secondary school. I haven't been since, though and I can't remember what road it's in . . . is it Lock Street?
COLEMAN: It's just beyond there at the bottom of New Street near the city roundabout.
WOMAN: Yes, of course.
COLEMAN: The guitar club is on the first floor in Room T347.
WOMAN: Right. And when do you meet? Is it at the weekend?
COLEMAN: We meet on Thursdays. It used to be 10.30 and that suited me well, but now we meet at 11. The class that's in there before us asked if they could have the room for another 30 minutes.
WOMAN: Oh, I see. Well, I'd love to come, but I don't have a guitar.
COLEMAN: Well, you can always buy a second-hand one. There's a website called 'The perfect instrument' that sells all kinds of guitars, violins and so on. I'm sure you'll find something there.

WOMAN: So what's a typical lesson like with Gary?
COLEMAN: Well, he always starts by getting us to tune our guitars. That takes about five minutes.
WOMAN: Uhuh.
COLEMAN: Some people have an app they use, but others do it by ear. Gary goes round and helps them. And while he's doing that, he tells us what he's going to do during the lesson.
WOMAN: Right.
COLEMAN: First, we usually spend about ten minutes doing some strumming.
WOMAN: So is that using . . . what are they called . . . plectrums?
COLEMAN: No - we just use our thumbs.
WOMAN: Much easier.
COLEMAN: Gary reminds us where to put our fingers for each chord and then we play them together. Sometimes we all just start laughing because we're so bad at keeping time, so Gary starts clapping to help us.
WOMAN: Do you learn to play any songs?
COLEMAN: Yes - we do at least one song with words and chords. I mean that's harder than you think.
WOMAN: Oh, I'm sure it is!
COLEMAN: That part of the lesson takes about 15 minutes. He often brings a recording of the song and plays it to us first. Then he hands out the song and if there's a new chord in it, we practise that before we play it together - but really slowly.
WOMAN: Do you do any finger picking?
COLEMAN: That's the last ten minutes of the lesson, when we pick out the individual notes from a tune he's made up. It's always quite simple.
WOMAN: That must be hard, though.
COLEMAN: It is, but people like it because they can really concentrate and if we're all playing well, it sounds quite impressive. The only trouble is that he sometimes gets us to play one at a time - you know, alone.
WOMAN: That's scary.
COLEMAN: It is, but I've got used to it now. At the end he spends about five minutes telling us what to practise for the following week.
WOMAN: Well, thanks Coleman. I'll go and have a look at that website, I think.`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 25, quote: "He's called a 'coordinator' - his name's Gary Mathieson. It's M-A-T-H-I-E-S-O-N." },
        { questionNumber: 2, timestampSeconds: 45, quote: "When I first spoke to Gary on the phone, he said it was a class for beginners" },
        { questionNumber: 3, timestampSeconds: 65, quote: "he decided to book a room at the college in town." },
        { questionNumber: 4, timestampSeconds: 80, quote: "It's just beyond there at the bottom of New Street near the city roundabout." },
        { questionNumber: 5, timestampSeconds: 105, quote: "We meet on Thursdays. It used to be 10.30 and that suited me well, but now we meet at 11." },
        { questionNumber: 6, timestampSeconds: 125, quote: "There's a website called 'The perfect instrument' that sells all kinds of guitars" },
        { questionNumber: 7, timestampSeconds: 150, quote: "Some people have an app they use, but others do it by ear." },
        { questionNumber: 8, timestampSeconds: 175, quote: "we're so bad at keeping time, so Gary starts clapping to help us." },
        { questionNumber: 9, timestampSeconds: 200, quote: "He often brings a recording of the song and plays it to us first." },
        { questionNumber: 10, timestampSeconds: 230, quote: "The only trouble is that he sometimes gets us to play one at a time - you know, alone." },
      ],
    },
    {
      id: 'c19-l2-p2',
      partNumber: 2,
      title: 'Part 2: Working as a lifeboat volunteer',
      context: 'David gives a talk about his experience and responsibilities as a lifeboat volunteer in Northsea.',
      audioUrl: '/audio/listening/c19_test2_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `I never really planned to be a lifeboat volunteer when I came to live in Northsea. I'd been working in London as a website designer, but although that was interesting, I didn't like city life. I'd been really keen on boats as a teenager, and I thought if I went to live by the sea, I might be able to pursue that interest a bit more in my free time. Then I found that the Lifeboat Institution was looking for volunteers, so I decided to apply.

The Lifeboat Institution building here in Northsea's hard to miss, it's one of the largest in the country. It was built 15 years ago with funds provided by a generous member of the public who'd lived here all her life. As the Lifeboat Institution is a charity that relies on that kind of donation, rather than funding provided by the government, that was a huge help to us.

When I applied, I had to have a health assessment. The doctors were particularly interested in my vision. I used to be short-sighted, so I'd had to wear glasses, but I'd had laser eye surgery two years earlier so that was OK. They gave me tests for colour blindness and they thought I might have a problem there, but it turned out I was OK.

When the coastguard gets an alert, all the volunteers are contacted and rush to the lifeboat station. Our target's to get there in five minutes, then we try to get the boat off the dock and out to sea in another six to eight minutes. Our team's proud that we usually achieve that - the average time across the country's eight and a half minutes.

I've recently qualified as what's called a 'helmsman', which means I have the ultimate responsibility for the lifeboat. I have to check that the equipment we use is in working order - the crew have special life jackets that can support up to four people in the water. And it's ultimately my decision whether it's safe to launch the boat. But it's very rare not to launch it, even in the worst weather.

As well as going out on the lifeboat, my work involves other things too. A lot of people underestimate how quickly conditions can change at sea, so I speak to youth groups and sailing clubs in the area about the sorts of problems that sailors and swimmers can have if the weather suddenly gets bad. We also have a lot of volunteers who organise activities to raise money for us, and we couldn't manage without them.

The training we get is a continuous process, focusing on technical competence and safe handling techniques, and it's given me the confidence to deal with extreme situations without panicking. I was glad I'd done a first aid course before I started, as that's a big help with the casualty care activities we do. We've done a lot on how to deal with ropes and tie knots - that's an essential skill. After a year, I did a one-week residential course, led by specialists. They had a wave-tank where they could create extreme weather conditions - so we could get experience at what to do if the boat turned over in a storm at night, for example.

Since I started, I've had to deal with a range of emergency situations.
But the work's hugely motivating. It's not just about saving lives - I've learned a lot about the technology involved. My background in IT's been useful here, and I can use my expertise to help other volunteers. They're a great group - we're like a family really, which helps when you're dragging yourself out of bed on a cold stormy night. But actually, it's the colder months that can be the most rewarding time. That's when the incidents tend to be more serious, and you realise that you can make a huge difference to the outcome.
So if any of you listeners are interested. . . .`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 25, quote: "I'd been really keen on boats as a teenager, and I thought if I went to live by the sea, I might be able to pursue that interest a bit more in my free time." },
        { questionNumber: 12, timestampSeconds: 50, quote: "It was built 15 years ago with funds provided by a generous member of the public who'd lived here all her life." },
        { questionNumber: 13, timestampSeconds: 75, quote: "They gave me tests for colour blindness and they thought I might have a problem there, but it turned out I was OK." },
        { questionNumber: 14, timestampSeconds: 95, quote: "we try to get the boat off the dock and out to sea in another six to eight minutes." },
        { questionNumber: 15, timestampSeconds: 120, quote: "And it's ultimately my decision whether it's safe to launch the boat." },
        { questionNumber: 16, timestampSeconds: 145, quote: "so I speak to youth groups and sailing clubs in the area about the sorts of problems that sailors and swimmers can have" },
        { questionNumber: 17, timestampSeconds: 175, quote: "it's given me the confidence to deal with extreme situations without panicking." },
        { questionNumber: 18, timestampSeconds: 195, quote: "They had a wave-tank where they could create extreme weather conditions - so we could get experience at what to do if the boat turned over in a storm" },
        { questionNumber: 19, timestampSeconds: 220, quote: "They're a great group - we're like a family really, which helps when you're dragging yourself out of bed" },
        { questionNumber: 20, timestampSeconds: 235, quote: "actually, it's the colder months that can be the most rewarding time." },
      ],
    },
    {
      id: 'c19-l2-p3',
      partNumber: 3,
      title: 'Part 3: Recycling Footwear',
      context: 'Bella and Don discuss their upcoming presentation on recycling footwear, examining an article and reasons why footwear is rejected.',
      audioUrl: '/audio/listening/c19_test2_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `BELLA: Hi Don - did you get the copy of the article on recycling footwear that I emailed you?
DON: Yeah - it's here . . . I've had a look at it.
BELLA: So do you think it's a good topic for our presentation?
DON: Well, before I started reading it, I thought recycling footwear, well, although it's quite interesting, perhaps there isn't enough to say about it, cos we put shoes in recycling bins, they go to charity shops and that's about it.
BELLA: . . . but there's much more to it than that.
DON: I realise that now and I'm keen to research the topic more.
BELLA: That's great.
DON: One of the things I didn't realise until I read the article was just how many pairs of trainers get recycled!
BELLA: Well, a lot of young people wear them all the time now. They've become more popular than ordinary shoes.
DON: I know. I guess they are very hard-wearing, but don't they look a bit casual for school uniform? I don't think they're right for that.
BELLA: Actually, I think some of them look quite smart on pupils . . . better than a scruffy old pair of shoes.
So do you keep shoes a long time?
DON: Yes. Though I do tend to wear my old pairs for doing dirty jobs like cleaning my bike.
BELLA: I must admit, I've recycled some perfectly good shoes, that haven't gone out of fashion and still fit, just because they don't look great on me any more. That's awful isn't it?
DON: I think it's common because there's so much choice. The article did say that recent sales of footwear have increased enormously.
BELLA: That didn't surprise me.
DON: No. But then it said that the amount of recycled footwear has fallen: it's 6 percent now compared to a previous level of 11 percent. That doesn't seem to make sense.
BELLA: That's because not everything goes through the recycling process. Some footwear just isn't good enough to re-sell, for one reason or another, and gets rejected.

BELLA: So let's find some examples in the article of footwear that was rejected for recycling.
DON: OK. I think there are some in the interview with the recycling manager. Yeah - here it is.
BELLA: Mmm. Let's start with the ladies' high-heeled shoes. What did he say about those?
DON: He said they were probably expensive - the material was suede and they were beige in colour - it looked like someone had only worn them once, but in a very wet field so the heels were too stained with mud and grass to re-sell them.
BELLA: OK . . . and the leather ankle boots. What was wrong with them?
DON: Apparently, the heels were worn - but that wasn't the problem. One of the shoes was a much lighter shade than the other one - it had obviously been left in the sun. I suppose even second-hand shoes should look the same!
BELLA: Sure. Then there were the red baby shoes.
DON: Oh yes - we're told to tie shoes together when we put them in a recycling bin, but people often don't bother.
BELLA: You'd think it would have been easy to find the other, but it wasn't. That was a shame because they were obviously new.
DON: The trainers were interesting. He said they looked like they'd been worn by a marathon runner.
BELLA: Yeah - weren't they split?
DON: Not exactly. One of the soles was so worn under the foot that you could put your finger through it.
Well, we could certainly use some of those examples in our presentation to explain why 90 percent of shoes that people take to recycling centres or bins get thrown into landfill.
BELLA: Mmm. What did you think about the project his team set up to avoid this by making new shoes out of the good parts of old shoes?
DON: It sounded like a good idea. They get so many shoes, they should be able to match parts. I wasn't surprised that it failed, though. I mean who wants to buy second-hand shoes really? Think of all the germs you could catch!
BELLA: Well, people didn't refuse them for that reason, did they? It was because the pairs of shoes weren't identical.
DON: They still managed to ship them overseas, though.
BELLA: That's another area we need to discuss.
DON: You know I used to consider this topic just from my own perspective, by thinking about my own recycling behaviour without looking at the bigger picture. So much happens once shoes leave the recycling area.
BELLA: It's not as simple as you first think, and we can show that by taking a very different approach to it.
DON: Absolutely. So let's discuss . . .`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 25, quote: "before I started reading it, I thought recycling footwear, well, although it's quite interesting, perhaps there isn't enough to say about it" },
        { questionNumber: 22, timestampSeconds: 50, quote: "don't they look a bit casual for school uniform? I don't think they're right for that. BELLA: Actually, I think some of them look quite smart on pupils" },
        { questionNumber: 23, timestampSeconds: 70, quote: "I've recycled some perfectly good shoes, that haven't gone out of fashion and still fit, just because they don't look great on me any more." },
        { questionNumber: 24, timestampSeconds: 90, quote: "the amount of recycled footwear has fallen: it's 6 percent now compared to a previous level of 11 percent. That doesn't seem to make sense." },
        { questionNumber: 25, timestampSeconds: 125, quote: "the heels were too stained with mud and grass to re-sell them." },
        { questionNumber: 26, timestampSeconds: 145, quote: "One of the shoes was a much lighter shade than the other one - it had obviously been left in the sun." },
        { questionNumber: 27, timestampSeconds: 165, quote: "You'd think it would have been easy to find the other, but it wasn't. That was a shame because they were obviously new." },
        { questionNumber: 28, timestampSeconds: 185, quote: "One of the soles was so worn under the foot that you could put your finger through it." },
        { questionNumber: 29, timestampSeconds: 220, quote: "people didn't refuse them for that reason, did they? It was because the pairs of shoes weren't identical." },
        { questionNumber: 30, timestampSeconds: 250, quote: "It's not as simple as you first think, and we can show that by taking a very different approach to it. DON: Absolutely." },
      ],
    },
    {
      id: 'c19-l2-p4',
      partNumber: 4,
      title: 'Part 4: Tardigrades',
      context: 'An academic presentation about tardigrades (water bears), their physical traits, habitat, cryptobiosis, diet, and conservation status.',
      audioUrl: '/audio/listening/c19_test2_part4.mp3',
      containsIntroPauses: false,
      introPauseSeconds: 45,
      checkPauseSeconds: 30,
      transcript: `For my project on invertebrates, I chose to study tardigrades. These are microscopic - or to be more precise - near-microscopic animals. There are well over a thousand known species of these tiny animals, which belong to the phylum Tardigrada. Most tardigrades range in length from 0.05 to 1 millimetre, though the largest species can grow to be 1.2 millimetres in length. They are also sometimes called 'water bears': 'water' because that's where they thrive best, and 'bear' because of the way they move. 'Moss piglet' is another name for tardigrades because of the way they look when viewed from the front. They were first discovered in Germany in 1773 by Johann Goeze, who coined the name Tardigrada.

As I say, there are many different species of tardigrade - too many to describe here - but, generally speaking, the different species share similar physical traits. They have a body which is short, and also rounded - a bit like a barrel - and the body comprises four segments. Each segment has a pair of legs, at the end of which are between four and eight sharp claws. I should also say that some species don't have any claws; what they have are discs, and these work by means of suction. They enable the tardigrade to cling on to surfaces or to grip its prey. Within the body, there are no lungs, or any organs for breathing at all. Instead, oxygen and also blood are transported in a fluid that fills the cavity of the body.

As far as the tardigrade's head is concerned, the best way I can describe this is that it looks rather strange - a bit squashed even - though many of the websites I looked at described its appearance as cute, which isn't exactly very scientific. The tardigrade's mouth is a kind of tube that can open outwards to reveal teeth-like structures known as 'stylets'. These are sharp enough to pierce plant or animal cells.

So, where are tardigrades found? Well, they live in every part of the world, in a variety of habitats: most commonly, on the bed of a lake, or on many kinds of plants or in very wet environments. There's been some interesting research which has found that tardigrades are capable of surviving radiation and very high pressure, and they're also able to withstand temperatures as cold as -200 degrees centigrade, or highs of more than 148 degrees centigrade, which is incredibly hot.

It has been said that tardigrades could survive long after human beings have been wiped out, even in the event of an asteroid hitting the earth. If conditions become too extreme and tardigrades are at risk of drying out, they enter a state called cryptobiosis. They curl into a ball, called a tun - that's T-U-N - by retracting their head and legs, and their metabolism drops to less than one percent of normal levels. They can remain like this until they are re-introduced to water, when they will come back to life in a matter of a few hours. While in a state of cryptobiosis, tardigrades produce a protein that protects their DNA. In 2016, scientists revived two tardigrades that had been tuns for more than 30 years. There was a report that, in 1948, a 120-year-old tun was revived, but this experiment has never been repeated. There are currently several tests taking place in space, to determine how long tardigrades might be able to survive there. I believe the record so far is 10 days.

So, erm, moving on. In terms of their diet, tardigrades consume liquids in order to survive. Although they have teeth, they don't use these for chewing. They suck the juices from moss, or extract fluid from seaweed, but some species prey on other tardigrades, from other species or within their own. I suppose this isn't surprising, given that tardigrades are mainly comprised of liquid and are coated with a type of gel.

Finally, I'd like to mention the conservation status of tardigrades. It is estimated that they have been in existence for approximately half a billion years and, in that time, they have survived five mass extinctions. So, it will probably come as no surprise to you, that tardigrades have not been evaluated by the International Union for Conservation of Nature and are not on any endangered list. Some researchers have described them as thriving.

Does anyone have any questions they'd like to ask?`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 30, quote: "'water' because that's where they thrive best, and 'bear' because of the way they move." },
        { questionNumber: 32, timestampSeconds: 65, quote: "They have a body which is short, and also rounded - a bit like a barrel" },
        { questionNumber: 33, timestampSeconds: 85, quote: "what they have are discs, and these work by means of suction." },
        { questionNumber: 34, timestampSeconds: 105, quote: "Instead, oxygen and also blood are transported in a fluid that fills the cavity of the body." },
        { questionNumber: 35, timestampSeconds: 125, quote: "The tardigrade's mouth is a kind of tube that can open outwards" },
        { questionNumber: 36, timestampSeconds: 155, quote: "they're also able to withstand temperatures as cold as -200 degrees centigrade, or highs of more than 148 degrees centigrade" },
        { questionNumber: 37, timestampSeconds: 195, quote: "While in a state of cryptobiosis, tardigrades produce a protein that protects their DNA." },
        { questionNumber: 38, timestampSeconds: 220, quote: "There are currently several tests taking place in space, to determine how long tardigrades might be able to survive there." },
        { questionNumber: 39, timestampSeconds: 245, quote: "They suck the juices from moss, or extract fluid from seaweed" },
        { questionNumber: 40, timestampSeconds: 275, quote: "tardigrades have not been evaluated by the International Union for Conservation of Nature and are not on any endangered list." },
      ],
    },
  ];

  const mcOptions = (a: string, b: string, c: string) => [
    { key: 'A', text: a },
    { key: 'B', text: b },
    { key: 'C', text: c },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-6 (Form Completion)
    {
      id: 'c19-l2-g1',
      partNumber: 1,
      questionType: 'form_completion',
      title: 'Questions 1–6',
      instructions: 'Complete the form below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 6,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      formData: {
        formTitle: 'Guitar Group',
        fields: [
          { label: 'Coordinator:', isGap: true, questionNumber: 1, defaultValue: 'Gary [[1]]' },
          { label: 'Level:', isGap: true, questionNumber: 2, defaultValue: '[[2]]' },
          { label: 'Place:', isGap: true, questionNumber: 3, defaultValue: 'the [[3]]' },
          { label: '', isGap: true, questionNumber: 4, defaultValue: '[[4]] Street' },
          { label: '', defaultValue: 'First floor, Room T347' },
          { label: 'Time:', isGap: true, questionNumber: 5, defaultValue: 'Thursday morning at [[5]]' },
          { label: 'Recommended website:', isGap: true, questionNumber: 6, defaultValue: "'The perfect [[6]]'" },
        ],
      },
      questions: [
        {
          id: 'c19-l2-q1',
          questionNumber: 1,
          prompt: 'Coordinator: Gary ________',
          answerKey: 'Mathieson',
          acceptedAlternatives: ['Mathieson', 'mathieson'],
          explanation: "Coleman spells the coordinator's surname: 'He's called a coordinator - his name's Gary Mathieson. It's M-A-T-H-I-E-S-O-N.'",
          transcriptExcerpt: "He's called a 'coordinator' - his name's Gary Mathieson. Let me note that down. Gary. . . . How do you spell his surname? It's M-A-T-H-I-E-S-O-N.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c19-l2-q2',
          questionNumber: 2,
          prompt: 'Level: ________',
          answerKey: 'beginners',
          acceptedAlternatives: ['beginners', 'beginner', "beginners'"],
          explanation: "Coleman reassures the woman that it is a class for beginners: 'When I first spoke to Gary on the phone, he said it was a class for beginners'.",
          transcriptExcerpt: "When I first spoke to Gary on the phone, he said it was a class for beginners, but I was still worried that everyone would be better than me",
          audioTimestampSeconds: 45,
        },
        {
          id: 'c19-l2-q3',
          questionNumber: 3,
          prompt: 'Place: the ________',
          answerKey: 'college',
          acceptedAlternatives: ['college'],
          explanation: "Coleman mentions the venue: 'he decided to book a room at the college in town. I prefer going there.'",
          transcriptExcerpt: "when I joined the group, they were meeting in Gary's home, but as the group got bigger, he decided to book a room at the college in town.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c19-l2-q4',
          questionNumber: 4,
          prompt: '________ Street',
          answerKey: 'New',
          acceptedAlternatives: ['New', 'new'],
          explanation: "When the woman asks if it's Lock Street, Coleman clarifies: 'It's just beyond there at the bottom of New Street near the city roundabout.'",
          transcriptExcerpt: "I can't remember what road it's in . . . is it Lock Street? COLEMAN: It's just beyond there at the bottom of New Street near the city roundabout.",
          audioTimestampSeconds: 80,
        },
        {
          id: 'c19-l2-q5',
          questionNumber: 5,
          prompt: 'Thursday morning at ________',
          answerKey: '11',
          acceptedAlternatives: ['11', 'eleven', '11 am', '11am', '11.00', '11:00', '11 (am)', 'eleven (am)'],
          explanation: "Coleman explains: 'It used to be 10.30 and that suited me well, but now we meet at 11.'",
          transcriptExcerpt: "We meet on Thursdays. It used to be 10.30 and that suited me well, but now we meet at 11. The class that's in there before us asked if they could have the room for another 30 minutes.",
          audioTimestampSeconds: 105,
        },
        {
          id: 'c19-l2-q6',
          questionNumber: 6,
          prompt: "Recommended website: 'The perfect ________'",
          answerKey: 'instrument',
          acceptedAlternatives: ['instrument'],
          explanation: "Coleman recommends: 'There's a website called The perfect instrument that sells all kinds of guitars, violins and so on.'",
          transcriptExcerpt: "There's a website called 'The perfect instrument' that sells all kinds of guitars, violins and so on. I'm sure you'll find something there.",
          audioTimestampSeconds: 125,
        },
      ],
    },

    // PART 1: Questions 7-10 (Table Completion)
    {
      id: 'c19-l2-g2',
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
        headers: ['Time', 'Activity', 'Notes'],
        rows: [
          {
            cells: [
              { content: '5 minutes' },
              { content: 'tuning guitars' },
              { content: 'using an app or by [[7]]', isGap: true, questionNumber: 7 },
            ],
          },
          {
            cells: [
              { content: '10 minutes' },
              { content: 'strumming chords using our thumbs' },
              { content: 'keeping time while the teacher is [[8]]', isGap: true, questionNumber: 8 },
            ],
          },
          {
            cells: [
              { content: '15 minutes' },
              { content: 'playing songs' },
              { content: 'often listening to a [[9]] of a song', isGap: true, questionNumber: 9 },
            ],
          },
          {
            cells: [
              { content: '10 minutes' },
              { content: 'playing single notes and simple tunes' },
              { content: 'playing together, then [[10]]', isGap: true, questionNumber: 10 },
            ],
          },
          {
            cells: [
              { content: '5 minutes' },
              { content: 'noting things to practise at home' },
              { content: '' },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c19-l2-q7',
          questionNumber: 7,
          prompt: 'tuning guitars — using an app or by ________',
          answerKey: 'ear',
          acceptedAlternatives: ['ear'],
          explanation: "Coleman explains: 'Some people have an app they use, but others do it by ear. Gary goes round and helps them.'",
          transcriptExcerpt: "Some people have an app they use, but others do it by ear. Gary goes round and helps them.",
          audioTimestampSeconds: 150,
        },
        {
          id: 'c19-l2-q8',
          questionNumber: 8,
          prompt: 'strumming chords using our thumbs — keeping time while the teacher is ________',
          answerKey: 'clapping',
          acceptedAlternatives: ['clapping'],
          explanation: "Coleman states: 'Sometimes we all just start laughing because we're so bad at keeping time, so Gary starts clapping to help us.'",
          transcriptExcerpt: "we're so bad at keeping time, so Gary starts clapping to help us.",
          audioTimestampSeconds: 175,
        },
        {
          id: 'c19-l2-q9',
          questionNumber: 9,
          prompt: 'playing songs — often listening to a ________ of a song',
          answerKey: 'recording',
          acceptedAlternatives: ['recording'],
          explanation: "Coleman describes: 'That part of the lesson takes about 15 minutes. He often brings a recording of the song and plays it to us first.'",
          transcriptExcerpt: "He often brings a recording of the song and plays it to us first. Then he hands out the song and if there's a new chord in it, we practise that before we play it together",
          audioTimestampSeconds: 200,
        },
        {
          id: 'c19-l2-q10',
          questionNumber: 10,
          prompt: 'playing single notes and simple tunes — playing together, then ________',
          answerKey: 'alone',
          acceptedAlternatives: ['alone'],
          explanation: "Coleman says: 'The only trouble is that he sometimes gets us to play one at a time - you know, alone.'",
          transcriptExcerpt: "The only trouble is that he sometimes gets us to play one at a time - you know, alone. WOMAN: That's scary. COLEMAN: It is, but I've got used to it now.",
          audioTimestampSeconds: 230,
        },
      ],
    },

    // PART 2: Questions 11-16 (Multiple Choice Single)
    {
      id: 'c19-l2-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 11–16',
      instructions: 'Choose the correct letter, A, B or C.\nWorking as a lifeboat volunteer',
      startQuestionNumber: 11,
      endQuestionNumber: 16,
      questions: [
        {
          id: 'c19-l2-q11',
          questionNumber: 11,
          prompt: 'What made David leave London and move to Northsea?',
          options: mcOptions(
            'He was eager to develop a hobby.',
            'He wanted to work shorter hours.',
            'He found his job in website design unsatisfying.'
          ),
          answerKey: 'A',
          explanation: "David explains: 'I'd been really keen on boats as a teenager, and I thought if I went to live by the sea, I might be able to pursue that interest a bit more in my free time.' This corresponds to developing a hobby.",
          transcriptExcerpt: "I'd been really keen on boats as a teenager, and I thought if I went to live by the sea, I might be able to pursue that interest a bit more in my free time.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c19-l2-q12',
          questionNumber: 12,
          prompt: 'The Lifeboat Institution in Northsea was built with money provided by',
          options: mcOptions('a local organisation.', 'a local resident.', 'the local council.'),
          answerKey: 'B',
          explanation: "David explains the building 'was built 15 years ago with funds provided by a generous member of the public who'd lived here all her life' (a local resident).",
          transcriptExcerpt: "It was built 15 years ago with funds provided by a generous member of the public who'd lived here all her life.",
          audioTimestampSeconds: 50,
        },
        {
          id: 'c19-l2-q13',
          questionNumber: 13,
          prompt: 'In his health assessment, the doctor was concerned about the fact that David',
          options: mcOptions('might be colour blind.', 'was rather short-sighted.', 'had undergone eye surgery.'),
          answerKey: 'A',
          explanation: "David says: 'They gave me tests for colour blindness and they thought I might have a problem there, but it turned out I was OK.'",
          transcriptExcerpt: "They gave me tests for colour blindness and they thought I might have a problem there, but it turned out I was OK.",
          audioTimestampSeconds: 75,
        },
        {
          id: 'c19-l2-q14',
          questionNumber: 14,
          prompt: 'After arriving at the lifeboat station, they aim to launch the boat within',
          options: mcOptions('five minutes.', 'six to eight minutes.', 'eight and a half minutes.'),
          answerKey: 'B',
          explanation: "David says: 'Our target's to get there in five minutes, then we try to get the boat off the dock and out to sea in another six to eight minutes.'",
          transcriptExcerpt: "we try to get the boat off the dock and out to sea in another six to eight minutes. Our team's proud that we usually achieve that",
          audioTimestampSeconds: 95,
        },
        {
          id: 'c19-l2-q15',
          questionNumber: 15,
          prompt: "As a 'helmsman', David has the responsibility of deciding",
          options: mcOptions(
            'who will be the members of his crew.',
            'what equipment it will be necessary to take.',
            'if the lifeboat should be launched.'
          ),
          answerKey: 'C',
          explanation: "David states: 'And it's ultimately my decision whether it's safe to launch the boat.'",
          transcriptExcerpt: "And it's ultimately my decision whether it's safe to launch the boat. But it's very rare not to launch it, even in the worst weather.",
          audioTimestampSeconds: 120,
        },
        {
          id: 'c19-l2-q16',
          questionNumber: 16,
          prompt: 'As well as going out on the lifeboat, David',
          options: mcOptions(
            'gives talks on safety at sea.',
            'helps with fundraising.',
            'recruits new volunteers.'
          ),
          answerKey: 'A',
          explanation: "David explains: 'so I speak to youth groups and sailing clubs in the area about the sorts of problems that sailors and swimmers can have if the weather suddenly gets bad' (safety at sea).",
          transcriptExcerpt: "so I speak to youth groups and sailing clubs in the area about the sorts of problems that sailors and swimmers can have if the weather suddenly gets bad.",
          audioTimestampSeconds: 145,
        },
      ],
    },

    // PART 2: Questions 17 and 18 (Multiple Choice Multi)
    {
      id: 'c19-l2-g4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 17 and 18',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO things does David say about the lifeboat volunteer training?',
      startQuestionNumber: 17,
      endQuestionNumber: 18,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q17_OPTIONS,
      questions: [
        multiQuestion(
          'c19-l2-q17',
          17,
          'Which TWO things does David say about the lifeboat volunteer training?',
          MC_Q17_OPTIONS,
          ['C', 'E'],
          "David highlights: 'it's given me the confidence to deal with extreme situations without panicking' (C) and 'They had a wave-tank where they could create extreme weather conditions – so we could get experience at what to do if the boat turned over in a storm' (survival techniques, E).",
          "it's given me the confidence to deal with extreme situations without panicking... They had a wave-tank where they could create extreme weather conditions – so we could get experience at what to do if the boat turned over in a storm at night, for example.",
          175
        ),
        multiQuestion(
          'c19-l2-q18',
          18,
          'Which TWO things does David say about the lifeboat volunteer training?',
          MC_Q17_OPTIONS,
          ['C', 'E'],
          "David highlights: 'it's given me the confidence to deal with extreme situations without panicking' (C) and 'They had a wave-tank where they could create extreme weather conditions – so we could get experience at what to do if the boat turned over in a storm' (survival techniques, E).",
          "it's given me the confidence to deal with extreme situations without panicking... They had a wave-tank where they could create extreme weather conditions – so we could get experience at what to do if the boat turned over in a storm at night, for example.",
          195
        ),
      ],
    },

    // PART 2: Questions 19 and 20 (Multiple Choice Multi)
    {
      id: 'c19-l2-g5',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 19 and 20',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO things does David find most motivating about the work he does?',
      startQuestionNumber: 19,
      endQuestionNumber: 20,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q19_OPTIONS,
      questions: [
        multiQuestion(
          'c19-l2-q19',
          19,
          'Which TWO things does David find most motivating about the work he does?',
          MC_Q19_OPTIONS,
          ['A', 'B'],
          "David notes the team spirit: 'They're a great group – we're like a family really, which helps when you're dragging yourself out of bed' (working as part of a team, A) and 'actually, it's the colder months that can be the most rewarding time' (working in winter, B).",
          "They're a great group – we're like a family really, which helps when you're dragging yourself out of bed on a cold stormy night. But actually, it's the colder months that can be the most rewarding time.",
          220
        ),
        multiQuestion(
          'c19-l2-q20',
          20,
          'Which TWO things does David find most motivating about the work he does?',
          MC_Q19_OPTIONS,
          ['A', 'B'],
          "David notes the team spirit: 'They're a great group – we're like a family really, which helps when you're dragging yourself out of bed' (working as part of a team, A) and 'actually, it's the colder months that can be the most rewarding time' (working in winter, B).",
          "They're a great group – we're like a family really, which helps when you're dragging yourself out of bed on a cold stormy night. But actually, it's the colder months that can be the most rewarding time.",
          235
        ),
      ],
    },

    // PART 3: Questions 21-24 (Multiple Choice Single)
    {
      id: 'c19-l2-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 21–24',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 21,
      endQuestionNumber: 24,
      questions: [
        {
          id: 'c19-l2-q21',
          questionNumber: 21,
          prompt: 'At first, Don thought the topic of recycling footwear might be too',
          options: mcOptions('limited in scope.', 'hard to research.', 'boring for listeners.'),
          answerKey: 'A',
          explanation: "Don says: 'before I started reading it, I thought recycling footwear, well, although it's quite interesting, perhaps there isn't enough to say about it' (limited in scope).",
          transcriptExcerpt: "before I started reading it, I thought recycling footwear, well, although it's quite interesting, perhaps there isn't enough to say about it, cos we put shoes in recycling bins, they go to charity shops and that's about it.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c19-l2-q22',
          questionNumber: 22,
          prompt: 'When discussing trainers, Bella and Don disagree about',
          options: mcOptions(
            'how popular they are among young people.',
            'how suitable they are for school.',
            'how quickly they wear out.'
          ),
          answerKey: 'B',
          explanation: "Don thinks trainers look 'a bit casual for school uniform' and are not right, but Bella disagrees: 'Actually, I think some of them look quite smart on pupils . . . better than a scruffy old pair of shoes.'",
          transcriptExcerpt: "DON: don't they look a bit casual for school uniform? I don't think they're right for that. BELLA: Actually, I think some of them look quite smart on pupils . . . better than a scruffy old pair of shoes.",
          audioTimestampSeconds: 50,
        },
        {
          id: 'c19-l2-q23',
          questionNumber: 23,
          prompt: 'Bella says that she sometimes recycles shoes because',
          options: mcOptions('they no longer fit.', 'she no longer likes them.', 'they are no longer in fashion.'),
          answerKey: 'B',
          explanation: "Bella admits: 'I've recycled some perfectly good shoes, that haven't gone out of fashion and still fit, just because they don't look great on me any more' (she no longer likes them).",
          transcriptExcerpt: "I've recycled some perfectly good shoes, that haven't gone out of fashion and still fit, just because they don't look great on me any more. That's awful isn't it?",
          audioTimestampSeconds: 70,
        },
        {
          id: 'c19-l2-q24',
          questionNumber: 24,
          prompt: 'What did the article say that confused Don?',
          options: mcOptions(
            'Public consumption of footwear has risen.',
            'Less footwear is recycled now than in the past.',
            'People dispose of more footwear than they used to.'
          ),
          answerKey: 'B',
          explanation: "Don was puzzled: 'the amount of recycled footwear has fallen: it's 6 percent now compared to a previous level of 11 percent. That doesn't seem to make sense.'",
          transcriptExcerpt: "the amount of recycled footwear has fallen: it's 6 percent now compared to a previous level of 11 percent. That doesn't seem to make sense.",
          audioTimestampSeconds: 90,
        },
      ],
    },

    // PART 3: Questions 25-28 (Matching)
    {
      id: 'c19-l2-g7',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 25–28',
      instructions:
        'What reasons did the recycling manager give for rejecting footwear, according to the students?\nChoose FOUR answers from the box and write the correct letter, A–F, next to Questions 25–28.',
      startQuestionNumber: 25,
      endQuestionNumber: 28,
      optionsList: MATCHING_Q25_OPTIONS,
      questions: [
        {
          id: 'c19-l2-q25',
          questionNumber: 25,
          prompt: 'the high-heeled shoes',
          answerKey: 'E',
          explanation: "Don explains: 'someone had only worn them once, but in a very wet field so the heels were too stained with mud and grass to re-sell them' (too dirty, E).",
          transcriptExcerpt: "the heels were too stained with mud and grass to re-sell them.",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c19-l2-q26',
          questionNumber: 26,
          prompt: 'the ankle boots',
          answerKey: 'B',
          explanation: "Don describes: 'One of the shoes was a much lighter shade than the other one - it had obviously been left in the sun' (colour had faded, B).",
          transcriptExcerpt: "One of the shoes was a much lighter shade than the other one - it had obviously been left in the sun. I suppose even second-hand shoes should look the same!",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c19-l2-q27',
          questionNumber: 27,
          prompt: 'the baby shoes',
          answerKey: 'A',
          explanation: "Bella notes: 'You'd think it would have been easy to find the other, but it wasn't. That was a shame because they were obviously new.' (one shoe was missing, A).",
          transcriptExcerpt: "You'd think it would have been easy to find the other, but it wasn't. That was a shame because they were obviously new.",
          audioTimestampSeconds: 165,
        },
        {
          id: 'c19-l2-q28',
          questionNumber: 28,
          prompt: 'the trainers',
          answerKey: 'C',
          explanation: "Don says: 'One of the soles was so worn under the foot that you could put your finger through it' (one shoe had a hole in it, C).",
          transcriptExcerpt: "One of the soles was so worn under the foot that you could put your finger through it.",
          audioTimestampSeconds: 185,
        },
      ],
    },

    // PART 3: Questions 29-30 (Multiple Choice Single)
    {
      id: 'c19-l2-g8',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 29 and 30',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 29,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c19-l2-q29',
          questionNumber: 29,
          prompt: "Why did the project to make 'new' shoes out of old shoes fail?",
          options: mcOptions(
            "People believed the 'new' pairs of shoes were unhygienic.",
            'There were not enough good parts to use in the old shoes.',
            "The shoes in the 'new' pairs were not completely alike."
          ),
          answerKey: 'C',
          explanation: "Bella clarifies: 'Well, people didn't refuse them for that reason, did they? It was because the pairs of shoes weren't identical' (not completely alike, C).",
          transcriptExcerpt: "Well, people didn't refuse them for that reason, did they? It was because the pairs of shoes weren't identical.",
          audioTimestampSeconds: 220,
        },
        {
          id: 'c19-l2-q30',
          questionNumber: 30,
          prompt: 'Bella and Don agree that they can present their topic',
          options: mcOptions('from a new angle.', 'with relevant images.', 'in a straightforward way.'),
          answerKey: 'A',
          explanation: "Bella suggests: 'we can show that by taking a very different approach to it' and Don agrees: 'Absolutely.' (from a new angle, A).",
          transcriptExcerpt: "It's not as simple as you first think, and we can show that by taking a very different approach to it. DON: Absolutely.",
          audioTimestampSeconds: 250,
        },
      ],
    },

    // PART 4: Questions 31-40 (Note Completion)
    {
      id: 'c19-l2-g9',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Tardigrades

• more than 1,000 species, 0.05–1.2 millimetres long
• also known as water 'bears' (due to how they [[31]]) and 'moss piglets'

Physical appearance
• a [[32]] round body and four pairs of legs
• claws or [[33]] for gripping
• absence of respiratory organs
• body filled with a liquid that carries both [[34]] and blood
• mouth shaped like a [[35]] with teeth called stylets

Habitat
• often found at the bottom of a lake or on plants
• very resilient and can exist in very low or high [[36]]

Cryptobiosis
• In dry conditions, they roll into a ball called a 'tun'.
• They stay alive with a much lower metabolism than usual.
• A type of [[37]] ensures their DNA is not damaged.
• Research is underway to find out how many days they can stay alive in [[38]].

Feeding
• consume liquids, e.g., those found in moss or [[39]]
• may eat other tardigrades

Conservation status
• They are not considered to be [[40]].`,
      questions: [
        {
          id: 'c19-l2-q31',
          questionNumber: 31,
          prompt: "also known as water 'bears' (due to how they ________) and 'moss piglets'",
          answerKey: 'move',
          acceptedAlternatives: ['move'],
          explanation: "The speaker explains they are called water bears: ''water' because that's where they thrive best, and 'bear' because of the way they move.'",
          transcriptExcerpt: "'water' because that's where they thrive best, and 'bear' because of the way they move.",
          audioTimestampSeconds: 30,
        },
        {
          id: 'c19-l2-q32',
          questionNumber: 32,
          prompt: 'a ________ round body and four pairs of legs',
          answerKey: 'short',
          acceptedAlternatives: ['short'],
          explanation: "The speaker describes: 'They have a body which is short, and also rounded – a bit like a barrel'.",
          transcriptExcerpt: 'They have a body which is short, and also rounded – a bit like a barrel – and the body comprises four segments.',
          audioTimestampSeconds: 65,
        },
        {
          id: 'c19-l2-q33',
          questionNumber: 33,
          prompt: 'claws or ________ for gripping',
          answerKey: 'discs',
          acceptedAlternatives: ['discs', 'disks'],
          explanation: "The speaker notes: 'some species don't have any claws; what they have are discs, and these work by means of suction. They enable the tardigrade to cling on to surfaces or to grip its prey.'",
          transcriptExcerpt: "some species don't have any claws; what they have are discs, and these work by means of suction. They enable the tardigrade to cling on to surfaces or to grip its prey.",
          audioTimestampSeconds: 85,
        },
        {
          id: 'c19-l2-q34',
          questionNumber: 34,
          prompt: 'body filled with a liquid that carries both ________ and blood',
          answerKey: 'oxygen',
          acceptedAlternatives: ['oxygen'],
          explanation: "The speaker states: 'oxygen and also blood are transported in a fluid that fills the cavity of the body.'",
          transcriptExcerpt: 'Instead, oxygen and also blood are transported in a fluid that fills the cavity of the body.',
          audioTimestampSeconds: 105,
        },
        {
          id: 'c19-l2-q35',
          questionNumber: 35,
          prompt: 'mouth shaped like a ________ with teeth called stylets',
          answerKey: 'tube',
          acceptedAlternatives: ['tube'],
          explanation: "The speaker explains: 'The tardigrade's mouth is a kind of tube that can open outwards to reveal teeth-like structures known as stylets.'",
          transcriptExcerpt: "The tardigrade's mouth is a kind of tube that can open outwards to reveal teeth-like structures known as 'stylets'.",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c19-l2-q36',
          questionNumber: 36,
          prompt: 'very resilient and can exist in very low or high ________',
          answerKey: 'temperatures',
          acceptedAlternatives: ['temperatures', 'temperature'],
          explanation: "The speaker highlights: 'they're also able to withstand temperatures as cold as -200 degrees centigrade, or highs of more than 148 degrees centigrade'.",
          transcriptExcerpt: "they're also able to withstand temperatures as cold as -200 degrees centigrade, or highs of more than 148 degrees centigrade, which is incredibly hot.",
          audioTimestampSeconds: 155,
        },
        {
          id: 'c19-l2-q37',
          questionNumber: 37,
          prompt: 'A type of ________ ensures their DNA is not damaged.',
          answerKey: 'protein',
          acceptedAlternatives: ['protein'],
          explanation: "The speaker describes cryptobiosis: 'While in a state of cryptobiosis, tardigrades produce a protein that protects their DNA.'",
          transcriptExcerpt: 'While in a state of cryptobiosis, tardigrades produce a protein that protects their DNA.',
          audioTimestampSeconds: 195,
        },
        {
          id: 'c19-l2-q38',
          questionNumber: 38,
          prompt: 'Research is underway to find out how many days they can stay alive in ________.',
          answerKey: 'space',
          acceptedAlternatives: ['space'],
          explanation: "The speaker states: 'There are currently several tests taking place in space, to determine how long tardigrades might be able to survive there.'",
          transcriptExcerpt: 'There are currently several tests taking place in space, to determine how long tardigrades might be able to survive there.',
          audioTimestampSeconds: 220,
        },
        {
          id: 'c19-l2-q39',
          questionNumber: 39,
          prompt: 'consume liquids, e.g., those found in moss or ________',
          answerKey: 'seaweed',
          acceptedAlternatives: ['seaweed'],
          explanation: "The speaker mentions their diet: 'They suck the juices from moss, or extract fluid from seaweed'.",
          transcriptExcerpt: 'They suck the juices from moss, or extract fluid from seaweed, but some species prey on other tardigrades',
          audioTimestampSeconds: 245,
        },
        {
          id: 'c19-l2-q40',
          questionNumber: 40,
          prompt: 'They are not considered to be ________.',
          answerKey: 'endangered',
          acceptedAlternatives: ['endangered'],
          explanation: "The speaker concludes: 'tardigrades have not been evaluated by the International Union for Conservation of Nature and are not on any endangered list.'",
          transcriptExcerpt: 'tardigrades have not been evaluated by the International Union for Conservation of Nature and are not on any endangered list. Some researchers have described them as thriving.',
          audioTimestampSeconds: 275,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 19 Academic Listening Test 2',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      overallAudioUrl: '/audio/listening/c19_test2_complete.mp3',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c19_test2_part1.mp3', durationSeconds: 360 },
        { partNumber: 2, audioUrl: '/audio/listening/c19_test2_part2.mp3', durationSeconds: 340 },
        { partNumber: 3, audioUrl: '/audio/listening/c19_test2_part3.mp3', durationSeconds: 380 },
        { partNumber: 4, audioUrl: '/audio/listening/c19_test2_part4.mp3', durationSeconds: 390 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge19ListeningTest2(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
}> {
  const data = getCambridge19ListeningTest2Data();
  const errors = validateListeningTestVersion(data.parts, data.questionGroups);
  if (errors.length > 0) {
    throw new Error(`Cambridge 19 Listening Test 2 validation failed:\n- ${errors.join('\n- ')}`);
  }

  const resolvedAuthorId =
    authorId ||
    ((await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get()) as any)?.id ||
    uuidv4();

  const now = new Date().toISOString();

  const existingTest = (await db
    .prepare("SELECT id FROM listening_tests WHERE title = ?")
    .get(data.title)) as any;

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVer = (await db
      .prepare('SELECT id FROM listening_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
      .get(testId)) as any;

    versionId = existingVer ? existingVer.id : uuidv4();

    if (existingVer) {
      (await db.prepare(`
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
      ));
    } else {
      (await db.prepare(`
        INSERT INTO listening_test_versions (
          id, test_id, version_number, status, parts_json, question_groups_json,
          total_questions, audio_config_json, validation_errors_json, published_at, created_at
        ) VALUES (?, ?, 1, 'published', ?, ?, 40, ?, '[]', ?, ?)
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
      SET status = 'published',
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(now, testId));
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
        id, test_id, version_number, status, parts_json, question_groups_json,
        total_questions, audio_config_json, validation_errors_json, published_at, created_at
      ) VALUES (?, ?, 1, 'published', ?, ?, 40, ?, '[]', ?, ?)
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
