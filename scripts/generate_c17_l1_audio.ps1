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
Hello?
Oh hello. My name's Jan. Are you the right person to talk to about the Buckworth Conservation Group?
Yes, I'm Peter. I'm the secretary.
Good. I've just moved to this area and I'm interested in getting involved. I was in a similar group where I used to live. Could you tell me something about your activities, please?
Of course. Well, we have a mixture of regular activities and forthcoming events. One of the regular ones is trying to keep the beach free of litter. A few of us spend a couple of hours a month on it and it's awful how much there is to clear.
I wish people would be more responsible and take it home with them.
I totally agree.
I'd be happy to help with that. Is it OK to take dogs?
I'm afraid not, as they're banned from the beach itself. You can take them along the cliffs, though, and children are welcome.
Right.
We also manage a nature reserve and there's a lot to do there all year round. For example, because it's a popular place to visit, we spend a lot of time looking after the paths and making sure they're in good condition for walking.
I could certainly help with that.
Good. And we have a programme of creating new habitats there. We've just finished making and installing nesting boxes for birds to use and next we're going to work on encouraging insects. They're important for the biodiversity.
Right.
Then we're looking into ways of identifying different types of butterflies. We get quite a few species there. And we also need to build a new wall. Part of the old one collapsed during the winter storms.
Right. Are there any events coming up?
Yes. Next Saturday, we're organizing a walk. We'll meet at the Dunsmore Beach car park, then walk across the sands and reach the island. There's an old chapel there.
Oh, I've heard of that.
It should be nice. Bring a picnic with you, and make sure you wear appropriate boots, because the ground can be muddy.
OK. I've got some. And what about the woodwork session? I heard something about that.
Ah yes. That's on the 17th, from 10 a.m. to 3 p.m. It's designed for beginners, so you don't need any previous experience. You'll be learning how to make things like wooden spoons out of local wood.
Sounds fun. How much is it?
It's 35 pounds for the session, which includes all the materials and tools. You can camp overnight if you want, for an extra five pounds, but most people just go home.
Right. Well, I'd definitely like to sign up for that session.
"@

$p2 = @"
So, hello everyone. My name's Lou Miller and I'm going to be your tour guide today as we take this fantastic boat trip around the Tasmanian coast. Before we set off, I just want to tell you a few things about our journey.
Our boats aren't huge as you can see. We already have three staff members on board and on top of that, we can transport a further fifteen people – that's you – around the coastline. But please note if there are more than nine people on either side of the boat, we'll move some of you over, otherwise all eighteen of us will end up in the sea!
We've recently upgraded all our boats. They used to be jet black, but our new ones now have these comfortable dark red seats and a light-green exterior in order to stand out from others and help promote our company. This gives our boats a rather unique appearance, don't you think?
We offer you a free lunchbox during the trip and we have three types. Lunchbox 1 contains ham and tomato sandwiches. Lunchbox 2 contains a cheddar cheese roll and Lunchbox 3 is salad-based and also contains eggs and tuna. All three lunchboxes also have a packet of crisps and chocolate bar inside. Please let staff know which lunchbox you prefer.
I'm sure I don't have to ask you not to throw anything into the sea. We don't have any bins to put litter in, but Jess, myself or Ray, our other guide, will collect it from you after lunch and put it all in a large plastic sack.
The engine on the boat makes quite a lot of noise so before we head off, let me tell you a few things about what you're going to see.
This area is famous for its ancient lighthouse, which you'll see from the boat as we turn past the first little island. It was built in 1838 to protect sailors as a number of shipwrecks had led to significant loss of life. The construction itself was complicated as some of the original drawings kept by the local council show. It sits right on top of the cliffs in a very isolated spot. In the nineteenth century there were many jobs there, such as polishing the brass lamps, chopping firewood and cleaning windows, that kept lighthouse keepers busy. These workers were mainly prison convicts until the middle of that century when ordinary families willing to live in such circumstances took over.
Some of you have asked me what creatures we can expect to see. I know everyone loves the penguins, but they're very shy and, unfortunately, tend to hide from passing boats, but you might see birds in the distance, such as sea eagles, flying around the cliff edges where they nest. When we get to the rocky area inhabited by fur seals, we'll stop and watch them swimming around the coast. They're inquisitive creatures so don't be surprised if one pops up right in front of you. Their predators, orca whales, hunt along the coastline too, but spotting one of these is rare. Dolphins, on the other hand, can sometimes approach on their own or in groups as they ride the waves beside us.
Lastly, I want to mention the caves. Tasmania is famous for its caves and the ones we'll pass by are so amazing that people are lost for words when they see them. They can only be approached by sea, but if you feel that you want to see more than we're able to show you, then you can take a kayak into the area on another day and one of our staff will give you more information on that. What we'll do is to go through a narrow channel, past some incredible rock formations and our guide will explain what is inside the caves as we approach them.
"@

$p3 = @"
So, Tim, we have to do a short summary of our work experience on a farm.
Right. My farm was great, but arranging the work experience was hard. One problem was it was miles away and I don't drive. And also, I'd really wanted a placement for a month, but I could only get one for two weeks.
I was lucky, the farmer let me stay on the farm so I didn't have to travel. But finding the right sort of farm to apply to wasn't easy.
No, they don't seem to have websites, do they? I found mine through a friend of my mother's. But it wasn't easy.
No, making initial contact with suitable farms was tricky for both of us.
My farm was mostly livestock, especially sheep. I really enjoyed helping out with them. I was up most of one night helping a sheep deliver a lamb.
On your own?
No, the farmer was there and he told me what to do. It wasn't a straightforward birth, the sheep was having difficulty giving birth, but I managed. It was a great feeling to see the lamb stagger to its feet and start feeding almost straight away, and to know that it was okay. Then another time a lamb had broken its leg and they got the vet in to set it and he talked me through what he was doing. That was really useful.
Yes, my farm had sheep too. The farm was in a valley and they had a lowland breed called Suffolks, although the farmer said they'd had other breeds in the past.
So were they bred for their meat mostly?
Yes, they're quite big and solid, mainly reared for their meat.
My farm was up in the hills and they had a different breed of sheep. They were Cheviots.
Oh, I heard their wool's really sought after.
Yes, it's very hard-wearing and they use it for carpets.
Right.
I was interested in the amount of supplements they add to animals' feed – you know, to increase their growth rate. Have you read that article about the use of additives in chicken feed?
Yes. The farmer said those supplements shouldn't just be given routinely – these should only be given if specially needed, for instance if birds are showing signs of illness.
Exactly.
What about your work with dairy cows? Did you do much with them?
Yeah. I helped with milking and other jobs. One thing I realized is that a lot of the cows have names – I thought it was just a number, but they respond to their names.
Ah.
What about you? Did you work with dairy cows?
Yes, I did. Some cows had been treated with antibiotics, so their milk wasn't suitable for human consumption, and it had to be put in a separate container. But I got mixed up, and I poured some milk from the wrong cow in with the milk for humans, so the whole lot had to be thrown away. I made a terrible mistake when storing milk. The farmer wasn't too happy with me!
Oh dear. Well, did you talk to your farmer about what they expect from vets?
Yeah. He said vets are always happy to check animals, but they often arrive too late, and anyway, farmers often know more about certain health issues than the vet does.
Right. My farmer said much the same – that vets are good on general care, but some jobs could easily be done by the farmer rather than by a vet.
Exactly.
Anyway, we've got to look at these course modules and give some opinions.
Right. What about Medical terminology?
Well, I thought that would be hard, but I found it quite straightforward. I definitely found this easier than expected.
Me too. It was just memorising lots of words.
Then there's Diet and nutrition.
That had some stuff I wasn't expecting.
I know. I was really shocked at something I learned on this module about animal digestion.
Yeah. Then Animal disease.
That was pretty dense, wasn't it?
So much detail to absorb. We were both really surprised how little is known about some aspects of this.
I agree completely. And finally, Wildlife medication.
That was useful. It gave us a good idea of what to expect in the field. I may do some further study on this later on.
TIM: Yes, though I thought some of the case studies were a bit outdated.
Really? I thought they were fine.
"@

$p4 = @"
Labyrinths have existed for well over 4,000 years. Labyrinths and labyrinthine symbols have been found in regions as diverse as modern-day Turkey, Ireland, Greece, and India. There are various designs of labyrinth, but what they all have in common is a winding spiral path which leads to a central area. There is one starting point at the entrance, and the goal is to reach the central area. Finding your way through a labyrinth involves many twists and turns, but it's not possible to get lost, as there is only one single path.
In modern times, the word labyrinth has taken on a different meaning and is often used as a synonym for a maze. A maze is quite different as it is a kind of puzzle with an intricate network of paths. Mazes became fashionable in the 15th and 16th centuries in Europe, and can still be found in the gardens of great houses and palaces. The paths are usually surrounded by thick, high hedges so that it's not possible to see over them. Entering a maze usually involves getting lost a few times before using logic to work out the pattern and find your way to the centre and then out again. There are lots of dead ends and paths which lead you back to where you started. The word 'maze' is believed to come from a Scandinavian word for a state of confusion. This is where the word 'amazing' comes from.
Labyrinths, on the other hand, have a very different function. Although people now often refer to things they find complicated as labyrinths, this is not how they were seen in the past. The winding spiral of the labyrinth has been used for centuries as a metaphor for life's journey. It served as a spiritual reminder that there is purpose and meaning to our lives and helped to give people a sense of direction. Labyrinths are thought to encourage a feeling of calm and have been used as a meditation and prayer tool in many cultures over many centuries.
The earliest examples of the labyrinth spiral pattern have been found carved into stone, from Sardinia to Scandinavia, from Arizona to India to Africa. In Europe, these spiral carvings date from the late Bronze Age. The Native American Pima tribe wove baskets with a circular labyrinth design that depicted their own cosmology. In Ancient Greece, the labyrinth spiral was used on coins around four thousand years ago. Labyrinths made of mosaics were commonly found in bathhouses, villas and tombs throughout the Roman Empire.
In Northern Europe, there were actual physical labyrinths designed for walking on. These were cut into the turf or grass, usually in a circular pattern. Eleven examples of turf labyrinths survive today, including the largest one at Saffron Walden, England, which used to have a large tree in the middle of it.
More recently labyrinths have experienced something of a revival. Some believe that walking a labyrinth promotes healing and mindfulness, and there are those who believe in its emotional and physical benefits, which include slower breathing and a restored sense of balance and perspective. Walking labyrinths are now being built in wellness centres, spas, and even in prisons. In some hospitals, patients who can't walk can have a paper 'finger labyrinth' brought to their bed. The science behind the theory is a little sketchy, but there are dozens of small-scale studies which support claims about the benefits of labyrinths. For example, one study found that walking a labyrinth provided short-term calming, relaxation, and relief from anxiety for Alzheimer's patients.
"@

Generate-Speech "c17_test1_part1" $p1
Generate-Speech "c17_test1_part2" $p2
Generate-Speech "c17_test1_part3" $p3
Generate-Speech "c17_test1_part4" $p4

Write-Host "All Cambridge 17 Listening Test 1 audio files generated successfully!"
