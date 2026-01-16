# Security Policy

## Supported Versions

| Version | Supported          |
| ------- | ------------------ |
| 1.x     | :white_check_mark: |

## Reporting a Vulnerability

We take security seriously at TipStream Pro. If you discover a security vulnerability, please report it responsibly.

### How to Report

1. **DO NOT** create a public GitHub issue for security vulnerabilities
2. Email security concerns to: security@tipstream.pro
3. Include as much detail as possible:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if any)

### What to Expect

- **Acknowledgment**: Within 48 hours
- **Initial Assessment**: Within 1 week
- **Resolution Timeline**: Depends on severity

### Scope

The following are in scope for security reports:

#### Smart Contracts
- TipStream.sol
- SubscriptionManager.sol
- TipNFT.sol
- DailyCheckIn.sol

#### Frontend
- Wallet connection security
- Transaction handling
- Data validation
- XSS/injection vulnerabilities

#### Infrastructure
- API endpoints
- Environment variable exposure
- Dependency vulnerabilities

### Out of Scope

- Social engineering attacks
- Physical attacks
- Denial of Service (DoS)
- Issues in dependencies without a fix available

## Security Best Practices

### For Users

1. **Verify Contract Addresses**
   - Always verify you're interacting with official contracts
   - Check addresses on BaseScan

2. **Wallet Security**
   - Use hardware wallets for large amounts
   - Never share private keys
   - Verify transaction details before signing

3. **Phishing Awareness**
   - Only use official TipStream Pro domains
   - Verify URLs before connecting wallet

### For Developers

1. **Environment Variables**
   - Never commit `.env` files
   - Use `.env.example` for templates
   - Rotate secrets if exposed

2. **Dependencies**
   - Keep dependencies updated
   - Run `pnpm audit` regularly
   - Review dependency changes

3. **Code Review**
   - All changes require review
   - Security-sensitive changes need extra scrutiny

## Contract Security

### Audits
- Contracts follow OpenZeppelin standards
- Community review encouraged
- Formal audit planned for v2

### Known Limitations
- Contracts are not upgradeable
- Owner has admin privileges
- No time-locks on admin functions

## Bug Bounty

We're planning a bug bounty program. Details coming soon.

### Severity Levels

| Level | Description | Potential Reward |
|-------|-------------|------------------|
| Critical | Direct fund loss | TBD |
| High | Significant impact | TBD |
| Medium | Limited impact | TBD |
| Low | Minor issues | Recognition |

## Disclosure Policy

- We practice responsible disclosure
- Reporters will be credited (if desired)
- We aim to fix critical issues within 7 days

## Contact

- Security: security@tipstream.pro
- General: hello@tipstream.pro

Thank you for helping keep TipStream Pro secure!
