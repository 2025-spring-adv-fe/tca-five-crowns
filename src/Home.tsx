import { useNavigate } from "react-router";
import { GameResult, GeneralFacts, LowestScoreAllTimeData, RankedGoOutsLeaderboardEntry, RankedHighestSingleHandScoreLeaderboardEntry, RankedLeaderboardEntry, validateGameResult } from "./GameResults";
import { useEffect, useRef, useState } from "react";
import copyTextToClipboard from 'copy-text-to-clipboard';
import { Bar, Line } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    LineElement,
    BarElement,
    CategoryScale,
    LinearScale,
    TimeScale,
    PointElement,
    Tooltip,
    Legend,
} from "chart.js";
import "chartjs-adapter-date-fns";

ChartJS.register(LineElement, BarElement, CategoryScale, TimeScale, LinearScale, PointElement, Tooltip, Legend);

export const AppTitle = "5 👑 Companion";

interface HomeProps {
    leaderboardData: RankedLeaderboardEntry[];
    setTitle: (t: string) => void;
    generalFacts: GeneralFacts;
    goOutsLeaderboardData: RankedGoOutsLeaderboardEntry[];
    highestSingleHandScoreLeaderboardData: RankedHighestSingleHandScoreLeaderboardEntry[]; // Updated name
    gameDurationData: any; // : - (
    gamesByMonthData: Array<[string, number]>;
    allGames: { date: string, players: string, result: GameResult }[];
    addNewGameResult: (r: GameResult, e: string) => void;
    emailForSaving: string;
    lowestScoreAllTimeData: LowestScoreAllTimeData;
    gamesPlayedTrendChartData: any;
    scoreDistributionData: any;
    avgScoreLeaderboardData: any;
};

export const Home: React.FC<HomeProps> = ({
    leaderboardData
    , setTitle
    , generalFacts
    , goOutsLeaderboardData
    , highestSingleHandScoreLeaderboardData // Updated name
    , gameDurationData
    // , gamesByMonthData
    , allGames
    , addNewGameResult
    , emailForSaving
    , lowestScoreAllTimeData
    , gamesPlayedTrendChartData
    , scoreDistributionData
    , avgScoreLeaderboardData
}) => {

    const [showCopyPasteButtons, setShowCopyPasteButtons] = useState(false);
    const copiedModalRef = useRef<HTMLDialogElement | null>(null);
    const pasteModalRef = useRef<HTMLDialogElement | null>(null);
    const [clickedPlayer, setClickedPlayer] = useState<string | null>(null);

    useEffect(
        () => setTitle(AppTitle)
        , []
    );

    // Use a react hook for button navigation...
    const nav = useNavigate();

    return (
        <>
            <button
                className="btn btn-active btn-secondary btn-lg mt-4 w-full lg:w-64 text-nowrap overflow-x-hidden"
                onClick={
                    () => nav("/setup")
                }
            >
                Play Five Crowns
            </button>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        General
                    </h2>
                    <div
                        className="overflow-x-auto"
                    >
                        <table
                            className="table"
                        >
                            <tbody>
                                <tr>
                                    <td>
                                        Last Played
                                    </td>
                                    <th>
                                        {generalFacts.lastPlayed}
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        Total Games
                                    </td>
                                    <th>
                                        {generalFacts.totalGames}
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        Shortest Game
                                    </td>
                                    <th>
                                        {generalFacts.shortestGame}
                                    </th>
                                </tr>
                                <tr>
                                    <td>
                                        Longest Game
                                    </td>
                                    <th>
                                        {generalFacts.longestGame}
                                    </th>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        Games Played Trend
                    </h2>
                    <div
                        className="overflow-x-auto"
                    >
                        {
                            gamesPlayedTrendChartData.mainData && gamesPlayedTrendChartData.mainData.length > 0
                                ? (
                                    <div
                                        className="overflow-x-auto"
                                    >
                                        <div style={{ height: '300px' }}>
                                            <Line
                                                className="p-1"
                                                data={
                                                {
                                                    datasets: [
                                                        {
                                                            data: gamesPlayedTrendChartData.gapHighlight,
                                                            borderColor: "#505050",
                                                            backgroundColor: "transparent",
                                                            borderDash: [10, 5],
                                                            borderWidth: 10,
                                                            pointRadius: 0,
                                                            pointHitRadius: 20,
                                                            showLine: true,
                                                            order: 2,
                                                        },
                                                        {
                                                            // data: [
                                                            //     { x: "2025-05-04", y: 0 },
                                                            //     // { x: "2025-05-05", y: 1 },
                                                            //     { x: "2025-05-05", y: 2 },
                                                            //     { x: "2025-05-10", y: 3 },

                                                            //     { x: "2025-05-11", y: 4 },
                                                            //     { x: "2025-06-01", y: 5 },
                                                            //     { x: "2025-06-11", y: 5 },

                                                            //     // { x: "2027-05-10", y: 4 },
                                                            //     // { x: "2028-06-01", y: 5 },
                                                            //     // { x: "2028-06-02", y: 7 },

                                                            // ],
                                                            data: gamesPlayedTrendChartData.mainData,
                                                            borderColor: "#de2a8a",
                                                            backgroundColor: "#fff",
                                                            pointRadius: 6,
                                                            order: 1,
                                                        },
                                                    ],
                                                }
                                            }
                                            options={
                                                {
                                                    plugins: {
                                                        legend: {
                                                            display: false
                                                        },
                                                        tooltip: {
                                                            filter: (tooltipItem) => {
                                                                // Hide tooltip for gap highlight dataset (index 0)
                                                                return tooltipItem.datasetIndex !== 0;
                                                            },
                                                            callbacks: {
                                                                title: (tooltipItems) => {
                                                                    const item = tooltipItems[0];
                                                                    const date = new Date(item.parsed.x);
                                                                    return date.toLocaleDateString();
                                                                },
                                                                label: (tooltipItem) => {
                                                                    return `${tooltipItem.parsed.y} total games`;
                                                                }
                                                            },
                                                        displayColors: false, // This removes the colored box
                                                        },
                                                    },
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        x: {
                                                            type: "time",
                                                            time: {
                                                                unit: "day", // Options: 'minute', 'hour', 'day', 'week', etc.
                                                                displayFormats: {
                                                                    month: "M/d/yy",
                                                                    week: "M/d/yy",
                                                                    day: " "
                                                                }
                                                            },
                                                            title: {
                                                                display: true,
                                                                text: "Tap Points for Details",
                                                            },
                                                            display: true,
                                                            grid: {
                                                                display: false
                                                            }
                                                        },
                                                        y: {
                                                            ticks: {
                                                                stepSize: 1,
                                                            },
                                                            min: 0,
                                                            // max: 10,
                                                            title: {
                                                                display: false,
                                                                text: "# Played"
                                                            },
                                                        },
                                                    },
                                                }
                                            }
                                        />
                                        </div>
                                        {gamesPlayedTrendChartData.gapDuration && (
                                            <div className="flex items-center justify-center mt-2 mb-3 text-sm">
                                                <svg width="40" height="10" className="mr-2">
                                                    <line x1="0" y1="5" x2="40" y2="5" stroke="#505050" strokeWidth="10" strokeDasharray="10,5" />
                                                </svg>
                                                <span className="text-sm font-semibold">Longest Gap {gamesPlayedTrendChartData.gapDuration}</span>
                                            </div>
                                        )}
                                    </div>
                                )
                                : (
                                    <p
                                        className="mx-3 mb-3 font-extralight"
                                    >
                                        N/A
                                    </p>
                                )
                        }
                    </div>
                </div>
            </div>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        W/L Leaderboard
                    </h2>
                    {
                        leaderboardData.length > 0
                            ? (
                                <div
                                    className="overflow-x-auto"
                                >
                                    <table
                                        className="table"
                                    >
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>
                                                    W
                                                </th>
                                                <th>
                                                    L
                                                </th>
                                                <th>
                                                    AVG
                                                </th>
                                                <th>
                                                    PLAYER
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                leaderboardData.map(
                                                    x => (
                                                        <tr
                                                            key={x.player}
                                                        >
                                                            <td
                                                                className="text-xs font-bold"
                                                            >
                                                                {x.rank}
                                                            </td>
                                                            <td>
                                                                {x.wins}
                                                            </td>
                                                            <td>
                                                                {x.losses}
                                                            </td>
                                                            <td>
                                                                {x.average}
                                                            </td>
                                                            <td
                                                                className="cursor-pointer relative"
                                                                onClick={() => setClickedPlayer(clickedPlayer === x.player ? null : x.player)}
                                                            >
                                                                {x.player}
                                                                {clickedPlayer === x.player && (
                                                                    <div className="absolute z-10 bg-base-300 text-base-content px-2 py-1 rounded shadow-lg text-sm whitespace-nowrap right-full mr-2 top-0">
                                                                        {x.totalPlayerPoints}
                                                                    </div>
                                                                )}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                            : (
                                <p
                                    className="mx-3 mb-3 font-extralight"
                                >
                                    N/A
                                </p>
                            )
                    }
                </div>
            </div>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        Avg Score Leaderboard
                    </h2>
                    {
                        avgScoreLeaderboardData.length > 0
                            ? (
                                <div
                                    className="overflow-x-auto"
                                >
                                    <table
                                        className="table"
                                    >
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>
                                                    PLAYER
                                                </th>
                                                <th>
                                                    AVG SCORE / GAME
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                avgScoreLeaderboardData.map(
                                                    (x: any, i: number) => (
                                                        <tr
                                                            key={x.player}
                                                        >
                                                            <td
                                                                className="text-xs font-bold"
                                                            >
                                                                {i + 1}
                                                            </td>
                                                            <td>
                                                                {x.player}
                                                            </td>
                                                            <td>
                                                                {x.avg}
                                                                <span className="text-xs font-light ml-4 text-nowrap">
                                                                    {x.totalPoints} pts in {x.totalGames} {`game${x.totalGames === 1 ? "" : "s"}`}
                                                                </span>
                                                            </td>                                                            
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                            : (
                                <p
                                    className="mx-3 mb-3 font-extralight"
                                >
                                    N/A
                                </p>
                            )
                    }
                </div>
            </div>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        "Go Outs" Leaderboard
                    </h2>
                    {
                        goOutsLeaderboardData.length > 0
                            ? (
                                <div
                                    className="overflow-x-auto"
                                >
                                    <table
                                        className="table"
                                    >
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>
                                                    PLAYER
                                                </th>
                                                <th>
                                                    AVG 'GO OUTS' PER GAME
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                goOutsLeaderboardData.map(
                                                    x => (
                                                        <tr
                                                            key={x.player}
                                                        >
                                                            <td
                                                                className="text-xs font-bold"
                                                            >
                                                                {x.rank}
                                                            </td>
                                                            <td>
                                                                {x.player}
                                                            </td>
                                                            <td>
                                                                {x.goOutsPerGame}
                                                                <span className="text-xs font-light ml-4 text-nowrap">
                                                                    {x.totalGoOuts} in {x.gamesPlayed} {`game${x.gamesPlayed === 1 ? "" : "s"}`}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                            : (
                                <p
                                    className="mx-3 mb-3 font-extralight"
                                >
                                    N/A
                                </p>
                            )
                    }
                </div>
            </div>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        Game Durations
                    </h2>
                    {
                        gameDurationData.length > 0
                            ? (
                                <div
                                    className="overflow-x-auto"
                                >
                                    <table
                                        className="table"
                                    >
                                        <thead>
                                            <tr>
                                                <th>
                                                    PLAYERS
                                                </th>
                                                <th>
                                                    AVG DURATION
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                gameDurationData.map(
                                                    (x: any) => (
                                                        <tr
                                                            key={x.numberOfPlayers}
                                                        >
                                                            <td>
                                                                {x.numberOfPlayers}
                                                            </td>
                                                            <td>
                                                                {x.avgGameDuration}
                                                                <span className="text-xs font-light ml-4 text-nowrap">
                                                                    {x.gameCount} {`game${x.gameCount === 1 ? "" : "s"}`}
                                                                </span>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                            : (
                                <p
                                    className="mx-3 mb-3 font-extralight"
                                >
                                    N/A
                                </p>
                            )
                    }
                </div>
            </div>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        Worst Hands
                    </h2>
                    {
                        highestSingleHandScoreLeaderboardData.length > 0
                            ? (
                                <div
                                    className="overflow-x-auto"
                                >
                                    <table
                                        className="table"
                                    >
                                        <thead>
                                            <tr>
                                                <th></th>
                                                <th>
                                                    PLAYER
                                                </th>
                                                <th>
                                                    SCORE
                                                </th>
                                                <th>
                                                    WILD CARD(S)
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                highestSingleHandScoreLeaderboardData.map(
                                                    x => (
                                                        <tr
                                                            key={x.player}
                                                        >
                                                            <td
                                                                className="text-xs font-bold"
                                                            >
                                                                {x.rank}
                                                            </td>
                                                            <td>
                                                                {x.player}
                                                            </td>
                                                            <td>
                                                                {x.highestSingleHandScore}
                                                            </td>
                                                            <td>
                                                                {x.wildCards.join(", ")}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                            : (
                                <p
                                    className="mx-3 mb-3 font-extralight"
                                >
                                    N/A
                                </p>
                            )
                    }
                </div>
            </div>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        Lowest Score (All Time)
                    </h2>
                    {
                        lowestScoreAllTimeData.playersWithDates.length > 0
                            ? (
                                <div>
                                    <h3
                                        className="text-4xl ml-3 mb-3 font-bold"
                                    >
                                        {
                                            lowestScoreAllTimeData.score
                                        }
                                    </h3>
                                    <p
                                        className="text-lg ml-3 mb-3"
                                    >
                                        {
                                            lowestScoreAllTimeData.playersWithDates.join(', ')
                                        }
                                    </p>
                                </div>
                            )
                            : (
                                <p
                                    className="mx-3 mb-3 font-extralight"
                                >
                                    N/A
                                </p>
                            )
                    }
                </div>
            </div>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        Score Distribution
                    </h2>
                    <div
                        className="overflow-x-auto"
                    >
                        {
                            scoreDistributionData.length > 0
                                ? (
                                    <div
                                        className="overflow-x-auto"
                                    >
                                        <Bar
                                            className="p-1"
                                            data={
                                                {
                                                    datasets: [
                                                        {
                                                            data: scoreDistributionData,
                                                            backgroundColor: "#de2a8a",
                                                            borderColor: "#de2a8a",
                                                            borderWidth: 1,
                                                        },
                                                    ],
                                                }
                                            }
                                            options={
                                                {
                                                    plugins: {
                                                        legend: {
                                                            display: false
                                                        },
                                                        tooltip: {
                                                            callbacks: {
                                                                label: (tooltipItem) => {
                                                                    return `${tooltipItem.parsed.y} player${tooltipItem.parsed.y !== 1 ? 's' : ''}`;
                                                                }
                                                            },
                                                        displayColors: false, // This removes the colored box
                                                        },
                                                    },
                                                    responsive: true,
                                                    maintainAspectRatio: false,
                                                    scales: {
                                                        x: {
                                                            title: {
                                                                display: true,
                                                                text: "Score Ranges",
                                                            },
                                                            display: true,
                                                            grid: {
                                                                display: false
                                                            }
                                                        },
                                                        y: {
                                                            ticks: {
                                                                stepSize: 1,
                                                            },
                                                            min: 0,
                                                            title: {
                                                                display: false,
                                                                text: "Number of Games"
                                                            },
                                                        },
                                                    },
                                                }
                                            }
                                        />
                                    </div>
                                )
                                : (
                                    <p
                                        className="mx-3 mb-3 font-extralight"
                                    >
                                        N/A
                                    </p>
                                )
                        }
                    </div>
                </div>
            </div>
            {/* <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <h2
                        className="card-title ml-3 mt-3"
                    >
                        Games by Month
                    </h2>
                    {
                        leaderboardData.length > 0 
                            ? (
                                <div 
                                    className="overflow-x-auto"
                                >
                                    <table 
                                        className="table"
                                    >
                                        <thead>
                                            <tr>
                                                <th>
                                                    MONTH
                                                </th>
                                                <th>
                                                    # OF GAMES
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                gamesByMonthData.map(
                                                    x => (
                                                        <tr
                                                            key={x[0]}
                                                        >
                                                            <td>
                                                                {x[0]}
                                                            </td>
                                                            <td>
                                                                {x[1]}
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                            : (
                                <p
                                    className="mx-3 mb-3 font-extralight"
                                >
                                    N/A
                                </p>
                            )
                    }
                </div>
            </div> */}
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4 border-t-4 border-secondary"
            >
                <div
                    className="card-body p-0"
                >
                    <div className="flex items-center">
                        <h2
                            className="card-title ml-3 mt-3"
                            onDoubleClick={
                                () => setShowCopyPasteButtons(
                                    !showCopyPasteButtons
                                )
                            }
                        >
                            Game History
                        </h2>
                        {
                            showCopyPasteButtons && (
                                <svg
                                    onClick={
                                        () => pasteModalRef.current?.showModal()
                                    }
                                    xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2.5" stroke="currentColor" className="size-3 inline ml-auto mr-3">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                </svg>
                            )
                        }
                    </div>
                    {
                        allGames.length > 0
                            ? (
                                <div
                                    className="overflow-x-auto"
                                >
                                    <table
                                        className="table"
                                    >
                                        <thead>
                                            <tr>
                                                <th>
                                                    DATE
                                                </th>
                                                <th>
                                                    PLAYERS
                                                    <span
                                                        className="text-xs font-light ml-4"
                                                    >
                                                        1<sup>st</sup> - N<sup>th</sup>
                                                    </span>
                                                </th>
                                                <th></th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {
                                                allGames.map(
                                                    x => (
                                                        <tr
                                                            key={x.date}
                                                        >
                                                            <td>
                                                                {x.date}
                                                            </td>
                                                            <td>
                                                                <div
                                                                    className="inline"
                                                                >
                                                                    {x.players}
                                                                    {
                                                                        showCopyPasteButtons && (
                                                                            <svg
                                                                                xmlns="http://www.w3.org/2000/svg"
                                                                                fill="none"
                                                                                viewBox="0 0 24 24"
                                                                                strokeWidth="2.5"
                                                                                stroke="currentColor"
                                                                                className="size-3 inline ml-1 mb-1"
                                                                                onClick={
                                                                                    () => {
                                                                                        copyTextToClipboard(
                                                                                            JSON.stringify(x.result)
                                                                                        );

                                                                                        copiedModalRef.current?.showModal();
                                                                                    }
                                                                                }
                                                                            >
                                                                                <path strokeLinecap="round" strokeLinejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
                                                                            </svg>
                                                                        )
                                                                    }
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            }
                                        </tbody>
                                    </table>
                                </div>
                            )
                            : (
                                <p
                                    className="mx-3 mb-3 font-extralight"
                                >
                                    N/A
                                </p>
                            )
                    }
                </div>
            </div>
            <dialog
                ref={copiedModalRef}
                className="modal modal-bottom sm:modal-middle"
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
                        className="font-bold text-lg"
                    >
                        Copied Game...
                    </h3>
                    <p
                        className="py-4"
                    >
                        Now paste it in a text message, email, or someplace to share...
                    </p>
                </div>
            </dialog>
            <dialog
                ref={pasteModalRef}
                className="modal modal-bottom sm:modal-middle"
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
                        className="font-bold text-lg"
                    >
                        Paste Game...
                    </h3>
                    <p
                        className="py-4"
                    >
                        Make sure a valid game is on your clipboard, then press Paste Game to add to your games...
                    </p>
                    <div
                        className="modal-action"
                    >
                        <form
                            method="dialog"
                        >
                            {/* if there is a button in form, it will close the modal */}
                            <button
                                className="btn"
                                onClick={
                                    async () => {
                                        const clip = await navigator.clipboard.readText();
                                        const validateResult = await validateGameResult(clip);

                                        if (validateResult.success) {

                                            const duplicateGame = allGames
                                                .map(
                                                    x => x.result
                                                )
                                                .some(
                                                    x => (
                                                        x.start === validateResult.data.start
                                                        && x.end === validateResult.data.end
                                                    )
                                                )
                                                ;

                                            if (!duplicateGame) {
                                                // console.log("addNewGameResult");
                                                addNewGameResult(
                                                    validateResult.data
                                                    , emailForSaving
                                                );
                                            }
                                        }

                                        // console.log(
                                        //     "paste"
                                        //     , clip
                                        //     , validateGameResult(
                                        //         clip
                                        //     )
                                        // );
                                    }
                                }
                            >
                                Paste Game
                            </button>
                        </form>
                    </div>
                </div>
            </dialog>
        </>
    );
};