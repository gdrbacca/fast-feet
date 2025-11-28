import { BadRequestException, Controller, FileTypeValidator, ParseFilePipe, Post, UnauthorizedException, UnsupportedMediaTypeException, UploadedFile, UseInterceptors } from '@nestjs/common';
import { JWTSchemaType } from '@/infra/auth/jwt.strategy';
import { CurrentUser } from '@/infra/auth/current-user-decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadAndCreateAttachmentUseCase } from '@/domain/fast_feet_main/application/use-cases/upload-and-create-attachment';



@Controller()
export class UploadAndCreateAttachmentController {

    constructor(private uploadAndCreateAttachment: UploadAndCreateAttachmentUseCase){}

    @Post("/attachment")
    // @HttpCode(201)
    @UseInterceptors(FileInterceptor('file'))
    // @UseGuards(JwtAuthGuard)
    // @UsePipes(new ZodValidationPipe(registerUserBodySchema))
    async handle(
        @CurrentUser() user: JWTSchemaType,
        @UploadedFile(
            new ParseFilePipe({
                validators: [
                new FileTypeValidator({ fileType: '.(png|jpg|jpeg|pdf)' }),
                ],
            }),
        ) file: Express.Multer.File
    )
    {
        const {sub: user_id} = user
        console.log(file)
        const result = await this.uploadAndCreateAttachment.execute({
            id_sub: user_id,
            fileName: file.originalname,
            fileType: file.mimetype,
            body: file.buffer
        })

        if (result.isLeft()) {
            if (result.value.constructor.name === 'CreationNotAllowed') {
                throw new UnauthorizedException()
            }
            if (result.value.constructor.name === 'InvalidAttachmentType') {
                throw new UnsupportedMediaTypeException()
            }
            throw new BadRequestException()
        }

        const { attachment } = result.value

        return {
            attachmentId: attachment.id.toString()
        }
    }
}
