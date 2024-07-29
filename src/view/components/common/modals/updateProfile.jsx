import React, { useState } from 'react';
import { Button, Modal, Form } from 'antd';
import { handleUpdateProfile, handleDeleteProfile } from '../../../../controller/userManagementController';
import { useNavigate } from 'react-router-dom';
import { checkServerResponse, saveUser } from '../functions/commonFunctions';
import { addWaterDevice, addEnergyDevice } from '../../../../controller/deviceController';
import { DeviceModel } from '../../../../model/deviceModel';
import { useStore } from '../../../../zustand/userManagementState';

const UpdateProfile = ({ formFields, title, onClose, parent }) => {
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [displayFeedbackMessage, setDisplayFeedbackMessage] = useState('');
  const { clearUser } = useStore.getState(); 
  const initialFormValues = formFields.reduce((acc, field) => {
    acc[field.name] = field.initialValue;
    return acc;
  }, {});

  const handleOk = async (parent) => {
    const formData = form.getFieldsValue();

    if (parent === 'dropdown') {
      try {
        const isUnchanged = Object.keys(formData).every(
          key => formData[key] === initialFormValues[key]
        );
        if (isUnchanged) {
          setDisplayFeedbackMessage('Unable to update profile, no profile updates were made.');
          return;
        }
        const response = await handleUpdateProfile(
          formData,
          setLoading,
          setDisplayFeedbackMessage,
          onClose,
        );
        if (checkServerResponse(response)) {
          saveUser(response);
          alert('Profile updated successfully');
        }
      } catch (error) {
        console.error('Error updating profile: ', error);
      }
    } else if (parent === 'layout') {
      try {
        const deviceType = formData.device_type;
        const deviceData = {
          ...DeviceModel,
          device_name: formData.device_name,
          added_by: useStore.getState().user.userId,
          quantity: formData.quantity,
          power: formData.power
        };

        let response;
        if (deviceType === 'water') {
          response = await addWaterDevice({
            device_name: deviceData.device_name,
            added_by: deviceData.added_by,
            quantity: deviceData.quantity,
            flow_rate: deviceData.power,
          }, setDisplayFeedbackMessage);
        } else if (deviceType === 'energy') {
          response = await addEnergyDevice({
            device_name: deviceData.device_name,
            added_by: deviceData.added_by,
            quantity: deviceData.quantity,
            watts: deviceData.power,
          }, setDisplayFeedbackMessage);
        }

        if (checkServerResponse(response)) {
          onClose();
          alert('Device added successfully');
          window.location.reload();
        }
      } catch (error) {
        console.error('Error adding device: ', error);
      }
    }
  };  

  const handleDelete = async () => {
    try {
      const response = await handleDeleteProfile(setLoading, navigate, setDisplayFeedbackMessage, onClose);
      if (checkServerResponse(response)) {
        clearUser();
        alert('Profile deleted successfully');
      }
    } catch (error) {
      console.error('Error deleting profile:', error);
    }
  };

  return (
      <Modal
        centered
        open={true}
        title={title}
        onCancel={onClose}
        footer={[
          <Button 
            key="submit" 
            type="primary" 
            loading={loading} 
            onClick={() => handleOk(parent)}
            style={{ backgroundColor: '#001529' }}
          >
            Submit
          </Button>,
          title === "Update Profile" && (
            <Button
              key="delete"
              type="primary"
              danger
              style={{ color: 'white', backgroundColor: 'red' }}
              onClick={handleDelete}
            >
              Delete
            </Button>
          ),
        ]}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={initialFormValues}
        >
          {formFields.map((field) => (
            <Form.Item
              key={field.name}
              label={field.label}
              name={field.name}
              rules={field.rules}
            >
              {field.component}
            </Form.Item>
          ))}
          {displayFeedbackMessage && <div style={{ color: 'red', marginBottom: '10px' }}>{displayFeedbackMessage}</div>}
        </Form>
      </Modal>    
  );
};

export default UpdateProfile;
