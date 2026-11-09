import axios from 'axios';
import { create } from 'zustand';
import type { Actor, IntakeOrderMatch, VerifiedIntakeOrder } from '@oms/shared-types';
import type { AddressVerification, Command, IntakeInput } from '@oms/shared-schemas';
import type { Workspace } from '@oms/oms-mock-adapters';

const api = axios.create({baseURL: '/api', timeout: 40_000});
const base = '/cases';
const caseApi = (id: string) => base + '/' + encodeURIComponent(id);
export type Session = {actor: Actor; token: string};
export type WorkspaceAuthConfig = {mode: 'local'} | {mode: 'okta'; issuer: string; clientId: string};
export const loadAuthConfig = async () => (await api.get<WorkspaceAuthConfig>('/auth/config')).data;
export const useRole = create<{role: Actor['role']; setRole: (role: Actor['role']) => void}>(set => ({
  role: 'agent', setRole: role => set({role}),
}));
export const signIn = async (role: Actor['role']) => (await api.post<Session>('/session', {role})).data;
const authorize = (token: string) => ({headers: {Authorization: 'Bearer ' + token}});
export const loadAuthenticatedActor = async (token: string) =>
  (await api.get<{actor: Actor}>('/auth/session', authorize(token))).data.actor;
export const searchOrders = async (token: string, query: string) =>
  (await api.get<IntakeOrderMatch[]>('/intake/orders', {...authorize(token), params: {q: query}})).data;
export const verifyAddress = async (token: string, orderId: string, input: AddressVerification) =>
  (await api.post<VerifiedIntakeOrder>('/intake/orders/' + encodeURIComponent(orderId) + '/verify', input, authorize(token))).data;
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
