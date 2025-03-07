import React, { useState, useEffect } from 'react';
import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Chip,
  TextField,
  MenuItem,
  Grid,
  CircularProgress,
  Card,
  CardContent,
} from '@mui/material';
import { Event as EventIcon } from '@mui/icons-material';
import axios from 'axios';

const EmptyState = ({ isFiltered }) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        p: 4,
        width: '100%',
        minHeight: 300,
        background: 'rgba(255, 255, 255, 0.05)',
        borderRadius: 2,
        backdropFilter: 'blur(10px)',
        border: '1px solid rgba(255, 255, 255, 0.1)'
      }}
    >
      <EventIcon sx={{ fontSize: 60, color: '#4998F8', mb: 2 }} />
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          mb: 1,
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        {isFiltered ? 'No Matching Meetings' : 'No Meetings Scheduled'}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}
      >
        {isFiltered 
          ? 'No meetings match your current filter criteria. Try adjusting your filters.'
          : 'There are currently no meetings scheduled in the system.'}
      </Typography>
    </Box>
  );
};

const MeetingAdminView = () => {
  const [meetings, setMeetings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchMeetings();
  }, []);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/meeting/admin/all`);
      setMeetings(response.data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch meetings');
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'scheduled':
        return 'primary';
      case 'completed':
        return 'success';
      case 'cancelled':
        return 'error';
      default:
        return 'default';
    }
  };

  const filteredMeetings = meetings.filter((meeting) => {
    const matchesStatus = statusFilter === 'all' || meeting.status === statusFilter;
    const matchesSearch = searchTerm === '' || 
      meeting.vendorId.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.buyerId.companyName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      meeting.message.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Calculate statistics
  const stats = {
    total: meetings.length,
    scheduled: meetings.filter(m => m.status === 'scheduled').length,
    completed: meetings.filter(m => m.status === 'completed').length,
    cancelled: meetings.filter(m => m.status === 'cancelled').length,
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="400px">
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box p={3}>
      {/* Statistics Cards */}
      <Grid container spacing={2} mb={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1a1a1a' ,color: '#fff'}}>
            <CardContent>
              <Typography sx={{ color: '#fff' }} color="textSecondary" gutterBottom>
                Total Meetings
              </Typography>
              <Typography sx={{ color: '#fff' }} variant="h5">{stats.total}</Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card sx={{ backgroundColor: '#1a1a1a' ,color: '#fff'}}>
            <CardContent>
              <Typography sx={{ color: '#fff' }} color="textSecondary" gutterBottom>
                Scheduled
              </Typography>
              <Typography sx={{ color: '#fff' }} variant="h5" color="primary">{stats.scheduled}</Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {filteredMeetings.length === 0 ? (
        <EmptyState isFiltered={meetings.length > 0} />
      ) : (
        <TableContainer component={Paper} sx={{ backgroundColor: '#1a1a1a', color: '#fff' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff' }}>Date & Time</TableCell>
                <TableCell sx={{ color: '#fff' }}>Participants</TableCell>
                <TableCell sx={{ color: '#fff' }}>Status</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredMeetings.map((meeting) => (
                <TableRow key={meeting._id}>
                  <TableCell sx={{ color: '#fff' }}>
                    <Typography variant="body2">
                      {new Date(meeting.date).toLocaleDateString()}
                    </Typography>
                    <Typography sx={{ color: '#fff' }} variant="caption" color="textSecondary">
                      {meeting.time}
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>
                    <Typography variant="body2">
                      {meeting.vendorId.companyName} ↔ {meeting.buyerId.companyName}
                    </Typography>
                    <Typography sx={{ color: '#fff' }} variant="caption" color="textSecondary" display="block">
                      {meeting.message.substring(0, 50)}...
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>
                    <Chip
                      label={meeting.status}
                      color={getStatusColor(meeting.status)}
                      size="small"
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
};

export default MeetingAdminView;
