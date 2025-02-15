import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card, TextField, Typography, Box, Grid, ThemeProvider, createTheme } from '@mui/material';
import { SERVER_URL } from '../utils/auth';

const theme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4CAF50', // Green for buttons
    },
    secondary: {
      main: '#007BFF', // Blue for buttons and highlights
    },
    background: {
      default: '#333333', // Dark background for the entire page
      paper: '#1d1d1d', // Dark card background
    },
    text: {
      primary: '#fff', // White text color
      secondary: '#b0b0b0', // Lighter text for secondary items
    },
  },
});

function Dashboard() {
  const navigate = useNavigate();



  const [workspaces, setWorkspaces] = useState([

  ]);

  // localStorage.setItem('userId', data.userId);


  useEffect(()=>{
 try {
      fetch(`${SERVER_URL}/api/projects/userId/${localStorage.getItem('userId')}`, {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
  
      }).then(e=>e.json()).then(async e=>{
    
        setWorkspaces(e);
        // localStorage.setItem("latestVer")

      });




  
 

      
    } catch (err) {
      setError('Server error');
    }
  },[])

  const [newWorkspaceName, setNewWorkspaceName] = useState('');
  const [newProjectName, setNewProjectName] = useState('');

  const handleCreateWorkspace = () => {
    if (newWorkspaceName && newProjectName) {
      const newWorkspace = {
        id: workspaces.length + 1,
        name: `${newProjectName}: ${newWorkspaceName}`,
      };

      fetch(`${SERVER_URL}/api/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body:JSON.stringify({projectName:newProjectName, userId:localStorage.getItem('userId')})
  
      }).then(e=>e.json()).then(async e=>{
    
        // setWorkspaces(e)
      setWorkspaces(k=>[...k, e]);
      setNewWorkspaceName('');
      setNewProjectName('');

      });


  
    }
  };

  const handleVisitWorkspace = (workspaceName, lv) => {
    localStorage.setItem("latestVersion", lv);
    navigate(`/project/${workspaceName}`);
  };

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ padding: '20px', minHeight: '100vh', backgroundColor: '#333333' }}>
        {/* Greeting */}
        <Typography
          variant="h3"
          align="center"
          color="text.primary"
          gutterBottom
          sx={{ color: '#fff' }}
        >
          Welcome {localStorage.getItem('userName')} !
        </Typography>

        <Grid container spacing={4}>
          {/* Create Workspace Section */}
          <Grid item xs={12} md={6}>
            <Card sx={{ padding: 3, backgroundColor: 'background.paper' }}>
              <Typography variant="h5" gutterBottom color="text.primary">
                Create a New Workspace
              </Typography>
              <TextField
                label="Project Name"
                variant="outlined"
                fullWidth
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
                sx={{ marginBottom: 2, backgroundColor: '#333' }}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                InputProps={{
                  style: { color: '#fff' },
                }}
              />
              <TextField
                label="Workspace Name"
                variant="outlined"
                fullWidth
                value={newWorkspaceName}
                onChange={(e) => setNewWorkspaceName(e.target.value)}
                sx={{ marginBottom: 2, backgroundColor: '#333' }}
                InputLabelProps={{
                  style: { color: '#fff' },
                }}
                InputProps={{
                  style: { color: '#fff' },
                }}
              />
              <Button variant="contained" color="primary" fullWidth onClick={handleCreateWorkspace}>
                Create Workspace
              </Button>
            </Card>
          </Grid>

          {/* Existing Workspaces Section */}
          <Grid item xs={12} md={6}>
            <Typography variant="h5" gutterBottom color="text.primary">
              Existing Workspaces
            </Typography>
            <Box
              sx={{
                maxHeight: 400,
                overflowY: 'auto',
                backgroundColor: 'background.paper',
                padding: 2,
                borderRadius: 2,
                boxShadow: 2,
              }}
            >
              {workspaces.length > 0 ? (
                workspaces.map((workspace) => (
                  <Card
                    key={workspace.projectId}
                    sx={{
                      marginBottom: 2,
                      padding: 2,
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      backgroundColor: 'background.default',
                      boxShadow: 1,
                    }}
                  >
                    <Typography variant="body1" color="text.primary">
                      {workspace.projectName}
                    </Typography>
                    <Button
                      variant="outlined"
                      color="secondary"
                      onClick={() => handleVisitWorkspace(workspace.projectId, workspace.version)}
                    >
                      Visit
                    </Button>
                  </Card>
                ))
              ) : (
                <Typography color="text.secondary">No workspaces available</Typography>
              )}
            </Box>
          </Grid>
        </Grid>
      </Box>
    </ThemeProvider>
  );
}

export default Dashboard;
