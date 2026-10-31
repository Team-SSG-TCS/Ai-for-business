from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.api import api_router
import uvicorn

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI Microservice for AI Tasks & LLM Orchestration",
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    docs_url="/docs",
    redoc_url="/redoc",
)

# Set up CORS middleware for team collaboration
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGINS,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Index
@app.get("/", tags=["General"])
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "endpoints": {
            "chat": f"{settings.API_V1_STR}/chat",
            "analyze": f"{settings.API_V1_STR}/analyze",
        }
    }

# Health Check Route
@app.get("/health", tags=["General"])
async def health_check():
    return {
        "status": "online",
        "service": "ai-fastapi",
        "provider": settings.AI_PROVIDER,
        "model": settings.AI_MODEL_NAME,
    }

# Include API v1 Routes
app.include_router(api_router, prefix=settings.API_V1_STR)

if __name__ == "__main__":
    print(f"Starting FastAPI AI service on http://{settings.HOST}:{settings.PORT}")
    print(f"Interactive Swagger Docs available at http://localhost:{settings.PORT}/docs")

    uvicorn.run(
        "main:app",
        host=settings.HOST,
        port=settings.PORT,
        reload=settings.DEBUG
    )