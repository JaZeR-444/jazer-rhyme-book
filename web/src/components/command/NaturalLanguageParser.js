/**
 * Natural Language Parser for Command Palette
 * Parses user input to detect commands and intents
 */

export class NaturalLanguageParser {
  constructor() {
    // Command patterns with their handlers
    this.patterns = [
      // Find/Search patterns
      {
        regex: /^(?:find|search|lookup|show)\s+(?:rhymes?\s+(?:for|of)\s+)?(.+)$/i,
        intent: 'search',
        extract: (match) => ({ query: match[1].trim(), type: 'rhyme' })
      },
      {
        regex: /^(?:find|search)\s+(?:words?\s+)?(?:that\s+)?rhyme\s+with\s+(.+)$/i,
        intent: 'search_rhyme',
        extract: (match) => ({ query: match[1].trim() })
      },
      {
        regex: /^(?:find|search|show)\s+entities?\s+(?:in\s+)?(.+)$/i,
        intent: 'search_entity',
        extract: (match) => ({ domain: match[1].trim() })
      },
      {
        regex: /^(?:find|search|show)\s+domain\s+(.+)$/i,
        intent: 'search_domain',
        extract: (match) => ({ domain: match[1].trim() })
      },
      
      // Navigation patterns
      {
        regex: /^(?:go\s+to|open|navigate\s+to)\s+(.+)$/i,
        intent: 'navigate',
        extract: (match) => ({ destination: match[1].trim() })
      },
      {
        regex: /^(?:show|display|view)\s+(.+)$/i,
        intent: 'navigate',
        extract: (match) => ({ destination: match[1].trim() })
      },
      
      // Action patterns
      {
        regex: /^(?:add|pin)\s+(?:to\s+)?(?:workspace|board)\s+(.+)$/i,
        intent: 'add_to_workspace',
        extract: (match) => ({ item: match[1].trim() })
      },
      {
        regex: /^(?:clear|reset|empty)\s+(?:workspace|board)$/i,
        intent: 'clear_workspace',
        extract: () => ({})
      },
      {
        regex: /^(?:reload|refresh|restart)$/i,
        intent: 'reload',
        extract: () => ({})
      },
      
      // Definition patterns
      {
        regex: /^(?:what\s+is|define|definition\s+of)\s+(.+)$/i,
        intent: 'define',
        extract: (match) => ({ word: match[1].trim() })
      },
      {
        regex: /^(?:explain|tell\s+me\s+about)\s+(.+)$/i,
        intent: 'explain',
        extract: (match) => ({ topic: match[1].trim() })
      }
    ];
  }

  /**
   * Parse user input and detect intent
   */
  parse(input) {
    if (!input || input.trim().length === 0) {
      return { intent: 'unknown', data: null, original: input };
    }

    const trimmed = input.trim();

    // Try each pattern
    for (const pattern of this.patterns) {
      const match = trimmed.match(pattern.regex);
      if (match) {
        return {
          intent: pattern.intent,
          data: pattern.extract(match),
          original: input,
          matched: true
        };
      }
    }

    // No pattern matched - treat as regular search
    return {
      intent: 'search',
      data: { query: trimmed },
      original: input,
      matched: false
    };
  }

  /**
   * Get suggestions based on partial input
   */
  getSuggestions(input) {
    const suggestions = [];
    
    if (!input || input.length < 2) {
      return [
        'find rhymes for [word]',
        'search entities in [domain]',
        'go to [page]',
        'define [word]',
        'clear workspace'
      ];
    }

    // Context-aware suggestions
    if (input.toLowerCase().startsWith('find')) {
      suggestions.push(
        `${input} rhymes for fire`,
        `${input} entities in music`,
        `${input} domain tech`
      );
    } else if (input.toLowerCase().startsWith('go')) {
      suggestions.push(
        `${input} to domains`,
        `${input} to dictionary`,
        `${input} to workspace`
      );
    } else if (input.toLowerCase().startsWith('what')) {
      suggestions.push(
        `${input} is [word]`,
        `${input} are entities`
      );
    }

    return suggestions;
  }

  /**
   * Convert intent to action
   */
  intentToAction(parsedIntent, navigate, onAction) {
    switch (parsedIntent.intent) {
      case 'search_rhyme':
      case 'search':
        return {
          type: 'search',
          query: parsedIntent.data.query,
          execute: () => navigate(`/search?q=${encodeURIComponent(parsedIntent.data.query)}`)
        };

      case 'search_entity':
        return {
          type: 'navigate',
          path: `/domains/${parsedIntent.data.domain}`,
          execute: () => navigate(`/domains/${parsedIntent.data.domain}`)
        };

      case 'search_domain':
        return {
          type: 'navigate',
          path: `/domains`,
          execute: () => navigate('/domains')
        };

      case 'navigate':
        const dest = parsedIntent.data.destination.toLowerCase();
        const routes = {
          'home': '/',
          'domains': '/domains',
          'dictionary': '/dictionary',
          'workspace': '/workspace',
          'studio': '/studio',
          'about': '/about',
          'settings': '/settings'
        };
        const path = routes[dest] || `/${dest}`;
        return {
          type: 'navigate',
          path,
          execute: () => navigate(path)
        };

      case 'define':
      case 'explain':
        const word = parsedIntent.data.word || parsedIntent.data.topic;
        return {
          type: 'search',
          query: word,
          execute: () => navigate(`/search?q=${encodeURIComponent(word)}`)
        };

      case 'clear_workspace':
        return {
          type: 'action',
          name: 'clear_workspace',
          execute: () => onAction?.('clear_workspace')
        };

      case 'reload':
        return {
          type: 'action',
          name: 'reload',
          execute: () => window.location.reload()
        };

      default:
        return null;
    }
  }
}

// Singleton instance
export const nlParser = new NaturalLanguageParser();
