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

const C16_CALIBRATION_SAMPLES: CalibrationSeed[] = [
  {
    id: 'cambridge-16-t1-w1-band50',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Cambridge 16 Test 1 Task 1 (Electrical Appliances & Housework) - Band 5.0',
    prompt:
      'The charts below show the changes in ownership of electrical appliances and amount of time spent doing housework in households in one country between 1920 and 2019. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Appliances (1920-2019): Refrigerator ~3% (1920) -> ~55% (1940) -> 90% (1960) -> 100% (1980-2019); Vacuum cleaner 30% (1920) -> 50% (1940) -> 70% (1960) -> 90% (1980) -> 100% (2000-2019); Washing machine 40% (1920) -> 60% (1940) -> 70% (1960) -> ~65% (1980) -> 70% (2000) -> ~75% (2019). Housework hours/week: 50 (1920) -> 35 (1940) -> 20 (1960) -> ~15 (1980-2000) -> ~12 (2019).',
    candidateScript: `This charts shows about percentage of households with electrical appliances and Number of hour at housework per week, per household between 1920 and 2019.

In the first chart washing machine. Refrigerator. Vacuum cleaner all rise from 1920 to 2019. Refrigerator and Vacuum cleaner increase faster than washing machine. In 1920, Refrigerator just zero percentage of households and Refrigerator is 30 percentage of households, but in 2019 they all increase 100 percentage of household. Washing machine is to percantage of households in 1920, however in 2019 is just increase about 15 percantage at households, and washing mashine is overed by Pefrigerator and Vacuum cleaner in 1940 and 1960. Vacuum cleaner is overed by Pefrigerator in 1942.

In the second chart Houses per week is 50 Number of hours per week, but it decline to 10 Number of hours per week in 2019.

Over than, percentang of households with electical appliance increase however Number of hours per week decline from 1920 to 2019.`,
    overallBand: 5.0,
    examinerComment:
      'This is an attempt to present the information from both graphs. However, there is inaccurate data, e.g. washing machine use increased by 15%. It actually increased from 40% in 1920 to just over 70% in 2019. The response focuses on the detail of when the lines on the graph intersect but there is a lack of clarity in these details. The description of the second chart lacks detail. This limits the task achievement. There is an attempt to present the information in order, and the last line attempts an overview. However, there is a lack of coherence caused by missing or inaccurate cohesive features [Over than] and there is repetition [percentage of household | number of hours per week] caused by the lack of cohesion. Vocabulary is minimally adequate for the task but there are errors in word choice [overed by / overtaken by] which mean the response is difficult to understand. The frequency of errors in spelling is also high [percantage / percentang / percentage | mashine / machine | Pefrigerator / refrigerator | electical / electrical]. The range of grammatical structures is limited. There are some correct examples [all rise from 1920 to 2019 | they all increase (to) 100 percentage]; however, the errors in grammar and punctuation mean the response is not clear.',
    keyTakeaways: [
      'Inaccurate data (claiming washing machine use rose by 15% instead of 40% to >70%) and lacking detail on the second chart limit Task Achievement to Band 5.0.',
      'High frequency of spelling and word-choice errors ("overed by", "Pefrigerator", "percentang") plus grammar/punctuation errors impede clarity.',
    ],
  },
  {
    id: 'cambridge-16-t1-w2-band60',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'two_part',
    title: 'Cambridge 16 Test 1 Task 2 (History of House or Building) - Band 6.0',
    prompt:
      'In some countries, more and more people are becoming interested in finding out about the history of the house or building they live in. What are the reasons for this? How can people research this?',
    candidateScript: `In our rather futuristic society for a number of reasons people are getting more interested in the past of their hometowns. With the help of rapidly ameliorating technology their desire to learn about the history can be easily put into life. But what are the roots of such an eagerness?

First of all, the hectic lifestyle that we all experience nowadays does not leave any space for calmness and peace in our souls, so most of the people - especially adolescence - are struggling with finding their feet, whilst having a broad spectrum of knowledge about the world around really gives a feeling of confidence in the impermanence of life. In addition to this, it is said that being aware of the past you can change the future. Consequently, if people want to live a better life in more comfortable environment, they have to explore the history of their homes in order not to repeat past mistakes.

For this aims we are lucky to have multiple tools to carry out research into the subject. Despite libraries being considered as an old-fashioned and not necessarily convinient approach of learning, there are actually quite a few books and magazines which are not available online but which are extremely helpful when it comes to the local interests. News, photos, articles and interviews with different people published in old magazines indeed provide with a clear image of past events. Brousing the internet forums is also a great idea to find new information and make friend with mutual objectives.

Putting everything into a nutshell, learning about the history of your place not only builds a sense of confidence but also might have a big impact on our future way of life.`,
    overallBand: 6.0,
    examinerComment:
      'This response provides a range of ideas on the value of knowing about history, but not specifically about the history of houses or buildings people live in. The main points are addressed but the ideas that relate directly to the question are limited. The response is organised into four paragraphs, with an introduction and conclusion. Each main paragraph covers one of the points in the question, but the lack of focus means that there is a lack of overall progression. Cohesive devices are used well [First of all | Consequently] but there are some errors [For this aims]. Vocabulary is the strongest part of this response, with some examples of higher-level collocation [hectic lifestyle | peace in our souls | finding their feet | broad spectrum of knowledge | impermanence of life | mutual objectives]. There are a variety of sentence structures but errors remain. To improve this response, the candidate should refer more closely to the ‘house or building’ rather than the hometown.',
    keyTakeaways: [
      'Even with strong collocation ("hectic lifestyle", "finding their feet"), drifting from "house or building" to "hometown" limits Task Response and overall progression to Band 6.0.',
    ],
  },
  {
    id: 'cambridge-16-t2-w1-band60',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'process',
    title: 'Cambridge 16 Test 2 Task 1 (Sugar Production) - Band 6.0',
    prompt:
      'The diagram below shows the manufacturing process for making sugar from sugar cane. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      '7 steps: (1) Growing 12-18 months, (2) Harvesting manually or by vehicle, (3) Crushing to extract juice, (4) Purifying juice through limestone filter, (5) Evaporator heats juice into syrup, (6) Centrifuge separates sugar crystals from syrup, (7) Drying and cooling.',
    candidateScript: `The diagram illustrates the process by which sugar is produced from sugar cane. The process consists of seven steps of various time length, starting by farming sugar canes and ending by dry sugar ready to use.

First, sugarcane is farmed and nurished for a period of 12 to 18 months, which is the longest step in the whole process. Second, sugar cane get harvested by the means of two ways, either manually or using specialized vehicles. Third, the harvested sugar cane go through the step of crushing, resulting in liquid form called juice.

The fourth step involves purifying the juice through Limestone filters. The purified juice now goes through the fifth step, which put it under extreme heat to allow it to evaporate to get syrup out from it. Then the syrup is centrifuged to separate sugar crystals from syrup. Once that happend the sugar is taken into the last phase of drying and cooling, which finalise the process and produce ready-to-use sugar that is packed and ready for sale.`,
    overallBand: 6.0,
    examinerComment:
      'There is an overview presented in the first paragraph which summarises the process into the farming stages and the drying stages. This summary could be more detailed, e.g. farming, crushing, separating and drying stages. The ideas are presented in three paragraphs and follow the logical sequence of the process. Cohesive devices are basic [First | Second | Third | fourth] and there is some repetition, but there is a clear progression. Spelling is generally accurate and the vocabulary conveys the message well, with some range [the longest step | specialized vehicles | liquid]. Grammatical range is weaker and there are a number of errors [get harvested / is harvested] including third-person endings [go through / goes through | put / puts]. This response could be improved by a more detailed overview and more accuracy in grammatical structures.',
    keyTakeaways: [
      'An overview that only mentions the first and last step is too brief; grouping all macro-stages is needed for Band 7+.',
      'Basic ordinal linkers ("First, Second, Third") and subject-verb/passive errors ("get harvested", "go through") hold the script to Band 6.0.',
    ],
  },
  {
    id: 'cambridge-16-t2-w2-band45',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'two_part',
    title: 'Cambridge 16 Test 2 Task 2 (Advertising New Products) - Band 4.5',
    prompt:
      'In their advertising, businesses nowadays usually emphasise that their products are new in some way. Why is this? Do you think it is a positive or negative development?',
    candidateScript: `In their advertising, businesses nowadays sometimes stress that their products are new in some way. From my point of view, some businesses want to have good products to give to the people, but usually they worry about their products are newer than some other's businesses products.

In think it is a negative development, because when businesses stress about the quality of their products, sometimes they do something wrong while they are producing them. It is good when the businesses take care of and look after their products but with a limit. According to some experts, when you take a lot of care of something, you will probably do some things, about it, wrong.

From my own experience, I was trying to make three school projects, which my teachers asked me to do, and despite my hard work and because I was stressed about the projects I had to do, I finally failed because I had made a lot of mistakes.

To sum up, businesses nowadays should not stress about their products being new in some way. Besides that they should calm down and be careful on what they are producing.`,
    overallBand: 4.5,
    examinerComment:
      'This response does not really address the requirements of the question. There is a view expressed at the beginning of the second paragraph [a negative development] but mainly, the writer is talking about the quality of products rather than advertising. In the third paragraph, an example is given about an unsuccessful school project which is not relevant to the question either. This response only touches on the question set, and is a tangential response. Ideas are not arranged coherently, as they do not address the task given. Paragraphing is not helpful and there is a one-sentence paragraph. Vocabulary is not appropriate as it does not focus on the question set. Sentence structure shows a mix of simple and more complex forms with a range of tenses and modal and comparative structures. There are a number of errors but they do not reduce communication.',
    keyTakeaways: [
      'Misreading "stress" (emphasise) as psychological stress and writing a tangential response about school projects caps Task Response at Band 4.5.',
    ],
  },
  {
    id: 'cambridge-16-t3-w1-band65',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'map',
    title: 'Cambridge 16 Test 3 Task 1 (Southwest Airport Redevelopment) - Band 6.5',
    prompt:
      'The plans below show the site of an airport now and how it will look after redevelopment next year. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Southwest Airport Now vs After Development (next year): Gates expand from 8 to 18 in Y-shaped concourse; walkways replaced by sky train; Departures adds bag drop, relocated check-in/cafe, and shops; Arrivals adds cafe, ATM, car hire.',
    candidateScript: `The South West airport had some changes after its redevelopment. The departures area was modified to have a bag drop service, along with a cafe and check-in module that were already there before the redevelopment. However, both the cafe and the check-in module changed places to make room for the bag drop. After going through security passport control, passengers and airport staff will be able to purchase stuff at the new stores before their flight. After doing some shopping, the boarding gates wait ahead. There are now 18 gates, which were 8 before the redevelopment. For this reason, the walkaway installed between the gates has been replaced for a sky train, which will be able to transport people along the different gates. But if you're not leaving the South West airport, you'll be glad to know the arrivals area has also been redeveloped. After going through passport control customs, passengers and airport staff will be able to hire different services. This area was empty before the redevelopment, but now it has an ATM, a cafe and a car hire service that will gladly take you to your destination.`,
    overallBand: 6.5,
    examinerComment:
      'This response covers the key details required; however, it describes the changes in the past tense instead of using future verb forms for the development ‘next year’. Overall, it could be improved by adding a summary of the main changes. The response has been organised logically by describing the changes to the journey through the redeveloped airport: firstly departures, then arrivals. There are some good cohesive features [However | After | But] and some referencing [which | This area]. Organisation could be improved by breaking the response down into two or three paragraphs. Vocabulary is a strength, with some effective collocation [changed places | take you to your destination] and flexibility [modified | installed between]. In terms of grammar, this response has a variety of structures, but some of the changes in the past simple [was modified] and in the present perfect [has been replaced by] whereas the question asked for a description of the future changes. To improve the score, there should be a wider range of future structures to address the changes ‘next year’.',
    keyTakeaways: [
      'Using past/present perfect tenses for a future ("next year") map and omitting paragraphing/overview keep an otherwise strong, well-collocated script at Band 6.5.',
    ],
  },
  {
    id: 'cambridge-16-t3-w2-band70',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'opinion',
    title: 'Cambridge 16 Test 3 Task 2 (Sugary Products Price) - Band 7.0',
    prompt:
      'Many manufactured food and drink products contain high levels of sugar, which causes many health problems. Sugary products should be made more expensive to encourage people to consume less sugar. Do you agree or disagree?',
    candidateScript: `Today high levels of sugar are contained in many sources of food, especially in manufactured food. And, of course, eating so much sugar is not good for our health: it can cause just a simple cavy, for example, but also worse problems, like the increasing level of sugar in blood. Some people suggest that sugary products should be more expensive, so people would buy less of them.

According to me, I think that this solution is not the best one as sugary products include some types of food that we eat everyday, such as bread or pasta. This foods, particularly the first one, are really important in our diet, so make them more expensive will influence not only our lifestyle, but also some people wouldn't be able anymore to buy the most important food for them. Just think for example to poor people, who can maybe afford a few loads of bread per day: what would they eat if we increased bread price?

I think that the best solution for this problem would be informing people about what they eat, because sometimes we don't even know that. They have already done something to inform people about the characteristics of food, of course, and lebels are one of the most important thing, as they tell you all the ingredients of a particular food. Yet, not many people spend some of their time reading lebels, or, if they do it, they probably don't know the biggest part of the substances named in the list, as well not everybody knows that there is a specific order of the ingredients in the list. So something we could do is organizing some “talks” to inform people not only about the function of lebels, but especially about the big amount of sugar we eat everyday. I think as well that this talks should be organised also in schools, because also children must be aware of what they eat; besides, children can tell what they have learned by these “conferences” at their parents, so the whole family would eat better.

To sum it up, I think that it is not necessary to increase the prices of sugary food and that all we need is information, that will lead people to eat less sugary food and, as a consequence, live better with less problems.`,
    overallBand: 7.0,
    examinerComment:
      'This is a good response to the question. It does not agree with the statement and presents a different solution. There are four paragraphs, made up of an introduction, a conclusion and two further paragraphs explaining why the candidate disagrees with the statement and then giving an alternative solution. Ideas are logically organised, with a range of linking devices to make the response easier to read [Yet | as well | I think as well that | as a consequence], but there are some errors [This / these | also]. There are 386 words in this response, well over the expected 250 words. In this case, the increased wordcount results in a good range of vocabulary with some flexibility and collocation [informing people about what they eat | aware of what they eat] despite some remaining errors [cavy / cavity | lebels / labels]. The response uses a variety of structures [what would they eat if we increased bread price?] despite some errors [by these “conferences” / at these “conferences” | less problems / fewer problems].',
    keyTakeaways: [
      'Clear position, logical 4-paragraph structure, and well-developed arguments (386 words) achieve Band 7.0 even with minor spelling/grammar slips ("lebels", "less problems").',
    ],
  },
  {
    id: 'cambridge-16-t4-w1-band55',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'process',
    title: 'Cambridge 16 Test 4 Task 1 (Recycling Plastic Bottles) - Band 5.5',
    prompt:
      'The diagram below shows the process for recycling plastic bottles. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      '9-step circular recycling diagram: bin -> truck -> sorting -> compressing into blocks -> crushing & washing -> plastic pellets -> heating pellets to raw material -> raw material bundles -> end products (bottles, containers, T-shirts, pens, bags).',
    candidateScript: `Plastic bottles are one of the most materials used in the world, and recycling is a really important subject to try to minimize the waste.

Around the streets, in front off houses and restaurants is possible to see some bins, to collect organic and recycle waste. The yellow in is the correct one to trash recycle things, such as plastic bottles. After trashed, a truck collects at least once a week and leave in a specific place to separate what is recycleble and what is not. For that reason, is really important to separate before trash, this means someone will not spend to many time separating.

Recycling is a big process, after separated the waste should be compressing in blocks to facilitat the crushing and washing process, that should be done because to many durty come with the bottles and crushing it makes easier to produce a new material.

Crushed, washed and then going to the production of plastic pellets, it is can be finally heated to form a raw material.

But what can be produced using recycled bottles? New bottles, containers, bags, T-shirts, pen, toys and to many other things.

Searching, it is possible to see how big is the waste problem around the world and how not to many governmnents invests in this situation. Starting into the houses, avoiding to use plastics in excess and separating the correct things in the correct bins, is a good way to keep the environment safe.`,
    overallBand: 5.5,
    examinerComment:
      'In this process task, the response includes an introduction and covers the main stages of the recycling process. However, there is significant irrelevant detail included, e.g. in the last paragraph, which reduces the score. The stages are set out in order and there is good overall progression with some effective linking devices [such as | For that reason] and cohesion [what is ... what is not | that] but the errors reduce the band score here. The candidate tends to use lists rather than a full range of cohesive devices. Vocabulary is adequate with some original vocabulary [minimize the waste | separated | containers | environment]; however, much is taken directly from the task [compressing | to form a raw material]. There are errors in spelling [in / bin | durty / dirty] but they do not reduce communication. Grammatical structures are limited and level of error is high [after separated / after separating | should be compressing / should be compressed | it is can be / it can be]. For a higher score, improved accuracy is needed. The score for this response could be improved by including a summary of the main stages of the process, e.g. plastic bottles are collected, sorted, broken down and made into new products.',
    keyTakeaways: [
      'Adding irrelevant external commentary (government investment, global waste opinions) and lacking a clear process overview reduce Task Achievement to Band 5.5.',
    ],
  },
  {
    id: 'cambridge-16-t4-w2-band40',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'advantages_disadvantages',
    title: 'Cambridge 16 Test 4 Task 2 (Driverless Vehicles) - Band 4.0',
    prompt:
      'In the future all cars, buses and trucks will be driverless. The only people travelling inside these vehicles will be passengers. Do you think the advantages of driverless vehicles outweigh the disadvantages?',
    candidateScript: `The Advanteg of Driveles Vehicles
First of all number of vehicles is incarese day after day which means ever day the world gets more drivers then before. If we admite that alots of people prefer to use public transport we do not have any doubts that many people use the vehicles because of advantags of driving.

The history shows us that the human like to move from place to another for many reasns and the always fell pleased when the rid. This days people have all kind of vehicles bicks, cars, motor...etc because they all have a different advantage.

people needs also can not meet at be found in one pleace for that reason people need to move from a plece to another place to meet thier needs which means the advantage of moving from point to anther point will be exist for ever.

World has bee changed a lot and many people have got great jobs with big salaries. The can easly fund thier vehicl and because people get feeling boring if the used to some thing they always perefer to chang thier vehicle from time to time.

Finally I think it is very hard to believe that the driverless vehicles with outweigh the disadvantages because people always find drive more and more give thier life meaning and add more advantage to it all kind of vehicles give happeneess to a lot of people that they can not think about lossing it`,
    overallBand: 4.0,
    examinerComment:
      'Most of the ideas in this response are not relevant to the question. It mainly talks about the need people have to go from place to place and how people like different types of transport. However, there is a position expressed in the final paragraph. A title is not required in Task 2. There is some attempt to organise the ideas and there are some basic cohesive devices [First of all | Finally], but there is inaccuracy and a general lack of coherence. There is no clear progression. There is a high density of error in the use of vocabulary in terms of spelling and word choice [easly fund thier vehicl | perefer to chang thier]. Sentence structures are very limited, although there are some attempts at subordinate clauses [because they all have a different advantage].',
    keyTakeaways: [
      'Off-topic ideas (general travel/transport enjoyment rather than driverless vehicles), unnecessary title, and high density of spelling/grammar errors keep the score at Band 4.0.',
    ],
  },
];

async function main() {
  const now = new Date().toISOString();

  // 1. Local SQLite
  for (const s of C16_CALIBRATION_SAMPLES) {
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
  console.log(`Seeded ${C16_CALIBRATION_SAMPLES.length} Cambridge 16 calibration samples in SQLite.`);

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

  for (const s of C16_CALIBRATION_SAMPLES) {
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
    "SELECT count(*)::int as cnt FROM writing_calibration_samples WHERE id LIKE 'cambridge-16-%'"
  );
  console.log('Verified Cambridge 16 calibration samples in Supabase:', countRes.rows[0].cnt);
  await pgClient.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
