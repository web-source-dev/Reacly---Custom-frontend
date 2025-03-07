import React, { useState, useEffect } from 'react';
import {
  Box,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  IconButton,
  Tooltip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  CircularProgress
} from '@mui/material';
import { 
  Check as CheckIcon, 
  Close as CloseIcon, 
  Edit as EditIcon,
  AssignmentLate as AssignmentLateIcon
} from '@mui/icons-material';
import axios from 'axios';

const EmptyState = () => {
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
      <AssignmentLateIcon sx={{ fontSize: 60, color: '#4998F8', mb: 2 }} />
      <Typography
        variant="h5"
        sx={{
          color: '#fff',
          mb: 1,
          fontWeight: 600,
          textAlign: 'center'
        }}
      >
        No Lead Requests
      </Typography>
      <Typography
        variant="body1"
        sx={{
          color: 'rgba(255, 255, 255, 0.7)',
          textAlign: 'center'
        }}
      >
        There are currently no lead requests to display.
      </Typography>
    </Box>
  );
};

const LeadsRequest = () => {
  const [leadRequests, setLeadRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [approveDialog, setApproveDialog] = useState(false);
  const [editDialog, setEditDialog] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [approvedLeads, setApprovedLeads] = useState('');
  const [editLeads, setEditLeads] = useState('');
  const [actionLoading, setActionLoading] = useState({
    approve: false,
    reject: {},
    edit: false
  });

  useEffect(() => {
    fetchLeadRequests();
  }, []);

  const fetchLeadRequests = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/leadRequest/all`);
      setLeadRequests(response.data);
      setLoading(false);
    } catch (error) {
      console.error('Error fetching lead requests:', error);
      setLoading(false);
    }
  };

  const handleOpenApproveDialog = (request) => {
    setSelectedRequest(request);
    setApprovedLeads(request.numberOfLeads.toString());
    setApproveDialog(true);
  };

  const handleOpenEditDialog = (request) => {
    setSelectedRequest(request);
    setEditLeads(request.numberOfLeads.toString());
    setEditDialog(true);
  };

  const handleCloseDialogs = () => {
    setApproveDialog(false);
    setEditDialog(false);
    setSelectedRequest(null);
    setApprovedLeads('');
    setEditLeads('');
  };

  const handleApproveRequest = async () => {
    setActionLoading(prev => ({ ...prev, approve: true }));
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/leadRequest/admin/${selectedRequest._id}`, {
        status: 'approved',
        approvedLeads: parseInt(approvedLeads)
      });
      await fetchLeadRequests();
      handleCloseDialogs();
    } catch (error) {
      console.error('Error approving lead request:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, approve: false }));
    }
  };

  const handleEditRequest = async () => {
    setActionLoading(prev => ({ ...prev, edit: true }));
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/leadRequest/admin/${selectedRequest._id}/edit`, {
        numberOfLeads: parseInt(editLeads)
      });
      await fetchLeadRequests();
      handleCloseDialogs();
    } catch (error) {
      console.error('Error editing lead request:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, edit: false }));
    }
  };

  const handleRejectRequest = async (requestId) => {
    setActionLoading(prev => ({ ...prev, reject: { ...prev.reject, [requestId]: true } }));
    try {
      await axios.put(`${process.env.REACT_APP_BACKEND_URL}/leadRequest/admin/${requestId}`, {
        status: 'rejected'
      });
      await fetchLeadRequests();
    } catch (error) {
      console.error('Error rejecting lead request:', error);
    } finally {
      setActionLoading(prev => ({ ...prev, reject: { ...prev.reject, [requestId]: false } }));
    }
  };

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      {leadRequests.length === 0 ? (
        <EmptyState />
      ) : (
        <TableContainer component={Paper} sx={{
          background: 'linear-gradient(135deg, rgba(0, 0, 0, 0.1), rgba(121, 121, 121, 0.05))',
          border: '1px solid rgba(25, 118, 210, 0.2)',
          borderRadius: 2,
        }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Company Name</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Contact Person</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Email</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Requested Leads</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Request Date</TableCell>
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Status</TableCell>
                {leadRequests.status === 'pending' && (
                <TableCell sx={{ color: '#fff', fontWeight: 'bold' }}>Actions</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {leadRequests.map((request) => (
                <TableRow key={request._id}>
                  <TableCell sx={{ color: '#fff' }}>{request.vendor?.companyName}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>
                    {`${request.vendor?.firstName} ${request.vendor?.lastName}`}
                  </TableCell>
                  <TableCell sx={{ color: '#fff' }}>{request.vendor?.email}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>{request.numberOfLeads}</TableCell>
                  <TableCell sx={{ color: '#fff' }}>
                    {new Date(request.requestDate).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={request.status}
                      color={
                        request.status === 'approved' ? 'success' :
                        request.status === 'rejected' ? 'error' :
                        'default'
                      }
                      sx={{ 
                        color: '#fff',
                        textTransform: 'capitalize'
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Box sx={{ display: 'flex', gap: 1 }}>
                      {request.status === 'pending' && (
                        <>
                          <Tooltip title="Approve">
                            <IconButton
                              size="small"
                              onClick={() => handleOpenApproveDialog(request)}
                              sx={{ color: '#4caf50' }}
                            >
                              <CheckIcon />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Reject">
                            <span>
                              <IconButton
                                size="small"
                                onClick={() => handleRejectRequest(request._id)}
                                disabled={actionLoading.reject[request._id]}
                                sx={{ color: '#f44336' }}
                              >
                                {actionLoading.reject[request._id] ? (
                                  <CircularProgress size={20} color="error" />
                                ) : (
                                  <CloseIcon />
                                )}
                              </IconButton>
                            </span>
                          </Tooltip>
                        </>
                      )}
                      {request.status === 'pending' && (
                      <Tooltip title="Edit Leads">
                        <IconButton
                          size="small"
                          onClick={() => handleOpenEditDialog(request)}
                          sx={{ color: '#4998F8' }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Approve Dialog */}
      <Dialog
        open={approveDialog}
        onClose={handleCloseDialogs}
        PaperProps={{
          sx: {
            background: '#1a1a1a',
            color: '#fff'
          }
        }}
      >
        <DialogTitle>Approve Lead Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Number of Leads to Approve"
            type="number"
            fullWidth
            value={approvedLeads}
            onChange={(e) => setApprovedLeads(e.target.value)}
            InputProps={{
              inputProps: { min: 1 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} sx={{ color: '#aaa' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleApproveRequest}
            variant="contained"
            disabled={actionLoading.approve}
            sx={{
              backgroundColor: '#4998F8',
              color: '#fff',
              borderRadius: 10,
              '&:hover': {
                backgroundColor: '#3d7ac7'
              }
            }}
          >
            {actionLoading.approve ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Approve'
            )}
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog
        open={editDialog}
        onClose={handleCloseDialogs}
        PaperProps={{
          sx: {
            background: '#1a1a1a',
            color: '#fff'
          }
        }}
      >
        <DialogTitle>Edit Lead Request</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            label="Number of Leads"
            type="number"
            fullWidth
            value={editLeads}
            onChange={(e) => setEditLeads(e.target.value)}
            InputProps={{
              inputProps: { min: 1 }
            }}
            sx={{
              '& .MuiOutlinedInput-root': {
                color: '#fff',
                '& fieldset': { borderColor: 'rgba(255, 255, 255, 0.23)' },
              },
              '& .MuiInputLabel-root': { color: 'rgba(255, 255, 255, 0.7)' }
            }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialogs} sx={{ color: '#aaa' }}>
            Cancel
          </Button>
          <Button 
            onClick={handleEditRequest}
            variant="contained"
            disabled={actionLoading.edit}
            sx={{
              backgroundColor: '#4998F8',
              color: '#fff',
              borderRadius: 10,
              '&:hover': {
                backgroundColor: '#3d7ac7'
              }
            }}
          >
            {actionLoading.edit ? (
              <CircularProgress size={24} color="inherit" />
            ) : (
              'Save Changes'
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default LeadsRequest;
