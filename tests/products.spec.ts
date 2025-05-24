import { test, expect } from '@playwright/test';
import RestHelper from '../helpers/rest-helper';
import { faker } from '@faker-js/faker';


let restHelper: RestHelper;

test.beforeEach(async ({ request }) => {
  restHelper = new RestHelper(request);
});

test.describe('Test Products API', () => {
  test('should retrieve all products', async () => {
    const response = await restHelper.get('/products');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();
    expect(Array.isArray(responseBody.data)).toBeTruthy();

    expect(responseBody.data).toContainEqual(expect.objectContaining({
      "name": "Combination Pliers",
    }));
  });

  // Commented out tests for filtering by brand and category as those IDs are generating randomly with each hit
//   test('should filter products by brand', async () => {
//     const response = await restHelper.get('/products', { by_brand: '1' });
//     expect(response.ok()).toBeTruthy();
//     const products = await response.json();
//     products.forEach((product: any) => {
//       expect(product.brand_id).toBe(1);
//     });
//   });

//   test('should filter products by category', async () => {
//     const response = await restHelper.get('/products', { by_category: '2' });
//     expect(response.ok()).toBeTruthy();
//     const products = await response.json();
//     products.forEach((product: any) => {
//       expect(product.category_id).toBe(2);
//     });
//   });

  test('should filter products by rental status', async () => {
    const response = await restHelper.get('/products', { is_rental: 'true' });
    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    products.data.forEach((product: any) => {
      expect(product.is_rental).toBe(true);
    });
  });

  test('should filter products between price range', async () => {
    const response = await restHelper.get('/products', { between: '100,500' });
    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    products.data.forEach((product: any) => {
      expect(product.price).toBeGreaterThanOrEqual(100);
      expect(product.price).toBeLessThanOrEqual(500);
    });
  });

  test('should sort products by name', async () => {
    const response = await restHelper.get('/products', { sort: 'name' });
    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    const names = products.data.map((p: any) => p.name);
    const sortedNames = [...names].sort();
    expect(names).toEqual(sortedNames);
  });

  test('should paginate products', async () => {
    const response = await restHelper.get('/products', { page: 2 });
    expect(response.ok()).toBeTruthy();
    const products = await response.json();
    expect(Array.isArray(products.data)).toBeTruthy();
    // Optionally, check if products correspond to page 2
  });

  test('should not add product without mandatory fields', async () => {
    const product = {
        name: faker.commerce.productName(),
        description: faker.commerce.productDescription(),
        price: parseFloat(faker.commerce.price()),
        is_rental: faker.datatype.boolean(),
        sku: faker.string.alphanumeric(10),
        stock: faker.number.int({ min: 1, max: 100 }),
    };
    let error: Error | null = null; 

    try {
        const response = await restHelper.post('/products', product);
        
    } catch (err) {
        error = err as Error;
    }
    expect(error).not.toBeNull();
    expect(error!.message).toContain('422');
    expect(error!.message).toContain('The category id field is required.');
  });
});