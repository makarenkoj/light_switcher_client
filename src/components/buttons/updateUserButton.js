import { useState } from 'react';
import { Button } from '@mui/material';
import UserForm from '../forms/userForm';

const UpdateUserButton = ({handleUserDeleted, userData}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleClick = async () => setIsFormOpen(true);

  return (
    <>
      <Button 
        variant="outlined"
        color="inherit"
        size="small"
        onClick={handleClick}>
        Update User
      </Button>
      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onUserDeleted={handleUserDeleted}
        userData={userData}
      />
    </>
  );
};

export default UpdateUserButton;
