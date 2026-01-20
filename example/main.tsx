import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom/client';
import { Shimmer } from '../src';
import './main.css';

// =============================================================================
// TYPES
// =============================================================================

interface User {
  name: string;
  email: string;
  role: string;
  avatar: string;
  status: 'online' | 'away' | 'offline';
}

interface StatCard {
  label: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

interface Transaction {
  id: string;
  description: string;
  amount: string;
  date: string;
  status: 'completed' | 'pending' | 'failed';
}

interface ActivityItem {
  id: string;
  user: string;
  action: string;
  target: string;
  time: string;
}

interface TeamMember {
  id: string;
  name: string;
  role: string;
  avatar: string;
}

// =============================================================================
// TEMPLATE DATA (Mock data for shimmer skeletons)
// =============================================================================

const userTemplate: User = {
  name: 'Loading User...',
  email: 'loading@example.com',
  role: 'Loading...',
  avatar: 'https://via.placeholder.com/64',
  status: 'offline',
};

const statsTemplate: StatCard[] = [
  { label: 'Total Revenue', value: '$00,000', change: '+0.0%', trend: 'up' },
  { label: 'Active Users', value: '0,000', change: '+0.0%', trend: 'up' },
  { label: 'Conversion', value: '0.0%', change: '-0.0%', trend: 'down' },
  { label: 'Avg. Order', value: '$000', change: '+0.0%', trend: 'up' },
];

const transactionsTemplate: Transaction[] = [
  { id: '1', description: 'Loading transaction...', amount: '$0.00', date: 'Jan 00', status: 'pending' },
  { id: '2', description: 'Loading transaction...', amount: '$0.00', date: 'Jan 00', status: 'pending' },
  { id: '3', description: 'Loading transaction...', amount: '$0.00', date: 'Jan 00', status: 'pending' },
  { id: '4', description: 'Loading transaction...', amount: '$0.00', date: 'Jan 00', status: 'pending' },
];

const activityTemplate: ActivityItem[] = [
  { id: '1', user: 'Loading...', action: 'performed', target: 'an action', time: '0m ago' },
  { id: '2', user: 'Loading...', action: 'performed', target: 'an action', time: '0m ago' },
  { id: '3', user: 'Loading...', action: 'performed', target: 'an action', time: '0m ago' },
];

const teamTemplate: TeamMember[] = [
  { id: '1', name: 'Loading...', role: 'Role', avatar: 'https://via.placeholder.com/40' },
  { id: '2', name: 'Loading...', role: 'Role', avatar: 'https://via.placeholder.com/40' },
  { id: '3', name: 'Loading...', role: 'Role', avatar: 'https://via.placeholder.com/40' },
  { id: '4', name: 'Loading...', role: 'Backend Developer', avatar: 'https://via.placeholder.com/40' },
];

// =============================================================================
// REAL DATA (Simulated API responses)
// =============================================================================

const realUser: User = {
  name: 'Sarah Johnson',
  email: 'sarah.johnson@company.com',
  role: 'Product Manager',
  avatar: 'https://i.pravatar.cc/64?img=5',
  status: 'online',
};

const realStats: StatCard[] = [
  { label: 'Total Revenue', value: '$48,352', change: '+12.5%', trend: 'up' },
  { label: 'Active Users', value: '2,847', change: '+8.2%', trend: 'up' },
  { label: 'Conversion', value: '3.24%', change: '-0.4%', trend: 'down' },
  { label: 'Avg. Order', value: '$284', change: '+5.7%', trend: 'up' },
];

const realTransactions: Transaction[] = [
  { id: '1', description: 'Premium Subscription', amount: '$99.00', date: 'Jan 20', status: 'completed' },
  { id: '2', description: 'API Credits Purchase', amount: '$250.00', date: 'Jan 19', status: 'completed' },
  { id: '3', description: 'Team License Upgrade', amount: '$499.00', date: 'Jan 18', status: 'pending' },
  { id: '4', description: 'Support Add-on', amount: '$49.00', date: 'Jan 17', status: 'completed' },
];

const realActivity: ActivityItem[] = [
  { id: '1', user: 'Mike Chen', action: 'deployed', target: 'v2.4.1 to production', time: '5m ago' },
  { id: '2', user: 'Emily Davis', action: 'approved', target: 'design review for Dashboard', time: '23m ago' },
  { id: '3', user: 'Alex Rivera', action: 'commented on', target: 'Issue #847', time: '1h ago' },
];

const realTeam: TeamMember[] = [
  { id: '1', name: 'Mike Chen', role: 'Lead Developer', avatar: 'https://i.pravatar.cc/40?img=11' },
  { id: '2', name: 'Emily Davis', role: 'UX Designer', avatar: 'https://i.pravatar.cc/40?img=9' },
  { id: '3', name: 'Alex Rivera', role: 'Backend Engineer', avatar: 'https://i.pravatar.cc/40?img=12' },
  { id: '4', name: 'Jordan Lee', role: 'DevOps', avatar: 'https://i.pravatar.cc/40?img=15' },
];

// =============================================================================
// COMPONENTS
// =============================================================================

// User Profile Header
const UserProfile = ({ user }: { user: User }) => (
  <div className="user-profile">
    <img src={user.avatar} alt={user.name} className="user-avatar" />
    <div className="user-info">
      <h2>{user.name}</h2>
      <p className="user-email">{user.email}</p>
      <span className={`user-status ${user.status}`}>{user.role}</span>
    </div>
    <div className={`status-indicator ${user.status}`}>
      <span className="status-dot"></span>
      {user.status}
    </div>
  </div>
);

// Stats Cards Grid
const StatsGrid = ({ stats }: { stats: StatCard[] }) => (
  <div className="stats-grid">
    {stats.map((stat, index) => (
      <div key={index} className="stat-card">
        <p className="stat-label">{stat.label}</p>
        <h3 className="stat-value">{stat.value}</h3>
        <span className={`stat-change ${stat.trend}`}>
          {stat.trend === 'up' ? '↑' : '↓'} {stat.change}
        </span>
      </div>
    ))}
  </div>
);

// Transactions List
const TransactionsList = ({ transactions }: { transactions: Transaction[] }) => (
  <div className="transactions-list">
    <h3 className="section-title">Recent Transactions</h3>
    <div className="transactions">
      {transactions.map((tx) => (
        <div key={tx.id} className="transaction-item">
          <div className="tx-info">
            <p className="tx-description">{tx.description}</p>
            <span className="tx-date">{tx.date}</span>
          </div>
          <div className="tx-right">
            <span className="tx-amount">{tx.amount}</span>
            <span className={`tx-status ${tx.status}`}>{tx.status}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Activity Feed
const ActivityFeed = ({ activities }: { activities: ActivityItem[] }) => (
  <div className="activity-feed">
    <h3 className="section-title">Recent Activity</h3>
    <div className="activities">
      {activities.map((activity) => (
        <div key={activity.id} className="activity-item">
          <div className="activity-dot"></div>
          <div className="activity-content">
            <p>
              <strong>{activity.user}</strong> {activity.action}{' '}
              <span className="activity-target">{activity.target}</span>
            </p>
            <span className="activity-time">{activity.time}</span>
          </div>
        </div>
      ))}
    </div>
  </div>
);

// Team Members
const TeamMembers = ({ members }: { members: TeamMember[] }) => (
  <div className="team-members">
    <h3 className="section-title">Team</h3>
    <div className="members-grid">
      {members.map((member) => (
        <div key={member.id} className="member-card">
          <img src={member.avatar} alt={member.name} className="member-avatar" />
          <p className="member-name">{member.name}</p>
          <span className="member-role">{member.role}</span>
        </div>
      ))}
    </div>
  </div>
);

// =============================================================================
// MAIN APP
// =============================================================================

function App() {
  // Independent loading states for each section
  const [loadingUser, setLoadingUser] = useState(true);
  const [loadingStats, setLoadingStats] = useState(true);
  const [loadingTransactions, setLoadingTransactions] = useState(true);
  const [loadingActivity, setLoadingActivity] = useState(true);
  const [loadingTeam, setLoadingTeam] = useState(true);

  // Data states
  const [user, setUser] = useState<User | null>(null);
  const [stats, setStats] = useState<StatCard[] | null>(null);
  const [transactions, setTransactions] = useState<Transaction[] | null>(null);
  const [activity, setActivity] = useState<ActivityItem[] | null>(null);
  const [team, setTeam] = useState<TeamMember[] | null>(null);

  // Simulate independent API calls with different response times
  useEffect(() => {
    // User loads first (fast)
    setTimeout(() => {
      setUser(realUser);
      setLoadingUser(false);
    }, 800);

    // Stats load second
    setTimeout(() => {
      setStats(realStats);
      setLoadingStats(false);
    }, 1200);

    // Team loads third
    setTimeout(() => {
      setTeam(realTeam);
      setLoadingTeam(false);
    }, 1600);

    // Activity loads fourth
    setTimeout(() => {
      setActivity(realActivity);
      setLoadingActivity(false);
    }, 2000);

    // Transactions load last (slowest API)
    setTimeout(() => {
      setTransactions(realTransactions);
      setLoadingTransactions(false);
    }, 2500);
  }, []);

  // Reset all data
  const handleReload = () => {
    setLoadingUser(true);
    setLoadingStats(true);
    setLoadingTransactions(true);
    setLoadingActivity(true);
    setLoadingTeam(true);
    setUser(null);
    setStats(null);
    setTransactions(null);
    setActivity(null);
    setTeam(null);

    // Re-trigger the effect
    setTimeout(() => {
      setUser(realUser);
      setLoadingUser(false);
    }, 800);

    setTimeout(() => {
      setStats(realStats);
      setLoadingStats(false);
    }, 1200);

    setTimeout(() => {
      setTeam(realTeam);
      setLoadingTeam(false);
    }, 1600);

    setTimeout(() => {
      setActivity(realActivity);
      setLoadingActivity(false);
    }, 2000);

    setTimeout(() => {
      setTransactions(realTransactions);
      setLoadingTransactions(false);
    }, 2500);
  };

  return (
    <div className="dashboard">
      {/* Header */}
      <header className="dashboard-header">
        <div className="header-content">
          <h1>✨ Shimmer From Structure</h1>
          <p>Real-world dashboard demo with independent loading states</p>
        </div>
        <button className="reload-btn" onClick={handleReload}>
          ↻ Reload Demo
        </button>
      </header>

      {/* User Profile Section */}
      <section className="dashboard-section">
        <Shimmer loading={loadingUser} templateProps={{ user: userTemplate }}>
          <UserProfile user={user || userTemplate} />
        </Shimmer>
      </section>

      {/* Stats Section */}
      <section className="dashboard-section">
        <Shimmer
          loading={loadingStats}
          templateProps={{ stats: statsTemplate }}
        >
          <StatsGrid stats={stats || statsTemplate} />
        </Shimmer>
      </section>

      {/* Main Content Grid */}
      <div className="content-grid">
        {/* Transactions */}
        <section className="dashboard-section">
          <Shimmer
            loading={loadingTransactions}
            templateProps={{ transactions: transactionsTemplate }}
          >
            <TransactionsList transactions={transactions || transactionsTemplate} />
          </Shimmer>
        </section>

        {/* Right Sidebar */}
        <div className="sidebar">
          {/* Activity Feed */}
          <section className="dashboard-section">
            <Shimmer
              loading={loadingActivity}
              templateProps={{ activities: activityTemplate }}
            >
              <ActivityFeed activities={activity || activityTemplate} />
            </Shimmer>
          </section>

          {/* Team Members */}
          <section className="dashboard-section">
            <Shimmer
              loading={loadingTeam}
              templateProps={{ members: teamTemplate }}
            >
              <TeamMembers members={team || teamTemplate} />
            </Shimmer>
          </section>
        </div>
      </div>

      {/* Footer */}
      <footer className="dashboard-footer">
        <p>
          Each section loads independently with its own shimmer effect.
          <br />
          <code>templateProps</code> injects mock data to generate the skeleton structure.
        </p>
      </footer>
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
