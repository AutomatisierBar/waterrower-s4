import { sendUnaryData, ServerUnaryCall, Server, ServerCredentials, status} from '@grpc/grpc-js';
import services from './proto/trainings_grpc_pb';
import { Empty } from 'google-protobuf/google/protobuf/empty_pb';
import { Training as ProtoTraining } from './proto/trainings_pb'
import { Training as PrismaTraining } from '@prisma/client';
import { DatabaseClient } from './database_client';
export class GrpcProtobufferServer {

    private databaseClient!: DatabaseClient;

    public GrpcProtobufferServer(databaseClient: DatabaseClient) {
        this.databaseClient = databaseClient
    }

    getTraining(call: ServerUnaryCall<Empty, ProtoTraining>, callback: sendUnaryData<ProtoTraining>) {
        const id = 1
        this.databaseClient.getTraining(id)
            .then((prismaTraining: PrismaTraining|null) => {
                if(prismaTraining != null) {
                    const training = this.convertToProtoTraining(prismaTraining);
                    callback(null, training);
                } else {
                    callback(null, null);
                }        
            })
            .catch(err => {
                console.error('Unable to load training from database for id: ' + id, err)
                
                callback({
                    code: status.INTERNAL,
                    message: 'Unable to load training from database for id: ' + id
                }, null);
            })
    }

    public start() {
        const server = new Server();
        server.addService(services.TrainingsService, {getTraining: this.getTraining});
        server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {
            server.start();        
        });
    }

    private convertToProtoTraining(prismaTraining: PrismaTraining): ProtoTraining {
        const training = new ProtoTraining()
        training.setId(prismaTraining.id)
        training.setName(prismaTraining.name)
        training.setDescription(prismaTraining.description != null ? prismaTraining.description : '')
        return training;
    }
}