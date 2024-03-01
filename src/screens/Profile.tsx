import { useState } from 'react';
import { TouchableOpacity } from 'react-native';
import { Center, ScrollView, VStack, Skeleton, Text, Heading, useToast } from 'native-base';
import * as ImagePick from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';

import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup'

import { Controller, useForm } from 'react-hook-form';

import { ScreenHeader } from '@components/ScreenHeader';
import { UserPhoto } from '@components/UserPhoto';
import { Input } from '@components/input';
import { Button } from '@components/Button';
import { useAuth } from '@hooks/useAuth';
import { api } from '@services/api';
import { AppError } from '@utils/AppError';




const PHOTO_SIZE = 33;

type FormDataProps = {
  name: string;
  email: string;
  password?: string | null | undefined;
  confirm_password?: string | null | undefined;
  old_password?: string | null;
}

const profileSchema = yup.object({
  name: yup.string().required('Informe o nome.'),
  email: yup.string().required('Informe o email.').email(),
  old_password: yup.string().nullable().transform((value) => !!value ? value : null),//.required('Informe a senha antiga.')
  password: yup.string().min(6, 'A senha deve ter pelo menos 6 dígitos.').nullable().transform((value) => !!value ? value : null),
  confirm_password: yup
    .string()
    .nullable()
    .transform((value) => !!value ? value : null)
    .oneOf([yup.ref('password'), ''], 'A confirmação de senha não confere.')
    .when('password', {
      is: (Field: any) => Field,
      then: (schema) =>
        schema
          .nullable()
          .required('Informe a confirmação da senha.')
          .transform((value) => !!value ? value : null)
    })
});

export function Profile() {

  const [isUpdating, setUpdating] = useState(false);



  const [photoIsLoading, setPhotoIsLoading] = useState(false);
  const [userPhoto, setUserPhoto] = useState('https://via.placeholder.com/150')

  const toast = useToast();
  const { user, updateUserProfile } = useAuth();

  const { control, handleSubmit, formState: { errors } } = useForm<FormDataProps>({
    defaultValues: {
      name: user.name,
      email: user.email
    },
    resolver: yupResolver<FormDataProps>(profileSchema)
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

  async function handleProfileUpdate(data: FormDataProps) {
    try {
      setUpdating(true);

      const userUpdated = user;
      userUpdated.name = data.name;

      await api.put('/users', data);
      
      await updateUserProfile(userUpdated);

      toast.show({
        title: "Perfil atualizado com sucesso!",
        placement: "top",
        bg: "green.500"
      })
    } catch (error) {

      const isAppError = error instanceof AppError
      const title = isAppError ? error.message : "Não foi possível atualizar os dados. Tente novamente mais tarde"

      toast.show({
        title,
        placement: "top",
        bg: "red.500"
      })
    } finally {
      setUpdating(false);
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
                errorMessage={errors.name?.message}
              />
            )}
          />

          <Controller
            control={control}
            name='email'
            render={({ field: { value, onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="E-mail"
                isDisabled
                isReadOnly
                onChangeText={onChange}
                value={value}

              />
            )}
          />


          <Heading color="gray.200" fontSize="md" mb={2} alignSelf="flex-start" mt={12} fontFamily="heading">
            Alterar senha
          </Heading>


          <Controller
            control={control}
            name='old_password'
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Senha antiga"
                secureTextEntry
                onChangeText={onChange}

              />
            )}
          />

          <Controller
            control={control}
            name='password'
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Nova senha"
                secureTextEntry
                onChangeText={onChange}
                errorMessage={errors.password?.message}

              />
            )}
          />


          <Controller
            control={control}
            name='confirm_password'
            render={({ field: { onChange } }) => (
              <Input
                bg="gray.600"
                placeholder="Confirme a nova senha"
                secureTextEntry
                errorMessage={errors.confirm_password?.message}

                onChangeText={onChange}

              />
            )}
          />



          <Button title="Atualizar" mt={4} onPress={handleSubmit(handleProfileUpdate)} isLoading={isUpdating}/>
        </Center>
      </ScrollView>
    </VStack>
  );
}