import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getAllCountries,
  searchCountriesByName,
  getCountriesByRegion,
  getCountryByCode
} from '../api/countriesAPI';

vi.mock('axios');
import axios from 'axios';

describe('Countries API', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('getAllCountries fetches data correctly', async () => {
    const mockCountries = [
      { name: { common: 'Japan' } },
      { name: { common: 'Brazil' } }
    ];

    axios.get.mockResolvedValueOnce({ data: mockCountries });

    const result = await getAllCountries();
    expect(result).toEqual(mockCountries);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/all?fields=')
    );
  });

  it('searchCountriesByName fetches specific country data', async () => {
    const mockCountry = [{ name: { common: 'Japan' } }];
    axios.get.mockResolvedValueOnce({ data: mockCountry });

    const result = await searchCountriesByName('Japan');
    expect(result).toEqual(mockCountry);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/name/Japan')
    );
  });

  it('getCountriesByRegion fetches countries from a specific region', async () => {
    const mockRegionCountries = [{ name: { common: 'Germany' } }];
    axios.get.mockResolvedValueOnce({ data: mockRegionCountries });

    const result = await getCountriesByRegion('Europe');
    expect(result).toEqual(mockRegionCountries);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/region/Europe')
    );
  });

  it('getCountryByCode fetches country by code', async () => {
    const mockCountry = [{ name: { common: 'France' } }];
    axios.get.mockResolvedValueOnce({ data: mockCountry });

    const result = await getCountryByCode('FR');
    expect(result).toEqual(mockCountry[0]);
    expect(axios.get).toHaveBeenCalledWith(
      expect.stringContaining('/alpha/FR')
    );
  });

  it('handles API error correctly for getAllCountries', async () => {
    axios.get.mockRejectedValueOnce(new Error('Network Error'));

    await expect(getAllCountries()).rejects.toThrow('Failed to fetch countries');
  });

  it('handles API error correctly for searchCountriesByName', async () => {
    axios.get.mockRejectedValueOnce(new Error('404 Not Found'));

    await expect(searchCountriesByName('Atlantis')).rejects.toThrow('Failed to fetch country by name');
  });

  it('handles API error correctly for getCountryByCode when no data returned', async () => {
    axios.get.mockResolvedValueOnce({ data: [] });

    await expect(getCountryByCode('XX')).rejects.toThrow('Failed to fetch country by code');
  });
});
