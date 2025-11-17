// babel.config.js

module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
    plugins: [
      // other plugins here (e.g., 'expo-router/babel' or custom modules)
      "react-native-reanimated/plugin", // <-- THIS MUST BE THE LAST ITEM
    ],
  };
};
