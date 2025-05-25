import { APIRequestContext, APIResponse, request as playwrightRequest } from "@playwright/test";
// Use baseURL from Playwright config
import config from '../playwright.config';

class RestHelper {
    private authToken: string;
    private request: APIRequestContext;
    private BASE_URL = (config.use && config.use.baseURL) ?? '';

    constructor(request: APIRequestContext) {
        this.authToken = process.env.AUTH_TOKEN || 'EZaDh5MhcT8ByGD6kAtHmNzb';
        this.request = request;
    }

    async get(url: string, queryPrams: Record<string, string | number> = {}): Promise<APIResponse> {
        let processedURL = `${this.BASE_URL}${url}`;
        const params = new URLSearchParams();
        for (const key in queryPrams) {
            if (queryPrams[key] !== undefined && queryPrams[key] !== null) {
                params.append(key, String(queryPrams[key]));
            }
        }
        if ([...params.keys()].length > 0) {
            processedURL += (processedURL.includes('?') ? '&' : '?') + params.toString();
        }
        const response = await this.request.get(processedURL, {
            headers: {
                'Authorization': `Bearer ${this.authToken}`
            }
        });
        if (!response.ok()) {
            throw new Error(`GET request failed: ${response.status()} - ${await response.text()}`);
        }
        return response;
    }

    async post(url: string, body: Record<string, any> = {}): Promise<APIResponse> {
        const response = await this.request.post(`${this.BASE_URL}${url}`, {
            data: body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            }
        });
        if (!response.ok()) {
            throw new Error(`POST request failed: ${response.status()} - ${await response.text()}`);
        }
        return response;
    }

    async patch(url: string, body: Record<string, any> = {}): Promise<APIResponse> {
        const response = await this.request.patch(`${this.BASE_URL}${url}`, {
            data: body,
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            }
        });
        if (!response.ok()) {
            throw new Error(`PATCH request failed: ${response.status()} - ${await response.text()}`);
        }
        return response;
    }

    async delete(url: string): Promise<APIResponse> {
        const response = await this.request.delete(`${this.BASE_URL}${url}`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.authToken}`
            }
        });
        if (!response.ok()) {
            throw new Error(`PATCH request failed: ${response.status()} - ${await response.text()}`);
        }
        return response;
    }
}

export default RestHelper;