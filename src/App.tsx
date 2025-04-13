import './App.css'
import {
  HashRouter
  , Routes 
  , Route
} from 'react-router';
import { AppTitle, Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';
import { useEffect, useState } from 'react';
import { 
  GameResult
  , getAverageGameDurationsByPlayerCount
  , getGeneralFacts
  , getGoOutsPerGameLeaderboard
  , getLeaderboard
  , getPreviousPlayers
  , getGamesByMonth 
} from './GameResults';
import copyTextToClipboard from 'copy-text-to-clipboard';
import localforage from 'localforage';

const dummyGameResults: GameResult[] = [
  {
      winner: "Hermione"
      , players: [
          "Hermione"
          , "Harry"
          , "Ron"
      ]
      , start: "2025-03-01T18:20:41.576Z"
      , end: "2025-03-01T18:35:42.576Z"
      , scores: []
      , goOuts: ["", "", "", "", "", "", "", "", "", "", ""]
  }
  , {
      winner: "Ron"
      , players: [
          "Hermione"
          , "Ron"
      ]
      , start: "2025-03-05T18:40:27.576Z"
      , end: "2025-03-05T18:45:42.576Z"
      , scores: []
      , goOuts: ["", "", "", "", "", "", "", "", "", "", ""]
  }
  , { 
    "winner": "Eric"
    , "players": 
    [
      "Andrew"
      , "Erin"
      , "Beril"
      , "Tom"
      , "Eric"
    ]
    , "start": "2025-04-12T23:36:36.517Z"
    , "end": "2025-04-13T01:11:08.007Z"
    , "scores": [
      ["Andrew", [0, 8, 20, 13, 14, 3, 35, 31, 6, 20, 0]]
      , ["Beril", [25, 0, 11, 0, 17, 17, 31, 0, 3, 16, 50]]
      , ["Eric", [31, 5, 7, 0, 0, 5, 21, 27, 3, 0, 0]]
      , ["Erin", [19, 0, 14, 15, 0, 0, 25, 15, 0, 12, 11]]
      , ["Tom", [18, 0, 0, 9, 5, 22, 0, 4, 0, 37, 7]]]
      , "goOuts": ["Andrew", "Erin", "Tom", "Eric", "Erin", "Erin", "Tom", "Beril", "Erin", "Eric", "Eric"] 
    }
];

const App = () => {

  //
  // Hooks...
  //
  const [gameResults, setGameResults] = useState<GameResult[]>(dummyGameResults);
  // const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const [title, setTitle] = useState(AppTitle);

  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);

  const [darkMode, setDarkMode] = useState(false);

  useEffect(
    () => {

      const loadDarkMode = async () => {

        const savedDarkMode = await localforage.getItem<boolean>("darkMode") ?? false;

        if (!ignore) {
          setDarkMode(savedDarkMode);
        }
      };

      //
      // Build the ignore-sandwhich...
      //

      // Bread on top...
      let ignore = false;

      loadDarkMode();

      // Bread on bottom...
      return () => {
        ignore = true;
      };
    }
    , []
  );

  //
  // Other code (not hooks)...
  //
  const addNewGameResult = (newGameResult: GameResult) => {
    copyTextToClipboard(
      JSON.stringify(newGameResult)
    );

    setGameResults(
      [
        ...gameResults
        , newGameResult
      ]
    );
  };

  //
  // Finally, return the JSX, using any of the state and calculated items
  // from above...
  //
  return (
    <div
      className='p-0 overflow-x-hidden min-h-screen'
      data-theme={darkMode ? "dark" : "light"}
    >
      <div 
        className="navbar bg-base-300 shadow-lg overflow-x-hidden flex"
      >
        <h1 
          className="text-xl font-bold"
        >
          { title }
        </h1>
        <label 
          className="swap swap-rotate ml-auto"
        >
          {/* this hidden checkbox controls the state */}
          <input 
            type="checkbox" 
            onClick={
              async () => {
                const savedDarkMode = await localforage.setItem("darkMode", !darkMode);
                setDarkMode(savedDarkMode);
              }
            }
          />

          {/* sun icon */}
          <svg
            className="swap-on h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
          </svg>

          {/* moon icon */}
          <svg
            className="swap-off h-6 w-6 fill-current"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24">
            <path
              d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
          </svg>
        </label>
      </div>
      <div 
        className="p-4"
      >
        <HashRouter>
          <Routes>
            <Route
              path='/'
              element={
                <Home
                  leaderboardData={
                    getLeaderboard(gameResults)
                  }
                  setTitle={setTitle}
                  generalFacts={
                    getGeneralFacts(gameResults)
                  }
                  goOutsLeaderboardData={
                    getGoOutsPerGameLeaderboard(gameResults)
                  }
                  gameDurationData={
                    getAverageGameDurationsByPlayerCount(gameResults)
                  }
                  gamesByMonthData={
                    getGamesByMonth(gameResults)
                  }
                />
              } 
            />
            <Route
              path='/setup'
              element={
                <Setup 
                  setTitle={setTitle}
                  previousPlayers={getPreviousPlayers(gameResults)}
                  setCurrentPlayers={setCurrentPlayers}
                />
              } 
            />
            <Route
              path='/play'
              element={
                <Play 
                  addNewGameResult={addNewGameResult}
                  setTitle={setTitle}
                  currentPlayers={currentPlayers}
                />
              } 
            />
          </Routes>
        </HashRouter>
      </div>
    </div>
  )
}

export default App
