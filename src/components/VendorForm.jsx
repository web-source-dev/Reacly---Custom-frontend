import React, { useState, useEffect } from "react";
import {
  Container,
  Typography,
  TextField,
  Button,
  Select,
  MenuItem,
  Chip,
  InputLabel,
  FormControl,
  OutlinedInput,
  Box,
  Checkbox,
  FormControlLabel,
  Paper,
  InputAdornment,
  Alert,
  Grid
} from "@mui/material";
import {
  Business,
  Person,
  Email,
  Phone,
  Language,
  AttachMoney,
  Category,
  Description,
  Add as AddIcon,
  Close as CloseIcon
} from '@mui/icons-material';
import axios from "axios"; // Import axios for HTTP requests
import { ToastContainer, toast } from "react-toastify";
import 'react-toastify/dist/ReactToastify.css';
import { useParams } from "react-router-dom";

const industries = [
  "Information Technology (IT)",
   "Financial Services",
    "Healthcare",
     "Education (EdTech)",
      "Retail & E-commerce",
      "Marketing & Advertising",
      "Human Resources (HRTech)",
      "Manufacturing & Supply Chain",
      "Real Estate",
      "Professional Services"
    ];
const services = [
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

export default function VendorRegistration() {
  const { email } = useParams(); // Get email from URL parameters

  const [formData, setFormData] = React.useState({
    companyName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    companyWebsite: "",
    minimumBudget: "",
    selectedIndustries: [],
    selectedServices: [],
    additionalInfo: "",
    agreeToTerms: false,
  });
  console.log(formData);
  const [errors, setErrors] = React.useState({});
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (email) {
      // Fetch vendor data by email
      axios.get(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor/${email}`)
        .then(response => {
          setFormData(response.data);
        })
        .catch(error => {
          console.error("Error fetching vendor data:", error);
        });
    }
  }, [email]);

  const handleIndustryChange = (event) => {
    setFormData({ ...formData, selectedIndustries: event.target.value });
  };

  const handleServicesChange = (event) => {
    setFormData({ ...formData, selectedServices: event.target.value });
  };

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
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
    } else if (name === "phone") {
      const phonePattern = /^[0-9]+$/;
      if (!phonePattern.test(value)) {
        error = "Please enter a valid phone number.";
      }
    } else if (name === "companyWebsite" && value) {
      const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-])\/?$/;
      if (!urlPattern.test(value)) {
        error = "Please enter a valid website URL.";
      }
    }
    setErrors({ ...errors, [name]: error });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    setFormData({ ...formData, [name]: checked });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const urlPattern = /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w .-])\/?$/;
    const phonePattern = /^[0-9]+$/;

    if (!formData.companyName || !formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.minimumBudget || formData.selectedIndustries.length === 0 || formData.selectedServices.length === 0) {
      setError("Please fill in all fields");
      setTimeout(() => {
        setError("")
      }, 3000);
      return;
    }
    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      setTimeout(() => {
        setError("")
      }, 3000);
      return;
    }
    if (!emailPattern.test(formData.email)) {
      toast.error("Please enter a valid email address.");
      return;
    }
    if (!phonePattern.test(formData.phone)) {
      toast.error("Please enter a valid phone number.");
      return;
    }
    if (formData.companyWebsite && !urlPattern.test(formData.companyWebsite)) {
      toast.error("Please enter a valid website URL.");
      return;
    }
    setLoading(true);
    setTimeout(async () => {
      try {
        let response;
        if (email) {
          // Update existing vendor
          response = await axios.put(`${process.env.REACT_APP_BACKEND_URL}/lead/updateVendor/${email}`, formData);
          setSuccess("Vendor data updated successfully. Please check your email for further instructions.");
        } else {
          // Create new vendor
          response = await axios.post(`${process.env.REACT_APP_BACKEND_URL}/lead/vendor`, formData);
          setSuccess("Request submitted. Please check your email for further instructions.");
        }
      
        // Check if the response status is success (HTTP status code 200-299)
        if (response.status >= 200 && response.status < 300) {
          setTimeout(() => {
            setSuccess("");
          window.top.location.href = "https://www.reachly.ca/";
          }, 3000);
      
          console.log("Form submitted successfully:", response.data);
      
          // Reset the form data only if the submission was successful
          setFormData({
            companyName: "",
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            companyWebsite: "",
            minimumBudget: "",
            selectedIndustries: [],
            selectedServices: [],
            additionalInfo: "",
            agreeToTerms: false,
          });
        } else {
          // Handle if response status is not 2xx (something went wrong)
          setError(response.message);
          setTimeout(() => {
            setError("");
          }, 3000);
        }
      } catch (error) {
        // Handle errors (network issues, server errors, etc.)
        console.error("Error submitting form:", error);
        setError(email ? 'Error updating vendor data' : 'Email already exists or invalid attempt');
        setTimeout(() => {
          setError("");
        }, 3000);      
        console.error("Error submitting form:", error);
      } finally {
        setLoading(false);
      }
    }, 2000);
  };

  const toggleSelection = (type, value) => {
    setFormData((prevState) => {
      const selectedItems = prevState[type].includes(value)
        ? prevState[type].filter((item) => item !== value)
        : [...prevState[type], value];
      return { ...prevState, [type]: selectedItems };
    });
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
          Vendor Registration
        </Typography>
        <Typography
          variant="subtitle1"
          sx={{
            color: 'var(--text-color)',
            mb: 4,
            opacity: 0.8
          }}
        >
          Register your company as a service provider
        </Typography>


        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Company Name"
            name="companyName"
            value={formData.companyName}
            onChange={handleChange}
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
            label="Phone Number"
            name="phone"
            type="tel"
            value={formData.phone}
            onChange={handleChange}
            required
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Phone sx={{ color: '#fff' }} />
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

          <FormControl fullWidth sx={{ mb: 3 }}>
            <TextField
              select
              label="Minimum Budget"
              name="minimumBudget"
              value={formData.minimumBudget}
              onChange={handleChange}
              required
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <AttachMoney sx={{ color: '#fff' }} />
                  </InputAdornment>
                ),
              }}
              SelectProps={{
                native: true,
              }}
              sx={{
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
                  '& .MuiOutlinedInput-input': {
                    color: 'rgb(141, 141, 141)',
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
                '& .MuiSelect-select': {
                  color: 'rgb(141, 141, 141)',
                },
                '& .MuiSelect-icon': {
                  color: '#fff',
                },
              }}
            >
              <option value="">Select minimum budget</option>
              {["$5,000+", "$10,000+", "$25,000+", "$50,000+", "$100,000+"].map((budget) => (
                <option key={budget} value={budget}>{budget}</option>
              ))}
            </TextField>
          </FormControl>

          <Box>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              Industries
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap',mt: 1, gap: 0.7 }}>
              {industries.map((industry) => (
                <Chip
                  key={industry}
                  label={industry}
                  onClick={() => toggleSelection('selectedIndustries', industry)}
                  icon={formData.selectedIndustries.includes(industry) ? <CloseIcon /> : <AddIcon />}
                  sx={{
                    backgroundColor: formData.selectedIndustries.includes(industry) 
                      ? 'rgba(73, 152, 248, 0.2)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    border: '1px solid',
                    borderColor: formData.selectedIndustries.includes(industry) 
                      ? '#4998F8' 
                      : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(73, 152, 248, 0.1)',
                      borderColor: '#4998F8',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

          <Box mt={2} mb={2}>
            <Typography variant="h6" sx={{ color: '#fff', fontWeight: 600 }}>
              Services
            </Typography>
            <Box sx={{ display: 'flex', flexWrap: 'wrap',mt: 1, gap: 0.7 }}>
              {services.map((service) => (
                <Chip
                  key={service}
                  label={service}
                  onClick={() => toggleSelection('selectedServices', service)}
                  icon={formData.selectedServices.includes(service) ? <CloseIcon /> : <AddIcon />}
                  sx={{
                    backgroundColor: formData.selectedServices.includes(service) 
                      ? 'rgba(73, 152, 248, 0.2)' 
                      : 'rgba(255, 255, 255, 0.05)',
                    color: '#fff',
                    border: '1px solid',
                    borderColor: formData.selectedServices.includes(service) 
                      ? '#4998F8' 
                      : 'rgba(255, 255, 255, 0.3)',
                    borderRadius: 2,
                    transition: 'all 0.2s ease-in-out',
                    '&:hover': {
                      backgroundColor: 'rgba(73, 152, 248, 0.1)',
                      borderColor: '#4998F8',
                    },
                  }}
                />
              ))}
            </Box>
          </Box>

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
                  <Description sx={{ color: '#fff' }} />
                </InputAdornment>
              ),
            }}
            sx={{
              mt: 2,
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

          <FormControlLabel
            control={
              <Checkbox
                checked={formData.agreeToTerms}
                onChange={handleCheckboxChange}
                name="agreeToTerms"
                sx={{
                  color: 'var(--text-color)',
                  '&.Mui-checked': {
                    color: '#4998F8',
                  },
                }}
              />
            }
            label={
              <Typography sx={{ color: 'var(--text-color)' }}>
                I agree to the terms and conditions
              </Typography>
            }
            sx={{ mt: 2 }}
          />

          <Typography
            variant="body2"
            sx={{
              color: 'var(--text-color)',
              opacity: 0.8,
              mt: 1,
              '& a': {
                color: '#4998F8',
                textDecoration: 'none',
                '&:hover': {
                  textDecoration: 'underline',
                },
              },
            }}
          >
            By checking this box, you agree to our{" "}
            <a href="https://www.reachly.ca/terms-and-conditions" target="_blank">
              terms and conditions
            </a>
            .
          </Typography>

          <Button
            type="submit"
            fullWidth
            variant="contained"
            disabled={loading}
            sx={{
              mt: 4,
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
            {loading ? "Submitting..." : "Register"}
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
}
