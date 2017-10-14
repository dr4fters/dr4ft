.PHONY: all install clean cards score js config
all: install cards score js

node := ${CURDIR}/node_modules
all_sets := ${CURDIR}/data/AllSets.json
webpack := ${node}/.bin/webpack

client_config := config.client.js
server_config := config.server.js

${webpack}: install

install:
	npm install
	mkdir -p public/lib
	ln -sf ${node}/normalize.css/normalize.css public/lib
	ln -sf ${node}/react/umd/react.development.js public/lib/react.js
	ln -sf ${node}/react-dom/umd/react-dom.development.js public/lib/react-dom.js
	ln -sf ${node}/engine.io-client/engine.io.js public/lib
	ln -sf ${node}/ee/ee.js public/lib
	ln -sf ${node}/utils/utils.js public/lib

clean:
	rm -f ${all_sets}

cards: ${all_sets}
	node src/make cards

custom:
	node src/make custom

${all_sets}:
	curl -so ${all_sets} https://mtgjson.com/json/AllSets.json

score:
	-node src/make score

js: ${webpack} ${all_sets} ${client_config} ${server_config}
	${webpack}

# "order-only" prerequisite
${client_config}: | ${client_config}.default
	cp $| $@
${server_config}: | ${server_config}.default
	cp $| $@
config: ${client_config} ${server_config}

run: js ${server_config}
	node run
