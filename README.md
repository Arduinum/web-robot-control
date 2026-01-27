# Web-robot-control

**Web-robot-control** - open source веб-приложение для управлением роботом и трансляции видео с веб-камеры.

## Запуск приложения (Linux / Mac OS)

**Способ 1 (локальная разработка)**

- **Клонировать репозиторий**: `git clone git@github.com:Arduinum/web-robot-control.git`
- **Перейти в папку проекта**: `cd web-robot-control`
- **Установить библиотеки проекта**: `poetry install`
- **Создать `.env` в корне проекта используя `.env.example` в качестве шаблона**
- **Запуск приложения**: `poetry run start_app`

### Способ 2 (с использованим `docker-compose.yml`)

- **Клонировать репозиторий**: `git clone git@github.com:Arduinum/web-robot-control.git`
- **Перейти в папку проекта**: `cd web-robot-control`
- **Создать `.env` в корне проекта используя `.env.example` в качестве шаблона**
- **Скачать образ**: `make docker-pull`
- **Создать volume**: `docker volume create app`
- **Запуск приложения**: `make start-app`

### Способ 3 (с использованием docker)

- **Создать `.env` в любом удоном месте используя `.env.example` в качестве шаблона**
- **Скачать образ**: `docker pull arduinum628/web-robot-control-app`
- **Создать volume**: `docker volume create app`
- **Создать `.env` в корне проекта используя `.env.example` в качестве шаблона**
- **Экспорт `.env` переменных**: `export $(grep -v '^#' .env | xargs)`
- **Запуск приложения**: `docker run -d --name web_robot_control -p ${PORT_APP}:${PORT_APP} -v app:/app --env-file .env arduinum628/web-robot-control-app:latest poetry run start_app`

## Запуск приложения (Windows)

**Способ 1 (локальная разработка)**

- **Клонировать репозиторий**: `git clone git@github.com:Arduinum/web-robot-control.git`
- **Перейти в папку проекта**: `cd web-robot-control`
- **Установить библиотеки проекта**: `poetry install`
- **Создать `.env` в корне проекта используя `.env.example` в качестве шаблона**
- **Запуск приложения**: `poetry run start_app`

### Способ 2 (с использованим `docker-compose.yml`)

- **Клонировать репозиторий**: `git clone git@github.com:Arduinum/web-robot-control.git`
- **Перейти в папку проекта**: `cd web-robot-control`
- **Создать `.env` в корне проекта используя `.env.example` в качестве шаблона**
- **Скачать образ**: `docker compose pull`
- **Создать volume**: `docker volume create app`
- **Запуск приложения**: `docker compose up -d`

### Способ 3 (с использованием docker)

- **Создать `.env` в любом удоном месте используя `.env.example` в качестве шаблона**
- **Скачать образ**: `docker pull arduinum628/web-robot-control-app`
- **Создать volume**: `docker volume create app`
- **Создать `.env` в корне проекта используя `.env.example` в качестве шаблона**
- **Экспорт `.env` переменных**: `export $(grep -v '^#' .env | xargs)`
- **Запуск приложения**: `docker run -d --name web_robot_control -p $env:PORT_APP:$env:PORT_APP -v app:/app --env-file .env arduinum628/web-robot-control-app:latest poetry run start_app`

<details>
	<summary>
		<strong>
			Как оформлять ветки и коммиты
		</strong>
	</summary>
	
	Пример ветки `user_name/name_task`
	
    - **user_name** (имя пользователя);
    - **name_task** (название задачи).
	
	Пример коммита `refactor: renaming a variable`
	
	- **feat:** (новая функционал кода, БЕЗ учёта функционала для сборок);
	- **devops:** (функционал для сборки, - добавление, удаление и исправление);
	- **fix:** (исправление ошибок функционального кода);
	- **docs:** (изменения в документации);
	- **style:** (форматирование, отсутствующие точки с запятой и т.п., без изменения производственного кода);
	- **refactor:** (рефакторинг производственного кода, например, переименование переменной);
	- **test:** (добавление недостающих тестов, рефакторинг тестов; без изменения производственного кода);
	- **chore:** (обновление рутинных задач и т. д.; без изменения производственного кода).
	
	Оформление основано на https://www.conventionalcommits.org/en/v1.0.0/
</details>