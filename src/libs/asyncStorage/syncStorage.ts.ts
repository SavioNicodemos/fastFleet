import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_ASYNC_KEY = "@fastfleet:last_sync";

export async function saveLastSyncTimestamp(){
  const timestamp = new Date().getTime();

  await AsyncStorage.setItem(STORAGE_ASYNC_KEY, timestamp.toString());

  return timestamp;
}

export async function getLastSyncTimestamp(){
  const timestamp = await AsyncStorage.getItem(STORAGE_ASYNC_KEY);

  return timestamp ? Number(timestamp) : 0;
}
