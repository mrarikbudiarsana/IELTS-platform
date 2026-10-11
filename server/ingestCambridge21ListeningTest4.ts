import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

export function getCambridge21ListeningTest4Data(): {
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
      id: 'c21-l4-p1',
      partNumber: 1,
      title: 'Part 1: Survey about Shopping in Broadbeach',
      context: 'A surveyor interviews Martyn Leigh about his shopping habits and opinions on shopping in Broadbeach.',
      audioUrl: '/audio/listening/c21_test4_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `WOMAN: Good morning. I'm doing a survey of shoppers in Broadbeach. Would you have a few minutes to spare to answer some questions?
MAN: Oh ... erm ... yes, I guess that would be ok.
WOMAN: Thank you very much. Everybody seems so busy today.
MAN: Well actually I don't have loads of time, so ...
WOMAN: Oh yes, of course. It really won't take long. Could I start by taking your name please?
MAN: Martyn Leigh. Martyn's with a Y.
WOMAN: And is your family name spelt L-double-E?
MAN: It's L-E-I-G-H.
WOMAN: Thank you. We don't actually publish your name or details. It just makes it easier for me to identify people when I look at all the results at the end.
MAN: I see.
WOMAN: And can I ask, how did you get into town today?
MAN: Well, normally I catch the bus, but I'm on my motorbike today because I'm going to work later.
WOMAN: And could you tell me what you're doing this morning, I mean, the reason for your trip into town?
MAN: I've just been to the hairdresser. You see, I have a job interview at the council in a few days.
WOMAN: Oh really! Well, good luck with that.
MAN: Thanks a lot. And now I'm on my way to buy a suit that I can wear to the interview. I don't actually own one at the moment!
WOMAN: OK. Is that everything you're planning to do in town?
MAN: Yeah. Well, I've got to go and pick up my laptop. It broke a couple of days ago so I took it to the shop to get it fixed. They had to order a spare part, but apparently it's ready for collection now. I can't wait to get it back.
WOMAN: I'm sure. I hate it when my technology breaks down .... One more thing, it's Saturday today - is that when you like to do your shopping?
MAN: Well it's more a question of when I'm free. If I'm free on a Monday, that's when I choose to come into town. The shops are less busy then, which I always prefer.
WOMAN: So, I'd like to ask you a few more questions to get your views about shopping in Broadbeach, if that's ok.
MAN: Sure. What would you like to know specifically?
WOMAN: What would you say you like best about the shops here?
MAN: I'd probably say it's the service you get wherever you go.
WOMAN: OK. And what do you think about the range of shops in Broadbeach?
MAN: Oh you can get almost anything you want here.
WOMAN: And what about recent changes? What do you like and dislike about them? For example, there are a lot of new coffee shops now, are you enjoying them?
MAN: No, there are too many of them. It's a shame as those places could be occupied by other kinds of shops.
WOMAN: What would you like to see instead?
MAN: Well, I think we have enough clothing shops. But there's only one place that sells books at the moment. It'd be nice to have a choice, you know.
WOMAN: Right. And have you been to the new shopping centre outside Broadbeach yet, Martyn?
MAN: Yes, once or twice. It's not that far from where I live.
WOMAN: It's a very modern-looking building, isn't it?
MAN: Yes, and it's lovely. The glass roof is certainly impressive. But my favourite thing is the plants they've put around the building. They're amazing, and so big already.
WOMAN: And what about the entertainment facilities? Have you used any of them yet? Like the new cinema?
MAN: Nah, not yet. I can't see any advantage in having it there because the one in town is actually bigger.
WOMAN: OK, well thank you so much for ...`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 42, quote: "Martyn Leigh. Martyn's with a Y... It's L-E-I-G-H." },
        { questionNumber: 2, timestampSeconds: 49, quote: "normally I catch the bus, but I'm on my motorbike today" },
        { questionNumber: 3, timestampSeconds: 53, quote: "I've just been to the hairdresser. You see, I have a job interview" },
        { questionNumber: 4, timestampSeconds: 56, quote: "And now I'm on my way to buy a suit that I can wear to the interview." },
        { questionNumber: 5, timestampSeconds: 59, quote: "Well, I've got to go and pick up my laptop. It broke a couple of days ago so I took it to the shop to get it fixed." },
        { questionNumber: 6, timestampSeconds: 64, quote: "If I'm free on a Monday, that's when I choose to come into town." },
        { questionNumber: 7, timestampSeconds: 74, quote: "No, there are too many of them [coffee shops]." },
        { questionNumber: 8, timestampSeconds: 78, quote: "there's only one place that sells books at the moment. It'd be nice to have a choice" },
        { questionNumber: 9, timestampSeconds: 95, quote: "my favourite thing is the plants they've put around the building." },
        { questionNumber: 10, timestampSeconds: 98, quote: "Like the new cinema? Nah, not yet. I can't see any advantage in having it there because the one in town is actually bigger." },
      ],
    },
    {
      id: 'c21-l4-p2',
      partNumber: 2,
      title: 'Part 2: Annual Business Exhibition',
      context: 'A podcast giving details about an annual business exhibition, discounts for exhibitors, and featured keynote speakers.',
      audioUrl: '/audio/listening/c21_test4_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Hello and welcome to this podcast telling you about our annual business exhibition. This year, as always, it will be full of the very best speakers, features and innovations.
Let me start by reading some feedback from James Craig, who's exhibited with us for the past two years. James says, 'I'm director of a company called TalkCon, which is an office phone system. The first year we exhibited, we had a stand in the Business Village, where we made a lot of useful contacts. We also used the Breakout area where people could sit down and relax, and try out our products, and due to popular request we used that again last year. Last year we also sponsored the innovative Business Connections Zone where people could leave their contact details on a board to contact other companies, and that also effectively raised our corporate profile. We're hoping that in the coming exhibition we'll also have a presence in the Digital Marketing centre, which is clearly a key area for our company. And also maybe have our own Talkcon Zone, at some stage.'
The exhibition's open from 8am to 11 pm and there's a range of special events for you to enjoy in the evening.
As well as a unique chance to publicise your company, businesses who exhibit with us can claim discounts on a number of popular brands, including major high street fashion and jewellery outlets, as well as grocery chains. Discounts available range from 3.5% up to an amazing 15%, so you can save a lot of money. In fact, the average saving made by each exhibitor came to over £400! The scheme is available to every member of your organisation so this is a benefit that really does have something for you all.
Now let me tell you about some of our keynote speakers for this year's exhibition.
Jim Clowrie started off selling vegetables from a small plot, then opened a small cafe. Rather to his surprise this became a bit of a sensation, and in a remarkably short time he had opened an amazing 76 restaurants worldwide. He'll be telling you how it all happened, and how it changed his life.
David France will be giving an inspirational talk about how as a business-minded teenager he managed to set up his own company, and even to be the first person under 18 to get a business bank account. David's company has gone from strength to strength but he isn't just interested in making money - he also makes regular donations to organisations helping those in need both in the UK and elsewhere in the world.
Oliver Stanton was born and educated in the UK, and then went to Malaysia where he set up a rubber-wood furniture business. He then built log houses in the mountains in Japan before moving to Hong Kong to set up a digital marketing business. After that he moved back to the UK with his wife Saiphin, and together they opened a Thai cafe. He'll be telling you about what he discovered during his travels around the world about business practices in different cultures.
Francesca Heptonstall is a broadcaster and businesswoman who's known for her down-to-earth attitude. After winning a top job in a TV contest, she launched a number of online deal sites. Her main business interest is in technology, but she's also passionate about helping people gain employment and organises an annual jobs fair, so she'll be concentrating on this in her talk.
Salman Khan is the Chief Executive of OBF Enterprises, and has turned around this business from a major publishing business to one of the UK's largest digital marketing service providers. He'll be talking about the need for flexibility to cope with new directions in today's business world.
Finally, Annie Craven is a consultant and coach who works with people to create lasting changes in their business and life. Her session will offer an interactive look at different obstacles in people's own lives, not just in business. She also looks at how you can overcome them, whether you're starting out in business or at the top of your game.
Now let me ...`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 35, quote: "We also used the Breakout area where people could sit down and relax... we used that again last year." },
        { questionNumber: 12, timestampSeconds: 45, quote: "Last year we also sponsored the innovative Business Connections Zone where people could leave their contact details" },
        { questionNumber: 13, timestampSeconds: 70, quote: "The scheme is available to every member of your organisation so this is a benefit that really does have something for you all." },
        { questionNumber: 14, timestampSeconds: 78, quote: "including major high street fashion and jewellery outlets, as well as grocery chains." },
        { questionNumber: 15, timestampSeconds: 95, quote: "Rather to his surprise this became a bit of a sensation, and in a remarkably short time he had opened an amazing 76 restaurants worldwide." },
        { questionNumber: 16, timestampSeconds: 110, quote: "he isn't just interested in making money - he also makes regular donations to organisations helping those in need" },
        { questionNumber: 17, timestampSeconds: 130, quote: "He'll be telling you about what he discovered during his travels around the world about business practices in different cultures." },
        { questionNumber: 18, timestampSeconds: 145, quote: "passionate about helping people gain employment and organises an annual jobs fair, so she'll be concentrating on this in her talk." },
        { questionNumber: 19, timestampSeconds: 160, quote: "turned around this business from a major publishing business to one of the UK's largest digital marketing service providers... need for flexibility to cope with new directions" },
        { questionNumber: 20, timestampSeconds: 175, quote: "session will offer an interactive look at different obstacles in people's own lives, not just in business. She also looks at how you can overcome them" },
      ],
    },
    {
      id: 'c21-l4-p3',
      partNumber: 3,
      title: 'Part 3: Houses of the Future',
      context: 'Mia and Leo discuss their presentation on houses of the future, focusing on intergenerational living and architectural innovations.',
      audioUrl: '/audio/listening/c21_test4_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `MIA: You know that joint presentation we've got to do this semester, Leo?
LEO: On houses of the future?
MIA: That's right. I'm a bit concerned - are we meant to come up with creative new suggestions for these houses?
LEO: I don't think so. It's more a matter of reporting and evaluating possible developments. But we mustn't be too general, we've got to support our points by referring to specific cases. So that'll need a lot of work.
MIA: I'm afraid so. When's it got to be done by?
LEO: In about 6 weeks, so that's not too much of a rush.
MIA: Good. We'd better decide now what type of housing we're going to focus on.
LEO: How about housing for different generations living together?
MIA: We could do. Or accommodation for one person?
LEO: I think someone else is doing that. I was wondering about housing for the elderly? That's likely to become more important.
MIA: Yeah that's true. But I think your suggestion about intergenerational living might be more interesting - let's go with that.
LEO: OK. Now I think the future demand is mainly going to be for accommodation in urban areas. So one way of meeting that demand might be to use existing commercial buildings and adapt them to form accommodation ...
MIA: ... or come up with original ways of organising space so that people can live in smaller homes. But I think the solution is to design multi-storey apartment blocks.
LEO: Building up rather than out, yes.
MIA: Let's think of some specific developments for houses of the future.
LEO: OK. How about increased use of roof space on high-rise buildings for gardens.
MIA: Yes. In fact it doesn't have to be high-rise, you can do it on a one-storey building in a suburb, but it would greatly improve how you feel if you live in an urban high-rise.
LEO: Especially if you don't have a balcony.
MIA: Yes. I think homes of the future will all need access to a shared working space, somewhere in the same building or group of houses, where people can go and work instead of just having a laptop on the kitchen table.
LEO: Yes, so they aren't having to travel to an office but can still interact with others. That's often how new ideas get generated - by chatting to someone from a different profession.
MIA: Yeah. I read about a type of design where the internal walls of an apartment are moveable, so the space can be adapted over time as people's needs change.
LEO: Like when children leave school and start working but still continue to live with their parents for many years? Or when an elderly relative moves in with the family ... it would mean they could still have their own space, specially designed for their needs.
MIA: Yes. Have you heard about those smart bathroom mirrors which can monitor people's health? They recognise signs of illness and contact a doctor automatically?
LEO: Hmm, not so sure they're a good idea.
MIA: Nor am I. People might worry about conditions which aren't serious at all.
LEO: What about transport? Wouldn't it be good if there were bike sheds with charging points, so people could store their electric bikes securely and charge them up at the same time.
MIA: Yes. That would encourage more people to cycle, instead of using their car. Much better for the planet.
LEO: I read about one housing development where cars had to be left just outside it, so the centre was all a pedestrianised area. Great for families with children.
MIA: Maybe. But what if you're disabled or elderly, and can't walk far? It wouldn't be so good for people like that.
LEO: No.
MIA: I saw a scheme for communal vegetable plots, where neighbours could decide what to grow together. That'd be a great way for older people to get to know one another, especially if they're no longer going out to work.
LEO: Yes, doing something together's always more enjoyable, isn't it? Do you think ...`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 25, quote: "LEO: we've got to support our points by referring to specific cases. So that'll need a lot of work. MIA: I'm afraid so." },
        { questionNumber: 22, timestampSeconds: 45, quote: "intergenerational living might be more interesting - let's go with that." },
        { questionNumber: 23, timestampSeconds: 65, quote: "MIA: But I think the solution is to design multi-storey apartment blocks. LEO: Building up rather than out, yes." },
        { questionNumber: 24, timestampSeconds: 85, quote: "MIA: but it would greatly improve how you feel if you live in an urban high-rise. LEO: Especially if you don't have a balcony." },
        { questionNumber: 25, timestampSeconds: 105, quote: "LEO: That's often how new ideas get generated - by chatting to someone from a different profession." },
        { questionNumber: 26, timestampSeconds: 125, quote: "LEO: so the space can be adapted over time as people's needs change... still have their own space, specially designed for their needs." },
        { questionNumber: 27, timestampSeconds: 145, quote: "MIA: Nor am I. People might worry about conditions which aren't serious at all." },
        { questionNumber: 28, timestampSeconds: 160, quote: "MIA: That would encourage more people to cycle, instead of using their car. Much better for the planet." },
        { questionNumber: 29, timestampSeconds: 175, quote: "MIA: But what if you're disabled or elderly, and can't walk far? It wouldn't be so good for people like that." },
        { questionNumber: 30, timestampSeconds: 195, quote: "MIA: That'd be a great way for older people to get to know one another, especially if they're no longer going out to work." },
      ],
    },
    {
      id: 'c21-l4-p4',
      partNumber: 4,
      title: 'Part 4: Music Therapy for Surgical Patients',
      context: 'A lecture exploring clinical studies and evidence on using music therapy to assist recovery in surgical patients.',
      audioUrl: '/audio/listening/c21_test4_part4.mp3',
      containsIntroPauses: false,
      introPauseSeconds: 45,
      checkPauseSeconds: 30,
      transcript: `Today's lecture is about studies that look at how music therapy can be used to help patients who undergo surgery. Now, most people undergo a surgical procedure at some point in their lives. And more than fifty-one million operations are performed annually in the USA. But there's no escaping the fact that most patients feel uncomfortable following surgery. They may have difficulty mobilising, and even sitting up in bed can feel too much. They may also be negatively affected by having their routine disturbed, you know, like if they can't do the things they normally do, or have to devote a lot of time to appointments such as physiotherapy, to aid their recovery.
Currently, the main strategy for improving recovery is medication to control pain, and this can be administered to patients in the short, medium or longer term, depending on the extent of their surgery. But music is still not an everyday part of the post-surgical phase, despite a wealth of relevant studies supporting its potential in recovery.
Earlier this year, a research team set out to assess all the available evidence so that they could highlight the potential for music in surgical recovery. They identified nearly a hundred trials involving a total of seven thousand patients who were played recorded music as part of their post-operative care. The researchers then looked at what impact the music had on the patients. They discovered that patients who had been played music reported feeling happier and more satisfied in the post-operative phase, and the length of their stay was shorter than for patients who had not listened to any music.
The researchers also explored the patients' choice of music, and their findings showed that a wide variety of music styles was evident. However, a common factor was that the chosen music had a calming quality. Some of the patients listened to music with headphones, but it was quiet enough not to prevent them from being able to communicate with nurses and other staff. More often though, the mode of delivery was by what are known as music pillows. These broadcast sound that is only audible to the person lying on them. The research involved testing music before, during or after operations or a combination. Some patients listened to the music just once a day, while others had several episodes a day.
When asked to report their experience of listening to music, surgical patients said that either they had no feelings of anxiety at any point, or those feelings were only slight. Patients who hadn't listened to music, on the other hand, reported higher levels of dissatisfaction. This feedback from all of the patients was then cross-checked against their medical notes. And in every case, those who were given music to listen to didn't need as much medication to ease their pain as those patients who weren't played music. The type of music, patient choice and timing, before, during or after the surgery didn't make much difference. And it even worked when patients were played music under general anaesthetic, although the positive effects were greater when patients were awake.
All the evidence suggests that music has a positive effect on post-operative patients, but it's not entirely clear how or why this is the case. A lot of people listen to music in daily life as a way to relax and forget their problems, but the researchers came to the conclusion that it worked on patients by distraction. I suppose it was something familiar and gave them something they could control.
The researchers say there is now sufficient research to demonstrate that music should be available to all patients undergoing operations. They say patients should be able to choose what they'd like to listen to, and if they prefer, recordings taken from nature can be just as good as music. Surgical teams may prefer patients to listen to music before the procedure or as soon as they arrive back onto the ward. Clearly, there's more to learn about this area, and the team now plan to focus their next research on the most appropriate volume to play the music at. And I look forward to reading the results of their study.
It will be interesting to see ...`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 25, quote: "They may also be negatively affected by having their routine disturbed" },
        { questionNumber: 32, timestampSeconds: 45, quote: "They identified nearly a hundred trials involving a total of seven thousand patients" },
        { questionNumber: 33, timestampSeconds: 65, quote: "However, a common factor was that the chosen music had a calming quality." },
        { questionNumber: 34, timestampSeconds: 80, quote: "More often though, the mode of delivery was by what are known as music pillows." },
        { questionNumber: 35, timestampSeconds: 100, quote: "surgical patients said that either they had no feelings of anxiety at any point, or those feelings were only slight." },
        { questionNumber: 36, timestampSeconds: 120, quote: "those who were given music to listen to didn't need as much medication to ease their pain" },
        { questionNumber: 37, timestampSeconds: 135, quote: "although the positive effects were greater when patients were awake." },
        { questionNumber: 38, timestampSeconds: 155, quote: "researchers came to the conclusion that it worked on patients by distraction." },
        { questionNumber: 39, timestampSeconds: 175, quote: "if they prefer, recordings taken from nature can be just as good as music." },
        { questionNumber: 40, timestampSeconds: 195, quote: "the team now plan to focus their next research on the most appropriate volume to play the music at." },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // -------------------------------------------------------------
    // PART 1: Questions 1-10 (Form / Note Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l4-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the form below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Survey about shopping in Broadbeach
• Name: Martyn [[1]]
• Today's journey to Broadbeach town centre: used his [[2]]
• Purpose of today's trip:
  - has visited the [[3]]
  - looking for a new [[4]]
  - collecting [[5]] (after repair)
• Preferred day for shopping: [[6]]

Opinions about shopping in the town centre
• Finds the service in shops is excellent
• Thinks there are too many places selling [[7]]
• Would like more places to buy [[8]]

Opinions about new out-of-town Shopping Centre
• Likes the [[9]] best
• Believes the [[10]] is unnecessary`,
      questions: [
        {
          id: 'c21-l4-q1',
          questionNumber: 1,
          prompt: 'Name: Martyn ________',
          answerKey: 'Leigh',
          acceptedAlternatives: ['Leigh', 'leigh'],
          explanation: "Martyn spells his surname: 'It\\'s L-E-I-G-H'.",
          transcriptExcerpt: "WOMAN: And is your family name spelt L-double-E? MAN: It's L-E-I-G-H.",
          audioTimestampSeconds: 42,
        },
        {
          id: 'c21-l4-q2',
          questionNumber: 2,
          prompt: "Today's journey to Broadbeach town centre: used his ________",
          answerKey: 'motorbike',
          acceptedAlternatives: ['motorbike'],
          explanation: "Martyn says: 'normally I catch the bus, but I'm on my motorbike today because I'm going to work later'.",
          transcriptExcerpt: "Well, normally I catch the bus, but I'm on my motorbike today because I'm going to work later.",
          audioTimestampSeconds: 49,
        },
        {
          id: 'c21-l4-q3',
          questionNumber: 3,
          prompt: "Purpose of today's trip: has visited the ________",
          answerKey: 'hairdresser',
          acceptedAlternatives: ['hairdresser', "hairdresser's"],
          explanation: "Martyn explains: 'I've just been to the hairdresser. You see, I have a job interview at the council in a few days'.",
          transcriptExcerpt: "I've just been to the hairdresser. You see, I have a job interview at the council in a few days.",
          audioTimestampSeconds: 53,
        },
        {
          id: 'c21-l4-q4',
          questionNumber: 4,
          prompt: "Purpose of today's trip: looking for a new ________",
          answerKey: 'suit',
          acceptedAlternatives: ['suit'],
          explanation: "Martyn says: 'And now I'm on my way to buy a suit that I can wear to the interview'.",
          transcriptExcerpt: "And now I'm on my way to buy a suit that I can wear to the interview. I don't actually own one at the moment!",
          audioTimestampSeconds: 56,
        },
        {
          id: 'c21-l4-q5',
          questionNumber: 5,
          prompt: "Purpose of today's trip: collecting ________ (after repair)",
          answerKey: 'laptop',
          acceptedAlternatives: ['laptop'],
          explanation: "Martyn states: 'Well, I've got to go and pick up my laptop. It broke a couple of days ago so I took it to the shop to get it fixed'.",
          transcriptExcerpt: "Well, I've got to go and pick up my laptop. It broke a couple of days ago so I took it to the shop to get it fixed.",
          audioTimestampSeconds: 59,
        },
        {
          id: 'c21-l4-q6',
          questionNumber: 6,
          prompt: 'Preferred day for shopping: ________',
          answerKey: 'Monday',
          acceptedAlternatives: ['Monday', 'monday'],
          explanation: "Martyn says: 'If I'm free on a Monday, that's when I choose to come into town. The shops are less busy then'.",
          transcriptExcerpt: "If I'm free on a Monday, that's when I choose to come into town. The shops are less busy then, which I always prefer.",
          audioTimestampSeconds: 64,
        },
        {
          id: 'c21-l4-q7',
          questionNumber: 7,
          prompt: 'Opinions about shopping in the town centre: Thinks there are too many places selling ________',
          answerKey: 'coffee',
          acceptedAlternatives: ['coffee'],
          explanation: "When asked about the new coffee shops, Martyn replies: 'No, there are too many of them. It's a shame as those places could be occupied by other kinds of shops'.",
          transcriptExcerpt: "WOMAN: For example, there are a lot of new coffee shops now, are you enjoying them? MAN: No, there are too many of them.",
          audioTimestampSeconds: 74,
        },
        {
          id: 'c21-l4-q8',
          questionNumber: 8,
          prompt: 'Opinions about shopping in the town centre: Would like more places to buy ________',
          answerKey: 'books',
          acceptedAlternatives: ['books', 'book'],
          explanation: "Martyn notes: 'there's only one place that sells books at the moment. It'd be nice to have a choice, you know'.",
          transcriptExcerpt: "Well, I think we have enough clothing shops. But there's only one place that sells books at the moment. It'd be nice to have a choice, you know.",
          audioTimestampSeconds: 78,
        },
        {
          id: 'c21-l4-q9',
          questionNumber: 9,
          prompt: 'Opinions about new out-of-town Shopping Centre: Likes the ________ best',
          answerKey: 'plants',
          acceptedAlternatives: ['plants', 'plant'],
          explanation: "Martyn explains: 'my favourite thing is the plants they've put around the building. They're amazing, and so big already'.",
          transcriptExcerpt: "The glass roof is certainly impressive. But my favourite thing is the plants they've put around the building. They're amazing, and so big already.",
          audioTimestampSeconds: 95,
        },
        {
          id: 'c21-l4-q10',
          questionNumber: 10,
          prompt: 'Opinions about new out-of-town Shopping Centre: Believes the ________ is unnecessary',
          answerKey: 'cinema',
          acceptedAlternatives: ['cinema'],
          explanation: "Asked about the new cinema, Martyn replies: 'Nah, not yet. I can't see any advantage in having it there because the one in town is actually bigger' (believes it is unnecessary).",
          transcriptExcerpt: "WOMAN: Like the new cinema? MAN: Nah, not yet. I can't see any advantage in having it there because the one in town is actually bigger.",
          audioTimestampSeconds: 98,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 11-12 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l4-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 11 and 12',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 11,
      endQuestionNumber: 12,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'the Digital Marketing Centre' },
        { key: 'B', text: 'the TalkCon Zone' },
        { key: 'C', text: 'the Breakout area' },
        { key: 'D', text: 'the Business Village' },
        { key: 'E', text: 'the Business Connections Zone' },
      ],
      questions: [
        {
          id: 'c21-l4-q11',
          questionNumber: 11,
          prompt: 'In which TWO areas of the business exhibition did James Craig promote his company last year?',
          options: [
            { key: 'A', text: 'the Digital Marketing Centre' },
            { key: 'B', text: 'the TalkCon Zone' },
            { key: 'C', text: 'the Breakout area' },
            { key: 'D', text: 'the Business Village' },
            { key: 'E', text: 'the Business Connections Zone' },
          ],
          answerKey: ['C', 'E'],
          explanation: "James says: 'We also used the Breakout area... and due to popular request we used that again last year' (C) and 'Last year we also sponsored the innovative Business Connections Zone where people could leave their contact details' (E). The Business Village was their first year (D), while A and B are planned for the future.",
          transcriptExcerpt: "We also used the Breakout area where people could sit down and relax, and try out our products, and due to popular request we used that again last year. Last year we also sponsored the innovative Business Connections Zone...",
          audioTimestampSeconds: 35,
        },
        {
          id: 'c21-l4-q12',
          questionNumber: 12,
          prompt: 'In which TWO areas of the business exhibition did James Craig promote his company last year?',
          options: [
            { key: 'A', text: 'the Digital Marketing Centre' },
            { key: 'B', text: 'the TalkCon Zone' },
            { key: 'C', text: 'the Breakout area' },
            { key: 'D', text: 'the Business Village' },
            { key: 'E', text: 'the Business Connections Zone' },
          ],
          answerKey: ['C', 'E'],
          explanation: "James says: 'We also used the Breakout area... and due to popular request we used that again last year' (C) and 'Last year we also sponsored the innovative Business Connections Zone where people could leave their contact details' (E).",
          transcriptExcerpt: "We also used the Breakout area where people could sit down and relax, and try out our products, and due to popular request we used that again last year. Last year we also sponsored the innovative Business Connections Zone...",
          audioTimestampSeconds: 45,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 13-14 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l4-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 13 and 14',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 13,
      endQuestionNumber: 14,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'They are available to all members of exhibiting companies.' },
        { key: 'B', text: 'They can be used for both food and clothing.' },
        { key: 'C', text: 'They only apply if people spend at least £400.' },
        { key: 'D', text: 'They can be used by family members.' },
        { key: 'E', text: 'The percentage saved is always the same.' },
      ],
      questions: [
        {
          id: 'c21-l4-q13',
          questionNumber: 13,
          prompt: 'Which TWO facts are given about discounts on popular brands available to exhibitors?',
          options: [
            { key: 'A', text: 'They are available to all members of exhibiting companies.' },
            { key: 'B', text: 'They can be used for both food and clothing.' },
            { key: 'C', text: 'They only apply if people spend at least £400.' },
            { key: 'D', text: 'They can be used by family members.' },
            { key: 'E', text: 'The percentage saved is always the same.' },
          ],
          answerKey: ['A', 'B'],
          explanation: "The speaker explains: 'The scheme is available to every member of your organisation' (A) and mentions discounts on 'major high street fashion... as well as grocery chains' (clothing and food, B). The £400 is the average saving rather than a minimum spend (C incorrect), and discounts vary from 3.5% to 15% (E incorrect).",
          transcriptExcerpt: "including major high street fashion and jewellery outlets, as well as grocery chains... The scheme is available to every member of your organisation so this is a benefit that really does have something for you all.",
          audioTimestampSeconds: 70,
        },
        {
          id: 'c21-l4-q14',
          questionNumber: 14,
          prompt: 'Which TWO facts are given about discounts on popular brands available to exhibitors?',
          options: [
            { key: 'A', text: 'They are available to all members of exhibiting companies.' },
            { key: 'B', text: 'They can be used for both food and clothing.' },
            { key: 'C', text: 'They only apply if people spend at least £400.' },
            { key: 'D', text: 'They can be used by family members.' },
            { key: 'E', text: 'The percentage saved is always the same.' },
          ],
          answerKey: ['A', 'B'],
          explanation: "The speaker explains: 'The scheme is available to every member of your organisation' (A) and mentions discounts on 'major high street fashion... as well as grocery chains' (clothing and food, B).",
          transcriptExcerpt: "including major high street fashion and jewellery outlets, as well as grocery chains... The scheme is available to every member of your organisation so this is a benefit that really does have something for you all.",
          audioTimestampSeconds: 78,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 15-20 (Matching)
    // -------------------------------------------------------------
    {
      id: 'c21-l4-g4',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 15–20',
      instructions: 'Which topic will each of the following speakers focus on?\nChoose SIX answers from the box and write the correct letter, A–G, next to Questions 15–20.',
      startQuestionNumber: 15,
      endQuestionNumber: 20,
      optionsList: [
        { key: 'A', text: 'Supporting job seekers' },
        { key: 'B', text: 'Dealing with personal problems' },
        { key: 'C', text: 'Effects of an unexpectedly rapid expansion' },
        { key: 'D', text: 'A global range of business experiences' },
        { key: 'E', text: 'Coping with financial set-backs' },
        { key: 'F', text: 'Developing a company in response to changing markets' },
        { key: 'G', text: 'Combining business success with contributions to charities' },
      ],
      questions: [
        {
          id: 'c21-l4-q15',
          questionNumber: 15,
          prompt: 'Jim Clowrie',
          answerKey: 'C',
          explanation: "The speaker says Jim's cafe 'became a bit of a sensation, and in a remarkably short time he had opened an amazing 76 restaurants worldwide. He'll be telling you how it all happened, and how it changed his life' (effects of an unexpectedly rapid expansion, C).",
          transcriptExcerpt: "Rather to his surprise this became a bit of a sensation, and in a remarkably short time he had opened an amazing 76 restaurants worldwide. He'll be telling you how it all happened, and how it changed his life.",
          audioTimestampSeconds: 95,
        },
        {
          id: 'c21-l4-q16',
          questionNumber: 16,
          prompt: 'David France',
          answerKey: 'G',
          explanation: "David's business is flourishing, but 'he isn't just interested in making money - he also makes regular donations to organisations helping those in need both in the UK and elsewhere in the world' (combining business success with contributions to charities, G).",
          transcriptExcerpt: "David's company has gone from strength to strength but he isn't just interested in making money - he also makes regular donations to organisations helping those in need both in the UK and elsewhere in the world.",
          audioTimestampSeconds: 110,
        },
        {
          id: 'c21-l4-q17',
          questionNumber: 17,
          prompt: 'Oliver Stanton',
          answerKey: 'D',
          explanation: "Oliver worked across Malaysia, Japan, Hong Kong, and the UK: 'He'll be telling you about what he discovered during his travels around the world about business practices in different cultures' (a global range of business experiences, D).",
          transcriptExcerpt: "He'll be telling you about what he discovered during his travels around the world about business practices in different cultures.",
          audioTimestampSeconds: 130,
        },
        {
          id: 'c21-l4-q18',
          questionNumber: 18,
          prompt: 'Francesca Heptonstall',
          answerKey: 'A',
          explanation: "Francesca is 'passionate about helping people gain employment and organises an annual jobs fair, so she'll be concentrating on this in her talk' (supporting job seekers, A).",
          transcriptExcerpt: "she's also passionate about helping people gain employment and organises an annual jobs fair, so she'll be concentrating on this in her talk.",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c21-l4-q19',
          questionNumber: 19,
          prompt: 'Salman Khan',
          answerKey: 'F',
          explanation: "Salman adapted his business from publishing into digital marketing: 'He'll be talking about the need for flexibility to cope with new directions in today's business world' (developing a company in response to changing markets, F).",
          transcriptExcerpt: "turned around this business from a major publishing business to one of the UK's largest digital marketing service providers. He'll be talking about the need for flexibility to cope with new directions in today's business world.",
          audioTimestampSeconds: 160,
        },
        {
          id: 'c21-l4-q20',
          questionNumber: 20,
          prompt: 'Annie Craven',
          answerKey: 'B',
          explanation: "Annie's session provides 'an interactive look at different obstacles in people's own lives, not just in business. She also looks at how you can overcome them' (dealing with personal problems, B).",
          transcriptExcerpt: "Her session will offer an interactive look at different obstacles in people's own lives, not just in business. She also looks at how you can overcome them...",
          audioTimestampSeconds: 175,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 21-23 (Multiple Choice Single)
    // -------------------------------------------------------------
    {
      id: 'c21-l4-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 21–23',
      instructions: 'Choose the correct letter, A, B or C.\nPresentation on houses of the future',
      startQuestionNumber: 21,
      endQuestionNumber: 23,
      questions: [
        {
          id: 'c21-l4-q21',
          questionNumber: 21,
          prompt: 'Which aspect of their presentation are Mia and Leo both concerned about?',
          options: [
            { key: 'A', text: 'meeting the deadline' },
            { key: 'B', text: 'finding suitable examples' },
            { key: 'C', text: 'including original ideas' },
          ],
          answerKey: 'B',
          explanation: "Leo explains: 'we've got to support our points by referring to specific cases. So that'll need a lot of work', and Mia agrees: 'I'm afraid so' (finding suitable examples / specific cases, B). Leo mentions the 6-week timeframe is not a rush (A incorrect).",
          transcriptExcerpt: "LEO: But we mustn't be too general, we've got to support our points by referring to specific cases. So that'll need a lot of work. MIA: I'm afraid so.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c21-l4-q22',
          questionNumber: 22,
          prompt: 'The students decide to focus their assignment on housing for',
          options: [
            { key: 'A', text: 'family groups.' },
            { key: 'B', text: 'old people.' },
            { key: 'C', text: 'single people.' },
          ],
          answerKey: 'A',
          explanation: "Leo suggests 'housing for different generations living together' and Mia agrees: 'your suggestion about intergenerational living might be more interesting - let's go with that' (family groups, A).",
          transcriptExcerpt: "LEO: How about housing for different generations living together? ... MIA: Yeah that's true. But I think your suggestion about intergenerational living might be more interesting - let's go with that.",
          audioTimestampSeconds: 45,
        },
        {
          id: 'c21-l4-q23',
          questionNumber: 23,
          prompt: 'The students agree that demand for accommodation in urban areas should be met by',
          options: [
            { key: 'A', text: 'repurposing offices and factories.' },
            { key: 'B', text: 'constructing tall buildings.' },
            { key: 'C', text: 'developing creative ideas for smaller homes.' },
          ],
          answerKey: 'B',
          explanation: "Mia argues: 'I think the solution is to design multi-storey apartment blocks', and Leo concurs: 'Building up rather than out, yes' (constructing tall buildings, B).",
          transcriptExcerpt: "MIA: But I think the solution is to design multi-storey apartment blocks. LEO: Building up rather than out, yes.",
          audioTimestampSeconds: 65,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 24-30 (Matching)
    // -------------------------------------------------------------
    {
      id: 'c21-l4-g6',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 24–30',
      instructions: 'What opinion is given about each of the following developments?\nChoose SEVEN answers from the box and write the correct letter, A–I, next to Questions 24–30.',
      startQuestionNumber: 24,
      endQuestionNumber: 30,
      optionsList: [
        { key: 'A', text: 'This could cause unnecessary anxiety.' },
        { key: 'B', text: 'This would be especially beneficial for city residents.' },
        { key: 'C', text: 'This would be challenging for young people.' },
        { key: 'D', text: 'This would have environmental benefits.' },
        { key: 'E', text: 'This could encourage creativity.' },
        { key: 'F', text: 'This could lead to social problems.' },
        { key: 'G', text: 'This could enable retired people to share a project.' },
        { key: 'H', text: 'This would help some people but cause problems for others.' },
        { key: 'I', text: 'This would suit both existing and new members of a household.' },
      ],
      questions: [
        {
          id: 'c21-l4-q24',
          questionNumber: 24,
          prompt: 'use of roof space for gardens',
          answerKey: 'B',
          explanation: "Mia explains: 'it would greatly improve how you feel if you live in an urban high-rise. Especially if you don't have a balcony' (especially beneficial for city residents, B).",
          transcriptExcerpt: "MIA: but it would greatly improve how you feel if you live in an urban high-rise. LEO: Especially if you don't have a balcony.",
          audioTimestampSeconds: 85,
        },
        {
          id: 'c21-l4-q25',
          questionNumber: 25,
          prompt: 'shared working spaces',
          answerKey: 'E',
          explanation: "Leo remarks: 'That's often how new ideas get generated - by chatting to someone from a different profession' (encourage creativity, E).",
          transcriptExcerpt: "LEO: Yes, so they aren't having to travel to an office but can still interact with others. That's often how new ideas get generated - by chatting to someone from a different profession.",
          audioTimestampSeconds: 105,
        },
        {
          id: 'c21-l4-q26',
          questionNumber: 26,
          prompt: 'moveable internal walls',
          answerKey: 'I',
          explanation: "Leo points out that adapting space when children grow up and stay home or when an elderly relative moves in means 'they could still have their own space, specially designed for their needs' (suit both existing and new members of a household, I).",
          transcriptExcerpt: "LEO: Like when children leave school and start working but still continue to live with their parents for many years? Or when an elderly relative moves in with the family ... it would mean they could still have their own space, specially designed for their needs.",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c21-l4-q27',
          questionNumber: 27,
          prompt: 'smart mirrors in bathrooms',
          answerKey: 'A',
          explanation: "Mia says: 'People might worry about conditions which aren't serious at all' (cause unnecessary anxiety, A).",
          transcriptExcerpt: "LEO: Hmm, not so sure they're a good idea. MIA: Nor am I. People might worry about conditions which aren't serious at all.",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c21-l4-q28',
          questionNumber: 28,
          prompt: 'bike sheds with charging points',
          answerKey: 'D',
          explanation: "Mia states: 'That would encourage more people to cycle, instead of using their car. Much better for the planet' (environmental benefits, D).",
          transcriptExcerpt: "MIA: Yes. That would encourage more people to cycle, instead of using their car. Much better for the planet.",
          audioTimestampSeconds: 160,
        },
        {
          id: 'c21-l4-q29',
          questionNumber: 29,
          prompt: 'restriction of cars to certain areas',
          answerKey: 'H',
          explanation: "Leo notes it is great for families with kids, but Mia counters: 'But what if you're disabled or elderly, and can't walk far? It wouldn't be so good for people like that' (help some people but cause problems for others, H).",
          transcriptExcerpt: "LEO: Great for families with children. MIA: Maybe. But what if you're disabled or elderly, and can't walk far? It wouldn't be so good for people like that.",
          audioTimestampSeconds: 175,
        },
        {
          id: 'c21-l4-q30',
          questionNumber: 30,
          prompt: 'communal vegetable plots',
          answerKey: 'G',
          explanation: "Mia highlights: 'That'd be a great way for older people to get to know one another, especially if they're no longer going out to work' (enable retired people to share a project, G).",
          transcriptExcerpt: "MIA: That'd be a great way for older people to get to know one another, especially if they're no longer going out to work. LEO: Yes, doing something together's always more enjoyable, isn't it?",
          audioTimestampSeconds: 195,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 4: Questions 31-40 (Note Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l4-g7',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Music therapy for surgical patients
Background
• Surgery impacts patients because they may experience discomfort or unwelcome changes to their [[31]]
• Current post-surgical strategies focus mainly on pain relief

Recent research
• A study reviewed data from about 100 [[32]] and found that listening to music
  - improved hospital patients' sense of wellbeing
  - reduced the length of their stay
• The patients in the study all listened to music with a [[33]] effect
• The music was mostly played through music [[34]]
• Patients reported an absence or low levels of [[35]]
• Medical records confirmed that patients who were played music in hospital needed less [[36]] than those who weren't played music
• The best results were achieved when patients were played music while they were [[37]]
• The study concluded that playing music was effective because it served as a [[38]]
• The researchers recommend playing either music or sounds from [[39]] to all surgical patients
• A future study will investigate the best [[40]] for the music`,
      questions: [
        {
          id: 'c21-l4-q31',
          questionNumber: 31,
          prompt: 'Surgery impacts patients because they may experience discomfort or unwelcome changes to their ________',
          answerKey: 'routine',
          acceptedAlternatives: ['routine'],
          explanation: "The lecturer explains: 'They may also be negatively affected by having their routine disturbed, you know, like if they can't do the things they normally do'.",
          transcriptExcerpt: "They may also be negatively affected by having their routine disturbed, you know, like if they can't do the things they normally do...",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c21-l4-q32',
          questionNumber: 32,
          prompt: "A study reviewed data from about 100 ________ and found that listening to music improved patients' sense of wellbeing...",
          answerKey: 'trials',
          acceptedAlternatives: ['trials', 'trial'],
          explanation: "The speaker says: 'They identified nearly a hundred trials involving a total of seven thousand patients who were played recorded music as part of their post-operative care'.",
          transcriptExcerpt: "They identified nearly a hundred trials involving a total of seven thousand patients who were played recorded music as part of their post-operative care.",
          audioTimestampSeconds: 45,
        },
        {
          id: 'c21-l4-q33',
          questionNumber: 33,
          prompt: 'The patients in the study all listened to music with a ________ effect',
          answerKey: 'calming',
          acceptedAlternatives: ['calming'],
          explanation: "The lecturer states: 'However, a common factor was that the chosen music had a calming quality' (calming effect).",
          transcriptExcerpt: "However, a common factor was that the chosen music had a calming quality.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c21-l4-q34',
          questionNumber: 34,
          prompt: 'The music was mostly played through music ________',
          answerKey: 'pillows',
          acceptedAlternatives: ['pillows', 'pillow'],
          explanation: "The lecturer explains: 'More often though, the mode of delivery was by what are known as music pillows. These broadcast sound that is only audible to the person lying on them'.",
          transcriptExcerpt: "More often though, the mode of delivery was by what are known as music pillows. These broadcast sound that is only audible to the person lying on them.",
          audioTimestampSeconds: 80,
        },
        {
          id: 'c21-l4-q35',
          questionNumber: 35,
          prompt: 'Patients reported an absence or low levels of ________',
          answerKey: 'anxiety',
          acceptedAlternatives: ['anxiety'],
          explanation: "The lecturer notes: 'surgical patients said that either they had no feelings of anxiety at any point, or those feelings were only slight'.",
          transcriptExcerpt: "surgical patients said that either they had no feelings of anxiety at any point, or those feelings were only slight.",
          audioTimestampSeconds: 100,
        },
        {
          id: 'c21-l4-q36',
          questionNumber: 36,
          prompt: "Medical records confirmed that patients who were played music in hospital needed less ________ than those who weren't played music",
          answerKey: 'medication',
          acceptedAlternatives: ['medication', 'medications'],
          explanation: "The speaker explains: 'those who were given music to listen to didn't need as much medication to ease their pain as those patients who weren't played music'.",
          transcriptExcerpt: "And in every case, those who were given music to listen to didn't need as much medication to ease their pain as those patients who weren't played music.",
          audioTimestampSeconds: 120,
        },
        {
          id: 'c21-l4-q37',
          questionNumber: 37,
          prompt: 'The best results were achieved when patients were played music while they were ________',
          answerKey: 'awake',
          acceptedAlternatives: ['awake'],
          explanation: "The lecturer reports: 'And it even worked when patients were played music under general anaesthetic, although the positive effects were greater when patients were awake'.",
          transcriptExcerpt: "And it even worked when patients were played music under general anaesthetic, although the positive effects were greater when patients were awake.",
          audioTimestampSeconds: 135,
        },
        {
          id: 'c21-l4-q38',
          questionNumber: 38,
          prompt: 'The study concluded that playing music was effective because it served as a ________',
          answerKey: 'distraction',
          acceptedAlternatives: ['distraction'],
          explanation: "The lecturer explains: 'the researchers came to the conclusion that it worked on patients by distraction'.",
          transcriptExcerpt: "the researchers came to the conclusion that it worked on patients by distraction. I suppose it was something familiar and gave them something they could control.",
          audioTimestampSeconds: 155,
        },
        {
          id: 'c21-l4-q39',
          questionNumber: 39,
          prompt: 'The researchers recommend playing either music or sounds from ________ to all surgical patients',
          answerKey: 'nature',
          acceptedAlternatives: ['nature'],
          explanation: "The lecturer states: 'if they prefer, recordings taken from nature can be just as good as music'.",
          transcriptExcerpt: "They say patients should be able to choose what they'd like to listen to, and if they prefer, recordings taken from nature can be just as good as music.",
          audioTimestampSeconds: 175,
        },
        {
          id: 'c21-l4-q40',
          questionNumber: 40,
          prompt: 'A future study will investigate the best ________ for the music',
          answerKey: 'volume',
          acceptedAlternatives: ['volume'],
          explanation: "The lecturer concludes: 'the team now plan to focus their next research on the most appropriate volume to play the music at'.",
          transcriptExcerpt: "the team now plan to focus their next research on the most appropriate volume to play the music at.",
          audioTimestampSeconds: 195,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 21 Academic Listening Test 4',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      audioMode: 'part_audios',
      overallAudioUrl: '/audio/listening/c21_test4_complete.mp3',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c21_test4_part1.mp3', durationSeconds: 360 },
        { partNumber: 2, audioUrl: '/audio/listening/c21_test4_part2.mp3', durationSeconds: 340 },
        { partNumber: 3, audioUrl: '/audio/listening/c21_test4_part3.mp3', durationSeconds: 380 },
        { partNumber: 4, audioUrl: '/audio/listening/c21_test4_part4.mp3', durationSeconds: 390 },
      ],
    },
    parts,
    questionGroups,
  };
}

export function ingestCambridge21ListeningTest4(authorId?: string): {
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
} {
  const data = getCambridge21ListeningTest4Data();
  const errors = validateListeningTestVersion(data.parts, data.questionGroups);
  if (errors.length > 0) {
    throw new Error(`Cambridge 21 Listening Test 4 validation failed:\n- ${errors.join('\n- ')}`);
  }

  const resolvedAuthorId =
    authorId ||
    (db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any)?.id ||
    uuidv4();

  const now = new Date().toISOString();

  const existingTest = db
    .prepare("SELECT id, current_version_number FROM listening_tests WHERE title LIKE '%Cambridge%21%Listening%Test 4%' OR title = ?")
    .get(data.title) as any;

  let testId: string;
  let versionId: string;

  if (existingTest) {
    testId = existingTest.id;
    const existingVer = db
      .prepare('SELECT id FROM listening_test_versions WHERE test_id = ? ORDER BY version_number DESC LIMIT 1')
      .get(testId) as any;

    versionId = existingVer ? existingVer.id : uuidv4();

    if (existingVer) {
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
      db.prepare(`
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
    );
  }

  return {
    testId,
    versionId,
    status: 'published',
    totalQuestions: 40,
  };
}
