import React, { useState, useEffect } from 'react';
import MainCard from 'ui-component/cards/MainCard';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Grid,
  Typography,
  Button,
  CircularProgress,
  Card,
  CardContent,
  CardMedia,
  TextField,
  InputAdornment,
  IconButton,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Snackbar,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Select,
  InputLabel,
  FormControl
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { AddCircleOutlined, Delete } from '@mui/icons-material';
import MoreVertIcon from '@mui/icons-material/MoreVert'; // Import three dots icon

const EntityTemplate = () => {
  const [templateData, setTemplateData] = useState([]);
  const [brandData, setBrandData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState(''); // New state for search filter
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const open = Boolean(anchorEl);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [showAddTemplateDialog, setShowAddTemplateDialog] = useState(false);
  const [newTemplateData, setNewTemplateData] = useState({
    brandId: '',
    templateName: '',
    templateDescription: '',
    templateWidth: '',
    templateHeight: '',
    templateImgPath: ''
  });

  const handleAddTemplate = async () => {
    try {
      const response = await axios.post('https://3.1.81.96/api/Templates', newTemplateData);
      if (response.status === 201) {
        // Update template data locally (assuming server returns the created template data)
        setTemplateData((prevTemplateData) => [...prevTemplateData, response.data]);
        setOpenSnackbar(true);
        setSnackbarMessage('Template added successfully!');
        setShowAddTemplateDialog(false);
      } else {
        console.error('Error creating template:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating template:', error);
      setError(`Error: ${error.message}`);
    }
  };

  const handleAddTemplateChange = (event) => {
    const { name, value } = event.target;

    // Set width and height based on orientation
    if (name === 'templateOrientation') {
      setNewTemplateData((prevState) => ({
        ...prevState,
        templateWidth: value === 'horizontal' ? 1600 : 900,
        templateHeight: value === 'horizontal' ? 900 : 1600
      }));
    } else {
      setNewTemplateData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const handleCloseAddTemplateDialog = () => {
    setShowAddTemplateDialog(false);
  };

  const handleViewDetails = (template) => {
    navigate('/template-details', { state: { templateData: template } });
  };

  const handleClick = (event, template) => {
    event.stopPropagation(); // Stop event propagation
    setAnchorEl(event.currentTarget);
    setSelectedTemplate(template);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleDelete = async () => {
    try {
      const response = await axios.delete(`https://3.1.81.96/api/Templates/${selectedTemplate.templateId}`);
      if (response.status === 200) {
        setTemplateData((prevData) => prevData.filter((item) => item.templateId !== selectedTemplate.templateId));
        setOpenSnackbar(true);
        setSnackbarMessage('Template deleted successfully!');
      } else {
        console.error('Error deleting template:', response);
        setError(`Error: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error deleting template:', error);
      setError(`Error: ${error.message}`);
    } finally {
      handleClose(); // Close menu
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const [templateResponse, brandResponse] = await Promise.all([
          axios.get('https://3.1.81.96/api/Templates?pageNumber=1&pageSize=100'),
          axios.get('https://3.1.81.96/api/Brands?pageNumber=1&pageSize=100')
        ]);

        setTemplateData(templateResponse.data);
        setBrandData(brandResponse.data);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError(error.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const filteredTemplates = templateData.filter((template) => template.templateName.toLowerCase().includes(filter.toLowerCase()));

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <MainCard title={<Typography variant="h5">Templates</Typography>}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <TextField
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                variant="outlined"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon />
                    </InputAdornment>
                  )
                }}
                sx={{
                  width: '500px',
                  mr: 60, // Set a fixed width (adjust as needed)
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                    paddingRight: 1
                  }
                }}
              />
              <Button
                variant="contained"
                color="primary"
                onClick={() => setShowAddTemplateDialog(true)}
                startIcon={<AddCircleOutlined />}
                sx={{
                  borderRadius: 2,
                  boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)',
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 2, // Increase horizontal padding further
                  py: 1.5,
                  whiteSpace: 'nowrap' // Prevent text from wrapping
                }}
                size="small"
              >
                Add Template
              </Button>
            </Box>

            {isLoading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
                <CircularProgress />
              </Box>
            ) : error ? (
              <Typography color="error">{error}</Typography>
            ) : (
              <Grid container spacing={3}>
                {filteredTemplates.map((template, index) => (
                  <Grid item xs={12} sm={6} md={4} key={template.templateId || index}>
                    <Card sx={{ border: 1, borderColor: 'divider', cursor: 'pointer' }} onClick={() => handleViewDetails(template)}>
                      {/* Optional: Display an image */}
                      {template.templateImgPath && (
                        <CardMedia component="img" height="200" image={template.templateImgPath} alt={template.templateName} />
                      )}
                      <CardContent sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Box>
                          <Typography gutterBottom variant="h4" component="div">
                            {template.templateName}
                          </Typography>
                          <Typography variant="body2" color="text.secondary">
                            {template.templateWidth} x {template.templateHeight}
                          </Typography>
                        </Box>
                        {/* Three Dots Menu Button */}
                        <IconButton aria-label="settings" onClick={(event) => handleClick(event, template)}>
                          <MoreVertIcon />
                        </IconButton>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}
          </MainCard>
        </Grid>
      </Grid>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={4000}
        onClose={() => setOpenSnackbar(false)}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      >
        <Alert severity={snackbarMessage ? 'success' : 'error'}>{snackbarMessage}</Alert>
      </Snackbar>

      <Menu
        id="template-menu"
        anchorEl={anchorEl}
        open={open}
        disableScrollLock
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button'
        }}
      >
        <MenuItem onClick={handleDelete}>
          <ListItemIcon>
            <Delete fontSize="small" color="error" />
          </ListItemIcon>
          <ListItemText primary={<Typography color="error">Delete</Typography>} />
        </MenuItem>
      </Menu>

      <Dialog open={showAddTemplateDialog} onClose={handleCloseAddTemplateDialog}>
        <DialogTitle>Add New Template</DialogTitle>
        <DialogContent>
          <DialogContentText>Please enter the details of the new template.</DialogContentText>
          {/* Input fields for template data */}
          <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
            <InputLabel id="brand-select-label">Brand Name</InputLabel>
            <Select
              labelId="brand-select-label"
              id="brand-select"
              name="brandId"
              value={newTemplateData.brandId}
              onChange={handleAddTemplateChange}
              label="Brand Name"
            >
              {brandData.map((brand) => (
                <MenuItem key={brand.brandId} value={brand.brandId}>
                  {brand.brandName}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="templateName"
            label="Template Name"
            type="text"
            fullWidth
            variant="standard"
            value={newTemplateData.templateName}
            onChange={handleAddTemplateChange}
          />
          <TextField
            margin="dense"
            name="templateDescription"
            label="Template Description"
            type="text"
            fullWidth
            variant="standard"
            value={newTemplateData.templateDescription}
            onChange={handleAddTemplateChange}
          />
          <FormControl fullWidth variant="standard" sx={{ mt: 2 }}>
            <InputLabel id="orientation-select-label">Orientation</InputLabel>
            <Select
              labelId="orientation-select-label"
              id="orientation-select"
              name="templateOrientation"
              value={newTemplateData.templateWidth === 900 ? 'vertical' : 'horizontal'} // Derive value from width
              onChange={handleAddTemplateChange}
              label="Orientation"
            >
              <MenuItem value="vertical">Vertical (900 x 1600)</MenuItem>
              <MenuItem value="horizontal">Horizontal (1600 x 900)</MenuItem>
            </Select>
          </FormControl>
          <TextField
            margin="dense"
            name="templateImgPath"
            label="Template Image Path"
            type="text"
            fullWidth
            variant="standard"
            value={newTemplateData.templateImgPath}
            onChange={handleAddTemplateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAddTemplateDialog}>Cancel</Button>
          <Button variant="contained" onClick={handleAddTemplate}>
            Add Template
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EntityTemplate;
