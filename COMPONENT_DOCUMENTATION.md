# eTribe Component Documentation

## Overview

The eTribe application uses a modular component architecture with reusable UI components organized by feature. This document provides detailed documentation for all components in the system.

## Component Architecture

### Directory Structure
```
src/components/
├── Layout/              # Layout and navigation components
├── Sidebar/             # Navigation sidebar
├── StatusCards/         # Dashboard status indicators
├── AnalyticsGraph/      # Charts and analytics
├── ImportantContacts/   # Contact management
├── EventsSection/       # Event-related components
├── PastEventCard/       # Past events display
├── TotalEventCard/      # Event statistics
└── UpcomingEvents/      # Upcoming events display
```

## Layout Components

### DashboardLayout
**File**: `src/components/Layout/DashboardLayout.jsx`

**Purpose**: Main application layout wrapper that provides consistent structure across all pages.

**Props**:
```javascript
{
  children: React.ReactNode  // Page content to render
}
```

**Features**:
- Responsive layout with sidebar and main content area
- Dark/light mode support
- Collapsible sidebar
- Fixed header and footer
- Glassmorphism design elements

**Usage**:
```javascript
import DashboardLayout from '../components/Layout/DashboardLayout';

function MyPage() {
  return (
    <DashboardLayout>
      <div>Page content here</div>
    </DashboardLayout>
  );
}
```

### Sidebar
**File**: `src/components/Sidebar/Sidebar.jsx`

**Purpose**: Navigation sidebar with collapsible menu structure.

**Props**:
```javascript
{
  className: string,           // Additional CSS classes
  collapsed: boolean,          // Whether sidebar is collapsed
  setCollapsed: function       // Function to toggle collapse state
}
```

**Features**:
- Collapsible navigation menu
- Multi-level dropdown menus
- Active route highlighting
- Responsive design
- Icon-based navigation
- User profile section

**Menu Structure**:
```javascript
const menuItems = [
  {
    label: "Dashboard",
    icon: <FiGrid size={20} />,
    path: "/dashboard",
    dropdown: false,
  },
  {
    label: "Members Services",
    icon: <FiUsers size={20} />,
    path: "#",
    basePath: "/members-services",
    dropdown: true,
    subItems: [
      { label: "Active Members", path: "/members-services/active" },
      { label: "Pending Approval", path: "/members-services/pending-approval" },
      { label: "Membership Expired", path: "/members-services/expired" },
      { label: "Payment Details", path: "/members-services/payment-details" },
    ],
  },
  // ... more menu items
];
```

### TopBar
**File**: `src/components/Layout/TopBar.jsx`

**Purpose**: Header component with user information and quick actions.

**Features**:
- User profile display
- Notification indicators
- Search functionality
- Theme toggle
- Logout functionality
- Breadcrumb navigation

### Footer
**File**: `src/components/Layout/Footer.jsx`

**Purpose**: Application footer with copyright and links.

**Features**:
- Copyright information
- Version display
- Quick links
- Responsive design

## Dashboard Components

### StatusCards
**File**: `src/components/StatusCards/StatusCards.jsx`

**Purpose**: Display key metrics and statistics on the dashboard.

**Features**:
- Real-time data fetching
- Animated counters
- Color-coded status indicators
- Responsive grid layout
- Loading states

**Metrics Displayed**:
- Total Members
- Active Members
- Pending Approvals
- Expired Memberships
- Total Events
- Upcoming Events

**Usage**:
```javascript
import StatusCards from '../components/StatusCards/StatusCards';

function Dashboard() {
  return (
    <div>
      <StatusCards />
      {/* Other dashboard content */}
    </div>
  );
}
```

### AnalyticsGraph
**File**: `src/components/AnalyticsGraph/AnalyticsGraph.jsx`

**Purpose**: Display member analytics and trends using charts.

**Props**:
```javascript
{
  containerClass: string,    // CSS classes for container
  chartHeight: string        // Height of the chart
}
```

**Features**:
- Line charts for trends
- Bar charts for comparisons
- Interactive tooltips
- Responsive design
- Data filtering options
- Export functionality

**Chart Types**:
- Member registration trends
- Event participation rates
- Payment statistics
- Activity heatmaps

### ImportantContacts
**File**: `src/components/ImportantContacts/ImportantContacts.jsx`

**Purpose**: Display and manage important contact information.

**Features**:
- Contact list display
- Search and filter functionality
- Contact details modal
- Quick contact actions
- Department-based organization

**Contact Data Structure**:
```javascript
{
  id: string,
  dept: string,        // Department
  name: string,        // Contact name
  contact: string,     // Phone number
  email: string,       // Email address
  address: string      // Physical address
}
```

## Event Components

### PastEventCard
**File**: `src/components/PastEventCard/PastEventCard.jsx`

**Purpose**: Display past events with statistics and quick access.

**Features**:
- Past events count
- Event statistics
- Quick navigation to past events
- Visual indicators
- Hover effects

### TotalEventCard
**File**: `src/components/TotalEventCard/TotalEventCard.jsx`

**Purpose**: Display total events statistics and overview.

**Features**:
- Total events count
- Event type breakdown
- Quick statistics
- Visual progress indicators

### UpcomingEvents
**File**: `src/components/UpcomingEvents/UpcomingEvents.jsx`

**Purpose**: Display upcoming events with details and actions.

**Props**:
```javascript
{
  containerClass: string,    // CSS classes for container
  chartHeight: string        // Height of the component
}
```

**Features**:
- Upcoming events list
- Event details display
- Registration functionality
- Calendar integration
- Event filtering
- Quick actions (edit, delete, view)

**Event Data Structure**:
```javascript
{
  id: string,
  title: string,
  description: string,
  date: string,
  time: string,
  location: string,
  type: string,
  max_participants: number,
  current_participants: number,
  registration_required: boolean,
  status: string
}
```

## Context Providers

### GroupDataContext
**File**: `src/context/GroupDataContext.jsx`

**Purpose**: Manage organization/group data across the application.

**Context Value**:
```javascript
{
  groupData: {
    name: string,
    email: string,
    logo: string,
    signature: string,
    address: string,
    contact: string,
    website: string
  },
  loading: boolean,
  error: string | null,
  fetchGroupData: function,
  updateGroupData: function
}
```

**Usage**:
```javascript
import { useGroupData } from '../context/GroupDataContext';

function MyComponent() {
  const { groupData, loading, error, updateGroupData } = useGroupData();
  
  // Use group data in component
}
```

**Features**:
- Automatic data fetching
- Real-time updates
- Error handling
- Loading states
- Data persistence

### ContactsContext
**File**: `src/context/ContactsContext.jsx`

**Purpose**: Manage contact data and operations across the application.

**Context Value**:
```javascript
{
  contactsData: Array,
  loading: boolean,
  error: string | null,
  addContact: function,
  editContact: function,
  deleteContact: function,
  fetchContacts: function
}
```

**Usage**:
```javascript
import { useContacts } from '../context/ContactsContext';

function MyComponent() {
  const { contactsData, addContact, editContact, deleteContact } = useContacts();
  
  // Use contact operations in component
}
```

**Features**:
- CRUD operations for contacts
- Real-time data synchronization
- Error handling
- Loading states
- Data validation

## Utility Components

### LoadingSpinner
**Purpose**: Display loading states during data fetching.

**Props**:
```javascript
{
  size: string,        // Size of spinner (sm, md, lg)
  color: string,       // Color of spinner
  text: string        // Loading text
}
```

### ErrorBoundary
**Purpose**: Catch and handle component errors gracefully.

**Features**:
- Error catching
- Fallback UI
- Error reporting
- Recovery mechanisms

### Modal
**Purpose**: Reusable modal component for dialogs and forms.

**Props**:
```javascript
{
  isOpen: boolean,
  onClose: function,
  title: string,
  children: React.ReactNode,
  size: string        // sm, md, lg, xl
}
```

### Form Components

#### InputField
**Purpose**: Reusable form input component.

**Props**:
```javascript
{
  label: string,
  name: string,
  type: string,       // text, email, password, etc.
  value: string,
  onChange: function,
  error: string,
  required: boolean,
  placeholder: string
}
```

#### SelectField
**Purpose**: Reusable select dropdown component.

**Props**:
```javascript
{
  label: string,
  name: string,
  value: string,
  onChange: function,
  options: Array,
  error: string,
  required: boolean,
  placeholder: string
}
```

#### TextAreaField
**Purpose**: Reusable textarea component.

**Props**:
```javascript
{
  label: string,
  name: string,
  value: string,
  onChange: function,
  error: string,
  required: boolean,
  placeholder: string,
  rows: number
}
```

## Component Best Practices

### 1. Props Validation
```javascript
import PropTypes from 'prop-types';

MyComponent.propTypes = {
  title: PropTypes.string.isRequired,
  count: PropTypes.number,
  onAction: PropTypes.func,
  children: PropTypes.node
};
```

### 2. Default Props
```javascript
MyComponent.defaultProps = {
  count: 0,
  onAction: () => {},
  children: null
};
```

### 3. Component Structure
```javascript
import React, { useState, useEffect } from 'react';

const MyComponent = ({ prop1, prop2, onAction }) => {
  // 1. State declarations
  const [state, setState] = useState(initialState);
  
  // 2. Effects
  useEffect(() => {
    // Effect logic
  }, [dependencies]);
  
  // 3. Event handlers
  const handleClick = () => {
    // Handler logic
  };
  
  // 4. Render
  return (
    <div>
      {/* Component JSX */}
    </div>
  );
};
```

### 4. Error Handling
```javascript
const MyComponent = () => {
  const [error, setError] = useState(null);
  
  const handleError = (err) => {
    setError(err.message);
    toast.error(err.message);
  };
  
  if (error) {
    return <div className="error">{error}</div>;
  }
  
  return <div>Component content</div>;
};
```

### 5. Loading States
```javascript
const MyComponent = () => {
  const [loading, setLoading] = useState(true);
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  return <div>Loaded content</div>;
};
```

## Styling Guidelines

### 1. Tailwind CSS Classes
- Use utility classes for styling
- Follow responsive design patterns
- Maintain consistent spacing
- Use semantic color names

### 2. Component Styling
```javascript
// Good
<div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-4">

// Avoid
<div style={{ backgroundColor: 'white', borderRadius: '8px' }}>
```

### 3. Responsive Design
```javascript
// Mobile-first approach
<div className="w-full md:w-1/2 lg:w-1/3">
```

### 4. Dark Mode Support
```javascript
// Always include dark mode variants
<div className="bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100">
```

## Performance Optimization

### 1. Memoization
```javascript
import React, { memo } from 'react';

const MyComponent = memo(({ data }) => {
  return <div>{data}</div>;
});
```

### 2. Lazy Loading
```javascript
import { lazy, Suspense } from 'react';

const LazyComponent = lazy(() => import('./LazyComponent'));

function App() {
  return (
    <Suspense fallback={<LoadingSpinner />}>
      <LazyComponent />
    </Suspense>
  );
}
```

### 3. Event Optimization
```javascript
// Use useCallback for event handlers
const handleClick = useCallback(() => {
  // Handler logic
}, [dependencies]);
```

## Testing Components

### 1. Unit Testing
```javascript
import { render, screen, fireEvent } from '@testing-library/react';
import MyComponent from './MyComponent';

test('renders component correctly', () => {
  render(<MyComponent title="Test" />);
  expect(screen.getByText('Test')).toBeInTheDocument();
});
```

### 2. Integration Testing
```javascript
test('handles user interactions', () => {
  render(<MyComponent onAction={mockFn} />);
  fireEvent.click(screen.getByRole('button'));
  expect(mockFn).toHaveBeenCalled();
});
```

## Component Documentation Template

### Component Name
**File**: `path/to/component.jsx`

**Purpose**: Brief description of what the component does.

**Props**:
```javascript
{
  prop1: type,        // Description
  prop2: type,        // Description
  // ... more props
}
```

**Features**:
- Feature 1
- Feature 2
- Feature 3

**Usage**:
```javascript
import ComponentName from './ComponentName';

function MyPage() {
  return <ComponentName prop1="value" />;
}
```

**Examples**:
```javascript
// Basic usage
<ComponentName title="Hello" />

// With all props
<ComponentName 
  title="Hello"
  count={5}
  onAction={() => console.log('clicked')}
/>
```

This component documentation provides comprehensive coverage of all components in the eTribe application, ensuring maintainability and developer productivity. 