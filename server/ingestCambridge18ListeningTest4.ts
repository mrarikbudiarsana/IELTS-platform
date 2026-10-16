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

export function getCambridge18ListeningTest4Data(): {
  title: string;
  category: 'mock';
  audioMode: 'part_audios';
  timeLimitMinutes: number;
  parts: ListeningPart[];
  questionGroups: QuestionGroup[];
  audioConfig: any;
} {
  const MC_Q11_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'a factory.' },
    { key: 'B', text: 'a private home.' },
    { key: 'C', text: 'a hall of residence.' },
  ];

  const MC_Q12_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'teaching rooms.' },
    { key: 'B', text: 'a research library.' },
    { key: 'C', text: 'administration offices.' },
  ];

  const MC_Q13_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'Visitors decide whether or not they wish to pay.' },
    { key: 'B', text: 'Only children and students receive a discount.' },
    { key: 'C', text: 'The museum charges extra for special exhibitions.' },
  ];

  const MC_Q14_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'cameras' },
    { key: 'B', text: 'coats' },
    { key: 'C', text: 'bags' },
  ];

  const MATCHING_MUSEUM_AREAS: OptionChoice[] = [
    { key: 'A', text: 'Parents must supervise their children.' },
    { key: 'B', text: 'There are new things to see.' },
    { key: 'C', text: 'It is closed today.' },
    { key: 'D', text: 'This is only for school groups.' },
    { key: 'E', text: 'There is a quiz for visitors.' },
    { key: 'F', text: 'It features something created by students.' },
    { key: 'G', text: 'An expert is here today.' },
    { key: 'H', text: 'There is a one-way system.' },
  ];

  const MC_Q21_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'solving problems' },
    { key: 'B', text: 'following instructions' },
    { key: 'C', text: 'working cooperatively' },
    { key: 'D', text: 'learning through play' },
    { key: 'E', text: 'developing hand-eye coordination' },
  ];

  const MATCHING_CHILDREN_COMMENTS: OptionChoice[] = [
    { key: 'A', text: 'demonstrated independence' },
    { key: 'B', text: 'asked for teacher support' },
    { key: 'C', text: 'developed a competitive attitude' },
    { key: 'D', text: 'seemed to find the activity calming' },
    { key: 'E', text: 'seemed pleased with the results' },
    { key: 'F', text: 'seemed confused' },
    { key: 'G', text: 'seemed to find the activity easy' },
  ];

  const MC_Q28_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'make models that demonstrate the different stages.' },
    { key: 'B', text: 'check children understand the terminology involved.' },
    { key: 'C', text: 'tell children not to worry if they find the activity difficult.' },
  ];

  const MC_Q29_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'they may not think that crafts are important.' },
    { key: 'B', text: 'they may not have the necessary skills.' },
    { key: 'C', text: 'they may worry that it will take up too much time.' },
  ];

  const MC_Q30_OPTIONS: OptionChoice[] = [
    { key: 'A', text: 'to correct a particular misunderstanding' },
    { key: 'B', text: 'to set a challenge' },
    { key: 'C', text: 'to introduce a new concept' },
  ];

  const parts: ListeningPart[] = [
    {
      id: 'c18-l4-p1',
      partNumber: 1,
      title: 'Part 1: Job Details from Employment Agency',
      context: 'Greg Preston from an employment agency calls Julie Davison about a receptionist job vacancy at a medical centre in Fordham.',
      audioUrl: '/audio/listening/c18_test4_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `JULIE: Hello?
GREG: Oh, hello. Is that Julie Davison?
JULIE: Yes.
GREG: This is Greg Preston from the Employment Agency. We met last week when you came in to enquire about office work.
JULIE: Oh, that's right.
GREG: Now we've just had some details come in of a job which might interest you.
JULIE: OK.
GREG: So this is a position for a receptionist – I believe you've done that sort of work before?
JULIE: Yes, I have, I worked in a sports centre for a couple of years before I got married and had the children.
GREG: Right. Well, this job's in Fordham, so not too far away for you, and it's at the medical centre there.
JULIE: OK. So where exactly is that?
GREG: It's quite near the station, on Chastons Road.
JULIE: Sorry?
GREG: Chastons Road - that's C-H-A-S-T-O-N-S.
JULIE: OK, thanks. So what would the work involve? Dealing with enquiries from patients?
GREG: Yes, and you'd also be involved in making appointments, whether face to face or on the phone. And rescheduling them if necessary.
JULIE: Fine, that shouldn't be a problem.
GREG: And another of your duties would be keeping the centre's database up-to-date. Then you might have other general administrative duties as well, but those would be the main ones.
JULIE: OK.
GREG: Now when the details came in, I immediately thought of you because one thing they do require is someone with experience, and you did mention your work at the sports centre when you came in to see us.
JULIE: Yes, in fact I enjoyed that job. Is there anything else they're looking for?
GREG: Well, they say it's quite a high-pressure environment, they're always very busy, and patients are often under stress, so they want someone who can cope with that and stay calm, and at the same time be confident when interacting with the public.
JULIE: Well, after dealing with three children all under five, I reckon I can cope with that.
GREG: I'm sure you can. And then another thing they mention is that they're looking for someone with good IT skills...
JULIE: Not a problem.
GREG: So you'd be interested in following this up?
JULIE: Sure. When would it start?
GREG: Well, they're looking for someone from the beginning of next month, but I should tell you that this isn't a permanent job, it's temporary, so the contract would be just to the end of September. But they do say that there could be further opportunities after that.
JULIE: OK. And what would the hours be?
GREG: Well, they want someone who can start at a quarter to eight in the morning - could you manage that?
JULIE: Yes, my husband would have to get the kids up and off to my mother's - she's going to be looking after them while I'm at work. What time would I finish?
GREG: One fifteen.
JULIE: That should work out all right. I can pick the kids up on my way home, and then I'll have the afternoon with them. Oh, one thing ... is there parking available for staff at the centre?
GREG: Yes, there is, and it's also on a bus route.
JULIE: Right. Well, I expect I'll have the car but it's good to know that. OK, so where do I go from here?
GREG: Well, if you're happy for me to do so, I'll forward your CV and references, and then the best thing would probably be for you to phone them so they can arrange for an interview.
JULIE: Great. Well thank you very much.
GREG: You're welcome. Bye now.
JULIE: Bye.`,
    },
    {
      id: 'c18-l4-p2',
      partNumber: 2,
      title: 'Part 2: Museum of Farming Life',
      context: 'A museum guide gives a talk to new visitors about the history, facilities, and exhibitions at the Museum of Farming Life.',
      audioUrl: '/audio/listening/c18_test4_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Good morning everyone, and welcome to the Museum of Farming Life. I understand it's your first visit here, so I'd like to give you some background information about the museum and then explain a little about what you can see during your visit.
So, where we're standing at the moment is the entrance to a large building that was constructed in 1880 as the home of a local businessman, Alfred Palmer, of the Palmer biscuit factory. It was later sold and became a hall of residence for students in 1911, and a museum in 1951. In 2005, a modern extension was built to accommodate the museum's collections.
The museum's owned by the university, and apart from two rooms that are our offices, the university uses the main part of the building. You may see students going into the building for lessons, but it's not open to museum visitors, I'm afraid. It's a shame because the interior architectural features are outstanding, especially the room that used to be the library.
Luckily, we've managed to keep entry to the museum free. This includes access to all the galleries, outdoor areas and the rooms for special exhibitions. We run activities for children and students, such as the museum club, for which there's no charge. We do have a donation box just over there so feel free to give whatever amount you consider appropriate.
We do have a cloakroom, if you'd like to leave your coats and bags somewhere. Unlike other museums, photography is allowed here, so you might like to keep your cameras with you. You might be more comfortable not carrying around heavy rucksacks, though keep your coats and jackets on as it's quite cold in the museum garden today.
I'd like to tell you about the different areas of the museum. Just inside, and outside the main gallery, we have an area called Four Seasons. Here you can watch a four-minute animation of a woodland scene. It was designed especially for the museum by a group of young people on a film studies course, and it's beautiful. Children absolutely love it, but then, so do adults.
The main gallery's called Town and Country. It includes a photographic collection of prize-winning sheep and shepherds. Leaving Town and Country, you enter Farmhouse Kitchen, which is ... well, self-explanatory. Here we have the oldest collection of equipment for making butter and cheese in the country. And this morning, a specialist cheesemaker will be giving demonstrations of how it's produced. You may even get to try some.
After that, you can go in two directions. To the right is a staircase that takes you up to a landing from where you can look down on the galleries. To the left is a room called A Year on the Farm. There's lots of seating here as sometimes we use the room for school visits, so it's a good place to stop for a rest. If you're feeling competitive, you can take our memory test in which you answer questions about things you've seen in the museum.
The next area's called Wagon Walk. This contains farm carts from nearly every part of the country. It's surprising how much regional variation there was. Beside the carts are display boards with information about each one. The carts are old and fragile, so we ask you to keep your children close to you and ensure they don't climb on the carts.
From Wagon Walk, you can either make your way back to reception or go out into the garden - or even go back to take another look in the galleries. In the far corner of the garden is Bees are Magic, but we're redeveloping this area so you can't visit that at the moment. You can still buy our honey in the shop, though.
Finally, there's The Pond, which contains all kinds of interesting wildlife. There are baby ducks that are only a few days old, as well as tiny frogs. The Pond isn't deep and there's a fence around it, so it's perfectly safe for children.`,
    },
    {
      id: 'c18-l4-p3',
      partNumber: 3,
      title: 'Part 3: Origami as an Educational Tool',
      context: 'Two trainee teachers, Seb and Lia, discuss a video lesson of children doing origami and plan their upcoming maths teaching practice.',
      audioUrl: '/audio/listening/c18_test4_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `TUTOR: So now I want you to discuss the lesson we've just been watching on the video and think about the ways in which origami can be a useful educational tool. Can you all work with the person sitting next to you...
SEB: I had no idea that such a simple thing like folding squares of paper to make the shape of something like a bird could be such an amazing tool. It's made me see origami in a whole new light.
LIA: I know. It was interesting to see the educational skills the children were developing by doing origami.
SEB: On the video you could see them really listening hard to make sure they did all the steps in the right order to make the bird.
LIA: That's right. In this lesson they were working individually but it would also be interesting to see if the children could work out how to make something simple without being given any direction. That would help with building teamwork as well.
SEB: Yes, but much more of a challenge. One thing that really stood out for me was that the children were all having fun while being taught something new. Which is a key aim of any lesson with this age group. And although these kids had no problems with folding the paper, with younger children you could do origami to help practise fine motor skills.
LIA: Absolutely. Shall we talk about the individual children we saw on the video? I wrote all their names down and took some notes.
SEB: Yes, I did too.
LIA: OK, good. Let's start with Sid.
SEB: He was interesting because before they started doing the origami, he was being quite disruptive.
LIA: Yes. He really benefited from having to use his hands - it helped him to settle down and start concentrating.
SEB: Yes, I noticed that too. What about Jack? I noticed he seemed to want to work things out for himself.
LIA: Mmm. You could see him trying out different things rather than asking the teacher for help.
SEB: What did you make of Naomi?
LIA: She seemed to be losing interest at one point but then she decided she wanted her mouse to be the best and that motivated her to try harder. She didn't seem satisfied with hers in the end, though.
SEB: No.
LIA: Anya was such a star. She listened so carefully and then produced the perfect bird with very little effort.
SEB: Mmm - I think the teacher could have increased the level of difficulty for her.
LIA: Maybe. I think it was the first time Zara had come across origami. She looked as if she didn't really get what was going on.
LIA: She seemed unsure about what she was supposed to do, but in the end hers didn't turn out too badly.
SEB: Yeah. I'm sure it was a positive learning experience for her.
LIA: Mmm.
LIA: I think one reason why the origami activity worked so well in this class was that the teacher was well prepared.
SEB: Right. I think it would have taken me ages to prepare examples, showing each of the steps involved in making the bird. But that was a really good idea. The children could see what they were aiming for - and much better for them to be able to hold something, rather than just looking at pictures.
LIA: Mmm - those physical examples supported her verbal explanations really well.
SEB: It's strange that origami isn't used more widely. Why do you think that is?
LIA: Well, teachers may just feel it's not that appealing to children who are used to doing everything on computers, especially boys. Even if they're aware of the benefits.
SEB: Oh, I don't know. It's no different to any other craft activity. I bet it's because so many teachers are clumsy like me.
LIA: That's true – too much effort required if you're not good with your hands.
SEB: Well, anyway, I think we should try it out in our maths teaching practice with Year 3. I can see using origami is a really engaging way of reinforcing children's knowledge of geometric shapes, like they were doing in the video, but I think it would also work really well for presenting fractions, which is coming up soon.
LIA: Good idea - that's something most of the kids in that class might struggle with. Origami would also be good practice for using symmetry - but I think they did that last term.
SEB: OK - well let's try and get some ideas together and plan the lesson next week.
TUTOR: OK, if you could all stop...`,
    },
    {
      id: 'c18-l4-p4',
      partNumber: 4,
      title: 'Part 4: Victor Hugo and His House on Guernsey',
      context: 'A lecture on the life and career of French writer Victor Hugo, focusing on his exile and residence on Guernsey.',
      audioUrl: '/audio/listening/c18_test4_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 45,
      checkPauseSeconds: 60,
      transcript: `The person I've chosen to talk about is the French writer Victor Hugo - many people have heard of him because his novel, Les Misérables, which he wrote in 1862, is famous around the world. It became a stage musical in the 1980s, and a film version was also released in 2012. So, some of us, I'm sure, have a pretty general idea of the plot, but we know much less about the author. Today, I'm going to provide a little more insight into this talented man and I'm going to talk particularly about the home he had on the island of Guernsey in the British Channel Islands.
But first, his early career... as I've said, he was a writer, he was at the height of his career in Paris and he was very highly regarded by his colleagues. As far as literature was concerned, he was the leading figure of the Romantic movement. However, as well as being a literary genius, he also gave many speeches about issues like the level of poverty in his society. He felt very strongly about this and about other areas where change was needed, like education. This kind of outspoken criticism was not well liked by the rulers of France and, eventually, the emperor - Napoleon III – told Victor Hugo to leave Paris and not return; in other words, he sent him into exile.
So Victor Hugo was forced to reside in other parts of Europe. Guernsey was actually his third place of exile and he landed there in 1855. He produced a lot while on Guernsey - including Les Misérables – and to do this, he had to spend a great deal of time in the home that he had there. This was a property that he bought using the money he'd made in France from the publication of a collection of his poetry. It was the only property he ever owned, and he was very proud of it.
The property Victor Hugo bought on Guernsey was a large, five-storey house in the capital town of St Peter Port and he lived there for 15 years, returning to France in 1870 when Napoleon's Empire collapsed. He decorated and furnished each level, or floor, of the house in unique and wonderful ways, and many people consider the inside of the house to be a 'work of art'. Today it's a museum that attracts 200,000 visitors a year.
He lived in the house with his family... and portraits of its members still hang in rooms on the ground floor, along with drawings that he did during his travels that he felt were important to him. In other ground-floor rooms, there are huge tapestries that he would have designed and loved. The walls are covered in dark wood panelling that Victor Hugo created himself using wooden furniture that he bought in the market. The items were relatively inexpensive, and he used them to create intricate carvings. They gave an atmosphere on the lower level that was shadowy and rather solemn.
On the next level of the house there are two impressive lounges, where he entertained his guests. One lounge has entirely red furnishings, such as sofas and wall coverings, and the other blue. There's a strong Chinese influence in these areas in things like the wallpaper pattern and the lamps - which he would have made himself by copying original versions. His library, where he left many of his favourite books, forms the hallway to the third floor and was a comfortable area where he could relax and enjoy his afternoons.
And then, at the very top of the house, there's a room called the Lookout – called that because it looks out over the harbour. In contrast to the rather dark lower levels, it's full of light and was like a glass office where he would write until lunchtime - often at his desk.
So, Victor Hugo was a man of many talents, but he was also true to his values. While living in his house on Guernsey, he entertained many other famous writers, but he also invited a large group of local children from the deprived areas of the island to dinner once a week. What's more, he served them their food, which was an extraordinary gesture for the time period.
In 1927, the house was owned by his relatives, and they decided to donate it to the city of Paris. It has since been restored using photographs from the period and, as I mentioned earlier, is now a museum that is open to the public.`,
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // Part 1: Questions 1–10
    {
      id: 'c18-l4-g1',
      partNumber: 1,
      title: 'Questions 1–10: Note Completion',
      instruction: 'Complete the notes below. Write ONE WORD AND/OR A NUMBER for each answer.',
      questionType: 'note_completion',
      maxWords: 1,
      maxNumbers: 1,
      prompt: `Job details from employment agency

Role: [[1]]
Location: Fordham [[2]] Centre, [[3]] Road, Fordham

Work involves:
• dealing with enquiries
• making [[4]] and reorganising them
• maintaining the internal [[5]]
• general administration

Requirements:
• [[6]] (essential)
• a calm and [[7]] manner
• good IT skills

Other information:
• a [[8]] job - further opportunities may be available
• hours: 7.45 a.m. to [[9]] p.m. Monday to Friday
• [[10]] is available onsite`,
      questions: [
        {
          id: 'c18-l4-q1',
          questionNumber: 1,
          prompt: 'Role: [1]',
          answerKey: 'receptionist',
          acceptedAlternatives: ['receptionist'],
          explanation: "Greg states: 'So this is a position for a receptionist – I believe you've done that sort of work before?'",
          transcriptExcerpt: "So this is a position for a receptionist – I believe you've done that sort of work before?",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c18-l4-q2',
          questionNumber: 2,
          prompt: 'Location: Fordham [2] Centre',
          answerKey: 'Medical',
          acceptedAlternatives: ['Medical', 'medical'],
          explanation: "Greg explains: 'Well, this job's in Fordham, so not too far away for you, and it's at the medical centre there.'",
          transcriptExcerpt: "this job's in Fordham, so not too far away for you, and it's at the medical centre there.",
          audioTimestampSeconds: 37,
        },
        {
          id: 'c18-l4-q3',
          questionNumber: 3,
          prompt: '[3] Road, Fordham',
          answerKey: 'Chastons',
          acceptedAlternatives: ['Chastons', 'chastons'],
          explanation: "Greg gives the address: 'It's quite near the station, on Chastons Road... that's C-H-A-S-T-O-N-S.'",
          transcriptExcerpt: "It's quite near the station, on Chastons Road. Chastons Road - that's C-H-A-S-T-O-N-S.",
          audioTimestampSeconds: 43,
        },
        {
          id: 'c18-l4-q4',
          questionNumber: 4,
          prompt: 'making [4] and reorganising them',
          answerKey: 'appointments',
          acceptedAlternatives: ['appointments', 'appointment'],
          explanation: "Greg specifies: 'Yes, and you'd also be involved in making appointments, whether face to face or on the phone. And rescheduling them if necessary.'",
          transcriptExcerpt: "you'd also be involved in making appointments, whether face to face or on the phone. And rescheduling them if necessary.",
          audioTimestampSeconds: 57,
        },
        {
          id: 'c18-l4-q5',
          questionNumber: 5,
          prompt: 'maintaining the internal [5]',
          answerKey: 'database',
          acceptedAlternatives: ['database'],
          explanation: "Greg adds: 'And another of your duties would be keeping the centre's database up-to-date.'",
          transcriptExcerpt: "And another of your duties would be keeping the centre's database up-to-date.",
          audioTimestampSeconds: 68,
        },
        {
          id: 'c18-l4-q6',
          questionNumber: 6,
          prompt: '[6] (essential)',
          answerKey: 'experience',
          acceptedAlternatives: ['experience'],
          explanation: "Greg explains: 'one thing they do require is someone with experience, and you did mention your work at the sports centre when you came in to see us.'",
          transcriptExcerpt: "one thing they do require is someone with experience",
          audioTimestampSeconds: 93,
        },
        {
          id: 'c18-l4-q7',
          questionNumber: 7,
          prompt: 'a calm and [7] manner',
          answerKey: 'confident',
          acceptedAlternatives: ['confident'],
          explanation: "Greg says: 'they want someone who can cope with that and stay calm, and at the same time be confident when interacting with the public.'",
          transcriptExcerpt: "stay calm, and at the same time be confident when interacting with the public.",
          audioTimestampSeconds: 110,
        },
        {
          id: 'c18-l4-q8',
          questionNumber: 8,
          prompt: 'a [8] job - further opportunities may be available',
          answerKey: 'temporary',
          acceptedAlternatives: ['temporary'],
          explanation: "Greg points out: 'this isn't a permanent job, it's temporary, so the contract would be just to the end of September. But they do say that there could be further opportunities after that.'",
          transcriptExcerpt: "this isn't a permanent job, it's temporary, so the contract would be just to the end of September.",
          audioTimestampSeconds: 135,
        },
        {
          id: 'c18-l4-q9',
          questionNumber: 9,
          prompt: 'hours: 7.45 a.m. to [9] p.m. Monday to Friday',
          answerKey: '1.15',
          acceptedAlternatives: ['1.15', '1:15', '1.15 p.m.', '1:15 p.m.', 'one fifteen', 'quarter past one'],
          explanation: "Julie asks what time she would finish, and Greg replies: 'One fifteen.'",
          transcriptExcerpt: "What time would I finish? One fifteen.",
          audioTimestampSeconds: 154,
        },
        {
          id: 'c18-l4-q10',
          questionNumber: 10,
          prompt: '[10] is available onsite',
          answerKey: 'parking',
          acceptedAlternatives: ['parking', 'car parking'],
          explanation: "Julie asks: 'is there parking available for staff at the centre?' and Greg confirms: 'Yes, there is, and it's also on a bus route.'",
          transcriptExcerpt: "is there parking available for staff at the centre? Yes, there is",
          audioTimestampSeconds: 165,
        },
      ],
    },

    // Part 2: Questions 11–14 (Multiple Choice Single)
    {
      id: 'c18-l4-g2',
      partNumber: 2,
      title: 'Questions 11–14: Multiple Choice',
      instruction: 'Choose the correct letter, A, B or C.',
      questionType: 'listening_multiple_choice_single',
      questions: [
        {
          id: 'c18-l4-q11',
          questionNumber: 11,
          prompt: 'The museum building was originally',
          options: MC_Q11_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "The guide explains: 'where we're standing at the moment is the entrance to a large building that was constructed in 1880 as the home of a local businessman, Alfred Palmer... It was later sold and became a hall of residence for students in 1911, and a museum in 1951.' So originally it was a private home.",
          transcriptExcerpt: 'constructed in 1880 as the home of a local businessman, Alfred Palmer',
          audioTimestampSeconds: 28,
        },
        {
          id: 'c18-l4-q12',
          questionNumber: 12,
          prompt: 'The university uses part of the museum building as',
          options: MC_Q12_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "The guide states: 'the university uses the main part of the building. You may see students going into the building for lessons, but it's not open to museum visitors, I'm afraid.' Lessons equate to teaching rooms.",
          transcriptExcerpt: 'You may see students going into the building for lessons',
          audioTimestampSeconds: 46,
        },
        {
          id: 'c18-l4-q13',
          questionNumber: 13,
          prompt: 'What does the guide say about the entrance fee?',
          options: MC_Q13_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "The guide notes: 'we've managed to keep entry to the museum free... We do have a donation box just over there so feel free to give whatever amount you consider appropriate.' Thus visitors decide whether or not they wish to pay.",
          transcriptExcerpt: 'keep entry to the museum free... donation box just over there so feel free to give whatever amount you consider appropriate.',
          audioTimestampSeconds: 66,
        },
        {
          id: 'c18-l4-q14',
          questionNumber: 14,
          prompt: 'What are visitors advised to leave in the cloakroom?',
          options: MC_Q14_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "The guide advises: 'Unlike other museums, photography is allowed here, so you might like to keep your cameras with you. You might be more comfortable not carrying around heavy rucksacks, though keep your coats and jackets on as it's quite cold in the museum garden today.' Heavy rucksacks are bags.",
          transcriptExcerpt: 'You might be more comfortable not carrying around heavy rucksacks, though keep your coats and jackets on',
          audioTimestampSeconds: 84,
        },
      ],
    },

    // Part 2: Questions 15–20 (Matching Areas of Museum)
    {
      id: 'c18-l4-g3',
      partNumber: 2,
      title: 'Questions 15–20: Matching Museum Areas',
      instruction: 'What information does the speaker give about each of the following areas of the museum? Choose SIX answers from the box and write the correct letter, A-H, next to Questions 15-20.',
      questionType: 'matching',
      optionsList: MATCHING_MUSEUM_AREAS,
      questions: [
        {
          id: 'c18-l4-q15',
          questionNumber: 15,
          prompt: 'Four Seasons',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation: "The guide explains: 'Here you can watch a four-minute animation of a woodland scene. It was designed especially for the museum by a group of young people on a film studies course, and it's beautiful.' This corresponds to F: 'It features something created by students.'",
          transcriptExcerpt: 'designed especially for the museum by a group of young people on a film studies course',
          audioTimestampSeconds: 105,
        },
        {
          id: 'c18-l4-q16',
          questionNumber: 16,
          prompt: 'Farmhouse Kitchen',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: "The guide says: 'Here we have the oldest collection of equipment for making butter and cheese in the country. And this morning, a specialist cheesemaker will be giving demonstrations of how it's produced.' A specialist cheesemaker is an expert (G).",
          transcriptExcerpt: 'this morning, a specialist cheesemaker will be giving demonstrations of how it\'s produced.',
          audioTimestampSeconds: 125,
        },
        {
          id: 'c18-l4-q17',
          questionNumber: 17,
          prompt: 'A Year on the Farm',
          answerKey: 'E',
          acceptedAlternatives: ['E'],
          explanation: "The guide mentions: 'If you're feeling competitive, you can take our memory test in which you answer questions about things you've seen in the museum.' A memory test with questions is a quiz for visitors (E).",
          transcriptExcerpt: 'take our memory test in which you answer questions about things you\'ve seen in the museum.',
          audioTimestampSeconds: 144,
        },
        {
          id: 'c18-l4-q18',
          questionNumber: 18,
          prompt: 'Wagon Walk',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "The guide states: 'The carts are old and fragile, so we ask you to keep your children close to you and ensure they don't climb on the carts.' This matches A: 'Parents must supervise their children.'",
          transcriptExcerpt: 'we ask you to keep your children close to you and ensure they don\'t climb on the carts.',
          audioTimestampSeconds: 160,
        },
        {
          id: 'c18-l4-q19',
          questionNumber: 19,
          prompt: 'Bees are Magic',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "The guide explains: 'In the far corner of the garden is Bees are Magic, but we're redeveloping this area so you can't visit that at the moment.' Since you cannot visit, it is closed today (C).",
          transcriptExcerpt: "we're redeveloping this area so you can't visit that at the moment.",
          audioTimestampSeconds: 174,
        },
        {
          id: 'c18-l4-q20',
          questionNumber: 20,
          prompt: 'The Pond',
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "The guide describes: 'Finally, there's The Pond, which contains all kinds of interesting wildlife. There are baby ducks that are only a few days old, as well as tiny frogs.' Baby ducks only a few days old are new things to see (B).",
          transcriptExcerpt: 'There are baby ducks that are only a few days old, as well as tiny frogs.',
          audioTimestampSeconds: 188,
        },
      ],
    },

    // Part 3: Questions 21 & 22 (Multiple Choice Multi-Select)
    {
      id: 'c18-l4-g4',
      partNumber: 3,
      title: 'Questions 21 and 22: Multiple Choice',
      instruction: 'Choose TWO letters, A-E. Which TWO educational skills were shown in the video of children doing origami?',
      questionType: 'listening_multiple_choice_multi',
      allowAnyOrder: true,
      questions: [
        multiQuestion(
          'c18-l4-q21',
          21,
          'Which TWO educational skills were shown in the video of children doing origami? (First skill)',
          MC_Q21_OPTIONS,
          ['B', 'D'],
          "Seb says: 'On the video you could see them really listening hard to make sure they did all the steps in the right order to make the bird' (B: following instructions). He adds: 'One thing that really stood out for me was that the children were all having fun while being taught something new' (D: learning through play).",
          'listening hard to make sure they did all the steps in the right order... children were all having fun while being taught something new',
          35
        ),
        multiQuestion(
          'c18-l4-q22',
          22,
          'Which TWO educational skills were shown in the video of children doing origami? (Second skill)',
          MC_Q21_OPTIONS,
          ['B', 'D'],
          "Seb says: 'On the video you could see them really listening hard to make sure they did all the steps in the right order to make the bird' (B: following instructions). He adds: 'One thing that really stood out for me was that the children were all having fun while being taught something new' (D: learning through play).",
          'listening hard to make sure they did all the steps in the right order... children were all having fun while being taught something new',
          35
        ),
      ],
    },

    // Part 3: Questions 23–27 (Matching Children to Comments)
    {
      id: 'c18-l4-g5',
      partNumber: 3,
      title: 'Questions 23–27: Matching Comments to Children',
      instruction: 'Which comment do the students make about each of the following children in the video? Choose FIVE answers from the box and write the correct letter, A-G, next to Questions 23-27.',
      questionType: 'matching',
      optionsList: MATCHING_CHILDREN_COMMENTS,
      questions: [
        {
          id: 'c18-l4-q23',
          questionNumber: 23,
          prompt: 'Sid',
          answerKey: 'D',
          acceptedAlternatives: ['D'],
          explanation: "Lia notes about Sid: 'He really benefited from having to use his hands - it helped him to settle down and start concentrating.' Settling down and concentrating corresponds to D: 'seemed to find the activity calming.'",
          transcriptExcerpt: 'it helped him to settle down and start concentrating.',
          audioTimestampSeconds: 68,
        },
        {
          id: 'c18-l4-q24',
          questionNumber: 24,
          prompt: 'Jack',
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "Seb says Jack 'seemed to want to work things out for himself,' and Lia adds: 'You could see him trying out different things rather than asking the teacher for help.' This matches A: 'demonstrated independence.'",
          transcriptExcerpt: 'trying out different things rather than asking the teacher for help.',
          audioTimestampSeconds: 82,
        },
        {
          id: 'c18-l4-q25',
          questionNumber: 25,
          prompt: 'Naomi',
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Lia comments: 'she decided she wanted her mouse to be the best and that motivated her to try harder.' Wanting hers to be the best matches C: 'developed a competitive attitude.'",
          transcriptExcerpt: 'she decided she wanted her mouse to be the best and that motivated her to try harder.',
          audioTimestampSeconds: 95,
        },
        {
          id: 'c18-l4-q26',
          questionNumber: 26,
          prompt: 'Anya',
          answerKey: 'G',
          acceptedAlternatives: ['G'],
          explanation: "Lia observes: 'Anya was such a star. She listened so carefully and then produced the perfect bird with very little effort.' Very little effort matches G: 'seemed to find the activity easy.'",
          transcriptExcerpt: 'produced the perfect bird with very little effort.',
          audioTimestampSeconds: 108,
        },
        {
          id: 'c18-l4-q27',
          questionNumber: 27,
          prompt: 'Zara',
          answerKey: 'F',
          acceptedAlternatives: ['F'],
          explanation: "Seb says: 'She looked as if she didn't really get what was going on,' and Lia adds: 'She seemed unsure about what she was supposed to do.' This matches F: 'seemed confused.'",
          transcriptExcerpt: "She looked as if she didn't really get what was going on... She seemed unsure about what she was supposed to do",
          audioTimestampSeconds: 122,
        },
      ],
    },

    // Part 3: Questions 28–30 (Multiple Choice Single)
    {
      id: 'c18-l4-g6',
      partNumber: 3,
      title: 'Questions 28–30: Multiple Choice',
      instruction: 'Choose the correct letter, A, B or C.',
      questionType: 'listening_multiple_choice_single',
      questions: [
        {
          id: 'c18-l4-q28',
          questionNumber: 28,
          prompt: 'Before starting an origami activity in class, the students think it is important for the teacher to',
          options: MC_Q28_OPTIONS,
          answerKey: 'A',
          acceptedAlternatives: ['A'],
          explanation: "Seb says: 'I think it would have taken me ages to prepare examples, showing each of the steps involved in making the bird. But that was a really good idea. The children could see what they were aiming for - and much better for them to be able to hold something, rather than just looking at pictures.' This matches A: 'make models that demonstrate the different stages.'",
          transcriptExcerpt: 'prepare examples, showing each of the steps involved in making the bird. But that was a really good idea.',
          audioTimestampSeconds: 147,
        },
        {
          id: 'c18-l4-q29',
          questionNumber: 29,
          prompt: 'The students agree that some teachers might be unwilling to use origami in class because',
          options: MC_Q29_OPTIONS,
          answerKey: 'B',
          acceptedAlternatives: ['B'],
          explanation: "Seb suggests: 'I bet it's because so many teachers are clumsy like me,' and Lia agrees: 'That's true – too much effort required if you're not good with your hands.' Not being good with one's hands means lacking the necessary skills (B).",
          transcriptExcerpt: "so many teachers are clumsy like me. That's true – too much effort required if you're not good with your hands.",
          audioTimestampSeconds: 172,
        },
        {
          id: 'c18-l4-q30',
          questionNumber: 30,
          prompt: 'Why do the students decide to use origami in their maths teaching practice?',
          options: MC_Q30_OPTIONS,
          answerKey: 'C',
          acceptedAlternatives: ['C'],
          explanation: "Seb states: 'I think it would also work really well for presenting fractions, which is coming up soon.' Presenting a topic that is coming up soon means introducing a new concept (C).",
          transcriptExcerpt: 'work really well for presenting fractions, which is coming up soon.',
          audioTimestampSeconds: 192,
        },
      ],
    },

    // Part 4: Questions 31–40 (Note Completion)
    {
      id: 'c18-l4-g7',
      partNumber: 4,
      title: 'Questions 31–40: Note Completion',
      instruction: 'Complete the notes below. Write ONE WORD ONLY for each answer.',
      questionType: 'note_completion',
      maxWords: 1,
      maxNumbers: 0,
      prompt: `Victor Hugo

His novel, Les Misérables
• It has been adapted for theatre and cinema.
• We know more about its overall [[31]] than about its author.

His early career
• In Paris, his career was successful and he led the Romantic movement.
• He spoke publicly about social issues, such as [[32]] and education.
• Napoleon III disliked his views and exiled him.

His exile from France
• Victor Hugo had to live elsewhere in [[33]].
• He used his income from the sale of some [[34]] he had written to buy a house on Guernsey.

His house on Guernsey
• Victor Hugo lived in this house until the end of the Empire in France.
• The ground floor contains portraits, [[35]] and tapestries that he valued.
• He bought cheap [[36]] made of wood and turned this into beautiful wall carvings.
• The first floor consists of furnished areas with wallpaper and [[37]] that have a Chinese design.
• The library still contains many of his favourite books.
• He wrote in a room at the top of the house that had a view of the [[38]].
• He entertained other writers as well as poor [[39]] in his house.
• Victor Hugo's [[40]] gave ownership of the house to the city of Paris in 1927.`,
      questions: [
        {
          id: 'c18-l4-q31',
          questionNumber: 31,
          prompt: 'We know more about its overall [31] than about its author.',
          answerKey: 'plot',
          acceptedAlternatives: ['plot'],
          explanation: "The speaker says: 'So, some of us, I'm sure, have a pretty general idea of the plot, but we know much less about the author.'",
          transcriptExcerpt: 'have a pretty general idea of the plot, but we know much less about the author.',
          audioTimestampSeconds: 28,
        },
        {
          id: 'c18-l4-q32',
          questionNumber: 32,
          prompt: 'He spoke publicly about social issues, such as [32] and education.',
          answerKey: 'poverty',
          acceptedAlternatives: ['poverty'],
          explanation: "The speaker explains: 'However, as well as being a literary genius, he also gave many speeches about issues like the level of poverty in his society... and about other areas where change was needed, like education.'",
          transcriptExcerpt: 'issues like the level of poverty in his society. He felt very strongly about this and about other areas where change was needed, like education.',
          audioTimestampSeconds: 53,
        },
        {
          id: 'c18-l4-q33',
          questionNumber: 33,
          prompt: 'Victor Hugo had to live elsewhere in [33].',
          answerKey: 'Europe',
          acceptedAlternatives: ['Europe', 'europe'],
          explanation: "The speaker states: 'So Victor Hugo was forced to reside in other parts of Europe. Guernsey was actually his third place of exile...'",
          transcriptExcerpt: 'forced to reside in other parts of Europe.',
          audioTimestampSeconds: 75,
        },
        {
          id: 'c18-l4-q34',
          questionNumber: 34,
          prompt: 'He used his income from the sale of some [34] he had written to buy a house on Guernsey.',
          answerKey: 'poetry',
          acceptedAlternatives: ['poetry'],
          explanation: "The speaker mentions: 'This was a property that he bought using the money he'd made in France from the publication of a collection of his poetry.'",
          transcriptExcerpt: "money he'd made in France from the publication of a collection of his poetry.",
          audioTimestampSeconds: 91,
        },
        {
          id: 'c18-l4-q35',
          questionNumber: 35,
          prompt: 'The ground floor contains portraits, [35] and tapestries that he valued.',
          answerKey: 'drawings',
          acceptedAlternatives: ['drawings'],
          explanation: "The speaker describes: 'portraits of its members still hang in rooms on the ground floor, along with drawings that he did during his travels that he felt were important to him.'",
          transcriptExcerpt: 'portraits of its members still hang in rooms on the ground floor, along with drawings that he did during his travels',
          audioTimestampSeconds: 121,
        },
        {
          id: 'c18-l4-q36',
          questionNumber: 36,
          prompt: 'He bought cheap [36] made of wood and turned this into beautiful wall carvings.',
          answerKey: 'furniture',
          acceptedAlternatives: ['furniture'],
          explanation: "The speaker says: 'The walls are covered in dark wood panelling that Victor Hugo created himself using wooden furniture that he bought in the market. The items were relatively inexpensive, and he used them to create intricate carvings.'",
          transcriptExcerpt: 'using wooden furniture that he bought in the market. The items were relatively inexpensive, and he used them to create intricate carvings.',
          audioTimestampSeconds: 135,
        },
        {
          id: 'c18-l4-q37',
          questionNumber: 37,
          prompt: 'The first floor consists of furnished areas with wallpaper and [37] that have a Chinese design.',
          answerKey: 'lamps',
          acceptedAlternatives: ['lamps'],
          explanation: "The speaker notes: 'There's a strong Chinese influence in these areas in things like the wallpaper pattern and the lamps - which he would have made himself by copying original versions.'",
          transcriptExcerpt: "strong Chinese influence in these areas in things like the wallpaper pattern and the lamps",
          audioTimestampSeconds: 156,
        },
        {
          id: 'c18-l4-q38',
          questionNumber: 38,
          prompt: 'He wrote in a room at the top of the house that had a view of the [38].',
          answerKey: 'harbour',
          acceptedAlternatives: ['harbour', 'harbor'],
          explanation: "The speaker describes: 'there's a room called the Lookout – called that because it looks out over the harbour.'",
          transcriptExcerpt: 'there\'s a room called the Lookout – called that because it looks out over the harbour.',
          audioTimestampSeconds: 176,
        },
        {
          id: 'c18-l4-q39',
          questionNumber: 39,
          prompt: 'He entertained other writers as well as poor [39] in his house.',
          answerKey: 'children',
          acceptedAlternatives: ['children'],
          explanation: "The speaker explains: 'While living in his house on Guernsey, he entertained many other famous writers, but he also invited a large group of local children from the deprived areas of the island to dinner once a week.'",
          transcriptExcerpt: 'invited a large group of local children from the deprived areas of the island to dinner once a week.',
          audioTimestampSeconds: 198,
        },
        {
          id: 'c18-l4-q40',
          questionNumber: 40,
          prompt: "Victor Hugo's [40] gave ownership of the house to the city of Paris in 1927.",
          answerKey: 'relatives',
          acceptedAlternatives: ['relatives'],
          explanation: "The speaker concludes: 'In 1927, the house was owned by his relatives, and they decided to donate it to the city of Paris.'",
          transcriptExcerpt: 'In 1927, the house was owned by his relatives, and they decided to donate it to the city of Paris.',
          audioTimestampSeconds: 215,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 18 Academic Listening Test 4',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 30,
    parts,
    questionGroups,
    audioConfig: {
      mode: 'part_audios',
      overallAudioUrl: '',
      partAudios: {
        1: '/audio/listening/c18_test4_part1.mp3',
        2: '/audio/listening/c18_test4_part2.mp3',
        3: '/audio/listening/c18_test4_part3.mp3',
        4: '/audio/listening/c18_test4_part4.mp3',
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

export async function ingestCambridge18ListeningTest4(authorId?: string) {
  const data = getCambridge18ListeningTest4Data();

  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups);

  if (validationErrors.length > 0) {
    throw new Error(
      `Cambridge 18 Listening Test 4 validation failed:\n${validationErrors.join('\n')}`
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
          audio_mode = ?,
          is_free_tier = 1,
          updated_at = ?
      WHERE id = ?
    `).run(data.title, data.audioMode, now, testId);
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
