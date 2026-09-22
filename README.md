# Roma to the Alps — offline trip app

A standalone version of your trip guide: installs to the Home Screen on any
phone (iPhone or Android), works with no signal (airplane mode included),
and syncs plan edits + attached documents between your phone and
Allekhya's automatically when either of you has a connection.

## Status

- ✅ **Firebase project created and live** — `roma-alps-trip-2026`. Firestore
  database created, security rules deployed, web app registered,
  `firebase-config.js` filled in with the real values. Plan editing
  (Add plan / Edit plan) already works end to end.
- ⏳ **Attachments (Drive)** — code is in place, but needs one Apps Script
  deployment on your side (step 1 below) before uploads work.
- ⏳ **GitHub Pages** — not deployed yet (step 2 below).

---

## 1. Attachments: Google Drive via Apps Script (~5 min)

Firebase Storage now requires a billing account even for free-tier usage,
so attachments instead go straight into a folder in **your own Google
Drive**, through a small script you deploy once.

1. Go to <https://script.google.com> → **New project**.
2. Delete the default `myFunction() {}` code, and paste in the entire
   contents of `apps-script-drive-upload.gs` (in this folder). The
   shared-secret line is already filled in to match `drive-config.js` —
   you don't need to edit anything in the script.
3. Click **Deploy → New deployment**.
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**. The first time, it'll ask you to authorize the
     script's access to your Drive — approve it (it's your own script,
     running under your own account).
4. Copy the **Web app URL** it gives you (ends in `/exec`).
5. Open `drive-config.js` in this folder and replace `uploadUrl`'s
   placeholder with that URL. Leave `secret` as-is.

A folder called **"Roma to the Alps - Trip Attachments"** will appear in
your Drive the first time someone uploads a file — that's where every
attached ticket/photo/PDF lands, viewable/shareable like any Drive file.

**Privacy note:** the script checks a shared-secret string before saving
anything, but that's a light deterrent, not real authentication — anyone
who has both the Web app URL and the secret (both live in this public
site's source) could write files into that Drive folder. Same trade-off
as the rest of this app (see below): fine for trip planning, don't rely
on it for anything sensitive.

## 2. Put it on GitHub Pages (~5 min)

1. Create a new **private** GitHub repository (any name, e.g. `roma-alps-app`).
2. Upload everything in this folder to it (`index.html`, `manifest.json`,
   `sw.js`, `firebase-config.js`, `drive-config.js` *with your real Web
   app URL*, `icons/`, `photos/`). Easiest way: on the repo's GitHub page,
   "Add file → Upload files", drag the whole folder's contents in, commit.
   (Skip `apps-script-drive-upload.gs`, `firebase.json`, `.firebaserc`,
   `firestore.rules` — those are setup-only, not needed by the live site,
   though it's harmless to include them too.)
3. Repo **Settings → Pages** → under "Build and deployment", Source:
   **Deploy from a branch**, Branch: `main` (or `master`), folder `/ (root)`.
   Save.
4. GitHub gives you a URL like `https://yourusername.github.io/roma-alps-app/`.
   It takes a minute or two to go live the first time.

(A **private repo still publishes a public Pages site** at that URL —
GitHub Pages doesn't support private hosting on the free plan.)

## 3. Install it on both iPhones (~1 min each)

1. Open the `https://yourusername.github.io/roma-alps-app/` link in
   **Safari** (must be Safari, not Chrome — Chrome on iOS can't install
   web apps).
2. Tap the **Share** icon → **Add to Home Screen** → Add.
3. Open it from the Home Screen icon from now on. First open needs a
   connection (to cache everything); after that, airplane mode is fine.

Do this on Allekhya's phone too, same link. Both of you now have an
installed app pointed at the same shared Firebase project and Drive
folder — edits made on one phone (plan text, attached files) show up on
the other next time it's online.

## Privacy trade-off, overall

You chose no login on either phone, so none of this is access-controlled
in the strict sense — it's protected only by the GitHub Pages URL and the
Apps Script secret being hard to find, not by real authentication. That's
fine for trip-planning notes and ticket screenshots; just don't put
passport numbers, card numbers, or anything else genuinely sensitive into
plan text or attachments. Say the word if you'd rather add real sign-in
later (Firebase Auth) — happy to wire it in.

## What works offline vs. needs a connection

| Feature | Offline |
|---|---|
| Browsing days, the map, documents, weather, packing list, costs | ✅ works fully |
| Reading previously-synced plan edits | ✅ works (Firestore's local cache) |
| **Writing** a new plan edit | ✅ works — queues and syncs once back online |
| Viewing previously-loaded attachments | ✅ if opened before while online |
| **Uploading** a new attachment | ❌ needs a connection at the moment you upload |
| Inline street-map preview per day (OpenStreetMap) | ❌ needs a connection (falls back to a message + the "Open in Maps" button, which opens your phone's own Maps app) |
| Packing checklist ticks | ✅ always (stored per-device, doesn't need Firebase at all) |

## Updating content later

If you want me to change the itinerary text, add a day, fix a detail, etc.
— tell me in this conversation, I'll edit `index.html`, and you just
re-upload that one file to the GitHub repo (or `git push` if you clone it
locally). Everyone's installed app picks up the change next time they
open it online.
