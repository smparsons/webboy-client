# WebBoy Client

This repo represents the client side application for WebBoy. It is a React/TypeScript app, designed with Material UI.

The UI provides the ability to load a ROM, optionally load a [DMG BIOS](https://gbdev.io/pandocs/Power_Up_Sequence.html#monochrome-models-dmg0-dmg-mgb) (only tested with the DMG variant, not DMG0 or MGB), and play with the ability to pause or reset the emulator. It also provides a fullscreen mode.

## How to Run

1. Clone [webboy-core](https://github.com/smparsons/webboy-core) to your local machine. The project should live under the same directory as webboy-client.
2. Follow the directions on the webboy-core README file to compile the Rust to WebAssembly and generate the Javascript binding code.
3. When the binding code is generated, it will be added to the src/core directory.
4. Run `yarn install` to install all dependencies.
5. Run `yarn start` to run the application locally.
