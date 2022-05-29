IMAGE_NAME = dr4ft-app
CONTAINER_NAME = $(IMAGE_NAME)-container


.PHONY: docker
docker:
	docker build -t $(IMAGE_NAME) .


.PHONY: docker-run
docker-run:
	docker run --name $(CONTAINER_NAME) -dp 1337:1337 $(IMAGE_NAME)


.PHONY: docker-logs
docker-logs:
	docker logs -f $(CONTAINER_NAME)


.PHONY: docker-stop
docker-stop:
	docker stop $(CONTAINER_NAME)
	docker container rm $(CONTAINER_NAME)


.PHONY: init-sets
init:
	npm run download_allsets
	npm run update_database
	npm run download_booster_rules
