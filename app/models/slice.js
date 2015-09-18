import DS from 'ember-data';

let Slice = DS.Model.extend({
  name: DS.attr('string'),
  weight: DS.attr('number'),
  value: DS.attr('value'),
  maxValue: DS.attr('number')
});

export default Slice;