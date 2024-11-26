import { Button, Input, Modal } from "antd";
import { useState } from "react";
interface Group {
  id: string;
  name: string;
  members?: string[];
}

interface GroupSelectorProps {
  groups: Group[];
  currentGroupId: string;
  onGroupSelect: (groupId: string) => void;
  onCreateGroup: (groupName: string) => void;
}

export const GroupSelector = ({
  groups,
  currentGroupId,
  onGroupSelect,
  onCreateGroup
}: GroupSelectorProps) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');

  return (
    <div className="group-selector">
      <select 
        value={currentGroupId}
        onChange={(e) => onGroupSelect(e.target.value)}
        className="group-select"
      >
        <option value="">選擇群組</option>
        {groups.map(group => (
          <option key={group.id} value={group.id}>
            {group.name} ({group.members?.length || 0} 人)
          </option>
        ))}
      </select>
      
      <Button onClick={() => setIsModalVisible(true)}>
        建立新群組
      </Button>

      <Modal
        title="建立新群組"
        open={isModalVisible}
        onOk={() => {
          onCreateGroup(newGroupName);
          setIsModalVisible(false);
          setNewGroupName('');
        }}
        onCancel={() => setIsModalVisible(false)}
      >
        <Input
          value={newGroupName}
          onChange={(e) => setNewGroupName(e.target.value)}
          placeholder="輸入群組名稱"
        />
      </Modal>
    </div>
  );
}; 