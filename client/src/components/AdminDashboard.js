import React from 'react';
import { Grid, Paper, Typography } from '@material-ui/core';
import { Link } from 'react-router-dom';

function AdminDashboard() {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12}>
        <Typography variant="h4">Admin Dashboard</Typography>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper component={Link} to="/inventory" style={{ padding: '20px', textDecoration: 'none' }}>
          <Typography variant="h6">Inventory Management</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper component={Link} to="/orders" style={{ padding: '20px', textDecoration: 'none' }}>
          <Typography variant="h6">Order Management</Typography>
        </Paper>
      </Grid>
      <Grid item xs={12} sm={6} md={4}>
        <Paper component={Link} to="/kpi" style={{ padding: '20px', textDecoration: 'none' }}>
          <Typography variant="h6">KPI Dashboard</Typography>
        </Paper>
      </Grid>
    </Grid>
  );
}

export default AdminDashboard;