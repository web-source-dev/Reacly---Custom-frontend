import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  Grid,
  Chip,
  useTheme,
  Avatar,
  Switch,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Autocomplete,
  FormControl,
  InputLabel,
  Select,
  CircularProgress,
  DialogContentText,
} from '@mui/material';
import BusinessIcon from '@mui/icons-material/Business';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import SearchOffIcon from '@mui/icons-material/SearchOff';

import axios from 'axios';

const EmptyState = ({ message }) => {
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
      <SearchOffIcon sx={{ fontSize: 60, color: '#4998F8', mb: 2 }} />
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          mb: 1,
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        No Matched Vendors Found
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}
      >
        {message}
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
          There is no data available to export at this time. Please make sure you have matched vendors before attempting to export.
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

const BuyerDashboard = () => {
  const theme = useTheme();
  const [buyerData, setBuyerData] = useState(null);
  const [matchedVendors, setMatchedVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [editFormData, setEditFormData] = useState({
    service: '',
    timeframe: '',
    budget: '',
    isActive: true
  });
  const [allServicesDialogOpen, setAllServicesDialogOpen] = useState(false);
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({
    service: '',
    timeframe: '',
    budget: '',
    isActive: true
  });
  const [filters, setFilters] = useState({
    month: '',
    industry: '',
    service: ''
  });
  const [actionLoading, setActionLoading] = useState({
    serviceToggle: {},
    editService: false,
    updateAllServices: false
  });
  const [exportDialogOpen, setExportDialogOpen] = useState(false);

  const serviceOptions = [
    "Customer Relationship Management Solutions",
"Marketing Automation Platforms",
"Sales Enablement Tools",
"Financial Planning and Analysis Services",
"Accounting and Bookkeeping Services",
"Payroll Processing Services",
"Recruitment and Talent Acquisition Services",
"Project Management Tools",
"Supply Chain Management Solutions",
"Logistics and Transportation Services",
"E-commerce Platforms",
"Business Intelligence and Analytics Tools",
"Enterprise Resource Planning (ERP) Systems",
"Open-Source Intelligence (OSINT) Services",
"Physical Security and Surveillance Systems",
"Access Control Solutions",
"Cybersecurity Services",
'Cloud Computing Services',
"Payment Processing Solutions",
"Manufacturing Automation Solutions"
  ];

  const timeframeOptions = [
    "1-3 months",
    "3-6 months",
    "9+ months"
  ];

  const budgetOptions = [
   "$5,000+",
    "$10,000+",
    "$25,000+",
    "$50,000+",
    "$100,000+"
  ];
  useEffect(() => {
    fetchBuyerData();
  }, []);

  const handleServiceToggle = async (serviceId, currentStatus) => {
    setActionLoading(prev => ({ ...prev, serviceToggle: { ...prev.serviceToggle, [serviceId]: true } }));
    try {
      const email = localStorage.getItem('userEmail');
      await axios.patch(`${process.env.REACT_APP_BACKEND_URL}/lead/buyer/${email}/services/${serviceId}`, {
        isActive: !currentStatus
      });
      await fetchBuyerData();
    } catch (error) {
      console.error('Error toggling service:', error);
      setError('Error updating service status');
    } finally {
      setActionLoading(prev => ({ ...prev, serviceToggle: { ...prev.serviceToggle, [serviceId]: false } }));
    }
  };

  const handleEditClick = (service) => {
    setEditingService(service);
    setEditFormData({
      service: service.service,
      timeframe: service.timeframe,
      budget: service.budget,
      isActive: service.isActive !== false
    });
    setEditDialogOpen(true);
  };

  const handleEditDialogClose = () => {
    setEditDialogOpen(false);
    setEditingService(null);
    setEditFormData({
      service: '',
      timeframe: '',
      budget: '',
      isActive: true
    });
  };

  const handleAllServicesDialogOpen = () => {
    setServices(buyerData?.services || []);
    setAllServicesDialogOpen(true);
  };

  const handleAllServicesDialogClose = () => {
    setAllServicesDialogOpen(false);
    setServices([]);
    setNewService({
      service: '',
      timeframe: '',
      budget: '',
      isActive: true
    });
  };

  const handleAddService = () => {
    if (newService.service && newService.timeframe && newService.budget) {
      setServices([...services, { ...newService }]);
      setNewService({
        service: '',
        timeframe: '',
        budget: '',
        isActive: true
      });
    }
  };

  const handleRemoveService = (index) => {
    const updatedServices = services.filter((_, i) => i !== index);
    setServices(updatedServices);
  };
  const handleUpdateAllServices = async () => {
    setActionLoading(prev => ({ ...prev, updateAllServices: true }));
    try {
      const email = localStorage.getItem('userEmail');
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/buyer/services/email/${email}`, {
        services: services
      });
      await fetchBuyerData();
      handleAllServicesDialogClose();
    } catch (error) {
      console.error('Error updating services:', error);
      setError('Error updating services');
    } finally {
      setActionLoading(prev => ({ ...prev, updateAllServices: false }));
    }
  };
  

  const handleEditFormSubmit = async () => {
    setActionLoading(prev => ({ ...prev, editService: true }));
    try {
      const email = localStorage.getItem('userEmail');
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/buyer/services/email/${email}/${editingService._id}`, editFormData);
      await fetchBuyerData();
      handleEditDialogClose();
    } catch (error) {
      console.error('Error updating service:', error);
      setError('Error updating service');
    } finally {
      setActionLoading(prev => ({ ...prev, editService: false }));
    }
  };
  
  const fetchBuyerData = async () => {
    try {
      const email = localStorage.getItem('userEmail');
      if (!email) {
        setError('User email not found');
        return;
      }

      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/lead/buyer/${email}/matches`);
      setBuyerData(response.data.buyer);
      setMatchedVendors(response.data.matchedVendors);
    } catch (error) {
      console.error('Error fetching buyer data:', error);
      setError('Error fetching buyer data');
    } finally {
      setLoading(false);
    }
  };

  const filterVendors = (vendors) => {
    if (!vendors) return [];
    
    return vendors.filter(vendor => {
      if (!vendor || !vendor.vendor) return false;

      const matchesMonth = !filters.month || 
        new Date(vendor.vendor.createdAt).getMonth() === parseInt(filters.month);

      const matchesIndustry = !filters.industry || 
        vendor.vendor.selectedIndustries.includes(filters.industry);

      const matchesService = !filters.service || 
        vendor.vendor.selectedServices.includes(filters.service);

      return matchesMonth && matchesIndustry && matchesService;
    });
  };

  const exportToCSV = () => {
    const filteredVendors = filterVendors(matchedVendors);
    
    if (!filteredVendors || filteredVendors.length === 0) {
      setExportDialogOpen(true);
      return;
    }

    const csvData = filteredVendors.map(vendor => ({
      'Company Name': vendor.vendor.companyName,
      'Contact Person': `${vendor.vendor.firstName} ${vendor.vendor.lastName}`,
      'Email': vendor.vendor.email,
      'Phone': vendor.vendor.phone,
      'Industries': vendor.vendor.selectedIndustries.join(', '),
      'Services': vendor.vendor.selectedServices.join(', '),
      'Match Date': new Date(vendor.vendor.createdAt).toLocaleDateString()
    }));

    const headers = Object.keys(csvData[0]);
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${row[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `matched_vendors_${new Date().toLocaleDateString()}.csv`;
    link.click();
  };

  const FilterControls = () => (
    <Box sx={{ mb: 3, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={4}>
          <FormControl fullWidth>
            <InputLabel sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>Month</InputLabel>
            <Select
              value={filters.month}
              label="Month"
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
            options={Array.from(new Set(matchedVendors.flatMap(v => v.vendor.selectedIndustries)))}
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
            options={Array.from(new Set(matchedVendors.flatMap(v => v.vendor.selectedServices)))}
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

  if (loading) return (
    <Box sx={{ 
      display: 'flex', 
      justifyContent: 'center', 
      alignItems: 'center', 
      minHeight: '100vh' 
    }}>
      <CircularProgress sx={{ color: '#4998F8' }} />
    </Box>
  );
  if (error) return <Typography color="error">{error}</Typography>;
  if (!buyerData) return <Typography sx={{ color: '#fff' }}>No buyer data found</Typography>;

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={5}>
          <Card sx={{
            background: 'linear-gradient(to right bottom, #1a1a1a, #2d2d2d)',
            boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
            borderRadius: 2,
            height: '100%'
          }}>
            <CardContent>
              <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600, mb: 3 }}>
                Company Profile
              </Typography>
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
                    <Typography variant="h5" sx={{ fontWeight: 600, mb: 1 }}>{buyerData.companyName}</Typography>
                    <Typography variant="subtitle1">{`${buyerData.firstName} ${buyerData.lastName}`}</Typography>
                  </Box>
                </Box>
                <Box sx={{ 
                  p: 2, 
                  borderRadius: 2, 
                  bgcolor: 'rgba(255, 255, 255, 0.05)',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Typography sx={{ mb: 2 }}><strong>Email:</strong> {buyerData.email}</Typography>
                  <Typography sx={{ mb: 2 }}><strong>Website:</strong> {buyerData.companyWebsite}</Typography>
                  <Typography><strong>Company Size:</strong> {buyerData.companySize}</Typography>
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
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h5" gutterBottom sx={{ color: '#fff', fontWeight: 500 }}>
                  Industries & Services
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<EditIcon />}
                  onClick={handleAllServicesDialogOpen}
                  sx={{
                    borderRadius:10,
                    background: '#4998F8',
                    '&:hover': {
                      background: '#4998F8'
                    }
                  }}
                >
                  Edit All Services
                </Button>
              </Box>
              
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
                      {buyerData.industries.map((industry) => (
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
  <Box
    sx={{
      p: 2,
      borderRadius: 2,
      bgcolor: "rgba(255, 255, 255, 0.05)",
      height: "100%",
    }}
  >
    <Typography sx={{ color: "#fff", mb: 2, fontWeight: 500 }}>
      Required Services
    </Typography>
    <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
      {buyerData.services.map((service) => (
        <Box
          key={service._id || service.service}
          sx={{ display: "flex", alignItems: "center", mb: 1 }}
        >
          <Chip
            label={`${service.service}`}
            sx={{
              background:
                service.active === false
                  ? "rgba(255, 255, 255, 0.05)"
                  : "linear-gradient(45deg, rgba(33, 150, 243, 0.1) 0%, rgba(33, 203, 243, 0.1) 100%)",
              color:
                service.active === false
                  ? "rgba(255, 255, 255, 0.5)"
                  : "#fff",
              border:
                service.active === false
                  ? "1px solid rgba(255, 255, 255, 0.1)"
                  : "1px solid rgba(33, 150, 243, 0.3)",
              textDecoration: service.active === false ? "line-through" : "none",
              mr: 1,
            }}
          />
          <Switch
            size="small"
            checked={service.active !== false}
            onChange={() => handleServiceToggle(service._id, service.active)}
            disabled={actionLoading.serviceToggle[service._id]}
            sx={{
              "& .MuiSwitch-switchBase.Mui-checked": {
                color: theme.palette.primary.main,
              },
              "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track": {
                backgroundColor: theme.palette.primary.main,
              },
            }}
          />
          {actionLoading.serviceToggle[service._id] && (
            <CircularProgress size={20} sx={{ ml: 1 }} />
          )}
          <IconButton
            size="small"
            onClick={() => handleEditClick(service)}
            sx={{ color: "#fff", ml: 1 }}
          >
            <EditIcon fontSize="small" />
          </IconButton>
        </Box>
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
                <Typography variant="h4" sx={{ color: '#fff', fontWeight: 600 }}>
                  Matched Vendors
                </Typography>
                <Button
                  variant="contained"
                  startIcon={<FileDownloadIcon />}
                  onClick={exportToCSV}
                  sx={{
                    borderRadius:10,
                    background: '#4998F8',
                    color: 'white'
                  }}
                >
                  Export CSV
                </Button>
              </Box>
              <FilterControls />
              {filterVendors(matchedVendors).length === 0 ? (
                <EmptyState 
                  message={
                    matchedVendors.length === 0 
                      ? "You don't have any matched vendors yet. We'll notify you when we find suitable matches for your requirements."
                      : "No vendors match your current filter criteria. Try adjusting your filters."
                  }
                />
              ) : (
                <Grid container spacing={3}>
                  {filterVendors(matchedVendors).map((matchData) => (
                    <Grid item xs={12} md={6} lg={4} key={matchData.vendor._id}>
                      <Card sx={{
                        background: 'linear-gradient(to right bottom, rgba(26, 26, 26, 0.8), rgba(45, 45, 45, 0.8))',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.2)',
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
                              width: 60,
                              height: 60,
                              mr: 2
                            }}>
                              <BusinessIcon sx={{ fontSize: 30 }} />
                            </Avatar>
                            <Box>
                              <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
                                {matchData.vendor.companyName}
                              </Typography>
                              <Typography variant="subtitle2" sx={{ color: 'rgba(255, 255, 255, 0.7)' }}>
                                {`${matchData.vendor.firstName} ${matchData.vendor.lastName}`}
                              </Typography>
                            </Box>
                          </Box>

                          <Box sx={{ 
                            p: 2, 
                            borderRadius: 1,
                            bgcolor: 'rgba(255, 255, 255, 0.05)',
                            mb: 2
                          }}>
                            <Typography sx={{ color: '#fff', mb: 1 }}>
                              <strong>Email:</strong> {matchData.vendor.email}
                            </Typography>
                            <Typography sx={{ color: '#fff', mb: 1 }}>
                              <strong>Phone:</strong> {matchData.vendor.phone}
                            </Typography>
                          </Box>

                          <Box>
                            <Typography sx={{ color: '#fff', fontWeight: 500, mb: 1 }}>Match Reasons</Typography>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1 }}>
                              {matchData.matchReasons.map((reason, index) => (
                                <Chip
                                  key={index}
                                  label={reason}
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
                        </CardContent>
                      </Card>
                    </Grid>
                  ))}
                </Grid>
              )}
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={allServicesDialogOpen}
        onClose={handleAllServicesDialogClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            background: 'linear-gradient(to right bottom, #1a1a1a, #2d2d2d)',
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Manage All Services</DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Add New Service</Typography>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
   <TextField
                  select
                  fullWidth
                  label="Service"
                  value={newService.service}
                  onChange={(e) => setNewService({ ...newService, service: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                >
                  {serviceOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </Grid>
                            <Grid item xs={12} sm={3}>
                <TextField
                  select
                  fullWidth
                  label="Timeframe"
                  value={newService.timeframe}
                  onChange={(e) => setNewService({ ...newService, timeframe: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                >
                  {timeframeOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={3}>
                <TextField
                  select
                  fullWidth
                  label="Budget"
                  value={newService.budget}
                  onChange={(e) => setNewService({ ...newService, budget: e.target.value })}
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      color: '#fff',
                      '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                      '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }
                    },
                    '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
                  }}
                >
                  {budgetOptions.map((option) => (
                    <MenuItem key={option} value={option}>{option}</MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item xs={12} sm={2}>
                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddService}
                  sx={{
                    height: '56px',
                    borderRadius:10,
                    background: '#4998F8',
                    '&:hover': {
                      background: '#4998F8'
                    }
                  }}
                >
                  Add
                </Button>
              </Grid>
            </Grid>
          </Box>

          <Typography variant="h6" sx={{ color: '#fff', mb: 2 }}>Current Services</Typography>
          {services.map((service, index) => (
            <Box key={index} sx={{ mb: 2, p: 2, bgcolor: 'rgba(255, 255, 255, 0.05)', borderRadius: 1 }}>
              <Grid container spacing={2} alignItems="center">
                <Grid item xs={12} sm={4}>
                  <Typography sx={{ color: '#fff' }}>{service.service}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ color: '#fff' }}>{service.timeframe}</Typography>
                </Grid>
                <Grid item xs={12} sm={3}>
                  <Typography sx={{ color: '#fff' }}>{service.budget}</Typography>
                </Grid>
                <Grid item xs={12} sm={2}>
                  <IconButton
                    onClick={() => handleRemoveService(index)}
                    sx={{ color: '#ff1744' }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
          ))}
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleAllServicesDialogClose}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#fff' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleUpdateAllServices}
            variant="contained"
            disabled={actionLoading.updateAllServices}
            sx={{
              borderRadius: 10,
              background: '#4998F8',
              '&:hover': {
                background: '#4998F8'
              }
            }}
          >
            {actionLoading.updateAllServices ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save All Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editDialogOpen}
        onClose={handleEditDialogClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(to right bottom, #1a1a1a, #2d2d2d)',
            color: '#fff'
          }
        }}
      >
        <DialogTitle sx={{ color: '#fff' }}>Edit Service</DialogTitle>
                <DialogContent>
          <TextField
            select
            fullWidth
            label="Service"
            value={editFormData.service}
            onChange={(e) => setEditFormData({ ...editFormData, service: e.target.value })}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          >
            {serviceOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Timeframe"
            value={editFormData.timeframe}
            onChange={(e) => setEditFormData({ ...editFormData, timeframe: e.target.value })}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          >
            {timeframeOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
          <TextField
            select
            fullWidth
            label="Budget"
            value={editFormData.budget}
            onChange={(e) => setEditFormData({ ...editFormData, budget: e.target.value })}
            margin="normal"
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
                '&:hover fieldset': { borderColor: 'rgba(255, 255, 255, 0.5)' }
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          >
            {budgetOptions.map((option) => (
              <MenuItem key={option} value={option}>{option}</MenuItem>
            ))}
          </TextField>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button
            onClick={handleEditDialogClose}
            sx={{
              color: 'rgba(255, 255, 255, 0.7)',
              '&:hover': { color: '#fff' }
            }}
          >
            Cancel
          </Button>
          <Button
            onClick={handleEditFormSubmit}
            variant="contained"
            disabled={actionLoading.editService}
            sx={{
              borderRadius: 10,
              background: '#4998F8',
              '&:hover': {
                background: '#4998F8'
              }
            }}
          >
            {actionLoading.editService ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      <ExportDialog 
        open={exportDialogOpen} 
        onClose={() => setExportDialogOpen(false)} 
      />
    </Container>
  );
};

export default BuyerDashboard;
