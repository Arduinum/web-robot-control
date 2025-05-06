from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    """Класс для данных конфига"""
    
    model_config = SettingsConfigDict(
        env_file = '.env', 
        env_file_encoding='utf-8',
        extra='ignore'
    )

    stream_url: str


settings = Settings()
