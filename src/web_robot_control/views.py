from fastapi import APIRouter, WebSocket, WebSocketDisconnect, WebSocketException
from fastapi.requests import Request
from fastapi.responses import HTMLResponse, Response
from fastapi.templating import Jinja2Templates
from websockets import exceptions, connect
import asyncio
import socket
from json import loads, JSONDecodeError

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


async def command_to_robot(command: str) -> str:
    """Асинхронная функция для отправки команды роботу через websockets"""

    try:
        async with connect(settings.websocket_url_robot) as robot_ws:
            await robot_ws.send(command)
            response = await robot_ws.recv()
            return response
    # Todo: для каждой ошибки написать своё сообщение
    except (
        exceptions.InvalidURI, 
        asyncio.TimeoutError,
        exceptions.ConnectionClosedError,
        exceptions.ConnectionClosedOK,
        exceptions.InvalidHandshake,
        ConnectionRefusedError,
        socket.gaierror,
        exceptions.InvalidMessage
        ) as err:
        return f'{err.__class__.__name__}: {err}'


@router.websocket('/ws')
async def websocket_endpoint(websocket: WebSocket) -> None:
    """Эндпоинт для обработки команд фронтенда"""
    
    # Установка содединения по веб-сокету
    await websocket.accept()
    
    try:
        previous_command = None
        
        while True:
            # Получение команды от клиента (с веб-сокета)
            response = await websocket.receive_text()
            data = loads(response)
            command = data.get('command')

            if previous_command != command:
                previous_command = command
                valid_commands = settings.commands_robot.get_list_commands()
                
                if command in valid_commands:
                    # оптравка команды роботу
                    robot_answer = await command_to_robot(command=response)
                    
                    if robot_answer:
                        # отправка ответа робота на вебсокет фронтенда
                        await websocket.send_text(f'Получена команда: {command}, ответ робота: {robot_answer}')
    except WebSocketDisconnect:
        print('WebSocket отключен')
    except (WebSocketException, exceptions.InvalidMessage) as err:
        print(f'{err.__class__.__name__}: {err}')
    except JSONDecodeError:
        print('Ошибка при декодировании JSON')
