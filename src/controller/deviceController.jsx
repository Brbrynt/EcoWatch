import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

const handleDeviceRequest = async (deviceData, endpoint, setDisplayError, setError) => {
  try {
    const response = await axios.post(`${API_URL}${endpoint}`, deviceData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    setError('Error processing request. Please try again.');
    setDisplayError(true);
  }
};

export const addWaterDevice = async (deviceData, setDisplayError) => {
  return handleDeviceRequest(deviceData, '/device/water', setDisplayError);
};

export const addEnergyDevice = async (deviceData, setDisplayError) => {
  return handleDeviceRequest(deviceData, '/device/electric', setDisplayError);
};

export const getAllDevices = async (setDisplayError) => {
  try {
    const response = await axios.get(`${API_URL}/device/all`);
    return response.data;
  } catch (error) {
    setDisplayError('Error fetching devices. Please try again.');
  }
};

export const turnDeviceOn = async (deviceId, setDisplayError) => {
  console.log(deviceId);
  try {
    const response = await axios.post(`${API_URL}/device/${deviceId}/on?deviceId=${deviceId}`);
    return response;
  } catch (error) {
    setDisplayError('Error turning device on. Please try again.');
  }
};

export const turnDeviceOff = async (deviceId, setDisplayError) => {
  console.log(deviceId);
  try {
    const response = await axios.patch(`${API_URL}/device/${deviceId}/off?deviceId=${deviceId}`);
    return response;
  } catch (error) {
    setDisplayError('Error turning device off. Please try again.');
  }
};

export const deleteDevice = async (deviceId, setDisplayError) => {
  console.log(deviceId);
  try {
    const response = await axios.delete(`${API_URL}/device/delete/{deviceId}?deviceId=${deviceId}`);
    return response;
  } catch (error) {
    setDisplayError('Error deleting device. Please try again.');
  }
};

export const updateWaterDevice = async (deviceId, deviceData, setDisplayError) => {
  console.log(`${API_URL}/device/water/${deviceId}?deviceId=${deviceId}`);
  try {
    const response = await axios.put(`${API_URL}/device/water/${deviceId}?deviceId=${deviceId}`, deviceData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    setDisplayError('Error updating water device. Please try again. ' + error);
  }
};

export const updateEnergyDevice = async (deviceId, deviceData, setDisplayError) => {
  console.log(`${API_URL}/device/electric/${deviceId}?deviceId=${deviceId}`);
  try {
    const response = await axios.put(`${API_URL}/device/electric/${deviceId}?deviceId=${deviceId}`, deviceData, {
      headers: {
        'Content-Type': 'application/json'
      }
    });
    return response;
  } catch (error) {
    setDisplayError('Error updating energy device. Please try again. ' + error);
  }
};

export const viewReportByTimeline = async (fromDate, toDate, type) => {
  try {
    const response = await axios.get(`${API_URL}/device/filter`, {
      params: {
        fromDate,
        toDate,
        type
      }
    });
    return response;
  } catch (error) {
    console.error('Incorrect credentials. Please try again.');
  }
};