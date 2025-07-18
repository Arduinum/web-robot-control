from pydantic_settings import BaseSettings, SettingsConfigDict


class ModelConfig(BaseSettings):
    """Модель конфига"""
    
    model_config = SettingsConfigDict(
        env_file = '.env', 
        env_file_encoding='utf-8',
        extra='ignore'
    )


class CommandsRobot(ModelConfig):
    """Класс с командами для робота"""

    forward: str
    backward: str
    left: str
    right: str

    def get_list_commands(self):
        """Метод вернёт список всех команд"""
        
        return list(self.model_dump().values())


class Settings(ModelConfig):
    """Класс для данных конфига"""

    stream_url: str
    websocket_url_robot: str
    commands_robot: CommandsRobot = CommandsRobot()


settings = Settings()
