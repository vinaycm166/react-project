import axios from 'axios';
import mockUsers from '../mocks/users.json';
import mockVendors from '../mocks/vendors.json';
import mockRequests from '../mocks/requests.json';
import mockRiskData from '../mocks/riskData.json';
import mockNotifications from '../mocks/notifications.json';
import mockReports from '../mocks/reports.json';

// Deep-copy all mock data so the db object is fully mutable at runtime.
// Vite seals JSON module imports — shallow spread is not enough.
const deepCopy = (obj) => JSON.parse(JSON.stringify(obj));

let db = {
  users: deepCopy(mockUsers),
  vendors: deepCopy(mockVendors),
  requests: deepCopy(mockRequests),
  riskData: deepCopy(mockRiskData),
  notifications: deepCopy(mockNotifications),
  reports: deepCopy(mockReports),
  auditLogs: [
    { id: 'AUD-001', action: 'System Init', user: 'System', date: '2026-07-05 08:00:00', details: 'GRC Platform started.' },
    { id: 'AUD-002', action: 'System Audit Checked', user: 'Elena Rostova', date: '2026-07-05 09:15:00', details: 'Standard dashboard read' }
  ]
};

const apiClient = axios.create({
  baseURL: 'https://api.egrcp-platform.local/api',
  timeout: 10000
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const apiError = {
      message: error.response?.data?.message || error.message || 'Something went wrong',
      status: error.response?.status || 500,
      data: error.response?.data
    };
    return Promise.reject(apiError);
  }
);

const handleRequest = (config, resolve, reject) => {
  const url = config.url.replace(config.baseURL, '').split('?')[0];
  const method = config.method.toUpperCase();
  const body = config.data ? JSON.parse(config.data) : null;
  const headers = config.headers;

      if (url.startsWith('/auth/register') && method === 'POST') {
        const { name, email, username, password, role } = body;
        const exists = db.users.some(u => u.username === username || u.email === email);
        if (exists) {
          reject({
            response: {
              status: 400,
              data: { message: 'Username or Email is already registered' }
            }
          });
        } else {
          const newUser = {
            id: `USR0${db.users.length + 1}`,
            name,
            email,
            username,
            password,
            role: role || 'Employee'
          };
          db.users.push(newUser);
          const responseUser = { ...newUser };
          delete responseUser.password;
          resolve({
            data: { user: responseUser, message: 'Registration successful!' },
            status: 201,
            statusText: 'Created',
            headers: {},
            config
          });
        }
        return;
      }

      if (url.startsWith('/auth/login') && method === 'POST') {
        const { username, password } = body;
        const user = db.users.find(u => u.username === username && u.password === password);
        if (user) {
          const token = `token_${user.id}`;
          const responseUser = { ...user };
          delete responseUser.password;
          resolve({
            data: { user: responseUser, token },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              status: 401,
              data: { message: 'Invalid username or password' }
            }
          });
        }
        return;
      }

      if (url.startsWith('/auth/forgot-password') && method === 'POST') {
        const { email } = body;
        const exists = db.users.some(u => u.email === email);
        if (exists) {
          resolve({
            data: { message: 'Password reset link sent to your email.' },
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              status: 404,
              data: { message: 'Email not found' }
            }
          });
        }
        return;
      }

      if (url.startsWith('/auth/reset-password') && method === 'POST') {
        resolve({
          data: { message: 'Password reset successful.' },
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
        return;
      }

      const authHeader = headers.Authorization || headers.authorization;
      if (!authHeader || !authHeader.startsWith('Bearer token_')) {
        reject({
          response: {
            status: 401,
            data: { message: 'Unauthorized session' }
          }
        });
        return;
      }

      // Token format: token_USERID (e.g. token_USR001)
      const activeUserId = authHeader.replace('Bearer token_', '');
      const activeUser = db.users.find(u => u.id === activeUserId);
      const activeUserName = activeUser ? activeUser.name : 'Unknown User';

      if (url === '/procurement' && method === 'GET') {
        resolve({
          data: db.requests,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
        return;
      }

      if (url.startsWith('/procurement/') && method === 'GET') {
        const id = url.substring(13);
        const req = db.requests.find(r => r.id === id);
        if (req) {
          resolve({
            data: req,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              status: 404,
              data: { message: 'Request not found' }
            }
          });
        }
        return;
      }

      if (url === '/procurement' && method === 'POST') {
        const newReq = {
          id: `PR-2026-0${db.requests.length + 1}`,
          title: body.title,
          amount: Number(body.amount),
          department: body.department || 'Engineering',
          status: 'Pending',
          riskRating: body.riskRating || 'Low',
          vendorId: body.vendorId,
          vendorName: db.vendors.find(v => v.id === body.vendorId)?.name || 'Unknown Vendor',
          submittedBy: activeUserName,
          submissionDate: new Date().toISOString().split('T')[0],
          description: body.description,
          attachments: body.attachments || [],
          approvalHistory: [
            { step: 'Initial Submission', user: activeUserName, status: 'Submitted', date: new Date().toISOString().split('T')[0], comments: 'Created request' }
          ],
          comments: [],
          auditLogs: [
            { action: 'Request Created', user: activeUserName, date: new Date().toISOString().replace('T', ' ').substring(0, 19) }
          ]
        };

        db.requests.unshift(newReq);
        db.auditLogs.unshift({
          id: `AUD-0${db.auditLogs.length + 1}`,
          action: 'Create Request',
          user: activeUserName,
          date: new Date().toISOString().replace('T', ' ').substring(0, 19),
          details: `Submitted new procurement request ${newReq.id} for $${newReq.amount}`
        });

        db.notifications.unshift({
          id: `NOT-0${db.notifications.length + 1}`,
          title: 'New Request Submitted',
          message: `${activeUserName} submitted ${newReq.id}: ${newReq.title}`,
          priority: newReq.amount > 50000 ? 'High' : 'Medium',
          status: 'Unread',
          createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          roleScope: 'Procurement Manager'
        });

        resolve({
          data: newReq,
          status: 201,
          statusText: 'Created',
          headers: {},
          config
        });
        return;
      }

      if (url.startsWith('/procurement/') && method === 'PUT') {
        const id = url.substring(13);
        const reqIdx = db.requests.findIndex(r => r.id === id);
        if (reqIdx !== -1) {
          const req = db.requests[reqIdx];
          const updated = {
            ...req,
            status: body.status || req.status,
            approvalHistory: [
              ...req.approvalHistory,
              {
                step: 'Action: ' + body.action,
                user: activeUserName,
                status: body.status,
                date: new Date().toISOString().split('T')[0],
                comments: body.comment || ''
              }
            ],
            auditLogs: [
              ...req.auditLogs,
              {
                action: `Status Update: ${body.status}`,
                user: activeUserName,
                date: new Date().toISOString().replace('T', ' ').substring(0, 19)
              }
            ]
          };
          db.requests[reqIdx] = updated;

          db.auditLogs.unshift({
            id: `AUD-0${db.auditLogs.length + 1}`,
            action: 'Update Request',
            user: activeUserName,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            details: `Updated status of request ${id} to ${body.status}`
          });

          db.notifications.unshift({
            id: `NOT-0${db.notifications.length + 1}`,
            title: `Request ${body.status}`,
            message: `Your request ${id} has been ${body.status.toLowerCase()} by ${activeUserName}.`,
            priority: body.status === 'Rejected' ? 'High' : 'Medium',
            status: 'Unread',
            createdAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
            roleScope: 'Employee'
          });

          resolve({
            data: updated,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              status: 404,
              data: { message: 'Request not found' }
            }
          });
        }
        return;
      }

      if (url.startsWith('/procurement/') && url.endsWith('/comments') && method === 'POST') {
        const id = url.split('/')[2];
        const reqIdx = db.requests.findIndex(r => r.id === id);
        if (reqIdx !== -1) {
          const commentObj = {
            user: activeUserName,
            comment: body.comment,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19)
          };
          db.requests[reqIdx].comments.push(commentObj);
          db.requests[reqIdx].auditLogs.push({
            action: `Added Comment`,
            user: activeUserName,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19)
          });
          resolve({
            data: db.requests[reqIdx],
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              status: 404,
              data: { message: 'Request not found' }
            }
          });
        }
        return;
      }

      if (url === '/vendors' && method === 'GET') {
        resolve({
          data: db.vendors,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
        return;
      }

      if (url.startsWith('/vendors/') && method === 'GET') {
        const id = url.substring(9);
        const vendor = db.vendors.find(v => v.id === id);
        if (vendor) {
          resolve({
            data: vendor,
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              status: 404,
              data: { message: 'Vendor not found' }
            }
          });
        }
        return;
      }

      if (url.startsWith('/vendors/') && url.endsWith('/documents') && method === 'POST') {
        const id = url.split('/')[2];
        const vendorIdx = db.vendors.findIndex(v => v.id === id);
        if (vendorIdx !== -1) {
          const newDoc = {
            id: `DOC-V${id.substring(3)}-${db.vendors[vendorIdx].documents.length + 1}`,
            name: body.name,
            type: body.type,
            status: 'Verified',
            expiry: body.expiry
          };
          db.vendors[vendorIdx].documents.push(newDoc);
          db.vendors[vendorIdx].history.unshift({
            date: new Date().toISOString().split('T')[0],
            event: `Uploaded compliance document: ${body.name}`,
            user: activeUserName
          });

          db.auditLogs.unshift({
            id: `AUD-0${db.auditLogs.length + 1}`,
            action: 'Upload Vendor Document',
            user: activeUserName,
            date: new Date().toISOString().replace('T', ' ').substring(0, 19),
            details: `Uploaded ${body.name} for vendor ${id}`
          });

          resolve({
            data: db.vendors[vendorIdx],
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              status: 404,
              data: { message: 'Vendor not found' }
            }
          });
        }
        return;
      }

      if (url === '/risk' && method === 'GET') {
        resolve({
          data: db.riskData,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
        return;
      }

      if (url === '/notifications' && method === 'GET') {
        resolve({
          data: db.notifications,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
        return;
      }

      if (url.startsWith('/notifications/') && url.endsWith('/read') && method === 'PUT') {
        const id = url.split('/')[2];
        const notifIdx = db.notifications.findIndex(n => n.id === id);
        if (notifIdx !== -1) {
          db.notifications[notifIdx].status = 'Read';
          resolve({
            data: db.notifications[notifIdx],
            status: 200,
            statusText: 'OK',
            headers: {},
            config
          });
        } else {
          reject({
            response: {
              status: 404,
              data: { message: 'Notification not found' }
            }
          });
        }
        return;
      }

      if (url === '/reports' && method === 'GET') {
        resolve({
          data: db.reports,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
        return;
      }

      if (url === '/audit' && method === 'GET') {
        resolve({
          data: db.auditLogs,
          status: 200,
          statusText: 'OK',
          headers: {},
          config
        });
        return;
      }

  reject({
    response: {
      status: 404,
      data: { message: 'API Route Not Found' }
    }
  });
};

apiClient.defaults.adapter = (config) => {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      try {
        const safeResolve = (response) => {
          if (response && response.data !== undefined) {
            response.data = deepCopy(response.data);
          }
          resolve(response);
        };
        handleRequest(config, safeResolve, reject);
      } catch (err) {
        reject({
          response: {
            status: 500,
            data: { message: err.message || 'Internal mock server error' }
          }
        });
      }
    }, 400);
  });
};

export default apiClient;
