# Install the language runtimes used by Projet Carthage on a self-hosted Piston.
# Run once after `docker compose -f docker-compose.piston.yml up -d`.

$PistonUrl = if ($env:PISTON_URL) { $env:PISTON_URL } else { "http://localhost:2000/api/v2" }

# Versions match src/app/api/db/execute/route.ts LANGUAGES table.
$Runtimes = @(
    @{ language = "javascript"; version = "18.15.0" },  # nodejs module
    @{ language = "python";     version = "3.10.0"  },
    @{ language = "c";          version = "10.2.0"  },  # c module
    @{ language = "c++";        version = "10.2.0"  },  # cpp module
    @{ language = "csharp";     version = "6.12.0"  },
    @{ language = "dart";       version = "2.19.6"  }
)

Write-Host "Installing Piston runtimes on $PistonUrl ..." -ForegroundColor Cyan

foreach ($r in $Runtimes) {
    Write-Host "  -> $($r.language) $($r.version)" -ForegroundColor Yellow
    $body = $r | ConvertTo-Json -Compress
    try {
        $resp = Invoke-RestMethod -Method Post -Uri "$PistonUrl/packages" `
            -ContentType "application/json" -Body $body -TimeoutSec 600
        Write-Host "     OK: $($resp.message)" -ForegroundColor Green
    } catch {
        Write-Host "     FAIL: $($_.Exception.Message)" -ForegroundColor Red
    }
}

Write-Host "`nInstalled packages:" -ForegroundColor Cyan
Invoke-RestMethod -Method Get -Uri "$PistonUrl/runtimes" | Format-Table language, version
