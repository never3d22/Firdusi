import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity } from 'react-native';
import { trpc } from '@/api/trpc';

export default function SettingsScreen() {
  const settingsQuery = trpc.admin.settings.get.useQuery();
  const updateSettings = trpc.admin.settings.update.useMutation({ onSuccess: () => settingsQuery.refetch() });
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    if (settingsQuery.data) {
      setName(settingsQuery.data.name);
      setPhone(settingsQuery.data.phone ?? '');
      setAddress(settingsQuery.data.address ?? '');
      setIsOpen(settingsQuery.data.isOpen);
    }
  }, [settingsQuery.data]);

  const handleSave = () => {
    updateSettings.mutate({ name, phone, address, isOpen });
  };

  return (
    <View className="flex-1 bg-gray-50 p-6">
      <Text className="text-3xl font-bold mb-4">Настройки</Text>
      <TextInput className="border border-gray-200 rounded-xl p-3 mb-3" placeholder="Название ресторана" value={name} onChangeText={setName} />
      <TextInput className="border border-gray-200 rounded-xl p-3 mb-3" placeholder="Телефон" value={phone} onChangeText={setPhone} />
      <TextInput className="border border-gray-200 rounded-xl p-3 mb-3" placeholder="Адрес" value={address} onChangeText={setAddress} />
      <TouchableOpacity className={`rounded-xl py-3 mb-4 ${isOpen ? 'bg-green-500' : 'bg-gray-400'}`} onPress={() => setIsOpen(!isOpen)}>
        <Text className="text-center text-white">{isOpen ? 'Открыто' : 'Закрыто'}</Text>
      </TouchableOpacity>
      <TouchableOpacity className="bg-primary rounded-xl py-3" onPress={handleSave}>
        <Text className="text-center text-white">Сохранить</Text>
      </TouchableOpacity>
    </View>
  );
}
