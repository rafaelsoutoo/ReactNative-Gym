import { HistoryCard } from '@components/HistoryCard';
import { ScreenHeader } from '@components/ScreenHeader';
import { Heading, VStack, SectionList, Text } from 'native-base'
import { useState } from 'react';


export function History() {

    const [exercises, setExercises] = useState([
        {
            title: "26.08.22",
            data: ["Puxado Fronto", "Remada unilateral"]
        },
        {
            title: "27.08.22",
            data: ["Puxado Fronto"]
        }
    ]);

    return (
        <VStack flex={1}>
            <ScreenHeader title="Histórico de exercícios" />

            <SectionList
                sections={exercises}
                keyExtractor={item => item}
                renderItem={({ item }) => (
                    <HistoryCard />
                )}
                renderSectionHeader={({ section }) => (
                    <Heading color="gray.200" fontSize="md" mt={10} mb={3} fontFamily="heading">
                        {section.title}
                    </Heading>
                )}
                px={8}
                contentContainerStyle={exercises.length === 0 && { flex:1, justifyContent: 'center'}}
                ListEmptyComponent={()=> (
                    <Text color="gray.100" textAlign="center" >
                        Não exercícios reistrados ainda. {'\n'}
                        Vamos fazer exercicisios hoje?
                    </Text>
                )}
                showsVerticalScrollIndicator={false}
            />




        </VStack>
    );
}