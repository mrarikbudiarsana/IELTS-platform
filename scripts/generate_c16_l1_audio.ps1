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
Hello. Children's Engineering Workshops.
Oh hello. I wanted some information about the workshops in the school holidays.
Sure.
I have two daughters who are interested. The younger one's Lydia, she's four – do you take children as young as that?
Yes, our Tiny Engineers workshop is for four to five-year-olds.
What sorts of activities do they do?
All sorts. For example, they work together to design a special cover that goes round an egg, so that when it's inside they can drop it from a height and it doesn't break. Well, sometimes it does break but that's part of the fun!
Right. And Lydia loves building things. Is there any opportunity for her to do that?
Well, they have a competition to see who can make the highest tower. You'd be amazed how high they can go.
Right.
But they're learning all the time as well as having fun. For example, one thing they do is to design and build a car that's attached to a balloon, and the force of the air in that actually powers the car and makes it move along. They go really fast too.
OK, well, all this sounds perfect.
Now Carly, that's my older daughter, has just had her seventh birthday, so presumably she'd be in a different group?
Yes, she'd be in the Junior Engineers. That's for children from six to eight.
And do they do the same sorts of activities?
Some are the same, but a bit more advanced. So they work out how to build model vehicles, things like cars and trucks, but also how to construct animals using the same sorts of material and technique, and then they learn how they can program them and make them move.
So they learn a bit of coding?
They do. They pick it up really quickly. We're there to help if they need it, but they learn from one another too.
Right. And do they have competitions too?
Yes, with the Junior Engineers, it's to use recycled materials like card and wood to build a bridge, and the longest one gets a prize.
That sounds fun. I wouldn't mind doing that myself!
Then they have something a bit different, which is to think up an idea for a five-minute movie and then film it, using special animation software. You'd be amazed what they come up with.
And of course, that's something they can put on their phone and take home to show all their friends.
Exactly. And then they also build a robot in the shape of a human, and they decorate it and program it so that it can move its arms and legs.
Perfect. So, is it the same price as the Tiny Engineers?
It's just a bit more: 50 pounds for the five weeks.
And are the classes on a Monday, too?
They used to be, but we found it didn't give our staff enough time to clear up after the first workshop, so we moved them to Wednesdays. The classes are held in the morning from ten to eleven.
OK. That's better for me actually. And what about the location? Where exactly are the workshops held?
They're in building 10A – there's a big sign on the door, you can't miss it, and that's in Fradstone Industrial Estate.
Sorry?
Fradstone – that's F-R-A-D-S-T-O-N-E.
And that's in Grasford, isn't it?
Yes, up past the station.
And will I have any parking problems there?
No, there's always plenty available. So would you like to enrol Lydia and Carly now?
OK.
So can I have your full name.
"@

$p2 = @"
Good morning, everyone, and welcome to Stevenson's, one of the country's major manufacturers of metal goods. Thank you for choosing us for your two weeks of work experience. My name is Julia Simmons, and since the beginning of this year I've been the managing director.
Stevenson's is quite an old company. Like me, the founder, Ronald Stevenson, went into the steel industry when he left school – that was in 1923. He set up this company when he finished his apprenticeship, in 1926, although he actually started making plans two years earlier, in 1924. He was a very determined young man!
Stevenson's long-term plan was to manufacture components for the machine tools industry – although in fact that never came about – and for the automotive industry, that is, cars and lorries. However, there was a delay of five years before that happened, because shortly before the company went into production, Stevenson was given the opportunity to make goods for hospitals and other players in the healthcare industry, so that's what we did for the first five years.
Over the years, we've expanded the premises considerably – we were lucky that the site is big enough, so moving to a new location has never been necessary. However, the layout is far from ideal for modern machinery and production methods, so we intend to carry out major refurbishment of this site over the next five years.
I'd better give you some idea of what you'll be doing during your two weeks with us, so you know what to expect. Most mornings you'll have a presentation from one of the managers, to learn about their department, starting this morning with research and development. And you'll all spend some time in each department, observing what's going on and talking to people – as long as you don't stop them from doing their work altogether! In the past, a teacher from your school has come in at the end of each week to find out how the group were getting on, but your school isn't able to arrange that this year.
OK, now I'll briefly help you to orientate yourselves around the site. As you can see, we're in the reception area, which we try to make attractive and welcoming to visitors. There's a corridor running left from here, and if you go along that, the door facing you at the end is the entrance to the coffee room. This looks out onto the main road on one side, and some trees on the other, and that'll be where you meet each morning.
The factory is the very big room on the far side of the site. Next to it is the warehouse, which can be accessed by lorries going up the road to the turning area at the end. You can get to the warehouse by crossing to the far side of the courtyard, and then the door is on your right.
Somewhere you'll be keen to find is the staff canteen. This is right next to reception. I can confidently say that the food's very good, but the view isn't. The windows on one side look onto a corridor and courtyard, which aren't very attractive at all, and on the other onto the access road, which isn't much better.
You'll be using the meeting room quite often, and you'll find it by walking along the corridor to the left of the courtyard, and continuing along it to the end. The meeting room is the last one on the right, and I'm afraid there's no natural daylight in the room.
Then you'll need to know where some of the offices are. The human resources department is at the front of this building, so you head to the left along the corridor from reception, and it's the second room you come to. It looks out onto the main road.
And finally, the boardroom, where you'll be meeting sometimes. That has quite a pleasant view, as it looks out on to the trees. Go along the corridor past the courtyard, right to the end. The boardroom is on the left, next to the factory.
OK, now are there any questions before we continue.
"@

$p3 = @"
How are you getting on with your art project, Tom?
OK. Like, they gave us the theme of birds to base our project on, and I'm not really all that interested in wildlife. But I'm starting to get into it. I've pretty well finished the introductory stage.
So have I. When they gave us all those handouts with details of books and websites to look at, I was really put off, but the more I read, the more interested I got.
Me too. I found I could research so many different aspects of birds in art – colour, movement, texture. So I was looking forward to the Bird Park visit.
What a letdown! It poured with rain and we hardly saw a single bird. Much less use than the trip to the Natural History Museum.
Yeah, I liked all the stuff about evolution there. The workshop sessions with Dr Fletcher were good too, especially the brainstorming sessions.
I missed those because I was ill. I wish we could've seen the projects last year's students did.
Mm. I suppose they want us to do our own thing, not copy.
Have you drafted your proposal yet?
Yes, but I haven't handed it in. I need to amend some parts. I've realised the notes from my research are almost all just descriptions, I haven't actually evaluated anything. So I'll have to fix that.
Oh, I didn't know we had to do that. I'll have to look at that too. Did you do a timeline for the project?
Yes, and a mind map.
Yeah, so did I. I quite enjoyed that. But it was hard having to explain the basis for my decisions in my action plan.
What?
You know, give a rationale.
I didn't realise we had to do that. OK, I can add it now. And I've done the video diary presentation, and worked out what I want my outcome to be in the project.
Someone told me it's best not to be too precise about your actual outcome at this stage, so you have more scope to explore your ideas later on. So I'm going to go back to my proposal to make it a bit more vague.
Really? OK, I'll change that too then.
One part of the project I'm unsure about is where we choose some paintings of birds and say what they mean to us. Like, I chose a painting of a falcon by Landseer. I like it because the bird's standing there with its head turned to one side, but he seems to be staring straight at you. But I can't just say it's a bit scary, can I?
You could talk about the possible danger suggested by the bird's look.
Oh, OK.
There's a picture of a fish hawk by Audubon I like. It's swooping over the water with a fish in its talons, and with great black wings which take up most of the picture.
So you could discuss it in relation to predators and food chains?
Well actually I think I'll concentrate on the impression of rapid motion it gives.
Right.
Do you know that picture of a kingfisher by van Gogh – it's perching on a reed growing near a stream.
Yes it's got these beautiful blue and red and black shades.
Mm hm. I've actually chosen it because I saw a real kingfisher once when I was little, I was out walking with my grandfather, and I've never forgotten it.
So we can use a personal link?
Sure.
OK. There's a portrait called William Wells, I can't remember the artist but it's a middle-aged man who's just shot a bird. And his expression, and the way he's holding the bird in his hand suggests he's not sure about what he's done. To me it's about how ambiguous people are in the way they exploit the natural world.
Interesting. There's Gauguin's picture Vairumati. He did it in Tahiti. It's a woman with a white bird behind her that is eating a lizard, and what I'm interested in is what idea this bird refers to. Apparently, it's a reference to the never-ending cycle of existence.
Wow. I chose a portrait of a little boy, Giovanni de Medici. He's holding a tiny bird in one fist. I like the way he's holding it carefully so he doesn't hurt it.
Ah right.
"@

$p4 = @"
Ancient philosophy is not just about talking or lecturing, or even reading long, dense books. In fact, it is something people have used throughout history – to solve their problems and to achieve their greatest triumphs.
Specifically, I am referring to Stoicism, which, in my opinion, is the most practical of all philosophies and therefore the most appealing. Stoicism was founded in Ancient Greece by Zeno of Citium in the early 3rd century BC, but was practised by the likes of Epictetus, Cato, Seneca and Marcus Aurelius. Amazingly, we still have access to these ideas, despite the fact that the most famous Stoics never wrote anything down for publication. Cato definitely didn't. Marcus Aurelius never intended his Meditations to be anything but personal. Seneca's letters were, well, letters and Epictetus' thoughts come to us by way of a note-taking student.
Stoic principles were based on the idea that its followers could have an unshakable happiness in this life and the key to achieving this was virtue. The road to virtue, in turn, lay in understanding that destructive emotions, like anger and jealousy, are under our conscious control – they don't have to control us, because we can learn to control them. In the words of Epictetus: external events I cannot control, but the choices I make with regard to them, I do control.
The modern day philosopher and writer Nassim Nicholas Taleb defines a Stoic as someone who has a different perspective on experiences which most of us would see as wholly negative; a Stoic transforms fear into caution, pain into transformation, mistakes into initiation and desire into undertaking. Using this definition as a model, we can see that throughout the centuries Stoicism has been practised in more recent history by kings, presidents, artists, writers and entrepreneurs.
The founding fathers of the United States were inspired by the philosophy. George Washington was introduced to Stoicism by his neighbours at age seventeen, and later, put on a play based on the life of Cato to inspire his men. Thomas Jefferson kept a copy of Seneca beside his bed.
Writers and artists have also been inspired by the stoics. Eugène Delacroix, the renowned French Romantic artist, known best for his painting Liberty Leading the People, was an ardent Stoic, referring to it as his consoling religion.
The economist Adam Smith's theories on capitalism were significantly influenced by the Stoicism that he studied as a schoolboy, under a teacher who had translated Marcus Aurelius' works.
Today's political leaders are no different, with many finding their inspiration from the ancient texts. Former US president Bill Clinton rereads Marcus Aurelius every single year, and many have compared former President Obama's calm leadership style to that of Cato. Wen Jiabao, the former prime minister of China, claims that Meditations is one of two books he travels with and that he has read it more than one hundred times over the course of his life.
Stoicism had a profound influence on Albert Ellis, who invented Cognitive Behaviour Therapy, which is used to help people manage their problems by changing the way that they think and behave. It's most commonly used to treat depression. The idea is that we can take control of our lives by challenging the irrational beliefs that create our faulty thinking, symptoms and behaviours by using logic instead.
Stoicism has also become popular in the world of business. Stoic principles can build the resilience and state of mind required to overcome setbacks because Stoics teach turning obstacles into opportunity. A lesson every business entrepreneur needs to learn.
I would argue that studying Stoicism is as relevant today as it was 2,000 years ago, thanks to its brilliant insights into how to lead a good life. At the very root of the thinking, there is a very simple way of living – control what you can and accept what you can't. This is not as easy as it sounds and will require considerable practice – it can take a lifetime to master. The Stoics also believed the most important foundation for a good and happy life is not money, fame, power or pleasure, but having a disciplined and principled character – something which seems to resonate with many people today.
"@

Generate-Speech "c16_test1_part1" $p1
Generate-Speech "c16_test1_part2" $p2
Generate-Speech "c16_test1_part3" $p3
Generate-Speech "c16_test1_part4" $p4

Write-Host "All Cambridge 16 Listening Test 1 audio files generated successfully!"
