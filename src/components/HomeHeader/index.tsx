import { Power } from 'phosphor-react-native';
import { Container, Greeting, Message, Name, Picture } from './styles';
import { TouchableOpacity } from 'react-native';
import { useUser, useApp } from '@realm/react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import theme from '../../theme';

export function HomeHeader() {
  const user = useUser();
  const app = useApp();
  const insets = useSafeAreaInsets();

  const top = insets.top + 32;

  const handleLogout = async () => {
    await app.currentUser?.logOut();
  };

  return (
    <Container style={{ paddingTop: top }}>
      <Picture
        source={{ uri: user?.profile.pictureUrl }}
        placeholder="L184i9kCbIof00ayjZay~qj[ayj@"
      />
      <Greeting>
        <Message>
          Hello,
        </Message>
        <Name>
          {user?.profile.name}
        </Name>
      </Greeting>
      <TouchableOpacity activeOpacity={0.7} onPress={handleLogout}>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  )
};
