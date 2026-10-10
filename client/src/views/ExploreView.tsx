import React, { useState } from 'react';
import { Compass, BookOpen, Clock, ArrowRight, ExternalLink, CheckCircle2, Bookmark, Globe } from 'lucide-react';

interface ArticleSource {
  id: string;
  source: string;
  title: string;
  category: string;
  readTime: string;
  teaser: string;
  content: string[];
  keyVocab: string[];
}

const SOURCES: ArticleSource[] = [
  {
    id: 'eco-1',
    source: 'The Economist',
    category: 'Economics & Energy',
    readTime: '6 min read',
    title: 'The Great Decarbonisation: How Global Grids Are Reinventing Storage',
    teaser: 'Renewable power is surging worldwide, but the intermittency of solar and wind forces electrical grids to pioneer new long-duration storage technologies.',
    content: [
      'Over the past decade, the capital cost of deploying photovoltaic solar panels and offshore wind turbines has plunged precipitously. Yet, electrical transmission operators face a fundamental paradox: green power generation cannot be dialed up at whim during peak evening demand.',
      'To circumvent this vulnerability, infrastructure consortia are pouring billions into novel energy vectors. Beyond standard lithium-ion batteries, utilities are piloting compressed-air caverns, flow batteries, and green hydrogen electrolysis.',
      'For IELTS candidates studying environmental and economic modules, understanding the trade-offs between capital expenditure and systemic resilience provides robust analytical perspectives for Writing Task 2.'
    ],
    keyVocab: ['intermittency', 'precipitously', 'circumvent', 'consortia', 'resilience']
  },
  {
    id: 'bbc-1',
    source: 'BBC Science',
    category: 'Cognitive Science',
    readTime: '5 min read',
    title: 'Bilingualism and the Plasticity of the Ageing Mind',
    teaser: 'Neurological imaging reveals how speaking multiple languages builds cognitive reserve, delaying the onset of age-related cognitive decline.',
    content: [
      'For decades, educational theorists debated whether childhood bilingualism hindered linguistic proficiency in early developmental milestones. Modern neuroscience has soundly refuted this skepticism.',
      'Continuous mental gymnastics involved in suppressing one linguistic lexicon while activating another strengthens executive function networks in the prefrontal cortex.',
      'This neurological adaptability—termed neuroplasticity—provides profound cognitive buffers, delaying symptoms of dementia by an average of four to five years compared to monolingual cohorts.'
    ],
    keyVocab: ['proficiency', 'refuted', 'suppressing', 'lexicon', 'cohorts']
  },
  {
    id: 'nat-1',
    source: 'National Geographic',
    category: 'Biodiversity',
    readTime: '7 min read',
    title: 'Rewilding the Highlands: Restoring Scotland\'s Ancient Caledonian Forest',
    teaser: 'Pioneering ecological restoration projects are reintroducing keystone predators and native flora to restore degraded ecosystems.',
    content: [
      'The Caledonian pine forest once blanketed much of the Scottish Highlands, serving as a haven for red squirrels, capercaillies, and apex carnivores. Centuries of extensive timber extraction and sheep grazing reduced this ancient canopy to fragmented remnants.',
      'In recent years, conservation biologists have spearheaded ambitious "rewilding" initiatives. By allowing natural succession to take root and managing deer populations, saplings are regenerating without human intervention.',
      'Such landscape-scale ecological endeavors underscore the delicate equilibrium required when harmonizing rural human livelihoods with biodiversity preservation.'
    ],
    keyVocab: ['keystone', 'fragmented', 'spearheaded', 'succession', 'equilibrium']
  }
];

export const ExploreView: React.FC<{ onSourceExplored?: () => void }> = ({ onSourceExplored }) => {
  const [selectedArticle, setSelectedArticle] = useState<ArticleSource | null>(null);

  const handleMarkAsExplored = (art: ArticleSource) => {
    localStorage.setItem('ielts_has_explored_source', 'true');
    if (onSourceExplored) onSourceExplored();
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#E7E3D9] mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[11px] font-semibold uppercase tracking-wider text-[#084F7D] bg-[#EBF4F9] px-2.5 py-0.5 rounded-full">
              Authentic Sources
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
            Explore Real English Sources
          </h1>
          <p className="text-sm text-slate-600 mt-1">
            Read authentic articles from the world's most reputable academic publications—the exact materials IELTS examiners draw from for Reading passages.
          </p>
        </div>
      </div>

      {/* Reader Modal if article selected */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-8 shadow-2xl border border-[#E7E3D9] max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4 pb-3 border-b border-slate-100">
              <span className="text-xs font-semibold uppercase tracking-wider text-[#084F7D] bg-[#EBF4F9] px-3 py-1 rounded-full">
                {selectedArticle.source} • {selectedArticle.category}
              </span>
              <button
                onClick={() => setSelectedArticle(null)}
                className="text-slate-400 hover:text-slate-600 text-xs font-semibold"
              >
                Close ✕
              </button>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 mb-3 leading-snug">
              {selectedArticle.title}
            </h2>

            <div className="flex items-center gap-3 text-xs text-slate-400 font-normal mb-6">
              <Clock className="w-3.5 h-3.5" />
              <span>{selectedArticle.readTime}</span>
              <span>•</span>
              <span>Academic Level</span>
            </div>

            <div className="space-y-4 text-slate-700 text-sm leading-relaxed mb-6 font-normal">
              {selectedArticle.content.map((p, idx) => (
                <p key={idx}>{p}</p>
              ))}
            </div>

            {/* Key Vocabulary Chips */}
            <div className="p-4 rounded-2xl bg-[#FAF9F5] border border-[#E7E3D9] mb-6">
              <h4 className="text-xs font-semibold uppercase text-slate-700 tracking-wider mb-2">
                Key Academic Vocabulary in this Passage:
              </h4>
              <div className="flex flex-wrap gap-2">
                {selectedArticle.keyVocab.map((w, idx) => (
                  <span
                    key={idx}
                    className="text-xs font-semibold bg-[#EBF4F9] text-[#084F7D] px-2.5 py-1 rounded-lg"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => {
                  handleMarkAsExplored(selectedArticle);
                  setSelectedArticle(null);
                }}
                className="px-5 py-2.5 bg-[#084F7D] hover:bg-[#063D62] text-white text-xs font-semibold rounded-xl shadow-2xs transition-colors flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4" />
                <span>Finished Reading (Mark Explored)</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Sources Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {SOURCES.map((article) => (
          <div
            key={article.id}
            className="bg-white rounded-2xl border border-[#E7E3D9] p-6 hover:border-[#084F7D]/50 transition-all shadow-2xs flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[11px] font-semibold uppercase tracking-wider text-[#084F7D] bg-[#EBF4F9] px-2.5 py-0.5 rounded-full">
                  {article.source}
                </span>
                <span className="text-xs text-slate-400 font-normal">
                  {article.readTime}
                </span>
              </div>

              <h3 className="text-base sm:text-lg font-semibold text-slate-900 mb-2 leading-snug">
                {article.title}
              </h3>

              <p className="text-xs text-slate-500 line-clamp-3 mb-4 leading-relaxed font-normal">
                {article.teaser}
              </p>

              <div className="flex flex-wrap gap-1.5 mb-4">
                {article.keyVocab.slice(0, 3).map((w, idx) => (
                  <span
                    key={idx}
                    className="text-[10px] font-semibold bg-[#FEF7EE] text-[#FC9F23] px-2 py-0.5 rounded"
                  >
                    {w}
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-100">
              <button
                onClick={() => setSelectedArticle(article)}
                className="w-full py-2.5 px-4 bg-[#084F7D] hover:bg-[#063D62] text-white font-semibold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 shadow-2xs"
              >
                <span>Read Full Article</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
