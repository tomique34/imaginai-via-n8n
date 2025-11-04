# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

ImaginAI is an AI-powered image generation and editing web application built with React, TypeScript, and Vite. It allows users to generate images from text prompts or edit uploaded images using natural language instructions. The application integrates with n8n webhooks for backend AI processing.

## Development Commands

```bash
# Install dependencies
npm install

# Run development server (starts on http://localhost:3000)
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Environment Configuration

The app requires a `GEMINI_API_KEY` in `.env.local` for API access. The Vite config exposes this as `process.env.GEMINI_API_KEY` and `process.env.API_KEY`.

**Important**: Update `services/geminiService.ts:4` with your actual n8n webhook URL before running. The placeholder is `https://your-n8n-webhook-url.com/webhook`.

## Architecture

### Core Application Flow

1. **Entry Point** (`index.tsx`): Wraps the app with `I18nProvider` for internationalization
2. **Main App** (`App.tsx`): Manages application state including:
   - User prompt input
   - Image upload handling
   - Generated image display
   - Loading and error states
3. **Backend Integration** (`services/geminiService.ts`): Communicates with n8n webhooks at two endpoints:
   - `/generate`: Creates new images from text prompts
   - `/edit`: Modifies uploaded images based on text instructions

### State Management

The app uses React hooks for state management:
- `prompt`: User's text description
- `uploadedFile`: Base64 encoded image data with MIME type (see `types.ts`)
- `generatedImage`: Base64 result from AI generation/editing
- `isLoading`: Prevents concurrent requests
- `error`: User-facing error messages

### Internationalization (i18n)

The app supports multiple languages (currently English and Slovak):
- **Context**: `context/I18nContext.tsx` provides locale state and translation function `t()`
- **Translations**: Language files in `locales/` export translation objects
- **Usage**: Components call `useI18n()` hook to access `t()` function and `locale`/`setLocale()`

### Component Structure

- **Header**: App branding and title
- **PromptInput**: Text area for user descriptions
- **ImageUploader**: Drag-and-drop file upload with validation (10MB max, PNG/JPG/GIF/WebP only)
- **ActionButtons**: Generate and Edit buttons with conditional enabling
- **GeneratedImageDisplay**: Shows result with loading state and download functionality
- **LanguageSwitcher**: Toggle between supported locales

### Webhook Integration Architecture

The `geminiService.ts` module expects n8n webhooks to:
- Accept POST requests with JSON payloads
- Return JSON responses with `imageData` field containing base64 image data
- `/generate` endpoint receives: `{ prompt: string }`
- `/edit` endpoint receives: `{ prompt: string, image: UploadedFile }`

When adding new image processing features, follow this pattern:
1. Create service function in `geminiService.ts`
2. Add translation keys to all locale files
3. Update App state handlers
4. Configure corresponding n8n workflow endpoint
