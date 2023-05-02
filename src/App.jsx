import React, { useState } from 'react';
import { createRoot } from 'react-dom/client';
import ImageParser from 'react-image-parser';
import './App.css';

function defaultGrid() {
    return [
        [1],
    ];
}

const dieNumberToColor = new Map();
dieNumberToColor.set(1, '#d6d6d6');
dieNumberToColor.set(2, '#adadad');
dieNumberToColor.set(3, '#808080');
dieNumberToColor.set(4, '#575757');
dieNumberToColor.set(5, '#2e2e2e');
dieNumberToColor.set(6, '#0f0f0f');

function App() {
    const [grid, setGrid] = useState(defaultGrid());
    const [ogGrid, setogGrid] = useState(defaultGrid());
    const [inverted, setInverted] = useState(false);
    const [diceMode, setDiceMode] = useState(false);
    const [desiredSize, setDesiredSize] = useState(25);

    let imgPath = './doge.png';

    const imageParsed = (data) => {
        const pixelData = data.data;
        const { height } = data.size;
        const { width } = data.size;

        const newGrid = [];
        for (let i = 0; i < height; i++) {
            newGrid[i] = new Array(width);
        }

        for (let row = 0; row < height; row++) {
            for (let col = 0; col < width; col++) {
                const rPos = (row * width + col) * 4; // position in pixelData of the red color of the pixel at row,col
                const r = pixelData[rPos];
                const g = pixelData[rPos + 1];
                const b = pixelData[rPos + 2];
                let value = 1 - ((r + g + b) / 3 / 255); // measure from 0 to 1 of how dark the pixel is.
                if (value === 0) value = 0.001; // so that ceiling goes to 1 and not 0 for these values
                newGrid[row][col] = value;
            }
        }
        console.log(newGrid);
        // setGrid(newGrid);
        setogGrid(newGrid);
    };

    const onImageChange = (event) => {
        if (event.target.files && event.target.files[0]) {
            const newPath = URL.createObjectURL(event.target.files[0]);
            imgPath = newPath;
            const parserLocation = createRoot(document.getElementById('parserPlaceHolder'));
            parserLocation.render(<ImageParser id="Parser" img={imgPath} onImageParsed={(data) => { imageParsed(data); console.log('parsed'); }} />);
        }
    };

    const onGenerate = () => {
        const badinput = (!desiredSize);
        if (badinput) return;

        const ogWidth = ogGrid[0].length;
        const ogHeight = ogGrid.length;

        const nWidth = desiredSize;
        const nHeight = Math.floor((nWidth * ogHeight) / ogWidth);
        console.log(`The size of each pixel is ${ogWidth / nWidth} original pixels, new dimensions are ${nWidth} x ${nHeight}`);

        const newGrid = [];
        for (let i = 0; i < nHeight; i++) {
            newGrid[i] = new Array(nWidth);
        }

        for (let row = 0; row < nHeight; row++) {
            for (let col = 0; col < nWidth; col++) {
                const rowStart = Math.floor((ogHeight / nHeight) * row);
                const rowEnd = Math.floor((ogHeight / nHeight) * (row + 1));
                const colStart = Math.floor((ogWidth / nWidth) * col);
                const colEnd = Math.floor((ogWidth / nWidth) * (col + 1));

                let colorSum = 0;
                for (let i = rowStart; i < rowEnd; i++) {
                    for (let j = colStart; j < colEnd; j++) {
                        colorSum += ogGrid[i][j];
                    }
                }
                const color = colorSum / ((rowEnd - rowStart) * (colEnd - colStart));
                newGrid[row][col] = color;
            }
        }
        setGrid(newGrid);
    };

    const onInvert = () => {
        setInverted(!inverted);
    };

    const onDiceMode = () => {
        setDiceMode(!diceMode);
    };

    const sizeChange = (e) => {
        setDesiredSize(e.target.value);
    };

    return (
        <div className="App">
            <h1 style={{ margin: '0' }}>Dice Mosaic Generator</h1>
            <em>Upload an image file | Hit generate to show your mosaic | Dice mode shows dice | Invert to use black dice </em>
            <div className="buttonContainer">

                <label htmlFor="fileSelect">Upload image</label>
                <input id="fileSelect" type="file" accept="image/*" style={{ display: 'none' }} onChange={onImageChange} />
                <label htmlFor="desiredSize">Desired mosaic size (width):  <input id="desiredSize" value={desiredSize} type="number" min={1} onChange={(e) => sizeChange(e)} /></label>

                <button type="button" className="createButton" onClick={onGenerate}>Generate</button>
                <button type="button" className="solveButton" onClick={onDiceMode}>{!diceMode ? 'Dice mode' : 'No dice'}</button>
                <button type="button" className="checkButton" onClick={onInvert}>{!inverted ? 'Invert' : 'Uninvert'}</button>
                {/* <button className="resetButton" >Reset</button> */}
            </div>
            <em>Dimensions: {grid[0].length} x {grid.length} = {grid[0].length * grid.length} total dice </em>
            <div id="parserPlaceHolder" />
            <table className="diceTable" cellSpacing={0} cellPadding={0}>
                <tbody>
                    {
                        grid.map((gridRow, rIndex) => {
                            return (
                                <tr key={rIndex}>
                                    {
                                        gridRow.map((gridCell, cIndex) => {
                                            if (diceMode) {
                                                return (
                                                    <td key={rIndex + cIndex}>
                                                        {/* <img width={50} height={50} src={`dice/${!inverted ? gridCell : "" + (7 - gridCell) + "_inverted"}.jpg`} alt={`dice/${gridCell}.jpg`} /> */}
                                                        <div className="pixel" style={{ backgroundImage: `url(src/img/dice/${!inverted ? Math.ceil(gridCell * 6) : `${7 - Math.ceil(gridCell * 6)}_inverted`}.jpg)` }} />
                                                    </td>
                                                );
                                            }
                                            return (
                                                <td key={rIndex + cIndex}>
                                                    <div className="pixel" style={{ backgroundColor: dieNumberToColor.get(Math.ceil(gridCell * 6)) }} />
                                                </td>
                                            );
                                        })
                                    }
                                </tr>
                            );
                        })
                    }
                </tbody>
            </table>
        </div>
    );
}

export default App;
