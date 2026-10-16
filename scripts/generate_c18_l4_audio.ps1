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
Hello and welcome to Cambridge IELTS 18 Academic Listening Test 4, Part 1.
You will hear a telephone conversation between Greg Preston from an employment agency and Julie Davison about a job vacancy.
First you have some time to look at questions 1 to 5.

Hello?
Oh, hello. Is that Julie Davison?
Yes.
This is Greg Preston from the Employment Agency. We met last week when you came in to enquire about office work.
Oh, that's right.
Now we've just had some details come in of a job which might interest you.
OK.
So this is a position for a receptionist – I believe you've done that sort of work before?
Yes, I have, I worked in a sports centre for a couple of years before I got married and had the children.
Right. Well, this job's in Fordham, so not too far away for you, and it's at the medical centre there.
OK. So where exactly is that?
It's quite near the station, on Chastons Road.
Sorry?
Chastons Road - that's C-H-A-S-T-O-N-S.
OK, thanks. So what would the work involve? Dealing with enquiries from patients?
Yes, and you'd also be involved in making appointments, whether face to face or on the phone. And rescheduling them if necessary.
Fine, that shouldn't be a problem.
And another of your duties would be keeping the centre's database up-to-date. Then you might have other general administrative duties as well, but those would be the main ones.
OK.

Now you have some time to look at questions 6 to 10.

Now when the details came in, I immediately thought of you because one thing they do require is someone with experience, and you did mention your work at the sports centre when you came in to see us.
Yes, in fact I enjoyed that job. Is there anything else they're looking for?
Well, they say it's quite a high-pressure environment, they're always very busy, and patients are often under stress, so they want someone who can cope with that and stay calm, and at the same time be confident when interacting with the public.
Well, after dealing with three children all under five, I reckon I can cope with that.
I'm sure you can. And then another thing they mention is that they're looking for someone with good IT skills...
Not a problem.
So you'd be interested in following this up?
Sure. When would it start?
Well, they're looking for someone from the beginning of next month, but I should tell you that this isn't a permanent job, it's temporary, so the contract would be just to the end of September. But they do say that there could be further opportunities after that.
OK. And what would the hours be?
Well, they want someone who can start at a quarter to eight in the morning - could you manage that?
Yes, my husband would have to get the kids up and off to my mother's - she's going to be looking after them while I'm at work. What time would I finish?
One fifteen.
That should work out all right. I can pick the kids up on my way home, and then I'll have the afternoon with them. Oh, one thing ... is there parking available for staff at the centre?
Yes, there is, and it's also on a bus route.
Right. Well, I expect I'll have the car but it's good to know that. OK, so where do I go from here?
Well, if you're happy for me to do so, I'll forward your CV and references, and then the best thing would probably be for you to phone them so they can arrange for an interview.
Great. Well thank you very much.
You're welcome. Bye now.
Bye.

That is the end of Part 1. You now have half a minute to check your answers.
"@

$p2 = @"
Part 2. You will hear a museum guide giving a talk to new visitors at the Museum of Farming Life.
First you have some time to look at questions 11 to 14.

Good morning everyone, and welcome to the Museum of Farming Life. I understand it's your first visit here, so I'd like to give you some background information about the museum and then explain a little about what you can see during your visit.
So, where we're standing at the moment is the entrance to a large building that was constructed in 1880 as the home of a local businessman, Alfred Palmer, of the Palmer biscuit factory. It was later sold and became a hall of residence for students in 1911, and a museum in 1951. In 2005, a modern extension was built to accommodate the museum's collections.
The museum's owned by the university, and apart from two rooms that are our offices, the university uses the main part of the building. You may see students going into the building for lessons, but it's not open to museum visitors, I'm afraid. It's a shame because the interior architectural features are outstanding, especially the room that used to be the library.
Luckily, we've managed to keep entry to the museum free. This includes access to all the galleries, outdoor areas and the rooms for special exhibitions. We run activities for children and students, such as the museum club, for which there's no charge. We do have a donation box just over there so feel free to give whatever amount you consider appropriate.
We do have a cloakroom, if you'd like to leave your coats and bags somewhere. Unlike other museums, photography is allowed here, so you might like to keep your cameras with you. You might be more comfortable not carrying around heavy rucksacks, though keep your coats and jackets on as it's quite cold in the museum garden today.

Now look at questions 15 to 20.

I'd like to tell you about the different areas of the museum. Just inside, and outside the main gallery, we have an area called Four Seasons. Here you can watch a four-minute animation of a woodland scene. It was designed especially for the museum by a group of young people on a film studies course, and it's beautiful. Children absolutely love it, but then, so do adults.
The main gallery's called Town and Country. It includes a photographic collection of prize-winning sheep and shepherds. Leaving Town and Country, you enter Farmhouse Kitchen, which is ... well, self-explanatory. Here we have the oldest collection of equipment for making butter and cheese in the country. And this morning, a specialist cheesemaker will be giving demonstrations of how it's produced. You may even get to try some.
After that, you can go in two directions. To the right is a staircase that takes you up to a landing from where you can look down on the galleries. To the left is a room called A Year on the Farm. There's lots of seating here as sometimes we use the room for school visits, so it's a good place to stop for a rest. If you're feeling competitive, you can take our memory test in which you answer questions about things you've seen in the museum.
The next area's called Wagon Walk. This contains farm carts from nearly every part of the country. It's surprising how much regional variation there was. Beside the carts are display boards with information about each one. The carts are old and fragile, so we ask you to keep your children close to you and ensure they don't climb on the carts.
From Wagon Walk, you can either make your way back to reception or go out into the garden - or even go back to take another look in the galleries. In the far corner of the garden is Bees are Magic, but we're redeveloping this area so you can't visit that at the moment. You can still buy our honey in the shop, though.
Finally, there's The Pond, which contains all kinds of interesting wildlife. There are baby ducks that are only a few days old, as well as tiny frogs. The Pond isn't deep and there's a fence around it, so it's perfectly safe for children.

That is the end of Part 2. You now have half a minute to check your answers.
"@

$p3 = @"
Part 3. You will hear two teacher training students, Seb and Lia, discussing a video of children doing origami with their tutor.
First you have some time to look at questions 21 to 27.

So now I want you to discuss the lesson we've just been watching on the video and think about the ways in which origami can be a useful educational tool. Can you all work with the person sitting next to you...
I had no idea that such a simple thing like folding squares of paper to make the shape of something like a bird could be such an amazing tool. It's made me see origami in a whole new light.
I know. It was interesting to see the educational skills the children were developing by doing origami.
On the video you could see them really listening hard to make sure they did all the steps in the right order to make the bird.
That's right. In this lesson they were working individually but it would also be interesting to see if the children could work out how to make something simple without being given any direction. That would help with building teamwork as well.
Yes, but much more of a challenge. One thing that really stood out for me was that the children were all having fun while being taught something new. Which is a key aim of any lesson with this age group. And although these kids had no problems with folding the paper, with younger children you could do origami to help practise fine motor skills.
Absolutely. Shall we talk about the individual children we saw on the video? I wrote all their names down and took some notes.
Yes, I did too.
OK, good. Let's start with Sid.
He was interesting because before they started doing the origami, he was being quite disruptive.
Yes. He really benefited from having to use his hands - it helped him to settle down and start concentrating.
Yes, I noticed that too. What about Jack? I noticed he seemed to want to work things out for himself.
Mmm. You could see him trying out different things rather than asking the teacher for help.
What did you make of Naomi?
She seemed to be losing interest at one point but then she decided she wanted her mouse to be the best and that motivated her to try harder. She didn't seem satisfied with hers in the end, though.
No.
Anya was such a star. She listened so carefully and then produced the perfect bird with very little effort.
Mmm - I think the teacher could have increased the level of difficulty for her.
Maybe. I think it was the first time Zara had come across origami. She looked as if she didn't really get what was going on.
She seemed unsure about what she was supposed to do, but in the end hers didn't turn out too badly.
Yeah. I'm sure it was a positive learning experience for her.
Mmm.

Now look at questions 28 to 30.

I think one reason why the origami activity worked so well in this class was that the teacher was well prepared.
Right. I think it would have taken me ages to prepare examples, showing each of the steps involved in making the bird. But that was a really good idea. The children could see what they were aiming for - and much better for them to be able to hold something, rather than just looking at pictures.
Mmm - those physical examples supported her verbal explanations really well.
It's strange that origami isn't used more widely. Why do you think that is?
Well, teachers may just feel it's not that appealing to children who are used to doing everything on computers, especially boys. Even if they're aware of the benefits.
Oh, I don't know. It's no different to any other craft activity. I bet it's because so many teachers are clumsy like me.
That's true – too much effort required if you're not good with your hands.
Well, anyway, I think we should try it out in our maths teaching practice with Year 3. I can see using origami is a really engaging way of reinforcing children's knowledge of geometric shapes, like they were doing in the video, but I think it would also work really well for presenting fractions, which is coming up soon.
Good idea - that's something most of the kids in that class might struggle with. Origami would also be good practice for using symmetry - but I think they did that last term.
OK - well let's try and get some ideas together and plan the lesson next week.
OK, if you could all stop...

That is the end of Part 3. You now have half a minute to check your answers.
"@

$p4 = @"
Part 4. You will hear a presentation about the French writer Victor Hugo and his house on Guernsey.
First you have some time to look at questions 31 to 40.

The person I've chosen to talk about is the French writer Victor Hugo - many people have heard of him because his novel, Les Misérables, which he wrote in 1862, is famous around the world. It became a stage musical in the 1980s, and a film version was also released in 2012. So, some of us, I'm sure, have a pretty general idea of the plot, but we know much less about the author. Today, I'm going to provide a little more insight into this talented man and I'm going to talk particularly about the home he had on the island of Guernsey in the British Channel Islands.
But first, his early career... as I've said, he was a writer, he was at the height of his career in Paris and he was very highly regarded by his colleagues. As far as literature was concerned, he was the leading figure of the Romantic movement. However, as well as being a literary genius, he also gave many speeches about issues like the level of poverty in his society. He felt very strongly about this and about other areas where change was needed, like education. This kind of outspoken criticism was not well liked by the rulers of France and, eventually, the emperor - Napoleon the third – told Victor Hugo to leave Paris and not return; in other words, he sent him into exile.
So Victor Hugo was forced to reside in other parts of Europe. Guernsey was actually his third place of exile and he landed there in 1855. He produced a lot while on Guernsey - including Les Misérables – and to do this, he had to spend a great deal of time in the home that he had there. This was a property that he bought using the money he'd made in France from the publication of a collection of his poetry. It was the only property he ever owned, and he was very proud of it.
The property Victor Hugo bought on Guernsey was a large, five-storey house in the capital town of St Peter Port and he lived there for 15 years, returning to France in 1870 when Napoleon's Empire collapsed. He decorated and furnished each level, or floor, of the house in unique and wonderful ways, and many people consider the inside of the house to be a 'work of art'. Today it's a museum that attracts 200,000 visitors a year.
He lived in the house with his family... and portraits of its members still hang in rooms on the ground floor, along with drawings that he did during his travels that he felt were important to him. In other ground-floor rooms, there are huge tapestries that he would have designed and loved. The walls are covered in dark wood panelling that Victor Hugo created himself using wooden furniture that he bought in the market. The items were relatively inexpensive, and he used them to create intricate carvings. They gave an atmosphere on the lower level that was shadowy and rather solemn.
On the next level of the house there are two impressive lounges, where he entertained his guests. One lounge has entirely red furnishings, such as sofas and wall coverings, and the other blue. There's a strong Chinese influence in these areas in things like the wallpaper pattern and the lamps - which he would have made himself by copying original versions. His library, where he left many of his favourite books, forms the hallway to the third floor and was a comfortable area where he could relax and enjoy his afternoons.
And then, at the very top of the house, there's a room called the Lookout – called that because it looks out over the harbour. In contrast to the rather dark lower levels, it's full of light and was like a glass office where he would write until lunchtime - often at his desk.
So, Victor Hugo was a man of many talents, but he was also true to his values. While living in his house on Guernsey, he entertained many other famous writers, but he also invited a large group of local children from the deprived areas of the island to dinner once a week. What's more, he served them their food, which was an extraordinary gesture for the time period.
In 1927, the house was owned by his relatives, and they decided to donate it to the city of Paris. It has since been restored using photographs from the period and, as I mentioned earlier, is now a museum that is open to the public.

That is the end of Part 4. You now have one minute to check your answers to all parts.
"@

Write-Host "Starting audio generation for Cambridge 18 Listening Test 4..."
Generate-Speech "c18_test4_part1" $p1
Generate-Speech "c18_test4_part2" $p2
Generate-Speech "c18_test4_part3" $p3
Generate-Speech "c18_test4_part4" $p4
Write-Host "All audio files for Cambridge 18 Listening Test 4 successfully generated!"
