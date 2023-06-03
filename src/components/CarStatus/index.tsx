import { useTheme } from 'styled-components';
import { TouchableOpacityProps } from 'react-native';
import { Container, IconBox, Message, TextHighlight } from './styles';
import { Key, Car } from 'phosphor-react-native'

type Props = TouchableOpacityProps & {
  licensePlate?: string;
}

export function CarStatus({ licensePlate, ...rest }: Props) {
  const theme = useTheme();

  const Icon = licensePlate ? Car : Key;
  const message = licensePlate ? `Vehicle ${licensePlate} in use. ` : 'No vehicle in use. ';
  const status = licensePlate ? 'arrival' : 'departure';

  return (
    <Container {...rest}>
      <IconBox>
        <Icon size={32} color={theme.COLORS.BRAND_LIGHT} />
      </IconBox>

      <Message>{message}

        <TextHighlight>
          Press here to register the {status}.
        </TextHighlight>
      </Message>
    </Container>
  )
};
