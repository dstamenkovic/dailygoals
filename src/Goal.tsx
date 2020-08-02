import React from 'react'
import { View, TextInput, StyleSheet, NativeSyntheticEvent, TextInputKeyPressEventData } from 'react-native'
import CheckBox from '@react-native-community/checkbox'

import { primary, light } from './colors'
import { IGoal } from './types'

interface IProps {
  index: number
  goal: IGoal
  onChange: <F extends Exclude<keyof IGoal, 'id'>, V extends IGoal[F]>(index: number, field: F, value: V) => void
  addItem: (index: number) => void
  removeItem: (index: number) => void
  focusComponent: boolean
  setShouldFocus: (shouldFocus: boolean) => void
}

const Goal: React.SFC<IProps> = ({ index, goal, onChange, addItem, removeItem, focusComponent, setShouldFocus }) => {
  const inputRef = React.useRef<TextInput>(null)

  const onKeyPress = (event: NativeSyntheticEvent<TextInputKeyPressEventData>): void => {
    if (event.nativeEvent.key === 'Backspace' && !goal.text) {
      removeItem(index)
    }
  }

  React.useLayoutEffect(() => {
    if (focusComponent) {
      inputRef.current!.focus()
    }
  }, [focusComponent, setShouldFocus])

  return (
    <View style={styles.row}>
      <CheckBox
        testID="checkbox"
        value={goal.checked}
        onCheckColor={primary}
        onTintColor={light}
        onValueChange={(value: boolean) => onChange(index, 'checked', value)}
      />
      <TextInput
        testID="textinput"
        ref={inputRef}
        style={!goal.checked ? styles.text : { ...styles.text, ...{ color: primary } }}
        value={goal.text}
        onChangeText={(text) => onChange(index, 'text', text)}
        multiline
        scrollEnabled={false}
        blurOnSubmit
        onSubmitEditing={() => addItem(index)}
        onKeyPress={onKeyPress}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    margin: 7,
  },
  text: {
    color: light,
    paddingLeft: 10,
    fontSize: 21,
    alignSelf: 'center',
    flex: 1,
  },
})

export default React.memo(Goal)
