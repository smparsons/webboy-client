import { Button, Typography, styled } from "@mui/material";
import { useEffect, useRef, useState } from "react";

import {
    BufferFileUpload,
    FileBufferObject,
} from "./components/bufferFileUpload";
import { CssGrid, GapSize, Orientation, Position } from "./components/cssGrid";
import GameScreen from "./components/gameScreen";
import init from "./core/webboyCore";

const AppGrid = styled(CssGrid)`
    height: 100%;
`;

const InterfaceGrid = styled(CssGrid)`
    padding: 32px;
`;

const App = () => {
    const [wasmInitialized, setWasmInitialized] = useState(false);

    const [romBuffer, setRomBuffer] = useState(null as FileBufferObject | null);
    const [biosBuffer, setBiosBuffer] = useState(
        null as FileBufferObject | null,
    );

    const initalizeWasm = (): void => {
        init().then(() => {
            setWasmInitialized(true);
        });
    };

    useEffect(() => {
        initalizeWasm();
    }, []);

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
