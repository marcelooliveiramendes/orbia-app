import { View } from 'react-native';

import { Chip } from './Chip';

export function ChipGroup<T extends string>({
  options,
  value,
  onChange,
}: {
  options: T[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
      {options.map((opt) => (
        <Chip key={opt} label={opt} selected={opt === value} onPress={() => onChange(opt)} />
      ))}
    </View>
  );
}
