import express from "express"
import { DatabaseClient } from "./database_client";
import { GrpcProtobufferServer } from "./grpc_protobuffer_server";

const app = express()
const grpc_server = new GrpcProtobufferServer();
grpc_server.start();
const port = 9999;
app.set('json spaces', 2)

const databaseClient = new DatabaseClient();

// start the express server
app.listen( port, () => {
    console.log('server started at http://localhost:' + port);
});