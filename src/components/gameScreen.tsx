import { styled } from "@mui/material";
import { useEffect, useRef } from "react";

const GAMEBOY_WIDTH = 160;
const GAMEBOY_HEIGHT = 144;

const Screen = styled("canvas")`
    width: ${GAMEBOY_WIDTH * 2}px;
    height: ${GAMEBOY_HEIGHT * 2}px;
`;

const initializeCanvas = (canvas: HTMLCanvasElement): void => {
    const canvasContext = canvas.getContext("2d");

    const initialBuffer = [];

    for (let i = 0; i < GAMEBOY_WIDTH * GAMEBOY_HEIGHT; i++) {
        const offset = i * 4;
        initialBuffer[offset] = 0;
        initialBuffer[offset + 1] = 0;
        initialBuffer[offset + 2] = 0;
        initialBuffer[offset + 3] = 0xff;
    }

    const data = new Uint8ClampedArray(initialBuffer);
    const imageData = new ImageData(data, GAMEBOY_WIDTH, GAMEBOY_HEIGHT);
    canvasContext?.putImageData(imageData, 0, 0);
};

const GameScreen = ({ wasmInitialized }: GameScreenProps): JSX.Element => {
    const canvasRef = useRef<HTMLCanvasElement>(null);

    useEffect(() => {
        if (wasmInitialized && canvasRef.current) {
            initializeCanvas(canvasRef.current);
        }
    }, [wasmInitialized]);

    return (
        <Screen width={GAMEBOY_WIDTH} height={GAMEBOY_HEIGHT} ref={canvasRef} />
    );
};

interface GameScreenProps {
    wasmInitialized: boolean;
}

export default GameScreen;
