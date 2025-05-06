from fastapi import FastAPI
from starlette.staticfiles import StaticFiles

from web_robot_control.views import router


# создаем экземпляр FastAPI
app = FastAPI()

# подключаем статические файлы
app.mount('/static', StaticFiles(directory='static'), name='static')

# подключаем роутер
app.include_router(router)
