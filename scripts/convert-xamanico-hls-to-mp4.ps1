param(
  [switch]$Force
)

$ErrorActionPreference = "Stop"

$ProjectRoot = Resolve-Path (Join-Path $PSScriptRoot "..")
Set-Location $ProjectRoot

$OutputDir = Join-Path $ProjectRoot "teste-xamanico/video/mp4"
$ReportPath = Join-Path $ProjectRoot "RELATORIO_CONVERSAO_MP4_XAMANICO_CURTO.md"

New-Item -ItemType Directory -Force -Path $OutputDir | Out-Null

$Videos = @(
  @{ Source = "teste-xamanico/video/hls/6a3d6c49939c8f300cf45bd5/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_1.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6c5dfcb54795331e6caa/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_2.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6c6f4d2b4d3fb0015f72/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_3.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6cb3e172d6fc8663000c/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_4.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6cceb84c1d6bd6069110/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_5.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6e48cbea5b52000ee210/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_6.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d947a33aff917654328d8/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_7.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6c8102a941bb305746f0/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_8.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6c9d514be1f31770e180/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_destino_9.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6e7a583018d5609dfeab/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_dinheiro.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6ec29f8674db4f7a5213/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_felicidade.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d751bb0bc99b90d6f5ee4/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_saude.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d73a36e2c9c5a5916a744/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_mulher_casada.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d6f10d8a1f8a3e9edd08e/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_homem_casado.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d72ef514be1f31770ed7d/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_homem_solteiro.mp4" },
  @{ Source = "teste-xamanico/video/hls/6a3d7461cbea5b52000eef4b/local.m3u8"; Dest = "teste-xamanico/video/mp4/diagnostico_mulher_solteira.mp4" },
  @{ Source = "teste-xamanico/video/hls/679addd8f4e73b4d0f861d1e/local.m3u8"; Dest = "teste-xamanico/video/mp4/final_pitch.mp4" }
)

function Write-Report {
  param([string[]]$Lines)
  Set-Content -Path $ReportPath -Value ($Lines -join "`r`n") -Encoding UTF8
}

$ffmpeg = Get-Command ffmpeg -ErrorAction SilentlyContinue
if (-not $ffmpeg) {
  $message = "ffmpeg nao encontrado no PATH. Instale o ffmpeg ou adicione ffmpeg.exe ao PATH e rode este script novamente."
  Write-Host $message
  Write-Report @(
    "# RELATORIO CONVERSAO MP4 XAMANICO CURTO",
    "",
    "- ffmpeg: nao encontrado",
    "- conversao executada: nao",
    "- mp4 gerados nesta execucao: 0",
    "- observacao: HLS original preservado; nenhum video convertido."
  )
  exit 1
}

$results = New-Object System.Collections.Generic.List[string]
$results.Add("# RELATORIO CONVERSAO MP4 XAMANICO CURTO")
$results.Add("")
$results.Add("- ffmpeg: $($ffmpeg.Source)")
$results.Add("- Force: $Force")
$results.Add("")

foreach ($video in $Videos) {
  $source = Join-Path $ProjectRoot $video.Source
  $dest = Join-Path $ProjectRoot $video.Dest

  if (-not (Test-Path $source)) {
    $results.Add("- ERRO origem ausente: $($video.Source)")
    continue
  }

  if ((Test-Path $dest) -and -not $Force) {
    $results.Add("- SKIP ja existe: $($video.Dest)")
    continue
  }

  New-Item -ItemType Directory -Force -Path (Split-Path -Parent $dest) | Out-Null

  $args = @(
    "-allowed_extensions", "ALL",
    "-protocol_whitelist", "file,http,https,tcp,tls,crypto",
    "-i", $source,
    "-vf", "scale='min(854,iw)':-2",
    "-c:v", "libx264",
    "-preset", "veryfast",
    "-crf", "28",
    "-c:a", "aac",
    "-b:a", "64k",
    "-movflags", "+faststart"
  )
  if ($Force) { $args += "-y" }
  $args += $dest

  & $ffmpeg.Source @args
  if ($LASTEXITCODE -eq 0) {
    $sizeMb = [math]::Round((Get-Item $dest).Length / 1MB, 2)
    $results.Add("- OK $($video.Dest) (${sizeMb} MB)")
  } else {
    $results.Add("- ERRO ffmpeg exit $LASTEXITCODE em $($video.Dest)")
  }
}

Write-Report $results
