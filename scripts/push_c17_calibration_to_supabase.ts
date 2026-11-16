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

const C17_CALIBRATION_SAMPLES: CalibrationSeed[] = [
  {
    id: 'cambridge-17-t1-w1-band60',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'map',
    title: 'Cambridge 17 Test 1 Task 1 (Norbiton Industrial Area) - Band 6.0',
    prompt:
      'The maps below show an industrial area in the town of Norbiton, and planned future development of the site. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Norbiton industrial area now vs planned future development: 8 factories replaced by housing, shops, medical centre, playground, school; new bridge over river to farmland housing; second small roundabout added.',
    candidateScript: `The two maps illustrates the norbiton area in the present days, as well as, the planned development.

Overall, the norbiton industrial area is located at the east side of the town, with a river on the north, separating the farmland from the industrial area, which is located in the center of the map, represented by a few factory biuldings and roads, followed by the main road at the extreme south of the map.

the planned development shows a substantially growth and modifications of the overall infrastructure of the area between the farmland and the main road.

Firstly, the planned development of the norbiton area replaces what once were factories for housings.

Moreover, the roads have been developed to acomodate all the new biuldings that have been planned for the area, which are, a school and a playground to the east side of the roundabout located in the center of the map, as well as shops and a medical center around the round about.

Secondly, a bridge is planned for the north of the map to cross the river and provide acess to the housing that will be located in farmland.`,
    overallBand: 6.0,
    examinerComment:
      'This response covers the key changes to be made to the industrial area, although more detail could be made, for example, housing to the west of the roundabout. There is an overview in the second paragraph and the response could be improved by adding a summary of the main changes. Ideas are arranged coherently, with some effective use of cohesive devices [what once were], sequencing adverbs [Firstly | Secondly] and referencing [which | that]. There is some less common vocabulary but spelling is often inaccurate [acomodate / accommodate | biuldings / buildings] and word formation is incorrect [substantially growth / substantial growth]. To achieve a higher score, the candidate would need to reduce the number of errors in vocabulary and sentence structure.',
    keyTakeaways: [
      'Missing some specific locations (housing west of the roundabout), a descriptive rather than summary overview, and spelling/word-formation errors ("biuldings", "substantially growth") limit the response to Band 6.0.',
    ],
  },
  {
    id: 'cambridge-17-t1-w2-band65',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'advantages_disadvantages',
    title: 'Cambridge 17 Test 1 Task 2 (Taking Risks) - Band 6.5',
    prompt:
      'It is important for people to take risks, both in their professional lives and their personal lives. Do you think the advantages of taking risks outweigh the disadvantages?',
    candidateScript: `It is said that taking risks brings a lot of benefits. However, it also gives us some drawbacks.

First of all, it is obvious that taking risks will cause a great loss if people do it and fail. In personal life, this loss might not be so harmful. However, it will be really harmfull in professional life, because people take a responsibility not only for themselves but also others such as colleagues, customers and their families. It will even damage the society from the economic point.

On the other hand, we can receive huge benefits by taking risks. Firstly, we can learn how to prepare for one goal through this process. In order to achieve the aim, people will make all the efforts to think about it and try to find more efficient way. If they do this in the professional circumstances, they will recognise the responsibility and importance of cooperation.

Also, it will be completely meaningful even though people can't achieve the goal after taking risks. They will learn the reason why they have failed and how to change it. The failure will enable them to improve their skills and to achieve their object next time.

As I mentioned, it is true that taking risks give us both advantages and disadvantages. However, it can be argued that the benefits outweighed the drawbacks in that we can obtain advantages not only from the result but also from the process of taking risks.`,
    overallBand: 6.5,
    examinerComment:
      'This response discusses the advantages and the disadvantages of taking risks. It puts much greater emphasis on risks in ‘professional life’. As this response is below 250 words (it is only 242), more could be added to include risks in ‘personal life’ along with some specific examples of risks that people commonly take. There is a clear progression through the response and ideas are logically organised; disadvantages are presented first and advantages second. Cohesive devices can be quite mechanical with examples at the start of most sentences [First of all | However | On the other hand | Firstly] but referencing is generally appropriate [it | this loss | They | The failure]. The first paragraph is very short and paragraphing is not entirely logical. Vocabulary is effective with some less common items [damage the society | receive huge benefits | enable | obtain advantages ... from the process]. Occasional errors remain [object / objective | point / perspective]. Sentence structure is good, with frequent error-free sentences. There is a variety of complex structures, including conditionals [if], but a few errors remain. To improve this response, the word count of 250 should be reached and concrete example(s) of risk could be provided.',
    keyTakeaways: [
      'Underlength (242 words vs 250 minimum), under-developing "personal life" risks, and mechanical sentence-initial linkers cap an otherwise good script at Band 6.5.',
    ],
  },
  {
    id: 'cambridge-17-t2-w1-band75',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'mixed',
    title: 'Cambridge 17 Test 2 Task 1 (Police Budget 2017-2018) - Band 7.5',
    prompt:
      'The table and charts below give information about the police budget for 2017 and 2018 in one area of Britain. The table shows where the money came from and the charts show how it was distributed. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Table (£m): National Government 175.5 -> 177.8; Local Taxes 91.2 -> 102.3; Other sources 38 -> 38.5; Total 304.7 -> 318.6. Pie charts: Salaries 75% -> 69%; Technology 8% -> 14%; Buildings and transport 17% -> 17%.',
    candidateScript: `The table illustrates the data on the police budget in which the money came from and the two pie charts describe the distribution of the amount of money in the two of year 2017 and 2018 in an area of Britain. Overall, there was an upward trend in all three different sources while the money spent on salaries was always the majority of contribution.

Looking into more details, the highest amount of money on the police budget belonged to ‘National Government’, 175.5 million pounds in 2017 and it kept rising to 177.8 million pounds. Thus was followed by ‘Local Taxes’, at 91.2 million pounds in 2017, after one year, it increase significantly to 102.3 million pounds.

In term of the how the money was spent, the majority of police budget goes to salaries which was for officers and staff, dropping slightly from 75% in 2017 to 69% in 2018. Meanwhile, the proportion of ‘Buildings and transport’ remained constantly, at 17% each year. An opposite pattern can be seen in the category of technology, its figure rose sharply from 8% in 2017 to 14% in 2018, which was always the lowest rate during the given period.`,
    overallBand: 7.5,
    examinerComment:
      'This is a strong response. The candidate provides a clear overview at the end of the first paragraph which highlights the consistently increasing trend from the table and identifies the largest category from the pie charts. Full details are given for the first two sources of the budget but, to achieve a higher rating, key features in the table could be more fully extended. Information is presented in the order of the table first and then the charts, in a logical manner. The test taker demonstrates a good range of cohesive devices [while | which was] and uses three paragraphs appropriately to organise and sequence the required data. There is a wide range of vocabulary [figure rose sharply | during the given period] with accurate spelling, although there are occasional errors in word choice. The range of grammatical structures is wide, including modal [can] and continuous forms [kept rising] – although there are occasional errors e.g. using present tenses [goes on] to describe data from 2017 and 2018. To improve this response, the key features presented from the table could be more fully extended. The candidate could also reduce the few errors in sentence structure.',
    keyTakeaways: [
      'Clear overview combining both table and pie charts, logical 3-paragraph layout, and wide lexis/grammar earn Band 7.5; omitting "Other sources" and total figures plus minor tense slips prevent Band 8+.',
    ],
  },
  {
    id: 'cambridge-17-t2-w2-band65',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'two_part',
    title: 'Cambridge 17 Test 2 Task 2 (Children Using Smartphones) - Band 6.5',
    prompt:
      'Some children spend hours every day on their smartphones. Why is this the case? Do you think this is a positive or a negative development?',
    candidateScript: `Mobile phones, nowadays, contains essential features with entertainment also. There has been a large growth seen in usage hours of smartphones among youngsters. There are several reasons behind this situation and I find this development more beneficial than negative. Both the reasons and my view is elaborated further.

The first reason for overusage of smart devices by youngsters is the social benefit they provide. The smart phone connected with internet opens up the large possibilities, from creating new friends to communicating with them over social media. For instance, a child in my neighbourhood chats for hours with his school friends over Facebook (a social media) and also spend time over online video sharing phone application. Moreover, the mobile gaming, specially multiplayer games, is another major reason for the situation. Children plays different kind of games over mobile for the entertainment purpose and they involve themselves in games in such a manner, that they forget about the timing and other work to do.

However, I believe that smartphones have also increased the knowledge of pupils. It has developed some important social skills, such as communication skill, team work and many more, by allowing them to work and play in groups, without the restriction of distance. In addition, children can learn through internet by watchin online videos and reading articles, which ultimately helps them in their studies as well as language skills. For example, whenever my niece require to know about something, he searches it over the internet and learns from it. Moreover, multiplayer online gaming improves their multitasking ability and it also gives them a competitive environment

Overall, I agree that overusage of smartphones on regular basis is harmful for them, but if given proper guidance, mobile phones can help them in learning some life-long skills.`,
    overallBand: 6.5,
    examinerComment:
      'This response addresses both parts of the question. A range of ideas is expressed and the candidate gives their position in the opening paragraph and then provides evidence and relevant examples. Ideas are logically organised and there is clear progression throughout the four paragraphs. A range of cohesive devices are used [The first reason | For instance | Moreover] with referencing used appropriately [they | themselves | their studies | it]. The range of vocabulary is good with examples of higher-level items [social skills | restriction of distance | ultimately] and there are few errors [overusage / overuse | niece ... he / niece ... she | watchin / watching | require to know / needs to know]. Similarly, the range of grammatical structures is reasonable, but the level of error means the Band Score cannot be higher than 6.5.',
    keyTakeaways: [
      'Addressing both parts with clear 4-paragraph progression and good lexis achieves Band 6.5, held back from Band 7 by recurring grammar/agreement errors ("contains", "plays", "watchin").',
    ],
  },
  {
    id: 'cambridge-17-t3-w1-band55',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Cambridge 17 Test 3 Task 1 (Family Weekly Spending 1968 vs 2018) - Band 5.5',
    prompt:
      'The chart below gives information about how families in one country spent their weekly income in 1968 and in 2018. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      '1968 vs 2018 (% weekly income): Food 35%->17%, Housing 10%->19%, Fuel & power 6%->4%, Clothing & footware 10%->5%, Household goods 8%->8%, Personal goods 8%->4%, Transport 8%->14%, Leisure 9%->22%.',
    candidateScript: `The chart describes the data about families weekly expenditure prospects in 1968 and in 2018.

The most significant spent rate is on food with a 35% ratio in the year 1968. Housing and clothing come next with the same prospect of 10% of the weekly income. Expenditure on leisure, transport, personal goods and household goods are almost same percentage, the former one is slightly more. Lastly, spent rates on fuel and the others are recorded the least with a 6% in the year of 1968.

Turning to 2018, food expenditure of families had dropped dramatically to a percentage between 15 to 20. On the other hand, housing spent had rised significantly with an almost 20% slightly more than food expenditures. The most crucial rise was recorded on leisure spent rates. It had soared abut 10% in 50 years. Transportation expenditures comes after and followed by Household goods and the othe categories respetively. Last three had remained the least just as in 1968 which is fuel and power, clothing and footware and personal goods.

Overall, weekly expenditure averages of families had dramatically changed over 50 years. Some spent rates had remained the same whereas some of the alterations are quite noticeable.`,
    overallBand: 5.5,
    examinerComment:
      'This response clearly presents the data from the bar graph. The candidate presents all the data for 1968 first and then the data for 2018. There is an overview in the final sentence, but it should summarise the main changes from the bar chart rather than just saying that expenditure ‘had ... changed’. Information is arranged coherently into four paragraphs, and there is clear overall progression. A range of cohesive devices is used [Turning to 2018 | followed by | whereas] with an awareness of referencing [former one | the othe categories | Last three]. There are some less common examples of vocabulary [dropped dramatically to | rised significantly | soared]. Errors remain [spent rates / expenditure | housing spent / housing costs] but do not impede communication. Similarly, grammatical structures include some complex forms [had dropped ... to] and sentences with multiple clauses; however, there are errors, including inconsistent use of articles and with past tenses. To improve the response, a summary of the main trends from the bar chart is needed in the overview; for example, the candidate could say that there has been a significant decrease in spending on food over the 50-year period, but the cost of leisure, housing and transport has significantly increased.',
    keyTakeaways: [
      'A vague overview ("had dramatically changed") instead of summarizing the actual directional trends (food down, leisure/housing/transport up) limits Task Achievement to Band 5.5.',
    ],
  },
  {
    id: 'cambridge-17-t3-w2-band65',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'discussion',
    title: 'Cambridge 17 Test 3 Task 2 (Professionals Working Abroad) - Band 6.5',
    prompt:
      'Some people believe that professionals, such as doctors and engineers, should be required to work in the country where they did their training. Others believe they should be free to work in another country if they wish. Discuss both these views and give your own opinion.',
    candidateScript: `As the number of professionals workking abroad increases, it is often discussed whether they should stay where hey did their trainings or they should be free to move to another country if they desired to. While I believe theat a person should be free to migrate, I agree that it has negative effects on the country of training.

On the one hand, professionals who decide to work abroad are seeking for a different lifestyle and career opportunities. Therefore, they should be allowed to improve their lives outside the limitations of their country of origin. For example, whilst in Spain residents in a hospital do not have hands-on experience due to safety measures, in other countries such as Argentina, residents actually practice their skills with patients. Besides, cultural exchanges have proven to increase efficiency, since different nationalities mean different believes and the introduction of new methods.

On the other hand, when professionals leave the country where they trained, countries are damaged socially and economically. In countries where the government provides free education and healthcare, many people think that the population should compensate the country with their skills and abilities. Furthermore, as a study fo South African emigration has pointed out when a professional lease the country it results in the loss of 10 unskilled jobs. Therefore it affect the economy and the community.

Taking everything into account, it can be said that miving out from the country of training should not be taken lightly, given the adverse effects on the population. However, I firmly believe that someone’s professional development should not depend on their country of origin and professionals should be allowed to look for better opportunities overseas.`,
    overallBand: 6.5,
    examinerComment:
      'This response addresses both parts of the question. Both views are considered and an opinion is given. For a higher rating, fuller coverage on the first point, the requirement to ‘work in the country where they did their training’ could be included. Organisation is logical and there is clear progression thorough the four paragraphs. The range of vocabulary is good with examples of higher-level items [hands-on experience | compensate | better opportunities overseas], but there are a number of errors [theat / that | believes / beliefs | lease / leaves | miving / moving]. Similarly, the range of grammatical structures is reasonable, but the level of error means the Band Score cannot be higher than 6.5.',
    keyTakeaways: [
      'Good organization and lexis achieve Band 6.5, but spelling typos ("theat", "lease", "miving") and under-developing why professionals should be required to stay keep it below Band 7.',
    ],
  },
  {
    id: 'cambridge-17-t4-w1-band75',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Cambridge 17 Test 4 Task 1 (Shop Closures & Openings) - Band 7.5',
    prompt:
      'The graph below shows the number of shops that closed and the number of new shops that opened in one country between 2011 and 2018. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Closures: ~6,400 (2011), ~5,900 (2012), ~7,200 (2013), ~6,500 (2014), ~700 (2015), ~5,200 (2016), ~5,000 (2017), ~5,200 (2018). Openings: ~8,500 (2011), ~3,900 (2012), ~5,000 (2013), ~6,200 (2014), ~4,000 (2015-2016), ~4,200 (2017), ~3,000 (2018).',
    candidateScript: `The line graph shows trends in shop closures and openings of new shops in a particular country between the years 2011 and 2018.

In 2011 approximately 6,400 shops closed. The number of closures fluctuated over the next four years until 2015, when there was a dramatic fall in closures to roughly 700 shops. The following year the number of shops closing their doors rose sharply, reaching over 5,000. The figures remained steady for the next two years, with just over 5,000 closures in 2018.

The number of new shops opening decreased dramatically between 2011 (approximately 8,500) and 2012 (just under 4,000) but rebounded by roughly 50% by 2014. In 2015, the number of openings then fell to the 2012 level, but remained stable for the next two years. The last recorded year, 2018, saw a further fall to 3,000 new openings, the lowest point in this seven year period.

Overall, the number of shop closures has remained within the 5,000 to 7,000 range (with the exception of 2015). In contrast, new shop openings have shown a wider range of figures, but generally indicate a downward trend over the same period.`,
    overallBand: 7.5,
    examinerComment:
      'This is a strong response which provides a clear overview in the final paragraph. Data is presented and key features are highlighted appropriately. Closures are dealt with first, and the details are clearly presented, including the [dramatic fall] key feature. Shop openings are dealt with separately, in similar detail. Key peaks and low points are appropriately flagged. For the highest task score, there could be more detail provided for the periods of [fluctuation] between 2011 to 2014 and 2016 to 2018. Ideas are logically organised, taking each line on the graph in turn, and paragraphing is used appropriately, apart from the single sentence first paragraph. Cohesion is well managed. The range of vocabulary is wide, with some skilful use [rebounded by roughly | further fall | exception of]. The grammar includes a variety of complex structures, with numerous long sentences containing a number of clauses. This is a good example of a higher-level response to this Task 1 question.',
    keyTakeaways: [
      'Strong Band 7.5 anchor: clear overview, key peaks/troughs flagged, wide vocabulary ("rebounded by roughly"), and complex multi-clause sentences; only minor detail gaps during fluctuation periods prevent Band 8+.',
    ],
  },
  {
    id: 'cambridge-17-t4-w2-band60',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'opinion',
    title: 'Cambridge 17 Test 4 Task 2 (Alternative Medicines) - Band 6.0',
    prompt:
      'Nowadays, a growing number of people with health problems are trying alternative medicines and treatments instead of visiting their usual doctor. Do you think this is a positive or a negative development?',
    candidateScript: `Since ancient times people tried to treat themselves by herbals and another natural products. In these days this type of treatment is named as alternative medicine. Nowadays, more and more people with some diseases decide to use alternative medicines instead of classic medicine. In this essay I will try to discuss pros and cons.

In my opinion, the disadvantages outweigh the advantages of using traditional medicine. The first reason is that nobody knows how this treatment will affect to a person's health. There are a lot of cases when using different herbals caused allergic reaction and some people dead. The next reason is that people who do not have any medical education try alternative medicines. They do not know what the result will be and hope that it will be positive but not always is like that.

Although there are a lot of disadvantages, advantages might make people not go to usual doctor. The first and the main pro is that using herbals does not cause environmental problems such as air pollution or gas waste. Many pharmaceutical plants use chemicals which have harmful affect on the environment. The other reason is that alternative medicines are usually much cheaper than usual treatment as you do not have to go to pharmacy and buy expensive drugs.

To sum it up, the alternative treatment will be forever because it has some advantages which many people think that they can outweigh the disadvantages but I do not think so. The conventional medicine which develops rocketly will drive out other types of treatment in the future.`,
    overallBand: 6.0,
    examinerComment:
      'The response addresses both sides of the question and the candidate states their position in the second paragraph. The disadvantages presented include not knowing if the treatments will work, possible allergic reactions and the dangers of untrained practitioners. The advantages include remedies being kinder to the environment and usually cheaper. Ideas are arranged coherently with a range of cohesive devices, although organisation is sometimes mechanical due to the high number of linking devices. There is evidence of referencing [chemicals which | it] with some error [that they can outweigh / outweigh]. Vocabulary is used adequately and there are some good examples used [allergic reaction | pharmaceutical plants | conventional medicine]; however, some errors remain [dead / die | rocketly / very quickly]. Grammatical structures include some sentences with multiple clauses [which have | as you]. However, there are errors [not always is like that / it is not always] and most sentences are short and simple.',
    keyTakeaways: [
      'Addresses both sides with clear position, but mechanical linkers, word-choice errors ("dead" for "die", "rocketly"), and predominantly short/simple sentences limit the score to Band 6.0.',
    ],
  },
];

async function main() {
  const now = new Date().toISOString();

  // 1. Local SQLite
  for (const s of C17_CALIBRATION_SAMPLES) {
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
  console.log(`Seeded ${C17_CALIBRATION_SAMPLES.length} Cambridge 17 calibration samples in SQLite.`);

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

  for (const s of C17_CALIBRATION_SAMPLES) {
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
    "SELECT count(*)::int as cnt FROM writing_calibration_samples WHERE id LIKE 'cambridge-17-%'"
  );
  console.log('Verified Cambridge 17 calibration samples in Supabase:', countRes.rows[0].cnt);
  await pgClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
