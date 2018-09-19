let default_options = {
  components: [],
  skip: false,
};

export class Entity extends Map {
  constructor(options = {}) {
    super();
    Object.assign(this, default_options, options);

    this.entities = new Set();

    for (let component of options.components) {
      this.attach(component);
    }
  }

  attach(component) {
    component.entity = this;
    component.mount();
    this.set(component.constructor, component);

    if (this.game) {
      if (!this.game.components.has(component.constructor)) {
        this.game.components.set(component.constructor, new Set());
      }
      this.game.components.get(component.constructor).add(component);
    }
  }

  detach(component) {
    let instance = this.get(component);
    this.delete(component);

    if (this.game && this.game.components.has(component)) {
      this.game.components.get(component).delete(instance);
    }
  }

  *iterall(component) {
    for (let child of this.entities) {
      if (child.has(component)) {
        yield child.get(component);
      }
      yield * child.iterall(component);
    }
  }

  add(entity) {
    entity.parent = this;
    this.entities.add(entity);

    if (this.game) {
      // Track the child if the current entity already exists in the scene.
      this.game.track_entity(entity);
    }
  }

  update(tick_delta) {
    if (this.skip) {
      return;
    }

    let update_each = updatable => updatable.update(tick_delta);
    this.forEach(update_each);
    this.entities.forEach(update_each);
  }

  render(tick_delta) {
    if (this.skip) {
      return;
    }

    let render_each = renderable => renderable.render(tick_delta);
    this.forEach(render_each);
    this.entities.forEach(render_each);
  }
}
