help:
	@echo "Доступные команды:"
	@echo "  make docker-build    - Собрать Docker образ"
	@echo "  make docker-rebuild  - Пересобрать Docker образ (с очисткой кеша)"
	@echo "  make start-app-debug - Поднять контейнер с приложением (в режиме debug)"
	@echo "  make start-app       - Поднять контейнер с приложением"
	@echo "  make stop-app        - Остановить контейнер с приложением"
	@echo "  make docker-pull     - Скачать образ web-robot-control-app c Docker Hub"

docker-build:
	docker compose build

docker-rebuild:
	docker compose build --no-cache

start-app-debug:
	docker compose up

start-app:
	docker compose up -d

stop-app:
	docker stop web_robot_control

docker-pull:
	docker pull arduinum628/web-robot-control-app