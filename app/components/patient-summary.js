import Ember from 'ember';
import service from 'ember-service/inject';
import PatientIconClassNames from '../mixins/patient-icon-class-names';

export default Ember.Component.extend(PatientIconClassNames, {
  classNames: ['patient-summary'],
  store: service(),

  patient: null,
  currentAssessment: null,
  selectedRisk: null,
  huddle: null,
  hasRisks: false,

  risksWithBirthdayStart: Ember.computed('patient.sortedRisks', 'patient.birthDate', 'currentAssessment', function() {
    let currentAssessment = this.get('currentAssessment');
    if (Ember.isNone(currentAssessment)) {
      return [];
    }

    let store = this.get('store');

    let birthRisk = store.createRecord('risk-assessment', { date: this.get('patient.birthDate') });
    let riskCode = store.createRecord('codeable-concept', { text: currentAssessment });
    let rapc = store.createRecord('risk-assessment-prediction-component', { probabilityDecimal: 0 });
    rapc.set('outcome', riskCode);
    birthRisk.get('prediction').pushObject(rapc);
    let risks = [birthRisk];
    risks.pushObjects(this.get('patient.sortedRisks'));
    return risks.filterBy('prediction.firstObject.outcome.displayText', currentAssessment);
  }),

  patientPhoto: Ember.computed.reads('patient.photo')
});
