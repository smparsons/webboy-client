import { Button, Typography, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import init from "./core/webboyCore";
import { FileUploadButton } from "./fileUploadButton";

const AppWrapper = styled("div")`
    display: grid;
    justify-content: center;
    height: 100%;
`;

const InterfaceWrapper = styled("div")`
    display: grid;
    grid-auto-flow: row;
    gap: 32px;
    padding: 32px;
    justify-items: start;
`;

const GAMEBOY_WIDTH = 160;
const GAMEBOY_HEIGHT = 144;

const Canvas = styled("canvas")`
    width: ${GAMEBOY_WIDTH * 2}px;
    height: ${GAMEBOY_HEIGHT * 2}px;
`;

const App = () => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [wasmInitialized, setWasmInitialized] = useState(false);

    const initializeCanvas = (): void => {
        const canvasElement = canvasRef.current;

        if (canvasElement) {
            const canvasContext = canvasElement.getContext("2d");

            const initialBuffer = [];

            for (let i = 0; i < GAMEBOY_WIDTH * GAMEBOY_HEIGHT; i++) {
                const offset = i * 4;
                initialBuffer[offset] = 0;
                initialBuffer[offset + 1] = 0;
                initialBuffer[offset + 2] = 0;
                initialBuffer[offset + 3] = 0xff;
            }

            const data = new Uint8ClampedArray(initialBuffer);
            const imageData = new ImageData(
                data,
                GAMEBOY_WIDTH,
                GAMEBOY_HEIGHT,
            );
            canvasContext?.putImageData(imageData, 0, 0);
        }
    };

    const initalizeWasm = (): void => {
        init().then(() => {
            setWasmInitialized(true);
        });
    };

    useEffect(() => {
        initalizeWasm();
    }, []);

    useEffect(() => {
        if (wasmInitialized) {
            initializeCanvas();
        }
    }, [wasmInitialized]);

    return (
        <AppWrapper>
            <InterfaceWrapper>
                {wasmInitialized ? (
                    <>
                        <div>
                            <Typography variant="h3">WebBoy</Typography>
                            <Typography variant="h6">
                                A simple online Gameboy Emulator.
                            </Typography>
                        </div>
                        <div>
                            <Canvas
                                id="screen"
                                width="160"
                                height="144"
                                ref={canvasRef}
                            />
                        </div>
                        <FileUploadButton
                            onFileSelect={files => {
                                console.log(files);
                            }}
                            variant="contained"
                            accept=".gb"
                        >
                            Load ROM
                        </FileUploadButton>
                        <FileUploadButton
                            onFileSelect={files => {
                                console.log(files);
                            }}
                            variant="contained"
                            accept=".bin"
                        >
                            Load BIOS (Optional)
                        </FileUploadButton>
                        <Button variant="contained">Play Game</Button>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </InterfaceWrapper>
        </AppWrapper>
    );
};

export default App;
