import { test, expect } from '@playwright/test';
import RestHelper from '../helpers/rest-helper';
let restHelper: RestHelper;


test.beforeEach(async ({request}) => {
  restHelper = new RestHelper(request);
});

test.describe('Test Airports API', () => {
  test('should return all airports', async () => {
    // Fetch all airports and verify the response contains Goroka Airport with expected details
    const response = await restHelper.get('/airports');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);

    const responseBody = await response.json();

    expect(responseBody.data).toEqual(expect.arrayContaining([
    expect.objectContaining({
        attributes: expect.objectContaining({
            name: "Goroka Airport",
            iata: "GKA",
            city: "Goroka",
            country: "Papua New Guinea"
        }),
        id: "GKA",
        type: "airport"
    })
    ]));
  });

  test('should return one airport by id', async () => {
    // Fetch a single airport by its IATA code and verify the details
    const response = await restHelper.get('/airports/KIX');
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data).toEqual(
        expect.objectContaining({
            attributes: expect.objectContaining({
                name: "Kansai International Airport",
                iata: "KIX"
            }),
            id: "KIX",
            type: "airport"
        })
    );
});

  test('should get distance', async () => {
    // Calculate the distance between two airports and verify the response structure and values
    const response = await restHelper.post('/airports/distance', {
      "from": "GKA",
      "to": "KIX"
    });
    expect(response.ok()).toBeTruthy();
    expect(response.status()).toBe(200);
    const responseBody = await response.json();
    expect(responseBody.data).toEqual(expect.objectContaining({
        attributes: expect.objectContaining({"from_airport": {
            "altitude": 5282,
            "city": "Goroka",
            "country": "Papua New Guinea",
            "iata": "GKA",
            "icao": "AYGA",
            "id": 1,
            "latitude": "-6.08169",
            "longitude": "145.391998",
            "name": "Goroka Airport",
            "timezone": "Pacific/Port_Moresby",
            },
            "to_airport": expect.objectContaining({
            "altitude": 26,
            "city": "Osaka",
            "country": "Japan",
            "iata": "KIX",
            "icao": "RJBB",
            "id": 3158,
            "latitude": "34.427299",
            "longitude": "135.244003",
            "name": "Kansai International Airport",
            "timezone": "Asia/Tokyo",
            }),
            "kilometers": expect.any(Number)
        })
    }));
  });
});
