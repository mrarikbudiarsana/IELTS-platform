import { WritingTaskType, WritingTaskSubtype, WritingTaskNumber } from './types';

export interface CriterionBandDescriptor {
  band: number;
  taskAchievementOrResponse: string[];
  academicSpecific?: string[];
  generalTrainingSpecific?: string[];
  coherenceCohesion: string[];
  lexicalResource: string[];
  grammaticalRange: string[];
  /**
   * Bolded text from the Official May 2023 IELTS Writing Band Descriptors
   * indicating negative features that strictly limit/cap a rating.
   */
  limitingFeatures: {
    criterion: 'TA_TR' | 'CC' | 'LR' | 'GRA' | 'ALL';
    rule: string;
  }[];
}

export interface WritingCalibrationSample {
  id: string;
  source: 'official_ielts' | 'ielts_advantage' | 'custom_teacher';
  taskType: WritingTaskType;
  taskNumber: WritingTaskNumber;
  subtype: WritingTaskSubtype | string;
  title: string;
  prompt: string;
  visualGroundTruth?: string;
  candidateScript: string;
  wordCount: number;
  overallBand: number;
  criteria?: {
    taOrTr: number;
    cc: number;
    lr: number;
    gra: number;
  };
  examinerComment: string;
  keyTakeaways: string[];
  createdAt?: string;
}

/**
 * OFFICIAL IELTS WRITING TASK 1 BAND DESCRIPTORS (Updated May 2023)
 * Note: "A script must fully fit the positive features of the descriptor at a particular level.
 * Bolded text indicates negative features that will limit a rating."
 */
export const TASK_1_BAND_DESCRIPTORS: CriterionBandDescriptor[] = [
  {
    band: 9,
    taskAchievementOrResponse: [
      'All the requirements of the task are fully and appropriately satisfied.',
      'There may be extremely rare lapses in content.',
    ],
    coherenceCohesion: [
      'The message can be followed effortlessly.',
      'Cohesion is used in such a way that it very rarely attracts attention.',
      'Any lapses in coherence or cohesion are minimal.',
      'Paragraphing is skilfully managed.',
    ],
    lexicalResource: [
      'Full flexibility and precise use are evident within the scope of the task.',
      'A wide range of vocabulary is used accurately and appropriately with very natural and sophisticated control of lexical features.',
      'Minor errors in spelling and word formation are extremely rare and have minimal impact on communication.',
    ],
    grammaticalRange: [
      'A wide range of structures within the scope of the task is used with full flexibility and control.',
      'Punctuation and grammar are used appropriately throughout.',
      'Minor errors are extremely rare and have minimal impact on communication.',
    ],
    limitingFeatures: [],
  },
  {
    band: 8,
    taskAchievementOrResponse: [
      'The response covers all the requirements of the task appropriately, relevantly and sufficiently.',
      'There may be occasional omissions or lapses in content.',
    ],
    academicSpecific: [
      '(Academic) Key features are skilfully selected, and clearly presented, highlighted and illustrated.',
    ],
    generalTrainingSpecific: [
      '(General Training) All bullet points are clearly presented, and appropriately illustrated or extended.',
    ],
    coherenceCohesion: [
      'The message can be followed with ease.',
      'Information and ideas are logically sequenced, and cohesion is well managed.',
      'Occasional lapses in coherence or cohesion may occur.',
      'Paragraphing is used sufficiently and appropriately.',
    ],
    lexicalResource: [
      'A wide resource is fluently and flexibly used to convey precise meanings within the scope of the task.',
      'There is skilful use of uncommon and/or idiomatic items when appropriate, despite occasional inaccuracies in word choice and collocation.',
      'Occasional errors in spelling and/or word formation may occur, but have minimal impact on communication.',
    ],
    grammaticalRange: [
      'A wide range of structures within the scope of the task is flexibly and accurately used.',
      'The majority of sentences are error-free, and punctuation is well managed.',
      'Occasional, non-systematic errors and inappropriacies occur, but have minimal impact on communication.',
    ],
    limitingFeatures: [],
  },
  {
    band: 7,
    taskAchievementOrResponse: [
      'The response covers the requirements of the task.',
      'The content is relevant and accurate – there may be a few omissions or lapses. The format is appropriate.',
    ],
    academicSpecific: [
      '(Academic) Key features which are selected are covered and clearly highlighted but could be more fully or more appropriately illustrated or extended.',
      '(Academic) It presents a clear overview, the data are appropriately categorised, and main trends or differences are identified.',
    ],
    generalTrainingSpecific: [
      '(General Training) All bullet points are covered and clearly highlighted but could be more fully or more appropriately illustrated or extended. It presents a clear purpose. The tone is consistent and appropriate to the task. Any lapses are minimal.',
    ],
    coherenceCohesion: [
      'Information and ideas are logically organised and there is a clear progression throughout the response. A few lapses may occur.',
      'A range of cohesive devices including reference and substitution is used flexibly but with some inaccuracies or some over/under use.',
    ],
    lexicalResource: [
      'The resource is sufficient to allow some flexibility and precision.',
      'There is some ability to use less common and/or idiomatic items.',
      'An awareness of style and collocation is evident, though inappropriacies occur.',
      'There are only a few errors in spelling and/or word formation, and they do not detract from overall clarity.',
    ],
    grammaticalRange: [
      'A variety of complex structures is used with some flexibility and accuracy.',
      'Grammar and punctuation are generally well controlled, and error-free sentences are frequent.',
      'A few errors in grammar may persist, but these do not impede communication.',
    ],
    limitingFeatures: [],
  },
  {
    band: 6,
    taskAchievementOrResponse: [
      'The response focuses on the requirements of the task and an appropriate format is used.',
      'Some irrelevant, inappropriate or inaccurate information may occur in areas of detail or when illustrating or extending the main points.',
      'Some details may be missing (or excessive) and further extension or illustration may be needed.',
    ],
    academicSpecific: [
      '(Academic) Key features which are selected are covered and adequately highlighted. A relevant overview is attempted. Information is appropriately selected and supported using figures/data.',
    ],
    generalTrainingSpecific: [
      '(General Training) All bullet points are covered and adequately highlighted. The purpose is generally clear. There may be minor inconsistencies in tone.',
    ],
    coherenceCohesion: [
      'Information and ideas are generally arranged coherently and there is a clear overall progression.',
      'Cohesive devices are used to some good effect but cohesion within and/or between sentences may be faulty or mechanical due to misuse, overuse or omission.',
      'The use of reference and substitution may lack flexibility or clarity and result in some repetition or error.',
    ],
    lexicalResource: [
      'The resource is generally adequate and appropriate for the task.',
      'The meaning is generally clear in spite of a rather restricted range or a lack of precision in word choice.',
      'If the writer is a risk-taker, there will be a wider range of vocabulary used but higher degrees of inaccuracy or inappropriacy.',
      'There are some errors in spelling and/or word formation, but these do not impede communication.',
    ],
    grammaticalRange: [
      'A mix of simple and complex sentence forms is used but flexibility is limited.',
      'Examples of more complex structures are not marked by the same level of accuracy as in simple structures.',
      'Errors in grammar and punctuation occur, but rarely impede communication.',
    ],
    limitingFeatures: [],
  },
  {
    band: 5,
    taskAchievementOrResponse: [
      'The response generally addresses the requirements of the task. The format may be inappropriate in places.',
      'There may be a tendency to focus on details (without referring to the bigger picture).',
      'The inclusion of irrelevant, inappropriate or inaccurate material in key areas detracts from the task achievement.',
      'There is limited detail when extending and illustrating the main points.',
    ],
    academicSpecific: [
      '(Academic) Key features which are selected are not adequately covered. The recounting of detail is mainly mechanical. There may be no data to support the description.',
    ],
    generalTrainingSpecific: [
      '(General Training) All bullet points are presented but one or more may not be adequately covered. The purpose may be unclear at times. The tone may be variable and sometimes inappropriate.',
    ],
    coherenceCohesion: [
      'Organisation is evident but is not wholly logical and there may be a lack of overall progression. Nevertheless, there is a sense of underlying coherence to the response.',
      'The relationship of ideas can be followed but the sentences are not fluently linked to each other.',
      'There may be limited/overuse of cohesive devices with some inaccuracy.',
      'The writing may be repetitive due to inadequate and/or inaccurate use of reference and substitution.',
    ],
    lexicalResource: [
      'The resource is limited but minimally adequate for the task.',
      'Simple vocabulary may be used accurately but the range does not permit much variation in expression.',
      'There may be frequent lapses in the appropriacy of word choice, and a lack of flexibility is apparent in frequent simplifications and/or repetitions.',
      'Errors in spelling and/or word formation may be noticeable and may cause some difficulty for the reader.',
    ],
    grammaticalRange: [
      'The range of structures is limited and rather repetitive.',
      'Although complex sentences are attempted, they tend to be faulty, and the greatest accuracy is achieved on simple sentences.',
      'Grammatical errors may be frequent and cause some difficulty for the reader.',
      'Punctuation may be faulty.',
    ],
    limitingFeatures: [
      {
        criterion: 'TA_TR',
        rule: '(Academic) There may be no data to support the description (caps Task Achievement at Band 5 if no figures/data are cited from a chart/table/graph).',
      },
    ],
  },
  {
    band: 4,
    taskAchievementOrResponse: [
      'The response is an attempt to address the task.',
      'The format may be inappropriate.',
      'Key features/bullet points which are presented may be irrelevant, repetitive, inaccurate or inappropriate.',
    ],
    academicSpecific: [
      '(Academic) Few key features have been selected.',
    ],
    generalTrainingSpecific: [
      '(General Training) Not all bullet points are presented.',
      '(General Training) The purpose of the letter is not clearly explained and may be confused. The tone may be inappropriate.',
    ],
    coherenceCohesion: [
      'Information and ideas are evident but not arranged coherently, and there is no clear progression within the response.',
      'Relationships between ideas can be unclear and/or inadequately marked. There is some use of basic cohesive devices, which may be inaccurate or repetitive.',
      'There is inaccurate use or a lack of substitution or referencing.',
    ],
    lexicalResource: [
      'The resource is limited and inadequate for or unrelated to the task. Vocabulary is basic and may be used repetitively.',
      'There may be inappropriate use of lexical chunks (e.g. memorised phrases, formulaic language and/or language from the input material).',
      'Inappropriate word choice and/or errors in word formation and/or in spelling may impede meaning.',
    ],
    grammaticalRange: [
      'A very limited range of structures is used.',
      'Subordinate clauses are rare and simple sentences predominate.',
      'Some structures are produced accurately but grammatical errors are frequent and may impede meaning.',
      'Punctuation is often faulty or inadequate.',
    ],
    limitingFeatures: [
      {
        criterion: 'TA_TR',
        rule: '(General Training) Not all bullet points are presented. The tone may be inappropriate. The format may be inappropriate.',
      },
      {
        criterion: 'LR',
        rule: 'The resource is limited and inadequate for or unrelated to the task.',
      },
      {
        criterion: 'GRA',
        rule: 'Subordinate clauses are rare and simple sentences predominate.',
      },
    ],
  },
  {
    band: 3,
    taskAchievementOrResponse: [
      'The response does not address the requirements of the task (possibly because of misunderstanding of the data/diagram/situation).',
      'Key features/bullet points which are presented may be largely irrelevant.',
      'Limited information is presented, and this may be used repetitively.',
    ],
    coherenceCohesion: [
      'There is no apparent logical organisation. Ideas are discernible but difficult to relate to each other.',
      'Minimal use of sequencers or cohesive devices. Those used do not necessarily indicate a logical relationship between ideas.',
      'There is difficulty in identifying referencing.',
    ],
    lexicalResource: [
      'The resource is inadequate (which may be due to the response being significantly underlength).',
      'Possible over-dependence on input material or memorised language.',
      'Control of word choice and/or spelling is very limited, and errors predominate. These errors may severely impede meaning.',
    ],
    grammaticalRange: [
      'Sentence forms are attempted, but errors in grammar and punctuation predominate (except in memorised phrases or those taken from the input material). This prevents most meaning from coming through.',
      'Length may be insufficient to provide evidence of control of sentence forms.',
    ],
    limitingFeatures: [
      {
        criterion: 'GRA',
        rule: 'Length may be insufficient to provide evidence of control of sentence forms.',
      },
    ],
  },
  {
    band: 2,
    taskAchievementOrResponse: [
      'The content barely relates to the task.',
    ],
    coherenceCohesion: [
      'There is little relevant message, or the entire response may be off-topic.',
      'There is little evidence of control of organisational features.',
    ],
    lexicalResource: [
      'The resource is extremely limited with few recognisable strings, apart from memorised phrases.',
      'There is no apparent control of word formation and/or spelling.',
    ],
    grammaticalRange: [
      'There is little or no evidence of sentence forms (except in memorised phrases).',
    ],
    limitingFeatures: [
      {
        criterion: 'CC',
        rule: 'The entire response may be off-topic.',
      },
    ],
  },
  {
    band: 1,
    taskAchievementOrResponse: [
      'Responses of 20 words or fewer are rated at Band 1.',
      'The content is wholly unrelated to the task.',
      'Any copied rubric must be discounted.',
    ],
    coherenceCohesion: [
      'Responses of 20 words or fewer are rated at Band 1.',
      'The writing fails to communicate any message and appears to be by a virtual non-writer.',
    ],
    lexicalResource: [
      'Responses of 20 words or fewer are rated at Band 1.',
      'No resource is apparent, except for a few isolated words.',
    ],
    grammaticalRange: [
      'Responses of 20 words or fewer are rated at Band 1.',
      'No rateable language is evident.',
    ],
    limitingFeatures: [
      {
        criterion: 'ALL',
        rule: 'Responses of 20 words or fewer (after discounting copied rubric) are rated at Band 1 across all criteria. Content wholly unrelated to the task is rated at Band 1.',
      },
    ],
  },
  {
    band: 0,
    taskAchievementOrResponse: [
      'Should only be used where a candidate did not attend or attempt the question in any way, used a language other than English throughout, or where there is proof that a candidate’s answer has been totally memorised.',
    ],
    coherenceCohesion: [],
    lexicalResource: [],
    grammaticalRange: [],
    limitingFeatures: [
      {
        criterion: 'ALL',
        rule: 'Where there is proof that a candidate’s answer has been totally memorised, rate at Band 0.',
      },
    ],
  },
];

/**
 * OFFICIAL IELTS WRITING TASK 2 BAND DESCRIPTORS (Updated May 2023)
 */
export const TASK_2_BAND_DESCRIPTORS: CriterionBandDescriptor[] = [
  {
    band: 9,
    taskAchievementOrResponse: [
      'The prompt is appropriately addressed and explored in depth.',
      'A clear and fully developed position is presented which directly answers the question/s.',
      'Ideas are relevant, fully extended and well supported.',
      'Any lapses in content or support are extremely rare.',
    ],
    coherenceCohesion: [
      'The message can be followed effortlessly.',
      'Cohesion is used in such a way that it very rarely attracts attention.',
      'Any lapses in coherence or cohesion are minimal.',
      'Paragraphing is skilfully managed.',
    ],
    lexicalResource: [
      'Full flexibility and precise use are widely evident.',
      'A wide range of vocabulary is used accurately and appropriately with very natural and sophisticated control of lexical features.',
      'Minor errors in spelling and word formation are extremely rare and have minimal impact on communication.',
    ],
    grammaticalRange: [
      'A wide range of structures is used with full flexibility and control.',
      'Punctuation and grammar are used appropriately throughout.',
      'Minor errors are extremely rare and have minimal impact on communication.',
    ],
    limitingFeatures: [],
  },
  {
    band: 8,
    taskAchievementOrResponse: [
      'The prompt is appropriately and sufficiently addressed.',
      'A clear and well-developed position is presented in response to the question/s.',
      'Ideas are relevant, well extended and supported.',
      'There may be occasional omissions or lapses in content.',
    ],
    coherenceCohesion: [
      'The message can be followed with ease.',
      'Information and ideas are logically sequenced, and cohesion is well managed.',
      'Occasional lapses in coherence and cohesion may occur.',
      'Paragraphing is used sufficiently and appropriately.',
    ],
    lexicalResource: [
      'A wide resource is fluently and flexibly used to convey precise meanings.',
      'There is skilful use of uncommon and/or idiomatic items when appropriate, despite occasional inaccuracies in word choice and collocation.',
      'Occasional errors in spelling and/or word formation may occur, but have minimal impact on communication.',
    ],
    grammaticalRange: [
      'A wide range of structures is flexibly and accurately used.',
      'The majority of sentences are error-free, and punctuation is well managed.',
      'Occasional, non-systematic errors and inappropriacies occur, but have minimal impact on communication.',
    ],
    limitingFeatures: [],
  },
  {
    band: 7,
    taskAchievementOrResponse: [
      'The main parts of the prompt are appropriately addressed.',
      'A clear and developed position is presented.',
      'Main ideas are extended and supported but there may be a tendency to over-generalise or there may be a lack of focus and precision in supporting ideas/material.',
    ],
    coherenceCohesion: [
      'Information and ideas are logically organised, and there is a clear progression throughout the response. (A few lapses may occur, but these are minor.)',
      'A range of cohesive devices including reference and substitution is used flexibly but with some inaccuracies or some over/under use.',
      'Paragraphing is generally used effectively to support overall coherence, and the sequencing of ideas within a paragraph is generally logical.',
    ],
    lexicalResource: [
      'The resource is sufficient to allow some flexibility and precision.',
      'There is some ability to use less common and/or idiomatic items.',
      'An awareness of style and collocation is evident, though inappropriacies occur.',
      'There are only a few errors in spelling and/or word formation and they do not detract from overall clarity.',
    ],
    grammaticalRange: [
      'A variety of complex structures is used with some flexibility and accuracy.',
      'Grammar and punctuation are generally well controlled, and error-free sentences are frequent.',
      'A few errors in grammar may persist, but these do not impede communication.',
    ],
    limitingFeatures: [],
  },
  {
    band: 6,
    taskAchievementOrResponse: [
      'The main parts of the prompt are addressed (though some may be more fully covered than others). An appropriate format is used.',
      'A position is presented that is directly relevant to the prompt, although the conclusions drawn may be unclear, unjustified or repetitive.',
      'Main ideas are relevant, but some may be insufficiently developed or may lack clarity, while some supporting arguments and evidence may be less relevant or inadequate.',
    ],
    coherenceCohesion: [
      'Information and ideas are generally arranged coherently and there is a clear overall progression.',
      'Cohesive devices are used to some good effect but cohesion within and/or between sentences may be faulty or mechanical due to misuse, overuse or omission.',
      'The use of reference and substitution may lack flexibility or clarity and result in some repetition or error.',
      'Paragraphing may not always be logical and/or the central topic may not always be clear.',
    ],
    lexicalResource: [
      'The resource is generally adequate and appropriate for the task.',
      'The meaning is generally clear in spite of a rather restricted range or a lack of precision in word choice.',
      'If the writer is a risk-taker, there will be a wider range of vocabulary used but higher degrees of inaccuracy or inappropriacy.',
      'There are some errors in spelling and/or word formation, but these do not impede communication.',
    ],
    grammaticalRange: [
      'A mix of simple and complex sentence forms is used but flexibility is limited.',
      'Examples of more complex structures are not marked by the same level of accuracy as in simple structures.',
      'Errors in grammar and punctuation occur, but rarely impede communication.',
    ],
    limitingFeatures: [],
  },
  {
    band: 5,
    taskAchievementOrResponse: [
      'The main parts of the prompt are incompletely addressed. The format may be inappropriate in places.',
      'The writer expresses a position, but the development is not always clear.',
      'Some main ideas are put forward, but they are limited and are not sufficiently developed and/or there may be irrelevant detail.',
      'There may be some repetition.',
    ],
    coherenceCohesion: [
      'Organisation is evident but is not wholly logical and there may be a lack of overall progression. Nevertheless, there is a sense of underlying coherence to the response.',
      'The relationship of ideas can be followed but the sentences are not fluently linked to each other.',
      'There may be limited/overuse of cohesive devices with some inaccuracy.',
      'The writing may be repetitive due to inadequate and/or inaccurate use of reference and substitution.',
      'Paragraphing may be inadequate or missing.',
    ],
    lexicalResource: [
      'The resource is limited but minimally adequate for the task.',
      'Simple vocabulary may be used accurately but the range does not permit much variation in expression.',
      'There may be frequent lapses in the appropriacy of word choice and a lack of flexibility is apparent in frequent simplifications and/or repetitions.',
      'Errors in spelling and/or word formation may be noticeable and may cause some difficulty for the reader.',
    ],
    grammaticalRange: [
      'The range of structures is limited and rather repetitive.',
      'Although complex sentences are attempted, they tend to be faulty, and the greatest accuracy is achieved on simple sentences.',
      'Grammatical errors may be frequent and cause some difficulty for the reader.',
      'Punctuation may be faulty.',
    ],
    limitingFeatures: [
      {
        criterion: 'TA_TR',
        rule: 'The main parts of the prompt are incompletely addressed (caps Task Response at Band 5).',
      },
      {
        criterion: 'CC',
        rule: 'Paragraphing may be inadequate or missing (caps Coherence & Cohesion at Band 5).',
      },
    ],
  },
  {
    band: 4,
    taskAchievementOrResponse: [
      'The prompt is tackled in a minimal way, or the answer is tangential, possibly due to some misunderstanding of the prompt. The format may be inappropriate.',
      'A position is discernible, but the reader has to read carefully to find it.',
      'Main ideas are difficult to identify and such ideas that are identifiable may lack relevance, clarity and/or support.',
      'Large parts of the response may be repetitive.',
    ],
    coherenceCohesion: [
      'Information and ideas are evident but not arranged coherently and there is no clear progression within the response.',
      'Relationships between ideas can be unclear and/or inadequately marked. There is some use of basic cohesive devices, which may be inaccurate or repetitive.',
      'There is inaccurate use or a lack of substitution or referencing.',
      'There may be no paragraphing and/or no clear main topic within paragraphs.',
    ],
    lexicalResource: [
      'The resource is limited and inadequate for or unrelated to the task. Vocabulary is basic and may be used repetitively.',
      'There may be inappropriate use of lexical chunks (e.g. memorised phrases, formulaic language and/or language from the input material).',
      'Inappropriate word choice and/or errors in word formation and/or in spelling may impede meaning.',
    ],
    grammaticalRange: [
      'A very limited range of structures is used.',
      'Subordinate clauses are rare and simple sentences predominate.',
      'Some structures are produced accurately but grammatical errors are frequent and may impede meaning.',
      'Punctuation is often faulty or inadequate.',
    ],
    limitingFeatures: [
      {
        criterion: 'TA_TR',
        rule: 'The format may be inappropriate (caps Task Response at Band 4).',
      },
      {
        criterion: 'LR',
        rule: 'The resource is limited and inadequate for or unrelated to the task.',
      },
      {
        criterion: 'GRA',
        rule: 'Subordinate clauses are rare and simple sentences predominate.',
      },
    ],
  },
  {
    band: 3,
    taskAchievementOrResponse: [
      'No part of the prompt is adequately addressed, or the prompt has been misunderstood.',
      'No relevant position can be identified, and/or there is little direct response to the question/s.',
      'There are few ideas, and these may be irrelevant or insufficiently developed.',
    ],
    coherenceCohesion: [
      'There is no apparent logical organisation. Ideas are discernible but difficult to relate to each other.',
      'There is minimal use of sequencers or cohesive devices. Those used do not necessarily indicate a logical relationship between ideas.',
      'There is difficulty in identifying referencing.',
      'Any attempts at paragraphing are unhelpful.',
    ],
    lexicalResource: [
      'The resource is inadequate (which may be due to the response being significantly underlength). Possible over-dependence on input material or memorised language.',
      'Control of word choice and/or spelling is very limited, and errors predominate. These errors may severely impede meaning.',
    ],
    grammaticalRange: [
      'Sentence forms are attempted, but errors in grammar and punctuation predominate (except in memorised phrases or those taken from the input material). This prevents most meaning from coming through.',
      'Length may be insufficient to provide evidence of control of sentence forms.',
    ],
    limitingFeatures: [
      {
        criterion: 'GRA',
        rule: 'Length may be insufficient to provide evidence of control of sentence forms.',
      },
    ],
  },
  {
    band: 2,
    taskAchievementOrResponse: [
      'The content is barely related to the prompt.',
      'No position can be identified.',
      'There may be glimpses of one or two ideas without development.',
    ],
    coherenceCohesion: [
      'There is little relevant message, or the entire response may be off-topic.',
      'There is little evidence of control of organisational features.',
    ],
    lexicalResource: [
      'The resource is extremely limited with few recognisable strings, apart from memorised phrases.',
      'There is no apparent control of word formation and/or spelling.',
    ],
    grammaticalRange: [
      'There is little or no evidence of sentence forms (except in memorised phrases).',
    ],
    limitingFeatures: [
      {
        criterion: 'CC',
        rule: 'The entire response may be off-topic.',
      },
    ],
  },
  {
    band: 1,
    taskAchievementOrResponse: [
      'Responses of 20 words or fewer are rated at Band 1.',
      'The content is wholly unrelated to the prompt.',
      'Any copied rubric must be discounted.',
    ],
    coherenceCohesion: [
      'Responses of 20 words or fewer are rated at Band 1.',
      'The writing fails to communicate any message and appears to be by a virtual non-writer.',
    ],
    lexicalResource: [
      'Responses of 20 words or fewer are rated at Band 1.',
      'No resource is apparent, except for a few isolated words.',
    ],
    grammaticalRange: [
      'Responses of 20 words or fewer are rated at Band 1.',
      'No rateable language is evident.',
    ],
    limitingFeatures: [
      {
        criterion: 'ALL',
        rule: 'Responses of 20 words or fewer (after discounting copied rubric) are rated at Band 1. Content wholly unrelated to the prompt is rated at Band 1.',
      },
    ],
  },
  {
    band: 0,
    taskAchievementOrResponse: [
      'Should only be used where a candidate did not attend or attempt the question in any way, used a language other than English throughout, or where there is proof that a candidate’s answer has been totally memorised.',
    ],
    coherenceCohesion: [],
    lexicalResource: [],
    grammaticalRange: [],
    limitingFeatures: [
      {
        criterion: 'ALL',
        rule: 'Where there is proof that a candidate’s answer has been totally memorised, rate at Band 0.',
      },
    ],
  },
];

/**
 * Core IELTS Examiner & IELTS Advantage Marking Principles
 */
export const IELTS_WRITING_CORE_PRINCIPLES = [
  '1. POSITIVE FIT & NEGATIVE LIMITERS: A script must fully fit the positive features of the descriptor at a particular level. Bolded negative features in the May 2023 descriptors strictly cap the score for that criterion.',
  '2. ACCURACY BEATS FORCED COMPLEXITY (IELTS Advantage Principle): High-scoring Band 7-9 responses do not force obscure vocabulary or overly convoluted sentences. A response with clear, natural, accurate language and logical structure always outscores a response with complex vocabulary/structures used inaccurately.',
  '3. COPIED RUBRIC DISCOUNTING: Any sentences or clauses copied verbatim from the task prompt/rubric must be discounted from the candidate word count and cannot be credited for Lexical Resource or Grammatical Range.',
  '4. ACADEMIC TASK 1 SPECIFICS: Academic Task 1 is an information-transfer task relating narrowly to the factual content of the visual input (no speculative explanations outside the given data). To reach Band 7+ in Task Achievement, the response MUST include a clear Overview summarizing the main trends/stages/differences, and key features must be supported with accurate figures/data. If no data/figures are cited in a data chart/table, TA is capped at Band 5. Using a letter format (e.g., "Dear Sir") in Academic Task 1 is an inappropriate format and penalizes TA.',
  '5. GENERAL TRAINING TASK 1 SPECIFICS: Must cover all three bullet points clearly, present a clear purpose from the opening, and maintain a consistent, appropriate tone (formal for unknown recipients/companies, semi-formal for known managers/landlords/colleagues, personal/informal for friends).',
  '6. TASK 2 SPECIFICS: Must address all parts of the prompt, present a clear position throughout the entire essay (not only in the conclusion), and extend/support main ideas with relevant explanations or examples.',
  '7. ZERO HALLUCINATION OF EVIDENCE: Every evidence quote and correction MUST be an exact verbatim substring from the candidate essay.',
];

/**
 * BUILT-IN CALIBRATED BENCHMARK SAMPLES
 * Includes:
 * - Official IELTS Academic Writing Sample Tasks (Scripts & Verbatim Examiner Comments across Bands 4.0 to 8.5)
 * - IELTS Advantage Validated High-Band (Band 7.0 - 9.0) Task 1 Academic & General Training Samples
 */
export const BUILTIN_WRITING_CALIBRATION_SAMPLES: WritingCalibrationSample[] = [
  // ============================================================================
  // PART 1: OFFICIAL IELTS ACADEMIC WRITING SAMPLE SCRIPTS & EXAMINER COMMENTS
  // ============================================================================
  {
    id: 'official-1a-script-a',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Official Task 1A (Further Education in Britain) - Sample Script A (Band 5)',
    prompt:
      'The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Bar chart showing Men and Women in further education in Britain (in thousands) across 1970/71, 1980/81, and 1990/91, split into Full-time education and Part-time education. Male part-time: 1000k (1970/71), ~850k (1980/81), ~900k (1990/91). Male full-time: ~100k (1970/71), ~150k (1980/81), ~250k (1990/91). Female part-time: ~750k (1970/71), ~820k (1980/81), ~1100k (1990/91). Female full-time: ~60k (1970/71), ~220k (1980/81), ~250k (1990/91).',
    candidateScript: `This is a bar chart of the number of men and women in further education in Britain in three periods. In 1970, Most of Men were studying part-time but from 1980, studying part-time was decreased and studying full-time was increased and in 1990, it was twice as many students as in 1970. On the other hand, Women studying Full-time were increased and not only Full-time, part-time also were increased. In 1990, studying full-time was three times as many students as in 1970. If compare Men and Women, as you see, in 1970, Men were studying more than women full-time or part-time but it changed from 1980 and then, in 1990, Women were studying part-time more than Men and studying full-time was same number.
It shows you Women has a high education now.`,
    wordCount: 138,
    overallBand: 5.0,
    criteria: { taOrTr: 5.0, cc: 5.0, lr: 5.0, gra: 5.0 },
    examinerComment:
      'There is a good attempt to describe the overall trends but the content would have been greatly improved if the candidate had included some reference to the figures given on the graph. Without these, the reader is lacking some important information. The answer is quite difficult to follow and there are some punctuation errors that cause confusion. The structures are fairly simple and efforts to produce more complex sentences are not successful.',
    keyTakeaways: [
      'Failing to include specific figures/numbers from the chart caps Task Achievement at Band 5 ("There may be no data to support the description").',
      'Ending with a speculative subjective conclusion ("It shows you Women has a high education now") is inappropriate for Academic Task 1.',
      'Faulty complex sentences and passive voice errors ("studying part-time was decreased") limit GRA to Band 5.',
    ],
  },
  {
    id: 'official-1a-script-b',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Official Task 1A (Further Education in Britain) - Sample Script B (Band 6)',
    prompt:
      'The chart below shows the number of men and women in further education in Britain in three periods and whether they were studying full-time or part-time. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Bar chart showing Men and Women in further education in Britain (in thousands) across 1970/71, 1980/81, and 1990/91, split into Full-time education and Part-time education.',
    candidateScript: `According to this graph, the number of men and women in further education in Britain shows the following pattern.
In the case of male, the number of male has declined slightly from about 1000 thousands in 1970/71 to about 850 thousands in 1990/91. However, this figure rose back to about 850 thousands in 1990/91 from about 820 thousands in 1980/81. The proportion of full-time education has declined during this period. However, the proportion of part-time education has increased dramatically.
On the other hand, in the case of female, the number of both full-time education and part-time education has increased during the period.
From about 700 thousands in 1970/71, these figures rose to about 820 thousands in 1980/81, to about 1100 thousands in 1990/91.
In terms of full-time education, this figure rose by about 260 to about 900 in 1990/91.
On the other hand, with respect to part-time education, this figure rose dramatically between 1980/81 and 1970/71. However this figure rose slightly between 1980/81 and 1990/91.`,
    wordCount: 165,
    overallBand: 6.0,
    criteria: { taOrTr: 6.0, cc: 6.0, lr: 6.0, gra: 6.0 },
    examinerComment:
      'The candidate has made a good attempt to describe the graphs looking at global trends and more detailed figures. There is, however, some information missing and the information is inaccurate in minor areas. The answer flows quite smoothly although connectives are overused or inappropriate, and some of the points do not link up well. The grammatical accuracy is quite good and the language used to describe the trends is well-handled. However, there are problems with expression and the appropriate choice of words and whilst there is good structural control, the complexity and variation in the sentences are limited.',
    keyTakeaways: [
      'Citing data elevates TA to Band 6, but minor data inaccuracies (confusing full-time and part-time bars for males) prevent Band 7.',
      'Mechanical overuse of sentence-initial connectives ("However", "On the other hand" repeated twice) limits Coherence & Cohesion to Band 6.',
      'Repetitive simple sentence patterns ("this figure rose...") limit Grammatical Range to Band 6 despite reasonable accuracy.',
    ],
  },
  {
    id: 'official-1b-script-a',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Official Task 1B (Radio & TV Audiences 1992) - Sample Script A (Band 6)',
    prompt:
      'The graph below shows radio and television audiences throughout the day in 1992. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Line graph: Radio and television audiences in UK, October-December 1992 (% of UK population over 4 years old across 24 hours from 6:00 AM to 6:00 AM). Radio peaks at ~27% around 8:00 AM, then declines gradually through the day to ~2% at night. Television starts low (<10% morning), rises in afternoon (~15% at 2:00 PM), surges after 4:00 PM to peak at ~45% around 8:00 PM, then drops sharply after 10:00 PM.',
    candidateScript: `The graph shows the percentage of audiences over 4 yes old of UK follows the radio and television throughout the day during the period October-December 1992. It has been observed from the graph that less than 10% audiences follows the radio at 6:00 am and the percentage raised to a pick around 30% at 8 AM and decline gradually to around 10% during the period 2:00 to 4:00 PM and again raised a bit to around 12% between 4:00 to 6:00 PM. It then again dropped to below 10% at around 10 PM. The rate again raised to a bit between 10:00 PM to 12:00 PM and then dropped slowly by 4:00 AM. On the other hand, the rate of television audiences raises 0-10% during the period 6:00 to 8:00 am and remain steady up to 10 AM and then gradually goes down by 12:00 noon. The percentage raised dramatically to around 15% by 2:00 PM which again raised to a pick above 40% between 6:00-8:00 PM and then gradually dropped between the period 12:00 PM to 4:00 AM.`,
    wordCount: 179,
    overallBand: 6.0,
    criteria: { taOrTr: 6.0, cc: 6.0, lr: 6.0, gra: 6.0 },
    examinerComment:
      'The answer has an appropriate introduction which the candidate has attempted to express in their own words. There is good coverage of the data and a brief reference to contrasting trends. The answer can be followed although it is rather repetitive and cohesive devices are overused. In order to gain a higher mark for content, the candidate would be expected to summarise the most important features of the graph in an overview, for example, ‘audiences for radio peak in the morning, and for TV, in the evening’. There is some flexibility and precision in the range of vocabulary used. Sentences are long but do lack complexity. To score more highly there would be fewer errors in tense, verb form and spelling which interfere slightly with the flow of the answer.',
    keyTakeaways: [
      'Recounting data chronologically from 6:00 AM to 4:00 AM without a clear Overview summarizing the main contrast (radio peaks in the morning vs TV peaks in the evening) caps Task Achievement at Band 6.',
      'Frequent tense/verb errors (using "raised" instead of "rose", "pick" instead of "peak") hold LR and GRA to Band 6.',
    ],
  },
  {
    id: 'official-1b-script-b',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'Official Task 1B (Radio & TV Audiences 1992) - Sample Script B (Band 7)',
    prompt:
      'The graph below shows radio and television audiences throughout the day in 1992. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Line graph: Radio and television audiences in UK, October-December 1992 (% of UK population over 4 years old across 24 hours).',
    candidateScript: `The bold graph shows the television audiences throughout the day. It shows that the percentage of audiences is zero percent in early morning but it gradually rises upto ten percent at 8:00 am and maintains the same for the next two hours. There is a slight fall in percentage in next two hours however after that it rises sharp upto twenty percent within the next two hours. After this the graph rises very fast and attains its peak at 10 pm which is about forty five percent. The graph gradually falls down and at 2:00 am it is at five percent. The thinner graph shows the percentage of radio audiences. Unlike the television one the peak percentage of the radio audiences is at 8:00 am which is about 30 percent. Then it gradually falls and it corresponds with the television one at two pm. After that it gradually falls but with a small increase in percentage at 4:30 to 6:00 pm. The percentage of audience then gradually goes down and at four AM it is the lowest which is near 2 percentage. These graphs proves the progressive popularity of television.`,
    wordCount: 188,
    overallBand: 7.0,
    criteria: { taOrTr: 7.0, cc: 7.0, lr: 7.0, gra: 7.0 },
    examinerComment:
      'The answer deals well with both the individual media trends and the overall comparison of these trends. The opening could be more fully developed with the inclusion of information relating to the groups studied and the period of time during which the study took place. There is a good variety of cohesive devices and the message can be followed quite easily although the expression is sometimes a little clumsy. Structures are complex and vocabulary is varied but there are errors in word forms, tense and voice though these do not impede communication.',
    keyTakeaways: [
      'Explicitly comparing the two lines ("Unlike the television one the peak percentage of the radio audiences is at 8:00 am...", "it corresponds with the television one at two pm") satisfies Band 7 comparison requirements.',
      'Even at Band 7, minor errors in word forms ("rises sharp") and tense/agreement ("These graphs proves") can persist provided they do not impede communication.',
    ],
  },
  {
    id: 'official-1c-script-a',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'process',
    title: 'Official Task 1C (Brick Manufacturing Process) - Sample Script A (Band 5)',
    prompt:
      'The diagram below shows the process by which bricks are manufactured for the building industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Process diagram: Brick Manufacturing. 1) Digger excavates clay. 2) Clay sifted through metal grid onto roller. 3) Sand + water added. 4) Shaped by wire cutter or mould into bricks. 5) Drying oven for 24-48 hrs. 6) Kiln (moderate 200C-980C, then high 870C-1300C) then cooling chamber for 48-72 hrs. 7) Packaging and delivery.',
    candidateScript: `Bricks are small shaped figures which are used for building.
First of all digger dig the ground untill the clay level. Next the type of sticky earth that is used for making bricks are on the metal grid which selected special parts of clay and threw them on the roller. Then in the manufactureing process sand + water are filled in. The sand gives the texture for bricks. After that the solid is ready to go through wire cutter or moulding. This process makes shapes of the bricks.
When the figures have got their shape, these items can be put in the drying oven, where they stayed for 24-48 hours. The temperature is moderate between 200°C and 980°C in the kiln and high between 870°C and 1300°C. Finally these hot items go to the cooling chamber and get cold from 48-72 hours. The last part of the manufactureing process is packaging and delivery to the consumption.`,
    wordCount: 158,
    overallBand: 5.0,
    criteria: { taOrTr: 5.0, cc: 5.0, lr: 5.0, gra: 5.0 },
    examinerComment:
      'Although the basic process is accurately described, this script fails to present an overview and some of the key features are not adequately covered. The first sentence may have been an attempt at an overview but it simply causes confusion and detracts from the answer. Despite this, the overall progression is clear and there is effective, though mechanical, use of linkers and sequencers. There are also examples of substitution and referencing, although sentences are not always well linked. The vocabulary is minimally adequate for the task. Spelling is generally accurate but there are inappropriate word choices, omissions and errors in word form. Some attempts at subordination and complex nominalisations are made, but generally the structures are limited and there are frequent errors. Overall this is a good example of a Band 5 performance.',
    keyTakeaways: [
      'A process report without a valid Overview summarizing the process stages is limited to Band 5 for Task Achievement.',
      'Mechanical sequence markers ("First of all", "Next", "Then", "After that", "Finally") show underlying organization but lack Band 6-7 cohesion.',
    ],
  },
  {
    id: 'official-1c-script-b',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'process',
    title: 'Official Task 1C (Brick Manufacturing Process) - Sample Script B (Band 7)',
    prompt:
      'The diagram below shows the process by which bricks are manufactured for the building industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Process diagram: Brick Manufacturing from clay excavation to delivery.',
    candidateScript: `Dear Sir, I am writing a report about brick manufacturing. The following are as follows. Brick manufacturing starts with choosing good quality clay. A large digger similar to a crane digs the clay. The process takes about half a day after which it is put on metal grid to separate unwanted silt and impurities. The strained clay is then put in a large machine roller where it is mixed with sand and water to be moulded later to form the base of the brick. While it is still soft, wire cutters are used to perfectly cut the bricks removing the rough edges. The soft bricks are then put in a drying oven where it stays from 24-48 hours. After the pre-set drying time, the bricks are then put in large kilns where it is baked at moderate heat of about 200-980°C. The bricks are first put in moderate heat to avoid cracking. After about few minutes, the bricks are then fired to a high 870-1,300°C heat. This is the final heating or 'cooking' stage so to speak for the bricks. Just beside the kiln is the cooling chamber which is made up of large steel where the bricks will stay for about 48-72 hours. The bricks are then ready for packaging where the brick workers carefully pack the bricks in large container vans for delivery. The whole process is fairly an easy one because there are no sophisticated machines used. The only thing that bothered me was during the heating process because as the manager told me, I have to stay and observe while the clay is being 'cooked' because some of the clays do tend to crack easily because of the wrong sand and water mixture from the start. If this happens, the process has to be repeated again which can be quite lengthy.`,
    wordCount: 309,
    overallBand: 7.0,
    criteria: { taOrTr: 5.5, cc: 7.0, lr: 8.0, gra: 8.0 },
    examinerComment:
      'This test taker uses an inappropriate format at times (e.g. the letter-style opening and personal comments) and this limits the band for Task Achievement. The process itself is adequately described, although some irrelevant information is included and there is no clear overview. Information is logically organised and there is a clear progression throughout the response. A range of cohesive devices is used appropriately, although there are occasional errors in referencing and linking, and paragraphing would have helped convey a clearer description of the stages. A wide range of sophisticated lexis is used to convey meaning with precision, but there are also occasional flaws in word choice that lead to some slightly awkward expressions. A wide range of structures is also used fluently with only occasional slight error and the majority of sentences are error-free. In spite of the high level of language proficiency, the flaws in format and organisation limit the rating for this response to Band 7.',
    keyTakeaways: [
      'CRITICAL CALIBRATION RULE: Even when Lexical Resource and Grammatical Range are Band 8, using a letter opening ("Dear Sir...") and inventing personal narrative ("as the manager told me") in Academic Task 1 severely penalizes Task Achievement, pulling the overall Task 1 score down to Band 7.',
      'Lack of paragraphing (writing the entire response as one giant block) limits Coherence & Cohesion.',
    ],
  },
  {
    id: 'official-1c-script-c',
    source: 'official_ielts',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'process',
    title: 'Official Task 1C (Brick Manufacturing Process) - Sample Script C (Band 8.5)',
    prompt:
      'The diagram below shows the process by which bricks are manufactured for the building industry. Summarise the information by selecting and reporting the main features, and make comparisons where relevant.',
    visualGroundTruth:
      'Process diagram: Brick Manufacturing in 7 consecutive steps.',
    candidateScript: `The process by which bricks are manufactured for the building industry can be outlined in seven consecutive steps. First the raw material, clay, which lies just below the surface of soil in certain clay-rich areas has to be dug up by a digger.
Then the lumps of clay are placed on a metal grid, in order to break up the big chunks of clay into much smaller ones, which fall through the metal grid onto a roller, whose motion further segregates the bits of clay. Sand and water are added to make a homogenous mixture, which is then either formed in moulds or cut into brick-shaped pieces by means of a wire cutter.
Those fresh bricks are then kept in a drying oven for at least 24 and a maximum of 48 hours, several dozens if not hundreds of bricks at a time. The dried bricks are then transferred to a so-called kiln, another type of high temperature oven. First they are kept at a moderate temperature of 200°C - 980°C, then at a high temperature of 870°C - 1300°C. This process is followed by cooling down the finished bricks for 48 to 72 hours in a cooling chamber.
Once the bricks have cooled down and have become hard, they get packaged and delivered to their final destination, be it a building site or storage.`,
    wordCount: 225,
    overallBand: 8.5,
    criteria: { taOrTr: 8.0, cc: 9.0, lr: 8.5, gra: 8.5 },
    examinerComment:
      'This response fully satisfies the requirements of the task. All key features of each stage of the process are appropriately and accurately presented. There is an overview in the first paragraph indicating that there are ‘seven consecutive steps’ however for the highest score, a fuller overview would be needed, to summarise those key stages, for example; extracting the clay, then shaping, drying and delivering the bricks. The message is very easy to read with seamless cohesion. Paragraphing, linking and referencing are all skilfully managed. The language used is very fluent and sophisticated. A wide range of vocabulary and structures are used with full flexibility and accuracy within the scope of this task. Only rare minor errors can be found and these do not detract from communication or the high rating. This item is a good example of a very high-level response.',
    keyTakeaways: [
      'To move from Band 8 to Band 9 in Task Achievement on a process diagram, the overview must not only state the number of steps ("seven consecutive steps") but also summarize the key macro-stages (extracting, shaping, drying/firing, and delivering).',
      'Sophisticated passive constructions, relative clauses ("whose motion further segregates", "be it a building site or storage"), and precise lexis ("homogenous mixture") exemplify Band 8.5-9.0 LR and GRA.',
    ],
  },
  {
    id: 'official-2a-script-a',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'opinion',
    title: 'Official Task 2A (Family Wealth & Adult Life) - Sample Script A (Band 4)',
    prompt:
      'Children who are brought up in families that do not have large amounts of money are better prepared to deal with the problems of adult life than children brought up by wealthy parents. To what extent do you agree or disagree with this opinion?',
    candidateScript: `I disagree that point about children brought up in families. because I show that situation arounds me at our country parents. They want they had everything give to their children. but their behavior is not good effect to them. On the other hands, children brought up by wealthy parents, they are strong. that means they can do prepare to deal with the problems of adult life.
In my case, I start work from 20 ages I had social experience and I got a money for myself. however, My age is late to work by children ages and I heard about child doing work by another countries that countries had a culture about childrens. That is they doing work for their pocketmoney. they could their money buy something or entrance to the bank. also, our country childrens do this. but many childrens accept the money by their parents. which persons got a pocketmoney over the 20 ages. I think, if childrens had a work and they study at money, they perfectly prepared their adult life after they must be parents.`,
    wordCount: 177,
    overallBand: 4.0,
    criteria: { taOrTr: 4.0, cc: 4.0, lr: 4.0, gra: 4.0 },
    examinerComment:
      'While it is obviously related to the topic, the introduction is confusing and the test taker’s position is difficult to identify. Ideas are limited and although the test taker attempts to support them with examples from experience, they remain unclear. There is no overall progression in the response and the ideas are not coherently linked. Although cohesive devices are used, they assist only minimally in achieving coherence. The range of vocabulary is basic and control is inadequate for the task. Language from the input material is used inappropriately and frequent errors in word choice and collocation cause severe problems for the reader. Similarly, the range of structures is very limited, the density of grammatical and punctuation error is high and these features cause some difficulty for the reader. Attempts to use complex structures, such as subordination, are rare and tend to be very inaccurate.',
    keyTakeaways: [
      'A position that is confusing or contradicts itself in the body paragraphs caps Task Response at Band 4.',
      'Significantly underlength (177 words vs 250 minimum) combined with high error density in basic structures and word choice ("20 ages", "childrens") anchors Band 4.',
    ],
  },
  {
    id: 'official-2a-script-b',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'opinion',
    title: 'Official Task 2A (Family Wealth & Adult Life) - Sample Script B (Band 6.5)',
    prompt:
      'Children who are brought up in families that do not have large amounts of money are better prepared to deal with the problems of adult life than children brought up by wealthy parents. To what extent do you agree or disagree with this opinion?',
    candidateScript: `I greatly support the idea about children who are brought up in families that do not have large amounts of money are better prepared to deal with the problems of adult life than children brought up by wealthy parents. I support it, because of the following reason.
Children who are brought up in families that do not have large amounts of money are raise in a certain psychological values. Such as the value of hardworking, dicipline, they are used to be in the condition where money doesn't come easily. They have to earn it, work for it. Oppose to it, a child who comes from a wealthy family is used to have money all the time. Whenever they want something, the money is easily gave to them as if everyday are their birthday.
Children who are brought up in families that do not have large amounts of money are well-trained to face adulthood. They are well-prepared to see the fact that the world is a very tough place. They watched their parent everyday worked very hard just to put food on the table. They have the advantage to see the reality and embrace it, set their mind that they too have work hard for their future, their own dreams, their authentic self. A child that came from a wealthy family doesn't always have this advantage. This is because their eyes are blinded by the power of money, that their parent has. They also have a disadvantage of a family love life. Commonly wealthy parents express love by money. They love their children, so they bought them cars, expensive clothes, toys, but they are never home when their children needs them. The basic necessity of compassion isn't fulfilled in this kind of family. The impact to a child is that they will grow up and think that money is everything, that the source of happiness is money. They don't care about other people, they only care about money. The problem is they don't know how to get it, they've been spoiled all the time, so doesn't have the time to discovered the art of money making, only money spending. On the contrary children from families that do not have large amount of money will grow up with the sence of respect for money, they know how to get it and use it well. They know how to face adult life problems because they've been watching since they were a child. But a wealthy child is always to busy with himself to know that.`,
    wordCount: 426,
    overallBand: 6.5,
    criteria: { taOrTr: 7.0, cc: 6.0, lr: 7.0, gra: 6.0 },
    examinerComment:
      'The arguments in this response are generally well developed, ideas are appropriate and there is a clear position. (It is a shame that the first paragraph, and beginning of the second are mainly copied from the rubric.) Better use of paragraphing would have allowed a clearer focus to some of the supporting points and prevented the lapse into generalisation towards the end. Nevertheless, there is a generally clear progression with a good arrangement of opposing arguments. Referencing is usually accurate and effective, but better use of linkers would have improved the cohesion. Vocabulary is varied and used with some flexibility. The choice is not always precise but the test taker can evidently incorporate less common/idiomatic phrases into the argument and there is a good range that is generally accurate. The repetition of language from the rubric, while integrated, reveals a lack of ability to paraphrase. Regular errors detract from the use of a range of structures, although they do not detract from overall clarity. This is a generally good response to the task, but the weaknesses in organisation and grammatical control limit the rating to Band 6.5.',
    keyTakeaways: [
      'Repeating the prompt verbatim ("children who are brought up in families that do not have large amounts of money") three times shows a lack of paraphrasing ability.',
      'Strong idiomatic/collocational vocabulary ("put food on the table", "blinded by the power of money", "the art of money making") earns Band 7 in Lexical Resource even when Grammar is Band 6.',
      'Over-generalizing about wealthy parents ("they are never home", "they only care about money") is a classic Band 6/7 Task Response limitation.',
    ],
  },
  {
    id: 'official-2a-script-c',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'opinion',
    title: 'Official Task 2A (Family Wealth & Adult Life) - Sample Script C (Band 8.5)',
    prompt:
      'Children who are brought up in families that do not have large amounts of money are better prepared to deal with the problems of adult life than children brought up by wealthy parents. To what extent do you agree or disagree with this opinion?',
    candidateScript: `I do agree to the statement that children brought up in poor families are better prepared to deal with the problems of adult life than children brought up by wealthy parents.
Children of poor parents are prematurely exposed to the problems of adult life e.g. learning to survive on a low family income and sacrificing luxuries for essential items. These children begin to see the 'realities' of life in their home or social environment. Their parents own struggles serve as an example to them.
These children are taught necessary skills for survival as an adult from a very early age. Many children eg work in the weekends or holidays to either collect some pocket money or even contribute to their families' income. A good example is the many children who accompany their parents to sell produce at the market. They are making a direct contribution to their families in terms of labor or income.
Children of poor families also are highly motivated. They tend to set high goals to improve their economic & social situation. A relevant example would be Mr Bill Gates (founder of Microsoft Corporation). He had an impoverished background but he used his talent and motivation to set up the worlds largest computer organisation.
However, there are some problems that children from poor backgrounds do encounter. Many of these children who are 'robbed' of their childhood eg while working, may feel cheated. They often turn to crime. This however, is a small group.
In summing up, children with impoverished backgrounds are able to deal with problems of adult life because of early exposure, family role models and sheer motivation.`,
    wordCount: 274,
    overallBand: 8.5,
    criteria: { taOrTr: 8.0, cc: 8.5, lr: 9.0, gra: 8.5 },
    examinerComment:
      'The topic is very well addressed and explored in depth. The position is clear throughout and directly answers the question. The ideas presented are relevant and very well supported, apart from some over-generalisation in the penultimate paragraph. However, there is no mention of how well children from ‘wealthy parents’ deal with problems. Although this is not a requirement, it could be added to further improve the response. The ideas and information are very well organised and paragraphing is used appropriately throughout. The answer can be read with ease due to the sophisticated handling of cohesive devices, with only minimal lapses (for example, the use of ‘e.g.’). The writer uses a wide and very natural range of vocabulary with full flexibility. There are many examples of appropriate modification, collocation and precise vocabulary choice. Syntax is equally varied and sophisticated. There are only occasional errors in an otherwise very accurate answer. Overall this is a very strong performance and a good example of Band 8.5.',
    keyTakeaways: [
      'Notice how concise, natural, and well-structured this Band 8.5 essay is (274 words): each body paragraph has one clear central topic (early exposure to reality, practical survival skills, high motivation, concession on risks) supported by concrete examples.',
      'Using abbreviations like "e.g." or "&" in formal academic essays is noted by the examiner as a minor lapse in register/cohesion.',
    ],
  },
  {
    id: 'official-2b-script-a',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'discussion',
    title: 'Official Task 2B (International Tourism Outweigh) - Sample Script A (Band 5.5)',
    prompt:
      'International tourism has brought enormous benefit to many places. At the same time, there is concern about its impact on local inhabitants and the environment. Do the disadvantages of international tourism outweigh the advantages?',
    candidateScript: `International tourism has brought enormous benefit to many places. At the same time there is concern about it's impaction on local inhabitants and the environment. Do the disadvantages of international tourism outweight the advantages?
In my opinion advantages outweight the disadvantages. Firstly, many countries like Egypt or Thailand live from tourism. Lots of people work there as a sellomens or tourist guides. These countries without support of tourists wouldn't be able to function properly.
Secondly, in countries visited by tourists are plenty of places where people just can't pass because of rare animals or plants.
Another thing is that people like traveling and seeing new exotic places. They like lie on the beach or swim in ocean. Furthermore, tourism is now more growing industry hiphening thousands of people. There are making new places to work and to have fun.
But on the other hand, people often forget that they aren't the only beings on the planet.
Many tourists are living garbage just anywhere. Some of them want an exotic suvenir so they pay for illegal things like dead or live animals or some sculpture.
To sum up I think international traveling is a good thing but people must realise that there is something else besides them. They need to know that flora and fauna needs to be protected. People have to enjoy their holidays but also protect environment.`,
    wordCount: 229,
    overallBand: 5.5,
    criteria: { taOrTr: 5.5, cc: 5.5, lr: 5.0, gra: 6.0 },
    examinerComment:
      'The first five lines of this response are directly copied rubric; no credit is given for copied rubric. The topic is addressed and a relevant position is expressed, although there are patches (as in the fourth paragraph) where the development is unclear. Other ideas are more evidently relevant, but are sometimes insufficiently developed. In spite of this, ideas are clearly organised and there is an overall progression within the response. There is some effective use of a range of cohesive devices, including referencing, but there is also some mechanical use of linkers in places. Paragraphs are sometimes rather too short and inappropriate. A range of vocabulary is attempted and this is adequate for a good response to the task. However, control is weak and there are frequent spelling errors that can cause some difficulties for the reader, thus keeping the rating down for the lexical criterion. The test taker uses a mix of simple and complex structures with frequent subordinate clauses. Control of complex structures is variable, and although errors are noticeable they only rarely impede communication. Although there are some features of a higher band in this response, flaws in the paragraphing and the errors in vocabulary limit this rating to Band 5.5.',
    keyTakeaways: [
      'CRITICAL RULE: The first 33 words are copied directly from the prompt; when discounted, the essay is underlength (~196 words) and receives zero credit for the copied introduction.',
      'One-sentence paragraphs and noticeable spelling/word-choice errors ("sellomens", "living garbage", "suvenir") pull CC and LR down to Band 5-5.5.',
    ],
  },
  {
    id: 'official-2b-script-b',
    source: 'official_ielts',
    taskType: 'task_2',
    taskNumber: 2,
    subtype: 'discussion',
    title: 'Official Task 2B (International Tourism Outweigh) - Sample Script B (Band 7.5)',
    prompt:
      'International tourism has brought enormous benefit to many places. At the same time, there is concern about its impact on local inhabitants and the environment. Do the disadvantages of international tourism outweigh the advantages?',
    candidateScript: `'Tourism' - friend or foe?
Tourism is a very big industry in the modern time and is growing quite rapidly. Thousands of people travel everywhere to various destinations every year. Arguments have come up regarding the benefits and negative impacts of tourism in places and on its local inhabitants and environment; however, I believe there are more advantages than disadvantages of international tourism.
People travel for various reasons; they travel for business purpose, holidays, visit friends and relatives etc. Travelling is mostly seen as a recreational activity. Tourism has many advantages. Tourism can play a tremendous part in a country's economy, the more tourists visit a country and spend money there the better it is for the country; in that way more money is circulated within the country and even the stability of their currency rate of exchange persists if not improve. Vendors and shops get to sell more goods and make an income. Tourism also has its non-monetary advantages; it brings cultures and people closer. People from all around the world get to share their culture with each other and even learn more. This is a good opportunity in education.
Tourism seems to have some disadvantages too; however, I believe the problems caused by tourism are not something that cannot be solved or prevented. A lot of people believe that tourism can destroy or deviate culture and cause quite an impact on visited locations such as pollution and littering. People can adhere to their own beliefs and way of life if they want to; no one can really forcefully influence someone to change from their morals and ethics. Pollution can be avoided by increasing usage of environmental friendly vehicles used for tours and rents, warnings and visual education on littering and smoking. Specific times can be allocated for tours to certain areas, such as peak times where local inhabitants feel uncomfortable due to too many foreigners.
Where there are problems there can always be solutions. Tourism brings great amount of advantages for any place in many ways and is a 'win-win' exchange process. The very few problems caused can always be avoided or taken care of. I believe tourism should be highly promoted, specially in traditional and poor countries with natural beauty such as Bangladesh.`,
    wordCount: 376,
    overallBand: 7.5,
    criteria: { taOrTr: 7.5, cc: 7.0, lr: 8.0, gra: 7.5 },
    examinerComment:
      'The test taker addresses both aspects of the task and presents a clear position throughout the response. Ideas are relevant, well extended and supported, although there are occasional lapses in content (as in the opening of paragraph 2 and the tendency to ‘present solutions to the disadvantages’ in paragraph 3). However, ideas are logically organised and there is a clear progression. A range of cohesive devices is used effectively, but some under-use of connectives and substitution and some lapses in the use of referencing are noticeable. A wide range of vocabulary is used flexibly. The test taker can convey precise meanings, and although awkward expressions or inappropriacies in word choice occur, these are only occasional and do not limit the rating for this criterion. Likewise, a good range of sentence structures is used with a high level of accuracy resulting in frequent error-free sentences. Minor systematic errors persist, however, and punctuation is unhelpful at times. The strength of the appropriate response to the task, and the lexical resource in particular, mean overall this response is a good example of Band 7.5.',
    keyTakeaways: [
      'In an "outweigh" essay, spending too much of a body paragraph proposing policy solutions to the disadvantages rather than evaluating their weight is considered a minor lapse in Task Response (keeping TR at 7.5 rather than 8.5).',
      'Flexible topic-specific vocabulary ("circulated within the country", "non-monetary advantages", "adhere to their own beliefs") demonstrates Band 8 Lexical Resource.',
    ],
  },

  // ============================================================================
  // PART 2: IELTS ADVANTAGE CALIBRATED HIGH-BAND TASK 1 SAMPLES (ACADEMIC & GT)
  // ============================================================================
  {
    id: 'advantage-acad-bar-property-prices',
    source: 'ielts_advantage',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'IELTS Advantage Academic Task 1: Bar Chart (Property Price Growth 2007-2010)',
    prompt:
      'The bar graph below shows the percentage growth in average property prices in three different countries between 2007 and 2010. Summarise the information by selecting and reporting the main features and make comparisons where relevant.',
    visualGroundTruth:
      'Bar graph: Percentage growth in average property prices (2007-2010) in Algeria, China, Argentina. Algeria: 2007 ~6.1%, 2008 ~4.4%, 2009 3.0%, 2010 ~2.9%. China: 2007 ~1.9%, 2008 ~4.1%, 2009 ~5.2%, 2010 ~6.4%. Argentina: 2007 ~3.0%, 2008 ~4.8%, 2009 ~1.1%, 2010 ~2.2%.',
    candidateScript: `The bar chart depicts the percentage growth in the average value of properties in Algeria, China and Argentina from 2007 to 2010.

Overall, the percentage growth for China witnessed a steady upward trend over the time period shown, while that for Algeria experienced an opposite trend. By contrast, the trend for Argentina fluctuated wildly over the period given.

In 2007, China’s percentage growth was the lowest out of all the nations at 2%, after which it more than doubled in the following year to reach around 4.2%. It continued to climb thereafter to reach roughly 6.5% in 2010. In comparison, Algeria’s figure was the highest amongst the countries in 2007, at approximately 6.2%, whereupon it fell substantially to just over 3% in 2009 and 3% in 2010.

In relation to Argentina, its percentage growth was just above 3% in the first year before rising to just under 5% in 2008. Afterwards, this figure declined dramatically to close to 1.2% in 2009; however, it grew by about 1.1% in the final year.`,
    wordCount: 172,
    overallBand: 8.5,
    criteria: { taOrTr: 8.5, cc: 8.5, lr: 8.5, gra: 8.5 },
    examinerComment:
      'Exemplary 4-paragraph Academic Task 1 structure (Introduction paraphrase, clear Overview of all 3 countries’ trajectories, Body 1 contrasting the two opposing trends of China and Algeria with exact data, Body 2 detailing Argentina’s fluctuations). Clean, natural accuracy.',
    keyTakeaways: [
      '4-paragraph structure: Paraphrase -> Overview -> Group 1 (opposing steady trends) -> Group 2 (fluctuating trend).',
      'Uses natural approximation ("around 4.2%", "roughly 6.5%", "just under 5%") to reflect visual bar readings accurately.',
    ],
  },
  {
    id: 'advantage-acad-line-london-crime',
    source: 'ielts_advantage',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'IELTS Advantage Academic Task 1: Line Graph (Serious Crimes in London 2003-2012)',
    prompt:
      'The line graph below shows the number of serious crimes that occurred in London between 2003 and 2012. Summarise the information by selecting and reporting the main features and make comparisons where relevant.',
    visualGroundTruth:
      'Line graph: Number of serious crimes in London (2003-2012) for Armed Robbery, Assault, and Murder. Armed Robbery: ~3,400 in 2003, peaks at ~3,700 in 2004, drops sharply to ~1,100 in 2008, rises to ~1,500 in 2009-2012. Assault: ~2,300 in 2003, fluctuates between 2,000-2,400 until 2008, rises to ~2,750 by 2012 (surpassing Armed Robbery in 2006). Murder: ~500 in 2003, peaks near ~900 in 2005, stays stable around 500-700 until 2012.',
    candidateScript: `The line graph illustrates the number of serious offences that took place in London from 2003 to 2012.

Overall, it is clear that the occurrence of assault cases rose steadily and that of armed robberies declined considerably. The other significant feature is that number of murders committed remained relatively stable.

The cases of assault fluctuated between 2,000 and around 2,400 during the first six years, before increasing to a value of just over 2,500 in 2010 and ending the recorded period with about 2,700 cases. In 2005, the frequency of murder crimes rose to approximately 900, and then dropped to around 600 cases a year later and remained at a value between 500 to around 700 until the end of the period.

In contrast, the occurrence of armed robberies increased slightly to around 3,700 cases in 2004 before declining dramatically over the next four years to just over 1,000 cases in 2008. Subsequently, this figure rose slightly to 1,500 in 2009 and remained around the same level until 2012.`,
    wordCount: 172,
    overallBand: 8.5,
    criteria: { taOrTr: 8.5, cc: 8.5, lr: 8.5, gra: 8.5 },
    examinerComment:
      'High-band response demonstrating clear macro-trend identification in the overview and well-selected key turning points (peaks, troughs, and stabilization plateaus) without mechanically listing every single year.',
    keyTakeaways: [
      'Avoids listing every year from 2003 to 2012; instead groups stable periods ("fluctuated between 2,000 and around 2,400 during the first six years") and highlights peaks/troughs.',
    ],
  },
  {
    id: 'advantage-acad-table-bookstore',
    source: 'ielts_advantage',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'table',
    title: 'IELTS Advantage Academic Task 1: Table (Used Bookstore Expenses in Scotland)',
    prompt:
      'The table below shows the expenses of a used bookstore in Scotland for the first and last month of the same year. Summarise the information by selecting and reporting the main features and make comparisons where relevant.',
    visualGroundTruth:
      'Table: Expenses of a used bookstore in Scotland in January 2018 vs December 2018. Wages & Benefits: $260 -> $226; Rent: $3222 -> $4909; Equipment: $53 -> $43; Utilities: $455 -> $265; Professional Fees: $51 -> $132; Marketing: $263 -> $355; Maintenance: $10 -> $42; Other: $444 -> $599; Total: $4758 -> $6571.',
    candidateScript: `The chart depicts information about how money was spent in a used bookstore in Scotland in January and December, 2018.

Overall, more money was spent in December than in January, with rental payments being the highest category of expense in both months, and also having the most significant change.

In January, out of a total of $4758, $3222 was spent on rent followed by utilities and other which cost $455 and $444 respectively. Marketing and wages and benefits accounted for $263 and $260 of the total figure, while equipment, professional fees, and maintenance accounted for $53, $51, and $10 respectively.

In December, the total expenditure increased to $6571. This was due to the increase in rental fees to $4909, and other to $599. Also, marketing, professional fees, and maintenance saw an increase in spending by $92, $81, and $32 respectively. However, there was a reduction in the amount spent on utilities, wages and benefits, and equipment to $265, $226, and $43 respectively.`,
    wordCount: 166,
    overallBand: 8.5,
    criteria: { taOrTr: 8.5, cc: 8.5, lr: 8.5, gra: 8.5 },
    examinerComment:
      'Demonstrates how to group a 9-row table logically by magnitude and direction of change (categories that increased vs categories that decreased) while highlighting the dominant cost driver (Rent) and Total.',
    keyTakeaways: [
      'When describing a table with many rows, group minor categories efficiently using "respectively" and calculated differences ("saw an increase in spending by $92, $81, and $32 respectively").',
    ],
  },
  {
    id: 'advantage-acad-process-food-chain',
    source: 'ielts_advantage',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'process',
    title: 'IELTS Advantage Academic Task 1: Process Diagram (US Food Production Chain)',
    prompt:
      'The diagram below shows the stages in the food production chain of the United States. Summarise the information by selecting and reporting the main features and make comparisons where relevant.',
    visualGroundTruth:
      'Diagram: The Food Production Chain in the US. Production (fishing, livestock, farming) -> Processing (factory) -> Distribution (warehouse & trucks) -> Branches into Retail -> Home Preparation -> Home Consumers, OR Restaurant -> Restaurant Preparation -> Restaurant Consumer (table or buffet).',
    candidateScript: `The flow chart illustrates how the food production chain works in the United States.

Overall, there are three main stages, beginning with the collection of raw materials and processing them, followed by distribution, and selling them in retail stores or restaurants. The final step is preparing food products to make them consumable for restaurant guests, and family members or to serve them in canteens.

The process commences when raw materials are collected from livestock farms or the sea, they are then transported to processing factories, where they are processed and packed into boxes. Having been loaded onto lorries, the boxes are distributed to different destinations.

After being shipped to restaurants, the products undergo preparation stages and the resulting meals are then served to restaurant guests. Regarding the food products at stores, after the food has been brought home and prepared, it is then ready to consume. The chain also includes serving food in canteens.`,
    wordCount: 157,
    overallBand: 8.0,
    criteria: { taOrTr: 8.0, cc: 8.0, lr: 8.0, gra: 8.0 },
    examinerComment:
      'Clearly identifies the linear start and the branching distribution pathways (restaurants vs retail/home) using accurate passive voice and participle clauses ("Having been loaded onto lorries...").',
    keyTakeaways: [
      'For branching processes, clearly contrast the two pathways after the split point.',
    ],
  },
  {
    id: 'advantage-acad-map-ireland-village',
    source: 'ielts_advantage',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'map',
    title: 'IELTS Advantage Academic Task 1: Maps (Village in the West of Ireland 2000 vs Present)',
    prompt:
      'The two maps below show a small village in the west of Ireland in the year 2000 and at the present time. Summarise the information by selecting and reporting the main features and make comparisons where relevant.',
    visualGroundTruth:
      'Two maps (2000 vs Present) with compass rose. 2000: Farmland in NW, 4 houses and Shop on west side of main N-S road, Hotel on east side of N-S road, Market and Dock on southern coast. Present: Farmland in NW replaced by Park; west side road extended with 10 houses total; new NE road branch with 3 houses; Carpark added east of Hotel; Shop and Hotel unchanged; Market replaced by Restaurants; Dock removed.',
    candidateScript: `The two maps display the transformation of a small village in the west of Ireland from 2000 to the present time.

Overall, the village has undergone significant changes with the construction of more housing and restaurants. Another noticeable feature is that the farmland has been turned into a new park over the period.

In 2000, there was a dock at the seafront which has been removed. There were some shops, a hotel, and a market on both sides of the coastal road running from west to east. While the shops and the hotel on the northern side of the road remain relatively the same now, the market on the southern side of the road has been replaced by some restaurants. A new car park has been built east of the hotel.

From the coastal road, there is a main road running northward. There used to be only four houses on the side road, leading from the main road to the west. This side road has been extended westward with more housing on both sides of it, and a new side road with additional housing has been constructed to the east of the main road. Lastly, the farmland that once occupied the northwest of the village has been replaced by a new park.`,
    wordCount: 211,
    overallBand: 8.5,
    criteria: { taOrTr: 8.5, cc: 8.5, lr: 8.5, gra: 8.5 },
    examinerComment:
      'Excellent spatial organization (grouping the southern coastal zone in Body 1 and the northern road/residential/park zone in Body 2), accurate cardinal directions (west, east, northern, northwest), and natural use of present perfect passive ("has been removed", "has been replaced").',
    keyTakeaways: [
      'Map comparisons require cardinal directions (north, south, east, west, northwest), spatial grouping, and present perfect passive for changes from past to present.',
      'Must explicitly mention features that remained unchanged (shops and hotel) as well as additions and removals.',
    ],
  },
  {
    id: 'advantage-acad-pie-french-sports',
    source: 'ielts_advantage',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'IELTS Advantage Academic Task 1: Pie Charts (Popular Sports in French Secondary Schools)',
    prompt:
      'The pie charts below illustrate the most popular sports in French secondary schools in three different years. Summarise the information by selecting and reporting the main features and make comparisons where relevant.',
    visualGroundTruth:
      'Three pie charts (1990, 2000, 2010) for Tennis, Swimming, Basketball, Football, Other. 1990: Swimming 39%, Other 25%, Football 16%, Basketball 16%, Tennis 4%. 2000: Swimming 48%, Other 23%, Football 18%, Basketball 7%, Tennis 4%. 2010: Swimming 41%, Basketball 25%, Other 19%, Football 8%, Tennis 7%.',
    candidateScript: `The given charts depict the most preferred sports in French high schools in 1990, 2000, and 2010.

Overall, swimming was the most preferred sport, while tennis was the least popular in all three years.

The percentage of students who preferred swimming in 1990 was 39%, and this figure increased to 48% ten years later, before falling to 41% in 2010. Similarly, the percentage of students who chose football as their most well-liked sport was 16% in 1990, and this grew by 2% in 2000, before falling in 2010 to half its figure in 1990. In contrast, 16% of students selected basketball as their preferred sport in 1990, and this figure, ten years later dropped to 7%, but in 2010, increased to a quarter.

The proportion of students who chose tennis as their favorite sport was 4% in 1990 and 2000, but increased by 3% in 2010. Finally, the popularity of sports other than swimming, football, basketball, and tennis experienced a constant decline with 25% in 1990, 23% in 2000 and 19% in 2010.`,
    wordCount: 175,
    overallBand: 8.5,
    criteria: { taOrTr: 8.5, cc: 8.5, lr: 8.5, gra: 8.5 },
    examinerComment:
      'Smoothly converts percentages into fractions/proportions ("half its figure in 1990", "increased to a quarter") while maintaining complete factual precision across all 5 categories.',
    keyTakeaways: [
      'Mixing exact percentages (39%, 48%) with proportional expressions ("a quarter", "half its figure") demonstrates Band 8+ Lexical Resource flexibility.',
    ],
  },
  {
    id: 'advantage-acad-mixed-ireland-electricity',
    source: 'ielts_advantage',
    taskType: 'academic_task_1',
    taskNumber: 1,
    subtype: 'chart',
    title: 'IELTS Advantage Academic Task 1: Combined Pie Chart & Table (Ireland Electricity)',
    prompt:
      'The pie graph below shows how electricity is produced in Ireland, and the table shows the primary reasons for using electricity in the same country. Summarise the information by selecting and reporting the main features and make comparisons where relevant.',
    visualGroundTruth:
      'Pie chart (Electricity generation in Ireland): Coal 45%, Gas 35%, Wind 10%, Solar 10%. Table (Primary reasons for electricity usage): Heating 55%, Lighting 20%, Kitchen Appliances 15%, Consumer Electronics 5%, Phone Charging 5%.',
    candidateScript: `The graphs illustrate how electricity is manufactured by four different resources: coal, gas, wind, and solar, and how the electricity is utilised.

Overall, in Ireland electricity is mainly produced by two energy resources, coal and gas. It is also clear that heating is the top reason for electricity utilisation, while lighting is the second-highest purpose.

In Ireland, coal contributes the most to the production of electricity, accounting for nearly half of the total. The next noticeable contributor is gas, which produces more than a third of the combined electricity, whereas wind and solar each manufacture a tenth of the total energy.

Warming comprises more than half of the combined electricity usage. The next significant reasons for using electricity are lighting and kitchen appliances, making up exactly a fifth and 15% of the total, respectively. The two remaining categories, consumer electronics and phone charging only take up a small proportion, each comprising 5% of the total electricity utilisation.`,
    wordCount: 162,
    overallBand: 8.5,
    criteria: { taOrTr: 8.5, cc: 8.5, lr: 8.5, gra: 8.5 },
    examinerComment:
      'Ideal structure for mixed/multiple charts: Overview covers the primary takeaway from BOTH visuals (Chart 1 + Table 2), Body 1 analyzes the pie chart, and Body 2 analyzes the table.',
    keyTakeaways: [
      'In mixed-chart tasks (e.g., Pie Chart + Table), the Overview MUST mention the main feature of both visuals, and each visual gets its own dedicated body paragraph.',
    ],
  },
  {
    id: 'advantage-gt-formal-insurance-claim',
    source: 'ielts_advantage',
    taskType: 'gt_task_1',
    taskNumber: 1,
    subtype: 'letter_formal',
    title: 'IELTS Advantage GT Task 1: Formal Letter (Lost Item Insurance Claim)',
    prompt:
      'On a recent holiday, you lost a valuable item. Fortunately, you have travel insurance to cover the cost of anything lost. Write a letter to the manager of your insurance company. In your letter: • describe the item you lost • explain how you lost it • tell the insurance company what you would like them to do. Begin your letter as follows: Dear Sir or Madam,',
    candidateScript: `Dear Sir or Madam,

I am writing to you to make a claim for my gold watch, which I lost during my last vacation in Spain. The reference number for that booking is 557 843 90K.

The watch is an antique and I inherited it from my grandmother. It is rose gold, has a slim wristband, and an oval shaped display. At the back it is engraved, showing the letters I. L. G., and the clip is slightly curved.

I wore the watch during one of our day trips and had to take it off to go scuba diving. Unfortunately, I cannot remember if I put it back on when coming out of the water. I did, however, check with the diving instructors and they assured me that they have not found any items.

Therefore, I would like to ask you to payout the monetary value of the watch in the sum of $350, as per agreed upon clause 8 in the insurance cover. I also included a picture of the watch and a recent evaluation from a jeweller to provide proof of its value.

I am looking forward to your response, and remain hopeful to at least recover the monetary loss.

Yours faithfully,
Lisa Brown`,
    wordCount: 204,
    overallBand: 8.5,
    criteria: { taOrTr: 8.5, cc: 8.5, lr: 8.5, gra: 8.5 },
    examinerComment:
      'Exemplary Formal GT Letter: states purpose immediately in the first sentence, dedicates one clear paragraph to each of the 3 bullet points with realistic, specific detail, maintains a formal register throughout, and pairs "Dear Sir or Madam," with "Yours faithfully,".',
    keyTakeaways: [
      'Formal letters starting with "Dear Sir or Madam," should close with "Yours faithfully," and avoid contractions or slang.',
      'Opening sentence immediately establishes the purpose of the letter, and each bullet point is fully extended in its own paragraph.',
    ],
  },
  {
    id: 'advantage-gt-semiformal-resignation',
    source: 'ielts_advantage',
    taskType: 'gt_task_1',
    taskNumber: 1,
    subtype: 'letter_semi_formal',
    title: 'IELTS Advantage GT Task 1: Semi-Formal Letter (Leaving Part-Time Job)',
    prompt:
      'You have just finished your master’s degree and need to leave your current part-time job to search for full-time employment. Write a letter to your current employer. In your letter: • explain why you will not pursue a full-time job in his/her company • say why you’ve enjoyed working for him/her • tell him/her how much longer you will continue to work for him/her.',
    candidateScript: `Dear Mr Pell,

I am writing to let you know that I will be leaving Sourdough Delights soon and am formally serving my two weeks notice period.

Having recently graduated from my master’s degree in Speech Therapy, I will sadly have to leave your company and search for full-time employment in that industry. As there are limited roles in this area, I will need to relocate to Sydney which has one of the largest clinics for Speech Therapy and where there are more opportunities for work.

It has been a real pleasure to work for you at Sourdough Delights, and I truly enjoyed the culture and warm biscuits at tea when we finished with our afternoon bakes. Thank you for being generous with your time and teaching me all there is to know about how to make a good sourdough loaf.

I would be delighted to continue working for you for another 2 weeks until the end of the month, which should provide sufficient time to hire a replacement.

Kind regards,
Ursula Tang`,
    wordCount: 174,
    overallBand: 9.0,
    criteria: { taOrTr: 9.0, cc: 9.0, lr: 9.0, gra: 9.0 },
    examinerComment:
      'Natural, warm, respectful semi-formal tone tailored to a known employer. Uses a participle clause opening ("Having recently graduated..."), specific contextual details ("Sourdough Delights", "Speech Therapy"), and covers all three bullet points effortlessly.',
    keyTakeaways: [
      'Semi-formal letters to a known manager/employer use a named salutation ("Dear Mr Pell,") and polite professional sign-off ("Kind regards," or "Yours sincerely,").',
    ],
  },
  {
    id: 'advantage-gt-personal-engagement',
    source: 'ielts_advantage',
    taskType: 'gt_task_1',
    taskNumber: 1,
    subtype: 'letter_personal',
    title: 'IELTS Advantage GT Task 1: Informal/Personal Letter (Congratulating Friend on Engagement)',
    prompt:
      'You have just learned that your friend has recently become engaged. Write a letter to your friend. In your letter: • tell him/her how you found out • explain how you feel about the news • organise to meet your friend for a celebration.',
    candidateScript: `Dear Malin,

How are you?

I’m writing to congratulate you on your engagement to Jacques.

Last night, I met up with Tatjana for dinner in the Italian restaurant that we’ve been to last month together. While we were chatting about the latest updates in our lives, she mentioned that the two of you got engaged in South Africa last week. She even showed me a picture.

I’m so happy for you both! I know you anticipated it happening soon and it is amazing that he took the chance to do it in your long vacation. I’m very glad that you found the man with whom you want to spend the rest of your life and you can start your journey now together.

I would love to celebrate this milestone with you and meet up over dinner. What do you think? I suggest we meet up at the restaurant close to your place, Cecconi’s, to raise a toast. I’m free every day next week from 6 p.m. We could meet there or I can pick you up on my way to the restaurant.

It would be lovely to see you already next week. Please let me know if it works for you!

Sending you lots of love,
Nina`,
    wordCount: 205,
    overallBand: 8.5,
    criteria: { taOrTr: 8.5, cc: 8.5, lr: 8.5, gra: 8.5 },
    examinerComment:
      'Authentic, warm personal tone using natural contractions ("I’m", "we’ve") and conversational collocations ("celebrate this milestone", "raise a toast") while maintaining high grammatical accuracy.',
    keyTakeaways: [
      'Informal letters to friends should use contractions, warm openings/closings, and natural phrasal verbs ("met up with", "chatting about") while still maintaining complex sentence accuracy.',
    ],
  },
];

/**
 * Formats the Official May 2023 IELTS Band Descriptors for injection into the AI system prompt.
 */
export function formatRubricForPrompt(taskType: WritingTaskType): string {
  const isTask1 = taskType === 'academic_task_1' || taskType === 'gt_task_1';
  const descriptors = isTask1 ? TASK_1_BAND_DESCRIPTORS : TASK_2_BAND_DESCRIPTORS;
  const c1Label = isTask1 ? 'Task Achievement (TA)' : 'Task Response (TR)';

  const lines: string[] = [
    `=== OFFICIAL IELTS WRITING BAND DESCRIPTORS (UPDATED MAY 2023) - ${taskType.toUpperCase()} ===`,
    'Rule: A script must fully fit the positive features of the descriptor at a particular level. LIMITING RULES (from bolded official text) strictly cap a rating.',
  ];

  for (const d of descriptors) {
    if (d.band === 0) continue;
    lines.push(`\n[BAND ${d.band}]`);
    const taItems = [
      ...d.taskAchievementOrResponse,
      ...(taskType === 'academic_task_1' && d.academicSpecific ? d.academicSpecific : []),
      ...(taskType === 'gt_task_1' && d.generalTrainingSpecific ? d.generalTrainingSpecific : []),
    ];
    lines.push(`- ${c1Label}: ${taItems.join(' ')}`);
    lines.push(`- Coherence & Cohesion (CC): ${d.coherenceCohesion.join(' ')}`);
    lines.push(`- Lexical Resource (LR): ${d.lexicalResource.join(' ')}`);
    lines.push(`- Grammatical Range & Accuracy (GRA): ${d.grammaticalRange.join(' ')}`);
    if (d.limitingFeatures.length > 0) {
      lines.push(
        `- **SCORE-LIMITING RULES AT BAND ${d.band}**: ${d.limitingFeatures
          .map((lf) => `[${lf.criterion}] ${lf.rule}`)
          .join(' | ')}`
      );
    }
  }

  return lines.join('\n');
}

/**
 * Selects the most relevant few-shot calibration samples (combining official low/mid/high anchors
 * and subtype-matched benchmark essays) to ground the AI evaluator and prevent hallucination/drift.
 */
export function selectCalibrationSamplesForPrompt(params: {
  taskType: WritingTaskType;
  subtype?: WritingTaskSubtype | string;
  customSamples?: WritingCalibrationSample[];
  maxSamples?: number;
}): WritingCalibrationSample[] {
  const { taskType, subtype, customSamples = [], maxSamples = 3 } = params;
  const allPool = [...customSamples, ...BUILTIN_WRITING_CALIBRATION_SAMPLES].filter(
    (s) => s.taskType === taskType
  );

  if (allPool.length === 0) return [];

  // Score each sample by relevance
  const scored = allPool.map((sample) => {
    let score = 0;
    if (subtype && sample.subtype === subtype) score += 10;
    if (sample.source === 'custom_teacher') score += 5; // Prefer teacher-added custom benchmarks when matching
    if (sample.source === 'official_ielts') score += 4; // Official examiner comments are high-value anchors
    return { sample, score };
  });

  scored.sort((a, b) => b.score - a.score);

  // Pick a balanced set: ideally at least one lower/mid band official anchor (Band 5-6.5) AND one high-band anchor (Band 7.5-9.0)
  const selected: WritingCalibrationSample[] = [];
  const lowerMid = scored.find((s) => s.sample.overallBand <= 6.5);
  const highBand = scored.find((s) => s.sample.overallBand >= 7.5);

  if (highBand) selected.push(highBand.sample);
  if (lowerMid && !selected.some((x) => x.id === lowerMid.sample.id)) {
    selected.push(lowerMid.sample);
  }

  for (const item of scored) {
    if (selected.length >= maxSamples) break;
    if (!selected.some((x) => x.id === item.sample.id)) {
      selected.push(item.sample);
    }
  }

  return selected;
}

/**
 * Detects verbatim copied rubric segments (5+ consecutive words matching the prompt)
 * and calculates the effective non-copied word count per Official May 2023 IELTS Band Descriptors
 * ("Any copied rubric must be discounted").
 */
export function detectCopiedRubric(prompt: string, candidateEssay: string): {
  copiedPhrases: string[];
  copiedWordCount: number;
  effectiveWordCount: number;
} {
  if (!prompt || !candidateEssay) {
    return { copiedPhrases: [], copiedWordCount: 0, effectiveWordCount: 0 };
  }

  const normalizeTokens = (str: string) =>
    str
      .toLowerCase()
      .replace(/[^a-z0-9\s']/g, ' ')
      .split(/\s+/)
      .filter(Boolean);

  const promptTokens = normalizeTokens(prompt);
  const essayTokens = normalizeTokens(candidateEssay);

  if (promptTokens.length < 6 || essayTokens.length === 0) {
    return {
      copiedPhrases: [],
      copiedWordCount: 0,
      effectiveWordCount: essayTokens.length,
    };
  }

  const copiedIndices = new Set<number>();
  const copiedPhrases: string[] = [];

  // Look for contiguous runs of >= 7 words copied directly from the prompt
  const MIN_RUN = 7;
  let i = 0;
  while (i <= essayTokens.length - MIN_RUN) {
    let bestRunLen = 0;
    for (let j = 0; j <= promptTokens.length - MIN_RUN; j++) {
      let k = 0;
      while (
        i + k < essayTokens.length &&
        j + k < promptTokens.length &&
        essayTokens[i + k] === promptTokens[j + k]
      ) {
        k++;
      }
      if (k > bestRunLen) {
        bestRunLen = k;
      }
    }

    if (bestRunLen >= MIN_RUN) {
      const phrase = essayTokens.slice(i, i + bestRunLen).join(' ');
      copiedPhrases.push(phrase);
      for (let m = i; m < i + bestRunLen; m++) {
        copiedIndices.add(m);
      }
      i += bestRunLen;
    } else {
      i++;
    }
  }

  const copiedWordCount = copiedIndices.size;
  const effectiveWordCount = Math.max(0, essayTokens.length - copiedWordCount);

  return {
    copiedPhrases,
    copiedWordCount,
    effectiveWordCount,
  };
}
