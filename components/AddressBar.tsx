import React, { useState, useEffect, useRef } from 'react';
import { Breadcrumb } from '../types';
import { parseBreadcrumb, breadcrumbToDisplay } from '../utils/urlHelpers';

interface AddressBarProps {
  breadcrumb: Breadcrumb;
  isLoading: boolean;
  loadingMessage: string;
  onNavigate: (type: 'create' | 'edit', prompt: string) => void;
  onBack: () => void;
  onForward: () => void;
  onRefresh: () => void;
  onStop: () => void;
  onHome: () => void;
  canGoBack: boolean;
  canGoForward: boolean;
  isGrounded: boolean;
  onToggleGrounding: () => void;
}

export const AddressBar: React.FC<AddressBarProps> = ({
  breadcrumb,
  isLoading,
  loadingMessage,
  onNavigate,
  onBack,
  onForward,
  onRefresh,
  onStop,
  onHome,
  canGoBack,
  canGoForward,
  isGrounded,
  onToggleGrounding,
}) => {
  const displayText = breadcrumbToDisplay(breadcrumb);
  const [inputVal, setInputVal] = useState(displayText);
  const [isFocused, setIsFocused] = useState(false);
  const [hasEdited, setHasEdited] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  // Sync address text with current breadcrumb
  useEffect(() => {
    if (!isFocused) {
      if (!hasEdited) {
        setInputVal(displayText);
      }
    }
  }, [displayText, isFocused, hasEdited]);

  // Reset edited state on load
  useEffect(() => {
    if (isLoading) {
      setHasEdited(false);
    }
  }, [isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = inputVal.trim();
    if (!trimmed) return;

    const edited = parseBreadcrumb(trimmed);

    if (!edited.page && breadcrumb.page) {
      onNavigate('create', edited.sitename);
    } else if (edited.sitename !== breadcrumb.sitename) {
      onNavigate('create', trimmed);
    } else if (edited.page !== breadcrumb.page) {
      onNavigate('edit', edited.page);
    } else {
      onRefresh();
    }

    setHasEdited(false);
    inputRef.current?.blur();
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputVal(e.target.value);
    setHasEdited(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setInputVal(displayText);
      setHasEdited(false);
      inputRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    if (!hasEdited) {
      setInputVal(displayText.replace(/ › /g, '.'));
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    if (!hasEdited) {
      setInputVal(displayText);
    }
  };

  const displayValue = isLoading && !isFocused && !breadcrumb.page
    ? 'Generating...'
    : isFocused ? inputVal : inputVal.replace(/\./g, ' › ');

  return (
    <div className="address-bar flex items-center justify-between gap-3 px-3 py-2 bg-neutral-900 border-b border-zinc-800 z-10" style={{ height: '48px', flexShrink: 0 }}>
      {/* Navigation actions */}
      <div className="nav-buttons flex items-center gap-1 flex-shrink-0">
        <button
          onClick={onBack}
          disabled={!canGoBack}
          className="nav-btn p-1.5 rounded-lg flex items-center justify-center transition hover:bg-zinc-800 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Go back"
          aria-label="Go back"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">arrow_back</span>
        </button>
        <button
          onClick={onForward}
          disabled={!canGoForward}
          className="nav-btn p-1.5 rounded-lg flex items-center justify-center transition hover:bg-zinc-800 text-zinc-400 disabled:opacity-30 disabled:hover:bg-transparent"
          title="Go forward"
          aria-label="Go forward"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">arrow_forward</span>
        </button>
        <button
          onClick={isLoading ? onStop : onRefresh}
          className="nav-btn p-1.5 rounded-lg flex items-center justify-center transition hover:bg-zinc-800 text-zinc-400"
          title={isLoading ? 'Stop loading' : 'Refresh'}
          aria-label={isLoading ? 'Stop loading' : 'Refresh'}
        >
          <span className="material-symbols-outlined text-[20px] leading-none">
            {isLoading ? 'close' : 'refresh'}
          </span>
        </button>
        <button 
          onClick={onHome} 
          className="nav-btn p-1.5 rounded-lg flex items-center justify-center transition hover:bg-zinc-800 text-zinc-400" 
          title="Home" 
          aria-label="Home"
        >
          <span className="material-symbols-outlined text-[20px] leading-none">home</span>
        </button>
      </div>

      {/* Omnibar url & prompt entry field */}
      <form onSubmit={handleSubmit} className="omnibar-form flex-1 min-w-0" style={{ height: '32px' }}>
        <div className="omnibar-wrapper w-full h-full relative flex items-center rounded-lg bg-zinc-950 border border-zinc-800 transition-all focus-within:border-zinc-700/80 hover:border-zinc-800/80">
          <div className="flex-1 min-w-0 h-full relative">
            {isLoading && !inputVal ? (
              <div className="omnibar-loading absolute inset-0 flex items-center px-3.5 text-xs text-zinc-500 font-mono tracking-wide animate-pulse">
                {loadingMessage}
              </div>
            ) : (
              <input
                ref={inputRef}
                type="text"
                autoComplete="off"
                value={displayValue}
                onChange={handleChange}
                onFocus={handleFocus}
                onBlur={handleBlur}
                onKeyDown={handleKeyDown}
                className="omnibar-input w-full h-full bg-transparent border-none text-xs text-zinc-200 px-3.5 outline-none font-sans"
                placeholder="Type dynamic URL name to create (e.g. FlightDepartures)..."
                aria-label="Address bar — enter a URL or prompt"
              />
            )}
          </div>
        </div>
      </form>

      {/* Core Google Search Grounding toggle button */}
      <button
        onClick={onToggleGrounding}
        className={`nav-btn px-2.5 py-1.5 rounded-lg flex items-center gap-1.5 transition-all text-xs font-medium border ${
          isGrounded 
            ? 'bg-sky-950/40 border-sky-500/20 text-sky-400 hover:bg-sky-950/60' 
            : 'border-zinc-800 text-zinc-400 hover:bg-zinc-805 hover:text-zinc-300'
        }`}
        title={isGrounded ? "Disable Grounding (Use purely AI's knowledge base)" : "Enable Google Grounding (Use live web search)"}
        aria-label="Toggle Google Grounding"
      >
        <span className="material-symbols-outlined text-[16px] leading-none">language</span>
        <span className="hidden sm:inline">Google Search</span>
      </button>
    </div>
  );
};
