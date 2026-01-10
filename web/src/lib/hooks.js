/**
 * Custom React Hooks for Data Loading
 */

import { useState, useEffect } from 'react';
import * as dataLoader from './dataLoader';

/**
 * Hook to load domains
 */
export function useDomains() {
  const [domains, setDomains] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dataLoader.loadDomains()
      .then(data => {
        setDomains(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { domains, loading, error };
}

/**
 * Hook to load entities for a domain
 */
export function useDomainEntities(domainId) {
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!domainId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dataLoader.loadDomainEntities(domainId)
      .then(data => {
        setEntities(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [domainId]);

  return { entities, loading, error };
}

/**
 * Hook to load a single entity
 */
export function useEntity(domainId, entityId) {
  const [entity, setEntity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!domainId || !entityId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dataLoader.loadEntity(domainId, entityId)
      .then(data => {
        setEntity(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [domainId, entityId]);

  return { entity, loading, error };
}

/**
 * Hook to load domain indexes
 */
export function useDomainIndexes(domainId) {
  const [indexes, setIndexes] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!domainId) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dataLoader.loadDomainIndexes(domainId)
      .then(data => {
        setIndexes(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [domainId]);

  return { indexes, loading, error };
}

/**
 * Hook to load dictionary letters
 */
export function useDictionaryLetters() {
  const [letters, setLetters] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dataLoader.loadDictionaryLetters()
      .then(data => {
        setLetters(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { letters, loading, error };
}

/**
 * Hook to load all dictionary words (for rhyme finding)
 */
export function useDictionaryIndex() {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dataLoader.loadDictionaryManifest()
      .then(data => {
        setWords(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { words, loading, error };
}

/**
 * Hook to load words for a letter
 */
export function useDictionaryWords(letter) {
  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!letter) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dataLoader.loadDictionaryWords(letter)
      .then(data => {
        setWords(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [letter]);

  return { words, loading, error };
}

/**
 * Hook to load a dictionary word
 */
export function useDictionaryWord(letter, word) {
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!letter || !word) {
      setLoading(false);
      return;
    }

    setLoading(true);
    dataLoader.loadDictionaryWord(letter, word)
      .then(data => {
        setContent(data || '');
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, [letter, word]);

  return { content, loading, error };
}

/**
 * Hook to build search index
 */
export function useSearchIndex() {
  const [searchIndex, setSearchIndex] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    dataLoader.buildSearchIndex()
      .then(data => {
        setSearchIndex(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err);
        setLoading(false);
      });
  }, []);

  return { searchIndex, loading, error };
}
