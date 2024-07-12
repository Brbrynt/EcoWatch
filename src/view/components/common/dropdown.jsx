import React from 'react';
import { DownOutlined } from '@ant-design/icons';
import { Dropdown, Space } from 'antd';

const DropdownMenu = ({ label, items }) => (
  <Dropdown
    menu={{
      items,
    }}
  >
    <a onClick={(e) => e.preventDefault()}>
      <Space>
        <div className='text-lg'>
            {label}
        </div>
        <DownOutlined />
      </Space>
    </a>
  </Dropdown>
);

export default DropdownMenu;
