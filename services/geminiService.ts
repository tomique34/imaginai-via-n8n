import type { UploadedFile } from '../types';
import { AppError, handleError, fetchWithTimeout } from '../utils/errorHandler';

// N8N webhook URL is loaded from environment variable N8N_WEBHOOK_URL
const N8N_WEBHOOK_URL = process.env.N8N_WEBHOOK_URL || "https://your-n8n-webhook-url.com/webhook";

export const generateImage = async (prompt: string): Promise<string> => {
    const endpoint = `${N8N_WEBHOOK_URL}/generate`;

    try {
        const response = await fetchWithTimeout(
            endpoint,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt }),
            },
            30000 // 30 second timeout
        );

        if (!response.ok) {
            throw new AppError(
                'Failed to generate image. Please try again.',
                `Webhook responded with status ${response.status}: ${response.statusText}`,
                'WEBHOOK_ERROR',
                response.status
            );
        }

        const result = await response.json();
        if (!result.imageData) {
            throw new AppError(
                'Image generation failed. Please try again.',
                'No image data in response',
                'NO_IMAGE_DATA'
            );
        }

        return result.imageData;
    } catch (error) {
        throw handleError(error, 'generateImage');
    }
};

export const editImage = async (prompt: string, image: UploadedFile): Promise<string> => {
    const endpoint = `${N8N_WEBHOOK_URL}/edit`;

    try {
        const response = await fetchWithTimeout(
            endpoint,
            {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, image }),
            },
            30000 // 30 second timeout
        );

        if (!response.ok) {
            throw new AppError(
                'Failed to edit image. Please try again.',
                `Webhook responded with status ${response.status}: ${response.statusText}`,
                'WEBHOOK_ERROR',
                response.status
            );
        }

        const result = await response.json();
        if (!result.imageData) {
            throw new AppError(
                'Image editing failed. Please try again.',
                'No image data in response',
                'NO_IMAGE_DATA'
            );
        }

        return result.imageData;
    } catch (error) {
        throw handleError(error, 'editImage');
    }
};
