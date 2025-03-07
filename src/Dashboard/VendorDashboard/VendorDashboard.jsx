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
  DialogContentText,
  CircularProgress
} from '@mui/material';
import { Check as CheckIcon, Close as CloseIcon, Business as BusinessIcon, FileDownload as FileDownloadIcon, Schedule as ScheduleIcon, SearchOff as SearchOffIcon, CheckCircle as CheckCircleIcon, Cancel as CancelIcon } from '@mui/icons-material';
import axios from 'axios';

import { useNavigate } from "react-router-dom";

const RequestLeadsDialog = ({ open, onClose, onSubmit, loading }) => {
  const [numberOfLeads, setNumberOfLeads] = useState('');

  const handleSubmit = () => {
    onSubmit(numberOfLeads);
    setNumberOfLeads('');
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth 
      sx={{ backgroundColor: 'rgba(0, 0, 0, 0.18)' }}>
      <Box sx={{ backgroundColor: '#000', color: '#fff', padding: 2 }}>
        <DialogTitle sx={{ color: '#fff', fontWeight: 'bold' }}>
          Request Additional Leads
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
            <TextField
              label="Number of Leads"
              type="number"
              value={numberOfLeads}
              onChange={(e) => setNumberOfLeads(e.target.value)}
              fullWidth
              sx={{
                backgroundColor: '#121212',
                borderRadius: 1,
                input: { color: '#fff' },
                label: { color: '#aaa' }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} sx={{ color: '#aaa' }}>Cancel</Button>
          <Button 
            onClick={handleSubmit} 
            variant="contained"
            disabled={loading}
            sx={{ 
              backgroundColor: '#4998F8', 
              color: '#fff', 
              borderRadius: 10,
              marginRight: '14px',
              '&:hover': { 
                backgroundColor: '#3d7ac7' 
              } 
            }}
          >
            {loading ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Submit Request'
            )}
          </Button>
        </DialogActions>
      </Box>
    </Dialog>
  );
};

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
        label: { color: '#aaa' },
        '& .MuiSvgIcon-root': { color: '#fff' } // Ensures icon is white
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
        label: { color: '#aaa' },
        '& .MuiSvgIcon-root': { color: '#fff' } // Ensures icon is white
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
        '& .MuiSvgIcon-root': { color: '#fff' } // Ensures icons are white
      }}
    />
  </Box>
</DialogContent>

    <DialogActions sx={{marginRight: '12px'}}>
      <Button onClick={onClose} sx={{ color: '#aaa' }}>Cancel</Button>
      <Button onClick={handleSubmit} variant="contained" 
        sx={{ backgroundColor: '#4998F8',borderRadius: 10, color: '#fff', '&:hover': { backgroundColor: '#3d7ac7' } }}>
        Schedule Meeting
      </Button>
    </DialogActions>
  </Box>
</Dialog>

  );
};

const ConfirmDialog = ({ open, onClose, onConfirm, action }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth 
    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.18)' }}>
    <Box sx={{ backgroundColor: '#000', color: '#fff', padding: 2 }}>
      <DialogTitle sx={{ color: '#fff', fontWeight: 'bold' }}>
        Confirm {action.type === 'reject' ? 'Rejection' : 'Action'}
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#fff', mt: 2 }}>
          {action.type === 'reject' 
            ? 'Are you sure you want to reject this buyer? This action cannot be undone.'
            : 'Are you sure you want to proceed with this action?'}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} sx={{ color: '#aaa' }}>Cancel</Button>
        <Button 
          onClick={onConfirm}
          variant="contained" 
          color={action.type === 'reject' ? 'error' : 'primary'}
          sx={{ 
            backgroundColor: action.type === 'reject' ? '#f44336' : '#4998F8',
            color: '#fff',
            '&:hover': { 
              backgroundColor: action.type === 'reject' ? '#d32f2f' : '#3d7ac7'
            }
          }}
        >
          Confirm
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
);

const EmptyState = ({ type }) => {
  const getEmptyStateContent = () => {
    switch (type) {
      case 'new':
        return {
          icon: <SearchOffIcon sx={{ fontSize: 60, color: '#4998F8' }} />,
          title: 'No New Matches',
          message: 'There are no new matches available at the moment.'
        };
      case 'accepted':
        return {
          icon: <CheckCircleIcon sx={{ fontSize: 60, color: '#4caf50' }} />,
          title: 'No Accepted Buyers',
          message: 'You haven\'t accepted any buyers yet.'
        };
      case 'rejected':
        return {
          icon: <CancelIcon sx={{ fontSize: 60, color: '#f44336' }} />,
          title: 'No Rejected Buyers',
          message: 'You haven\'t rejected any buyers yet.'
        };
      default:
        return {
          icon: <SearchOffIcon sx={{ fontSize: 60, color: '#4998F8' }} />,
          title: 'No Data',
          message: 'No data available.'
        };
    }
  };

  const content = getEmptyStateContent();

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
      {content.icon}
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          mt: 2,
          mb: 1,
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        {content.title}
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}
      >
        {content.message}
      </Typography>
    </Box>
  );
};

const ExportDialog = ({ open, onClose }) => (
  <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth 
    sx={{ backgroundColor: 'rgba(0, 0, 0, 0.18)' }}>
    <Box sx={{ backgroundColor: '#000', color: '#fff', padding: 2 }}>
      <DialogTitle sx={{ color: '#fff', fontWeight: 'bold' }}>
        No Data Available
      </DialogTitle>
      <DialogContent>
        <DialogContentText sx={{ color: '#fff', mt: 2 }}>
          There is no data available to export at this time. Please make sure you have accepted buyers before attempting to export.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={onClose}
          variant="contained"
          sx={{ 
            backgroundColor: '#4998F8', 
            color: '#fff',
            borderRadius: 10,
            '&:hover': { 
              backgroundColor: '#3d7ac7' 
            }
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Box>
  </Dialog>
);

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
  const [requestLeadsDialogOpen, setRequestLeadsDialogOpen] = useState(false);
  const [selectedBuyer, setSelectedBuyer] = useState(null);
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [confirmAction, setConfirmAction] = useState({ type: '', buyerEmail: '' });
  const [actionLoading, setActionLoading] = useState({
    matchUpdate: {},
    requestLeads: false
  });
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

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
    if (status === 'rejected') {
      setConfirmAction({ type: 'reject', buyerEmail, status });
      setConfirmDialogOpen(true);
      return;
    }
    
    setActionLoading(prev => ({ ...prev, matchUpdate: { ...prev.matchUpdate, [buyerEmail]: true } }));
    try {
      const email = localStorage.getItem('userEmail');
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor/${email}/match/${buyerEmail}`, { status });

      if (status === 'accepted') {
        setRemainingLeads(prev => Math.max(0, prev - 1));
      }

      await fetchVendorData();
    } catch (error) {
      console.error('Error updating match status:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, matchUpdate: { ...prev.matchUpdate, [buyerEmail]: false } }));
    }
  };

  const handleConfirmAction = async () => {
    const { buyerEmail, status } = confirmAction;
    setConfirmDialogOpen(false);
    
    try {
      const email = localStorage.getItem('userEmail');
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor/${email}/match/${buyerEmail}`, { status });
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

      const matchesMonth = !filters.month || 
        new Date(buyer.createdAt).getMonth() === parseInt(filters.month);

      return matchesSearch && matchesIndustry && matchesService && matchesMonth;
    });
  };

  const handleRequestLeads = async (numberOfLeads) => {
    setActionLoading(prev => ({ ...prev, requestLeads: true }));
    try {
      await axios.post(`${process.env.REACT_APP_BACKEND_URL}/leadRequest/request/${vendorData.email}`, {
        numberOfLeads: parseInt(numberOfLeads)
      });

      // Show success message
      alert('Lead request submitted successfully!');
      
      // Optionally refresh vendor data to show any updates
      await fetchVendorData();
    } catch (error) {
      console.error('Error requesting leads:', error);
      alert('Error submitting lead request. Please try again.');
    } finally {
      setActionLoading(prev => ({ ...prev, requestLeads: false }));
    }
  };

  const exportToCSV = () => {
    // Only allow export for accepted buyers (activeTab === 1)
    if (activeTab !== 1) return;

    const filteredBuyers = filterBuyers(filterBuyersByStatus('accepted'));
    
    if (!filteredBuyers || filteredBuyers.length === 0) {
      setExportDialogOpen(true);
      return;
    }

    const csvData = filteredBuyers.map(matchData => ({
      'Company Name': matchData.buyer.companyName,
      'Contact Person': `${matchData.buyer.firstName} ${matchData.buyer.lastName}`,
      'Email': matchData.buyer.email,
      'Company Size': matchData.buyer.companySize,
      'Industries': matchData.buyer.industries.join(', '),
      'Services': matchData.buyer.services.map(s => s.service).join(', '),
      'Status': 'Accepted',
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
    link.download = `accepted_buyers_${new Date().toLocaleDateString()}.csv`;
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
      window.location.reload();
    } catch (error) {
      console.error('Error scheduling meeting:', error);
    }
  };

  const FilterControls = () => (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center" justifyContent="flex-end">

        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
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
        <Grid item xs={12} md={3}>
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
                <Box>
                  <Chip
                    label={`Remaining Leads: ${remainingLeads}`}
                    color="primary"
                    sx={{
                      fontSize: '0.9rem',
                      background: '#4998F8',
                      color: 'white',
                      fontWeight: 500,
                      mb: 1
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => setRequestLeadsDialogOpen(true)}
                    sx={{
                      display: 'block',
                      width: '100%',
                      fontSize: '0.9rem',
                      p: '3px',
                      backgroundColor: '#4998F8',
                      color: '#fff',
                      borderRadius: 10,
                      '&:hover': {
                        backgroundColor: '#3d7ac7'
                      }
                    }}
                  >
                    Request Leads
                  </Button>
                </Box>
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
                  disabled={activeTab !== 1}
                  sx={{
                    background: activeTab === 1 ? '#4998F8' : 'rgba(73, 152, 248, 0.5)',
                    color: 'white',
                    borderRadius: 10,
                    '&:hover': {
                      backgroundColor: activeTab === 1 ? '#3d7ac7' : 'rgba(73, 152, 248, 0.5)'
                    }
                  }}
                >
                  Export CSV
                </Button>
              </Box>
              <FilterControls />
              {filterBuyers(filterBuyersByStatus(activeTab === 0 ? 'new' : activeTab === 1 ? 'accepted' : 'rejected')).length === 0 ? (
                <EmptyState type={activeTab === 0 ? 'new' : activeTab === 1 ? 'accepted' : 'rejected'} />
              ) : (
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
                                      right: 10,
                                      top: 10,
                                      fontSize: '10px',
                                      backgroundColor: '#4998F8',
                                      padding: '5px',
                                      color: '#fff',
                                      borderColor: '#4998F8',
                                      '&:hover': {
                                        borderColor: '#fff',
                                        backgroundColor: '#4998F8'
                                      },
                                      '&.Mui-disabled': {
                                        backgroundColor: 'rgba(5, 145, 47, 0.35)',
                                        color: 'rgb(255, 255, 255)',
                                        cursor: 'not-allowed'
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
                              <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 2 }}>
                                <Tooltip title={remainingLeads === 0 ? 'No remaining leads' : 'Accept match'}>
                                  <span>
                                    <IconButton
                                      color="success"
                                      onClick={() => handleMatchStatusUpdate(buyer.email, 'accepted')}
                                      disabled={remainingLeads === 0 || actionLoading.matchUpdate[buyer.email]}
                                      sx={{
                                        bgcolor: 'rgba(76, 175, 80, 0.1)',
                                        '&:hover': { bgcolor: 'rgba(76, 175, 80, 0.2)' },
                                        '&.Mui-disabled': { opacity: 0.5 }
                                      }}
                                    >
                                      {actionLoading.matchUpdate[buyer.email] ? (
                                        <CircularProgress size={20} color="success" />
                                      ) : (
                                        <CheckIcon />
                                      )}
                                    </IconButton>
                                  </span>
                                </Tooltip>
                                <Tooltip title="Reject match">
                                  <span>
                                    <IconButton
                                      color="error"
                                      onClick={() => handleMatchStatusUpdate(buyer.email, 'rejected')}
                                      disabled={actionLoading.matchUpdate[buyer.email]}
                                      sx={{
                                        bgcolor: 'rgba(244, 67, 54, 0.1)',
                                        '&:hover': { bgcolor: 'rgba(244, 67, 54, 0.2)' }
                                      }}
                                    >
                                      {actionLoading.matchUpdate[buyer.email] ? (
                                        <CircularProgress size={20} color="error" />
                                      ) : (
                                        <CloseIcon />
                                      )}
                                    </IconButton>
                                  </span>
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
              )}
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
      <RequestLeadsDialog
        open={requestLeadsDialogOpen}
        onClose={() => setRequestLeadsDialogOpen(false)}
        onSubmit={handleRequestLeads}
        loading={actionLoading.requestLeads}
      />
      <ConfirmDialog
        open={confirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
        onConfirm={handleConfirmAction}
        action={confirmAction}
      />
      <ExportDialog 
        open={exportDialogOpen} 
        onClose={() => setExportDialogOpen(false)} 
      />
    </Container>
  );
};

export default VendorDashboard;
