import { useState } from 'react';
import UpdateTriggerForm from '../forms/updateTriggerForm';
import {Button, Tooltip} from '@mui/material';
import { Stack } from '@mui/system';

export default function UpdateTriggerButton({ trigger, onTriggerUpdated }) {
  const [isUpdateFormOpen, setIsUpdateFormOpen] = useState(false);

  const handleClick = async () => {
    setIsUpdateFormOpen(true);
  }

  const handleCloseUpdateForm = () => {
    setIsUpdateFormOpen(false);
  };

  return (
    <>
      <Tooltip title='Update Device'>
        <Stack sx={{ gap: 1, alignItems: 'center' }}>
          <Stack direction="row" sx={{ gap: 1 }}>
            <Button size="small" variant="contained" color="secondary" onClick={handleClick}>
              Update Trigger
            </Button>
          </Stack>
        </Stack>
      </Tooltip>

      <UpdateTriggerForm
        open={isUpdateFormOpen}
        onClose={handleCloseUpdateForm}
        onTriggerUpdated={onTriggerUpdated}
        trigger={trigger} />
    </>
  );
}