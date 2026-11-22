import { Pressable, Text, View } from 'react-native';

import { useTheme } from '@/theme/ThemeProvider';
import { minTouchTarget, typography } from '@/theme/tokens';
import { Icon, type IconName } from './Icon';

type ListItemProps = {
  title: string;
  subtitle?: string;
  trailing?: string;
  trailingColor?: string;
  icon?: IconName;
  onPress?: () => void;
  showChevron?: boolean;
};

export function ListItem({
  title,
  subtitle,
  trailing,
  trailingColor,
  icon,
  onPress,
  showChevron,
}: ListItemProps) {
  const { colors } = useTheme();

  const content = (
    <View
      style={{
        minHeight: minTouchTarget + 8,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 10,
      }}
    >
      {icon ? (
        <View
          style={{
            width: 36,
            height: 36,
            borderRadius: 10,
            backgroundColor: colors.tile,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon name={icon} size={20} color={colors.ink} />
        </View>
      ) : null}
      <View style={{ flex: 1, gap: 2 }}>
        <Text
          style={{ color: colors.ink, fontSize: typography.body.fontSize, fontFamily: 'Geist_500Medium' }}
          numberOfLines={1}
        >
          {title}
        </Text>
        {subtitle ? (
          <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }} numberOfLines={1}>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {trailing ? (
        <Text
          style={{
            color: trailingColor ?? colors.ink,
            fontSize: typography.body.fontSize,
            fontFamily: 'Geist_600SemiBold',
            fontVariant: ['tabular-nums'],
          }}
        >
          {trailing}
        </Text>
      ) : null}
      {showChevron ? <Icon name="chevron" size={18} color={colors.muted} /> : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      {content}
    </Pressable>
  );
}
