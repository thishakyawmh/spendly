import { Platform } from 'react-native';

const getApiUrl = () => {
  if (Platform.OS === 'android') {
    // 10.0.2.2 is the special host loopback IP for Android Emulator to access host machine's localhost
    return 'http://10.0.2.2:5001/api';
  }
  return 'http://localhost:5001/api';
};

export const API_URL = getApiUrl();
