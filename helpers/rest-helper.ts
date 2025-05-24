import { APIRequestContext, APIResponse } from "@playwright/test";

class RestHelper {
    constructor(private request: APIRequestContext) {
        this.request = request;
    }
    async get(url:string, queryPrams: Record<string, string | number> = {}): Promise<APIResponse> {
        
        let processedURL = url;
        const params = new URLSearchParams();
        
        for (const key in queryPrams) {
            if(queryPrams[key] !== undefined && queryPrams[key] !== null) {
                params.append(key, String(queryPrams[key]));
            }
        }

        if([...params.keys()].length > 0) {
            processedURL += (processedURL.includes('?') ? '&' : '?') + params.toString();
        }
        const response = await this.request.get(processedURL);
        if (!response.ok()) {
            throw new Error(`GET request failed: ${response.status()} - ${await response.text()}`);
        }
        return response;
    }

    async post(url: string, body: Record<string, any> = {}): Promise<APIResponse> {
        const response = await this.request.post(url, {
            data: body,
            headers: {
                'Content-Type': 'application/json'
            }
        });
        if (!response.ok()) {
            throw new Error(`POST request failed: ${response.status()} - ${await response.text()}`);
        }
        return response;
    }
}

export default RestHelper;