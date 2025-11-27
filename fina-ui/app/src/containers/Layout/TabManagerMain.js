import { useHistory, useLocation } from "react-router-dom";
import React, { useEffect, useState } from "react";
import { getCommunicatorMenus, getMenus } from "../../api/ui/menu";
import Iframe from "../../components/Iframe";
import PropTypes from "prop-types";

const TabManagerMain = ({ config, tabs, setTabs, dataMenu }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.pathname);
  const history = useHistory();

  useEffect(() => {
    if (location.pathname === "/") {
      history.push("/dashboard");
      return;
    }
    const activeTabPath = "/" + location.pathname.split("/")[1];
    setActiveTab(activeTabPath);
    // During redirects, the current tab may not be in the DOM.
    if (!tabs.some((t) => t.path === activeTabPath)) {
      const newTab = dataMenu.find((dm) => dm.link === activeTabPath);
      if (!newTab) return;
      setTabs([
        ...tabs,
        { path: newTab.link, component: newTab.component, item: newTab },
      ]);
    }
  }, [location]);

  const renderMenuItem = (menuLink, component) => {
    const permittedMenus = config.menu;
    const menuItem = [
      ...getMenus(permittedMenus),
      ...getCommunicatorMenus(config),
    ].find((mi) => mi.link.toLowerCase() === menuLink.toLowerCase());

    if (!menuItem) {
      return <>No Permission</>;
    }
    const hasPermission =
      menuItem?.permissions.length === 0 ||
      config.permissions.some((cs) => menuItem.permissions.includes(cs));

    return hasPermission ? component : <>No Permission</>;
  };

  return (
    <div
      style={{
        height: "100%",
      }}
    >
      {tabs.map((tab) => {
        const Component = tab.component;

        const menuItem = tab.item;

        if (
          menuItem &&
          menuItem.iframeSrc &&
          menuItem.iframeSrc.trim().length > 0
        ) {
          const CreateIframe = () => {
            return (
              <Iframe
                src={`${window.location.origin}/fina-app/${menuItem.iframeSrc}`}
                title={menuItem.key}
              />
            );
          };
          tab.iframe = true;
          tab.component = CreateIframe();
        }

        return (
          <div
            id={tab.path}
            key={menuItem ? menuItem.key : "dashboard"}
            style={{
              height: "100%",
              display:
                tab.path.toLowerCase() === activeTab.toLowerCase()
                  ? "block"
                  : "none",
            }}
          >
            {tab.iframe
              ? tab.component
              : renderMenuItem(
                  activeTab,
                  <Component
                    key={menuItem ? menuItem.key : "dashboard"}
                    config={config}
                    menuItem={menuItem}
                  />
                )}
            {/*<Component config={config} />*/}
          </div>
        );
      })}
    </div>
  );
};

TabManagerMain.propTypes = {
  config: PropTypes.object.isRequired,
  tabs: PropTypes.array.isRequired,
  setTabs: PropTypes.func.isRequired,
  dataMenu: PropTypes.array.isRequired,
};

export default TabManagerMain;
