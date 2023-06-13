import { useEffect, useState } from 'react';
import { useNavigation, useRoute } from '@react-navigation/native';
import { X } from 'phosphor-react-native';
import { BSON } from 'realm';
import { Alert } from 'react-native';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';

import { Container, Content, Description, Footer, Label, LicensePlate, AsyncMessage } from './styles';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';
import { getLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage.ts';

type RouteParams = {
  id: string;
};

export const Arrival = () => {
  const [dataNotSynced, setDataNotSynced] = useState(false);

  const route = useRoute();
  const { id } = route.params as RouteParams;

  const historic = useObject(Historic, new BSON.UUID(id));
  const realm = useRealm();

  const title = historic?.status === 'departure' ? 'Arrival' : 'Details';

  const { goBack } = useNavigation();

  const handleRemoveVehicleUsage = () => {
    Alert.alert(
      'Cancel',
      'Are you sure you want to cancel this vehicle usage?',
      [
        {
          text: 'No',
          style: 'cancel',
        },
        {
          text: 'Yes',
          onPress: () => removeVehicleUsage(),
        },
      ])
  }

  const removeVehicleUsage = () => {
    realm.write(() => {
      realm.delete(historic);
    });
    goBack();
  };

  const handleRegisterArrival = () => {
    try {
      if (!historic) {
        return Alert.alert('Error', 'Unable to get the data to register the the arrival.');
      }

      realm.write(() => {
        historic.status = 'arrival';
        historic.updated_at = new Date();
      });

      Alert.alert('Success', 'Arrival registered successfully.');
      goBack();

    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'Unable to register the arrival.');
    }
  }

  useEffect(() => {
    getLastSyncTimestamp()
      .then(lastSync => setDataNotSynced(historic!.updated_at.getTime() > lastSync));
  }, [])

  return (
    <Container>
      <Header title={title} />

      <Content>
        <Label>
          License plate
        </Label>

        <LicensePlate>
          {historic?.license_plate}
        </LicensePlate>

        <Label>
          Purpose
        </Label>

        <Description>
          {historic?.description}
        </Description>

      </Content>
      {historic?.status === 'departure' ? (
        <Footer>
          <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
          <Button title="Register Arrival" onPress={handleRegisterArrival} />
        </Footer>
      ) : null}


      {
        dataNotSynced &&
        <AsyncMessage>
        Sync of {historic?.status === 'departure' ? "departure" : "arrival"} pending.
        </AsyncMessage>
      }
    </Container>
  )
};
