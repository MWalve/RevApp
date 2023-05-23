import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { WelcomePage } from '../components';

//lets externalize this function
const screens = {
    RevApp: {
        screen: WelcomePage
    }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);