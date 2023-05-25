import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import { WelcomePage, Dashboard } from '../components';

//lets externalize this function
const screens = {
    RevApp: {
        screen: WelcomePage
    },
    Dashboard: {
        screen: Dashboard
    }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);