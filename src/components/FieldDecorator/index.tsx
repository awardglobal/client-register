import React, { useEffect } from 'react';
import { Controller, useFormContext } from 'react-hook-form';
import classnames from 'classnames';

interface FieldDecoratorProps {
  label?: string;
  name: string;
  children: React.ReactElement;
  visible?: boolean;
  setNullCondition?: boolean;
  transformIn?: (value: any) => any;
  transformOut?: (value: any) => any;
  className?: string;
  labelClassName?: string;
  bodyClassName?: string;
  errorClassName?: string;
  hiddenWhenInvisible?: boolean;
  inline?: boolean;
  defaultValue?: any;
  required?: boolean;
  valuePropName?: string;
}

export default function FieldDecorator({
  label,
  name,
  children,
  visible = true,
  setNullCondition = true,
  hiddenWhenInvisible = false,
  transformIn,
  transformOut,
  className = '',
  labelClassName = '',
  bodyClassName = '',
  errorClassName = '',
  inline = false,
  defaultValue,
  required = false,
  valuePropName = 'value',
}: FieldDecoratorProps) {
  const {
    control,
    formState: { errors },
    setValue,
  } = useFormContext();
  useEffect(() => {
    if (!visible && setNullCondition) {
      setValue(name, null);
    }
  }, [visible, setNullCondition, name, setValue]);
  useEffect(() => {
    if (defaultValue !== null && defaultValue !== undefined) {
      setValue(name, defaultValue);
    }
  }, [setValue, name, defaultValue]);
  return visible ? (
    <div
      className={classnames(`flex relative`, {
        'flex-col': !inline,
        'items-center': inline,
        'space-x-2': inline,
        [className]: !!className,
      })}
    >
      {/* label */}

      {label && (
        <div
          className={classnames('text-sm', {
            [labelClassName]: !!labelClassName,
            'mb-2': !inline,
          })}
        >
          {required && <span className="text-red-500">* </span>}
          {label}
        </div>
      )}
      {/* children */}
      <div className={classnames(`grow`, { [bodyClassName]: !!bodyClassName })}>
        <Controller
          name={name}
          control={control}
          render={({ field }) =>
            React.cloneElement(children, {
              ...field,
              onChange: (e: any) =>
                field.onChange(transformOut ? transformOut(e) : e),
              [valuePropName]:
                transformIn && field.value
                  ? transformIn(field.value)
                  : field.value,
            })
          }
        />
      </div>
      {/* err */}
      <div
        className={classnames(
          'text-red-500 text-sm font-semibold absolute -bottom-6',
          {
            [errorClassName]: !!errorClassName,
          }
        )}
      >
        {(errors[name] as any) && (errors[name] as any).message}
      </div>
    </div>
  ) : (
    <div className={hiddenWhenInvisible ? 'hidden' : ''} />
  );
}
