import React from 'react';
import {Layout, Tabs, Table, Card, Typography, Tag, Space, Statistic} from 'antd';
import {DollarOutlined, ClockCircleOutlined, CheckCircleOutlined} from '@ant-design/icons';
import Navbar from '../components/Navbar';
import type {ColumnsType} from 'antd/es/table';

const {Content} = Layout;
const {Title} = Typography;

import { useEffect, useState } from 'react';
import { getMyJobApplications, getMyActiveJobApplications } from '../services/api';
import dayjs from "dayjs";

interface Proposal {
    id: number;
    jobTitle: string;
    client: string;
    proposedAmount: number;
    status: string;
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

const dateFormat = 'YYYY-MM-DD';

const FreelancerDashboard: React.FC = () => {
    const [proposals, setProposals] = useState<Proposal[]>([]);
    const [loading, setLoading] = useState(false);

    const [activeJobs, setActiveJobs] = useState<ActiveJob[]>([]);
    const [loadingActiveJobs, setLoadingActiveJobs] = useState(false);

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
                return <Tag color={colors[status] || 'blue'}>{status}</Tag>;
            },
        },
        {
            title: 'Submitted',
            dataIndex: 'submittedDate',
            key: 'submittedDate',
        },
    ];

    useEffect(() => {
        setLoading(true);
        getMyJobApplications(0, 100)
            .then((res) => {
                const mapped: Proposal[] = res.content.map((app: any) => ({
                    id: app.job.id,
                    jobTitle: app.job.title,
                    client: app.job.clientName,
                    proposedAmount: app.expectedFee,
                    status: app.applicationsStatus,
                    submittedDate: dayjs(app.createdAt, dateFormat).format(dateFormat),
                }));
                setProposals(mapped);
            })
            .finally(() => setLoading(false));
    }, []);

    // Fetch Active Jobs
    useEffect(() => {
        setLoadingActiveJobs(true);
        getMyActiveJobApplications(0, 100)
            .then((res) => {
                const mapped: ActiveJob[] = res.content.map((app: any) => ({
                    id: app.job?.id,
                    jobTitle: app.job?.title,
                    client: app.job?.clientName,
                    amount: app.expectedFee,
                    deadline: app.estimatedTime ? dayjs(app.createdAt, dateFormat).add(app.estimatedTime, 'day').format(dateFormat)
                    : dayjs(app.createdAt, dateFormat).add(30, 'day').format(dateFormat), // Default to 30 days if estimatedTime is not available
                    progress: 0 // No progress info available
                }));
                setActiveJobs(mapped);
            })
            .finally(() => setLoadingActiveJobs(false));
    }, []);

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
                                value={proposals.length}
                                prefix={<ClockCircleOutlined/>}
                            />
                        </Card>
                    </Space>
                    <Table
                        columns={proposalColumns}
                        dataSource={proposals}
                        loading={loading}
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
                                value={activeJobs.length}
                                prefix={<CheckCircleOutlined/>}
                            />
                        </Card>
                    </Space>
                    <Table
                        columns={activeJobsColumns}
                        dataSource={activeJobs}
                        loading={loadingActiveJobs}
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
                                prefix={<DollarOutlined/>}
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
            <Navbar/>
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