import { useEffect, useReducer } from "react";
import { useKeyboardAction } from "../../Devices/keyboard";
import { useTimer } from "../../Devices/timer";
import { count } from "../../utils";

type SnakeState = {
  w: number,
  h: number,
  n: number,
  inc: number,
  score: number,
  snake: {x:number, y:number}[],
  food: {x:number, y:number, expires?: number}[],
  dir: {x: number, y: number},
  over: boolean,
  time: number,
  expiredFood: {x: number, y: number}[]
}

type SnakeTick = {
  type: 'snake/tick',
  time: number
} & Partial<SnakeState>

type SnakeMove = {
  type: 'snake/move',
  dir: {x: number, y: number}
}

type SnakeAction = SnakeTick | SnakeMove;

const mod = (x:number, n:number) => {
  const m = x%n;

  return m<0 ? n+m: m;
}

export function snakeReducer (state: SnakeState, action: SnakeAction) {

  const collisionFree = ( 
    new Set(state.snake.map( n => n.x + '|' +n.y)).size === state.snake.length
  );

  const restart = action.type === 'snake/tick' && action?.over === false

  if (!collisionFree &&  !restart) {
    return {
      ...state,
      over: true
    }
  }

  switch (action.type) {
    case 'snake/tick': {
      const [head] = state.snake;
      const newHead = {x: mod(head.x+state.dir.x,state.w), y: mod(head.y+state.dir.y,state.h)};
      const snake = [newHead, ...state.snake].slice(0, state.n);

      const hasEaten = +!!state
        .food
        .find(x => x.x == head.x && x.y == head.y);

      const expiredFood = state
        .food
        .filter(x => !(x.x === head.x && x.y === head.y))
        .filter(x => x.expires === 1)

      const food = state
        .food.map(x => ({...x, expires: !x.expires ? undefined : x.expires-1 } ))
        .filter(x => x.expires === undefined || x.expires > 0)
        .filter(x => !(x.x === head.x && x.y === head.y));

      const freshFood = (food.length == 0 || hasEaten) 
        ? [{x: Math.floor(Math.random()*state.w), y: Math.floor(Math.random()*state.h), expires: 100}] 
        : [];

      return {
        ...state,
        expiredFood,
        n: state.n + hasEaten*state.inc,
        score: state.score + hasEaten,
        food: [...food, ...freshFood],
        snake,
        ...action
      }
    }

    case 'snake/move': {
     
      const [head, prev = {x:-1, y:-1}] = state.snake;

      
      if ( (head.x + action.dir.x) === prev.x && head.y + action.dir.y === prev.y ) {
        return state;
      }

      return {
        ...state,
        dir: action.dir
      }
    }
  }
}


const color = (x:number) => "rgb("+count(3).map(() => Math.min(100, x*10)).join(',')+")"


export type SnakeProps = {
  timer: number,
  game: SnakeState,
  dispatch: React.Dispatch<SnakeAction>
}

export const snakeInitialState = (inc = 3): SnakeState => ({
  n: 5,
  inc,
  snake: [{x:5, y:5}],
  dir: {x:1, y:0},
  w: 12,
  h: 24,
  over: false,
  score: 0,
  food: [{x:2, y:2, expires: 1000}],
  time: 0,
  expiredFood: []
});


export function Snake({timer, game, dispatch}: SnakeProps) {

  useTimer(()=>dispatch({type:'snake/tick', time: +Date.now()}), timer);

  useKeyboardAction('keydown', {
    a: () => dispatch({type:'snake/move', dir:{x:-1, y: 0}}),
    s: () => dispatch({type:'snake/move', dir:{x: 0, y:+1}}),
    d: () => dispatch({type:'snake/move', dir:{x:+1, y: 0}}),
    w: () => dispatch({type:'snake/move', dir:{x: 0, y: -1}})
  });

  return (
    <svg style={{flexGrow: 1, width: "100%", height: "100%"}} viewBox={`0 0 ${game.w*10} ${game.h*10}`}>
      <defs>
          <pattern id="smallGrid" width="10" height="10" patternUnits="userSpaceOnUse">
            <path d="M 10 0 L 0 0 0 10" fill="none" stroke="gray" strokeWidth="0.5"/>
          </pattern>
      </defs>
          
      <rect width="100%" height="100%" fill="url(#smallGrid)" />
      {
        game.snake.map( (n,i) =>  
          <rect key={i} x={n.x*10} y={n.y*10} fill={color(i)} width="10" height="10" />  
        )
      }

      {
        game.food.map( (n, i) => 
          <rect key={i} x={n.x*10} y={n.y*10} fill={`rgba(150, 0, 0, ${n.expires ? n.expires/100: 0})`} width="10" height="10" />  
        )
      }

    </svg>
  )
}