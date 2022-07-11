interface PropsType {
  children: any;
}

export default function Section({ children }: PropsType) {
  return <div className="grid grid-cols-3 gap-x-4 gap-y-6">{children}</div>;
}
