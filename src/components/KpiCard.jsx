import React from 'react';
import { Card, CardContent, Typography, Box } from '@mui/material';

const KpiCard = ({ title, value, icon, color = 'primary.main', subtitle }) => {
  return (
    <Card sx={{ height: '100%', minWidth: 160, boxShadow: 1 }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" fontWeight="medium" noWrap>
            {title}
          </Typography>
          <Box sx={{ color, display: 'flex', alignItems: 'center' }}>
            {icon}
          </Box>
        </Box>
        <Typography variant="h4" fontWeight="bold" sx={{ mb: 0.5 }}>
          {value}
        </Typography>
        {subtitle && (
          <Typography variant="caption" color="text.secondary" noWrap>
            {subtitle}
          </Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default KpiCard;
