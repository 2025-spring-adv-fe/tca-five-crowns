import { useNavigate } from "react-router";
import { LeaderboardEntry } from "./GameResults";
import { useEffect } from "react";

export const AppTitle = "Five Crowns";

interface HomeProps {
    leaderboardData: LeaderboardEntry[];
    setTitle: (t: string) => void;
};

export const Home: React.FC<HomeProps> = ({
    leaderboardData
    , setTitle
}) => {

    useEffect(
        () => setTitle(AppTitle)
        , []
    );

    // Use a react hook for button navigation...
    const nav = useNavigate();

    return (
        <>
            <button
                className="btn btn-active btn-secondary btn-lg mt-4"
                onClick={
                    () => nav("/setup")
                }
            >
                Play Five Crowns
            </button>
            <div
                className="card w-full bg-base-100 card-md shadow-lg mt-4"
            >
                <div
                    className="card-body"
                >
                    <h2
                        className="card-title"
                    >
                        Leaderboard
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
                                                            <td>
                                                                {x.wins}
                                                            </td>
                                                            <td>
                                                                {x.losses}
                                                            </td>
                                                            <td>
                                                                {x.average}
                                                            </td>
                                                            <td>
                                                                {x.player}
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
                                <p>
                                    Play a game of Five Crowns to see the leaderboard ! ! !
                                </p>
                            )
                    }
                </div>
            </div>
        </>
    );
};