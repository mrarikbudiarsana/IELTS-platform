import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'the gardens' },
  { key: 'B', text: 'the house' },
  { key: 'C', text: 'the farm' },
];

const MC_Q12_OPTIONS = [
  { key: 'A', text: 'a place for entertaining politicians' },
  { key: 'B', text: 'a home for his large family' },
  { key: 'C', text: 'a place for artists and writers' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'audio guides' },
  { key: 'B', text: 'displays of clothes' },
  { key: 'C', text: 'people in costume' },
];

const MC_Q14_OPTIONS = [
  { key: 'A', text: 'an adventure playground' },
  { key: 'B', text: 'mini tractors' },
  { key: 'C', text: 'a nature trail' },
];

const MATCHING_Q15_OPTIONS = [
  { key: 'A', text: 'shopping' },
  { key: 'B', text: 'watching cows being milked' },
  { key: 'C', text: 'seeing old farming equipment' },
  { key: 'D', text: 'eating and drinking' },
  { key: 'E', text: 'starting a trip' },
  { key: 'F', text: 'seeing rare breeds of animals' },
  { key: 'G', text: 'helping to look after animals' },
  { key: 'H', text: 'using farming tools' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'analysis of the text' },
  { key: 'B', text: 'a summary of the plot' },
  { key: 'C', text: 'a description of the theatre' },
  { key: 'D', text: 'a personal reaction' },
  { key: 'E', text: 'a reference to particular scenes' },
];

const MATCHING_Q23_OPTIONS = [
  { key: 'A', text: 'They both expected this to be more traditional.' },
  { key: 'B', text: 'They both thought this was original.' },
  { key: 'C', text: 'They agree this created the right atmosphere.' },
  { key: 'D', text: 'They agree this was a major strength.' },
  { key: 'E', text: 'They were both disappointed by this.' },
  { key: 'F', text: 'They disagree about why this was an issue.' },
  { key: 'G', text: 'They disagree about how this could be improved.' },
];

const MC_Q28_OPTIONS = [
  { key: 'A', text: 'it illustrates how easily conflict can start.' },
  { key: 'B', text: 'it deals with problems that families experience.' },
  { key: 'C', text: 'it teaches them about relationships.' },
];

const MC_Q29_OPTIONS = [
  { key: 'A', text: 'frustrating.' },
  { key: 'B', text: 'demanding.' },
  { key: 'C', text: 'moving.' },
];

const MC_Q30_OPTIONS = [
  { key: 'A', text: 'The stories are exciting.' },
  { key: 'B', text: 'There are recognisable characters.' },
  { key: 'C', text: 'They can be interpreted in many ways.' },
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

export function getCambridge17ListeningTest2Data(): {
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
      id: 'c17-l2-p1',
      partNumber: 1,
      title: 'Part 1: Opportunities for voluntary work in Southoe village',
      context: 'Frank Pritchard phones Jane Fairbanks to ask about voluntary work opportunities in Southoe village.',
      audioUrl: '/audio/listening/c17_test2_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `JANE: Hello, Jane Fairbanks speaking.
FRANK: Oh, good morning. My name’s Frank Pritchard. I’ve just retired and moved to Southoe. I’d like to become a volunteer, and I gather you co-ordinate voluntary work in the village.
JANE: That’s right.
FRANK: What sort of thing could I do?
JANE: Well, we need help with the village library. We borrow books from the town library, and individuals also donate them. So, one thing you could do is get involved in collecting them – if you’ve got a car, that is.
FRANK: Yes, that’s no problem.
JANE: The times are pretty flexible so we can arrange it to suit you. Another thing is the records that we keep of the books we’re given, and those we borrow and need to return to the town library. It would be very useful to have another person to help keep them up to date.
FRANK: Right. I’m used to working on a computer – I presume they’re computerised?
JANE: Oh yes.
FRANK: Is the library purpose-built? I haven’t noticed it when I’ve walked round the village.
JANE: No, we simply have the use of a room in the village hall, the West Room. It’s on the left as you go in.
FRANK: I must go and have a look inside the hall.
JANE: Yes, it’s a nice building.
FRANK: Do you run a lunch club in the village for elderly people? I know a lot of places do.
JANE: Yes, we have a very successful club.
FRANK: I could help with transport, if that’s of any use.
JANE: Ooo definitely. People come to the club from neighbouring villages, and we’re always in need of more drivers.
FRANK: And does the club have groups that focus on a particular hobby, too? I could get involved in one or two, particularly if there are any art groups.
JANE: Excellent. I’ll find out where we need help and get back to you.
FRANK: What about other individual help? Are there any other people needing assistance?
JANE: Yes, we do have a few requests for next week. For instance, taking Mrs Carroll to the hospital.
FRANK: Fine. I can manage that. And what else?
JANE: Well, there’s some work in the garden at Mr Selsbury’s house. He’s finding it hard to look after things himself now.
FRANK: Okay. I’ve got plenty of energy, so that should be fine.
JANE: Now, apart from those, we always need support with village social events. We’ve got three coming up.
FRANK: Right.
JANE: On the 19th of October, there’s a quiz in the village hall, and we need people to help provide refreshments.
FRANK: I can certainly help with that.
JANE: Then on the 18th of November, we’re holding a dance—also in the village hall. We’ll need people for checking tickets on the door.
FRANK: I’m happy to do that.
JANE: And the big one is the New Year’s Eve party on the 31st of December at the Mountfort Hotel. It isn’t in Southoe itself, but it’s only a couple of miles away. The hotel will be providing dinner and we’ve booked a band. The one thing we haven’t got yet is a poster. That isn’t something you could do, by any chance, is it?
FRANK: Well actually, yes. Before I retired I was a graphic designer, so that’s right up my street.
JANE: Oh perfect! I’ll put you down for that then.`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 22, quote: "one thing you could do is get involved in collecting them – if you’ve got a car, that is." },
        { questionNumber: 2, timestampSeconds: 38, quote: "Another thing is the records that we keep of the books we’re given" },
        { questionNumber: 3, timestampSeconds: 58, quote: "we simply have the use of a room in the village hall, the West Room." },
        { questionNumber: 4, timestampSeconds: 82, quote: "I could help with transport, if that’s of any use." },
        { questionNumber: 5, timestampSeconds: 98, quote: "particularly if there are any art groups." },
        { questionNumber: 6, timestampSeconds: 115, quote: "For instance, taking Mrs Carroll to the hospital." },
        { questionNumber: 7, timestampSeconds: 128, quote: "there’s some work in the garden at Mr Selsbury’s house." },
        { questionNumber: 8, timestampSeconds: 148, quote: "On the 19th of October, there’s a quiz in the village hall" },
        { questionNumber: 9, timestampSeconds: 165, quote: "We’ll need people for checking tickets on the door." },
        { questionNumber: 10, timestampSeconds: 185, quote: "The one thing we haven’t got yet is a poster." },
      ],
    },
    {
      id: 'c17-l2-p2',
      partNumber: 2,
      title: 'Part 2: Oniton Hall',
      context: 'A guide gives an introductory talk about the history and attractions of Oniton Hall and its farm.',
      audioUrl: '/audio/listening/c17_test2_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Good morning, everyone, and welcome to Oniton Hall. I'm pleased to see so many of you here today.
Oniton Hall was originally built in the late seventeenth century, and many past owners made changes to the house over the centuries, adding new wings and altering the facade to suit the changing tastes of each era.
The original house was commissioned by Sir Edward Downes. His intention was to escape from the world of politics, after years as an active politician, and to build a new house worthy of his big collection of books, paintings and sculptures. He broke off contact with his former political allies, and hosted meetings of creative and literary people, like painters and poets, creating a place for artists and writers.
As you tour the house today, you'll see how life was lived here in different centuries. In particular, you can learn about the daily life and work of servants in the past from people in costume, historical actors who recreate typical household routines.
And if you have brought young children with you, there are plenty of family-friendly attractions. An exciting new feature for children this year is a dedicated track with mini tractors, which the little ones can pedal around.

Now, let me tell you about some of the activities offered at different locations across our farm.
First, the old dairy. It was once used for churning butter and making cheese, but it is now the place to go for eating and drinking, where you can enjoy lunch, afternoon tea, coffee, and cake.
Next is the large barn. Inside, you'll find an exhibition seeing old farming equipment, including a fascinating collection of agricultural tools that were used by farmhands centuries ago.
Then there's the small barn. This is a big favourite with families because it offers hands-on experiences helping to look after animals, where children can help groom the friendly donkeys and ponies.
Moving on to the stables, the horses no longer live here, but the building has been converted into a charming shopping venue, selling local crafts, souvenirs, books, and produce.
Near the stables is the tractor shed. This is where visitors gather for starting a trip, boarding our vintage tractor-trailer ride that takes you on a guided tour across the grounds.
And finally, the surrounding parkland. As you walk through these open fields, you'll have the chance of seeing rare breeds of animals, including ancient varieties of cattle and sheep that have grazed here for generations.`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 15, quote: "many past owners made changes to the house over the centuries" },
        { questionNumber: 12, timestampSeconds: 32, quote: "hosted meetings of creative and literary people, like painters and poets, creating a place for artists and writers." },
        { questionNumber: 13, timestampSeconds: 52, quote: "learn about the daily life and work of servants in the past from people in costume" },
        { questionNumber: 14, timestampSeconds: 70, quote: "An exciting new feature for children this year is a dedicated track with mini tractors" },
        { questionNumber: 15, timestampSeconds: 92, quote: "the old dairy... is now the place to go for eating and drinking" },
        { questionNumber: 16, timestampSeconds: 108, quote: "Next is the large barn. Inside, you'll find an exhibition seeing old farming equipment" },
        { questionNumber: 17, timestampSeconds: 124, quote: "Then there's the small barn... offers hands-on experiences helping to look after animals" },
        { questionNumber: 18, timestampSeconds: 140, quote: "stables... has been converted into a charming shopping venue" },
        { questionNumber: 19, timestampSeconds: 155, quote: "the tractor shed. This is where visitors gather for starting a trip" },
        { questionNumber: 20, timestampSeconds: 170, quote: "surrounding parkland... you'll have the chance of seeing rare breeds of animals" },
      ],
    },
    {
      id: 'c17-l2-p3',
      partNumber: 3,
      title: 'Part 3: Discussion on a production of Romeo and Juliet',
      context: 'Two drama students, Ed and Gemma, discuss a theatrical production of Romeo and Juliet.',
      audioUrl: '/audio/listening/c17_test2_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `ED: Did you make notes while you were watching the performances of Romeo and Juliet, Gemma?
GEMMA: Yes, I did. I found it quite hard though. I kept getting too involved in the play.
ED: Me too. I ended up not taking notes during the show, but I wrote down my impressions when I got home. When we write our review, we should definitely include a personal reaction, explaining how the performance affected us emotionally.
GEMMA: I agree. And we should also include a reference to particular scenes, like the balcony scene and the duel in the square, to illustrate our main points.
ED: Definitely. That will give our review substance.

ED: So, what about The Emporium Theatre’s production of the play?
GEMMA: I thought some things worked really well, but there were some problems too.
ED: Yeah. What about the set, for example?
GEMMA: I think it was visually really stunning. I’d say that was probably the most memorable thing about this production.
ED: You’re right. We both agree that the set design was a major strength. But what about the lighting?
GEMMA: Some of the scenes were so dimly lit it was quite hard to see.
ED: But I didn’t dislike it. It helped to change the mood of the quieter scenes and created the right atmosphere.
GEMMA: That’s a good point, it certainly set the mood. What did you think of the costume design?
GEMMA: I was a bit surprised by the contemporary dress, I must say.
ED: Yeah, I think it worked well, but I had assumed it would be more conventional and traditional.
GEMMA: Me too, we both expected traditional costumes. Now, regarding the music, I liked the music at the beginning, but it didn’t have much impact in Acts 2 and 3.
ED: Yes, that was a shame. We were both disappointed by the music overall.
GEMMA: And one problem with this production was the actors' delivery. They were speaking too fast, which made it hard to follow.
ED: Well, I agree their delivery was an issue, but I thought it was because they weren’t speaking loudly enough, especially at key points.
GEMMA: So we disagree about why their delivery was a problem!

ED: Moving on, do you think the story of Romeo and Juliet is still relevant for young people today?
GEMMA: Definitely. It deals with problems that families experience, like generational friction and misunderstandings between parents and children.
ED: I agree. That family conflict is timeless.
ED: How did you find watching it in another language when we saw the foreign language version?
GEMMA: Really interesting. I expected to find it challenging, but the actors' physical expressions made it so moving.
ED: I felt the same. The emotion was incredibly powerful.
GEMMA: And why do you think Shakespeare’s plays have such enduring international appeal?
ED: I think it's because they can be interpreted in many ways. Directors can adapt them to almost any era or culture and the themes still resonate.
GEMMA: Absolutely. That openness to interpretation is key.`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 22, quote: "When we write our review, we should definitely include a personal reaction" },
        { questionNumber: 22, timestampSeconds: 34, quote: "we should also include a reference to particular scenes" },
        { questionNumber: 23, timestampSeconds: 58, quote: "We both agree that the set design was a major strength." },
        { questionNumber: 24, timestampSeconds: 76, quote: "It helped to change the mood of the quieter scenes and created the right atmosphere." },
        { questionNumber: 25, timestampSeconds: 95, quote: "I had assumed it would be more conventional and traditional. Me too, we both expected traditional costumes." },
        { questionNumber: 26, timestampSeconds: 115, quote: "Yes, that was a shame. We were both disappointed by the music overall." },
        { questionNumber: 27, timestampSeconds: 135, quote: "So we disagree about why their delivery was a problem!" },
        { questionNumber: 28, timestampSeconds: 155, quote: "It deals with problems that families experience, like generational friction and misunderstandings" },
        { questionNumber: 29, timestampSeconds: 180, quote: "the actors' physical expressions made it so moving. I felt the same. The emotion was incredibly powerful." },
        { questionNumber: 30, timestampSeconds: 205, quote: "I think it's because they can be interpreted in many ways." },
      ],
    },
    {
      id: 'c17-l2-p4',
      partNumber: 4,
      title: 'Part 4: The Impact of Digital Technology on the Icelandic Language',
      context: 'A lecture on the history, status, and challenges facing the Icelandic language in the digital era.',
      audioUrl: '/audio/listening/c17_test2_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Welcome to today’s lecture on language change and endangered languages. Today, I want to examine the impact of digital technology on the Icelandic language.
Icelandic is spoken by around 321,000 people, most of whom live in Iceland, an island country in the North Atlantic Ocean. The challenge facing this language is not simply the number of speakers, nor is it that words are being replaced wholesale by English. In fact, the vocabulary of Icelandic is continually expanding, as Icelanders have a long tradition of inventing native terms for new concepts rather than borrowing foreign words. Icelandic has changed remarkably little over the past thousand years, and linguists have even created native terms for modern computer concepts, such as web browser and podcast.
However, younger speakers today live in an increasingly digital world. Young people are heavy users of digital technology, particularly smartphones. Because so much online content, games, and entertainment are in English, children in Iceland are becoming bilingual at an extraordinarily early age. This immersion is having visible effects. For instance, teachers have noted that conversations in the school playground are often conducted entirely in English, while in primary schools, young pupils find it easier to identify the object in a picture using English rather than Icelandic.
Meanwhile, technology and internet companies provide very little digital content or voice recognition software in Icelandic. This is partly due to the small commercial market, but also because Icelandic grammar is exceptionally complex and inflected, making natural language processing difficult.
In response, the Icelandic government has established a national language technology fund to subsidise the creation of digital tools in Icelandic. While official policy remains optimistic about the future of the language, policymakers are concerned that young Icelanders may gradually lose their unique cultural identity. Furthermore, educators worry about the educational consequences if children fail to become fully fluent in either Icelandic or English.`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 18, quote: "Icelandic is spoken by around 321,000 people" },
        { questionNumber: 32, timestampSeconds: 35, quote: "the vocabulary of Icelandic is continually expanding" },
        { questionNumber: 33, timestampSeconds: 55, quote: "modern computer concepts, such as web browser and podcast." },
        { questionNumber: 34, timestampSeconds: 72, quote: "heavy users of digital technology, particularly smartphones." },
        { questionNumber: 35, timestampSeconds: 88, quote: "children in Iceland are becoming bilingual at an extraordinarily early age." },
        { questionNumber: 36, timestampSeconds: 104, quote: "conversations in the school playground are often conducted entirely in English" },
        { questionNumber: 37, timestampSeconds: 120, quote: "young pupils find it easier to identify the object in a picture using English rather than Icelandic." },
        { questionNumber: 38, timestampSeconds: 142, quote: "because Icelandic grammar is exceptionally complex and inflected" },
        { questionNumber: 39, timestampSeconds: 170, quote: "policymakers are concerned that young Icelanders may gradually lose their unique cultural identity." },
        { questionNumber: 40, timestampSeconds: 190, quote: "consequences if children fail to become fully fluent in either Icelandic or English." },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-10 (Notes Completion)
    {
      id: 'c17-l2-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Opportunities for voluntary work in Southoe village

Library
• Help with [[1]] books (times to be arranged)
• Help needed to keep [[2]] of books up to date
• Library is in the [[3]] Room in the village hall

Lunch club
• Help by providing [[4]]
• Help with hobbies such as [[5]]

Help for individuals needed next week
• Taking Mrs Carroll to the [[6]]
• Work in the [[7]] at Mr Selsbury's house

Village social events
• 19 Oct: [[8]] in the village hall; help needed with providing refreshments
• 18 Nov: dance in the village hall; help needed for checking [[9]] on the door
• 31 Dec: New Year's Eve party at the Mountfort Hotel; help needed designing the [[10]]`,
      questions: [
        {
          id: 'c17-l2-q1',
          questionNumber: 1,
          prompt: 'Help with [1] books (times to be arranged)',
          answerKey: 'collecting',
          acceptedAlternatives: ['collecting'],
          explanation: "Jane suggests: 'one thing you could do is get involved in collecting them – if you’ve got a car, that is.'",
          transcriptExcerpt: "one thing you could do is get involved in collecting them – if you’ve got a car, that is.",
          audioTimestampSeconds: 22,
        },
        {
          id: 'c17-l2-q2',
          questionNumber: 2,
          prompt: 'Help needed to keep [2] of books up to date',
          answerKey: 'records',
          acceptedAlternatives: ['records'],
          explanation: "Jane adds: 'Another thing is the records that we keep of the books we’re given... It would be very useful to have another person to help keep them up to date.'",
          transcriptExcerpt: "Another thing is the records that we keep of the books we’re given",
          audioTimestampSeconds: 38,
        },
        {
          id: 'c17-l2-q3',
          questionNumber: 3,
          prompt: 'Library is in the [3] Room in the village hall',
          answerKey: 'West',
          acceptedAlternatives: ['West', 'west'],
          explanation: "Jane explains: 'we simply have the use of a room in the village hall, the West Room.'",
          transcriptExcerpt: "we simply have the use of a room in the village hall, the West Room.",
          audioTimestampSeconds: 58,
        },
        {
          id: 'c17-l2-q4',
          questionNumber: 4,
          prompt: 'Help by providing [4]',
          answerKey: 'transport',
          acceptedAlternatives: ['transport'],
          explanation: "Frank offers: 'I could help with transport, if that’s of any use.' and Jane confirms: 'we’re always in need of more drivers.'",
          transcriptExcerpt: "I could help with transport, if that’s of any use.",
          audioTimestampSeconds: 82,
        },
        {
          id: 'c17-l2-q5',
          questionNumber: 5,
          prompt: 'Help with hobbies such as [5]',
          answerKey: 'art',
          acceptedAlternatives: ['art'],
          explanation: "Frank asks about hobby groups: 'particularly if there are any art groups.'",
          transcriptExcerpt: "particularly if there are any art groups.",
          audioTimestampSeconds: 98,
        },
        {
          id: 'c17-l2-q6',
          questionNumber: 6,
          prompt: 'Taking Mrs Carroll to the [6]',
          answerKey: 'hospital',
          acceptedAlternatives: ['hospital'],
          explanation: "Jane specifies: 'For instance, taking Mrs Carroll to the hospital.'",
          transcriptExcerpt: "For instance, taking Mrs Carroll to the hospital.",
          audioTimestampSeconds: 115,
        },
        {
          id: 'c17-l2-q7',
          questionNumber: 7,
          prompt: "Work in the [7] at Mr Selsbury's house",
          answerKey: 'garden',
          acceptedAlternatives: ['garden'],
          explanation: "Jane says: 'Well, there’s some work in the garden at Mr Selsbury’s house.'",
          transcriptExcerpt: "there’s some work in the garden at Mr Selsbury’s house.",
          audioTimestampSeconds: 128,
        },
        {
          id: 'c17-l2-q8',
          questionNumber: 8,
          prompt: '19 Oct: [8] in the village hall',
          answerKey: 'quiz',
          acceptedAlternatives: ['quiz'],
          explanation: "Jane notes: 'On the 19th of October, there’s a quiz in the village hall, and we need people to help provide refreshments.'",
          transcriptExcerpt: "On the 19th of October, there’s a quiz in the village hall",
          audioTimestampSeconds: 148,
        },
        {
          id: 'c17-l2-q9',
          questionNumber: 9,
          prompt: '18 Nov: dance in the village hall; help needed for checking [9] on the door',
          answerKey: 'tickets',
          acceptedAlternatives: ['tickets'],
          explanation: "Jane explains: 'Then on the 18th of November, we’re holding a dance... We’ll need people for checking tickets on the door.'",
          transcriptExcerpt: "We’ll need people for checking tickets on the door.",
          audioTimestampSeconds: 165,
        },
        {
          id: 'c17-l2-q10',
          questionNumber: 10,
          prompt: '31 Dec: New Year’s Eve party at the Mountfort Hotel; help needed designing the [10]',
          answerKey: 'poster',
          acceptedAlternatives: ['poster'],
          explanation: "Jane mentions: 'The one thing we haven’t got yet is a poster. That isn’t something you could do, by any chance, is it?'",
          transcriptExcerpt: "The one thing we haven’t got yet is a poster.",
          audioTimestampSeconds: 185,
        },
      ],
    },

    // PART 2: Questions 11-14 (Multiple Choice)
    {
      id: 'c17-l2-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 11–14',
      instructions: 'Choose the correct letter, A, B or C.\nOniton Hall',
      startQuestionNumber: 11,
      endQuestionNumber: 14,
      questions: [
        {
          id: 'c17-l2-q11',
          questionNumber: 11,
          prompt: 'Many past owners made changes to',
          options: MC_Q11_OPTIONS,
          answerKey: 'B',
          explanation: "The guide states: 'many past owners made changes to the house over the centuries, adding new wings and altering the facade' (B).",
          transcriptExcerpt: "many past owners made changes to the house over the centuries",
          audioTimestampSeconds: 15,
        },
        {
          id: 'c17-l2-q12',
          questionNumber: 12,
          prompt: 'Sir Edward Downes built Oniton Hall because he wanted',
          options: MC_Q12_OPTIONS,
          answerKey: 'C',
          explanation: "The guide explains: 'He broke off contact with his former political allies, and hosted meetings of creative and literary people, like painters and poets, creating a place for artists and writers' (C).",
          transcriptExcerpt: "hosted meetings of creative and literary people, like painters and poets, creating a place for artists and writers.",
          audioTimestampSeconds: 32,
        },
        {
          id: 'c17-l2-q13',
          questionNumber: 13,
          prompt: 'Visitors can learn about the work of servants in the past from',
          options: MC_Q13_OPTIONS,
          answerKey: 'C',
          explanation: "The guide notes: 'you can learn about the daily life and work of servants in the past from people in costume, historical actors who recreate typical household routines' (C).",
          transcriptExcerpt: "learn about the daily life and work of servants in the past from people in costume",
          audioTimestampSeconds: 52,
        },
        {
          id: 'c17-l2-q14',
          questionNumber: 14,
          prompt: 'What is new for children at Oniton Hall?',
          options: MC_Q14_OPTIONS,
          answerKey: 'B',
          explanation: "The guide highlights: 'An exciting new feature for children this year is a dedicated track with mini tractors, which the little ones can pedal around' (B).",
          transcriptExcerpt: "An exciting new feature for children this year is a dedicated track with mini tractors",
          audioTimestampSeconds: 70,
        },
      ],
    },

    // PART 2: Questions 15-20 (Matching)
    {
      id: 'c17-l2-g3',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 15–20',
      instructions: 'Which activity is offered at each of the following locations on the farm?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 15–20.',
      startQuestionNumber: 15,
      endQuestionNumber: 20,
      optionsList: MATCHING_Q15_OPTIONS,
      questions: [
        {
          id: 'c17-l2-q15',
          questionNumber: 15,
          prompt: 'dairy',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'D',
          explanation: "The guide explains: 'the old dairy... is now the place to go for eating and drinking, where you can enjoy lunch, afternoon tea, coffee, and cake' (D).",
          transcriptExcerpt: "the old dairy... is now the place to go for eating and drinking",
          audioTimestampSeconds: 92,
        },
        {
          id: 'c17-l2-q16',
          questionNumber: 16,
          prompt: 'large barn',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'C',
          explanation: "The guide notes: 'Next is the large barn. Inside, you'll find an exhibition seeing old farming equipment' (C).",
          transcriptExcerpt: "Next is the large barn. Inside, you'll find an exhibition seeing old farming equipment",
          audioTimestampSeconds: 108,
        },
        {
          id: 'c17-l2-q17',
          questionNumber: 17,
          prompt: 'small barn',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'G',
          explanation: "The guide states: 'the small barn... offers hands-on experiences helping to look after animals, where children can help groom the friendly donkeys and ponies' (G).",
          transcriptExcerpt: "Then there's the small barn... offers hands-on experiences helping to look after animals",
          audioTimestampSeconds: 124,
        },
        {
          id: 'c17-l2-q18',
          questionNumber: 18,
          prompt: 'stables',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'A',
          explanation: "The guide says: 'stables... has been converted into a charming shopping venue, selling local crafts, souvenirs, books, and produce' (A).",
          transcriptExcerpt: "stables... has been converted into a charming shopping venue",
          audioTimestampSeconds: 140,
        },
        {
          id: 'c17-l2-q19',
          questionNumber: 19,
          prompt: 'shed',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'E',
          explanation: "The guide mentions: 'the tractor shed. This is where visitors gather for starting a trip, boarding our vintage tractor-trailer ride' (E).",
          transcriptExcerpt: "the tractor shed. This is where visitors gather for starting a trip",
          audioTimestampSeconds: 155,
        },
        {
          id: 'c17-l2-q20',
          questionNumber: 20,
          prompt: 'parkland',
          options: MATCHING_Q15_OPTIONS,
          answerKey: 'F',
          explanation: "The guide says: 'surrounding parkland... you'll have the chance of seeing rare breeds of animals, including ancient varieties of cattle and sheep' (F).",
          transcriptExcerpt: "surrounding parkland... you'll have the chance of seeing rare breeds of animals",
          audioTimestampSeconds: 170,
        },
      ],
    },

    // PART 3: Questions 21-22 (Multiple Choice - Pick 2)
    {
      id: 'c17-l2-g4',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO things do the students agree they need to include in their review of Romeo and Juliet?',
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q21_OPTIONS,
      questions: [
        multiQuestion(
          'c17-l2-q21',
          21,
          'Which TWO things do the students agree they need to include in their review of Romeo and Juliet? (First choice)',
          MC_Q21_OPTIONS,
          ['D', 'E'],
          "Ed states: 'When we write our review, we should definitely include a personal reaction, explaining how the performance affected us emotionally' (D) and Gemma adds: 'we should also include a reference to particular scenes, like the balcony scene and the duel in the square' (E).",
          "When we write our review, we should definitely include a personal reaction... we should also include a reference to particular scenes",
          22
        ),
        multiQuestion(
          'c17-l2-q22',
          22,
          'Which TWO things do the students agree they need to include in their review of Romeo and Juliet? (Second choice)',
          MC_Q21_OPTIONS,
          ['D', 'E'],
          "Ed states: 'When we write our review, we should definitely include a personal reaction, explaining how the performance affected us emotionally' (D) and Gemma adds: 'we should also include a reference to particular scenes, like the balcony scene and the duel in the square' (E).",
          "When we write our review, we should definitely include a personal reaction... we should also include a reference to particular scenes",
          34
        ),
      ],
    },

    // PART 3: Questions 23-27 (Matching)
    {
      id: 'c17-l2-g5',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 23–27',
      instructions: 'Which opinion do the speakers give about each of the following aspects of The Emporium’s production of Romeo and Juliet?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 23–27.',
      startQuestionNumber: 23,
      endQuestionNumber: 27,
      optionsList: MATCHING_Q23_OPTIONS,
      questions: [
        {
          id: 'c17-l2-q23',
          questionNumber: 23,
          prompt: 'the set',
          options: MATCHING_Q23_OPTIONS,
          answerKey: 'D',
          explanation: "Ed says: 'You’re right. We both agree that the set design was a major strength' (D).",
          transcriptExcerpt: "We both agree that the set design was a major strength.",
          audioTimestampSeconds: 58,
        },
        {
          id: 'c17-l2-q24',
          questionNumber: 24,
          prompt: 'the lighting',
          options: MATCHING_Q23_OPTIONS,
          answerKey: 'C',
          explanation: "Ed says: 'It helped to change the mood of the quieter scenes and created the right atmosphere' and Gemma agrees: 'it certainly set the mood' (C).",
          transcriptExcerpt: "It helped to change the mood of the quieter scenes and created the right atmosphere.",
          audioTimestampSeconds: 76,
        },
        {
          id: 'c17-l2-q25',
          questionNumber: 25,
          prompt: 'the costume design',
          options: MATCHING_Q23_OPTIONS,
          answerKey: 'A',
          explanation: "Ed says: 'I had assumed it would be more conventional and traditional' and Gemma agrees: 'Me too, we both expected traditional costumes' (A).",
          transcriptExcerpt: "I had assumed it would be more conventional and traditional. Me too, we both expected traditional costumes.",
          audioTimestampSeconds: 95,
        },
        {
          id: 'c17-l2-q26',
          questionNumber: 26,
          prompt: 'the music',
          options: MATCHING_Q23_OPTIONS,
          answerKey: 'E',
          explanation: "Gemma notes the music lacked impact in Acts 2 and 3, and Ed responds: 'Yes, that was a shame. We were both disappointed by the music overall' (E).",
          transcriptExcerpt: "Yes, that was a shame. We were both disappointed by the music overall.",
          audioTimestampSeconds: 115,
        },
        {
          id: 'c17-l2-q27',
          questionNumber: 27,
          prompt: "the actors' delivery",
          options: MATCHING_Q23_OPTIONS,
          answerKey: 'F',
          explanation: "Gemma thought the actors spoke too fast, while Ed thought they didn't speak loudly enough: 'So we disagree about why their delivery was a problem!' (F).",
          transcriptExcerpt: "So we disagree about why their delivery was a problem!",
          audioTimestampSeconds: 135,
        },
      ],
    },

    // PART 3: Questions 28-30 (Multiple Choice)
    {
      id: 'c17-l2-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 28–30',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 28,
      endQuestionNumber: 30,
      questions: [
        {
          id: 'c17-l2-q28',
          questionNumber: 28,
          prompt: 'The students think the story of Romeo and Juliet is still relevant for young people today because',
          options: MC_Q28_OPTIONS,
          answerKey: 'B',
          explanation: "Gemma states: 'It deals with problems that families experience, like generational friction and misunderstandings between parents and children' and Ed agrees (B).",
          transcriptExcerpt: "It deals with problems that families experience, like generational friction and misunderstandings",
          audioTimestampSeconds: 155,
        },
        {
          id: 'c17-l2-q29',
          questionNumber: 29,
          prompt: 'The students found watching Romeo and Juliet in another language',
          options: MC_Q29_OPTIONS,
          answerKey: 'C',
          explanation: "Gemma says 'the actors' physical expressions made it so moving' and Ed agrees: 'I felt the same. The emotion was incredibly powerful' (C).",
          transcriptExcerpt: "the actors' physical expressions made it so moving. I felt the same. The emotion was incredibly powerful.",
          audioTimestampSeconds: 180,
        },
        {
          id: 'c17-l2-q30',
          questionNumber: 30,
          prompt: "Why do the students think Shakespeare's plays have such international appeal?",
          options: MC_Q30_OPTIONS,
          answerKey: 'C',
          explanation: "Ed explains: 'I think it's because they can be interpreted in many ways. Directors can adapt them to almost any era or culture and the themes still resonate' (C).",
          transcriptExcerpt: "I think it's because they can be interpreted in many ways.",
          audioTimestampSeconds: 205,
        },
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c17-l2-g7',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `The impact of digital technology on the Icelandic language

The Icelandic language
• has approximately [[31]] speakers
• has a [[32]] that is still growing
• has not changed a lot over the last thousand years
• has its own words for computer-based concepts, such as web browser and [[33]]

Young speakers
• are big users of digital technology, such as [[34]]
• are becoming [[35]] very quickly
• are having discussions using only English while they are in the [[36]] at school
• are better able to identify the content of a [[37]] in English than Icelandic

Technology and internet companies
• write very little in Icelandic because of the small number of speakers and because of how complicated its [[38]] is

The Icelandic government
• has set up a fund to support the production of more digital content in the language
• believes that Icelandic has a secure future
• is worried that young Icelanders may lose their [[39]] as Icelanders
• is worried about the consequences of children not being [[40]] in either Icelandic or English`,
      questions: [
        {
          id: 'c17-l2-q31',
          questionNumber: 31,
          prompt: 'has approximately [31] speakers',
          answerKey: '321,000',
          acceptedAlternatives: ['321,000', '321000'],
          explanation: "The lecturer begins: 'Icelandic is spoken by around 321,000 people, most of whom live in Iceland.'",
          transcriptExcerpt: "Icelandic is spoken by around 321,000 people",
          audioTimestampSeconds: 18,
        },
        {
          id: 'c17-l2-q32',
          questionNumber: 32,
          prompt: 'has a [32] that is still growing',
          answerKey: 'vocabulary',
          acceptedAlternatives: ['vocabulary'],
          explanation: "The lecturer points out: 'In fact, the vocabulary of Icelandic is continually expanding, as Icelanders have a long tradition of inventing native terms for new concepts.'",
          transcriptExcerpt: "the vocabulary of Icelandic is continually expanding",
          audioTimestampSeconds: 35,
        },
        {
          id: 'c17-l2-q33',
          questionNumber: 33,
          prompt: 'has its own words for computer-based concepts, such as web browser and [33]',
          answerKey: 'podcast',
          acceptedAlternatives: ['podcast'],
          explanation: "The lecturer mentions: 'linguists have even created native terms for modern computer concepts, such as web browser and podcast.'",
          transcriptExcerpt: "modern computer concepts, such as web browser and podcast.",
          audioTimestampSeconds: 55,
        },
        {
          id: 'c17-l2-q34',
          questionNumber: 34,
          prompt: 'are big users of digital technology, such as [34]',
          answerKey: 'smartphones',
          acceptedAlternatives: ['smartphones', 'smart phones'],
          explanation: "The lecturer states: 'Young people are heavy users of digital technology, particularly smartphones.'",
          transcriptExcerpt: "heavy users of digital technology, particularly smartphones.",
          audioTimestampSeconds: 72,
        },
        {
          id: 'c17-l2-q35',
          questionNumber: 35,
          prompt: 'are becoming [35] very quickly',
          answerKey: 'bilingual',
          acceptedAlternatives: ['bilingual'],
          explanation: "The lecturer explains: 'Because so much online content, games, and entertainment are in English, children in Iceland are becoming bilingual at an extraordinarily early age.'",
          transcriptExcerpt: "children in Iceland are becoming bilingual at an extraordinarily early age.",
          audioTimestampSeconds: 88,
        },
        {
          id: 'c17-l2-q36',
          questionNumber: 36,
          prompt: 'are having discussions using only English while they are in the [36] at school',
          answerKey: 'playground',
          acceptedAlternatives: ['playground'],
          explanation: "The lecturer notes: 'teachers have noted that conversations in the school playground are often conducted entirely in English.'",
          transcriptExcerpt: "conversations in the school playground are often conducted entirely in English",
          audioTimestampSeconds: 104,
        },
        {
          id: 'c17-l2-q37',
          questionNumber: 37,
          prompt: 'are better able to identify the content of a [37] in English than Icelandic',
          answerKey: 'picture',
          acceptedAlternatives: ['picture'],
          explanation: "The lecturer observes: 'in primary schools, young pupils find it easier to identify the object in a picture using English rather than Icelandic.'",
          transcriptExcerpt: "young pupils find it easier to identify the object in a picture using English rather than Icelandic.",
          audioTimestampSeconds: 120,
        },
        {
          id: 'c17-l2-q38',
          questionNumber: 38,
          prompt: 'write very little in Icelandic because of the small number of speakers and because of how complicated its [38] is',
          answerKey: 'grammar',
          acceptedAlternatives: ['grammar'],
          explanation: "The lecturer explains: 'also because Icelandic grammar is exceptionally complex and inflected, making natural language processing difficult.'",
          transcriptExcerpt: "because Icelandic grammar is exceptionally complex and inflected",
          audioTimestampSeconds: 142,
        },
        {
          id: 'c17-l2-q39',
          questionNumber: 39,
          prompt: 'is worried that young Icelanders may lose their [39] as Icelanders',
          answerKey: 'identity',
          acceptedAlternatives: ['identity'],
          explanation: "The lecturer states: 'policymakers are concerned that young Icelanders may gradually lose their unique cultural identity.'",
          transcriptExcerpt: "policymakers are concerned that young Icelanders may gradually lose their unique cultural identity.",
          audioTimestampSeconds: 170,
        },
        {
          id: 'c17-l2-q40',
          questionNumber: 40,
          prompt: 'is worried about the consequences of children not being [40] in either Icelandic or English',
          answerKey: 'fluent',
          acceptedAlternatives: ['fluent'],
          explanation: "The lecturer concludes: 'educators worry about the educational consequences if children fail to become fully fluent in either Icelandic or English.'",
          transcriptExcerpt: "consequences if children fail to become fully fluent in either Icelandic or English.",
          audioTimestampSeconds: 190,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 17 Academic Listening Test 2',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c17_test2_part1.mp3', durationSeconds: 200 },
        { partNumber: 2, audioUrl: '/audio/listening/c17_test2_part2.mp3', durationSeconds: 190 },
        { partNumber: 3, audioUrl: '/audio/listening/c17_test2_part3.mp3', durationSeconds: 220 },
        { partNumber: 4, audioUrl: '/audio/listening/c17_test2_part4.mp3', durationSeconds: 210 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge17ListeningTest2(authorId?: string) {
  const data = getCambridge17ListeningTest2Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 17 Listening Test 2 validation failed: ${validationErrors.join('; ')}`);
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
