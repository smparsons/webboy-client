import { styled } from "@mui/material";
import Button from "@mui/material/Button";

import "./App.css";
import logo from "./logo.svg";

const MyParagraph = styled("p")`
    background: green;
    width: 1000px;
`;

function App() {
    return (
        <div className="App">
            <header className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <p>
                    Edit <code>src/App.tsx</code> and save to reload.
                </p>
                <p>Hello World</p>
                <a
                    className="App-link"
                    href="https://reactjs.org"
                    target="_blank"
                    rel="noopener noreferrer"
                >
                    Learn React
                </a>
                <MyParagraph>
                    <Button variant="contained" type="submit" color="primary">
                        My Button
                    </Button>
                </MyParagraph>
            </header>
        </div>
    );
}

export default App;
