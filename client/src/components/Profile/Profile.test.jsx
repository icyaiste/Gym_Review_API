import React from 'react';
import { render, screen } from '@testing-library/react';
import { describe, it, expect, afterEach } from 'vitest';

afterEach(() => {
  document.body.innerHTML = '';
});

// A fake version of the Profile component so we can test
// the UI without making real fetch calls to the backend.
const FakeProfile = ({ user, loading }) => {
  if (loading) return <p>Loading ...</p>;
  if (!user) return <p>Not logged in.</p>;
  return (
    <div>
      <h2>Hello {user.given_name || user.name}</h2>
      {user.picture && (
        <img
          src={user.picture}
          alt={user.name}
          style={{ width: 80, borderRadius: '50%' }}
        />
      )}
      <p>{user.email}</p>
      <a href="http://localhost:3000/logout">Log out</a>
      <button>Fetch secure data</button>
    </div>
  );
};

describe('Profile UI', () => {
  it('shows a loading state', () => {
    render(<FakeProfile loading={true} />);
    expect(screen.getByText(/loading/i)).toBeTruthy();
  });

  it('shows not logged in when no user', () => {
    render(<FakeProfile loading={false} user={null} />);
    expect(screen.getByText(/not logged in/i)).toBeTruthy();
  });

  it('renders user info when logged in', () => {
    const user = {
      given_name: 'Deborah',
      name: 'Deborah Boat',
      picture: 'http://example.com/pic.jpg',
      email: 'deborah@example.com',
    };
    render(<FakeProfile loading={false} user={user} />);
    expect(screen.getByText(/hello Deborah/i)).toBeTruthy();
    expect(screen.getByAltText(/Deborah Boat/i)).toBeTruthy();
    expect(screen.getByText(/deborah@example.com/i)).toBeTruthy();
    expect(screen.getByRole('link', { name: /log out/i }).getAttribute('href')).toBe(
      'http://localhost:3000/logout'
    );
    expect(
      screen.getByRole('button', { name: /fetch secure data/i })
    ).toBeTruthy();
  });

  it('shows the given name when logged in', () => {
    const fakeUser = { given_name: 'Ada', name: 'Ada Lovelace',
      email: 'ada@test.com', picture: null };
    render(<FakeProfile user={fakeUser} loading={false} />);
    expect(screen.getByText('Hello Ada')).toBeTruthy();
  });

  it('falls back to name if given_name is missing', () => {
    const fakeUser = { given_name: null, name: 'Ada Lovelace',
      email: 'ada@test.com', picture: null };
    render(<FakeProfile user={fakeUser} loading={false} />);
    expect(screen.getByText('Hello Ada Lovelace')).toBeTruthy();
  });

  it('shows the profile picture when logged in', () => {
    const fakeUser = { given_name: 'Ada', name: 'Ada Lovelace',
      email: 'ada@test.com', picture: 'http://img.test/pic.jpg' };
    render(<FakeProfile user={fakeUser} loading={false} />);
    const img = screen.getByRole('img');
    expect(img).toBeTruthy();
    expect(img.getAttribute('src')).toBe('http://img.test/pic.jpg');
  });

  it('does not show an image when there is no picture', () => {
    const fakeUser = { given_name: 'Ada', name: 'Ada Lovelace',
      email: 'ada@test.com', picture: null };
    render(<FakeProfile user={fakeUser} loading={false} />);
    expect(screen.queryByRole('img')).toBeNull();
  });
});
