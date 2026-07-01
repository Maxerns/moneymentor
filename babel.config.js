// Restored: the repo was missing a Babel config, so the Expo app could not
// bundle. babel-preset-expo provides the RN/Expo transforms, inlines
// EXPO_PUBLIC_* env vars, and (via Expo's Metro config) resolves the "@/*"
// tsconfig path alias.
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ["babel-preset-expo"],
  };
};
