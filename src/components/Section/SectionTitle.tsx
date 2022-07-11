import React from 'react';
import classnames from 'classnames';

interface PropsType {
  children: string;
  isTop?: boolean;
}

export default function SectionTitle({ children, isTop = false }: PropsType) {
  return (
    <div
      className={classnames(
        'text-lg font-black mb-4 border-b-blue-600 border-b-4  w-40 pb-2 ',
        {
          'mt-4': !isTop,
        }
      )}
    >
      {children}
    </div>
  );
}
