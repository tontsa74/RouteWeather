
import Constants from 'expo-constants';
import * as Location from 'expo-location';
import * as Permissions from 'expo-permissions';

export const fetchLocation = async () => {
  let location;

  if (Platform.OS === 'android' && !Constants.isDevice) {
    throw new Error('Oops, this will not work on Sketch in an Android emulator. Try it on your device!')
  } else {
    let { status } = await Permissions.askAsync(Permissions.LOCATION);
    if (status !== 'granted') {
      throw new Error('Permission to access location was denied')
    }

    location = await Location.getCurrentPositionAsync({});
  }
  
  return location
}
