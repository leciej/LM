import { http } from "@/api";
import type {
  UserDto,
  RegisterUserRequestDto,
  LoginUserRequestDto,
} from "./users.types";

export const UsersApi = {
  // POST /api/users/register
  register: async (
    payload: RegisterUserRequestDto
  ): Promise<UserDto> => {
    const { data } = await http.post<UserDto>(
      "/users/register",
      payload
    );
    return data;
  },

  // POST /api/users/login
  login: async (
    payload: LoginUserRequestDto
  ): Promise<UserDto> => {
    const { data } = await http.post<UserDto>(
      "/users/login",
      payload
    );
    return data;
  },
};
