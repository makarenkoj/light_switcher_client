import { useState, useMemo } from "react";
import { Button, CircularProgress } from "@mui/material";
import useDeviceService from "../../services/deviceService";
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';

const DisconnectTriggerButton = ({ trigger, deviceId, onTriggerDisconnected }) => {
  const [loading, setLoading] = useState(false);
  const { disconnectTriggerRequest } = useDeviceService();
  const localStorageService = useMemo(() => new LocalStorageService(), []);
  const token = useMemo(() => localStorageService.getItem(JWT_TOKEN), [localStorageService]);

  const handleDisconnect = async () => {
    setLoading(true);
    try {
      console.log("Disconnecting trigger:", trigger);
      await disconnectTriggerRequest(deviceId, token, trigger._id);
      onTriggerDisconnected(trigger._id);
    } catch (error) {
      console.error("Trigger disconnection error:", error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Button
      variant="outlined"
      color="error"
      onClick={handleDisconnect}
      disabled={loading}
    >
      {loading ? <CircularProgress size={24} /> : "Disconnect"}
    </Button>
  );
};

export default DisconnectTriggerButton;
