import { useState, useEffect } from 'react';
import { Alert, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import dayjs from 'dayjs';
import Toast from 'react-native-toast-message';

import { HomeHeader } from '../../components/HomeHeader';
import { CarStatus } from '../../components/CarStatus';
import { HistoricCard, HistoricCardProps } from '../../components/HistoricCard';
import { useQuery, useRealm } from '../../libs/realm';
import { Historic } from '../../libs/realm/schemas/Historic';

import { Container, Content, Label, Title } from './styles';
import { useUser } from '@realm/react';
import { getLastSyncTimestamp, saveLastSyncTimestamp } from '../../libs/asyncStorage/syncStorage.ts';
import { TopMessage } from '../../components/TopMessage';
import { CloudArrowUp } from 'phosphor-react-native';

export function Home() {
  const [vehicleInUse, setVehicleInUse] = useState<Historic | null>(null);
  const [history, setHistory] = useState<HistoricCardProps[]>();
  const [percentageToSync, setPercentageToSync] = useState<string | null>(null);

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

  const fetchHistory = async () => {
    try {
      const history = historic?.filtered("status = 'arrival' SORT(created_at DESC)");

      const lastSync = await getLastSyncTimestamp();

      const formattedHistory = history?.map((item: Historic) => {
        return ({
          id: item._id.toString(),
          licensePlate: item.license_plate,
          isSync: lastSync > item.updated_at!.getTime(),
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

  const progressNotification = async (transferred: number, transferable: number) => {
    const percentage = (transferred / transferable) * 100;

    if (percentage < 100) {
      setPercentageToSync(`${percentage.toFixed(0)}% synced`);
    }

    if (percentage === 100) {
      await saveLastSyncTimestamp()
      await fetchHistory();
      setPercentageToSync(null);

      Toast.show({
        type: 'info',
        text1: 'The sync was completed successfully.',
      });
    }
  }

  useEffect(() => {
    fetchHistory();
  }, [historic]);

  useEffect(() => {
    fetchVehicleInUse();
  }, []);

  useEffect(() => {
    realm.addListener('change', () => fetchVehicleInUse());

    return () => {
      if (realm && !realm.isClosed) {
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

  useEffect(() => {
    const syncSession = realm.syncSession;

    if (!syncSession) {
      return;
    }

    syncSession.addProgressNotification(
      Realm.ProgressDirection.Upload,
      Realm.ProgressMode.ReportIndefinitely,
      progressNotification
    )

    return () => {
      syncSession.removeProgressNotification(progressNotification);
    }
  }, []);

  return (
    <Container>
      {
        percentageToSync && (
          <TopMessage title={percentageToSync} icon={CloudArrowUp} />
        )
      }
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
