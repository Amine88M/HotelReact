import React, { useEffect, useState } from 'react';
import { Box, Typography, Paper, Grid } from '@mui/material';
import { CalendarToday, People } from '@mui/icons-material';
import axios from 'axios';
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { reservationService } from '../../services/api';  // Updated path

const localizer = momentLocalizer(moment);

const DashboardPage = () => {
  const [reservations, setReservations] = useState(0);
  const [guests, setGuests] = useState(0);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get('http://localhost:5000/api/reservations')
      .then(response => {
        setReservations(response.data.totalReservations);
        setGuests(response.data.totalGuests);
        setEvents(response.data.events);
        setLoading(false);
      })
      .catch(error => {
        console.error('Erreur lors de la récupération des données:', error);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <Typography>Chargement en cours...</Typography>;
  }

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Typography variant="h4" gutterBottom>
        Management Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <CalendarToday fontSize="large" />
            <Typography variant="h6">Reservations</Typography>
            <Typography variant="h4">{reservations}</Typography>
          </Paper>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
            <People fontSize="large" />
            <Typography variant="h6">Guests</Typography>
            <Typography variant="h4">{guests}</Typography>
          </Paper>
        </Grid>
      </Grid>

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Calendar
        </Typography>
        <Paper sx={{ p: 2, height: 500 }}>
          <Calendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
          />
        </Paper>
      </Box>
    </Box>
  );
};

export default DashboardPage;