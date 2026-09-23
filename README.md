# Roma to the Alps — offline trip app

A standalone version of your trip guide: installs to the Home Screen on any
phone (iPhone or Android), works with no signal (airplane mode included),
and lets you and Allekhya each sign in with your own Google account to
edit plans and share attachments through a Drive folder you own and share
with her.

## Status

- ✅ **Firebase project live** — `roma-alps-trip-2026`. Firestore database
  created, web app registered, `firebase-config.js` filled in.
- ✅ **Sign-in + Drive attachment code built** — Google Sign-In (via Firebase
  Auth) + a Drive folder picker + direct Drive API calls for attachments.
  No Apps Script, no Firebase Storage, no card needed anywhere.
- ✅ **Firestore rules gated to your two Google accounts** — real access
  control now, not just an obscure URL. `firestore.rules` currently has a
  **placeholder for Allekhya's email** — needs updating and redeploying
  once you give it to me (`abhi14346@gmail.com` is already in there).
- ✅ **GitHub repo created and pushed** — `PonnapallyAbhijith/roma-alps-app`
  (currently private).
- ⏳ **GitHub Pages not enabled yet** — blocked on one decision (see below).
- ⏳ **A few Google Cloud console steps** — needed before sign-in actually
  works (steps 1–3 below).

---

## 1. Enable Google sign-in (Firebase Auth) (~2 min)

1. Go to <https://console.firebase.google.com/project/roma-alps-trip-2026/authentication/providers>
2. Click **Google** in the provider list → toggle **Enable** → pick a
   support email (any of your emails) → **Save**.

## 2. Restrict who can sign in (~3 min)

This is what actually protects the app, independent of whether the repo
or site is public:

1. Go to <https://console.cloud.google.com/apis/credentials/consent?project=roma-alps-trip-2026>
2. If prompted, set **User type: External**, app name anything (e.g.
   "Roma to the Alps"), your email as support/contact. Save through the
   scopes screen (defaults are fine) to reach **Test users**.
3. Under **Test users**, click **Add users** and add both:
   - `abhi14346@gmail.com`
   - Allekhya's Google account email
4. Leave the app in **Testing** publishing status (do not click "Publish
   app") — this is what makes the test-user list an enforced allowlist.
   Anyone not on it gets blocked at Google's own consent screen, before
   they ever reach your Drive or Firestore data.

## 3. Enable the Drive + Picker APIs (~1 min)

1. Go to <https://console.cloud.google.com/apis/library/drive.googleapis.com?project=roma-alps-trip-2026> → **Enable**.
2. Go to <https://console.cloud.google.com/apis/library/picker.googleapis.com?project=roma-alps-trip-2026> → **Enable**.

## 4. Decide: public repo, or a different host? (blocking GitHub Pages)

GitHub Pages on the free plan only serves **public** repositories — I hit
this as a real error trying to enable it, not a guess. A public repo here
is low-risk: nothing secret lives in this codebase (the Firebase config
and API key are meant to be public, same as any browser app), and now
that Firestore is locked to your two email addresses (step 2), the actual
data is protected by real Google authentication, not by the repo or URL
being hidden.

Tell me to go ahead and I'll flip `roma-alps-app` to public and enable
Pages immediately — or tell me if you'd rather use a different host that
supports private repos (e.g. Netlify/Vercel free tier) instead.

## 5. Once Pages is live: one more Firebase Auth setting

Firebase Auth only allows sign-in popups/redirects from domains you've
explicitly approved:

1. Go to <https://console.firebase.google.com/project/roma-alps-trip-2026/authentication/settings>
2. Under **Authorized domains**, **Add domain**, enter just the hostname,
   e.g. `ponnapallyabhijith.github.io` (no `https://`, no path).

## 6. Install it on both iPhones (~1 min each)

1. Open the live Pages URL in **Safari** (must be Safari — Chrome on iOS
   can't install web apps).
2. Tap the **Share** icon → **Add to Home Screen** → Add.
3. Open it from the Home Screen icon. Tap **Sign in with Google** (top of
   the page) — first time, it'll ask for your Drive permission too.
4. Whoever sets it up first taps **Choose Drive folder**, picks (or
   creates) a folder. Share that folder with the other person's Google
   account the normal Drive way (right-click → Share). When she signs in
   on her phone, she'll tap **Choose Drive folder** too and select the
   same one — Drive's per-file access model requires each person to
   confirm it once, even though it's already shared with her.

First open needs a connection (to cache everything and to sign in); after
that, browsing/reading works in airplane mode. Uploading attachments and
signing in always need a connection.

## How access control actually works here

- **Google's OAuth consent screen test-user list** (step 2) blocks
  sign-in entirely for anyone but your two emails — enforced by Google,
  not by us.
- **Firestore security rules** additionally check that the signed-in
  account's email matches that same allowlist before allowing any read
  or write of plan text or the shared Drive-folder pointer.
- **Drive attachments** inherit normal Google Drive sharing permissions —
  only accounts you've shared the folder with (i.e., each other) can read
  or write files in it, on top of the app itself requiring sign-in.

This is real access control, not link secrecy — the public GitHub Pages
URL and public repo are fine because nobody else can actually authenticate
or reach your data through them.

## What works offline vs. needs a connection

| Feature | Offline |
|---|---|
| Browsing days, the map, documents, weather, packing list, costs | ✅ works fully |
| Reading previously-synced plan edits (once signed in before) | ✅ works (Firestore's local cache) |
| **Writing** a new plan edit | ✅ works if already signed in — queues and syncs once back online |
| Viewing previously-loaded attachments | ✅ if opened before while online |
| **Uploading** a new attachment, or signing in | ❌ needs a connection |
| Inline street-map preview per day (OpenStreetMap) | ❌ needs a connection (falls back to a message + the "Open in Maps" button, which opens your phone's own Maps app) |
| Packing checklist ticks | ✅ always (stored per-device, doesn't need Firebase or sign-in at all) |

## Updating content later

If you want me to change the itinerary text, add a day, fix a detail, etc.
— tell me in this conversation, I'll edit `index.html` and push it. Both
installed apps pick up the change next time they open it online.
