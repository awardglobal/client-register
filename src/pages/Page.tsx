interface PropsType {
  children: any;
}

export default function Page({ children }: PropsType) {
  return <div>{children}</div>;
}
