import { createStackNavigator } from 'react-navigation-stack';
import { createAppContainer } from 'react-navigation';
import WelcomePage from '../components/common/Pages/WelcomePage/WelcomePage';
import Dashboard from '../components/common/Pages/Dashboard/Dashboard';

//lets externalize this function
const screens = {
    RevApp: {
        screen: WelcomePage,
        navigationOptions: {
            headerShown: false,
        },
    },
    Dashboard: {
        screen: Dashboard
    }
}

const HomeStack = createStackNavigator(screens);

export default createAppContainer(HomeStack);