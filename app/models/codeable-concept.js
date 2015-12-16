import CodeableConcept from 'ember-fhir-adapter/models/codeable-concept';

let IECodeableConcept = CodeableConcept.extend({
  hasCode: function(code){
    let matchedCodes = this.get('coding').map(function(c){
      return c.get('system') === code.system && c.get('code') === code.code;
    });
    return matchedCodes.any(function(d){return d;});
  },

  toString: function(){
    return this.get("text")||this.get('coding.firstObject.display')||`${this.get('coding.firstObject.system')}-${this.get('coding.firstObject.code')}`;
  }
});

export default IECodeableConcept;
