# managed-by: golden-path v1
APP_NAME := search-result
PKG_MGR ?= yarn
VTEX_SETUP ?= vtex setup
VTEX_LINK ?= vtex link

.DEFAULT_GOAL := help
SHELL := /usr/bin/env bash
.SHELLFLAGS := -o pipefail -c

.PHONY: help dev build test coverage lint format-check check link run clean

help: ## Show available targets
	@awk 'BEGIN {FS=":.*##"; printf "Targets:\n"} /^[a-zA-Z_-]+:.*##/ {printf "  \033[36m%-14s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)

dev: ## Install dependencies and prepare VTEX IO tooling
	@command -v node >/dev/null 2>&1 || { echo "node is required"; exit 1; }
	@command -v vtex >/dev/null 2>&1 || { echo "vtex CLI is required — run: npm i -g vtex"; exit 1; }
	$(PKG_MGR) install --frozen-lockfile
	cd react && $(PKG_MGR) install --frozen-lockfile
	$(VTEX_SETUP)

build: ## Validate app build inputs without publishing
	@echo "VTEX IO builds run on the platform via vtex link/publish."
	@echo "Run 'make check' for local validations before linking."

test: ## Run test suite (react builder, vtex-test-tools)
	cd react && $(PKG_MGR) test

coverage: ## Run tests with coverage
	cd react && $(PKG_MGR) test --coverage

lint: ## Run linter without auto-fix
	npx eslint --ext js,jsx,ts,tsx .

format-check: ## Check formatting without rewriting files
	npx prettier --check "**/*.{ts,tsx,js,jsx,json}"

check: lint test ## Run all quality checks (pre-PR gate)

link: ## Link app in the active VTEX development workspace
	@echo "This targets the active VTEX account/workspace. Confirm with 'vtex whoami' before running."
	$(VTEX_LINK)

run: link ## Alias for the VTEX IO platform development loop

clean: ## Remove local dependencies and coverage artifacts
	rm -rf node_modules react/node_modules react/coverage
