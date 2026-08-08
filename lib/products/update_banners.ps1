$path = "e:\eu\shopprint\lib\products\banner-products.ts"
$content = Get-Content $path -Raw -Encoding UTF8

# Update Interface
# Need to escape brackets for regex
$interfaceOldPattern = "tags: string\[\];\s*\}"
$interfaceNew = "tags: string[];`r`n    metadata?: {`r`n        type: 'banner-predefinit';`r`n        variants: Array<{`r`n            size: string;`r`n            price: number;`r`n            id: string;`r`n        }>;`r`n    };`r`n}"
$content = $content -replace $interfaceOldPattern, $interfaceNew

# Add Metadata to items
# We look for lines like: tags: ["tag1", "tag2"]
# and verify it's the item definition, not the interface
$metadataStr = ",`r`n        metadata: {`r`n            type: ""banner-predefinit"",`r`n            variants: [`r`n                { size: ""100x50cm"", price: 49, id: ""100x50"" },`r`n                { size: ""200x100cm"", price: 198, id: ""200x100"" },`r`n                { size: ""300x100cm"", price: 297, id: ""300x100"" }`r`n            ]`r`n        }"

# Replace tags: [...] with tags: [...], metadata...
# Using regex lookbehind or just capturing group
# Pattern: tags: \[.*?\] (not followed by ;)
$content = $content -replace '(tags: \[.*?\])(?!;)', ('$1' + $metadataStr)

Set-Content -Path $path -Value $content -Encoding UTF8
