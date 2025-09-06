import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Layout, Card, Typography, Button, Tag, Divider } from 'antd';
import {
    LeftOutlined,
    DollarOutlined
} from '@ant-design/icons';
import Navbar from '../components/Navbar';
import { getJobDetail } from '../services/api';
import { JobDto } from '../data/models/JobDto';
import ErrorMessage from '../components/ErrorMessage';
import { useAuth } from '../contexts/AuthContext';
import { UserRole } from '../data/enum/UserRole';
import './JobDetailPage.css';

const { Title } = Typography;
const { Content } = Layout;

const JobDetailPage: React.FC = () => {
    const navigate = useNavigate();
    const { id } = useParams<{ id: string }>();
    const { user } = useAuth();
    const [job, setJob] = useState<JobDto | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchJobDetail = async () => {
            try {
                if (!id) {
                    throw new Error('Job ID is required');
                }
                const jobData = await getJobDetail(id);
                setJob(jobData);
            } catch (error) {
                ErrorMessage({ message: error instanceof Error ? error.message : 'Failed to fetch job details' });
                navigate('/jobs');
            } finally {
                setLoading(false);
            }
        };

        fetchJobDetail();
    }, [id, navigate]);

    if (loading) {
        return (
            <Layout className="min-h-screen">
                <Navbar />
                <Content className="bg-gray-50 py-8 px-4">
                    <div className="max-w-3xl mx-auto flex justify-center items-center min-h-[400px]">
                        <span className="loading loading-spinner loading-lg"></span>
                    </div>
                </Content>
            </Layout>
        );
    }

    if (!job) {
        return null;
    }

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
                            <Tag icon={<DollarOutlined />} color="gold">
                                {job.budgetMin !== null && job.budgetMax !== null
                                    ? `$${job.budgetMin.toLocaleString()} - $${job.budgetMax.toLocaleString()}`
                                    : 'Not specified'
                                }
                            </Tag>
                        </div>

                        <div className="flex flex-wrap gap-2 mb-6">
                            {job.skills.map((skill) => (
                                <Tag key={skill}>{skill}</Tag>
                            ))}
                        </div>

                        <Divider />

                        <div className="mb-8">
                            <Title level={4}>Job Description</Title>
                            <div 
                                dangerouslySetInnerHTML={{ __html: job.description }}
                                className="prose max-w-none"
                            />
                        </div>

                        <div className="mb-8">
                            <Title level={4}>Requirements</Title>
                            <div
                                dangerouslySetInnerHTML={{ __html: job.requirements }}
                                className="prose max-w-none"
                            />
                        </div>

                        <div className="mb-8">
                            <Title level={4}>Benefits</Title>
                            <div
                                dangerouslySetInnerHTML={{ __html: job.benefits }}
                                className="prose max-w-none"
                            />
                        </div>

                        <Button
                            type="primary"
                            size="large"
                            block
                            onClick={() => {
                                if (user?.roles?.some(role => role === UserRole.CLIENT)) {
                                    // Handle approve proposal action for clients
                                    navigate(`/job/${job.id}/approve-proposal`);
                                } else {
                                    navigate(`/job/${job.id}/apply`);
                                }
                            }}
                        >
                            {user?.roles?.some(role => role === UserRole.CLIENT) ? 'Approve Proposal' : 'Apply Now'}
                        </Button>
                    </Card>
                </div>
            </Content>
        </Layout>
    );
};

export default JobDetailPage;