# GitHub Profile Page - React Assignment

A responsive React application that replicates GitHub's profile page UI with real API integration.

## Assignment Overview

Build a GitHub Profile Page clone that:
- Matches the GitHub profile UI as closely as possible
- Is fully responsive across all device sizes
- Integrates with GitHub's REST API for real data
- Has working navigation tabs (even if some show empty content)

## Live Demo

Run locally with `npm run dev` and visit `http://localhost:5173`

---

## Requirements & Implementation

### 1. Responsive UI Design 

The entire application is responsive:

| Breakpoint | Layout |
|------------|--------|
| > 1012px | Full desktop layout with sidebar |
| 768px - 1012px | Tablet layout with adjusted spacing |
| < 768px | Mobile layout - stacked sections, hamburger menu |
| < 480px | Compact mobile - smaller fonts, year dropdown for contributions |

Key responsive features:
- Contribution graph scrolls horizontally on mobile
- Year selector switches to dropdown on small screens
- Profile card reorganizes for mobile view
- Navigation collapses to hamburger menu

### 2. Mock Data 

Used mock/placeholder data for:
- Pinned repositories (6 repos shown on Overview)
- Contribution activity list (commits, PRs)
- Activity overview radar chart percentages

### 3. API Integration 

#### a) Contribution Graph (Heat Map)
- **API Used**: GitHub Contributions API via `github-contributions-api.jogruber.de`
- **Endpoint**: `https://github-contributions-api.jogruber.de/v4/{username}?y=last`
- Displays the green contribution calendar with actual contribution data
- Shows contribution count and levels (0-4) for color intensity

#### b) User Profile Info
- **API**: GitHub REST API
- **Endpoint**: `https://api.github.com/users/{username}`
- Fetches and displays:
  - Avatar image
  - Display name
  - Username
  - Bio
  - Location
  - Website/blog URL
  - Twitter handle
  - Company
  - Followers/Following count
  - Public repos count

#### c) Additional APIs Used (Bonus)
- **User Organizations**: `https://api.github.com/users/{username}/orgs`
- **User Repositories**: `https://api.github.com/users/{username}/repos`

### 4. Working Tabs 

| Tab | Status |
|-----|--------|
| Overview | Full content - pinned repos, contribution graph, activity |
| Repositories | Empty state (as per requirements) |
| Projects | Empty state |
| Packages | Empty state |
| Stars | Empty state |

All tabs are navigable and display appropriate empty state messages.

### 5. UI Accuracy 

Matched GitHub's design including:
- Header with logo, search, navigation icons
- Copilot button with internal divider
- Tab navigation with counters
- Profile sidebar layout
- Contribution graph styling
- Pinned repositories cards
- Color scheme and typography

### 6. Extra Features (Bonus Points)

- Keyboard shortcut: Press `/` to focus search
- Real repository data from GitHub API
- Organization avatars in sidebar
- Contribution totals by year
- Activity overview radar chart

---

## Tech Stack

- **React 18** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **CSS Modules** - Scoped styling

No external UI component libraries used - all components built from scratch.

---

## Project Structure

```
src/
├── components/
│   ├── common/          # Avatar, Button, Icon, Counter, etc.
│   ├── contributions/   # ContributionGraph, ActivityOverview
│   ├── layout/          # Header, ProfileLayout
│   ├── profile/         # ProfileCard (sidebar)
│   ├── repositories/    # PinnedRepoCard, PinnedRepos
│   └── tabs/            # Tab content components, EmptyTab
├── hooks/               # useGitHubUser, useRepositories, useContributions
├── pages/               # ProfilePage
├── services/            # API service functions
├── styles/              # Global CSS, variables, reset
├── types/               # TypeScript interfaces
├── utils/               # Helper functions (formatters, etc.)
└── constants/           # API endpoints, default values
```

---

## Getting Started

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

---

## Configuration

### Changing the Default User

Edit `src/constants/api.ts`:

```typescript
export const DEFAULT_USERNAME = 'shreeramk'; // change this
```

Or navigate directly to `http://localhost:5173/{any-github-username}`

---

## API Rate Limits

GitHub's public API has rate limits (60 requests/hour for unauthenticated requests). The app implements:
- Response caching to minimize repeated calls
- Error handling for rate limit scenarios

---

## Browser Support

Tested on:
- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Android)

---

## Screenshots

The UI matches the provided GitHub profile page design with:
- Dark theme matching GitHub's color scheme
- Accurate header layout with all navigation elements
- Responsive contribution graph
- Proper spacing and typography

---

## References

- [GitHub REST API Documentation](https://docs.github.com/en/rest/reference)
- [Get a User API](https://docs.github.com/en/rest/reference/users#get-a-user)
- [GitHub Contributions API](https://github.com/grubersjoe/github-contributions-api)
