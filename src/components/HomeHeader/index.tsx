import { Power } from 'phosphor-react-native';
import { Container, Greeting, Message, Name, Picture } from './styles';
import { TouchableOpacity } from 'react-native';
import theme from '../../theme';

export function HomeHeader() {
  return (
    <Container>
      <Picture
        source={{ uri: 'https://github.com/savionicodemos.png' }}
        placeholder="L184i9kCbIof00ayjZay~qj[ayj@"
      />
      <Greeting>
        <Message>
          Hello,
        </Message>
        <Name>
          Nicodemos
        </Name>
      </Greeting>
      <TouchableOpacity>
        <Power size={32} color={theme.COLORS.GRAY_400} />
      </TouchableOpacity>
    </Container>
  )
};
