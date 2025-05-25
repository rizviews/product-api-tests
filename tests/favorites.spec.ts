import { test, expect } from '@playwright/test';
import RestHelper from '../helpers/rest-helper';
let restHelper: RestHelper;

// Use the Playwright test's request context (inherits baseURL from config)
test.beforeEach(async ({ request }) => {
  restHelper = new RestHelper(request);
});

test.describe.serial('Test favorites API', () => {
  let favoriteId: string;

  test('should clear all favorites', async () => {
    // Clear all favorite airports for a clean test state
    const response = await restHelper.delete('/favorites/clear_all');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(204);
  });

  test('should add a favorite', async () => {
    // Add a new favorite airport and verify the response structure
    const response = await restHelper.post('/favorites', {
      airport_id: 'YCB',
      note: 'My favorite airport'
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);
    const responseBody = await response.json();
    expect(responseBody.data).toEqual(expect.objectContaining({
      attributes: expect.objectContaining({
        airport: expect.objectContaining({
          iata: 'YCB',
        }),
        note: 'My favorite airport'
      })
    }));
    favoriteId = responseBody.data.id;
  });

  test('should not add as favorite as airport already exists as favorite', async () => {
    // Attempt to add the same airport as favorite again and expect a 422 error
    let error: any;
    try {
      await restHelper.post('/favorites', {
        airport_id: 'YCB',
        note: 'My favorite airport'
      });
    } catch (err: any) {
      error = err;
    }
    expect(error).toBeDefined();
    expect(error.message).toContain('422');
    expect(error.message).toContain('Unable to process request');
  });

  test('should get all favorites', async () => {
    // Retrieve all favorite airports and verify the response is an array
    const response = await restHelper.get('/favorites');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(Array.isArray(responseBody.data)).toBeTruthy();
  });

  test('should get favorite by id', async () => {
    // Retrieve a favorite airport by its ID and verify the ID matches
    if (!favoriteId) {
      const addRes = await restHelper.post('/favorites', { airport_id: 'GKA', note: 'Temp' });
      const addBody = await addRes.json();
      favoriteId = addBody.data.id;
    }
    const response = await restHelper.get(`/favorites/${favoriteId}`);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data.id).toBe(favoriteId);
  });

  test('should update a favorite', async () => {
    // Update the note for a favorite airport and verify the update
    if (!favoriteId) {
      const addRes = await restHelper.post('/favorites', { id: 'GKA', note: 'Temp' });
      const addBody = await addRes.json();
      favoriteId = addBody.data.id;
    }
    const response = await restHelper.patch(`/favorites/${favoriteId}`, {
      note: 'Updated note'
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data.attributes.note).toBe('Updated note');
  });
});
