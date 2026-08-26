from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.analysis import router as analysis_router


app = FastAPI(
    title="Rural & Remote Healthcare Access Gap Mapper",
    version="0.1.0",
)


# Allow frontend to communicate with backend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Register analysis routes
app.include_router(analysis_router)


@app.get("/health")
def health_check():
    return {
        "status": "ok",
        "service": "poc51-healthcare-access-mapper",
    }