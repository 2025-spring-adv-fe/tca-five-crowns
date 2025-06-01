import { durationFormatter } from "human-readable";
import { z } from "zod";

const formatGameDuration = durationFormatter<string>();

const formatLastPlayed = durationFormatter<string>({
    allowMultiples: ["y", "mo", "d"],
});

// Helper function to convert wildcard number to display value
export const getDisplayWildcard = (x: number): string => (
    x < 11
        ? x.toString()
        : x === 11
            ? "J"
            : x === 12
                ? "Q"
                : "K"
);

//
// Exported interfaces...
//
export interface GameResult {
    winner: string;
    players: string[];
    start: string;
    end: string;
    scores: [string, number[]][];
    goOuts: string[];
}

const GameResultSchema = z.object(
    {
        winner: z.string()
        , players: z.array(
            z.string()
        )
        , start: z.string() 
        , end: z.string() 
        , scores: z.array(
            z.tuple(
                [
                    z.string()
                    , z.array(
                        z.number()
                    )
                ]
            )
        )
        , goOuts: z.array(
            z.string()
        )
    }
);

export interface LeaderboardEntry {
    wins: number;
    losses: number;
    average: string;
    player: string;
}

export interface RankedLeaderboardEntry extends LeaderboardEntry {
    rank: number;
};

export interface GeneralFacts {
    lastPlayed: string;
    totalGames: number;
    shortestGame: string;
    longestGame: string;
}

export interface GoOutsLeaderboardEntry {
    player: string;
    totalGoOuts: number;
    gamesPlayed: number;
    goOutsPerGame: string;
}

export interface RankedGoOutsLeaderboardEntry extends GoOutsLeaderboardEntry {
    rank: number;
}
export interface HighestSingleHandScoreLeaderboardEntry {
    player: string;
    highestSingleHandScore: number;
    wildCards: string[]; // Changed from single wildCard to an array of wildcards
}

export const getHighestSingleHandScoreLeaderboard = (
    results: GameResult[]
): HighestSingleHandScoreLeaderboardEntry[] => {
    const players = getPreviousPlayers(results);
    const playerHighestSingleHandScores = new Map<string, { score: number; wildCards: number[] }>();

    // Go through all game results with scores
    results.forEach((game) => {
        // Skip games without score data
        if (!game.scores || game.scores.length === 0) return;

        // Process each player's scores
        game.scores.forEach(([playerName, scores]) => {
            // Find highest score for this player in this game
            const playerMaxScore = Math.max(...scores.filter((s) => s !== -1));
            
            // Get all occurrences of this max score
            const wildCardIndices = scores
                .map((score, index) => score === playerMaxScore ? index : -1)
                .filter(index => index !== -1);
            
            if (playerMaxScore <= 0 || wildCardIndices.length === 0) return;
            
            // If this is the first time we're seeing this player or this score is higher
            if (!playerHighestSingleHandScores.has(playerName) || 
                playerMaxScore > playerHighestSingleHandScores.get(playerName)!.score) {
                // New highest score - replace previous data
                playerHighestSingleHandScores.set(playerName, { 
                    score: playerMaxScore, 
                    wildCards: wildCardIndices.map(index => index + 3) // Adjust each index to wildcard value
                });
            } 
            // If this score equals their existing highest score
            else if (playerMaxScore === playerHighestSingleHandScores.get(playerName)!.score) {
                // Same highest score - add these wildcards to existing ones
                const entry = playerHighestSingleHandScores.get(playerName)!;
                const newWildCards = wildCardIndices.map(index => index + 3);
                
                // Combine existing and new wildcards, avoiding duplicates
                entry.wildCards = [...new Set([...entry.wildCards, ...newWildCards])];
                playerHighestSingleHandScores.set(playerName, entry);
            }
        });
    });

    // Convert Map to array of leaderboard entries
    return players
        .map((player) => {
            const highScoreData = playerHighestSingleHandScores.get(player);
            
            return {
                player,
                highestSingleHandScore: highScoreData?.score || 0,
                wildCards: highScoreData 
                    ? highScoreData.wildCards.sort((a, b) => a - b).map(wc => getDisplayWildcard(wc)) 
                    : []
            };
        })
        .filter((entry) => entry.highestSingleHandScore > 0) // Only include players with recorded high scores
        .sort((a, b) => b.highestSingleHandScore - a.highestSingleHandScore); // Sort by highest score
};

//
// Exported functions...
//
export const getLeaderboard = (results: GameResult[]): RankedLeaderboardEntry[] =>
	getPreviousPlayers(results)
		.map(
            (x) => getLeaderboardEntry(results, x)
        )
		.sort(
            (a, b) => {
                // Some wins with same average, more games makes you higher on the leaderboard...
                if (Number(a.average) === Number(b.average) && a.wins > 0) {
                    return b.wins + b.losses - (a.wins + a.losses);
                }

                // No wins, more games makes you lower on the leaderboard...
                if (0 === a.wins && 0 === b.wins) {
                    return a.wins + a.losses - (b.wins + b.losses);
                }

                // Non special case, higher average means higher on leaderboard...
                return Number(b.average) - Number(a.average);
            }
        )
        .map(
            (x, _, a) => (
                {
                    ...x 
                    , rank: a.findIndex(
                        y => y.average === x.average
                    ) + 1
                }
            ) 
        )
    ;

export const getGeneralFacts = (results: GameResult[]): GeneralFacts => {
	if (results.length === 0) {
		return {
			lastPlayed: "N/A",
			totalGames: 0,
			shortestGame: "N/A",
			longestGame: "N/A",
		};
	}

	// Calcs for lastPlayed...
	const now = Date.now();

	const gameEndTimesInMilliseconds = results.map(
		(x) => now - Date.parse(x.end),
	);

	const lastPlayedInMilliseconds = Math.min(...gameEndTimesInMilliseconds);

	// console.log(
	//     gameEndTimesInMilliseconds
	// );

	// Calcs for shortest/longest...
	const gameDurationsInMilliseconds = results.map(
		(x) => getGameDurationInMilliseconds(x),
	);

	return {
		lastPlayed: `${formatLastPlayed(lastPlayedInMilliseconds)} ago`,
		totalGames: results.length,
		shortestGame: formatGameDuration(
			Math.min(...gameDurationsInMilliseconds),
		),
		longestGame: formatGameDuration(
			Math.max(...gameDurationsInMilliseconds),
		),
	};
};

export const getPreviousPlayers = (results: GameResult[]) => {
	const allPlayersForAllGamesWithDupes = results.flatMap((x) => x.players);

	return [...new Set(allPlayersForAllGamesWithDupes)].sort((a, b) =>
		a.localeCompare(b),
	);
};

export const getGoOutsPerGameLeaderboard = (
	results: GameResult[],
): RankedGoOutsLeaderboardEntry[] => {
	const players = getPreviousPlayers(results);

	return players
		.map((player) => {
			// Find games this player participated in
			const playerGames = results.filter((game) =>
				game.players.includes(player),
			);

			// Count total go outs for this player
			const totalGoOuts = playerGames.reduce(
				(count, game) =>
					count +
					game.goOuts.filter((name) => name === player).length,
				0,
			);

			// Calculate go outs per game ratio
			const gamesPlayed = playerGames.length;
			const goOutsPerGame =
				gamesPlayed > 0
					? (totalGoOuts / gamesPlayed).toFixed(2)
					: "0.00";

			return {
				player,
				totalGoOuts,
				gamesPlayed,
				goOutsPerGame,
			};
		})
		.sort((a, b) => {
			// Sort by go outs per game (descending)
			const diff = Number(b.goOutsPerGame) - Number(a.goOutsPerGame);

			// If tied on ratio, sort by total go outs (descending)
			if (diff === 0) {
				return b.totalGoOuts - a.totalGoOuts;
			}

			return diff;
		})
        .map(
            (x, _, a) => ({
                ...x
                , rank: a.findIndex(
                    y => y.goOutsPerGame === x.goOutsPerGame
                ) + 1
            })
        );
};

export const getAverageGameDurationsByPlayerCount = (results: GameResult[]) => {

	// Group game results by player count, advanced reduce()...
	const grouped = results.reduce(
		(acc, x) =>
			acc.set(
				x.players.length,
				//, [x]
				[...(acc.get(x.players.length) ?? []), x],
			),
		new Map<number, GameResult[]>(),
	);

	// const grouped = Map.groupBy(
	//     grs
	//     , (x) => x.players.length

	//     // Show off nonsense, but fun : - ))
	//     //, (x) => x.winner.length
	// );

	//console.log(grouped);

	// Shape the grouped results into something to display these fun facts... Includes sorting...
	return [...grouped]
		.sort((a, b) => a[0] - b[0])
		.map((x) => ({
			numberOfPlayers: x[0],
			avgGameDuration: `${formatGameDuration(
				getAvgGameDurationInMilliseconds(x[1]),
			)}`,
            gameCount: x[1].length,
		}));
};

export const getGamesByMonth = (results: GameResult[]): Array<[string, number]> => {

    const gameStartMonths = results.map(
        x => new Date(x.start).toLocaleString(
            'default'
            , {
                month: 'short'
            }
        )
    );

    const groupedStartMonths = Map.groupBy(
        gameStartMonths
        , x => x
    );

    console.log(
        gameStartMonths
        , groupedStartMonths
    );

    return [
        'Jan'
        , 'Feb'
        , 'Mar'
        , 'Apr'
        , 'May'
        , 'Jun'
        , 'Jul'
        , 'Aug'
        , 'Sep'
        , 'Oct'
        , 'Nov'
        , 'Dec'
    ].map(
        x => [
            x 
            , groupedStartMonths.get(x)?.length ?? 0
        ]
    );
};

export const getGameHistoryData = (
    results: GameResult[]
) => results
    .sort(
        (a, b) => Date.parse(b.end) - Date.parse(a.end)
    )
    .map(
        x => ({
            date: new Date(x.end).toLocaleString("en-US")
            // , players: x.players.join(', ')
            , players: x.scores
                .map(
                    x => ({
                        name: x[0]
                        , score: x[1].reduce(
                            (acc, y) => y >= 0 
                                ? acc + y
                                : acc
                            , 0
                        )
                    })
                )
                .sort(
                    (a, b) => a.name === x.winner 
                        // Winner should always come before others, even with same score ! ! !
                        ? -1
                        : a.score - b.score
                )
                .map(
                    x => `${x.name} (${x.score})`
                )
                .join(', ')
            , result: x 
        })
    );
;

export const validateGameResult = async (result: string) => {

    const parsedObject = await safeJsonParseString(result);
    // console.log(
    //     "parsedObject"
    //     , parsedObject
    // );

    return GameResultSchema.safeParse(parsedObject);
}

//
// Helper functions...
//
const getLeaderboardEntry = (
	results: GameResult[],
	player: string,
): LeaderboardEntry => {
	const totalGamesForPlayer = results.filter((x) =>
		x.players.some((y) => player === y),
	).length;

	const wins = results.filter((x) => x.winner === player).length;

	const avg = totalGamesForPlayer > 0 ? wins / totalGamesForPlayer : 0;
	return {
		wins: wins,
		losses: totalGamesForPlayer - wins,
		average: avg.toFixed(3),
		player: player,
	};
};

const getGameDurationInMilliseconds = (results: GameResult) => Date.parse(results.end) - Date.parse(results.start);

const getAvgGameDurationInMilliseconds = (results: GameResult[]) => {

    // Add up all the game durations, simple reduce()...
    const totalGameTimeInMilliseconds = results.reduce(
        (acc, x) => acc + getGameDurationInMilliseconds(x)
        , 0
    );

    // Average is that total divided by number of games, accounting for divide by zero errors...
    return results.length > 0
        ? totalGameTimeInMilliseconds / results.length
        : 0
    ;
};

const safeJsonParseString = async (json: string) => {
    try {
        return JSON.parse(json);
    }
    catch {
        // Empty object if parse fails, i-o-g...
        return {};
    }
};