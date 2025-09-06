import React from 'react';
import {Layout, Tabs, Button, Typography, Space, Dropdown} from 'antd';
import {UserOutlined, LogoutOutlined} from '@ant-design/icons';
import {useNavigate, useLocation} from 'react-router-dom';
import {useAuth} from '../contexts/AuthContext';
import {UserRole} from '../data/enum/UserRole';

const {Header} = Layout;
const {Text} = Typography;

const Navbar: React.FC = () => {
    const {user, logout} = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const userMenu = [
        {
            key: 'email',
            label: <Text className="px-4 py-2 block text-gray-600">{user?.email}</Text>,
            disabled: true,
        },
        // add change password option
        {
            key: "change-password",
            label: (
                <Button
                    type="text"
                    className="w-full text-left"
                    onClick={() => navigate('/change-password')}
                >
                    Change Password
                </Button>
            )
        },
        {
            key: 'role',
            label: (
                <Text className="px-4 py-2 block text-gray-600">
                    {user?.roles?.map(role => role.replace('ROLE_', '')).join(', ')}
                </Text>
            ),
            disabled: true,
        },
        {
            key: 'logout',
            label: (
                <Button
                    type="text"
                    icon={<LogoutOutlined/>}
                    danger
                    className="w-full text-left"
                    onClick={handleLogout}
                >
                    Logout
                </Button>
            ),
        },
    ];

    // Define navigation items based on user role
    const getNavigationItems = () => {
        const items = [];

        console.log('User roles:', user?.roles);

        if (user?.roles?.some(role => role === UserRole.FREELANCER || role === UserRole.ADMIN)) {
            items.push({
                key: 'dashboard',
                label: 'Dashboard',
            });
        }

        items.push({
            key: 'jobs',
            label: 'Find Jobs',
        });
        if (user?.roles?.some(role => role === UserRole.CLIENT || role === UserRole.ADMIN)) {
            items.push({
                key: 'create-job',
                label: 'Post a Job',
            });
        }

        return items;
    };

    const getCurrentTabKey = () => {
        const path = location.pathname;
        if (path === '/dashboard') return 'dashboard';
        if (path === '/jobs') return 'jobs';
        if (path === '/jobs/create') return 'create-job';
        return 'dashboard';
    };

    const handleTabChange = (key: string) => {
        switch (key) {
            case 'dashboard':
                navigate('/dashboard');
                break;
            case 'jobs':
                navigate('/jobs');
                break;
            case 'create-job':
                navigate('/jobs/create');
                break;
            default:
                break;
        }
    };

    return (
        <Header className="bg-white shadow-sm px-4">
            <div className="flex justify-between items-center max-w-7xl mx-auto h-full">
                <div className="flex items-center">
                    <div
                        className="text-xl font-bold text-blue-600 cursor-pointer mr-8"
                        onClick={() => navigate('/')}
                    >
                        Job Board
                    </div>
                    <Tabs
                        activeKey={getCurrentTabKey()}
                        onChange={handleTabChange}
                        items={getNavigationItems()}
                        className="border-0"
                        size="small"
                    />
                </div>

                <Space>
                    <Dropdown menu={{items: userMenu}} placement="bottomRight">
                        <Button icon={<UserOutlined/>} className="flex items-center">
                            {user?.username}
                        </Button>
                    </Dropdown>
                </Space>
            </div>
        </Header>
    );
};

export default Navbar;