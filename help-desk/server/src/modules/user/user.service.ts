import * as userRepository from './user.repository.js';
import { NotFoundError } from '../../shared/errors.js';

export const getAllUsers = async () => {
  const users = await userRepository.findAll();

  return {
    success: true,
    data: users,
  };
};

export const getUserById = async (id: number) => {
  const user = await userRepository.findById(id);
  if (!user) {
    throw new NotFoundError(`User with id ${id} not found`);
  }

  return {
    success: true,
    data: user,
  };
};

export const login = async (username: string, password: string) => {
  const user = await userRepository.findByUsername(username);
  if (!user || user.password !== password) {
    throw new NotFoundError(`Invalid username or password`);
  }

  const { password: _, ...userWithoutPassword } = user;

  return {
    success: true,
    data: userWithoutPassword,
    message: 'Login successful',
  };
};
