# WRK Headless School API

A WordPress plugin for managing React frontend content from the WordPress admin panel.

## What it does

- Adds a **Headless Content** admin screen for editable site text and structured page data
- Registers **Notices** and **Gallery** post types for repeatable content
- Exposes a custom REST API namespace: `school/v1`
- Returns a single **bootstrap** payload for easy React hydration

## Endpoints

- `/wp-json/school/v1/settings`
- `/wp-json/school/v1/page/home`
- `/wp-json/school/v1/page/about`
- `/wp-json/school/v1/notices`
- `/wp-json/school/v1/gallery`
- `/wp-json/school/v1/bootstrap`

## Recommended React usage

```ts
const API_BASE = 'https://example.com/wp-json/school/v1';

export async function getBootstrap() {
  const response = await fetch(`${API_BASE}/bootstrap`);
  if (!response.ok) throw new Error('Failed to load content');
  return response.json();
}
```

## Architecture notes

- Use `settings` for logo, navigation, contact info, and footer
- Use `pages` payload for static page sections
- Use `notices` and `gallery` endpoints for repeatable cards/lists
- For production, consider adding caching with transients or a reverse proxy
