// Lets you and your wife sign in with your own Google accounts and pick a
// shared Drive folder for attachments (tickets, boarding passes, etc).
// See README.md -> "Attachments: your own Google Drive" for exact setup
// steps in the Google Cloud console.
//
// Both values below are meant to be public / embedded in client-side code
// -- that's how every browser-based Google Sign-In app works. Real access
// control comes from (a) the OAuth consent screen's test-user allowlist
// (only you and your wife can sign in at all) and (b) the API key being
// restricted to this site's origin and the Picker API only.

export const googleConfig = {
  clientId: "REPLACE_WITH_YOUR_OAUTH_CLIENT_ID.apps.googleusercontent.com",
  apiKey: "REPLACE_WITH_YOUR_API_KEY",
  driveScope: "https://www.googleapis.com/auth/drive.file"
};
