import { reverseGeocodeAsync, LocationObjectCoords } from "expo-location";

export async function getAddressLocation({
  latitude,
  longitude,
}: LocationObjectCoords) {
  try {
    const address = await reverseGeocodeAsync({ latitude, longitude });
    const { street, name, city, region, country } = address[0];
    const fullAddress = `${street} ${name}, ${city} - ${region}, ${country}`;
    return fullAddress;
  } catch (error) {
    console.log(error);
  }
}
