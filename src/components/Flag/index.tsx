import flags from './flags';

interface PropsType {
  name: string;
  size?: number;
}

export default function Flag({ name, size = 0 }: PropsType) {
  return (
    <img
      src={(flags as any)[name]}
      alt={name}
      style={{ width: size ? `${size}px` : '16px' }}
    />
  );
}
