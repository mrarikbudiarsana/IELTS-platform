import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import {
  WritingTaskNumber,
  WritingTaskSubtype,
  WritingTaskType,
  WritingTestType,
} from '../shared/types';

export interface CambridgeWritingTaskSeed {
  title: string;
  taskType: WritingTaskType;
  taskNumber: WritingTaskNumber;
  testType: WritingTestType;
  subtype: WritingTaskSubtype;
  prompt: string;
  instructions: string;
  minWords: number;
  suggestedTimeMinutes: number;
  images?: string[];
  teacherVisualDescription?: string;
  teacherAssessmentGuidance: string;
  modelResponse: string;
}

export const CAMBRIDGE_16_WRITING_TASKS: CambridgeWritingTaskSeed[] = [
  // TEST 1
  {
    title: 'Cambridge IELTS 16 Academic Writing Test 1 - Task 1: Electrical Appliances and Housework',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The charts below show the changes in ownership of electrical appliances and amount of time spent doing housework in households in one country between 1920 and 2019.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794818327/Cambridge_16_Academic_-_Writing_test_1.png',
    ],
    teacherVisualDescription:
      'Two line graphs covering 1920 to 2019 (x-axis ticks: 1920, 1940, 1960, 1980, 2000, 2019). Graph 1 ("Percentage of households with electrical appliances (1920-2019)"): Refrigerator starts near 0% (~3%) in 1920, rises steeply to ~55% in 1940, 90% in 1960, and reaches 100% by 1980, remaining at 100% in 2000 and 2019. Vacuum cleaner starts at 30% in 1920, rises steadily to 50% in 1940, 70% in 1960, 90% in 1980, and reaches 100% in 2000 and 2019. Washing machine starts highest at 40% in 1920, rises to 60% in 1940 and 70% in 1960, dips slightly to ~65% in 1980, then rises to 70% in 2000 and ~75% in 2019. Graph 2 ("Number of hours of housework per week, per household (1920-2019)"): Starts at 50 hours per week in 1920, drops to 35 hours in 1940, falls sharply to 20 hours in 1960, declines more slowly to ~15 hours in 1980 and 2000, and reaches ~12 hours per week in 2019.',
    teacherAssessmentGuidance:
      'Candidate must report key figures and trends from BOTH charts: rising ownership of all three appliances (refrigerators and vacuum cleaners reaching 100%, washing machines rising from 40% to ~75% with a dip in 1980) alongside the sharp fall in weekly housework hours from 50 hours in 1920 to ~12 hours in 2019. Inaccurate data (e.g. claiming washing machines only rose by 15%) or omitting detail from the second chart limits Task Achievement.',
    modelResponse: `The two line graphs illustrate changes in the proportion of households owning three electrical appliances and the average weekly hours spent on housework in a single country between 1920 and 2019.

Overall, the ownership of all three appliances increased substantially over the century, with refrigerators and vacuum cleaners eventually reaching universal adoption. Over the same period, the amount of time households devoted to housework declined dramatically.

In 1920, washing machines were the most common appliance, owned by 40% of households, compared with 30% for vacuum cleaners and almost 0% for refrigerators. Refrigerator ownership rose most rapidly, climbing to 90% by 1960 and 100% from 1980 onwards. Vacuum cleaner ownership followed a similar upward trajectory, increasing steadily by 20 percentage points every two decades to reach 100% in 2000. By contrast, washing machine ownership grew more modestly, reaching 70% in 1960, dipping slightly to around 65% in 1980, and finishing at approximately 75% in 2019.

Meanwhile, the average time spent on housework fell sharply from 50 hours per week in 1920 to 20 hours in 1960. After 1960, the decline slowed, levelling off at around 15 hours between 1980 and 2000 before edging down to roughly 12 hours per week in 2019.`,
  },
  {
    title: 'Cambridge IELTS 16 Academic Writing Test 1 - Task 2: History of Houses and Buildings',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'two_part',
    prompt:
      'In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in.\n\nWhat are the reasons for this?\n\nHow can people research this?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must directly address BOTH questions specifically about the history of the house or building people live in (not general history or hometowns, which limits Task Response). Explain clear reasons for this growing interest and practical methods for researching a property’s history.',
    modelResponse: `In recent years, an increasing number of homeowners and tenants have grown curious about the origins and past occupants of the houses or buildings they inhabit. This trend is driven by both emotional and practical factors, and modern technology as well as public records make such research more accessible than ever.

One primary reason for this growing interest is a desire for personal connection and identity. Knowing who designed a building, when it was constructed, and what kind of families lived there previously can transform an ordinary dwelling into a place with a meaningful story. In addition, practical considerations often motivate residents to investigate their property's past. Homeowners planning renovations may need to understand original architectural features, building materials, or structural modifications, while others hope to discover whether historical significance could increase their property's market value.

Fortunately, there are several reliable ways to research a building's history. Firstly, people can consult official local archives, land registries, and municipal planning offices, which frequently hold deeds, architectural blueprints, and census records listing former residents. Secondly, online databases and digital newspaper archives allow individuals to search an address from home and uncover past sales, local news stories, or historical photographs. Finally, speaking with long-standing neighbours or local historical societies can provide valuable first-hand memories and context that official documents may not record.

In conclusion, people investigate the history of their homes out of curiosity, a sense of belonging, and practical need, and they can do so effectively through a combination of public records, online archives, and local community knowledge.`,
  },

  // TEST 2
  {
    title: 'Cambridge IELTS 16 Academic Writing Test 2 - Task 1: Sugar Production from Sugar Cane',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'process',
    prompt:
      'The diagram below shows the manufacturing process for making sugar from sugar cane.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794818327/Cambridge_16_Academic_-_Writing_test_2.png',
    ],
    teacherVisualDescription:
      'Linear process diagram titled "How sugar is produced from sugar cane" showing 7 numbered steps: (1) Growing: sugar canes are grown for 12–18 months. (2) Harvesting: sugar cane is harvested either by a harvesting machine or manually by a worker. (3) Crushing: harvested sugar canes are fed into a crushing machine to extract juice. (4) Purifying juice: the juice is filtered through a limestone filter. (5) Evaporator: the purified juice is heated in an evaporator so that it becomes syrup. (6) Centrifuge: a centrifuge separates sugar crystals from the syrup. (7) Drying and cooling: the crystals are dried and cooled in a cylindrical container to produce finished sugar.',
    teacherAssessmentGuidance:
      'Must include a clear overview summarizing the 7-stage process and grouping macro-stages (e.g. agricultural cultivation/harvesting, juice extraction/purification, heating/separation, and drying/cooling). Accurate passive voice forms (e.g. "is harvested", "is crushed", "is heated") are essential.',
    modelResponse: `The diagram illustrates the seven-stage process by which sugar is manufactured from sugar cane.

Overall, sugar production is a linear process that begins with the long-term cultivation and harvesting of sugar cane, followed by mechanical crushing, chemical purification, heating, centrifugal separation, and finally drying and cooling to yield ready-to-use sugar.

In the first stage, sugar canes are grown for a period of 12 to 18 months until they reach maturity. Once ready, they are harvested in one of two ways: either mechanically using specialised harvesting vehicles or manually by farm workers. In the third step, the harvested canes are fed into a crushing machine, which presses them to extract raw sugar cane juice.

Next, this juice is purified by passing it through a limestone filter. The filtered liquid is then transferred to an evaporator, where it is heated until the water evaporates and the juice thickens into syrup. Subsequently, the syrup enters a centrifuge, which spins at high speed to separate the solid sugar crystals from the remaining liquid. In the final stage, these crystals are dried and cooled in a large drum to produce finished sugar.`,
  },
  {
    title: 'Cambridge IELTS 16 Academic Writing Test 2 - Task 2: Advertising New Products',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'two_part',
    prompt:
      'In their advertising, businesses nowadays usually emphasise that their products are new in some way.\n\nWhy is this? Do you think it is a positive or negative development?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must focus specifically on businesses highlighting "newness" in their advertising (not general product quality), explain why companies adopt this strategy, and give a clear judgement on whether this is a positive or negative development.',
    modelResponse: `In modern marketing, companies frequently highlight that their products are "new," "improved," or "next-generation" in order to capture consumer attention. Businesses rely on this strategy to stimulate demand in saturated markets, and although it can encourage innovation, I believe it is largely a negative development due to its psychological and environmental consequences.

Companies emphasise novelty primarily because consumers are naturally drawn to progress and upgrades. In highly competitive industries such as smartphones, cosmetics, and household appliances, most buyers already own a functional version of the product. By framing each release as a major breakthrough—even when the changes are minor—businesses create a sense of urgency and persuade customers that their existing items are outdated. This psychological trigger helps firms maintain steady sales and protect their market share.

However, this constant focus on newness has significant drawbacks. First, it fuels unnecessary consumerism and financial pressure, as people feel compelled to replace perfectly usable goods simply to own the latest model. Second, accelerated replacement cycles generate vast amounts of waste and increase carbon emissions from manufacturing and shipping, placing a heavy burden on the environment. While genuine technological or medical innovations clearly benefit society, marketing cosmetic tweaks as revolutionary improvements misleads consumers rather than serving them.

In conclusion, businesses promote novelty in advertising to stand out and drive repeat purchases. Although it occasionally reflects meaningful innovation, I view this trend as predominantly negative because it encourages wasteful consumption.`,
  },

  // TEST 3
  {
    title: 'Cambridge IELTS 16 Academic Writing Test 3 - Task 1: Southwest Airport Redevelopment',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'map',
    prompt:
      'The plans below show the site of an airport now and how it will look after redevelopment next year.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794818327/Cambridge_16_Academic_-_Writing_test_3.png',
    ],
    teacherVisualDescription:
      'Two site plans of SOUTHWEST AIRPORT labelled "NOW" and "AFTER DEVELOPMENT" (next year). NOW: At the bottom, Departures (left) has one entrance, Check-in (C) on the far left, a Café (cup icon) on the right side of the hall, leading up through Security / Passport Control to a rectangular concourse with 8 gates (1-4 on the left, 5-8 on the right) and two Walkways in the middle. Arrivals (right) has one entrance and Passport Control / Customs with no extra facilities. AFTER DEVELOPMENT: The main building is wider with two entrances each for Departures and Arrivals. In Departures, Check-in (C) moves to the right, a new Bag drop (B) occupies the old Check-in space on the left, and the Café moves to the bottom-left corner. Beyond Security / Passport Control, a new "SHOPS" section is added on the left. In Arrivals, a Café, an ATM ($), and a Car hire (car icon) are added on the right. The gate concourse expands from 8 to 18 gates in a Y-shaped layout (gates 1-8 on the left branch, 9-12 at the top/centre-right, 13-18 on the right branch), and the Walkways are replaced by a Sky train.',
    teacherAssessmentGuidance:
      'Must use future verb forms (e.g. "will be replaced", "will feature", "is going to expand") because redevelopment occurs next year—using past tense throughout is a major error. Must include an overview highlighting the major expansion in capacity (8 to 18 gates), the Y-shaped concourse with a sky train, and expanded passenger facilities.',
    modelResponse: `The two plans compare the current layout of Southwest Airport with its proposed design following redevelopment next year.

Overall, the airport will undergo substantial expansion, more than doubling its number of boarding gates and introducing a Y-shaped concourse served by a sky train, alongside upgraded retail and passenger services in both departures and arrivals.

Currently, the departures area has a single entrance with check-in on the left and a café on the right before security and passport control. After redevelopment, departures will gain a second entrance, the check-in desks will be relocated to the right to make way for a bag drop on the left, and the café will move to the bottom-left corner. Furthermore, a new shopping area will be constructed just past security and passport control. On the arrivals side, which presently contains only passport control and customs, the future terminal will add a second entrance as well as a café, an ATM, and a car hire desk.

Beyond the main terminal, the existing rectangular concourse with 8 gates and two walkways will be replaced by a much larger Y-shaped structure housing 18 gates. Finally, the walkways will be removed and a new sky train will be installed to transport passengers between the gates.`,
  },
  {
    title: 'Cambridge IELTS 16 Academic Writing Test 3 - Task 2: Increasing Price of Sugary Products',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'opinion',
    prompt:
      'Many manufactured food and drink products contain high levels of sugar, which causes many health problems. Sugary products should be made more expensive to encourage people to consume less sugar.\n\nDo you agree or disagree?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Candidate must present a clear position on whether raising the price of sugary products is an effective or desirable measure to curb sugar consumption and reduce health problems, supported with relevant reasoning and examples.',
    modelResponse: `Excessive sugar consumption in processed food and beverages is a major contributor to obesity, diabetes, and dental decay. While some argue that raising the price of sugary products is the best way to curb intake, I only partially agree, as price increases alone are unlikely to change habits without better education and clearer nutritional labelling.

On the one hand, making sugary items more expensive—for instance through a sugar tax on soft drinks—can create an immediate financial incentive for consumers to choose healthier alternatives. Evidence from several countries shows that higher retail prices encourage price-sensitive buyers, particularly young people, to cut back on sweetened beverages. Moreover, such taxes can pressure manufacturers to reformulate their recipes with less sugar in order to remain competitive, thereby improving public health without requiring conscious effort from every shopper.

On the other hand, relying solely on higher prices has notable limitations. First, sugar is added to many everyday staples such as bread, sauces, and breakfast cereals, so raising prices across the board could unfairly burden low-income households. Second, many consumers are unaware of how much hidden sugar they eat because ingredient lists and nutrition panels can be confusing. Without public health campaigns and clearer front-of-pack warnings, people may simply pay more for the same products rather than switching to healthier options.

In conclusion, while increasing the price of sugary food and drink can help reduce consumption and encourage industry reformulation, it should be paired with public education and transparent labelling to achieve lasting health improvements.`,
  },

  // TEST 4
  {
    title: 'Cambridge IELTS 16 Academic Writing Test 4 - Task 1: Recycling Plastic Bottles',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'process',
    prompt:
      'The diagram below shows the process for recycling plastic bottles.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    images: [
      'https://res.cloudinary.com/pkwpxicd/image/upload/v1794818327/Cambridge_16_Academic_-_Writing_test_4.png',
    ],
    teacherVisualDescription:
      'Cyclical 9-step process diagram titled "How plastic bottles are recycled": (1) A person places used plastic bottles into a recycling bin. (2) A recycling truck collects the bottles. (3) At a recycling centre ("Recycling centre: Sorting"), a worker sorts bottles on a conveyor belt, keeping recyclable ones (tick) and discarding non-recyclable items (cross). (4) Sorted bottles are compressed into blocks ("Compressing into blocks"). (5) The blocks are crushed by toothed rollers ("Crushing") and then washed in a tank ("Washing"). (6) The washed plastic pieces are fed into a machine for "Producing plastic pellets". (7) The pellets are heated ("Heating pellets to form raw material"). (8) The resulting "Raw material" is stacked in bundles on pallets. (9) The raw material is used for "Producing end products" including new bottles, food containers, T-shirts, pens, and reusable bags, which return to step 1.',
    teacherAssessmentGuidance:
      'Must accurately report the 9-stage cyclical process with an overview summarizing the main phases (collection, sorting, processing into pellets and raw material, and manufacturing new products). Do NOT include irrelevant personal opinions or external commentary on government policy or global pollution.',
    modelResponse: `The diagram illustrates the nine-stage cyclical process by which used plastic bottles are recycled into new consumer goods.

Overall, plastic bottle recycling is a continuous loop consisting of four main phases: collection and sorting, mechanical crushing and washing, conversion into plastic pellets and raw material, and finally the manufacture of new end products.

In the initial stage, used plastic bottles are deposited into recycling bins and subsequently collected by specialised lorries. The collected waste is transported to a recycling centre, where workers manually sort the bottles on a conveyor belt to separate recyclable plastics from unsuitable items. Once sorted, the bottles are compressed into compact blocks.

In the next phase, these blocks are fed through a crushing machine and then thoroughly washed in a tank to remove impurities. The clean plastic fragments are processed into small plastic pellets, which are then heated to form raw material packed into large bundles. Finally, this raw material is used to manufacture a variety of end products—such as new bottles, food containers, T-shirts, pens, and reusable bags—which can eventually be placed back into recycling bins to restart the cycle.`,
  },
  {
    title: 'Cambridge IELTS 16 Academic Writing Test 4 - Task 2: Driverless Vehicles',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'advantages_disadvantages',
    prompt:
      'In the future all cars, buses and trucks will be driverless. The only people travelling inside these vehicles will be passengers.\n\nDo you think the advantages of driverless vehicles outweigh the disadvantages?',
    instructions:
      'Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'Must discuss both advantages and disadvantages of all cars, buses, and trucks becoming driverless, and reach a clear judgement on whether the advantages outweigh the disadvantages.',
    modelResponse: `Autonomous technology is advancing rapidly, and it is widely predicted that all cars, buses, and trucks will eventually operate without human drivers. Although this transition poses serious challenges for employment and cybersecurity, I believe that the long-term safety and efficiency benefits clearly outweigh the disadvantages.

On the negative side, the complete automation of road transport would cause widespread job losses. Millions of people worldwide rely on driving taxis, delivery vans, buses, and freight trucks for their livelihood, and many could struggle to retrain for other industries. Furthermore, driverless vehicles depend heavily on complex software and wireless networks, making them vulnerable to technical malfunctions or cyberattacks that could endanger passengers.

Nevertheless, the advantages of autonomous vehicles are transformative. Most importantly, eliminating human error—such as fatigue, distraction, and drunk driving—would dramatically reduce road accidents and fatalities. In addition, connected driverless vehicles could communicate with one another to maintain optimal speeds and distances, easing traffic congestion and cutting fuel consumption. For passengers, commuting time would become far more productive or relaxing, while elderly and disabled individuals who cannot drive would gain unprecedented independent mobility.

In conclusion, while the shift to fully autonomous transport will disrupt driving-related jobs and require strict digital security measures, the potential to save thousands of lives and create a cleaner, more efficient transport system means the advantages far outweigh the disadvantages.`,
  },
];

export async function ingestCambridge16WritingTests(): Promise<{
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

  for (const item of CAMBRIDGE_16_WRITING_TASKS) {
    const existing = (await db
      .prepare('SELECT id, current_version_number FROM writing_tasks WHERE title = ? LIMIT 1')
      .get(item.title)) as { id: string; current_version_number: number } | undefined;

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
