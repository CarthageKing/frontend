`import ApplicationSerializer from './application'`

PatientSerializer = ApplicationSerializer.extend
  normalize: (type, hash, prop) ->
    queryParam = "?patient:Patient=#{hash.id}"
    medQuery = "?patient:Patient=#{hash.id}"
    (hash.content||hash)["links"] = conditions: "/Condition#{queryParam}", observations: "/Observation#{queryParam}", encounters: "/Encounter#{queryParam}", medications: "/MedicationStatement#{medQuery}"
    @_super(type, hash, prop)

`export default PatientSerializer`
