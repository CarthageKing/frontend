import Ember from 'ember';
import DS from 'ember-data';

export default DS.Model.extend({
  slices: DS.hasMany('slice', { embedded: true, async: false }),

  sliceArray: Ember.computed('slices.[]', function() {
    let maxWeight = Math.max.apply(Math, this.get('slices').mapBy('weight'));

    return this.get('slices').map(function(slice) {
      return {
        weight: slice.get('weight'),
        value: slice.get('value'),
        name: slice.get('name'),
        maxValue: slice.get('maxValue'),
        maxWeight
      };
    });
  })
});
