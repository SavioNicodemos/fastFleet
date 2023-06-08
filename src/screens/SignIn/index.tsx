import { useState, useEffect } from 'react';
import * as WebBrowser from 'expo-web-browser';
import * as Google from 'expo-auth-session/providers/google';
import { Realm, useApp } from '@realm/react';

import { Container, Slogan, Title } from './styles';

import backgroundImg from '../../assets/background.png'
import { Button } from '../../components/Button';

import { GOOGLE_ANDROID_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';
import { Alert } from 'react-native';

WebBrowser.maybeCompleteAuthSession();

export function SignIn() {
  const [isAuthenticating, setIsAuthenticating] = useState(false)

  const app = useApp();

  const [_, response, googleSignIn] = Google.useAuthRequest({
    androidClientId: GOOGLE_ANDROID_CLIENT_ID,
    iosClientId: GOOGLE_IOS_CLIENT_ID,
    scopes: ['profile', 'email']
  });

  function handleGoogleSignIn() {
    setIsAuthenticating(true);

    googleSignIn().then((response) => {
      if (response.type !== 'success') {
        setIsAuthenticating(false);
      }
    })
  }

  useEffect(() => {
    if (response?.type === 'success') {
      const idToken = response.authentication?.idToken;
      if (idToken) {
        const credentials = Realm.Credentials.jwt(idToken);

        app.logIn(credentials).catch((error) => {
          console.error(error);
          Alert.alert('Sign In', 'Unable to connect to your Google account.');
        });
      } else {
        Alert.alert('Sign In', 'Unable to connect to your Google account.')
      }
      setIsAuthenticating(false);
    }
  }, [response]);

  return (
    <Container source={backgroundImg}>
      <Title>Fast Fleet</Title>

      <Slogan>Vehicle use management</Slogan>

      <Button title='Login with Google' onPress={handleGoogleSignIn} />

    </Container>
  );
}
