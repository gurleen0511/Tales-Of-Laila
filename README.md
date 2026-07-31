# Tales of Laila

Tales of Laila is a small dashboard for keeping track of life with Laila. It
covers the everyday stuff—meals, litter visits, grooming, zoomies, weight, and
milestones—without turning it into a spreadsheet.

The app is built with React and Vite, with Supabase handling storage. It also
works as a PWA, so it can be added to a phone's home screen and used like a
regular app.

## What it tracks

- Feedings
- Litter visits
- Grooming
- Zoomies
- Weight over time
- Milestones and memories

## Running it locally

You'll need Node.js and a Supabase project.

First, install the dependencies:

```bash
npm install
```

Next, copy the example environment file:

```bash
cp .env.example .env
```

Open `.env` and add your Supabase project details:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-publishable-key
```

Use the main Supabase project URL here, without `/rest/v1` at the end.

Start the app:

```bash
npm run dev
```

Vite will print the local address in the terminal, usually
`http://localhost:5173`. If that port is busy, it will pick another one.

## Setting up the database

Create a Supabase project, open its SQL Editor, and run
[`supabase/schema.sql`](supabase/schema.sql). This creates the tables and
policies the dashboard expects.

You can find the project URL and publishable key in the Supabase dashboard.
After adding them to `.env`, restart the development server so Vite can load
the new values.

## Useful commands

```bash
npm run dev      # start the development server
npm run build    # create a production build
npm run preview  # preview the production build locally
```

## Project layout

```text
src/App.jsx                      main dashboard
src/components/Modals.jsx       forms for adding and editing entries
src/components/CalendarModal.jsx
                                 full history calendar
src/lib/useLailaData.js         Supabase reads and writes
src/lib/helpers.js              shared date and formatting helpers
supabase/schema.sql             database setup
```

## A quick security note

The app doesn't currently have sign-in. The database policies allow anyone
with access to the deployed app and its publishable key to read and update the
tracker data. That's workable for a private personal project, but authentication
should be added before sharing it widely.

## Adding it to a phone

Once the project is deployed over HTTPS, open it on your phone and choose **Add
to Home Screen**. The included PWA setup gives it its own icon and standalone
app window.
