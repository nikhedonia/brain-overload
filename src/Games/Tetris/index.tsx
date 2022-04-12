import { Button } from "@mui/material";
import { Box } from "@mui/system";
import { useKeyboardAction } from "../../Devices/keyboard";
import { useTimer } from "../../Devices/timer";
import { count } from "../../utils";
import { findShadow, merge } from "./actions";
import { TetrisAction, TetrisState } from "./reducer";

function blockColor(x: number) {
  switch (x) {
    default:
    case 0:
      return "#333333";
    case 1:
      return "#00ffff";
    case 2:
      return "#ffff00";
    case 3:
      return "#800080";
    case 4:
      return "#00ff00";
    case 5:
      return "#ff0000";
    case 6:
      return "#ff7f00";
    case 7:
      return "#0000ff";
    case 8:
      return "#7f7f7f";
  }
}

export type TetrisProps = {
  timer: number;
  game: TetrisState;
  dispatch: React.Dispatch<TetrisAction>;
};

export function Tetris({ timer, game, dispatch }: TetrisProps) {
  useKeyboardAction("keypress", {
    a: () => dispatch({ type: "tetris/move", x: -1, y: 0 }),
    d: () => dispatch({ type: "tetris/move", x: +1, y: 0 }),
    s: () => dispatch({ type: "tetris/tick" }),
    w: () => dispatch({ type: "tetris/rotate" }),
    " ": () => dispatch({ type: "tetris/drop" }),
    p: () => dispatch({ type: "tetris/punish", lines: 2 }),
  });

  useTimer(() => {
    if (game.over) return;
    dispatch({ type: "tetris/tick" });
  }, timer);

  return (
    <Box position="relative" display="flex" flexGrow={1}>
      <TetrisView timer={timer} game={game} dispatch={dispatch} />
      {game.over && (
        <Box
          p="1em"
          position="absolute"
          top="30%"
          bgcolor="rgba(250,250,250,0.8)"
          width="100%"
          textAlign="center"
        >
          <h2>Game Over</h2>
          <h3>Score: {game.lines}</h3>
          <Button
            variant="contained"
            onClick={() => {
              console.log("reset");
              dispatch({ type: "tetris/reset" });
            }}
          >
            Restart Game
          </Button>
        </Box>
      )}
    </Box>
  );
}

export function TetrisView({ game }: TetrisProps) {
  const shadow = game.piece && findShadow(game.board, game.piece);

  const boardWithPiece = merge(game.board, [
    game.piece,
    shadow?.y != game?.piece?.y ? shadow : null,
  ]);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        flexGrow: 1,
        aspectRatio: "1/2",
      }}
    >
      <table
        style={{
          flexGrow: 1,
          borderCollapse: "collapse",
        }}
      >
        <tbody>
          {[...count(24)].map((y) => (
            <tr key={y}>
              {[...count(12)].map((x) => (
                <td
                  key={x}
                  style={{
                    background:
                      !(y % 23) || !(x % 11)
                        ? "#ccc"
                        : blockColor(boardWithPiece[y - 1][x - 1]),
                    border: "solid 1px #eee",
                    aspectRatio: "1/1",
                    width: "1em",
                    height: "1em",
                  }}
                >
                  {" "}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
