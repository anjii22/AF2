import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CountryDetail from '../components/CountryDetail';
import { MemoryRouter, useParams, useNavigate } from 'react-router-dom';
import * as countriesAPI from '../api/countriesAPI';

// Mock the router hooks
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useParams: vi.fn(),
    useNavigate: () => mockNavigate,
  };
});

// Mock the API
vi.mock('../api/countriesAPI');

const mockCountry = {
  name: {
    common: 'Japan',
    official: 'Japan',
    nativeName: { jpn: { common: '日本', official: '日本国' } }
  },
  capital: ['Tokyo'],
  region: 'Asia',
  subregion: 'Eastern Asia',
  population: 125836021,
  languages: { jpn: 'Japanese' },
  currencies: { JPY: { name: 'Japanese yen', symbol: '¥' } },
  borders: ['CHN', 'KOR'],
  flags: {
    png: 'https://example.com/japan-flag.png',
    alt: 'Flag of Japan'
  },
  maps: {
    googleMaps: 'https://goo.gl/maps/NGTLSCSrA8bMrvnX9'
  },
  area: 377975,
  timezones: ['UTC+09:00']
};

describe('CountryDetail Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    useParams.mockReturnValue({ code: 'JPN' });
    countriesAPI.getCountryByCode.mockResolvedValue(mockCountry);
  });

  it('renders country info after loading', async () => {
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Japan');
    });

    expect(screen.getByText(/tokyo/i)).toBeInTheDocument();
    expect(screen.getByText(/125,836,021/)).toBeInTheDocument();
    
    const flagImg = screen.getByRole('img');
    expect(flagImg).toHaveAttribute('src', mockCountry.flags.png);
    expect(flagImg).toHaveAttribute('alt', 'Flag of Japan');
  });

  it('handles API errors gracefully', async () => {
    countriesAPI.getCountryByCode.mockRejectedValue(new Error('Failed to fetch'));

    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      expect(screen.getByText('Failed to load country details')).toBeInTheDocument();
    });
  });

  it('handles navigation correctly', async () => {
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      const backButton = screen.getByRole('button', { name: /back/i });
      backButton.click();
      expect(mockNavigate).toHaveBeenCalledWith(-1);
    });
  });

  it('renders border country links', async () => {
    render(
      <MemoryRouter>
        <CountryDetail />
      </MemoryRouter>
    );

    await waitFor(() => {
      const links = screen.getAllByRole('link').filter(link => ['CHN', 'KOR'].includes(link.textContent));
      expect(links).toHaveLength(2);
    });
  });
});
