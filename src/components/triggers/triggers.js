import { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Card, CardContent, CircularProgress } from '@mui/material';
import AddTriggerButton from '../buttons/addTriggerButton';
import DeleteTriggerButton from '../buttons/deleteTriggerButton';
import ChangeTriggerStatusButton from '../buttons/changeTriggerStatusButton';
import UpdateTriggerButton from '../buttons/updateTriggerButton';
import useTriggerService from '../../services/triggerService';
import LocalStorageService, { JWT_TOKEN } from '../../services/LocalStorageService';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import io from "socket.io-client";

const socket = io(process.env.REACT_APP_API_URL || 'http://localhost:3001');
const TRUNCATION_LENGTH = 7;

const Triggers = () => {
  const [triggers, setTriggers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const localStorageService = useMemo(() => new LocalStorageService(), []);
  const token = useMemo(() => localStorageService.getItem(JWT_TOKEN), [localStorageService]);
  const { showTriggersRequest } = useTriggerService();

    useEffect(() => {
      socket.on("triggerStatusUpdate", ({ triggerId, status }) => {
        setTriggers((prevTriggers) =>
          prevTriggers.map((trigger) =>
            trigger._id === triggerId ? { ...trigger, status } : trigger
          )
        );
      });
  
      return () => {
        socket.off("triggerStatusUpdate");
      };
    }, []);

  useEffect(() => {
    setLimit(10);
    fetchTriggers(page, true);
    // eslint-disable-next-line
  }, [page]);

  const fetchTriggers = async (page, reset = false) => {
    if (loading) return;
    setLoading(true);
    try {
      const response = await showTriggersRequest(token, page, limit);
      setTotalPages(response.totalPages);
      setTriggers((prev) => {
        const newTriggers = response.triggers.filter(
          (t) => !prev.some((prevT) => prevT._id === t._id)
        );
        return reset ? response.triggers : [...prev, ...newTriggers];
      });
    } catch (error) {
      console.error('Error fetching device triggers:', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ mt: 2 }}>
      <Typography variant="h5" sx={{ textAlign: 'center', mb: 2 }}>
        Your Triggers
      </Typography>
      <Box p={2} display="flex" justifyContent="center">
        <AddTriggerButton onTriggerAdded={fetchTriggers} />
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" mt={4}>
          <CircularProgress />
        </Box>
      ) : triggers.length > 0 ? (
        <Swiper
          modules={[Navigation, Pagination, Autoplay]}
          spaceBetween={15}
          slidesPerView={1}
          breakpoints={{
            600: { slidesPerView: 2 },
            960: { slidesPerView: 3 },
          }}
          navigation
          pagination={{ clickable: true }}
          autoplay={{ delay: 5000 }}
          onSlideChange={(swiper) => {
            if (swiper.isEnd && page < totalPages) {
              fetchTriggers(page + 1);
              setPage((prev) => (prev < totalPages ? prev + 1 : prev));
            }
          }}
          style={{ paddingBottom: '40px' }}
        >
          {triggers.map((trigger) => (
            <SwiperSlide key={trigger._id}>
              <Card sx={{ boxShadow: 3, borderRadius: 2, p: 1, maxWidth: '350px' }}>
                <CardContent>
                  <Typography variant="h6" sx={{ fontWeight: 'bold' }}>
                    {trigger.name}
                  </Typography>
                  <Typography color="text.secondary">On: {trigger.triggerOn.length > TRUNCATION_LENGTH ? trigger.triggerOn.slice(0, TRUNCATION_LENGTH) + '...' : trigger.triggerOn}</Typography>
                  <Typography color="text.secondary">Off: {trigger.triggerOff.length > TRUNCATION_LENGTH ? trigger.triggerOff.slice(0, TRUNCATION_LENGTH) + '...' : trigger.triggerOff}</Typography>
                  <Typography color="text.secondary">Channel: {trigger.chanelName.length > TRUNCATION_LENGTH ? trigger.chanelName.slice(0, TRUNCATION_LENGTH) + '...' : trigger.chanelName}</Typography>
                  <Box mt={2} display="flex" justifyContent="center">
                    <ChangeTriggerStatusButton
                      triggerId={trigger._id}
                      status={trigger.status}
                      oneUpdateStatus={() =>
                        setTriggers((prev) =>
                          prev.map((t) =>
                            t._id === trigger._id ? { ...t, status: !t.status } : t
                          )
                        )
                      }
                    />
                  </Box>
                </CardContent>
                <Box display="flex" justifyContent="space-between" p={1}>
                  <UpdateTriggerButton trigger={trigger} onTriggerUpdated={fetchTriggers} />
                  <DeleteTriggerButton trigger={trigger} onTriggerDeleted={fetchTriggers} />
                </Box>
              </Card>
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <Typography textAlign="center" sx={{ color: 'gray', mt: 2 }}>
          You don't have any triggers yet.
        </Typography>
      )}
    </Box>
  );
};

export default Triggers;
