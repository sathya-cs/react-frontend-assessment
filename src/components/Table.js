import React, { useState } from 'react';
import Row from './Row';
import { data as initialData } from '../data';

const calculateSubtotal = (row) => {
  if (row.children) {
    return row.children.reduce((acc, child) => acc + child.value, 0);
  }
  return row.value;
};

const getVariance = (originalValue, updatedValue) => {
  if (!originalValue) return 0;
  return ((updatedValue - originalValue) / originalValue) * 100;
};

const updateChildrenValues = (parentRow, newValue) => {
  const totalChildValue = calculateSubtotal(parentRow);

  parentRow.children.forEach((child) => {
    const childPercentage = (child.value / totalChildValue) * 100;
    const newChildValue = (childPercentage / 100) * newValue;
    child.value = parseFloat(newChildValue.toFixed(2));
  });

  parentRow.value = newValue;
};

const Table = () => {
  const [data, setData] = useState(() => {
    return initialData.map((row) => ({
      ...row,
      originalValue: row.value,
      children: row.children
        ? row.children.map((child) => ({
            ...child,
            originalValue: child.value,
          }))
        : [],
    }));
  });

  const handleUpdateValue = (id, newValue, isPercentage) => {
    const updatedData = [...data];

    const updateRowValue = (rows) => {
      return rows.map((row) => {
        if (row.id === id) {
          let updatedValue;
          if (isPercentage) {
            updatedValue = row.value * (1 + newValue / 100);
          } else {
            updatedValue = newValue;
          }

          if (row.children && !isPercentage) {
            updateChildrenValues(row, updatedValue);
          } else {
            row.value = updatedValue;
          }
        }

        if (row.children) {
          row.children = updateRowValue(row.children);
        }

        row.value = calculateSubtotal(row);

        return row;
      });
    };

    const updatedRows = updateRowValue(updatedData);
    setData(updatedRows);
  };

  const getGrandTotal = () => {
    return data.reduce((total, row) => total + calculateSubtotal(row), 0);
  };

  return (
    <div>
      <table>
        <thead>
          <tr>
            <th>Label</th>
            <th>Value</th>
            <th>Input</th>
            <th>Allocation %</th>
            <th>Allocation Val</th>
            <th>Variance %</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <Row
              key={row.id}
              row={row}
              onUpdateValue={handleUpdateValue}
              getVariance={getVariance}
            />
          ))}
        </tbody>
        <tfoot>
          <tr>
            <td>
              <strong>Grand Total</strong>
            </td>
            <td>{getGrandTotal()}</td>
            <td colSpan='4'></td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
};

export default Table;
