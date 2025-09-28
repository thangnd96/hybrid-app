This project has instructions to run as a hybrid app using Capacitor.

Quick steps (macOS):

1. Install dependencies:

```bash
pnpm install
``` 

2. Install Capacitor CLI and plugins:

```bash
pnpm add @capacitor/core @capacitor/cli @capacitor/android @capacitor/ios @capacitor/geolocation --save-exact
```

3. Build web assets and initialize Capacitor:

```bash
pnpm build
npx cap init hybrid-app com.hybrid.app --web-dir=dist
npx cap add android
npx cap add ios
npx cap sync
```

4. Open in simulator / device:

Android:

```bash
npx cap open android
```

iOS:

```bash
npx cap open ios
```

5. Use geolocation in code:

Import and call the wrapper:

```ts
import { getCurrentPosition } from '@/lib/capacitor'

const pos = await getCurrentPosition()
console.log(pos.coords.latitude, pos.coords.longitude)
```

Notes:
- Running on iOS requires a macOS machine with Xcode installed.
- On first run you may need to grant location permission in app settings.
