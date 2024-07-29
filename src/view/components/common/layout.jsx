import React, { useState, useEffect } from 'react';
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { Button, Layout, Menu, theme, Typography, Input, Select, DatePicker } from 'antd';
import { useNavigate } from 'react-router-dom';
import earthLogo from '../static/save-earth.svg';
import DropdownMenu from './dropdown';
import DeviceManagement from '../menu_item_modules/deviceManagement';
import WaterMeter from '../menu_item_modules/waterMeter';
import EnergyMeter from '../menu_item_modules/energyMeter';
import ViewReport from '../menu_item_modules/viewReport';
import WaterDropOutlinedIcon from '@mui/icons-material/WaterDropOutlined';
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import DevicesOtherOutlinedIcon from '@mui/icons-material/DevicesOtherOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import { devices } from '../static/sampleArr';
import Notifications from './notifications';
import ErrorModal from './modals/errorModal';
import UpdateProfile from './modals/updateProfile';
import { useStore } from '../../../zustand/userManagementState';
import { fetchConsumptionData } from '../../../controller/consumptionController';

const { Header, Sider, Content } = Layout;
const { Title } = Typography;

const AppLayout = () => {
  const [collapsed, setCollapsed] = useState(false);
  const [selectedKey, setSelectedKey] = useState('1');
  const [modalVisible, setModalVisible] = useState(false);
  const [modalTitle, setModalTitle] = useState('');
  const [formFields, setFormFields] = useState([]);
  const [errorModal, setErrorModal] = useState(false);
  const [data, setData] = useState();
  const [parent, setParent] = useState('layout');
  const navigate = useNavigate();

  useEffect(() => {
    const getData = async () => {
      const response = await fetchConsumptionData();
      setData(response);
    };
    getData();
  }, []);

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  const handleMenuClick = (key) => {
    setSelectedKey(key);
  };

  const renderContent = () => {
    switch (selectedKey) {
      case '1':
        return <DeviceManagement />;
      case '2':
        return <WaterMeter data={data}/>;
      case '3':
        return <EnergyMeter data={data}/>;
      case '4':
        return <ViewReport data={data}/>;
      default:
        return null;
    }
  };

  const menuItems = [
    {
      key: '1',
      icon: <DevicesOtherOutlinedIcon />,
      label: 'Manage Device',
    },
    {
      key: '2',
      icon: <WaterDropOutlinedIcon />,
      label: 'Water Meter',
    },
    {
      key: '3',
      icon: <BoltOutlinedIcon />,
      label: 'Energy Meter',
    },
    {
      key: '4',
      icon: <AssessmentOutlinedIcon />,
      label: 'View Report',
    },
  ];

  const getTitle = () => {
    const item = menuItems.find((menuItem) => menuItem.key === selectedKey);
    return item ? item.label : '';
  };

  const items = [
    {
      key: '1',
      label: 'Update Profile',
    },
    {
      key: '2',
      label: 'Change Password',
    },
    {
      key: '3',
      label: 'Logout',
    },
  ];

  const openModal = () => {
    if (selectedKey === '1') {
      setModalTitle('Add Device');
      setFormFields([
        {
          label: 'Device Type',
          name: 'device_type',
          rules: [{ required: true, message: 'Please select the device type!' }],
          component: (
            <Select placeholder="Select device type">
              <Select.Option value="energy">Electronic</Select.Option>
              <Select.Option value="water">Water</Select.Option>
            </Select>
          ),
        },
        {
          label: 'Device Name',
          name: 'device_name',
          rules: [{ required: true, message: 'Please enter the device name!' }],
          component: <Input placeholder="Enter device name" />,
        },
        {
          label: 'Quantity',
          name: 'quantity',
          rules: [{ required: true, message: 'Please enter the quantity!', type: 'number', min: 1  }],
          component: <Input placeholder="Enter quantity" />,
        },
        {
          label: 'Wattage/Flowrate',
          name: 'power',
          rules: [{ required: true, message: 'Please enter the value!', type: 'number', min: 0 }],
          component: <Input type="power" placeholder="Enter wattage/flowrate" />,
        },
      ]);
    } else if (selectedKey === '4') {
      setParent('view-report')
      setModalTitle('View Report by Timeline');
      setFormFields([
        {
          label: 'Type',
          name: 'type',
          rules: [{ required: true, message: 'Please select a type!' }],
          component: (
            <Select placeholder="Select type">
              <Select.Option value="energy">Energy</Select.Option>
              <Select.Option value="water">Water</Select.Option>
            </Select>
          ),
        },
        {
          label: 'From Date',
          name: 'fromDate',
          rules: [{ required: true, message: 'Please select a start date!' }],
          component: <DatePicker style={{ width: '100%' }} placeholder="Select start date" />,
        },
        {
          label: 'To Date',
          name: 'toDate',
          rules: [{ required: true, message: 'Please select an end date!' }],
          component: <DatePicker style={{ width: '100%' }} placeholder="Select end date" />,
        },
      ]);
    }
    setModalVisible(true);
  };
  
  const closeModal = () => {
    setModalVisible(false);
  };

  const handleLogout = () => {
    const { clearUser } = useStore.getState(); 
    clearUser();
    navigate('/usermanagement');
  };

  const handleFormSubmit = (values) => {
    const newDevice = {
      deviceID: devices.length + 1,
      type: values.deviceType,
      name: values.deviceName,
      wattage: values.wattage,
      hoursUsed: 0,
      author: 'YourName',
    };

    devices.push(newDevice);
    console.log('New device added:', newDevice);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {errorModal && <ErrorModal isOpen={errorModal}/>}
      <Notifications />
      <Sider trigger={null} collapsible collapsed={collapsed}>
        <div className="demo-logo-vertical" />
        <div style={{ padding: '16px', color: '#fff', textAlign: 'center' }}>
          {collapsed ? (
            <img src={earthLogo} alt="earth-logo" style={{ width: '40px', height: '40px' }} />
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <img
                src={earthLogo}
                alt="earth-logo"
                style={{ width: '40px', height: '40px', marginRight: '8px' }}
              />
              <Title level={3} style={{ margin: 0, color: '#fff' }}>
                EcoWatch
              </Title>
            </div>
          )}
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          onClick={({ key }) => handleMenuClick(key)}
          items={menuItems}
        />
      </Sider>
      <Layout>
        <Header
          style={{
            padding: 0,
            background: colorBgContainer,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Button
            type="text"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: '16px',
              width: 64,
              height: 64,
            }}
          />
          <div style={{ marginLeft: 'auto', marginRight: '16px', display: 'flex', alignItems: 'center' }}>
            <UserOutlined style={{ marginRight: '10px', fontSize: '18px' }} />
            <DropdownMenu label="Account" items={items} onLogout={handleLogout} />
          </div>
        </Header>

        <Content
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 'calc(100vh - 64px - 48px)',
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
          }}
        >
          <Title  
            level={4}
            style={{ marginBottom: '24px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
          >
            <span>{getTitle()}</span>
            {selectedKey === '1' && (
              <Button
                className="ml-4 bg-primary text-white"
                onClick={openModal}
              >
                Add Device
              </Button>
            )}
            {selectedKey === '4' && (
              <Button
                className="ml-4 bg-primary text-white"
                onClick={openModal}
              >
                View Report by Timeline
              </Button>
            )}
          </Title>

          <div
            style={{
              maxHeight: 'calc(100vh - 64px - 48px - 48px)',
              overflowY: 'auto',
            }}
          >
            {renderContent()}
          </div>
        </Content>
      </Layout>

      {modalVisible && (
        <UpdateProfile
          title={modalTitle}
          formFields={formFields}
          onClose={closeModal}
          onSubmit={handleFormSubmit}
          parent={parent}
          data={data}
        />
      )}
    </Layout>
  );
};

export default AppLayout;
