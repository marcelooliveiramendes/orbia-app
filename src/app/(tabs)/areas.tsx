import { router } from 'expo-router';
import { Pressable, ScrollView, Text, View } from 'react-native';

import { Icon, type IconName } from '@/components/Icon';
import { useAgendaService } from '@/services/agendaService';
import { getTotalBalanceCents, useFinanceService } from '@/services/financeService';
import { DAILY_WATER_GOAL_ML, getTodayWaterMl, useHealthService } from '@/services/healthService';
import { useShoppingService } from '@/services/shoppingService';
import { useWorkoutService } from '@/services/workoutService';
import { useTheme } from '@/theme/ThemeProvider';
import { spacing, typography } from '@/theme/tokens';
import { formatCentsToBRL } from '@/utils/money';

function isToday(iso: string) {
  return new Date(iso).toDateString() === new Date().toDateString();
}

export default function AreasScreen() {
  const { colors } = useTheme();
  const agendaItems = useAgendaService((s) => s.items);
  const accounts = useFinanceService((s) => s.accounts);
  const lists = useShoppingService((s) => s.lists);
  const waterEntries = useHealthService((s) => s.waterEntries);
  const sessions = useWorkoutService((s) => s.sessions);

  const todayAgendaCount = agendaItems.filter((i) => isToday(i.startsAt) && !i.done).length;
  const activeLists = lists.filter((l) => !l.archivedAt);
  const waterToday = getTodayWaterMl(waterEntries);
  const completedThisWeek = sessions.filter((s) => s.completedAt).length;

  const areas: { icon: IconName; nome: string; desc: string; v: string; vl: string; href: Parameters<typeof router.push>[0] }[] = [
    { icon: 'agenda', nome: 'Agenda', desc: 'Compromissos, tarefas e lembretes', v: String(todayAgendaCount), vl: 'hoje', href: '/agenda' },
    {
      icon: 'financas',
      nome: 'Finanças',
      desc: 'Saldo, gastos, receitas e contas',
      v: formatCentsToBRL(getTotalBalanceCents(accounts)),
      vl: `em ${accounts.length} contas`,
      href: '/financas',
    },
    {
      icon: 'saude',
      nome: 'Saúde e alimentação',
      desc: 'Refeições, água e metas simples',
      v: `${(waterToday / 1000).toFixed(2)} L`,
      vl: `de ${(DAILY_WATER_GOAL_ML / 1000).toFixed(1)} L`,
      href: '/saude',
    },
    {
      icon: 'treinos',
      nome: 'Treinos',
      desc: 'Semana de treinos e sessões',
      v: `${completedThisWeek} de ${sessions.length}`,
      vl: 'na semana',
      href: '/treinos',
    },
    {
      icon: 'compras',
      nome: 'Compras',
      desc: 'Listas, cupons e escaneamento',
      v: String(activeLists.length),
      vl: 'listas ativas',
      href: '/compras',
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingHorizontal: spacing.screenMargin, paddingTop: 56, paddingBottom: 124, gap: 24 }}>
        <View style={{ gap: 4 }}>
          <Text style={{ color: colors.ink, fontSize: typography.title.fontSize, fontFamily: 'Geist_600SemiBold' }}>
            Áreas
          </Text>
          <Text style={{ color: colors.muted, fontSize: typography.support.fontSize }}>
            Cinco partes da sua vida, cada uma no seu ritmo.
          </Text>
        </View>
        <View>
          {areas.map((a, i) => (
            <Pressable
              key={a.nome}
              onPress={() => router.push(a.href)}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 16,
                minHeight: 84,
                borderBottomWidth: i === areas.length - 1 ? 0 : 1,
                borderBottomColor: colors.line,
              }}
            >
              <Icon name={a.icon} size={26} color={colors.ink} />
              <View style={{ flex: 1, gap: 2 }}>
                <Text style={{ color: colors.ink, fontSize: 17, fontFamily: 'Geist_600SemiBold' }}>{a.nome}</Text>
                <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{a.desc}</Text>
              </View>
              <View style={{ alignItems: 'flex-end', gap: 2 }}>
                <Text style={{ color: colors.ink, fontSize: 15, fontFamily: 'Geist_500Medium', fontVariant: ['tabular-nums'] }}>
                  {a.v}
                </Text>
                <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>{a.vl}</Text>
              </View>
            </Pressable>
          ))}
        </View>
        <Text style={{ color: colors.muted, fontSize: typography.meta.fontSize }}>
          Para esconder uma área do Início, vá em Você › Módulos ativos. Nada é apagado.
        </Text>
      </ScrollView>
    </View>
  );
}
