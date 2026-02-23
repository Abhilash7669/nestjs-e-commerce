export function buildSort(_value: string[] | string) {
  const query = {};
  if (Array.isArray(_value)) {
    _value.forEach((v) => {
      const [key, value] = splitKeyValue(v);
      query[key] = value === 'dsc' ? -1 : 1;
    });
  } else {
    const [key, value] = splitKeyValue(_value);
    query[key] = value === 'dsc' ? -1 : 1;
  }
  return query;
}

function splitKeyValue(_value: string) {
  const splitValues = _value.split('-');
  const key = splitValues[0];
  const value = splitValues[1];
  return [key, value];
}
