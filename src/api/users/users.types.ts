export type UserDto = {
  id: number;
  name: string;
  surname: string;
  login: string;
  email: string;
};

export type RegisterUserRequestDto = {
  name: string;
  surname: string;
  login: string;
  email: string;
  password: string;
};

export type LoginUserRequestDto = {
  loginOrEmail: string;
  password: string;
};
