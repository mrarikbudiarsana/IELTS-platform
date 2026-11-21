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

export const CAMBRIDGE_19_SPEAKING_SETS: CambridgeSpeakingSetSeed[] = [
  {
    title: 'Cambridge IELTS 19 Academic Speaking Test 1',
    part1Topics: [
      {
        id: 'c19-t1-p1-international-food',
        topicName: 'International food',
        questions: [
          'Can you find food from many different countries where you live? [Why/Why not?]',
          'How often do you eat typical food from other countries? [Why/Why not?]',
          'Have you ever tried making food from another country? [Why/Why not?]',
          'What food from your country would you recommend to people from other countries? [Why?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a law that was introduced in your country and that you thought was a very good idea.',
      cueCardPrompt:
        'Describe a law that was introduced in your country and that you thought was a very good idea.',
      bulletPoints: [
        'what the law was',
        'who introduced it',
        'when and why it was introduced',
        'and explain why you thought this law was such a good idea.',
      ],
    },
    part3Discussion: {
      theme: 'School rules & Working in the legal profession',
      discussionQuestions: [
        'What kinds of rules are common in a school?',
        'How important is it to have rules in a school?',
        'What do you recommend should happen if children break school rules?',
        'Can you suggest why many students decide to study law at university?',
        'What are the key personal qualities needed to be a successful lawyer?',
        'Do you agree that working in the legal profession is very stressful?',
      ],
      teacherNotes: 'Discussion topics: 1) School rules; 2) Working in the legal profession.',
    },
    teacherNotes: 'Cambridge IELTS 19 Academic - Test 1 Speaking',
  },
  {
    title: 'Cambridge IELTS 19 Academic Speaking Test 2',
    part1Topics: [
      {
        id: 'c19-t2-p1-travelling-by-plane',
        topicName: 'Travelling by plane',
        questions: [
          'Have you travelled a lot by plane? [To where?/Why not?]',
          'Why do you think some people enjoy travelling by plane?',
          'Would you like to live near an airport? [Why/Why not?]',
          'In the future, do you think that you will travel by plane more often? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a person from your country who has won a prize, award or medal.',
      cueCardPrompt: 'Describe a person from your country who has won a prize, award or medal.',
      bulletPoints: [
        'who this person is',
        'which prize, award or medal they received',
        'what they did to win this',
        'and explain whether you think it was right that this person received this prize, award or medal.',
      ],
    },
    part3Discussion: {
      theme: 'Rewards for children at school & Rewards for sportspeople',
      discussionQuestions: [
        'What types of school prizes do children in your country receive?',
        'What do you think are the advantages of rewarding schoolchildren for good work?',
        "Do you agree that it's more important for children to receive rewards from their parents than from teachers?",
        'Do you think that some sportspeople (e.g., top footballers) are paid too much money?',
        'Should everyone on a team get the same prize money when they win?',
        'Do you agree with the view that, in sport, taking part is more important than winning?',
      ],
      teacherNotes: 'Discussion topics: 1) Rewards for children at school; 2) Rewards for sportspeople.',
    },
    teacherNotes: 'Cambridge IELTS 19 Academic - Test 2 Speaking',
  },
  {
    title: 'Cambridge IELTS 19 Academic Speaking Test 3',
    part1Topics: [
      {
        id: 'c19-t3-p1-holidays',
        topicName: 'Holidays',
        questions: [
          'Do you prefer spending holidays with friends or with family? [Why?]',
          'What kind of holiday accommodation do you like to stay in? [Why?]',
          'What plans do you have for your next holiday?',
          'Is your city or region a good place for other people to visit on holiday? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a car journey you made that took longer than expected.',
      cueCardPrompt: 'Describe a car journey you made that took longer than expected.',
      bulletPoints: [
        'where you were going',
        'who you were with',
        'how you felt during the journey',
        'and explain why this car journey took longer than expected.',
      ],
    },
    part3Discussion: {
      theme: 'Driving a car & Electric cars',
      discussionQuestions: [
        'How interested are young people in your country in learning to drive?',
        'What are the differences between driving in the countryside and driving in the city?',
        'Do you consider most drivers where you live to be good drivers?',
        'How popular are electric cars in your country?',
        'In what ways could more people be persuaded to buy electric cars?',
        'Do you think all cars will be electric one day?',
      ],
      teacherNotes: 'Discussion topics: 1) Driving a car; 2) Electric cars.',
    },
    teacherNotes: 'Cambridge IELTS 19 Academic - Test 3 Speaking',
  },
  {
    title: 'Cambridge IELTS 19 Academic Speaking Test 4',
    part1Topics: [
      {
        id: 'c19-t4-p1-cafes',
        topicName: 'Cafés',
        questions: [
          'Do you have a favourite café? [Why/Why not?]',
          'Do you often go to cafés by yourself? [Why/Why not?]',
          'What do you think helps to make a café very popular? [Why?]',
          'Why do some people prefer cafés that are part of large chains, rather than small, local cafés?',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a place you visited that has beautiful views.',
      cueCardPrompt: 'Describe a place you visited that has beautiful views.',
      bulletPoints: [
        'where this place is',
        'when and why you visited it',
        'what views you can see from this place',
        'and explain why you think these views are so beautiful.',
      ],
    },
    part3Discussion: {
      theme: 'The beauty industry & Beauty and culture',
      discussionQuestions: [
        'Do you agree that most beauty products are a waste of money?',
        'How does the beauty industry advertise its products so successfully?',
        'What do you think of the view that beauty products should not be advertised to children?',
        'Why do many people equate youth with beauty?',
        "Do you think that being beautiful could affect a person's success in life?",
        "Why might society's ideas about beauty change over time?",
      ],
      teacherNotes: 'Discussion topics: 1) The beauty industry; 2) Beauty and culture.',
    },
    teacherNotes: 'Cambridge IELTS 19 Academic - Test 4 Speaking',
  },
];

export async function ingestCambridge19SpeakingTests(authorId?: string) {
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

  for (const item of CAMBRIDGE_19_SPEAKING_SETS) {
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
