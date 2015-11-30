import Mediator from '../lib/Mediator';
import bindAll from 'lodash.bindAll';
import classes from 'dom-classes';

export default class PatternPicker {
  constructor($el, id, patterns, currentPattern) {
    bindAll(this, 'onClick');

    this.$el = $el;
    this.id = id;
    this.patterns = patterns;
    this.$selected = undefined;
    this.$children = [];
    this.expended = false;

    if (currentPattern === null) currentPattern = 'none';

    let div;
    this.patterns.forEach((pattern) => {
      div = document.createElement('div');
      div.setAttribute('data-pattern', pattern);
      div.innerHTML = `<img src="./assets/previews/${pattern}.png">`;

      if (pattern === currentPattern) {
        classes.add(div, 'selected');
        this.$selected = div;
      }

      this.$children.push(div);
      this.$el.appendChild(div);
    });

    this.$el.addEventListener('click', this.onClick);
  }

  onClick(e) {
    let el;
    if (e.target.hasAttribute('data-pattern')) {
      el = e.target;
    } else {
      if (e.path) {
        e.path.forEach((node) => {
          if (node.hasAttribute && node.hasAttribute('data-pattern')) {
            el = node;
            return;
          }
        });
      } else if (e.target.parentNode.hasAttribute && e.target.parentNode.hasAttribute('data-pattern')) {
        el = e.target.parentNode;
      }
    }

    if (!el) return;

    if (this.$selected) {
      classes.remove(this.$selected, 'selected');
    }

    this.$selected = el;
    classes.add(this.$selected, 'selected');

    Mediator.emit(`picker:${this.id}:change`, el.getAttribute('data-pattern'));
  }
}