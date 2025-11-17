// Ждём, пока загрузится весь контент DOM
document.addEventListener("DOMContentLoaded", () => {
    // Создаём WebSocket-соединение с сервером
    const ws = new WebSocket(`ws://${window.location.host}/ws`);
 
    // Делаем запрос к серверу на эндпоинт "/config"
    fetch('/config')
        .then(response => response.json()) // Преобразуем ответ в JSON
        .then(data => {
            // Получаем значение stream_url из ответа
            const streamUrl = data.stream_url;
            const videoElement = document.getElementById("video-stream");
            // Устанавливаем URL видеопотока в элемент <video>
            videoElement.src = streamUrl;
        });
    
    // Обработчик события открытия WebSocket-соединения
    ws.onopen = function() {
        console.log("WebSocket клиента подключен");
    };

    // Обработчик события получения сообщения по WebSocket
    ws.onmessage = function(event) {
        console.log("Получено:", event.data); // Выводим полученные данные
    };

    // Обработчик события закрытия WebSocket-соединения
    ws.onclose = function() {
        console.log("WebSocket клиента закрыт");
    };

    // Обработчик ошибок WebSocket
    ws.onerror = function(error) {
        console.log("WebSocket ошибка:", error); // Логируем ошибку
    };
    
    let commandInterval;

    // Функция для начала отправки команды с заданным интервалом
    function startSendingCommand(command) {
        // Отправляем команду сразу
        sendCommand(JSON.stringify(command));

        // Запускаем интервал для повторной отправки команды
        commandInterval = setInterval(() => {
            sendCommand(JSON.stringify(command)); // Повторяем отправку команды
        }, 10); // Интервал отправки — каждые 100 мс
    }

    // Функция для остановки отправки команд
    function stopSendingCommand() {
        // Останавливаем интервал
        clearInterval(commandInterval);
    }

    // Функция для отправки команды через WebSocket
    function sendCommand(command) {
        if (ws.readyState === WebSocket.OPEN) {
            ws.send(command); // Отправляем команду через WebSocket
            console.log("Команда:", command); // Логируем отправленную команду
        } else {
            console.log("WebSocket клиента не подключён"); // Если WebSocket не открыт
        }
    }

    // Команда остановки
    const commandStop = { "command": "stop" };

    let command = null;
    let currentCommand = null;

    // Управление кнопками мыши
    function robotControlButton(buttonId, commandName) {
        const button = document.getElementById(buttonId);
        if (!button) return;

        button.addEventListener("mousedown", () => {
            if (currentCommand !== commandName) {
                currentCommand = commandName;
                startSendingCommand({command: commandName});
            }
        });

        const stopHandler = () => {
            if (currentCommand === commandName) {
                sendCommand(JSON.stringify(commandStop));
                stopSendingCommand();
                currentCommand = null;
            }
        };

        button.addEventListener("mouseup", stopHandler);
        button.addEventListener("mouseleave", stopHandler);
    }

    // Инициализация кнопок
    robotControlButton("forward-button", "forward");
    robotControlButton("backward-button", "backward");
    robotControlButton("left-button", "left");
    robotControlButton("right-button", "right");

    const keyMap = {
        forwardKeys: ["w", "arrowup", "8"],
        backwardKeys: ["s", "arrowdown", "2"],
        leftKeys: ["a", "arrowleft", "4"],
        rightKeys: ["d", "arrowright", "6"]
    };

    let activeKey = null; // конкретная активная клавиша

    document.addEventListener("keydown", (event) => {
        const key = event.key.toLowerCase();

        // если уже нажата какая-то клавиша — игнорируем новую
        if (activeKey) return;

        if (keyMap.forwardKeys.includes(key)) {
            command = "forward";
        } else if (keyMap.backwardKeys.includes(key)) {
            command = "backward";
        } else if (keyMap.leftKeys.includes(key)) {
            command = "left";
        } else if (keyMap.rightKeys.includes(key)) {
            command = "right";
        } else {
            return; // неуправляющая клавиша
        }

        if (command !== currentCommand) {
            activeKey = key; // запоминаем, какая клавиша активна
            currentCommand = command;

            startSendingCommand({ "command": command });
        }
    });

    document.addEventListener("keyup", (event) => {
        const key = event.key.toLowerCase();

        // сработает стоп только если отпущена именно активная клавиша
        if (key === activeKey) {
            sendCommand(JSON.stringify(commandStop));
            stopSendingCommand();

            activeKey = null;
            command = null;
            currentCommand = null;
        }
    });
});