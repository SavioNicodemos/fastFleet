import { useRef } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput } from 'react-native';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';

import { Container, Content } from './styles';

const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? 'position' : 'height';

export function Departure() {
  const descriptionRef = useRef<TextInput>(null);

  const handleDepartureRegister = () => {
    console.log('Register Departure');
  }

  return (
    <Container>
      <Header title='Departure' />

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={keyboardAvoidingViewBehavior}
      >
        <ScrollView>
          <Content>
            <LicensePlateInput
              label='License Plate'
              placeholder='ABC-1234'
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType='next'
            />

            <TextAreaInput
              ref={descriptionRef}
              label='Purpose'
              placeholder='I will use the vehicle for...'
              onSubmitEditing={handleDepartureRegister}
              returnKeyType='send'
              blurOnSubmit
            />

            <Button
              title='Register Departure'
              onPress={handleDepartureRegister}
            />
          </Content>
        </ScrollView>
      </KeyboardAvoidingView>
    </Container>
  )
};
