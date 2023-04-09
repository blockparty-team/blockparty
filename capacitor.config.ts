import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dk.cphdistortion.app',
  appName: 'Distortion',
  webDir: 'www',
  bundledWebRuntime: false,
  plugins: {
    LocalNotifications: {
      smallIcon: "splash",
      iconColor: "#488AFF",
    }
  }
};

export default config;
