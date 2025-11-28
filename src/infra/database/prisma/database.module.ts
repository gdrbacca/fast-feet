import { Module } from "@nestjs/common";
import { PrismaService } from "./prisma.service";
import { UserRepository } from "@/domain/fast_feet_main/application/repository/user-repository";
import { PrismaUserRepository } from "./repositories/prisma-user-repository";
import { OrderRepository } from "@/domain/fast_feet_main/application/repository/order-repository";
import { PrismaOrderRepository } from "./repositories/prisma-order-repository";
import { RecipientRepository } from "@/domain/fast_feet_main/application/repository/recipient-repository";
import { PrismaRecipientRepository } from "./repositories/prisma-recipient-repository";
import { AttachmentRepository } from "@/domain/fast_feet_main/application/repository/attachment-repository";
import { PrismaOrderAttachmentRepository } from "./repositories/prisma-order-attachment-repository";
import { OrderAttachmentRepository } from "@/domain/fast_feet_main/application/repository/order-attachment-repository";
import { PrismaAttachmentRepository } from "./repositories/prisma-attachment-repository";
import { OrderDeliverymanRepository } from "@/domain/fast_feet_main/application/repository/order-deliveryman-repository";
import { PrismaOrderDeliverymanRepository } from "./repositories/prisma-order-deliveryman-repository";
import { CacheModule } from "@/infra/cache/cache.module";

@Module({
    imports: [
        CacheModule
    ],
    providers: [
        PrismaService,
        {
            provide: UserRepository,
            useClass: PrismaUserRepository
        },
        {
            provide: OrderRepository,
            useClass: PrismaOrderRepository
        },
        {
            provide: RecipientRepository,
            useClass: PrismaRecipientRepository
        },
        {
            provide: AttachmentRepository,
            useClass: PrismaAttachmentRepository
        },
        {
            provide: OrderAttachmentRepository,
            useClass: PrismaOrderAttachmentRepository
        },
        {
            provide: OrderDeliverymanRepository,
            useClass: PrismaOrderDeliverymanRepository
        }
    ],
    exports: [
        PrismaService, 
        UserRepository,
        OrderRepository,
        RecipientRepository,
        AttachmentRepository,
        OrderAttachmentRepository,
        OrderDeliverymanRepository
    ]
})
export class DatabaseModule {}