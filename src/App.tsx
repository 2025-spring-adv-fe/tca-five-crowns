import './App.css'
import {
  HashRouter
  , Routes 
  , Route
} from 'react-router';
import { Home } from './Home';
import { Setup } from './Setup';
import { Play } from './Play';
import { useState } from 'react';
import { GameResult } from './GameResults';

const dummyGameResults: GameResult[] = [
  {
      winner: "Hermione"
      , players: [
          "Hermione"
          , "Harry"
          , "Ron"
      ]
  }
  , {
      winner: "Ron"
      , players: [
          "Hermione"
          , "Ron"
      ]
  }
  , {
      winner: "Larry"
      , players: [
          "Larry"
          , "Curly"
          , "Moe"
      ]
  }
  , {
      winner: "Harry"
      , players: [
          "Curly"
          , "Harry"
      ]
  }
  , {
      winner: "Ron"
      , players: [
          "Ron"
          , "Voldemort"
      ]
  }
  , {
      winner: "Voldemort"
      , players: [
          "Ron"
          , "Voldemort"
      ]
  }
];

const App = () => {

  console.log(
    "App Component Func Called ! ! !"
  );

  // const [totalGameCount, setTotalGameCount] = useState(0);
  const [gameResults, setGameResults] = useState(dummyGameResults);

  return (
    <div
      className='p-4'
    >
      <HashRouter>
        <Routes>
          <Route
            path='/'
            element={
              <Home
                totalGameCount={gameResults.length} 
              />
            } 
          />
          <Route
            path='/setup'
            element={
              <Setup 
                totalGameCount={gameResults.length}
              />
            } 
          />
          <Route
            path='/play'
            element={
              <Play 
                totalGameCount={gameResults.length}
              />
            } 
          />
        </Routes>
      </HashRouter>
    </div>
  )
}

export default App
