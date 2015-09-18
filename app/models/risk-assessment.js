import Ember from 'ember';
import DS from 'ember-data';
import RiskAssessment from 'ember-fhir-adapter/models/risk-assessment';

let IERiskAssessment = RiskAssessment.extend({
  pie: DS.belongsTo('pie', {async: true}),
  value: Ember.computed.reads('prediction.firstObject.probabilityDecimal')
});

export default IERiskAssessment;