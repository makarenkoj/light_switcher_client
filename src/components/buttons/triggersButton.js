import Triggers from '../triggers/triggers';
import { useState } from 'react';
import {Button, Tooltip} from '@mui/material';
import { Stack } from '@mui/system';

const TriggersButton = () => {
  const [isTriggersOpen, setIsTriggersOpen] = useState(false);
  
    const handleClick = async () => {
      setIsTriggersOpen(true);
    }
  
    const handleCloseTriggers = () => {
      setIsTriggersOpen(false);
    };

  return (
    <>
      <Stack direction="row" sx={{ gap: 4 }} mt={2}>
          <Stack sx={{ gap: 1, alignItems: 'center' }}>
            <Tooltip title='SHow Triggers'>
              <Stack direction="row" sx={{ gap: 1 }}>
                <Button variant="contained" color="warning" onClick={handleClick}>
                  Triggers
                </Button>
              </Stack>
            </Tooltip>
          </Stack>
      </Stack>

      <Triggers
        open={isTriggersOpen}
        onClose={handleCloseTriggers}
        // onDeviceAdded={onDeviceAdded} 
        />
    </>
  );
}

export default TriggersButton;
