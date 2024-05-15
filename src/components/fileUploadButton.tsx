import Button, { ButtonProps } from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import * as React from "react";

const HiddenFileInput = styled("input")`
    display: none;
`;

export const openFileDialog = (
    fileInputRef: React.RefObject<HTMLInputElement>,
): void => {
    const fileInputDomObject = fileInputRef.current;
    if (fileInputDomObject) {
        fileInputDomObject.click();
    }
};

export const FileUploadButton = ({
    accept,
    onFileSelect,
    ...buttonProps
}: FileUploadButtonProps): JSX.Element => {
    const fileInputRef = React.useRef(null);
    return (
        <div>
            <HiddenFileInput
                type="file"
                accept={accept}
                ref={fileInputRef}
                onChange={event => onFileSelect(event.target.files)}
            />
            <Button
                onClick={() => openFileDialog(fileInputRef)}
                type="button"
                {...buttonProps}
            />
        </div>
    );
};

export interface FileUploadButtonProps extends ButtonProps {
    accept: string;
    children: React.ReactNode;
    onFileSelect: (fileList: FileList | null) => void;
}
