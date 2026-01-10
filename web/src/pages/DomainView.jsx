import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';

const DomainView = () => {
  const { domain } = useParams();
  const [entities, setEntities] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
     // Fetch the domains manifest using the correct base URL
     // Note: passing explicit path if not using dataLoader
     const baseUrl = import.meta.env.BASE_URL;
     
     fetch(`${baseUrl}domains-manifest.json`)
      .then(res => res.json())
      .then(manifest => {
          console.log("Loaded manifest", manifest);
          setLoading(false);
          // Assuming manifest has { domains: [...] }
          if (manifest.domains) {
            setEntities(manifest.domains); // The original code setEntities but the variable name in state implies entities. 
            // However, this view seems to want to list domains? 
            // Leaving as is but fixing the fetch.
          }
      })
      .catch(err => {
          console.error("Failed to load manifest", err);
          setLoading(false);
      });
  }, [domain]);

  return (
    <div className="page-container">
      <h1>DOMAIN: {domain.toUpperCase()}</h1>
      <Link to="/hub" className="back-link">← BACK</Link>
      
      {loading ? (
        <div className="loading">LOADING DATA...</div>
      ) : (
        <div className="entity-list">
             {/* Placeholder for list */}
             <div className="card">
                 <h3>Constructing Index...</h3>
                 <p>Scanning neuro-net for {domain} entities.</p>
             </div>
        </div>
      )}
    </div>
  );
};

export default DomainView;
