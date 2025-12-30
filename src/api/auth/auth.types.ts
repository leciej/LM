/**
 * DTO – dokładnie to, co wysyłasz / odbierasz z backendu
 * (nie modele domenowe!)
 */

export type LoginRequestDto = {
  email: string;
  password: string;
};

export type RegisterRequestDto = {
  name: string;
  email: string;
  password: string;
};

export type AuthUserDto = {
  id: string;
  email: string;
  name: string;
  role?: string;
};

export type AuthResponseDto = {
  token: string;
  user: AuthUserDto;
};
