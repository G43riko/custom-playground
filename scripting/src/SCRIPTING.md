## Parameters

- `{n}` - number
    - `{f}` - float
    - `{i}` - int
    - `{t}` - time `{n} {(ms|s|m|h|d)}`
- `{s}` - string
    - `{b}` - blockId
      `{t}`- tree
    - `{s}` - side
- `{p3|p2}` - position `{i} {i} {i}?`
    - `{r3|r2}` - relative (from player). Starts with prefix _
    - `{a3|a2}` - absolute
- `{j}` - json object `{name: "Gabo", age: 21, male: true, props: {}, nicks: []}`

## Usage

```typescript
const parser = CommonParser.extends([
    ["id", "EntityId", new EntityIdParser()]
])

const executor = new CustomExecutor([
    [new EntityDeleteExecutor(), "DEL {id[]}"]
])

executor.executorRow("DEL id1 id2 id3")
```

## List

- set block `{b} {p[]}`
- fill with blocks `{b} {p} {p}`
- grow tree `{t} {p[]}`
- fog
- time
