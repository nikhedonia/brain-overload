import {
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  Input,
  Paper,
  Slider,
  Switch,
  TextField,
} from "@mui/material";
import { Box } from "@mui/system";
import { count } from "./utils";
import React, { useEffect, useMemo, useReducer, useRef, useState } from "react";
import { FieldValues, useForm, UseFormRegister } from "react-hook-form";
import {
  CountingGame,
  countingInitialState,
  countingReducer,
  View,
} from "./Games/Counting";
import { modalities } from "./Games/NBack/Board";
import { NBack, nbackInitialState, nbackReducer } from "./Games/NBack/index";
import { Pasat, pasatInitialState, pasatReducer } from "./Games/Pasat";
import { Tetris } from "./Games/Tetris";
import {
  TetrisAction,
  tetrisInitialState,
  tetrisReducer,
} from "./Games/Tetris/reducer";
import { ProgressBar } from "./Progress";
import { Snake, snakeInitialState, snakeReducer } from "./Games/Snake";

function GameInfo({
  name,
  id,
  description,
  register,
}: {
  id: string
  name: string;
  description: string;
  register: UseFormRegister<Settings>
}) {
  const {ref, ...rest} = register(`${id}.enabled` as 'tetris.enabled');
  return (
    <>
      <Box display="flex" alignItems="center" justifyContent="space-between">
        <h3> {name} </h3>
        <input type="checkbox"  
          style={{fontSize:'2em', width: '1em', height: '1em'}}
          {...rest}
          ref={ref}/>
      </Box>
      <div>{description}</div>
    </>
  );
}

type Settings = {
  tetris: {
    enabled: boolean
    timer: number
  }
  snake: {
    enabled: boolean
    timer: number
  }
  nback: {
    timer: number
    enabled: boolean
    n: number
    positions?: boolean
    icons: boolean
    colors: boolean
    numbers: boolean
  },
  counting: {
    timer: number,
    enabled: boolean
    min: number
    max: number
  }
  pasat: {
    timer: number,
    enabled: boolean
    n: number
  }
}

function settingsFromHash(): Settings | undefined {
  try {
    return JSON.parse(atob(window.location.hash.slice(1)));
  } catch (_) {}
}

function GameMenu ({defaultValues, onSubmit}: {defaultValues?: Settings|undefined, onSubmit: (values: Settings)=>void}) {

  const [tetrisGame, tetrisAction] = useReducer(
    tetrisReducer,
    tetrisInitialState()
  );

  const [nbackGame, nbackAction] = useReducer(
    nbackReducer,
    nbackInitialState(2, {positions: count(9)})
  );

  const [countingGame, countingAction] = useReducer(
    countingReducer,
    countingInitialState(3, 8)
  );

  const [snakeGame, snakeAction] =  useReducer(snakeReducer, snakeInitialState(3));


  const { register, getValues } = useForm<Settings>({
    mode:'onChange',
    defaultValues
  });

  const values = getValues();

  const canStart = Object.values(values).some(x=>x.enabled);

  return (
    <Box display="flex" flexDirection="column" padding={"2em"} gap="2em">
      <h1> Choose one or more games to play in parallel</h1>
      
      <Box display="flex" flexDirection="row" flexWrap="wrap" padding={"2em"} gap="2em">
        <Paper elevation={5}>
          <Box width={"300px"} padding={"1em"} display="flex" flexDirection="column" gap="1em">
            <GameInfo register={register} id="tetris" name="Tetris" description="...a classic. Controls: A S D W Space. If you select this game with another game, mistakes in other games will be punished" />
            <Tetris game={tetrisGame} dispatch={tetrisAction} timer={300} />

            <Box>
              <h3> Settings </h3>
              <Box display="flex" alignItems="center">
              <TextField 
                  defaultValue={1000} 
                  {...register("tetris.timer")}
                  type="number" 
                  inputProps={{min:1, max: 1000, step:1}}
                  sx={{marginRight: "1em"}}
                /> time per frame
              </Box>
            </Box>
          </Box>
        </Paper>

        <Paper elevation={5}>
          <Box width={"300px"} padding={"1em"} display="flex" flexDirection="column" gap="1em">
            <GameInfo register={register} id="snake" name="Snake" description="...a classic. Controls: A S D W Space. Challenge Play this with Tetris!" />
            <Snake game={snakeGame} dispatch={snakeAction} timer={200} />

            <Box>
              <h3> Settings </h3>
              <Box display="flex" alignItems="center">
              <TextField 
                  defaultValue={100} 
                  {...register("snake.timer")}
                  type="number" 
                  inputProps={{min:20, max: 300, step:1}}
                  sx={{marginRight: "1em"}}
                /> time per frame
              </Box>
            </Box>

          </Box>
        </Paper>

        <Paper elevation={5}>
          <Box width={"300px"} padding={"1em"} display="flex" flexDirection="column" gap="1em">
            <GameInfo register={register} id="nback" name="Multi Modal N-Back" description="press a button if the current item match the element you saw N items ago." />
            <NBack game={nbackGame} dispatch={nbackAction} timer={1000} />
            <Box>
              <h3> Settings </h3>

              <Box display={"flex"} alignItems="center">
                <TextField 
                  defaultValue={2} 
                  {...register("nback.n")}
                  type="number" 
                  inputProps={{min:1, max:9, step:1}}
                  sx={{marginRight: "1em"}}
                /> N-Back Level
              </Box>

              <Box display={"flex"} alignItems="center">
                <TextField 
                  defaultValue={3000} 
                  {...register("nback.timer")}
                  type="number" 
                  inputProps={{min:2000, max:10000, step: 100}} 
                  sx={{marginRight: "1em"}}
                /> Timer
              </Box>

              <Box>
                <h3> Additional Modalities </h3>

                <Box display={"flex"} alignItems="center">
                  <input type="checkbox"  
                    style={{fontSize:'1.5em', width: '1em', height: '1em'}}
                    {...register("nback.colors")} />
                  Colors
                </Box>

                <Box display={"flex"} alignItems="center">
                  <input type="checkbox"  
                    style={{fontSize:'1.5em', width: '1em', height: '1em'}}
                    {...register("nback.icons")} />
                  Symbols
                </Box>

                <Box display={"flex"} alignItems="center">
                  <input type="checkbox"  
                    style={{fontSize:'1.5em', width: '1em', height: '1em'}}
                    {...register("nback.numbers")} />
                  Numbers (audio)
                </Box>
              </Box>

            </Box>
          </Box>
        </Paper>

        <Paper elevation={5}>
          <Box width={"500px"} padding={"1em"} display="flex" flexDirection="column" gap="1em">
            <GameInfo register={register} id="counting" name="PerceptionTest" description="Count the number of circles on the screen, type in the last digit" />
            <CountingGame game={countingGame} dispatch={countingAction} timer={1000} />
          
            <Box>
              <h3> Settings </h3>
              Range 
              <Box display={"flex"} alignItems="center">
                <TextField 
                  defaultValue={3} 
                  {...register("counting.min")}
                  type="number" 
                  inputProps={{min:1, max:30, step:1}} 
                  sx={{marginRight: "1em"}}
                /> Min
              </Box>

              <Box display={"flex"} alignItems="center">
                <TextField 
                  defaultValue={10} 
                  {...register("counting.max")}
                  type="number" 
                  inputProps={{min:1, max:30, step:1}} 
                  sx={{marginRight: "1em"}}
                /> Max
              </Box>

              <Box display={"flex"} alignItems="center">
                <TextField 
                  defaultValue={3000} 
                  {...register("counting.timer")}
                  type="number" 
                  inputProps={{min:2000, max:10000, step: 100}} 
                  sx={{marginRight: "1em"}}
                /> Timer
              </Box>
            
            </Box>
          
          </Box>
        </Paper>
        <Paper elevation={5}>
          <Box width={"500px"} padding={"1em"} display="flex" flexDirection="column" gap="1em">
          <GameInfo register={register} id="pasat" name="PASAT - Paced Auditory Addition Test" description={`Type the last digit of the sum of the last N=${values?.pasat?.n||2} numbers`} />
            <Box>
              No Demo Available
            </Box>

            <Box>
              <h3> Settings </h3> 
              <Box display={"flex"} alignItems="center">
                <TextField 
                  defaultValue={2} 
                  {...register("pasat.n")}
                  type="number" 
                  inputProps={{min:1, max:9, step:1}} 
                  sx={{marginRight: "1em"}}
                /> N 
              </Box>

              <Box display={"flex"} alignItems="center">
                <TextField 
                  defaultValue={3000} 
                  {...register("pasat.timer")}
                  type="number" 
                  inputProps={{min:2000, max:10000, step: 100}} 
                  sx={{marginRight: "1em"}}
                /> Timer
              </Box>
            </Box>
        
          </Box>
        </Paper>
      </Box>

      <Box>
        <Button 
          disabled={!canStart}
          variant="contained" 
          onClick={()=>onSubmit(getValues() as unknown as Settings)}>
            Start Game
          </Button>
      </Box>
    </Box>

  );
}

function Game({settings}: {settings: Settings}) {
  const [tetrisGame, tetrisAction] = useReducer(
    tetrisReducer,
    tetrisInitialState()
  );
  const [countingGame, countingAction] = useReducer(
    countingReducer,
    countingInitialState(+settings.counting.min, +settings.counting.max)
  );
  const [pasatGame, pasatAction] = useReducer(
    pasatReducer,
    pasatInitialState(+settings.pasat.n)
  );

  const [nbackGame, nbackAction] = useReducer(
    nbackReducer,
    nbackInitialState(2, Object.fromEntries(
      Object
        .entries(modalities)
        .filter(([k]) => k == 'positions' || settings.nback[k as 'positions'])
    ))
  );

  const [snakeGame, snakeAction] =  useReducer(snakeReducer, snakeInitialState(3));


  const timer = Math.max(...[
    2000, 
    +settings.pasat.timer, 
    +settings.counting.timer, 
    +settings.nback.timer
  ].filter(x=>x))


  const tetrisTimer = settings.tetris.timer / Math.log(Math.pow(tetrisGame.lines, 2) + 4);

  const startTime = Math.max(...[
    0, 
    countingGame.time||0, 
    pasatGame.time||0, 
    nbackGame.time||0
  ]);

  const lastSubmissionTime = Math.max(...[
    countingGame.submission?.time || 0, 
    pasatGame.submission?.time || 0,
    nbackGame.submission?.time || 0
  ].filter(x => x));


  const score = [
    ...countingGame.submissions,
    ...pasatGame.submissions,
    ...nbackGame.submissions
  ].map(x=>+!!x.correct).reduce((a, b)=> a + b, 0)

  const total = (
    countingGame.submissions.length +
    pasatGame.submissions.length +
    nbackGame.submissions.length
  )

  useEffect(() => {
    if (!settings.tetris.enabled) return;

    const incorrectSubmission = [
      snakeGame.expiredFood.length === 0,
      snakeGame.over === false,
      countingGame.submission?.correct,
      pasatGame.submission?.correct,
      (nbackGame.submission?.wrong?.length||0) === 0
    ].some(x => x === false);
  
    const missingSubmission = [
      countingGame.submission || countingGame.submissions.at(-1)!,
      pasatGame.submission || pasatGame.submissions.at(-1)!,
      nbackGame.submission || nbackGame.submissions.at(-1)!,
    ].filter(x=>x).some(x => x.time === 0 && x.correct === false)

    if (incorrectSubmission || missingSubmission) {
      tetrisAction({ type: "tetris/punish", lines: 1 });
    }  

    if (settings.snake.enabled && snakeGame.over) {
      snakeAction({
        type: "snake/tick", 
        time: Date.now(), 
        over: false, 
        food: [], 
        expiredFood: [],
        snake: [{x:5, y:5}], 
        n:3
      })
    }
  }, [
    Math.floor(startTime/1000), 
    lastSubmissionTime,
    snakeGame.expiredFood,
    snakeGame.over
  ]);

  useEffect(()=>{
    if (settings.snake.enabled && tetrisGame.lines % 4 === 0) {
      snakeAction({
        type: "snake/tick", 
        time: Date.now(), 
        over: false,
        n:3
      });
    }
  }, [tetrisGame.lines % 4 === 0])



  return (
    <Box 
      display="flex"
      flexDirection={"column"}
      justifyContent="center"
      alignItems="center"
    >
      <Box
        display="flex"
        flexDirection={"column"}
        flexGrow={1}
        maxWidth="1000px"
      >

        <ProgressBar
          startTime={startTime}
          endTime={startTime + timer}/>
 
        <Box display="flex" flexGrow={1}
          flexWrap="wrap"
          justifyContent="stretch"
          alignItems={"stretch"}
        >

          {settings.tetris.enabled ? 
            <Box display="flex" width={"400px"} justifyContent="stretch" alignItems="stretch" gap="1em">
              <Tetris timer={tetrisTimer} game={tetrisGame} dispatch={tetrisAction} />
            </Box>
            : null}

          {settings.snake.enabled ? 
            <Box display="flex" width={"400px"} justifyContent="stretch" alignItems="stretch" gap="1em">
              <Snake timer={settings.snake.timer} game={snakeGame} dispatch={snakeAction} />
            </Box>
            : null}

            <Box display="flex" flexGrow={1} flexDirection="row" flexWrap="wrap" justifyContent="stretch" alignItems="stretch">
              {settings.pasat.enabled ? 
                <Box width="300px" display="flex" height="300px">
                  <Pasat game={pasatGame} dispatch={pasatAction} timer={timer} /> 
                </Box>
                : null}
              {settings.counting.enabled ? 
              <Box width="300px" display="flex" height="300px">
                <CountingGame game={countingGame} dispatch={countingAction} timer={timer} />
              </Box> : null }

              {settings.nback.enabled ? 
              <Box width="300px" display="flex" height="300px">
                <NBack game={nbackGame} dispatch={nbackAction} timer={timer} />
              </Box> : null }
            </Box>
        </Box>
      </Box>
      <Box marginTop="2em">
        {total ? <Box> Score: {score} / {total} </Box> : null }
        {tetrisGame.lines ? <Box> Tetris Score: {tetrisGame.lines} </Box> : null}
        <Button variant="outlined"> Quit </Button>
      </Box>
    </Box>
  );
}

export default () => {

  const [settings, setSettings] = useState<undefined|Settings>();


  useEffect(() => {
    if (settings) {
      window.location.hash = settings && btoa(JSON.stringify(settings));
    }
  }, [settings])

  if (!settings) {
    return (
      <GameMenu onSubmit={setSettings} defaultValues={settingsFromHash()} />
    );
  }

  return (
    <Game settings={settings} />
  )

}
