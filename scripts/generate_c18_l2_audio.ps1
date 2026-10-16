$audioDir = Join-Path $PSScriptRoot "..\public\audio\listening"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

$clientAudioDir = Join-Path $PSScriptRoot "..\client\public\audio\listening"
if (-not (Test-Path $clientAudioDir)) {
    New-Item -ItemType Directory -Path $clientAudioDir -Force | Out-Null
}

$clientDistAudioDir = Join-Path $PSScriptRoot "..\client\dist\audio\listening"
if (-not (Test-Path $clientDistAudioDir)) {
    New-Item -ItemType Directory -Path $clientDistAudioDir -Force | Out-Null
}

Add-Type -AssemblyName System.Speech

function Generate-Speech($baseName, $text) {
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.Rate = 0
    $wavPath = Join-Path $audioDir "$baseName.wav"
    $synth.SetOutputToWaveFile($wavPath)
    $synth.Speak($text)
    $synth.Dispose()

    # Also copy as .mp3 and to client
    $mp3Path = Join-Path $audioDir "$baseName.mp3"
    Copy-Item $wavPath $mp3Path -Force

    Copy-Item $wavPath (Join-Path $clientAudioDir "$baseName.wav") -Force
    Copy-Item $mp3Path (Join-Path $clientAudioDir "$baseName.mp3") -Force
    Copy-Item $wavPath (Join-Path $clientDistAudioDir "$baseName.wav") -Force
    Copy-Item $mp3Path (Join-Path $clientDistAudioDir "$baseName.mp3") -Force

    Write-Host "Generated audio for $baseName ($((Get-Item $wavPath).Length) bytes)"
}

$p1 = @"
Good morning and welcome to Part 1.
So, I understand you're interested in restaurant work?
Yes. I've got a bit of experience and I can provide references.
That's good. I can check all that later. Now, Milo's Restaurants have some vacancies at the moment. They're a really good company to work for. Lots of benefits.
Oh right.
Yes. They've got a very good reputation for looking after staff. For example, all employees get training - even temporary staff.
Oh really? That's quite unusual, isn't it?
Certainly is.
And do staff get free uniforms too?
Um... you just need to wear a white T-shirt and black trousers, it says here. So I guess not ... But another benefit of working for a big company like this is that you can get a discount at any of their restaurants.
Even at weekends?
No, but you'll be working then anyway.
Oh yes. I suppose so. Most of their restaurants are in the city centre, aren't they? So, easy to get to by bus?
Yes. That's right. But if you have to do a late shift and finish work after midnight, the company will pay for you to get a taxi home.
I probably won't need one. I think I'd use my bike.
OK. Now, they do have some quite specific requirements for the kind of person they're looking for. Milo's is a young, dynamic company and they're really keen on creating a strong team. It's really important that you can fit in and get on well with everyone.
Yeah. I've got no problem with that. It sounds good, actually. The last place I worked for was quite demanding too. We had to make sure we gave a really high level of service.
That's good to hear because that will be equally important at Milo's. I know they want people who have an eye for detail.
That's fine. I'm very used to working in that kind of environment.
Perfect. So the only other thing that's required is good communication skills, so you'll need to have a certificate in English.
Sure.
OK. Let's have a look at the current job vacancies at Milo's. The first one is in Wivenhoe Street.
Sorry, where?
Wivenhoe. W-I-V-E-N-H-O-E. It's quite central, just off Cork Street.
Oh right.
They're looking for a breakfast supervisor.
That would be OK.
So you're probably familiar with the kind of responsibilities involved. Obviously checking that all the portions are correct, etc., and then things like checking all the procedures for cleaning the equipment are being followed.
OK. And what about the salary? In my last job I was getting £9.50 per hour. I was hoping to get a bit more than that.
Well, to begin with, you'd be getting £9.75 but that goes up to £11.25 after three months.
That's not too bad. And I suppose it's a very early start?
Mmm. That's the only unattractive thing about this job. But then you have the afternoons and evenings free. So the restaurant starts serving breakfast from 7 a.m. And you'd have to be there at 5.30 to set everything up. But you'd be finished at 12.30.
Mmm. Well, as you say, there are advantages to that.
Now, you might also be interested in the job at the City Road branch. That's for a junior chef, so again a position of responsibility.
I might prefer that, actually.
Right, well obviously this role would involve supporting the sous chef and other senior staff. And you'd be responsible for making sure there's enough stock each week - and sorting out all the deliveries.
I've never done that before, but I imagine it's fairly straightforward, once you get the hang of it.
Yes, and you'd be working alongside more experienced staff to begin with, so I'm sure it wouldn't be a problem. The salary's slightly higher here. It's an annual salary of £23,000.
Right.
I know that if they like you, it's likely you'll be promoted quite quickly. So that's worth thinking about.
Yes. It does sound interesting. What are the hours like?
The usual, I think. There's a lot of evening and weekend work, but they're closed on Mondays. But you do get one Sunday off every four weeks. So would you like me to send off your application?
"@

$p2 = @"
Hello everyone. It's good to see that so many members of the public have shown up for our presentation on the new housing development planned on the outskirts of Nunston. I'm Mark Reynolds and I'm Communications Manager at the development.

I'll start by giving you a brief overview of our plans for the development. So one thing I'm sure you'll want to know is why we've selected this particular site for a housing development. At present it's being used for farming, like much of the land around Nunston. But because of the new industrial centre in Nunston, there's a lot of demand for housing for employees in the region, as many employees are having to commute long distances at present. Of course, there's also the fact that we have an international airport just 20 minutes' drive away, but although that's certainly convenient, it wasn't one of our major criteria for choosing the site. We were more interested in the fact that there's an excellent hospital just 15 kilometres away, and a large secondary school even closer than that. One drawback to the site is that it's on quite a steep slope, but we've taken account of that in our planning so it shouldn't be a major problem.

We've had a lot of positive feedback about the plans. People like the wide variety of accommodation types and prices, and the fact that it's only a short drive to get out into the countryside from the development. We were particularly pleased that so many people liked the designs for the layout of the development, with the majority of people saying it generally made a good impression and blended in well with the natural features of the landscape, with provision made for protecting trees and wildlife on the site. Some people have mentioned that they'd like to see more facilities for cyclists, and we'll look at that, but the overall feedback has been that the design and facilities of the development make it seem a place where people of all ages can live together happily.

OK. So I'll put a map of the proposed development up on the screen. You'll see it's bounded on the south side by the main road, which then goes on to Nunston. Another boundary is formed by London Road, on the western side of the development. Inside the development there'll be about 400 houses and 3 apartment blocks.

There'll also be a school for children up to 11 years old. If you look at the South Entrance at the bottom of the map, there's a road from there that goes right up through the development. The school will be on that road, at the corner of the second turning to the left.

A large sports centre is planned with facilities for indoor and outdoor activities. This will be on the western side of the development, just below the road that branches off from London Road.

There'll be a clinic where residents can go if they have any health problems. Can you see the lake towards the top of the map? The clinic will be just below this, to the right of a street of houses.

There'll also be a community centre for people of all ages. On the northeast side of the development, there'll be a row of specially designed houses specifically for residents over 65, and the community centre will be adjoining this.

We haven't forgotten about shopping. There'll be a supermarket between the two entrances to the development. We're planning to leave the three large trees near London Road, and it'll be just to the south of these.

It's planned to have a playground for younger children. If you look at the road that goes up from the South Entrance, you'll see it curves round to the left at the top, and the playground will be in that curve, with nice views of the lake.

OK, so now does anyone have any questions?
"@

$p3 = @"
So, Michelle, shall we make a start on our presentation? We haven't got that much time left.
No, Adam. But at least we've done all the background reading. I found it really interesting - I'd never even heard of the Laki eruption before this.
Me neither. I suppose 1783 is a long time ago.
But it was a huge eruption and it had such devastating consequences.
I know. It was great there were so many primary sources to look at. It really gives you a sense of how catastrophic the volcano was. People were really trying to make sense of the science for the first time.
That's right. But what I found more significant was how it impacted directly and indirectly on political events, as well as having massive social and economic consequences.
I know. That should be the main focus of our presentation.
The observations made by people at the time were interesting, weren't they? I mean, they all gave a pretty consistent account of what happened, even if they didn't always use the same terminology.
Yeah. I was surprised there were so many weather stations established by that time – so, you know, you can see how the weather changed, often by the hour.
Right. Writers at the time talked about the Laki haze to describe the volcanic fog that spread across Europe. They all realised that this wasn't the sort of fog they were used to - and of course this was in pre-industrial times - so they hadn't experienced sulphur-smelling fog before.
No, that's true.
Reports from the period blamed the haze for an increase in headaches, respiratory issues and asthma attacks. And they all describe how it covered the sun and made it look a strange red colour.
Must have been very weird.
It's interesting that Benjamin Franklin wrote about the haze. Did you read that? He was the American ambassador in Paris at the time.
Yeah. At first no one realised that the haze was caused by the volcanic eruption in Iceland.
It was Benjamin Franklin who realised that before anyone else.
He's often credited with that, apparently. But a French naturalist beat him to it - I can't remember his name. I'd have to look it up. Then other naturalists had the same idea - all independently of each other.
Oh right. We should talk about the immediate impact of the eruption, which was obviously enormous - especially in Iceland, where so many people died.
Mmm. You'd expect that - and the fact that the volcanic ash drifted so swiftly - but not that the effects would go on for so long. Or that two years after the eruption, strange weather events were being reported as far away as North America and North Africa.
No. I found all that hard to believe too. It must have been terrible – and there was nothing anyone could do about it, even if they knew the ash cloud was coming in their direction.
We should run through some of the terrible consequences of the eruption experienced in different countries. There's quite a varied range.
Starting with Iceland, where the impact on farming was devastating.
Mmm. One of the most dramatic things there was the effect on livestock as they grazed in the fields. They were poisoned because they ate vegetation that had been contaminated with fluorine as a result of the volcanic fallout.
That was horrible. In Egypt, the bizarre weather patterns led to a severe drought and as a result the Nile didn't flood, which meant the crops all failed.
It's so far from where the eruption happened and yet the famine there led to more people dying than any other country. It was worse than the plague.
OK. Then in the UK the mortality rate went up a lot - presumably from respiratory illnesses. According to one report it was about double the usual number and included an unusually high percentage of people under the age of 25.
Mmm. I think people will be surprised to hear that the weather in the USA was badly affected too. George Washington even makes a note in his diary that they were snowbound until March in Virginia. That was before he became president.
Yes, and there was ice floating down the Mississippi, which was unprecedented.
Astonishing, really. Anyway, what do you think...
"@

$p4 = @"
Good morning. Now, we've been asked to choose an aspect of European clothing or fashion and to talk about its development over time.

I decided to focus on a rather small area of clothing and that's pockets. I chose pockets for two reasons, really. We all have them - in jeans, jackets, coats, for example - and even though we often carry bags or briefcases as well, nothing is quite as convenient as being able to pop your phone or credit card into your pocket. Yet, I suspect that, other than that, people don't really think about pockets too much and they're rather overlooked as a fashion item.

It's certainly very interesting to go back in time and see how pockets developed for men and women. In the 18th century, fashions were quite different from the way they are now, and pockets were too. If we think about male fashion first... that was the time when suits became popular. Trousers were knee-length only and referred to as 'breeches', the waistcoats were short and the jackets were long, but all three garments were lined with material and pockets were sewn into this cloth by whichever tailor the customer used. The wearer could then carry small objects such as pencils or coins on their person and reach them through a gap in the lining. Coat pockets became increasingly decorative on the outside for men who wanted to look stylish, but they were often larger but plainer if the wearer was someone with a profession who needed to carry medical instruments – a doctor or physician, for example.

The development of women's pockets was a little different. For one thing, they weren't nearly as visible or as easy to reach as men's. In the 18th and 19th centuries, women carried numerous possessions on their person and some of these could be worth a lot of money. Women were more vulnerable to theft and wealthy women, in particular, worried constantly about pickpockets. So – what they did was to have a pair of pockets made that were tied together with string. The pockets were made of fabric, which might be recycled cloth if the wearer had little money or something more expensive, such as linen, sometimes featuring very delicate embroidery. Women tied the pockets around their waist so that they hung beneath their clothes. Remember, skirts were long then and there was plenty of room to hide a whole range of small possessions between the layers of petticoats that were commonly worn. They would have an opening in the folds of their skirts through which they could reach whatever they needed, like their perfume. Working women, of course, also needed to carry around items that they might use for whatever job or trade they were involved in, but their pairs of pockets still remained on the inside of their clothing, they just got bigger or longer - sometimes reaching down to their knees!

So the tie-on pockets went well into the 19th century and only changed when fashion altered towards the end of that period. That's when dresses became tighter and less bulky, and the pairs of pockets became very noticeable – they stood out too much and detracted from the woman's image. Women who had been used to carrying around a range of personal possessions - and still wanted to - needed somewhere to carry these items about their person. That was when small bags, or pouches as they were known, came into fashion and, of course, they inevitably led on to the handbag of more modern times, particularly when fashion removed pockets altogether.
"@

Generate-Speech "c18_test2_part1" $p1
Generate-Speech "c18_test2_part2" $p2
Generate-Speech "c18_test2_part3" $p3
Generate-Speech "c18_test2_part4" $p4

Write-Host "All audio files for Cambridge 18 Listening Test 2 generated successfully!"
