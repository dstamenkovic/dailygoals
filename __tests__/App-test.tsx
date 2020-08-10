import 'react-native'
import React from 'react'
import App from '../src/App'

import { render, fireEvent, cleanup, waitFor, act } from 'react-native-testing-library'
import AsyncStorage from '@react-native-community/async-storage'

import { IGoal } from '../src/types'

interface ILocalData {
  createDate: string
  goals: IGoal[]
}

jest.setTimeout(15000)

describe('App Tests', () => {
  beforeEach(async () => {
    await AsyncStorage.clear()
  })
  afterEach(cleanup)

  it('Updates the text input', async () => {
    const { getByTestId } = render(<App />)

    await waitFor(() => getByTestId('textinput'))

    expect(AsyncStorage.getItem).toBeCalledWith('dg-list')

    const textInput = getByTestId('textinput')

    const newValue = 'Go for a run'

    fireEvent.changeText(textInput, newValue)
    expect(textInput.props.value).toBe(newValue)

    // check if saved to async-storage
    await waitFor(() => expect(AsyncStorage.setItem).toBeCalled())
    const savedJSON = await AsyncStorage.getItem('dg-list')
    const savedGoals: ILocalData = savedJSON ? JSON.parse(savedJSON) : null
    expect(savedGoals.goals[0].text).toBe(newValue)
  })

  it('Adds new item on submit', async () => {
    const { getAllByTestId } = render(<App />)

    await waitFor(() => getAllByTestId('textinput'))

    const textInputsCurrent = getAllByTestId('textinput')
    expect(textInputsCurrent.length).toBe(1)
    // submit TextInput
    await act(async () => {
      fireEvent(textInputsCurrent[0], 'onSubmitEditing')
      // wait until the save to async-storage is triggered
      await new Promise((resolve) => setTimeout(resolve, 2000))
    })
    // there should be 2 TextInput fields
    const textInputs = getAllByTestId('textinput')
    expect(textInputs.length).toBe(2)
    // check if saved to async-storage
    await waitFor(() => expect(AsyncStorage.setItem).toBeCalled())
    const savedJSON = await AsyncStorage.getItem('dg-list')
    const savedGoals: ILocalData = savedJSON ? JSON.parse(savedJSON) : null
    expect(savedGoals.goals.length).toBe(2)
  })

  it('Removes the item on "backspace" when empty', async () => {
    const { getAllByTestId } = render(<App />)

    await waitFor(() => getAllByTestId('textinput')[0])
    // add text to the first item/goal
    fireEvent.changeText(getAllByTestId('textinput')[0], 'Test')
    // add one more item
    fireEvent(getAllByTestId('textinput')[0], 'onSubmitEditing')

    // check if the item is added
    expect(getAllByTestId('textinput').length).toBe(2)
    // trigger backspace on the new item
    await act(async () => {
      fireEvent(getAllByTestId('textinput')[1], 'onKeyPress', { nativeEvent: { key: 'Backspace' } })
      // wait until the save to async-storage is triggered
      await new Promise((resolve) => setTimeout(resolve, 2000))
    })
    // check if the element is deleted
    expect(getAllByTestId('textinput').length).toBe(1)
    expect(getAllByTestId('textinput')[0].props.value).toBe('Test')

    // check if saved to async-storage
    await waitFor(() => expect(AsyncStorage.setItem).toBeCalled())
    const savedJSON = await AsyncStorage.getItem('dg-list')
    const savedGoals: ILocalData = savedJSON ? JSON.parse(savedJSON) : null
    expect(savedGoals.goals.length).toBe(1)
    expect(savedGoals.goals[0].text).toBe('Test')
  })

  it('Should not remove an item if there is only one', async () => {
    const { getByTestId } = render(<App />)
    await waitFor(() => getByTestId('textinput'))
    // trigger backspace in the TextInput
    fireEvent(getByTestId('textinput'), 'onKeyPress', { nativeEvent: { key: 'Backspace' } })
    // check if the TextInput is still there
    expect(getByTestId('textinput')).toBeTruthy()
  })
})
