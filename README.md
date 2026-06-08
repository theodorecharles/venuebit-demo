# VenueBit Demo

VenueBit is a sample event‑discovery and ticketing application built to showcase **Optimizely Feature Experimentation** in a realistic, multi‑platform product. It shows how a single set of feature flags and experiments managed in Optimizely can drive a consistent, controllable experience across a native mobile app, a web app, and backend services — all without shipping new code.

## What This Demo Shows

- **One source of truth across every platform.** The same user sees the same feature flag and experiment decisions whether they're in the iOS app, the web experience, or hitting the backend API directly.
- **Change the experience from Optimizely, live.** Flip a flag or adjust a configuration in the Optimizely UI and watch the running app respond — new themes, different homescreen layouts, different merchandising — with no code changes or redeploys.
- **Targeting and experimentation in action.** Different users are bucketed into different variations, so you can see how audiences, rollouts, and A/B tests behave in a real product.
- **Full‑stack decisions.** Feature decisions are made both in the UI and in backend services, demonstrating Optimizely across the entire stack.
- **A complete measurement loop.** Conversion events such as searches, add‑to‑cart actions, and purchases are tracked back to Optimizely so experiment results can be measured.

## How It Works

Each part of the product uses an Optimizely SDK and shares a single user identifier, so feature decisions stay consistent everywhere.

```
                    ┌─────────────────────────────┐
                    │          Optimizely         │
                    │  Feature flags & experiments │
                    └──────────────┬──────────────┘
                                   │  same flags, keyed by user ID
            ┌──────────────────────┼──────────────────────┐
            ▼                      ▼                      ▼
      ┌───────────┐          ┌───────────┐         ┌───────────────┐
      │  iOS App  │          │  Web App  │         │  Backend API  │
      │  (Swift)  │          │  (React)  │         │   (Node.js)   │
      └───────────┘          └───────────┘         └───────────────┘
```

1. A user is assigned a stable ID, which is shared across the mobile app, the web experience, and backend requests.
2. Each platform asks Optimizely for its feature flag and experiment decisions using that ID — so the same user is always bucketed into the same variations.
3. The UI and backend then render and behave according to those decisions.
4. When you publish a change in Optimizely, the running apps pick it up and update what the user sees.

> **A note on live updates:** so that changes are visible instantly during a presentation, this demo is configured to refresh flags very frequently. You don't need to set anything like that up for production — the Optimizely SDKs keep feature flags current on their own.

## Feature Flags in the Demo

The experience is driven by two flags you control from Optimizely:

- **`app_theme`** — switches the app's visual theme (for example light, dark, black, or beige) in real time.
- **`venuebit_homescreen`** — controls the homescreen layout and which content modules appear (hero carousel, categories, trending, this weekend, all events).

Because these are ordinary Optimizely flags, you can target them to audiences, roll them out gradually, or run them as experiments.

## Try It Live

A typical walkthrough:

1. Open the app and browse events on the homescreen.
2. In Optimizely, change the `app_theme` flag to a different variation — the app's theme updates live.
3. Adjust the `venuebit_homescreen` configuration — the homescreen layout changes to match.
4. Generate a new user in the app to see how different users can fall into different variations.
5. Confirm the same user sees the same experience across the web app, the mobile app, and the API.

## Running It Yourself

**Prerequisites**

- Node.js 18+
- An Optimizely Feature Experimentation account and SDK key
- The Vercel CLI for local development (`npm i -g vercel`)
- Xcode 15+ (only if you want to run the iOS app)

**Steps**

```bash
git clone https://github.com/theodorecharles/venuebit-demo.git
cd venuebit-demo
npm install

# Save your Optimizely SDK key to a local .env file
npm run config

# Start the app locally
npm run dev
```

The project runs as a web app backed by serverless API functions and deploys to Vercel. To run the native iOS app, open the `VenueBitApp` folder in Xcode, choose a simulator, and run.

## License

This project is licensed under the GNU General Public License v3.0 — see the [LICENSE](LICENSE) file for details.
