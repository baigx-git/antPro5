import React, {useEffect, useState} from 'react';
import {
  Modal,Transfer
} from 'antd';



interface CreateFormProps {
  modalVisible: boolean;
  onCancel: () => void;
  role:any;
  onFinish:(values: any) => void;
  check:boolean
}



const CreateForm: React.FC<CreateFormProps> = (props) => {
  const { modalVisible, onCancel, role,onFinish} = props;
  const [targetKeys=[], handleTargetKeys] = useState<any>( []);
  useEffect(() => {
    handleTargetKeys( role.roles )
    }, [role.roles]);

  const handleChange = (targetKeys, direction, moveKeys) => {
    handleTargetKeys( targetKeys );
  };

  const renderItem = (item:any) => {
    const customLabel = (
      <span className="custom-item">
        {item.key} - {item.name}
      </span>
    );

    return {
      label: customLabel, // for displayed item
      value: item.name, // for title and filter matching
    };
  };

  return (
    <Modal
      destroyOnClose
      title="分配角色"
      visible={modalVisible}
      onCancel={() => onCancel()}
      onOk={() => onFinish(targetKeys)}
    >
      <Transfer
        dataSource={role.roleList}
        listStyle={{
          width: 300,
          height: 300,
        }}
        targetKeys={targetKeys}
        onChange={handleChange}
        render={renderItem}
      />

    </Modal>
  );
};

export default CreateForm;
