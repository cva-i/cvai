import { Args, Context, Mutation, Resolver } from '@nestjs/graphql';
import { Request } from 'express';
import { Inject, Logger } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ConfigType } from '@nestjs/config';
import { appConfig } from '../config/app.config';
import { AuthResponse } from './dto/auth-response.dto';
import { LoginInput } from './dto/login.input';
import { RegisterInput } from './dto/register.input';
import { SetPasswordInput } from './dto/set-password.input';

@Resolver()
export class AuthResolver {
  private readonly logger = new Logger(AuthResolver.name);

  constructor(
    private readonly authService: AuthService,
    @Inject(appConfig.KEY)
    private readonly appConfiguration: ConfigType<typeof appConfig>
  ) {}

  @Mutation(() => AuthResponse)
  public async login(
    @Args('input') input: LoginInput,
    @Context('req') req: Request
  ): Promise<AuthResponse> {
    const response = await this.authService.login(input.email, input.password);

    // Set cookies
    req.res?.cookie('accessToken', response.accessToken, this.appConfiguration.cookieOptions);
    req.res?.cookie('refreshToken', response.refreshToken, this.appConfiguration.cookieOptions);

    this.logger.log(`User ${response.user.email} logged in successfully`);
    return response;
  }

  @Mutation(() => AuthResponse)
  public async register(
    @Args('input') input: RegisterInput,
    @Context('req') req: Request
  ): Promise<AuthResponse> {
    const response = await this.authService.register(
      input.email,
      input.password,
      input.firstName,
      input.lastName
    );

    // Set cookies
    req.res?.cookie('accessToken', response.accessToken, this.appConfiguration.cookieOptions);
    req.res?.cookie('refreshToken', response.refreshToken, this.appConfiguration.cookieOptions);

    this.logger.log(`User ${response.user.email} registered successfully`);
    return response;
  }

  @Mutation(() => AuthResponse, { description: 'Set password for users in FRESHLY_CREATED_REQUIRES_PASSWORD status and return auth tokens' })
  public async setPassword(
    @Args('input') input: SetPasswordInput,
    @Context('req') req: Request
  ): Promise<AuthResponse> {
    const response = await this.authService.setPassword(input.userId, input.password);

    // Set cookies
    req.res?.cookie('accessToken', response.accessToken, this.appConfiguration.cookieOptions);
    req.res?.cookie('refreshToken', response.refreshToken, this.appConfiguration.cookieOptions);

    this.logger.log(`Password set for user ${response.user.id}`);
    return response;
  }

  @Mutation(() => Boolean)
  public async logout(@Context('req') req: Request) {
    const refreshToken = req.cookies?.refreshToken;

    req.res?.clearCookie('accessToken', this.appConfiguration.cookieOptions);
    req.res?.clearCookie('refreshToken', this.appConfiguration.cookieOptions);

    if (refreshToken) {
      await this.authService.invalidateTokens(refreshToken);
    }

    this.logger.log('User logged out successfully');
    return true;
  }
}
