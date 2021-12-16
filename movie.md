# Movie

```ts
interface Genre {
  id: string;
  name: string;
}

interface Person {
  id: string;
  firstName: string;
  lastName: string;
  gender: string;
}

interface Movie {
  id: string;
  title: string;
  year: number;
  time: number;
  language: number;
  country: number;
  director: Person;
  cast: [ { actor: Person, role: string }]
}
```

