import uvicorn


def start_app():
    """Функция запуска приложения"""

    uvicorn.run(
        'web_robot_control.main:app', 
        host='127.0.0.1',
        port=8000,
        reload=True
    )
