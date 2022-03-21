import * as grpc from '@grpc/grpc-js';
import { sendUnaryData, ServerUnaryCall, Server, ServerCredentials } from '@grpc/grpc-js';
import { Training } from './proto/trainings_pb'
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { ITrainingsServer, TrainingsService } from './proto/trainings_grpc_pb';

export class TrainingsServer implements ITrainingsServer {

    getTraining(call: ServerUnaryCall<Empty, Training>, callback: sendUnaryData<Training>) {
        const training = new Training();
        training.setId(1);
        training.setName('TestTraining');
        training.setDescription('Description');
        callback(null, training);
    }

    public start() {
        const server = new grpc.Server();
        server.addService(TrainingsService, {getAll: this.getAllTrainings});
        server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {
            server.start();        
        });
        this.server = server;
    }
}