import AsyncStorage from "@react-native-async-storage/async-storage";

const STORAGE_KEY = "@fastfleet:location";

type LocationProps = {
  latitude: number;
  longitude: number;
  timestamp: number;
}

export async function getStorageLocation(): Promise<LocationProps[]> {
  const storage = await AsyncStorage.getItem(STORAGE_KEY);

  return storage ? JSON.parse(storage) : [];
}

export async function saveStorageLocation(newLocation: LocationProps): Promise<void>{
  const storage = await getStorageLocation();

  const newStorage = [...storage, newLocation];

  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newStorage));
}

export async function removeStorageLocation(): Promise<void>{
  await AsyncStorage.removeItem(STORAGE_KEY);
}
