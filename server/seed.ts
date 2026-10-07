import { v4 as uuidv4 } from 'uuid';
import { db, initDatabase } from './db';
import { hashPassword } from './auth';
import {
  ReadingPassage,
  QuestionGroup,
} from '../shared/types';
import { createReadingTest, publishTestVersion } from './readingService';

export function seedDatabase() {
  initDatabase();

  const existingUsers = db.prepare('SELECT COUNT(*) as count FROM users').get() as any;
  if (existingUsers.count > 0) {
    console.log('Database already has users, skipping full seed.');
    return;
  }

  console.log('Seeding initial users and demonstration tests...');

  // 1. Seed Teacher / Admin User
  const adminId = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, created_at)
    VALUES (?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    adminId,
    'arik@ieltsplatform.test',
    hashPassword('Password123!'),
    'Arik B (Teacher & Admin)',
    'admin',
    'academic'
  );

  // 2. Seed Student Users
  const student1Id = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, target_band, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    student1Id,
    'student@ieltsplatform.test',
    hashPassword('Password123!'),
    'Sam Learner',
    'student',
    'academic',
    7.5
  );

  const student2Id = uuidv4();
  db.prepare(`
    INSERT INTO users (id, email, password_hash, full_name, role, test_type_preference, target_band, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, datetime('now'))
  `).run(
    student2Id,
    'independent@ieltsplatform.test',
    hashPassword('Password123!'),
    'Alex Independent',
    'student',
    'general',
    7.0
  );

  // -------------------------------------------------------------
  // TEST 1: Academic Reading Full Demonstration Mock (40 Questions)
  // -------------------------------------------------------------
  const academicPassages: ReadingPassage[] = [
    {
      id: 'p1',
      passageNumber: 1,
      title: 'The Architecture of Ocean Cleanups',
      subtitle: 'Engineering autonomous barriers to capture pelagic plastic waste',
      paragraphs: [
        {
          id: 'p1_a',
          label: 'A',
          content:
            'Every year, millions of metric tons of synthetic polymers enter marine ecosystems, coalescing in subtropical gyres. The Great Pacific Garbage Patch, spanning over 1.6 million square kilometers, represents the densest accumulation of oceanic plastics. Traditional recovery operations utilizing heavy diesel vessels pulling trawl nets proved economically unsustainable and posed grave risks to bycatch species. In response, environmental engineers pivoted toward passive collection architectures that exploit natural oceanic currents.',
        },
        {
          id: 'p1_b',
          label: 'B',
          content:
            'The core mechanism of passive remediation consists of an elongated floating barrier anchored in a U-shaped configuration. Fabricated from high-density polyethylene, the buoyant tube provides unyielding buoyancy while riding cresting waves. Suspended beneath the flotation pipeline is an impermeable retention screen descending three meters below the water line. Because the screen is solid rather than woven mesh, marine fauna cannot become entangled; instead, downward hydrothermal currents naturally channel sea life harmlessly underneath the barrier.',
        },
        {
          id: 'p1_c',
          label: 'C',
          content:
            'Propulsion and orientation rely on drag forces rather than fossil fuel propulsion. A massive deep-sea sea anchor, suspended at an oceanic depth of several hundred meters where currents move considerably slower, dampens the system velocity. Consequently, plastic debris driven swiftly by surface winds enters the perimeter faster than the barrier drifts, concentrating waste in the central retention retention zone.',
        },
        {
          id: 'p1_d',
          label: 'D',
          content:
            'Autonomous monitoring arrays ensure operational continuity in hostile maritime conditions. Solar beacon pods installed along the perimeter transmit real-time telemetry via satellite uplinks, alerting shore crews to structural strain and payload capacity. When onboard sensors indicate the retention zone is full, an extraction conveyor vessel docks with the apex of the curve, transferring condensed plastics into industrial shredders before transport to recycling refineries.',
        },
        {
          id: 'p1_e',
          label: 'E',
          content:
            'Oceanographers initially voiced skepticism regarding the survivability of lightweight barriers during extreme meteorological events such as Pacific typhoons. However, field trials conducted between 2023 and 2025 demonstrated that flexible ballast chambers could be dynamically flooded, submerging the barrier below destructive wave crests until storms subsided. The platform thus achieved an operational availability rate exceeding 92 percent across continuous multi-month deployments.',
        },
      ],
    },
    {
      id: 'p2',
      passageNumber: 2,
      title: 'Urban Microclimates and Biophilic Design',
      subtitle: 'Mitigating the urban heat island effect through vegetative architectural integration',
      paragraphs: [
        {
          id: 'p2_a',
          label: 'A',
          content:
            'Metropolitan centers across the globe consistently record ambient temperatures 3 to 7 degrees Celsius higher than surrounding rural peripheries—a phenomenon termed the Urban Heat Island (UHI) effect. Dark asphalt pavements and concrete facades absorb incident solar radiation during daylight hours, radiating thermal energy well into the evening. Compounding this thermal retention is the anthropogenic heat generated by vehicular combustion and air conditioning chillers.',
        },
        {
          id: 'p2_b',
          label: 'B',
          content:
            'Biophilic architecture posits that integrating living biological systems directly into building envelopes creates microclimatic thermal buffers. Evapotranspiration from dense foliage converts sensible heat into latent heat, cooling surrounding air masses without requiring electrical power. Furthermore, vegetative shading prevents solar irradiance from striking thermal mass directly, substantially curtailing peak cooling loads.',
        },
        {
          id: 'p2_c',
          label: 'C',
          content:
            'Recent empirical investigations by architectural climatologists have quantified the efficacy of vertical green walls versus conventional rooftop gardens. While rooftop gardens intercept downward solar flux effectively, vertical facades account for up to 75 percent of the solar exposure on high-rise residential towers. Dr. Elena Chen observed that retrofitting double-glazed commercial towers with irrigated vertical trellises yielded a 32 percent drop in summer indoor air conditioning energy demand.',
        },
        {
          id: 'p2_d',
          label: 'D',
          content:
            'Nevertheless, biological envelopes present formidable horticultural hurdles. In high-density corridors, turbulence between neighboring skyscrapers generates wind shear that rapidly desorbs moisture from leaf surfaces. Professor Marcus Vance argued that widespread vertical greening will remain impractical unless regional municipalities mandate decentralized greywater recycling systems capable of maintaining automated drip irrigation across drought periods.',
        },
        {
          id: 'p2_e',
          label: 'E',
          content:
            'An alternative strategy pioneered by urban botanist Dr. Samuel Thorne explores xerophytic plant communities—species evolved in arid cliff habitats that thrive on minimal hydration and withstand intense UV radiation. Thorne’s field data revealed that selecting native sedums and lithophytic mosses reduced annual irrigation expenditure by 68 percent compared with conventional ornamental ivies.',
        },
        {
          id: 'p2_f',
          label: 'F',
          content:
            'The financial balance sheet of biophilic retrofits extends beyond direct energy conservation. Epidemiological studies demonstrate that visual access to living plant foliage lowers cortisol levels among office workers, yielding measurable gains in productivity and workplace satisfaction. Consequently, commercial real estate developers in Singapore and London are commanding premium lease rates for properties certified with living green envelopes.',
        },
        {
          id: 'p2_g',
          label: 'G',
          content:
            'Looking forward, urban planners emphasize that localized green facades must coalesce into contiguous ecological corridors. Isolated green buildings produce fragmented microclimates; conversely, continuous networks of vegetative surfaces foster convective cooling breezes that penetrate deep into congested downtown cores.',
        },
      ],
    },
    {
      id: 'p3',
      passageNumber: 3,
      title: 'Cognitive Economics and Decision Heuristics',
      subtitle: 'How evolutionary mental shortcuts influence consumer risk appraisal',
      paragraphs: [
        {
          id: 'p3_a',
          label: 'A',
          content:
            'Classical economic theory was constructed upon the foundation of homo economicus—an idealized rational agent possessing complete information, consistent preferences, and the computational capacity to maximize expected utility. In the late 20th century, however, behavioral pioneers Amos Tversky and Daniel Kahneman decisively demonstrated that human cognition routinely diverges from formal probability calculus through predictable systematic biases known as heuristics.',
        },
        {
          id: 'p3_b',
          label: 'B',
          content:
            'One of the most pervasive cognitive mechanisms is the availability heuristic, wherein individuals judge the likelihood of an outcome by the mental ease with which illustrative instances come to mind. Vivid, sensationalized perils—such as aircraft crashes or predatory shark attacks—receive disproportionate media attention, prompting consumers to overinsure against improbable catastrophes while underinsuring against commonplace chronic health conditions.',
        },
        {
          id: 'p3_c',
          label: 'C',
          content:
            'Equally influential is prospect theory, which establishes that individuals experience asymmetrical reactions to gains and losses. Human perception displays pronounced loss aversion: the emotional anguish of losing $100 is roughly twice as potent as the pleasure derived from gaining $100. This asymmetry explains why financial investors stubbornly hold depreciating equities, irrationally gambling on an improbable rebound to avoid crystallizing a psychological loss.',
        },
        {
          id: 'p3_d',
          label: 'D',
          content:
            'In modern digital marketplaces, algorithmic choice architecture frequently leverages these innate vulnerabilities. Subtle design manipulations—termed "dark patterns"—exploit default effects and artificial scarcity. When an online retailer displays "Only 2 rooms remaining at this price!" alongside a countdown clock, it activates consumer loss aversion and anchoring effects, inducing impulsive transactions before deliberative cognitive analysis can intervene.',
        },
        {
          id: 'p3_e',
          label: 'E',
          content:
            'Policy theorists debate whether regulatory interventions should adopt libertarian paternalism—commonly referred to as "nudging"—to steer citizens toward welfare-enhancing decisions without prohibiting individual freedom of choice. Automatic enrollment in retirement pension schemes represents a prominent triumph of this philosophy, dramatically elevating savings participation across demographic cohorts.',
        },
        {
          id: 'p3_f',
          label: 'F',
          content:
            'Critics caution, however, that institutional nudging risks infantilizing the public and lacks transparent democratic oversight. They argue that when governmental bodies selectively manipulate choice architecture, they substitute administrative preferences for autonomous citizen volition, eroding the fundamental civic expectation that individuals should cultivate self-directed critical evaluation.',
        },
      ],
    },
  ];

  const academicGroups: QuestionGroup[] = [
    // Passage 1: Group 1 (Q1-Q4): True/False/Not Given
    {
      id: 'g1',
      passageId: 'p1',
      questionType: 'true_false_not_given',
      title: 'Questions 1–4',
      instructions:
        'Do the following statements agree with the information given in Reading Passage 1?\nIn boxes 1–4 on your answer sheet, choose TRUE if the statement agrees, FALSE if the statement contradicts, or NOT GIVEN if there is no information.',
      startQuestionNumber: 1,
      endQuestionNumber: 4,
      questions: [
        {
          id: 'q1',
          questionNumber: 1,
          prompt: 'Traditional trawling nets posed hazards to non-target marine species.',
          answerKey: 'TRUE',
          explanation: 'Paragraph A states traditional nets "posed grave risks to bycatch species".',
          evidenceQuote: 'posed grave risks to bycatch species',
          paragraphRef: 'A',
        },
        {
          id: 'q2',
          questionNumber: 2,
          prompt: 'The retention screen is made of woven textile mesh to filter microplastics.',
          answerKey: 'FALSE',
          explanation:
            'Paragraph B explicitly says "Because the screen is solid rather than woven mesh, marine fauna cannot become entangled".',
          evidenceQuote: 'Because the screen is solid rather than woven mesh',
          paragraphRef: 'B',
        },
        {
          id: 'q3',
          questionNumber: 3,
          prompt: 'The floating barrier relies on onboard diesel turbines for forward propulsion.',
          answerKey: 'FALSE',
          explanation:
            'Paragraph C states "Propulsion and orientation rely on drag forces rather than fossil fuel propulsion."',
          evidenceQuote: 'rely on drag forces rather than fossil fuel propulsion',
          paragraphRef: 'C',
        },
        {
          id: 'q4',
          questionNumber: 4,
          prompt: 'The cost of recycled plastic from the barrier is lower than virgin plastic.',
          answerKey: 'NOT GIVEN',
          explanation:
            'The passage discusses transferring plastic to recycling refineries, but does not compare costs with virgin plastic.',
          evidenceQuote: 'transferring condensed plastics into industrial shredders before transport to recycling refineries',
          paragraphRef: 'D',
        },
      ],
    },
    // Passage 1: Group 2 (Q5-Q8): Sentence Completion
    {
      id: 'g2',
      passageId: 'p1',
      questionType: 'sentence_completion',
      title: 'Questions 5–8',
      instructions:
        'Complete the sentences below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.',
      startQuestionNumber: 5,
      endQuestionNumber: 8,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      questions: [
        {
          id: 'q5',
          questionNumber: 5,
          prompt: 'The buoyant outer tube is constructed from high-density ________.',
          answerKey: 'polyethylene',
          acceptedAlternatives: ['polyethylene'],
          explanation: 'Paragraph B: "Fabricated from high-density polyethylene, the buoyant tube provides..."',
          evidenceQuote: 'high-density polyethylene',
          paragraphRef: 'B',
        },
        {
          id: 'q6',
          questionNumber: 6,
          prompt: 'A submerged deep-sea ________ reduces the speed at which the barrier travels.',
          answerKey: 'sea anchor',
          acceptedAlternatives: ['anchor', 'sea anchor'],
          explanation: 'Paragraph C: "A massive deep-sea sea anchor... dampens the system velocity."',
          evidenceQuote: 'A massive deep-sea sea anchor',
          paragraphRef: 'C',
        },
        {
          id: 'q7',
          questionNumber: 7,
          prompt: 'Perimeter pods equipped with a ________ relay operational information via satellite.',
          answerKey: 'solar beacon',
          acceptedAlternatives: ['solar beacon'],
          explanation: 'Paragraph D: "Solar beacon pods installed along the perimeter transmit real-time telemetry..."',
          evidenceQuote: 'Solar beacon pods',
          paragraphRef: 'D',
        },
        {
          id: 'q8',
          questionNumber: 8,
          prompt: 'During typhoons, operators submerge the barrier by flooding its flexible ________.',
          answerKey: 'ballast chambers',
          acceptedAlternatives: ['ballast chamber', 'ballast chambers'],
          explanation: 'Paragraph E: "flexible ballast chambers could be dynamically flooded..."',
          evidenceQuote: 'flexible ballast chambers',
          paragraphRef: 'E',
        },
      ],
    },
    // Passage 1: Group 3 (Q9-Q13): Diagram Label Completion
    {
      id: 'g3',
      passageId: 'p1',
      questionType: 'diagram_completion',
      title: 'Questions 9–13',
      instructions:
        'Label the diagram below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.',
      startQuestionNumber: 9,
      endQuestionNumber: 13,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      diagramData: {
        imageUrl: '/diagrams/ocean-barrier-system.svg',
        caption: 'Schematic of Autonomous Ocean Plastic Barrier System',
        labels: [
          { labelNumber: 9, questionNumber: 9, xPercent: 20, yPercent: 30, description: 'Upper flotation pipe' },
          { labelNumber: 10, questionNumber: 10, xPercent: 22, yPercent: 65, description: 'Subsurface barrier' },
          { labelNumber: 11, questionNumber: 11, xPercent: 50, yPercent: 88, description: 'Deep ocean drag device' },
          { labelNumber: 12, questionNumber: 12, xPercent: 75, yPercent: 35, description: 'Apex collection hub' },
          { labelNumber: 13, questionNumber: 13, xPercent: 85, yPercent: 20, description: 'Docked processing vessel' },
        ],
      },
      questions: [
        {
          id: 'q9',
          questionNumber: 9,
          prompt: 'Label 9: Upper buoyant component:',
          answerKey: 'floating barrier',
          acceptedAlternatives: ['floating barrier', 'buoyant tube'],
          explanation: 'Paragraph B: "elongated floating barrier anchored in a U-shaped configuration."',
          evidenceQuote: 'floating barrier',
          paragraphRef: 'B',
        },
        {
          id: 'q10',
          questionNumber: 10,
          prompt: 'Label 10: Three-meter subsurface barrier:',
          answerKey: 'retention screen',
          acceptedAlternatives: ['retention screen'],
          explanation: 'Paragraph B: "impermeable retention screen descending three meters below the water line."',
          evidenceQuote: 'retention screen',
          paragraphRef: 'B',
        },
        {
          id: 'q11',
          questionNumber: 11,
          prompt: 'Label 11: Deep current slowing mechanism:',
          answerKey: 'sea anchor',
          acceptedAlternatives: ['sea anchor'],
          explanation: 'Paragraph C: "A massive deep-sea sea anchor, suspended at an oceanic depth..."',
          evidenceQuote: 'sea anchor',
          paragraphRef: 'C',
        },
        {
          id: 'q12',
          questionNumber: 12,
          prompt: 'Label 12: Central area where debris gathers:',
          answerKey: 'retention zone',
          acceptedAlternatives: ['retention zone'],
          explanation: 'Paragraph C: "concentrating waste in the central retention zone."',
          evidenceQuote: 'retention zone',
          paragraphRef: 'C',
        },
        {
          id: 'q13',
          questionNumber: 13,
          prompt: 'Label 13: Offloading and shredding craft:',
          answerKey: 'extraction conveyor',
          acceptedAlternatives: ['extraction conveyor', 'conveyor vessel', 'extraction vessel'],
          explanation: 'Paragraph D: "an extraction conveyor vessel docks with the apex of the curve..."',
          evidenceQuote: 'extraction conveyor vessel',
          paragraphRef: 'D',
        },
      ],
    },
    // Passage 2: Group 4 (Q14-Q18): Matching Headings
    {
      id: 'g4',
      passageId: 'p2',
      questionType: 'matching_headings',
      title: 'Questions 14–18',
      instructions:
        'Reading Passage 2 has seven paragraphs, A–G.\nChoose the correct heading for Paragraphs A–E from the list of headings below.\nWrite the correct number, i–vii, in boxes 14–18.',
      startQuestionNumber: 14,
      endQuestionNumber: 18,
      optionsList: [
        { key: 'i', text: 'Causes and mechanics of metropolitan thermal elevation' },
        { key: 'ii', text: 'The natural cooling mechanisms of building envelopes' },
        { key: 'iii', text: 'Quantifying high-rise energy reductions with vertical facades' },
        { key: 'iv', text: 'Water resource challenges and municipal policy hurdles' },
        { key: 'v', text: 'Drought-tolerant flora as a sustainable alternative' },
        { key: 'vi', text: 'Psychological benefits and rental market premiums' },
        { key: 'vii', text: 'Creating continuous urban ecological corridors' },
      ],
      questions: [
        {
          id: 'q14',
          questionNumber: 14,
          prompt: 'Paragraph A',
          answerKey: 'i',
          explanation: 'Paragraph A describes the Urban Heat Island effect and how concrete and asphalt absorb and radiate heat.',
          paragraphRef: 'A',
        },
        {
          id: 'q15',
          questionNumber: 15,
          prompt: 'Paragraph B',
          answerKey: 'ii',
          explanation: 'Paragraph B explains evapotranspiration and vegetative shading as biological cooling buffers.',
          paragraphRef: 'B',
        },
        {
          id: 'q16',
          questionNumber: 16,
          prompt: 'Paragraph C',
          answerKey: 'iii',
          explanation: 'Paragraph C provides empirical data showing a 32% air conditioning reduction from vertical facades.',
          paragraphRef: 'C',
        },
        {
          id: 'q17',
          questionNumber: 17,
          prompt: 'Paragraph D',
          answerKey: 'iv',
          explanation: 'Paragraph D addresses wind shear, moisture loss, and the need for greywater recycling mandates.',
          paragraphRef: 'D',
        },
        {
          id: 'q18',
          questionNumber: 18,
          prompt: 'Paragraph E',
          answerKey: 'v',
          explanation: 'Paragraph E explores xerophytic cliff species, sedums, and mosses reducing irrigation by 68%.',
          paragraphRef: 'E',
        },
      ],
    },
    // Passage 2: Group 5 (Q19-Q21): Matching Features
    {
      id: 'g5',
      passageId: 'p2',
      questionType: 'matching_features',
      title: 'Questions 19–21',
      instructions:
        'Look at the following findings and the list of researchers below.\nMatch each finding with the correct researcher, A, B, or C.',
      startQuestionNumber: 19,
      endQuestionNumber: 21,
      optionsList: [
        { key: 'A', text: 'Dr. Elena Chen' },
        { key: 'B', text: 'Professor Marcus Vance' },
        { key: 'C', text: 'Dr. Samuel Thorne' },
      ],
      questions: [
        {
          id: 'q19',
          questionNumber: 19,
          prompt: 'Municipal policy requiring recycled water systems is crucial for large-scale living walls.',
          answerKey: 'B',
          explanation: 'Paragraph D: Professor Marcus Vance argued municipalities must mandate greywater recycling.',
          paragraphRef: 'D',
        },
        {
          id: 'q20',
          questionNumber: 20,
          prompt: 'Vertical irrigated trellises can cut commercial tower cooling power usage by nearly a third.',
          answerKey: 'A',
          explanation: 'Paragraph C: Dr. Elena Chen observed a 32% drop in air conditioning energy demand.',
          paragraphRef: 'C',
        },
        {
          id: 'q21',
          questionNumber: 21,
          prompt: 'Cultivating plants from arid cliff habitats yields significant reductions in irrigation requirements.',
          answerKey: 'C',
          explanation: 'Paragraph E: Dr. Samuel Thorne found xerophytic sedums and mosses reduced irrigation by 68%.',
          paragraphRef: 'E',
        },
      ],
    },
    // Passage 2: Group 6 (Q22-Q26): Summary Completion with Options List
    {
      id: 'g6',
      passageId: 'p2',
      questionType: 'summary_completion_options',
      title: 'Questions 22–26',
      instructions:
        'Complete the summary using the list of words, A–G, below.\nWrite the correct letter, A–G, in boxes 22–26 on your answer sheet.',
      startQuestionNumber: 22,
      endQuestionNumber: 26,
      contentWithGaps:
        'The advantages of biophilic design reach well beyond thermal moderation. Research in public health demonstrates that visual contact with greenery helps reduce [[22]] in corporate environments, contributing to increased employee [[23]]. In response, commercial properties boasting certified living envelopes are achieving higher [[24]] in leading international cities. Planners further advocate that individual installations should link into unbroken [[25]], which encourage beneficial [[26]] throughout dense downtown districts.',
      optionsList: [
        { key: 'A', text: 'stress markers' },
        { key: 'B', text: 'lease rates' },
        { key: 'C', text: 'ecological corridors' },
        { key: 'D', text: 'cooling breezes' },
        { key: 'E', text: 'workplace satisfaction' },
        { key: 'F', text: 'construction costs' },
        { key: 'G', text: 'traffic congestion' },
      ],
      questions: [
        {
          id: 'q22',
          questionNumber: 22,
          prompt: 'reduces [[22]] in corporate environments',
          answerKey: 'A',
          explanation: 'Paragraph F: "lowers cortisol levels" matches reducing stress markers.',
          paragraphRef: 'F',
        },
        {
          id: 'q23',
          questionNumber: 23,
          prompt: 'contributing to increased employee [[23]]',
          answerKey: 'E',
          explanation: 'Paragraph F: "gains in productivity and workplace satisfaction."',
          paragraphRef: 'F',
        },
        {
          id: 'q24',
          questionNumber: 24,
          prompt: 'achieving higher [[24]] in leading cities',
          answerKey: 'B',
          explanation: 'Paragraph F: "commanding premium lease rates".',
          paragraphRef: 'F',
        },
        {
          id: 'q25',
          questionNumber: 25,
          prompt: 'link into unbroken [[25]]',
          answerKey: 'C',
          explanation: 'Paragraph G: "must coalesce into contiguous ecological corridors."',
          paragraphRef: 'G',
        },
        {
          id: 'q26',
          questionNumber: 26,
          prompt: 'encourage beneficial [[26]] throughout dense areas',
          answerKey: 'D',
          explanation: 'Paragraph G: "foster convective cooling breezes that penetrate deep into downtown cores."',
          paragraphRef: 'G',
        },
      ],
    },
    // Passage 3: Group 7 (Q27-Q30): Multiple Choice (Single & Multi-Select)
    {
      id: 'g7_single',
      passageId: 'p3',
      questionType: 'multiple_choice_single',
      title: 'Questions 27–28',
      instructions: 'Choose the correct letter, A, B, C, or D.',
      startQuestionNumber: 27,
      endQuestionNumber: 28,
      questions: [
        {
          id: 'q27',
          questionNumber: 27,
          prompt: 'The availability heuristic leads individuals to judge risk based on:',
          options: [
            { key: 'A', text: 'Rigorous mathematical statistical calculations.' },
            { key: 'B', text: 'How readily memorable examples come to mind.' },
            { key: 'C', text: 'Recommendations from accredited financial planners.' },
            { key: 'D', text: 'Historical pricing averages over decades.' },
          ],
          answerKey: 'B',
          explanation: 'Paragraph B: "wherein individuals judge the likelihood of an outcome by the mental ease with which illustrative instances come to mind."',
          paragraphRef: 'B',
        },
        {
          id: 'q28',
          questionNumber: 28,
          prompt: 'According to prospect theory, how does human psychology process losses compared to gains?',
          options: [
            { key: 'A', text: 'Gains and losses generate identical emotional responses.' },
            { key: 'B', text: 'The thrill of gains substantially outweighs distress from losses.' },
            { key: 'C', text: 'The distress of a loss is approximately twice as intense as equivalent gains.' },
            { key: 'D', text: 'Loss aversion diminishes completely in professional investors.' },
          ],
          answerKey: 'C',
          explanation: 'Paragraph C: "the emotional anguish of losing $100 is roughly twice as potent as the pleasure derived from gaining $100."',
          paragraphRef: 'C',
        },
      ],
    },
    {
      id: 'g7_multi',
      passageId: 'p3',
      questionType: 'multiple_choice_multi',
      title: 'Questions 29–30',
      instructions:
        'Choose TWO letters, A–E.\nWhich TWO characteristics of digital "dark patterns" are highlighted in Paragraph D?',
      startQuestionNumber: 29,
      endQuestionNumber: 30,
      requiredSelectionCount: 2,
      allowAnyOrder: true,
      questions: [
        {
          id: 'q29_30',
          questionNumber: 29,
          prompt: 'Select the first dark pattern feature:',
          options: [
            { key: 'A', text: 'They manufacture synthetic scarcity using countdown timers.' },
            { key: 'B', text: 'They offer transparent price comparisons across competitor sites.' },
            { key: 'C', text: 'They capitalize on default effects to steer decisions.' },
            { key: 'D', text: 'They require dual biometric authentication before checkout.' },
            { key: 'E', text: 'They eliminate shipping surcharges for bulk orders.' },
          ],
          answerKey: ['A', 'C'],
          explanation: 'Paragraph D: dark patterns "exploit default effects and artificial scarcity" using countdown clocks.',
          paragraphRef: 'D',
        },
        {
          id: 'q30',
          questionNumber: 30,
          prompt: 'Select the second dark pattern feature:',
          options: [
            { key: 'A', text: 'They manufacture synthetic scarcity using countdown timers.' },
            { key: 'B', text: 'They offer transparent price comparisons across competitor sites.' },
            { key: 'C', text: 'They capitalize on default effects to steer decisions.' },
            { key: 'D', text: 'They require dual biometric authentication before checkout.' },
            { key: 'E', text: 'They eliminate shipping surcharges for bulk orders.' },
          ],
          answerKey: ['A', 'C'],
          explanation: 'Paragraph D: dark patterns "exploit default effects and artificial scarcity" using countdown clocks.',
          paragraphRef: 'D',
        },
      ],
    },
    // Passage 3: Group 8 (Q31-Q34): Yes / No / Not Given
    {
      id: 'g8',
      passageId: 'p3',
      questionType: 'yes_no_not_given',
      title: 'Questions 31–34',
      instructions:
        'Do the following statements agree with the claims of the writer in Reading Passage 3?\nIn boxes 31–34, write YES if the statement agrees, NO if it contradicts, or NOT GIVEN if it is impossible to say.',
      startQuestionNumber: 31,
      endQuestionNumber: 34,
      questions: [
        {
          id: 'q31',
          questionNumber: 31,
          prompt: 'Classical economic models accurately reflect real-world consumer financial decisions.',
          answerKey: 'NO',
          explanation: 'Paragraph A: Tversky and Kahneman showed human cognition "routinely diverges from formal probability calculus".',
          paragraphRef: 'A',
        },
        {
          id: 'q32',
          questionNumber: 32,
          prompt: 'Automatic enrollment in workplace pensions has increased savings rates.',
          answerKey: 'YES',
          explanation: 'Paragraph E: Automatic enrollment represents a triumph, "dramatically elevating savings participation".',
          paragraphRef: 'E',
        },
        {
          id: 'q33',
          questionNumber: 33,
          prompt: 'All governments have created dedicated behavioral insight teams.',
          answerKey: 'NOT GIVEN',
          explanation: 'The passage discusses libertarian paternalism, but does not claim all governments have created insight teams.',
          paragraphRef: 'E',
        },
        {
          id: 'q34',
          questionNumber: 34,
          prompt: 'Critics argue that state nudging can undermine citizens’ capacity for independent critical thought.',
          answerKey: 'YES',
          explanation: 'Paragraph F: Critics claim nudging risks "eroding the fundamental civic expectation that individuals should cultivate self-directed critical evaluation."',
          paragraphRef: 'F',
        },
      ],
    },
    // Passage 3: Group 9 (Q35-Q37): Matching Sentence Endings
    {
      id: 'g9',
      passageId: 'p3',
      questionType: 'matching_sentence_endings',
      title: 'Questions 35–37',
      instructions:
        'Complete each sentence with the correct ending, A–E, below.\nWrite the correct letter, A–E, in boxes 35–37.',
      startQuestionNumber: 35,
      endQuestionNumber: 37,
      optionsList: [
        { key: 'A', text: 'assumed actors possessed unlimited computational logic to maximize utility.' },
        { key: 'B', text: 'prompt people to overinsure against rare but dramatic hazards.' },
        { key: 'C', text: 'leads investors to irrationally retain plummeting assets.' },
        { key: 'D', text: 'eliminates the requirement for any consumer decision-making.' },
        { key: 'E', text: 'guarantees complete transparency across all financial institutions.' },
      ],
      questions: [
        {
          id: 'q35',
          questionNumber: 35,
          prompt: 'Early theoretical models of rational economic agents',
          answerKey: 'A',
          explanation: 'Paragraph A describes homo economicus as possessing computational capacity to maximize expected utility.',
          paragraphRef: 'A',
        },
        {
          id: 'q36',
          questionNumber: 36,
          prompt: 'Sensationalized media reports of shark attacks and plane accidents',
          answerKey: 'B',
          explanation: 'Paragraph B explains availability heuristics prompting consumers to overinsure against improbable catastrophes.',
          paragraphRef: 'B',
        },
        {
          id: 'q37',
          questionNumber: 37,
          prompt: 'The profound psychological reluctance to realize financial losses',
          answerKey: 'C',
          explanation: 'Paragraph C describes investors stubbornly holding depreciating equities due to loss aversion.',
          paragraphRef: 'C',
        },
      ],
    },
    // Passage 3: Group 10 (Q38-Q40): Short-Answer Questions
    {
      id: 'g10',
      passageId: 'p3',
      questionType: 'short_answer',
      title: 'Questions 38–40',
      instructions:
        'Answer the questions below.\nChoose NO MORE THAN TWO WORDS from the passage for each answer.',
      startQuestionNumber: 38,
      endQuestionNumber: 40,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      questions: [
        {
          id: 'q38',
          questionNumber: 38,
          prompt: 'What theoretical concept idealized humans as perfectly rational decision-makers?',
          answerKey: 'homo economicus',
          acceptedAlternatives: ['homo economicus'],
          explanation: 'Paragraph A: "foundation of homo economicus—an idealized rational agent..."',
          evidenceQuote: 'homo economicus',
          paragraphRef: 'A',
        },
        {
          id: 'q39',
          questionNumber: 39,
          prompt: 'What deceptive online interface patterns capitalize on consumer cognitive vulnerabilities?',
          answerKey: 'dark patterns',
          acceptedAlternatives: ['dark patterns'],
          explanation: 'Paragraph D: "Subtle design manipulations—termed \'dark patterns\'—exploit default effects..."',
          evidenceQuote: 'dark patterns',
          paragraphRef: 'D',
        },
        {
          id: 'q40',
          questionNumber: 40,
          prompt: 'What popular term describes libertarian paternalism interventions aimed at improving choices?',
          answerKey: 'nudging',
          acceptedAlternatives: ['nudging'],
          explanation: 'Paragraph E: "libertarian paternalism—commonly referred to as \'nudging\'—to steer citizens..."',
          evidenceQuote: 'nudging',
          paragraphRef: 'E',
        },
      ],
    },
  ];

  const { test: academicTest, version: academicVersion } = createReadingTest({
    title: 'Academic Reading Full Mock Examination 1',
    testType: 'academic',
    category: 'mock',
    timeLimitMinutes: 60,
    createdById: adminId,
    passages: academicPassages,
    questionGroups: academicGroups,
  });

  publishTestVersion(academicTest.id, academicVersion.id);
  console.log('Published Academic Reading Full Mock (40 questions, all formats covered).');

  // -------------------------------------------------------------
  // TEST 2: General Training Reading Demonstration Practice Set (22 Questions)
  // Covering multiple short texts per section, tables, flow charts, summaries with passage words, matching information, notes
  // -------------------------------------------------------------
  const gtPassages: ReadingPassage[] = [
    {
      id: 'gt_p1',
      passageNumber: 1,
      title: 'Section 1: Community Education & Campus Services',
      paragraphs: [],
      shortTexts: [
        {
          id: 'gt_text_a',
          title: 'Text A: Community College Evening Language Courses',
          content:
            'Westwood Community College provides non-credit evening language programs designed for working professionals. Classes run weekly from 18:30 to 20:30 across an eight-week term. Full tuition of $240 must be settled at least seven calendar days prior to course commencement. Learners withdrawing before the second session are entitled to an 80 percent tuition refund minus a $20 administrative charge. Audio materials and digital laboratory access are included in tuition fees.',
        },
        {
          id: 'gt_text_b',
          title: 'Text B: Campus Media Center and Equipment Loans',
          content:
            'The Campus Media Center lends laptops, high-definition camcorders, and audio recording microphones to enrolled students. Standard loan durations are 72 hours for computing hardware and 48 hours for audiovisual gear. Items returned past the stipulated deadline incur a penalty of $5 per day. Equipment reservations must be lodged through the student portal at least 24 hours in advance. Broken or water-damaged gear remains the financial liability of the borrower.',
        },
        {
          id: 'gt_text_c',
          title: 'Text C: Campus Recreational Sports Memberships',
          content:
            'The Westwood Sports Pavilion features an Olympic swimming pool, indoor squash courts, and a functional strength training suite. Community passes are priced at $45 per month with no mandatory annual contract. Inductions on cardiovascular equipment are complimentary for all new registrants on Saturday mornings. Lockers require a personal padlock or a $2 refundable token obtainable at the reception desk.',
        },
      ],
    },
    {
      id: 'gt_p2',
      passageNumber: 2,
      title: 'Section 2: Workplace Health & Ergonomics Policy',
      paragraphs: [
        {
          id: 'gt_p2_a',
          label: 'A',
          content:
            'All administrative personnel spending over four continuous hours daily at digital workstations must undergo an ergonomic workspace assessment. Proper display height requires that the top bezel of the monitor align horizontally with eye level, minimizing cervical vertebrae tension. Keyboards should reside on an adjustable tray with the forearms positioned parallel to the floor.',
        },
        {
          id: 'gt_p2_b',
          label: 'B',
          content:
            'When musculoskeletal strain arises, staff members must file a formal Notification of Discomfort within 48 hours to human resources. The health and safety officer will arrange an on-site evaluation within five working days. Where specialized lumbar support or vertical ergonomic mice are recommended, equipment procurement is funded directly through departmental occupational health budgets.',
        },
      ],
    },
  ];

  const gtGroups: QuestionGroup[] = [
    // Section 1: Group 1 (Q1-Q5): Matching Information across Short Texts
    {
      id: 'gt_g1',
      passageId: 'gt_p1',
      questionType: 'matching_information',
      title: 'Questions 1–5',
      instructions:
        'Look at the three campus texts, A–C.\nWhich text contains the following information?\nWrite the correct letter, A, B, or C, in boxes 1–5.\nNB You may use any letter more than once.',
      startQuestionNumber: 1,
      endQuestionNumber: 5,
      optionReuseAllowed: true,
      optionsList: [
        { key: 'A', text: 'Text A: Community College Evening Language Courses' },
        { key: 'B', text: 'Text B: Campus Media Center and Equipment Loans' },
        { key: 'C', text: 'Text C: Campus Recreational Sports Memberships' },
      ],
      questions: [
        {
          id: 'gt_q1',
          questionNumber: 1,
          prompt: 'rules regarding financial penalties for tardy returns',
          answerKey: 'B',
          explanation: 'Text B mentions items returned past deadline incur $5/day penalty.',
        },
        {
          id: 'gt_q2',
          questionNumber: 2,
          prompt: 'conditions for obtaining a partial course fee refund',
          answerKey: 'A',
          explanation: 'Text A details 80% tuition refund if withdrawing before second session.',
        },
        {
          id: 'gt_q3',
          questionNumber: 3,
          prompt: 'availability of complimentary machinery training sessions',
          answerKey: 'C',
          explanation: 'Text C states cardiovascular equipment inductions are complimentary on Saturday mornings.',
        },
        {
          id: 'gt_q4',
          questionNumber: 4,
          prompt: 'advance portal notice needed before borrowing hardware',
          answerKey: 'B',
          explanation: 'Text B says equipment reservations must be lodged at least 24 hours in advance.',
        },
        {
          id: 'gt_q5',
          questionNumber: 5,
          prompt: 'the option of month-to-month access without long-term commitment',
          answerKey: 'C',
          explanation: 'Text C states community passes are $45/month with no mandatory annual contract.',
        },
      ],
    },
    // Section 1: Group 2 (Q6-Q9): Table Completion
    {
      id: 'gt_g2',
      passageId: 'gt_p1',
      questionType: 'table_completion',
      title: 'Questions 6–9',
      instructions:
        'Complete the table below.\nChoose NO MORE THAN TWO WORDS AND/OR A NUMBER from the texts for each answer.',
      startQuestionNumber: 6,
      endQuestionNumber: 9,
      wordLimitRule: 'NO MORE THAN TWO WORDS AND/OR A NUMBER',
      maxWords: 2,
      maxNumbers: 1,
      tableData: {
        headers: ['Service', 'Operating Hours / Duration', 'Cost / Fee', 'Special Requirement'],
        rows: [
          {
            cells: [
              { content: 'Evening Languages' },
              { content: '18:30 to 20:30' },
              { content: '$240' },
              { content: 'Full payment [[6]] days in advance', isGap: true, questionNumber: 6 },
            ],
          },
          {
            cells: [
              { content: 'Computing Hardware Loan' },
              { content: '[[7]] hours maximum', isGap: true, questionNumber: 7 },
              { content: '$5 per day if late' },
              { content: 'Portal booking 24 hrs prior' },
            ],
          },
          {
            cells: [
              { content: 'AV Equipment Loan' },
              { content: '48 hours' },
              { content: '$5 per day if late' },
              { content: 'Financial liability for [[8]] gear', isGap: true, questionNumber: 8 },
            ],
          },
          {
            cells: [
              { content: 'Sports Pavilion Pass' },
              { content: 'Monthly' },
              { content: '$45 per month' },
              { content: 'Personal lock or [[9]] deposit token', isGap: true, questionNumber: 9 },
            ],
          },
        ],
      },
      questions: [
        {
          id: 'gt_q6',
          questionNumber: 6,
          prompt: 'Table gap 6: Days payment needed in advance:',
          answerKey: 'seven',
          acceptedAlternatives: ['7', 'seven', '7 calendar days', 'seven calendar days'],
          explanation: 'Text A: "settled at least seven calendar days prior to course commencement."',
        },
        {
          id: 'gt_q7',
          questionNumber: 7,
          prompt: 'Table gap 7: Laptop loan duration limit in hours:',
          answerKey: '72',
          acceptedAlternatives: ['72', 'seventy-two'],
          explanation: 'Text B: "Standard loan durations are 72 hours for computing hardware..."',
        },
        {
          id: 'gt_q8',
          questionNumber: 8,
          prompt: 'Table gap 8: Borrower is liable for:',
          answerKey: 'water-damaged',
          acceptedAlternatives: ['broken or water-damaged', 'water-damaged', 'broken'],
          explanation: 'Text B: "Broken or water-damaged gear remains the financial liability..."',
        },
        {
          id: 'gt_q9',
          questionNumber: 9,
          prompt: 'Table gap 9: Refundable token cost for lockers:',
          answerKey: '$2',
          acceptedAlternatives: ['2', '$2', 'two dollars', 'two dollar'],
          explanation: 'Text C: "personal padlock or a $2 refundable token..."',
        },
      ],
    },
    // Section 2: Group 3 (Q10-Q14): Note Completion
    {
      id: 'gt_g3',
      passageId: 'gt_p2',
      questionType: 'note_completion',
      title: 'Questions 10–14',
      instructions:
        'Complete the notes below.\nChoose NO MORE THAN TWO WORDS from Section 2 for each answer.',
      startQuestionNumber: 10,
      endQuestionNumber: 14,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      contentWithGaps:
        'Workstation Ergonomics Guidelines:\n• Assessments mandatory for staff using screens over [[10]] hours continuously.\n• Monitor top bezel must match [[11]] horizontally.\n• Keyboard tray must keep user\'s [[12]] parallel to desk floor.\n• Health incidents: file Discomfort Notification within [[13]] hours.\n• Health and safety officer on-site evaluation occurs within [[14]] working days.',
      questions: [
        {
          id: 'gt_q10',
          questionNumber: 10,
          prompt: 'Note gap 10: Screen time threshold:',
          answerKey: 'four',
          acceptedAlternatives: ['4', 'four'],
          explanation: 'Paragraph A: "spending over four continuous hours daily at digital workstations..."',
        },
        {
          id: 'gt_q11',
          questionNumber: 11,
          prompt: 'Note gap 11: Monitor alignment level:',
          answerKey: 'eye level',
          acceptedAlternatives: ['eye level'],
          explanation: 'Paragraph A: "align horizontally with eye level..."',
        },
        {
          id: 'gt_q12',
          questionNumber: 12,
          prompt: 'Note gap 12: Body part parallel to floor:',
          answerKey: 'forearms',
          acceptedAlternatives: ['forearms'],
          explanation: 'Paragraph A: "forearms positioned parallel to the floor."',
        },
        {
          id: 'gt_q13',
          questionNumber: 13,
          prompt: 'Note gap 13: Hours to file notification:',
          answerKey: '48',
          acceptedAlternatives: ['48', 'forty-eight'],
          explanation: 'Paragraph B: "file a formal Notification of Discomfort within 48 hours..."',
        },
        {
          id: 'gt_q14',
          questionNumber: 14,
          prompt: 'Note gap 14: Days for on-site evaluation:',
          answerKey: 'five',
          acceptedAlternatives: ['5', 'five'],
          explanation: 'Paragraph B: "arrange an on-site evaluation within five working days."',
        },
      ],
    },
    // Section 2: Group 4 (Q15-Q18): Flow-Chart Completion
    {
      id: 'gt_g4',
      passageId: 'gt_p2',
      questionType: 'flow_chart_completion',
      title: 'Questions 15–18',
      instructions:
        'Complete the flow-chart below.\nChoose NO MORE THAN TWO WORDS from Section 2 for each answer.',
      startQuestionNumber: 15,
      endQuestionNumber: 18,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      flowChartSteps: [
        {
          stepNumber: 1,
          title: 'Step 1: Discomfort Emergence',
          descriptionWithGaps: 'Staff member experiences symptoms of [[15]].',
          questionNumbers: [15],
        },
        {
          stepNumber: 2,
          title: 'Step 2: Formal Filing',
          descriptionWithGaps: 'Lodge written notification with [[16]] inside 48 hours.',
          questionNumbers: [16],
        },
        {
          stepNumber: 3,
          title: 'Step 3: Specialist Evaluation',
          descriptionWithGaps: 'Conducted by the [[17]] within five days.',
          questionNumbers: [17],
        },
        {
          stepNumber: 4,
          title: 'Step 4: Procurement Approval',
          descriptionWithGaps: 'Approved equipment charged to departmental [[18]] budget.',
          questionNumbers: [18],
        },
      ],
      questions: [
        {
          id: 'gt_q15',
          questionNumber: 15,
          prompt: 'Flow-chart step 1: Discomfort type:',
          answerKey: 'musculoskeletal strain',
          acceptedAlternatives: ['musculoskeletal strain', 'strain'],
          explanation: 'Paragraph B: "When musculoskeletal strain arises..."',
        },
        {
          id: 'gt_q16',
          questionNumber: 16,
          prompt: 'Flow-chart step 2: Department to notify:',
          answerKey: 'human resources',
          acceptedAlternatives: ['human resources', 'HR'],
          explanation: 'Paragraph B: "file a formal Notification of Discomfort within 48 hours to human resources."',
        },
        {
          id: 'gt_q17',
          questionNumber: 17,
          prompt: 'Flow-chart step 3: Officer conducting evaluation:',
          answerKey: 'health and safety officer',
          acceptedAlternatives: ['health and safety officer', 'safety officer'],
          explanation: 'Paragraph B: "The health and safety officer will arrange an on-site evaluation..."',
        },
        {
          id: 'gt_q18',
          questionNumber: 18,
          prompt: 'Flow-chart step 4: Specific budget funded:',
          answerKey: 'occupational health',
          acceptedAlternatives: ['occupational health'],
          explanation: 'Paragraph B: "funded directly through departmental occupational health budgets."',
        },
      ],
    },
    // Section 2: Group 5 (Q19-Q22): Summary Completion Using Passage Words
    {
      id: 'gt_g5',
      passageId: 'gt_p2',
      questionType: 'summary_completion_words',
      title: 'Questions 19–22',
      instructions:
        'Complete the summary below.\nChoose NO MORE THAN TWO WORDS from Section 2 for each answer.',
      startQuestionNumber: 19,
      endQuestionNumber: 22,
      wordLimitRule: 'NO MORE THAN TWO WORDS',
      maxWords: 2,
      contentWithGaps:
        'Maintaining ergonomic standards at office workstations helps prevent chronic strain to the [[19]]. Employees can obtain ergonomic recommendations for specialized gear such as [[20]] or [[21]] devices. All recommended equipment is purchased using allocations provided by [[22]] accounts.',
      questions: [
        {
          id: 'gt_q19',
          questionNumber: 19,
          prompt: 'Summary gap 19: Spinal area protected:',
          answerKey: 'cervical vertebrae',
          acceptedAlternatives: ['cervical vertebrae'],
          explanation: 'Paragraph A: "minimizing cervical vertebrae tension."',
        },
        {
          id: 'gt_q20',
          questionNumber: 20,
          prompt: 'Summary gap 20: Specialized support item:',
          answerKey: 'lumbar support',
          acceptedAlternatives: ['lumbar support'],
          explanation: 'Paragraph B: "Where specialized lumbar support or vertical ergonomic mice..."',
        },
        {
          id: 'gt_q21',
          questionNumber: 21,
          prompt: 'Summary gap 21: Alternative mouse device:',
          answerKey: 'vertical ergonomic mice',
          acceptedAlternatives: ['vertical ergonomic mice', 'vertical mice'],
          explanation: 'Paragraph B: "vertical ergonomic mice are recommended..."',
        },
        {
          id: 'gt_q22',
          questionNumber: 22,
          prompt: 'Summary gap 22: Funding source:',
          answerKey: 'occupational health',
          acceptedAlternatives: ['occupational health', 'occupational health budgets'],
          explanation: 'Paragraph B: "funded directly through departmental occupational health budgets."',
        },
      ],
    },
  ];

  const { test: gtTest, version: gtVersion } = createReadingTest({
    title: 'General Training Reading Practice: Community & Workplace',
    testType: 'general',
    category: 'practice',
    timeLimitMinutes: 40,
    createdById: adminId,
    passages: gtPassages,
    questionGroups: gtGroups,
  });

  publishTestVersion(gtTest.id, gtVersion.id);
  console.log('Published General Training Reading Practice (22 questions, multi-texts, table, flowchart, notes, summary).');
}
