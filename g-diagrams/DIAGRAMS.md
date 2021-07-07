# Diagrams

- diagram is like layer
- diagram has type (class/component/sequence/state)

## TODO

- create _functions_ which would be alternative to methods but without parent entity
- Usage

Current state: 6.7.2021
```typescript
const model = new DiagramModel();
const errors = model.validate();

```
## Use cases

- add/remove object from list to diagram

### Class/Interface

- Create Class
    - set name
- Update Class
    - update attribute
        - add/update attribute
            - accessor
            - name
            - type
                - select existing type
            - default
            - static remove attribute
    - update method
        - addMethod
            - name
            - parameters
                - name
                - type
                    - select existing type
                - optional
                - default

### Primitive

- Create Primitive
    - name
