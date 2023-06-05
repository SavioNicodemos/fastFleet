import { TextInputProps } from 'react-native';
import { Container, Input, Label } from './styles';
import { useTheme } from 'styled-components';

type Props = TextInputProps & {
  label: string;
}

export const TextAreaInput = ({ label, ...rest }: Props) => {
  const { COLORS } = useTheme();
  return (
    <Container>
      <Label>
        {label}
      </Label>

      <Input
        placeholderTextColor={COLORS.GRAY_400}
        multiline
        autoCapitalize='sentences'
        {...rest}
      />
    </Container>
  )
};
