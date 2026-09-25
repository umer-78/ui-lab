import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';
import App from '../App';

describe('UI Lab', () => {
  it('shows all six patterns', () => {
    render(<App />);
    expect(screen.getAllByRole('heading', { level: 2 })).toHaveLength(6);
  });

  it('moves between tabs with the arrow keys, focus and all', async () => {
    const user = userEvent.setup();
    render(<App />);
    const first = screen.getByRole('tab', { name: 'Layout' });
    first.focus();
    await user.keyboard('{ArrowRight}');
    const second = screen.getByRole('tab', { name: 'Springs' });
    expect(second).toHaveAttribute('aria-selected', 'true');
    expect(second).toHaveFocus();
    expect(await screen.findByText(/stiffness and damping/)).toBeInTheDocument();
    await user.keyboard('{End}');
    expect(screen.getByRole('tab', { name: 'Presence' })).toHaveAttribute('aria-selected', 'true');
  });

  it('adds an item and removes it again', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.type(screen.getByLabelText('New item'), 'Ship it{Enter}');
    const list = screen.getByRole('list', { name: 'Items' });
    expect(within(list).getByText('Ship it')).toBeInTheDocument();
    await user.click(screen.getByRole('button', { name: 'Remove Ship it' }));
    await waitFor(() => expect(within(list).queryByText('Ship it')).not.toBeInTheDocument());
  });

  it('tells screen readers the settled number, not every frame', async () => {
    const user = userEvent.setup();
    render(<App />);
    await user.click(screen.getByRole('button', { name: '+1,000' }));
    expect(screen.getByText('13,480', { selector: '[aria-live]' })).toBeInTheDocument();
  });

  it('opens and closes a row, keeping aria-expanded in step', async () => {
    const user = userEvent.setup();
    render(<App />);
    const row = screen.getByRole('button', { name: /Why does the list below shift/ });
    expect(row).toHaveAttribute('aria-expanded', 'false');
    await user.click(row);
    expect(row).toHaveAttribute('aria-expanded', 'true');
    expect(await screen.findByText(/animate to their new positions/)).toBeInTheDocument();
    await user.click(row);
    expect(row).toHaveAttribute('aria-expanded', 'false');
  });

  it('gives the draggable card a keyboard route', () => {
    render(<App />);
    const card = screen.getByRole('button', { name: /Spring card/ });
    expect(card).toHaveAttribute('tabindex', '0');
    expect(card.getAttribute('aria-label')).toMatch(/arrow keys/);
  });
});
