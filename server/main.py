from fastapi import FastAPI

app = FastAPI()

origins = [
    "https://localhost:5173",
    "localhost:5173"
]

app.get("/", tags = ["root"])
async def read_root() -> dict:
    return {"message": "Welcome to Tic Tac Toe"}

