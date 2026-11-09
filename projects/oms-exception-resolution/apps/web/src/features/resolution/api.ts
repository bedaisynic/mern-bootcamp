import axios from 'axios';
import { create } from 'zustand';
import type { Actor } from '@oms/shared-types';
import type { Command, IntakeInput } from '@oms/shared-schemas';
import type { Workspace } from '@oms/oms-mock-adapters';

const api = axios.create({baseURL: '/api', timeout: 40_000});
const base = '/cases';
const caseApi = (id: string) => base + '/' + encodeURIComponent(id);
type Session = {actor: Actor; token: string};
export const useRole = create<{role: Actor['role']; setRole: (role: Actor['role']) => void}>(set => ({
  role: 'agent', setRole: role => set({role}),
}));
export const signIn = async (role: Actor['role']) => (await api.post<Session>('/session', {role})).data;
const authorize = (token: string) => ({headers: {Authorization: 'Bearer ' + token}});
export const loadQueue = async (token: string) => (await api.get<Workspace[]>(base, authorize(token))).data;
export const registerCall = async (token: string, input: IntakeInput) =>
  (await api.post<{id: string; created: boolean}>(base, input, authorize(token))).data;
export const loadWorkspace = async (token: string, id: string) => (await api.get<Workspace>(caseApi(id), authorize(token))).data;
export const sendCommand = async (token: string, id: string, command: Command) => (
  await api.post<Workspace>(caseApi(id) + '/commands', command, authorize(token))
).data;
export const errorMessage = (error: unknown) => axios.isAxiosError<{error: string}>(error)
  ? error.response?.data.error ?? 'The workspace could not reach the API. Try again.'
  : 'The workspace could not complete this request.';
