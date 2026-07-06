import React from 'react';
import { render, screen } from '@testing-library/react';
import KpiCard from '../components/KpiCard';

describe('KpiCard Component', () => {
  test('renders titles and value metrics correctly', () => {
    render(
      <KpiCard
        title="Pending Audit Claims"
        value="42"
        subtitle="Last checked 10m ago"
      />
    );

    expect(screen.getByText('Pending Audit Claims')).toBeInTheDocument();
    expect(screen.getByText('42')).toBeInTheDocument();
    expect(screen.getByText('Last checked 10m ago')).toBeInTheDocument();
  });
});
