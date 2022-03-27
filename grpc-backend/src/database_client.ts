import { PrismaClient, PrismaPromise, Training } from '@prisma/client'

export class DatabaseClient {
    private prisma = new PrismaClient();

    public DatabaseClient() {}

    public saveTraining(training: Training): void{
        this.prisma.training.create({
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