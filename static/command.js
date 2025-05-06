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
        console.log("WebSocket подключен");
    };

    // Обработчик события получения сообщения по WebSocket
    ws.onmessage = function(event) {
        console.log("Получено:", event.data); // Выводим полученные данные
    };

    // Обработчик события закрытия WebSocket-соединения
    ws.onclose = function() {
        console.log("WebSocket закрыт");
    };

    // Обработчик ошибок WebSocket
    ws.onerror = function(error) {
        console.log("WebSocket ошибка:", error); // Логируем ошибку
    };
    
    let commandInterval;

    // Функция для начала отправки команды с заданным интервалом
    function startSendingCommand(command) {
        // Отправляем команду сразу
        sendCommand(command);

        // Запускаем интервал для повторной отправки команды
        commandInterval = setInterval(() => {
            sendCommand(command); // Повторяем отправку команды
        }, 10); // Интервал отправки — каждые 10 мс
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
            console.log("WebSocket не подключён"); // Если WebSocket не открыт
        }
    }

    // Назначение обработчиков событий для кнопки "Вперёд"
    const forwardButton = document.getElementById("forward-button");
    forwardButton.addEventListener("mousedown", () => startSendingCommand("forward")); // Начало отправки команды
    forwardButton.addEventListener("mouseup", stopSendingCommand); // Остановка отправки при отпускании кнопки
    forwardButton.addEventListener("mouseleave", stopSendingCommand); // Остановка отправки, если курсор уходит с кнопки

    // Назначение обработчиков событий для кнопки "Влево"
    const leftButton = document.getElementById("left-button");
    leftButton.addEventListener("mousedown", () => startSendingCommand("left"));
    leftButton.addEventListener("mouseup", stopSendingCommand);
    leftButton.addEventListener("mouseleave", stopSendingCommand);

    // Назначение обработчиков событий для кнопки "Вправо"
    const rightButton = document.getElementById("right-button");
    rightButton.addEventListener("mousedown", () => startSendingCommand("right"));
    rightButton.addEventListener("mouseup", stopSendingCommand);
    rightButton.addEventListener("mouseleave", stopSendingCommand);

    // Назначение обработчиков событий для кнопки "Назад"
    const backwardButton = document.getElementById("backward-button");
    backwardButton.addEventListener("mousedown", () => startSendingCommand("backward"));
    backwardButton.addEventListener("mouseup", stopSendingCommand);
    backwardButton.addEventListener("mouseleave", stopSendingCommand);
});