import Ember from 'ember';
import Route from 'ember-route';
import service from 'ember-service/inject';
import get from 'ember-metal/get';
import AuthenticatedRouteMixin from 'ember-simple-auth/mixins/authenticated-route-mixin';
import PaginatedRouteMixin from 'ember-cli-pagination/remote/route-mixin';
import FHIRPagedRemoteArray from '../../utils/fhir-paged-remote-array';
import { parseHuddles } from 'ember-on-fhir/models/huddle';

const { RSVP } = Ember;

export default Route.extend(AuthenticatedRouteMixin, PaginatedRouteMixin, {
  store: service(),
  ajax: service(),

  perPage: 8,
  huddle: null,

  beforeModel(transition) {
    let huddleId = get(transition, 'queryParams.huddleId');
    if (huddleId) {
      return this.get('ajax').request(`/Group/${huddleId}`).then((response) => {
        this.set('huddle', parseHuddles(response));
      });
    }
  },

  model(params) {
    let paramMapping = {
      page: '_offset',
      perPage: '_count'
    };

    let store = this.get('store');
    let perPage = this.get('perPage');
    let patientIds = [];

    if (params.huddleId) {
      patientIds = this.get('huddle.patients').mapBy('patientId');
    }

    return RSVP.hash({
      // patients: store.findAll('patient'),
      patients: FHIRPagedRemoteArray.create({
        modelName: 'patient',
        store,
        page: params.page || 1,
        perPage,
        paramMapping,
        sortBy: params.sortBy || 'family',
        sortDescending: params.sortDescending,
        groupId: params.groupId,
        patientIds
      }),
      groups: store.findAll('group'),
      huddles: this.get('ajax').request('/Group', { data: { code: 'http://interventionengine.org/fhir/cs/huddle|HUDDLE' } }).then((response) => parseHuddles(response.entry || []))
      // risks: store.findAll('risk'),
      // notificationCounts: store.findAll('notification-count')
    });
  }
});
