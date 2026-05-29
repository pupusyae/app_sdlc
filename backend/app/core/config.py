from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    DATABASE_URL: str = "postgresql://postgres:password123@db:5432/cognitive_sdlc"
    REDIS_URL: str = "redis://redis:6379/0"
    LLM_PROVIDER: str = "openai"
    LLM_API_KEY: str = ""
    LLM_MODEL: str = "gpt-4o"
    MAX_CONTEXT_TOKENS: int = 4000
    EMBEDDING_DIMENSIONS: int = 1536
    FATIGUE_THRESHOLD: int = 10
    FATIGUE_WINDOW_SECONDS: int = 3600
    PREDICTIVE_DRIFT_SIMILARITY_THRESHOLD: float = 0.3
    JWT_SECRET: str = "cognitive-governance-jwt-secret-change-in-production"
    JWT_ALGORITHM: str = "HS256"
    JWT_EXPIRATION_HOURS: int = 24
    ENCRYPTION_KEY: str = "cognitive-governance-fernet-key-change-me"

    class Config:
        env_file = ".env"


settings = Settings()
