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

export const CAMBRIDGE_15_SPEAKING_SETS: CambridgeSpeakingSetSeed[] = [
  {
    title: 'Cambridge IELTS 15 Academic Speaking Test 1',
    part1Topics: [
      {
        id: 'c15-t1-p1-email',
        topicName: 'Email',
        questions: [
          'What kinds of emails do you receive about your work or studies?',
          'Do you prefer to email, phone or text your friends? [Why?]',
          'Do you reply to emails and messages as soon as you receive them? [Why/Why not?]',
          'Are you happy to receive emails that are advertising things? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a hotel that you know.',
      cueCardPrompt: 'Describe a hotel that you know.',
      bulletPoints: [
        'where this hotel is',
        'what this hotel looks like',
        'what facilities this hotel has',
        'and explain whether you think this is a nice hotel to stay in.',
      ],
    },
    part3Discussion: {
      theme: 'Staying in hotels & Working in a hotel',
      discussionQuestions: [
        'What things are important when people are choosing a hotel?',
        'Why do some people not like staying in hotels?',
        'Do you think staying in a luxury hotel is a waste of money?',
        'Do you think hotel work is a good career for life?',
        'How does working in a big hotel compare with working in a small hotel?',
        'What skills are needed to be a successful hotel manager?',
      ],
      teacherNotes: 'Discussion topics: 1) Staying in hotels; 2) Working in a hotel.',
    },
    teacherNotes: 'Cambridge IELTS 15 Academic - Test 1 Speaking',
  },
  {
    title: 'Cambridge IELTS 15 Academic Speaking Test 2',
    part1Topics: [
      {
        id: 'c15-t2-p1-languages',
        topicName: 'Languages',
        questions: [
          'How many languages can you speak? [Why/Why not?]',
          'How useful will English be to you in your future? [Why/Why not?]',
          'What do you remember about learning languages at school? [Why/Why not?]',
          'What do you think would be the hardest language for you to learn? [Why?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a website that you bought something from.',
      cueCardPrompt: 'Describe a website that you bought something from.',
      bulletPoints: [
        'what the website is',
        'what you bought from this website',
        'how satisfied you were with what you bought',
        'and explain what you liked or disliked about using this website.',
      ],
    },
    part3Discussion: {
      theme: 'Shopping online & The culture of consumerism',
      discussionQuestions: [
        'What kinds of things do people in your country often buy from online shops?',
        'Why do you think online shopping has become so popular nowadays?',
        'What are some possible disadvantages of buying things from online shops?',
        'Why do many people today keep buying things which they do not need?',
        'Do you believe the benefits of a consumer society outweigh the disadvantages?',
        'How possible is it to avoid the culture of consumerism?',
      ],
      teacherNotes: 'Discussion topics: 1) Shopping online; 2) The culture of consumerism.',
    },
    teacherNotes: 'Cambridge IELTS 15 Academic - Test 2 Speaking',
  },
  {
    title: 'Cambridge IELTS 15 Academic Speaking Test 3',
    part1Topics: [
      {
        id: 'c15-t3-p1-swimming',
        topicName: 'Swimming',
        questions: [
          'Did you learn to swim when you were a child? [Why/Why not?]',
          'How often do you go swimming now? [Why/Why not?]',
          'What places are there for swimming where you live? [Why?]',
          'Do you think it would be more enjoyable to go swimming outdoors or at an indoor pool? [Why?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a famous business person that you know about.',
      cueCardPrompt: 'Describe a famous business person that you know about.',
      bulletPoints: [
        'who this person is',
        'what kind of business this person is involved in',
        'what you know about this business person',
        'and explain what you think of this business person.',
      ],
    },
    part3Discussion: {
      theme: 'Famous people today & Advantages of being famous',
      discussionQuestions: [
        'What kinds of people are most famous in your country today?',
        'Why are there so many stories about famous people in the news?',
        'Do you agree or disagree that many young people today want to be famous?',
        'Do you think it is easy for famous people to earn a lot of money?',
        'Why might famous people enjoy having fans?',
        'In what ways could famous people use their influence to do good things in the world?',
      ],
      teacherNotes: 'Discussion topics: 1) Famous people today; 2) Advantages of being famous.',
    },
    teacherNotes: 'Cambridge IELTS 15 Academic - Test 3 Speaking',
  },
  {
    title: 'Cambridge IELTS 15 Academic Speaking Test 4',
    part1Topics: [
      {
        id: 'c15-t4-p1-jewellery',
        topicName: 'Jewellery',
        questions: [
          'How often do you wear jewellery? [Why/Why not?]',
          'What type of jewellery do you like best? [Why/Why not?]',
          'When do people like to give jewellery in your country [Why?]',
          'Have you ever given jewellery to someone as a gift? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe an interesting TV programme you watched about a science topic.',
      cueCardPrompt: 'Describe an interesting TV programme you watched about a science topic.',
      bulletPoints: [
        'what science topic this TV programme was about',
        'when you saw this TV programme',
        'what you learnt from this TV programme about a science topic',
        'and explain why you found this TV programme interesting.',
      ],
    },
    part3Discussion: {
      theme: 'Science and the public & Scientific discoveries',
      discussionQuestions: [
        'How interested are most people in your country in science?',
        'Why do you think children today might be better at science than their parents?',
        'How do you suggest the public can learn more about scientific developments?',
        'What do you think are the most important scientific discoveries in the last 100 years?',
        'Do you agree or disagree that there are no more major scientific discoveries left to make?',
        'Who should pay for scientific research – governments or private companies?',
      ],
      teacherNotes: 'Discussion topics: 1) Science and the public; 2) Scientific discoveries.',
    },
    teacherNotes: 'Cambridge IELTS 15 Academic - Test 4 Speaking',
  },
];

export async function ingestCambridge15SpeakingTests(authorId?: string) {
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

  for (const item of CAMBRIDGE_15_SPEAKING_SETS) {
    const existing = (await db
      .prepare('SELECT id FROM speaking_sets WHERE title = ?')
      .get(item.title)) as { id: string } | undefined;

    if (existing) {
      await db
        .prepare(
          `UPDATE speaking_sets
           SET status = 'published',
               is_free_tier = 1,
               updated_at = ?
           WHERE id = ?`
        )
        .run(now, existing.id);

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
