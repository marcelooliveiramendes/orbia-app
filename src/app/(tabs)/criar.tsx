import { Redirect } from 'expo-router';

// Tab interceptada em _layout.tsx (abre /criar-rapido como modal).
// Esta tela só existe pra satisfazer a rota e cobrir acesso direto por deep link.
export default function CriarTabFallback() {
  return <Redirect href="/criar-rapido" />;
}
