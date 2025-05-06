from fastapi import APIRouter, WebSocket
from fastapi.requests import Request
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates

from starlette.websockets import WebSocketDisconnect
import httpx

from web_robot_control.settings import settings


# Создаем объект роутера
router = APIRouter()

# Создаём объект для рендеринга html-шаблонов
templates = Jinja2Templates(directory='static')


@router.get('/', response_class=HTMLResponse)
async def index(request: Request) -> Response:
    """
    Асинхронная функция для получения главной страницы приложения.
    """

    return templates.TemplateResponse(
        request=request,
        name='index.html',
        context={'title': 'Web-robot-control - Главная', 'name_robot': 'Bot1'}
    )

@router.get('/config')
async def get_config() -> dict:
    """Aсинхронная функция для получения stream_url."""

    return {'stream_url': settings.stream_url}


@router.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket) -> None:
    # Установка содединения по веб-сокету
    await websocket.accept()
    
    try:
        async with httpx.AsyncClient() as client:
            while True:
                # Получение команды от клиента (с веб-сокета)
                command = await websocket.receive_text()
                print(f'Получена команда: {command}')

                # Todo: здесь будет логика валидации команд

                # Todo: здесь будет логика обработки команды
                
    except WebSocketDisconnect:
        print('WebSocket отключен')  # Todo: для вывода ошибок будет настроен logger
    # Todo: вместо Exception будут добавлена ловля других ошибок 
    # (после того как функция будет полностью дописана)
    except Exception as err:
        err_text = f'Ошибка: {str(err)}'
        await websocket.send_text(err_text)
        print(err_text)
