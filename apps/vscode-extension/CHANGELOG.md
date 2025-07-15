# Change Log

## [0.0.1] - 2025-07-14

### Added

- Initial release of MoonCode extension
- Time tracking functionality for coding sessions
- Language-specific time tracking
- File-level activity monitoring
- Dashboard for viewing coding statistics
- Login system for user accounts
- Integration with MoonCode backend API
- Dashboard opening functionality

### Features

- Real-time coding time tracking
- Detailed statistics by programming language
- File-level tracking and analysis
- User authentication system
- Web dashboard integration
- Command palette integration

### Technical

- Built with TypeScript
- Uses tRPC for type-safe API communication
- NestJS server integration
- VSCode extension API integration
- Modular architecture with monorepo support

## [0.0.2] - 2025-07-14

### Fixes

- removed useless `onCommand:Mooncode.activate` from the `activationEvents` in `package.json`

## [0.0.3] - 2025-07-14

### Fixes

- added missing dependency `express`

## [0.0.4] - 2025-07-14

### Fixes

- copied dashboard build files in the extension directory

## [0.0.5] - 2025-07-15

### Chores

- improved `README.md` and `CHANGELOG.md`
