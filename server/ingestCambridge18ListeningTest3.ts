import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, QuestionItem, OptionChoice } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

function multiQuestion(
  id: string,
  questionNumber: number,
  prompt: string,
  options: OptionChoice[],
  answerKey: string[],
  explanation: string,
  transcriptExcerpt: string,
  audioTimestampSeconds: number
): QuestionItem {
  return {
    id,
    questionNumber,
    prompt,
    options,
    answerKey,
    acceptedAlternatives: answerKey,
    explanation,
    transcriptExcerpt,
    audioTimestampSeconds,
  };
}

export function getCambridge18ListeningTest3Data(): {
  title: string;
  category: 'mock';
  audioMode: 'part_audios';
  timeLimitMinutes: number;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
  audioConfig: any;
} {
  const MC_Q11_OPTIONS: OptionChoice[] = [
    { key: 'A', text: "Don't pick more than one variety of mushroom at a time." },
    { key: 'B', text: "Don't pick mushrooms near busy roads." },
    { key: 'C', text: "Don't eat mushrooms given to you." },
    { key: 'D', text: "Don't eat mushrooms while picking them." },
    { key: 'E', text: "Don't pick old mushrooms." },
  ];

  const MC_Q13_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'Mushrooms should always be peeled before eating.' },
    { key: 'B', text: 'Mushrooms eaten by animals may be unsafe.' },
    { key: 'C', text: 'Cooking destroys toxins in mushrooms.' },
    { key: 'D', text: 'Brightly coloured mushrooms can be edible.' },
    { key: 'E', text: 'All poisonous mushrooms have a bad smell.' },
  ];

  const MC_Q21_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'Their actions were ineffective.' },
    { key: 'B', text: 'They are still influential today.' },
    { key: 'C', text: 'They have received unfair criticism.' },
    { key: 'D', text: 'They were proved right.' },
    { key: 'E', text: 'Their attitude is understandable.' },
  ];

  const MC_Q23_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'Work will be more rewarding.' },
    { key: 'B', text: 'Unemployment will fall.' },
    { key: 'C', text: 'People will want to delay retiring.' },
    { key: 'D', text: 'Working hours will be shorter.' },
    { key: 'E', text: 'People will change jobs more frequently.' },
  ];

  const MATCHING_COMMENTS_Q25_30: OptionChoice[] = [
    { key: 'A', text: 'These jobs are likely to be at risk.' },
    { key: 'B', text: 'Their role has become more interesting in recent years.' },
    { key: 'C', text: 'The number of people working in this sector has fallen dramatically.' },
    { key: 'D', text: 'This job will require more qualifications.' },
    { key: 'E', text: 'Higher disposable income has led to a huge increase in jobs.' },
    { key: 'F', text: 'There is likely to be a significant rise in demand for this service.' },
    { key: 'G', text: 'Both employment and productivity have risen.' },
  ];

  const parts: ListeningPart[] = [
    {
      id: 'c18-l3-p1',
      partNumber: 1,
      title: 'Part 1: Wayside Camera Club Membership',
      context: 'Dan calls Breda, the secretary of Wayside Camera Club, to ask about joining and discuss photography competitions.',
      audioUrl: '/audio/listening/c18_test3_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `BREDA: Hello, Wayside Camera Club, Breda speaking.
DAN: Oh, hello, um, my name's Dan and I'd like to join your club.
BREDA: That's great, Dan. We have an application form - would you like to complete it over the phone, then you can ask any questions you might have?
DAN: Oh, yes, thanks.
BREDA: OK, so what's your family name?
DAN: It's Green - Dan Green.
BREDA: So - can I take your email address?
DAN: Yes, it's dan1068@market.com.
BREDA: Thanks. And what about your home address?
DAN: Well, I'm about ten miles away from your club in Peacetown. I live in a house there.
BREDA: OK, so what's the house number and street?
DAN: It's 52 Marrowfield Street.
BREDA: Is that M-A double R-O-W-F-I-E-L-D?
DAN: That's right.
BREDA: ... and that's Peacetown, you said?
DAN: Uhuh.
BREDA: So how did you hear about our club? Did you look on the internet?
DAN: I usually do that, but this time, well, I was talking to a relative the other day and he suggested it.
BREDA: Oh, is he a member too?
DAN: He belongs to another club - but he'd heard good things about yours.
BREDA: OK. So what do you hope to get from joining?
DAN: Well, one thing that really interests me is the competitions that you have. I enjoy entering those.
BREDA: Right. Anything else?
DAN: Well, I also like to socialise with other photographers.
BREDA: That's great. So what type of membership would you like?
DAN: What are the options?
BREDA: It's £30 a year for full membership or £20 a year if you're an associate.
DAN: I think I'll go for the full membership, then.
BREDA: That's a good idea because you can't vote in meetings with an associate membership.
BREDA: If I could just find out a bit more about you...
DAN: OK.
BREDA: So you said you wanted to compete - have you ever won any photography competitions?
DAN: Not yet, but I have entered three in the past.
BREDA: Oh, that's interesting. So why don't you tell me something about those? Let's start with the first one.
DAN: Well, the theme was entitled 'Domestic Life'.
BREDA: I see - so it had to be something related to the home?
DAN: Yeah. I chose to take a photo of a family sitting round the dinner table having a meal, and, um, I didn't win, but I did get some feedback.
BREDA: Oh, what did the judges say?
DAN: That it was too 'busy' as a picture.
BREDA: Aha - so it was the composition of the picture that they criticised?
DAN: That's right - and once they'd told me that, I could see my mistake.
BREDA: So what was the theme of the second competition?
DAN: Well, my university was on the coast and that area gets a lot of beautiful sunsets, so that was the theme.
BREDA: Oh, sunsets, that's a great theme.
DAN: Yes. The instructions were to capture the clouds as well - it couldn't just be blue sky and a setting sun.
BREDA: Sure, cause they give you all those amazing pinks and purples.
DAN: Yeah - and I thought I'd done that well, but the feedback was that I should have waited a bit longer to get the shot.
BREDA: I see. So the timing wasn't right.
DAN: Yes - I took it too soon, basically. And then the third competition I entered was called 'Animal Magic'.
BREDA: Well, that's a difficult subject!
DAN: I know! I had to take hundreds of shots.
BREDA: I'm sure – because animals move all the time.
DAN: That's what we had to show - there had to be some movement in the scene. I got a great shot of a fox in the end, but I took it at night and, well, I suspected that it was a bit dark, which is what I was told.
BREDA: Well Dan - you seem to be really keen and we'd be delighted to have you in our club. I'm sure we can help with all those areas that you've outlined.
DAN: Thanks, that's great.`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 40, quote: "It's 52 Marrowfield Street. Is that M-A double R-O-W-F-I-E-L-D? That's right." },
        { questionNumber: 2, timestampSeconds: 62, quote: "I was talking to a relative the other day and he suggested it." },
        { questionNumber: 3, timestampSeconds: 80, quote: "Well, I also like to socialise with other photographers." },
        { questionNumber: 4, timestampSeconds: 98, quote: "I think I'll go for the full membership, then." },
        { questionNumber: 5, timestampSeconds: 122, quote: "Well, the theme was entitled 'Domestic Life'." },
        { questionNumber: 6, timestampSeconds: 152, quote: "The instructions were to capture the clouds as well - it couldn't just be blue sky and a setting sun." },
        { questionNumber: 7, timestampSeconds: 172, quote: "I see. So the timing wasn't right." },
        { questionNumber: 8, timestampSeconds: 184, quote: "the third competition I entered was called 'Animal Magic'." },
        { questionNumber: 9, timestampSeconds: 202, quote: "That's what we had to show - there had to be some movement in the scene." },
        { questionNumber: 10, timestampSeconds: 218, quote: "I suspected that it was a bit dark, which is what I was told." },
      ],
    },
    {
      id: 'c18-l3-p2',
      partNumber: 2,
      title: 'Part 2: Picking Wild Mushrooms',
      context: 'Dan Beagle gives a talk about safety, identification, locations, conservation, and cooking when foraging for wild mushrooms.',
      audioUrl: '/audio/listening/c18_test3_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `PRESENTER: This evening we're delighted to welcome Dan Beagle, who's just written a book on looking for and finding food in the wild. He's going to tell us everything we need to know about picking wild mushrooms.
DAN: Thank you very much. Well, I need to start by talking about safety. You really need to know what you're doing because some mushrooms are extremely poisonous. Having said that, once you know what to look for, it's really worth doing for the amazing variety of mushrooms available - which you can't get in the shops. But of course, you have to be very careful and that's why I always say you should never consume mushrooms picked by friends or neighbours – always remember that some poisonous mushrooms look very similar to edible ones and it's easy for people to get confused. The other thing to avoid is mushrooms growing beside busy roads for obvious reasons. But nothing beats the taste of freshly picked mushrooms - don't forget that the ones in the shops are often several days old and past their best.
There are certain ideas about wild mushrooms that it's important to be aware of. Don't listen to people who tell you that it's only OK to eat mushrooms that are pale or dull – this is completely untrue. Some edible mushrooms are bright red, for example. Personally, I prefer mushrooms cooked but it won't do you any harm to eat them uncooked in salads - it's not necessary to peel them. Another thing you should remember is that you can't tell if a mushroom is safe to eat by its smell - some of the most deadly mushrooms have no smell and taste quite nice, apparently. Finally, just because deer or squirrels eat a particular mushroom doesn't mean that you can.
Of course, mushroom picking is associated with the countryside but if you haven't got a car, your local park can be a great place to start. There are usually a range of habitats where mushrooms grow, such as playing fields and wooded areas. But you need to be there first thing in the morning, as there's likely be a lot of competition - not just from people but wildlife too. The deer often get the best mushrooms in my local park.
If you're a complete beginner, I wouldn't recommend going alone or relying on photos in a book, even the one I've written! There are some really good phone apps for identifying mushrooms, but you can't always rely on getting a good signal in the middle of a wood. If possible, you should go with a group led by an expert - you'll stay safe and learn a lot that way.
Conservation is a really important consideration and you must follow a few basic rules. You should never pick all the mushrooms in one area – collect only enough for your own needs. Be very careful that you don't trample on young mushrooms or other plants. And make sure you don't pick any mushrooms that are endangered and protected by law.
There's been a decline in some varieties of wild mushrooms in this part of the country. Restaurants are becoming more interested in locally sourced food like wild mushrooms, but the biggest problem is that so many new houses have been built in this area in the last ten years. And more water is being taken from rivers and reservoirs because of this, and mushroom habitats have been destroyed.
Anyway, a word of advice on storing mushrooms. Collect them in a brown paper bag and as soon as you get home, put them in the fridge. They'll be fine for a couple of days, but it's best to cook them as soon as possible - after washing them really carefully first, of course.
So everybody knows what a mushroom tastes like, right? Well, you'll be surprised by the huge variety of wild mushrooms there are. Be adventurous! They're great in so many dishes – stir fries, risottos, pasta. But just be aware that some people can react badly to certain varieties so it's a good idea not to eat huge quantities to begin with.
OK, so now I'm going to show you...`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 42, quote: "you should never consume mushrooms picked by friends or neighbours ... The other thing to avoid is mushrooms growing beside busy roads" },
        { questionNumber: 12, timestampSeconds: 48, quote: "The other thing to avoid is mushrooms growing beside busy roads for obvious reasons." },
        { questionNumber: 13, timestampSeconds: 70, quote: "Some edible mushrooms are bright red, for example ... just because deer or squirrels eat a particular mushroom doesn't mean that you can." },
        { questionNumber: 14, timestampSeconds: 85, quote: "just because deer or squirrels eat a particular mushroom doesn't mean that you can." },
        { questionNumber: 15, timestampSeconds: 112, quote: "you need to be there first thing in the morning, as there's likely be a lot of competition" },
        { questionNumber: 16, timestampSeconds: 138, quote: "If possible, you should go with a group led by an expert - you'll stay safe and learn a lot that way." },
        { questionNumber: 17, timestampSeconds: 155, quote: "You should never pick all the mushrooms in one area – collect only enough for your own needs." },
        { questionNumber: 18, timestampSeconds: 178, quote: "the biggest problem is that so many new houses have been built in this area in the last ten years." },
        { questionNumber: 19, timestampSeconds: 198, quote: "put them in the fridge. They'll be fine for a couple of days, but it's best to cook them as soon as possible" },
        { questionNumber: 20, timestampSeconds: 220, quote: "Be adventurous! They're great in so many dishes – stir fries, risottos, pasta." },
      ],
    },
    {
      id: 'c18-l3-p3',
      partNumber: 3,
      title: 'Part 3: Seminar on Automation and the Future of Work',
      context: 'Two university students discuss a seminar they attended on the history of automation, the Luddites, and future trends in various jobs.',
      audioUrl: '/audio/listening/c18_test3_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `YOUNG MAN: That seminar yesterday on automation and the future of work was really good, wasn't it? Looking at the first industrial revolution in Britain in the 19th century and seeing how people reacted to massive change was a real eye-opener.
YOUNG WOMAN: Yes. It was interesting to hear how people felt about automation then and what challenges they faced. I didn't know that first started with workers in the textile industry.
YOUNG MAN: With those protesting workers called the Luddites destroying their knitting machines because they were so worried about losing their jobs.
YOUNG WOMAN: Yes, and ultimately, they didn't achieve anything. And anyway, industrialisation created more jobs than it destroyed.
YOUNG MAN: Yes, that's true – but it probably didn't seem a positive thing at the time. I can see why the Luddites felt so threatened.
YOUNG WOMAN: I know. I'm sure I would have felt the same. The discussion about the future of work was really optimistic for a change. I like the idea that work won't involve doing boring, repetitive tasks, as robots will do all that. Normally, you only hear negative stuff about the future.
YOUNG MAN: Bit too optimistic, don't you think? For example, I can't see how people are about to have more leisure time, when all the evidence shows people are spending longer than ever at work.
YOUNG WOMAN: No - that's true. And what about lower unemployment? I'm not so sure about that.
YOUNG MAN: Perhaps in the long term - but not in the foreseeable future.
YOUNG WOMAN: Mmm. And I expect most people will be expected to work until they're much older - as everyone's living much longer.
YOUNG MAN: That's already happening.
YOUNG WOMAN: I enjoyed all that stuff on how technology has changed some jobs and how they're likely to change in the near future.
YOUNG MAN: Yeah, incredible. Like accountants. You might think all the technological innovations would have put them out of a job, but in fact there are more of them than ever. They're still really in demand and have become far more efficient.
YOUNG WOMAN: Right. That was amazing. Twenty times more accountants in this country compared to the 19th century.
YOUNG MAN: I know. I'd never have thought that demand for hairdressing would have gone up so much in the last hundred years. One hairdresser for every 287 people now, compared to one for over 1,500.
YOUNG WOMAN: Yeah because people's earning power has gone up so they can afford to spend more on personal services like that.
YOUNG MAN: But technology hasn't changed the actual job that much.
YOUNG WOMAN: No, they've got hairdryers, etc. but it's one job where you don't depend on a computer ... The kind of work that administrative staff do has changed enormously, thanks to technology. Even 20 years ago there were secretaries doing dictation and typing.
YOUNG MAN: Yes. Really boring compared to these days, when they're given much more responsibility and higher status.
YOUNG WOMAN: Mmm. A lot of graduates go in for this kind of work now ... I'd expected there to be a much bigger change in the number of agricultural workers in the 19th century. But the 1871 census showed that roughly 25% of the population worked on the land.
YOUNG MAN: Yeah, I'd have assumed it would be more than 50%. Now it's less than 0.2%.
YOUNG WOMAN: What about care workers?
YOUNG MAN: They barely existed in the 19th century as people's lifespan was so much shorter. But now of course this sector will see huge growth.
YOUNG WOMAN: Yeah - and it's hard enough to meet current demand. The future looks quite bleak for bank clerks. They've been in decline since ATMs were introduced in the eighties.
YOUNG MAN: And technology will certainly make most of the jobs they do now redundant, I think.
YOUNG WOMAN: I agree, although the situation may change. It's very hard to predict what will happen.`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 38, quote: "ultimately, they didn't achieve anything ... I can see why the Luddites felt so threatened. I know. I'm sure I would have felt the same." },
        { questionNumber: 22, timestampSeconds: 46, quote: "I can see why the Luddites felt so threatened. I know. I'm sure I would have felt the same." },
        { questionNumber: 23, timestampSeconds: 68, quote: "all the evidence shows people are spending longer than ever at work ... what about lower unemployment? I'm not so sure about that." },
        { questionNumber: 24, timestampSeconds: 75, quote: "what about lower unemployment? I'm not so sure about that. Perhaps in the long term - but not in the foreseeable future." },
        { questionNumber: 25, timestampSeconds: 104, quote: "there are more of them than ever. They're still really in demand and have become far more efficient." },
        { questionNumber: 26, timestampSeconds: 122, quote: "people's earning power has gone up so they can afford to spend more on personal services like that." },
        { questionNumber: 27, timestampSeconds: 142, quote: "Really boring compared to these days, when they're given much more responsibility and higher status." },
        { questionNumber: 28, timestampSeconds: 160, quote: "roughly 25% of the population worked on the land... Now it's less than 0.2%." },
        { questionNumber: 29, timestampSeconds: 176, quote: "now of course this sector will see huge growth." },
        { questionNumber: 30, timestampSeconds: 194, quote: "technology will certainly make most of the jobs they do now redundant, I think." },
      ],
    },
    {
      id: 'c18-l3-p4',
      partNumber: 4,
      title: 'Part 4: Space Traffic Management',
      context: 'An astronomy lecturer discusses the growing congestion in Earth orbit and the critical need for a global Space Traffic Management system.',
      audioUrl: '/audio/listening/c18_test3_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 45,
      checkPauseSeconds: 60,
      transcript: `In today's astronomy lecture, I'm going to talk about the need for a system to manage the movement of satellites and other objects in orbit around the Earth. In other words, a Space Traffic Management system. We already have effective Air Traffic Control systems that are used internationally to ensure that planes navigate our skies safely. Well, Space Traffic Management is a similar concept, but focusing on the control of satellites.
The aim of such a system would be to prevent the danger of collisions in space between the objects in orbit around the Earth. In order to do this, we'd need to have a set of legal measures, and we'd also have to develop the technical systems to enable us to prevent such accidents.
But unfortunately, at present we don't actually have a Space Traffic Management system that works. So why not? What are the problems in developing such a system?
Well, for one thing, satellites are relatively cheap these days, compared with how they were in the past, meaning that more people can afford to put them into space. So there's a lot more of them out there, and people aren't just launching single satellites but whole constellations, consisting of thousands of them designed to work together. So space is getting more crowded every day.
But in spite of this, one thing you may be surprised to learn is that you can launch a satellite into space and, once it's out there, it doesn't have to send back any information to Earth to allow its identification. So while we have international systems for ensuring we know where the planes in our skies are, and to prevent them from colliding with one another, when it comes to the safety of satellites, at present we don't have anything like enough proper ways of tracking them.
And it isn't just entire satellites that we need to consider. A greater threat is the huge amount of space debris in orbit around the Earth - broken bits of satellite and junk from space stations and so on. And some of these are so small that they can be very hard to identify, but they can still be very dangerous.
In addition, some operators may be unwilling to share information about the satellites they've launched. For example, a satellite may be designed for military purposes, or it may have been launched for commercial reasons, and the operators don't want competitors to have information about it.
And even if the operators are willing to provide it, the information isn't easy to collect. Details are needed about the object itself, as well as about its location at a particular time - and remember that a satellite isn't very big, and it's likely to be moving at thousands of kilometres an hour. We don't have any sensors that can constantly follow something moving so fast, so all that the scientists can do is to put forward a prediction concerning where the satellite is heading next.
So those are some of the problems that we're facing. Let's consider now some of the solutions that have been suggested. One key issue is the way in which information is dealt with. We need more information, but it also needs to be accessible at a global level, so we need to establish shared standards that we can all agree on for the way in which this information is presented. We already do this in other areas of science, so although this is a challenge, it's not an impossible task. Then, as all this information's collected, it needs to be put together so it can be used, and that will involve creating a single database on which it can be entered.
As we continue to push forward new developments, congestion of the space environment is only going to increase. To cope with this, we need to develop a system like the one I've described to coordinate the work of the numerous spacecraft operators, but it's also essential that this system is one that establishes trust in the people that use it, both nationally and at a global level.
One interesting development...`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 40, quote: "we'd also have to develop the technical systems to enable us to prevent such accidents." },
        { questionNumber: 32, timestampSeconds: 62, quote: "satellites are relatively cheap these days, compared with how they were in the past" },
        { questionNumber: 33, timestampSeconds: 78, quote: "constellations, consisting of thousands of them designed to work together." },
        { questionNumber: 34, timestampSeconds: 98, quote: "it doesn't have to send back any information to Earth to allow its identification." },
        { questionNumber: 35, timestampSeconds: 114, quote: "at present we don't have anything like enough proper ways of tracking them." },
        { questionNumber: 36, timestampSeconds: 140, quote: "For example, a satellite may be designed for military purposes" },
        { questionNumber: 37, timestampSeconds: 160, quote: "Details are needed about the object itself, as well as about its location at a particular time" },
        { questionNumber: 38, timestampSeconds: 180, quote: "all that the scientists can do is to put forward a prediction concerning where the satellite is heading next." },
        { questionNumber: 39, timestampSeconds: 205, quote: "that will involve creating a single database on which it can be entered." },
        { questionNumber: 40, timestampSeconds: 228, quote: "essential that this system is one that establishes trust in the people that use it" },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-4 (Form Completion)
    {
      id: 'c18-l3-g1',
      partNumber: 1,
      questionType: 'form_completion',
      title: 'Questions 1–4',
      instructions: 'Complete the form below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 4,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      formData: {
        formTitle: 'Wayside Camera Club membership form',
        fields: [
          { label: 'Name:', defaultValue: 'Dan Green' },
          { label: 'Email address:', defaultValue: 'dan1068@market.com' },
          { label: 'Home address:', isGap: true, questionNumber: 1, defaultValue: '52 [[1]] Street, Peacetown' },
          { label: 'Heard about us:', isGap: true, questionNumber: 2, defaultValue: 'from a [[2]]' },
          { label: 'Reasons for joining:', isGap: true, questionNumber: 3, defaultValue: '• to enter competitions\n• to [[3]]' },
          { label: 'Type of membership:', isGap: true, questionNumber: 4, defaultValue: '[[4]] membership (£30)' },
        ],
      },
      contentWithGaps: `Wayside Camera Club membership form

Name: Dan Green
Email address: dan1068@market.com
Home address: 52 [[1]] Street, Peacetown
Heard about us: from a [[2]]
Reasons for joining:
• to enter competitions
• to [[3]]
Type of membership: [[4]] membership (£30)`,
      questions: [
        {
          id: 'c18-l3-q1',
          questionNumber: 1,
          prompt: 'Home address: 52 [1] Street, Peacetown',
          answerKey: 'Marrowfield',
          acceptedAlternatives: ['Marrowfield', 'marrowfield'],
          explanation: "Dan states: 'It's 52 Marrowfield Street.' and Breda confirms the spelling: 'M-A double R-O-W-F-I-E-L-D'.",
          transcriptExcerpt: "It's 52 Marrowfield Street. Is that M-A double R-O-W-F-I-E-L-D? That's right.",
          audioTimestampSeconds: 40,
        },
        {
          id: 'c18-l3-q2',
          questionNumber: 2,
          prompt: 'Heard about us: from a [2]',
          answerKey: 'relative',
          acceptedAlternatives: ['relative'],
          explanation: "Dan says: 'I was talking to a relative the other day and he suggested it.'",
          transcriptExcerpt: 'I was talking to a relative the other day and he suggested it.',
          audioTimestampSeconds: 62,
        },
        {
          id: 'c18-l3-q3',
          questionNumber: 3,
          prompt: 'Reasons for joining: to [3]',
          answerKey: 'socialise',
          acceptedAlternatives: ['socialise', 'socialize', 'socialise with other photographers', 'socialize with other photographers'],
          explanation: "Dan says: 'Well, I also like to socialise with other photographers.'",
          transcriptExcerpt: 'Well, I also like to socialise with other photographers.',
          audioTimestampSeconds: 80,
        },
        {
          id: 'c18-l3-q4',
          questionNumber: 4,
          prompt: 'Type of membership: [4] membership (£30)',
          answerKey: 'full',
          acceptedAlternatives: ['full'],
          explanation: "Dan says: 'I think I'll go for the full membership, then.' which Breda confirms costs £30 a year.",
          transcriptExcerpt: "It's £30 a year for full membership ... I think I'll go for the full membership, then.",
          audioTimestampSeconds: 98,
        },
      ],
    },

    // PART 1: Questions 5-10 (Table Completion)
    {
      id: 'c18-l3-g2',
      partNumber: 1,
      questionType: 'table_completion',
      title: 'Questions 5–10',
      instructions: 'Complete the table below.\nWrite NO MORE THAN TWO WORDS for each answer.',
      startQuestionNumber: 5,
      endQuestionNumber: 10,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      maxNumbers: 0,
      tableData: {
        headers: ['Title of competition', 'Instructions', 'Feedback to Dan'],
        rows: [
          {
            cells: [
              { content: '[[5]]', isGap: true, questionNumber: 5 },
              { content: 'A scene in the home' },
              { content: "The picture's composition was not good." },
            ],
          },
          {
            cells: [
              { content: "'Beautiful Sunsets'" },
              { content: 'Scene must show some [[6]]', isGap: true, questionNumber: 6 },
              { content: 'The [[7]] was wrong.', isGap: true, questionNumber: 7 },
            ],
          },
          {
            cells: [
              { content: '[[8]]', isGap: true, questionNumber: 8 },
              { content: 'Scene must show [[9]]', isGap: true, questionNumber: 9 },
              { content: 'The photograph was too [[10]].', isGap: true, questionNumber: 10 },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c18-l3-q5',
          questionNumber: 5,
          prompt: 'Title of competition: [5]',
          answerKey: 'Domestic Life',
          acceptedAlternatives: ['Domestic Life', 'domestic life'],
          explanation: "Dan states: 'Well, the theme was entitled Domestic Life.'",
          transcriptExcerpt: "Well, the theme was entitled 'Domestic Life'.",
          audioTimestampSeconds: 122,
        },
        {
          id: 'c18-l3-q6',
          questionNumber: 6,
          prompt: 'Beautiful Sunsets: Scene must show some [6]',
          answerKey: 'clouds',
          acceptedAlternatives: ['clouds', 'cloud'],
          explanation: "Dan says: 'The instructions were to capture the clouds as well - it couldn\\'t just be blue sky and a setting sun.'",
          transcriptExcerpt: "The instructions were to capture the clouds as well - it couldn't just be blue sky and a setting sun.",
          audioTimestampSeconds: 152,
        },
        {
          id: 'c18-l3-q7',
          questionNumber: 7,
          prompt: 'Beautiful Sunsets: The [7] was wrong.',
          answerKey: 'timing',
          acceptedAlternatives: ['timing'],
          explanation: "Dan explains: 'the feedback was that I should have waited a bit longer to get the shot.' Breda replies: 'So the timing wasn\\'t right.' Dan confirms: 'Yes - I took it too soon, basically.'",
          transcriptExcerpt: "I see. So the timing wasn't right. Yes - I took it too soon, basically.",
          audioTimestampSeconds: 172,
        },
        {
          id: 'c18-l3-q8',
          questionNumber: 8,
          prompt: 'Title of competition: [8]',
          answerKey: 'Animal Magic',
          acceptedAlternatives: ['Animal Magic', 'animal magic'],
          explanation: "Dan says: 'And then the third competition I entered was called Animal Magic.'",
          transcriptExcerpt: "And then the third competition I entered was called 'Animal Magic'.",
          audioTimestampSeconds: 184,
        },
        {
          id: 'c18-l3-q9',
          questionNumber: 9,
          prompt: 'Animal Magic: Scene must show [9]',
          answerKey: 'movement',
          acceptedAlternatives: ['movement', 'animal movement'],
          explanation: "Dan explains: 'That\\'s what we had to show - there had to be some movement in the scene.'",
          transcriptExcerpt: "That's what we had to show - there had to be some movement in the scene.",
          audioTimestampSeconds: 202,
        },
        {
          id: 'c18-l3-q10',
          questionNumber: 10,
          prompt: 'Animal Magic: The photograph was too [10].',
          answerKey: 'dark',
          acceptedAlternatives: ['dark'],
          explanation: "Dan says: 'I got a great shot of a fox in the end, but I took it at night and, well, I suspected that it was a bit dark, which is what I was told.'",
          transcriptExcerpt: 'I got a great shot of a fox in the end, but I took it at night and, well, I suspected that it was a bit dark, which is what I was told.',
          audioTimestampSeconds: 218,
        },
      ],
    },

    // PART 2: Questions 11-12 (Multiple Choice - Pick 2)
    {
      id: 'c18-l3-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 11 and 12',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO warnings does Dan give about picking mushrooms?',
      startQuestionNumber: 11,
      endQuestionNumber: 12,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q11_OPTIONS,
      questions: [
        {
          id: 'c18-l3-q11',
          questionNumber: 11,
          prompt: 'Which TWO warnings does Dan give about picking mushrooms? (First choice)',
          options: MC_Q11_OPTIONS,
          answerKey: ['B', 'C'],
          acceptedAlternatives: ['B', 'C'],
          explanation: "Dan warns: 'you should never consume mushrooms picked by friends or neighbours – always remember that some poisonous mushrooms look very similar to edible ones' (Option C), and 'The other thing to avoid is mushrooms growing beside busy roads for obvious reasons.' (Option B).",
          transcriptExcerpt: 'you should never consume mushrooms picked by friends or neighbours ... The other thing to avoid is mushrooms growing beside busy roads',
          audioTimestampSeconds: 42,
        },
        {
          id: 'c18-l3-q12',
          questionNumber: 12,
          prompt: 'Which TWO warnings does Dan give about picking mushrooms? (Second choice)',
          options: MC_Q11_OPTIONS,
          answerKey: ['B', 'C'],
          acceptedAlternatives: ['B', 'C'],
          explanation: "Dan warns: 'you should never consume mushrooms picked by friends or neighbours – always remember that some poisonous mushrooms look very similar to edible ones' (Option C), and 'The other thing to avoid is mushrooms growing beside busy roads for obvious reasons.' (Option B).",
          transcriptExcerpt: 'The other thing to avoid is mushrooms growing beside busy roads for obvious reasons.',
          audioTimestampSeconds: 48,
        },
      ],
    },

    // PART 2: Questions 13-14 (Multiple Choice - Pick 2)
    {
      id: 'c18-l3-g4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 13 and 14',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO ideas about wild mushrooms does Dan say are correct?',
      startQuestionNumber: 13,
      endQuestionNumber: 14,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q13_OPTIONS,
      questions: [
        {
          id: 'c18-l3-q13',
          questionNumber: 13,
          prompt: 'Which TWO ideas about wild mushrooms does Dan say are correct? (First choice)',
          options: MC_Q13_OPTIONS,
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation: "Dan confirms: 'Some edible mushrooms are bright red, for example.' (Option D) and 'Finally, just because deer or squirrels eat a particular mushroom doesn\\'t mean that you can.' (Option B).",
          transcriptExcerpt: "Some edible mushrooms are bright red, for example ... just because deer or squirrels eat a particular mushroom doesn't mean that you can.",
          audioTimestampSeconds: 70,
        },
        {
          id: 'c18-l3-q14',
          questionNumber: 14,
          prompt: 'Which TWO ideas about wild mushrooms does Dan say are correct? (Second choice)',
          options: MC_Q13_OPTIONS,
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation: "Dan confirms: 'Some edible mushrooms are bright red, for example.' (Option D) and 'Finally, just because deer or squirrels eat a particular mushroom doesn\\'t mean that you can.' (Option B).",
          transcriptExcerpt: "just because deer or squirrels eat a particular mushroom doesn't mean that you can.",
          audioTimestampSeconds: 85,
        },
      ],
    },

    // PART 2: Questions 15-20 (Multiple Choice Single)
    {
      id: 'c18-l3-g5',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 15–20',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 15,
      endQuestionNumber: 20,
      questions: [
        {
          id: 'c18-l3-q15',
          questionNumber: 15,
          prompt: 'What advice does Dan give about picking mushrooms in parks?',
          options: [
            { key: 'A', text: 'Choose wooded areas.' },
            { key: 'B', text: "Don't disturb wildlife." },
            { key: 'C', text: 'Get there early.' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Dan advises: 'But you need to be there first thing in the morning, as there\\'s likely be a lot of competition - not just from people but wildlife too.'",
          transcriptExcerpt: "you need to be there first thing in the morning, as there's likely be a lot of competition",
          audioTimestampSeconds: 112,
        },
        {
          id: 'c18-l3-q16',
          questionNumber: 16,
          prompt: 'Dan says it is a good idea for beginners to',
          options: [
            { key: 'A', text: 'use a mushroom app.' },
            { key: 'B', text: 'join a group.' },
            { key: 'C', text: 'take a reference book.' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "Dan advises: 'If possible, you should go with a group led by an expert - you\\'ll stay safe and learn a lot that way.'",
          transcriptExcerpt: "If possible, you should go with a group led by an expert - you'll stay safe and learn a lot that way.",
          audioTimestampSeconds: 138,
        },
        {
          id: 'c18-l3-q17',
          questionNumber: 17,
          prompt: 'What does Dan say is important for conservation?',
          options: [
            { key: 'A', text: 'selecting only fully grown mushrooms' },
            { key: 'B', text: 'picking a limited amount of mushrooms' },
            { key: 'C', text: 'avoiding areas where rare mushroom species grow' },
          ],
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "Dan explains: 'You should never pick all the mushrooms in one area – collect only enough for your own needs.'",
          transcriptExcerpt: 'You should never pick all the mushrooms in one area – collect only enough for your own needs.',
          audioTimestampSeconds: 155,
        },
        {
          id: 'c18-l3-q18',
          questionNumber: 18,
          prompt: 'According to Dan, some varieties of wild mushrooms are in decline because there is',
          options: [
            { key: 'A', text: 'a huge demand for them from restaurants.' },
            { key: 'B', text: 'a lack of rain in this part of the country.' },
            { key: 'C', text: 'a rise in building developments locally.' },
          ],
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Dan states: 'the biggest problem is that so many new houses have been built in this area in the last ten years. And more water is being taken from rivers and reservoirs because of this, and mushroom habitats have been destroyed.'",
          transcriptExcerpt: 'the biggest problem is that so many new houses have been built in this area in the last ten years.',
          audioTimestampSeconds: 178,
        },
        {
          id: 'c18-l3-q19',
          questionNumber: 19,
          prompt: 'Dan says that when storing mushrooms, people should',
          options: [
            { key: 'A', text: 'keep them in the fridge for no more than two days.' },
            { key: 'B', text: 'keep them in a brown bag in a dark room.' },
            { key: 'C', text: 'leave them for a period after washing them.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "Dan says: 'Collect them in a brown paper bag and as soon as you get home, put them in the fridge. They\\'ll be fine for a couple of days, but it\\'s best to cook them as soon as possible...'",
          transcriptExcerpt: "put them in the fridge. They'll be fine for a couple of days, but it's best to cook them as soon as possible",
          audioTimestampSeconds: 198,
        },
        {
          id: 'c18-l3-q20',
          questionNumber: 20,
          prompt: 'What does Dan say about trying new varieties of mushrooms?',
          options: [
            { key: 'A', text: 'Experiment with different recipes.' },
            { key: 'B', text: 'Expect some to have a strong taste.' },
            { key: 'C', text: 'Cook them for a long time.' },
          ],
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "Dan suggests: 'Be adventurous! They\\'re great in so many dishes – stir fries, risottos, pasta.'",
          transcriptExcerpt: "Be adventurous! They're great in so many dishes – stir fries, risottos, pasta.",
          audioTimestampSeconds: 220,
        },
      ],
    },

    // PART 3: Questions 21-22 (Multiple Choice - Pick 2)
    {
      id: 'c18-l3-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO opinions about the Luddites do the students express?',
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q21_OPTIONS,
      questions: [
        {
          id: 'c18-l3-q21',
          questionNumber: 21,
          prompt: 'Which TWO opinions about the Luddites do the students express? (First choice)',
          options: MC_Q21_OPTIONS,
          answerKey: ['A', 'E'],
          acceptedAlternatives: ['A', 'E'],
          explanation: "The woman notes: 'ultimately, they didn\\'t achieve anything.' (Option A). The man adds: 'I can see why the Luddites felt so threatened.' and the woman agrees: 'I know. I\\'m sure I would have felt the same.' (Option E).",
          transcriptExcerpt: "ultimately, they didn't achieve anything ... I can see why the Luddites felt so threatened. I know. I'm sure I would have felt the same.",
          audioTimestampSeconds: 38,
        },
        {
          id: 'c18-l3-q22',
          questionNumber: 22,
          prompt: 'Which TWO opinions about the Luddites do the students express? (Second choice)',
          options: MC_Q21_OPTIONS,
          answerKey: ['A', 'E'],
          acceptedAlternatives: ['A', 'E'],
          explanation: "The woman notes: 'ultimately, they didn\\'t achieve anything.' (Option A). The man adds: 'I can see why the Luddites felt so threatened.' and the woman agrees: 'I know. I\\'m sure I would have felt the same.' (Option E).",
          transcriptExcerpt: "I can see why the Luddites felt so threatened. I know. I'm sure I would have felt the same.",
          audioTimestampSeconds: 46,
        },
      ],
    },

    // PART 3: Questions 23-24 (Multiple Choice - Pick 2)
    {
      id: 'c18-l3-g7',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO predictions about the future of work are the students doubtful about?',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q23_OPTIONS,
      questions: [
        {
          id: 'c18-l3-q23',
          questionNumber: 23,
          prompt: 'Which TWO predictions about the future of work are the students doubtful about? (First choice)',
          options: MC_Q23_OPTIONS,
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation: "The man expresses doubt about working hours being shorter: 'I can\\'t see how people are about to have more leisure time, when all the evidence shows people are spending longer than ever at work.' (Option D). The woman doubts falling unemployment: 'And what about lower unemployment? I\\'m not so sure about that.' and the man agrees (Option B).",
          transcriptExcerpt: "all the evidence shows people are spending longer than ever at work ... what about lower unemployment? I'm not so sure about that.",
          audioTimestampSeconds: 68,
        },
        {
          id: 'c18-l3-q24',
          questionNumber: 24,
          prompt: 'Which TWO predictions about the future of work are the students doubtful about? (Second choice)',
          options: MC_Q23_OPTIONS,
          answerKey: ['B', 'D'],
          acceptedAlternatives: ['B', 'D'],
          explanation: "The man expresses doubt about working hours being shorter: 'I can\\'t see how people are about to have more leisure time, when all the evidence shows people are spending longer than ever at work.' (Option D). The woman doubts falling unemployment: 'And what about lower unemployment? I\\'m not so sure about that.' and the man agrees (Option B).",
          transcriptExcerpt: "what about lower unemployment? I'm not so sure about that. Perhaps in the long term - but not in the foreseeable future.",
          audioTimestampSeconds: 75,
        },
      ],
    },

    // PART 3: Questions 25-30 (Matching)
    {
      id: 'c18-l3-g8',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 25–30',
      instructions: 'What comment do the students make about each of the following jobs?\nChoose SIX answers from the box and write the correct letter, A–G, next to Questions 25–30.',
      startQuestionNumber: 25,
      endQuestionNumber: 30,
      optionsList: MATCHING_COMMENTS_Q25_30,
      questions: [
        {
          id: 'c18-l3-q25',
          questionNumber: 25,
          prompt: 'Accountants',
          options: MATCHING_COMMENTS_Q25_30,
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: "The man notes: 'there are more of them than ever. They\\'re still really in demand and have become far more efficient.' (Both employment and productivity have risen, Option G).",
          transcriptExcerpt: 'there are more of them than ever. They\'re still really in demand and have become far more efficient.',
          audioTimestampSeconds: 104,
        },
        {
          id: 'c18-l3-q26',
          questionNumber: 26,
          prompt: 'Hairdressers',
          options: MATCHING_COMMENTS_Q25_30,
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation: "The woman explains: 'because people\\'s earning power has gone up so they can afford to spend more on personal services like that.' (Higher disposable income has led to a huge increase in jobs, Option E).",
          transcriptExcerpt: "people's earning power has gone up so they can afford to spend more on personal services like that.",
          audioTimestampSeconds: 122,
        },
        {
          id: 'c18-l3-q27',
          questionNumber: 27,
          prompt: 'Administrative staff',
          options: MATCHING_COMMENTS_Q25_30,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "The man states: 'Really boring compared to these days, when they\\'re given much more responsibility and higher status.' (Their role has become more interesting in recent years, Option B).",
          transcriptExcerpt: "Really boring compared to these days, when they're given much more responsibility and higher status.",
          audioTimestampSeconds: 142,
        },
        {
          id: 'c18-l3-q28',
          questionNumber: 28,
          prompt: 'Agricultural workers',
          options: MATCHING_COMMENTS_Q25_30,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "The students note: 'the 1871 census showed that roughly 25% of the population worked on the land... Now it\\'s less than 0.2%.' (The number of people working in this sector has fallen dramatically, Option C).",
          transcriptExcerpt: "roughly 25% of the population worked on the land... Now it's less than 0.2%.",
          audioTimestampSeconds: 160,
        },
        {
          id: 'c18-l3-q29',
          questionNumber: 29,
          prompt: 'Care workers',
          options: MATCHING_COMMENTS_Q25_30,
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation: "The man observes: 'now of course this sector will see huge growth.' and woman adds: 'and it\\'s hard enough to meet current demand.' (There is likely to be a significant rise in demand for this service, Option F).",
          transcriptExcerpt: 'now of course this sector will see huge growth.',
          audioTimestampSeconds: 176,
        },
        {
          id: 'c18-l3-q30',
          questionNumber: 30,
          prompt: 'Bank clerks',
          options: MATCHING_COMMENTS_Q25_30,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "The man says: 'technology will certainly make most of the jobs they do now redundant, I think.' (These jobs are likely to be at risk, Option A).",
          transcriptExcerpt: 'technology will certainly make most of the jobs they do now redundant, I think.',
          audioTimestampSeconds: 194,
        },
      ],
    },

    // PART 4: Questions 31-40 (Note Completion)
    {
      id: 'c18-l3-g9',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Space Traffic Management

A Space Traffic Management system
• is a concept similar to Air Traffic Control, but for satellites rather than planes.
• would aim to set up legal and [[31]] ways of improving safety.
• does not actually exist at present.

Problems in developing effective Space Traffic Management
• Satellites are now quite [[32]] and therefore more widespread (e.g. there are constellations made up of [[33]] of satellites).
• At present, satellites are not required to transmit information to help with their [[34]].
• There are few systems for [[35]] satellites.
• Small pieces of debris may be difficult to identify.
• Operators may be unwilling to share details of satellites used for [[36]] or commercial reasons.
• It may be hard to collect details of the object's [[37]] at a given time.
• Scientists can only make a [[38]] about where the satellite will go.

Solutions
• Common standards should be agreed on for the presentation of information.
• The information should be combined in one [[39]].
• A coordinated system must be designed to create [[40]] in its users.`,
      questions: [
        {
          id: 'c18-l3-q31',
          questionNumber: 31,
          prompt: 'would aim to set up legal and [31] ways of improving safety.',
          answerKey: 'technical',
          acceptedAlternatives: ['technical'],
          explanation: "The lecturer explains: 'In order to do this, we\\'d need to have a set of legal measures, and we\\'d also have to develop the technical systems to enable us to prevent such accidents.'",
          transcriptExcerpt: "we'd also have to develop the technical systems to enable us to prevent such accidents.",
          audioTimestampSeconds: 40,
        },
        {
          id: 'c18-l3-q32',
          questionNumber: 32,
          prompt: 'Satellites are now quite [32] and therefore more widespread...',
          answerKey: 'cheap',
          acceptedAlternatives: ['cheap'],
          explanation: "The lecturer states: 'Well, for one thing, satellites are relatively cheap these days, compared with how they were in the past...'",
          transcriptExcerpt: 'satellites are relatively cheap these days, compared with how they were in the past',
          audioTimestampSeconds: 62,
        },
        {
          id: 'c18-l3-q33',
          questionNumber: 33,
          prompt: '...constellations made up of [33] of satellites.',
          answerKey: 'thousands',
          acceptedAlternatives: ['thousands'],
          explanation: "The lecturer notes: 'people aren\\'t just launching single satellites but whole constellations, consisting of thousands of them designed to work together.'",
          transcriptExcerpt: 'constellations, consisting of thousands of them designed to work together.',
          audioTimestampSeconds: 78,
        },
        {
          id: 'c18-l3-q34',
          questionNumber: 34,
          prompt: 'At present, satellites are not required to transmit information to help with their [34].',
          answerKey: 'identification',
          acceptedAlternatives: ['identification'],
          explanation: "The lecturer explains: 'once it\\'s out there, it doesn\\'t have to send back any information to Earth to allow its identification.'",
          transcriptExcerpt: "it doesn't have to send back any information to Earth to allow its identification.",
          audioTimestampSeconds: 98,
        },
        {
          id: 'c18-l3-q35',
          questionNumber: 35,
          prompt: 'There are few systems for [35] satellites.',
          answerKey: 'tracking',
          acceptedAlternatives: ['tracking'],
          explanation: "The lecturer states: 'at present we don\\'t have anything like enough proper ways of tracking them.'",
          transcriptExcerpt: "at present we don't have anything like enough proper ways of tracking them.",
          audioTimestampSeconds: 114,
        },
        {
          id: 'c18-l3-q36',
          questionNumber: 36,
          prompt: 'Operators may be unwilling to share details of satellites used for [36] or commercial reasons.',
          answerKey: 'military',
          acceptedAlternatives: ['military'],
          explanation: "The lecturer notes: 'For example, a satellite may be designed for military purposes, or it may have been launched for commercial reasons...'",
          transcriptExcerpt: 'For example, a satellite may be designed for military purposes',
          audioTimestampSeconds: 140,
        },
        {
          id: 'c18-l3-q37',
          questionNumber: 37,
          prompt: "It may be hard to collect details of the object's [37] at a given time.",
          answerKey: 'location',
          acceptedAlternatives: ['location'],
          explanation: "The lecturer states: 'Details are needed about the object itself, as well as about its location at a particular time...'",
          transcriptExcerpt: 'Details are needed about the object itself, as well as about its location at a particular time',
          audioTimestampSeconds: 160,
        },
        {
          id: 'c18-l3-q38',
          questionNumber: 38,
          prompt: 'Scientists can only make a [38] about where the satellite will go.',
          answerKey: 'prediction',
          acceptedAlternatives: ['prediction'],
          explanation: "The lecturer explains: 'all that the scientists can do is to put forward a prediction concerning where the satellite is heading next.'",
          transcriptExcerpt: 'all that the scientists can do is to put forward a prediction concerning where the satellite is heading next.',
          audioTimestampSeconds: 180,
        },
        {
          id: 'c18-l3-q39',
          questionNumber: 39,
          prompt: 'The information should be combined in one [39].',
          answerKey: 'database',
          acceptedAlternatives: ['database'],
          explanation: "The lecturer states: 'and that will involve creating a single database on which it can be entered.'",
          transcriptExcerpt: 'that will involve creating a single database on which it can be entered.',
          audioTimestampSeconds: 205,
        },
        {
          id: 'c18-l3-q40',
          questionNumber: 40,
          prompt: 'A coordinated system must be designed to create [40] in its users.',
          answerKey: 'trust',
          acceptedAlternatives: ['trust'],
          explanation: "The lecturer emphasizes: 'it\\'s also essential that this system is one that establishes trust in the people that use it, both nationally and at a global level.'",
          transcriptExcerpt: 'essential that this system is one that establishes trust in the people that use it',
          audioTimestampSeconds: 228,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 18 Academic Listening Test 3',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 30,
    parts,
    questionGroups,
    audioConfig: {
      mode: 'part_audios',
      overallAudioUrl: '',
      partAudios: {
        1: '/audio/listening/c18_test3_part1.mp3',
        2: '/audio/listening/c18_test3_part2.mp3',
        3: '/audio/listening/c18_test3_part3.mp3',
        4: '/audio/listening/c18_test3_part4.mp3',
      },
      leadInSeconds: 5,
      partPauses: [
        { partNumber: 1, startPauseSeconds: 30, reviewPauseSeconds: 30 },
        { partNumber: 2, startPauseSeconds: 30, reviewPauseSeconds: 30 },
        { partNumber: 3, startPauseSeconds: 30, reviewPauseSeconds: 30 },
        { partNumber: 4, startPauseSeconds: 45, reviewPauseSeconds: 60 },
      ],
    },
  };
}

export async function ingestCambridge18ListeningTest3(authorId?: string) {
  const data = getCambridge18ListeningTest3Data();

  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups);

  if (validationErrors.length > 0) {
    throw new Error(
      `Cambridge 18 Listening Test 3 validation failed:\n${validationErrors.join('\n')}`
    );
  }

  const existingTest = (await db.prepare(`
    SELECT id FROM listening_tests
    WHERE title = ?
    LIMIT 1
  `).get(data.title)) as { id: string } | undefined;

  const now = new Date().toISOString();
  let resolvedAuthorId = authorId;

  if (!resolvedAuthorId) {
    const defaultUser = (await db.prepare(`
      SELECT id FROM users ORDER BY created_at ASC LIMIT 1
    `).get()) as { id: string } | undefined;

    if (defaultUser) {
      resolvedAuthorId = defaultUser.id;
    } else {
      resolvedAuthorId = uuidv4();
      await db.prepare(`
        INSERT INTO users (id, email, role, created_at, updated_at)
        VALUES (?, 'system-ingest@ielts.local', 'admin', ?, ?)
      `).run(resolvedAuthorId, now, now);
    }
  }

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVersion = (await db.prepare(`
      SELECT id FROM listening_test_versions
      WHERE test_id = ? AND version_number = 1
      LIMIT 1
    `).get(testId)) as { id: string } | undefined;

    if (existingVersion) {
      versionId = existingVersion.id;
      await db.prepare(`
        UPDATE listening_test_versions
        SET parts_json = ?,
            question_groups_json = ?,
            total_questions = 40,
            audio_config_json = ?,
            status = 'published',
            validation_errors_json = '[]',
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
