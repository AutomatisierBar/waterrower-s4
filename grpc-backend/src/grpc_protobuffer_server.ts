import { sendUnaryData, ServerUnaryCall, Server, ServerCredentials } from '@grpc/grpc-js';
import services from './proto/trainings_grpc_pb';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Training } from './proto/trainings_pb';
export class GrpcProtobufferServer {

    getTraining(call: ServerUnaryCall<Empty, Training>, callback: sendUnaryData<Training>) {
        const training = new Training();
        training.setId(1);
        training.setName('TestTraining');
        training.setDescription('Description');
        callback(null, training);
    }

    public start() {
        const server = new Server();
        server.addService(services.TrainingsService, {getTraining: this.getTraining});
        server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {
            server.start();        
        });
    }
}