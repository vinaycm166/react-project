import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Card,
  CardContent,
  Tab,
  Tabs,
  Button,
  TextField,
  Chip,
  Grid,
  Divider,
  List,
  ListItem,
  ListItemText,
  Alert,
  FormControl,
  InputLabel,
  Select,
  MenuItem
} from '@mui/material';
import {
  ArrowBack as ArrowBackIcon,
  Check as CheckIcon,
  Close as CloseIcon,
  Undo as UndoIcon,
  Shuffle as DelegateIcon
} from '@mui/icons-material';
import Loader from '../../components/Loader';
import ErrorState from '../../components/ErrorState';
import {
  fetchRequestById,
  updateRequestStatus,
  addRequestComment,
  clearSelectedRequest
} from '../../store/slices/procurementSlice';

const ProcurementDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { selectedRequest, detailLoading, error } = useSelector((state) => state.procurement);
  const { user } = useSelector((state) => state.auth);

  const [tabValue, setTabValue] = useState(0);
  const [commentText, setCommentText] = useState('');
  const [workbenchAction, setWorkbenchAction] = useState(null); // 'Approve', 'Reject', 'Send Back', 'Delegate'
  const [workbenchComment, setWorkbenchComment] = useState('');
  const [delegateTarget, setDelegateTarget] = useState('');

  useEffect(() => {
    dispatch(fetchRequestById(id));
    return () => {
      dispatch(clearSelectedRequest());
    };
  }, [dispatch, id]);

  if (detailLoading) {
    return <Loader message="Fetching request dossier from GRC vault..." />;
  }

  if (error || !selectedRequest) {
    return <ErrorState message={error || 'The requested procurement request could not be located.'} onRetry={() => dispatch(fetchRequestById(id))} />;
  }

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleCommentSubmit = (e) => {
    e.preventDefault();
    if (commentText.trim()) {
      dispatch(addRequestComment({ id: selectedRequest.id, comment: commentText.trim() }))
        .unwrap()
        .then(() => setCommentText(''));
    }
  };

  const handleWorkbenchActionSubmit = () => {
    let finalStatus = selectedRequest.status;
    let commentPrefix = '';

    if (workbenchAction === 'Approve') {
      finalStatus = 'Approved';
      commentPrefix = 'Approved: ';
    } else if (workbenchAction === 'Reject') {
      finalStatus = 'Rejected';
      commentPrefix = 'Rejected: ';
    } else if (workbenchAction === 'Send Back') {
      finalStatus = 'Pending';
      commentPrefix = 'Returned for revision: ';
    } else if (workbenchAction === 'Delegate') {
      finalStatus = 'Escalated';
      commentPrefix = `Delegated to ${delegateTarget}: `;
    }

    dispatch(updateRequestStatus({
      id: selectedRequest.id,
      status: finalStatus,
      action: workbenchAction,
      comment: commentPrefix + workbenchComment
    }))
      .unwrap()
      .then(() => {
        setWorkbenchAction(null);
        setWorkbenchComment('');
        setDelegateTarget('');
      });
  };

  // Determine if active user has manager authority
  const isManager = user?.role === 'Procurement Manager' || user?.role === 'Compliance Officer' || user?.role === 'Administrator';
  const showWorkbench = isManager && selectedRequest.status === 'Pending';

  return (
    <Box>
      <Button startIcon={<ArrowBackIcon />} onClick={() => navigate('/procurement')} sx={{ mb: 2 }}>
        Back to Register
      </Button>

      {/* Profile Overview Card */}
      <Card sx={{ mb: 3, boxShadow: 1 }}>
        <CardContent>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2, flexWrap: 'wrap', gap: 2 }}>
            <Box>
              <Typography variant="h5" fontWeight="bold">
                {selectedRequest.title}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                ID: {selectedRequest.id} | Department: {selectedRequest.department} | Submitted By: {selectedRequest.submittedBy}
              </Typography>
            </Box>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Chip label={selectedRequest.status} color={
                selectedRequest.status === 'Pending' ? 'warning' :
                selectedRequest.status === 'Approved' ? 'success' :
                selectedRequest.status === 'Rejected' ? 'error' : 'secondary'
              } />
              <Chip label={`Risk: ${selectedRequest.riskRating}`} color={selectedRequest.riskRating === 'Low' ? 'success' : 'error'} variant="outlined" />
            </Box>
          </Box>
          <Divider sx={{ my: 1.5 }} />
          <Typography variant="h5" color="primary.main" fontWeight="bold">
            ${Number(selectedRequest.amount).toLocaleString()}
          </Typography>
        </CardContent>
      </Card>

      {/* Tabs Menu */}
      <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 2 }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="procurement document sections">
          <Tab label="Overview" />
          <Tab label="Attachments" />
          <Tab label="Approval History" />
          <Tab label="Comments" />
          <Tab label="Audit Logs" />
        </Tabs>
      </Box>

      {/* Tab Panels */}
      <Card sx={{ mb: 3, boxShadow: 1 }}>
        <CardContent>
          {tabValue === 0 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Business Description</Typography>
              <Typography variant="body2" color="text.secondary" paragraph>
                {selectedRequest.description}
              </Typography>
              <Divider sx={{ my: 2 }} />
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Vendor Association</Typography>
              <Typography variant="body2" color="text.primary">
                Name: {selectedRequest.vendorName}
              </Typography>
              <Typography variant="caption" color="text.secondary" display="block">
                Vendor ID Reference: {selectedRequest.vendorId}
              </Typography>
            </Box>
          )}

          {tabValue === 1 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Uploaded Documents</Typography>
              {selectedRequest.attachments.length === 0 ? (
                <Typography variant="body2" color="text.secondary">No files attached to this request.</Typography>
              ) : (
                <List>
                  {selectedRequest.attachments.map((file, i) => (
                    <ListItem key={i} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 1, mb: 1, bgcolor: 'action.hover' }}>
                      <ListItemText primary={file} secondary="Application/PDF Document" />
                      <Button size="small" variant="outlined" onClick={() => alert(`Simulating file download: ${file}`)}>
                        Download
                      </Button>
                    </ListItem>
                  ))}
                </List>
              )}
            </Box>
          )}

          {tabValue === 2 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Approval Trail Routing</Typography>
              <List>
                {selectedRequest.approvalHistory.map((step, i) => (
                  <ListItem key={i} sx={{ borderLeft: '3px solid', borderColor: 'primary.main', mb: 1.5, pl: 2 }}>
                    <ListItemText
                      primary={
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                          <Typography variant="subtitle2" fontWeight="bold">{step.step}</Typography>
                          <Typography variant="caption" color="text.secondary">{step.date}</Typography>
                        </Box>
                      }
                      secondary={
                        <>
                          <Typography variant="caption" color="text.primary" display="block">
                            Action User: {step.user} | Result Status: {step.status}
                          </Typography>
                          {step.comments && (
                            <Typography variant="caption" color="text.secondary" display="block" sx={{ fontStyle: 'italic', mt: 0.5 }}>
                              Comment: "{step.comments}"
                            </Typography>
                          )}
                        </>
                      }
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}

          {tabValue === 3 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Comment Stream</Typography>
              <List sx={{ maxHeight: 200, overflow: 'auto', mb: 2 }}>
                {selectedRequest.comments.length === 0 ? (
                  <Typography variant="body2" color="text.secondary">No comments posted yet.</Typography>
                ) : (
                  selectedRequest.comments.map((c, i) => (
                    <ListItem key={i} alignItems="flex-start" sx={{ px: 0 }}>
                      <ListItemText
                        primary={<Typography variant="subtitle2" fontWeight="bold">{c.user}</Typography>}
                        secondary={
                          <>
                            <Typography variant="body2" color="text.primary">{c.comment}</Typography>
                            <Typography variant="caption" color="text.secondary" display="block">{c.date}</Typography>
                          </>
                        }
                      />
                    </ListItem>
                  ))
                )}
              </List>
              <Divider sx={{ mb: 2 }} />
              <Box component="form" onSubmit={handleCommentSubmit} sx={{ display: 'flex', gap: 1 }}>
                <TextField
                  fullWidth
                  size="small"
                  placeholder="Post comments to request trail..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <Button type="submit" variant="contained">Post</Button>
              </Box>
            </Box>
          )}

          {tabValue === 4 && (
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>Internal System Audit Log</Typography>
              <List>
                {selectedRequest.auditLogs.map((log, i) => (
                  <ListItem key={i} sx={{ py: 0.5 }}>
                    <ListItemText
                      primary={log.action}
                      secondary={`Timestamp: ${log.date} | User: ${log.user}`}
                      primaryTypographyProps={{ variant: 'subtitle2' }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                ))}
              </List>
            </Box>
          )}
        </CardContent>
      </Card>

      {/* Approval Workbench Panel */}
      {showWorkbench && (
        <Card sx={{ border: '1px solid', borderColor: 'warning.light', bgcolor: 'warning.50', boxShadow: 2 }}>
          <CardContent>
            <Typography variant="subtitle1" fontWeight="bold" color="warning.dark" sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 2 }}>
              Approval Workbench Controls
            </Typography>

            {!workbenchAction ? (
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                <Button variant="contained" color="success" startIcon={<CheckIcon />} onClick={() => setWorkbenchAction('Approve')}>
                  Approve
                </Button>
                <Button variant="contained" color="error" startIcon={<CloseIcon />} onClick={() => setWorkbenchAction('Reject')}>
                  Reject
                </Button>
                <Button variant="outlined" color="warning" startIcon={<UndoIcon />} onClick={() => setWorkbenchAction('Send Back')}>
                  Send Back
                </Button>
                <Button variant="outlined" color="secondary" startIcon={<DelegateIcon />} onClick={() => setWorkbenchAction('Delegate')}>
                  Delegate
                </Button>
              </Box>
            ) : (
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                <Typography variant="body2" fontWeight="bold">
                  Review Action Selected: {workbenchAction}
                </Typography>
                
                {workbenchAction === 'Delegate' && (
                  <FormControl fullWidth size="small">
                    <InputLabel>Delegate Recipient User</InputLabel>
                    <Select
                      value={delegateTarget}
                      label="Delegate Recipient User"
                      onChange={(e) => setDelegateTarget(e.target.value)}
                    >
                      <MenuItem value="Marcus Vance">Marcus Vance (Compliance Officer)</MenuItem>
                      <MenuItem value="Sarah Jenkins">Sarah Jenkins (Procurement Manager)</MenuItem>
                      <MenuItem value="Elena Rostova">Elena Rostova (Auditor)</MenuItem>
                    </Select>
                  </FormControl>
                )}

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  label="Decision Justification Comment"
                  placeholder="Enter comments explaining the action..."
                  value={workbenchComment}
                  onChange={(e) => setWorkbenchComment(e.target.value)}
                />
                
                <Box sx={{ display: 'flex', gap: 2 }}>
                  <Button variant="contained" color="primary" onClick={handleWorkbenchActionSubmit} disabled={workbenchAction === 'Delegate' && !delegateTarget}>
                    Confirm Action
                  </Button>
                  <Button variant="text" color="inherit" onClick={() => setWorkbenchAction(null)}>
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
          </CardContent>
        </Card>
      )}
    </Box>
  );
};

export default ProcurementDetail;
