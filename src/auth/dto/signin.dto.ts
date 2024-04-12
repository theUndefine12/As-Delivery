import { MinLength, IsNotEmpty } from "class-validator";


export class siginDto {
    @IsNotEmpty()
    phone: string

    @MinLength(8, {message: 'Password need be min 8 words'})
    password: string
}
