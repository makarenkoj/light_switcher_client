import { useState } from 'react';
import { Button } from '@mui/material';
import UserForm from '../forms/userForm';
import { useTranslation } from 'react-i18next';

const UpdateUserButton = ({handleUserDeleted, userData}) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const handleClick = async () => setIsFormOpen(true);
  const { t } = useTranslation();

  return (
    <>
      <Button 
        variant="outlined"
        color="inherit"
        size="small"
        onClick={handleClick}>
        {t('user.update_user')}
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
