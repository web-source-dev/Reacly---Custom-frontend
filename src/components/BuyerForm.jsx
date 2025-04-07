import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  TextField,
  Button,
  IconButton,
  Box,
  Grid,
  Chip,
  FormControl,
  Checkbox,
  ListItemText,
  Tooltip,
  InputLabel,
  Paper,
  InputAdornment,
  Alert
} from '@mui/material';
import {
  AddCircleOutline,
  RemoveCircleOutline,
  Add as AddIcon,
  Close as CloseIcon,
  Business,
  Person,
  Email,
  Language,
  People,
  Category,
  Description
} from '@mui/icons-material';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

const industryOptions = [
  { name: "Information Technology (IT)", icon: <AddIcon /> },
  { name: "Financial Services", icon: <AddIcon /> },
  { name: "Healthcare", icon: <AddIcon /> },
  { name: "Education (EdTech)", icon: <AddIcon /> },
  { name: "Retail & E-commerce", icon: <AddIcon /> },
  { name: "Marketing & Advertising", icon: <AddIcon /> },
  { name: "Human Resources (HRTech)", icon: <AddIcon /> },
  { name: "Manufacturing & Supply Chain", icon: <AddIcon /> },
  { name: "Real Estate", icon: <AddIcon /> },
  { name: "Professional Services", icon: <AddIcon /> },   
];

const servicesBuyer = [
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

const BuyerForm = () => {
  const { email } = useParams();
  const [isEdit, setIsEdit] = useState(false); // New state to track edit mode


  const [formData, setFormData] = useState({
    companyName: '',
    firstName: '',
    lastName: '',
    email: '',
    companyWebsite: '',
    companySize: '',
    industries: [],
    additionalInfo: '',
    services: [{ service: '', timeframe: '', budget: '' }]
  });
  console.log(formData);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (email) {
      setIsEdit(true); // Set edit mode if email is present
      // Fetch buyer data by email
      const result = axios.get(`${process.env.REACT_APP_BACKEND_URL}/lead/buyer/${email}`)
        .then(response => {
          setFormData(response.data);
          console.log(result)
        })

        .catch(error => {
          console.error("Error fetching buyer data:", error);
        });
    }
  }, [email]);

  const handleAddService = () => {
    setFormData({
      ...formData,
      services: [...formData.services, { service: '', timeframe: '', budget: '' }]
    });
  };

  const handleRemoveService = (index) => {
    const updatedServices = formData.services.filter((_, i) => i !== index);
    setFormData({ ...formData, services: updatedServices });
  };

  const handleServiceChange = (index, field, value) => {
    const updatedServices = [...formData.services];
    updatedServices[index][field] = value;
    setFormData({ ...formData, services: updatedServices });
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleBlur = (event) => {
    const { name, value } = event.target;
    let error = "";
    if (name === "email") {
      const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailPattern.test(value)) {
        error = "Please enter a valid email address.";
      }
    } else if (name === "companyWebsite" && value) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-])\/?$/;
      if (!urlPattern.test(value)) {
        error = "Please enter a valid website URL.";
      }
    }
    setErrors({ ...errors, [name]: error });
  };
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-])\/?$/;

    if (!formData.companyName || !formData.firstName || !formData.lastName || !formData.email || !formData.companySize || formData.industries.length === 0 || formData.services.some(service => !service.service || !service.timeframe || !service.budget)) {
      setError("Please fill in all fields");
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
    if (!emailPattern.test(formData.email)) {
      setError('Please enter a valid email address');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
    if (formData.companyWebsite && !urlPattern.test(formData.companyWebsite)) {
      setError('Please enter a valid website URL');
      setTimeout(() => {
        setError('');
      }, 3000);
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      try {
        let response;
        if (email) {
          // Update existing buyer
          response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/updateBuyer/${email}`, formData);
          setSuccess('Solutions updated successfully.');
        } else {
          // Create new buyer
          response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lead/buyer`, formData);
          setSuccess('Request submitted. Please check your email for further instructions.');
        }
        if (response.status >= 200 && response.status < 300) {
          setTimeout(() => {
            setSuccess('');
            window.top.location.href = "https://www.reachly.ca/buyer-portal";
          }, 3000);
          console.log("Form submitted successfully:", response.data);
          setFormData({
            companyName: '',
            firstName: '',
            lastName: '',
            email: '',
            companyWebsite: '',
            companySize: '',
            industries: [],
            additionalInfo: '',
            services: [{ service: '', timeframe: '', budget: '' }]
          });
        } else {
          setError(response.message);
          setTimeout(() => {
            setError('');
          }, 3000);
        }
      } catch (error) {
        console.error("Error submitting form:", error);
        setError(email ? 'Error updating buyer data' : 'Email already exists or invalid attempt.');
        setTimeout(() => {
          setError('');
        }, 3000);      
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  return (
    <Container
  maxWidth={false} // Disable default maxWidth to use custom styles
  sx={{
    width: { xs: '100%', md: '700px' }, // 100% width on mobile, 500px on medium+ screens
    maxWidth: '100%', // Ensures it doesn’t exceed the screen width
    padding: { xs: '0px', md: '20px' },
  }}
>

      <Paper
        elevation={6}
        sx={{
          mt: 4,
          mb: 4,
          p: 4,
          backgroundColor: 'var(--background-color)',
          borderRadius: 3,
          transition: 'transform 0.2s ease-in-out',
          '&:hover': {
            transform: 'scale(1.01)',
          },
        }}
      >
        <Typography
          variant="h4"
          sx={{
            color: 'var(--text-color)',
            fontWeight: 600,
            mb: 2,
            background: 'linear-gradient(45deg, #4998F8 30%, #3878c8 90%)',
            backgroundClip: 'text',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}
        >
          {isEdit ? 'Update Solutions' : 'Solutions Form'}
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'var(--text-color)',
            mb: 4,
            opacity: 0.8
          }}
        >
          {isEdit ? "Update your solutions requirements." : "Submit your solutions requirements."}
        </Typography>

        <Box component="form" onSubmit={handleSubmit}>
          {!isEdit && (
            <>
              <TextField
                fullWidth
                label="Company Name"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                onBlur={handleBlur}
                margin="normal"
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Business sx={{ color: 'var(--text-color)' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 2,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'var(--border-color)',
                      transition: 'border-color 0.2s ease-in-out',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4998F8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4998F8',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: 'var(--text-color)',
                  },
                  '& .MuiOutlinedInput-input': {
                    color: 'var(--text-color)',
                  },
                }}
              />

              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'var(--text-color)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'var(--border-color)',
                          transition: 'border-color 0.2s ease-in-out',
                        },
                        '&:hover fieldset': {
                          borderColor: '#4998F8',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4998F8',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--text-color)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'var(--text-color)',
                      },
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    fullWidth
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                    required
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">
                          <Person sx={{ color: 'var(--text-color)' }} />
                        </InputAdornment>
                      ),
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 2,
                        backgroundColor: 'rgba(255, 255, 255, 0.05)',
                        '& fieldset': {
                          borderColor: 'var(--border-color)',
                          transition: 'border-color 0.2s ease-in-out',
                        },
                        '&:hover fieldset': {
                          borderColor: '#4998F8',
                        },
                        '&.Mui-focused fieldset': {
                          borderColor: '#4998F8',
                          borderWidth: '2px',
                        },
                      },
                      '& .MuiInputLabel-root': {
                        color: 'var(--text-color)',
                      },
                      '& .MuiOutlinedInput-input': {
                        color: 'var(--text-color)',
                      },
                    }}
                  />
                </Grid>
              </Grid>

              <TextField
                fullWidth
                label="Email Address"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                required
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Email sx={{ color: '#fff' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mt: 3,
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      transition: 'border-color 0.2s ease-in-out',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4998F8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4998F8',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#fff',
                    '&.Mui-focused': {
                      color: '#4998F8',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#fff',
                  },
                }}
              />

              <TextField
                fullWidth
                label="Company Website"
                name="companyWebsite"
                value={formData.companyWebsite}
                onChange={handleChange}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Language sx={{ color: '#fff' }} />
                    </InputAdornment>
                  ),
                }}
                sx={{
                  mb: 3,
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    backgroundColor: 'rgba(255, 255, 255, 0.05)',
                    '& fieldset': {
                      borderColor: 'rgba(255, 255, 255, 0.3)',
                      transition: 'border-color 0.2s ease-in-out',
                    },
                    '&:hover fieldset': {
                      borderColor: '#4998F8',
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: '#4998F8',
                      borderWidth: '2px',
                    },
                  },
                  '& .MuiInputLabel-root': {
                    color: '#fff',
                    '&.Mui-focused': {
                      color: '#4998F8',
                    },
                  },
                  '& .MuiOutlinedInput-input': {
                    color: '#fff',
                  },
                }}
              />
<FormControl fullWidth>
  <TextField
    select
    label="Company Size"
    name="companySize"
    value={formData.companySize}
    onChange={handleChange}
    required
    InputProps={{
      startAdornment: (
        <InputAdornment position="start">
          <People sx={{ color: 'var(--text-color)' }} />
        </InputAdornment>
      ),
    }}
    SelectProps={{
      native: true,
      MenuProps: {
        PaperProps: {
          sx: {
            backgroundColor: 'rgb(0, 0, 0)', // Background color for options
            '& .MuiMenuItem-root': {
              color: '#000', // Text color
            },
          },
        },
      },
    }}
    sx={{
      mb: 3,
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          transition: 'border-color 0.2s ease-in-out',
        },
        '&:hover fieldset': {
          borderColor: '#4998F8',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#4998F8',
          borderWidth: '2px',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'var(--text-color)',
        '&.Mui-focused': {
          color: '#4998F8',
        },
      },
      '& .MuiOutlinedInput-input': {
        color: 'rgb(141, 141, 141)',
      },
      '& .MuiSelect-select': {
        color:'#000',
      },
      '& .MuiMenuItem-root': {
        color: '#000',
      },
    }}
  >
    <option value="">Select company size</option>
    {["1-50", "51-500", "501-5000", "5,000+"].map((size) => (
      <option key={size} value={size}>{size}</option>
    ))}
  </TextField>
</FormControl>

              <FormControl fullWidth>
                <TextField
                  select
                  label="Industry"
                  name="industries"
                  value={formData.industries[0] || ''}
                  onChange={(event) => {
                    setFormData((prevState) => ({
                      ...prevState,
                      industries: [event.target.value]
                    }));
                  }}
                  required
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <Category sx={{ color: 'var(--text-color)' }} />
                      </InputAdornment>
                    ),
                  }}
      SelectProps={{
      native: true,
      MenuProps: {
        PaperProps: {
          sx: {
            backgroundColor: 'rgb(0, 0, 0)', // Background color for options
            '& .MuiMenuItem-root': {
              color: '#000', // Text color
            },
          },
        },
      },
    }}
    sx={{
      mb: 3,
      '& .MuiOutlinedInput-root': {
        borderRadius: 2,
        backgroundColor: 'rgba(255, 255, 255, 0.05)',
        '& fieldset': {
          borderColor: 'rgba(255, 255, 255, 0.3)',
          transition: 'border-color 0.2s ease-in-out',
        },
        '&:hover fieldset': {
          borderColor: '#4998F8',
        },
        '&.Mui-focused fieldset': {
          borderColor: '#4998F8',
          borderWidth: '2px',
        },
      },
      '& .MuiInputLabel-root': {
        color: 'var(--text-color)',
        '&.Mui-focused': {
          color: '#4998F8',
        },
      },
      '& .MuiOutlinedInput-input': {
        color: 'rgb(141, 141, 141)',
      },
      '& .MuiSelect-select': {
        color:'#000',
      },
      '& .MuiMenuItem-root': {
        color: '#000',
      },
    }}
                >
                  <option value="">Select industry</option>
                  {industryOptions.map((option) => (
                    <option key={option.name} value={option.name}>{option.name}</option>
                  ))}
                </TextField>
              </FormControl>
            </>
          )}

          <Typography
            variant="h6"
            sx={{
              color: 'var(--text-color)',
              mb: 2,
              fontWeight: 600
            }}
          >
            Solutions Required
          </Typography>

          {formData.services.map((service, index) => (
            <Paper
              key={index}
              elevation={2}
              sx={{
                p: 3,
                mb: 2,
                backgroundColor: 'rgba(255, 255, 255, 0.05)',
                borderRadius: 2,
                position: 'relative',
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="subtitle1" sx={{ color: 'var(--text-color)', fontWeight: 500 }}>
                  Solution {index + 1}
                </Typography>
                <IconButton
                  onClick={() => handleRemoveService(index)}
                  sx={{
                    color: 'var(--text-color)',
                    '&:hover': {
                      color: '#ff4444',
                    },
                  }}
                >
                  <RemoveCircleOutline />
                </IconButton>
              </Box>

              <Grid container spacing={2}>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      label="Service"
                      value={service.service}
                      onChange={(e) => handleServiceChange(index, 'service', e.target.value)}
                      required
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': {
                            borderColor: 'var(--border-color)',
                            transition: 'border-color 0.2s ease-in-out',
                          },
                          '&:hover fieldset': {
                            borderColor: '#4998F8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4998F8',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-color)',
                        },
                        '& .MuiSelect-select': {
                          color: 'var(--text-color)',
                        },
                      }}
                    >
                      <option value=""></option>
                      {servicesBuyer.map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      label="Timeframe"
                      value={service.timeframe}
                      onChange={(e) => handleServiceChange(index, 'timeframe', e.target.value)}
                      required
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': {
                            borderColor: 'var(--border-color)',
                            transition: 'border-color 0.2s ease-in-out',
                          },
                          '&:hover fieldset': {
                            borderColor: '#4998F8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4998F8',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-color)',
                        },
                        '& .MuiSelect-select': {
                          color: 'var(--text-color)',
                        },
                      }}
                    >
                      <option value=""></option>
                      {["1-3 months", "3-6 months", "9+ months"].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={4}>
                  <FormControl fullWidth>
                    <TextField
                      select
                      label="Budget"
                      value={service.budget}
                      onChange={(e) => handleServiceChange(index, 'budget', e.target.value)}
                      required
                      SelectProps={{
                        native: true,
                      }}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: 2,
                          backgroundColor: 'rgba(255, 255, 255, 0.05)',
                          '& fieldset': {
                            borderColor: 'var(--border-color)',
                            transition: 'border-color 0.2s ease-in-out',
                          },
                          '&:hover fieldset': {
                            borderColor: '#4998F8',
                          },
                          '&.Mui-focused fieldset': {
                            borderColor: '#4998F8',
                            borderWidth: '2px',
                          },
                        },
                        '& .MuiInputLabel-root': {
                          color: 'var(--text-color)',
                        },
                        '& .MuiSelect-select': {
                          color: 'var(--text-color)',
                        },
                      }}
                    >
                      <option value=""></option>
                      {["$5,000+", "$10,000+", "$25,000+", "$50,000+", "$100,000+"].map((option) => (
                        <option key={option} value={option}>{option}</option>
                      ))}
                    </TextField>
                  </FormControl>
                </Grid>
              </Grid>
            </Paper>
          ))}

          <Button
            onClick={handleAddService}
            startIcon={<AddCircleOutline />}
            sx={{
              mt: 2,
              mb: 4,
              color: 'var(--text-color)',
              borderColor: 'var(--border-color)',
              backgroundColor: 'rgba(255, 255, 255, 0.05)',
              borderRadius: 2,
              p: 1.5,
              width: '100%',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                backgroundColor: 'rgba(73, 152, 248, 0.1)',
                borderColor: '#4998F8',
              },
            }}
          >
            Add Another Service
          </Button>

          {!isEdit && (
            <TextField
              fullWidth
              label="Additional Information"
              name="additionalInfo"
              value={formData.additionalInfo}
              onChange={handleChange}
              multiline
              rows={4}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start" sx={{ alignSelf: 'flex-start', mt: 1.5 }}>
                    <Description sx={{ color: 'var(--text-color)' }} />
                  </InputAdornment>
                ),
              }}
              sx={{
                mb: 4,
                '& .MuiOutlinedInput-root': {
                  borderRadius: 2,
                  backgroundColor: 'rgba(255, 255, 255, 0.05)',
                  '& fieldset': {
                    borderColor: 'var(--border-color)',
                    transition: 'border-color 0.2s ease-in-out',
                  },
                  '&:hover fieldset': {
                    borderColor: '#4998F8',
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: '#4998F8',
                    borderWidth: '2px',
                  },
                },
                '& .MuiInputLabel-root': {
                  color: 'var(--text-color)',
                },
                '& .MuiOutlinedInput-input': {
                  color: 'var(--text-color)',
                },
              }}
            />
          )}

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              py: 1.5,
              borderRadius: 2,
              fontSize: '1rem',
              fontWeight: 600,
              textTransform: 'none',
              background: 'linear-gradient(45deg, #4998F8 30%, #3878c8 90%)',
              boxShadow: '0 3px 5px 2px rgba(73, 152, 248, .3)',
              transition: 'all 0.2s ease-in-out',
              '&:hover': {
                transform: 'translateY(-2px)',
                boxShadow: '0 6px 10px 4px rgba(73, 152, 248, .3)',
              },
              '&:disabled': {
                background: 'linear-gradient(45deg, #4998F8c3 30%, #3878c8c3 90%)',
              }
            }}
          >
            {loading ? "Submitting..." : isEdit ? "Update Solutions" : "Submit Request"}
          </Button>
        </Box>
        
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              width: '96%', 
              mt: 2,
              borderRadius: 2,
            }}
          >
            {error}
          </Alert>
        )}

        {success && (
          <Alert 
            severity="success" 
            sx={{ 
              width: '96%', 
              mt: 2,
              borderRadius: 2,
            }}
          >
            {success}
          </Alert>
        )}
      </Paper>
    </Container>
  );
};

export default BuyerForm;
