# Contributing to TipStream Pro

Thank you for your interest in contributing to TipStream Pro! This document provides guidelines and information for contributors.

## Code of Conduct

Please be respectful and constructive in all interactions. We're building a welcoming community for all contributors.

## Getting Started

### Prerequisites

- Node.js 18+
- pnpm (recommended) or npm
- Git
- MetaMask or similar wallet

### Development Setup

1. **Fork and clone the repository**
   ```bash
   git clone https://github.com/YOUR_USERNAME/Tipstream-pro.git
   cd Tipstream-pro
   ```

2. **Install dependencies**
   ```bash
   cd frontend
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```

4. **Start development server**
   ```bash
   pnpm dev
   ```

## Making Changes

### Branch Naming

Use descriptive branch names:
- `feature/add-leaderboard`
- `fix/wallet-connection`
- `docs/update-readme`
- `refactor/improve-hooks`

### Commit Messages

Follow conventional commits:
- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation
- `style:` Formatting
- `refactor:` Code restructuring
- `test:` Tests
- `chore:` Maintenance

Examples:
```
feat(tip): add amount presets
fix(wallet): handle connection timeout
docs(readme): update deployment instructions
```

### Code Style

- Use TypeScript for all new code
- Follow existing code patterns
- Run linting before committing
- Add comments for complex logic

### Testing

- Test your changes locally
- Verify wallet connections
- Test on Base testnet before mainnet

## Pull Request Process

1. **Update documentation** for any changed functionality
2. **Add/update tests** if applicable
3. **Run linting** to ensure code quality
4. **Create PR** with clear description
5. **Request review** from maintainers

### PR Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation
- [ ] Refactoring

## Testing
How was this tested?

## Screenshots
If applicable
```

## Areas for Contribution

### Good First Issues
- Documentation improvements
- UI/UX enhancements
- Bug fixes
- Accessibility improvements

### Feature Ideas
- Creator analytics
- Tip scheduling
- Multi-chain support
- Mobile optimizations

## Smart Contract Changes

⚠️ **Important**: Smart contracts are deployed and immutable. Contract changes require:
- Thorough review
- Testnet deployment
- Security audit consideration
- New deployment (not upgrade)

## Questions?

- Open a GitHub issue
- Join our Discord (coming soon)
- Tweet at @tipstreampro

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
