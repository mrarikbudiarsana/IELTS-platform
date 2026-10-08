import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from './db';
import {
  SpeakingPart1Topic,
  SpeakingPart2CueCard,
  SpeakingPart3Discussion,
} from '../shared/types';
import { createSpeakingSet, publishSpeakingSetVersion } from './speakingService';

export function seedSpeakingDatabase() {
  initDatabase();

  const existingSpeaking = db.prepare('SELECT COUNT(*) as count FROM speaking_sets').get() as any;
  if (existingSpeaking.count > 0) {
    console.log('Speaking sets already seeded, skipping.');
    return;
  }

  const adminRow = db.prepare("SELECT id FROM users WHERE role = 'admin' LIMIT 1").get() as any;
  const adminId = adminRow ? adminRow.id : uuidv4();

  console.log('Seeding official IELTS Speaking demonstration sets...');

  // -------------------------------------------------------------
  // SET 1: Global Tourism & Sustainable Travel (Complete 3 Parts)
  // -------------------------------------------------------------
  const set1Part1: SpeakingPart1Topic[] = [
    {
      id: 's1_p1_t1',
      topicName: 'Travel and Holidays',
      questions: [
        'Do you prefer travelling alone or with friends and family?',
        'What kind of destinations do you most like to visit when taking time off?',
        'Is there a particular country or region you have always dreamed of visiting?',
        'Do people in your home country travel for leisure more now than they did twenty years ago?',
      ],
    },
    {
      id: 's1_p1_t2',
      topicName: 'Hometown and Living Environment',
      questions: [
        'Can you describe the town or city where you grew up?',
        'What do you like most about your hometown?',
        'Has your hometown undergone significant changes over the past ten years?',
        'Would you prefer to live in a busy metropolis or a quiet rural area in the future?',
      ],
    },
  ];

  const set1Part2: SpeakingPart2CueCard = {
    id: 's1_p2',
    topic: 'Describe a memorable journey or trip that made a strong impression on you.',
    preparationTimeSeconds: 60,
    speakingTimeMinutes: 2,
    bulletPoints: [
      'Where you travelled and who accompanied you',
      'What mode of transport you used for the journey',
      'What memorable activities or unexpected events occurred',
      'And explain why this particular journey left such a lasting impression on you',
    ],
    teacherNotes: 'Candidate has 1 minute to take notes. Ensure candidate speaks continuously for 1 to 2 minutes before interrupting with 1 follow-up question.',
  };

  const set1Part3: SpeakingPart3Discussion = {
    id: 's1_p3',
    theme: 'Tourism, Local Cultures, and Environmental Sustainability',
    discussionQuestions: [
      'In what ways has the rapid growth of international tourism transformed local communities and cultural traditions?',
      'Do you believe travellers should make a deliberate effort to adapt to local etiquette, or should tourist destinations cater flexibly to foreign visitors?',
      'What major environmental problems are exacerbated by budget airlines and mass tourism?',
      'How can national governments and tour operators collaborate to promote authentic, sustainable eco-tourism?',
      'Some futurists argue that virtual reality experiences will eventually reduce the desire for physical travel. Do you agree or disagree?',
    ],
    teacherFollowUps: [
      'If the candidate answers briefly, ask: "Can you provide a concrete example from your own country or region?"',
      'Challenge candidate: "Do you think economic benefits for local residents outweigh environmental damage?"',
    ],
  };

  const set1 = createSpeakingSet(adminId, {
    title: 'Global Tourism & Sustainable Travel',
    part1Topics: set1Part1,
    part2CueCard: set1Part2,
    part3Discussion: set1Part3,
    teacherNotes: 'Standard 3-part test. Ideal for pre-test evaluation or complete mock sessions.',
  });

  publishSpeakingSetVersion(set1.set.id, set1.version.id);

  // -------------------------------------------------------------
  // SET 2: Technology, Work, and Daily Communication (Complete 3 Parts)
  // -------------------------------------------------------------
  const set2Part1: SpeakingPart1Topic[] = [
    {
      id: 's2_p1_t1',
      topicName: 'Technology and Daily Gadgets',
      questions: [
        'What electronic device or software application do you use most frequently each day?',
        'Did you learn how to operate computers at an early age?',
        'Do you ever feel that you spend an excessive amount of time looking at screens?',
        'Are there any new technologies you find difficult or frustrating to learn?',
      ],
    },
    {
      id: 's2_p1_t2',
      topicName: 'Work, Study, and Productive Routines',
      questions: [
        'What aspect of your current studies or profession do you find most intellectually engaging?',
        'How do you organise your schedule to maintain focus throughout a busy week?',
        'Do you perform better early in the morning or during late evening hours?',
      ],
    },
  ];

  const set2Part2: SpeakingPart2CueCard = {
    id: 's2_p2',
    topic: 'Describe an important piece of technology or software that has significantly improved your daily life or studies.',
    preparationTimeSeconds: 60,
    speakingTimeMinutes: 2,
    bulletPoints: [
      'What specific device, software, or application it is',
      'When and how you first discovered and learned to use it',
      'What specific daily tasks or complex challenges it helps you solve',
      'And explain clearly how your routine would be impacted if it were no longer available',
    ],
    teacherNotes: 'Prompt candidate to focus on impact and concrete tasks rather than technical specifications.',
  };

  const set2Part3: SpeakingPart3Discussion = {
    id: 's2_p3',
    theme: 'Artificial Intelligence, Future Employment, and Digital Society',
    discussionQuestions: [
      'How has the rise of generative artificial intelligence influenced expectations of productivity in contemporary workplaces?',
      'Do you believe older generations encounter systematic disadvantages when adapting to digital and automated tools?',
      'What privacy and data protection concerns are most urgent as internet services become ubiquitous?',
      'Will remote working and asynchronous collaboration permanently replace traditional physical offices?',
      'How should school curricula be updated to prepare young people for automated job markets?',
    ],
    teacherFollowUps: [
      'If candidate generalises: "Could you compare the impact on creative jobs versus technical professions?"',
    ],
  };

  const set2 = createSpeakingSet(adminId, {
    title: 'Technology, Work, and Daily Communication',
    part1Topics: set2Part1,
    part2CueCard: set2Part2,
    part3Discussion: set2Part3,
    teacherNotes: 'Excellent set for post-test or advanced modular practice.',
  });

  publishSpeakingSetVersion(set2.set.id, set2.version.id);

  console.log('Successfully seeded 2 published IELTS Speaking demonstration sets.');
}
