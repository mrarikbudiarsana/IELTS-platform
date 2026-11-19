import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import { CambridgeWritingTaskSeed } from './ingestCambridge16WritingTests';

export const CAMBRIDGE_19_WRITING_TASKS: CambridgeWritingTaskSeed[] = [
  // TEST 1
  {
    title: 'Cambridge IELTS 19 Academic Writing Test 1 - Task 1: Social Centre Activities in Melbourne',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The graph below gives information on the numbers of participants for different activities at one social centre in Melbourne, Australia for the period 2000 to 2020.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1795089968/C19_Writing_Test_1.png',
    ],
    teacherVisualDescription:
      'Line graph titled "Number of participants, by activity 2000–2020" (y-axis: Number of participants, 0 to 70; x-axis: Year 2000, 2005, 2010, 2015, 2020). Five activities: Film club (solid line, open circles): ~64 (2000), ~62 (2005), 60 (2010), ~64 (2015), ~66 (2020) — consistently highest throughout. Martial arts (dashed line, open triangles): ~36 (2000), ~32 (2005), ~38 (2010), ~34 (2015), ~36 (2020) — fluctuates narrowly between ~32 and ~38. Amateur dramatics (dotted line, solid diamonds): ~26 (2000), ~28 (2005), 20 (2010), ~14 (2015), ~6 (2020) — rises slightly to 2005 then declines steadily to the lowest figure by 2020. Table tennis (dash-dot line, open squares): ~16 (2000), 20 (2005), 20 (2010), ~36 (2015), ~54 (2020) — plateaus at 20 from 2005–2010 then surges dramatically to second place in 2020. Musical performances (grey solid line, X): 0 (2000), 0 (2005), ~12 (2010), ~16 (2015), ~18 (2020) — introduced after 2005 and rises steadily.',
    teacherAssessmentGuidance:
      'Candidate must include a clear overview summarizing the main trends (Film club remained most popular and stable; Martial arts fluctuated steadily; Table tennis and Musical performances grew significantly, especially Table tennis after 2010; Amateur dramatics declined steadily after 2005), and support comparisons with accurate figures.',
    modelResponse: `The line graph illustrates the number of people taking part in five different activities at a social centre in Melbourne, Australia, between 2000 and 2020.

Overall, the film club consistently attracted the highest number of participants throughout the two decades, while martial arts remained relatively stable. By contrast, table tennis and musical performances grew substantially in popularity, whereas amateur dramatics experienced a steady decline after 2005.

In 2000, the film club had roughly 64 participants, dipping slightly to 60 in 2010 before climbing to around 66 by 2020. Martial arts fluctuated within a narrow range of about 32 to 38 members, finishing in 2020 at approximately 36, the same level as in 2000.

Meanwhile, table tennis rose modestly from around 16 participants in 2000 to 20 in 2005, remained plateaued until 2010, and then surged dramatically to roughly 54 in 2020, overtaking martial arts to become the second most popular activity. Musical performances had no participants until after 2005, when numbers climbed to about 12 in 2010 and reached around 18 by 2020. Conversely, amateur dramatics peaked at roughly 28 in 2005 before falling steadily to just 6 participants in 2020.`,
  },
  {
    title: 'Cambridge IELTS 19 Academic Writing Test 1 - Task 2: Competition vs Cooperation',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'discussion',
    prompt:
      'Some people think that competition at work, at school and in daily life is a good thing. Others believe that we should try to cooperate more, rather than competing against each other.\n\nDiscuss both these views and give your own opinion.',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Candidate must discuss both views (benefits of competition vs benefits of cooperation across work, school, and daily life) and give a clear personal opinion supported by reasons and relevant examples.',
    modelResponse: `Whether society functions better through competition or cooperation is an ongoing debate across education, the workplace, and everyday life. While healthy rivalry can drive ambition and excellence, I believe that prioritising cooperation ultimately produces stronger, more sustainable outcomes for both individuals and communities.

On the one hand, proponents of competition argue that it motivates people to perform at their best. In schools, academic rankings and sports tournaments encourage students to work diligently and discover their strengths. Similarly, in the workplace, competing for promotions or market share stimulates innovation and efficiency, as employees and companies strive to outperform rivals. Without some element of competition, standards might stagnate and individuals could become complacent.

On the other hand, excessive focus on beating others often creates unnecessary stress and undermines collective progress. Modern workplaces rely heavily on teamwork; for instance, developing software or delivering healthcare requires specialists to share knowledge openly rather than hoard it for personal advantage. In classrooms, collaborative projects teach students empathy, communication, and problem-solving skills that solitary competition cannot foster. Even in daily life, cooperative neighbourhoods and community initiatives build trust and social cohesion far more effectively than constant rivalry.

In my view, although mild competition can be a useful spark for personal improvement, cooperation should be the guiding principle in most areas of life. When people work together towards shared goals, they achieve complex results that no single competitor could accomplish alone, while maintaining healthier relationships and greater wellbeing.`,
  },

  // TEST 2
  {
    title: 'Cambridge IELTS 19 Academic Writing Test 2 - Task 1: Porth Harbour (2000 vs Today)',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'map',
    prompt:
      'The plans below show a harbour in 2000 and how it looks today.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1795089968/C19_Writing_Test_2.png',
    ],
    teacherVisualDescription:
      'Two maps: "Porth Harbour (in 2000)" and "Porth Harbour (today)" with compass rose (N/S/E/W) at top left. West side along Main road: in 2000, Showers & toilets above a Car park (NW) and a second Car park (SW); today, an additional Showers & toilets is built between the two car parks. Harbour water (west): in 2000, Marina (private yachts) is in NW and Fishing boats in SW; today, they have swapped places (Fishing boats in NW, Marina in SW). North-east: Public beach remains unchanged. Central-north dock: in 2000, one dock with two piers and one Passenger ferries berth; today, a second Passenger ferries dock/pier has been added immediately to the left of the existing one. South shore along the Road: Cafés & shops have been added to the left of the Lifeboat station. South-east headland: disused Castle (2000) has been demolished and replaced by a Hotel today, and the adjacent south-east Public beach is now a Private beach (for the hotel).',
    teacherAssessmentGuidance:
      'Candidate must provide an overview summarizing the main changes (modernisation and tourism-focused redevelopment: new hotel replacing disused castle with private beach, new cafés & shops, extra showers & toilets, expanded passenger ferry capacity, and swapped positions of the marina and fishing boats) and accurately report spatial details using compass directions.',
    modelResponse: `The two maps compare the layout of Porth Harbour in 2000 with its redesigned appearance today.

Overall, the harbour has undergone significant redevelopment aimed at expanding visitor facilities and tourism, including the addition of a new hotel, cafés and shops, extra showers and toilets, and greater passenger ferry capacity, while the marina and fishing boats have swapped locations.

Along the western edge beside the main road, the original car parks in the north-west and south-west and the north-western showers and toilets remain unchanged, but a second showers and toilets block has been constructed between the two car parks. In the adjacent water, the marina for private yachts and the fishing boats area have exchanged places, with fishing boats now moored in the north-west and private yachts moved to the south-west.

On the eastern side, the north-eastern public beach and the lifeboat station along the southern road have been retained, though cafés and shops have been built immediately to the west of the lifeboat station. Furthermore, an extra pier for passenger ferries has been added just to the left of the existing dock. Finally, in the south-east, the disused castle has been demolished to make way for a new hotel, and the nearby beach has become a private beach reserved for hotel guests.`,
  },
  {
    title: 'Cambridge IELTS 19 Academic Writing Test 2 - Task 2: Shorter Working Week and Longer Weekend',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'opinion',
    prompt:
      'The working week should be shorter and workers should have a longer weekend.\n\nDo you agree or disagree?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Candidate must take a clear position (agree, disagree, or partially agree) on whether the working week should be shorter with a longer weekend, and support it with well-developed arguments (e.g. productivity, work-life balance, mental health vs economic output, service continuity).',
    modelResponse: `In recent years, trials of four-day working weeks have prompted lively debate about whether employees should work fewer days and enjoy longer weekends. I largely agree that shortening the working week brings substantial benefits for both workers and employers, provided it is implemented flexibly across different industries.

The primary argument for a longer weekend is improved employee wellbeing and productivity. Working five consecutive days often leaves little time for rest, family responsibilities, or personal errands, leading to chronic fatigue and burnout. When workers have a three-day weekend, they return to their jobs more refreshed and focused. Indeed, several recent trials in Europe and Asia have demonstrated that reducing working hours does not necessarily lower output; instead, employees waste less time in unnecessary meetings and complete tasks more efficiently within a four-day schedule.

In addition, a shorter working week can stimulate the wider economy and support social cohesion. With an extra day of leisure, people are more likely to spend money on tourism, dining, sports, and cultural activities, boosting local businesses. Parents also gain valuable time to care for children or elderly relatives, reducing pressure on public support services.

However, a one-size-fits-all reduction is impractical for certain essential sectors such as healthcare, emergency services, and hospitality, where continuous staffing is required. In these fields, employers would need to hire additional staff or use staggered shifts rather than simply closing for three days.

In conclusion, I strongly support moving towards a shorter working week and longer weekend where feasible, as the gains in mental health, work-life balance, and efficiency outweigh the logistical adjustments required.`,
  },

  // TEST 3
  {
    title: 'Cambridge IELTS 19 Academic Writing Test 3 - Task 1: Biofuel Production (Ethanol)',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'process',
    prompt:
      'The diagram below shows how a biofuel called ethanol is produced.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1795089968/C19_Writing_Test_3.png',
    ],
    teacherVisualDescription:
      'Circular process diagram titled "Biofuel production: how ethanol is made". 1. Plants and trees grow using Energy (sunlight + carbon dioxide). 2. Harvesting: Mature plants are harvested by a tractor/harvester. 3. Pre-processing: Harvested material goes into a machine to be broken down into Cellulose. 4. Processing: Cellulose is taken to a factory/laboratory for chemical processing into Sugars. 5. Microbes added: Microbes are added to the sugars to produce Ethanol. 6. Transportation fuel: Ethanol powers cars, trucks, and airplanes. 7. Carbon Dioxide cycle: Vehicles emit Carbon Dioxide, which is absorbed back into the atmosphere by growing plants and trees, repeating the cycle.',
    teacherAssessmentGuidance:
      'Candidate must include an overview summarizing the main stages of the cyclical process (growing and harvesting plant material, chemical/biological processing into ethanol, using it for transport, and carbon dioxide returning to fuel new plant growth) and accurately describe each step in logical sequence using passive voice and process linkers.',
    modelResponse: `The diagram illustrates the cyclical process by which the biofuel ethanol is manufactured and used.

Overall, this renewable cycle consists of three main stages: growing and harvesting plant matter, converting it chemically and biologically into ethanol, and using the resulting fuel for transport, which releases carbon dioxide back into the atmosphere to sustain new plant growth.

At the beginning of the cycle, trees and plants grow by absorbing energy from sunlight and carbon dioxide from the air. Once mature, they are harvested using agricultural machinery and transported to a pre-processing facility, where they are shredded into cellulose.

Next, the cellulose undergoes chemical processing in a factory to extract sugars. Microbes are then added to these sugars, converting them into liquid ethanol. In the final stage, the ethanol is used as fuel for various forms of transport, including cars, trucks, and aeroplanes. As these vehicles operate, they emit carbon dioxide into the atmosphere, which is subsequently reabsorbed by growing plants and trees, allowing the cycle to begin again.`,
  },
  {
    title: 'Cambridge IELTS 19 Academic Writing Test 3 - Task 2: Importance of Saving Money',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'opinion',
    prompt:
      'It is important for everyone, including young people, to save money for their future.\n\nTo what extent do you agree or disagree with this statement?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Candidate must clearly state the extent to which they agree or disagree that everyone, including young people, should save money for the future, addressing both general financial security/emergencies and the specific circumstances of young people.',
    modelResponse: `Financial planning is widely regarded as a cornerstone of personal stability, yet opinions differ on how early in life individuals should prioritise saving. I strongly agree that setting money aside for the future is essential for people of all ages, including young adults, although the amount saved must realistically reflect a person's income and stage of life.

For individuals in general, maintaining savings provides vital protection against unexpected events. Job loss, sudden medical expenses, or urgent home repairs can strike at any moment, and having an emergency fund prevents people from falling into high-interest debt. Furthermore, as life expectancy rises and state pensions face growing strain, personal savings and investments are increasingly necessary to ensure a comfortable retirement.

Developing this habit early is especially valuable for young people. Even modest sums saved during one's twenties benefit enormously from compound interest over several decades, reducing financial pressure later in life. Moreover, young adults who learn to budget and live slightly below their means are better prepared to achieve major milestones, such as funding further education, starting a business, or placing a deposit on a home, without relying solely on loans.

That said, saving should not come at the expense of basic necessities or worthwhile personal development. Low-income earners and students may struggle to save substantial amounts, and spending money on education, health, or meaningful life experiences can yield long-term rewards of its own.

In conclusion, while financial flexibility is important when incomes are limited, I firmly believe that cultivating the habit of saving from a young age is crucial for long-term security and independence.`,
  },

  // TEST 4
  {
    title: 'Cambridge IELTS 19 Academic Writing Test 4 - Task 1: Dance Classes in Australia',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The charts below give information on the location and types of dance classes young people in a town in Australia are currently attending.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1795089968/C19_Writing_Test_4.png',
    ],
    teacherVisualDescription:
      'Two charts: 1. Pie chart "Location of dance classes": Private studios 48%; School halls (after-school) 24%; Community halls & other 18%; College-based studios 10%. 2. Horizontal grouped bar chart "Types of dance classes (by age group)" (x-axis: Number of students 0 to 700; Under 11 vs 11–16): Ballet (Under 11: 600, 11–16: 300); Tap (Under 11: ~450, 11–16: ~420); Modern (Under 11: 300, 11–16: ~520).',
    teacherAssessmentGuidance:
      'Candidate must summarise key features from BOTH charts (Private studios account for nearly half of all locations while college-based studios are least common at 10%; Ballet is overwhelmingly favoured by under-11s at 600 vs 300 for 11–16s, Modern is most popular among 11–16s at ~520 vs 300 for under-11s, and Tap has similar participation in both age groups at ~450 and ~420).',
    modelResponse: `The pie chart illustrates the venues where young people attend dance classes in an Australian town, while the bar chart compares participation across three dance styles by age group.

Overall, nearly half of all dance classes are held in private studios, whereas college-based studios are the least common venue. In terms of dance styles, ballet is by far the most popular choice among children under 11, while modern dance attracts the largest number of 11-to-16-year-olds.

Looking at locations, private studios account for 48% of all classes, exactly double the proportion held in after-school halls (24%). Community halls and other venues make up 18%, while only 10% of classes take place in college-based studios.

Turning to dance types, ballet has 600 students aged under 11—the highest figure on the bar chart—compared with just 300 students in the 11–16 age bracket. Modern dance shows the opposite pattern, with roughly 520 older students attending compared to 300 under-11s. By contrast, tap classes attract fairly balanced numbers across both age groups, at approximately 450 younger students and 420 older students.`,
  },
  {
    title: 'Cambridge IELTS 19 Academic Writing Test 4 - Task 2: Global Food in Supermarkets',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'opinion',
    prompt:
      'In many countries nowadays, consumers can go to a supermarket and buy food produced all over the world.\n\nDo you think this is a positive or negative development?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Candidate must take a clear position on whether the global availability of food in supermarkets is a positive or negative development, weighing factors such as year-round variety, dietary choice, and economic trade against food miles, environmental impact, and local farming.',
    modelResponse: `Globalisation and modern supply chains have made it commonplace for supermarkets to stock ingredients and packaged foods imported from every continent. While this convenience carries undeniable environmental costs, I believe that the availability of international food is, on balance, a positive development—provided consumers remain mindful of sustainability.

First and foremost, global food trade enriches diets and improves nutrition throughout the year. In countries with harsh winters, importing fresh fruit and vegetables ensures that families have continuous access to essential vitamins rather than relying on a narrow range of seasonal crops. Moreover, exposure to international cuisines—whether Italian olive oil, Japanese condiments, or tropical fruits—broadens cultural understanding and allows immigrant communities to maintain their culinary traditions. Economically, exporting agricultural produce also provides vital income for farmers in developing nations.

Nevertheless, there are legitimate concerns regarding the environmental and local economic impact of long-distance food transport. Shipping perishable goods by air or refrigerated cargo generates significant carbon emissions, and cheap imports can sometimes undercut domestic growers. However, these drawbacks can be mitigated through clearer labelling, fairer trade practices, and choosing sea freight over air transport, rather than eliminating imported foods altogether.

In conclusion, although consumers and policymakers should encourage local sourcing where practical to reduce carbon footprints, the ability to buy food from around the world brings substantial benefits in nutrition, cultural exchange, and global trade.`,
  },
];

export async function ingestCambridge19WritingTests(authorId?: string) {
  const now = new Date().toISOString();
  let createdById = authorId;

  if (!createdById) {
    const adminUser = (await db
      .prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1")
      .get()) as { id: string } | undefined;
    const anyUser =
      adminUser || ((await db.prepare('SELECT id FROM users LIMIT 1').get()) as { id: string } | undefined);
    if (!anyUser) {
      throw new Error('No user found in database to assign as created_by_id.');
    }
    createdById = anyUser.id;
  }

  let created = 0;
  let updated = 0;
  const taskIds: string[] = [];

  for (const item of CAMBRIDGE_19_WRITING_TASKS) {
    const existing = (await db
      .prepare('SELECT id FROM writing_tasks WHERE title = ?')
      .get(item.title)) as { id: string } | undefined;

    if (existing) {
      await db
        .prepare(
          `UPDATE writing_tasks
           SET task_type = ?,
               task_number = ?,
               test_type = ?,
               status = 'published',
               is_free_tier = 1,
               updated_at = ?
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
