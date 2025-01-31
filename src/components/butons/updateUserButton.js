import { useState } from 'react';
import { Button } from '@mui/material';
import UserForm from '../forms/userForm';

const UpdateUserButton = ({handleUserDeleted}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);

  const handleClick = async () => setIsFormOpen(true);

  return (
    <>
    <Button 
      color="inherit"
      onClick={handleClick}>
      Update User
    </Button>

    {/* User update Form */}
      <UserForm
        open={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        onUserDeleted={handleUserDeleted}
        // onSubmit={console.log('Submit')}
      />
    </>
  );
};

export default UpdateUserButton;
