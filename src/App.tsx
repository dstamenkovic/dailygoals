import React from 'react'
import { StyleSheet, StatusBar, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native'

import { dark } from './colors'
import { IGoal } from './types'
import Goal from './Goal'

const App: React.FC = () => {
  // state
  const [goals, setGoals] = React.useState<IGoal[]>([
    { id: `${Math.random().toString(36).substring(7)}`, text: '', checked: false },
  ])
  const [focus, setFocus] = React.useState<number>(0)
  const [shouldFocus, setShouldFocus] = React.useState<boolean>(false)

  // actions

  const onChange = React.useCallback(
    <F extends Exclude<keyof IGoal, 'id'>, V extends IGoal[F]>(index: number, field: F, value: V): void => {
      setGoals((currentState) => {
        const updateGoal = currentState[index]
        updateGoal[field] = value

        return [...currentState.slice(0, index), Object.assign({}, updateGoal), ...currentState.slice(index + 1)]
      })
    },
    []
  )

  const addItem = React.useCallback((index: number): void => {
    setGoals((currentState) => {
      const newItem: IGoal = { id: `${Math.random().toString(36).substring(7)}`, text: '', checked: false }
      const newState = [...currentState]
      newState.splice(index + 1, 0, newItem)
      return newState
    })
    setFocus(index + 1)
    setShouldFocus(true)
  }, [])

  const removeItem = React.useCallback((index: number): void => {
    setGoals((currentState) => {
      if (currentState.length === 1) {
        return currentState
      }
      const newState = [...currentState]
      newState.splice(index, 1)
      return newState
    })
    setFocus(index - 1)
    setShouldFocus(true)
  }, [])

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.view} behavior="padding" enabled>
          <ScrollView>
            {goals.map((goal, index) => (
              <Goal
                key={goal.id}
                index={index}
                goal={goal}
                onChange={onChange}
                addItem={addItem}
                removeItem={removeItem}
                focusComponent={shouldFocus && focus === index}
                setShouldFocus={setShouldFocus}
              />
            ))}
          </ScrollView>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </>
  )
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: dark,
    flex: 1,
  },
  view: {
    padding: 15,
    flex: 1,
  },
})

export default App
