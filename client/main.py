from __future__ import print_function
import logging
import grpc
from datetime import datetime
from proto import trainings_pb2, trainings_pb2_grpc


def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    print("start request from server")
    now = datetime.now()

    with grpc.insecure_channel('localhost:50051') as channel:
        stub = trainings_pb2_grpc.TrainingsStub(channel)
        create_response = stub.SaveTraining(trainings_pb2.Training(name='Test: ' + str(now)))
        get_response = stub.GetTraining(trainings_pb2.GetTrainingById(id=create_response.id))
    print("Greeter client received: " + str(get_response))


if __name__ == '__main__':
    logging.basicConfig()
    run()
