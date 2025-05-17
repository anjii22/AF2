import { render, screen, fireEvent } from '@testing-library/react'
import { describe, it, expect, vi } from 'vitest'
import RegionFilter from '../components/RegionFilter'

describe('RegionFilter Component', () => {
  it('renders region filter dropdown button', () => {
    render(<RegionFilter onRegionChange={() => {}} />);
    expect(screen.getByRole('button')).toHaveTextContent('Filter by Region');
  });

  it('shows dropdown options when clicked', () => {
    render(<RegionFilter onRegionChange={() => {}} />);
    
    // Click the dropdown button
    fireEvent.click(screen.getByRole('button'));
    
    // Verify all region options are shown
    expect(screen.getByText('All Regions')).toBeInTheDocument();
    expect(screen.getByText('Africa')).toBeInTheDocument();
    expect(screen.getByText('Americas')).toBeInTheDocument();
    expect(screen.getByText('Asia')).toBeInTheDocument();
    expect(screen.getByText('Europe')).toBeInTheDocument();
    expect(screen.getByText('Oceania')).toBeInTheDocument();
  });

  it('calls onRegionChange when region is selected', () => {
    const mockOnRegionChange = vi.fn();
    render(<RegionFilter onRegionChange={mockOnRegionChange} />);
    
    // Open dropdown
    fireEvent.click(screen.getByRole('button'));
    
    // Click on a region
    fireEvent.click(screen.getByText('Europe'));
    
    expect(mockOnRegionChange).toHaveBeenCalledWith('europe');
  });

  it('shows selected region in button text', () => {
    render(<RegionFilter onRegionChange={() => {}} selectedRegion="asia" />);
    expect(screen.getByRole('button')).toHaveTextContent('Asia');
  });

  it('closes dropdown when clicking outside', () => {
    render(<RegionFilter onRegionChange={() => {}} />);
    
    // Open dropdown
    fireEvent.click(screen.getByRole('button'));
    expect(screen.getByText('All Regions')).toBeInTheDocument();
    
    // Click outside
    fireEvent.mouseDown(document.body);
    
    // Verify options are not visible
    expect(screen.queryByText('All Regions')).not.toBeInTheDocument();
  });
})
