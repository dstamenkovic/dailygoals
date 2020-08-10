import React, { FC, useState, useCallback, useEffect } from 'react'
import { StyleSheet, StatusBar, SafeAreaView, ScrollView, KeyboardAvoidingView } from 'react-native'
import isEqual from 'lodash/isEqual'

import { dark } from './colors'
import { IGoal } from './types'
import Goal from './Goal'
import { saveGoals, getGoals } from './asyncStorage'
import useDebounce from './useDebounce'

const createID = (): string => `${Math.random().toString(36).substring(7)}-${new Date().getTime()}`

const App: FC = () => {
  // state
  const [goals, setGoals] = useState<IGoal[]>([])
  const [focus, setFocus] = useState<number>(0)
  const [shouldFocus, setShouldFocus] = useState<boolean>(false)

  // actions

  const onChange = useCallback(
    <F extends Exclude<keyof IGoal, 'id'>, V extends IGoal[F]>(id: string, field: F, value: V): void => {
      setGoals((currentState) => {
        const index = currentState.findIndex((g) => g.id === id)
        const updateGoal = currentState[index]
        updateGoal[field] = value

        return [...currentState.slice(0, index), Object.assign({}, updateGoal), ...currentState.slice(index + 1)]
      })
    },
    []
  )

  const addItem = useCallback((id: string): void => {
    setGoals((currentState) => {
      const index = currentState.findIndex((g) => g.id === id)
      const newItem: IGoal = { id: createID(), text: '', checked: false }
      const newState = [...currentState]
      newState.splice(index + 1, 0, newItem)

      setFocus(index + 1)

      return newState
    })
    setShouldFocus(true)
  }, [])

  const removeItem = useCallback((id: string): void => {
    setGoals((currentState) => {
      if (currentState.length === 1) {
        return currentState
      }
      const index = currentState.findIndex((g) => g.id === id)
      const newState = [...currentState]
      newState.splice(index, 1)

      setFocus(index - 1)

      return newState
    })
    setShouldFocus(true)
  }, [])

  // effects

  useEffect(() => {
    const getGoalsFromStorage = async (): Promise<void> => {
      const goalsAsyncStorage = await getGoals()
      setGoals(goalsAsyncStorage || [{ id: createID(), text: '', checked: false }])
    }

    getGoalsFromStorage()
  }, [])

  const debouncedGoals = useDebounce(goals, 1500)

  useEffect(() => {
    const saveToLocalStorage = async (): Promise<void> => {
      const savedGoals = await getGoals()
      if (!isEqual(savedGoals, debouncedGoals)) {
        await saveGoals(debouncedGoals)
      }
    }
    if (debouncedGoals.length) {
      saveToLocalStorage()
    }
  }, [debouncedGoals])

  return (
    <>
      <StatusBar barStyle="light-content" />
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView style={styles.view} behavior="padding" enabled>
          <ScrollView>
            {goals.map((goal, index) => (
              <Goal
                key={goal.id}
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
