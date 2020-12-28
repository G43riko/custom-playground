# Core ECS classes

## Components

### PhysicsMaterialComponent

- bounciness
- friction

### TransformComponent

- position
- rotation
- scale

### MouseFallow

- if has MovementComponent
    - set movement direction to mouse position
- else
    - on update set object position to mouse position

### RenderRect

- size

### RenderArc

- radius

### ColliderRect

- size

### ColliderArc

- radius

### MovingComponent

- velocity
- speed

### RigidBodyComponent

### BasicRenderComponent

- fillColor
- strokeColor
- strokeWidth

## Systems

### ColliderRenderSystem

require `BasicRenderComponent`.

render every `ColliderRect`, `ColliderArc`

### RigidCollisionsSystem

require `RigidBodyComponent`

### MovingSystem

require `MovingComponent`
