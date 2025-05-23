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

This project uses GitHub Actions for automatic deployment. Here's how it works:

### First-time Setup

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Click "New repository secret"
4. Add these secrets:
   - Name: `GEMINI_API_KEY` Value: Your Gemini API key
   - Name: `SESSION_SECRET` Value: A secure random string (you can use a password generator)
5. Go to Settings > Pages
6. In the "Build and deployment" section:
   - Set Source to "GitHub Actions"

### How to Deploy

Simply commit and push your changes to the `main` branch:

```bash
# Make your changes, then:
git add .
git commit -m "Your commit message"
git push origin main
```

The GitHub Action will automatically:
1. Build your project
2. Deploy it to GitHub Pages
3. Show the deployment status in the Actions tab

You can check the status of your deployment in the "Actions" tab of your repository.

## Security Notes

1. **Never commit** your actual API keys or secrets to the repository
2. The `.env` and `.env.local` files are already in `.gitignore` to prevent accidental commits
3. For local development, the server has a fallback API key but it's recommended to use your own key
4. API keys exposed in client-side code are visible to users - be careful with what you expose! 