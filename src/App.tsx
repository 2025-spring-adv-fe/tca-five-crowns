import './App.css'
import {
  HashRouter
  , Routes 
  , Route
} from 'react-router';
import { AppTitle, Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';
import { useEffect, useRef, useState } from 'react';
import { 
  GameResult
  , getAverageGameDurationsByPlayerCount
  , getGeneralFacts
  , getGoOutsPerGameLeaderboard
  , getHighestSingleHandScoreLeaderboard
  , getLeaderboard
  , getPreviousPlayers
  , getGamesByMonth, 
  getGameHistoryData,
  getLowestScoreAllTimeData,
  getGamesPlayedTrendChartData
} from './GameResults';
import localforage from 'localforage';

import {
  saveGameToCloud 
  , loadGamesFromCloud
} from './tca-cloud-api';

const App = () => {

  //
  // Hooks...
  //
  // My order pref is... Ref hooks, state hooks, effect hooks ! ! !
  //
  const emailModalRef = useRef<HTMLDialogElement | null>(null);

  const [gameResults, setGameResults] = useState<GameResult[]>([]);

  const [title, setTitle] = useState(AppTitle);

  const [currentPlayers, setCurrentPlayers] = useState<string[]>([]);

  const [darkMode, setDarkMode] = useState(false);

  const [emailOnModal, setEmailOnModal] = useState("");
  
  const [emailForCloudApi, setEmailForCloudApi] = useState("");

  useEffect(
    () => {

      const loadDarkMode = async () => {

        const savedDarkMode = await localforage.getItem<boolean>("darkMode") ?? false;

        if (!ignore) {
          setDarkMode(savedDarkMode);
        }
      };

      //
      // Build the ignore-sandwich...
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

  useEffect(
    () => {

      const loadEmail = async () => {

        const savedEmail = await localforage.getItem<string>("email") ?? "";

        if (!ignore) {
          setEmailOnModal(savedEmail);
          
          if(savedEmail.length > 0) {
            setEmailForCloudApi(savedEmail);
          }
        }
      };

      //
      // Build the ignore-sandwich...
      //

      // Bread on top...
      let ignore = false;

      loadEmail();

      // Bread on bottom...
      return () => {
        ignore = true;
      };
    }
    , []
  );

  useEffect(
    () => {

      const loadGameResults = async () => {

        const savedGameResults = await loadGamesFromCloud(
          emailForCloudApi 
          , "tca-five-crowns-25s"
        );

        if (!ignore) {
          setGameResults(savedGameResults);
        }
      };

      //
      // Build the ignore-sandwich...
      //

      // Bread on top...
      let ignore = false;

      if (emailForCloudApi.length > 0) {
        loadGameResults();
      }
      else {
        setGameResults([]);
      }

      // Bread on bottom...
      return () => {
        ignore = true;
      };
    }
    , [emailForCloudApi]
  );

  //
  // Other code (not hooks)...
  //
  const addNewGameResult = async (
    newGameResult: GameResult
    , email: string
  ) => {
    // Save the game to the cloud via the cloud api...
    await saveGameToCloud(
      email.length > 0 
        ? email
        : "unknown@tomfixthis.com" 
      , "tca-five-crowns-25s"
      , newGameResult.end
      , newGameResult
    );

    // Optimistically update the lifted state with the new game result...
    setGameResults(
      [
        ...gameResults
        , newGameResult
      ]
    );
  };

  const saveEmail = async (emailToSave: string) => {
    const savedEmail = await localforage.setItem(
      "email"
      , emailToSave
    );

    setEmailOnModal(savedEmail);
    setEmailForCloudApi(savedEmail);
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
        <div 
          className="flex gap-1 ml-auto"
        >
          {
            AppTitle === title && (
              <button 
                className="btn btn-ghost"
                onClick={
                  () => emailModalRef.current?.showModal()
                }
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.8} stroke="currentColor" className="size-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                </svg>
              </button>
            )
          }
          <label 
            className="swap swap-rotate"
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
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                d="M5.64,17l-.71.71a1,1,0,0,0,0,1.41,1,1,0,0,0,1.41,0l.71-.71A1,1,0,0,0,5.64,17ZM5,12a1,1,0,0,0-1-1H3a1,1,0,0,0,0,2H4A1,1,0,0,0,5,12Zm7-7a1,1,0,0,0,1-1V3a1,1,0,0,0-2,0V4A1,1,0,0,0,12,5ZM5.64,7.05a1,1,0,0,0,.7.29,1,1,0,0,0,.71-.29,1,1,0,0,0,0-1.41l-.71-.71A1,1,0,0,0,4.93,6.34Zm12,.29a1,1,0,0,0,.7-.29l.71-.71a1,1,0,1,0-1.41-1.41L17,5.64a1,1,0,0,0,0,1.41A1,1,0,0,0,17.66,7.34ZM21,11H20a1,1,0,0,0,0,2h1a1,1,0,0,0,0-2Zm-9,8a1,1,0,0,0-1,1v1a1,1,0,0,0,2,0V20A1,1,0,0,0,12,19ZM18.36,17A1,1,0,0,0,17,18.36l.71.71a1,1,0,0,0,1.41,0,1,1,0,0,0,0-1.41ZM12,6.5A5.5,5.5,0,1,0,17.5,12,5.51,5.51,0,0,0,12,6.5Zm0,9A3.5,3.5,0,1,1,15.5,12,3.5,3.5,0,0,1,12,15.5Z" />
            </svg>

            {/* moon icon */}
            <svg
              className="swap-off h-6 w-6 fill-current"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth={2}
            >
              <path
                d="M21.64,13a1,1,0,0,0-1.05-.14,8.05,8.05,0,0,1-3.37.73A8.15,8.15,0,0,1,9.08,5.49a8.59,8.59,0,0,1,.25-2A1,1,0,0,0,8,2.36,10.14,10.14,0,1,0,22,14.05,1,1,0,0,0,21.64,13Zm-9.5,6.69A8.14,8.14,0,0,1,7.08,5.22v.27A10.15,10.15,0,0,0,17.22,15.63a9.79,9.79,0,0,0,2.1-.22A8.11,8.11,0,0,1,12.14,19.73Z" />
            </svg>
          </label>
        </div>
      </div>
      <dialog
        ref={emailModalRef} 
        className="modal modal-bottom sm:modal-middle"
      >
        <div className="modal-backdrop bg-base-300"></div>
        <div 
          className="modal-box"
        >
          <h3 
            className="font-bold text-lg"
          >
            Enter email to load & save games...
          </h3>
          <p 
            className="py-4"
          >
            <input 
                type="text" 
                placeholder="Enter email address..." 
                className="input w-full" 
                value={emailOnModal}
                onChange={
                    (e) => setEmailOnModal(e.target.value)
                }
            />
          </p>
          <div 
            className="modal-action"
          >
            <form 
              method="dialog"
            >
              {/* if there is a button in form, it will close the modal */}
              <button 
                className="btn btn-secondary"
                onClick={
                  async () => await saveEmail(emailOnModal)
                }
              >
                Save
              </button>
              <button 
                className="btn btn-secondary btn-outline ml-3"
                onClick={
                  () => setEmailOnModal(emailForCloudApi) 
                }
              >
                Cancel
              </button>
            </form>
          </div>
        </div>
      </dialog>
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
                  highestSingleHandScoreLeaderboardData={
                    getHighestSingleHandScoreLeaderboard(gameResults)
                  }
                  gameDurationData={
                    getAverageGameDurationsByPlayerCount(gameResults)
                  }
                  gamesByMonthData={
                    getGamesByMonth(gameResults)
                  }
                  allGames={
                    getGameHistoryData(gameResults)
                  }
                  addNewGameResult={addNewGameResult}
                  emailForSaving={emailForCloudApi}
                  lowestScoreAllTimeData={
                    getLowestScoreAllTimeData(gameResults)
                  }
                  gamesPlayedTrendChartData={
                    getGamesPlayedTrendChartData(gameResults)
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
                  emailForSaving={emailForCloudApi}
                  saveEmail={saveEmail}
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
