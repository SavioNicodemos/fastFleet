import { Button } from '../../components/Button';
import { Header } from '../../components/Header';
import { LicensePlateInput } from '../../components/LicensePlateInput';
import { TextAreaInput } from '../../components/TextAreaInput';
import { Container, Content } from './styles';

export function Departure() {
  return (
    <Container>
      <Header title='Departure' />

      <Content>
        <LicensePlateInput
          label='License Plate'
          placeholder='ABC-1234'
        />

        <TextAreaInput
          label='Purpose'
          placeholder='I will use the vehicle for...'
        />

        <Button
          title='Register Departure'
        />
      </Content>
    </Container>
  )
};
