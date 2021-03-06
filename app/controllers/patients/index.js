import Controller from 'ember-controller';
import computed from 'ember-computed';
import observer from 'ember-metal/observer';
import run from 'ember-runloop';
import inject from 'ember-service/inject';
import { isEmpty } from 'ember-utils';

export default Controller.extend({
  queryParams: ['page', { currentAssessment: 'risk_assessment' }, 'sortBy', 'sortDescending', 'groupId', 'huddleId'],

  router: inject('-routing'),

  page: 1,
  perPage: 8,

  currentAssessment: 'Catastrophic Health Event', // default
  selectedPopulation: computed('groupId', {
    get() {
      let groupId = this.get('groupId');
      if (groupId == null || groupId === '') {
        return null;
      }

      return this.get('populations').findBy('id', groupId);
    }
  }),
  selectedHuddle: computed('huddleId', {
    get() {
      let huddleId = this.get('huddleId');
      if (huddleId == null || huddleId === '') {
        return null;
      }

      return this.get('model.huddles').findBy('id', this.get('huddleId'));
    }
  }),
  patientSearch: '',
  currentPatient: null,
  sortBy: 'name,birthdate',
  sortDescending: false,
  riskLowValue: 1,
  riskHighValue: 4,
  interventionTypes: [],
  huddleId: '',
  groupId: '',

  patientSearchObserver: observer('patientSearch', function() {
    run.debounce(this, this.refetch, 150);
  }),

  populations: computed('model.groups.[]', {
    get() {
      return this.get('model.groups').filter((group) => {
        let code = group.get('code.coding.firstObject.code');
        return code == null || code.toUpperCase() !== 'HUDDLE';
      });
    }
  }),

  huddlePatientIds: computed('selectedHuddle', {
    get() {
      let selectedHuddle = this.get('selectedHuddle');
      if (selectedHuddle == null) {
        return [];
      }
      return selectedHuddle.get('patients').mapBy('patientId');
    }
  }),

  totalPatients: computed.reads('model.patients.meta.total'),

  riskAssessments: computed({
    get() {
      // TODO: get this list from the backend
      return ['Catastrophic Health Event'];
    }
  }),

  populationPatients: computed.reads('model.patients'),

  refetch() {
    run(() => {
      this.set('page', 1);
      let groupIds = [this.get('huddleId'), this.get('groupId')].filter((n) => n);

      let patientsRemoteArray = this.get('model.patients');
      patientsRemoteArray.set('sortBy', this.get('sortBy'));
      patientsRemoteArray.set('sortDescending', this.get('sortDescending'));
      patientsRemoteArray.set('groupId', groupIds);
      // patientsRemoteArray.set('patientIds', this.get('huddlePatientIds'));
      patientsRemoteArray.set('patientSearch', this.get('patientSearch'));
      patientsRemoteArray.set('page', 1);
      patientsRemoteArray.pageChanged();
    });
  },

  actions: {
    selectRiskAssessment(assessment) {
      this.set('currentAssessment', assessment);
    },

    selectHuddle(huddle) {
      this.set('selectedHuddle', huddle);
      this.set('huddleId', huddle ? huddle.get('id') : '');

      this.refetch();
    },

    togglePopulation(population, active) {
      if (active) {
        this.set('groupId', population.get('id'));
      } else {
        this.set('groupId', '');
      }

      this.refetch();
    },

    setRiskScore(lowValue, highValue) {
      this.set('riskLowValue', lowValue);
      this.set('riskHighValue', highValue);
    },

    selectSortBy(sortBy, sortDescending) {
      let currentSortBy = this.get('sortBy');
      let currentSortDesc = this.get('sortDescending');

      // do nothing if nothing has changed
      if (currentSortBy === sortBy && currentSortDesc === sortDescending) {
        return;
      }

      this.set('sortBy', sortBy);
      this.set('sortDescending', sortDescending);

      this.refetch();
    },

    setPage(page) {
      this.set('page', page);
    },

    openPatientPrintList(event) {
      event.preventDefault();
      event.stopImmediatePropagation();

      let queryParams = {
        sortBy: this.get('sortBy'),
        sortDescending: this.get('sortDescending'),
        assessment: this.get('currentAssessment')
      };

      let huddleId = this.get('huddleId');
      let groupId = this.get('groupId');

      if (huddleId) {
        queryParams.huddleId = huddleId;
      }

      if (groupId) {
        queryParams.groupId = groupId;
      }

      let patientSearch = this.get('patientSearch');
      if (!isEmpty(patientSearch)) {
        queryParams.name = patientSearch;
      }

      let url = this.get('router.router').generate('patients.print', { queryParams });
      window.open(url, 'patientPrintList', 'menubar=no,toolbar=no,location=no,status=yes,resizable=yes,scrollbars=yes');
    }
  }
});
