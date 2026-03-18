import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

function AIMLoader(props) {
  const [AIMComponent, setAIMComponent] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    import('./index')
      .then((module) => {
        setAIMComponent(() => module.default);
      })
      .catch((err) => {
        console.error('Failed to load AIM:', err);
        setError(err.message);
      });
  }, []);

  if (error) {
    return (
      <Container>
        <p>Failed to load AIM Messenger.</p>
        <p style={{ fontSize: '10px', color: '#888', marginTop: '5px' }}>{error}</p>
      </Container>
    );
  }

  if (!AIMComponent) {
    return (
      <Container>
        <p>Loading AIM Messenger...</p>
      </Container>
    );
  }

  return <AIMComponent {...props} />;
}

const Container = styled.div`
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: #ece9d8;
  font-size: 12px;
  font-family: Tahoma, sans-serif;
`;

export default AIMLoader;
