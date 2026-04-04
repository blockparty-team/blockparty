import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dk.cphdistortion.app',
  appName: 'Distortion',
  webDir: '../../dist/apps/distortion/browser',
  plugins: {
    SystemBars: {
      insetsHandling: 'css',
      style: 'DARK',
      hidden: false,
      animation: 'NONE',
    },
    LocalNotifications: {
      smallIcon: 'ic_launcher',
      iconColor: '#488AFF',
    },
  },
  ios: {
    handleApplicationNotifications: false,
  },
};

export default config;
