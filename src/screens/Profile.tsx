import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePick from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import { Control, Controller, useForm } from 'react-hook-form';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';



const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password: string;
  oldPassword: string;
  newPassword: string;
}

export function Profile() {



  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://via.placeholder.com/150')

  const toast = useToast();
  const { user } = useAuth();

  const { control } = useForm({
    defaultValues: {
      name: user.name,
      email: user.email
    }
  });

  async function handleUserPhotoSelect() {
    setPhotoIsLoading(true);
    try {


      const photoSelected = await ImagePick.launchImageLibraryAsync({
        mediaTypes: ImagePick.MediaTypeOptions.Images,
        quality: 1,
        aspect: [4, 4],
        allowsEditing: true,
      });

      if (photoSelected.canceled) {
        return;
      }

      if (photoSelected.assets[0].uri) {
        const photoInfo = await FileSystem.getInfoAsync(
          photoSelected.assets[0].uri,
          { size: true },
        );

        if (photoInfo.exists && (photoInfo.size / 1024 / 1024) > 3) {
          return toast.show({
            title: 'A imagem deve ter no máximo 3MB',
            placement: 'top',
            duration: 3000,
            bgColor: 'red.500',
          });
        }


        setUserPhoto(photoSelected.assets[0].uri);
      }

    } catch (error) {
      console.log(error);
    } finally {
      setPhotoIsLoading(false)
    }
  }


  return (
    <VStack flex={1}>
      <ScreenHeader title='Perfil' />

      <ScrollView contentContainerStyle={{ paddingBottom: 36 }} showsVerticalScrollIndicator={false}>
        <Center mt={6} px={10}>
          {
            photoIsLoading ?
              <Skeleton
                w={PHOTO_SIZE}
                h={PHOTO_SIZE}
                rounded="full"
                startColor="gray.500"
                endColor="gray.400"
              />
              :
              <UserPhoto
                source={{ uri: userPhoto }}
                alt="Foto do usuário"
                size={PHOTO_SIZE}
              />
          }

          <TouchableOpacity onPress={handleUserPhotoSelect}>
            <Text color="green.500" fontWeight="bold" fontSize="md" mt={2} mb={8}>
              Alterar Foto
            </Text>
          </TouchableOpacity>

          <Controller
            control={control}
            name='name'
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder='Nome'
                onChangeText={onChange}
                value={value}
              />
            )}
          />

          <Controller
            control={control}
            name='email'
            render={({ field: { value, onChange } }) => (
              <Input
                isDisabled
                bg="gray.600"
                placeholder="E-mail"
                onChangeText={onChange}
                value={value}
              />
            )}
          />


          <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
            Alterar senha
          </Heading>


          <Input
            bg="gray.600"
            placeholder="Senha antiga"
            secureTextEntry

          />



          <Input
            bg="gray.600"
            placeholder="Nova senha"
            secureTextEntry

          />


          <Input
            bg="gray.600"
            placeholder="Confirme a nova senha"
            secureTextEntry

          />



          <Button title="Atualizar" mt={4} />
        </Center>
      </ScrollView>
    </VStack>
  );
}