import React, { useState, useCallback, useRef } from 'react';
import produce from 'immer';
import { FaTimes, FaSyncAlt, FaPlay, FaStop } from "react-icons/fa";
import './App.css';

const numRows = 30;
const numCols = 30;

const operations = [
    [0, 1], [0, -1], [1, -1], [-1, 1], [1, 1], [-1, -1], [1, 0], [-1, 0]
];

const generateEmptyGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => ({ alive: 0, color: '' })));
    }
    return rows;
};

const generateRandomGrid = () => {
    const rows = [];
    for (let i = 0; i < numRows; i++) {
        rows.push(Array.from(Array(numCols), () => ({
            alive: Math.random() > 0.7 ? 1 : 0,
            color: `#${Math.floor(Math.random() * 16777215).toString(16)}`
        })));
    }
    return rows;
};

const App = () => {
    const [grid, setGrid] = useState(() => generateRandomGrid());
    const [running, setRunning] = useState(false);
    const runningRef = useRef(running);
    runningRef.current = running;

    const runSimulation = useCallback(() => {
        if (!runningRef.current) return;

        setGrid(g => {
            return produce(g, gridCopy => {
                for (let i = 0; i < numRows; i++) {
                    for (let k = 0; k < numCols; k++) {
                        let neighbors = 0;
                        operations.forEach(([x, y]) => {
                            const newI = i + x;
                            const newK = k + y;
                            if (newI >= 0 && newI < numRows && newK >= 0 && newK < numCols) {
                                neighbors += g[newI][newK].alive;
                            }
                        });

                        if (neighbors < 2 || neighbors > 3) {
                            gridCopy[i][k].alive = 0;
                        } else if (g[i][k].alive === 0 && neighbors === 3) {
                            gridCopy[i][k].alive = 1;
                            gridCopy[i][k].color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                        }
                    }
                }
            });
        });

        setTimeout(runSimulation, 100);
    }, []);

    const clearGrid = () => {
        setGrid(generateEmptyGrid());
    };
    
    
    return (
        <>
            <div className="container">
                <div className="header">
                    <h1>Conway's Game of Life</h1>
                    <div className="buttons">
                        <button
                            onClick={() => {
                                setRunning(!running);
                                if (!running) {
                                    runningRef.current = true;
                                    runSimulation();
                                }
                            }}
                        >
                            {running ? <FaStop/> : <FaPlay/>}{running ? ' Stop' : ' Start'}
                        </button>
                        <button onClick={() => setGrid(generateRandomGrid())}>
                            <FaSyncAlt/> Reset
                        </button>
                        <button onClick={clearGrid}>
                            <FaTimes/> Clear
                        </button>
                    </div>

                </div>
                <div className="tableContaoner">
                    <div id="cellTable">
                        {grid.map((rows, i) =>
                            rows.map((col, k) => (
                                <div
                                    key={`${i}-${k}`}
                                    onClick={() => {
                                        const newGrid = produce(grid, gridCopy => {
                                            gridCopy[i][k].alive = grid[i][k].alive ? 0 : 1;
                                            gridCopy[i][k].color = `#${Math.floor(Math.random() * 16777215).toString(16)}`;
                                        });
                                        setGrid(newGrid);
                                    }}
                                    style={{
                                        width: 20,
                                        height: 20,
                                        backgroundColor: grid[i][k].alive ? grid[i][k].color : undefined,
                                        border: 'solid 1px black'
                                    }}
                                />
                            ))
                        )}
                    </div>
                </div>

            </div>

        </>
    );
};

export default App;
