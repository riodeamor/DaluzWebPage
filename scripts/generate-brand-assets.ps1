$ErrorActionPreference = 'Stop'
$root = Split-Path $PSScriptRoot -Parent
$source = Join-Path $root 'public/logo-da-luz.svg'
$temporary = Join-Path ([System.IO.Path]::GetTempPath()) ([System.Guid]::NewGuid().ToString() + '.svg')
try {
  # Preserve the supplied artwork. Only exclude its old background ellipse.
  [xml]$document = Get-Content -LiteralPath $source -Raw
  $ns = New-Object System.Xml.XmlNamespaceManager($document.NameTable)
  $ns.AddNamespace('svg', 'http://www.w3.org/2000/svg')
  $background = $document.SelectSingleNode('/svg:svg/svg:ellipse[@class="st0"]', $ns)
  if ($null -eq $background) { throw 'Expected background ellipse missing from official logo.' }
  [void]$background.ParentNode.RemoveChild($background)
  $document.Save($temporary)
  & node (Join-Path $PSScriptRoot 'render-brand-assets.cjs') $temporary
  if ($LASTEXITCODE -ne 0) { throw 'Asset rendering failed.' }
} finally {
  if (Test-Path -LiteralPath $temporary) { Remove-Item -LiteralPath $temporary }
}
