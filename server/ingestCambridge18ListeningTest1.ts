import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q11_OPTIONS = [
  { key: 'A', text: 'They are too small.' },
  { key: 'B', text: 'There are not enough of them.' },
  { key: 'C', text: 'Some of them are very close together.' },
];

const MC_Q12_OPTIONS = [
  { key: 'A', text: 'The age of volunteers is less important than other factors.' },
  { key: 'B', text: 'Young volunteers are less reliable than older ones.' },
  { key: 'C', text: 'Most volunteers are about 60 years old.' },
];

const MC_Q13_OPTIONS = [
  { key: 'A', text: 'It is continuous.' },
  { key: 'B', text: 'It is conducted by a manager.' },
  { key: 'C', text: 'It takes place online.' },
];

const MC_Q14_OPTIONS = [
  { key: 'A', text: 'their financial situation' },
  { key: 'B', text: 'their level of commitment' },
  { key: 'C', text: 'their work experience' },
  { key: 'D', text: 'their ambition' },
  { key: 'E', text: 'their availability' },
];

const MATCHING_Q16_OPTIONS = [
  { key: 'A', text: 'experience on stage' },
  { key: 'B', text: 'original, new ideas' },
  { key: 'C', text: 'parenting skills' },
  { key: 'D', text: 'an understanding of food and diet' },
  { key: 'E', text: 'retail experience' },
  { key: 'F', text: 'a good memory' },
  { key: 'G', text: 'a good level of fitness' },
];

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'Her view of the speaker was blocked.' },
  { key: 'B', text: 'She was unable to find an empty seat.' },
  { key: 'C', text: 'The students next to her were talking.' },
];

const MC_Q22_OPTIONS = [
  { key: 'A', text: 'It has become more competitive than it used to be.' },
  { key: 'B', text: 'There is more variety in it than they had realised.' },
  { key: 'C', text: 'Some areas of it are more exciting than others.' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'unfair to them at times.' },
  { key: 'B', text: 'hard for them to follow.' },
  { key: 'C', critical: false, text: 'critical of the industry.' },
];

const MC_Q24_OPTIONS = [
  { key: 'A', text: 'when they received the advice' },
  { key: 'B', text: 'how much advice was given' },
  { key: 'C', text: 'who gave the advice' },
];

const MC_Q25_OPTIONS = [
  { key: 'A', text: 'which is the best career in fashion.' },
  { key: 'B', text: 'when to choose a career in fashion.' },
  { key: 'C', text: 'why they would like a career in fashion.' },
];

const MC_Q26_OPTIONS = [
  { key: 'A', text: 'He is realistic about the practice.' },
  { key: 'B', text: 'He feels the practice is dishonest.' },
  { key: 'C', text: 'He thinks others want to change the practice.' },
];

const MC_Q27_OPTIONS = [
  { key: 'A', text: 'being dishonest to her employer' },
  { key: 'B', text: 'paying too much attention to how she looked' },
  { key: 'C', text: 'expecting to become well known' },
  { key: 'D', text: 'trying to earn a lot of money' },
  { key: 'E', text: 'openly disliking her client' },
];

const MC_Q29_OPTIONS = [
  { key: 'A', text: 'the reasons people return fashion items' },
  { key: 'B', text: 'how much time people have to shop for clothes' },
  { key: 'C', text: "fashion designs people want but can't find" },
  { key: 'D', text: 'the best time of year for fashion buying' },
  { key: 'E', text: 'the most popular fashion sizes' },
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

export function getCambridge18ListeningTest1Data(): {
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
      id: 'c18-l1-p1',
      partNumber: 1,
      title: 'Part 1: Transport survey',
      context: 'Sadie Jones answers questions for a survey about transport in her local area.',
      audioUrl: '/audio/listening/c18_test1_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `MAN: Excuse me. Would you mind if I asked you some questions? We're doing a survey on transport.
SADIE: Yes, that's OK.
MAN: First of all, can I take your name?
SADIE: Yes. It's Sadie Jones.
MAN: Thanks very much. And could I have your date of birth - just the year will do, actually. Is that all right?
SADIE: Yes, that's fine. It's 1991.
MAN: So next your postcode, please.
SADIE: It's DW30 7YZ.
MAN: Great. Thanks. Is that in Wells?
SADIE: No it's actually in Harborne - Wells isn't far from there, though.
MAN: I really like that area. My grandmother lived there when I was a kid.
SADIE: Yes, it is nice.
MAN: Right, so now I want to ask you some questions about how you travelled here today. Did you use public transport?
SADIE: Yes. I came by bus.
MAN: OK. And that was today. It's the 24th of April, isn't it?
SADIE: Isn't it the 25th? No, actually, you're right.
MAN: Ha ha. And what was the reason for your trip today? I can see you've got some shopping with you.
SADIE: Yes. I did some shopping but the main reason I came here was to go to the dentist.
MAN: That's not much fun. Hope it was nothing serious.
SADIE: No, it was just a check-up. It's fine.
MAN: Good. Do you normally travel by bus into the city centre?
SADIE: Yes. I stopped driving in ages ago because parking was so difficult to find and it costs so much.
MAN: I see.
SADIE: The bus is much more convenient too. It only takes about 30 minutes.
MAN: That's good. So where did you start your journey?
SADIE: At the bus stop on Claxby Street.
MAN: Is that C-L-A-X-B-Y?
SADIE: That's right.
MAN: And how satisfied with the service are you? Do you have any complaints?
SADIE: Well, as I said, it's very convenient and quick when it's on time, but this morning it was late. Only about 10 minutes, but still.
MAN: Yes, I understand that's annoying. And what about the timetable? Do you have any comments about that?
SADIE: Mmm. I suppose I mainly use the bus during the day, but any time I've been in town in the evening - for dinner or at the cinema - I've noticed you have to wait a long time for a bus - there aren't that many.
MAN: OK, thanks. So now I'd like to ask you about your car use.
SADIE: Well, I have got a car but I don't use it that often. Mainly just to go to the supermarket. But that's about it really. My husband uses it at the weekends to go to the golf club.
MAN: And what about a bicycle?
SADIE: I don't actually have one at the moment.
MAN: What about the city bikes you can rent? Do you ever use those?
SADIE: No - I'm not keen on cycling there because of all the pollution. But I would like to get a bike - it would be good to use it to get to work.
MAN: So why haven't you got one now?
SADIE: Well, I live in a flat - on the second floor and it doesn't have any storage - so we'd have to leave it in the hall outside the flat.
MAN: I see. OK. Well, I think that's all.`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 22, quote: "It's DW30 7YZ." },
        { questionNumber: 2, timestampSeconds: 38, quote: "It's the 24th of April, isn't it? Isn't it the 25th? No, actually, you're right." },
        { questionNumber: 3, timestampSeconds: 50, quote: "the main reason I came here was to go to the dentist." },
        { questionNumber: 4, timestampSeconds: 62, quote: "I stopped driving in ages ago because parking was so difficult to find and it costs so much." },
        { questionNumber: 5, timestampSeconds: 76, quote: "At the bus stop on Claxby Street. Is that C-L-A-X-B-Y? That's right." },
        { questionNumber: 6, timestampSeconds: 90, quote: "it's very convenient and quick when it's on time, but this morning it was late." },
        { questionNumber: 7, timestampSeconds: 106, quote: "any time I've been in town in the evening - for dinner or at the cinema - I've noticed you have to wait a long time for a bus" },
        { questionNumber: 8, timestampSeconds: 120, quote: "I have got a car but I don't use it that often. Mainly just to go to the supermarket." },
        { questionNumber: 9, timestampSeconds: 135, quote: "No - I'm not keen on cycling there because of all the pollution." },
        { questionNumber: 10, timestampSeconds: 148, quote: "I live in a flat - on the second floor and it doesn't have any storage" },
      ],
    },
    {
      id: 'c18-l1-p2',
      partNumber: 2,
      title: 'Part 2: Becoming a volunteer for ACE',
      context: 'A speaker talks to potential new volunteers about the ACE voluntary organisation.',
      audioUrl: '/audio/listening/c18_test1_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Good evening, everyone. Let me start by welcoming you all to this talk and thanking you for taking the time to consider joining ACE voluntary organisation. ACE offers support to people and services in the local area and we're now looking for more volunteers to help us do this.

By the way, I hope you're all comfortable - we have brought in extra seats so that no one has to stand, but it does mean that the people at the back of the room may be a bit squashed. We'll only be here for about half an hour so, hopefully, that's OK.

One of the first questions we're often asked is how old you need to be to volunteer. Well, you can be as young as 16 or you can be 60 or over; it all depends on what type of voluntary work you want to do. Other considerations, such as reliability, are crucial in voluntary work and age isn't related to these, in our experience.

Another question we get asked relates to training. Well, there's plenty of that and it's all face-to-face. What's more, training doesn't end when you start working for us - it takes place before, during and after periods of work. Often, it's run by other experienced volunteers as managers tend to prefer to get on with other things.

Now, I would ask you to consider a couple of important issues before you decide to apply for voluntary work. We don't worry about why you want to be a volunteer - people have many different reasons that range from getting work experience to just doing something they've always wanted to do. But it is critical that you have enough hours in the day for whatever role we agree is suitable for you - if being a volunteer becomes stressful then it's best not to do it at all. You may think that your income is important, but we don't ask about that. It's up to you to decide if you can work without earning money. What we value is dedication. Some of our most loyal volunteers earn very little themselves but still give their full energy to the work they do with us.

OK, so let's take a look at some of the work areas that we need volunteers for and the sort of things that would help you in those.

You may wish simply to help us raise money. If you have the creativity to come up with an imaginative or novel way of fundraising, we'd be delighted, as standing in the local streets or shops with a collection box can be rather boring!

One outdoor activity that we need volunteers for is litter collection and for this it's useful if you can walk for long periods, sometimes uphill. Some of our regular collectors are quite elderly, but very active and keen to protect the environment.

If you enjoy working with children, we have three vacancies for what are called 'playmates'. These volunteers help children learn about staying healthy through a range of out-of-school activities. You don't need to have children yourself, but it's good if you know something about nutrition and can give clear instructions.

If that doesn't appeal to you, maybe you would be interested in helping out at our story club for disabled children, especially if you have done some acting. We put on three performances a year based on books they have read and we're always looking for support with the theatrical side of this.

The last area I'll mention today is first aid. Volunteers who join this group can end up teaching others in vulnerable groups who may be at risk of injury. Initially, though, your priority will be to take in a lot of information and not forget any important steps or details.

Right, so does anyone have any questions?`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 25, quote: "we have brought in extra seats so that no one has to stand, but it does mean that the people at the back of the room may be a bit squashed." },
        { questionNumber: 12, timestampSeconds: 45, quote: "Other considerations, such as reliability, are crucial in voluntary work and age isn't related to these, in our experience." },
        { questionNumber: 13, timestampSeconds: 65, quote: "What's more, training doesn't end when you start working for us - it takes place before, during and after periods of work." },
        { questionNumber: 14, timestampSeconds: 88, quote: "What we value is dedication. Some of our most loyal volunteers earn very little themselves but still give their full energy to the work they do with us." },
        { questionNumber: 15, timestampSeconds: 98, quote: "But it is critical that you have enough hours in the day for whatever role we agree is suitable for you" },
        { questionNumber: 16, timestampSeconds: 115, quote: "If you have the creativity to come up with an imaginative or novel way of fundraising, we'd be delighted" },
        { questionNumber: 17, timestampSeconds: 130, quote: "for this it's useful if you can walk for long periods, sometimes uphill. Some of our regular collectors are quite elderly, but very active" },
        { questionNumber: 18, timestampSeconds: 145, quote: "These volunteers help children learn about staying healthy... it's good if you know something about nutrition" },
        { questionNumber: 19, timestampSeconds: 160, quote: "helping out at our story club for disabled children, especially if you have done some acting." },
        { questionNumber: 20, timestampSeconds: 175, quote: "Initially, though, your priority will be to take in a lot of information and not forget any important steps or details." },
      ],
    },
    {
      id: 'c18-l1-p3',
      partNumber: 3,
      title: 'Part 3: Talk on jobs in fashion design',
      context: 'Hugo and Chantal discuss a presentation they attended about careers in fashion design.',
      audioUrl: '/audio/listening/c18_test1_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `HUGO: Hi Chantal. What did you think of the talk, then?
CHANTAL: Hi Hugo. I thought it was good once I'd moved seats.
HUGO: Oh - were the people beside you chatting or something?
CHANTAL: It wasn't that. I went early so that I'd get a seat and not have to stand, but then this guy sat right in front of me and he was so tall!
HUGO: It's hard to see through people's heads, isn't it?
CHANTAL: Impossible! Anyway, to answer your question, I thought it was really interesting, especially what the speaker said about the job market.
HUGO: Me too. I mean we know we're going into a really competitive field so it's obvious that we may struggle to get work.
CHANTAL: That's right - and we know we can't all have that 'dream job'.
HUGO: Yeah, but it looks like there's a whole range of ... areas of work that we hadn't even thought of - like fashion journalism, for instance.
CHANTAL: Yeah - I wasn't expecting so many career options.
HUGO: Mmm. Overall, she had quite a strong message, didn't she?
CHANTAL: She did. She kept saying things like 'I know you all think this, but ...' and then she'd tell us how it really is.
HUGO: Perhaps she thinks students are a bit narrow-minded about the industry.
CHANTAL: It was a bit harsh, though! We know it's a tough industry.
HUGO: Yeah - and we're only first years, after all. We've got a lot to learn.
CHANTAL: Exactly. Do you think our secondary-school education should have been more career-focused?
HUGO: Well, we had numerous talks on careers, which was good, but none of them were very inspiring. They could have asked more people like today's speaker to talk to us.
CHANTAL: I agree. We were told about lots of different careers - just when we needed to be, but not by the experts who really know stuff.
HUGO: So did today's talk influence your thoughts on what career you'd like to take up in the future?
CHANTAL: Well, I promised myself that I'd go through this course and keep an open mind till the end.
HUGO: But I think it's better to pick an area of the industry now and then aim to get better and better at it.
CHANTAL: Well, I think we'll just have to differ on that issue!
HUGO: One thing's for certain, though. From what she said, we'll be unpaid assistants in the industry for quite a long time.
CHANTAL: Mmm.
HUGO: I'm prepared for that, aren't you?
CHANTAL: Actually, I'm not going to accept that view.
HUGO: Really? But she knows it's the case - and everyone else says the same.
CHANTAL: That doesn't mean it has to be true for me.
HUGO: OK. Well - I hope you're right!
CHANTAL: I thought the speaker's account of her first job was fascinating.
HUGO: Yeah - she admitted she was lucky to get work being a personal dresser for a musician. She didn't even apply for the job and there she was getting paid to choose all his clothes.
CHANTAL: It must have felt amazing - though she said all she was looking for back then was experience, not financial reward.
HUGO: Mmm. And then he was so mean, telling her she was more interested in her own appearance than his!
CHANTAL: But - she did realise he was right about that, which really made me think. I'm always considering my own clothes but now I can see you should be focusing on your client!
HUGO: She obviously regretted losing the job.
CHANTAL: Well, as she said, she should have hidden her negative feelings about him, but she didn't.
HUGO: It was really brave the way she picked herself up and took that job in retail. Fancy working in a shop after that!
CHANTAL: Yeah - well, she recommended we all do it at some point. I guess as a designer you'd get to find out some useful information, like how big or small the average shopper is.
HUGO: I think that's an issue for manufacturers, not designers. However, it would be useful to know if there's a gap in the market - you know, an item that no one's stocking but that consumers are looking for.
CHANTAL: Yeah, people don't give up searching. They also take things back to the store if they aren't right.
HUGO: Yeah. Imagine you worked in an expensive shop and you found out the garments sold there were being returned because they ... fell apart in the wash!
CHANTAL: Yeah, it would be good to know that kind of thing.
HUGO: Yeah.`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 20, quote: "I went early so that I'd get a seat and not have to stand, but then this guy sat right in front of me and he was so tall! ... It's hard to see through people's heads, isn't it? Impossible!" },
        { questionNumber: 22, timestampSeconds: 45, quote: "looks like there's a whole range of ... areas of work that we hadn't even thought of ... I wasn't expecting so many career options." },
        { questionNumber: 23, timestampSeconds: 68, quote: "It was a bit harsh, though! We know it's a tough industry. Yeah - and we're only first years, after all." },
        { questionNumber: 24, timestampSeconds: 88, quote: "They could have asked more people like today's speaker to talk to us. I agree... but not by the experts who really know stuff." },
        { questionNumber: 25, timestampSeconds: 108, quote: "keep an open mind till the end ... But I think it's better to pick an area of the industry now ... Well, I think we'll just have to differ on that issue!" },
        { questionNumber: 26, timestampSeconds: 130, quote: "we'll be unpaid assistants in the industry for quite a long time. I'm prepared for that, aren't you? ... she knows it's the case - and everyone else says the same." },
        { questionNumber: 27, timestampSeconds: 165, quote: "telling her she was more interested in her own appearance than his! But - she did realise he was right about that" },
        { questionNumber: 28, timestampSeconds: 175, quote: "Well, as she said, she should have hidden her negative feelings about him, but she didn't." },
        { questionNumber: 29, timestampSeconds: 205, quote: "However, it would be useful to know if there's a gap in the market - you know, an item that no one's stocking but that consumers are looking for." },
        { questionNumber: 30, timestampSeconds: 215, quote: "you found out the garments sold there were being returned because they ... fell apart in the wash! Yeah, it would be good to know that kind of thing." },
      ],
    },
    {
      id: 'c18-l1-p4',
      partNumber: 4,
      title: 'Part 4: Elephant translocation',
      context: 'A lecture about the relocation and conservation of elephants in Malawi.',
      audioUrl: '/audio/listening/c18_test1_part4.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `For my presentation today I want to tell you about how groups of elephants have been moved and settled in new reserves. This is known as translocation and has been carried out in Malawi in Africa in recent years. The reason this is being done is because of overpopulation of elephants in some areas.

Overpopulation is a good problem to have and not one we tend to hear about very often. In Malawi's Majete National Park the elephant population had been wiped out by poachers, who killed the elephants for their ivory. But in 2003, the park was restocked and effective law enforcement was introduced. Since then, not a single elephant has been poached. In this safe environment, the elephant population boomed. Breeding went so well that there were more elephants than the park could support.

This led to a number of problems. Firstly, there was more competition for food, which meant that some elephants were suffering from hunger. As there was a limit to the amount of food in the national park, some elephants began looking further afield. Elephants were routinely knocking down fences around the park, which then had to be repaired at a significant cost.

To solve this problem, the decision was made to move dozens of elephants from Majete National Park to Nkhotakota Wildlife Park, where there were no elephants. But, obviously, attempting to move significant numbers of elephants to a new home 300 kilometres away is quite a challenge.

So how did this translocation process work in practice?

Elephants were moved in groups of between eight and twenty, all belonging to one family. Because relationships are very important to elephants, they all had to be moved at the same time. A team of vets and park rangers flew over the park in helicopters and targeted a group, which were rounded up and directed to a designated open plain.

The vets then used darts to immobilise the elephants - this was a tricky manoeuvre, as they not only had to select the right dose of tranquiliser for different-sized elephants but they had to dart the elephants as they were running around. This also had to be done as quickly as possible so as to minimise the stress caused. As soon as the elephants began to flop onto the ground, the team moved in to take care of them.

To avoid the risk of suffocation, the team had to make sure none of the elephants were lying on their chests because their lungs could be crushed in this position. So all the elephants had to be placed on their sides. One person stayed with each elephant while they waited for the vets to do checks. It was very important to keep an eye on their breathing - if there were fewer than six breaths per minute, the elephant would need urgent medical attention. Collars were fitted to the matriarch in each group so their movements could be tracked in their new home. Measurements were taken of each elephant's tusks - elephants with large tusks would be at greater risk from poachers - and also of their feet. The elephants were then taken to a recovery area before being loaded onto trucks and transported to their new home.

The elephants translocated to Nkhotakota settled in very well and the project has generally been accepted to have been a huge success - and not just for the elephants. Employment prospects have improved enormously, contributing to rising living standards for the whole community. Poaching is no longer an issue, as former poachers are able to find more reliable sources of income. In fact, many of them volunteered to give up their weapons, as they were no longer of any use to them.

More than two dozen elephants have been born at Nkhotakota since relocation. With an area of more than 1,800 square kilometres, there's plenty of space for the elephant population to continue to grow. Their presence is also helping to rebalance Nkhotakota's damaged ecosystem and providing a sustainable conservation model, which could be replicated in other parks. All this has been a big draw for tourism, which contributes five times more than the illegal wildlife trade to GDP, and this is mainly because of the elephants. There's also been a dramatic rise in interest ...`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 48, quote: "Elephants were routinely knocking down fences around the park, which then had to be repaired at a significant cost." },
        { questionNumber: 32, timestampSeconds: 75, quote: "Elephants were moved in groups of between eight and twenty, all belonging to one family." },
        { questionNumber: 33, timestampSeconds: 85, quote: "A team of vets and park rangers flew over the park in helicopters and targeted a group" },
        { questionNumber: 34, timestampSeconds: 105, quote: "This also had to be done as quickly as possible so as to minimise the stress caused." },
        { questionNumber: 35, timestampSeconds: 120, quote: "To avoid the risk of suffocation... So all the elephants had to be placed on their sides." },
        { questionNumber: 36, timestampSeconds: 135, quote: "It was very important to keep an eye on their breathing - if there were fewer than six breaths per minute" },
        { questionNumber: 37, timestampSeconds: 150, quote: "Measurements were taken of each elephant's tusks ... and also of their feet." },
        { questionNumber: 38, timestampSeconds: 175, quote: "Employment prospects have improved enormously, contributing to rising living standards for the whole community." },
        { questionNumber: 39, timestampSeconds: 190, quote: "In fact, many of them volunteered to give up their weapons, as they were no longer of any use to them." },
        { questionNumber: 40, timestampSeconds: 215, quote: "All this has been a big draw for tourism, which contributes five times more than the illegal wildlife trade to GDP" },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-10 (Notes Completion)
    {
      id: 'c18-l1-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `Transport survey

Name: Sadie Jones
Year of birth: 1991
Postcode: [[1]]

Travelling by bus
Date of bus journey: [[2]]
Reason for trip: shopping and visit to the [[3]]
Travelled by bus because cost of [[4]] too high
Got on bus at [[5]] Street

Complaints about bus service:
• bus today was [[6]]
• frequency of buses in the [[7]]

Travelling by car
• Goes to the [[8]] by car

Travelling by bicycle
• Dislikes travelling by bike in the city centre because of the [[9]]
• Doesn't own a bike because of a lack of [[10]]`,
      questions: [
        {
          id: 'c18-l1-q1',
          questionNumber: 1,
          prompt: 'Postcode: [1]',
          answerKey: 'DW30 7YZ',
          acceptedAlternatives: ['DW30 7YZ', 'DW307YZ', 'dw30 7yz', 'dw307yz'],
          explanation: "Sadie gives her postcode clearly: 'It's DW30 7YZ.'",
          transcriptExcerpt: "It's DW30 7YZ.",
          audioTimestampSeconds: 22,
        },
        {
          id: 'c18-l1-q2',
          questionNumber: 2,
          prompt: 'Date of bus journey: [2]',
          answerKey: '24 April',
          acceptedAlternatives: ['24 April', '24th April', '24th of April', 'April 24', '24', '24th april'],
          explanation: "The interviewer asks: 'It's the 24th of April, isn't it?' and Sadie replies: 'Isn't it the 25th? No, actually, you're right.'",
          transcriptExcerpt: "It's the 24th of April, isn't it? Isn't it the 25th? No, actually, you're right.",
          audioTimestampSeconds: 38,
        },
        {
          id: 'c18-l1-q3',
          questionNumber: 3,
          prompt: 'Reason for trip: shopping and visit to the [3]',
          answerKey: 'dentist',
          acceptedAlternatives: ['dentist'],
          explanation: "Sadie states: 'I did some shopping but the main reason I came here was to go to the dentist.'",
          transcriptExcerpt: "the main reason I came here was to go to the dentist.",
          audioTimestampSeconds: 50,
        },
        {
          id: 'c18-l1-q4',
          questionNumber: 4,
          prompt: 'Travelled by bus because cost of [4] too high',
          answerKey: 'parking',
          acceptedAlternatives: ['parking'],
          explanation: "Sadie explains: 'I stopped driving in ages ago because parking was so difficult to find and it costs so much.'",
          transcriptExcerpt: "I stopped driving in ages ago because parking was so difficult to find and it costs so much.",
          audioTimestampSeconds: 62,
        },
        {
          id: 'c18-l1-q5',
          questionNumber: 5,
          prompt: 'Got on bus at [5] Street',
          answerKey: 'Claxby',
          acceptedAlternatives: ['Claxby', 'claxby'],
          explanation: "Sadie confirms where she boarded: 'At the bus stop on Claxby Street.' The interviewer asks: 'Is that C-L-A-X-B-Y?' and she replies: 'That's right.'",
          transcriptExcerpt: "At the bus stop on Claxby Street. Is that C-L-A-X-B-Y? That's right.",
          audioTimestampSeconds: 76,
        },
        {
          id: 'c18-l1-q6',
          questionNumber: 6,
          prompt: 'bus today was [6]',
          answerKey: 'late',
          acceptedAlternatives: ['late'],
          explanation: "Sadie mentions: 'it's very convenient and quick when it's on time, but this morning it was late. Only about 10 minutes, but still.'",
          transcriptExcerpt: "it's very convenient and quick when it's on time, but this morning it was late.",
          audioTimestampSeconds: 90,
        },
        {
          id: 'c18-l1-q7',
          questionNumber: 7,
          prompt: 'frequency of buses in the [7]',
          answerKey: 'evening',
          acceptedAlternatives: ['evening', 'evenings'],
          explanation: "Sadie says: 'any time I've been in town in the evening - for dinner or at the cinema - I've noticed you have to wait a long time for a bus - there aren't that many.'",
          transcriptExcerpt: "any time I've been in town in the evening - for dinner or at the cinema - I've noticed you have to wait a long time for a bus",
          audioTimestampSeconds: 106,
        },
        {
          id: 'c18-l1-q8',
          questionNumber: 8,
          prompt: 'Goes to the [8] by car',
          answerKey: 'supermarket',
          acceptedAlternatives: ['supermarket'],
          explanation: "Sadie notes: 'Well, I have got a car but I don't use it that often. Mainly just to go to the supermarket.'",
          transcriptExcerpt: "I have got a car but I don't use it that often. Mainly just to go to the supermarket.",
          audioTimestampSeconds: 120,
        },
        {
          id: 'c18-l1-q9',
          questionNumber: 9,
          prompt: 'Dislikes travelling by bike in the city centre because of the [9]',
          answerKey: 'pollution',
          acceptedAlternatives: ['pollution'],
          explanation: "Sadie says: 'No - I'm not keen on cycling there because of all the pollution.'",
          transcriptExcerpt: "No - I'm not keen on cycling there because of all the pollution.",
          audioTimestampSeconds: 135,
        },
        {
          id: 'c18-l1-q10',
          questionNumber: 10,
          prompt: "Doesn't own a bike because of a lack of [10]",
          answerKey: 'storage',
          acceptedAlternatives: ['storage'],
          explanation: "Sadie explains: 'Well, I live in a flat - on the second floor and it doesn't have any storage - so we'd have to leave it in the hall outside the flat.'",
          transcriptExcerpt: "I live in a flat - on the second floor and it doesn't have any storage",
          audioTimestampSeconds: 148,
        },
      ],
    },

    // PART 2: Questions 11-13 (Multiple Choice)
    {
      id: 'c18-l1-g2',
      partNumber: 2,
      questionType: 'multiple_choice',
      title: 'Questions 11–13',
      instructions: 'Choose the correct letter, A, B or C.\nBecoming a volunteer for ACE',
      startQuestionNumber: 11,
      endQuestionNumber: 13,
      questions: [
        {
          id: 'c18-l1-q11',
          questionNumber: 11,
          prompt: 'Why does the speaker apologise about the seats?',
          options: MC_Q11_OPTIONS,
          answerKey: 'C',
          explanation: "The speaker explains: 'we have brought in extra seats so that no one has to stand, but it does mean that the people at the back of the room may be a bit squashed.' Having people squashed together means some seats are very close together (C).",
          transcriptExcerpt: "we have brought in extra seats so that no one has to stand, but it does mean that the people at the back of the room may be a bit squashed.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c18-l1-q12',
          questionNumber: 12,
          prompt: 'What does the speaker say about the age of volunteers?',
          options: MC_Q12_OPTIONS,
          answerKey: 'A',
          explanation: "The speaker states: 'Other considerations, such as reliability, are crucial in voluntary work and age isn't related to these, in our experience.' Therefore, age is less important than other factors like reliability (A).",
          transcriptExcerpt: "Other considerations, such as reliability, are crucial in voluntary work and age isn't related to these, in our experience.",
          audioTimestampSeconds: 45,
        },
        {
          id: 'c18-l1-q13',
          questionNumber: 13,
          prompt: 'What does the speaker say about training?',
          options: MC_Q13_OPTIONS,
          answerKey: 'A',
          explanation: "The speaker says: 'training doesn't end when you start working for us - it takes place before, during and after periods of work', which indicates that training is continuous (A).",
          transcriptExcerpt: "What's more, training doesn't end when you start working for us - it takes place before, during and after periods of work.",
          audioTimestampSeconds: 65,
        },
      ],
    },

    // PART 2: Questions 14-15 (Multiple Choice - Pick 2)
    {
      id: 'c18-l1-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 14 and 15',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO issues does the speaker ask the audience to consider before they apply to be volunteers?',
      startQuestionNumber: 14,
      endQuestionNumber: 15,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q14_OPTIONS,
      questions: [
        multiQuestion(
          'c18-l1-q14',
          14,
          'Which TWO issues does the speaker ask the audience to consider before they apply to be volunteers? (First choice)',
          MC_Q14_OPTIONS,
          ['B', 'E'],
          "The speaker emphasises: 'it is critical that you have enough hours in the day for whatever role we agree is suitable for you' (availability, E) and 'What we value is dedication. Some of our most loyal volunteers earn very little themselves but still give their full energy to the work they do with us.' (level of commitment, B).",
          "What we value is dedication ... But it is critical that you have enough hours in the day for whatever role we agree is suitable for you",
          88
        ),
        multiQuestion(
          'c18-l1-q15',
          15,
          'Which TWO issues does the speaker ask the audience to consider before they apply to be volunteers? (Second choice)',
          MC_Q14_OPTIONS,
          ['B', 'E'],
          "The speaker emphasises: 'it is critical that you have enough hours in the day for whatever role we agree is suitable for you' (availability, E) and 'What we value is dedication. Some of our most loyal volunteers earn very little themselves but still give their full energy to the work they do with us.' (level of commitment, B).",
          "What we value is dedication ... But it is critical that you have enough hours in the day for whatever role we agree is suitable for you",
          98
        ),
      ],
    },

    // PART 2: Questions 16-20 (Matching)
    {
      id: 'c18-l1-g4',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 16–20',
      instructions: 'What does the speaker suggest would be helpful for each of the following areas of voluntary work?\nChoose FIVE answers from the box and write the correct letter, A–G, next to Questions 16–20.',
      startQuestionNumber: 16,
      endQuestionNumber: 20,
      optionsList: MATCHING_Q16_OPTIONS,
      questions: [
        {
          id: 'c18-l1-q16',
          questionNumber: 16,
          prompt: 'Fundraising',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'B',
          explanation: "The speaker notes: 'If you have the creativity to come up with an imaginative or novel way of fundraising, we'd be delighted' ('imaginative or novel way' = original, new ideas, B).",
          transcriptExcerpt: "If you have the creativity to come up with an imaginative or novel way of fundraising, we'd be delighted",
          audioTimestampSeconds: 115,
        },
        {
          id: 'c18-l1-q17',
          questionNumber: 17,
          prompt: 'Litter collection',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'G',
          explanation: "The speaker explains: 'for this it's useful if you can walk for long periods, sometimes uphill. Some of our regular collectors are quite elderly, but very active' ('walk for long periods, uphill / very active' = a good level of fitness, G).",
          transcriptExcerpt: "for this it's useful if you can walk for long periods, sometimes uphill. Some of our regular collectors are quite elderly, but very active",
          audioTimestampSeconds: 130,
        },
        {
          id: 'c18-l1-q18',
          questionNumber: 18,
          prompt: "'Playmates'",
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'D',
          explanation: "The speaker states: 'These volunteers help children learn about staying healthy... it's good if you know something about nutrition and can give clear instructions.' ('nutrition' = an understanding of food and diet, D).",
          transcriptExcerpt: "These volunteers help children learn about staying healthy... it's good if you know something about nutrition",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c18-l1-q19',
          questionNumber: 19,
          prompt: 'Story club',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'A',
          explanation: "The speaker mentions: 'helping out at our story club for disabled children, especially if you have done some acting... support with the theatrical side of this.' ('acting / theatrical' = experience on stage, A).",
          transcriptExcerpt: "helping out at our story club for disabled children, especially if you have done some acting.",
          audioTimestampSeconds: 160,
        },
        {
          id: 'c18-l1-q20',
          questionNumber: 20,
          prompt: 'First aid',
          options: MATCHING_Q16_OPTIONS,
          answerKey: 'F',
          explanation: "The speaker says: 'Initially, though, your priority will be to take in a lot of information and not forget any important steps or details.' ('not forget any important steps or details' = a good memory, F).",
          transcriptExcerpt: "Initially, though, your priority will be to take in a lot of information and not forget any important steps or details.",
          audioTimestampSeconds: 175,
        },
      ],
    },

    // PART 3: Questions 21-26 (Multiple Choice)
    {
      id: 'c18-l1-g5',
      partNumber: 3,
      questionType: 'multiple_choice',
      title: 'Questions 21–26',
      instructions: 'Choose the correct letter, A, B or C.\nTalk on jobs in fashion design',
      startQuestionNumber: 21,
      endQuestionNumber: 26,
      questions: [
        {
          id: 'c18-l1-q21',
          questionNumber: 21,
          prompt: 'What problem did Chantal have at the start of the talk?',
          options: MC_Q21_OPTIONS,
          answerKey: 'A',
          explanation: "Chantal explains: 'I went early so that I'd get a seat and not have to stand, but then this guy sat right in front of me and he was so tall! ... It's hard to see through people's heads, isn't it? Impossible!' This means her view of the speaker was blocked (A).",
          transcriptExcerpt: "I went early so that I'd get a seat and not have to stand, but then this guy sat right in front of me and he was so tall! ... It's hard to see through people's heads, isn't it? Impossible!",
          audioTimestampSeconds: 20,
        },
        {
          id: 'c18-l1-q22',
          questionNumber: 22,
          prompt: 'What were Hugo and Chantal surprised to hear about the job market?',
          options: MC_Q22_OPTIONS,
          answerKey: 'B',
          explanation: "Hugo observes: 'it looks like there's a whole range of ... areas of work that we hadn't even thought of - like fashion journalism, for instance.' Chantal agrees: 'Yeah - I wasn't expecting so many career options.' They were surprised by the variety (B).",
          transcriptExcerpt: "looks like there's a whole range of ... areas of work that we hadn't even thought of ... I wasn't expecting so many career options.",
          audioTimestampSeconds: 45,
        },
        {
          id: 'c18-l1-q23',
          questionNumber: 23,
          prompt: "Hugo and Chantal agree that the speaker's message was",
          options: MC_Q23_OPTIONS,
          answerKey: 'A',
          explanation: "Chantal comments: 'It was a bit harsh, though! We know it's a tough industry.' Hugo agrees: 'Yeah - and we're only first years, after all. We've got a lot to learn.' They agree the harsh tone was unfair to them as beginning students (A).",
          transcriptExcerpt: "It was a bit harsh, though! We know it's a tough industry. Yeah - and we're only first years, after all.",
          audioTimestampSeconds: 68,
        },
        {
          id: 'c18-l1-q24',
          questionNumber: 24,
          prompt: 'What do Hugo and Chantal criticise about their school careers advice?',
          options: MC_Q24_OPTIONS,
          answerKey: 'C',
          explanation: "Hugo remarks: 'They could have asked more people like today's speaker to talk to us.' Chantal agrees: 'We were told about lots of different careers - just when we needed to be, but not by the experts who really know stuff.' They criticise who delivered the advice (C).",
          transcriptExcerpt: "They could have asked more people like today's speaker to talk to us. I agree... but not by the experts who really know stuff.",
          audioTimestampSeconds: 88,
        },
        {
          id: 'c18-l1-q25',
          questionNumber: 25,
          prompt: 'When discussing their future, Hugo and Chantal disagree on',
          options: MC_Q25_OPTIONS,
          answerKey: 'B',
          explanation: "Chantal says: 'I promised myself that I'd go through this course and keep an open mind till the end', while Hugo argues: 'But I think it's better to pick an area of the industry now and then aim to get better and better at it.' They disagree on when to choose a career in fashion (B).",
          transcriptExcerpt: "keep an open mind till the end ... But I think it's better to pick an area of the industry now ... Well, I think we'll just have to differ on that issue!",
          audioTimestampSeconds: 108,
        },
        {
          id: 'c18-l1-q26',
          questionNumber: 26,
          prompt: 'How does Hugo feel about being an unpaid assistant?',
          options: MC_Q26_OPTIONS,
          answerKey: 'A',
          explanation: "Hugo says: 'we'll be unpaid assistants in the industry for quite a long time... I'm prepared for that, aren't you? ... she knows it's the case - and everyone else says the same.' Hugo is realistic about the standard industry practice (A).",
          transcriptExcerpt: "we'll be unpaid assistants in the industry for quite a long time. I'm prepared for that, aren't you? ... she knows it's the case - and everyone else says the same.",
          audioTimestampSeconds: 130,
        },
      ],
    },

    // PART 3: Questions 27-28 (Multiple Choice - Pick 2)
    {
      id: 'c18-l1-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 27 and 28',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO mistakes did the speaker admit she made in her first job?',
      startQuestionNumber: 27,
      endQuestionNumber: 28,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q27_OPTIONS,
      questions: [
        multiQuestion(
          'c18-l1-q27',
          27,
          'Which TWO mistakes did the speaker admit she made in her first job? (First choice)',
          MC_Q27_OPTIONS,
          ['B', 'E'],
          "Hugo notes her employer told her 'she was more interested in her own appearance than his', and Chantal agrees: 'she did realise he was right about that' (paying too much attention to how she looked, B). Chantal adds: 'as she said, she should have hidden her negative feelings about him, but she didn't' (openly disliking her client, E).",
          "more interested in her own appearance than his! But - she did realise he was right about that ... she should have hidden her negative feelings about him, but she didn't.",
          165
        ),
        multiQuestion(
          'c18-l1-q28',
          28,
          'Which TWO mistakes did the speaker admit she made in her first job? (Second choice)',
          MC_Q27_OPTIONS,
          ['B', 'E'],
          "Hugo notes her employer told her 'she was more interested in her own appearance than his', and Chantal agrees: 'she did realise he was right about that' (paying too much attention to how she looked, B). Chantal adds: 'as she said, she should have hidden her negative feelings about him, but she didn't' (openly disliking her client, E).",
          "more interested in her own appearance than his! But - she did realise he was right about that ... she should have hidden her negative feelings about him, but she didn't.",
          175
        ),
      ],
    },

    // PART 3: Questions 29-30 (Multiple Choice - Pick 2)
    {
      id: 'c18-l1-g7',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 29 and 30',
      instructions: 'Choose TWO letters, A–E.\nWhich TWO pieces of retail information do Hugo and Chantal agree would be useful?',
      startQuestionNumber: 29,
      endQuestionNumber: 30,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q29_OPTIONS,
      questions: [
        multiQuestion(
          'c18-l1-q29',
          29,
          'Which TWO pieces of retail information do Hugo and Chantal agree would be useful? (First choice)',
          MC_Q29_OPTIONS,
          ['A', 'C'],
          "Hugo highlights: 'it would be useful to know if there's a gap in the market - you know, an item that no one's stocking but that consumers are looking for' (C). Hugo also mentions knowing if 'the garments sold there were being returned because they ... fell apart in the wash!', which Chantal agrees 'would be good to know that kind of thing' (A).",
          "However, it would be useful to know if there's a gap in the market - you know, an item that no one's stocking but that consumers are looking for ... you found out the garments sold there were being returned because they ... fell apart in the wash! Yeah, it would be good to know that kind of thing.",
          205
        ),
        multiQuestion(
          'c18-l1-q30',
          30,
          'Which TWO pieces of retail information do Hugo and Chantal agree would be useful? (Second choice)',
          MC_Q29_OPTIONS,
          ['A', 'C'],
          "Hugo highlights: 'it would be useful to know if there's a gap in the market - you know, an item that no one's stocking but that consumers are looking for' (C). Hugo also mentions knowing if 'the garments sold there were being returned because they ... fell apart in the wash!', which Chantal agrees 'would be good to know that kind of thing' (A).",
          "However, it would be useful to know if there's a gap in the market - you know, an item that no one's stocking but that consumers are looking for ... you found out the garments sold there were being returned because they ... fell apart in the wash! Yeah, it would be good to know that kind of thing.",
          215
        ),
      ],
    },

    // PART 4: Questions 31-40 (Notes Completion)
    {
      id: 'c18-l1-g8',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Elephant translocation

Reasons for overpopulation at Majete National Park
• strict enforcement of anti-poaching laws
• successful breeding

Problems caused by elephant overpopulation
• greater competition, causing hunger for elephants
• damage to [[31]] in the park

The translocation process
• a suitable group of elephants from the same [[32]] was selected
• vets and park staff made use of [[33]] to help guide the elephants into an open plain
• elephants were immobilised with tranquilisers - this process had to be completed quickly to reduce [[34]]
• elephants had to be turned on their [[35]] to avoid damage to their lungs
• elephants' [[36]] had to be monitored constantly
• tracking devices were fitted to the matriarchs
• data including the size of their tusks and [[37]] was taken
• elephants were taken by truck to their new reserve

Advantages of translocation at Nkhotakota Wildlife Park
• [[38]] opportunities
• a reduction in the number of poachers and [[39]]
• an example of conservation that other parks can follow
• an increase in [[40]] as a contributor to GDP`,
      questions: [
        {
          id: 'c18-l1-q31',
          questionNumber: 31,
          prompt: 'damage to [31] in the park',
          answerKey: 'fences',
          acceptedAlternatives: ['fences', 'fence'],
          explanation: "The lecturer explains: 'Elephants were routinely knocking down fences around the park, which then had to be repaired at a significant cost.'",
          transcriptExcerpt: "Elephants were routinely knocking down fences around the park, which then had to be repaired at a significant cost.",
          audioTimestampSeconds: 48,
        },
        {
          id: 'c18-l1-q32',
          questionNumber: 32,
          prompt: 'a suitable group of elephants from the same [32] was selected',
          answerKey: 'family',
          acceptedAlternatives: ['family'],
          explanation: "The speaker states: 'Elephants were moved in groups of between eight and twenty, all belonging to one family.'",
          transcriptExcerpt: "Elephants were moved in groups of between eight and twenty, all belonging to one family.",
          audioTimestampSeconds: 75,
        },
        {
          id: 'c18-l1-q33',
          questionNumber: 33,
          prompt: 'vets and park staff made use of [33] to help guide the elephants into an open plain',
          answerKey: 'helicopters',
          acceptedAlternatives: ['helicopters', 'helicopter'],
          explanation: "The lecturer explains: 'A team of vets and park rangers flew over the park in helicopters and targeted a group, which were rounded up and directed to a designated open plain.'",
          transcriptExcerpt: "A team of vets and park rangers flew over the park in helicopters and targeted a group",
          audioTimestampSeconds: 85,
        },
        {
          id: 'c18-l1-q34',
          questionNumber: 34,
          prompt: 'elephants were immobilised with tranquilisers - this process had to be completed quickly to reduce [34]',
          answerKey: 'stress',
          acceptedAlternatives: ['stress'],
          explanation: "The lecturer notes: 'This also had to be done as quickly as possible so as to minimise the stress caused.'",
          transcriptExcerpt: "This also had to be done as quickly as possible so as to minimise the stress caused.",
          audioTimestampSeconds: 105,
        },
        {
          id: 'c18-l1-q35',
          questionNumber: 35,
          prompt: 'elephants had to be turned on their [35] to avoid damage to their lungs',
          answerKey: 'sides',
          acceptedAlternatives: ['sides', 'side'],
          explanation: "The speaker details: 'To avoid the risk of suffocation, the team had to make sure none of the elephants were lying on their chests because their lungs could be crushed in this position. So all the elephants had to be placed on their sides.'",
          transcriptExcerpt: "To avoid the risk of suffocation... So all the elephants had to be placed on their sides.",
          audioTimestampSeconds: 120,
        },
        {
          id: 'c18-l1-q36',
          questionNumber: 36,
          prompt: "elephants' [36] had to be monitored constantly",
          answerKey: 'breathing',
          acceptedAlternatives: ['breathing', 'breath'],
          explanation: "The speaker emphasizes: 'It was very important to keep an eye on their breathing - if there were fewer than six breaths per minute, the elephant would need urgent medical attention.'",
          transcriptExcerpt: "It was very important to keep an eye on their breathing - if there were fewer than six breaths per minute",
          audioTimestampSeconds: 135,
        },
        {
          id: 'c18-l1-q37',
          questionNumber: 37,
          prompt: 'data including the size of their tusks and [37] was taken',
          answerKey: 'feet',
          acceptedAlternatives: ['feet', 'foot'],
          explanation: "The lecturer states: 'Measurements were taken of each elephant's tusks - elephants with large tusks would be at greater risk from poachers - and also of their feet.'",
          transcriptExcerpt: "Measurements were taken of each elephant's tusks ... and also of their feet.",
          audioTimestampSeconds: 150,
        },
        {
          id: 'c18-l1-q38',
          questionNumber: 38,
          prompt: '[38] opportunities',
          answerKey: 'employment',
          acceptedAlternatives: ['employment'],
          explanation: "The speaker points out: 'Employment prospects have improved enormously, contributing to rising living standards for the whole community.'",
          transcriptExcerpt: "Employment prospects have improved enormously, contributing to rising living standards for the whole community.",
          audioTimestampSeconds: 175,
        },
        {
          id: 'c18-l1-q39',
          questionNumber: 39,
          prompt: 'a reduction in the number of poachers and [39]',
          answerKey: 'weapons',
          acceptedAlternatives: ['weapons', 'weapon'],
          explanation: "The speaker explains: 'Poaching is no longer an issue, as former poachers are able to find more reliable sources of income. In fact, many of them volunteered to give up their weapons, as they were no longer of any use to them.'",
          transcriptExcerpt: "In fact, many of them volunteered to give up their weapons, as they were no longer of any use to them.",
          audioTimestampSeconds: 190,
        },
        {
          id: 'c18-l1-q40',
          questionNumber: 40,
          prompt: 'an increase in [40] as a contributor to GDP',
          answerKey: 'tourism',
          acceptedAlternatives: ['tourism'],
          explanation: "The speaker concludes: 'All this has been a big draw for tourism, which contributes five times more than the illegal wildlife trade to GDP, and this is mainly because of the elephants.'",
          transcriptExcerpt: "All this has been a big draw for tourism, which contributes five times more than the illegal wildlife trade to GDP",
          audioTimestampSeconds: 215,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 18 Academic Listening Test 1',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 30,
    audioConfig: {
      mode: 'part_audios',
      overallAudioUrl: '',
      partAudios: {
        1: '/audio/listening/c18_test1_part1.mp3',
        2: '/audio/listening/c18_test1_part2.mp3',
        3: '/audio/listening/c18_test1_part3.mp3',
        4: '/audio/listening/c18_test1_part4.mp3',
      },
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge18ListeningTest1(authorId?: string) {
  const data = getCambridge18ListeningTest1Data();
  const now = new Date().toISOString();

  let resolvedAuthorId = authorId;
  if (!resolvedAuthorId) {
    const adminUser = await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get();
    resolvedAuthorId = (adminUser as any)?.id || '00000000-0000-0000-0000-000000000001';
  }

  // Validate version content conforms to schema
  const validationErrors = validateListeningTestVersion(data.parts, data.questionGroups, data.audioConfig);
  if (validationErrors.length > 0) {
    throw new Error(`Cambridge 18 Listening Test 1 validation failed: ${validationErrors.join('; ')}`);
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
