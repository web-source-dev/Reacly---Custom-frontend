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
  InputLabel
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import RemoveCircleOutlineIcon from '@mui/icons-material/RemoveCircleOutline';
import axios from 'axios';
import 'react-toastify/dist/ReactToastify.css';
import AddIcon from '@mui/icons-material/Add';
import CloseIcon from '@mui/icons-material/Close';
import { useParams } from "react-router-dom";

const industryOptions = [
  { name: "Retail & E-commerce", icon: <AddIcon /> },
  { name: "Marketing & Advertising", icon: <AddIcon /> },
  { name: "Human Resources (HRTech)", icon: <AddIcon /> },
  { name: "Manufacturing & Supply Chain", icon: <AddIcon /> },
  { name: "Real Estate", icon: <AddIcon /> },
  { name: "Professional Services", icon: <AddIcon /> },
  { name: "Insurance & Financial Services", icon: <AddIcon /> },
  { name: "Telecommunications & IT Services", icon: <AddIcon /> },
  { name: "Consumer Goods & Services", icon: <AddIcon /> },
  { name: "Energy & Utilities", icon: <AddIcon /> },
  { name: "Media & Entertainment", icon: <AddIcon /> },
  { name: "Agriculture & Forestry", icon: <AddIcon /> },
  { name: "Information Technology (IT)", icon: <AddIcon /> },
  { name: "Financial Services", icon: <AddIcon /> },
  { name: "Healthcare", icon: <AddIcon /> },
  { name: "Education (EdTech)", icon: <AddIcon /> }
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
            window.top.location.href = "https://www.reachly.ca/buyer-dashboard";
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
      maxWidth="sm"
      sx={{
        mt: 0,
        p: 1,
        backgroundColor: "var(--background-color)",
        color: "var(--text-color)",
        border: "1px solid var(--border-color)",
        borderRadius: 4,
        boxShadow: 3,
      }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ color: "var(--text-color)", mb: 1, fontWeight: 'bold' }}
      >
        {isEdit ? 'Update Solutions' : 'Solutions Form'}
      </Typography>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ color: "var(--text-color)", mb: 1 }}
      >
        {isEdit ? "Update your solutions requirements." : "Submit your solutions requirements."}
      </Typography>

      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{ mt: 1 }}
        onSubmit={handleSubmit}
      >
        {!isEdit && (
          <>
            <TextField
              fullWidth
              label="Company Name"
              name="companyName"
              value={formData.companyName}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your company name"
              margin="normal"
              variant="outlined"
              error={!!errors.companyName}
              helperText={errors.companyName}
              autoComplete="organization"
              InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
              InputProps={{
                style: {
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  height: 50,
                  borderRadius: 12,
                  fontSize: '14px',
                  WebkitBoxShadow: '0 0 0 1000px var(--background-color) inset',
                  WebkitTextFillColor: 'var(--text-color)',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
              }}
            />
            <Box sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, gap: 1 }}>
              <TextField
                fullWidth
                label="First Name"
                name="firstName"
                value={formData.firstName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your first name"
                margin="dense"
                variant="outlined"
                error={!!errors.firstName}
                helperText={errors.firstName}
                autoComplete="given-name"
                InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
                InputProps={{
                  style: {
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                    height: 50,
                    borderRadius: 12,
                    fontSize: '14px',
                    WebkitBoxShadow: '0 0 0 1000px var(--background-color) inset',
                    WebkitTextFillColor: 'var(--text-color)',
                    transition: 'background-color 5000s ease-in-out 0s'
                  },
                }}
              />
              <TextField
                fullWidth
                label="Last Name"
                name="lastName"
                value={formData.lastName}
                onChange={handleChange}
                onBlur={handleBlur}
                placeholder="Enter your last name"
                margin="dense"
                variant="outlined"
                error={!!errors.lastName}
                helperText={errors.lastName}
                autoComplete="family-name"
                InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
                InputProps={{
                  style: {
                    color: "var(--text-color)",
                    border: "1px solid var(--border-color)",
                    height: 50,
                    borderRadius: 12,
                    fontSize: '14px',
                    WebkitBoxShadow: '0 0 0 1000px var(--background-color) inset',
                    WebkitTextFillColor: 'var(--text-color)',
                    transition: 'background-color 5000s ease-in-out 0s'
                  },
                }}
              />
            </Box>
            <TextField
              fullWidth
              label="Email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Enter your email address"
              type="email"
              margin="normal"
              variant="outlined"
              error={!!errors.email}
              helperText={errors.email}
              autoComplete="email"
              InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
              InputProps={{
                style: {
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  height: 50,
                  borderRadius: 12,
                  fontSize: '14px',
                  WebkitBoxShadow: '0 0 0 1000px var(--background-color) inset',
                  WebkitTextFillColor: 'var(--text-color)',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
              }}
            />
            <TextField
              fullWidth
              label="Company Website"
              name="companyWebsite"
              value={formData.companyWebsite}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="https://example.com"
              margin="normal"
              variant="outlined"
              error={!!errors.companyWebsite}
              helperText={errors.companyWebsite}
              autoComplete="url"
              InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
              InputProps={{
                style: {
                  color: "var(--text-color)",
                  border: "1px solid var(--border-color)",
                  height: 50,
                  borderRadius: 12,
                  fontSize: '14px',
                  WebkitBoxShadow: '0 0 0 1000px var(--background-color) inset',
                  WebkitTextFillColor: 'var(--text-color)',
                  transition: 'background-color 5000s ease-in-out 0s'
                },
              }}
            />
            <Box>
              <select
                id="companySize"
                name="companySize"
                value={formData.companySize}
                onChange={handleChange}
                style={{
                  width: '100%',
                  height: 50,
                  borderRadius: 12,
                  border: "1px solid var(--border-color)",
                  backgroundColor: "var(--background-color)",
                  color: "var(--text-color)",
                  fontSize: '14px',
                  padding: '0 12px',
                  marginTop: '10px'
                }}
              >
                <option value="" disabled>Company size</option>
                {["1-50", "51-500", "501-5000", "5,000+"].map((size) => (
                  <option key={size} value={size} style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                    {size}
                  </option>
                ))}
              </select>
            </Box>
            <Box sx={{ mt: 2, borderRadius: 12 }}>
              <Typography variant="subtitle1" sx={{ color: "var(--text-color)", mb: 0 }}>
                Select Your Industry
              </Typography>
              <FormControl fullWidth>
                <select
                  id="industry-select"
                  name="industries"
                  value={formData.industries[0] || ''}
                  onChange={(event) => {
                    const selectedIndustry = event.target.value;
                    setFormData((prevState) => ({
                      ...prevState,
                      industries: [selectedIndustry]
                    }));
                  }}
                  style={{
                    width: '100%',
                    height: 50,
                    borderRadius: 12,
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--background-color)",
                    color: "var(--text-color)",
                    fontSize: '14px',
                    padding: '0 12px',
                    marginTop: '8px'
                  }}
                >
                  <option value="" disabled>Select industry</option>
                  {industryOptions.map((option) => (
                    <option key={option.name} value={option.name} style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                      {option.name}
                    </option>
                  ))}
                </select>
              </FormControl>
            </Box>
          </>
        )}
        <Typography variant="subtitle1" sx={{ color: "var(--text-color)", mt: 2 }}>
          Solutions Required
        </Typography>
        {formData.services.map((service, index) => (
          <Box key={index}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="subtitle2" sx={{ color: "var(--text-color)" }}>
                Solution {index + 1}
              </Typography>
                <IconButton
                  color="secondary"
                  onClick={() => handleRemoveService(index)}
                  sx={{
                    color: "var(--text-color)",
                  }}
                >
                  <RemoveCircleOutlineIcon />
                </IconButton>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={4}>
                <select
                  id={`service-${index}`}
                  name={`service-${index}`}
                  value={service.service}
                  onChange={(e) => handleServiceChange(index, 'service', e.target.value)}
                  style={{
                    width: '100%',
                    height: 50,
                    borderRadius: 12,
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--background-color)",
                    color: "var(--text-color)",
                    fontSize: '14px',
                    padding: '0 12px',
                    marginTop: '8px'
                  }}
                >
                  <option value="" disabled>Service</option>
                  {servicesBuyer.map((serviceOption) => (
                    <option key={serviceOption} value={serviceOption} style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                      {serviceOption}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} sm={4}>
                <select
                  id={`timeframe-${index}`}
                  name={`timeframe-${index}`}
                  value={service.timeframe}
                  onChange={(e) => handleServiceChange(index, 'timeframe', e.target.value)}
                  style={{
                    width: '100%',
                    height: 50,
                    borderRadius: 12,
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--background-color)",
                    color: "var(--text-color)",
                    fontSize: '14px',
                    padding: '0 12px',
                    marginTop: '8px'
                  }}
                >
                  <option value="" disabled>Timeframe</option>
                  {["1-2 weeks", "1 month", "3 months"].map((timeframe) => (
                    <option key={timeframe} value={timeframe} style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                      {timeframe}
                    </option>
                  ))}
                </select>
              </Grid>
              <Grid item xs={12} sm={4}>
                <select
                  id={`budget-${index}`}
                  name={`budget-${index}`}
                  value={service.budget}
                  onChange={(e) => handleServiceChange(index, 'budget', e.target.value)}
                  style={{
                    width: '100%',
                    height: 50,
                    borderRadius: 12,
                    border: "1px solid var(--border-color)",
                    backgroundColor: "var(--background-color)",
                    color: "var(--text-color)",
                    fontSize: '14px',
                    padding: '0 12px',
                    marginTop: '8px'
                  }}
                >
                  <option value="" disabled>Budget</option>
                  {["$5,000+", "$10,000+", "$25,000+", "$50,000+", "$100,000+"].map((budget) => (
                    <option key={budget} value={budget} style={{ backgroundColor: "var(--background-color)", color: "var(--text-color)" }}>
                      {budget}
                    </option>
                  ))}
                </select>
              </Grid>
            </Grid>
          </Box>
        ))}
        <Box onClick={handleAddService} sx={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', mt: 3, borderRadius: 2, border: "1px solid var(--border-color1)" }}>
          <IconButton
            color="primary"
            onClick={handleAddService}
            sx={{
              color: "var(--text-color)",
              borderRadius: '50%',
            }}
          >
            <AddCircleOutlineIcon />
          </IconButton>
          <Typography
            variant="body1"
            sx={{ color: "var(--text-color)", ml: 1, alignSelf: 'center' }}
          >
            Add Another Service
          </Typography>
        </Box>
        
        {!isEdit && (
        <TextField
          fullWidth
          label="Additional Information"
          name="additionalInfo"
          value={formData.additionalInfo}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="Provide additional details about your requirements"
          margin="normal"
          multiline
          rows={4}
          variant="outlined"
          error={!!errors.additionalInfo}
          helperText={errors.additionalInfo}
          autoComplete="off"
          InputLabelProps={{ style: { color: "var(--text-color)", fontSize: '14px' } }}
          InputProps={{
            style: {
              color: "var(--text-color)",
              border: "1px solid var(--border-color)",
              borderRadius: 12,
              fontSize: '14px',
              WebkitBoxShadow: '0 0 0 1000px var(--background-color) inset',
              WebkitTextFillColor: 'var(--text-color)',
              transition: 'background-color 5000s ease-in-out 0s'
            },
          }}
        />
        )}
        <Button
          fullWidth
          variant="contained"
          sx={{
            mt: 4,
            backgroundColor: loading ? "#4998F8c3" : "var(--button-background-color)",
            color: 'white', // Ensure text color remains white
            height: 50,
            borderRadius: 2,
            border: "1px solid var(--border-color)",
          }}
          type="submit"
        >
          {loading 
  ? "Submitting..." 
  : isEdit 
    ? "Update Solutions" 
    : "Submit Request"}

          
        </Button>

        {error && <Box sx={{ mt: 2, color: 'red' }}>{error}</Box>}
        {success && <Box sx={{ mt: 2, color: 'green' }}>{success}</Box>}
      </Box>

    </Container>
  );
};

export default BuyerForm;
