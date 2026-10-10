import React, { useState, useEffect } from 'react';
import {
  BookOpen,
  Search,
  Plus,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  Bookmark,
  Volume2,
  ChevronRight,
  ArrowRight,
  Layers,
  X
} from 'lucide-react';

interface VocabWord {
  id: string;
  word: string;
  partOfSpeech: string;
  definition: string;
  example: string;
  bandLevel: string;
  collocations?: string[];
  isCustom?: boolean;
}

const INITIAL_VOCAB: VocabWord[] = [
  {
    id: '1',
    word: 'Corroborate',
    partOfSpeech: 'verb',
    definition: 'To confirm or give support to a statement, theory, or finding with evidence.',
    example: 'Recent archaeological excavations corroborate the hypothesis that the civilization flourished in the Bronze Age.',
    bandLevel: 'Band 8+',
    collocations: ['corroborating evidence', 'corroborate findings', 'independent sources corroborate']
  },
  {
    id: '2',
    word: 'Mitigate',
    partOfSpeech: 'verb',
    definition: 'To make something bad less severe, serious, or painful.',
    example: 'Government policies must actively mitigate the economic fallout of rapid industrial decarbonization.',
    bandLevel: 'Band 7.5+',
    collocations: ['mitigate risks', 'mitigate the impact', 'mitigation strategies']
  },
  {
    id: '3',
    word: 'Discrepancy',
    partOfSpeech: 'noun',
    definition: 'A lack of compatibility or similarity between two or more facts.',
    example: 'Examiners noted an undeniable discrepancy between the recorded figures and the official audit report.',
    bandLevel: 'Band 7.5+',
    collocations: ['glaring discrepancy', 'resolve discrepancies', 'discrepancy in data']
  },
  {
    id: '4',
    word: 'Ubiquitous',
    partOfSpeech: 'adjective',
    definition: 'Present, appearing, or found everywhere at once.',
    example: 'Smartphones have become ubiquitous across global classrooms, permanently altering pedagogical practices.',
    bandLevel: 'Band 8+',
    collocations: ['ubiquitous presence', 'ubiquitous technology', 'increasingly ubiquitous']
  },
  {
    id: '5',
    word: 'Pragmatic',
    partOfSpeech: 'adjective',
    definition: 'Dealing with things sensibly and realistically in a way that is based on practical rather than theoretical considerations.',
    example: 'The administration opted for a pragmatic compromise between environmental preservation and municipal expansion.',
    bandLevel: 'Band 7.5+',
    collocations: ['pragmatic approach', 'pragmatic solution', 'pragmatically speaking']
  },
  {
    id: '6',
    word: 'Exemplify',
    partOfSpeech: 'verb',
    definition: 'To be a typical example of something or illustrate clearly.',
    example: 'The author exemplifies this linguistic shift through extensive analysis of contemporary digital journalism.',
    bandLevel: 'Band 7.5+',
    collocations: ['vividly exemplify', 'exemplify the trend', 'exemplified by']
  },
  {
    id: '7',
    word: 'Delineate',
    partOfSpeech: 'verb',
    definition: 'To describe or portray something precisely or trace the outline of.',
    example: 'In Academic Task 1, candidates are expected to clearly delineate key trends without offering personal opinions.',
    bandLevel: 'Band 8+',
    collocations: ['clearly delineate', 'delineate the boundaries', 'delineated in the text']
  },
  {
    id: '8',
    word: 'Juxtapose',
    partOfSpeech: 'verb',
    definition: 'To place or deal with close together for contrasting effect.',
    example: 'The essay juxtaposes the advantages of renewable energy with the immediate financial costs of infrastructural conversion.',
    bandLevel: 'Band 8.5+',
    collocations: ['juxtapose with', 'striking juxtaposition', 'juxtaposed viewpoints']
  }
];

export const VocabularyView: React.FC<{ onWordSaved?: () => void; onWordReviewed?: () => void }> = ({
  onWordSaved,
  onWordReviewed
}) => {
  const [words, setWords] = useState<VocabWord[]>(() => {
    const saved = localStorage.getItem('ielts_vocab_words');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch {
        return INITIAL_VOCAB;
      }
    }
    return INITIAL_VOCAB;
  });

  const [search, setSearch] = useState('');
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newWord, setNewWord] = useState('');
  const [newPos, setNewPos] = useState('noun');
  const [newDefinition, setNewDefinition] = useState('');
  const [newExample, setNewExample] = useState('');

  // Flashcard review state
  const [reviewMode, setReviewMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    localStorage.setItem('ielts_vocab_words', JSON.stringify(words));
  }, [words]);

  const handleAddWord = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newWord.trim() || !newDefinition.trim()) return;

    const created: VocabWord = {
      id: Date.now().toString(),
      word: newWord.trim(),
      partOfSpeech: newPos,
      definition: newDefinition.trim(),
      example: newExample.trim() || `The term "${newWord.trim()}" is highly recommended for academic IELTS tasks.`,
      bandLevel: 'Band 8.0',
      isCustom: true
    };

    setWords([created, ...words]);
    localStorage.setItem('ielts_has_saved_word', 'true');
    if (onWordSaved) onWordSaved();

    setNewWord('');
    setNewDefinition('');
    setNewExample('');
    setIsAddOpen(false);
  };

  const handleFinishReview = () => {
    localStorage.setItem('ielts_has_reviewed_word', 'true');
    if (onWordReviewed) onWordReviewed();
    setReviewMode(false);
    setCurrentCardIndex(0);
    setIsFlipped(false);
  };

  const filteredWords = words.filter(
    (w) =>
      w.word.toLowerCase().includes(search.toLowerCase()) ||
      w.definition.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7E3D9] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#084F7D] bg-[#EBF4F9] px-2.5 py-0.5 rounded-full">
              Academic Lexicon
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            IELTS Academic Vocabulary Bank
          </h1>
          <p className="text-sm text-slate-500 mt-1 font-normal">
            Master high-scoring Band 7.5+ collocations, synonyms, and context sentences to boost your Lexical Resource mark.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              setReviewMode(true);
              setCurrentCardIndex(0);
              setIsFlipped(false);
            }}
            className="px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <RotateCcw className="w-4 h-4 text-[#084F7D]" />
            <span>Flashcard Review</span>
          </button>
          <button
            onClick={() => setIsAddOpen(true)}
            className="px-4 py-2 rounded-xl bg-[#084F7D] hover:bg-[#063D62] text-white text-xs font-semibold flex items-center gap-2 shadow-2xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Save a Word</span>
          </button>
        </div>
      </div>

      {/* Review Flashcard Mode Modal/Overlay */}
      {reviewMode && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-8 shadow-2xl border border-[#E7E3D9] flex flex-col items-center text-center">
            <div className="w-full flex items-center justify-between mb-6">
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Card {currentCardIndex + 1} of {words.length}
              </span>
              <button
                onClick={() => setReviewMode(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Flashcard Body */}
            <div
              onClick={() => setIsFlipped(!isFlipped)}
              className="w-full min-h-[220px] rounded-2xl bg-[#FAF9F5] border-2 border-dashed border-[#E7E3D9] p-8 flex flex-col items-center justify-center cursor-pointer select-none hover:border-[#084F7D] transition-all"
            >
              {!isFlipped ? (
                <div>
                  <span className="text-xs uppercase font-semibold text-[#FC9F23] tracking-wider mb-2 block">
                    {words[currentCardIndex]?.partOfSpeech}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#084F7D] tracking-tight mb-3">
                    {words[currentCardIndex]?.word}
                  </h3>
                  <p className="text-xs text-slate-400 font-normal">Click to reveal definition & example</p>
                </div>
              ) : (
                <div className="animate-in fade-in duration-150">
                  <h4 className="text-base font-semibold text-slate-900 mb-2">
                    {words[currentCardIndex]?.definition}
                  </h4>
                  <p className="text-xs italic text-slate-600 mt-2 bg-white/80 p-3 rounded-xl border border-slate-100 font-normal">
                    "{words[currentCardIndex]?.example}"
                  </p>
                </div>
              )}
            </div>

            {/* Card controls */}
            <div className="flex items-center gap-3 mt-8 w-full">
              <button
                onClick={() => {
                  if (currentCardIndex + 1 < words.length) {
                    setCurrentCardIndex(currentCardIndex + 1);
                    setIsFlipped(false);
                  } else {
                    handleFinishReview();
                  }
                }}
                className="w-full py-2.5 rounded-xl bg-[#084F7D] hover:bg-[#063D62] text-white text-xs font-semibold transition-colors shadow-2xs"
              >
                {currentCardIndex + 1 < words.length ? 'Next Word →' : 'Complete Review Session'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Word Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-[#E7E3D9]">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-4">
              <h3 className="text-base font-bold text-slate-900">Add New Word to Word Bank</h3>
              <button onClick={() => setIsAddOpen(false)}>
                <X className="w-5 h-5 text-slate-400" />
              </button>
            </div>
            <form onSubmit={handleAddWord} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Word</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Incongruous"
                  value={newWord}
                  onChange={(e) => setNewWord(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#084F7D]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Part of Speech</label>
                <select
                  value={newPos}
                  onChange={(e) => setNewPos(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#084F7D]/30"
                >
                  <option value="verb">Verb</option>
                  <option value="noun">Noun</option>
                  <option value="adjective">Adjective</option>
                  <option value="adverb">Adverb</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Definition</label>
                <textarea
                  required
                  rows={2}
                  placeholder="Definition in English..."
                  value={newDefinition}
                  onChange={(e) => setNewDefinition(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#084F7D]/30"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-700 mb-1">Example Sentence</label>
                <textarea
                  rows={2}
                  placeholder="Sample sentence demonstrating academic usage..."
                  value={newExample}
                  onChange={(e) => setNewExample(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-[#084F7D]/30"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#084F7D] hover:bg-[#063D62] text-white text-xs font-semibold rounded-xl"
                >
                  Save Word
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Search and Filters Bar */}
      <div className="flex items-center gap-3 mb-6 bg-white p-3 rounded-2xl border border-[#E7E3D9] shadow-2xs">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search academic vocabulary, collocations, or definitions..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 text-sm bg-transparent border-0 focus:outline-none text-slate-900"
          />
        </div>
        <span className="text-xs text-slate-400 font-semibold px-2 shrink-0">
          {filteredWords.length} words saved
        </span>
      </div>

      {/* Words Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredWords.map((item) => (
          <div
            key={item.id}
            className="bg-white rounded-2xl border border-[#E7E3D9] p-6 hover:border-[#084F7D]/40 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold uppercase tracking-wider text-[#084F7D] bg-[#EBF4F9] px-2.5 py-0.5 rounded-md">
                  {item.partOfSpeech}
                </span>
                <span className="text-[11px] font-semibold text-[#FC9F23] bg-[#FEF7EE] px-2 py-0.5 rounded-md">
                  {item.bandLevel}
                </span>
              </div>

              <h3 className="text-lg font-bold text-slate-900 mb-2 tracking-tight">
                {item.word}
              </h3>

              <p className="text-xs text-slate-700 leading-relaxed mb-4">
                {item.definition}
              </p>

              <div className="bg-[#FAF9F6] p-3 rounded-xl border border-slate-100 text-xs italic text-slate-600 mb-4 leading-relaxed">
                "{item.example}"
              </div>

              {item.collocations && (
                <div className="flex flex-wrap gap-1.5 mb-2">
                  {item.collocations.map((col, idx) => (
                    <span
                      key={idx}
                      className="text-[10px] font-medium bg-slate-100 text-slate-600 px-2 py-0.5 rounded"
                    >
                      {col}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 font-medium">
              <span>Academic Word List</span>
              <span className="text-[#084F7D] font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" /> Ready for test
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
