from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from uuid import uuid4


app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/hello-world")
def hello_world():
    return {"message": "Hello World!"}

class GameState(BaseModel):
    id: str
    board: List[Optional[str]]
    next_player: str
    winner: Optional[str]
    draw: bool

class MoveRequest(BaseModel):
    player: str
    position: int

class TicTacToe:
    def __init__(self):
        self.reset()

    def reset(self):
        self.board: List[Optional[str]] = [None] * 9
        self.next_player = "X"
        self.winner: Optional[str] = None
        self.draw = False

    def make_move(self, player: str, pos: int):
        if self.winner or self.draw:
            raise ValueError("Game already finished")
        if player != self.next_player:
            raise ValueError("Not this player's turn")
        if pos < 0 or pos > 8:
            raise ValueError("Position out of range")
        if self.board[pos] is not None:
            raise ValueError("Position already taken")
        self.board[pos] = player
        self._update_status()
        if not self.winner and not self.draw:
            self.next_player = "O" if player == "X" else "X"

    def _update_status(self):
        lines = [
            (0,1,2),(3,4,5),(6,7,8),
            (0,3,6),(1,4,7),(2,5,8),
            (0,4,8),(2,4,6)
        ]
        for a,b,c in lines:
            if self.board[a] and self.board[a] == self.board[b] == self.board[c]:
                self.winner = self.board[a]
                return
        if all(cell is not None for cell in self.board):
            self.draw = True

    def to_state(self, id: str) -> GameState:
        return GameState(id=id, board=self.board.copy(), next_player=self.next_player, winner=self.winner, draw=self.draw)

games: dict[str, TicTacToe] = {}

@app.post("/games", response_model=GameState)
def create_game():
    gid = str(uuid4())
    g = TicTacToe()
    games[gid] = g
    return g.to_state(gid)

@app.get("/games/{game_id}", response_model=GameState)
def get_game(game_id: str):
    g = games.get(game_id)
    if not g:
        raise HTTPException(status_code=404, detail="Game not found")
    return g.to_state(game_id)

@app.post("/games/{game_id}/moves", response_model=GameState)
def move(game_id: str, req: MoveRequest):
    g = games.get(game_id)
    if not g:
        raise HTTPException(status_code=404, detail="Game not found")
    try:
        g.make_move(req.player, req.position)
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    return g.to_state(game_id)

@app.post("/games/{game_id}/reset", response_model=GameState)
def reset_game(game_id: str):
    g = games.get(game_id)
    if not g:
        raise HTTPException(status_code=404, detail="Game not found")
    g.reset()
    return g.to_state(game_id)