import { db } from './db';
import { v4 as uuidv4 } from 'uuid';
import { createWritingTask, publishWritingTask } from './writingService';
import { grantTestingAllowance } from './allowanceService';

export function seedWritingData() {
  const admin = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any;
  const teacher = db.prepare("SELECT id FROM users WHERE role = 'teacher' LIMIT 1").get() as any;

  const authorId = teacher?.id || admin?.id;
  if (!authorId) {
    console.log('No teacher or admin found to seed writing tasks.');
    return;
  }

  // Check if writing tasks already exist
  const existingCount = db.prepare('SELECT count(*) as count FROM writing_tasks').get() as any;
  if (existingCount && existingCount.count > 0) {
    console.log('Writing tasks already seeded.');
    return;
  }

  console.log('Seeding demonstration Writing tasks...');

  // 1. Academic Task 1: Bar Chart / Trends
  const task1Renewable = createWritingTask({
    createdById: authorId,
    title: 'Global Investment in Renewable Energy by Sector (2015-2025)',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'chart',
    prompt:
      'The chart below shows global investment in different renewable energy sectors (Solar, Wind, and Hydroelectric) between 2015 and 2025, in billions of US dollars.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    structuredData: {
      unit: 'Billion USD',
      years: ['2015', '2018', '2021', '2025'],
      sectors: {
        Solar: [120, 160, 240, 350],
        Wind: [100, 130, 180, 250],
        Hydroelectric: [50, 48, 52, 50],
      },
    },
    teacherVisualDescription:
      'The bar chart compares annual investment across three renewable energy sectors from 2015 to 2025: Solar, Wind, and Hydroelectric. Total investment climbed dramatically from approximately $270 billion in 2015 to $650 billion by 2025. Solar recorded the most rapid growth, nearly tripling from $120B in 2015 to $350B in 2025, becoming the leading recipient from 2018 onwards. Wind investment also experienced consistent, substantial growth, climbing from $100B to $250B over the decade. In contrast, Hydroelectric investment remained completely stagnant throughout the entire ten-year period, fluctuating minimally between $48B and $52B. Overall, Solar and Wind drove virtually all aggregate market expansion, while Hydroelectric accounted for a progressively diminishing share.',
    teacherAssessmentGuidance:
      'TEACHER ASSESSMENT GUIDANCE: Candidates must identify the overall upward trend in Solar and Wind versus the flatline in Hydro. Candidates who fail to include an explicit overview cannot achieve Band 6 or higher for Task Achievement. Candidates must report accurate figures (e.g. Solar reaching 350B, Wind reaching 250B) and compare sectors effectively.',
    modelResponse:
      'The provided bar chart illustrates worldwide financial allocations towards three renewable energy categories—Solar, Wind, and Hydroelectric—at four intervals between 2015 and 2025, measured in billions of US dollars.\n\nOverall, it is immediately apparent that while investments in solar and wind power witnessed substantial and uninterrupted expansion over the ten-year period, funding for hydroelectric power remained essentially static. Furthermore, solar emerged as the single dominant destination for capital by the end of the period.\n\nIn 2015, solar energy attracted the highest initial capital at $120 billion, closely pursued by wind energy at $100 billion. Over the ensuing decade, solar funding surged steadily, reaching $160 billion in 2018, before accelerating sharply to $240 billion in 2021 and peaking at an impressive $350 billion in 2025. Expenditure on wind installations exhibited a similar upward trajectory, more than doubling to achieve $250 billion by 2025.\n\nBy contrast, hydroelectric investments remained virtually unchanged over the timeframe examined. Beginning at $50 billion in 2015, expenditure dipped slightly to $48 billion in 2018, rebounded marginally to $52 billion in 2021, and ended precisely at $50 billion in 2025, constituting a negligible proportion of aggregate clean energy spending.',
  });
  publishWritingTask(task1Renewable.id);

  // 2. Academic Task 1: Process Diagram
  const task1Desalination = createWritingTask({
    createdById: authorId,
    title: 'Thermal Desalination and Drinking Water Treatment Process',
    taskType: 'academic_task_1',
    taskNumber: 1,
    testType: 'academic',
    subtype: 'process',
    prompt:
      'The diagram illustrates the industrial process of converting seawater into potable drinking water via thermal desalination and remineralization.\n\nSummarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    instructions: 'You should spend about 20 minutes on this task. Write at least 150 words.',
    minWords: 150,
    suggestedTimeMinutes: 20,
    teacherVisualDescription:
      'The flowchart outlines an eight-stage linear manufacturing process for marine desalination. Stage 1: Seawater intake from the ocean through offshore submerged pipes. Stage 2: Mechanical screening removes debris, algae, and suspended solids. Stage 3: Pre-treatment acidification prevents scaling. Stage 4: Heating in thermal flash chambers where high temperature and reduced pressure cause rapid vaporization. Stage 5: Condensation of pure steam onto cooling coils into distillate liquid. Stage 6: Extraction and safe oceanic discharge of hyper-saline brine byproduct. Stage 7: Remineralization via calcium carbonate and chlorine disinfection in post-treatment reservoirs. Stage 8: Pumping of finalized potable water into the municipal distribution grid.',
    teacherAssessmentGuidance:
      'TEACHER GUIDANCE: Process essays require clear sequential passive structures (e.g. "is pumped", "is heated", "is condensed") and sequential linking markers (initially, following this, subsequently, in the final stage). Overview must summarize the start, transformation stages, and final output.',
    modelResponse:
      'The schematic diagram delineates the multi-stage industrial procedure involved in purifying oceanic seawater into drinkable municipal water through thermal flash desalination.\n\nOverall, the procedure encompasses a continuous sequence divided into three principal phases: initial intake and pre-treatment, thermal distillation with brine extraction, and post-distillation mineral conditioning before final distribution.\n\nInitially, raw seawater is suctioned from the ocean via submerged intake conduits and routed into preliminary filtration units, where mechanical screens extract macroscopic debris and silt. The water is subsequently treated with dilute chemical agents to inhibit scale formation before entering the distillation complex.\n\nIn the primary thermal phase, the treated seawater is introduced into high-temperature flash chambers operated under lowered atmospheric pressure. This induces rapid vaporization into pure steam, which condenses along cooled condenser piping into liquid distillate. Simultaneously, residual concentrated brine is separated and returned safely to the sea. In the concluding phase, the mineral-deficient distillate passes into post-treatment tanks, where essential calcium salts and disinfectant chlorine are integrated prior to municipal delivery.',
  });
  publishWritingTask(task1Desalination.id);

  // 3. General Training Task 1: Formal Letter
  const task1Library = createWritingTask({
    createdById: authorId,
    title: 'Formal Letter to City Council regarding Public Library Renovations',
    taskType: 'gt_task_1',
    taskNumber: 1,
    testType: 'general',
    subtype: 'letter_formal',
    prompt:
      'You have learned that your local council plans to renovate the municipal public library, which will require closing the quiet study areas for six months.\n\nWrite a letter to the Head of Library Services. In your letter:\n- explain how you and other local residents use the quiet study spaces\n- express your concerns about the planned six-month closure\n- suggest constructive alternative arrangements or phased schedules during the renovation.',
    instructions:
      'You should spend about 20 minutes on this task. Write at least 150 words. You do NOT need to write any addresses. Begin your letter with: Dear Sir or Madam,',
    minWords: 150,
    suggestedTimeMinutes: 20,
    teacherAssessmentGuidance:
      'TEACHER GUIDANCE: Evaluated for formal tone and register consistency. All three bullet points must be thoroughly developed with convincing detail. Informal vocabulary or colloquial contractions (don\'t, can\'t) reduce Lexical Resource and Grammatical Range.',
    modelResponse:
      'Dear Sir or Madam,\n\nI am writing to express my appreciation for the council’s ongoing investment in municipal infrastructure, while raising serious concerns regarding the projected six-month closure of the quiet study facilities at Central Library.\n\nAs a post-graduate researcher and long-term patron, I utilize these study halls daily alongside dozens of university scholars, remote professionals, and secondary school examinees. For many within our neighborhood, this quiet sanctuary represents the sole conducive environment available for undisturbed concentration, devoid of domestic disruptions.\n\nWhile modernization is undoubtedly welcome, terminating access for half a year will inevitably cause significant scholarly detriment. Many students facing imminent national examinations will find themselves without essential reference texts or quiet study spaces.\n\nTo mitigate these disruptions, I respectfully suggest two constructive solutions. First, renovations could proceed in phased increments, keeping at least half of the study desks accessible at all times. Alternatively, the council might arrange temporary quiet reading spaces within the adjoining civic center. Thank you for your consideration.\n\nYours faithfully,\n\nAlex Mercer',
  });
  publishWritingTask(task1Library.id);

  // 4. Task 2: Academic & General Shared Essay
  const task2AI = createWritingTask({
    createdById: authorId,
    title: 'Artificial Intelligence and the Future of Employment: Opportunities and Risks',
    taskType: 'task_2',
    taskNumber: 2,
    testType: 'both',
    subtype: 'discussion',
    prompt:
      'Some people believe that artificial intelligence and automation will lead to widespread joblessness and economic instability, while others argue that AI will create more new career opportunities and higher productivity.\n\nDiscuss both views and give your own opinion.',
    instructions:
      'You should spend about 40 minutes on this task. Give reasons for your answer and include any relevant examples from your own knowledge or experience. Write at least 250 words.',
    minWords: 250,
    suggestedTimeMinutes: 40,
    teacherAssessmentGuidance:
      'TEACHER GUIDANCE: A balanced discussion essay where both viewpoints must be given substantial consideration before articulating a clear, defended personal conclusion. Band 7+ requires well-developed main ideas with logical supporting evidence and nuanced modal phrasing.',
    modelResponse:
      'The accelerating expansion of artificial intelligence (AI) across diverse sectors has ignited intense debate regarding its broader economic repercussions. While one school of thought cautions that automation threatens mass unemployment and financial volatility, another maintains that AI will stimulate higher productivity and generate novel career pathways. In my perspective, while structural labor disruptions in routine roles are unavoidable, technological progress will ultimately yield net societal and occupational gains if matched by educational reforms.\n\nOn the one hand, proponents of the pessimistic view point out that advanced algorithms and robotics are no longer confined to manual manufacturing tasks, but are increasingly capable of executing cognitive functions previously exclusive to human professionals. In sectors such as clerical administration, data auditing, and customer service, software platforms operate with unprecedented speed and minimal error margins. Consequently, less specialized workers face imminent displacement, potentially exacerbating income inequality and placing unprecedented strain on social welfare programs during transitional economic adjustments.\n\nOn the other hand, advocates emphasize historical precedent, asserting that every industrial transformation initially displaces legacy occupations before generating superior vocations of higher value. Generative AI tools do not merely replace workers; they augment human capabilities, eliminating repetitive toil so that workers can concentrate on creative, strategic, and empathetic endeavors. Furthermore, the burgeoning AI ecosystem creates entirely unprecedented employment domains, including prompt engineering, algorithmic ethics oversight, and machine learning systems maintenance.\n\nIn conclusion, while the threat of near-term job obsolescence in routine domains warrants comprehensive government retraining initiatives, I believe that artificial intelligence will ultimately catalyze macroeconomic prosperity and expand higher-order employment opportunities.',
  });
  publishWritingTask(task2AI.id);

  // Seed allowance balance for active students so they can test immediately
  const students = db.prepare("SELECT id FROM users WHERE role = 'student'").all() as any[];
  for (const s of students) {
    try {
      grantTestingAllowance({
        adminId: authorId,
        userId: s.id,
        amount: 5,
        notes: 'Complimentary pilot allowance grant for IELTS Writing AI evaluation',
      });
    } catch {
      // Ignore if already granted
    }
  }

  console.log('Writing demonstration tasks and student allowances seeded successfully.');
}
