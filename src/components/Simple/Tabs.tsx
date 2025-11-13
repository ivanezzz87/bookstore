import React from "react";
import styled from "styled-components";

export interface Tab {
  label: string;
  value: string;
  content?: React.ReactNode;
}

interface TabsProps {
  tabs: Tab[];
  activeTab: string;
  onTabChange: (tabValue: string) => void;
  className?: string;
}

const TabsComponent: React.FC<TabsProps> = ({
  tabs,
  activeTab,
  onTabChange,
  className
}) => {
  return (
    <TabsContainer className={className}>
      <TabHeaders>
        {tabs.map((tab) => (
          <TabButton
            key={tab.value}
            active={activeTab === tab.value}
            onClick={() => onTabChange(tab.value)}
          >
            {tab.label}
          </TabButton>
        ))}
      </TabHeaders>
    </TabsContainer>
  );
};

const TabsContainer = styled.div`
  width: 100%;
  overflow: hidden;
  margin-bottom: 30px;
`;

const TabHeaders = styled.div`
  display: flex;
  background-color: var(--bg-color);
  border-bottom: 2px solid #e0e0e0;
  gap: 0;
`;

const TabButton = styled.button<{ active: boolean }>`
  padding: 12px 24px;
  color: ${(props) => (props.active ? "#2231AA" : "#8D8E97")};
  border: none;
  border-bottom: 2px solid ${(props) => (props.active ? "#2231AA" : "transparent")};
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: ${(props) => (props.active ? "600" : "400")};
  font-size: 16px;
  white-space: nowrap;
  min-width: 120px;

  &:hover {
    color: #2231AA;
    background-color: ${(props) => (props.active ? "#fff" : "#f8f9ff")};
  }

  &:active {
    transform: translateY(1px);
  }

  @media (max-width: 768px) {
    padding: 10px 16px;
    font-size: 14px;
    min-width: 100px;
  }

  @media (max-width: 480px) {
    padding: 8px 12px;
    font-size: 12px;
    min-width: auto;
    flex: 1;
  }
`;

export default TabsComponent;