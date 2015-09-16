import Ember from 'ember';

export default Ember.Controller.extend({
  populations: [],
  currentAssessment: "Stroke", // default
  patientSearch: '',

  currentPatient: null,
  selectedCategory: null,

  riskAssessments: Ember.computed(function() {
    // TODO: get this list from the backend
    return ['Stroke', 'Negative Outcome'];
  }),

  selectedItems: Ember.computed.filterBy('model.populations', 'selected', true),
    selectedItemsCount: (function() {
    return this.get('selectedItems.length');
  }).property('selectedItems.[]'),

  patients: Ember.computed('selectedItems.@each', function() {
    if (this.get('selectedItemsCount') === 0) {
      return this.get('model.patients');
    } else {
      console.error("This code path is broken until testing with IE server");
      return this.get('model.patients');
    }
  }),

  sortedPatients: Ember.computed('patients.@each.notifications.count', function() {
    return this.get('patients').sortBy('notifications.count', 'computedAge').reverse();
  }),

  filteredPatients: Ember.computed('sortedPatients', 'patientSearch', function() {
    let rx = new RegExp(this.get("patientSearch"), "gi");
    return this.get('sortedPatients').filter(function(p) {
      return p.get("fullName").toString().match(rx);
    });
  }),

  actions: {
    selectRiskAssessment(assessment) {
      this.set("currentAssessment", assessment);
      this.set('selectedCategory', null);
    },

    selectPatient(patient) {
      this.set('currentPatient', patient);
      this.set('selectedCategory', null);
    },

    selectCategory(category) {
      this.set('selectedCategory', category);
    }
  }
});
