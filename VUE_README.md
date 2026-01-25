# Vue Adapter Quick Start

## Installation

```bash
npm install shimmer-from-structure
```

Then, import directly from the Vue adapter:

```typescript
import { Shimmer } from '@shimmer-from-structure/vue';
```

## Vue 3 Usage

### Basic Example

```vue
<script setup>
import { ref } from 'vue';
import { Shimmer } from '@shimmer-from-structure/vue';

const loading = ref(true);

// Simulate data loading
setTimeout(() => {
  loading.value = false;
}, 2000);
</script>

<template>
  <Shimmer :loading="loading">
    <div class="card">
      <img src="/avatar.jpg" class="avatar" />
      <h2>John Doe</h2>
      <p>Software Engineer</p>
    </div>
  </Shimmer>
</template>

<style scoped>
.card {
  padding: 20px;
  background: #1e1e1e;
  border-radius: 12px;
}

.avatar {
  width: 64px;
  height: 64px;
  border-radius: 50%;
}
</style>
```

### With Dynamic Data

```vue
<script setup>
import { ref } from 'vue';
import { Shimmer } from 'shimmer-from-structure/vue';

const loading = ref(true);
const user = ref(null);

// Template for skeleton
const userTemplate = {
  name: 'Loading Name...',
  role: 'Loading Role...',
  avatar: '/placeholder.jpg',
};

// Fetch user data
setTimeout(() => {
  user.value = {
    name: 'Jane Smith',
    role: 'Product Designer',
    avatar: '/jane.jpg',
  };
  loading.value = false;
}, 2000);
</script>

<template>
  <Shimmer :loading="loading" :template-props="{ user: userTemplate }">
    <UserCard :user="user || userTemplate" />
  </Shimmer>
</template>
```

### Global Configuration

Set global shimmer defaults for your entire app:

```vue
<!-- App.vue -->
<script setup>
import { provideShimmerConfig } from '@shimmer-from-structure/vue';

provideShimmerConfig({
  shimmerColor: 'rgba(56, 189, 248, 0.4)',
  backgroundColor: 'rgba(56, 189, 248, 0.1)',
  duration: 2.5,
  fallbackBorderRadius: 8,
});
</script>

<template>
  <router-view />
</template>
```

## API Reference

### Props

| Prop                   | Type      | Default                    | Description                                   |
| ---------------------- | --------- | -------------------------- | --------------------------------------------- |
| `loading`              | `boolean` | `true`                     | Whether to show shimmer or content            |
| `shimmerColor`         | `string`  | `'rgba(255,255,255,0.15)'` | Color of shimmer wave                         |
| `backgroundColor`      | `string`  | `'rgba(255,255,255,0.08)'` | Background color of blocks                    |
| `duration`             | `number`  | `1.5`                      | Animation duration in seconds                 |
| `fallbackBorderRadius` | `number`  | `4`                        | Border radius for elements without CSS radius |
| `templateProps`        | `object`  | -                          | Props to inject for skeleton rendering        |

### Composables

```typescript
import { useShimmerConfig } from '@shimmer-from-structure/vue';

const config = useShimmerConfig();
console.log(config.shimmerColor); // Current shimmer color
```

### React Users

For React projects, you can use the main package or the explicit adapter:

```tsx
import { Shimmer } from '@shimmer-from-structure/react';
```

function UserCard() {
return (
<Shimmer loading={loading}>

<div>...</div>
</Shimmer>
);
}

```

```
