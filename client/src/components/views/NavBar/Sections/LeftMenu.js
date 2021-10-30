import React from 'react';
import { Menu } from 'antd';
import { ImHome } from "react-icons/im";
import { GoDeviceCameraVideo } from "react-icons/go";

const SubMenu = Menu.SubMenu;
const MenuItemGroup = Menu.ItemGroup;

function LeftMenu(props) {
  return (
    <Menu mode={props.mode}>

      <Menu.Item key="main">
      <a href="/"><ImHome/>&nbsp;홈</a>
      </Menu.Item>
      <Menu.Item key="favorite">
        <a href="/favorite"><GoDeviceCameraVideo/>&nbsp;구독</a>
      </Menu.Item>
    </Menu>
  )
} 

export default LeftMenu