import { envSchema } from "@/infra/env/env"
import { config } from 'dotenv'
import { randomUUID } from "node:crypto"
import { execSync } from "node:child_process"
import { PrismaPg } from "@prisma/adapter-pg"
import Redis from "ioredis"
import { PrismaClient } from "@prisma/client"


config({ path: './.env', override: true })
config({ path: './.env.test', override: true })

const env = envSchema.parse(process.env)

/* const adapter = new PrismaPg({ 
    connectionString: process.env.DATABASE_URL 
}); */
const prisma = new PrismaClient()

const redis = new Redis({
  host: env.REDIS_HOST,
  db: env.REDIS_DB,
  port: env.REDIS_PORT
})


function generateUniqueDatabaseURL(schemaId: string) {
    if (!process.env.DATABASE_URL){
        throw new Error('Please provide a DATABASE_URL')
    }
    
    const url = new URL(process.env.DATABASE_URL)

    url.searchParams.set('schema', schemaId)

    return url.toString()
}

const schemaId = randomUUID()
beforeAll(async () => {
    const database_url = generateUniqueDatabaseURL(schemaId)
    //execSync('npx prisma migrate deploy')

    process.env.DATABASE_URL = database_url

    console.log('passou no migrate deploy')
    execSync('npx prisma migrate deploy')

    await redis.flushdb()
})

afterAll(async () => {
    /* await prisma.$disconnect()
    if (!process.env.DATABASE_URL){
        throw new Error('Please provide a DATABASE_URL')
    }
    console.log("passou no disconnect da base e drop database")
    execSync(`docker exec fast-feet-pg psql -U postgres -d postgres -c "SELECT pg_terminate_backend(pid) FROM pg_stat_activity WHERE datname = 'fast-feet-test';"`)
    // await prisma.$executeRawUnsafe(`DROP DATABASE IF EXISTS "fast-feet-test"`)
    execSync(`docker exec fast-feet-pg psql -U postgres -d postgres -c "DROP DATABASE IF EXISTS \\"fast-feet-test\\";"`) */
    //execSync('npx prisma migrate reset --force')
    await prisma.$executeRawUnsafe(`DROP SCHEMA IF EXISTS "${schemaId}" CASCADE`)
    await prisma.$disconnect()

})