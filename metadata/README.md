# TipStream NFT Metadata

This directory contains metadata files for TipStream Pro NFT receipts.

## Structure

```
metadata/
├── 1.json
├── 2.json
├── 3.json
├── ...
└── 10.json
```

## Metadata Standard

Follows ERC-721 Metadata JSON Schema:

```json
{
  "name": "TipStream Receipt #1",
  "description": "Commemorative tip receipt from TipStream Pro",
  "image": "https://adekunlebamz.github.io/Tipstream-pro/images/receipt.svg",
  "external_url": "https://tipstream-pro.vercel.app",
  "attributes": [
    {
      "trait_type": "Platform",
      "value": "TipStream Pro"
    },
    {
      "trait_type": "Chain",
      "value": "Base"
    }
  ]
}
```

## Hosting

Metadata is hosted on GitHub Pages:
- **Base URI**: `https://adekunlebamz.github.io/Tipstream-pro/metadata/`
- **Token 1**: `https://adekunlebamz.github.io/Tipstream-pro/metadata/1.json`

## Adding New Metadata

1. Create JSON file with incrementing number
2. Follow the schema above
3. Commit and push to main branch
4. GitHub Pages auto-deploys

## Dynamic Metadata (Future)

Plans to add:
- Tip amount in attributes
- Timestamp information
- Sender/receiver details
- Dynamic image generation
