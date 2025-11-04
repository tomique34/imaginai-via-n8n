

# ImaginAI - AI Image Generation & Editing

An AI-powered image generation and editing web application built with React, TypeScript, and Vite. Generate images from text prompts or edit existing images using natural language instructions via n8n webhook integration.


## Features

- 🎨 **Text-to-Image Generation**: Create images from text prompts
- ✏️ **Image Editing**: Modify existing images with natural language instructions
- 🌍 **Multi-language Support**: English and Slovak localization
- 🔒 **Security-First**: Input validation, rate limiting, CSP headers, and secure error handling
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Prerequisites

- Node.js (v16 or higher)
- n8n instance with configured webhooks for image generation/editing

## Setup

1. **Clone the repository**
   ```bash
   git clone https://github.com/tomique34/imaginai-via-n8n.git
   cd imaginai-via-n8n
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure environment variables**

   Copy `.env.example` to `.env.local` and configure:
   ```bash
   cp .env.example .env.local
   ```

   Edit `.env.local` and set your values:
   ```env
   # Your n8n webhook base URL (without /generate or /edit suffix)
   N8N_WEBHOOK_URL=https://your-n8n-instance.com/webhook
   ```

   **IMPORTANT SECURITY NOTE**:
   - The `GEMINI_API_KEY` should **NOT** be set in the frontend `.env.local`
   - API keys must be kept secure on your n8n backend workflows
   - Never expose API keys in client-side code

4. **Run the development server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:3000`

## Build for Production

```bash
npm run build
npm run preview
```

## Security Features

This application implements multiple security best practices:

- ✅ **Content Security Policy (CSP)** - Prevents XSS and injection attacks
- ✅ **Input Validation** - Sanitizes user prompts and file uploads
- ✅ **Rate Limiting** - Client-side rate limiting (5 requests/minute)
- ✅ **File Validation** - Magic number verification for uploaded images
- ✅ **Secure Error Handling** - No internal details exposed to users
- ✅ **Request Timeouts** - 30-second timeout for all API calls
- ✅ **Memory Leak Prevention** - Proper cleanup of object URLs
- ✅ **Error Boundaries** - Graceful error handling in React

For more details, see `SECURITY_report.md` (not committed to repository)

## n8n Webhook Configuration

Your n8n webhooks should:

1. **Accept POST requests** with JSON payloads
2. **Return JSON responses** with `imageData` field containing base64 image data

### Expected Endpoints

- `POST /generate` - Generate new images
  ```json
  {
    "prompt": "your text prompt"
  }
  ```

- `POST /edit` - Edit existing images
  ```json
  {
    "prompt": "editing instructions",
    "image": {
      "data": "base64_encoded_image",
      "mimeType": "image/png"
    }
  }
  ```

### Expected Response Format

```json
{
  "imageData": "base64_encoded_result_image"
}
```

## Project Structure

```
├── components/          # React components
├── context/            # React context providers (i18n)
├── hooks/              # Custom React hooks (rate limiting)
├── locales/            # Translation files
├── services/           # API service layer
├── utils/              # Utility functions (validation, error handling)
├── App.tsx             # Main application component
├── index.tsx           # Application entry point
└── vite.config.ts      # Vite configuration
```

## Development Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

[Add your license here]

## Support

For issues or questions, please open an issue on GitHub.
