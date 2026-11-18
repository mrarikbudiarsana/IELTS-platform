export const speakingCriteria = ['fluencyCoherence', 'lexicalResource', 'grammaticalRange', 'pronunciation'] as const;
export type SpeakingCriterion = typeof speakingCriteria[number];

// Teaching summaries of the supplied public descriptors, in speakingCriteria order.
export const speakingRubric = {
  version: 'speaking-descriptors-v1',
  sources: ['IELTS Speaking Band Descriptors', 'IELTS Speaking Key Assessment Criteria'],
  criteria: speakingCriteria,
  indicators: {
    fluencyCoherence: 'Continuity, effort, reasons for hesitation, logical sequencing, relevance, cohesive language and development of ideas.',
    lexicalResource: 'Range and precision across topics, register, collocation, idiom and successful paraphrase.',
    grammaticalRange: 'Variety and control of clauses, tense, aspect and phrase structure. Consider recurring errors and their effect on meaning.',
    pronunciation: 'Listen for meaningful chunking, rhythm, linking, stress, intonation and sounds. Judge listener effort and intelligibility across the sample.',
  },
  bands: {
    9: ['Effortless coherent development with only rare repairs.', 'Consistently precise, flexible and idiomatic.', 'Consistently accurate across the full structural range.', 'Subtle meaning is clear through sustained control of connected speech.'],
    8: ['Sustained relevant development with mainly content-related pauses.', 'Precise across topics with occasional collocation slips.', 'Flexible grammar with most sentences accurate.', 'Easy to understand throughout with occasional lapses in rhythm or emphasis.'],
    7: ['Extended turns hold together despite occasional language searches.', 'Flexible expression and effective paraphrase with some awkward choices.', 'Frequent accurate sentences across simple and complex forms.', 'Secure band 6 control with several features of band 8.'],
    6: ['Sustains turns but repairs or unsuitable linking sometimes obscure progression.', 'Generally clear across topics and usually able to rephrase.', 'Uses several forms with complex errors that seldom obscure meaning.', 'Generally clear with variable rhythm, stress or individual sounds.'],
    5: ['Maintains simpler speech but searches and repetition disrupt complex ideas.', 'Enough vocabulary for different topics with inconsistent paraphrase.', 'Basic grammar is controlled but complex attempts often need repair.', 'Secure band 4 control with several features of band 6.'],
    4: ['Pauses and repeated links interrupt sequences of simple ideas.', 'Familiar topics manageable, unfamiliar meanings difficult to express.', 'Some accurate basic forms with frequent errors and little subordination.', 'Some clear chunks but frequent sound and rhythm difficulties require listener effort.'],
    3: ['Long pauses impede even short connected answers.', 'Mainly personal and familiar words.', 'Frequent errors even in basic forms outside rehearsed phrases.', 'Some limited clarity beyond band 2 with occasional features of band 4.'],
    2: ['Isolated words separated by extended pauses.', 'Isolated or memorised expressions convey very little.', 'Basic sentence construction is absent.', 'Little connected speech is intelligible.'],
    1: ['No coherent message.', 'Only isolated words conveyable.', 'No assessable spontaneous grammar.', 'Occasional recognisable sounds convey no overall message.'],
  },
  principles: ['Judge typical performance across all three parts.', 'Choose the level whose positive features are supported.', 'Accent matters only through its effect on understanding.', 'Band 0 denotes non-attendance. Missing or unusable recordings require more evidence.'],
} as const;
