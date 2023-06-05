import { useRef, useState } from 'react';
import { KeyboardAvoidingView, Platform, ScrollView, TextInput, Alert } from 'react-native';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';

import { Container, Content } from './styles';
import { licensePlateValidate } from '../../utils/licensePlateValidate';

const keyboardAvoidingViewBehavior = Platform.OS === 'ios' ? 'position' : 'height';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');

  const licensePlateRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const handleDepartureRegister = () => {
    if (!licensePlateValidate(licensePlate)) {
      licensePlateRef.current?.focus();
      return Alert.alert('Invalid License Plate', 'Please, enter a valid license plate.')
    }
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
              ref={licensePlateRef}
              label='License Plate'
              placeholder='ABC-1234'
              onChangeText={setLicensePlate}
              onSubmitEditing={() => descriptionRef.current?.focus()}
              returnKeyType='next'
            />

            <TextAreaInput
              ref={descriptionRef}
              label='Purpose'
              placeholder='I will use the vehicle for...'
              onChangeText={setDescription}
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
