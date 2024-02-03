import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { Center, HStack, Text, VStack } from 'native-base'
import { useState } from 'react';


export function Home() {

    const [groupSelected, setGroupSelected] = useState('ombro')


    return (
        <VStack flex={1}>
            <HomeHeader />

            <HStack>
                <Group
                    name="costas"
                    isActive={groupSelected === "costa"}
                    onPress={()=> setGroupSelected("costa")}
                />
                <Group
                    name="ombro"
                    isActive={groupSelected === "ombro"}
                    onPress={()=> setGroupSelected("ombro")}
                />

            </HStack>
        </VStack>
    );
}