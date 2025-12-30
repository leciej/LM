import { httpRequest } from '../client';
import {
  LoginRequestDto,
  RegisterRequestDto,
  AuthResponseDto,
} from './auth.types';

export class AuthApi {
  /**
   * POST /auth/login
   */
  static login(payload: LoginRequestDto) {
    return httpRequest<AuthResponseDto, LoginRequestDto>({
      method: 'POST',
      url: '/auth/login',
      body: payload,
      auth: false, // login nie wymaga tokena
    });
  }

  /**
   * POST /auth/register
   */
  static register(payload: RegisterRequestDto) {
    return httpRequest<AuthResponseDto, RegisterRequestDto>({
      method: 'POST',
      url: '/auth/register',
      body: payload,
      auth: false,
    });
  }
}
