import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native';
import { trpc } from '@/api/trpc';
import { useAuth } from '@/hooks/useAuth';

export default function LoginScreen() {
  const auth = useAuth();
  const [mode, setMode] = useState<'customer' | 'admin'>('customer');
  const [phone, setPhone] = useState('+7');
  const [code, setCode] = useState('');
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('1234');
  const [step, setStep] = useState<'phone' | 'code'>('phone');
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const sendCode = trpc.public.sendSmsCode.useMutation();
  const verifyCode = trpc.public.verifySmsCode.useMutation();
  const adminLogin = trpc.admin.login.useMutation();

  React.useEffect(() => {
    let interval: NodeJS.Timeout | undefined;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => (prev > 0 ? prev - 1 : 0)), 1000);
    }
    return () => interval && clearInterval(interval);
  }, [timer]);

  const handleSendCode = async () => {
    try {
      await sendCode.mutateAsync({ phone });
      setStep('code');
      setTimer(60);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка отправки кода');
    }
  };

  const handleVerify = async () => {
    try {
      const result = await verifyCode.mutateAsync({ phone, code });
      await auth.signIn({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка подтверждения');
    }
  };

  const handleAdminLogin = async () => {
    try {
      const result = await adminLogin.mutateAsync({ username, password });
      await auth.signIn({
        user: result.user,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken
      });
      if (result.mustChangePassword) {
        setError('Измените пароль администратора в настройках безопасности.');
      } else {
        setError(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Ошибка входа');
    }
  };

  return (
    <View className="flex-1 justify-center px-6 bg-white">
      <Text className="text-3xl font-bold mb-8 text-primary">Codex</Text>
      <View className="flex-row bg-gray-100 rounded-2xl p-1 mb-6">
        <TouchableOpacity className={`flex-1 py-3 rounded-2xl ${mode === 'customer' ? 'bg-white' : ''}`} onPress={() => setMode('customer')}>
          <Text className={`text-center font-semibold ${mode === 'customer' ? 'text-primary' : 'text-gray-500'}`}>Клиент</Text>
        </TouchableOpacity>
        <TouchableOpacity className={`flex-1 py-3 rounded-2xl ${mode === 'admin' ? 'bg-white' : ''}`} onPress={() => setMode('admin')}>
          <Text className={`text-center font-semibold ${mode === 'admin' ? 'text-primary' : 'text-gray-500'}`}>Администратор</Text>
        </TouchableOpacity>
      </View>

      {mode === 'customer' ? (
        step === 'phone' ? (
          <View>
            <Text className="text-base mb-2">Введите номер телефона</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-4 mb-4"
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
              placeholder="+79991234567"
            />
            <TouchableOpacity className="bg-primary rounded-xl p-4" onPress={handleSendCode} disabled={sendCode.isPending}>
              {sendCode.isPending ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center">Получить код</Text>}
            </TouchableOpacity>
          </View>
        ) : (
          <View>
            <Text className="text-base mb-2">Введите код из SMS</Text>
            <TextInput
              className="border border-gray-200 rounded-xl p-4 mb-4"
              keyboardType="number-pad"
              value={code}
              onChangeText={setCode}
              placeholder="000000"
              maxLength={6}
            />
            <TouchableOpacity className="bg-primary rounded-xl p-4 mb-4" onPress={handleVerify} disabled={verifyCode.isPending}>
              {verifyCode.isPending ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center">Подтвердить</Text>}
            </TouchableOpacity>
            <TouchableOpacity disabled={timer > 0} onPress={handleSendCode}>
              <Text className="text-center text-primary">
                {timer > 0 ? `Отправить код повторно через ${timer} сек.` : 'Отправить код повторно'}
              </Text>
            </TouchableOpacity>
          </View>
        )
      ) : (
        <View>
          <Text className="text-base mb-2">Логин администратора</Text>
          <TextInput className="border border-gray-200 rounded-xl p-4 mb-4" value={username} onChangeText={setUsername} />
          <Text className="text-base mb-2">Пароль</Text>
          <TextInput className="border border-gray-200 rounded-xl p-4 mb-4" secureTextEntry value={password} onChangeText={setPassword} />
          <TouchableOpacity className="bg-primary rounded-xl p-4" onPress={handleAdminLogin} disabled={adminLogin.isPending}>
            {adminLogin.isPending ? <ActivityIndicator color="#fff" /> : <Text className="text-white text-center">Войти</Text>}
          </TouchableOpacity>
        </View>
      )}

      {error && <Text className="text-red-500 mt-4 text-center">{error}</Text>}
    </View>
  );
}
