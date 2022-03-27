import { DatabaseClient } from "./database_client";
import { GrpcProtobufferServer } from "./grpc_protobuffer_server";

const database_client = new DatabaseClient()
const grpc_server = new GrpcProtobufferServer(database_client)
grpc_server.start();