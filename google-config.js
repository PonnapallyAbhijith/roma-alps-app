// Lets you and your wife sign in with your own Google accounts (via Firebase
// Auth) and pick a shared Drive folder for attachments. See README.md ->
// "Attachments: your own Google Drive" for the exact setup steps.
//
// apiKey here is only used for the Google Picker (folder-browser) dialog --
// it can be the SAME apiKey already in firebase-config.js, as long as
// "Google Picker API" is enabled for that project (see README). It's meant
// to be public / embedded in client-side code, same as the Firebase config.

export const googleConfig = {
  apiKey: "AIzaSyDh8_IOR3oJQ56xEyo4Fn3re7o0N_1qZ7o" // same key as firebase-config.js
};
