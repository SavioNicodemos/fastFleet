const LICENSE_PLATE_REGEX = '[A-Z]{3}[0-9][0-9A-Z][0-9]{2}';

export function licensePlateValidate(licensePlate: string) {
  const plate = licensePlate.toUpperCase();
  const isValid = new RegExp(LICENSE_PLATE_REGEX).test(plate);

  return isValid;
}
