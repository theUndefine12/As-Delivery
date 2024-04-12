import { Body, Controller, Post, UseGuards, UsePipes, ValidationPipe } from '@nestjs/common';
import { AuthService } from './auth.service';
import { signupDto } from './dto/signup.dto';
import { siginDto } from './dto/signin.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  signup(@Body() data: signupDto) {
    return this.authService.signup(data)
  }

  @Post()
  @UsePipes(new ValidationPipe())
  signin(@Body() data: siginDto) {
    return this.authService.signin(data)
  }
}
