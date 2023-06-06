import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { Container, Content } from './styles';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const navigation = useNavigation();

  const realm = useRealm();
  const historic = useQuery(Historic);

  const handleRegisterMovement = () => {
    if (vehicleInUse?._id) {
      return navigation.navigate('arrival', { id: vehicleInUse?._id.toString() });
    }
    navigation.navigate('departure');
  };

  const fetchVehicleInUse = () => {
    try {
      const vehicle = historic?.filtered("status = 'departure'")[0];
      setVehicleInUse(vehicle);
    } catch (error) {
      console.log(error);
      Alert.alert('Vehicle in use', 'Unable to load the vehicle in use.');
    }
  };

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => realm.removeListener('change', () => fetchVehicleInUse());
  }, []);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />
      </Content>
    </Container>
  )
};
