`import { test, moduleForModel } from 'ember-qunit'`

moduleForModel 'extension', 'Extension', {
  # Specify the other units that are required for this test.
  needs: ['model:codeable-concept', 'model:coding']
}

test 'it exists', ->
  model = @subject()
  # store = @store()
  ok !!model
