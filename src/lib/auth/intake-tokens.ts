import { createHmac, randomBytes, timingSafeEqual } from "node:crypto";
import { SignJWT, jwtVerify } from "jose";
import { env } from "@/lib/env";

const INTAKE_TOKEN_TTL_HOURS = 72;

function getSecretKey() {
  return new TextEncoder().encode(env.intakeTokenSecret);
}

export function hashToken(token: string) {
  return createHmac("sha256", env.intakeTokenSecret).update(token).digest("hex");
}

export function generateRawIntakeToken() {
  return randomBytes(32).toString("base64url");
}

export async function signIntakeJwt(payload: {
  tenantId: string;
  clinicId: string;
  patientId: string;
  linkId: string;
}) {
  return new SignJWT({
    tid: payload.tenantId,
    cid: payload.clinicId,
    pid: payload.patientId,
    lid: payload.linkId,
    typ: "intake",
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(`${INTAKE_TOKEN_TTL_HOURS}h`)
    .sign(getSecretKey());
}

export async function verifyIntakeJwt(token: string) {
  const { payload } = await jwtVerify(token, getSecretKey(), {
    algorithms: ["HS256"],
  });

  if (payload.typ !== "intake") {
    throw new Error("Invalid intake token type.");
  }

  return {
    tenantId: String(payload.tid),
    clinicId: String(payload.cid),
    patientId: String(payload.pid),
    linkId: String(payload.lid),
  };
}

export function safeCompareToken(a: string, b: string) {
  const bufA = Buffer.from(a);
  const bufB = Buffer.from(b);
  if (bufA.length !== bufB.length) return false;
  return timingSafeEqual(bufA, bufB);
}

export function getIntakeLinkExpiry() {
  return new Date(Date.now() + INTAKE_TOKEN_TTL_HOURS * 60 * 60 * 1000);
}
