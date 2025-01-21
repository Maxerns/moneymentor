// filepath: moneymentor/index.js
import { AppRegistry } from "react-native";
import { registerRootComponent } from "expo";
import App from "./app";

// registerRootComponent calls AppRegistry.registerComponent('main', () => App);
// It also ensures that whether you load the app in the Expo client or in a native build,
// the environment is set up appropriately
registerRootComponent(App);

// For non-Expo environments
AppRegistry.registerComponent('main', () => App);