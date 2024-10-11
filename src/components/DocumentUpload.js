import React, { useState } from 'react';
import {Upload, Button, Table, message, Spin, Space} from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import axios from 'axios';

const DocumentUpload = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleUpload = (file) => {
    const formData = new FormData();
    formData.append('file', file);

    setLoading(true);
    setData(null);

    axios.post('http://localhost:8000/api/upload/', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then(response => {
        setData(response.data);
        message.success('File uploaded and processed successfully!');
      })
      .catch(error => {
        console.error(error);
        message.error('Failed to upload or process the file.');
      })
      .finally(() => {
        setLoading(false);
      });

    // Prevent default upload behavior
    return false;
  };

  const columns = [
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      width: '25%',
      render: (text, record, index) => {
        const obj = {
          children: text,
          props: {},
        };
        const dataSource = prepareTableData();
        // Merge category rows
        if (index === 0 || text !== dataSource[index - 1].category) {
          const rowSpan = dataSource.filter(item => item.category === text).length;
          obj.props.rowSpan = rowSpan;
        } else {
          obj.props.rowSpan = 0;
        }
        return obj;
      },
    },
    {
      title: 'Field',
      dataIndex: 'field',
      key: 'field',
      width: '25%',
    },
    {
      title: 'Value',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const prepareTableData = () => {
    if (!data) return [];

    const tableData = [];
    let key = 0;

    // Personal Information
    tableData.push({ key: key++, category: 'Personal Information', field: 'Name', value: data.personal_information.name || 'N/A' });
    tableData.push({ key: key++, category: 'Personal Information', field: 'Gender', value: data.personal_information.gender || 'N/A' });
    tableData.push({ key: key++, category: 'Personal Information', field: 'Age', value: data.personal_information.age || 'N/A' });

    // Education (Assuming multiple entries)
      data?.education?.forEach((edu, index) => {
        const edu_key =  data.education.length > 1 ? `${index + 1}` : ""
        tableData.push({ key: key++, category: `Education ${edu_key}`, field: 'Academic Level', value: edu.academic_level || 'N/A' });
        tableData.push({ key: key++, category: `Education ${edu_key}`, field: 'Institution', value: edu.institution || 'N/A' });
        tableData.push({ key: key++, category: `Education ${edu_key}`, field: 'GPA/Grade', value: edu.gpa_grade || 'N/A' });
        tableData.push({ key: key++, category: `Education ${edu_key}`, field: 'Duration', value: `${edu.start_date}-${edu.end_date}` || 'N/A' });
      });

    // Work Experience (Assuming multiple entries)
      data?.work_experience?.forEach((work, index) => {
        const edu_key =  data.work_experience.length > 1 ? `${index + 2}` : ""
        tableData.push({ key: key++, category: `Work Experience ${edu_key}`, field: 'Company', value: work.company || 'N/A' });
        tableData.push({ key: key++, category: `Work Experience ${edu_key}`, field: 'Location', value: work.location || 'N/A' });
        tableData.push({ key: key++, category: `Work Experience ${edu_key}`, field: 'Role', value: work.role || 'N/A' });
        tableData.push({ key: key++, category: `Work Experience ${edu_key}`, field: 'Duration',value:  work.start_date && work.end_date ? `${work.start_date}-${work.end_date}` : 'N/A' });
        tableData.push({ key: key++, category: `Work Experience ${edu_key}`, field: 'Description', value: work.description || 'N/A' });
      });

    return tableData;
  };

  return (
    <Space direction={"vertical"} size={20} style={{padding: 50}}>
      <Upload
        beforeUpload={handleUpload}
        accept=".pdf,.doc,.docx"
        showUploadList={false}
      >
        <Button icon={<UploadOutlined />}>Click to Upload CV</Button>
      </Upload>

      {loading && <Spin style={{ marginTop: '20px' }} />}

      {data && !data.error && (
        <Table
          style={{ marginTop: '20px' }}
          columns={columns}
          dataSource={prepareTableData()}
          onRow={(record, index) => ({
            style: {
              background: record.key % 2 ? '#f6f6f8' : 'default',
            }
          })}
          pagination={false}
        />
      )}

      {data && data.error && (
        <div style={{ marginTop: '20px', color: 'red' }}>
          {data.error}
        </div>
      )}
    </Space>

  );
};

export default DocumentUpload;
