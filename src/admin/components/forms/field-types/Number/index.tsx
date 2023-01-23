/* eslint-disable import/no-extraneous-dependencies */
import React, { useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { NumberFormatBase } from 'react-number-format';
import useField from '../../useField';
import Label from '../../Label';
import Error from '../../Error';
import FieldDescription from '../../FieldDescription';
import withCondition from '../../withCondition';
import { number } from '../../../../../fields/validations';
import { Props } from './types';
import { getTranslation } from '../../../../../utilities/getTranslation';

import './index.scss';

const NumberField: React.FC<Props> = (props) => {
  const {
    name,
    path: pathFromProps,
    required,
    validate = number,
    label,
    max,
    min,
    admin: {
      readOnly,
      style,
      className,
      width,
      step,
      placeholder,
      description,
      condition,
      formatOptions,
    } = {},
  } = props;

  const { i18n } = useTranslation();

  const path = pathFromProps || name;

  const memoizedValidate = useCallback((value, options) => {
    return validate(value, { ...options, min, max, required });
  }, [validate, min, max, required]);

  const {
    value,
    showError,
    setValue,
    errorMessage,
  } = useField({
    path,
    validate: memoizedValidate,
    condition,
  });

  const handleChange = useCallback((val: number) => {
    if (Number.isNaN(val)) {
      setValue('');
    } else {
      setValue(val);
    }
  }, [setValue]);

  const classes = [
    'field-type',
    'number',
    className,
    showError && 'error',
    readOnly && 'read-only',
  ].filter(Boolean).join(' ');

  return (
    <div
      className={classes}
      style={{
        ...style,
        width,
      }}
    >
      <Error
        showError={showError}
        message={errorMessage}
      />
      <Label
        htmlFor={`field-${path.replace(/\./gi, '__')}`}
        label={label}
        required={required}
      />
      <NumberFormatBase
        id={`field-${path.replace(/\./gi, '__')}`}
        value={typeof value === 'number' ? value : ''}
        placeholder={getTranslation(placeholder, i18n)}
        disabled={readOnly}
        name={path}
        step={step}
        onWheel={(e) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          e.target.blur();
        }}
        type="tel"
        onValueChange={({ floatValue }) => handleChange(floatValue)}
        removeFormatting={undefined}
        getCaretBoundary={undefined}
        {...formatOptions && {
          format: (n) => new Intl.NumberFormat(i18n.language, formatOptions).format(n as unknown as number),
        }}
      />
      {/* <input
        id={`field-${path.replace(/\./gi, '__')}`}
        value={typeof value === 'number' ? value : ''}
        onChange={handleChange}
        disabled={readOnly}
        placeholder={getTranslation(placeholder, i18n)}
        type="number"
        name={path}
        step={step}
        onWheel={(e) => {
          // eslint-disable-next-line @typescript-eslint/ban-ts-comment
          // @ts-ignore
          e.target.blur();
        }}
      /> */}
      <FieldDescription
        value={value}
        description={description}
        formatOptions={formatOptions}
      />
    </div>
  );
};

export default withCondition(NumberField);
