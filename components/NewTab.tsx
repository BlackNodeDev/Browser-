import React, { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';

interface NewTabProps {
  onCreatePage: (prompt: string) => void;
}

const CATEGORIES = ['All', 'Tools', 'Dashboards', 'Guides', 'Games'] as const;

interface Preset {
  id: string;
  category: typeof CATEGORIES[number];
  title: string;
  description: string;
  emoji: string;
  prompt: string;
}

const INSPIRATION_PRESETS: Preset[] = [
  {
    id: 'deep-sea',
    category: 'Guides',
    title: 'Bioluminescent Abyss Field Guide',
    description: 'Explore the midnight zone creature index with glowing depth meters, habitats, and properties.',
    emoji: '🐠',
    prompt: 'A dark, highly immersive field guide for rare bioluminescent deep sea creatures. Features an interactive depth range slider, custom logs of water temperature and salinity, highly styled icons/emojis for deep sea monsters (Anglerfish, Giant Isopod, Vampire Squid), and collapsible description drawers.'
  },
  {
    id: 'airport-board',
    category: 'Dashboards',
    title: 'Retro-Futuristic Flight Hub',
    description: 'A cyberpunk 1980s airport transit screen listing departures, arrivals, gates, and statuses.',
    emoji: '🚀',
    prompt: 'A departure and arrival timetable for Neo Tokyo Cyberpunk Space Hub. Features rows of flight schedules displaying flight numbers, destination gates, real-time board timers, status badges (Delayed, ON TIME, HYPER-DRIVE READY), and vintage terminal glowing line grids.'
  },
  {
    id: 'synth-pad',
    category: 'Games',
    title: 'Neo-Classic Synth Sound-box',
    description: 'A tactile synthesizer board with chord keyboard pads, beat sliders, and interactive sound knobs.',
    emoji: '🕹️',
    prompt: 'A gorgeous retro pixel-art style synthesizer sound-board console. Build active visual touch pads for musical chords (C3, E3, G3, B3) with lighting action states, slide knobs for volume control, pitch sweep knobs, and customizable neon tempo meters.'
  },
  {
    id: 'health-breathe',
    category: 'Tools',
    title: 'Aura Breathe Companion',
    description: 'A calming minimalist wellness panel with visual box breathing cycle timers and warm colors.',
    emoji: '🌿',
    prompt: 'A beautiful wellness and meditation studio web dashboard. Centered around a glowing breathing circle with micro-animations guiding inhalation/exhalation pacing, interactive selectors for relaxation regimes (Box Breathing, Calming 4-7-8, Deep Sleep), and an offline-only session log tracker.'
  },
  {
    id: 'cocktail',
    category: 'Tools',
    title: 'Mixology Cocktail Architect',
    description: 'A recipe builder where you select spirits, mixers, garnishes, and adjust ratios.',
    emoji: '🍹',
    prompt: 'An interactive mixology creator. Allows checking checkboxes to choose spirits (Gin, Vodka, Tequila, Whiskey), toggling mixers (Soda, Tonic, Ginger Beer) and garnishes, rendering responsive recipe glass cards, and showing dynamic mix steps with fun flavor logs.'
  },
  {
    id: 'volcano',
    category: 'Dashboards',
    title: 'Geothermal Volcano Monitor',
    description: 'A tectonic log tracking active tremor charts, magma chambers, and alerts.',
    emoji: '🌋',
    prompt: 'A real-time volcanological monitoring dashboard. Features alert levels (GREEN, ALERT, HAZARD, ERUPTION), styled graphs documenting seismic tremors, active temperature readings, alerts list, and safety tip triggers.'
  },
  {
    id: 'color-palette',
    category: 'Tools',
    title: 'Contrast Palette Architect',
    description: 'Design harmonious palettes, check AAA compliance scores, and export CSS.',
    emoji: '🎨',
    prompt: 'A custom palette creation workspace. Features customizable visual cards with hex inputs, automatic color contrast checking (matching WCAG AA and AAA parameters), a live accessibility text preview widget, and code generation cards with exportable Tailwind and CSS property sheets.'
  },
  {
    id: 'subway',
    category: 'Dashboards',
    title: 'Metropolis Subway Status',
    description: 'A metropolitan underground schedule listing tracks, delay matrices, and ticket counters.',
    emoji: '🚇',
    prompt: 'An underground metro scheduling dashboard. Shows train lines (Red Line Express, Green Local, Blue Loop), active status banners, next-train countdown clocks, arrival rosters, and a custom fare estimation calculator.'
  },
  {
    id: 'vinyl',
    category: 'Guides',
    title: 'Vintage Vinyl Library Record',
    description: 'A collector repository sorting jazz albums, media wear ratings, and release years.',
    emoji: '💿',
    prompt: 'A classic vinyl LP repository workspace. Include collection folder selectors sorted by year (1960-1990), individual sleeve details with album cover representations, media quality grading lists, and artist trivia cards.'
  },
  {
    id: 'constell',
    category: 'Guides',
    title: 'Zodiac Star Cartographer',
    description: 'An astronomical catalog plotting seasonal celestial bodies and observation coordinates.',
    emoji: '🌌',
    prompt: 'An elegant sky exploration and star mapping app. Select celestial constellations to render sky charts logs, mythical origins, astronomical coordinates lookup grids, and weather observation rating boxes.'
  }
];

export const NewTab: React.FC<NewTabProps> = ({ onCreatePage }) => {
  const [prompt, setPrompt] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<typeof CATEGORIES[number]>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (prompt.trim()) {
      onCreatePage(prompt.trim());
    }
  };

  const handleHowItWorks = () => {
    onCreatePage(
      `A beautifully documented page for "Flash-Lite Browser" — a fast, lightweight web browser sandbox powered entirely by Gemini 3.1 Flash-Lite, released in March 2026.` +
      `Explain that every single page in this browser (including this very page!) is generated live on-the-fly and streamed token-by-token directly from the model based on your intent. ` +
      `Highlight how internal actions (submitting forms, button clicks, links) are handled securely via a window.FlashLiteAPI bridge, which captures state variables, appends it as user interaction context, and requests Gemini to render the next page iteration immediately. ` +
      `Style it like a gorgeous, professional developer documentation site with a left-hand navigation menu (Introduction, Quick Start, How It Works, API Spec, Limits), custom code blocks, responsive status banners, and a beautiful CTA section with demo example links.`
    );
  };

  const handleLucky = () => {
    if (prompt.trim().length >= 3) {
      onCreatePage(prompt.trim());
    } else {
      const filtered = INSPIRATION_PRESETS.filter(p => selectedCategory === 'All' || p.category === selectedCategory);
      const list = filtered.length > 0 ? filtered : INSPIRATION_PRESETS;
      const randomPreset = list[Math.floor(Math.random() * list.length)];
      onCreatePage(randomPreset.prompt);
    }
  };

  const filteredPresets = useMemo(() => {
    return INSPIRATION_PRESETS.filter(p => {
      const matchesCategory = selectedCategory === 'All' || p.category === selectedCategory;
      const matchesSearch = p.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                            p.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="newtab-page" style={{ overflowY: 'auto', padding: '40px 16px' }}>
      <div className="max-w-4xl w-full mx-auto flex flex-col items-center gap-8">
        
        {/* Sleek Header Section */}
        <div className="text-center flex flex-col items-center gap-2">
          <motion.div 
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-3 bg-zinc-800/80 border border-zinc-700/50 px-4 py-2 rounded-full mb-3 shadow-[0_4px_12px_rgba(0,0,0,0.4)]"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-mono text-emerald-400 tracking-wide uppercase font-semibold">Gemini 3.1 Flash-Lite Engine Active</span>
          </motion.div>

          <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-white mb-2" style={{ fontFamily: "'Google Sans Flex', 'Google Sans', sans-serif" }}>
            Flash-Lite Browser
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-lg mb-2 leading-relaxed">
            Describe any web app, database catalog, dashboard, or interactive game. Watch Gemini build and stream it live in real-time.
          </p>
        </div>

        {/* Dynamic Interactive Input Row */}
        <form onSubmit={handleSubmit} className="w-full max-w-2xl">
          <div className="relative group shadow-[0_8px_32px_rgba(0,0,0,0.5)] rounded-2xl bg-zinc-900 border border-zinc-700/80 transition-all duration-300 focus-within:border-zinc-500 focus-within:shadow-[0_8px_32px_rgba(0,0,0,0.7)] hover:border-zinc-600">
            <div className="flex items-center">
              <span className="material-symbols-outlined text-zinc-500 pl-4 pr-1 select-none">search</span>
              <input
                type="text"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                className="w-full bg-transparent border-none text-white text-base md:text-lg py-4 px-3 outline-none focus:ring-0 placeholder-zinc-500 font-sans"
                placeholder="Type a website idea or prompt (e.g. A cocktail recipe log)..."
                autoFocus
              />
              <button 
                type="submit" 
                className={`mr-3 p-2 rounded-lg bg-zinc-800 border border-zinc-700/60 text-zinc-400 hover:text-white hover:bg-zinc-700 active:scale-95 transition-all duration-150 ${prompt.trim() ? '!text-emerald-400 !border-emerald-500/20 bg-emerald-950/20' : ''}`}
                aria-label="Generate web page"
              >
                <span className="material-symbols-outlined text-xl block">keyboard_return</span>
              </button>
            </div>
          </div>
        </form>

        {/* Option Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button 
            onClick={handleHowItWorks} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 hover:border-zinc-700 text-sm font-medium text-zinc-300 transition-all duration-150 cursor-pointer shadow-md select-none active:scale-95"
          >
            <span className="material-symbols-outlined text-lg text-indigo-400">help</span>
            How does this work?
          </button>
          <button 
            onClick={handleLucky} 
            className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-zinc-900 to-zinc-900 hover:from-zinc-800 hover:to-zinc-850 border border-zinc-800 hover:border-zinc-700 text-sm font-medium text-emerald-400 transition-all duration-150 cursor-pointer shadow-md select-none active:scale-95"
          >
            <span className="material-symbols-outlined text-lg text-emerald-400">casino</span>
            I'm Feeling Lucky
          </button>
        </div>

        {/* Gallery / Preset Exploration Section */}
        <div className="w-full mt-4 flex flex-col gap-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-zinc-800 pb-4">
            <div className="flex flex-col gap-1">
              <h2 className="text-lg font-medium text-zinc-200">Inspiration Presets</h2>
              <p className="text-xs text-zinc-500">Pick a concept and see how the browser generates interactive layouts</p>
            </div>

            {/* Category selection */}
            <div className="flex flex-wrap gap-1.5 bg-zinc-950/45 p-1 rounded-xl border border-zinc-800/80">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold tracking-wide transition-all duration-150 select-none ${selectedCategory === cat ? 'bg-zinc-800 text-white shadow-sm' : 'text-zinc-500 hover:text-zinc-300'}`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Quick Search */}
          <div className="relative w-full max-w-sm">
            <span className="material-symbols-outlined absolute left-3 top-2.5 text-sm text-zinc-600 select-none">filter_alt</span>
            <input
              type="text"
              placeholder="Search concepts..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950/30 border border-zinc-800/60 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-zinc-600 outline-none focus:border-zinc-700 transition"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2 text-zinc-500 hover:text-zinc-300 text-xs"
              >
                Clear
              </button>
            )}
          </div>

          {/* Preset list grid */}
          <motion.div 
            layout
            className="grid grid-cols-1 md:grid-cols-2 gap-4"
          >
            <AnimatePresence mode="popLayout">
              {filteredPresets.map((preset) => (
                <motion.div
                  key={preset.id}
                  layout
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  onClick={() => onCreatePage(preset.prompt)}
                  className="group relative flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/60 hover:bg-zinc-900/90 border border-zinc-800/70 hover:border-zinc-700/80 transition-all duration-300 cursor-pointer shadow-[0_2px_8px_rgba(0,0,0,0.2)] hover:shadow-[0_8px_24px_rgba(0,0,0,0.4)]"
                >
                  {/* Glowing halo indicator */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-zinc-400/0 via-zinc-400/0 to-zinc-400/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                  <span className="flex items-center justify-center text-3xl bg-zinc-950 border border-zinc-805 px-3 py-2 rounded-xl group-hover:scale-105 group-hover:bg-zinc-900 transition-all duration-300 select-none">
                    {preset.emoji}
                  </span>
                  
                  <div className="flex-1 flex flex-col gap-1 min-w-0 pr-2">
                    <div className="flex items-center justify-between gap-2">
                      <h3 className="font-medium text-sm text-zinc-200 group-hover:text-white transition-colors truncate">
                        {preset.title}
                      </h3>
                      <span className="text-[10px] uppercase tracking-wide font-mono px-2 py-0.5 rounded-full bg-zinc-950 border border-zinc-850/50 text-zinc-500 group-hover:text-zinc-400 select-none">
                        {preset.category}
                      </span>
                    </div>
                    <p className="text-xs text-zinc-500 group-hover:text-zinc-400 line-clamp-2 leading-relaxed transition-colors">
                      {preset.description}
                    </p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Empty State */}
            {filteredPresets.length === 0 && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="col-span-1 md:col-span-2 flex flex-col items-center justify-center p-12 bg-zinc-900/20 border border-dashed border-zinc-800 rounded-3xl text-center"
              >
                <span className="material-symbols-outlined text-4xl text-zinc-650 mb-3 select-none">search_off</span>
                <p className="text-sm font-semibold text-zinc-400 mb-0.5">No presets found</p>
                <p className="text-xs text-zinc-600">Try matching on another category or clearing your filter</p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </div>
    </div>
  );
};
