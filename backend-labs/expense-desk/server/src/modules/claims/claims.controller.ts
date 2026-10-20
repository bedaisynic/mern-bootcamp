import type { Request, Response } from "express";
import * as service from "./claims.service";

export function list(_req: Request, res: Response) {
  res.json(service.listClaims());
}

export function get(req: Request<{ id: string }>, res: Response) {
  res.json(service.getClaimDetail(req.params.id));
}

export function create(req: Request, res: Response) {
  res.status(201).json(service.createClaim(req.body));
}

export async function process(req: Request<{ id: string }>, res: Response) {
  res.json(await service.processClaimById(req.params.id));
}

export function approvals(_req: Request, res: Response) {
  res.json(service.listApprovals());
}
export function approve(req: Request<{ id: string }>, res: Response) {
  res.json(service.approveClaim(req.params.id));
}
export function reject(req: Request<{ id: string }>, res: Response) {
  res.json(service.rejectClaim(req.params.id));
}
