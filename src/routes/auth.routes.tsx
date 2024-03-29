import { createNativeStackNavigator, NativeStackNavigationProp} from '@react-navigation/native-stack'

import { SignIn } from '@screens/Singin';
import { SignUp } from '@screens/SignUp';

type AuthRoutes = {
    signIn: undefined;
    signUn: undefined;
}

export type AuthNavigatorRoutesProps = NativeStackNavigationProp<AuthRoutes>;

const { Navigator, Screen } = createNativeStackNavigator<AuthRoutes>();

export function AuthRoutes() {
    return (
        <Navigator screenOptions={{headerShown: false}}>
            <Screen
                name="signIn"
                component={SignIn}
            />
            <Screen
                name="signUn"
                component={SignUp}
            />
        </Navigator>
    );
}