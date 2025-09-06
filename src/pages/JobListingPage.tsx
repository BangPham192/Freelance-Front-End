import React, {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Table, Typography, Layout, Tag, Space} from 'antd';
import {DollarOutlined} from '@ant-design/icons';
import type {ColumnsType} from 'antd/es/table';
import Navbar from '../components/Navbar';
import {getAllJobs} from '../services/api';
import {JobDtoCustomDto} from "src/data/models/JobDtoCustomDto";

const {Title} = Typography;
const {Content} = Layout;

const JobListingPage: React.FC = () => {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState<JobDtoCustomDto[]>([]);
    const [loading, setLoading] = useState(false);
    const [total, setTotal] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const pageSize = 10;

    const fetchJobs = async (page: number) => {
        try {
            setLoading(true);
            const response = await getAllJobs(page - 1, pageSize);
            const jobsWithSalary = response.content.map(job => ({
                ...job,
                salary: job.budgetMin !== null && job.budgetMax !== null
                    ? `$${job.budgetMin.toLocaleString()} - $${job.budgetMax.toLocaleString()}`
                    : 'Not specified'
            }));
            setJobs(jobsWithSalary);
            setTotal(response.totalElements);
        } catch (error) {
            console.error('Failed to fetch jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(currentPage);
    }, [currentPage]);


    const columns: ColumnsType<JobDtoCustomDto> = [
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
                    <Typography.Text type="secondary">{record.title}</Typography.Text>
                </Space>
            ),
        },
        {
            title: 'Status',
            dataIndex: 'status',
            key: 'status',
            render: (text) => (
                <Space>
                    {text}
                </Space>
            ),
            width: 150,
        },
        {
            title: 'Salary',
            dataIndex: 'salary',
            key: 'salary',
            render: (text) => (
                <Space>
                    <DollarOutlined/>
                    {text}
                </Space>
            ),
            width: 150,
        },
        {
            title: 'Technologies',
            key: 'skills',
            dataIndex: 'skills',
            render: (skills: string[]) => (
                <Space size={[0, 8]} wrap>
                    {skills.map((skill) => (
                        <Tag color="blue" key={skill}>
                            {skill}
                        </Tag>
                    ))}
                </Space>
            ),
        },
    ];

    return (
        <Layout className="min-h-screen">
            <Navbar/>
            <Content className="bg-gray-50 py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <Title level={2} className="mb-8">Available Jobs</Title>

                    <Table
                        columns={columns}
                        dataSource={jobs}
                        rowKey="id"
                        loading={loading}
                        onRow={(record) => ({
                            onClick: () => navigate(`/jobs/${record.id}`),
                            style: {cursor: 'pointer'}
                        })}
                        pagination={{
                            current: currentPage,
                            pageSize: pageSize,
                            total: total,
                            onChange: (page) => setCurrentPage(page),
                            showSizeChanger: false
                        }}
                    />
                </div>
            </Content>
        </Layout>
    );
};

export default JobListingPage;