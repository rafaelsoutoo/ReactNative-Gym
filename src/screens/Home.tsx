import { ExerciseCarde } from '@components/ExerciseCard';
import { Group } from '@components/Group';
import { HomeHeader } from '@components/HomeHeader';
import { useNavigation } from '@react-navigation/native';
import { VStack, FlatList, HStack, Heading, Text } from 'native-base';
import { useState } from 'react';
import { AppNavigatorRoutesProps } from '@routes/app.routes';


export function Home() {

    const [group, setGroup] = useState(['costa', 'ombro', 'Tríceps', 'Biceps'])
    const [exercises, setExercises] = useState(['puxada frontal', 'Remada Cavalo', 'Ramada unilateral', 'Levantamento terra'])
    const [groupSelected, setGroupSelected] = useState('costa');


    const navigation= useNavigation<AppNavigatorRoutesProps>();

    function handleOpenExerciseDetails() {
        navigation.navigate('exercise');
    }

    return (
        <VStack flex={1}>
            <HomeHeader />

            <FlatList
                data={group}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <Group
                        name={item}
                        isActive={groupSelected.toLocaleUpperCase() === item.toLocaleUpperCase()}
                        onPress={() => setGroupSelected(item)}
                    />
                )}
                horizontal
                showsHorizontalScrollIndicator={false}
                _contentContainerStyle={{ px: 8 }}
                my={10}
                maxH={10}
                minH={10}
            />
            <VStack flex={1} px={8}>
                <HStack justifyContent="space-between" mb={5}>
                    <Heading color="gray.200" fontSize="md">
                        Exercícios
                    </Heading>
                    <Text color="gray.200" fontSize="sm">
                        {exercises.length}
                    </Text>
                </HStack>


                <FlatList
                    data={exercises}
                    keyExtractor={item => item}
                    renderItem={({ item }) => (
                        <ExerciseCarde
                            onPress={handleOpenExerciseDetails}
                        />
                    )}
                    showsVerticalScrollIndicator={false}
                    _contentContainerStyle={{ paddingBottom: 20 }}
                />

            </VStack>
        </VStack>
    );
}