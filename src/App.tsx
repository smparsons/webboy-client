import {
    Button,
    CssBaseline,
    ThemeProvider,
    Typography,
    createTheme,
    styled,
} from "@mui/material";
import { KeyboardEvent, useEffect, useRef, useState } from "react";

import {
    BufferFileUpload,
    FileBufferObject,
} from "./components/bufferFileUpload";
import { CssGrid, GapSize, Orientation, Position } from "./components/cssGrid";
import GameScreen from "./components/gameScreen";
import init, {
    initializeEmulator,
    initializeEmulatorWithoutBios,
    pressKey,
    releaseKey,
    stepFrame,
} from "./core/webboyCore";

const AppGrid = styled(CssGrid)`
    height: 100%;
`;

const InterfaceGrid = styled(CssGrid)`
    padding: 32px;
`;

const darkTheme = createTheme({
    palette: {
        mode: "dark",
    },
});

const App = (): JSX.Element => {
    const [wasmInitialized, setWasmInitialized] = useState(false);

    const [romBuffer, setRomBuffer] = useState(null as FileBufferObject | null);
    const [biosBuffer, setBiosBuffer] = useState(
        null as FileBufferObject | null,
    );

    const [playing, setPlaying] = useState(false);

    const initalizeWasm = (): void => {
        init().then(() => {
            setWasmInitialized(true);
        });
    };

    const playGame = (): void => {
        if (biosBuffer && romBuffer) {
            initializeEmulator(romBuffer.data, biosBuffer.data);
        } else if (romBuffer) {
            initializeEmulatorWithoutBios(romBuffer.data);
        }

        setPlaying(true);
    };

    useEffect(() => {
        initalizeWasm();
    }, []);

    const renderLoop = (): void => {
        if (playing) {
            stepFrame();
            window.requestAnimationFrame(() => renderLoop());
        }
    };

    useEffect(() => {
        if (playing) {
            window.onkeydown = e => {
                pressKey(e.keyCode);
            };

            window.onkeyup = e => {
                releaseKey(e.keyCode);
            };

            renderLoop();
        }
    }, [playing]);

    return (
        <ThemeProvider theme={darkTheme}>
            <CssBaseline />
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
                            <GameScreen wasmInitialized={wasmInitialized} />
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
                            <Button
                                variant="contained"
                                onClick={playGame}
                                disabled={!romBuffer}
                            >
                                Play Game
                            </Button>
                        </>
                    ) : (
                        <div>Loading...</div>
                    )}
                </InterfaceGrid>
            </AppGrid>
        </ThemeProvider>
    );
};

export default App;
