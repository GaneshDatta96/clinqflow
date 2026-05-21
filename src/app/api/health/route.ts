export async function GET() {
  return Response.json({
    ok: true,
    service: "cliniqflow",
    timestamp: new Date().toISOString(),
  });
}
