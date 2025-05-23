# Environment Variables Setup

This project uses environment variables for sensitive information like API keys. Follow these steps to set up your local environment:

## Setting up Environment Variables

### Server Environment

1. Create a `.env` file in the project root (this file will not be committed to Git)
2. Add your Gemini API key:

```
GEMINI_API_KEY=your_gemini_api_key_here
SESSION_SECRET=your_random_secret_string_here
```

3. Replace the placeholders with your actual values

### Client Environment (if needed)

If you need to access environment variables on the client side:

1. Create a `.env.local` file in the project root
2. Add the Vite-specific environment variables:

```
VITE_GEMINI_API_KEY=your_gemini_api_key_here
```

## GitHub Pages Deployment

For GitHub Pages deployment, you'll need to set up secrets in your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add these secrets:
   - Name: `GEMINI_API_KEY` Value: Your Gemini API key
   - Name: `SESSION_SECRET` Value: A secure random string

Then in your workflow file (`.github/workflows/deploy.yml`), add these environment variables:

```yaml
jobs:
  build-and-deploy:
    # ...
    env:
      GEMINI_API_KEY: ${{ secrets.GEMINI_API_KEY }}
      SESSION_SECRET: ${{ secrets.SESSION_SECRET }}
```

## Security Notes

1. **Never commit** your actual API keys or secrets to the repository
2. The `.env` and `.env.local` files are already in `.gitignore` to prevent accidental commits
3. For local development, the server has a fallback API key but it's recommended to use your own key
4. API keys exposed in client-side code are visible to users - be careful with what you expose! 