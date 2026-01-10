import { HashRouter, Routes, Route } from 'react-router-dom';
import { AppLayout } from './components/AppLayout';
import { FavoritesProvider } from './lib/FavoritesContext';

// Pages
import { Home } from './pages/Home';
import { Domains } from './pages/Domains';
import { DomainDetail } from './pages/DomainDetail';
import { EntityDetail } from './pages/EntityDetail';
import { Dictionary } from './pages/Dictionary';
import { DictionaryLetter } from './pages/DictionaryLetter';
import { DictionaryWord } from './pages/DictionaryWord';
import { DictionaryFavorites } from './pages/DictionaryFavorites';
import { Search } from './pages/Search';
import { Architecture } from './pages/Architecture';
import { Docs } from './pages/Docs';
import { About } from './pages/About';
import { NotFound } from './pages/NotFound';

// Styles
import './index.css';

import { WorkspaceProvider } from './lib/WorkspaceContext';

function App() {
  return (
    <FavoritesProvider>
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
              <Route path="dictionary/:letter" element={<DictionaryLetter />} />
              <Route path="dictionary/:letter/:word" element={<DictionaryWord />} />

              {/* Other Pages */}
              <Route path="search" element={<Search />} />
              <Route path="architecture" element={<Architecture />} />
              <Route path="docs" element={<Docs />} />
              <Route path="about" element={<About />} />

              {/* 404 */}
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </HashRouter>
      </WorkspaceProvider>
    </FavoritesProvider>
  );
}

export default App;

