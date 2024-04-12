import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Fake } from 'src/schemas/auth/fake.schema';
import { Otp } from 'src/schemas/auth/otp.schema';
import { User } from 'src/schemas/role/user.schema';
import { signupDto } from './dto/signup.dto';
import { hash, verify } from 'argon2';
import { EskizService } from 'src/eskiz/eskiz.service';
import { otpDto } from './dto/otp.dto';
import { JwtService } from '@nestjs/jwt';
import { siginDto } from './dto/signin.dto';


@Injectable()
export class AuthService {
    constructor(@InjectModel(Otp.name) private Otp: Model<Otp>,
    @InjectModel(Fake.name) private Fake: Model<Fake>,
    @InjectModel(User.name) private User: Model<User>,
    private eskiz: EskizService, private jwt: JwtService) {}


    async signup(data: signupDto, avatar: any) {
        const exist = await this.isHave(data.username, data.phone)
        if(exist) {
            throw new BadRequestException('User is already exist please change your username or phone')
        }


        const hashP = await hash(data.password)
        const user = new this.Fake({username: data.username, phone: data.phone, password: hashP})

        await user.save()

        await this.eskiz.sendSMS(data.phone)
        return 'Go though Otp'

    }

    async otp(data: otpDto) {
        const otp = await this.Otp.findOne({phone: data.phone})
        if(!otp) {
            throw new NotFoundException('Otp is not found please go though signup')
        }

        const isCode = data.code === otp.code
        if(!isCode) {
            throw new BadRequestException('Code is not correct')
        }

        await this.Otp.findByIdAndDelete(otp.id)
        return await this.saveUser(data.phone)
    }

    async signin(data: siginDto) {
        const user = await this.isHave('', data.phone)
        if(!user) {
            throw new BadRequestException('User is not authorized')
        }

        const isPass = await verify(user.password, data.password)
        if(!isPass) {
            throw new BadRequestException('Password is not correct')
        }

        return this.issueToken(user.id)
    }



    private async isHave(u: string, p: string) {
        const user = await this.User.findOne({$or: [
            {username: u},
            {phone: p}
        ]})

        return user
    }

    private async saveUser(phone: string) {
        const fake = await this.Fake.findOne({phone: phone})
        
        const user = new this.User({username: fake.username, phone: fake.phone, password: fake.password})
        await user.save()

        await this.Fake.findByIdAndDelete(fake.id)
        return await this.issueToken(user.id)
    }

    private async issueToken(userId: string) {
        const data = {id: userId}
        const accesToken = this.jwt.sign(data, {
            expiresIn: '3d'
        })

        const refreshToken = this.jwt.sign(data, {
            expiresIn: '24h'
        })

        return {
            accesToken, refreshToken
        }
    }
}
