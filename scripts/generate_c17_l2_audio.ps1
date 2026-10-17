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
Hello, Jane Fairbanks speaking.
Oh, good morning. My name’s Frank Pritchard. I’ve just retired and moved to Southoe. I’d like to become a volunteer, and I gather you co-ordinate voluntary work in the village.
That’s right.
What sort of thing could I do?
Well, we need help with the village library. We borrow books from the town library, and individuals also donate them. So, one thing you could do is get involved in collecting them – if you’ve got a car, that is.
Yes, that’s no problem.
The times are pretty flexible so we can arrange it to suit you. Another thing is the records that we keep of the books we’re given, and those we borrow and need to return to the town library. It would be very useful to have another person to help keep them up to date.
Right. I’m used to working on a computer – I presume they’re computerised?
Oh yes.
Is the library purpose-built? I haven’t noticed it when I’ve walked round the village.
No, we simply have the use of a room in the village hall, the West Room. It’s on the left as you go in.
I must go and have a look inside the hall.
Yes, it’s a nice building.
Do you run a lunch club in the village for elderly people? I know a lot of places do.
Yes, we have a very successful club.
I could help with transport, if that’s of any use.
Ooo definitely. People come to the club from neighbouring villages, and we’re always in need of more drivers.
And does the club have groups that focus on a particular hobby, too? I could get involved in one or two, particularly if there are any art groups.
Excellent. I’ll find out where we need help and get back to you.
What about other individual help? Are there any other people needing assistance?
Yes, we do have a few requests for next week. For instance, taking Mrs Carroll to the hospital.
Fine. I can manage that. And what else?
Well, there’s some work in the garden at Mr Selsbury’s house. He’s finding it hard to look after things himself now.
Okay. I’ve got plenty of energy, so that should be fine.
Now, apart from those, we always need support with village social events. We’ve got three coming up.
Right.
On the 19th of October, there’s a quiz in the village hall, and we need people to help provide refreshments.
I can certainly help with that.
Then on the 18th of November, we’re holding a dance—also in the village hall. We’ll need people for checking tickets on the door.
I’m happy to do that.
And the big one is the New Year’s Eve party on the 31st of December at the Mountfort Hotel. It isn’t in Southoe itself, but it’s only a couple of miles away. The hotel will be providing dinner and we’ve booked a band. The one thing we haven’t got yet is a poster. That isn’t something you could do, by any chance, is it?
Well actually, yes. Before I retired I was a graphic designer, so that’s right up my street.
Oh perfect! I’ll put you down for that then.
"@

$p2 = @"
Good morning, everyone, and welcome to Oniton Hall. I'm pleased to see so many of you here today.
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
And finally, the surrounding parkland. As you walk through these open fields, you'll have the chance of seeing rare breeds of animals, including ancient varieties of cattle and sheep that have grazed here for generations.
"@

$p3 = @"
Did you make notes while you were watching the performances of Romeo and Juliet, Gemma?
Yes, I did. I found it quite hard though. I kept getting too involved in the play.
Me too. I ended up not taking notes during the show, but I wrote down my impressions when I got home. When we write our review, we should definitely include a personal reaction, explaining how the performance affected us emotionally.
I agree. And we should also include a reference to particular scenes, like the balcony scene and the duel in the square, to illustrate our main points.
Definitely. That will give our review substance.

So, what about The Emporium Theatre’s production of the play?
I thought some things worked really well, but there were some problems too.
Yeah. What about the set, for example?
I think it was visually really stunning. I’d say that was probably the most memorable thing about this production.
You’re right. We both agree that the set design was a major strength. But what about the lighting?
Some of the scenes were so dimly lit it was quite hard to see.
But I didn’t dislike it. It helped to change the mood of the quieter scenes and created the right atmosphere.
That’s a good point, it certainly set the mood. What did you think of the costume design?
I was a bit surprised by the contemporary dress, I must say.
Yeah, I think it worked well, but I had assumed it would be more conventional and traditional.
Me too, we both expected traditional costumes. Now, regarding the music, I liked the music at the beginning, but it didn’t have much impact in Acts 2 and 3.
Yes, that was a shame. We were both disappointed by the music overall.
And one problem with this production was the actors' delivery. They were speaking too fast, which made it hard to follow.
Well, I agree their delivery was an issue, but I thought it was because they weren’t speaking loudly enough, especially at key points.
So we disagree about why their delivery was a problem!

Moving on, do you think the story of Romeo and Juliet is still relevant for young people today?
Definitely. It deals with problems that families experience, like generational friction and misunderstandings between parents and children.
I agree. That family conflict is timeless.
How did you find watching it in another language when we saw the foreign language version?
Really interesting. I expected to find it challenging, but the actors' physical expressions made it so moving.
I felt the same. The emotion was incredibly powerful.
And why do you think Shakespeare’s plays have such enduring international appeal?
I think it's because they can be interpreted in many ways. Directors can adapt them to almost any era or culture and the themes still resonate.
Absolutely. That openness to interpretation is key.
"@

$p4 = @"
Welcome to today’s lecture on language change and endangered languages. Today, I want to examine the impact of digital technology on the Icelandic language.
Icelandic is spoken by around 321,000 people, most of whom live in Iceland, an island country in the North Atlantic Ocean. The challenge facing this language is not simply the number of speakers, nor is it that words are being replaced wholesale by English. In fact, the vocabulary of Icelandic is continually expanding, as Icelanders have a long tradition of inventing native terms for new concepts rather than borrowing foreign words. Icelandic has changed remarkably little over the past thousand years, and linguists have even created native terms for modern computer concepts, such as web browser and podcast.
However, younger speakers today live in an increasingly digital world. Young people are heavy users of digital technology, particularly smartphones. Because so much online content, games, and entertainment are in English, children in Iceland are becoming bilingual at an extraordinarily early age. This immersion is having visible effects. For instance, teachers have noted that conversations in the school playground are often conducted entirely in English, while in primary schools, young pupils find it easier to identify the object in a picture using English rather than Icelandic.
Meanwhile, technology and internet companies provide very little digital content or voice recognition software in Icelandic. This is partly due to the small commercial market, but also because Icelandic grammar is exceptionally complex and inflected, making natural language processing difficult.
In response, the Icelandic government has established a national language technology fund to subsidise the creation of digital tools in Icelandic. While official policy remains optimistic about the future of the language, policymakers are concerned that young Icelanders may gradually lose their unique cultural identity. Furthermore, educators worry about the educational consequences if children fail to become fully fluent in either Icelandic or English.
"@

Generate-Speech "c17_test2_part1" $p1
Generate-Speech "c17_test2_part2" $p2
Generate-Speech "c17_test2_part3" $p3
Generate-Speech "c17_test2_part4" $p4

Write-Host "All Cambridge 17 Listening Test 2 audio files generated successfully!"
