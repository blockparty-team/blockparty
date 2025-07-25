import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dk.karrusel',
  appName: 'Karrusel',
  webDir: '../../dist/apps/karrusel',
  plugins: {
    LocalNotifications: {
      smallIcon: 'ic_launcher',
      iconColor: '#488AFF',
    },
  },
  ios: {
    handleApplicationNotifications: false,
  },
  android: {
    adjustMarginsForEdgeToEdge: 'force',
  },
};

export default config;
