import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CountryList from '../components/CountryList';
import { MemoryRouter } from 'react-router-dom';

const mockCountries = [
  {
    name: {
      common: 'Japan',
      official: 'Japan'
    },
    capital: ['Tokyo'],
    region: 'Asia',
    population: 125836021,
    flags: {
      png: 'https://example.com/japan-flag.png',
      alt: 'Flag of Japan'
    }
  },
  {
    name: {
      common: 'Brazil',
      official: 'Federative Republic of Brazil'
    },
    capital: ['Brasília'],
    region: 'Americas',
    population: 212559417,
    flags: {
      png: 'https://example.com/brazil-flag.png',
      alt: 'Flag of Brazil'
    }
  }
];

describe('CountryList Component', () => {

  it('renders no countries message when array is empty', () => {
    render(
      <MemoryRouter>
        <CountryList countries={[]} loading={false} />
      </MemoryRouter>
    );
    expect(screen.getByText(/no countries found/i)).toBeInTheDocument();
  });

  it('renders country cards for each country', () => {
    render(
      <MemoryRouter>
        <CountryList countries={mockCountries} loading={false} />
      </MemoryRouter>
    );
    
    expect(screen.getByText('Japan')).toBeInTheDocument();
    expect(screen.getByText('Brazil')).toBeInTheDocument();
    expect(screen.getAllByRole('link')).toHaveLength(2);
  });
});
