import { Button, Typography, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import {
    BufferFileUpload,
    FileBufferObject,
} from "./components/bufferFileUpload";
import { CssGrid, GapSize, Orientation, Position } from "./components/cssGrid";
import init from "./core/webboyCore";

const AppGrid = styled(CssGrid)`
    height: 100%;
`;

const InterfaceGrid = styled(CssGrid)`
    padding: 32px;
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

    const [romBuffer, setRomBuffer] = useState(null as FileBufferObject | null);
    const [biosBuffer, setBiosBuffer] = useState(
        null as FileBufferObject | null,
    );

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
        <AppGrid justifyContent={Position.center}>
            <InterfaceGrid
                orientation={Orientation.vertical}
                gap={GapSize.extraLarge}
                justifyItems={Position.start}
            >
                {wasmInitialized ? (
                    <>
                        <div>
                            <Typography variant="h3">WebBoy</Typography>
                            <Typography variant="h6">
                                A simple online Gameboy Emulator.
                            </Typography>
                        </div>
                        <Canvas
                            id="screen"
                            width="160"
                            height="144"
                            ref={canvasRef}
                        />
                        <BufferFileUpload
                            label="Load ROM"
                            onFileSelect={setRomBuffer}
                            uploadedFile={romBuffer}
                            variant="contained"
                            accept=".gb"
                        />
                        <BufferFileUpload
                            label="Load BIOS (Optional)"
                            onFileSelect={setBiosBuffer}
                            uploadedFile={biosBuffer}
                            variant="contained"
                            accept=".bin"
                        />
                        <Button variant="contained">Play Game</Button>
                    </>
                ) : (
                    <div>Loading...</div>
                )}
            </InterfaceGrid>
        </AppGrid>
    );
};

export default App;
