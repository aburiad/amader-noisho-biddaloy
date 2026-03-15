import React from 'react';
import { prettifyLabel } from '../data/fieldLabels';

function emptyItem(keys) {
  return keys.reduce((acc, key) => {
    acc[key] = '';
    return acc;
  }, {});
}

export default function RepeaterField({ label, items = [], columns = ['text'], onChange }) {
  const addItem = () => onChange([...(items || []), emptyItem(columns)]);

  const updateItem = (index, key, value) => {
    const next = [...items];
    next[index] = { ...(next[index] || {}), [key]: value };
    onChange(next);
  };

  const removeItem = (index) => {
    const next = items.filter((_, i) => i !== index);
    onChange(next);
  };

  const moveItem = (index, direction) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  };

  return React.createElement('div', { className: 'wrk-repeater' },
    React.createElement('div', { className: 'wrk-repeater__head' },
      React.createElement('div', null,
        React.createElement('h3', { className: 'wrk-section-title' }, label),
        React.createElement('p', { className: 'wrk-section-help' }, 'Structured repeater field for dynamic React rendering.')
      ),
      React.createElement('button', { type: 'button', className: 'wrk-button wrk-button--primary', onClick: addItem }, '+ Add item')
    ),
    !items.length && React.createElement('div', { className: 'wrk-empty' }, 'No items yet. Add your first row.'),
    items.map((item, index) =>
      React.createElement('div', { className: 'wrk-repeater__item', key: index },
        React.createElement('div', { className: 'wrk-repeater__toolbar' },
          React.createElement('strong', null, `${label} ${index + 1}`),
          React.createElement('div', { className: 'wrk-repeater__actions' },
            React.createElement('button', { type: 'button', className: 'wrk-icon-btn', onClick: () => moveItem(index, -1) }, '↑'),
            React.createElement('button', { type: 'button', className: 'wrk-icon-btn', onClick: () => moveItem(index, 1) }, '↓'),
            React.createElement('button', { type: 'button', className: 'wrk-icon-btn wrk-icon-btn--danger', onClick: () => removeItem(index) }, 'Delete')
          )
        ),
        React.createElement('div', { className: 'wrk-grid wrk-grid--2' },
          columns.map((column) =>
            React.createElement('label', { className: 'wrk-field', key: column },
              React.createElement('span', { className: 'wrk-field__label' }, prettifyLabel(column)),
              React.createElement(column === 'description' || column === 'answer' ? 'textarea' : 'input', {
                className: 'wrk-input' + (column === 'description' || column === 'answer' ? ' wrk-input--textarea' : ''),
                rows: column === 'description' || column === 'answer' ? 4 : undefined,
                type: column === 'description' || column === 'answer' ? undefined : 'text',
                value: item?.[column] ?? '',
                onChange: (e) => updateItem(index, column, e.target.value),
              })
            )
          )
        )
      )
    )
  );
}
