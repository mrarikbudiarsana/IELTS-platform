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

export const CAMBRIDGE_17_SPEAKING_SETS: CambridgeSpeakingSetSeed[] = [
  {
    title: 'Cambridge IELTS 17 Speaking Test 1',
    part1Topics: [
      {
        id: 'c17-t1-p1-history',
        topicName: 'History',
        questions: [
          'What did you study in history lessons when you were at school?',
          'Did you enjoy studying history at school? [Why/Why not?]',
          'How often do you watch TV programmes about history now? [Why/Why not?]',
          'What period in history would you like to learn more about? [Why?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe the neighbourhood you lived in when you were a child.',
      cueCardPrompt: 'Describe the neighbourhood you lived in when you were a child.',
      bulletPoints: [
        'where in your town/city the neighbourhood was',
        'what kind of people lived there',
        'what it was like to live in this neighbourhood',
        'and explain whether you would like to live in this neighbourhood in the future.',
      ],
    },
    part3Discussion: {
      theme: 'Neighbours & Facilities in cities',
      discussionQuestions: [
        'What sort of things can neighbours do to help each other?',
        'How well do people generally know their neighbours in your country?',
        'How important do you think it is to have good neighbours?',
        'Which facilities are most important to people living in cities?',
        'How does shopping in small local shops differ from shopping in large city centre shops?',
        'Do you think that children should always go to the school nearest to where they live?',
      ],
      teacherNotes: 'Discussion topics: 1) Neighbours; 2) Facilities in cities.',
    },
    teacherNotes: 'Cambridge IELTS 17 Academic - Test 1 Speaking',
  },
  {
    title: 'Cambridge IELTS 17 Speaking Test 2',
    part1Topics: [
      {
        id: 'c17-t2-p1-reading',
        topicName: 'Reading',
        questions: [
          'Did you have a favourite book when you were a child? [Why/Why not?]',
          'How much reading do you do for your work/studies? [Why/Why not?]',
          'What kinds of books do you read for pleasure? [Why/Why not?]',
          'Do you prefer to read a newspaper or a magazine online, or to buy a copy? [Why?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a big city you would like to visit.',
      cueCardPrompt: 'Describe a big city you would like to visit.',
      bulletPoints: [
        'which big city you would like to visit',
        'how you would travel there',
        'what you would do there',
        'and explain why you would like to visit this big city.',
      ],
    },
    part3Discussion: {
      theme: 'Visiting cities on holiday & The growth of cities',
      discussionQuestions: [
        'What are the most interesting things to do while visiting cities on holiday?',
        'Why can it be expensive to visit cities on holiday?',
        'Do you think it is better to visit cities alone or in a group with friends?',
        'Why have cities increased in size in recent years?',
        'What are the challenges created by ever-growing cities?',
        'In what ways do you think cities of the future will be different to cities today?',
      ],
      teacherNotes: 'Discussion topics: 1) Visiting cities on holiday; 2) The growth of cities.',
    },
    teacherNotes: 'Cambridge IELTS 17 Academic - Test 2 Speaking',
  },
  {
    title: 'Cambridge IELTS 17 Speaking Test 3',
    part1Topics: [
      {
        id: 'c17-t3-p1-drinks',
        topicName: 'Drinks',
        questions: [
          'What do you like to drink with your dinner? [Why?]',
          'Do you drink a lot of water every day? [Why/Why not?]',
          'Do you prefer drinking tea or coffee? [Why?]',
          'If people visit you in your home, what do you usually offer them to drink? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a monument (e.g., a statue or sculpture) that you like.',
      cueCardPrompt: 'Describe a monument (e.g., a statue or sculpture) that you like.',
      bulletPoints: [
        'what this monument is',
        'where this monument is',
        'what it looks like',
        'and explain why you like this monument.',
      ],
    },
    part3Discussion: {
      theme: 'Public monuments & Architecture',
      discussionQuestions: [
        'What kinds of monuments do tourists in your country enjoy visiting?',
        'Why do you think there are often statues of famous people in public places?',
        'Do you agree that old monuments and buildings should always be preserved?',
        'Why is architecture such a popular university subject?',
        'In what ways has the design of homes changed in recent years?',
        "To what extent does the design of buildings affect people's moods?",
      ],
      teacherNotes: 'Discussion topics: 1) Public monuments; 2) Architecture.',
    },
    teacherNotes: 'Cambridge IELTS 17 Academic - Test 3 Speaking',
  },
  {
    title: 'Cambridge IELTS 17 Speaking Test 4',
    part1Topics: [
      {
        id: 'c17-t4-p1-maps',
        topicName: 'Maps',
        questions: [
          "Do you think it's better to use a paper map or a map on your phone? [Why?]",
          'When was the last time you needed to use a map? [Why/Why not?]',
          'If you visit a new city, do you always use a map to find your way around? [Why/Why not?]',
          'In general, do you find it easy to read maps? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe an occasion when you had to do something in a hurry.',
      cueCardPrompt: 'Describe an occasion when you had to do something in a hurry.',
      bulletPoints: [
        'what you had to do',
        'why you had to do this in a hurry',
        'how well you did this',
        'and explain how you felt about having to do this in a hurry.',
      ],
    },
    part3Discussion: {
      theme: 'Arriving late & Managing study time',
      discussionQuestions: [
        "Do you think it's OK to arrive late when meeting a friend?",
        'What should happen to people who arrive late for work?',
        "Can you suggest how people can make sure they don't arrive late?",
        'Is it better to study for long periods or in shorter blocks of time?',
        'What are the likely effects of students not managing their study time well?',
        'How important is it for students to have enough leisure time?',
      ],
      teacherNotes: 'Discussion topics: 1) Arriving late; 2) Managing study time.',
    },
    teacherNotes: 'Cambridge IELTS 17 Academic - Test 4 Speaking',
  },
];

export async function ingestCambridge17SpeakingTests(authorId?: string) {
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

  for (const item of CAMBRIDGE_17_SPEAKING_SETS) {
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
