# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.6.0] - 2026-01-24

### Changed

- **Visible Borders**: Modified Shimmer to keep `border-color` visible while hiding text content. This ensures tables and cards maintain their structural outline during loading.

### Added

- **Dev Experience**: Configured Husky, lint-staged, and Prettier for better code quality.
- **Example**: Added a Table example to the demo app to showcase the improved border handling.

## [0.5.0] - 2026-01-24

### Added

- **Context API Support**: Introduced `ShimmerProvider` for setting global configuration values.
- **useShimmerConfig Hook**: Access shimmer configuration in any component.
- **New Exports**: Exported `ShimmerConfig` type and context components.

### Improved

- **Documentation**: Updated README with Context API usage examples.
- **Example App**: Added "Context API Example" section to the demo dashboard.

### Fixed

- **Testing**: Improved test resilience for border-radius fallbacks.
