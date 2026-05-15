# Agent Rules

## File Creation

- Each newly created file should define only one React component or one hook.
- Standalone functions outside a component or hook must be moved into their own reusable file.
- Prefer importing shared functions from `src/lib`, `src/hooks`, or a nearby feature-level helper file instead of redefining them inside component files.
