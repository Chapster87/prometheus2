import { useState } from 'react';
import MediaRow from './MediaRow';

export default function MediaRowTabs({ tabGroups }: MediaRowTabsProps) {
  const [activeTab, setActiveTab] = useState(0);

  return (
    (tabGroups &&
      <div role="tablist" className="tabs">
        <div className="tab-row flex">
          {tabGroups.map((tabContent: TabContent, index: number) => {
          const { title } = tabContent;
          return (
            <button
            key={index}
            className={`tab ${activeTab === index ? 'tab-active' : ''}`}
            role="tab"
            aria-label={title}
            onClick={() => setActiveTab(index)}
            >{title}</button>
          )
          })}
        </div>
        {tabGroups.map((tabContent: TabContent, index: number) => {
          const { mediaData } = tabContent;
          return (
            <div key={index} role="tabpanel" className={`tab-content ${activeTab === index ? 'tab-content-active' : ''}`}>
              <MediaRow mediaData={mediaData} />
            </div>
          )
        })}
      </div>
    )
  );
}

interface TabContent {
  title: string;
  mediaData: any;
}

interface MediaRowTabsProps {
  tabGroups: TabContent[];
}