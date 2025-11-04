import type { UploadedFile } from '../types';

// IMPORTANT: Replace this with your actual n8n webhook URL
const N8N_WEBHOOK_URL = "https://your-n8n-webhook-url.com/webhook";

export const generateImage = async (prompt: string): Promise<string> => {
    const endpoint = `${N8N_WEBHOOK_URL}/generate`;
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt }),
        });

        if (!response.ok) {
            throw new Error(`Webhook response was not ok: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.imageData) {
            throw new Error("No image data found in the webhook response.");
        }
        
        return result.imageData;
    } catch (error) {
        console.error("Error calling generate image webhook:", error);
        throw new Error("Webhook call failed for image generation.");
    }
};

export const editImage = async (prompt: string, image: UploadedFile): Promise<string> => {
    const endpoint = `${N8N_WEBHOOK_URL}/edit`;
    try {
        const response = await fetch(endpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt, image }),
        });

        if (!response.ok) {
            throw new Error(`Webhook response was not ok: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result.imageData) {
            throw new Error("No image data found in the webhook response.");
        }

        return result.imageData;
    } catch (error) {
        console.error("Error calling edit image webhook:", error);
        throw new Error("Webhook call failed for image editing.");
    }
};
