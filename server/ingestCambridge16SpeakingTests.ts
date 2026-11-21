import { v4 as uuidv4 } from 'uuid';
import { db } from './db';
import type {
  SpeakingPart1Topic,
  SpeakingPart2CueCard,
  SpeakingPart3Discussion,
} from '../shared/types';

export interface CambridgeSpeakingSetSeed {
  title: string;
  part1Topics: SpeakingPart1Topic[];
  part2CueCard: SpeakingPart2CueCard;
  part3Discussion: SpeakingPart3Discussion;
  teacherNotes?: string;
}

export const CAMBRIDGE_16_SPEAKING_SETS: CambridgeSpeakingSetSeed[] = [
  {
    title: 'Cambridge IELTS 16 Academic Speaking Test 1',
    part1Topics: [
      {
        id: 'c16-t1-p1-people-study-work-with',
        topicName: 'People you study/work with',
        questions: [
          'Who do you spend most time studying/working with? [Why?]',
          'What kinds of things do you study/work on with other people? [Why?]',
          'Are there times when you study/work better by yourself? [Why/Why not?]',
          'Is it important to like the people you study/work with? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a tourist attraction you enjoyed visiting.',
      cueCardPrompt: 'Describe a tourist attraction you enjoyed visiting.',
      bulletPoints: [
        'what this tourist attraction is',
        'when and why you visited it',
        'what you did there',
        'and explain why you enjoyed visiting this tourist attraction.',
      ],
    },
    part3Discussion: {
      theme: 'Different kinds of tourist attractions & The importance of international tourism',
      discussionQuestions: [
        'What are the most popular tourist attractions in your country?',
        'How do the types of tourist attractions that younger people like to visit compare with those that older people like to visit?',
        'Do you agree that some tourist attractions (e.g. national museums/galleries) should be free to visit?',
        'Why is tourism important to a country?',
        'What are the benefits to individuals of visiting another country as tourists?',
        "How necessary is it for tourists to learn the language of the country they're visiting?",
      ],
      teacherNotes:
        'Discussion topics: 1) Different kinds of tourist attractions; 2) The importance of international tourism.',
    },
    teacherNotes: 'Cambridge IELTS 16 Academic - Test 1 Speaking',
  },
  {
    title: 'Cambridge IELTS 16 Academic Speaking Test 2',
    part1Topics: [
      {
        id: 'c16-t2-p1-flowers-and-plants',
        topicName: 'Flowers and plants',
        questions: [
          'Do you have a favourite flower or plant? [Why/Why not?]',
          'What kinds of flowers and plants grow near where you live? [Why/Why not?]',
          'Is it important to you to have flowers and plants in your home? [Why/Why not?]',
          'Have you ever bought flowers for someone else? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a review you read about a product or service.',
      cueCardPrompt: 'Describe a review you read about a product or service.',
      bulletPoints: [
        'where you read the review',
        'what the product or service was',
        'what information the review gave about the product or service',
        'and explain what you did as a result of reading this review.',
      ],
    },
    part3Discussion: {
      theme: 'Online reviews & Customer service',
      discussionQuestions: [
        'What kinds of things do people write online reviews about in your country?',
        'Why do some people write online reviews?',
        'Do you think that online reviews are good for both shoppers and companies?',
        'What do you think it might be like to work in a customer service job?',
        'Do you agree that customers are more likely to complain nowadays?',
        'How important is it for companies to take all customer complaints seriously?',
      ],
      teacherNotes: 'Discussion topics: 1) Online reviews; 2) Customer service.',
    },
    teacherNotes: 'Cambridge IELTS 16 Academic - Test 2 Speaking',
  },
  {
    title: 'Cambridge IELTS 16 Academic Speaking Test 3',
    part1Topics: [
      {
        id: 'c16-t3-p1-summer',
        topicName: 'Summer',
        questions: [
          'Is summer your favourite time of year? [Why/Why not?]',
          "What do you do in summer when the weather's very hot? [Why?]",
          'Do you go on holiday every summer? [Why/Why not?]',
          'Did you enjoy the summer holidays when you were at school? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a luxury item you would like to own in the future.',
      cueCardPrompt: 'Describe a luxury item you would like to own in the future.',
      bulletPoints: [
        'what item you would like to own',
        'what this item looks like',
        'why you would like to own this item',
        'and explain whether you think you will ever own this item.',
      ],
    },
    part3Discussion: {
      theme: 'Expensive items & Rich people',
      discussionQuestions: [
        'Which expensive items would many young people (in your country) like to buy?',
        'How do the expensive items that younger people want to buy differ from those that older people want to buy?',
        'Do you think that people are more likely to buy expensive items for their friends or for themselves?',
        "How difficult is it to become very rich in today's world?",
        'Do you agree that money does not necessarily bring happiness?',
        'In what ways might rich people use their money to help society?',
      ],
      teacherNotes: 'Discussion topics: 1) Expensive items; 2) Rich people.',
    },
    teacherNotes: 'Cambridge IELTS 16 Academic - Test 3 Speaking',
  },
  {
    title: 'Cambridge IELTS 16 Academic Speaking Test 4',
    part1Topics: [
      {
        id: 'c16-t4-p1-fast-food',
        topicName: 'Fast food',
        questions: [
          'What kinds of fast food have you tried? [Why/Why not?]',
          'Do you ever use a microwave to cook food quickly? [Why/Why not?]',
          'How popular are fast food restaurants where you live? [Why/Why not?]',
          'When would you go to a fast-food restaurant? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe some technology (e.g. an app, phone, software program) that you decided to stop using.',
      cueCardPrompt:
        'Describe some technology (e.g. an app, phone, software program) that you decided to stop using.',
      bulletPoints: [
        'when and where you got this technology',
        'why you started using this technology',
        'why you decided to stop using it',
        'and explain how you feel about the decision you made.',
      ],
    },
    part3Discussion: {
      theme: 'Computer games & Technology in the classroom',
      discussionQuestions: [
        'What kinds of computer games do people play in your country?',
        'Why do people enjoy playing computer games?',
        'Do you think that all computer games should have a minimum age for players?',
        'In what ways can technology in the classroom be helpful?',
        'Do you agree that students are often better at using technology than their teachers?',
        'Do you believe that computers will ever replace human teachers?',
      ],
      teacherNotes: 'Discussion topics: 1) Computer games; 2) Technology in the classroom.',
    },
    teacherNotes: 'Cambridge IELTS 16 Academic - Test 4 Speaking',
  },
];

export async function ingestCambridge16SpeakingTests(authorId?: string) {
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
  const setIds: string[] = [];

  for (const item of CAMBRIDGE_16_SPEAKING_SETS) {
    const legacyTitle = item.title.replace(' Academic Speaking ', ' Speaking ');
    const existing = (await db
      .prepare('SELECT id FROM speaking_sets WHERE title IN (?, ?)')
      .get(item.title, legacyTitle)) as { id: string } | undefined;

    if (existing) {
      await db
        .prepare(
          `UPDATE speaking_sets
           SET title = ?,
               status = 'published',
               is_free_tier = 1,
               updated_at = ?
           WHERE id = ?`
        )
        .run(item.title, now, existing.id);

      const existingVersion = (await db
        .prepare('SELECT id FROM speaking_set_versions WHERE set_id = ? ORDER BY version_number DESC LIMIT 1')
        .get(existing.id)) as { id: string } | undefined;

      if (existingVersion) {
        await db
          .prepare(
            `UPDATE speaking_set_versions
             SET status = 'published',
                 part1_topics_json = ?,
                 part2_cue_card_json = ?,
                 part3_discussion_json = ?,
                 teacher_notes = ?,
                 validation_errors_json = '[]',
                 published_at = ?
             WHERE id = ?`
          )
          .run(
            JSON.stringify(item.part1Topics),
            JSON.stringify(item.part2CueCard),
            JSON.stringify(item.part3Discussion),
            item.teacherNotes || null,
            now,
            existingVersion.id
          );
      }

      updated++;
      setIds.push(existing.id);
    } else {
      const setId = uuidv4();
      const versionId = uuidv4();

      await db
        .prepare(
          `INSERT INTO speaking_sets (
            id, title, current_version_number, status, created_by_id, is_free_tier, created_at, updated_at
          ) VALUES (?, ?, 1, 'published', ?, 1, ?, ?)`
        )
        .run(setId, item.title, createdById, now, now);

      await db
        .prepare(
          `INSERT INTO speaking_set_versions (
            id, set_id, version_number, status,
            part1_topics_json, part2_cue_card_json, part3_discussion_json,
            teacher_notes, validation_errors_json, published_at, created_at
          ) VALUES (?, ?, 1, 'published', ?, ?, ?, ?, '[]', ?, ?)`
        )
        .run(
          versionId,
          setId,
          JSON.stringify(item.part1Topics),
          JSON.stringify(item.part2CueCard),
          JSON.stringify(item.part3Discussion),
          item.teacherNotes || null,
          now,
          now
        );

      created++;
      setIds.push(setId);
    }
  }

  return { created, updated, setIds };
}
