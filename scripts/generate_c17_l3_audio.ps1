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
Hi Jack. I was wondering if you could give me some advice about taking up surfing. We're thinking about a holiday this summer.
Sure! I'd love to help. Surfing is brilliant for family holidays in the summer, especially if you have children.
That sounds great. Do you need any special physical preparation?
Well, you need to be quite fit. Paddling out against the surf requires decent upper body strength and stamina.
Right, we'll start swimming to get ready. Where in Ireland would you recommend going?
Well, County Clare is really popular. The town of Lahinch has some good quality hotels and several very reputable surf schools. Plus, there are famous cliffs nearby, which make for a wonderful day out.
Excellent. Did you go anywhere else?
Yes, I’ve also been surfing in County Mayo, which is less well-known for surfing, but we had a really good time. That was a few years ago when the kids were younger. There’s a good surf school at Carrowniskey beach.
How do you spell that?
C-A-double R-O-W-N-I-S-K-E-Y.
OK.
I put the kids into the surf camp they run during the summer for 10–16 year olds.
Oh right. How long was that for?
The surf camp lasts for one week, with three hours of coaching every day. And when you're not surfing, you can also explore the local bay by kayak.
Wonderful. What's the best time of year to go?
The best month to go is September. The sea is at its warmest then, and the autumn swells start coming in. During the summer, the average temperature is approximately 19 degrees.
And what about the cost of equipment?
To hire a wetsuit and surfboard together costs about 30 euros per day. It’s also advisable to hire boots for warmth, as the Atlantic waters can feel chilly after an hour or two.
Thanks Jack, that’s really helpful advice!
"@

$p2 = @"
Good evening, everyone, and thank you for coming to find out about our school's extended hours childcare service. We know how important flexible childcare is for working parents, so let me explain how our service operates.
First of all, our childcare service is available both before and after school. Interestingly, more children attend after school than before school, though both sessions are well used. We can accommodate a maximum of 70 children across the service, so we advise booking your slots early.
Regarding the fees, we aim to keep our charges reasonable. A morning session is £3.50, and in the afternoon, if your child stays until 5 p.m., it costs £5.70. However, for a complete afternoon session per child, staying until our closing time of 6 p.m., the cost is £7.20.
Parents often ask about food. We provide a light snack directly after the school bell rings, and then children are given a proper meal at 5 p.m., such as pasta bake or jacket potatoes, which ensures they aren't hungry when you collect them.
Our service also runs during the school holidays from 8 a.m. to 6 p.m. What is different about arrangements in the school holidays is that children from other schools can attend, giving our pupils a great opportunity to make new friends.

Now, let me tell you about some of the special after-school activities on offer.
First, Spanish. We have a native speaker who comes in to teach conversational Spanish, though this involves an additional fee to cover the tutor's materials.
Next is Music. We have a variety of percussion and wind instruments, but because of the noise and supervision needed, this activity requires help from parents to run smoothly.
Then we have Painting. We introduced this recently, and it has proved immensely popular; in fact, it was requested by children themselves through our school council.
Yoga is another session we run once a week. This is a new activity that we only added this term, helping children develop relaxation techniques.
Finally, Cooking. In this class, the children learn basic kitchen skills and prepare simple dishes. Because of the use of heat and sharp utensils, this activity is for over 8s only.
"@

$p3 = @"
Hello Dr Green – I’m here to talk to you about my work placement.
Oh yes, it’s Holly, isn’t it?
Yes.
So, which work placement have you chosen?
I decided to go for the Orion Stadium placement. The event I’ll be managing is one where I’m helping to set up a sports competition for primary school children.
Yup. That’s always a popular placement – even though it can be tougher than you think, working with children.
I know, but it’s the fresh air that attracts me – organising something indoors doesn’t have the same appeal, even though it might be fun. It is outdoors and that's why I chose it.
OK, so obviously safety is going to be one of your key concerns for this event.
Yes, I’ve already thought about that. I’ll need to make sure none of the equipment’s damaged.
Ah, well, you’ll be working with schools, so the equipment will be their responsibility. However, the grounds and what goes on there will be yours.
That’ll include keeping everyone within the boundary once they’re on the field?
Exactly. Ensuring children stay in the stadium grounds and not losing anyone is what you must emphasise most.
Right. What about the spectators?
Well, they’re usually enthusiastic parents, but you can get the odd one who’s overly competitive. They can be hard to manage when tensions rise, so you'll need to keep a watchful eye.
OK. And presumably the schedule can be quite tight?
It is. But remember things rarely go to plan. In the past, an injury has caused delays and affected the schedule, so you need to be prepared to adapt.
Right. Now, can we look at the specific events management skills required for the placement?
Certainly. First is communication. What do you think is key there?
I think having a smart appearance is really important when greeting school staff and officials; it establishes respect immediately.
I agree. Now what about organisation?
You need clear lists, but above all, being flexible when unexpected changes occur.
Very true. With time management, pressure can mount quickly.
Yes, and I think hiding your emotions under stress is essential so you don't panic the children.
Absolutely. Then with creativity, it's not just big ideas, is it?
No, it's focusing on details and finding imaginative solutions to small practical problems.
And leadership?
You have to be confident and trust your own views when making quick decisions on the pitch.
Exactly. Finally, networking.
That's about building relationships and thinking of the future for career opportunities.
Excellent, Holly. You have a very clear plan.
"@

$p4 = @"
Welcome to today’s lecture on the history of ornithology, and in particular, early theories of bird migration.
Today we know that billions of birds travel vast distances between breeding and wintering grounds every year. But for many centuries, the seasonal disappearance of birds was one of nature’s greatest mysteries. In ancient times, people could not conceive that tiny birds could fly thousands of miles. Instead, early scholars came up with very different explanations. For example, it was widely believed that birds hibernated underwater or buried themselves in mud at the bottom of ponds and lakes until spring arrived.
Even eminent philosophers were misled. Aristotle believed birds changed from one species into another depending on the season. In autumn, he observed that redstarts experience the loss of feathers, and concluded that they physically transformed into European robins. This mistaken assumption seemed logical at the time because the two species of birds shared a remarkably similar shape and size.
Later centuries produced even more extraordinary theories. In the seventeenth century, a clergyman named Charles Morton popularised the idea that migrating birds flew all the way to the moon for the winter, taking sixty days to complete the journey!
Real understanding only began to develop in the nineteenth century through serendipitous physical discoveries. In 1822, a white stork was shot in Germany and found to have a wooden spear from Central Africa embedded in its neck. This famously provided the first undeniable physical evidence that European storks spent their winters in tropical Africa.
Before this discovery, virtually nothing was known about the actual destinations or flight paths of migrating birds. It had long been assumed that birds were far too frail to cross huge oceans without perching.
Modern scientific study began in 1899 when the Danish schoolteacher Christian Mortensen pioneered bird banding, or ringing. Attaching lightweight metal rings to birds' legs allowed researchers to track their movements, although early success depended entirely on the recovery of dead birds reported by the public. By 1931, enough data had been accumulated to publish the very first comprehensive atlas detailing the migration routes of European birds.
"@

Generate-Speech "c17_test3_part1" $p1
Generate-Speech "c17_test3_part2" $p2
Generate-Speech "c17_test3_part3" $p3
Generate-Speech "c17_test3_part4" $p4

Write-Host "All Cambridge 17 Listening Test 3 audio files generated successfully!"
