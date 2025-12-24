/**
 * @format
 */

import 'react-native-gesture-handler'; // ⬅️ MUSI BYĆ PIERWSZE

import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';

AppRegistry.registerComponent(appName, () => App);
