import { test, expect } from '@playwright/test';

/**
 * API tests against the public reqres.in fake REST API.
 *
 * These tests use Playwright's built-in `request` fixture instead of the
 * `page` fixture, so no browser is launched for this spec.
 *
 * Note on authentication: as of this writing reqres.in's public /api/users
 * endpoints work without any API key (verified manually with curl and with
 * the checks below). reqres.in's docs mention that signing up for a free
 * account issues a personal `x-api-key`, which unlocks a "real" persisted
 * variant of the response (`_meta.variant: v1_a` instead of `v1_b`) and a
 * higher rate limit. We send a placeholder free-tier key on every request
 * here so the suite keeps working if the anonymous tier is ever locked
 * down, without being required for the tests to pass today.
 */
// Trailing slash matters: Playwright resolves relative request paths against
// baseURL using WHATWG URL rules, so a leading "/" on the path would discard
// the "/api" segment of the base URL (e.g. "/users" + "https://reqres.in/api"
// resolves to "https://reqres.in/users", not ".../api/users"). Keeping a
// trailing slash on the base URL and no leading slash on request paths below
// avoids that trap.
const API_BASE_URL = 'https://reqres.in/api/';
const API_KEY = 'reqres-free-v1';

test.describe('reqres.in Users API', () => {
  test.use({ baseURL: API_BASE_URL });

  const extraHTTPHeaders = { 'x-api-key': API_KEY };

  test('GET /users returns a paginated list of users', async ({ request }) => {
    const response = await request.get('users?page=2', { headers: extraHTTPHeaders });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.page).toBe(2);
    expect(Array.isArray(body.data)).toBe(true);
    expect(body.data.length).toBeGreaterThan(0);

    const firstUser = body.data[0];
    expect(firstUser).toHaveProperty('id');
    expect(firstUser).toHaveProperty('email');
    expect(firstUser).toHaveProperty('first_name');
    expect(firstUser).toHaveProperty('last_name');
  });

  test('GET /users/{id} returns a single user', async ({ request }) => {
    const response = await request.get('users/2', { headers: extraHTTPHeaders });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.data.id).toBe(2);
    expect(body.data).toHaveProperty('email');
    expect(body.data).toHaveProperty('first_name');
    expect(body.data).toHaveProperty('last_name');
    expect(body.data).toHaveProperty('avatar');
  });

  test('GET /users/{id} returns 404 for a non-existent user', async ({ request }) => {
    const response = await request.get('users/23', { headers: extraHTTPHeaders });

    expect(response.status()).toBe(404);
  });

  test('POST /users creates a new user', async ({ request }) => {
    const payload = { name: 'morpheus', job: 'leader' };
    const response = await request.post('users', {
      headers: extraHTTPHeaders,
      data: payload,
    });

    expect(response.status()).toBe(201);
    const body = await response.json();

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body).toHaveProperty('id');
    expect(body).toHaveProperty('createdAt');
  });

  test('PUT /users/{id} updates an existing user', async ({ request }) => {
    const payload = { name: 'morpheus', job: 'zion resident' };
    const response = await request.put('users/2', {
      headers: extraHTTPHeaders,
      data: payload,
    });

    expect(response.status()).toBe(200);
    const body = await response.json();

    expect(body.name).toBe(payload.name);
    expect(body.job).toBe(payload.job);
    expect(body).toHaveProperty('updatedAt');
  });

  test('DELETE /users/{id} removes a user and returns 204', async ({ request }) => {
    const response = await request.delete('users/2', { headers: extraHTTPHeaders });

    expect(response.status()).toBe(204);
    const body = await response.body();
    expect(body.length).toBe(0);
  });
});
