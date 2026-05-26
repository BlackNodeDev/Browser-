import React, { useRef, useCallback, useState, useEffect } from 'react';
import { AddressBar } from './AddressBar';
import { Breadcrumb, GroundingSource, Tab } from '../types';

interface BrowserShellProps {
  children: React.ReactNode;
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
  groundingSources: GroundingSource[];
  searchEntryPointHtml: string;
  tabs: Tab[];
  activeTabIndex: number;
  onNewTab: () => void;
  onCloseTab: (index: number) => void;
  onSwitchTab: (index: number) => void;
  isGrounded: boolean;
  onToggleGrounding: () => void;
}

export const BrowserShell: React.FC<BrowserShellProps> = ({
  children,
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
  groundingSources,
  searchEntryPointHtml,
  tabs,
  activeTabIndex,
  onNewTab,
  onCloseTab,
  onSwitchTab,
  isGrounded,
  onToggleGrounding,
}) => {
  const shellRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const handleChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleChange);
    return () => document.removeEventListener('fullscreenchange', handleChange);
  }, []);

  const handleFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      shellRef.current?.requestFullscreen?.();
    }
  }, []);

  const getTabTitle = (tab: Tab, index: number) => {
    if (tab.loading) return 'Generating...';
    const bc = tab.breadcrumb;
    return bc.page || bc.sitename || 'New Tab';
  };

  return (
    <div className="browser-shell bg-[#121214] flex flex-col h-full rounded-2xl overflow-hidden shadow-2xl border border-zinc-800" ref={shellRef}>
      
      {/* Tab Bar */}
      <div className="tab-bar flex items-end px-2" style={{ height: '36px', background: '#09090b', flexShrink: 0 }}>
        <div className="tab-list flex items-end flex-1 min-w-0 overflow-x-auto scrollbar-none" role="tablist">
          {tabs.map((tab, index) => (
            <div
              key={tab.id}
              className={`tab flex items-center gap-2 px-3 py-1.5 rounded-t-lg text-xs cursor-pointer flex-shrink-0 border-r border-[#121214]/65 transition-colors max-w-44 min-w-32 ${index === activeTabIndex ? 'active-tab bg-[#1e1e22] text-white' : 'bg-transparent text-zinc-500 hover:bg-[#18181c]/50'}`}
              onClick={() => onSwitchTab(index)}
              role="tab"
              tabIndex={0}
              aria-selected={index === activeTabIndex}
              onKeyDown={e => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSwitchTab(index);
                }
              }}
            >
              {tab.loading && <div className="tab-spinner w-2 h-2 rounded-full border border-zinc-500 border-t-white animate-spin shrink-0" aria-hidden="true" />}
              <span className="tab-title truncate flex-1 font-sans">
                {getTabTitle(tab, index)}
              </span>
              <button
                className="tab-close text-zinc-500 hover:text-red-400 hover:bg-[#1e1e22] rounded p-0.5 leading-none transition-colors ml-1"
                onClick={(e) => {
                  e.stopPropagation();
                  onCloseTab(index);
                }}
                title="Close tab"
                aria-label="Close tab"
              >
                ×
              </button>
            </div>
          ))}
          <button 
            className="tab-new p-1 pb-1.5 text-zinc-500 hover:text-white flex items-center justify-center rounded-lg hover:bg-[#18181c]/50 transition ml-1" 
            style={{ width: '24px', height: '24px', alignSelf: 'center' }}
            onClick={onNewTab} 
            title="Open a new blank tab" 
            aria-label="New Tab"
          >
            <span className="leading-none text-base">+</span>
          </button>
        </div>
        
        {/* Fullscreen control */}
        <button className="tab-bar-btn p-1 flex items-center justify-center text-zinc-500 hover:text-white rounded-lg transition" onClick={handleFullscreen} title={isFullscreen ? 'Exit fullscreen' : 'Fullscreen'} aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}>
          <span className="material-symbols-outlined text-[18px]">{isFullscreen ? 'close_fullscreen' : 'fullscreen'}</span>
        </button>
      </div>

      {/* Address Bar Controls */}
      <AddressBar
        breadcrumb={breadcrumb}
        isLoading={isLoading}
        loadingMessage={loadingMessage}
        onNavigate={onNavigate}
        onBack={onBack}
        onForward={onForward}
        onRefresh={onRefresh}
        onStop={onStop}
        onHome={onHome}
        canGoBack={canGoBack}
        canGoForward={canGoForward}
        isGrounded={isGrounded}
        onToggleGrounding={onToggleGrounding}
      />

      {/* Main Viewport */}
      <div className="browser-viewport flex-1 bg-[#1a1a1c] flex flex-col min-h-0 relative overflow-hidden">
        <div className="flex-1 w-full h-full min-h-0 relative">
          {children}
        </div>

        {/* Clean Grounding reference bar at the bottom */}
        {isGrounded && groundingSources.length > 0 && (
          <div className="grounding-footer bg-[#111113] border-t border-zinc-805/85 px-4 py-2 flex items-center gap-2 overflow-x-auto whitespace-nowrap scrollbar-none flex-shrink-0">
            <span className="material-symbols-outlined text-sky-400 text-[14px]">language</span>
            <span className="text-[10px] font-mono text-zinc-400 uppercase tracking-wider select-none shrink-0mr-2">Sources:</span>
            <div className="flex items-center gap-2">
              {groundingSources.map((src, index) => (
                <a
                  key={index}
                  href={src.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="bg-sky-950/20 hover:bg-sky-950/40 border border-sky-500/10 hover:border-sky-500/20 rounded-md px-2 py-0.5 text-[10px] text-sky-400 transition inline-flex items-center gap-1 shrink-0"
                >
                  <span>{src.title || 'Page source'}</span>
                  <span className="material-symbols-outlined text-[10px]">open_in_new</span>
                </a>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
