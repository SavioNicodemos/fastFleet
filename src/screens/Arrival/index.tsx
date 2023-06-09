import { useNavigation, useRoute } from '@react-navigation/native';
import { X } from 'phosphor-react-native';
import { BSON } from 'realm';
import { Alert } from 'react-native';

import { Header } from '../../components/Header';
import { Button } from '../../components/Button';
import { ButtonIcon } from '../../components/ButtonIcon';

import { Container, Content, Description, Footer, Label, LicensePlate } from './styles';
import { useObject, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

type RouteParams = {
  id: string;
};

export const Arrival = () => {
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

        {historic?.status === 'departure' ? (
          <Footer>
            <ButtonIcon icon={X} onPress={handleRemoveVehicleUsage} />
            <Button title="Register Arrival" onPress={handleRegisterArrival} />
          </Footer>
        ) : null}
      </Content>
    </Container>
  )
};
