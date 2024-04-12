import { MinLength, IsNotEmpty } from "class-validator";


export class signupDto {
    @IsNotEmpty()
    username: string

    @IsNotEmpty()
    phone: string

    @MinLength(8, {message: 'Password need be min 8 words'})
    password: string
}