import FileUploadIcon from "@mui/icons-material/FileUpload";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import PauseIcon from "@mui/icons-material/Pause";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import RefreshIcon from "@mui/icons-material/Refresh";
import {
    Button,
    CssBaseline,
    ThemeProvider,
    Typography,
    createTheme,
    styled,
} from "@mui/material";
import { useEffect, useRef, useState } from "react";

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
    resetEmulator,
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

const keys = [
    "ArrowDown",
    "ArrowUp",
    "ArrowLeft",
    "ArrowRight",
    "Enter",
    "Space",
    "KeyX",
    "KeyZ",
];

const App = (): JSX.Element => {
    const [wasmInitialized, setWasmInitialized] = useState(false);

    const [romBuffer, setRomBuffer] = useState(null as FileBufferObject | null);
    const [biosBuffer, setBiosBuffer] = useState(
        null as FileBufferObject | null,
    );

    const [playing, setPlaying] = useState(false);
    const [paused, setPaused] = useState(false);

    const canvasRef = useRef<HTMLCanvasElement | null>(null);
    const animationFrameIdRef = useRef<number | null>(null);

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

    const renderLoop = (): void => {
        if (playing) {
            stepFrame();
            animationFrameIdRef.current = window.requestAnimationFrame(() =>
                renderLoop(),
            );
        }
    };

    const stopRenderLoop = (): void => {
        if (animationFrameIdRef.current) {
            window.cancelAnimationFrame(animationFrameIdRef.current);
        }
    };

    const resetGame = (): void => {
        setPlaying(false);
        setPaused(false);
        resetEmulator();
        stopRenderLoop();
        setRomBuffer(null);
        setBiosBuffer(null);
    };

    const pauseGame = (): void => {
        setPaused(true);
        setPlaying(false);
        stopRenderLoop();
    };

    const resumeGame = (): void => {
        setPaused(false);
        setPlaying(true);
    };

    const handleKeyDown = (event: KeyboardEvent): void => {
        if (keys.includes(event.code)) {
            event.preventDefault();
            pressKey(event.code);
        }
    };

    const handleKeyUp = (event: KeyboardEvent): void => {
        if (keys.includes(event.code)) {
            event.preventDefault();
            releaseKey(event.code);
        }
    };

    useEffect(() => {
        initalizeWasm();
    }, []);

    useEffect(() => {
        if (playing) {
            renderLoop();

            window.addEventListener("keydown", handleKeyDown);
            window.addEventListener("keyup", handleKeyUp);
        }

        return () => {
            if (playing) {
                window.removeEventListener("keydown", handleKeyDown);
                window.removeEventListener("keyup", handleKeyUp);
            }
        };
    }, [playing]);

    const setFullscreen = (): void => {
        if (canvasRef.current) {
            canvasRef.current.requestFullscreen();
        }
    };

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
                            <GameScreen
                                wasmInitialized={wasmInitialized}
                                playing={playing}
                                paused={paused}
                                ref={canvasRef}
                            />
                            <BufferFileUpload
                                label="Load ROM"
                                onFileSelect={setRomBuffer}
                                uploadedFile={romBuffer}
                                variant="contained"
                                accept=".gb"
                                startIcon={<FileUploadIcon />}
                            />
                            <BufferFileUpload
                                label="Load BIOS (Optional)"
                                onFileSelect={setBiosBuffer}
                                uploadedFile={biosBuffer}
                                variant="contained"
                                accept=".bin"
                                startIcon={<FileUploadIcon />}
                            />
                            <CssGrid
                                orientation={Orientation.horizontal}
                                gap={GapSize.medium}
                            >
                                {!playing || paused ? (
                                    <Button
                                        variant="contained"
                                        disabled={!romBuffer}
                                        onClick={paused ? resumeGame : playGame}
                                        startIcon={<PlayArrowIcon />}
                                    >
                                        {paused ? "Resume" : "Play"}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="contained"
                                        onClick={pauseGame}
                                        startIcon={<PauseIcon />}
                                    >
                                        Pause
                                    </Button>
                                )}

                                <Button
                                    variant="contained"
                                    onClick={resetGame}
                                    disabled={!playing && !paused}
                                    startIcon={<RefreshIcon />}
                                >
                                    Reset
                                </Button>
                                <Button
                                    variant="contained"
                                    onClick={setFullscreen}
                                    disabled={!playing && !paused}
                                    startIcon={<FullscreenIcon />}
                                >
                                    Fullscreen
                                </Button>
                            </CssGrid>
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
