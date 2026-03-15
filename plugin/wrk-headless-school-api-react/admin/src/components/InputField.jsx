import React from 'react';
import { prettifyLabel } from '../data/fieldLabels';

export default function InputField({ label, value, onChange, multiline = false, placeholder = '' }) {
  const commonProps = {
    value: value ?? '',
    onChange: (e) => onChange(e.target.value),
    placeholder,
  };

  return (
    React.createElement('label', { className: 'wrk-field' },
      React.createElement('span', { className: 'wrk-field__label' }, label),
      multiline
        ? React.createElement('textarea', { className: 'wrk-input wrk-input--textarea', rows: 5, ...commonProps })
        : React.createElement('input', { className: 'wrk-input', type: 'text', ...commonProps })
    )
  );
}

export function inferMultiline(key, value) {
  return (
    typeof value === 'string' &&
    (value.length > 100 || /description|content|text|address|paragraph|hint|subtitle/i.test(key))
  );
}

export function sectionTitle(key) {
  return prettifyLabel(key);
}
