# TipJar Pro

A modern web application for efficient tip distribution management, built with React, TypeScript, and Tailwind CSS.

## Features

- 📷 OCR-powered tip sheet scanning using Google Gemini API
- 💰 Automated tip calculations based on hours worked
- 📱 Responsive design for both desktop and mobile
- 🎨 Modern UI with shadcn/ui components
- 🔒 Secure environment variable management
- 🚀 Automated GitHub Pages deployment

## Tech Stack

- Frontend: React + TypeScript + Tailwind CSS
- Backend: Express.js
- OCR: Google Gemini API
- UI Components: shadcn/ui
- Styling: Tailwind CSS
- Deployment: GitHub Actions

## Getting Started

### Prerequisites

- Node.js (v16 or later)
- npm or yarn
- Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone https://github.com/itswalshy/tipjarPRO.git
cd tipjarPRO
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
GEMINI_API_KEY=your_api_key_here
NODE_ENV=development
```

4. Start the development server:
```bash
npx tsx server/index-local.ts
```

The application will be available at http://localhost:5000

## Environment Variables

- `GEMINI_API_KEY`: Your Google Gemini API key for OCR functionality
- `NODE_ENV`: Application environment (development/production)
- `SESSION_SECRET`: Secret key for session management (required in production)

See [ENV_SETUP.md](ENV_SETUP.md) for detailed environment setup instructions.

## Deployment

This project uses GitHub Actions for automatic deployment to GitHub Pages.

### How to Deploy

Simply commit and push your changes to the `main` branch:

```bash
git add .
git commit -m "Your changes"
git push origin main
```

The GitHub Action will automatically build and deploy your site to GitHub Pages. You can view deployment status in the Actions tab of your repository.

For full deployment setup instructions, see [ENV_SETUP.md](ENV_SETUP.md).

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License - see the LICENSE file for details.