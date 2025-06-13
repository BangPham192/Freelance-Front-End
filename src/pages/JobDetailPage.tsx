import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Layout, Card, Typography, Button, Tag, List, Divider } from 'antd';
import { 
  LeftOutlined, 
  EnvironmentOutlined, 
  DollarOutlined,
  BankOutlined
} from '@ant-design/icons';
import Navbar from '../components/Navbar';

const { Title, Paragraph, Text } = Typography;
const { Content } = Layout;

// Mock data - in a real app, this would come from an API
const mockJobDetails = {
  id: 1,
  title: 'Senior React Developer',
  company: 'Tech Corp',
  location: 'Remote',
  salary: '$120k - $150k',
  tags: ['React', 'TypeScript', 'Redux', 'Node.js'],
  description: `We are looking for an experienced React developer to join our team. 
    The ideal candidate will have strong experience with React, TypeScript, and modern frontend development practices.`,
  requirements: [
    '5+ years of experience with React',
    'Strong knowledge of TypeScript',
    'Experience with state management (Redux, Context API)',
    'Understanding of responsive design and cross-browser compatibility',
    'Experience with testing frameworks (Jest, React Testing Library)'
  ],
  benefits: [
    'Competitive salary',
    'Remote work options',
    'Health insurance',
    'Professional development budget',
    'Flexible working hours'
  ]
};

const JobDetailPage: React.FC = () => {
  const navigate = useNavigate();

  // In a real app, you would fetch the job details based on the ID
  const job = mockJobDetails;

  return (
    <Layout className="min-h-screen">
      <Navbar />
      <Content className="bg-gray-50 py-8 px-4">
        <div className="max-w-3xl mx-auto">
          <Button 
            type="link"
            icon={<LeftOutlined />}
            onClick={() => navigate('/jobs')}
            className="mb-6 pl-0 hover:text-blue-700"
          >
            Back to Jobs
          </Button>

          <Card className="shadow-md">
            <Title level={2} className="mb-6">{job.title}</Title>
            
            <div className="flex flex-wrap gap-4 mb-6">
              <Tag icon={<BankOutlined />} color="blue">
                {job.company}
              </Tag>
              <Tag icon={<EnvironmentOutlined />} color="green">
                {job.location}
              </Tag>
              <Tag icon={<DollarOutlined />} color="gold">
                {job.salary}
              </Tag>
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {job.tags.map((tag) => (
                <Tag key={tag}>{tag}</Tag>
              ))}
            </div>

            <Divider />

            <div className="mb-8">
              <Title level={4}>Job Description</Title>
              <Paragraph className="whitespace-pre-line">
                {job.description}
              </Paragraph>
            </div>

            <div className="mb-8">
              <Title level={4}>Requirements</Title>
              <List
                dataSource={job.requirements}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </div>

            <div className="mb-8">
              <Title level={4}>Benefits</Title>
              <List
                dataSource={job.benefits}
                renderItem={(item) => (
                  <List.Item>
                    <Text>{item}</Text>
                  </List.Item>
                )}
              />
            </div>

            <Button type="primary" size="large" block>
              Apply Now
            </Button>
          </Card>
        </div>
      </Content>
    </Layout>
  );
};

export default JobDetailPage;