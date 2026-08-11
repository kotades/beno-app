'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface GlobalLocation {
  id: string;
  city: string;
  stateOrRegion?: string;
  country: string;
  countryCode: string;
  flagEmoji: string;
  currencyCode: 'USD' | 'EUR' | 'GBP' | 'AED';
  currencySymbol: string;
  exchangeRateToUSD: number; // 1 USD = X Currency
}

export const GLOBAL_DESTINATIONS: GlobalLocation[] = [
  {
    id: 'loc-miami',
    city: 'Miami',
    stateOrRegion: 'Florida',
    country: 'United States',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    exchangeRateToUSD: 1.0
  },
  {
    id: 'loc-newyork',
    city: 'New York',
    stateOrRegion: 'New York',
    country: 'United States',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    exchangeRateToUSD: 1.0
  },
  {
    id: 'loc-losangeles',
    city: 'Los Angeles',
    stateOrRegion: 'California',
    country: 'United States',
    countryCode: 'US',
    flagEmoji: '🇺🇸',
    currencyCode: 'USD',
    currencySymbol: '$',
    exchangeRateToUSD: 1.0
  },
  {
    id: 'loc-paris',
    city: 'Paris',
    stateOrRegion: 'Île-de-France',
    country: 'France',
    countryCode: 'FR',
    flagEmoji: '🇫🇷',
    currencyCode: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92
  },
  {
    id: 'loc-monaco',
    city: 'Monaco & French Riviera',
    stateOrRegion: 'Côte d\'Azur',
    country: 'France / Monaco',
    countryCode: 'FR',
    flagEmoji: '🇫🇷',
    currencyCode: 'EUR',
    currencySymbol: '€',
    exchangeRateToUSD: 0.92
  },
  {
    id: 'loc-london',
    city: 'London',
    stateOrRegion: 'Greater London',
    country: 'United Kingdom',
    countryCode: 'GB',
    flagEmoji: '🇬🇧',
    currencyCode: 'GBP',
    currencySymbol: '£',
    exchangeRateToUSD: 0.78
  }
];

interface LocationContextType {
  activeLocation: GlobalLocation;
  setActiveLocation: (loc: GlobalLocation) => void;
  formatPrice: (usdAmount: number) => string;
}

const LocationContext = createContext<LocationContextType>({
  activeLocation: GLOBAL_DESTINATIONS[0],
  setActiveLocation: () => {},
  formatPrice: (usd) => `$${usd.toLocaleString()}`
});

export function LocationProvider({ children }: { children: React.ReactNode }) {
  const [activeLocation, setActiveLocation] = useState<GlobalLocation>(GLOBAL_DESTINATIONS[0]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedId = localStorage.getItem('beno_global_location_id');
      if (savedId) {
        const found = GLOBAL_DESTINATIONS.find(d => d.id === savedId);
        if (found) setActiveLocation(found);
      }
    }
  }, []);

  const handleSetLocation = (loc: GlobalLocation) => {
    setActiveLocation(loc);
    if (typeof window !== 'undefined') {
      localStorage.setItem('beno_global_location_id', loc.id);
    }
  };

  const formatPrice = (usdAmount: number): string => {
    const converted = Math.round(usdAmount * activeLocation.exchangeRateToUSD);
    if (activeLocation.currencyCode === 'AED') {
      return `AED ${converted.toLocaleString()}`;
    }
    return `${activeLocation.currencySymbol}${converted.toLocaleString()}`;
  };

  return (
    <LocationContext.Provider value={{ activeLocation, setActiveLocation: handleSetLocation, formatPrice }}>
      {children}
    </LocationContext.Provider>
  );
}

export function useLocation() {
  return useContext(LocationContext);
}
