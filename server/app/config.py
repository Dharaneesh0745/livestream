from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    DATABASE_URL: str = "mongodb+srv://dharaneesh0745:Dhoni_007@cluster0.iou4p.mongodb.net/swmm"
    DATABASE_NAME: str = "swmm"

settings = Settings()
