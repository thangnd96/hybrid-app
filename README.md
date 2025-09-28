# Hybrid App

A modern React application with hybrid mobile support using Capacitor, featuring geolocation functionality, beautiful UI components, and comprehensive testing.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

### Required Software
- **Node.js** (v18.0.0 or higher) - [Download here](https://nodejs.org/)
- **pnpm** (v8.0.0 or higher) - Install with `npm install -g pnpm`
- **Git** - [Download here](https://git-scm.com/)

### For Mobile Development
- **Android Studio** (for Android development) - [Download here](https://developer.android.com/studio)
- **Xcode** (for iOS development, macOS only) - Available on Mac App Store
- **Java Development Kit (JDK) 17** - [Download here](https://adoptium.net/)

## 🛠️ Installation & Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/thangnd96/hybrid-app.git
cd hybrid-app
```

### Step 2: Install Dependencies

```bash
pnpm install
```

## 🌐 Web Development

### Development Server

Start the development server:

```bash
pnpm dev
```

The app will be available at `http://localhost:3000`

### Build for Production

```bash
pnpm build
```

### Preview Production Build

```bash
pnpm preview
```

### Testing

Run all tests:

```bash
pnpm test
```

Run tests in watch mode:

```bash
pnpm test:watch
```

Generate coverage report:

```bash
pnpm test:coverage
```

### Linting

```bash
pnpm lint
```

## 📱 Mobile Development (Capacitor)

### Step 1: Install Capacitor Dependencies

The required Capacitor packages are already included in `package.json`:

- `@capacitor/core` - Core Capacitor functionality
- `@capacitor/cli` - Command line interface
- `@capacitor/android` - Android platform support
- `@capacitor/ios` - iOS platform support
- `@capacitor/geolocation` - Geolocation plugin
- `@capacitor/status-bar` - Status bar plugin

### Step 2: Build Web Assets

```bash
pnpm build
```

### Step 3: Initialize Capacitor (if not already done)

```bash
npx cap init "Hybrid App" "com.example.hybridapp" --web-dir=dist
```

### Step 4: Add Mobile Platforms

#### Android

```bash
npx cap add android
```

#### iOS (macOS only)

```bash
npx cap add ios
```

### Step 5: Sync Project

```bash
npx cap sync
```

### Step 6: Open in IDEs

#### Android Studio

```bash
npx cap open android
```

#### Xcode (macOS only)

```bash
npx cap open ios
```

## 🔧 Configuration

### Capacitor Configuration

The `capacitor.config.ts` file contains the main configuration:

```typescript
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.example.app',
  appName: 'Hybrid App',
  plugins: {
    StatusBar: {
      overlaysWebView: false,
      style: 'DARK',
      backgroundColor: '#00000000',
    },
  },
  webDir: 'dist',
};

export default config;
```

### Vite Configuration

The `vite.config.ts` includes:
- React SWC plugin for fast compilation
- Path aliases (`@/` for `src/`)
- TanStack Router plugin

### TypeScript Configuration

- `tsconfig.json` - Main TypeScript configuration
- `tsconfig.app.json` - App-specific configuration
- `tsconfig.node.json` - Node.js configuration

## 🧪 Testing

### Test Structure

```
src/
├── __tests__/           # Test files
├── components/
│   └── __tests__/       # Component tests
├── hooks/
│   └── __tests__/       # Hook tests
├── lib/
│   └── __tests__/       # Utility tests
└── stores/
    └── __tests__/       # Store tests
```

### Test Configuration

- **Jest** - Test runner
- **React Testing Library** - Component testing
- **jsdom** - DOM environment for tests
- **ts-jest** - TypeScript support

### Running Tests

```bash
# Run all tests
pnpm test

# Run tests in watch mode
pnpm test:watch

# Generate coverage report
pnpm test:coverage
```

## 📁 Project Structure

```
hybrid-app/
├── public/                 # Static assets
├── src/
│   ├── components/         # React components
│   │   ├── ui/            # Base UI components
│   │   └── __tests__/     # Component tests
│   ├── hooks/             # Custom React hooks
│   │   └── __tests__/     # Hook tests
│   ├── lib/               # Utility functions
│   │   └── __tests__/     # Utility tests
│   ├── routes/            # Route components
│   ├── stores/            # State management
│   │   └── __tests__/     # Store tests
│   ├── commons/           # Shared types and constants
│   ├── assets/            # Images and static files
│   ├── App.tsx            # Main app component
│   ├── main.tsx           # App entry point
│   └── index.css          # Global styles
├── android/               # Android project (generated)
├── ios/                   # iOS project (generated)
├── dist/                  # Built web assets
├── capacitor.config.ts    # Capacitor configuration
├── vite.config.ts         # Vite configuration
├── jest.config.mjs        # Jest configuration
├── tailwind.config.js     # Tailwind CSS configuration
└── package.json           # Dependencies and scripts
```

## 🎨 UI Components

### Component Library

The app uses a custom component library built on top of Shadcn:

- **Button** - Various button styles and sizes
- **Card** - Content containers
- **Dialog** - Modal dialogs
- **Input** - Form inputs
- **Select** - Dropdown selections
- **Badge** - Status indicators
- **Avatar** - User profile images
- **Alert** - Notification messages

### Styling

- **Tailwind CSS** - Utility-first CSS framework
- **CSS Variables** - Custom properties for theming
- **Responsive Design** - Mobile-first approach

## 🔌 Native Features

### Geolocation

The app includes comprehensive geolocation functionality:

```typescript
import { useGeolocation } from '@/hooks/useNativeFeatures';

function MyComponent() {
  const { location, getCurrentLocation, isLoading, error } = useGeolocation();
  
  // Use geolocation data
}
```

### Device Detection

```typescript
import { useDeviceInfo } from '@/hooks/useNativeFeatures';

function MyComponent() {
  const { isMobile, isTablet, platform } = useDeviceInfo();
  
  // Adapt UI based on device
}
```

## 🚀 Deployment

### Web Deployment

1. Build the project:
   ```bash
   pnpm build
   ```

2. Deploy the `dist` folder to your hosting service:
   - Vercel
   - Netlify
   - AWS S3
   - GitHub Pages

### Mobile App Deployment

#### Android

1. Open Android Studio:
   ```bash
   npx cap open android
   ```

2. Build APK or AAB:
   - **Debug APK**: Build → Build Bundle(s) / APK(s) → Build APK(s)
   - **Release AAB**: Build → Generate Signed Bundle / APK

3. Upload to Google Play Console

#### iOS

1. Open Xcode:
   ```bash
   npx cap open ios
   ```

2. Configure signing and provisioning
3. Archive and upload to App Store Connect

## 🐛 Troubleshooting

### Common Issues

#### 1. Capacitor Sync Issues

```bash
# Clear and re-sync
npx cap sync --force
```

#### 2. Android Build Issues

- Ensure Android SDK is properly installed
- Check Java version (JDK 17 required)
- Verify environment variables

#### 3. iOS Build Issues

- Ensure Xcode is installed and updated
- Check iOS deployment target
- Verify code signing

#### 4. Geolocation not working on IOS device (I'm fixing it).

### Debug Commands

```bash
# Check Capacitor version
npx cap doctor

# List installed plugins
npx cap ls

# Check Android setup
npx cap doctor android

# Check iOS setup
npx cap doctor ios
```

**Happy Coding! 🎉**