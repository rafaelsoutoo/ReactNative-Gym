import { VStack, Image, Text, Center, Heading } from 'native-base';

import BackgroundImg from '@assets/background.png'; //trocar 

import LogoPng from '@assets/logo.png';
import { Input } from '@components/input';
import { Button } from '@components/Button';

export function SignIn() {
    return (
        <VStack flex={1} bg="gray.700" px={10}>
            <Image
                source={BackgroundImg}
                alt="Pessoas treinando"
                resizeMode="contain"
                position="absolute"
            />

            <Center my={24}>
                <Image
                    source={LogoPng}
                    alt="Logo"
                    resizeMode="contain"
                />
                <Text color="gray.100" fontSize="sm">Treine sua mente e a seu corpo</Text>
            </Center>

            <Center>
                <Heading color="gray.100" fontSize="xl" mb={6} fontFamily="heading">
                    Acesse sua conta
                </Heading>

                <Input
                    placeholder='E-mail'
                    keyboardType="email-address"
                    autoCapitalize="none"
                />
                <Input
                    placeholder='Senha'
                    secureTextEntry
                />

                <Button title='Acessar'/>
            </Center>

                <Button title='Criar conta' variant="outline"/>
        </VStack>
    );
}