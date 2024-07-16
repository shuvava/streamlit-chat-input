.DEFAULT_GOAL := help

GREEN  := $(shell tput -Txterm setaf 2)
YELLOW := $(shell tput -Txterm setaf 3)
WHITE  := $(shell tput -Txterm setaf 7)
CYAN   := $(shell tput -Txterm setaf 6)
RESET  := $(shell tput -Txterm sgr0)

guard-%:
	@if [ "${${*}}" = "" ]; then \
		echo "Run pipenv shell before command" && exit 1; \
	fi

freeze: guard-PIPENV_ACTIVE ## creates/updates requirements.txt file
	pipenv requirements > requirements.txt

install: ## install dependencies
	pip3 install pipenv
	pipenv install
	mkdir -p ./chat_input_advanced/frontend/node_modules
	npm install --prefix ./chat_input_advanced/frontend

build:
	npm --prefix ./chat_input_advanced/frontend run build
	python3 -m build

publish: clean build ## publish component to testpip
	python3 -m twine upload --repository testpypi dist/*

activate: ## activate python virtual environment
	pipenv shell

run: guard-PIPENV_ACTIVE ## runs streamlit application
	streamlit run example.py

serv: ## run debug version of component
	npm run start --prefix ./chat_input_advanced/frontend

clean: clean-build clean-pyc ## remove all build and Python artifacts

clean-build:
	rm -fr .eggs/
	find . -name '*.egg-info' -exec rm -fr {} +
	find . -name '*.egg' -exec rm -f {} +
	rm -fr ./dist/

clean-pyc:
	find . -name '*.pyc' -exec rm -f {} +
	find . -name '*.pyo' -exec rm -f {} +
	find . -name '__pycache__' -exec rm -fr {} +


help: ## prints this message
	@echo 'Targets:'
	@awk 'BEGIN {FS = ":.*?## "} { \
		if (/^[a-zA-Z0-9_-]+:.*?##.*$$/) {printf "    ${YELLOW}%-20s${GREEN}%s${RESET}\n", $$1, $$2} \
		else if (/^## .*$$/) {printf "  ${CYAN}%s${RESET}\n", substr($$1,4)} \
		}' $(MAKEFILE_LIST)
