import '../server/legacySqliteEnvironment';
import { Client } from 'pg';
import fs from 'fs';
import path from 'path';
import { db } from '../server/db';

const envFile = fs.readFileSync(path.join(__dirname, '../.env.local'), 'utf8');
const env: Record<string, string> = {};
envFile.split('\n').forEach((line) => {
  const trimmed = line.trim();
  if (!trimmed || trimmed.startsWith('#')) return;
  const eqIdx = trimmed.indexOf('=');
  if (eqIdx !== -1) {
    env[trimmed.slice(0, eqIdx).trim()] = trimmed.slice(eqIdx + 1).trim();
  }
});

interface CalibrationSeed {
  id: string;
  source: 'official_ielts';
  taskType: 'academic_task_1' | 'task_2';
  taskNumber: 1 | 2;
  subtype: string;
  title: string;
  prompt: string;
  visualGroundTruth?: string;
  candidateScript: string;
  overallBand: number;
  examinerComment: string;
  keyTakeaways: string[];
}

const C18_CALIBRATION_SAMPLES: CalibrationSeed[] = [
  {
    id: 'cambridge-18-t1-w1-band60',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Cambridge 18 Test 1 Task 1 (Urban Population in 4 Asian Countries) - Band 6.0',
    prompt:
      'The graph below gives information about the percentage of the population in four Asian countries living in cities from 1970 to 2020, with predictions for 2030 and 2040. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Malaysia 30% (1970) -> 76% (2020) -> 83% (2040); Philippines 31% (1970) -> 49% (1990) -> 43% (2010) -> 46% (2020) -> 56% (2040); Indonesia 14% (1970) -> 52% (2020) -> 64% (2040); Thailand 19% (1970) -> 30% (1990) -> 33% (2020) -> 49% (2040).',
    candidateScript: `The line graph illustrates the proportion of urban citizens in Philippines, Malaysia, Thailand and Indonesia between 1970 and 2020, with the expected population in 2030 and 2040.

Overall, it can be easily seen that all four countries has a dramatic rise in population, starting at the lowest point in 1970 and being projected to reach the peak in 2040.

Malaysia and Indonesia saw a slightly rise in population, respectively from 30 to about 45 and around 12 to over 20 percent from 1970 to 1990. After that, both countries has climbed rapidly until now before being predicted to continue increasing for the next 20 years.

After almost remaining in the 70s, Philippines percentage increased dramatically to reach about 47 percent on 1990 and dropped to 40% in 2010. Then, this country faced slightly rise in 2020. Meanwhile, Thailand reached approximate 30% in 1990 and saw not much changes until 2020. Both two countries are projected to increase in population in 2030 and 2040.`,
    overallBand: 6.0,
    examinerComment:
      'This response covers the requirements of the task. There is an overview in the second paragraph and key features are presented for each country, with main trends identified. Ideas are grouped together with a clear overall progression: countries with a similar trend are presented in the same paragraph, first Malaysia and Indonesia, then Thailand and the Philippines. There is some effective use of linkers [Overall | After that | Meanwhile] and other cohesive devices [respectively | this country], but a few errors remain [Both two]. Vocabulary includes a range, with some less common examples [proportion | expected population | dramatic rise | projected to reach the peak]. There are some errors [slightly / slight | almost remaining | approximate / approximately], which do not impede communication. The mix of grammatical structures is good, with some complex sentence forms [being predicted to continue increasing for the next 20 years]. Some errors remain, but they rarely reduce communication. To improve the Band Score for this response, there could be more detail on the similarity of the trends on the graph, more detail on data from 1990 onwards and fewer errors in spelling and grammar. However, this is a good response that does address the requirements of the task.',
    keyTakeaways: [
      'Logical grouping of countries by trend and clear overview achieve Band 6.0; lacking specific figures from 1990 onwards and minor word-form/grammar slips ("slightly rise", "Both two") prevent Band 7.',
    ],
  },
  {
    id: 'cambridge-18-t1-w2-band80',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'opinion',
    title: 'Cambridge 18 Test 1 Task 2 (Most Important Aim of Science) - Examiner Model (Band 8.0)',
    prompt:
      'The most important aim of science should be to improve people’s lives. To what extent do you agree or disagree with this statement?',
    candidateScript: `Scientific developments are occurring at a great rate but some of them do not seem to be of help to people. In fact, sometimes scientific innovations are regretted by those who invented them. This essay will argue that science should never harm people but scientists should aim to further their understanding as much as to improve people's lives.

On one hand, there is a strong argument that the public good should be the top priority for scientists. They are the ones who have the potential to make discoveries and invent things that can change the world. Electricity, modern medicine, telecommunications and the internet are just some of the scientific innovations that have changed lives for the better.

On the other hand, sometimes scientists do research just in the hope of adding to their knowledge. While they should make absolutely sure that their experiments do no harm, they may not know until they have finished how their findings will be used and whether they will improve people's lives. The scientist Nobel invented dynamite to help with mining, not knowing that it would one day be used in weapons, and the scientist who discovered the life-saving drug penicillin did so quite by chance.

Overall, it seems that science should improve the lives of people and that ought to be one of its aims. However, knowledge and discovery are aims in themselves and are just as important for scientists. Sometimes scientists do not know how their scientific breakthroughs will be used until their work is done.`,
    overallBand: 8.0,
    examinerComment:
      'This response presents a well-developed response to the question and concludes that the aim of scientific discoveries should be to improve people’s lives, but that the process often results in unexpected outcomes. The candidate agrees with but adds to the statement. This is acceptable in a ‘to what extent’ question, as the candidate is explaining the extent cannot always be predicted. The candidate presents the argument that the true aim of science is gaining new knowledge and discoveries. They agree that this should be to improve people’s lives but that the results can’t be predicted. The second paragraph gives examples of discoveries that have changed people’s lives for the better [Electricity, modern medicine, telecommunications and the internet]. To improve the response, this paragraph could be expanded so that the list of discoveries is fully aligned with the question. The third paragraph presents the other side, that scientists do not often know what they will find. Examples of two innovations are given [dynamite | penicillin] to support this point. Ideas are logically organised and paragraphs have clear central topics. Cohesive devices are used appropriately with some appropriate referencing [them | their | it], although linkers often appear at the start of the sentence, which can seem a little mechanical [On one hand | On the other hand | While | Overall | Sometimes]. In order to improve the overall rating, the second paragraph could be further extended and the use of cohesive devices could be less mechanical and not always at the start of each sentence. However, this is a strong, higher-level response to the task.',
    keyTakeaways: [
      'Strong higher-level examiner model: nuanced "to what extent" position with concrete historical examples (Nobel/dynamite, Fleming/penicillin); only slightly mechanical sentence-initial linkers and brief second-paragraph list keep it from Band 9.',
    ],
  },
  {
    id: 'cambridge-18-t2-w1-band55',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Cambridge 18 Test 2 Task 1 (US Households by Annual Income) - Band 5.5',
    prompt:
      'The chart below shows the number of households in the US by their annual income in 2007, 2011 and 2015. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'US households (millions): <$25k (~25, ~29, ~28); $25k-$49,999 (~27, ~30, ~29); $50k-$74,999 (~21 across all); $75k-$99,999 (~15, ~14, ~15); $100k+ (~29.5, ~28, ~33).',
    candidateScript: `The graph illustrates the data of different levels of annual wage of families in the united states in 2007, 2011 and 2015.

As far as the number of families whose annual income was less than $25,000, it began with around >5 million in 2007, then increased to approximately 27 million in 2011, but decreased by 2 million 4 years later. Similarly, those of families that earned $25,000 to $49,999 were about 25 million in 2007, after that it rose to nearly 30 million in 2011. Finally it decreased to around 27 million in 2015.

By contrast, the groups of families which have high income, including $75,000 to $99,999 and $100,000 or more, experienced a drop in 2011, but their data went up in 2015.

Interesting things could be seen in the group of middle income, the data remain the same in 2007, 2011 and 2015.`,
    overallBand: 5.5,
    examinerComment:
      'This response does present most of the data within the bar chart and the key features required. To improve the response, an overview of the information should be included, for example: Across the 8 years, households with incomes below $50,000 rose, then fell back slightly, households with incomes of over $75,000 fell slightly then increased and those with the mid-level incomes remained the same. The information is arranged coherently, starting with the details for the lower-income households, then the higher, then the mid-section. There are some effective cohesive devices [As far as | Similarly | By contrast]. The vocabulary is suitable for the task, but there is an error [>5 million / 25 million] which is not helpful when reporting the details. There is a mix of simple and complex structures, with sentences that contain multiple clauses. There are some examples of missing capitalisation [united states / United States] with some errors [remain / remained]. To improve the response, it is important to re-read to check for small errors with vocabulary and to include an overview or summary of the salient information.',
    keyTakeaways: [
      'Missing an overview of the salient trends and a factual slip (>5 million instead of 25 million) cap this otherwise coherent response at Band 5.5.',
    ],
  },
  {
    id: 'cambridge-18-t2-w2-band80',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'discussion',
    title: 'Cambridge 18 Test 2 Task 2 (University Subjects) - Examiner Model (Band 8.0)',
    prompt:
      'Some university students want to learn about other subjects in addition to their main subjects. Others believe it is more important to give all their time and attention to studying for a qualification. Discuss both these views and give your own opinion.',
    candidateScript: `Students attend university to improve their prospects and find suitable employment after graduation. For this reason, some feel that they should focus all their energy on their main subjects to gain a relevant qualification. Others want a more well-rounded education, so they try to learn about additional subjects.

It is perfectly reasonable for students to enter university with a strong sense of curiosity and a desire to learn as much as possible. Unfortunately, we tend to put subjects into artificial boxes, suggesting that business, art and science are not connected. If students become too focused on a single area, it may stifle their initial curiosity, limiting their potential. They could also graduate with a very narrow skill set that doesn't translate well to the current job market, which often favours those who have taken a multidisciplinary approach to their studies.

Despite this, caution is certainly needed. The more we learn about a subject, the more complex it becomes. Gaining an in-depth, specialist knowledge of a subject requires a certain level of focus and dedication over a long period. If we try to learn about too many things at once, our knowledge may lack the depth required to obtain a qualification. If they are not careful, young people could begin to lose interest in their main subjects, which would be detrimental to their studies.

While learning about other subjects is not necessarily a bad thing, I believe university students should ensure that their main subjects remain the priority so that they do not lose sight of their objective: gaining a qualification. Then they can calculate how much time, energy and headspace they have left for learning about other topics.`,
    overallBand: 8.0,
    examinerComment:
      'This response addresses both parts of the task and presents a clear opinion at the end. The second paragraph explains how the current university system is set up to [put subjects into artificial boxes] and how this narrow focus can disadvantage students. The third paragraph presents the benefits of [Gaining an in-depth, specialist knowledge] and the dangers of trying to include too much. Both sides of the question are addressed in well-developed paragraphs. To improve the response, it would be helpful to set out the opinion at the start, for added continuity of the position. Vocabulary is natural and sophisticated [stifle their initial curiosity | Gaining an in-depth, specialist knowledge | detrimental to their studies] without errors. Grammatical structures are wide-ranging, with a range of tenses and conditional [if] and modal [may | could | would | can] structures embedded in complex, flexible sentences. This is a high-level response which fully addresses the task.',
    keyTakeaways: [
      'High-level examiner model with error-free natural lexis ("stifle their initial curiosity") and wide-ranging complex grammar; stating the opinion in the introduction would make position continuity even stronger.',
    ],
  },
  {
    id: 'cambridge-18-t3-w1-band75',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'map',
    title: 'Cambridge 18 Test 3 Task 1 (Central Library Floor Plan) - Examiner Model (Band 7.5)',
    prompt:
      'The diagram below shows the floor plan of a public library 20 years ago and how it looks now. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Central Library 20 years ago vs today: central tables/chairs removed; reading room -> computer room; enquiry desk -> cafe; adult fiction moved right; reference books on left; info desk + self-service machines added; back-left enlarged for children fiction + storytelling sofas; back-right -> lecture room.',
    candidateScript: `The diagrams show Central Library before and after changes were made to its layout.

Clearly, the library has been updated to include dedicated spaces for events and now has an open space in the centre.

Twenty years ago, to the left of the entrance there was a reading room with newspapers and magazines and to the right there was an enquiry desk. Now there's a computer room on the left and a café where the information desk once was. Adult fiction has moved to the right-hand side of the room and all reference books are now on the left. There is a smaller information desk with self-service machines in what once was the adult non-fiction section.

There was a room at the back left-hand corner that had computer games, CDs and videos that has since been enlarged and houses children's fiction. It has a space with two sofas where storytelling events are held. There is a lecture room in the back right-hand corner where children's books used to be.`,
    overallBand: 7.5,
    examinerComment:
      'This response covers the main changes that have occurred over the 20-year period. An overview is presented in the second paragraph which is quite general: it refers to the [dedicated spaces for events] but this could be improved by giving a summary of the key changes (dedicated spaces for events, self-service facilities and a café). Ideas are arranged logically: the changes to the front of the library are presented in the third paragraph and the changes to the back section in the final paragraph. This shows a logical approach to reporting the changes and there is some good cohesion [once was | now on the left | has since been]. There is a good range of vocabulary. In this kind of task, vocabulary from the floor plan needs to be used to report the changes, but the use of different words shows some flexibility and precision [been updated | dedicated spaces | houses]. In terms of grammar, there are error-free sentences and some variation in structures used when describing changes [has been updated | what once was | has since been enlarged]. The response could be improved by extending the overview to include more of a summary of the main changes but overall, this response captures the main changes in a logical way.',
    keyTakeaways: [
      'Logical front-to-back spatial organization and error-free passive/present-perfect structures; extending the overview to summarize all key additions (events, self-service, cafe) would push TA higher.',
    ],
  },
  {
    id: 'cambridge-18-t3-w2-band75',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'opinion',
    title: 'Cambridge 18 Test 3 Task 2 (Rural-to-Urban Migration) - Examiner Model (Band 7.5)',
    prompt:
      'In many countries around the world, rural people are moving to cities, so the population in the countryside is decreasing. Do you think this is a positive or a negative development?',
    candidateScript: `Statistics show that the world's population is increasing rapidly. It is expected that most of us will be living in cities within the next few decades. The question of whether urbanisation is a positive or negative development remains controversial.

A rapid influx of people moving from rural to urban areas is bound to cause problems. Firstly, pressure on resources such as housing and transportation intensifies. It is becoming difficult for many people to afford adequate housing in cities. A by-product of this is the creation of slums causing low-income families to group together in neglected parts of the city. These people often become trapped in a cycle of poverty that is difficult to escape.

As mentioned above, the growth of urban areas can also lead to severe traffic congestion because more and more vehicles travel into the city from the suburbs. This has many knock-on effects, such as problems with air quality. It also leads many city dwellers to experience mental health issues because travelling across large cities is tiring and stressful.

All of this being said, I don't believe that urbanisation is a wholly negative development. There are advantages to living in large cities that are well managed. For example, there are more schools which means more education opportunities. Access to higher-quality health care is often better in cities. Some cities have also introduced ride-sharing, e-bikes and park and ride services that reduce environmental problems.

My opinion is that many of the problems associated with urbanisation are avoidable but dealing with increasing populations in cities is a formidable challenge. How governments, businesses and society respond to this challenge will dramatically affect the future of our world.`,
    overallBand: 7.5,
    examinerComment:
      'This response addresses both sides of the question and presents a position, that the movement to cities is not a [wholly negative development]. The second and third paragraphs lay out the problems that can be caused by a [rapid influx] of people to urban areas [housing | transportation | traffic congestion] and the fourth paragraph presents some of the advantages [education opportunities | higher-quality health care | environmental transport initiatives]. However, the part of the question about ‘the population in the countryside ... decreasing’ is not covered. The candidate would need to include it to provide a full answer to this question. Information and ideas are logically organised and there is a clear progression, starting with the challenges and ending with a range of advantages. Vocabulary is used with a natural and sophisticated control [bound to | trapped in a cycle of poverty | severe traffic congestion | knock-on effects], although rare errors remain [education opportunities / educational opportunities]. Grammar is flexible and accurate, with a wide range of structures included. There are some shorter sentences which could be extended and more multi-clause examples could be included to add complexity. To improve this response, consideration should be given to the impact of the shrinking population in the countryside.',
    keyTakeaways: [
      'Demonstrates an important Task Response rule: even with sophisticated lexis ("trapped in a cycle of poverty", "knock-on effects"), omitting the second clause ("population in the countryside is decreasing") prevents full Task Response.',
    ],
  },
  {
    id: 'cambridge-18-t4-w1-band70',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Cambridge 18 Test 4 Task 1 (Monthly Price Changes of Metals 2014) - Examiner Model (Band 7.0)',
    prompt:
      'The graph below shows the average monthly change in the prices of three metals during 2014. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Monthly % change 2014: Nickel +6% (Jan) -> -3% (Jun) -> -1% (Jul-Sep) -> -2% (Oct) -> +1% (Nov-Dec); Copper +2% (Jan) -> -0.5% (May-Jun) -> +1% (Jul-Sep) -> +0.5% (Oct-Nov) -> +1.5% (Dec); Zinc +1% (Jan) -> +3% (Feb) -> -1% (Jun) -> -0.5% (Jul-Sep) -> -1% (Oct) -> +1.5% (Nov) -> +2% (Dec).',
    candidateScript: `From the line graph, we can see the average monthly rise or fall in how much copper, nickel and zinc cost throughout 2014.

Overall, nickel started with the highest percentage change of the three but ended with the lowest. Zinc started with the smallest change and ended with the highest, and copper prices fluctuated. Prices for all three metals dipped in June.

In January the price of nickel was up six per cent, but this dropped to negative three percent in June, ending the year with a one percent increase in both November and December. Copper began the year with an increase of two percent and by May, the price was dropping (by slightly less than one per cent). It rose again, increasing by a percentage point in July, August and September. Zinc saw its most dramatic increase in February, with three per cent and the price fell in June (a one percent decrease). The change was negative until October/November when it began to rise.`,
    overallBand: 7.0,
    examinerComment:
      'This response reports the main data for each of the three metals. There is an introduction in the first paragraph and an overview in the second, followed by the presentation of the main trends of all three categories in the third. Some details are missing (copper after September and no percentage changes for any metal from July to September). The candidate identifies the ‘dip’ for all three in June, but to score more highly, they could also have mentioned that overall, percentage changes fell at the beginning of the year, remained static from July to September and rose after October to the end of the year. Information is arranged coherently; each metal is taken in turn for data reporting. There is good use of cohesive devices [Overall | but | with | when], but there could be more. Vocabulary is adequate with some attempts to use less common items [fluctuated | dramatic increase] and attempts to use synonyms [ended with the lowest | dipped | dropped]. There is a lack of complex structures, as most sentences are simple or compound. However, there is some variety in structures, including comparatives [highest | smallest | most dramatic] and continuous tenses [was dropping]. To improve the response, the candidate could extend the overview to reflect some common trends and should include some of the missing details.',
    keyTakeaways: [
      'Coherent metal-by-metal reporting with clear June dip identification; missing Jul-Sep/Oct-Dec details and mostly simple/compound sentences keep this model around Band 7.0.',
    ],
  },
  {
    id: 'cambridge-18-t4-w2-band85',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'advantages_disadvantages',
    title: 'Cambridge 18 Test 4 Task 2 (Ageing Population) - Examiner Model (Band 8.5)',
    prompt:
      'In many countries, people are now living longer than ever before. Some people say an ageing population creates problems for governments. Other people think there are benefits if society has more elderly people. To what extent do the advantages of having an ageing population outweigh the disadvantages?',
    candidateScript: `The population in most parts of the world is ageing; people are living longer and there are fewer younger people in many places as birth rates fall. This phenomenon has pros and cons, but this essay will contend that, on balance, the advantages of having an older population outweigh the negatives.

The first issue that occurs to many people when considering the ageing population is the expense. If people live longer, they may have more than 30 years of retirement and may need to be supported financially by the government or their families. If they experience age-related illness, this impacts the health system and takes up resources needed by other people in society. What's more, when older people are financially independent, it might be hard for younger people if they have to compete to get a foot in the door of the housing market or gain employment.

That being said, older people have a lot to contribute in terms of wisdom, experience and skills. Many people are active and productive for longer than their counterparts were 50 years ago and are an asset to the economy and society well into their old age. They are able to work for longer and after retirement they contribute in many ways too, such as by doing charitable work, spending money as consumers and supporting their families. Grandparents often care for their young grandchildren, making it easier for both parents to work.

While it is true that an ageing population poses challenges for governments, it is clear that these are outweighed by the significant benefits that elderly people bring to society.`,
    overallBand: 8.5,
    examinerComment:
      'This is a good response to the task. Both sides of the argument are presented, with the ideas extended for both. The candidate makes their position clear from the beginning, that there are more advantages than disadvantages. The second paragraph addresses the expense of looking after the elderly, the health system and the cost for governments. It also captures the challenge that older people take up houses and jobs so younger people cannot progress. The third paragraph presents the advantages of the [wisdom, experience and skills] older people can bring: that they are more active and remain productive for longer, not only working, but also [doing charitable work, spending money as consumers, supporting their families and even grandchildren for the working parents]. This means that the conclusion is relevant and justified. Ideas are organised and cohesion has good progression. Vocabulary is skilfully used, with some high-level terms [phenomenon | age-related illness | impacts the health system] and some sophisticated examples [get a foot in the door | counterparts]. There are a range of complex grammatical structures, including several conditional structures [if]. The conditionals are used to emphasise the challenges presented and are without errors. This is a high-level, fully developed response with ideas that are well supported, extended and engaging.',
    keyTakeaways: [
      'High-level Band 8.5 anchor: clear upfront position, extended arguments on both sides, skilful idiomatic/academic lexis ("get a foot in the door", "counterparts"), and error-free complex conditionals.',
    ],
  },
];

async function main() {
  const now = new Date().toISOString();

  // 1. Local SQLite
  for (const s of C18_CALIBRATION_SAMPLES) {
    const wordCount = s.candidateScript.trim().split(/\s+/).filter(Boolean).length;
    const existing = (await db
      .prepare('SELECT id FROM writing_calibration_samples WHERE id = ?')
      .get(s.id)) as { id: string } | undefined;

    if (existing) {
      await db
        .prepare(
          `UPDATE writing_calibration_samples
           SET source = ?, task_type = ?, task_number = ?, subtype = ?, title = ?, prompt = ?,
               visual_ground_truth = ?, candidate_script = ?, word_count = ?, overall_band = ?,
               examiner_comment = ?, key_takeaways_json = ?
           WHERE id = ?`
        )
        .run(
          s.source,
          s.taskType,
          s.taskNumber,
          s.subtype,
          s.title,
          s.prompt,
          s.visualGroundTruth || null,
          s.candidateScript,
          wordCount,
          s.overallBand,
          s.examinerComment,
          JSON.stringify(s.keyTakeaways),
          s.id
        );
    } else {
      await db
        .prepare(
          `INSERT INTO writing_calibration_samples (
            id, source, task_type, task_number, subtype, title, prompt, visual_ground_truth,
            candidate_script, word_count, overall_band, examiner_comment, key_takeaways_json, created_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`
        )
        .run(
          s.id,
          s.source,
          s.taskType,
          s.taskNumber,
          s.subtype,
          s.title,
          s.prompt,
          s.visualGroundTruth || null,
          s.candidateScript,
          wordCount,
          s.overallBand,
          s.examinerComment,
          JSON.stringify(s.keyTakeaways),
          now
        );
    }
  }
  console.log(`Seeded ${C18_CALIBRATION_SAMPLES.length} Cambridge 18 calibration samples in SQLite.`);

  // 2. Supabase PostgreSQL
  if (!env.DATABASE_URL) {
    console.warn('DATABASE_URL missing; skipping Supabase.');
    return;
  }

  const pgClient = new Client({
    connectionString: env.DATABASE_URL,
    ssl: { rejectUnauthorized: false },
  });
  await pgClient.connect();

  await pgClient.query(`
    CREATE TABLE IF NOT EXISTS writing_calibration_samples (
      id TEXT PRIMARY KEY,
      source TEXT NOT NULL DEFAULT 'custom_teacher',
      task_type TEXT NOT NULL,
      task_number INTEGER NOT NULL,
      subtype TEXT NOT NULL,
      title TEXT NOT NULL,
      prompt TEXT NOT NULL,
      visual_ground_truth TEXT,
      candidate_script TEXT NOT NULL,
      word_count INTEGER NOT NULL DEFAULT 0,
      overall_band DOUBLE PRECISION NOT NULL,
      score_ta_tr DOUBLE PRECISION,
      score_cc DOUBLE PRECISION,
      score_lr DOUBLE PRECISION,
      score_gra DOUBLE PRECISION,
      examiner_comment TEXT NOT NULL,
      key_takeaways_json TEXT NOT NULL DEFAULT '[]',
      created_by_id TEXT,
      created_at TEXT NOT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_writing_calibration_type ON writing_calibration_samples(task_type, subtype, overall_band);
  `);

  for (const s of C18_CALIBRATION_SAMPLES) {
    const wordCount = s.candidateScript.trim().split(/\s+/).filter(Boolean).length;
    await pgClient.query(
      `INSERT INTO writing_calibration_samples (
        id, source, task_type, task_number, subtype, title, prompt, visual_ground_truth,
        candidate_script, word_count, overall_band, examiner_comment, key_takeaways_json, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)
      ON CONFLICT (id) DO UPDATE SET
        source = EXCLUDED.source,
        task_type = EXCLUDED.task_type,
        task_number = EXCLUDED.task_number,
        subtype = EXCLUDED.subtype,
        title = EXCLUDED.title,
        prompt = EXCLUDED.prompt,
        visual_ground_truth = EXCLUDED.visual_ground_truth,
        candidate_script = EXCLUDED.candidate_script,
        word_count = EXCLUDED.word_count,
        overall_band = EXCLUDED.overall_band,
        examiner_comment = EXCLUDED.examiner_comment,
        key_takeaways_json = EXCLUDED.key_takeaways_json`,
      [
        s.id,
        s.source,
        s.taskType,
        s.taskNumber,
        s.subtype,
        s.title,
        s.prompt,
        s.visualGroundTruth || null,
        s.candidateScript,
        wordCount,
        s.overallBand,
        s.examinerComment,
        JSON.stringify(s.keyTakeaways),
        now,
      ]
    );
  }

  const countRes = await pgClient.query(
    "SELECT count(*)::int as cnt FROM writing_calibration_samples WHERE id LIKE 'cambridge-18-%'"
  );
  console.log('Verified Cambridge 18 calibration samples in Supabase:', countRes.rows[0].cnt);
  await pgClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
