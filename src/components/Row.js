import React, { useState } from 'react';

const Row = ({ row, onUpdateValue, getVariance }) => {
  const [inputValue, setInputValue] = useState('');

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const handleAllocationPercentage = () => {
    const percentage = parseFloat(inputValue);
    if (isNaN(percentage)) return;
    onUpdateValue(row.id, percentage, true);
  };

  const handleAllocationValue = () => {
    const value = parseFloat(inputValue);
    if (isNaN(value)) return;
    onUpdateValue(row.id, value, false);
  };

  const variance = getVariance(row.originalValue, row.value);

  return (
    <>
      <tr style={{ paddingLeft: `${row.children ? 20 : 0}px` }}>
        <td>{row.label}</td>
        <td>{row.value}</td>
        <td>
          <input
            type='number'
            value={inputValue}
            onChange={handleInputChange}
            placeholder='Enter number'
          />
        </td>
        <td>
          <button onClick={handleAllocationPercentage}>Allocation %</button>
        </td>
        <td>
          <button onClick={handleAllocationValue}>Allocation Val</button>
        </td>
        <td className='variance'>{variance.toFixed(2)}%</td>
      </tr>
      {row.children &&
        row.children.map((child) => (
          <Row
            key={child.id}
            row={child}
            onUpdateValue={onUpdateValue}
            getVariance={getVariance}
          />
        ))}
    </>
  );
};

export default Row;
