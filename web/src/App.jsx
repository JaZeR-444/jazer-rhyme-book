import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { UserPreferencesProvider } from './lib/UserPreferencesContext';
import { BrowsingHistoryProvider } from './lib/BrowsingHistoryContext';
import { FilterProvider } from './lib/FilterContext';
import { FavoritesProvider } from './lib/FavoritesContext';
import { EntityLikesProvider } from './lib/EntityLikesContext';

// Pages
import { Home } from './pages/Home';
import { Domains } from './pages/Domains';
import { DomainDetail } from './pages/DomainDetail';
import { EntityDetail } from './pages/EntityDetail';
import { Dictionary } from './pages/Dictionary';
import { DictionaryLetter } from './pages/DictionaryLetter';
import { DictionaryWord } from './pages/DictionaryWord';
import { DictionaryFavorites } from './pages/DictionaryFavorites';
import { WordCompare } from './pages/WordCompare';
import { Search } from './pages/Search';
import { WritingStudio } from './pages/WritingStudio';
import { About } from './pages/About';
import { Settings } from './pages/Settings';
import { NotFound } from './pages/NotFound';

// Styles
import './index.css';

import { WorkspaceProvider } from './lib/WorkspaceContext';

function App() {
  return (
    <UserPreferencesProvider>
      <BrowsingHistoryProvider>
        <FilterProvider>
          <FavoritesProvider>
            <EntityLikesProvider>
              <WorkspaceProvider>
                <HashRouter>
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
                </HashRouter>
              </WorkspaceProvider>
            </EntityLikesProvider>
          </FavoritesProvider>
        </FilterProvider>
      </BrowsingHistoryProvider>
    </UserPreferencesProvider>
  );
}

export default App;

