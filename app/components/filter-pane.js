import Ember from 'ember';
import createGCC from '../utils/group-characteristic-generator';

const { computed } = Ember;

export default Ember.Component.extend({
  store: Ember.inject.service(),

  classNames: ['row', 'pane'],

  pane: null,
  characteristic: computed.alias('pane.characteristic'),
  group: null,

  filterType: computed.reads('pane.type'),

  icon: computed('filterType', function() {
    let filterType = this.get('filterType');

    if (filterType === 'age-filter') {
      return 'fa-birthday-cake';
    } else if (filterType === 'condition-code-filter') {
      return 'icon-med-clipboard';
    } else if (filterType === 'encounter-code-filter') {
      return 'fa-hospital-o';
    }

    return 'fa-user';
  }),

  actions: {
    createCharacteristic() {
      let characteristic = createGCC(this, this.get('filterType'));
      this.set('characteristic', characteristic);
      this.get('group.characteristic').addObject(characteristic);
    },

    destroyCharacteristic() {
      if (Ember.isEmpty(this.get('characteristic'))) {
        return;
      }

      this.get('group.characteristic').removeObject(this.get('characteristic'));
      this.set('characteristic', null);
    },

    removePane() {
      this.send('destroyCharacteristic');
      this.sendAction('removePane', this.get('pane'));
    }
  }
});
