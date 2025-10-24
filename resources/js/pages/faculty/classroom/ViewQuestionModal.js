import React from 'react';
import { Modal, Descriptions, Tag, Divider, List } from 'antd';

const ViewQuestionModal = ({ visible, onCancel, question }) => {
  if (!question) return null;

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case 'easy': return 'green';
      case 'medium': return 'orange';
      case 'hard': return 'red';
      default: return 'gray';
    }
  };

  const renderOptions = () => {
    if (question.type !== 'multiple-choice') {
      return <p><strong>Correct Answer:</strong> {question.correctAnswer}</p>;
    }

    const options = [
      { letter: 'A', value: question.options[0] },
      { letter: 'B', value: question.options[1] },
      { letter: 'C', value: question.options[2] },
      { letter: 'D', value: question.options[3] },
    ].filter(opt => opt.value);

    return (
      <List
        size="small"
        dataSource={options}
        renderItem={item => (
          <List.Item>
            <span style={{ width: 24, display: 'inline-block', fontWeight: 'bold' }}>
              {item.letter}:
            </span>
            <span>
              {item.value}
              {question.correctAnswer === item.value && (
                <Tag color="green" style={{ marginLeft: 8 }}>Correct</Tag>
              )}
            </span>
          </List.Item>
        )}
      />
    );
  };

  return (
    <Modal
      title="Question Details"
      visible={visible}
      onCancel={onCancel}
      footer={null}
      width={700}
    >
      <Descriptions bordered column={1}>
        <Descriptions.Item label="Question">
          {question.question}
        </Descriptions.Item>
        <Descriptions.Item label="Type">
          <Tag color={question.type === 'multiple-choice' ? 'blue' : 'green'}>
            {question.type.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Difficulty">
          <Tag color={getDifficultyColor(question.difficulty)}>
            {question.difficulty.toUpperCase()}
          </Tag>
        </Descriptions.Item>
        <Descriptions.Item label="Category">
          {question.category}
        </Descriptions.Item>
      </Descriptions>

      <Divider orientation="left">Answer Details</Divider>
      {renderOptions()}
    </Modal>
  );
};

export default ViewQuestionModal;