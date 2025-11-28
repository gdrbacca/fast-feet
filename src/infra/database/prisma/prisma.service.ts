import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";
import "dotenv"

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
    constructor() {
        /* const adapter = new PrismaPg({ 
            connectionString: process.env.DATABASE_URL 
        }); */
        super({
            log: ['warn', 'error'],
            //adapter
        })
    }
    
    onModuleInit() {
        return this.$connect()
    }
    onModuleDestroy() {
        return this.$disconnect()
    }
}