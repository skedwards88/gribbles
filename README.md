# Gribbles

A jumbled word search game. Can you find all of the words that the computer finds?

[Play here](https://skedwards88.github.io/gribbles/)!

<img width="366" alt="Screenshot of the gribbles game" src="https://github.com/skedwards88/gribbles/assets/25328854/2f76f6c5-f643-455c-8807-4b9b7fbd1f8b">

## Development

To build, run `npm run build`.

To run locally with live reloading and no service worker, run `npm run dev`. (If a service worker was previously registered, you can unregister it in chrome developer tools: `Application` > `Service workers` > `Unregister`.)

To run locally and register the service worker, run `npm start`.

To deploy, push to `main` or manually trigger the `.github/workflows/deploy.yml` workflow.

Since this app doesn't have a custom domain, asset links for the Google Play Store are stored at https://github.com/skedwards88/.well-known (https://skedwards88.github.io/.well-known/assetlinks.json).
