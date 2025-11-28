import { Module } from "@nestjs/common";
import { EnvModule } from "../env/env.module";
import { Uploader } from "@/domain/fast_feet_main/application/storage/uploader";
import { R2Uploader } from "./R2Uploader";

@Module({
    imports: [EnvModule],
    providers: [
        {
            provide: Uploader,
            useClass: R2Uploader
        }
    ],
    exports: [Uploader]
})
export class StorageModule{}