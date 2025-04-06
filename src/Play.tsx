import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router";
import { GameResult } from "./GameResults";

const whildCardHands = [
    3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
];

// -1 indicates never edited, show dash, can -1 back to dash too...
const defaultScores = [-1, -1, -1, -1, -1, -1, -1, -1, -1, -1, -1];

interface PlayProps {
    addNewGameResult: (r: GameResult) => void;
    setTitle: (t: string) => void;
    currentPlayers: string[]
};

const getDisplayWildcard = (x: number): string => (
    x < 11
        ? x.toString()
        : x === 11
            ? "J"
            : x === 12
                ? "Q"
                : "K"
);

export const Play: React.FC<PlayProps> = ({
    addNewGameResult
    , setTitle
    , currentPlayers
}) => {

    useEffect(
        () => setTitle("Play")
        , []
    );

    const nav = useNavigate();

    const [startTimestamp] = useState(
        new Date().toISOString()
    );

    const [berilEasterEgg, setBerilEasterEgg] = useState(false);

    const editRowDialogRef = useRef<HTMLDialogElement | null>(null);
    const [editingRow, setEditingRow] = useState(0);
    const [editingPlayerIndex, setEditingPlayer] = useState(0);

    const [orderedPlayers, setOrderedPlayers] = useState(currentPlayers);
    const changePlayerOrderDialogRef = useRef<HTMLDialogElement | null>(null);
    const [changePlayerSelectedPlayerIndex, setChangePlayerSelectedPlayerIndex] = useState(0);

    // Use a Map for local state, but spread into array of arrays for
    // GameResult, i-o-g...
    const [scores, setScores] = useState(
        orderedPlayers.reduce(
            (acc, x) => acc.set(
                x
                , defaultScores
            )
            , new Map<string, number[]>()
        )
    );

    // i-o-g... Fixed array of players that go out each turn... Maybe handles
    // scoring turns out of order easier/possible since I don't have rules for turn
    // scoring order...
    const [goOuts, setGoOuts] = useState(["", "", "", "", "", "", "", "", "", "", ""]);

    const editRow = (wildCard: number) => {
        setEditingRow(wildCard);
        setEditingPlayer(0);
        editRowDialogRef.current?.showModal();
    };

    const getDisplayScore = (player: string, wildCard: number) => {

        const playerScores = scores.get(player) ?? defaultScores;

        return playerScores[wildCard - 3] === -1
            ? "-"
            : playerScores[wildCard - 3] > 0
                ? playerScores[wildCard - 3]
                : berilEasterEgg
                    ? "❤️"
                    : "0"
    };

    const updateScoreInScoresState = (
        player: string
        , wildCard: number
        , delta: number
    ) => {

        const currentScore = (scores.get(player) ?? defaultScores)[wildCard - 3];

        // Handle -1 stuffy-stuff...
        const newScore = delta === 0
            ? 0
            : currentScore === -1 && delta > 0
                ? currentScore + 1 + delta
                : currentScore === -1 && delta < 0
                    ? -1
                    : currentScore + delta

        setScores(
            new Map(
                scores.set(
                    player
                    , (scores.get(player) ?? defaultScores).map(
                        (x, i) => wildCard - 3 === i
                            ? newScore < 0
                                ? Math.max(newScore, -1)
                                : newScore
                            : x
                    )
                )
            )
        );
    };

    const getRunningTotal = (player: string, wildCard: number) => {

        const scoresForPlayer = scores.get(player) ?? defaultScores;

        const runningTotal = scoresForPlayer
            // Ooh, replace -1's with zeros before calc RT, i-o-g...
            .map(
                x => x === -1
                    ? 0
                    : x
            )
            .reduce(
                (acc, x, i) => i <= (wildCard - 3)
                    ? acc + x
                    : acc
                , 0
            );

        return runningTotal;
    };

    const getPlayersWithLowestScore = (): string[] => {

        // Tuple [string, number] incoming...
        const playersWithTheirTotals: [string, number][] = orderedPlayers.map(
            x => [
                x
                , getRunningTotal(
                    x
                    , 13 // Last hand, hardcoded, but meh, should work forever : - O
                )
            ]
        );

        const lowestScore = Math.min(
            ...playersWithTheirTotals.map(
                x => x[1]
            )
        );

        return playersWithTheirTotals
            .filter(
                x => x[1] === lowestScore
            )
            .map(
                x => x[0]
            )
            ;
    };

    const possibleWinners = getPlayersWithLowestScore();

    return (
        <>
            <p>
                Press
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-5 inline mx-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                </svg>
                buttons (below) to enter scores for each hand...
            </p>
            <div className="overflow-x-auto mt-4">
                <table className="table table-zebra table-lg table-pin-rows table-pin-cols">
                    <thead>
                        <tr>
                            <th
                                className="font-light"
                            >
                                Wild
                            </th>
                            {
                                orderedPlayers.map(
                                    x => (
                                        <td
                                            key={x}
                                            onClick={
                                                () => x === "Beril"
                                                    ? setBerilEasterEgg(!berilEasterEgg)
                                                    : console.log("You're not Beril : - O")
                                            }
                                        >
                                            {x}
                                        </td>
                                    )
                                )
                            }
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>
                                <div className="grid grid-cols-2 gap-4 mr-6">
                                    <span>
                                    </span>
                                    <button
                                        className="btn btn-xs btn-dash ml-4 w-8"
                                    onClick={
                                        () => changePlayerOrderDialogRef.current?.showModal()
                                    }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                        </svg>
                                    </button>
                                </div>
                            </th>
                            <td 
                                className="text-nowrap text-xs font-light"
                                colSpan={orderedPlayers.length}
                            >
                                Change player order
                            </td>
                        </tr>
                        {
                            whildCardHands.map(
                                x => (
                                    <tr
                                        key={x}
                                        className="text-left"
                                    >
                                        <th
                                            className="font-normal text-sm w-8"
                                        >
                                            <div className="grid grid-cols-2 gap-4 mr-6">
                                                <span>
                                                    {
                                                        getDisplayWildcard(x)
                                                    }
                                                </span>
                                                <button
                                                    className="btn btn-xs btn-dash ml-4 w-8"
                                                    onClick={
                                                        () => editRow(x)
                                                    }
                                                >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.0} stroke="currentColor" className="size-4">
                                                        <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </th>
                                        {
                                            orderedPlayers.map(
                                                y => (
                                                    <td
                                                        key={y}
                                                        className={`text-nowrap ${goOuts[x - 3] === y ? "text-success" : ""}`}
                                                    >
                                                        {
                                                            getDisplayScore(y, x)
                                                        }
                                                        <span
                                                            className="text-xs text-base-content/50 ml-1"
                                                        >
                                                            / {getRunningTotal(y, x)}
                                                        </span>
                                                    </td>
                                                )
                                            )
                                        }
                                    </tr>
                                )
                            )
                        }
                    </tbody>
                </table>
            </div>
            {
                possibleWinners.length > 1 && (
                    <p
                        className="mt-4"
                    >
                        Some players are tied, cut cards, rock-paper-scissors, somehow choose a single winner ! ! !
                    </p>
                )
            }
            <div
                className="grid grid-cols-2 gap-2 mt-4"
            >
                {
                    possibleWinners.map(
                        x => (
                            <button
                                key={x}
                                className="btn btn-active btn-secondary btn-lg truncate"
                                onClick={
                                    () => {
                                        addNewGameResult({
                                            winner: x
                                            , players: orderedPlayers
                                            , start: startTimestamp
                                            , end: new Date().toISOString()
                                            , scores: [
                                                ...scores
                                            ]
                                            , goOuts: goOuts
                                        });
                                        nav(-2);
                                    }
                                }
                            >
                                {
                                    `${x} Won`
                                }
                            </button>
                        )
                    )
                }
                <button
                    className="btn btn-outline btn-secondary btn-lg"
                    onClick={
                        () => nav(-2)
                    }
                >
                    Quit
                </button>
            </div>
            <dialog
                ref={editRowDialogRef}
                className="modal"
            >
                <div className="modal-backdrop bg-base-300"></div>
                <div className="modal-box">
                    <form method="dialog">
                        <button className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">✕</button>
                    </form>
                    <h3 className="text-lg font-bold mb-4">
                        Editing scores for <span className="text-secondary">{getDisplayWildcard(editingRow)}'s</span> wild
                    </h3>
                    
                    <div className="flex flex-col gap-4">
                        {/* Player selector with improved styling */}
                        <div className="flex items-center justify-between bg-base-200 p-3 rounded-lg">
                            <button
                                className="btn btn-circle btn-sm"
                                onClick={() => setEditingPlayer(
                                    editingPlayerIndex > 0
                                        ? editingPlayerIndex - 1
                                        : orderedPlayers.length - 1
                                )}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
                                </svg>
                            </button>
                            
                            <div className="text-center">
                                <div className="text-xl font-bold">{orderedPlayers[editingPlayerIndex]}</div>
                                <div className="text-sm opacity-70">
                                    Current score: <span className="font-semibold text-lg">
                                        {getDisplayScore(orderedPlayers[editingPlayerIndex], editingRow)}
                                    </span>
                                </div>
                            </div>
                            
                            <button
                                className="btn btn-circle btn-sm"
                                onClick={() => setEditingPlayer(
                                    editingPlayerIndex < orderedPlayers.length - 1
                                        ? editingPlayerIndex + 1
                                        : 0
                                )}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                                </svg>
                            </button>
                        </div>
                        
                        {/* "Out" button moved above score controls */}
                        <div className="flex justify-center">
                            <button
                                className={`btn ${orderedPlayers[editingPlayerIndex] === goOuts[editingRow - 3] ? 'btn-success' : 'btn-outline btn-success'} w-full`}
                                onClick={() => {
                                    updateScoreInScoresState(orderedPlayers[editingPlayerIndex], editingRow, 0);
                                    setGoOuts(
                                        goOuts.map(
                                            (x, i) => i === (editingRow - 3)
                                                ? orderedPlayers[editingPlayerIndex]
                                                : x
                                        )
                                    );
                                }}
                            >
                                {orderedPlayers[editingPlayerIndex] === goOuts[editingRow - 3] 
                                    ? <><span className="mr-2">✓</span> Player went out</>
                                    : "Mark as going out (0 points)"}
                            </button>
                        </div>
                        
                        {/* Score adjustment with 3 sections */}
                        <div className="grid grid-cols-3 gap-2">
                            {/* Decrease score section */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold opacity-70 text-center">Decrease</span>
                                <button
                                    className="btn btn-outline btn-error"
                                    onClick={() => updateScoreInScoresState(orderedPlayers[editingPlayerIndex], editingRow, -5)}
                                >
                                    -5
                                </button>
                                <button
                                    className="btn btn-outline btn-error"
                                    onClick={() => updateScoreInScoresState(orderedPlayers[editingPlayerIndex], editingRow, -1)}
                                >
                                    -1
                                </button>
                            </div>
                            
                            {/* Reset/zero section */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold opacity-70 text-center">Reset</span>
                                <button
                                    className="btn btn-outline btn-neutral"
                                    onClick={() => updateScoreInScoresState(orderedPlayers[editingPlayerIndex], editingRow, -999)}
                                >
                                    Clear (-)
                                </button>
                                <button
                                    className="btn btn-success"
                                    onClick={() => updateScoreInScoresState(orderedPlayers[editingPlayerIndex], editingRow, 0)}
                                >
                                    Zero (0)
                                </button>
                            </div>
                            
                            {/* Increase score section */}
                            <div className="flex flex-col gap-2">
                                <span className="text-sm font-semibold opacity-70 text-center">Increase</span>
                                <div className="grid grid-cols-2 gap-2">
                                    <button
                                        className="btn btn-outline btn-error"
                                        onClick={() => updateScoreInScoresState(orderedPlayers[editingPlayerIndex], editingRow, +1)}
                                    >
                                        +1
                                    </button>
                                    <button
                                        className="btn btn-outline btn-error"
                                        onClick={() => updateScoreInScoresState(orderedPlayers[editingPlayerIndex], editingRow, +5)}
                                    >
                                        +5
                                    </button>
                                </div>
                                <button
                                    className="btn btn-outline btn-error"
                                    onClick={() => updateScoreInScoresState(orderedPlayers[editingPlayerIndex], editingRow, +10)}
                                >
                                    +10
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
            <dialog
                ref={changePlayerOrderDialogRef}
                className="modal"
            >
                <div className="modal-backdrop bg-base-300"></div>
                <div
                    className="modal-box"
                >
                    <form
                        method="dialog"
                    >
                        <button
                            className="btn btn-lg btn-circle btn-ghost absolute right-2 top-2">
                            ✕
                        </button>
                    </form>
                    <h3
                        className="text-lg"
                    >
                        Change player order
                    </h3>
                    <div className="flex flex-col bg-info123 text-left">
                        <div
                            className="my-4"
                        >
                            {
                                orderedPlayers.map(
                                    (x, index) => (
                                        <label
                                            key={x}
                                            className="mr-4 text-nowrap"
                                        >
                                            <input 
                                                type="radio" 
                                                name="order-players" 
                                                className="radio mr-2 my-2"
                                                checked={index === changePlayerSelectedPlayerIndex}
                                                onChange={() => setChangePlayerSelectedPlayerIndex(index)}
                                            />
                                            {x}
                                        </label>
                                    )
                                )   
                            }
                        </div>
                        <div className="flex w-full">
                            <div className="join">
                                <button
                                    className="btn btn-sm btn-outline join-item"
                                    onClick={() => {
                                        if (changePlayerSelectedPlayerIndex > 0) {
                                            const newOrderedPlayers = [...orderedPlayers];
                                            // Swap with left neighbor
                                            [
                                                newOrderedPlayers[changePlayerSelectedPlayerIndex],
                                                newOrderedPlayers[changePlayerSelectedPlayerIndex - 1]
                                            ] = [
                                                newOrderedPlayers[changePlayerSelectedPlayerIndex - 1],
                                                newOrderedPlayers[changePlayerSelectedPlayerIndex]
                                            ];
                                            setOrderedPlayers(newOrderedPlayers);
                                            setChangePlayerSelectedPlayerIndex(changePlayerSelectedPlayerIndex - 1);
                                        }
                                    }}
                                >
                                    Move Left
                                </button>
                                <button
                                    className="btn btn-sm btn-outline join-item"
                                    onClick={() => {
                                        if (changePlayerSelectedPlayerIndex < orderedPlayers.length - 1) {
                                            const newOrderedPlayers = [...orderedPlayers];
                                            // Swap with right neighbor
                                            [
                                                newOrderedPlayers[changePlayerSelectedPlayerIndex],
                                                newOrderedPlayers[changePlayerSelectedPlayerIndex + 1]
                                            ] = [
                                                newOrderedPlayers[changePlayerSelectedPlayerIndex + 1],
                                                newOrderedPlayers[changePlayerSelectedPlayerIndex]
                                            ];
                                            setOrderedPlayers(newOrderedPlayers);
                                            setChangePlayerSelectedPlayerIndex(changePlayerSelectedPlayerIndex + 1);
                                        }
                                    }}
                                >
                                    Move Right
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </dialog>
        </>
    );
};