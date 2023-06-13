import { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';

import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { Container, Content, Label, Title } from './styles';
import { useUser } from '@realm/react';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [history, setHistory] = useState<HistoricCardProps[]>();

  const navigation = useNavigation();
  const realm = useRealm();
  const historic = useQuery(Historic);
  const user = useUser();

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

  const fetchHistory = () => {
    try {
      const history = historic?.filtered("status = 'arrival' SORT(created_at DESC)");

      const formattedHistory = history?.map((item: Historic) => {
        return({
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: false,
          created: dayjs(item.created_at).format('[Departure] DD/MM/YYYY [at] HH:mm'),
        });
      });

      setHistory(formattedHistory);
    } catch (error) {
      console.log(error);
      Alert.alert('History', 'Unable to load the history.');
    }
  };

  const handleHistoricDetails = (id: string) => {
    navigation.navigate('arrival', { id });
  };

  useEffect(() => {
    fetchHistory();
  }, [historic]);

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => {
      if(realm && !realm.isClosed) {
        realm.removeListener('change', () => fetchVehicleInUse())
      }
    };
  }, []);

  useEffect(() => {
    realm.subscriptions.update((mutableSubs, realm) => {
      const historicByUserQuery = realm.objects('Historic').filtered(`user_id = '${user!.id}'`);

      mutableSubs.add(historicByUserQuery, { name: 'historic_by_user' });
    })
  }, [realm]);

  return (
    <Container>
      <HomeHeader />

      <Content>
        <CarStatus
          licensePlate={vehicleInUse?.license_plate}
          onPress={handleRegisterMovement}
        />

        <Title>Historic</Title>

        <FlatList
          data={history}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <HistoricCard
              data={item}
              onPress={() => handleHistoricDetails(item.id)}
            />)}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={(
            <Label>No vehicle used yet</Label>
          )}
        />

      </Content>
    </Container>
  )
};
