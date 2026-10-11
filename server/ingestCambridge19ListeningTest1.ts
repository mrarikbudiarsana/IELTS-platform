import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, QuestionItem } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

const MC_Q21_OPTIONS = [
  { key: 'A', text: 'receiving support from local restaurants' },
  { key: 'B', text: 'finding a good way to prevent waste' },
  { key: 'C', text: 'overcoming problems in a basic process' },
  { key: 'D', text: 'experimenting with designs and colours' },
  { key: 'E', text: 'learning how to apply 3-D printing' },
];

const MC_Q23_OPTIONS = [
  { key: 'A', text: 'for use on medical products' },
  { key: 'B', text: 'to show that food is no longer fit to eat' },
  { key: 'C', text: 'for use with drinks as well as foods' },
  { key: 'D', text: 'to provide applications for blind people' },
  { key: 'E', text: 'to indicate the weight of certain foods' },
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

export function getCambridge19ListeningTest1Data(): {
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
      id: 'c19-l1-p1',
      partNumber: 1,
      title: 'Part 1: Hinchingbrooke Country Park',
      context: 'John, a teaching assistant, phones a park ranger to ask about educational school visits to Hinchingbrooke Country Park.',
      audioUrl: '/audio/listening/c19_test1_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `SALLY: Good morning. Hinchingbrooke Country Park, Sally speaking. I'm one of the rangers.
JOHN: Oh hello. My name's John Chapman, and I'm a teaching assistant at a local primary school. I've been asked to arrange a visit to the park for two of our classes.
SALLY: OK. What would you like to know?
JOHN: Well, I'm new to this area, so perhaps you could tell me something about the park first, please.
SALLY: Of course. Altogether the park covers 170 acres, that's 69 hectares. There are three main types of habitat: wetland, grassland and woodland. The woods are well established and varied, with an oak plantation, and other areas of mixed species.
JOHN: Right.
SALLY: The wetland is quite varied, too. The original farmland was dug up around 40 years ago to extract gravel. Once this work was completed, the gravel pits filled with water, forming the two large lakes. There are also several smaller ones, ponds and a stream that flows through the park.
JOHN: OK, so I suppose with these different habitats there's quite a variety of wildlife.
SALLY: There certainly is – a lot of different species of birds and insects, and also animals like deer and rabbits.
JOHN: And I understand you organise educational visits for school parties.
SALLY: That's right. We can organise a wide range of activities and adapt them to suit all ages.
JOHN: Can you give me some examples of the activities?
SALLY: Well, one focus is on science, where we help children to discover and study plants, trees and insects. They also collect and analyse data about the things they see.
JOHN: Uhuh.
SALLY: Another focus is on geography. The park is a great environment to learn and practise reading a map and using a compass to navigate around the park.
JOHN: Do you do anything connected with history?
SALLY: Yes, we do. For instance, the children can explore how the use of the land has changed over time. Then there's leisure and tourism.
JOHN: That focuses on your visitors, I would imagine.
SALLY: Yes, mostly. The children find out about them, their requirements, the problems they may cause and how we manage these. And another subject we cover is music: here the children experiment with natural materials to create sounds and explore rhythm and tempo.
JOHN: That must be fun!
SALLY: Most children really enjoy it. And of course, all the activities are educational, too. Learning outside the classroom encourages children to be creative, and to explore and discover for themselves.
JOHN: I would imagine they get a sense of freedom that might not be a normal part of their lives.
SALLY: That's right. And very often the children discover that they can do things they didn't know they could do, and they develop new skills. This gives them greater self-confidence.
JOHN: It sounds great. So, what about the practical side of it? How much does it cost for a full-day visit? We would expect to bring between 30 and 40 children.
SALLY: If there are over 30, it costs £4.95 for each child who attends on the day. We invoice you afterwards, so you don't pay for children who can't come because of sickness, for example. There's no charge for leaders and other adults – as many as you want to bring.
JOHN: That sounds very fair. Well, thanks for all the information. I'll need to discuss it with my colleagues, and I hope to get back to you soon to make a booking.
SALLY: We'll look forward to hearing from you. Goodbye.
JOHN: Goodbye, and thank you.`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 40, quote: "the park covers 170 acres, that's 69 hectares." },
        { questionNumber: 2, timestampSeconds: 70, quote: "the two large lakes. There are also several smaller ones, ponds and a stream that flows through the park." },
        { questionNumber: 3, timestampSeconds: 110, quote: "They also collect and analyse data about the things they see." },
        { questionNumber: 4, timestampSeconds: 125, quote: "reading a map and using a compass to navigate around the park." },
        { questionNumber: 5, timestampSeconds: 150, quote: "That focuses on your visitors, I would imagine. Yes, mostly." },
        { questionNumber: 6, timestampSeconds: 170, quote: "the children experiment with natural materials to create sounds and explore rhythm and tempo." },
        { questionNumber: 7, timestampSeconds: 195, quote: "they get a sense of freedom that might not be a normal part of their lives." },
        { questionNumber: 8, timestampSeconds: 205, quote: "they develop new skills. This gives them greater self-confidence." },
        { questionNumber: 9, timestampSeconds: 235, quote: "it costs £4.95 for each child who attends on the day." },
        { questionNumber: 10, timestampSeconds: 250, quote: "There's no charge for leaders and other adults" },
      ],
    },
    {
      id: 'c19-l1-p2',
      partNumber: 2,
      title: 'Part 2: Stanthorpe Twinning Association',
      context: 'A talk to members of a town twinning association about a recent visit to France, fundraising, and plans for visitors, including a trip to Farley House.',
      audioUrl: '/audio/listening/c19_test1_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `It's great to see so many members of the Twinning Association here tonight. Since the twinning link between our two towns, Stanthorpe here in England and Malatte in France, was established, the relationship between the towns has gone from strength to strength.

Last month, 25 members of the association from Stanthorpe spent a weekend in Malatte. Our hosts had arranged a great programme. We learned how cheese is produced in the region and had the chance to taste the products. The theme park trip had to be cancelled, but we all had a great time on the final boat trip down the river – that was the real highlight.

This is a special year for the Association because it's 25 years since we were founded. In Malatte, they're planning to mark this by building a footbridge in the municipal park. We've been discussing what to do here and we've decided to plant a poplar tree in the museum gardens. We considered buying a garden seat to put there, but the authorities weren't happy with that idea.

In terms of fundraising to support our activities, we've done very well. Our pancake evening was well attended and made record profits. And everyone enjoyed the demonstration of French cookery, which was nearly as successful. Numbers for our film show were limited because of the venue so we're looking for somewhere bigger next year.

We're looking forward to welcoming our French visitors here next week, and I know that many of you here will be hosting individuals or families. The coach from France will arrive at 5 pm on Friday. Don't try to do too much that first evening as they'll be tired, so have dinner in the house or garden rather than eating out. The weather looks as if it'll be OK so you might like to plan a barbecue. Then the next morning's market day in town, and that's always a good place to stroll round.

On Saturday evening, we'll all meet up at the football club, where once again we'll have Toby Sharp and his band performing English and Scottish country songs. Toby will already be well known to many of you as last year he organised our special quiz night and presented the prizes.

Now on Sunday, we'll be taking our visitors to Farley House. You may not all be familiar with it, so here's a map to help you. You can see the car park at the bottom of the map. There's an excellent farm shop in the grounds where our visitors can buy local produce – it's in the old stables, which is the first building you come to. They're built round a courtyard, and the shop's in the far corner on the left. There's also a small café on the right as you go in.

I know that one or two of our visitors may not be all that mobile. The main entrance to the house has a lot of steps so you might want to use the disabled entry. This is on the far side of the house from the car park.

Children will probably be most interested in the adventure playground. That's at the northern end of the larger lake, in a bend on the path that leads to the lake. There's lots for children to do there.

There are a number of lovely gardens near the house. The kitchen gardens are rectangular and surrounded by a wall. They're to the north-east of the house, quite near the smaller lake. They're still in use and have a great collection of fruit and vegetables.

The Temple of the Four Winds is a bit more of a walk – but it's worth it. Take the path from the car park and go past the western sides of the stables and the house. Then when the path forks, take the right-hand path. Go up there with the woods on your left and the temple is right at the end. There are great views over the whole area.

OK, so that's . . .`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 40, quote: "the final boat trip down the river – that was the real highlight." },
        { questionNumber: 12, timestampSeconds: 65, quote: "we've decided to plant a poplar tree in the museum gardens." },
        { questionNumber: 13, timestampSeconds: 90, quote: "Our pancake evening was well attended and made record profits." },
        { questionNumber: 14, timestampSeconds: 125, quote: "have dinner in the house or garden rather than eating out." },
        { questionNumber: 15, timestampSeconds: 150, quote: "we'll have Toby Sharp and his band performing English and Scottish country songs." },
        { questionNumber: 16, timestampSeconds: 180, quote: "it's in the old stables, which is the first building you come to... the shop's in the far corner on the left." },
        { questionNumber: 17, timestampSeconds: 205, quote: "the disabled entry. This is on the far side of the house from the car park." },
        { questionNumber: 18, timestampSeconds: 225, quote: "That's at the northern end of the larger lake, in a bend on the path that leads to the lake." },
        { questionNumber: 19, timestampSeconds: 245, quote: "The kitchen gardens are rectangular and surrounded by a wall. They're to the north-east of the house, quite near the smaller lake." },
        { questionNumber: 20, timestampSeconds: 270, quote: "when the path forks, take the right-hand path... the temple is right at the end." },
      ],
    },
    {
      id: 'c19-l1-p3',
      partNumber: 3,
      title: 'Part 3: Food Technology Projects and Food Trends',
      context: 'Two students, Colin and Marie, discuss their food technology projects and predicted food trends.',
      audioUrl: '/audio/listening/c19_test1_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `COLIN: I haven't seen you for a bit, Marie.
MARIE: No. I've been busy with my project.
COLIN: You're making a vegan alternative to eggs, aren't you? Something that doesn't use animal products?
MARIE: Yes. I'm using chickpeas. I had two main aims when I first started looking for an alternative to eggs, but actually I've found chickpeas have got more advantages.
COLIN: Right.
MARIE: But how about your project on reusing waste food – you were looking at bread, weren't you?
COLIN: Yes. It's been hard work, but I've enjoyed it. The basic process was quite straightforward – breaking the stale bread down to a paste then reforming it.
MARIE: But you were using 3-D printing, weren't you, to make the paste into biscuits?
COLIN: Yeah, I'd used that before, but in this project, I had time to play around with different patterns for the biscuits and finding how I could add fruit and vegetables to make them a more appetising colour, and I was really pleased with what I managed to produce.
MARIE: It must've been a great feeling to make something appetising out of bits of old bread that would've been thrown away otherwise.
COLIN: It was. And I'm hoping that some of the restaurants in town will be interested in the biscuits. I'm going to send them some samples.
MARIE: I came across something on the internet yesterday that might interest you. It was a company that's developed touch-sensitive sensors for food labels.
COLIN: Mmm?
MARIE: It's a special sort of label on the food package. When the label's smooth, the food is fresh and then when you can feel bumps on the label, that means the food's gone bad. It started off as a project to help visually impaired people know whether food was fit to eat or not.
COLIN: Interesting. So just solid food?
MARIE: No, things like milk and juice as well. But actually, I thought it might be really good for drug storage in hospitals and pharmacies.
COLIN: Right. And coming back to food, maybe it'd be possible to use it for other things besides freshness. Like how many kilograms a joint of meat is, for example.
MARIE: Yes, there's all sorts of possibilities.
COLIN: I was reading an article about food trends predicting how eating habits might change in the next few years.
MARIE: Oh – things like more focus on local products? That seems so obvious, but the shops are still full of imported foods.
COLIN: Yes, they need to be more proactive to address that.
MARIE: And somehow motivate consumers to change, yes.
COLIN: One thing everyone's aware of is the need for a reduction in unnecessary packaging – but just about everything you buy in supermarkets is still covered in plastic. The government needs to do something about it.
MARIE: Absolutely. It's got to change.
COLIN: Do you think there'll be more interest in gluten- and lactose-free food?
MARIE: For people with allergies or food intolerances? I don't know. Lots of people I know have been buying that type of food for years now.
COLIN: Yes, even if they haven't been diagnosed with an allergy.
MARIE: That's right. One thing I've noticed is the number of branded products related to celebrity chefs – people watch them cooking on TV and then buy things like spice mixes or frozen foods with the chef's name on . . . I bought something like that once, but I won't again.
COLIN: Yeah – I bought a ready-made spice mix for chicken which was supposed to be used by a chef I'd seen on television, and it didn't actually taste of anything.
MARIE: Mm. Did the article mention 'ghost kitchens' used to produce takeaway food?
COLIN: No. What are they?
MARIE: Well, they might have the name of a restaurant, but actually they're a cooking facility just for delivery meals – the public don't ever go there. But people aren't aware of that – it's all kept very quiet.
COLIN: So people don't realise the food's not actually from the restaurant?
MARIE: Right.
COLIN: Did you know more and more people are using all sorts of different mushrooms now, to treat different health concerns? Things like heart problems?
MARIE: Hmm. They might be taking a big risk there.
COLIN: Yes, it's hard to know which varieties are safe to eat. Anyway maybe now . . .`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 60, quote: "I had time to play around with different patterns for the biscuits and finding how I could add fruit and vegetables to make them a more appetising colour" },
        { questionNumber: 22, timestampSeconds: 80, quote: "It must've been a great feeling to make something appetising out of bits of old bread that would've been thrown away otherwise." },
        { questionNumber: 23, timestampSeconds: 140, quote: "I thought it might be really good for drug storage in hospitals and pharmacies." },
        { questionNumber: 24, timestampSeconds: 155, quote: "Like how many kilograms a joint of meat is, for example." },
        { questionNumber: 25, timestampSeconds: 185, quote: "more focus on local products? ... they need to be more proactive to address that." },
        { questionNumber: 26, timestampSeconds: 205, quote: "the need for a reduction in unnecessary packaging ... The government needs to do something about it." },
        { questionNumber: 27, timestampSeconds: 230, quote: "Lots of people I know have been buying that type of food for years now." },
        { questionNumber: 28, timestampSeconds: 255, quote: "I bought something like that once, but I won't again." },
        { questionNumber: 29, timestampSeconds: 285, quote: "people aren't aware of that – it's all kept very quiet." },
        { questionNumber: 30, timestampSeconds: 315, quote: "They might be taking a big risk there. Yes, it's hard to know which varieties are safe to eat." },
      ],
    },
    {
      id: 'c19-l1-p4',
      partNumber: 4,
      title: 'Part 4: The Céide Fields',
      context: 'A student presentation about the Céide Fields, a Neolithic archaeological site in the northwest of Ireland.',
      audioUrl: '/audio/listening/c19_test1_part4.mp3',
      containsIntroPauses: false,
      introPauseSeconds: 45,
      checkPauseSeconds: 30,
      transcript: `For my presentation today, I'm going to talk about the Céide Fields in the northwest of Ireland, one of the largest Neolithic sites in the world. I recently visited this site and observed the work that is currently being done by a team of archaeologists there.

The site was first discovered in the 1930s by a local teacher, Patrick Caulfield. He noticed that when local people were digging in the bog, they were constantly hitting against what seemed to be rows of stones. He realised that these must be walls and that they must be thousands of years old for them to predate the bog which subsequently grew over them.

He wrote to the National Museum in Dublin to ask them to investigate, but no one took him seriously. It wasn't until 40 years later, when Patrick Caulfield's son Seamus, who had become an archaeologist by then, began to explore further. He inserted iron probes into the bog to map the formation of the stones, a traditional method which local people had always used for finding fuel buried in the bog for thousands of years. Carbon dating later proved that the site was over 5,000 years old and was the largest Neolithic site in Ireland.

Thanks to the bog which covers the area, the remains of the settlement at Céide Fields, which is over 5,000 years old, are extremely well-preserved. A bog is 90 percent water; its soil is so saturated that when the grasses and heathers that grow on its surface die, they don't fully decay but accumulate in layers. Objects remain so well preserved in these conditions because of the acidity of the peat and the deficiency of oxygen. At least 175 days of rain a year are required for this to happen; this part of Ireland gets an average of 225 days.

The Neolithic farmers at Céide would have enjoyed several centuries of relative peace and stability. Neolithic farmers generally lived in larger communities than their predecessors, with a number of houses built around a community building. As they lived in permanent settlements, Neolithic farmers were able to build bigger houses. These weren't round as people often assume, but rectangular with a small hole in the roof that allowed smoke to escape. This is one of many innovations and indicates that the Neolithic farmers were the first people to cook indoors. Another new technology that Neolithic settlers brought to Ireland was pottery. Fragments of Neolithic pots have been found in Céide and elsewhere in Ireland. The pots were used for many things; as well as for storing food, pots were filled with a small amount of fat and when this was set alight, they served as lamps.

It's thought that the Céide Fields were mainly used as paddocks for animals to graze in. Evidence from the Céide Fields suggests that each plot of land was of a suitable size to sustain an extended family. They may have used a system of rotational grazing in order to prevent over-grazing and to allow for plant recovery and regrowth. This must have been a year-round activity as no structures have been found which would have been used to shelter animals in the winter.

However, archaeologists believe that this way of life at Céide ceased abruptly. Why was this? Well, several factors may have contributed to the changing circumstances. The soil would have become less productive and led to the abandonment of farming. The crop rotation system was partly responsible for this as it would have been very intensive and was not sustainable. But there were also climatic pressures too. The farmers at Céide would have enjoyed a relatively dry period, but this began to change and the conditions became wetter as there was a lot more rain. It was these conditions that encouraged the bog to form over the area which survives today.

So now I'd like to show you some . . .`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 30, quote: "rows of stones. He realised that these must be walls" },
        { questionNumber: 32, timestampSeconds: 60, quote: "Patrick Caulfield's son Seamus, who had become an archaeologist" },
        { questionNumber: 33, timestampSeconds: 80, quote: "a traditional method which local people had always used for finding fuel buried in the bog" },
        { questionNumber: 34, timestampSeconds: 115, quote: "because of the acidity of the peat and the deficiency of oxygen" },
        { questionNumber: 35, timestampSeconds: 150, quote: "These weren't round as people often assume, but rectangular" },
        { questionNumber: 36, timestampSeconds: 180, quote: "when this was set alight, they served as lamps" },
        { questionNumber: 37, timestampSeconds: 200, quote: "each plot of land was of a suitable size to sustain an extended family" },
        { questionNumber: 38, timestampSeconds: 225, quote: "no structures have been found which would have been used to shelter animals in the winter" },
        { questionNumber: 39, timestampSeconds: 250, quote: "The soil would have become less productive" },
        { questionNumber: 40, timestampSeconds: 285, quote: "the conditions became wetter as there was a lot more rain" },
      ],
    },
  ];

  const mapOptions = [
    { key: 'A', text: 'Location A' },
    { key: 'B', text: 'Location B' },
    { key: 'C', text: 'Location C' },
    { key: 'D', text: 'Location D' },
    { key: 'E', text: 'Location E' },
    { key: 'F', text: 'Location F' },
    { key: 'G', text: 'Location G' },
    { key: 'H', text: 'Location H' },
  ];

  const mc15Options = (a: string, b: string, c: string) => [
    { key: 'A', text: a },
    { key: 'B', text: b },
    { key: 'C', text: c },
  ];

  const questionGroups: QuestionGroup[] = [
    // PART 1: Questions 1-10 (Note Completion)
    {
      id: 'c19-l1-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `Hinchingbrooke Country Park

The park
• Area: [[1]] hectares
• Habitats: wetland, grassland and woodland
• Wetland: lakes, ponds and a [[2]]
• Wildlife includes birds, insects and animals

Subjects studied in educational visits include
• Science: Children look at [[3]] about plants, etc.
• Geography: includes learning to use a [[4]] and compass
• History: changes in land use
• Leisure and tourism: mostly concentrates on the park's [[5]]
• Music: Children make [[6]] with natural materials, and experiment with rhythm and speed.

Benefits of outdoor educational visits
• They give children a feeling of [[7]] that they may not have elsewhere.
• Children learn new [[8]] and gain self-confidence.

Practical issues
• Cost per child: £ [[9]]
• Adults, such as [[10]], free`,
      questions: [
        {
          id: 'c19-l1-q1',
          questionNumber: 1,
          prompt: 'Area: ________ hectares',
          answerKey: '69',
          acceptedAlternatives: ['69', 'sixty-nine', 'sixty nine'],
          explanation: "Sally says: 'the park covers 170 acres, that's 69 hectares'. The number 170 is in acres, which is a distractor.",
          transcriptExcerpt: "Altogether the park covers 170 acres, that's 69 hectares.",
          audioTimestampSeconds: 40,
        },
        {
          id: 'c19-l1-q2',
          questionNumber: 2,
          prompt: 'Wetland: lakes, ponds and a ________',
          answerKey: 'stream',
          acceptedAlternatives: ['stream'],
          explanation: "Sally lists 'the two large lakes... several smaller ones, ponds and a stream that flows through the park'.",
          transcriptExcerpt: 'There are also several smaller ones, ponds and a stream that flows through the park.',
          audioTimestampSeconds: 70,
        },
        {
          id: 'c19-l1-q3',
          questionNumber: 3,
          prompt: 'Science: Children look at ________ about plants, etc.',
          answerKey: 'data',
          acceptedAlternatives: ['data'],
          explanation: "In science, children 'collect and analyse data about the things they see'.",
          transcriptExcerpt: 'They also collect and analyse data about the things they see.',
          audioTimestampSeconds: 110,
        },
        {
          id: 'c19-l1-q4',
          questionNumber: 4,
          prompt: 'Geography: includes learning to use a ________ and compass',
          answerKey: 'map',
          acceptedAlternatives: ['map'],
          explanation: "Geography activities involve 'reading a map and using a compass to navigate around the park'.",
          transcriptExcerpt: 'The park is a great environment to learn and practise reading a map and using a compass to navigate around the park.',
          audioTimestampSeconds: 125,
        },
        {
          id: 'c19-l1-q5',
          questionNumber: 5,
          prompt: "Leisure and tourism: mostly concentrates on the park's ________",
          answerKey: 'visitors',
          acceptedAlternatives: ['visitors', 'visitor'],
          explanation: "John guesses it 'focuses on your visitors' and Sally confirms: 'Yes, mostly'.",
          transcriptExcerpt: 'JOHN: That focuses on your visitors, I would imagine. SALLY: Yes, mostly.',
          audioTimestampSeconds: 150,
        },
        {
          id: 'c19-l1-q6',
          questionNumber: 6,
          prompt: 'Music: Children make ________ with natural materials, and experiment with rhythm and speed.',
          answerKey: 'sounds',
          acceptedAlternatives: ['sounds', 'sound'],
          explanation: "In music, 'the children experiment with natural materials to create sounds and explore rhythm and tempo' (tempo = speed).",
          transcriptExcerpt: 'here the children experiment with natural materials to create sounds and explore rhythm and tempo.',
          audioTimestampSeconds: 170,
        },
        {
          id: 'c19-l1-q7',
          questionNumber: 7,
          prompt: 'They give children a feeling of ________ that they may not have elsewhere.',
          answerKey: 'freedom',
          acceptedAlternatives: ['freedom'],
          explanation: "John says children 'get a sense of freedom that might not be a normal part of their lives', and Sally agrees.",
          transcriptExcerpt: 'I would imagine they get a sense of freedom that might not be a normal part of their lives.',
          audioTimestampSeconds: 195,
        },
        {
          id: 'c19-l1-q8',
          questionNumber: 8,
          prompt: 'Children learn new ________ and gain self-confidence.',
          answerKey: 'skills',
          acceptedAlternatives: ['skills', 'skill'],
          explanation: "Sally says children 'develop new skills. This gives them greater self-confidence'.",
          transcriptExcerpt: "they can do things they didn't know they could do, and they develop new skills. This gives them greater self-confidence.",
          audioTimestampSeconds: 205,
        },
        {
          id: 'c19-l1-q9',
          questionNumber: 9,
          prompt: 'Cost per child: £ ________',
          answerKey: '4.95',
          acceptedAlternatives: ['4.95', '£4.95'],
          explanation: "Sally states: 'If there are over 30, it costs £4.95 for each child who attends on the day'.",
          transcriptExcerpt: 'If there are over 30, it costs £4.95 for each child who attends on the day.',
          audioTimestampSeconds: 235,
        },
        {
          id: 'c19-l1-q10',
          questionNumber: 10,
          prompt: 'Adults, such as ________, free',
          answerKey: 'leaders',
          acceptedAlternatives: ['leaders', 'leader'],
          explanation: "Sally says: 'There's no charge for leaders and other adults'.",
          transcriptExcerpt: "There's no charge for leaders and other adults – as many as you want to bring.",
          audioTimestampSeconds: 250,
        },
      ],
    },

    // PART 2: Questions 11-15 (Multiple Choice Single)
    {
      id: 'c19-l1-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 11–15',
      instructions: 'Choose the correct letter, A, B or C.\nStanthorpe Twinning Association',
      startQuestionNumber: 11,
      endQuestionNumber: 15,
      questions: [
        {
          id: 'c19-l1-q11',
          questionNumber: 11,
          prompt: 'During the visit to Malatte, in France, members especially enjoyed',
          options: mc15Options('going to a theme park.', 'experiencing a river trip.', 'visiting a cheese factory.'),
          answerKey: 'B',
          explanation: "The speaker says the theme park trip was cancelled, and cheese production was just something they learned about, but 'the final boat trip down the river – that was the real highlight'.",
          transcriptExcerpt: 'The theme park trip had to be cancelled, but we all had a great time on the final boat trip down the river – that was the real highlight.',
          audioTimestampSeconds: 40,
        },
        {
          id: 'c19-l1-q12',
          questionNumber: 12,
          prompt: 'What will happen in Stanthorpe to mark the 25th anniversary of the Twinning Association?',
          options: mc15Options('A tree will be planted.', 'A garden seat will be bought.', 'A footbridge will be built.'),
          answerKey: 'A',
          explanation: "The footbridge is Malatte's plan, and the garden seat was rejected by the authorities. In Stanthorpe: 'we've decided to plant a poplar tree in the museum gardens'.",
          transcriptExcerpt: "We've decided to plant a poplar tree in the museum gardens. We considered buying a garden seat to put there, but the authorities weren't happy with that idea.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c19-l1-q13',
          questionNumber: 13,
          prompt: 'Which event raised most funds this year?',
          options: mc15Options('the film show', 'the pancake evening', 'the cookery demonstration'),
          answerKey: 'B',
          explanation: "'Our pancake evening was well attended and made record profits'. The cookery demonstration was 'nearly as successful', and the film show had limited numbers.",
          transcriptExcerpt: 'Our pancake evening was well attended and made record profits. And everyone enjoyed the demonstration of French cookery, which was nearly as successful.',
          audioTimestampSeconds: 90,
        },
        {
          id: 'c19-l1-q14',
          questionNumber: 14,
          prompt: 'For the first evening with the French visitors host families are advised to',
          options: mc15Options('take them for a walk round the town.', 'go to a local restaurant.', 'have a meal at home.'),
          answerKey: 'C',
          explanation: "The visitors will be tired, so hosts should 'have dinner in the house or garden rather than eating out'.",
          transcriptExcerpt: "Don't try to do too much that first evening as they'll be tired, so have dinner in the house or garden rather than eating out.",
          audioTimestampSeconds: 125,
        },
        {
          id: 'c19-l1-q15',
          questionNumber: 15,
          prompt: 'On Saturday evening there will be the chance to',
          options: mc15Options('listen to a concert.', 'watch a match.', 'take part in a competition.'),
          answerKey: 'A',
          explanation: "At the football club, 'we'll have Toby Sharp and his band performing English and Scottish country songs'. The quiz night was last year.",
          transcriptExcerpt: "On Saturday evening, we'll all meet up at the football club, where once again we'll have Toby Sharp and his band performing English and Scottish country songs.",
          audioTimestampSeconds: 150,
        },
      ],
    },

    // PART 2: Questions 16-20 (Map Labelling)
    {
      id: 'c19-l1-g3',
      partNumber: 2,
      questionType: 'plan_map_diagram_labelling',
      title: 'Questions 16–20',
      instructions: 'Label the map below.\nWrite the correct letter, A–H, next to Questions 16–20.',
      startQuestionNumber: 16,
      endQuestionNumber: 20,
      mapData: {
        imageUrl: '/diagrams/c19_l1_map_farley_house.jpeg',
        caption: 'Farley House',
      },
      optionsList: mapOptions,
      questions: [
        {
          id: 'c19-l1-q16',
          questionNumber: 16,
          prompt: 'Farm shop',
          answerKey: 'G',
          explanation: "The farm shop is 'in the old stables, which is the first building you come to... the shop's in the far corner on the left' (G).",
          transcriptExcerpt: "it's in the old stables, which is the first building you come to. They're built round a courtyard, and the shop's in the far corner on the left.",
          audioTimestampSeconds: 180,
        },
        {
          id: 'c19-l1-q17',
          questionNumber: 17,
          prompt: 'Disabled entry',
          answerKey: 'C',
          explanation: "The disabled entry 'is on the far side of the house from the car park' (C).",
          transcriptExcerpt: 'you might want to use the disabled entry. This is on the far side of the house from the car park.',
          audioTimestampSeconds: 205,
        },
        {
          id: 'c19-l1-q18',
          questionNumber: 18,
          prompt: 'Adventure playground',
          answerKey: 'B',
          explanation: "The adventure playground is 'at the northern end of the larger lake, in a bend on the path that leads to the lake' (B).",
          transcriptExcerpt: "That's at the northern end of the larger lake, in a bend on the path that leads to the lake.",
          audioTimestampSeconds: 225,
        },
        {
          id: 'c19-l1-q19',
          questionNumber: 19,
          prompt: 'Kitchen gardens',
          answerKey: 'D',
          explanation: "The kitchen gardens are 'rectangular and surrounded by a wall... to the north-east of the house, quite near the smaller lake' (D).",
          transcriptExcerpt: "The kitchen gardens are rectangular and surrounded by a wall. They're to the north-east of the house, quite near the smaller lake.",
          audioTimestampSeconds: 245,
        },
        {
          id: 'c19-l1-q20',
          questionNumber: 20,
          prompt: 'The Temple of the Four Winds',
          answerKey: 'A',
          explanation: "'when the path forks, take the right-hand path. Go up there with the woods on your left and the temple is right at the end' (A).",
          transcriptExcerpt: 'Then when the path forks, take the right-hand path. Go up there with the woods on your left and the temple is right at the end.',
          audioTimestampSeconds: 270,
        },
      ],
    },

    // PART 3: Questions 21-22
    {
      id: 'c19-l1-g4',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q21_OPTIONS,
      questions: [
        multiQuestion(
          'c19-l1-q21', 21,
          'Which TWO things did Colin find most satisfying about his bread reuse project?',
          MC_Q21_OPTIONS, ['B', 'D'],
          "Colin enjoyed playing with 'different patterns... and adding fruit and vegetables to make them a more appetising colour' (D), and Marie notes the great feeling of making something appetising from bread 'that would've been thrown away' (B, preventing waste).",
          "I had time to play around with different patterns for the biscuits... It must've been a great feeling to make something appetising out of bits of old bread that would've been thrown away otherwise.",
          60
        ),
        multiQuestion(
          'c19-l1-q22', 22,
          'Which TWO things did Colin find most satisfying about his bread reuse project?',
          MC_Q21_OPTIONS, ['B', 'D'],
          "Colin enjoyed playing with 'different patterns... and adding fruit and vegetables to make them a more appetising colour' (D), and Marie notes the great feeling of making something appetising from bread 'that would've been thrown away' (B, preventing waste); Colin agrees: 'It was'.",
          "I had time to play around with different patterns for the biscuits... It must've been a great feeling to make something appetising out of bits of old bread that would've been thrown away otherwise.",
          80
        ),
      ],
    },

    // PART 3: Questions 23-24
    {
      id: 'c19-l1-g5',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: MC_Q23_OPTIONS,
      questions: [
        multiQuestion(
          'c19-l1-q23', 23,
          'Which TWO ways do the students agree that touch-sensitive sensors for food labels could be developed in future?',
          MC_Q23_OPTIONS, ['A', 'E'],
          "Marie: 'I thought it might be really good for drug storage in hospitals and pharmacies' (A, medical products). Colin: 'how many kilograms a joint of meat is' (E, weight of certain foods). The sensor already works for milk and juice (so C is not a future development).",
          "I thought it might be really good for drug storage in hospitals and pharmacies. ... Like how many kilograms a joint of meat is, for example.",
          140
        ),
        multiQuestion(
          'c19-l1-q24', 24,
          'Which TWO ways do the students agree that touch-sensitive sensors for food labels could be developed in future?',
          MC_Q23_OPTIONS, ['A', 'E'],
          "Marie: 'I thought it might be really good for drug storage in hospitals and pharmacies' (A, medical products). Colin: 'how many kilograms a joint of meat is' (E, weight of certain foods).",
          "I thought it might be really good for drug storage in hospitals and pharmacies. ... Like how many kilograms a joint of meat is, for example.",
          155
        ),
      ],
    },

    // PART 3: Questions 25-30 (Matching)
    {
      id: 'c19-l1-g6',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 25–30',
      instructions: "What is the students' opinion about each of the following food trends?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.",
      startQuestionNumber: 25,
      endQuestionNumber: 30,
      optionsList: [
        { key: 'A', text: 'This is only relevant to young people.' },
        { key: 'B', text: 'This may have disappointing results.' },
        { key: 'C', text: 'This already seems to be widespread.' },
        { key: 'D', text: 'Retailers should do more to encourage this.' },
        { key: 'E', text: 'More financial support is needed for this.' },
        { key: 'F', text: 'Most people know little about this.' },
        { key: 'G', text: 'There should be stricter regulations about this.' },
        { key: 'H', text: 'This could be dangerous.' },
      ],
      questions: [
        {
          id: 'c19-l1-q25',
          questionNumber: 25,
          prompt: 'Use of local products',
          answerKey: 'D',
          explanation: "Marie notes the shops are still full of imported foods; Colin says 'they need to be more proactive to address that' (retailers should do more, D).",
          transcriptExcerpt: 'MARIE: ...the shops are still full of imported foods. COLIN: Yes, they need to be more proactive to address that.',
          audioTimestampSeconds: 185,
        },
        {
          id: 'c19-l1-q26',
          questionNumber: 26,
          prompt: 'Reduction in unnecessary packaging',
          answerKey: 'G',
          explanation: "Colin says 'The government needs to do something about it' and Marie agrees 'It's got to change' (stricter regulations, G).",
          transcriptExcerpt: 'just about everything you buy in supermarkets is still covered in plastic. The government needs to do something about it. MARIE: Absolutely. It\'s got to change.',
          audioTimestampSeconds: 205,
        },
        {
          id: 'c19-l1-q27',
          questionNumber: 27,
          prompt: 'Gluten-free and lactose-free food',
          answerKey: 'C',
          explanation: "Marie: 'Lots of people I know have been buying that type of food for years now' – Colin agrees, even without allergy diagnoses (already widespread, C).",
          transcriptExcerpt: "Lots of people I know have been buying that type of food for years now. COLIN: Yes, even if they haven't been diagnosed with an allergy.",
          audioTimestampSeconds: 230,
        },
        {
          id: 'c19-l1-q28',
          questionNumber: 28,
          prompt: 'Use of branded products related to celebrity chefs',
          answerKey: 'B',
          explanation: "Both students bought such products and were let down: 'I won't again' and 'it didn't actually taste of anything' (disappointing results, B).",
          transcriptExcerpt: "I bought something like that once, but I won't again. COLIN: Yeah – I bought a ready-made spice mix for chicken... and it didn't actually taste of anything.",
          audioTimestampSeconds: 255,
        },
        {
          id: 'c19-l1-q29',
          questionNumber: 29,
          prompt: "Development of 'ghost kitchens' for takeaway food",
          answerKey: 'F',
          explanation: "Marie says 'people aren't aware of that – it's all kept very quiet', and Colin: 'people don't realise' (most people know little about this, F).",
          transcriptExcerpt: "But people aren't aware of that – it's all kept very quiet. COLIN: So people don't realise the food's not actually from the restaurant?",
          audioTimestampSeconds: 285,
        },
        {
          id: 'c19-l1-q30',
          questionNumber: 30,
          prompt: 'Use of mushrooms for common health concerns',
          answerKey: 'H',
          explanation: "Marie: 'They might be taking a big risk there', and Colin: 'it's hard to know which varieties are safe to eat' (this could be dangerous, H).",
          transcriptExcerpt: "They might be taking a big risk there. COLIN: Yes, it's hard to know which varieties are safe to eat.",
          audioTimestampSeconds: 315,
        },
      ],
    },

    // PART 4: Questions 31-40 (Note Completion)
    {
      id: 'c19-l1-g7',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      contentWithGaps: `Céide Fields
• an important Neolithic archaeological site in the northwest of Ireland

Discovery
• In the 1930s, a local teacher realised that stones beneath the bog surface were once [[31]]
• His [[32]] became an archaeologist and undertook an investigation of the site:
  - a traditional method used by local people to dig for [[33]] was used to identify where stones were located
  - carbon dating later proved the site was Neolithic.
• Items are well preserved in the bog because of a lack of [[34]]

Neolithic farmers
• Houses were [[35]] in shape and had a hole in the roof.
• Neolithic innovations include:
  - cooking indoors
  - pots used for storage and to make [[36]]
• Each field at Céide was large enough to support a big [[37]]
• The fields were probably used to restrict the grazing of animals – no evidence of structures to house them during [[38]]

Reasons for the decline in farming
• a decline in [[39]] quality
• an increase in [[40]]`,
      questions: [
        {
          id: 'c19-l1-q31',
          questionNumber: 31,
          prompt: 'Stones beneath the bog surface were once ________',
          answerKey: 'walls',
          acceptedAlternatives: ['walls', 'wall'],
          explanation: "Patrick Caulfield noticed rows of stones and 'realised that these must be walls'.",
          transcriptExcerpt: 'they were constantly hitting against what seemed to be rows of stones. He realised that these must be walls',
          audioTimestampSeconds: 30,
        },
        {
          id: 'c19-l1-q32',
          questionNumber: 32,
          prompt: 'His ________ became an archaeologist and undertook an investigation of the site',
          answerKey: 'son',
          acceptedAlternatives: ['son'],
          explanation: "'Patrick Caulfield's son Seamus, who had become an archaeologist by then, began to explore further'.",
          transcriptExcerpt: "when Patrick Caulfield's son Seamus, who had become an archaeologist by then, began to explore further.",
          audioTimestampSeconds: 60,
        },
        {
          id: 'c19-l1-q33',
          questionNumber: 33,
          prompt: 'a traditional method used by local people to dig for ________ was used to identify where stones were located',
          answerKey: 'fuel',
          acceptedAlternatives: ['fuel'],
          explanation: "The probes were 'a traditional method which local people had always used for finding fuel buried in the bog'.",
          transcriptExcerpt: 'a traditional method which local people had always used for finding fuel buried in the bog for thousands of years.',
          audioTimestampSeconds: 80,
        },
        {
          id: 'c19-l1-q34',
          questionNumber: 34,
          prompt: 'Items are well preserved in the bog because of a lack of ________',
          answerKey: 'oxygen',
          acceptedAlternatives: ['oxygen'],
          explanation: "Objects are preserved 'because of the acidity of the peat and the deficiency of oxygen' (deficiency = lack).",
          transcriptExcerpt: 'Objects remain so well preserved in these conditions because of the acidity of the peat and the deficiency of oxygen.',
          audioTimestampSeconds: 115,
        },
        {
          id: 'c19-l1-q35',
          questionNumber: 35,
          prompt: 'Houses were ________ in shape and had a hole in the roof.',
          answerKey: 'rectangular',
          acceptedAlternatives: ['rectangular'],
          explanation: "'These weren't round as people often assume, but rectangular with a small hole in the roof'.",
          transcriptExcerpt: "These weren't round as people often assume, but rectangular with a small hole in the roof that allowed smoke to escape.",
          audioTimestampSeconds: 150,
        },
        {
          id: 'c19-l1-q36',
          questionNumber: 36,
          prompt: 'pots used for storage and to make ________',
          answerKey: 'lamps',
          acceptedAlternatives: ['lamps', 'lamp'],
          explanation: "Pots were filled with fat and set alight, so 'they served as lamps'.",
          transcriptExcerpt: 'pots were filled with a small amount of fat and when this was set alight, they served as lamps.',
          audioTimestampSeconds: 180,
        },
        {
          id: 'c19-l1-q37',
          questionNumber: 37,
          prompt: 'Each field at Céide was large enough to support a big ________',
          answerKey: 'family',
          acceptedAlternatives: ['family'],
          explanation: "'each plot of land was of a suitable size to sustain an extended family'.",
          transcriptExcerpt: 'each plot of land was of a suitable size to sustain an extended family.',
          audioTimestampSeconds: 200,
        },
        {
          id: 'c19-l1-q38',
          questionNumber: 38,
          prompt: 'no evidence of structures to house animals during ________',
          answerKey: 'winter',
          acceptedAlternatives: ['winter'],
          explanation: "'no structures have been found which would have been used to shelter animals in the winter'.",
          transcriptExcerpt: 'no structures have been found which would have been used to shelter animals in the winter.',
          audioTimestampSeconds: 225,
        },
        {
          id: 'c19-l1-q39',
          questionNumber: 39,
          prompt: 'a decline in ________ quality',
          answerKey: 'soil',
          acceptedAlternatives: ['soil'],
          explanation: "'The soil would have become less productive and led to the abandonment of farming'.",
          transcriptExcerpt: 'The soil would have become less productive and led to the abandonment of farming.',
          audioTimestampSeconds: 250,
        },
        {
          id: 'c19-l1-q40',
          questionNumber: 40,
          prompt: 'an increase in ________',
          answerKey: 'rain',
          acceptedAlternatives: ['rain', 'rainfall'],
          explanation: "'the conditions became wetter as there was a lot more rain'.",
          transcriptExcerpt: 'the conditions became wetter as there was a lot more rain.',
          audioTimestampSeconds: 285,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 19 Academic Listening Test 1',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      audioMode: 'part_audios',
      overallAudioUrl: '/audio/listening/c19_test1_complete.mp3',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c19_test1_part1.mp3', durationSeconds: 360 },
        { partNumber: 2, audioUrl: '/audio/listening/c19_test1_part2.mp3', durationSeconds: 340 },
        { partNumber: 3, audioUrl: '/audio/listening/c19_test1_part3.mp3', durationSeconds: 380 },
        { partNumber: 4, audioUrl: '/audio/listening/c19_test1_part4.mp3', durationSeconds: 390 },
      ],
    },
    parts,
    questionGroups,
  };
}

export function ingestCambridge19ListeningTest1(authorId?: string): {
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
} {
  const data = getCambridge19ListeningTest1Data();
  const errors = validateListeningTestVersion(data.parts, data.questionGroups);
  if (errors.length > 0) {
    throw new Error(`Cambridge 19 Listening Test 1 validation failed:\n- ${errors.join('\n- ')}`);
  }

  const resolvedAuthorId =
    authorId ||
    (db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any)?.id ||
    uuidv4();

  const now = new Date().toISOString();

  const existingTest = db
    .prepare("SELECT id FROM listening_tests WHERE title = ?")
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
