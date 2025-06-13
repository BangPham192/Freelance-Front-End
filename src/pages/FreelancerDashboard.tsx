import React from 'react';
import { Layout, Tabs, Table, Card, Typography, Tag, Space, Statistic } from 'antd';
import { DollarOutlined, ClockCircleOutlined, CheckCircleOutlined } from '@ant-design/icons';
import Navbar from '../components/Navbar';
import type { ColumnsType } from 'antd/es/table';

const { Content } = Layout;
const { Title } = Typography;

// Mock data types
interface Proposal {
  id: number;
  jobTitle: string;
  client: string;
  proposedAmount: number;
  status: 'pending' | 'accepted' | 'rejected';
  submittedDate: string;
}

interface ActiveJob {
  id: number;
  jobTitle: string;
  client: string;
  amount: number;
  deadline: string;
  progress: number;
}

interface EarningRecord {
  id: number;
  jobTitle: string;
  client: string;
  amount: number;
  date: string;
  status: 'completed' | 'in progress';
}

// Mock data
const mockProposals: Proposal[] = [
  {
    id: 1,
    jobTitle: 'React Native Mobile App',
    client: 'Tech Solutions Inc',
    proposedAmount: 2500,
    status: 'pending',
    submittedDate: '2025-06-05'
  },
  {
    id: 2,
    jobTitle: 'E-commerce Website',
    client: 'Fashion Retail Co',
    proposedAmount: 3500,
    status: 'accepted',
    submittedDate: '2025-06-03'
  },
];

const mockActiveJobs: ActiveJob[] = [
  {
    id: 1,
    jobTitle: 'E-commerce Website',
    client: 'Fashion Retail Co',
    amount: 3500,
    deadline: '2025-07-15',
    progress: 60
  },
];

const mockEarnings: EarningRecord[] = [
  {
    id: 1,
    jobTitle: 'Portfolio Website',
    client: 'Personal Brand LLC',
    amount: 1800,
    date: '2025-05-28',
    status: 'completed'
  },
  {
    id: 2,
    jobTitle: 'E-commerce Website',
    client: 'Fashion Retail Co',
    amount: 3500,
    date: '2025-06-15',
    status: 'in progress'
  },
];

const FreelancerDashboard: React.FC = () => {
  // Proposals Table Columns
  const proposalColumns: ColumnsType<Proposal> = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (text) => <Typography.Link>{text}</Typography.Link>,
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Amount',
      dataIndex: 'proposedAmount',
      key: 'proposedAmount',
      render: (amount) => `$${amount}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: Proposal['status']) => {
        const colors: Record<Proposal['status'], string> = {
          pending: 'gold',
          accepted: 'green',
          rejected: 'red',
        };
        return <Tag color={colors[status]}>{status.toUpperCase()}</Tag>;
      },
    },
    {
      title: 'Submitted',
      dataIndex: 'submittedDate',
      key: 'submittedDate',
    },
  ];

  // Active Jobs Table Columns
  const activeJobsColumns: ColumnsType<ActiveJob> = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
      render: (text) => <Typography.Link>{text}</Typography.Link>,
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount}`,
    },
    {
      title: 'Deadline',
      dataIndex: 'deadline',
      key: 'deadline',
    },
    {
      title: 'Progress',
      dataIndex: 'progress',
      key: 'progress',
      render: (progress) => (
        <Tag color="blue">{progress}% Complete</Tag>
      ),
    },
  ];

  // Earnings Table Columns
  const earningsColumns: ColumnsType<EarningRecord> = [
    {
      title: 'Job Title',
      dataIndex: 'jobTitle',
      key: 'jobTitle',
    },
    {
      title: 'Client',
      dataIndex: 'client',
      key: 'client',
    },
    {
      title: 'Amount',
      dataIndex: 'amount',
      key: 'amount',
      render: (amount) => `$${amount}`,
    },
    {
      title: 'Date',
      dataIndex: 'date',
      key: 'date',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'completed' ? 'green' : 'gold'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
  ];

  const items = [
    {
      key: '1',
      label: 'My Proposals',
      children: (
        <div>
          <Space className="w-full justify-end mb-4">
            <Card>
              <Statistic 
                title="Total Proposals" 
                value={mockProposals.length}
                prefix={<ClockCircleOutlined />}
              />
            </Card>
          </Space>
          <Table 
            columns={proposalColumns} 
            dataSource={mockProposals}
            rowKey="id"
          />
        </div>
      ),
    },
    {
      key: '2',
      label: 'Active Jobs',
      children: (
        <div>
          <Space className="w-full justify-end mb-4">
            <Card>
              <Statistic 
                title="Active Projects" 
                value={mockActiveJobs.length}
                prefix={<CheckCircleOutlined />}
              />
            </Card>
          </Space>
          <Table 
            columns={activeJobsColumns} 
            dataSource={mockActiveJobs}
            rowKey="id"
          />
        </div>
      ),
    },
    {
      key: '3',
      label: 'Earnings',
      children: (
        <div>
          <Space className="w-full justify-end mb-4">
            <Card>
              <Statistic
                title="Total Earnings"
                value={mockEarnings.reduce((sum, record) => sum + record.amount, 0)}
                prefix={<DollarOutlined />}
                precision={2}
              />
            </Card>
          </Space>
          <Table 
            columns={earningsColumns} 
            dataSource={mockEarnings}
            rowKey="id"
          />
        </div>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Content className="bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="mb-8">Dashboard</Title>
          <Tabs
            defaultActiveKey="1"
            items={items}
            className="bg-white p-6 rounded-lg shadow-sm"
          />
        </div>
      </Content>
    </Layout>
  );
};

export default FreelancerDashboard;