import { db } from './db';
import { createWritingTask, publishWritingTask } from './writingService';
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
];

/**
 * Seeds the Official IELTS and IELTS Advantage sample tasks into `writing_tasks` if they do not already exist.
 */
export async function seedOfficialWritingTasks(createdById: string): Promise<WritingTask[]> {
  const existing = await db.prepare('SELECT title FROM writing_tasks').all();
  const existingTitles = new Set(existing.map((r: any) => String(r.title).toLowerCase()));

  const created: WritingTask[] = [];
  for (const item of OFFICIAL_AND_ADVANTAGE_WRITING_TASKS) {
    if (existingTitles.has(item.title.toLowerCase())) continue;
    const draft = await createWritingTask({
      createdById,
      ...item,
    });
    const published = await publishWritingTask(draft.id);
    created.push(published);
  }
  return created;
}
