// import Constants from 'expo-constants';
// import * as Location from 'expo-location';
// import * as Permissions from 'expo-permissions';

// export const updateLocation = () => {
//   console.log('update location')
//   getLocation()
// }

// const getLocation = () => {
//   console.log('getLocation')
//   if (Platform.OS === 'android' && !Constants.isDevice) {
//     console.log('Oops, this will not work on Sketch in an Android emulator. Try it on your device!')
//   } else {
//     _getLocationAsync();
//   }
// }

// const _getLocationAsync = async () => {
//   console.log('_getLocationAsync')
//   let { status } = await Permissions.askAsync(Permissions.LOCATION);
//   if (status !== 'granted') {
//     setErrorMessage('Permission to access location was denied')
//   }

//   let location = await Location.getCurrentPositionAsync({});
//   //setLocation(location)
//   //dispatch(setCurrentLocation(location))
  
//   console.log(location)
// };