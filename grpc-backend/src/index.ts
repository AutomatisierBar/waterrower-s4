import { credentials } from "@grpc/grpc-js";
import express from "express"
import { DatabaseClient } from "./database_client";
import { TrainingsServer } from "./grpc_protobuffer_server";
import { TrainingsClient } from "./proto/trainings_grpc_pb";
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';

const app = express()
const grpc_server = new TrainingsServer();
grpc_server.start();
const port = 9999;
app.set('json spaces', 2)

const databaseClient = new DatabaseClient();

// start the express server
app.listen( port, () => {
    console.log('server started at http://localhost:' + port);
});