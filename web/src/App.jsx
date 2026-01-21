import { lazy, Suspense, useEffect } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteLoading } from './components/ui/LoadingState';
import { PageTransition } from './components/motion/PageTransition';
import { ScanningLines } from './components/motion/ScanningLines';
import { MobileNavigation } from './components/mobile/MobileNavigation';

import { FeedbackProvider } from './components/interactions';
import { UserPreferencesProvider } from './contexts/UserPreferencesContext';
import { SearchHistoryProvider } from './contexts/SearchHistoryContext';
import { BrowsingHistoryProvider } from './contexts/BrowsingHistoryContext';
import { FilterProvider } from './contexts/FilterContext';
import { FavoritesProvider } from './contexts/FavoritesContext';
import { EntityLikesProvider } from './contexts/EntityLikesContext';
import { WorkspaceProvider } from './contexts/WorkspaceContext';
import { ScrollLockProvider } from './contexts/ScrollLockProvider';
import { DragDropProvider } from './contexts/DragDropProvider';

import { initializeSEO } from './lib/seoHelpers';
import performanceMonitor from './lib/performanceMonitor';
import { addSkipLink } from './lib/accessibility';

// Styles
import './index.css';

// Lazy load pages for code splitting
const Home = lazy(() => import('./pages/Home'));
const Domains = lazy(() => import('./pages/Domains'));
const DomainDetail = lazy(() => import('./pages/DomainDetail'));
const EntityDetail = lazy(() => import('./pages/EntityDetail'));
const Dictionary = lazy(() => import('./pages/Dictionary'));
const DictionaryLetter = lazy(() => import('./pages/DictionaryLetter'));
const DictionaryWord = lazy(() => import('./pages/DictionaryWord'));
const DictionaryFavorites = lazy(() => import('./pages/DictionaryFavorites'));
const WordCompare = lazy(() => import('./pages/WordCompare'));
const RhymeGalaxy = lazy(() => import('./pages/RhymeGalaxy'));
const Search = lazy(() => import('./pages/Search'));
const WritingStudio = lazy(() => import('./pages/WritingStudio'));
const About = lazy(() => import('./pages/About'));
const Architecture = lazy(() => import('./pages/Architecture'));
const Docs = lazy(() => import('./pages/Docs'));
const Stats = lazy(() => import('./pages/Stats'));
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

function AppProviders({ children }) {
  return (
    <FeedbackProvider>
      <UserPreferencesProvider>
        <SearchHistoryProvider>
          <BrowsingHistoryProvider>
            <FilterProvider>
              <FavoritesProvider>
                <EntityLikesProvider>
                  <WorkspaceProvider>
                    <ScrollLockProvider>
                      <DragDropProvider>
                        {children}
                      </DragDropProvider>
                    </ScrollLockProvider>
                  </WorkspaceProvider>
                </EntityLikesProvider>
              </FavoritesProvider>
            </FilterProvider>
          </BrowsingHistoryProvider>
        </SearchHistoryProvider>
      </UserPreferencesProvider>
    </FeedbackProvider>
  );
}

function App() {
  useEffect(() => {
    initializeSEO();
    performanceMonitor.mark('app-init');
    addSkipLink();
    document.body.classList.add('has-bottom-nav');
  }, []);

  return (
    <ErrorBoundary level="app">
      <AppProviders>
        <HashRouter>
          {/* Visual effect: ensure this component uses pointer-events:none internally */}
          <ScanningLines intensity="subtle" speed="slow" color="secondary" count={2} />

          <Suspense fallback={<RouteLoading />}>
            <PageTransition type="fade">
              <Routes>
                <Route path="/" element={<AppLayout />}>
                  <Route index element={<Home />} />

                  {/* Domains */}
                  <Route path="domains" element={<Domains />} />
                  <Route path="domains/:domainId" element={<DomainDetail />} />

                  {/* Entities */}
                  <Route path="entities/:domainId/:entityId" element={<EntityDetail />} />

                  {/* Dictionary */}
                  <Route path="dictionary" element={<ErrorBoundary level="page"><Dictionary /></ErrorBoundary>} />
                  <Route path="dictionary/favorites" element={<DictionaryFavorites />} />
                  <Route path="dictionary/compare" element={<WordCompare />} />
                  <Route path="dictionary/galaxy" element={<RhymeGalaxy />} />
                  <Route path="dictionary/:letter" element={<DictionaryLetter />} />
                  <Route path="dictionary/:letter/:word" element={<DictionaryWord />} />

                  {/* Other Pages */}
                  <Route path="search" element={<ErrorBoundary level="page"><Search /></ErrorBoundary>} />
                  <Route path="studio" element={<ErrorBoundary level="page"><WritingStudio /></ErrorBoundary>} />
                  <Route path="about" element={<About />} />
                  <Route path="architecture" element={<Architecture />} />
                  <Route path="docs" element={<Docs />} />
                  <Route path="stats" element={<Stats />} />
                  <Route path="settings" element={<Settings />} />

                  {/* 404 */}
                  <Route path="*" element={<NotFound />} />
                </Route>
              </Routes>
            </PageTransition>
          </Suspense>

          {/* Mobile Bottom Navigation */}
          <MobileNavigation />
        </HashRouter>
      </AppProviders>
    </ErrorBoundary>
  );
}

export default App;
