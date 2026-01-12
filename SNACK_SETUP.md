# Hosting Pokedex on Expo Snack

This guide explains how to host your Pokedex app on [Expo Snack](https://snack.expo.dev).

## Method 1: Import from GitHub (Recommended)

Since your code is already on GitHub at `https://github.com/PrasadRanjane/pokedex`, you can import it directly into Snack:

### Steps:

1. **Go to Expo Snack**
   - Visit: https://snack.expo.dev
   - Sign in with your Expo/GitHub account

2. **Import from GitHub**
   - Click on the **"Import"** button (or the GitHub icon)
   - Enter your repository URL: `https://github.com/PrasadRanjane/pokedex`
   - Select the branch (usually `main`)
   - Click **"Import"**

3. **Configure for Snack**
   - Snack will automatically detect your `package.json` and `app.json`
   - Note: Expo Router may have limited support in Snack
   - You may need to adjust the entry point

4. **Run the App**
   - Click **"Run"** or press `Cmd+R` (Mac) / `Ctrl+R` (Windows)
   - Choose your platform (Android, iOS, or Web)

## Method 2: Manual Setup in Snack

If the GitHub import doesn't work perfectly due to expo-router limitations, you can manually set up:

### Steps:

1. **Create New Snack**
   - Go to https://snack.expo.dev
   - Click **"Create Snack"**

2. **Update package.json**
   - Copy dependencies from your `package.json`
   - Note: Some expo-router features may not work in Snack

3. **Create App.tsx**
   - Since Snack doesn't fully support expo-router file-based routing
   - You may need to create a simplified `App.tsx` entry point
   - See `App.snack.tsx` example below

4. **Copy Required Files**
   - Copy your components, contexts, constants, and types
   - Adjust imports to work without expo-router

## Important Notes

⚠️ **Limitations:**
- Expo Router file-based routing has limited support in Snack
- Some native modules might not work in the web preview
- Complex navigation may need to be simplified

✅ **What Works:**
- Most Expo SDK features
- React Native components
- API calls (Pokemon API)
- Theme context
- Basic navigation (with adjustments)

## Quick Snack URL

Once imported, you can share your Snack with this format:
```
https://snack.expo.dev/@yourusername/pokedex
```

## Troubleshooting

1. **If expo-router doesn't work:**
   - Consider creating a simplified version without file-based routing
   - Use React Navigation directly instead

2. **If imports fail:**
   - Check that all dependencies are in `package.json`
   - Some packages may need to be added manually in Snack

3. **If the app doesn't load:**
   - Check the console for errors
   - Verify all file paths are correct
   - Ensure TypeScript types are properly configured

## Alternative: Use Expo Go

Instead of Snack, you can also:
1. Run `npx expo start` locally
2. Scan the QR code with Expo Go app
3. Share the development URL with others
