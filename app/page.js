'use client';

import { useState, useEffect, useMemo } from 'react';

export default function Home() {
  const [spots, setSpots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('All');
  const [selectedArea, setSelectedArea] = useState('All');

  const typeOptions = [
    'All', '🍽️ Food', '☕ Cafe', '🛍️ Shopping', '💆 Spa', 
    '🏛️ Attractions', '🎭 Entertainment', '🎯 Activities', '📦 Other'
  ];

  useEffect(() => {
    fetchSpots();
  }, []);

  const fetchSpots = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/spots');
      
      if (!response.ok) {
        throw new Error('Failed to fetch spots');
      }
      
      const data = await response.json();
      setSpots(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Get unique areas from data
  const areaOptions = useMemo(() => {
    const areas = [...new Set(spots.map(spot => spot.area).filter(area => area.trim() !== ''))];
    return ['All', ...areas.sort()];
  }, [spots]);

  // Filter spots based on search term, type, and area
  const filteredSpots = useMemo(() => {
    return spots.filter(spot => {
      const matchesSearch = spot.name.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesType = selectedType === 'All' || 
        spot.type.toLowerCase().includes(selectedType.replace('🍽️ ', '').replace('☕ ', '').replace('🛍️ ', '').replace('💆 ', '').replace('🏛️ ', '').replace('🎭 ', '').replace('🎯 ', '').replace('📦 ', '').toLowerCase());
      
      const matchesArea = selectedArea === 'All' || spot.area === selectedArea;
      
      return matchesSearch && matchesType && matchesArea;
    });
  }, [spots, searchTerm, selectedType, selectedArea]);

  // Normalize type for display
  const getTypeForDisplay = (type) => {
    const typeMap = {
      'food': '🍽️ Food',
      'cafe': '☕ Cafe',
      'shopping': '🛍️ Shopping',
      'spa': '💆 Spa',
      'attractions': '🏛️ Attractions',
      'entertainment': '🎭 Entertainment',
      'activities': '🎯 Activities',
      'other': '📦 Other'
    };
    
    const normalizedType = type.toLowerCase();
    for (const [key, value] of Object.entries(typeMap)) {
      if (normalizedType.includes(key)) {
        return value;
      }
    }
    return type || '📦 Other';
  };

  const handleImageError = (e) => {
    e.target.style.display = 'none';
    e.target.nextSibling.style.display = 'flex';
  };

  const handleImageLoad = (e) => {
    e.target.style.display = 'block';
    e.target.nextSibling.style.display = 'none';
  };

  if (loading) {
    return (
      <div className="app">
        <div className="container">
          <div className="loading">Loading spots...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="app">
        <div className="container">
          <div className="error">Error loading travel spots: {error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="container">
        <header className="header">
          <h1>🇰🇷 Seoul Travel Spots</h1>
          <p>1st - 6th May 2026</p>
        </header>

        <div className="search-container">
          <input
            type="text"
            className="search-input"
            placeholder="Search spots..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-section">
          <span className="filter-label">TYPE</span>
          <div className="filter-chips">
            {typeOptions.map((type) => (
              <button
                key={type}
                className={`filter-chip ${selectedType === type ? 'active' : ''}`}
                onClick={() => setSelectedType(type)}
              >
                {type}
              </button>
            ))}
          </div>
        </div>

        <div className="filter-section">
          <span className="filter-label">AREA</span>
          <div className="filter-chips">
            {areaOptions.map((area) => (
              <button
                key={area}
                className={`filter-chip ${selectedArea === area ? 'active' : ''}`}
                onClick={() => setSelectedArea(area)}
              >
                {area}
              </button>
            ))}
          </div>
        </div>

        <div className="spot-count">
          {filteredSpots.length} spot{filteredSpots.length !== 1 ? 's' : ''}
        </div>

        <div className="spots-list">
          {filteredSpots.map((spot, index) => (
            <div key={index} className="spot-card">
              <img
                src={spot.photoUrl}
                alt={spot.name}
                className="spot-image"
                onError={handleImageError}
                onLoad={handleImageLoad}
              />
              <div className="spot-image-placeholder" style={{display: 'none'}}>
                📷 Image not available
              </div>
              
              <div className="spot-body">
                <div className="spot-header">
                  <div className="spot-name">{spot.name}</div>
                  <div className="spot-type-badge">{getTypeForDisplay(spot.type)}</div>
                </div>
                
                {spot.area && (
                  <div className="spot-detail area">
                    📍 {spot.area}
                  </div>
                )}
                
                {spot.description && (
                  <div className="spot-detail description">
                    {spot.description}
                  </div>
                )}
                
                {spot.openingHours && (
                  <div className="spot-detail hours">
                    🕐 {spot.openingHours}
                  </div>
                )}
                
                {spot.rating && (
                  <div className="spot-detail rating">
                    ⭐ {spot.rating}
                  </div>
                )}
                
                {spot.cost && spot.cost.trim() !== '' && (
                  <div className="spot-detail cost">
                    💰 {spot.cost}
                  </div>
                )}
                
                {(spot.reservationLink && spot.reservationLink.trim() !== '' && spot.reservationLink.toLowerCase() !== 'no reservations') ||
                 (spot.menuLink && spot.menuLink.trim() !== '') ||
                 (spot.naverMapLink && spot.naverMapLink.trim() !== '') ? (
                  <div className="spot-actions">
                    {spot.reservationLink && spot.reservationLink.trim() !== '' && spot.reservationLink.toLowerCase() !== 'no reservations' && (
                      <a
                        href={spot.reservationLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button primary"
                      >
                        📋 Reserve
                      </a>
                    )}
                    
                    {spot.menuLink && spot.menuLink.trim() !== '' && (
                      <a
                        href={spot.menuLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button outline"
                      >
                        📖 Menu
                      </a>
                    )}
                    
                    {spot.naverMapLink && spot.naverMapLink.trim() !== '' && (
                      <a
                        href={spot.naverMapLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="action-button outline"
                      >
                        📍 Map
                      </a>
                    )}
                  </div>
                ) : null}
              </div>
            </div>
          ))}
        </div>
        
        {filteredSpots.length === 0 && !loading && (
          <div className="error">
            No spots found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}