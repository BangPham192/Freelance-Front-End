import React from 'react';
import { Layout, Menu, Button, Typography, Space, Dropdown } from 'antd';
import { UserOutlined, LogoutOutlined } from '@ant-design/icons';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const { Header } = Layout;
const { Text } = Typography;

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();
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
          icon={<LogoutOutlined />} 
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

    if (user?.roles?.some(role => role === 'ROLE_FREELANCER' || role === 'ROLE_ADMIN')) {
      items.push({
        key: 'dashboard',
        label: 'Dashboard',
        onClick: () => navigate('/dashboard'),
      });
    }

    items.push({
      key: 'jobs',
      label: 'Find Jobs',
      onClick: () => navigate('/jobs'),
    });

    return items;
  };

  const currentPath = location.pathname.split('/')[1] || 'dashboard';

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
          <Menu 
            mode="horizontal" 
            selectedKeys={[currentPath]}
            items={getNavigationItems()}
            className="border-0"
          />
        </div>
        
        <Space>
          <Dropdown menu={{ items: userMenu }} placement="bottomRight">
            <Button icon={<UserOutlined />} className="flex items-center">
              {user?.username}
            </Button>
          </Dropdown>
        </Space>
      </div>
    </Header>
  );
};

export default Navbar;