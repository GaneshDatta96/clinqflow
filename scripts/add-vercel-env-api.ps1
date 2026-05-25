# Bulk-add env placeholders via Vercel REST API (Supabase vars untouched).
$ErrorActionPreference = "Stop"
$authPath = "$env:APPDATA\com.vercel.cli\Data\auth.json"
$token = (Get-Content $authPath -Raw | ConvertFrom-Json).token
$headers = @{ Authorization = "Bearer $token" }

$teamId = "team_507Kq4C2wEBwhJiZpZL3DVkp"
$projectId = "prj_lFDDw6KP1mUNgkluGLCRz4lryKQg"
$base = "https://api.vercel.com/v9/projects/$projectId/env"
$postUrl = "https://api.vercel.com/v10/projects/$projectId/env?teamId=$teamId"
$q = "?teamId=$teamId"

$vars = @(
  @{ key = "APP_URL"; value = "https://cliniqflow.app" },
  @{ key = "INTAKE_TOKEN_SECRET"; value = "REPLACE_ME_use_32_plus_random_characters" },
  @{ key = "PLATFORM_ADMIN_EMAILS"; value = "you@example.com" },
  @{ key = "PLATFORM_SUPPORT_EMAILS"; value = "support@example.com" },
  @{ key = "AI_PHI_MODE"; value = "restricted" },
  @{ key = "AI_BAA_VENDOR"; value = "REPLACE_ME_if_using_openrouter_in_production" },
  @{ key = "OPENROUTER_API_KEY"; value = "REPLACE_ME" },
  @{ key = "OPENROUTER_MODEL"; value = "openai/gpt-4o-mini" },
  @{ key = "UPSTASH_REDIS_REST_URL"; value = "https://REPLACE_ME.upstash.io" },
  @{ key = "UPSTASH_REDIS_REST_TOKEN"; value = "REPLACE_ME" },
  @{ key = "CRON_SECRET"; value = "REPLACE_ME_use_32_plus_random_characters" },
  @{ key = "STRIPE_SECRET_KEY"; value = "sk_REPLACE_ME" },
  @{ key = "STRIPE_WEBHOOK_SECRET"; value = "whsec_REPLACE_ME" },
  @{ key = "EMAIL_PROVIDER"; value = "resend" },
  @{ key = "RESEND_API_KEY"; value = "re_REPLACE_ME" },
  @{ key = "SENDGRID_API_KEY"; value = "SG.REPLACE_ME" },
  @{ key = "EMAIL_FROM"; value = "hello@yourdomain.com" },
  @{ key = "SENTRY_DSN"; value = "https://REPLACE_ME@o000000.ingest.us.sentry.io/0000000" },
  @{ key = "AUDIT_RETENTION_DAYS"; value = "2190" }
)

$target = @("production", "preview", "development")
$existing = (Invoke-RestMethod -Uri "$base$q" -Headers $headers).envs

foreach ($item in $vars) {
  $matches = @($existing | Where-Object { $_.key -eq $item.key })
  foreach ($m in $matches) {
    Write-Host "DELETE $($item.key) ($($m.id))..."
    Invoke-RestMethod -Method DELETE -Uri "$base/$($m.id)$q" -Headers $headers | Out-Null
  }
  Write-Host "POST $($item.key)..."
  $body = @{
    key = $item.key
    value = $item.value
    type = "encrypted"
    target = $target
  } | ConvertTo-Json
  Invoke-RestMethod -Method POST -Uri $postUrl -Headers $headers -ContentType "application/json" -Body $body | Out-Null
}

Write-Host "Done. Verify: npx vercel env ls"
