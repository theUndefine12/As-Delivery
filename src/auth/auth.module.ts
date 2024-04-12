import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { MongooseModule } from '@nestjs/mongoose';
import { User, userSchema } from 'src/schemas/role/user.schema';
import { Otp, otpSchema } from 'src/schemas/auth/otp.schema';
import { Fake, fakeSchema } from 'src/schemas/auth/fake.schema';
import { EskizModule } from 'src/eskiz/eskiz.module';
import { FileModule } from 'src/file/file.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { getJwtConfig } from 'src/config/jwt.config';

@Module({
  imports: [
    EskizModule,
    FileModule,
    ConfigModule,
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getJwtConfig
    }),
    MongooseModule.forFeature([{name: User.name, schema: userSchema},
    {name: Otp.name, schema: otpSchema}, {name: Fake.name, schema: fakeSchema}])
  ],
  controllers: [AuthController],
  providers: [AuthService],
})

export class AuthModule {}
