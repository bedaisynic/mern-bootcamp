import { Request, Response, NextFunction } from 'express';
import * as userService from './user.service.js';
import { ValidationError } from '../../shared/errors.js';

export const getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await userService.getAllUsers();
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const getUserById = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id = parseInt(req.params.id);
    const result = await userService.getUserById(id);
    res.json(result);
  } catch (error) {
    next(error);
  }
};

export const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body ?? {};
    if (typeof username !== 'string' || username.trim() === '') {
      throw new ValidationError('Username is required');
    }
    if (typeof password !== 'string' || password.trim() === '') {
      throw new ValidationError('Password is required');
    }
    const result = await userService.login(username, password);
    res.json(result);
  } catch (error) {
    next(error);
  }
};
