import 'react-native'
import React from 'react'
import { render } from 'react-native-testing-library'

import Goal from '../src/Goal'

describe('Goal Component Tests', () => {
  it('Should display the TextInput field with the value', () => {
    const goal = { id: 'randomId', checked: true, text: 'Hello' }
    const { getByDisplayValue, getByTestId } = render(
      <Goal
        goal={goal}
        onChange={jest.fn}
        addItem={jest.fn}
        removeItem={jest.fn}
        focusComponent
        setShouldFocus={jest.fn}
      />
    )

    const textInput = getByDisplayValue('Hello')
    const checkbox = getByTestId('checkbox')

    // check if textInput with 'Hello' value is there
    expect(textInput).toBeTruthy()
    // check if the checkbox is checked
    expect(checkbox).toBeTruthy()
    expect(checkbox.props.value).toBeTruthy()
  })
})
