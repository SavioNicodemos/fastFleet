import { useUser } from '@realm/react';
import { useNavigation } from '@react-navigation/native';
import { useEffect, useRef, useState } from 'react';
import { ScrollView, TextInput, Alert } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import {
  LocationAccuracy,
  useForegroundPermissions,
  watchPositionAsync,
  LocationSubscription,
  LocationObjectCoords
} from 'expo-location';

import { CarSimple } from 'phosphor-react-native';

import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Loading } from '../../components/Loading';
import { LocationInfo } from '../../components/LocationInfo';
import { Map } from '../../components/Map';

import { useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { licensePlateValidate } from '../../utils/licensePlateValidate';
import { getAddressLocation } from '../../utils/getAddressLocation';

import { Container, Content, Message } from './styles';

export function Departure() {
  const [description, setDescription] = useState('');
  const [licensePlate, setLicensePlate] = useState('');
  const [isRegistering, setIsRegistering] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(true);
  const [currentAddress, setCurrentAddress] = useState<string | null>(null)
  const [currentCoords, setCurrentCoords] = useState<LocationObjectCoords | null>(null)

  const [locationForegroundPermission, requestLocationForegroundPermission] = useForegroundPermissions();

  const realm = useRealm();
  const user = useUser();
  const { goBack } = useNavigation();

  const licensePlateRef = useRef<TextInput>(null);
  const descriptionRef = useRef<TextInput>(null);

  const handleDepartureRegister = () => {
    try {
      if (!licensePlateValidate(licensePlate)) {
        licensePlateRef.current?.focus();
        return Alert.alert('Invalid License Plate', 'Please, enter a valid license plate.')
      }

      if (description.trim().length === 0) {
        descriptionRef.current?.focus();
        return Alert.alert('Purpose', 'Please inform the purpose of using the vehicle.')
      }

      if(!currentCoords?.latitude && !currentCoords?.longitude) {
        return Alert.alert('Location', 'Was not possible to get the current location. Try again.')
      }

      setIsRegistering(true);

      realm.write(() => {
        realm.create('Historic', Historic.generate({
          user_id: user!.id,
          license_plate: licensePlate.toUpperCase(),
          description,
        }));
      });

      Alert.alert('Departure', 'Departure registered successfully.');

      goBack();
    } catch (error) {
      console.log(error);
      return Alert.alert('Error', 'An error occurred while registering the departure.')
    } finally {
      setIsRegistering(false);
    }
  }

  useEffect(() => {
    requestLocationForegroundPermission();
  }, []);

  useEffect(() => {
    if (!locationForegroundPermission?.granted) return;

    let subscription: LocationSubscription;
    watchPositionAsync({
      accuracy: LocationAccuracy.High,
      timeInterval: 1000,
    }, (location) => {
      setCurrentCoords(location.coords);

      getAddressLocation(location.coords)
        .then((address) => {
          if (address) {
            setCurrentAddress(address)
          }
        })
        .finally(() => setIsLoadingLocation(false));
    }).then((response) => subscription = response);

    return () => {
      if (subscription) {
        subscription?.remove()
      }
    };
  }, [locationForegroundPermission]);

  if (!locationForegroundPermission?.granted) {
    return (
      <Container>
        <Header title='Departure' />
        <Message>
          You need to grant location permission to register a departure.
          Please go to your device settings and grant the permission.
        </Message>
      </Container>
    )
  }

  if (isLoadingLocation) {
    return (
      <Loading />
    )
  }

  return (
    <Container>
      <Header title='Departure' />
      <KeyboardAwareScrollView extraHeight={100}>
        <ScrollView>
          {currentCoords && (
            <Map coordinates={[currentCoords]} />
          )}
          <Content>
            {
              currentAddress &&
              <LocationInfo
                icon={CarSimple}
                label='Current location'
                description={currentAddress}
              />
            }
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
              isLoading={isRegistering}
            />
          </Content>
        </ScrollView>
      </KeyboardAwareScrollView>
    </Container>
  )
};
