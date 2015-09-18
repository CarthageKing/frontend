import Ember from 'ember';
import $ from 'jquery';

const { isNone, get: get } = Ember;
const { SelectFx } = window;

export default Ember.Component.extend({
  tagName: 'span',
  placeholder: null,
  options: null,
  value: null,
  valuePath: null,
  _selectFx: null,

  proxiedOptions: Ember.computed('options.[]', 'value', 'valuePath', function() {
    let valuePath = this.get('valuePath');
    let value = valuePath? this.get(`value.${valuePath}`) : this.get('value');

    return this.get('options').map(function(currentValue) {
      let optionValue = valuePath ? get(currentValue, valuePath) : currentValue;
      return {
        value: optionValue,
        selected: value === optionValue ? true : null
      };
    });
  }),

  placeholderSelected: Ember.computed('placeholder', 'value', 'valuePath', function() {
    let valuePath = this.get('valuePath');
    let value = valuePath? this.get(`value.${valuePath}`) : this.get('value');

    if (isNone(value)) {
      return true;
    }
    return null;
  }),

  _setup: Ember.on('didInsertElement', function() {
    let element = $(this.element).find('select')[0];
    this._selectFx = new SelectFx(element, {
      onChange: (value) => {
        this.sendAction('onChange', value);
      }
    });
  })
});
