export const formatQuestionTypeName = (type: string): string => {
  const map: Record<string, string> = {
    matching_headings: 'Matching Headings',
    true_false_not_given: 'True / False / Not Given',
    yes_no_not_given: 'Yes / No / Not Given',
    multiple_choice_single: 'Multiple Choice',
    multiple_choice_multi: 'Multiple Choice (Multi-select)',
    matching_information: 'Matching Information',
    matching_features: 'Matching Features',
    matching_sentence_endings: 'Matching Sentence Endings',
    sentence_completion: 'Sentence Completion',
    summary_completion_words: 'Summary Completion',
    summary_completion_options: 'Summary Completion (with Options)',
    note_completion: 'Note Completion',
    table_completion: 'Table Completion',
    flow_chart_completion: 'Flow-chart Completion',
    diagram_completion: 'Diagram Labelling',
    short_answer: 'Short Answer',
    listening_multiple_choice_single: 'Multiple Choice',
    listening_multiple_choice_multi: 'Multiple Choice (Multi-select)',
    matching: 'Matching',
    plan_map_diagram_labelling: 'Map / Diagram Labelling',
    form_completion: 'Form Completion',
    summary_completion: 'Summary Completion',
  };
  return map[type] || type.split('_').map((w) => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
};
