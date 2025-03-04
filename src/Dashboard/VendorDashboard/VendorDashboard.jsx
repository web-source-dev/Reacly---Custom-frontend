import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Button,
  Chip,
  Tabs,
  Tab,
  useTheme,
  Avatar,
  IconButton,
  Tooltip,
  TextField,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  DialogContentText
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, Business as BusinessIcon, FileDownload as FileDownloadIcon, Schedule as ScheduleIcon } from '@mui/icons-material';
import axios from 'axios';

import { useNavigate } from "react-router-dom";
const MeetingDialog = ({ open, onClose, onSchedule, buyerName }) => {
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = () => {
    onSchedule({ date, time, message });
    setDate('');
    setTime('');
    setMessage('');
    onClose();
  };

  return (
<Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth 
  sx={{ backgroundColor: 'rgba(0, 0, 0, 0.18)' }}>
  <Box sx={{ backgroundColor: '#000', color: '#fff', padding: 2 }}>
    <DialogTitle sx={{ color: '#fff', fontWeight: 'bold' }}>
      Schedule Meeting with {buyerName}
    </DialogTitle>
    <DialogContent>
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
        <TextField
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{
            backgroundColor: '#121212',
            borderRadius: 1,
            input: { color: '#fff' },
            label: { color: '#aaa' }
          }}
        />
        <TextField
          label="Time"
          type="time"
          value={time}
          onChange={(e) => setTime(e.target.value)}
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={{
            backgroundColor: '#121212',
            borderRadius: 1,
            input: { color: '#fff' },
            label: { color: '#aaa' }
          }}
        />
       <TextField
  label="Message"
  multiline
  rows={4}
  value={message}
  onChange={(e) => setMessage(e.target.value)}
  fullWidth
  sx={{
    backgroundColor: '#121212',
    borderRadius: 1,
    '& .MuiOutlinedInput-input': {
      color: '#fff', // Ensures input text is white
    },
    '& .MuiInputLabel-root': {
      color: 'rgba(255, 255, 255, 0.7)',
    },
    '& .MuiInputLabel-root.Mui-focused': {
      color: '#fff',
    },
  }}
/>

      </Box>
    </DialogContent>
    <DialogActions>
      <Button onClick={onClose} sx={{ color: '#aaa' }}>Cancel</Button>
      <Button onClick={handleSubmit} variant="contained" 
        sx={{ backgroundColor: '#1E88E5', color: '#fff', '&:hover': { backgroundColor: '#1565C0' } }}>
        Schedule Meeting
      </Button>
    </DialogActions>
  </Box>
</Dialog>

  );
};

const VendorDashboard = () => {
  const theme = useTheme();
  const [vendorData, setVendorData] = useState(null);
  const [matchedBuyers, setMatchedBuyers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState(0);
  const [remainingLeads, setRemainingLeads] = useState(0);
  const [meetings, setMeetings] = useState([]);
  const [filters, setFilters] = useState({
    month: '',
    searchQuery: '',
    industry: '',
    service: ''
  });
  const navigate = useNavigate();
  const [meetingDialogOpen, setMeetingDialogOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);

  useEffect(() => {
    const role = localStorage.getItem("role");
    if (role !== 'vendor'){
      navigate("/login");
    }
  }, [navigate]);

  useEffect(() => {
    fetchVendorData();
  }, []);

  useEffect(() => {
    if (vendorData) {
      setRemainingLeads(vendorData.leads || 0);
      fetchMeetings();
    }
  }, [vendorData]);

  const fetchMeetings = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/meeting/vendor/${vendorData._id}`);
      setMeetings(response.data);
    } catch (error) {
      console.error('Error fetching meetings:', error);
    }
  };

  const fetchVendorData = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setError('User email not found');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor/${email}/matches`);
      setVendorData(response.data.vendor);
      setMatchedBuyers(response.data.matchedBuyers);
    } catch (error) {
      console.error('Error fetching vendor data:', error);
      setError('Error fetching vendor data');
    } finally {
      setLoading(false);
    }
  };

  const handleMatchStatusUpdate = async (buyerEmail, status) => {
    try {
      const email = localStorage.getItem('userEmail');
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor/${email}/match/${buyerEmail}`, { status });

      // Deduct lead if accepting
      if (status === 'accepted') {
        setRemainingLeads(prev => Math.max(0, prev - 1));
      }

      // Refresh data after update
      fetchVendorData();
    } catch (error) {
      console.error('Error updating match status:', error);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const filterBuyersByStatus = (status) => {
    return matchedBuyers.filter(matchData => {
      const matchStatus = vendorData.matchedBuyers?.find(
        mb => mb.buyerEmail === matchData.buyer.email
      )?.status;
      return status === 'new' ? !matchStatus : matchStatus === status;
    });
  };

  const filterBuyers = (buyers) => {
    return buyers.filter(matchData => {
      const buyer = matchData.buyer;
      const name = `${buyer.firstName} ${buyer.lastName}`.toLowerCase();
      const company = buyer.companyName.toLowerCase();
      const searchQuery = filters.searchQuery.toLowerCase();

      const matchesSearch = !filters.searchQuery || 
        name.includes(searchQuery) || 
        company.includes(searchQuery);

      const matchesIndustry = !filters.industry || 
        buyer.industries.includes(filters.industry);

      const matchesService = !filters.service || 
        buyer.services.some(s => s.service === filters.service);

      return matchesSearch && matchesIndustry && matchesService;
    });
  };

  const exportToCSV = () => {
    const csvData = filterBuyers(filterBuyersByStatus(activeTab === 0 ? 'new' : activeTab === 1 ? 'accepted' : 'rejected')).map(matchData => ({
      'Company Name': matchData.buyer.companyName,
      'Contact Person': `${matchData.buyer.firstName} ${matchData.buyer.lastName}`,
      'Email': matchData.buyer.email,
      'Company Size': matchData.buyer.companySize,
      'Industries': matchData.buyer.industries.join(', '),
      'Services': matchData.buyer.services.map(s => s.service).join(', '),
      'Status': activeTab === 0 ? 'New' : activeTab === 1 ? 'Accepted' : 'Rejected',
      'Match Date': new Date(matchData.buyer.createdAt).toLocaleDateString()
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `matched_buyers_${activeTab}_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const handleScheduleMeeting = async (meetingDetails) => {
    try {
      const email = localStorage.getItem('userEmail');
      const response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/meeting/schedule`, {
        vendorId: vendorData._id,
        buyerId: selectedBuyer._id,
        date: meetingDetails.date,
        time: meetingDetails.time,
        message: meetingDetails.message
      });

      // Refresh meetings data after scheduling
      fetchMeetings();
      setMeetingDialogOpen(false);
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const FilterControls = () => (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Month</InputLabel>
            <Select
              value={filters.month}
              onChange={(e) => setFilters(prev => ({ ...prev, month: e.target.value }))}
              sx={{
                color: '#fff',
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: 'rgba(255, 255, 255, 0.23)'
                }
              }}
            >
              <MenuItem value="">All Months</MenuItem>
              {Array.from({ length: 12 }, (_, i) => (
                <MenuItem key={i} value={i}>
                  {new Date(0, i).toLocaleString('default', { month: 'long' })}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={Array.from(new Set(matchedBuyers.flatMap(b => b.buyer.industries)))}
            value={filters.industry}
            onChange={(_, newValue) => setFilters(prev => ({ ...prev, industry: newValue }))}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Filter by Industry"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            )}
            disablePortal
            blurOnSelect
          />
        </Grid>
        <Grid item xs={12} md={4}>
          <Autocomplete
            options={Array.from(new Set(matchedBuyers.flatMap(b => b.buyer.services.map(s => s.service))))}
            value={filters.service}
            onChange={(_, newValue) => setFilters(prev => ({ ...prev, service: newValue }))}
            renderInput={(params) => (
              <TextField 
                {...params} 
                label="Filter by Service"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    color: '#fff',
                    '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                  },
                  '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                }}
              />
            )}
            disablePortal
            blurOnSelect
          />
        </Grid>
      </Grid>
    </Box>
  );

  if (loading) return <Typography>Loading...</Typography>;
  if (error) return <Typography color="error">{error}</Typography>;
  if (!vendorData) return <Typography>No vendor data found</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4, minHeight: '100vh', background: 'linear-gradient(135deg, rgba(26,26,26,0.95) 0%, rgba(45,45,45,0.95) 100%)' }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{
            background: 'linear-gradient(to right bottom, #1a1a1a, #2d2d2d)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                  Company Profile
                </Typography>
                <Chip
                  label={`Remaining Leads: ${remainingLeads}`}
                  color="primary"
                  sx={{
                    fontSize: '1rem',
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white',
                    fontWeight: 500,
                    p: 2
                  }}
                />
              </Box>
              <Box sx={{ mb: 4, color: '#fff' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
                  <Avatar sx={{
                    bgcolor: theme.palette.primary.main,
                    width: 80,
                    height: 80,
                    mr: 2
                  }}>
                    <BusinessIcon sx={{ fontSize: 40 }} />
                  </Avatar>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>{vendorData?.companyName}</Typography>
                    <Typography variant="subtitle1">{`${vendorData?.firstName} ${vendorData?.lastName}`}</Typography>
                  </Box>
                </Box>
                <Box sx={{
                  p: 2,
                  borderRadius: 2,
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography sx={{ mb: 2 }}><strong>Email:</strong> {vendorData?.email}</Typography>
                  <Typography sx={{ mb: 2 }}><strong>Phone:</strong> {vendorData?.phone}</Typography>
                  <Typography><strong>Website:</strong> {vendorData?.companyWebsite}</Typography>
                </Box>
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} md={7}>
          <Card sx={{
            background: 'linear-gradient(to right bottom, #1a1a1a, #2d2d2d)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 500, mb: 3 }}>
                Industries & Services
              </Typography>

              <Grid container spacing={2}>
                <Grid item xs={12} md={6}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    height: '100%'
                  }}>
                    <Typography sx={{ color: '#fff', mb: 2, fontWeight: 500 }}>Industries</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {vendorData?.selectedIndustries.map((industry) => (
                        <Chip
                          key={industry}
                          label={industry}
                          sx={{
                            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)',
                            color: '#fff',
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 203, 243, 0.2) 100%)',
                              border: '1px solid rgba(33, 150, 243, 0.5)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12} md={6}>
                  <Box sx={{
                    p: 2,
                    borderRadius: 2,
                    bgcolor: 'rgba(255, 255, 255, 0.05)',
                    height: '100%'
                  }}>
                    <Typography sx={{ color: '#fff', mb: 2, fontWeight: 500 }}>Services</Typography>
                    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                      {vendorData?.selectedServices.map((service) => (
                        <Chip
                          key={service}
                          label={service}
                          sx={{
                            background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)',
                            color: '#fff',
                            border: '1px solid rgba(33, 150, 243, 0.3)',
                            '&:hover': {
                              background: 'linear-gradient(45deg, rgba(33, 150, 243, 0.2) 0%, rgba(33, 203, 243, 0.2) 100%)',
                              border: '1px solid rgba(33, 150, 243, 0.5)'
                            }
                          }}
                        />
                      ))}
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12}>
          <Card sx={{
            background: 'linear-gradient(to right bottom, #1a1a1a, #2d2d2d)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            borderRadius: 2
          }}>
            <CardContent>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Tabs
                  value={activeTab}
                  onChange={handleTabChange}
                  sx={{
                    '& .MuiTab-root': { color: '#fff' },
                    '& .Mui-selected': { color: '#2196F3' },
                    '& .MuiTabs-indicator': { backgroundColor: '#2196F3' }
                  }}
                >
                  <Tab label="New Matches" />
                  <Tab label="Accepted Buyers" />
                  <Tab label="Rejected Buyers" />
                </Tabs>
                <Button
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={exportToCSV}
                  sx={{
                    background: 'linear-gradient(45deg, #2196F3 30%, #21CBF3 90%)',
                    color: 'white'
                  }}
                >
                  Export CSV
                </Button>
              </Box>
              <FilterControls />
              <Grid container spacing={3}>
                {filterBuyers(filterBuyersByStatus(activeTab === 0 ? 'new' : activeTab === 1 ? 'accepted' : 'rejected')).map((matchData) => {
                  const buyer = matchData.buyer;
                  const matchStatus = vendorData.matchedBuyers?.find(
                    (mb) => mb.buyerEmail === buyer.email
                  )?.status;

                  return (
                    <Grid item xs={12} sm={6} md={4} key={buyer._id}>
                      <Card sx={{
                        height: '100%',
                        background: 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(10px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 2,
                        transition: 'transform 0.2s, box-shadow 0.2s',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: '0 12px 40px rgba(0, 0, 0, 0.3)'
                        }
                      }}>
                        <CardContent>
                          <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                            <Avatar sx={{
                              bgcolor: theme.palette.primary.main,
                              width: 56,
                              height: 56,
                              mr: 2
                            }}>
                              <BusinessIcon />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                {buyer.companyName}
                              </Typography>
                            </Box>
                          </Box>

                          {activeTab === 1 && (
                            <>
                              <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)', mb: 1 }}>
                                {`${buyer.firstName} ${buyer.lastName}`}
                              </Typography>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                <Typography variant="body2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                  {buyer.email}
                                </Typography>
                                <Button
                                  variant="outlined"
                                  onClick={() => {
                                    setSelectedBuyer(buyer);
                                    setMeetingDialogOpen(true);
                                  }}
                                  disabled={meetings.some(meeting => 
                                    meeting.buyerId._id === buyer._id && 
                                    meeting.status === 'scheduled'
                                  )}
                                  sx={{
                                    position: 'absolute',
                                    right: 5,
                                    top: 5,
                                    fontSize: '10px',
                                    padding: '5px',
                                    color: '#fff',
                                    borderColor: 'rgba(255, 255, 255, 0.23)',
                                    '&:hover': {
                                      borderColor: '#fff',
                                      backgroundColor: 'rgba(255, 255, 255, 0.08)'
                                    },
                                    '&.Mui-disabled': {
                                      backgroundColor: 'rgba(5, 145, 47, 0.35)',
                                      color: 'rgb(255, 255, 255)'
                                    }
                                  }}
                                >
                                  {meetings.some(meeting => 
                                    meeting.buyerId._id === buyer._id && 
                                    meeting.status === 'scheduled'
                                  ) ? 'scheduled' : 'Schedule Meeting'}
                                </Button>
                              </Box>
                              <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                                Company Size: {buyer.companySize}
                              </Typography>
                            </>
                          )}

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                              Industries:
                            </Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                              {buyer.industries.map((industry, index) => (
                                <Chip
                                  key={index}
                                  label={industry}
                                  size="small"
                                  sx={{
                                    background: 'rgba(33, 150, 243, 0.2)',
                                    color: '#fff',
                                    '&:hover': { background: 'rgba(33, 150, 243, 0.3)' }
                                  }}
                                />
                              ))}
                            </Box>
                          </Box>

                          <Box sx={{ mb: 2 }}>
                            <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                              Match Reasons:
                            </Typography>
                            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                              {/* Industry Match */}
                              {matchData.matchReasons.some(reason => reason.startsWith('industryMatch')) && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                    Industry Match: 
                                  </Typography>
                                  {matchData.matchReasons
                                    .filter(reason => reason.startsWith('industryMatch'))
                                    .flatMap(reason => reason.replace('industryMatch: ', '').split(', '))
                                    .map((industry, index) => (
                                      <Chip
                                        key={`industry-${index}`}
                                        label={industry}
                                        size="small"
                                        sx={{
                                          background: 'rgba(33, 150, 243, 0.15)',
                                          color: '#fff',
                                          '&:hover': { background: 'rgba(33, 150, 243, 0.25)' }
                                        }}
                                      />
                                    ))}
                                </Box>
                              )}

                              {/* Service Match */}
                              {matchData.matchReasons.some(reason => reason.startsWith('serviceMatch')) && (
                                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, flexWrap: 'wrap' }}>
                                  <Typography variant="body2" sx={{ fontWeight: 'bold', color: '#fff' }}>
                                    Service Match:
                                  </Typography>
                                  {matchData.matchReasons
                                    .filter(reason => reason.startsWith('serviceMatch'))
                                    .flatMap(reason => reason.replace('serviceMatch: ', '').split(', '))
                                    .map((service, index) => (
                                      <Chip
                                        key={`service-${index}`}
                                        label={service}
                                        size="small"
                                        sx={{
                                          background: 'rgba(33, 150, 243, 0.15)',
                                          color: '#fff',
                                          '&:hover': { background: 'rgba(33, 150, 243, 0.25)' }
                                        }}
                                      />
                                    ))}
                                </Box>
                              )}
                            </Box>

                          </Box>

                          {activeTab === 0 ? (
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 2 }}>
                              <Tooltip title={remainingLeads === 0 ? 'No remaining leads' : 'Accept match'}>
                                <span>
                                  <IconButton
                                    color="success"
                                    onClick={() => handleMatchStatusUpdate(buyer.email, 'accepted')}
                                    disabled={remainingLeads === 0}
                                    sx={{
                                      bgcolor: 'rgba(76, 175, 80, 0.1)',
                                      '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' },
                                      '&.Mui-disabled': { opacity: 0.5 }
                                    }}
                                  >
                                    <CheckIcon />
                                  </IconButton>
                                </span>
                              </Tooltip>
                              <Tooltip title="Reject match">
                                <IconButton
                                  color="error"
                                  onClick={() => handleMatchStatusUpdate(buyer.email, 'rejected')}
                                  sx={{
                                    bgcolor: 'rgba(244, 67, 54, 0.1)',
                                    '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                                  }}
                                >
                                  <CloseIcon />
                                </IconButton>
                              </Tooltip>
                            </Box>
                          ) : (
                            <Box>
                              <Box sx={{
                                mt: 2,
                                p: 1,
                                borderRadius: 1,
                                bgcolor: matchStatus === 'accepted' ? 'rgba(76, 175, 80, 0.1)' : 'rgba(244, 67, 54, 0.1)',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                mb: 2
                              }}>
                                <Typography
                                  variant="body2"
                                  sx={{
                                    color: matchStatus === 'accepted' ? '#4caf50' : '#f44336',
                                    fontWeight: 500
                                  }}
                                >
                                  {matchStatus === 'accepted' ? 'Accepted' : 'Rejected'}
                                </Typography>
                              </Box>
                              {matchStatus === 'accepted' && (
                                <Box sx={{ mt: 1 }}>
                                  <Typography variant="subtitle2" sx={{ color: '#fff', mb: 1 }}>
                                    Service Status:
                                  </Typography>
                                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                                    {buyer.services.map((service, index) => (
                                      <Chip
                                        key={index}
                                        label={service.service}
                                        size="small"
                                        sx={{
                                          background: service.active ? 'rgba(76, 175, 80, 0.2)' : 'rgba(244, 67, 54, 0.2)',
                                          color: '#fff',
                                          border: `1px solid ${service.active ? '#4caf50' : '#f44336'}`
                                        }}
                                      />
                                    ))}
                                  </Box>
                                  {buyer.services.every(service => !service.active) && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color: '#f44336',
                                        mt: 1,
                                        fontStyle: 'italic'
                                      }}
                                    >
                                      This buyer is currently not looking for any services
                                    </Typography>
                                  )}
                                </Box>
                              )}
                            </Box>
                          )}
                        </CardContent>
                      </Card>
                    </Grid>
                  );
                })}
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
      <MeetingDialog
        open={meetingDialogOpen}
        onClose={() => setMeetingDialogOpen(false)}
        onSchedule={handleScheduleMeeting}
        buyerName={selectedBuyer?.companyName}
      />
    </Container>
  );
};

export default VendorDashboard;
