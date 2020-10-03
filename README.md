# react-wc

> Tiny wrapper of Web Components for react.

## Usage

### Defining a Component

```ts
import { html, slot } from "react-wc";

export const Counters = html`
  <style>
    div {
      display: grid;
      grid: auto-flow / repeat(16, 80px);
      gap: 10px;
    }
  </style>
  <div>${slot()}</div>
`;
```

### Using Defined Component

```tsx
<Counters>children...</Counters>
```

### Rendered DOM

```html
<wc-9pseu4w3rao-1>
  #shadow-root
    <style>
      div {
        display: grid;
        grid: auto-flow / repeat(16, 80px);
        gap: 10px;
      }
    </style>
    <div><slot></slot></div>
  children...
</wc-9pseu4w3rao-1>
```

## Use Cases

Useful for doing Web Components-based CSS in JS. According to author's measurement, generated components are as fast as [linaria](https://github.com/callstack/linaria) and are twice as fast as [styled-components](https://styled-components.com/).

This repository has the `example/` directory where you can compare the speed of `react-wc`, `linaria` and `styled-components`.

## Why `react-wc`?

The developer experience is very close to the standard Web Components.

Also, it is intentionally not really powerful so it cannot contain any logic. This helps decoupling logic components and styling components.

Another point is that `react-wc` can pack up **HTML Structure with styles**, not just single element with styles.

## What About Syntax Highlighting?

To get the `html` string syntax-highlighted on VSCode, use [the VSCode plugin for lit-html](https://marketplace.visualstudio.com/items?itemName=bierner.lit-html).

## Advanced Usage

Specifying multiple slots:

```ts
export const AppStyle = html`
  <style>
    header {
      border: 1px solid #cccccc;
      padding: 4px;
    }
    p {
      border-bottom: 1px dashed #999999;
    }
  </style>
  <header>${slot("header")}</header>
  <p>Counter value is ${slot("counter")}</p>
  <main>${slot()}</main>
`;
```

Named slots can be filled by a prop with the same name:

```tsx
<AppStyle
  header={
    <p>
      <button onClick={() => setCounter((c) => c + 1)}>+1</button>
    </p>
  }
  counter={<CounterValue>{counter}</CounterValue>}
>
  <Counters>
    {[...range(0, 256)].map((i) => (
      <Counter key={i}>{counter}</Counter>
    ))}
  </Counters>
</AppStyle>
```

## Further Reading

- [Blog article (日本語)](https://blog.uhy.ooo/entry/2020-10-03/react-wc/)

## Future Roadmap

- [ ] Move some code to build-time
- [ ] Support JSX-based API?
- [ ] SSR Support?

## Contributing

Welcome

## License

MIT