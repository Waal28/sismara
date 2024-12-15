import * as React from "react";
import Box from "@mui/material/Box";
import Avatar from "@mui/material/Avatar";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import Tooltip from "@mui/material/Tooltip";
// import PersonAdd from "@mui/icons-material/PersonAdd";
// import Settings from "@mui/icons-material/Settings";
import Logout from "@mui/icons-material/Logout";
import SwitchDarkMode from "./SwitchDarkMode";
import { Typography } from "@mui/material";
import { useAdminState } from "@/context/AdminContext";
import { useRouter } from "next/navigation";
import { KeyRounded } from "@mui/icons-material";
import { useAppState } from "@/context/AppStateContext";
import ModalChangePassword from "./ModalChangePassword";

export default function MenuProfileAdmin() {
  const router = useRouter();
  const { updateAppState } = useAppState();
  const { currentAdmin, updateAdminState } = useAdminState();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleLogout = () => {
    // 1. Hapus token dari localStorage
    localStorage.removeItem("adminToken");

    // 2. Reset state login di aplikasi (optional)
    updateAdminState.isAdminLogin(false);
    updateAdminState.currentAdmin(null);

    // 4. Redirect ke halaman login
    router.push("/auth/login");
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  const handleOpenChangePassword = () => {
    updateAppState.modal({
      open: true,
      children: <ModalChangePassword handleLogout={handleLogout} />,
    });
    handleClose();
  };

  return (
    <React.Fragment>
      <Box sx={{ display: "flex", alignItems: "center", textAlign: "center" }}>
        <Typography className="hidden sm:block">
          {currentAdmin.username}
        </Typography>
        <Tooltip title="Menu Profile">
          <IconButton
            onClick={handleClick}
            size="small"
            sx={{ ml: 1 }}
            aria-controls={open ? "account-menu" : undefined}
            aria-haspopup="true"
            aria-expanded={open ? "true" : undefined}
          >
            <Avatar
              className="uppercase dark:bg-gray-800"
              sx={{ width: 32, height: 32 }}
            >
              {currentAdmin.username?.charAt(0)}
            </Avatar>
          </IconButton>
        </Tooltip>
      </Box>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 32,
              height: 32,
              ml: -0.5,
              mr: 1,
            },
            "&::before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        <Typography className="block sm:hidden text-center">
          <b>{currentAdmin.name}</b>
        </Typography>
        <Divider className="block sm:hidden" />
        <MenuItem>
          <div className="-ml-5">
            <SwitchDarkMode />
          </div>
        </MenuItem>
        {/* <MenuItem onClick={handleClose}>
          <Avatar /> Profil
        </MenuItem> */}
        {/* <MenuItem onClick={handleClose}>
          <Avatar /> My account
        </MenuItem> */}
        <Divider />
        <MenuItem onClick={handleOpenChangePassword}>
          <ListItemIcon>
            <KeyRounded fontSize="small" />
          </ListItemIcon>
          Ubah Password
        </MenuItem>
        <MenuItem onClick={handleLogout}>
          <ListItemIcon>
            <Logout fontSize="small" />
          </ListItemIcon>
          Logout
        </MenuItem>
      </Menu>
    </React.Fragment>
  );
}
