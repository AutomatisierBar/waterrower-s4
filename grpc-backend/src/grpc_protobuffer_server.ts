import { sendUnaryData, ServerUnaryCall, Server, ServerCredentials, status} from '@grpc/grpc-js';
import services from './proto/trainings_grpc_pb';
import { Training as ProtoTraining, GetTrainingById } from './proto/trainings_pb'
import { Training as PrismaTraining } from '@prisma/client';
import { DatabaseClient } from './database_client';

export class GrpcProtobufferServer {

    private server: Server
    private databaseClient: DatabaseClient 

    constructor(databaseClient: DatabaseClient) {
        this.server = new Server()
        this.databaseClient = databaseClient
    }

    saveTraining(call: ServerUnaryCall<ProtoTraining, ProtoTraining>, callback: sendUnaryData<ProtoTraining>) {
        const toSaveTraining = this.convertToPrismaTraining(call.request)
        this.databaseClient.saveTraining(toSaveTraining)
            .then((prismaTraining: PrismaTraining) => {
                const storedTraining = this.convertToProtoTraining(prismaTraining)
                callback(null, storedTraining)
            })
            .catch(err => {
                console.error('Unable to save training' + toSaveTraining, err)
                callback({
                    code: status.INTERNAL,
                    message: 'Unable to save training' + toSaveTraining
                }, null)
            })
    }

    getTraining(call: ServerUnaryCall<GetTrainingById, ProtoTraining>, callback: sendUnaryData<ProtoTraining>) {
        const id = call.request.getId()
        this.databaseClient.getTraining(id)
            .then((prismaTraining: PrismaTraining|null) => {
                if(prismaTraining != null) {
                    const training = this.convertToProtoTraining(prismaTraining)
                    callback(null, training)
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
        this.server.addService(services.TrainingsService, {
            getTraining: bindCallback(this, "getTraining"),
            saveTraining: bindCallback(this, "saveTraining")
        });
        this.server.bindAsync('0.0.0.0:50051', ServerCredentials.createInsecure(), () => {
            this.server.start(); 
            console.log("grpc-server is running")       
        });
    }

    private convertToProtoTraining(prismaTraining: PrismaTraining): ProtoTraining {
        const training = new ProtoTraining()
        training.setId(prismaTraining.id)
        training.setName(prismaTraining.name)
        training.setDescription(prismaTraining.description != null ? prismaTraining.description : '')
        return training;
    }

    private convertToPrismaTraining(protoTraining: ProtoTraining): PrismaTraining {
        return {
            id: protoTraining.getId(),
            name: protoTraining.getName(),
            description: protoTraining.getDescription()
        }
    }
}

// use this function to bind the callback 
// to the method calls of a specifc object instance.
// Without this trick the methods would be called outside of instance context
// which resolves all variables referenced by "this." to undefined.
// 
// Add also a default error handling to avoid hanging grpc calls
function bindCallback(toObject: any, methodName: string){
    return function(call: any, callback: any){
        toObject[methodName](call, callback)      
    }
}