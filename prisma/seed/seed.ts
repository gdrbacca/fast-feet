import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "@prisma/client";

/* const adapter = new PrismaPg({ 
    connectionString: process.env.DATABASE_URL 
}); */
const prisma = new PrismaClient()

async function main() {
    await prisma.user.create({
        data: {
            cpf: '06665763943',
            name: 'Claudiosvaldo',
            password: '$2b$06$DITNh0iAFbaUZurk4j25KekY7FLRHJGzy7vjMHp3K00Zd6d4FxkHK',
            role: 'ADMIN'
        }
    })

    await prisma.recipient.create({
        data: {
            name: 'Claudiosvaldo',
            address: 'Rua Pelé Dois',
            number: '444'
        }
    })
}

main()
.then(async () => {
    await prisma.$disconnect()
})