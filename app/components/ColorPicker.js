import Mediator from '../lib/Mediator';
import bindAll from 'lodash.bindAll';
import classes from 'dom-classes';

export default class ColorPicker {
  constructor($el, id, colors, currentColor) {
    bindAll(this, 'onClick');

    this.$el = $el;
    this.id = id;
    this.colors = colors;
    this.$selected = undefined;

    let div;
    this.colors.forEach((color) => {
      div = document.createElement('div');
      div.setAttribute('data-color', color);
      div.style.backgroundColor = color;
      if (color === currentColor) {
        classes.add(div, 'selected');
        this.$selected = div;
      }
      this.$el.appendChild(div);
    });

    this.$el.addEventListener('click', this.onClick);
  }

  onClick(e) {
    if (!e.target.hasAttribute('data-color')) return;

    if (this.$selected) {
      classes.remove(this.$selected, 'selected');
    }

    this.$selected = e.target;
    classes.add(this.$selected, 'selected');

    Mediator.emit(`picker:${this.id}:change`, e.target.getAttribute('data-color'));
  }
}