import uvicorn

from web_robot_control.settings import settings


def start_app():
    """Функция запуска приложения"""

    uvicorn.run(
        'web_robot_control.main:app', 
        host=settings.host_app,
        port=settings.port_app,
        reload=settings.is_reload
    )
