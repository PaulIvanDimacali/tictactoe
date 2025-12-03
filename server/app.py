import uvicorn

if __name__ == "__app__":
    uvicorn.run("main:app", host="localhost", port="8000", reload=True)

