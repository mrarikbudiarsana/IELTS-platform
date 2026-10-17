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

    $mp3Path = Join-Path $audioDir "$baseName.mp3"
    Copy-Item $wavPath $mp3Path -Force

    Copy-Item $wavPath (Join-Path $clientAudioDir "$baseName.wav") -Force
    Copy-Item $mp3Path (Join-Path $clientAudioDir "$baseName.mp3") -Force
    Copy-Item $wavPath (Join-Path $clientDistAudioDir "$baseName.wav") -Force
    Copy-Item $mp3Path (Join-Path $clientDistAudioDir "$baseName.mp3") -Force

    Write-Host "Generated audio for $baseName ($((Get-Item $wavPath).Length) bytes)"
}

$p1 = @"
Hello, Easy Life Cleaning Services, Jacinta speaking.
Oh hello. I'm looking for a cleaning service for my apartment. Do you do domestic cleaning?
Sure.
Well, it's just a one-bedroom flat. Do you have a basic cleaning package?
Yes. For a one-bedroom flat we're probably looking at about two hours for a clean. We do a thorough clean of all surfaces in each room, and polish them where necessary. Does your apartment have carpets?
No, I don't have any carpets, but the floors would need cleaning.
Of course, we'd do that in every room. And we'd do a thorough clean of the kitchen and bathroom.
OK.
Then we have some additional services which you can request if you want. So for example, we can clean your oven for you every week.
Actually, I hardly ever use that, but can you do the fridge?
Sure. Would you like that done every week?
Yes, definitely. And would ironing clothes be an additional service you can do?
Yes, of course.
It wouldn't be much, just my shirts for work that week.
That's fine. And we could also clean your microwave if you want.
No, I wipe that out pretty regularly so there's no need for that.
We also offer additional services that you might want a bit less often, say every month. So for example, if the inside of your windows need cleaning, we could do that.
Yes, that'd be good. I'm on the fifteenth floor, so the outside gets done regularly by specialists, but the inside does get a bit grubby.
And we could arrange for your curtains to get cleaned if necessary.
No, they're fine. But what about washing down the balcony?
Yes, we can do that.
Great.
Is there anything else?
Well, I've just moved out of a house and into this flat, and I've got a lot of boxes I need to get rid of. Do you take cardboard away?
No, I'm afraid we don't. But we do have a list of other local companies you could contact for removal. Or if you need a plumber or an electrician, we can recommend those too.
Oh, great. Thank you.
Now, what about specialized cleaning? We do things like dry cleaning for rugs, or cleaning up after builders, and a service for people who are allergic to dust.
Right. Fortunately, I don't have that problem, but my sister does, so I'll bear it in mind. Now, what about security? What kind of checks do you do on your cleaners?
Well, we only employ people who have regular references, but before we take them on, they have a background check carried out by the police.
Right. That's good to know.
And we don't just send them out straight away. They complete a two-week training period, shadowing an experienced cleaner.
OK.
And we monitor them closely. We require customers to send a review after each visit, so we can deal with any problems quickly if they arise.
Right. Well, I'd like to go ahead with that.
"@

$p2 = @"
Good morning, everyone. In today's hospitality seminar, I want to talk about staff turnover and retention in hotels.
Staff retention is one of the most critical challenges facing the hotel industry today. Surprisingly, many hotel managers are unaware that their staff often leave because of a lack of training, rather than concerns over long working hours or low pay. When employees feel unprepared or unsupported in their roles, frustration sets in and they seek opportunities elsewhere.
Now, what is the direct impact of this high staff turnover on hotel managers? While you might think it affects staff morale or sales targets, the primary consequence managers experience is an increased workload. Managers end up spending disproportionate amounts of their time advertising vacancies, reviewing applications, interviewing candidates, and training new recruits all over again.
To maintain a stable workforce, managers must be mindful of their leadership approach. What mistake should managers always avoid? The answer is failing to treat staff equally. Perceived favouritism in scheduling, recognition, or task assignment quickly erodes trust and destroys team spirit.
Let's look at a case study: Dunwich Hotel. They implemented comprehensive mentoring and wellness initiatives. While they anticipated fewer customer complaints, they noticed an unexpected benefit: a noticeable rise in spending per customer, because experienced staff knew how to build rapport and recommend dining and spa amenities.
Next, let's examine different strategies used by hotels to reduce staff turnover.
At The Sun Club, management focused on improving relationships and teamwork among their staff, organizing regular team-building activities and collaborative shift meetings.
At The Portland, their strategy focused on providing career opportunities. They introduced structured pathways and career development schemes for internal promotions.
Bluewater Hotels tackled the problem differently by offering incentives and financial benefits, including performance bonuses and travel discounts.
Pentlow Hotels likewise found success by providing clear career opportunities, investing in accredited hospitality certifications and managerial training for frontline staff.
Green Planet decided that offering incentives and financial benefits was the most effective approach, introducing seasonal profit-sharing vouchers and grocery subsidies.
Finally, The Amesbury concentrated heavily on improving relationships and teamwork, redesigning staff break areas and instituting peer recognition awards.
"@

$p3 = @"
Hi Thomas, how are you getting on with our sports science research presentation?
Hi Jeanne. I'm making progress, but looking back at my own school days has given me a lot of perspective.
Really? How so?
Well, regarding my sporting activities at school, I was always quite fast and made the track team, and my fellow students admired me for winning races. But looking back honestly, I realize I could have worked harder at them instead of coasting on natural ability.
Yes, raw talent only gets you so far without discipline. And then you had the opportunity to train in Kenya, didn't you?
Yes, spending six months at the high-altitude training camp in Kenya was eye-opening. When I was there, I felt an overwhelming sense of gratitude for having such an extraordinary opportunity to train alongside world champions. But at the same time, when I saw how easily they outran me on every hill, I felt complete disbelief at how superior their endurance truly was.
That must have been a humbling experience! Now, what about our section on the historical development of sporting equipment?
Right! Let's go through the six items we selected.
First, the table tennis bat. In the early 20th century, the rubber pimpled surface became revolutionary because the material was being mass produced for another purpose, originally for typewriter covers.
Then the cricket helmet. When players first started wearing protective helmets in the late 1970s, it was actually unpopular among spectators, who complained it ruined the traditional aesthetic of the game.
Next, the cycle helmet. Early polystyrene cycling helmets were extremely bulky and poorly ventilated, meaning it could cause excessive sweating during long rides.
As for the golf club, early wooden club shafts made of hickory wood were prone to splintering and snapping, so it often had to be replaced after only a few matches.
Then the hockey stick. Before standardized manufacturing took over, professional hockey sticks were scarce, so people often needed to make their own using steam-bent wood.
And finally, the old leather football. In wet weather, the leather would absorb water and become dangerously heavy, which caused serious injuries and concussions when headed.
That covers all our historical examples clearly!
"@

$p4 = @"
Hello everyone. Today we're going to look at another natural food product, and that's maple syrup.
What is this exactly? Well, maple syrup looks rather like clear honey, but it's not made by bees; it's produced from the plant fluid – or sap – inside the maple tree, and that makes maple syrup a very natural product.
Maple syrup is a thick, golden, sweet-tasting liquid that can be bought in bottles or jars and poured onto food such as waffles and pancakes, or used in the baking of cakes and pastries. It contains no artificial preservatives or added ingredients, and it provides a healthy alternative to refined sugar.
The maple tree has many different species, but the sugar maple is the most renowned. The tree thrives best where there are sunny days combined with cool nights. The famous maple leaf has been on the Canadian national flag since 1964. Maple trees need moist soil, but the soil does not need fertilizer. The optimal growing conditions and climate are found throughout eastern Canada and northeastern North America.
Let's talk about the history. Early maple sugar producers among indigenous peoples made diagonal cuts or holes in the tree trunks to tap the sap. To concentrate the syrup, they placed hot rocks into the wooden troughs to heat the sap and boil off the excess water. They also crafted containers from birch tree bark to collect the sap.
Now, turning to modern maple syrup production.
First, regarding the trees: maple trees must be carefully protected, and tree trunks generally do not reach the necessary diameter of at least 25 centimetres until they have been growing for approximately 40 years. Within the tree, fluctuating temperatures during late winter drive the movement of sap.
In modern production, a tap is drilled into the trunk and a tube carries the sap directly into a collection bucket or modern pipeline system.
Next, the sap is transferred to large stainless-steel pans called evaporators, which are heated by means of a wood or oil fire.
During this vigorous boiling, a tremendous amount of steam is produced as water evaporates from the liquid.
Before packaging, a mineral residue known as sugar sand must be filtered out, because if left behind, it makes the syrup appear cloudy and compromises the smooth taste.
Once filtered and graded, the pure syrup is ready for use. It requires a staggering 40 litres of raw sap to produce just a single litre of finished maple syrup!
"@

Generate-Speech "c17_test4_part1" $p1
Generate-Speech "c17_test4_part2" $p2
Generate-Speech "c17_test4_part3" $p3
Generate-Speech "c17_test4_part4" $p4

Write-Host "All Cambridge 17 Listening Test 4 audio generated successfully."
