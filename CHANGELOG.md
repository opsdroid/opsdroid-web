# Opsdroid Web Release Notes

These release notes are related to updates to the `opsdroid-web` package.

## v0.2.2

- Dependencies updates
- Dropped support for node versions 12 and 14
- Allow users using Chrome to send commands using voice using the speech recognition feature.

## v0.2.1

- Fix the theme defaulting to the dark mode - the app will now look into your prefered theme
- You can now submit a profile picture to be used when you send messages to opsdroid
- Error messages can now be closed

## v0.2.0

- Rewrite the whole package using React/Typescript
  - Add settings so you can control different parts of the app
  - The app was redesigned to look more modern
  - Add the possibility to change the theme (dark/light) and accent colours (blue/green)
  - Add the possibility to set a token to be used when authenticating to opsdroid websocket
  - You can now choose your username to be sent to opsdroid
- Add messages sent history so you can use arrow up/down to cycle through sent messages
  -Expose connection errors so you know when and why the app failed to connect to Opsdroid

## v0.1.0

- Split up web app from `opsdroid-desktop`
