import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Table, Typography, Layout, Tag, Space } from 'antd';
import { EnvironmentOutlined, DollarOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import Navbar from '../components/Navbar';

const { Title } = Typography;
const { Content } = Layout;

interface JobData {
  id: number;
  title: string;
  company: string;
  location: string;
  salary: string;
  tags: string[];
}

// Mock data for jobs - in a real app, this would come from an API
const mockJobs: JobData[] = [
  {
    id: 1,
    title: 'Senior React Developer',
    company: 'Tech Corp',
    location: 'Remote',
    salary: '$120k - $150k',
    tags: ['React', 'TypeScript', 'Redux']
  },
  {
    id: 2,
    title: 'Full Stack Developer',
    company: 'StartUp Inc',
    location: 'New York',
    salary: '$100k - $130k',
    tags: ['Node.js', 'React', 'MongoDB']
  },
  {
    id: 3,
    title: 'Frontend Engineer',
    company: 'Big Tech',
    location: 'San Francisco',
    salary: '$130k - $160k',
    tags: ['React', 'Vue.js', 'JavaScript']
  },
];

const JobListingPage: React.FC = () => {
  const navigate = useNavigate();

  const columns: ColumnsType<JobData> = [
    {
      title: 'Position',
      dataIndex: 'title',
      key: 'title',
      sorter: (a, b) => a.title.localeCompare(b.title),
      render: (text, record) => (
        <Space direction="vertical" size="small">
          <Typography.Title level={5} className="mb-0">
            {text}
          </Typography.Title>
          <Typography.Text type="secondary">{record.company}</Typography.Text>
        </Space>
      ),
    },
    {
      title: 'Location',
      dataIndex: 'location',
      key: 'location',
      render: (text) => (
        <Space>
          <EnvironmentOutlined />
          {text}
        </Space>
      ),
      sorter: (a, b) => a.location.localeCompare(b.location),
      width: 150,
    },
    {
      title: 'Salary',
      dataIndex: 'salary',
      key: 'salary',
      render: (text) => (
        <Space>
          <DollarOutlined />
          {text}
        </Space>
      ),
      width: 150,
    },
    {
      title: 'Technologies',
      key: 'tags',
      dataIndex: 'tags',
      render: (tags: string[]) => (
        <Space size={[0, 8]} wrap>
          {tags.map((tag) => (
            <Tag color="blue" key={tag}>
              {tag}
            </Tag>
          ))}
        </Space>
      ),
    },
  ];

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Content className="bg-gray-50 py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <Title level={2} className="mb-8">Available Jobs</Title>
          
          <Table
            columns={columns}
            dataSource={mockJobs}
            rowKey="id"
            onRow={(record) => ({
              onClick: () => navigate(`/jobs/${record.id}`),
              style: { cursor: 'pointer' }
            })}
            pagination={{
              pageSize: 10,
              hideOnSinglePage: true
            }}
          />
        </div>
      </Content>
    </Layout>
  );
};

export default JobListingPage;