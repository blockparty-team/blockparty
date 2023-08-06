import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dk.karrusel',
  appName: 'Karrusel',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "ic_launcher",
      iconColor: "#488AFF",
    }
  }
};

export default config;
