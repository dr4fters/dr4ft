VERSION_INFO ?= $$(git describe --tags)
IMAGE ?= dr4ft-app
CONTAINER ?= $(IMAGE)-container


# Show makefile help by default
.DEFAULT_GOAL = help


.PHONY: docker
docker:  ## Build docker image
	@echo "Building with version info $(VERSION_INFO)"
	docker build \
	  --build-arg VERSION_INFO=$(VERSION_INFO) \
		-t $(IMAGE) .


.PHONY: docker-run
docker-run: docker  ## Run app in docker container
	docker run --name $(CONTAINER) -dp 1337:1337 $(IMAGE)
	@echo "##########################################"
	@echo "Dr4ft now running at http://localhost:1337"
	@echo "##########################################"


.PHONY: docker-stop
docker-stop:  ## Stop running docker container
	docker stop $(CONTAINER) > /dev/null 2>&1 || true
	docker container rm $(CONTAINER) > /dev/null 2>&1 || true


.PHONY: docker-restart
docker-restart: docker-stop docker-run  ## Stop, re-build, then re-run docker container


.PHONY: docker-logs
docker-logs:  ## Follow logs from running docker container
	docker logs -f $(CONTAINER)


.PHONY: docker-test
docker-test: docker  ## Run tests in docker image
	docker run --rm \
		--entrypoint npm \
		$(IMAGE) run test:js


.PHONY: docker-lint
docker-lint: docker  ## Lint code in docker image
	docker run --rm \
		--entrypoint npm \
		$(IMAGE) run lint


# Output help string for each target.
# With thanks to: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help:  ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
