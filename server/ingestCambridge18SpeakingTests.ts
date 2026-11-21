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

export const CAMBRIDGE_18_SPEAKING_SETS: CambridgeSpeakingSetSeed[] = [
  {
    title: 'Cambridge IELTS 18 Academic Speaking Test 1',
    part1Topics: [
      {
        id: 'c18-t1-p1-paying-bills',
        topicName: 'Paying bills',
        questions: [
          'What kinds of bills do you have to pay?',
          'How do you usually pay your bills – in cash or by another method? [Why?]',
          'Have you ever forgotten to pay a bill? [Why/Why not?]',
          'Is there anything you could do to make your bills cheaper? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe some food or drink that you learned to prepare.',
      cueCardPrompt: 'Describe some food or drink that you learned to prepare.',
      bulletPoints: [
        'what food or drink you learned to prepare',
        'when and where you learned to prepare this',
        'how you learned to prepare this',
        'and explain how you felt about learning to prepare this food or drink.',
      ],
    },
    part3Discussion: {
      theme: 'Young people and cooking & Working as a chef',
      discussionQuestions: [
        'What kinds of things can children learn to cook?',
        'Do you think it is important for children to learn to cook?',
        'Do you think young people should learn to cook at home or at school?',
        'How enjoyable do you think it would be to work as a professional chef?',
        'What skills does a person need to be a great chef?',
        'How much influence do celebrity/TV chefs have on what ordinary people cook?',
      ],
      teacherNotes: 'Discussion topics: 1) Young people and cooking; 2) Working as a chef.',
    },
    teacherNotes: 'Cambridge IELTS 18 Academic - Test 1 Speaking',
  },
  {
    title: 'Cambridge IELTS 18 Academic Speaking Test 2',
    part1Topics: [
      {
        id: 'c18-t2-p1-science',
        topicName: 'Science',
        questions: [
          'Did you like studying science when you were at school? [Why/Why not?]',
          'What do you remember about your science teachers at school?',
          'How interested are you in science now? [Why/Why not?]',
          'What do you think has been an important recent scientific development? [Why?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a tourist attraction in your country that you would recommend.',
      cueCardPrompt: 'Describe a tourist attraction in your country that you would recommend.',
      bulletPoints: [
        'what the tourist attraction is',
        'where in your country this tourist attraction is',
        'what visitors can see and do at this tourist attraction',
        'and explain why you would recommend this tourist attraction.',
      ],
    },
    part3Discussion: {
      theme: 'Museums and art galleries & The holiday industry',
      discussionQuestions: [
        'What are the most popular museums and art galleries in ... / where you live?',
        'Do you believe that all museums and art galleries should be free?',
        'What kinds of things make a museum or art gallery an interesting place to visit?',
        'Why, do you think, do some people book package holidays rather than travelling independently?',
        'Would you say that large numbers of tourists cause problems for local people?',
        'What sort of impact can large holiday resorts have on the environment?',
      ],
      teacherNotes: 'Discussion topics: 1) Museums and art galleries; 2) The holiday industry.',
    },
    teacherNotes: 'Cambridge IELTS 18 Academic - Test 2 Speaking',
  },
  {
    title: 'Cambridge IELTS 18 Academic Speaking Test 3',
    part1Topics: [
      {
        id: 'c18-t3-p1-online-shopping',
        topicName: 'Online shopping',
        questions: [
          'How often do you buy things online? [Why?]',
          'What was the last thing you bought online?',
          'Do you ever see things in shops and then buy them online? [Why/Why not?]',
          'Do you think the popularity of online shopping is changing your town or city centre? [Why/Why not?]',
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a time when you enjoyed visiting a member of your family in their home.',
      cueCardPrompt: 'Describe a time when you enjoyed visiting a member of your family in their home.',
      bulletPoints: [
        'who you visited and where they lived',
        'why you made this visit',
        'what happened during this visit',
        'and explain what you enjoyed about this visit.',
      ],
    },
    part3Discussion: {
      theme: 'Family occasions & Everyday life in families',
      discussionQuestions: [
        'When do families celebrate together in your country?',
        'How often do all the generations in a family come together in your country?',
        'Why is it that some people might not enjoy attending family occasions?',
        'Do you think it is a good thing for parents to help their children with schoolwork?',
        'How important do you think it is for families to eat together at least once a day?',
        'Do you believe that everyone in a family should share household tasks?',
      ],
      teacherNotes: 'Discussion topics: 1) Family occasions; 2) Everyday life in families.',
    },
    teacherNotes: 'Cambridge IELTS 18 Academic - Test 3 Speaking',
  },
  {
    title: 'Cambridge IELTS 18 Academic Speaking Test 4',
    part1Topics: [
      {
        id: 'c18-t4-p1-sleep',
        topicName: 'Sleep',
        questions: [
          'How many hours do you usually sleep at night?',
          'Do you sometimes sleep during the day? [Why/Why not?]',
          "What do you do if you can't get to sleep at night? [Why?]",
          "Do you ever remember the dreams you've had while you were asleep?",
        ],
      },
    ],
    part2CueCard: {
      topic: 'Describe a time when you met someone who you became good friends with.',
      cueCardPrompt: 'Describe a time when you met someone who you became good friends with.',
      bulletPoints: [
        'who you met',
        'when and where you met this person',
        'what you thought about this person when you first met',
        'and explain why you think you became good friends with this person.',
      ],
    },
    part3Discussion: {
      theme: 'Friends at school & Making new friends',
      discussionQuestions: [
        'How important is it for children to have lots of friends at school?',
        'Do you think it is wrong for parents to influence which friends their children have?',
        'Why do you think children often choose different friends as they get older?',
        'If a person is moving to a new town, what is a good way for them to make friends?',
        'Can you think of any disadvantages of making new friends online?',
        'Would you say it is harder for people to make new friends as they get older?',
      ],
      teacherNotes: 'Discussion topics: 1) Friends at school; 2) Making new friends.',
    },
    teacherNotes: 'Cambridge IELTS 18 Academic - Test 4 Speaking',
  },
];

export async function ingestCambridge18SpeakingTests(authorId?: string) {
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

  for (const item of CAMBRIDGE_18_SPEAKING_SETS) {
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
