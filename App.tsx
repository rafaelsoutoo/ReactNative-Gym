import { StatusBar } from 'react-native';
import { useFonts, Roboto_400Regular, Roboto_700Bold } from '@expo-google-fonts/roboto';
import { NativeBaseProvider } from 'native-base';
import { Loading } from '@components/Loading';

import { THEME } from 'src/theme';
import { Routes } from './src/routes';

import { AuthContext } from '@contexts/AuthContext';

export default function App() {
  const [fontsLoaded] = useFonts({ Roboto_400Regular, Roboto_700Bold });

  return (
    <NativeBaseProvider theme={THEME}>
      <StatusBar
        barStyle="light-content"
        backgroundColor="transparent"
        translucent
      />
      <AuthContext.Provider value={{
        user: {
          id: '1',
          name: 'rafael souto sena',
          email: 'fael7hotmail@gmail.com',
          avatar: 'rodrigo.png'
        }
      }}>

      {fontsLoaded ? <Routes /> : <Loading />}
    </AuthContext.Provider>
    </NativeBaseProvider >
  );
}

