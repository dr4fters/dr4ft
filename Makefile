IMAGE_NAME = dr4ft-app
CONTAINER_NAME = $(IMAGE_NAME)-container


.DEFAULT_GOAL = help


.PHONY: docker
docker:  ## Build docker image
	docker build -t $(IMAGE_NAME) .


.PHONY: docker-run
docker-run:  ## Run app in docker container
	docker run --name $(CONTAINER_NAME) -dp 1337:1337 $(IMAGE_NAME)


.PHONY: docker-stop
docker-stop:  ## Stop running docker container
	docker stop $(CONTAINER_NAME) > /dev/null 2>&1 || true
	docker container rm $(CONTAINER_NAME) > /dev/null 2>&1 || true


.PHONY: docker-restart
docker-restart: docker-stop docker-run  ## Stop, re-build, then re-run docker container


.PHONY: docker-logs
docker-logs:  ## Follow logs from running docker container
	docker logs -f $(CONTAINER_NAME)


# Output help string for each target.
# With thanks to: https://marmelab.com/blog/2016/02/29/auto-documented-makefile.html
.PHONY: help
help:  ## Show this help
	@awk 'BEGIN {FS = ":.*?## "} /^[a-zA-Z_-]+:.*?## / {printf "\033[36m%-30s\033[0m %s\n", $$1, $$2}' $(MAKEFILE_LIST)
