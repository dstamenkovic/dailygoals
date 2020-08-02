import 'react-native'
import React from 'react'
import App from '../src/App'

import renderer from 'react-test-renderer'
import { render, fireEvent, cleanup } from 'react-native-testing-library'

describe('App Tests', () => {
  afterEach(cleanup)

  it('renders correctly', () => {
    renderer.create(<App />)
  })

  it('Updates the text input', () => {
    const { getByTestId } = render(<App />)
    const textInput = getByTestId('textinput')

    const newValue = 'Go for a run'
    fireEvent.changeText(textInput, newValue)
    expect(textInput.props.value).toBe(newValue)
  })

  it('Adds new item on submit', () => {
    const { getAllByTestId } = render(<App />)

    const textInputsCurrent = getAllByTestId('textinput')
    expect(textInputsCurrent.length).toBe(1)
    // submit TextInput
    fireEvent(textInputsCurrent[0], 'onSubmitEditing')
    // there should be 2 TextInput fields
    const textInputs = getAllByTestId('textinput')
    expect(textInputs.length).toBe(2)
  })

  it('Removes the item on "backspace" when empty', () => {
    const { getAllByTestId } = render(<App />)

    // add text to the first item/goal
    fireEvent.changeText(getAllByTestId('textinput')[0], 'Test')
    // add one more item
    fireEvent(getAllByTestId('textinput')[0], 'onSubmitEditing')

    // check if the item is added
    const textInputs = getAllByTestId('textinput')
    expect(getAllByTestId('textinput').length).toBe(2)
    // trigger backspace on the new item
    fireEvent(textInputs[1], 'onKeyPress', { nativeEvent: { key: 'Backspace' } })
    // check if the element is deleted
    expect(getAllByTestId('textinput').length).toBe(1)
    expect(getAllByTestId('textinput')[0].props.value).toBe('Test')
  })

  it('Should not remove an item if there is only one', () => {
    const { getByTestId } = render(<App />)
    // trigger backspace in the TextInput
    fireEvent(getByTestId('textinput'), 'onKeyPress', { nativeEvent: { key: 'Backspace' } })
    // check if the TextInput is still there
    expect(getByTestId('textinput')).toBeTruthy()
  })
})
