import React from 'react';
import Alert from './Alert';
import { useAlert } from './AlertContext';

const AlertContainer: React.FC = () => {
  const { alertState, hideAlert } = useAlert();
  
  return (
    <Alert
      alertState={alertState}
      onConfirm={alertState.onConfirm || hideAlert}
      onCancel={alertState.onCancel || hideAlert}
    />
  );
};

export default AlertContainer;