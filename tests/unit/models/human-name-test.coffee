`import { test, moduleForModel } from 'ember-qunit'`

moduleForModel 'human-name', 'HumanName', {
  # Specify the other units that are required for this test.
  needs: ['model:period', 'model:date']
}

test 'it exists', ->
  model = @subject()
  # store = @store()
  ok !!model
