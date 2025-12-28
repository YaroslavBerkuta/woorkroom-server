# -------- CONFIG --------
COMPOSE=docker compose
SERVICES=authorization companys gateway mails users

# -------- COMMANDS --------

up:
	$(COMPOSE) up -d

build:
	$(COMPOSE) build

down:
	$(COMPOSE) down

restart:
	$(COMPOSE) restart

logs:
	$(COMPOSE) logs -f

ps:
	$(COMPOSE) ps

# -------- PER SERVICE --------

restart-%:
	$(COMPOSE) restart $*

logs-%:
	$(COMPOSE) logs -f $*

build-%:
	$(COMPOSE) build $*

rebuild-%:
	$(COMPOSE) up -d --build $*

# -------- DEV HELPERS --------

# Перезапуск сервісу після змін у коді
dev-%:
	@echo "♻️  Restarting service: $*"
	$(COMPOSE) restart $*

# Перезапуск ВСІХ сервісів
dev:
	@echo "♻️  Restarting all services"
	$(COMPOSE) restart $(SERVICES)

# Жорсткий ресет
reset:
	$(COMPOSE) down
	$(COMPOSE) up -d --build
