proto_server_src := ./grpc-backend/src
proto_server_out := $(proto_server_src)/proto
proto_client_src := ./client
proto_client_out := $(proto_client_src)/proto
npm_bin := ./grpc-backend/node_modules/.bin
grpc_tools_node_protoc := $(npm_bin)/grpc_tools_node_protoc
grpc_tools_node_protoc_plugin := $(npm_bin)/grpc_tools_node_protoc_plugin
protoc-gen-ts := $(npm_bin)/protoc-gen-ts

.PHONY: npm_install generate run clean start_database

npm_install:
	cd $(proto_server_src) && \
	npm install

pip_install:
	cd $(proto_client_src) && \
	pip install -r requirements.txt

generate_client: pip_install
	mkdir -p $(proto_client_out)
	python -m grpc_tools.protoc \
		--python_out=$(proto_client_out) \
		--grpc_python_out=$(proto_client_out) \
		-I ./proto \
		./proto/trainings.proto

generate_server: npm_install
	mkdir -p $(proto_server_out)
	$(grpc_tools_node_protoc) \
 		--js_out=import_style=commonjs,binary:$(proto_server_out) \
 		--grpc_out=grpc_js:$(proto_server_out) \
 		-I ./proto \
 		 ./proto/trainings.proto
	$(grpc_tools_node_protoc) \
 		--ts_out=$(proto_server_out) \
 		--plugin=protoc-gen-grpc=$(grpc_tools_node_protoc_plugin) \
 		-I ./proto \
 		./proto/trainings.proto

generate: generate_client generate_server

start_database:
	cd devOps/docker && \
	docker-compose up -d

run:
	cd $(proto_server_src) && \
	npm run start
clean:
	rm -rf $(proto_server_out)/*.ts
	rm -rf $(proto_server_out)/*.js