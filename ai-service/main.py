import sys

if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import HTMLResponse
from app.core.config import settings
from app.api.v1.api import api_router
from app.services.graph_visualizer import generate_interactive_html
import uvicorn

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.VERSION,
    description="FastAPI Microservice for Financial Crime AI & Graph Investigation",
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

# Interactive NetworkX Visualizer Route
@app.get("/graph-view", response_class=HTMLResponse, tags=["Visualization"])
async def get_graph_visualization(seed_id: str = Query(default="ALERT-001"), radius: int = Query(default=2)):
    """
    Returns an interactive full-screen network visualization powered by NetworkX and Vis.js.
    """
    return generate_interactive_html(seed_id=seed_id, radius=radius)

# Root Index
@app.get("/", tags=["General"])
async def root():
    return {
        "status": "online",
        "service": settings.PROJECT_NAME,
        "version": settings.VERSION,
        "docs": "/docs",
        "health": "/health",
        "graph_view": "/graph-view",
        "endpoints": {
            "graph": f"{settings.API_V1_STR}/graph",
            "investigation": f"{settings.API_V1_STR}/investigation",
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
    print(f"🚀 Starting FastAPI AI service on http://{settings.HOST}:{settings.PORT}")
    print(f"🕸️ Interactive Network Visualizer at http://localhost:{settings.PORT}/graph-view")
    print(f"📖 Interactive Swagger Docs available at http://localhost:{settings.PORT}/docs")
    uvicorn.run("main:app", host=settings.HOST, port=settings.PORT, reload=settings.DEBUG, reload_dirs=["app"])
