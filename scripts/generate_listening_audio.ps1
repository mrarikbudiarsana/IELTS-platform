# PowerShell script to synthesize real spoken audio files for IELTS Listening Demonstration Tests
$audioDir = Join-Path $PSScriptRoot "..\public\audio"
if (-not (Test-Path $audioDir)) {
    New-Item -ItemType Directory -Path $audioDir -Force | Out-Null
}

$clientAudioDir = Join-Path $PSScriptRoot "..\client\public\audio"
if (-not (Test-Path $clientAudioDir)) {
    New-Item -ItemType Directory -Path $clientAudioDir -Force | Out-Null
}

Add-Type -AssemblyName System.Speech

function Generate-SpeechWav($filename, $text) {
    $outPath = Join-Path $audioDir $filename
    $synth = New-Object System.Speech.Synthesis.SpeechSynthesizer
    $synth.Rate = 0  # Standard natural speaking rate
    $synth.SetOutputToWaveFile($outPath)
    $synth.Speak($text)
    $synth.Dispose()
    
    # Also copy to client public folder
    $clientPath = Join-Path $clientAudioDir $filename
    Copy-Item $outPath $clientPath -Force
    Write-Host "Generated audio: $filename ($( (Get-Item $outPath).Length ) bytes)"
}

# Part 1: Form & Table (Car Hire Reservation)
$part1Text = "Good morning, Crestview Car and Caravan Hire. How may I help you? " +
"Hello, I would like to arrange vehicle hire for a small family holiday starting on 14th October. " +
"Certainly, could I take your full surname, please? " +
"Yes, it is Campbell, that is C-A-M-P-B-E-L-L. " +
"And your contact telephone number? " +
"It is 0418 923 774. " +
"Thank you. Now, what type of vehicle are you looking for? " +
"We need a small model, perhaps an automatic transmission. " +
"Understood. For the driver's license number, please? " +
"It is DL-58832. " +
"Perfect. For our vehicle options, the Compact Cruiser costs 65 dollars per day with a minimum deposit of 150 dollars. " +
"It includes unlimited mileage and complimentary baby seat hire. " +
"For extra luggage, we can attach an external roof box for 15 dollars extra. " +
"All vehicles must be returned with a full fuel tank."

Generate-SpeechWav "listening_part1_car_rental.wav" $part1Text

# Part 2: Park Tour & Map Labelling
$part2Text = "Welcome to the Riverside Heritage and Wildlife Sanctuary. Before you begin your walk, " +
"let me orient you to our main facilities using the map. " +
"You are currently standing at the Main Entrance at the bottom of the map. " +
"Directly to your right, across from the ticket kiosk, location A is the Wildlife Information Centre. " +
"If you follow the main paved path northward toward the lake, on the western bank at location C is the Bird Hide. " +
"Continuing past the footbridge along the eastern boundary, location E is the Woodland Picnic Meadow, featuring covered benches and recycling bins. " +
"Just north of the picnic area, tucked behind the old watermill at location G, you will discover the Children's Nature Playground. " +
"Regarding opening hours, our sanctuary closes at 18:30 on weekdays and 19:00 on weekends. " +
"Guided birdwatching walks depart from the café terrace every Saturday morning at 10:00 AM. " +
"Visitors are kindly reminded that dogs must be kept on a lead at all times, and cycling is permitted only on designated tarmac paths."

Generate-SpeechWav "listening_part2_park_tour.wav" $part2Text

# Part 3: University Tutorial & Fieldwork Flowchart
$part3Text = "Hello Michael and Sarah, thanks for coming in to discuss your field research proposal on coastal tidal energy. " +
"Have you finalized your data collection methodology? " +
"Yes, Dr. Higgins. Initially, we planned to conduct postal surveys, but Sarah suggested that face-to-face structured interviews " +
"would yield a significantly higher completion rate and allow us to clarify technical jargon. " +
"Michael felt that analyzing local newspaper archives would show historical flood frequency, while I was more keen on satellite imagery. " +
"Regarding our tidal flow measurements, we have established a five-step procedure. " +
"Step one is to calibrate the acoustic water-flow meter in the laboratory tank. " +
"Step two involves deploying submersible sensors at selected estuary coordinates. " +
"In step three, we will log tidal velocities at twelve-hour intervals across high and low tides. " +
"Step four requires filtering anomalous wave spikes from the raw digital log. " +
"Finally, in step five, we will calculate net turbine power output using our hydrodynamic simulation software."

Generate-SpeechWav "listening_part3_student_project.wav" $part3Text

# Part 4: Environmental Engineering Lecture (Geothermal Systems)
$part4Text = "In today's lecture on low-carbon municipal heating, we will examine closed-loop horizontal ground-source heat pump installations. " +
"Unlike traditional fossil gas boilers which generate heat through combustion, geothermal heat pumps transfer latent thermal energy " +
"from subterranean strata into domestic hydronic circuits. " +
"A critical engineering parameter is the loop depth. Pipes buried less than 1.5 meters underground are vulnerable to seasonal frost penetration, " +
"which drastically diminishes thermal exchange efficiency. " +
"The circulating heat transfer fluid consists of water mixed with non-toxic propylene glycol, preventing freezing while safeguarding local groundwater aquifers. " +
"To optimize heat transfer, contractors embed the coiled polyethylene tubing in bentonite clay backfill rather than loose gravel. " +
"Over a twenty-year operational lifespan, municipal retrofit programs in Scandinavia achieved an average reduction in residential carbon emissions of 64 percent. " +
"The primary financial obstacle remains the upfront installation cost, though lifecycle operating expenses are approximately 40 percent lower than electric resistance heating."

Generate-SpeechWav "listening_part4_geothermal_lecture.wav" $part4Text

# Practice Set Audio (Part 1 Targeted Practice)
Generate-SpeechWav "listening_practice_part1.wav" $part1Text

Write-Host "All IELTS Listening demonstration audio recordings successfully generated!"
