import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { CambridgeWritingTaskSeed } from './ingestCambridge16WritingTests';

export const CAMBRIDGE_18_WRITING_TASKS: CambridgeWritingTaskSeed[] = [
  // TEST 1
  {
    title: 'Cambridge IELTS 18 Academic Writing Test 1 - Task 1: Urban Population in Four Asian Countries',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The graph below gives information about the percentage of the population in four Asian countries living in cities from 1970 to 2020, with predictions for 2030 and 2040.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794825830/C18-WT1.png',
    ],
    teacherVisualDescription:
      'Line graph titled "Percentage of the population living in cities" (y-axis 0% to 90%, x-axis 1970 to 2040 in 10-year intervals). Malaysia (dotted line, open diamonds): starts at 30% (1970), ~40% (1980), ~45% (1990), ~60% (2000), ~71% (2010), ~76% (2020), predicted ~81% (2030) and ~83% (2040) — highest throughout most of the period. Philippines (dash-dot line, solid squares): ~31% (1970), ~34% (1980), peaks at ~49% (1990, briefly highest), dips to ~46% (2000) and ~43% (2010), then rises to ~46% (2020), predicted ~51% (2030) and ~56% (2040). Indonesia (solid line, triangles): starts lowest at ~14% (1970), ~17% (1980), ~25% (1990), ~30% (2000), overtakes Thailand and Philippines around 2010 at ~42%, reaches ~52% (2020), predicted ~61% (2030) and ~64% (2040). Thailand (dashed line, X): ~19% (1970), ~23% (1980), ~30% (1990), ~30% (2000), ~32% (2010), ~33% (2020), predicted ~41% (2030) and ~49% (2040) — lowest from 2000 onwards.',
    teacherAssessmentGuidance:
      'Candidate must report historical trends (1970–2020) and future predictions (2030–2040) using appropriate future/projection language, compare similarities and differences (Malaysia and Indonesia rising steeply vs Philippines peaking in 1990 and dipping before recovering, Thailand plateauing from 1990–2020 before rising), and provide accurate data from 1990 onwards.',
    modelResponse: `The line graph illustrates the proportion of the population residing in urban areas across four Asian countries—the Philippines, Malaysia, Thailand, and Indonesia—between 1970 and 2020, along with projections for 2030 and 2040.

Overall, urban populations are projected to increase substantially in all four nations over the 70-year period. Malaysia is expected to remain the most urbanised country from 2000 onwards, while Indonesia is forecast to experience the fastest overall growth, overtaking both Thailand and the Philippines.

In 1970, Malaysia and the Philippines had similar urbanisation rates of around 30% and 31% respectively. The Philippines climbed to nearly 49% in 1990 before falling back to about 43% in 2010, after which it began recovering and is predicted to reach roughly 56% by 2040. By contrast, Malaysia surged steadily after 1990, reaching around 76% in 2020 and projected to top 83% in 2040.

Indonesia started lowest at approximately 14% in 1970, yet rose rapidly to surpass Thailand in 2000 and the Philippines by 2010, with forecasts pointing to around 64% in 2040. Meanwhile, Thailand grew modestly from 19% in 1970 to 30% in 1990, plateaued near 33% until 2020, and is expected to climb to almost 50% by 2040.`,
  },
  {
    title: 'Cambridge IELTS 18 Academic Writing Test 1 - Task 2: Most Important Aim of Science',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'opinion',
    prompt:
      'The most important aim of science should be to improve people’s lives.\n\nTo what extent do you agree or disagree with this statement?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Candidate must clearly state the extent to which they agree or disagree that improving people’s lives should be science’s primary aim, supporting their position with concrete scientific examples (e.g. medicine, clean energy, or pure/basic research).',
    modelResponse: `Scientific research has transformed modern society, from eradicating deadly diseases to connecting the globe through digital communication. While pure curiosity and the pursuit of knowledge for its own sake also play a vital role, I strongly agree that the primary aim of science should be to improve human wellbeing.

First and foremost, directing scientific effort towards human welfare yields immense practical benefits. Advances in medical science—such as vaccines, antibiotics, and diagnostic imaging—have dramatically increased global life expectancy and reduced suffering. Similarly, breakthroughs in agricultural technology, renewable energy, and water purification directly address existential challenges like famine and climate change. Since public taxes fund a large share of scientific research, it is reasonable for society to expect tangible improvements in health, safety, and living standards in return.

That said, basic research driven by curiosity should not be dismissed, because its real-world applications are often unpredictable. Many transformative technologies, including electricity, X-rays, and the internet, originated from fundamental investigations whose practical value was not immediately obvious. Furthermore, scientists cannot always control how discoveries are used once published—just as nuclear physics enabled both clean power generation and destructive weapons.

In conclusion, although pure discovery expands human understanding and can unexpectedly benefit society, improving people's lives should remain the guiding priority of science, ensuring that finite research resources are used responsibly and ethically.`,
  },

  // TEST 2
  {
    title: 'Cambridge IELTS 18 Academic Writing Test 2 - Task 1: US Households by Annual Income',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The chart below shows the number of households in the US by their annual income in 2007, 2011 and 2015.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794825830/C18-WT2.png',
    ],
    teacherVisualDescription:
      'Grouped bar chart titled "Number of US households (in millions), by annual income" for 2007, 2011, and 2015 (y-axis 0 to 35 million). Five income brackets: Less than $25,000 (~25m in 2007, ~29m in 2011, ~28m in 2015); $25,000–$49,999 (~27m in 2007, ~30m in 2011, ~29m in 2015); $50,000–$74,999 (stable at ~21m across all three years); $75,000–$99,999 (smallest group: ~15m in 2007, ~14m in 2011, ~15m in 2015); $100,000 or more (~29.5m in 2007, dips to ~28m in 2011, surges to ~33m in 2015 — the largest group in both 2007 and 2015).',
    teacherAssessmentGuidance:
      'Must include a clear overview contrasting the trends across the income brackets (lower-income groups under $50,000 rose in 2011 then dipped slightly in 2015; higher-income groups over $75,000 dipped in 2011 then rose in 2015, with $100,000+ reaching the highest figure at ~33m; middle-income $50,000–$74,999 remained steady at ~21m).',
    modelResponse: `The bar chart compares the number of US households across five annual income brackets in 2007, 2011, and 2015.

Overall, households earning below $50,000 rose between 2007 and 2011 before edging down in 2015, whereas those earning $75,000 or more followed the opposite pattern, dipping in 2011 and rebounding in 2015. Meanwhile, the middle-income bracket remained virtually unchanged throughout the period.

In 2007, the largest group consisted of households earning $100,000 or more, at roughly 29.5 million. Although this figure fell to around 28 million in 2011, it surged to approximately 33 million in 2015—the highest total on the chart. By contrast, the $75,000–$99,999 bracket was consistently the smallest, fluctuating narrowly between 14 million and 15 million.

Among lower-income households, both the under-$25,000 and $25,000–$49,999 groups increased from 25 million and 27 million in 2007 to peaks of roughly 29 million and 30 million in 2011, before easing slightly to 28 million and 29 million in 2015. Finally, households earning $50,000–$74,999 stayed steady at about 21 million in all three years.`,
  },
  {
    title: 'Cambridge IELTS 18 Academic Writing Test 2 - Task 2: University Students Learning Other Subjects',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'discussion',
    prompt:
      'Some university students want to learn about other subjects in addition to their main subjects. Others believe it is more important to give all their time and attention to studying for a qualification.\n\nDiscuss both these views and give your own opinion.',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must discuss both perspectives (broadening study with additional subjects vs focusing exclusively on a main qualification) and present a clear personal opinion.',
    modelResponse: `University students often face a choice between concentrating solely on their degree specialisation and exploring additional subjects outside their main field. While undivided focus helps build deep technical mastery, I believe that studying supplementary subjects offers valuable breadth, provided students do not neglect their core qualification.

On the one hand, dedicating all available time to one's primary subject is essential in demanding disciplines such as medicine, law, or engineering. Achieving professional competence requires years of intensive study, and spreading attention across unrelated courses could reduce grades or delay graduation. Employers hiring for specialised roles also expect candidates to possess thorough, up-to-date expertise in their core field rather than superficial knowledge of many areas.

On the other hand, taking courses outside a main degree fosters intellectual curiosity and adaptability. Modern careers increasingly reward interdisciplinary thinking—for example, a computer science graduate who studies psychology or business is better equipped to design user-friendly products or manage teams. Furthermore, learning a second language, ethics, or public speaking enriches students' personal development and makes them more versatile in a rapidly changing job market.

In conclusion, although students must prioritise their main qualification to gain the depth required for their chosen profession, selectively exploring complementary subjects can broaden their perspective and enhance their long-term career prospects.`,
  },

  // TEST 3
  {
    title: 'Cambridge IELTS 18 Academic Writing Test 3 - Task 1: Central Library Floor Plan Changes',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'map',
    prompt:
      'The diagram below shows the floor plan of a public library 20 years ago and how it looks now.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794825831/C18-WT3.png',
    ],
    teacherVisualDescription:
      'Two floor plans: "Central Library 20 years ago" and "Central Library today" (with Entrance at the bottom centre). 20 YEARS AGO: Front left: Reading room (newspapers & magazines); Front right: Enquiry desk (tickets, book returns, etc.); Middle left: Adult fiction books; Middle right: Adult non-fiction books; Centre: Tables & chairs; Back left room: CDs, videos, computer games; Back right room: Children’s books. TODAY: The central tables & chairs have been removed, leaving an open central space. Front left: Computer room (replaces Reading room); Front right: Café (replaces Enquiry desk). Middle left: All reference books (replaces Adult fiction); Middle right: Adult fiction books moved here, plus a new Information desk and three Self-service machines (replacing Adult non-fiction). Back left room: enlarged to house Children’s fiction books and a Storytelling events space with two sofas. Back right room: Lecture room (replaces Children’s books).',
    teacherAssessmentGuidance:
      'Must include a clear overview summarizing the main changes (removal of central tables/chairs for an open space, addition of digital/self-service facilities, a café, a lecture room, and an enlarged children/storytelling area) and accurately report spatial changes between 20 years ago and today.',
    modelResponse: `The two floor plans compare the layout of Central Library 20 years ago with its redesigned arrangement today.

Overall, the library has been modernised to create an open central space, replace traditional reading and enquiry areas with digital and self-service facilities, and add community amenities including a café, a lecture room, and an expanded children's storytelling area.

Two decades ago, the central area contained tables and chairs, which have now been completely removed. Near the bottom entrance, the reading room on the left has been converted into a computer room, while the enquiry desk on the right has been replaced by a café. Along the middle section, adult fiction books have moved from the left side to the right—taking the place of adult non-fiction—while the left side now holds all reference books. In addition, a smaller information desk and three self-service machines have been installed on the right.

At the back of the building, the former CDs, videos, and computer games room on the left has been enlarged into a children's fiction section featuring two sofas for storytelling events. Finally, the back-right room, previously used for children's books, has been transformed into a lecture room.`,
  },
  {
    title: 'Cambridge IELTS 18 Academic Writing Test 3 - Task 2: Rural-to-Urban Migration',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'opinion',
    prompt:
      'In many countries around the world, rural people are moving to cities, so the population in the countryside is decreasing.\n\nDo you think this is a positive or a negative development?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must address BOTH the growth of cities AND the declining population in the countryside (omitting the impact on the countryside limits Task Response per Cambridge 18 examiner comment), and take a clear position on whether this is positive or negative.',
    modelResponse: `Rapid urbanisation has led millions of rural residents to relocate to major cities, leaving many countryside communities with shrinking populations. While urban living can offer better employment and education, I believe this demographic shift is largely a negative development due to the strain it places on both cities and rural areas.

In rural regions, depopulation creates serious social and economic decline. As young, working-age people depart, farms and local businesses struggle to find labour, threatening agricultural productivity and traditional livelihoods. Moreover, falling resident numbers often prompt governments and private companies to close rural schools, clinics, and transport links, leaving elderly residents increasingly isolated without essential services.

At the same time, sudden population growth overwhelms urban infrastructure. Cities frequently face severe housing shortages, driving up rents and forcing low-income newcomers into overcrowded neighbourhoods. Increased demand for transport and utilities also worsens traffic congestion, air pollution, and pressure on public hospitals. Although cities do provide wider access to universities, specialised healthcare, and diverse jobs, these benefits are undermined when infrastructure cannot keep pace with arrivals.

In conclusion, while migration to cities can improve opportunities for individuals, the combined damage of rural abandonment and urban overcrowding makes this trend predominantly negative unless governments invest in rural jobs and regional connectivity.`,
  },

  // TEST 4
  {
    title: 'Cambridge IELTS 18 Academic Writing Test 4 - Task 1: Monthly Price Changes of Three Metals (2014)',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The graph below shows the average monthly change in the prices of three metals during 2014.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794825830/C18-WT4.png',
    ],
    teacherVisualDescription:
      'Line graph titled "Average monthly change in prices of copper, nickel and zinc (2014)" (y-axis -4% to +7%, x-axis months J F M A M J J A S O N D). Note: values represent % change in price compared with the previous month. Nickel (solid line, dots): starts highest at +6% in January, +4% (Feb), drops to +1% (Mar-Apr), +0.5% (May), plunges to lowest point of -3% in June, remains at -1% (Jul-Sep), drops to -2% (Oct), recovers to +1% (Nov-Dec). Copper (dashed line, open circles): +2% (Jan), +1% (Feb), +0.5% (Mar-Apr), -0.5% (May-Jun), +1% (Jul-Sep), +0.5% (Oct-Nov), +1.5% (Dec). Zinc (solid line, X): +1% (Jan), peaks at +3% (Feb), +2% (Mar), +1.5% (Apr), +1% (May), falls to -1% (Jun), -0.5% (Jul-Sep), -1% (Oct), +1.5% (Nov), +2% (Dec). All three dipped in June, remained flat from July to September, and rose in the final two months.',
    teacherAssessmentGuidance:
      'Must include a clear overview noting both individual extremes (nickel showing the widest swing from +6% to -3%) and shared patterns (declining in the first half with a trough in June, plateauing from July to September, and recovering from October to December), with accurate figures across the year.',
    modelResponse: `The line graph illustrates the average monthly percentage change in the prices of copper, nickel, and zinc throughout 2014.

Overall, all three metals experienced a downward trend during the first half of the year—dipping into negative territory in June—followed by a period of stability between July and September and a recovery towards December. Nickel recorded the sharpest fluctuations, whereas copper showed the narrowest range.

In January, nickel saw the largest monthly price rise at 6%, before dropping steeply to 1% in March and plunging to a low of -3% in June. Zinc followed a contrasting early pattern, climbing from 1% in January to a peak of 3% in February before sliding to -1% in June. Meanwhile, copper fell more gradually from 2% in January to -0.5% in May and June.

From July to September, monthly price changes for all three metals remained flat: copper at 1%, zinc at -0.5%, and nickel at -1%. After dipping slightly in October (nickel to -2%, zinc to -1%, copper to 0.5%), all three rebounded over the final two months, ending December at 2% for zinc, 1.5% for copper, and 1% for nickel.`,
  },
  {
    title: 'Cambridge IELTS 18 Academic Writing Test 4 - Task 2: Ageing Population Advantages vs Disadvantages',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'advantages_disadvantages',
    prompt:
      'In many countries, people are now living longer than ever before. Some people say an ageing population creates problems for governments. Other people think there are benefits if society has more elderly people.\n\nTo what extent do the advantages of having an ageing population outweigh the disadvantages?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must address both the governmental/economic problems of an ageing population and the societal benefits of more elderly people, and clearly state the extent to which the advantages outweigh the disadvantages (or vice versa).',
    modelResponse: `Increased life expectancy and falling birth rates mean that many countries now have a growing proportion of elderly citizens. While older generations contribute valuable experience and family support, I believe the economic and healthcare pressures of an ageing population outweigh the advantages for governments unless policies adapt.

On the positive side, older people bring significant social and economic value. Many seniors remain healthy and active well into their seventies, allowing them to continue working, mentor younger colleagues, or volunteer in local communities. Within families, retired grandparents frequently provide free childcare, enabling both parents to remain in full-time employment and boosting household incomes.

However, the fiscal challenges posed by a rapidly ageing demographic are substantial. As the ratio of retirees to working-age taxpayers shrinks, governments face rising expenditure on state pensions, long-term care facilities, and age-related medical treatments. Public health systems can become overstretched, while employers in key sectors may struggle with labour shortages as experienced workers retire faster than younger cohorts enter the workforce.

In conclusion, although elderly citizens enrich families and communities through their wisdom, volunteering, and childcare support, the strain on pensions, healthcare budgets, and labour supply means that the disadvantages of an ageing population generally outweigh the advantages.`,
  },
];

export async function ingestCambridge18WritingTests(): Promise<{
  created: number;
  updated: number;
  taskIds: string[];
}> {
  const adminRow = (await db
    .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
    .get()) as { id: string } | undefined;
  const fallbackUser = adminRow
    ? adminRow
    : ((await db.prepare('SELECT id FROM users LIMIT 1').get()) as { id: string } | undefined);

  const createdById = fallbackUser?.id || 'admin-seed';
  const now = new Date().toISOString();

  let created = 0;
  let updated = 0;
  const taskIds: string[] = [];

  for (const item of CAMBRIDGE_18_WRITING_TASKS) {
    const existing = (await db
      .prepare('SELECT id FROM writing_tasks WHERE title = ? LIMIT 1')
      .get(item.title)) as { id: string } | undefined;

    if (existing) {
      await db
        .prepare(
          `UPDATE writing_tasks
           SET task_type = ?, task_number = ?, test_type = ?, status = 'published', is_free_tier = 1, updated_at = ?
           WHERE id = ?`
        )
        .run(item.taskType, item.taskNumber, item.testType, now, existing.id);

      const existingVersion = (await db
        .prepare(
          'SELECT id FROM writing_task_versions WHERE task_id = ? ORDER BY version_number DESC LIMIT 1'
        )
        .get(existing.id)) as { id: string } | undefined;

      if (existingVersion) {
        await db
          .prepare(
            `UPDATE writing_task_versions
             SET status = 'published',
                 task_type = ?,
                 task_number = ?,
                 test_type = ?,
                 subtype = ?,
                 title = ?,
                 prompt = ?,
                 instructions = ?,
                 min_words = ?,
                 suggested_time_minutes = ?,
                 images_json = ?,
                 teacher_visual_description = ?,
                 model_response = ?,
                 teacher_assessment_guidance = ?,
                 published_at = COALESCE(published_at, ?)
             WHERE id = ?`
          )
          .run(
            item.taskType,
            item.taskNumber,
            item.testType,
            item.subtype,
            item.title,
            item.prompt,
            item.instructions,
            item.minWords,
            item.suggestedTimeMinutes,
            item.images ? JSON.stringify(item.images) : null,
            item.teacherVisualDescription || null,
            item.modelResponse,
            item.teacherAssessmentGuidance,
            now,
            existingVersion.id
          );
      }

      updated++;
      taskIds.push(existing.id);
    } else {
      const taskId = uuidv4();
      const versionId = uuidv4();

      await db
        .prepare(
          `INSERT INTO writing_tasks (
            id, title, task_type, task_number, test_type, current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
          ) VALUES (?, ?, ?, ?, ?, 1, 'published', ?, 1, ?, ?)`
        )
        .run(taskId, item.title, item.taskType, item.taskNumber, item.testType, createdById, now, now);

      await db
        .prepare(
          `INSERT INTO writing_task_versions (
            id, task_id, version_number, status, task_type, task_number, test_type,
            subtype, title, prompt, instructions, min_words, suggested_time_minutes,
            images_json, structured_data_json, teacher_visual_description,
            model_response, teacher_assessment_guidance, validation_errors_json, published_at, created_at
          ) VALUES (?, ?, 1, 'published', ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, ?, ?, ?, '[]', ?, ?)`
        )
        .run(
          versionId,
          taskId,
          item.taskType,
          item.taskNumber,
          item.testType,
          item.subtype,
          item.title,
          item.prompt,
          item.instructions,
          item.minWords,
          item.suggestedTimeMinutes,
          item.images ? JSON.stringify(item.images) : null,
          item.teacherVisualDescription || null,
          item.modelResponse,
          item.teacherAssessmentGuidance,
          now,
          now
        );

      created++;
      taskIds.push(taskId);
    }
  }

  return { created, updated, taskIds };
}
