import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { ListeningPart, QuestionGroup, ListeningAudioConfig, ListeningTest } from '../shared/types';
import { validateListeningTestVersion } from './listeningService';

export function getCambridge21ListeningTest3Data(): {
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
      id: 'c21-l3-p1',
      partNumber: 1,
      title: 'Part 1: Ferry to Shetland Islands',
      context: 'Tammy enquires about ferry travel to the Shetland Islands with Paul.',
      audioUrl: '/audio/listening/c21_test3_part1.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `TAMMY: You know when you went to the Shetland Islands last year, Paul? Did you go by ferry or did you fly?
PAUL: We went by ferry, Tammy. I prefer driving to flying - the journey feels like part of the holiday.
TAMMY: Mmm. Which ferry company did you use?
PAUL: There's only one - it's called Northern Ferries. The ferries all leave from Aberdeen.
TAMMY: How frequent are they?
PAUL: The service is pretty limited - there's only one ferry leaving every evening in summer anyway, seven days a week - I'm not sure about the winter months. They may only run on four or five days then.
TAMMY: OK. So it's an overnight trip. I quite like that idea. Leaving at night and waking up as you arrive on the island. Can you remember how much you paid for your tickets?
PAUL: They were really cheap and four people and a car worked out at just under £250.
TAMMY: Really? I was expecting it to be more like £400 during the peak season.
PAUL: So was I. It's great value. It's a good idea to book in advance because I think they get booked up quite quickly - especially during the school holidays.
TAMMY: Yes, I suppose so. I'm just not 100% sure of our plans yet. What if I had to cancel?
PAUL: That could be a problem. I don't think it's their policy to give refunds - just a voucher - which you can use at a later date. But you have to cancel a month in advance to get that.
TAMMY: Right. Well we need to make up our minds quickly then.
PAUL: You'd want to book a cabin too. We booked too late to get a cabin with a window. They're more expensive but much nicer than the inner cabins. You don't have to book a cabin at all but I think it's worth paying for. They also have luxury cabins, which are only for two people and have a TV - but I wouldn't bother with those.
TAMMY: No, I agree.
PAUL: The only other thing I can think of is to make sure you bring snacks for the kids. The selection on board is quite limited and not that healthy either.
TAMMY: Mmm. What about wifi on board? Is that any good?
PAUL: Not really. So it's best to bring some books for them.
TAMMY: OK. We may need to bring the dog if I can't get anyone to look after him.
PAUL: We brought ours and it was fine. The kennels on board are OK - they're quite big - you just need to provide a blanket.
TAMMY: Uhuh. Sounds good.
PAUL: It was all very easy really - and it was quite an adventure for the kids. They loved being on the sea at night and in the morning keeping a lookout for dolphins - we saw loads.
TAMMY: Oh, the kids would love that!
PAUL: One other thing. We arrived in Aberdeen hours before the ferry was due to leave so we decided to go somewhere else rather than hang around at the port for so long.
TAMMY: Where did you go?
PAUL: Drum Castle.
TAMMY: I've never heard of it. Is that spelt like the instrument?
PAUL: Yeah. It's really worth visiting. It's got an impressive tower and beautiful gardens and ancient woodland.
TAMMY: Sounds lovely. Does it have a restaurant?
PAUL: It's only got a coffee shop - no restaurant. We looked up restaurants in the area and found an Italian one in a village nearby. I can check the name of it for you if you're interested.
TAMMY: Oh thanks Paul that would be ....`,
      transcriptTimestamps: [
        { questionNumber: 1, timestampSeconds: 25, quote: "There's only one - it's called Northern Ferries." },
        { questionNumber: 2, timestampSeconds: 40, quote: "seven days a week - I'm not sure about the winter months." },
        { questionNumber: 3, timestampSeconds: 55, quote: "four people and a car worked out at just under £250." },
        { questionNumber: 4, timestampSeconds: 75, quote: "just a voucher - which you can use at a later date." },
        { questionNumber: 5, timestampSeconds: 90, quote: "We booked too late to get a cabin with a window." },
        { questionNumber: 6, timestampSeconds: 115, quote: "So it's best to bring some books for them." },
        { questionNumber: 7, timestampSeconds: 128, quote: "The kennels on board are OK - they're quite big - you just need to provide a blanket." },
        { questionNumber: 8, timestampSeconds: 140, quote: "in the morning keeping a lookout for dolphins - we saw loads." },
        { questionNumber: 9, timestampSeconds: 165, quote: "Drum Castle." },
        { questionNumber: 10, timestampSeconds: 185, quote: "found an Italian one in a village nearby." },
      ],
    },
    {
      id: 'c21-l3-p2',
      partNumber: 2,
      title: 'Part 2: Starting a Street Food Business',
      context: 'Jon gives practical advice and real business examples on starting a street food business.',
      audioUrl: '/audio/listening/c21_test3_part2.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `Good evening everyone. My name's Jon and I run Veg Out, a street food business selling vegan food. Since 2012 I've been travelling all around the country cooking vegan food in my converted van and selling it at all kinds of outdoor events. I'm here to give you some advice based on my experience.

The good news is that there's never been a better time to start your own street food business. Street food continues to grow in popularity. I think there are a couple of reasons for this. The first is that street food is a reaction against fast food. Street food ranges from high quality burgers to vegan curries and everything in between. But while fast food is cheap and easy to find, it's not particularly good for you. It's also the same everywhere. What you get with street food on the other hand is something different. People like the idea of trying something they can't get anywhere else. They also like seeing food prepared in front of them and which hasn't come straight out of a freezer.

You need to think about the best place to sell your street food. People always think music festivals are an obvious place to start but the cost of renting a space can be huge. And there's always a lot of competition. Food markets, on the other hand, are great because customers are always really interested in food and give great feedback. And if you can get a spot in your local park - fantastic. Usually very relaxed but with lots of customers passing by. Once you get established you'll start getting asked to do parties - which can be really challenging but lots of fun. Having street food at weddings has become quite fashionable too - but you need to really know what you're doing as everything needs to be perfect.

Setting up a street food business costs a lot less than opening a restaurant or cafe but you'll have to buy some basic equipment. I'd try to get things like hobs and fridges second hand if you can. You can replace them with better quality stuff if your business takes off. Renting is another option but you'll end up spending more money rather than saving it.

You've probably got a good idea about the food you're planning to sell. I expect you've done some research to find out if anyone else is selling a similar product. And you'll have thought about any possible allergies to nuts or eggs etc. But there's one thing people don't always think about and that's how you're going to serve it. On a plate? In a bag? Will you provide a fork? Will it all be easily recyclable or reusable? It's got to be easy to eat and look attractive or customers won't come back.

Once you get started, you should be prepared for things to go wrong. Every business faces problems and here are a few examples from street food businesses that I know.

My friends who run Thai Basil started by juggling their street food business with their day jobs in a restaurant. Their work-life balance was non-existent as they were working til midnight in the restaurant all week and then took their food truck to markets on their days off.

The owners of Basque found it was hard to make a profit because the price of fish - essential for some of their dishes - was so high. And it was hard to charge customers a lot more for those dishes. So they had to stop focussing on fish dishes and include more vegetarian food.

The owners of Lou's kitchen were making salads to order from their van and some of their dishes were quite complicated. At one of their first events they ended up with people standing in a long queue for more than 15 minutes - and many of them lost patience. So make sure whatever you offer can be served quickly and efficiently.

The owners of Chip Chop had found a perfect venue near a beach where there weren't any other street food trucks. But what they hadn't realised was that they'd need a special licence - which individual businesses don't need at markets or festivals. It was a complicated process and in the end they gave up.

So I hope that's given you a flavour of ....`,
      transcriptTimestamps: [
        { questionNumber: 11, timestampSeconds: 35, quote: "People like the idea of trying something they can't get anywhere else. They also like seeing food prepared in front of them" },
        { questionNumber: 12, timestampSeconds: 42, quote: "People like the idea of trying something they can't get anywhere else. They also like seeing food prepared in front of them" },
        { questionNumber: 13, timestampSeconds: 58, quote: "Food markets, on the other hand, are great because customers are always really interested in food and give great feedback." },
        { questionNumber: 14, timestampSeconds: 68, quote: "And if you can get a spot in your local park - fantastic." },
        { questionNumber: 15, timestampSeconds: 90, quote: "I'd try to get things like hobs and fridges second hand if you can." },
        { questionNumber: 16, timestampSeconds: 110, quote: "It's got to be easy to eat and look attractive or customers won't come back." },
        { questionNumber: 17, timestampSeconds: 130, quote: "working til midnight in the restaurant all week and then took their food truck to markets on their days off." },
        { questionNumber: 18, timestampSeconds: 145, quote: "the price of fish - essential for some of their dishes - was so high." },
        { questionNumber: 19, timestampSeconds: 165, quote: "people standing in a long queue for more than 15 minutes - and many of them lost patience." },
        { questionNumber: 20, timestampSeconds: 185, quote: "what they hadn't realised was that they'd need a special licence" },
      ],
    },
    {
      id: 'c21-l3-p3',
      partNumber: 3,
      title: 'Part 3: Sustainable and Ethical Fashion',
      context: 'Maddy and Ryan discuss their research on sustainable and ethical fashion and semi-synthetic fabrics.',
      audioUrl: '/audio/listening/c21_test3_part3.mp3',
      containsIntroPauses: true,
      introPauseSeconds: 30,
      checkPauseSeconds: 30,
      transcript: `MADDY: Shall we go through our research for our sustainable fashion project?
RYAN: Good idea. I think I've done enough reading now.
MADDY: Me too. I've learnt such a lot about what sustainability actually means.
RYAN: Mmm, same for me with ethical fashion. I didn't really appreciate the difference between that and sustainable fashion before doing this research.
MADDY: I know - most people use these terms interchangeably - but in fact the difference is quite distinct when you think about it. Sustainable relates to the environment and ethical relates more to the way workers or animals are treated.
RYAN: I totally understand why people get confused, though. There are so many other terms used - like 'eco-friendly', which is actually quite meaningless.
MADDY: And the way companies use these terms when describing their products doesn't help. They're often deliberately vague, I think, and don't provide enough information about how their products are made.
RYAN: Yes. It was interesting to read about the debates surrounding wool production and how ethical and sustainable that is. It's generally considered to be sustainable because it's a natural product.
MADDY: And it also lasts a long time and can be recycled. All very positive. But I wasn't convinced by the argument that wool production is sustainable because it doesn't use many chemicals - what about all the fungicides and insecticides used in sheep farming?
RYAN: Good point. And I couldn't find any evidence for the claim about sheep farming being better for the environment than cattle farming.
MADDY: No - they're both really bad. I read different reports about how unethical it is to even shear sheep. Some people say it's cruel but as long as the sheep are kept in good condition I can't see anything wrong with it.
RYAN: Me neither. Shall we talk about some of the semi-synthetic new fabrics now?
MADDY: OK, let's do that.
RYAN: Let's start with Lyocell, I've been reading about that.
MADDY: Yeah, that's the one produced from the pulp of eucalyptus trees, isn't it?
RYAN: Yes, and what happens with that is really impressive. Over 99% of dissolving agents used in the manufacturing process are used again.
MADDY: Yeah. Now, there are a few semi-synthetic fabrics that I'd never heard of. Like Cupro, for example.
RYAN: Made from byproducts of the cotton industry to create a kind of vegan silk.
MADDY: But I'm not sure how sustainable this really is as there are so many reports of pollution caused by the manufacturing process.
RYAN: Mmm. It doesn't compare favourably with all the other sustainable fabrics we've looked at, no.
MADDY: Bamboo is one fabric we're all familiar with. But I didn't know that it was only organic bamboo that's truly sustainable.
RYAN: Me neither. Apparently, the manufacturing process for a significant proportion of bamboo is chemically quite intensive - which obviously can be quite damaging.
MADDY: EcoVero is an example of a semi-synthetic fabric which is becoming really popular.
RYAN: Probably because manufacturing causes 50 percent fewer emissions and takes up half as much energy as conventional fabrics. That saves production costs as well as being better for the environment.
MADDY: That's true. I think demand for cork will continue to grow. It works really well in vegan shoes and bags.
RYAN: Mmm and it's the only fabric that's fundamentally sustainable - the cork trees it comes from are renewable and the product itself is both recyclable and biodegradable - which is unique.
MADDY: And the harvesting process is actually good for the trees. There are no downsides to using this source at all.
RYAN: Hemp is another really good sustainable fabric from a natural source.
MADDY: Yes. Did you know that clothes made from hemp protect the wearer from the sun and it's also antibacterial?
RYAN: No, I didn't. But I did read that it's quite hard to grow, so perhaps that's why it's not as common as you'd think.
MADDY: I'm sure that'll change.`,
      transcriptTimestamps: [
        { questionNumber: 21, timestampSeconds: 25, quote: "most people use these terms interchangeably... deliberately vague, I think, and don't provide enough information" },
        { questionNumber: 22, timestampSeconds: 42, quote: "most people use these terms interchangeably... deliberately vague, I think, and don't provide enough information" },
        { questionNumber: 23, timestampSeconds: 65, quote: "wasn't convinced by the argument that wool production is sustainable because it doesn't use many chemicals... couldn't find any evidence for the claim about sheep farming being better for the environment" },
        { questionNumber: 24, timestampSeconds: 78, quote: "wasn't convinced by the argument that wool production is sustainable because it doesn't use many chemicals... couldn't find any evidence for the claim about sheep farming being better for the environment" },
        { questionNumber: 25, timestampSeconds: 100, quote: "Over 99% of dissolving agents used in the manufacturing process are used again." },
        { questionNumber: 26, timestampSeconds: 115, quote: "reports of pollution caused by the manufacturing process. It doesn't compare favourably with all the other sustainable fabrics" },
        { questionNumber: 27, timestampSeconds: 130, quote: "only organic bamboo that's truly sustainable... manufacturing process for a significant proportion of bamboo is chemically quite intensive" },
        { questionNumber: 28, timestampSeconds: 150, quote: "manufacturing causes 50 percent fewer emissions and takes up half as much energy as conventional fabrics." },
        { questionNumber: 29, timestampSeconds: 170, quote: "only fabric that's fundamentally sustainable... There are no downsides to using this source at all." },
        { questionNumber: 30, timestampSeconds: 190, quote: "clothes made from hemp protect the wearer from the sun and it's also antibacterial" },
      ],
    },
    {
      id: 'c21-l3-p4',
      partNumber: 4,
      title: 'Part 4: Invasive Species',
      context: 'A lecture examining the definition, problems, spread, examples, and monitoring of invasive species.',
      audioUrl: '/audio/listening/c21_test3_part4.mp3',
      containsIntroPauses: false,
      introPauseSeconds: 45,
      checkPauseSeconds: 30,
      transcript: `Today I'm going to talk about invasive species. Let me start by saying what an invasive species is and what it's not. Invasive species are any animal or plant that is introduced into an environment by humans, and which is then harmful to that environment. It's important to be clear that not all introduced species are invasive. Many introduced - or non-native - species thrive in new areas without posing any threat.

In some cases, invasive species have changed the natural world beyond recognition, so let's look at the different ways they can be problematic. First of all, invasive species may eat native species, or sometimes they may bring a disease with them, which native species have never faced before and therefore have no defences against. Often the invasive species breed very quickly - which further adds to the problem of native species losing their sources of food. Species invasions are one of the biggest causes of damage in an ecosystem, actually putting its survival at risk.

So, how do invasive species spread? Without a doubt, the biggest cause is human activity. This could be intentional, or it could be accidental, such as when people who've been on holiday in another country come back with, say, the seeds of plants on their clothes or shoes. Plants and animals, especially insects, arrive in or on the cargo of ships, and then escape into their new 'home'. But sometimes humans deliberately move animals and plants around the world, for example to use them to control pests on farms, or to be pets. This can go very wrong if those animals and plants move into wild settings and start breeding or begin growing in ways that weren't predicted.

Let's now look at an example of an invasive species here in Australia: Rhinella marina is a species of toad that was deliberately introduced from Hawaii in 1935 as a form of biological control. It was hoped that the toads would eat the grey-backed beetles responsible for destroying crops of sugar on many of the plantations. At first, just a handful of toads were released by scientists into Queensland, but this number soon grew as other states followed suit. Within two years, 62,000 young toads had been released into the wild. The toads did nothing to protect the plantations, but they did reproduce rapidly and could soon be found all over the northern half of the country. The toads are poisonous at every stage of their life cycle, and anything that eats them will die.

My second example regarding invasive species is the United Kingdom. Actually, there are more than three-thousand invasive species there, including some that are extremely common. Some invasive plants, such as Japanese knotweed, have had a devastating impact on parts of the UK. Gardeners in the nineteenth century considered it a beautiful ornamental plant - which it is, when it's kept under control - but it soon spread into the countryside and remains a problem even to this day as it's so hard to eradicate. Another invasive plant is rhododendrons, which can be found in UK parks and woodlands. Their introduction dates back to 1763, but they're now seen as harmful because they block out so much light that native wild flowers can't grow beneath them.

And then there are grey squirrels, which are one invasive species almost everyone in the UK will have come across. They were brought to the UK from North America and introduced to private estates around the 1870s but are now found everywhere, from forests to city squares. Grey squirrels have outcompeted the smaller, native red squirrels. They both eat the same food, and the grey squirrels carry a type of virus that is deadly to the red squirrels. Red squirrel populations have collapsed, and there are only a handful of sites left in the UK where they're found.

An important question for ecologists worldwide is, what can we do to tackle the problem of invasive species? The first step in controlling invasive species is learning about the behaviour of new species coming into the country. Monitoring is an important part of this, so that we can know if the new species begins to have a negative impact in its new environment. One effective way to keep track of invasive species is to create a database for the whole country. That way, all relevant authorities and agencies can share important information and take whatever action's needed. But the public also have a vital role to play in this process. They should be encouraged to photograph harmful species - because this helps with identification - and then to report when and where these were observed. But it's important to tell people not to destroy or even touch what they've found.

Now, I'm going to move on to ...`,
      transcriptTimestamps: [
        { questionNumber: 31, timestampSeconds: 35, quote: "or sometimes they may bring a disease with them, which native species have never faced before" },
        { questionNumber: 32, timestampSeconds: 50, quote: "Species invasions are one of the biggest causes of damage in an ecosystem, actually putting its survival at risk." },
        { questionNumber: 33, timestampSeconds: 70, quote: "such as when people who've been on holiday in another country come back with, say, the seeds of plants on their clothes or shoes." },
        { questionNumber: 34, timestampSeconds: 85, quote: "for example to use them to control pests on farms, or to be pets." },
        { questionNumber: 35, timestampSeconds: 110, quote: "responsible for destroying crops of sugar on many of the plantations." },
        { questionNumber: 36, timestampSeconds: 145, quote: "they're now seen as harmful because they block out so much light that native wild flowers can't grow beneath them." },
        { questionNumber: 37, timestampSeconds: 168, quote: "and the grey squirrels carry a type of virus that is deadly to the red squirrels." },
        { questionNumber: 38, timestampSeconds: 185, quote: "The first step in controlling invasive species is learning about the behaviour of new species coming into the country." },
        { questionNumber: 39, timestampSeconds: 200, quote: "One effective way to keep track of invasive species is to create a database for the whole country." },
        { questionNumber: 40, timestampSeconds: 215, quote: "They should be encouraged to photograph harmful species - because this helps with identification" },
      ],
    },
  ];

  const questionGroups: QuestionGroup[] = [
    // -------------------------------------------------------------
    // PART 1: Questions 1-10 (Note Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g1',
      partNumber: 1,
      questionType: 'note_completion',
      title: 'Questions 1–10',
      instructions: 'Complete the notes below.\nWrite ONE WORD AND/OR A NUMBER for each answer.',
      startQuestionNumber: 1,
      endQuestionNumber: 10,
      wordLimitRule: 'ONE WORD AND/OR A NUMBER',
      maxWords: 1,
      maxNumbers: 1,
      contentWithGaps: `Ferry to Shetland Islands
• Name of ferry company: [[1]] Ferries
• Ferries depart seven times per [[2]] in summer
• Cost for four people with car: a little less than £ [[3]]
• Cancellation policy: receive a [[4]] (if cancelled a month in advance)

Advice
• Cabins:
- book one with a [[5]]
- luxury cabins have a TV
• Bring snacks and [[6]] for the children
• A [[7]] is required for the dog kennels
• Try to see [[8]] in the morning
• If time, visit [[9]] Castle
• The [[10]] restaurant in a nearby village is recommended`,
      questions: [
        {
          id: 'c21-l3-q1',
          questionNumber: 1,
          prompt: 'Name of ferry company: ________ Ferries',
          answerKey: 'Northern',
          acceptedAlternatives: ['Northern', 'northern'],
          explanation: "Paul mentions: 'There's only one - it's called Northern Ferries'.",
          transcriptExcerpt: "There's only one - it's called Northern Ferries. The ferries all leave from Aberdeen.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c21-l3-q2',
          questionNumber: 2,
          prompt: 'Ferries depart seven times per ________ in summer',
          answerKey: 'week',
          acceptedAlternatives: ['week'],
          explanation: "Paul explains: 'there's only one ferry leaving every evening in summer anyway, seven days a week'.",
          transcriptExcerpt: "there's only one ferry leaving every evening in summer anyway, seven days a week - I'm not sure about the winter months.",
          audioTimestampSeconds: 40,
        },
        {
          id: 'c21-l3-q3',
          questionNumber: 3,
          prompt: 'Cost for four people with car: a little less than £ ________',
          answerKey: '250',
          acceptedAlternatives: ['250', 'two hundred and fifty', '£250'],
          explanation: "Paul says: 'four people and a car worked out at just under £250' (just under = a little less than).",
          transcriptExcerpt: 'They were really cheap and four people and a car worked out at just under £250.',
          audioTimestampSeconds: 55,
        },
        {
          id: 'c21-l3-q4',
          questionNumber: 4,
          prompt: 'Cancellation policy: receive a ________ (if cancelled a month in advance)',
          answerKey: 'voucher',
          acceptedAlternatives: ['voucher'],
          explanation: "Paul explains: 'I don't think it's their policy to give refunds - just a voucher - which you can use at a later date. But you have to cancel a month in advance to get that'.",
          transcriptExcerpt: "I don't think it's their policy to give refunds - just a voucher - which you can use at a later date. But you have to cancel a month in advance to get that.",
          audioTimestampSeconds: 75,
        },
        {
          id: 'c21-l3-q5',
          questionNumber: 5,
          prompt: 'Cabins: book one with a ________',
          answerKey: 'window',
          acceptedAlternatives: ['window'],
          explanation: "Paul advises: 'We booked too late to get a cabin with a window. They're more expensive but much nicer than the inner cabins'.",
          transcriptExcerpt: "We booked too late to get a cabin with a window. They're more expensive but much nicer than the inner cabins.",
          audioTimestampSeconds: 90,
        },
        {
          id: 'c21-l3-q6',
          questionNumber: 6,
          prompt: 'Bring snacks and ________ for the children',
          answerKey: 'books',
          acceptedAlternatives: ['books', 'book'],
          explanation: "Paul notes that wifi isn't very good: 'So it's best to bring some books for them'.",
          transcriptExcerpt: "Not really. So it's best to bring some books for them.",
          audioTimestampSeconds: 115,
        },
        {
          id: 'c21-l3-q7',
          questionNumber: 7,
          prompt: 'A ________ is required for the dog kennels',
          answerKey: 'blanket',
          acceptedAlternatives: ['blanket'],
          explanation: "Paul says: 'The kennels on board are OK - they're quite big - you just need to provide a blanket'.",
          transcriptExcerpt: "The kennels on board are OK - they're quite big - you just need to provide a blanket.",
          audioTimestampSeconds: 128,
        },
        {
          id: 'c21-l3-q8',
          questionNumber: 8,
          prompt: 'Try to see ________ in the morning',
          answerKey: 'dolphins',
          acceptedAlternatives: ['dolphins', 'dolphin'],
          explanation: "Paul says: 'They loved being on the sea at night and in the morning keeping a lookout for dolphins - we saw loads'.",
          transcriptExcerpt: 'They loved being on the sea at night and in the morning keeping a lookout for dolphins - we saw loads.',
          audioTimestampSeconds: 140,
        },
        {
          id: 'c21-l3-q9',
          questionNumber: 9,
          prompt: 'If time, visit ________ Castle',
          answerKey: 'Drum',
          acceptedAlternatives: ['Drum', 'drum'],
          explanation: "Paul recommends visiting 'Drum Castle' (spelt like the instrument).",
          transcriptExcerpt: "TAMMY: Where did you go? PAUL: Drum Castle. TAMMY: I've never heard of it. Is that spelt like the instrument? PAUL: Yeah. It's really worth visiting.",
          audioTimestampSeconds: 165,
        },
        {
          id: 'c21-l3-q10',
          questionNumber: 10,
          prompt: 'The ________ restaurant in a nearby village is recommended',
          answerKey: 'Italian',
          acceptedAlternatives: ['Italian', 'italian'],
          explanation: "Paul says: 'We looked up restaurants in the area and found an Italian one in a village nearby'.",
          transcriptExcerpt: 'We looked up restaurants in the area and found an Italian one in a village nearby. I can check the name of it for you if you’re interested.',
          audioTimestampSeconds: 185,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 11-12 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g2',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 11 and 12',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 11,
      endQuestionNumber: 12,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'low price' },
        { key: 'B', text: 'locally sourced' },
        { key: 'C', text: 'freshly made' },
        { key: 'D', text: 'convenience' },
        { key: 'E', text: 'unusual food' },
      ],
      questions: [
        {
          id: 'c21-l3-q11',
          questionNumber: 11,
          prompt: 'Which TWO explanations for the popularity of street food are given?',
          options: [
            { key: 'A', text: 'low price' },
            { key: 'B', text: 'locally sourced' },
            { key: 'C', text: 'freshly made' },
            { key: 'D', text: 'convenience' },
            { key: 'E', text: 'unusual food' },
          ],
          answerKey: ['C', 'E'],
          explanation: "Jon explains: 'People like the idea of trying something they can't get anywhere else' (unusual food, E) and 'They also like seeing food prepared in front of them and which hasn't come straight out of a freezer' (freshly made, C).",
          transcriptExcerpt: "People like the idea of trying something they can't get anywhere else. They also like seeing food prepared in front of them and which hasn't come straight out of a freezer.",
          audioTimestampSeconds: 35,
        },
        {
          id: 'c21-l3-q12',
          questionNumber: 12,
          prompt: 'Which TWO explanations for the popularity of street food are given?',
          options: [
            { key: 'A', text: 'low price' },
            { key: 'B', text: 'locally sourced' },
            { key: 'C', text: 'freshly made' },
            { key: 'D', text: 'convenience' },
            { key: 'E', text: 'unusual food' },
          ],
          answerKey: ['C', 'E'],
          explanation: "Jon explains: 'People like the idea of trying something they can't get anywhere else' (unusual food, E) and 'They also like seeing food prepared in front of them and which hasn't come straight out of a freezer' (freshly made, C).",
          transcriptExcerpt: "People like the idea of trying something they can't get anywhere else. They also like seeing food prepared in front of them and which hasn't come straight out of a freezer.",
          audioTimestampSeconds: 42,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 13-14 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g3',
      partNumber: 2,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 13 and 14',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 13,
      endQuestionNumber: 14,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'music festivals' },
        { key: 'B', text: 'food markets' },
        { key: 'C', text: 'weddings' },
        { key: 'D', text: 'parties' },
        { key: 'E', text: 'parks' },
      ],
      questions: [
        {
          id: 'c21-l3-q13',
          questionNumber: 13,
          prompt: 'Which TWO places are recommended for new street food businesses?',
          options: [
            { key: 'A', text: 'music festivals' },
            { key: 'B', text: 'food markets' },
            { key: 'C', text: 'weddings' },
            { key: 'D', text: 'parties' },
            { key: 'E', text: 'parks' },
          ],
          answerKey: ['B', 'E'],
          explanation: "Jon says: 'Food markets, on the other hand, are great because customers are always really interested in food and give great feedback' (B) and 'if you can get a spot in your local park - fantastic. Usually very relaxed but with lots of customers passing by' (E).",
          transcriptExcerpt: "Food markets, on the other hand, are great because customers are always really interested in food and give great feedback. And if you can get a spot in your local park - fantastic.",
          audioTimestampSeconds: 58,
        },
        {
          id: 'c21-l3-q14',
          questionNumber: 14,
          prompt: 'Which TWO places are recommended for new street food businesses?',
          options: [
            { key: 'A', text: 'music festivals' },
            { key: 'B', text: 'food markets' },
            { key: 'C', text: 'weddings' },
            { key: 'D', text: 'parties' },
            { key: 'E', text: 'parks' },
          ],
          answerKey: ['B', 'E'],
          explanation: "Jon says: 'Food markets, on the other hand, are great because customers are always really interested in food and give great feedback' (B) and 'if you can get a spot in your local park - fantastic. Usually very relaxed but with lots of customers passing by' (E).",
          transcriptExcerpt: "Food markets, on the other hand, are great because customers are always really interested in food and give great feedback. And if you can get a spot in your local park - fantastic.",
          audioTimestampSeconds: 68,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 15-16 (Multiple Choice Single)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g4',
      partNumber: 2,
      questionType: 'listening_multiple_choice_single',
      title: 'Questions 15 and 16',
      instructions: 'Choose the correct letter, A, B or C.',
      startQuestionNumber: 15,
      endQuestionNumber: 16,
      questions: [
        {
          id: 'c21-l3-q15',
          questionNumber: 15,
          prompt: 'What does the speaker say about getting equipment for a street food business?',
          options: [
            { key: 'A', text: 'High quality equipment is a good investment.' },
            { key: 'B', text: "It's best to buy second-hand equipment." },
            { key: 'C', text: 'Renting equipment can be cheap.' },
          ],
          answerKey: 'B',
          explanation: "Jon recommends: 'I'd try to get things like hobs and fridges second hand if you can. You can replace them with better quality stuff if your business takes off. Renting is another option but you'll end up spending more money rather than saving it'.",
          transcriptExcerpt: "I'd try to get things like hobs and fridges second hand if you can. You can replace them with better quality stuff if your business takes off.",
          audioTimestampSeconds: 90,
        },
        {
          id: 'c21-l3-q16',
          questionNumber: 16,
          prompt: 'What advice is given about creating a product for a street food business?',
          options: [
            { key: 'A', text: 'Provide information about the ingredients.' },
            { key: 'B', text: 'It is important to have an original product.' },
            { key: 'C', text: 'The presentation is an important factor.' },
          ],
          answerKey: 'C',
          explanation: "Jon emphasises presentation and serving: 'that's how you're going to serve it. On a plate? In a bag? ... It's got to be easy to eat and look attractive or customers won't come back'.",
          transcriptExcerpt: "how you're going to serve it. On a plate? In a bag? Will you provide a fork? ... It's got to be easy to eat and look attractive or customers won't come back.",
          audioTimestampSeconds: 110,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 2: Questions 17-20 (Matching)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g5',
      partNumber: 2,
      questionType: 'matching',
      title: 'Questions 17–20',
      instructions: 'What problem did the owners of each of the following street food businesses experience?\nChoose FOUR answers from the box and write the correct letter, A–F, next to Questions 17–20.',
      startQuestionNumber: 17,
      endQuestionNumber: 20,
      optionsList: [
        { key: 'A', text: 'Some ingredients were too expensive.' },
        { key: 'B', text: 'The meals took a long time to prepare.' },
        { key: 'C', text: 'They had no money for marketing.' },
        { key: 'D', text: 'It was difficult to get a permit to sell food.' },
        { key: 'E', text: 'A competitor was selling similar food in their area.' },
        { key: 'F', text: 'They worked very long hours.' },
      ],
      questions: [
        {
          id: 'c21-l3-q17',
          questionNumber: 17,
          prompt: 'Thai Basil',
          answerKey: 'F',
          explanation: "Jon says: 'Their work-life balance was non-existent as they were working til midnight in the restaurant all week and then took their food truck to markets on their days off' (worked very long hours, F).",
          transcriptExcerpt: 'Their work-life balance was non-existent as they were working til midnight in the restaurant all week and then took their food truck to markets on their days off.',
          audioTimestampSeconds: 130,
        },
        {
          id: 'c21-l3-q18',
          questionNumber: 18,
          prompt: 'Basque',
          answerKey: 'A',
          explanation: "Jon explains: 'the price of fish - essential for some of their dishes - was so high. And it was hard to charge customers a lot more for those dishes' (ingredients too expensive, A).",
          transcriptExcerpt: 'the price of fish - essential for some of their dishes - was so high. And it was hard to charge customers a lot more for those dishes.',
          audioTimestampSeconds: 145,
        },
        {
          id: 'c21-l3-q19',
          questionNumber: 19,
          prompt: "Lou's kitchen",
          answerKey: 'B',
          explanation: "Jon says: 'some of their dishes were quite complicated. At one of their first events they ended up with people standing in a long queue for more than 15 minutes - and many of them lost patience' (meals took a long time to prepare, B).",
          transcriptExcerpt: 'some of their dishes were quite complicated. At one of their first events they ended up with people standing in a long queue for more than 15 minutes - and many of them lost patience.',
          audioTimestampSeconds: 165,
        },
        {
          id: 'c21-l3-q20',
          questionNumber: 20,
          prompt: 'Chip Chop',
          answerKey: 'D',
          explanation: "Jon explains: 'what they hadn't realised was that they'd need a special licence - which individual businesses don't need at markets or festivals. It was a complicated process and in the end they gave up' (difficult to get a permit, D).",
          transcriptExcerpt: "what they hadn't realised was that they'd need a special licence - which individual businesses don't need at markets or festivals. It was a complicated process and in the end they gave up.",
          audioTimestampSeconds: 185,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 21-22 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g6',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 21 and 22',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 21,
      endQuestionNumber: 22,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'Their definitions keep changing.' },
        { key: 'B', text: 'People think they mean the same thing.' },
        { key: 'C', text: "The term 'eco-friendly' is preferable." },
        { key: 'D', text: 'They are often used imprecisely.' },
        { key: 'E', text: 'Companies should avoid using them on clothing labels.' },
      ],
      questions: [
        {
          id: 'c21-l3-q21',
          questionNumber: 21,
          prompt: "Which TWO points do the speakers make about the terms 'ethical' and 'sustainable' fashion?",
          options: [
            { key: 'A', text: 'Their definitions keep changing.' },
            { key: 'B', text: 'People think they mean the same thing.' },
            { key: 'C', text: "The term 'eco-friendly' is preferable." },
            { key: 'D', text: 'They are often used imprecisely.' },
            { key: 'E', text: 'Companies should avoid using them on clothing labels.' },
          ],
          answerKey: ['B', 'D'],
          explanation: "Maddy points out: 'most people use these terms interchangeably' (think they mean the same thing, B) and notes: 'They're often deliberately vague, I think, and don't provide enough information' (used imprecisely, D).",
          transcriptExcerpt: "most people use these terms interchangeably - but in fact the difference is quite distinct... They're often deliberately vague, I think, and don't provide enough information about how their products are made.",
          audioTimestampSeconds: 25,
        },
        {
          id: 'c21-l3-q22',
          questionNumber: 22,
          prompt: "Which TWO points do the speakers make about the terms 'ethical' and 'sustainable' fashion?",
          options: [
            { key: 'A', text: 'Their definitions keep changing.' },
            { key: 'B', text: 'People think they mean the same thing.' },
            { key: 'C', text: "The term 'eco-friendly' is preferable." },
            { key: 'D', text: 'They are often used imprecisely.' },
            { key: 'E', text: 'Companies should avoid using them on clothing labels.' },
          ],
          answerKey: ['B', 'D'],
          explanation: "Maddy points out: 'most people use these terms interchangeably' (think they mean the same thing, B) and notes: 'They're often deliberately vague, I think, and don't provide enough information' (used imprecisely, D).",
          transcriptExcerpt: "most people use these terms interchangeably - but in fact the difference is quite distinct... They're often deliberately vague, I think, and don't provide enough information about how their products are made.",
          audioTimestampSeconds: 42,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 23-24 (Multiple Choice Multi)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g7',
      partNumber: 3,
      questionType: 'listening_multiple_choice_multi',
      title: 'Questions 23 and 24',
      instructions: 'Choose TWO letters, A–E.',
      startQuestionNumber: 23,
      endQuestionNumber: 24,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      optionsList: [
        { key: 'A', text: 'Sheep are generally well-treated.' },
        { key: 'B', text: 'Wool is easy to recycle.' },
        { key: 'C', text: 'Wool is a long-lasting fabric.' },
        { key: 'D', text: 'Wool production involves few chemicals.' },
        { key: 'E', text: 'Sheep do less environmental damage than other livestock.' },
      ],
      questions: [
        {
          id: 'c21-l3-q23',
          questionNumber: 23,
          prompt: 'Which TWO claims about wool production do the speakers disagree with?',
          options: [
            { key: 'A', text: 'Sheep are generally well-treated.' },
            { key: 'B', text: 'Wool is easy to recycle.' },
            { key: 'C', text: 'Wool is a long-lasting fabric.' },
            { key: 'D', text: 'Wool production involves few chemicals.' },
            { key: 'E', text: 'Sheep do less environmental damage than other livestock.' },
          ],
          answerKey: ['D', 'E'],
          explanation: "Maddy disputes the chemical claim: 'I wasn't convinced by the argument that wool production is sustainable because it doesn't use many chemicals - what about all the fungicides and insecticides used in sheep farming?' (D). Ryan adds: 'I couldn't find any evidence for the claim about sheep farming being better for the environment than cattle farming' (E).",
          transcriptExcerpt: "MADDY: But I wasn't convinced by the argument that wool production is sustainable because it doesn't use many chemicals - what about all the fungicides and insecticides used in sheep farming? RYAN: Good point. And I couldn't find any evidence for the claim about sheep farming being better for the environment than cattle farming.",
          audioTimestampSeconds: 65,
        },
        {
          id: 'c21-l3-q24',
          questionNumber: 24,
          prompt: 'Which TWO claims about wool production do the speakers disagree with?',
          options: [
            { key: 'A', text: 'Sheep are generally well-treated.' },
            { key: 'B', text: 'Wool is easy to recycle.' },
            { key: 'C', text: 'Wool is a long-lasting fabric.' },
            { key: 'D', text: 'Wool production involves few chemicals.' },
            { key: 'E', text: 'Sheep do less environmental damage than other livestock.' },
          ],
          answerKey: ['D', 'E'],
          explanation: "Maddy disputes the chemical claim: 'I wasn't convinced by the argument that wool production is sustainable because it doesn't use many chemicals - what about all the fungicides and insecticides used in sheep farming?' (D). Ryan adds: 'I couldn't find any evidence for the claim about sheep farming being better for the environment than cattle farming' (E).",
          transcriptExcerpt: "MADDY: But I wasn't convinced by the argument that wool production is sustainable because it doesn't use many chemicals - what about all the fungicides and insecticides used in sheep farming? RYAN: Good point. And I couldn't find any evidence for the claim about sheep farming being better for the environment than cattle farming.",
          audioTimestampSeconds: 78,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 3: Questions 25-30 (Matching)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g8',
      partNumber: 3,
      questionType: 'matching',
      title: 'Questions 25–30',
      instructions: 'What comment do the speakers make about each of the following semi-synthetic fabrics?\nChoose SIX answers from the box and write the correct letter, A–H, next to Questions 25–30.',
      startQuestionNumber: 25,
      endQuestionNumber: 30,
      optionsList: [
        { key: 'A', text: 'The production process is fuel efficient.' },
        { key: 'B', text: 'It is the least sustainable of alternative fabrics.' },
        { key: 'C', text: 'Production costs are high.' },
        { key: 'D', text: 'It provides additional health benefits.' },
        { key: 'E', text: 'It is not durable in the long-term.' },
        { key: 'F', text: 'It needs to be produced in a certain way to be sustainable.' },
        { key: 'G', text: 'Chemicals required for production can be reused.' },
        { key: 'H', text: 'This is from a wholly sustainable source.' },
      ],
      questions: [
        {
          id: 'c21-l3-q25',
          questionNumber: 25,
          prompt: 'Lyocell',
          answerKey: 'G',
          explanation: "Ryan says: 'Over 99% of dissolving agents used in the manufacturing process are used again' (chemicals can be reused, G).",
          transcriptExcerpt: 'Over 99% of dissolving agents used in the manufacturing process are used again.',
          audioTimestampSeconds: 100,
        },
        {
          id: 'c21-l3-q26',
          questionNumber: 26,
          prompt: 'Cupro',
          answerKey: 'B',
          explanation: "Maddy notes pollution from its process, and Ryan agrees: 'It doesn't compare favourably with all the other sustainable fabrics we've looked at, no' (least sustainable of alternative fabrics, B).",
          transcriptExcerpt: "pollution caused by the manufacturing process... It doesn't compare favourably with all the other sustainable fabrics we've looked at, no.",
          audioTimestampSeconds: 115,
        },
        {
          id: 'c21-l3-q27',
          questionNumber: 27,
          prompt: 'Bamboo',
          answerKey: 'F',
          explanation: "Maddy explains: 'it was only organic bamboo that's truly sustainable' and Ryan mentions that standard manufacturing is chemically intensive (needs to be produced in a certain way, F).",
          transcriptExcerpt: "it was only organic bamboo that's truly sustainable... manufacturing process for a significant proportion of bamboo is chemically quite intensive",
          audioTimestampSeconds: 130,
        },
        {
          id: 'c21-l3-q28',
          questionNumber: 28,
          prompt: 'EcoVero',
          answerKey: 'A',
          explanation: "Ryan explains: 'manufacturing causes 50 percent fewer emissions and takes up half as much energy as conventional fabrics' (fuel efficient / energy saving, A).",
          transcriptExcerpt: 'manufacturing causes 50 percent fewer emissions and takes up half as much energy as conventional fabrics.',
          audioTimestampSeconds: 150,
        },
        {
          id: 'c21-l3-q29',
          questionNumber: 29,
          prompt: 'Cork',
          answerKey: 'H',
          explanation: "Ryan states: 'it's the only fabric that's fundamentally sustainable - the cork trees it comes from are renewable and the product itself is both recyclable and biodegradable - which is unique. And the harvesting process is actually good for the trees' (wholly sustainable source, H).",
          transcriptExcerpt: "it's the only fabric that's fundamentally sustainable... the cork trees it comes from are renewable and the product itself is both recyclable and biodegradable... There are no downsides to using this source at all.",
          audioTimestampSeconds: 170,
        },
        {
          id: 'c21-l3-q30',
          questionNumber: 30,
          prompt: 'Hemp',
          answerKey: 'D',
          explanation: "Maddy points out: 'Did you know that clothes made from hemp protect the wearer from the sun and it's also antibacterial?' (additional health benefits, D).",
          transcriptExcerpt: "Did you know that clothes made from hemp protect the wearer from the sun and it's also antibacterial?",
          audioTimestampSeconds: 190,
        },
      ],
    },

    // -------------------------------------------------------------
    // PART 4: Questions 31-40 (Note Completion)
    // -------------------------------------------------------------
    {
      id: 'c21-l3-g9',
      partNumber: 4,
      questionType: 'note_completion',
      title: 'Questions 31–40',
      instructions: 'Complete the notes below.\nWrite ONE WORD ONLY for each answer.',
      startQuestionNumber: 31,
      endQuestionNumber: 40,
      wordLimitRule: 'ONE WORD ONLY',
      maxWords: 1,
      maxNumbers: 0,
      contentWithGaps: `Invasive species
Definition: an animal or plant that causes harm to an environment after being introduced by humans

An invasive species can be a problem when it:
• eats native species.
• introduces a new [[31]].
• takes food from native species.
• threatens an entire [[32]].

How invasive species spread
• accidentally e.g. via people returning from their [[33]] or on cargo ships
• intentionally e.g. for pest control, or as [[34]].

Examples of invasive species
• Rhinella marina (toads)
  - were introduced to Australia from Hawaii in 1935 to eat a type of insect that was damaging the [[35]] plantations.
  - failed to solve the problem and became widespread in the north of Australia.
  - are poisonous for any species that eats them and reduce the food available for native frogs.
• Japanese knotweed plants were popular among 19th-century gardeners in the UK.
• Rhododendron plants prevent [[36]] from reaching native plants.
• Grey squirrels from N. America reduce sources of food for the UK's native red squirrels and spread a [[37]] that kills red squirrels.

Tackling invasive species
• Monitoring helps us to understand the [[38]] of invasive species and the impact they have.
• Setting up a national [[39]] makes it easier to track them.
• Asking the public to [[40]] and report them helps with monitoring.`,
      questions: [
        {
          id: 'c21-l3-q31',
          questionNumber: 31,
          prompt: 'An invasive species can be a problem when it introduces a new ________.',
          answerKey: 'disease',
          acceptedAlternatives: ['disease'],
          explanation: "The speaker explains: 'or sometimes they may bring a disease with them, which native species have never faced before'.",
          transcriptExcerpt: 'or sometimes they may bring a disease with them, which native species have never faced before and therefore have no defences against.',
          audioTimestampSeconds: 35,
        },
        {
          id: 'c21-l3-q32',
          questionNumber: 32,
          prompt: 'An invasive species can be a problem when it threatens an entire ________.',
          answerKey: 'ecosystem',
          acceptedAlternatives: ['ecosystem'],
          explanation: "The speaker states: 'Species invasions are one of the biggest causes of damage in an ecosystem, actually putting its survival at risk'.",
          transcriptExcerpt: 'Species invasions are one of the biggest causes of damage in an ecosystem, actually putting its survival at risk.',
          audioTimestampSeconds: 50,
        },
        {
          id: 'c21-l3-q33',
          questionNumber: 33,
          prompt: 'How invasive species spread — accidentally e.g. via people returning from their ________ or on cargo ships',
          answerKey: 'holiday',
          acceptedAlternatives: ['holiday', 'holidays'],
          explanation: "The speaker mentions: 'such as when people who've been on holiday in another country come back with, say, the seeds of plants on their clothes or shoes'.",
          transcriptExcerpt: "such as when people who've been on holiday in another country come back with, say, the seeds of plants on their clothes or shoes.",
          audioTimestampSeconds: 70,
        },
        {
          id: 'c21-l3-q34',
          questionNumber: 34,
          prompt: 'How invasive species spread — intentionally e.g. for pest control, or as ________.',
          answerKey: 'pets',
          acceptedAlternatives: ['pets', 'pet'],
          explanation: "The speaker explains: 'for example to use them to control pests on farms, or to be pets'.",
          transcriptExcerpt: 'for example to use them to control pests on farms, or to be pets. This can go very wrong if those animals and plants move into wild settings',
          audioTimestampSeconds: 85,
        },
        {
          id: 'c21-l3-q35',
          questionNumber: 35,
          prompt: 'Rhinella marina (toads) were introduced to eat an insect damaging the ________ plantations.',
          answerKey: 'sugar',
          acceptedAlternatives: ['sugar'],
          explanation: "The speaker explains: 'It was hoped that the toads would eat the grey-backed beetles responsible for destroying crops of sugar on many of the plantations'.",
          transcriptExcerpt: 'responsible for destroying crops of sugar on many of the plantations.',
          audioTimestampSeconds: 110,
        },
        {
          id: 'c21-l3-q36',
          questionNumber: 36,
          prompt: 'Rhododendron plants prevent ________ from reaching native plants.',
          answerKey: 'light',
          acceptedAlternatives: ['light', 'sunlight'],
          explanation: "The speaker says: 'they're now seen as harmful because they block out so much light that native wild flowers can't grow beneath them'.",
          transcriptExcerpt: "they're now seen as harmful because they block out so much light that native wild flowers can't grow beneath them.",
          audioTimestampSeconds: 145,
        },
        {
          id: 'c21-l3-q37',
          questionNumber: 37,
          prompt: 'Grey squirrels reduce food for red squirrels and spread a ________ that kills red squirrels.',
          answerKey: 'virus',
          acceptedAlternatives: ['virus'],
          explanation: "The speaker states: 'and the grey squirrels carry a type of virus that is deadly to the red squirrels'.",
          transcriptExcerpt: 'and the grey squirrels carry a type of virus that is deadly to the red squirrels. Red squirrel populations have collapsed',
          audioTimestampSeconds: 168,
        },
        {
          id: 'c21-l3-q38',
          questionNumber: 38,
          prompt: 'Monitoring helps us to understand the ________ of invasive species and the impact they have.',
          answerKey: 'behaviour',
          acceptedAlternatives: ['behaviour', 'behavior'],
          explanation: "The speaker notes: 'The first step in controlling invasive species is learning about the behaviour of new species coming into the country'.",
          transcriptExcerpt: 'The first step in controlling invasive species is learning about the behaviour of new species coming into the country.',
          audioTimestampSeconds: 185,
        },
        {
          id: 'c21-l3-q39',
          questionNumber: 39,
          prompt: 'Setting up a national ________ makes it easier to track them.',
          answerKey: 'database',
          acceptedAlternatives: ['database'],
          explanation: "The speaker says: 'One effective way to keep track of invasive species is to create a database for the whole country'.",
          transcriptExcerpt: 'One effective way to keep track of invasive species is to create a database for the whole country.',
          audioTimestampSeconds: 200,
        },
        {
          id: 'c21-l3-q40',
          questionNumber: 40,
          prompt: 'Asking the public to ________ and report them helps with monitoring.',
          answerKey: 'photograph',
          acceptedAlternatives: ['photograph', 'photo'],
          explanation: "The speaker advises: 'They should be encouraged to photograph harmful species - because this helps with identification - and then to report when and where these were observed'.",
          transcriptExcerpt: 'They should be encouraged to photograph harmful species - because this helps with identification - and then to report when and where these were observed.',
          audioTimestampSeconds: 215,
        },
      ],
    },
  ];

  return {
    title: 'Cambridge IELTS 21 Academic Listening Test 3',
    category: 'mock',
    audioMode: 'part_audios',
    timeLimitMinutes: 40,
    audioConfig: {
      postTestCheckTimeSeconds: 120,
      audioMode: 'part_audios',
      overallAudioUrl: '/audio/listening/c21_test3_complete.mp3',
      parts: [
        { partNumber: 1, audioUrl: '/audio/listening/c21_test3_part1.mp3', durationSeconds: 360 },
        { partNumber: 2, audioUrl: '/audio/listening/c21_test3_part2.mp3', durationSeconds: 340 },
        { partNumber: 3, audioUrl: '/audio/listening/c21_test3_part3.mp3', durationSeconds: 380 },
        { partNumber: 4, audioUrl: '/audio/listening/c21_test3_part4.mp3', durationSeconds: 390 },
      ],
    },
    parts,
    questionGroups,
  };
}

export async function ingestCambridge21ListeningTest3(authorId?: string): Promise<{
  testId: string;
  versionId: string;
  status: 'published';
  totalQuestions: number;
}> {
  const data = getCambridge21ListeningTest3Data();
  const errors = validateListeningTestVersion(data.parts, data.questionGroups);
  if (errors.length > 0) {
    throw new Error(`Cambridge 21 Listening Test 3 validation failed:\n- ${errors.join('\n- ')}`);
  }

  const resolvedAuthorId =
    authorId ||
    ((await db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get()) as any)?.id ||
    uuidv4();

  const now = new Date().toISOString();

  const existingTest = (await db
    .prepare("SELECT id, current_version_number FROM listening_tests WHERE title LIKE '%Cambridge%21%Listening%Test 3%' OR title = ?")
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
