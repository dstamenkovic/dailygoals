import AsyncStorage from '@react-native-community/async-storage'

import { IGoal } from './types'

interface ILocalData {
  createDate: string
  goals: IGoal[]
}

const itemName: string = 'dg-list'

export const saveGoals = async (goals: IGoal[]): Promise<void | null> => {
  await AsyncStorage.clear()
  try {
    await AsyncStorage.setItem(
      itemName,
      JSON.stringify({
        createDate: new Date(),
        goals,
      })
    )
  } catch (error) {
    return null
  }
}

export const getGoals = async (): Promise<IGoal[] | null> => {
  try {
    const json = await AsyncStorage.getItem(itemName)
    const data: ILocalData = json !== null ? JSON.parse(json) : null
    if (data && data.createDate) {
      if (new Date(data.createDate).toDateString() < new Date().toDateString()) {
        await removeGoals()
        return null
      } else {
        return data.goals
      }
    }

    return null
  } catch (error) {
    throw null
  }
}

const removeGoals = async (): Promise<void> => {
  try {
    return await AsyncStorage.removeItem(itemName)
  } catch (error) {
    throw error
  }
}
