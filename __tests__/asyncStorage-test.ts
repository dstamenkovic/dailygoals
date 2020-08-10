import { saveGoals, getGoals } from '../src/asyncStorage'

const goals = [{ id: 'randomString', text: '', checked: false }]

describe('AsyncStorage tests', () => {
  it('Should save goals', async () => {
    await saveGoals(goals)
    const savedGoals = await getGoals()

    expect(savedGoals!.length).toBe(1)
    expect(savedGoals![0].id).toBe('randomString')
  })
})
