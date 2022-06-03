VERSION_INFO ?= $$(git describe --tags)
IMAGE ?= dr4ft-app
CONTAINER ?= $(IMAGE)-container
PORT ?= 1337


# Show makefile help by default
.DEFAULT_GOAL = help

CACHE_OFF=0
ifeq ($(CACHE_OFF), 1)
	NO_CACHE_FLAG = --no-cache
else
	NO_CACHE_FLAG =
endif
.PHONY: docker
docker:  ## Build docker image
	@echo "Building with version info $(VERSION_INFO)"
	docker build $(NO_CACHE_FLAG) \
		--build-arg VERSION_INFO=$(VERSION_INFO) \
		-t $(IMAGE) .


.PHONY: docker-run
docker-run: docker-stop docker  ## Run app in docker container
	docker run -d \
		--name $(CONTAINER) \
		--env "PORT=$(PORT)" \
		-p $(PORT):$(PORT) \
		$(IMAGE)
	@echo "##########################################"
	@echo "Dr4ft now running at http://localhost:$(PORT)"
	@echo "##########################################"


.PHONY: docker-stop
docker-stop:  ## Stop running docker container
	docker stop $(CONTAINER) > /dev/null 2>&1 || true
	docker container rm $(CONTAINER) > /dev/null 2>&1 || true


.PHONY: docker-logs
FOLLOW := -f
docker-logs:  ## Show logs from running docker container
	docker logs $(FOLLOW) $(CONTAINER)


.PHONY: docker-test
docker-test: docker  ## Run tests in docker container
	docker run --rm \
		--entrypoint npm \
		$(IMAGE) run test:js


.PHONY: docker-lint
docker-lint: docker  ## Lint code in docker container
	docker run --rm \
		--entrypoint npm \
		$(IMAGE) run lint


.PHONY: docker-clean
docker-clean: docker-stop  ## Remove any built docker images
	docker rmi -f $$(docker images -q $(IMAGE)) > /dev/null 2>&1 || true


# Output help string for each target.
# With thanks to: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help:  ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
