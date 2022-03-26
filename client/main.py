from __future__ import print_function
import logging
import grpc

from proto import trainings_pb2, trainings_pb2_grpc
from google.protobuf import empty_pb2


def run():
    # NOTE(gRPC Python Team): .close() is possible on a channel and should be
    # used in circumstances in which the with statement does not fit the needs
    # of the code.
    with grpc.insecure_channel('localhost:50051') as channel:
        stub = trainings_pb2_grpc.TrainingsStub(channel)
        response = stub.GetTraining(empty_pb2.Empty())
    print("Greeter client received: " + str(response))


if __name__ == '__main__':
    logging.basicConfig()
    run()
