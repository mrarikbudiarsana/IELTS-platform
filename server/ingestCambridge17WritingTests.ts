import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { CambridgeWritingTaskSeed } from './ingestCambridge16WritingTests';

export const CAMBRIDGE_17_WRITING_TASKS: CambridgeWritingTaskSeed[] = [
  // TEST 1
  {
    title: 'Cambridge IELTS 17 Academic Writing Test 1 - Task 1: Norbiton Industrial Area Redevelopment',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'map',
    prompt:
      'The maps below show an industrial area in the town of Norbiton, and planned future development of the site.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794823058/C17-Writing_Test_1.png',
    ],
    teacherVisualDescription:
      'Two maps with a compass rose (N/S/E/W): "Norbiton industrial area now" and "Planned future development". NOW: The town lies to the west (separated by a dashed north-south line). A river flows west-to-east across the north, with Farmland north of the river. South of the river, a main east-west road runs along the bottom with a central roundabout; a road branches north-west to a dead end and another extends east from the roundabout. Eight factory buildings (hatched rectangles) are arranged around the roundabout and along the eastern and north-western roads. PLANNED FUTURE DEVELOPMENT: All factories are demolished and replaced by residential housing (cross-hatched) and community facilities. Housing is built north-west of the roundabout, west of the north-south road, east of the roundabout, and north of the river on former farmland (connected by a new bridge across the river and a new north-south road). A second smaller roundabout is added on the southern main road. Around the main roundabout, Shops (south-west) and a Medical centre (south-east) are added, while a Playground and a School (at the far eastern end) are constructed to the east.',
    teacherAssessmentGuidance:
      'Must cover key changes across all sections of the site (including housing west of the roundabout, the bridge and housing north of the river, shops and medical centre around the roundabout, and the playground and school to the east), use future/planned forms, and include a clear overview summarizing the transformation from an industrial zone to a residential and community area.',
    modelResponse: `The two maps compare the current layout of the Norbiton industrial area with plans for its future redevelopment.

Overall, the site is set to undergo a complete transformation from an exclusively industrial zone into a residential neighbourhood equipped with retail, medical, educational, and recreational facilities, alongside expanded road infrastructure.

At present, the area lies immediately east of the town, bounded by a river and farmland to the north and a main road to the south. Eight factories are clustered around a central roundabout, along an eastern road, and beside a short road branching north-west.

Under the proposed plan, all eight factories will be demolished. Housing will be constructed north-west and east of the central roundabout, as well as north of the river on former farmland, which will become accessible via a new bridge and a north-south road. Additionally, a second smaller roundabout will be built on the southern main road. Finally, shops and a medical centre will be added around the main roundabout, while a playground and a school will be established to the east.`,
  },
  {
    title: 'Cambridge IELTS 17 Academic Writing Test 1 - Task 2: Taking Risks in Professional and Personal Life',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'advantages_disadvantages',
    prompt:
      'It is important for people to take risks, both in their professional lives and their personal lives.\n\nDo you think the advantages of taking risks outweigh the disadvantages?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must address BOTH professional and personal lives (not only professional life), provide concrete examples of risks, and clearly state whether the advantages outweigh the disadvantages.',
    modelResponse: `Taking calculated risks is often regarded as essential for growth in both career and personal development. Although stepping outside one's comfort zone carries the possibility of failure and stress, I believe the advantages of taking risks clearly outweigh the disadvantages.

On the negative side, risk-taking can lead to significant setbacks if decisions are poorly judged. In a professional context, leaving a stable job to launch a start-up or investing heavily in an unproven venture can result in financial loss and career disruption. Similarly, in personal life, relocating to a new city or ending a long-term relationship can cause emotional distress and isolation if things do not go as planned.

Nevertheless, the benefits of embracing risk are far more impactful over the long term. Professionally, individuals who accept challenging assignments, change industries, or pitch ambitious ideas are much more likely to innovate, acquire new skills, and achieve substantial career advancement. In personal life, taking risks—such as travelling alone, learning a difficult skill, or being vulnerable in new friendships—builds resilience, self-confidence, and a richer sense of fulfilment. Even when an attempt fails, the resulting lessons equip people to make wiser choices in the future, whereas avoiding all risk often leads to stagnation and regret.

In conclusion, while taking risks inevitably involves the danger of financial or emotional loss, the opportunities for growth, innovation, and personal fulfilment make the advantages far greater than the disadvantages.`,
  },

  // TEST 2
  {
    title: 'Cambridge IELTS 17 Academic Writing Test 2 - Task 1: Police Budget Sources and Spending',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'mixed',
    prompt:
      'The table and charts below give information about the police budget for 2017 and 2018 in one area of Britain. The table shows where the money came from and the charts show how it was distributed.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794823057/C17-Writing_Test_2.png',
    ],
    teacherVisualDescription:
      'A table titled "Police Budget 2017-2018 (in £m)" and two pie charts titled "How the money was spent" for 2017 and 2018. Table (in £m): National Government increased from 175.5m (2017) to 177.8m (2018); Local Taxes rose from 91.2m (2017) to 102.3m (2018); Other sources (eg grants) edged up from 38m (2017) to 38.5m (2018); Total budget grew from 304.7m (2017) to 318.6m (2018). Pie charts (% of spending): Salaries (officers and staff) accounted for 75% in 2017 and fell to 69% in 2018; Technology rose from 8% in 2017 to 14% in 2018; Buildings and transport remained unchanged at 17% in both years.',
    teacherAssessmentGuidance:
      'Must report key figures from BOTH the table (all three funding sources and totals rising from £304.7m to £318.6m) and the two pie charts (salaries dropping from 75% to 69% while remaining dominant, technology rising from 8% to 14%, buildings/transport steady at 17%), using past tense consistently for 2017 and 2018.',
    modelResponse: `The table and two pie charts illustrate the funding sources and expenditure breakdown of the police budget in one region of Britain in 2017 and 2018.

Overall, total police funding increased over the two-year period, with all three revenue sources growing and National Government remaining the primary contributor. In terms of spending, salaries accounted for the vast majority of expenditure in both years, although their share declined as investment in technology nearly doubled.

Between 2017 and 2018, the total budget rose from £304.7m to £318.6m. National Government provided the largest amount in both years, increasing slightly from £175.5m to £177.8m. Local Taxes saw the steepest growth, climbing by £11.1m from £91.2m to £102.3m, while other sources such as grants edged up from £38m to £38.5m.

Regarding expenditure, officer and staff salaries represented 75% of the budget in 2017 before decreasing to 69% in 2018. Conversely, spending on technology increased sharply from 8% to 14%, whereas the proportion allocated to buildings and transport remained unchanged at 17%.`,
  },
  {
    title: 'Cambridge IELTS 17 Academic Writing Test 2 - Task 2: Children Using Smartphones',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'two_part',
    prompt:
      'Some children spend hours every day on their smartphones.\n\nWhy is this the case? Do you think this is a positive or a negative development?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must address both parts of the prompt: explain why children spend hours daily on smartphones, and take a clear position on whether this is a positive or negative development.',
    modelResponse: `It is increasingly common for children to spend several hours each day using smartphones. This habit is largely driven by the design of modern digital entertainment and busy family schedules, and while smartphones offer some educational benefits, I believe excessive daily use is predominantly a negative development.

There are two main reasons why children spend so much time on these devices. Firstly, social media platforms, video-sharing apps, and mobile games are deliberately engineered with algorithms and reward loops that capture young users' attention for hours on end. Secondly, many working parents rely on smartphones to keep their children occupied at home, especially in urban areas where safe outdoor play spaces are limited.

Although smartphones can help children look up information for schoolwork or stay in touch with friends, prolonged daily screen time causes serious harm. Physically, hours spent staring at a screen reduce time for exercise and outdoor play, contributing to poor posture, eye strain, and childhood obesity. Mentally and socially, excessive smartphone use can shorten attention spans, disrupt sleep patterns, and expose children to cyberbullying or unrealistic social comparisons. Face-to-face communication skills may also suffer when digital interaction replaces real-world play.

In conclusion, children spend hours on smartphones due to highly engaging apps and convenient parental reliance on screens. Despite minor learning advantages, I view this trend as largely negative because of its detrimental effects on physical health, sleep, and social development.`,
  },

  // TEST 3
  {
    title: 'Cambridge IELTS 17 Academic Writing Test 3 - Task 1: Family Weekly Income Spending (1968 vs 2018)',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The chart below gives information about how families in one country spent their weekly income in 1968 and in 2018.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794823058/C17-Writing_Test_3.png',
    ],
    teacherVisualDescription:
      'Horizontal grouped bar chart titled "1968 and 2018: average weekly spending by families" (% of weekly income, x-axis 0 to 40%). Food dropped from 35% (1968) to ~17% (2018). Housing rose from 10% (1968) to ~19% (2018). Fuel and power fell from ~6% (1968) to ~4% (2018). Clothing and footware halved from 10% (1968) to 5% (2018). Household goods remained unchanged at 8% in both 1968 and 2018. Personal goods halved from 8% (1968) to 4% (2018). Transport rose from 8% (1968) to ~14% (2018). Leisure surged from ~9% (1968) to ~22% (2018), becoming the largest spending category in 2018.',
    teacherAssessmentGuidance:
      'Must include a specific overview summarizing the main trends (e.g. a sharp decline in the proportion spent on food from 35% to ~17%, contrasted with major increases in leisure, housing, and transport, while household goods remained unchanged). Generic overviews like "spending changed" limit Task Achievement.',
    modelResponse: `The horizontal bar chart compares the proportion of weekly household income spent across eight categories by families in one country in 1968 and 2018.

Overall, spending patterns shifted markedly over the 50-year period: the share of income devoted to food fell by more than half, whereas expenditure on leisure, housing, and transport increased substantially. Household goods was the only category that remained unchanged.

In 1968, food dominated family budgets at 35% of weekly income—more than triple the next largest categories, housing and clothing and footwear, at 10% each. By 2018, however, food spending had dropped sharply to around 17%. Similarly, the shares spent on clothing and footwear and on personal goods each halved, falling from 10% to 5% and from 8% to 4% respectively, while fuel and power edged down from roughly 6% to 4%.

In contrast, leisure experienced the largest growth, surging from about 9% in 1968 to 22% in 2018 to become the top expenditure item. Housing also nearly doubled from 10% to approximately 19%, and transport rose from 8% to 14%, while household goods held steady at 8%.`,
  },
  {
    title: 'Cambridge IELTS 17 Academic Writing Test 3 - Task 2: Professionals Working in Country of Training',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'discussion',
    prompt:
      'Some people believe that professionals, such as doctors and engineers, should be required to work in the country where they did their training. Others believe they should be free to work in another country if they wish.\n\nDiscuss both these views and give your own opinion.',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must discuss both views thoroughly (explicitly addressing the requirement to work in the country of training as well as freedom to work abroad) and present a clear personal opinion.',
    modelResponse: `Whether skilled professionals such as doctors and engineers should be obligated to remain in the country where they trained or be free to migrate for work is a widely debated issue. While requiring graduates to serve locally helps protect public investment, I believe professionals should ultimately have the freedom to work abroad, provided reasonable service agreements are respected.

On the one hand, there are strong arguments for requiring professionals to work in their country of training, at least for a set period. In many nations, higher education—particularly medical and engineering degrees—is heavily subsidised by taxpayers. When newly qualified specialists immediately emigrate for higher salaries, the home country suffers a "brain drain" and faces shortages in essential hospitals and infrastructure projects. Requiring a few years of domestic service ensures that local communities benefit from the skills they helped fund.

On the other hand, restricting where individuals can live and work infringes on personal liberty and career growth. Professionals often seek opportunities abroad to access advanced research facilities, gain international experience, or secure better living standards for their families. Moreover, global mobility benefits the wider world by allowing expertise to flow where it is needed most, and many expatriates send remittances home or eventually return with enhanced knowledge that strengthens their native industries.

In conclusion, although countries have a legitimate interest in retaining the talent they train, permanent restrictions are unfair and counterproductive. A balanced approach—such as a short, clearly defined domestic service period for state-funded graduates followed by complete freedom of movement—best serves both nations and individuals.`,
  },

  // TEST 4
  {
    title: 'Cambridge IELTS 17 Academic Writing Test 4 - Task 1: Shop Closures and Openings (2011–2018)',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The graph below shows the number of shops that closed and the number of new shops that opened in one country between 2011 and 2018.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794823057/C17-Writing_Test_4.png',
    ],
    teacherVisualDescription:
      'Line graph titled "Number of shop closures and openings 2011-2018" (y-axis 0 to 9,000; x-axis 2011 to 2018). Closures (solid line): ~6,400 in 2011, ~5,900 in 2012, peaking at ~7,200 in 2013, ~6,500 in 2014, plummeting to ~700 in 2015, rebounding to ~5,200 in 2016, ~5,000 in 2017, and ~5,200 in 2018. Openings (dashed line): peaking at ~8,500 in 2011, dropping sharply to ~3,900 in 2012, rising to ~5,000 in 2013 and ~6,200 in 2014, falling to ~4,000 in 2015 and 2016, ~4,200 in 2017, and declining to a low of ~3,000 in 2018.',
    teacherAssessmentGuidance:
      'Must report key peaks, troughs, and fluctuation periods for both lines (2011–2014 fluctuations, the dramatic 2015 drop in closures to ~700, and the 2016–2018 stability of closures around 5,000 while openings fell to 3,000 in 2018), supported by a clear comparative overview.',
    modelResponse: `The line graph illustrates trends in the number of shop closures and new shop openings in a single country from 2011 to 2018.

Overall, both figures declined over the seven-year period, though openings experienced a sharper overall drop. Aside from 2011 and 2015, shop closures consistently outnumbered new openings.

In 2011, approximately 8,500 new shops opened—the highest figure on the chart—compared with around 6,400 closures. However, openings plunged to just under 4,000 in 2012 before rebounding to about 6,200 in 2014. They then fell back to 4,000 in 2015, remained steady through 2017 at roughly 4,200, and dropped to a period low of 3,000 in 2018.

Shop closures fluctuated between 5,900 and a peak of 7,200 from 2011 to 2014. In 2015, closures plummeted dramatically to roughly 700, marking the only year after 2011 in which openings exceeded closures. The following year, closures surged back to over 5,000 and stayed relatively stable at around 5,000 to 5,200 until 2018.`,
  },
  {
    title: 'Cambridge IELTS 17 Academic Writing Test 4 - Task 2: Alternative Medicines vs Usual Doctors',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'opinion',
    prompt:
      'Nowadays, a growing number of people with health problems are trying alternative medicines and treatments instead of visiting their usual doctor.\n\nDo you think this is a positive or a negative development?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must take a clear position on whether using alternative medicines and treatments instead of visiting a conventional doctor is a positive or negative development, with well-developed reasons and examples.',
    modelResponse: `An increasing number of patients are turning to alternative remedies, such as herbal supplements, acupuncture, and homeopathy, rather than consulting conventional doctors. While some complementary therapies can help manage mild symptoms or stress, I believe relying on them instead of professional medical care is largely a negative development.

The primary concern with replacing conventional doctors is the lack of rigorous scientific evidence and regulation behind many alternative treatments. Modern medicine relies on clinical trials to verify both effectiveness and safety, whereas unregulated herbal products or unverified therapies may offer no real cure and can even trigger dangerous side effects or allergic reactions. Even worse, patients with serious conditions such as infections or early-stage cancers risk delaying vital diagnoses and life-saving interventions if they avoid qualified physicians.

Admittedly, alternative treatments appeal to people for understandable reasons. Some patients feel conventional appointments are rushed and prefer the holistic, personalised attention offered by alternative practitioners, while others seek natural options to avoid the cost or side effects of prescription drugs. For minor issues like muscle tension or mild anxiety, therapies such as massage or mindfulness can indeed provide comfort alongside standard care.

In conclusion, although certain alternative therapies can play a supportive role in wellbeing, using them as a substitute for a qualified doctor poses serious health risks. For safe and effective treatment, evidence-based medical advice should remain the first priority.`,
  },
];

export async function ingestCambridge17WritingTests(): Promise<{
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

  for (const item of CAMBRIDGE_17_WRITING_TASKS) {
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
