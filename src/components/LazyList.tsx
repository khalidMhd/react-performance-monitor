import React, { useState } from 'react';
import styled from '@emotion/styled';

const ListContainer = styled.div`
  margin: 20px 0;
  padding: 15px;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
`;

const ListItem = styled.div`
  padding: 10px;
  margin: 5px 0;
  background: #f3f4f6;
  border-radius: 4px;
  
  &:hover {
    background: #e5e7eb;
  }
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 8px;
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background: #1d4ed8;
  }
`;

interface Item {
  id: number;
  text: string;
}

const LazyList = () => {
  const [items, setItems] = useState<Item[]>([]);

  const addItem = () => {
    const newItem: Item = {
      id: items.length + 1,
      text: `Lazy Item ${items.length + 1}`
    };
    setItems(prev => [...prev, newItem]);
  };

  return (
    <ListContainer>
      <h2>Lazy Loaded List</h2>
      <Button onClick={addItem}>Add Item</Button>
      {items.map(item => (
        <ListItem key={item.id}>
          {item.text}
        </ListItem>
      ))}
    </ListContainer>
  );
};

export default LazyList; 