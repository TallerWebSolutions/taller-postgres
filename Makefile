.PHONY: run stop clean build

run:
	docker-compose run --rm development

stop:
	docker-compose stop

clean:
	docker-compose down
	docker volume ls -qf dangling=true | xargs -r docker volume rm

build:
	sh ./docker/dockerfile-ids.sh
	docker-compose build database
	docker-compose build development

database:
	docker exec -it pc-db psql -h localhost -U taller -d taller

default: run
