import { Circle, Path, Rect, Svg } from 'react-native-svg';

// Grid 24, traço 1.5 — paths copiados de prototipo/Icon.dc.html.
export type IconName =
  | 'home' | 'areas' | 'atividade' | 'plus' | 'minus' | 'agenda' | 'financas'
  | 'saude' | 'treinos' | 'compras' | 'mic' | 'micoff' | 'send' | 'sparkle'
  | 'close' | 'check' | 'chevron' | 'back' | 'down' | 'camera' | 'image'
  | 'receipt' | 'listpen' | 'edit' | 'trash' | 'eye' | 'eyeoff' | 'wifioff'
  | 'alert' | 'info' | 'clock' | 'bell' | 'lock' | 'shield' | 'download'
  | 'user' | 'sun' | 'moon' | 'device' | 'drop' | 'pause' | 'play' | 'stop'
  | 'refresh' | 'income' | 'expense' | 'dots' | 'link' | 'crop' | 'qr'
  | 'backspace' | 'star' | 'repeat' | 'keyboard';

type IconProps = {
  name: IconName;
  size?: number;
  color?: string;
  strokeWidth?: number;
};

export function Icon({ name, size = 24, color = 'currentColor', strokeWidth = 1.5 }: IconProps) {
  const strokeProps = {
    fill: 'none' as const,
    stroke: color,
    strokeWidth,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
  };

  return (
    <Svg width={size} height={size} viewBox="0 0 24 24">
      {renderPaths(name, strokeProps, color)}
    </Svg>
  );
}

function renderPaths(
  name: IconName,
  strokeProps: { fill: 'none'; stroke: string; strokeWidth: number; strokeLinecap: 'round'; strokeLinejoin: 'round' },
  color: string,
) {
  switch (name) {
    case 'home':
      return <Path d="M4 10.5 12 4l8 6.5V19a1 1 0 0 1-1 1h-4.5v-5.5h-5V20H5a1 1 0 0 1-1-1z" {...strokeProps} />;
    case 'areas':
      return (
        <>
          <Rect x={4} y={4} width={6.5} height={6.5} rx={1.6} {...strokeProps} />
          <Rect x={13.5} y={4} width={6.5} height={6.5} rx={1.6} {...strokeProps} />
          <Rect x={4} y={13.5} width={6.5} height={6.5} rx={1.6} {...strokeProps} />
          <Circle cx={16.75} cy={16.75} r={3.25} {...strokeProps} />
        </>
      );
    case 'atividade':
      return <Path d="M3 12h4l2.5-6 5 12 2.5-6h4" {...strokeProps} />;
    case 'plus':
      return <Path d="M12 5v14M5 12h14" {...strokeProps} />;
    case 'minus':
      return <Path d="M5 12h14" {...strokeProps} />;
    case 'agenda':
      return (
        <>
          <Rect x={3.5} y={5} width={17} height={15} rx={2.5} {...strokeProps} />
          <Path d="M3.5 10h17M8 3v4M16 3v4" {...strokeProps} />
        </>
      );
    case 'financas':
      return (
        <>
          <Path d="M4 7.5A2.5 2.5 0 0 1 6.5 5H17v3" {...strokeProps} />
          <Rect x={4} y={8} width={16.5} height={11.5} rx={2.5} {...strokeProps} />
          <Path d="M16 13.75h1.5" {...strokeProps} />
        </>
      );
    case 'saude':
      return (
        <>
          <Path d="M12 7.6c-1.2-1.2-3-1.6-4.6-1-2.2.8-3.1 3.3-2.6 6.1.6 3.4 2.8 6.8 5.2 6.8.9 0 1.3-.5 2-.5s1.1.5 2 .5c2.4 0 4.6-3.4 5.2-6.8.5-2.8-.4-5.3-2.6-6.1-1.6-.6-3.4-.2-4.6 1z" {...strokeProps} />
          <Path d="M12 7.6c0-2 1-3.6 3-4.1" {...strokeProps} />
        </>
      );
    case 'treinos':
      return <Path d="M6.5 7.5v9M17.5 7.5v9M3.5 10v4M20.5 10v4M6.5 12h11" {...strokeProps} />;
    case 'compras':
      return (
        <>
          <Path d="M5 8h14l-1 11.5a1.5 1.5 0 0 1-1.5 1.5h-9A1.5 1.5 0 0 1 6 19.5z" {...strokeProps} />
          <Path d="M9 8V6.5a3 3 0 0 1 6 0V8" {...strokeProps} />
        </>
      );
    case 'mic':
      return (
        <>
          <Rect x={9} y={3.5} width={6} height={11} rx={3} {...strokeProps} />
          <Path d="M5.5 11.5a6.5 6.5 0 0 0 13 0M12 18v2.5" {...strokeProps} />
        </>
      );
    case 'micoff':
      return (
        <Path
          d="M4 4l16 16M9 9v2.5a3 3 0 0 0 5.1 2.1M15 10V6.5a3 3 0 0 0-5.7-1.3M5.5 11.5a6.5 6.5 0 0 0 10.4 5.2M18.3 13.4a6.5 6.5 0 0 0 .2-1.9M12 18v2.5"
          {...strokeProps}
        />
      );
    case 'send':
      return <Path d="M12 19V5M6 11l6-6 6 6" {...strokeProps} />;
    case 'sparkle':
      return (
        <>
          <Path d="M11 4c.6 3.9 2.6 5.9 6.5 6.5-3.9.6-5.9 2.6-6.5 6.5-.6-3.9-2.6-5.9-6.5-6.5C8.4 9.9 10.4 7.9 11 4z" {...strokeProps} />
          <Path d="M18.5 15.5c.3 1.6 1 2.3 2.5 2.5-1.5.3-2.2 1-2.5 2.5-.3-1.5-1-2.2-2.5-2.5 1.5-.2 2.2-.9 2.5-2.5z" {...strokeProps} />
        </>
      );
    case 'close':
      return <Path d="M6 6l12 12M18 6 6 18" {...strokeProps} />;
    case 'check':
      return <Path d="M5 12.5l4.5 4.5L19 7.5" {...strokeProps} />;
    case 'chevron':
      return <Path d="M9.5 6l6 6-6 6" {...strokeProps} />;
    case 'back':
      return <Path d="M14.5 6l-6 6 6 6" {...strokeProps} />;
    case 'down':
      return <Path d="M6 9.5l6 6 6-6" {...strokeProps} />;
    case 'camera':
      return (
        <>
          <Path d="M4 8.5A1.5 1.5 0 0 1 5.5 7h2.3l1.5-2h5.4l1.5 2h2.3A1.5 1.5 0 0 1 20 8.5v9a1.5 1.5 0 0 1-1.5 1.5h-13A1.5 1.5 0 0 1 4 17.5z" {...strokeProps} />
          <Circle cx={12} cy={12.5} r={3.5} {...strokeProps} />
        </>
      );
    case 'image':
      return (
        <>
          <Rect x={4} y={5} width={16} height={14} rx={2} {...strokeProps} />
          <Circle cx={9} cy={10} r={1.5} {...strokeProps} />
          <Path d="M4.5 17l5-5 4 4 2.5-2.5 3.5 3.5" {...strokeProps} />
        </>
      );
    case 'receipt':
      return (
        <>
          <Path d="M6 3.5h12v17l-2-1.3-2 1.3-2-1.3-2 1.3-2-1.3-2 1.3z" {...strokeProps} />
          <Path d="M9 8h6M9 11.5h6M9 15h3.5" {...strokeProps} />
        </>
      );
    case 'listpen':
      return (
        <>
          <Path d="M4.5 6h9M4.5 11h9M4.5 16h5" {...strokeProps} />
          <Path d="M14 19.5l.6-2.4 4.6-4.6a1.4 1.4 0 0 1 2 2l-4.6 4.6z" {...strokeProps} />
        </>
      );
    case 'edit':
      return (
        <>
          <Path d="M4.5 19.5l1-4L16 5a2.1 2.1 0 0 1 3 3L8.5 18.5z" {...strokeProps} />
          <Path d="M14 7l3 3" {...strokeProps} />
        </>
      );
    case 'trash':
      return <Path d="M4.5 7h15M10 7V5h4v2M6.5 7l1 12.5h9l1-12.5" {...strokeProps} />;
    case 'eye':
      return (
        <>
          <Path d="M2.5 12S6 5.5 12 5.5 21.5 12 21.5 12 18 18.5 12 18.5 2.5 12 2.5 12z" {...strokeProps} />
          <Circle cx={12} cy={12} r={3} {...strokeProps} />
        </>
      );
    case 'eyeoff':
      return (
        <>
          <Path d="M4 4l16 16M10.6 6.1A9.5 9.5 0 0 1 12 6c6 0 9.5 6 9.5 6a16 16 0 0 1-2.6 3.3M6.6 7.6C4 9.3 2.5 12 2.5 12s3.5 6 9.5 6a9 9 0 0 0 4.3-1.1" {...strokeProps} />
          <Path d="M9.9 10a3 3 0 0 0 4.1 4.1" {...strokeProps} />
        </>
      );
    case 'wifioff':
      return (
        <Path
          d="M4 4l16 16M8.5 16.5a5 5 0 0 1 7 0M5 13a10 10 0 0 1 5-2.7M14.5 10.5A10 10 0 0 1 19 13M2 9.5a14.5 14.5 0 0 1 4.6-2.8M10.5 5.6A14.5 14.5 0 0 1 22 9.5M12 20h.01"
          {...strokeProps}
        />
      );
    case 'alert':
      return (
        <>
          <Path d="M12 4 21 19.5H3z" {...strokeProps} />
          <Path d="M12 10v4.5M12 17v.01" {...strokeProps} />
        </>
      );
    case 'info':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...strokeProps} />
          <Path d="M12 11v5M12 8v.01" {...strokeProps} />
        </>
      );
    case 'clock':
      return (
        <>
          <Circle cx={12} cy={12} r={8.5} {...strokeProps} />
          <Path d="M12 7.5V12l3 2" {...strokeProps} />
        </>
      );
    case 'bell':
      return (
        <>
          <Path d="M6 16.5V11a6 6 0 0 1 12 0v5.5l1.5 1.5h-15z" {...strokeProps} />
          <Path d="M10 20.5a2 2 0 0 0 4 0" {...strokeProps} />
        </>
      );
    case 'lock':
      return (
        <>
          <Rect x={5} y={10.5} width={14} height={10} rx={2} {...strokeProps} />
          <Path d="M8.5 10.5V8a3.5 3.5 0 0 1 7 0v2.5" {...strokeProps} />
        </>
      );
    case 'shield':
      return <Path d="M12 3.5 19 6v5.5c0 4.4-3 7.7-7 9-4-1.3-7-4.6-7-9V6z" {...strokeProps} />;
    case 'download':
      return <Path d="M12 4v11M7 10.5l5 5 5-5M5 19.5h14" {...strokeProps} />;
    case 'user':
      return (
        <>
          <Circle cx={12} cy={8.5} r={3.5} {...strokeProps} />
          <Path d="M5 20c.8-3.5 3.6-5.5 7-5.5s6.2 2 7 5.5" {...strokeProps} />
        </>
      );
    case 'sun':
      return (
        <>
          <Circle cx={12} cy={12} r={4} {...strokeProps} />
          <Path d="M12 2.5v2M12 19.5v2M2.5 12h2M19.5 12h2M5.3 5.3l1.4 1.4M17.3 17.3l1.4 1.4M5.3 18.7l1.4-1.4M17.3 6.7l1.4-1.4" {...strokeProps} />
        </>
      );
    case 'moon':
      return <Path d="M19.5 14.5A7.5 7.5 0 0 1 9.5 4.5a7.5 7.5 0 1 0 10 10z" {...strokeProps} />;
    case 'device':
      return (
        <>
          <Rect x={7} y={3} width={10} height={18} rx={2.5} {...strokeProps} />
          <Path d="M11 18h2" {...strokeProps} />
        </>
      );
    case 'drop':
      return <Path d="M12 3.5s6 6.4 6 10.5a6 6 0 0 1-12 0c0-4.1 6-10.5 6-10.5z" {...strokeProps} />;
    case 'pause':
      return <Path d="M9 6v12M15 6v12" {...strokeProps} />;
    case 'play':
      return <Path d="M8 5.5v13l10-6.5z" {...strokeProps} />;
    case 'stop':
      return <Rect x={6.5} y={6.5} width={11} height={11} rx={2} {...strokeProps} />;
    case 'refresh':
      return <Path d="M19.5 12a7.5 7.5 0 1 1-2.2-5.3M19.5 4.5v4h-4" {...strokeProps} />;
    case 'income':
      return <Path d="M17 7 7 17M7 9v8h8" {...strokeProps} />;
    case 'expense':
      return <Path d="M7 17 17 7M9 7h8v8" {...strokeProps} />;
    case 'dots':
      return (
        <>
          <Circle cx={6} cy={12} r={1.5} fill={color} stroke="none" />
          <Circle cx={12} cy={12} r={1.5} fill={color} stroke="none" />
          <Circle cx={18} cy={12} r={1.5} fill={color} stroke="none" />
        </>
      );
    case 'link':
      return <Path d="M10 14a4 4 0 0 0 5.7 0l3-3a4 4 0 0 0-5.7-5.7l-1 1M14 10a4 4 0 0 0-5.7 0l-3 3a4 4 0 0 0 5.7 5.7l1-1" {...strokeProps} />;
    case 'crop':
      return <Path d="M6 3v14a1 1 0 0 0 1 1h14M3 6h14a1 1 0 0 1 1 1v14" {...strokeProps} />;
    case 'qr':
      return (
        <>
          <Rect x={4} y={4} width={6} height={6} rx={1} {...strokeProps} />
          <Rect x={14} y={4} width={6} height={6} rx={1} {...strokeProps} />
          <Rect x={4} y={14} width={6} height={6} rx={1} {...strokeProps} />
          <Path d="M14 14h2v2M18 18h2v2M14 19h2M19 14h1" {...strokeProps} />
        </>
      );
    case 'backspace':
      return (
        <>
          <Path d="M9 5.5h10.5A1.5 1.5 0 0 1 21 7v10a1.5 1.5 0 0 1-1.5 1.5H9L3 12z" {...strokeProps} />
          <Path d="M12 9.5l5 5M17 9.5l-5 5" {...strokeProps} />
        </>
      );
    case 'star':
      return <Path d="M12 4l2.4 5 5.4.6-4 3.7 1.1 5.4L12 16l-4.9 2.7 1.1-5.4-4-3.7 5.4-.6z" {...strokeProps} />;
    case 'repeat':
      return <Path d="M4 11V9.5A2.5 2.5 0 0 1 6.5 7H19l-3-3M20 13v1.5a2.5 2.5 0 0 1-2.5 2.5H5l3 3" {...strokeProps} />;
    case 'keyboard':
      return (
        <>
          <Rect x={3} y={6} width={18} height={12} rx={2} {...strokeProps} />
          <Path d="M7 10h.01M11 10h.01M15 10h.01M7 14h10" {...strokeProps} />
        </>
      );
    default:
      return null;
  }
}
