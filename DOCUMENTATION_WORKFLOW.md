# eTribe Documentation Workflow

## Project Overview

**eTribe** is a comprehensive React-based management system for tribal/community organizations. It provides modules for member management, event management, admin controls, notifications, and more.

### Tech Stack
- **Frontend**: React 19.1.0 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **HTTP Client**: Axios
- **Notifications**: React Toastify
- **Charts**: Recharts
- **Icons**: Lucide React & React Icons
- **Rich Text**: CKEditor 5
- **PDF Generation**: jsPDF
- **Excel**: xlsx

## Documentation Structure

### 1. Project Setup & Architecture

#### 1.1 Project Structure
```
src/
├── api/                    # API configuration
│   └── axiosConfig.js     # Axios instance with interceptors
├── components/            # Reusable UI components
│   ├── Layout/           # Layout components (Sidebar, TopBar, Footer)
│   ├── Sidebar/          # Navigation sidebar
│   ├── StatusCards/      # Dashboard status cards
│   ├── AnalyticsGraph/   # Charts and analytics
│   ├── ImportantContacts/ # Contact management
│   ├── EventsSection/    # Event-related components
│   ├── PastEventCard/    # Past events display
│   ├── TotalEventCard/   # Total events statistics
│   └── UpcomingEvents/   # Upcoming events display
├── context/              # React Context providers
│   ├── GroupDataContext.jsx  # Group/organization data
│   └── ContactsContext.jsx   # Contacts management
├── pages/                # Main application pages
├── utils/                # Utility functions
│   └── apiHeaders.js     # API header utilities
└── assets/              # Static assets
```

#### 1.2 Environment Configuration
Required environment variables:
```env
VITE_API_BASE_URL=https://api.etribes.ezcrm.site
VITE_CLIENT_SERVICE=your_client_service
VITE_AUTH_KEY=your_auth_key
VITE_RURL=your_rurl
```

### 2. Core Modules Documentation

#### 2.1 Authentication & Authorization
- **Login System**: JWT-based authentication
- **Protected Routes**: Route-level authentication
- **Token Management**: LocalStorage-based token storage
- **Auto-logout**: Token expiration handling

#### 2.2 Member Services Module
**Pages**: `ActiveMembers.jsx`, `PendingApproval.jsx`, `MembershipExpired.jsx`, `PaymentDetails.jsx`, `MemberDetail.jsx`

**Features**:
- Member registration and approval workflow
- Membership status tracking
- Payment history and details
- Member profile management
- Bulk operations support

#### 2.3 Admin Management Module
**Pages**: `AdminAccounts.jsx`, `UserRoles.jsx`, `RoleManagement.jsx`

**Features**:
- Admin account creation and management
- Role-based access control (RBAC)
- Permission management
- User role assignment

#### 2.4 Event Management Module
**Pages**: `AllEvents.jsx`, `UpcomingEventsPage.jsx`, `PastEvents.jsx`, `Calendar.jsx`

**Features**:
- Event creation and management
- Calendar integration
- Event categorization (upcoming/past)
- Event details and registration
- Event analytics

#### 2.5 Notification System
**Pages**: `Feedbacks.jsx`, `Circulars.jsx`

**Features**:
- Feedback collection and management
- Circular announcements
- Notification preferences
- Message templates

#### 2.6 Grievance Management
**Pages**: `GrievancesActive.jsx`, `GrievancesPending.jsx`, `GrievancesClosed.jsx`

**Features**:
- Grievance submission and tracking
- Status management (active/pending/closed)
- Resolution workflow
- Grievance analytics

#### 2.7 Master Settings
**Pages**: `GroupData.jsx`, `SMTPSettings.jsx`, `MessageSettings.jsx`, `UserAdditionalFields.jsx`, `CompanyAdditionalFields.jsx`, `MembershipPlans.jsx`

**Features**:
- Organization profile management
- Email configuration
- Custom field management
- Membership plan configuration

### 3. API Documentation

#### 3.1 API Configuration
- **Base URL**: Configurable via environment variables
- **Authentication**: Bearer token in Authorization header
- **Headers**: Client-Service, Auth-Key, rurl, Content-Type
- **Interceptors**: Automatic token injection and error handling

#### 3.2 Key API Endpoints
```javascript
// Authentication
POST /login                    // User login
POST /logout                   // User logout

// Member Management
POST /member/add              // Add new member
POST /member/edit             // Edit member
POST /member/remove           // Remove member
GET  /member/list            // Get member list
GET  /member/{id}            // Get member details

// Event Management
POST /event/add              // Add new event
POST /event/edit             // Edit event
POST /event/remove           // Remove event
GET  /event/list            // Get event list
GET  /event/future          // Get upcoming events
GET  /event/past            // Get past events

// Group Settings
POST /groupSettings          // Get group settings
POST /groupSettings/update   // Update group settings

// Contacts
GET  /contact               // Get contacts list
POST /contact/add           // Add contact
POST /contact/edit          // Edit contact
POST /contact/remove        // Remove contact
```

### 4. Component Documentation

#### 4.1 Layout Components
- **DashboardLayout**: Main application layout wrapper
- **Sidebar**: Navigation menu with collapsible design
- **TopBar**: Header with user info and actions
- **Footer**: Application footer

#### 4.2 Dashboard Components
- **StatusCards**: Key metrics display
- **AnalyticsGraph**: Member analytics charts
- **ImportantContacts**: Contact information display
- **Event Cards**: Event statistics and quick access

#### 4.3 Context Providers
- **GroupDataContext**: Organization data management
- **ContactsContext**: Contact data management

### 5. State Management

#### 5.1 Context Usage
```javascript
// Group Data Context
const { groupData, loading, error, updateGroupData } = useGroupData();

// Contacts Context
const { contactsData, loading, error, addContact, editContact, deleteContact } = useContacts();
```

#### 5.2 Local State Management
- Component-level state using React hooks
- Form state management
- Loading and error states

### 6. Styling & UI/UX

#### 6.1 Design System
- **Framework**: Tailwind CSS
- **Theme**: Dark/Light mode support
- **Components**: Custom component library
- **Responsive**: Mobile-first design

#### 6.2 Key Design Patterns
- **Glassmorphism**: Modern UI effects
- **Card-based Layout**: Information organization
- **Responsive Grid**: Adaptive layouts
- **Consistent Spacing**: 4px base unit system

### 7. Development Workflow

#### 7.1 Setup Instructions
```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Lint code
npm run lint

# Preview production build
npm run preview
```

#### 7.2 Code Organization
- **Feature-based Structure**: Components grouped by feature
- **Consistent Naming**: PascalCase for components, camelCase for functions
- **Import Organization**: Grouped imports (React, third-party, local)
- **Component Structure**: Props, state, effects, handlers, render

#### 7.3 Best Practices
- **Error Handling**: Try-catch blocks with user-friendly messages
- **Loading States**: Skeleton loaders and loading indicators
- **Form Validation**: Client-side validation with error display
- **API Error Handling**: Centralized error handling with toast notifications
- **Responsive Design**: Mobile-first approach with breakpoint considerations

### 8. Testing Strategy

#### 8.1 Testing Levels
- **Unit Tests**: Component and utility function testing
- **Integration Tests**: API integration testing
- **E2E Tests**: User workflow testing

#### 8.2 Testing Tools
- **Jest**: Unit testing framework
- **React Testing Library**: Component testing
- **Cypress**: E2E testing (recommended)

### 9. Deployment

#### 9.1 Build Process
```bash
# Production build
npm run build

# Environment configuration
# Ensure all required env variables are set
```

#### 9.2 Deployment Checklist
- [ ] Environment variables configured
- [ ] API endpoints updated for production
- [ ] Build optimization completed
- [ ] Error monitoring configured
- [ ] Performance monitoring enabled

### 10. Maintenance & Updates

#### 10.1 Regular Tasks
- **Dependency Updates**: Monthly security updates
- **Performance Monitoring**: Regular performance audits
- **User Feedback**: Continuous improvement based on feedback
- **Security Audits**: Regular security reviews

#### 10.2 Documentation Updates
- **API Changes**: Update API documentation
- **New Features**: Add feature documentation
- **Bug Fixes**: Update troubleshooting guides
- **User Guides**: Maintain user documentation

### 11. Troubleshooting Guide

#### 11.1 Common Issues
- **Authentication Errors**: Check token validity and API credentials
- **API Connection Issues**: Verify API base URL and network connectivity
- **Build Errors**: Check dependency versions and Node.js compatibility
- **Performance Issues**: Monitor bundle size and API response times

#### 11.2 Debug Tools
- **React DevTools**: Component inspection
- **Network Tab**: API request monitoring
- **Console Logging**: Strategic console.log placement
- **Error Boundaries**: Graceful error handling

### 12. Future Enhancements

#### 12.1 Planned Features
- **Real-time Notifications**: WebSocket integration
- **Advanced Analytics**: Enhanced reporting capabilities
- **Mobile App**: React Native version
- **API Documentation**: Swagger/OpenAPI integration

#### 12.2 Technical Improvements
- **TypeScript Migration**: Type safety enhancement
- **Performance Optimization**: Code splitting and lazy loading
- **Accessibility**: WCAG compliance improvements
- **Internationalization**: Multi-language support

---

## Documentation Maintenance

### Update Frequency
- **API Documentation**: Update with each API change
- **Component Documentation**: Update with component modifications
- **User Guides**: Update with feature releases
- **Troubleshooting**: Update based on user feedback

### Documentation Tools
- **Markdown**: Primary documentation format
- **JSDoc**: Code documentation
- **Storybook**: Component documentation (recommended)
- **Swagger**: API documentation (recommended)

### Review Process
1. **Technical Review**: Code changes reviewed by team
2. **Documentation Review**: Documentation updated accordingly
3. **User Testing**: Documentation tested by end users
4. **Feedback Integration**: User feedback incorporated

This documentation workflow ensures comprehensive coverage of the eTribe project while maintaining clarity and usability for developers and stakeholders. 