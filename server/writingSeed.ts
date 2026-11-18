import { db } from './db';
import { createWritingTask, publishWritingTask, getWritingTaskById } from './writingService';
import { WritingTask } from '../shared/types';

export function seedWritingData() {
  // Kept as no-op during automated test suite initialization so performanceProfiles.ts
  // can assert exact 10-task benchmark counts. Use seedOfficialWritingTasks() to import
  // Official IELTS & IELTS Advantage tasks on demand.
}

export const OFFICIAL_AND_ADVANTAGE_WRITING_TASKS = [
  {
    title: 'Official IELTS Academic Task 1A: Men and Women in Further Education in Britain',
    taskType: 'academic_task_1' as const,
    taskNumber: 1 as const,
    testType: 'academic' as const,
    subtype: 'chart' as const,
    prompt:
      'The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: ['/diagrams/writing_task1a_further_education.svg'],
    structuredData: {
      unit: 'Thousands of students',
      years: ['1970/71', '1980/81', '1990/91'],
      sectors: {
        'Male - Part-time education': [1000, 850, 900],
        'Male - Full-time education': [100, 150, 250],
        'Female - Part-time education': [750, 820, 1100],
        'Female - Full-time education': [60, 220, 250],
      },
    },
    teacherVisualDescription:
      'Bar chart showing Men and Women in further education in Britain (in thousands) in 1970/71, 1980/81, and 1990/91, split into Full-time and Part-time education. Part-time figures are much higher than full-time for both genders in all periods. Male part-time started at 1,000k in 1970/71, dipped to ~850k in 1980/81, and rose to ~900k in 1990/91. Male full-time rose steadily from ~100k to ~150k to ~250k. Female part-time rose steadily from ~750k (1970/71) to ~820k (1980/81) and ~1,100k (1990/91), overtaking male part-time by 1990/91. Female full-time rose from ~60k to ~220k to ~250k (matching male full-time in 1990/91).',
    teacherAssessmentGuidance:
      'Official IELTS Task 1A: Candidate must cite specific figures from the chart (otherwise TA is capped at Band 5 per Official Sample 1A Script A). Must highlight that part-time study far exceeded full-time study for both sexes, and that female participation grew across both modes to surpass or equal males by 1990/91.',
    modelResponse: `The bar chart illustrates the number of male and female students enrolled in full-time and part-time further education in Britain across three academic periods: 1970/71, 1980/81, and 1990/91.

Overall, part-time education was significantly more popular than full-time study for both men and women throughout the twenty-year period. Furthermore, while men initially outnumbered women in both categories, female enrolment grew substantially, eventually surpassing men in part-time education and equalling them in full-time study.

In 1970/71, exactly 1,000,000 men were enrolled in part-time courses, representing the highest figure for that period. However, this number declined to approximately 850,000 in 1980/81 before recovering slightly to around 900,000 by 1990/91. By contrast, female part-time enrolment rose consistently from roughly 750,000 in 1970/71 to 820,000 a decade later, before surging to 1,100,000 in 1990/91.

Full-time enrolment figures were considerably lower but showed steady upward trends for both genders. The number of full-time male students more than doubled from around 100,000 in 1970/71 to approximately 250,000 in 1990/91. Similarly, full-time female students started at just under 100,000 in 1970/71, rose sharply to over 200,000 in 1980/81, and reached roughly 250,000 in 1990/91, matching the figure for men.`,
  },
  {
    title: 'Official IELTS Academic Task 1B: Radio and Television Audiences in the UK (1992)',
    taskType: 'academic_task_1' as const,
    taskNumber: 1 as const,
    testType: 'academic' as const,
    subtype: 'chart' as const,
    prompt:
      'The graph below shows radio and television audiences throughout the day in 1992.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: ['/diagrams/writing_task1b_radio_tv_audiences.svg'],
    structuredData: {
      unit: '% of UK population (over 4 years old)',
      years: ['6:00 AM', '8:00 AM', '12:00 Noon', '2:00 PM', '8:00 PM', '12:00 Midnight', '4:00 AM'],
      sectors: {
        'Radio audience (%)': [7, 27, 17, 15, 8, 5, 2],
        'Television audience (%)': [1, 7, 4, 15, 45, 15, 2],
      },
    },
    teacherVisualDescription:
      'Line graph: Radio and television audiences in the UK, October-December 1992 (% of population over 4 years old across 24 hours). Radio peaks in the morning at ~27% around 8:00 AM, then declines gradually throughout the day and night. Television stays low in the morning (<10%), rises to ~15% at 2:00 PM (where it intersects radio), surges in the evening to peak at ~45% around 8:00 PM, and drops sharply after 10:00 PM.',
    teacherAssessmentGuidance:
      'Official IELTS Task 1B: Candidate must include a clear overview contrasting the morning peak for radio with the evening peak for television (missing this overview caps TA at Band 6 per Official Sample 1B Script A).',
    modelResponse: `The line graph compares the proportion of the UK population aged over four who listened to the radio or watched television throughout a 24-hour period between October and December 1992.

Overall, radio attracted its largest audience in the morning, whereas television viewing peaked in the evening. Additionally, television achieved a significantly higher maximum audience share than radio over the course of the day.

At 6:00 am, approximately 7% of the population listened to the radio, and this figure climbed sharply to a peak of just under 30% at 8:00 am. Thereafter, radio listenership declined steadily throughout the afternoon and evening, with minor fluctuations around 4:00 pm, before falling to below 5% after midnight.

In contrast, television audiences were negligible at 6:00 am and rose modestly to around 7% at 8:00 am. After dipping slightly before noon, viewership increased to 15% by 2:00 pm, matching the radio audience at that time. From 4:00 pm onwards, television viewing surged dramatically, reaching a peak of roughly 45% at 8:00 pm before plummeting after 10:00 pm to around 2% by 2:00 am.`,
  },
  {
    title: 'Official IELTS Academic Task 1C: Brick Manufacturing Process',
    taskType: 'academic_task_1' as const,
    taskNumber: 1 as const,
    testType: 'academic' as const,
    subtype: 'process' as const,
    prompt:
      'The diagram below shows the process by which bricks are manufactured for the building industry.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: ['/diagrams/writing_task1c_brick_manufacturing.svg'],
    teacherVisualDescription:
      'Process diagram: Brick Manufacturing in 7 steps. Step 1: Digger excavates clay from the ground. Step 2: Clay is sifted through a metal grid onto a roller. Step 3: Sand and water are added. Step 4: Mixture is shaped into bricks using either a wire cutter or a mould. Step 5: Bricks are placed in a drying oven for 24 to 48 hours. Step 6: Bricks are fired in a kiln (first at moderate temperature 200°C-980°C, then high temperature 870°C-1300°C) and cooled in a cooling chamber for 48 to 72 hours. Step 7: Bricks are packaged and delivered by truck.',
    teacherAssessmentGuidance:
      'Official IELTS Task 1C: Must include an overview summarizing both the number of steps and the macro-stages (extracting clay, shaping, drying/firing, and delivery). Must NOT use a letter format ("Dear Sir") or personal commentary.',
    modelResponse: `The diagram illustrates the seven-stage man-made process by which bricks are produced for the construction industry.

Overall, brick manufacturing is a linear process that begins with the excavation of raw clay from the ground, followed by sifting, shaping, drying, high-temperature firing and cooling, and concludes with packaging and delivery.

In the initial stage, a mechanical digger excavates clay from the earth. These large lumps of clay are then placed onto a metal grid, which breaks them down into smaller particles that drop onto a moving roller. Next, sand and water are added to the segregated clay to form a homogenous mixture, which is either pressed into moulds or sliced into brick-shaped blocks using a wire cutter.

Once shaped, the raw bricks are placed in a drying oven for 24 to 48 hours. Subsequently, the dried bricks are transferred to a kiln, where they are fired first at a moderate temperature of 200°C to 980°C and then at a high temperature ranging from 870°C to 1300°C. They are then cooled for 48 to 72 hours in a cooling chamber before being packaged onto pallets and delivered by lorry.`,
  },
  {
    title: 'IELTS Advantage Academic Task 1: Transformation of a Village in the West of Ireland (Maps)',
    taskType: 'academic_task_1' as const,
    taskNumber: 1 as const,
    testType: 'academic' as const,
    subtype: 'map' as const,
    prompt:
      'The two maps below show a small village in the west of Ireland in the year 2000 and at the present time.\n\nSummarise the information by selecting and reporting the main features and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: ['/diagrams/writing_task1_ireland_village_map.svg'],
    teacherVisualDescription:
      'Two maps (2000 vs Present) with compass rose. In 2000: Farmland in the northwest, 4 houses along a side road to the west of the main north-south road, shops and a hotel on the northern side of the east-west coastal road, a market on the southern side of the coastal road, and a dock on the southern seafront. At Present: Farmland in the northwest has been replaced by a park; the west side road has been extended with 10 houses total; a new northeast road branch has been built with 3 additional houses; a carpark has been constructed east of the hotel; the shops and hotel remain unchanged; the market has been replaced by restaurants; the dock has been demolished.',
    teacherAssessmentGuidance:
      'Must use accurate cardinal directions (northwest, east, west, south), present perfect passive for developments from 2000 to Present, and explicitly mention unchanged features (shops and hotel) alongside new additions and removals.',
    modelResponse: `The two maps display the transformation of a small village in the west of Ireland from 2000 to the present time.

Overall, the village has undergone significant changes with the construction of more housing and restaurants. Another noticeable feature is that the farmland has been turned into a new park over the period.

In 2000, there was a dock at the seafront which has been removed. There were some shops, a hotel, and a market on both sides of the coastal road running from west to east. While the shops and the hotel on the northern side of the road remain relatively the same now, the market on the southern side of the road has been replaced by some restaurants. A new car park has been built east of the hotel.

From the coastal road, there is a main road running northward. There used to be only four houses on the side road, leading from the main road to the west. This side road has been extended westward with more housing on both sides of it, and a new side road with additional housing has been constructed to the east of the main road. Lastly, the farmland that once occupied the northwest of the village has been replaced by a new park.`,
  },
  {
    title: 'Official IELTS Task 2A: Family Wealth and Preparation for Adult Life',
    taskType: 'task_2' as const,
    taskNumber: 2 as const,
    testType: 'both' as const,
    subtype: 'opinion' as const,
    prompt:
      'Children who are brought up in families that do not have large amounts of money are better prepared to deal with the problems of adult life than children brought up by wealthy parents.\n\nTo what extent do you agree or disagree with this opinion?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Official IELTS Task 2A: Candidate must present a clear position throughout, paraphrase the prompt (do not copy the prompt verbatim), and address both sides of the comparison (less affluent vs wealthy upbringing) without sweeping over-generalisations.',
    modelResponse: `It is frequently argued that growing up in a modest household equips young people with stronger coping mechanisms for adulthood than being raised in an affluent environment. While financial hardship undoubtedly fosters resilience and financial literacy, I only partially agree with this view, as children from wealthy families can also be well prepared if their parents instill strong values.

On the one hand, children raised in lower-income families often develop practical life skills at an early age. Because household budgets are tight, these youngsters learn to distinguish between essential needs and non-essential luxuries. Many take on part-time jobs during weekends or school holidays to earn pocket money or contribute to family expenses, which teaches them the value of hard work, time management, and self-reliance. Watching their parents navigate financial challenges also provides a realistic understanding of adult responsibilities, making them less likely to feel overwhelmed when facing setbacks later in life.

On the other hand, it would be an over-generalisation to assume that wealth automatically produces spoiled or ill-prepared adults. Affluent parents can provide superior educational opportunities, mentorship, and exposure to diverse problem-solving environments. When wealthy parents set clear boundaries and require their children to earn privileges rather than handing them everything effortlessly, those children enter adulthood with both strong qualifications and emotional maturity. Conversely, extreme poverty can sometimes deprive children of basic security and education, hindering rather than helping their adult prospects.

In conclusion, while modest financial circumstances naturally encourage independence and resourcefulness, preparation for adult life ultimately depends more on parenting style and personal character than on a family's bank balance.`,
  },
  {
    title: 'Official IELTS Task 2B: International Tourism Advantages vs Disadvantages',
    taskType: 'task_2' as const,
    taskNumber: 2 as const,
    testType: 'both' as const,
    subtype: 'discussion' as const,
    prompt:
      'International tourism has brought enormous benefit to many places. At the same time, there is concern about its impact on local inhabitants and the environment.\n\nDo the disadvantages of international tourism outweigh the advantages?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Official IELTS Task 2B: Candidate must weigh both the benefits and negative impacts on local residents/environment, and maintain a clear position on which side outweighs the other (avoid drifting into a pure problem-solution essay in the body paragraphs).',
    modelResponse: `The rapid expansion of global travel has generated substantial economic rewards for host nations, yet it has also raised legitimate concerns regarding environmental degradation and social disruption. In my view, although the ecological and cultural pressures of mass tourism are serious, they can be managed effectively, meaning the advantages still outweigh the disadvantages.

The primary drawback of international tourism lies in the strain it places on fragile ecosystems and local communities. Popular coastal and heritage destinations frequently suffer from littering, increased carbon emissions, and the overconsumption of water and energy. Furthermore, the influx of short-term visitors can drive up housing and living costs for local residents, while the commercialisation of traditional ceremonies can erode authentic local culture. Without regulation, these pressures can degrade the very attractions that draw visitors in the first place.

Nevertheless, the economic and social benefits of international tourism are transformative and far-reaching. For many developing nations and island economies, tourism serves as a vital engine of employment, supporting millions of livelihoods across hospitality, transport, and local crafts. The foreign exchange revenue generated by visitors funds essential public infrastructure, healthcare, and conservation projects that would otherwise be unaffordable. Moreover, cross-cultural contact fosters mutual understanding and global awareness, breaking down stereotypes between nations.

In conclusion, while unmanaged tourism can harm the environment and inconvenience local residents, these drawbacks do not outweigh the immense economic lifeline and cultural exchange that international travel provides.`,
  },
  {
    title: 'Official IELTS General Training Task 1A: Letter to College Accommodation Officer',
    taskType: 'gt_task_1' as const,
    taskNumber: 1 as const,
    testType: 'general' as const,
    subtype: 'letter_formal' as const,
    prompt:
      'You live in a room in college which you share with another student. However, there are many problems with this arrangement and you find it very difficult to work.\n\nWrite a letter to the accommodation officer at the college. In the letter\n• describe the situation\n• explain your problems and why it is difficult to work\n• say what kind of accommodation you would prefer\n\nYou do NOT need to write any addresses.\nBegin your letter as follows:\nDear Sir or Madam,',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    teacherAssessmentGuidance:
      'Must use a formal letter register ("Dear Sir or Madam," / "Yours faithfully,"), clearly state the purpose in the opening, cover all three bullet points with specific detail (especially the type of preferred accommodation, not just a single word), and write at least 150 words.',
    modelResponse: `Dear Sir or Madam,

I am writing to inform you about ongoing difficulties I am experiencing in my current shared room in Maple Hall and to request a transfer to alternative accommodation for the upcoming term.

At present, I share Room 204 with another first-year student. Unfortunately, our daily routines and study habits are completely incompatible, which has made it almost impossible for me to concentrate on my coursework. My roommate regularly invites groups of friends over in the evenings and plays loud music until past midnight, even on weeknights. In addition, he frequently borrows my textbooks and personal items without asking, and leaves the desk area cluttered. Because I have major examinations approaching next month, I urgently need a calm and orderly environment in the evenings.

I would be extremely grateful if you could relocate me to a quiet single-occupancy study bedroom, ideally on an upper floor or in one of the postgraduate quiet-zone residences, with a dedicated desk and access to a shared kitchen.

Thank you very much for considering my request. I look forward to hearing from you soon.

Yours faithfully,
Alex Rivera`,
  },
  {
    title: 'Official IELTS General Training Task 1B: Suggestions for Local Public Library',
    taskType: 'gt_task_1' as const,
    taskNumber: 1 as const,
    testType: 'general' as const,
    subtype: 'letter_formal' as const,
    prompt:
      'Your local public library wants to make improvements to their services and facilities. In order to get ideas from the public, they have asked library users to send them suggestions in writing.\n\nWrite a letter to the librarian. In your letter\n• describe what you like about the library\n• say what you don’t like\n• make suggestions for improvements\n\nYou do NOT need to write any addresses.\nBegin your letter as follows:\nDear Sir or Madam,',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    teacherAssessmentGuidance:
      'Must include all three bullet points—candidates often omit "what you like about the library" or forget a formal closing ("Yours faithfully,"), which caps Task Achievement. Ensure clear paragraphing and polite formal suggestions.',
    modelResponse: `Dear Sir or Madam,

I am writing in response to your invitation for feedback regarding our local public library. As a regular member for the past ten years, I appreciate the opportunity to share my views.

First of all, there is a great deal that I value about the library. The staff are consistently welcoming and knowledgeable, and the quiet reading room on the first floor provides a comfortable, well-lit space for study. I also enjoy the wide selection of daily newspapers and local history archives.

However, there are a few areas that currently limit my experience. Many of the fiction shelves are poorly labelled, making it time-consuming to locate recently published titles. Furthermore, the library’s opening hours on weekdays—closing at 5:30 p.m.—make it difficult for full-time workers to visit after work, and the lack of power outlets near the study desks is inconvenient for laptop users.

To improve these services, I would suggest installing a digital self-service catalogue terminal near the entrance and extending evening hours until 8:00 p.m. on at least two weekdays. Adding charging sockets along the main study tables would also be greatly appreciated by students and remote workers.

Thank you for your continued efforts to serve our community.

Yours faithfully,
Priya Nair`,
  },
  {
    title: 'Official IELTS General Training Task 2A: Paying for Care of Elderly People',
    taskType: 'task_2' as const,
    taskNumber: 2 as const,
    testType: 'general' as const,
    subtype: 'opinion' as const,
    prompt:
      'In Britain, when someone gets old they often go to live in a home with other old people where there are nurses to look after them. Sometimes the government has to pay for this care.\n\nWho do you think should pay for this care, the government or the family?',
    instructions: 'You should spend about 40 minutes on this task. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Requires a clear position on whether the government or the family (or a shared model) should fund residential nursing care for the elderly, with well-developed reasoning, clear topic sentences per paragraph, and a coherent conclusion.',
    modelResponse: `As life expectancy rises in many developed nations, the question of who should bear the financial responsibility for residential nursing care for the elderly has become increasingly urgent. While families naturally feel a moral obligation toward their ageing relatives, I believe that the government should be the primary funder of such care, with families contributing only according to their means.

There are compelling reasons why the state must take main responsibility for elderly care. First, most senior citizens have contributed to society throughout their working lives through income taxes and national insurance. Ensuring dignified, professional nursing care in their final years is therefore a fair return on a lifetime of civic contribution. Second, specialised nursing homes are prohibitively expensive for average households. If families were forced to cover the full cost alone, lower-income relatives would face severe financial hardship or be compelled to leave their jobs to become untrained full-time carers, which would harm both the quality of care and the wider economy.

At the same time, families should not be entirely absolved of involvement. Relatives who have substantial savings or property can reasonably be asked to make a means-tested contribution toward accommodation and personal amenities, ensuring that limited public funds are prioritised for those who genuinely cannot afford them. Moreover, emotional support, regular visits, and advocacy remain irreplaceable duties that only family members can provide.

In conclusion, although affluent families can share part of the financial burden, guaranteeing universal access to professional care for older citizens is fundamentally a public responsibility that the government should lead.`,
  },
  {
    title: 'Official IELTS General Training Task 2B: Shopping as a Leisure Activity',
    taskType: 'task_2' as const,
    taskNumber: 2 as const,
    testType: 'general' as const,
    subtype: 'direct_question' as const,
    prompt:
      'Shopping is becoming more and more popular as a leisure activity. However, some people feel that this has both positive and negative effects.\n\nWhy is shopping so popular?\n\nWhat effects does its increase in popularity have on individuals and on society?',
    instructions: 'You should spend about 40 minutes on this task. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Two-part prompt: candidates must address BOTH (1) why shopping has become so popular as leisure AND (2) its effects on both individuals and society. Omitting either question or ignoring societal effects limits Task Response.',
    modelResponse: `In recent decades, shopping has evolved from a routine necessity into one of the most widespread forms of recreation. This shift is driven by the design of modern retail spaces and social habits, and while it brings economic vitality, it also carries notable drawbacks for individuals and communities alike.

Shopping has become so popular largely because modern malls and online platforms deliberately combine commerce with entertainment. Shopping centres now feature cinemas, cafes, and climate-controlled walkways, turning a trip to buy goods into an effortless social outing with friends or family. Furthermore, targeted advertising and seasonal sales create a sense of excitement and novelty, offering people an accessible distraction from daily work stress even when they are merely browsing.

On an individual level, the effects of recreational shopping are mixed. On the positive side, treating oneself occasionally or socialising in lively public spaces can boost mood and reduce feelings of isolation. However, habitual leisure shopping frequently encourages impulse buying and excessive reliance on consumer credit, leaving many individuals burdened by debt and clutter rather than genuine satisfaction.

At the societal level, rising consumer spending stimulates business growth, supports retail and hospitality employment, and generates tax revenue for public services. Yet this consumer-driven culture also accelerates resource depletion and packaging waste, while widening visible material inequalities between affluent shoppers and those with limited disposable income.

In conclusion, shopping thrives as a leisure activity because it offers social stimulation and emotional escape. Although it fuels jobs and economic activity, its long-term personal and environmental costs require more mindful consumption habits.`,
  },
];

/**
 * Seeds the Official IELTS and IELTS Advantage sample tasks into `writing_tasks` if they do not already exist,
 * and ensures existing seeded tasks have their visual diagram images attached.
 */
export async function seedOfficialWritingTasks(createdById: string): Promise<WritingTask[]> {
  const existing = await db.prepare('SELECT id, title FROM writing_tasks').all();
  const existingByTitle = new Map<string, string>();
  for (const r of existing as any[]) {
    existingByTitle.set(String(r.title).toLowerCase(), r.id);
  }

  const createdOrUpdated: WritingTask[] = [];
  for (const item of OFFICIAL_AND_ADVANTAGE_WRITING_TASKS) {
    const existingId = existingByTitle.get(item.title.toLowerCase());
    if (existingId) {
      if ('images' in item && item.images && item.images.length > 0) {
        await db
          .prepare('UPDATE writing_task_versions SET images_json = ? WHERE task_id = ?')
          .run(JSON.stringify(item.images), existingId);
      }
      continue;
    }
    const draft = await createWritingTask({
      createdById,
      ...item,
    });
    const published = await publishWritingTask(draft.id);
    createdOrUpdated.push(published);
  }
  return createdOrUpdated;
}
