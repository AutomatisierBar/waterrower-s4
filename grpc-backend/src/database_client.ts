import { PrismaClient, PrismaPromise, Training } from '@prisma/client'

export class DatabaseClient {
    private prisma = new PrismaClient();

    public DatabaseClient() {}

    public async saveTraining(training: Training): Promise<Training> {
        return await this.prisma.training.create({
            data: training
        })
    }

    public async getTraining(id: number): Promise<Training | null>{
        return await this.prisma.training.findUnique(
            { 
                where: {
                    id: id
                }
            }
        )
    }
}