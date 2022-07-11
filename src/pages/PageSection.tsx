interface PropsType {
  children: any;
}

export default function PageSection({ children }: PropsType) {
  return (
    <div className="grid lg:grid-cols-3 md:grid-cols-2 sm:grid-cols-1 gap-x-8 gap-y-6">
      {children}
    </div>
  );
}
