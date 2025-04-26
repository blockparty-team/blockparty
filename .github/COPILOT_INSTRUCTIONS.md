# GitHub Copilot Instructions for Blockparty Project

## Project Overview

This project is a mobile application ecosystem built with Ionic Angular using Angular 19, focusing on festival and event experiences. The project follows modern Angular best practices with a push-based architecture using signals and observables.

## Technical Stack

- **Angular**: Version 19.2.5 with standalone components
- **Ionic**: Version 8.5.4
- **State Management**: @ngrx/signals (19.1.0)
- **Reactive Programming**: RxJS 7.8.2
- **Backend Integration**: Supabase
- **Mobile**: Capacitor 7.2.0 for Android and iOS
- **Mapping**: MapLibre GL (5.3.0), OpenLayers (10.5.0)

## Project Structure

The project is organized using an Nx monorepo architecture with multiple apps and shared libraries:

- **Apps**:

  - `distortion`: Ionic mobile app for Distortion Festival
  - `product`: Web application
  - `studieby`: Ionic mobile app
  - `tweak`: Ionic mobile app

- **Libraries**:
  - `festival/data-access`: Data access layer for festival features
  - `festival/feature`: Feature libraries for festival components
  - `festival/shared`: Shared utilities and types
  - `festival/ui`: UI components specific to festival features
  - `shared/data-access`: Shared data services (Supabase, DeviceStorage)
  - `shared/environments`: Environment configurations
  - `shared/service`: Common services

## Architecture Patterns

- **Standalone Components**: Using Angular's standalone component API
- **Push-based Architecture**: Favoring observables and async pipes for data flow
- **Reactive Patterns**: Heavy use of RxJS operators like filter, tap, catchError, concat
- **Service Injection**: Using Angular's inject() function rather than constructor injection
- **Mobile-first Design**: Using Ionic components optimized for mobile experiences

## Signal-based Store Architecture

To align the project with a signal-based store architecture using plain Angular signals, the following adjustments and patterns should be adopted:

### State Management

- Use Angular's `signal` API to define reactive state slices.
- Structure state into feature-specific stores, each encapsulating its own signals and state management logic.
- Use immutable updates for state changes to ensure predictability.

### Store Structure

- **Global Store**: Manages application-wide state such as user authentication, app configuration, and theme settings.
- **Feature Stores**: Handles feature-specific state, such as festival data, map interactions, and user preferences.
- **Local Component State**: Use signals directly within components for transient state that does not require persistence.

### Example Signal-based Store

```typescript
import { signal } from '@angular/core';

export class FestivalStore {
  festivals = signal([]);
  selectedFestival = signal(null);
  loading = signal(false);

  async loadFestivals() {
    this.loading.set(true);
    try {
      const festivals = await fetchFestivalsFromApi();
      this.festivals.set(festivals);
    } catch (error) {
      console.error('Failed to load festivals', error);
    } finally {
      this.loading.set(false);
    }
  }

  selectFestival(festival: Festival) {
    this.selectedFestival.set(festival);
  }
}
```

### Benefits of Signal-based Store

- **Reactivity**: Signals provide a simple and declarative way to manage reactive state.
- **Simplicity**: Reduces the complexity and boilerplate of traditional state management libraries.
- **Performance**: Signals are optimized for fine-grained reactivity, minimizing unnecessary updates.

### Migration Plan

1. Identify existing state management logic implemented with services or traditional NgRx.
2. Refactor state logic into plain Angular signals while ensuring compatibility with existing components.
3. Update components to consume state using signals and reactive patterns.
4. Conduct thorough testing to ensure state updates propagate correctly and efficiently.

By adopting plain Angular signals for state management, the project will achieve a more streamlined, reactive, and maintainable architecture.

## Code Conventions

- Use signals for component and service state where appropriate
- Prefer standalone components with imports array over NgModules
- Use RxJS operators for data transformation and event handling
- Follow repository pattern for data access layers
- Implement lazy loading for routes and feature modules
- Use proper typing with TypeScript interfaces and models

## Common Patterns

- State management using `signalState()` and `patchState()` from @ngrx/signals
- Dependency injection using `inject()` function
- Data fetching with RxJS streams and error handling
- Mobile UI components using Ionic standalone components
- Map visualizations using MapLibre GL and OpenLayers

## Important Services

- `AppConfigService`: Manages application configuration with signal-based state
- `DeviceStorageService`: Handles local storage on devices
- `SupabaseService`: Manages Supabase backend connections and queries

When making changes, ensure compatibility with the existing architecture and follow the established patterns for reactive programming and signal-based state management.
