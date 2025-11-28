import { BadRequestException, PipeTransform } from "@nestjs/common";
import { ZodError, ZodType } from "zod";
import { fromZodError } from 'zod-validation-error'

export class ZodValidationPipe implements PipeTransform {
    constructor(private schema: ZodType) {}

    transform(value: unknown) {
      try {
        const parsedValue = this.schema.parse(value);
        console.log('parsedValue')
        console.log(parsedValue)
        return parsedValue;
      } catch (error) {
          if (error instanceof ZodError) {
              throw new BadRequestException({
                  message: 'Validation failed.',
                  statusCode: 400,
                  details: fromZodError(error)
              });
          }
          throw new BadRequestException('Validation failed');
      }
    }
  }