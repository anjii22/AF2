import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import SearchBar from '../components/SearchBar'

describe('SearchBar Component', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.runAllTimers();
    vi.useRealTimers();
  });

  it('renders search input and submit button', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByPlaceholderText(/search for a country\.\.\./i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'text');
    
    const button = screen.getByRole('button');
    expect(button).toBeInTheDocument();
    expect(button).toHaveAttribute('type', 'submit');
  });

  it('updates input value when typing', () => {
    render(<SearchBar onSearch={() => {}} />);
    
    const input = screen.getByPlaceholderText(/search for a country\.\.\./i);
    fireEvent.change(input, { target: { value: 'japan' } });
    
    expect(input).toHaveValue('japan');
  });

  it('calls onSearch with input value when form is submitted', () => {
    const mockOnSearch = vi.fn();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/search for a country\.\.\./i);
    fireEvent.change(input, { target: { value: 'japan' } });
    
    const form = input.closest('form');
    fireEvent.submit(form);
    
    expect(mockOnSearch).toHaveBeenCalledWith('japan');
  });

  // it('shows loading state and disables button when searching', () => {
  //   const mockOnSearch = vi.fn();
  //   render(<SearchBar onSearch={mockOnSearch} />);
    
  //   const form = screen.getByRole('button').closest('form');
  //   fireEvent.submit(form);
    
  //   const button = screen.getByRole('button');
  //   expect(button).toBeDisabled();
  //   expect(button.querySelector('.animate-spin')).toBeInTheDocument();

  //   // After timeout, button should be enabled again
  //   vi.advanceTimersByTime(1000);
  //   expect(button).not.toBeDisabled();
  // });
})
