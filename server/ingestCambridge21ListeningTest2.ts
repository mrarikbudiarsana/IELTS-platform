import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, ListeningTest } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

export function getCambridge21ListeningTest2Data(): {
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
      id: 'c21-l2-p1',
      partNumber: 1,
      title: 'Part 1: One-day classes at Steynford College',
      context: 'An enquiry about one-day adult education classes at Steynford College.',
      audioUrl: '/audio/listening/c21_test2_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `MAN: Hello, Steynford College external course registration, can I help you?
WOMAN: Yeah, I'm ringing to find out about one-day classes next year. I got a leaflet about them in the post but I lost it, and I understand some of the classes are filling up fast, so I might need to book quite soon if I want to go ahead.
MAN: Sure. Can you remember which one you were considering?
WOMAN: There were a few actually. I remember there was one on how to make Vietnamese food that sounded good. I think that was on the 13th of January. It cost about 60 pounds.
MAN: Yes, you're right about the date, but it's 59 pounds actually. It's a very popular class, and among other things the teacher explains how Vietnamese food includes lots of different herbs. I'm afraid that all the places are taken at present, but I can put you on the waiting list if you want?
WOMAN: No, that's OK. I'm quite interested in the bread making class. That's in March sometime, isn't it?
MAN: Yeah, the 20th of March. Would you like to register for that?
WOMAN: I'm not sure. How much is it?
MAN: The actual cost is £48 but then there's an extra charge as well as that for the ingredients – I'm not sure how much that is, no more than twenty pounds I think.
WOMAN: So what sorts of things do they make in the class?
MAN: Oh, various types of bread; I think they make white bread and then they make sourdough, that seems to be very fashionable at present, and they learn how to make pizza, which is apparently really good.
WOMAN: Well I'd definitely be interested in that, but there were also a few other classes that sounded interesting. I think there was one on face massage? I'd love to learn how to do that.
MAN: Yeah, that's on the 23rd of February and it costs just £35 for the day. The teacher's great, the type of massage done is a traditional technique used in India and she actually did her training there. The massage is meant to relax you and get rid of lines and wrinkles. You practise it on yourself so you have to take a mirror to the class, so you can see what you're doing.
WOMAN: OK.

WOMAN: And I think there was a class in candle making?
MAN: Yes that's sometime in April, I think. Let me check ... yes, it's on the 6th. It was on the 23rd of January but they had to change the date. It's just £52. That's a popular course too. I think one reason why people like it is because the candles are all made out of natural products. It's filling up fast but there's still a few places left.
WOMAN: Yes one of my friends did that class. She said the candles make really good presents. In fact she gave me one.
MAN: By the way, have you heard about the class on silk painting? That's being held on the 18th of May. You learn how to create designs on silk fabric and colour them using special dyes. Apparently people can produce beautiful artworks that way, either to put on the wall as a picture or to use for something like a scarf. It's £67.50, which is really good value I think – there's a similar class I've seen that was £110.
WOMAN: That sounds interesting. Would I need to bring the silk?
MAN: No, the only thing is everyone has to bring something to protect their clothing, like an apron if you've got one, or a shirt that you don't use any more, because the dye can really stain your clothes.
WOMAN: Right. Then the last class I was considering was a bit different, that was on DIY for beginners. I'd like to learn how to do household repairs. Are there any places left on that?
MAN: That's on the 24th of February – yes, there are a few places. It's a bit more expensive – it's £125 – but it's a very popular class. You learn how to use an electric drill and a saw.
WOMAN: Yeah, that would be really useful, and I even need to learn how to use a hammer because I always end up hitting my fingers.
MAN: Yes, you'll do that too. And when you've learned how to use the basic tools, you do a practical job which is fixing a shelf to a wall.
WOMAN: Great. Just what I need to know. Right, well I'd like to enrol for that and also for ...`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 22, quote: '13th of January' },
        { questionNumber: 2, timestampSeconds: 42, quote: 'The actual cost is £48' },
        { questionNumber: 3, timestampSeconds: 52, quote: 'they learn how to make pizza' },
        { questionNumber: 4, timestampSeconds: 68, quote: 'technique used in India and she actually did her training there' },
        { questionNumber: 5, timestampSeconds: 76, quote: 'you have to take a mirror to the class' },
        { questionNumber: 6, timestampSeconds: 84, quote: "sometime in April, I think. Let me check ... yes, it's on the 6th" },
        { questionNumber: 7, timestampSeconds: 92, quote: 'candles are all made out of natural products' },
        { questionNumber: 8, timestampSeconds: 104, quote: "It's £67.50, which is really good value" },
        { questionNumber: 9, timestampSeconds: 112, quote: "like an apron if you've got one, or a shirt that you don't use any more" },
        { questionNumber: 10, timestampSeconds: 126, quote: 'learn how to use a hammer because I always end up hitting my fingers' },
      ],
    },
    {
      id: 'c21-l2-p2',
      partNumber: 2,
      title: 'Part 2: Local Walks and the Melby Coal Mine',
      context: 'A talk about history and nature walks in the region, followed by a tour of the Melby Coal Mine visitor site.',
      audioUrl: '/audio/listening/c21_test2_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Here is some information about history and nature walks in the region. They can be completed in less than a day and also be combined with a visit to Melby, a former coal mine now open to the public.

The Marsden Coastal Walk is suitable for all the family as there are no strenuous climbs. The route begins at Marsden harbour, where there are hourly ferries to and from the beautiful Hooker Island, a great place for fishing. The walk covers part of the coastal path trail. As there are clear signposts all along the way, you don't even need to take a map with you. At one point, the route goes inland slightly and passes a castle built in the 1400s near to a now-vanished market town. The castle's now just a pile of stones but it's a great place to take photos, and fascinating information boards show what it once looked like. If you set off early, you can be back in time for midday.

The Melby Heritage Walk is a great place to take photos, especially of the night sky. At certain times of the year, people come here from far and wide. They climb to the top of the valley and take pictures of the stars. In the daytime, it's completely different. As you hike through the dense woods in the valley bottom, the only things you'll hear are the sound of your own footsteps. At the highest point, you can stop to take in the views, and those with lots of energy can climb the tower that's situated where there was once a seventeenth century hunting lodge. The route continues along the tops of the hills and brings you back down to the starting point – the car park at Melby Coal Mine.

Melby Coal Mine has been open to the public for twenty years and has won awards for its visitor experience. Many of the buildings around the mine are still standing and have been converted into display areas.

Firstly, there's an exhibition showing the history of the mine, with many original black and white photos. To see that, you go from the car park, via a covered walkway to the Main Visitor Centre. Go through the ticket office to an area where there are lockers to leave heavy bags in, and where you can borrow raincoats. Beyond that room is the exhibition.
There's a small bathhouse where miners used to wash after their shift underground. You can see that in the building directly to the north of the engine house. The boiler has gone from there now, but there are lines of tin baths on the stone floor.
There's a display of early mining tools from the days before mechanisation. You can find that in a small L-shaped building in the middle of the northern boundary of the site. It's incredible to think how miners were able to use hand implements to cut through rock.
The vehicle shed, where you can find wagons of different sizes, along with some of the hi-tech cutting machines that were in use until the mine closed, is in the southwest corner of the site, and can be accessed via a covered walkway.
There is a field with ponies, which are always popular with children, on the north-eastern boundary of the site, not approached via a covered walkway.
The other building to mention is the education centre. This is where school groups go when they visit the mine, but it's also accessible to the public as it contains a library and small gift shop. The centre is connected to the ticket office via a short section of covered walkway.`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 28, quote: "As there are clear signposts all along the way, you don't even need to take a map with you... The castle's now just a pile of stones but it's a great place to take photos" },
        { questionNumber: 12, timestampSeconds: 36, quote: "As there are clear signposts all along the way, you don't even need to take a map with you... The castle's now just a pile of stones but it's a great place to take photos" },
        { questionNumber: 13, timestampSeconds: 52, quote: "the tower that's situated where there was once a seventeenth century hunting lodge... brings you back down to the starting point" },
        { questionNumber: 14, timestampSeconds: 60, quote: "the tower that's situated where there was once a seventeenth century hunting lodge... brings you back down to the starting point" },
        { questionNumber: 15, timestampSeconds: 88, quote: 'Beyond that room is the exhibition.' },
        { questionNumber: 16, timestampSeconds: 102, quote: 'directly to the north of the engine house' },
        { questionNumber: 17, timestampSeconds: 116, quote: 'small L-shaped building in the middle of the northern boundary of the site' },
        { questionNumber: 18, timestampSeconds: 128, quote: 'in the southwest corner of the site, and can be accessed via a covered walkway' },
        { questionNumber: 19, timestampSeconds: 140, quote: 'on the north-eastern boundary of the site, not approached via a covered walkway' },
        { questionNumber: 20, timestampSeconds: 78, quote: 'The centre is connected to the ticket office via a short section of covered walkway.' },
      ],
    },
    {
      id: 'c21-l2-p3',
      partNumber: 3,
      title: 'Part 3: Food Safety & New Product Development',
      context: 'Nadia and Fergus discuss their food safety sessions, a food fraud project, and their new food product development project with their tutor.',
      audioUrl: '/audio/listening/c21_test2_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `TUTOR: Thanks for coming along, Nadia and Fergus. So this is a chance for you to give us some feedback about different aspects of your course. What would you like to begin with?
NADIA: I've enjoyed the sessions on food safety. There was some information there that I found really surprising, although some was stuff I knew already, like the rise in rates of obesity.
FERGUS: Yeah, that's been in the news a lot. But I hadn't realised that unsafe food causes more than 200 different diseases.
NADIA: No, I'd no idea it was that many. And speaking of diseases, I knew resistance to antibiotics is on the increase, but I didn't know why...
FERGUS: ...that it's partly because when animals are treated with antibiotics then consumed by humans, the antibiotics get into the food chain. I had no idea about that either.
NADIA: Then the sessions provided a lot of information about plastic pollution from food packaging in the ocean, but I think that most of us were already aware of that.
FERGUS: Yeah. But I thought we could have done more on how much food is thrown away unnecessarily through fear of it being out of date, that was only mentioned in passing.
TUTOR: OK, I'll bear that in mind. What did you think about the sessions from visiting lecturers, Fergus?
FERGUS: For me the most interesting one was about that project to prevent companies giving incorrect information to consumers about food.
TUTOR: Ah, food fraud, yes.
FERGUS: I thought it was really good to address a problem that's faced by so many different groups – people with special religious rules, as well as vegetarians and vegans.
NADIA: And those with allergies.
FERGUS: Yeah. And another thing, we've had effective ways of analysing DNA for some time now and these can easily be applied to analysing food. But what the researchers succeeded in doing was to ensure that these tests were carried out at different stages in the food's journey from the producer to the consumer.
NADIA: So they knew that the food actually came from the place it was supposed to, and had the ingredients it was meant to.
FERGUS: Exactly. So customers can be confident about what they buy.
NADIA: And the researchers had a good system for publicising their findings too.
FERGUS: Well, I thought there were some problems with that, actually.
TUTOR: OK. And do you have any recommendations for new topics that we could include in the course?
NADIA: Well, I'm interested in how crop yields can be increased without damaging the environment.
FERGUS: But we've already done quite a bit on that – but not so much on the seafood industry, where stocks are in danger of being overexploited as a food source unless we can find ways of keeping stocks up.
NADIA: Yes, that'd be a good topic. And I'm interested in the idea of a personalised approach to diet, now we have the technology to analyse exactly what individuals need.
FERGUS: That sounds more like a medical topic than food science.
NADIA: OK. What about sessions on the variety of food and eating habits around the world? That's very relevant nowadays.
FERGUS: Yes, I think the whole class would be interested in that.
NADIA: Then there's technological stuff, things like 3D printing of food and smart packaging.
FERGUS: Mmm – maybe too specialist.

TUTOR: Now, I'm particularly interested in your project – the one where you developed a new food product. So talk me through the stages... first you had to decide on your initial aim.
FERGUS: We decided we wanted to create something people could eat on the go rather than in a restaurant.
NADIA: Yeah so we chose falafel, which was originally a Middle Eastern snack.
FERGUS: We made up our minds about that pretty quickly. I know some students found it a lot harder to choose, and wasted a lot of time.
NADIA: Then we had to do the literature review. We hadn't done one of these before so the handout with advice for the project was very useful here.
FERGUS: Yes, especially the advice on how to present the information. Then product development, actually deciding what we'd use to make the falafel, and for me the interesting thing about that was that we wanted it to be something a bit different from an ordinary falafel.
NADIA: We really made the right choice when we finally decided to use jackfruit, even though it wasn't something that either of us had ever tasted before.
FERGUS: Yeah, like the name tells you, it's a fruit but actually it's really good in savoury dishes. The product production, working out how to make the falafel, was harder than I expected because I'd never made them before.
NADIA: It was mostly trial and error. We started off with the basic recipe and then experimented and when it went wrong...
FERGUS: ...which it did a lot of the time...
NADIA: ...we just moved on and kept adapting it and in the end it turned out fine and we had a lot of fun.
FERGUS: We did!
TUTOR: Thank you. Well, your project was a very good ....`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 16, quote: "unsafe food causes more than 200 different diseases... when animals are treated with antibiotics then consumed by humans, the antibiotics get into the food chain. I had no idea about that either." },
        { questionNumber: 22, timestampSeconds: 26, quote: "unsafe food causes more than 200 different diseases... when animals are treated with antibiotics then consumed by humans, the antibiotics get into the food chain. I had no idea about that either." },
        { questionNumber: 23, timestampSeconds: 44, quote: "address a problem that's faced by so many different groups – people with special religious rules, as well as vegetarians and vegans... tests were carried out at different stages in the food's journey" },
        { questionNumber: 24, timestampSeconds: 54, quote: "address a problem that's faced by so many different groups – people with special religious rules, as well as vegetarians and vegans... tests were carried out at different stages in the food's journey" },
        { questionNumber: 25, timestampSeconds: 68, quote: "seafood industry, where stocks are in danger of being overexploited... Yes, that'd be a good topic. ... What about sessions on the variety of food and eating habits around the world? ... Yes, I think the whole class would be interested in that." },
        { questionNumber: 26, timestampSeconds: 78, quote: "seafood industry, where stocks are in danger of being overexploited... Yes, that'd be a good topic. ... What about sessions on the variety of food and eating habits around the world? ... Yes, I think the whole class would be interested in that." },
        { questionNumber: 27, timestampSeconds: 98, quote: 'We made up our minds about that pretty quickly.' },
        { questionNumber: 28, timestampSeconds: 112, quote: 'the handout with advice for the project was very useful here. Yes, especially the advice on how to present the information.' },
        { questionNumber: 29, timestampSeconds: 126, quote: 'we finally decided to use jackfruit, even though it wasn\'t something that either of us had ever tasted before.' },
        { questionNumber: 30, timestampSeconds: 140, quote: 'in the end it turned out fine and we had a lot of fun. We did!' },
      ],
    },
    {
      id: 'c21-l2-p4',
      partNumber: 4,
      title: 'Part 4: Challenges Facing the Cruise Ship Industry',
      context: 'A presentation on the challenges of overtourism, public perception, and emerging solutions in the cruise ship industry.',
      audioUrl: '/audio/listening/c21_test2_part4.mp3',
      containsIntroPauses: false,
      introPauseSeconds: 45,
      checkPauseSeconds: 30,
      transcript: `For my presentation today I'm going to talk about some of the issues facing the cruise ship industry and then some ways these can be addressed. The cruise ship industry has partly been responsible for the effects of overtourism in recent decades. Overtourism occurs in places where excessive numbers of tourists cause significant problems. Pollution, for example, is among the greatest threats to many popular tourist destinations.

Of course, for many places it's a difficult balance to achieve. They want to promote their city or island as a desirable tourist destination, but at the same time, are unable to cope with thousands of cruise ship passengers on a daily basis. The trouble is, excessive tourism is destroying the beauty spots and places of interest that people come to visit. Several cities, such as Barcelona, have responded by imposing a tax which all visitors to the city from cruise ships have to pay. But as it's only a couple of euros, many green campaigners think it won't deter enough people to make any difference.

Bruges is another city which became impossible to navigate at times because of the huge numbers of cruise passengers arriving on day trips from the port of Zeebrugge. The city was becoming like a 'theme park', with shops only catering for tourists, selling chocolate, which Belgium is famous for, and other souvenirs. The local council took action to limit cruise passengers to a more manageable level.

Dubrovnik had to limit the numbers of cruise ships after it became extremely popular as a cruise ship destination when it featured in a hugely successful TV series. What it does now is control the timing of all cruise ship entries to the city's port. However, many people feel this measure does not go far enough.

Cruise ships may be unpopular in some of their destinations but they also have an image problem. They've always been perceived as a safe holiday for the elderly, with not much on offer for families or young couples. A recent survey showed that cost is also a major factor in putting younger groups off going on a cruise. But what they don't realise is that compared to other types of package holidays, cruises can actually be good value, as all activities and drinks are often included. And another perception is that cruises have lots of rules about what to wear and how to behave. But these days, most cruises are no longer very formal and behind the times.

So what solutions are there for cruise lines to overcome some of these problems? How can they appeal to younger customers? Well one selling point is that cruise ships are becoming more sustainable. New ships are built with hybrid engines with large batteries which means ships do not have to keep their engines running while docked.

Cruise lines are also designing ships specially for those in the age range of 21 to 45. The décor in these feels contemporary and there are a range of activities on board that you wouldn't find on a more traditional cruise. There's even a boxing ring on one ship, and most offer diving expeditions. But there's also a huge focus on well-being with a variety of sessions of different kinds.

Food is always a very important part of any cruise and cruise ships have had to radically update their menus to suit the tastes of their younger customers. Vegan dishes are standard, for example. The restaurants on board have also gone paperless with menus available on screen.

Unlike older generations who went on cruises largely to get away from everything, younger people expect to be able to keep in touch with friends and family. Many people going on longer cruises also spend time working, so companies have to guarantee wifi that can be relied upon at all times.

My grandparents used to love looking through cruise brochures, even when they weren't planning on going on a cruise. Until very recently TV ads for cruises always felt dated and aimed at retirees. Cruise lines have been slow to adopt the power of social media but that's all changing. Leading cruise lines now employ top agencies to produce first rate videos for social media channels.

It will be interesting to see whether ...`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 22, quote: 'Pollution, for example, is among the greatest threats to many popular tourist destinations.' },
        { questionNumber: 32, timestampSeconds: 38, quote: 'imposing a tax which all visitors to the city from cruise ships have to pay.' },
        { questionNumber: 33, timestampSeconds: 56, quote: 'shops only catering for tourists, selling chocolate, which Belgium is famous for, and other souvenirs.' },
        { questionNumber: 34, timestampSeconds: 74, quote: "control the timing of all cruise ship entries to the city's port." },
        { questionNumber: 35, timestampSeconds: 94, quote: 'survey showed that cost is also a major factor in putting younger groups off' },
        { questionNumber: 36, timestampSeconds: 106, quote: 'another perception is that cruises have lots of rules about what to wear and how to behave.' },
        { questionNumber: 37, timestampSeconds: 124, quote: 'There\'s even a boxing ring on one ship, and most offer diving expeditions.' },
        { questionNumber: 38, timestampSeconds: 138, quote: 'Vegan dishes are standard, for example.' },
        { questionNumber: 39, timestampSeconds: 148, quote: 'so companies have to guarantee wifi that can be relied upon at all times.' },
        { questionNumber: 40, timestampSeconds: 160, quote: 'produce first rate videos for social media channels.' },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // -------------------------------------------------------------
    // PART 1: Questions 1-10 (Table Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g1',
      partNumber: 1,
      questionType: 'table_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the table below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      tableData: {
        headers: ['Course', 'Date', 'Cost', 'Notes'],
        rows: [
          {
            cells: [
              { content: 'Vietnamese food' },
              { content: '[[1]]', isGap: true, questionNumber: 1 },
              { content: '£59' },
              { content: 'It provides information on the use of herbs.\nThere are no places at present.' },
            ],
          },
          {
            cells: [
              { content: 'Bread making' },
              { content: '20 March' },
              { content: '£ [[2]]', isGap: true, questionNumber: 2 },
              { content: 'There is also an extra charge for ingredients.\nParticipants make white bread, sourdough and [[3]].' },
            ],
          },
          {
            cells: [
              { content: 'Face massage' },
              { content: '23 February' },
              { content: '£35' },
              { content: 'The teacher trained in [[4]].\nBring a [[5]].' },
            ],
          },
          {
            cells: [
              { content: 'Candle making' },
              { content: '[[6]]', isGap: true, questionNumber: 6 },
              { content: '£52' },
              { content: 'Only [[7]] ingredients are used.\nThe candles can be used as presents.' },
            ],
          },
          {
            cells: [
              { content: 'Silk painting' },
              { content: '18 May' },
              { content: '£ [[8]]', isGap: true, questionNumber: 8 },
              { content: 'Bring an apron or old [[9]].' },
            ],
          },
          {
            cells: [
              { content: 'DIY for beginners' },
              { content: '24 February' },
              { content: '£125' },
              { content: 'Learn how to:\n• use a drill, saw and [[10]]\n• put up a shelf.' },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'c21-l2-q1',
          questionNumber: 1,
          prompt: 'Vietnamese food — Date: ________',
          answerKey: '13 January',
          acceptedAlternatives: [
            '13 January',
            '13th January',
            '13th of January',
            '13 of January',
            'the 13th of January',
            'the 13th January',
            '13.01',
            '13.1',
            'January 13',
          ],
          explanation: "The man confirms: 'I think that was on the 13th of January... Yes, you're right about the date, but it's 59 pounds actually.'",
          transcriptExcerpt: "I think that was on the 13th of January... Yes, you're right about the date",
          audioTimestampSeconds: 22,
        },
        {
          id: 'c21-l2-q2',
          questionNumber: 2,
          prompt: 'Bread making — Cost: £ ________',
          answerKey: '48',
          acceptedAlternatives: ['48', 'forty-eight'],
          explanation: "The man confirms: 'The actual cost is £48 but then there's an extra charge as well as that for the ingredients'.",
          transcriptExcerpt: "The actual cost is £48 but then there's an extra charge as well as that for the ingredients",
          audioTimestampSeconds: 42,
        },
        {
          id: 'c21-l2-q3',
          questionNumber: 3,
          prompt: 'Bread making — Participants make white bread, sourdough and ________',
          answerKey: 'pizza',
          acceptedAlternatives: ['pizza'],
          explanation: "The man says: 'they make white bread and then they make sourdough... and they learn how to make pizza'.",
          transcriptExcerpt: 'they make white bread and then they make sourdough, that seems to be very fashionable at present, and they learn how to make pizza',
          audioTimestampSeconds: 52,
        },
        {
          id: 'c21-l2-q4',
          questionNumber: 4,
          prompt: 'Face massage — The teacher trained in ________',
          answerKey: 'India',
          acceptedAlternatives: ['India'],
          explanation: "The man states: 'the type of massage done is a traditional technique used in India and she actually did her training there.'",
          transcriptExcerpt: 'technique used in India and she actually did her training there',
          audioTimestampSeconds: 68,
        },
        {
          id: 'c21-l2-q5',
          questionNumber: 5,
          prompt: 'Face massage — Bring a ________',
          answerKey: 'mirror',
          acceptedAlternatives: ['mirror'],
          explanation: "The man explains: 'You practise it on yourself so you have to take a mirror to the class, so you can see what you're doing.'",
          transcriptExcerpt: "You practise it on yourself so you have to take a mirror to the class, so you can see what you're doing.",
          audioTimestampSeconds: 76,
        },
        {
          id: 'c21-l2-q6',
          questionNumber: 6,
          prompt: 'Candle making — Date: ________',
          answerKey: '6 April',
          acceptedAlternatives: [
            '6 April',
            '6th April',
            '6th of April',
            '6 of April',
            'the 6th of April',
            'the 6th April',
            '06.04',
            '6.4',
            'April 6',
          ],
          explanation: "The man confirms: 'Yes that's sometime in April, I think. Let me check ... yes, it's on the 6th.'",
          transcriptExcerpt: "sometime in April, I think. Let me check ... yes, it's on the 6th.",
          audioTimestampSeconds: 84,
        },
        {
          id: 'c21-l2-q7',
          questionNumber: 7,
          prompt: 'Candle making — Only ________ ingredients are used',
          answerKey: 'natural',
          acceptedAlternatives: ['natural'],
          explanation: "The man notes: 'I think one reason why people like it is because the candles are all made out of natural products.'",
          transcriptExcerpt: 'candles are all made out of natural products.',
          audioTimestampSeconds: 92,
        },
        {
          id: 'c21-l2-q8',
          questionNumber: 8,
          prompt: 'Silk painting — Cost: £ ________',
          answerKey: '67.50',
          acceptedAlternatives: ['67.50', '67.5', 'sixty-seven fifty'],
          explanation: "The man states: 'It's £67.50, which is really good value I think'.",
          transcriptExcerpt: "It's £67.50, which is really good value I think",
          audioTimestampSeconds: 104,
        },
        {
          id: 'c21-l2-q9',
          questionNumber: 9,
          prompt: 'Silk painting — Bring an apron or old ________',
          answerKey: 'shirt',
          acceptedAlternatives: ['shirt'],
          explanation: "The man advises: 'everyone has to bring something to protect their clothing, like an apron if you've got one, or a shirt that you don't use any more'.",
          transcriptExcerpt: "like an apron if you've got one, or a shirt that you don't use any more, because the dye can really stain your clothes.",
          audioTimestampSeconds: 112,
        },
        {
          id: 'c21-l2-q10',
          questionNumber: 10,
          prompt: 'DIY for beginners — Learn how to use a drill, saw and ________',
          answerKey: 'hammer',
          acceptedAlternatives: ['hammer'],
          explanation: "The woman and man confirm: 'I even need to learn how to use a hammer because I always end up hitting my fingers. Yes, you'll do that too.'",
          transcriptExcerpt: 'learn how to use a hammer because I always end up hitting my fingers. Yes, you\'ll do that too.',
          audioTimestampSeconds: 126,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 11-12 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 11 and 12',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO pieces of advice are given about the Marsden Coastal Walk?',
      startQuestionNumber: 11,
      endQuestionNumber: 12,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'Stop for lunch in an ancient town.' },
        { key: 'B', text: "Don't miss the ruins of a certain building." },
        { key: 'C', text: 'Catch a boat to the start of this walk.' },
        { key: 'D', text: 'Be careful of the steep and rocky paths.' },
        { key: 'E', text: "Don't worry about getting lost." },
      ],
      questions: [
        {
          id: 'c21-l2-q11',
          questionNumber: 11,
          prompt: 'Which TWO pieces of advice are given about the Marsden Coastal Walk?',
          options: [
            { key: 'A', text: 'Stop for lunch in an ancient town.' },
            { key: 'B', text: "Don't miss the ruins of a certain building." },
            { key: 'C', text: 'Catch a boat to the start of this walk.' },
            { key: 'D', text: 'Be careful of the steep and rocky paths.' },
            { key: 'E', text: "Don't worry about getting lost." },
          ],
          answerKey: ['B', 'E'],
          explanation: "The guide says: 'As there are clear signposts all along the way, you don't even need to take a map with you' (E), and 'The castle's now just a pile of stones but it's a great place to take photos... so don't miss that building!' (B).",
          transcriptExcerpt: "As there are clear signposts all along the way, you don't even need to take a map with you... The castle's now just a pile of stones but it's a great place to take photos",
          audioTimestampSeconds: 28,
        },
        {
          id: 'c21-l2-q12',
          questionNumber: 12,
          prompt: 'Which TWO pieces of advice are given about the Marsden Coastal Walk?',
          options: [
            { key: 'A', text: 'Stop for lunch in an ancient town.' },
            { key: 'B', text: "Don't miss the ruins of a certain building." },
            { key: 'C', text: 'Catch a boat to the start of this walk.' },
            { key: 'D', text: 'Be careful of the steep and rocky paths.' },
            { key: 'E', text: "Don't worry about getting lost." },
          ],
          answerKey: ['B', 'E'],
          explanation: "The guide says: 'As there are clear signposts all along the way, you don't even need to take a map with you' (E), and 'The castle's now just a pile of stones but it's a great place to take photos... so don't miss that building!' (B).",
          transcriptExcerpt: "As there are clear signposts all along the way, you don't even need to take a map with you... The castle's now just a pile of stones but it's a great place to take photos",
          audioTimestampSeconds: 36,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 13-14 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 13 and 14',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO things are said about the Melby Heritage Walk?',
      startQuestionNumber: 13,
      endQuestionNumber: 14,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'This walk is mostly downhill.' },
        { key: 'B', text: 'The paths can get busy during the day.' },
        { key: 'C', text: 'This is a circular walk.' },
        { key: 'D', text: 'A tower stands on the site of an older structure.' },
        { key: 'E', text: 'There are far-reaching views the whole way.' },
      ],
      questions: [
        {
          id: 'c21-l2-q13',
          questionNumber: 13,
          prompt: 'Which TWO things are said about the Melby Heritage Walk?',
          options: [
            { key: 'A', text: 'This walk is mostly downhill.' },
            { key: 'B', text: 'The paths can get busy during the day.' },
            { key: 'C', text: 'This is a circular walk.' },
            { key: 'D', text: 'A tower stands on the site of an older structure.' },
            { key: 'E', text: 'There are far-reaching views the whole way.' },
          ],
          answerKey: ['C', 'D'],
          explanation: "The guide notes: 'climb the tower that's situated where there was once a seventeenth century hunting lodge' (D) and 'brings you back down to the starting point – the car park at Melby Coal Mine' (C).",
          transcriptExcerpt: "the tower that's situated where there was once a seventeenth century hunting lodge... brings you back down to the starting point – the car park at Melby Coal Mine.",
          audioTimestampSeconds: 52,
        },
        {
          id: 'c21-l2-q14',
          questionNumber: 14,
          prompt: 'Which TWO things are said about the Melby Heritage Walk?',
          options: [
            { key: 'A', text: 'This walk is mostly downhill.' },
            { key: 'B', text: 'The paths can get busy during the day.' },
            { key: 'C', text: 'This is a circular walk.' },
            { key: 'D', text: 'A tower stands on the site of an older structure.' },
            { key: 'E', text: 'There are far-reaching views the whole way.' },
          ],
          answerKey: ['C', 'D'],
          explanation: "The guide notes: 'climb the tower that's situated where there was once a seventeenth century hunting lodge' (D) and 'brings you back down to the starting point – the car park at Melby Coal Mine' (C).",
          transcriptExcerpt: "the tower that's situated where there was once a seventeenth century hunting lodge... brings you back down to the starting point – the car park at Melby Coal Mine.",
          audioTimestampSeconds: 60,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 15-20 (Plan, Map, Diagram Labelling)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g4',
      partNumber: 2,
      questionType: 'plan_map_diagram_labelling',
      title: 'Questions 15–20',
      instructions: 'Label the map below.\nWrite the correct letter, A–I, next to Questions 15–20.',
      startQuestionNumber: 15,
      endQuestionNumber: 20,
      mapData: {
        imageUrl: 'https://res.cloudinary.com/pkwpxicd/image/upload/f_auto,q_auto/Screenshot_2026-10-10_195243',
        caption: 'Melby Coal Mine',
      },
      optionsList: [
        { key: 'A', text: 'Location A' },
        { key: 'B', text: 'Location B' },
        { key: 'C', text: 'Location C' },
        { key: 'D', text: 'Location D' },
        { key: 'E', text: 'Location E' },
        { key: 'F', text: 'Location F' },
        { key: 'G', text: 'Location G' },
        { key: 'H', text: 'Location H' },
        { key: 'I', text: 'Location I' },
      ],
      questions: [
        {
          id: 'c21-l2-q15',
          questionNumber: 15,
          prompt: 'Exhibition',
          answerKey: 'F',
          explanation: "The guide explains: 'Go through the ticket office to an area where there are lockers... Beyond that room is the exhibition' -> Building F.",
          transcriptExcerpt: 'Go through the ticket office to an area where there are lockers to leave heavy bags in, and where you can borrow raincoats. Beyond that room is the exhibition.',
          audioTimestampSeconds: 88,
        },
        {
          id: 'c21-l2-q16',
          questionNumber: 16,
          prompt: 'Baths',
          answerKey: 'B',
          explanation: "The guide says: 'There's a small bathhouse where miners used to wash... You can see that in the building directly to the north of the engine house' -> Building B.",
          transcriptExcerpt: 'There\'s a small bathhouse where miners used to wash after their shift underground. You can see that in the building directly to the north of the engine house.',
          audioTimestampSeconds: 102,
        },
        {
          id: 'c21-l2-q17',
          questionNumber: 17,
          prompt: 'Tools',
          answerKey: 'D',
          explanation: "The guide explains: 'There's a display of early mining tools... You can find that in a small L-shaped building in the middle of the northern boundary of the site' -> Building D.",
          transcriptExcerpt: 'There\'s a display of early mining tools from the days before mechanisation. You can find that in a small L-shaped building in the middle of the northern boundary of the site.',
          audioTimestampSeconds: 116,
        },
        {
          id: 'c21-l2-q18',
          questionNumber: 18,
          prompt: 'Vehicles',
          answerKey: 'A',
          explanation: "The guide notes: 'The vehicle shed... is in the southwest corner of the site, and can be accessed via a covered walkway' -> Building A.",
          transcriptExcerpt: 'The vehicle shed, where you can find wagons of different sizes... is in the southwest corner of the site, and can be accessed via a covered walkway.',
          audioTimestampSeconds: 128,
        },
        {
          id: 'c21-l2-q19',
          questionNumber: 19,
          prompt: 'Ponies',
          answerKey: 'H',
          explanation: "The guide points out: 'There is a field with ponies... on the north-eastern boundary of the site, not approached via a covered walkway' -> Field H.",
          transcriptExcerpt: 'There is a field with ponies, which are always popular with children, on the north-eastern boundary of the site, not approached via a covered walkway.',
          audioTimestampSeconds: 140,
        },
        {
          id: 'c21-l2-q20',
          questionNumber: 20,
          prompt: 'Education centre',
          answerKey: 'E',
          explanation: "The guide states: 'The other building to mention is the education centre... The centre is connected to the ticket office via a short section of covered walkway' -> Building E.",
          transcriptExcerpt: 'The other building to mention is the education centre... The centre is connected to the ticket office via a short section of covered walkway.',
          audioTimestampSeconds: 78,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 21-22 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO facts in the sessions on food safety were new information for Nadia and Fergus?',
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'the amount of plastic in the ocean' },
        { key: 'B', text: 'the number of diseases caused by contaminated food' },
        { key: 'C', text: 'the amount of food that is wasted' },
        { key: 'D', text: 'the number of people who are obese' },
        { key: 'E', text: 'the result of treating animals with antibiotics' },
      ],
      questions: [
        {
          id: 'c21-l2-q21',
          questionNumber: 21,
          prompt: 'Which TWO facts in the sessions on food safety were new information for Nadia and Fergus?',
          options: [
            { key: 'A', text: 'the amount of plastic in the ocean' },
            { key: 'B', text: 'the number of diseases caused by contaminated food' },
            { key: 'C', text: 'the amount of food that is wasted' },
            { key: 'D', text: 'the number of people who are obese' },
            { key: 'E', text: 'the result of treating animals with antibiotics' },
          ],
          answerKey: ['B', 'E'],
          explanation: "Fergus says: 'I hadn't realised that unsafe food causes more than 200 different diseases' (B). Nadia adds: 'I'd no idea it was that many.' Fergus continues: 'when animals are treated with antibiotics then consumed by humans, the antibiotics get into the food chain. I had no idea about that either' (E).",
          transcriptExcerpt: "FERGUS: I hadn't realised that unsafe food causes more than 200 different diseases. NADIA: No, I'd no idea it was that many... FERGUS: ...when animals are treated with antibiotics then consumed by humans, the antibiotics get into the food chain. I had no idea about that either.",
          audioTimestampSeconds: 16,
        },
        {
          id: 'c21-l2-q22',
          questionNumber: 22,
          prompt: 'Which TWO facts in the sessions on food safety were new information for Nadia and Fergus?',
          options: [
            { key: 'A', text: 'the amount of plastic in the ocean' },
            { key: 'B', text: 'the number of diseases caused by contaminated food' },
            { key: 'C', text: 'the amount of food that is wasted' },
            { key: 'D', text: 'the number of people who are obese' },
            { key: 'E', text: 'the result of treating animals with antibiotics' },
          ],
          answerKey: ['B', 'E'],
          explanation: "Fergus says: 'I hadn't realised that unsafe food causes more than 200 different diseases' (B). Nadia adds: 'I'd no idea it was that many.' Fergus continues: 'when animals are treated with antibiotics then consumed by humans, the antibiotics get into the food chain. I had no idea about that either' (E).",
          transcriptExcerpt: "FERGUS: I hadn't realised that unsafe food causes more than 200 different diseases. NADIA: No, I'd no idea it was that many... FERGUS: ...when animals are treated with antibiotics then consumed by humans, the antibiotics get into the food chain. I had no idea about that either.",
          audioTimestampSeconds: 26,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 23-24 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO features of a project aiming to prevent food fraud impressed Fergus?',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'the new technology it used' },
        { key: 'B', text: 'the publicity it received' },
        { key: 'C', text: 'the use of multiple tests on food items' },
        { key: 'D', text: 'the variety of dietary requirements included' },
        { key: 'E', text: 'the way information was made widely accessible' },
      ],
      questions: [
        {
          id: 'c21-l2-q23',
          questionNumber: 23,
          prompt: 'Which TWO features of a project aiming to prevent food fraud impressed Fergus?',
          options: [
            { key: 'A', text: 'the new technology it used' },
            { key: 'B', text: 'the publicity it received' },
            { key: 'C', text: 'the use of multiple tests on food items' },
            { key: 'D', text: 'the variety of dietary requirements included' },
            { key: 'E', text: 'the way information was made widely accessible' },
          ],
          answerKey: ['C', 'D'],
          explanation: "Fergus notes: 'I thought it was really good to address a problem that's faced by so many different groups – people with special religious rules, as well as vegetarians and vegans' (D), and 'what the researchers succeeded in doing was to ensure that these tests were carried out at different stages in the food's journey' (C).",
          transcriptExcerpt: "FERGUS: I thought it was really good to address a problem that's faced by so many different groups – people with special religious rules, as well as vegetarians and vegans... But what the researchers succeeded in doing was to ensure that these tests were carried out at different stages in the food's journey",
          audioTimestampSeconds: 44,
        },
        {
          id: 'c21-l2-q24',
          questionNumber: 24,
          prompt: 'Which TWO features of a project aiming to prevent food fraud impressed Fergus?',
          options: [
            { key: 'A', text: 'the new technology it used' },
            { key: 'B', text: 'the publicity it received' },
            { key: 'C', text: 'the use of multiple tests on food items' },
            { key: 'D', text: 'the variety of dietary requirements included' },
            { key: 'E', text: 'the way information was made widely accessible' },
          ],
          answerKey: ['C', 'D'],
          explanation: "Fergus notes: 'I thought it was really good to address a problem that's faced by so many different groups – people with special religious rules, as well as vegetarians and vegans' (D), and 'what the researchers succeeded in doing was to ensure that these tests were carried out at different stages in the food's journey' (C).",
          transcriptExcerpt: "FERGUS: I thought it was really good to address a problem that's faced by so many different groups – people with special religious rules, as well as vegetarians and vegans... But what the researchers succeeded in doing was to ensure that these tests were carried out at different stages in the food's journey",
          audioTimestampSeconds: 54,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 25-26 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g7',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 25 and 26',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO topics do both students recommend should be included in the course?',
      startQuestionNumber: 25,
      endQuestionNumber: 26,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'sustainable fishing' },
        { key: 'B', text: 'targeted nutrition' },
        { key: 'C', text: 'global differences in consumption' },
        { key: 'D', text: 'sustainable agriculture' },
        { key: 'E', text: 'digital technology and food' },
      ],
      questions: [
        {
          id: 'c21-l2-q25',
          questionNumber: 25,
          prompt: 'Which TWO topics do both students recommend should be included in the course?',
          options: [
            { key: 'A', text: 'sustainable fishing' },
            { key: 'B', text: 'targeted nutrition' },
            { key: 'C', text: 'global differences in consumption' },
            { key: 'D', text: 'sustainable agriculture' },
            { key: 'E', text: 'digital technology and food' },
          ],
          answerKey: ['A', 'C'],
          explanation: "Fergus suggests: 'the seafood industry, where stocks are in danger of being overexploited... unless we can find ways of keeping stocks up. NADIA: Yes, that'd be a good topic' (sustainable fishing, A). Nadia asks: 'What about sessions on the variety of food and eating habits around the world? FERGUS: Yes, I think the whole class would be interested in that' (global differences in consumption, C).",
          transcriptExcerpt: "FERGUS: ...seafood industry, where stocks are in danger of being overexploited... NADIA: Yes, that'd be a good topic... NADIA: What about sessions on the variety of food and eating habits around the world? FERGUS: Yes, I think the whole class would be interested in that.",
          audioTimestampSeconds: 68,
        },
        {
          id: 'c21-l2-q26',
          questionNumber: 26,
          prompt: 'Which TWO topics do both students recommend should be included in the course?',
          options: [
            { key: 'A', text: 'sustainable fishing' },
            { key: 'B', text: 'targeted nutrition' },
            { key: 'C', text: 'global differences in consumption' },
            { key: 'D', text: 'sustainable agriculture' },
            { key: 'E', text: 'digital technology and food' },
          ],
          answerKey: ['A', 'C'],
          explanation: "Fergus suggests: 'the seafood industry, where stocks are in danger of being overexploited... unless we can find ways of keeping stocks up. NADIA: Yes, that'd be a good topic' (sustainable fishing, A). Nadia asks: 'What about sessions on the variety of food and eating habits around the world? FERGUS: Yes, I think the whole class would be interested in that' (global differences in consumption, C).",
          transcriptExcerpt: "FERGUS: ...seafood industry, where stocks are in danger of being overexploited... NADIA: Yes, that'd be a good topic... NADIA: What about sessions on the variety of food and eating habits around the world? FERGUS: Yes, I think the whole class would be interested in that.",
          audioTimestampSeconds: 78,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 27-30 (Matching / Flow-chart Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g8',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 27–30',
      instructions: 'Complete the flow-chart below.\nChoose FOUR answers from the box and write the correct letter, A–F, next to Questions 27–30.',
      startQuestionNumber: 27,
      endQuestionNumber: 30,
      optionsList: [
        { key: 'A', text: 'This was challenging but enjoyable.' },
        { key: 'B', text: 'This led to some disagreement.' },
        { key: 'C', text: 'This was easy to decide on.' },
        { key: 'D', text: 'This was helped by the guidelines provided.' },
        { key: 'E', text: 'This seemed like an unnecessary stage.' },
        { key: 'F', text: 'This involved selecting a new ingredient.' },
      ],
      questions: [
        {
          id: 'c21-l2-q27',
          questionNumber: 27,
          prompt: 'Initial aim',
          answerKey: 'C',
          explanation: "Fergus states: 'We made up our minds about that pretty quickly. I know some students found it a lot harder to choose, and wasted a lot of time' (C).",
          transcriptExcerpt: 'We made up our minds about that pretty quickly. I know some students found it a lot harder to choose, and wasted a lot of time.',
          audioTimestampSeconds: 98,
        },
        {
          id: 'c21-l2-q28',
          questionNumber: 28,
          prompt: 'Literature review',
          answerKey: 'D',
          explanation: "Nadia and Fergus note: 'the handout with advice for the project was very useful here. Yes, especially the advice on how to present the information' (D).",
          transcriptExcerpt: 'the handout with advice for the project was very useful here. Yes, especially the advice on how to present the information.',
          audioTimestampSeconds: 112,
        },
        {
          id: 'c21-l2-q29',
          questionNumber: 29,
          prompt: 'Product development',
          answerKey: 'F',
          explanation: "Nadia states: 'We really made the right choice when we finally decided to use jackfruit, even though it wasn't something that either of us had ever tasted before' (F).",
          transcriptExcerpt: "We really made the right choice when we finally decided to use jackfruit, even though it wasn't something that either of us had ever tasted before.",
          audioTimestampSeconds: 126,
        },
        {
          id: 'c21-l2-q30',
          questionNumber: 30,
          prompt: 'Product production',
          answerKey: 'A',
          explanation: "Nadia and Fergus conclude: 'we just moved on and kept adapting it and in the end it turned out fine and we had a lot of fun. We did!' (A).",
          transcriptExcerpt: 'we just moved on and kept adapting it and in the end it turned out fine and we had a lot of fun. We did!',
          audioTimestampSeconds: 140,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 4: Questions 31-40 (Notes Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l2-g9',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Challenges facing the cruise ship industry

Problems with overtourism
• [[31]] is one of the worst problems.
• A tourist [[32]] is being introduced in some cities to reduce numbers, e.g. Barcelona.
• Bruges: action was taken to limit day trips from the nearby port because the city was becoming a 'theme park' (e.g. many shops were only stocking [[33]] and souvenirs).
• Dubrovnik: limits the number of tourists by managing the [[34]] of cruise ship arrivals.

Problems of perception
• Cruises are generally associated with the elderly.
• There is an assumption about the [[35]] of cruises.
• People think there may be too many [[36]].

Solutions
Cruise lines are attracting younger customers by:
• becoming more sustainable e.g. using hybrid engines.
• having a wide range of activities e.g. boxing, [[37]] and well-being programmes.
• offering a diverse selection of food including [[38]] options.
• providing reliable [[39]].
• improving marketing on social media with high quality [[40]].`,
      questions: [
        {
          id: 'c21-l2-q31',
          questionNumber: 31,
          prompt: 'Problems with overtourism — ________ is one of the worst problems.',
          answerKey: 'Pollution',
          acceptedAlternatives: ['Pollution', 'pollution'],
          explanation: "The speaker explains: 'Pollution, for example, is among the greatest threats to many popular tourist destinations.'",
          transcriptExcerpt: 'Pollution, for example, is among the greatest threats to many popular tourist destinations.',
          audioTimestampSeconds: 22,
        },
        {
          id: 'c21-l2-q32',
          questionNumber: 32,
          prompt: 'A tourist ________ is being introduced in some cities to reduce numbers, e.g. Barcelona.',
          answerKey: 'tax',
          acceptedAlternatives: ['tax'],
          explanation: "The speaker states: 'Several cities, such as Barcelona, have responded by imposing a tax which all visitors to the city from cruise ships have to pay.'",
          transcriptExcerpt: 'Several cities, such as Barcelona, have responded by imposing a tax which all visitors to the city from cruise ships have to pay.',
          audioTimestampSeconds: 38,
        },
        {
          id: 'c21-l2-q33',
          questionNumber: 33,
          prompt: 'Bruges — many shops were only stocking ________ and souvenirs',
          answerKey: 'chocolate',
          acceptedAlternatives: ['chocolate'],
          explanation: "The speaker notes: 'shops only catering for tourists, selling chocolate, which Belgium is famous for, and other souvenirs.'",
          transcriptExcerpt: 'shops only catering for tourists, selling chocolate, which Belgium is famous for, and other souvenirs.',
          audioTimestampSeconds: 56,
        },
        {
          id: 'c21-l2-q34',
          questionNumber: 34,
          prompt: 'Dubrovnik — limits the number of tourists by managing the ________ of cruise ship arrivals.',
          answerKey: 'timing',
          acceptedAlternatives: ['timing'],
          explanation: "The speaker explains: 'What it does now is control the timing of all cruise ship entries to the city\'s port.'",
          transcriptExcerpt: "What it does now is control the timing of all cruise ship entries to the city's port.",
          audioTimestampSeconds: 74,
        },
        {
          id: 'c21-l2-q35',
          questionNumber: 35,
          prompt: 'There is an assumption about the ________ of cruises.',
          answerKey: 'cost',
          acceptedAlternatives: ['cost'],
          explanation: "The speaker observes: 'A recent survey showed that cost is also a major factor in putting younger groups off going on a cruise.'",
          transcriptExcerpt: 'A recent survey showed that cost is also a major factor in putting younger groups off going on a cruise.',
          audioTimestampSeconds: 94,
        },
        {
          id: 'c21-l2-q36',
          questionNumber: 36,
          prompt: 'People think there may be too many ________.',
          answerKey: 'rules',
          acceptedAlternatives: ['rules'],
          explanation: "The speaker notes: 'And another perception is that cruises have lots of rules about what to wear and how to behave.'",
          transcriptExcerpt: 'And another perception is that cruises have lots of rules about what to wear and how to behave.',
          audioTimestampSeconds: 106,
        },
        {
          id: 'c21-l2-q37',
          questionNumber: 37,
          prompt: 'having a wide range of activities e.g. boxing, ________ and well-being programmes.',
          answerKey: 'diving',
          acceptedAlternatives: ['diving'],
          explanation: "The speaker mentions: 'There\'s even a boxing ring on one ship, and most offer diving expeditions.'",
          transcriptExcerpt: "There's even a boxing ring on one ship, and most offer diving expeditions.",
          audioTimestampSeconds: 124,
        },
        {
          id: 'c21-l2-q38',
          questionNumber: 38,
          prompt: 'offering a diverse selection of food including ________ options.',
          answerKey: 'vegan',
          acceptedAlternatives: ['vegan', 'Vegan'],
          explanation: "The speaker explains: 'Vegan dishes are standard, for example.'",
          transcriptExcerpt: 'Vegan dishes are standard, for example.',
          audioTimestampSeconds: 138,
        },
        {
          id: 'c21-l2-q39',
          questionNumber: 39,
          prompt: 'providing reliable ________.',
          answerKey: 'wifi',
          acceptedAlternatives: ['wifi', 'wi-fi', 'wi fi'],
          explanation: "The speaker highlights: 'so companies have to guarantee wifi that can be relied upon at all times.'",
          transcriptExcerpt: 'so companies have to guarantee wifi that can be relied upon at all times.',
          audioTimestampSeconds: 148,
        },
        {
          id: 'c21-l2-q40',
          questionNumber: 40,
          prompt: 'improving marketing on social media with high quality ________.',
          answerKey: 'videos',
          acceptedAlternatives: ['videos'],
          explanation: "The speaker concludes: 'Leading cruise lines now employ top agencies to produce first rate videos for social media channels.'",
          transcriptExcerpt: 'Leading cruise lines now employ top agencies to produce first rate videos for social media channels.',
          audioTimestampSeconds: 160,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 21 Academic Listening Test 2',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      audioMode: 'part_audios',
      overallAudioUrl: '/audio/listening/c21_test2_complete.mp3',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c21_test2_part1.mp3', durationSeconds: 360 },
        { partNumber: 2, audioUrl: '/audio/listening/c21_test2_part2.mp3', durationSeconds: 340 },
        { partNumber: 3, audioUrl: '/audio/listening/c21_test2_part3.mp3', durationSeconds: 380 },
        { partNumber: 4, audioUrl: '/audio/listening/c21_test2_part4.mp3', durationSeconds: 390 },
      ],
    },
    parts,
    questionGroups,
  };
}

export function ingestCambridge21ListeningTest2(authorId?: string): {
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
} {
  const data = getCambridge21ListeningTest2Data();
  const errors = validateListeningTestVersion(data.parts, data.questionGroups);
  if (errors.length > 0) {
    throw new Error(`Cambridge 21 Listening Test 2 validation failed:\n- ${errors.join('\n- ')}`);
  }

  const resolvedAuthorId =
    authorId ||
    (db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any)?.id ||
    uuidv4();

  const now = new Date().toISOString();

  const existingTest = db
    .prepare("SELECT id, current_version_number FROM listening_tests WHERE title LIKE '%Cambridge%21%Listening%Test 2%' OR title = ?")
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
