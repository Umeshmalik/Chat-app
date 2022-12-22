import { useContext } from "react";
import { Navbar, Text, Button, User, Dropdown } from "@nextui-org/react";
import { useNavigate } from "react-router-dom";

import { UserContext } from "../context/userContext";

const { Menu, Item, Trigger } = Dropdown;

const AppNavbar = () => {
  const { user = null } = useContext(UserContext);
  const navigate = useNavigate();

  const signOut = (item) => {
    if(item === "$.0"){
      localStorage.clear("token");
      localStorage.clear("userInfo");
      navigate("/user/signin");
    }
  }

  return <Navbar isBordered variant="sticky" className="mb-5">
    <Navbar.Toggle className="invisible" />
    <Navbar.Brand>
      <Text h2 color="primary" weight="bold" size={40} onClick={() => navigate("/")} css={{ cursor: "pointer" }}>
        Let's Chat
      </Text>
    </Navbar.Brand>
    <Navbar.Content>
      {user?.token ?
        <Dropdown>
          <Trigger>
            <User
              bordered
              as="button"
              size="md"
              color="gradient"
              name={user?.name}
              description={user?.email || ""}
            />
          </Trigger>
          <Menu color="primary" aria-label="Actions" onAction={signOut}>
            <Item color="error" textValue={"Logout"} className="text-center"><Text color="error" >Sign Out</Text></Item>
          </Menu>
        </Dropdown>
        :
        <Button auto flat onPress={() => navigate("/user/signin")}>Sign In</Button>}
    </Navbar.Content>
  </Navbar>
}

export default AppNavbar;