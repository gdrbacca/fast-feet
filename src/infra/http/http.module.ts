import { Module } from "@nestjs/common";
import { CryptModule } from "../cryptography/crypt.module";
import { DatabaseModule } from "../database/prisma/database.module";
import { RegisterUserUseCase } from "@/domain/fast_feet_main/application/use-cases/user-register-user";
import { AuthenticateUseCase } from "@/domain/fast_feet_main/application/use-cases/user-authenticate";
import { RegisterUserController } from "./controllers/user-register.controller";
import { AuthenticateController } from "./controllers/user-authenticate.controller";
import { GetUserController } from "./controllers/user-get-all.controller";
import { GetUserUseCase } from "@/domain/fast_feet_main/application/use-cases/user-get-user";
import { UserEditController } from "./controllers/user-edit.controller";
import { UserEditUseCase } from "@/domain/fast_feet_main/application/use-cases/user-edit";
import { UserDeleteController } from "./controllers/user-delete.controller";
import { UserDeleteUseCase } from "@/domain/fast_feet_main/application/use-cases/user-delete";
import { StorageModule } from "../storage/storage.module";
import { OrderCreateController } from "./controllers/order-create.controller";
import { OrderCreateUseCase } from "@/domain/fast_feet_main/application/use-cases/order-create";
import { UploadAndCreateAttachmentController } from "./controllers/upload-and-create-attachment.controller";
import { UploadAndCreateAttachmentUseCase } from "@/domain/fast_feet_main/application/use-cases/upload-and-create-attachment";
import { OrderListController } from "./controllers/order-list.controller";
import { OrderListUseCase } from "@/domain/fast_feet_main/application/use-cases/order-list";
import { OrderEditController } from "./controllers/order-edit.controller";
import { OrderEditUseCase } from "@/domain/fast_feet_main/application/use-cases/order-edit";
import { OrderDeleteController } from "./controllers/order-delete.controller";
import { OrderDeleteUseCase } from "@/domain/fast_feet_main/application/use-cases/order-delete";
import { OrderFindNearbyController } from "./controllers/order-find-nearby.controller";
import { OrderFindNearbyUseCase } from "@/domain/fast_feet_main/application/use-cases/order-find-nearby";
import { OrderChangeStatusController } from "./controllers/order-change-status.controller";
import { OrderChangeStatusUseCase } from "@/domain/fast_feet_main/application/use-cases/order-change-status";
import { OrderFindByUserController } from "./controllers/order-find-by-user.controller";
import { OrderFindByUserUseCase } from "@/domain/fast_feet_main/application/use-cases/order-find-by-user";
import { OrderEditWithAttachmentController } from "./controllers/order-edit-with-attachment.controller";
import { OrderEditWithAttachmentUseCase } from "@/domain/fast_feet_main/application/use-cases/order-edit-with-attachment";
import { RecipientCreateUseCase } from "@/domain/fast_feet_main/application/use-cases/recipient-create";
import { RecipientCreateController } from "./controllers/recipient-create.controller";
import { RecipientEditController } from "./controllers/recipient-edit.controller";
import { RecipientEditUseCase } from "@/domain/fast_feet_main/application/use-cases/recipient-edit";
import { RecipientListController } from "./controllers/recipient-list.controller";
import { RecipientListUseCase } from "@/domain/fast_feet_main/application/use-cases/recipient-list";
import { RecipientDeleteController } from "./controllers/recipient-delete.controller";
import { RecipientDeleteUseCase } from "@/domain/fast_feet_main/application/use-cases/recipient-delete";

@Module({
    imports: [CryptModule, DatabaseModule, StorageModule],
    controllers: [
        RegisterUserController,
        AuthenticateController,
        GetUserController,
        UserEditController,
        UserDeleteController,
        OrderCreateController,
        UploadAndCreateAttachmentController,
        OrderListController,
        OrderEditController,
        OrderDeleteController,
        OrderFindNearbyController,
        OrderChangeStatusController,
        OrderFindByUserController,
        OrderEditWithAttachmentController,
        RecipientCreateController,
        RecipientEditController,
        RecipientListController,
        RecipientDeleteController
    ],
    providers: [
        RegisterUserUseCase,
        AuthenticateUseCase,
        GetUserUseCase,
        UserEditUseCase,
        UserDeleteUseCase,
        OrderCreateUseCase,
        UploadAndCreateAttachmentUseCase,
        OrderListUseCase,
        OrderEditUseCase,
        OrderDeleteUseCase,
        OrderFindNearbyUseCase,
        OrderChangeStatusUseCase,
        OrderFindByUserUseCase,
        OrderEditWithAttachmentUseCase,
        RecipientCreateUseCase,
        RecipientEditUseCase,
        RecipientListUseCase,
        RecipientDeleteUseCase
    ]
})
export class HTTPModule {}