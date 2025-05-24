import { test, expect } from '@playwright/test';
import RestHelper from '../helpers/rest-helper';
import { faker } from '@faker-js/faker';
let restHelper: RestHelper;
let brandId: string;

test.beforeEach(async ({ request }) => {
  restHelper = new RestHelper(request);
});

test.describe('Test Brands API', () => {
  test('should return all brands', async () => {
    const response = await restHelper.get('/brands');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody).toContainEqual(expect.objectContaining({
      "name": "MightyCraft Hardware",
      "slug": "mightycraft-hardware"
    }));

    brandId = responseBody[0].id.toString();
  });

  test('should add one brand', async () => {
    const brand = {
      "name": faker.company.name(),
      "slug": faker.helpers.slugify(faker.company.name()).toLowerCase()
    };
    const response = await restHelper.post('/brands', brand);
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(201);

    const responseBody = await response.json();

    expect(responseBody).toEqual(expect.objectContaining(brand));
  });
});