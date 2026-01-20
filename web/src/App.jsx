import { lazy, Suspense } from 'react';
import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { ErrorBoundary } from './components/ErrorBoundary';
import { RouteLoading } from './components/ui/LoadingState';
import { PageTransition } from './components/motion/PageTransition';
import { ScanningLines } from './components/motion/ScanningLines';
import { FeedbackProvider } from './components/interactions';
import { UserPreferencesProvider } from './lib/UserPreferencesContext';
import { SearchHistoryProvider } from './lib/SearchHistoryContext';
import { BrowsingHistoryProvider } from './lib/BrowsingHistoryContext';
import { FilterProvider } from './lib/FilterContext';
import { FavoritesProvider } from './lib/FavoritesContext';
import { EntityLikesProvider } from './lib/EntityLikesContext';
import { WorkspaceProvider } from './lib/WorkspaceContext';
import { DndContextProvider } from './contexts/DndContext';
import { initializeSEO } from './lib/seoHelpers';
import performanceMonitor from './lib/performanceMonitor';
import { addSkipLink } from './lib/accessibility';
import { useSwipeNavigation } from './hooks/useMobileGestures';

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
const Settings = lazy(() => import('./pages/Settings'));
const NotFound = lazy(() => import('./pages/NotFound'));

// Styles
import './index.css';

// Initialize SEO and performance monitoring
if (typeof window !== 'undefined') {
  initializeSEO();
  performanceMonitor.mark('app-init');
  addSkipLink();
}

function App() {
  // Enable swipe-to-go-back on mobile
  useSwipeNavigation();
  return (
    <ErrorBoundary level="app">
      <FeedbackProvider>
        <UserPreferencesProvider>
          <SearchHistoryProvider>
            <BrowsingHistoryProvider>
              <FilterProvider>
                <FavoritesProvider>
                  <EntityLikesProvider>
                    <WorkspaceProvider>
                      <DndContextProvider>
                        <HashRouter>
                        {/* Cyber Scanning Lines Effect */}
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
                              <Route path="dictionary" element={<Dictionary />} />
                              <Route path="dictionary/favorites" element={<DictionaryFavorites />} />
                              <Route path="dictionary/compare" element={<WordCompare />} />
                              <Route path="dictionary/galaxy" element={<RhymeGalaxy />} />
                              <Route path="dictionary/:letter" element={<DictionaryLetter />} />
                              <Route path="dictionary/:letter/:word" element={<DictionaryWord />} />

                              {/* Other Pages */}
                              <Route path="search" element={<Search />} />
                              <Route path="studio" element={<WritingStudio />} />
                              <Route path="about" element={<About />} />
                              <Route path="settings" element={<Settings />} />

                              {/* 404 */}
                              <Route path="*" element={<NotFound />} />
                            </Route>
                          </Routes>
                        </PageTransition>
                      </Suspense>
                        </HashRouter>
                      </DndContextProvider>
                    </WorkspaceProvider>
                  </EntityLikesProvider>
              </FavoritesProvider>
            </FilterProvider>
          </BrowsingHistoryProvider>
        </SearchHistoryProvider>
      </UserPreferencesProvider>
    </FeedbackProvider>
    </ErrorBoundary>
  );
}

export default App;

