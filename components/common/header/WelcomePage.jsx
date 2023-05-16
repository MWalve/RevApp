import React from 'react'
import { View, Image } from 'react-native'

import styles from './screenheader.style'

const WelcomePage = ( {iconUrl} ) => {
  return (
    <View>
      <Image
        source={iconUrl}
      />

    </View>
  )
}

export default WelcomePage