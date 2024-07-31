import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'dev.blockparty.studieby',
  appName: 'Tour de Chanmbre',
  webDir: '../../dist/apps/studieby',
  plugins: {
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
