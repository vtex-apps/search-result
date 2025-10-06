# VTEX Search Result App - AI Coding Instructions

## Project Overview
This is a VTEX IO app that handles search results display for e-commerce stores. It exports React components that render product galleries, filters, sorting, and pagination using the VTEX Search API.

## Architecture & Key Concepts

### VTEX IO App Structure
- `manifest.json`: Defines app metadata, dependencies, and builders
- `store/`: Contains block definitions (`interfaces.json`), schemas, and store configurations
- `react/`: React components, hooks, utils, and TypeScript definitions
- This is a **store block app** (not a pixel app or service) - components are consumed by VTEX Store Framework

### Component Architecture Patterns
- **Legacy vs Modern**: Many components have both legacy versions (e.g., `GalleryLegacy.tsx`) and newer implementations
- **Context Providers**: Use `ContextProviders.js` for wrapping components with necessary contexts
- **Flexible Components**: Components ending with "Flexible" (e.g., `SearchResultFlexible.js`) adapt to different layouts
- **CSS Handles**: All styling uses `vtex.css-handles` - never write CSS classes directly, always use `useCssHandles(CSS_HANDLES)`

### VTEX-Specific Patterns
```javascript
// Always import VTEX dependencies with full module names
import { useRuntime } from 'vtex.render-runtime'
import { useDevice } from 'vtex.device-detector'
import { useCssHandles } from 'vtex.css-handles'

// Component exports must match store/interfaces.json definitions
export default Gallery // maps to "gallery" block in interfaces.json
```

### Search Context Integration
- Components consume `vtex.search-page-context` for search state
- Query handling through `useRuntime().query` and `setQuery()`
- Map/query URL structure: `/search?map=c,c&query=category,subcategory`

## Development Workflows

### Testing
```bash
# Run tests (from react/ directory)
yarn test
# Uses @vtex/test-tools with Jest and React Testing Library
```

### Local Development
- Use VTEX CLI: `vtex link` for development
- Components are tested in isolation with comprehensive mocks in `__mocks__/`
- TypeScript configuration extends `@vtex/tsconfig`

### Component Creation Guidelines
1. Check `store/interfaces.json` for block definitions first
2. Create TypeScript files (`.tsx`) for new components
3. Add CSS handles constant: `const CSS_HANDLES = ['container', 'element']`
4. Export component matching the interface name exactly
5. Add to `react/index.js` if it's a main export

## Key Files & Patterns

### Core Entry Points
- `react/index.js`: Main search result container
- `react/Gallery.tsx`: Product gallery with layout switching
- `react/FilterNavigator.js`: Search filters and facets

### Hook Patterns
```javascript
// Custom hooks follow consistent patterns in hooks/
const useFacetNavigation = () => {
  // Returns { facets, toggleFacet, clearFilters }
}
```

### Constants Organization
- `react/constants.ts`: Search-related constants
- `react/constants/`: Directory for grouped constants

### Mocking Strategy
- Extensive mocks in `__mocks__/` for VTEX dependencies
- Mock GraphQL responses in test files
- Use `@vtex/test-tools` for component testing

## Component Communication
- Props flow through component hierarchy
- Context for shared state (search filters, layout mode)
- Event handlers passed down from container components
- GraphQL queries handled at container level

## Code Quality Notes
- TypeScript for all new components
- ESLint configuration for VTEX standards
- Snapshot testing for UI regression prevention
- Comprehensive unit tests for hooks and utilities

## External Dependencies Integration
- React components use VTEX's component library (`vtex.styleguide`)
- GraphQL through `react-apollo` v3.1.3
- State management with React hooks and context
- Animation libraries: `react-spring`, `react-motion`, `react-collapse`